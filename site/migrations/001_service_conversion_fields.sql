-- ============================================================================
-- MIGRATION: Add conversion-focused fields to services & service_zones
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ─── 1. SERVICES TABLE - New conversion columns ────────────────────────────

-- Hero & visual storytelling
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS hero_image text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS showcase_images text[] DEFAULT '{}';

-- Social proof & results
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS avg_roi text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS avg_timeline text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS clients_served integer DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS satisfaction_rate numeric(4,1);
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS success_metrics jsonb DEFAULT '[]';
-- success_metrics format: [{"label": "Avg Conversion Lift", "value": "+234%"}, ...]

-- Trust & urgency
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS guarantee text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS availability text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS turnaround text;

-- Related case studies (manual curation)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS related_case_study_ids uuid[] DEFAULT '{}';

-- Service-specific FAQs
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]';
-- faqs format: [{"q": "How long does this take?", "a": "Typically 2-4 weeks..."}, ...]


-- ─── 2. SERVICE ZONES TABLE - Conversion columns ───────────────────────────

ALTER TABLE public.service_zones ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE public.service_zones ADD COLUMN IF NOT EXISTS hero_image text;
ALTER TABLE public.service_zones ADD COLUMN IF NOT EXISTS total_clients integer DEFAULT 0;
ALTER TABLE public.service_zones ADD COLUMN IF NOT EXISTS avg_satisfaction numeric(4,1);
ALTER TABLE public.service_zones ADD COLUMN IF NOT EXISTS featured_metric jsonb;
-- featured_metric format: {"label": "Average ROI", "value": "340%"}


-- ─── 3. SERVICE TESTIMONIALS TABLE - New table ─────────────────────────────

CREATE TABLE IF NOT EXISTS public.service_testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  client_name text NOT NULL,
  client_title text,
  client_company text,
  client_avatar text,
  quote text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  result_metric text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT service_testimonials_pkey PRIMARY KEY (id),
  CONSTRAINT service_testimonials_service_fkey
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_testimonials_service
  ON public.service_testimonials(service_id) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_service_testimonials_featured
  ON public.service_testimonials(is_featured) WHERE is_featured = true AND is_active = true;

-- Auto-update timestamp trigger
CREATE TRIGGER update_service_testimonials_updated_at
  BEFORE UPDATE ON public.service_testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─── 4. ROW LEVEL SECURITY (match your existing patterns) ──────────────────

ALTER TABLE public.service_testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access (matches your other tables)
CREATE POLICY "Public can read active service testimonials"
  ON public.service_testimonials
  FOR SELECT
  USING (is_active = true);

-- Service role full access
CREATE POLICY "Service role full access to service testimonials"
  ON public.service_testimonials
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- ============================================================================
-- DONE. After running this, populate the new fields:
--
-- For each service, fill in:
--   tagline        → Short punchy value prop ("Turn browsers into buyers")
--   hero_image     → URL to a hero background image
--   showcase_images→ Array of screenshot/mockup URLs
--   avg_roi        → "340%" or "3.4x return"
--   avg_timeline   → "Results in 30 days"
--   clients_served → Number like 127
--   satisfaction_rate → 98.5
--   success_metrics→ JSON array of {label, value} pairs
--   guarantee      → "30-day money back guarantee"
--   availability   → "3 slots remaining this month"
--   turnaround     → "Delivered in 2-4 weeks"
--   faqs           → JSON array of {q, a} pairs
--
-- For each service zone, fill in:
--   tagline        → "Where brands come to life"
--   hero_image     → URL to zone hero image
--   total_clients  → Total clients served in this zone
--   avg_satisfaction→ 98.5
--   featured_metric→ {"label": "Average ROI", "value": "340%"}
--
-- Then add rows to service_testimonials for each service.
-- ============================================================================
