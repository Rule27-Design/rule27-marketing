import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { StatsBlock } from "../cms/StatsBlock";
import { RichContent } from "../cms/RichContent";
import { RelatedItems } from "../cms/RelatedItems";
import type { CmsItem } from "../../lib/cms";

export interface TechnologyTemplateProps {
  item: CmsItem;
  relatedItems?: CmsItem[];
}

export function TechnologyTemplate({ item, relatedItems }: TechnologyTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "Technology"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={hero.cta_primary as { label: string; href: string }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        stat={hero.stat as { value: string; label: string }}
        image={hero.image as { url: string; alt?: string; photographer?: string; pexels_url?: string }}
        variant={(hero.variant as "default" | "compact" | "split") ?? "default"}
      />

      {Boolean(s.overview) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={s.overview as string} />
          </div>
        </section>
      )}

      {Boolean(s.capabilities) && (
        <SectionList items={s.capabilities as Array<Record<string, unknown>>} title="Capabilities" variant="cards" />
      )}

      {Boolean(s.use_cases) && (
        <SectionList items={s.use_cases as Array<Record<string, unknown>>} title="Use Cases" variant="numbered" />
      )}

      {Boolean(s.stats && Array.isArray(s.stats)) && <StatsBlock stats={s.stats as { value: string; label: string }[]} />}

      {Boolean(item.body) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={item.body as never} />
          </div>
        </section>
      )}

      {Boolean(s.faq) && <FAQAccordion questions={s.faq as never} />}

      {relatedItems && relatedItems.length > 0 && (
        <RelatedItems items={relatedItems} collectionSlug="technology" />
      )}

      <CTABlock ctaType={(item.cta_type as never) ?? "default"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />
    </article>
  );
}
