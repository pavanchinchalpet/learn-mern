import React from 'react';

export const SkeletonCard = ({ height = '200px' }) => (
  <div style={{
    backgroundColor: '#111827',
    borderRadius: '1rem',
    border: '1px solid #1f2937',
    overflow: 'hidden',
    height
  }}>
    <div style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #0b1220 0%, #0f172a 100%)',
      borderBottom: '1px solid #1f2937'
    }}>
      <div style={{ 
        width: '60%', 
        height: '20px', 
        background: '#1f2937', 
        borderRadius: '4px',
        marginBottom: '0.5rem',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{ 
        width: '40%', 
        height: '14px', 
        background: '#1f2937', 
        borderRadius: '4px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
    <div style={{ padding: '2rem' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          padding: '1.25rem',
          border: '1px solid #1f2937',
          borderRadius: '0.75rem'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: '#1f2937', 
            borderRadius: '8px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ 
              width: '70%', 
              height: '16px', 
              background: '#1f2937', 
              borderRadius: '4px',
              marginBottom: '0.5rem',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{ 
              width: '50%', 
              height: '12px', 
              background: '#1f2937', 
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStat = () => (
  <div style={{
    backgroundColor: '#111827',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    border: '1px solid #1f2937'
  }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '1.5rem' 
    }}>
      <div style={{ 
        width: '80px', 
        height: '20px', 
        background: '#1f2937', 
        borderRadius: '4px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{ 
        width: '30px', 
        height: '30px', 
        background: '#1f2937', 
        borderRadius: '4px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
    <div style={{ 
      width: '120px', 
      height: '40px', 
      background: '#1f2937', 
      borderRadius: '4px',
      marginBottom: '0.5rem',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
    <div style={{ 
      width: '100px', 
      height: '16px', 
      background: '#1f2937', 
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
  </div>
);

export const QuizSkeleton = () => (
  <div style={{ background: '#0f172a', minHeight: '100vh', color: '#e5e7eb' }}>
    <div style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            backgroundColor: '#111827',
            borderRadius: '1rem',
            border: '1px solid #1f2937',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: 80, height: 20, background: '#1f2937', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: 40, height: 20, background: '#1f2937', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
            <div style={{ width: '70%', height: 24, background: '#1f2937', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ width: '90%', height: 14, background: '#1f2937', borderRadius: 4, marginBottom: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ width: '85%', height: 14, background: '#1f2937', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonCard;
