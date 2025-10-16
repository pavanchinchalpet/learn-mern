import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const questStats = {
    completed: 12,
    total: 20,
    streak: 5,
    level: 3,
  };

  const recentQuests = [
    { id: 1, title: 'React Hooks Mastery', difficulty: 'Medium', xp: 150, completed: true },
    { id: 2, title: 'Node.js Fundamentals', difficulty: 'Easy', xp: 100, completed: true },
    { id: 3, title: 'MongoDB Aggregation', difficulty: 'Hard', xp: 200, completed: false },
    { id: 4, title: 'Express Middleware', difficulty: 'Medium', xp: 120, completed: false },
  ];

  const achievements = [
    { id: 1, title: 'First Quest', icon: '⭐', unlocked: true },
    { id: 2, title: 'Speed Runner', icon: '⚡', unlocked: true },
    { id: 3, title: 'Knowledge Seeker', icon: '📚', unlocked: false },
  ];

  // Removed unused getDifficultyColor function

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a',
      padding: '0'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #111827 0%, #0b1220 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            Welcome back, <span style={{ color: '#fbbf24' }}>{user?.username || 'Pavan'}</span>! 🎮
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.9, 
            marginBottom: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Continue your MERN stack learning journey and level up your skills
          </p>
          
          {/* Quick Stats */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '3rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24' }}>
                {user?.points || 1250}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total XP</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24' }}>
                Level {user?.level || 3}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Current Level</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24' }}>
                {user?.streak || 5}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Day Streak</div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
                 <Link 
                     to="/quiz" 
                     style={{
                       backgroundColor: '#4f46e5',
                       color: 'white',
                       padding: '0.75rem 1.5rem',
                       borderRadius: '0.5rem',
                       textDecoration: 'none',
                       fontSize: '0.9rem',
                       fontWeight: '600',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '0.5rem',
                       transition: 'all 0.2s ease',
                       boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = '#4338ca';
                       e.currentTarget.style.transform = 'translateY(-2px)';
                       e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.45)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = '#4f46e5';
                       e.currentTarget.style.transform = 'translateY(0)';
                       e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.35)';
                     }}
                   >
                     <span>🎯</span>
                     Start Quiz
                   </Link>
            <Link 
              to="/leaderboard" 
              style={{
                backgroundColor: 'transparent',
                color: '#e5e7eb',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                border: '2px solid #374151',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1f2937';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
            >
              <span>🏆</span>
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Progress Overview */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          marginBottom: '3rem',
          border: '1px solid #1f2937'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🏆</span>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: '#93c5fd' }}>
                Level {questStats.level} Developer
              </h2>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              backgroundColor: '#1f2937',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                  width: `${(questStats.completed / questStats.total) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4f46e5, #4338ca)',
                borderRadius: '6px',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '1rem', fontWeight: '500' }}>
              {questStats.completed}/{questStats.total} quests completed
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Total XP Card */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #1f2937',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.15) 100%)',
            borderColor: '#064e3b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#34d399', fontSize: '1rem', fontWeight: '600' }}>Total XP</h3>
              <span style={{ fontSize: '1.5rem', color: '#34d399' }}>⚡</span>
              </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a7f3d0', marginBottom: '0.5rem' }}>
                {user?.points || 1250}
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#34d399', opacity: 0.8 }}>+180 this week</p>
          </div>

          {/* Streak Card */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #1f2937',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.15) 100%)',
            borderColor: '#92400e'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1rem', fontWeight: '600' }}>Streak</h3>
              <span style={{ fontSize: '1.5rem', color: '#fbbf24' }}>🎯</span>
              </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fbbf24', marginBottom: '0.5rem' }}>
                {questStats.streak} days
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#fbbf24', opacity: 0.8 }}>Keep it up!</p>
          </div>

          {/* Rank Card */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #1f2937',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(79,70,229,0.15) 100%)',
            borderColor: '#4338ca'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#93c5fd', fontSize: '1rem', fontWeight: '600' }}>Rank</h3>
              <span style={{ fontSize: '1.5rem', color: '#93c5fd' }}>👥</span>
              </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#c7d2fe', marginBottom: '0.5rem' }}>
                #12
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#a5b4fc', opacity: 0.8 }}>Global leaderboard</p>
          </div>
        </div>

        {/* Recent Quests and Achievements */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Recent Quests */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #1f2937',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '2rem 2rem 1rem',
              borderBottom: '1px solid #1f2937',
              background: 'linear-gradient(135deg, #0b1220 0%, #0f172a 100%)'
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                margin: 0, 
                color: '#93c5fd',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                <span style={{ fontSize: '1.5rem' }}>📚</span>
                Recent Quests
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                Continue your learning adventure
              </p>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentQuests.map((quest) => (
                  <div key={quest.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #1f2937',
                    background: quest.completed ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15))' : '#0f172a',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                      <h4 style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#e5e7eb'
                      }}>
                        {quest.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          backgroundColor: quest.difficulty === 'Easy' ? '#064e3b' : quest.difficulty === 'Medium' ? '#78350f' : '#7f1d1d',
                          color: quest.difficulty === 'Easy' ? '#a7f3d0' : quest.difficulty === 'Medium' ? '#fde68a' : '#fecaca',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {quest.difficulty}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '500' }}>
                          {quest.xp} XP
                        </span>
                      </div>
                    </div>
                    <button style={{
                      backgroundColor: quest.completed ? '#1f2937' : '#4f46e5',
                      color: quest.completed ? '#94a3b8' : 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: quest.completed ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}>
                      {quest.completed ? '✅ Completed' : '🚀 Start'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: '1px solid #1f2937',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '2rem 2rem 1rem',
              borderBottom: '1px solid #1f2937',
              background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.15) 100%)'
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                margin: 0, 
                color: '#fbbf24',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🏆</span>
                Achievements
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#fbbf24', fontSize: '0.875rem', opacity: 0.8 }}>
                Your learning milestones
              </p>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      borderRadius: '0.75rem',
                      border: '1px solid #1f2937',
                      background: achievement.unlocked ? 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.15) 100%)' : '#0f172a',
                      opacity: achievement.unlocked ? 1 : 0.7,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ 
                      fontSize: '2rem',
                      color: achievement.unlocked ? '#f59e0b' : '#9ca3af'
                    }}>
                      {achievement.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 0.25rem 0', 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: achievement.unlocked ? '#fde68a' : '#cbd5e1'
                      }}>
                        {achievement.title}
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.875rem', 
                        color: achievement.unlocked ? '#fbbf24' : '#94a3b8',
                        fontWeight: achievement.unlocked ? '600' : '400'
                      }}>
                        {achievement.unlocked ? '🎉 Unlocked!' : '🔒 Locked'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          border: '1px solid #1f2937',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0b1220 0%, #0f172a 100%)'
        }}>
            <h2 style={{ 
            fontSize: '2.5rem', 
              marginBottom: '1rem', 
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
            backgroundClip: 'text',
            fontWeight: '800'
            }}>
            Ready to Level Up? 🚀
            </h2>
          <p style={{ 
            color: '#cbd5e1', 
            fontSize: '1.25rem', 
            marginBottom: '2.5rem', 
            maxWidth: '700px', 
            margin: '0 auto 2.5rem',
            lineHeight: '1.6'
          }}>
              Take on new challenges, earn XP, and climb the leaderboard. Your MERN stack mastery journey continues here!
            </p>
                 <div style={{ 
                   display: 'flex', 
                   gap: '1.5rem', 
                   justifyContent: 'center', 
                   flexWrap: 'wrap' 
                 }}>
                   <Link 
                     to="/quiz" 
                     style={{
                      backgroundColor: '#4f46e5',
                       color: 'white',
                       padding: '1rem 2rem',
                       borderRadius: '0.75rem',
                       textDecoration: 'none',
                       fontSize: '1.1rem',
                       fontWeight: '600',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '0.5rem',
                       transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
                     }}
                     onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4338ca';
                       e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.45)';
                     }}
                     onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#4f46e5';
                       e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.35)';
                     }}
                   >
                     <span>🎯</span>
                     Start Quiz
                   </Link>
                   <Link 
                     to="/leaderboard" 
                     style={{
                      backgroundColor: 'transparent',
                      color: '#e5e7eb',
                       padding: '1rem 2rem',
                       borderRadius: '0.75rem',
                       textDecoration: 'none',
                       fontSize: '1.1rem',
                       fontWeight: '600',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '0.5rem',
                       transition: 'all 0.2s ease',
                      border: '2px solid #374151',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                     }}
                     onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1f2937';
                      e.currentTarget.style.color = 'white';
                       e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.35)';
                     }}
                     onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#e5e7eb';
                       e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                     }}
                   >
                     <span>🏆</span>
                     View Leaderboard
                   </Link>
                 </div>
        </div>
      </div>
    </div>
  );
};

export default Home;