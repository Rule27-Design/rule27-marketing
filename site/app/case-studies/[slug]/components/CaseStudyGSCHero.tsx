"use client";

import { motion } from "framer-motion";
import { GrowthGraph } from "@/app/capabilities/marketing-command/organic-lead-growth/GrowthGraph";
import { getCompanyData } from "@/app/lib/gsc-data";

interface CaseStudyGSCHeroProps {
  gscSlug: string;
  title: string;
  client: string;
  industry: string;
  serviceType: string;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

/**
 * Hero block for OLG case studies - renders the client's actual GSC graph
 * (sourced from /lib/gsc-data/) as the primary visual instead of a
 * marketing screenshot. When `custom_fields.gsc_slug` is set on the
 * case_studies row, CaseStudyDetail uses this in place of the image gallery.
 */
export function CaseStudyGSCHero({
  gscSlug,
  title,
  client,
  industry,
  serviceType,
}: CaseStudyGSCHeroProps) {
  const data = getCompanyData(gscSlug);

  // No data yet (e.g., pending engagement) - render an atmospheric "engagement
  // in progress" panel instead of the graph.
  if (!data || !data.meta.hasData || data.dataPoints.length < 2) {
    return <PendingHero title={title} client={client} industry={industry} serviceType={serviceType} />;
  }

  const { meta, summary, dataPoints } = data;

  return (
    <section
      style={{
        position: "relative",
        background: "#0A0A0A",
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        overflow: "hidden",
        borderBottom: "1px solid rgba(229,62,62,0.2)",
      }}
    >
      {/* Atmospheric glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "55%",
          height: "100%",
          background: "radial-gradient(circle, rgba(229,62,62,0.18), transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-30%",
          right: "-10%",
          width: "55%",
          height: "100%",
          background: "radial-gradient(circle, rgba(229,62,62,0.1), transparent 65%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />
      {/* Grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Eyebrow row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#E53E3E",
              borderBottom: "1px solid rgba(229,62,62,0.3)",
              paddingBottom: "4px",
            }}
          >
            {serviceType}
          </span>
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            · {industry} · {client}
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontWeight: 400,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            margin: "0 0 1rem",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(255,255,255,0.65)",
            margin: "0 0 2rem",
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          {meta.description ||
            `${formatNum(summary.startImpressions)} → ${formatNum(summary.endImpressions)} daily impressions over ${meta.timeframeLabel}.`}
        </motion.p>

        {/* Headline stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
            maxWidth: 880,
          }}
        >
          <HeroStat label="Daily impressions" value={`${formatNum(summary.startImpressions)} → ${formatNum(summary.endImpressions)}`} accent />
          <HeroStat label="Growth multiplier" value={`${summary.growthMultiplier.toFixed(summary.growthMultiplier < 10 ? 1 : 0)}×`} accent />
          <HeroStat label="Pages deployed" value={summary.pagesDeployed > 0 ? `${formatNum(summary.pagesDeployed)}+` : "-"} />
          <HeroStat label="Timeframe" value={meta.timeframeLabel} />
        </div>

        {/* The graph itself */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <GrowthGraph dataPoints={dataPoints} domain={domainFromName(meta.name)} height={460} />
        </motion.div>
      </div>
    </section>
  );
}

function PendingHero({
  title,
  client,
  industry,
  serviceType,
}: {
  title: string;
  client: string;
  industry: string;
  serviceType: string;
}) {
  return (
    <section
      style={{
        position: "relative",
        background: "#0A0A0A",
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        overflow: "hidden",
        borderBottom: "1px solid rgba(229,62,62,0.2)",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 30% 30%, rgba(229,62,62,0.15), transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.25rem",
            padding: "5px 12px",
            background: "rgba(229,62,62,0.12)",
            border: "1px solid rgba(229,62,62,0.4)",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#E53E3E",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#E53E3E",
              boxShadow: "0 0 10px rgba(229,62,62,0.7)",
            }}
          />
          Engagement in progress
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontWeight: 400,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            margin: "0 0 1rem",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "rgba(255,255,255,0.65)",
            margin: 0,
            maxWidth: 700,
            lineHeight: 1.6,
          }}
        >
          {client} - {industry} · {serviceType}. The full results case study
          publishes once GSC data crosses our publication threshold.
        </p>
      </div>
    </section>
  );
}

function HeroStat({
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
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: accent ? "2px solid #E53E3E" : "1px solid rgba(255,255,255,0.08)",
        padding: "0.85rem 1rem",
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.45rem",
          color: accent ? "#E53E3E" : "#FFFFFF",
          lineHeight: 1.05,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function domainFromName(name: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes(".")) return n;
  return `${n.replace(/\s+/g, "")}.com`;
}
