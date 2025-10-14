import React from 'react';

const Admin = () => {
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="page-header" style={{ background: 'linear-gradient(135deg, #111827, #0b1220)', borderBottom: '1px solid #1f2937' }}>
          <h1 style={{ color: '#f8fafc' }}>⚙️ Admin Dashboard</h1>
          <p style={{ color: '#94a3b8' }}>Manage courses, users, and platform settings</p>
        </div>

        <div className="card" style={{ background: '#111827', border: '1px solid #1f2937' }}>
          <div className="card-content">
            <h3 style={{ marginBottom: '1rem', color: '#f8fafc' }}>Admin Panel</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
              This is a placeholder admin page. You can now access all routes without authentication issues.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#0b1220', borderRadius: '0.5rem', border: '1px solid #1f2937', color: '#e5e7eb' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>📚 Course Management</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                  Create, edit, and manage courses
                </p>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: '#0b1220', borderRadius: '0.5rem', border: '1px solid #1f2937', color: '#e5e7eb' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>👥 User Management</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                  View and manage user accounts
                </p>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: '#0b1220', borderRadius: '0.5rem', border: '1px solid #1f2937', color: '#e5e7eb' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>📊 Analytics</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                  View platform statistics and reports
                </p>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: '#0b1220', borderRadius: '0.5rem', border: '1px solid #1f2937', color: '#e5e7eb' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>⚙️ Settings</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
                  Configure platform settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;