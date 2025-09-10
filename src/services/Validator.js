// src/services/Validator.js
import * as validators from '../utils/validators';

/**
 * Validation service with schema validation and custom rules
 */
export class Validator {
  constructor(options = {}) {
    this.options = {
      stopOnFirstError: false,
      customMessages: {},
      transforms: {},
      debug: false,
      ...options
    };
    
    // Custom validators registry
    this.customValidators = new Map();
    
    // Validation schemas registry
    this.schemas = new Map();
    
    // Error messages
    this.messages = {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      url: 'Please enter a valid URL',
      min: 'Value must be at least {min}',
      max: 'Value must be at most {max}',
      minLength: 'Must be at least {minLength} characters',
      maxLength: 'Must be no more than {maxLength} characters',
      pattern: 'Invalid format',
      oneOf: 'Must be one of: {values}',
      ...this.options.customMessages
    };
  }

  /**
   * Validate data against a schema
   */
  validate(data, schema, options = {}) {
    const opts = {
      ...this.options,
      ...options
    };
    
    const errors = {};
    const validated = {};
    
    // Validate each field in schema
    for (const [field, rules] of Object.entries(schema)) {
      const value = this.getNestedValue(data, field);
      const fieldErrors = this.validateField(value, rules, data, field);
      
      if (fieldErrors.length > 0) {
        errors[field] = opts.stopOnFirstError ? fieldErrors[0] : fieldErrors;
        
        if (opts.stopOnFirstError && Object.keys(errors).length > 0) {
          break;
        }
      } else {
        // Apply transforms if validation passed
        validated[field] = this.applyTransforms(value, rules.transform || []);
      }
    }
    
    const isValid = Object.keys(errors).length === 0;
    
    return {
      isValid,
      errors,
      validated: isValid ? validated : null
    };
  }

  /**
   * Validate a single field
   */
  validateField(value, rules, allData = {}, fieldName = '') {
    const errors = [];
    
    // Handle required rule first
    if (rules.required) {
      const isEmpty = this.isEmpty(value);
      
      if (isEmpty) {
        const message = typeof rules.required === 'string' 
          ? rules.required 
          : this.getMessage('required', { field: fieldName });
        errors.push(message);
        
        // Skip other validations if required fails and not present
        if (!rules.validateEmpty) {
          return errors;
        }
      }
    }
    
    // Skip validation if empty and not required
    if (!rules.required && this.isEmpty(value)) {
      return errors;
    }
    
    // Type validation
    if (rules.type) {
      const typeError = this.validateType(value, rules.type);
      if (typeError) {
        errors.push(typeError);
      }
    }
    
    // String validations
    if (typeof value === 'string' || rules.type === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(this.getMessage('minLength', { minLength: rules.minLength }));
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(this.getMessage('maxLength', { maxLength: rules.maxLength }));
      }
      
      if (rules.pattern) {
        const regex = rules.pattern instanceof RegExp 
          ? rules.pattern 
          : new RegExp(rules.pattern);
        
        if (!regex.test(value)) {
          errors.push(rules.patternMessage || this.getMessage('pattern'));
        }
      }
      
      if (rules.email) {
        const emailResult = validators.validateEmail(value);
        if (emailResult !== true) {
          errors.push(emailResult);
        }
      }
      
      if (rules.url) {
        const urlResult = validators.validateURL(value);
        if (urlResult !== true) {
          errors.push(urlResult);
        }
      }
    }
    
    // Number validations
    if (typeof value === 'number' || rules.type === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(this.getMessage('min', { min: rules.min }));
      }
      
      if (rules.max !== undefined && value > rules.max) {
        errors.push(this.getMessage('max', { max: rules.max }));
      }
      
      if (rules.integer && !Number.isInteger(value)) {
        errors.push('Must be an integer');
      }
      
      if (rules.positive && value <= 0) {
        errors.push('Must be a positive number');
      }
      
