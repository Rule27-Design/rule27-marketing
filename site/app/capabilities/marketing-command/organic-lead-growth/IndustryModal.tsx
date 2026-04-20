"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  INDUSTRY_LIST,
  type IndustrySlug,
  type IndustryContent,
} from "./data/industries";

interface IndustryModalProps {
  open: boolean;
  suggested?: IndustrySlug | null;
  onSelect: (slug: IndustrySlug) => void;
  firstName?: string | null;
}

export function IndustryModal({
  open,
  suggested,
  onSelect,
  firstName,
}: IndustryModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background:
              "radial-gradient(circle at 30% 20%, rgba(229,62,62,0.12), transparent 50%), rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            overflowY: "auto",
          }}
        >
          {/* Behind-modal motion */}
          <BehindModalShapes />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 760,
              background: "#FAF9F6",
              border: "1px solid rgba(0,0,0,0.08)",
              borderLeft: "3px solid #E53E3E",
              boxShadow:
                "0 30px 90px rgba(0,0,0,0.55), inset 0 0 60px rgba(229,62,62,0.04), 0 0 0 1px rgba(229,62,62,0.08)",
              padding: "clamp(1.75rem, 4vw, 2.75rem)",
              overflow: "hidden",
            }}
          >
            {/* Decorative corner accents */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 200,
                height: 200,
                background:
                  "radial-gradient(circle, rgba(229,62,62,0.08) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -40,
                left: -40,
                width: 180,
                height: 180,
                background:
                  "radial-gradient(circle, rgba(229,62,62,0.05) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />

            {/* Eyebrow with red underline (R27Card label pattern) */}
            <span
              style={{
                display: "inline-block",
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "#E53E3E",
                textTransform: "uppercase",
                marginBottom: "1rem",
                borderBottom: "1px solid rgba(229,62,62,0.3)",
                paddingBottom: "5px",
                position: "relative",
                zIndex: 1,
              }}
            >
              First - pick your world
            </span>

            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 400,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.5rem",
                lineHeight: 1.05,
                position: "relative",
                zIndex: 1,
              }}
            >
              {firstName ? `${firstName}, ` : ""}before we show you anything…
            </h2>

            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                color: "rgba(0,0,0,0.6)",
                margin: "0 0 1.75rem",
                lineHeight: 1.7,
                maxWidth: 540,
                position: "relative",
                zIndex: 1,
              }}
            >
              Pick the world your business lives in. Every number, every
              comparison, every door we count gets reframed in your language.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                gap: "0.6rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              {INDUSTRY_LIST.map((ind) => (
                <IndustryButton
                  key={ind.slug}
                  industry={ind}
                  highlighted={suggested === ind.slug}
                  onClick={() => onSelect(ind.slug)}
                />
              ))}
            </div>

            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(0,0,0,0.4)",
                margin: "1.5rem 0 0",
                fontStyle: "italic",
                lineHeight: 1.5,
                position: "relative",
                zIndex: 1,
              }}
            >
              We use this to swap the data - nothing else. Pick the closest fit
              if your industry isn&apos;t on the list.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IndustryButton({
  industry,
  highlighted,
  onClick,
}: {
  industry: IndustryContent;
  highlighted: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        textAlign: "left",
        padding: "0.95rem 1.1rem",
        background: highlighted
          ? "linear-gradient(135deg, rgba(229,62,62,0.1), rgba(229,62,62,0.04))"
          : "#FFFFFF",
        border: highlighted
          ? "1px solid rgba(229,62,62,0.5)"
          : "1px solid rgba(0,0,0,0.08)",
        borderLeft: highlighted
          ? "3px solid #E53E3E"
          : "3px solid rgba(229,62,62,0.15)",
        cursor: "pointer",
        fontFamily: "'Steelfish', 'Impact', sans-serif",
        fontSize: "0.95rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#111",
        boxShadow: highlighted
          ? "inset 0 0 30px rgba(229,62,62,0.08), 0 2px 8px rgba(229,62,62,0.1)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderLeftColor = "#E53E3E";
        if (!highlighted) {
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)";
        }
      }}
      onMouseLeave={(e) => {
        if (!highlighted) {
          e.currentTarget.style.borderLeftColor = "rgba(229,62,62,0.15)";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
        }
      }}
    >
      <span>{industry.displayName}</span>
      {highlighted && (
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: "#E53E3E",
            background: "rgba(229,62,62,0.12)",
            padding: "2px 6px",
            border: "1px solid rgba(229,62,62,0.25)",
          }}
        >
          ✓ match
        </span>
      )}
    </motion.button>
  );
}

function BehindModalShapes() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1.1, 0.8],
            x: [0, i % 2 === 0 ? 30 : -30, 0],
          }}
          transition={{
            duration: 8 + i * 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          style={{
            position: "absolute",
            top: `${15 + i * 22}%`,
            left: `${i % 2 === 0 ? 8 : 70}%`,
            width: 200 + i * 40,
            height: 200 + i * 40,
            background: `radial-gradient(circle, rgba(229,62,62,${0.04 + i * 0.01}), transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </div>
  );
}
