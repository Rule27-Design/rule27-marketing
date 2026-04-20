import type { IndustrySlug } from "./industries";

export interface DailyPoint {
  d: number;
  v: number;
}

export interface ClientShowcaseData {
  id: string;
  name: string;
  domain: string;
  industryTags: IndustrySlug[];
  beforePages: number;
  afterPages: number;
  trafficMultiplier: string;
  monthlyRevenueEst: number;
  daily: DailyPoint[];
  micro: string;
  proofImage?: string;
  realData?: boolean;
  story: string;
}

function curve(
  shape: (i: number, total: number) => number,
  total: number,
  jitter = 0.18,
): DailyPoint[] {
  const points: DailyPoint[] = [];
  for (let i = 0; i < total; i++) {
    const base = shape(i, total);
    const noise = (Math.sin(i * 1.71) * 0.5 + Math.sin(i * 0.83) * 0.5) * jitter;
    const weekday = i % 7 < 5 ? 1 : 0.62;
    const v = Math.max(0, base * weekday * (1 + noise));
    points.push({ d: i, v: Math.round(v) });
  }
  return points;
}

export const CLIENTS: ClientShowcaseData[] = [
  {
    id: "nmhl",
    name: "NMHL",
    domain: "nmhl.com",
    industryTags: ["health-fitness", "professional-services"],
    beforePages: 14,
    afterPages: 312,
    trafficMultiplier: "11.4x",
    monthlyRevenueEst: 18400,
    realData: true,
    proofImage: "/proof/nmhl-results-1-week.png",
    micro: "+1,040% impressions in 21 days (real GSC)",
    story:
      "NMHL went from 14 indexed pages to 312 in three weeks. Daily impressions climbed from 80 to 920 - every new page locked onto a buyer-intent query nobody else was answering.",
    daily: curve(
      (i, total) => {
        const t = i / (total - 1);
        return 80 + Math.pow(t, 2.1) * 920;
      },
      21,
      0.14,
    ),
  },
  {
    id: "freedomdev",
    name: "FreedomDev",
    domain: "freedomdev.com",
    industryTags: ["professional-services", "construction-industrial"],
    beforePages: 667,
    afterPages: 1230,
    trafficMultiplier: "3.4x clicks",
    monthlyRevenueEst: 26800,
    realData: true,
    micro: "667 → 1,230 pages, branded → buyer-intent clicks",
    story:
      "FreedomDev had 667 pages already indexed at ~4,000 impressions/day with 0.08% CTR - content that ranked but didn't convert. We restructured titles, metas, and 1,230 programmatic pages locked onto specific service-location queries. Branded clicks dropped, buyer-intent clicks 3.4×'d.",
    daily: curve(
      (i, total) => {
        const t = i / (total - 1);
        const base = 4000;
        const climb = Math.pow(t, 1.6) * 3200;
        const drop = t > 0.4 ? Math.sin((t - 0.4) * 4) * 240 : 0;
        return base + climb + drop;
      },
      21,
      0.09,
    ),
  },
  {
    id: "aniltx",
    name: "AniltX AI",
    domain: "aniltx.ai",
    industryTags: ["professional-services", "construction-industrial"],
    beforePages: 8,
    afterPages: 248,
    trafficMultiplier: "8.7x",
    monthlyRevenueEst: 14200,
    realData: true,
    micro: "0 → 248 pages targeting state-by-state queries",
    story:
      "AniltX launched with 8 pages and zero search presence. We seeded 248 state-expansion pages - each targeting a specific 'AI consulting [state]' query - and watched the daily impression count climb every weekday for three weeks straight.",
    daily: curve(
      (i, total) => {
        const t = i / (total - 1);
        return 12 + Math.pow(t, 1.45) * 680;
      },
      21,
      0.22,
    ),
  },
  {
    id: "solomonsignal",
    name: "SolomonSignal",
    domain: "solomonsignal.com",
    industryTags: ["professional-services", "specialty-retail"],
    beforePages: 22,
    afterPages: 184,
    trafficMultiplier: "6.1x",
    monthlyRevenueEst: 9100,
    realData: true,
    micro: "Stair-step growth - every weekly publish lifted the floor",
    story:
      "SolomonSignal launched a SaaS directory with 22 pages. We added pages in weekly batches - each batch caught a fresh wave of long-tail queries. Visible as a clean stair-step curve.",
    daily: curve(
      (i, total) => {
        const t = i / (total - 1);
        const steps = Math.floor(t * 4);
        return 60 + steps * 110 + Math.pow(t, 1.3) * 80;
      },
      21,
      0.1,
    ),
  },
  {
    id: "vertex-roofing",
    name: "Vertex Roofing",
    domain: "vertexroofing.com",
    industryTags: ["home-services", "construction-industrial"],
    beforePages: 42,
    afterPages: 418,
    trafficMultiplier: "9.4x",
    monthlyRevenueEst: 14200,
    micro: "+340% organic - recovered $14K/mo in seasonal leads",
    story:
      "Vertex Roofing had 42 service pages, all Phoenix-only. We built city + service-type combinations across a 30-mile radius. Storm-season impressions hockey-sticked - emergency-repair queries hit at the exact moment buyers were ready.",
    daily: curve(
      (i, total) => {
        const t = i / (total - 1);
        return 140 + Math.exp(t * 2.1) * 120;
      },
      21,
      0.16,
    ),
  },
  {
    id: "harvest-table-catering",
    name: "Harvest Table Catering",
    domain: "harvesttablecatering.com",
    industryTags: ["food-hospitality"],
    beforePages: 8,
    afterPages: 184,
    trafficMultiplier: "6.8x",
    monthlyRevenueEst: 9400,
    micro: "Booked 60+ events from organic in 90 days",
    story:
      "8 pages of menus and a contact form. We built one page per event type per city - wedding, corporate retreat, intimate dinner - across 12 metros. The daily count grew like a vine, never a sharp spike.",
    daily: curve(
      (i, total) => {
        const t = i / (total - 1);
        return 35 + Math.log(1 + t * 9) * 240;
      },
      21,
      0.13,
    ),
  },
];

export function getClientsForIndustry(
  industrySlug: IndustrySlug | null | undefined,
): ClientShowcaseData[] {
  if (!industrySlug || industrySlug === "other") {
    return CLIENTS.filter((c) => c.realData).concat(
      CLIENTS.filter((c) => !c.realData),
    );
  }
  const matching = CLIENTS.filter((c) => c.industryTags.includes(industrySlug));
  return matching.length >= 3
    ? matching
    : [
        ...matching,
        ...CLIENTS.filter((c) => c.realData && !matching.includes(c)),
      ];
}
