import { buildSitemapXml, getCmsSitemapEntries, sitemapResponse } from "../lib/sitemap-helpers";

export async function GET() {
  const entries = await getCmsSitemapEntries("blog-post", { changefreq: "weekly", priority: 0.8 });
  return sitemapResponse(buildSitemapXml(entries));
}
