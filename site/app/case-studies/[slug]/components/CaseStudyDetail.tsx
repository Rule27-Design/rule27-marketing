"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/app/components/Card";
import { CaseStudyGSCHero } from "./CaseStudyGSCHero";
import type { CaseStudy } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CaseStudyDetailProps {
  study: CaseStudy;
  relatedStudies: CaseStudy[];
}

// ---------------------------------------------------------------------------
// Inline SVG Icons
// ---------------------------------------------------------------------------

function ChevronLeftIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ArrowLeftIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function EyeIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GitBranchIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function TrendingUpIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function MessageIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function StarIcon({ filled, size = 20, color = "currentColor" }: { filled: boolean; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function metricDisplay(metric: CaseStudy["keyMetrics"][0]): string {
  if (metric.improvement) return metric.improvement;
  if (metric.after) return metric.after;
  if (metric.value !== undefined) {
    switch (metric.type) {
      case "percentage":
        return `+${metric.value}%`;
      case "currency":
        return `$${metric.value.toLocaleString()}`;
      case "multiplier":
        return `${metric.value}x`;
      default:
        return String(metric.value);
    }
  }
  return "";
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const TABS = [
  { id: "overview" as const, label: "Overview", Icon: EyeIcon },
  { id: "process" as const, label: "Process", Icon: GitBranchIcon },
  { id: "results" as const, label: "Results", Icon: TrendingUpIcon },
  { id: "testimonial" as const, label: "Testimonial", Icon: MessageIcon },
];

type TabId = "overview" | "process" | "results" | "testimonial";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CaseStudyDetail({
  study,
  relatedStudies,
}: CaseStudyDetailProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const gallery =
    study.gallery.length > 0 ? study.gallery : [study.heroImage];

  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );

  // OLG-style case studies render the live GSC graph as the hero
  // (sourced from /lib/gsc-data/) instead of an image gallery. Triggered
  // by `custom_fields.gsc_slug` on the case_studies row.
  const useGscHero = !!study.gscSlug;

  return (
    <div className="min-h-screen" style={{ background: "#FCFCFB" }}>
      {/* ================================================================== */}
      {/* HERO — GSC graph variant OR image gallery                          */}
      {/* ================================================================== */}
      {useGscHero ? (
        <CaseStudyGSCHero
          gscSlug={study.gscSlug as string}
          title={study.title}
          client={study.client}
          industry={study.industry}
          serviceType={study.serviceType}
        />
      ) : (
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={gallery[currentImageIndex]}
              alt={`${study.title} image ${currentImageIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3))",
          }}
        />

        {/* Gallery Navigation */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 transition-colors"
              style={{
                color: "#FFFFFF",
                background: "rgba(255,255,255,0.15)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
              aria-label="Previous image"
            >
              <ChevronLeftIcon size={24} color="#FFFFFF" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 transition-colors"
              style={{
                color: "#FFFFFF",
                background: "rgba(255,255,255,0.15)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
              aria-label="Next image"
            >
              <ChevronRightIcon size={24} color="#FFFFFF" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className="rounded-full transition-all"
                  style={{
                    height: "8px",
                    width: idx === currentImageIndex ? "24px" : "8px",
                    background:
                      idx === currentImageIndex
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.5)",
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Title Overlay */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {study.industry}
              </span>
              <span
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  background: "rgba(229,62,62,0.8)",
                  backdropFilter: "blur(8px)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {study.serviceType}
              </span>
              {study.featured && (
                <span
                  className="px-3 py-1 text-xs rounded-full flex items-center gap-1"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <StarIcon filled size={12} color="#FFFFFF" />
                  Featured
                </span>
              )}
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl mb-2"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {study.title}
            </h1>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.9)" }}>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {study.client}
              </span>
              {study.businessStage && (
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  {" "}
                  &bull; {study.businessStage}
                </span>
              )}
            </p>
          </div>
        </div>
      </section>
      )}

      {/* ================================================================== */}
      {/* KEY METRICS BAR                                                    */}
      {/* ================================================================== */}
      {study.keyMetrics.length > 0 && (
        <section className="py-6" style={{ background: "#111111" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {study.keyMetrics.slice(0, 6).map((metric, index) => (
                <div key={index} className="text-center">
                  <div
                    className="text-2xl mb-1"
                    style={{
                      color: "#E53E3E",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {metricDisplay(metric)}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* TAB NAVIGATION (Sticky)                                            */}
      {/* ================================================================== */}
      <div
        className="sticky top-[60px] z-40"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto -mb-px">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              // Hide testimonial tab if there is no testimonial
              if (tab.id === "testimonial" && !study.testimonial) return null;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors"
                  style={{
                    borderBottom: `2px solid ${isActive ? "#E53E3E" : "transparent"}`,
                    color: isActive ? "#E53E3E" : "rgba(0,0,0,0.4)",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "0.8125rem",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#111111";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = "rgba(0,0,0,0.4)";
                  }}
                >
                  <tab.Icon
                    size={18}
                    color={isActive ? "#E53E3E" : "currentColor"}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* TAB CONTENT + SIDEBAR                                              */}
      {/* ================================================================== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Main Content ── */}
            <div className="lg:col-span-2">
              {/* Gallery (inline, below tabs) */}
              {gallery.length > 1 && (
                <div className="relative rounded-xl overflow-hidden mb-10 h-64 sm:h-80 md:h-96">
                  <Image
                    src={gallery[currentImageIndex]}
                    alt={`${study.title} gallery image ${currentImageIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,0.6)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,0.4)")
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon size={20} color="#FFFFFF" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,0.6)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,0.4)")
                    }
                    aria-label="Next image"
                  >
                    <ChevronRightIcon size={20} color="#FFFFFF" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {gallery.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className="rounded-full transition-all"
                        style={{
                          height: "8px",
                          width: idx === currentImageIndex ? "24px" : "8px",
                          background:
                            idx === currentImageIndex
                              ? "#FFFFFF"
                              : "rgba(255,255,255,0.5)",
                        }}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Overview Tab ── */}
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-10"
                  >
                    {study.challenge && (
                      <div>
                        <h2
                          className="text-2xl mb-4"
                          style={{
                            color: "#111111",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          The Challenge
                        </h2>
                        <p
                          className="leading-relaxed"
                          style={{ color: "rgba(0,0,0,0.55)" }}
                        >
                          {study.challenge}
                        </p>
                      </div>
                    )}
                    {study.solution && (
                      <div>
                        <h2
                          className="text-2xl mb-4"
                          style={{
                            color: "#111111",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Our Solution
                        </h2>
                        <p
                          className="leading-relaxed"
                          style={{ color: "rgba(0,0,0,0.55)" }}
                        >
                          {study.solution}
                        </p>
                      </div>
                    )}
                    {study.implementation && (
                      <div>
                        <h2
                          className="text-2xl mb-4"
                          style={{
                            color: "#111111",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          Implementation
                        </h2>
                        <p
                          className="leading-relaxed"
                          style={{ color: "rgba(0,0,0,0.55)" }}
                        >
                          {study.implementation}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Process Tab ── */}
                {activeTab === "process" && (
                  <motion.div
                    key="process"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2
                      className="text-2xl mb-6"
                      style={{
                        color: "#111111",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Our Methodology
                    </h2>
                    {study.processSteps.length > 0 ? (
                      <div className="space-y-6">
                        {study.processSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.1,
                            }}
                            className="flex gap-4"
                          >
                            {/* Step Number Circle */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: "#E53E3E",
                                  color: "#FFFFFF",
                                  fontFamily: "var(--font-heading)",
                                  fontSize: "1rem",
                                }}
                              >
                                {index + 1}
                              </div>
                              {/* Connecting line */}
                              {index < study.processSteps.length - 1 && (
                                <div
                                  className="w-0.5 flex-1 mt-2"
                                  style={{
                                    background:
                                      "linear-gradient(to bottom, #E53E3E, rgba(229,62,62,0.1))",
                                    minHeight: "20px",
                                  }}
                                />
                              )}
                            </div>
                            <div className="pb-6">
                              <h3
                                className="text-lg mb-2"
                                style={{
                                  color: "#111111",
                                  fontFamily: "var(--font-heading)",
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                }}
                              >
                                {step.title}
                              </h3>
                              <p style={{ color: "rgba(0,0,0,0.55)" }}>
                                {step.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "rgba(0,0,0,0.4)" }}>
                        Process details coming soon.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* ── Results Tab ── */}
                {activeTab === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2
                      className="text-2xl mb-6"
                      style={{
                        color: "#111111",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Measurable Impact
                    </h2>

                    {/* Key Metrics using StatCard */}
                    {study.keyMetrics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {study.keyMetrics.map((metric, i) => (
                          <StatCard
                            key={i}
                            label={metric.label || ""}
                            value={metricDisplay(metric)}
                            change={
                              metric.before && metric.after
                                ? `${metric.before} -> ${metric.after}`
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    )}

                    {/* Detailed Results */}
                    {study.detailedResults.length > 0 && (
                      <div className="space-y-4">
                        {study.detailedResults.map((result, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: i * 0.08,
                            }}
                            className="p-6 rounded-xl"
                            style={{
                              border: "1px solid #E5E7EB",
                              background: "#FFFFFF",
                            }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className="text-lg"
                                style={{
                                  color: "#111111",
                                  fontFamily: "var(--font-heading)",
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                }}
                              >
                                {result.title || result.metric}
                              </span>
                            </div>
                            <p style={{ color: "rgba(0,0,0,0.55)" }}>
                              {result.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {study.keyMetrics.length === 0 &&
                      study.detailedResults.length === 0 && (
                        <p style={{ color: "rgba(0,0,0,0.4)" }}>
                          Results details coming soon.
                        </p>
                      )}
                  </motion.div>
                )}

                {/* ── Testimonial Tab ── */}
                {activeTab === "testimonial" && study.testimonial && (
                  <motion.div
                    key="testimonial"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8 text-center py-8"
                  >
                    {/* Avatar */}
                    {study.testimonial.avatar && (
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden relative">
                        <Image
                          src={study.testimonial.avatar}
                          alt={study.testimonial.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Star Rating */}
                    {study.testimonial.rating > 0 && (
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            filled={i < study.testimonial!.rating}
                            size={24}
                            color={
                              i < study.testimonial!.rating
                                ? "#E53E3E"
                                : "#E5E7EB"
                            }
                          />
                        ))}
                      </div>
                    )}

                    {/* Quote */}
                    <blockquote
                      className="text-xl sm:text-2xl italic max-w-2xl mx-auto leading-relaxed"
                      style={{ color: "#111111" }}
                    >
                      &ldquo;{study.testimonial.quote}&rdquo;
                    </blockquote>

                    {/* Client Info */}
                    <div>
                      <div
                        className="text-lg"
                        style={{
                          color: "#111111",
                          fontFamily: "var(--font-heading)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {study.testimonial.name}
                      </div>
                      <div style={{ color: "rgba(0,0,0,0.5)" }}>
                        {study.testimonial.position}
                      </div>
                      <div
                        className="text-sm mt-0.5"
                        style={{
                          color: "rgba(0,0,0,0.4)",
                          fontFamily: "var(--font-heading)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {study.client}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-[130px] space-y-8">
                {/* Project Details Card */}
                <div
                  className="rounded-xl p-6"
                  style={{ background: "#F8F9FA" }}
                >
                  <h3
                    className="text-lg mb-4"
                    style={{
                      color: "#111111",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Project Details
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt style={{ color: "rgba(0,0,0,0.5)" }}>Timeline</dt>
                      <dd
                        style={{
                          color: "#111111",
                          fontFamily: "var(--font-heading)",
                          textTransform: "uppercase",
                        }}
                      >
                        {study.duration}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt style={{ color: "rgba(0,0,0,0.5)" }}>Industry</dt>
                      <dd
                        style={{
                          color: "#111111",
                          fontFamily: "var(--font-heading)",
                          textTransform: "uppercase",
                        }}
                      >
                        {study.industry}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt style={{ color: "rgba(0,0,0,0.5)" }}>Service</dt>
                      <dd
                        style={{
                          color: "#111111",
                          fontFamily: "var(--font-heading)",
                          textTransform: "uppercase",
                        }}
                      >
                        {study.serviceType}
                      </dd>
                    </div>
                    {study.companySize && (
                      <div className="flex justify-between">
                        <dt style={{ color: "rgba(0,0,0,0.5)" }}>
                          Company Size
                        </dt>
                        <dd style={{ color: "#111111" }}>
                          {study.companySize}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {/* Technologies */}
                  {study.technologiesUsed.length > 0 && (
                    <div
                      className="mt-5 pt-4"
                      style={{ borderTop: "1px solid #E5E7EB" }}
                    >
                      <h4
                        className="text-xs mb-2"
                        style={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {study.technologiesUsed.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs rounded-md"
                            style={{
                              background: "#FFFFFF",
                              color: "rgba(0,0,0,0.6)",
                              border: "1px solid #E5E7EB",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables */}
                  {study.deliverables.length > 0 && (
                    <div
                      className="mt-5 pt-4"
                      style={{ borderTop: "1px solid #E5E7EB" }}
                    >
                      <h4
                        className="text-xs mb-2"
                        style={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        Deliverables
                      </h4>
                      <ul className="space-y-1.5">
                        {study.deliverables.map((d, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs"
                            style={{ color: "rgba(0,0,0,0.6)" }}
                          >
                            <span className="flex-shrink-0 mt-0.5">
                              <CheckIcon size={14} color="#E53E3E" />
                            </span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA Card */}
                <div
                  className="rounded-xl p-6"
                  style={{ background: "#E53E3E" }}
                >
                  <h3
                    className="text-lg mb-3"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Start Your Project
                  </h3>
                  <p
                    className="text-sm mb-5 leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    Ready to achieve similar results for your business?
                  </p>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-md text-sm transition-colors"
                    style={{
                      background: "#FFFFFF",
                      color: "#E53E3E",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.9)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#FFFFFF")
                    }
                  >
                    Get Started
                    <ArrowRightIcon size={16} color="#E53E3E" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* RELATED CASE STUDIES                                               */}
      {/* ================================================================== */}
      {relatedStudies.length > 0 && (
        <section className="py-12" style={{ background: "#F8F9FA" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="block"
                style={{
                  width: "40px",
                  height: "2px",
                  background: "#E53E3E",
                }}
              />
              <span
                className="text-xs"
                style={{
                  color: "#E53E3E",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                More Work
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl mb-8"
              style={{
                color: "#111111",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Related Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedStudies.map((rs) => (
                <Link
                  key={rs.id}
                  href={`/case-studies/${rs.slug}`}
                  className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "#FFFFFF",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.06), 0 0 6px rgba(229,62,62,0.12)",
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={rs.heroImage}
                      alt={rs.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs"
                        style={{
                          color: "#E53E3E",
                          fontFamily: "var(--font-heading)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {rs.industry}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(0,0,0,0.2)" }}
                      >
                        &bull;
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(0,0,0,0.4)" }}
                      >
                        {rs.serviceType}
                      </span>
                    </div>
                    <h3
                      className="text-lg mb-1 line-clamp-2 transition-colors group-hover:text-[#E53E3E]"
                      style={{
                        color: "#111111",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {rs.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: "rgba(0,0,0,0.4)",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {rs.client}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* BACK LINK                                                          */}
      {/* ================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{
            color: "#E53E3E",
            fontFamily: "var(--font-heading)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          <ArrowLeftIcon size={16} color="#E53E3E" />
          Back to Case Studies
        </Link>
      </div>
    </div>
  );
}
