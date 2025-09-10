// src/components/admin/UndoRedoControls.jsx
import React, { useEffect } from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const UndoRedoControls = ({
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  history = [],
  showHistory = false,
  className = '',
  size = 'sm',
  variant = 'ghost'
}) => {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey && canUndo) {
          e.preventDefault();
          onUndo();
        } else if (e.key === 'z' && e.shiftKey && canRedo) {
          e.preventDefault();
          onRedo();
        } else if (e.key === 'y' && canRedo) {
          e.preventDefault();
          onRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, onUndo, onRedo]);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant={variant}
        size={size}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="group"
      >
        <Icon 
          name="Undo" 
          size={16} 
          className={cn(
            'transition-transform',
            canUndo && 'group-hover:-rotate-45'
          )}
        />
        <span className="sr-only">Undo</span>
      </Button>

      <Button
        variant={variant}
        size={size}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Shift+Z)"
        className="group"
      >
        <Icon 
          name="Redo" 
          size={16} 
          className={cn(
            'transition-transform',
            canRedo && 'group-hover:rotate-45'
          )}
        />
        <span className="sr-only">Redo</span>
      </Button>

      {showHistory && history.length > 0 && (
        <div className="relative group">
          <Button
            variant={variant}
            size={size}
            className="ml-2"
          >
            <Icon name="History" size={16} />
            <span className="text-xs ml-1">{history.length}</span>
          </Button>

          {/* History Dropdown */}
          <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-64">
            <div className="p-2 border-b">
              <span className="text-xs font-medium text-gray-600 uppercase">
                History ({history.length} actions)
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {history.slice(-10).reverse().map((item, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm hover:bg-gray-50 transition-colors border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {item.action}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.timestamp}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UndoRedoControls;