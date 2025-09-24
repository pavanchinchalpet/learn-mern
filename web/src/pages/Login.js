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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px 0' }}>
      <div className="card">
        <h2 className="text-center mb-3">Sign In</h2>
        
        {/* Login Method Toggle */}
        <div style={{ 
          display: 'flex', 
          background: '#f8f9fa', 
          borderRadius: '8px', 
          padding: '4px', 
          marginBottom: '20px' 
        }}>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('password');
              setOtpSent(false);
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: loginMethod === 'password' ? '#007bff' : 'transparent',
              color: loginMethod === 'password' ? 'white' : '#6c757d',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('otp');
              setOtpSent(false);
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              background: loginMethod === 'otp' ? '#007bff' : 'transparent',
              color: loginMethod === 'otp' ? 'white' : '#6c757d',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            OTP Login
          </button>
        </div>
        
        {error && (
          <div className="alert alert-danger" style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px' 
          }}>
            {error}
          </div>
        )}

        {loginMethod === 'password' ? (
          <form onSubmit={handlePasswordLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ marginRight: '8px' }}></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOTP}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ marginRight: '8px' }}></span>
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPVerification}>
                <div style={{ 
                  background: '#d1ecf1', 
                  padding: '15px', 
                  borderRadius: '6px', 
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#0c5460' }}>
                    📧 OTP sent to <strong>{formData.email}</strong>
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="otp">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="form-control"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="123456"
                    maxLength="6"
                    style={{ 
                      textAlign: 'center', 
                      fontSize: '18px', 
                      letterSpacing: '2px',
                      fontFamily: 'monospace'
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '10px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ marginRight: '8px' }}></span>
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={otpTimer > 0 || loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: otpTimer > 0 ? '#6c757d' : '#007bff',
                      cursor: otpTimer > 0 ? 'not-allowed' : 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="text-center mt-3">
          <p className="text-muted">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
