import { Hero } from "../cms/Hero";
import { SectionList } from "../cms/SectionList";
import { FAQAccordion } from "../cms/FAQAccordion";
import { CTABlock } from "../cms/CTABlock";
import { RichContent } from "../cms/RichContent";
import { RelatedItems } from "../cms/RelatedItems";
import { AuthorBio } from "../cms/AuthorBio";
import { TableOfContents } from "../cms/TableOfContents";
import { StickyAuditCTA } from "../cms/StickyAuditCTA";
import type { CmsItem } from "../../lib/cms";

export interface BlogPostTemplateProps {
  item: CmsItem;
  relatedItems?: CmsItem[];
}

export function BlogPostTemplate({ item, relatedItems }: BlogPostTemplateProps) {
  const s = (item.sections ?? {}) as Record<string, unknown>;
  const hero = (s.hero as Record<string, unknown>) ?? {};
  const author = (s.author as Record<string, unknown>) ?? {};

  return (
    <article>
      <Hero
        eyebrow={(hero.eyebrow as string) ?? item.cluster_topic ?? "Guide"}
        headline={(hero.headline as string) ?? item.title}
        subheadline={hero.subheadline as string}
        description={(hero.description as string) ?? item.excerpt ?? undefined}
        cta_primary={hero.cta_primary as { label: string; href: string }}
        cta_secondary={hero.cta_secondary as { label: string; href: string }}
        image={hero.image as { url: string; alt?: string; photographer?: string; pexels_url?: string }}
        variant={(hero.variant as "default" | "compact" | "split") ?? "compact"}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12 lg:px-8">
        <div>
          {Boolean(item.body) && <RichContent body={item.body as never} />}

          {Boolean(s.key_takeaways) && (
            <div className="mt-12">
              <SectionList items={s.key_takeaways as Array<Record<string, unknown>>} title="Key Takeaways" variant="checklist" />
            </div>
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

      {Boolean(s.faq) && <FAQAccordion questions={s.faq as never} />}

      {relatedItems && relatedItems.length > 0 && (
        <RelatedItems items={relatedItems} collectionSlug="blog-post" title="Keep Reading" />
      )}

      <CTABlock ctaType={(item.cta_type as never) ?? "free-audit"} ctaUrl={item.cta_url ?? "/contact"} ctaText={item.cta_text ?? undefined} />

      <StickyAuditCTA />
    </article>
  );
}
