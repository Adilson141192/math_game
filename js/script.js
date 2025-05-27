const questionEl = document.getElementById('question');
const form = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');
const progressEl = document.getElementById('progress');
const timerEl = document.getElementById('timer');
const feedbackEl = document.getElementById('feedback');
const yaySound = document.getElementById('yaySound');
const booSound = document.getElementById('booSound');

const menu = document.getElementById('menu');
const config = document.getElementById('config');
const game = document.getElementById('game');
const ranking = document.getElementById('ranking');

const rankingBody = document.getElementById('rankingBody');

let currentAnswer = 0;
let questionIndex = 0;
let totalTime = 0;
let errorCount = 0;
let startTime = null;
let timerInterval = null;
let selectedOps = ['+', '-', '×', '÷'];
let difficulty = 'easy';
let playerName = '';
let score = 0;

function showConfig() {
    menu.classList.add('hidden');
    config.classList.remove('hidden');
}

function showRanking() {
    menu.classList.add('hidden');
    ranking.classList.remove('hidden');
    renderRanking();
}

function backToMenu() {
    config.classList.add('hidden');
    game.classList.add('hidden');
    ranking.classList.add('hidden');
    menu.classList.remove('hidden');
}

function startGame() {
    const nameInput = document.getElementById('playerName');
    playerName = nameInput.value.trim();
    if (!playerName) {
        alert('Por favor, digite seu nome.');
        nameInput.focus();
        return;
    }
    difficulty = document.getElementById('level').value;
    selectedOps = Array.from(config.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
    if (selectedOps.length === 0) selectedOps = ['+', '-', '×', '÷'];

    config.classList.add('hidden');
    game.classList.remove('hidden');
    resetGame();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    const op = selectedOps[randomInt(0, selectedOps.length - 1)];
    let a, b, max;
    switch (difficulty) {
        case 'veryeasy': max = 5; break;
        case 'easy': max = 10; break;
        case 'medium': max = 20; break;
        case 'hard': max = 50; break;
        case 'veryhard': max = 100; break;
    }

    switch (op) {
        case '+':
            a = randomInt(1, max);
            b = randomInt(1, max);
            currentAnswer = a + b;
            break;
        case '-':
            a = randomInt(1, max);
            b = randomInt(1, a);
            currentAnswer = a - b;
            break;
        case '×':
            a = randomInt(1, Math.floor(max / 2));
            b = randomInt(1, Math.floor(max / 2));
            currentAnswer = a * b;
            break;
        case '÷':
            b = randomInt(1, Math.floor(max / 2));
            currentAnswer = randomInt(1, Math.floor(max / 2));
            a = currentAnswer * b;
            break;
    }

    questionEl.textContent = `${a} ${op} ${b} = ?`;
    answerInput.value = '';
    answerInput.focus();
    questionIndex++;
    progressEl.textContent = `Questão ${questionIndex} / 10`;
    startTimer();
}

function startTimer() {
    startTime = performance.now();
    timerInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        timerEl.textContent = `${elapsed.toFixed(1)} s`;
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
    const delta = (performance.now() - startTime) / 1000;
    totalTime += delta;
    timerEl.textContent = `${delta.toFixed(1)} s`;
}

function showFeedback(isCorrect) {
    feedbackEl.textContent = isCorrect ? '🎉' : '😢';
    feedbackEl.className = isCorrect ? 'happy' : 'sad';
    (isCorrect ? yaySound : booSound).play();
    setTimeout(() => {
        feedbackEl.className = '';
        feedbackEl.textContent = '';
    }, 800);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userValue = Number(answerInput.value);
    const correct = userValue === currentAnswer;
    stopTimer();
    showFeedback(correct);

    if (correct) {
        score += getScoreByDifficulty(difficulty);
        if (questionIndex === 10) {
            setTimeout(finishGame, 500);
        } else {
            setTimeout(generateQuestion, 600);
        }
    } else {
        errorCount++;
        answerInput.value = '';
        setTimeout(() => {
            answerInput.focus();
            startTimer();
        }, 600);
    }
});

function resetGame() {
    questionIndex = 0;
    totalTime = 0;
    errorCount = 0;
    score = 0;
    generateQuestion();
}

function finishGame() {
    saveScore();
    alert(`Parabéns, ${playerName}!
Tempo total: ${totalTime.toFixed(1)} segundos.
Erros: ${errorCount}
Pontuação: ${score}`);
    backToMenu();
}

function getScoreByDifficulty(lvl) {
    switch (lvl) {
        case 'veryeasy': return 1;
        case 'easy': return 2;
        case 'medium': return 3;
        case 'hard': return 4;
        case 'veryhard': return 5;
        default: return 0;
    }
}

function saveScore() {
    const data = {
        name: playerName,
        difficulty,
        time: parseFloat(totalTime.toFixed(1)),
        errors: errorCount,
        score
    };
    const rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    rankings.push(data);
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

function renderRanking() {
    const rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    rankings.sort((a, b) => b.score - a.score || a.time - b.time || a.errors - b.errors);
    rankingBody.innerHTML = rankings.map(r =>
        `<tr><td>${r.name}</td><td>${translateLevel(r.difficulty)}</td><td>${r.time}</td><td>${r.errors}</td><td>${r.score}</td></tr>`
    ).join('') || '<tr><td colspan="5">Sem registros ainda.</td></tr>';
}

function clearRanking() {
    if (confirm('Tem certeza que deseja limpar o ranking?')) {
        localStorage.removeItem('rankings');
        renderRanking();
    }
}

function translateLevel(lvl) {
    switch (lvl) {
        case 'veryeasy': return 'Muito fácil';
        case 'easy': return 'Fácil';
        case 'medium': return 'Médio';
        case 'hard': return 'Difícil';
        case 'veryhard': return 'Muito difícil';
        default: return lvl;
    }
}
