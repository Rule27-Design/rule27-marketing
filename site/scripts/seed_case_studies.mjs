// One-shot seed script for migration 004.
// Run from /site:  node scripts/seed_case_studies.mjs
// Uses SUPABASE_SERVICE_ROLE_KEY from .env to bypass RLS.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env manually (no dotenv dep needed).
const envText = readFileSync(resolve(process.cwd(), ".env"), "utf8");
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ---------------------------------------------------------------------------
// Tiptap doc helper.
// ---------------------------------------------------------------------------
const doc = (...paragraphs) => ({
  type: "doc",
  content: paragraphs.map((text) => ({
    type: "paragraph",
    content: [{ type: "text", text }],
  })),
});

// ---------------------------------------------------------------------------
// Standard reusable blocks across all 8 case studies.
// ---------------------------------------------------------------------------
const STANDARD_PROCESS = [
  { title: "Phase 1. Research.", description: "Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.", duration: "2-5 days" },
  { title: "Phase 2. SERP Validation. The gate.", description: "Query prioritization (P0/P1/P2), top-ten SERP analysis per query, content skeletons, validated CSV. Non-negotiable on every engagement.", duration: "3-5 days" },
  { title: "Phase 3. Site Architecture.", description: "URL taxonomy locked. Hub-and-spoke internal linking. Route groups for /services, /industries, /locations.", duration: "1-2 days" },
  { title: "Phase 4. Page Template Design.", description: "Templates designed in client brand. Client approves before content generates against them.", duration: "3-5 days" },
  { title: "Phase 5. CMS Seeding and Content.", description: "Records seeded. P0 pages get heavy human editing. P1 = AI draft + RAG + review. P2 = AI batch + ten percent spot-check. Editorial brief per page.", duration: "3-7 days" },
  { title: "Phase 6. Supportive Assets.", description: "Hero images, schema, OG images, downloadable resources, FAQ scaffolding. Everything wired before deploy.", duration: "2-4 days" },
  { title: "Phase 7. Deploy and Index.", description: "~71 pages/day. Per-batch QA. Manual GSC indexing for every URL. Live on client domain.", duration: "7-14 days" },
  { title: "Phase 8. Monitoring and Optimization.", description: "Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.", duration: "Ongoing" },
];

const STANDARD_TECH = ["Next.js", "Google Search Console", "Google Analytics 4", "Semrush", "AniltX", "Rule27 Studio CMS", "Vercel"];

const STANDARD_DELIVERABLES = [
  "Custom Next.js site on Rule27 infrastructure",
  "Phase-2-validated page architecture",
  "CMS setup with full client access",
  "GSC, GA4, AniltX configured and live",
  "Manual GSC indexing through deployment",
  "Schema markup on every page",
  "Weekly performance reports",
  "Ongoing CTR optimization retainer",
];

const ALCHEMY_TEAM = [{ name: "R. Alchemy", role: "Writer" }];

const PENDING_KEY_METRICS = [
  { label: "Engagement Status", value: "Phase 2. SERP Validation", before: "", after: "", improvement: "", unit: "" },
  { label: "Page Architecture Scope", value: "1,000+", before: "", after: "pages", improvement: "", unit: "+" },
  { label: "Timeframe", value: "4 weeks", before: "", after: "to deploy", improvement: "", unit: "" },
];

const PENDING_NARRATIVE = [
  { title: "Week 1. Research and competitor mapping. Complete.", description: "Keyword gap analysis against direct and adjacent competitors. ICP-aligned query map produced.", metric: "" },
  { title: "Week 2. Phase 2 SERP validation. In progress.", description: "Top-ten SERP analysis on every priority query. P0, P1, P2 prioritization being locked.", metric: "" },
  { title: "Weeks 3 and 4. Build, deploy, index. Upcoming.", description: "Page templates, CMS seeding, deployment at roughly seventy-one pages per day with manual GSC indexing.", metric: "" },
];

