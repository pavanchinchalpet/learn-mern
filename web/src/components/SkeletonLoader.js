import React, { memo } from 'react';

const SkeletonCard = memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  </div>
));

const QuizSkeleton = memo(() => (
  <div className="quiz-page" style={{ background: '#0f172a', color: '#e5e7eb' }}>
    <div className="quiz-content">
      {/* Header Skeleton */}
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #111827, #0b1220)', borderBottom: '1px solid #1f2937', padding: '3rem 2rem' }}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-700 rounded w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-80 mx-auto"></div>
        </div>
      </div>
      
      {/* Quiz Categories Grid Skeleton */}
      <div className="quiz-grid" style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card animate-pulse" style={{ border: '1px solid #1f2937', background: '#111827', borderRadius: '0.5rem' }}>
              <div className="card-header" style={{ background: 'linear-gradient(135deg, #0b1220, #0f172a)', borderBottom: '1px solid #1f2937', padding: '1.5rem' }}>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-12"></div>
                </div>
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="card-content" style={{ padding: '1.5rem' }}>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-10 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';
QuizSkeleton.displayName = 'QuizSkeleton';

export { SkeletonCard, QuizSkeleton };
