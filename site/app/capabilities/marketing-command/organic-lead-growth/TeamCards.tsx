"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TEAM } from "./data/team";

export function TeamCards() {
  return (
    <section
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2.25rem", textAlign: "center" }}>
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
          Who actually does the work
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.5rem",
            lineHeight: 1.05,
          }}
        >
          Two humans. Zero outsourcing. The whole engine.
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "1rem",
            color: "rgba(0,0,0,0.55)",
            margin: "0 auto",
            maxWidth: 580,
            lineHeight: 1.65,
          }}
        >
          You&apos;re not getting handed off to an account manager you&apos;ll
          never meet. These are the people in your Slack channel.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {TEAM.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            style={{
              background: "#FAF9F6",
              border: "1px solid rgba(0,0,0,0.08)",
              borderLeft: "3px solid #E53E3E",
              padding: "1.5rem 1.5rem 1.25rem",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "box-shadow 0.3s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 120,
                height: 120,
                background:
                  "radial-gradient(circle at top right, rgba(229,62,62,0.07), transparent 65%)",
                pointerEvents: "none",
              }}
            />

            {/* Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                marginBottom: "1rem",
                position: "relative",
              }}
            >
              <Avatar member={m} />
              <div>
                <div
                  style={{
                    fontFamily: "'Steelfish', 'Impact', sans-serif",
                    fontSize: "1.2rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#111",
                    lineHeight: 1.05,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#E53E3E",
                    marginTop: "0.2rem",
                  }}
                >
                  {m.role}
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                color: "rgba(0,0,0,0.6)",
                lineHeight: 1.6,
                margin: "0 0 1rem",
                position: "relative",
              }}
            >
              {m.blurb}
            </p>

            <div
              style={{
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  marginBottom: "0.3rem",
                }}
              >
                Their thing
              </div>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(0,0,0,0.7)",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {m.superpower}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Avatar({ member }: { member: (typeof TEAM)[number] }) {
  if (member.imageSrc) {
    return (
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(229,62,62,0.3)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <Image
          src={member.imageSrc}
          alt={member.name}
          fill
          sizes="56px"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, #0A0A0A 0%, #1a0606 100%)",
        border: "2px solid rgba(229,62,62,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Steelfish', 'Impact', sans-serif",
        fontSize: "1.05rem",
        letterSpacing: "0.08em",
        color: "#E53E3E",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(229,62,62,0.25)",
      }}
    >
      {member.initials}
    </div>
  );
}
