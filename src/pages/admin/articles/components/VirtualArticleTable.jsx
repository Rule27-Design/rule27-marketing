// src/pages/admin/articles/components/VirtualArticleTable.jsx - High-performance virtualized table
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import Icon from '../../../../components/AdminIcon';
import Button from '../../../../components/ui/Button';
import { ArticleStatusBadge } from './ArticleStatusBadge';
import { ArticleActions } from './ArticleActions';
import { cn } from '../../../../utils/cn';

const VirtualArticleTable = ({
  virtualItems = [],
  totalSize = 0,
  articles = [],
  userProfile,
  selectedArticles = [],
  onSelectArticle,
  onSelectAll,
  onEdit,
  onDelete,
  onStatusChange,
  onDuplicate,
  onToggleFeatured,
  sortConfig,
  onSort,
  containerRef,
  itemHeight = 72
}) => {
  const tableRef = useRef(null);
  const headerRef = useRef(null);

  // Memoized handlers to prevent unnecessary re-renders
  const handleEdit = useCallback((article) => {
    onEdit(article);
  }, [onEdit]);

  const handleDelete = useCallback((id) => {
    onDelete(id);
  }, [onDelete]);

  const handleStatusChange = useCallback((id, status) => {
    onStatusChange(id, status);
  }, [onStatusChange]);

  const handleSelectArticle = useCallback((articleId, selected) => {
    onSelectArticle?.(articleId, selected);
  }, [onSelectArticle]);

  const handleSelectAll = useCallback((selected) => {
    onSelectAll?.(selected);
  }, [onSelectAll]);

  // Calculate selection state
  const selectionState = useMemo(() => {
    const totalItems = articles.length;
    const selectedCount = selectedArticles.length;
    
    return {
      isAllSelected: selectedCount === totalItems && totalItems > 0,
      isPartialSelected: selectedCount > 0 && selectedCount < totalItems,
      selectedCount,
      totalItems
    };
  }, [selectedArticles.length, articles.length]);

  // Memoized table header component
  const TableHeader = useMemo(() => (
    <div 
      ref={headerRef}
      className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200"
      style={{ height: `${itemHeight}px` }}
    >
      <div className="flex items-center h-full px-4">
        {/* Selection Column */}
        <div className="w-12 flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectionState.isAllSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = selectionState.isPartialSelected;
              }
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="rounded border-gray-300 text-accent focus:ring-accent"
            aria-label={`Select all ${selectionState.totalItems} articles`}
          />
        </div>

        {/* Article Column */}
        <div className="flex-1 px-3">
          <SortableHeader
            field="title"
            label="Article"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </div>

        {/* Author Column */}
        <div className="w-32 px-3">
          <SortableHeader
            field="author"
            label="Author"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </div>

        {/* Category Column */}
        <div className="w-24 px-3">
          <SortableHeader
            field="category"
            label="Category"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </div>

        {/* Status Column */}
        <div className="w-20 px-3">
          <SortableHeader
            field="status"
            label="Status"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </div>

        {/* Stats Column */}
        <div className="w-24 px-3 text-center">
          <SortableHeader
            field="view_count"
            label="Stats"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </div>

        {/* Updated Column */}
        <div className="w-20 px-3">
          <SortableHeader
            field="updated_at"
            label="Updated"
            sortConfig={sortConfig}
            onSort={onSort}
          />
        </div>

        {/* Actions Column */}
        <div className="w-32 px-3 text-right">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </span>
        </div>
      </div>
    </div>
  ), [
    itemHeight,
    selectionState,
    handleSelectAll,
    sortConfig,
    onSort
  ]);

  // Virtual row renderer
  const renderVirtualRow = useCallback(({ index, start, item: article, size }) => {
    const isSelected = selectedArticles.includes(article.id);
    
    return (
      <VirtualArticleRow
        key={`${article.id}-${article.updated_at}`}
        article={article}
        index={index}
        style={{
          position: 'absolute',
          top: start,
          left: 0,
          right: 0,
          height: size
        }}
        userProfile={userProfile}
        isSelected={isSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onSelect={handleSelectArticle}
        onDuplicate={onDuplicate}
        onToggleFeatured={onToggleFeatured}
      />
    );
  }, [
    selectedArticles,
    userProfile,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleSelectArticle,
    onDuplicate,
    onToggleFeatured
  ]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!tableRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          // Navigate to next row
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Navigate to previous row
          break;
        case ' ':
          e.preventDefault();
          // Toggle selection
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSelectAll(true);
          }
          break;
        case 'Escape':
          // Clear selection
          if (selectedArticles.length > 0) {
            handleSelectAll(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticles.length, handleSelectAll]);

  return (
    <div 
      ref={tableRef}
      className="virtual-table w-full h-full relative overflow-auto"
      role="table"
      aria-label="Articles table"
      aria-rowcount={articles.length + 1} // +1 for header
    >
      {/* Fixed Header */}
      {TableHeader}

      {/* Virtual Content Container */}
      <div 
        className="relative"
        style={{ height: totalSize }}
        role="rowgroup"
      >
        {/* Virtual Rows */}
        {virtualItems.map(renderVirtualRow)}
      </div>

      {/* Performance indicators */}
      {process.env.NODE_ENV === 'development' && (
        <VirtualTableDebugInfo
          virtualItems={virtualItems}
          totalItems={articles.length}
          totalSize={totalSize}
          selectedCount={selectedArticles.length}
        />
      )}
    </div>
  );
};

