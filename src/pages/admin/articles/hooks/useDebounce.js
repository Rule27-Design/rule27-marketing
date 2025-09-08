// src/pages/admin/articles/hooks/useDebounce.js - Debouncing hook for performance
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Debounce hook to delay expensive operations like search
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedValue;
};

/**
 * Advanced debounce hook with immediate execution option
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Configuration options
 * @returns {Object} Debounced function and utilities
 */
export const useDebouncedCallback = (func, delay = 300, options = {}) => {
  const {
    immediate = false, // Execute immediately on first call
    maxWait = null, // Maximum time to wait before executing
    dependencies = [] // Dependencies that trigger immediate execution
  } = options;

  const timeoutRef = useRef(null);
  const maxTimeoutRef = useRef(null);
  const lastCallTime = useRef(0);
  const lastInvokeTime = useRef(0);
  const funcRef = useRef(func);

  // Update function reference when dependencies change
  useEffect(() => {
    funcRef.current = func;
  }, [func, ...dependencies]);

  const debouncedFunction = useCallback((...args) => {
    const currentTime = Date.now();
    lastCallTime.current = currentTime;

    const invokeFunc = () => {
      lastInvokeTime.current = currentTime;
      return funcRef.current(...args);
    };

    const shouldInvokeImmediate = immediate && (currentTime - lastInvokeTime.current) > delay;
    
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
    }

    // Immediate execution
    if (shouldInvokeImmediate) {
      return invokeFunc();
    }

    // Set debounced timeout
    timeoutRef.current = setTimeout(() => {
      if (lastCallTime.current === currentTime) {
        invokeFunc();
      }
    }, delay);

    // Set max wait timeout
    if (maxWait && (currentTime - lastInvokeTime.current) >= maxWait) {
      invokeFunc();
    } else if (maxWait) {
      maxTimeoutRef.current = setTimeout(() => {
        invokeFunc();
      }, maxWait - (currentTime - lastInvokeTime.current));
    }
  }, [delay, immediate, maxWait]);

  // Cancel function
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, []);

  // Flush function (execute immediately)
  const flush = useCallback((...args) => {
    cancel();
    return funcRef.current(...args);
  }, [cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    debouncedFunction,
    cancel,
    flush,
    isPending: () => timeoutRef.current !== null
  };
};

/**
 * Hook for debounced async operations with loading state
 * @param {Function} asyncFunc - Async function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Object} Debounced async function with loading state
 */
export const useDebouncedAsync = (asyncFunc, delay = 300) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const { debouncedFunction, cancel } = useDebouncedCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    delay
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    cancel();
  }, [cancel]);

  return {
    execute: debouncedFunction,
    loading,
    error,
    data,
    reset,
    cancel
  };
};

/**
 * Hook for search with debouncing and caching
 * @param {Function} searchFunc - Search function that returns a promise
 * @param {Object} options - Configuration options
 * @returns {Object} Search utilities and state
 */
export const useDebouncedSearch = (searchFunc, options = {}) => {
  const {
    delay = 300,
    minLength = 1,
    cacheSize = 50,
    cacheTimeout = 5 * 60 * 1000 // 5 minutes
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  // Debounced search function
  const { debouncedFunction: debouncedSearch } = useDebouncedCallback(
    async (searchQuery) => {
      if (searchQuery.length < minLength) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Check cache first
      const cacheKey = searchQuery.toLowerCase();
      const cached = cacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        setResults(cached.results);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();
        
        const searchResults = await searchFunc(searchQuery, {
          signal: abortControllerRef.current.signal
        });
        
        setResults(searchResults);

        // Cache results
        cacheRef.current.set(cacheKey, {
          results: searchResults,
          timestamp: Date.now()
        });

        // Cleanup old cache entries
        if (cacheRef.current.size > cacheSize) {
          const oldestKey = cacheRef.current.keys().next().value;
          cacheRef.current.delete(oldestKey);
        }

      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    },
    delay
  );

  // Update search query and trigger search
  const search = useCallback((newQuery) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);

  // Clear search
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    results,
    loading,
    error,
    search,
    clear,
    clearCache,
    cacheSize: cacheRef.current.size
  };
};

export default useDebounce;