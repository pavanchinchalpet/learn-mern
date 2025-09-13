import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎮</span>
          MERN Quest
        </Link>
        
        <div className="navbar-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          
          {user ? (
            <>
              <Link to="/quiz" className="nav-link">Quiz</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              <div className="user-info">
                <span className="username">{user.username}</span>
                <span className="points">{user.points} pts</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
