import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceZone, getServiceZones } from "@/app/lib/data/services";
import { ZoneView } from "./components/ZoneView";

// ---------------------------------------------------------------------------
// Dynamic SEO metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { zone } = await getServiceZone(slug);

  if (!zone) {
    return { title: "Service Zone Not Found" };
  }

  return {
    title: `${zone.title} Services`,
    description: zone.description,
    openGraph: {
      title: `${zone.title} | Rule27 Design Services`,
      description: zone.description,
      type: "website",
      url: `https://www.rule27design.com/capabilities/${zone.slug}`,
    },
    alternates: {
      canonical: `https://www.rule27design.com/capabilities/${zone.slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Zone Icon (inline SVG)
// ---------------------------------------------------------------------------

function ZoneIcon({ name, size = 32 }: { name: string; size?: number }) {
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
    default:
      return (
        <svg {...common}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ServiceZonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ zone, services }, allZones] = await Promise.all([
    getServiceZone(slug),
    getServiceZones(),
  ]);

  if (!zone) {
    notFound();
  }

  const otherZones = allZones.filter((z) => z.slug !== zone.slug);
  const featuredServices = services.filter((s) => s.isFeatured);

  return (
    <div style={{ background: "#FCFCFB", minHeight: "100vh" }}>
      {/* ── Breadcrumb ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1.5rem 1.5rem 0",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
          }}
        >
          <Link
            href="/capabilities"
            style={{
              color: "rgba(0,0,0,0.4)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Capabilities
          </Link>
          <span style={{ color: "rgba(0,0,0,0.2)" }}>/</span>
          <span style={{ color: "#E53E3E" }}>{zone.title}</span>
        </nav>
      </div>

      {/* ── Hero Section ── */}
      <section
        style={{
          padding: "clamp(3rem, 6vw, 5rem) 1.5rem clamp(2rem, 4vw, 3rem)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: "2rem",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 2,
              background: "rgba(229,62,62,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E53E3E",
              flexShrink: 0,
            }}
          >
            <ZoneIcon name={zone.icon} size={40} />
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 1rem",
                lineHeight: 0.95,
              }}
            >
              {zone.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.6,
                margin: "0 0 2rem",
                maxWidth: 640,
              }}
            >
              {zone.description}
            </p>

            {/* Stats Row */}
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {zone.stats.projects > 0 && (
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderTop: "2px solid #E53E3E",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      color: "rgba(0,0,0,0.45)",
                      textTransform: "uppercase",
                      margin: "0 0 0.35rem",
                      fontWeight: 500,
                    }}
                  >
                    Projects Completed
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2rem",
                      color: "#111111",
                      lineHeight: 1,
                    }}
                  >
                    {zone.stats.projects}+
                  </span>
                </div>
              )}
              {zone.stats.satisfaction > 0 && (
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderTop: "2px solid #E53E3E",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      letterSpacing: "0.2em",
                      color: "rgba(0,0,0,0.45)",
                      textTransform: "uppercase",
                      margin: "0 0 0.35rem",
                      fontWeight: 500,
                    }}
                  >
                    Client Satisfaction
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2rem",
                      color: "#111111",
                      lineHeight: 1,
                    }}
                  >
                    {zone.stats.satisfaction}%
                  </span>
                </div>
              )}
              <div
                style={{
                  padding: "1rem 1.5rem",
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderTop: "2px solid #E53E3E",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "rgba(0,0,0,0.45)",
                    textTransform: "uppercase",
                    margin: "0 0 0.35rem",
                    fontWeight: 500,
                  }}
                >
                  Available Services
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "2rem",
                    color: "#111111",
                    lineHeight: 1,
                  }}
                >
                  {services.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Services ── */}
      {featuredServices.length > 0 && (
        <section
          style={{
            padding: "0 1.5rem clamp(2rem, 4vw, 3rem)",
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
              Featured Services
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                href={`/capabilities/${zone.slug}/${service.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(229,62,62,0.15)",
                    borderLeft: "3px solid #E53E3E",
                    borderRadius: 2,
                    padding: "1.5rem",
                    transition: "box-shadow 0.3s, transform 0.3s",
                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,62,62,0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Featured badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "#E53E3E",
                      padding: "3px 10px",
                      borderRadius: 2,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                      }}
                    >
                      Featured
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
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
                      <ZoneIcon name={service.icon} size={20} />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.65rem",
                        color: "rgba(0,0,0,0.4)",
                        background: "#F8F9FA",
                        padding: "3px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {service.category}
                    </span>
                  </div>

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
                    {service.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: 1.6,
                      margin: "0 0 1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.35rem",
                      }}
                    >
                      {service.features.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.7rem",
                            color: "rgba(0,0,0,0.45)",
                            background: "#F8F9FA",
                            padding: "3px 8px",
                            borderRadius: 2,
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── All Services Grid (Client Component with search/filter/animation) ── */}
      <ZoneView zone={zone} services={services} />

      {/* ── CTA Section ── */}
      <section
        style={{
          background: "#E53E3E",
          padding: "clamp(3rem, 6vw, 4.5rem) 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: "0 0 0.75rem",
            }}
          >
            Ready to Transform?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 2rem",
              lineHeight: 1.6,
            }}
          >
            Our {zone.title.toLowerCase()} experts are ready to bring your
            vision to life. Let&apos;s discuss your project.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/contact"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "#FFFFFF",
                color: "#111111",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "opacity 0.2s",
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Schedule Consultation
            </Link>
            <Link
              href="/contact"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "transparent",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.4)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.2s",
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      {/* ── Other Zones ── */}
      {otherZones.length > 0 && (
        <section
          style={{
            padding: "clamp(3rem, 6vw, 4rem) 1.5rem",
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
              Explore Other Zones
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {otherZones.map((z) => (
              <Link
                key={z.id}
                href={`/capabilities/${z.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 2,
                    padding: "1.5rem",
                    transition: "all 0.25s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "rgba(0,0,0,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(0,0,0,0.4)",
                      }}
                    >
                      <ZoneIcon name={z.icon} size={20} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "1rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#111111",
                          margin: 0,
                        }}
                      >
                        {z.title}
                      </h3>
                      {z.serviceCount != null && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.7rem",
                            color: "rgba(0,0,0,0.35)",
                          }}
                        >
                          {z.serviceCount} services
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: 1.6,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {z.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Back link ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 1.5rem 3rem",
        }}
      >
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
          Back to All Capabilities
        </Link>
      </div>
    </div>
  );
}
