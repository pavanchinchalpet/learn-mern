import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const { login, sendOTP, verifyOTP, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await sendOTP(formData.email);
    
    if (result.success) {
      setOtpSent(true);
      setOtpTimer(60); // 60 seconds timer
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    setLoading(false);
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await verifyOTP(formData.email, formData.otp);
    
    if (result.success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  const resendOTP = async () => {
    if (otpTimer > 0) return;
    
    setLoading(true);
    setError(null);

    const result = await sendOTP(formData.email);
    
    if (result.success) {
      setOtpTimer(60);
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-quest border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-quest-gradient-purple rounded-2xl mb-4 shadow-quest-glow">
              <span className="text-2xl font-bold text-white">⚔️</span>
            </div>
            <h1 className="text-3xl font-bold text-white font-fantasy mb-2">MERN Quest World</h1>
            <p className="text-white/80 text-sm">Enter the realm of coding adventures</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setOtpSent(false);
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                loginMethod === 'password'
                  ? 'bg-quest-gradient-purple text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              🗝️ Password
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setOtpSent(false);
                setError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                loginMethod === 'otp'
                  ? 'bg-quest-gradient-purple text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              📱 OTP Login
            </button>
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

          {/* Password Login Form */}
          {loginMethod === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
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
                  placeholder="Enter your password"
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
                    Entering Quest...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Enter Quest World
                  </div>
                )}
              </button>
            </form>
          ) : (
            /* OTP Login Form */
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-quest-gradient-gold hover:shadow-quest-gold text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Magic Code...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">✨</span>
                        Send Magic Code
                      </div>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOTPVerification} className="space-y-6">
                  <div className="bg-quest-green/20 border border-quest-green/50 text-quest-green p-4 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center justify-center">
                      <span className="text-xl mr-2">📧</span>
                      <span className="font-medium">Magic code sent to <strong>{formData.email}</strong></span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/90 font-semibold mb-2">
                      🔢 Enter 6-digit Magic Code
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="123456"
                      maxLength="6"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-quest-purple focus:border-transparent backdrop-blur-sm transition-all duration-300 text-center text-2xl font-mono tracking-widest"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-quest-gradient-purple hover:shadow-quest-glow text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🔮</span>
                        Verify Magic Code
                      </div>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resendOTP}
                      disabled={otpTimer > 0 || loading}
                      className={`text-sm transition-all duration-300 ${
                        otpTimer > 0 || loading
                          ? 'text-white/50 cursor-not-allowed'
                          : 'text-quest-gold hover:text-quest-gold-dark hover:underline'
                      }`}
                    >
                      {otpTimer > 0 ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-1">⏰</span>
                          Resend in {otpTimer}s
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="mr-1">🔄</span>
                          Resend Magic Code
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-white/70 text-sm">
              New to the quest?{' '}
              <Link 
                to="/register" 
                className="text-quest-gold hover:text-quest-gold-dark font-semibold transition-colors duration-300 hover:underline"
              >
                Join the Adventure! 🎮
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
