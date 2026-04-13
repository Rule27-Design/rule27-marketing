"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CALENDLY_URL = "https://calendly.com/rule27design-info/30min";

function CalendlyOverlay({ onClose }: { onClose: () => void }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: "#111111",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.5rem",
          borderBottom: "2px solid #E53E3E",
          flexShrink: 0,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "18px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Book Your Free Consultation
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              margin: "4px 0 0",
            }}
          >
            Pick a time that works for you — 30 minutes, no commitment
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(229,62,62,0.15)",
            border: "1px solid rgba(229,62,62,0.3)",
            color: "#E53E3E",
            cursor: "pointer",
            fontSize: "20px",
            flexShrink: 0,
            borderRadius: 2,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E53E3E";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(229,62,62,0.15)";
            e.currentTarget.style.color = "#E53E3E";
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Calendly iframe — takes full remaining space */}
      <div style={{ flex: 1, background: "#FFFFFF" }}>
        <iframe
          src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=ffffff&text_color=111111&primary_color=E53E3E`}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Schedule a consultation with Rule27 Design"
        />
      </div>
    </motion.div>
  );
}

export function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && <CalendlyOverlay onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
}
