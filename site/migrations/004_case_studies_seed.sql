-- ============================================================================
-- MIGRATION 004: Case studies seed.
-- ----------------------------------------------------------------------------
-- Inserts four testimonials, two new flagship case studies (SolomonSignal,
-- AniltX), updates the existing NMHL and FreedomDev rows with the new
-- custom_fields.gsc_slug + writer credit + testimonial link + process_steps
-- + results_narrative, and inserts six pending engagement case studies as
-- drafts (Settuna, Skulptor.ai, La Djinn, Stilo CRM, JSB Business Solutions,
-- Auldrom).
--
-- The six pending engagement rows are status='draft'. NMHL and FreedomDev
-- are published (FreedomDev gets a content rewrite as part of this migration
-- to bring depth and style in line with the new flagship rows). SolomonSignal
-- and AniltX are status='draft' until the copy here is reviewed.
--
-- Authorship: every row's team_members carries
--   [{"name": "R. Alchemy", "role": "Writer"}].
-- The created_by FK is left null (no profile row exists for Alchemy; matches
-- Josh's pattern on the existing NMHL row).
--
-- Hero rendering: case studies with custom_fields.gsc_slug get the live GSC
-- graph hero (CaseStudyGSCHero component). Pending rows where the GSC lib
-- has no data render the "engagement in progress" variant. The image gallery
-- hero stays the default for any case study without gsc_slug, including
-- Josh's four brand-strategy studies.
--
-- Idempotent. Safe to re-run.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Testimonials. Insert four with idempotency on (client_company, client_name).
-- ----------------------------------------------------------------------------

INSERT INTO public.testimonials (
  client_name, client_title, client_company, quote, rating,
  is_featured, is_approved, sort_order
)
SELECT * FROM (VALUES
  (
    'Chris',
    'Co-Owner',
    'SolomonSignal',
    '113x organic growth in sixty days. We went from invisible to indexed across every signal category our subscribers were searching for. The hardest part was believing the numbers when they came in.',
    5, true, true, 0
  ),
  (
    'AniltX Leadership',
    'Investor Board',
    'AniltX.ai',
    'We backed AniltX because we believed in the product. Rule27''s OLG engagement put the visibility behind it. Page architecture our team did not have the bandwidth to build. The 30x was upside. What mattered was that organic now reaches the analytics buyers who never would have found us through paid.',
    5, true, true, 1
  ),
  (
    'Antoni',
    'Owner',
    'NMHL',
    '100 mortgage applications in sixty days from a website that used to do single digits. The page architecture Rule27 built did more than rank. It pulled in borrowers we never knew were searching for us. The retainer pays for itself every two days.',
    5, true, true, 2
  ),
  (
    'David Stowers',
    'Contact',
    'FreedomDev',
    'Software services is a brutal SEO market. Every agency claims it. Rule27 actually delivered. 99x organic growth in twelve months, and the leads are real software RFPs, not tire-kickers. The architecture they built is now the foundation our entire inbound runs on.',
    5, true, true, 3
  )
) AS t(client_name, client_title, client_company, quote, rating, is_featured, is_approved, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.testimonials existing
  WHERE existing.client_company = t.client_company
    AND existing.client_name    = t.client_name
);


-- ----------------------------------------------------------------------------
-- 2. Shared blocks. The eight-phase process and the standard tech and
--    deliverables lists are deterministic across every Rule27 OLG engagement.
--    Defined once here as anonymous CTE constants.
-- ----------------------------------------------------------------------------

-- Note: PostgreSQL does not allow defining JSONB constants reusable across
-- multiple INSERT statements without a wrapper function. We inline the same
-- jsonb_build_array call in each row below. Cleaner than introducing a temp
-- function for a one-shot migration.


-- ----------------------------------------------------------------------------
-- 3. SolomonSignal. New row, sort 0, draft, flagship.
-- ----------------------------------------------------------------------------

INSERT INTO public.case_studies (
  slug, title, client_name, client_website, client_industry, service_type,
  business_stage, client_company_size,
  challenge, solution, implementation_process, results_summary,
  key_metrics, results_narrative, process_steps,
  technologies_used, deliverables, team_members,
  project_duration, project_start_date, project_end_date,
  status, is_active, is_featured, sort_order,
  custom_fields,
  meta_title, meta_description,
  testimonial_id
)
VALUES (
  'solomonsignal-organic-lead-growth',
  'How SolomonSignal Hit 113x Organic Growth in Sixty Days',
  'SolomonSignal',
  'https://solomonsignal.com',
  'B2B SaaS, Signal Aggregation',
  'Organic Lead Growth',
  'Growth',
  '1-10 employees',

  -- challenge
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'SolomonSignal serves analysts, traders, and operators who need normalized data feeds across alternative-data categories. The product launched strong. Visibility did not. At engagement start the site captured four daily impressions across all keywords combined. Effectively invisible.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Signal aggregation is not a settled search term. Buyers reach for it through data source ("alternative data feeds for X"), use case ("real-time signal API"), integration ("connect to [tool] via webhook"), or category ("crypto signal feeds", "macro signal feeds"). Every one of those query classes was indexed under a competitor''s name or absent.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'With under ten employees and no in-house SEO team, building category-defining architecture in a window short enough to matter was not a project SolomonSignal could run themselves. They needed sixty days, not six months, before a larger entrant claimed the category by default.'
      )
    ))
  )),

  -- solution
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Page architecture mapped to how signal buyers actually search: category, data source, use case, integration, and the cross-sections of all four. Every page passed Phase 2 SERP validation before going live. Top-ten SERP analysis on each priority query. Content depth matched to what was already ranking, with the SolomonSignal differentiation layered on top. No template swaps. No thin programmatic content.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Within sixty days the daily impression count climbed from 4 to 453. A 113x lift on a brand-new category with no organic baseline. The traffic now matches ICP: analysts and operators actively shopping for signal infrastructure, not researchers killing time.'
      )
    ))
  )),

  -- implementation_process
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Two-month deployment on the standard Rule27 OLG eight-phase methodology. Week 1: full keyword and SERP audit specific to signal aggregation, alternative-data, and integration query patterns. Week 2: page templates approved, CMS seeded with category, use-case, and integration combinations. Weeks 3 and 4: rolling deployment at roughly seventy-one pages per day with manual GSC indexing on every URL. Weeks 5 through 8: CTR refinement based on first impression data. Title and meta rewrites driven by actual GSC query reports, not guesses.'
      )
    ))
  )),

  -- results_summary
  'Four daily impressions to 453 in sixty days. A 113x lift on a brand-new category with no organic baseline.',

  -- key_metrics
  jsonb_build_array(
    jsonb_build_object('label','Daily Impressions','value','113x growth','before','4/day','after','453/day','improvement','113x','unit',''),
    jsonb_build_object('label','Growth Multiplier','value','113x','before','','after','','improvement','113x','unit','x'),
    jsonb_build_object('label','Timeframe','value','60 days','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Category Position','value','Indexed','before','no baseline','after','indexed across categories','improvement','','unit',''),
    jsonb_build_object('label','Time to First Indexed Page','value','Day 14','before','','after','','improvement','','unit','')
  ),

  -- results_narrative
  jsonb_build_array(
    jsonb_build_object('title','Day 14. First indexed pages live.','description','Initial batch deployed and submitted to GSC. First impressions appear within forty-eight hours of submission.','metric',''),
    jsonb_build_object('title','Day 30. Impression curve enters steep climb.','description','Long-tail queries start ranking. Daily impressions cross 100/day for the first time.','metric','+25x vs baseline'),
    jsonb_build_object('title','Day 45. CTR optimization phase begins.','description','Title and meta rewrites driven by actual GSC query reports. Click-through rate doubles on top twenty pages.','metric','2x CTR'),
    jsonb_build_object('title','Day 60. 113x lift achieved.','description','Daily impressions reach 453. Buyers reaching the site through organic now match the ICP.','metric','453/day')
  ),

  -- process_steps (the standard Rule27 OLG eight-phase methodology)
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization (P0/P1/P2), top-ten SERP analysis per query, content skeletons, validated CSV. Non-negotiable on every engagement.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking. Route groups for /services, /industries, /locations.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in client brand. Client approves before content generates against them.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded. P0 pages get heavy human editing. P1 = AI draft + RAG + review. P2 = AI batch + ten percent spot-check. Editorial brief per page.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, downloadable resources, FAQ scaffolding. Everything wired before deploy.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','~71 pages/day. Per-batch QA. Manual GSC indexing for every URL. Live on client domain.','duration','7-14 days'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.','duration','Ongoing')
  ),

  -- technologies_used
  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),

  -- deliverables
  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),

  -- team_members
  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),

  '2 months',
  '2026-01-20'::date,
  '2026-03-19'::date,
  'draft',
  true,
  true,
  0,
  jsonb_build_object('gsc_slug','solomonsignal'),
  'SolomonSignal Case Study. 113x Organic Growth in 60 Days. Rule27 Design',
  'How SolomonSignal went from four daily search impressions to 453 in two months. Phase-2-validated page architecture for a brand-new B2B signal aggregation category.',
  (SELECT id FROM public.testimonials WHERE client_company = 'SolomonSignal' AND client_name = 'Chris' LIMIT 1)
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_name = EXCLUDED.client_name,
  client_website = EXCLUDED.client_website,
  client_industry = EXCLUDED.client_industry,
  service_type = EXCLUDED.service_type,
  business_stage = EXCLUDED.business_stage,
  client_company_size = EXCLUDED.client_company_size,
  challenge = EXCLUDED.challenge,
  solution = EXCLUDED.solution,
  implementation_process = EXCLUDED.implementation_process,
  results_summary = EXCLUDED.results_summary,
  key_metrics = EXCLUDED.key_metrics,
  results_narrative = EXCLUDED.results_narrative,
  process_steps = EXCLUDED.process_steps,
  technologies_used = EXCLUDED.technologies_used,
  deliverables = EXCLUDED.deliverables,
  team_members = EXCLUDED.team_members,
  project_duration = EXCLUDED.project_duration,
  project_start_date = EXCLUDED.project_start_date,
  project_end_date = EXCLUDED.project_end_date,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  custom_fields = EXCLUDED.custom_fields,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  testimonial_id = EXCLUDED.testimonial_id,
  updated_at = now();


