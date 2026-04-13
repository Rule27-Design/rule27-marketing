"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card } from "@/app/components/Card";
import {
  Trophy,
  Shield,
  Clock,
  Eye,
  Lightbulb,
  Handshake,
  Users,
  Zap,
  DollarSign,
  Globe,
  Heart,
  TrendingUp,
  BookOpen,
  Brain,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  examples: string[];
}

const coreValues: CoreValue[] = [
  {
    id: 1,
    title: "Consistency & Excellence",
    description:
      "We deliver proven quality across both marketing and development. Every project, every time, excellence is our standard.",
    icon: Trophy,
    examples: [
      "Proven track record across 150+ projects",
      "Certified expertise in 10+ platforms",
      "Same high standards for marketing and development",
    ],
  },
  {
    id: 2,
    title: "Accountability",
    description:
      "We stand behind every line of code and every campaign we create. If something needs fixing, we own it and we fix it.",
    icon: Shield,
    examples: [
      "We fix issues, no questions asked",
      "Clear ownership of every deliverable",
      "Post-launch support and optimization included",
    ],
  },
  {
    id: 3,
    title: "Reliability",
    description:
      "Day or night, campaign launch or server emergency, we're the partner you can always count on.",
    icon: Clock,
    examples: [
      "24/7 support for critical issues",
      "On-time delivery, every time",
      "Consistent team you know and trust",
    ],
  },
  {
    id: 4,
    title: "Transparency",
    description:
      "No surprises, no hidden agendas. We believe in open, honest communication about timelines, budgets, and challenges.",
    icon: Eye,
    examples: [
      "Clear project visibility and reporting",
      "Honest feedback and recommendations",
      "Open communication about challenges and solutions",
    ],
  },
  {
    id: 5,
    title: "Innovation",
    description:
      "We combine marketing creativity with technical innovation to deliver solutions that set you apart from the competition.",
    icon: Lightbulb,
    examples: [
      "Cutting-edge marketing automation",
      "Custom technical solutions",
      "Always learning, always improving",
    ],
  },
  {
    id: 6,
    title: "Partnership",
    description:
      "We're not just another vendor. We're invested in your success as much as you are.",
    icon: Handshake,
    examples: [
      "Strategic guidance beyond the project",
      "Shared success metrics and KPIs",
      "Long-term relationships, not transactions",
    ],
  },
];

const cultureMedia = [
  {
    id: 1,
    title: "War Room Sessions",
    description: "Where marketing strategy meets technical architecture in collaborative planning.",
    category: "collaboration",
    icon: Users,
    imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=300&fit=crop",
    gradient: "linear-gradient(to top, rgba(59,130,246,0.9), rgba(168,85,247,0.7))",
    details:
      "Our war room sessions bring together marketers, developers, and strategists to align on project goals and create integrated solutions that deliver results.",
  },
  {
    id: 2,
    title: "Certification Celebrations",
    description: "Celebrating new platform certifications -- our commitment to continuous excellence.",
    category: "growth",
    icon: Trophy,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    gradient: "linear-gradient(to top, rgba(34,197,94,0.9), rgba(20,184,166,0.7))",
    details:
      "Every new certification represents our commitment to staying ahead of the curve. We celebrate these milestones as a team because expertise benefits everyone.",
  },
  {
    id: 3,
    title: "Marketing Meets Dev",
    description: "Our unique culture where creatives and developers work side by side.",
    category: "culture",
    icon: Heart,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    gradient: "linear-gradient(to top, rgba(229,62,62,0.9), rgba(239,68,68,0.7))",
    details:
      "Breaking down silos between marketing and development creates magic. Our integrated teams deliver solutions that are both beautiful and powerful.",
  },
  {
    id: 4,
    title: "Client Success Stories",
    description: "Celebrating client wins -- from campaign launches to platform deployments.",
    category: "success",
    icon: TrendingUp,
    imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=300&fit=crop",
    gradient: "linear-gradient(to top, rgba(234,179,8,0.9), rgba(249,115,22,0.7))",
    details:
      "Your success is our success. We celebrate every milestone, from successful campaign launches to complex technical deployments that transform businesses.",
  },
  {
    id: 5,
    title: "Platform Training",
    description: "Weekly sessions on new platforms -- from Salesforce to Shopify, AWS to Adobe.",
    category: "learning",
    icon: BookOpen,
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
    gradient: "linear-gradient(to top, rgba(168,85,247,0.9), rgba(236,72,153,0.7))",
    details:
      "Continuous learning is in our DNA. Weekly training sessions ensure our team stays certified and current with the latest platform capabilities.",
  },
  {
    id: 6,
    title: "Innovation Lab",
    description: "Testing new marketing tech and development frameworks before anyone else.",
    category: "innovation",
    icon: Brain,
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    gradient: "linear-gradient(to top, rgba(99,102,241,0.9), rgba(59,130,246,0.7))",
    details:
      "Our innovation lab is where we experiment with cutting-edge technologies, ensuring our clients always have access to the latest and greatest solutions.",
  },
];

