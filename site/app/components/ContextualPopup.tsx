"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookCallButton } from "./BookCallButton";

interface ContextualPopupProps {
  triggerDepth?: number;
  title: string;
  text: string;
  ctaText: string;
  serviceSlug: string;
}

export function ContextualPopup({
  triggerDepth = 0.6,
  title,
  text,
  ctaText,
  serviceSlug,
}: ContextualPopupProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const key = `popup-dismissed-${serviceSlug}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const depth = scrollTop / docHeight;
        if (depth >= triggerDepth && !dismissed) {
          setVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerDepth, dismissed, serviceSlug]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`popup-dismissed-${serviceSlug}`, "1");
    }
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          style={{
            position: "fixed",
            bottom: "5rem",
            right: "1.5rem",
            zIndex: 99990,
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            borderTop: "2px solid #E53E3E",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(229,62,62,0.06)",
            maxWidth: 340,
            padding: "1.25rem",
            borderRadius: 2,
          }}
        >
          {/* Close */}
          <button
            onClick={handleDismiss}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              color: "rgba(0,0,0,0.3)",
              cursor: "pointer",
              fontSize: "14px",
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>

          <h4
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.5rem",
              paddingRight: "1.5rem",
            }}
          >
            {title}
          </h4>

          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "13px",
              color: "rgba(0,0,0,0.5)",
              margin: "0 0 1rem",
              lineHeight: 1.5,
            }}
          >
            {text}
          </p>

          <BookCallButton
            style={{
              width: "100%",
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "10px 20px",
              background: "#E53E3E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {ctaText}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </BookCallButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