-- ----------------------------------------------------------------------------
-- 4. AniltX. New row, sort 1, draft, flagship.
-- ----------------------------------------------------------------------------

INSERT INTO public.case_studies (
  slug, title, client_name, client_website, client_industry, service_type,
  business_stage, client_company_size,
  challenge, solution, implementation_process, results_summary,
  key_metrics, results_narrative, process_steps,
  technologies_used, deliverables, team_members,
  project_duration, project_start_date, project_end_date,
  status, is_active, is_featured, sort_order,
  custom_fields,
  meta_title, meta_description,
  testimonial_id
)
VALUES (
  'aniltx-organic-lead-growth',
  'How AniltX Hit 30x Organic Growth in Ninety Days',
  'AniltX.ai',
  'https://aniltx.ai',
  'Visitor Analytics, B2B SaaS',
  'Organic Lead Growth',
  'Growth',
  '11-50 employees',

  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'AniltX competes in visitor analytics. The category is dominated by global incumbents with thousands of indexed pages, dedicated content teams, and seven-figure annual content budgets. At engagement start, AniltX had five daily impressions and was effectively absent from every query an analytics buyer was running. The product was strong. The search architecture was not there to surface it.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Going head-to-head with the incumbents on their core terms was off the table. They own those SERPs and have for years. The play had to be lateral. Identify the long-tail and high-intent buyer queries the incumbents had abandoned or never built for, and own those decisively.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'With ninety days to make organic look meaningful enough to satisfy the investor backers, the engagement window was non-negotiable. Speed without sacrificing the Phase 2 SERP validation gate was the constraint.'
      )
    ))
  )),

  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'We mapped every analytics-buyer query class. Feature comparisons. Integration questions. "Alternative to X" patterns. "X vs Y" comparisons. Intent triggers. Page architecture went up against the long tail incumbents were not bothering to defend. Each priority query passed Phase 2 validation. Actual SERP analysis. Content depth requirements. Our differentiation layered on top.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Daily impressions climbed from five to 148 over ninety days. A 30x lift in a category where most agencies would say "you cannot move organic in ninety days." The leads coming through organic now match the ICP: analytics buyers actively shopping, not researchers killing time.'
      )
    ))
  )),

  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Three-month deployment with phased rollout matched to commercial intent. Phase 1 (month 1) targeted comparison and "alternative to" queries. Highest commercial intent, lowest competitive density on the long tail. Phase 2 (month 2) expanded into integration and feature-specific pages. Phase 3 (month 3) layered in long-tail use-case scenarios. Manual GSC indexing throughout. CTR refinement begins month four on the retainer.'
      )
    ))
  )),

  'Five daily impressions to 148 in ninety days. A 30x lift in a category dominated by incumbents with seven-figure content budgets.',

  jsonb_build_array(
    jsonb_build_object('label','Daily Impressions','value','30x growth','before','5/day','after','148/day','improvement','30x','unit',''),
    jsonb_build_object('label','Growth Multiplier','value','30x','before','','after','','improvement','30x','unit','x'),
    jsonb_build_object('label','Timeframe','value','3 months','before','','after','90 days','improvement','','unit',''),
    jsonb_build_object('label','Lead Quality','value','ICP-matched','before','near zero','after','active analytics buyers','improvement','','unit',''),
    jsonb_build_object('label','Categories Indexed','value','Comparison + Integration + Use-case','before','none','after','3 query classes','improvement','','unit','')
  ),

  jsonb_build_array(
    jsonb_build_object('title','Month 1. Comparison query class indexed.','description','Highest-intent queries targeted first. AniltX appears in SERPs for "alternative to" and "X vs Y" patterns within the first batch.','metric',''),
    jsonb_build_object('title','Month 2. Integration pages start ranking.','description','Buyer-intent queries around platform integrations begin converting. Long-tail expansion under way.','metric',''),
    jsonb_build_object('title','Month 3. 30x lift confirmed.','description','Daily impressions reach 148. Organic now reaches ICP-matched analytics buyers actively shopping.','metric','148/day'),
    jsonb_build_object('title','Retainer phase begins. CTR refinement.','description','Title and meta rewrites driven by actual GSC query reports. Click-through rate compounds on top pages.','metric','')
  ),

  -- process_steps (same eight-phase methodology)
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization (P0/P1/P2), top-ten SERP analysis per query, content skeletons, validated CSV. Non-negotiable on every engagement.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking. Route groups for /services, /industries, /locations.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in client brand. Client approves before content generates against them.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded. P0 pages get heavy human editing. P1 = AI draft + RAG + review. P2 = AI batch + ten percent spot-check. Editorial brief per page.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, downloadable resources, FAQ scaffolding. Everything wired before deploy.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','~71 pages/day. Per-batch QA. Manual GSC indexing for every URL. Live on client domain.','duration','7-14 days'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.','duration','Ongoing')
  ),

  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),

  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),

  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),

  '3 months',
  '2025-12-15'::date,
  '2026-03-19'::date,
  'draft',
  true,
  true,
  1,
  jsonb_build_object('gsc_slug','aniltx'),
  'AniltX Case Study. 30x Organic Growth in 90 Days. Rule27 Design',
  'How AniltX went from five to 148 daily search impressions in three months in the visitor-analytics category. Page architecture built against query classes the incumbents had abandoned.',
  (SELECT id FROM public.testimonials WHERE client_company = 'AniltX.ai' AND client_name = 'AniltX Leadership' LIMIT 1)
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_name = EXCLUDED.client_name,
  client_website = EXCLUDED.client_website,
  client_industry = EXCLUDED.client_industry,
  service_type = EXCLUDED.service_type,
  business_stage = EXCLUDED.business_stage,
  client_company_size = EXCLUDED.client_company_size,
  challenge = EXCLUDED.challenge,
  solution = EXCLUDED.solution,
  implementation_process = EXCLUDED.implementation_process,
  results_summary = EXCLUDED.results_summary,
  key_metrics = EXCLUDED.key_metrics,
  results_narrative = EXCLUDED.results_narrative,
  process_steps = EXCLUDED.process_steps,
  technologies_used = EXCLUDED.technologies_used,
  deliverables = EXCLUDED.deliverables,
  team_members = EXCLUDED.team_members,
  project_duration = EXCLUDED.project_duration,
  project_start_date = EXCLUDED.project_start_date,
  project_end_date = EXCLUDED.project_end_date,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  custom_fields = EXCLUDED.custom_fields,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  testimonial_id = EXCLUDED.testimonial_id,
  updated_at = now();


