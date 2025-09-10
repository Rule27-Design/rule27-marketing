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
        }
        break;

      case 'content':
        if (!value || value.trim().length === 0) {
          error = 'Content is required';
        }
        break;

      case 'excerpt':
        if (value && value.length > 300) {
          error = 'Excerpt must be less than 300 characters';
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
    }
    if (!formData.slug?.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
    }

    // Length validations
    if (formData.title?.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    if (formData.excerpt?.length > 300) {
      newErrors.excerpt = 'Excerpt must be less than 300 characters';
    }
    if (formData.meta_title?.length > 60) {
      newErrors.meta_title = 'Meta title should be less than 60 characters';
    }
    if (formData.meta_description?.length > 160) {
      newErrors.meta_description = 'Meta description should be less than 160 characters';
    }

    // Format validations
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors
  };
};