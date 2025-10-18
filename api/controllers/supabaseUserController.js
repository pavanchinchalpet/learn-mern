const { userHelpers } = require('../utils/supabaseHelpers');
const supabase = require('../config/supabase');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const { data: user, error } = await userHelpers.getUserById(userId);
    
    if (error) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      streak: user.streak,
      isAdmin: user.is_admin,
      totalQuizzes: user.total_quizzes,
      correctAnswers: user.correct_answers,
      totalAnswers: user.total_answers,
      learningStyle: user.learning_style,
      difficultyPreference: user.difficulty_preference,
      emailNotifications: user.email_notifications,
      courseUpdates: user.course_updates,
      achievementAlerts: user.achievement_alerts,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
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
    const userId = req.user.userId;
    const { username, avatar, learningStyle, difficultyPreference, emailNotifications, courseUpdates, achievementAlerts } = req.body;
    
    const updates = {};
    
    // Check if username is already taken
    if (username) {
      const { data: existingUser } = await userHelpers.getUserByEmailOrUsername('', username);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      updates.username = username;
    }
    
    if (avatar) updates.avatar = avatar;
    if (learningStyle) updates.learning_style = learningStyle;
    if (difficultyPreference) updates.difficulty_preference = difficultyPreference;
    if (emailNotifications !== undefined) updates.email_notifications = emailNotifications;
    if (courseUpdates !== undefined) updates.course_updates = courseUpdates;
    if (achievementAlerts !== undefined) updates.achievement_alerts = achievementAlerts;
    
    const { data: updatedUser, error } = await userHelpers.updateUserProfile(userId, updates);
    
    if (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ message: 'Error updating profile' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        points: updatedUser.points,
        level: updatedUser.level,
        streak: updatedUser.streak,
        isAdmin: updatedUser.is_admin,
        learningStyle: updatedUser.learning_style,
        difficultyPreference: updatedUser.difficulty_preference,
        emailNotifications: updatedUser.email_notifications,
        courseUpdates: updatedUser.course_updates,
        achievementAlerts: updatedUser.achievement_alerts
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
    const { limit = 10 } = req.query;
    
    const { data: leaderboard, error } = await userHelpers.getLeaderboard(parseInt(limit));
    
    if (error) {
      console.error('Get leaderboard error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      points: user.points,
      level: user.level,
      avatar: user.avatar
    }));
    
    res.json(formattedLeaderboard);
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
    const userId = req.user.userId;
    
    const { data: user, error } = await userHelpers.getUserById(userId);
    
    if (error) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get quiz scores for this user
    const { data: quizScores, error: scoresError } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false });
    
    if (scoresError) {
      console.error('Error fetching quiz scores:', scoresError);
    }
    
    const stats = {
      totalQuizzes: user.total_quizzes || 0,
      correctAnswers: user.correct_answers || 0,
      totalAnswers: user.total_answers || 0,
      points: user.points || 0,
      level: user.level || 1,
      streak: user.streak || 0,
      accuracy: user.total_answers > 0 ? Math.round((user.correct_answers / user.total_answers) * 100) : 0,
      recentScores: quizScores ? quizScores.slice(0, 10).map(score => ({
        score: score.score,
        timeTaken: score.time_taken,
        correctAnswers: score.correct_answers,
        totalQuestions: score.total_questions,
        pointsEarned: score.points_earned,
        attemptedAt: score.attempted_at
      })) : []
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user achievements/badges
// @route   GET /api/user/achievements
// @access  Private
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if badges tables exist, if not return mock achievements
    try {
      // Try to get user badges
      const { data: userBadges, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (*)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });
      
      if (error) {
        console.log('Badges tables not found, returning mock achievements');
        return getMockAchievements(res);
      }
      
      // Get all available badges
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .order('points_required', { ascending: true });
      
      if (badgesError) {
        console.log('Badges table not found, returning mock achievements');
        return getMockAchievements(res);
      }
      
      const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));
      
      const achievements = allBadges.map(badge => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        pointsRequired: badge.points_required,
        isEarned: earnedBadgeIds.has(badge.id),
        earnedAt: userBadges.find(ub => ub.badge_id === badge.id)?.earned_at || null
      }));
      
      res.json(achievements);
    } catch (tableError) {
      console.log('Badges tables not available, returning mock achievements');
      return getMockAchievements(res);
    }
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to return mock achievements when badges tables don't exist
const getMockAchievements = (res) => {
  const mockAchievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      pointsRequired: 0,
      isEarned: true,
      earnedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Quiz Master",
      description: "Score 100% on any quiz",
      icon: "🏆",
      pointsRequired: 50,
      isEarned: false,
      earnedAt: null
    },
    {
      id: 3,
      name: "Speed Demon",
      description: "Complete a quiz in under 2 minutes",
      icon: "⚡",
      pointsRequired: 100,
      isEarned: false,
      earnedAt: null
    },
    {
      id: 4,
      name: "Knowledge Seeker",
      description: "Complete 10 quizzes",
      icon: "📚",
      pointsRequired: 200,
      isEarned: false,
      earnedAt: null
    },
    {
      id: 5,
      name: "MERN Expert",
      description: "Master all MERN stack topics",
      icon: "🚀",
      pointsRequired: 500,
      isEarned: false,
      earnedAt: null
    }
  ];
  
  res.json(mockAchievements);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getLeaderboard,
  getUserStats,
  getUserAchievements
};
