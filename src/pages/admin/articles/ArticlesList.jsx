// src/pages/admin/articles/ArticlesList.jsx - Enhanced List Container
import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';
import ArticleFilters, { FilterSummary } from './ArticleFilters';
import ArticleTable from './ArticleTable';
import { BulkArticleActions } from './components/ArticleActions';

const ArticlesList = ({
  articles = [],
  loading = false,
  filters,
  filteredArticles,
  updateFilter,
  setFilters,
  clearFilters,
  hasActiveFilters,
  categories = [],
  authors = [],
  userProfile,
  totalArticles = 0,
  filteredCount = 0,
  onEdit,
  onDelete,
  onStatusChange,
  onNewArticle,
  onRefresh,
  // Enhanced operations
  onDuplicate,
  onToggleFeatured,
  onSchedule,
  onBulkOperations,
  onExport,
  // Analytics
  stats,
  getTrendingArticles,
  getTopPerformingArticles,
  getArticlesNeedingAttention,
  contentHealthScore
}) => {
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Handle article selection for bulk operations
  const handleSelectArticle = (articleId, selected) => {
    if (selected) {
      setSelectedArticles(prev => [...prev, articleId]);
    } else {
      setSelectedArticles(prev => prev.filter(id => id !== articleId));
    }
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedArticles(filteredArticles.map(article => article.id));
    } else {
      setSelectedArticles([]);
    }
  };

  const clearSelection = () => {
    setSelectedArticles([]);
  };

  // Enhanced handlers that include analytics
  const handleEditWithAnalytics = (article) => {
    // Could track edit events here for analytics
    onEdit(article);
  };

  const handleDeleteWithAnalytics = async (id) => {
    // Could track delete events here for analytics
    await onDelete(id);
    clearSelection();
  };

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

  return (
    <>
      {/* Header with enhanced controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading-bold uppercase">Articles Management</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-600">
                {filteredCount} of {totalArticles} articles
                {hasActiveFilters && (
                  <span className="ml-2 text-sm text-accent">
                    (filtered)
                  </span>
                )}
              </p>
              
              {/* Content health indicator */}
              {contentHealthScore && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">Health:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-12 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          contentHealthScore >= 80 ? 'bg-green-500' :
                          contentHealthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${contentHealthScore}%` }}
                      />
                    </div>
                    <span className="font-medium text-xs">{contentHealthScore}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View mode toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow' : ''}`}
                title="Table view"
              >
                <Icon name="List" size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                title="Grid view"
              >
                <Icon name="Grid" size={16} />
              </button>
            </div>

            {/* Export button */}
            <Button
              variant="outline"
              onClick={handleExportSelected}
              iconName="Download"
              size="sm"
            >
              Export
            </Button>

            {/* New article button */}
            <Button
              variant="default"
              onClick={onNewArticle}
              iconName="Plus"
              className="bg-accent hover:bg-accent/90"
            >
              New Article
            </Button>
          </div>
        </div>

        {/* Filter Summary */}
        {(hasActiveFilters || totalArticles > 0) && (
          <FilterSummary
            filters={filters}
            totalArticles={totalArticles}
            filteredCount={filteredCount}
            categories={categories}
            authors={authors}
            className="mb-4"
          />
        )}

        {/* Filters */}
        <ArticleFilters
          filters={filters}
          setFilters={setFilters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          categories={categories}
          authors={authors}
          onRefresh={onRefresh}
        />

        {/* Bulk Actions Bar */}
        {selectedArticles.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <BulkArticleActions
              selectedArticles={selectedArticles}
              userProfile={userProfile}
              onBulkStatusChange={handleBulkStatusChange}
              onBulkDelete={handleBulkDelete}
              className="flex items-center justify-between"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Articles Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            {/* Table header with select all */}
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Select all ({filteredArticles.length})
                </span>
              </label>
            </div>
            
            <ArticleTable
              articles={filteredArticles}
              userProfile={userProfile}
              onEdit={handleEditWithAnalytics}
              onDelete={handleDeleteWithAnalytics}
              onStatusChange={onStatusChange}
              onNewArticle={onNewArticle}
              // Enhanced operations
              onDuplicate={onDuplicate}
              onToggleFeatured={onToggleFeatured}
              onSchedule={onSchedule}
              // Selection
              selectedArticles={selectedArticles}
              onSelectArticle={handleSelectArticle}
              showSelection={true}
            />
          </div>
        ) : (
          // Grid view implementation would go here
          <div className="p-6">
            <div className="text-center text-gray-500">
              Grid view coming soon...
            </div>
          </div>
        )}
        
        {/* No Results State */}
        {filteredArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-8 px-4">
            <Icon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">
              No articles match your current filters
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="outline"
                onClick={clearFilters}
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
        )}

        {/* Empty State */}
        {articles.length === 0 && (
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
        )}
      </div>

      {/* Performance insights sidebar (if there are articles) */}
      {articles.length > 0 && getTopPerformingArticles && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top performing articles */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Performing</h4>
              <div className="space-y-2">
                {getTopPerformingArticles('views', 3).map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between text-sm">
                    <span className="truncate mr-2">{article.title}</span>
                    <span className="text-gray-500 flex items-center">
                      <Icon name="Eye" size={12} className="mr-1" />
                      {article.view_count || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles needing attention */}
            {getArticlesNeedingAttention().length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Needs Attention</h4>
                <div className="space-y-2">
                  {getArticlesNeedingAttention().slice(0, 3).map((issue, index) => (
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
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlesList;