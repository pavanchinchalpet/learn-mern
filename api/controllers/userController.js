const User = require('../models/User');
const Score = require('../models/Score');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }
    
    if (avatar) {
      user.avatar = avatar;
    }
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        level: user.level,
        badges: user.badges,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get leaderboard
// @route   GET /api/user/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;
    
    let pipeline = [
      {
        $lookup: {
          from: 'scores',
          localField: '_id',
          foreignField: 'userId',
          as: 'scores'
        }
      },
      {
        $addFields: {
          totalPoints: { $sum: '$scores.pointsEarned' },
          totalQuizzes: { $size: '$scores' },
          averageScore: {
            $cond: {
              if: { $gt: [{ $size: '$scores' }, 0] },
              then: { $avg: '$scores.score' },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          username: 1,
          points: 1,
          level: 1,
          badges: 1,
          avatar: 1,
          totalPoints: 1,
          totalQuizzes: 1,
          averageScore: 1
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: parseInt(limit) }
    ];
    
    if (category) {
      pipeline.unshift({
        $lookup: {
          from: 'scores',
          localField: '_id',
          foreignField: 'userId',
          as: 'scores'
        }
      });
      
      pipeline.push({
        $match: {
          'scores.quiz.category': category
        }
      });
    }
    
    const leaderboard = await User.aggregate(pipeline);
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get recent scores
    const recentScores = await Score.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('quizId', 'category difficulty');
    
    // Get category performance
    const categoryStats = await Score.aggregate([
      { $match: { userId: req.user.id } },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      {
        $group: {
          _id: '$quiz.category',
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalPoints: { $sum: '$pointsEarned' }
        }
      }
    ]);
    
    // Get streak information
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentActivity = await Score.find({
      userId: req.user.id,
      createdAt: { $gte: yesterday }
    });
    
    const stats = {
      user: {
        points: user.points,
        level: user.level,
        badges: user.badges,
        totalQuizzes: user.totalQuizzes,
        accuracy: user.getAccuracy(),
        streak: user.streak
      },
      recentScores,
      categoryStats,
      recentActivity: recentActivity.length > 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user achievements
// @route   GET /api/user/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const achievements = [
      {
        id: 'first-quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        earned: user.totalQuizzes > 0,
        icon: '🎯'
      },
      {
        id: 'perfect-score',
        name: 'Perfect Score',
        description: 'Get 100% on any quiz',
        earned: user.badges.includes('Perfect Score'),
        icon: '⭐'
      },
      {
        id: 'quiz-master',
        name: 'Quiz Master',
        description: 'Answer 50 questions correctly',
        earned: user.badges.includes('Quiz Master'),
        icon: '👑'
      },
      {
        id: 'streak-king',
        name: 'Streak King',
        description: 'Maintain a 7-day streak',
        earned: user.badges.includes('Streak King'),
        icon: '🔥'
      },
      {
        id: 'level-5',
        name: 'Level 5',
        description: 'Reach level 5',
        earned: user.level >= 5,
        icon: '🏆'
      },
      {
        id: 'level-10',
        name: 'Level 10',
        description: 'Reach level 10',
        earned: user.level >= 10,
        icon: '💎'
      }
    ];
    
    res.json(achievements);
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getLeaderboard,
  getUserStats,
  getUserAchievements
};
