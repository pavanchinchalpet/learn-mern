import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  // Quiz categories and difficulties
  const quizCategories = [
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Test your knowledge of React basics, components, and hooks',
      difficulty: 'Easy',
      questions: 10,
      timeLimit: 15,
      xp: 100,
      category: 'React',
      icon: '⚛️'
    },
    {
      id: 'node-express',
      title: 'Node.js & Express',
      description: 'Server-side JavaScript and Express framework concepts',
      difficulty: 'Medium',
      questions: 15,
      timeLimit: 20,
      xp: 150,
      category: 'Node.js',
      icon: '🟢'
    },
    {
      id: 'mongodb-advanced',
      title: 'MongoDB Mastery',
      description: 'Advanced MongoDB queries, aggregation, and optimization',
      difficulty: 'Hard',
      questions: 20,
      timeLimit: 25,
      xp: 200,
      category: 'MongoDB',
      icon: '🍃'
    },
    {
      id: 'javascript-basics',
      title: 'JavaScript Essentials',
      description: 'Core JavaScript concepts, ES6+ features, and best practices',
      difficulty: 'Easy',
      questions: 12,
      timeLimit: 18,
      xp: 120,
      category: 'JavaScript',
      icon: '📜'
    },
    {
      id: 'express-middleware',
      title: 'Express Middleware',
      description: 'Understanding Express middleware, routing, and error handling',
      difficulty: 'Medium',
      questions: 14,
      timeLimit: 22,
      xp: 140,
      category: 'Express',
      icon: '🚂'
    },
    {
      id: 'mern-fullstack',
      title: 'MERN Full Stack',
      description: 'Complete MERN stack integration and deployment concepts',
      difficulty: 'Hard',
      questions: 25,
      timeLimit: 30,
      xp: 250,
      category: 'MERN',
      icon: '🚀'
    }
  ];

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await api.get('/api/quiz?limit=10');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = (quizId) => {
    const selectedCategory = quizCategories.find(cat => cat.id === quizId);
    if (selectedCategory) {
      // Filter questions based on category and difficulty
      const filteredQuizzes = quizzes.filter(quiz => 
        quiz.category === selectedCategory.category && 
        quiz.difficulty === selectedCategory.difficulty.toLowerCase()
      );
      
      if (filteredQuizzes.length > 0) {
        setSelectedQuiz({
          ...selectedCategory,
          questions: filteredQuizzes.slice(0, selectedCategory.questions)
        });
        setCurrentQuizIndex(0);
        setSelectedAnswers({});
        setQuizComplete(false);
        setResults(null);
      } else {
        alert('No questions available for this category. Please try another quiz.');
      }
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < selectedQuiz.questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
        questionId,
        selectedAnswer: answer
      }));

      const response = await api.post('/api/quiz/submit', {
        answers,
        timeTaken: selectedQuiz.timeLimit * 60 // Convert minutes to seconds
      });

      setResults(response.data);
      setQuizComplete(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuizIndex + 1) / selectedQuiz.questions.length) * 100;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-success';
      case 'Medium':
        return 'badge-warning';
      case 'Hard':
        return 'badge-error';
      default:
        return 'badge-default';
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></div>
        <h3 style={{ marginTop: '1.5rem', color: 'var(--gray-700)' }}>Loading Quiz Categories...</h3>
        <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Preparing your learning adventure</p>
      </div>
    );
  }

  // Quiz Selection Screen
  if (!selectedQuiz) {
    return (
      <div className="quiz-page">
        <div className="quiz-content">
          {/* Header */}
          <div className="page-header">
            <h1>🧠 Knowledge Quests</h1>
            <p>Test your MERN stack skills and earn XP points</p>
          </div>
          {/* Quiz Categories Grid */}
          <div className="quiz-grid">
            {quizCategories.map((quiz) => (
              <div key={quiz.id} className="card" style={{ cursor: 'pointer', transition: 'var(--transition)' }} onClick={() => handleQuizSelect(quiz.id)}>
                <div className="card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className={`badge ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                      <span>🏆</span>
                      <span style={{ fontWeight: '600' }}>{quiz.xp} XP</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{quiz.icon}</span>
                    {quiz.title}
                  </h3>
                  <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {quiz.description}
                  </p>
                </div>
                <div className="card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🧠</span>
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>⏱️</span>
                      <span>{quiz.timeLimit} min</span>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    🚀 Start Quest
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="card" style={{ margin: '3rem 0' }}>
            <div className="card-content">
              <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--gray-800)' }}>Why Choose Our Quizzes?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Targeted Learning</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Questions designed for specific skill levels and technologies</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Instant Feedback</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Get immediate results and detailed explanations</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Earn Rewards</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Collect XP points and unlock achievements</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Track Progress</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Monitor your learning journey and improvement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Complete Screen
  if (quizComplete && results) {
    return (
      <div className="quiz-container">
        <div className="card text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Quest Complete!
          </h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Great job! Here's how you performed
          </p>
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-number">{results.score}%</div>
              <div className="stat-label">Final Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{results.correctAnswers}/{results.totalQuestions}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{results.pointsEarned}</div>
              <div className="stat-label">Points Earned</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{results.streak || 0}</div>
              <div className="stat-label">Best Streak</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <button onClick={() => navigate('/profile')} className="btn btn-primary">
              👤 View Profile
            </button>
            <button onClick={() => setSelectedQuiz(null)} className="btn btn-secondary">
              🔄 Take Another Quiz
            </button>
            <button onClick={() => navigate('/leaderboard')} className="btn btn-success">
              🏆 View Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No quizzes available
  if (quizzes.length === 0) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
        <h2 style={{ color: 'var(--gray-700)', marginBottom: '1rem' }}>No quizzes available</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>Check back later for new quizzes!</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          🔄 Refresh
        </button>
      </div>
    );
  }

  // Quiz Taking Screen
  const currentQuestion = selectedQuiz.questions[currentQuizIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>🚀 {selectedQuiz.title}</h2>
        <p>Question {currentQuizIndex + 1} of {selectedQuiz.questions.length}</p>
        <div className="quiz-tags">
          <span className="quiz-tag">
            {selectedQuiz.icon} {selectedQuiz.category}
          </span>
          <span className="quiz-tag">
            {selectedQuiz.difficulty === 'Easy' ? '🟢' : selectedQuiz.difficulty === 'Medium' ? '🟡' : '🔴'} {selectedQuiz.difficulty}
          </span>
          <span className="quiz-tag">
            ⭐ {selectedQuiz.xp} XP
          </span>
        </div>
      </div>

      <div className="quiz-progress">
        <div className="progress-info">
          <span>Progress</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
        </div>
      </div>

      <div className="quiz-question">
        <h3>{currentQuestion.question}</h3>
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`quiz-option ${
                selectedAnswers[currentQuestion._id] === option ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(currentQuestion._id, option)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          className="btn btn-secondary"
          disabled={currentQuizIndex === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Previous
        </button>

        <div className="quiz-dots">
          {selectedQuiz.questions.map((_, index) => (
            <div
              key={index}
              className={`quiz-dot ${index <= currentQuizIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        {currentQuizIndex === selectedQuiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="btn btn-success"
            disabled={submitting || !selectedAnswers[currentQuestion._id]}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {submitting ? (
              <>
                <span className="spinner" style={{ marginRight: '8px' }}></span>
                Submitting...
              </>
            ) : (
              <>
                🚀 Submit Quest
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn btn-primary"
            disabled={!selectedAnswers[currentQuestion._id]}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;