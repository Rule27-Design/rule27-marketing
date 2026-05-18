import { richTextToHtml, type CmsBody } from "../../lib/rich-text";

export interface RichContentProps {
  body: CmsBody;
  className?: string;
}

export function RichContent({ body, className }: RichContentProps) {
  const html = richTextToHtml(body);
  if (!html) return null;

  return (
    <div
      className={
        className ??
        "prose prose-invert prose-headings:font-heading prose-headings:uppercase prose-a:text-brand prose-strong:text-fg-text max-w-none"
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
