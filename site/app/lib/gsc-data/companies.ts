import type { CompanyMeta } from "./types";

export const COMPANY_META: Record<string, CompanyMeta> = {
  nmhl: {
    slug: "nmhl",
    name: "NMHL",
    logo: "/images/logos/nmhl.png",
    accentColor: "var(--byte-cyan)",
    accentRGB: "39, 194, 242",
    hasData: true,
    headlineStat: "92x",
    headlineUnit: "organic growth",
    timeframeLabel: "7 months",
    description:
      "Deployed 7,000+ programmatic SEO pages. Grew from 79 to 7,300+ daily impressions — a 92x increase in organic visibility over 7 months.",
    cardStats: [
      { label: "Pages", value: "7,000+" },
      { label: "Impressions", value: "7.3K/day" },
      { label: "Growth", value: "92x" },
    ],
    caseStudyStats: [
      { label: "Pages Deployed", value: 7000, suffix: "+" },
      { label: "Daily Impressions", value: 7300, suffix: "+" },
      { label: "Growth", value: 92, suffix: "x" },
    ],
    caseStudyHeadline: "79 → 7,300 daily impressions",
    heroPosition: { x: "4%", y: "15%", rotate: -2 },
  },
  freedomdev: {
    slug: "freedomdev",
    name: "FreedomDev",
    logo: "/images/logos/freedomdev.webp",
    accentColor: "var(--byte-blue)",
    accentRGB: "37, 99, 235",
    hasData: true,
    headlineStat: "99x",
    headlineUnit: "organic growth",
    timeframeLabel: "12 months",
    description:
      "Built and deployed 1,000+ optimized pages. Grew from 39 to 3,900+ daily impressions — a 99x increase over 12 months of continuous optimization.",
    cardStats: [
      { label: "Pages", value: "1,000+" },
      { label: "Impressions", value: "3.9K/day" },
      { label: "Growth", value: "99x" },
    ],
    caseStudyStats: [
      { label: "Pages Deployed", value: 1000, suffix: "+" },
      { label: "Daily Impressions", value: 3876, suffix: "+" },
      { label: "Growth", value: 99, suffix: "x" },
    ],
    caseStudyHeadline: "39 → 3,900 daily impressions",
    heroPosition: { x: "70%", y: "10%", rotate: 1.5 },
  },
  solomonsignal: {
    slug: "solomonsignal",
    name: "SolomonSignal.com",
    logo: "/images/logos/solomonsignal.svg",
    accentColor: "var(--byte-orange)",
    accentRGB: "249, 115, 22",
    hasData: true,
    headlineStat: "113x",
    headlineUnit: "organic growth",
    timeframeLabel: "2 months",
    description:
      "Solomon Technologies' signal aggregation platform. Grew from 4 to 453 daily impressions — a 113x increase in just 2 months.",
    cardStats: [
      { label: "Impressions", value: "450/day" },
      { label: "Growth", value: "113x" },
    ],
    caseStudyStats: [
      { label: "Daily Impressions", value: 453, suffix: "+" },
      { label: "Growth", value: 113, suffix: "x" },
    ],
    caseStudyHeadline: "4 → 453 daily impressions",
    heroPosition: { x: "2%", y: "60%", rotate: -1 },
  },
  aniltx: {
    slug: "aniltx",
    name: "AniltX.ai",
    logo: "/images/logos/aniltx.png",
    accentColor: "var(--byte-cyan)",
    accentRGB: "39, 194, 242",
    hasData: true,
    headlineStat: "30x",
    headlineUnit: "organic growth",
    timeframeLabel: "3 months",
    description:
      "Visitor analytics platform. Grew from 5 to 148 daily impressions — a 30x increase in 3 months with early-stage SEO infrastructure.",
    cardStats: [
      { label: "Impressions", value: "148/day" },
      { label: "Growth", value: "30x" },
    ],
    caseStudyStats: [
      { label: "Daily Impressions", value: 148, suffix: "+" },
      { label: "Growth", value: 30, suffix: "x" },
    ],
    caseStudyHeadline: "5 → 148 daily impressions",
    heroPosition: { x: "74%", y: "54%", rotate: 2 },
  },
  ladjinn: {
    slug: "ladjinn",
    name: "Ladjinn.ai",
    logo: "/images/logos/ladjinn.png",
    accentColor: "var(--byte-blue)",
    accentRGB: "37, 99, 235",
    hasData: false,
    headlineStat: "—",
    headlineUnit: "GSC coming soon",
    timeframeLabel: "launching",
    description: "",
    cardStats: [],
    caseStudyStats: [],
    caseStudyHeadline: "",
    heroPosition: { x: "68%", y: "80%", rotate: -1.5 },
  },
};

/** Ordered list for hero cards (all 5) */
export const ALL_COMPANIES = Object.values(COMPANY_META);

/** Only companies with GSC data (for case studies, graph swaps) */
export const DATA_COMPANIES = ALL_COMPANIES.filter((c) => c.hasData);

/** Company slugs that have data */
export const DATA_SLUGS = DATA_COMPANIES.map((c) => c.slug);
