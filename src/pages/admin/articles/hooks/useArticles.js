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

  // Fetch articles with filters and pagination
  const fetchArticles = useCallback(async () => {
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

      // Fetch related data
      if (articlesData && articlesData.length > 0) {
        const authorIds = [...new Set(articlesData.map(a => a.author_id).filter(Boolean))];
        const categoryIds = [...new Set(articlesData.map(a => a.category_id).filter(Boolean))];
        const coAuthorIds = [...new Set(articlesData.flatMap(a => a.co_authors || []))];
        const allAuthorIds = [...new Set([...authorIds, ...coAuthorIds])];

        const [profilesResponse, categoriesResponse] = await Promise.all([
          allAuthorIds.length > 0 
            ? supabase.from('profiles').select('id, full_name, avatar_url').in('id', allAuthorIds)
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
          category: categories.find(c => c.id === article.category_id) || null,
          co_authors_data: article.co_authors 
            ? article.co_authors.map(id => profiles.find(p => p.id === id)).filter(Boolean)
            : []
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