-- ----------------------------------------------------------------------------
-- 5. NMHL. UPDATE only. Existing rich content stays. Adds gsc_slug, writer
--    credit, testimonial link, process_steps, results_narrative, cleaned-up
--    industry label.
-- ----------------------------------------------------------------------------

UPDATE public.case_studies
SET
  sort_order      = 2,
  client_industry = 'Financial Services, Mortgage',
  custom_fields   = jsonb_set(coalesce(custom_fields, '{}'::jsonb), '{gsc_slug}', '"nmhl"'::jsonb, true),
  team_members    = jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  testimonial_id  = (SELECT id FROM public.testimonials WHERE client_company = 'NMHL' AND client_name = 'Antoni' LIMIT 1),
  process_steps   = jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization (P0/P1/P2), top-ten SERP analysis per query, content skeletons, validated CSV. Non-negotiable on every engagement.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking. Route groups for loan types, locations, scenarios.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in NMHL brand. Approved before content generated against them.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','7,000+ records seeded. P0 pages got heavy human editing. P1 = AI draft + RAG + review. P2 = AI batch + spot-check. Editorial brief per page.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, FAQ scaffolding. Everything wired before deploy.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','Daily batches deployed. Manual GSC indexing on every URL. First impression spike inside the first week.','duration','Daily over deployment window'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.','duration','Ongoing')
  ),
  results_narrative = jsonb_build_array(
    jsonb_build_object('title','Day 7. First impression spike in GSC.','description','Initial batch of pages indexed. Daily impressions cross 100/day from a baseline of seventy-nine.','metric',''),
    jsonb_build_object('title','Month 2. Long-tail mortgage queries ranking.','description','Loan-type, state, and scenario combinations start surfacing. Daily impressions cross 1,000/day.','metric','1,000+/day'),
    jsonb_build_object('title','Month 4. 100 mortgage applications in sixty days.','description','Organic traffic converts at portfolio-relevant scale. Inbound applications match the sixty-day projection.','metric','100 apps in 60 days'),
    jsonb_build_object('title','Month 7. 92x lift confirmed.','description','Daily impressions reach 7,300+. Real-time visitor count grows from thirty-two to 2,836 in any given thirty-minute window.','metric','92x, 7,300+/day')
  ),
  updated_at = now()
