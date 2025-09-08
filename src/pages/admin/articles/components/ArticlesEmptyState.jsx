// src/pages/admin/articles/components/ArticlesEmptyState.jsx
import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AdminIcon';

export const ArticlesEmptyState = ({ 
  hasFilters, 
  onClearFilters, 
  onNewArticle, 
  totalArticles 
}) => {
  if (hasFilters && totalArticles > 0) {
    // No results from filtering
    return (
      <div className="text-center py-8 px-4">
        <Icon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-4">
          No articles match your current filters
        </p>
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="outline"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            variant="default"
            onClick={onNewArticle}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Create Article
          </Button>
        </div>
      </div>
    );
  }

  // Completely empty state
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon name="FileText" size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
        <p className="text-gray-500 mb-6">
          Get started by creating your first article. You can write about your projects, insights, or anything that showcases your expertise.
        </p>
        <Button
          variant="default"
          onClick={onNewArticle}
          iconName="Plus"
          className="bg-accent hover:bg-accent/90"
        >
          Create your first article
        </Button>

        {/* Quick tips for new users */}
        <div className="mt-8 text-left bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Quick Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with a compelling title and excerpt</li>
            <li>• Add a featured image to increase engagement</li>
            <li>• Use categories and tags for better organization</li>
            <li>• Optimize your SEO settings for better visibility</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// src/pages/admin/articles/components/ArticlesErrorState.jsx
export const ArticlesErrorState = ({ 
  onRetry, 
  onNewArticle,
  error = null 
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <Icon name="AlertTriangle" size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unable to load articles
        </h3>
        <p className="text-gray-500 mb-6">
          {error?.message || 'There was a problem loading your articles. This might be due to a network issue or server problem.'}
        </p>
        
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Button
            variant="outline"
            onClick={onRetry}
            iconName="RefreshCw"
          >
            Try Again
          </Button>
          <Button
            variant="default"
            onClick={onNewArticle}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            Create Article
          </Button>
        </div>

        {/* Troubleshooting tips */}
        <div className="text-left bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Troubleshooting:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Refresh the page</li>
            <li>• Try clearing your browser cache</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>

        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-600">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-900 overflow-auto max-h-32">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default { ArticlesEmptyState, ArticlesErrorState };