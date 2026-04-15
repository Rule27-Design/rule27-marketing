"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom";
}

export function Tooltip({ content, position = "bottom" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [visible]);

  return (
    <span
      ref={ref}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: "6px" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
    >
      {/* Info icon */}
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "rgba(229,62,62,0.1)",
          color: "#E53E3E",
          fontSize: "10px",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          fontFamily: "Helvetica Neue, sans-serif",
        }}
      >
        i
      </span>

      {/* Tooltip bubble */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? 4 : -4 }}
            transition={{ duration: 0.15, ease: "easeOut" as const }}
            style={{
              position: "absolute",
              [position === "top" ? "bottom" : "top"]: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#111111",
              color: "#FFFFFF",
              borderLeft: "2px solid #E53E3E",
              padding: "10px 14px",
              maxWidth: 280,
              minWidth: 180,
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "13px",
              lineHeight: 1.5,
              zIndex: 1000,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              whiteSpace: "normal",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
