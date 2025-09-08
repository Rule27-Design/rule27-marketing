// src/pages/admin/articles/components/ArticlesToolbar.jsx - Enhanced toolbar with performance features
import React, { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Icon from '../../../../components/AdminIcon';
import { cn } from '../../../../utils/cn';

const ArticlesToolbar = ({
  // Filter props
  filters,
  updateFilter,
  setFilters,
  clearFilters,
  hasActiveFilters,
  categories = [],
  authors = [],
  
  // View controls
  viewMode,
  onViewModeChange,
  sortConfig,
  onSort,
  
  // Stats
  totalArticles,
  filteredCount,
  contentHealthScore,
  
  // Actions
  onNewArticle,
  onRefresh,
  onExport,
  
  // Selection
  selectedCount = 0,
  onClearSelection,
  
  // Performance
  isVirtualized,
  onToggleVirtualization
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Debounced search to improve performance
  const debouncedSearch = useDebounce(filters.search, 300);
  
  // Memoize filter options to prevent recreation
  const filterOptions = useMemo(() => ({
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'draft', label: 'Draft' },
      { value: 'pending_approval', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ],
    categories: [
      { value: 'all', label: 'All Categories' },
      ...categories.map(cat => ({ value: cat.id, label: cat.name }))
    ],
    authors: [
      { value: 'all', label: 'All Authors' },
      ...authors.map(author => ({ value: author.id, label: author.full_name }))
    ],
    featured: [
      { value: 'all', label: 'All Articles' },
      { value: 'featured', label: 'Featured' },
      { value: 'not_featured', label: 'Not Featured' }
    ]
  }), [categories, authors]);

  // Handle filter changes with performance optimization
  const handleFilterChange = useCallback((key, value) => {
    updateFilter(key, value);
  }, [updateFilter]);

  // Handle search with debouncing
  const handleSearchChange = useCallback((value) => {
    handleFilterChange('search', value);
  }, [handleFilterChange]);

  // Advanced filter handlers
  const handleDateRangeFilter = useCallback((field, value) => {
    handleFilterChange(field, value);
  }, [handleFilterChange]);

  // Quick filter shortcuts
  const quickFilters = useMemo(() => [
    {
      id: 'needs-review',
      label: 'Needs Review',
      icon: 'Clock',
      count: 0, // This would come from props
      action: () => handleFilterChange('status', 'pending_approval')
    },
    {
      id: 'published-today',
      label: 'Published Today',
      icon: 'Globe',
      count: 0,
      action: () => {
        const today = new Date().toISOString().split('T')[0];
        handleFilterChange('publishedAfter', today);
        handleFilterChange('status', 'published');
      }
    },
    {
      id: 'drafts',
      label: 'My Drafts',
      icon: 'FileText',
      count: 0,
      action: () => handleFilterChange('status', 'draft')
    },
    {
      id: 'featured',
      label: 'Featured',
      icon: 'Star',
      count: 0,
      action: () => handleFilterChange('featured', 'featured')
    }
  ], [handleFilterChange]);

  // View mode options
  const viewModes = [
    { id: 'table', label: 'Table', icon: 'List' },
    { id: 'grid', label: 'Grid', icon: 'Grid3X3' },
    { id: 'virtual', label: 'Virtual', icon: 'Layers' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-heading-bold uppercase">Articles Management</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-600">
                {filteredCount} of {totalArticles} articles
                {hasActiveFilters && (
                  <span className="ml-2 text-sm text-accent">(filtered)</span>
                )}
              </p>
              
              {/* Content health indicator */}
              {contentHealthScore && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500">Health:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-12 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300',
                          contentHealthScore >= 80 ? 'bg-green-500' :
                          contentHealthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                        style={{ width: `${contentHealthScore}%` }}
                      />
                    </div>
                    <span className="font-medium text-xs">{contentHealthScore}%</span>
                  </div>
                </div>
              )}

              {/* Selection indicator */}
              {selectedCount > 0 && (
                <div className="flex items-center space-x-2 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  <Icon name="CheckCircle" size={14} />
                  <span>{selectedCount} selected</span>
                  <button
                    onClick={onClearSelection}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Performance indicator */}
          {isVirtualized && (
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              <Icon name="Zap" size={14} />
              <span>Virtualized</span>
            </div>
          )}

          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onViewModeChange(mode.id)}
                className={cn(
                  'p-1.5 rounded text-sm font-medium transition-colors',
                  viewMode === mode.id 
                    ? 'bg-white shadow text-accent' 
                    : 'text-gray-600 hover:text-gray-900'
                )}
                title={mode.label}
              >
                <Icon name={mode.icon} size={16} />
              </button>
            ))}
          </div>

          {/* Performance toggle */}
          {totalArticles > 50 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleVirtualization}
              iconName={isVirtualized ? "Layers" : "Zap"}
              className={cn(
                isVirtualized 
                  ? "border-green-300 text-green-700 bg-green-50" 
                  : "border-gray-300"
              )}
              title={isVirtualized ? "Disable virtualization" : "Enable virtualization"}
            >
              {isVirtualized ? "Virtual" : "Boost"}
            </Button>
          )}

          {/* Export button */}
          <Button
            variant="outline"
            onClick={onExport}
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

      {/* Quick Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-sm text-gray-500 whitespace-nowrap">Quick filters:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={filter.action}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors whitespace-nowrap"
          >
            <Icon name={filter.icon} size={12} />
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Enhanced Search Input */}
        <div className="relative">
          <Input
            placeholder="Search articles..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "pl-10 transition-all duration-200",
              searchFocused && "ring-2 ring-accent"
            )}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon 
              name="Search" 
              size={16} 
              className={cn(
                "transition-colors",
                searchFocused ? "text-accent" : "text-gray-400"
              )} 
            />
          </div>
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
        
        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          options={filterOptions.status}
        />

        {/* Category Filter */}
        <Select
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
          options={filterOptions.categories}
        />

        {/* Author Filter */}
        <Select
          value={filters.author}
          onChange={(value) => handleFilterChange('author', value)}
          options={filterOptions.authors}
        />

        {/* Featured Filter */}
        <Select
          value={filters.featured}
          onChange={(value) => handleFilterChange('featured', value)}
          options={filterOptions.featured}
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            iconName="RefreshCw"
            className="flex-1"
            title="Refresh articles"
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            iconName={showAdvancedFilters ? "ChevronUp" : "ChevronDown"}
            size="icon"
            title="Advanced filters"
            className={cn(
              showAdvancedFilters && "bg-accent text-white"
            )}
          />
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              iconName="X"
              size="icon"
              title="Clear all filters"
              className="text-gray-500 hover:text-gray-700"
            />
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Filters */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Created After
              </label>
              <Input
                type="date"
                value={filters.createdAfter || ''}
                onChange={(e) => handleDateRangeFilter('createdAfter', e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Created Before
              </label>
              <Input
                type="date"
                value={filters.createdBefore || ''}
                onChange={(e) => handleDateRangeFilter('createdBefore', e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Word Count Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Min Word Count
              </label>
              <Input
                type="number"
                value={filters.minWordCount || ''}
                onChange={(e) => handleFilterChange('minWordCount', e.target.value)}
                placeholder="0"
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Word Count
              </label>
              <Input
                type="number"
                value={filters.maxWordCount || ''}
                onChange={(e) => handleFilterChange('maxWordCount', e.target.value)}
                placeholder="∞"
                className="text-sm"
              />
            </div>
          </div>

          {/* Additional Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Select
              label="Has Featured Image"
              value={filters.hasFeaturedImage || 'all'}
              onChange={(value) => handleFilterChange('hasFeaturedImage', value)}
              options={[
                { value: 'all', label: 'All Articles' },
                { value: 'with_image', label: 'With Image' },
                { value: 'without_image', label: 'Without Image' }
              ]}
            />

            <Select
              label="Comments Enabled"
              value={filters.hasComments || 'all'}
              onChange={(value) => handleFilterChange('hasComments', value)}
              options={[
                { value: 'all', label: 'All Articles' },
                { value: 'enabled', label: 'Comments Enabled' },
                { value: 'disabled', label: 'Comments Disabled' }
              ]}
            />

            <Select
              label="Sort By"
              value={filters.sortBy || 'updated_at'}
              onChange={(value) => handleFilterChange('sortBy', value)}
              options={[
                { value: 'updated_at', label: 'Last Updated' },
                { value: 'created_at', label: 'Date Created' },
                { value: 'title', label: 'Title A-Z' },
                { value: 'view_count', label: 'Most Viewed' },
                { value: 'like_count', label: 'Most Liked' }
              ]}
            />
          </div>
        </div>
      )}

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-blue-900">
                Showing {filteredCount} of {totalArticles} articles
              </div>
              <div className="text-xs text-blue-700 mt-1">
                Active filters: {Object.entries(filters)
                  .filter(([key, value]) => value && value !== 'all' && value !== '')
                  .map(([key]) => key)
                  .join(', ')}
              </div>
            </div>
            <div className="text-xs text-blue-600">
              {totalArticles > 0 ? Math.round((filteredCount / totalArticles) * 100) : 0}% of total
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesToolbar;