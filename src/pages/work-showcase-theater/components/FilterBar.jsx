import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterBar = ({ 
  filters, 
  activeFilters, 
  onFilterChange, 
  onClearFilters, 
  searchQuery, 
  onSearchChange,
  sortBy,
  onSortChange 
}) => {
  const filterCategories = [
    {
      key: 'industry',
      label: 'Industry',
      icon: 'Building',
      options: filters?.industries
    },
    {
      key: 'serviceType',
      label: 'Service',
      icon: 'Zap',
      options: filters?.serviceTypes
    },
    {
      key: 'businessStage',
      label: 'Business Stage',
      icon: 'TrendingUp',
      options: filters?.businessStages
    }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'newest', label: 'Newest First' },
    { value: 'impact', label: 'Highest Impact' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const hasActiveFilters = Object.values(activeFilters)?.some(filters => filters?.length > 0) || searchQuery;

  return (
    <div className="bg-white border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" 
            />
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={18} className="text-text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e?.target?.value)}
              className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {sortOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-4 mb-4">
          {filterCategories?.map((category) => (
            <div key={category?.key} className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 text-sm font-medium text-text-secondary">
                <Icon name={category?.icon} size={16} />
                <span>{category?.label}:</span>
              </div>
              {category?.options?.map((option) => {
                const isActive = activeFilters?.[category?.key]?.includes(option);
                return (
                  <button
                    key={option}
                    onClick={() => onFilterChange(category?.key, option)}
                    className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-accent text-white' :'bg-muted text-text-secondary hover:bg-accent/10 hover:text-accent'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Active Filters and Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Filter" size={16} />
              <span>
                {Object.values(activeFilters)?.flat()?.length} filter{Object.values(activeFilters)?.flat()?.length !== 1 ? 's' : ''} active
                {searchQuery && ` • Searching for "${searchQuery}"`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-accent hover:text-accent/80"
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;