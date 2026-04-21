"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { IndustryContent } from "./data/industries";

interface DomainDuelProps {
  industry: IndustryContent;
  userDomain?: string;
  onRunNumbers?: () => void;
}

type Mode = "baseline" | "withRule27";

const WEEKS = 12;
const STEP_MS = 160;

function faviconHost(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

export function DomainDuel({
  industry,
  userDomain,
  onRunNumbers,
}: DomainDuelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [week, setWeek] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<Mode>("baseline");
  const [finished, setFinished] = useState(false);

  const topCompetitor = industry.topCompetitors[0];
  const competitorName = topCompetitor?.name ?? "Top competitor";
  const competitorPerWeek = Math.max(
    150,
    Math.round((topCompetitor?.pages ?? 2400) / 18),
  );
  const competitorStart = Math.round((topCompetitor?.pages ?? 2400) * 0.65);

  const userStartPages = industry.avgPagesLow;
  const userBaselinePerWeek = 0;
  const userRule27StartWeek = 3;
  const userRule27PerWeek = 250;

  const userPages = (() => {
    if (mode === "baseline") {
      return Math.round(userStartPages + week * userBaselinePerWeek);
    }
    if (week < userRule27StartWeek) {
      return Math.round(userStartPages);
    }
    return Math.round(
      userStartPages + (week - userRule27StartWeek) * userRule27PerWeek,
    );
  })();

  const competitorPages = Math.round(competitorStart + week * competitorPerWeek);

  useEffect(() => {
    if (!playing) return;
    if (week >= WEEKS) {
      setPlaying(false);
      setFinished(true);
      return;
    }
    const handle = window.setTimeout(() => {
      setWeek((w) => Math.min(WEEKS, w + 1));
    }, STEP_MS);
    return () => window.clearTimeout(handle);
  }, [playing, week]);

  const handlePlay = (nextMode: Mode) => {
    setMode(nextMode);
    setWeek(0);
    setFinished(false);
    setPlaying(true);
  };

  const gap = Math.max(0, competitorPages - userPages);
  const quarterGap = Math.max(0, (competitorStart + WEEKS * competitorPerWeek) - userStartPages);

  const maxPagesOnStage =
    competitorStart + WEEKS * competitorPerWeek;
  const userBarPct = Math.min(100, (userPages / maxPagesOnStage) * 100);
  const competitorBarPct = Math.min(
    100,
    (competitorPages / maxPagesOnStage) * 100,
  );

  const displayUserDomain = userDomain
    ? faviconHost(userDomain)
    : "yourbusiness.com";

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
          Domain Duel
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
          Twelve weeks. Same starting line. Two futures.
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
          Press play. Watch the gap open week by week. Then run it again with
          Rule27 in your corner and see what closes.
        </p>
      </div>

      <div
        style={{
          background: "#0A0A0A",
          color: "#FFFFFF",
          border: "1px solid rgba(229,62,62,0.2)",
          borderLeft: "3px solid #E53E3E",
          padding: "clamp(1.5rem, 3vw, 2.25rem)",
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
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Week{" "}
            <span
              style={{
                color: "#FFFFFF",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {week.toString().padStart(2, "0")}
            </span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}> / {WEEKS}</span>
          </div>
          <div
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color:
                mode === "withRule27" ? "#E53E3E" : "rgba(255,255,255,0.4)",
            }}
          >
            {mode === "withRule27"
              ? "Scenario: Rule27 engagement"
              : "Scenario: status quo"}
          </div>
        </div>

        <Bar
          label={`${competitorName} · ${faviconHost(
            (topCompetitor?.name ?? "competitor")
              .toLowerCase()
              .replace(/\s+/g, "") + ".com",
          )}`}
          pages={competitorPages}
          percent={competitorBarPct}
          accent="competitor"
          perWeek={competitorPerWeek}
        />
        <div style={{ height: 12 }} />
        <Bar
          label={`Your domain · ${displayUserDomain}`}
          pages={userPages}
          percent={userBarPct}
          accent="user"
          perWeek={
            mode === "withRule27"
              ? week < userRule27StartWeek
                ? 0
                : userRule27PerWeek
              : userBaselinePerWeek
          }
        />

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <WeekTicker current={week} />
        </div>

        <div
          style={{
            marginTop: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.55,
            }}
          >
            {finished && mode === "baseline" && (
              <>
                <strong style={{ color: "#FFFFFF" }}>
                  The gap grew by{" "}
                  {quarterGap.toLocaleString()} pages this quarter.
                </strong>{" "}
                Your side did not move. Run it again with the fix overlaid.
              </>
            )}
            {finished && mode === "withRule27" && (
              <>
                <strong style={{ color: "#FFFFFF" }}>
                  You started closing the gap in week{" "}
                  {userRule27StartWeek + 1}.
                </strong>{" "}
                At {userRule27PerWeek} pages/week, you overtake the category
                leader inside the first year of steady deployment.
              </>
            )}
            {!finished && playing && (
              <>The tape is rolling. Current gap: {gap.toLocaleString()} pages.</>
            )}
            {!finished && !playing && week === 0 && (
              <>Press play to start the duel.</>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handlePlay("baseline")}
              disabled={playing}
              style={buttonStyle({
                variant:
                  finished && mode === "baseline" ? "secondary" : "primary",
                disabled: playing,
              })}
            >
              {week === 0 ? "Play status quo" : "Replay status quo"}
            </button>
            <button
              onClick={() => handlePlay("withRule27")}
              disabled={playing || (!finished && week === 0)}
              style={buttonStyle({
                variant: "primary",
                disabled: playing || (!finished && week === 0),
                highlighted: finished && mode === "baseline",
              })}
            >
              Play with Rule27
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes duel-pulse {
          0% { box-shadow: 0 0 0 2px rgba(229,62,62,0.4), 0 6px 18px rgba(229,62,62,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(229,62,62,0.15), 0 10px 22px rgba(229,62,62,0.45); }
          100% { box-shadow: 0 0 0 2px rgba(229,62,62,0.4), 0 6px 18px rgba(229,62,62,0.35); }
        }
      `}</style>

      {finished && mode === "withRule27" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: "1.5rem",
            padding: "1.15rem 1.25rem",
            background: "#FAF9F6",
            border: "1px solid rgba(229,62,62,0.3)",
            borderLeft: "3px solid #E53E3E",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.9rem",
              color: "rgba(0,0,0,0.7)",
              lineHeight: 1.55,
              maxWidth: 620,
            }}
          >
            That&apos;s the simulation. Your actual numbers live in GSC,
            Ahrefs, and competitor reports. We can pull the real version and
            show you the true gap.
          </div>
          <button
            onClick={onRunNumbers}
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
            Run my real numbers
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
        </motion.div>
      )}
    </section>
  );
}

function Bar({
  label,
  pages,
  percent,
  accent,
  perWeek,
}: {
  label: string;
  pages: number;
  percent: number;
  accent: "user" | "competitor";
  perWeek: number;
}) {
  const barColor =
    accent === "user"
      ? "linear-gradient(90deg, rgba(229,62,62,0.85), #E53E3E)"
      : "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.55))";
  const labelColor =
    accent === "user" ? "#E53E3E" : "rgba(255,255,255,0.7)";

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "0.6rem",
          marginBottom: "0.45rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: labelColor,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "1.3rem",
            color: "#FFFFFF",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.4rem",
          }}
        >
          {pages.toLocaleString()}
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            pages · {perWeek > 0 ? `+${perWeek}/wk` : "no growth"}
          </span>
        </span>
      </div>
      <div
        style={{
          position: "relative",
          height: 18,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ width: `${percent}%` }}
          transition={{ duration: STEP_MS / 1000, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            background: barColor,
            boxShadow:
              accent === "user"
                ? "0 0 16px rgba(229,62,62,0.45)"
                : "0 0 10px rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </div>
  );
}

function WeekTicker({ current }: { current: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
        gap: 3,
      }}
    >
      {Array.from({ length: WEEKS }).map((_, i) => {
        const active = i < current;
        return (
          <div
            key={i}
            style={{
              height: 4,
              background: active
                ? "linear-gradient(90deg, rgba(229,62,62,0.8), #E53E3E)"
                : "rgba(255,255,255,0.08)",
              transition: "background 0.2s",
            }}
          />
        );
      })}
    </div>
  );
}

function buttonStyle({
  variant,
  disabled,
  highlighted,
}: {
  variant: "primary" | "secondary";
  disabled?: boolean;
  highlighted?: boolean;
}): React.CSSProperties {
  if (variant === "secondary") {
    return {
      fontFamily: "'Steelfish', 'Impact', sans-serif",
      fontSize: "12px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      padding: "0.65rem 1rem",
      background: "transparent",
      color: disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)",
      border: "1px solid rgba(255,255,255,0.2)",
      cursor: disabled ? "default" : "pointer",
    };
  }
  return {
    fontFamily: "'Steelfish', 'Impact', sans-serif",
    fontSize: "12px",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "0.65rem 1.1rem",
    background: disabled
      ? "rgba(229,62,62,0.3)"
      : "linear-gradient(135deg, #E53E3E, #C42828)",
    color: "#FFFFFF",
    border: "1px solid rgba(229,62,62,0.7)",
    cursor: disabled ? "default" : "pointer",
    boxShadow: highlighted
      ? "0 0 0 2px rgba(229,62,62,0.35), 0 6px 18px rgba(229,62,62,0.35)"
      : "none",
    animation: highlighted && !disabled ? "duel-pulse 2s ease-out infinite" : undefined,
  };
}
