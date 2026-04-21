"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { COMPARISON } from "./data/comparison";

export function ComparisonTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2.25rem" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E53E3E",
            borderBottom: "1px solid rgba(229,62,62,0.3)",
            paddingBottom: "4px",
            marginBottom: "1rem",
          }}
        >
          Side by side
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          Rule27 OLG vs the typical SEO retainer
        </h2>
      </div>

      <div
        style={{
          background: "#FAF9F6",
          border: "1px solid rgba(0,0,0,0.08)",
          borderTop: "3px solid #E53E3E",
          overflow: "hidden",
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            background: "#0A0A0A",
            color: "#FFFFFF",
          }}
          className="olg-comp-header"
        >
          <HeaderCell label="What you get" />
          <HeaderCell label="Rule27 OLG" accent />
          <HeaderCell label="Typical SEO Agency" muted />
        </div>

        {/* Rows */}
        {COMPARISON.map((row, i) => (
          <motion.div
            key={row.dimension}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr",
              borderTop: "1px solid rgba(0,0,0,0.05)",
              background:
                i % 2 === 0 ? "#FAF9F6" : "rgba(229,62,62,0.015)",
            }}
            className="olg-comp-row"
          >
            <Cell
              text={row.dimension}
              accent="dimension"
            />
            <Cell text={row.rule27} accent="rule27" highlight />
            <Cell text={row.typical} accent="typical" />
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 760px) {
          .olg-comp-header,
          .olg-comp-row {
            grid-template-columns: 1fr !important;
          }
          .olg-comp-row > div:not(:first-child) {
            padding-top: 0.4rem !important;
          }
        }
      `}</style>
    </section>
  );
}

function HeaderCell({
  label,
  accent,
  muted,
}: {
  label: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        fontFamily: "'Steelfish', 'Impact', sans-serif",
        fontSize: "0.95rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: accent ? "#E53E3E" : muted ? "rgba(255,255,255,0.5)" : "#FFFFFF",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {label}
    </div>
  );
}

function Cell({
  text,
  accent,
  highlight,
}: {
  text: string;
  accent: "dimension" | "rule27" | "typical";
  highlight?: boolean;
}) {
  const isYou = accent === "rule27";
  return (
    <div
      style={{
        padding: "0.85rem 1.25rem",
        fontFamily:
          accent === "dimension"
            ? "'Steelfish', 'Impact', sans-serif"
            : "Helvetica Neue, sans-serif",
        fontSize: accent === "dimension" ? "0.95rem" : "0.85rem",
        letterSpacing: accent === "dimension" ? "0.06em" : "normal",
        textTransform: accent === "dimension" ? "uppercase" : "none",
        color:
          accent === "dimension"
            ? "#111"
            : accent === "rule27"
              ? "#111"
              : "rgba(0,0,0,0.5)",
        borderRight: "1px solid rgba(0,0,0,0.04)",
        background: highlight ? "rgba(229,62,62,0.04)" : "transparent",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        lineHeight: 1.5,
      }}
    >
      {isYou ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E53E3E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : accent === "typical" ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      ) : null}
      <span>{text}</span>
    </div>
  );
}
