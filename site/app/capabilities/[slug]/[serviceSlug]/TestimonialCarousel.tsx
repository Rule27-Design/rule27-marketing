"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ServiceTestimonial } from "@/app/lib/types";

function StarIcon({ filled = true, size = 14 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#E53E3E" : "none"}
      stroke="#E53E3E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: ServiceTestimonial[];
}) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > active ? 1 : -1);
      setActive(index);
    },
    [active],
  );

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[active];
  if (!current) return null;

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          minHeight: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              width: "100%",
              maxWidth: 700,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            {/* Result metric callout */}
            {current.resultMetric && (
              <div
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  color: "#E53E3E",
                  marginBottom: "1rem",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                &ldquo;{current.resultMetric}&rdquo;
              </div>
            )}

            {/* Quote */}
            <div
              style={{
                position: "relative",
                marginBottom: "1.5rem",
              }}
            >
              {/* Decorative quote mark */}
              <span
                style={{
                  position: "absolute",
                  top: "-0.75rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "Georgia, serif",
                  fontSize: "4rem",
                  color: "rgba(229,62,62,0.1)",
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                &ldquo;
              </span>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  color: "rgba(0,0,0,0.65)",
                  lineHeight: 1.8,
                  margin: 0,
                  fontStyle: "italic",
                  paddingTop: "1rem",
                }}
              >
                {current.quote}
              </p>
            </div>

            {/* Star rating */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "3px",
                marginBottom: "1rem",
              }}
            >
              {Array.from({ length: 5 }).map((_, si) => (
                <StarIcon key={si} filled={si < current.rating} size={16} />
              ))}
            </div>

            {/* Client info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
              }}
            >
              {current.clientAvatar && (
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid rgba(229,62,62,0.15)",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Image
                    src={current.clientAvatar}
                    alt={current.clientName}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#111111",
                  }}
                >
                  {current.clientName}
                </div>
                {(current.clientTitle || current.clientCompany) && (
                  <div
                    style={{
                      fontFamily: "Helvetica Neue, sans-serif",
                      fontSize: "0.8rem",
                      color: "rgba(0,0,0,0.45)",
                    }}
                  >
                    {[current.clientTitle, current.clientCompany]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {testimonials.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "1.5rem",
          }}
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === active ? "#E53E3E" : "rgba(0,0,0,0.12)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
