"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CalendlyModal } from "@/app/components/CalendlyModal";

const SPARK_POINTS = [
  140, 152, 168, 180, 200, 230, 270, 320, 380, 460, 540, 640,
];

export function WeeklyReportPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const max = Math.max(...SPARK_POINTS);
  const stepX = 100 / (SPARK_POINTS.length - 1);
  const sparkPath = SPARK_POINTS.map((p, i) => {
    const x = i * stepX;
    const y = 40 - (p / max) * 32 - 4;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const sparkArea = `${sparkPath} L100,40 L0,40 Z`;

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
          gap: "2.5rem",
          alignItems: "center",
        }}
        className="olg-weekly-grid"
      >
        <div>
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
            Every Friday
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 400,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#111",
              margin: "0 0 1rem",
              lineHeight: 1.05,
            }}
          >
            A real report. Signed by your account team. Numbers from your GSC.
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1rem",
              color: "rgba(0,0,0,0.6)",
              margin: "0 0 1.5rem",
              lineHeight: 1.7,
            }}
          >
            Every retainer week, your account team hand-validates your numbers
            and writes 3-5 insights - what worked, what to watch, what to do
            next. No vanity dashboards. No exported PDFs from a tool you
            can&apos;t verify.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            {[
              "Real GSC + AniltX numbers, week-over-week deltas",
              "Top 10 pages by clicks + top movers (climbers and drops)",
              "Top 10 queries by impressions with position trend",
              "Identified leads with intent score (via AniltX)",
              "Technical health (Core Web Vitals, indexing status)",
              "3-5 next steps from your account team - not auto-generated",
            ].map((line) => (
              <li
                key={line}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.88rem",
                  color: "rgba(0,0,0,0.7)",
                  lineHeight: 1.55,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E53E3E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 2 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {line}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setCalendlyOpen(true)}
            data-funnel="demo-book"
            data-funnel-source="weekly-report-preview"
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.85rem 1.5rem",
              background:
                "linear-gradient(135deg, rgba(250,249,246,0.95), rgba(255,240,240,0.98), rgba(250,249,246,0.95))",
              color: "#111",
              border: "1px solid rgba(229,62,62,0.4)",
              borderLeft: "3px solid #E53E3E",
              boxShadow:
                "inset 0 0 40px rgba(229,62,62,0.12), 0 2px 12px rgba(229,62,62,0.2)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            See a real weekly report
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            borderTop: "3px solid #E53E3E",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.08), 0 4px 12px rgba(229,62,62,0.06)",
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              paddingBottom: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  marginBottom: "0.25rem",
                }}
              >
                Weekly Performance Report
              </div>
              <div
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#111",
                }}
              >
                Report #14 · Apr 13-19
              </div>
            </div>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.4)",
              }}
            >
              Powered by AniltX
            </div>
          </div>

          {/* Stat tiles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.6rem",
              marginBottom: "1.25rem",
            }}
          >
            <ReportStat label="Impressions" value="48,210" delta="+18.4%" />
            <ReportStat label="Clicks" value="1,184" delta="+22.1%" />
            <ReportStat label="CTR" value="2.45%" delta="+0.31pp" />
            <ReportStat label="Avg Position" value="14.7" delta="−2.1" />
          </div>

          {/* Sparkline */}
          <div
            style={{
              background: "#FAFBFC",
              border: "1px solid rgba(0,0,0,0.04)",
              padding: "0.85rem 1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.45)",
                }}
              >
                12-week impressions
              </span>
              <span
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "0.85rem",
                  color: "#E53E3E",
                  letterSpacing: "0.04em",
                }}
              >
                ↗ +361%
              </span>
            </div>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
              <defs>
                <linearGradient id="weekly-spark-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(229,62,62,0.25)" />
                  <stop offset="100%" stopColor="rgba(229,62,62,0)" />
                </linearGradient>
              </defs>
              <motion.path
                d={sparkArea}
                fill="url(#weekly-spark-fill)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <motion.path
                d={sparkPath}
                stroke="#E53E3E"
                strokeWidth={1.4}
                fill="none"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>

          {/* AE note */}
          <div
            style={{
              background: "rgba(229,62,62,0.04)",
              borderLeft: "2px solid #E53E3E",
              padding: "0.85rem 1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#0A0A0A",
                  border: "1px solid rgba(229,62,62,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.45)",
                }}
              >
                From your team
              </div>
            </div>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                color: "rgba(0,0,0,0.7)",
                lineHeight: 1.6,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;Big movers this week: 3 service-location pages climbed
              from page 2 to position 6. Rewriting their meta titles tomorrow
              to capture the 6→3 click bump. Worth a 15-min review of the
              top-3 lead intents.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />

      <style>{`
        @media (max-width: 760px) {
          .olg-weekly-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function ReportStat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  const positive = delta.startsWith("+") || delta.startsWith("↗");
  return (
    <div
      style={{
        background: "#FAF9F6",
        border: "1px solid rgba(0,0,0,0.05)",
        padding: "0.6rem 0.75rem",
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 8,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.4)",
          marginBottom: "0.2rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "0.3rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "1.15rem",
            color: "#111",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 9,
            color: positive ? "#10B981" : "#E53E3E",
            letterSpacing: "0.02em",
          }}
        >
          {delta}
        </span>
      </div>
    </div>
  );
}
