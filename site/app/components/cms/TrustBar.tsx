export interface TrustBarItem {
  label: string;
  value?: string;
  icon?: string;
}

export interface TrustBarProps {
  items: TrustBarItem[];
  variant?: "default" | "compact";
}

export function TrustBar({ items, variant = "default" }: TrustBarProps) {
  if (!items?.length) return null;

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-fg-border bg-fg-surface py-4 px-6 text-sm text-fg-muted">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            {item.icon && <span aria-hidden className="text-brand">{item.icon}</span>}
            {item.value && <span className="font-semibold text-fg-text">{item.value}</span>}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="border-y border-fg-border bg-fg-surface py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              {item.icon && <div className="mb-2 text-2xl text-brand">{item.icon}</div>}
              {item.value && <div className="font-heading text-2xl text-fg-text">{item.value}</div>}
              <div className="text-xs uppercase tracking-wide text-fg-muted">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
