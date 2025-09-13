const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const User = require('../models/User');

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Public
const getQuizzes = async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    const quizzes = await Quiz.find(query)
      .limit(parseInt(limit))
      .select('-answer')
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
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
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    if (!quiz.isActive) {
      return res.status(404).json({ message: 'Quiz is not active' });
    }
    
    // Don't send the answer for quiz taking
    const quizWithoutAnswer = {
      _id: quiz._id,
      question: quiz.question,
      options: quiz.options,
      category: quiz.category,
      difficulty: quiz.difficulty,
      points: quiz.points
    };
    
    res.json(quizWithoutAnswer);
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }
    
    let correctAnswers = 0;
    let totalPoints = 0;
    let streak = 0;
    let maxStreak = 0;
    
    // Process answers - get each question from database
    const processedAnswers = await Promise.all(answers.map(async (answer) => {
      const question = await Quiz.findById(answer.questionId);
      const isCorrect = question && question.answer === answer.selectedAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        totalPoints += question.points || 10;
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
      
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    }));
    
    // Calculate score
    const score = Math.round((correctAnswers / answers.length) * 100);
    
    // Create score record with a generated quizId for this session
    const scoreRecord = new Score({
      userId: req.user.id,
      quizId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for this quiz session
      score,
      timeTaken,
      answers: processedAnswers,
      totalQuestions: answers.length,
      correctAnswers,
      streak: maxStreak,
      pointsEarned: totalPoints
    });
    
    await scoreRecord.save();
    
    // Update user stats
    const user = await User.findById(req.user.id);
    user.points += totalPoints;
    user.totalQuizzes += 1;
    user.correctAnswers += correctAnswers;
    user.totalAnswers += answers.length;
    
    // Update user level
    const newLevel = Math.floor(user.points / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }
    
    // Add badges based on performance
    if (score === 100 && !user.badges.includes('Perfect Score')) {
      user.badges.push('Perfect Score');
    }
    
    if (correctAnswers >= 50 && !user.badges.includes('Quiz Master')) {
      user.badges.push('Quiz Master');
    }
    
    await user.save();
    
    // Update individual quiz stats
    for (const answer of processedAnswers) {
      const question = await Quiz.findById(answer.questionId);
      if (question) {
        question.timesAnswered += 1;
        if (answer.isCorrect) {
          question.timesCorrect += 1;
        }
        await question.save();
      }
    }
    
    res.json({
      message: 'Quiz submitted successfully',
      score,
      correctAnswers,
      totalQuestions: answers.length,
      pointsEarned: totalPoints,
      streak: maxStreak,
      userStats: {
        points: user.points,
        level: user.level,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get quiz statistics
// @route   GET /api/quiz/stats
// @access  Private
const getQuizStats = async (req, res) => {
  try {
    const stats = await Score.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$score' },
          totalPoints: { $sum: '$pointsEarned' },
          totalTime: { $sum: '$timeTaken' }
        }
      }
    ]);
    
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
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);
    
    res.json({
      overall: stats[0] || {
        totalQuizzes: 0,
        averageScore: 0,
        totalPoints: 0,
        totalTime: 0
      },
      byCategory: categoryStats
    });
  } catch (error) {
    console.error('Get quiz stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizStats
};
