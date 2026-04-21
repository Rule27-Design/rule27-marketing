-- ============================================================================
-- MIGRATION 003: CMS scaffold — collections + collection_items
-- ----------------------------------------------------------------------------
-- Future-proof CMS layer. Today, content lives in dedicated tables (case_studies,
-- articles, services, testimonials). This scaffold sets up a generic
-- collection / collection_items pattern so we can migrate incrementally —
-- one collection at a time — without disrupting existing fetchers.
--
-- This migration is ADDITIVE ONLY. It does not move any data. The dedicated
-- tables stay live and authoritative until a future migration explicitly
-- ports them.
-- ============================================================================

-- 1. Collections — metadata about each content type
CREATE TABLE IF NOT EXISTS public.cms_collections (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  description     text,
  schema          jsonb DEFAULT '{}'::jsonb,    -- field schema for validation / admin UI
  is_active       boolean DEFAULT true,
  sort_order      int DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 2. Collection items — polymorphic content rows
CREATE TABLE IF NOT EXISTS public.cms_collection_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id   uuid NOT NULL REFERENCES public.cms_collections(id) ON DELETE CASCADE,
  slug            text NOT NULL,
  title           text NOT NULL,
  status          text DEFAULT 'draft',         -- draft | scheduled | published | archived
  is_active       boolean DEFAULT true,
  is_featured     boolean DEFAULT false,
  sort_order      int DEFAULT 0,
  data            jsonb DEFAULT '{}'::jsonb,    -- the content payload (per-collection schema)
  custom_fields   jsonb DEFAULT '{}'::jsonb,    -- escape hatch for ad-hoc fields (matches case_studies pattern)
  meta            jsonb DEFAULT '{}'::jsonb,    -- SEO meta (title, description, og, schema markup)
  created_by      uuid,
  updated_by      uuid,
  approved_by     uuid,
  approved_at     timestamptz,
  scheduled_at    timestamptz,
  published_at    timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  view_count      int DEFAULT 0,
  unique_view_count int DEFAULT 0,
  UNIQUE (collection_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_cms_collection_items_collection ON public.cms_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_cms_collection_items_status     ON public.cms_collection_items(status);
CREATE INDEX IF NOT EXISTS idx_cms_collection_items_featured   ON public.cms_collection_items(is_featured) WHERE is_featured = true;

-- 3. Seed the four core collection types so the structure exists for future
--    migration scripts to reference. No actual content is moved here.
INSERT INTO public.cms_collections (slug, name, description, sort_order)
VALUES
  ('case_studies', 'Case Studies', 'Long-form client outcomes. Live source: public.case_studies table. Eligible for future port.', 1),
  ('articles',     'Articles',     'Insights & long-form content. Live source: public.articles table.',                                  2),
  ('services',     'Services',     'Service catalog. Live source: public.services table.',                                                3),
  ('testimonials', 'Testimonials', 'Client quotes. Live source: public.testimonials table.',                                              4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- DONE. Tables exist, four collection types seeded, no content moved.
-- ============================================================================
