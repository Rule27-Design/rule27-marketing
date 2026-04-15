"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { BookCallButton } from "./BookCallButton";

interface ConversionBreakProps {
  text: string;
  ctaText: string;
  action: "calendly" | "scroll" | "link";
  href?: string;
}

export function ConversionBreak({ text, ctaText, action, href }: ConversionBreakProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const buttonStyle: React.CSSProperties = {
    fontFamily: "'Steelfish', 'Impact', sans-serif",
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "10px 24px",
    border: "1px solid #E53E3E",
    color: "#E53E3E",
    background: "transparent",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: 2,
    transition: "all 0.2s",
    textDecoration: "none",
  };

  const handleScroll = () => {
    if (href) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      style={{
        padding: "2.5rem 1.5rem",
        maxWidth: 640,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Top divider */}
      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: "1.5rem" }} />

      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "15px",
          fontStyle: "italic",
          color: "rgba(0,0,0,0.45)",
          margin: "0 0 1rem",
          lineHeight: 1.6,
        }}
      >
        {text}
      </p>

      {action === "calendly" ? (
        <BookCallButton style={buttonStyle}>
          {ctaText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </BookCallButton>
      ) : action === "link" && href ? (
        <Link href={href} style={buttonStyle}>
          {ctaText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </Link>
      ) : (
        <button onClick={handleScroll} style={buttonStyle}>
          {ctaText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Bottom divider */}
      <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginTop: "1.5rem" }} />
    </motion.div>
  );
}
