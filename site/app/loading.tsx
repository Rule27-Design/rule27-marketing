export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        background: "var(--color-wa-bg)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* RULE27 red-border spinner */}
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(0,0,0,0.06)",
            borderTop: "3px solid #E53E3E",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "rgba(0,0,0,0.4)",
          }}
        >
          Loading...
        </p>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
