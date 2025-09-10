// src/components/admin/SearchBar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Input from '../ui/Input';
import Icon from '../AdminIcon';
import { cn } from '../../utils/cn';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  defaultValue = '',
  debounceMs = 300,
  showResults = false,
  results = [],
  onResultClick,
  className = '',
  size = 'md',
  showClear = true,
  showShortcut = true
}) => {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  
  // Properly destructure the useDebounce return value
  const [debouncedSearchValue, { isDebouncing }] = useDebounce(searchValue, debounceMs);

  useEffect(() => {
    // FIX: Add safety check for onSearch
    if (debouncedSearchValue !== undefined && typeof onSearch === 'function') {
      onSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue, onSearch]);

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    if (!showShortcut) return;

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('admin-search')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcut]);

  const handleClear = () => {
    setSearchValue('');
    // FIX: Add safety check for onSearch
    if (typeof onSearch === 'function') {
      onSearch('');
    }
  };

  const sizeClasses = {
    sm: {
      container: 'h-8',
      input: 'text-sm pl-8 pr-8',
      icon: 14
    },
    md: {
      container: 'h-10',
      input: 'text-base pl-10 pr-10',
      icon: 16
    },
    lg: {
      container: 'h-12',
      input: 'text-lg pl-12 pr-12',
      icon: 20
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Icon
          name="Search"
          size={sizes.icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        
        <Input
          id="admin-search"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className={cn(sizes.input, sizes.container)}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isDebouncing && (
            <Icon 
              name="Loader" 
              size={sizes.icon} 
              className="animate-spin text-gray-400"
            />
          )}
          
          {showClear && searchValue && !isDebouncing && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={sizes.icon} />
            </button>
          )}
          
          {showShortcut && !searchValue && !isDebouncing && (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
              <span>⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && isFocused && results && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((result, index) => (
            <button
              key={result.id || index}
              onClick={() => {
                // FIX: Add safety check for onResultClick
                if (typeof onResultClick === 'function') {
                  onResultClick(result);
                }
                setIsFocused(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                {result.icon && (
                  <Icon name={result.icon} size={16} className="text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {result.title}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-gray-600 truncate">
                      {result.subtitle}
                    </div>
                  )}
                </div>
                {result.badge && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {result.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;