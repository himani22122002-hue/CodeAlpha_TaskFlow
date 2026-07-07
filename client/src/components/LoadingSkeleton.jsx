import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-2xl w-full"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