const officePerks = [
  { icon: Trophy, title: "Certification Support", description: "Full coverage for platform certifications and training" },
  { icon: Users, title: "Cross-Training", description: "Marketers learn dev, developers learn marketing" },
  { icon: Zap, title: "Innovation Time", description: "20% time for experimental projects and learning" },
  { icon: DollarSign, title: "Performance Bonuses", description: "Rewards for certifications and project excellence" },
  { icon: Globe, title: "Remote Flexibility", description: "Work from anywhere with full support" },
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive benefits and mental health support" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function CultureShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<(typeof cultureMedia)[number] | null>(null);
  const [hoveredPerk, setHoveredPerk] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const inView = useInView(galleryRef, { once: true, margin: "-100px" });

  const active = coreValues[activeIdx];

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

  /* auto-advance values */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % coreValues.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="culture"
      ref={sectionRef}
      style={{
        padding: "clamp(3rem, 8vw, 6rem) 1.5rem",
        background: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle animated pattern */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: "radial-gradient(circle, #E53E3E 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "30px 30px"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" as const }}
      />

      <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "#E53E3E",
              textTransform: "uppercase",
              background: "rgba(229,62,62,0.06)",
              padding: "4px 14px",
              marginBottom: "1rem",
            }}
          >
            Our Culture
          </span>
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
            Where <span style={{ color: "#E53E3E" }}>Excellence</span> Thrives
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
            Our core values have guided us from day one. These principles, combined with our dual expertise
            in marketing and development, create a culture where both creativity and technical excellence flourish.
          </p>
        </motion.div>

        {/* ============================================================ */}
        {/* CORE VALUES SECTION                                          */}
        {/* ============================================================ */}
        <div style={{ marginBottom: "3.5rem" }}>
          {/* Value Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {coreValues.map((value, idx) => (
              <div key={value.id} onClick={() => setActiveIdx(idx)} style={{ cursor: "pointer" }}>
                <Card
                  label={`Value ${String(idx + 1).padStart(2, "0")}`}
                  title={value.title}
                  description={value.description}
                  className={activeIdx === idx ? "ring-active" : ""}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <value.icon size={24} style={{ color: "#E53E3E" }} />
                    <span
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "11px",
                        color: "#E53E3E",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {activeIdx === idx ? "Active" : "View Details"}
                    </span>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Expanded Value Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(229,62,62,0.03)",
                border: "1px solid rgba(229,62,62,0.1)",
                borderLeft: "3px solid #E53E3E",
                padding: "2rem",
              }}
            >
              <div style={{ display: "grid", gap: "2rem", alignItems: "center" }} className="grid-cols-1 lg:grid-cols-2">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <active.icon size={32} style={{ color: "#E53E3E" }} />
                    <h3
                      style={{
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#111111",
                        margin: 0,
                      }}
                    >
                      {active.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "1rem",
                      color: "rgba(0,0,0,0.55)",
                      lineHeight: 1.7,
                      margin: "0 0 1.25rem",
                    }}
                  >
                    {active.description}
                  </p>
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "0.9rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#111111",
                        marginBottom: "0.75rem",
                      }}
                    >
                      How We Live This:
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {active.examples.map((ex, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontFamily: "Helvetica Neue, sans-serif",
                            fontSize: "0.85rem",
                            color: "rgba(0,0,0,0.55)",
                          }}
                        >
                          <span style={{ color: "#E53E3E", fontSize: "14px" }}>&#10003;</span>
                          {ex}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 220,
                      background: "linear-gradient(135deg, rgba(229,62,62,0.06), rgba(229,62,62,0.02))",
                      border: "1px solid rgba(229,62,62,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
                    >
                      <active.icon size={56} style={{ color: "#E53E3E" }} />
                    </motion.div>
                    <span style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.8rem", color: "rgba(0,0,0,0.35)" }}>
                      Value in Action
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* CULTURE GALLERY - "Behind the Scenes"                        */}
        {/* ============================================================ */}
        <div ref={galleryRef} style={{ marginBottom: "3.5rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#111111",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Behind the Scenes
          </h3>

          <div
            style={{
              display: "grid",
              gap: "1rem",
            }}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {cultureMedia.map((media, index) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, type: "spring" as const, stiffness: 100 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedMedia(media)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 2,
                    height: 240,
                    backgroundImage: `url(${media.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.5s",
                  }}
                >
                  {/* Gradient overlay */}
                  <div style={{ position: "absolute", inset: 0, background: media.gradient, transition: "opacity 0.3s" }} />

                  {/* Content */}
                  <div
                    style={{
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "1.25rem",
                      zIndex: 1,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(4px)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <media.icon size={18} style={{ color: "#FFFFFF" }} />
                      </div>
                      <span
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(4px)",
                          color: "#FFFFFF",
                          padding: "3px 10px",
                          fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                          fontSize: "10px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {media.category}
                      </span>
                    </div>

                    <div>
                      <h4
                        style={{
                          fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                          fontSize: "1rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#FFFFFF",
                          margin: "0 0 0.25rem",
                        }}
                      >
                        {media.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.9)",
                          lineHeight: 1.4,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {media.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* OFFICE PERKS                                                  */}
        {/* ============================================================ */}
        <div>
          <h3
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#111111",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Why We Love Working Here
          </h3>

          <div
            style={{
              display: "grid",
              gap: "1rem",
            }}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {officePerks.map((perk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onMouseEnter={() => setHoveredPerk(index)}
                onMouseLeave={() => setHoveredPerk(null)}
                style={{
                  background: hoveredPerk === index ? "rgba(229,62,62,0.03)" : "#FCFCFB",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 2,
                  padding: "1.5rem",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <motion.div
                    style={{
                      width: 44,
                      height: 44,
                      background: hoveredPerk === index ? "#E53E3E" : "rgba(229,62,62,0.06)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s",
                    }}
                    animate={hoveredPerk === index ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <perk.icon size={20} style={{ color: hoveredPerk === index ? "#FFFFFF" : "#E53E3E" }} />
                  </motion.div>
                  <h4
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "0.85rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: 0,
                    }}
                  >
                    {perk.title}
                  </h4>
                </div>
                <p
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.8rem",
                    color: "rgba(0,0,0,0.5)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CULTURE MEDIA DETAIL MODAL                                    */}
        {/* ============================================================ */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: 50,
              }}
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring" as const, stiffness: 100 }}
                style={{
                  background: "#FFFFFF",
                  width: "100%",
                  maxWidth: 640,
                  maxHeight: "90vh",
                  overflowY: "auto",
                  borderRadius: 2,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Image Header */}
                <div
                  style={{
                    position: "relative",
                    height: 240,
                    backgroundImage: `url(${selectedMedia.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: selectedMedia.gradient }} />

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMedia(null)}
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 40,
                      height: 40,
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(4px)",
                      border: "none",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#FFFFFF",
                      fontSize: "20px",
                    }}
                  >
                    &#10005;
                  </motion.button>

                  {/* Title Overlay */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(4px)",
                        color: "#FFFFFF",
                        padding: "3px 10px",
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {selectedMedia.category}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      {selectedMedia.title}
                    </h3>
                  </div>
                </div>

                {/* Modal Content */}
                <div style={{ padding: "2rem" }}>
                  <h4
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "1rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    Overview
                  </h4>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.9rem",
                      color: "rgba(0,0,0,0.55)",
                      lineHeight: 1.7,
                      margin: "0 0 1.5rem",
                    }}
                  >
                    {selectedMedia.description}
                  </p>

                  <h4
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "1rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    Details
                  </h4>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.9rem",
                      color: "rgba(0,0,0,0.55)",
                      lineHeight: 1.7,
                      margin: "0 0 1.5rem",
                    }}
                  >
                    {selectedMedia.details}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMedia(null)}
                    style={{
                      width: "100%",
                      padding: "12px 24px",
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      background: "#E53E3E",
                      color: "#FFFFFF",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Back to Gallery
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
