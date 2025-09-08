// src/pages/admin/articles/hooks/useArticleEditor.js - Refactored to compose smaller hooks
import { useCallback, useEffect } from 'react';
import { useFormState } from './useFormState.js';
import { useTabNavigation } from './useTabNavigation.js';
import { useArticlePersistence } from './useArticlePersistence.js';
import { useArticleEvents } from './useArticleEvents.js';
import { useValidation, validationSchemas } from '../../../../utils/validation';

/**
 * Composed article editor hook that orchestrates form state, tab navigation, and persistence
 * @param {Object} editingArticle - Article being edited (null for new article)
 * @param {Function} onClose - Callback when editor is closed
 * @param {Object} userProfile - Current user profile
 * @param {Function} debugAndFixContent - Function to fix content format issues
 * @returns {Object} Complete article editor state and methods
 */
export const useArticleEditor = (editingArticle, onClose, userProfile, debugAndFixContent) => {
  // Form state management
  const {
    formData,
    isDirty,
    initialData,
    updateFormData,
    handleContentChange,
    addArrayItem,
    updateArrayItem,
    removeArrayItem,
    resetForm,
    resetToInitial,
    isFieldDirty,
    getFormSummary
  } = useFormState(editingArticle, debugAndFixContent);

  // Validation
  const { 
    errors: validationErrors, 
    validate, 
    clearErrors, 
    hasErrors: hasValidationErrors 
  } = useValidation(validationSchemas.article);

  // Tab navigation with error handling
  const {
    activeTab,
    visitedTabs,
    switchToTab,
    goToNextTab,
    goToPreviousTab,
    goToFirstErrorTab,
    getTabsWithErrors,
    tabHasErrors,
    getTabErrorCount,
    areAllTabsValid,
    getTabCompletionStatus,
    handleKeyboardNavigation,
    hasErrors: hasTabErrors,
    completionRate
  } = useTabNavigation(validationErrors, 'overview');

  // Article persistence
  const {
    saving,
    lastSaved,
    saveConflict,
    autoSaveEnabled,
    saveArticle,
    saveWithStatus,
    forceSave,
    scheduleAutoSave,
    cancelAutoSave,
    setAutoSaveEnabled,
    canSave,
    getSaveStatus,
    cleanup: cleanupPersistence
  } = useArticlePersistence(
    editingArticle,
    userProfile,
    (savedArticle, isUpdate) => {
      // On successful save
      emit('article:saved', { 
        article: savedArticle, 
        isUpdate, 
        formData,
        editingArticle 
      });
    },
    (error) => {
      // On save error
      emit('article:save_error', { 
        error, 
        formData, 
        editingArticle 
      });
    }
  );

  // Event system integration
  const { emit, subscribe } = useArticleEvents();

  // Enhanced form change handler with auto-save
  const handleFormChange = useCallback((updates) => {
    updateFormData(updates);
    
    // Schedule auto-save if enabled and form is dirty
    if (autoSaveEnabled && editingArticle) {
      const newFormData = { ...formData, ...updates };
      scheduleAutoSave(newFormData);
    }
    
    // Emit form change event
    emit('article:form_changed', { 
      updates, 
      formData: { ...formData, ...updates },
      isDirty: true 
    });
  }, [updateFormData, autoSaveEnabled, editingArticle, formData, scheduleAutoSave, emit]);

  // Enhanced content change handler
  const handleContentChangeWithEvents = useCallback((content) => {
    handleContentChange(content);
    
    // Emit content change event for collaboration
    emit('article:content_changed', { 
      content, 
      articleId: editingArticle?.id,
      userId: userProfile?.id 
    });
  }, [handleContentChange, emit, editingArticle?.id, userProfile?.id]);

  // Save handlers with event integration
  const handleSave = useCallback(async (onSuccessCallback) => {
    try {
      // Validate form
      if (!validate(formData)) {
        goToFirstErrorTab();
        return false;
      }

      // Emit save start event
      emit('article:save_start', { formData, editingArticle });

      // Attempt save
      const result = await saveArticle(formData);
      
      if (result.success) {
        // Emit success event
        emit('article:save_success', { 
          article: result.data, 
          isUpdate: result.isUpdate,
          formData 
        });
        
        // Call callback
        onSuccessCallback?.(result.data);
        
        // Close editor
        onClose();
        return true;
      } else if (result.conflict) {
        // Handle save conflict
        emit('article:save_conflict', { 
          conflict: result.conflict, 
          formData 
        });
        return false;
      }
      
      return false;
    } catch (error) {
      emit('article:save_error', { error, formData, editingArticle });
      return false;
    }
  }, [formData, validate, goToFirstErrorTab, emit, editingArticle, saveArticle, onClose]);

  // Save with status handler
  const handleSaveWithStatus = useCallback(async (status, onSuccessCallback) => {
    try {
      // Validate form
      if (!validate(formData)) {
        goToFirstErrorTab();
        return false;
      }

      // Emit status change start event
      emit('article:status_change_start', { 
        formData, 
        newStatus: status, 
        oldStatus: formData.status,
        editingArticle 
      });

      // Save with new status
      const result = await saveWithStatus(formData, status);
      
      if (result.success) {
        // Emit status change success event
        emit('article:status_changed', { 
          article: result.data, 
          newStatus: status,
          oldStatus: formData.status,
          formData 
        });
        
        // Call callback
        onSuccessCallback?.(result.data);
        
        // Close editor
        onClose();
        return true;
      }
      
      return false;
    } catch (error) {
      emit('article:status_change_error', { 
        error, 
        status, 
        formData, 
        editingArticle 
      });
      return false;
    }
  }, [formData, validate, goToFirstErrorTab, emit, editingArticle, saveWithStatus, onClose]);

  // Enhanced close handler with dirty check
  const handleClose = useCallback(() => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
      return false;
    }
    
    // Cancel any pending auto-save
    cancelAutoSave();
    
    // Emit close event
    emit('article:editor_closed', { 
      formData, 
      isDirty, 
      editingArticle 
    });
    
    // Reset form and close
    resetForm();
    onClose();
    return true;
  }, [isDirty, cancelAutoSave, emit, formData, editingArticle, resetForm, onClose]);

  // Keyboard shortcuts handler
  const handleKeyboardShortcuts = useCallback((event) => {
    // Handle tab navigation
    handleKeyboardNavigation(event);
    
    // Handle save shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 's':
          event.preventDefault();
          if (canSave(formData)) {
            handleSave();
          }
          break;
        case 'Enter':
          if (event.shiftKey) {
            event.preventDefault();
            // Quick publish for admins
            if (userProfile?.role === 'admin') {
              handleSaveWithStatus('published');
            }
          }
          break;
        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
      }
    }
  }, [
    handleKeyboardNavigation, 
    canSave, 
    formData, 
    handleSave, 
    handleSaveWithStatus, 
    handleClose, 
    userProfile?.role
  ]);

  // Auto-save management
  useEffect(() => {
    if (autoSaveEnabled && isDirty && editingArticle && canSave(formData)) {
      scheduleAutoSave(formData);
    }
    
    return () => {
      cancelAutoSave();
    };
  }, [autoSaveEnabled, isDirty, editingArticle, formData, canSave, scheduleAutoSave, cancelAutoSave]);

  // Event listeners setup
  useEffect(() => {
    // Listen for external events that might affect the editor
    const unsubscribers = [];

    // Listen for collaboration events
    unsubscribers.push(
      subscribe('collaboration:edit', ({ articleId, userId, field, value }) => {
        if (articleId === editingArticle?.id && userId !== userProfile?.id) {
          // Another user is editing - show indicator
          emit('article:collaboration_detected', { 
            otherUserId: userId, 
            field, 
            value 
          });
        }
      })
    );

    // Listen for save conflicts
    unsubscribers.push(
      subscribe('article:save_conflict', ({ conflict }) => {
        // Handle conflict UI updates
        emit('article:conflict_ui_update', { conflict });
      })
    );

    // Cleanup
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe, emit, editingArticle?.id, userProfile?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPersistence();
      cancelAutoSave();
      
      // Emit cleanup event
      emit('article:editor_cleanup', { 
        editingArticle, 
        formData, 
        isDirty 
      });
    };
  }, [cleanupPersistence, cancelAutoSave, emit, editingArticle, formData, isDirty]);

  // Get comprehensive editor status
  const getEditorStatus = useCallback(() => {
    const formSummary = getFormSummary();
    const saveStatus = getSaveStatus();
    const tabCompletion = getTabCompletionStatus();
    
    return {
      // Form state
      isDirty,
      isValid: areAllTabsValid(),
      completionRate,
      formSummary,
      
      // Save state
      ...saveStatus,
      canSave: canSave(formData),
      
      // Tab state
      activeTab,
      visitedTabs,
      tabCompletion,
      
      // Validation
      hasValidationErrors,
      hasTabErrors,
      errorCount: Object.keys(validationErrors).length,
      
      // General state
      isNew: !editingArticle,
      isEditing: Boolean(editingArticle)
    };
  }, [
    getFormSummary,
    getSaveStatus,
    getTabCompletionStatus,
    isDirty,
    areAllTabsValid,
    completionRate,
    canSave,
    formData,
    activeTab,
    visitedTabs,
    hasValidationErrors,
    hasTabErrors,
    validationErrors,
    editingArticle
  ]);

  return {
    // Form state
    formData,
    isDirty,
    initialData,
    
    // Tab navigation
    activeTab,
    visitedTabs,
    setActiveTab: switchToTab,
    goToNextTab,
    goToPreviousTab,
    goToFirstErrorTab,
    
    // Form manipulation
    updateFormData: handleFormChange,
    handleContentChange: handleContentChangeWithEvents,
    addArrayItem,
    updateArrayItem,
    removeArrayItem,
    resetForm,
    resetToInitial,
    
    // Save operations
    handleSave,
    handleSaveWithStatus,
    forceSave,
    saving,
    lastSaved,
    saveConflict,
    
    // Auto-save
    autoSaveEnabled,
    setAutoSaveEnabled,
    scheduleAutoSave,
    cancelAutoSave,
    
    // Validation and errors
    errors: validationErrors,
    hasErrors: hasValidationErrors || hasTabErrors,
    getTabsWithErrors,
    tabHasErrors,
    getTabErrorCount,
    areAllTabsValid,
    
    // UI handlers
    handleClose,
    handleKeyboardShortcuts,
    
    // Utilities
    isFieldDirty,
    canSave: canSave(formData),
    getEditorStatus,
    
    // Event integration
    emit,
    subscribe
  };
};