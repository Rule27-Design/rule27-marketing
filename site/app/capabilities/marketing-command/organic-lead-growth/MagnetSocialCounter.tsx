"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";

interface MagnetSocialCounterProps {
  /** Source of truth count. In dev this is a static stub; when Odoo is wired,
   *  this becomes the live pipeline count. */
  total: number;
  label?: string;
  tooltip?: string;
  durationMs?: number;
}

function format(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.floor(n / 1_000).toLocaleString()}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function MagnetSocialCounter({
  total,
  label = "Companies in our magnet pipeline",
  tooltip = "Pipeline count = businesses we've researched and have magnet reports prepared for — regardless of whether they've engaged yet. Social proof from scale, not claimed outcomes.",
  durationMs = 2400,
}: MagnetSocialCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(total * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, total, durationMs]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "0.9rem 1.25rem",
        background: "linear-gradient(135deg, #0A0A0A 0%, #1a0606 100%)",
        border: "1px solid rgba(229,62,62,0.3)",
        borderLeft: "3px solid #E53E3E",
        maxWidth: 760,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(229,62,62,0.15), transparent 65%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Pulsing live dot */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            position: "relative",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#E53E3E",
            display: "inline-block",
            boxShadow: "0 0 12px rgba(229,62,62,0.7)",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "2px solid #E53E3E",
              animation: "mag-pulse 2s ease-out infinite",
            }}
          />
        </span>
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#E53E3E",
          }}
        >
          Live
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "clamp(1.75rem, 4vw, 2.6rem)",
          color: "#FFFFFF",
          lineHeight: 1,
          letterSpacing: "0.04em",
          fontVariantNumeric: "tabular-nums",
          position: "relative",
        }}
      >
        {format(value)}
      </div>

      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.45,
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        {label}
        <Tooltip content={tooltip} position="top" />
      </div>

      <style>{`
        @keyframes mag-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
