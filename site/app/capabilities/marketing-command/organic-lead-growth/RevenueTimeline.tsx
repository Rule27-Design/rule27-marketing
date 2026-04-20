"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";
import { POST_LAUNCH, WEEKS, PHASES } from "./data/timeline";

export function RevenueTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(4rem, 8vw, 6rem) 1.5rem",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ marginBottom: "2.5rem" }}>
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
          4 weeks to revenue
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.75rem",
            lineHeight: 1.05,
          }}
        >
          From contract to indexed pages - 28 days flat.
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1rem",
            color: "rgba(0,0,0,0.6)",
            margin: 0,
            maxWidth: 720,
            lineHeight: 1.65,
          }}
        >
          Most agencies pitch a 6-month strategy doc. We deploy 1,000+ pages in
          4 weeks and you watch the impression curve climb in your own GSC
          dashboard. Here&apos;s what each week looks like.
        </p>
      </div>

      {/* Week timeline */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "1rem",
          position: "relative",
          marginBottom: "3rem",
        }}
        className="olg-week-grid"
      >
        {/* Connector line */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: "10%",
            right: "10%",
            height: 2,
            background:
              "linear-gradient(90deg, rgba(229,62,62,0.2), rgba(229,62,62,0.6) 30%, rgba(229,62,62,0.6) 70%, rgba(229,62,62,0.2))",
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {WEEKS.map((step, i) => (
          <WeekCard key={step.week} step={step} index={i} inView={inView} />
        ))}
      </div>

      {/* Post-launch continuation */}
      <div
        style={{
          background: "#FAF9F6",
          border: "1px solid rgba(0,0,0,0.08)",
          borderLeft: "3px solid #E53E3E",
          padding: "clamp(1.5rem, 3vw, 2rem)",
          marginBottom: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 220,
            height: 180,
            background:
              "radial-gradient(circle, rgba(229,62,62,0.07), transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#E53E3E",
            borderBottom: "1px solid rgba(229,62,62,0.3)",
            paddingBottom: "4px",
            marginBottom: "1rem",
          }}
        >
          What happens next
        </div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 1.25rem",
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          Week 4 isn&apos;t the finish line. It&apos;s the starting gun.
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {POST_LAUNCH.map((p, i) => (
            <motion.div
              key={p.range}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                borderTop: "2px solid #E53E3E",
                padding: "1rem 1.1rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  marginBottom: "0.4rem",
                }}
              >
                {p.range}
              </div>
              <div
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#111",
                  marginBottom: "0.5rem",
                }}
              >
                {p.title}
              </div>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(0,0,0,0.6)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 8-Phase methodology callout */}
      <PhaseFlow inView={inView} />

      <style>{`
        @media (max-width: 760px) {
          .olg-week-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .olg-week-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function WeekCard({
  step,
  index,
  inView,
}: {
  step: (typeof WEEKS)[number];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.12 }}
      style={{
        position: "relative",
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        borderTop: "2px solid #E53E3E",
        padding: "1.25rem 1rem 1.1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Week number badge */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, #E53E3E 0%, #c73030 100%)",
          color: "#FFFFFF",
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.15rem",
          letterSpacing: "0.05em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 0.5rem",
          boxShadow: "0 6px 20px rgba(229,62,62,0.35)",
          border: "3px solid #FAF9F6",
          position: "relative",
          zIndex: 1,
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: 8, letterSpacing: "0.2em", opacity: 0.85 }}>
          WK
        </span>
        <span style={{ fontSize: "1.5rem", lineHeight: 1, marginTop: 1 }}>
          {step.week}
        </span>
      </div>

      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 9,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#E53E3E",
          textAlign: "center",
        }}
      >
        {step.label}
      </div>

      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#111",
          textAlign: "center",
          lineHeight: 1.2,
          minHeight: 38,
        }}
      >
        {step.title}
      </div>

      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.78rem",
          color: "rgba(0,0,0,0.6)",
          lineHeight: 1.55,
          margin: 0,
          flex: 1,
        }}
      >
        {step.what}
      </p>

      <div
        style={{
          marginTop: "0.5rem",
          padding: "0.6rem 0.7rem",
          background: "rgba(229,62,62,0.04)",
          border: "1px dashed rgba(229,62,62,0.25)",
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 8,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.45)",
            marginBottom: "0.25rem",
          }}
        >
          You see
        </div>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.75rem",
            color: "rgba(0,0,0,0.7)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {step.deliverable}
        </p>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "0.5rem 0 0.25rem",
        }}
      >
        <div
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "1.4rem",
            color: "#E53E3E",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          {step.metric}
        </div>
        <div
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.4)",
            marginTop: "0.2rem",
          }}
        >
          {step.metricLabel}
        </div>
      </div>
    </motion.div>
  );
}

function PhaseFlow({ inView }: { inView: boolean }) {
  return (
    <div
      style={{
        background: "#0A0A0A",
        border: "1px solid rgba(229,62,62,0.25)",
        padding: "clamp(1.5rem, 3vw, 2.25rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
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
            marginBottom: "0.75rem",
          }}
        >
          Inside the 4 weeks
        </div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            margin: 0,
            fontWeight: 400,
          }}
        >
          8 phases - one of them gates everything.
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "0.6rem",
          position: "relative",
        }}
      >
        {PHASES.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
            style={{
              padding: "0.75rem 0.85rem",
              background: p.isGate
                ? "linear-gradient(135deg, rgba(229,62,62,0.18), rgba(229,62,62,0.05))"
                : "rgba(255,255,255,0.04)",
              border: p.isGate
                ? "1px solid rgba(229,62,62,0.6)"
                : "1px solid rgba(255,255,255,0.08)",
              borderLeft: p.isGate
                ? "3px solid #E53E3E"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: p.isGate
                ? "0 0 24px rgba(229,62,62,0.25), inset 0 0 30px rgba(229,62,62,0.08)"
                : "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "0.85rem",
                  color: p.isGate ? "#E53E3E" : "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                {String(p.num).padStart(2, "0")}
              </span>
              {p.isGate && (
                <span
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: 8,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    background: "rgba(229,62,62,0.2)",
                    padding: "1px 5px",
                    border: "1px solid rgba(229,62,62,0.4)",
                  }}
                >
                  Gate
                </span>
              )}
              <Tooltip content={p.description} position="top" />
            </div>
            <div
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: p.isGate ? "#FFFFFF" : "rgba(255,255,255,0.85)",
                lineHeight: 1.2,
              }}
            >
              {p.name}
            </div>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: p.isGate
                  ? "rgba(255,200,200,0.7)"
                  : "rgba(255,255,255,0.35)",
              }}
            >
              {p.duration}
            </div>
          </motion.div>
        ))}
      </div>

      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.6,
          fontStyle: "italic",
          position: "relative",
        }}
      >
        Hover any phase for the detail. Phase 2 (SERP Validation) is the gate.
        Every other agency&apos;s failed deployment we&apos;ve seen skipped it.
      </p>
    </div>
  );
}