// Memoized sortable header component
const SortableHeader = React.memo(({ field, label, sortConfig, onSort }) => {
  const isActive = sortConfig.field === field;
  const direction = isActive ? sortConfig.direction : null;

  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
    >
      <span>{label}</span>
      <div className="flex flex-col">
        <Icon 
          name="ChevronUp" 
          size={10} 
          className={cn(
            'transition-colors',
            isActive && direction === 'asc' ? 'text-accent' : 'text-gray-300'
          )}
        />
        <Icon 
          name="ChevronDown" 
          size={10} 
          className={cn(
            'transition-colors -mt-1',
            isActive && direction === 'desc' ? 'text-accent' : 'text-gray-300'
          )}
        />
      </div>
    </button>
  );
});

SortableHeader.displayName = "SortableHeader";

// Optimized virtual row component
const VirtualArticleRow = React.memo(({ 
  article, 
  index,
  style,
  userProfile, 
  isSelected,
  onEdit, 
  onDelete, 
  onStatusChange,
  onSelect,
  onDuplicate,
  onToggleFeatured
}) => {
  
  const handleEdit = useCallback(() => {
    onEdit(article);
  }, [onEdit, article]);

  const handleDelete = useCallback(() => {
    onDelete(article.id);
  }, [onDelete, article.id]);

  const handleStatusChange = useCallback((newStatus) => {
    onStatusChange(article.id, newStatus);
  }, [onStatusChange, article.id]);

  const handleSelect = useCallback((e) => {
    onSelect?.(article.id, e.target.checked);
  }, [onSelect, article.id]);

  return (
    <div 
      style={style}
      className={cn(
        'flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors px-4',
        isSelected && 'bg-blue-50 border-blue-200'
      )}
      role="row"
      aria-rowindex={index + 2} // +2 because header is row 1, and we're 0-indexed
      aria-selected={isSelected}
    >
      {/* Selection Column */}
      <div className="w-12 flex items-center justify-center" role="gridcell">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="rounded border-gray-300 text-accent focus:ring-accent"
          aria-label={`Select ${article.title}`}
        />
      </div>

      {/* Article Column */}
      <div className="flex-1 px-3 min-w-0" role="gridcell">
        <ArticleInfo article={article} />
      </div>

      {/* Author Column */}
      <div className="w-32 px-3" role="gridcell">
        <AuthorInfo author={article.author} />
      </div>

      {/* Category Column */}
      <div className="w-24 px-3" role="gridcell">
        <CategoryInfo category={article.category} />
      </div>

      {/* Status Column */}
      <div className="w-20 px-3" role="gridcell">
        <ArticleStatusBadge status={article.status} size="xs" />
      </div>

      {/* Stats Column */}
      <div className="w-24 px-3 text-center" role="gridcell">
        <ArticleStats article={article} />
      </div>

      {/* Updated Column */}
      <div className="w-20 px-3 text-xs text-gray-600" role="gridcell">
        <UpdatedDate date={article.updated_at} />
      </div>

      {/* Actions Column */}
      <div className="w-32 px-3 text-right" role="gridcell">
        <ArticleActions
          article={article}
          userProfile={userProfile}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onDuplicate={onDuplicate}
          onToggleFeatured={onToggleFeatured}
          variant="compact"
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  const prevArticle = prevProps.article;
  const nextArticle = nextProps.article;
  
  return (
    prevArticle.id === nextArticle.id &&
    prevArticle.updated_at === nextArticle.updated_at &&
    prevArticle.status === nextArticle.status &&
    prevArticle.is_featured === nextArticle.is_featured &&
    prevArticle.view_count === nextArticle.view_count &&
    prevArticle.like_count === nextArticle.like_count &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.userProfile?.id === nextProps.userProfile?.id
  );
});

VirtualArticleRow.displayName = "VirtualArticleRow";

// Reusable cell components (memoized for performance)
const ArticleInfo = React.memo(({ article }) => (
  <div className="flex items-start space-x-3">
    {article.featured_image && (
      <img 
        src={article.featured_image} 
        alt=""
        className="w-12 h-9 object-cover rounded flex-shrink-0"
        loading="lazy"
      />
    )}
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 text-sm leading-5 line-clamp-1">
        {article.title}
      </p>
      {article.excerpt && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {article.excerpt}
        </p>
      )}
      <div className="flex items-center space-x-2 mt-1">
        {article.is_featured && (
          <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <Icon name="Star" size={8} className="mr-1" />
            Featured
          </span>
        )}
        {article.read_time && (
          <span className="text-xs text-gray-400 flex items-center">
            <Icon name="Clock" size={8} className="mr-1" />
            {article.read_time}min
          </span>
        )}
      </div>
    </div>
  </div>
));

