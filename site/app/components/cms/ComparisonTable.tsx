export interface ComparisonRow {
  feature?: string;
  name?: string;
  us?: string | boolean;
  them?: string | boolean;
  description?: string;
  [key: string]: unknown;
}

export interface ComparisonTableProps {
  rows: ComparisonRow[];
  title?: string;
  description?: string;
  usLabel?: string;
  themLabel?: string;
}

function renderCell(value: string | boolean | undefined): React.ReactNode {
  if (value === true) return <span className="text-brand">✓</span>;
  if (value === false) return <span className="text-fg-muted">—</span>;
  if (!value) return <span className="text-fg-muted">—</span>;
  return value;
}

export function ComparisonTable({
  rows,
  title = "How We Compare",
  description,
  usLabel = "Rule27",
  themLabel = "Typical Agency",
}: ComparisonTableProps) {
  if (!rows?.length) return null;

  return (
    <section className="border-b border-fg-border bg-fg-bg py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-4xl uppercase text-fg-text md:text-5xl">{title}</h2>
          {description && <p className="mt-3 text-fg-muted">{description}</p>}
        </div>

        <div className="overflow-x-auto rounded-lg border border-fg-border">
          <table className="min-w-full divide-y divide-fg-border">
            <thead className="sticky top-0 bg-fg-surface">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-fg-text">
                  Feature
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-brand">
                  {usLabel}
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-fg-muted">
                  {themLabel}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fg-border bg-fg-bg">
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold text-fg-text">{row.feature ?? row.name ?? ""}</div>
                    {row.description && <div className="mt-1 text-xs text-fg-muted">{row.description}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-fg-text">{renderCell(row.us as string | boolean | undefined)}</td>
                  <td className="px-6 py-4 text-sm text-fg-muted">{renderCell(row.them as string | boolean | undefined)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
