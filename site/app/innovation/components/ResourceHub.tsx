"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/app/components/Card";
import {
  Download,
  Star,
  FileText,
  Layers,
  Wrench,
  BarChart3,
  Search,
  BookOpen,
  Calculator,
  Map,
} from "lucide-react";

/* ─── Filter categories ─── */
const filters = [
  { id: "all", label: "All Resources", count: 47 },
  { id: "templates", label: "Templates", count: 12 },
  { id: "frameworks", label: "Frameworks", count: 8 },
  { id: "tools", label: "Tools", count: 15 },
  { id: "reports", label: "Reports", count: 12 },
];

/* ─── Resource data (ported from old site) ─── */
const resources = [
  {
    id: 1,
    title: "Brand Strategy Canvas",
    description:
      "Comprehensive framework for developing winning brand strategies with step-by-step guidance and real-world examples.",
    type: "templates",
    format: "PDF Template",
    size: "2.4 MB",
    downloads: "3.2K",
    rating: 4.9,
    price: "Free",
    tags: ["Brand Strategy", "Canvas", "Framework"],
    icon: FileText,
    featured: true,
  },
  {
    id: 2,
    title: "UX Research Toolkit",
    description:
      "Complete collection of user research templates, interview guides, and analysis frameworks used by top design teams.",
    type: "tools",
    format: "Figma Kit",
    size: "15.7 MB",
    downloads: "1.8K",
    rating: 4.8,
    price: "$29",
    tags: ["UX Research", "Templates", "Figma"],
    icon: Wrench,
    featured: true,
  },
  {
    id: 3,
    title: "Digital Transformation Playbook",
    description:
      "Strategic guide for leading digital transformation initiatives with proven methodologies and case studies.",
    type: "frameworks",
    format: "Interactive PDF",
    size: "8.9 MB",
    downloads: "2.7K",
    rating: 4.9,
    price: "$49",
    tags: ["Digital Transformation", "Strategy", "Leadership"],
    icon: BookOpen,
    featured: false,
  },
  {
    id: 4,
    title: "Conversion Rate Optimization Checklist",
    description:
      "Comprehensive 127-point checklist for optimizing conversion rates across all digital touchpoints.",
    type: "templates",
    format: "Google Sheets",
    size: "1.2 MB",
    downloads: "4.1K",
    rating: 4.7,
    price: "Free",
    tags: ["CRO", "Checklist", "Optimization"],
    icon: FileText,
    featured: false,
  },
  {
    id: 5,
    title: "2026 Design Trends Report",
    description:
      "In-depth analysis of emerging design trends with predictions and actionable insights for the year ahead.",
    type: "reports",
    format: "PDF Report",
    size: "12.3 MB",
    downloads: "5.6K",
    rating: 4.8,
    price: "Free",
    tags: ["Trends", "Design", "2026"],
    icon: BarChart3,
    featured: true,
  },
  {
    id: 6,
    title: "ROI Calculator Spreadsheet",
    description:
      "Advanced Excel template for calculating marketing ROI with multiple attribution models and scenario planning.",
    type: "tools",
    format: "Excel Template",
    size: "3.8 MB",
    downloads: "2.9K",
    rating: 4.6,
    price: "$19",
    tags: ["ROI", "Calculator", "Marketing"],
    icon: Calculator,
    featured: false,
  },
  {
    id: 7,
    title: "Design System Starter Kit",
    description:
      "Complete design system foundation with components, tokens, and documentation templates for Figma and Sketch.",
    type: "templates",
    format: "Design Kit",
    size: "45.2 MB",
    downloads: "1.4K",
    rating: 4.9,
    price: "$79",
    tags: ["Design System", "Components", "UI Kit"],
    icon: Layers,
    featured: true,
  },
  {
    id: 8,
    title: "Customer Journey Mapping Framework",
    description:
      "Structured approach to mapping customer journeys with templates, worksheets, and analysis tools.",
    type: "frameworks",
    format: "Workshop Kit",
    size: "7.1 MB",
    downloads: "3.5K",
    rating: 4.8,
    price: "$39",
    tags: ["Customer Journey", "Mapping", "UX"],
    icon: Map,
    featured: false,
  },
];

