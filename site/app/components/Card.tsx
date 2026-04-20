"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WaveBorder } from "./WaveBorder";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  label?: string;
  title?: string;
  description?: string;
}

/**
 * R27Card - RULE27 Primary Card with WaveBorder animation.
 * Matches the Theme Component Display's R27Card exactly.
 */
export function Card({
  children,
  className,
  label,
  title,
  description,
}: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={className}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#FFFFFF",
        border: `1px solid ${hovered ? "rgba(229,62,62,0.15)" : "rgba(0,0,0,0.06)"}`,
        padding: "1.5rem",
        borderRadius: "2px",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(229,62,62,0.06)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.3s, transform 0.3s, border-color 0.3s",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <WaveBorder animated={hovered} />

      {label && (
        <span
          style={{
            display: "inline-block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.2em",
            color: "#E53E3E",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            borderBottom: "1px solid rgba(229,62,62,0.3)",
            paddingBottom: "4px",
          }}
        >
          {label}
        </span>
      )}

      {title && (
        <h3
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontWeight: "500",
            fontSize: "18px",
            color: "#000",
            margin: "0 0 0.75rem 0",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "13px",
            color: "rgba(0,0,0,0.55)",
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {description}
        </p>
      )}

      {children}
    </motion.div>
  );
}

/**
 * R27StatCard - RULE27 Statistics Card with red top border.
 * Matches the Theme Component Display's R27StatCard exactly.
 */
export function StatCard({
  label,
  value,
  unit,
  change,
}: {
  label: string;
  value: string;
  unit?: string;
  change?: string;
}) {
  return (
    <div
      style={{
        padding: "1.25rem",
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
          top: 0,
          right: 0,
          width: "60px",
          height: "60px",
          background:
            "radial-gradient(circle, rgba(229,62,62,0.03) 0%, transparent 70%)",
        }}
      />
      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: "rgba(0,0,0,0.45)",
          textTransform: "uppercase",
          margin: "0 0 0.5rem 0",
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "32px",
            color: "#111",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "12px",
              color: "rgba(0,0,0,0.4)",
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {change && (
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "11px",
            color: change.startsWith("+") ? "#00b450" : "#E53E3E",
            marginTop: "4px",
            display: "block",
          }}
        >
          {change}
        </span>
      )}
    </div>
  );
}
