"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseStudy, CaseStudyFilters } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CaseStudiesViewProps {
  caseStudies: CaseStudy[];
  filters: CaseStudyFilters;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMetric(value: number | undefined, type?: string): string {
  if (value === undefined || value === null) return "";
  switch (type) {
    case "percentage":
      return `+${value}%`;
    case "currency":
      return `$${value.toLocaleString()}`;
    case "multiplier":
      return `${value}x`;
    default:
      return String(value);
  }
}

function metricDisplay(metric: CaseStudy["keyMetrics"][0]): string {
  if (metric.improvement) return metric.improvement;
  if (metric.after) return metric.after;
  if (metric.value !== undefined) return formatMetric(metric.value, metric.type);
  return "";
}

// ---------------------------------------------------------------------------
// Inline SVG Icons
// ---------------------------------------------------------------------------

function SearchIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

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

function ChevronDownIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GridIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function ListIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function StarIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

function PlayIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function CalendarIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function ClockIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ZapIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FilterIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function BuildingIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function TrendingUpIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function XIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function MessageCircleIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Hero Carousel
// ---------------------------------------------------------------------------

function HeroCarousel({
  featuredCaseStudies,
}: {
  featuredCaseStudies: CaseStudy[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAutoPlaying || featuredCaseStudies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featuredCaseStudies.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredCaseStudies.length]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      pauseAutoPlay();
    },
    [pauseAutoPlay]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === featuredCaseStudies.length - 1 ? 0 : prev + 1
    );
    pauseAutoPlay();
  }, [featuredCaseStudies.length, pauseAutoPlay]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredCaseStudies.length - 1 : prev - 1
    );
    pauseAutoPlay();
  }, [featuredCaseStudies.length, pauseAutoPlay]);

  if (!featuredCaseStudies.length) return null;

  const currentCase = featuredCaseStudies[currentSlide];

  return (
    <section
      className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={currentCase.heroImage}
            alt={`${currentCase.title} hero`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.4))",
            }}
          />
          {/* Additional right-side gradient for desktop */}
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.4) 60%, transparent)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {featuredCaseStudies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "#FFFFFF", background: "rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            aria-label="Previous slide"
          >
            <ChevronLeftIcon size={24} color="#FFFFFF" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ color: "#FFFFFF", background: "rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            aria-label="Next slide"
          >
            <ChevronRightIcon size={24} color="#FFFFFF" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Badges */}
            <motion.div
              key={`badges-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center gap-2 mb-4 md:mb-6"
            >
              <span
                className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Featured Case Study
              </span>
              <span
                className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full"
                style={{
                  background: "rgba(229,62,62,0.8)",
                  backdropFilter: "blur(8px)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {currentCase.industry}
              </span>
            </motion.div>

            {/* Client */}
            <motion.div
              key={`client-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4"
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.125rem",
                    textTransform: "uppercase",
                  }}
                >
                  {currentCase.client?.charAt(0)}
                </span>
              </div>
              <div>
                <h2
                  className="text-lg md:text-xl"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {currentCase.client}
                </h2>
                <p
                  className="text-xs md:text-sm"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {currentCase.businessStage}
                </p>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {currentCase.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {currentCase.description}
            </motion.p>

            {/* Key Metrics */}
            <motion.div
              key={`metrics-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8"
            >
              {currentCase.keyMetrics?.slice(0, 3).map((metric, index) => (
                <div key={index} className="text-center">
                  <div
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1"
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
                    className="text-xs md:text-sm"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {metric.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Link
                href={`/case-studies/${currentCase.slug}`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4 rounded-md transition-colors"
                style={{
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(229,62,62,0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#E53E3E")
                }
              >
                <PlayIcon size={16} color="#FFFFFF" />
                Watch Full Story
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4 rounded-md transition-colors"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.color = "#111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
              >
                <MessageCircleIcon size={16} />
                Start Similar Project
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {featuredCaseStudies.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {featuredCaseStudies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === currentSlide ? "12px" : "10px",
                height: index === currentSlide ? "12px" : "10px",
                background:
                  index === currentSlide
                    ? "#E53E3E"
                    : "rgba(255,255,255,0.4)",
                transform: index === currentSlide ? "scale(1.25)" : "scale(1)",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Indicator */}
      {isAutoPlaying && featuredCaseStudies.length > 1 && (
        <div
          className="hidden sm:flex absolute bottom-16 md:bottom-20 right-4 md:right-8 items-center space-x-2 text-xs md:text-sm z-10"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#E53E3E" }}
          />
          <span>Auto-playing</span>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Filter Bar
// ---------------------------------------------------------------------------

function FilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: {
  filters: CaseStudyFilters;
  activeFilters: { industry: string[]; serviceType: string[]; businessStage: string[] };
  onFilterChange: (category: "industry" | "serviceType" | "businessStage", value: string) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterCategories = useMemo(
    () => [
      {
        key: "industry" as const,
        label: "Industry",
        icon: BuildingIcon,
        options: filters.industries || [],
      },
      {
        key: "serviceType" as const,
        label: "Service",
        icon: ZapIcon,
        options: filters.serviceTypes || [],
      },
      {
        key: "businessStage" as const,
        label: "Business Stage",
        icon: TrendingUpIcon,
        options: filters.businessStages || [],
      },
    ],
    [filters]
  );

  const sortOptions = [
    { value: "featured", label: "Featured First" },
    { value: "newest", label: "Newest First" },
    { value: "impact", label: "Highest Impact" },
    { value: "alphabetical", label: "A-Z" },
  ];

  const activeFilterCount = useMemo(
    () => Object.values(activeFilters).flat().length,
    [activeFilters]
  );

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.length > 0;

  return (
    <div
      className="sticky top-[60px] z-40"
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex flex-col gap-3">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon size={20} color="rgba(0,0,0,0.4)" />
              </div>
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm md:text-base outline-none"
                style={{
                  border: "1px solid #E5E7EB",
                  color: "#111111",
                  background: "#FFFFFF",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#E53E3E")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#E5E7EB")
                }
              />
            </div>

            {/* Mobile: Filter Toggle & Sort */}
            <div className="flex gap-2">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden flex items-center gap-2 flex-1 px-3 py-2 rounded-lg transition-colors"
                style={{
                  border: "1px solid #E5E7EB",
                  color: "#111111",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontSize: "0.875rem",
                }}
              >
                <FilterIcon size={16} color="#111111" />
                Filters
                {activeFilterCount > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "#E53E3E",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2 rounded-lg text-sm md:text-base cursor-pointer outline-none"
                  style={{
                    border: "1px solid #E5E7EB",
                    color: "#111111",
                    background: "#FFFFFF",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon size={16} color="rgba(0,0,0,0.4)" />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background:
                      viewMode === "grid"
                        ? "rgba(229,62,62,0.1)"
                        : "transparent",
                    color: viewMode === "grid" ? "#E53E3E" : "rgba(0,0,0,0.4)",
                  }}
                  aria-label="Grid view"
                >
                  <GridIcon
                    size={18}
                    color={viewMode === "grid" ? "#E53E3E" : "rgba(0,0,0,0.4)"}
                  />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background:
                      viewMode === "list"
                        ? "rgba(229,62,62,0.1)"
                        : "transparent",
                    color: viewMode === "list" ? "#E53E3E" : "rgba(0,0,0,0.4)",
                  }}
                  aria-label="List view"
                >
                  <ListIcon
                    size={18}
                    color={viewMode === "list" ? "#E53E3E" : "rgba(0,0,0,0.4)"}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Filter Categories */}
          <div className="hidden md:flex flex-col gap-3">
            {filterCategories.map((category) => {
              const IconComp = category.icon;
              return (
                <div key={category.key} className="flex items-center gap-3">
                  <div
                    className="flex items-center space-x-1 min-w-[140px]"
                    style={{
                      color: "rgba(0,0,0,0.5)",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontSize: "0.875rem",
                    }}
                  >
                    <IconComp size={16} color="rgba(0,0,0,0.5)" />
                    <span>{category.label}:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.options.map((option) => {
                      const isActive = activeFilters[category.key].includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => onFilterChange(category.key, option)}
                          className="px-3 py-1 text-sm rounded-full transition-all duration-300"
                          style={{
                            background: isActive
                              ? "#E53E3E"
                              : "rgba(0,0,0,0.04)",
                            color: isActive
                              ? "#FFFFFF"
                              : "rgba(0,0,0,0.5)",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background =
                                "rgba(229,62,62,0.1)";
                              e.currentTarget.style.color = "#E53E3E";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background =
                                "rgba(0,0,0,0.04)";
                              e.currentTarget.style.color = "rgba(0,0,0,0.5)";
                            }
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Filter Panel */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden overflow-hidden"
              >
                <div
                  className="rounded-lg p-3 space-y-3 max-h-64 overflow-y-auto"
                  style={{ background: "#F9FAFB" }}
                >
                  {filterCategories.map((category) => {
                    const IconComp = category.icon;
                    return (
                      <div key={category.key}>
                        <div
                          className="flex items-center space-x-1 mb-1.5"
                          style={{
                            color: "rgba(0,0,0,0.5)",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                          }}
                        >
                          <IconComp size={14} color="rgba(0,0,0,0.5)" />
                          <span>{category.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {category.options.map((option) => {
                            const isActive = activeFilters[category.key].includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() =>
                                  onFilterChange(category.key, option)
                                }
                                className="px-2 py-1 rounded-full transition-all duration-300"
                                style={{
                                  fontSize: "11px",
                                  background: isActive
                                    ? "#E53E3E"
                                    : "#FFFFFF",
                                  color: isActive
                                    ? "#FFFFFF"
                                    : "rgba(0,0,0,0.5)",
                                  border: isActive
                                    ? "1px solid #E53E3E"
                                    : "1px solid #E5E7EB",
                                }}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters & Clear */}
          {hasActiveFilters && (
            <div
              className="flex items-center justify-between py-2"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div
                className="flex items-center space-x-2 text-xs md:text-sm"
                style={{ color: "rgba(0,0,0,0.5)" }}
              >
                <FilterIcon size={14} color="rgba(0,0,0,0.5)" />
                <span>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {activeFilterCount}
                  </span>{" "}
                  filter{activeFilterCount !== 1 ? "s" : ""}
                  {searchQuery && (
                    <span>
                      {" "}
                      &bull; &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 text-xs md:text-sm transition-colors"
                style={{
                  color: "#E53E3E",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <XIcon size={14} color="#E53E3E" />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Case Study Card (Grid View)
// ---------------------------------------------------------------------------

function CaseStudyCardGrid({ caseStudy }: { caseStudy: CaseStudy }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/case-studies/${caseStudy.slug}`}
        className="group block rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: "#FFFFFF",
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.12), 0 0 8px rgba(229,62,62,0.15)"
            : "0 2px 8px rgba(0,0,0,0.06), 0 0 4px rgba(229,62,62,0.08)",
          transform: hovered ? "translateY(-8px)" : "translateY(0)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hero Image */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <Image
            src={caseStudy.heroImage}
            alt={`${caseStudy.title} case study`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700"
            style={{
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%, transparent)",
            }}
          />

          {/* Industry Badge (top-left) */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full"
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                color: "#111111",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {caseStudy.industry}
            </span>
          </div>

          {/* Service Type Badge (top-right) */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full"
              style={{
                background: "rgba(229,62,62,0.9)",
                backdropFilter: "blur(8px)",
                color: "#FFFFFF",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {caseStudy.serviceType}
            </span>
          </div>

          {/* Featured Star Badge (bottom-right) */}
          {caseStudy.featured && (
            <div className="absolute bottom-3 right-3 z-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "#E53E3E",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  border: "2px solid #FFFFFF",
                }}
              >
                <StarIcon size={18} color="#FFFFFF" />
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <div
              className="rounded-full px-4 py-2 flex items-center space-x-2"
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="text-sm"
                style={{
                  color: "#111111",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                View Case Study
              </span>
              <ArrowRightIcon size={16} color="#111111" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6">
          {/* Client Info */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3 sm:mb-4">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#F3F4F6" }}
            >
              <span
                className="text-xs sm:text-sm"
                style={{
                  color: "#111111",
                  fontFamily: "var(--font-heading)",
                  textTransform: "uppercase",
                }}
              >
                {caseStudy.client?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm sm:text-base truncate"
                style={{
                  color: "#111111",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {caseStudy.client}
              </h3>
              <p
                className="text-xs sm:text-sm truncate"
                style={{ color: "rgba(0,0,0,0.5)" }}
              >
                {caseStudy.businessStage}
              </p>
            </div>
          </div>

          {/* Title */}
          <h4
            className="text-lg sm:text-xl mb-2 line-clamp-2 transition-colors duration-300"
            style={{
              color: hovered ? "#E53E3E" : "#111111",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {caseStudy.title}
          </h4>

          {/* Description */}
          <p
            className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            {caseStudy.description}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {caseStudy.keyMetrics?.slice(0, 3).map((metric, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-base sm:text-lg"
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
                  style={{ fontSize: "10px", color: "rgba(0,0,0,0.5)" }}
                  className="sm:text-xs"
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div
            className="flex items-center justify-between text-xs sm:text-sm mb-3 sm:mb-4"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            <div className="flex items-center space-x-1">
              <CalendarIcon size={14} color="rgba(0,0,0,0.4)" />
              <span>{caseStudy.timeline}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon size={14} color="rgba(0,0,0,0.4)" />
              <span>{caseStudy.duration}</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-colors duration-300 flex items-center justify-center gap-2"
            style={{
              border: "1px solid #E53E3E",
              color: hovered ? "#FFFFFF" : "#E53E3E",
              background: hovered ? "#E53E3E" : "transparent",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            View Full Story
            <ArrowRightIcon
              size={16}
              color={hovered ? "#FFFFFF" : "#E53E3E"}
            />
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Case Study List Item
// ---------------------------------------------------------------------------

function CaseStudyListItem({ caseStudy }: { caseStudy: CaseStudy }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/case-studies/${caseStudy.slug}`}
        className="group flex flex-col sm:flex-row rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: "#FFFFFF",
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.12), 0 0 8px rgba(229,62,62,0.15)"
            : "0 2px 8px rgba(0,0,0,0.06), 0 0 4px rgba(229,62,62,0.08)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative w-full sm:w-64 md:w-80 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={caseStudy.heroImage}
            alt={`${caseStudy.title} case study`}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover transition-transform duration-700"
            style={{
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          {caseStudy.featured && (
            <div className="absolute top-3 left-3">
              <span
                className="px-2.5 py-1 text-xs rounded-full flex items-center gap-1"
                style={{
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <StarIcon size={12} color="#FFFFFF" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-center">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid #E5E7EB",
                color: "#111111",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {caseStudy.industry}
            </span>
            <span style={{ color: "rgba(0,0,0,0.2)", fontSize: "12px" }}>
              |
            </span>
            <span
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full"
              style={{
                background: "rgba(229,62,62,0.08)",
                color: "#E53E3E",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {caseStudy.serviceType}
            </span>
            <span style={{ color: "rgba(0,0,0,0.2)", fontSize: "12px" }}>
              |
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              {caseStudy.businessStage}
            </span>
          </div>

          {/* Client */}
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#F3F4F6" }}
            >
              <span
                style={{
                  color: "#111111",
                  fontFamily: "var(--font-heading)",
                  textTransform: "uppercase",
                  fontSize: "11px",
                }}
              >
                {caseStudy.client?.charAt(0)}
              </span>
            </div>
            <span
              className="text-sm"
              style={{
                color: "#111111",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {caseStudy.client}
            </span>
          </div>

          {/* Title */}
          <h4
            className="text-xl sm:text-2xl mb-2 transition-colors duration-300"
            style={{
              color: hovered ? "#E53E3E" : "#111111",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {caseStudy.title}
          </h4>

          {/* Description */}
          <p
            className="text-sm mb-4 line-clamp-2 leading-relaxed"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            {caseStudy.description}
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {caseStudy.keyMetrics?.slice(0, 4).map((metric, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="text-lg sm:text-xl"
                  style={{
                    color: "#E53E3E",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {metricDisplay(metric)}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "rgba(0,0,0,0.4)" }}
                >
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div
            className="flex items-center gap-4 mt-3 text-xs sm:text-sm"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            <div className="flex items-center space-x-1">
              <CalendarIcon size={14} color="rgba(0,0,0,0.3)" />
              <span>{caseStudy.timeline}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon size={14} color="rgba(0,0,0,0.3)" />
              <span>{caseStudy.duration}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main View
// ---------------------------------------------------------------------------

export default function CaseStudiesView({
  caseStudies,
  filters,
}: CaseStudiesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<{
    industry: string[];
    serviceType: string[];
    businessStage: string[];
  }>({ industry: [], serviceType: [], businessStage: [] });

  // Hydrate filters from URL search params on mount so deep links like
  // `/case-studies?service=Organic%20Lead%20Growth` pre-apply the filter.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const initial: {
      industry: string[];
      serviceType: string[];
      businessStage: string[];
    } = { industry: [], serviceType: [], businessStage: [] };
    const serviceParam = params.getAll("service");
    const industryParam = params.getAll("industry");
    const stageParam = params.getAll("stage");
    if (serviceParam.length > 0) initial.serviceType = serviceParam;
    if (industryParam.length > 0) initial.industry = industryParam;
    if (stageParam.length > 0) initial.businessStage = stageParam;
    if (
      initial.serviceType.length +
        initial.industry.length +
        initial.businessStage.length >
      0
    ) {
      setActiveFilters(initial);
    }
  }, []);

  // Persist view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("caseStudyViewMode");
      if (saved === "grid" || saved === "list") setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("caseStudyViewMode", viewMode);
    }
  }, [viewMode]);

  // Featured case studies for hero carousel
  const featuredCaseStudies = useMemo(
    () => caseStudies.filter((s) => s.featured),
    [caseStudies]
  );

  // Filter and sort
  const filteredStudies = useMemo(() => {
    let result = [...caseStudies];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.client.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.industry.toLowerCase().includes(q) ||
          s.serviceType.toLowerCase().includes(q)
      );
    }

    if (activeFilters.industry.length > 0) {
      result = result.filter((s) => activeFilters.industry.includes(s.industry));
    }
    if (activeFilters.serviceType.length > 0) {
      result = result.filter((s) =>
        activeFilters.serviceType.includes(s.serviceType)
      );
    }
    if (activeFilters.businessStage.length > 0) {
      result = result.filter((s) =>
        activeFilters.businessStage.includes(s.businessStage)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "impact": {
          const ai = a.keyMetrics.reduce((sum, m) => sum + (m.value ?? 0), 0);
          const bi = b.keyMetrics.reduce((sum, m) => sum + (m.value ?? 0), 0);
          return bi - ai;
        }
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [caseStudies, searchQuery, activeFilters, sortBy]);

  // Handlers
  const toggleFilter = useCallback(
    (
      category: "industry" | "serviceType" | "businessStage",
      value: string
    ) => {
      setActiveFilters((prev) => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((v) => v !== value)
          : [...prev[category], value],
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setActiveFilters({ industry: [], serviceType: [], businessStage: [] });
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FCFCFB" }}>
      {/* Hero Carousel */}
      {featuredCaseStudies.length > 0 ? (
        <HeroCarousel featuredCaseStudies={featuredCaseStudies} />
      ) : caseStudies.length > 0 ? (
        <HeroCarousel featuredCaseStudies={[caseStudies[0]]} />
      ) : null}

      {/* Filter Bar (Sticky) */}
      <FilterBar
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={toggleFilter}
        onClearFilters={clearFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Case Studies Grid / List */}
      <section className="py-8 sm:py-12 md:py-16" style={{ background: "#FCFCFB" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h2
                className="text-lg sm:text-xl md:text-2xl"
                style={{
                  color: "#111111",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ fontFamily: "var(--font-heading)" }}>
                  {filteredStudies.length}
                </span>{" "}
                Case Stud{filteredStudies.length !== 1 ? "ies" : "y"}
              </h2>
              <p
                className="text-xs sm:text-sm md:text-base"
                style={{ color: "rgba(0,0,0,0.5)" }}
              >
                Transformation stories with measurable impact
              </p>
            </div>
          </div>

          {/* Case Studies Display */}
          {filteredStudies.length > 0 ? (
            <div className="transition-all duration-300 ease-in-out">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredStudies.map((caseStudy) => (
                    <CaseStudyCardGrid key={caseStudy.id} caseStudy={caseStudy} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {filteredStudies.map((caseStudy) => (
                    <CaseStudyListItem key={caseStudy.id} caseStudy={caseStudy} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6"
                style={{ background: "#F3F4F6" }}
              >
                <SearchIcon
                  size={24}
                  color="rgba(0,0,0,0.3)"
                />
              </div>
              <h3
                className="text-base sm:text-lg md:text-xl mb-2"
                style={{
                  color: "#111111",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                No case studies found
              </h3>
              <p
                className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6"
                style={{ color: "rgba(0,0,0,0.5)" }}
              >
                {caseStudies.length === 0
                  ? "No case studies available yet"
                  : "Try adjusting your filters or search terms"}
              </p>
              {caseStudies.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-lg text-xs sm:text-sm md:text-base transition-colors"
                  style={{
                    border: "1px solid #E53E3E",
                    color: "#E53E3E",
                    background: "transparent",
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E53E3E";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#E53E3E";
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-12 sm:py-16" style={{ background: "#111111" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Ready to Create Your Success Story?
          </h2>
          <p
            className="text-base sm:text-xl mb-6 sm:mb-8 px-4 sm:px-0 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Join the ranks of industry leaders who&apos;ve transformed their
            businesses with Rule27 Design. Let&apos;s discuss how we can deliver
            similar results for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-6 py-3 rounded-md transition-colors"
              style={{
                background: "#E53E3E",
                color: "#FFFFFF",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(229,62,62,0.9)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#E53E3E")
              }
            >
              <CalendarIcon size={16} color="#FFFFFF" />
              Book Strategy Session
            </Link>
            <Link
              href="/capabilities"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-6 py-3 rounded-md transition-colors"
              style={{
                background: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.4)",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.color = "#111111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#FFFFFF";
              }}
            >
              <ZapIcon size={16} />
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
