// src/pages/admin/articles/hooks/useFormValidation.js
import { useState, useCallback } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value) => {
    let error = null;

    switch (field) {
      case 'title':
        if (!value || value.trim().length === 0) {
          error = 'Title is required';
        } else if (value.length > 200) {
          error = 'Title must be less than 200 characters';
        }
        break;

      case 'slug':
        if (!value || value.trim().length === 0) {
          error = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(value)) {
          error = 'Slug can only contain lowercase letters, numbers, and hyphens';
        } else if (value.length > 100) {
          error = 'Slug must be less than 100 characters';
        }
        break;

      case 'content':
        if (!value || (typeof value === 'object' && !value.html?.trim())) {
          error = 'Content is required';
        }
        break;

      case 'excerpt':
        if (value && value.length > 300) {
          error = 'Excerpt must be less than 300 characters';
        }
        break;

      case 'category_id':
        if (!value) {
          error = 'Category is required';
        }
        break;

      case 'meta_title':
        if (value && value.length > 60) {
          error = 'Meta title should be less than 60 characters for SEO';
        }
        break;

      case 'meta_description':
        if (value && value.length > 160) {
          error = 'Meta description should be less than 160 characters for SEO';
        }
        break;

      case 'canonical_url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          error = 'Please enter a valid URL';
        }
        break;

      case 'scheduled_at':
        if (value) {
          const scheduledDate = new Date(value);
          if (scheduledDate <= new Date()) {
            error = 'Scheduled date must be in the future';
          }
        }
        break;

      default:
        break;
    }

    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
    });

    return !error;
  }, []);

  const validateForm = useCallback((formData) => {
    const newErrors = {};

    // Required fields
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.content || (typeof formData.content === 'object' && !formData.content.html?.trim())) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    // Optional field validations
    if (formData.excerpt?.length > 300) {
      newErrors.excerpt = 'Excerpt must be less than 300 characters';
    }

    if (formData.meta_title?.length > 60) {
      newErrors.meta_title = 'Meta title should be less than 60 characters';
    }

    if (formData.meta_description?.length > 160) {
      newErrors.meta_description = 'Meta description should be less than 160 characters';
    }

    if (formData.canonical_url && !/^https?:\/\/.+/.test(formData.canonical_url)) {
      newErrors.canonical_url = 'Please enter a valid URL';
    }

    if (formData.scheduled_at) {
      const scheduledDate = new Date(formData.scheduled_at);
      if (scheduledDate <= new Date()) {
        newErrors.scheduled_at = 'Scheduled date must be in the future';
      }
    }

    setErrors(newErrors);
    return newErrors;
  }, []);

  const clearError = useCallback((field) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getTabErrors = useCallback((tab, errors) => {
    const tabFieldMap = {
      content: ['title', 'slug', 'excerpt', 'content', 'category_id', 'tags'],
      media: ['featured_image', 'featured_video', 'featured_image_alt'],
      seo: ['meta_title', 'meta_description', 'meta_keywords', 'canonical_url', 'og_title', 'og_description', 'og_image'],
      settings: ['status', 'scheduled_at', 'is_featured', 'enable_comments', 'enable_reactions']
    };

    const tabFields = tabFieldMap[tab] || [];
    return Object.keys(errors).filter(field => tabFields.includes(field));
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    getTabErrors
  };
};