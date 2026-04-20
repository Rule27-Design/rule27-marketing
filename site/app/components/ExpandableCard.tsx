"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableCardProps {
  title: string;
  preview: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ExpandableCard({ title, preview, children, defaultOpen = false }: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: open ? "rgba(229,62,62,0.02)" : "#FFFFFF",
        border: `1px solid ${open ? "rgba(229,62,62,0.2)" : "rgba(0,0,0,0.06)"}`,
        borderLeft: `2px solid ${open ? "#E53E3E" : "rgba(0,0,0,0.08)"}`,
        transition: "all 0.3s",
        overflow: "hidden",
      }}
    >
      {/* Header - clickable */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: open ? "#E53E3E" : "#111111",
              margin: "0 0 0.35rem",
              transition: "color 0.2s",
            }}
          >
            {title}
          </h4>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "13px",
              color: "rgba(0,0,0,0.5)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {preview}
          </p>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: "#E53E3E",
            fontSize: "18px",
            flexShrink: 0,
            lineHeight: 1,
            marginTop: "2px",
          }}
        >
          +
        </motion.span>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 1.5rem 1.25rem",
                borderTop: "1px solid rgba(229,62,62,0.08)",
                paddingTop: "1.25rem",
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
