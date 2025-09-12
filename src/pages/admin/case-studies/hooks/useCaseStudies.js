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
      // Build query with all fields from the new schema
      let query = supabase
        .from('case_studies')
        .select(`
          id,
          title,
          slug,
          client_name,
          client_logo,
          client_website,
          client_industry,
          client_company_size,
          service_type,
          service_category,
          project_duration,
          project_start_date,
          project_end_date,
          project_investment,
          hero_image,
          hero_image_alt,
          hero_video,
          gallery_images,
          challenge,
          solution,
          implementation_process,
          key_metrics,
          results_summary,
          results_narrative,
          process_steps,
          technologies_used,
          deliverables,
          team_members,
          team_size,
          project_lead,
          testimonial_id,
          status,
          approved_by,
          approved_at,
          is_featured,
          is_confidential,
          is_active,
          sort_order,
          view_count,
          unique_view_count,
          inquiry_count,
          average_time_on_page,
          meta_title,
          meta_description,
          meta_keywords,
          og_title,
          og_description,
          og_image,
          schema_markup,
          internal_notes,
          created_at,
          updated_at,
          created_by,
          updated_by,
          word_count,
          read_time,
          published_at,
          scheduled_at,
          cache_key,
          last_cached_at,
          language,
          translations,
          ab_test_variant,
          performance_score,
          seo_score,
          ai_tags,
          ai_summary,
          predicted_performance,
          related_case_studies,
          custom_fields,
          version
        `, { count: 'exact' });

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
        query = query.or(`title.ilike.%${filters.search}%,client_name.ilike.%${filters.search}%,results_summary.ilike.%${filters.search}%`);
      }

      // Additional filters for new fields
      if (filters.language) {
        query = query.eq('language', filters.language);
      }

      if (filters.confidential === 'confidential') {
        query = query.eq('is_confidential', true);
      } else if (filters.confidential === 'public') {
        query = query.eq('is_confidential', false);
      }

      if (filters.hasTestimonial === 'yes') {
        query = query.not('testimonial_id', 'is', null);
      } else if (filters.hasTestimonial === 'no') {
        query = query.is('testimonial_id', null);
      }

      // Date range filters
      if (filters.dateFrom) {
        query = query.gte('project_start_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('project_end_date', filters.dateTo);
      }

      // Performance score filter
      if (filters.minPerformanceScore) {
        query = query.gte('performance_score', filters.minPerformanceScore);
      }

      // Sorting with multiple options
      const sortBy = filters.sortBy || 'updated_at';
      const sortOrder = filters.sortOrder || 'desc';
      
      // Handle special sort cases
      if (sortBy === 'performance') {
        query = query.order('performance_score', { ascending: sortOrder === 'asc' })
                     .order('seo_score', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'engagement') {
        query = query.order('view_count', { ascending: sortOrder === 'asc' })
                     .order('inquiry_count', { ascending: sortOrder === 'asc' });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Always add a secondary sort for consistency
      if (sortBy !== 'created_at') {
        query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to);

      const { data: caseStudiesData, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      // Process the data to ensure all JSON fields are properly parsed
      const processedData = (caseStudiesData || []).map(cs => ({
        ...cs,
        // Ensure JSON fields are objects, not strings
        key_metrics: typeof cs.key_metrics === 'string' 
          ? JSON.parse(cs.key_metrics) 
          : cs.key_metrics || [],
        gallery_images: typeof cs.gallery_images === 'string' 
          ? JSON.parse(cs.gallery_images) 
          : cs.gallery_images || [],
        process_steps: typeof cs.process_steps === 'string' 
          ? JSON.parse(cs.process_steps) 
          : cs.process_steps || [],
        team_members: typeof cs.team_members === 'string' 
          ? JSON.parse(cs.team_members) 
          : cs.team_members || [],
        custom_fields: typeof cs.custom_fields === 'string' 
          ? JSON.parse(cs.custom_fields) 
          : cs.custom_fields || {},
        translations: typeof cs.translations === 'string' 
          ? JSON.parse(cs.translations) 
          : cs.translations || {},
      }));

      setCaseStudies(processedData);

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
  }, [
    filters.status, 
    filters.industry, 
    filters.serviceType, 
    filters.featured, 
    filters.search,
    filters.language,
    filters.confidential,
    filters.hasTestimonial,
    filters.dateFrom,
    filters.dateTo,
    filters.minPerformanceScore,
    filters.sortBy, 
    filters.sortOrder, 
    pagination.page, 
    pagination.pageSize, 
    toast
  ]);

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

  // Get unique values for filters
  const getFilterOptions = useCallback(() => {
    const industries = [...new Set(caseStudies
      .map(cs => cs.client_industry)
      .filter(Boolean))];
    
    const serviceTypes = [...new Set(caseStudies
      .map(cs => cs.service_type)
      .filter(Boolean))];
    
    const languages = [...new Set(caseStudies
      .map(cs => cs.language)
      .filter(Boolean))];

    return {
      industries: industries.sort(),
      serviceTypes: serviceTypes.sort(),
      languages: languages.sort()
    };
  }, [caseStudies]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const total = caseStudies.length;
    const published = caseStudies.filter(cs => cs.status === 'published').length;
    const featured = caseStudies.filter(cs => cs.is_featured).length;
    const scheduled = caseStudies.filter(cs => cs.status === 'scheduled').length;
    const totalViews = caseStudies.reduce((sum, cs) => sum + (cs.view_count || 0), 0);
    const totalInquiries = caseStudies.reduce((sum, cs) => sum + (cs.inquiry_count || 0), 0);
    const avgPerformanceScore = total > 0 
      ? Math.round(caseStudies.reduce((sum, cs) => sum + (cs.performance_score || 0), 0) / total)
      : 0;
    const avgSeoScore = total > 0
      ? Math.round(caseStudies.reduce((sum, cs) => sum + (cs.seo_score || 0), 0) / total)
      : 0;

    return {
      total,
      published,
      featured,
      scheduled,
      totalViews,
      totalInquiries,
      avgPerformanceScore,
      avgSeoScore
    };
  }, [caseStudies]);

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
    toggleSelection,
    getFilterOptions,
    getStatistics
  };
};