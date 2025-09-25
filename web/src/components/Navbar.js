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
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl hover:text-quest-gold transition-colors duration-300">
            <span className="text-2xl">⚔️</span>
            <span className="font-fantasy">MERN Quest World</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/" className="text-white/80 hover:text-white font-semibold transition-colors duration-300">🏠 Home</Link>
                <Link to="/leaderboard" className="text-white/80 hover:text-white font-semibold transition-colors duration-300">🏆 Leaderboard</Link>
                <Link to="/quiz" className="text-white/80 hover:text-white font-semibold transition-colors duration-300">🎯 Quiz</Link>
                <Link to="/profile" className="text-white/80 hover:text-white font-semibold transition-colors duration-300">👤 Profile</Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-white/80 hover:text-white font-semibold transition-colors duration-300">⚙️ Admin</Link>
                )}
                <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                  <span className="text-white font-semibold">👤 {user.username}</span>
                  <span className="bg-quest-gradient-gold text-white px-2 py-1 rounded-lg text-sm font-bold">💰 {user.points} pts</span>
                  <button 
                    onClick={handleLogout} 
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-red-100 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 border border-red-500/50"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link to="/login" className="text-white/80 hover:text-white font-semibold transition-colors duration-300">🔑 Login</Link>
                )}
                {location.pathname !== '/register' && (
                  <Link to="/register" className="bg-quest-gradient-purple hover:shadow-quest-glow text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                    🎮 Sign Up
                  </Link>
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
