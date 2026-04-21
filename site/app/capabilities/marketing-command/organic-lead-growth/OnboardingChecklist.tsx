"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "GSC property access",
    detail: "Add info@rule27design.com as a Full user on your Google Search Console property. We use this to manually submit URLs and pull real performance data - never scraped, never guessed.",
  },
  {
    num: "02",
    title: "Domain control",
    detail: "DNS access for SSL setup and any subdomain routing we need. If you'd rather we work on a staging subdomain first, that works too - just point us to the right registrar.",
  },
  {
    num: "03",
    title: "3-5 competitor domains",
    detail: "The names you actually compete with on search. Not who you'd like to compete with. Real names. We track them every week and flag what they're winning.",
  },
  {
    num: "04",
    title: "ICP description",
    detail: "Who do you actually serve? Job titles, decision triggers, the language they use. The more specific, the more your pages will sound like your customer's own thoughts.",
  },
];

export function OnboardingChecklist() {
  return (
    <section
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2.25rem" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E53E3E",
            borderBottom: "1px solid rgba(229,62,62,0.3)",
            paddingBottom: "4px",
            marginBottom: "1rem",
          }}
        >
          What we need from you
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.75rem",
            lineHeight: 1.05,
          }}
        >
          4 things - you can send them in one email.
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1rem",
            color: "rgba(0,0,0,0.6)",
            margin: 0,
            maxWidth: 640,
            lineHeight: 1.65,
          }}
        >
          We handle every other part of the build. No 40-question intake form,
          no two-week onboarding tax. Optional integrations (CRM, SMTP, custom
          tracking) get scoped in week 1.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            style={{
              background: "#FAF9F6",
              border: "1px solid rgba(0,0,0,0.08)",
              borderLeft: "3px solid #E53E3E",
              padding: "1.25rem 1.25rem 1.1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 80,
                height: 80,
                background:
                  "radial-gradient(circle, rgba(229,62,62,0.05), transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "1.6rem",
                color: "#E53E3E",
                lineHeight: 1,
                letterSpacing: "0.06em",
                marginBottom: "0.6rem",
              }}
            >
              {step.num}
            </div>
            <h3
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "1rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#111",
                margin: "0 0 0.6rem",
                lineHeight: 1.2,
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                color: "rgba(0,0,0,0.6)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {step.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
