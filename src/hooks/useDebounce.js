// src/hooks/useDebounce.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook that debounces a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Object} options - Additional options
 */
export const useDebounce = (value, delay = 500, options = {}) => {
  const {
    leading = false,
    trailing = true,
    maxWait = null,
    onDebounce = null
  } = options;

  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  
  const timeoutRef = useRef(null);
  const maxTimeoutRef = useRef(null);
  const lastCallTimeRef = useRef(null);
  const lastValueRef = useRef(value);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    // Handle leading edge
    if (leading && !hasCalledRef.current) {
      setDebouncedValue(value);
      hasCalledRef.current = true;
      if (onDebounce) onDebounce(value);
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start debouncing
    setIsDebouncing(true);

    // Set up max wait timeout if specified
    if (maxWait && !maxTimeoutRef.current) {
      const timeSinceLastCall = lastCallTimeRef.current 
        ? Date.now() - lastCallTimeRef.current 
        : maxWait;
      
      if (timeSinceLastCall >= maxWait) {
        // Max wait exceeded, update immediately
        setDebouncedValue(value);
        lastCallTimeRef.current = Date.now();
        if (onDebounce) onDebounce(value);
      } else {
        // Set up max wait timeout
        maxTimeoutRef.current = setTimeout(() => {
          setDebouncedValue(lastValueRef.current);
          lastCallTimeRef.current = Date.now();
          maxTimeoutRef.current = null;
          if (onDebounce) onDebounce(lastValueRef.current);
        }, maxWait - timeSinceLastCall);
      }
    }

    // Set up regular debounce timeout
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        setIsDebouncing(false);
        hasCalledRef.current = false;
        lastCallTimeRef.current = Date.now();
        
        // Clear max timeout if it exists
        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current);
          maxTimeoutRef.current = null;
        }
        
        if (onDebounce) onDebounce(value);
      }, delay);
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsDebouncing(false);
        hasCalledRef.current = false;
      }, delay);
    }

    // Update last value ref
    lastValueRef.current = value;

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, [value, delay, leading, trailing, maxWait, onDebounce]);

  // Force flush the debounced value
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    
    setDebouncedValue(lastValueRef.current);
    setIsDebouncing(false);
    hasCalledRef.current = false;
    lastCallTimeRef.current = Date.now();
    
    if (onDebounce) onDebounce(lastValueRef.current);
  }, [onDebounce]);

  // Cancel pending debounce
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    
    setIsDebouncing(false);
    hasCalledRef.current = false;
  }, []);

  return [debouncedValue, { isDebouncing, flush, cancel }];
};

/**
 * Hook that returns a debounced callback
 * @param {Function} callback - Callback to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} dependencies - Dependencies array
 * @param {Object} options - Additional options
 */
export const useDebouncedCallback = (callback, delay = 500, dependencies = [], options = {}) => {
  const {
    leading = false,
    trailing = true,
    maxWait = null
  } = options;

  const timeoutRef = useRef(null);
  const maxTimeoutRef = useRef(null);
  const lastCallTimeRef = useRef(null);
  const lastArgsRef = useRef(null);
  const hasCalledRef = useRef(false);

  // Store the latest callback
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);

  // Create debounced function
  const debouncedCallback = useCallback((...args) => {
    lastArgsRef.current = args;

    // Handle leading edge
    if (leading && !hasCalledRef.current) {
      callbackRef.current(...args);
      hasCalledRef.current = true;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set up max wait timeout if specified
    if (maxWait && !maxTimeoutRef.current) {
      const timeSinceLastCall = lastCallTimeRef.current 
        ? Date.now() - lastCallTimeRef.current 
        : maxWait;
      
      if (timeSinceLastCall >= maxWait) {
        // Max wait exceeded, call immediately
        callbackRef.current(...args);
        lastCallTimeRef.current = Date.now();
      } else {
        // Set up max wait timeout
        maxTimeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
            lastCallTimeRef.current = Date.now();
          }
          maxTimeoutRef.current = null;
        }, maxWait - timeSinceLastCall);
      }
    }

    // Set up regular debounce timeout
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        if (lastArgsRef.current) {
          callbackRef.current(...lastArgsRef.current);
          lastCallTimeRef.current = Date.now();
        }
        
        hasCalledRef.current = false;
        
        // Clear max timeout if it exists
        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current);
          maxTimeoutRef.current = null;
        }
      }, delay);
    } else {
      timeoutRef.current = setTimeout(() => {
        hasCalledRef.current = false;
      }, delay);
    }
  }, [delay, leading, trailing, maxWait]);

  // Force flush
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    
    if (lastArgsRef.current) {
      callbackRef.current(...lastArgsRef.current);
      lastCallTimeRef.current = Date.now();
    }
    
    hasCalledRef.current = false;
  }, []);

  // Cancel pending execution
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    
    lastArgsRef.current = null;
    hasCalledRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, []);

  return { debouncedCallback, flush, cancel };
};

export default useDebounce;