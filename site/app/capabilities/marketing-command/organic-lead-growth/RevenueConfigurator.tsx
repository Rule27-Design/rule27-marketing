"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CalendlyModal } from "@/app/components/CalendlyModal";
import {
  PRICING_TIERS,
  getPagesForRevenue,
  getTierForRevenue,
  type PricingTier,
} from "./data/pricing";

const MIN_REVENUE = 5000;
const MAX_REVENUE = 120000;
const DEFAULT_REVENUE = 18000;

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${(n / 1_000).toFixed(0)}K`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function formatPages(n: number): string {
  if (n >= 10_000) return `${(n / 1_000).toFixed(0)}K+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function RevenueConfigurator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [revenue, setRevenue] = useState(DEFAULT_REVENUE);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const activeTier = useMemo(() => getTierForRevenue(revenue), [revenue]);
  const pagesNeeded = useMemo(() => getPagesForRevenue(revenue), [revenue]);

  // Scroll-focus the matched tier after the user stops adjusting for 1.2s
  const activeTierIdRef = useRef(activeTier.id);
  useEffect(() => {
    activeTierIdRef.current = activeTier.id;
    const handle = setTimeout(() => {
      if (activeTierIdRef.current !== activeTier.id) return;
      const el = document.getElementById(`tier-${activeTier.id}`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!visible) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 1200);
    return () => clearTimeout(handle);
  }, [activeTier.id]);

  return (
    <section
      ref={ref}
      id="revenue-configurator"
      style={{
        padding: "clamp(4rem, 8vw, 6rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
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
          Configure your engine
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.75rem",
            lineHeight: 1.05,
          }}
        >
          How much revenue do you want to see?
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1rem",
            color: "rgba(0,0,0,0.6)",
            margin: "0 auto",
            maxWidth: 640,
            lineHeight: 1.65,
          }}
        >
          Drag the slider. We&apos;ll show you the page architecture that
          produces it - and the package it maps to. Same numbers we used to
          get NMHL from 79 to 7,300 daily impressions.
        </p>
      </div>

      {/* Slider */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1a0606 50%, #0A0A0A 100%)",
          border: "1px solid rgba(229,62,62,0.3)",
          borderLeft: "3px solid #E53E3E",
          padding: "clamp(1.5rem, 3vw, 2.25rem)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "60%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.2), transparent 65%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "0.4rem",
              }}
            >
              Monthly revenue target
            </div>
            <motion.div
              key={revenue}
              initial={{ scale: 0.96, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "clamp(2.75rem, 8vw, 4.5rem)",
                color: "#E53E3E",
                lineHeight: 1,
                letterSpacing: "0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatMoney(revenue)}
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.5)",
                  marginLeft: "0.6rem",
                  letterSpacing: "0.04em",
                }}
              >
                / month
              </span>
            </motion.div>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Metric label="You'd need" value={`${formatPages(pagesNeeded)} pages`} />
            <Metric
              label="Recommended tier"
              value={activeTier.name}
              accent
            />
          </div>
        </div>

        <input
          type="range"
          min={MIN_REVENUE}
          max={MAX_REVENUE}
          step={500}
          value={revenue}
          onChange={(e) => setRevenue(parseInt(e.target.value, 10))}
          aria-label="Monthly revenue target"
          style={{ width: "100%", position: "relative" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span>{formatMoney(MIN_REVENUE)}</span>
          <span>
            {formatMoney(MAX_REVENUE)}
            <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: 6 }}>+</span>
          </span>
        </div>
      </div>

      {/* Tier cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "1rem",
        }}
        className="olg-tier-grid"
      >
        {PRICING_TIERS.map((tier, i) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isActive={tier.id === activeTier.id}
            delay={0.1 + i * 0.06}
            inView={inView}
            onBook={() => setCalendlyOpen(true)}
          />
        ))}
      </div>

      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.8rem",
          color: "rgba(0,0,0,0.4)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Hosting on Rule27 infrastructure: $50/mo (covered for any active
        retainer). Custom projects scope in consultation.
      </p>

      <CalendlyModal
        isOpen={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
      />

      <style>{`
        @media (max-width: 880px) {
          .olg-tier-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .olg-tier-grid {
            grid-template-columns: 1fr !important;
          }
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #E53E3E ${((revenue - MIN_REVENUE) / (MAX_REVENUE - MIN_REVENUE)) * 100}%, rgba(255,255,255,0.15) ${((revenue - MIN_REVENUE) / (MAX_REVENUE - MIN_REVENUE)) * 100}%);
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 3px solid #E53E3E;
          box-shadow: 0 0 20px rgba(229,62,62,0.6), 0 4px 12px rgba(0,0,0,0.3);
          cursor: grab;
          margin-top: -9px;
        }
        input[type="range"]::-webkit-slider-thumb:active { cursor: grabbing; }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 3px solid #E53E3E;
          box-shadow: 0 0 20px rgba(229,62,62,0.6), 0 4px 12px rgba(0,0,0,0.3);
          cursor: grab;
        }
      `}</style>
    </section>
  );
}

function Metric({
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
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0.6, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "clamp(1.4rem, 3vw, 1.85rem)",
          color: accent ? "#E53E3E" : "#FFFFFF",
          lineHeight: 1,
          letterSpacing: "0.04em",
        }}
      >
        {value}
      </motion.div>
    </div>
  );
}

function TierCard({
  tier,
  isActive,
  delay,
  inView,
  onBook,
}: {
  tier: PricingTier;
  isActive: boolean;
  delay: number;
  inView: boolean;
  onBook: () => void;
}) {
  return (
    <motion.div
      id={`tier-${tier.id}`}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        background: isActive
          ? "linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.02)) #FAF9F6"
          : "#FAF9F6",
        border: isActive
          ? "1px solid rgba(229,62,62,0.5)"
          : "1px solid rgba(0,0,0,0.08)",
        borderLeft: "3px solid #E53E3E",
        boxShadow: isActive
          ? "0 16px 50px rgba(229,62,62,0.18), inset 0 0 80px rgba(229,62,62,0.04), 0 0 0 1px rgba(229,62,62,0.2)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        padding: "1.25rem 1.25rem 1.1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        overflow: "hidden",
        transform: isActive ? "translateY(-4px)" : "none",
        transition: "box-shadow 0.35s, transform 0.35s, border-color 0.35s",
      }}
    >
      {/* Active glow */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: -40,
            left: -40,
            right: -40,
            bottom: -40,
            background:
              "radial-gradient(circle, rgba(229,62,62,0.18), transparent 60%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            background: "rgba(229,62,62,0.08)",
            padding: "2px 8px",
            border: "1px solid rgba(229,62,62,0.3)",
          }}
        >
          {tier.pill}
        </span>
        {isActive && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 8,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#E53E3E",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#E53E3E",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(229,62,62,0.8)",
              }}
            />
            Match
          </motion.span>
        )}
      </div>

      <h3
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.25rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#111",
          margin: "0.25rem 0 0",
          lineHeight: 1.1,
          position: "relative",
        }}
      >
        {tier.name}
      </h3>
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.78rem",
          color: "rgba(0,0,0,0.5)",
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
          gap: "0.4rem",
          position: "relative",
          marginTop: "0.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "2rem",
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
            fontSize: "0.75rem",
            color: "rgba(0,0,0,0.45)",
          }}
        >
          {tier.cadence}
        </span>
      </div>

      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.75rem",
          color: "rgba(0,0,0,0.55)",
          position: "relative",
        }}
      >
        Retainer: <strong style={{ color: "#111" }}>{tier.retainer}</strong>
      </div>

      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.82rem",
          color: "rgba(0,0,0,0.6)",
          lineHeight: 1.55,
          margin: "0.5rem 0 0.5rem",
          flex: 1,
          position: "relative",
        }}
      >
        {tier.description}
      </p>

      {tier.note && (
        <div
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.72rem",
            color: "#E53E3E",
            fontStyle: "italic",
            position: "relative",
          }}
        >
          {tier.note}
        </div>
      )}

      <button
        onClick={onBook}
        style={{
          marginTop: "0.5rem",
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "0.75rem 1rem",
          background: isActive ? "#E53E3E" : "transparent",
          color: isActive ? "#FFFFFF" : "#111",
          border: isActive
            ? "1px solid #E53E3E"
            : "1px solid rgba(229,62,62,0.4)",
          borderLeft: "3px solid #E53E3E",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          boxShadow: isActive
            ? "0 6px 20px rgba(229,62,62,0.4)"
            : "inset 0 0 30px rgba(229,62,62,0.08)",
          transition: "all 0.25s",
          width: "100%",
          position: "relative",
        }}
      >
        {isActive ? "Book this" : "Talk about it"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </motion.div>
  );
}
