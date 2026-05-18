"use client";

import { useState } from "react";

export interface FAQItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

export interface FAQAccordionProps {
  questions: FAQItem[] | { questions: FAQItem[] };
  title?: string;
  description?: string;
}

function normalize(input: FAQAccordionProps["questions"]): FAQItem[] {
  if (Array.isArray(input)) return input;
  if (input && typeof input === "object" && Array.isArray(input.questions)) {
    return input.questions;
  }
  return [];
}

export function FAQAccordion({
  questions,
  title = "Frequently Asked Questions",
  description,
}: FAQAccordionProps) {
  const items = normalize(questions);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <section className="border-b border-fg-border bg-fg-bg py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">{title}</h2>
          {description && <p className="mt-3 text-fg-muted">{description}</p>}
        </div>

        <div className="divide-y divide-fg-border rounded-lg border border-fg-border bg-fg-surface">
          {items.map((item, i) => {
            const q = item.question ?? item.q ?? "";
            const a = item.answer ?? item.a ?? "";
            const open = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-fg-bg"
                >
                  <span className="font-semibold text-fg-text">{q}</span>
                  <span
                    aria-hidden
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-fg-border text-fg-muted transition-transform ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {open && (
                  <div className="px-6 pb-6 text-fg-muted">
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: a }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
