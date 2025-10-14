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

  // Mock user for development - bypass authentication
  const mockUser = {
    id: 'dev-user-1',
    username: 'Pavan',
    email: 'pavan@example.com',
    points: 1250,
    level: 3,
    streak: 5,
    isAdmin: true, // Set to true for development to access admin routes
    avatar: 'default'
  };

  useEffect(() => {
    // For development: Set mock user immediately
    setUser(mockUser);
    setLoading(false);
    
    // Original authentication logic (commented out for development)
    /*
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
    */
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      setUser(response.data.user);
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
      
      // For development: Always return success with mock user
      setUser(mockUser);
      return { success: true };
      
      // Original login logic (commented out for development)
      /*
      const response = await api.post('/api/auth/login', { email, password });
      const { session, user } = response.data;
      const accessToken = session?.access_token;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
      setUser(user);
      
      return { success: true };
      */
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
      const response = await api.post('/api/auth/verify-otp', { email, token: otp });
      const { session, user } = response.data;
      const accessToken = session?.access_token;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
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
      
      // For development: Always return success with mock user
      const newMockUser = { ...mockUser, username, email };
      setUser(newMockUser);
      return { success: true };
      
      // Original registration logic (commented out for development)
      /*
      const response = await api.post('/api/auth/register', { 
        username, 
        email, 
        password 
      });
      const { user } = response.data;
      setUser(user);
      
      return { success: true };
      */
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
