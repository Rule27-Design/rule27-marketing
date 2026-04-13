"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const dynamicWords = [
  "Obsessive Perfection",
  "Relentless Excellence",
  "Meticulous Craft",
  "Flawless Execution",
  "Uncompromising Quality",
];

const stats = [
  { number: "27+", label: "Visionary Minds", delay: 0.8 },
  { number: "150+", label: "Projects Transformed", delay: 0.9 },
  { number: "11+", label: "Years Disrupting", delay: 1.0 },
  { number: "\u221E", label: "Conventional Rules Broken", delay: 1.1 },
];

export default function AboutHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const sectionRef = useRef<HTMLElement>(null);

  /* typewriter effect */
  useEffect(() => {
    const word = dynamicWords[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (text !== word) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 100);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (text !== "") {
        timeout = setTimeout(() => setText((p) => p.slice(0, -1)), 50);
      } else {
        setDeleting(false);
        setWordIndex((p) => (p + 1) % dynamicWords.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex]);

  /* cursor blink */
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((p) => !p), 530);
    return () => clearInterval(id);
  }, []);

  /* mouse follower glow */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const handleMouseLeave = () => {
      setMousePosition({ x: -1000, y: -1000 });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* Mouse Follower Glow */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          zIndex: 30,
          transition: "opacity 0.3s",
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(229, 62, 62, 0.15), transparent 40%)`,
        }}
      />

      {/* Animated Background with Gradient Mesh */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #000000 0%, #111111 50%, #1a1a1a 100%)",
          }}
        />
        {/* Gradient mesh blobs */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "50%",
              background: "radial-gradient(circle, rgba(229,62,62,0.2) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "50%",
              height: "50%",
              background: "radial-gradient(circle, rgba(229,62,62,0.1) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: "25%",
              left: "25%",
              width: 288,
              height: 288,
              background: "rgba(229,62,62,0.2)",
              borderRadius: "50%",
              filter: "blur(80px)",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
          />
          <motion.div
            style={{
              position: "absolute",
              bottom: "25%",
              right: "25%",
              width: 384,
              height: 384,
              background: "rgba(229,62,62,0.1)",
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
          />
        </div>

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
          aria-hidden="true"
        />

        {/* Floating Particles */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                background: "rgba(229,62,62,0.3)",
                borderRadius: "50%",
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 100}%`,
              }}
              animate={{
                x: [0, (i % 2 === 0 ? 1 : -1) * (50 + i * 10), 0],
                y: [0, (i % 3 === 0 ? -1 : 1) * (30 + i * 8), 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "linear" as const,
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated Orbiting Elements */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "33%",
          height: 600,
          opacity: 0.3,
        }}
        className="hidden lg:block"
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{ position: "absolute", width: "100%", height: "100%" }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear" as const,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  background: "#E53E3E",
                  borderRadius: "50%",
                  boxShadow: "0 0 20px rgba(229,62,62,0.5)",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translateX(${100 + i * 30}px)`,
                }}
              />
            </motion.div>
          ))}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 128,
              height: 128,
              background: "rgba(229,62,62,0.1)",
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
        </div>
      </div>

      {/* Floating Interactive Elements */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.div
          style={{
            position: "absolute",
            top: "5rem",
            left: "2.5rem",
            width: 16,
            height: 16,
            background: "#E53E3E",
            borderRadius: "50%",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
        />
        <motion.div
          style={{
            position: "absolute",
            top: "10rem",
            right: "5rem",
            width: 12,
            height: 12,
            background: "rgba(255,255,255,0.3)",
            borderRadius: "50%",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 }}
        />
        <motion.div
          style={{
            position: "absolute",
            bottom: "8rem",
            left: "33%",
            width: 8,
            height: 8,
            background: "rgba(229,62,62,0.6)",
            borderRadius: "50%",
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
        />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "0 1rem",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" as const, stiffness: 100 }}
          style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "center" }}
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 40px rgba(229,62,62,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "background 0.5s",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "28px",
                color: "#1a1a1a",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              27
            </span>
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontWeight: 400,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 0.95,
              margin: "0 0 1.5rem",
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <motion.span
              style={{ display: "block", marginBottom: "0.25rem" }}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              The Rebels Behind
            </motion.span>
            <motion.span
              style={{ display: "block", color: "#E53E3E" }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Rule27 Design
            </motion.span>
          </h1>
        </motion.div>

        {/* Typewriter Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ maxWidth: "56rem", margin: "0 auto 2.5rem", padding: "0 1rem" }}
        >
          <p
            style={{
              fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              margin: 0,
            }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl"
          >
            Born from{" "}
            <span style={{ color: "#E53E3E", fontWeight: 600 }}>rebellious innovation</span> and
            crafted with{" "}
            <span style={{ position: "relative", display: "inline-block", minWidth: 200 }}>
              <span
                style={{
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: "linear-gradient(90deg, #FFFFFF, rgba(255,255,255,0.7), #FFFFFF)",
                  backgroundSize: "300% 300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {text}
              </span>
              <span
                style={{
                  opacity: cursorVisible ? 1 : 0,
                  color: "#FFFFFF",
                  transition: "opacity 0.1s",
                  WebkitTextFillColor: "#FFFFFF",
                }}
              >
                |
              </span>
              <motion.div
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)",
                }}
                animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
              />
            </span>
            <br />
            Meet the minds, methodology, and culture that make conventional boundaries disappear.
          </p>
        </motion.div>

        {/* Interactive Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            display: "grid",
            gap: "1.5rem",
            marginBottom: "2.5rem",
            maxWidth: "48rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          className="grid-cols-2 sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              style={{ textAlign: "center", cursor: "default" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              whileHover={{
                scale: 1.1,
                transition: { type: "spring" as const, stiffness: 300 },
              }}
            >
              <motion.div
                style={{
                  fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                  color: "#E53E3E",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.25rem",
                }}
                className="text-2xl sm:text-3xl md:text-4xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 100, delay: stat.delay + 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div
                style={{
                  fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                  fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* TWO CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#origin-story"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #E53E3E, #c53030)",
                color: "#FFFFFF",
                textDecoration: "none",
                border: "none",
                boxShadow: "0 4px 20px rgba(229,62,62,0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Discover Our Story
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#team"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "transparent",
                color: "#FFFFFF",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.4)",
                backdropFilter: "blur(4px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Meet the Rebels
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            marginTop: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <motion.span
            style={{
              fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
          >
            Discover More
          </motion.span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E53E3E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "8rem",
          background: "linear-gradient(to top, #FCFCFB, transparent)",
        }}
      />
    </section>
  );
}
