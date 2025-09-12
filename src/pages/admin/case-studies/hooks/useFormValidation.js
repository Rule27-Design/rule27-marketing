// src/pages/admin/case-studies/hooks/useFormValidation.js
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

      case 'client_name':
        if (!value || value.trim().length === 0) {
          error = 'Client name is required';
        }
        break;

      case 'client_industry':
        if (!value || value.trim().length === 0) {
          error = 'Client industry is required';
        }
        break;

      case 'service_type':
        if (!value || value.trim().length === 0) {
          error = 'Service type is required';
        }
        break;

      case 'challenge':
        if (!value || value.trim().length === 0) {
          error = 'Challenge description is required';
        }
        break;

      case 'solution':
        if (!value || value.trim().length === 0) {
          error = 'Solution description is required';
        }
        break;

      case 'key_metrics':
        if (!value || value.length === 0) {
          error = 'At least one key metric is required';
        }
        break;

      case 'hero_image':
        if (!value || value.trim().length === 0) {
          error = 'Hero image is required';
        }
        break;

      case 'project_start_date':
        if (!value) {
          error = 'Project start date is required';
        }
        break;

      case 'canonical_url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          error = 'Please enter a valid URL';
        }
        break;

      case 'client_website':
        if (value && !/^https?:\/\/.+/.test(value)) {
          error = 'Please enter a valid URL';
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
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.client_name?.trim()) {
      newErrors.client_name = 'Client name is required';
    }

    if (!formData.client_industry?.trim()) {
      newErrors.client_industry = 'Client industry is required';
    }

    if (!formData.service_type?.trim()) {
      newErrors.service_type = 'Service type is required';
    }

    if (!formData.challenge?.trim()) {
      newErrors.challenge = 'Challenge description is required';
    }

    if (!formData.solution?.trim()) {
      newErrors.solution = 'Solution description is required';
    }

    if (!formData.key_metrics || formData.key_metrics.length === 0) {
      newErrors.key_metrics = 'At least one key metric is required';
    }

    if (!formData.hero_image?.trim()) {
      newErrors.hero_image = 'Hero image is required';
    }

    if (!formData.project_start_date) {
      newErrors.project_start_date = 'Project start date is required';
    }

    // Optional field validations
    if (formData.meta_title?.length > 60) {
      newErrors.meta_title = 'Meta title should be less than 60 characters';
    }

    if (formData.meta_description?.length > 160) {
      newErrors.meta_description = 'Meta description should be less than 160 characters';
    }

    if (formData.canonical_url && !/^https?:\/\/.+/.test(formData.canonical_url)) {
      newErrors.canonical_url = 'Please enter a valid URL';
    }

    if (formData.client_website && !/^https?:\/\/.+/.test(formData.client_website)) {
      newErrors.client_website = 'Please enter a valid URL';
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
      overview: ['title', 'slug', 'client_name', 'client_industry', 'service_type', 'project_start_date', 'project_end_date'],
      results: ['challenge', 'solution', 'implementation_process', 'key_metrics', 'results_narrative'],
      media: ['hero_image', 'hero_video', 'client_logo', 'gallery_images'],
      details: ['status', 'meta_title', 'meta_description', 'canonical_url']
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