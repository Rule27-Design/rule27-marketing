export interface PricingTier {
  id: "t1" | "t2" | "t3" | "t4";
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  retainer: string;
  pages: number;
  pagesLabel: string;
  revenueMin: number;
  revenueMax: number | null;
  description: string;
  inclusions: string[];
  note?: string;
  pill: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "t1",
    name: "Standard",
    tagline: "1,000-page deployment",
    price: "$5,750",
    cadence: "one-time",
    retainer: "$1,500/mo (4-mo min)",
    pages: 1000,
    pagesLabel: "1,000",
    revenueMin: 0,
    revenueMax: 10000,
    description:
      "1,000 pages built, indexed, and handed off in 4 weeks. The standard deployment - fits most service businesses targeting local-to-regional organic reach.",
    inclusions: [
      "Design system + SEO strategy doc",
      "Custom Next.js site, CMS setup with full access",
      "GSC, GA4, AniltX configured + live",
      "Manual GSC indexing through deployment",
      "Dedicated Slack channel",
    ],
    pill: "Project",
  },
  {
    id: "t2",
    name: "Scale",
    tagline: "2,500-page deployment",
    price: "$8,000",
    cadence: "one-time",
    retainer: "Discussed in consultation",
    pages: 2500,
    pagesLabel: "2,500",
    revenueMin: 10000,
    revenueMax: 25000,
    description:
      "2,500 pages for markets where you need broader coverage - more city / service combinations, more buyer-intent queries, or a complete content architecture reset. Also the entry point for e-commerce migrations.",
    inclusions: [
      "Everything in Standard",
      "2.5× the page surface area",
      "Expanded internal linking model",
      "Deeper SERP validation scope",
    ],
    note: "Ecom migration scope starts here.",
    pill: "Project",
  },
  {
    id: "t3",
    name: "Dominate",
    tagline: "5,000-page deployment",
    price: "$12,500",
    cadence: "one-time",
    retainer: "Discussed in consultation",
    pages: 5000,
    pagesLabel: "5,000",
    revenueMin: 25000,
    revenueMax: 60000,
    description:
      "5,000 pages for businesses going for category leadership in organic search. Built the cost-effective way: under $16K (what 2× Tier 2 would price to) because the framework scales without doubling.",
    inclusions: [
      "Everything in Scale",
      "5× the page surface area of Standard",
      "Full topical authority clusters",
      "Extended deployment cadence with structured QA",
    ],
    note: "The category-leader tier.",
    pill: "Project",
  },
  {
    id: "t4",
    name: "Custom",
    tagline: "10,000+ pages, custom scope",
    price: "$20K+",
    cadence: "custom",
    retainer: "$8,000/mo",
    pages: 10000,
    pagesLabel: "10K+",
    revenueMin: 60000,
    revenueMax: null,
    description:
      "10,000+ pages. Custom architecture. Multi-market, multi-vertical, or enterprise-scale deployments. We scope per project - price range starts at $20K and scales with page count, integration depth, and content complexity.",
    inclusions: [
      "Everything in Dominate",
      "Custom page types + templates",
      "Multi-brand / multi-region support",
      "Priority weekly calls + async review",
      "Dedicated deployment pipeline",
    ],
    pill: "Custom",
  },
];

export function getTierForRevenue(monthlyRevenue: number): PricingTier {
  return (
    PRICING_TIERS.find(
      (t) =>
        monthlyRevenue >= t.revenueMin &&
        (t.revenueMax === null || monthlyRevenue < t.revenueMax),
    ) ?? PRICING_TIERS[PRICING_TIERS.length - 1]
  );
}

/** Rough page count derived from monthly revenue goal using the page's
 *  formula inverse: revenue = pages × (impressions/page) × CTR × conv × deal.
 *  Using industry-neutral defaults:
 *    impressions/page/mo = 45, CTR = 3%, conv = 3%, avg deal = $250
 *  ⇒ revenue/page ≈ $10 / mo, so pages ≈ revenue / 10.
 */
export function getPagesForRevenue(monthlyRevenue: number): number {
  const revenuePerPagePerMo = 10;
  return Math.max(200, Math.round(monthlyRevenue / revenuePerPagePerMo));
}

export const PRICING_FOOTNOTE =
  "Hosting on Rule27 infrastructure: $50/mo (covered for any active retainer).";
