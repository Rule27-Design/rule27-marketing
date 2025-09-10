// src/pages/admin/articles/components/KeyboardShortcutsUI.jsx - Enhanced keyboard shortcuts integration
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils/cn';
import { useArticleEvents } from '../hooks/useArticleEvents.js';

// Keyboard shortcut indicator component
export const ShortcutIndicator = ({ 
  shortcut, 
  description, 
  isActive = false,
  size = 'sm',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'text-xs px-1 py-0.5',
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <kbd 
      className={cn(
        'inline-flex items-center font-mono font-medium border rounded transition-all duration-200',
        sizeClasses[size],
        isActive 
          ? 'bg-accent text-white border-accent shadow-md' 
          : 'bg-gray-100 text-gray-700 border-gray-300',
        className
      )}
      title={description}
    >
      {shortcut}
    </kbd>
  );
};

// Floating shortcut hints
export const ShortcutHints = ({ 
  visible = true, 
  position = 'bottom-right',
  onDismiss 
}) => {
  const [currentHint, setCurrentHint] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const hints = [
    { key: 'Ctrl+N', action: 'New Article', icon: 'Plus' },
    { key: 'Ctrl+S', action: 'Save', icon: 'Save' },
    { key: 'Ctrl+/', action: 'Search', icon: 'Search' },
    { key: '?', action: 'Show Help', icon: 'HelpCircle' },
    { key: 'J/K', action: 'Scroll', icon: 'ArrowUpDown' }
  ];

  useEffect(() => {
    if (!isExpanded) {
      const interval = setInterval(() => {
        setCurrentHint((prev) => (prev + 1) % hints.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hints.length, isExpanded]);

  if (!visible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={cn(
      'fixed z-40 transition-all duration-300',
      positionClasses[position]
    )}>
      <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden">
        {isExpanded ? (
          // Expanded view with all hints
          <div className="p-4 space-y-3 min-w-64">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Keyboard Shortcuts</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon name="ChevronDown" size={16} />
              </button>
            </div>
            
            {hints.map((hint, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name={hint.icon} size={14} className="text-gray-400" />
                  <span className="text-sm">{hint.action}</span>
                </div>
                <ShortcutIndicator 
                  shortcut={hint.key} 
                  size="xs"
                  className="bg-gray-800 text-gray-300 border-gray-700"
                />
              </div>
            ))}
            
            <div className="pt-2 border-t border-gray-700">
              <button
                onClick={onDismiss}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Dismiss hints
              </button>
            </div>
          </div>
        ) : (
          // Compact rotating hint
          <div 
            className="p-3 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex items-center space-x-3">
              <Icon name={hints[currentHint].icon} size={16} className="text-gray-400" />
              <div className="flex items-center space-x-2">
                <ShortcutIndicator 
                  shortcut={hints[currentHint].key} 
                  size="xs"
                  className="bg-gray-800 text-gray-300 border-gray-700"
                />
                <span className="text-sm">{hints[currentHint].action}</span>
              </div>
              <Icon name="ChevronUp" size={14} className="text-gray-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced keyboard shortcuts modal
export const KeyboardShortcutsModal = ({ 
  isOpen, 
  onClose,
  categories = null 
}) => {
  const { subscribe } = useArticleEvents();
  const [recentShortcuts, setRecentShortcuts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe('shortcut:executed', ({ shortcut }) => {
      setRecentShortcuts(prev => [
        { shortcut, timestamp: Date.now() },
        ...prev.slice(0, 4)
      ]);
    });

    return unsubscribe;
  }, [subscribe]);

  const defaultCategories = {
    'Essential': [
      { key: 'Ctrl+N', description: 'Create new article', icon: 'Plus' },
      { key: 'Ctrl+S', description: 'Save current article', icon: 'Save' },
      { key: 'Ctrl+Z', description: 'Undo last action', icon: 'Undo' },
      { key: 'Ctrl+Y', description: 'Redo action', icon: 'Redo' },
      { key: 'Escape', description: 'Close dialog or clear focus', icon: 'X' }
    ],
    'Navigation': [
      { key: '/', description: 'Focus search field', icon: 'Search' },
      { key: 'j', description: 'Scroll down', icon: 'ArrowDown' },
      { key: 'k', description: 'Scroll up', icon: 'ArrowUp' },
      { key: 'gg', description: 'Go to top', icon: 'ArrowUp' },
      { key: 'G', description: 'Go to bottom', icon: 'ArrowDown' }
    ],
    'Article Management': [
      { key: 'c', description: 'Create new article (when not typing)', icon: 'Plus' },
      { key: 'r', description: 'Refresh articles list', icon: 'RefreshCw' },
      { key: 'Ctrl+R', description: 'Force refresh page', icon: 'RefreshCw' },
      { key: 'Ctrl+Shift+F', description: 'Advanced search', icon: 'Search' }
    ],
    'Editor': [
      { key: 'Ctrl+←', description: 'Previous tab', icon: 'ChevronLeft' },
      { key: 'Ctrl+→', description: 'Next tab', icon: 'ChevronRight' },
      { key: 'Ctrl+Enter', description: 'Quick publish (admin only)', icon: 'Globe' },
      { key: 'Ctrl+1-5', description: 'Jump to specific tab', icon: 'Hash' }
    ],
    'Help': [
      { key: '?', description: 'Show this help dialog', icon: 'HelpCircle' },
      { key: 'Ctrl+K', description: 'Command palette (coming soon)', icon: 'Command' }
    ]
  };

  if (!isOpen) return null;

  const shortcutCategories = categories || defaultCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Speed up your workflow with these keyboard shortcuts
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {recentShortcuts.length > 0 && (
              <div className="text-sm text-gray-500">
                Recent: {recentShortcuts[0]?.shortcut}
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(shortcutCategories).map(([category, shortcuts]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  {category}
                </h3>
                
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <ShortcutItem 
                      key={index} 
                      {...shortcut}
                      isRecent={recentShortcuts.some(r => r.shortcut === shortcut.key)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <strong>Pro tip:</strong> Most single-key shortcuts work when you're not typing in a text field
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Print shortcuts for offline reference
                  window.print();
                }}
                iconName="Printer"
              >
                Print Reference
              </Button>
              
              <Button
                variant="default"
                onClick={onClose}
                className="bg-accent hover:bg-accent/90"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual shortcut item component
const ShortcutItem = ({ key, description, icon, isRecent = false }) => (
  <div className={cn(
    'flex items-center justify-between p-3 rounded-lg border transition-all duration-200',
    isRecent 
      ? 'bg-accent/5 border-accent/20' 
      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  )}>
    <div className="flex items-center space-x-3">
      <div className={cn(
        'p-2 rounded',
        isRecent ? 'bg-accent/10 text-accent' : 'bg-white text-gray-600'
      )}>
        <Icon name={icon} size={16} />
      </div>
      <span className="text-sm text-gray-700">{description}</span>
    </div>
    
    <div className="flex items-center space-x-2">
      {isRecent && (
        <span className="text-xs text-accent font-medium">Recent</span>
      )}
      <ShortcutIndicator 
        shortcut={key} 
        size="sm"
        className={isRecent ? 'border-accent/30 bg-accent/10 text-accent' : ''}
      />
    </div>
  </div>
);

// Inline shortcut hints for buttons and inputs
export const InlineShortcutHint = ({ 
  shortcut, 
  className = '',
  position = 'right' 
}) => {
  const positionClasses = {
    right: 'ml-2',
    left: 'mr-2',
    top: 'mb-1',
    bottom: 'mt-1'
  };

  return (
    <span className={cn(positionClasses[position], className)}>
      <ShortcutIndicator shortcut={shortcut} size="xs" />
    </span>
  );
};

// Contextual shortcut suggestions
export const ContextualShortcuts = ({ context = 'default' }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const contextualSuggestions = {
      editor: [
        { key: 'Ctrl+S', action: 'Save article' },
        { key: 'Ctrl+←', action: 'Previous tab' },
        { key: 'Ctrl+→', action: 'Next tab' }
      ],
      list: [
        { key: 'c', action: 'New article' },
        { key: '/', action: 'Search' },
        { key: 'r', action: 'Refresh' }
      ],
      search: [
        { key: 'Enter', action: 'Search' },
        { key: 'Escape', action: 'Clear' },
        { key: '↑↓', action: 'Navigate results' }
      ]
    };

    setSuggestions(contextualSuggestions[context] || contextualSuggestions.default || []);
  }, [context]);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Icon name="Zap" size={16} className="text-blue-600" />
        <span className="text-sm font-medium text-blue-900">Quick shortcuts:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center space-x-1 text-sm">
            <ShortcutIndicator 
              shortcut={suggestion.key} 
              size="xs"
              className="bg-blue-100 text-blue-800 border-blue-300"
            />
            <span className="text-blue-700">{suggestion.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Keyboard shortcut trainer (gamification)
export const ShortcutTrainer = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const challenges = [
    { description: 'Create a new article', shortcut: 'Ctrl+N', context: 'Use the keyboard to create a new article' },
    { description: 'Open search', shortcut: '/', context: 'Quick access to search without clicking' },
    { description: 'Scroll down', shortcut: 'j', context: 'Navigate content with vim-style keys' },
    { description: 'Show help', shortcut: '?', context: 'Get help when you need it' }
  ];

  // This would integrate with the global keyboard shortcuts hook
  // to detect when the correct shortcut is pressed

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Shortcut Challenge</h3>
        <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
          Score: {score}
        </div>
      </div>

      {isActive ? (
        <div className="space-y-4">
          <div className="text-sm opacity-90">
            Challenge {currentChallenge + 1} of {challenges.length}
          </div>
          
          <div>
            <p className="text-lg mb-2">{challenges[currentChallenge]?.description}</p>
            <p className="text-sm opacity-75">{challenges[currentChallenge]?.context}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Press:</span>
            <ShortcutIndicator 
              shortcut={challenges[currentChallenge]?.shortcut} 
              className="bg-white/20 text-white border-white/30"
            />
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p>Test your keyboard shortcut knowledge!</p>
          <Button
            variant="outline"
            onClick={() => setIsActive(true)}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Start Challenge
          </Button>
        </div>
      )}
    </div>
  );
};

export default {
  ShortcutIndicator,
  ShortcutHints,
  KeyboardShortcutsModal,
  InlineShortcutHint,
  ContextualShortcuts,
  ShortcutTrainer
};