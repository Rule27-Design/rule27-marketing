"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendlyModal } from "@/app/components/CalendlyModal";

interface DomainCaptureFormProps {
  onSubmit?: (domain: string) => void;
  defaultDomain?: string;
}

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function isValidDomain(value: string): boolean {
  const d = normalizeDomain(value);
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d);
}

export function DomainCaptureForm({
  onSubmit,
  defaultDomain = "",
}: DomainCaptureFormProps) {
  const [domain, setDomain] = useState(defaultDomain);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleaned = normalizeDomain(domain);
    if (!isValidDomain(cleaned)) {
      setError("Looks like that's not a valid domain. Try something like vertexroofing.com");
      return;
    }

    setDomain(cleaned);
    setSubmitted(true);
    onSubmit?.(cleaned);
  };

  return (
    <div id="domain-capture" style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "0.5rem",
                boxShadow: "0 12px 40px rgba(229,62,62,0.18)",
              }}
            >
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="yourbusiness.com"
                aria-label="Your domain"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  padding: "0.95rem 1rem",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "1rem",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#111111",
                }}
              />
              <button
                type="submit"
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "0 1.75rem",
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
              >
                Show me
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {error && (
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.85rem",
                  color: "#FFB4B4",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              We&apos;ll analyze your online presence against your top local
              competitors and send you a full breakdown within the hour. No
              calls, no BS - just your numbers.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: "2rem 1.5rem",
              background: "rgba(229,62,62,0.08)",
              border: "1px solid rgba(229,62,62,0.25)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                color: "#FFFFFF",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                lineHeight: 1.1,
              }}
            >
              Your analysis is being generated.
            </div>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.7)",
                margin: "0 0 1.5rem",
                lineHeight: 1.6,
              }}
            >
              Check the inbox tied to <strong style={{ color: "#FFFFFF" }}>{domain}</strong>{" "}
              within 60 minutes. We&apos;ll show you exactly what your top 3
              competitors have that you don&apos;t.
            </p>

            <button
              type="button"
              onClick={() => setCalendlyOpen(true)}
              data-funnel="demo-book"
              data-funnel-source="domain-capture-confirmation"
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "0.85rem 1.75rem",
                background: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Walk through it live
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
          </motion.div>
        )}
      </AnimatePresence>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </div>
  );
}
