// src/components/admin/EmptyState.jsx
import React from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const EmptyState = ({
  icon = 'FileText',
  title = 'No items found',
  description = 'Get started by creating your first item.',
  action,
  secondaryAction,
  className = '',
  size = 'md'
}) => {
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
        <div className="p-3 bg-gray-100 rounded-full">
          <Icon 
            name={icon} 
            size={sizes.icon} 
            className="text-gray-400"
          />
        </div>
        
        <h3 className={cn('font-semibold text-gray-900', sizes.title)}>
          {title}
        </h3>
        
        {description && (
          <p className={cn('text-gray-600 max-w-sm', sizes.description)}>
            {description}
          </p>
        )}
        
        {(action || secondaryAction) && (
          <div className="flex gap-3 mt-4">
            {action && (
              <Button
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
                onClick={action.onClick}
              >
                {action.icon && <Icon name={action.icon} size={16} />}
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'ghost'}
                size={secondaryAction.size || 'md'}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.icon && <Icon name={secondaryAction.icon} size={16} />}
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;