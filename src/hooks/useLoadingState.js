// src/hooks/useLoadingState.js
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for managing loading states with support for multiple operations
 * @param {Object} options - Configuration options
 */
export const useLoadingState = (options = {}) => {
  const {
    initialLoading = false,
    minLoadingTime = 0, // Minimum time to show loading state
    maxLoadingTime = 30000, // Maximum loading time before timeout
    onLoadingStart = null,
    onLoadingEnd = null,
    onTimeout = null,
    trackOperations = true
  } = options;

  // State
  const [loading, setLoading] = useState(initialLoading);
  const [loadingOperations, setLoadingOperations] = useState(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [operationHistory, setOperationHistory] = useState([]);
  
  // Refs
  const loadingStartTimeRef = useRef(null);
  const timeoutRef = useRef(null);
  const minTimeoutRef = useRef(null);

  // Start loading for a specific operation
  const startLoading = useCallback((operationId = 'default', message = '') => {
    setLoadingOperations(prev => {
      const next = new Set(prev);
      next.add(operationId);
      return next;
    });
    
    if (message) {
      setLoadingMessage(message);
    }
    
    // Track operation start
    if (trackOperations) {
      setOperationHistory(prev => [...prev, {
        id: operationId,
        type: 'start',
        timestamp: Date.now(),
        message
      }]);
    }
    
    // Set loading state
    if (!loading) {
      setLoading(true);
      setIsReadOnly(true);
      loadingStartTimeRef.current = Date.now();
      
      if (onLoadingStart) {
        onLoadingStart(operationId);
      }
      
      // Set timeout for max loading time
      if (maxLoadingTime > 0) {
        timeoutRef.current = setTimeout(() => {
          endLoading(operationId, true);
          if (onTimeout) {
            onTimeout(operationId);
          }
        }, maxLoadingTime);
      }
    }
  }, [loading, maxLoadingTime, onLoadingStart, onTimeout, trackOperations]);

  // End loading for a specific operation
  const endLoading = useCallback((operationId = 'default', isTimeout = false) => {
    setLoadingOperations(prev => {
      const next = new Set(prev);
      next.delete(operationId);
      
      // If no more operations, end loading
      if (next.size === 0) {
        const loadingDuration = loadingStartTimeRef.current 
          ? Date.now() - loadingStartTimeRef.current 
          : 0;
        
        // Ensure minimum loading time
        if (minLoadingTime > 0 && loadingDuration < minLoadingTime && !isTimeout) {
          const remainingTime = minLoadingTime - loadingDuration;
          
          minTimeoutRef.current = setTimeout(() => {
            setLoading(false);
            setIsReadOnly(false);
            setLoadingMessage('');
            setLoadingProgress(0);
            
            if (onLoadingEnd) {
              onLoadingEnd(operationId);
            }
          }, remainingTime);
        } else {
          setLoading(false);
          setIsReadOnly(false);
          setLoadingMessage('');
          setLoadingProgress(0);
          
          if (onLoadingEnd) {
            onLoadingEnd(operationId);
          }
        }
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
      
      return next;
    });
    
    // Track operation end
    if (trackOperations) {
      setOperationHistory(prev => [...prev, {
        id: operationId,
        type: 'end',
        timestamp: Date.now(),
        isTimeout
      }]);
    }
  }, [minLoadingTime, onLoadingEnd, trackOperations]);

  // Update loading progress (0-100)
  const updateProgress = useCallback((progress, message = null) => {
    setLoadingProgress(Math.min(100, Math.max(0, progress)));
    if (message !== null) {
      setLoadingMessage(message);
    }
  }, []);

  // Execute function with loading state
  const withLoading = useCallback(async (
    asyncFunction,
    operationId = 'default',
    message = ''
  ) => {
    startLoading(operationId, message);
    
    try {
      const result = await asyncFunction();
      endLoading(operationId);
      return result;
    } catch (error) {
      endLoading(operationId);
      throw error;
    }
  }, [startLoading, endLoading]);

  // Execute multiple operations with loading
  const withBatchLoading = useCallback(async (operations) => {
    const results = [];
    const errors = [];
    
    setLoadingProgress(0);
    const progressPerOperation = 100 / operations.length;
    
    for (let i = 0; i < operations.length; i++) {
      const { fn, id = `batch_${i}`, message = '' } = operations[i];
      
      try {
        const result = await withLoading(fn, id, message);
        results.push({ id, success: true, result });
      } catch (error) {
        results.push({ id, success: false, error });
        errors.push({ id, error });
      }
      
      updateProgress((i + 1) * progressPerOperation);
    }
    
    return { results, errors, hasErrors: errors.length > 0 };
  }, [withLoading, updateProgress]);

  // Reset loading state
  const resetLoading = useCallback(() => {
    setLoading(false);
    setLoadingOperations(new Set());
    setLoadingProgress(0);
    setLoadingMessage('');
    setIsReadOnly(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (minTimeoutRef.current) {
      clearTimeout(minTimeoutRef.current);
      minTimeoutRef.current = null;
    }
  }, []);

  // Check if specific operation is loading
  const isOperationLoading = useCallback((operationId) => {
    return loadingOperations.has(operationId);
  }, [loadingOperations]);

  // Get loading duration
  const getLoadingDuration = useCallback(() => {
    if (!loading || !loadingStartTimeRef.current) return 0;
    return Date.now() - loadingStartTimeRef.current;
  }, [loading]);

  // Get operation statistics
  const getOperationStats = useCallback(() => {
    if (!trackOperations) return null;
    
    const stats = {
      total: 0,
      completed: 0,
      timedOut: 0,
      averageDuration: 0,
      operations: {}
    };
    
    const durations = [];
    const operationMap = {};
    
    operationHistory.forEach(entry => {
      if (entry.type === 'start') {
        operationMap[entry.id] = { start: entry.timestamp };
        stats.total++;
      } else if (entry.type === 'end' && operationMap[entry.id]) {
        const duration = entry.timestamp - operationMap[entry.id].start;
        operationMap[entry.id].duration = duration;
        operationMap[entry.id].timedOut = entry.isTimeout;
        
        durations.push(duration);
        stats.completed++;
        
        if (entry.isTimeout) {
          stats.timedOut++;
        }
      }
    });
    
    if (durations.length > 0) {
      stats.averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    }
    
    stats.operations = operationMap;
    
    return stats;
  }, [operationHistory, trackOperations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (minTimeoutRef.current) {
        clearTimeout(minTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    loading,
    loadingOperations: Array.from(loadingOperations),
    loadingProgress,
    loadingMessage,
    isReadOnly,
    operationHistory,
    
    // Actions
    startLoading,
    endLoading,
    updateProgress,
    withLoading,
    withBatchLoading,
    resetLoading,
    setLoadingMessage,
    
    // Utilities
    isOperationLoading,
    getLoadingDuration,
    getOperationStats
  };
};

export default useLoadingState;