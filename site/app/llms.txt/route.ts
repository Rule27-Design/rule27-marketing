/**
 * /llms.txt — short table-of-contents file per llmstxt.org spec.
 *
 * Used by LLM crawlers (Anthropic, Perplexity, etc.) to discover which pages
 * are worth ingesting and where the full markdown lives. We point them at:
 *   - /llms-full.txt for the concatenated priority page corpus
 *   - /<path>.md for per-page markdown mirrors
 *   - /sitemap_index.xml for the full URL graph
 */
import { getAllSlugsForCollection, urlForItem } from "../lib/cms";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.rule27design.com";

export async function GET() {
  const sections: string[] = [];

  sections.push("# Rule27 Design");
  sections.push("");
  sections.push("> Marketing, SEO, web design, and growth strategy for businesses ready to outrank their competitors. Founded in Phoenix, AZ — serving clients nationwide.");
  sections.push("");
  sections.push("## Core Resources");
  sections.push("");
  sections.push(`- [Homepage](${SITE_URL}/): Overview of Rule27's services and philosophy`);
  sections.push(`- [Capabilities](${SITE_URL}/capabilities): Full list of services and disciplines`);
  sections.push(`- [Case Studies](${SITE_URL}/case-studies): Real client results with measurable outcomes`);
  sections.push(`- [Articles](${SITE_URL}/articles): Long-form thinking on SEO, branding, and growth`);
  sections.push(`- [About](${SITE_URL}/about): Team, philosophy, and brand origin`);
  sections.push(`- [Contact](${SITE_URL}/contact): Engagement inquiries`);
  sections.push("");

  const groups = [
    { collection: "service-location", label: "Services" },
    { collection: "industry", label: "Industries" },
    { collection: "solution", label: "Solutions" },
    { collection: "technology", label: "Technologies" },
    { collection: "location", label: "Locations" },
    { collection: "case-study", label: "Case Studies" },
    { collection: "answer", label: "Direct Answers" },
    { collection: "blog-post", label: "Guides & Long-Form" },
    { collection: "comparison", label: "Comparisons" },
    { collection: "tool", label: "Free Tools" },
    { collection: "scenario", label: "Scenarios" },
    { collection: "faq-topic", label: "FAQ Topics" },
  ];

  for (const g of groups) {
    const items = await getAllSlugsForCollection(g.collection);
    if (!items.length) continue;
    sections.push(`## ${g.label}`);
    sections.push("");
    for (const item of items.slice(0, 50)) {
      const url = SITE_URL + urlForItem(g.collection, item.slug);
      sections.push(`- [${item.slug}](${url}) ([md](${url}.md))`);
    }
    if (items.length > 50) {
      sections.push(`- ... and ${items.length - 50} more in [${g.collection} sitemap](${SITE_URL}/sitemap-${g.collection === "service-location" ? "services" : g.collection === "case-study" ? "case-studies" : g.collection === "faq-topic" ? "faqs" : g.collection + "s"}.xml)`);
    }
    sections.push("");
  }

  sections.push("## Bulk Resources");
  sections.push("");
  sections.push(`- [Sitemap Index](${SITE_URL}/sitemap_index.xml) — full URL graph`);
  sections.push(`- [Full Content (llms-full.txt)](${SITE_URL}/llms-full.txt) — concatenated priority page markdown`);
  sections.push("");

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
