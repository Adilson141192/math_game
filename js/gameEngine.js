const GameEngine = {
  QUESTIONS_PER_GAME: 20,
  MAX_TIME_PER_QUESTION: 30000,

  currentAnswer: 0,
  questionIndex: 0,
  totalTime: 0,
  errorCount: 0,
  score: 0,
  extraQuestionCount: 0,

  selectedOps: ['+', '-', '×', '÷'],
  difficulty: 'easy',
  isTraining: false,

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getScoreByDifficulty(lvl) {
    switch (lvl) {
      case 'veryeasy': return 1;
      case 'easy': return 2;
      case 'medium': return 3;
      case 'hard': return 4;
      case 'veryhard': return 5;
      default: return 0;
    }
  },

  generateQuestion() {
    const op = this.selectedOps[this.randomInt(0, this.selectedOps.length - 1)];
    let a, b, max;
    switch (this.difficulty) {
      case 'veryeasy': max = 5; break;
      case 'easy': max = 10; break;
      case 'medium': max = 20; break;
      case 'hard': max = 50; break;
      case 'veryhard': max = 100; break;
    }

    switch (op) {
      case '+': a = this.randomInt(1, max); b = this.randomInt(1, max); this.currentAnswer = a + b; break;
      case '-': a = this.randomInt(1, max); b = this.randomInt(1, a); this.currentAnswer = a - b; break;
      case '×': a = this.randomInt(1, max / 2); b = this.randomInt(1, max / 2); this.currentAnswer = a * b; break;
      case '÷': b = this.randomInt(1, max / 2); this.currentAnswer = this.randomInt(1, max / 2); a = this.currentAnswer * b; break;
    }

    return { questionText: `${a} ${op} ${b} = ?`, answer: this.currentAnswer };
  },

  reset() {
    this.questionIndex = 0;
    this.totalTime = 0;
    this.errorCount = 0;
    this.score = 0;
    this.extraQuestionCount = 0;
    this.currentAnswer = 0;
  },

  saveScore(playerName) {
    // código de salvar no localStorage (igual ao seu)
  },
  
  // Outros métodos puros relacionados ao jogo...
};
