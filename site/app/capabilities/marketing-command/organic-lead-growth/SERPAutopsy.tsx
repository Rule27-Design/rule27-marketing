"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import type { IndustryContent } from "./data/industries";

interface SERPAutopsyProps {
  industry: IndustryContent;
  userDomain?: string;
  onCaptureClick?: () => void;
}

type PageType =
  | "service"
  | "location"
  | "industry"
  | "comparison"
  | "feature";
type View = "competitor" | "user";

interface PageTile {
  id: string;
  title: string;
  type: PageType;
  monthlyVisits: number;
}

const PAGE_TYPE_META: Record<
  PageType,
  { label: string; color: string; accent: string }
> = {
  service: {
    label: "Service pages",
    color: "rgba(229,62,62,0.9)",
    accent: "#E53E3E",
  },
  location: {
    label: "Location pages",
    color: "rgba(255,165,0,0.85)",
    accent: "#FF9800",
  },
  industry: {
    label: "Industry / vertical",
    color: "rgba(120,150,255,0.9)",
    accent: "#7A9BFF",
  },
  comparison: {
    label: "Comparison / vs",
    color: "rgba(90,200,160,0.9)",
    accent: "#3FBF8E",
  },
  feature: {
    label: "Feature / resource",
    color: "rgba(220,220,220,0.9)",
    accent: "#DDDDDD",
  },
};

const PAGE_TYPE_ORDER: PageType[] = [
  "service",
  "location",
  "industry",
  "comparison",
  "feature",
];

function faviconHost(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

/** Deterministic integer in [lo, hi] seeded by string. */
function seedInt(seed: string, lo: number, hi: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++)
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const f = Math.abs(h) / 2147483647;
  return Math.floor(lo + f * (hi - lo + 1));
}

function buildCompetitorCatalog(industry: IndustryContent): PageTile[] {
  const competitor = industry.topCompetitors[0];
  const total = Math.min(1200, competitor?.pages ?? 900);
  const mix: Record<PageType, number> = {
    service: Math.round(total * 0.35),
    location: Math.round(total * 0.22),
    industry: Math.round(total * 0.16),
    comparison: Math.round(total * 0.1),
    feature: Math.round(total * 0.17),
  };

  const tiles: PageTile[] = [];
  PAGE_TYPE_ORDER.forEach((type) => {
    const count = mix[type];
    for (let i = 0; i < count; i++) {
      const seed = `${industry.slug}-${type}-${i}`;
      tiles.push({
        id: seed,
        title: makeTitle(industry, type, i),
        type,
        monthlyVisits: seedInt(seed, 40, 2400),
      });
    }
  });
  return tiles;
}

function buildUserCatalog(industry: IndustryContent): PageTile[] {
  const total = Math.round(
    (industry.avgPagesLow + industry.avgPagesHigh) / 2,
  );
  const tiles: PageTile[] = [];
  for (let i = 0; i < total; i++) {
    const type =
      i === 0
        ? "service"
        : i === 1
          ? "service"
          : i === 2
            ? "industry"
            : i === 3
              ? "feature"
              : i === 4
                ? "service"
                : PAGE_TYPE_ORDER[i % PAGE_TYPE_ORDER.length];
    tiles.push({
      id: `user-${i}`,
      title:
        i === 0
          ? "Home"
          : i === 1
            ? "About"
            : i === 2
              ? "Services"
              : i === 3
                ? "Contact"
                : `Page ${i}`,
      type: type as PageType,
      monthlyVisits: seedInt(`user-${i}`, 2, 45),
    });
  }
  return tiles;
}

