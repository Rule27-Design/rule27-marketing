// src/hooks/useToast.js
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for managing toast notifications
 * @param {Object} options - Configuration options
 */
export const useToast = (options = {}) => {
  const {
    maxToasts = 5,
    defaultDuration = 5000,
    position = 'bottom-right', // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
    pauseOnHover = true,
    closeOnClick = false,
    newestOnTop = true,
    preventDuplicates = true,
    onToastAdd = null,
    onToastRemove = null,
    onToastClick = null
  } = options;

  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);
  const timeoutsRef = useRef(new Map());
  const pausedToastsRef = useRef(new Set());

  // Generate unique toast ID
  const generateId = useCallback(() => {
    return `toast-${++toastIdCounter.current}-${Date.now()}`;
  }, []);

  // Check if toast is duplicate
  const isDuplicate = useCallback((message, type) => {
    if (!preventDuplicates) return false;
    
    return toasts.some(toast => 
      toast.message === message && toast.type === type
    );
  }, [toasts, preventDuplicates]);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast && onToastRemove) {
        onToastRemove(toast);
      }
      return prev.filter(t => t.id !== id);
    });
    
    // Clear timeout if exists
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
    
    // Remove from paused set
    pausedToastsRef.current.delete(id);
  }, [onToastRemove]);

  // Add toast
  const addToast = useCallback((message, type = 'info', options = {}) => {
    // Check for duplicates
    if (isDuplicate(message, type)) {
      return null;
    }
    
    const id = generateId();
    const toast = {
      id,
      message,
      type,
      createdAt: Date.now(),
      duration: options.duration ?? defaultDuration,
      closable: options.closable ?? true,
      icon: options.icon,
      title: options.title,
      action: options.action, // { label: string, onClick: function }
      className: options.className,
      style: options.style,
      persistent: options.persistent ?? false,
      progress: options.progress ?? false,
      data: options.data // Custom data
    };
    
    setToasts(prev => {
      let newToasts = [...prev];
      
      // Add new toast
      if (newestOnTop) {
        newToasts.unshift(toast);
      } else {
        newToasts.push(toast);
      }
      
      // Limit number of toasts
      if (newToasts.length > maxToasts) {
        const removed = newestOnTop 
          ? newToasts.slice(0, maxToasts)
          : newToasts.slice(-maxToasts);
        
        // Clear timeouts for removed toasts
        const removedIds = prev
          .filter(t => !removed.find(r => r.id === t.id))
          .map(t => t.id);
        
        removedIds.forEach(id => {
          if (timeoutsRef.current.has(id)) {
            clearTimeout(timeoutsRef.current.get(id));
            timeoutsRef.current.delete(id);
          }
        });
        
        return removed;
      }
      
      return newToasts;
    });
    
    // Set auto-remove timeout if not persistent
    if (!toast.persistent && toast.duration > 0) {
      const timeout = setTimeout(() => {
        removeToast(id);
      }, toast.duration);
      
      timeoutsRef.current.set(id, timeout);
    }
    
    // Call add callback
    if (onToastAdd) {
      onToastAdd(toast);
    }
    
    return id;
  }, [isDuplicate, generateId, defaultDuration, newestOnTop, maxToasts, removeToast, onToastAdd]);

  // Show toast shortcuts
  const showToast = useCallback((message, options) => {
    return addToast(message, 'default', options);
  }, [addToast]);

  const success = useCallback((message, options) => {
    return addToast(message, 'success', { icon: '✓', ...options });
  }, [addToast]);

  const error = useCallback((message, options) => {
    return addToast(message, 'error', { icon: '✕', ...options });
  }, [addToast]);

  const warning = useCallback((message, options) => {
    return addToast(message, 'warning', { icon: '⚠', ...options });
  }, [addToast]);

  const info = useCallback((message, options) => {
    return addToast(message, 'info', { icon: 'ℹ', ...options });
  }, [addToast]);

  const loading = useCallback((message, options) => {
    return addToast(message, 'loading', { 
      icon: '⟳', 
      persistent: true,
      progress: true,
      ...options 
    });
  }, [addToast]);

  // Update existing toast
  const updateToast = useCallback((id, updates) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
    
    // Update timeout if duration changed
    if (updates.duration !== undefined) {
      // Clear existing timeout
      if (timeoutsRef.current.has(id)) {
        clearTimeout(timeoutsRef.current.get(id));
        timeoutsRef.current.delete(id);
      }
      
      // Set new timeout if needed
      if (updates.duration > 0 && !updates.persistent) {
        const timeout = setTimeout(() => {
          removeToast(id);
        }, updates.duration);
        
        timeoutsRef.current.set(id, timeout);
      }
    }
  }, [removeToast]);

  // Pause toast auto-removal
  const pauseToast = useCallback((id) => {
    if (!pauseOnHover) return;
    
    pausedToastsRef.current.add(id);
    
    // Clear timeout
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
  }, [pauseOnHover]);

  // Resume toast auto-removal
  const resumeToast = useCallback((id) => {
    if (!pauseOnHover) return;
    
    pausedToastsRef.current.delete(id);
    
    const toast = toasts.find(t => t.id === id);
    if (toast && !toast.persistent && toast.duration > 0) {
      // Calculate remaining time
      const elapsed = Date.now() - toast.createdAt;
      const remaining = Math.max(0, toast.duration - elapsed);
      
      if (remaining > 0) {
        const timeout = setTimeout(() => {
          removeToast(id);
        }, remaining);
        
        timeoutsRef.current.set(id, timeout);
      } else {
        removeToast(id);
      }
    }
  }, [pauseOnHover, toasts, removeToast]);

  // Handle toast click
  const handleToastClick = useCallback((id) => {
    const toast = toasts.find(t => t.id === id);
    if (!toast) return;
    
    if (onToastClick) {
      onToastClick(toast);
    }
    
    if (closeOnClick && toast.closable) {
      removeToast(id);
    }
    
    // Execute action if exists
    if (toast.action?.onClick) {
      toast.action.onClick(toast);
    }
  }, [toasts, closeOnClick, removeToast, onToastClick]);

  // Clear all toasts
  const clearToasts = useCallback((type = null) => {
    if (type) {
      // Clear only toasts of specific type
      const toastsToClear = toasts.filter(t => t.type === type);
      toastsToClear.forEach(toast => removeToast(toast.id));
    } else {
      // Clear all toasts
      toasts.forEach(toast => removeToast(toast.id));
    }
  }, [toasts, removeToast]);

  // Promise-based toast
  const promise = useCallback((
    promiseFn,
    messages = {}
  ) => {
    const {
      loading: loadingMsg = 'Loading...',
      success: successMsg = 'Success!',
      error: errorMsg = 'Something went wrong'
    } = messages;
    
    const toastId = loading(loadingMsg);
    
    promiseFn
      .then(result => {
        updateToast(toastId, {
          type: 'success',
          message: typeof successMsg === 'function' ? successMsg(result) : successMsg,
          icon: '✓',
          persistent: false,
          duration: defaultDuration
        });
      })
      .catch(err => {
        updateToast(toastId, {
          type: 'error',
          message: typeof errorMsg === 'function' ? errorMsg(err) : errorMsg,
          icon: '✕',
          persistent: false,
          duration: defaultDuration
        });
      });
    
    return toastId;
  }, [loading, updateToast, defaultDuration]);

  // Get toast props for rendering
  const getToastProps = useCallback((toast) => {
    return {
      key: toast.id,
      id: toast.id,
      className: `toast toast-${toast.type} ${toast.className || ''}`,
      style: toast.style,
      onClick: () => handleToastClick(toast.id),
      onMouseEnter: () => pauseToast(toast.id),
      onMouseLeave: () => resumeToast(toast.id),
      role: 'alert',
      'aria-live': toast.type === 'error' ? 'assertive' : 'polite',
      'data-type': toast.type,
      'data-closable': toast.closable
    };
  }, [handleToastClick, pauseToast, resumeToast]);

  // Get container props
  const getContainerProps = useCallback(() => {
    const [verticalPos, horizontalPos] = position.split('-');
    
    return {
      className: `toast-container toast-${position}`,
      style: {
        position: 'fixed',
        zIndex: 9999,
        pointerEvents: 'none',
        ...(verticalPos === 'top' ? { top: 20 } : { bottom: 20 }),
        ...(horizontalPos === 'left' ? { left: 20 } : {}),
        ...(horizontalPos === 'center' ? { left: '50%', transform: 'translateX(-50%)' } : {}),
        ...(horizontalPos === 'right' ? { right: 20 } : {})
      }
    };
  }, [position]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all timeouts
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
      pausedToastsRef.current.clear();
    };
  }, []);

  return {
    // State
    toasts,
    
    // Actions
    showToast,
    success,
    error,
    warning,
    info,
    loading,
    promise,
    updateToast,
    removeToast,
    clearToasts,
    
    // Utilities
    getToastProps,
    getContainerProps,
    
    // Handlers
    pauseToast,
    resumeToast,
    handleToastClick
  };
};

export default useToast;