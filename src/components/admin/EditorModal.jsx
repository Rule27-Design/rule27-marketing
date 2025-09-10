// src/components/admin/EditorModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const EditorModal = ({
  isOpen,
  onClose,
  onSave,
  title = 'Edit',
  subtitle,
  children,
  size = 'lg',
  saving = false,
  isDirty = false,
  validationErrors = {},
  tabs = [],
  activeTab,
  onTabChange,
  className = ''
}) => {
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab || tabs[0]?.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      // Escape to close (with warning if dirty)
      if (e.key === 'Escape') {
        if (isDirty) {
          setShowUnsavedWarning(true);
        } else {
          onClose();
        }
      }
      
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty, onClose, onSave]);

  const handleClose = () => {
    if (isDirty) {
      setShowUnsavedWarning(true);
    } else {
      onClose();
    }
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
      
      <div className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'
      )}>
        <div className={cn(
          'bg-white rounded-lg shadow-2xl w-full flex flex-col max-h-[90vh] pointer-events-auto',
          sizeClasses[size],
          className
        )}>
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {title}
                  {isDirty && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      Unsaved changes
                    </span>
                  )}
                </h2>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Tabs */}
            {tabs.length > 0 && (
              <div className="flex gap-1 mt-4 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      'px-4 py-2 font-medium text-sm rounded-t-lg transition-colors relative',
                      currentTab === tab.id
                        ? 'bg-white text-accent border-t border-x -mb-px'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {tab.icon && <Icon name={tab.icon} size={14} />}
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                          {tab.count}
                        </span>
                      )}
                      {tab.hasError && (
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {hasErrors && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </p>
                    <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                      {Object.entries(validationErrors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {saving && (
                  <span className="flex items-center gap-2">
                    <Icon name="Loader" size={14} className="animate-spin" />
                    Saving...
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={onSave}
                  disabled={saving || hasErrors}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Unsaved Changes</h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to close without saving?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowUnsavedWarning(false)}
              >
                Continue Editing
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowUnsavedWarning(false);
                  onClose();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Discard Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorModal;