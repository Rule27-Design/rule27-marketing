// src/pages/admin/articles/Articles.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { 
  BulkActions,
  StatusBadge,
  EmptyState,
  ErrorState,
  ExportButton,
  SkeletonTable,
  SearchBar,
  QuickActions
} from '../../../components/admin';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';
import ArticleEditor from './ArticleEditor';
import { useArticles } from './hooks/useArticles';
import { useArticleEvents } from './hooks/useArticleEvents';
import { articleOperations } from './services/ArticleOperations';
import { useToast } from '../../../components/ui/Toast';
import { formatDate } from '../../../utils';

const Articles = () => {
  const { userProfile } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  const {
    articles,
    loading,
    error,
    filters,
    setFilters,
    selectedArticles,
    setSelectedArticles,
    pagination,
    changePage,
    changePageSize,
    refreshArticles,
    selectAll,
    deselectAll,
    toggleSelection
  } = useArticles({
    status: searchParams.get('status') || 'all'
  });

  const { subscribeToEvents } = useArticleEvents();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('article:updated', (article) => {
      refreshArticles();
    });

    return unsubscribe;
  }, []);

  // Fetch categories and authors for filters
  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .eq('type', 'article')
        .eq('is_active', true)
        .order('name');
      
      // Fetch authors
      const { data: authorsData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('role', ['admin', 'contributor'])
        .order('full_name');
      
      setCategories(categoriesData || []);
      setAuthors(authorsData || []);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value === 'all' ? null : value
    }));
  };

  // Bulk action configuration
  const bulkActionConfig = [
    {
      id: 'publish',
      label: 'Publish',
      icon: 'Send',
      variant: 'primary',
      requireConfirm: true
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: 'Archive',
      variant: 'ghost'
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'Download',
      variant: 'ghost'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      variant: 'ghost',
      className: 'text-red-600',
      requireConfirm: true
    }
  ];

  // Handle bulk actions
  const handleBulkAction = async (actionId, selectedIds) => {
    try {
      let result;
      
      switch (actionId) {
        case 'publish':
          result = await articleOperations.bulkPublish(selectedIds);
          if (result.success) {
            toast.success('Articles published', `${selectedIds.length} articles have been published`);
          }
          break;
          
        case 'archive':
          result = await articleOperations.bulkArchive(selectedIds);
          if (result.success) {
            toast.success('Articles archived', `${selectedIds.length} articles have been archived`);
          }
          break;
          
        case 'delete':
          result = await articleOperations.bulkDelete(selectedIds);
          if (result.success) {
            toast.success('Articles deleted', `${selectedIds.length} articles have been deleted`);
          }
          break;
          
        case 'export':
          result = await articleOperations.exportArticles(selectedIds);
          if (result.success) {
            toast.success('Export complete', 'Articles have been exported to CSV');
          }
          break;
      }

      if (result && !result.success) {
        toast.error('Action failed', result.error);
      } else {
        setSelectedArticles([]);
        await refreshArticles();
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Action failed', error.message);
    }
  };

  // Quick actions configuration
  const quickActionsConfig = [
    {
      id: 'new',
      label: 'New Article',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => {
        setEditingArticle(null);
        setShowEditor(true);
      }
    }
  ];

  // Loading state
  if (loading && articles.length === 0) {
    return <SkeletonTable rows={10} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load articles"
        message={error}
        onRetry={refreshArticles}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading-bold uppercase tracking-wider">Articles</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage and publish your content
          </p>
        </div>
        <QuickActions actions={quickActionsConfig} />
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <SearchBar
          placeholder="Search articles..."
          onSearch={(value) => setFilters({ ...filters, search: value })}
          debounceMs={300}
        />
        
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>

          {/* Author Filter */}
          <select
            value={filters.author || 'all'}
            onChange={(e) => handleFilterChange('author', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Authors</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.full_name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Featured Filter */}
          <select
            value={filters.featured || 'all'}
            onChange={(e) => handleFilterChange('featured', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Articles</option>
            <option value="featured">Featured Only</option>
            <option value="not-featured">Not Featured</option>
          </select>

          {/* Clear Filters */}
          {Object.keys(filters).some(key => filters[key] && filters[key] !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
              className="text-gray-500"
            >
              <Icon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <BulkActions
          selectedItems={selectedArticles}
          actions={bulkActionConfig}
          onAction={handleBulkAction}
          position="top"
        />
      )}

      {/* Articles Table */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        {articles.length === 0 && !loading ? (
          <EmptyState
            icon="FileText"
            title="No articles found"
            message="Create your first article to get started"
            action={{
              label: 'Create Article',
              onClick: () => {
                setEditingArticle(null);
                setShowEditor(true);
              }
            }}
          />
        ) : (
          <div className="overflow-x-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      checked={selectedArticles.length === articles.length && articles.length > 0}
                      onChange={(checked) => checked ? selectAll() : deselectAll()}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="w-36 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                  <th className="w-28 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                  <th className="w-24 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    onClick={() => {
                      setEditingArticle(article);
                      setShowEditor(true);
                    }}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleSelection(article.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {article.featured_image && (
                          <img
                            src={article.featured_image}
                            alt=""
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">
                            {article.title}
                            {article.is_featured && (
                              <Icon name="Star" size={12} className="inline ml-1 text-yellow-500" />
                            )}
                          </div>
                          {article.excerpt && (
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {article.excerpt}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={article.status} size="xs" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {article.author?.full_name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {article.category?.name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Icon name="Eye" size={12} />
                          {article.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Heart" size={12} />
                          {article.like_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Share2" size={12} />
                          {article.share_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(article.updated_at, 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setEditingArticle(article);
                            setShowEditor(true);
                          }}
                        >
                          <Icon name="Edit2" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={async () => {
                            if (window.confirm('Delete this article?')) {
                              const result = await articleOperations.delete(article.id);
                              if (result.success) {
                                toast.success('Article deleted');
                                refreshArticles();
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {articles.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} articles
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => changePage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Export Button */}
      {articles.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ExportButton
            data={articles}
            filename="articles"
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'status', label: 'Status' },
              { key: 'author.full_name', label: 'Author' },
              { key: 'category.name', label: 'Category' },
              { key: 'view_count', label: 'Views' },
              { key: 'created_at', label: 'Created' }
            ]}
          />
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <ArticleEditor
          article={editingArticle}
          userProfile={userProfile}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingArticle(null);
          }}
          onSave={() => {
            refreshArticles();
            setShowEditor(false);
            setEditingArticle(null);
          }}
        />
      )}
    </div>
  );
};

export default Articles;