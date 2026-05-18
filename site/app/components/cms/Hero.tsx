import Link from "next/link";
import { ImageWithCredit } from "./ImageWithCredit";

export interface HeroProps {
  headline?: string;
  subheadline?: string;
  description?: string;
  eyebrow?: string;
  cta_primary?: { label: string; href: string };
  cta_secondary?: { label: string; href: string };
  stat?: { value: string; label: string };
  image?: { url: string; alt?: string; photographer?: string; pexels_url?: string };
  variant?: "default" | "compact" | "split";
}

export function Hero({
  headline,
  subheadline,
  description,
  eyebrow,
  cta_primary,
  cta_secondary,
  stat,
  image,
  variant = "default",
}: HeroProps) {
  if (variant === "split" && image) {
    return (
      <section className="relative border-b border-fg-border bg-fg-bg text-fg-text overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div>
            {eyebrow && <p className="mb-3 text-sm font-bold tracking-widest uppercase text-brand">{eyebrow}</p>}
            {headline && <h1 className="font-heading text-4xl uppercase leading-tight md:text-6xl">{headline}</h1>}
            {subheadline && <p className="mt-4 text-lg text-fg-muted md:text-xl">{subheadline}</p>}
            {description && <p className="mt-6 text-base text-fg-muted">{description}</p>}
            <CtaRow primary={cta_primary} secondary={cta_secondary} />
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-fg-border">
            <ImageWithCredit
              src={image.url}
              alt={image.alt ?? headline ?? ""}
              photographer={image.photographer}
              pexelsUrl={image.pexels_url}
              className="object-cover"
              fill
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative border-b border-fg-border bg-fg-bg text-fg-text overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:4rem_4rem]" />
      <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28 lg:px-8 text-center">
        {eyebrow && <p className="mb-3 text-sm font-bold tracking-widest uppercase text-brand">{eyebrow}</p>}
        {headline && (
          <h1 className="font-heading text-5xl uppercase leading-tight md:text-7xl">
            {headline}
          </h1>
        )}
        {subheadline && <p className="mt-6 text-xl text-fg-muted md:text-2xl">{subheadline}</p>}
        {description && <p className="mt-4 mx-auto max-w-3xl text-base text-fg-muted">{description}</p>}
        {stat && (
          <div className="mt-8 inline-flex flex-col items-center rounded-lg border border-brand/30 bg-brand-dim px-6 py-4">
            <span className="font-heading text-4xl text-brand md:text-5xl">{stat.value}</span>
            <span className="mt-1 text-sm uppercase tracking-wide text-fg-muted">{stat.label}</span>
          </div>
        )}
        <CtaRow primary={cta_primary} secondary={cta_secondary} center />
      </div>
    </section>
  );
}

function CtaRow({
  primary,
  secondary,
  center = false,
}: {
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  center?: boolean;
}) {
  if (!primary && !secondary) return null;
  return (
    <div className={`mt-10 flex flex-wrap gap-4 ${center ? "justify-center" : ""}`}>
      {primary && (
        <Link
          href={primary.href}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-semibold text-white hover:bg-brand/90 transition-colors"
        >
          {primary.label}
          <span aria-hidden>→</span>
        </Link>
      )}
      {secondary && (
        <Link
          href={secondary.href}
          className="inline-flex items-center gap-2 rounded-md border border-fg-border px-6 py-3 font-semibold text-fg-text hover:bg-fg-surface transition-colors"
        >
          {secondary.label}
        </Link>
      )}
    </div>
  );
}
