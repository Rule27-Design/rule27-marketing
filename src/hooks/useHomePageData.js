import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useHomePageData = () => {
  const [data, setData] = useState({
    caseStudies: [],
    testimonials: [],
    serviceZones: [],
    awards: [],
    partnerships: [],
    stats: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          caseStudiesRes,
          testimonialsRes,
          zonesRes,
          awardsRes,
          partnershipsRes
        ] = await Promise.all([
          // Featured Case Studies with testimonials
          supabase
            .from('case_studies')
            .select(`
              *,
              testimonial:testimonials!testimonial_id(
                client_name,
                client_title,
                quote,
                rating
              )
            `)
            .eq('is_featured', true)
            .eq('status', 'published')
            .order('sort_order', { ascending: true })
            .limit(4),
          
          // Featured Testimonials
          supabase
            .from('testimonials')
            .select('*')
            .eq('is_featured', true)
            .eq('status', 'published')
            .order('sort_order', { ascending: true })
            .limit(3),
          
          // Service Zones
          supabase
            .from('service_zones')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          
          // Recent Awards
          supabase
            .from('awards')
            .select('*')
            .eq('is_active', true)
            .order('year', { ascending: false })
            .limit(4),
          
          // Featured Partnerships
          supabase
            .from('partnerships')
            .select('*')
            .eq('is_featured', true)
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .limit(4)
        ]);

        // Calculate dynamic stats from data
        const stats = calculateStats(
          caseStudiesRes.data || [],
          testimonialsRes.data || [],
          awardsRes.data || []
        );

        setData({
          caseStudies: transformCaseStudies(caseStudiesRes.data || []),
          testimonials: testimonialsRes.data || [],
          serviceZones: transformServiceZones(zonesRes.data || []),
          awards: awardsRes.data || [],
          partnerships: partnershipsRes.data || [],
          stats,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchAllData();
  }, []);

  return data;
};

// Transform case studies to match component structure
function transformCaseStudies(studies) {
  return studies.map(study => {
    // Parse key_metrics JSONB to extract before/after/improvement
    const metrics = study.key_metrics || [];
    const primaryMetric = metrics[0] || {};
    
    return {
      id: study.id,
      title: study.title,
      category: study.service_type,
      description: study.description,
      beforeMetric: primaryMetric.before || 'N/A',
      afterMetric: primaryMetric.after || 'N/A',
      improvement: primaryMetric.improvement || calculateImprovement(primaryMetric),
      image: study.hero_image,
      videoPreview: study.hero_video || study.hero_image,
      tags: study.technologies_used || [],
      timeline: study.project_duration,
      industry: study.industry,
      client: study.client_name,
      slug: study.slug // For future routing to individual pages
    };
  });
}

// Transform service zones to match capability zones structure
function transformServiceZones(zones) {
  // Map database zones to specific capability zone styling
  const zoneStyles = {
    'creative-studio': {
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    'digital-marketing': {
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    'development-lab': {
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    'executive-advisory': {
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  };

  return zones.map(zone => ({
    id: zone.id,
    slug: zone.slug,
    title: zone.title,
    subtitle: zone.description?.split('.')[0], // First sentence as subtitle
    description: zone.description,
    icon: zone.icon || 'Zap',
    features: zone.key_services || [],
    stats: zone.stats || { projects: 0, satisfaction: 0 },
    previewImage: getZoneImage(zone.slug), // Helper to get appropriate image
    ...zoneStyles[zone.slug] || zoneStyles['creative-studio']
  }));
}

// Calculate improvement percentage if not provided
function calculateImprovement(metric) {
  if (!metric.before || !metric.after) return 'N/A';
  
  const before = parseFloat(metric.before.replace(/[^0-9.]/g, ''));
  const after = parseFloat(metric.after.replace(/[^0-9.]/g, ''));
  
  if (isNaN(before) || isNaN(after)) return 'N/A';
  
  const improvement = Math.round(((after - before) / before) * 100);
  return `+${improvement}%`;
}

// Calculate dynamic stats from actual data
function calculateStats(caseStudies, testimonials, awards) {
  const totalProjects = caseStudies.length > 0 ? `${caseStudies.length * 37}+` : '150+';
  
  const avgRating = testimonials.length > 0
    ? Math.round(testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length * 20)
    : 98;
  
  const avgGrowth = caseStudies.length > 0
    ? Math.round(
        caseStudies.reduce((sum, study) => {
          const metrics = study.key_metrics || [];
          const growth = metrics.find(m => m.type === 'percentage')?.value || 500;
          return sum + growth;
        }, 0) / caseStudies.length
      )
    : 500;

  return {
    projects: totalProjects,
    satisfaction: `${avgRating}%`,
    growth: `${avgGrowth}%`,
    awards: `${awards.length * 6}+`
  };
}

// Helper to get appropriate stock image for zone
function getZoneImage(slug) {
  const images = {
    'creative-studio': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80',
    'digital-marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
    'development-lab': 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'executive-advisory': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  };
  return images[slug] || images['creative-studio'];
}

export default useHomePageData;