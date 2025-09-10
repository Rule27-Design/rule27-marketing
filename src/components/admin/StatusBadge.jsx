// src/components/admin/StatusBadge.jsx
import React from 'react';
import { cn } from '../../utils/cn';

const statusConfig = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: '✏️'
  },
  pending_approval: {
    label: 'Pending Approval',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '⏳'
  },
  approved: {
    label: 'Approved',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '✓'
  },
  published: {
    label: 'Published',
    className: 'bg-green-100 text-green-800 border-green-300',
    icon: '🚀'
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-600 border-gray-300',
    icon: '📦'
  }
};

const StatusBadge = ({ 
  status, 
  size = 'sm',
  showIcon = false,
  customConfig = {},
  className = '',
  onClick
}) => {
  const config = { ...statusConfig, ...customConfig };
  const statusInfo = config[status] || config.draft;

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2.5 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2'
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 font-medium border rounded-full transition-all',
        sizeClasses[size],
        statusInfo.className,
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {showIcon && <span className="text-xs">{statusInfo.icon}</span>}
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;