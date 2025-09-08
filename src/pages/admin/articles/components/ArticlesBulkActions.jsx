// src/pages/admin/articles/components/ArticlesBulkActions.jsx - Enhanced bulk operations
import React, { useState, useMemo } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils/cn';

const ArticlesBulkActions = ({ 
  selectedArticles = [], 
  userProfile, 
  onBulkStatusChange,
  onBulkDelete,
  onClearSelection,
  getAvailableActions
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Calculate what actions are available based on selected articles and user permissions
  const availableActions = useMemo(() => {
    if (selectedArticles.length === 0) return [];
    
    const isAdmin = userProfile?.role === 'admin';
    const isContributor = userProfile?.role === 'contributor';
    
    const actions = [];
    
    if (isAdmin) {
      actions.push(
        {
          id: 'publish',
          label: 'Publish All',
          icon: 'Globe',
          status: 'published',
          variant: 'success',
          className: 'bg-green-600 hover:bg-green-700 text-white',
          confirmMessage: `Publish ${selectedArticles.length} article(s)?`
        },
        {
          id: 'approve',
          label: 'Approve All',
          icon: 'CheckCircle',
          status: 'approved',
          variant: 'default',
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
          confirmMessage: `Approve ${selectedArticles.length} article(s)?`
        },
        {
          id: 'draft',
          label: 'Move to Draft',
          icon: 'FileText',
          status: 'draft',
          variant: 'outline',
          className: 'border-gray-300 text-gray-700 hover:bg-gray-50',
          confirmMessage: `Move ${selectedArticles.length} article(s) to draft?`
        },
        {
          id: 'archive',
          label: 'Archive All',
          icon: 'Archive',
          status: 'archived',
          variant: 'warning',
          className: 'bg-orange-600 hover:bg-orange-700 text-white',
          confirmMessage: `Archive ${selectedArticles.length} article(s)?`
        }
      );
    }
    
    if (isContributor) {
      actions.push({
        id: 'submit',
        label: 'Submit for Review',
        icon: 'Send',
        status: 'pending_approval',
        variant: 'outline',
        className: 'border-blue-300 text-blue-700 hover:bg-blue-50',
        confirmMessage: `Submit ${selectedArticles.length} article(s) for review?`
      });
    }
    
    return actions;
  }, [selectedArticles.length, userProfile?.role]);

  // Additional bulk operations
  const additionalActions = useMemo(() => [
    {
      id: 'duplicate',
      label: 'Duplicate Selected',
      icon: 'Copy',
      action: () => console.log('Duplicate action'),
      confirmMessage: `Create copies of ${selectedArticles.length} article(s)?`
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: 'Download',
      action: () => console.log('Export action'),
      confirmMessage: null // No confirmation needed for export
    },
    {
      id: 'feature',
      label: 'Mark as Featured',
      icon: 'Star',
      action: () => console.log('Feature action'),
      confirmMessage: `Mark ${selectedArticles.length} article(s) as featured?`
    }
  ], [selectedArticles.length]);

  // Handle status change with confirmation
  const handleStatusChange = (action) => {
    if (action.confirmMessage) {
      setConfirmAction(action);
    } else {
      onBulkStatusChange(action.status);
    }
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    setConfirmAction({
      id: 'delete',
      label: 'Delete Articles',
      confirmMessage: `Permanently delete ${selectedArticles.length} article(s)? This action cannot be undone.`,
      action: onBulkDelete,
      isDangerous: true
    });
  };

  // Execute confirmed action
  const executeAction = () => {
    if (confirmAction) {
      if (confirmAction.status) {
        onBulkStatusChange(confirmAction.status);
      } else if (confirmAction.action) {
        confirmAction.action();
      }
      setConfirmAction(null);
    }
  };

  // Cancel action
  const cancelAction = () => {
    setConfirmAction(null);
  };

  if (selectedArticles.length === 0) return null;

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={20} className="text-blue-600" />
              <span className="font-medium text-blue-900">
                {selectedArticles.length} article{selectedArticles.length === 1 ? '' : 's'} selected
              </span>
            </div>

            {/* Quick actions */}
            <div className="flex items-center space-x-2">
              {availableActions.slice(0, 2).map((action) => (
                <Button
                  key={action.id}
                  size="sm"
                  variant={action.variant}
                  onClick={() => handleStatusChange(action)}
                  className={cn('text-xs', action.className)}
                  iconName={action.icon}
                >
                  {action.label}
                </Button>
              ))}

              {availableActions.length > 2 && (
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    iconName="ChevronDown"
                    className="text-xs"
                  >
                    More Actions
                  </Button>

                  {showActionsMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowActionsMenu(false)}
                      />
                      <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-20">
                        <div className="py-1">
                          {availableActions.slice(2).map((action) => (
                            <button
                              key={action.id}
                              onClick={() => {
                                handleStatusChange(action);
                                setShowActionsMenu(false);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Icon name={action.icon} size={14} className="mr-2" />
                              {action.label}
                            </button>
                          ))}

                          {additionalActions.length > 0 && (
                            <>
                              <div className="border-t border-gray-100 my-1" />
                              {additionalActions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={() => {
                                    if (action.confirmMessage) {
                                      setConfirmAction(action);
                                    } else {
                                      action.action();
                                    }
                                    setShowActionsMenu(false);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Icon name={action.icon} size={14} className="mr-2" />
                                  {action.label}
                                </button>
                              ))}
                            </>
                          )}

                          {userProfile?.role === 'admin' && (
                            <>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => {
                                  handleDelete();
                                  setShowActionsMenu(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Icon name="Trash2" size={14} className="mr-2" />
                                Delete Selected
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Progress indicator for large selections */}
            {selectedArticles.length > 10 && (
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Large selection - operations may take time
              </div>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear Selection
            </Button>
          </div>
        </div>

        {/* Selection summary */}
        {selectedArticles.length > 5 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-xs text-blue-700">
              Selected articles will be processed in the background. You can continue working while the operation completes.
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={cn(
                  'p-2 rounded-full',
                  confirmAction.isDangerous 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-blue-100 text-blue-600'
                )}>
                  <Icon 
                    name={confirmAction.icon || (confirmAction.isDangerous ? 'AlertTriangle' : 'CheckCircle')} 
                    size={20} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirm Action
                  </h3>
                  <p className="text-sm text-gray-500">
                    {confirmAction.label}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {confirmAction.confirmMessage}
              </p>

              {confirmAction.isDangerous && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
                    <div className="text-sm text-red-700">
                      <strong>Warning:</strong> This action cannot be undone. Please make sure you want to proceed.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelAction}
                >
                  Cancel
                </Button>
                <Button
                  variant={confirmAction.isDangerous ? "destructive" : "default"}
                  onClick={executeAction}
                  className={
                    confirmAction.isDangerous 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-accent hover:bg-accent/90"
                  }
                >
                  {confirmAction.isDangerous ? 'Delete Articles' : 'Confirm'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Progress indicator component for long-running operations
export const BulkOperationProgress = ({ 
  operation, 
  progress, 
  total, 
  onCancel 
}) => {
  const percentage = Math.round((progress / total) * 100);
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="animate-spin">
            <Icon name="RefreshCw" size={16} className="text-yellow-600" />
          </div>
          <span className="font-medium text-yellow-900">
            {operation} in progress...
          </span>
        </div>
        {onCancel && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            className="text-yellow-700 hover:text-yellow-900"
          >
            Cancel
          </Button>
        )}
      </div>
      
      <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
        <div 
          className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="text-sm text-yellow-700">
        {progress} of {total} articles processed ({percentage}%)
      </div>
    </div>
  );
};

export default ArticlesBulkActions;