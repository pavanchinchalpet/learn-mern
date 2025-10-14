import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, auth, db } from '../config/supabase';

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
    // Get initial session
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getInitialSession = async () => {
    try {
      const { session, error } = await auth.getSession();
      if (error) {
        console.error('Session error:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Get initial session error:', error);
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data: userProfile, error } = await db.getUserProfile(userId);
      if (error) {
        console.error('Load user profile error:', error);
        return;
      }
      setUser(userProfile);
    } catch (error) {
      console.error('Load user profile error:', error);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await auth.signIn(email, password);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error } = await auth.signUp(email, password, { username });
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // User profile will be created automatically via database trigger
        // or we can create it manually here
        await loadUserProfile(data.user.id);
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (email) => {
    try {
      setError(null);
      const { error } = await auth.resetPassword(email);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Failed to send OTP. Please try again.');
      return { success: false, error: 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOTP = async (email, token) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery'
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Invalid OTP. Please try again.');
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }
  };

  const resetPassword = async (password) => {
    try {
      setError(null);
      const { error } = await auth.updatePassword(password);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Failed to reset password. Please try again.');
      return { success: false, error: 'Failed to reset password. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await auth.signOut();
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed. Please try again.');
      return { success: false, error: 'Logout failed. Please try again.' };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      if (!user) {
        setError('No user logged in');
        return { success: false, error: 'No user logged in' };
      }

      const { data, error } = await db.updateUserProfile(user.id, updates);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      setUser(data);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Failed to update profile. Please try again.');
      return { success: false, error: 'Failed to update profile. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    sendOTP,
    verifyOTP,
    resetPassword,
    logout,
    updateProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
