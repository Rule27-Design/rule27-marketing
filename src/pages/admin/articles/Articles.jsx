// src/pages/admin/articles/Articles.jsx - Fixed imports (remove .js extensions)
import React, { useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ErrorBoundary from '../../../components/ErrorBoundary';

// Import all the custom hooks WITHOUT .js extensions
import { useArticles } from './hooks/useArticles';
import { useArticleFilters } from './hooks/useArticleFilters';
import { useArticleEditor } from './hooks/useArticleEditor';
import { useArticleOperations } from './hooks/useArticleOperations';
import { useArticleStatus } from './hooks/useArticleStatus';
import { useArticleMetrics } from './hooks/useArticleMetrics';

// Import components
import ArticlesList from './ArticlesList';
import ArticleEditor from './ArticleEditor';
import { ArticleMetrics } from './components/ArticleMetrics';

const Articles = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Core article data and operations
  const {
    articles,
    categories,
    authors,
    loading,
    showEditor,
    editingArticle,
    handleEdit,
    handleDelete,
    handleStatusChange,
    setShowEditor,
    setEditingArticle,
    debugAndFixContent,
    refetch: refetchArticles
  } = useArticles(userProfile);

  // Filter management
  const {
    filters,
    filteredArticles,
    updateFilter,
    setFilters,
    clearFilters,
    hasActiveFilters
  } = useArticleFilters(articles);

  // Editor state management
  const editorProps = useArticleEditor(
    editingArticle,
    () => {
      setShowEditor(false);
      setEditingArticle(null);
    },
    userProfile,
    debugAndFixContent
  );

  // Article operations (duplicate, bulk actions, etc.)
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

  // Analytics and metrics
  const {
    stats,
    getTrendingArticles,
    getTopPerformingArticles,
    getPublishingStats,
    getArticlesNeedingAttention,
    getContentHealthScore
  } = useArticleMetrics(articles);

  // Handle new article creation
  const handleNewArticle = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  // Handle article operations with refetch
  const handleDeleteWithRefetch = async (id) => {
    await handleDelete(id);
    // Refresh is handled in useArticles hook
  };

  const handleStatusChangeWithRefetch = async (id, newStatus) => {
    await handleStatusChange(id, newStatus);
    // Refresh is handled in useArticles hook
  };

  // Enhanced operations with custom hooks
  const handleDuplicate = async (article) => {
    await duplicateArticle(article, refetchArticles);
  };

  const handleToggleFeatured = async (articleId, currentStatus) => {
    await toggleFeatured(articleId, currentStatus, refetchArticles);
  };

  const handleSchedule = async (articleId, scheduledDate) => {
    await scheduleArticle(articleId, scheduledDate, refetchArticles);
  };

  const handleBulkOperations = {
    updateStatus: async (articleIds, status) => {
      await bulkUpdateStatus(articleIds, status, refetchArticles);
    },
    delete: async (articleIds) => {
      await bulkDelete(articleIds, refetchArticles);
    }
  };

  // Check if user accessed via URL params
  React.useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleNewArticle();
      // Clear the URL param
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Enhanced editor props with all hooks
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
    },
    onSave: () => editorProps.handleSave(refetchArticles),
    onSaveWithStatus: (status) => editorProps.handleSaveWithStatus(status, refetchArticles),
    // Additional operations
    onDuplicate: handleDuplicate,
    onSchedule: handleSchedule,
    onUpdateSlug: updateSlug,
    // Status utilities
    getStatusConfig,
    canTransitionTo,
    isEditable: (status) => isEditable(status, userProfile?.role, editingArticle?.author_id === userProfile?.id)
  };

  // Enhanced list props
  const enhancedListProps = {
    articles,
    loading,
    filters,
    filteredArticles,
    updateFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    categories,
    authors,
    userProfile,
    totalArticles: articles.length,
    filteredCount: filteredArticles.length,
    onEdit: handleEdit,
    onDelete: handleDeleteWithRefetch,
    onStatusChange: handleStatusChangeWithRefetch,
    onNewArticle: handleNewArticle,
    onRefresh: refetchArticles,
    // Enhanced operations
    onDuplicate: handleDuplicate,
    onToggleFeatured: handleToggleFeatured,
    onSchedule: handleSchedule,
    onBulkOperations: handleBulkOperations,
    onExport: exportArticles,
    // Status utilities
    getStatusConfig,
    getAvailableActions,
    // Analytics
    stats,
    getTrendingArticles,
    getTopPerformingArticles,
    getArticlesNeedingAttention,
    contentHealthScore: getContentHealthScore()
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Analytics Dashboard - Show metrics if user has articles */}
        {articles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading-bold">Article Analytics</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Health Score:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${enhancedListProps.contentHealthScore}%` }}
                    />
                  </div>
                  <span className="font-medium">{enhancedListProps.contentHealthScore}%</span>
                </div>
              </div>
            </div>
            
            <ArticleMetrics 
              articles={articles} 
              variant="compact"
              className="mb-4"
            />
            
            {/* Quick insights */}
            {getArticlesNeedingAttention().length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
          </div>
        )}

        {/* Main Articles List */}
        <ArticlesList {...enhancedListProps} />

        {/* Article Editor Modal */}
        {showEditor && <ArticleEditor {...enhancedEditorProps} />}
      </div>
    </ErrorBoundary>
  );
};

export default Articles;