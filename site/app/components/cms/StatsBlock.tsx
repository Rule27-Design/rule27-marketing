export interface Stat {
  value: string | number;
  label: string;
  description?: string;
}

export interface StatsBlockProps {
  stats: Stat[];
  title?: string;
  description?: string;
  variant?: "default" | "compact";
}

export function StatsBlock({ stats, title, description, variant = "default" }: StatsBlockProps) {
  if (!stats?.length) return null;

  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-lg border border-fg-border bg-fg-surface p-4 text-center">
            <div className="font-heading text-3xl text-brand md:text-4xl">{stat.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-fg-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="border-b border-fg-border bg-fg-bg py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-10 text-center">
            {title && <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">{title}</h2>}
            {description && <p className="mt-3 mx-auto max-w-2xl text-fg-muted">{description}</p>}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-lg border border-fg-border bg-fg-surface p-6 text-center">
              <div className="font-heading text-5xl text-brand md:text-6xl">{stat.value}</div>
              <div className="mt-2 text-sm uppercase tracking-wide text-fg-text font-bold">{stat.label}</div>
              {stat.description && <p className="mt-2 text-sm text-fg-muted">{stat.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
