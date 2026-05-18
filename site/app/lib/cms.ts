/**
 * CMS resolver — reads from Rule27 Supabase cms_collection_items.
 *
 * Two-table CMS architecture:
 *   - cms_collections          (definitions, slug→id lookup cached at init)
 *   - cms_collection_items     (content; dynamic data in `fields` JSONB)
 *
 * No flat view, no join tables. At the application boundary, we read the row
 * + JSONB blob and spread `fields` onto the returned object so the public
 * CmsItem shape stays flat and ergonomic for downstream consumers (templates,
 * schema generator, .md serializer).
 *
 * Schema migration: Command-Center/internal/supabase/migrations/20260515_cms_schema.sql
 */
import { supabase, supabaseEnabled } from "./supabase";

// ---- Types ----------------------------------------------------------------

export interface CmsCollection {
  id: string;
  project_id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  schema: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CmsItem {
  id: string;
  project_id: string;
  collection_id: string;
  title: string;
  slug: string;
  published: boolean;
  published_at: string | null;
  content_status: string;
  author_id: string | null;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  target_location: string | null;
  location_slug: string | null;

  // Merged in at the resolver boundary from the row's `fields` JSONB
  excerpt: string | null;
  body: unknown; // block-tree or null
  featured_image: string | null;
  sections: Record<string, unknown> | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  schema_markup: unknown;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  cta_text: string | null;
  cta_url: string | null;
  cta_type: string | null;
  funnel_stage: string | null;
  template_type: string | null;
  parent_slug: string | null;
  is_pillar: boolean;
  cluster_topic: string | null;
  keyword_target: string | null;
  search_volume: number | null;
  keyword_difficulty: number | null;
  internal_links: unknown;
  content_score: number | null;
  word_count: number | null;
  reading_time: number | null;
  last_optimized: string | null;
  optimization_notes: string | null;

  // Raw fields blob, also exposed
  fields: Record<string, unknown>;
}

// ---- Collection-id resolver (cached) ---------------------------------------

let collectionsMapPromise: Promise<Map<string, string>> | null = null;

export async function getCollectionsMap(): Promise<Map<string, string>> {
  if (collectionsMapPromise) return collectionsMapPromise;
  if (!supabaseEnabled) {
    collectionsMapPromise = Promise.resolve(new Map());
    return collectionsMapPromise;
  }
  collectionsMapPromise = (async () => {
    const { data, error } = await supabase
      .from("cms_collections")
      .select("id, slug")
      .eq("project_id", "rule27")
      .eq("is_active", true);
    if (error) {
      console.warn("[cms] getCollectionsMap failed:", error.message);
      return new Map();
    }
    const map = new Map<string, string>();
    for (const row of data ?? []) {
      map.set((row as { slug: string }).slug, (row as { id: string }).id);
    }
    return map;
  })();
  return collectionsMapPromise;
}

async function resolveCollectionId(collectionSlug: string): Promise<string | null> {
  const map = await getCollectionsMap();
  return map.get(collectionSlug) ?? null;
}

// Force-refresh — call after seeding new collections
export function invalidateCollectionsMap(): void {
  collectionsMapPromise = null;
}

// ---- Row → CmsItem boundary helper ---------------------------------------

/**
 * Spread the row's `fields` JSONB onto the row so consumers can read
 * `item.meta_title`, `item.sections`, etc. without juggling the JSONB blob.
 * The raw blob remains accessible at `item.fields` for anything that needs it.
 */
function rowToItem(row: Record<string, unknown> | null | undefined): CmsItem | null {
  if (!row) return null;
  const fields = (row.fields as Record<string, unknown>) ?? {};
  return { ...row, ...fields, fields } as unknown as CmsItem;
}

// ---- Single item read ------------------------------------------------------

export async function getCmsItemBySlug(
  collectionSlug: string,
  itemSlug: string,
  opts: { includeUnpublished?: boolean } = {},
): Promise<CmsItem | null> {
  if (!supabaseEnabled) return null;
  const collectionId = await resolveCollectionId(collectionSlug);
  if (!collectionId) return null;

  let query = supabase
    .from("cms_collection_items")
    .select("*")
    .eq("project_id", "rule27")
    .eq("collection_id", collectionId)
    .eq("slug", itemSlug)
    .limit(1);

  if (!opts.includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) {
    console.warn(`[cms] getCmsItemBySlug(${collectionSlug}/${itemSlug}) failed:`, error.message);
    return null;
  }
  return rowToItem(data?.[0] as Record<string, unknown> | undefined);
}

// ---- Collection list (for sitemap / index pages) ---------------------------

export interface ListOpts {
  limit?: number;
  offset?: number;
  publishedOnly?: boolean;
  orderBy?: "published_at" | "updated_at" | "sort_order";
  ascending?: boolean;
  template_type?: string;
  parent_slug?: string;
  cluster_topic?: string;
  is_pillar?: boolean;
}

export async function getCmsItemsByCollection(
  collectionSlug: string,
  opts: ListOpts = {},
): Promise<CmsItem[]> {
  if (!supabaseEnabled) return [];
  const collectionId = await resolveCollectionId(collectionSlug);
  if (!collectionId) return [];

  const {
    limit = 100,
    offset = 0,
    publishedOnly = true,
    orderBy = "published_at",
    ascending = false,
    template_type,
    parent_slug,
    cluster_topic,
    is_pillar,
  } = opts;

  let query = supabase
    .from("cms_collection_items")
    .select("*")
    .eq("project_id", "rule27")
    .eq("collection_id", collectionId);

  if (publishedOnly) query = query.eq("published", true);
  // JSONB filters: PostgREST translates `fields->>key` to a text comparison.
  if (template_type) query = query.eq("fields->>template_type", template_type);
  if (parent_slug) query = query.eq("fields->>parent_slug", parent_slug);
  if (cluster_topic) query = query.eq("fields->>cluster_topic", cluster_topic);
  if (typeof is_pillar === "boolean") query = query.eq("fields->>is_pillar", String(is_pillar));

  const { data, error } = await query
    .order(orderBy, { ascending, nullsFirst: false })
    .range(offset, offset + limit - 1);
  if (error) {
    console.warn(`[cms] getCmsItemsByCollection(${collectionSlug}) failed:`, error.message);
    return [];
  }
  return (data ?? [])
    .map(r => rowToItem(r as Record<string, unknown>))
    .filter((x): x is CmsItem => x !== null);
}

// ---- Slugs only (for sitemap, generateStaticParams) ------------------------

export async function getAllSlugsForCollection(
  collectionSlug: string,
  opts: { publishedOnly?: boolean } = {},
): Promise<Array<{ slug: string; updated_at: string; published_at: string | null }>> {
  if (!supabaseEnabled) return [];
  const collectionId = await resolveCollectionId(collectionSlug);
  if (!collectionId) return [];

  let query = supabase
    .from("cms_collection_items")
    .select("slug, updated_at, published_at")
    .eq("project_id", "rule27")
    .eq("collection_id", collectionId);

  if (opts.publishedOnly !== false) query = query.eq("published", true);

  const { data, error } = await query.order("updated_at", { ascending: false }).limit(5000);
  if (error) {
    console.warn(`[cms] getAllSlugsForCollection(${collectionSlug}) failed:`, error.message);
    return [];
  }
  return (data ?? []) as Array<{ slug: string; updated_at: string; published_at: string | null }>;
}

// ---- Multi-collection slug listing (for sitemap_index, llms.txt) ----------

export async function getAllSlugsForCollections(
  collectionSlugs: string[],
): Promise<Map<string, Array<{ slug: string; updated_at: string; published_at: string | null }>>> {
  const result = new Map<string, Array<{ slug: string; updated_at: string; published_at: string | null }>>();
  for (const collectionSlug of collectionSlugs) {
    result.set(collectionSlug, await getAllSlugsForCollection(collectionSlug));
  }
  return result;
}

// ---- Related items (via parent_slug or cluster_topic) ----------------------

export async function getRelatedItems(
  collectionSlug: string,
  opts: {
    excludeSlug?: string;
    parent_slug?: string;
    cluster_topic?: string;
    limit?: number;
  },
): Promise<CmsItem[]> {
  const { excludeSlug, parent_slug, cluster_topic, limit = 6 } = opts;
  if (!parent_slug && !cluster_topic) return [];

  const items = await getCmsItemsByCollection(collectionSlug, {
    limit: limit + 1,
    parent_slug,
    cluster_topic,
  });
  return items.filter(item => item.slug !== excludeSlug).slice(0, limit);
}

// ---- URL prefix → collection slug routing -----------------------------------

/**
 * Maps a URL pathname (e.g. "/services/seo/phoenix") to the collection_slug
 * to look up in CMS. Used by the polymorphic [...slug] catch-all route.
 */
export function routeToCollection(pathSegments: string[]): { collectionSlug: string; itemSlug: string } | null {
  if (pathSegments.length === 0) return null;
  const [top, ...rest] = pathSegments;
  const itemSlug = rest.length > 0 ? rest.join("/") : top;

  // First-segment routing rules. Mirrors the sitemap convention.
  switch (top) {
    case "services":
      return { collectionSlug: "service-location", itemSlug: rest.join("/") || top };
    case "industries":
      return { collectionSlug: "industry", itemSlug: rest.join("/") || top };
    case "solutions":
      return { collectionSlug: "solution", itemSlug: rest.join("/") || top };
    case "technologies":
      return { collectionSlug: "technology", itemSlug: rest.join("/") || top };
    case "locations":
      return { collectionSlug: "location", itemSlug: rest.join("/") || top };
    case "answers":
      return { collectionSlug: "answer", itemSlug: rest.join("/") || top };
    case "guides":
      return { collectionSlug: "blog-post", itemSlug: rest.join("/") || top };
    case "blog":
      return { collectionSlug: "blog-post", itemSlug: rest.join("/") || top };
    case "compare":
      return { collectionSlug: "comparison", itemSlug: rest.join("/") || top };
    case "tools":
      return { collectionSlug: "tool", itemSlug: rest.join("/") || top };
    case "scenarios":
      return { collectionSlug: "scenario", itemSlug: rest.join("/") || top };
    case "faqs":
      return { collectionSlug: "faq-topic", itemSlug: rest.join("/") || top };
    default:
      return null;
  }
}

// ---- Constants for sitemap / llms.txt --------------------------------------

export const ALL_COLLECTIONS = [
  "service-location",
  "industry",
  "solution",
  "technology",
  "location",
  "case-study",
  "faq-topic",
  "answer",
  "blog-post",
  "comparison",
  "tool",
  "scenario",
] as const;

export type CollectionSlug = typeof ALL_COLLECTIONS[number];

/**
 * Maps a CMS collection_slug to the URL path prefix used by the catch-all route.
 * Used by sitemap generation + .md mirror routing.
 */
export const COLLECTION_TO_URL_PREFIX: Record<string, string> = {
  "service-location": "/services",
  "industry": "/industries",
  "solution": "/solutions",
  "technology": "/technologies",
  "location": "/locations",
  "case-study": "/case-studies",
  "faq-topic": "/faqs",
  "answer": "/answers",
  "blog-post": "/blog",
  "comparison": "/compare",
  "tool": "/tools",
  "scenario": "/scenarios",
};

export function urlForItem(collectionSlug: string, itemSlug: string): string {
  const prefix = COLLECTION_TO_URL_PREFIX[collectionSlug];
  if (!prefix) return `/${itemSlug}`;
  return `${prefix}/${itemSlug}`;
}
