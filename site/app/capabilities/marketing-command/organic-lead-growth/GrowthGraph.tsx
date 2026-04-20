"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { DailyPoint } from "./data/clients";

interface GrowthGraphProps {
  daily: DailyPoint[];
  domain: string;
  height?: number;
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

function dateLabel(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function GrowthGraph({ daily, domain, height = 420 }: GrowthGraphProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { path, area, dots, max, total, peakIndex } = useMemo(() => {
    if (daily.length < 2) {
      return { path: "", area: "", dots: [], max: 1, total: 0, peakIndex: 0 };
    }
    const max = Math.max(...daily.map((p) => p.v));
    const stepX = (SVG_W - PAD_LEFT - PAD_RIGHT) / (daily.length - 1);
    const innerH = SVG_H - PAD_TOP - PAD_BOTTOM;

    const dots = daily.map((p, i) => ({
      x: PAD_LEFT + i * stepX,
      y: PAD_TOP + innerH - (p.v / max) * innerH,
      v: p.v,
      d: p.d,
    }));

    const path = dots
      .map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
      .join(" ");
    const area = `${path} L${dots[dots.length - 1].x.toFixed(1)},${(SVG_H - PAD_BOTTOM).toFixed(1)} L${PAD_LEFT},${(SVG_H - PAD_BOTTOM).toFixed(1)} Z`;
    const total = daily.reduce((sum, p) => sum + p.v, 0);
    const peakIndex = daily.reduce(
      (best, p, i) => (p.v > daily[best].v ? i : best),
      0,
    );

    return { path, area, dots, max, total, peakIndex };
  }, [daily]);

  const yTicks = useMemo(() => {
    const ticks: { y: number; label: string }[] = [];
    const innerH = SVG_H - PAD_TOP - PAD_BOTTOM;
    for (let i = 0; i <= 4; i++) {
      const v = (max / 4) * i;
      ticks.push({
        y: PAD_TOP + innerH - (v / max) * innerH,
        label: formatNum(v),
      });
    }
    return ticks.reverse();
  }, [max]);

  const xTicks = useMemo(() => {
    if (dots.length === 0) return [];
    const step = Math.floor(dots.length / 6) || 1;
    return dots
      .filter((_, i) => i % step === 0 || i === dots.length - 1)
      .map((p) => ({
        x: p.x,
        label: dateLabel(daily.length - 1 - p.d),
      }));
  }, [dots, daily.length]);

  const peak = dots[peakIndex];

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
          Search Console - Performance
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
        <ToolbarPill label="Date range" value="Last 21 days" />
        <ToolbarPill label="Metric" value="Total impressions" accent />
        <ToolbarPill label="Comparison" value="No comparison" />
        <div style={{ marginLeft: "auto", display: "flex", gap: 18 }}>
          <Headline label="Impressions" value={formatNum(total)} />
          <Headline label="Peak day" value={formatNum(peak?.v ?? 0)} accent />
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
            d={area}
            fill="url(#gscFill)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={path}
            stroke="#E53E3E"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Day dots */}
          {inView &&
            dots.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={2.5}
                fill="#E53E3E"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.85, scale: 1 }}
                transition={{
                  duration: 0.25,
                  delay: 0.6 + i * 0.045,
                }}
              />
            ))}

          {/* Peak callout */}
          {inView && peak && (
            <motion.g
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 + dots.length * 0.045 }}
            >
              <circle cx={peak.x} cy={peak.y} r={6} fill="#E53E3E" filter="url(#gscGlow)" />
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
                x={peak.x - 52}
                y={peak.y - 60}
                width={104}
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
                Peak: {formatNum(peak.v)} imp
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
