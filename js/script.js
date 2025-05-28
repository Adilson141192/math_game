const questionEl = document.getElementById('question');
const form = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');
const progressEl = document.getElementById('progress');
const extraCountEl = document.getElementById('extraCount');
const extraQuestionsEl = document.getElementById('extraQuestions');
const timerEl = document.getElementById('timer');
const feedbackEl = document.getElementById('feedback');
const yaySound = document.getElementById('yaySound');
const booSound = document.getElementById('booSound');

const menu = document.getElementById('menu');
const config = document.getElementById('config');
const game = document.getElementById('game');
const ranking = document.getElementById('ranking');

const rankingBody = document.getElementById('rankingBody');

// Configurações
const QUESTIONS_PER_GAME = 20;
const MAX_TIME_PER_QUESTION = 30000;

// Estado do jogo
let currentAnswer = 0;
let questionIndex = 0;
let totalTime = 0;
let errorCount = 0;
let startTime = null;
let timerInterval = null;
let questionTimeout = null;
let selectedOps = ['+', '-', '×', '÷'];
let difficulty = 'easy';
let playerName = '';
let score = 0;
let extraQuestionCount = 0;

// Navegação
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
    resetGame();
}

// Jogo
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
    if (questionTimeout) clearTimeout(questionTimeout);
    
    // Atualiza UI de perguntas extras
    if (extraQuestionCount > 0) {
        extraCountEl.textContent = extraQuestionCount;
        extraQuestionsEl.classList.remove('hidden');
        progressEl.textContent = `Questão Extra (${extraQuestionCount})`;
    } else {
        extraQuestionsEl.classList.add('hidden');
        questionIndex++;
        progressEl.textContent = `Questão ${questionIndex} / ${QUESTIONS_PER_GAME}`;
    }

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
    startTimer();
    
    questionTimeout = setTimeout(() => {
        handleTimeout();
    }, MAX_TIME_PER_QUESTION);
}

function handleTimeout() {
    stopTimer();
    showFeedback(false);
    errorCount++;
    answerInput.value = '';
    
    // Adiciona pergunta extra se for uma pergunta normal
    if (extraQuestionCount === 0 && questionIndex <= QUESTIONS_PER_GAME) {
        extraQuestionCount++;
    }
    
    setTimeout(generateQuestion, 2000);
}

function startTimer() {
    startTime = performance.now();
    timerInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        timerEl.textContent = `${elapsed.toFixed(1)} s`;
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
    const delta = (performance.now() - startTime) / 1000;
    totalTime += delta;
    timerEl.textContent = `${delta.toFixed(1)} s`;
}

function showFeedback(isCorrect) {
    feedbackEl.innerHTML = isCorrect ? '<div>🎉</div>' : '<div>😢</div>';
    feedbackEl.className = isCorrect ? 'happy' : 'sad';
    (isCorrect ? yaySound : booSound).play();
    
    if (!isCorrect) {
        const helpDiv = document.createElement('div');
        helpDiv.className = 'help';
        helpDiv.innerHTML = `Resposta correta: <strong>${currentAnswer}</strong>`;
        feedbackEl.appendChild(helpDiv);
    }
    
    setTimeout(() => {
        feedbackEl.className = '';
        feedbackEl.innerHTML = '';
    }, isCorrect ? 800 : 2000);
}

// Event listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userValue = Number(answerInput.value);
    const correct = userValue === currentAnswer;
    stopTimer();
    clearTimeout(questionTimeout);
    
    showFeedback(correct);

    if (correct) {
        score += getScoreByDifficulty(difficulty);
        
        if (extraQuestionCount > 0) {
            extraQuestionCount--;
            setTimeout(generateQuestion, 800);
        } else if (questionIndex >= QUESTIONS_PER_GAME) {
            setTimeout(finishGame, 500);
        } else {
            setTimeout(generateQuestion, 800);
        }
    } else {
        errorCount++;
        // Adiciona pergunta extra quando erra (apenas para perguntas normais)
        if (extraQuestionCount === 0 && questionIndex <= QUESTIONS_PER_GAME) {
            extraQuestionCount = 1;
        }
        answerInput.value = '';
        setTimeout(() => answerInput.focus(), 800);
    }
});

// Finalização do jogo
function resetGame() {
    questionIndex = 0;
    totalTime = 0;
    errorCount = 0;
    score = 0;
    extraQuestionCount = 0;
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

// Ranking
function saveScore() {
    const data = {
        name: playerName,
        difficulty,
        time: parseFloat(totalTime.toFixed(1)),
        errors: errorCount,
        score,
        gamesPlayed: 1
    };
    
    let rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    const existingPlayerIndex = rankings.findIndex(r => r.name === playerName);
    
    if (existingPlayerIndex !== -1) {
        // Sempre incrementa o contador, mesmo que não seja o melhor score
        rankings[existingPlayerIndex].gamesPlayed += 1;
        
        // Atualiza apenas se for um score melhor
        if (score > rankings[existingPlayerIndex].score) {
            rankings[existingPlayerIndex] = { 
                ...data, 
                gamesPlayed: rankings[existingPlayerIndex].gamesPlayed 
            };
        }
    } else {
        rankings.push(data);
    }
    
    rankings.sort((a, b) => b.score - a.score || a.time - b.time || a.errors - b.errors);
    rankings = rankings.slice(0, 10);
    localStorage.setItem('rankings', JSON.stringify(rankings));
}

function renderRanking() {
    const rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    rankings.sort((a, b) => b.score - a.score || a.time - b.time || a.errors - b.errors);
    
    const averageScore = rankings.length > 0 
        ? rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length 
        : 0;
    
    rankingBody.innerHTML = rankings.map(r =>
        `<tr>
            <td>${r.name}</td>
            <td>${translateLevel(r.difficulty)}</td>
            <td>${r.time}</td>
            <td>${r.errors}</td>
            <td>${r.score}</td>
            <td>${r.gamesPlayed || 1}</td>
        </tr>`
    ).join('') || '<tr><td colspan="6">Sem registros ainda.</td></tr>';
    
    if (rankings.length > 0) {
        rankingBody.innerHTML += `
        <tr class="average-row">
            <td colspan="4">Média dos Top 10</td>
            <td>${averageScore.toFixed(1)}</td>
            <td></td>
        </tr>`;
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
