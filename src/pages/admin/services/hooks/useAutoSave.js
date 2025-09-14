// src/pages/admin/services/hooks/useAutoSave.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { serviceOperations } from '../services/ServiceOperations';

export const useAutoSave = (formData, serviceId, enabled = true, delay = 5000) => {
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [lastSaved, setLastSaved] = useState(null);
  const previousDataRef = useRef(formData);
  const saveTimeoutRef = useRef(null);

  // Debounced save function
  const performSave = useCallback(async (data) => {
    if (!serviceId || !enabled) return;

    setSaveStatus('saving');
    
    try {
      const result = await serviceOperations.update(serviceId, {
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
  }, [serviceId, enabled]);

  // Monitor changes and trigger auto-save
  useEffect(() => {
    if (!enabled || !serviceId) return;

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
  }, [formData, enabled, serviceId, delay, performSave]);

  // Manual trigger for auto-save
  const triggerAutoSave = useCallback(() => {
    if (serviceId && enabled) {
      // Clear any pending auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      performSave(formData);
    }
  }, [serviceId, enabled, formData, performSave]);

  // Force save (immediate, no debounce)
  const forceSave = useCallback(async () => {
    if (!serviceId) return { success: false, error: 'No service ID' };

    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('saving');
    
    try {
      const result = await serviceOperations.update(serviceId, formData);
      
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
  }, [serviceId, formData]);

  return {
    saveStatus,
    lastSaved,
    triggerAutoSave,
    forceSave
  };
};