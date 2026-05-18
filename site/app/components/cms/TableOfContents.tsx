"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
  level: number;
}

export interface TableOfContentsProps {
  items?: TocItem[];
  autoExtract?: boolean;
  title?: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function TableOfContents({
  items: providedItems,
  autoExtract = true,
  title = "On This Page",
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>(providedItems ?? []);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (providedItems?.length || !autoExtract) return;
    const headings = Array.from(document.querySelectorAll("article h2, article h3")) as HTMLElement[];
    const extracted: TocItem[] = headings.map(h => {
      if (!h.id) h.id = slugify(h.textContent ?? "");
      return {
        id: h.id,
        label: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      };
    });
    setItems(extracted);
  }, [providedItems, autoExtract]);

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%" },
    );
    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-lg border border-fg-border bg-fg-surface p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">{title}</p>
      <ol className="space-y-2 text-sm">
        {items.map(item => (
          <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${item.id}`}
              className={`block transition-colors hover:text-brand ${
                activeId === item.id ? "text-brand font-semibold" : "text-fg-muted"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
