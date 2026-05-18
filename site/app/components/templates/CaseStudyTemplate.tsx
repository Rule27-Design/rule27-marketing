import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { CTABlock } from "../cms/CTABlock";
import { StatsBlock } from "../cms/StatsBlock";
import { RichContent } from "../cms/RichContent";
import { RelatedItems } from "../cms/RelatedItems";
import type { CmsItem } from "../../lib/cms";

export interface CaseStudyTemplateProps {
  item: CmsItem;
  relatedItems?: CmsItem[];
}

export function CaseStudyTemplate({ item, relatedItems }: CaseStudyTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "Case Study"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={hero.cta_primary as { label: string; href: string }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        stat={hero.stat as { value: string; label: string }}
        image={hero.image as { url: string; alt?: string; photographer?: string; pexels_url?: string }}
        variant={(hero.variant as "default" | "compact" | "split") ?? "split"}
      />

      {Boolean(s.headline_stats && Array.isArray(s.headline_stats)) && (
        <StatsBlock stats={s.headline_stats as { value: string; label: string }[]} />
      )}

      {Boolean(s.client_background) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">Client Background</h2>
            <div className="mt-6"><RichContent body={s.client_background as string} /></div>
          </div>
        </section>
      )}

      {Boolean(s.challenge) && (
        <section className="border-b border-fg-border bg-fg-surface py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">The Challenge</p>
            <RichContent body={s.challenge as string} />
          </div>
        </section>
      )}

      {Boolean(s.methodology) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">Methodology</h2>
            <div className="mt-6"><RichContent body={s.methodology as string} /></div>
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

      {Boolean(s.results) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">The Results</h2>
            <div className="mt-6"><RichContent body={s.results as string} /></div>
          </div>
        </section>
      )}

      {Boolean(s.lessons_learned) && (
        <SectionList items={s.lessons_learned as Array<Record<string, unknown>>} title="Lessons Learned" variant="checklist" />
      )}

      {Boolean(item.body) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={item.body as never} />
          </div>
        </section>
      )}

      {relatedItems && relatedItems.length > 0 && (
        <RelatedItems items={relatedItems} collectionSlug="case-study" title="More Case Studies" />
      )}

      <CTABlock ctaType="calendly" ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? "Get Results Like This"} />
    </article>
  );
}
