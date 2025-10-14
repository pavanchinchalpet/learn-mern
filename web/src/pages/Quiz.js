import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizCategories, setQuizCategories] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  // Hint and explanation removed for simplified UI
  const [showFullReview, setShowFullReview] = useState(false);
  const [examActive, setExamActive] = useState(false);
  const autoSubmitTriggeredRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizData();
  }, []);

  const handleAutoSubmit = useCallback(async () => {
    if (submitting) return;
    
    setTimerActive(false);
    setSubmitting(true);
    
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
        questionId,
        selectedAnswer: answer
      }));

      const actualTimeTaken = Math.floor((Date.now() - startTime) / 1000);

      const response = await api.post('/api/quiz/submit', {
        answers,
        timeTaken: actualTimeTaken
      });

      setResults(response.data);
      setQuizComplete(true);
      // Attempt to exit fullscreen after submit
      if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        try {
          if (document.exitFullscreen) await document.exitFullscreen();
          else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
          else if (document.msExitFullscreen) await document.msExitFullscreen();
        } catch (_) {}
      }
    } catch (error) {
      console.error('Error auto-submitting quiz:', error);
      alert('Time\'s up! Quiz submitted automatically.');
    } finally {
      setSubmitting(false);
    }
  }, [submitting, selectedAnswers, startTime]);

  const confirmAutoSubmit = useCallback(async () => {
    if (autoSubmitTriggeredRef.current || submitting || quizComplete) return;
    const confirmed = window.confirm('You are attempting to leave the quiz. This will submit your test. Do you want to proceed?');
    if (confirmed) {
      autoSubmitTriggeredRef.current = true;
      await handleAutoSubmit();
    } else {
      // Try to immediately restore exam context
      try {
        await requestFullscreen();
      } catch (_) {}
    }
  }, [handleAutoSubmit, submitting, quizComplete]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Time's up! Auto-submit the quiz
      handleAutoSubmit();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, handleAutoSubmit]);

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60);
    setTimerActive(true);
    setStartTime(Date.now());
  };

  const stopTimer = () => {
    setTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      // Load both categories and quizzes in parallel
      const [categoriesResponse, quizzesResponse] = await Promise.all([
        api.get('/api/quiz/categories'),
        api.get('/api/quiz?limit=50')
      ]);
      
      setQuizCategories(categoriesResponse.data);
      setQuizzes(quizzesResponse.data);
    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fullscreen helpers
  const requestFullscreen = async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) await el.msRequestFullscreen();
    } catch (_) {}
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      else if (document.msExitFullscreen) await document.msExitFullscreen();
    } catch (_) {}
  };

  const handleQuizSelect = (categoryId) => {
    const selectedCategory = quizCategories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      // Filter questions based on category
      const filteredQuizzes = quizzes.filter(quiz => 
        quiz.category === selectedCategory.category
      );
      
      if (filteredQuizzes.length > 0) {
        // Limit questions based on category settings
        const maxQuestions = Math.min(selectedCategory.questions, filteredQuizzes.length);
        const selectedQuestions = filteredQuizzes.slice(0, maxQuestions);
        
        setSelectedQuiz({
          ...selectedCategory,
          questions: selectedQuestions
        });
        setCurrentQuizIndex(0);
        setSelectedAnswers({});
        setQuizComplete(false);
        setResults(null);
        
        // Start the timer
        startTimer(selectedCategory.timeLimit);
        // Enter fullscreen and mark exam active
        requestFullscreen();
        setExamActive(true);
        autoSubmitTriggeredRef.current = false;
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
    stopTimer(); // Stop the timer when submitting
    
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
        questionId,
        selectedAnswer: answer
      }));

      const actualTimeTaken = Math.floor((Date.now() - startTime) / 1000);

      const response = await api.post('/api/quiz/submit', {
        answers,
        timeTaken: actualTimeTaken
      });

      setResults(response.data);
      setQuizComplete(true);
      await exitFullscreen();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Detect attempts to leave exam context and auto-submit
  useEffect(() => {
    if (!selectedQuiz || quizComplete) {
      setExamActive(false);
      autoSubmitTriggeredRef.current = false;
      return;
    }

    const triggerAutoSubmitOnce = () => {
      if (!examActive || submitting || quizComplete) return;
      if (autoSubmitTriggeredRef.current) return;
      confirmAutoSubmit();
    };

    const handleVisibility = () => {
      if (document.hidden) triggerAutoSubmitOnce();
    };

    const handleBlur = () => {
      // Window lost focus (possible app switch or minimize)
      triggerAutoSubmitOnce();
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        triggerAutoSubmitOnce();
      }
    };

    const handleContextMenu = (e) => {
      if (examActive) e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (!examActive) return;
      const key = e.key.toLowerCase();
      // Block some navigation/exit keys
      if (
        e.ctrlKey && (key === 'w' || key === 't' || key === 'l' || key === 'r')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (key === 'f11') {
        e.preventDefault();
        e.stopPropagation();
        requestFullscreen();
      }
      if (key === 'escape') {
        e.preventDefault();
        e.stopPropagation();
        exitFullscreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [selectedQuiz, quizComplete, examActive, submitting, handleAutoSubmit, confirmAutoSubmit]);

  const handleNext = () => {
    if (currentQuizIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  // Previous removed in minimal UI

  const clearCurrentSelection = () => {
    const currentId = selectedQuiz.questions[currentQuizIndex]._id;
    const updated = { ...selectedAnswers };
    delete updated[currentId];
    setSelectedAnswers(updated);
  };

  const handleSkip = () => {
    if (currentQuizIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  // Jump UI removed in minimal layout

  // Review panel removed in minimal layout

  // Answer status utils not needed in minimal layout

  // Answer count util not needed in minimal layout

  // Hint helpers removed

  // Bar progress replaced with countdown bar

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
      <div className="quiz-page" style={{ background: '#0f172a', color: '#e5e7eb' }}>
        <div className="quiz-content">
          {/* Header */}
          <div className="page-header" style={{ background: 'linear-gradient(135deg, #111827, #0b1220)', borderBottom: '1px solid #1f2937', padding: '3rem 2rem' }}>
            <h1 style={{ color: '#f8fafc', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>🧠 Knowledge Quests</h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Test your MERN stack skills and earn XP points</p>
          </div>
          {/* Quiz Categories Grid */}
          <div className="quiz-grid" style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {quizCategories.map((category) => (
              <div key={category.id} className="card" style={{ cursor: 'pointer', transition: 'var(--transition)', border: '1px solid #1f2937', background: '#111827' }} onClick={() => handleQuizSelect(category.id)}>
                <div className="card-header" style={{ background: 'linear-gradient(135deg, #0b1220, #0f172a)', borderBottom: '1px solid #1f2937' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className={`badge ${getDifficultyColor(category.difficulty)}`}>
                      {category.difficulty}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                      <span>🏆</span>
                      <span style={{ fontWeight: '600' }}>{category.xp} XP</span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f8fafc' }}>
                    <span style={{ fontSize: '1.75rem' }}>{category.icon}</span>
                    {category.title}
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {category.description}
                  </p>
                </div>
                <div className="card-content" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🧠</span>
                      <span>{category.questions} questions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>⏱️</span>
                      <span>{category.timeLimit} min</span>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.35)' }}>
                    🚀 Start Quest
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="card" style={{ margin: '3rem 0', border: '1px solid #1f2937', background: '#111827' }}>
            <div className="card-content" style={{ padding: '2rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: '#f8fafc' }}>Why Choose Our Quizzes?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#60a5fa' }}>🎯</div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#e5e7eb' }}>Targeted Learning</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Questions designed for specific skill levels and technologies</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#f59e0b' }}>⚡</div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#e5e7eb' }}>Instant Feedback</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Get immediate results and detailed explanations</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#10b981' }}>🏆</div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#e5e7eb' }}>Earn Rewards</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Collect XP points and unlock achievements</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#3b82f6' }}>📈</div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#e5e7eb' }}>Track Progress</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Monitor your learning journey and improvement</p>
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
    const getPerformanceMessage = (score) => {
      if (score >= 90) return { message: "Outstanding! 🏆", color: "var(--success)" };
      if (score >= 80) return { message: "Excellent! 🌟", color: "var(--primary)" };
      if (score >= 70) return { message: "Good job! 👍", color: "var(--warning)" };
      if (score >= 60) return { message: "Not bad! 📚", color: "var(--warning)" };
      return { message: "Keep practicing! 💪", color: "var(--error)" };
    };

    const performance = getPerformanceMessage(results.score);

    return (
      <div className="quiz-container" style={{ color: '#e5e7eb', background: '#0f172a' }}>
        <div className="card text-center" style={{ padding: '2rem', background: '#111827', border: '1px solid #1f2937' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', color: '#f8fafc' }}>
            Test Completed
          </h2>
          <p style={{ color: '#e5e7eb', fontSize: '16px', marginBottom: '16px' }}>
            {performance.message}
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', marginBottom: '16px' }}>
            <div style={{ border: '1px solid #1f2937', padding: '8px', background: '#0b1220' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: performance.color }}>{results.score}%</div>
              <div style={{ fontSize: '12px' }}>Final Score</div>
            </div>
            <div style={{ border: '1px solid #1f2937', padding: '8px', background: '#0b1220' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{results.correctAnswers}/{results.totalQuestions}</div>
              <div style={{ fontSize: '12px' }}>Correct Answers</div>
            </div>
            <div style={{ border: '1px solid #1f2937', padding: '8px', background: '#0b1220' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{results.pointsEarned}</div>
              <div style={{ fontSize: '12px' }}>Points Earned</div>
            </div>
            <div style={{ border: '1px solid #1f2937', padding: '8px', background: '#0b1220' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{results.streak || 0}</div>
              <div style={{ fontSize: '12px' }}>Best Streak</div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="performance-analysis" style={{ marginTop: '16px', padding: '12px', background: '#0b1220', border: '1px solid #1f2937' }}>
            <h3 style={{ marginBottom: '8px', color: '#f8fafc', fontSize: '18px' }}>Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <div className="analysis-item">
                <div className="analysis-icon">🎯</div>
                <div className="analysis-text">
                  <strong>Accuracy:</strong> {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                </div>
              </div>
              <div className="analysis-item">
                <div className="analysis-icon">⚡</div>
                <div className="analysis-text">
                  <strong>Speed:</strong> {Math.round(results.timeTaken / 60)} min {results.timeTaken % 60} sec
                </div>
              </div>
              <div className="analysis-item">
                <div className="analysis-icon">🔥</div>
                <div className="analysis-text">
                  <strong>Streak:</strong> {results.streak || 0} consecutive correct
                </div>
              </div>
              <div className="analysis-item">
                <div className="analysis-icon">🏆</div>
                <div className="analysis-text">
                  <strong>XP Earned:</strong> {results.pointsEarned} points
                </div>
              </div>
            </div>
          </div>

          {/* Full Review */}
          {Array.isArray(results.review) && results.review.length > 0 && (
            <div style={{ marginTop: '16px', border: '1px solid #1f2937', background: '#0b1220' }}>
              <div style={{ padding: '12px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Complete Review</h3>
                <button onClick={() => setShowFullReview(!showFullReview)} className="btn btn-outline">
                  {showFullReview ? 'Hide' : 'Show'} All
                </button>
              </div>
              {showFullReview && (
                <div style={{ padding: '12px' }}>
                  {results.review.map((item, idx) => (
                    <div key={item.questionId || idx} style={{ borderBottom: '1px solid #1f2937', padding: '12px 0' }}>
                      <div style={{ fontWeight: 600, marginBottom: '6px' }}>Q{idx + 1}. {item.question}</div>
                      <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                        Your answer: <span style={{ fontWeight: 600 }}>{item.selectedAnswer || '-'}</span> {item.isCorrect ? '✓' : '✗'}
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                        Correct answer: <span style={{ fontWeight: 600 }}>{item.correctAnswer}</span>
                      </div>
                      {Array.isArray(item.options) && item.options.length > 0 && (
                        <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                          Options: {item.options.join(' | ')}
                        </div>
                      )}
                      {item.explanation && (
                        <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                          Explanation: {item.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
            <button onClick={() => navigate('/profile')} className="btn btn-primary">
              👤 View Profile
            </button>
            <button onClick={() => {
              setSelectedQuiz(null);
              setShowFullReview(false);
            }} className="btn btn-secondary">
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
    <div className="quiz-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, maxWidth: 1400, margin: '0 auto', padding: '24px', paddingTop: '80px' }}>
        {/* Left Fixed Panel */}
        <aside style={{ background: 'transparent', color: '#ffffff', position: 'sticky', top: '80px', alignSelf: 'start', height: 'calc(100vh - 128px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingRight: 16 }}>
            {/* Title */}
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>{selectedQuiz.title || 'Quiz'}</div>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, background: '#22c55e', borderRadius: 4, display: 'inline-block' }}></span>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Attempted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, background: '#334155', borderRadius: 4, display: 'inline-block' }}></span>
                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Unattempted</span>
              </div>
            </div>
            {/* Questions attempted count */}
            <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>QUESTIONS ATTEMPTED</div>
            <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>{Object.keys(selectedAnswers).length} / {selectedQuiz.questions.length}</div>
            {/* Navigation grid */}
            <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>QUESTION NAVIGATION</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 12, paddingRight: 8 }}>
              {selectedQuiz.questions.map((q, idx) => {
                const active = idx === currentQuizIndex;
                const attempted = !!selectedAnswers[q._id];
                const bg = active ? '#0ea5e9' : attempted ? '#16a34a' : 'transparent';
                const border = active ? '#38bdf8' : attempted ? '#14532d' : '#334155';
                const color = active || attempted ? '#ffffff' : '#cbd5e1';
                return (
                  <button
                    key={q._id || idx}
                    onClick={() => setCurrentQuizIndex(idx)}
                    style={{
                      height: 40,
                      borderRadius: 10,
                      border: `1px solid ${border}`,
                      background: bg,
                      color,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                    aria-label={`Go to question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            {/* Spacer */}
            <div style={{ flex: 1 }}></div>
            {/* Submit Button */}
            <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', border: '1px solid #dc2626', background: '#dc2626', color: '#ffffff', borderRadius: 10, padding: '12px 16px', fontWeight: 800 }}>
              {submitting ? 'Submitting…' : 'Submit Assignment'}
            </button>
          </div>
        </aside>

        {/* Right Content */}
        <div style={{ width: '100%', minHeight: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Centered question card (no top progress bar, time at top-right) */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', padding: '20px', width: '880px', maxWidth: '100%', height: '560px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#6b7280' }}>Question {currentQuizIndex + 1} of {selectedQuiz.questions.length}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{formatTime(timeLeft)}</div>
          </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ fontSize: 20, lineHeight: 1.5, fontWeight: 800, color: '#0f172a' }}>{currentQuestion.question}</div>

              {/* Options as simple outlined choices (no colored backgrounds) */}
              <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion._id] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                      style={{
                        textAlign: 'left', width: '100%',
                        background: '#ffffff',
                        border: isSelected ? '2px solid #c7d2fe' : '1px solid #e5e7eb',
                        borderRadius: 10,
                        padding: '12px 14px', color: '#111827',
                        display: 'flex', alignItems: 'center', gap: 10,
                        fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: 9999,
                        border: '1px solid #e5e7eb', color: '#4f46e5',
                        fontWeight: 800, background: '#fff'
                      }}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <button onClick={clearCurrentSelection} style={{ border: '1px solid #e5e7eb', background: '#ffffff', color: '#111827', borderRadius: 10, padding: '10px 16px', fontWeight: 700, minWidth: 92 }}>Clear</button>
            <button onClick={handleSkip} style={{ border: '1px solid #e5e7eb', background: '#ffffff', color: '#111827', borderRadius: 10, padding: '10px 16px', fontWeight: 700, minWidth: 92 }}>Skip</button>
            <button
              onClick={currentQuizIndex === selectedQuiz.questions.length - 1 ? handleSubmit : handleNext}
              disabled={currentQuizIndex === selectedQuiz.questions.length - 1 ? (submitting || !selectedAnswers[currentQuestion._id]) : !selectedAnswers[currentQuestion._id]}
              style={{ border: '1px solid #f59e0b', background: '#f59e0b', color: '#ffffff', borderRadius: 10, padding: '10px 16px', fontWeight: 800, minWidth: 92 }}
            >
              {currentQuizIndex === selectedQuiz.questions.length - 1 ? (submitting ? 'Submitting…' : 'Submit') : 'Submit'}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;