import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { CTABlock } from "../cms/CTABlock";
import { RichContent } from "../cms/RichContent";
import { AuthorBio } from "../cms/AuthorBio";
import { TableOfContents } from "../cms/TableOfContents";
import type { CmsItem } from "../../lib/cms";

export interface AnswerTemplateProps {
  item: CmsItem;
}

export function AnswerTemplate({ item }: AnswerTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};
  const author = (s.author as Record<string, unknown>) ?? {};

  return (
    <article>
      <section className="relative border-b border-fg-border bg-fg-bg text-fg-text py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {Boolean(hero.query) && (
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">Question</p>
          )}
          <h1 className="font-heading text-4xl uppercase leading-tight md:text-6xl">
            {(hero.query as string) ?? (hero.headline as string) ?? item.title}
          </h1>
          {Boolean(hero.direct_answer) && (
            <div className="mt-8 rounded-lg border border-brand/30 bg-brand-dim p-6 md:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand">Direct Answer</p>
              <RichContent body={hero.direct_answer as string} className="prose prose-invert prose-lg max-w-none" />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 lg:px-8">
        <div>
          {Boolean(item.body) && <RichContent body={item.body as never} />}

          {Boolean(s.key_takeaways) && (
            <div className="mt-12">
              <SectionList items={s.key_takeaways as Array<Record<string, unknown>>} title="Key Takeaways" variant="checklist" />
            </div>
          )}

          {Boolean(s.related_questions) && (
            <SectionList items={s.related_questions as Array<Record<string, unknown>>} title="Related Questions" variant="cards" />
          )}

          {Boolean(s.references) && (
            <SectionList items={s.references as Array<Record<string, unknown>>} title="References" variant="cards" />
          )}

          {Boolean(author.name) && (
            <AuthorBio
              name={author.name as string}
              role={author.role as string}
              bio={author.bio as string}
              avatar={author.avatar as string}
              href={author.href as string}
            />
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents autoExtract />
          </div>
        </aside>
      </div>

      <CTABlock ctaType={(item.cta_type as never) ?? "free-audit"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />
    </article>
  );
}
