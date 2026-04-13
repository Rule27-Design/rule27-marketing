"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export function WaveBorder({ animated }: { animated?: boolean }) {
  const time = useRef(0);
  const [, setPhase] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      time.current += 0.05;
      setPhase(time.current);
    }, 16);
    return () => clearInterval(interval);
  }, [animated]);

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
      viewBox="0 0 300 200"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 0 Q 75 -5, 150 2 Q 225 8, 300 0"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.8"
        animate={
          animated
            ? {
                d: [
                  "M 0 0 Q 75 -5, 150 2 Q 225 8, 300 0",
                  "M 0 0 Q 75 5, 150 -2 Q 225 -8, 300 0",
                  "M 0 0 Q 75 -5, 150 2 Q 225 8, 300 0",
                ],
              }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M 0 200 Q 75 205, 150 198 Q 225 192, 300 200"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.8"
        animate={
          animated
            ? {
                d: [
                  "M 0 200 Q 75 205, 150 198 Q 225 192, 300 200",
                  "M 0 200 Q 75 195, 150 202 Q 225 208, 300 200",
                  "M 0 200 Q 75 205, 150 198 Q 225 192, 300 200",
                ],
              }
            : {}
        }
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M 0 0 Q 75 -3, 150 1 Q 225 5, 300 0"
        fill="none"
        stroke="#E53E3E"
        strokeWidth="1"
        opacity={0.6}
        animate={{ strokeDashoffset: [0, -100] }}
        strokeDasharray="8 4"
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}