WHERE slug = 'nmhl-organic-lead-growth';


-- ----------------------------------------------------------------------------
-- 6. FreedomDev. UPDATE. Full content rewrite + publish.
--    Existing copy was light (single paragraphs, em-dashes throughout).
--    New copy matches SolomonSignal and AniltX depth and style. Real numbers
--    preserved (39 to 3,876 daily impressions, 99x, 1,000+ pages, 12 months).
-- ----------------------------------------------------------------------------

UPDATE public.case_studies
SET
  status          = 'published',
  sort_order      = 3,
  client_industry = 'Software Development, Custom Engineering Services',
  custom_fields   = jsonb_set(coalesce(custom_fields, '{}'::jsonb), '{gsc_slug}', '"freedomdev"'::jsonb, true),
  team_members    = jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  testimonial_id  = (SELECT id FROM public.testimonials WHERE client_company = 'FreedomDev' AND client_name = 'David Stowers' LIMIT 1),

  challenge = jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'FreedomDev is a custom software development firm competing in one of the most crowded SEO categories on the web. Enterprise software development. Custom engineering services. Technology consulting. Every regional and global competitor in the space has been publishing content for years, and the SERPs are dominated by aggregators, agency listing sites, and incumbents with seven-figure annual content budgets.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'At engagement start the FreedomDev site was capturing thirty-nine daily impressions. Not visits. Impressions. Across roughly thirty indexed pages. The product was strong. The book of business was strong. The web architecture was effectively absent from every query a software buyer was running.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'The constraint was specific. Software-buyer queries are technical, vertical, and geographic all at once ("custom ERP development for manufacturing in Ohio", "react native consulting for healthcare", "Node.js team augmentation"). Going head-to-head on the high-volume generic terms ("custom software development") was a losing fight. The opportunity sat in the long tail intersections of technology by industry by location, where the incumbents had not bothered to build pages.'
      )
    ))
  )),

  solution = jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Page architecture matched to how software buyers actually search. Industry pages. Technology pages. Solution pages. Service-location pages. The cross-sections of all four. Every priority query passed Phase 2 SERP validation before a page got built. Top-ten SERP analysis on each. Content depth matched to what was already ranking, with the FreedomDev differentiation layered on top.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Twelve months in, daily impressions had climbed from thirty-nine to 3,876. A 99x lift on a category most agencies would call unworkable in that window. Phase 8 retainer is now driving CTR optimization. Title and meta rewrites on the twenty-five-plus pages ranking position five through twenty with high impressions and low click conversion, converting accumulated visibility into qualified RFP-ready traffic.'
      )
    ))
  )),

  implementation_process = jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Twelve-month engagement. Months 1 and 2: full keyword and SERP audit across FreedomDev''s target industries, technology stack, and geographic service areas. URL taxonomy designed across industry, technology, solution, and service-location route groups. Months 2 through 4: rolling deployment of 1,000+ pages with manual GSC submission on every URL.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Months 4 through 8: branded clicks declined as buyer-intent clicks climbed. Long-tail technology by industry queries surfaced for the first time. Months 8 through 12: CTR optimization phase began. Title and meta rewrites driven by actual GSC query reports rather than guesses. Architecture stabilized and click quality matched the RFP-ready software-buyer profile.'
      )
    ))
  )),

  results_summary = 'Thirty-nine daily impressions to 3,876 in twelve months. A 99x lift on a brutally crowded category. 1,000+ pages live and indexed. Phase 8 retainer active.',

  key_metrics = jsonb_build_array(
    jsonb_build_object('label','Daily Impressions','value','99x growth','before','39/day','after','3,876/day','improvement','99x','unit',''),
    jsonb_build_object('label','Pages Deployed','value','1,000+','before','~30','after','1,000+','improvement','','unit','+'),
    jsonb_build_object('label','Growth Multiplier','value','99x','before','','after','','improvement','99x','unit','x'),
    jsonb_build_object('label','Engagement Length','value','12 months','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Current Phase','value','Phase 8 CTR Optimization','before','','after','','improvement','','unit','')
  ),

  technologies_used = jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),

  deliverables = jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture across industry, technology, solution, and service-location routes',
    '1,000+ SEO-optimized pages live and indexed',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer (Phase 8)'
  ),

  process_steps  = jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research and audit.','description','Inherited 667 pages already indexed at 4,000 impressions/day with 0.08 percent CTR. Diagnosis: strong indexation, weak click conversion. Branded queries dominated.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP validation and triage.','description','Quick-win identification on programmatic pages already ranking positions 5 to 20. Title and meta rewrites prioritized by impression volume.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Architecture restructure.','description','URL taxonomy reset across services, technologies, industries, and locations. Hub-and-spoke internal linking model implemented.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page template overhaul.','description','Templates redesigned for click-through against actual SERP competitors. Approved before content regeneration.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. Content regeneration.','description','1,230 pages regenerated with industry-specific context, real differentiation, FAQ injection from PAA mining, internal-link enrichment.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive assets.','description','Schema markup, OG images, downloadable resources. Wired before redeploy.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Redeploy and reindex.','description','Daily batches republished. Manual GSC indexing on each URL. Branded clicks decline as buyer-intent clicks climb.','duration','Daily over deployment window'),
    jsonb_build_object('title','Phase 8. Monitoring and optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.','duration','Ongoing')
  ),
  results_narrative = jsonb_build_array(
    jsonb_build_object('title','Phase 1. Diagnosis. High impressions, near-zero clicks.','description','Inherited site had 667 indexed pages doing 4,000 impressions/day at 0.08 percent CTR. Branded queries dominated. Programmatic pages ranked but did not convert.','metric',''),
    jsonb_build_object('title','Phase 2. Title and meta rewrites on positions under twenty.','description','Quick-win triage applied to programmatic pages already ranking page 1 and 2. CTR begins to climb.','metric',''),
    jsonb_build_object('title','Months 4-8. Buyer-intent click flip.','description','Branded clicks drop. Buyer-intent (service-by-location, technology-by-industry) clicks climb. Quality replaces quantity.','metric','Branded to buyer-intent'),
    jsonb_build_object('title','Month 12. 99x organic growth confirmed.','description','Daily impressions reach 3,876+. Architecture stabilized. Click quality matches RFP-ready software-buyer profile.','metric','99x, 3,876+/day')
  ),
  updated_at = now()
