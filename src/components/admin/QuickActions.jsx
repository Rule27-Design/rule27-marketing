// src/pages/admin/articles/components/ArticleQuickActions.jsx - Floating action buttons and quick operations
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils/cn';
import { useArticleEvents } from '../hooks/useArticleEvents.js';

const ArticleQuickActions = ({ 
  selectedArticles = [],
  userProfile,
  onNewArticle,
  onBulkPublish,
  onBulkArchive,
  onBulkDelete,
  onExport,
  onRefresh,
  onShowKeyboardShortcuts,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const timeoutRef = useRef(null);
  const { emit } = useArticleEvents();

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Auto-collapse after inactivity
  useEffect(() => {
    if (isExpanded) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 5000); // Collapse after 5 seconds of inactivity
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isExpanded]);

  // Quick actions based on context
  const quickActions = [
    {
      id: 'new',
      icon: 'Plus',
      label: 'New Article',
      shortcut: 'Ctrl+N',
      action: () => {
        onNewArticle();
        emit('quick_action:new_article', { source: 'floating_actions' });
      },
      visible: true,
      variant: 'default',
      className: 'bg-accent hover:bg-accent/90 text-white'
    },
    {
      id: 'publish',
      icon: 'Globe',
      label: `Publish ${selectedArticles.length} articles`,
      action: () => onBulkPublish(selectedArticles),
      visible: selectedArticles.length > 0 && userProfile?.role === 'admin',
      variant: 'success',
      className: 'bg-green-600 hover:bg-green-700 text-white'
    },
    {
      id: 'archive',
      icon: 'Archive',
      label: `Archive ${selectedArticles.length} articles`,
      action: () => onBulkArchive(selectedArticles),
      visible: selectedArticles.length > 0 && userProfile?.role === 'admin',
      variant: 'warning',
      className: 'bg-orange-600 hover:bg-orange-700 text-white'
    },
    {
      id: 'delete',
      icon: 'Trash2',
      label: `Delete ${selectedArticles.length} articles`,
      action: () => onBulkDelete(selectedArticles),
      visible: selectedArticles.length > 0 && userProfile?.role === 'admin',
      variant: 'destructive',
      className: 'bg-red-600 hover:bg-red-700 text-white'
    },
    {
      id: 'export',
      icon: 'Download',
      label: 'Export Articles',
      action: () => onExport(),
      visible: true,
      variant: 'outline',
      className: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    {
      id: 'refresh',
      icon: 'RefreshCw',
      label: 'Refresh',
      shortcut: 'R',
      action: () => {
        onRefresh();
        emit('quick_action:refresh', { source: 'floating_actions' });
      },
      visible: true,
      variant: 'outline',
      className: 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
    },
    {
      id: 'shortcuts',
      icon: 'Keyboard',
      label: 'Keyboard Shortcuts',
      shortcut: '?',
      action: () => onShowKeyboardShortcuts(),
      visible: true,
      variant: 'ghost',
      className: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  ];

  const visibleActions = quickActions.filter(action => action.visible);
  const primaryAction = visibleActions[0];
  const secondaryActions = visibleActions.slice(1);

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 transition-all duration-300',
      className
    )}>
      
      {/* Secondary Actions (when expanded) */}
      {isExpanded && secondaryActions.length > 0 && (
        <div className="flex flex-col items-end space-y-2 animate-in slide-in-from-bottom-5 duration-200">
          {secondaryActions.map((action, index) => (
            <QuickActionButton
              key={action.id}
              action={action}
              size="sm"
              delay={index * 50}
            />
          ))}
        </div>
      )}

      {/* Primary Action Button */}
      <div className="flex items-center space-x-3">
        {/* Expand/Collapse Toggle */}
        {secondaryActions.length > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'rounded-full shadow-lg border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200',
              isExpanded && 'rotate-45'
            )}
            title="More actions"
          >
            <Icon name={isExpanded ? 'X' : 'MoreHorizontal'} size={20} />
          </Button>
        )}

        {/* Main Action Button */}
        <QuickActionButton 
          action={primaryAction}
          size="lg"
          isPrimary
        />
      </div>

      {/* Selection Counter */}
      {selectedArticles.length > 0 && (
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-in zoom-in-50 duration-200">
          {selectedArticles.length} selected
        </div>
      )}

      {/* Contextual Tips */}
      {!isExpanded && selectedArticles.length === 0 && (
        <ContextualTip />
      )}
    </div>
  );
};

