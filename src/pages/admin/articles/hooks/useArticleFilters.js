// src/pages/admin/articles/hooks/useArticleFilters.js - Filter state management (50 lines)
import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useArticleFilters = (articles = []) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    status: searchParams.get('filter') || 'all',
    search: '',
    category: 'all',
    author: 'all',
    featured: 'all'
  });

  // Filter articles based on current filter state
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Status filter
      if (filters.status !== 'all' && article.status !== filters.status) {
        return false;
      }
      
      // Category filter
      if (filters.category !== 'all' && article.category_id !== filters.category) {
        return false;
      }
      
      // Author filter
      if (filters.author !== 'all' && article.author_id !== filters.author) {
        return false;
      }
      
      // Featured filter
      if (filters.featured !== 'all') {
        const isFeatured = article.is_featured ? 'featured' : 'not_featured';
        if (isFeatured !== filters.featured) {
          return false;
        }
      }
      
      // Search filter
      if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [articles, filters]);

  // Update a specific filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      search: '',
      category: 'all',
      author: 'all',
      featured: 'all'
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.status !== 'all' || 
           filters.search !== '' ||
           filters.category !== 'all' ||
           filters.author !== 'all' ||
           filters.featured !== 'all';
  }, [filters]);

  return {
    filters,
    filteredArticles,
    updateFilter,
    setFilters,
    clearFilters,
    hasActiveFilters
  };
};