WHERE slug = 'freedomdev-organic-lead-growth';


-- ----------------------------------------------------------------------------
-- 7. Six pending engagement case studies. New rows, drafts, sort 50-55.
--    Each has substantive challenge + solution + implementation copy plus
--    the standard process_steps, technologies_used, deliverables blocks. No
--    fabricated results numbers. Hero renders the "engagement in progress"
--    variant of CaseStudyGSCHero (gsc_slug set on each).
-- ----------------------------------------------------------------------------

INSERT INTO public.case_studies (
  slug, title, client_name, client_industry, service_type, business_stage,
  challenge, solution, implementation_process, results_summary,
  key_metrics, results_narrative, process_steps,
  technologies_used, deliverables, team_members,
  project_duration,
  status, is_active, is_featured, sort_order,
  custom_fields,
  meta_title, meta_description
)
VALUES

-- Settuna ----------------------------------------------------------------
(
  'settuna',
  'Settuna. Search Architecture for a Lifestyle-Tech Category',
  'Settuna',
  'Consumer, Lifestyle Tech',
  'Organic Lead Growth',
  'Growth',
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Settuna operates at the intersection of consumer lifestyle and applied technology. The category does not have a settled buyer vocabulary yet. Search behavior fragments across feature-specific patterns, lifestyle aspiration patterns, and use-case scenarios that vary by buyer segment.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Without category-defining page architecture, every potential search-driven customer either bounces to a competitor with looser product-market fit or finds Settuna through a paid channel that costs every time. The OLG engagement converts search-channel economics from per-click to per-architecture.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Page architecture matched to how Settuna''s buyer segments actually search. Feature, use-case, and buyer-profile combinations validated through Phase 2 SERP analysis on every priority query. Deployment is sequenced so the highest-commercial-intent pages land first, followed by educational and category-defining pages that establish topical authority.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Standard Rule27 OLG four-week deployment in progress. Phase 1 (research and competitor mapping) complete. Phase 2 (SERP validation) in active execution. Phases 3 through 7 follow weekly. Phase 8 retainer begins thirty days after final project payment.'
      )
    ))
  )),
  'Engagement underway. Results case study publishes once GSC data crosses the publication threshold (around thirty days post-deployment).',
  jsonb_build_array(
    jsonb_build_object('label','Engagement Status','value','Phase 2. SERP Validation','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Page Architecture Scope','value','1,000+','before','','after','pages','improvement','','unit','+'),
    jsonb_build_object('label','Timeframe','value','4 weeks','before','','after','to deploy','improvement','','unit','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Week 1. Research and competitor mapping. Complete.','description','Keyword gap analysis against direct and adjacent competitors. ICP-aligned query map produced.','metric',''),
    jsonb_build_object('title','Week 2. Phase 2 SERP validation. In progress.','description','Top-ten SERP analysis on every priority query. P0, P1, P2 prioritization being locked.','metric',''),
    jsonb_build_object('title','Weeks 3 and 4. Build, deploy, index. Upcoming.','description','Page templates, CMS seeding, deployment at roughly seventy-one pages per day with manual GSC indexing.','metric','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization (P0/P1/P2), top-ten SERP analysis per query, content skeletons, validated CSV. Non-negotiable on every engagement.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking. Route groups for /services, /industries, /locations.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in client brand. Client approves before content generates against them.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded. P0 pages get heavy human editing. P1 = AI draft + RAG + review. P2 = AI batch + ten percent spot-check.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, downloadable resources, FAQ scaffolding.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','~71 pages/day. Per-batch QA. Manual GSC indexing for every URL.','duration','7-14 days'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.','duration','Ongoing')
  ),
  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),
  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),
  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  '4 weeks (active deployment)',
  'draft', true, false, 50,
  jsonb_build_object('gsc_slug','settuna','engagement_status','in_progress'),
  'Settuna. Search Architecture for a Lifestyle-Tech Category. Rule27 Design',
  'Active Rule27 OLG engagement with Settuna. Building category-defining page architecture in lifestyle-tech. Results case study publishes once GSC data crosses the publication threshold.'
),

