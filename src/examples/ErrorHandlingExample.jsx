// src/examples/ErrorHandlingExample.jsx
// Example showing how to use all error handling features together

import React, { useState, useEffect } from 'react';
import ErrorBoundary, { 
  SectionErrorBoundary, 
  useErrorReporter, 
  useErrorBoundaryListener,
  withErrorBoundary 
} from '@/components/ErrorBoundary';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { globalEventBus } from '@/services/EventBus';
import { useToast } from '@/hooks/useToast';

/**
 * Example: Main App component with global error boundary
 */
export const App = () => {
  const { error: globalError } = useToast();
  
  // Listen for all error boundary crashes
  useErrorBoundaryListener((errorData) => {
    console.error('App received error boundary event:', errorData);
    
    // Show toast notification for errors
    globalError(`An error occurred: ${errorData.error}`, {
      duration: 7000,
      action: {
        label: 'View Details',
        onClick: () => console.log('Error details:', errorData)
      }
    });
  });
  
  return (
    <ErrorBoundary
      message="The application encountered an error. Please refresh the page."
      onError={(error, errorInfo, errorId) => {
        console.log('App-level error caught:', errorId);
      }}
    >
      <div className="app">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

/**
 * Example: Component using operational error handling
 */
const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  
  // Comprehensive error handler for operational errors
  const { 
    handleError, 
    retry, 
    isRetrying, 
    error,
    clearError 
  } = useErrorHandler({
    maxRetries: 3,
    retryDelay: 1000,
    onMaxRetriesReached: (error) => {
      console.error('Max retries reached for articles fetch:', error);
    }
  });
  
  // Simple error reporter for manual error tracking
  const reportError = useErrorReporter();
  
  // Fetch articles with error handling
  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      // Handle operational error with retry capability
      const errorInfo = handleError(err, 'Failed to fetch articles', {
        retryable: true,
        context: { endpoint: '/api/articles' }
      });
      
      // Also report to external services
      const errorId = reportError(err, {
        component: 'ArticlesSection',
        action: 'fetchArticles'
      });
      
      console.log('Error tracked with ID:', errorId);
    }
  };
  
  // Retry failed operation
  const handleRetry = async () => {
    await retry(fetchArticles);
  };
  
  // Intentional error for demonstration
  const triggerError = () => {
    throw new Error('This is an intentional error for testing!');
  };
  
  useEffect(() => {
    fetchArticles();
  }, []);
  
  return (
    <SectionErrorBoundary section="Articles">
      <div className="articles-section p-4">
        <h2 className="text-2xl font-bold mb-4">Articles</h2>
        
        {/* Show error state if there's an operational error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-700">{error.message}</p>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
            <button
              onClick={clearError}
              className="mt-2 ml-2 px-4 py-2 bg-gray-600 text-white rounded"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Articles list */}
        <div className="grid gap-4">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        
        {/* Test error boundary button (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={triggerError}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Test Error Boundary (Dev Only)
          </button>
        )}
      </div>
    </SectionErrorBoundary>
  );
};

/**
 * Example: Component with HOC error boundary
 */
const ArticleCard = ({ article }) => {
  const reportError = useErrorReporter();
  
  const handleClick = () => {
    try {
      // Some operation that might fail
      processArticle(article);
    } catch (error) {
      // Report error manually
      reportError(error, {
        component: 'ArticleCard',
        articleId: article.id
      });
    }
  };
  
  return (
    <div className="article-card p-4 border rounded" onClick={handleClick}>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
    </div>
  );
};

// Wrap with HOC for error boundary
const SafeArticleCard = withErrorBoundary(ArticleCard, {
  message: 'Failed to render article card'
});

/**
 * Example: Global error event listeners
 */
export const setupGlobalErrorListeners = () => {
  // Listen for all boundary errors
  globalEventBus.on('error:boundary', (data) => {
    console.log('Boundary error:', data);
    // Could send to analytics, show notification, etc.
  });
  
  // Listen for manual error reports
  globalEventBus.on('error:manual', (data) => {
    console.log('Manual error report:', data);
  });
  
  // Listen for section-specific errors
  globalEventBus.on('error:section', (data) => {
    console.log(`Error in ${data.section} section:`, data);
  });
  
  // Listen for retry attempts
  globalEventBus.on('error:boundary:retry', (data) => {
    console.log('User retrying after error:', data);
  });
  
  // Track error patterns
  let errorCount = 0;
  globalEventBus.on('error:*', () => {
    errorCount++;
    if (errorCount > 10) {
      console.warn('High error rate detected!');
    }
  });
};

/**
 * Example: Custom error boundary for forms
 */
export const FormErrorBoundary = ({ children, onError }) => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo, retry) => (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="text-yellow-800 font-medium mb-2">
            Form Error
          </h3>
          <p className="text-yellow-700 mb-3">
            The form encountered an error. Your data has been saved locally.
          </p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-yellow-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      )}
      onError={(error, errorInfo, errorId) => {
        // Save form data to localStorage on error
        const formData = document.querySelector('form')?.elements;
        if (formData) {
          const data = Object.fromEntries(new FormData(formData));
          localStorage.setItem(`form_recovery_${errorId}`, JSON.stringify(data));
        }
        
        if (onError) onError(error, errorInfo, errorId);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Example: Error recovery with saved state
 */
export const RecoverableComponent = () => {
  const [data, setData] = useState(null);
  const reportError = useErrorReporter();
  
  // Check for recovered data on mount
  useEffect(() => {
    const recoveredData = localStorage.getItem('component_state_backup');
    if (recoveredData) {
      try {
        setData(JSON.parse(recoveredData));
        localStorage.removeItem('component_state_backup');
        console.log('Recovered from previous error');
      } catch (e) {
        reportError(e, { context: 'recovery_failed' });
      }
    }
  }, []);
  
  // Save state before risky operations
  const performRiskyOperation = async () => {
    // Backup current state
    localStorage.setItem('component_state_backup', JSON.stringify(data));
    
    try {
      // Risky operation
      const result = await riskyApiCall();
      setData(result);
      
      // Clear backup on success
      localStorage.removeItem('component_state_backup');
    } catch (error) {
      reportError(error, { 
        context: 'risky_operation',
        backed_up: true 
      });
      throw error; // Let error boundary catch it
    }
  };
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default App;