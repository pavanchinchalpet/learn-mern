import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || 'default'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const achievementsResponse = await api.get('/api/user/achievements');
      setAchievements(achievementsResponse.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    try {
      const response = await api.put('/api/user/profile', formData);
      updateUser(response.data.user);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      username: user.username,
      avatar: user.avatar
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz':
        return '📚';
      case 'achievement':
        return '🏆';
      case 'level':
        return '📈';
      default:
        return '⭐';
    }
  };

  const skillProgress = [
    { skill: 'React', progress: 75, level: 'Advanced' },
    { skill: 'Node.js', progress: 60, level: 'Intermediate' },
    { skill: 'MongoDB', progress: 45, level: 'Beginner' },
    { skill: 'Express', progress: 55, level: 'Intermediate' },
    { skill: 'JavaScript', progress: 80, level: 'Advanced' },
  ];

  const recentActivity = [
    { id: 1, type: 'quiz', title: 'React Hooks Mastery', xp: 150, date: '2 hours ago', completed: true },
    { id: 2, type: 'achievement', title: 'Speed Runner', date: '1 day ago' },
    { id: 3, type: 'quiz', title: 'Node.js Fundamentals', xp: 100, date: '2 days ago', completed: true },
    { id: 4, type: 'level', title: 'Reached Level 3', date: '3 days ago' },
    { id: 5, type: 'quiz', title: 'JavaScript Basics', xp: 80, date: '5 days ago', completed: true },
  ];

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></div>
        <h3 style={{ marginTop: '1.5rem', color: 'var(--gray-700)' }}>Loading Profile...</h3>
        <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Fetching your learning data</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        {/* Main Profile Card */}
        <div className="profile-main-card">
          <div className="profile-main-content">
            <div className="profile-avatar-large">
              {user.avatar === 'default' ? user.username.charAt(0).toUpperCase() : user.avatar}
            </div>
            <div className="profile-main-info">
              <h1 className="profile-name">{user.username}</h1>
              <p className="profile-title">Level {user.level} MERN Stack Developer</p>
              <div className="profile-stats-row">
                <div className="profile-stat">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-value">{user.points} XP</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-icon">🎯</span>
                  <span className="stat-value">{user.streak} day streak</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-icon">🏆</span>
                  <span className="stat-value">Rank #12</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-icon">📅</span>
                  <span className="stat-value">Joined March 2024</span>
                </div>
              </div>
            </div>
            <div className="profile-progress">
              <div className="progress-text">12/20</div>
              <div className="progress-label">Quests Completed</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
        {editing && (
        <div className="card mb-3">
          <div className="card-content">
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile</h3>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="avatar">Avatar</label>
              <select
                id="avatar"
                name="avatar"
                className="form-control"
                value={formData.avatar}
                onChange={handleChange}
              >
                <option value="default">Default</option>
                <option value="🎮">🎮</option>
                <option value="👨‍💻">👨‍💻</option>
                <option value="👩‍💻">👩‍💻</option>
                <option value="🚀">🚀</option>
                <option value="⚡">⚡</option>
                <option value="🔥">🔥</option>
                <option value="💻">💻</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleSave} className="btn btn-success">
                💾 Save Changes
              </button>
              <button onClick={handleCancel} className="btn btn-secondary">
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <div className="tabs-list">
          <button
            className={`tabs-trigger ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tabs-trigger ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            🏆 Achievements
          </button>
          <button
            className={`tabs-trigger ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            🎯 Skills
          </button>
          <button
            className={`tabs-trigger ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            📈 Activity
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tabs-content">
            <div className="stats-grid">
              <div className="stat-card card-gradient-green">
                <div className="stat-number">{user.points}</div>
                <div className="stat-label">Total XP</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>+180 this week</p>
              </div>
              <div className="stat-card card-gradient-orange">
                <div className="stat-number">{user.level}</div>
                <div className="stat-label">Current Level</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>250 XP to next level</p>
              </div>
              <div className="stat-card card-gradient-purple">
                <div className="stat-number">{user.streak}</div>
                <div className="stat-label">Learning Streak</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>days in a row</p>
              </div>
              <div className="stat-card">
                <div className="stat-number">#12</div>
                <div className="stat-label">Global Rank</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>out of 1,247 learners</p>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="tabs-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`achievement-card ${achievement.earned ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>
                  <h4 style={{ marginBottom: '0.5rem' }}>{achievement.name}</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {achievement.description}
                  </p>
                  {achievement.earned && (
                    <span className="badge badge-success">Unlocked!</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="tabs-content">
            <h3 style={{ marginBottom: '1.5rem' }}>Skill Progress</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>Your mastery level in different technologies</p>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {skillProgress.map((skill) => (
                <div key={skill.skill} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skill.skill}</span>
                    <span className="skill-level">{skill.level}</span>
                  </div>
                  <div className="progress">
                    <div className="progress-fill" style={{ width: `${skill.progress}%` }}></div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
                    {skill.progress}% complete
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="tabs-content">
            <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>Your latest learning achievements and progress</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon" style={{ background: 'var(--primary)', color: 'white' }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{activity.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-600)' }}>{activity.date}</p>
                  </div>
                  {activity.xp && (
                    <span className="badge badge-primary">+{activity.xp} XP</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Profile;
