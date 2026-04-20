export interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  description: string;
  schedule?: string[];
  inclusions: string[];
  pill?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "OLG Project",
    tagline: "The 4-week deployment",
    price: "$5,750",
    cadence: "one-time",
    description:
      "1,000+ pages designed, built, and deployed across 4 weeks. From research to live indexed pages in your GSC dashboard.",
    schedule: [
      "$1,437.50 — on contract signing (25%)",
      "$1,437.50 — at week 2, build approved (25%)",
      "$2,875.00 — at week 4, handoff complete (50%)",
    ],
    inclusions: [
      "Phase 1-7 execution (research → deploy)",
      "Custom Next.js site + design system",
      "CMS setup with full client access",
      "GSC, GA4, AniltX configured + live",
      "Weekly indexing through deployment",
      "Dedicated Slack channel",
    ],
    pill: "Project",
  },
  {
    name: "Retainer",
    tagline: "Momentum, not maintenance",
    price: "$1,500",
    cadence: "/ month",
    description:
      "Starts 30 days after final project payment. Weekly reports, CTR optimization, content refresh, keyword expansion. The piece that compounds.",
    inclusions: [
      "Weekly performance reports from Josh",
      "CTR optimization (titles, metas)",
      "5-20 new pages / month",
      "Competitor monitoring",
      "Bi-weekly strategy calls",
      "Slack support, business hours",
    ],
    pill: "4-month minimum",
  },
];

export const PRICING_FOOTNOTE =
  "Hosting on Rule27 infrastructure: $50/mo (covered for any active retainer client).";
