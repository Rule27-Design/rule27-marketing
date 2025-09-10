// src/components/admin/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';

const FilterBar = ({
  filters = [],
  onFilterChange,
  onReset,
  className = '',
  showSearch = true,
  searchPlaceholder = 'Search...',
  compact = false
}) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(!compact);

  useEffect(() => {
    const initialFilters = {};
    filters.forEach(filter => {
      if (filter && filter.id) { // FIX: Added safety check
        initialFilters[filter.id] = filter.defaultValue || '';
      }
    });
    setActiveFilters(initialFilters);
  }, [filters]);

  const handleFilterChange = (filterId, value) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    onFilterChange({ ...activeFilters, search: value });
  };

  const handleReset = () => {
    const resetFilters = {};
    filters.forEach(filter => {
      if (filter && filter.id) { // FIX: Added safety check
        resetFilters[filter.id] = filter.defaultValue || '';
      }
    });
    setActiveFilters(resetFilters);
    setSearchValue('');
    onReset && onReset();
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value && value !== 'all') || searchValue;

  return (
    <div className={cn('bg-white border rounded-lg', className)}>
      {compact && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={16} />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
        </button>
      )}

      <div className={cn(
        'transition-all duration-200',
        compact && !isExpanded && 'hidden'
      )}>
        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            {showSearch && (
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={16} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    type="text"
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {filters && filters.map((filter) => {
              if (!filter || !filter.id) return null; // FIX: Added safety check
              
              return (
                <div key={filter.id} className="min-w-[150px]">
                  <Select
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  >
                    <option value="">{filter.placeholder || `All ${filter.label}`}</option>
                    {filter.options && filter.options.map((option) => ( // FIX: Added safety check
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              );
            })}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="whitespace-nowrap"
              >
                <Icon name="X" size={14} />
                Clear filters
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value || value === 'all') return null;
                const filter = filters.find(f => f && f.id === key); // FIX: Added safety check
                if (!filter) return null; // FIX: Added safety check
                const option = filter.options && filter.options.find(o => o.value === value); // FIX: Added safety check
                
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded-full"
                  >
                    <span className="text-gray-600">{filter.label}:</span>
                    <span className="font-medium">{option?.label || value}</span>
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-1 hover:text-red-600"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                );
              })}
              {searchValue && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded-full">
                  <span className="text-gray-600">Search:</span>
                  <span className="font-medium">{searchValue}</span>
                  <button
                    onClick={() => handleSearchChange('')}
                    className="ml-1 hover:text-red-600"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;