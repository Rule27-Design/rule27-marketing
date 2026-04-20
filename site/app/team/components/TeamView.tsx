"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { TeamMember } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Department categories (matching old site)
// ---------------------------------------------------------------------------

const departments = [
  { id: "all", label: "All Team" },
  { id: "Leadership", label: "Leadership" },
  { id: "Marketing", label: "Marketing" },
  { id: "Development", label: "Development" },
  { id: "Creative", label: "Creative" },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  members: TeamMember[];
}

export function TeamView({ members }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    if (activeCategory === "all") return members;
    return members.filter(
      (m) => m.department && m.department.includes(activeCategory),
    );
  }, [members, activeCategory]);

  return (
    <div style={{ background: "#FCFCFB" }}>
      {/* ================================================================ */}
      {/* HERO SECTION                                                      */}
      {/* ================================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #F8F9FA, #FFFFFF)",
          }}
        />

        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
          aria-hidden="true"
        />

        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: "5rem",
            paddingBottom: "5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center" }}
          >
            {/* Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                marginBottom: "1.5rem",
                background: "rgba(229,62,62,0.1)",
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  fontWeight: 600,
                }}
              >
                Meet Our Team
              </span>
            </motion.div>

            {/* H1 */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl"
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontWeight: 400,
                color: "#111111",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                lineHeight: 1.1,
              }}
            >
              The{" "}
              <span style={{ color: "#E53E3E" }}>Certified Experts</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl"
              style={{
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                color: "rgba(0,0,0,0.55)",
                maxWidth: "48rem",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Meet the certified professionals who make Rule27 Design the
              digital powerhouse it is - experts in marketing platforms, cloud
              development, and everything in between.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STICKY FILTER BAR                                                 */}
      {/* ================================================================ */}
      <section
        style={{
          padding: "1rem 0",
          background: "#FFFFFF",
          position: "sticky",
          top: 60,
          zIndex: 30,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          {departments.map((dept, index) => (
            <motion.button
              key={dept.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(dept.id)}
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "15px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.75rem 1.25rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                background:
                  activeCategory === dept.id ? "#E53E3E" : "#F8F9FA",
                color:
                  activeCategory === dept.id
                    ? "#FFFFFF"
                    : "rgba(0,0,0,0.5)",
                boxShadow:
                  activeCategory === dept.id
                    ? "0 4px 12px rgba(229,62,62,0.3)"
                    : "none",
                transform:
                  activeCategory === dept.id ? "scale(1.05)" : "scale(1)",
              }}
            >
              {dept.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* TEAM CARD GRID                                                    */}
      {/* ================================================================ */}
      <section
        style={{
          paddingTop: "3rem",
          paddingBottom: "5rem",
          background: "#FFFFFF",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  layout
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover="hover"
                  onMouseEnter={() => setHoveredCard(member.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link
                    href={`/team/${member.slug}`}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      style={{
                        background: "#F8F9FA",
                        borderRadius: "1rem",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        transition: "all 0.5s",
                        position: "relative",
                        ...(hoveredCard === member.id
                          ? {
                              boxShadow:
                                "0 12px 32px rgba(0,0,0,0.12), 0 0 16px rgba(229,62,62,0.08)",
                            }
                          : {}),
                      }}
                    >
                      {/* Image area */}
                      <div
                        style={{
                          position: "relative",
                          overflow: "hidden",
                          height: "16rem",
                          background:
                            "linear-gradient(135deg, rgba(229,62,62,0.15), rgba(17,17,17,0.08))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {member.avatar_url ? (
                          <Image
                            src={member.avatar_url}
                            alt={member.full_name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "8rem",
                              height: "8rem",
                              background: "#FFFFFF",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow:
                                "0 8px 24px rgba(0,0,0,0.1)",
                            }}
                          >
                            <span
                              style={{
                                fontFamily:
                                  "'Steelfish', 'Impact', sans-serif",
                                fontSize: "2.25rem",
                                color: "#111111",
                                textTransform: "uppercase",
                                fontWeight: 700,
                              }}
                            >
                              {member.full_name?.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Hover arrow indicator */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity:
                              hoveredCard === member.id ? 1 : 0,
                            scale:
                              hoveredCard === member.id ? 1 : 0,
                          }}
                          style={{
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "2.5rem",
                              height: "2.5rem",
                              background: "rgba(255,255,255,0.9)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#111111"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line
                                x1="5"
                                y1="12"
                                x2="19"
                                y2="12"
                              />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </div>
                        </motion.div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: "1.25rem" }}>
                        <h3
                          className="text-xl"
                          style={{
                            fontFamily:
                              "'Steelfish', 'Impact', sans-serif",
                            fontWeight: 400,
                            color:
                              hoveredCard === member.id
                                ? "#E53E3E"
                                : "#111111",
                            marginBottom: "0.25rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            lineHeight: 1.2,
                            transition: "color 0.3s",
                          }}
                        >
                          {member.full_name || member.display_name}
                        </h3>
                        <p
                          className="text-sm"
                          style={{
                            fontFamily:
                              "Helvetica Neue, Helvetica, Arial, sans-serif",
                            color: "rgba(0,0,0,0.5)",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {member.job_title}
                        </p>

                        {/* Department tags */}
                        {member.department &&
                          member.department.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                              }}
                            >
                              {member.department
                                .slice(0, 2)
                                .map((dept) => (
                                  <span
                                    key={dept}
                                    style={{
                                      fontFamily:
                                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                                      fontSize: "0.75rem",
                                      color: "#E53E3E",
                                      background:
                                        "rgba(229,62,62,0.08)",
                                      padding:
                                        "0.25rem 0.75rem",
                                      borderRadius: "9999px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {dept}
                                  </span>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredMembers.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p
                style={{
                  fontFamily:
                    "Helvetica Neue, Helvetica, Arial, sans-serif",
                  color: "rgba(0,0,0,0.45)",
                }}
              >
                No team members found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* BOTTOM CTA                                                        */}
      {/* ================================================================ */}
      <section
        style={{
          background: "#111111",
          padding: "4rem 0",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ textAlign: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-4xl"
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontWeight: 400,
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "1rem",
                lineHeight: 1.1,
              }}
            >
              Ready to Work with{" "}
              <span style={{ color: "#E53E3E" }}>Our Experts?</span>
            </h2>
            <p
              className="text-lg"
              style={{
                fontFamily:
                  "Helvetica Neue, Helvetica, Arial, sans-serif",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "36rem",
                margin: "0 auto 2rem",
                lineHeight: 1.6,
              }}
            >
              Let our certified team transform your digital presence. From
              strategy to execution, we deliver results that matter.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "16px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                background: "#E53E3E",
                color: "#FFFFFF",
                borderRadius: "2px",
                transition: "all 0.3s",
                boxShadow: "0 4px 16px rgba(229,62,62,0.3)",
              }}
            >
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
