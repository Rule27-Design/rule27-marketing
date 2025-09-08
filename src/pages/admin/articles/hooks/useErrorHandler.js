// src/pages/admin/articles/hooks/useErrorHandler.js - Structured error handling
import { useState, useCallback, useRef } from 'react';
import { useToast } from '../../../../components/ui/Toast';

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories for better organization
 */
export const ERROR_CATEGORIES = {
  NETWORK: 'network',
  VALIDATION: 'validation', 
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  CLIENT: 'client',
  TIMEOUT: 'timeout'
};

/**
 * Centralized error handling for articles
 * @returns {Object} Error handler with methods and current error states
 */
export const useErrorHandler = () => {
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const toast = useToast();
  const errorHistory = useRef([]);

  /**
   * Categorize error based on error object or status code
   * @param {Error|Object} error - The error to categorize
   * @returns {string} Error category
   */
  const categorizeError = useCallback((error) => {
    if (!error) return ERROR_CATEGORIES.CLIENT;
    
    // Check for network errors
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      return ERROR_CATEGORIES.NETWORK;
    }
    
    // Check for validation errors
    if (error.name === 'ValidationError' || error.message?.includes('validation')) {
      return ERROR_CATEGORIES.VALIDATION;
    }
    
    // Check for permission errors
    if (error.status === 403 || error.message?.includes('permission')) {
      return ERROR_CATEGORIES.PERMISSION;
    }
    
    // Check for not found errors
    if (error.status === 404 || error.message?.includes('not found')) {
      return ERROR_CATEGORIES.NOT_FOUND;
    }
    
    // Check for server errors
    if (error.status >= 500) {
      return ERROR_CATEGORIES.SERVER;
    }
    
    // Check for timeout errors
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return ERROR_CATEGORIES.TIMEOUT;
    }
    
    return ERROR_CATEGORIES.CLIENT;
  }, []);

  /**
   * Determine error severity based on category and context
   * @param {string} category - Error category
   * @param {string} operation - Operation that failed
   * @returns {string} Error severity level
   */
  const determineSeverity = useCallback((category, operation) => {
    // Critical operations
    if (['deleting', 'publishing'].includes(operation)) {
      return ERROR_SEVERITY.HIGH;
    }
    
    // Server errors are always high severity
    if (category === ERROR_CATEGORIES.SERVER) {
      return ERROR_SEVERITY.HIGH;
    }
    
    // Permission errors are medium to high
    if (category === ERROR_CATEGORIES.PERMISSION) {
      return ERROR_SEVERITY.MEDIUM;
    }
    
    // Validation errors are usually low to medium
    if (category === ERROR_CATEGORIES.VALIDATION) {
      return ERROR_SEVERITY.LOW;
    }
    
    return ERROR_SEVERITY.MEDIUM;
  }, []);

  /**
   * Generate user-friendly error message
   * @param {Error|Object} error - The error object
   * @param {string} operation - The operation that failed
   * @param {string} category - Error category
   * @returns {Object} User-friendly title and message
   */
  const generateUserMessage = useCallback((error, operation, category) => {
    const operationLabels = {
      fetching: 'loading articles',
      saving: 'saving article',
      deleting: 'deleting article',
      publishing: 'publishing article',
      duplicating: 'duplicating article',
      uploading: 'uploading image',
      validating: 'validating content'
    };
    
    const operationLabel = operationLabels[operation] || operation;
    
    switch (category) {
      case ERROR_CATEGORIES.NETWORK:
        return {
          title: 'Connection Problem',
          message: `Unable to connect while ${operationLabel}. Please check your internet connection and try again.`
        };
      
      case ERROR_CATEGORIES.VALIDATION:
        return {
          title: 'Validation Error',
          message: error.message || `There was a problem with the information while ${operationLabel}.`
        };
      
      case ERROR_CATEGORIES.PERMISSION:
        return {
          title: 'Permission Denied',
          message: `You don't have permission to perform this action. Please contact an administrator.`
        };
      
      case ERROR_CATEGORIES.NOT_FOUND:
        return {
          title: 'Article Not Found',
          message: 'The article you\'re looking for may have been deleted or moved.'
        };
      
      case ERROR_CATEGORIES.SERVER:
        return {
          title: 'Server Error',
          message: `An error occurred on our servers while ${operationLabel}. Please try again in a few moments.`
        };
      
      case ERROR_CATEGORIES.TIMEOUT:
        return {
          title: 'Request Timeout',
          message: `The request took too long while ${operationLabel}. Please try again.`
        };
      
      default:
        return {
          title: 'Something Went Wrong',
          message: error.message || `An unexpected error occurred while ${operationLabel}.`
        };
    }
  }, []);

  /**
   * Handle an error with full context and logging
   * @param {string} operation - The operation that failed
   * @param {Error|Object} error - The error object
   * @param {Object} context - Additional context for debugging
   * @param {boolean} showToast - Whether to show a toast notification
   */
  const handleError = useCallback((operation, error, context = {}, showToast = true) => {
    const category = categorizeError(error);
    const severity = determineSeverity(category, operation);
    const userMessage = generateUserMessage(error, operation, category);
    
    const errorRecord = {
      id: `${operation}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operation,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      category,
      severity,
      userMessage,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    // Store error in state
    setErrors(prev => ({ 
      ...prev, 
      [operation]: errorRecord 
    }));
    
    // Add to error history
    errorHistory.current.unshift(errorRecord);
    // Keep only last 50 errors
    if (errorHistory.current.length > 50) {
      errorHistory.current = errorHistory.current.slice(0, 50);
    }
    
    // Set global error for critical issues
    if (severity === ERROR_SEVERITY.CRITICAL) {
      setGlobalError(errorRecord);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error in ${operation}`);
      console.error('Original Error:', error);
      console.log('Error Category:', category);
      console.log('Severity:', severity);
      console.log('Context:', context);
      console.groupEnd();
    }
    
    // Log to external monitoring service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          operation,
          category,
          severity,
          component: 'articles'
        },
        extra: {
          context,
          userMessage,
          errorId: errorRecord.id
        }
      });
    }
    
    // Show user notification
    if (showToast) {
      const toastMethod = severity === ERROR_SEVERITY.HIGH || severity === ERROR_SEVERITY.CRITICAL
        ? toast.error
        : severity === ERROR_SEVERITY.MEDIUM
        ? toast.warning
        : toast.error;
      
      toastMethod(userMessage.title, userMessage.message);
    }
    
    return errorRecord;
  }, [categorizeError, determineSeverity, generateUserMessage, toast]);

  /**
   * Clear error for a specific operation
   * @param {string} operation - The operation to clear error for
   */
  const clearError = useCallback((operation) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[operation];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setGlobalError(null);
  }, []);

  /**
   * Get error for a specific operation
   * @param {string} operation - The operation to get error for
   * @returns {Object|null} Error record or null
   */
  const getError = useCallback((operation) => {
    return errors[operation] || null;
  }, [errors]);

  /**
   * Check if there's an error for a specific operation
   * @param {string} operation - The operation to check
   * @returns {boolean} True if there's an error
   */
  const hasError = useCallback((operation) => {
    return Boolean(errors[operation]);
  }, [errors]);

  /**
   * Check if there are any errors
   * @returns {boolean} True if there are any errors
   */
  const hasAnyError = useCallback(() => {
    return Object.keys(errors).length > 0 || Boolean(globalError);
  }, [errors, globalError]);

  /**
   * Get error summary for display
   * @returns {Object} Summary of current errors
   */
  const getErrorSummary = useCallback(() => {
    const errorList = Object.values(errors);
    const highSeverityCount = errorList.filter(e => e.severity === ERROR_SEVERITY.HIGH).length;
    const totalCount = errorList.length;
    
    return {
      total: totalCount,
      highSeverity: highSeverityCount,
      hasGlobal: Boolean(globalError),
      operations: Object.keys(errors)
    };
  }, [errors, globalError]);

  /**
   * Retry an operation that previously failed
   * @param {string} operation - The operation to retry
   * @param {Function} retryFn - Function to execute for retry
   */
  const retryOperation = useCallback(async (operation, retryFn) => {
    clearError(operation);
    try {
      return await retryFn();
    } catch (error) {
      handleError(operation, error, { isRetry: true });
      throw error;
    }
  }, [clearError, handleError]);

  return {
    // State
    errors,
    globalError,
    
    // Methods
    handleError,
    clearError,
    clearAllErrors,
    getError,
    hasError,
    hasAnyError,
    getErrorSummary,
    retryOperation,
    
    // Computed values
    errorCount: Object.keys(errors).length,
    errorHistory: errorHistory.current
  };
};

/**
 * Higher-order component to wrap components with error handling
 * @param {Function} Component - React component to wrap
 * @returns {Function} Wrapped component with error handling props
 */
export const withErrorHandler = (Component) => {
  return function ErrorHandlerWrappedComponent(props) {
    const errorHandler = useErrorHandler();
    
    return (
      <Component 
        {...props} 
        errorHandler={errorHandler}
      />
    );
  };
};

export default useErrorHandler;