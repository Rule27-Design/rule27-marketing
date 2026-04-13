"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function ShowcaseGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {images.map((url, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "66.67%", // 3:2 aspect ratio
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              background: "#F5F5F5",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
            onClick={() => setSelected(i)}
          >
            <Image
              src={url}
              alt={`${title} showcase ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                transition: "transform 0.5s",
              }}
            />

            {/* Hover overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              className="showcase-overlay"
            />

            {/* Expand icon */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
              className="showcase-expand"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hover styles */}
      <style>{`
        .showcase-overlay:hover,
        div:hover > .showcase-overlay {
          opacity: 1 !important;
        }
        div:hover > .showcase-expand {
          opacity: 1 !important;
        }
      `}</style>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              cursor: "pointer",
            }}
            onClick={() => setSelected(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 101,
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(
                      selected === 0 ? images.length - 1 : selected - 1,
                    );
                  }}
                  style={{
                    position: "absolute",
                    left: 24,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 101,
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
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(
                      selected === images.length - 1 ? 0 : selected + 1,
                    );
                  }}
                  style={{
                    position: "absolute",
                    right: 24,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 101,
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}

            <motion.div
              key={selected}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 1000,
                maxHeight: "80vh",
                aspectRatio: "16/10",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selected]}
                alt={`${title} showcase ${selected + 1}`}
                fill
                sizes="90vw"
                style={{
                  objectFit: "contain",
                  borderRadius: 4,
                }}
              />
            </motion.div>

            {/* Image counter */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {selected + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
