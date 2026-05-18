import { buildSitemapXml, getCmsSitemapEntries, sitemapResponse } from "../lib/sitemap-helpers";

export async function GET() {
  const entries = await getCmsSitemapEntries("service-location", {
    changefreq: "weekly",
    priority: 0.9,
  });
  return sitemapResponse(buildSitemapXml(entries));
}
