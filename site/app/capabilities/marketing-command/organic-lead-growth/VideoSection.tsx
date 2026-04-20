"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface VideoSectionProps {
  videoSrc?: string;
  posterSrc?: string;
  industryDisplay: string;
}

/**
 * 90-second pitch video. Placeholder in dev (so it shows up in the layout
 * during design review). Hidden in production until a real video is wired up.
 *
 * To enable in production: pass a real `videoSrc` prop or set
 * NEXT_PUBLIC_OLG_VIDEO_URL in env.
 */
export function VideoSection({ videoSrc, posterSrc, industryDisplay }: VideoSectionProps) {
  const isDev = process.env.NODE_ENV !== "production";
  const realSrc = videoSrc || process.env.NEXT_PUBLIC_OLG_VIDEO_URL;

  // Hidden in prod when no real video is provided
  if (!isDev && !realSrc) return null;

  return (
    <section
      style={{
        position: "relative",
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        background: "linear-gradient(180deg, #FCFCFB 0%, #F5F4F1 100%)",
        overflow: "hidden",
      }}
    >
      {/* Decorative blob */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "40%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(229,62,62,0.08), transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          right: "-15%",
          width: "50%",
          height: "70%",
          background:
            "radial-gradient(circle, rgba(229,62,62,0.05), transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
          gap: "2.5rem",
          alignItems: "center",
        }}
        className="olg-video-grid"
      >
        <div>
          <div
            style={{
              display: "inline-block",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "#E53E3E",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(229,62,62,0.3)",
              paddingBottom: "4px",
              marginBottom: "1rem",
            }}
          >
            90 seconds
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 400,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#111",
              margin: "0 0 1rem",
              lineHeight: 1.05,
            }}
          >
            See the play in motion.
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1rem",
              color: "rgba(0,0,0,0.6)",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            A 90-second walkthrough showing how page architecture changes the
            search game for {industryDisplay.toLowerCase()} businesses. Watch
            once — the rest of this page makes a different kind of sense after.
          </p>
        </div>

        <VideoFrame realSrc={realSrc} posterSrc={posterSrc} isDev={isDev} />
      </div>

      <style>{`
        @media (max-width: 760px) {
          .olg-video-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function VideoFrame({
  realSrc,
  posterSrc,
  isDev,
}: {
  realSrc?: string;
  posterSrc?: string;
  isDev: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: "#0A0A0A",
        border: "1px solid rgba(229,62,62,0.25)",
        borderLeft: "3px solid #E53E3E",
        boxShadow: "0 24px 60px rgba(0,0,0,0.3), inset 0 0 60px rgba(229,62,62,0.04)",
        overflow: "hidden",
        cursor: realSrc ? "pointer" : "default",
      }}
      onClick={() => realSrc && setPlaying(true)}
    >
      {realSrc && playing ? (
        <video
          src={realSrc}
          poster={posterSrc}
          autoPlay
          controls
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <>
          {/* Atmospheric inner */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(229,62,62,0.18), transparent 60%)",
            }}
          />
          {/* Grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.1,
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Play overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "rgba(229,62,62,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(229,62,62,0.5)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFFFFF">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </div>
            <div
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: 14,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                opacity: 0.85,
              }}
            >
              {realSrc ? "Press play" : "Video coming"}
            </div>
            {isDev && !realSrc && (
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "3px 8px",
                }}
              >
                Dev-only placeholder · hidden in prod
              </div>
            )}
          </div>

          {/* Bottom tape */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 36,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: 10,
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E53E3E" }} />
            REC · 00:00 / 01:30
          </div>
        </>
      )}
    </motion.div>
  );
}
