"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendlyModal } from "@/app/components/CalendlyModal";
import { FAQS } from "./data/faqs";

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <section
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E53E3E",
            borderBottom: "1px solid rgba(229,62,62,0.3)",
            paddingBottom: "4px",
            marginBottom: "1rem",
          }}
        >
          Real questions, straight answers
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          The 8 things every prospect asks us.
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {FAQS.map((faq, i) => {
          const open = openIdx === i;
          return (
            <div
              key={faq.q}
              style={{
                background: open ? "rgba(229,62,62,0.03)" : "#FAF9F6",
                border: "1px solid rgba(0,0,0,0.08)",
                borderLeft: open
                  ? "3px solid #E53E3E"
                  : "3px solid rgba(229,62,62,0.2)",
                overflow: "hidden",
                transition: "all 0.25s",
              }}
            >
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "1.1rem 1.25rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "0.95rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: open ? "#E53E3E" : "#111",
                    margin: 0,
                    transition: "color 0.2s",
                    lineHeight: 1.3,
                  }}
                >
                  {faq.q}
                </h3>
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: "#E53E3E",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                    lineHeight: 1,
                    marginTop: "2px",
                  }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        padding: "0 1.25rem 1.25rem",
                        borderTop: "1px solid rgba(229,62,62,0.08)",
                        paddingTop: "1rem",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "0.92rem",
                          color: "rgba(0,0,0,0.7)",
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Final FAQ → Calendly */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem 1.75rem",
          background:
            "linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.02))",
          border: "1px solid rgba(229,62,62,0.18)",
          borderLeft: "3px solid #E53E3E",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.65)",
            margin: "0 0 1rem",
            lineHeight: 1.6,
          }}
        >
          Question we didn&apos;t answer? Worth 15 minutes.
        </p>
        <button
          onClick={() => setCalendlyOpen(true)}
          data-funnel="demo-book"
          data-funnel-source="faq"
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "13px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0.85rem 1.75rem",
            background:
              "linear-gradient(135deg, rgba(250,249,246,0.95), rgba(255,240,240,0.98), rgba(250,249,246,0.95))",
            color: "#111",
            border: "1px solid rgba(229,62,62,0.4)",
            borderLeft: "3px solid #E53E3E",
            boxShadow:
              "inset 0 0 40px rgba(229,62,62,0.12), 0 2px 12px rgba(229,62,62,0.2)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Book 15 minutes
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
}
