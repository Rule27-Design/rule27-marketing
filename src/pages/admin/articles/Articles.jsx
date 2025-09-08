// src/pages/admin/articles/Articles.jsx - Updated with Phase 3 command pattern integration
import React, { useState, useCallback, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ErrorBoundary from '../../../components/ErrorBoundary';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';

// Import Phase 3 services and hooks
import { ArticleOperationsService } from './services/ArticleOperations.js';
import { useArticleEvents, globalEventBus } from './hooks/useArticleEvents.js';
import { useArticles } from './hooks/useArticles.js';
import { useArticleFilters } from './hooks/useArticleFilters.js';
import { useArticleStatus } from './hooks/useArticleStatus.js';
import { useArticleMetrics } from './hooks/useArticleMetrics.js';
import { useGlobalKeyboardShortcuts } from './hooks/useGlobalKeyboardShortcuts.js';

// Import components
import ArticlesContainer from './ArticlesContainer';
import ArticleEditor from './ArticleEditor';
import { ArticleMetrics } from './components/ArticleMetrics';
import UndoRedoControls from './components/UndoRedoControls';

const Articles = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize command service with event bus integration
  const [operationsService] = useState(() => 
    new ArticleOperationsService({ 
      userProfile, 
      eventBus: globalEventBus 
    })
  );

  // Event system integration
  const { emit, subscribe } = useArticleEvents();

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
    setShowEditor,
    setEditingArticle,
    debugAndFixContent,
    refetch: refetchArticles,
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

  // Command pattern operations with automatic cache invalidation
  const handleDeleteWithCommand = useCallback(async (id) => {
    try {
      const result = await operationsService.deleteArticle(id, userProfile.id);
      if (result.success) {
        invalidateArticleCache(id);
        await refetchArticles();
      }
      return result;
    } catch (error) {
      console.error('Delete operation failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateArticleCache, refetchArticles]);

  const handleStatusChangeWithCommand = useCallback(async (id, newStatus) => {
    try {
      let result;
      
      // Use appropriate command based on status
      switch (newStatus) {
        case 'published':
          result = await operationsService.publishArticle(id, userProfile.id);
          break;
        case 'archived':
          result = await operationsService.archiveArticle(id, userProfile.id);
          break;
        default:
          // Use bulk update for other status changes
          result = await operationsService.bulkUpdateArticles([id], { status: newStatus }, userProfile.id);
      }
      
      if (result.success) {
        invalidateArticleCache(id);
        await refetchArticles();
      }
      return result;
    } catch (error) {
      console.error('Status change operation failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateArticleCache, refetchArticles]);

  // Enhanced operations with command pattern
  const handleDuplicateWithCommand = useCallback(async (article) => {
    try {
      const result = await operationsService.duplicateArticle(article.id, userProfile.id);
      if (result.success) {
        invalidateCache();
        await refetchArticles();
      }
      return result;
    } catch (error) {
      console.error('Duplicate operation failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateCache, refetchArticles]);

  const handleToggleFeaturedWithCommand = useCallback(async (articleId, currentStatus) => {
    try {
      const result = await operationsService.bulkUpdateArticles(
        [articleId], 
        { is_featured: !currentStatus }, 
        userProfile.id
      );
      if (result.success) {
        invalidateArticleCache(articleId);
        await refetchArticles();
      }
      return result;
    } catch (error) {
      console.error('Toggle featured operation failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateArticleCache, refetchArticles]);

  // Enhanced bulk operations with command pattern
  const handleBulkOperations = {
    updateStatus: async (articleIds, status) => {
      try {
        const result = await operationsService.bulkUpdateArticles(articleIds, { status }, userProfile.id);
        if (result.success) {
          invalidateCache();
          await refetchArticles();
        }
        return result;
      } catch (error) {
        console.error('Bulk status update failed:', error);
        return { success: false, error: error.message };
      }
    },
    delete: async (articleIds) => {
      try {
        // Create individual delete commands for better undo support
        const results = await Promise.all(
          articleIds.map(id => operationsService.deleteArticle(id, userProfile.id))
        );
        
        if (results.every(r => r.success)) {
          invalidateCache();
          await refetchArticles();
        }
        
        return { 
          success: results.every(r => r.success),
          results 
        };
      } catch (error) {
        console.error('Bulk delete failed:', error);
        return { success: false, error: error.message };
      }
    }
  };

  // Undo/Redo functionality
  const handleUndo = useCallback(async () => {
    try {
      const result = await operationsService.undo();
      if (result.success) {
        invalidateCache();
        await refetchArticles();
        emit('action:undone', { result });
      }
      return result;
    } catch (error) {
      console.error('Undo failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, invalidateCache, refetchArticles, emit]);

  const handleRedo = useCallback(async () => {
    try {
      const result = await operationsService.redo();
      if (result.success) {
        invalidateCache();
        await refetchArticles();
        emit('action:redone', { result });
      }
      return result;
    } catch (error) {
      console.error('Redo failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, invalidateCache, refetchArticles, emit]);

  // Handle new article creation with cache invalidation
  const handleNewArticle = useCallback(() => {
    setEditingArticle(null);
    setShowEditor(true);
    emit('article:editor_opened', { isNew: true });
  }, [setEditingArticle, setShowEditor, emit]);

  // Enhanced editor close handler
  const handleEditorClose = useCallback(() => {
    setShowEditor(false);
    setEditingArticle(null);
    emit('article:editor_closed', { editingArticle });
  }, [setShowEditor, setEditingArticle, emit, editingArticle]);

  // Global keyboard shortcuts
  useGlobalKeyboardShortcuts(operationsService, {
    onUndo: handleUndo,
    onRedo: handleRedo,
    onNewArticle: handleNewArticle
  });

  // Handle URL parameters for direct access
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleNewArticle();
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, handleNewArticle]);

  // Event listeners for real-time updates and user feedback
  useEffect(() => {
    const unsubscribers = [];

    // Listen for successful operations
    unsubscribers.push(
      subscribe('article:published', ({ article }) => {
        // Could show notification or update UI
        console.log(`Article "${article.title}" published successfully`);
      })
    );

    unsubscribers.push(
      subscribe('article:archived', ({ article }) => {
        console.log(`Article "${article.title}" archived successfully`);
      })
    );

    unsubscribers.push(
      subscribe('articles:bulk_updated', ({ count, updates }) => {
        console.log(`${count} articles updated:`, updates);
      })
    );

    unsubscribers.push(
      subscribe('command:executed', ({ command, canUndo, canRedo }) => {
        // Could update undo/redo button states or show feedback
        console.log(`Command executed: ${command}`, { canUndo, canRedo });
      })
    );

    unsubscribers.push(
      subscribe('command:undone', ({ command }) => {
        console.log(`Command undone: ${command}`);
      })
    );

    unsubscribers.push(
      subscribe('command:redone', ({ command }) => {
        console.log(`Command redone: ${command}`);
      })
    );

    // Performance monitoring
    unsubscribers.push(
      subscribe('performance:cache_hit', () => {
        // Track cache performance
      })
    );

    unsubscribers.push(
      subscribe('performance:cache_miss', () => {
        // Track cache misses
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe]);

  // Enhanced container props with all Phase 3 features
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
    
    // Pagination
    pagination,
    onLoadMore: loadMore,
    onResetPagination: resetPagination,
    
    // Filter management
    updateFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    
    // Command pattern operations
    onEdit: handleEdit,
    onDelete: handleDeleteWithCommand,
    onStatusChange: handleStatusChangeWithCommand,
    onNewArticle: handleNewArticle,
    onRefresh: refetchArticles,
    
    // Enhanced operations with commands
    onDuplicate: handleDuplicateWithCommand,
    onToggleFeatured: handleToggleFeaturedWithCommand,
    onBulkOperations: handleBulkOperations,
    
    // Utility functions
    getStatusConfig,
    getAvailableActions,
    
    // Analytics and insights
    stats,
    contentHealthScore: getContentHealthScore(),
    getTrendingArticles,
    getTopPerformingArticles,
    getArticlesNeedingAttention,
    
    // Performance metrics
    cacheStats,
    performanceMetrics: {
      queryCount,
      lastFetchTime,
      cacheHitRatio: cacheStats.hitRatio || 0,
      memoryUsage: process.env.NODE_ENV === 'development' ? 
        Math.round(JSON.stringify(articles).length / (1024 * 1024) * 100) / 100 : 0
    }
  };

  // Enhanced editor props with command pattern integration
  const enhancedEditorProps = {
    showEditor,
    editingArticle,
    categories,
    authors,
    userProfile,
    onClose: handleEditorClose,
    onSave: () => {
      invalidateCache();
      refetchArticles();
    },
    onSaveWithStatus: () => {
      invalidateCache();
      refetchArticles();
    },
    // Enhanced operations
    onDuplicate: handleDuplicateWithCommand,
    // Status utilities
    getStatusConfig,
    canTransitionTo,
    isEditable: (status) => isEditable(status, userProfile?.role, editingArticle?.author_id === userProfile?.id),
    // Debug function
    debugAndFixContent
  };

  // Error handling for command operations
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
        {/* Command History & Undo/Redo Controls */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-heading-bold">Article Management</h2>
              {process.env.NODE_ENV === 'development' && (
                <div className="text-sm text-gray-500">
                  Commands: {operationsService.commandManager.history.length} | 
                  Cache: {cacheStats.size} items
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Undo/Redo Controls */}
              <UndoRedoControls 
                operationsService={operationsService}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
              
              {/* Quick actions */}
              <Button
                variant="outline"
                onClick={handleNewArticle}
                iconName="Plus"
                size="sm"
              >
                New Article
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Dashboard with Command Pattern Insights */}
        {articles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading-bold">Analytics & Command History</h2>
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

                <div className="flex items-center space-x-2">
                  <span>Commands:</span>
                  <span className="font-medium text-blue-600">
                    {operationsService.commandManager.history.length}
                  </span>
                </div>
              </div>
            </div>
            
            <ArticleMetrics 
              articles={articles} 
              variant="compact"
              className="mb-4"
            />
            
            {/* Command history summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
              
              {/* Command insights */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <h3 className="text-sm font-medium text-purple-900 mb-2">Commands</h3>
                <div className="space-y-1 text-xs text-purple-700">
                  <div>History: {operationsService.commandManager.history.length}</div>
                  <div>Can Undo: {operationsService.canUndo() ? 'Yes' : 'No'}</div>
                  <div>Can Redo: {operationsService.canRedo() ? 'Yes' : 'No'}</div>
                </div>
              </div>
              
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

        {/* Enhanced Articles Container with Command Pattern */}
        <ArticlesContainer {...enhancedContainerProps} />

        {/* Enhanced Article Editor Modal with Command Integration */}
        {showEditor && <ArticleEditor {...enhancedEditorProps} />}
      </div>
    </ErrorBoundary>
  );
};

export default Articles;