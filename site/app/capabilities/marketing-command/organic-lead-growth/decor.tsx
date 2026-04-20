"use client";

import { motion } from "framer-motion";

/** Global CSS class that hides any decorative element under 760px. Kept in
 *  a singleton style tag so we only emit one media query rule no matter how
 *  many decorative elements we render. */
function DecorStyles() {
  return (
    <style>{`
      @media (max-width: 760px) {
        .olg-decor { display: none !important; }
      }
    `}</style>
  );
}

/**
 * Subtle full-bleed accent strip - placed between sections to break up
 * the otherwise plain off-white background and add Lego-piece visual presence.
 */
export function AccentStrip({
  variant = "left",
  height = 320,
}: {
  variant?: "left" | "right" | "center";
  height?: number;
}) {
  const positions = {
    left: { left: "-12%", right: "auto" },
    right: { left: "auto", right: "-12%" },
    center: { left: "20%", right: "20%" },
  } as const;

  return (
    <div
      className="olg-decor"
      style={{
        position: "relative",
        height,
        width: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <DecorStyles />
      <div
        style={{
          position: "absolute",
          top: "10%",
          ...positions[variant],
          width: "60%",
          height: "80%",
          background:
            "radial-gradient(ellipse at center, rgba(229,62,62,0.06), transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <motion.svg
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: "30%",
          left: 0,
          width: "100%",
          height: "40%",
          opacity: 0.25,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.25 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4 }}
      >
        <defs>
          <linearGradient id={`strip-${variant}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(229,62,62,0)" />
            <stop offset="50%" stopColor="rgba(229,62,62,0.6)" />
            <stop offset="100%" stopColor="rgba(229,62,62,0)" />
          </linearGradient>
        </defs>
        <path
          d="M 0 100 Q 200 60 400 100 T 800 100"
          stroke={`url(#strip-${variant})`}
          strokeWidth={1}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 110 Q 200 90 400 110 T 800 110"
          stroke={`url(#strip-${variant})`}
          strokeWidth={0.6}
          fill="none"
          vectorEffect="non-scaling-stroke"
          opacity={0.5}
        />
      </motion.svg>
    </div>
  );
}

/**
 * Fixed decorative dot grid that lives behind a section.
 */
export function DotGrid({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <>
      <DecorStyles />
      <div
        aria-hidden="true"
        className="olg-decor"
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          backgroundImage:
            "radial-gradient(circle, rgba(229,62,62,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/**
 * Hairline diagonal sweep - adds motion energy under headlines.
 */
export function DiagonalSweep() {
  return (
    <>
      <DecorStyles />
      <motion.div
        aria-hidden="true"
        className="olg-decor"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 0.6, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(229,62,62,0.3) 30%, rgba(229,62,62,0.6) 50%, rgba(229,62,62,0.3) 70%, transparent)",
          transform: "rotate(-2deg)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/**
 * Drifting graph-like SVG shapes — positioned absolute behind a section.
 * Low opacity, slow drift. Purely atmospheric.
 */
export function FloatingGraphShapes({ count = 3 }: { count?: number }) {
  return (
    <>
      <DecorStyles />
      <div
        aria-hidden="true"
        className="olg-decor"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            initial={{ opacity: 0, y: -8 }}
            animate={{
              opacity: 0.12,
              x: [0, i % 2 === 0 ? 14 : -14, 0],
              y: [-8, 8, -8],
            }}
            transition={{
              opacity: { duration: 1.4, delay: 0.2 * i },
              x: { duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 },
              y: { duration: 10 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
            }}
            style={{
              position: "absolute",
              top: `${15 + i * 25}%`,
              left: i % 2 === 0 ? "4%" : "auto",
              right: i % 2 === 1 ? "4%" : "auto",
              width: "40%",
              height: 70,
              filter: "blur(1.5px)",
            }}
          >
            <path
              d={`M 0 ${40 + i * 4} Q 25 ${30 - i * 4} 50 ${28 + i * 2} T 100 ${22 + i * 3} T 150 ${18 - i * 2} T 200 ${10 + i * 3}`}
              stroke="rgba(229,62,62,0.5)"
              strokeWidth={0.5}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>
        ))}
      </div>
    </>
  );
}
