// src/pages/admin/articles/Articles.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
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
    refreshArticles
  } = useArticles({
    status: searchParams.get('status') || 'all'
  });

  const { subscribeToEvents } = useArticleEvents();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEvents('article:updated', (article) => {
      refreshArticles();
      toast.info('Article updated', `"${article.title}" has been updated`);
    });

    return unsubscribe;
  }, [subscribeToEvents, refreshArticles, toast]);

  // Filter configuration for FilterBar
  const filterConfig = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'all',
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
      defaultValue: 'all',
      async: true,
      loadOptions: async () => {
        // Load categories from database
        const { data } = await supabase
          .from('categories')
          .select('id, name')
          .eq('type', 'article');
        return [
          { value: 'all', label: 'All Categories' },
          ...data.map(cat => ({ value: cat.id, label: cat.name }))
        ];
      }
    },
    {
      id: 'featured',
      label: 'Featured',
      type: 'select',
      defaultValue: 'all',
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

  // Handle bulk actions from BulkActions component
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

  // Table columns configuration for VirtualTable
  const tableColumns = [
    {
      key: 'select',
      header: () => (
        <Checkbox
          checked={articles.length > 0 && selectedArticles.length === articles.length}
          onChange={(checked) => {
            setSelectedArticles(checked ? articles.map(a => a.id) : []);
          }}
        />
      ),
      cell: (article) => (
        <Checkbox
          checked={selectedArticles.includes(article.id)}
          onChange={(checked) => {
            setSelectedArticles(prev =>
              checked 
                ? [...prev, article.id]
                : prev.filter(id => id !== article.id)
            );
          }}
        />
      ),
      width: 40
    },
    {
      key: 'title',
      header: 'Title',
      cell: (article) => (
        <div className="flex items-center space-x-3">
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt=""
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium text-text-primary">
              {article.title}
              {article.is_featured && (
                <Icon name="Star" size={12} className="inline ml-1 text-yellow-500" />
              )}
            </div>
            {article.excerpt && (
              <div className="text-xs text-text-secondary line-clamp-1">
                {article.excerpt}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (article) => <StatusBadge status={article.status} size="xs" />,
      width: 120
    },
    {
      key: 'author',
      header: 'Author',
      cell: (article) => (
        <div className="text-sm">
          {article.author?.full_name || 'Unknown'}
        </div>
      ),
      width: 150
    },
    {
      key: 'category',
      header: 'Category',
      cell: (article) => (
        <div className="text-sm text-text-secondary">
          {article.category?.name || '-'}
        </div>
      ),
      width: 120
    },
    {
      key: 'metrics',
      header: 'Metrics',
      cell: (article) => (
        <MetricsDisplay
          metrics={[
            { value: article.view_count || 0, icon: 'Eye' },
            { value: article.like_count || 0, icon: 'Heart' },
            { value: article.share_count || 0, icon: 'Share2' }
          ]}
          compact
        />
      ),
      width: 150
    },
    {
      key: 'date',
      header: 'Modified',
      cell: (article) => (
        <div className="text-xs text-text-secondary">
          {formatDate(article.updated_at, 'MMM d, yyyy')}
        </div>
      ),
      width: 100
    },
    {
      key: 'actions',
      header: '',
      cell: (article) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setEditingArticle(article);
              setShowEditor(true);
            }}
            iconName="Edit2"
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this article?')) {
                const result = await articleOperations.delete(article.id);
                if (result.success) {
                  toast.success('Article deleted');
                  refreshArticles();
                }
              }
            }}
            iconName="Trash2"
            className="text-red-500"
          />
        </div>
      ),
      width: 100
    }
  ];

  // Quick actions for the header
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
          value={filters.search || ''}
          onChange={(value) => setFilters({ ...filters, search: value })}
          placeholder="Search articles..."
        />
        
        <FilterBar
          filters={filterConfig}
          onFilterChange={setFilters}
          onReset={() => setFilters({})}
        />
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedArticles}
        actions={bulkActionConfig}
        onAction={handleBulkAction}
        position="top"
      />

      {/* Articles Table or Empty State */}
      {articles.length === 0 ? (
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
          onRowClick={(article) => {
            setEditingArticle(article);
            setShowEditor(true);
          }}
          pagination={{
            ...pagination,
            onPageChange: changePage
          }}
        />
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