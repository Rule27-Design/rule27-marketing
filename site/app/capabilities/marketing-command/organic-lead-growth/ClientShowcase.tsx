"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";
import { GrowthGraph } from "./GrowthGraph";
import type { ClientEntry } from "./data/clients";
import { TOOLTIPS } from "./data/copy";

interface ClientShowcaseProps {
  clients: ClientEntry[];
}

function deriveDomain(meta: ClientEntry["data"]["meta"]): string {
  // meta.name may be "NMHL" or "SolomonSignal.com" - derive a sensible domain string
  const n = meta.name.toLowerCase();
  if (n.includes(".")) return n;
  return `${n}.com`;
}

export function ClientShowcase({ clients }: ClientShowcaseProps) {
  const [activeSlug, setActiveSlug] = useState(clients[0]?.slug ?? "");
  const active =
    clients.find((c) => c.slug === activeSlug) ?? clients[0];

  if (!active) return null;

  const { meta, summary, dataPoints } = active.data;
  const domain = deriveDomain(meta);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 280px) minmax(0, 1fr)",
        gap: "1.25rem",
        alignItems: "stretch",
      }}
      className="olg-showcase-grid"
    >
      {/* Left: client list */}
      <div
        style={{
          background: "#FAF9F6",
          border: "1px solid rgba(0,0,0,0.08)",
          borderLeft: "3px solid #E53E3E",
          maxHeight: 620,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
        className="olg-showcase-list"
      >
        <div
          style={{
            padding: "0.85rem 1.1rem",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            position: "sticky",
            top: 0,
            background: "#FAF9F6",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.45)",
              borderBottom: "1px solid rgba(229,62,62,0.3)",
              paddingBottom: "3px",
            }}
          >
            Tap a client
          </span>
        </div>

        {clients.map((entry) => {
          const isActive = entry.slug === activeSlug;
          return (
            <button
              key={entry.slug}
              onClick={() => setActiveSlug(entry.slug)}
              style={{
                textAlign: "left",
                padding: "0.95rem 1.1rem",
                background: isActive ? "rgba(229,62,62,0.08)" : "transparent",
                border: "none",
                borderLeft: isActive
                  ? "3px solid #E53E3E"
                  : "3px solid transparent",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "background 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(0,0,0,0.025)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "1.05rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isActive ? "#111" : "rgba(0,0,0,0.78)",
                }}
              >
                {entry.data.meta.name}
              </span>
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "11px",
                  color: isActive ? "#E53E3E" : "rgba(0,0,0,0.5)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.4,
                }}
              >
                {entry.data.meta.caseStudyHeadline} · {entry.data.meta.timeframeLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: graph + stats + headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          minWidth: 0,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <GrowthGraph
              dataPoints={dataPoints}
              domain={domain}
              height={420}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <ShowcaseStat
                label="Pages deployed"
                value={summary.pagesDeployed > 0 ? `${summary.pagesDeployed.toLocaleString()}+` : "-"}
                tooltip={TOOLTIPS.pages_indexed}
              />
              <ShowcaseStat
                label="Growth"
                value={`${summary.growthMultiplier.toFixed(summary.growthMultiplier < 10 ? 1 : 0)}x`}
                tooltip={TOOLTIPS.traffic_multiplier}
                accent
              />
              <ShowcaseStat
                label="Start / end impressions"
                value={`${summary.startImpressions} → ${summary.endImpressions.toLocaleString()}/day`}
                tooltip={TOOLTIPS.organic_traffic}
              />
              <ShowcaseStat
                label="Timeframe"
                value={`${summary.timeframeDays} days`}
                accent
              />
            </div>

            {/* Headline callout */}
            <div
              style={{
                background: "#FAF9F6",
                border: "1px solid rgba(0,0,0,0.06)",
                borderLeft: "2px solid #E53E3E",
                padding: "1rem 1.25rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 90,
                  height: 90,
                  background:
                    "radial-gradient(circle, rgba(229,62,62,0.05) 0%, transparent 65%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  marginBottom: "0.5rem",
                }}
              >
                The play
              </div>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.92rem",
                  color: "rgba(0,0,0,0.7)",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {meta.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .olg-showcase-grid {
            grid-template-columns: 1fr !important;
          }
          .olg-showcase-list {
            max-height: 280px !important;
          }
        }
      `}</style>
    </div>
  );
}

function ShowcaseStat({
  label,
  value,
  tooltip,
  accent,
}: {
  label: string;
  value: string;
  tooltip?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: "0.95rem 1rem",
        background: "#FAF9F6",
        border: "1px solid rgba(0,0,0,0.08)",
        borderTop: accent
          ? "2px solid #E53E3E"
          : "1px solid rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 50,
          height: 50,
          background: accent
            ? "radial-gradient(circle, rgba(229,62,62,0.05) 0%, transparent 70%)"
            : "transparent",
        }}
      />
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "9px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.45)",
          marginBottom: "0.45rem",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {label}
        {tooltip && <Tooltip content={tooltip} position="top" />}
      </div>
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.45rem",
          color: accent ? "#E53E3E" : "#111",
          lineHeight: 1.05,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
