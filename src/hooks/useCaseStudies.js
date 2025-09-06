import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCaseStudies = () => {
  const [data, setData] = useState({
    caseStudies: [],
    featuredCaseStudies: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      // Fetch all published case studies with testimonials
      const { data: studies, error } = await supabase
        .from('case_studies')
        .select(`
          *,
          testimonial:testimonials!testimonial_id(
            client_name,
            client_title,
            quote,
            rating,
            client_avatar
          )
        `)
        .eq('status', 'published')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match component structure
      const transformedStudies = studies?.map(study => ({
        id: study.id,
        title: study.title,
        slug: study.slug,
        client: study.client_name,
        clientLogo: study.client_logo,
        clientWebsite: study.client_website,
        industry: study.industry,
        serviceType: study.service_type,
        businessStage: study.business_stage,
        heroImage: study.hero_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        description: study.description,
        challenge: study.challenge,
        solution: study.solution,
        implementation: study.implementation,
        timeline: study.project_duration,
        duration: `${study.start_date ? new Date(study.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} - ${study.end_date ? new Date(study.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}`,
        featured: study.featured || study.is_featured,
        keyMetrics: study.key_metrics || [],
        detailedResults: study.detailed_results || [],
        processSteps: study.process_steps || [],
        technologiesUsed: study.technologies_used || [],
        deliverables: study.deliverables || [],
        teamMembers: study.team_members || [],
        projectLead: study.project_lead,
        testimonial: study.testimonial ? {
          name: study.testimonial.client_name,
          position: study.testimonial.client_title,
          quote: study.testimonial.quote,
          avatar: study.testimonial.client_avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          rating: study.testimonial.rating
        } : null,
        gallery: study.gallery?.map(item => 
          typeof item === 'string' ? item : item.url
        ) || [study.hero_image],
        viewCount: study.view_count || 0,
        conversionCount: study.conversion_count || 0,
        created_at: study.created_at,
        end_date: study.end_date
      }));

      // Separate featured studies
      const featured = transformedStudies.filter(study => study.featured);

      setData({
        caseStudies: transformedStudies,
        featuredCaseStudies: featured.length > 0 ? featured : transformedStudies.slice(0, 3),
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching case studies:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Get or create session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  // Track case study view
  const trackView = async (caseStudyId) => {
    try {
      // First, get the current counts
      const { data: currentData } = await supabase
        .from('case_studies')
        .select('view_count, unique_view_count')
        .eq('id', caseStudyId)
        .single();
      
      const sessionId = getSessionId();
      
      // Check if this session has already viewed this case study
      const { data: existingView } = await supabase
        .from('content_engagement')
        .select('id')
        .eq('content_type', 'case_study')
        .eq('content_id', caseStudyId)
        .eq('session_id', sessionId)
        .single();
      
      // Update counts
      await supabase
        .from('case_studies')
        .update({ 
          view_count: (currentData?.view_count || 0) + 1,
          unique_view_count: existingView ? (currentData?.unique_view_count || 0) : (currentData?.unique_view_count || 0) + 1
        })
        .eq('id', caseStudyId);

      // Track engagement if not already tracked
      if (!existingView) {
        await supabase
          .from('content_engagement')
          .insert({
            content_type: 'case_study',
            content_id: caseStudyId,
            action: 'view',
            session_id: sessionId,
            user_id: null
          });
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return {
    ...data,
    trackView,
    refetch: fetchCaseStudies
  };
};

// Hook for individual case study
export const useCaseStudy = (slug) => {
  const [data, setData] = useState({
    caseStudy: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (slug) {
      fetchCaseStudy(slug);
    }
  }, [slug]);

  const fetchCaseStudy = async (slug) => {
    try {
      const { data: study, error } = await supabase
        .from('case_studies')
        .select(`
          *,
          testimonial:testimonials!testimonial_id(*),
          project_lead:profiles!project_lead(full_name, job_title, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      // Transform the data to match component expectations
      const transformedStudy = study ? {
        id: study.id,
        title: study.title,
        slug: study.slug,
        client_name: study.client_name,
        client_logo: study.client_logo,
        client_website: study.client_website,
        industry: study.industry,
        service_type: study.service_type,
        business_stage: study.business_stage,
        hero_image: study.hero_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        description: study.description,
        challenge: study.challenge,
        solution: study.solution,
        implementation: study.implementation,
        project_duration: study.project_duration,
        start_date: study.start_date,
        end_date: study.end_date,
        featured: study.featured || study.is_featured,
        is_featured: study.is_featured,
        key_metrics: study.key_metrics || [],
        detailed_results: study.detailed_results || [],
        process_steps: study.process_steps || [],
        technologies_used: study.technologies_used || [],
        deliverables: study.deliverables || [],
        team_members: study.team_members || [],
        project_lead: study.project_lead,
        testimonial: study.testimonial,
        gallery: study.gallery || [],
        view_count: study.view_count || 0,
        conversion_count: study.conversion_count || 0
      } : null;

      setData({
        caseStudy: transformedStudy,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching case study:', error);
      setData({
        caseStudy: null,
        loading: false,
        error: error.message
      });
    }
  };

  return data;
};

// Hook for filter options
export const useCaseStudyFilters = () => {
  const [filters, setFilters] = useState({
    industries: [],
    serviceTypes: [],
    businessStages: [],
    loading: true
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const { data: studies } = await supabase
        .from('case_studies')
        .select('industry, service_type, business_stage')
        .eq('status', 'published')
        .eq('is_active', true);

      if (studies) {
        const industries = [...new Set(studies.map(s => s.industry).filter(Boolean))];
        const serviceTypes = [...new Set(studies.map(s => s.service_type).filter(Boolean))];
        const businessStages = [...new Set(studies.map(s => s.business_stage).filter(Boolean))];

        setFilters({
          industries,
          serviceTypes,
          businessStages,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
      setFilters(prev => ({ ...prev, loading: false }));
    }
  };

  return filters;
};