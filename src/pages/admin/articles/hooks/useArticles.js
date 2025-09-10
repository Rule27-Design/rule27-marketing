// src/pages/admin/articles/hooks/useArticles.js
import { useState, useEffect, useCallback } from 'react';
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

  // Fetch articles with filters
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('articles')
        .select(`
            *,
            author:profiles!articles_author_id_fkey(id, full_name, avatar_url),
            category:categories!articles_category_id_fkey(id, name, slug)
        `, { count: 'exact' });

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

      // Pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      // Default ordering
      query = query.order('updated_at', { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setArticles(data || []);
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err.message);
      toast.error('Failed to load articles', err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize, toast]);

  // Initial fetch
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Refresh articles
  const refreshArticles = useCallback(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Change page
  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Change page size
  const changePageSize = useCallback((pageSize) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Select/deselect articles
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

  return {
    articles,
    loading,
    error,
    filters,
    setFilters,
    selectedArticles,
    setSelectedArticles,
    pagination,
    changePage,
    changePageSize,
    refreshArticles,
    selectAll,
    deselectAll,
    toggleSelection
  };
};