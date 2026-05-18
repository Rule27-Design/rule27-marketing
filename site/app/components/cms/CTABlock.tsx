import Link from "next/link";

export interface CTABlockProps {
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaType?: "calendly" | "free-audit" | "contact-form" | "download" | "default";
  secondaryText?: string;
  secondaryUrl?: string;
  variant?: "panel" | "inline" | "banner";
}

const COPY_FOR_TYPE: Record<string, { headline: string; description: string; ctaText: string }> = {
  calendly: {
    headline: "Book a 30-Minute Strategy Call",
    description: "No pitch deck. We look at your site live, find the gaps costing you traffic, and tell you what to do — even if it's not us.",
    ctaText: "Book Strategy Call",
  },
  "free-audit": {
    headline: "Get Your Free SEO Audit",
    description: "We'll audit your top 10 pages, your competitors, and your local SERP presence. Real PDF, real recommendations, no AI slop.",
    ctaText: "Get Free Audit",
  },
  "contact-form": {
    headline: "Tell Us About Your Project",
    description: "Drop your details and we'll come back inside 24 hours with a clear next step.",
    ctaText: "Start the Conversation",
  },
  download: {
    headline: "Download the Playbook",
    description: "The full PDF — every framework, template, and checklist we use with clients.",
    ctaText: "Download Now",
  },
  default: {
    headline: "Ready to Outrank Your Competitors?",
    description: "Rule27 builds SEO programs that actually move revenue. Let's see if we're a fit.",
    ctaText: "Talk to Rule27",
  },
};

export function CTABlock({
  headline,
  description,
  ctaText,
  ctaUrl = "/contact",
  ctaType = "default",
  secondaryText,
  secondaryUrl,
  variant = "panel",
}: CTABlockProps) {
  const defaults = COPY_FOR_TYPE[ctaType] ?? COPY_FOR_TYPE.default;
  const finalHeadline = headline ?? defaults.headline;
  const finalDescription = description ?? defaults.description;
  const finalCtaText = ctaText ?? defaults.ctaText;

  if (variant === "inline") {
    return (
      <div className="my-12 rounded-lg border border-brand/40 bg-brand-dim p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-heading text-2xl uppercase text-fg-text">{finalHeadline}</h3>
            <p className="mt-1 text-fg-muted">{finalDescription}</p>
          </div>
          <Link
            href={ctaUrl}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand/90 transition-colors"
          >
            {finalCtaText}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <section className="border-y border-brand/30 bg-brand py-12 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h2 className="font-heading text-3xl uppercase md:text-5xl">{finalHeadline}</h2>
          {finalDescription && <p className="mt-3 max-w-2xl mx-auto text-white/90">{finalDescription}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-brand hover:bg-white/95 transition-colors"
            >
              {finalCtaText}
              <span aria-hidden>→</span>
            </Link>
            {secondaryText && secondaryUrl && (
              <Link
                href={secondaryUrl}
                className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {secondaryText}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-fg-border bg-fg-bg py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="rounded-2xl border border-brand/30 bg-brand-dim p-8 text-center md:p-12">
          <h2 className="font-heading text-3xl uppercase text-fg-text md:text-5xl">{finalHeadline}</h2>
          {finalDescription && <p className="mt-4 mx-auto max-w-2xl text-fg-muted md:text-lg">{finalDescription}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand/90 transition-colors"
            >
              {finalCtaText}
              <span aria-hidden>→</span>
            </Link>
            {secondaryText && secondaryUrl && (
              <Link
                href={secondaryUrl}
                className="inline-flex items-center gap-2 rounded-md border border-fg-border px-6 py-3 font-semibold text-fg-text hover:bg-fg-surface transition-colors"
              >
                {secondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
