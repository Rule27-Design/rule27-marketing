"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Compass, Link2, FolderOpen, Rocket, Brain, Lightbulb, Crown, type LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

const milestones: Milestone[] = [
  {
    year: "2014",
    title: "Founded as Rule27 Design",
    description:
      'Started as a Web Design & Marketing shop by rebels who believed agencies were playing it too safe. We asked: "What if creativity and technology had no limits?"',
    icon: Zap,
    gradient: "linear-gradient(135deg, #E53E3E, #f87171)",
  },
  {
    year: "2015",
    title: "The 27th Rule Philosophy",
    description:
      "Discovered our philosophy: while others follow 26 design principles, we write the 27th rule that breaks them all. Excellence through innovation became our mantra.",
    icon: Compass,
    gradient: "linear-gradient(135deg, #E53E3E, #fb923c)",
  },
  {
    year: "2017",
    title: "CRM & Marketing Automation",
    description:
      "Expanded into CRM implementations and marketing automation. Earned our first Salesforce certifications, marking our evolution into relationship architects.",
    icon: Link2,
    gradient: "linear-gradient(135deg, #3b82f6, #22d3ee)",
  },
  {
    year: "2019",
    title: "Full-Service Digital Agency",
    description:
      "Grew our team to provide comprehensive IT & Marketing consulting. Achieved AWS and Google Cloud certifications, becoming our clients' one-stop digital powerhouse.",
    icon: FolderOpen,
    gradient: "linear-gradient(135deg, #22c55e, #14b8a6)",
  },
  {
    year: "2020",
    title: "Enterprise Partnerships",
    description:
      "Secured partnerships with HubSpot, Adobe, and Microsoft Azure. Pivoted to serve enterprise clients during global digital transformation.",
    icon: Rocket,
    gradient: "linear-gradient(135deg, #E53E3E, #ec4899)",
  },
  {
    year: "2021",
    title: "AI & Advanced Technology",
    description:
      "Integrated AI and machine learning into our service offerings. Launched partnerships with Shopify and expanded our development capabilities.",
    icon: Brain,
    gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
  },
  {
    year: "2023",
    title: "Innovation Laboratory",
    description:
      "Established our R&D division, pushing boundaries between marketing creativity and technical innovation. Added Snowflake and advanced analytics partnerships.",
    icon: Lightbulb,
    gradient: "linear-gradient(135deg, #E53E3E, #a855f7)",
  },
  {
    year: "2025",
    title: "The Digital Powerhouse",
    description:
      "Today we stand as the complete digital partner -- 10+ platform certifications, 18+ strategic partnerships, delivering marketing excellence with technical precision.",
    icon: Crown,
    gradient: "linear-gradient(135deg, #E53E3E, #3b82f6)",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function OriginStory() {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(timelineRef, { once: true, margin: "-100px" });

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
      setActiveTimeline((prev) => (prev + 1) % milestones.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section
      id="origin-story"
      ref={sectionRef}
      style={{
        padding: "clamp(3rem, 8vw, 6rem) 1.5rem",
        background: "linear-gradient(180deg, #FCFCFB 0%, #FFFFFF 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05 }}>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 384,
            height: 384,
            background: "#E53E3E",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" as const }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 384,
            height: 384,
            background: "#1a1a1a",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" as const }}
        />
      </div>

      <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
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
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "9px", letterSpacing: "0.2em", color: "#E53E3E", textTransform: "uppercase" }}>
              Our Origin Story
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
            From <span style={{ color: "#E53E3E" }}>Rebellious Startup</span> to Digital Powerhouse
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1rem",
              color: "rgba(0,0,0,0.5)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Every revolution starts with a simple question: &ldquo;What if we did things differently?&rdquo;
            Here&apos;s how Rule27 Design evolved from a rebellious idea to a certified leader in both marketing and development.
          </p>
        </motion.div>

        {/* Alternating Timeline */}
        <div style={{ position: "relative" }} ref={timelineRef}>
          {/* Center vertical line (desktop) */}
          <div
            className="hidden md:block"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              width: 2,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                width: "100%",
                background: "linear-gradient(to bottom, #E53E3E, rgba(0,0,0,0.15))",
              }}
              initial={{ height: 0 }}
              animate={inView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 2, ease: "easeInOut" as const }}
            />
          </div>

          {/* Timeline Cards */}
          <motion.div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            variants={timelineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                }}
                className={`flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                onMouseEnter={() => setActiveTimeline(index)}
                onTouchStart={() => setActiveTimeline(index)}
              >
                {/* Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring" as const, stiffness: 300 }}
                  style={{ flex: 1, width: "100%" }}
                  className={index % 2 === 0 ? "md:pr-12" : "md:pl-12"}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 2,
                      padding: "1.5rem",
                      border: activeTimeline === index ? "1px solid rgba(229,62,62,0.4)" : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: activeTimeline === index
                        ? "0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(229,62,62,0.1)"
                        : "0 1px 4px rgba(0,0,0,0.04)",
                      transition: "all 0.5s",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Gradient overlay on active */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: milestone.gradient,
                        opacity: activeTimeline === index ? 0.05 : 0,
                        transition: "opacity 0.3s",
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <motion.div
                          style={{
                            width: 40,
                            height: 40,
                            background: milestone.gradient,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          animate={
                            activeTimeline === index
                              ? { scale: [1, 1.2, 1], rotate: [0, 360] }
                              : {}
                          }
                          transition={{ duration: 0.5 }}
                        >
                          <milestone.icon size={16} style={{ color: "#FFFFFF" }} />
                        </motion.div>
                        <motion.span
                          style={{
                            fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                            fontSize: "1.1rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#E53E3E",
                          }}
                          animate={activeTimeline === index ? { x: [0, 5, 0] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {milestone.year}
                        </motion.span>
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                          fontSize: "clamp(1rem, 2vw, 1.25rem)",
                          fontWeight: 400,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#111111",
                          margin: "0 0 0.5rem",
                          transition: "color 0.3s",
                        }}
                      >
                        {milestone.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "0.875rem",
                          color: "rgba(0,0,0,0.55)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Timeline Node (desktop) */}
                <motion.div
                  className="hidden md:flex"
                  style={{
                    width: 24,
                    height: 24,
                    background: "#E53E3E",
                    borderRadius: "50%",
                    border: "4px solid #FFFFFF",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 10,
                    position: "relative",
                    flexShrink: 0,
                  }}
                  animate={
                    activeTimeline === index
                      ? { scale: [1, 1.5, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "#E53E3E",
                      borderRadius: "50%",
                    }}
                    animate={
                      activeTimeline === index
                        ? { opacity: [0.5, 1, 0.5], scale: [1, 2, 1] }
                        : { opacity: 0 }
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Spacer (desktop) */}
                <div className="hidden md:block" style={{ flex: 1 }} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Philosophy Quote Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ marginTop: "3rem", textAlign: "center" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #E53E3E 0%, #1a1a1a 100%)",
              borderRadius: 2,
              padding: "2.5rem",
              color: "#FFFFFF",
              maxWidth: 720,
              margin: "0 auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated pattern overlay */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.08,
                backgroundImage: "radial-gradient(circle at 50% 50%, #FFFFFF 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
              animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" as const }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ margin: "0 auto 1rem", display: "block" }}
              >
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
              </svg>
              <h3
                style={{
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  margin: "0 0 1rem",
                }}
              >
                The 27th Rule Philosophy
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.7,
                  margin: "0 0 1.25rem",
                }}
              >
                &ldquo;While the industry follows 26 established principles, we believe in writing the 27th rule -- the one that
                breaks conventions and creates extraordinary from ordinary. We&apos;re not just another agency or dev shop.
                We&apos;re the digital powerhouse that delivers marketing brilliance with technical excellence, making us the
                only partner you&apos;ll ever need for complete digital transformation.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                    fontSize: "14px",
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  27
                </motion.div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                    }}
                  >
                    Rule27 Design Founders
                  </div>
                  <div style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)" }}>
                    Digital Innovators
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
