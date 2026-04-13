"use client";

import { useState } from "react";
import { CalendlyModal } from "./CalendlyModal";

interface BookCallButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A button that opens the Calendly booking modal.
 * Use this in Server Components where you can't manage modal state directly.
 */
export function BookCallButton({
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: BookCallButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className}
        style={{ cursor: "pointer", ...style }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </button>
      <CalendlyModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
