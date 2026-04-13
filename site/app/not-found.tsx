import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "This page does not exist in our universe.",
};

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        background: "var(--color-wa-bg)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Large 404 */}
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(6rem, 20vw, 14rem)",
          fontWeight: 700,
          letterSpacing: "0.05em",
          lineHeight: 0.9,
          margin: 0,
          color: "transparent",
          backgroundImage: "linear-gradient(135deg, #E53E3E, #c53030)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}
      >
        404
      </h1>

      {/* Accent line */}
      <div
        style={{
          width: 60,
          height: 2,
          background: "#E53E3E",
          margin: "1.5rem auto",
        }}
        aria-hidden="true"
      />

      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.25rem, 3vw, 2rem)",
          fontWeight: 400,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#111",
          margin: "0 0 0.75rem",
        }}
      >
        You&apos;ve Broken{" "}
        <span style={{ color: "#E53E3E" }}>The 27th Rule</span>
      </h2>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "rgba(0,0,0,0.5)",
          maxWidth: 460,
          lineHeight: 1.6,
          margin: "0 0 2.5rem",
        }}
      >
        This page doesn&apos;t exist in our universe. But that&apos;s
        okay&mdash;breaking rules is what we do best. Let&apos;s get you
        back to somewhere extraordinary.
      </p>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: "3rem",
          marginBottom: "2.5rem",
          justifyContent: "center",
        }}
      >
        {[
          { value: "404", label: "Pages Lost" },
          { value: "\u221E", label: "Possibilities" },
          { value: "1", label: "Way Forward" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.75rem",
                color: "#E53E3E",
                letterSpacing: "0.05em",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                color: "rgba(0,0,0,0.4)",
                marginTop: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "12px 28px",
            background: "#E53E3E",
            color: "#fff",
            border: "none",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "opacity 0.2s",
          }}
        >
          Return to Homepage
        </Link>
      </div>

      {/* Explore links */}
      <div
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "rgba(0,0,0,0.4)",
            marginBottom: "1rem",
          }}
        >
          Or explore our universe:
        </p>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            { name: "Capabilities", path: "/capabilities" },
            { name: "Case Studies", path: "/case-studies" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.4)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
