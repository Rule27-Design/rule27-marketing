// src/components/admin/SkeletonTable.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const SkeletonTable = ({
  rows = 5,
  columns = 4,
  showCheckbox = true,
  showActions = true,
  className = ''
}) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="border rounded-t-lg bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          {showCheckbox && (
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          )}
          {[...Array(columns)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 rounded animate-pulse"
              style={{ width: `${Math.random() * 30 + 70}px` }}
            />
          ))}
          {showActions && (
            <div className="ml-auto h-4 w-20 bg-gray-200 rounded animate-pulse" />
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="border-x border-b rounded-b-lg divide-y">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex items-center gap-4">
              {showCheckbox && (
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              )}
              {[...Array(columns)].map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1"
                >
                  <div
                    className="h-4 bg-gray-200 rounded animate-pulse"
                    style={{
                      width: `${Math.random() * 40 + 60}%`,
                      animationDelay: `${(rowIndex + colIndex) * 100}ms`
                    }}
                  />
                </div>
              ))}
              {showActions && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for cards/grid view
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={cn('bg-white border rounded-lg p-6', className)}>
      <div className="space-y-4">
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for metrics
export const SkeletonMetrics = ({ count = 4, className = '' }) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white border rounded-lg p-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for filters
export const SkeletonFilters = ({ className = '' }) => {
  return (
    <div className={cn('bg-white border rounded-lg p-4', className)}>
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

// Skeleton for editor form
export const SkeletonForm = ({ fields = 5, className = '' }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
        </div>
      ))}
    </div>
  );
};

// Progressive loading skeleton
export const ProgressiveSkeleton = ({ 
  stage = 1, 
  className = '' 
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Stage 1: Basic structure */}
      <SkeletonFilters />
      
      {/* Stage 2: Metrics */}
      {stage >= 2 && <SkeletonMetrics />}
      
      {/* Stage 3: Content */}
      {stage >= 3 && <SkeletonTable />}
    </div>
  );
};

export default SkeletonTable;