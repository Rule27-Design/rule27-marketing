// src/pages/admin/case-studies/hooks/useFormValidation.js
import { useState, useCallback } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

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

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.service_type) {
      newErrors.service_type = 'Service type is required';
    }

    // URL validations
    if (formData.client_website && !/^https?:\/\/.+/.test(formData.client_website)) {
      newErrors.client_website = 'Please enter a valid URL';
    }

    // Content validations
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.challenge?.trim()) {
      newErrors.challenge = 'Challenge section is required';
    }

    if (!formData.solution?.trim()) {
      newErrors.solution = 'Solution section is required';
    }

    // Metrics validation
    if (formData.key_metrics && formData.key_metrics.length > 0) {
      const hasInvalidMetric = formData.key_metrics.some(
        metric => metric.label && (!metric.before || !metric.after)
      );
      if (hasInvalidMetric) {
        newErrors.key_metrics = 'All metrics must have before and after values';
      }
    }

    // Date validations
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (start > end) {
        newErrors.end_date = 'End date must be after start date';
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
      overview: ['title', 'slug', 'client_name', 'industry', 'service_type', 'description'],
      content: ['challenge', 'solution', 'implementation'],
      media: ['hero_image', 'hero_video', 'gallery'],
      metrics: ['key_metrics', 'start_date', 'end_date'],
      team: ['project_lead', 'team_members'],
      settings: ['status', 'meta_title', 'meta_description']
    };

    const tabFields = tabFieldMap[tab] || [];
    return Object.keys(errors).filter(field => tabFields.includes(field));
  }, []);

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors,
    getTabErrors
  };
};