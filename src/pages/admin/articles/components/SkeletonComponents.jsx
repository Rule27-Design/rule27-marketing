// src/pages/admin/articles/components/SkeletonComponents.jsx - Enhanced skeleton loading states
import React from 'react';
import { cn } from '../../../../utils/cn';

// Base skeleton component with animations
const Skeleton = ({ 
  className = '', 
  children,
  animate = true,
  variant = 'pulse' // 'pulse', 'wave', 'shimmer'
}) => {
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    shimmer: 'animate-shimmer'
  };

  return (
    <div 
      className={cn(
        'bg-gray-200 rounded',
        animate && animationClasses[variant],
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

// Articles table skeleton with realistic proportions
export const ArticleTableSkeleton = ({ rows = 10, showHeader = true }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    {showHeader && (
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    )}
    
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, i) => (
        <ArticleRowSkeleton key={i} delay={i * 50} />
      ))}
    </div>
  </div>
);

// Individual article row skeleton
const ArticleRowSkeleton = ({ delay = 0 }) => (
  <div 
    className="flex items-center space-x-4 p-4 animate-in fade-in-0 duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Selection checkbox */}
    <Skeleton className="w-4 h-4 rounded" />
    
    {/* Featured image */}
    <Skeleton className="w-16 h-12 rounded" />
    
    {/* Article info */}
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex space-x-2">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    </div>
    
    {/* Author */}
    <div className="flex items-center space-x-2">
      <Skeleton className="w-6 h-6 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
    
    {/* Category */}
    <Skeleton className="h-3 w-20" />
    
    {/* Status */}
    <Skeleton className="h-6 w-16 rounded-full" />
    
    {/* Stats */}
    <div className="text-center space-y-1">
      <Skeleton className="h-3 w-8 mx-auto" />
      <Skeleton className="h-3 w-6 mx-auto" />
    </div>
    
    {/* Updated date */}
    <Skeleton className="h-3 w-12" />
    
    {/* Actions */}
    <div className="flex space-x-1">
      <Skeleton className="w-6 h-6 rounded" />
      <Skeleton className="w-6 h-6 rounded" />
      <Skeleton className="w-6 h-6 rounded" />
    </div>
  </div>
);

// Article editor skeleton
export const ArticleEditorSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
      
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-6 border-b bg-gray-50">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Tab navigation skeleton */}
      <div className="border-b bg-white">
        <nav className="flex space-x-8 px-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-4 px-2">
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </nav>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={`h-4 ${i === 2 || i === 5 ? 'w-3/4' : 'w-full'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex space-x-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Article filters/toolbar skeleton
export const ArticleToolbarSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  </div>
);

// Article metrics skeleton
export const ArticleMetricsSkeleton = ({ variant = 'default' }) => {
  const columns = variant === 'compact' ? 4 : variant === 'detailed' ? 4 : 4;
  
  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
        {Array.from({ length: columns }).map((_, i) => (
          <MetricCardSkeleton key={i} delay={i * 100} />
        ))}
      </div>
      
      {variant === 'detailed' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <MetricCardSkeleton key={i} delay={(columns + i) * 100} />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual metric card skeleton
const MetricCardSkeleton = ({ delay = 0 }) => (
  <div 
    className="bg-white rounded-lg border p-4 animate-in fade-in-0 duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="w-6 h-4" />
    </div>
    
    <div className="space-y-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

// Article grid skeleton for grid view
export const ArticleGridSkeleton = ({ items = 12 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: items }).map((_, i) => (
      <ArticleCardSkeleton key={i} delay={i * 50} />
    ))}
  </div>
);

// Individual article card skeleton
const ArticleCardSkeleton = ({ delay = 0 }) => (
  <div 
    className="bg-white rounded-lg shadow border p-4 space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Image */}
    <Skeleton className="w-full h-48 rounded-lg" />
    
    {/* Category badge */}
    <Skeleton className="h-5 w-20 rounded-full" />
    
    {/* Title */}
    <div className="space-y-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
    
    {/* Excerpt */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    
    {/* Footer */}
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center space-x-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
);

// Search results skeleton
export const SearchResultsSkeleton = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div 
        key={i}
        className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg animate-in fade-in-0 duration-300"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <Skeleton className="w-20 h-16 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex space-x-4 mt-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Progressive loading skeleton (starts with fewer elements, adds more)
export const ProgressiveArticlesSkeleton = () => {
  const [visibleRows, setVisibleRows] = React.useState(3);

  React.useEffect(() => {
    const intervals = [
      setTimeout(() => setVisibleRows(6), 300),
      setTimeout(() => setVisibleRows(10), 600),
    ];

    return () => intervals.forEach(clearTimeout);
  }, []);

  return <ArticleTableSkeleton rows={visibleRows} />;
};

// Skeleton with content awareness (adjusts based on viewport)
export const ResponsiveArticlesSkeleton = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? (
    <ArticleGridSkeleton items={6} />
  ) : (
    <ArticleTableSkeleton rows={8} />
  );
};

// Skeleton component with error boundary
export const SafeSkeleton = ({ children, fallback = null }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [children]);

  if (hasError) {
    return fallback || <div className="h-32 bg-gray-100 rounded animate-pulse" />;
  }

  try {
    return children;
  } catch (error) {
    setHasError(true);
    return fallback || <div className="h-32 bg-gray-100 rounded animate-pulse" />;
  }
};

// Custom CSS animations (add to your global styles)
const skeletonStyles = `
/* Wave animation */
@keyframes wave {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

.animate-wave {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  background-size: 200% 100%;
  animation: wave 1.6s linear infinite;
}

/* Shimmer animation */
@keyframes shimmer {
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}

.animate-shimmer {
  background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
  background-size: 800px 104px;
  animation: shimmer 1.2s ease-in-out infinite;
}

/* Staggered fade-in */
.animate-in {
  animation-fill-mode: both;
}

.fade-in-0 {
  animation-name: fadeIn;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slide-in-from-bottom-1 {
  animation-name: slideInFromBottom;
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default Skeleton;