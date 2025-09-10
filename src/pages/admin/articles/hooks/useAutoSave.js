// src/pages/admin/articles/hooks/useAutoSave.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { articleOperations } from '../services/ArticleOperations';
import { useDebounce } from '../../../../hooks/useDebounce';

export const useAutoSave = (formData, articleId, enabled = true, delay = 5000) => {
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [lastSaved, setLastSaved] = useState(null);
  const previousDataRef = useRef(formData);
  const saveTimeoutRef = useRef(null);

  // Debounced save function
  const performSave = useCallback(async (data) => {
    if (!articleId || !enabled) return;

    setSaveStatus('saving');
    
    try {
      const result = await articleOperations.update(articleId, {
        ...data,
        auto_save: true // Flag to indicate this is an auto-save
      });

      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        previousDataRef.current = data;

        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [articleId, enabled]);

  // Monitor changes and trigger auto-save
  useEffect(() => {
    if (!enabled || !articleId) return;

    // Check if data has changed
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanged) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        performSave(formData);
      }, delay);
    }

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, enabled, articleId, delay, performSave]);

  // Manual trigger for auto-save
  const triggerAutoSave = useCallback(() => {
    if (articleId && enabled) {
      // Clear any pending auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      performSave(formData);
    }
  }, [articleId, enabled, formData, performSave]);

  // Force save (immediate, no debounce)
  const forceSave = useCallback(async () => {
    if (!articleId) return { success: false, error: 'No article ID' };

    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('saving');
    
    try {
      const result = await articleOperations.update(articleId, formData);
      
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        previousDataRef.current = formData;
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
      
      return result;
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return { success: false, error: error.message };
    }
  }, [articleId, formData]);

  return {
    saveStatus,
    lastSaved,
    triggerAutoSave,
    forceSave
  };
};