const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['JavaScript', 'Node.js', 'MongoDB', 'Express', 'React', 'MERN', 'Authentication', 'Performance', 'Deployment'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: function() {
      switch(this.difficulty) {
        case 'beginner': return 10;
        case 'intermediate': return 15;
        case 'advanced': return 20;
        default: return 10;
      }
    }
  },
  timesAnswered: {
    type: Number,
    default: 0
  },
  timesCorrect: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to calculate success rate
quizSchema.methods.getSuccessRate = function() {
  if (this.timesAnswered === 0) return 0;
  return Math.round((this.timesCorrect / this.timesAnswered) * 100);
};

module.exports = mongoose.model('Quiz', quizSchema);
