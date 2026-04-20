"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { ServiceZone, Service } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Inline SVG icon mapping
// ---------------------------------------------------------------------------

function ServiceIcon({ name, size = 20 }: { name: string; size?: number }) {
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
    case "Layers":
      return (
        <svg {...common}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "PenTool":
      return (
        <svg {...common}>
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case "BarChart":
      return (
        <svg {...common}>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      );
    case "Globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "Layout":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    case "Monitor":
      return (
        <svg {...common}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
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
// Component
// ---------------------------------------------------------------------------

interface ZoneViewProps {
  zone: ServiceZone;
  services: Service[];
}

export function ZoneView({ zone, services }: ZoneViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category));
    return Array.from(cats).sort();
  }, [services]);

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = services;
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory);
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
  }, [services, selectedCategory, searchTerm]);

  return (
    <section
      style={{
        padding: "clamp(2rem, 4vw, 3rem) 1.5rem",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Section heading */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            width: 40,
            height: 2,
            background: "#E53E3E",
            marginBottom: "1rem",
          }}
          aria-hidden="true"
        />
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#111111",
            margin: "0 0 0.5rem",
          }}
        >
          All Services
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            color: "rgba(0,0,0,0.45)",
            margin: 0,
          }}
        >
          Browse and discover the right service for your project
        </p>
      </div>

      {/* Search + Category filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        {/* Search */}
        <div style={{ flex: "1 1 260px", position: "relative" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "#111111",
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.08)",
              borderLeft: "2px solid transparent",
              borderRadius: 2,
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

        {/* Category pills */}
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "8px 14px",
            borderRadius: 2,
            border:
              selectedCategory === null
                ? "1px solid #E53E3E"
                : "1px solid rgba(0,0,0,0.08)",
            background: selectedCategory === null ? "#E53E3E" : "#FFFFFF",
            color: selectedCategory === null ? "#FFFFFF" : "rgba(0,0,0,0.5)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 14px",
              borderRadius: 2,
              border:
                selectedCategory === cat
                  ? "1px solid #E53E3E"
                  : "1px solid rgba(0,0,0,0.08)",
              background: selectedCategory === cat ? "#E53E3E" : "#FFFFFF",
              color:
                selectedCategory === cat ? "#FFFFFF" : "rgba(0,0,0,0.5)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <ServiceCard service={service} zoneSlug={zone.slug} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredServices.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.3)",
              margin: "0 0 0.5rem",
            }}
          >
            No services found
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "rgba(0,0,0,0.35)",
            }}
          >
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// ServiceCard - animated card linking to service detail
// ---------------------------------------------------------------------------

function ServiceCard({
  service,
  zoneSlug,
}: {
  service: Service;
  zoneSlug: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/capabilities/${zoneSlug}/${service.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          border: `1px solid ${hovered ? "rgba(229,62,62,0.15)" : "rgba(0,0,0,0.06)"}`,
          borderLeft: `3px solid ${hovered ? "#E53E3E" : "transparent"}`,
          borderRadius: 2,
          padding: "1.5rem",
          transition: "all 0.3s",
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(229,62,62,0.06)"
            : "0 1px 4px rgba(0,0,0,0.04)",
          transform: hovered ? "translateY(-2px)" : "none",
          height: "100%",
        }}
      >
        {/* Header: icon + category */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: hovered
                ? "rgba(229,62,62,0.08)"
                : "rgba(229,62,62,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E53E3E",
              transition: "background 0.2s",
            }}
          >
            <ServiceIcon name={service.icon} size={20} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {service.isFeatured && (
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "8px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  background: "#E53E3E",
                  padding: "2px 8px",
                  borderRadius: 2,
                }}
              >
                Featured
              </span>
            )}
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.65rem",
                color: "rgba(0,0,0,0.35)",
                background: "#F8F9FA",
                padding: "3px 8px",
                borderRadius: 2,
              }}
            >
              {service.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: hovered ? "#E53E3E" : "#111111",
            margin: "0 0 0.4rem",
            lineHeight: 1.2,
            transition: "color 0.2s",
          }}
        >
          {service.title}
        </h3>

        {/* Description (2-line clamp) */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "rgba(0,0,0,0.5)",
            lineHeight: 1.6,
            margin: "0 0 1rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {service.description}
        </p>

        {/* Features (first 3) */}
        {service.features.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.35rem",
              marginBottom: "1rem",
            }}
          >
            {service.features.slice(0, 3).map((f, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  color: "rgba(0,0,0,0.45)",
                  background: "#F8F9FA",
                  padding: "3px 8px",
                  borderRadius: 2,
                }}
              >
                {f}
              </span>
            ))}
            {service.features.length > 3 && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  color: "#E53E3E",
                  padding: "3px 0",
                }}
              >
                +{service.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* View arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#E53E3E",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          Learn More
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
