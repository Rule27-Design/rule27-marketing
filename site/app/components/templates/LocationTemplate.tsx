import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { StatsBlock } from "../cms/StatsBlock";
import { RichContent } from "../cms/RichContent";
import type { CmsItem } from "../../lib/cms";

export interface LocationTemplateProps {
  item: CmsItem;
}

export function LocationTemplate({ item }: LocationTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "Location"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={hero.cta_primary as { label: string; href: string }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        stat={hero.stat as { value: string; label: string }}
        image={hero.image as { url: string; alt?: string; photographer?: string; pexels_url?: string }}
        variant={(hero.variant as "default" | "compact" | "split") ?? "split"}
      />

      {Boolean(s.overview) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={s.overview as string} />
          </div>
        </section>
      )}

      {Boolean(s.local_stats && Array.isArray(s.local_stats)) && (
        <StatsBlock stats={s.local_stats as { value: string; label: string }[]} title="By the Numbers" />
      )}

      {Boolean(s.services_available) && (
        <SectionList items={s.services_available as Array<Record<string, unknown>>} title="Services in This Area" variant="cards" />
      )}

      {Boolean(s.industries) && (
        <SectionList items={s.industries as Array<Record<string, unknown>>} title="Industries We Serve Locally" variant="icons" />
      )}

      {Boolean(item.body) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <RichContent body={item.body as never} />
          </div>
        </section>
      )}

      {Boolean(s.faq) && <FAQAccordion questions={s.faq as never} />}

      <CTABlock ctaType={(item.cta_type as never) ?? "free-audit"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />
    </article>
  );
}