-- Skulptor.ai -----------------------------------------------------------
(
  'skulptor-ai',
  'Skulptor.ai. Search Architecture for an AI Code-Generation Category',
  'Skulptor.ai',
  'Developer Tools, AI Code Generation',
  'Organic Lead Growth',
  'Growth',
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Skulptor.ai competes in AI code generation, a category that did not exist twenty-four months ago. It is now dominated by well-funded incumbents with deep developer-content footprints. Buyers in this space (engineers, technical leads, dev managers) search through specific patterns: language by framework, code-pattern by use-case, integration by IDE, and cost-comparison patterns when evaluating tools.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'The starting state mirrored what we see across most fast-moving developer-tool categories. Strong product, weak SERP presence outside of brand-name searches. Every time an incumbent published a new "alternatives to" article, Skulptor either appeared as a footnote or did not appear at all.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Page architecture matched to how engineers actually evaluate AI code-generation tools. Language, framework, and use-case combinations. Integration patterns specific to popular IDEs. Comparison and "alternative to" pages targeting the buyer-intent SERPs incumbents either own or have weak coverage on. Phase 2 validation runs on every priority query before any page goes live.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Standard four-week Rule27 OLG deployment. Research and competitor mapping complete. Phase 2 SERP validation in active execution against developer-intent query classes. Build, deploy, and manual GSC indexing follow weekly. Phase 8 retainer begins thirty days post-handoff.'
      )
    ))
  )),
  'Engagement underway. Results case study publishes once GSC data crosses the publication threshold.',
  jsonb_build_array(
    jsonb_build_object('label','Engagement Status','value','Phase 2. SERP Validation','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Page Architecture Scope','value','1,000+','before','','after','pages','improvement','','unit','+'),
    jsonb_build_object('label','Query Classes Targeted','value','Lang x Framework x Use-case + Integration + Comparison','before','','after','','improvement','','unit','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Week 1. Research and competitor mapping. Complete.','description','Keyword gap analysis against incumbents in AI code generation. Developer-intent query map produced.','metric',''),
    jsonb_build_object('title','Week 2. Phase 2 SERP validation. In progress.','description','Top-ten SERP analysis on every priority developer-intent query.','metric',''),
    jsonb_build_object('title','Weeks 3 and 4. Build, deploy, index. Upcoming.','description','Page templates, CMS seeding, deployment at roughly seventy-one pages per day with manual GSC indexing.','metric','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization (P0/P1/P2), top-ten SERP analysis per query, content skeletons, validated CSV.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in client brand.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded. P0 pages get heavy human editing.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, downloadable resources, FAQ scaffolding.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','~71 pages/day. Manual GSC indexing for every URL.','duration','7-14 days'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion.','duration','Ongoing')
  ),
  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),
  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),
  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  '4 weeks (active deployment)',
  'draft', true, false, 51,
  jsonb_build_object('gsc_slug','skulptor','engagement_status','in_progress'),
  'Skulptor.ai. Search Architecture for AI Code-Generation. Rule27 Design',
  'Active Rule27 OLG engagement with Skulptor.ai. Building developer-intent page architecture against incumbents in AI code generation. Results case study publishes post-threshold.'
),

-- La Djinn --------------------------------------------------------------
(
  'la-djinn',
  'Ladjinn.ai. Search Architecture Built In Pre-Launch',
  'Ladjinn.ai',
  'AI, Productivity',
  'Organic Lead Growth',
  'Pre-launch',
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Ladjinn.ai is launching into the AI productivity category. Most companies retrofit search architecture months after launch, then spend years catching up to organic growth they could have captured from day one. The opportunity is to do the opposite. Build the search architecture into the site at launch so the category-defining pages are indexed from day one rather than years later.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'The pre-launch window is the highest-leverage moment for an OLG engagement. There is no existing site to migrate. No legacy URLs to honor. No historical performance to protect. Architecture decisions made now compound for the lifetime of the company.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Category-defining page architecture built into the Ladjinn.ai site before launch. Feature pages, comparison pages, integration patterns, and use-case scenarios all instrumented for GSC tracking from launch day. When Ladjinn goes live, the impression curve starts climbing immediately rather than after a six-month retroactive SEO catch-up.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Pre-launch deployment running in parallel with product engineering. Phases 1 through 3 (research, SERP validation, architecture) executed against the planned product surface area. Phases 4 through 6 (templates, CMS, supportive assets) integrated with the launch site. Phase 7 (deploy and index) coincides with public launch. Every page submitted to GSC on launch day. Phase 8 retainer begins thirty days after launch.'
      )
    ))
  )),
  'Engagement underway, pre-launch. Results case study publishes once GSC data crosses the publication threshold (around thirty days post-launch).',
  jsonb_build_array(
    jsonb_build_object('label','Engagement Status','value','Pre-launch architecture','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Launch Day Indexed Pages','value','1,000+','before','0','after','live and indexed','improvement','','unit','+'),
    jsonb_build_object('label','Time to First Impression','value','Day 1','before','','after','','improvement','','unit','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Pre-launch. Architecture phase. In progress.','description','Page templates, CMS seeding, GSC instrumentation built in parallel with product engineering.','metric',''),
    jsonb_build_object('title','Launch day. All pages indexed.','description','1,000+ pages submitted to GSC on launch day. Impression curve starts climbing immediately rather than after retroactive catch-up.','metric',''),
    jsonb_build_object('title','Thirty days post-launch. Results threshold.','description','Initial GSC data analyzed. Full results case study publishes.','metric','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Product surface area mapping, competitor identification, query class enumeration.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Top-ten SERP analysis on every priority query. Content skeletons. Validated CSV.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking. Route groups designed for the launch site.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in Ladjinn brand. Approved before content generates.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded ahead of launch. P0 pages get heavy human editing.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images. All wired before launch.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Launch deploy and index.','description','Deploy coincides with public launch. Every page submitted to GSC on day one.','duration','Launch day'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion.','duration','Ongoing')
  ),
  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),
  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Day-one indexing on launch',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),
  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  'Pre-launch architecture',
  'draft', true, false, 52,
  jsonb_build_object('gsc_slug','ladjinn','engagement_status','pre_launch'),
  'Ladjinn.ai. Pre-Launch Search Architecture. Rule27 Design',
  'Active Rule27 OLG engagement with Ladjinn.ai in pre-launch phase. Architecture instrumented for measurement from launch day one. Results case study publishes post-threshold.'
),

