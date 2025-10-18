import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = React.lazy(() => import('../pages/Landing'));

const LandingRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '50px' }}>
        <div className="spinner"></div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  // If user is logged in, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If not logged in, show landing page
  return (
    <Suspense fallback={
      <div className="text-center" style={{ padding: '50px' }}>
        <div className="spinner"></div>
        <p className="mt-3">Loading...</p>
      </div>
    }>
      <Landing />
    </Suspense>
  );
};

export default LandingRedirect;
