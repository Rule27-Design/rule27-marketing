export interface ComparisonRow {
  dimension: string;
  rule27: string;
  typical: string;
  rule27Wins?: boolean;
}

export const COMPARISON: ComparisonRow[] = [
  {
    dimension: "Pages deployed",
    rule27: "1,000+ in 4 weeks",
    typical: "10-30 blog posts in 6 months",
    rule27Wins: true,
  },
  {
    dimension: "SERP validation gate",
    rule27: "Phase 2 — non-negotiable, every engagement",
    typical: "Skipped or done 'directionally'",
    rule27Wins: true,
  },
  {
    dimension: "Deployment cadence",
    rule27: "~71 pages/day with manual GSC indexing",
    typical: "Drip-published, no manual indexing",
    rule27Wins: true,
  },
  {
    dimension: "Weekly reporting",
    rule27: "Real GSC + AniltX numbers, signed by Josh",
    typical: "Vanity dashboard or PDF, monthly",
    rule27Wins: true,
  },
  {
    dimension: "Retainer model",
    rule27: "$1,500/mo, 4-mo minimum, then month-to-month",
    typical: "12-month lock-in, vague deliverables",
    rule27Wins: true,
  },
  {
    dimension: "Real client data shared",
    rule27: "NMHL, FreedomDev, AniltX — exact numbers, exact methods",
    typical: "Anonymous case studies, no metrics",
    rule27Wins: true,
  },
];
