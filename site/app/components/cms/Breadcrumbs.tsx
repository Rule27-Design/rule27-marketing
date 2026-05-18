import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  crumbs: Crumb[];
}

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function buildCrumbsFromPath(path: string, finalLabel?: string): Crumb[] {
  const segments = path.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];
  segments.forEach((seg, i) => {
    const isLast = i === segments.length - 1;
    crumbs.push({
      label: isLast && finalLabel ? finalLabel : titleCase(seg),
      href: isLast ? undefined : "/" + segments.slice(0, i + 1).join("/"),
    });
  });
  return crumbs;
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  if (!crumbs?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="border-b border-fg-border bg-fg-bg">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-3 text-sm text-fg-muted lg:px-8">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="hover:text-brand transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-fg-text" : ""}>
                  {crumb.label}
                </span>
              )}
              {!isLast && <span aria-hidden className="text-fg-muted/50">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
