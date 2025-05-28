const UI = {
  elements: {
    questionEl: document.getElementById('question'),
    form: document.getElementById('answerForm'),
    answerInput: document.getElementById('answerInput'),
    progressEl: document.getElementById('progress'),
    extraCountEl: document.getElementById('extraCount'),
    extraQuestionsEl: document.getElementById('extraQuestions'),
    timerEl: document.getElementById('timer'),
    feedbackEl: document.getElementById('feedback'),
    yaySound: document.getElementById('yaySound'),
    booSound: document.getElementById('booSound'),
    // ... outros elementos
  },

  renderQuestion(text) {
    this.elements.questionEl.textContent = text;
    this.elements.answerInput.value = '';
    this.elements.answerInput.focus();
  },

  updateProgress(current, total, extraCount, isTraining) {
    this.elements.progressEl.style.visibility = isTraining ? 'hidden' : 'visible';
    if (extraCount > 0) {
      this.elements.extraCountEl.textContent = extraCount;
      this.elements.extraQuestionsEl.classList.remove('hidden');
      this.elements.progressEl.textContent = `Questão Extra (${extraCount})`;
    } else {
      this.elements.extraQuestionsEl.classList.add('hidden');
      this.elements.progressEl.textContent = `Questão ${current} / ${total}`;
    }
  },

  showFeedback(isCorrect, correctAnswer, showHelp) {
    const el = this.elements.feedbackEl;
    el.innerHTML = isCorrect ? '<div>🎉</div>' : '<div>😢</div>';
    el.className = isCorrect ? 'happy' : 'sad';
    (isCorrect ? this.elements.yaySound : this.elements.booSound).play();

    if (!isCorrect && showHelp) {
      const helpDiv = document.createElement('div');
      helpDiv.className = 'help';
      helpDiv.innerHTML = `Resposta correta: <strong>${correctAnswer}</strong>`;
      el.appendChild(helpDiv);
    }

    setTimeout(() => {
      el.className = '';
      el.innerHTML = '';
    }, isCorrect ? 800 : 2000);
  },

  // funções para timer, mostrar rankings, mostrar/ocultar telas etc...
};
