import type { CompanyGSCData, GSCDataPoint } from "./types";
import { COMPANY_META } from "./companies";

/**
 * Synthetic GSC curves for showcase variety. Not backed by real exports,
 * flagged via COMPANY_META[slug].isMock so we can filter them out of any
 * "real client" surface. Curves are deterministic (seeded RNG) so builds
 * are reproducible.
 */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

interface CurveOptions {
  startDate: string;
  days: number;
  shape: (t: number) => number;
  startImpressions: number;
  endImpressions: number;
  noisePct: number;
  seed: number;
  positionStart: number;
  positionEnd: number;
}

function buildCurve(opts: CurveOptions): GSCDataPoint[] {
  const rng = mulberry32(opts.seed);
  const out: GSCDataPoint[] = [];
  for (let i = 0; i < opts.days; i++) {
    const t = i / (opts.days - 1);
    const shaped = opts.shape(t);
    const base =
      opts.startImpressions +
      (opts.endImpressions - opts.startImpressions) * shaped;
    const noise = 1 + (rng() - 0.5) * 2 * opts.noisePct;
    const impressions = Math.max(0, Math.round(base * noise));
    const clickRate = 0.005 + rng() * 0.015;
    const clicks = Math.round(impressions * clickRate * rng());
    const position =
      opts.positionStart +
      (opts.positionEnd - opts.positionStart) * t +
      (rng() - 0.5) * 6;
    out.push({
      date: addDays(opts.startDate, i),
      impressions,
      clicks,
      ctr: impressions > 0 ? Number((clicks / impressions).toFixed(4)) : 0,
      position: Number(Math.max(1, position).toFixed(1)),
    });
  }
  return out;
}

/** Stair-step: six two-week plateaus, each jump simulating a content batch release. */
function stairShape(t: number): number {
  const step = Math.floor(t * 6);
  const within = (t * 6) - step;
  const jitter = within < 0.15 ? within / 0.15 * 0.08 : 0.08;
  return Math.min(1, step / 6 + jitter);
}

/** Exponential: slow warm-up then compounding climb. */
function exponentialShape(t: number): number {
  if (t < 0.3) return t * 0.15;
  const k = (t - 0.3) / 0.7;
  return 0.045 + (1 - 0.045) * (Math.exp(k * 2.8) - 1) / (Math.exp(2.8) - 1);
}

/** S-curve: quiet start, steep middle, plateau top. Logistic. */
function sCurveShape(t: number): number {
  const k = 10;
  const midpoint = 0.5;
  const raw = 1 / (1 + Math.exp(-k * (t - midpoint)));
  const lo = 1 / (1 + Math.exp(-k * (0 - midpoint)));
  const hi = 1 / (1 + Math.exp(-k * (1 - midpoint)));
  return (raw - lo) / (hi - lo);
}

const MOCK_START = "2025-11-15";
const MOCK_DAYS = 90;

export const vertexRoofingData: CompanyGSCData = {
  meta: COMPANY_META.vertexroofing,
  summary: {
    startImpressions: 15,
    endImpressions: 1850,
    growthMultiplier: 123,
    timeframeDays: MOCK_DAYS,
    pagesDeployed: 2400,
  },
  dataPoints: buildCurve({
    startDate: MOCK_START,
    days: MOCK_DAYS,
    shape: stairShape,
    startImpressions: 15,
    endImpressions: 1850,
    noisePct: 0.18,
    seed: 271828,
    positionStart: 38,
    positionEnd: 14,
  }),
};

export const harvestTableData: CompanyGSCData = {
  meta: COMPANY_META.harvesttable,
  summary: {
    startImpressions: 5,
    endImpressions: 2200,
    growthMultiplier: 440,
    timeframeDays: MOCK_DAYS,
    pagesDeployed: 900,
  },
  dataPoints: buildCurve({
    startDate: MOCK_START,
    days: MOCK_DAYS,
    shape: exponentialShape,
    startImpressions: 5,
    endImpressions: 2200,
    noisePct: 0.22,
    seed: 314159,
    positionStart: 45,
    positionEnd: 11,
  }),
};

export const ridgebackPowersportsData: CompanyGSCData = {
  meta: COMPANY_META.ridgebackpowersports,
  summary: {
    startImpressions: 25,
    endImpressions: 3100,
    growthMultiplier: 124,
    timeframeDays: MOCK_DAYS,
    pagesDeployed: 3800,
  },
  dataPoints: buildCurve({
    startDate: MOCK_START,
    days: MOCK_DAYS,
    shape: sCurveShape,
    startImpressions: 25,
    endImpressions: 3100,
    noisePct: 0.15,
    seed: 161803,
    positionStart: 42,
    positionEnd: 9,
  }),
};
