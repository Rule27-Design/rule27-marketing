// src/pages/admin/services/hooks/useFormValidation.js
import { useState, useCallback } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value, formData = {}) => {
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

      case 'category':
        if (!value || value.trim().length === 0) {
          error = 'Category is required';
        }
        break;

      case 'zone_id':
        if (!value) {
          error = 'Service zone is required';
        }
        break;

      case 'description':
        if (!value || value.trim().length === 0) {
          error = 'Description is required';
        } else if (value.length > 500) {
          error = 'Description must be less than 500 characters';
        }
        break;

      case 'pricing_tiers':
        if (!value || value.length === 0) {
          error = 'At least one pricing tier is required';
        } else if (value.some(tier => !tier.name || !tier.billing)) {
          error = 'All pricing tiers must have a name and billing period';
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

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.zone_id) {
      newErrors.zone_id = 'Service zone is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    // Pricing validation
    if (!formData.pricing_tiers || formData.pricing_tiers.length === 0) {
      newErrors.pricing_tiers = 'At least one pricing tier is required';
    } else if (formData.pricing_tiers.some(tier => !tier.name || !tier.billing)) {
      newErrors.pricing_tiers = 'All pricing tiers must have a name and billing period';
    }

    // SEO validation
    if (formData.meta_title?.length > 60) {
      newErrors.meta_title = 'Meta title should be less than 60 characters';
    }

    if (formData.meta_description?.length > 160) {
      newErrors.meta_description = 'Meta description should be less than 160 characters';
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

  const getTabErrors = useCallback(() => {
    const tabFieldMap = {
      basic: ['title', 'slug', 'category', 'zone_id', 'description', 'full_description', 'icon'],
      features: ['features', 'technologies', 'process_steps', 'expected_results'],
      pricing: ['pricing_tiers'],
      seo: ['meta_title', 'meta_description']
    };

    const tabErrors = {
      basic: [],
      features: [],
      pricing: [],
      seo: []
    };

    Object.entries(errors).forEach(([field, error]) => {
      Object.entries(tabFieldMap).forEach(([tab, fields]) => {
        if (fields.includes(field)) {
          tabErrors[tab].push({ field, error });
        }
      });
    });

    return tabErrors;
  }, [errors]);

  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    getTabErrors,
    hasErrors
  };
};