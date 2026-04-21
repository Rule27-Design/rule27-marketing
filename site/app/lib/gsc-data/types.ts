/** Raw GSC data point — one row from a CSV export */
export interface GSCDataPoint {
  date: string;           // "2025-09-20" (ISO date from GSC)
  impressions: number;
  clicks: number;
  ctr: number;            // 0.0 - 1.0
  position: number;       // avg search position
}

/** Aggregated summary stats for a company */
export interface CompanySummary {
  startImpressions: number;
  endImpressions: number;
  growthMultiplier: number;
  timeframeDays: number;
  pagesDeployed: number;
}

/** Display metadata for a company (cards, case studies, hero positioning) */
export interface CompanyMeta {
  slug: string;
  name: string;
  logo: string;
  accentColor: string;        // CSS var e.g. "var(--byte-cyan)"
  accentRGB: string;          // raw RGB for SVGs e.g. "39, 194, 242"
  hasData: boolean;
  /** Synthetic entry used only for visual variety in the showcase. No
   *  linked case_studies row, no real GSC export backing the curve. Kept
   *  separate so we can filter these out of any "real client" display. */
  isMock?: boolean;
  headlineStat: string;
  headlineUnit: string;
  timeframeLabel: string;
  description: string;
  cardStats: { label: string; value: string }[];
  caseStudyStats: { label: string; value: number; suffix: string }[];
  caseStudyHeadline: string;
  heroPosition: { x: string; y: string; rotate: number };
}

/** Full company data — metadata + summary + time-series */
export interface CompanyGSCData {
  meta: CompanyMeta;
  summary: CompanySummary;
  dataPoints: GSCDataPoint[];
}
