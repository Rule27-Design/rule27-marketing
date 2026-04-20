"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";
import { GrowthGraph } from "./GrowthGraph";
import type { ClientShowcaseData } from "./data/clients";
import { TOOLTIPS } from "./data/copy";

interface ClientShowcaseProps {
  clients: ClientShowcaseData[];
}

export function ClientShowcase({ clients }: ClientShowcaseProps) {
  const [activeId, setActiveId] = useState(clients[0]?.id ?? "");
  const active = clients.find((c) => c.id === activeId) ?? clients[0];

  if (!active) return null;

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

        {clients.map((client) => {
          const isActive = client.id === activeId;
          return (
            <button
              key={client.id}
              onClick={() => setActiveId(client.id)}
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
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(0,0,0,0.025)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "1.05rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isActive ? "#111" : "rgba(0,0,0,0.78)",
                  }}
                >
                  {client.name}
                </span>
                {client.realData && (
                  <span
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: 8,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#E53E3E",
                      background: "rgba(229,62,62,0.08)",
                      padding: "1px 5px",
                      border: "1px solid rgba(229,62,62,0.2)",
                    }}
                  >
                    Real
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "11px",
                  color: isActive ? "#E53E3E" : "rgba(0,0,0,0.5)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.4,
                }}
              >
                {client.micro}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: graph + stats + story */}
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
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            <GrowthGraph daily={active.daily} domain={active.domain} height={420} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <ShowcaseStat
                label="Pages before"
                value={active.beforePages.toLocaleString()}
                tooltip={TOOLTIPS.pages_indexed}
              />
              <ShowcaseStat
                label="Pages now"
                value={active.afterPages.toLocaleString()}
                tooltip={TOOLTIPS.pages_indexed}
                accent
              />
              <ShowcaseStat
                label="Traffic multiplier"
                value={active.trafficMultiplier}
                tooltip={TOOLTIPS.traffic_multiplier}
              />
              <ShowcaseStat
                label="Est. monthly revenue"
                value={`$${(active.monthlyRevenueEst / 1000).toFixed(1)}K`}
                tooltip={TOOLTIPS.monthly_revenue}
                accent
              />
            </div>

            {/* Story */}
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
                {active.story}
              </p>
            </div>

            {/* Real-data proof image */}
            {active.proofImage && (
              <div
                style={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(229,62,62,0.2)",
                  padding: "0.75rem",
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
                  ✓ Real GSC screenshot — {active.domain}
                </div>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={active.proofImage}
                    alt={`${active.name} GSC results`}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
              </div>
            )}
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
          fontSize: "1.85rem",
          color: accent ? "#E53E3E" : "#111",
          lineHeight: 1,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}
