// src/pages/admin/articles/ArticlesContainer.jsx - Main container with focused responsibilities
import React, { useState, useMemo } from 'react';
import ErrorBoundary from '../../../components/ErrorBoundary';
import ArticlesToolbar from './components/ArticlesToolbar';
import ArticlesTable from './ArticleTable';
import ArticlesBulkActions from './components/ArticlesBulkActions';
import ArticlesEmptyState from './components/ArticlesEmptyState';
import ArticlesErrorState from './components/ArticlesErrorState';
import { useVirtualization } from './hooks/useVirtualization.js';

const ArticlesContainer = ({
  // Data props
  articles = [],
  loading = false,
  filters,
  filteredArticles,
  categories = [],
  authors = [],
  userProfile,
  totalArticles = 0,
  filteredCount = 0,
  
  // Filter props
  updateFilter,
  setFilters,
  clearFilters,
  hasActiveFilters,
  
  // Action props
  onEdit,
  onDelete,
  onStatusChange,
  onNewArticle,
  onRefresh,
  onDuplicate,
  onToggleFeatured,
  onSchedule,
  onBulkOperations,
  onExport,
  
  // Utility props
  getStatusConfig,
  getAvailableActions,
  
  // Analytics props
  stats,
  contentHealthScore,
  getArticlesNeedingAttention
}) => {
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid', 'virtual'
  const [sortConfig, setSortConfig] = useState({ field: 'updated_at', direction: 'desc' });

  // Virtual scrolling configuration
  const {
    virtualItems,
    totalSize,
    isVirtualized,
    containerRef,
    enableVirtualization,
    disableVirtualization
  } = useVirtualization({
    items: filteredArticles,
    itemHeight: 72, // Approximate row height
    threshold: 100 // Enable virtualization for 100+ items
  });

  // Memoize sorted articles for performance
  const sortedArticles = useMemo(() => {
    if (!filteredArticles.length) return [];
    
    const sorted = [...filteredArticles].sort((a, b) => {
      const { field, direction } = sortConfig;
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle different data types
      if (field === 'updated_at' || field === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredArticles, sortConfig]);

  // Handle article selection for bulk operations
  const handleSelectArticle = (articleId, selected) => {
    setSelectedArticles(prev => 
      selected 
        ? [...prev, articleId]
        : prev.filter(id => id !== articleId)
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedArticles(selected ? sortedArticles.map(article => article.id) : []);
  };

  const clearSelection = () => {
    setSelectedArticles([]);
  };

  // Handle sort changes
  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle view mode changes
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    clearSelection(); // Clear selection when changing views
    
    // Auto-enable virtualization for large datasets in table view
    if (mode === 'table' && sortedArticles.length > 100) {
      enableVirtualization();
    } else if (mode !== 'virtual') {
      disableVirtualization();
    }
  };

  // Enhanced bulk operations with selection clearing
  const handleBulkDelete = async () => {
    if (selectedArticles.length > 0) {
      await onBulkOperations.delete(selectedArticles);
      clearSelection();
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (selectedArticles.length > 0) {
      await onBulkOperations.updateStatus(selectedArticles, status);
      clearSelection();
    }
  };

  const handleExportSelected = () => {
    const articlesToExport = selectedArticles.length > 0 ? selectedArticles : null;
    onExport(articlesToExport, 'json');
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <ArticlesToolbarSkeleton />
        <ArticlesTableSkeleton />
      </div>
    );
  }

  // Error state
  if (!articles.length && !loading) {
    return (
      <ArticlesErrorState
        onRetry={onRefresh}
        onNewArticle={onNewArticle}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Toolbar with filters and controls */}
        <ArticlesToolbar
          // Filter props
          filters={filters}
          updateFilter={updateFilter}
          setFilters={setFilters}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          categories={categories}
          authors={authors}
          
          // View controls
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          sortConfig={sortConfig}
          onSort={handleSort}
          
          // Stats
          totalArticles={totalArticles}
          filteredCount={filteredCount}
          contentHealthScore={contentHealthScore}
          
          // Actions
          onNewArticle={onNewArticle}
          onRefresh={onRefresh}
          onExport={handleExportSelected}
          
          // Selection
          selectedCount={selectedArticles.length}
          onClearSelection={clearSelection}
          
          // Virtualization controls
          isVirtualized={isVirtualized}
          onToggleVirtualization={isVirtualized ? disableVirtualization : enableVirtualization}
        />

        {/* Bulk Actions Bar */}
        {selectedArticles.length > 0 && (
          <ArticlesBulkActions
            selectedArticles={selectedArticles}
            userProfile={userProfile}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkDelete={handleBulkDelete}
            onClearSelection={clearSelection}
            getAvailableActions={getAvailableActions}
          />
        )}

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {sortedArticles.length === 0 ? (
            // No results state
            <ArticlesEmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onNewArticle={onNewArticle}
              totalArticles={totalArticles}
            />
          ) : (
            // Articles table/grid
            <div ref={containerRef} style={{ height: isVirtualized ? '600px' : 'auto' }}>
              {viewMode === 'virtual' || isVirtualized ? (
                <VirtualArticlesTable
                  virtualItems={virtualItems}
                  totalSize={totalSize}
                  articles={sortedArticles}
                  userProfile={userProfile}
                  selectedArticles={selectedArticles}
                  onSelectArticle={handleSelectArticle}
                  onSelectAll={handleSelectAll}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onDuplicate={onDuplicate}
                  onToggleFeatured={onToggleFeatured}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              ) : viewMode === 'grid' ? (
                <ArticlesGrid
                  articles={sortedArticles}
                  userProfile={userProfile}
                  selectedArticles={selectedArticles}
                  onSelectArticle={handleSelectArticle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onDuplicate={onDuplicate}
                  onToggleFeatured={onToggleFeatured}
                />
              ) : (
                <ArticlesTable
                  articles={sortedArticles}
                  userProfile={userProfile}
                  selectedArticles={selectedArticles}
                  onSelectArticle={handleSelectArticle}
                  onSelectAll={handleSelectAll}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onDuplicate={onDuplicate}
                  onToggleFeatured={onToggleFeatured}
                  showSelection={true}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              )}
            </div>
          )}
        </div>

        {/* Performance insights for large datasets */}
        {articles.length > 0 && getArticlesNeedingAttention && (
          <PerformanceInsights
            articles={articles}
            getArticlesNeedingAttention={getArticlesNeedingAttention}
            stats={stats}
            isVirtualized={isVirtualized}
            selectedCount={selectedArticles.length}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// Skeleton components for loading states
const ArticlesToolbarSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
      <div className="flex space-x-3">
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  </div>
);

const ArticlesTableSkeleton = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 border-b bg-gray-50">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
    </div>
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <div className="w-16 h-12 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// Performance insights component
const PerformanceInsights = ({ 
  articles, 
  getArticlesNeedingAttention, 
  stats, 
  isVirtualized, 
  selectedCount 
}) => {
  const insights = getArticlesNeedingAttention();
  
  if (insights.length === 0 && articles.length < 50) return null;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Performance Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance stats */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">System Performance</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Articles loaded:</span>
              <span className="font-medium">{articles.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Virtualized:</span>
              <span className={`font-medium ${isVirtualized ? 'text-green-600' : 'text-gray-500'}`}>
                {isVirtualized ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {selectedCount > 0 && (
              <div className="flex justify-between">
                <span>Selected:</span>
                <span className="font-medium text-blue-600">{selectedCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content insights */}
        {insights.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Content Attention</h4>
            <div className="space-y-2">
              {insights.slice(0, 3).map((issue, index) => (
                <div key={index} className="text-sm">
                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {issue.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Published:</span>
              <span className="font-medium text-green-600">{stats?.published || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Drafts:</span>
              <span className="font-medium text-gray-600">{stats?.drafts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total views:</span>
              <span className="font-medium">{stats?.totalViews?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesContainer;