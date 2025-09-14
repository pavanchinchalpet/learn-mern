const express = require('express');
const { auth } = require('../middleware/auth');
const { 
  getUserProfile, 
  updateUserProfile, 
  getLeaderboard, 
  getUserStats, 
  getUserAchievements 
} = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateUserProfile);

// @route   GET /api/user/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', getLeaderboard);

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, getUserStats);

// @route   GET /api/user/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, getUserAchievements);

module.exports = router;
