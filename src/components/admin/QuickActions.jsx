// src/components/admin/QuickActions.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const QuickActions = ({
  actions = [],
  orientation = 'horizontal',
  size = 'md',
  className = '',
  showLabels = true,
  floating = false,
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(!floating);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  const defaultActions = [
    {
      id: 'create',
      icon: 'Plus',
      label: 'Create New',
      variant: 'primary',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'save',
      icon: 'Save',
      label: 'Save',
      variant: 'ghost',
      shortcut: 'Ctrl+S'
    },
    {
      id: 'preview',
      icon: 'Eye',
      label: 'Preview',
      variant: 'ghost',
      shortcut: 'Ctrl+P'
    },
    {
      id: 'settings',
      icon: 'Settings',
      label: 'Settings',
      variant: 'ghost'
    }
  ];

  const mergedActions = actions.length > 0 ? actions : defaultActions;

  const handleAction = (action) => {
    if (action.onClick) {
      action.onClick(action);
    }
  };

  const containerClasses = cn(
    floating && 'fixed z-40',
    floating && positionClasses[position],
    className
  );

  if (floating && !isExpanded) {
    return (
      <div className={containerClasses}>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsExpanded(true)}
          className="rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Icon name="Plus" size={24} />
        </Button>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={cn(
        'flex items-center gap-2 p-2 bg-white rounded-lg',
        floating && 'shadow-xl border',
        orientation === 'vertical' && 'flex-col'
      )}>
        {mergedActions.map((action) => (
          <div key={action.id} className="relative group">
            <Button
              variant={action.variant || 'ghost'}
              size={size}
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              className={cn(
                action.className,
                'relative overflow-hidden transition-all',
                !showLabels && 'px-3'
              )}
              title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
            >
              <Icon name={action.icon} size={16} />
              {showLabels && <span>{action.label}</span>}
            </Button>

            {/* Tooltip for icon-only mode */}
            {!showLabels && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {action.label}
                  {action.shortcut && (
                    <span className="ml-2 opacity-75">{action.shortcut}</span>
                  )}
                </div>
                <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1" />
              </div>
            )}
          </div>
        ))}

        {floating && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="ml-2"
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickActions;