import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { QuizSkeleton } from '../components/SkeletonLoader';

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
  const [pausedQuiz, setPausedQuiz] = useState(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const autoSubmitTriggeredRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizData();
  }, []);

  // Update quiz progress when answers change
  useEffect(() => {
    if (selectedQuiz && selectedQuiz.questions) {
      const totalQuestions = selectedQuiz.questions.length;
      const answeredQuestions = Object.keys(selectedAnswers).length;
      setQuizProgress(Math.round((answeredQuestions / totalQuestions) * 100));
    }
  }, [selectedAnswers, selectedQuiz]);

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

  const handleQuizExit = useCallback(async () => {
    if (autoSubmitTriggeredRef.current || submitting || quizComplete) return;
    
    // Save current quiz state for resume
    setPausedQuiz({
      ...selectedQuiz,
      currentIndex: currentQuizIndex,
      answers: selectedAnswers,
      timeLeft: timeLeft,
      startTime: startTime
    });
    
    // Instead of auto-submitting, just pause the quiz and exit fullscreen
    setTimerActive(false); // Pause timer
    setExamActive(false); // Exit exam mode
    setSelectedQuiz(null); // Return to quiz selection
    
    // Exit fullscreen gracefully
    try {
      await exitFullscreen();
    } catch (_) {}
    
    // Show a message that quiz is paused
    alert('Quiz paused. You can resume by clicking "Resume Quiz" below.');
  }, [submitting, quizComplete, selectedQuiz, currentQuizIndex, selectedAnswers, timeLeft, startTime]);

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
    if (!seconds || seconds < 0) return '00:00';
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
        api.get('/api/quiz?limit=200') // Increased to get all questions
      ]);
      
      // Count actual questions per category
      const questionCountsByCategory = {};
      const categoryDifficulties = {};
      
      if (quizzesResponse.data && quizzesResponse.data.length > 0) {
        quizzesResponse.data.forEach(quiz => {
          if (quiz.category_id) {
            // Count questions
            if (!questionCountsByCategory[quiz.category_id]) {
              questionCountsByCategory[quiz.category_id] = 0;
            }
            questionCountsByCategory[quiz.category_id]++;
            
            // Track difficulty if present
            if (quiz.difficulty) {
              categoryDifficulties[quiz.category_id] = quiz.difficulty;
            }
          }
        });
      }
      
      // Normalize categories with actual question counts
      const normalizedCategories = (categoriesResponse.data || []).map((ct) => {
        const actualCount = questionCountsByCategory[ct.id] || ct.count || ct.questions || 0;
        
        const normalizedCategory = {
          id: ct.id,
          title: ct.title || ct.name || 'Category',
          description: ct.description || '',
          icon: ct.icon || '📚',
          // Use difficulty from backend or from quizzes
          difficulty: ct.difficulty || categoryDifficulties[ct.id] || undefined,
          timeLimit: ct.timeLimit || Math.ceil(actualCount * 2), // 1:2 ratio
          xp: ct.xp || Math.max(actualCount * 10, 50),
          questions: actualCount // Use actual count from backend
        };
        
        if (actualCount > 0) {
          console.log(`Category "${normalizedCategory.title}": ${actualCount} questions, difficulty: ${normalizedCategory.difficulty || 'not set'}`);
        }
        
        return normalizedCategory;
      });

      setQuizCategories(normalizedCategories);
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

  const handleQuizSelect = async (categoryId) => {
    const selectedCategory = quizCategories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      // Filter quizzes based on category
      const filteredQuizzes = quizzes.filter((quiz) => quiz.category_id === categoryId);
      
      if (filteredQuizzes.length > 0) {
        try {
          // Since each quiz is a question, we can use them directly
          // Transform quizzes to question format
          const questions = filteredQuizzes.map(quiz => ({
            id: quiz.id,
            question: quiz.question_text,
            options: quiz.options,
            correctAnswer: quiz.answer, // This should be the correct answer text
            explanation: quiz.explanation,
            points: quiz.points || 10
          }));
          
          if (questions.length > 0) {
            // Use the actual number of questions we have
            // This ensures the count always matches what's displayed
            const selectedQuestions = questions;
            
            console.log(`Starting quiz "${selectedCategory.title}": ${selectedQuestions.length} questions available`);
            
            setSelectedQuiz({
              ...selectedCategory,
              questions: selectedQuestions
            });
            setCurrentQuizIndex(0);
            setSelectedAnswers({});
            setQuizComplete(false);
            setResults(null);
            
            // Start the timer with 1:2 ratio (1 question = 2 minutes)
            const calculatedTimeLimit = selectedQuestions.length * 2; // 1:2 ratio
            startTimer(calculatedTimeLimit);
            // Enter fullscreen and mark exam active
            requestFullscreen();
            setExamActive(true);
            autoSubmitTriggeredRef.current = false;
          } else {
            alert('No questions available for this quiz. Please try another category.');
          }
        } catch (error) {
          console.error('Error loading quiz questions:', error);
          alert('Error loading quiz questions. Please try again.');
        }
      } else {
        alert('No quizzes available for this category. Please try another quiz.');
      }
    }
  };

  const handleResumeQuiz = () => {
    if (!pausedQuiz) return;
    
    // Restore quiz state
    setSelectedQuiz(pausedQuiz);
    setCurrentQuizIndex(pausedQuiz.currentIndex);
    setSelectedAnswers(pausedQuiz.answers);
    setTimeLeft(pausedQuiz.timeLeft);
    setStartTime(pausedQuiz.startTime);
    setQuizComplete(false);
    setResults(null);
    
    // Resume timer if there's time left
    if (pausedQuiz.timeLeft > 0) {
      setTimerActive(true);
    }
    
    // Enter fullscreen and mark exam active
    requestFullscreen();
    setExamActive(true);
    autoSubmitTriggeredRef.current = false;
    
    // Clear paused quiz
    setPausedQuiz(null);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
    
    // No feedback during quiz - keep it completely neutral
    // All feedback will be shown after submission in results
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

    const handleVisibility = () => {
      // Don't auto-submit on visibility change - just pause
      if (document.hidden && examActive) {
        setTimerActive(false);
      }
    };

    const handleBlur = () => {
      // Don't auto-submit on window blur - just pause
      if (examActive) {
        setTimerActive(false);
      }
    };

    const handleFullscreenChange = () => {
      // Don't auto-submit on fullscreen exit - just pause
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (examActive) {
          setTimerActive(false);
          setExamActive(false);
        }
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
        handleQuizExit();
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
  }, [selectedQuiz, quizComplete, examActive, submitting, handleAutoSubmit, handleQuizExit]);

  const handleNext = () => {
    if (currentQuizIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  // Previous removed in minimal UI

  const clearCurrentSelection = () => {
    const currentId = selectedQuiz.questions[currentQuizIndex].id;
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

  const getDifficultyColor = useCallback((difficulty) => {
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
  }, []);

  // No need to memoize - already normalized in loadQuizData
  const memoizedQuizCategories = useMemo(() => {
    return quizCategories; // Already normalized with actual counts
  }, [quizCategories]);

  if (loading) {
    return <QuizSkeleton />;
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
            
            {/* Resume Quiz Button */}
            {pausedQuiz && (
              <div style={{ marginTop: '2rem' }}>
                <div className="card" style={{ background: '#1f2937', border: '2px solid #f59e0b', maxWidth: '400px', margin: '0 auto' }}>
                  <div className="card-content" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏸️</div>
                    <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Quiz Paused</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      You have {Math.floor(pausedQuiz.timeLeft / 60)}:{(pausedQuiz.timeLeft % 60).toString().padStart(2, '0')} remaining
                    </p>
                    <button 
                      onClick={handleResumeQuiz}
                      className="btn btn-primary" 
                      style={{ 
                        backgroundColor: '#f59e0b', 
                        color: 'white', 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '0.5rem', 
                        border: 'none', 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        marginRight: '0.5rem'
                      }}
                    >
                      🔄 Resume Quiz
                    </button>
                    <button 
                      onClick={() => setPausedQuiz(null)}
                      className="btn btn-secondary" 
                      style={{ 
                        backgroundColor: '#6b7280', 
                        color: 'white', 
                        padding: '0.75rem 1.5rem', 
                        borderRadius: '0.5rem', 
                        border: 'none', 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Cancel Quiz
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Quiz Categories Grid */}
          <div className="quiz-grid" style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {memoizedQuizCategories.map((category) => (
              <div key={category.id} className="card" style={{ cursor: 'pointer', transition: 'var(--transition)', border: '1px solid #1f2937', background: '#111827' }} onClick={() => handleQuizSelect(category.id)}>
                <div className="card-header" style={{ background: 'linear-gradient(135deg, #0b1220, #0f172a)', borderBottom: '1px solid #1f2937' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    {category.difficulty ? (
                      <div className={`badge ${getDifficultyColor(category.difficulty)}`}>
                        {category.difficulty}
                      </div>
                    ) : (
                      <div></div>
                    )}
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
                      <span>{category.questions * 2} min</span>
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
      if (score >= 90) return { message: "Outstanding! 🏆", color: "#10b981" };
      if (score >= 80) return { message: "Excellent! 🌟", color: "#3b82f6" };
      if (score >= 70) return { message: "Good job! 👍", color: "#f59e0b" };
      if (score >= 60) return { message: "Not bad! 📚", color: "#f59e0b" };
      return { message: "Keep practicing! 💪", color: "#ef4444" };
    };

    const performance = getPerformanceMessage(results.score);

    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        color: '#e5e7eb',
        padding: '2rem'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#f8fafc', fontWeight: 800 }}>
            Test Completed
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.25rem', marginBottom: '2rem' }}>
            {performance.message}
          </p>
        </div>

        {/* Summary Metrics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem',
          maxWidth: '1200px',
          margin: '0 auto 3rem auto'
        }}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: performance.color, marginBottom: '0.5rem' }}>
              {results.score}%
            </div>
            <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>Final Score</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              {results.correctAnswers}/{results.totalQuestions}
            </div>
            <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>Correct Answers</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              {results.pointsEarned}
            </div>
            <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>Points Earned</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              {results.streak || 0}
            </div>
            <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>Best Streak</div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div style={{ 
          marginBottom: '3rem',
          maxWidth: '1200px',
          margin: '0 auto 3rem auto'
        }}>
          <h2 style={{ 
            marginBottom: '2rem', 
            color: '#f8fafc', 
            fontSize: '2rem', 
            fontWeight: 700,
            textAlign: 'center'
          }}>
            Performance
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '2rem' }}>🎯</div>
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                  Accuracy: {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                </div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '2rem' }}>⚡</div>
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                  Speed: {Math.round(results.timeTaken / 60)} min {results.timeTaken % 60} sec
                </div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '2rem' }}>🔥</div>
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                  Streak: {results.streak || 0} consecutive correct
                </div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '2rem' }}>🏆</div>
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                  XP Earned: {results.pointsEarned} points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Review */}
        {Array.isArray(results.review) && results.review.length > 0 && (
          <div style={{ 
            maxWidth: '1200px',
            margin: '0 auto 3rem auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '2rem' 
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '2rem', 
                color: '#f8fafc',
                fontWeight: 700
              }}>
                Complete Review
              </h2>
              <button 
                onClick={() => setShowFullReview(!showFullReview)} 
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {showFullReview ? 'Hide All' : 'Show All'}
              </button>
            </div>
            {showFullReview && (
              <div style={{ 
                display: 'grid', 
                gap: '1.5rem' 
              }}>
                {results.review.map((item, idx) => (
                  <div key={item.questionId || idx} style={{ 
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.5rem'
                  }}>
                    <div style={{ 
                      fontWeight: 700, 
                      marginBottom: '1rem', 
                      fontSize: '1.1rem',
                      color: '#f8fafc'
                    }}>
                      Q{idx + 1}. {item.question}
                    </div>
                    <div style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                      Your answer: <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {item.selectedAnswer || '-'}
                      </span> {item.isCorrect ? '✓' : '✗'}
                    </div>
                    <div style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                      Correct answer: <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {item.correctAnswer}
                      </span>
                    </div>
                    {Array.isArray(item.options) && item.options.length > 0 && (
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#94a3b8' }}>
                        Options: {item.options.join(' | ')}
                      </div>
                    )}
                    {item.explanation && (
                      <div style={{ 
                        fontSize: '0.9rem', 
                        whiteSpace: 'pre-wrap', 
                        color: '#94a3b8',
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '0.25rem'
                      }}>
                        Explanation: {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <button 
            onClick={() => navigate('/profile')} 
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            👤 View Profile
          </button>
          <button 
            onClick={() => {
              setSelectedQuiz(null);
              setShowFullReview(false);
            }} 
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Take Another Quiz
          </button>
          <button 
            onClick={() => navigate('/leaderboard')} 
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🏆 View Leaderboard
          </button>
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
    <div className="quiz-wrapper" style={{ background: '#0f172a', minHeight: '100vh' }}>
      {/* Hide navigation bar completely */}
      <style>{`
        .navbar, nav, .nav, [class*="nav"], [class*="Navbar"] { 
          display: none !important; 
          visibility: hidden !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        body { 
          padding-top: 0 !important; 
          margin-top: 0 !important;
        }
        .quiz-page { padding-top: 0 !important; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); max-height: 0; }
          to { opacity: 1; transform: translateY(0); max-height: 200px; }
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        {/* Left Fixed Panel */}
        <aside style={{ background: 'transparent', color: '#ffffff', position: 'sticky', top: '24px', alignSelf: 'start', height: 'calc(100vh - 48px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
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
            
            {/* Progress Bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>PROGRESS</div>
              <div style={{ 
                width: '100%', 
                height: 8, 
                background: '#334155', 
                borderRadius: 4, 
                overflow: 'hidden',
                marginBottom: 8
              }}>
                <div style={{ 
                  width: `${quizProgress}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #10b981, #059669)', 
                  transition: 'width 0.3s ease',
                  borderRadius: 4
                }}></div>
              </div>
              <div style={{ color: '#10b981', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
                {quizProgress}% Complete
              </div>
            </div>
            {/* Navigation grid */}
            <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>QUESTION NAVIGATION</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 12, paddingRight: 8 }}>
              {selectedQuiz.questions.map((q, idx) => {
                const active = idx === currentQuizIndex;
                const attempted = !!selectedAnswers[q.id];
                // Show green for attempted questions, blue only for current unanswered question
                const bg = attempted ? '#16a34a' : active ? '#0ea5e9' : 'transparent';
                const border = attempted ? '#14532d' : active ? '#38bdf8' : '#334155';
                const color = attempted || active ? '#ffffff' : '#cbd5e1';
                return (
                  <button
                    key={q.id || idx}
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
        <div style={{ width: '100%', minHeight: 'calc(100vh - 48px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          {/* Centered question card (no top progress bar, time at top-right) */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.06)', padding: '40px', width: '880px', maxWidth: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#6b7280' }}>Question {currentQuizIndex + 1} of {selectedQuiz.questions.length}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{formatTime(timeLeft)}</div>
          </div>
            <div style={{ overflowY: 'auto', marginBottom: 24, flex: 1 }}>
              <div style={{ fontSize: 22, lineHeight: 1.6, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>{currentQuestion.question}</div>

              {/* Options as simple outlined choices (no colored backgrounds) */}
              <div style={{ display: 'grid', gap: 14 }}>
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      style={{
                        textAlign: 'left', width: '100%',
                        background: '#ffffff',
                        border: isSelected ? '2px solid #c7d2fe' : '1px solid #e5e7eb',
                        borderRadius: 10,
                        padding: '16px 18px', color: '#111827',
                        display: 'flex', alignItems: 'center', gap: 12,
                        fontWeight: 600, cursor: 'pointer',
                        fontSize: '16px'
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
              
              {/* No feedback during quiz - all feedback shown after submission */}
            </div>
          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            {/* Left side - Clear button */}
            <button onClick={clearCurrentSelection} style={{ border: '1px solid #e5e7eb', background: '#ffffff', color: '#111827', borderRadius: 10, padding: '12px 20px', fontWeight: 700, minWidth: 100, fontSize: '15px' }}>Clear</button>
            
            {/* Right side - Skip and Next buttons */}
            <div style={{ display: 'flex', gap: 14 }}>
              <button onClick={handleSkip} style={{ border: '1px solid #e5e7eb', background: '#ffffff', color: '#111827', borderRadius: 10, padding: '12px 20px', fontWeight: 700, minWidth: 100, fontSize: '15px' }}>Skip</button>
              <button
                onClick={currentQuizIndex === selectedQuiz.questions.length - 1 ? handleSubmit : handleNext}
                disabled={currentQuizIndex === selectedQuiz.questions.length - 1 ? (submitting || !selectedAnswers[currentQuestion.id]) : !selectedAnswers[currentQuestion.id]}
                style={{ border: '1px solid #f59e0b', background: '#f59e0b', color: '#ffffff', borderRadius: 10, padding: '12px 20px', fontWeight: 800, minWidth: 100, fontSize: '15px' }}
              >
                {currentQuizIndex === selectedQuiz.questions.length - 1 ? (submitting ? 'Submitting…' : 'Submit') : 'Next'}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Quiz);