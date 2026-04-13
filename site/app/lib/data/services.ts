import { supabase } from "@/app/lib/supabase";
import type { Service, ServiceZone } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Public data fetchers
// ---------------------------------------------------------------------------

/**
 * Fetch all active service zones, ordered by sort_order.
 */
export async function getServiceZones(): Promise<ServiceZone[]> {
  try {
    // Fetch zones and services in parallel so we can compute per-zone counts
    const [zonesRes, servicesRes] = await Promise.all([
      supabase
        .from("service_zones")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("services")
        .select("id, zone_id")
        .eq("is_active", true),
    ]);

    if (zonesRes.error) throw zonesRes.error;

    const zones = zonesRes.data || [];
    const services = servicesRes.data || [];

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return zones.map((zone: any) => ({
      id: zone.slug, // Use slug as ID for consistency (matches original)
      slug: zone.slug,
      title: zone.title,
      icon: zone.icon || "Zap",
      description: zone.description,
      serviceCount:
        services.filter((s: any) => s.zone_id === zone.id).length ||
        zone.service_count,
      keyServices: zone.key_services || [],
      features: zone.key_services || [],
      stats: zone.stats || { projects: 0, satisfaction: 0 },
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch (error) {
    console.error("Error fetching service zones:", error);
    return [];
  }
}

/**
 * Fetch all active services with their parent zone information.
 */
export async function getServices(): Promise<Service[]> {
  try {
    const { data: services, error } = await supabase
      .from("services")
      .select(
        `
        *,
        zone:service_zones!zone_id(
          id,
          slug,
          title,
          icon
        )
      `,
      )
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (services || []).map((service: any) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      category: service.category,
      zone: service.zone?.slug || "creative-studio",
      icon: service.icon || "Zap",
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
      metaDescription: service.meta_description,
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

/**
 * Fetch a single service zone by slug, including its services.
 */
export async function getServiceZone(slug: string) {
  try {
    const { data: zone, error: zoneError } = await supabase
      .from("service_zones")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (zoneError || !zone) return { zone: null, services: [] };

    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .eq("zone_id", zone.id)
      .eq("is_active", true)
      .order("title", { ascending: true });

    if (servicesError) throw servicesError;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const transformedZone: ServiceZone = {
      id: zone.id,
      slug: zone.slug,
      title: zone.title,
      icon: zone.icon || "Zap",
      description: zone.description,
      serviceCount: (services || []).length || zone.service_count,
      keyServices: zone.key_services || [],
      features: zone.key_services || [],
      stats: zone.stats || { projects: 0, satisfaction: 0 },
      previewImage: zone.preview_image,
      previewImageAlt: zone.preview_image_alt,
    };

    const transformedServices: Service[] = (services || []).map((s: any) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      category: s.category,
      zone: zone.slug,
      icon: s.icon || "Zap",
      description: s.description,
      fullDescription: s.full_description,
      features: s.features || [],
      technologies: s.technologies || [],
      process: s.process_steps || [],
      expectedResults: s.expected_results || [],
      pricingTiers: s.pricing_tiers || [],
      viewCount: s.view_count || 0,
      uniqueViewCount: s.unique_view_count || 0,
      inquiryCount: s.inquiry_count || 0,
      isFeatured: s.is_featured || false,
      metaTitle: s.meta_title,
      metaDescription: s.meta_description,
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return { zone: transformedZone, services: transformedServices };
  } catch (error) {
    console.error("Error fetching service zone:", error);
    return { zone: null, services: [] };
  }
}

/**
 * Fetch a single service by slug, including its parent zone.
 */
export async function getService(slug: string) {
  try {
    const { data: service, error } = await supabase
      .from("services")
      .select(`
        *,
        zone:service_zones!zone_id(*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !service) return { service: null, zone: null, relatedServices: [], relatedCaseStudies: [], testimonials: [] };

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const zone = service.zone as any;

    // Fetch in parallel: related services, testimonials, and case studies
    const [relatedRes, testimonialsRes, manualCaseStudiesRes, autoCaseStudiesRes] = await Promise.all([
      // Related services from same zone
      supabase
        .from("services")
        .select("id, slug, title, description, icon, category, features, is_featured, tagline, clients_served")
        .eq("zone_id", service.zone_id)
        .eq("is_active", true)
        .neq("id", service.id)
        .limit(4),

      // Service-specific testimonials
      supabase
        .from("service_testimonials")
        .select("*")
        .eq("service_id", service.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(6),

      // Manual case study links (if any IDs specified)
      (service.related_case_study_ids && service.related_case_study_ids.length > 0)
        ? supabase
            .from("case_studies")
            .select("id, slug, title, client_name, hero_image, industry, service_type, key_metrics, description")
            .in("id", service.related_case_study_ids)
            .eq("status", "published")
            .limit(4)
        : Promise.resolve({ data: [], error: null }),

      // Auto-matched case studies by category (fallback)
      supabase
        .from("case_studies")
        .select("id, slug, title, client_name, hero_image, industry, service_type, key_metrics, description")
        .eq("status", "published")
        .or(`service_type.ilike.%${service.category}%,industry.ilike.%${service.category}%`)
        .limit(4),
    ]);

    const transformedService: Service = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      category: service.category,
      zone: zone?.slug || "",
      icon: service.icon || "Zap",
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
      isFeatured: service.is_featured || false,
      metaTitle: service.meta_title,
      metaDescription: service.meta_description,
      // Conversion fields
      tagline: service.tagline,
      heroImage: service.hero_image,
      showcaseImages: service.showcase_images || [],
      avgRoi: service.avg_roi,
      avgTimeline: service.avg_timeline,
      clientsServed: service.clients_served || 0,
      satisfactionRate: service.satisfaction_rate,
      successMetrics: service.success_metrics || [],
      guarantee: service.guarantee,
      availability: service.availability,
      turnaround: service.turnaround,
      relatedCaseStudyIds: service.related_case_study_ids || [],
      faqs: service.faqs || [],
    };

    // Testimonials
    const testimonials = (testimonialsRes.data || []).map((t: any) => ({
      id: t.id,
      clientName: t.client_name,
      clientTitle: t.client_title,
      clientCompany: t.client_company,
      clientAvatar: t.client_avatar,
      quote: t.quote,
      rating: t.rating || 5,
      resultMetric: t.result_metric,
      isFeatured: t.is_featured || false,
    }));

    const transformedZone: ServiceZone | null = zone ? {
      id: zone.id,
      slug: zone.slug,
      title: zone.title,
      icon: zone.icon || "Zap",
      description: zone.description,
      serviceCount: zone.service_count || 0,
      keyServices: zone.key_services || [],
      features: zone.key_services || [],
      stats: zone.stats || { projects: 0, satisfaction: 0 },
      previewImage: zone.preview_image,
      previewImageAlt: zone.preview_image_alt,
      tagline: zone.tagline,
      heroImage: zone.hero_image,
      totalClients: zone.total_clients || 0,
      avgSatisfaction: zone.avg_satisfaction,
      featuredMetric: zone.featured_metric,
    } : null;

    const relatedServices: Service[] = (relatedRes.data || []).map((s: any) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      category: s.category,
      zone: zone?.slug || "",
      icon: s.icon || "Zap",
      description: s.description,
      fullDescription: null,
      features: s.features || [],
      technologies: [],
      process: [],
      expectedResults: [],
      pricingTiers: [],
      viewCount: 0,
      uniqueViewCount: 0,
      inquiryCount: 0,
      isFeatured: s.is_featured || false,
      tagline: s.tagline,
      clientsServed: s.clients_served || 0,
    }));

    // Merge case studies: manual picks first, then auto-matched (deduplicated)
    const manualCS = manualCaseStudiesRes.data || [];
    const autoCS = autoCaseStudiesRes.data || [];
    const seenIds = new Set(manualCS.map((cs: any) => cs.id));
    const mergedCaseStudies = [
      ...manualCS,
      ...autoCS.filter((cs: any) => !seenIds.has(cs.id)),
    ].slice(0, 4);

    const relatedCaseStudies = mergedCaseStudies.map((cs: any) => ({
      id: cs.id,
      slug: cs.slug,
      title: cs.title,
      client: cs.client_name,
      heroImage: cs.hero_image,
      industry: cs.industry,
      serviceType: cs.service_type,
      keyMetrics: cs.key_metrics || [],
      description: cs.description,
    }));
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return { service: transformedService, zone: transformedZone, relatedServices, relatedCaseStudies, testimonials };
  } catch (error) {
    console.error("Error fetching service:", error);
    return { service: null, zone: null, relatedServices: [], relatedCaseStudies: [], testimonials: [] };
  }
}
