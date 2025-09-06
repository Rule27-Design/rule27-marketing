import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useServices = () => {
  const [data, setData] = useState({
    services: [],
    serviceZones: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Fetch service zones with their services
      const { data: zones, error: zonesError } = await supabase
        .from('service_zones')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (zonesError) throw zonesError;

      // Fetch all services with their zone information
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          zone:service_zones!zone_id(
            id,
            slug,
            title,
            icon
          )
        `)
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (servicesError) throw servicesError;

      // Transform services to match component structure
      const transformedServices = services?.map(service => ({
        id: service.id,
        slug: service.slug,
        title: service.title,
        category: service.category,
        zone: service.zone?.slug || 'creative-studio',
        icon: service.icon || 'Zap',
        description: service.description,
        fullDescription: service.full_description,
        features: service.features || [],
        technologies: service.technologies || [],
        process: service.process_steps || [],
        expectedResults: service.expected_results || [],
        pricingTiers: service.pricing_tiers || [],
        viewCount: service.view_count || 0,
        uniqueViewCount: service.unique_view_count || 0,
        inquiryCount: service.inquiry_count || 0,
        metaTitle: service.meta_title,
        metaDescription: service.meta_description
      }));

      // Transform zones to match component structure
      const transformedZones = zones?.map(zone => ({
        id: zone.slug, // Use slug as ID for consistency
        slug: zone.slug,
        title: zone.title,
        icon: zone.icon || 'Zap',
        description: zone.description,
        serviceCount: services?.filter(s => s.zone_id === zone.id).length || zone.service_count,
        keyServices: zone.key_services || [],
        stats: zone.stats || { projects: 0, satisfaction: 0 }
      }));

      setData({
        services: transformedServices,
        serviceZones: transformedZones,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching services:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Track service view
  const trackServiceView = async (serviceId, sessionId) => {
    try {
      // Update view count
      const { data: currentService } = await supabase
        .from('services')
        .select('view_count, unique_view_count')
        .eq('id', serviceId)
        .single();

      // Check if this session has already viewed this service
      const { data: existingView } = await supabase
        .from('service_analytics')
        .select('id')
        .eq('service_id', serviceId)
        .eq('session_id', sessionId)
        .single();

      // Update counts
      await supabase
        .from('services')
        .update({
          view_count: (currentService?.view_count || 0) + 1,
          unique_view_count: existingView ? (currentService?.unique_view_count || 0) : (currentService?.unique_view_count || 0) + 1
        })
        .eq('id', serviceId);

      // Track analytics
      if (!existingView) {
        await supabase
          .from('service_analytics')
          .insert({
            service_id: serviceId,
            session_id: sessionId,
            user_id: null
          });
      }
    } catch (error) {
      console.error('Error tracking service view:', error);
    }
  };

  return {
    ...data,
    trackServiceView,
    refetch: fetchServices
  };
};

// Hook for filter categories
export const useServiceFilters = () => {
  const [filters, setFilters] = useState({
    categories: [],
    zones: [],
    loading: true
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      // Get unique categories from services
      const { data: services } = await supabase
        .from('services')
        .select('category')
        .eq('is_active', true);

      // Get service zones for zone filtering
      const { data: zones } = await supabase
        .from('service_zones')
        .select('id, title, slug, icon')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (services && zones) {
        // Get unique categories
        const uniqueCategories = [...new Set(services.map(s => s.category).filter(Boolean))];

        // Count services per category
        const categoriesWithCounts = uniqueCategories.map(cat => {
          const count = services.filter(s => s.category === cat).length;
          return {
            id: cat,
            name: cat,
            icon: getCategoryIcon(cat),
            count
          };
        });

        // Add "All" category
        const allCategory = {
          id: 'all',
          name: 'All Services',
          icon: 'Grid',
          count: services.length
        };

        setFilters({
          categories: [allCategory, ...categoriesWithCounts],
          zones: zones.map(z => ({
            id: z.slug,
            name: z.title,
            icon: z.icon || 'Zap'
          })),
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

// Helper function to map category to icon
function getCategoryIcon(category) {
  const iconMap = {
    'Creative Studio': 'Palette',
    'Digital Marketing Command': 'Target',
    'Development Lab': 'Code',
    'Executive Advisory': 'Users'
  };
  return iconMap[category] || 'Zap';
}

// Get session ID for tracking
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};