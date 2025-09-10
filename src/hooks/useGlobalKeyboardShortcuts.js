// src/hooks/useGlobalKeyboardShortcuts.js
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for managing global keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to handlers
 * @param {Boolean} enabled - Whether shortcuts are enabled
 * @param {Object} options - Additional options
 */
export const useGlobalKeyboardShortcuts = (shortcuts = {}, enabled = true, options = {}) => {
  const {
    preventDefault = true,
    stopPropagation = false,
    ignoreInputFields = true,
    ignoreContentEditable = true,
    scope = 'global', // 'global' or element ref
    priority = 0, // Higher priority shortcuts override lower ones
    onShortcutTriggered = null,
    debug = false
  } = options;

  const shortcutRegistryRef = useRef(new Map());
  const activeKeysRef = useRef(new Set());

  // Parse shortcut string into key combination object
  const parseShortcut = useCallback((shortcut) => {
    const parts = shortcut.toLowerCase().split('+').map(s => s.trim());
    const keys = {
      ctrl: false,
      cmd: false,
      alt: false,
      shift: false,
      key: ''
    };

    parts.forEach(part => {
      switch (part) {
        case 'ctrl':
        case 'control':
          keys.ctrl = true;
          break;
        case 'cmd':
        case 'command':
        case 'meta':
        case 'mod': // mod = cmd on Mac, ctrl on Windows/Linux
          keys.cmd = true;
          break;
        case 'alt':
        case 'option':
          keys.alt = true;
          break;
        case 'shift':
          keys.shift = true;
          break;
        default:
          // Handle special keys
          if (part === 'space') {
            keys.key = ' ';
          } else if (part === 'esc' || part === 'escape') {
            keys.key = 'escape';
          } else if (part === 'enter' || part === 'return') {
            keys.key = 'enter';
          } else if (part === 'tab') {
            keys.key = 'tab';
          } else if (part === 'delete' || part === 'del') {
            keys.key = 'delete';
          } else if (part === 'backspace') {
            keys.key = 'backspace';
          } else if (part.startsWith('arrow')) {
            keys.key = part;
          } else if (part.length === 1) {
            keys.key = part;
          } else {
            keys.key = part.toLowerCase();
          }
      }
    });

    return keys;
  }, []);

  // Check if key combination matches
  const isMatch = useCallback((event, keys) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    // Handle mod key (cmd on Mac, ctrl on Windows/Linux)
    const modKey = isMac ? event.metaKey : event.ctrlKey;
    
    if (keys.cmd && !modKey) return false;
    if (keys.ctrl && !event.ctrlKey) return false;
    if (keys.alt && !event.altKey) return false;
    if (keys.shift && !event.shiftKey) return false;
    
    // Check if modifiers match exactly (no extra modifiers)
    if (!keys.cmd && modKey) return false;
    if (!keys.ctrl && event.ctrlKey && !isMac) return false;
    if (!keys.alt && event.altKey) return false;
    if (!keys.shift && event.shiftKey) return false;
    
    // Check main key
    const eventKey = event.key.toLowerCase();
    if (keys.key === eventKey) return true;
    
    // Handle numeric keys
    if (keys.key >= '0' && keys.key <= '9' && event.code === `Digit${keys.key}`) {
      return true;
    }
    
    // Handle function keys
    if (keys.key.startsWith('f') && eventKey === keys.key) {
      return true;
    }
    
    return false;
  }, []);

  // Check if should ignore element
  const shouldIgnoreElement = useCallback((element) => {
    if (!ignoreInputFields && !ignoreContentEditable) return false;
    
    const tagName = element.tagName.toLowerCase();
    
    if (ignoreInputFields) {
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return true;
      }
    }
    
    if (ignoreContentEditable) {
      if (element.contentEditable === 'true' || element.isContentEditable) {
        return true;
      }
    }
    
    return false;
  }, [ignoreInputFields, ignoreContentEditable]);

  // Handle keydown event
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    // Check if should ignore this element
    if (shouldIgnoreElement(event.target)) {
      return;
    }
    
    // Track active keys for key combinations
    activeKeysRef.current.add(event.key.toLowerCase());
    
    // Check all registered shortcuts
    let handled = false;
    const triggeredShortcuts = [];
    
    shortcutRegistryRef.current.forEach((handler, shortcutStr) => {
      const shortcuts = shortcutStr.split(',').map(s => s.trim());
      
      for (const shortcut of shortcuts) {
        const keys = parseShortcut(shortcut);
        
        if (isMatch(event, keys)) {
          triggeredShortcuts.push({ shortcut, handler, priority });
        }
      }
    });
    
    // Sort by priority and execute highest priority
    if (triggeredShortcuts.length > 0) {
      triggeredShortcuts.sort((a, b) => b.priority - a.priority);
      const { shortcut, handler } = triggeredShortcuts[0];
      
      if (debug) {
        console.log('Shortcut triggered:', shortcut);
      }
      
      if (preventDefault) {
        event.preventDefault();
      }
      
      if (stopPropagation) {
        event.stopPropagation();
      }
      
      handler(event);
      handled = true;
      
      if (onShortcutTriggered) {
        onShortcutTriggered(shortcut, event);
      }
    }
    
    return handled;
  }, [enabled, shouldIgnoreElement, parseShortcut, isMatch, preventDefault, stopPropagation, priority, debug, onShortcutTriggered]);

  // Handle keyup event
  const handleKeyUp = useCallback((event) => {
    activeKeysRef.current.delete(event.key.toLowerCase());
  }, []);

  // Register shortcuts
  useEffect(() => {
    // Clear previous registrations
    shortcutRegistryRef.current.clear();
    
    // Register new shortcuts
    Object.entries(shortcuts).forEach(([shortcut, handler]) => {
      if (typeof handler === 'function') {
        shortcutRegistryRef.current.set(shortcut, handler);
      }
    });
  }, [shortcuts]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;
    
    const target = scope === 'global' || !scope ? window : scope.current || scope;
    
    if (!target) return;
    
    target.addEventListener('keydown', handleKeyDown);
    target.addEventListener('keyup', handleKeyUp);
    
    return () => {
      target.removeEventListener('keydown', handleKeyDown);
      target.removeEventListener('keyup', handleKeyUp);
      activeKeysRef.current.clear();
    };
  }, [enabled, scope, handleKeyDown, handleKeyUp]);

  // Register a single shortcut
  const registerShortcut = useCallback((shortcut, handler) => {
    shortcutRegistryRef.current.set(shortcut, handler);
  }, []);

  // Unregister a shortcut
  const unregisterShortcut = useCallback((shortcut) => {
    shortcutRegistryRef.current.delete(shortcut);
  }, []);

  // Check if a shortcut is currently active
  const isShortcutActive = useCallback((shortcut) => {
    const keys = parseShortcut(shortcut);
    return activeKeysRef.current.has(keys.key);
  }, [parseShortcut]);

  // Get all registered shortcuts
  const getRegisteredShortcuts = useCallback(() => {
    return Array.from(shortcutRegistryRef.current.keys());
  }, []);

  // Format shortcut for display
  const formatShortcut = useCallback((shortcut) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    return shortcut
      .split(',')
      .map(s => s.trim())
      .map(s => {
        return s.split('+')
          .map(part => {
            const p = part.trim().toLowerCase();
            switch (p) {
              case 'cmd':
              case 'command':
              case 'meta':
                return isMac ? '⌘' : 'Ctrl';
              case 'ctrl':
              case 'control':
                return 'Ctrl';
              case 'alt':
              case 'option':
                return isMac ? '⌥' : 'Alt';
              case 'shift':
                return isMac ? '⇧' : 'Shift';
              case 'enter':
              case 'return':
                return isMac ? '↵' : 'Enter';
              case 'escape':
              case 'esc':
                return 'Esc';
              case 'space':
                return 'Space';
              case 'tab':
                return isMac ? '⇥' : 'Tab';
              case 'delete':
              case 'del':
                return isMac ? '⌫' : 'Del';
              case 'backspace':
                return isMac ? '⌫' : 'Backspace';
              case 'arrowup':
                return '↑';
              case 'arrowdown':
                return '↓';
              case 'arrowleft':
                return '←';
              case 'arrowright':
                return '→';
              default:
                return part.charAt(0).toUpperCase() + part.slice(1);
            }
          })
          .join(isMac ? '' : '+');
      })
      .join(' or ');
  }, []);

  return {
    registerShortcut,
    unregisterShortcut,
    isShortcutActive,
    getRegisteredShortcuts,
    formatShortcut,
    activeKeys: Array.from(activeKeysRef.current)
  };
};

export default useGlobalKeyboardShortcuts;