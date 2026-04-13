"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Accordion } from "@/app/components/Accordion";
import { Search, Palette, Settings, Rocket, type LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface Step {
  title: string;
  description: string;
  tools: string[];
}

interface Phase {
  id: number;
  phase: string;
  subtitle: string;
  icon: LucideIcon;
  duration: string;
  steps: Step[];
  deliverables: string[];
  collaboration: string;
}

const methodology: Phase[] = [
  {
    id: 1,
    phase: "Discovery & Strategy",
    subtitle: "Understanding Your Complete Digital Needs",
    icon: Search,
    duration: "1-2 weeks",
    steps: [
      {
        title: "Business & Technical Audit",
        description:
          "We analyze your current marketing performance and technical infrastructure to identify opportunities.",
        tools: ["Marketing Analytics Review", "Technical Stack Assessment", "Competitor Analysis"],
      },
      {
        title: "Platform & Integration Planning",
        description:
          "Mapping out the ideal combination of marketing platforms and technical solutions for your goals.",
        tools: ["Platform Selection", "Integration Architecture", "Data Flow Mapping"],
      },
      {
        title: "Strategic Roadmap Development",
        description:
          "Creating a unified strategy that aligns marketing objectives with technical capabilities.",
        tools: ["Marketing Strategy", "Technical Requirements", "Timeline Planning"],
      },
    ],
    deliverables: ["Digital Strategy Document", "Platform Recommendations", "Project Roadmap"],
    collaboration: "Stakeholder workshops, discovery sessions, and transparent planning",
  },
  {
    id: 2,
    phase: "Design & Architecture",
    subtitle: "Creating the Blueprint for Success",
    icon: Palette,
    duration: "2-3 weeks",
    steps: [
      {
        title: "Creative Concept Development",
        description:
          "Designing compelling brand experiences and marketing campaigns that resonate with your audience.",
        tools: ["Brand Design", "Campaign Creative", "UX/UI Design"],
      },
      {
        title: "Technical Architecture Design",
        description: "Planning scalable, secure infrastructure and development frameworks.",
        tools: ["Cloud Architecture", "API Design", "Security Planning"],
      },
      {
        title: "Marketing Automation Blueprints",
        description: "Designing automated workflows that nurture leads and drive conversions.",
        tools: ["Workflow Design", "Lead Scoring Models", "Customer Journey Mapping"],
      },
    ],
    deliverables: ["Design Systems", "Technical Architecture", "Automation Workflows"],
    collaboration: "Design reviews, technical planning sessions, and iterative refinement",
  },
  {
    id: 3,
    phase: "Build & Configure",
    subtitle: "Bringing Strategy to Life",
    icon: Settings,
    duration: "4-8 weeks",
    steps: [
      {
        title: "Platform Implementation",
        description:
          "Setting up and configuring marketing platforms like Salesforce, HubSpot, and Shopify.",
        tools: ["CRM Setup", "Marketing Automation", "E-commerce Configuration"],
      },
      {
        title: "Custom Development",
        description:
          "Building custom applications, integrations, and features using certified expertise.",
        tools: ["Full-Stack Development", "API Integration", "Cloud Deployment"],
      },
      {
        title: "Quality Assurance & Testing",
        description: "Rigorous testing of both marketing systems and technical implementations.",
        tools: ["Campaign Testing", "Performance Testing", "Security Audits"],
      },
    ],
    deliverables: ["Configured Platforms", "Custom Applications", "Testing Documentation"],
    collaboration: "Sprint reviews, continuous feedback, and agile development",
  },
  {
    id: 4,
    phase: "Launch & Optimize",
    subtitle: "Driving Continuous Success",
    icon: Rocket,
    duration: "Ongoing",
    steps: [
      {
        title: "Coordinated Launch",
        description: "Seamless deployment of marketing campaigns and technical solutions.",
        tools: ["Campaign Launch", "Deployment Management", "Go-Live Support"],
      },
      {
        title: "Performance Monitoring",
        description: "Real-time tracking of marketing metrics and technical performance.",
        tools: ["Analytics Dashboards", "Performance Monitoring", "A/B Testing"],
      },
      {
        title: "Continuous Optimization",
        description: "Ongoing refinement based on data insights and user feedback.",
        tools: ["Conversion Optimization", "Performance Tuning", "Feature Enhancement"],
      },
    ],
    deliverables: ["Launch Plan", "Analytics Reports", "Optimization Recommendations"],
    collaboration: "Regular reviews, performance reports, and strategic adjustments",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function MethodologySection() {
  const [activePhase, setActivePhase] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const inView = useInView(processRef, { once: true, margin: "-100px" });

  const active = methodology[activePhase];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsInView(true);
      },
      { threshold: 0.05, rootMargin: "100px" },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (typeof window !== "undefined" && window.innerWidth < 768) setIsInView(true);
    return () => observer.disconnect();
  }, []);

  /* auto-advance */
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % methodology.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="methodology"
      ref={sectionRef}
      style={{
        padding: "clamp(3rem, 8vw, 6rem) 1.5rem",
        background: "#FCFCFB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring" as const, stiffness: 300 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(229,62,62,0.06)",
              padding: "4px 14px",
              marginBottom: "1rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "9px", letterSpacing: "0.2em", color: "#E53E3E", textTransform: "uppercase", fontWeight: 600 }}>
              Our Methodology
            </span>
          </motion.div>

          <h2
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.75rem",
              lineHeight: 1,
            }}
          >
            The <span style={{ color: "#E53E3E" }}>Integrated Approach</span>
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1rem",
              color: "rgba(0,0,0,0.5)",
              maxWidth: 580,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Our battle-tested methodology seamlessly combines marketing strategy with technical execution.
            One team, one process, delivering complete digital transformation.
          </p>
        </motion.div>

        {/* Phase Navigation Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {methodology.map((phase, idx) => (
            <motion.button
              key={phase.id}
              onClick={() => setActivePhase(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "10px 20px",
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: activePhase === idx ? "1px solid #E53E3E" : "1px solid rgba(0,0,0,0.08)",
                borderLeft: activePhase === idx ? "3px solid #E53E3E" : "1px solid rgba(0,0,0,0.08)",
                background: activePhase === idx ? "#E53E3E" : "#FFFFFF",
                color: activePhase === idx ? "#FFFFFF" : "rgba(0,0,0,0.55)",
                boxShadow: activePhase === idx ? "0 4px 16px rgba(229,62,62,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.3s",
              }}
            >
              <phase.icon size={16} />
              <span>Phase {idx + 1}</span>
            </motion.button>
          ))}
        </div>

        {/* Active Phase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Gradient Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #E53E3E 0%, #1a1a1a 100%)",
                padding: "2rem 2.5rem",
                color: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Shimmer */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" as const }}
              />

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                    }}
                  >
                    <active.icon size={24} style={{ color: "#FFFFFF" }} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                        margin: "0 0 0.25rem",
                      }}
                    >
                      {active.phase}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.8)",
                        margin: 0,
                      }}
                    >
                      {active.subtitle}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Duration
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "1rem",
                      color: "#FFFFFF",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {active.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "2rem 2.5rem" }}>
              <div style={{ display: "grid", gap: "2rem" }} className="grid-cols-1 lg:grid-cols-2">
                {/* Process Steps via Accordion */}
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "1.1rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 1rem",
                    }}
                  >
                    Process Steps
                  </h4>
                  <Accordion
                    items={active.steps.map((step) => ({
                      q: step.title,
                      a: `${step.description}\n\nTools & Methods: ${step.tools.join(", ")}`,
                    }))}
                  />
                </div>

                {/* Deliverables & Collaboration */}
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "1.1rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 1rem",
                    }}
                  >
                    Key Deliverables
                  </h4>
                  <div
                    style={{
                      background: "rgba(229,62,62,0.03)",
                      border: "1px solid rgba(229,62,62,0.08)",
                      padding: "1.25rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {active.deliverables.map((d, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontFamily: "Helvetica Neue, sans-serif",
                            fontSize: "0.85rem",
                            color: "rgba(0,0,0,0.6)",
                          }}
                        >
                          <span style={{ color: "#E53E3E", fontSize: "14px" }}>&#10003;</span>
                          {d}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <h4
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "1.1rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 1rem",
                    }}
                  >
                    Client Collaboration
                  </h4>
                  <div
                    style={{
                      background: "rgba(229,62,62,0.03)",
                      border: "1px solid rgba(229,62,62,0.08)",
                      padding: "1.25rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E53E3E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: 2 }}
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <p
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "0.85rem",
                        color: "rgba(0,0,0,0.55)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {active.collaboration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* End-to-End Process Flow Visualization */}
        <div ref={processRef} style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "1.1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#111111",
              marginBottom: "1.5rem",
            }}
          >
            End-to-End Digital Journey
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            {methodology.map((phase, idx) => (
              <div key={phase.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setActivePhase(idx)}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={inView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ type: "spring" as const, stiffness: 100, delay: idx * 0.1 }}
                  style={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "none",
                    borderRadius: 2,
                    background: idx <= activePhase ? "#E53E3E" : "rgba(0,0,0,0.06)",
                    color: idx <= activePhase ? "#FFFFFF" : "rgba(0,0,0,0.4)",
                    boxShadow: idx <= activePhase ? "0 2px 12px rgba(229,62,62,0.3)" : "none",
                    transition: "all 0.3s",
                  }}
                >
                  <phase.icon size={18} />
                </motion.button>
                {idx < methodology.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                    style={{
                      width: 32,
                      height: 2,
                      background: idx < activePhase ? "#E53E3E" : "rgba(0,0,0,0.08)",
                      transition: "background 0.3s",
                      transformOrigin: "left",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
