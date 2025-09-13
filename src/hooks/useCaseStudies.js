import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Helper function to extract text from rich text content
const extractTextFromRichText = (content) => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  
  // Handle HTML content
  if (content.html) {
    // Strip HTML tags
    return content.html.replace(/<[^>]*>/g, '');
  }
  
  // Handle TipTap JSON format
  if (content.type === 'doc' && content.content) {
    return content.content
      .filter(node => node.type === 'paragraph')
      .map(node => {
        if (node.content && Array.isArray(node.content)) {
          return node.content
            .filter(c => c.type === 'text')
            .map(c => c.text)
            .join('');
        }
        return '';
      })
      .join(' ');
  }
  
  return '';
};

// Transform backend data to frontend format
const transformCaseStudy = (study) => {
  if (!study) return null;
  
  return {
    id: study.id,
    title: study.title,
    slug: study.slug,
    client: study.client_name,
    clientLogo: study.client_logo,
    clientWebsite: study.client_website,
    industry: study.client_industry || 'Technology',
    serviceType: study.service_type || 'Web Development',
    businessStage: study.client_company_size || 'Growth Stage',
    heroImage: study.hero_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    description: study.results_summary || extractTextFromRichText(study.challenge) || '',
    challenge: extractTextFromRichText(study.challenge),
    solution: extractTextFromRichText(study.solution),
    implementation: extractTextFromRichText(study.implementation_process),
    timeline: study.project_duration || 'N/A',
    duration: study.project_duration || 'N/A',
    featured: study.is_featured || false,
    keyMetrics: study.key_metrics || [],
    // Map results_narrative to detailedResults
    detailedResults: study.results_narrative || [],
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
    gallery: study.gallery_images?.map(item => 
      typeof item === 'string' ? item : item.url
    ).filter(url => url && !url.includes('placeholder')) || [study.hero_image].filter(Boolean),
    viewCount: study.view_count || 0,
    conversionCount: study.inquiry_count || 0,
    created_at: study.created_at,
    project_start_date: study.project_start_date,
    project_end_date: study.project_end_date
  };
};

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
          testimonial:testimonial_id(
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
      const transformedStudies = (studies || []).map(transformCaseStudy);

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
      
      // Update counts
      await supabase
        .from('case_studies')
        .update({ 
          view_count: (currentData?.view_count || 0) + 1,
          unique_view_count: (currentData?.unique_view_count || 0) + 1
        })
        .eq('id', caseStudyId);

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
          testimonial:testimonial_id(
            client_name,
            client_title,
            client_company,
            quote,
            rating,
            client_avatar
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      // Transform for detail page
      const transformedStudy = study ? {
        ...transformCaseStudy(study),
        // Keep original fields for detail page
        client_name: study.client_name,
        client_logo: study.client_logo,
        client_website: study.client_website,
        client_industry: study.client_industry,
        hero_image: study.hero_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        service_type: study.service_type,
        client_company_size: study.client_company_size,
        business_stage: study.client_company_size || 'Growth Stage',
        is_featured: study.is_featured,
        project_duration: study.project_duration,
        project_start_date: study.project_start_date,
        project_end_date: study.project_end_date,
        // Transform results_narrative to detailed_results for compatibility
        detailed_results: study.results_narrative || [],
        key_metrics: study.key_metrics || [],
        process_steps: study.process_steps || [],
        technologies_used: study.technologies_used || [],
        deliverables: study.deliverables || [],
        gallery_images: study.gallery_images || [],
        gallery: study.gallery_images?.map(item => 
          typeof item === 'string' ? item : item.url
        ).filter(url => url && !url.includes('placeholder')) || [study.hero_image].filter(Boolean),
        testimonial: study.testimonial,
        challenge: extractTextFromRichText(study.challenge),
        solution: extractTextFromRichText(study.solution),
        implementation: extractTextFromRichText(study.implementation_process),
        description: study.results_summary || extractTextFromRichText(study.challenge) || ''
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
        .select('client_industry, service_type, client_company_size')
        .eq('status', 'published')
        .eq('is_active', true);

      if (studies) {
        const industries = [...new Set(studies.map(s => s.client_industry).filter(Boolean))];
        const serviceTypes = [...new Set(studies.map(s => s.service_type).filter(Boolean))];
        const businessStages = [...new Set(studies.map(s => s.client_company_size).filter(Boolean))];

        setFilters({
          industries: industries.length > 0 ? industries : ['Technology', 'Healthcare', 'Finance', 'Retail'],
          serviceTypes: serviceTypes.length > 0 ? serviceTypes : ['Web Development', 'Branding', 'Marketing'],
          businessStages: businessStages.length > 0 ? businessStages : ['Startup', 'Growth Stage', 'Enterprise'],
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
      setFilters(prev => ({ 
        ...prev, 
        loading: false,
        // Provide defaults if fetch fails
        industries: ['Technology', 'Healthcare', 'Finance', 'Retail'],
        serviceTypes: ['Web Development', 'Branding', 'Marketing'],
        businessStages: ['Startup', 'Growth Stage', 'Enterprise']
      }));
    }
  };

  return filters;
};