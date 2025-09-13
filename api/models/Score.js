const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  timeTaken: {
    type: Number,
    required: true,
    min: 0
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    selectedAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  streak: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
scoreSchema.index({ userId: 1, createdAt: -1 });
scoreSchema.index({ quizId: 1, score: -1 });

// Method to calculate percentage
scoreSchema.methods.getPercentage = function() {
  if (this.totalQuestions === 0) return 0;
  return Math.round((this.correctAnswers / this.totalQuestions) * 100);
};

module.exports = mongoose.model('Score', scoreSchema);
