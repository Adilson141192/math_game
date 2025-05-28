const App = {
  playerName: '',
  difficulty: 'easy',
  selectedOps: ['+', '-', '×', '÷'],
  isTraining: false,
  showHelp: true,

  startGame() {
    const nameInput = document.getElementById('playerName');
    this.playerName = nameInput.value.trim();
    if (!this.playerName) {
      alert('Por favor, digite seu nome.');
      nameInput.focus();
      return;
    }
    this.difficulty = document.getElementById('level').value;
    this.selectedOps = Array.from(document.querySelectorAll('#config input[type=checkbox]:checked')).map(cb => cb.value);
    if (this.selectedOps.length === 0) this.selectedOps = ['+', '-', '×', '÷'];
    this.showHelp = document.getElementById('helpCheckbox').checked;

    GameEngine.difficulty = this.difficulty;
    GameEngine.selectedOps = this.selectedOps;
    GameEngine.isTraining = false;

    UI.elements.game.classList.remove('hidden');
    UI.elements.config.classList.add('hidden');

    GameEngine.reset();
    this.nextQuestion();
  },

  startTraining() {
    this.isTraining = true;
    this.playerName = 'Treino';
    this.difficulty = 'easy';
    this.selectedOps = ['+', '-', '×', '÷'];
    this.showHelp = true;

    GameEngine.difficulty = this.difficulty;
    GameEngine.selectedOps = this.selectedOps;
    GameEngine.isTraining = true;

    UI.elements.quitTrainingBtn.classList.remove('hidden');
    UI.elements.menu.classList.add('hidden');
    UI.elements.game.classList.remove('hidden');

    GameEngine.reset();
    this.nextQuestion();
  },

  nextQuestion() {
    const q = GameEngine.generateQuestion();
    UI.renderQuestion(q.questionText);
    UI.updateProgress(GameEngine.questionIndex + 1, GameEngine.QUESTIONS_PER_GAME, GameEngine.extraQuestionCount, GameEngine.isTraining);
    // Aqui você pode iniciar o timer, etc
  },

  // lógica para submissão da resposta, timer, feedback, fim de jogo...
};
