"use client";

import React from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  asChild?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: "6px 14px",
    fontSize: "11px",
    letterSpacing: "0.08em",
  },
  md: {
    padding: "10px 22px",
    fontSize: "12px",
    letterSpacing: "0.1em",
  },
  lg: {
    padding: "14px 32px",
    fontSize: "13px",
    letterSpacing: "0.12em",
  },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "#FFFFFF",
    border: "1px solid rgba(229,62,62,0.3)",
    borderLeft: "3px solid #E53E3E",
    color: "#111",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,62,62,0.08)",
  },
  secondary: {
    background: "rgba(255,255,255,0.95)",
    border: "1px solid rgba(0,0,0,0.1)",
    borderLeft: "2px solid rgba(229,62,62,0.25)",
    color: "rgba(0,0,0,0.7)",
  },
  ghost: {
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.08)",
    color: "rgba(0,0,0,0.5)",
  },
  danger: {
    background: "#E53E3E",
    border: "1px solid rgba(229,62,62,0.8)",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(229,62,62,0.25)",
  },
  outline: {
    background: "rgba(255,255,255,0.8)",
    border: "1px solid #E53E3E",
    color: "#E53E3E",
  },
};

const hoverShadows: Partial<Record<ButtonVariant, string>> = {
  primary:
    "0 4px 16px rgba(0,0,0,0.08), 0 0 12px rgba(229,62,62,0.12)",
  danger:
    "0 4px 16px rgba(229,62,62,0.35)",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  onClick,
  asChild = false,
  className,
  type = "button",
  "aria-label": ariaLabel,
}: ButtonProps) {
  // When asChild is true, render children directly with button styling applied via wrapper
  if (asChild) {
    return (
      <motion.span
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={className}
        style={{
          display: fullWidth ? "flex" : "inline-flex",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={
        disabled
          ? undefined
          : {
              scale: 1.02,
              boxShadow: hoverShadows[variant],
            }
      }
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      aria-label={ariaLabel}
      style={{
        position: "relative",
        fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: fullWidth ? "center" : "center",
        gap: "8px",
        overflow: "hidden",
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? "100%" : "auto",
        transition: "box-shadow 0.2s, border-color 0.2s",
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
    >
      {children}
    </motion.button>
  );
}
