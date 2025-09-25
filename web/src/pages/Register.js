import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-quest-gold opacity-20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-quest-purple opacity-30 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-quest-green opacity-20 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-quest-blue opacity-25 rounded-full animate-spin-slow"></div>
      </div>

      {/* Main Register Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-quest border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-quest-gradient-purple rounded-2xl mb-4 shadow-quest-glow">
              <span className="text-2xl font-bold text-white">🎮</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-fantasy mb-2">Join the Quest!</h1>
            <p className="text-white/80 text-sm">Create your adventurer account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 backdrop-blur-sm">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/90 font-semibold mb-2">
                👤 Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-purple focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="Choose your adventurer name"
                required
                minLength="3"
                maxLength="30"
              />
            </div>

            <div>
              <label className="block text-white/90 font-semibold mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-purple focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-white/90 font-semibold mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-purple focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="Create a strong password"
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-white/90 font-semibold mb-2">
                🔐 Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-purple focus:border-transparent backdrop-blur-sm transition-all duration-300"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-quest-gradient-purple hover:shadow-quest-glow text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Adventurer...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">⚔️</span>
                  Begin Your Quest!
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-white/70 text-sm">
              Already an adventurer?{' '}
              <Link 
                to="/login" 
                className="text-quest-gold hover:text-quest-gold-dark font-semibold transition-colors duration-300 hover:underline"
              >
                Enter Quest World! 🚀
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
