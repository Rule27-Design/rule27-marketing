// src/pages/admin/articles/hooks/useGlobalKeyboardShortcuts.js - Fixed scoping issue
import { useEffect, useCallback, useRef } from 'react';
import { useArticleEvents } from './useArticleEvents.js';

/**
 * Global keyboard shortcuts for article management
 * @param {Object} operationsService - Command operations service
 * @param {Object} handlers - Custom handlers for shortcuts
 * @returns {Object} Shortcut utilities
 */
export const useGlobalKeyboardShortcuts = (operationsService, handlers = {}) => {
  const {
    onUndo,
    onRedo,
    onNewArticle,
    onSearch,
    onRefresh,
    onHelp
  } = handlers;

  const { emit } = useArticleEvents();
  const lastKeyPressTime = useRef(0);
  const keySequence = useRef([]);

  // Key combination checker
  const isModifierPressed = useCallback((event) => {
    return event.ctrlKey || event.metaKey; // Support both Ctrl (Windows/Linux) and Cmd (Mac)
  }, []);

  // Debounce rapid key presses
  const shouldProcessKey = useCallback((event) => {
    const now = Date.now();
    const timeSinceLastKey = now - lastKeyPressTime.current;
    lastKeyPressTime.current = now;
    
    // Prevent rapid-fire execution (minimum 100ms between same key presses)
    if (timeSinceLastKey < 100 && keySequence.current.includes(event.key)) {
      return false;
    }
    
    return true;
  }, []);

  // Check if user is in an input field
  const isInInputField = useCallback(() => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;
    
    const inputTypes = ['input', 'textarea', 'select'];
    const isInput = inputTypes.includes(activeElement.tagName.toLowerCase());
    const isContentEditable = activeElement.contentEditable === 'true';
    const isInEditor = activeElement.closest('[data-tiptap-editor]');
    
    return isInput || isContentEditable || isInEditor;
  }, []);

  // Handle key sequence for multi-key shortcuts
  const handleKeySequence = useCallback((key) => {
    keySequence.current.push(key);
    
    // Clear sequence after 2 seconds
    setTimeout(() => {
      keySequence.current = [];
    }, 2000);
    
    // Check for known sequences
    const sequence = keySequence.current.join('');
    
    switch (sequence) {
      case 'gg': // Go to top (vim-style)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        emit('shortcut:executed', { shortcut: 'go_to_top', sequence });
        keySequence.current = [];
        return true;
      
      case 'G': // Go to bottom (vim-style)
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        emit('shortcut:executed', { shortcut: 'go_to_bottom', sequence });
        keySequence.current = [];
        return true;
        
      case '?': // Show help
        if (onHelp) {
          onHelp();
        } else {
          showKeyboardShortcutsHelp();
        }
        emit('shortcut:executed', { shortcut: 'show_help', sequence });
        keySequence.current = [];
        return true;
    }
    
    return false;
  }, [emit, onHelp]);

  // Show keyboard shortcuts help modal
  const showKeyboardShortcutsHelp = useCallback(() => {
    const shortcuts = [
      { key: 'Ctrl+Z', description: 'Undo last action' },
      { key: 'Ctrl+Y', description: 'Redo last action' },
      { key: 'Ctrl+N', description: 'Create new article' },
      { key: 'Ctrl+R', description: 'Refresh page' },
      { key: 'Ctrl+/', description: 'Focus search' },
      { key: 'Ctrl+Shift+F', description: 'Advanced search' },
      { key: 'c', description: 'Create new article (when not typing)' },
      { key: 'r', description: 'Refresh (when not typing)' },
      { key: '/', description: 'Focus search (when not typing)' },
      { key: 'j', description: 'Scroll down' },
      { key: 'k', description: 'Scroll up' },
      { key: 'gg', description: 'Go to top' },
      { key: 'G', description: 'Go to bottom' },
      { key: '?', description: 'Show this help' },
      { key: 'Escape', description: 'Close modal or clear focus' }
    ];

    // Create and show help modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Keyboard Shortcuts</h2>
            <button class="text-gray-400 hover:text-gray-600" data-close>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${shortcuts.map(shortcut => `
              <div class="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <span class="text-gray-600">${shortcut.description}</span>
                <kbd class="px-2 py-1 bg-gray-100 rounded text-sm font-mono">${shortcut.key}</kbd>
              </div>
            `).join('')}
          </div>
          
          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Tip:</strong> Most single-key shortcuts only work when you're not typing in an input field.
              Modifier-based shortcuts (Ctrl+Key) work everywhere.
            </p>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    const closeModal = () => {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleEscape);
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.hasAttribute('data-close')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', handleEscape);
    document.body.appendChild(modal);

    emit('shortcut:help_shown', { shortcuts });
  }, [emit]);

  // Main keyboard event handler - FIXED SCOPING ISSUE
  const handleKeyDown = useCallback((event) => {
    // Skip processing if we shouldn't handle this key
    if (!shouldProcessKey(event)) {
      return;
    }

    // Get current state - define these at the top to ensure they're always available
    const currentIsInputFocused = isInInputField();
    const hasModifier = isModifierPressed(event);

    // Handle modifier-based shortcuts (work everywhere)
    if (hasModifier) {
      switch (event.key) {
        case 'z':
          if (!event.shiftKey) {
            event.preventDefault();
            if (onUndo) {
              onUndo();
            } else if (operationsService) {
              operationsService.undo();
            }
            emit('shortcut:executed', { shortcut: 'undo', key: 'Ctrl+Z' });
          }
          return;
          
        case 'y':
        case 'Z': // Shift+Ctrl+Z
          event.preventDefault();
          if (onRedo) {
            onRedo();
          } else if (operationsService) {
            operationsService.redo();
          }
          emit('shortcut:executed', { shortcut: 'redo', key: 'Ctrl+Y' });
          return;
          
        case 'n':
          event.preventDefault();
          if (onNewArticle) {
            onNewArticle();
            emit('shortcut:executed', { shortcut: 'new_article', key: 'Ctrl+N' });
          }
          return;
          
        case 'f':
          // Let browser handle Ctrl+F for search
          if (!event.shiftKey) {
            return;
          }
          // Ctrl+Shift+F for advanced search
          event.preventDefault();
          if (onSearch) {
            onSearch();
            emit('shortcut:executed', { shortcut: 'advanced_search', key: 'Ctrl+Shift+F' });
          }
          return;
          
        case 'r':
          event.preventDefault();
          if (onRefresh) {
            onRefresh();
          } else {
            window.location.reload();
          }
          emit('shortcut:executed', { shortcut: 'refresh', key: 'Ctrl+R' });
          return;
          
        case 'k':
          event.preventDefault();
          // Command palette (future enhancement)
          emit('shortcut:executed', { shortcut: 'command_palette', key: 'Ctrl+K' });
          return;
          
        case '/':
          event.preventDefault();
          // Focus search field
          const searchInput = document.querySelector('input[placeholder*="Search"]');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
            emit('shortcut:executed', { shortcut: 'focus_search', key: 'Ctrl+/' });
          }
          return;
      }
    }

    // Handle non-modifier shortcuts (only when not in input fields)
    if (!currentIsInputFocused && !hasModifier) {
      switch (event.key) {
        case 'Escape':
          // Close any open modals or clear focus
          const activeModal = document.querySelector('[role="dialog"]');
          if (activeModal) {
            const closeButton = activeModal.querySelector('[aria-label*="close"], [data-close]');
            if (closeButton) {
              closeButton.click();
              emit('shortcut:executed', { shortcut: 'close_modal', key: 'Escape' });
            }
          } else {
            // Clear focus from any focused element
            if (document.activeElement && document.activeElement.blur) {
              document.activeElement.blur();
            }
          }
          return;
          
        case 'j':
          // Scroll down
          event.preventDefault();
          window.scrollBy({ top: 100, behavior: 'smooth' });
          emit('shortcut:executed', { shortcut: 'scroll_down', key: 'j' });
          return;
          
        case 'k':
          // Scroll up
          event.preventDefault();
          window.scrollBy({ top: -100, behavior: 'smooth' });
          emit('shortcut:executed', { shortcut: 'scroll_up', key: 'k' });
          return;
          
        case 'c':
          // Create new article
          if (onNewArticle) {
            onNewArticle();
            emit('shortcut:executed', { shortcut: 'new_article', key: 'c' });
          }
          return;
          
        case 'r':
          // Refresh
          if (onRefresh) {
            onRefresh();
            emit('shortcut:executed', { shortcut: 'refresh', key: 'r' });
          }
          return;
          
        case '/':
          // Focus search
          event.preventDefault();
          const searchField = document.querySelector('input[placeholder*="Search"]');
          if (searchField) {
            searchField.focus();
            searchField.select();
            emit('shortcut:executed', { shortcut: 'focus_search', key: '/' });
          }
          return;
      }
      
      // Handle key sequences for multi-key shortcuts
      if (handleKeySequence(event.key)) {
        event.preventDefault();
      }
    }
  }, [
    shouldProcessKey,
    isInInputField,
    isModifierPressed,
    handleKeySequence,
    onUndo,
    onRedo,
    onNewArticle,
    onSearch,
    onRefresh,
    operationsService,
    emit
  ]);

  // Set up global event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    
    // Emit that shortcuts are enabled
    emit('shortcuts:enabled', { 
      shortcuts: [
        'Ctrl+Z (Undo)', 'Ctrl+Y (Redo)', 'Ctrl+N (New)', 
        'Ctrl+R (Refresh)', 'Ctrl+/ (Search)', 'j/k (Scroll)',
        'c (Create)', 'r (Refresh)', '/ (Search)', '? (Help)'
      ]
    });
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      emit('shortcuts:disabled');
    };
  }, [handleKeyDown, emit]);

  // Utility functions for external use
  const triggerShortcut = useCallback((shortcut) => {
    switch (shortcut) {
      case 'undo':
        if (onUndo) onUndo();
        else if (operationsService) operationsService.undo();
        break;
      case 'redo':
        if (onRedo) onRedo();
        else if (operationsService) operationsService.redo();
        break;
      case 'new':
        if (onNewArticle) onNewArticle();
        break;
      case 'help':
        showKeyboardShortcutsHelp();
        break;
    }
    
    emit('shortcut:triggered_programmatically', { shortcut });
  }, [onUndo, onRedo, onNewArticle, operationsService, showKeyboardShortcutsHelp, emit]);

  return {
    triggerShortcut,
    showHelp: showKeyboardShortcutsHelp,
    isInInputField
  };
};