"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import type { IndustryContent } from "./data/industries";

interface QueryGapProbeProps {
  industry: IndustryContent;
  userDomain?: string;
  onSubmitQuery?: (query: string) => void;
  onCaptureClick?: () => void;
  totalQueriesForIndustry?: number;
}

function faviconHost(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

function pickRandomInRange(seedStr: string, lo: number, hi: number): number {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = ((h << 5) - h + seedStr.charCodeAt(i)) | 0;
  const rng = Math.abs(h) / 2147483647;
  return Math.floor(lo + rng * (hi - lo + 1));
}

export function QueryGapProbe({
  industry,
  userDomain,
  onSubmitQuery,
  onCaptureClick,
  totalQueriesForIndustry = 480,
}: QueryGapProbeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return industry.exampleSearches.slice(0, 5);
    return industry.exampleSearches
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query, industry.exampleSearches]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim();
    if (!cleaned) return;
    setSubmitted(cleaned);
    setShowSuggestions(false);
    onSubmitQuery?.(cleaned);
  };

  const handlePick = (value: string) => {
    setQuery(value);
    setSubmitted(value);
    setShowSuggestions(false);
    onSubmitQuery?.(value);
  };

  const displayDomain = userDomain
    ? faviconHost(userDomain)
    : "yourbusiness.com";

  // Deterministic empty-slot placement based on the query so each submitted
  // query produces a stable result layout.
  const emptySlotRank = submitted
    ? pickRandomInRange(submitted, 4, 9)
    : 7;

  const competitors = industry.topCompetitors;

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ marginBottom: "2.25rem", textAlign: "center" }}>
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
          Query gap probe
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.6rem",
            lineHeight: 1.1,
          }}
        >
          Type a search your best customer would make.
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.55)",
            margin: "0 auto",
            maxWidth: 620,
            lineHeight: 1.6,
          }}
        >
          We&apos;ll run it against Google the way they would. See who shows
          up, and more importantly, where your domain falls.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 680,
          margin: "0 auto 2rem",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 999,
            padding: "0.55rem 1.1rem",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06), 0 8px 28px rgba(0,0,0,0.04)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() =>
              window.setTimeout(() => setShowSuggestions(false), 120)
            }
            placeholder={industry.exampleSearches[0] ?? "what would they search?"}
            aria-label="Try a query"
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              padding: "0.55rem 0",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1rem",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#111",
            }}
          />
          <button
            type="submit"
            disabled={!query.trim()}
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.55rem 1.1rem",
              background: query.trim() ? "#E53E3E" : "rgba(0,0,0,0.12)",
              color: "#FFFFFF",
              border: "none",
              cursor: query.trim() ? "pointer" : "default",
              borderRadius: 999,
              transition: "background 0.2s",
            }}
          >
            Search
          </button>
        </div>

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 8,
                boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                listStyle: "none",
                margin: 0,
                padding: "0.4rem 0",
                zIndex: 5,
              }}
            >
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handlePick(s)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      width: "100%",
                      padding: "0.55rem 1.1rem",
                      background: "transparent",
                      border: "none",
                      textAlign: "left",
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.9rem",
                      color: "#111",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(0,0,0,0.35)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    {s}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence mode="wait">
        {submitted && (
          <motion.div
            key={submitted}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: 760,
              margin: "0 auto",
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.04), 0 18px 40px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                background: "#FAFAFA",
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 11,
                color: "rgba(0,0,0,0.5)",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <span>
                About {pickRandomInRange(submitted, 48000, 420000).toLocaleString()}{" "}
                results for{" "}
                <strong style={{ color: "#111" }}>{submitted}</strong>
              </span>
              <span
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                }}
              >
                Simulated · Rule27 probe
              </span>
            </div>

            <ol
              style={{
                margin: 0,
                padding: "0.5rem 0",
                listStyle: "none",
              }}
            >
              {Array.from({ length: 10 }).map((_, idx) => {
                const rank = idx + 1;
                if (rank === emptySlotRank) {
                  return (
                    <EmptySlot
                      key={rank}
                      rank={rank}
                      domain={displayDomain}
                      query={submitted}
                    />
                  );
                }
                const competitor = competitors[idx % competitors.length];
                return (
                  <CompetitorSlot
                    key={rank}
                    rank={rank}
                    name={competitor.name}
                    domain={competitor.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .replace(/[^a-z0-9]/g, "")}
                    query={submitted}
                    monthlyRevenueEst={competitor.monthlyRevenueEst}
                  />
                );
              })}
            </ol>

            <div
              style={{
                margin: "0.5rem 1rem 1.25rem",
                padding: "1rem 1.1rem",
                background:
                  "linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.02))",
                border: "1px solid rgba(229,62,62,0.3)",
                borderLeft: "3px solid #E53E3E",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.85rem",
              }}
            >
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
                  There are more queries like this
                </div>
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.9rem",
                    color: "rgba(0,0,0,0.7)",
                    lineHeight: 1.5,
                  }}
                >
                  Rule27 has roughly{" "}
                  <strong style={{ color: "#111" }}>
                    {totalQueriesForIndustry}
                  </strong>{" "}
                  buyer-intent queries mapped for {industry.shortName}. See the
                  full list alongside who ranks for each one.
                </div>
              </div>
              <button
                onClick={() => onCaptureClick?.()}
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "0.75rem 1.2rem",
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  boxShadow: "0 6px 18px rgba(229,62,62,0.3)",
                }}
              >
                Get the full list
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CompetitorSlot({
  rank,
  name,
  domain,
  query,
  monthlyRevenueEst,
}: {
  rank: number;
  name: string;
  domain: string;
  query: string;
  monthlyRevenueEst: number;
}) {
  const host = `${domain}.com`;
  return (
    <li
      style={{
        padding: "0.85rem 1rem",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 22,
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 10,
          color: "rgba(0,0,0,0.3)",
          marginTop: 6,
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
        }}
      >
        {rank}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "0.15rem",
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #E53E3E 0%, #8B2222 100%)",
              color: "#FFFFFF",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: 9,
              letterSpacing: 0,
            }}
          >
            {name.slice(0, 1)}
          </span>
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 11,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            {name}
          </span>
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 11,
              color: "rgba(0,0,0,0.35)",
            }}
          >
            · {host}
          </span>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1.02rem",
            color: "#1a0dab",
            textDecoration: "none",
            display: "inline-block",
            lineHeight: 1.25,
          }}
        >
          {query.charAt(0).toUpperCase() + query.slice(1)} | {name}
        </a>
        <p
          style={{
            margin: "0.25rem 0 0",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.82rem",
            color: "rgba(0,0,0,0.58)",
            lineHeight: 1.55,
          }}
        >
          {name} ranks {rank === 1 ? "first" : `in position ${rank}`} for this
          query.{" "}
          {monthlyRevenueEst > 0
            ? `Estimated capture: ~$${(monthlyRevenueEst / 1000).toFixed(0)}K / month across their organic footprint.`
            : "Their page catalog is the largest in the category."}
        </p>
      </div>
    </li>
  );
}

function EmptySlot({
  rank,
  domain,
  query,
}: {
  rank: number;
  domain: string;
  query: string;
}) {
  return (
    <li
      style={{
        padding: "0.95rem 1rem",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        background:
          "linear-gradient(135deg, rgba(229,62,62,0.05), rgba(229,62,62,0.02))",
        border: "1px dashed rgba(229,62,62,0.45)",
        margin: "0.4rem 0.6rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 22,
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 10,
          color: "rgba(229,62,62,0.8)",
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
        }}
      >
        {rank}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#E53E3E",
            marginBottom: "0.3rem",
          }}
        >
          Your domain · {domain}
        </div>
        <div
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "1.05rem",
            color: "#111",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight: 1.15,
          }}
        >
          Not indexed for &ldquo;{query}&rdquo;
        </div>
        <div
          style={{
            marginTop: "0.2rem",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.82rem",
            color: "rgba(0,0,0,0.55)",
            lineHeight: 1.5,
          }}
        >
          No page exists on your site that answers this search. The slot is
          empty.
        </div>
      </div>
    </li>
  );
}
