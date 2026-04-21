"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CalendlyModal } from "@/app/components/CalendlyModal";

interface CTACardProps {
  variant: "inquiry" | "download" | "video" | "calendly";
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
  onClick?: () => void;
  badge?: string;
  visualSlot?: React.ReactNode;
}

/**
 * High-impact CTA card based on the R27Card primary pattern:
 *   - bg #FAF9F6
 *   - 1px black border
 *   - 3px red left accent (R27Button primary "borderLeft" pattern)
 *   - hover lift
 *   - integrated visual slot for icon/SVG/preview
 */
export function CTACard({
  variant,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  onClick,
  badge,
  visualSlot,
}: CTACardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const accent = variant === "download" ? "#E53E3E" : "#E53E3E";
  const visual = visualSlot ?? <DefaultVisual variant={variant} />;

  const Body = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      style={{
        position: "relative",
        background: "#FAF9F6",
        border: "1px solid rgba(0,0,0,0.08)",
        borderLeft: `3px solid ${accent}`,
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.04), inset 0 0 60px rgba(229,62,62,0.03)",
        padding: "1.75rem 1.75rem 1.75rem 1.75rem",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
        gap: "1.5rem",
        alignItems: "center",
        overflow: "hidden",
        transition: "box-shadow 0.3s",
      }}
      className="olg-cta-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 16px 50px rgba(0,0,0,0.08), 0 4px 12px rgba(229,62,62,0.12), inset 0 0 80px rgba(229,62,62,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.04), inset 0 0 60px rgba(229,62,62,0.03)";
      }}
    >
      {/* Decorative corner gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 220,
          height: 180,
          background:
            "radial-gradient(circle at top right, rgba(229,62,62,0.07), transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: 40,
          width: 160,
          height: 80,
          background:
            "radial-gradient(ellipse, rgba(229,62,62,0.04), transparent 70%)",
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />

      {/* Left: copy + CTA */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "#E53E3E",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(229,62,62,0.3)",
              paddingBottom: "3px",
            }}
          >
            {eyebrow}
          </span>
          {badge && (
            <span
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#E53E3E",
                background: "rgba(229,62,62,0.1)",
                padding: "2px 6px",
                border: "1px solid rgba(229,62,62,0.25)",
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.2rem, 2.4vw, 1.65rem)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.6rem",
            lineHeight: 1.15,
            fontWeight: 400,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.6)",
            margin: "0 0 1.25rem",
            lineHeight: 1.65,
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
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
          }}
        >
          {ctaLabel}
          <CTAArrow variant={variant} />
        </div>
      </div>

      {/* Right: visual slot */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 140,
        }}
        className="olg-cta-visual"
      >
        {visual}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .olg-cta-card {
            grid-template-columns: 1fr !important;
          }
          .olg-cta-visual {
            order: -1;
          }
        }
      `}</style>
    </motion.div>
  );

  if (variant === "calendly") {
    return <CalendlyButtonWrapper>{Body}</CalendlyButtonWrapper>;
  }
  if (ctaHref) {
    return (
      <Link href={ctaHref} style={{ textDecoration: "none", color: "inherit" }}>
        {Body}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          textAlign: "left",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {Body}
      </button>
    );
  }
  return Body;
}

function CalendlyButtonWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          textAlign: "left",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {children}
      </button>
      <CalendlyModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

function CTAArrow({ variant }: { variant: CTACardProps["variant"] }) {
  if (variant === "download") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    );
  }
  if (variant === "video") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  }
  if (variant === "calendly") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function DefaultVisual({ variant }: { variant: CTACardProps["variant"] }) {
  if (variant === "download") return <PdfMockVisual />;
  if (variant === "video") return <VideoFrameVisual />;
  if (variant === "calendly") return <CalendlyVisual />;
  return <ScopeVisual />;
}

function ScopeVisual() {
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", maxWidth: 220, height: "auto", display: "block" }}>
      <defs>
        <radialGradient id="scope-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(229,62,62,0.5)" />
          <stop offset="100%" stopColor="rgba(229,62,62,0)" />
        </radialGradient>
      </defs>
      <rect x="6" y="6" width="188" height="128" fill="rgba(255,255,255,0.6)" stroke="rgba(0,0,0,0.08)" />
      <circle cx="100" cy="70" r="42" fill="url(#scope-glow)" />
      <circle cx="100" cy="70" r="32" fill="none" stroke="#E53E3E" strokeWidth="1.4" strokeDasharray="3 3" />
      <circle cx="100" cy="70" r="18" fill="none" stroke="#E53E3E" strokeWidth="1.4" />
      <circle cx="100" cy="70" r="3" fill="#E53E3E" />
      <line x1="100" y1="38" x2="100" y2="50" stroke="#E53E3E" strokeWidth="1.4" />
      <line x1="100" y1="90" x2="100" y2="102" stroke="#E53E3E" strokeWidth="1.4" />
      <line x1="68" y1="70" x2="80" y2="70" stroke="#E53E3E" strokeWidth="1.4" />
      <line x1="120" y1="70" x2="132" y2="70" stroke="#E53E3E" strokeWidth="1.4" />
      <text x="100" y="128" fontSize="9" fill="rgba(0,0,0,0.45)" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" letterSpacing="2">
        SCANNING DOMAIN…
      </text>
    </svg>
  );
}

function PdfMockVisual() {
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", maxWidth: 200, height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="pdf-stack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FAF9F6" />
        </linearGradient>
      </defs>
      {/* Stack effect */}
      <rect x="48" y="22" width="110" height="106" fill="rgba(0,0,0,0.04)" transform="rotate(-4 100 70)" />
      <rect x="44" y="18" width="110" height="110" fill="url(#pdf-stack)" stroke="rgba(0,0,0,0.1)" />
      {/* Top of page */}
      <rect x="44" y="18" width="110" height="6" fill="#E53E3E" />
      {/* Content lines */}
      {[34, 44, 54, 70, 80, 90, 100].map((y, i) => (
        <rect
          key={i}
          x="56"
          y={y}
          width={i === 0 ? 80 : i === 3 ? 70 : 90}
          height="3"
          fill={i === 0 ? "#111" : i === 3 ? "#E53E3E" : "rgba(0,0,0,0.18)"}
        />
      ))}
      {/* Mock chart */}
      <rect x="56" y="60" width="86" height="6" fill="rgba(0,0,0,0.04)" />
      <path d="M 56 64 L 70 62 L 86 60 L 102 56 L 120 52 L 142 50" stroke="#E53E3E" strokeWidth="1.2" fill="none" />
      {/* PDF tag */}
      <rect x="58" y="110" width="18" height="9" fill="#E53E3E" />
      <text x="67" y="117" fontSize="7" fill="#FFFFFF" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" fontWeight="700">
        PDF
      </text>
    </svg>
  );
}

function CalendlyVisual() {
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", maxWidth: 200, height: "auto", display: "block" }}>
      <rect x="14" y="14" width="172" height="112" fill="#FFFFFF" stroke="rgba(0,0,0,0.1)" />
      <rect x="14" y="14" width="172" height="22" fill="#0A0A0A" />
      <text x="100" y="29" fontSize="9" fill="#FFFFFF" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" letterSpacing="2.5">
        BOOK 15 MINUTES
      </text>
      {/* Day headers */}
      {["M", "T", "W", "T", "F"].map((d, i) => (
        <text key={i} x={30 + i * 28} y={48} fontSize="7" fill="rgba(0,0,0,0.45)" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif" letterSpacing="1">
          {d}
        </text>
      ))}
      {/* Date cells */}
      {Array.from({ length: 15 }).map((_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const isPicked = i === 7;
        const isAvail = [2, 3, 5, 6, 9, 10, 12, 13].includes(i);
        return (
          <g key={i}>
            <rect
              x={20 + col * 28}
              y={56 + row * 22}
              width={20}
              height={18}
              fill={isPicked ? "#E53E3E" : isAvail ? "rgba(229,62,62,0.06)" : "rgba(0,0,0,0.02)"}
              stroke={isPicked ? "#E53E3E" : isAvail ? "rgba(229,62,62,0.25)" : "rgba(0,0,0,0.05)"}
              strokeWidth={0.5}
            />
            <text
              x={30 + col * 28}
              y={68 + row * 22}
              fontSize="8"
              fill={isPicked ? "#FFFFFF" : isAvail ? "#E53E3E" : "rgba(0,0,0,0.25)"}
              textAnchor="middle"
              fontFamily="Helvetica Neue, sans-serif"
              fontWeight={isPicked ? 700 : 500}
            >
              {i + 12}
            </text>
          </g>
        );
      })}
      <text x="100" y="125" fontSize="7" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontFamily="Helvetica Neue, sans-serif">
        Wed · 2:30 PM available
      </text>
    </svg>
  );
}

function VideoFrameVisual() {
  return (
    <svg viewBox="0 0 200 140" style={{ width: "100%", maxWidth: 220, height: "auto", display: "block" }}>
      <rect x="6" y="6" width="188" height="128" fill="#0A0A0A" stroke="rgba(229,62,62,0.3)" />
      <rect x="14" y="14" width="172" height="112" fill="url(#video-grad)" />
      <defs>
        <linearGradient id="video-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="70" r="22" fill="rgba(229,62,62,0.85)" />
      <polygon points="93,60 93,80 112,70" fill="#FFFFFF" />
      <rect x="14" y="118" width="172" height="2" fill="rgba(255,255,255,0.1)" />
      <rect x="14" y="118" width="62" height="2" fill="#E53E3E" />
    </svg>
  );
}
