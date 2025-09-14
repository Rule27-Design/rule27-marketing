// src/pages/admin/profiles/hooks/useProfiles.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/ui/Toast';

export const useProfiles = (initialFilters = {}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tab: 'all',
    ...initialFilters
  });
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const toast = useToast();
  
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Fetch profiles with filters and pagination
  const fetchProfiles = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply tab filters
      if (filters.tab === 'team') {
        query = query.eq('is_public', true);
      } else if (filters.tab === 'users') {
        query = query.not('auth_user_id', 'is', null);
      }

      // Apply other filters
      if (filters.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      if (filters.department && filters.department !== 'all') {
        query = query.contains('department', [filters.department]);
      }

      if (filters.status) {
        if (filters.status === 'active') {
          query = query.eq('is_active', true);
        } else if (filters.status === 'inactive') {
          query = query.eq('is_active', false);
        }
      }

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,job_title.ilike.%${filters.search}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'full_name';
      const sortOrder = filters.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data: profilesData, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      if (!isMountedRef.current) return;

      setProfiles(profilesData || []);

      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / prev.pageSize)
      }));
    } catch (err) {
      console.error('Error fetching profiles:', err);
      if (isMountedRef.current) {
        setError(err.message);
        if (!err.message.includes('Failed to fetch')) {
          toast.error('Failed to load profiles', err.message);
        }
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [
    filters.tab,
    filters.role,
    filters.department,
    filters.status,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
    pagination.page,
    pagination.pageSize,
    toast
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!isFetchingRef.current) {
      fetchProfiles();
    }
    
    return () => {
      isMountedRef.current = false;
      isFetchingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMountedRef.current && !isFetchingRef.current) {
      fetchProfiles();
    }
  }, [
    filters.tab,
    filters.role,
    filters.department,
    filters.status,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
    pagination.page,
    pagination.pageSize
  ]);

  // Refresh profiles manually
  const refreshProfiles = useCallback(() => {
    if (!isFetchingRef.current && isMountedRef.current) {
      return fetchProfiles();
    }
  }, [fetchProfiles]);

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
    setSelectedProfiles(profiles.map(p => p.id));
  }, [profiles]);

  const deselectAll = useCallback(() => {
    setSelectedProfiles([]);
  }, []);

  const toggleSelection = useCallback((profileId) => {
    setSelectedProfiles(prev => {
      if (prev.includes(profileId)) {
        return prev.filter(id => id !== profileId);
      }
      return [...prev, profileId];
    });
  }, []);

  // Get statistics
  const getStatistics = useCallback(() => {
    const total = profiles.length;
    const withLogin = profiles.filter(p => p.auth_user_id).length;
    const publicProfiles = profiles.filter(p => p.is_public).length;
    const admins = profiles.filter(p => p.role === 'admin').length;
    const active = profiles.filter(p => p.is_active).length;

    return {
      total,
      withLogin,
      public: publicProfiles,
      admins,
      active
    };
  }, [profiles]);

  return {
    profiles,
    loading,
    error,
    filters,
    setFilters,
    selectedProfiles,
    setSelectedProfiles,
    pagination,
    changePage,
    changePageSize,
    refreshProfiles,
    selectAll,
    deselectAll,
    toggleSelection,
    getStatistics
  };
};