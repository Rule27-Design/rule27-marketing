// src/pages/admin/articles/ArticlesContainer.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FilterBar,
  SearchBar,
  BulkActions,
  StatusBadge,
  EmptyState,
  ErrorState,
  ExportButton,
  VirtualTable,
  SkeletonTable
} from '../../../components/admin';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';
import { formatDistanceToNow } from '../../../utils/dateUtils';
import { cn } from '../../../utils/cn';

const ArticlesContainer = ({
  articles = [],
  loading = false,
  error = null,
  filters = {},
  onFiltersChange,
  selectedArticles = [],
  onSelectionChange,
  onEdit,
  onBulkAction,
  userProfile
}) => {
  const [viewMode, setViewMode] = useState('table'); // table | grid
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });

  // Filter configuration
  const filterConfig = [
    {
      id: 'status',
      label: 'Status',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'pending_approval', label: 'Pending Approval' },
        { value: 'approved', label: 'Approved' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      id: 'category',
      label: 'Category',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Categories' },
        // These would be dynamically loaded
        { value: 'news', label: 'News' },
        { value: 'blog', label: 'Blog' },
        { value: 'tutorial', label: 'Tutorial' }
      ]
    },
    {
      id: 'author',
      label: 'Author',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Authors' },
        { value: 'me', label: 'My Articles' }
        // Add more authors dynamically
      ]
    },
    {
      id: 'featured',
      label: 'Featured',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Articles' },
        { value: 'featured', label: 'Featured Only' },
        { value: 'not-featured', label: 'Not Featured' }
      ]
    }
  ];

  // Apply filters and search
  const filteredArticles = useMemo(() => {
    let filtered = [...articles];

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(article => article.status === filters.status);
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(article => article.category_id === filters.category);
    }

    // Author filter
    if (filters.author === 'me') {
      filtered = filtered.filter(article => article.author_id === userProfile?.id);
    } else if (filters.author && filters.author !== 'all') {
      filtered = filtered.filter(article => article.author_id === filters.author);
    }

    // Featured filter
    if (filters.featured === 'featured') {
      filtered = filtered.filter(article => article.is_featured);
    } else if (filters.featured === 'not-featured') {
      filtered = filtered.filter(article => !article.is_featured);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(searchLower) ||
        article.excerpt?.toLowerCase().includes(searchLower) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [articles, filters, sortConfig, userProfile]);

  // Handle functions
  const handleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredArticles.map(a => a.id));
    }
  };

  const handleSelectArticle = (articleId) => {
    if (selectedArticles.includes(articleId)) {
      onSelectionChange(selectedArticles.filter(id => id !== articleId));
    } else {
      onSelectionChange([...selectedArticles, articleId]);
    }
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleQuickAction = async (action, article) => {
    switch (action) {
      case 'edit':
        onEdit(article);
        break;
      case 'preview':
        window.open(`/blog/${article.slug}`, '_blank');
        break;
      case 'duplicate':
        await onBulkAction('duplicate', [article.id]);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this article?')) {
          await onBulkAction('delete', [article.id]);
        }
        break;
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value, article) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{value}</span>
            {article.is_featured && (
              <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
            )}
          </div>
          {article.excerpt && (
            <p className="text-sm text-gray-600 truncate max-w-md">
              {article.excerpt}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '150',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'author',
      label: 'Author',
      sortable: true,
      width: '200',
      render: (value, article) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {article.author?.avatar_url ? (
              <img 
                src={article.author.avatar_url} 
                alt={article.author.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Icon name="User" size={16} className="text-gray-600" />
            )}
          </div>
          <span className="text-sm">
            {article.author?.full_name || 'Unknown'}
          </span>
        </div>
      )
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      width: '100',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value?.toLocaleString() || 0}
        </span>
      )
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      sortable: true,
      width: '150',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? formatDistanceToNow(new Date(value), { addSuffix: true }) : 'Never'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      width: '100',
      render: (_, article) => (
        <div className="flex items-center gap-1">
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction('edit', article);
            }}
          >
            <Icon name="Edit" size={14} />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction('preview', article);
            }}
          >
            <Icon name="Eye" size={14} />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction('delete', article);
            }}
            className="text-red-600"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      )
    }
  ];

  // Loading state
  if (loading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to load articles"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Empty state
  if (articles.length === 0 && !filters.search) {
    return (
      <EmptyState
        icon="FileText"
        title="No articles yet"
        description="Create your first article to get started"
        action={{
          label: 'Create Article',
          icon: 'Plus',
          onClick: () => onEdit(null)
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <SearchBar
              placeholder="Search articles..."
              onSearch={(value) => onFiltersChange({ ...filters, search: value })}
              defaultValue={filters.search}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <Icon name="List" size={16} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Icon name="Grid" size={16} />
            </Button>
          </div>
          <ExportButton
            data={filteredArticles}
            filename="articles"
            formats={['csv', 'json']}
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <FilterBar
        filters={filterConfig}
        onFilterChange={onFiltersChange}
        onReset={() => onFiltersChange({})}
        compact={true}
      />

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <BulkActions
          selectedItems={selectedArticles}
          onAction={onBulkAction}
        />
      )}

      {/* Results count */}
      {filteredArticles.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>
      )}

      {/* Articles Display */}
      {viewMode === 'table' ? (
        <VirtualTable
          data={filteredArticles}
          columns={tableColumns}
          selectedRows={selectedArticles}
          onSelectionChange={onSelectionChange}
          onSort={handleSort}
          sortable={true}
          onRowClick={(article) => onEdit(article)}
          rowHeight={80}
          visibleRows={10}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isSelected={selectedArticles.includes(article.id)}
              onSelect={() => handleSelectArticle(article.id)}
              onEdit={() => onEdit(article)}
              onQuickAction={(action) => handleQuickAction(action, article)}
            />
          ))}
        </div>
      )}

      {/* No results */}
      {filteredArticles.length === 0 && filters.search && (
        <EmptyState
          icon="Search"
          title="No articles found"
          description={`No articles match "${filters.search}"`}
          action={{
            label: 'Clear search',
            onClick: () => onFiltersChange({ ...filters, search: '' })
          }}
        />
      )}
    </div>
  );
};

// Article Card Component for Grid View
const ArticleCard = ({ article, isSelected, onSelect, onEdit, onQuickAction }) => {
  return (
    <div className={cn(
      'bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all',
      isSelected && 'ring-2 ring-accent'
    )}>
      {/* Checkbox */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
          />
          <StatusBadge status={article.status} size="xs" />
        </div>
      </div>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="aspect-video bg-gray-100">
          <img
            src={article.featured_image}
            alt={article.featured_image_alt || article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {article.title}
          {article.is_featured && (
            <Icon name="Star" size={14} className="inline-block ml-2 text-yellow-500 fill-current" />
          )}
        </h3>
        
        {article.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{article.view_count || 0} views</span>
          <span>{formatDistanceToNow(new Date(article.updated_at), { addSuffix: true })}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="primary"
            onClick={onEdit}
            className="flex-1"
          >
            <Icon name="Edit" size={14} />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onQuickAction('preview')}
          >
            <Icon name="Eye" size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onQuickAction('delete')}
            className="text-red-600"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesContainer;