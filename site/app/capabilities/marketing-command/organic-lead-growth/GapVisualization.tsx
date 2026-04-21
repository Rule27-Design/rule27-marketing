"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";
import type { IndustryContent } from "./data/industries";
import type { MagnetReport } from "./data/magnet";
import { TOOLTIPS } from "./data/copy";

interface GapVisualizationProps {
  industry: IndustryContent;
  /** When UTM identifies a lead with a magnet report, pass the full payload.
   *  The visualization renders their actual competitor data instead of
   *  industry defaults, and the section gets a "Live data" badge. */
  magnet?: MagnetReport | null;
}

export function GapVisualization({ industry, magnet }: GapVisualizationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isLive = !!magnet;

  // Data source — live magnet wins, else industry defaults
  const yourValue = magnet
    ? magnet.siteMetrics.pagesIndexed
    : (industry.avgPagesLow + industry.avgPagesHigh) / 2;
  const yourLabel = magnet
    ? `${magnet.companyName} · ${magnet.siteMetrics.pagesIndexed} pages`
    : `Average ${industry.shortName}`;
  const yourSubLabel = magnet
    ? "Your actual indexed pages (via GSC)"
    : "That's likely you";
  const yourValueLabel = magnet
    ? `${magnet.siteMetrics.pagesIndexed.toLocaleString()} pages`
    : `${industry.avgPagesLow}–${industry.avgPagesHigh} pages`;

  const competitors = magnet
    ? magnet.competitors.map((c) => ({
        name: c.name,
        pages: c.pagesIndexed,
        monthlyRevenueEst: 0,
        estimatedTraffic: c.estimatedTraffic,
      }))
    : industry.topCompetitors.map((c) => ({
        name: c.name,
        pages: c.pages,
        monthlyRevenueEst: c.monthlyRevenueEst,
        estimatedTraffic: 0,
      }));

  const max = Math.max(yourValue, ...competitors.map((c) => c.pages));
  const yourBar = (yourValue / max) * 100;

  const title = magnet
    ? `The ${magnet.industry.toLowerCase()} gap — your actual numbers`
    : `The ${industry.shortName} gap`;

  const subtitle = magnet
    ? `${magnet.keywordGapCount.toLocaleString()} keywords your competitors rank for that you don't. Sourced from your live GSC data and our SERP analysis on ${magnet.reportDate}.`
    : `The average ${industry.shortName} business has ${industry.avgPagesLow}–${industry.avgPagesHigh} indexed pages. Here's what the names dominating your search results look like.`;

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            width: 40,
            height: 2,
            background: "#E53E3E",
            marginBottom: "1rem",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#111",
              margin: 0,
            }}
          >
            {title}
          </h3>
          {isLive && (
            <span
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#E53E3E",
                background: "rgba(229,62,62,0.08)",
                padding: "2px 8px",
                border: "1px solid rgba(229,62,62,0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  position: "relative",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#E53E3E",
                  display: "inline-block",
                  boxShadow: "0 0 8px rgba(229,62,62,0.7)",
                }}
              />
              Live data
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.55)",
            margin: 0,
            maxWidth: 620,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <BarRow
          label={yourLabel}
          subLabel={yourSubLabel}
          value={yourValueLabel}
          width={yourBar}
          color="rgba(0,0,0,0.18)"
          textColor="rgba(0,0,0,0.6)"
          inView={inView}
          delay={0.1}
          isYou
        />

        {competitors.map((comp, i) => {
          const width = (comp.pages / max) * 100;
          return (
            <BarRow
              key={comp.name}
              label={comp.name}
              subLabel={
                comp.estimatedTraffic > 0
                  ? `~${comp.estimatedTraffic.toLocaleString()} visits / mo`
                  : comp.monthlyRevenueEst > 0
                    ? `~$${(comp.monthlyRevenueEst / 1000).toFixed(0)}K/mo organic`
                    : "Industry authority"
              }
              value={
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  {comp.pages.toLocaleString()} pages
                  <Tooltip content={TOOLTIPS.competitor_pages} position="top" />
                </span>
              }
              width={width}
              color="#E53E3E"
              textColor="#111"
              inView={inView}
              delay={0.25 + i * 0.12}
            />
          );
        })}
      </div>

      {/* Live formula steps when magnet payload is present */}
      {magnet && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.25rem 1.5rem",
            background:
              "linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.01))",
            border: "1px solid rgba(229,62,62,0.18)",
            borderLeft: "3px solid #E53E3E",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#E53E3E",
              }}
            >
              Revenue you&apos;re missing — your math
            </div>
            <div
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                color: "#E53E3E",
                lineHeight: 1,
              }}
            >
              ${magnet.revenueEstimate.monthlyRevenue.toLocaleString()}/mo
            </div>
          </div>
          <ol
            style={{
              listStyle: "none",
              counterReset: "step",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            {magnet.revenueEstimate.formulaSteps.map((step, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(0,0,0,0.7)",
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#E53E3E",
                    color: "#FFFFFF",
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function BarRow({
  label,
  subLabel,
  value,
  width,
  color,
  textColor,
  inView,
  delay,
  isYou,
}: {
  label: string;
  subLabel: string;
  value: React.ReactNode;
  width: number;
  color: string;
  textColor: string;
  inView: boolean;
  delay: number;
  isYou?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
          <span
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "1.05rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: textColor,
            }}
          >
            {label}
          </span>
          {isYou && (
            <span
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#E53E3E",
                background: "rgba(229,62,62,0.08)",
                padding: "2px 8px",
                border: "1px solid rgba(229,62,62,0.2)",
              }}
            >
              you
            </span>
          )}
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "11px",
              color: "rgba(0,0,0,0.4)",
              fontStyle: "italic",
            }}
          >
            {subLabel}
          </span>
        </div>
        <span
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "1.1rem",
            color: textColor,
            letterSpacing: "0.04em",
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          height: 14,
          width: "100%",
          background: "rgba(0,0,0,0.03)",
          position: "relative",
          overflow: "hidden",
          borderRadius: 1,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${width}%` } : {}}
          transition={{ duration: 1.1, delay, ease: "easeOut" }}
          style={{
            height: "100%",
            background: color,
          }}
        />
      </div>
    </div>
  );
}
