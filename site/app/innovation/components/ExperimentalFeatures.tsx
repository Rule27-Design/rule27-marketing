"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/app/components/Card";
import {
  Brain,
  Palette,
  TrendingUp,
  Zap,
  Play,
  BookOpen,
  Users,
  FlaskConical,
} from "lucide-react";

/* ─── Icon map ─── */
const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Brain,
  Palette,
  TrendingUp,
  Zap,
};

/* ─── Feature data ─── */
const features = [
  {
    id: 1,
    title: "AI Brand Analysis Engine",
    description:
      "Advanced machine learning algorithms analyze brand positioning, competitive landscape, and market opportunities in real-time.",
    status: "Live Beta",
    category: "Artificial Intelligence",
    icon: "Brain",
    metrics: { accuracy: "94.7%", speed: "2.3s", insights: "127" },
    preview:
      "Upload your brand assets and get instant competitive analysis with actionable recommendations.",
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)",
  },
  {
    id: 2,
    title: "Interactive Design System Generator",
    description:
      "Automatically generates comprehensive design systems based on brand guidelines and user preferences.",
    status: "Alpha Testing",
    category: "Design Automation",
    icon: "Palette",
    metrics: { components: "200+", variants: "1,500+", themes: "50+" },
    preview:
      "Input your brand colors and typography to generate a complete design system with components.",
    gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
  },
  {
    id: 3,
    title: "Real-time Trend Tracker",
    description:
      "Monitors global design trends, social media patterns, and emerging technologies to predict future directions.",
    status: "Production",
    category: "Trend Analysis",
    icon: "TrendingUp",
    metrics: { sources: "10K+", updates: "Real-time", predictions: "85% accurate" },
    preview:
      "Track emerging design trends and get predictions for the next 6-12 months.",
    gradient: "linear-gradient(135deg, #10B981, #059669)",
  },
  {
    id: 4,
    title: "Performance Optimization Lab",
    description:
      "Advanced testing environment for website performance, accessibility, and user experience optimization.",
    status: "Beta",
    category: "Performance",
    icon: "Zap",
    metrics: { tests: "500+", improvements: "40% avg", compliance: "100%" },
    preview:
      "Comprehensive performance analysis with automated optimization recommendations.",
    gradient: "linear-gradient(135deg, #F97316, #EF4444)",
  },
];

/* ─── Status badge colors ─── */
function statusStyle(status: string): React.CSSProperties {
  switch (status) {
    case "Production":
      return { background: "rgba(16,185,129,0.1)", color: "#10B981" };
    case "Live Beta":
      return { background: "rgba(59,130,246,0.1)", color: "#3B82F6" };
    case "Beta":
      return { background: "rgba(245,158,11,0.1)", color: "#F59E0B" };
    case "Alpha Testing":
      return { background: "rgba(139,92,246,0.1)", color: "#8B5CF6" };
    default:
      return { background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)" };
  }
}

