// src/pages/admin/articles/components/ArticleStatusBadge.jsx - Reusable status component
import React from 'react';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils/cn';

export const ArticleStatusBadge = ({ 
  status, 
  size = 'default',
  showIcon = false,
  className = '' 
}) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      shortLabel: 'Draft',
      bgClass: 'bg-gray-100',
      textClass: 'text-gray-800',
      borderClass: 'border-gray-200',
      icon: 'FileText',
      description: 'Article is being written'
    },
    pending_approval: {
      label: 'Pending Approval',
      shortLabel: 'Pending',
      bgClass: 'bg-yellow-100',
      textClass: 'text-yellow-800',
      borderClass: 'border-yellow-200',
      icon: 'Clock',
      description: 'Waiting for admin approval'
    },
    approved: {
      label: 'Approved',
      shortLabel: 'Approved',
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-800',
      borderClass: 'border-blue-200',
      icon: 'CheckCircle',
      description: 'Ready to publish'
    },
    published: {
      label: 'Published',
      shortLabel: 'Live',
      bgClass: 'bg-green-100',
      textClass: 'text-green-800',
      borderClass: 'border-green-200',
      icon: 'Globe',
      description: 'Live on website'
    },
    archived: {
      label: 'Archived',
      shortLabel: 'Archived',
      bgClass: 'bg-red-100',
      textClass: 'text-red-800',
      borderClass: 'border-red-200',
      icon: 'Archive',
      description: 'Removed from public view'
    },
    scheduled: {
      label: 'Scheduled',
      shortLabel: 'Scheduled',
      bgClass: 'bg-purple-100',
      textClass: 'text-purple-800',
      borderClass: 'border-purple-200',
      icon: 'Calendar',
      description: 'Scheduled for future publication'
    }
  };

  const config = statusConfig[status] || statusConfig.draft;
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    default: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const iconSizes = {
    xs: 10,
    sm: 12,
    default: 12,
    lg: 14
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        config.bgClass,
        config.textClass,
        config.borderClass,
        sizeClasses[size],
        className
      )}
      title={config.description}
    >
      {showIcon && (
        <Icon 
          name={config.icon} 
          size={iconSizes[size]} 
          className="mr-1" 
        />
      )}
      {size === 'xs' ? config.shortLabel : config.label}
    </span>
  );
};

// Status indicator dot (for compact displays)
export const ArticleStatusDot = ({ status, className = '' }) => {
  const statusColors = {
    draft: 'bg-gray-400',
    pending_approval: 'bg-yellow-400',
    approved: 'bg-blue-400',
    published: 'bg-green-400',
    archived: 'bg-red-400',
    scheduled: 'bg-purple-400'
  };

  const config = {
    draft: 'Draft - being written',
    pending_approval: 'Pending approval',
    approved: 'Approved - ready to publish',
    published: 'Published - live on website',
    archived: 'Archived - removed from public view',
    scheduled: 'Scheduled - will be published automatically'
  };

  return (
    <div 
      className={cn(
        'w-2 h-2 rounded-full',
        statusColors[status] || statusColors.draft,
        className
      )}
      title={config[status] || config.draft}
    />
  );
};

// Status progress indicator
export const ArticleStatusProgress = ({ status, className = '' }) => {
  const statusOrder = ['draft', 'pending_approval', 'approved', 'published'];
  const currentIndex = statusOrder.indexOf(status);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;

  if (status === 'archived') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className="w-full bg-red-100 rounded-full h-2">
          <div className="bg-red-500 h-2 rounded-full w-full"></div>
        </div>
        <span className="text-xs text-red-600 font-medium">Archived</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-accent h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs text-gray-600 font-medium">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

export default ArticleStatusBadge;