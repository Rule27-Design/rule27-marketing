// src/pages/admin/services/hooks/useFormValidation.js
import { useState, useCallback } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateForm = useCallback((formData) => {
    const newErrors = {};

    // Required fields
    if (!formData.name?.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.short_description?.trim()) {
      newErrors.short_description = 'Short description is required';
    } else if (formData.short_description.length > 200) {
      newErrors.short_description = 'Short description must be less than 200 characters';
    }

    // Pricing validation
    if (formData.pricing_model !== 'custom' && (!formData.pricing_tiers || formData.pricing_tiers.length === 0)) {
      newErrors.pricing_tiers = 'At least one pricing tier is required';
    }

    // Process validation
    if (formData.process_steps?.length > 0) {
      const invalidSteps = formData.process_steps.some(step => !step.title?.trim());
      if (invalidSteps) {
        newErrors.process_steps = 'All process steps must have a title';
      }
    }

    // FAQ validation
    if (formData.faqs?.length > 0) {
      const invalidFAQs = formData.faqs.some(faq => !faq.question?.trim() || !faq.answer?.trim());
      if (invalidFAQs) {
        newErrors.faqs = 'All FAQs must have both question and answer';
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
      basic: ['name', 'slug', 'category', 'short_description', 'long_description'],
      features: ['features', 'benefits', 'key_features'],
      pricing: ['pricing_model', 'pricing_tiers'],
      process: ['process_steps', 'timeline'],
      media: ['hero_image', 'gallery'],
      faq: ['faqs'],
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