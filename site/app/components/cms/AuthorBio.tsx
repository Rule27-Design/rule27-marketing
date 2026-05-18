import Link from "next/link";

export interface AuthorBioProps {
  name?: string;
  role?: string;
  bio?: string;
  avatar?: string;
  href?: string;
}

export function AuthorBio({
  name = "Rule27 Editorial Team",
  role,
  bio,
  avatar,
  href,
}: AuthorBioProps) {
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <aside className="my-12 rounded-lg border border-fg-border bg-fg-surface p-6">
      <Wrapper {...(wrapperProps as { href: string })} className="flex items-start gap-4">
        {avatar && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={avatar}
            alt={name}
            className="h-16 w-16 shrink-0 rounded-full border border-fg-border object-cover"
          />
        )}
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-fg-muted">Written by</p>
          <p className="font-heading text-2xl uppercase text-fg-text">{name}</p>
          {role && <p className="text-sm text-fg-muted">{role}</p>}
          {bio && <p className="mt-2 text-sm text-fg-muted">{bio}</p>}
        </div>
      </Wrapper>
    </aside>
  );
}
