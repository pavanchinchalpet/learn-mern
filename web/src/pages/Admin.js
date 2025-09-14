import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Admin = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  // Removed unused quizzes state
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newQuiz, setNewQuiz] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    category: 'MongoDB',
    difficulty: 'easy',
    explanation: ''
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [analyticsResponse, usersResponse] = await Promise.all([
        api.get('/api/admin/analytics'),
        api.get('/api/admin/users')
      ]);
      
      setAnalytics(analyticsResponse.data);
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    
    if (!newQuiz.question || !newQuiz.answer || newQuiz.options.some(opt => !opt)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/api/admin/quiz', newQuiz);
      setNewQuiz({
        question: '',
        options: ['', '', '', ''],
        answer: '',
        category: 'MongoDB',
        difficulty: 'easy',
        explanation: ''
      });
      alert('Quiz created successfully!');
      loadAdminData();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuiz.options];
    updatedOptions[index] = value;
    setNewQuiz({ ...newQuiz, options: updatedOptions });
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '50px' }}>
        <div className="spinner"></div>
        <p className="mt-3">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>⚙️ Admin Panel</h1>
        <p>Manage quizzes, users, and platform analytics</p>
      </div>

      <div className="card mb-3">
        <div className="d-flex" style={{ borderBottom: '1px solid #e9ecef' }}>
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 0, border: 'none' }}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`btn ${activeTab === 'quizzes' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 0, border: 'none' }}
            onClick={() => setActiveTab('quizzes')}
          >
            Manage Quizzes
          </button>
          <button
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 0, border: 'none' }}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && analytics && (
        <div>
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-number">{analytics.overview.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.overview.totalQuizzes}</div>
              <div className="stat-label">Total Quizzes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{analytics.overview.totalScores}</div>
              <div className="stat-label">Quiz Attempts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{Math.round(analytics.overview.avgPoints)}</div>
              <div className="stat-label">Avg Points</div>
            </div>
          </div>

          <div className="card">
            <h3>Category Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {analytics.quizStats.map((stat) => (
                <div key={stat._id} style={{ padding: '15px', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                  <h4>{stat._id}</h4>
                  <div className="stat-number">{stat.count}</div>
                  <div className="stat-label">Quizzes</div>
                  <div className="text-muted">
                    {Math.round(stat.avgSuccessRate * 100)}% success rate
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
              <div>
                {analytics.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0', borderBottom: '1px solid #e9ecef' }}>
                    <div>
                      <strong>{activity.userId?.username || 'Unknown User'}</strong>
                      <div className="text-muted">
                        {activity.quizId?.category || 'Quiz'} • {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="badge badge-primary">{activity.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No recent activity</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div>
          <div className="card mb-3">
            <h3>Create New Quiz</h3>
            <form onSubmit={handleCreateQuiz}>
              <div className="form-group">
                <label htmlFor="question">Question</label>
                <textarea
                  id="question"
                  className="form-control"
                  value={newQuiz.question}
                  onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Options</label>
                {newQuiz.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control mb-2"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                ))}
              </div>

              <div className="form-group">
                <label htmlFor="answer">Correct Answer</label>
                <input
                  type="text"
                  id="answer"
                  className="form-control"
                  value={newQuiz.answer}
                  onChange={(e) => setNewQuiz({ ...newQuiz, answer: e.target.value })}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="form-control"
                    value={newQuiz.category}
                    onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                  >
                                         <option value="MongoDB">MongoDB</option>
                     <option value="Express">Express</option>
                     <option value="React">React</option>
                     <option value="Node">Node</option>
                     <option value="MERN">MERN</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    className="form-control"
                    value={newQuiz.difficulty}
                    onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="explanation">Explanation (Optional)</label>
                <textarea
                  id="explanation"
                  className="form-control"
                  value={newQuiz.explanation}
                  onChange={(e) => setNewQuiz({ ...newQuiz, explanation: e.target.value })}
                  rows="2"
                />
              </div>

              <button type="submit" className="btn btn-success">
                Create Quiz
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className="card">
            <h3>User Management</h3>
            {users.length > 0 ? (
              <div>
                {users.map((user) => (
                  <div key={user._id} className="d-flex justify-content-between align-items-center" style={{ padding: '15px 0', borderBottom: '1px solid #e9ecef' }}>
                    <div className="d-flex align-items-center">
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: '#007bff', 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginRight: '15px'
                      }}>
                        {user.avatar === 'default' ? user.username.charAt(0).toUpperCase() : user.avatar}
                      </div>
                      <div>
                        <h4 style={{ margin: 0 }}>{user.username}</h4>
                        <div className="text-muted">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>Level {user.level}</div>
                      <div className="text-muted">{user.points} points</div>
                      {user.isAdmin && <span className="badge badge-warning">Admin</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No users found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
