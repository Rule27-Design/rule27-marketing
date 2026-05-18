import { Hero } from "../cms/Hero";
import { ComparisonTable } from "../cms/ComparisonTable";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { RichContent } from "../cms/RichContent";
import { SectionList } from "../cms/SectionList";
import type { CmsItem } from "../../lib/cms";

export interface ComparisonTemplateProps {
  item: CmsItem;
}

export function ComparisonTemplate({ item }: ComparisonTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "Comparison"}
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

      {Boolean(s.comparison_table && Array.isArray(s.comparison_table)) && (
        <ComparisonTable
          rows={s.comparison_table as Array<Record<string, unknown>>}
          usLabel={(hero.us_label as string) ?? "Rule27"}
          themLabel={(hero.them_label as string) ?? "Alternative"}
        />
      )}

      {Boolean(s.features) && (
        <SectionList items={s.features as Array<Record<string, unknown>>} title="Feature Breakdown" variant="cards" />
      )}

      {Boolean(s.detailed_analysis) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">Detailed Analysis</h2>
            <div className="mt-6"><RichContent body={s.detailed_analysis as string} /></div>
          </div>
        </section>
      )}

      {Boolean(item.body) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={item.body as never} />
          </div>
        </section>
      )}

      {Boolean(s.faq) && <FAQAccordion questions={s.faq as never} />}

      <CTABlock ctaType={(item.cta_type as never) ?? "calendly"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />
    </article>
  );
}
