import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterBar = React.memo(({ 
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

  const filterCategories = useMemo(() => [
    {
      key: 'industry',
      label: 'Industry',
      icon: 'Building',
      options: filters?.industries || []
    },
    {
      key: 'serviceType',
      label: 'Service',
      icon: 'Zap',
      options: filters?.serviceTypes || []
    },
    {
      key: 'businessStage',
      label: 'Business Stage',
      icon: 'TrendingUp',
      options: filters?.businessStages || []
    }
  ], [filters]);

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'newest', label: 'Newest First' },
    { value: 'impact', label: 'Highest Impact' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const hasActiveFilters = useMemo(() => 
    Object.values(activeFilters)?.some(filters => filters?.length > 0) || searchQuery,
  [activeFilters, searchQuery]);
  
  const activeFilterCount = useMemo(() => 
    Object.values(activeFilters)?.flat()?.length,
  [activeFilters]);

  return (
    <div className="bg-white border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex flex-col gap-3">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search - Helvetica for Input */}
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
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm md:text-base font-sans"
              />
            </div>

            {/* Mobile: Filter Toggle & Sort */}
            <div className="flex gap-2">
              {/* Mobile Filter Toggle - Steelfish */}
              <Button
                variant="outline"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden flex items-center gap-2 flex-1 font-heading-regular tracking-wider uppercase"
                iconName="Filter"
                iconPosition="left"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full font-heading-regular">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown - Fixed to hide native arrow */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <Icon name="ArrowUpDown" size={18} className="text-text-secondary hidden sm:block" />
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e?.target?.value)}
                    className="appearance-none w-full sm:w-auto border border-border rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm md:text-base bg-white font-sans cursor-pointer"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none'
                    }}
                  >
                    {sortOptions?.map((option) => (
                      <option key={option?.value} value={option?.value}>
                        {option?.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom arrow icon */}
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Filter Categories - Steelfish for Labels */}
          <div className="hidden md:flex flex-wrap gap-4">
            {filterCategories?.map((category) => (
              <div key={category?.key} className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-1 text-sm font-heading-regular text-text-secondary tracking-wider uppercase">
                  <Icon name={category?.icon} size={16} />
                  <span>{category?.label}:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category?.options?.map((option) => {
                    const isActive = activeFilters?.[category?.key]?.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => onFilterChange(category?.key, option)}
                        className={`px-3 py-1 text-sm rounded-full transition-all duration-300 font-sans ${
                          isActive
                            ? 'bg-accent text-white' 
                            : 'bg-muted text-text-secondary hover:bg-accent/10 hover:text-accent'
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

          {/* Mobile Filter Panel */}
          {mobileFiltersOpen && (
            <div className="md:hidden bg-gray-50 rounded-lg p-3 space-y-3 max-h-64 overflow-y-auto">
              {filterCategories?.map((category) => (
                <div key={category?.key}>
                  <div className="flex items-center space-x-1 text-xs font-heading-regular text-text-secondary mb-1.5 tracking-wider uppercase">
                    <Icon name={category?.icon} size={14} />
                    <span>{category?.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {category?.options?.map((option) => {
                      const isActive = activeFilters?.[category?.key]?.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => onFilterChange(category?.key, option)}
                          className={`px-2 py-1 text-[11px] rounded-full transition-all duration-300 font-sans ${
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

          {/* Active Filters and Clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-text-secondary">
                <Icon name="Filter" size={14} className="md:w-4 md:h-4" />
                <span className="font-sans">
                  <span className="font-heading-regular tracking-wider">{activeFilterCount}</span> filter{activeFilterCount !== 1 ? 's' : ''}
                  {searchQuery && ` • "${searchQuery}"`}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-accent hover:text-accent/80 text-xs md:text-sm font-heading-regular tracking-wider uppercase"
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
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;