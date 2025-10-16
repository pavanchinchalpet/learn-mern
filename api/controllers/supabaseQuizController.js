const { validationResult } = require('express-validator');
const { quizHelpers } = require('../utils/supabaseHelpers');

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Public
const getQuizzes = async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (limit) filters.limit = parseInt(limit);
    
    const { data: quizzes, error } = await quizHelpers.getAllQuizzes(filters);
    
    if (error) {
      console.error('Get quizzes error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Remove answers from response
    const sanitizedQuizzes = quizzes.map(quiz => {
      const { answer, ...quizWithoutAnswer } = quiz;
      return quizWithoutAnswer;
    });
    
    res.json(sanitizedQuizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quiz/:id
// @access  Public
const getQuizById = async (req, res) => {
  try {
    const { data: quiz, error } = await quizHelpers.getQuizById(req.params.id);
    
    if (error) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    if (!quiz.is_active) {
      return res.status(404).json({ message: 'Quiz is not active' });
    }
    
    // Remove answer from response
    const { answer, ...quizWithoutAnswer } = quiz;
    res.json(quizWithoutAnswer);
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get quiz categories
// @route   GET /api/quiz/categories
// @access  Public
const getQuizCategories = async (req, res) => {
  try {
    const { data: categories, error } = await quizHelpers.getQuizCategories();
    
    if (error) {
      console.error('Get categories error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Support both quiz_categories table shape and derived-from-quizzes shape
    const transformedCategories = categories.map(cat => {
      // If coming from quiz_categories table
      if (cat.name) {
        const count = cat.count || 0;
        return {
          id: cat.id,
          title: cat.name,
          description: cat.description || `Test your ${cat.name} knowledge`,
          category: cat.name,
          difficulty: undefined,
          questions: count,
          timeLimit: Math.ceil(count * 1.5),
          xp: count * 10,
          icon: cat.icon || getCategoryIcon(cat.name),
          color: cat.color
        };
      }
      // Fallback from quizzes-derived aggregation
      const count = cat.count || 0;
      return {
        id: cat.category.toLowerCase().replace(/\s+/g, '-'),
        title: cat.category,
        description: `Test your ${cat.category} knowledge`,
        category: cat.category,
        difficulty: cat.difficulty,
        questions: count,
        timeLimit: Math.ceil(count * 1.5),
        xp: count * 10,
        icon: getCategoryIcon(cat.category)
      };
    });
    
    res.json(transformedCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { answers, timeTaken } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }

    const { data: result, error } = await quizHelpers.submitQuizAnswers(userId, answers, timeTaken);

    if (error) {
      console.error('Submit quiz error:', error);
      return res.status(500).json({ message: 'Error submitting quiz' });
    }

    res.json(result);
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get quiz statistics
// @route   GET /api/quiz/stats
// @access  Public
const getQuizStats = async (req, res) => {
  try {
    const { data: quizzes, error } = await quizHelpers.getAllQuizzes();
    
    if (error) {
      console.error('Get quiz stats error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    const stats = {
      totalQuizzes: quizzes.length,
      categories: {},
      difficulties: {},
      totalQuestions: quizzes.length
    };
    
    quizzes.forEach(quiz => {
      // Count by category
      if (!stats.categories[quiz.category]) {
        stats.categories[quiz.category] = 0;
      }
      stats.categories[quiz.category]++;
      
      // Count by difficulty
      if (!stats.difficulties[quiz.difficulty]) {
        stats.difficulties[quiz.difficulty] = 0;
      }
      stats.difficulties[quiz.difficulty]++;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'JavaScript': '🟨',
    'Node.js': '🟢',
    'MongoDB': '🍃',
    'Express': '⚡',
    'React': '⚛️',
    'MERN': '🚀',
    'Authentication': '🔐',
    'Performance': '⚡',
    'Deployment': '🚀'
  };
  return icons[category] || '📚';
};

module.exports = {
  getQuizzes,
  getQuizById,
  getQuizCategories,
  submitQuiz,
  getQuizStats
};
