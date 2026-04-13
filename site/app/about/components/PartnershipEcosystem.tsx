"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card } from "@/app/components/Card";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const partnerCategories = [
  { id: "all", label: "All Partners", count: 18 },
  { id: "marketing", label: "Marketing Platforms", count: 8 },
  { id: "development", label: "Development & Cloud", count: 7 },
  { id: "analytics", label: "Analytics & Data", count: 4 },
];

interface Partner {
  id: number;
  name: string;
  category: string;
  description: string;
  services: string[];
  certifications: number;
  projects: number;
  benefits: string[];
}

const partners: Partner[] = [
  { id: 1, name: "Salesforce", category: "marketing", description: "Complete CRM and marketing cloud solutions with 12+ certifications", services: ["CRM Implementation", "Marketing Cloud", "Service Cloud", "Commerce Cloud"], certifications: 12, projects: 50, benefits: ["Enterprise CRM", "Marketing Automation", "Customer 360 Platform", "AI-Powered Insights"] },
  { id: 2, name: "AWS", category: "development", description: "Enterprise cloud infrastructure and development platform", services: ["Cloud Architecture", "DevOps", "Serverless", "Machine Learning"], certifications: 4, projects: 35, benefits: ["Scalable Infrastructure", "Global CDN", "Enterprise Security", "Cost Optimization"] },
  { id: 3, name: "HubSpot", category: "marketing", description: "Inbound marketing, sales, and service platform", services: ["Marketing Hub", "Sales Hub", "Service Hub", "CMS Hub"], certifications: 9, projects: 45, benefits: ["All-in-One Platform", "Marketing Automation", "Lead Generation", "Customer Service"] },
  { id: 4, name: "Google Cloud", category: "development", description: "AI-first cloud platform with marketing integrations", services: ["Cloud Platform", "BigQuery", "AI/ML", "Google Ads Integration"], certifications: 8, projects: 30, benefits: ["AI & Machine Learning", "Data Analytics", "Global Scale", "Google Ecosystem"] },
  { id: 5, name: "Shopify", category: "development", description: "E-commerce platform for online stores and retail", services: ["Store Development", "Plus Solutions", "Custom Apps", "Headless Commerce"], certifications: 3, projects: 40, benefits: ["E-commerce Excellence", "Multi-channel Selling", "App Ecosystem", "Scalable Commerce"] },
  { id: 6, name: "Adobe", category: "marketing", description: "Creative and marketing cloud solutions", services: ["Experience Manager", "Analytics", "Target", "Campaign"], certifications: 5, projects: 25, benefits: ["Creative Cloud", "Experience Cloud", "Personalization", "Content Management"] },
  { id: 7, name: "Microsoft Azure", category: "development", description: "Enterprise cloud computing and AI services", services: ["Azure Cloud", "Office 365 Integration", "Power Platform", "Azure AI"], certifications: 3, projects: 20, benefits: ["Enterprise Integration", "Hybrid Cloud", "Security & Compliance", "Microsoft Ecosystem"] },
  { id: 8, name: "Meta", category: "marketing", description: "Social media advertising and commerce platforms", services: ["Facebook Ads", "Instagram Marketing", "WhatsApp Business", "Commerce"], certifications: 4, projects: 60, benefits: ["Social Advertising", "Audience Targeting", "Commerce Integration", "Cross-Platform Reach"] },
  { id: 9, name: "Klaviyo", category: "marketing", description: "Email and SMS marketing automation platform", services: ["Email Marketing", "SMS Campaigns", "Segmentation", "Personalization"], certifications: 1, projects: 35, benefits: ["Advanced Segmentation", "Predictive Analytics", "Revenue Attribution", "E-commerce Focus"] },
  { id: 10, name: "Snowflake", category: "analytics", description: "Cloud data platform for analytics and AI", services: ["Data Warehouse", "Data Lake", "Data Sharing", "Analytics"], certifications: 1, projects: 15, benefits: ["Unified Data Platform", "Real-time Analytics", "Data Sharing", "Multi-cloud"] },
  { id: 11, name: "Google Analytics", category: "analytics", description: "Web analytics and measurement platform", services: ["GA4 Setup", "Conversion Tracking", "Custom Reports", "Attribution"], certifications: 2, projects: 80, benefits: ["User Behavior Insights", "Conversion Tracking", "Custom Reporting", "Free Platform"] },
  { id: 12, name: "Braze", category: "marketing", description: "Customer engagement and lifecycle marketing", services: ["Lifecycle Campaigns", "Push Notifications", "In-App Messaging", "Personalization"], certifications: 1, projects: 10, benefits: ["Omnichannel Engagement", "Real-time Personalization", "Customer Journey", "AI Optimization"] },
  { id: 13, name: "Mixpanel", category: "analytics", description: "Product analytics for user behavior tracking", services: ["Product Analytics", "User Funnels", "Retention Analysis", "A/B Testing"], certifications: 1, projects: 20, benefits: ["Product Analytics", "User Journey Tracking", "Cohort Analysis", "Real-time Data"] },
  { id: 14, name: "Segment", category: "analytics", description: "Customer data platform and integration hub", services: ["Data Collection", "Data Routing", "Identity Resolution", "Privacy Management"], certifications: 1, projects: 15, benefits: ["Single Data Source", "300+ Integrations", "Privacy Compliance", "Real-time Sync"] },
  { id: 15, name: "Docker", category: "development", description: "Container platform for application deployment", services: ["Containerization", "Kubernetes", "CI/CD", "Microservices"], certifications: 1, projects: 25, benefits: ["Container Orchestration", "Scalable Deployment", "DevOps Integration", "Portability"] },
  { id: 16, name: "Netlify", category: "development", description: "Modern web development and hosting platform", services: ["Jamstack Hosting", "Serverless Functions", "Edge CDN", "Build Automation"], certifications: 1, projects: 30, benefits: ["Instant Deployment", "Global CDN", "Serverless Backend", "Git Integration"] },
  { id: 17, name: "Mailchimp", category: "marketing", description: "Marketing automation and email platform", services: ["Email Campaigns", "Automation", "Landing Pages", "Audience Management"], certifications: 1, projects: 40, benefits: ["Easy Email Marketing", "Marketing CRM", "Creative Tools", "E-commerce Integration"] },
  { id: 18, name: "WordPress", category: "development", description: "Content management and website platform", services: ["Custom Development", "WooCommerce", "Performance Optimization", "Security"], certifications: 0, projects: 50, benefits: ["Flexible CMS", "Plugin Ecosystem", "SEO Friendly", "Community Support"] },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PartnershipEcosystem() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-100px" });

  const filteredPartners = activeCategory === "all" ? partners : partners.filter((p) => p.category === activeCategory);
  const totalCerts = partners.reduce((s, p) => s + p.certifications, 0);
  const totalProjects = partners.reduce((s, p) => s + p.projects, 0);

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
      id="partnerships"
      ref={sectionRef}
      style={{
        padding: "clamp(3rem, 8vw, 6rem) 1.5rem",
        background: "#FCFCFB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
            Partnership Ecosystem
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
            Our <span style={{ color: "#E53E3E" }}>Strategic Partners</span>
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
            We partner with the world&apos;s leading platforms to deliver integrated solutions. Our {totalCerts}+ certifications across {partners.length} platforms ensure you get expert implementation every time.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gap: "1rem",
            marginBottom: "2rem",
          }}
          className="grid-cols-2 sm:grid-cols-4"
        >
          {[
            { label: "Strategic Partners", value: String(partners.length) },
            { label: "Total Certifications", value: String(totalCerts) },
            { label: "Projects Delivered", value: String(totalProjects) },
            { label: "Industries Served", value: "15+" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ type: "spring" as const, stiffness: 200, delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                borderTop: "2px solid #E53E3E",
                padding: "1.25rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#111111",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.7rem", color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category Filter Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
          }}
        >
          {partnerCategories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
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
                border: activeCategory === cat.id ? "1px solid #E53E3E" : "1px solid rgba(0,0,0,0.08)",
                borderLeft: activeCategory === cat.id ? "3px solid #E53E3E" : "1px solid rgba(0,0,0,0.08)",
                background: activeCategory === cat.id ? "#E53E3E" : "#FFFFFF",
                color: activeCategory === cat.id ? "#FFFFFF" : "rgba(0,0,0,0.55)",
                boxShadow: activeCategory === cat.id ? "0 4px 16px rgba(229,62,62,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.3s",
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  background: activeCategory === cat.id ? "rgba(255,255,255,0.2)" : "rgba(229,62,62,0.08)",
                  color: activeCategory === cat.id ? "#FFFFFF" : "#E53E3E",
                  padding: "2px 8px",
                  fontSize: "11px",
                }}
              >
                {cat.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Partner Cards Grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05, type: "spring" as const, stiffness: 100 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedPartner(partner)}
                style={{ cursor: "pointer" }}
              >
                <Card>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "9px",
                        letterSpacing: "0.2em",
                        color: "#E53E3E",
                        textTransform: "uppercase",
                        borderBottom: "1px solid rgba(229,62,62,0.3)",
                        paddingBottom: 2,
                      }}
                    >
                      {partner.certifications > 0 ? `${partner.certifications} certs` : "Partner"}
                    </span>
                    <span
                      style={{
                        fontFamily: "Helvetica Neue, sans-serif",
                        fontSize: "10px",
                        color: "rgba(0,0,0,0.4)",
                      }}
                    >
                      {partner.projects} projects
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#000000",
                      margin: "0 0 0.5rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {partner.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "12px",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: 1.5,
                      margin: "0 0 0.75rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {partner.description}
                  </p>

                  {/* Service tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {partner.services.slice(0, 2).map((svc, si) => (
                      <span
                        key={si}
                        style={{
                          padding: "2px 8px",
                          background: "rgba(0,0,0,0.04)",
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "10px",
                          color: "rgba(0,0,0,0.5)",
                        }}
                      >
                        {svc}
                      </span>
                    ))}
                    {partner.services.length > 2 && (
                      <span
                        style={{
                          padding: "2px 8px",
                          background: "rgba(229,62,62,0.06)",
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "10px",
                          color: "#E53E3E",
                          fontWeight: 500,
                        }}
                      >
                        +{partner.services.length - 2}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA Banner */}
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
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3
              style={{
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                margin: "0 0 0.75rem",
              }}
            >
              The Power of Partnership
            </h3>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.7,
                maxWidth: 580,
                margin: "0 auto 1.5rem",
              }}
            >
              With certified expertise across every major platform, we&apos;re not just implementing tools -- we&apos;re architecting complete digital ecosystems that drive real business results.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/services"
                style={{
                  padding: "12px 28px",
                  background: "#FFFFFF",
                  color: "#E53E3E",
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Explore Our Capabilities
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Talk to Our Experts
              </motion.a>
            </div>
          </div>
        </div>

        {/* Partner Detail Modal */}
        <AnimatePresence>
          {selectedPartner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: 50,
              }}
              onClick={() => setSelectedPartner(null)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring" as const, stiffness: 100 }}
                style={{
                  background: "#FFFFFF",
                  width: "100%",
                  maxWidth: 640,
                  maxHeight: "90vh",
                  overflowY: "auto",
                  borderRadius: 2,
                  padding: "2rem",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        fontWeight: 400,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#111111",
                        margin: "0 0 0.25rem",
                      }}
                    >
                      {selectedPartner.name}
                    </h3>
                    <div style={{ display: "flex", gap: "1rem", fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.8rem" }}>
                      {selectedPartner.certifications > 0 && (
                        <span style={{ color: "#E53E3E" }}>{selectedPartner.certifications} Certifications</span>
                      )}
                      <span style={{ color: "rgba(0,0,0,0.5)" }}>{selectedPartner.projects} Projects</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPartner(null)}
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(0,0,0,0.04)",
                      border: "none",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "rgba(0,0,0,0.5)",
                      fontSize: "18px",
                    }}
                  >
                    &#10005;
                  </motion.button>
                </div>

                {/* Services & Benefits */}
                <div style={{ display: "grid", gap: "1.5rem" }} className="grid-cols-1 md:grid-cols-2">
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "0.9rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#111111",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Our Services
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {selectedPartner.services.map((svc, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.85rem", color: "rgba(0,0,0,0.55)" }}>
                          <span style={{ color: "#E53E3E", fontSize: "12px" }}>&#10003;</span>
                          {svc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                        fontSize: "0.9rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#111111",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Key Benefits
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {selectedPartner.benefits.map((ben, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "Helvetica Neue, sans-serif", fontSize: "0.85rem", color: "rgba(0,0,0,0.55)" }}>
                          <span style={{ color: "#E53E3E", fontSize: "12px" }}>&#9733;</span>
                          {ben}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Description */}
                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1.25rem",
                    background: "rgba(229,62,62,0.03)",
                    border: "1px solid rgba(229,62,62,0.08)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(0,0,0,0.55)",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {selectedPartner.description}. Our certified experts leverage this partnership to deliver enterprise-grade solutions that drive measurable business outcomes. From implementation to optimization, we ensure you get maximum value from your investment.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
