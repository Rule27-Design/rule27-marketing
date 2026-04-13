"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StatCard } from "@/app/components/Card";
import {
  TrendingUp,
  Palette,
  Cpu,
  Users,
  Zap,
  Sparkles,
  Download,
} from "lucide-react";

/* ─── Tab data ─── */

interface TrendInsight {
  trend: string;
  growth: string;
  confidence: string;
  color: string;
}

interface TrendTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  subtitle: string;
  insights: TrendInsight[];
  statCards: { label: string; value: string; unit?: string; change?: string }[];
}

const tabs: TrendTab[] = [
  {
    id: "design",
    label: "Design Trends",
    icon: Palette,
    title: "Design Trends 2026",
    subtitle: "Visual design patterns shaping the future",
    insights: [
      { trend: "Minimalism", growth: "+15%", confidence: "98%", color: "#E53E3E" },
      { trend: "Brutalism", growth: "+73%", confidence: "85%", color: "#111111" },
      { trend: "Glassmorphism", growth: "+35%", confidence: "92%", color: "#3B82F6" },
      { trend: "Neumorphism", growth: "-43%", confidence: "89%", color: "#6B7280" },
    ],
    statCards: [
      { label: "Minimalism Index", value: "98", unit: "/100", change: "+15% YoY" },
      { label: "Brutalism Growth", value: "73", unit: "%", change: "+73% QoQ" },
      { label: "Glassmorphism Score", value: "88", unit: "/100", change: "+35% YoY" },
    ],
  },
  {
    id: "technology",
    label: "Technology",
    icon: Cpu,
    title: "Technology Adoption",
    subtitle: "Emerging technologies in web development",
    insights: [
      { trend: "AI Integration", growth: "+156%", confidence: "96%", color: "#E53E3E" },
      { trend: "WebAssembly", growth: "+89%", confidence: "78%", color: "#111111" },
      { trend: "Progressive Web Apps", growth: "+67%", confidence: "91%", color: "#3B82F6" },
      { trend: "Serverless Architecture", growth: "+124%", confidence: "87%", color: "#10B981" },
    ],
    statCards: [
      { label: "AI/ML Adoption", value: "78", unit: "%", change: "+156% YoY" },
      { label: "WebAssembly Usage", value: "45", unit: "%", change: "+89% YoY" },
      { label: "Edge Computing", value: "42", unit: "%", change: "+90% potential" },
    ],
  },
  {
    id: "user",
    label: "User Behavior",
    icon: Users,
    title: "User Behavior Patterns",
    subtitle: "How users interact with digital products",
    insights: [
      { trend: "Mobile Usage", growth: "+23%", confidence: "99%", color: "#E53E3E" },
      { trend: "Voice Interactions", growth: "+145%", confidence: "82%", color: "#111111" },
      { trend: "Dark Mode Preference", growth: "+78%", confidence: "94%", color: "#3B82F6" },
      { trend: "Accessibility Focus", growth: "+67%", confidence: "88%", color: "#10B981" },
    ],
    statCards: [
      { label: "Mobile-First Users", value: "78", unit: "%", change: "+23% YoY" },
      { label: "Dark Mode Pref", value: "67", unit: "%", change: "+78% YoY" },
      { label: "Personalization Demand", value: "92", unit: "%", change: "+45% YoY" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function TrendAnalysis() {
  const [activeTab, setActiveTab] = useState("design");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const current = tabs.find((t) => t.id === activeTab)!;

  return (
    <section
      id="trends"
      ref={sectionRef}
      style={{ background: "#FFFFFF", padding: "clamp(3rem, 8vw, 6rem) 0" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
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
            <TrendingUp size={14} style={{ color: "#E53E3E" }} />
            Trend Analysis
          </span>

          <h2
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.75rem",
              lineHeight: 1,
            }}
          >
            Data-Driven <span style={{ color: "#E53E3E" }}>Insights</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: "rgba(0,0,0,0.5)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Real-time analysis of industry trends, user behaviors, and emerging
            technologies to guide strategic decisions.
          </p>
        </motion.div>

        {/* ── Tab navigation ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              background: "rgba(0,0,0,0.04)",
              borderRadius: "16px",
              padding: "4px",
              gap: "2px",
            }}
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#E53E3E" : "rgba(0,0,0,0.5)",
                    background: isActive ? "#FFFFFF" : "transparent",
                    border: "none",
                    borderRadius: "12px",
                    padding: "8px 18px",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <TabIcon size={16} style={{ color: isActive ? "#E53E3E" : "rgba(0,0,0,0.4)" }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Content grid ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ gap: "1.5rem" }}
        >
          {/* Left: stat cards + chart area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                background: "#F9F9F8",
                borderRadius: "2px",
                padding: "1.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#111111",
                  margin: "0 0 0.25rem",
                }}
              >
                {current.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                  fontSize: "13px",
                  color: "rgba(0,0,0,0.45)",
                  margin: "0 0 1.5rem",
                }}
              >
                {current.subtitle}
              </p>

              {/* StatCards grid */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3"
                style={{ gap: "0.75rem" }}
              >
                {current.statCards.map((sc) => (
                  <StatCard
                    key={sc.label}
                    label={sc.label}
                    value={sc.value}
                    unit={sc.unit}
                    change={sc.change}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: insights panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Key insights dark card */}
            <div
              style={{
                background: "#111111",
                borderRadius: "2px",
                padding: "1.5rem",
              }}
            >
              <h4
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  margin: "0 0 1.25rem",
                }}
              >
                <Zap size={18} style={{ color: "#E53E3E" }} />
                Key Insights
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {current.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderBottom:
                        idx < current.insights.length - 1
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "none",
                      paddingBottom: idx < current.insights.length - 1 ? "0.75rem" : 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#FFFFFF",
                        }}
                      >
                        {insight.trend}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                          fontSize: "12px",
                          letterSpacing: "0.05em",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: insight.growth.startsWith("+")
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(239,68,68,0.15)",
                          color: insight.growth.startsWith("+")
                            ? "#34D399"
                            : "#F87171",
                        }}
                      >
                        {insight.growth}
                      </span>
                    </div>
                    {/* Confidence bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          flex: 1,
                          height: "4px",
                          borderRadius: "2px",
                          background: "rgba(255,255,255,0.1)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: insight.confidence,
                            height: "100%",
                            borderRadius: "2px",
                            background: insight.color,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {insight.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download button */}
              <button
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "10px 20px",
                  background: "transparent",
                  color: "#E53E3E",
                  border: "1px solid rgba(229,62,62,0.4)",
                  cursor: "pointer",
                  marginTop: "1.25rem",
                  transition: "all 0.2s",
                }}
              >
                <Download size={14} />
                Download Report
              </button>
            </div>

            {/* AI Prediction card */}
            <div
              style={{
                background: "linear-gradient(135deg, #E53E3E, #c53030)",
                borderRadius: "2px",
                padding: "1.5rem",
              }}
            >
              <h4
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  margin: "0 0 0.75rem",
                }}
              >
                <Sparkles size={18} style={{ color: "#FFFFFF" }} />
                AI Prediction
              </h4>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.6,
                  margin: "0 0 0.75rem",
                }}
              >
                Based on current data patterns, we predict the next major shift
                will occur in Q3 2026.
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                    fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                    color: "#FFFFFF",
                    letterSpacing: "0.05em",
                    marginBottom: "2px",
                  }}
                >
                  87%
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Confidence Level
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