// Individual quick action button component
const QuickActionButton = ({ action, size = 'default', isPrimary = false, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    default: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24
  };

  return (
    <div 
      className="relative group"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: delay > 0 ? 'slideInFromBottom 200ms ease-out forwards' : undefined
      }}
    >
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg z-10 animate-in fade-in-0 slide-in-from-right-2 duration-200">
          {action.label}
          {action.shortcut && (
            <span className="ml-2 text-gray-300 text-xs">
              {action.shortcut}
            </span>
          )}
          {/* Arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}

      <Button
        variant={action.variant}
        size="icon"
        onClick={action.action}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          sizeClasses[size],
          'rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95',
          action.className,
          isPrimary && 'shadow-xl ring-2 ring-accent/20'
        )}
        title={action.label}
      >
        <Icon name={action.icon} size={iconSizes[size]} />
      </Button>
    </div>
  );
};

// Contextual tip component
const ContextualTip = () => {
  const [currentTip, setCurrentTip] = useState(0);
  
  const tips = [
    { icon: 'Keyboard', text: 'Press ? for keyboard shortcuts' },
    { icon: 'Plus', text: 'Press C to create new article' },
    { icon: 'Search', text: 'Press / to search articles' },
    { icon: 'RefreshCw', text: 'Press R to refresh' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg max-w-xs animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="flex items-center space-x-2">
        <Icon name={tips[currentTip].icon} size={14} className="text-gray-300" />
        <span>{tips[currentTip].text}</span>
      </div>
    </div>
  );
};

// Speed dial variant for more complex actions
export const ArticleSpeedDial = ({ 
  isOpen, 
  onToggle, 
  actions = [],
  className = '' 
}) => {
  return (
    <div className={cn('relative', className)}>
      {/* Speed dial actions */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col-reverse space-y-reverse space-y-2">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="animate-in slide-in-from-bottom-2 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                  {action.label}
                </span>
                <Button
                  variant={action.variant || 'default'}
                  size="icon"
                  onClick={() => {
                    action.action();
                    onToggle(false);
                  }}
                  className="w-12 h-12 rounded-full shadow-lg"
                >
                  <Icon name={action.icon} size={20} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main toggle button */}
      <Button
        variant="default"
        size="icon"
        onClick={() => onToggle(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full shadow-xl bg-accent hover:bg-accent/90 transition-all duration-200',
          isOpen && 'rotate-45'
        )}
      >
        <Icon name={isOpen ? 'X' : 'Plus'} size={24} />
      </Button>
    </div>
  );
};

// Context menu for article rows
export const ArticleContextMenu = ({ 
  article, 
  position, 
  onClose, 
  actions = [] 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 min-w-48 animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">
          {article.title}
        </p>
        <p className="text-xs text-gray-500">
          {article.status}
        </p>
      </div>

      {actions.map((action, index) => (
        <button
          key={action.id || index}
          onClick={() => {
            action.action(article);
            onClose();
          }}
          className={cn(
            'w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2',
            action.variant === 'destructive' && 'text-red-600 hover:bg-red-50'
          )}
          disabled={action.disabled}
        >
          {action.icon && <Icon name={action.icon} size={16} />}
          <span>{action.label}</span>
          {action.shortcut && (
            <span className="ml-auto text-xs text-gray-400">
              {action.shortcut}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Custom CSS for animations (add to your CSS file)
const styles = `
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default ArticleQuickActions;