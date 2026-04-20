"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { ServiceZone, Service } from "@/app/lib/types";
import { WaveBorder } from "@/app/components/WaveBorder";
import { CalendlyModal } from "@/app/components/CalendlyModal";

// ---------------------------------------------------------------------------
// Inline SVG icons (lucide-style) - avoids external icon deps
// ---------------------------------------------------------------------------

function ZoneIcon({ name, size = 24 }: { name: string; size?: number }) {
  const stroke = "currentColor";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "Palette":
      return (
        <svg {...common}>
          <circle cx="13.5" cy="6.5" r=".5" fill={stroke} />
          <circle cx="17.5" cy="10.5" r=".5" fill={stroke} />
          <circle cx="8.5" cy="7.5" r=".5" fill={stroke} />
          <circle cx="6.5" cy="12.5" r=".5" fill={stroke} />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      );
    case "Target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "Code":
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "Briefcase":
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "Zap":
      return (
        <svg {...common}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "Search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "ArrowRight":
      return (
        <svg {...common}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );
    case "Calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "MessageCircle":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "Calculator":
      return (
        <svg {...common}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="16" y1="14" x2="16" y2="18" />
          <line x1="8" y1="11" x2="8" y2="11.01" />
          <line x1="12" y1="11" x2="12" y2="11.01" />
          <line x1="16" y1="11" x2="16" y2="11.01" />
          <line x1="8" y1="15" x2="8" y2="15.01" />
          <line x1="12" y1="15" x2="12" y2="15.01" />
          <line x1="8" y1="19" x2="8" y2="19.01" />
          <line x1="12" y1="19" x2="12" y2="19.01" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function smoothScrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Derive unique categories from services list. */
function getCategories(services: Service[]): string[] {
  const set = new Set<string>();
  for (const s of services) {
    if (s.category) set.add(s.category);
  }
  return Array.from(set).sort();
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  serviceZones: ServiceZone[];
  services: Service[];
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CapabilitiesView({ serviceZones, services }: Props) {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const categories = useMemo(() => getCategories(services), [services]);

  // Filter services for the catalog section
  const filteredServices = useMemo(() => {
    let filtered = services;

    if (activeCategory !== "all") {
      filtered = filtered.filter((s) => s.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.features.some((f) => f.toLowerCase().includes(q)),
      );
    }

    return filtered;
  }, [services, activeCategory, searchTerm]);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div style={{ background: "var(--color-wa-bg)" }}>
      {/* ================================================================ */}
      {/* HERO SECTION                                                      */}
      {/* ================================================================ */}
      <section
        style={{
          padding: "clamp(4rem, 8vw, 6rem) 1.5rem",
          textAlign: "center",
          background: "linear-gradient(135deg, #FFFFFF, rgba(248,249,250,0.3), #FFFFFF)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 1.25rem",
                lineHeight: 1,
              }}
            >
              Capability{" "}
              <span style={{ color: "#E53E3E" }}>Universe</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.65,
                maxWidth: 720,
                margin: "0 auto 2rem",
              }}
            >
              Four distinct experience zones showcase Rule27 Design&apos;s comprehensive
              service mastery through immersive, interactive presentations. Discover the
              perfect solution for your business transformation.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => smoothScrollTo("zones-section")}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "16px 36px",
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "box-shadow 0.2s",
                  boxShadow: "0 4px 16px rgba(229,62,62,0.3)",
                }}
              >
                <ZoneIcon name="Zap" size={18} />
                Explore Capabilities
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => smoothScrollTo("services-section")}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "16px 36px",
                  background: "transparent",
                  color: "#E53E3E",
                  border: "2px solid #E53E3E",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E53E3E";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#E53E3E";
                }}
              >
                <ZoneIcon name="Calculator" size={18} />
                Take Assessment
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SERVICE EXPERIENCE ZONES                                          */}
      {/* ================================================================ */}
      {serviceZones.length > 0 && (
        <section
          id="zones-section"
          style={{
            padding: "clamp(4rem, 6vw, 5rem) 1.5rem",
            background: "rgba(248,249,250,0.4)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Section heading */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 5vw, 3.25rem)",
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#111111",
                  margin: "0 0 0.75rem",
                  lineHeight: 1.1,
                }}
              >
                Service Experience Zones
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)",
                  color: "rgba(0,0,0,0.5)",
                  maxWidth: 600,
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                Each zone represents a core competency area with specialized expertise
                and proven methodologies
              </p>
            </div>

            {/* Zone cards 2-column grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
                gap: "2rem",
              }}
            >
              {serviceZones.map((zone, zoneIndex) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  isActive={activeZone === zone.slug}
                  index={zoneIndex}
                  onActivate={() =>
                    setActiveZone(activeZone === zone.slug ? null : zone.slug)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* DETAILED SERVICE CATALOG                                          */}
      {/* ================================================================ */}
      <section
        id="services-section"
        style={{
          padding: "clamp(4rem, 6vw, 5rem) 1.5rem",
          background: "rgba(248,249,250,0.2)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.75rem",
                lineHeight: 1.1,
              }}
            >
              Detailed Service Catalog
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)",
                color: "rgba(0,0,0,0.5)",
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Explore our comprehensive service offerings with detailed information
              and case studies
            </p>
          </div>

          {/* 4-column layout: 1 sidebar + 3 cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "2rem",
              alignItems: "start",
            }}
            className="catalog-grid"
          >
            {/* ---- Filter Sidebar ---- */}
            <div
              style={{
                position: "sticky",
                top: 80,
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                borderLeft: "3px solid #E53E3E",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Search */}
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Search Services
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(0,0,0,0.3)",
                      display: "flex",
                    }}
                  >
                    <ZoneIcon name="Search" size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 32px",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      color: "#111111",
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderLeft: "2px solid transparent",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderLeftColor = "#E53E3E";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(229,62,62,0.06)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderLeftColor = "transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Category
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <CategoryButton
                    label="All Services"
                    active={activeCategory === "all"}
                    onClick={() => handleCategoryChange("all")}
                  />
                  {categories.map((cat) => (
                    <CategoryButton
                      key={cat}
                      label={cat}
                      active={activeCategory === cat}
                      onClick={() => handleCategoryChange(cat)}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.06)",
                  paddingTop: "1rem",
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Quick Actions
                </label>
                <button
                  onClick={() => setCalendlyOpen(true)}
                  style={{
                    display: "block",
                    width: "100%",
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "10px 14px",
                    background: "#E53E3E",
                    color: "#FFFFFF",
                    textAlign: "center",
                    border: "none",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    marginBottom: "0.5rem",
                  }}
                >
                  Book Consultation
                </button>
                <Link
                  href="/contact"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "10px 14px",
                    background: "transparent",
                    color: "#E53E3E",
                    border: "1px solid #E53E3E",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  ROI Calculator
                </Link>
              </div>
            </div>

            {/* ---- Service Cards Grid (3 cols inside remaining space) ---- */}
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredServices.map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      zoneSlug={service.zone}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {filteredServices.length === 0 && (
                <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
                  <div
                    style={{
                      color: "rgba(0,0,0,0.2)",
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <ZoneIcon name="Search" size={48} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.25rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(0,0,0,0.35)",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    No services found
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: "rgba(0,0,0,0.4)",
                    }}
                  >
                    {services.length === 0
                      ? "No services available yet"
                      : "Try adjusting your search or filter criteria"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* BOTTOM CTA                                                        */}
      {/* ================================================================ */}
      <section
        style={{
          background: "linear-gradient(135deg, #E53E3E, #C53030)",
          padding: "clamp(4rem, 8vw, 5rem) 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                margin: "0 0 1rem",
                lineHeight: 1.1,
              }}
            >
              Ready to Transform Your Business?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 2rem",
                lineHeight: 1.6,
              }}
            >
              Let&apos;s discuss how our capabilities can drive your success
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setCalendlyOpen(true)}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "16px 36px",
                  background: "#FFFFFF",
                  color: "#111111",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
              >
                <ZoneIcon name="Calendar" size={18} />
                Schedule Strategy Call
              </button>
              <Link
                href="/contact"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "16px 36px",
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "2px solid #FFFFFF",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <ZoneIcon name="MessageCircle" size={18} />
                Start Conversation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Responsive overrides for catalog grid on small screens */}
      <style jsx global>{`
        @media (max-width: 860px) {
          .catalog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Zone Card sub-component
// ---------------------------------------------------------------------------

interface ZoneCardProps {
  zone: ServiceZone;
  isActive: boolean;
  index: number;
  onActivate: () => void;
}

function ZoneCard({ zone, isActive, index, onActivate }: ZoneCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onActivate}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        cursor: "pointer",
        transition: "all 0.4s",
        background: isActive
          ? "linear-gradient(135deg, rgba(229,62,62,0.12), rgba(229,62,62,0.03))"
          : "#FFFFFF",
        border: isActive
          ? "2px solid #E53E3E"
          : "1px solid rgba(0,0,0,0.06)",
        boxShadow: isActive
          ? "0 10px 40px rgba(229,62,62,0.15), 0 4px 12px rgba(0,0,0,0.06)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Decorative background circles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -64,
            right: -64,
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: "#E53E3E",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -48,
            left: -48,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#111111",
          }}
        />
      </div>

      <div style={{ position: "relative", padding: "2rem" }}>
        {/* Header: icon badge + service count */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "#E53E3E" : "rgba(0,0,0,0.04)",
              color: isActive ? "#FFFFFF" : "#111111",
              transition: "all 0.3s",
            }}
          >
            <ZoneIcon name={zone.icon} size={28} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: 9999,
              background: isActive ? "rgba(229,62,62,0.12)" : "rgba(0,0,0,0.04)",
              color: isActive ? "#E53E3E" : "rgba(0,0,0,0.45)",
              transition: "all 0.3s",
            }}
          >
            {zone.serviceCount ?? 0} Services
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.5rem",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isActive ? "#E53E3E" : "#111111",
            margin: "0 0 0.75rem",
            transition: "color 0.3s",
            lineHeight: 1.2,
          }}
        >
          {zone.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            color: "rgba(0,0,0,0.55)",
            lineHeight: 1.65,
            margin: "0 0 1rem",
          }}
        >
          {zone.description}
        </p>

        {/* Key Service Tags */}
        {zone.keyServices && zone.keyServices.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1.25rem",
            }}
          >
            {zone.keyServices.slice(0, 3).map((service, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  padding: "4px 12px",
                  borderRadius: 9999,
                  background: isActive
                    ? "rgba(229,62,62,0.08)"
                    : "rgba(0,0,0,0.04)",
                  color: isActive ? "#E53E3E" : "rgba(0,0,0,0.5)",
                  border: isActive
                    ? "1px solid rgba(229,62,62,0.15)"
                    : "1px solid transparent",
                  transition: "all 0.3s",
                }}
              >
                {service}
              </span>
            ))}
            {zone.keyServices.length > 3 && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  padding: "4px 12px",
                  borderRadius: 9999,
                  background: "rgba(0,0,0,0.04)",
                  color: "rgba(0,0,0,0.4)",
                }}
              >
                +{zone.keyServices.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats Grid */}
        {zone.stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              padding: "1rem 0",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.5rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isActive ? "#E53E3E" : "#111111",
                  transition: "color 0.3s",
                }}
              >
                {zone.stats.projects}+
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "rgba(0,0,0,0.4)",
                }}
              >
                Projects
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.5rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isActive ? "#E53E3E" : "#111111",
                  transition: "color 0.3s",
                }}
              >
                {zone.stats.satisfaction}%
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "rgba(0,0,0,0.4)",
                }}
              >
                Satisfaction
              </div>
            </div>
          </div>
        )}

        {/* Action Button - links to /capabilities/[zone-slug] */}
        <Link
          href={`/capabilities/${zone.slug}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "14px 24px",
            textDecoration: "none",
            transition: "all 0.25s",
            ...(isActive
              ? {
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  border: "1px solid #E53E3E",
                  boxShadow: "0 4px 12px rgba(229,62,62,0.25)",
                }
              : {
                  background: "transparent",
                  color: "#E53E3E",
                  border: "1px solid #E53E3E",
                }),
          }}
        >
          Explore {zone.title}
          <ZoneIcon name="ArrowRight" size={16} />
        </Link>
      </div>

      {/* Hover gradient overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(229,62,62,0.06), transparent)",
          pointerEvents: "none",
        }}
        animate={{ opacity: isHovered && !isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Category filter button
// ---------------------------------------------------------------------------

interface CategoryButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function CategoryButton({ label, active, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: "14px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "8px 12px",
        textAlign: "left",
        background: active ? "rgba(229,62,62,0.06)" : "transparent",
        color: active ? "#E53E3E" : "rgba(0,0,0,0.5)",
        border: "none",
        borderLeft: active ? "2px solid #E53E3E" : "2px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s",
        width: "100%",
      }}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Service Card sub-component
// ---------------------------------------------------------------------------

interface ServiceCardProps {
  service: Service;
  zoneSlug: string;
  index: number;
}

function ServiceCard({ service, zoneSlug, index }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/capabilities/${zoneSlug}/${service.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          style={{
            position: "relative",
            background: "#FFFFFF",
            border: isHovered
              ? "1px solid rgba(229,62,62,0.15)"
              : "1px solid rgba(0,0,0,0.06)",
            borderRadius: 2,
            padding: "1.5rem",
            boxShadow: isHovered
              ? "0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(229,62,62,0.06)"
              : "0 1px 4px rgba(0,0,0,0.04)",
            transition: "box-shadow 0.3s, transform 0.3s, border-color 0.3s",
            transform: isHovered ? "translateY(-2px)" : "none",
            cursor: "pointer",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* RULE27 WaveBorder */}
          <WaveBorder animated={isHovered} />

          {/* Category label */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{
              display: "inline-block",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "#E53E3E",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(229,62,62,0.3)",
              paddingBottom: "4px",
            }}>
              {service.category}
            </span>
            <div style={{
              width: 36, height: 36, borderRadius: 2,
              background: isHovered ? "rgba(229,62,62,0.1)" : "rgba(229,62,62,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#E53E3E", transition: "background 0.3s",
            }}>
              <ZoneIcon name={service.icon} size={18} />
            </div>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontWeight: "500",
            fontSize: "18px",
            color: isHovered ? "#E53E3E" : "#000",
            margin: "0 0 0.75rem 0",
            letterSpacing: "-0.01em",
            transition: "color 0.3s",
          }}>
            {service.title}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "13px",
            color: "rgba(0,0,0,0.55)",
            margin: "0 0 1rem 0",
            lineHeight: 1.7,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}>
            {service.description}
          </p>

          {/* Features + Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {service.features.slice(0, 2).map((feature, i) => (
                <span key={i} style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "11px",
                  color: "rgba(0,0,0,0.4)",
                  background: "rgba(229,62,62,0.04)",
                  border: "1px solid rgba(229,62,62,0.1)",
                  padding: "2px 8px",
                }}>
                  {feature.length > 22 ? feature.substring(0, 22) + "..." : feature}
                </span>
              ))}
            </div>
            <div style={{
              color: "#E53E3E",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateX(0)" : "translateX(-6px)",
              transition: "opacity 0.3s, transform 0.3s",
              flexShrink: 0, marginLeft: "0.5rem",
            }}>
              <ZoneIcon name="ArrowRight" size={16} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
