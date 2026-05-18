import { buildSitemapXml, getCmsSitemapEntries, sitemapResponse } from "../lib/sitemap-helpers";

export async function GET() {
  const entries = await getCmsSitemapEntries("technology", { changefreq: "monthly", priority: 0.7 });
  return sitemapResponse(buildSitemapXml(entries));
}
