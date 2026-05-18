/**
 * /llms-full.txt — concatenated markdown of all priority pages.
 *
 * Strategy: pull the top-priority items from each CMS collection (capped to
 * avoid blowing the response size), serialize each one as markdown via
 * serializePageToMarkdown, and join them with delimiters.
 *
 * LLM crawlers fetch this once to ingest the corpus rather than crawling
 * thousands of HTML pages.
 */
import { getCmsItemsByCollection, urlForItem, ALL_COLLECTIONS } from "../lib/cms";
import { serializePageToMarkdown } from "../lib/serialize-markdown";

// Per-collection caps (highest priority gets more entries)
const COLLECTION_LIMITS: Record<string, number> = {
  "service-location": 50,
  "industry": 25,
  "solution": 25,
  "technology": 15,
  "location": 30,
  "case-study": 25,
  "answer": 75,
  "blog-post": 50,
  "comparison": 25,
  "tool": 15,
  "scenario": 50,
  "faq-topic": 20,
};

export async function GET() {
  const parts: string[] = [];

  parts.push("# Rule27 Design — Full Content Corpus");
  parts.push("");
  parts.push("This file aggregates priority page content as markdown per the llmstxt.org spec.");
  parts.push("For the full URL graph, see /sitemap_index.xml. For a short TOC, see /llms.txt.");
  parts.push("");
  parts.push("---");
  parts.push("");

  for (const collectionSlug of ALL_COLLECTIONS) {
    const limit = COLLECTION_LIMITS[collectionSlug] ?? 20;
    const items = await getCmsItemsByCollection(collectionSlug, {
      limit,
      publishedOnly: true,
      orderBy: "published_at",
      ascending: false,
    });
    for (const item of items) {
      const urlPath = urlForItem(collectionSlug, item.slug);
      parts.push(serializePageToMarkdown(item, urlPath));
      parts.push("");
      parts.push("---");
      parts.push("");
    }
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
