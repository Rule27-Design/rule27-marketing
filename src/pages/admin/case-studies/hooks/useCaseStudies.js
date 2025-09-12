// src/pages/admin/case-studies/hooks/useCaseStudies.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';

export const useCaseStudies = (initialFilters = {}) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState([]);
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

  // Fetch case studies with filters and pagination
  const fetchCaseStudies = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Build query
      let query = supabase
        .from('case_studies')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.industry && filters.industry !== 'all') {
        query = query.eq('client_industry', filters.industry);
      }

      if (filters.serviceType && filters.serviceType !== 'all') {
        query = query.eq('service_type', filters.serviceType);
      }

      if (filters.featured === 'featured') {
        query = query.eq('is_featured', true);
      } else if (filters.featured === 'not-featured') {
        query = query.eq('is_featured', false);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'updated_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data: caseStudiesData, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      setCaseStudies(caseStudiesData || []);

      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching case studies:', err);
      if (isMountedRef.current) {
        setError(err.message);
        if (!err.message.includes('Failed to fetch')) {
          toast.error('Failed to load case studies', err.message);
        }
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters.status, filters.industry, filters.serviceType, filters.featured, filters.search, 
      filters.sortBy, filters.sortOrder, pagination.page, pagination.pageSize, toast]);

  // Single useEffect for initial load and updates
  useEffect(() => {
    isMountedRef.current = true;
    fetchCaseStudies();
    
    return () => {
      isMountedRef.current = false;
      isFetchingRef.current = false;
    };
  }, [fetchCaseStudies]);

  // Refresh case studies manually
  const refreshCaseStudies = useCallback(() => {
    if (!isFetchingRef.current && isMountedRef.current) {
      return fetchCaseStudies();
    }
  }, [fetchCaseStudies]);

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
    setSelectedCaseStudies(caseStudies.map(cs => cs.id));
  }, [caseStudies]);

  const deselectAll = useCallback(() => {
    setSelectedCaseStudies([]);
  }, []);

  const toggleSelection = useCallback((caseStudyId) => {
    setSelectedCaseStudies(prev => {
      if (prev.includes(caseStudyId)) {
        return prev.filter(id => id !== caseStudyId);
      }
      return [...prev, caseStudyId];
    });
  }, []);

  return {
    caseStudies,
    loading,
    error,
    filters,
    setFilters,
    selectedCaseStudies,
    setSelectedCaseStudies,
    pagination,
    changePage,
    changePageSize,
    refreshCaseStudies,
    selectAll,
    deselectAll,
    toggleSelection
  };
};