const express = require('express');
const { body } = require('express-validator');
const { adminAuth } = require('../middleware/auth');
const supabase = require('../config/supabase');

const router = express.Router();

// @route   POST /api/admin/quiz
// @desc    Create new quiz
// @access  Admin
router.post('/quiz', adminAuth, [
  body('question').notEmpty().withMessage('Question is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
  body('answer').notEmpty().withMessage('Answer is required'),
  body('category').isIn(['JavaScript', 'Node.js', 'MongoDB', 'Express', 'React', 'MERN', 'Authentication', 'Performance', 'Deployment']).withMessage('Invalid category'),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty')
], async (req, res) => {
  try {
    const { question, options, answer, category, difficulty, explanation, points = 10 } = req.body;
    
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert({
        question,
        options,
        answer,
        category,
        difficulty,
        explanation,
        points
      })
      .select()
      .single();
    
    if (error) {
      console.error('Create quiz error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
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
    const { question, options, answer, category, difficulty, explanation, is_active, points } = req.body;
    
    const updates = {};
    if (question) updates.question = question;
    if (options) updates.options = options;
    if (answer) updates.answer = answer;
    if (category) updates.category = category;
    if (difficulty) updates.difficulty = difficulty;
    if (explanation !== undefined) updates.explanation = explanation;
    if (is_active !== undefined) updates.is_active = is_active;
    if (points !== undefined) updates.points = points;
    
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      console.error('Update quiz error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
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
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', req.params.id);
    
    if (error) {
      console.error('Delete quiz error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
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
    // Get counts
    const [usersResult, quizzesResult, scoresResult] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact' }),
      supabase.from('quizzes').select('*', { count: 'exact' }),
      supabase.from('quiz_scores').select('*', { count: 'exact' })
    ]);
    
    const totalUsers = usersResult.count || 0;
    const totalQuizzes = quizzesResult.count || 0;
    const totalScores = scoresResult.count || 0;
    
    // Get user stats
    const { data: userStats } = await supabase
      .from('users')
      .select('points, level');
    
    const avgPoints = userStats?.length ? userStats.reduce((sum, user) => sum + user.points, 0) / userStats.length : 0;
    const avgLevel = userStats?.length ? userStats.reduce((sum, user) => sum + user.level, 0) / userStats.length : 1;
    
    // Get quiz stats by category
    const { data: quizStats } = await supabase
      .from('quizzes')
      .select('category, times_answered, times_correct');
    
    const categoryStats = {};
    quizStats?.forEach(quiz => {
      if (!categoryStats[quiz.category]) {
        categoryStats[quiz.category] = { count: 0, totalAnswered: 0, totalCorrect: 0 };
      }
      categoryStats[quiz.category].count++;
      categoryStats[quiz.category].totalAnswered += quiz.times_answered || 0;
      categoryStats[quiz.category].totalCorrect += quiz.times_correct || 0;
    });
    
    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('quiz_scores')
      .select(`
        *,
        users!inner(username),
        quizzes!inner(category, difficulty)
      `)
      .order('attempted_at', { ascending: false })
      .limit(10);
    
    res.json({
      overview: {
        totalUsers,
        totalQuizzes,
        totalScores,
        avgPoints: Math.round(avgPoints),
        avgLevel: Math.round(avgLevel)
      },
      quizStats: Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        count: stats.count,
        avgSuccessRate: stats.totalAnswered > 0 ? stats.totalCorrect / stats.totalAnswered : 0
      })),
      recentActivity: recentActivity?.map(activity => ({
        id: activity.id,
        score: activity.score,
        attemptedAt: activity.attempted_at,
        username: activity.users?.username,
        category: activity.quizzes?.category,
        difficulty: activity.quizzes?.difficulty
      })) || []
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
    const offset = (page - 1) * limit;
    
    const { data: users, count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    res.json({
      users: users || [],
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;