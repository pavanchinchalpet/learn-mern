import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Left side: Primary navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/home" className="nav-link-custom">🏠 Home</Link>
            <Link to="/quiz" className="nav-link-custom">🎯 Quiz</Link>
            <Link to="/leaderboard" className="nav-link-custom">🏆 Leaderboard</Link>
            <Link to="/profile" className="nav-link-custom">👤 Profile</Link>
            {user?.isAdmin && (
              <Link to="/admin" className="nav-link-custom">⚙️ Admin</Link>
            )}
          </div>

          {/* Right side: User info / actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                  <span className="text-white font-semibold">👤 {user.username}</span>
                  <span className="bg-quest-gradient-gold text-white px-2 py-1 rounded-lg text-sm font-bold">💰 {user.points} pts</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-100 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 border border-red-500/50"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link to="/login" className="nav-link-custom">🔑 Login</Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
