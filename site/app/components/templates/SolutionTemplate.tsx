import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { RichContent } from "../cms/RichContent";
import { RelatedItems } from "../cms/RelatedItems";
import type { CmsItem } from "../../lib/cms";

export interface SolutionTemplateProps {
  item: CmsItem;
  relatedItems?: CmsItem[];
}

export function SolutionTemplate({ item, relatedItems }: SolutionTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "Solution"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={hero.cta_primary as { label: string; href: string }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        stat={hero.stat as { value: string; label: string }}
        image={hero.image as { url: string; alt?: string; photographer?: string; pexels_url?: string }}
        variant={(hero.variant as "default" | "compact" | "split") ?? "default"}
      />

      {Boolean(s.problem) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">The Problem</p>
            <RichContent body={s.problem as string} />
          </div>
        </section>
      )}

      {Boolean(s.solution) && (
        <section className="border-b border-fg-border bg-fg-surface py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">The Solution</p>
            <RichContent body={s.solution as string} />
          </div>
        </section>
      )}

      {Boolean(s.process) && (
        <SectionList
          items={s.process as Array<Record<string, unknown>>}
          title="How It Works"
          variant="numbered"
        />
      )}

      {Boolean(s.results) && (
        <SectionList
          items={s.results as Array<Record<string, unknown>>}
          title="Results You Can Expect"
          variant="cards"
        />
      )}

      {Boolean(item.body) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={item.body as never} />
          </div>
        </section>
      )}

      {Boolean(s.faq) && <FAQAccordion questions={s.faq as never} />}

      {relatedItems && relatedItems.length > 0 && (
        <RelatedItems items={relatedItems} collectionSlug="solution" />
      )}

      <CTABlock ctaType={(item.cta_type as never) ?? "calendly"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />
    </article>
  );
}
