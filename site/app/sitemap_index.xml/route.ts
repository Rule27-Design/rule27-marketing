import { buildSitemapIndexXml, fullUrl, sitemapResponse } from "../lib/sitemap-helpers";

const TODAY = new Date().toISOString().split("T")[0];

const SITEMAPS = [
  "sitemap-static.xml",
  "sitemap-services.xml",
  "sitemap-industries.xml",
  "sitemap-solutions.xml",
  "sitemap-technologies.xml",
  "sitemap-locations.xml",
  "sitemap-case-studies.xml",
  "sitemap-faqs.xml",
  "sitemap-answers.xml",
  "sitemap-blog.xml",
  "sitemap-comparisons.xml",
  "sitemap-tools.xml",
  "sitemap-scenarios.xml",
  "sitemap-articles.xml",
  "sitemap-team.xml",
  "sitemap-legacy-case-studies.xml",
];

export async function GET() {
  const xml = buildSitemapIndexXml(
    SITEMAPS.map(name => ({
      loc: fullUrl("/" + name),
      lastmod: TODAY,
    })),
  );
  return sitemapResponse(xml);
}
