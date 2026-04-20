export type IndustrySlug =
  | "home-services"
  | "construction-industrial"
  | "food-hospitality"
  | "specialty-retail"
  | "professional-services"
  | "health-fitness"
  | "agriculture-outdoors"
  | "other";

export interface CompetitorExample {
  name: string;
  pages: number;
  monthlyRevenueEst: number;
}

export interface IndustryContent {
  slug: IndustrySlug;
  displayName: string;
  shortName: string;
  headline: string;
  painLine: string;
  mirrorLine: string;
  avgPagesLow: number;
  avgPagesHigh: number;
  topCompetitors: CompetitorExample[];
  topCompetitorsRevenueTotal: number;
  exampleSearches: string[];
}

export const INDUSTRIES: Record<IndustrySlug, IndustryContent> = {
  "home-services": {
    slug: "home-services",
    displayName: "Home Services",
    shortName: "home services",
    headline: "See what's already working for home services businesses.",
    painLine:
      "Most home services companies have the same invisible problem - and it's costing them more than they realize.",
    mirrorLine:
      "Your biggest competitor right now has more doors open than you. Customers are searching for what you sell every hour, and they're finding someone else.",
    avgPagesLow: 12,
    avgPagesHigh: 60,
    topCompetitors: [
      { name: "ARS / Rescue Rooter", pages: 4200, monthlyRevenueEst: 142000 },
      { name: "Roto-Rooter", pages: 6800, monthlyRevenueEst: 218000 },
      { name: "Mr. Rooter Plumbing", pages: 2100, monthlyRevenueEst: 71000 },
    ],
    topCompetitorsRevenueTotal: 431000,
    exampleSearches: [
      "emergency plumber near me",
      "AC repair phoenix",
      "roof leak repair cost",
    ],
  },
  "construction-industrial": {
    slug: "construction-industrial",
    displayName: "Construction & Industrial",
    shortName: "construction",
    headline: "See what's already working for construction & industrial firms.",
    painLine:
      "The biggest names in your trade aren't winning because of their work - they're winning because of their architecture.",
    mirrorLine:
      "While you're bidding on jobs, your competitors are getting found before the bid even starts. Their site does the qualifying.",
    avgPagesLow: 8,
    avgPagesHigh: 45,
    topCompetitors: [
      { name: "Lincoln Electric", pages: 8400, monthlyRevenueEst: 184000 },
      { name: "Caterpillar", pages: 14200, monthlyRevenueEst: 312000 },
      { name: "Sika Corporation", pages: 5600, monthlyRevenueEst: 124000 },
    ],
    topCompetitorsRevenueTotal: 620000,
    exampleSearches: [
      "commercial concrete contractor",
      "structural welding services",
      "geotechnical soil testing",
    ],
  },
  "food-hospitality": {
    slug: "food-hospitality",
    displayName: "Food & Hospitality",
    shortName: "food & hospitality",
    headline: "See what's already working for food & hospitality brands.",
    painLine:
      "Restaurants and food brands are losing dinner reservations to competitors with better digital architecture - not better food.",
    mirrorLine:
      "Tonight, somebody is searching for what you serve. They're going to make a reservation. The only question is: with whom?",
    avgPagesLow: 5,
    avgPagesHigh: 25,
    topCompetitors: [
      { name: "OpenTable", pages: 22400, monthlyRevenueEst: 0 },
      { name: "Toast", pages: 6800, monthlyRevenueEst: 198000 },
      { name: "Eater", pages: 41000, monthlyRevenueEst: 0 },
    ],
    topCompetitorsRevenueTotal: 198000,
    exampleSearches: [
      "best italian restaurant downtown",
      "private chef catering",
      "meal prep delivery",
    ],
  },
  "specialty-retail": {
    slug: "specialty-retail",
    displayName: "Specialty Retail",
    shortName: "specialty retail",
    headline: "See what's already working for specialty retail brands.",
    painLine:
      "Your customers are searching for the products you sell. They're not finding you because someone else has thousands of doors open.",
    mirrorLine:
      "Every product you sell is a search query someone is making right now. How many of those queries does your site answer?",
    avgPagesLow: 25,
    avgPagesHigh: 120,
    topCompetitors: [
      { name: "Polaris", pages: 3400, monthlyRevenueEst: 84000 },
      { name: "REI", pages: 28000, monthlyRevenueEst: 612000 },
      { name: "BikeRadar", pages: 18400, monthlyRevenueEst: 0 },
    ],
    topCompetitorsRevenueTotal: 696000,
    exampleSearches: [
      "polaris rzr accessories",
      "best mountain bike under 2000",
      "outdoor gear sale",
    ],
  },
  "professional-services": {
    slug: "professional-services",
    displayName: "Professional Services",
    shortName: "professional services",
    headline: "See what's already working for professional services firms.",
    painLine:
      "The firms taking your prospective clients aren't more credentialed - they're more findable.",
    mirrorLine:
      "When your ideal client searches for what you do, do they find you in the top 3, or scroll past you to your competitor's 47th page?",
    avgPagesLow: 8,
    avgPagesHigh: 40,
    topCompetitors: [
      { name: "Vistaprint", pages: 12400, monthlyRevenueEst: 274000 },
      { name: "FedEx Office", pages: 5800, monthlyRevenueEst: 134000 },
      { name: "Mailchimp Resources", pages: 8200, monthlyRevenueEst: 0 },
    ],
    topCompetitorsRevenueTotal: 408000,
    exampleSearches: [
      "tax preparation services",
      "commercial signage company",
      "executive coaching near me",
    ],
  },
  "health-fitness": {
    slug: "health-fitness",
    displayName: "Health & Fitness",
    shortName: "health & fitness",
    headline: "See what's already working for health & fitness brands.",
    painLine:
      "Your future members are searching for transformation. The gym they're finding isn't yours - it's the one with 200 location-specific landing pages.",
    mirrorLine:
      "Health is local. Fitness is intimate. So why does the chain with no community get all the searches your studio should be winning?",
    avgPagesLow: 4,
    avgPagesHigh: 20,
    topCompetitors: [
      { name: "Anytime Fitness", pages: 5400, monthlyRevenueEst: 168000 },
      { name: "Orangetheory", pages: 1800, monthlyRevenueEst: 92000 },
      { name: "Planet Fitness", pages: 2400, monthlyRevenueEst: 144000 },
    ],
    topCompetitorsRevenueTotal: 404000,
    exampleSearches: [
      "personal trainer near me",
      "best gym for beginners",
      "yoga classes downtown",
    ],
  },
  "agriculture-outdoors": {
    slug: "agriculture-outdoors",
    displayName: "Agriculture & Outdoors",
    shortName: "agriculture & outdoors",
    headline: "See what's already working for ag & outdoor businesses.",
    painLine:
      "Your buyers know exactly what they want. The question is whether they find it on your site - or someone else's.",
    mirrorLine:
      "The land moves slow. Search doesn't. The operations winning rural business have built more digital infrastructure than you'd guess.",
    avgPagesLow: 6,
    avgPagesHigh: 30,
    topCompetitors: [
      { name: "Tractor Supply Co.", pages: 18400, monthlyRevenueEst: 412000 },
      { name: "John Deere", pages: 22000, monthlyRevenueEst: 488000 },
      { name: "Cabela's", pages: 14000, monthlyRevenueEst: 318000 },
    ],
    topCompetitorsRevenueTotal: 1218000,
    exampleSearches: [
      "tractor parts near me",
      "landscape design phoenix",
      "off road tires sale",
    ],
  },
  other: {
    slug: "other",
    displayName: "Your Industry",
    shortName: "your industry",
    headline: "See what's already working in your space.",
    painLine:
      "Most businesses in any industry have the same invisible problem - and it's costing them more than they realize.",
    mirrorLine:
      "Your biggest competitor right now has more doors open than you. The math doesn't care about your industry.",
    avgPagesLow: 10,
    avgPagesHigh: 50,
    topCompetitors: [
      { name: "Industry Leader 1", pages: 4200, monthlyRevenueEst: 124000 },
      { name: "Industry Leader 2", pages: 8400, monthlyRevenueEst: 248000 },
      { name: "Industry Leader 3", pages: 14800, monthlyRevenueEst: 412000 },
    ],
    topCompetitorsRevenueTotal: 784000,
    exampleSearches: [
      "[your service] near me",
      "best [your industry] [your city]",
      "[product] reviews",
    ],
  },
};

export const INDUSTRY_LIST: IndustryContent[] = Object.values(INDUSTRIES);

export function getIndustry(slug: string | null | undefined): IndustryContent {
  if (!slug) return INDUSTRIES.other;
  const normalized = slug.toLowerCase() as IndustrySlug;
  return INDUSTRIES[normalized] ?? INDUSTRIES.other;
}
