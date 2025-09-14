import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '50px' }}>
        <div className="spinner"></div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  return user && user.isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
