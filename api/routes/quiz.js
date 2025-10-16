const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizStats,
  getQuizCategories
} = require('../controllers/supabaseQuizController');

const router = express.Router();

// @route   GET /api/quiz
// @desc    Get all quizzes
// @access  Public
router.get('/', getQuizzes);

// @route   GET /api/quiz/categories
// @desc    Get quiz categories with stats
// @access  Public
router.get('/categories', getQuizCategories);

// @route   GET /api/quiz/stats
// @desc    Get quiz statistics
// @access  Private
router.get('/stats', auth, getQuizStats);

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/submit', [
  auth,
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be a non-empty array'),
  body('answers.*.questionId')
    .isUUID()
    .withMessage('Each answer must have a valid questionId'),
  body('answers.*.selectedAnswer')
    .notEmpty()
    .withMessage('Each answer must have a selectedAnswer'),
  body('timeTaken')
    .isInt({ min: 0 })
    .withMessage('Time taken must be a positive integer')
], submitQuiz);

// @route   GET /api/quiz/:id
// @desc    Get quiz by ID
// @access  Public
router.get('/:id', getQuizById);

module.exports = router;
