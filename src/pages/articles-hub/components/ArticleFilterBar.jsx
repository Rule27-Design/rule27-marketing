import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArticleFilterBar = ({ 
  filters, 
  activeFilters, 
  onFilterChange, 
  onClearFilters, 
  searchQuery, 
  onSearchChange,
  sortBy,
  onSortChange 
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterCategories = [
    {
      key: 'category',
      label: 'Category',
      icon: 'Folder',
      options: filters?.categories
    },
    {
      key: 'topic',
      label: 'Topics',
      icon: 'Tag',
      options: filters?.topics
    },
    {
      key: 'readTime',
      label: 'Read Time',
      icon: 'Clock',
      options: filters?.readTimes
    }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'readTime', label: 'Quick Reads' }
  ];

  const hasActiveFilters = Object.values(activeFilters)?.some(filters => filters?.length > 0) || searchQuery;
  const activeFilterCount = Object.values(activeFilters)?.flat()?.length;

  return (
    <div className="bg-white border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        {/* Mobile Filter Toggle & Search Row */}
        <div className="flex flex-col gap-3">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" 
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm md:text-base"
              />
            </div>

            {/* Mobile: Filter Toggle & Sort */}
            <div className="flex gap-2">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden flex items-center gap-2 flex-1"
                iconName="Filter"
                iconPosition="left"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <Icon name="ArrowUpDown" size={18} className="text-text-secondary hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e?.target?.value)}
                  className="w-full sm:w-auto border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm md:text-base"
                >
                  {sortOptions?.map((option) => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Filter Categories */}
          <div className="hidden md:flex flex-wrap gap-4">
            {filterCategories?.map((category) => (
              <div key={category?.key} className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-1 text-sm font-medium text-text-secondary">
                  <Icon name={category?.icon} size={16} />
                  <span>{category?.label}:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category?.options?.slice(0, category?.key === 'topic' ? 5 : undefined)?.map((option) => {
                    const isActive = activeFilters?.[category?.key]?.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => onFilterChange(category?.key, option)}
                        className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-accent text-white' 
                            : 'bg-muted text-text-secondary hover:bg-accent/10 hover:text-accent'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                  {category?.key === 'topic' && category?.options?.length > 5 && (
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="px-3 py-1 text-sm rounded-full bg-muted text-text-secondary hover:bg-accent/10 hover:text-accent transition-all duration-300"
                    >
                      +{category?.options?.length - 5} more
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Filter Panel */}
          {mobileFiltersOpen && (
            <div className="md:hidden bg-gray-50 rounded-lg p-4 space-y-4">
              {filterCategories?.map((category) => (
                <div key={category?.key}>
                  <div className="flex items-center space-x-1 text-sm font-medium text-text-secondary mb-2">
                    <Icon name={category?.icon} size={16} />
                    <span>{category?.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category?.options?.map((option) => {
                      const isActive = activeFilters?.[category?.key]?.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => onFilterChange(category?.key, option)}
                          className={`px-3 py-1.5 text-xs rounded-full transition-all duration-300 ${
                            isActive
                              ? 'bg-accent text-white' 
                              : 'bg-white border border-border text-text-secondary hover:bg-accent/10 hover:text-accent'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Filters and Clear - Mobile Responsive */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-text-secondary">
                <Icon name="Filter" size={14} className="md:w-4 md:h-4" />
                <span>
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                  {searchQuery && ` • "${searchQuery}"`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-accent hover:text-accent/80 text-xs md:text-sm"
                iconName="X"
                iconPosition="left"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleFilterBar;