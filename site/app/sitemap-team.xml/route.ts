import { buildSitemapXml, fullUrl, sitemapResponse, type SitemapEntry } from "../lib/sitemap-helpers";
import { supabase, supabaseEnabled } from "../lib/supabase";

export async function GET() {
  if (!supabaseEnabled) return sitemapResponse(buildSitemapXml([]));
  const { data, error } = await supabase
    .from("profiles")
    .select("slug, updated_at")
    .eq("is_active", true)
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(1000);
  if (error) return sitemapResponse(buildSitemapXml([]));

  const entries: SitemapEntry[] = (data ?? []).map(row => {
    const r = row as { slug: string; updated_at: string };
    return {
      loc: fullUrl(`/team/${r.slug}`),
      lastmod: (r.updated_at ?? "").split("T")[0] || undefined,
      changefreq: "monthly" as const,
      priority: 0.5,
    };
  });
  return sitemapResponse(buildSitemapXml(entries));
}
