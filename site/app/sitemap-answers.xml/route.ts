import { buildSitemapXml, getCmsSitemapEntries, sitemapResponse } from "../lib/sitemap-helpers";

export async function GET() {
  const entries = await getCmsSitemapEntries("answer", { changefreq: "weekly", priority: 0.8 });
  return sitemapResponse(buildSitemapXml(entries));
}
