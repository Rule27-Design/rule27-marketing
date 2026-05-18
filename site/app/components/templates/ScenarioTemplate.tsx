import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { CTABlock } from "../cms/CTABlock";
import { RichContent } from "../cms/RichContent";
import type { CmsItem } from "../../lib/cms";

export interface ScenarioTemplateProps {
  item: CmsItem;
}

export function ScenarioTemplate({ item }: ScenarioTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "Scenario"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={hero.cta_primary as { label: string; href: string }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        variant="compact"
      />

      {Boolean(s.diagnosis) && (
        <section className="border-b border-fg-border bg-fg-surface py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">Diagnosis</p>
            <RichContent body={s.diagnosis as string} />
          </div>
        </section>
      )}

      {Boolean(s.solution_path) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">Solution Path</h2>
            <div className="mt-6"><RichContent body={s.solution_path as string} /></div>
          </div>
        </section>
      )}

      {Boolean(s.real_example) && (
        <section className="border-b border-fg-border bg-fg-surface py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">Real Example</p>
            <RichContent body={s.real_example as string} />
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

      {Boolean(s.related_scenarios) && (
        <SectionList items={s.related_scenarios as Array<Record<string, unknown>>} title="Similar Scenarios" variant="cards" />
      )}

      <CTABlock ctaType={(item.cta_type as never) ?? "calendly"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? "Talk to a Strategist"} />
    </article>
  );
}
