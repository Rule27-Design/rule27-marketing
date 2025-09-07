// src/utils/validation.js
import React from 'react';

export class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Basic validation functions
export const validators = {
  required: (value, fieldName = 'Field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      throw new ValidationError(fieldName.toLowerCase(), `${fieldName} is required`);
    }
    return true;
  },

  email: (value, fieldName = 'Email') => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new ValidationError(fieldName.toLowerCase(), `${fieldName} must be a valid email address`);
    }
    return true;
  },

  minLength: (min) => (value, fieldName = 'Field') => {
    if (value && value.length < min) {
      throw new ValidationError(fieldName.toLowerCase(), `${fieldName} must be at least ${min} characters long`);
    }
    return true;
  },

  maxLength: (max) => (value, fieldName = 'Field') => {
    if (value && value.length > max) {
      throw new ValidationError(fieldName.toLowerCase(), `${fieldName} must be no more than ${max} characters long`);
    }
    return true;
  },

  url: (value, fieldName = 'URL') => {
    if (value) {
      try {
        new URL(value);
      } catch {
        throw new ValidationError(fieldName.toLowerCase(), `${fieldName} must be a valid URL`);
      }
    }
    return true;
  },

  slug: (value, fieldName = 'Slug') => {
    if (value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      throw new ValidationError(fieldName.toLowerCase(), `${fieldName} must contain only lowercase letters, numbers, and hyphens`);
    }
    return true;
  },

  oneOf: (options) => (value, fieldName = 'Field') => {
    if (value && !options.includes(value)) {
      throw new ValidationError(fieldName.toLowerCase(), `${fieldName} must be one of: ${options.join(', ')}`);
    }
    return true;
  },

  contentSize: (value, fieldName = 'Content') => {
    if (value) {
      const wordCount = value.text ? value.text.split(/\s+/).filter(w => w.length > 0).length : 0;
      if (wordCount < 10) {
        throw new ValidationError(fieldName.toLowerCase(), `${fieldName} must contain at least 10 words`);
      }
      if (wordCount > 10000) {
        throw new ValidationError(fieldName.toLowerCase(), `${fieldName} cannot exceed 10,000 words`);
      }
    }
    return true;
  }
};

// Validation schemas for different entities
export const validationSchemas = {
  article: {
    title: [validators.required, validators.minLength(5), validators.maxLength(200)],
    slug: [validators.slug, validators.maxLength(100)],
    excerpt: [validators.maxLength(500)],
    content: [validators.required, validators.contentSize],
    meta_title: [validators.maxLength(60)],
    meta_description: [validators.maxLength(160)],
    canonical_url: [validators.url],
    og_image: [validators.url],
    category_id: [validators.required]
  },

  caseStudy: {
    title: [validators.required, validators.minLength(5), validators.maxLength(200)],
    client_name: [validators.required, validators.minLength(2), validators.maxLength(100)],
    slug: [validators.slug, validators.maxLength(100)],
    client_website: [validators.url],
    description: [validators.required, validators.minLength(20), validators.maxLength(500)],
    industry: [validators.required],
    service_type: [validators.required]
  },

  profile: {
    email: [validators.required, validators.email],
    full_name: [validators.required, validators.minLength(2), validators.maxLength(100)],
    role: [validators.required, validators.oneOf(['admin', 'contributor', 'standard'])],
    linkedin_url: [validators.url],
    twitter_url: [validators.url],
    github_url: [validators.url]
  },

  category: {
    name: [validators.required, validators.minLength(2), validators.maxLength(50)],
    slug: [validators.required, validators.slug, validators.maxLength(50)],
    type: [validators.required, validators.oneOf(['article', 'resource', 'case_study'])]
  },

  testimonial: {
    client_name: [validators.required, validators.minLength(2), validators.maxLength(100)],
    quote: [validators.required, validators.minLength(10), validators.maxLength(1000)],
    rating: [validators.required, validators.oneOf([1, 2, 3, 4, 5])]
  }
};

// Main validation function
export const validateData = (data, schema, fieldName = '') => {
  const errors = {};
  
  for (const [field, validatorList] of Object.entries(schema)) {
    const value = data[field];
    const displayName = fieldName ? `${fieldName} ${field}` : field.replace('_', ' ');
    
    for (const validator of validatorList) {
      try {
        validator(value, displayName);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors[field] = error.message;
          break; // Stop at first error for this field
        }
        throw error; // Re-throw non-validation errors
      }
    }
  }
  
  if (Object.keys(errors).length > 0) {
    const validationError = new Error('Validation failed');
    validationError.name = 'ValidationError';
    validationError.errors = errors;
    throw validationError;
  }
  
  return true;
};

// Utility function to sanitize input data
export const sanitizeData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Trim whitespace
      sanitized[key] = value.trim();
      
      // Remove null bytes and other control characters except newlines/tabs
      sanitized[key] = sanitized[key].replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      // Convert empty strings to null for database consistency
      if (sanitized[key] === '') {
        sanitized[key] = null;
      }
    } else if (Array.isArray(value)) {
      // Filter out empty strings and null values from arrays
      sanitized[key] = value.filter(item => item && item.toString().trim());
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Auto-generate slug from title
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Clean timestamp fields
export const cleanTimestampField = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  return value;
};

// Safe JSON parse with fallback
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};

// Validation hook for forms
export const useValidation = (schema) => {
  const [errors, setErrors] = React.useState({});
  
  const validate = React.useCallback((data) => {
    try {
      validateData(data, schema);
      setErrors({});
      return true;
    } catch (error) {
      if (error.name === 'ValidationError') {
        setErrors(error.errors);
        return false;
      }
      throw error;
    }
  }, [schema]);

  const clearErrors = React.useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = React.useCallback((field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    setFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
};