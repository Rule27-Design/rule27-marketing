"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

/**
 * R27Accordion — RULE27 FAQ/Accordion component.
 * Matches the Theme Component Display exactly:
 * - 2px red left-border on open
 * - Rotating "+" icon
 * - Subtle red background on open
 */
export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: "4px" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              background:
                open === i
                  ? "rgba(229,62,62,0.04)"
                  : "rgba(255,255,255,0.8)",
              border: `1px solid ${open === i ? "rgba(229,62,62,0.2)" : "rgba(0,0,0,0.06)"}`,
              borderLeft: `2px solid ${open === i ? "#E53E3E" : "rgba(0,0,0,0.08)"}`,
              color: open === i ? "#E53E3E" : "rgba(0,0,0,0.6)",
              padding: "14px 18px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
          >
            <span>{item.q}</span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              style={{ color: "#E53E3E", fontSize: "18px", flexShrink: 0, marginLeft: "1rem" }}
            >
              +
            </motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    background: "rgba(229,62,62,0.03)",
                    border: "1px solid rgba(229,62,62,0.08)",
                    borderTop: "none",
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "14px",
                    color: "rgba(0,0,0,0.55)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
