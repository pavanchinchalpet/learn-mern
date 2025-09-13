const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Quiz Master', 'Streak King', 'Perfect Score', 'Admin', 'First Quiz']
  }],
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: 'default'
  },
  totalQuizzes: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalAnswers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate accuracy
userSchema.methods.getAccuracy = function() {
  if (this.totalAnswers === 0) return 0;
  return Math.round((this.correctAnswers / this.totalAnswers) * 100);
};

module.exports = mongoose.model('User', userSchema);
