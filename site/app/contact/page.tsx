import type { Metadata } from "next";
import Link from "next/link";
import { Card, StatCard } from "@/app/components/Card";
import { Timeline } from "@/app/components/Timeline";
import { ConsultationForm } from "./components/ConsultationForm";
import { FAQSection } from "./components/FAQSection";

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Contact | Rule27 Design - Start Your Transformation",
  description:
    "Ready to break conventional boundaries? Schedule a consultation with Rule27 Design's expert team and discover how we can transform your digital presence.",
  openGraph: {
    title: "Contact | Rule27 Design - Start Your Transformation",
    description:
      "Ready to break conventional boundaries? Schedule a consultation with Rule27 Design's expert team.",
    type: "website",
    url: "https://rule27design.com/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Rule27 Design - Start Your Transformation",
    description:
      "Ready to break conventional boundaries? Schedule a consultation with Rule27 Design's expert team.",
  },
  alternates: {
    canonical: "https://rule27design.com/contact",
  },
};

/* ------------------------------------------------------------------ */
/* Static Data                                                         */
/* ------------------------------------------------------------------ */

const processSteps = [
  {
    date: "Step 01",
    title: "Initial Consultation",
    desc: "We start with a deep-dive discovery call to understand your goals, challenges, and vision. No sales pitch -- just honest conversation about what you need.",
  },
  {
    date: "Step 02",
    title: "Strategy Development",
    desc: "Our team crafts a custom strategy document with detailed recommendations, timelines, and transparent pricing tailored to your specific objectives.",
  },
  {
    date: "Step 03",
    title: "Implementation",
    desc: "Once approved, we execute with precision -- regular check-ins, milestone reviews, and relentless attention to detail at every phase of the project.",
  },
  {
    date: "Step 04",
    title: "Growth & Optimization",
    desc: "Launch is just the beginning. We monitor performance, gather data, and continuously optimize to maximize your return on investment.",
  },
];

