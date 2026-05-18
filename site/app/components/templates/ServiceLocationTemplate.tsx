import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { StatsBlock } from "../cms/StatsBlock";
import { RichContent } from "../cms/RichContent";
import { RelatedItems } from "../cms/RelatedItems";
import type { CmsItem } from "../../lib/cms";

export interface ServiceLocationTemplateProps {
  item: CmsItem;
  relatedItems?: CmsItem[];
}

export function ServiceLocationTemplate({ item, relatedItems }: ServiceLocationTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};
  const local = (s.local_context as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? item.cluster_topic ?? undefined}
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

      {Boolean(s.stats && Array.isArray(s.stats)) && (
        <StatsBlock stats={s.stats as { value: string; label: string }[]} />
      )}

      {Boolean(s.features) && (
        <SectionList
          items={s.features as Array<Record<string, unknown>>}
          title="What's Included"
          variant="cards"
        />
      )}

      {Boolean(s.benefits) && (
        <SectionList
          items={s.benefits as Array<Record<string, unknown>>}
          title="Why This Matters"
          variant="checklist"
        />
      )}

      {Boolean(s.process) && (
        <SectionList
          items={s.process as Array<Record<string, unknown>>}
          title="Our Process"
          variant="numbered"
        />
      )}

      {Boolean(s.local_context && (local.overview || local.expertise)) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">
              {(local.heading as string) ?? `Why ${(local.city as string) ?? "Local"} Businesses Choose Rule27`}
            </h2>
            {Boolean(local.overview) && <RichContent body={local.overview as string} className="mt-6 prose prose-invert max-w-none text-fg-muted" />}
          </div>
        </section>
      )}

      {Boolean(s.why_us) && (
        <SectionList
          items={s.why_us as Array<Record<string, unknown>>}
          title="Why Rule27"
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

      {Boolean(s.related_services) && (
        <SectionList
          items={s.related_services as Array<Record<string, unknown>>}
          title="Related Services"
          variant="cards"
        />
      )}

      {relatedItems && relatedItems.length > 0 && (
        <RelatedItems items={relatedItems} collectionSlug="service-location" title="More From Rule27" />
      )}

      <CTABlock ctaType={(item.cta_type as never) ?? "free-audit"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />
    </article>
  );
}
