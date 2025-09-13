import React, { useState, useEffect } from 'react';

// Mock leaderboard data
const mockLeaderboard = [
  { id: 1, username: 'Alex Chen', totalPoints: 2850, level: 8, streak: 15, avatar: 'default' },
  { id: 2, username: 'Sarah Kim', totalPoints: 2640, level: 7, streak: 12, avatar: 'default' },
  { id: 3, username: 'Mike Johnson', totalPoints: 2420, level: 6, streak: 8, avatar: 'default' },
  { id: 4, username: 'Emma Davis', totalPoints: 2180, level: 6, streak: 10, avatar: 'default' },
  { id: 5, username: 'David Wilson', totalPoints: 1950, level: 5, streak: 6, avatar: 'default' },
  { id: 6, username: 'Lisa Brown', totalPoints: 1820, level: 5, streak: 9, avatar: 'default' },
  { id: 7, username: 'James Miller', totalPoints: 1650, level: 4, streak: 4, avatar: 'default' },
  { id: 8, username: 'Anna Garcia', totalPoints: 1480, level: 4, streak: 7, avatar: 'default' },
  { id: 9, username: 'Tom Anderson', totalPoints: 1320, level: 3, streak: 3, avatar: 'default' },
  { id: 10, username: 'Sophie Taylor', totalPoints: 1280, level: 3, streak: 5, avatar: 'default' },
  { id: 11, username: 'Ryan Martinez', totalPoints: 1260, level: 3, streak: 2, avatar: 'default' },
  { id: 12, username: 'Pavan', totalPoints: 1250, level: 3, streak: 5, avatar: 'default', isCurrentUser: true },
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    try {
      // Use mock data for now
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);


  if (loading) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></div>
        <h3 style={{ marginTop: '1.5rem', color: 'var(--gray-700)' }}>Loading Leaderboard...</h3>
        <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>Fetching the top performers</p>
      </div>
    );
  }


  return (
    <div className="leaderboard-page">
      <div className="leaderboard-content">
        {/* Header */}
        <div className="page-header">
          <h1>🏆 Global Leaderboard</h1>
          <p>See how you rank among MERN stack learners worldwide</p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="card text-center">
            <div className="card-content">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ color: 'var(--gray-700)', marginBottom: '1rem' }}>No data available</h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>Be the first to take a quiz and appear on the leaderboard!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="podium-section">
              <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--gray-800)' }}>Top 3</h2>
              <div className="podium-container">
                {/* 2nd Place */}
                <div className="podium-card second-place">
                  <div className="podium-badge">#2</div>
                  <div className="podium-icon">🥈</div>
                  <div className="podium-avatar">
                    {mockLeaderboard[1].avatar === 'default' ? mockLeaderboard[1].username.charAt(0).toUpperCase() : mockLeaderboard[1].avatar}
                  </div>
                  <h3 className="podium-name">{mockLeaderboard[1].username}</h3>
                  <div className="podium-points">{mockLeaderboard[1].totalPoints.toLocaleString()} pts</div>
                  <div className="podium-details">Level {mockLeaderboard[1].level} {mockLeaderboard[1].streak} day streak</div>
                </div>

                {/* 1st Place */}
                <div className="podium-card first-place">
                  <div className="podium-badge">#1</div>
                  <div className="podium-icon">👑</div>
                  <div className="podium-avatar">
                    {mockLeaderboard[0].avatar === 'default' ? mockLeaderboard[0].username.charAt(0).toUpperCase() : mockLeaderboard[0].avatar}
                  </div>
                  <h3 className="podium-name">{mockLeaderboard[0].username}</h3>
                  <div className="podium-points">{mockLeaderboard[0].totalPoints.toLocaleString()} pts</div>
                  <div className="podium-details">Level {mockLeaderboard[0].level} {mockLeaderboard[0].streak} day streak</div>
                </div>

                {/* 3rd Place */}
                <div className="podium-card third-place">
                  <div className="podium-badge">#3</div>
                  <div className="podium-icon">🥉</div>
                  <div className="podium-avatar">
                    {mockLeaderboard[2].avatar === 'default' ? mockLeaderboard[2].username.charAt(0).toUpperCase() : mockLeaderboard[2].avatar}
                  </div>
                  <h3 className="podium-name">{mockLeaderboard[2].username}</h3>
                  <div className="podium-points">{mockLeaderboard[2].totalPoints.toLocaleString()} pts</div>
                  <div className="podium-details">Level {mockLeaderboard[2].level} {mockLeaderboard[2].streak} day streak</div>
                </div>
              </div>
            </div>

            {/* Complete Rankings */}
            <div className="complete-rankings">
              <div className="card">
                <div className="card-header">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--gray-800)' }}>
                    🏆 Complete Rankings
                  </h3>
                  <p style={{ margin: '0.5rem 0 0 0', color: 'var(--gray-600)' }}>All participants ranked by total points earned</p>
                </div>
                <div className="card-content" style={{ padding: 0 }}>
                  {leaderboard.map((user, index) => {
                    const rank = index + 1;
                    const isCurrentUser = user.isCurrentUser;
                    return (
                      <div
                        key={user.id}
                        className={`leaderboard-item ${isCurrentUser ? 'current-user' : ''}`}
                      >
                        <div className="leaderboard-rank">#{rank}</div>
                        <div className="leaderboard-user">
                          <div className="avatar avatar-md">
                            {user.avatar === 'default' ? user.username.charAt(0).toUpperCase() : user.avatar}
                          </div>
                          <div className="leaderboard-user-info">
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                              {user.username}
                              {isCurrentUser && (
                                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                                  You
                                </span>
                              )}
                            </h4>
                            <p style={{ margin: 0, color: 'var(--gray-600)' }}>Level {user.level}</p>
                          </div>
                        </div>
                        <div className="leaderboard-score">
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--gray-800)' }}>
                              {user.totalPoints.toLocaleString()} pts
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                              {user.streak} day streak
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tips Card */}
        <div className="card mt-3">
          <div className="card-content">
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>How to climb the leaderboard:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>📚</div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Take quizzes regularly</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-600)' }}>Earn points with each quiz attempt</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>🎯</div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Answer correctly</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-600)' }}>Higher accuracy = more points</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>🔥</div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Maintain streaks</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-600)' }}>Daily practice earns bonus points</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem' }}>🏆</div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Complete challenges</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--gray-600)' }}>Unlock achievements for extra points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
