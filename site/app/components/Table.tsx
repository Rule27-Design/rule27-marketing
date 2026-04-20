"use client";

import { useState } from "react";

interface TableProps {
  headers: string[];
  rows: string[][];
}

/**
 * R27Table - RULE27 Data Table component.
 * Matches the Theme Component Display exactly:
 * - Red uppercase Steelfish headers with 2px red bottom border
 * - Subtle red-tinted header background
 * - Row hover highlighting with red tint
 * - First column bold, rest muted
 */
export function Table({ headers, rows }: TableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  color: "#E53E3E",
                  textTransform: "uppercase",
                  borderBottom: "2px solid rgba(229,62,62,0.2)",
                  background: "rgba(229,62,62,0.02)",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                background:
                  hoveredRow === i
                    ? "rgba(229,62,62,0.04)"
                    : "transparent",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                transition: "background 0.2s",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "12px 16px",
                    fontFamily: "Helvetica Neue, sans-serif",
                    fontSize: "14px",
                    color: j === 0 ? "#111" : "rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
