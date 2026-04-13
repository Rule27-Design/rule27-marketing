interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Red accent line */}
      <div
        style={{
          width: "40px",
          height: "2px",
          background: "#E53E3E",
          marginBottom: "1rem",
        }}
        aria-hidden="true"
      />

      {/* Heading */}
      <h2
        style={{
          fontFamily:
            "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          fontWeight: 400,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#111",
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>

      {/* Subtle divider */}
      <div
        style={{
          width: "100%",
          maxWidth: "120px",
          height: "1px",
          background: "rgba(0,0,0,0.08)",
          marginTop: "0.75rem",
        }}
        aria-hidden="true"
      />

      {/* Optional subtitle */}
      {subtitle && (
        <p
          style={{
            fontFamily:
              "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.5)",
            marginTop: "0.75rem",
            lineHeight: 1.6,
            maxWidth: "600px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
