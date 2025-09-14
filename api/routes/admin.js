const express = require('express');
const { body } = require('express-validator');
const { adminAuth } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Score = require('../models/Score');

const router = express.Router();

// @route   POST /api/admin/quiz
// @desc    Create new quiz
// @access  Admin
router.post('/quiz', adminAuth, [
  body('question').notEmpty().withMessage('Question is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
  body('answer').notEmpty().withMessage('Answer is required'),
  body('category').isIn(['MongoDB', 'Express', 'React', 'Node']).withMessage('Invalid category'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty')
], async (req, res) => {
  try {
    const { question, options, answer, category, difficulty, explanation } = req.body;
    
    const quiz = new Quiz({
      question,
      options,
      answer,
      category,
      difficulty,
      explanation
    });
    
    await quiz.save();
    
    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/quiz/:id
// @desc    Update quiz
// @access  Admin
router.put('/quiz/:id', adminAuth, async (req, res) => {
  try {
    const { question, options, answer, category, difficulty, explanation, isActive } = req.body;
    
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    if (question) quiz.question = question;
    if (options) quiz.options = options;
    if (answer) quiz.answer = answer;
    if (category) quiz.category = category;
    if (difficulty) quiz.difficulty = difficulty;
    if (explanation !== undefined) quiz.explanation = explanation;
    if (isActive !== undefined) quiz.isActive = isActive;
    
    await quiz.save();
    
    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/quiz/:id
// @desc    Delete quiz
// @access  Admin
router.delete('/quiz/:id', adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    await quiz.remove();
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics
// @access  Admin
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalScores = await Score.countDocuments();
    
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          avgPoints: { $avg: '$points' },
          avgLevel: { $avg: '$level' },
          totalBadges: { $sum: { $size: '$badges' } }
        }
      }
    ]);
    
    const quizStats = await Quiz.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgSuccessRate: { $avg: { $divide: ['$timesCorrect', { $max: ['$timesAnswered', 1] }] } }
        }
      }
    ]);
    
    const recentActivity = await Score.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'username')
      .populate('quizId', 'category difficulty');
    
    res.json({
      overview: {
        totalUsers,
        totalQuizzes,
        totalScores,
        avgPoints: userStats[0]?.avgPoints || 0,
        avgLevel: userStats[0]?.avgLevel || 1
      },
      quizStats,
      recentActivity
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
