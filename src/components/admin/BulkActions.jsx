// src/components/admin/BulkActions.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const BulkActions = ({
  selectedItems = [],
  onAction,
  actions = [],
  className = '',
  position = 'bottom'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const defaultActions = [
    {
      id: 'publish',
      label: 'Publish',
      icon: 'Upload',
      variant: 'primary',
      requireConfirm: true
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: 'Archive',
      variant: 'ghost',
      requireConfirm: true
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      variant: 'ghost',
      className: 'text-red-600 hover:text-red-700',
      requireConfirm: true
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'Download',
      variant: 'ghost',
      requireConfirm: false
    }
  ];

  const mergedActions = actions.length > 0 ? actions : defaultActions;

  const handleAction = async (action) => {
    if (action.requireConfirm) {
      setPendingAction(action);
      setShowConfirm(true);
      return;
    }

    await executeAction(action);
  };

  const executeAction = async (action) => {
    setIsProcessing(true);
    try {
      await onAction(action.id, selectedItems);
      setShowConfirm(false);
      setPendingAction(null);
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
  };

  if (selectedItems.length === 0) return null;

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
    fixed: 'fixed bottom-20 left-1/2 transform -translate-x-1/2'
  };

  return (
    <>
      <div className={cn(
        'sticky z-20 bg-white border rounded-lg shadow-lg p-4',
        positionClasses[position],
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              {mergedActions.map((action) => (
                <Button
                  key={action.id}
                  size="sm"
                  variant={action.variant || 'ghost'}
                  onClick={() => handleAction(action)}
                  disabled={isProcessing}
                  className={action.className}
                >
                  <Icon name={action.icon} size={16} />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction('clear', [])}
            className="text-gray-500"
          >
            Clear selection
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {pendingAction.label}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {pendingAction.label.toLowerCase()} {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmAction}
                disabled={isProcessing}
                className={pendingAction.id === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {isProcessing ? 'Processing...' : `Confirm ${pendingAction.label}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;