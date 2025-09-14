// src/pages/admin/services/hooks/useServices.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';

export const useServices = (initialFilters = {}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedServices, setSelectedServices] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const toast = useToast();
  
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Fetch services with filters and pagination
  const fetchServices = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          zone:service_zones!zone_id(
            id,
            slug,
            title,
            icon
          )
        `, { count: 'exact' });

      // Apply filters
      if (filters.zone && filters.zone !== 'all') {
        query = query.eq('zone_id', filters.zone);
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.status) {
        if (filters.status === 'active') {
          query = query.eq('is_active', true);
        } else if (filters.status === 'inactive') {
          query = query.eq('is_active', false);
        } else if (filters.status === 'featured') {
          query = query.eq('is_featured', true);
        }
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'updated_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data: servicesData, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      if (!isMountedRef.current) return;

      // Process the data
      const processedData = (servicesData || []).map(service => ({
        ...service,
        pricing_tiers: typeof service.pricing_tiers === 'string' 
          ? JSON.parse(service.pricing_tiers) 
          : service.pricing_tiers || [],
        process_steps: typeof service.process_steps === 'string' 
          ? JSON.parse(service.process_steps) 
          : service.process_steps || [],
        expected_results: typeof service.expected_results === 'string' 
          ? JSON.parse(service.expected_results) 
          : service.expected_results || []
      }));

      setServices(processedData);

      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching services:', err);
      if (isMountedRef.current) {
        setError(err.message);
        if (!err.message.includes('Failed to fetch')) {
          toast.error('Failed to load services', err.message);
        }
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters, pagination.page, pagination.pageSize, toast]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchServices();
    
    return () => {
      isMountedRef.current = false;
      isFetchingRef.current = false;
    };
  }, [fetchServices]);

  // Refresh services manually
  const refreshServices = useCallback(() => {
    if (!isFetchingRef.current && isMountedRef.current) {
      return fetchServices();
    }
  }, [fetchServices]);

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
    setSelectedServices(services.map(s => s.id));
  }, [services]);

  const deselectAll = useCallback(() => {
    setSelectedServices([]);
  }, []);

  const toggleSelection = useCallback((serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  }, []);

  return {
    services,
    loading,
    error,
    filters,
    setFilters,
    selectedServices,
    setSelectedServices,
    pagination,
    changePage,
    changePageSize,
    refreshServices,
    selectAll,
    deselectAll,
    toggleSelection
  };
};