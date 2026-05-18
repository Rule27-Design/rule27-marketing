import { buildSitemapXml, getCmsSitemapEntries, sitemapResponse } from "../lib/sitemap-helpers";

export async function GET() {
  const entries = await getCmsSitemapEntries("tool", { changefreq: "monthly", priority: 0.8 });
  return sitemapResponse(buildSitemapXml(entries));
}
