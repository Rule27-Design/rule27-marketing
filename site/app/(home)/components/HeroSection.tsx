"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, Compass, Calendar } from "lucide-react";
import { CalendlyModal } from "@/app/components/CalendlyModal";

// ---------------------------------------------------------------------------
// Typewriter hook (matching old site speeds exactly)
// ---------------------------------------------------------------------------

function useTypewriter(
  words: string[],
  typeSpeed = 100,
  deleteSpeed = 50,
  pause = 2000
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (text !== word) {
        timeout = setTimeout(
          () => setText(word.slice(0, text.length + 1)),
          typeSpeed
        );
      } else {
        timeout = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (text !== "") {
        timeout = setTimeout(() => setText((prev) => prev.slice(0, -1)), deleteSpeed);
      } else {
        setDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return text;
}

// ---------------------------------------------------------------------------
// Staggered fade-up variants for Framer Motion
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: "easeOut" as const },
  }),
};

// ---------------------------------------------------------------------------
// Floating particle data
// ---------------------------------------------------------------------------

const particles = [
  { top: "5rem", left: "2.5rem", size: "1rem", bg: "#E53E3E", blur: false, animation: "pulse" as const },
  { top: "10rem", right: "5rem", size: "0.75rem", bg: "rgba(255,255,255,0.3)", blur: false, animation: "pulse" as const },
  { bottom: "8rem", left: "33%", size: "0.5rem", bg: "rgba(229,62,62,0.6)", blur: false, animation: "pulse" as const },
  { top: "50%", right: "25%", size: "1.5rem", bg: "linear-gradient(135deg, #E53E3E, transparent)", blur: true, animation: "bounce" as const },
  { bottom: "5rem", right: "2.5rem", size: "1.25rem", bg: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)", blur: true, animation: "bounce" as const },
];

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------

