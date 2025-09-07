// src/pages/admin/articles/ArticlesList.jsx - Table & List View Container (200 lines)
import React from 'react';
import Button from '../../../components/ui/Button';
import ArticleFilters from './ArticleFilters';
import ArticleTable from './ArticleTable';

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
  onEdit,
  onDelete,
  onStatusChange,
  onNewArticle,
  onRefresh,
  totalArticles = 0,
  filteredCount = 0
}) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading-bold uppercase">Articles Management</h1>
            <p className="text-gray-600 mt-1">
              {filteredCount} of {totalArticles} articles
              {hasActiveFilters && (
                <span className="ml-2 text-sm text-accent">
                  (filtered)
                </span>
              )}
            </p>
          </div>
          <Button
            variant="default"
            onClick={onNewArticle}
            iconName="Plus"
            className="bg-accent hover:bg-accent/90"
          >
            New Article
          </Button>
        </div>

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
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ArticleTable
          articles={filteredArticles}
          userProfile={userProfile}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onNewArticle={onNewArticle}
        />
        
        {/* No Results State */}
        {filteredArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500 mb-4">
              No articles match your current filters
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
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
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticlesList;