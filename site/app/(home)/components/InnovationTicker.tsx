"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  TrendingUp,
  Lightbulb,
  Handshake,
  BookOpen,
  Target,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Innovation item data
// ---------------------------------------------------------------------------

interface InnovationItem {
  id: number;
  type: string;
  icon: LucideIcon;
  title: string;
  description: string;
  date: string;
  category: string;
  color: string;
  bgColor: string;
}

const innovations: InnovationItem[] = [
  {
    id: 1,
    type: "award",
    icon: Award,
    title: "Best Creative Agency 2024",
    description:
      "Recognized by Design Excellence Awards for outstanding creative innovation",
    date: "2024-08-15",
    category: "Recognition",
    color: "#CA8A04",
    bgColor: "rgba(254,252,232,1)",
  },
  {
    id: 2,
    type: "achievement",
    icon: TrendingUp,
    title: "500% Client Growth Rate",
    description:
      "Average revenue increase achieved across our client portfolio this quarter",
    date: "2024-08-10",
    category: "Performance",
    color: "#16A34A",
    bgColor: "rgba(240,253,244,1)",
  },
  {
    id: 3,
    type: "innovation",
    icon: Lightbulb,
    title: "AI-Powered Design System",
    description:
      "Launched proprietary AI tool that reduces design iteration time by 60%",
    date: "2024-08-05",
    category: "Technology",
    color: "#9333EA",
    bgColor: "rgba(250,245,255,1)",
  },
  {
    id: 4,
    type: "partnership",
    icon: Handshake,
    title: "Strategic Partnership with Adobe",
    description:
      "Exclusive collaboration to develop next-generation creative workflows",
    date: "2024-07-28",
    category: "Partnership",
    color: "#2563EB",
    bgColor: "rgba(239,246,255,1)",
  },
  {
    id: 5,
    type: "thought-leadership",
    icon: BookOpen,
    title: 'Published "Future of Brand Design"',
    description:
      "Industry whitepaper downloaded 1,000+ times in first week",
    date: "2024-07-20",
    category: "Thought Leadership",
    color: "#4F46E5",
    bgColor: "rgba(238,242,255,1)",
  },
  {
    id: 6,
    type: "client-success",
    icon: Target,
    title: "Client Achieves Unicorn Status",
    description:
      "TechFlow Solutions reaches $1B valuation after our complete rebrand",
    date: "2024-07-15",
    category: "Client Success",
    color: "#E53E3E",
    bgColor: "rgba(254,242,242,1)",
  },
];

// ---------------------------------------------------------------------------
// Quick stats
// ---------------------------------------------------------------------------

const quickStats = [
  { value: "25+", label: "Awards Won" },
  { value: "500%", label: "Avg Growth" },
  { value: "150+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
];

// ---------------------------------------------------------------------------
// Date formatter
// ---------------------------------------------------------------------------

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// InnovationTicker Component
// ---------------------------------------------------------------------------

export default function InnovationTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // IntersectionObserver to track visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance every 4s when visible
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % innovations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const current = innovations[currentIndex];
  const CurrentIcon = current.icon;

  // Doubled array for seamless marquee
  const marqueeItems = [...innovations, ...innovations];

  return (
    <section
      ref={sectionRef}
      className="py-16 overflow-hidden"
      style={{
        background: "linear-gradient(to right, #111827, #000000, #111827)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: "var(--color-accent)",
                animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.875rem",
                color: "var(--color-accent)",
              }}
            >
              Live Innovation Feed
            </span>
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: "var(--color-accent)",
                animation:
                  "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite 0.5s",
              }}
            />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.875rem, 4vw, 2.25rem)",
              fontWeight: 400,
              color: "#FFFFFF",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Real-Time Excellence Updates
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              color: "#D1D5DB",
              lineHeight: 1.6,
            }}
          >
            Stay connected to our latest achievements, innovations, and industry
            recognition as we continue pushing creative boundaries.
          </p>
        </div>

        {/* ── Main Ticker Display ── */}
        <div className="relative">
          {/* Current Innovation Card */}
          <div
            className="mb-8 p-8"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(4px)",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Left: Current Innovation (col-span-2) */}
              <div className="md:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div
                      className="flex-shrink-0 p-3 rounded-lg"
                      style={{ background: current.bgColor }}
                    >
                      <CurrentIcon
                        size={24}
                        style={{ color: current.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: current.color,
                          }}
                        >
                          {current.category}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.875rem",
                            color: "#9CA3AF",
                          }}
                        >
                          {formatDate(current.date)}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "1.25rem",
                          fontWeight: 400,
                          color: "#FFFFFF",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {current.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          color: "#D1D5DB",
                          lineHeight: 1.625,
                        }}
                      >
                        {current.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Progress Indicators */}
              <div className="flex md:flex-col justify-center gap-2">
                {innovations.map((_, index) => (
                  <div
                    key={index}
                    className="transition-all duration-300"
                    style={{
                      height: "0.5rem",
                      width: "100%",
                      minWidth: "2rem",
                      borderRadius: "9999px",
                      background:
                        index === currentIndex
                          ? "var(--color-accent)"
                          : index < currentIndex
                          ? "rgba(229,62,62,0.5)"
                          : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Marquee Ticker Strip ── */}
          <div
            className="relative overflow-hidden mb-8 p-4"
            style={{
              background: "rgba(229,62,62,0.1)",
              borderRadius: "0.5rem",
            }}
          >
            <div
              className="flex gap-8"
              style={{
                animation: "r27-marquee 30s linear infinite",
                width: "max-content",
              }}
            >
              {marqueeItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Icon size={16} style={{ color: "var(--color-accent)" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "#FFFFFF",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.title}
                    </span>
                    <span style={{ color: "#9CA3AF" }}>&bull;</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Quick Stats Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                    color: "var(--color-accent)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "#D1D5DB",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── CTA Button ── */}
          <div className="text-center">
            <Link href="/innovation">
              <button
                className="inline-flex items-center gap-2 mx-auto transition-all duration-300"
                style={{
                  background: "var(--color-accent)",
                  color: "#FFFFFF",
                  padding: "1rem 2rem",
                  borderRadius: "0.5rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Lightbulb size={20} />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Explore Innovation Lab
                </span>
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Marquee keyframes ── */}
      <style>{`
        @keyframes r27-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
