"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Article, ArticleFilters } from "@/app/lib/types";
import { formatDate } from "@/app/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ArticlesViewProps {
  articles: Article[];
  filters: ArticleFilters;
}

// ---------------------------------------------------------------------------
// Helper: relative date (for cards)
// ---------------------------------------------------------------------------

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Helper: format number compactly
// ---------------------------------------------------------------------------

function compactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

// ---------------------------------------------------------------------------
// SVG Icon helpers (inline to avoid external deps)
// ---------------------------------------------------------------------------

function ClockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function EyeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronLeftIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronDownIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GridIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function ListIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function FilterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function StarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function FolderIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function TagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function BookOpenIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function BookmarkIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function FileTextIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ArrowSortIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Featured Article Hero Carousel
// ---------------------------------------------------------------------------

function FeaturedHeroCarousel({
  featuredArticles,
}: {
  featuredArticles: Article[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || featuredArticles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featuredArticles.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredArticles.length]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    const timer = setTimeout(() => setIsAutoPlaying(true), 10000);
    return () => clearTimeout(timer);
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
      prev === featuredArticles.length - 1 ? 0 : prev + 1
    );
    pauseAutoPlay();
  }, [featuredArticles.length, pauseAutoPlay]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredArticles.length - 1 : prev - 1
    );
    pauseAutoPlay();
  }, [featuredArticles.length, pauseAutoPlay]);

  if (!featuredArticles.length) return null;

  const current = featuredArticles[currentSlide];

  return (
    <section
      className="relative h-[60vh] sm:h-[70vh] min-h-[400px] sm:min-h-[500px] overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={current.featuredImage}
              alt={current.featuredImageAlt || current.title}
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
              "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4))",
          }}
        />
        {/* Desktop side gradient */}
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4) 60%, transparent)",
          }}
        />
      </div>

      {/* Navigation Arrows */}
      {featuredArticles.length > 1 && (
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
            <ChevronLeftIcon size={24} />
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
            <ChevronRightIcon size={24} />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Category & Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                  <span
                    className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-full backdrop-blur-sm"
                    style={{
                      background: "rgba(229,62,62,0.8)",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-steelfish), Impact, sans-serif",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {current.category}
                  </span>
                  <div
                    className="flex items-center space-x-4 text-xs md:text-sm"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <span className="flex items-center gap-1">
                      <ClockIcon size={14} />
                      {current.readTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <EyeIcon size={14} />
                      <span
                        style={{
                          fontFamily:
                            "var(--font-steelfish), Impact, sans-serif",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {current.views?.toLocaleString()}
                      </span>{" "}
                      views
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6"
                  style={{
                    fontFamily: "var(--font-steelfish), Impact, sans-serif",
                    color: "#FFFFFF",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {current.title}
                </h1>

                {/* Excerpt */}
                <p
                  className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none"
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  {current.excerpt}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-6 md:mb-8">
                  <div
                    className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden"
                    style={{ border: "2px solid rgba(255,255,255,0.2)" }}
                  >
                    <Image
                      src={current.author.avatar}
                      alt={current.author.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm md:text-base font-semibold"
                      style={{
                        color: "#FFFFFF",
                        fontFamily:
                          "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {current.author.name}
                    </p>
                    <p
                      className="text-xs md:text-sm"
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontFamily:
                          "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {current.author.role} &bull;{" "}
                      {formatDate(current.publishedDate, "MMMM DD, YYYY")}
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link
                    href={`/articles/${current.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4 rounded-lg transition-colors"
                    style={{
                      background: "#E53E3E",
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(229,62,62,0.9)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#E53E3E")
                    }
                  >
                    <BookOpenIcon size={18} />
                    <span
                      style={{
                        fontFamily:
                          "var(--font-steelfish), Impact, sans-serif",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Read Full Article
                    </span>
                  </Link>
                  <button
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base px-4 py-3 md:px-6 md:py-4 rounded-lg transition-colors"
                    style={{
                      background: "transparent",
                      color: "#FFFFFF",
                      border: "1px solid #FFFFFF",
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
                    <BookmarkIcon size={18} />
                    <span
                      style={{
                        fontFamily:
                          "var(--font-steelfish), Impact, sans-serif",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Save for Later
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      {featuredArticles.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {featuredArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300"
              style={{
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
    </section>
  );
}

// ---------------------------------------------------------------------------
// Filter Bar
// ---------------------------------------------------------------------------

function ArticleFilterBar({
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
  filters: ArticleFilters;
  activeFilters: { category: string[]; topic: string[]; readTime: string[] };
  onFilterChange: (cat: string, val: string) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  viewMode: string;
  onViewModeChange: (val: string) => void;
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse filter rows on scroll, expand when scrolled back to top
  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Collapse when scrolling down past 300px
      if (currentY > 300 && currentY > lastScrollY) {
        setIsCollapsed(true);
      }
      // Expand when scrolled near top
      if (currentY < 200) {
        setIsCollapsed(false);
      }
      lastScrollY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filterCategories = useMemo(
    () => [
      { key: "category", label: "Category", Icon: FolderIcon, options: filters.categories || [] },
      { key: "topic", label: "Topics", Icon: TagIcon, options: filters.topics || [] },
      { key: "readTime", label: "Read Time", Icon: ClockIcon, options: filters.readTimes || [] },
    ],
    [filters]
  );

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "readTime", label: "Quick Reads" },
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
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(0,0,0,0.35)" }}
              >
                <SearchIcon size={20} />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm md:text-base outline-none transition-colors"
                style={{
                  border: "1px solid #E5E7EB",
                  color: "#111111",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
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

            {/* Mobile: Filter Toggle + Sort + View Toggle */}
            <div className="flex gap-2">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  border: "1px solid #E5E7EB",
                  color: "#111111",
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <FilterIcon size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "#E53E3E",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-steelfish), Impact, sans-serif",
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <div
                  className="hidden sm:block"
                  style={{ color: "rgba(0,0,0,0.35)" }}
                >
                  <ArrowSortIcon size={18} />
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full sm:w-auto rounded-lg pl-3 pr-8 py-2 text-sm md:text-base cursor-pointer outline-none"
                    style={{
                      appearance: "none",
                      WebkitAppearance: "none",
                      border: "1px solid #E5E7EB",
                      color: "#111111",
                      background: "#FFFFFF",
                      fontFamily:
                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#E53E3E")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#E5E7EB")
                    }
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "rgba(0,0,0,0.35)" }}
                  >
                    <ChevronDownIcon size={16} />
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center space-x-1">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    color: viewMode === "grid" ? "#E53E3E" : "rgba(0,0,0,0.35)",
                    background:
                      viewMode === "grid"
                        ? "rgba(229,62,62,0.1)"
                        : "transparent",
                  }}
                  aria-label="Grid view"
                >
                  <GridIcon size={18} />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    color: viewMode === "list" ? "#E53E3E" : "rgba(0,0,0,0.35)",
                    background:
                      viewMode === "list"
                        ? "rgba(229,62,62,0.1)"
                        : "transparent",
                  }}
                  aria-label="List view"
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Expand/Collapse toggle when scrolled */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-steelfish), Impact, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#E53E3E",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <FilterIcon size={14} />
              Show Filters
              {activeFilterCount > 0 && (
                <span style={{
                  background: "#E53E3E",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  padding: "1px 6px",
                  borderRadius: 9999,
                  lineHeight: 1.5,
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          {/* Desktop Filter Categories */}
          <div className="hidden md:flex flex-wrap gap-4" style={{
            maxHeight: isCollapsed ? 0 : 500,
            overflow: "hidden",
            opacity: isCollapsed ? 0 : 1,
            transition: "max-height 0.3s ease, opacity 0.2s ease",
          }}>
            {filterCategories.map((category) => (
              <div
                key={category.key}
                className="flex flex-wrap items-center gap-2"
              >
                <div
                  className="flex items-center space-x-1 text-sm"
                  style={{
                    color: "rgba(0,0,0,0.45)",
                    fontFamily: "var(--font-steelfish), Impact, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <category.Icon size={16} />
                  <span>{category.label}:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => {
                    const isActive =
                      activeFilters[
                        category.key as keyof typeof activeFilters
                      ]?.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => onFilterChange(category.key, option)}
                        className="px-3 py-1 text-sm rounded-full transition-all duration-300"
                        style={{
                          background: isActive
                            ? "#E53E3E"
                            : "rgba(0,0,0,0.04)",
                          color: isActive ? "#FFFFFF" : "rgba(0,0,0,0.55)",
                          fontFamily:
                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
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
                            e.currentTarget.style.color = "rgba(0,0,0,0.55)";
                          }
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
                  style={{ background: "#F8F9FA" }}
                >
                  {filterCategories.map((category) => (
                    <div key={category.key}>
                      <div
                        className="flex items-center space-x-1 text-xs mb-1.5"
                        style={{
                          color: "rgba(0,0,0,0.45)",
                          fontFamily:
                            "var(--font-steelfish), Impact, sans-serif",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <category.Icon size={14} />
                        <span>{category.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {category.options.map((option) => {
                          const isActive =
                            activeFilters[
                              category.key as keyof typeof activeFilters
                            ]?.includes(option);
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
                                  : "rgba(0,0,0,0.55)",
                                border: isActive
                                  ? "1px solid #E53E3E"
                                  : "1px solid #E5E7EB",
                                fontFamily:
                                  "'Helvetica Neue', Helvetica, Arial, sans-serif",
                              }}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* View toggle in mobile */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <span
                      className="text-xs"
                      style={{
                        color: "rgba(0,0,0,0.45)",
                        fontFamily:
                          "var(--font-steelfish), Impact, sans-serif",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      View:
                    </span>
                    <button
                      onClick={() => onViewModeChange("grid")}
                      className="w-8 h-8 rounded flex items-center justify-center"
                      style={{
                        color:
                          viewMode === "grid"
                            ? "#E53E3E"
                            : "rgba(0,0,0,0.35)",
                        background:
                          viewMode === "grid"
                            ? "rgba(229,62,62,0.1)"
                            : "transparent",
                      }}
                    >
                      <GridIcon size={16} />
                    </button>
                    <button
                      onClick={() => onViewModeChange("list")}
                      className="w-8 h-8 rounded flex items-center justify-center"
                      style={{
                        color:
                          viewMode === "list"
                            ? "#E53E3E"
                            : "rgba(0,0,0,0.35)",
                        background:
                          viewMode === "list"
                            ? "rgba(229,62,62,0.1)"
                            : "transparent",
                      }}
                    >
                      <ListIcon size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters + Clear */}
          {hasActiveFilters && (
            <div
              className="flex items-center justify-between py-2"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div
                className="flex items-center space-x-2 text-xs md:text-sm"
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                <FilterIcon size={14} />
                <span
                  style={{
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-steelfish), Impact, sans-serif",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {activeFilterCount}
                  </span>{" "}
                  filter{activeFilterCount !== 1 ? "s" : ""}
                  {searchQuery && ` \u2022 "${searchQuery}"`}
                </span>
              </div>
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 text-xs md:text-sm transition-colors"
                style={{
                  color: "#E53E3E",
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <XIcon size={14} />
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
// Article Card (Grid view)
// ---------------------------------------------------------------------------

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative flex flex-col h-full rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 12px 32px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Featured Image */}
      <div
        className="relative h-48 sm:h-56 overflow-hidden"
        style={{ background: "#F3F4F6" }}
      >
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt || article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span
            className="px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "#111111",
              fontFamily: "var(--font-steelfish), Impact, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {article.category}
          </span>
        </div>

        {/* Read Time Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span
            className="px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full backdrop-blur-sm flex items-center gap-1 font-semibold"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#FFFFFF",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            <ClockIcon size={12} />
            {article.readTime} min
          </span>
        </div>

        {/* Featured Star */}
        {article.featured && (
          <div className="absolute bottom-3 right-3 z-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: "#E53E3E",
                border: "2px solid #FFFFFF",
                color: "#FFFFFF",
              }}
            >
              <StarIcon size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6">
        {/* Author & Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <p
              className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px] font-medium"
              style={{
                color: "#111111",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {article.author.name}
            </p>
          </div>
          <span
            className="text-[10px] sm:text-xs"
            style={{
              color: "rgba(0,0,0,0.45)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            {formatRelativeDate(article.publishedDate)}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-base sm:text-lg mb-2 line-clamp-2 transition-colors duration-300 group-hover:!text-[#E53E3E]"
          style={{
            fontFamily: "var(--font-steelfish), Impact, sans-serif",
            color: "#111111",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p
          className="text-xs sm:text-sm mb-4 line-clamp-3 flex-1"
          style={{
            color: "rgba(0,0,0,0.55)",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          {article.excerpt}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
          {article.topics?.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full"
              style={{
                background: "rgba(0,0,0,0.04)",
                color: "rgba(0,0,0,0.55)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {topic}
            </span>
          ))}
          {(article.topics?.length || 0) > 3 && (
            <span
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full"
              style={{
                background: "rgba(0,0,0,0.04)",
                color: "rgba(0,0,0,0.55)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              +{article.topics.length - 3} more
            </span>
          )}
        </div>

        {/* Footer: Stats + Read CTA */}
        <div
          className="flex items-center justify-between mt-auto pt-3 sm:pt-4"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center space-x-2 sm:space-x-3 text-xs"
            style={{ color: "rgba(0,0,0,0.45)" }}
          >
            <span className="flex items-center gap-1">
              <EyeIcon size={12} />
              <span
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                {compactNumber(article.views)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <HeartIcon size={12} />
              <span
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                {compactNumber(article.likes)}
              </span>
            </span>
          </div>

          <span
            className="flex items-center gap-1 text-xs sm:text-sm transition-colors"
            style={{
              color: "#E53E3E",
              fontFamily: "var(--font-steelfish), Impact, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Read
            <span className="transform transition-transform duration-300 group-hover:translate-x-1 inline-block">
              <ArrowRightIcon size={16} />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Article List Item (List view)
// ---------------------------------------------------------------------------

function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col sm:flex-row rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div
        className="relative w-full sm:w-64 md:w-80 h-48 sm:h-auto sm:min-h-[200px] overflow-hidden flex-shrink-0"
        style={{ background: "#F3F4F6" }}
      >
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt || article.title}
          fill
          sizes="(max-width: 640px) 100vw, 320px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 text-xs rounded-full backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "#111111",
              fontFamily: "var(--font-steelfish), Impact, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {article.category}
          </span>
        </div>
        {/* Read Time Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="px-2 py-1 text-xs rounded-full backdrop-blur-sm flex items-center gap-1 font-semibold"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "#FFFFFF",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            <ClockIcon size={12} />
            {article.readTime} min
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6">
        {/* Author & Date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </div>
            <p
              className="text-xs sm:text-sm font-medium"
              style={{
                color: "#111111",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {article.author.name}
            </p>
          </div>
          <span
            className="text-[10px] sm:text-xs"
            style={{
              color: "rgba(0,0,0,0.45)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            {formatRelativeDate(article.publishedDate)}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-lg sm:text-xl mb-2 line-clamp-2 transition-colors duration-300 group-hover:!text-[#E53E3E]"
          style={{
            fontFamily: "var(--font-steelfish), Impact, sans-serif",
            color: "#111111",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        <p
          className="text-xs sm:text-sm mb-3 line-clamp-2 flex-1"
          style={{
            color: "rgba(0,0,0,0.55)",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          {article.excerpt}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
          {article.topics?.slice(0, 4).map((topic, index) => (
            <span
              key={index}
              className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full"
              style={{
                background: "rgba(0,0,0,0.04)",
                color: "rgba(0,0,0,0.55)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {topic}
            </span>
          ))}
          {(article.topics?.length || 0) > 4 && (
            <span
              className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs rounded-full"
              style={{
                background: "rgba(0,0,0,0.04)",
                color: "rgba(0,0,0,0.55)",
              }}
            >
              +{article.topics.length - 4} more
            </span>
          )}
        </div>

        {/* Footer: Stats + Read CTA */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div
            className="flex items-center space-x-3 text-xs"
            style={{ color: "rgba(0,0,0,0.45)" }}
          >
            <span className="flex items-center gap-1">
              <EyeIcon size={12} />
              <span
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                {compactNumber(article.views)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <HeartIcon size={12} />
              <span
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                {compactNumber(article.likes)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon size={12} />
              {article.readTime} min
            </span>
          </div>
          <span
            className="flex items-center gap-1 text-sm transition-colors"
            style={{
              color: "#E53E3E",
              fontFamily: "var(--font-steelfish), Impact, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Read
            <span className="transform transition-transform duration-300 group-hover:translate-x-1 inline-block">
              <ArrowRightIcon size={16} />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Bottom CTA Section
// ---------------------------------------------------------------------------

function BottomCTA() {
  return (
    <section
      className="py-16 sm:py-20 md:py-24"
      style={{ background: "#111111" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6"
          style={{
            fontFamily: "var(--font-steelfish), Impact, sans-serif",
            color: "#FFFFFF",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Ready to Transform Your Brand?
        </h2>
        <p
          className="text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          Our team of digital innovators is ready to help you break through
          conventional boundaries. Let&apos;s build something extraordinary
          together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base transition-colors"
            style={{
              background: "#E53E3E",
              color: "#FFFFFF",
              fontFamily: "var(--font-steelfish), Impact, sans-serif",
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
            Start a Project
          </Link>
          <Link
            href="/capabilities"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-base transition-colors"
            style={{
              background: "transparent",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.3)",
              fontFamily: "var(--font-steelfish), Impact, sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
          >
            Explore Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main Articles View
// ---------------------------------------------------------------------------

export default function ArticlesView({
  articles,
  filters,
}: ArticlesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [activeFilters, setActiveFilters] = useState<{
    category: string[];
    topic: string[];
    readTime: string[];
  }>({ category: [], topic: [], readTime: [] });
  const INITIAL_LOAD = 6;
  const LOAD_MORE_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);

  // Persist view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("articleViewMode");
      if (saved === "grid" || saved === "list") setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("articleViewMode", viewMode);
    }
  }, [viewMode]);

  // Featured articles for carousel
  const featuredArticles = useMemo(
    () => articles.filter((a) => a.featured),
    [articles]
  );

  // If no featured articles, use the first 3 as featured
  const heroArticles = useMemo(
    () => (featuredArticles.length > 0 ? featuredArticles : articles.slice(0, Math.min(3, articles.length))),
    [featuredArticles, articles]
  );

  // Filter and sort
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.topics.some((t) => t.toLowerCase().includes(q)) ||
          a.author.name.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeFilters.category.length > 0) {
      result = result.filter((a) =>
        activeFilters.category.includes(a.category)
      );
    }

    // Topic
    if (activeFilters.topic.length > 0) {
      result = result.filter((a) =>
        a.topics.some((t) => activeFilters.topic.includes(t))
      );
    }

    // Read time
    if (activeFilters.readTime.length > 0) {
      result = result.filter((a) =>
        activeFilters.readTime.some((f) => {
          if (f === "< 5 min") return a.readTime < 5;
          if (f === "5-10 min") return a.readTime >= 5 && a.readTime <= 10;
          if (f === "> 10 min") return a.readTime > 10;
          return false;
        })
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedDate).getTime() -
            new Date(b.publishedDate).getTime()
          );
        case "popular":
          return b.views - a.views;
        case "readTime":
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });

    return result;
  }, [articles, searchQuery, activeFilters, sortBy]);

  // Handlers
  const handleFilterChange = useCallback((category: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: (prev[category as keyof typeof prev] || []).includes(value)
        ? (prev[category as keyof typeof prev] || []).filter(
            (v) => v !== value
          )
        : [...(prev[category as keyof typeof prev] || []), value],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({ category: [], topic: [], readTime: [] });
    setSearchQuery("");
    setVisibleCount(INITIAL_LOAD);
  }, []);

  // Reset visible count when filters or search change
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [searchQuery, activeFilters, sortBy]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMoreArticles = visibleCount < filteredArticles.length;

  return (
    <div className="min-h-screen" style={{ background: "#FCFCFB" }}>
      {/* Featured Hero Carousel */}
      {heroArticles.length > 0 && (
        <FeaturedHeroCarousel featuredArticles={heroArticles} />
      )}

      {/* Filter Bar */}
      <ArticleFilterBar
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Articles Grid / List */}
      <section className="py-8 sm:py-12 md:py-16" style={{ background: "#FCFCFB" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h2
                className="text-lg sm:text-xl md:text-2xl"
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  color: "#111111",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span>{filteredArticles.length}</span> Article
                {filteredArticles.length !== 1 ? "s" : ""}
              </h2>
              <p
                className="text-xs sm:text-sm md:text-base"
                style={{
                  color: "rgba(0,0,0,0.45)",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              >
                Insights and expertise from our team
              </p>
            </div>

            {/* Desktop View Toggle (also in filter bar, but here for results context) */}
            <div className="flex items-center space-x-2 sm:hidden">
              <button
                onClick={() => setViewMode("grid")}
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{
                  color:
                    viewMode === "grid" ? "#E53E3E" : "rgba(0,0,0,0.35)",
                  background:
                    viewMode === "grid"
                      ? "rgba(229,62,62,0.1)"
                      : "transparent",
                }}
                aria-label="Grid view"
              >
                <GridIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{
                  color:
                    viewMode === "list" ? "#E53E3E" : "rgba(0,0,0,0.35)",
                  background:
                    viewMode === "list"
                      ? "rgba(229,62,62,0.1)"
                      : "transparent",
                }}
                aria-label="List view"
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>

          {/* Articles Display */}
          {filteredArticles.length > 0 ? (
            <>
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {visibleArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {visibleArticles.map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Load More */}
              {hasMoreArticles && (
                <div className="text-center mt-8 sm:mt-12">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
                    style={{
                      fontFamily: "var(--font-steelfish), Impact, sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "12px 32px",
                      border: "2px solid #E53E3E",
                      color: "#E53E3E",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
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
                    Load More Articles ({filteredArticles.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6"
                style={{ background: "#F3F4F6" }}
              >
                <div style={{ color: "rgba(0,0,0,0.25)" }}>
                  <FileTextIcon size={32} />
                </div>
              </div>
              <h3
                className="text-base sm:text-lg md:text-xl mb-2"
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  color: "#111111",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                No articles found
              </h3>
              <p
                className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6"
                style={{
                  color: "rgba(0,0,0,0.45)",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              >
                {articles.length === 0
                  ? "No articles available yet"
                  : "Try adjusting your filters or search terms"}
              </p>
              {articles.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base transition-colors"
                  style={{
                    border: "1px solid #E53E3E",
                    color: "#E53E3E",
                    background: "transparent",
                    fontFamily: "var(--font-steelfish), Impact, sans-serif",
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

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