export default function HeroSection() {
  const dynamicWords = useMemo(
    () => ["Audacity", "Innovation", "Excellence", "Vision", "Impact"],
    []
  );
  const currentText = useTypewriter(dynamicWords, 100, 50, 2000);

  const [cursorVisible, setCursorVisible] = useState(true);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse position for glow effect
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Floating element refs for mouse-interactive movement
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cursor blink at 530ms
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Entry visibility
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const bg = document.querySelector<HTMLElement>(".hero-background");
      if (bg) {
        bg.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      const floatingEls = document.querySelectorAll<HTMLElement>(".floating-element");
      floatingEls.forEach((el, index) => {
        const speed = 0.2 + index * 0.1;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse move handler for glow and interactive floaters
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      mouseX.set(relX);
      mouseY.set(relY);

      // Interactive floating elements
      const mxNorm = e.clientX / window.innerWidth - 0.5;
      const myNorm = e.clientY / window.innerHeight - 0.5;

      floatingRefs.current.forEach((el, index) => {
        if (!el) return;
        const speed = 20 + index * 10;
        el.style.transform = `translate(${mxNorm * speed}px, ${myNorm * speed}px)`;
      });
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }, [mouseX, mouseY]);

  // Mouse follower glow background (hook must be called at top level)
  const glowBackground = useMotionTemplate(smoothX, smoothY);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* ── Mouse Follower Glow ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        style={{ background: glowBackground }}
      />

      {/* ── Animated Background with Gradient Mesh ── */}
      <div className="hero-background absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #000 0%, #111 50%, #000 100%)",
          }}
        >
          {/* Gradient Mesh overlays */}
          <div className="absolute inset-0" style={{ opacity: 0.3 }}>
            <div
              className="absolute top-0 left-0 w-1/2 h-1/2"
              style={{
                background:
                  "radial-gradient(circle, rgba(229,62,62,0.2), transparent)",
                filter: "blur(48px)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-1/2 h-1/2"
              style={{
                background:
                  "radial-gradient(circle, rgba(229,62,62,0.1), transparent)",
                filter: "blur(48px)",
              }}
            />
          </div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0" style={{ opacity: 0.1 }}>
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
            }}
          />
        </div>
      </div>

      {/* ── Floating Elements with Parallax ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => {
          const posStyle: React.CSSProperties = {
            position: "absolute",
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            borderRadius: "9999px",
            background: p.bg,
            ...(p.blur ? { filter: "blur(12px)" } : {}),
          };

          // First 3 are interactive (floating-interactive)
          const isInteractive = i < 3;

          return (
            <motion.div
              key={i}
              ref={(el) => {
                if (isInteractive) floatingRefs.current[i] = el;
              }}
              className={`floating-element ${isInteractive ? "floating-interactive" : ""}`}
              style={posStyle}
              animate={
                p.animation === "pulse"
                  ? { opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }
                  : { y: [0, -20, 0] }
              }
              transition={{
                duration: p.animation === "pulse" ? 3 : 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          );
        })}
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline with Typewriter Effect */}
        <motion.div
          custom={0.3}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="block mb-2" />
            <span className="block text-center md:text-left">
              <span className="block md:inline">Where Creative </span>
              <span
                className="relative inline-block text-center md:text-left"
                style={{ minWidth: "200px" }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-heading)",
                    backgroundImage:
                      "linear-gradient(90deg, #E53E3E, #f87171, #E53E3E)",
                    backgroundSize: "300% 300%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "gradient 6s ease infinite",
                  }}
                >
                  {currentText}
                </span>
                <span
                  style={{
                    color: "#E53E3E",
                    opacity: cursorVisible ? 1 : 0,
                    transition: "opacity 0.1s",
                  }}
                >
                  |
                </span>
                <div
                  className="absolute left-0 right-0"
                  style={{
                    bottom: "-0.5rem",
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #E53E3E, transparent)",
                    transformOrigin: "left",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
              </span>
            </span>
            <span className="block mt-2">Meets Technical Precision</span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.div
          custom={0.4}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We don&apos;t just follow design trends, we create them. We don&apos;t
            just solve problems, we reimagine possibilities.{" "}
            <span
              style={{
                fontWeight: 600,
                backgroundImage: "linear-gradient(90deg, #E53E3E, #f87171)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Break conventional boundaries
            </span>{" "}
            and discover the creative partner that makes other agencies look
            ordinary.
          </p>
        </motion.div>

        {/* Interactive Stats Bar */}
        <motion.div
          custom={0.5}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <div className="flex justify-center space-x-8 mb-12" style={{ color: "rgba(255,255,255,0.8)" }}>
            {[
              { value: "150+", label: "Projects" },
              { value: "98%", label: "Satisfaction" },
              { value: "500%", label: "Avg Growth" },
            ].map((stat) => (
              <div key={stat.label} className="group cursor-pointer">
                <div
                  className="text-4xl uppercase transition-transform duration-300 group-hover:scale-110"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#E53E3E",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          custom={0.5}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={() => setCalendlyOpen(true)}
              className="inline-flex items-center gap-2 uppercase tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                padding: "1rem 2rem",
                color: "#FFFFFF",
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                borderRadius: "0.5rem",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#000";
                e.currentTarget.style.borderColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
              }}
            >
              <Calendar size={22} />
              Book a Free Consultation
            </button>

            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 uppercase tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                padding: "1rem 2rem",
                color: "#FFFFFF",
                border: "2px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(8px)",
                borderRadius: "0.5rem",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#FFFFFF";
              }}
            >
              <Compass size={22} />
              See Our Rulebook
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          custom={0.7}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeUp}
          className="flex flex-col items-center text-gray-400 group cursor-pointer"
        >
          <span
            className="text-sm mb-2 tracking-wide transition-colors duration-300 group-hover:text-[#E53E3E]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Discover More
          </span>
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "rgba(229,62,62,0.2)",
                filter: "blur(24px)",
              }}
            />
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
            >
              <ChevronDown size={24} style={{ color: "#E53E3E" }} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Gradient Overlay ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "8rem",
          background: "linear-gradient(to top, #fff, transparent)",
          opacity: 0.05,
        }}
      />

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Calendly Modal */}
      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helper: Build radial-gradient string from motion values
// (Framer Motion doesn't support template literals in style directly,
//  so we use a small hook that subscribes to the spring values.)
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useMotionTemplate(x: any, y: any) {
  const [bg, setBg] = useState(
    "radial-gradient(600px circle at -1000px -1000px, rgba(229,62,62,0.15), transparent 40%)"
  );

  useEffect(() => {
    const unsubX = x.on("change", (latestX: number) => {
      const latestY = y.get();
      setBg(
        `radial-gradient(600px circle at ${latestX}px ${latestY}px, rgba(229,62,62,0.15), transparent 40%)`
      );
    });
    const unsubY = y.on("change", (latestY: number) => {
      const latestX = x.get();
      setBg(
        `radial-gradient(600px circle at ${latestX}px ${latestY}px, rgba(229,62,62,0.15), transparent 40%)`
      );
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y]);

  return bg;
}
