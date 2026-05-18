"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface StickyAuditCTAProps {
  headline?: string;
  ctaText?: string;
  ctaUrl?: string;
  threshold?: number;
}

export function StickyAuditCTA({
  headline = "Free SEO audit — see what you're missing",
  ctaText = "Get My Audit",
  ctaUrl = "/contact?source=sticky",
  threshold = 600,
}: StickyAuditCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 transform rounded-lg border border-brand bg-fg-surface px-4 py-3 shadow-lg transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3">
        <p className="flex-1 text-sm text-fg-text">{headline}</p>
        <Link
          href={ctaUrl}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors"
        >
          {ctaText}
          <span aria-hidden>→</span>
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-fg-muted hover:text-fg-text transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