/* ─── Stagger variants ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function ExperimentalFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const active = features[activeFeature];
  const ActiveIcon = iconMap[active.icon] || Zap;

  return (
    <section
      id="experimental"
      ref={sectionRef}
      style={{ background: "#F9F9F8", padding: "clamp(3rem, 8vw, 6rem) 0" }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          {/* Badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily:
                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#E53E3E",
              background: "rgba(229,62,62,0.08)",
              border: "1px solid rgba(229,62,62,0.15)",
              borderRadius: "9999px",
              padding: "6px 16px",
              marginBottom: "1.25rem",
            }}
          >
            <FlaskConical size={14} style={{ color: "#E53E3E" }} />
            Experimental Features
          </span>

          <h2
            style={{
              fontFamily:
                "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.75rem",
              lineHeight: 1,
            }}
          >
            Innovation in{" "}
            <span style={{ color: "#E53E3E" }}>Action</span>
          </h2>

          <p
            style={{
              fontFamily:
                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: "rgba(0,0,0,0.5)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Cutting-edge tools and technologies that push the boundaries of
            what&apos;s possible in digital design and development.
          </p>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: "2rem", alignItems: "start" }}
        >
          {/* Left: feature list */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Zap;
              const isActive = activeFeature === index;

              return (
                <motion.div key={feature.id} variants={itemVariants}>
                  <Card className={isActive ? "ring-active" : ""}>
                    <div
                      onClick={() => setActiveFeature(index)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "12px",
                          background: feature.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={22} style={{ color: "#FFFFFF" }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title + status */}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.35rem",
                          }}
                        >
                          <h3
                            style={{
                              fontFamily:
                                "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                              fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              color: "#111111",
                              margin: 0,
                              lineHeight: 1.2,
                            }}
                          >
                            {feature.title}
                          </h3>
                          <span
                            style={{
                              fontFamily:
                                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                              fontSize: "10px",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              padding: "3px 10px",
                              borderRadius: "9999px",
                              ...statusStyle(feature.status),
                            }}
                          >
                            {feature.status}
                          </span>
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            fontFamily:
                              "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                            fontSize: "13px",
                            color: "rgba(0,0,0,0.55)",
                            lineHeight: 1.6,
                            margin: "0 0 0.5rem",
                          }}
                        >
                          {feature.description}
                        </p>

                        {/* Category + users */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily:
                                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                              fontSize: "11px",
                              color: "rgba(0,0,0,0.45)",
                              background: "rgba(0,0,0,0.04)",
                              padding: "3px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {feature.category}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontFamily:
                                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                              fontSize: "11px",
                              color: "rgba(0,0,0,0.4)",
                            }}
                          >
                            <Users size={12} />
                            Active: {Math.floor(500 + index * 137)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right: active feature preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sticky top-24"
          >
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "2px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
            >
              {/* Top gradient bar */}
              <div
                style={{
                  height: "3px",
                  background: active.gradient,
                }}
              />

              <div style={{ padding: "1.75rem" }}>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      background: active.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ActiveIcon size={28} style={{ color: "#FFFFFF" }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily:
                          "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#111111",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {active.title}
                    </h3>
                    <p
                      style={{
                        fontFamily:
                          "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                        fontSize: "13px",
                        color: "rgba(0,0,0,0.45)",
                        margin: "2px 0 0",
                      }}
                    >
                      {active.category}
                    </p>
                  </div>
                </div>

                {/* Preview text */}
                <p
                  style={{
                    fontFamily:
                      "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                    fontSize: "14px",
                    color: "rgba(0,0,0,0.6)",
                    lineHeight: 1.7,
                    margin: "0 0 1.5rem",
                  }}
                >
                  {active.preview}
                </p>

                {/* Metrics */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {Object.entries(active.metrics).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        textAlign: "center",
                        padding: "0.75rem",
                        background: "#F9F9F8",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily:
                            "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                          fontSize: "clamp(1rem, 1.8vw, 1.35rem)",
                          color: "#E53E3E",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          marginBottom: "2px",
                        }}
                      >
                        {value}
                      </div>
                      <div
                        style={{
                          fontFamily:
                            "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                          fontSize: "11px",
                          color: "rgba(0,0,0,0.45)",
                          textTransform: "capitalize",
                        }}
                      >
                        {key}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                  }}
                  className="flex-col sm:flex-row"
                >
                  <button
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontFamily:
                        "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "10px 20px",
                      background: "#E53E3E",
                      color: "#FFFFFF",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Play size={14} />
                    Try Demo
                  </button>
                  <button
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontFamily:
                        "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "10px 20px",
                      background: "transparent",
                      color: "rgba(0,0,0,0.6)",
                      border: "1px solid rgba(0,0,0,0.15)",
                      cursor: "pointer",
                    }}
                  >
                    <BookOpen size={14} />
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .ring-active {
          border-color: rgba(229,62,62,0.25) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(229,62,62,0.1) !important;
        }
      `}</style>
    </section>
  );
}
