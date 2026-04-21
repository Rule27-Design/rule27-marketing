"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CalendlyModal } from "@/app/components/CalendlyModal";
import {
  PRICING_TIERS,
  getPagesForRevenue,
  getTierForRevenue,
  type PricingTier,
} from "./data/pricing";

const MIN_REVENUE = 5000;
const MAX_REVENUE = 120000;
const DEFAULT_REVENUE = 18000;

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${(n / 1_000).toFixed(0)}K`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function formatPages(n: number): string {
  if (n >= 10_000) return `${(n / 1_000).toFixed(0)}K+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/** End-of-quarter date anchor for honest scarcity copy. */
function endOfQuarterLabel(now = new Date()): string {
  const month = now.getMonth();
  const year = now.getFullYear();
  const endMonth = month - (month % 3) + 2;
  const end = new Date(year, endMonth + 1, 0);
  return end.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function RevenueConfigurator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [revenue, setRevenue] = useState(DEFAULT_REVENUE);
  const [moved, setMoved] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [quarterEnd, setQuarterEnd] = useState<string | null>(null);

  useEffect(() => {
    setQuarterEnd(endOfQuarterLabel());
  }, []);

  const activeTier = useMemo(() => getTierForRevenue(revenue), [revenue]);
  const pagesNeeded = useMemo(() => getPagesForRevenue(revenue), [revenue]);

  const handleSlide = (next: number) => {
    setRevenue(next);
    if (!moved) setMoved(true);
  };

  return (
    <section
      ref={ref}
      id="revenue-configurator"
      style={{
        padding: "clamp(4rem, 8vw, 6rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
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
          The number you want
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.75rem",
            lineHeight: 1.05,
          }}
        >
          How much revenue do you want organic to deliver?
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1rem",
            color: "rgba(0,0,0,0.6)",
            margin: "0 auto",
            maxWidth: 640,
            lineHeight: 1.65,
          }}
        >
          Pick a number. We&apos;ll show you the page architecture that
          supports it. No tiers, no pricing, no fine print until you decide
          you want the plan.
        </p>
      </div>

      {/* Act 1 — the slider. No prices, no cards, no "recommended tier." */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1a0606 50%, #0A0A0A 100%)",
          border: "1px solid rgba(229,62,62,0.3)",
          borderLeft: "3px solid #E53E3E",
          padding: "clamp(1.75rem, 3.5vw, 2.75rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "60%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.2), transparent 65%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "0.4rem",
              }}
            >
              Monthly revenue target
            </div>
            <motion.div
              key={revenue}
              initial={{ scale: 0.96, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "clamp(2.75rem, 8vw, 4.5rem)",
                color: "#E53E3E",
                lineHeight: 1,
                letterSpacing: "0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatMoney(revenue)}
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.5)",
                  marginLeft: "0.6rem",
                  letterSpacing: "0.04em",
                }}
              >
                / month
              </span>
            </motion.div>
          </div>

          <div
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.55)",
              maxWidth: 280,
              lineHeight: 1.55,
              textAlign: "right",
            }}
          >
            At this target, the math lands near{" "}
            <strong
              style={{ color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}
            >
              {formatPages(pagesNeeded)} indexed pages
            </strong>{" "}
            backed by validated queries.
          </div>
        </div>

        <input
          type="range"
          min={MIN_REVENUE}
          max={MAX_REVENUE}
          step={500}
          value={revenue}
          onChange={(e) => handleSlide(parseInt(e.target.value, 10))}
          aria-label="Monthly revenue target"
          style={{ width: "100%", position: "relative" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span>{formatMoney(MIN_REVENUE)}</span>
          <span>
            {formatMoney(MAX_REVENUE)}
            <span style={{ color: "rgba(255,255,255,0.5)", marginLeft: 6 }}>
              +
            </span>
          </span>
        </div>

        {/* Act 2 — the Hold. Fades in only once the user has engaged with the slider. */}
        <AnimatePresence>
          {moved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginTop: "2.25rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                position: "relative",
              }}
            >
              <LockButton onClick={() => setRevealOpen(true)} />
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.04em",
                }}
              >
                See what it takes to hit this number.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.8rem",
          color: "rgba(0,0,0,0.4)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Hosting on Rule27 infrastructure: $50/mo (covered for any active
        retainer). Custom projects scope in consultation.
      </p>

      {/* Act 3 — the Reveal. Modal only — doesn't live inline on the page. */}
      <RevealModal
        open={revealOpen}
        onClose={() => setRevealOpen(false)}
        revenue={revenue}
        pagesNeeded={pagesNeeded}
        tier={activeTier}
        quarterEnd={quarterEnd}
        onSchedule={() => {
          setRevealOpen(false);
          setCalendlyOpen(true);
        }}
        onEmailCaptured={(email) => setEmailSent(email)}
        emailSent={emailSent}
        inView={inView}
      />

      <CalendlyModal
        isOpen={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
      />

      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #E53E3E ${((revenue - MIN_REVENUE) / (MAX_REVENUE - MIN_REVENUE)) * 100}%, rgba(255,255,255,0.15) ${((revenue - MIN_REVENUE) / (MAX_REVENUE - MIN_REVENUE)) * 100}%);
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 3px solid #E53E3E;
          box-shadow: 0 0 20px rgba(229,62,62,0.6), 0 4px 12px rgba(0,0,0,0.3);
          cursor: grab;
          margin-top: -9px;
        }
        input[type="range"]::-webkit-slider-thumb:active { cursor: grabbing; }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 3px solid #E53E3E;
          box-shadow: 0 0 20px rgba(229,62,62,0.6), 0 4px 12px rgba(0,0,0,0.3);
          cursor: grab;
        }
        @keyframes lock-halo {
          0% { transform: scale(1); opacity: 0.65; }
          100% { transform: scale(1.35); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function LockButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        fontFamily: "'Steelfish', 'Impact', sans-serif",
        fontSize: "1.05rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "1rem 2.25rem",
        background:
          "linear-gradient(135deg, #E53E3E 0%, #C42828 50%, #E53E3E 100%)",
        color: "#FFFFFF",
        border: "1px solid rgba(229,62,62,0.8)",
        cursor: "pointer",
        boxShadow:
          "0 8px 28px rgba(229,62,62,0.5), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 24px rgba(255,255,255,0.08)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.65rem",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -6,
          borderRadius: 2,
          border: "2px solid rgba(229,62,62,0.6)",
          animation: "lock-halo 1.8s ease-out infinite",
          pointerEvents: "none",
        }}
      />
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Lock this in
    </button>
  );
}