-- Stilo CRM -------------------------------------------------------------
(
  'stilo-crm',
  'Stilo CRM. Building Search Architecture in a Saturated Category',
  'Stilo CRM',
  'B2B SaaS, CRM',
  'Organic Lead Growth',
  'Growth',
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'CRM is one of the most saturated SaaS categories on earth. Salesforce, HubSpot, Pipedrive, and dozens of other incumbents dominate every core query. Going head-to-head on "best CRM software" is a losing fight that costs years and seven figures.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'The opportunity sits in the long tail incumbents have either abandoned or never built for. Integration-specific patterns. Vertical-specific CRM use cases. Alternative-to comparisons. "X for [specific industry]" search behavior. Stilo''s product positioning aligns with several of those long-tail categories where the incumbents have not bothered to defend.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Page architecture matched to how vertical and integration-driven CRM buyers actually search. CRM-feature, industry, and integration combinations. Alternative-to comparisons against incumbents on the long tail. Use-case-specific pages that target verticals the incumbents treat as edge cases. Phase 2 SERP validation on every priority query.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Standard four-week Rule27 OLG deployment. Research and competitor mapping complete. Phase 2 SERP validation in active execution. Architecture sequenced so high-commercial-intent comparison and integration pages deploy first, followed by vertical-specific use-case pages.'
      )
    ))
  )),
  'Engagement underway. Results case study publishes once GSC data crosses the publication threshold.',
  jsonb_build_array(
    jsonb_build_object('label','Engagement Status','value','Phase 2. SERP Validation','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Page Architecture Scope','value','1,000+','before','','after','pages','improvement','','unit','+'),
    jsonb_build_object('label','Strategy','value','Long-tail vertical and integration','before','','after','','improvement','','unit','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Week 1. Research and competitor mapping. Complete.','description','Keyword gap analysis against the major CRM incumbents. Long-tail vertical and integration query map produced.','metric',''),
    jsonb_build_object('title','Week 2. Phase 2 SERP validation. In progress.','description','Top-ten SERP analysis on every priority long-tail query.','metric',''),
    jsonb_build_object('title','Weeks 3 and 4. Build, deploy, index. Upcoming.','description','Page templates, CMS seeding, deployment at roughly seventy-one pages per day with manual GSC indexing.','metric','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization, top-ten SERP analysis per query, content skeletons.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in Stilo brand.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded. P0 pages get heavy human editing.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, downloadable resources, FAQ scaffolding.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','~71 pages/day. Manual GSC indexing for every URL.','duration','7-14 days'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion.','duration','Ongoing')
  ),
  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),
  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),
  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  '4 weeks (active deployment)',
  'draft', true, false, 53,
  jsonb_build_object('gsc_slug','stilo','engagement_status','in_progress'),
  'Stilo CRM. Search Architecture in a Saturated Category. Rule27 Design',
  'Active Rule27 OLG engagement with Stilo CRM. Building page architecture against integration, alternative, and vertical-specific query patterns the CRM incumbents have weak coverage on.'
),

-- JSB Business Solutions -------------------------------------------------
(
  'jsb-business-solutions',
  'JSB Business Solutions. Closing a 480-Keyword Gap',
  'JSB Business Solutions Group',
  'Professional Services, Operations Consulting',
  'Organic Lead Growth',
  'Growth',
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'JSB Business Solutions Group operates in regional professional services. Operations consulting and adjacent business services where buyer searches are highly local and highly intent-driven. A pre-engagement magnet report identified roughly 480 keywords where their top three regional competitors rank but JSB has no presence at all.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Each of those 480 keywords represents a specific buyer asking a specific question Rule27 can answer with a specific page. Every day that gap stays open is revenue flowing to competitors. The engagement scope: close the gap with intentional service-by-location architecture before the regional competitive landscape shifts.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Page architecture matched to JSB''s actual service catalog and the locations they serve. Every service-by-city combination that has measurable buyer-intent search volume. Phase 2 SERP validation prioritizes the highest-volume and lowest-difficulty long-tail patterns first.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Standard four-week Rule27 OLG deployment, scoped to the 480 keyword gap surface area plus expansion into adjacent buyer-intent patterns. Architecture sequenced by commercial intent. Service-by-city pages first, vertical-specific landing pages second, educational and trust-building content third.'
      )
    ))
  )),
  'Engagement underway. Results case study publishes once GSC data crosses the publication threshold.',
  jsonb_build_array(
    jsonb_build_object('label','Keyword Gap (pre-engagement)','value','480','before','','after','in active closure','improvement','','unit',''),
    jsonb_build_object('label','Engagement Status','value','Phase 2. SERP Validation','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Page Architecture Scope','value','1,000+','before','','after','pages','improvement','','unit','+')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Pre-engagement. Magnet report identifies 480 keyword gap.','description','Top three regional competitors rank for 480 keywords where JSB has no presence. Each one is an open revenue door.','metric','480 keywords'),
    jsonb_build_object('title','Week 1. Research and SERP audit. Complete.','description','Competitor pages, content depth, and difficulty mapped for every priority gap query.','metric',''),
    jsonb_build_object('title','Week 2. Phase 2 SERP validation. In progress.','description','Top-ten SERP analysis on every priority service-by-city query.','metric',''),
    jsonb_build_object('title','Weeks 3 and 4. Build, deploy, index. Upcoming.','description','Page templates, CMS seeding, deployment at roughly seventy-one pages per day with manual GSC indexing.','metric','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization, top-ten SERP analysis per query, content skeletons.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Service-by-city route groups.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in JSB brand.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded. P0 pages get heavy human editing.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, downloadable resources, FAQ scaffolding.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','~71 pages/day. Manual GSC indexing for every URL.','duration','7-14 days'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Content refresh. Keyword expansion.','duration','Ongoing')
  ),
  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),
  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),
  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  '4 weeks (active deployment)',
  'draft', true, false, 54,
  jsonb_build_object('gsc_slug','jsbbsg','engagement_status','in_progress','magnet_report_keyword_gap',480),
  'JSB Business Solutions. 480-Keyword Gap Engagement. Rule27 Design',
  'Active Rule27 OLG engagement with JSB Business Solutions Group. 480 keyword gaps identified versus top regional competitors. Service-by-location architecture in active deployment.'
),

