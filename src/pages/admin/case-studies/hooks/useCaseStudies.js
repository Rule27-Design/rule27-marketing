// src/pages/admin/case-studies/hooks/useCaseStudies.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';

export const useCaseStudies = (initialFilters = {}) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedItems, setSelectedItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const toast = useToast();

  // Fetch case studies with filters
  const fetchCaseStudies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('case_studies')
        .select(`
          *,
          team_members,
          key_metrics,
          gallery,
          technologies_used,
          deliverables,
          testimonial:testimonials(id, client_name, client_title, client_company, quote, rating)
        `, { count: 'exact' });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('industry', filters.industry);
      }

      if (filters.service_type && filters.service_type !== 'all') {
        query = query.eq('service_type', filters.service_type);
      }

      if (filters.featured === 'featured') {
        query = query.eq('is_featured', true);
      } else if (filters.featured === 'not-featured') {
        query = query.eq('is_featured', false);
      }

      if (filters.search) {
        query = query.or(`
          title.ilike.%${filters.search}%,
          client_name.ilike.%${filters.search}%,
          description.ilike.%${filters.search}%
        `);
      }

      // Pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      // Default ordering
      query = query
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false });

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setCaseStudies(data || []);
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching case studies:', err);
      setError(err.message);
      toast.error('Failed to load case studies', err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize, toast]);

  // Initial fetch
  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  // Refresh case studies
  const refreshCaseStudies = useCallback(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  // Change page
  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  return {
    caseStudies,
    loading,
    error,
    filters,
    setFilters,
    selectedItems,
    setSelectedItems,
    pagination,
    changePage,
    refreshCaseStudies
  };
};