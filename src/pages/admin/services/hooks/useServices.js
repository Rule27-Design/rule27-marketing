// src/pages/admin/services/hooks/useServices.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';

export const useServices = (initialFilters = {}) => {
  const [services, setServices] = useState([]);
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

  // Fetch services with filters
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          pricing_tiers,
          process_steps,
          features,
          faqs,
          related_services
        `, { count: 'exact' });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.featured === 'featured') {
        query = query.eq('is_featured', true);
      } else if (filters.featured === 'popular') {
        query = query.eq('is_popular', true);
      }

      if (filters.search) {
        query = query.or(`
          name.ilike.%${filters.search}%,
          short_description.ilike.%${filters.search}%
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

      setServices(data || []);
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message);
      toast.error('Failed to load services', err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize, toast]);

  // Initial fetch
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Refresh services
  const refreshServices = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  // Change page
  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  return {
    services,
    loading,
    error,
    filters,
    setFilters,
    selectedItems,
    setSelectedItems,
    pagination,
    changePage,
    refreshServices
  };
};