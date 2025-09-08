// src/pages/admin/articles/Articles.jsx - Updated with Phase 2 improvements
import React, { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ErrorBoundary from '../../../components/ErrorBoundary';

// Import enhanced hooks from Phase 2
import { useArticles } from './hooks/useArticles.js';
import { useArticleFilters } from './hooks/useArticleFilters.js';
import { useArticleEditor } from './hooks/useArticleEditor.js';
import { useArticleOperations } from './hooks/useArticleOperations.js';
import { useArticleStatus } from './hooks/useArticleStatus.js';
import { useArticleMetrics } from './hooks/useArticleMetrics.js';

// Import Phase 2 components
import ArticlesContainer from './ArticlesContainer';
import ArticleEditor from './ArticleEditor';
import { ArticleMetrics } from './components/ArticleMetrics';
import VirtualArticleTable from './components/VirtualArticleTable';

const Articles = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Enhanced article management with caching and performance optimizations
  const {
    articles,
    categories,
    authors,
    loading,
    showEditor,
    editingArticle,
    pagination,
    handleEdit,
    handleDelete,
    handleStatusChange,
    setShowEditor,
    setEditingArticle,
    debugAndFixContent,
    refetch: refetchArticles,
    // New Phase 2 features
    fetchArticle,
    loadMore,
    resetPagination,
    invalidateCache,
    invalidateArticleCache,
    cacheStats,
    queryCount,
    lastFetchTime,
    errors,
    hasErrors
  } = useArticles(userProfile);

  // Enhanced filter management
  const {
    filters,
    filteredArticles,
    updateFilter,
    setFilters,
    clearFilters,
    hasActiveFilters
  } = useArticleFilters(articles);

  // Enhanced editor state management
  const editorProps = useArticleEditor(
    editingArticle,
    () => {
      setShowEditor(false);
      setEditingArticle(null);
      // Invalidate cache after editing
      invalidateCache();
    },
    userProfile,
    debugAndFixContent
  );

  // Enhanced article operations with cache management
  const {
    duplicateArticle,
    bulkUpdateStatus,
    bulkDelete,
    scheduleArticle,
    updateSlug,
    toggleFeatured,
    exportArticles
  } = useArticleOperations(userProfile);

  // Status management utilities
  const {
    getStatusConfig,
    getAvailableActions,
    canTransitionTo,
    isEditable
  } = useArticleStatus();

  // Enhanced analytics and metrics
  const {
    stats,
    getTrendingArticles,
    getTopPerformingArticles,
    getPublishingStats,
    getArticlesNeedingAttention,
    getContentHealthScore
  } = useArticleMetrics(articles);

  // Handle new article creation with cache invalidation
  const handleNewArticle = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  // Enhanced handlers with cache management
  const handleDeleteWithCache = async (id) => {
    await handleDelete(id);
    invalidateArticleCache(id);
  };

  const handleStatusChangeWithCache = async (id, newStatus) => {
    await handleStatusChange(id, newStatus);
    invalidateArticleCache(id);
  };

  // Enhanced operations with cache invalidation
  const handleDuplicate = async (article) => {
    await duplicateArticle(article, () => {
      invalidateCache();
      refetchArticles();
    });
  };

  const handleToggleFeatured = async (articleId, currentStatus) => {
    await toggleFeatured(articleId, currentStatus, () => {
      invalidateArticleCache(articleId);
      refetchArticles();
    });
  };

  const handleSchedule = async (articleId, scheduledDate) => {
    await scheduleArticle(articleId, scheduledDate, () => {
      invalidateArticleCache(articleId);
      refetchArticles();
    });
  };

  // Enhanced bulk operations with cache management
  const handleBulkOperations = {
    updateStatus: async (articleIds, status) => {
      await bulkUpdateStatus(articleIds, status, () => {
        invalidateCache();
        refetchArticles();
      });
    },
    delete: async (articleIds) => {
      await bulkDelete(articleIds, () => {
        invalidateCache();
        refetchArticles();
      });
    }
  };

  // Handle URL parameters for direct access
  React.useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleNewArticle();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Enhanced editor props with all Phase 2 features
  const enhancedEditorProps = {
    ...editorProps,
    showEditor,
    editingArticle,
    categories,
    authors,
    userProfile,
    onClose: () => {
      setShowEditor(false);
      setEditingArticle(null);
      editorProps.resetForm();
      // Clear any editor-specific cache
      invalidateCache();
    },
    onSave: () => editorProps.handleSave(() => {
      invalidateCache();
      refetchArticles();
    }),
    onSaveWithStatus: (status) => editorProps.handleSaveWithStatus(status, () => {
      invalidateCache();
      refetchArticles();
    }),
    // Enhanced operations
    onDuplicate: handleDuplicate,
    onSchedule: handleSchedule,
    onUpdateSlug: updateSlug,
    // Status utilities
    getStatusConfig,
    canTransitionTo,
    isEditable: (status) => isEditable(status, userProfile?.role, editingArticle?.author_id === userProfile?.id)
  };

  // Enhanced container props with all Phase 2 features
  const enhancedContainerProps = {
    // Core data
    articles,
    loading,
    filters,
    filteredArticles,
    categories,
    authors,
    userProfile,
    totalArticles: articles.length,
    filteredCount: filteredArticles.length,
    
    // Pagination (new in Phase 2)
    pagination,
    onLoadMore: loadMore,
    onResetPagination: resetPagination,
    
    // Filter management
    updateFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    
    // Article operations
    onEdit: handleEdit,
    onDelete: handleDeleteWithCache,
    onStatusChange: handleStatusChangeWithCache,
    onNewArticle: handleNewArticle,
    onRefresh: refetchArticles,
    
    // Enhanced operations (Phase 2)
    onDuplicate: handleDuplicate,
    onToggleFeatured: handleToggleFeatured,
    onSchedule: handleSchedule,
    onBulkOperations: handleBulkOperations,
    onExport: exportArticles,
    
    // Utility functions
    getStatusConfig,
    getAvailableActions,
    
    // Analytics and insights
    stats,
    contentHealthScore: getContentHealthScore(),
    getTrendingArticles,
    getTopPerformingArticles,
    getArticlesNeedingAttention,
    
    // Performance metrics (new in Phase 2)
    cacheStats,
    performanceMetrics: {
      queryCount,
      lastFetchTime,
      cacheHitRatio: cacheStats.hitRatio || 0,
      memoryUsage: process.env.NODE_ENV === 'development' ? 
        Math.round(JSON.stringify(articles).length / (1024 * 1024) * 100) / 100 : 0
    }
  };

  // Error handling for Phase 2 components
  if (hasErrors) {
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="AlertTriangle" size={20} className="text-red-600" />
              <h2 className="text-lg font-medium text-red-900">Loading Error</h2>
            </div>
            
            <div className="space-y-2 text-sm text-red-700">
              {errors.fetching && <div>• Failed to load articles: {errors.fetching.message}</div>}
              {errors.categories && <div>• Failed to load categories: {errors.categories.message}</div>}
              {errors.authors && <div>• Failed to load authors: {errors.authors.message}</div>}
            </div>
            
            <div className="mt-4 flex space-x-3">
              <Button
                variant="outline"
                onClick={refetchArticles}
                iconName="RefreshCw"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
              <Button
                variant="default"
                onClick={handleNewArticle}
                iconName="Plus"
                className="bg-red-600 hover:bg-red-700"
              >
                Create Article
              </Button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Loading state for initial load
  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
          <div className="text-xs text-gray-500 mt-2">
            {cacheStats.size > 0 && `Using cached data (${cacheStats.size} items)`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Enhanced Analytics Dashboard - Phase 2 improvements */}
        {articles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading-bold">Article Analytics</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {/* Performance indicators */}
                <div className="flex items-center space-x-2">
                  <span>Cache:</span>
                  <span className="font-medium text-green-600">
                    {cacheStats.size} items
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span>Health Score:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enhancedContainerProps.contentHealthScore}%` }}
                      />
                    </div>
                    <span className="font-medium">{enhancedContainerProps.contentHealthScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ArticleMetrics 
              articles={articles} 
              variant="compact"
              className="mb-4"
            />
            
            {/* Enhanced insights with performance data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Performance metrics */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Performance</h3>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div>Queries: {queryCount}</div>
                    <div>Memory: {enhancedContainerProps.performanceMetrics.memoryUsage}MB</div>
                    <div>Cache Hit: {Math.round(cacheStats.hitRatio || 0)}%</div>
                  </div>
                </div>
              )}
              
              {/* Quick insights */}
              {getArticlesNeedingAttention().length > 0 && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Needs Attention</h3>
                  <div className="space-y-1">
                    {getArticlesNeedingAttention().slice(0, 2).map((issue, index) => (
                      <div key={index} className="text-sm text-yellow-700">
                        • {issue.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Publishing stats */}
              <div className="bg-green-50 p-3 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-2">Publishing</h3>
                <div className="space-y-1 text-xs text-green-700">
                  <div>This month: {getPublishingStats().thisMonth}</div>
                  <div>Weekly avg: {getPublishingStats().weeklyAverage}</div>
                  <div>Trend: {getPublishingStats().publishingTrend}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2 Enhanced Articles Container */}
        <ArticlesContainer {...enhancedContainerProps} />

        {/* Enhanced Article Editor Modal with Phase 2 features */}
        {showEditor && <ArticleEditor {...enhancedEditorProps} />}
      </div>
    </ErrorBoundary>
  );
};

export default Articles;