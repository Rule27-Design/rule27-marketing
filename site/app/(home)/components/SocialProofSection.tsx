"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  Award as AwardIcon,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/app/components/Card";
import type {
  Testimonial,
  Award,
  Partnership,
  HomePageStats,
} from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Static fallbacks (mirrors old component)
// ---------------------------------------------------------------------------

const FALLBACK_TESTIMONIALS: (Testimonial & {
  industry?: string;
  project_value?: string;
})[] = [
  {
    id: "1",
    client_name: "Sarah Chen",
    client_title: "CEO & Founder",
    client_company: "TechFlow Solutions",
    client_avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    quote:
      "Rule27 Design didn\u2019t just redesign our brand\u2014they reimagined our entire market position. The 712% conversion rate increase speaks for itself.",
    rating: 5,
    is_featured: true,
    status: "published",
    sort_order: 1,
    industry: "SaaS Technology",
    project_value: "$2.5M Revenue Impact",
  },
];

const FALLBACK_AWARDS: Award[] = [
  {
    id: "1",
    title: "Best Creative Agency 2024",
    organization: "Design Excellence Awards",
    year: 2024,
    description: null,
    image: null,
    url: null,
    is_active: true,
  },
  {
    id: "2",
    title: "Innovation in Digital Marketing",
    organization: "Marketing Leadership Council",
    year: 2024,
    description: null,
    image: null,
    url: null,
    is_active: true,
  },
];

const FALLBACK_PARTNERSHIPS: Partnership[] = [
  {
    id: "1",
    name: "Adobe Creative Partner",
    logo: null,
    url: null,
    description: null,
    tier: null,
    is_featured: true,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "2",
    name: "Google Premier Partner",
    logo: null,
    url: null,
    description: null,
    tier: null,
    is_featured: true,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "3",
    name: "Shopify Plus Partner",
    logo: null,
    url: null,
    description: null,
    tier: null,
    is_featured: true,
    is_active: true,
    sort_order: 3,
  },
  {
    id: "4",
    name: "HubSpot Solutions Partner",
    logo: null,
    url: null,
    description: null,
    tier: null,
    is_featured: true,
    is_active: true,
    sort_order: 4,
  },
];

const FALLBACK_STATS: HomePageStats = {
  satisfaction: "98%",
  projects: "150+",
  growth: "500%",
  awards: "25+",
};

// ---------------------------------------------------------------------------
// Star rating
// ---------------------------------------------------------------------------

function RenderStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          style={{
            color: i < rating ? "#FBBF24" : "#D1D5DB",
            fill: i < rating ? "#FBBF24" : "none",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  testimonials: Testimonial[];
  awards: Award[];
  partnerships: Partnership[];
  stats: HomePageStats;
}

// ---------------------------------------------------------------------------
// SocialProofSection
// ---------------------------------------------------------------------------

export default function SocialProofSection({
  testimonials,
  awards,
  partnerships,
  stats,
}: Props) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const displayAwards = awards.length > 0 ? awards : FALLBACK_AWARDS;
  const displayPartnerships =
    partnerships.length > 0 ? partnerships : FALLBACK_PARTNERSHIPS;
  const displayStats = stats ?? FALLBACK_STATS;

  // IntersectionObserver
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

  // Auto-rotate testimonials every 6s
  useEffect(() => {
    if (!isVisible || displayTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % displayTestimonials.length
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [isVisible, displayTestimonials.length]);

  const currentT = displayTestimonials[currentTestimonial] as Testimonial & {
    industry?: string;
    project_value?: string;
  };

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{
        background: "linear-gradient(to bottom, var(--color-muted), #FFFFFF)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-16">
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.25rem, 5vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-foreground)",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
            }}
          >
            Trusted by Industry
            <span
              style={{
                color: "var(--color-accent)",
                display: "block",
                marginTop: "0.5rem",
                fontFamily: "var(--font-heading)",
                textTransform: "uppercase",
              }}
            >
              Leaders Worldwide
            </span>
          </h2>
          <p
            className="max-w-3xl mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.25rem",
              color: "rgba(0,0,0,0.5)",
              lineHeight: 1.6,
            }}
          >
            Don&apos;t just take our word for it. See what visionary leaders say
            about their transformation journey with Rule27 Design.
          </p>
        </div>

        {/* ── Main Testimonial Card ── */}
        {displayTestimonials.length > 0 && (
          <div className="mb-16">
            <div
              className="max-w-4xl mx-auto"
              style={{
                background: "#FFFFFF",
                borderRadius: "1rem",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.1), 0 0 20px rgba(229,62,62,0.08)",
                padding: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentT.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-3 gap-8 items-center"
                >
                  {/* Left: Client Info */}
                  <div className="text-center md:text-left">
                    <div
                      className="relative inline-block mb-4"
                      style={{ width: 80, height: 80 }}
                    >
                      {currentT.client_avatar ? (
                        <Image
                          src={currentT.client_avatar}
                          alt={currentT.client_name}
                          width={80}
                          height={80}
                          className="object-cover"
                          style={{ borderRadius: "50%" }}
                        />
                      ) : (
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "rgba(229,62,62,0.08)",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-heading)",
                              fontSize: "1.5rem",
                              color: "var(--color-accent)",
                            }}
                          >
                            {currentT.client_name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          bottom: -8,
                          right: -8,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--color-accent)",
                        }}
                      >
                        <Quote size={16} style={{ color: "#FFFFFF" }} />
                      </div>
                    </div>
                    <h4
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-foreground)",
                        fontSize: "1.125rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {currentT.client_name}
                    </h4>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        color: "rgba(0,0,0,0.5)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {currentT.client_title}
                    </p>
                    {currentT.client_company && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "var(--color-accent)",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {currentT.client_company}
                      </p>
                    )}
                    <div className="flex justify-center md:justify-start gap-1 mb-3">
                      <RenderStars rating={currentT.rating || 5} />
                    </div>
                    {currentT.industry && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.75rem",
                          color: "rgba(0,0,0,0.5)",
                        }}
                      >
                        {currentT.industry}
                      </div>
                    )}
                  </div>

                  {/* Right: Testimonial Content (col-span-2) */}
                  <div className="md:col-span-2">
                    <blockquote
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
                        fontStyle: "italic",
                        color: "var(--color-foreground)",
                        lineHeight: 1.625,
                        marginBottom: "1.5rem",
                      }}
                    >
                      &ldquo;{currentT.quote}&rdquo;
                    </blockquote>
                    {currentT.project_value && (
                      <div
                        style={{
                          background: "rgba(229,62,62,0.05)",
                          borderRadius: "0.5rem",
                          padding: "1rem",
                          borderLeft: "4px solid var(--color-accent)",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.875rem",
                            color: "rgba(0,0,0,0.5)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Project Impact:
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--color-accent)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {currentT.project_value}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot Navigation */}
            {displayTestimonials.length > 1 && (
              <div className="flex justify-center mt-8 gap-3">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className="transition-all duration-300"
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      background:
                        index === currentTestimonial
                          ? "var(--color-accent)"
                          : "#D1D5DB",
                      transform:
                        index === currentTestimonial
                          ? "scale(1.25)"
                          : "scale(1)",
                    }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Stats Grid — R27StatCard pattern ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: displayStats.satisfaction, label: "Client Satisfaction", change: "+12%" },
            { value: displayStats.projects, label: "Projects Completed", change: "+34" },
            { value: displayStats.growth, label: "Average Growth", change: "+18.7%" },
            { value: displayStats.awards, label: "Industry Awards", change: "+5" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "1.25rem",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                borderTop: "2px solid #E53E3E",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "60px",
                  height: "60px",
                  background: "radial-gradient(circle, rgba(229,62,62,0.03) 0%, transparent 70%)",
                }}
              />
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "rgba(0,0,0,0.45)",
                  textTransform: "uppercase",
                  margin: "0 0 0.5rem 0",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "32px",
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "11px",
                  color: "#00b450",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {stat.change}
              </span>
            </div>
          ))}
        </div>

        {/* ── Awards & Recognition ── */}
        {displayAwards.length > 0 && (
          <div className="mb-16">
            <h3
              className="text-center mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-foreground)",
              }}
            >
              Industry Recognition &amp; Awards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayAwards.map((award) => (
                <Card key={award.id} label={award.year ? String(award.year) : "AWARD"} title={award.title}>
                  {award.organization && (
                    <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "12px", color: "rgba(0,0,0,0.5)", marginTop: "0.5rem" }}>
                      {award.organization}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Strategic Partnerships ── */}
        {displayPartnerships.length > 0 && (
          <div className="mb-16">
            <h3
              className="text-center mb-8"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-foreground)",
              }}
            >
              Strategic Technology Partners
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayPartnerships.map((partner) => (
                <Card key={partner.id} label="PARTNER" title={partner.name}>
                  <div className="flex items-center justify-center" style={{ marginTop: "0.75rem" }}>
                    {partner.logo ? (
                      <div style={{ position: "relative", width: 100, height: 40 }}>
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          sizes="100px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "rgba(229,62,62,0.08)",
                          border: "1px solid rgba(229,62,62,0.15)",
                        }}
                      >
                        <span style={{ fontFamily: "'Steelfish', 'Impact', sans-serif", fontSize: "1.25rem", color: "#E53E3E", textTransform: "uppercase" }}>
                          {partner.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div
          className="text-center"
          style={{
            background: "var(--color-foreground)",
            borderRadius: "1rem",
            padding: "3rem",
            color: "#FFFFFF",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.875rem, 4vw, 1.875rem)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Join the Success Stories
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.25rem",
              opacity: 0.9,
              marginBottom: "2rem",
            }}
          >
            Ready to become our next transformation success story?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/case-studies">
              <button
                className="inline-flex items-center gap-2 transition-colors duration-300"
                style={{
                  background: "#FFFFFF",
                  color: "var(--color-foreground)",
                  padding: "1rem 2rem",
                  borderRadius: "0.5rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F3F4F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                }}
              >
                <Eye size={20} />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  View All Case Studies
                </span>
              </button>
            </Link>
            <Link href="/contact">
              <button
                className="inline-flex items-center gap-2 transition-all duration-300"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  padding: "1rem 2rem",
                  borderRadius: "0.5rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  border: "2px solid #FFFFFF",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.color = "var(--color-foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
              >
                <MessageCircle size={20} />
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Start Your Journey
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
