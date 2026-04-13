"use client";

import Link from "next/link";
import { Accordion } from "@/app/components/Accordion";

// ---------------------------------------------------------------------------
// FAQ data -- focused on the contact/consultation process
// ---------------------------------------------------------------------------

const faqItems = [
  {
    q: "What happens after I submit the consultation form?",
    a: "Within 24 hours, a strategy expert will review your submission and reach out to schedule a discovery call. During this call, we'll dive deeper into your goals and outline a preliminary plan of action -- no obligation, no hard sell.",
  },
  {
    q: "How much do your services typically cost?",
    a: "Our projects range from $10,000 to $500,000+ depending on scope and complexity. We offer transparent, value-based pricing with clear deliverables. Every engagement begins with a free consultation so we can provide an accurate estimate tailored to your needs.",
  },
  {
    q: "How long does a typical project take?",
    a: "Timeline varies by project scope: Brand Identity (4-6 weeks), Website Design & Development (8-12 weeks), Complete Digital Transformation (3-6 months). We also maintain capacity for urgent projects with rush delivery available at a 25-50% premium.",
  },
  {
    q: "Do you work with startups or only established companies?",
    a: "We work with ambitious brands at every stage -- from pre-seed startups to Fortune 500 enterprises. What matters isn't your size but your ambition. If you're ready to break conventional boundaries, we're ready to help.",
  },
  {
    q: "What makes Rule27 Design different from other agencies?",
    a: "We're not just another agency -- we're creative rebels who break conventional boundaries. Our unique approach combines creative audacity with technical precision, delivering results that make other agencies look ordinary. We don't follow trends -- we set them.",
  },
  {
    q: "How involved do I need to be during the project?",
    a: "Your involvement is flexible based on your preferences. At minimum, we ask for weekly 30-minute check-ins and timely feedback on deliverables. Some clients prefer to be deeply involved in every decision while others trust us to run with their vision -- we accommodate both styles.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes! We offer flexible payment structures: 50/50 split, monthly installments for larger projects, and performance-based models. We'll work with you to find a structure that fits your budget and timeline.",
  },
  {
    q: "What kind of ongoing support do you provide?",
    a: "We offer comprehensive post-launch support: business hours support via phone, email, and chat, dedicated account managers, technical documentation, and training. Our maintenance packages range from basic monitoring ($500/month) to comprehensive management ($5,000+/month).",
  },
  {
    q: "Is the initial consultation really free?",
    a: "Absolutely. The initial consultation is 100% free with no obligation. We believe in earning your trust through value, not pressure. During the call, you'll receive actionable insights regardless of whether you choose to work with us.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FAQSection() {
  return (
    <section
      style={{
        background: "#FAFAFA",
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.75rem",
            }}
          >
            Frequently Asked{" "}
            <span style={{ color: "#E53E3E" }}>Questions</span>
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "15px",
              color: "rgba(0,0,0,0.5)",
              lineHeight: 1.6,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Everything you need to know about working with Rule27 Design.
            Can&apos;t find your answer? Let&apos;s talk.
          </p>
        </div>

        {/* Accordion */}
        <Accordion items={faqItems} />

        {/* Still have questions CTA */}
        <div
          style={{
            marginTop: "3rem",
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "2px",
            padding: "2rem 1.5rem",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E53E3E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto 1rem", display: "block" }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.5rem",
            }}
          >
            Still Have Questions?
          </h3>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "14px",
              color: "rgba(0,0,0,0.45)",
              maxWidth: "400px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.6,
            }}
          >
            Our team is here to help with any questions you might have.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="#consultation-form"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "12px 28px",
                background:
                  "linear-gradient(135deg, #E53E3E 0%, #C53030 100%)",
                color: "#FFFFFF",
                border: "none",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="14"
                height="14"
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
              Schedule a Call
            </Link>
            <Link
              href="mailto:hello@rule27design.com"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "12px 28px",
                background: "transparent",
                color: "#E53E3E",
                border: "1px solid #E53E3E",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
