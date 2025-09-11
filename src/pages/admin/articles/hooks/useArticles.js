// src/pages/admin/articles/hooks/useArticles.js - Complete fixed version
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';

export const useArticles = (initialFilters = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const toast = useToast();
  
  // Use refs to prevent re-fetching
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Fetch articles with filters and pagination
  const fetchArticles = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Build query
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
      }

      if (filters.author && filters.author !== 'all') {
        query = query.eq('author_id', filters.author);
      }

      if (filters.featured === 'featured') {
        query = query.eq('is_featured', true);
      } else if (filters.featured === 'not-featured') {
        query = query.eq('is_featured', false);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'updated_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data: articlesData, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      // Fetch related data in batches to avoid too many requests
      if (articlesData && articlesData.length > 0) {
        const authorIds = [...new Set(articlesData.map(a => a.author_id).filter(Boolean))];
        const categoryIds = [...new Set(articlesData.map(a => a.category_id).filter(Boolean))];

        // Fetch in parallel but with limited connections
        const [profilesResponse, categoriesResponse] = await Promise.all([
          authorIds.length > 0 
            ? supabase.from('profiles').select('id, full_name, avatar_url').in('id', authorIds)
            : { data: [] },
          categoryIds.length > 0
            ? supabase.from('categories').select('id, name, slug').in('id', categoryIds)
            : { data: [] }
        ]);

        const profiles = profilesResponse.data || [];
        const categories = categoriesResponse.data || [];

        // Map related data
        const enrichedArticles = articlesData.map(article => ({
          ...article,
          author: profiles.find(p => p.id === article.author_id) || null,
          category: categories.find(c => c.id === article.category_id) || null
        }));

        setArticles(enrichedArticles);
      } else {
        setArticles([]);
      }

      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching articles:', err);
      if (isMountedRef.current) {
        setError(err.message);
        // Only show toast for non-network errors
        if (!err.message.includes('Failed to fetch')) {
          toast.error('Failed to load articles', err.message);
        }
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters, pagination.page, pagination.pageSize, toast]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchArticles();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array - only run on mount

  // Fetch when filters or pagination changes
  useEffect(() => {
    if (isMountedRef.current) {
      fetchArticles();
    }
  }, [filters, pagination.page, pagination.pageSize, fetchArticles]);

  // Refresh articles
  const refreshArticles = useCallback(() => {
    if (!isFetchingRef.current) {
      fetchArticles();
    }
  }, [fetchArticles]);

  // Change page
  const changePage = useCallback((page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  }, [pagination.totalPages]);

  // Change page size
  const changePageSize = useCallback((pageSize) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Selection methods
  const selectAll = useCallback(() => {
    setSelectedArticles(articles.map(a => a.id));
  }, [articles]);

  const deselectAll = useCallback(() => {
    setSelectedArticles([]);
  }, []);

  const toggleSelection = useCallback((articleId) => {
    setSelectedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      }
      return [...prev, articleId];
    });
  }, []);

  // Return all the methods and state
  return {
    articles,
    loading,
    error,
    filters,
    setFilters,
    selectedArticles,
    setSelectedArticles,
    pagination,
    changePage,       // This was missing
    changePageSize,   // This was missing
    refreshArticles,
    selectAll,        // This was missing
    deselectAll,      // This was missing
    toggleSelection   // This was missing
  };
};