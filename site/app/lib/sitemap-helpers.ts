/**
 * Shared helpers for the sitemap-* route handlers.
 *
 * Each per-group route imports buildSitemapXml + getCmsSitemapEntries, fetches
 * its collection slugs, and emits a standards-compliant <urlset>.
 *
 * We always emit both the canonical URL and the .md mirror URL (llmstxt.org
 * convention), and let `lastmod` come from CMS updated_at / published_at.
 */
import { getAllSlugsForCollection, urlForItem } from "./cms";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rule27design.com";

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(e => {
      const parts = [`  <url>`, `    <loc>${escapeXml(e.loc)}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (typeof e.priority === "number") parts.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
      parts.push(`  </url>`);
      return parts.join("\n");
    }),
    "</urlset>",
  ];
  return xml.join("\n");
}

export function buildSitemapIndexXml(sitemaps: Array<{ loc: string; lastmod?: string }>): string {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map(s => {
      const parts = [`  <sitemap>`, `    <loc>${escapeXml(s.loc)}</loc>`];
      if (s.lastmod) parts.push(`    <lastmod>${s.lastmod}</lastmod>`);
      parts.push(`  </sitemap>`);
      return parts.join("\n");
    }),
    "</sitemapindex>",
  ];
  return xml.join("\n");
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function fullUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : "/" + path}`;
}

/**
 * Build sitemap entries for one CMS collection, including .md mirror URLs.
 */
export async function getCmsSitemapEntries(
  collectionSlug: string,
  opts: {
    changefreq?: SitemapEntry["changefreq"];
    priority?: number;
    includeMdMirror?: boolean;
    filter?: (row: { slug: string; updated_at: string; published_at: string | null }) => boolean;
  } = {},
): Promise<SitemapEntry[]> {
  const { changefreq = "weekly", priority = 0.7, includeMdMirror = true, filter } = opts;
  const rows = await getAllSlugsForCollection(collectionSlug);
  const out: SitemapEntry[] = [];
  for (const row of rows) {
    if (filter && !filter(row)) continue;
    const url = urlForItem(collectionSlug, row.slug);
    const lastmod = (row.updated_at ?? row.published_at)?.split("T")[0];
    out.push({ loc: fullUrl(url), lastmod, changefreq, priority });
    if (includeMdMirror) {
      out.push({ loc: fullUrl(url + ".md"), lastmod, changefreq, priority: priority - 0.2 });
    }
  }
  return out;
}

export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

export { SITE_URL };
