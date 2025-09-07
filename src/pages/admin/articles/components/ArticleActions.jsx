// src/pages/admin/articles/components/ArticleActions.jsx - Action buttons
import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils/cn';

export const ArticleActions = ({
  article,
  userProfile,
  onEdit,
  onDelete,
  onStatusChange,
  variant = 'default', // 'default', 'compact', 'dropdown'
  className = ''
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Get available status transitions based on current status and user role
  const getAvailableActions = () => {
    const actions = [];
    
    if (userProfile?.role === 'admin') {
      switch (article.status) {
        case 'draft':
        case 'pending_approval':
        case 'approved':
          actions.push({
            type: 'status',
            status: 'published',
            label: 'Publish',
            variant: 'success',
            icon: 'Globe',
            className: 'bg-green-500 hover:bg-green-600 text-white'
          });
          break;
        case 'published':
          actions.push({
            type: 'status',
            status: 'archived',
            label: 'Archive',
            variant: 'warning',
            icon: 'Archive',
            className: 'border-orange-300 text-orange-600 hover:bg-orange-50'
          });
          break;
        case 'archived':
          actions.push({
            type: 'status',
            status: 'draft',
            label: 'Restore',
            variant: 'outline',
            icon: 'RotateCcw',
            className: 'border-blue-300 text-blue-600 hover:bg-blue-50'
          });
          break;
      }
    } else if (userProfile?.role === 'contributor' && article.author_id === userProfile.id) {
      if (article.status === 'draft') {
        actions.push({
          type: 'status',
          status: 'pending_approval',
          label: 'Submit',
          variant: 'outline',
          icon: 'Send',
          className: 'border-blue-300 text-blue-600 hover:bg-blue-50'
        });
      }
    }
    
    return actions;
  };

  const availableActions = getAvailableActions();
  const canEdit = userProfile?.role === 'admin' || 
                 (userProfile?.role === 'contributor' && article.author_id === userProfile.id);
  const canDelete = userProfile?.role === 'admin' || 
                   (userProfile?.role === 'contributor' && article.author_id === userProfile.id);

  // Compact variant - just icons
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-1', className)}>
        {canEdit && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onEdit(article)}
            title="Edit article"
            className="p-1 hover:bg-gray-100"
          >
            <Icon name="Edit" size={14} />
          </Button>
        )}
        
        {availableActions.length > 0 && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onStatusChange(article.id, availableActions[0].status)}
            title={availableActions[0].label}
            className="p-1 hover:bg-gray-100"
          >
            <Icon name={availableActions[0].icon} size={14} />
          </Button>
        )}
        
        {canDelete && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onDelete(article.id)}
            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete article"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        )}
      </div>
    );
  }

  // Dropdown variant - more actions in a menu
  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-1"
        >
          <Icon name="MoreHorizontal" size={16} />
        </Button>
        
        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-20">
              <div className="py-1">
                {canEdit && (
                  <button
                    onClick={() => {
                      onEdit(article);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon name="Edit" size={14} className="mr-2" />
                    Edit Article
                  </button>
                )}
                
                {availableActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onStatusChange(article.id, action.status);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon name={action.icon} size={14} className="mr-2" />
                    {action.label}
                  </button>
                ))}
                
                <div className="border-t border-gray-100 my-1" />
                
                <button
                  onClick={() => {
                    // Duplicate action
                    console.log('Duplicate article:', article.id);
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Icon name="Copy" size={14} className="mr-2" />
                  Duplicate
                </button>
                
                {canDelete && (
                  <button
                    onClick={() => {
                      onDelete(article.id);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={14} className="mr-2" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default variant - full buttons
  return (
    <div className={cn('flex items-center justify-end space-x-1', className)}>
      {/* Status Actions */}
      {availableActions.map((action, index) => (
        <Button
          key={index}
          size="xs"
          variant={action.variant}
          onClick={() => onStatusChange(article.id, action.status)}
          className={cn('text-xs px-2 py-1', action.className)}
        >
          {action.label}
        </Button>
      ))}
      
      {/* Edit Action */}
      {canEdit && (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => onEdit(article)}
          title="Edit article"
          className="p-1"
        >
          <Icon name="Edit" size={14} />
        </Button>
      )}
      
      {/* Delete Action */}
      {canDelete && (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => onDelete(article.id)}
          className="text-red-600 hover:text-red-700 p-1"
          title="Delete article"
        >
          <Icon name="Trash2" size={14} />
        </Button>
      )}
    </div>
  );
};

// Quick status change buttons
export const QuickStatusActions = ({ 
  article, 
  userProfile, 
  onStatusChange,
  className = '' 
}) => {
  const isAdmin = userProfile?.role === 'admin';
  const isAuthor = article.author_id === userProfile?.id;
  
  if (!isAdmin && !isAuthor) return null;

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {isAdmin && article.status === 'pending_approval' && (
        <>
          <Button
            size="xs"
            onClick={() => onStatusChange(article.id, 'approved')}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
          >
            Approve
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => onStatusChange(article.id, 'draft')}
            className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs px-2 py-1"
          >
            Back to Draft
          </Button>
        </>
      )}
      
      {isAdmin && article.status === 'approved' && (
        <Button
          size="xs"
          onClick={() => onStatusChange(article.id, 'published')}
          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
        >
          Publish Now
        </Button>
      )}
      
      {isAuthor && article.status === 'draft' && (
        <Button
          size="xs"
          variant="outline"
          onClick={() => onStatusChange(article.id, 'pending_approval')}
          className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1"
        >
          Submit for Review
        </Button>
      )}
    </div>
  );
};

// Bulk actions for multiple articles
export const BulkArticleActions = ({ 
  selectedArticles, 
  userProfile, 
  onBulkStatusChange,
  onBulkDelete,
  className = '' 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  if (selectedArticles.length === 0) return null;

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm text-gray-600">
        {selectedArticles.length} selected
      </span>
      
      <div className="relative">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowDropdown(!showDropdown)}
          iconName="ChevronDown"
        >
          Bulk Actions
        </Button>
        
        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-20">
              <div className="py-1">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onBulkStatusChange(selectedArticles, 'published');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon name="Globe" size={14} className="mr-2" />
                      Publish All
                    </button>
                    <button
                      onClick={() => {
                        onBulkStatusChange(selectedArticles, 'draft');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon name="FileText" size={14} className="mr-2" />
                      Move to Draft
                    </button>
                    <button
                      onClick={() => {
                        onBulkStatusChange(selectedArticles, 'archived');
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon name="Archive" size={14} className="mr-2" />
                      Archive All
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        onBulkDelete(selectedArticles);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={14} className="mr-2" />
                      Delete All
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleActions;