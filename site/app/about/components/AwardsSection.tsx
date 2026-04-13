"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/app/components/Card";
import { StatCard } from "@/app/components/Card";
import type { Award } from "@/app/lib/types";

/* ------------------------------------------------------------------ */
/* Static recognition data                                             */
/* ------------------------------------------------------------------ */

const certificationPlatforms = [
  {
    key: "salesforce",
    platform: "Salesforce",
    count: 12,
    certs: [
      "Administrator",
      "Platform Developer I",
      "Platform Developer II",
      "Data Architect",
      "Marketing Cloud Email Specialist",
      "Marketing Cloud Engagement Consultant",
      "Marketing Cloud Engagement Developer",
      "Marketing Cloud Account Engagement Consultant",
      "Service Cloud Consultant",
      "Sales Cloud Consultant",
      "Experience Cloud Consultant",
      "Platform App Builder",
    ],
  },
  {
    key: "aws",
    platform: "Amazon Web Services",
    count: 4,
    certs: [
      "Solutions Architect Associate",
      "Developer Associate",
      "DevOps Engineer Professional",
      "Solutions Architect Professional",
    ],
  },
  {
    key: "google",
    platform: "Google",
    count: 8,
    certs: [
      "Google Ads Search",
      "Google Ads Display",
      "Google Ads Video",
      "Google Ads Shopping",
      "Google Analytics Individual Qualification",
      "Google Analytics 4",
      "Professional Cloud Developer",
      "Cloud Digital Leader",
    ],
  },
  {
    key: "microsoft",
    platform: "Microsoft Azure",
    count: 3,
    certs: [
      "Azure Developer Associate",
      "Azure Administrator Associate",
      "Azure Solutions Architect Expert",
    ],
  },
  {
    key: "hubspot",
    platform: "HubSpot",
    count: 9,
    certs: [
      "Marketing Software",
      "Inbound Marketing",
      "Content Marketing",
      "Email Marketing",
      "Social Media Marketing",
      "CMS Implementation",
      "Sales Software",
      "Service Hub Software",
      "Revenue Operations",
    ],
  },
  {
    key: "adobe",
    platform: "Adobe",
    count: 5,
    certs: [
      "Adobe Experience Manager Sites Developer",
      "Adobe Analytics Developer",
      "Adobe Target Business Practitioner",
      "Adobe Campaign Developer",
      "Adobe Creative Cloud Professional",
    ],
  },
  {
    key: "shopify",
    platform: "Shopify",
    count: 3,
    certs: [
      "Shopify Partner Academy",
      "Shopify Plus Certified",
      "Shopify App Development",
    ],
  },
  {
    key: "meta",
    platform: "Meta",
    count: 4,
    certs: [
      "Meta Certified Digital Marketing Associate",
      "Meta Certified Media Planning Professional",
      "Meta Certified Media Buying Professional",
      "Meta Certified Creative Strategy Professional",
    ],
  },
  {
    key: "other",
    platform: "Additional Platforms",
    count: 8,
    certs: [
      "Klaviyo Partner Certification",
      "Braze Certified Practitioner",
      "Docker Certified Associate",
      "Certified Kubernetes Administrator",
      "Snowflake SnowPro Core",
      "Mixpanel Product Analytics",
      "Segment Customer Data Platform",
      "Netlify Jamstack Certification",
    ],
  },
];

const totalCertifications = certificationPlatforms.reduce((s, p) => s + p.count, 0);

const staticAwards = [
  {
    id: "s1",
    title: "Digital Agency of the Year",
    organization: "Web Excellence Awards",
    year: 2024,
    category: "Industry Leadership",
    description: "Recognized for revolutionary approach to digital experiences and client results.",
  },
  {
    id: "s2",
    title: "Innovation in UX Design",
    organization: "UX Design Institute",
    year: 2024,
    category: "Design Excellence",
    description: "Honored for pushing boundaries in user experience and interface innovation.",
  },
  {
    id: "s3",
    title: "Best Marketing Campaign",
    organization: "Marketing Excellence Awards",
    year: 2023,
    category: "Creative Excellence",
    description: "Awarded for campaigns that redefined industry standards and drove exceptional ROI.",
  },
  {
    id: "s4",
    title: "Cloud Innovation Leader",
    organization: "Digital Innovation Summit",
    year: 2023,
    category: "Technology",
    description: "Recognized for integrating cutting-edge cloud solutions and AI technologies.",
  },
];

