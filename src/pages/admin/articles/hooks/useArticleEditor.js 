// src/pages/admin/articles/hooks/useArticleEditor.js - Editor state & validation (100 lines)
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';
import { 
  sanitizeData, 
  generateSlug, 
  cleanTimestampField,
  useValidation,
  validationSchemas 
} from '../../../../utils/validation';

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

export const useArticleEditor = (editingArticle, onClose, userProfile, debugAndFixContent) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  
  // Validation hook
  const { errors, validate, clearErrors, hasErrors } = useValidation(validationSchemas.article);

  // Tab Error Indicator Helper Functions
  const getFieldToTabMapping = () => ({
    title: 'overview',
    slug: 'overview', 
    excerpt: 'overview',
    category_id: 'overview',
    tags: 'overview',
    co_authors: 'overview',
    content: 'content',
    featured_image: 'media',
    featured_image_alt: 'media',
    featured_video: 'media',
    meta_title: 'seo',
    meta_description: 'seo',
    meta_keywords: 'seo',
    og_title: 'seo',
    og_description: 'seo',
    og_image: 'seo',
    twitter_card: 'seo',
    canonical_url: 'seo',
    is_featured: 'settings',
    enable_comments: 'settings',
    enable_reactions: 'settings',
    scheduled_at: 'settings',
    internal_notes: 'settings'
  });

  const getTabsWithErrors = useCallback((errors) => {
    const fieldToTab = getFieldToTabMapping();
    const tabsWithErrors = new Set();
    
    Object.keys(errors).forEach(field => {
      const tab = fieldToTab[field];
      if (tab) {
        tabsWithErrors.add(tab);
      }
    });
    
    return Array.from(tabsWithErrors);
  }, []);

  // Reset form to default state
  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setActiveTab('overview');
    clearErrors();
  }, [clearErrors]);

  // Load article data into form when editing
  useEffect(() => {
    if (editingArticle && debugAndFixContent) {
      const fixedContent = debugAndFixContent(editingArticle.content, editingArticle.title);
      
      setFormData({
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
      });
    } else if (!editingArticle) {
      resetForm();
    }
  }, [editingArticle, resetForm, debugAndFixContent]);

  // Handle form field updates
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Content change handler
  const handleContentChange = useCallback((content) => {
    setFormData(prev => ({ ...prev, content }));
  }, []);

  // Array manipulation helpers
  const addArrayItem = useCallback((field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  }, []);

  const updateArrayItem = useCallback((field, index, value) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  }, []);

  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => {
      const newArray = (prev[field] || []).filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  }, []);

  // Save article
  const handleSave = useCallback(async (refetchArticles) => {
    try {
      setSaving(true);
      clearErrors();

      const sanitizedData = sanitizeData(formData);

      // Generate slug if not provided
      if (!sanitizedData.slug && sanitizedData.title) {
        sanitizedData.slug = generateSlug(sanitizedData.title);
      }

      // Auto-generate canonical URL if not provided
      if (!sanitizedData.canonical_url && sanitizedData.slug) {
        sanitizedData.canonical_url = `https://rule27design.com/articles/${sanitizedData.slug}`;
      }

      // Validate data
      if (!validate(sanitizedData)) {
        toast.error('Validation failed', 'Please fix the errors and try again');
        return;
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

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast.success('Article updated', 'Your changes have been saved successfully');
      } else {
        articleData.created_by = userProfile.id;
        const { error } = await supabase
          .from('articles')
          .insert(articleData);

        if (error) throw error;
        toast.success('Article created', 'Your article has been created successfully');
      }

      await refetchArticles();
      onClose();
    } catch (error) {
      console.error('Error saving article:', error);
      if (error.name === 'ValidationError') {
        toast.error('Validation failed', Object.values(error.errors).join(', '));
      } else {
        toast.error('Failed to save article', error.message);
      }
    } finally {
      setSaving(false);
    }
  }, [formData, editingArticle, userProfile, validate, clearErrors, toast, onClose]);

  // Handle save with status change
  const handleSaveWithStatus = useCallback(async (status, refetchArticles) => {
    updateFormData({ status });
    setTimeout(() => handleSave(refetchArticles), 100);
  }, [updateFormData, handleSave]);

  return {
    // Form state
    formData,
    activeTab,
    saving,
    errors,
    hasErrors,
    
    // Actions
    setActiveTab,
    updateFormData,
    handleContentChange,
    addArrayItem,
    updateArrayItem,
    removeArrayItem,
    handleSave,
    handleSaveWithStatus,
    resetForm,
    
    // Utilities
    getTabsWithErrors
  };
};