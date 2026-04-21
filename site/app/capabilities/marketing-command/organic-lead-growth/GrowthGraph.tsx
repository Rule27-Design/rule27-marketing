"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { GSCDataPoint } from "@/app/lib/gsc-data";

interface GrowthGraphProps {
  dataPoints: GSCDataPoint[];
  domain: string;
  height?: number;
  showClicks?: boolean;
}

const SVG_W = 900;
const SVG_H = 420;
const PAD_LEFT = 64;
const PAD_RIGHT = 24;
const PAD_TOP = 28;
const PAD_BOTTOM = 48;

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return Math.round(n).toString();
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Samples an array down to roughly targetLen points by picking evenly-spaced
 * indices. Keeps first and last. Used to reduce huge GSC exports (200+ days)
 * into something renderable without distorting the curve.
 */
function sample<T>(arr: T[], targetLen: number): T[] {
  if (arr.length <= targetLen) return arr;
  const result: T[] = [];
  const step = (arr.length - 1) / (targetLen - 1);
  for (let i = 0; i < targetLen; i++) {
    result.push(arr[Math.round(i * step)]);
  }
  return result;
}

export function GrowthGraph({
  dataPoints,
  domain,
  height = 420,
  showClicks = true,
}: GrowthGraphProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const {
    impressionsPath,
    impressionsArea,
    clicksPath,
    yTicks,
    xTicks,
    peak,
    totalImpressions,
    totalClicks,
    avgCtr,
    firstDate,
    lastDate,
  } = useMemo(() => {
    if (dataPoints.length < 2) {
      return {
        impressionsPath: "",
        impressionsArea: "",
        clicksPath: "",
        yTicks: [],
        xTicks: [],
        peak: null as { x: number; y: number; v: number; date: string } | null,
        totalImpressions: 0,
        totalClicks: 0,
        avgCtr: 0,
        firstDate: "",
        lastDate: "",
      };
    }

    const sampled = sample(dataPoints, 120);
    const maxImpr = Math.max(...sampled.map((p) => p.impressions));
    const maxClicks = Math.max(...sampled.map((p) => p.clicks));
    const stepX = (SVG_W - PAD_LEFT - PAD_RIGHT) / (sampled.length - 1);
    const innerH = SVG_H - PAD_TOP - PAD_BOTTOM;

    const impressionCoords = sampled.map((p, i) => ({
      x: PAD_LEFT + i * stepX,
      y: PAD_TOP + innerH - (p.impressions / Math.max(1, maxImpr)) * innerH,
      v: p.impressions,
      date: p.date,
    }));

    const clickCoords = sampled.map((p, i) => ({
      x: PAD_LEFT + i * stepX,
      y: PAD_TOP + innerH - (p.clicks / Math.max(1, maxClicks)) * innerH,
    }));

    const impressionsPath = impressionCoords
      .map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
      .join(" ");
    const lastPt = impressionCoords[impressionCoords.length - 1];
    const impressionsArea = `${impressionsPath} L${lastPt.x.toFixed(1)},${(SVG_H - PAD_BOTTOM).toFixed(1)} L${PAD_LEFT},${(SVG_H - PAD_BOTTOM).toFixed(1)} Z`;
    const clicksPath = clickCoords
      .map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
      .join(" ");

    const peakIdx = impressionCoords.reduce(
      (best, p, i) => (p.v > impressionCoords[best].v ? i : best),
      0,
    );
    const peak = impressionCoords[peakIdx];

    const yTicks: { y: number; label: string }[] = [];
    for (let i = 0; i <= 4; i++) {
      const v = (maxImpr / 4) * i;
      yTicks.push({
        y: PAD_TOP + innerH - (v / Math.max(1, maxImpr)) * innerH,
        label: formatNum(v),
      });
    }
    yTicks.reverse();

    const xTickStep = Math.max(1, Math.floor(impressionCoords.length / 6));
    const xTicks = impressionCoords
      .filter((_, i) => i % xTickStep === 0 || i === impressionCoords.length - 1)
      .map((p) => ({ x: p.x, label: formatDate(p.date) }));

    const totalImpressions = dataPoints.reduce(
      (sum, p) => sum + p.impressions,
      0,
    );
    const totalClicks = dataPoints.reduce((sum, p) => sum + p.clicks, 0);
    const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

    return {
      impressionsPath,
      impressionsArea,
      clicksPath,
      yTicks,
      xTicks,
      peak,
      totalImpressions,
      totalClicks,
      avgCtr,
      firstDate: dataPoints[0].date,
      lastDate: dataPoints[dataPoints.length - 1].date,
    };
  }, [dataPoints]);

  return (
    <div
      ref={ref}
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 38,
          background: "linear-gradient(180deg, #F3F4F6, #ECEEF1)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          paddingRight: 14,
          gap: 8,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA42" }} />
        <div
          style={{
            marginLeft: 16,
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 12,
            color: "#6B7280",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ color: "#4285F4", fontWeight: 600 }}>Google</span>{" "}
          Search Console — Performance
          <span
            style={{
              marginLeft: 12,
              padding: "1px 8px",
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
              fontSize: 10,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            {domain}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          padding: "12px 18px 8px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <ToolbarPill
          label="Date range"
          value={
            firstDate && lastDate
              ? `${formatDate(firstDate)} – ${formatDate(lastDate)}`
              : "—"
          }
        />
        <ToolbarPill label="Metric" value="Total impressions" accent />
        {showClicks && <ToolbarPill label="Overlay" value="Total clicks" />}
        <div style={{ marginLeft: "auto", display: "flex", gap: 18 }}>
          <Headline label="Total impressions" value={formatNum(totalImpressions)} accent />
          <Headline label="Total clicks" value={formatNum(totalClicks)} />
          <Headline label="Avg CTR" value={`${(avgCtr * 100).toFixed(1)}%`} />
        </div>
      </div>

      {/* Graph */}
      <div style={{ width: "100%", height: height - 100, padding: "8px 0 0", background: "#FAFBFC" }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <defs>
            <linearGradient id="gscFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(229,62,62,0.22)" />
              <stop offset="100%" stopColor="rgba(229,62,62,0)" />
            </linearGradient>
            <filter id="gscGlow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Y grid + labels */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                y1={t.y}
                x2={SVG_W - PAD_RIGHT}
                y2={t.y}
                stroke="rgba(0,0,0,0.06)"
                strokeWidth={1}
              />
              <text
                x={PAD_LEFT - 10}
                y={t.y + 4}
                fontSize={10}
                fill="rgba(0,0,0,0.45)"
                textAnchor="end"
                fontFamily="Helvetica Neue, sans-serif"
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* X labels */}
          {xTicks.map((t, i) => (
            <text
              key={i}
              x={t.x}
              y={SVG_H - PAD_BOTTOM + 22}
              fontSize={10}
              fill="rgba(0,0,0,0.45)"
              textAnchor="middle"
              fontFamily="Helvetica Neue, sans-serif"
            >
              {t.label}
            </text>
          ))}

          {/* Area fill */}
          <motion.path
            d={impressionsArea}
            fill="url(#gscFill)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5 }}
          />

          {/* Clicks overlay */}
          {showClicks && (
            <motion.path
              d={clicksPath}
              stroke="rgba(66,133,244,0.55)"
              strokeWidth={1.2}
              fill="none"
              strokeDasharray="3 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          )}

          {/* Impressions line */}
          <motion.path
            d={impressionsPath}
            stroke="#E53E3E"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Peak callout */}
          {inView && peak && (
            <motion.g
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <circle
                cx={peak.x}
                cy={peak.y}
                r={6}
                fill="#E53E3E"
                filter="url(#gscGlow)"
              />
              <line
                x1={peak.x}
                y1={peak.y - 10}
                x2={peak.x}
                y2={peak.y - 38}
                stroke="rgba(229,62,62,0.5)"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
              <rect
                x={peak.x - 60}
                y={peak.y - 60}
                width={120}
                height={22}
                fill="#111111"
                rx={2}
              />
              <text
                x={peak.x}
                y={peak.y - 45}
                fontSize={11}
                fill="#FFFFFF"
                textAnchor="middle"
                fontFamily="Helvetica Neue, sans-serif"
                fontWeight={600}
              >
                Peak: {formatNum(peak.v)} impr · {formatDate(peak.date)}
              </text>
            </motion.g>
          )}
        </svg>
      </div>
    </div>
  );
}

function ToolbarPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        padding: "5px 10px",
        background: accent ? "rgba(229,62,62,0.06)" : "rgba(0,0,0,0.025)",
        border: accent
          ? "1px solid rgba(229,62,62,0.2)"
          : "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <span
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 8,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.4)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 11,
          color: accent ? "#E53E3E" : "#111",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Headline({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div style={{ textAlign: "right" }}>
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.4)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: 22,
          color: accent ? "#E53E3E" : "#111",
          lineHeight: 1.05,
        }}
      >
        {value}
      </div>
    </div>
  );
}
