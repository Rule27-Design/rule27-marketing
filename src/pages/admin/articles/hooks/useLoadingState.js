// src/pages/admin/articles/hooks/useLoadingState.js - Centralized loading state management
import React, { useState, useCallback, useRef } from 'react';

/**
 * Centralized loading state management for articles
 * @returns {Object} Loading state manager with methods and current states
 */
export const useLoadingState = () => {
  const [states, setStates] = useState({
    fetching: false,
    saving: false,
    deleting: false,
    publishing: false,
    duplicating: false,
    uploading: false,
    validating: false,
    exporting: false
  });

  // Track active operations for debugging
  const activeOperations = useRef(new Set());
  
  /**
   * Set loading state for a specific operation
   * @param {string} operation - The operation type (fetching, saving, etc.)
   * @param {boolean} isLoading - Whether the operation is loading
   */
  const setLoading = useCallback((operation, isLoading) => {
    if (isLoading) {
      activeOperations.current.add(operation);
    } else {
      activeOperations.current.delete(operation);
    }
    
    setStates(prev => ({ 
      ...prev, 
      [operation]: isLoading 
    }));
  }, []);

  /**
   * Start loading for an operation
   * @param {string} operation - The operation type
   */
  const startLoading = useCallback((operation) => {
    setLoading(operation, true);
  }, [setLoading]);

  /**
   * Stop loading for an operation
   * @param {string} operation - The operation type
   */
  const stopLoading = useCallback((operation) => {
    setLoading(operation, false);
  }, [setLoading]);

  /**
   * Execute an async operation with automatic loading state management
   * @param {string} operation - The operation type
   * @param {Function} asyncFn - The async function to execute
   * @returns {Promise} The result of the async function
   */
  const withLoading = useCallback(async (operation, asyncFn) => {
    try {
      startLoading(operation);
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading(operation);
    }
  }, [startLoading, stopLoading]);

  /**
   * Check if any operation is currently loading
   * @returns {boolean} True if any operation is loading
   */
  const isAnyLoading = useCallback(() => {
    return Object.values(states).some(state => state === true);
  }, [states]);

  /**
   * Get all currently active operations
   * @returns {string[]} Array of active operation names
   */
  const getActiveOperations = useCallback(() => {
    return Array.from(activeOperations.current);
  }, []);

  /**
   * Clear all loading states (useful for cleanup)
   */
  const clearAll = useCallback(() => {
    activeOperations.current.clear();
    setStates({
      fetching: false,
      saving: false,
      deleting: false,
      publishing: false,
      duplicating: false,
      uploading: false,
      validating: false,
      exporting: false
    });
  }, []);

  /**
   * Get loading state for multiple operations
   * @param {string[]} operations - Array of operation names to check
   * @returns {boolean} True if any of the specified operations are loading
   */
  const isLoadingAny = useCallback((operations) => {
    return operations.some(op => states[op]);
  }, [states]);

  /**
   * Get loading state for all specified operations
   * @param {string[]} operations - Array of operation names to check
   * @returns {boolean} True if all specified operations are loading
   */
  const isLoadingAll = useCallback((operations) => {
    return operations.every(op => states[op]);
  }, [states]);

  return {
    // Individual loading states
    ...states,
    
    // State management methods
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    
    // Utility methods
    isAnyLoading,
    isLoadingAny,
    isLoadingAll,
    getActiveOperations,
    clearAll,
    
    // Computed states for common combinations
    isOperational: !states.fetching && !states.saving,
    isReadOnly: states.fetching || states.saving || states.deleting,
    isBusy: isAnyLoading()
  };
};

/**
 * Hook for operation-specific loading states with automatic cleanup
 * @param {string} defaultOperation - Default operation name
 * @returns {Object} Operation-specific loading manager
 */
export const useOperationLoading = (defaultOperation = 'default') => {
  const { withLoading, setLoading, ...rest } = useLoadingState();
  
  const executeOperation = useCallback(async (asyncFn, operation = defaultOperation) => {
    return withLoading(operation, asyncFn);
  }, [withLoading, defaultOperation]);
  
  return {
    executeOperation,
    setLoading,
    isLoading: rest[defaultOperation] || false,
    ...rest
  };
};

export default useLoadingState;