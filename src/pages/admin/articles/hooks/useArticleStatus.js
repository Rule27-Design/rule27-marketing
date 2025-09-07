// src/pages/admin/articles/hooks/useArticleStatus.js - Status management utility
import { useMemo } from 'react';

export const useArticleStatus = () => {
  // Status configuration with colors, labels, and allowed transitions
  const statusConfig = useMemo(() => ({
    draft: {
      label: 'Draft',
      shortLabel: 'Draft',
      color: 'gray',
      bgClass: 'bg-gray-100',
      textClass: 'text-gray-800',
      allowedTransitions: ['pending_approval', 'published'],
      icon: 'FileText',
      description: 'Article is being written'
    },
    pending_approval: {
      label: 'Pending Approval',
      shortLabel: 'Pending',
      color: 'yellow',
      bgClass: 'bg-yellow-100',
      textClass: 'text-yellow-800',
      allowedTransitions: ['approved', 'draft'],
      icon: 'Clock',
      description: 'Waiting for admin approval'
    },
    approved: {
      label: 'Approved',
      shortLabel: 'Approved',
      color: 'blue',
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-800',
      allowedTransitions: ['published', 'draft'],
      icon: 'CheckCircle',
      description: 'Ready to publish'
    },
    published: {
      label: 'Published',
      shortLabel: 'Live',
      color: 'green',
      bgClass: 'bg-green-100',
      textClass: 'text-green-800',
      allowedTransitions: ['archived'],
      icon: 'Globe',
      description: 'Live on website'
    },
    archived: {
      label: 'Archived',
      shortLabel: 'Archived',
      color: 'red',
      bgClass: 'bg-red-100',
      textClass: 'text-red-800',
      allowedTransitions: ['draft'],
      icon: 'Archive',
      description: 'Removed from public view'
    }
  }), []);

  // Get status configuration for a specific status
  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.draft;
  };

  // Get badge class for status
  const getStatusBadgeClass = (status) => {
    const config = getStatusConfig(status);
    return `px-2 py-1 text-xs rounded-full ${config.bgClass} ${config.textClass}`;
  };

  // Check if user can perform a status transition
  const canTransitionTo = (currentStatus, newStatus, userRole) => {
    const config = getStatusConfig(currentStatus);
    
    // Admins can make any transition
    if (userRole === 'admin') {
      return config.allowedTransitions.includes(newStatus) || newStatus === 'published';
    }
    
    // Contributors have limited transitions
    if (userRole === 'contributor') {
      // Can only submit drafts for approval or revert to draft
      if (currentStatus === 'draft' && newStatus === 'pending_approval') return true;
      if (currentStatus === 'pending_approval' && newStatus === 'draft') return true;
      return false;
    }
    
    return false;
  };

  // Get available actions for a status and user role
  const getAvailableActions = (currentStatus, userRole, isAuthor = false) => {
    const actions = [];
    
    if (userRole === 'admin') {
      switch (currentStatus) {
        case 'draft':
        case 'pending_approval':
        case 'approved':
          actions.push({
            status: 'published',
            label: 'Publish',
            variant: 'success',
            icon: 'Globe'
          });
          break;
        case 'published':
          actions.push({
            status: 'archived',
            label: 'Archive',
            variant: 'warning',
            icon: 'Archive'
          });
          break;
        case 'archived':
          actions.push({
            status: 'draft',
            label: 'Restore',
            variant: 'outline',
            icon: 'RotateCcw'
          });
          break;
      }
    } else if (userRole === 'contributor' && isAuthor) {
      if (currentStatus === 'draft') {
        actions.push({
          status: 'pending_approval',
          label: 'Submit',
          variant: 'outline',
          icon: 'Send'
        });
      }
    }
    
    return actions;
  };

  // Get status statistics from articles array
  const getStatusStats = (articles) => {
    const stats = {};
    
    Object.keys(statusConfig).forEach(status => {
      stats[status] = articles.filter(article => article.status === status).length;
    });
    
    stats.total = articles.length;
    return stats;
  };

  // Check if status indicates article is publicly visible
  const isPubliclyVisible = (status) => {
    return status === 'published';
  };

  // Check if status allows editing
  const isEditable = (status, userRole, isAuthor = false) => {
    if (userRole === 'admin') return true;
    if (userRole === 'contributor' && isAuthor) {
      return ['draft', 'pending_approval'].includes(status);
    }
    return false;
  };

  return {
    statusConfig,
    getStatusConfig,
    getStatusBadgeClass,
    canTransitionTo,
    getAvailableActions,
    getStatusStats,
    isPubliclyVisible,
    isEditable
  };
};