const contactMethods = [
  {
    label: "Direct Line",
    title: "Call Us",
    description:
      "Speak directly with a strategist. Available Monday through Friday, 9 AM to 6 PM PST. We answer -- no phone trees.",
    contact: "+1 (555) RULE-27",
    href: "tel:+15557853277",
  },
  {
    label: "Email",
    title: "Send a Message",
    description:
      "For detailed inquiries, proposals, or partnership discussions. We respond to every email within 24 hours.",
    contact: "hello@rule27design.com",
    href: "mailto:hello@rule27design.com",
  },
  {
    label: "Headquarters",
    title: "Visit Our Studio",
    description:
      "Schedule an in-person meeting at our Scottsdale studio. We love face-to-face conversations about big ideas.",
    contact: "Scottsdale, AZ",
    href: "#",
  },
];

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  return (
    <div style={{ background: "#FAFAFA" }}>
      {/* ============================================================ */}
      {/* HERO SECTION                                                  */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #111111 100%)",
          padding: "clamp(4rem, 10vw, 7rem) 1.5rem clamp(3rem, 8vw, 6rem)",
          textAlign: "center",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
            pointerEvents: "none",
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Status badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(229,62,62,0.1)",
              border: "1px solid rgba(229,62,62,0.2)",
              borderRadius: "100px",
              padding: "8px 20px",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#E53E3E",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#E53E3E",
              }}
            >
              Available for New Projects
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: "0 0 0.5rem",
              lineHeight: 1,
            }}
          >
            Start Your
          </h1>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3rem, 10vw, 6rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#E53E3E",
              margin: "0 0 1.5rem",
              lineHeight: 1,
            }}
          >
            Transformation
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              maxWidth: "620px",
              margin: "0 auto 2.5rem",
            }}
          >
            No cookie-cutter solutions. No boring meetings. Just honest
            conversations about{" "}
            <span style={{ color: "#E53E3E", fontWeight: 600 }}>
              breaking boundaries
            </span>{" "}
            and creating{" "}
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>
              extraordinary results
            </span>
            .
          </p>

          {/* Quick stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
              maxWidth: "500px",
              margin: "0 auto 2.5rem",
            }}
          >
            {[
              { value: "24hr", label: "Response Time" },
              { value: "98%", label: "Satisfaction" },
              { value: "150+", label: "Projects" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    marginBottom: "4px",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <a
              href="#consultation-form"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background:
                  "linear-gradient(135deg, #E53E3E 0%, #C53030 100%)",
                color: "#FFFFFF",
                border: "none",
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
              Book Free Strategy Call
            </a>
            <a
              href="#contact-options"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "transparent",
                color: "#FFFFFF",
                border: "2px solid rgba(255,255,255,0.5)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s",
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
              Quick Question?
            </a>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              justifyContent: "center",
            }}
          >
            {[
              {
                icon: (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                text: "100% Confidential",
              },
              {
                icon: (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                text: "No Obligation",
              },
              {
                icon: (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                text: "Expert Team",
              },
            ].map((badge) => (
              <div
                key={badge.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {badge.icon}
                <span
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background:
              "linear-gradient(to top, #FAFAFA, transparent)",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ============================================================ */}
      {/* CONSULTATION FORM + PROCESS TIMELINE GRID                     */}
      {/* ============================================================ */}
      <section
        id="consultation"
        style={{
          padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
          }}
        >
          {/* Desktop: two columns via CSS */}
          <div
            style={{
              display: "grid",
              gap: "3rem",
            }}
            className="consultation-grid"
          >
            {/* Form Column */}
            <div id="consultation-form">
              <ConsultationForm />
            </div>

            {/* Sidebar: Process Timeline */}
            <div>
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  padding: "2rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background:
                        "linear-gradient(135deg, #E53E3E, #C53030)",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="6" y1="3" x2="6" y2="15" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <path d="M18 9a9 9 0 0 1-9 9" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.125rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: 0,
                    }}
                  >
                    Our Process
                  </h3>
                </div>
                <Timeline items={processSteps} />
              </div>

              {/* Office hours card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  padding: "1.5rem 2rem",
                }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#111111",
                    margin: "0 0 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E53E3E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Office Hours
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "13px",
                  }}
                >
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM PST" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM PST" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((sched) => (
                    <div
                      key={sched.day}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "rgba(0,0,0,0.5)" }}>
                        {sched.day}
                      </span>
                      <span style={{ color: "#111111" }}>{sched.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTACT OPTIONS                                               */}
      {/* ============================================================ */}
      <section
        id="contact-options"
        style={{
          padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
          background: "#FFFFFF",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.75rem",
              }}
            >
              Other Ways to{" "}
              <span style={{ color: "#E53E3E" }}>Reach Us</span>
            </h2>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.5)",
                lineHeight: 1.6,
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              Prefer a different approach? Pick the method that works best for
              you -- we are always ready to talk.
            </p>
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {contactMethods.map((method) => (
              <Link
                key={method.title}
                href={method.href}
                style={{ textDecoration: "none" }}
              >
                <Card label={method.label} title={method.title}>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "13px",
                      color: "rgba(0,0,0,0.55)",
                      lineHeight: 1.7,
                      margin: "0 0 1rem",
                    }}
                  >
                    {method.description}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "14px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#E53E3E",
                    }}
                  >
                    {method.contact}
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          {/* Social links row */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {[
              {
                label: "LinkedIn",
                url: "https://www.linkedin.com/company/rule27design",
              },
              {
                label: "Facebook",
                url: "https://www.facebook.com/Rule27Design/",
              },
              {
                label: "Instagram",
                url: "https://www.instagram.com/rule27design",
              },
            ].map((social) => (
              <Link
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "10px 24px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "rgba(0,0,0,0.5)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST INDICATORS                                              */}
      {/* ============================================================ */}
      <section
        style={{
          padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
          background: "#FAFAFA",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#111111",
                margin: "0 0 0.75rem",
              }}
            >
              Why Leaders Choose{" "}
              <span style={{ color: "#E53E3E" }}>Rule27</span>
            </h2>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "1rem",
                color: "rgba(0,0,0,0.5)",
                lineHeight: 1.6,
                maxWidth: "580px",
                margin: "0 auto",
              }}
            >
              Don&apos;t just take our word for it. See the numbers and discover
              why we are the partner of choice for ambitious brands.
            </p>
          </div>

          {/* StatCards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <StatCard
              label="Response Time"
              value="24"
              unit="hours"
              change="+Guaranteed"
            />
            <StatCard
              label="Client Satisfaction"
              value="98"
              unit="%"
              change="+Industry Leading"
            />
            <StatCard
              label="Projects Delivered"
              value="150"
              unit="+"
              change="+And counting"
            />
            <StatCard
              label="Years in Business"
              value="10"
              unit="+"
              change="+Since 2014"
            />
          </div>

          {/* Satisfaction guarantee badge */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(229,62,62,0.04)",
                border: "1px solid rgba(229,62,62,0.15)",
                borderRadius: "100px",
                padding: "12px 28px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E53E3E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "13px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#111111",
                  }}
                >
                  100% Satisfaction Guarantee
                </div>
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "12px",
                    color: "rgba(0,0,0,0.45)",
                  }}
                >
                  We deliver results or your money back
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ SECTION                                                   */}
      {/* ============================================================ */}
      <FAQSection />

      {/* ============================================================ */}
      {/* Responsive grid CSS                                           */}
      {/* ============================================================ */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (min-width: 1024px) {
          .consultation-grid {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
