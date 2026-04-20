export interface WeekStep {
  week: number;
  label: string;
  title: string;
  what: string;
  deliverable: string;
  metric: string;
  metricLabel: string;
}

export interface PostLaunchStep {
  range: string;
  title: string;
  description: string;
}

export const WEEKS: WeekStep[] = [
  {
    week: 1,
    label: "Discovery + Strategy",
    title: "We learn the game board",
    what: "Competitor research, keyword gap analysis, SERP validation, URL taxonomy. Phase 2 — the gate every other agency skips — is where we live this week.",
    deliverable: "Design system + SEO strategy doc in your inbox",
    metric: "P0 / P1 / P2",
    metricLabel: "queries prioritized",
  },
  {
    week: 2,
    label: "Build + Backend",
    title: "Templates approved, content engine warm",
    what: "Page templates designed and signed off. CMS seeded. Internal linking architecture locked. Technical SEO baseline (schema, meta, robots.txt) wired.",
    deliverable: "Enhanced site live on staging — every existing page reskinned",
    metric: "1,000+",
    metricLabel: "page records seeded",
  },
  {
    week: 3,
    label: "Deploy",
    title: "Pages start landing — every day, all week",
    what: "Public launch. Pages publish at ~71/day. Each one manually submitted to Google for indexing. GSC, GA4, AniltX configured and live.",
    deliverable: "Live on your domain. First impressions appear in GSC.",
    metric: "~71 / day",
    metricLabel: "deployment cadence",
  },
  {
    week: 4,
    label: "Complete + Handoff",
    title: "All 1,000+ pages live. Reporting starts.",
    what: "Final pages deployed. Full handoff: Rule27 Studio CMS, AniltX, GSC, GA4. Dedicated Slack channel. First weekly performance report from Josh.",
    deliverable: "1,000+ pages indexed. Retainer clock starts (30 days out).",
    metric: "1,000+",
    metricLabel: "pages live",
  },
];

export const POST_LAUNCH: PostLaunchStep[] = [
  {
    range: "Weeks 4-6",
    title: "Impression spike",
    description:
      "All 1,000+ pages enter Google's index in the same window. GSC dashboard goes from a flat line to a steep ramp. This is when most clients screenshot the dashboard and send it to their team.",
  },
  {
    range: "Month 2",
    title: "First clicks → first leads",
    description:
      "CTR refinement starts. We rewrite titles and metas based on actual GSC data, not guesses. Buyer-intent queries start converting. Your inbox gets the first organic-only contact.",
  },
  {
    range: "Month 3+",
    title: "Compounding flow",
    description:
      "Rankings consolidate. New content batches expand coverage. Competitor monitoring catches their moves before they catch yours. The retainer is momentum, not maintenance.",
  },
];

export interface Phase {
  num: number;
  name: string;
  duration: string;
  description: string;
  isGate?: boolean;
}

export const PHASES: Phase[] = [
  {
    num: 1,
    name: "Research",
    duration: "2-5 days",
    description:
      "Business intake, competitor identification, raw keyword export, ICP mapping, technical baseline audit.",
  },
  {
    num: 2,
    name: "SERP Validation",
    duration: "3-5 days",
    description:
      "Query prioritization (P0/P1/P2), top-10 SERP analysis per query, content skeletons, validated CSV. THE GATE — Josh signs off before we move.",
    isGate: true,
  },
  {
    num: 3,
    name: "Site Architecture",
    duration: "1-2 days",
    description:
      "URL taxonomy locked. Hub-and-spoke internal linking model. Route groups for /services, /industries, /locations.",
  },
  {
    num: 4,
    name: "Page Template Design",
    duration: "3-5 days",
    description:
      "Templates designed in your brand. Client approves before any content generates against them.",
  },
  {
    num: 5,
    name: "CMS Seeding + Content",
    duration: "3-7 days",
    description:
      "1,000+ records seeded. P0 pages get heavy human editing. P1 = AI draft + RAG + review. P2 = AI batch + 10% spot-check. Editorial brief per page.",
  },
  {
    num: 6,
    name: "Supportive Assets",
    duration: "2-4 days",
    description:
      "Hero images, schema, OG images, downloadable resources, FAQ scaffolding. Everything wired before deploy.",
  },
  {
    num: 7,
    name: "Deploy + Index",
    duration: "7-14 days",
    description:
      "~71 pages/day. Per-batch QA. Manual GSC indexing for every URL. Live on your domain.",
  },
  {
    num: 8,
    name: "Monitoring + Optimization",
    duration: "Ongoing",
    description:
      "Weekly reports from Josh. CTR optimization. Content refresh. Keyword expansion. Competitor watch. Slack support.",
  },
];
