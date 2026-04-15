"use client";

import { useState, useEffect } from "react";
import { CalendlyModal } from "@/app/components/CalendlyModal";

export function StickyCTA({ serviceTitle }: { serviceTitle: string }) {
  const [visible, setVisible] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "rgba(0,0,0,0.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(229,62,62,0.15)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E53E3E", flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {serviceTitle}
            </span>
          </div>

          <button
            onClick={() => setCalendlyOpen(true)}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "10px 24px",
              background: "#E53E3E",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: 2,
              flexShrink: 0,
              transition: "opacity 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            Get Started
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  );
}
