"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function BottomCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section ref={sectionRef} style={{ background: "#111111", padding: "clamp(3rem, 8vw, 5rem) 0" }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(229,62,62,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <MessageCircle size={24} style={{ color: "#E53E3E" }} />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily:
              "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
            fontSize: "clamp(1.75rem, 5vw, 3rem)",
            fontWeight: 400,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            margin: "0 0 0.75rem",
            lineHeight: 1,
          }}
        >
          Partner With Us on{" "}
          <span style={{ color: "#E53E3E" }}>Innovation</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily:
              "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
            fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
            margin: "0 0 2rem",
          }}
        >
          Ready to push the boundaries of what&apos;s possible? Let&apos;s
          explore emerging technologies, experimental strategies, and
          breakthrough design together.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #E53E3E, #c53030)",
                color: "#FFFFFF",
                textDecoration: "none",
                border: "none",
                boxShadow: "0 4px 20px rgba(229,62,62,0.4)",
              }}
            >
              Start a Conversation
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/capabilities"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "transparent",
                color: "#FFFFFF",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Explore Capabilities
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
