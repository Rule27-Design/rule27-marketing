import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { RichContent } from "../cms/RichContent";
import type { CmsItem } from "../../lib/cms";

export interface ToolTemplateProps {
  item: CmsItem;
}

export function ToolTemplate({ item }: ToolTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? "Free Tool"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={(hero.cta_primary as { label: string; href: string }) ?? { label: "Run the Tool", href: "#tool" }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        variant="compact"
      />

      <section id="tool" className="border-b border-fg-border bg-fg-surface py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="rounded-2xl border border-fg-border bg-fg-bg p-6 md:p-10">
            <p className="text-center text-fg-muted">
              Tool interface placeholder — wire the actual tool component here based on{" "}
              <span className="text-brand">{item.slug}</span>.
            </p>
          </div>
        </div>
      </section>

      {Boolean(s.what_it_checks) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">What This Tool Checks</h2>
            <div className="mt-6"><RichContent body={s.what_it_checks as string} /></div>
          </div>
        </section>
      )}

      {Boolean(s.how_to_interpret) && (
        <section className="border-b border-fg-border bg-fg-bg py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">How to Read the Results</h2>
            <div className="mt-6"><RichContent body={s.how_to_interpret as string} /></div>
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

      {Boolean(s.related_tools) && (
        <SectionList items={s.related_tools as Array<Record<string, unknown>>} title="More Free Tools" variant="cards" />
      )}

      <CTABlock ctaType={(item.cta_type as never) ?? "free-audit"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? "Want a Real Audit?"} />
    </article>
  );
}
