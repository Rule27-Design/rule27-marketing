// src/hooks/useAutoSave.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing auto-save functionality with debouncing and conflict detection
 * @param {Object} data - Data to auto-save
 * @param {Boolean} enabled - Whether auto-save is enabled
 * @param {Function} onSave - Save function
 * @param {Object} options - Configuration options
 */
export const useAutoSave = (data, enabled = true, onSave, options = {}) => {
  const {
    delay = 3000, // Delay in milliseconds before auto-saving
    minDelay = 1000, // Minimum delay between saves
    maxRetries = 3, // Maximum number of retry attempts
    retryDelay = 1000, // Delay between retries
    onSuccess = null, // Callback on successful save
    onError = null, // Callback on save error
    onConflict = null, // Callback on conflict detection
    storageKey = null, // LocalStorage key for offline support
    compareVersions = null, // Function to compare versions
    debounceMode = 'trailing' // 'leading', 'trailing', or 'both'
  } = options;

  // State
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error, conflict
  const [lastSaved, setLastSaved] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [saveCount, setSaveCount] = useState(0);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [conflictData, setConflictData] = useState(null);
  
  // Refs
  const timeoutRef = useRef(null);
  const lastSaveTimeRef = useRef(null);
  const isSavingRef = useRef(false);
  const dataRef = useRef(data);
  const previousDataRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  // Update data ref when data changes
  useEffect(() => {
    dataRef.current = data;
    
    // Check if data has actually changed
    if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
      setPendingChanges(true);
    }
  }, [data]);

  // Perform save operation
  const performSave = useCallback(async (dataToSave, isRetry = false) => {
    if (isSavingRef.current && !isRetry) {
      return { success: false, reason: 'already_saving' };
    }

    isSavingRef.current = true;
    setSaveStatus('saving');
    setLastError(null);
    
    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();
    
    try {
      // Check minimum delay between saves
      const now = Date.now();
      if (lastSaveTimeRef.current && (now - lastSaveTimeRef.current) < minDelay) {
        const waitTime = minDelay - (now - lastSaveTimeRef.current);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Save to localStorage first if enabled
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            data: dataToSave,
            timestamp: now,
            version: dataToSave.version || 1
          }));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }
      }
      
      // Perform the actual save
      const result = await onSave(dataToSave, {
        signal: abortControllerRef.current.signal,
        isAutoSave: true,
        isRetry
      });
      
      // Handle conflict detection
      if (compareVersions && result.serverVersion) {
        const hasConflict = compareVersions(dataToSave, result.serverVersion);
        if (hasConflict) {
          setSaveStatus('conflict');
          setConflictData(result.serverVersion);
          
          if (onConflict) {
            onConflict(dataToSave, result.serverVersion);
          }
          
          return { success: false, reason: 'conflict', serverVersion: result.serverVersion };
        }
      }
      
      // Success
      setSaveStatus('saved');
      setLastSaved(now);
      lastSaveTimeRef.current = now;
      setSaveCount(prev => prev + 1);
      setPendingChanges(false);
      setRetryCount(0);
      previousDataRef.current = dataToSave;
      
      // Clear localStorage on successful save
      if (storageKey) {
        try {
          localStorage.removeItem(storageKey);
        } catch (e) {
          console.warn('Failed to clear localStorage:', e);
        }
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return { success: true, result };
      
    } catch (error) {
      // Check if error was due to abort
      if (error.name === 'AbortError') {
        return { success: false, reason: 'aborted' };
      }
      
      setSaveStatus('error');
      setLastError(error);
      
      // Handle retry logic
      if (retryCount < maxRetries && !isRetry) {
        setRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          performSave(dataToSave, true);
        }, retryDelay * (retryCount + 1));
        
        return { success: false, reason: 'will_retry', retryCount };
      }
      
      if (onError) {
        onError(error);
      }
      
      return { success: false, error };
      
    } finally {
      isSavingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [onSave, minDelay, storageKey, compareVersions, onSuccess, onError, onConflict, maxRetries, retryDelay, retryCount]);

  // Trigger auto-save
  const triggerAutoSave = useCallback(() => {
    if (!enabled || !pendingChanges) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Handle debounce mode
    if (debounceMode === 'leading' && !isSavingRef.current) {
      performSave(dataRef.current);
    } else {
      timeoutRef.current = setTimeout(() => {
        if (debounceMode === 'both' || debounceMode === 'trailing') {
          performSave(dataRef.current);
        }
      }, delay);
    }
  }, [enabled, pendingChanges, delay, debounceMode, performSave]);

  // Manual save trigger
  const save = useCallback(async () => {
    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    return performSave(dataRef.current);
  }, [performSave]);

  // Cancel pending save
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setSaveStatus('idle');
    setPendingChanges(false);
  }, []);

  // Resolve conflict
  const resolveConflict = useCallback(async (resolution) => {
    setConflictData(null);
    
    if (resolution === 'local') {
      // Use local version
      return performSave(dataRef.current);
    } else if (resolution === 'server') {
      // Use server version
      previousDataRef.current = conflictData;
      setPendingChanges(false);
      setSaveStatus('idle');
      return { success: true, usedServerVersion: true };
    } else if (resolution === 'merge' && typeof resolution === 'object') {
      // Use merged version
      return performSave(resolution);
    }
  }, [conflictData, performSave]);

  // Restore from localStorage
  const restoreFromStorage = useCallback(() => {
    if (!storageKey) return null;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to restore from localStorage:', e);
    }
    
    return null;
  }, [storageKey]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
    }
    
    setLastSaved(null);
    setSaveCount(0);
    setPendingChanges(false);
    previousDataRef.current = null;
  }, [storageKey]);

  // Auto-save effect
  useEffect(() => {
    if (enabled && pendingChanges) {
      triggerAutoSave();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, pendingChanges, triggerAutoSave]);

  // Check for unsaved changes on unmount or page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (pendingChanges && enabled) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Perform final save on unmount if needed
      if (pendingChanges && enabled && storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            data: dataRef.current,
            timestamp: Date.now(),
            unfinished: true
          }));
        } catch (e) {
          console.warn('Failed to save on unmount:', e);
        }
      }
    };
  }, [pendingChanges, enabled, storageKey]);

  // Get time since last save
  const getTimeSinceLastSave = useCallback(() => {
    if (!lastSaved) return null;
    return Date.now() - lastSaved;
  }, [lastSaved]);

  // Get formatted last save time
  const getFormattedLastSaved = useCallback(() => {
    if (!lastSaved) return null;
    
    const now = Date.now();
    const diff = now - lastSaved;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return new Date(lastSaved).toLocaleString();
  }, [lastSaved]);

  return {
    // State
    saveStatus,
    lastSaved,
    lastError,
    saveCount,
    pendingChanges,
    retryCount,
    conflictData,
    isSaving: isSavingRef.current,
    
    // Actions
    save,
    cancel,
    triggerAutoSave,
    resolveConflict,
    restoreFromStorage,
    clearSaved,
    
    // Helpers
    getTimeSinceLastSave,
    getFormattedLastSaved
  };
};

export default useAutoSave;