/* ─── Animation ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/* ─── Component ─── */
export default function ResourceHub() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesFilter =
        activeFilter === "all" || r.type === activeFilter;
      const matchesSearch =
        !searchTerm ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  const featuredResources = resources.filter((r) => r.featured);

  return (
    <section
      ref={ref}
      style={{ padding: "clamp(3rem, 6vw, 5rem) 1.5rem", background: "#FCFCFB" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{ width: 40, height: 2, background: "#E53E3E" }}
              aria-hidden
            />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#E53E3E",
              }}
            >
              Resource Hub
            </span>
            <div
              style={{ width: 40, height: 2, background: "#E53E3E" }}
              aria-hidden
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.75rem",
            }}
          >
            Strategic{" "}
            <span style={{ color: "#E53E3E" }}>Resources</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              color: "rgba(0,0,0,0.5)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Tools, templates, and frameworks to accelerate your digital
            transformation
          </p>
        </div>

        {/* Filter tabs + Search */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 9999,
                border:
                  activeFilter === f.id
                    ? "1px solid #E53E3E"
                    : "1px solid rgba(0,0,0,0.1)",
                background:
                  activeFilter === f.id
                    ? "#E53E3E"
                    : "rgba(255,255,255,0.8)",
                color:
                  activeFilter === f.id
                    ? "#FFFFFF"
                    : "rgba(0,0,0,0.5)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f.label}{" "}
              <span style={{ opacity: 0.7, fontSize: "11px" }}>
                ({f.count})
              </span>
            </button>
          ))}

          {/* Search */}
          <div style={{ position: "relative", marginLeft: "auto" }}>
            <div
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(0,0,0,0.3)",
              }}
            >
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                padding: "8px 12px 8px 32px",
                border: "1px solid rgba(0,0,0,0.1)",
                borderLeft: "2px solid transparent",
                background: "#FFFFFF",
                color: "#111111",
                outline: "none",
                width: 220,
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderLeftColor = "#E53E3E";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderLeftColor = "transparent";
              }}
            />
          </div>
        </div>

        {/* Featured row (only when filter is "all") */}
        {activeFilter === "all" && !searchTerm && (
          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#E53E3E",
                marginBottom: "1rem",
              }}
            >
              Featured Resources
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {featuredResources.map((r) => (
                <Card key={r.id} label={r.format} title={r.title}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <Star
                        size={12}
                        style={{ color: "#facc15", fill: "#facc15" }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          color: "rgba(0,0,0,0.5)",
                        }}
                      >
                        {r.rating}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "14px",
                        color:
                          r.price === "Free" ? "#10B981" : "#E53E3E",
                      }}
                    >
                      {r.price}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All resources grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {filteredResources.map((r) => (
            <motion.div key={r.id} variants={itemVariants}>
              <Card label={r.format} title={r.title} description={r.description}>
                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.35rem",
                    marginTop: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {r.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        color: "#E53E3E",
                        background: "rgba(229,62,62,0.06)",
                        border: "1px solid rgba(229,62,62,0.15)",
                        padding: "2px 8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer: rating, downloads, price */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(0,0,0,0.04)",
                    paddingTop: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Star size={12} style={{ color: "#facc15", fill: "#facc15" }} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>
                        {r.rating}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Download size={12} style={{ color: "rgba(0,0,0,0.3)" }} />
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>
                        {r.downloads}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "14px",
                      color: r.price === "Free" ? "#10B981" : "#E53E3E",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {r.price}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredResources.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ fontFamily: "var(--font-body)", color: "rgba(0,0,0,0.4)", fontSize: "1rem" }}>
              No resources found matching your search.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setActiveFilter("all"); }}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#E53E3E",
                background: "none",
                border: "none",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
