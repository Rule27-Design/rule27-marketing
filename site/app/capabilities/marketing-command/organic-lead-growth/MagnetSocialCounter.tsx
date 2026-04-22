"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Tooltip } from "@/app/components/Tooltip";

interface MagnetSocialCounterProps {
  /** Source of truth count. In dev this is a static stub; when Odoo is wired,
   *  this becomes the live pipeline count. */
  total: number;
  label?: string;
  tooltip?: string;
  durationMs?: number;
}

/** Digit column is sized in `em` (relative to the parent's font-size) so the
 *  odometer cell scales with the clamp() sizing around it and never clips
 *  cap/descender height no matter how large the banner renders. */
const DIGIT_HEIGHT_EM = 1.1;

function OdometerDigit({ target }: { target: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.62em",
        height: `${DIGIT_HEIGHT_EM}em`,
        overflow: "hidden",
        position: "relative",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          transform: `translateY(-${target * DIGIT_HEIGHT_EM}em)`,
          transition: "transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{
              height: `${DIGIT_HEIGHT_EM}em`,
              lineHeight: `${DIGIT_HEIGHT_EM}em`,
              textAlign: "center",
              display: "block",
            }}
          >
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

function Odometer({ value }: { value: number }) {
  const str = Math.floor(value).toLocaleString();
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        lineHeight: DIGIT_HEIGHT_EM,
      }}
    >
      {str.split("").map((ch, i) =>
        /[0-9]/.test(ch) ? (
          <OdometerDigit key={i} target={Number(ch)} />
        ) : (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: `${DIGIT_HEIGHT_EM}em`,
              lineHeight: `${DIGIT_HEIGHT_EM}em`,
              padding: "0 0.06em",
              verticalAlign: "middle",
            }}
          >
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export function MagnetSocialCounter({
  total,
  label = "Companies in our magnet pipeline",
  tooltip = "Pipeline count = businesses we've researched and have magnet reports prepared for - regardless of whether they've engaged yet. Social proof from scale, not claimed outcomes.",
  durationMs = 2400,
}: MagnetSocialCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(total * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, total, durationMs]);

  return (
    <div
      ref={ref}
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        background:
          "linear-gradient(90deg, #050505 0%, #0A0A0A 35%, #1a0606 100%)",
        borderTop: "1px solid rgba(229,62,62,0.25)",
        borderBottom: "1px solid rgba(229,62,62,0.25)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 3,
          background: "#E53E3E",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "100%",
          background:
            "radial-gradient(ellipse at right, rgba(229,62,62,0.18), transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "2.2rem clamp(1.25rem, 4vw, 3rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(1rem, 3vw, 2.4rem)",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "relative",
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#E53E3E",
              display: "inline-block",
              boxShadow: "0 0 14px rgba(229,62,62,0.8)",
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: -5,
                borderRadius: "50%",
                border: "2px solid #E53E3E",
                animation: "mag-pulse 2s ease-out infinite",
              }}
            />
          </span>
          <span
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#E53E3E",
            }}
          >
            Live
          </span>
        </div>

        <div
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            color: "#FFFFFF",
            lineHeight: DIGIT_HEIGHT_EM,
            letterSpacing: "0.04em",
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 0 32px rgba(229,62,62,0.3)",
            display: "inline-flex",
            alignItems: "center",
            padding: "0.1em 0",
          }}
        >
          <Odometer value={value} />
        </div>

        <div
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.5,
            display: "flex",
            alignItems: "center",
            maxWidth: 360,
          }}
        >
          {label}
          <Tooltip content={tooltip} position="top" />
        </div>
      </div>

      <style>{`
        @keyframes mag-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
