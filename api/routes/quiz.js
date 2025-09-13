const express = require('express');
const { auth } = require('../middleware/auth');
const { 
  getQuizzes, 
  getQuizById, 
  submitQuiz, 
  getQuizStats 
} = require('../controllers/quizController');

const router = express.Router();

// @route   GET /api/quiz
// @desc    Get all quizzes
// @access  Public
router.get('/', getQuizzes);

// @route   GET /api/quiz/:id
// @desc    Get quiz by ID
// @access  Public
router.get('/:id', getQuizById);

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/submit', auth, submitQuiz);

// @route   GET /api/quiz/stats
// @desc    Get quiz statistics
// @access  Private
router.get('/stats', auth, getQuizStats);

module.exports = router;
