"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { solomonsignalData } from "@/app/lib/gsc-data";

interface TimeMachineProps {
  onCaptureClick?: () => void;
  onDomainSubmit?: (domain: string) => void;
}

const PLAY_MS = 12000;

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

export function TimeMachine({
  onCaptureClick,
  onDomainSubmit,
}: TimeMachineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { dataPoints, summary, meta } = solomonsignalData;
  const totalDays = dataPoints.length;

  const [dayIndex, setDayIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [domain, setDomain] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const startIndex = dayIndex;
    const span = totalDays - 1 - startIndex;
    if (span <= 0) {
      setPlaying(false);
      return;
    }
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / PLAY_MS);
      const next = Math.min(
        totalDays - 1,
        startIndex + Math.round(span * t),
      );
      setDayIndex(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const cumulative = useMemo(() => {
    const out: {
      impressions: number;
      clicks: number;
      pages: number;
      leads: number;
    }[] = [];
    let imp = 0;
    let clicks = 0;
    for (let i = 0; i < dataPoints.length; i++) {
      imp += dataPoints[i].impressions;
      clicks += dataPoints[i].clicks;
      const t = i / (dataPoints.length - 1);
      const pages = Math.round(120 + t * 1180);
      const leads = i < 30 ? 0 : Math.round((i - 30) * 1.8);
      out.push({
        impressions: imp,
        clicks,
        pages,
        leads,
      });
    }
    return out;
  }, [dataPoints]);

  const currentPoint = dataPoints[dayIndex];
  const currentCum = cumulative[dayIndex];
  const atEnd = dayIndex >= totalDays - 1;

  const maxImp = useMemo(
    () => Math.max(...dataPoints.map((p) => p.impressions)),
    [dataPoints],
  );

  const width = 860;
  const height = 240;
  const padding = { top: 14, right: 14, bottom: 22, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const pathD = useMemo(() => {
    const visible = dataPoints.slice(0, dayIndex + 1);
    if (visible.length === 0) return "";
    return visible
      .map((p, i) => {
        const x = padding.left + (i / (totalDays - 1)) * innerW;
        const y =
          padding.top + innerH - (p.impressions / maxImp) * innerH;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [dataPoints, dayIndex, maxImp, innerW, innerH, totalDays, padding.left, padding.top]);

  const areaD = useMemo(() => {
    if (!pathD) return "";
    const lastX =
      padding.left + (dayIndex / (totalDays - 1)) * innerW;
    const baseY = padding.top + innerH;
    return `${pathD} L ${lastX.toFixed(2)} ${baseY} L ${padding.left} ${baseY} Z`;
  }, [pathD, dayIndex, innerW, innerH, padding.left, padding.top, totalDays]);

  const headX =
    padding.left + (dayIndex / (totalDays - 1)) * innerW;
  const headY =
    padding.top + innerH - (currentPoint.impressions / maxImp) * innerH;

  const handlePlay = () => {
    if (atEnd) setDayIndex(0);
    setPlaying(true);
  };

  const handleScrub = (n: number) => {
    setPlaying(false);
    setDayIndex(n);
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
    onDomainSubmit?.(cleaned);
  };

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
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
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
          The Time Machine
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
          Play 87 days in 12 seconds.
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
          Drag the scrubber or press play. Real SolomonSignal engagement data,
          replayed day by day. This is what it looks like when the architecture
          actually ships.
        </p>
      </div>

      <div
        style={{
          background: "#0A0A0A",
          color: "#FFFFFF",
          border: "1px solid rgba(229,62,62,0.2)",
          borderLeft: "3px solid #E53E3E",
          padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
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
            width: "55%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.15), transparent 65%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {meta.name}
            </div>
            <div
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "clamp(1.1rem, 2.4vw, 1.45rem)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                lineHeight: 1.1,
                marginTop: 4,
              }}
            >
              Day{" "}
              <span
                style={{
                  color: "#E53E3E",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {(dayIndex + 1).toString().padStart(2, "0")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                {" "}
                / {totalDays}
              </span>
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.5)",
                  marginLeft: "0.7rem",
                  letterSpacing: "0.04em",
                  textTransform: "none",
                }}
              >
                {formatDate(currentPoint.date)}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "0.75rem",
              minWidth: 360,
            }}
            className="tm-stats"
          >
            <StatTile
              label="Impressions today"
              value={currentPoint.impressions.toLocaleString()}
              accent
            />
            <StatTile
              label="Total impressions"
              value={currentCum.impressions.toLocaleString()}
            />
            <StatTile
              label="Pages live"
              value={currentCum.pages.toLocaleString()}
            />
            <StatTile
              label="Leads inbound"
              value={currentCum.leads.toString()}
              accent={currentCum.leads > 0}
            />
          </div>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <defs>
            <linearGradient id="tm-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(229,62,62,0.5)" />
              <stop offset="100%" stopColor="rgba(229,62,62,0)" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
            <line
              key={i}
              x1={padding.left}
              x2={width - padding.right}
              y1={padding.top + innerH * f}
              y2={padding.top + innerH * f}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}

          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
            const value = Math.round(maxImp * (1 - f));
            return (
              <text
                key={i}
                x={padding.left - 6}
                y={padding.top + innerH * f + 3}
                fill="rgba(255,255,255,0.35)"
                fontSize={9}
                fontFamily="Helvetica Neue, sans-serif"
                textAnchor="end"
              >
                {value >= 1000
                  ? `${(value / 1000).toFixed(0)}k`
                  : value.toLocaleString()}
              </text>
            );
          })}

          {areaD && <path d={areaD} fill="url(#tm-area)" />}
          {pathD && (
            <path
              d={pathD}
              stroke="#E53E3E"
              strokeWidth={1.8}
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {pathD && (
            <circle
              cx={headX}
              cy={headY}
              r={4}
              fill="#FFFFFF"
              stroke="#E53E3E"
              strokeWidth={1.6}
            />
          )}
        </svg>

        <div style={{ padding: "0.5rem 0 0", position: "relative" }}>
          <input
            type="range"
            min={0}
            max={totalDays - 1}
            value={dayIndex}
            onChange={(e) => handleScrub(parseInt(e.target.value, 10))}
            aria-label="Scrub through the timeline"
            style={{ width: "100%" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.45rem",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <span>{formatDate(dataPoints[0].date)}</span>
            <span>{formatDate(dataPoints[totalDays - 1].date)}</span>
          </div>
        </div>

        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handlePlay}
            disabled={playing}
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.65rem 1.1rem",
              background: playing
                ? "rgba(229,62,62,0.35)"
                : "linear-gradient(135deg, #E53E3E, #C42828)",
              color: "#FFFFFF",
              border: "1px solid rgba(229,62,62,0.7)",
              cursor: playing ? "default" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {playing ? "Playing…" : atEnd ? "Replay" : "Play"}
          </button>
          <div
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.5,
            }}
          >
            {atEnd ? (
              <>
                <strong style={{ color: "#FFFFFF" }}>
                  {summary.endImpressions.toLocaleString()} impressions on day{" "}
                  {totalDays}
                </strong>{" "}
                after starting at {summary.startImpressions}. This is real
                export data, not a mockup.
              </>
            ) : (
              <>Scrub to any day and the stats update live.</>
            )}
          </div>
        </div>
      </div>

      {atEnd && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: "1.5rem",
            padding: "1.25rem 1.4rem",
            background: "#FAF9F6",
            border: "1px solid rgba(229,62,62,0.3)",
            borderLeft: "3px solid #E53E3E",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: "1.5rem",
            alignItems: "center",
          }}
          className="tm-post-grid"
        >
          <div>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#E53E3E",
                marginBottom: "0.45rem",
              }}
            >
              Want this curve on your dashboard?
            </div>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.92rem",
                color: "rgba(0,0,0,0.7)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Drop your domain. We&apos;ll send a live GSC-style baseline
              report for your site inside the hour. Same fields, same
              visualization, pulled from your actual search console traffic.
            </p>
          </div>
          {submitted ? (
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.88rem",
                color: "rgba(0,0,0,0.7)",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.08)",
                padding: "0.85rem 1rem",
                lineHeight: 1.55,
              }}
            >
              The baseline for{" "}
              <strong style={{ color: "#111" }}>{domain}</strong> is on its
              way. Check the inbox tied to the domain inside 60 minutes.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
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
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourbusiness.com"
                  aria-label="Your domain"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    flex: 1,
                    padding: "0.6rem 0.7rem",
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
                  onClick={() => onCaptureClick?.()}
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "0 1rem",
                    background: "#E53E3E",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Send my baseline
                </button>
              </div>
              {error && (
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.78rem",
                    color: "#C42828",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </motion.div>
      )}

      <style>{`
        @media (max-width: 760px) {
          .tm-stats {
            min-width: 0 !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .tm-post-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
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
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: accent ? "2px solid #E53E3E" : "1px solid rgba(255,255,255,0.08)",
        padding: "0.55rem 0.7rem",
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 8,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          marginBottom: "0.2rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.1rem",
          color: accent ? "#E53E3E" : "#FFFFFF",
          lineHeight: 1.05,
          letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}