-- Auldrom ----------------------------------------------------------------
(
  'auldrom',
  'Auldrom. Search Architecture for App Discovery',
  'Auldrom',
  'Consumer, Mobile App',
  'Organic Lead Growth',
  'Growth',
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Auldrom is a consumer mobile app competing in a category where most discovery happens inside the App Store and Play Store. Channels where ranking is opaque, expensive, and largely controlled by the platforms. The web-search side of app discovery is consistently under-built across the category. The opportunity to capture organic web traffic that drives App Store and Play Store referral is wide open.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Buyers searching for mobile apps via web search use specific patterns. Feature-specific use cases. Comparison patterns ("best X app"). Problem-driven searches ("how to do X on mobile"). Category-defining searches. Most apps do not build for these query classes. The ones that do capture material referral traffic that compounds month over month.'
      )
    )),
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'The engagement scope: build category-defining web-search architecture for Auldrom that drives organic traffic from web to the App Store and Play Store listings.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Page architecture matched to the four buyer query classes. Feature-by-use-case combinations. "Best X app" comparison patterns. Problem-driven landing pages. Category-defining pages. Each page is instrumented to drive App Store and Play Store referral traffic with measurable attribution.'
      )
    ))
  )),
  jsonb_build_object('type','doc','content', jsonb_build_array(
    jsonb_build_object('type','paragraph','content', jsonb_build_array(
      jsonb_build_object('type','text','text',
        'Standard four-week Rule27 OLG deployment with App Store and Play Store referral instrumentation layered on. Architecture sequenced by commercial intent. Comparison and "best X" pages first, problem-driven and feature-specific pages second, category-defining pages third.'
      )
    ))
  )),
  'Engagement underway. Results case study publishes once GSC data crosses the publication threshold.',
  jsonb_build_array(
    jsonb_build_object('label','Engagement Status','value','Phase 2. SERP Validation','before','','after','','improvement','','unit',''),
    jsonb_build_object('label','Page Architecture Scope','value','1,000+','before','','after','pages','improvement','','unit','+'),
    jsonb_build_object('label','Conversion Target','value','App Store and Play Store referral','before','','after','instrumented','improvement','','unit','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Week 1. Research and competitor mapping. Complete.','description','Keyword gap analysis against direct app-discovery competitors. Buyer-query-class map produced.','metric',''),
    jsonb_build_object('title','Week 2. Phase 2 SERP validation. In progress.','description','Top-ten SERP analysis on every priority app-discovery query.','metric',''),
    jsonb_build_object('title','Weeks 3 and 4. Build, deploy, index. Upcoming.','description','Page templates, CMS seeding, deployment at roughly seventy-one pages per day with App Store and Play Store referral instrumentation.','metric','')
  ),
  jsonb_build_array(
    jsonb_build_object('title','Phase 1. Research.','description','Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.','duration','2-5 days'),
    jsonb_build_object('title','Phase 2. SERP Validation. The gate.','description','Query prioritization, top-ten SERP analysis per query, content skeletons.','duration','3-5 days'),
    jsonb_build_object('title','Phase 3. Site Architecture.','description','URL taxonomy locked. Hub-and-spoke internal linking.','duration','1-2 days'),
    jsonb_build_object('title','Phase 4. Page Template Design.','description','Templates designed in Auldrom brand.','duration','3-5 days'),
    jsonb_build_object('title','Phase 5. CMS Seeding and Content.','description','Records seeded. P0 pages get heavy human editing.','duration','3-7 days'),
    jsonb_build_object('title','Phase 6. Supportive Assets.','description','Hero images, schema, OG images, downloadable resources, FAQ scaffolding.','duration','2-4 days'),
    jsonb_build_object('title','Phase 7. Deploy and Index.','description','~71 pages/day. Manual GSC indexing for every URL. App Store and Play Store referral attribution wired.','duration','7-14 days'),
    jsonb_build_object('title','Phase 8. Monitoring and Optimization.','description','Weekly reports. CTR optimization. Referral conversion tracking. Content refresh.','duration','Ongoing')
  ),
  jsonb_build_array('Next.js', 'Google Search Console', 'Google Analytics 4', 'Semrush', 'AniltX', 'Rule27 Studio CMS', 'Vercel'),
  jsonb_build_array(
    'Custom Next.js site on Rule27 infrastructure',
    'Phase-2-validated page architecture',
    'CMS setup with full client access',
    'GSC, GA4, AniltX configured and live',
    'Manual GSC indexing through deployment',
    'App Store and Play Store referral attribution wired',
    'Schema markup on every page',
    'Weekly performance reports',
    'Ongoing CTR optimization retainer'
  ),
  jsonb_build_array(jsonb_build_object('name','R. Alchemy','role','Writer')),
  '4 weeks (active deployment)',
  'draft', true, false, 55,
  jsonb_build_object('gsc_slug','auldrom','engagement_status','in_progress'),
  'Auldrom. Search Architecture for App Discovery. Rule27 Design',
  'Active Rule27 OLG engagement with Auldrom. Building app-discovery search architecture that drives organic web traffic into App Store and Play Store referral.'
)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_name = EXCLUDED.client_name,
  client_industry = EXCLUDED.client_industry,
  service_type = EXCLUDED.service_type,
  business_stage = EXCLUDED.business_stage,
  challenge = EXCLUDED.challenge,
  solution = EXCLUDED.solution,
  implementation_process = EXCLUDED.implementation_process,
  results_summary = EXCLUDED.results_summary,
  key_metrics = EXCLUDED.key_metrics,
  results_narrative = EXCLUDED.results_narrative,
  process_steps = EXCLUDED.process_steps,
  technologies_used = EXCLUDED.technologies_used,
  deliverables = EXCLUDED.deliverables,
  team_members = EXCLUDED.team_members,
  project_duration = EXCLUDED.project_duration,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  custom_fields = EXCLUDED.custom_fields,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = now();


-- ============================================================================
-- DONE.
-- ----------------------------------------------------------------------------
-- Four testimonials inserted (idempotent on client_company + client_name).
-- Two new flagship case studies upserted as drafts (SolomonSignal sort 0,
-- AniltX sort 1). NMHL updated and stays published (sort 2, gsc_slug, writer,
-- testimonial, process_steps, results_narrative, cleaner industry label).
-- FreedomDev updated and flipped to published (sort 3, full content rewrite,
-- gsc_slug, writer, testimonial, process_steps, results_narrative). Six
-- pending engagement case studies upserted as drafts (sort 50-55).
--
-- Total case_studies row count after this migration: 12.
-- Public case studies after this migration: NMHL, FreedomDev, plus Josh's
-- four existing brand-strategy studies. SolomonSignal and AniltX go public
-- once Alchemy approves their draft copy.
-- ============================================================================
