// src/pages/admin/articles/hooks/useFormState.js - Form data management hook
import { useState, useCallback, useEffect } from 'react';

const defaultFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: null,
  featured_image: '',
  featured_image_alt: '',
  featured_video: '',
  category_id: '',
  tags: [],
  co_authors: [],
  status: 'draft',
  is_featured: false,
  enable_comments: false,
  enable_reactions: true,
  scheduled_at: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: [],
  og_title: '',
  og_description: '',
  og_image: '',
  twitter_card: 'summary_large_image',
  canonical_url: '',
  read_time: null,
  internal_notes: '',
  schema_markup: null
};

/**
 * Hook for managing article form state
 * @param {Object} editingArticle - Article being edited (null for new article)
 * @param {Function} debugAndFixContent - Function to fix content format issues
 * @returns {Object} Form state management utilities
 */
export const useFormState = (editingArticle, debugAndFixContent) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState(defaultFormData);

  // Load article data into form when editing
  useEffect(() => {
    if (editingArticle && debugAndFixContent) {
      const fixedContent = debugAndFixContent(editingArticle.content, editingArticle.title);
      
      const loadedData = {
        title: editingArticle.title || '',
        slug: editingArticle.slug || '',
        excerpt: editingArticle.excerpt || '',
        content: fixedContent,
        featured_image: editingArticle.featured_image || '',
        featured_image_alt: editingArticle.featured_image_alt || '',
        featured_video: editingArticle.featured_video || '',
        category_id: editingArticle.category_id || '',
        tags: editingArticle.tags || [],
        co_authors: editingArticle.co_authors || [],
        status: editingArticle.status || 'draft',
        is_featured: editingArticle.is_featured || false,
        enable_comments: editingArticle.enable_comments || false,
        enable_reactions: editingArticle.enable_reactions !== false,
        scheduled_at: editingArticle.scheduled_at || '',
        meta_title: editingArticle.meta_title || '',
        meta_description: editingArticle.meta_description || '',
        meta_keywords: editingArticle.meta_keywords || [],
        og_title: editingArticle.og_title || '',
        og_description: editingArticle.og_description || '',
        og_image: editingArticle.og_image || '',
        twitter_card: editingArticle.twitter_card || 'summary_large_image',
        canonical_url: editingArticle.canonical_url || '',
        read_time: editingArticle.read_time,
        internal_notes: editingArticle.internal_notes || '',
        schema_markup: editingArticle.schema_markup
      };
      
      setFormData(loadedData);
      setInitialData(loadedData);
      setIsDirty(false);
    } else if (!editingArticle) {
      setFormData(defaultFormData);
      setInitialData(defaultFormData);
      setIsDirty(false);
    }
  }, [editingArticle, debugAndFixContent]);

  // Handle form field updates
  const updateFormData = useCallback((updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Check if form is dirty
      const isFormDirty = JSON.stringify(newData) !== JSON.stringify(initialData);
      setIsDirty(isFormDirty);
      
      return newData;
    });
  }, [initialData]);

  // Content change handler
  const handleContentChange = useCallback((content) => {
    updateFormData({ content });
  }, [updateFormData]);

  // Array manipulation helpers
  const addArrayItem = useCallback((field, value = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value]
    }));
    setIsDirty(true);
  }, []);

  const updateArrayItem = useCallback((field, index, value) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      const newData = { ...prev, [field]: newArray };
      
      const isFormDirty = JSON.stringify(newData) !== JSON.stringify(initialData);
      setIsDirty(isFormDirty);
      
      return newData;
    });
  }, [initialData]);

  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => {
      const newArray = (prev[field] || []).filter((_, i) => i !== index);
      const newData = { ...prev, [field]: newArray };
      
      const isFormDirty = JSON.stringify(newData) !== JSON.stringify(initialData);
      setIsDirty(isFormDirty);
      
      return newData;
    });
  }, [initialData]);

  // Reset form to default state
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setInitialData(defaultFormData);
    setIsDirty(false);
  }, []);

  // Reset form to initial loaded state
  const resetToInitial = useCallback(() => {
    setFormData(initialData);
    setIsDirty(false);
  }, [initialData]);

  // Check if specific field has changed
  const isFieldDirty = useCallback((fieldName) => {
    return JSON.stringify(formData[fieldName]) !== JSON.stringify(initialData[fieldName]);
  }, [formData, initialData]);

  // Get form validation summary
  const getFormSummary = useCallback(() => {
    const wordCount = formData.content?.wordCount || 0;
    const readTime = Math.ceil(wordCount / 200);
    
    return {
      wordCount,
      readTime,
      hasTitle: Boolean(formData.title),
      hasContent: Boolean(formData.content),
      hasCategory: Boolean(formData.category_id),
      hasMetaDescription: Boolean(formData.meta_description),
      hasFeaturedImage: Boolean(formData.featured_image),
      isDirty,
      isNew: !editingArticle
    };
  }, [formData, isDirty, editingArticle]);

  // Auto-save capabilities
  const createAutoSaveData = useCallback(() => {
    if (!isDirty) return null;
    
    return {
      ...formData,
      autoSavedAt: new Date().toISOString(),
      isAutoSave: true
    };
  }, [formData, isDirty]);

  return {
    // State
    formData,
    isDirty,
    initialData,
    
    // Actions
    updateFormData,
    handleContentChange,
    addArrayItem,
    updateArrayItem,
    removeArrayItem,
    resetForm,
    resetToInitial,
    
    // Utilities
    isFieldDirty,
    getFormSummary,
    createAutoSaveData
  };
};