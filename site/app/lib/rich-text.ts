/**
 * Rich-text serializer — converts CMS body content to HTML for rendering.
 *
 * The CMS body field can be:
 *   - A string (treated as HTML — pass through)
 *   - { format: 'markdown', content: string } → markdown rendered to HTML
 *   - { format: 'html', content: string } → HTML passed through
 *   - A block-tree { type: 'doc', blocks: [...] } (Skulptor-compatible)
 *   - null / undefined → empty string
 *
 * For seeded pages (Phase 6), the seeding script writes either:
 *   { format: 'markdown', content: '# heading\n\nparagraph...' }
 * or directly as HTML for templates that need fine-grained control.
 */

interface BlockTreeBlock {
  id?: string;
  type?: string;
  content?: Array<{ type?: string; text?: string }> | string;
}

interface BlockTree {
  type?: string;
  version?: number;
  blocks?: BlockTreeBlock[];
}

interface MarkdownBody {
  format: "markdown";
  content: string;
}

interface HtmlBody {
  format: "html";
  content: string;
}

export type CmsBody = string | BlockTree | MarkdownBody | HtmlBody | null | undefined;

// ---- Lightweight markdown-to-HTML (no dependency) --------------------------
// Handles the subset the seeding LLM emits: headings, paragraphs, bold, italic,
// inline code, code blocks, lists, links. For anything richer we add a real
// library later (marked, remark).

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inlineMarkdown(line: string): string {
  // Code spans (process first so they're not formatted)
  const codeSpans: string[] = [];
  line = line.replace(/`([^`]+)`/g, (_, code) => {
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return `\x00CODE${codeSpans.length - 1}\x00`;
  });
  // Bold
  line = line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic
  line = line.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  // Links
  line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Restore code spans
  line = line.replace(/\x00CODE(\d+)\x00/g, (_, i) => codeSpans[Number(i)] ?? "");
  return line;
}

export function markdownToHtml(md: string): string {
  if (!md) return "";
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  let listKind: "ul" | "ol" | null = null;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const closeList = () => {
    if (listKind) {
      out.push(`</${listKind}>`);
      listKind = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        out.push(`<pre><code>${escapeHtml(codeBlockLines.join("\n"))}</code></pre>`);
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        closeList();
        inCodeBlock = true;
      }
      i++;
      continue;
    }
    if (inCodeBlock) {
      codeBlockLines.push(line);
      i++;
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      const text = inlineMarkdown(h[2]);
      out.push(`<h${level}>${text}</h${level}>`);
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*+]\s+/)) {
      if (listKind !== "ul") {
        closeList();
        out.push("<ul>");
        listKind = "ul";
      }
      out.push(`<li>${inlineMarkdown(line.replace(/^[-*+]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      if (listKind !== "ol") {
        closeList();
        out.push("<ol>");
        listKind = "ol";
      }
      out.push(`<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      closeList();
      out.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      closeList();
      i++;
      continue;
    }

    // Paragraph — accumulate consecutive non-empty non-special lines
    closeList();
    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```)/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    out.push(`<p>${inlineMarkdown(paraLines.join(" "))}</p>`);
  }

  closeList();
  if (inCodeBlock) {
    out.push(`<pre><code>${escapeHtml(codeBlockLines.join("\n"))}</code></pre>`);
  }

  return out.join("\n");
}

// ---- Block-tree → HTML (Skulptor-compatible) ------------------------------

function renderBlockNode(block: BlockTreeBlock): string {
  if (!block || typeof block !== "object") return "";
  const type = block.type ?? "paragraph";
  // Extract inline text content
  let inner = "";
  if (typeof block.content === "string") {
    inner = escapeHtml(block.content);
  } else if (Array.isArray(block.content)) {
    inner = block.content
      .map(node => {
        if (typeof node === "string") return escapeHtml(node);
        if (node && typeof node === "object" && typeof node.text === "string") {
          return escapeHtml(node.text);
        }
        return "";
      })
      .join("");
  }
  switch (type) {
    case "heading_1":
    case "heading-1":
    case "h1":
      return `<h1>${inner}</h1>`;
    case "heading_2":
    case "heading-2":
    case "h2":
      return `<h2>${inner}</h2>`;
    case "heading_3":
    case "heading-3":
    case "h3":
      return `<h3>${inner}</h3>`;
    case "paragraph":
    default:
      return `<p>${inner}</p>`;
  }
}

// ---- Public: normalize any CmsBody to safe HTML ---------------------------

export function richTextToHtml(body: CmsBody): string {
  if (!body) return "";
  if (typeof body === "string") {
    // Could be raw HTML or markdown. Heuristic: if it contains < and > tags, treat as HTML.
    // Else markdownify.
    if (/<\w+[\s>]/.test(body)) return body;
    return markdownToHtml(body);
  }
  if (typeof body === "object") {
    // Tagged format
    if ("format" in body && "content" in body) {
      if (body.format === "html") return String((body as HtmlBody).content);
      if (body.format === "markdown") return markdownToHtml(String((body as MarkdownBody).content));
    }
    // Block tree
    if ("blocks" in body && Array.isArray((body as BlockTree).blocks)) {
      return (body as BlockTree).blocks!.map(renderBlockNode).join("\n");
    }
  }
  return "";
}

// ---- Public: normalize to markdown (for .md mirror routes) ----------------

export function richTextToMarkdown(body: CmsBody): string {
  if (!body) return "";
  if (typeof body === "string") {
    // Raw string — if it looks like HTML, do a primitive strip; else passthrough
    if (/<\w+[\s>]/.test(body)) return htmlToPlainMarkdown(body);
    return body;
  }
  if (typeof body === "object") {
    if ("format" in body && "content" in body) {
      if (body.format === "markdown") return String((body as MarkdownBody).content);
      if (body.format === "html") return htmlToPlainMarkdown(String((body as HtmlBody).content));
    }
    if ("blocks" in body && Array.isArray((body as BlockTree).blocks)) {
      return (body as BlockTree).blocks!.map(blockToMarkdown).join("\n\n");
    }
  }
  return "";
}

function blockToMarkdown(block: BlockTreeBlock): string {
  const type = block.type ?? "paragraph";
  let inner = "";
  if (typeof block.content === "string") {
    inner = block.content;
  } else if (Array.isArray(block.content)) {
    inner = block.content
      .map(node => (typeof node === "string" ? node : node?.text ?? ""))
      .join("");
  }
  switch (type) {
    case "heading_1":
    case "h1":
      return `# ${inner}`;
    case "heading_2":
    case "h2":
      return `## ${inner}`;
    case "heading_3":
    case "h3":
      return `### ${inner}`;
    default:
      return inner;
  }
}

function htmlToPlainMarkdown(html: string): string {
  // Minimal HTML → markdown conversion for .md mirror routes. Not exhaustive;
  // upgrades to use turndown if we ever need lossless conversion.
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<\/(?:ul|ol)>/gi, "\n")
    .replace(/<[^>]+>/g, "") // strip remaining tags
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