      if (rules.negative && value >= 0) {
        errors.push('Must be a negative number');
      }
    }
    
    // Array validations
    if (Array.isArray(value) || rules.type === 'array') {
      const arrayResult = validators.validateArray(value, {
        minLength: rules.minItems,
        maxLength: rules.maxItems,
        uniqueItems: rules.uniqueItems
      });
      
      if (arrayResult !== true) {
        errors.push(arrayResult);
      }
      
      // Validate each item if schema provided
      if (rules.items && Array.isArray(value)) {
        value.forEach((item, index) => {
          const itemErrors = this.validateField(item, rules.items, allData, `${fieldName}[${index}]`);
          if (itemErrors.length > 0) {
            errors.push(`Item ${index + 1}: ${itemErrors.join(', ')}`);
          }
        });
      }
    }
    
    // Date validations
    if (rules.date || rules.type === 'date') {
      const dateResult = validators.validateDate(value, {
        minDate: rules.minDate,
        maxDate: rules.maxDate,
        allowFuture: rules.allowFuture,
        allowPast: rules.allowPast
      });
      
      if (dateResult !== true) {
        errors.push(dateResult);
      }
    }
    
    // OneOf validation
    if (rules.oneOf) {
      const values = typeof rules.oneOf === 'function' 
        ? rules.oneOf(allData) 
        : rules.oneOf;
      
      if (!values.includes(value)) {
        errors.push(this.getMessage('oneOf', { values: values.join(', ') }));
      }
    }
    
    // Custom validation function
    if (rules.validate) {
      const customResult = rules.validate(value, allData);
      if (customResult !== true) {
        errors.push(customResult);
      }
    }
    
    // Async validation
    if (rules.validateAsync) {
      // Note: Async validation should be handled separately
      console.warn('Async validation detected. Use validateAsync method instead.');
    }
    
    // Custom validator by name
    if (rules.custom) {
      const customValidators = Array.isArray(rules.custom) ? rules.custom : [rules.custom];
      
      for (const validatorName of customValidators) {
        if (this.customValidators.has(validatorName)) {
          const validator = this.customValidators.get(validatorName);
          const result = validator(value, rules, allData);
          
          if (result !== true) {
            errors.push(result);
          }
        }
      }
    }
    
    return errors;
  }

  /**
   * Async validation
   */
  async validateAsync(data, schema, options = {}) {
    const opts = {
      ...this.options,
      ...options
    };
    
    const errors = {};
    const validated = {};
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = this.getNestedValue(data, field);
      
      // Run sync validations first
      const syncErrors = this.validateField(value, rules, data, field);
      
      if (syncErrors.length > 0) {
        errors[field] = opts.stopOnFirstError ? syncErrors[0] : syncErrors;
        
        if (opts.stopOnFirstError) {
          break;
        }
      } else if (rules.validateAsync) {
        // Run async validation
        try {
          const asyncResult = await rules.validateAsync(value, data);
          if (asyncResult !== true) {
            errors[field] = asyncResult;
          } else {
            validated[field] = this.applyTransforms(value, rules.transform || []);
          }
        } catch (error) {
          errors[field] = error.message || 'Validation failed';
        }
      } else {
        validated[field] = this.applyTransforms(value, rules.transform || []);
      }
    }
    
    const isValid = Object.keys(errors).length === 0;
    
    return {
      isValid,
      errors,
      validated: isValid ? validated : null
    };
  }

  /**
   * Validate type
   */
  validateType(value, expectedType) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (expectedType === 'array' && !Array.isArray(value)) {
      return 'Must be an array';
    }
    
    if (expectedType === 'object' && (typeof value !== 'object' || value === null || Array.isArray(value))) {
      return 'Must be an object';
    }
    
    if (expectedType === 'number' && typeof value !== 'number') {
      return 'Must be a number';
    }
    
    if (expectedType === 'string' && typeof value !== 'string') {
      return 'Must be a string';
    }
    
    if (expectedType === 'boolean' && typeof value !== 'boolean') {
      return 'Must be a boolean';
    }
    
    if (expectedType === 'date' && !(value instanceof Date)) {
      return 'Must be a date';
    }
    
    return null;
  }

  /**
   * Check if value is empty
   */
  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Apply transforms to value
   */
  applyTransforms(value, transforms) {
    if (!transforms || transforms.length === 0) return value;
    
    let transformed = value;
    
    for (const transform of transforms) {
      if (typeof transform === 'function') {
        transformed = transform(transformed);
      } else if (typeof transform === 'string' && this.options.transforms[transform]) {
        transformed = this.options.transforms[transform](transformed);
      }
    }
    
    return transformed;
  }

  /**
   * Get nested value from object
   */
  getNestedValue(obj, path) {
    if (!path.includes('.')) {
      return obj[path];
    }
    
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj);
  }

  /**
   * Get validation message
   */
  getMessage(rule, params = {}) {
    let message = this.messages[rule] || `Validation failed: ${rule}`;
    
    // Replace placeholders
    Object.entries(params).forEach(([key, value]) => {
      message = message.replace(`{${key}}`, value);
    });
    
    return message;
  }

  /**
   * Register custom validator
   */
  registerValidator(name, validator) {
    if (typeof validator !== 'function') {
      throw new TypeError('Validator must be a function');
    }
    
    this.customValidators.set(name, validator);
  }

  /**
   * Register validation schema
   */
  registerSchema(name, schema) {
    this.schemas.set(name, schema);
  }

  /**
   * Validate using registered schema
   */
  validateWithSchema(data, schemaName, options = {}) {
    const schema = this.schemas.get(schemaName);
    
    if (!schema) {
      throw new Error(`Schema "${schemaName}" not found`);
    }
    
    return this.validate(data, schema, options);
  }

  /**
   * Create validator for specific schema
   */
  createSchemaValidator(schema) {
    return (data, options) => this.validate(data, schema, options);
  }

  /**
   * Combine multiple schemas
   */
  combineSchemas(...schemas) {
    return schemas.reduce((combined, schema) => {
      return { ...combined, ...schema };
    }, {});
  }

  /**
   * Create conditional schema
   */
  conditionalSchema(condition, trueSchema, falseSchema = {}) {
    return (data) => {
      const useSchema = condition(data) ? trueSchema : falseSchema;
      return this.validate(data, useSchema);
    };
  }
}

// Pre-defined validation schemas
export const commonSchemas = {
  email: {
    email: { required: true, email: true }
  },
  
  password: {
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      patternMessage: 'Password must contain uppercase, lowercase, number and special character'
    }
  },
  
  username: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      patternMessage: 'Username can only contain letters, numbers and underscores'
    }
  },
  
  phone: {
    phone: {
      required: true,
      pattern: /^\+?[\d\s\-\(\)]+$/,
      minLength: 10,
      maxLength: 15
    }
  },
  
  url: {
    url: {
      required: true,
      url: true
    }
  },
  
  address: {
    street: { required: true, minLength: 5 },
    city: { required: true, minLength: 2 },
    state: { required: true, minLength: 2 },
    zipCode: { 
      required: true, 
      pattern: /^\d{5}(-\d{4})?$/,
      patternMessage: 'Invalid ZIP code format'
    },
    country: { required: true }
  }
};

// Create singleton instance
export const validator = new Validator();

export default Validator;