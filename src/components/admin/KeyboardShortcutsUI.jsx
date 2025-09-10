// src/components/admin/KeyboardShortcutsUI.jsx
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const KeyboardShortcutsUI = ({
  shortcuts = [],
  onClose,
  isOpen = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const defaultShortcuts = [
    {
      category: 'Navigation',
      shortcuts: [
        { keys: ['Ctrl', 'K'], description: 'Quick search' },
        { keys: ['G', 'H'], description: 'Go to home' },
        { keys: ['G', 'A'], description: 'Go to articles' },
        { keys: ['G', 'C'], description: 'Go to case studies' },
        { keys: ['Esc'], description: 'Close dialog' }
      ]
    },
    {
      category: 'Editing',
      shortcuts: [
        { keys: ['Ctrl', 'S'], description: 'Save' },
        { keys: ['Ctrl', 'Z'], description: 'Undo' },
        { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
        { keys: ['Ctrl', 'D'], description: 'Duplicate' },
        { keys: ['Delete'], description: 'Delete selected' }
      ]
    },
    {
      category: 'Actions',
      shortcuts: [
        { keys: ['Ctrl', 'N'], description: 'Create new' },
        { keys: ['Ctrl', 'E'], description: 'Edit selected' },
        { keys: ['Ctrl', 'P'], description: 'Preview' },
        { keys: ['Ctrl', 'Shift', 'P'], description: 'Publish' },
        { keys: ['Ctrl', 'A'], description: 'Select all' }
      ]
    },
    {
      category: 'View',
      shortcuts: [
        { keys: ['Ctrl', '+'], description: 'Zoom in' },
        { keys: ['Ctrl', '-'], description: 'Zoom out' },
        { keys: ['Ctrl', '0'], description: 'Reset zoom' },
        { keys: ['F11'], description: 'Full screen' },
        { keys: ['?'], description: 'Show shortcuts' }
      ]
    }
  ];

  const allShortcuts = shortcuts.length > 0 ? shortcuts : defaultShortcuts;

  const filteredShortcuts = allShortcuts
    .map(category => ({
      ...category,
      shortcuts: category.shortcuts.filter(shortcut =>
        shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortcut.keys.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(category => 
      activeCategory === 'all' || category.category === activeCategory
    )
    .filter(category => category.shortcuts.length > 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        onClose(); // Toggle
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shortcuts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                activeCategory === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              All
            </button>
            {allShortcuts.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  activeCategory === cat.category
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredShortcuts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No shortcuts found matching "{searchTerm}"
            </div>
          ) : (
            <div className="space-y-6">
              {filteredShortcuts.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {category.shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              {keyIndex > 0 && (
                                <span className="text-gray-400 text-xs">+</span>
                              )}
                              <kbd className="px-2 py-1 text-xs font-mono bg-white border rounded shadow-sm">
                                {key}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Press <kbd className="px-2 py-0.5 text-xs font-mono bg-white border rounded">?</kbd> anytime to show this help
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsUI;