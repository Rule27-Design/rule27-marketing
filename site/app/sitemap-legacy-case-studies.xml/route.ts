import { buildSitemapXml, fullUrl, sitemapResponse, type SitemapEntry } from "../lib/sitemap-helpers";
import { supabase, supabaseEnabled } from "../lib/supabase";

/**
 * Legacy `case_studies` table (pre-CMS). Kept live during migration so the existing
 * /case-studies/[slug] route doesn't break. New case studies go through the CMS
 * (collection: case-study, URL prefix: /case-studies).
 */
export async function GET() {
  if (!supabaseEnabled) return sitemapResponse(buildSitemapXml([]));
  const { data, error } = await supabase
    .from("case_studies")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(1000);
  if (error) return sitemapResponse(buildSitemapXml([]));

  const entries: SitemapEntry[] = (data ?? []).map(row => {
    const r = row as { slug: string; updated_at: string; published_at: string | null };
    return {
      loc: fullUrl(`/case-studies/${r.slug}`),
      lastmod: (r.updated_at ?? r.published_at ?? "").split("T")[0] || undefined,
      changefreq: "monthly" as const,
      priority: 0.8,
    };
  });
  return sitemapResponse(buildSitemapXml(entries));
}