// ---------------------------------------------------------------------------
// Step A: Testimonials. Idempotent on (client_company, client_name).
// ---------------------------------------------------------------------------
async function step_testimonials() {
  console.log("\n=== A. Testimonials ===");
  const want = [
    {
      client_name: "Chris",
      client_title: "Co-Owner",
      client_company: "SolomonSignal",
      quote: "113x organic growth in sixty days. We went from invisible to indexed across every signal category our subscribers were searching for. The hardest part was believing the numbers when they came in.",
      rating: 5, is_featured: true, status: "published", sort_order: 0,
    },
    {
      client_name: "AniltX Leadership",
      client_title: "Investor Board",
      client_company: "AniltX.ai",
      quote: "We backed AniltX because we believed in the product. Rule27's OLG engagement put the visibility behind it. Page architecture our team did not have the bandwidth to build. The 30x was upside. What mattered was that organic now reaches the analytics buyers who never would have found us through paid.",
      rating: 5, is_featured: true, status: "published", sort_order: 1,
    },
    {
      client_name: "Antoni",
      client_title: "Owner",
      client_company: "NMHL",
      quote: "100 mortgage applications in sixty days from a website that used to do single digits. The page architecture Rule27 built did more than rank. It pulled in borrowers we never knew were searching for us. The retainer pays for itself every two days.",
      rating: 5, is_featured: true, status: "published", sort_order: 2,
    },
    {
      client_name: "David Stowers",
      client_title: "Contact",
      client_company: "FreedomDev",
      quote: "Software services is a brutal SEO market. Every agency claims it. Rule27 actually delivered. 99x organic growth in twelve months, and the leads are real software RFPs, not tire-kickers. The architecture they built is now the foundation our entire inbound runs on.",
      rating: 5, is_featured: true, status: "published", sort_order: 3,
    },
  ];

  const ids = {};
  for (const t of want) {
    const { data: existing } = await sb
      .from("testimonials")
      .select("id")
      .eq("client_company", t.client_company)
      .eq("client_name", t.client_name)
      .maybeSingle();
    if (existing) {
      console.log(`  exists: ${t.client_company} / ${t.client_name} -> ${existing.id}`);
      ids[t.client_company] = existing.id;
    } else {
      const { data, error } = await sb.from("testimonials").insert(t).select("id").single();
      if (error) throw new Error(`testimonial insert failed for ${t.client_company}: ${error.message}`);
      console.log(`  inserted: ${t.client_company} / ${t.client_name} -> ${data.id}`);
      ids[t.client_company] = data.id;
    }
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Step B/C/G: Case study payloads.
// ---------------------------------------------------------------------------
function payload_solomonsignal(testimonialId) {
  return {
    slug: "solomonsignal-organic-lead-growth",
    title: "How SolomonSignal Hit 113x Organic Growth in Sixty Days",
    client_name: "SolomonSignal",
    client_website: "https://solomonsignal.com",
    client_industry: "B2B SaaS, Signal Aggregation",
    service_type: "Organic Lead Growth",
    business_stage: "Growth",
    client_company_size: "1-10 employees",
    challenge: doc(
      "SolomonSignal serves analysts, traders, and operators who need normalized data feeds across alternative-data categories. The product launched strong. Visibility did not. At engagement start the site captured four daily impressions across all keywords combined. Effectively invisible.",
      "Signal aggregation is not a settled search term. Buyers reach for it through data source (\"alternative data feeds for X\"), use case (\"real-time signal API\"), integration (\"connect to [tool] via webhook\"), or category (\"crypto signal feeds\", \"macro signal feeds\"). Every one of those query classes was indexed under a competitor's name or absent.",
      "With under ten employees and no in-house SEO team, building category-defining architecture in a window short enough to matter was not a project SolomonSignal could run themselves. They needed sixty days, not six months, before a larger entrant claimed the category by default.",
    ),
    solution: doc(
      "Page architecture mapped to how signal buyers actually search: category, data source, use case, integration, and the cross-sections of all four. Every page passed Phase 2 SERP validation before going live. Top-ten SERP analysis on each priority query. Content depth matched to what was already ranking, with the SolomonSignal differentiation layered on top. No template swaps. No thin programmatic content.",
      "Within sixty days the daily impression count climbed from 4 to 453. A 113x lift on a brand-new category with no organic baseline. The traffic now matches ICP: analysts and operators actively shopping for signal infrastructure, not researchers killing time.",
    ),
    implementation_process: doc(
      "Two-month deployment on the standard Rule27 OLG eight-phase methodology. Week 1: full keyword and SERP audit specific to signal aggregation, alternative-data, and integration query patterns. Week 2: page templates approved, CMS seeded with category, use-case, and integration combinations. Weeks 3 and 4: rolling deployment at roughly seventy-one pages per day with manual GSC indexing on every URL. Weeks 5 through 8: CTR refinement based on first impression data. Title and meta rewrites driven by actual GSC query reports, not guesses.",
    ),
    results_summary: "Four daily impressions to 453 in sixty days. A 113x lift on a brand-new category with no organic baseline.",
    key_metrics: [
      { label: "Daily Impressions", value: "113x growth", before: "4/day", after: "453/day", improvement: "113x", unit: "" },
      { label: "Growth Multiplier", value: "113x", before: "", after: "", improvement: "113x", unit: "x" },
      { label: "Timeframe", value: "60 days", before: "", after: "", improvement: "", unit: "" },
      { label: "Category Position", value: "Indexed", before: "no baseline", after: "indexed across categories", improvement: "", unit: "" },
      { label: "Time to First Indexed Page", value: "Day 14", before: "", after: "", improvement: "", unit: "" },
    ],
    results_narrative: [
      { title: "Day 14. First indexed pages live.", description: "Initial batch deployed and submitted to GSC. First impressions appear within forty-eight hours of submission.", metric: "" },
      { title: "Day 30. Impression curve enters steep climb.", description: "Long-tail queries start ranking. Daily impressions cross 100/day for the first time.", metric: "+25x vs baseline" },
      { title: "Day 45. CTR optimization phase begins.", description: "Title and meta rewrites driven by actual GSC query reports. Click-through rate doubles on top twenty pages.", metric: "2x CTR" },
      { title: "Day 60. 113x lift achieved.", description: "Daily impressions reach 453. Buyers reaching the site through organic now match the ICP.", metric: "453/day" },
    ],
    process_steps: STANDARD_PROCESS,
    technologies_used: STANDARD_TECH,
    deliverables: STANDARD_DELIVERABLES,
    team_members: ALCHEMY_TEAM,
    project_duration: "2 months",
    project_start_date: "2026-01-20",
    project_end_date: "2026-03-19",
    status: "draft",
    is_active: true,
    is_featured: true,
    sort_order: 0,
    custom_fields: { gsc_slug: "solomonsignal" },
    meta_title: "SolomonSignal Case Study. 113x Organic Growth in 60 Days. Rule27 Design",
    meta_description: "How SolomonSignal went from four daily search impressions to 453 in two months. Phase-2-validated page architecture for a brand-new B2B signal aggregation category.",
    testimonial_id: testimonialId,
  };
}

function payload_aniltx(testimonialId) {
  return {
    slug: "aniltx-organic-lead-growth",
    title: "How AniltX Hit 30x Organic Growth in Ninety Days",
    client_name: "AniltX.ai",
    client_website: "https://aniltx.ai",
    client_industry: "Visitor Analytics, B2B SaaS",
    service_type: "Organic Lead Growth",
    business_stage: "Growth",
    client_company_size: "11-50 employees",
    challenge: doc(
      "AniltX competes in visitor analytics. The category is dominated by global incumbents with thousands of indexed pages, dedicated content teams, and seven-figure annual content budgets. At engagement start, AniltX had five daily impressions and was effectively absent from every query an analytics buyer was running. The product was strong. The search architecture was not there to surface it.",
      "Going head-to-head with the incumbents on their core terms was off the table. They own those SERPs and have for years. The play had to be lateral. Identify the long-tail and high-intent buyer queries the incumbents had abandoned or never built for, and own those decisively.",
      "With ninety days to make organic look meaningful enough to satisfy the investor backers, the engagement window was non-negotiable. Speed without sacrificing the Phase 2 SERP validation gate was the constraint.",
    ),
    solution: doc(
      "We mapped every analytics-buyer query class. Feature comparisons. Integration questions. \"Alternative to X\" patterns. \"X vs Y\" comparisons. Intent triggers. Page architecture went up against the long tail incumbents were not bothering to defend. Each priority query passed Phase 2 validation. Actual SERP analysis. Content depth requirements. Our differentiation layered on top.",
      "Daily impressions climbed from five to 148 over ninety days. A 30x lift in a category where most agencies would say \"you cannot move organic in ninety days.\" The leads coming through organic now match the ICP: analytics buyers actively shopping, not researchers killing time.",
    ),
    implementation_process: doc(
      "Three-month deployment with phased rollout matched to commercial intent. Phase 1 (month 1) targeted comparison and \"alternative to\" queries. Highest commercial intent, lowest competitive density on the long tail. Phase 2 (month 2) expanded into integration and feature-specific pages. Phase 3 (month 3) layered in long-tail use-case scenarios. Manual GSC indexing throughout. CTR refinement begins month four on the retainer.",
    ),
    results_summary: "Five daily impressions to 148 in ninety days. A 30x lift in a category dominated by incumbents with seven-figure content budgets.",
    key_metrics: [
      { label: "Daily Impressions", value: "30x growth", before: "5/day", after: "148/day", improvement: "30x", unit: "" },
      { label: "Growth Multiplier", value: "30x", before: "", after: "", improvement: "30x", unit: "x" },
      { label: "Timeframe", value: "3 months", before: "", after: "90 days", improvement: "", unit: "" },
      { label: "Lead Quality", value: "ICP-matched", before: "near zero", after: "active analytics buyers", improvement: "", unit: "" },
      { label: "Categories Indexed", value: "Comparison + Integration + Use-case", before: "none", after: "3 query classes", improvement: "", unit: "" },
    ],
    results_narrative: [
      { title: "Month 1. Comparison query class indexed.", description: "Highest-intent queries targeted first. AniltX appears in SERPs for \"alternative to\" and \"X vs Y\" patterns within the first batch.", metric: "" },
      { title: "Month 2. Integration pages start ranking.", description: "Buyer-intent queries around platform integrations begin converting. Long-tail expansion under way.", metric: "" },
      { title: "Month 3. 30x lift confirmed.", description: "Daily impressions reach 148. Organic now reaches ICP-matched analytics buyers actively shopping.", metric: "148/day" },
      { title: "Retainer phase begins. CTR refinement.", description: "Title and meta rewrites driven by actual GSC query reports. Click-through rate compounds on top pages.", metric: "" },
    ],
    process_steps: STANDARD_PROCESS,
    technologies_used: STANDARD_TECH,
    deliverables: STANDARD_DELIVERABLES,
    team_members: ALCHEMY_TEAM,
    project_duration: "3 months",
    project_start_date: "2025-12-15",
    project_end_date: "2026-03-19",
    status: "draft",
    is_active: true,
    is_featured: true,
    sort_order: 1,
    custom_fields: { gsc_slug: "aniltx" },
    meta_title: "AniltX Case Study. 30x Organic Growth in 90 Days. Rule27 Design",
    meta_description: "How AniltX went from five to 148 daily search impressions in three months in the visitor-analytics category. Page architecture built against query classes the incumbents had abandoned.",
    testimonial_id: testimonialId,
  };
}

function update_nmhl(testimonialId) {
  return {
    sort_order: 2,
    client_industry: "Financial Services, Mortgage",
    custom_fields: { gsc_slug: "nmhl" },
    team_members: ALCHEMY_TEAM,
    testimonial_id: testimonialId,
    process_steps: [
      { title: "Phase 1. Research.", description: "Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.", duration: "2-5 days" },
      { title: "Phase 2. SERP Validation. The gate.", description: "Query prioritization (P0/P1/P2), top-ten SERP analysis per query, content skeletons, validated CSV. Non-negotiable on every engagement.", duration: "3-5 days" },
      { title: "Phase 3. Site Architecture.", description: "URL taxonomy locked. Hub-and-spoke internal linking. Route groups for loan types, locations, scenarios.", duration: "1-2 days" },
      { title: "Phase 4. Page Template Design.", description: "Templates designed in NMHL brand. Approved before content generated against them.", duration: "3-5 days" },
      { title: "Phase 5. CMS Seeding and Content.", description: "7,000+ records seeded. P0 pages got heavy human editing. P1 = AI draft + RAG + review. P2 = AI batch + spot-check. Editorial brief per page.", duration: "3-7 days" },
      { title: "Phase 6. Supportive Assets.", description: "Hero images, schema, OG images, FAQ scaffolding. Everything wired before deploy.", duration: "2-4 days" },
      { title: "Phase 7. Deploy and Index.", description: "Daily batches deployed. Manual GSC indexing on every URL. First impression spike inside the first week.", duration: "Daily over deployment window" },
      { title: "Phase 8. Monitoring and Optimization.", description: "Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.", duration: "Ongoing" },
    ],
    results_narrative: [
      { title: "Day 7. First impression spike in GSC.", description: "Initial batch of pages indexed. Daily impressions cross 100/day from a baseline of seventy-nine.", metric: "" },
      { title: "Month 2. Long-tail mortgage queries ranking.", description: "Loan-type, state, and scenario combinations start surfacing. Daily impressions cross 1,000/day.", metric: "1,000+/day" },
      { title: "Month 4. 100 mortgage applications in sixty days.", description: "Organic traffic converts at portfolio-relevant scale. Inbound applications match the sixty-day projection.", metric: "100 apps in 60 days" },
      { title: "Month 7. 92x lift confirmed.", description: "Daily impressions reach 7,300+. Real-time visitor count grows from thirty-two to 2,836 in any given thirty-minute window.", metric: "92x, 7,300+/day" },
    ],
  };
}

function update_freedomdev(testimonialId) {
  return {
    status: "published",
    sort_order: 3,
    client_industry: "Software Development, Custom Engineering Services",
    custom_fields: { gsc_slug: "freedomdev" },
    team_members: ALCHEMY_TEAM,
    testimonial_id: testimonialId,
    challenge: doc(
      "FreedomDev is a custom software development firm competing in one of the most crowded SEO categories on the web. Enterprise software development. Custom engineering services. Technology consulting. Every regional and global competitor in the space has been publishing content for years, and the SERPs are dominated by aggregators, agency listing sites, and incumbents with seven-figure annual content budgets.",
      "At engagement start the FreedomDev site was capturing thirty-nine daily impressions. Not visits. Impressions. Across roughly thirty indexed pages. The product was strong. The book of business was strong. The web architecture was effectively absent from every query a software buyer was running.",
      "The constraint was specific. Software-buyer queries are technical, vertical, and geographic all at once (\"custom ERP development for manufacturing in Ohio\", \"react native consulting for healthcare\", \"Node.js team augmentation\"). Going head-to-head on the high-volume generic terms (\"custom software development\") was a losing fight. The opportunity sat in the long tail intersections of technology by industry by location, where the incumbents had not bothered to build pages.",
    ),
    solution: doc(
      "Page architecture matched to how software buyers actually search. Industry pages. Technology pages. Solution pages. Service-location pages. The cross-sections of all four. Every priority query passed Phase 2 SERP validation before a page got built. Top-ten SERP analysis on each. Content depth matched to what was already ranking, with the FreedomDev differentiation layered on top.",
      "Twelve months in, daily impressions had climbed from thirty-nine to 3,876. A 99x lift on a category most agencies would call unworkable in that window. Phase 8 retainer is now driving CTR optimization. Title and meta rewrites on the twenty-five-plus pages ranking position five through twenty with high impressions and low click conversion, converting accumulated visibility into qualified RFP-ready traffic.",
    ),
    implementation_process: doc(
      "Twelve-month engagement. Months 1 and 2: full keyword and SERP audit across FreedomDev's target industries, technology stack, and geographic service areas. URL taxonomy designed across industry, technology, solution, and service-location route groups. Months 2 through 4: rolling deployment of 1,000+ pages with manual GSC submission on every URL.",
      "Months 4 through 8: branded clicks declined as buyer-intent clicks climbed. Long-tail technology by industry queries surfaced for the first time. Months 8 through 12: CTR optimization phase began. Title and meta rewrites driven by actual GSC query reports rather than guesses. Architecture stabilized and click quality matched the RFP-ready software-buyer profile.",
    ),
    results_summary: "Thirty-nine daily impressions to 3,876 in twelve months. A 99x lift on a brutally crowded category. 1,000+ pages live and indexed. Phase 8 retainer active.",
    key_metrics: [
      { label: "Daily Impressions", value: "99x growth", before: "39/day", after: "3,876/day", improvement: "99x", unit: "" },
      { label: "Pages Deployed", value: "1,000+", before: "~30", after: "1,000+", improvement: "", unit: "+" },
      { label: "Growth Multiplier", value: "99x", before: "", after: "", improvement: "99x", unit: "x" },
      { label: "Engagement Length", value: "12 months", before: "", after: "", improvement: "", unit: "" },
      { label: "Current Phase", value: "Phase 8 CTR Optimization", before: "", after: "", improvement: "", unit: "" },
    ],
    results_narrative: [
      { title: "Phase 1. Diagnosis. High impressions, near-zero clicks.", description: "Inherited site had 667 indexed pages doing 4,000 impressions/day at 0.08 percent CTR. Branded queries dominated. Programmatic pages ranked but did not convert.", metric: "" },
      { title: "Phase 2. Title and meta rewrites on positions under twenty.", description: "Quick-win triage applied to programmatic pages already ranking page 1 and 2. CTR begins to climb.", metric: "" },
      { title: "Months 4-8. Buyer-intent click flip.", description: "Branded clicks drop. Buyer-intent (service-by-location, technology-by-industry) clicks climb. Quality replaces quantity.", metric: "Branded to buyer-intent" },
      { title: "Month 12. 99x organic growth confirmed.", description: "Daily impressions reach 3,876+. Architecture stabilized. Click quality matches RFP-ready software-buyer profile.", metric: "99x, 3,876+/day" },
    ],
    process_steps: [
      { title: "Phase 1. Research and audit.", description: "Inherited 667 pages already indexed at 4,000 impressions/day with 0.08 percent CTR. Diagnosis: strong indexation, weak click conversion. Branded queries dominated.", duration: "2-5 days" },
      { title: "Phase 2. SERP validation and triage.", description: "Quick-win identification on programmatic pages already ranking positions 5 to 20. Title and meta rewrites prioritized by impression volume.", duration: "3-5 days" },
      { title: "Phase 3. Architecture restructure.", description: "URL taxonomy reset across services, technologies, industries, and locations. Hub-and-spoke internal linking model implemented.", duration: "1-2 days" },
      { title: "Phase 4. Page template overhaul.", description: "Templates redesigned for click-through against actual SERP competitors. Approved before content regeneration.", duration: "3-5 days" },
      { title: "Phase 5. Content regeneration.", description: "1,230 pages regenerated with industry-specific context, real differentiation, FAQ injection from PAA mining, internal-link enrichment.", duration: "3-7 days" },
      { title: "Phase 6. Supportive assets.", description: "Schema markup, OG images, downloadable resources. Wired before redeploy.", duration: "2-4 days" },
      { title: "Phase 7. Redeploy and reindex.", description: "Daily batches republished. Manual GSC indexing on each URL. Branded clicks decline as buyer-intent clicks climb.", duration: "Daily over deployment window" },
      { title: "Phase 8. Monitoring and optimization.", description: "Weekly reports. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.", duration: "Ongoing" },
    ],
    technologies_used: STANDARD_TECH,
    deliverables: [
      "Custom Next.js site on Rule27 infrastructure",
      "Phase-2-validated page architecture across industry, technology, solution, and service-location routes",
      "1,000+ SEO-optimized pages live and indexed",
      "CMS setup with full client access",
      "GSC, GA4, AniltX configured and live",
      "Manual GSC indexing through deployment",
      "Schema markup on every page",
      "Weekly performance reports",
      "Ongoing CTR optimization retainer (Phase 8)",
    ],
  };
}

function pendingPayload(slug, title, client, industry, custom_fields, project_duration = "4 weeks (active deployment)") {
  return {
    slug,
    title,
    client_name: client,
    client_industry: industry,
    service_type: "Organic Lead Growth",
    business_stage: industry.includes("Pre-launch") ? "Pre-launch" : "Growth",
    challenge: doc("placeholder"),    // overridden below per client
    solution: doc("placeholder"),
    implementation_process: doc("placeholder"),
    results_summary: "Engagement underway. Results case study publishes once GSC data crosses the publication threshold.",
    key_metrics: PENDING_KEY_METRICS,
    results_narrative: PENDING_NARRATIVE,
    process_steps: STANDARD_PROCESS,
    technologies_used: STANDARD_TECH,
    deliverables: STANDARD_DELIVERABLES,
    team_members: ALCHEMY_TEAM,
    project_duration,
    status: "draft",
    is_active: true,
    is_featured: false,
    custom_fields,
  };
}

function payload_settuna() {
  const p = pendingPayload(
    "settuna",
    "Settuna. Search Architecture for a Lifestyle-Tech Category",
    "Settuna",
    "Consumer, Lifestyle Tech",
    { gsc_slug: "settuna", engagement_status: "in_progress" },
  );
  p.sort_order = 50;
  p.challenge = doc(
    "Settuna operates at the intersection of consumer lifestyle and applied technology. The category does not have a settled buyer vocabulary yet. Search behavior fragments across feature-specific patterns, lifestyle aspiration patterns, and use-case scenarios that vary by buyer segment.",
    "Without category-defining page architecture, every potential search-driven customer either bounces to a competitor with looser product-market fit or finds Settuna through a paid channel that costs every time. The OLG engagement converts search-channel economics from per-click to per-architecture.",
  );
  p.solution = doc(
    "Page architecture matched to how Settuna's buyer segments actually search. Feature, use-case, and buyer-profile combinations validated through Phase 2 SERP analysis on every priority query. Deployment is sequenced so the highest-commercial-intent pages land first, followed by educational and category-defining pages that establish topical authority.",
  );
  p.implementation_process = doc(
    "Standard Rule27 OLG four-week deployment in progress. Phase 1 (research and competitor mapping) complete. Phase 2 (SERP validation) in active execution. Phases 3 through 7 follow weekly. Phase 8 retainer begins thirty days after final project payment.",
  );
  p.meta_title = "Settuna. Search Architecture for a Lifestyle-Tech Category. Rule27 Design";
  p.meta_description = "Active Rule27 OLG engagement with Settuna. Building category-defining page architecture in lifestyle-tech. Results case study publishes once GSC data crosses the publication threshold.";
  return p;
}

function payload_skulptor() {
  const p = pendingPayload(
    "skulptor-ai",
    "Skulptor.ai. Search Architecture for an AI Code-Generation Category",
    "Skulptor.ai",
    "Developer Tools, AI Code Generation",
    { gsc_slug: "skulptor", engagement_status: "in_progress" },
  );
  p.sort_order = 51;
  p.challenge = doc(
    "Skulptor.ai competes in AI code generation, a category that did not exist twenty-four months ago. It is now dominated by well-funded incumbents with deep developer-content footprints. Buyers in this space (engineers, technical leads, dev managers) search through specific patterns: language by framework, code-pattern by use-case, integration by IDE, and cost-comparison patterns when evaluating tools.",
    "The starting state mirrored what we see across most fast-moving developer-tool categories. Strong product, weak SERP presence outside of brand-name searches. Every time an incumbent published a new \"alternatives to\" article, Skulptor either appeared as a footnote or did not appear at all.",
  );
  p.solution = doc(
    "Page architecture matched to how engineers actually evaluate AI code-generation tools. Language, framework, and use-case combinations. Integration patterns specific to popular IDEs. Comparison and \"alternative to\" pages targeting the buyer-intent SERPs incumbents either own or have weak coverage on. Phase 2 validation runs on every priority query before any page goes live.",
  );
  p.implementation_process = doc(
    "Standard four-week Rule27 OLG deployment. Research and competitor mapping complete. Phase 2 SERP validation in active execution against developer-intent query classes. Build, deploy, and manual GSC indexing follow weekly. Phase 8 retainer begins thirty days post-handoff.",
  );
  p.key_metrics = [
    { label: "Engagement Status", value: "Phase 2. SERP Validation", before: "", after: "", improvement: "", unit: "" },
    { label: "Page Architecture Scope", value: "1,000+", before: "", after: "pages", improvement: "", unit: "+" },
    { label: "Query Classes Targeted", value: "Lang x Framework x Use-case + Integration + Comparison", before: "", after: "", improvement: "", unit: "" },
  ];
  p.meta_title = "Skulptor.ai. Search Architecture for AI Code-Generation. Rule27 Design";
  p.meta_description = "Active Rule27 OLG engagement with Skulptor.ai. Building developer-intent page architecture against incumbents in AI code generation. Results case study publishes post-threshold.";
  return p;
}

function payload_ladjinn() {
  const p = pendingPayload(
    "la-djinn",
    "Ladjinn.ai. Search Architecture Built In Pre-Launch",
    "Ladjinn.ai",
    "AI, Productivity",
    { gsc_slug: "ladjinn", engagement_status: "pre_launch" },
    "Pre-launch architecture",
  );
  p.business_stage = "Pre-launch";
  p.sort_order = 52;
  p.challenge = doc(
    "Ladjinn.ai is launching into the AI productivity category. Most companies retrofit search architecture months after launch, then spend years catching up to organic growth they could have captured from day one. The opportunity is to do the opposite. Build the search architecture into the site at launch so the category-defining pages are indexed from day one rather than years later.",
    "The pre-launch window is the highest-leverage moment for an OLG engagement. There is no existing site to migrate. No legacy URLs to honor. No historical performance to protect. Architecture decisions made now compound for the lifetime of the company.",
  );
  p.solution = doc(
    "Category-defining page architecture built into the Ladjinn.ai site before launch. Feature pages, comparison pages, integration patterns, and use-case scenarios all instrumented for GSC tracking from launch day. When Ladjinn goes live, the impression curve starts climbing immediately rather than after a six-month retroactive SEO catch-up.",
  );
  p.implementation_process = doc(
    "Pre-launch deployment running in parallel with product engineering. Phases 1 through 3 (research, SERP validation, architecture) executed against the planned product surface area. Phases 4 through 6 (templates, CMS, supportive assets) integrated with the launch site. Phase 7 (deploy and index) coincides with public launch. Every page submitted to GSC on launch day. Phase 8 retainer begins thirty days after launch.",
  );
  p.key_metrics = [
    { label: "Engagement Status", value: "Pre-launch architecture", before: "", after: "", improvement: "", unit: "" },
    { label: "Launch Day Indexed Pages", value: "1,000+", before: "0", after: "live and indexed", improvement: "", unit: "+" },
    { label: "Time to First Impression", value: "Day 1", before: "", after: "", improvement: "", unit: "" },
  ];
  p.results_narrative = [
    { title: "Pre-launch. Architecture phase. In progress.", description: "Page templates, CMS seeding, GSC instrumentation built in parallel with product engineering.", metric: "" },
    { title: "Launch day. All pages indexed.", description: "1,000+ pages submitted to GSC on launch day. Impression curve starts climbing immediately rather than after retroactive catch-up.", metric: "" },
    { title: "Thirty days post-launch. Results threshold.", description: "Initial GSC data analyzed. Full results case study publishes.", metric: "" },
  ];
  p.results_summary = "Engagement underway, pre-launch. Results case study publishes once GSC data crosses the publication threshold (around thirty days post-launch).";
  p.meta_title = "Ladjinn.ai. Pre-Launch Search Architecture. Rule27 Design";
  p.meta_description = "Active Rule27 OLG engagement with Ladjinn.ai in pre-launch phase. Architecture instrumented for measurement from launch day one. Results case study publishes post-threshold.";
  return p;
}

function payload_stilo() {
  const p = pendingPayload(
    "stilo-crm",
    "Stilo CRM. Building Search Architecture in a Saturated Category",
    "Stilo CRM",
    "B2B SaaS, CRM",
    { gsc_slug: "stilo", engagement_status: "in_progress" },
  );
  p.sort_order = 53;
  p.challenge = doc(
    "CRM is one of the most saturated SaaS categories on earth. Salesforce, HubSpot, Pipedrive, and dozens of other incumbents dominate every core query. Going head-to-head on \"best CRM software\" is a losing fight that costs years and seven figures.",
    "The opportunity sits in the long tail incumbents have either abandoned or never built for. Integration-specific patterns. Vertical-specific CRM use cases. Alternative-to comparisons. \"X for [specific industry]\" search behavior. Stilo's product positioning aligns with several of those long-tail categories where the incumbents have not bothered to defend.",
  );
  p.solution = doc(
    "Page architecture matched to how vertical and integration-driven CRM buyers actually search. CRM-feature, industry, and integration combinations. Alternative-to comparisons against incumbents on the long tail. Use-case-specific pages that target verticals the incumbents treat as edge cases. Phase 2 SERP validation on every priority query.",
  );
  p.implementation_process = doc(
    "Standard four-week Rule27 OLG deployment. Research and competitor mapping complete. Phase 2 SERP validation in active execution. Architecture sequenced so high-commercial-intent comparison and integration pages deploy first, followed by vertical-specific use-case pages.",
  );
  p.key_metrics = [
    { label: "Engagement Status", value: "Phase 2. SERP Validation", before: "", after: "", improvement: "", unit: "" },
    { label: "Page Architecture Scope", value: "1,000+", before: "", after: "pages", improvement: "", unit: "+" },
    { label: "Strategy", value: "Long-tail vertical and integration", before: "", after: "", improvement: "", unit: "" },
  ];
  p.meta_title = "Stilo CRM. Search Architecture in a Saturated Category. Rule27 Design";
  p.meta_description = "Active Rule27 OLG engagement with Stilo CRM. Building page architecture against integration, alternative, and vertical-specific query patterns the CRM incumbents have weak coverage on.";
  return p;
}

function payload_jsb() {
  const p = pendingPayload(
    "jsb-business-solutions",
    "JSB Business Solutions. Closing a 480-Keyword Gap",
    "JSB Business Solutions Group",
    "Professional Services, Operations Consulting",
    { gsc_slug: "jsbbsg", engagement_status: "in_progress", magnet_report_keyword_gap: 480 },
  );
  p.sort_order = 54;
  p.challenge = doc(
    "JSB Business Solutions Group operates in regional professional services. Operations consulting and adjacent business services where buyer searches are highly local and highly intent-driven. A pre-engagement magnet report identified roughly 480 keywords where their top three regional competitors rank but JSB has no presence at all.",
    "Each of those 480 keywords represents a specific buyer asking a specific question Rule27 can answer with a specific page. Every day that gap stays open is revenue flowing to competitors. The engagement scope: close the gap with intentional service-by-location architecture before the regional competitive landscape shifts.",
  );
  p.solution = doc(
    "Page architecture matched to JSB's actual service catalog and the locations they serve. Every service-by-city combination that has measurable buyer-intent search volume. Phase 2 SERP validation prioritizes the highest-volume and lowest-difficulty long-tail patterns first.",
  );
  p.implementation_process = doc(
    "Standard four-week Rule27 OLG deployment, scoped to the 480 keyword gap surface area plus expansion into adjacent buyer-intent patterns. Architecture sequenced by commercial intent. Service-by-city pages first, vertical-specific landing pages second, educational and trust-building content third.",
  );
  p.key_metrics = [
    { label: "Keyword Gap (pre-engagement)", value: "480", before: "", after: "in active closure", improvement: "", unit: "" },
    { label: "Engagement Status", value: "Phase 2. SERP Validation", before: "", after: "", improvement: "", unit: "" },
    { label: "Page Architecture Scope", value: "1,000+", before: "", after: "pages", improvement: "", unit: "+" },
  ];
  p.results_narrative = [
    { title: "Pre-engagement. Magnet report identifies 480 keyword gap.", description: "Top three regional competitors rank for 480 keywords where JSB has no presence. Each one is an open revenue door.", metric: "480 keywords" },
    { title: "Week 1. Research and SERP audit. Complete.", description: "Competitor pages, content depth, and difficulty mapped for every priority gap query.", metric: "" },
    { title: "Week 2. Phase 2 SERP validation. In progress.", description: "Top-ten SERP analysis on every priority service-by-city query.", metric: "" },
    { title: "Weeks 3 and 4. Build, deploy, index. Upcoming.", description: "Page templates, CMS seeding, deployment at roughly seventy-one pages per day with manual GSC indexing.", metric: "" },
  ];
  p.meta_title = "JSB Business Solutions. 480-Keyword Gap Engagement. Rule27 Design";
  p.meta_description = "Active Rule27 OLG engagement with JSB Business Solutions Group. 480 keyword gaps identified versus top regional competitors. Service-by-location architecture in active deployment.";
  return p;
}

function payload_auldrom() {
  const p = pendingPayload(
    "auldrom",
    "Auldrom. Search Architecture for App Discovery",
    "Auldrom",
    "Consumer, Mobile App",
    { gsc_slug: "auldrom", engagement_status: "in_progress" },
  );
  p.sort_order = 55;
  p.challenge = doc(
    "Auldrom is a consumer mobile app competing in a category where most discovery happens inside the App Store and Play Store. Channels where ranking is opaque, expensive, and largely controlled by the platforms. The web-search side of app discovery is consistently under-built across the category. The opportunity to capture organic web traffic that drives App Store and Play Store referral is wide open.",
    "Buyers searching for mobile apps via web search use specific patterns. Feature-specific use cases. Comparison patterns (\"best X app\"). Problem-driven searches (\"how to do X on mobile\"). Category-defining searches. Most apps do not build for these query classes. The ones that do capture material referral traffic that compounds month over month.",
    "The engagement scope: build category-defining web-search architecture for Auldrom that drives organic traffic from web to the App Store and Play Store listings.",
  );
  p.solution = doc(
    "Page architecture matched to the four buyer query classes. Feature-by-use-case combinations. \"Best X app\" comparison patterns. Problem-driven landing pages. Category-defining pages. Each page is instrumented to drive App Store and Play Store referral traffic with measurable attribution.",
  );
  p.implementation_process = doc(
    "Standard four-week Rule27 OLG deployment with App Store and Play Store referral instrumentation layered on. Architecture sequenced by commercial intent. Comparison and \"best X\" pages first, problem-driven and feature-specific pages second, category-defining pages third.",
  );
  p.key_metrics = [
    { label: "Engagement Status", value: "Phase 2. SERP Validation", before: "", after: "", improvement: "", unit: "" },
    { label: "Page Architecture Scope", value: "1,000+", before: "", after: "pages", improvement: "", unit: "+" },
    { label: "Conversion Target", value: "App Store and Play Store referral", before: "", after: "instrumented", improvement: "", unit: "" },
  ];
  p.deliverables = [
    "Custom Next.js site on Rule27 infrastructure",
    "Phase-2-validated page architecture",
    "CMS setup with full client access",
    "GSC, GA4, AniltX configured and live",
    "Manual GSC indexing through deployment",
    "App Store and Play Store referral attribution wired",
    "Schema markup on every page",
    "Weekly performance reports",
    "Ongoing CTR optimization retainer",
  ];
  p.meta_title = "Auldrom. Search Architecture for App Discovery. Rule27 Design";
  p.meta_description = "Active Rule27 OLG engagement with Auldrom. Building app-discovery search architecture that drives organic web traffic into App Store and Play Store referral.";
  return p;
}

// ---------------------------------------------------------------------------
// Run.
// ---------------------------------------------------------------------------
async function main() {
  const ids = await step_testimonials();

  console.log("\n=== B. Upsert SolomonSignal ===");
  {
    const { error } = await sb.from("case_studies").upsert(payload_solomonsignal(ids["SolomonSignal"]), { onConflict: "slug" });
    if (error) throw new Error(`SolomonSignal upsert failed: ${error.message}`);
    console.log("  OK");
  }

  console.log("\n=== C. Upsert AniltX ===");
  {
    const { error } = await sb.from("case_studies").upsert(payload_aniltx(ids["AniltX.ai"]), { onConflict: "slug" });
    if (error) throw new Error(`AniltX upsert failed: ${error.message}`);
    console.log("  OK");
  }

  console.log("\n=== D. Update NMHL ===");
  {
    const { error } = await sb.from("case_studies").update(update_nmhl(ids["NMHL"])).eq("slug", "nmhl-organic-lead-growth");
    if (error) throw new Error(`NMHL update failed: ${error.message}`);
    console.log("  OK");
  }

  console.log("\n=== E. Update FreedomDev (full rewrite + publish) ===");
  {
    const { error } = await sb.from("case_studies").update(update_freedomdev(ids["FreedomDev"])).eq("slug", "freedomdev-organic-lead-growth");
    if (error) throw new Error(`FreedomDev update failed: ${error.message}`);
    console.log("  OK");
  }

  console.log("\n=== F. Upsert 6 pending engagements ===");
  const pending = [payload_settuna(), payload_skulptor(), payload_ladjinn(), payload_stilo(), payload_jsb(), payload_auldrom()];
  for (const p of pending) {
    const { error } = await sb.from("case_studies").upsert(p, { onConflict: "slug" });
    if (error) throw new Error(`${p.slug} upsert failed: ${error.message}`);
    console.log(`  OK: ${p.slug}`);
  }

  console.log("\n=== Verify: case_studies post-migration ===");
  const { data: rows } = await sb
    .from("case_studies")
    .select("slug,client_name,status,is_active,is_featured,sort_order")
    .order("sort_order", { ascending: true });
  console.table(rows);

  console.log("\nDONE.");
}

main().catch((e) => { console.error(e); process.exit(1); });
