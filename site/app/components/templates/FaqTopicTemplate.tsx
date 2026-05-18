import { Hero } from "../cms/Hero";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { RichContent } from "../cms/RichContent";
import { SectionList } from "../cms/SectionList";
import type { CmsItem } from "../../lib/cms";

export interface FaqTopicTemplateProps {
  item: CmsItem;
}

export function FaqTopicTemplate({ item }: FaqTopicTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "FAQ"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={hero.cta_primary as { label: string; href: string }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        variant="compact"
      />

      {Boolean(s.overview) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={s.overview as string} />
          </div>
        </section>
      )}

      {Boolean(s.questions) && <FAQAccordion questions={s.questions as never} title={`${item.title} — Answers`} />}

      {Boolean(item.body) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={item.body as never} />
          </div>
        </section>
      )}

      {Boolean(s.related_topics) && (
        <SectionList items={s.related_topics as Array<Record<string, unknown>>} title="Related Topics" variant="cards" />
      )}

      <CTABlock ctaType={(item.cta_type as never) ?? "free-audit"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />
    </article>
  );
}
