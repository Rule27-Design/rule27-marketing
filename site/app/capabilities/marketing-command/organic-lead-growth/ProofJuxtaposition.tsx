"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ProofCardData {
  client: string;
  outcome: "win" | "loss";
  pages: string;
  impressions: string;
  clicks: string;
  ctr: string;
  ctrEmphasis: "good" | "bad";
  reason: string;
  takeaway: string;
}

const NMHL: ProofCardData = {
  client: "NMHL",
  outcome: "win",
  pages: "179",
  impressions: "29,100",
  clicks: "1,180",
  ctr: "4.0%",
  ctrEmphasis: "good",
  reason: "Every page targeted a real query with buyer intent, and the content matched what those searchers actually wanted.",
  takeaway:
    "Quality over quantity. 179 pages outperformed 33,332 because the architecture was correct.",
};

const ANILTX_V1: ProofCardData = {
  client: "AniltX V1",
  outcome: "loss",
  pages: "33,332",
  impressions: "8,272",
  clicks: "13",
  ctr: "0.16%",
  ctrEmphasis: "bad",
  reason: "Pages were shipped without checking whether real searchers wanted them. They ranked for queries the business could not serve.",
  takeaway:
    "32,000 more pages. 1,167 fewer clicks. The lesson: you cannot volume your way past missing the gate.",
};

export function ProofJuxtaposition() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 2,
            background: "#E53E3E",
            margin: "0 auto 1rem",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(229,62,62,0.85)",
            marginBottom: "0.75rem",
          }}
        >
          One decision, two outcomes
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
            lineHeight: 1.15,
            fontWeight: 400,
            maxWidth: 760,
            marginInline: "auto",
          }}
        >
          Same agency. Same playbook. One decision between them.
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1rem",
            color: "rgba(0,0,0,0.55)",
            margin: "1rem auto 0",
            maxWidth: 660,
            lineHeight: 1.65,
          }}
        >
          The only difference: whether every page was tied to a real search a
          buyer was actually making. Numbers below are pulled directly from
          Google Search Console.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
        className="olg-juxta-grid"
      >
        <ProofCard data={NMHL} inView={inView} delay={0.1} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="olg-juxta-vs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "2rem",
              letterSpacing: "0.2em",
              color: "rgba(0,0,0,0.3)",
              padding: "0.5rem 0.75rem",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#FAF9F6",
            }}
          >
            VS
          </motion.div>
        </div>

        <ProofCard data={ANILTX_V1} inView={inView} delay={0.25} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          marginTop: "2.5rem",
          textAlign: "center",
          padding: "1.5rem 1.75rem",
          background:
            "linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.02))",
          border: "1px solid rgba(229,62,62,0.18)",
          borderLeft: "3px solid #E53E3E",
          maxWidth: 800,
          marginInline: "auto",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Rule27 gates every engagement on query validation.{" "}
          <span style={{ color: "#E53E3E" }}>No exceptions.</span>
        </p>
      </motion.div>

      <style>{`
        @media (max-width: 760px) {
          .olg-juxta-grid {
            grid-template-columns: 1fr !important;
          }
          .olg-juxta-vs {
            padding: 0.75rem 0;
          }
        }
      `}</style>
    </section>
  );
}

function ProofCard({
  data,
  inView,
  delay,
}: {
  data: ProofCardData;
  inView: boolean;
  delay: number;
}) {
  const isWin = data.outcome === "win";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: isWin
          ? "linear-gradient(135deg, #0A0A0A 0%, #1a0606 50%, #0A0A0A 100%)"
          : "linear-gradient(135deg, #1A1A1A 0%, #1a1010 50%, #1A1A1A 100%)",
        border: isWin
          ? "1px solid rgba(229,62,62,0.4)"
          : "1px solid rgba(120,120,120,0.25)",
        borderLeft: isWin
          ? "3px solid #E53E3E"
          : "3px solid rgba(180,180,180,0.5)",
        padding: "1.75rem 1.75rem 1.5rem",
        position: "relative",
        overflow: "hidden",
        color: "#FFFFFF",
        boxShadow: isWin
          ? "0 12px 40px rgba(229,62,62,0.18), inset 0 0 60px rgba(229,62,62,0.05)"
          : "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Outcome glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "100%",
          background: isWin
            ? "radial-gradient(circle, rgba(229,62,62,0.18), transparent 70%)"
            : "radial-gradient(circle, rgba(180,180,180,0.06), transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "1.25rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#FFFFFF",
          }}
        >
          {data.client}
        </span>
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: isWin ? "#E53E3E" : "rgba(255,180,180,0.7)",
            background: isWin
              ? "rgba(229,62,62,0.15)"
              : "rgba(180,80,80,0.15)",
            padding: "3px 8px",
            border: isWin
              ? "1px solid rgba(229,62,62,0.4)"
              : "1px solid rgba(180,80,80,0.3)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {isWin ? "Validated queries" : "Unvalidated rollout"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.85rem",
          marginBottom: "1.25rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <NumberStat label="Pages" value={data.pages} />
        <NumberStat label="Impressions" value={data.impressions} />
        <NumberStat label="Clicks" value={data.clicks} />
        <NumberStat
          label="CTR"
          value={data.ctr}
          accent={data.ctrEmphasis === "good" ? "good" : "bad"}
        />
      </div>

      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.65,
          margin: "0 0 1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            color: isWin ? "#E53E3E" : "rgba(220,170,170,0.9)",
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginRight: "8px",
          }}
        >
          Why
        </span>
        {data.reason}
      </p>

      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.85rem",
          color: isWin ? "rgba(255,220,220,0.95)" : "rgba(220,200,200,0.85)",
          lineHeight: 1.65,
          margin: 0,
          fontStyle: "italic",
          position: "relative",
          zIndex: 1,
          paddingTop: "0.85rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {data.takeaway}
      </p>
    </motion.div>
  );
}

function NumberStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "good" | "bad";
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.75rem",
          color:
            accent === "good"
              ? "#E53E3E"
              : accent === "bad"
                ? "rgba(255,140,140,0.95)"
                : "#FFFFFF",
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
