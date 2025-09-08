// src/pages/admin/articles/Articles.jsx - Enhanced with Phase 4 UX improvements
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

// Import existing components
import ArticlesContainer from './ArticlesContainer';
import ArticleEditor from './ArticleEditor';
import { ArticleMetrics } from './components/ArticleMetrics';
import UndoRedoControls from './components/UndoRedoControls';

// Import Phase 4 UX Enhancement components
import ArticlePreview from './components/ArticlePreview';
import ArticleQuickActions from './components/ArticleQuickActions';
import { 
  ArticleTableSkeleton, 
  ArticleToolbarSkeleton, 
  ArticleMetricsSkeleton,
  ProgressiveArticlesSkeleton 
} from './components/SkeletonComponents';
import { 
  ShortcutHints, 
  KeyboardShortcutsModal, 
  ContextualShortcuts 
} from './components/KeyboardShortcutsUI';

const Articles = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Phase 4 UX state
  const [showPreview, setShowPreview] = useState(false);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showShortcutHints, setShowShortcutHints] = useState(true);
  const [uiAnimationsEnabled, setUiAnimationsEnabled] = useState(true);
  
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

  // Phase 4: Enhanced Quick Actions handlers
  const handleQuickPublish = useCallback(async (articleIds) => {
    try {
      const result = await operationsService.bulkUpdateArticles(
        articleIds, 
        { status: 'published' }, 
        userProfile.id
      );
      if (result.success) {
        invalidateCache();
        await refetchArticles();
        emit('quick_action:bulk_publish', { count: articleIds.length });
      }
      return result;
    } catch (error) {
      console.error('Quick publish failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateCache, refetchArticles, emit]);

  const handleQuickArchive = useCallback(async (articleIds) => {
    try {
      const result = await operationsService.bulkUpdateArticles(
        articleIds, 
        { status: 'archived' }, 
        userProfile.id
      );
      if (result.success) {
        invalidateCache();
        await refetchArticles();
        emit('quick_action:bulk_archive', { count: articleIds.length });
      }
      return result;
    } catch (error) {
      console.error('Quick archive failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateCache, refetchArticles, emit]);

  const handleQuickDelete = useCallback(async (articleIds) => {
    if (!confirm(`Are you sure you want to delete ${articleIds.length} article(s)?`)) {
      return { success: false, cancelled: true };
    }

    try {
      const results = await Promise.all(
        articleIds.map(id => operationsService.deleteArticle(id, userProfile.id))
      );
      
      if (results.every(r => r.success)) {
        invalidateCache();
        await refetchArticles();
        emit('quick_action:bulk_delete', { count: articleIds.length });
      }
      
      return { 
        success: results.every(r => r.success),
        results 
      };
    } catch (error) {
      console.error('Quick delete failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateCache, refetchArticles, emit]);

  // Phase 4: Enhanced Preview handlers
  const handlePreviewArticle = useCallback(async (article) => {
    try {
      // Fetch full article data if needed
      const fullArticle = article.content ? article : await fetchArticle(article.id);
      setPreviewArticle(fullArticle);
      setShowPreview(true);
      emit('ui:preview_opened', { articleId: article.id });
    } catch (error) {
      console.error('Failed to load article for preview:', error);
    }
  }, [fetchArticle, emit]);

  const handlePreviewPublish = useCallback(async (articleId) => {
    try {
      const result = await operationsService.publishArticle(articleId, userProfile.id);
      if (result.success) {
        invalidateArticleCache(articleId);
        await refetchArticles();
        setShowPreview(false);
        emit('preview:quick_publish', { articleId });
      }
      return result;
    } catch (error) {
      console.error('Preview publish failed:', error);
      return { success: false, error: error.message };
    }
  }, [operationsService, userProfile.id, invalidateArticleCache, refetchArticles, emit]);

  // Enhanced operations with command pattern
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
      
      switch (newStatus) {
        case 'published':
          result = await operationsService.publishArticle(id, userProfile.id);
          break;
        case 'archived':
          result = await operationsService.archiveArticle(id, userProfile.id);
          break;
        default:
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

  const handleNewArticle = useCallback(() => {
    setEditingArticle(null);
    setShowEditor(true);
    emit('article:editor_opened', { isNew: true });
  }, [setEditingArticle, setShowEditor, emit]);

  const handleEditorClose = useCallback(() => {
    setShowEditor(false);
    setEditingArticle(null);
    emit('article:editor_closed', { editingArticle });
  }, [setShowEditor, setEditingArticle, emit, editingArticle]);

  // Phase 4: Global keyboard shortcuts with enhanced UI integration
  const { showHelp } = useGlobalKeyboardShortcuts(operationsService, {
    onUndo: handleUndo,
    onRedo: handleRedo,
    onNewArticle: handleNewArticle,
    onRefresh: refetchArticles,
    onHelp: () => setShowShortcutsModal(true)
  });

  // Phase 4: Export functionality
  const handleExport = useCallback((articleIds = null, format = 'json') => {
    // This would implement the export functionality
    emit('ui:export_requested', { articleIds, format });
  }, [emit]);

  // Handle URL parameters for direct access
  useEffect(() => {
    const action = searchParams.get('action');
    const articleId = searchParams.get('article');
    
    if (action === 'new') {
      handleNewArticle();
      setSearchParams({});
    } else if (action === 'preview' && articleId) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        handlePreviewArticle(article);
      }
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, handleNewArticle, articles, handlePreviewArticle]);

  // Phase 4: Enhanced event listeners for UI feedback
  useEffect(() => {
    const unsubscribers = [];

    // Listen for UI events
    unsubscribers.push(
      subscribe('ui:preview_opened', ({ articleId }) => {
        console.log(`Preview opened for article: ${articleId}`);
      })
    );

    unsubscribers.push(
      subscribe('quick_action:bulk_publish', ({ count }) => {
        console.log(`Quick published ${count} articles`);
      })
    );

    // Dismiss shortcut hints after user has used enough shortcuts
    unsubscribers.push(
      subscribe('shortcut:executed', (() => {
        let shortcutCount = 0;
        return () => {
          shortcutCount++;
          if (shortcutCount >= 5) {
            setShowShortcutHints(false);
          }
        };
      })())
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [subscribe]);

  // Enhanced container props with Phase 4 features
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
    
    // Phase 4: Preview integration
    onPreview: handlePreviewArticle,
    
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
    onDuplicate: handleDuplicateWithCommand,
    getStatusConfig,
    canTransitionTo,
    isEditable: (status) => isEditable(status, userProfile?.role, editingArticle?.author_id === userProfile?.id),
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

  // Phase 4: Enhanced loading state with progressive skeletons
  if (loading && articles.length === 0) {
    return (
      <div className="space-y-6">
        <ArticleToolbarSkeleton />
        <ArticleMetricsSkeleton variant="compact" />
        <ProgressiveArticlesSkeleton />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Phase 4: Contextual Shortcuts */}
        <ContextualShortcuts context={showEditor ? 'editor' : 'list'} />

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

              {/* Phase 4: Keyboard shortcuts button */}
              <Button
                variant="ghost"
                onClick={() => setShowShortcutsModal(true)}
                iconName="Keyboard"
                size="sm"
                title="Keyboard shortcuts (?)"
              >
                Shortcuts
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Dashboard */}
        {articles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading-bold">Analytics & Performance</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
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
          </div>
        )}

        {/* Enhanced Articles Container */}
        <ArticlesContainer {...enhancedContainerProps} />

        {/* Phase 4: Quick Actions Floating Button */}
        <ArticleQuickActions
          selectedArticles={[]} // This would come from ArticlesContainer selection state
          userProfile={userProfile}
          onNewArticle={handleNewArticle}
          onBulkPublish={handleQuickPublish}
          onBulkArchive={handleQuickArchive}
          onBulkDelete={handleQuickDelete}
          onExport={handleExport}
          onRefresh={refetchArticles}
          onShowKeyboardShortcuts={() => setShowShortcutsModal(true)}
        />

        {/* Phase 4: Shortcut Hints */}
        {showShortcutHints && (
          <ShortcutHints
            visible={true}
            position="bottom-left"
            onDismiss={() => setShowShortcutHints(false)}
          />
        )}

        {/* Enhanced Article Editor Modal */}
        {showEditor && <ArticleEditor {...enhancedEditorProps} />}

        {/* Phase 4: Article Preview Modal */}
        {showPreview && previewArticle && (
          <ArticlePreview
            article={previewArticle}
            isOpen={showPreview}
            onClose={() => {
              setShowPreview(false);
              setPreviewArticle(null);
            }}
            onEdit={(article) => {
              setShowPreview(false);
              handleEdit(article);
            }}
            onPublish={handlePreviewPublish}
            userProfile={userProfile}
          />
        )}

        {/* Phase 4: Keyboard Shortcuts Modal */}
        {showShortcutsModal && (
          <KeyboardShortcutsModal
            isOpen={showShortcutsModal}
            onClose={() => setShowShortcutsModal(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Articles;