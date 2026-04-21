"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Palette,
  TrendingUp,
  Globe,
  Cpu,
  ArrowRight,
  Compass,
  MessageCircle,
  Target,
  Code,
  Zap,
} from "lucide-react";
import { CalendlyModal } from "@/app/components/CalendlyModal";
import type { ServiceZone } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Icon mapping - Lucide icons, NOT emojis
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Palette,
  TrendingUp,
  Globe,
  Cpu,
  Target,
  Code,
  Zap,
  Compass,
};

function ZoneIcon({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const IconComponent = ICON_MAP[name] ?? Zap;
  return <IconComponent size={size} className={className} />;
}

// ---------------------------------------------------------------------------
// Fallback data (mirrors old static data)
// ---------------------------------------------------------------------------

const FALLBACK_ZONES: ServiceZone[] = [
  {
    id: "creative-studio",
    slug: "creative-studio",
    title: "Creative Studio",
    subtitle: "Visual Identity & Brand Design",
    description:
      "Where bold ideas take visual form. We craft distinctive brand identities that command attention and drive emotional connection.",
    icon: "Palette",
    features: [
      "Brand Identity Design",
      "Visual System Creation",
      "Creative Direction",
      "Art Direction",
    ],
    stats: { projects: 150, satisfaction: 98 },
    previewImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    title: "Digital Marketing",
    subtitle: "Performance & Growth Strategy",
    description:
      "Data-driven campaigns that don't just reach audiences - they move them. Measurable growth at every touchpoint.",
    icon: "TrendingUp",
    features: [
      "SEO & Content Strategy",
      "Paid Media",
      "Email Marketing",
      "Analytics",
    ],
    stats: { projects: 120, satisfaction: 97 },
    previewImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "development-lab",
    slug: "development-lab",
    title: "Development Lab",
    subtitle: "Full-Stack Engineering",
    description:
      "Performant, scalable applications built with modern architectures. From web platforms to mobile experiences.",
    icon: "Code",
    features: ["Web Development", "Mobile Apps", "E-Commerce", "API Design"],
    stats: { projects: 200, satisfaction: 99 },
    previewImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    id: "executive-advisory",
    slug: "executive-advisory",
    title: "Executive Advisory",
    subtitle: "Strategic Consulting",
    description:
      "C-suite consulting that connects creative vision with business outcomes. Strategy that scales.",
    icon: "Target",
    features: [
      "Brand Strategy",
      "Digital Roadmaps",
      "Market Analysis",
      "Growth Planning",
    ],
    stats: { projects: 80, satisfaction: 100 },
    previewImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
];

// ---------------------------------------------------------------------------
// Zone color configuration helpers
// ---------------------------------------------------------------------------

interface ZoneColors {
  gradient: string;
  dotBg: string;
  textColor: string;
}

function getZoneColors(zone: ServiceZone): ZoneColors {
  // Use zone-provided colors, with sensible fallbacks
  return {
    gradient: zone.color ?? "from-accent to-red-400",
    dotBg: zone.bgColor ?? "bg-[#E53E3E]/20",
    textColor: zone.textColor ?? "text-[#E53E3E]",
  };
}

// ---------------------------------------------------------------------------
// Zone image with fallback
// ---------------------------------------------------------------------------

function ZoneImage({
  src,
  alt,
  isHovered,
}: {
  src?: string;
  alt: string;
  isHovered: boolean;
}) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <span className="font-heading text-xl tracking-[0.15em] uppercase text-[#E53E3E]/20">
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
      className="object-cover transition-all duration-1000"
      style={{
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
      onError={() => setError(true)}
    />
  );
}

// ---------------------------------------------------------------------------
// CapabilityZones
// ---------------------------------------------------------------------------

interface Props {
  serviceZones: ServiceZone[];
}

export default function CapabilityZones({ serviceZones }: Props) {
  const zones = serviceZones.length > 0 ? serviceZones : FALLBACK_ZONES;
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1) {
              setVisibleCards((prev) =>
                prev.includes(index) ? prev : [...prev, index]
              );
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
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
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading text-[#111111] mb-6 uppercase tracking-wider">
            Four Universes of
            <span
              className="block mt-2 font-heading uppercase"
              style={{
                background: "linear-gradient(to right, #E53E3E, #F87171)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Creative Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto font-sans">
            Each zone represents a mastery domain where we&apos;ve redefined
            what&apos;s possible. Explore the capabilities that make Rule27
            Design the creative partner of choice.
          </p>
        </motion.div>

        {/* Capability Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {zones.map((capability, index) => {
            const isHovered = hoveredZone === capability.id;
            const colors = getZoneColors(capability);
            const isVisible = visibleCards.includes(index);

            return (
              <div
                key={capability.id || index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="relative group cursor-pointer transition-all duration-700"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? isHovered
                      ? "translateY(0) scale(1.02)"
                      : "translateY(0) scale(1)"
                    : "translateY(40px) scale(1)",
                  zIndex: isHovered ? 10 : 1,
                }}
                onMouseEnter={() => setHoveredZone(capability.id)}
                onMouseLeave={() => setHoveredZone(null)}
              >
                <div
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full transition-all duration-500"
                  style={{
                    boxShadow: isHovered
                      ? "0 25px 50px -12px rgba(0,0,0,0.25)"
                      : "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <ZoneImage
                      src={capability.previewImage}
                      alt={capability.title}
                      isHovered={isHovered}
                    />

                    {/* Dynamic Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} transition-opacity duration-500`}
                      style={{ opacity: isHovered ? 0.9 : 0.8 }}
                    />

                    {/* Animated Icon */}
                    <div className="absolute top-6 left-6">
                      <div
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                          transform: isHovered
                            ? "scale(1.1) rotate(12deg)"
                            : "scale(1) rotate(0deg)",
                        }}
                      >
                        <ZoneIcon
                          name={capability.icon}
                          size={24}
                          className="text-white"
                        />
                      </div>
                    </div>

                    {/* Stats Overlay (appears on hover) */}
                    {capability.stats && (
                      <div
                        className="absolute bottom-4 right-4 transition-all duration-500"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered
                            ? "translateY(0)"
                            : "translateY(16px)",
                        }}
                      >
                        <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                          <div className="flex space-x-4 text-white text-sm">
                            <div
                              className="text-center"
                              style={{
                                animation: isHovered
                                  ? "fadeInUp 0.3s ease-out 0s both"
                                  : "none",
                              }}
                            >
                              <div className="font-heading text-xl uppercase">
                                {capability.stats.projects}+
                              </div>
                              <div className="capitalize opacity-90 text-xs font-sans">
                                projects
                              </div>
                            </div>
                            <div
                              className="text-center"
                              style={{
                                animation: isHovered
                                  ? "fadeInUp 0.3s ease-out 0.1s both"
                                  : "none",
                              }}
                            >
                              <div className="font-heading text-xl uppercase">
                                {capability.stats.satisfaction}%
                              </div>
                              <div className="capitalize opacity-90 text-xs font-sans">
                                satisfaction
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    <div className="mb-4">
                      <h3 className="text-3xl font-heading text-[#111111] mb-2 uppercase tracking-wide">
                        {capability.title}
                      </h3>
                      <p
                        className={`text-lg font-heading ${colors.textColor} uppercase tracking-wider`}
                      >
                        {capability.subtitle}
                      </p>
                    </div>

                    <p className="text-gray-500 mb-6 leading-relaxed font-sans">
                      {capability.description}
                    </p>

                    {/* Features Grid */}
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-2">
                        {capability.features?.slice(0, 4).map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2 transition-all duration-300"
                            style={{
                              transitionDelay: `${featureIndex * 50}ms`,
                              transform: isHovered
                                ? "translateX(8px)"
                                : "translateX(0)",
                            }}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${colors.dotBg} transition-transform duration-300`}
                              style={{
                                transform: isHovered
                                  ? "scale(1.5)"
                                  : "scale(1)",
                              }}
                            />
                            <span className="text-sm text-gray-500 font-sans">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover Link */}
                    <div
                      className="transition-all duration-500"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered
                          ? "translateY(0)"
                          : "translateY(16px)",
                        pointerEvents: isHovered ? "auto" : "none",
                      }}
                    >
                      <Link
                        href="/capabilities"
                        className="flex items-center space-x-2 font-heading uppercase tracking-wider group/link"
                      >
                        <span
                          style={{
                            background:
                              "linear-gradient(to right, #E53E3E, #F87171)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          Explore This Universe
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-[#E53E3E] transition-transform duration-300 group-hover/link:translate-x-2"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative overflow-hidden text-center rounded-2xl p-12" style={{ background: "linear-gradient(90deg, #000000, #1a1a1a, #E53E3E)", color: "#FFFFFF" }}>
            {/* Animated shimmer background */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)",
                  backgroundSize: "20px 20px",
                  animation: "shimmer 8s linear infinite",
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-heading mb-4 uppercase tracking-wider">
                Ready to Experience All Four Universes?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-sans">
                Let&apos;s discuss how our integrated approach can transform your
                brand&apos;s trajectory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/capabilities"
                  className="inline-flex items-center justify-center space-x-2 rounded-lg uppercase tracking-wider transition-all duration-300 hover:scale-105"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1rem",
                    padding: "1rem 2rem",
                    background: "#FFFFFF",
                    color: "#111111",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",
                  }}
                >
                  <Compass size={20} />
                  <span>Explore All Capabilities</span>
                </Link>
                <button
                  onClick={() => setCalendlyOpen(true)}
                  className="inline-flex items-center justify-center space-x-2 rounded-lg uppercase tracking-wider transition-all duration-300 hover:scale-105"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1rem",
                    padding: "1rem 2rem",
                    border: "2px solid #FFFFFF",
                    color: "#FFFFFF",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                >
                  <MessageCircle size={20} />
                  <span>Book Free Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
}
