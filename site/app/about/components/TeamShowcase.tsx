"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import type { TeamMember } from "@/app/lib/types";

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

interface TeamShowcaseProps {
  teamMembers: TeamMember[];
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function TeamShowcase({ teamMembers }: TeamShowcaseProps) {
  /* Only show members whose department array contains "Leadership" */
  const displayMembers = teamMembers.filter((m) =>
    m.department?.some((d) => d.toLowerCase() === "leadership")
  );

  return (
    <section
      id="team"
      style={{
        padding: "clamp(3rem, 8vw, 6rem) 1.5rem",
        background: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring" as const, stiffness: 300 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(229,62,62,0.06)",
              padding: "4px 14px",
              marginBottom: "1rem",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "#E53E3E",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Meet Our Team
            </span>
          </motion.div>

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
            The <span style={{ color: "#E53E3E" }}>Leadership Team</span>
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
            Meet the certified professionals leading Rule27 Design&apos;s digital innovation.
          </p>
        </motion.div>

        {/* Featured Team Grid */}
        <div
          style={{
            display: "grid",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/team/${member.slug}`} style={{ textDecoration: "none" }}>
                <Card>
                  {/* Avatar Area */}
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      background: "linear-gradient(135deg, rgba(229,62,62,0.12), rgba(26,26,26,0.08))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.full_name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        style={{
                          width: 96,
                          height: 96,
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                            fontSize: "2.5rem",
                            color: "#111111",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          {member.full_name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <h3
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "1.1rem",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 0.25rem",
                    }}
                  >
                    {member.full_name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.8rem",
                      color: "rgba(0,0,0,0.5)",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {member.job_title}
                  </p>

                  {/* Expertise Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {member.expertise?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          background: "rgba(229,62,62,0.06)",
                          color: "#E53E3E",
                          fontFamily: "Helvetica Neue, sans-serif",
                          fontSize: "10px",
                          fontWeight: 500,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: "center" }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/team"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "#E53E3E",
                color: "#FFFFFF",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(229,62,62,0.25)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              View All Team Members
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
