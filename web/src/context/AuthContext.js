import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        message = validationErrors.map(err => err.msg).join(', ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      setError(message);
      return { success: false, error: message };
    }
  };

  const sendOTP = async (email) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/send-otp', { email });
      
      return { success: true, message: response.data.message };
    } catch (error) {
      let message = 'Failed to send OTP';
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        message = validationErrors.map(err => err.msg).join(', ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      setError(message);
      return { success: false, error: message };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/verify-otp', { email, otp });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      let message = 'OTP verification failed';
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        message = validationErrors.map(err => err.msg).join(', ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', { 
        username, 
        email, 
        password 
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      let message = 'Registration failed';
      
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        message = validationErrors.map(err => err.msg).join(', ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    setError,
    sendOTP,
    verifyOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
