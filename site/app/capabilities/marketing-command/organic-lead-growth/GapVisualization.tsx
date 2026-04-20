"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";
import type { CompetitorExample, IndustryContent } from "./data/industries";
import { TOOLTIPS } from "./data/copy";

interface GapVisualizationProps {
  industry: IndustryContent;
  /** Lead identifier passed in from UTMs — used to fetch real magnet data from Odoo. */
  leadId?: string | null;
  domain?: string | null;
}

interface OdooMagnetData {
  yourPages: number;
  competitors: CompetitorExample[];
}

/**
 * STUB: when wired, this hook calls the Odoo magnet endpoint with the lead's
 * UTM identifier (or domain) and returns the actual scraped competitor + page
 * data for that lead. Until then, returns null and the component falls back
 * to industry defaults.
 *
 * Wiring path (Phase 2):
 *   1. Add NEXT_PUBLIC_ODOO_MAGNET_URL to env
 *   2. Replace the body below with:
 *        const res = await fetch(`${process.env.NEXT_PUBLIC_ODOO_MAGNET_URL}?lead_id=${leadId}&domain=${domain}`);
 *        return res.ok ? res.json() : null;
 *   3. Optionally add SWR/React Query for caching
 */
function useOdooMagnetData(
  leadId: string | null | undefined,
  domain: string | null | undefined,
): OdooMagnetData | null {
  const [data, setData] = useState<OdooMagnetData | null>(null);

  useEffect(() => {
    if (!leadId && !domain) return;
    // TODO: wire to Odoo when endpoint URL is provided
    // fetch(`${process.env.NEXT_PUBLIC_ODOO_MAGNET_URL}?lead_id=${leadId}&domain=${domain}`)
    //   .then(r => r.ok ? r.json() : null)
    //   .then(setData);
    setData(null);
  }, [leadId, domain]);

  return data;
}

export function GapVisualization({ industry, leadId, domain }: GapVisualizationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const live = useOdooMagnetData(leadId, domain);
  const isLive = !!live;

  const yourLow = live?.yourPages ?? industry.avgPagesLow;
  const yourHigh = live?.yourPages ?? industry.avgPagesHigh;
  const competitors = live?.competitors ?? industry.topCompetitors;
  const max = Math.max(yourHigh, ...competitors.map((c) => c.pages));

  const yourBar = ((yourLow + yourHigh) / 2 / max) * 100;

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
            The {industry.shortName} gap
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
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#E53E3E",
                  display: "inline-block",
                  animation: "pulse-dot 2s ease-in-out infinite",
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
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          The average {industry.shortName} business has {yourLow}–{yourHigh}{" "}
          indexed pages. Here&apos;s what the names dominating your search
          results look like.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Your bar */}
        <BarRow
          label={`Average ${industry.shortName}`}
          subLabel="That's likely you"
          value={`${yourLow}–${yourHigh} pages`}
          width={yourBar}
          color="rgba(0,0,0,0.18)"
          textColor="rgba(0,0,0,0.6)"
          inView={inView}
          delay={0.1}
          isYou
        />

        {/* Competitor bars */}
        {competitors.map((comp, i) => {
          const width = (comp.pages / max) * 100;
          return (
            <BarRow
              key={comp.name}
              label={comp.name}
              subLabel={
                comp.monthlyRevenueEst > 0
                  ? `~$${(comp.monthlyRevenueEst / 1000).toFixed(0)}K/mo organic`
                  : "Industry authority site"
              }
              value={
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                  {comp.pages.toLocaleString()} pages
                  <Tooltip
                    content={TOOLTIPS.competitor_pages}
                    position="top"
                  />
                </span>
              }
              width={width}
              color="#E53E3E"
              textColor="#111"
              inView={inView}
              delay={0.25 + i * 0.15}
            />
          );
        })}
      </div>
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
            position: "relative",
          }}
        />
      </div>
    </div>
  );
}