function makeTitle(
  industry: IndustryContent,
  type: PageType,
  index: number,
): string {
  const token = industry.shortName;
  if (type === "service") {
    const services = [
      "Emergency",
      "Residential",
      "Commercial",
      "Same-day",
      "Premium",
      "Licensed",
      "Certified",
    ];
    return `${services[index % services.length]} ${token} service`;
  }
  if (type === "location") {
    const cities = [
      "Phoenix",
      "Dallas",
      "Austin",
      "Denver",
      "Portland",
      "Miami",
      "Atlanta",
      "Chicago",
      "Seattle",
    ];
    return `${token} in ${cities[index % cities.length]}`;
  }
  if (type === "industry") {
    const verticals = [
      "healthcare",
      "retail",
      "restaurant",
      "education",
      "manufacturing",
      "office",
    ];
    return `${token} for ${verticals[index % verticals.length]}`;
  }
  if (type === "comparison") {
    const alts = ["alt A", "alt B", "alt C", "alt D"];
    return `${token} vs ${alts[index % alts.length]}`;
  }
  const resources = ["Guide", "Checklist", "FAQ", "Pricing", "How-to"];
  return `${resources[index % resources.length]}: ${token}`;
}

export function SERPAutopsy({
  industry,
  userDomain,
  onCaptureClick,
}: SERPAutopsyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [view, setView] = useState<View>("competitor");
  const [hovered, setHovered] = useState<PageTile | null>(null);

  const competitorCatalog = useMemo(
    () => buildCompetitorCatalog(industry),
    [industry],
  );
  const userCatalog = useMemo(() => buildUserCatalog(industry), [industry]);
  const catalog = view === "competitor" ? competitorCatalog : userCatalog;

  const competitor = industry.topCompetitors[0];
  const competitorDomain = competitor
    ? `${competitor.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`
    : "competitor.com";
  const displayUserDomain = userDomain
    ? faviconHost(userDomain)
    : "yourbusiness.com";

  const counts = useMemo(() => {
    const by: Record<PageType, number> = {
      service: 0,
      location: 0,
      industry: 0,
      comparison: 0,
      feature: 0,
    };
    catalog.forEach((t) => {
      by[t.type]++;
    });
    return by;
  }, [catalog]);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ marginBottom: "1.75rem", textAlign: "center" }}>
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
          SERP Autopsy
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
          A tour of the competitor&apos;s page architecture.
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
          Every tile below is an indexed page. Each tile is a door a customer
          can walk through. Hover one to see rough monthly traffic. Then
          toggle to your grid.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div
          role="tablist"
          aria-label="Toggle catalog"
          style={{
            display: "inline-flex",
            border: "1px solid rgba(0,0,0,0.1)",
            background: "#FFFFFF",
          }}
        >
          <ToggleTab
            active={view === "competitor"}
            onClick={() => setView("competitor")}
            label={`${competitor?.name ?? "Competitor"} · ${competitorDomain}`}
            count={competitorCatalog.length}
          />
          <ToggleTab
            active={view === "user"}
            onClick={() => setView("user")}
            label={`Your grid · ${displayUserDomain}`}
            count={userCatalog.length}
            accent
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            flexWrap: "wrap",
          }}
        >
          {PAGE_TYPE_ORDER.map((t) => (
            <Legend
              key={t}
              color={PAGE_TYPE_META[t].color}
              label={PAGE_TYPE_META[t].label}
              count={counts[t]}
            />
          ))}
        </div>
      </div>

      <motion.div
        key={view}
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: view === "competitor" ? "#0A0A0A" : "#FAF9F6",
          border:
            view === "competitor"
              ? "1px solid rgba(229,62,62,0.2)"
              : "1px solid rgba(229,62,62,0.35)",
          borderLeft: "3px solid #E53E3E",
          padding: "clamp(1rem, 2vw, 1.5rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {view === "competitor" && (
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
        )}

        <div style={{ position: "relative" }}>
          {view === "user" && userCatalog.length < 40 && (
            <div
              style={{
                marginBottom: "0.85rem",
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.88rem",
                color: "rgba(0,0,0,0.6)",
                lineHeight: 1.55,
                padding: "0.75rem 0.9rem",
                background: "rgba(229,62,62,0.05)",
                border: "1px dashed rgba(229,62,62,0.4)",
              }}
            >
              <strong style={{ color: "#111" }}>
                {userCatalog.length} pages.
              </strong>{" "}
              A typical {industry.shortName} site sits in this range. The grid
              is thin because the architecture was never built.
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(44px, 1fr))",
              gap: 4,
              minHeight: view === "competitor" ? 360 : 140,
            }}
          >
            {catalog.map((tile) => (
              <Tile
                key={tile.id}
                tile={tile}
                dark={view === "competitor"}
                onHover={setHovered}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              style={{
                marginTop: "1rem",
                padding: "0.85rem 1rem",
                background:
                  view === "competitor" ? "rgba(255,255,255,0.04)" : "#FFFFFF",
                border:
                  view === "competitor"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(0,0,0,0.08)",
                color: view === "competitor" ? "#FFFFFF" : "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: PAGE_TYPE_META[hovered.type].accent,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color:
                      view === "competitor"
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(0,0,0,0.45)",
                  }}
                >
                  {PAGE_TYPE_META[hovered.type].label}
                </span>
                <span
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "1rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {hovered.title}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "1rem",
                  color: "#E53E3E",
                  letterSpacing: "0.04em",
                }}
              >
                ~{hovered.monthlyVisits.toLocaleString()} visits / month
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.15rem 1.25rem",
          background:
            "linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.02))",
          border: "1px solid rgba(229,62,62,0.3)",
          borderLeft: "3px solid #E53E3E",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            maxWidth: 640,
          }}
        >
          The competitor grid fills up because each tile is a page Rule27 knows
          how to build on the same schedule that pushed NMHL past 7,000 pages.
          Your grid fills in too. The empty tiles are just not built yet.
        </div>
        <button
          onClick={onCaptureClick}
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
          See my empty grid filled in
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
    </section>
  );
}

