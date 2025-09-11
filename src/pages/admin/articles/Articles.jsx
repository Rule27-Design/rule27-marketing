// src/pages/admin/articles/Articles.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { 
  FilterBar,
  BulkActions,
  StatusBadge,
  EmptyState,
  ErrorState,
  ExportButton,
  VirtualTable,
  SkeletonTable,
  MetricsDisplay,
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
      // Don't use toast inside subscription to avoid re-render issues
    });

    return unsubscribe;
  }, []); // Empty dependency array

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

  // Filter configuration with actual data
  const filterConfig = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: filters.status || 'all',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      value: filters.category || 'all',
      options: [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat.id, label: cat.name }))
      ]
    },
    {
      id: 'author',
      label: 'Author',
      type: 'select',
      value: filters.author || 'all',
      options: [
        { value: 'all', label: 'All Authors' },
        ...authors.map(author => ({ value: author.id, label: author.full_name }))
      ]
    },
    {
      id: 'featured',
      label: 'Featured',
      type: 'select',
      value: filters.featured || 'all',
      options: [
        { value: 'all', label: 'All Articles' },
        { value: 'featured', label: 'Featured Only' },
        { value: 'not-featured', label: 'Not Featured' }
      ]
    }
  ];

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

  // Table columns configuration with better spacing
  const tableColumns = [
    {
      key: 'select',
      label: '',
      render: (value, article) => (
        <Checkbox
          checked={selectedArticles.includes(article.id)}
          onChange={() => toggleSelection(article.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      width: '40px'
    },
    {
      key: 'title',
      label: 'Title',
      render: (value, article) => (
        <div className="min-w-0">
          <div className="flex items-start space-x-3">
            {article.featured_image && (
              <img
                src={article.featured_image}
                alt=""
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900">
                {article.title}
                {article.is_featured && (
                  <Icon name="Star" size={12} className="inline ml-1 text-yellow-500" />
                )}
              </div>
              {article.excerpt && (
                <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                  {article.excerpt}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      sortable: true,
      width: 'auto'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, article) => <StatusBadge status={article.status} size="xs" />,
      width: '110px',
      sortable: true
    },
    {
      key: 'author',
      label: 'Author',
      render: (value, article) => (
        <div className="text-sm text-gray-700">
          {article.author?.full_name || 'Unknown'}
        </div>
      ),
      width: '140px'
    },
    {
      key: 'category',
      label: 'Category',
      render: (value, article) => (
        <div className="text-sm text-gray-600">
          {article.category?.name || '-'}
        </div>
      ),
      width: '120px'
    },
    {
      key: 'metrics',
      label: 'Metrics',
      render: (value, article) => (
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <span className="flex items-center" title="Views">
            <Icon name="Eye" size={14} className="mr-1" />
            {article.view_count || 0}
          </span>
          <span className="flex items-center" title="Likes">
            <Icon name="Heart" size={14} className="mr-1" />
            {article.like_count || 0}
          </span>
          <span className="flex items-center" title="Shares">
            <Icon name="Share2" size={14} className="mr-1" />
            {article.share_count || 0}
          </span>
        </div>
      ),
      width: '150px'
    },
    {
      key: 'date',
      label: 'Modified',
      render: (value, article) => (
        <div className="text-xs text-gray-500">
          {formatDate(article.updated_at, 'MMM d, yyyy')}
        </div>
      ),
      width: '100px',
      sortable: true
    },
    {
      key: 'actions',
      label: '',
      render: (value, article) => (
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              setEditingArticle(article);
              setShowEditor(true);
            }}
            title="Edit"
          >
            <Icon name="Edit2" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this article?')) {
                const result = await articleOperations.delete(article.id);
                if (result.success) {
                  toast.success('Article deleted');
                  refreshArticles();
                }
              }
            }}
            title="Delete"
            className="text-red-500 hover:text-red-700"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      ),
      width: '80px'
    }
  ];

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

      {/* Single Search Bar */}
      <div className="mb-4 space-y-3">
        <SearchBar
          placeholder="Search articles..."
          onSearch={(value) => setFilters({ ...filters, search: value })}
          debounceMs={300}
        />
        
        {/* Filter Bar without internal search */}
        <FilterBar
          filters={filterConfig}
          onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
          onReset={() => setFilters({})}
          hideSearch={true}
        />
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

      {/* Articles Table or Empty State */}
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
          <VirtualTable
            data={articles}
            columns={tableColumns}
            rowHeight={80}
            visibleRows={10}
            onRowClick={(article) => {
              setEditingArticle(article);
              setShowEditor(true);
            }}
            selectedRows={selectedArticles}
            onSelectionChange={setSelectedArticles}
            sortable={true}
            onSort={(key, direction) => {
              setFilters({ ...filters, sortBy: key, sortOrder: direction });
            }}
            loading={loading}
          />
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