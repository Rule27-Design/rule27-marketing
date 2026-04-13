import { supabase } from "@/app/lib/supabase";
import { extractPlainText } from "@/app/lib/utils";
import type { CaseStudy, CaseStudyFilters } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Transform a raw Supabase row into the component-ready CaseStudy shape
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function transformCaseStudy(study: any): CaseStudy | null {
  if (!study) return null;

  return {
    id: study.id,
    title: study.title,
    slug: study.slug,
    client: study.client_name,
    clientLogo: study.client_logo,
    clientWebsite: study.client_website,
    industry: study.client_industry || "Technology",
    serviceType: study.service_type || "Web Development",
    businessStage: study.business_stage || "Growth Stage",
    companySize: study.client_company_size || "",
    heroImage:
      study.hero_image ||
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description:
      study.results_summary || extractPlainText(study.challenge) || "",
    challenge: extractPlainText(study.challenge),
    solution: extractPlainText(study.solution),
    implementation: extractPlainText(study.implementation_process),
    timeline: study.project_duration || "N/A",
    duration: study.project_duration || "N/A",
    featured: study.is_featured || false,
    keyMetrics: study.key_metrics || [],
    detailedResults: study.results_narrative || [],
    processSteps: study.process_steps || [],
    technologiesUsed: study.technologies_used || [],
    deliverables: study.deliverables || [],
    teamMembers: study.team_members || [],
    projectLead: study.project_lead,
    testimonial: study.testimonial
      ? {
          name: study.testimonial.client_name,
          position: study.testimonial.client_title,
          quote: study.testimonial.quote,
          avatar:
            study.testimonial.client_avatar ||
            "https://randomuser.me/api/portraits/men/32.jpg",
          rating: study.testimonial.rating,
        }
      : null,
    gallery:
      study.gallery_images
        ?.map((item: any) => (typeof item === "string" ? item : item.url))
        .filter(
          (url: string | undefined) => url && !url.includes("placeholder"),
        ) || [study.hero_image].filter(Boolean),
    viewCount: study.view_count || 0,
    conversionCount: study.inquiry_count || 0,
    created_at: study.created_at,
    project_start_date: study.project_start_date,
    project_end_date: study.project_end_date,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Public data fetchers
// ---------------------------------------------------------------------------

/**
 * Fetch all published case studies with their linked testimonials.
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const { data: studies, error } = await supabase
      .from("case_studies")
      .select(
        `
        *,
        testimonial:testimonial_id(
          client_name,
          client_title,
          quote,
          rating,
          client_avatar
        )
      `,
      )
      .eq("status", "published")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (studies || [])
      .map(transformCaseStudy)
      .filter((s): s is CaseStudy => s !== null);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}

/**
 * Fetch a single case study by its URL slug.
 */
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const { data: study, error } = await supabase
      .from("case_studies")
      .select(
        `
        *,
        testimonial:testimonial_id(
          client_name,
          client_title,
          client_company,
          quote,
          rating,
          client_avatar
        )
      `,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) throw error;

    return transformCaseStudy(study);
  } catch (error) {
    console.error("Error fetching case study:", error);
    return null;
  }
}

/**
 * Extract the unique filter options from all published case studies.
 */
export async function getCaseStudyFilters(): Promise<CaseStudyFilters> {
  const defaults: CaseStudyFilters = {
    industries: ["Technology", "Healthcare", "Finance", "Retail"],
    serviceTypes: ["Web Development", "Branding", "Marketing"],
    businessStages: ["Startup", "Growth Stage", "Scale-up", "Enterprise"],
    companySizes: [
      "1-10 employees",
      "11-50 employees",
      "51-200 employees",
      "201-500 employees",
      "501-1000 employees",
      "1000+ employees",
    ],
  };

  try {
    const { data: studies } = await supabase
      .from("case_studies")
      .select(
        "client_industry, service_type, business_stage, client_company_size",
      )
      .eq("status", "published")
      .eq("is_active", true);

    if (!studies || studies.length === 0) return defaults;

    const industries = [
      ...new Set(studies.map((s) => s.client_industry).filter(Boolean)),
    ];
    const serviceTypes = [
      ...new Set(studies.map((s) => s.service_type).filter(Boolean)),
    ];
    const businessStages = [
      ...new Set(studies.map((s) => s.business_stage).filter(Boolean)),
    ];
    const companySizes = [
      ...new Set(studies.map((s) => s.client_company_size).filter(Boolean)),
    ];

    return {
      industries: industries.length > 0 ? industries : defaults.industries,
      serviceTypes:
        serviceTypes.length > 0 ? serviceTypes : defaults.serviceTypes,
      businessStages:
        businessStages.length > 0 ? businessStages : defaults.businessStages,
      companySizes:
        companySizes.length > 0 ? companySizes : defaults.companySizes,
    };
  } catch (error) {
    console.error("Error fetching case study filters:", error);
    return defaults;
  }
}
