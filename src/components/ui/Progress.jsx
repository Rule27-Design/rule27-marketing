// src/components/ui/Progress.jsx
import React from 'react';

const Progress = ({ 
  value = 0, 
  max = 100, 
  className = '', 
  color = 'accent',
  size = 'md',
  showLabel = false,
  label = null
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };

  const colorClasses = {
    accent: 'bg-accent',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} ${className}`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default Progress;