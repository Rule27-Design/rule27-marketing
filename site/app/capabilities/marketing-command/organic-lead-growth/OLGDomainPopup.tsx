"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OLGDomainPopupProps {
  triggerDepth?: number;
  onSubmit: (domain: string) => void;
  defaultDomain?: string;
  storageKey?: string;
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

export function OLGDomainPopup({
  triggerDepth = 0.45,
  onSubmit,
  defaultDomain = "",
  storageKey = "olg-domain-popup-dismissed",
}: OLGDomainPopupProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [domain, setDomain] = useState(defaultDomain);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey)) {
      setDismissed(true);
      return;
    }

    let armed = false;
    const arm = () => {
      armed = true;
    };
    const timeout = window.setTimeout(arm, 4000);

    const onScroll = () => {
      if (dismissed) return;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const depth = scrollTop / docHeight;
      if (depth >= triggerDepth) setVisible(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (!armed || dismissed) return;
      if (e.clientY <= 0) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseLeave);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseLeave);
    };
  }, [triggerDepth, dismissed, storageKey]);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "1");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = normalizeDomain(domain);
    if (!isValidDomain(cleaned)) {
      setError("That doesn't look like a valid domain.");
      return;
    }
    setDomain(cleaned);
    setSubmitted(true);
    onSubmit(cleaned);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, "1");
    }
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: "5rem",
            right: "1.5rem",
            zIndex: 99990,
            background: "#0A0A0A",
            border: "1px solid rgba(229,62,62,0.35)",
            borderTop: "3px solid #E53E3E",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(229,62,62,0.1)",
            maxWidth: 380,
            width: "calc(100vw - 3rem)",
            padding: "1.5rem 1.4rem 1.35rem",
            color: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "60%",
              height: "100%",
              background:
                "radial-gradient(circle, rgba(229,62,62,0.18), transparent 65%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <button
            onClick={dismiss}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.55)",
              cursor: "pointer",
              fontSize: "11px",
              zIndex: 1,
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#E53E3E",
                marginBottom: "0.5rem",
              }}
            >
              Quick check before you go
            </div>

            {!submitted ? (
              <>
                <h4
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "1.35rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    margin: "0 0 0.5rem",
                    lineHeight: 1.15,
                    paddingRight: "1.5rem",
                  }}
                >
                  See your domain vs your top 3 competitors
                </h4>
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.6)",
                    margin: "0 0 1rem",
                    lineHeight: 1.55,
                  }}
                >
                  Indexed pages, ranking queries, and the revenue gap. Delivered
                  to your inbox in under an hour.
                </p>

                <form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      padding: "0.3rem",
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
                      autoFocus
                      style={{
                        flex: 1,
                        padding: "0.65rem 0.7rem",
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "0.9rem",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "#FFFFFF",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        fontFamily: "'Steelfish', 'Impact', sans-serif",
                        fontSize: "11px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "0 0.9rem",
                        background: "#E53E3E",
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Show me
                    </button>
                  </div>
                  {error && (
                    <p
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "0.78rem",
                        color: "#FFB4B4",
                        margin: "0.55rem 0 0",
                      }}
                    >
                      {error}
                    </p>
                  )}
                </form>
              </>
            ) : (
              <div>
                <h4
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "1.3rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    margin: "0 0 0.5rem",
                    lineHeight: 1.15,
                  }}
                >
                  Your analysis is on its way.
                </h4>
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.65)",
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  Check the inbox tied to{" "}
                  <strong style={{ color: "#FFFFFF" }}>{domain}</strong> inside
                  60 minutes.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
