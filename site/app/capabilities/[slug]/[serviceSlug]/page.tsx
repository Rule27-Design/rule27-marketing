import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getService } from "@/app/lib/data/services";
import type {
  ProcessStep,
  PricingTier,
  Service,
  SuccessMetric,
} from "@/app/lib/types";
import { Card, StatCard } from "@/app/components/Card";
import { StickyCTA } from "./StickyCTA";
import { Accordion } from "@/app/components/Accordion";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { ShowcaseGallery } from "./ShowcaseGallery";
import { BookCallButton } from "@/app/components/BookCallButton";
import { Tooltip } from "@/app/components/Tooltip";
import { ConversionBreak } from "@/app/components/ConversionBreak";
import { BeforeAfterSlider } from "@/app/components/BeforeAfterSlider";
import { ExpandableCard } from "@/app/components/ExpandableCard";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { ContextualPopup } from "@/app/components/ContextualPopup";
import type { RoiFormula } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Inline SVG icons (server-safe)
// ---------------------------------------------------------------------------

function ServiceIcon({ name, size = 24 }: { name: string; size?: number }) {
  const stroke = "currentColor";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "Palette":
      return (
        <svg {...common}>
          <circle cx="13.5" cy="6.5" r=".5" fill={stroke} />
          <circle cx="17.5" cy="10.5" r=".5" fill={stroke} />
          <circle cx="8.5" cy="7.5" r=".5" fill={stroke} />
          <circle cx="6.5" cy="12.5" r=".5" fill={stroke} />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      );
    case "Target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "Code":
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "Briefcase":
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "Layers":
      return (
        <svg {...common}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "PenTool":
      return (
        <svg {...common}>
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case "BarChart":
      return (
        <svg {...common}>
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      );
    case "Globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E53E3E"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Dynamic SEO metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; serviceSlug: string }>;
}): Promise<Metadata> {
  const { serviceSlug } = await params;
  const { service, zone } = await getService(serviceSlug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  const title =
    service.metaTitle || `${service.title} | ${zone?.title || "Services"} | Rule27 Design`;
  const description = service.metaDescription || service.tagline || service.description;

  return {
    title,
    description,
    openGraph: {
      title: `${service.title} | Rule27 Design`,
      description,
      type: "website",
      url: `https://www.rule27design.com/capabilities/${zone?.slug || "services"}/${service.slug}`,
      ...(service.heroImage ? { images: [{ url: service.heroImage }] } : {}),
    },
    alternates: {
      canonical: `https://www.rule27design.com/capabilities/${zone?.slug || "services"}/${service.slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; serviceSlug: string }>;
}) {
  const { serviceSlug } = await params;
  const { service, zone, relatedServices, relatedCaseStudies, testimonials } =
    await getService(serviceSlug);

  if (!service) {
    notFound();
  }

  const zoneSlug = zone?.slug || "";
  const zoneTitle = zone?.title || "Services";

  // Build social proof stats for the hero bar
  const heroStats: { label: string; value: string }[] = [];
  if (service.clientsServed && service.clientsServed > 0)
    heroStats.push({ label: "Clients Served", value: `${service.clientsServed}+` });
  if (service.satisfactionRate)
    heroStats.push({ label: "Satisfaction", value: `${service.satisfactionRate}%` });
  if (service.avgRoi)
    heroStats.push({ label: "Avg. ROI", value: service.avgRoi });
  if (service.turnaround)
    heroStats.push({ label: "Turnaround", value: service.turnaround });

  const hasSuccessMetrics =
    service.successMetrics && service.successMetrics.length > 0;
  const hasShowcaseImages =
    service.showcaseImages && service.showcaseImages.length > 0;
  const hasTestimonials = testimonials && testimonials.length > 0;
  const hasCaseStudies = relatedCaseStudies && relatedCaseStudies.length > 0;
  const hasFaqs = service.faqs && service.faqs.length > 0;
  const hasPricing = service.pricingTiers && service.pricingTiers.length > 0;
  const hasTechnologies = service.technologies && service.technologies.length > 0;

  return (
    <div style={{ background: "#FCFCFB", minHeight: "100vh" }}>
      <ScrollProgress />

      {/* ================================================================ */}
      {/* 1. DARK HERO - Full viewport, homepage-matching energy           */}
      {/* ================================================================ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "#000000",
        }}
      >
        {/* Hero background image with overlay */}
        {service.heroImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
            }}
          >
            <Image
              src={service.heroImage}
              alt={service.title}
              fill
              priority
              style={{ objectFit: "cover", opacity: 0.25 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%)",
              }}
            />
          </div>
        )}

        {/* Gradient mesh background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #000 0%, #111 50%, #000 100%)",
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "50%",
                  background:
                    "radial-gradient(circle, rgba(229,62,62,0.2), transparent)",
                  filter: "blur(48px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "50%",
                  height: "50%",
                  background:
                    "radial-gradient(circle, rgba(229,62,62,0.1), transparent)",
                  filter: "blur(48px)",
                }}
              />
            </div>
          </div>

          {/* Grid pattern */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
            <div
              style={{
                height: "100%",
                width: "100%",
                backgroundImage:
                  "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
                backgroundSize: "4rem 4rem",
              }}
            />
          </div>
        </div>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "8rem 1.5rem 4rem",
            width: "100%",
          }}
        >
          {/* Breadcrumb */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/capabilities"
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
            >
              Capabilities
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <Link
              href={`/capabilities/${zoneSlug}`}
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
            >
              {zoneTitle}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
            <span style={{ color: "#E53E3E" }}>{service.title}</span>
          </nav>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "#E53E3E",
                padding: "5px 14px",
                borderRadius: 2,
              }}
            >
              {service.category}
            </span>
            {zone && (
              <Link
                href={`/capabilities/${zoneSlug}`}
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                    background: "rgba(255,255,255,0.08)",
                    padding: "5px 14px",
                    borderRadius: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span style={{ color: "#E53E3E" }}>
                    <ServiceIcon name={zone.icon} size={12} />
                  </span>
                  {zoneTitle}
                </span>
              </Link>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 7vw, 5rem)",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: "0 0 1.25rem",
              lineHeight: 0.95,
              maxWidth: 900,
            }}
          >
            {service.title}
          </h1>

          {/* Tagline or description */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              margin: "0 0 2.5rem",
              maxWidth: 700,
            }}
          >
            {service.tagline || service.description}
          </p>

          {/* Social proof bar */}
          {heroStats.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "2.5rem",
                marginBottom: "2.5rem",
                flexWrap: "wrap",
              }}
            >
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(2rem, 4vw, 2.75rem)",
                      color: "#E53E3E",
                      lineHeight: 1,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: "0.25rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <BookCallButton
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "16px 36px",
                color: "#FFFFFF",
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.6)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                borderRadius: "4px",
                transition: "all 0.3s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              Get Started
            </BookCallButton>
            <BookCallButton
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "16px 36px",
                color: "#FFFFFF",
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                borderRadius: "4px",
                transition: "all 0.3s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Book Free Consultation
            </BookCallButton>
          </div>

          {/* Availability / Urgency */}
          {service.availability && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(229,62,62,0.1)",
                border: "1px solid rgba(229,62,62,0.2)",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#E53E3E",
                  display: "inline-block",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {service.availability}
              </span>
            </div>
          )}
        </div>

        {/* Bottom gradient fade to content */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8rem",
            background: "linear-gradient(to top, #FCFCFB, transparent)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Keyframe for pulsing dot */}
        <style>{`
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
          }
        `}</style>
      </section>

      {/* ================================================================ */}
      {/* 2. SUCCESS METRICS                                                */}
      {/* ================================================================ */}
      {hasSuccessMetrics && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                marginBottom: "1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: 0,
              }}
            >
              Proven Results
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {service.successMetrics!.map((metric: SuccessMetric, i: number) => (
              <div key={i} style={{
                padding: "1.25rem",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                borderTop: "2px solid #E53E3E",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: "radial-gradient(circle, rgba(229,62,62,0.03) 0%, transparent 70%)" }} />
                <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(0,0,0,0.45)", textTransform: "uppercase", margin: "0 0 0.5rem 0", fontWeight: 500 }}>
                  {metric.metric}
                </p>
                <span style={{ fontFamily: "'Steelfish', 'Impact', sans-serif", fontSize: "32px", color: "#111", lineHeight: 1, display: "block" }}>
                  {metric.value}
                </span>
                {metric.description && (
                  <p style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "12px", color: "rgba(0,0,0,0.45)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                    {metric.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Conversion Break: after metrics (from DB, or default) ── */}
      {service.conversionBreaks?.some((cb: { position: string }) => cb.position === "after_metrics")
        ? service.conversionBreaks.filter((cb: { position: string }) => cb.position === "after_metrics").map((cb: { text: string; cta: string; action: "calendly" | "scroll" | "link"; href?: string }, i: number) => (
            <ConversionBreak key={`cb-metrics-${i}`} text={cb.text} ctaText={cb.cta} action={cb.action} href={cb.href} />
          ))
        : (
            <ConversionBreak
              text="Want results like these for your business?"
              ctaText="Book a free strategy call"
              action="calendly"
            />
          )
      }

      {/* ================================================================ */}
      {/* 3. SHOWCASE GALLERY                                               */}
      {/* ================================================================ */}
      {hasShowcaseImages && (
        <section
          style={{
            padding: "clamp(2rem, 4vw, 3rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                marginBottom: "1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: 0,
              }}
            >
              See Our Work in Action
            </h2>
          </div>

          <ShowcaseGallery images={service.showcaseImages!} title={service.title} />

          {/* Before/After Slider */}
          {service.beforeImage && service.afterImage && (
            <div style={{ marginTop: "2rem" }}>
              <BeforeAfterSlider
                beforeImage={service.beforeImage}
                afterImage={service.afterImage}
              />
            </div>
          )}
        </section>
      )}

      {/* Show BeforeAfterSlider even without showcase images */}
      {!hasShowcaseImages && service.beforeImage && service.afterImage && (
        <section style={{ padding: "clamp(2rem, 4vw, 3rem) 1.5rem", maxWidth: 900, margin: "0 auto" }}>
          <BeforeAfterSlider
            beforeImage={service.beforeImage}
            afterImage={service.afterImage}
          />
        </section>
      )}

      {/* ================================================================ */}
      {/* 4. WHAT'S INCLUDED (Features)                                     */}
      {/* ================================================================ */}
      {service.features.length > 0 && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                marginBottom: "1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.5rem",
              }}
            >
              What&apos;s Included
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.5)",
                margin: 0,
                maxWidth: 600,
              }}
            >
              Everything you need, nothing you don&apos;t. Each engagement is built to deliver measurable results.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1rem",
            }}
          >
            {service.features.map((feature, i) => (
              <Card key={i}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <CheckIcon size={18} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.95rem",
                      color: "rgba(0,0,0,0.65)",
                      lineHeight: 1.6,
                    }}
                  >
                    {feature}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Conversion Break: after features (DB custom, or lead magnet fallback) ── */}
      {service.conversionBreaks?.some((cb: { position: string }) => cb.position === "after_features")
        ? service.conversionBreaks.filter((cb: { position: string }) => cb.position === "after_features").map((cb: { text: string; cta: string; action: "calendly" | "scroll" | "link"; href?: string }, i: number) => (
            <ConversionBreak key={`cb-features-${i}`} text={cb.text} ctaText={cb.cta} action={cb.action} href={cb.href} />
      ))
        : service.leadMagnetUrl && service.leadMagnetTitle ? (
            <ConversionBreak
              text={service.leadMagnetDescription || "Download our comprehensive guide"}
              ctaText={`Download: ${service.leadMagnetTitle}`}
              action="link"
              href={service.leadMagnetUrl}
            />
          ) : null
      }

      {/* ================================================================ */}
      {/* 5. CLIENT RESULTS (Case Studies)                                  */}
      {/* ================================================================ */}
      {hasCaseStudies && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                marginBottom: "1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.5rem",
              }}
            >
              Real Client Outcomes
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.5)",
                margin: 0,
              }}
            >
              Don&apos;t take our word for it. Here&apos;s what we&apos;ve delivered.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {/* eslint-disable @typescript-eslint/no-explicit-any */}
            {relatedCaseStudies.map((cs: any) => (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "all 0.3s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    height: "100%",
                  }}
                >
                  {/* Case study image */}
                  {cs.heroImage && (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: 180,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={cs.heroImage}
                        alt={cs.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                        }}
                      />
                      {/* Industry badge */}
                      {cs.industry && (
                        <span
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontFamily: "var(--font-heading)",
                            fontSize: "9px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#FFFFFF",
                            background: "rgba(229,62,62,0.85)",
                            padding: "3px 10px",
                            borderRadius: 2,
                          }}
                        >
                          {cs.industry}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ padding: "1.25rem" }}>
                    {/* Client name */}
                    {cs.client && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#E53E3E",
                          margin: "0 0 0.35rem",
                        }}
                      >
                        {cs.client}
                      </p>
                    )}

                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#111111",
                        margin: "0 0 0.5rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {cs.title}
                    </h3>

                    {cs.description && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.8rem",
                          color: "rgba(0,0,0,0.5)",
                          lineHeight: 1.5,
                          margin: "0 0 0.75rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {cs.description}
                      </p>
                    )}

                    {/* Key metrics */}
                    {cs.keyMetrics && cs.keyMetrics.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          borderTop: "1px solid rgba(0,0,0,0.06)",
                          paddingTop: "0.75rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {cs.keyMetrics.slice(0, 2).map(
                          (
                            metric: { label?: string; improvement?: string },
                            mi: number,
                          ) => (
                            <div key={mi}>
                              {metric.improvement && (
                                <div
                                  style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "1.1rem",
                                    color: "#E53E3E",
                                    lineHeight: 1,
                                  }}
                                >
                                  {metric.improvement}
                                </div>
                              )}
                              {metric.label && (
                                <div
                                  style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.65rem",
                                    color: "rgba(0,0,0,0.4)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {metric.label}
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    {/* View link */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "0.75rem",
                        fontFamily: "var(--font-heading)",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#E53E3E",
                      }}
                    >
                      View Case Study
                      <ArrowRightIcon size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {/* eslint-enable @typescript-eslint/no-explicit-any */}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 6. TESTIMONIALS                                                   */}
      {/* ================================================================ */}
      {hasTestimonials && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            background: "#FFFFFF",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: "#E53E3E",
                  margin: "0 auto 1rem",
                }}
                aria-hidden="true"
              />
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#111111",
                  margin: "0 0 0.5rem",
                }}
              >
                What Our Clients Say
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  color: "rgba(0,0,0,0.5)",
                  margin: 0,
                }}
              >
                Real feedback from real partners
              </p>
            </div>

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* ── Conversion Break: after testimonials (from DB, or default) ── */}
      {service.conversionBreaks?.some((cb: { position: string }) => cb.position === "after_testimonials")
        ? service.conversionBreaks.filter((cb: { position: string }) => cb.position === "after_testimonials").map((cb: { text: string; cta: string; action: "calendly" | "scroll" | "link"; href?: string }, i: number) => (
            <ConversionBreak key={`cb-test-${i}`} text={cb.text} ctaText={cb.cta} action={cb.action} href={cb.href} />
          ))
        : (
            <ConversionBreak
              text="Ready to see these results for yourself?"
              ctaText="Get started today"
              action="calendly"
            />
          )
      }

      {/* ── ROI Formula Card ── */}
      {service.roiFormula && (
        <section style={{ padding: "clamp(2rem, 4vw, 3rem) 1.5rem", maxWidth: 800, margin: "0 auto" }}>
          <ExpandableCard
            title={(service.roiFormula as RoiFormula).title || "How We Calculate Your Return"}
            preview="See the exact formula we use to project your results"
          >
            <div style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "14px", color: "rgba(0,0,0,0.6)", lineHeight: 1.7 }}>
              <p style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#111" }}>Formula:</strong> {(service.roiFormula as RoiFormula).formula}
              </p>
              {(service.roiFormula as RoiFormula).example && (
                <>
                  <p style={{ fontFamily: "'Steelfish', Impact, sans-serif", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#E53E3E", marginBottom: "0.5rem" }}>
                    Example Calculation
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                    {Object.entries((service.roiFormula as RoiFormula).example.inputs).map(([key, val]) => (
                      <div key={key} style={{ background: "rgba(229,62,62,0.04)", padding: "0.75rem", borderTop: "2px solid #E53E3E" }}>
                        <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: "0.25rem" }}>{key}</div>
                        <div style={{ fontFamily: "'Steelfish', Impact, sans-serif", fontSize: "1.25rem", color: "#111" }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#111", color: "#FFFFFF", padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>Projected Result</div>
                    <div style={{ fontFamily: "'Steelfish', Impact, sans-serif", fontSize: "2rem", color: "#E53E3E" }}>{(service.roiFormula as RoiFormula).example.result}</div>
                  </div>
                  {(service.roiFormula as RoiFormula).example.explanation && (
                    <p style={{ marginTop: "1rem", fontSize: "13px", color: "rgba(0,0,0,0.5)" }}>{(service.roiFormula as RoiFormula).example.explanation}</p>
                  )}
                </>
              )}
            </div>
          </ExpandableCard>
        </section>
      )}

      {/* ================================================================ */}
      {/* 7. OUR PROCESS                                                    */}
      {/* ================================================================ */}
      {service.process.length > 0 && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                margin: "0 auto 1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.5rem",
              }}
            >
              Our Process
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.5)",
                margin: 0,
              }}
            >
              A battle-tested approach that delivers every time
            </p>
          </div>

          {/* Process timeline */}
          <div
            style={{
              position: "relative",
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            {/* Vertical line */}
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 24,
                bottom: 24,
                width: 2,
                background:
                  "linear-gradient(to bottom, #E53E3E, rgba(229,62,62,0.1))",
              }}
            />

            {service.process.map((step: ProcessStep, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginBottom: i < service.process.length - 1 ? "2rem" : 0,
                  position: "relative",
                }}
              >
                {/* Step number circle */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#E53E3E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 1,
                    boxShadow: "0 4px 12px rgba(229,62,62,0.3)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.25rem",
                      color: "#FFFFFF",
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Step content card */}
                <div
                  style={{
                    flex: 1,
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 2,
                    padding: "1.5rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {step.title && (
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.1rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#111111",
                        margin: "0 0 0.5rem",
                      }}
                    >
                      {step.title}
                    </h3>
                  )}
                  {step.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9rem",
                        color: "rgba(0,0,0,0.55)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {step.description}
                    </p>
                  )}
                  {(step as ProcessStep & { duration?: string }).duration && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "0.75rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "#E53E3E",
                        background: "rgba(229,62,62,0.06)",
                        padding: "4px 10px",
                        borderRadius: 2,
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
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
                      {(step as ProcessStep & { duration?: string }).duration}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 8. TECHNOLOGIES                                                   */}
      {/* ================================================================ */}
      {hasTechnologies && (
        <section
          style={{
            padding: "clamp(2rem, 4vw, 3rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                marginBottom: "1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: 0,
              }}
            >
              Technologies &amp; Tools
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {service.technologies.map((tech, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "rgba(0,0,0,0.6)",
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: "8px 16px",
                  borderRadius: 2,
                  transition: "all 0.2s",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 9. INVESTMENT / PRICING                                           */}
      {/* ================================================================ */}
      {hasPricing ? (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                margin: "0 auto 1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.5rem",
              }}
            >
              Investment Options
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.45)",
                margin: 0,
              }}
            >
              Flexible packages designed for measurable ROI
              {service.avgRoi &&
                ` - clients typically see ${service.avgRoi} returns`}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
              gap: "1.5rem",
              maxWidth: service.pricingTiers.length <= 3 ? 1000 : undefined,
              margin: service.pricingTiers.length <= 3 ? "0 auto" : undefined,
            }}
          >
            {service.pricingTiers.map((tier: PricingTier, i: number) => {
              const isPopular =
                (tier as PricingTier & { popular?: boolean }).popular ||
                (service.pricingTiers.length === 3 && i === 1);

              return (
                <div
                  key={i}
                  style={{
                    background: "#FFFFFF",
                    border: isPopular
                      ? "2px solid #E53E3E"
                      : "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    padding: "2.5rem 2rem",
                    position: "relative",
                    transform: isPopular ? "scale(1.03)" : "none",
                    boxShadow: isPopular
                      ? "0 12px 32px rgba(229,62,62,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: "50%",
                        transform: "translateX(-50%) translateY(-50%)",
                        background: "#E53E3E",
                        padding: "5px 20px",
                        borderRadius: 2,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "10px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#FFFFFF",
                        }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.1rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 0.25rem",
                      textAlign: "center",
                    }}
                  >
                    {tier.name}
                  </h3>

                  {tier.price && (
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "2.5rem",
                        color: "#E53E3E",
                        textAlign: "center",
                        margin: "0.5rem 0",
                        lineHeight: 1,
                      }}
                    >
                      {tier.price}
                    </div>
                  )}

                  {tier.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        color: "rgba(0,0,0,0.45)",
                        textAlign: "center",
                        margin: "0 0 1.75rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {tier.description}
                    </p>
                  )}

                  {tier.features && tier.features.length > 0 && (
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0 0 1.75rem",
                      }}
                    >
                      {tier.features.map((feature, fi) => (
                        <li
                          key={fi}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                            padding: "0.5rem 0",
                            borderBottom:
                              fi < (tier.features?.length || 0) - 1
                                ? "1px solid rgba(0,0,0,0.04)"
                                : "none",
                          }}
                        >
                          <CheckIcon size={14} />
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.85rem",
                              color: "rgba(0,0,0,0.6)",
                              lineHeight: 1.5,
                            }}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <BookCallButton
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "14px 24px",
                      background: isPopular ? "#E53E3E" : "transparent",
                      color: isPopular ? "#FFFFFF" : "#111111",
                      border: isPopular
                        ? "2px solid #E53E3E"
                        : "2px solid rgba(0,0,0,0.15)",
                      borderRadius: 2,
                      transition: "all 0.3s",
                    }}
                  >
                    Get Started
                  </BookCallButton>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        /* Custom Pricing CTA when no tiers exist */
        <section
          style={{
            padding: "clamp(2.5rem, 5vw, 4rem) 1.5rem",
            maxWidth: 800,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.06)",
              borderTop: "3px solid #E53E3E",
              borderRadius: 2,
              padding: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.75rem",
              }}
            >
              Custom Pricing
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.5)",
                margin: "0 0 1.5rem",
                lineHeight: 1.7,
              }}
            >
              Every project is unique. We&apos;ll build a proposal around your goals, timeline, and budget
              {service.avgRoi && ` - our clients typically see ${service.avgRoi} returns on their investment`}.
            </p>
            <BookCallButton
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 36px",
                background: "#E53E3E",
                color: "#FFFFFF",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(229,62,62,0.25)",
              }}
            >
              Get a Custom Quote
              <ArrowRightIcon size={16} />
            </BookCallButton>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 10. FAQ SECTION                                                   */}
      {/* ================================================================ */}
      {hasFaqs && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                marginBottom: "1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.5rem",
              }}
            >
              Common Questions About {service.title}
            </h2>
          </div>

          <Accordion items={service.faqs!.map((faq) => ({ q: faq.question, a: faq.answer }))} />
        </section>
      )}

      {/* ================================================================ */}
      {/* 11. FINAL CONVERSION CTA                                          */}
      {/* ================================================================ */}
      <section
        style={{
          background: "#111111",
          padding: "clamp(4rem, 8vw, 6rem) 1.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage:
                "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
            }}
          />
        </div>

        {/* Gradient mesh */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "40%",
            height: "100%",
            background: "radial-gradient(circle, rgba(229,62,62,0.08), transparent)",
            filter: "blur(48px)",
          }}
        />

        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 40,
              height: 2,
              background: "#E53E3E",
              margin: "0 auto 1.5rem",
            }}
            aria-hidden="true"
          />
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: "0 0 1.25rem",
              lineHeight: 1.05,
            }}
          >
            Ready to Transform Your {service.category}?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "rgba(255,255,255,0.65)",
              margin: "0 0 2.5rem",
              lineHeight: 1.7,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Stop settling for ordinary. Let our team craft a {service.title.toLowerCase()} strategy
            that drives real results for your business. Your first consultation is on us.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            <BookCallButton
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "16px 40px",
                background: "#E53E3E",
                color: "#FFFFFF",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(229,62,62,0.35)",
                transition: "all 0.3s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              Get Started Now
            </BookCallButton>
            <BookCallButton
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "16px 40px",
                background: "transparent",
                color: "#FFFFFF",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                borderRadius: 2,
                transition: "all 0.3s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Book Free Consultation
            </BookCallButton>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            {service.guarantee && (
              <TrustIndicator
                icon="shield"
                label={service.guarantee}
              />
            )}
            <TrustIndicator icon="clock" label="Response within 24 hours" />
            <TrustIndicator icon="shield" label="No commitment required" />
            <TrustIndicator icon="check" label="Free consultation" />
          </div>

          {/* Urgency repeat */}
          {service.availability && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "2rem",
                background: "rgba(229,62,62,0.1)",
                border: "1px solid rgba(229,62,62,0.2)",
                padding: "10px 20px",
                borderRadius: 4,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#E53E3E",
                  display: "inline-block",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {service.availability}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 12. RELATED SERVICES                                              */}
      {/* ================================================================ */}
      {relatedServices.length > 0 && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#E53E3E",
                marginBottom: "1rem",
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.5rem",
              }}
            >
              Explore More from {zoneTitle}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.5)",
                margin: 0,
              }}
            >
              Complementary services that amplify your results
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {relatedServices.map((related: Service) => (
              <Link
                key={related.id}
                href={`/capabilities/${zoneSlug}/${related.slug}`}
                style={{ textDecoration: "none" }}
              >
                <Card>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "rgba(229,62,62,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#E53E3E",
                      }}
                    >
                      <ServiceIcon name={related.icon} size={20} />
                    </div>
                    {related.isFeatured && (
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "8px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#FFFFFF",
                          background: "#E53E3E",
                          padding: "3px 8px",
                          borderRadius: 2,
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {related.title}
                  </h3>

                  {related.tagline && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        color: "#E53E3E",
                        margin: "0 0 0.35rem",
                        fontStyle: "italic",
                      }}
                    >
                      {related.tagline}
                    </p>
                  )}

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: 1.5,
                      margin: "0 0 0.75rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {related.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontFamily: "var(--font-heading)",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#E53E3E",
                    }}
                  >
                    Learn More
                    <ArrowRightIcon size={12} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back links */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem 3rem",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <Link
          href={`/capabilities/${zoneSlug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-heading)",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#E53E3E",
            textDecoration: "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to {zoneTitle}
        </Link>
        <Link
          href="/capabilities"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-heading)",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.4)",
            textDecoration: "none",
          }}
        >
          All Capabilities
        </Link>
      </div>

      {/* ================================================================ */}
      {/* 13. STICKY CTA BAR                                                */}
      {/* ================================================================ */}
      {/* ── Contextual Popup (60% scroll depth, once per session) ── */}
      <ContextualPopup
        triggerDepth={0.6}
        title="Quick question"
        text={`We can show you exactly how ${service.title} would work for your business - no commitment, just a conversation.`}
        ctaText="Book a 30-min call"
        serviceSlug={service.slug}
      />

      <StickyCTA serviceTitle={service.title} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Trust indicator helper
// ---------------------------------------------------------------------------

function TrustIndicator({ icon, label }: { icon: "shield" | "clock" | "check"; label: string }) {
  const iconElement = (() => {
    switch (icon) {
      case "clock":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(229,62,62,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case "shield":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(229,62,62,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "check":
        return (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(229,62,62,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
    }
  })();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {iconElement}
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
