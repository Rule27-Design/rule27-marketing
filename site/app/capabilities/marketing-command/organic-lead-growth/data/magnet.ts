/**
 * Magnet report payload shape — mirrors
 * Command-Center/services/oranic-lead-gen/magnet-reports/data/schema.json
 *
 * When an inbound UTM lead matches a record in our magnet pipeline, we pull
 * their specific payload (from Odoo when wired, from the Command-Center
 * leads/*.json library today) and render their actual gap data.
 */

export interface MagnetContact {
  name: string;
  title: string;
  doorknockDate: string;
  notes: string;
}

export interface MagnetSiteMetrics {
  pagesIndexed: number;
  estimatedTraffic: number;
  seoScore: number;
}

export interface MagnetCompetitor {
  name: string;
  domain: string;
  pagesIndexed: number;
  estimatedTraffic: number;
}

export interface MagnetKeyword {
  keyword: string;
  volume: number;
  difficulty: "Low" | "Medium" | "High";
  whoRanks: string;
  yourRank: number | null;
}

export interface MagnetRevenueEstimate {
  missedMonthlyVisitors: number;
  conversionRate: string;
  estimatedCustomers: number;
  avgDealValue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  formulaSteps: string[];
}

export interface MagnetReport {
  companyName: string;
  domain: string;
  industry: string;
  geoArea: string;
  reportDate: string;
  contact: MagnetContact;
  siteMetrics: MagnetSiteMetrics;
  competitors: MagnetCompetitor[];
  keywords: MagnetKeyword[];
  revenueEstimate: MagnetRevenueEstimate;
  keywordGapCount: number;
}

/** Sample payload for dev — real Allied Gases & Welding Supplies data,
 *  abbreviated. Used when `?demo_magnet=1` or during local preview. */
export const SAMPLE_MAGNET: MagnetReport = {
  companyName: "Allied Gases & Welding Supplies",
  domain: "alliedgas.com",
  industry: "Welding & Industrial Supply",
  geoArea: "Phoenix, AZ",
  reportDate: "March 19, 2026",
  contact: {
    name: "Business Representative",
    title: "Owner",
    doorknockDate: "March 19, 2026",
    notes:
      "Initial contact made during doorknock visit. Research conducted on alliedgas.com.",
  },
  siteMetrics: {
    pagesIndexed: 35,
    estimatedTraffic: 280,
    seoScore: 32,
  },
  competitors: [
    { name: "Airgas", domain: "airgas.com", pagesIndexed: 15000, estimatedTraffic: 420000 },
    { name: "Praxair / Linde", domain: "lindeus.com", pagesIndexed: 8200, estimatedTraffic: 180000 },
    { name: "Arizona Welding Supply", domain: "arizonaweldingsupply.com", pagesIndexed: 120, estimatedTraffic: 3500 },
    { name: "Norco Inc", domain: "norco-inc.com", pagesIndexed: 800, estimatedTraffic: 22000 },
  ],
  keywords: [
    { keyword: "welding supply Phoenix", volume: 1900, difficulty: "Medium", whoRanks: "Arizona Welding Supply", yourRank: null },
    { keyword: "industrial gases Arizona", volume: 1400, difficulty: "Medium", whoRanks: "Airgas", yourRank: null },
    { keyword: "argon gas supplier Phoenix", volume: 880, difficulty: "Low", whoRanks: "Airgas", yourRank: null },
    { keyword: "welding equipment near me", volume: 6600, difficulty: "High", whoRanks: "Airgas", yourRank: null },
  ],
  revenueEstimate: {
    missedMonthlyVisitors: 3200,
    conversionRate: "2.5%",
    estimatedCustomers: 80,
    avgDealValue: 340,
    monthlyRevenue: 27200,
    annualRevenue: 326400,
    formulaSteps: [
      "540+ keywords your competitors rank for × avg 22 daily searches = ~11,880 daily search impressions",
      "11,880 impressions × 4% expected CTR (top 5 position) = ~475 daily clicks",
      "475 daily clicks × 30 days = ~14,250 monthly visitors",
      "14,250 visitors × 2.5% industry conversion rate = ~356 leads/month",
      "356 leads × 22% close rate × $340 avg deal = ~$27,200/month",
    ],
  },
  keywordGapCount: 540,
};
