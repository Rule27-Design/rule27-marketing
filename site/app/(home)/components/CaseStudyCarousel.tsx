"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  Clock,
  Eye,
} from "lucide-react";
import type { CaseStudyCard } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Fallback data (mirrors the old static fallback)
// ---------------------------------------------------------------------------

const FALLBACK_STUDIES: CaseStudyCard[] = [
  {
    id: "1",
    title: "TechFlow Solutions",
    category: "SaaS Platform Transformation",
    description:
      "Complete brand overhaul and platform redesign that transformed a struggling startup into an industry leader.",
    beforeMetric: "2.3% Conversion Rate",
    afterMetric: "18.7% Conversion Rate",
    improvement: "+712% Growth",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    videoPreview:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80",
    tags: ["Brand Identity", "UX/UI Design", "Development"],
    timeline: "8 weeks",
    industry: "Technology",
    client: "TechFlow Solutions",
    slug: "techflow-solutions",
  },
];

// ---------------------------------------------------------------------------
// Fallback image component
// ---------------------------------------------------------------------------

function CardImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="font-heading text-2xl tracking-[0.15em] uppercase text-[#E53E3E]/30">
          RULE27
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className={className ?? "object-cover"}
      onError={() => setError(true)}
    />
  );
}

// ---------------------------------------------------------------------------
// CaseStudyCarousel
// ---------------------------------------------------------------------------

interface Props {
  caseStudies: CaseStudyCard[];
}

export default function CaseStudyCarousel({ caseStudies }: Props) {
  const studies = caseStudies.length > 0 ? caseStudies : FALLBACK_STUDIES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || studies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % studies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, studies.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % studies.length);
    setIsAutoPlaying(false);
  }, [studies.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + studies.length) % studies.length
    );
    setIsAutoPlaying(false);
  }, [studies.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-[#111111] mb-6 uppercase tracking-wider">
            Transformation Stories That
            <span className="text-[#E53E3E] block mt-2 font-heading uppercase">
              Speak for Themselves
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto font-sans">
            Whether it&apos;s a new logo or a full-scale system redesign, the
            Rule of Transformation is the same: defy expectations, break
            conventions, and deliver extraordinary results.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {studies.map((study, index) => (
                <div key={study.id || index} className="w-full flex-shrink-0">
                  <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
                    {/* Image Section */}
                    <div className="relative overflow-hidden group">
                      <CardImage
                        src={study.image}
                        alt={study.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Video Preview Overlay */}
                      {study.videoPreview && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 scale-75 group-hover:scale-100 transition-transform duration-300">
                            <Play
                              size={32}
                              className="text-white ml-1"
                              fill="white"
                            />
                          </div>
                        </div>
                      )}

                      {/* Industry Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="bg-[#E53E3E] text-white px-4 py-2 rounded-full text-sm font-heading uppercase tracking-wider">
                          {study.industry}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <span className="text-[#E53E3E] font-heading text-sm uppercase tracking-wider">
                          {study.category}
                        </span>
                        <h3 className="text-4xl font-heading text-[#111111] mt-2 mb-4 uppercase tracking-wide">
                          {study.title}
                        </h3>
                        <p className="text-gray-500 text-lg leading-relaxed font-sans">
                          {study.description}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1 font-sans">
                            Before
                          </div>
                          <div className="font-heading text-[#111111] uppercase">
                            {study.beforeMetric}
                          </div>
                        </div>
                        <div
                          className="text-center p-4 rounded-lg"
                          style={{
                            background: "rgba(229,62,62,0.05)",
                            border: "1px solid rgba(229,62,62,0.2)",
                          }}
                        >
                          <div className="text-sm text-[#E53E3E] mb-1 font-sans">
                            After
                          </div>
                          <div className="font-heading text-[#E53E3E] uppercase">
                            {study.afterMetric}
                          </div>
                        </div>
                      </div>

                      {/* Improvement Badge */}
                      <div className="text-center mb-8">
                        <span
                          className="px-6 py-3 rounded-full font-heading text-xl uppercase tracking-wider inline-block"
                          style={{
                            background: "#10B981",
                            color: "#fff",
                          }}
                        >
                          {study.improvement}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {study.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 rounded-full text-sm font-sans"
                            style={{
                              background: "rgba(17,17,17,0.05)",
                              color: "#111",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center text-gray-500 mb-8 font-sans">
                        <Clock size={16} className="mr-2" />
                        <span className="text-sm">
                          Completed in {study.timeline}
                        </span>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/case-studies/${study.slug}`}
                        className="w-full flex items-center justify-center gap-2 rounded-lg uppercase tracking-wider transition-all duration-300"
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "0.875rem",
                          padding: "0.75rem 1.5rem",
                          border: "2px solid #E53E3E",
                          color: "#E53E3E",
                          background: "transparent",
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
                        <span>View Full Case Study</span>
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {studies.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#111111] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous case study"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#111111] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next case study"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {studies.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {studies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    background:
                      index === currentSlide
                        ? "#E53E3E"
                        : "rgba(209,213,219,1)",
                    transform:
                      index === currentSlide ? "scale(1.25)" : "scale(1)",
                  }}
                  aria-label={`Go to case study ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-16"
        >
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 rounded-lg uppercase tracking-wider transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              padding: "1rem 2rem",
              background: "#111111",
              color: "#FFFFFF",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",
            }}
          >
            <Eye size={20} />
            <span>Witness the Transformation</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
