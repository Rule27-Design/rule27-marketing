-- ============================================================================
-- MIGRATION: Add conversion funnel fields to services table
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Before/after comparison images
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS before_image text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS after_image text;

-- Lead magnet / downloadable asset
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS lead_magnet_title text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS lead_magnet_description text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS lead_magnet_url text;

-- ROI calculation formula (interactive "How we calculate" card)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS roi_formula jsonb;
-- Format: {
--   "title": "How We Calculate Your Return",
--   "inputs": ["Monthly Traffic", "Conversion Rate", "Avg Deal Value"],
--   "formula": "traffic × conversion_rate × deal_value × 12",
--   "example": {
--     "inputs": {"Monthly Traffic": "5,000", "Conversion Rate": "3%", "Avg Deal Value": "$2,500"},
--     "result": "$375,000/yr",
--     "explanation": "With 5,000 monthly visitors converting at 3%, each worth $2,500..."
--   }
-- }

-- Custom conversion breaks (positioned between sections)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS conversion_breaks jsonb DEFAULT '[]';
-- Format: [
--   {"position": "after_metrics", "text": "Curious how your numbers compare?", "cta": "See where you stand", "action": "calendly"},
--   {"position": "after_features", "text": "Download our playbook", "cta": "Get the guide", "action": "link", "href": "/downloads/playbook.pdf"},
--   {"position": "after_testimonials", "text": "Ready to get started?", "cta": "Book a free call", "action": "calendly"}
-- ]

-- Tooltip definitions for data points
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tooltip_definitions jsonb DEFAULT '{}';
-- Format: {
--   "pages_indexed": "Each page is a door to a customer searching for what you sell. More pages = more doors.",
--   "organic_traffic": "Visitors who find you through Google search - not ads, not social, not referrals.",
--   "conversion_rate": "The percentage of visitors who take a desired action - call, form fill, purchase."
-- }

-- ============================================================================
-- DONE. All fields are optional - services without data render as before.
-- ============================================================================
