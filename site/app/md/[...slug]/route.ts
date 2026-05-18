/**
 * /md/<any-cms-path> — per-page markdown mirror, rewritten from /<path>.md by next.config.
 *
 * Mirrors the html catch-all at /[...slug]/page.tsx. Used by:
 *   - LLM crawlers per llmstxt.org convention
 *   - Internal diff tooling / content audits
 *   - Anyone who curls a URL with .md appended
 */
import { getCmsItemBySlug, routeToCollection } from "../../lib/cms";
import { serializePageToMarkdown } from "../../lib/serialize-markdown";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await ctx.params;
  const route = routeToCollection(slug);
  if (!route) {
    return new Response("Not Found", { status: 404 });
  }
  const item = await getCmsItemBySlug(route.collectionSlug, route.itemSlug);
  if (!item) {
    return new Response("Not Found", { status: 404 });
  }
  const urlPath = "/" + slug.join("/");
  const md = serializePageToMarkdown(item, urlPath);

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
