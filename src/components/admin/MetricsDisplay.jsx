// src/components/admin/MetricsDisplay.jsx
import React from 'react';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const MetricsDisplay = ({
  metrics = [],
  columns = 4,
  loading = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-3',
      value: 'text-xl',
      label: 'text-xs',
      icon: 16,
      trend: 'text-xs'
    },
    md: {
      container: 'p-4',
      value: 'text-2xl',
      label: 'text-sm',
      icon: 20,
      trend: 'text-sm'
    },
    lg: {
      container: 'p-6',
      value: 'text-3xl',
      label: 'text-base',
      icon: 24,
      trend: 'text-base'
    }
  };

  const sizes = sizeClasses[size];

  const formatValue = (value, format) => {
    if (format === 'number') {
      return new Intl.NumberFormat().format(value);
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    if (format === 'duration') {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return value;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend, positive = true) => {
    if (trend > 0) return positive ? 'text-green-600' : 'text-red-600';
    if (trend < 0) return positive ? 'text-red-600' : 'text-green-600';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className={cn(`grid gap-4 grid-cols-${columns}`, className)}>
        {[...Array(columns)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg animate-pulse">
            <div className={sizes.container}>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      'grid gap-4',
      `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
      className
    )}>
      {metrics.map((metric, index) => (
        <div
          key={metric.id || index}
          className={cn(
            'bg-white border rounded-lg transition-all hover:shadow-md',
            metric.className
          )}
        >
          <div className={sizes.container}>
            <div className="flex items-start justify-between mb-2">
              <span className={cn(
                'text-gray-600 font-medium uppercase tracking-wider',
                sizes.label
              )}>
                {metric.label}
              </span>
              {metric.icon && (
                <Icon 
                  name={metric.icon} 
                  size={sizes.icon} 
                  className="text-gray-400"
                />
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <span className={cn(
                'font-bold text-gray-900',
                sizes.value
              )}>
                {formatValue(metric.value, metric.format)}
              </span>
              
              {metric.trend !== undefined && (
                <div className={cn(
                  'flex items-center gap-1',
                  getTrendColor(metric.trend, metric.positiveIsUp),
                  sizes.trend
                )}>
                  <Icon name={getTrendIcon(metric.trend)} size={14} />
                  <span className="font-medium">
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
              )}
            </div>

            {metric.subtitle && (
              <p className={cn('text-gray-500 mt-1', sizes.label)}>
                {metric.subtitle}
              </p>
            )}

            {metric.progress !== undefined && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, metric.progress)}%` }}
                  />
                </div>
                {metric.progressLabel && (
                  <p className={cn('text-gray-500 mt-1', sizes.label)}>
                    {metric.progressLabel}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsDisplay;