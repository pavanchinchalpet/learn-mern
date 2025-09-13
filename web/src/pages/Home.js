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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-success';
      case 'Medium':
        return 'badge-default';
      case 'Hard':
        return 'badge-error';
      default:
        return 'badge-default';
    }
  };

  return (
    <div className="home-page">
      <div className="home-content">
        {/* Header */}
        <div className="page-header">
          <h1>Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.username || 'Pavan'}</span>! 🎮</h1>
          <p>Continue your MERN stack learning journey and level up your skills</p>
        </div>
        {/* Level Progress Card */}
        <div className="card" style={{ 
          maxWidth: '400px', 
          margin: '0 auto 3rem', 
          borderColor: 'var(--primary)', 
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)',
          textAlign: 'center'
        }}>
          <div className="card-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
              <span style={{ fontSize: '1.25rem' }}>🏆</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Level {questStats.level} Developer</h3>
            </div>
            <div className="progress" style={{ marginBottom: '0.75rem' }}>
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(questStats.completed / questStats.total) * 100}%`,
                  background: 'var(--primary)'
                }}
              ></div>
            </div>
            <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              {questStats.completed}/{questStats.total} quests completed
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Total XP Card */}
          <div className="card card-gradient-green">
            <div className="card-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--success)', fontSize: '0.875rem', fontWeight: '600' }}>Total XP</h4>
                <span style={{ fontSize: '1.25rem', color: 'var(--success)' }}>⚡</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)', marginBottom: '0.5rem' }}>
                {user?.points || 1250}
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--success)', opacity: 0.8 }}>+180 this week</p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="card card-gradient-orange">
            <div className="card-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--warning)', fontSize: '0.875rem', fontWeight: '600' }}>Streak</h4>
                <span style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>🎯</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)', marginBottom: '0.5rem' }}>
                {questStats.streak} days
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--warning)', opacity: 0.8 }}>Keep it up!</p>
            </div>
          </div>

          {/* Rank Card */}
          <div className="card card-gradient-purple">
            <div className="card-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600' }}>Rank</h4>
                <span style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>👥</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                #12
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.8 }}>Global leaderboard</p>
            </div>
          </div>
        </div>

        {/* Recent Quests and Achievements */}
        <div className="dashboard-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Recent Quests */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--primary)' }}>
                <span style={{ fontSize: '1.25rem' }}>📚</span>
                Recent Quests
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--gray-600)', fontSize: '0.875rem' }}>Continue your learning adventure</p>
            </div>
            <div className="card-content" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {recentQuests.map((quest) => (
                  <div key={quest.id} className="quest-card">
                    <div className="quest-content">
                      <h4 className="quest-title">
                        {quest.title}
                      </h4>
                      <div className="quest-meta">
                        <span className={`badge ${getDifficultyColor(quest.difficulty)}`}>
                          {quest.difficulty}
                        </span>
                        <span className="quest-xp">
                          {quest.xp} XP
                        </span>
                      </div>
                    </div>
                    <button 
                      className={`btn ${quest.completed ? 'btn-secondary' : 'btn-primary'} quest-button`}
                      disabled={quest.completed}
                    >
                      {quest.completed ? 'Completed' : 'Start'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--warning)' }}>
                <span style={{ fontSize: '1.25rem' }}>🏆</span>
                Achievements
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--gray-600)', fontSize: '0.875rem' }}>Your learning milestones</p>
            </div>
            <div className="card-content" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--gray-200)',
                      background: achievement.unlocked ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'var(--gray-50)',
                      opacity: achievement.unlocked ? 1 : 0.6,
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ 
                      fontSize: '1.5rem',
                      color: achievement.unlocked ? 'var(--warning)' : 'var(--gray-400)'
                    }}>
                      {achievement.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 0.25rem 0', 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: 'var(--gray-800)' 
                      }}>
                        {achievement.title}
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.875rem', 
                        color: achievement.unlocked ? 'var(--warning)' : 'var(--gray-500)',
                        fontWeight: achievement.unlocked ? '600' : '400'
                      }}>
                        {achievement.unlocked ? 'Unlocked!' : 'Locked'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card text-center" style={{ margin: '3rem 0' }}>
          <div className="card-content">
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '1rem', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              backgroundClip: 'text' 
            }}>
              Ready to Level Up?
            </h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Take on new challenges, earn XP, and climb the leaderboard. Your MERN stack mastery journey continues here!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/quiz" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                🚀 Start New Quest
              </Link>
              <Link to="/leaderboard" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                🏆 View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;