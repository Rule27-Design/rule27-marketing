"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CALENDLY_URL = "https://calendly.com/rule27design-info/30min";

export function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 99998,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(680px, 95vw)",
              height: "min(750px, 90vh)",
              background: "#FFFFFF",
              borderRadius: 4,
              overflow: "hidden",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom: "2px solid #E53E3E",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "16px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#111111",
                    margin: 0,
                  }}
                >
                  Book Your Free Consultation
                </h2>
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "13px",
                    color: "rgba(0,0,0,0.45)",
                    margin: "2px 0 0",
                  }}
                >
                  Pick a time that works for you — 30 minutes, no commitment
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(229,62,62,0.06)",
                  border: "1px solid rgba(229,62,62,0.15)",
                  color: "#E53E3E",
                  cursor: "pointer",
                  fontSize: "18px",
                  flexShrink: 0,
                  borderRadius: 2,
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Calendly Embed */}
            <div style={{ flex: 1, position: "relative" }}>
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
        </>
      )}
    </AnimatePresence>
  );
}
