// src/pages/admin/articles/hooks/useAutoSave.js
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from '../../../../hooks/useDebounce';
import { supabase } from '../../../../lib/supabase';

export const useAutoSave = (formData, articleId, enabled = true, delay = 5000) => {
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [lastSaved, setLastSaved] = useState(null);
  const previousDataRef = useRef(formData);

  const saveArticle = async (data) => {
    if (!articleId || !enabled) return;

    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('articles')
        .update(data)
        .eq('id', articleId);

      if (error) throw error;

      setSaveStatus('saved');
      setLastSaved(new Date());
      previousDataRef.current = data;

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
    }
  };

  const { debouncedCallback: debouncedSave } = useDebouncedCallback(
    saveArticle,
    delay,
    [articleId]
  );

  useEffect(() => {
    if (!enabled || !articleId) return;

    // Check if data has changed
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(previousDataRef.current);
    
    if (hasChanged) {
      debouncedSave(formData);
    }
  }, [formData, enabled, articleId, debouncedSave]);

  const triggerAutoSave = () => {
    if (articleId && enabled) {
      saveArticle(formData);
    }
  };

  return {
    saveStatus,
    lastSaved,
    triggerAutoSave
  };
};