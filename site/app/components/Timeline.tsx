interface TimelineItem {
  date: string;
  title: string;
  desc: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

/**
 * R27Timeline — RULE27 Timeline component.
 * Matches the Theme Component Display exactly:
 * - Vertical red gradient line
 * - Red-bordered circles with red dot centers
 * - Date in red, title in Steelfish, description in body font
 */
export function Timeline({ items }: TimelineProps) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: "14px",
          top: 0,
          bottom: 0,
          width: "1px",
          background:
            "linear-gradient(to bottom, #E53E3E, rgba(229,62,62,0.1))",
        }}
      />
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(229,62,62,0.08)",
              border: "1.5px solid #E53E3E",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                background: "#E53E3E",
                borderRadius: "50%",
              }}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "11px",
                color: "#E53E3E",
                letterSpacing: "0.1em",
                margin: "0 0 2px 0",
                textTransform: "uppercase",
              }}
            >
              {item.date}
            </p>
            <h4
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "16px",
                color: "#111",
                margin: "0 0 4px 0",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {item.title}
            </h4>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "13px",
                color: "rgba(0,0,0,0.5)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
