"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendlyModal } from "@/app/components/CalendlyModal";
import { PRICING_FOOTNOTE, PRICING_TIERS } from "./data/pricing";

export function PricingCard() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <section
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2.25rem", textAlign: "center" }}>
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
          Pricing - fully exposed
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.5rem",
            lineHeight: 1.05,
          }}
        >
          One project. One retainer. No silver-bronze-gold games.
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1rem",
            color: "rgba(0,0,0,0.55)",
            margin: "0 auto",
            maxWidth: 620,
            lineHeight: 1.6,
          }}
        >
          Same scope, same price for every client. The only thing that varies
          is the size of your industry - see the{" "}
          <a href="#domain-capture" style={{ color: "#E53E3E" }}>
            page-count benchmarks above
          </a>{" "}
          for context.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1.5rem",
        }}
        className="olg-pricing-grid"
      >
        {PRICING_TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            style={{
              background: i === 0 ? "#FAF9F6" : "#0A0A0A",
              border: i === 0
                ? "1px solid rgba(0,0,0,0.08)"
                : "1px solid rgba(229,62,62,0.3)",
              borderLeft: "3px solid #E53E3E",
              padding: "1.75rem",
              position: "relative",
              overflow: "hidden",
              color: i === 0 ? "#111" : "#FFFFFF",
              boxShadow: i === 0
                ? "0 6px 20px rgba(0,0,0,0.04), inset 0 0 60px rgba(229,62,62,0.03)"
                : "0 12px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(229,62,62,0.04)",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "55%",
                height: "55%",
                background: i === 0
                  ? "radial-gradient(circle, rgba(229,62,62,0.07), transparent 65%)"
                  : "radial-gradient(circle, rgba(229,62,62,0.18), transparent 70%)",
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  background: i === 0
                    ? "rgba(229,62,62,0.08)"
                    : "rgba(229,62,62,0.18)",
                  padding: "2px 8px",
                  border: "1px solid rgba(229,62,62,0.3)",
                }}
              >
                {tier.pill}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                margin: "0 0 0.25rem",
                lineHeight: 1.05,
                fontWeight: 400,
                color: i === 0 ? "#111" : "#FFFFFF",
                position: "relative",
              }}
            >
              {tier.name}
            </h3>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                color: i === 0 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.55)",
                marginBottom: "1.25rem",
                fontStyle: "italic",
                position: "relative",
              }}
            >
              {tier.tagline}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
                marginBottom: "1.25rem",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                  color: "#E53E3E",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                {tier.price}
              </span>
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.9rem",
                  color: i === 0 ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)",
                }}
              >
                {tier.cadence}
              </span>
            </div>

            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.92rem",
                color: i === 0 ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.7)",
                lineHeight: 1.65,
                margin: "0 0 1.25rem",
                position: "relative",
              }}
            >
              {tier.description}
            </p>

            {tier.schedule && (
              <div
                style={{
                  marginBottom: "1.25rem",
                  padding: "0.85rem 1rem",
                  background: i === 0
                    ? "rgba(229,62,62,0.04)"
                    : "rgba(229,62,62,0.08)",
                  borderLeft: "2px solid #E53E3E",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    marginBottom: "0.5rem",
                  }}
                >
                  Payment schedule
                </div>
                {tier.schedule.map((line) => (
                  <div
                    key={line}
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.85rem",
                      color: i === 0 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.75)",
                      lineHeight: 1.6,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                position: "relative",
              }}
            >
              {tier.inclusions.map((inc) => (
                <li
                  key={inc}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "flex-start",
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.88rem",
                    color: i === 0 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.75)",
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
                  {inc}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setCalendlyOpen(true)}
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "0.85rem 1.5rem",
                background: i === 0
                  ? "linear-gradient(135deg, rgba(250,249,246,0.95), rgba(255,240,240,0.98), rgba(250,249,246,0.95))"
                  : "#E53E3E",
                color: i === 0 ? "#111" : "#FFFFFF",
                border: i === 0
                  ? "1px solid rgba(229,62,62,0.4)"
                  : "1px solid #E53E3E",
                borderLeft: "3px solid #E53E3E",
                boxShadow: i === 0
                  ? "inset 0 0 40px rgba(229,62,62,0.12), 0 2px 12px rgba(229,62,62,0.2)"
                  : "0 6px 24px rgba(229,62,62,0.4), inset 0 0 30px rgba(255,200,200,0.1)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                justifyContent: "center",
                position: "relative",
              }}
            >
              Talk pricing
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
          </motion.div>
        ))}
      </div>

      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.8rem",
          color: "rgba(0,0,0,0.45)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {PRICING_FOOTNOTE}
      </p>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />

      <style>{`
        @media (max-width: 760px) {
          .olg-pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
