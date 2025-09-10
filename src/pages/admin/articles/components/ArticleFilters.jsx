// src/pages/admin/articles/ArticleFilters.jsx - Search & Filter Controls (150 lines)
import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AdminIcon';

const ArticleFilters = ({
  filters,
  setFilters,
  updateFilter,
  clearFilters,
  hasActiveFilters,
  categories = [],
  authors = [],
  onRefresh,
  className = ''
}) => {

  const handleFilterChange = (key, value) => {
    updateFilter(key, value);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-6 gap-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Input
          placeholder="Search articles..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon name="Search" size={16} className="text-gray-400" />
        </div>
      </div>
      
      {/* Status Filter */}
      <Select
        value={filters.status}
        onChange={(value) => handleFilterChange('status', value)}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'draft', label: 'Draft' },
          { value: 'pending_approval', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'published', label: 'Published' },
          { value: 'archived', label: 'Archived' }
        ]}
      />

      {/* Category Filter */}
      <Select
        value={filters.category}
        onChange={(value) => handleFilterChange('category', value)}
        options={[
          { value: 'all', label: 'All Categories' },
          ...categories.map(cat => ({ value: cat.id, label: cat.name }))
        ]}
      />

      {/* Author Filter */}
      <Select
        value={filters.author}
        onChange={(value) => handleFilterChange('author', value)}
        options={[
          { value: 'all', label: 'All Authors' },
          ...authors.map(author => ({ value: author.id, label: author.full_name }))
        ]}
      />

      {/* Featured Filter */}
      <Select
        value={filters.featured}
        onChange={(value) => handleFilterChange('featured', value)}
        options={[
          { value: 'all', label: 'All Articles' },
          { value: 'featured', label: 'Featured' },
          { value: 'not_featured', label: 'Not Featured' }
        ]}
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
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            iconName="X"
            size="icon"
            title="Clear all filters"
            className="text-gray-500 hover:text-gray-700"
          />
        )}
      </div>
    </div>
  );
};

// Advanced Filters Component (can be toggled on/off)
export const AdvancedArticleFilters = ({
  filters,
  updateFilter,
  showAdvanced,
  onToggleAdvanced
}) => {
  
  if (!showAdvanced) {
    return (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAdvanced}
          iconName="Filter"
          className="text-gray-500 hover:text-gray-700"
        >
          Advanced Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAdvanced}
          iconName="ChevronUp"
          className="text-gray-500 hover:text-gray-700"
        >
          Hide
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Created After</label>
          <Input
            type="date"
            value={filters.createdAfter || ''}
            onChange={(e) => updateFilter('createdAfter', e.target.value)}
            className="text-sm"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Created Before</label>
          <Input
            type="date"
            value={filters.createdBefore || ''}
            onChange={(e) => updateFilter('createdBefore', e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Word Count Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Min Word Count</label>
          <Input
            type="number"
            value={filters.minWordCount || ''}
            onChange={(e) => updateFilter('minWordCount', e.target.value)}
            placeholder="0"
            className="text-sm"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Max Word Count</label>
          <Input
            type="number"
            value={filters.maxWordCount || ''}
            onChange={(e) => updateFilter('maxWordCount', e.target.value)}
            placeholder="∞"
            className="text-sm"
          />
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Select
          label="Has Featured Image"
          value={filters.hasFeaturedImage || 'all'}
          onChange={(value) => updateFilter('hasFeaturedImage', value)}
          options={[
            { value: 'all', label: 'All Articles' },
            { value: 'with_image', label: 'With Image' },
            { value: 'without_image', label: 'Without Image' }
          ]}
        />

        <Select
          label="Has Comments"
          value={filters.hasComments || 'all'}
          onChange={(value) => updateFilter('hasComments', value)}
          options={[
            { value: 'all', label: 'All Articles' },
            { value: 'enabled', label: 'Comments Enabled' },
            { value: 'disabled', label: 'Comments Disabled' }
          ]}
        />

        <Select
          label="Sort By"
          value={filters.sortBy || 'updated_at'}
          onChange={(value) => updateFilter('sortBy', value)}
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
  );
};

// Filter Summary Component
export const FilterSummary = ({ 
  filters, 
  totalArticles, 
  filteredCount,
  categories,
  authors 
}) => {
  const getActiveFiltersText = () => {
    const activeFilters = [];
    
    if (filters.search) {
      activeFilters.push(`search: "${filters.search}"`);
    }
    if (filters.status !== 'all') {
      activeFilters.push(`status: ${filters.status}`);
    }
    if (filters.category !== 'all') {
      const category = categories.find(c => c.id === filters.category);
      activeFilters.push(`category: ${category?.name || filters.category}`);
    }
    if (filters.author !== 'all') {
      const author = authors.find(a => a.id === filters.author);
      activeFilters.push(`author: ${author?.full_name || filters.author}`);
    }
    if (filters.featured !== 'all') {
      activeFilters.push(`featured: ${filters.featured === 'featured' ? 'yes' : 'no'}`);
    }
    
    return activeFilters;
  };

  const activeFilters = getActiveFiltersText();
  
  if (activeFilters.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Showing all {totalArticles} articles
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-blue-900">
            Showing {filteredCount} of {totalArticles} articles
          </div>
          <div className="text-xs text-blue-700 mt-1">
            Filtered by: {activeFilters.join(', ')}
          </div>
        </div>
        <div className="text-xs text-blue-600">
          {Math.round((filteredCount / totalArticles) * 100)}% of total
        </div>
      </div>
    </div>
  );
};

export default ArticleFilters;