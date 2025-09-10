// src/hooks/useFormState.js
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for managing form state with validation, dirty checking, and error handling
 * @param {Object} initialData - Initial form data
 * @param {Object} validationRules - Validation rules for form fields
 * @param {Object} options - Additional options
 */
export const useFormState = (initialData = {}, validationRules = {}, options = {}) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    resetOnSubmit = false,
    trackFieldInteractions = true
  } = options;

  // Core state
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  // Track initial data for dirty checking
  const initialDataRef = useRef(initialData);
  const [isDirty, setIsDirty] = useState(false);
  
  // Track field interactions
  const [fieldInteractions, setFieldInteractions] = useState({});
  
  // Check if form is dirty
  useEffect(() => {
    const dirty = JSON.stringify(formData) !== JSON.stringify(initialDataRef.current);
    setIsDirty(dirty);
  }, [formData]);
  
  // Validation function for a single field
  const validateField = useCallback((field, value, allValues = formData) => {
    const rules = validationRules[field];
    if (!rules) return null;
    
    const fieldErrors = [];
    
    // Required validation
    if (rules.required) {
      const isEmpty = value === null || 
                      value === undefined || 
                      value === '' || 
                      (Array.isArray(value) && value.length === 0);
      
      if (isEmpty) {
        fieldErrors.push(rules.required === true 
          ? `${field.replace(/_/g, ' ')} is required` 
          : rules.required
        );
      }
    }
    
    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      fieldErrors.push(
        rules.minLengthMessage || 
        `Must be at least ${rules.minLength} characters`
      );
    }
    
    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      fieldErrors.push(
        rules.maxLengthMessage || 
        `Must be no more than ${rules.maxLength} characters`
      );
    }
    
    // Pattern validation
    if (rules.pattern && value) {
      const regex = rules.pattern instanceof RegExp 
        ? rules.pattern 
        : new RegExp(rules.pattern);
      
      if (!regex.test(value)) {
        fieldErrors.push(
          rules.patternMessage || 
          `${field.replace(/_/g, ' ')} format is invalid`
        );
      }
    }
    
    // Email validation
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        fieldErrors.push('Please enter a valid email address');
      }
    }
    
    // URL validation
    if (rules.url && value) {
      try {
        new URL(value);
      } catch {
        fieldErrors.push('Please enter a valid URL');
      }
    }
    
    // Custom validation function
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, allValues);
      if (customError) {
        fieldErrors.push(customError);
      }
    }
    
    // Async validation
    if (rules.validateAsync && typeof rules.validateAsync === 'function') {
      return rules.validateAsync(value, allValues);
    }
    
    return fieldErrors.length > 0 ? fieldErrors[0] : null;
  }, [validationRules, formData]);
  
  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [validationRules, formData, validateField]);
  
  // Handle field change
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Track field interaction
    if (trackFieldInteractions) {
      setFieldInteractions(prev => ({
        ...prev,
        [field]: (prev[field] || 0) + 1
      }));
    }
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Validate on change if enabled
    if (validateOnChange) {
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [field]: error
        }));
      }
    }
  }, [errors, validateOnChange, validateField, trackFieldInteractions]);
  
  // Handle field blur
  const handleBlur = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Validate on blur if enabled
    if (validateOnBlur && formData[field] !== undefined) {
      const error = validateField(field, formData[field]);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [field]: error
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  }, [formData, validateOnBlur, validateField]);
  
  // Set multiple fields at once
  const setFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields
    }));
  }, []);
  
  // Set field error
  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);
  
  // Clear field error
  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);
  
  // Reset form to initial state
  const resetForm = useCallback((newInitialData = null) => {
    const dataToReset = newInitialData || initialDataRef.current;
    initialDataRef.current = dataToReset;
    setFormData(dataToReset);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setFieldInteractions({});
    setSubmitCount(0);
  }, []);
  
  // Reset specific fields
  const resetFields = useCallback((fields) => {
    const resetData = {};
    fields.forEach(field => {
      resetData[field] = initialDataRef.current[field];
    });
    
    setFormData(prev => ({
      ...prev,
      ...resetData
    }));
    
    setErrors(prev => {
      const newErrors = { ...prev };
      fields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
    
    setTouched(prev => {
      const newTouched = { ...prev };
      fields.forEach(field => delete newTouched[field]);
      return newTouched;
    });
  }, []);
  
  // Get field props (for easy integration with inputs)
  const getFieldProps = useCallback((field, options = {}) => {
    return {
      name: field,
      value: formData[field] || '',
      onChange: options.onChange || ((e) => {
        const value = e?.target ? e.target.value : e;
        handleChange(field, value);
      }),
      onBlur: options.onBlur || (() => handleBlur(field)),
      error: errors[field],
      touched: touched[field],
      required: validationRules[field]?.required
    };
  }, [formData, errors, touched, validationRules, handleChange, handleBlur]);
  
  // Handle form submission
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      
      setSubmitCount(prev => prev + 1);
      setIsSubmitting(true);
      
      // Mark all fields as touched
      const allTouched = {};
      Object.keys(validationRules).forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      
      // Validate form
      const isValid = validateForm();
      
      if (isValid) {
        try {
          await onSubmit(formData);
          
          if (resetOnSubmit) {
            resetForm();
          }
        } catch (error) {
          console.error('Form submission error:', error);
          setErrors(prev => ({
            ...prev,
            submit: error.message || 'An error occurred during submission'
          }));
        }
      }
      
      setIsSubmitting(false);
    };
  }, [formData, validationRules, validateForm, resetOnSubmit, resetForm]);
  
  // Check if a field has error and is touched
  const hasError = useCallback((field) => {
    return !!(errors[field] && touched[field]);
  }, [errors, touched]);
  
  // Get form validation state
  const isValid = Object.keys(errors).length === 0;
  const hasBeenSubmitted = submitCount > 0;
  
  // Get dirty fields
  const dirtyFields = Object.keys(formData).filter(field => {
    return formData[field] !== initialDataRef.current[field];
  });
  
  return {
    // State
    formData,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    hasBeenSubmitted,
    submitCount,
    dirtyFields,
    fieldInteractions,
    
    // Actions
    setFormData,
    handleChange,
    handleBlur,
    setFields,
    setFieldError,
    clearFieldError,
    validateField,
    validateForm,
    resetForm,
    resetFields,
    getFieldProps,
    handleSubmit,
    hasError,
    setIsSubmitting,
    setIsDirty,
    setErrors,
    setTouched
  };
};

export default useFormState;