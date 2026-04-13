import { supabase } from "@/app/lib/supabase";
import type { TeamMember } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Public data fetchers
// ---------------------------------------------------------------------------

/**
 * Fetch all active, publicly-visible team members ordered by sort_order then name.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .eq("is_public", true)
      .order("sort_order")
      .order("full_name");

    if (error) throw error;

    return (data || []) as TeamMember[];
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

/**
 * Fetch a single team member by their URL slug.
 *
 * Also resolves related team members from the same department and content
 * (articles and case studies) authored or co-authored by the member.
 */
export async function getTeamMember(slug: string): Promise<{
  member: TeamMember | null;
  relatedMembers: TeamMember[];
  articles: TeamMemberArticle[];
  caseStudies: TeamMemberCaseStudy[];
}> {
  try {
    // Fetch the member profile
    const { data: memberData, error: memberError } = await supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (memberError) throw memberError;
    if (!memberData) return { member: null, relatedMembers: [], articles: [], caseStudies: [] };

    const member = memberData as TeamMember;

    // Kick off parallel fetches for related content
    const [
      authoredArticlesRes,
      coAuthoredArticlesRes,
      authoredCaseStudiesRes,
      coAuthoredCaseStudiesRes,
      relatedMembersRes,
    ] = await Promise.all([
      // Articles where this person is the primary author
      supabase
        .from("articles")
        .select(
          `
          id, title, slug, excerpt, featured_image,
          read_time, published_at, view_count, like_count,
          categories:category_id(name)
        `,
        )
        .eq("status", "published")
        .eq("author_id", member.id)
        .order("published_at", { ascending: false }),

      // Articles where this person is a co-author
      supabase
        .from("articles")
        .select(
          `
          id, title, slug, excerpt, featured_image,
          read_time, published_at, view_count, like_count,
          categories:category_id(name)
        `,
        )
        .eq("status", "published")
        .contains("co_authors", [member.id])
        .order("published_at", { ascending: false }),

      // Case studies where this person is the primary author
      supabase
        .from("case_studies")
        .select(
          `
          id, title, slug, excerpt, featured_image,
          client_name, project_duration, published_at, view_count,
          categories:category_id(name)
        `,
        )
        .eq("status", "published")
        .eq("author_id", member.id)
        .order("published_at", { ascending: false }),

      // Case studies where this person is a co-author
      supabase
        .from("case_studies")
        .select(
          `
          id, title, slug, excerpt, featured_image,
          client_name, project_duration, published_at, view_count,
          categories:category_id(name)
        `,
        )
        .eq("status", "published")
        .contains("co_authors", [member.id])
        .order("published_at", { ascending: false }),

      // Related team members from the same department
      member.department && member.department.length > 0
        ? supabase
            .from("profiles")
            .select("*")
            .eq("is_active", true)
            .eq("is_public", true)
            .contains("department", member.department)
            .neq("id", member.id)
            .limit(3)
        : Promise.resolve({ data: [], error: null }),
    ]);

    // De-duplicate articles
    const allArticles = [
      ...(authoredArticlesRes.data || []),
      ...(coAuthoredArticlesRes.data || []),
    ];
    const articles = Array.from(
      new Map(allArticles.map((item) => [item.id, item])).values(),
    ) as TeamMemberArticle[];

    // De-duplicate case studies
    const allCaseStudies = [
      ...(authoredCaseStudiesRes.data || []),
      ...(coAuthoredCaseStudiesRes.data || []),
    ];
    const caseStudies = Array.from(
      new Map(allCaseStudies.map((item) => [item.id, item])).values(),
    ) as TeamMemberCaseStudy[];

    const relatedMembers = (relatedMembersRes.data || []) as TeamMember[];

    return { member, relatedMembers, articles, caseStudies };
  } catch (error) {
    console.error("Error fetching team member:", error);
    return { member: null, relatedMembers: [], articles: [], caseStudies: [] };
  }
}

// ---------------------------------------------------------------------------
// Lightweight content shapes returned alongside a team member
// ---------------------------------------------------------------------------

export interface TeamMemberArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  read_time: number | null;
  published_at: string | null;
  view_count: number;
  like_count: number;
  categories: Array<{ name: string }>;
}

export interface TeamMemberCaseStudy {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  client_name: string | null;
  project_duration: string | null;
  published_at: string | null;
  view_count: number;
  categories: Array<{ name: string }>;
}
