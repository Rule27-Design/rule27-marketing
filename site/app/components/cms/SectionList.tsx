export interface SectionListItem {
  title?: string;
  heading?: string;
  name?: string;
  description?: string;
  body?: string;
  text?: string;
  icon?: string;
  [key: string]: unknown;
}

export interface SectionListProps {
  items: SectionListItem[] | string[];
  title?: string;
  description?: string;
  variant?: "cards" | "icons" | "checklist" | "numbered";
}

function getTitle(item: SectionListItem | string): string {
  if (typeof item === "string") return item;
  return (item.title ?? item.heading ?? item.name ?? "") as string;
}

function getDesc(item: SectionListItem | string): string {
  if (typeof item === "string") return "";
  return (item.description ?? item.body ?? item.text ?? "") as string;
}

export function SectionList({
  items,
  title,
  description,
  variant = "cards",
}: SectionListProps) {
  if (!items?.length) return null;

  return (
    <section className="border-b border-fg-border bg-fg-bg py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-10">
            {title && <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">{title}</h2>}
            {description && <p className="mt-3 max-w-2xl text-fg-muted">{description}</p>}
          </div>
        )}

        {variant === "checklist" && (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  ✓
                </span>
                <div>
                  <div className="font-semibold text-fg-text">{getTitle(item)}</div>
                  {getDesc(item) && <div className="text-sm text-fg-muted">{getDesc(item)}</div>}
                </div>
              </li>
            ))}
          </ul>
        )}

        {variant === "numbered" && (
          <ol className="space-y-6">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-4 rounded-lg border border-fg-border bg-fg-surface p-5">
                <span className="font-heading flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-lg text-white">
                  {i + 1}
                </span>
                <div>
                  <div className="font-heading text-xl uppercase text-fg-text">{getTitle(item)}</div>
                  {getDesc(item) && <p className="mt-1 text-fg-muted">{getDesc(item)}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}

        {(variant === "cards" || variant === "icons") && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg border border-fg-border bg-fg-surface p-6 transition-colors hover:border-brand">
                {variant === "icons" && typeof item === "object" && item.icon && (
                  <div className="mb-3 text-3xl text-brand">{item.icon as string}</div>
                )}
                <h3 className="font-heading text-xl uppercase text-fg-text">{getTitle(item)}</h3>
                {getDesc(item) && <p className="mt-2 text-sm text-fg-muted">{getDesc(item)}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
