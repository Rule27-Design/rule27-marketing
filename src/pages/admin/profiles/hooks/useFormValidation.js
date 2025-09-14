// src/pages/admin/profiles/hooks/useFormValidation.js
import { useState, useCallback } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value, formData = {}) => {
    let error = null;

    switch (field) {
      case 'email':
        if (!value || value.trim().length === 0) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'full_name':
        if (!value || value.trim().length === 0) {
          error = 'Full name is required';
        } else if (value.length > 100) {
          error = 'Name must be less than 100 characters';
        }
        break;

      case 'job_title':
        if (value && value.length > 100) {
          error = 'Job title must be less than 100 characters';
        }
        break;

      case 'bio':
        if (value && value.length > 500) {
          error = 'Bio must be less than 500 characters';
        }
        break;

      case 'avatar_url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          error = 'Please enter a valid URL';
        }
        break;

      case 'linkedin_url':
      case 'twitter_url':
      case 'github_url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          error = 'Please enter a valid URL';
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
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    // Optional field validations
    if (formData.bio?.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.avatar_url && !/^https?:\/\/.+/.test(formData.avatar_url)) {
      newErrors.avatar_url = 'Please enter a valid URL';
    }

    ['linkedin_url', 'twitter_url', 'github_url'].forEach(field => {
      if (formData[field] && !/^https?:\/\/.+/.test(formData[field])) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

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
      basic: ['email', 'full_name', 'display_name', 'avatar_url', 'bio', 'job_title'],
      access: ['role', 'send_invite'],
      department: ['department', 'expertise'],
      social: ['linkedin_url', 'twitter_url', 'github_url', 'sort_order']
    };

    const tabErrors = {
      basic: [],
      access: [],
      department: [],
      social: []
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