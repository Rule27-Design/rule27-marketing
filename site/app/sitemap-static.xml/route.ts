import { buildSitemapXml, fullUrl, sitemapResponse, type SitemapEntry } from "../lib/sitemap-helpers";

const TODAY = new Date().toISOString().split("T")[0];

const STATIC_PAGES: Array<{ path: string; priority: number; changefreq: SitemapEntry["changefreq"] }> = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/capabilities", priority: 0.8, changefreq: "monthly" },
  { path: "/about", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.8, changefreq: "monthly" },
  { path: "/innovation", priority: 0.7, changefreq: "monthly" },
  { path: "/case-studies", priority: 0.9, changefreq: "weekly" },
  { path: "/articles", priority: 0.9, changefreq: "weekly" },
  { path: "/team", priority: 0.6, changefreq: "monthly" },
];

export async function GET() {
  const entries: SitemapEntry[] = STATIC_PAGES.map(p => ({
    loc: fullUrl(p.path),
    lastmod: TODAY,
    changefreq: p.changefreq,
    priority: p.priority,
  }));
  return sitemapResponse(buildSitemapXml(entries));
}