interface RevealModalProps {
  open: boolean;
  onClose: () => void;
  revenue: number;
  pagesNeeded: number;
  tier: PricingTier;
  quarterEnd: string | null;
  onSchedule: () => void;
  onEmailCaptured: (email: string) => void;
  emailSent: string | null;
  inView: boolean;
}

function RevealModal({
  open,
  onClose,
  revenue,
  pagesNeeded,
  tier,
  quarterEnd,
  onSchedule,
  onEmailCaptured,
  emailSent,
}: RevealModalProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("That doesn't look like a valid email.");
      return;
    }
    onEmailCaptured(trimmed);
  };

  const deploymentWindow =
    tier.pages >= 10000
      ? "8 to 12 weeks"
      : tier.pages >= 5000
        ? "6 to 8 weeks"
        : tier.pages >= 2500
          ? "5 to 6 weeks"
          : "4 weeks";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Your plan"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            overflowY: "auto",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#FAF9F6",
              border: "1px solid rgba(0,0,0,0.1)",
              borderLeft: "3px solid #E53E3E",
              maxWidth: 720,
              width: "100%",
              maxHeight: "calc(100vh - 3rem)",
              overflow: "hidden auto",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(229,62,62,0.1)",
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0.55)",
                cursor: "pointer",
                fontSize: "12px",
                zIndex: 2,
              }}
            >
              ✕
            </button>

            <div
              style={{
                padding: "2rem clamp(1.5rem, 3vw, 2.25rem) 0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  borderBottom: "1px solid rgba(229,62,62,0.3)",
                  paddingBottom: "4px",
                  marginBottom: "0.85rem",
                }}
              >
                Locked ·{" "}
                <span style={{ color: "rgba(0,0,0,0.55)" }}>
                  {formatMoney(revenue)}/mo target
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#111",
                  margin: "0 0 0.5rem",
                  lineHeight: 1.1,
                }}
              >
                To hit {formatMoney(revenue)}/mo, here is what we build for you.
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.95rem",
                  color: "rgba(0,0,0,0.6)",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                The{" "}
                <strong style={{ color: "#111" }}>{tier.name}</strong>{" "}
                deployment: {formatPages(tier.pages)} indexed pages, built and
                shipped over {deploymentWindow}. Architecture matched to
                validated buyer-intent queries in your category.
              </p>
            </div>

            <div
              style={{
                margin: "1.5rem clamp(1.5rem, 3vw, 2.25rem)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <StatTile
                label="Named tier"
                value={tier.name}
                accent
              />
              <StatTile
                label="Pages"
                value={formatPages(tier.pages)}
              />
              <StatTile
                label="Deployment"
                value={deploymentWindow}
              />
              <StatTile
                label="Target pages at your goal"
                value={formatPages(pagesNeeded)}
              />
            </div>

            <div
              style={{
                margin: "0 clamp(1.5rem, 3vw, 2.25rem) 1.5rem",
                padding: "1.1rem 1.25rem",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.45)",
                  marginBottom: "0.65rem",
                }}
              >
                What&apos;s included
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                {tier.inclusions.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.88rem",
                      color: "rgba(0,0,0,0.7)",
                      lineHeight: 1.55,
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        color: "#E53E3E",
                        fontFamily: "'Steelfish', 'Impact', sans-serif",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                margin: "0 clamp(1.5rem, 3vw, 2.25rem) 1.5rem",
                padding: "1rem 1.25rem",
                background:
                  "linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.02))",
                border: "1px solid rgba(229,62,62,0.25)",
                borderLeft: "2px solid #E53E3E",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#E53E3E",
                  marginTop: 8,
                  flexShrink: 0,
                  boxShadow: "0 0 8px rgba(229,62,62,0.7)",
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    marginBottom: "0.3rem",
                  }}
                >
                  Current pricing holds through
                </div>
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(0,0,0,0.7)",
                    lineHeight: 1.55,
                  }}
                >
                  Scopes opened before{" "}
                  <strong style={{ color: "#111" }}>
                    {quarterEnd ?? "the end of this quarter"}
                  </strong>{" "}
                  lock in today&apos;s rates. We adjust pricing quarterly as
                  our deployment capacity fills up, not through fake countdown
                  timers.
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "0 clamp(1.5rem, 3vw, 2.25rem) 2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              <button
                onClick={onSchedule}
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "1rem 1.5rem",
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 6px 20px rgba(229,62,62,0.4)",
                }}
              >
                Schedule now
                <svg
                  width="14"
                  height="14"
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

              {emailSent ? (
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderLeft: "2px solid #E53E3E",
                    padding: "0.85rem 1rem",
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(0,0,0,0.7)",
                    lineHeight: 1.55,
                  }}
                >
                  The plan is on its way to{" "}
                  <strong style={{ color: "#111" }}>{emailSent}</strong>.
                  We&apos;ll send the scoped outline plus a booking link in
                  case you want to walk it through live.
                </div>
              ) : (
                <form
                  onSubmit={handleEmailSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.1)",
                      padding: "0.3rem",
                    }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourbusiness.com"
                      aria-label="Email the plan to"
                      autoComplete="email"
                      style={{
                        flex: 1,
                        padding: "0.65rem 0.7rem",
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "0.9rem",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: "#111",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        fontFamily: "'Steelfish', 'Impact', sans-serif",
                        fontSize: "11px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "0 1rem",
                        background: "transparent",
                        color: "#111",
                        border: "1px solid rgba(229,62,62,0.4)",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Email me the plan
                    </button>
                  </div>
                  {emailError && (
                    <p
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "0.78rem",
                        color: "#C42828",
                        margin: 0,
                      }}
                    >
                      {emailError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        borderTop: accent ? "2px solid #E53E3E" : "1px solid rgba(0,0,0,0.08)",
        padding: "0.75rem 0.9rem",
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.45)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.35rem",
          color: accent ? "#E53E3E" : "#111",
          lineHeight: 1.05,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// Keep PRICING_TIERS import alive even though we no longer render tier cards
// inline — the reveal modal still references tier.inclusions.
void PRICING_TIERS;
