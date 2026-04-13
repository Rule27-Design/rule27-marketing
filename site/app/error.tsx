"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        background: "var(--color-wa-bg)",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(229,62,62,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E53E3E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.75rem",
          }}
        >
          Something Went Wrong
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.5)",
            lineHeight: 1.6,
            margin: "0 0 2rem",
          }}
        >
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={reset}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "12px 28px",
              background: "#E53E3E",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Try Again
          </button>

          <Link
            href="/"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "12px 28px",
              background: "transparent",
              color: "#E53E3E",
              border: "1px solid #E53E3E",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
