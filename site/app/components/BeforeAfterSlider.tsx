"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = useCallback(() => setDragging(true), []);
  const handleMouseUp = useCallback(() => setDragging(false), []);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragging) updatePosition(e.clientX);
    },
    [dragging, updatePosition]
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        overflow: "hidden",
        borderRadius: 2,
        cursor: dragging ? "ew-resize" : "default",
        userSelect: "none",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* After image (full width, underneath) */}
      <Image
        src={afterImage}
        alt={afterLabel}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        style={{ objectFit: "cover" }}
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ objectFit: "cover" }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          background: "rgba(0,0,0,0.6)",
          padding: "4px 10px",
          borderRadius: 2,
        }}
      >
        {beforeLabel}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          background: "rgba(229,62,62,0.8)",
          padding: "4px 10px",
          borderRadius: 2,
        }}
      >
        {afterLabel}
      </div>

      {/* Drag handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          transform: "translateX(-50%)",
          width: 2,
          background: "#E53E3E",
          zIndex: 10,
        }}
      >
        {/* Grip circle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "2px solid #E53E3E",
            cursor: "ew-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            touchAction: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8l4 4-4 4M6 8l-4 4 4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
