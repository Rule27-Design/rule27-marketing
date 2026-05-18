import { buildSitemapXml, fullUrl, sitemapResponse, type SitemapEntry } from "../lib/sitemap-helpers";
import { supabase, supabaseEnabled } from "../lib/supabase";

export async function GET() {
  if (!supabaseEnabled) return sitemapResponse(buildSitemapXml([]));
  const { data, error } = await supabase
    .from("articles")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })
    .limit(5000);
  if (error) return sitemapResponse(buildSitemapXml([]));

  const entries: SitemapEntry[] = (data ?? []).flatMap(row => {
    const r = row as { slug: string; updated_at: string; published_at: string | null };
    const lastmod = (r.updated_at ?? r.published_at ?? "").split("T")[0] || undefined;
    return [
      { loc: fullUrl(`/articles/${r.slug}`), lastmod, changefreq: "weekly" as const, priority: 0.8 },
    ];
  });
  return sitemapResponse(buildSitemapXml(entries));
}
