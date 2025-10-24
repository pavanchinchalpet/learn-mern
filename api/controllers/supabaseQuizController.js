const { validationResult } = require('express-validator');
const { quizHelpers } = require('../utils/supabaseHelpers');

// Utility function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// @desc    Get all quizzes with randomization
// @route   GET /api/quiz
// @access  Public
const getQuizzes = async (req, res) => {
  try {
    const { category, difficulty, limit = 10, randomize = true } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (limit) filters.limit = parseInt(limit);
    
    const { data: quizzes, error } = await quizHelpers.getAllQuizzes(filters);
    
    if (error) {
      console.error('Get quizzes error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Randomize quiz order if requested
    let processedQuizzes = quizzes;
    if (randomize === 'true' || randomize === true) {
      processedQuizzes = shuffleArray([...quizzes]);
    }
    
    // Remove answers from response
    const sanitizedQuizzes = processedQuizzes.map(quiz => {
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

// @desc    Get quiz questions by quiz ID with randomization
// @route   GET /api/quiz/:id/questions
// @access  Public
const getQuizQuestions = async (req, res) => {
  try {
    const { randomize = true, limit } = req.query;
    const { data: questions, error } = await quizHelpers.getQuizQuestions(req.params.id);
    
    if (error) {
      console.error('Get quiz questions error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
    
    // Randomize questions if requested
    let processedQuestions = questions;
    if (randomize === 'true' || randomize === true) {
      processedQuestions = shuffleArray([...questions]);
    }
    
    // Limit questions if specified
    if (limit && parseInt(limit) > 0) {
      processedQuestions = processedQuestions.slice(0, parseInt(limit));
    }
    
    // Transform questions to match frontend expectations
    const transformedQuestions = processedQuestions.map(q => ({
      id: q.id,
      question: q.question_text,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      points: q.points || 10
    }));
    
    res.json(transformedQuestions);
  } catch (error) {
    console.error('Get quiz questions error:', error);
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

// @desc    Submit quiz answers with enhanced scoring
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

    console.log('🔵 [SUBMIT QUIZ] Processing submission for user:', userId);
    console.log('🔵 [SUBMIT QUIZ] Answers count:', answers.length);
    console.log('🔵 [SUBMIT QUIZ] Time taken:', timeTaken, 'seconds');

    const { data: result, error } = await quizHelpers.submitQuizAnswers(userId, answers, timeTaken);

    if (error) {
      console.error('🔴 [SUBMIT QUIZ] Error:', error);
      return res.status(500).json({ message: 'Error submitting quiz' });
    }

    // Enhanced result with additional analytics
    const enhancedResult = {
      ...result,
      analytics: {
        timePerQuestion: Math.round(timeTaken / answers.length),
        difficultyLevel: calculateDifficultyLevel(result.score),
        performanceRating: getPerformanceRating(result.score),
        improvementSuggestions: getImprovementSuggestions(result.score, result.correctAnswers, result.totalQuestions)
      },
      achievements: checkAchievements(result.score, timeTaken, answers.length),
      nextSteps: getNextSteps(result.score, result.category)
    };

    console.log('✅ [SUBMIT QUIZ] Submission successful:', {
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      pointsEarned: result.pointsEarned
    });

    res.json(enhancedResult);
  } catch (error) {
    console.error('🔴 [SUBMIT QUIZ] Unexpected error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper functions for enhanced scoring
const calculateDifficultyLevel = (score) => {
  if (score >= 90) return 'Expert';
  if (score >= 80) return 'Advanced';
  if (score >= 70) return 'Intermediate';
  if (score >= 60) return 'Beginner';
  return 'Needs Practice';
};

const getPerformanceRating = (score) => {
  if (score >= 95) return { rating: 'Outstanding', emoji: '🏆', color: '#10b981' };
  if (score >= 85) return { rating: 'Excellent', emoji: '🌟', color: '#3b82f6' };
  if (score >= 75) return { rating: 'Good', emoji: '👍', color: '#f59e0b' };
  if (score >= 65) return { rating: 'Fair', emoji: '📚', color: '#f59e0b' };
  return { rating: 'Needs Improvement', emoji: '💪', color: '#ef4444' };
};

const getImprovementSuggestions = (score, correctAnswers, totalQuestions) => {
  const suggestions = [];
  
  if (score < 70) {
    suggestions.push('Review the fundamentals and practice more');
    suggestions.push('Take time to understand each concept thoroughly');
  }
  
  if (correctAnswers < totalQuestions * 0.8) {
    suggestions.push('Focus on accuracy over speed');
    suggestions.push('Read questions carefully before answering');
  }
  
  if (score >= 90) {
    suggestions.push('Great job! Try more challenging quizzes');
    suggestions.push('Consider helping others learn');
  }
  
  return suggestions;
};

const checkAchievements = (score, timeTaken, questionCount) => {
  const achievements = [];
  
  if (score === 100) {
    achievements.push({ name: 'Perfect Score', emoji: '🎯', points: 50 });
  }
  
  if (score >= 90) {
    achievements.push({ name: 'Quiz Master', emoji: '🏆', points: 25 });
  }
  
  if (timeTaken < questionCount * 30) {
    achievements.push({ name: 'Speed Demon', emoji: '⚡', points: 15 });
  }
  
  if (questionCount >= 20) {
    achievements.push({ name: 'Marathon Runner', emoji: '🏃', points: 20 });
  }
  
  return achievements;
};

const getNextSteps = (score, category) => {
  if (score >= 85) {
    return `Excellent work! Try advanced ${category} topics or explore related technologies.`;
  } else if (score >= 70) {
    return `Good progress! Review the missed questions and try similar quizzes.`;
  } else {
    return `Keep practicing! Focus on understanding the fundamentals before moving to advanced topics.`;
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
  getQuizQuestions,
  getQuizCategories,
  submitQuiz,
  getQuizStats
};
