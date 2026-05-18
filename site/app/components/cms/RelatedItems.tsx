import Link from "next/link";
import type { CmsItem } from "../../lib/cms";
import { urlForItem } from "../../lib/cms";

export interface RelatedItemsProps {
  items: CmsItem[];
  collectionSlug: string;
  title?: string;
  description?: string;
}

export function RelatedItems({
  items,
  collectionSlug,
  title = "Related",
  description,
}: RelatedItemsProps) {
  if (!items?.length) return null;

  return (
    <section className="border-b border-fg-border bg-fg-bg py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">{title}</h2>
          {description && <p className="mt-3 text-fg-muted">{description}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <Link
              key={item.id}
              href={urlForItem(collectionSlug, item.slug)}
              className="group block overflow-hidden rounded-lg border border-fg-border bg-fg-surface transition-colors hover:border-brand"
            >
              {item.featured_image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.featured_image}
                  alt={item.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              )}
              <div className="p-5">
                {item.cluster_topic && (
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand">
                    {item.cluster_topic}
                  </p>
                )}
                <h3 className="font-heading text-xl uppercase text-fg-text group-hover:text-brand">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{item.excerpt}</p>
                )}
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Read more <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