const mediaFeatures = [
  {
    id: "m1",
    title: 'Forbes: "The Full-Stack Digital Powerhouse"',
    organization: "Forbes Magazine",
    year: 2024,
    category: "Industry Feature",
    description: "Featured story on how Rule27 Design combines marketing excellence with technical innovation.",
  },
  {
    id: "m2",
    title: "TechCrunch: Marketing Meets Development",
    organization: "TechCrunch",
    year: 2024,
    category: "Tech Coverage",
    description: "Highlighted for bridging the gap between creative marketing and enterprise development.",
  },
  {
    id: "m3",
    title: "AdWeek: Digital Transformation Leaders",
    organization: "AdWeek",
    year: 2023,
    category: "Marketing Industry",
    description: "Case study on helping Fortune 500 companies with end-to-end digital transformation.",
  },
];

type TabId = "certifications" | "awards" | "media";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AwardsSection({ awards: dbAwards }: { awards: Award[] }) {
  const [tab, setTab] = useState<TabId>("certifications");
  const [expandedCert, setExpandedCert] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* merge DB awards with static fallbacks */
  const displayAwards =
    dbAwards.length > 0
      ? dbAwards.map((a) => ({
          id: a.id,
          title: a.title,
          organization: a.organization ?? "",
          year: a.year,
          category: "Award",
          description: a.description ?? "",
        }))
      : staticAwards;

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "certifications", label: "Certifications", count: totalCertifications },
    { id: "awards", label: "Awards", count: displayAwards.length },
    { id: "media", label: "Media", count: mediaFeatures.length },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsInView(true);
      },
      { threshold: 0.05, rootMargin: "100px" },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (typeof window !== "undefined" && window.innerWidth < 768) setIsInView(true);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="awards"
      ref={sectionRef}
      style={{
        padding: "clamp(3rem, 8vw, 6rem) 1.5rem",
        background: "linear-gradient(135deg, #FCFCFB 0%, #FFFFFF 50%, #FCFCFB 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "#E53E3E",
              textTransform: "uppercase",
              background: "rgba(229,62,62,0.06)",
              padding: "4px 14px",
              marginBottom: "1rem",
            }}
          >
            Recognition
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.75rem",
              lineHeight: 1,
            }}
          >
            Industry <span style={{ color: "#E53E3E" }}>Recognition</span>
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1rem",
              color: "rgba(0,0,0,0.5)",
              maxWidth: 580,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            With{" "}
            <span style={{ fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif", color: "#E53E3E" }}>
              {totalCertifications}+
            </span>{" "}
            certifications across 9 major platforms, we&apos;re comprehensively equipped to handle every aspect of your digital transformation.
          </p>
        </motion.div>

        {/* 3 Category Tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {tabs.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setTab(t.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "10px 20px",
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: tab === t.id ? "1px solid #E53E3E" : "1px solid rgba(0,0,0,0.08)",
                borderLeft: tab === t.id ? "3px solid #E53E3E" : "1px solid rgba(0,0,0,0.08)",
                background: tab === t.id ? "#E53E3E" : "#FFFFFF",
                color: tab === t.id ? "#FFFFFF" : "rgba(0,0,0,0.55)",
                boxShadow: tab === t.id ? "0 4px 16px rgba(229,62,62,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.3s",
              }}
            >
              <span>{t.label}</span>
              <span
                style={{
                  background: tab === t.id ? "rgba(255,255,255,0.2)" : "rgba(229,62,62,0.08)",
                  color: tab === t.id ? "#FFFFFF" : "#E53E3E",
                  padding: "2px 8px",
                  fontSize: "11px",
                }}
              >
                {t.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === "certifications" ? (
            /* ========== CERTIFICATIONS with expandable lists ========== */
            <motion.div
              key="certs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              {certificationPlatforms.map((plat) => {
                const isExpanded = expandedCert === plat.key;
                const visibleCerts = isExpanded ? plat.certs : plat.certs.slice(0, 3);
                const hiddenCount = plat.certs.length - 3;

                return (
                  <Card key={plat.key} label={`${plat.count} Certifications`} title={plat.platform}>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: "0.75rem 0 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.35rem",
                      }}
                    >
                      {visibleCerts.map((c, ci) => (
                        <li
                          key={ci}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontFamily: "Helvetica Neue, sans-serif",
                            fontSize: "12px",
                            color: "rgba(0,0,0,0.5)",
                          }}
                        >
                          <span style={{ color: "#E53E3E", fontSize: "11px" }}>&#10003;</span>
                          {c}
                        </li>
                      ))}
                    </ul>

                    {hiddenCount > 0 && (
                      <button
                        onClick={() => setExpandedCert(isExpanded ? null : plat.key)}
                        style={{
                          marginTop: "0.5rem",
                          padding: 0,
                          border: "none",
                          background: "none",
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "12px",
                          color: "#E53E3E",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {isExpanded ? "Show less" : `+${hiddenCount} more...`}
                      </button>
                    )}
                  </Card>
                );
              })}
            </motion.div>
          ) : tab === "awards" ? (
            /* ========== AWARDS ========== */
            <motion.div
              key="awards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              {displayAwards.map((award) => (
                <Card key={award.id} label={String(award.year)} title={award.title} description={award.description}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.5rem" }}>
                    {award.organization && (
                      <span
                        style={{
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "11px",
                          color: "#E53E3E",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {award.organization}
                      </span>
                    )}
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        background: "rgba(0,0,0,0.04)",
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "10px",
                        color: "rgba(0,0,0,0.5)",
                        alignSelf: "flex-start",
                      }}
                    >
                      {award.category}
                    </span>
                  </div>
                </Card>
              ))}
            </motion.div>
          ) : (
            /* ========== MEDIA ========== */
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
                marginBottom: "2.5rem",
              }}
            >
              {mediaFeatures.map((item) => (
                <Card key={item.id} label={`${item.year} \u00B7 ${item.category}`} title={item.title} description={item.description}>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "0.5rem",
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "11px",
                      color: "#E53E3E",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.organization}
                  </span>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stat Cards Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <StatCard label="Platform Certifications" value={String(totalCertifications)} unit="+" change="+12 this year" />
          <StatCard label="Platform Partnerships" value="9" unit="+" change="+2 new" />
          <StatCard label="Industry Awards" value="25" unit="+" change="+4 this year" />
          <StatCard label="Years of Excellence" value="11" unit="+" />
        </div>

        {/* Summary Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #E53E3E 0%, #1a1a1a 100%)",
            padding: "2.5rem",
            color: "#FFFFFF",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* subtle pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              backgroundImage: "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />

          <h3
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: "0 0 1.5rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            Digital Powerhouse by the Numbers
          </h3>

          <div
            style={{ display: "grid", gap: "1.5rem", position: "relative", zIndex: 1, maxWidth: "48rem", margin: "0 auto 2rem" }}
            className="grid-cols-2 sm:grid-cols-4"
          >
            {[
              { val: `${totalCertifications}+`, label: "Platform Certifications" },
              { val: "9+", label: "Platform Partnerships" },
              { val: "25+", label: "Industry Awards" },
              { val: "11+", label: "Years Excellence" },
            ].map((s, i) => (
              <motion.div
                key={i}
                style={{ textAlign: "center" }}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    color: "#FFFFFF",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                  }}
                >
                  {s.val}
                </div>
                <div style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)" }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.7,
              maxWidth: 580,
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            &ldquo;Our extensive certifications aren&apos;t just badges -- they&apos;re proof of our commitment to mastery across every platform.
            From Salesforce Admin to Data Architect, from AWS Solutions to DevOps, we have the depth and breadth to handle any challenge.&rdquo;
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginTop: "1.5rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "16px",
                color: "#FFFFFF",
                fontWeight: 700,
              }}
            >
              27
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                }}
              >
                Rule27 Leadership Team
              </div>
              <div style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)" }}>
                Certified Across Every Platform
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
