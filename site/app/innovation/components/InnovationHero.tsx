"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, ChevronDown, Zap } from "lucide-react";

/* ─── Fade-up variant ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: "easeOut" as const },
  }),
};

/* ─── Floating particles ─── */
interface Particle {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  bg: string;
}

const particles: Particle[] = [
  { top: "15%", left: "8%", size: 16, bg: "#E53E3E" },
  { top: "30%", right: "5%", size: 12, bg: "rgba(255,255,255,0.3)" },
  { top: "70%", left: "33%", size: 8, bg: "rgba(229,62,62,0.6)" },
];

/* ─── Stats ─── */
const stats = [
  { value: "27+", label: "Active Experiments" },
  { value: "150K+", label: "Data Points Analyzed" },
  { value: "99.9%", label: "Prediction Accuracy" },
];

/* ─── Mouse glow hook ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useMotionGlow(x: any, y: any) {
  const [bg, setBg] = useState(
    "radial-gradient(600px circle at -1000px -1000px, rgba(229,62,62,0.12), transparent 40%)"
  );

  useEffect(() => {
    const unsubX = x.on("change", (latestX: number) => {
      const latestY = y.get();
      setBg(
        `radial-gradient(600px circle at ${latestX}px ${latestY}px, rgba(229,62,62,0.12), transparent 40%)`
      );
    });
    const unsubY = y.on("change", (latestY: number) => {
      const latestX = x.get();
      setBg(
        `radial-gradient(600px circle at ${latestX}px ${latestY}px, rgba(229,62,62,0.12), transparent 40%)`
      );
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y]);

  return bg;
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function InnovationHero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const glowBg = useMotionGlow(smoothX, smoothY);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Mouse Follower Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        style={{ background: glowBg }}
      />

      {/* ── Background ── */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #000000 0%, #111111 50%, #1a1a1a 100%)",
          }}
        />
        {/* Red glow top-left */}
        <div
          className="absolute top-0 left-0 w-1/2 h-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(229,62,62,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Red glow bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-1/2 h-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(229,62,62,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Center radial glow */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: "800px",
            height: "800px",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.1,
          backgroundImage:
            "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
        aria-hidden="true"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="floating-element"
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              right: p.right,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.bg,
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        {/* Innovation badge */}
        <motion.div
          custom={0.1}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
          style={{ marginBottom: "2rem" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily:
                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#E53E3E",
              background: "rgba(229,62,62,0.1)",
              border: "1px solid rgba(229,62,62,0.2)",
              borderRadius: "9999px",
              padding: "8px 20px",
            }}
          >
            <Zap size={16} style={{ color: "#E53E3E" }} />
            Innovation Laboratory
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#E53E3E",
                display: "inline-block",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          custom={0.3}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <h1
            style={{
              fontFamily:
                "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontWeight: 400,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 0.95,
              margin: "0 0 1.5rem",
            }}
          >
            <motion.span
              style={{
                display: "block",
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                marginBottom: "0.25rem",
              }}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Where
            </motion.span>
            <motion.span
              style={{
                display: "block",
                color: "#E53E3E",
                fontSize: "clamp(3rem, 10vw, 8rem)",
              }}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Tomorrow
            </motion.span>
            <motion.span
              style={{
                display: "block",
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
              }}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              Begins
            </motion.span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          custom={0.5}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
          style={{ maxWidth: "56rem", margin: "0 auto 3rem" }}
        >
          <p
            style={{
              fontFamily:
                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.05rem, 2.5vw, 1.4rem)",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              margin: 0,
              padding: "0 1rem",
            }}
          >
            Experimental features, emerging technologies, and forward-thinking
            insights that shape the future of digital experiences. Welcome to
            Rule27 Design&apos;s innovation playground.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          custom={0.6}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "3.5rem",
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#experimental"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "14px",
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
              Explore Experiments
              <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#trends"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "14px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "transparent",
                color: "#FFFFFF",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              <Play size={18} />
              Watch Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={0.8}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
          style={{
            display: "grid",
            gap: "2rem",
            maxWidth: "48rem",
            margin: "0 auto 3rem",
          }}
          className="grid-cols-1 sm:grid-cols-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <div
                style={{
                  fontFamily:
                    "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  color: "#E53E3E",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.25rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily:
                    "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                  fontSize: "clamp(0.75rem, 1.2vw, 0.9rem)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center"
        >
          <motion.span
            style={{
              fontFamily:
                "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={24} style={{ color: "#E53E3E" }} />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "8rem",
          background: "linear-gradient(to top, #FCFCFB, transparent)",
        }}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
