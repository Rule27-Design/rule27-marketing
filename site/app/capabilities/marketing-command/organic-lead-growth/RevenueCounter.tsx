"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";

interface RevenueCounterProps {
  target: number;
  label: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }
  return value.toLocaleString();
}

export function RevenueCounter({
  target,
  label,
  tooltip,
  prefix = "$",
  suffix = "",
  durationMs = 2000,
}: RevenueCounterProps) {
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
      setValue(Math.floor(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, durationMs]);

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        padding: "clamp(2rem, 5vw, 3.5rem) 1.5rem",
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        borderTop: "2px solid #E53E3E",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(229,62,62,0.6), transparent 60%), radial-gradient(circle at 70% 70%, rgba(229,62,62,0.4), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.5)",
          marginBottom: "0.75rem",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {label}
        {tooltip && <Tooltip content={tooltip} position="top" />}
      </div>

      <div
        style={{
          position: "relative",
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "clamp(3rem, 9vw, 5.5rem)",
          color: "#111111",
          lineHeight: 1,
          letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: "#E53E3E" }}>{prefix}</span>
        {formatNumber(value)}
        {suffix}
      </div>

      <div
        style={{
          position: "relative",
          marginTop: "0.75rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "12px",
          color: "rgba(0,0,0,0.4)",
          fontStyle: "italic",
        }}
      >
        — captured by your competitors. Right now.
      </div>
    </div>
  );
}