function ToggleTab({
  active,
  onClick,
  label,
  count,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  accent?: boolean;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        padding: "0.55rem 0.95rem",
        background: active
          ? accent
            ? "rgba(229,62,62,0.12)"
            : "rgba(0,0,0,0.06)"
          : "transparent",
        border: "none",
        borderBottom: active
          ? `2px solid ${accent ? "#E53E3E" : "#111"}`
          : "2px solid transparent",
        fontFamily: "'Steelfish', 'Impact', sans-serif",
        fontSize: "12px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: active ? (accent ? "#E53E3E" : "#111") : "rgba(0,0,0,0.55)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {label}
      <span
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: 10,
          color: "rgba(0,0,0,0.4)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count.toLocaleString()}
      </span>
    </button>
  );
}

function Legend({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontFamily: "Helvetica Neue, sans-serif",
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.55)",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          background: color,
          display: "inline-block",
        }}
      />
      {label}
      <span
        style={{
          color: "rgba(0,0,0,0.35)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count.toLocaleString()}
      </span>
    </div>
  );
}

function Tile({
  tile,
  dark,
  onHover,
}: {
  tile: PageTile;
  dark: boolean;
  onHover: (t: PageTile | null) => void;
}) {
  const meta = PAGE_TYPE_META[tile.type];
  return (
    <button
      type="button"
      aria-label={`${meta.label}: ${tile.title}`}
      onMouseEnter={() => onHover(tile)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(tile)}
      onBlur={() => onHover(null)}
      style={{
        aspectRatio: "1 / 1",
        background: dark
          ? `${meta.color.replace("0.9", "0.55").replace("0.85", "0.5")}`
          : meta.color,
        border: dark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(0,0,0,0.06)",
        cursor: "pointer",
        padding: 0,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.15)";
        e.currentTarget.style.boxShadow =
          "0 4px 14px rgba(0,0,0,0.35), 0 0 0 1px rgba(229,62,62,0.5)";
        e.currentTarget.style.zIndex = "2";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.zIndex = "1";
      }}
    />
  );
}
