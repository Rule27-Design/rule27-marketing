import type { CompanyGSCData } from "./types";
import { COMPANY_META } from "./companies";

/**
 * SolomonSignal GSC data — real export from Google Search Console.
 * 40 days: 2026-01-27 → 2026-03-19
 * Growth: 4 → 453 impressions/day (113.3x)
 */
export const solomonsignalData: CompanyGSCData = {
  meta: COMPANY_META.solomonsignal,
  summary: {
    startImpressions: 4,
    endImpressions: 453,
    growthMultiplier: 113.3,
    timeframeDays: 40,
    pagesDeployed: 0,
  },
  dataPoints: [
  { date: "2026-01-27", impressions: 2, clicks: 1, ctr: 0.5, position: 2 },
  { date: "2026-02-01", impressions: 2, clicks: 0, ctr: 0, position: 6.5 },
  { date: "2026-02-02", impressions: 2, clicks: 0, ctr: 0, position: 8.5 },
  { date: "2026-02-03", impressions: 2, clicks: 0, ctr: 0, position: 25 },
  { date: "2026-02-04", impressions: 7, clicks: 0, ctr: 0, position: 45 },
  { date: "2026-02-05", impressions: 9, clicks: 0, ctr: 0, position: 39.8 },
  { date: "2026-02-06", impressions: 2, clicks: 0, ctr: 0, position: 6.5 },
  { date: "2026-02-07", impressions: 2, clicks: 0, ctr: 0, position: 4.5 },
  { date: "2026-02-08", impressions: 2, clicks: 1, ctr: 0.5, position: 6.5 },
  { date: "2026-02-10", impressions: 1, clicks: 0, ctr: 0, position: 72 },
  { date: "2026-02-11", impressions: 6, clicks: 0, ctr: 0, position: 41.2 },
  { date: "2026-02-12", impressions: 7, clicks: 0, ctr: 0, position: 68.1 },
  { date: "2026-02-13", impressions: 2, clicks: 0, ctr: 0, position: 53 },
  { date: "2026-02-14", impressions: 1, clicks: 0, ctr: 0, position: 69 },
  { date: "2026-02-16", impressions: 5, clicks: 1, ctr: 0.2, position: 36 },
  { date: "2026-02-17", impressions: 1, clicks: 0, ctr: 0, position: 45 },
  { date: "2026-02-18", impressions: 12, clicks: 1, ctr: 0.0833, position: 10.3 },
  { date: "2026-02-19", impressions: 2, clicks: 0, ctr: 0, position: 3.5 },
  { date: "2026-02-20", impressions: 3, clicks: 0, ctr: 0, position: 34.3 },
  { date: "2026-02-23", impressions: 1, clicks: 0, ctr: 0, position: 1 },
  { date: "2026-02-25", impressions: 1, clicks: 0, ctr: 0, position: 9 },
  { date: "2026-02-27", impressions: 2, clicks: 0, ctr: 0, position: 9.5 },
  { date: "2026-02-28", impressions: 4, clicks: 0, ctr: 0, position: 11.8 },
  { date: "2026-03-01", impressions: 2, clicks: 0, ctr: 0, position: 28.5 },
  { date: "2026-03-02", impressions: 1, clicks: 0, ctr: 0, position: 10 },
  { date: "2026-03-03", impressions: 4, clicks: 0, ctr: 0, position: 35.5 },
  { date: "2026-03-05", impressions: 1, clicks: 0, ctr: 0, position: 35 },
  { date: "2026-03-06", impressions: 2, clicks: 0, ctr: 0, position: 20.5 },
  { date: "2026-03-07", impressions: 3, clicks: 0, ctr: 0, position: 16.7 },
  { date: "2026-03-09", impressions: 5, clicks: 0, ctr: 0, position: 33.8 },
  { date: "2026-03-10", impressions: 1, clicks: 0, ctr: 0, position: 37 },
  { date: "2026-03-11", impressions: 2, clicks: 0, ctr: 0, position: 31.5 },
  { date: "2026-03-12", impressions: 11, clicks: 0, ctr: 0, position: 29.5 },
  { date: "2026-03-13", impressions: 43, clicks: 0, ctr: 0, position: 36.4 },
  { date: "2026-03-14", impressions: 107, clicks: 0, ctr: 0, position: 23.9 },
  { date: "2026-03-15", impressions: 306, clicks: 1, ctr: 0.0033, position: 14.1 },
  { date: "2026-03-16", impressions: 576, clicks: 2, ctr: 0.0035, position: 10.9 },
  { date: "2026-03-17", impressions: 687, clicks: 4, ctr: 0.0058, position: 11.2 },
  { date: "2026-03-18", impressions: 804, clicks: 3, ctr: 0.0037, position: 10.1 },
  { date: "2026-03-19", impressions: 651, clicks: 1, ctr: 0.0015, position: 11.4 },
  ],
};
