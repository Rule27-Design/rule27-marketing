// src/pages/admin/articles/components/UndoRedoControls.jsx - Undo/Redo UI Component
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { useArticleEvents } from '../hooks/useArticleEvents.js';
import { cn } from '../../../../utils/cn';

const UndoRedoControls = ({ 
  operationsService, 
  onUndo, 
  onRedo,
  className = '',
  showHistory = false,
  size = 'default' // 'sm', 'default', 'lg'
}) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  
  const { subscribe } = useArticleEvents();

  // Update undo/redo state based on command events
  useEffect(() => {
    const updateState = () => {
      setCanUndo(operationsService.canUndo());
      setCanRedo(operationsService.canRedo());
      setCommandHistory(operationsService.getHistory());
    };

    // Initial state
    updateState();

    const unsubscribers = [];

    // Listen for command events
    unsubscribers.push(
      subscribe('command:executed', () => {
        updateState();
      })
    );

    unsubscribers.push(
      subscribe('command:undone', () => {
        updateState();
      })
    );

    unsubscribers.push(
      subscribe('command:redone', () => {
        updateState();
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, operationsService]);

  // Handle undo with loading state
  const handleUndo = useCallback(async () => {
    if (!canUndo || isLoading) return;
    
    setIsLoading(true);
    try {
      if (onUndo) {
        await onUndo();
      } else {
        await operationsService.undo();
      }
    } finally {
      setIsLoading(false);
    }
  }, [canUndo, isLoading, onUndo, operationsService]);

  // Handle redo with loading state
  const handleRedo = useCallback(async () => {
    if (!canRedo || isLoading) return;
    
    setIsLoading(true);
    try {
      if (onRedo) {
        await onRedo();
      } else {
        await operationsService.redo();
      }
    } finally {
      setIsLoading(false);
    }
  }, [canRedo, isLoading, onRedo, operationsService]);

  // Get the last executed command for tooltip
  const getLastCommand = () => {
    const history = operationsService.getHistory();
    const currentIndex = operationsService.commandManager.currentIndex;
    return history[currentIndex]?.description || 'No recent commands';
  };

  // Get the next command for redo tooltip
  const getNextCommand = () => {
    const history = operationsService.getHistory();
    const currentIndex = operationsService.commandManager.currentIndex;
    return history[currentIndex + 1]?.description || 'No commands to redo';
  };

  // Button size variants
  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-9 w-9',
    lg: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 14,
    default: 16,
    lg: 18
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        {/* Undo Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          disabled={!canUndo || isLoading}
          title={canUndo ? `Undo: ${getLastCommand()}` : 'Nothing to undo'}
          className={cn(
            'hover:bg-white hover:shadow-sm transition-all',
            sizeClasses[size],
            (!canUndo || isLoading) && 'opacity-50'
          )}
        >
          {isLoading ? (
            <Icon 
              name="RefreshCw" 
              size={iconSizes[size]} 
              className="animate-spin" 
            />
          ) : (
            <Icon 
              name="Undo" 
              size={iconSizes[size]} 
              className={canUndo ? 'text-gray-700' : 'text-gray-400'}
            />
          )}
        </Button>

        {/* Redo Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          disabled={!canRedo || isLoading}
          title={canRedo ? `Redo: ${getNextCommand()}` : 'Nothing to redo'}
          className={cn(
            'hover:bg-white hover:shadow-sm transition-all',
            sizeClasses[size],
            (!canRedo || isLoading) && 'opacity-50'
          )}
        >
          <Icon 
            name="Redo" 
            size={iconSizes[size]} 
            className={canRedo ? 'text-gray-700' : 'text-gray-400'}
          />
        </Button>

        {/* History Dropdown Button */}
        {showHistory && commandHistory.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
              className={cn(
                'hover:bg-white hover:shadow-sm transition-all',
                sizeClasses[size]
              )}
              title="View command history"
            >
              <Icon 
                name="History" 
                size={iconSizes[size]} 
                className="text-gray-700"
              />
            </Button>

            {/* History Dropdown */}
            {showHistoryDropdown && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowHistoryDropdown(false)}
                />
                
                {/* Dropdown Content */}
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg border z-20 max-h-64 overflow-y-auto">
                  <div className="p-3 border-b bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900">Command History</h3>
                    <p className="text-xs text-gray-500">{commandHistory.length} commands</p>
                  </div>
                  
                  <div className="py-1">
                    {commandHistory.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No commands executed yet
                      </div>
                    ) : (
                      commandHistory.map((command, index) => (
                        <CommandHistoryItem
                          key={`${command.description}-${command.timestamp}`}
                          command={command}
                          index={index}
                          isCurrent={command.isCurrent}
                          isExecuted={command.executed}
                          canUndo={command.canUndo}
                        />
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {(canUndo || canRedo) && (
        <div className="ml-3 text-xs text-gray-500 hidden md:block">
          {canUndo && (
            <div className="flex items-center space-x-1">
              <Icon name="Undo" size={10} />
              <span>Ctrl+Z</span>
            </div>
          )}
          {canRedo && (
            <div className="flex items-center space-x-1 mt-1">
              <Icon name="Redo" size={10} />
              <span>Ctrl+Y</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Individual command history item component
const CommandHistoryItem = ({ 
  command, 
  index, 
  isCurrent, 
  isExecuted, 
  canUndo 
}) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div 
      className={cn(
        'flex items-center justify-between px-4 py-2 text-sm',
        isCurrent && 'bg-blue-50 border-l-2 border-blue-500',
        !isExecuted && 'opacity-60'
      )}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <div className={cn(
          'w-2 h-2 rounded-full flex-shrink-0',
          isExecuted ? 'bg-green-500' : 'bg-gray-300'
        )} />
        
        <span className="truncate" title={command.description}>
          {command.description}
        </span>
      </div>
      
      <div className="flex items-center space-x-2 text-xs text-gray-500 flex-shrink-0">
        <span>{formatTimestamp(command.timestamp)}</span>
        
        {isCurrent && (
          <Icon name="ArrowRight" size={10} className="text-blue-500" />
        )}
      </div>
    </div>
  );
};

// Compact version for toolbars
export const CompactUndoRedoControls = ({ 
  operationsService, 
  onUndo, 
  onRedo,
  className = '' 
}) => {
  return (
    <UndoRedoControls
      operationsService={operationsService}
      onUndo={onUndo}
      onRedo={onRedo}
      size="sm"
      showHistory={false}
      className={className}
    />
  );
};

// Full-featured version for sidebars
export const DetailedUndoRedoControls = ({ 
  operationsService, 
  onUndo, 
  onRedo,
  className = '' 
}) => {
  return (
    <UndoRedoControls
      operationsService={operationsService}
      onUndo={onUndo}
      onRedo={onRedo}
      size="default"
      showHistory={true}
      className={className}
    />
  );
};

export default UndoRedoControls;