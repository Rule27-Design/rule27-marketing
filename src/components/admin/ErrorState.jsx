// src/components/admin/ErrorState.jsx
import React from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const ErrorState = ({
  error,
  title = 'Something went wrong',
  description,
  icon = 'AlertCircle',
  onRetry,
  actions = [],
  showDetails = false,
  className = '',
  size = 'md'
}) => {
  const defaultDescription = description || error?.message || 'An unexpected error occurred. Please try again.';
  
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 48,
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-2'
    },
    md: {
      container: 'py-12 px-6',
      icon: 64,
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-3'
    },
    lg: {
      container: 'py-16 px-8',
      icon: 80,
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-4'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizes.container,
      className
    )}>
      <div className={cn('flex flex-col items-center', sizes.spacing)}>
        <div className="p-3 bg-red-100 rounded-full">
          <Icon 
            name={icon} 
            size={sizes.icon} 
            className="text-red-600"
          />
        </div>
        
        <h3 className={cn('font-semibold text-gray-900', sizes.title)}>
          {title}
        </h3>
        
        <p className={cn('text-gray-600 max-w-sm', sizes.description)}>
          {defaultDescription}
        </p>

        {showDetails && error?.stack && (
          <details className="mt-4 text-left max-w-2xl w-full">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Show error details
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-x-auto">
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="flex gap-3 mt-4">
          {onRetry && (
            <Button
              variant="primary"
              size={size}
              onClick={onRetry}
            >
              <Icon name="RotateCw" size={16} />
              Try again
            </Button>
          )}
          
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'ghost'}
              size={action.size || size}
              onClick={action.onClick}
            >
              {action.icon && <Icon name={action.icon} size={16} />}
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;