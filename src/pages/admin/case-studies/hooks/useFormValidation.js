// src/pages/admin/case-studies/hooks/useFormValidation.js
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

      // Rich text validations - check for actual content
      case 'challenge':
        if (!value) {
          error = 'Challenge description is required';
        } else if (typeof value === 'object') {
          // Check if it's a TipTap document with content
          const hasContent = value.content && value.content.length > 0 && 
            value.content.some(node => 
              node.content && node.content.some(item => item.text && item.text.trim())
            );
          if (!hasContent) {
            error = 'Challenge description is required';
          }
        } else if (typeof value === 'string' && !value.trim()) {
          error = 'Challenge description is required';
        }
        break;

      case 'solution':
        if (!value) {
          error = 'Solution description is required';
        } else if (typeof value === 'object') {
          const hasContent = value.content && value.content.length > 0 && 
            value.content.some(node => 
              node.content && node.content.some(item => item.text && item.text.trim())
            );
          if (!hasContent) {
            error = 'Solution description is required';
          }
        } else if (typeof value === 'string' && !value.trim()) {
          error = 'Solution description is required';
        }
        break;

      case 'implementation_process':
        // Optional field, but validate if provided
        if (value && typeof value === 'object' && value.html && value.html.length > 10000) {
          error = 'Implementation process is too long';
        }
        break;

      case 'results_narrative':
        // Optional field, but validate if provided
        if (value && typeof value === 'object' && value.html && value.html.length > 10000) {
          error = 'Results narrative is too long';
        }
        break;

      case 'results_summary':
        if (value && value.length > 300) {
          error = 'Results summary must be less than 300 characters';
        }
        break;

      case 'key_metrics':
        if (!value || value.length === 0) {
          error = 'At least one key metric is required';
        } else if (value.some(metric => !metric.label || !metric.value)) {
          error = 'All metrics must have a label and value';
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

      case 'project_end_date':
        if (!value) {
          error = 'Project end date is required';
        } else if (formData.project_start_date) {
          const start = new Date(formData.project_start_date);
          const end = new Date(value);
          if (end < start) {
            error = 'End date must be after start date';
          }
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

      case 'og_title':
        if (value && value.length > 70) {
          error = 'Open Graph title should be less than 70 characters';
        }
        break;

      case 'og_description':
        if (value && value.length > 200) {
          error = 'Open Graph description should be less than 200 characters';
        }
        break;

      case 'team_size':
        if (value && (isNaN(value) || value < 0)) {
          error = 'Team size must be a positive number';
        }
        break;

      case 'sort_order':
        if (value && (isNaN(value) || value < 0)) {
          error = 'Sort order must be a positive number';
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

    // Rich text content validation - improved to check for actual content
    const hasChallenge = formData.challenge && (
      typeof formData.challenge === 'string' ? 
        formData.challenge.trim() : 
        formData.challenge.content?.some(node => 
          node.content?.some(item => item.text?.trim())
        )
    );

    const hasSolution = formData.solution && (
      typeof formData.solution === 'string' ? 
        formData.solution.trim() : 
        formData.solution.content?.some(node => 
          node.content?.some(item => item.text?.trim())
        )
    );

    if (!hasChallenge) {
      newErrors.challenge = 'Challenge description is required';
    }

    if (!hasSolution) {
      newErrors.solution = 'Solution description is required';
    }

    if (!formData.key_metrics || formData.key_metrics.length === 0) {
      newErrors.key_metrics = 'At least one key metric is required';
    } else if (formData.key_metrics.some(metric => !metric.label || !metric.value)) {
      newErrors.key_metrics = 'All metrics must have a label and value';
    }

    if (!formData.hero_image?.trim()) {
      newErrors.hero_image = 'Hero image is required';
    }

    if (!formData.project_start_date) {
      newErrors.project_start_date = 'Project start date is required';
    }

    if (!formData.project_end_date) {
      newErrors.project_end_date = 'Project end date is required';
    }

    // Date validation
    if (formData.project_end_date && formData.project_start_date) {
      const start = new Date(formData.project_start_date);
      const end = new Date(formData.project_end_date);
      if (end < start) {
        newErrors.project_end_date = 'End date must be after start date';
      }
    }

    // Optional field validations
    if (formData.results_summary?.length > 300) {
      newErrors.results_summary = 'Results summary must be less than 300 characters';
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

    if (formData.client_website && !/^https?:\/\/.+/.test(formData.client_website)) {
      newErrors.client_website = 'Please enter a valid URL';
    }

    if (formData.scheduled_at) {
      const scheduledDate = new Date(formData.scheduled_at);
      if (scheduledDate <= new Date()) {
        newErrors.scheduled_at = 'Scheduled date must be in the future';
      }
    }

    // Gallery image validation
    if (formData.gallery_images && formData.gallery_images.length > 20) {
      newErrors.gallery_images = 'Maximum 20 gallery images allowed';
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
      overview: ['title', 'slug', 'client_name', 'client_industry', 'client_company_size',
                 'service_type', 'service_category', 'project_start_date', 'project_end_date', 
                 'client_website', 'team_size', 'deliverables', 'project_duration', 
                 'project_investment', 'technologies_used'],
      results: ['challenge', 'solution', 'implementation_process', 'key_metrics', 
                'results_summary', 'results_narrative', 'testimonial_id', 'process_steps'],
      media: ['hero_image', 'hero_image_alt', 'hero_video', 'client_logo', 'gallery_images'],
      details: ['status', 'scheduled_at', 'meta_title', 'meta_description', 
                'canonical_url', 'og_title', 'og_description', 'og_image', 
                'internal_notes', 'is_featured', 'is_confidential', 'sort_order']
    };

    const tabErrors = {
      overview: [],
      results: [],
      media: [],
      details: []
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