// src/pages/admin/articles/hooks/useArticlePersistence.js - Save/update logic
import { useState, useCallback, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';
import { 
  sanitizeData, 
  generateSlug, 
  cleanTimestampField,
  useValidation,
  validationSchemas 
} from '../../../../utils/validation';

/**
 * Hook for handling article persistence operations
 * @param {Object} editingArticle - Article being edited (null for new)
 * @param {Object} userProfile - Current user profile
 * @param {Function} onSuccess - Callback on successful save
 * @param {Function} onError - Callback on error
 * @returns {Object} Persistence state and methods
 */
export const useArticlePersistence = (editingArticle, userProfile, onSuccess, onError) => {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [saveConflict, setSaveConflict] = useState(null);
  
  const toast = useToast();
  const autoSaveTimeoutRef = useRef(null);
  const lastSaveDataRef = useRef(null);
  
  // Validation hook
  const { validate, errors: validationErrors } = useValidation(validationSchemas.article);

  // Prepare article data for saving
  const prepareArticleData = useCallback((formData) => {
    const sanitizedData = sanitizeData(formData);

    // Generate slug if not provided
    if (!sanitizedData.slug && sanitizedData.title) {
      sanitizedData.slug = generateSlug(sanitizedData.title);
    }

    // Auto-generate canonical URL if not provided
    if (!sanitizedData.canonical_url && sanitizedData.slug) {
      sanitizedData.canonical_url = `https://rule27design.com/articles/${sanitizedData.slug}`;
    }

    // Calculate read time if content exists
    if (sanitizedData.content && sanitizedData.content.wordCount) {
      sanitizedData.read_time = Math.ceil(sanitizedData.content.wordCount / 200);
    }

    // Prepare data for database
    const articleData = {
      ...sanitizedData,
      author_id: userProfile.id,
      updated_by: userProfile.id,
      tags: sanitizedData.tags.filter(Boolean),
      meta_keywords: sanitizedData.meta_keywords.filter(Boolean),
      co_authors: sanitizedData.co_authors.filter(Boolean),
      scheduled_at: cleanTimestampField(sanitizedData.scheduled_at)
    };

    // Add creation fields for new articles
    if (!editingArticle) {
      articleData.created_by = userProfile.id;
    }

    return articleData;
  }, [editingArticle, userProfile.id]);

  // Check for save conflicts
  const checkForConflicts = useCallback(async () => {
    if (!editingArticle) return null;

    try {
      const { data: currentArticle, error } = await supabase
        .from('articles')
        .select('updated_at, updated_by, profiles!articles_updated_by_fkey(full_name)')
        .eq('id', editingArticle.id)
        .single();

      if (error) throw error;

      const currentUpdatedAt = new Date(currentArticle.updated_at);
      const editingUpdatedAt = new Date(editingArticle.updated_at);

      if (currentUpdatedAt > editingUpdatedAt) {
        return {
          hasConflict: true,
          lastUpdatedBy: currentArticle.profiles?.full_name || 'Unknown',
          lastUpdatedAt: currentUpdatedAt
        };
      }

      return { hasConflict: false };
    } catch (error) {
      console.warn('Could not check for conflicts:', error);
      return { hasConflict: false };
    }
  }, [editingArticle]);

  // Handle save conflicts
  const handleSaveConflict = useCallback((conflictInfo) => {
    setSaveConflict(conflictInfo);
    
    toast.warning(
      'Editing Conflict Detected',
      `This article was modified by ${conflictInfo.lastUpdatedBy} while you were editing. Please review the changes.`
    );
  }, [toast]);

  // Save article with validation and conflict checking
  const saveArticle = useCallback(async (formData, options = {}) => {
    const { 
      skipValidation = false,
      skipConflictCheck = false,
      showToast = true,
      isAutoSave = false
    } = options;

    try {
      setSaving(true);
      setSaveConflict(null);

      // Validate data unless skipped
      if (!skipValidation && !validate(formData)) {
        const errorMessage = Object.values(validationErrors).join(', ');
        throw new Error(`Validation failed: ${errorMessage}`);
      }

      // Check for conflicts unless skipped
      if (!skipConflictCheck) {
        const conflictCheck = await checkForConflicts();
        if (conflictCheck?.hasConflict) {
          handleSaveConflict(conflictCheck);
          return { success: false, conflict: true };
        }
      }

      // Prepare article data
      const articleData = prepareArticleData(formData);

      // Perform save operation
      let result;
      if (editingArticle) {
        const { data, error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id)
          .select()
          .single();

        if (error) throw error;
        result = { data, isUpdate: true };
      } else {
        const { data, error } = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single();

        if (error) throw error;
        result = { data, isUpdate: false };
      }

      // Update state
      setLastSaved(new Date());
      lastSaveDataRef.current = formData;

      // Show success message
      if (showToast && !isAutoSave) {
        const message = result.isUpdate ? 'Article updated successfully' : 'Article created successfully';
        toast.success(message);
      }

      // Call success callback
      onSuccess?.(result.data, result.isUpdate);

      return { success: true, data: result.data, isUpdate: result.isUpdate };

    } catch (error) {
      console.error('Error saving article:', error);
      
      if (showToast) {
        toast.error('Save Failed', error.message);
      }
      
      onError?.(error);
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  }, [
    editingArticle, 
    validate, 
    validationErrors, 
    checkForConflicts, 
    handleSaveConflict,
    prepareArticleData,
    onSuccess,
    onError,
    toast
  ]);

  // Save with specific status
  const saveWithStatus = useCallback(async (formData, status, options = {}) => {
    const updatedFormData = { ...formData, status };
    
    // Add status-specific timestamps
    const now = new Date().toISOString();
    switch (status) {
      case 'pending_approval':
        updatedFormData.submitted_for_approval_at = now;
        break;
      case 'approved':
        updatedFormData.approved_by = userProfile.id;
        updatedFormData.approved_at = now;
        break;
      case 'published':
        updatedFormData.published_at = now;
        break;
      case 'archived':
        updatedFormData.archived_at = now;
        break;
    }

    return saveArticle(updatedFormData, options);
  }, [saveArticle, userProfile.id]);

  // Auto-save functionality
  const scheduleAutoSave = useCallback((formData, delay = 30000) => {
    if (!autoSaveEnabled) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Don't auto-save if data hasn't changed
    if (lastSaveDataRef.current && 
        JSON.stringify(formData) === JSON.stringify(lastSaveDataRef.current)) {
      return;
    }

    // Schedule auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveArticle(formData, { 
        skipValidation: true, 
        showToast: false, 
        isAutoSave: true 
      }).then(result => {
        if (result.success) {
          console.log('Auto-saved at', new Date().toLocaleTimeString());
        }
      });
    }, delay);
  }, [autoSaveEnabled, saveArticle]);

  // Cancel scheduled auto-save
  const cancelAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
  }, []);

  // Force save (override conflicts)
  const forceSave = useCallback(async (formData) => {
    setSaveConflict(null);
    return saveArticle(formData, { skipConflictCheck: true });
  }, [saveArticle]);

  // Check if article can be saved
  const canSave = useCallback((formData) => {
    if (saving) return false;
    if (!formData.title?.trim()) return false;
    return true;
  }, [saving]);

  // Get save status information
  const getSaveStatus = useCallback(() => {
    return {
      saving,
      lastSaved,
      hasConflict: Boolean(saveConflict),
      conflictInfo: saveConflict,
      autoSaveEnabled,
      hasValidationErrors: Object.keys(validationErrors).length > 0
    };
  }, [saving, lastSaved, saveConflict, autoSaveEnabled, validationErrors]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    cancelAutoSave();
  }, [cancelAutoSave]);

  return {
    // State
    saving,
    lastSaved,
    saveConflict,
    autoSaveEnabled,
    validationErrors,

    // Core save methods
    saveArticle,
    saveWithStatus,
    forceSave,

    // Auto-save
    scheduleAutoSave,
    cancelAutoSave,
    setAutoSaveEnabled,

    // Utilities
    canSave,
    getSaveStatus,
    cleanup,

    // Conflict handling
    checkForConflicts,
    handleSaveConflict,

    // Data preparation
    prepareArticleData
  };
};