ArticleInfo.displayName = "ArticleInfo";

const AuthorInfo = React.memo(({ author }) => (
  <div className="flex items-center space-x-2">
    {author?.avatar_url ? (
      <img 
        src={author.avatar_url} 
        alt=""
        className="w-5 h-5 rounded-full flex-shrink-0"
        loading="lazy"
      />
    ) : (
      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <Icon name="User" size={10} className="text-gray-500" />
      </div>
    )}
    <span className="text-xs text-gray-600 font-medium block truncate">
      {author?.full_name || 'Unknown'}
    </span>
  </div>
));

AuthorInfo.displayName = "AuthorInfo";

const CategoryInfo = React.memo(({ category }) => (
  <div className="flex items-center space-x-1">
    {category?.name ? (
      <>
        <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
        <span className="text-xs text-gray-600 truncate block">
          {category.name}
        </span>
      </>
    ) : (
      <span className="text-xs text-gray-400 italic">None</span>
    )}
  </div>
));

CategoryInfo.displayName = "CategoryInfo";

const ArticleStats = React.memo(({ article }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
      <span className="flex items-center" title="Views">
        <Icon name="Eye" size={8} className="mr-1" />
        {formatNumber(article.view_count || 0)}
      </span>
    </div>
    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
      <span className="flex items-center" title="Likes">
        <Icon name="Heart" size={8} className="mr-1" />
        {formatNumber(article.like_count || 0)}
      </span>
    </div>
  </div>
));

ArticleStats.displayName = "ArticleStats";

const UpdatedDate = React.memo(({ date }) => {
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }, []);

  const formattedDate = useMemo(() => formatDate(date), [date, formatDate]);

  return (
    <div title={new Date(date).toLocaleString()}>
      {formattedDate}
    </div>
  );
});

UpdatedDate.displayName = "UpdatedDate";

// Debug component for development
const VirtualTableDebugInfo = ({ virtualItems, totalItems, totalSize, selectedCount }) => (
  <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
    <div>Virtual Items: {virtualItems.length}</div>
    <div>Total Items: {totalItems}</div>
    <div>Total Size: {totalSize}px</div>
    <div>Selected: {selectedCount}</div>
    <div>Memory Usage: {Math.round((virtualItems.length / totalItems) * 100)}%</div>
  </div>
);

// Utility function
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export default VirtualArticleTable;