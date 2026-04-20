"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistInputProps {
  onSubmit?: (email: string) => void;
  placeholder?: string;
  ctaLabel?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function WaitlistInput({
  onSubmit,
  placeholder = "you@yourbusiness.com",
  ctaLabel = "Get notified",
}: WaitlistInputProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = email.trim();
    if (!isValidEmail(cleaned)) {
      setError("That doesn't look like a valid email.");
      return;
    }
    setSubmitted(true);
    onSubmit?.(cleaned);
  };

  return (
    <div style={{ maxWidth: 460 }}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.1)",
                padding: "0.35rem",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                aria-label="Email address"
                style={{
                  flex: 1,
                  padding: "0.65rem 0.75rem",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.9rem",
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
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0 1rem",
                  background: "#111111",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {ctaLabel}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
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
                  fontSize: "0.8rem",
                  color: "#E53E3E",
                  margin: "0.5rem 0 0",
                }}
              >
                {error}
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(229,62,62,0.06)",
              borderLeft: "2px solid #E53E3E",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.9rem",
              color: "rgba(0,0,0,0.7)",
            }}
          >
            You&apos;re on the list. We&apos;ll let you know the second the next
            session goes live.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
