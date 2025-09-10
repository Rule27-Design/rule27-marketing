// src/hooks/useErrorHandler.js
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for centralized error handling with retry logic and error boundaries
 * @param {Object} options - Configuration options
 */
export const useErrorHandler = (options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryBackoff = 'exponential', // 'linear', 'exponential', 'fixed'
    onError = null,
    onRetry = null,
    onMaxRetriesReached = null,
    logErrors = true,
    persistErrors = false,
    storageKey = 'app_errors'
  } = options;

  // State
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorHistory, setErrorHistory] = useState([]);
  
  // Refs
  const retryTimeoutRef = useRef(null);
  const errorIdCounter = useRef(0);

  // Load persisted errors on mount
  useEffect(() => {
    if (persistErrors && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setErrorHistory(parsed);
        }
      } catch (e) {
        console.warn('Failed to load error history:', e);
      }
    }
  }, [persistErrors, storageKey]);

  // Persist errors when they change
  useEffect(() => {
    if (persistErrors && typeof window !== 'undefined' && errorHistory.length > 0) {
      try {
        // Keep only last 50 errors
        const toStore = errorHistory.slice(-50);
        localStorage.setItem(storageKey, JSON.stringify(toStore));
      } catch (e) {
        console.warn('Failed to persist errors:', e);
      }
    }
  }, [errorHistory, persistErrors, storageKey]);

  // Parse error to get meaningful information
  const parseError = useCallback((error) => {
    const errorInfo = {
      id: ++errorIdCounter.current,
      timestamp: Date.now(),
      retryable: true,
      retryCount: 0
    };

    if (error instanceof Error) {
      errorInfo.message = error.message;
      errorInfo.name = error.name;
      errorInfo.stack = error.stack;
      errorInfo.code = error.code;
    } else if (typeof error === 'string') {
      errorInfo.message = error;
      errorInfo.name = 'Error';
    } else if (error && typeof error === 'object') {
      errorInfo.message = error.message || error.error || JSON.stringify(error);
      errorInfo.name = error.name || 'Error';
      errorInfo.code = error.code || error.status;
      errorInfo.details = error;
    } else {
      errorInfo.message = 'An unknown error occurred';
      errorInfo.name = 'UnknownError';
    }

    // Determine if error is retryable based on type/code
    if (errorInfo.code) {
      // Network errors are usually retryable
      if (errorInfo.code >= 500 || errorInfo.code === 408 || errorInfo.code === 429) {
        errorInfo.retryable = true;
      }
      // Client errors are usually not retryable
      else if (errorInfo.code >= 400 && errorInfo.code < 500) {
        errorInfo.retryable = false;
      }
    }

    // Check for specific error types
    if (errorInfo.name === 'NetworkError' || errorInfo.message.includes('network')) {
      errorInfo.retryable = true;
      errorInfo.type = 'network';
    } else if (errorInfo.name === 'ValidationError' || errorInfo.code === 422) {
      errorInfo.retryable = false;
      errorInfo.type = 'validation';
    } else if (errorInfo.name === 'AuthenticationError' || errorInfo.code === 401) {
      errorInfo.retryable = false;
      errorInfo.type = 'auth';
    } else if (errorInfo.name === 'AuthorizationError' || errorInfo.code === 403) {
      errorInfo.retryable = false;
      errorInfo.type = 'permission';
    }

    return errorInfo;
  }, []);

  // Handle error
  const handleError = useCallback((error, context = '', options = {}) => {
    const {
      retryable = true,
      silent = false,
      critical = false
    } = options;

    const errorInfo = parseError(error);
    errorInfo.context = context;
    errorInfo.retryable = retryable && errorInfo.retryable;
    errorInfo.critical = critical;

    // Log error if enabled
    if (logErrors && !silent) {
      console.error(`[${context || 'Error'}]:`, errorInfo.message, errorInfo);
    }

    // Update state
    setError(errorInfo);
    setErrors(prev => [...prev, errorInfo]);
    setErrorHistory(prev => [...prev, errorInfo]);

    // Call error callback
    if (onError) {
      onError(errorInfo);
    }

    return errorInfo;
  }, [parseError, logErrors, onError]);

  // Clear error
  const clearError = useCallback((errorId = null) => {
    if (errorId) {
      setErrors(prev => prev.filter(e => e.id !== errorId));
      if (error?.id === errorId) {
        setError(null);
      }
    } else {
      setError(null);
      setErrors([]);
    }
    setRetryCount(0);
  }, [error]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setError(null);
    setErrors([]);
    setRetryCount(0);
    setIsRetrying(false);
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Calculate retry delay
  const calculateRetryDelay = useCallback((attemptNumber) => {
    switch (retryBackoff) {
      case 'exponential':
        return retryDelay * Math.pow(2, attemptNumber);
      case 'linear':
        return retryDelay * (attemptNumber + 1);
      case 'fixed':
      default:
        return retryDelay;
    }
  }, [retryDelay, retryBackoff]);

  // Retry function
  const retry = useCallback(async (fn, context = '') => {
    if (!error || !error.retryable || retryCount >= maxRetries) {
      if (retryCount >= maxRetries && onMaxRetriesReached) {
        onMaxRetriesReached(error);
      }
      return null;
    }

    setIsRetrying(true);
    const delay = calculateRetryDelay(retryCount);

    if (onRetry) {
      onRetry(retryCount + 1, delay);
    }

    return new Promise((resolve) => {
      retryTimeoutRef.current = setTimeout(async () => {
        setRetryCount(prev => prev + 1);
        
        try {
          const result = await fn();
          clearError();
          setIsRetrying(false);
          resolve(result);
        } catch (retryError) {
          const errorInfo = handleError(retryError, context || error.context);
          errorInfo.retryCount = retryCount + 1;
          
          if (retryCount + 1 < maxRetries) {
            // Retry again
            resolve(retry(fn, context));
          } else {
            // Max retries reached
            setIsRetrying(false);
            if (onMaxRetriesReached) {
              onMaxRetriesReached(errorInfo);
            }
            resolve(null);
          }
        }
      }, delay);
    });
  }, [error, retryCount, maxRetries, calculateRetryDelay, onRetry, onMaxRetriesReached, clearError, handleError]);

  // Wrap async function with error handling
  const withErrorHandling = useCallback(async (fn, context = '', options = {}) => {
    try {
      return await fn();
    } catch (error) {
      const errorInfo = handleError(error, context, options);
      
      if (errorInfo.retryable && options.autoRetry !== false) {
        return retry(fn, context);
      }
      
      throw errorInfo;
    }
  }, [handleError, retry]);

  // Wrap sync function with error handling
  const withErrorHandlingSync = useCallback((fn, context = '', options = {}) => {
    try {
      return fn();
    } catch (error) {
      handleError(error, context, options);
      throw error;
    }
  }, [handleError]);

  // Get error by context
  const getErrorByContext = useCallback((context) => {
    return errors.find(e => e.context === context);
  }, [errors]);

  // Get errors by type
  const getErrorsByType = useCallback((type) => {
    return errors.filter(e => e.type === type);
  }, [errors]);

  // Check if has errors of specific type
  const hasErrorType = useCallback((type) => {
    return errors.some(e => e.type === type);
  }, [errors]);

  // Get error summary
  const getErrorSummary = useCallback(() => {
    const summary = {
      total: errors.length,
      byType: {},
      critical: 0,
      retryable: 0
    };

    errors.forEach(error => {
      if (error.type) {
        summary.byType[error.type] = (summary.byType[error.type] || 0) + 1;
      }
      if (error.critical) {
        summary.critical++;
      }
      if (error.retryable) {
        summary.retryable++;
      }
    });

    return summary;
  }, [errors]);

  // Export error history
  const exportErrorHistory = useCallback(() => {
    const data = {
      errors: errorHistory,
      exported: new Date().toISOString(),
      summary: getErrorSummary()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [errorHistory, getErrorSummary]);

  // Clear error history
  const clearErrorHistory = useCallback(() => {
    setErrorHistory([]);
    if (persistErrors && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn('Failed to clear error history:', e);
      }
    }
  }, [persistErrors, storageKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    error,
    errors,
    retryCount,
    isRetrying,
    errorHistory,
    hasErrors: errors.length > 0,
    
    // Actions
    handleError,
    clearError,
    clearAllErrors,
    retry,
    withErrorHandling,
    withErrorHandlingSync,
    clearErrorHistory,
    
    // Getters
    getErrorByContext,
    getErrorsByType,
    hasErrorType,
    getErrorSummary,
    exportErrorHistory
  };
};

export default useErrorHandler;