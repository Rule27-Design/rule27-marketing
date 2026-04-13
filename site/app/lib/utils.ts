import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---------------------------------------------------------------------------
// cn — Tailwind-aware class-name merger (clsx + tailwind-merge)
// ---------------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// formatDate — human-readable date string
// ---------------------------------------------------------------------------

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Format a date string into a human-readable form.
 *
 * Supported format tokens: YYYY, YY, MMMM, MMM, MM, M, DD, D, HH, H, mm, m, ss, s
 *
 * @default format "MMM DD, YYYY"
 */
export function formatDate(
  date: string | Date,
  format: string = "MMM DD, YYYY",
): string {
  if (!date) return "N/A";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";

    const replacements: Record<string, string | number> = {
      YYYY: d.getFullYear(),
      YY: String(d.getFullYear()).slice(-2),
      MMMM: MONTHS_FULL[d.getMonth()],
      MMM: MONTHS_SHORT[d.getMonth()],
      MM: String(d.getMonth() + 1).padStart(2, "0"),
      M: d.getMonth() + 1,
      DD: String(d.getDate()).padStart(2, "0"),
      D: d.getDate(),
      HH: String(d.getHours()).padStart(2, "0"),
      H: d.getHours(),
      mm: String(d.getMinutes()).padStart(2, "0"),
      m: d.getMinutes(),
      ss: String(d.getSeconds()).padStart(2, "0"),
      s: d.getSeconds(),
    };

    let formatted = format;
    // Replace longest tokens first to avoid partial matches (e.g. MMMM before MMM).
    for (const [key, value] of Object.entries(replacements)) {
      formatted = formatted.replace(new RegExp(key, "g"), String(value));
    }
    return formatted;
  } catch {
    return "N/A";
  }
}

// ---------------------------------------------------------------------------
// generateSlug — URL-friendly slug from any text
// ---------------------------------------------------------------------------

export function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9\s-]/g, "") // remove non-alphanum
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-") // collapse duplicates
    .replace(/^-+|-+$/g, "") // trim leading/trailing
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Rich-text helpers (ported from useArticles.js)
// ---------------------------------------------------------------------------

interface RichTextResult {
  html: string | null;
  text: string;
}

/**
 * Recursively extract plain text from TipTap/ProseMirror JSON `content` arrays.
 */
function extractFromJsonContent(
  content: Record<string, unknown>[],
): string {
  if (!Array.isArray(content)) return "";

  return content
    .map((block) => {
      if (
        block.type === "paragraph" &&
        Array.isArray(block.content)
      ) {
        return (block.content as Record<string, unknown>[])
          .map((item) => (item.text as string) || "")
          .join(" ");
      }
      if (
        block.type === "bulletList" &&
        Array.isArray(block.content)
      ) {
        return (block.content as Record<string, unknown>[])
          .map((item) =>
            extractFromJsonContent(
              (item.content as Record<string, unknown>[]) || [],
            ),
          )
          .join(" ");
      }
      if (
        block.type === "listItem" &&
        Array.isArray(block.content)
      ) {
        return extractFromJsonContent(
          block.content as Record<string, unknown>[],
        );
      }
      return (block.text as string) || "";
    })
    .filter((t) => t.trim())
    .join("\n\n");
}

/**
 * Extract plain text (and optional HTML) from various rich-text formats stored
 * in Supabase: raw HTML string, TipTap JSON doc, or an object with `html`/`json`
 * properties.  Mirrors the logic in the original `useArticles.js` hook.
 */
export function extractTextFromRichText(
  richText: unknown,
): RichTextResult {
  if (!richText) return { html: null, text: "" };

  // --- string input --------------------------------------------------------
  if (typeof richText === "string") {
    try {
      const parsed = JSON.parse(richText);

      if (parsed.html) {
        return {
          html: parsed.html,
          text:
            parsed.text || (parsed.html as string).replace(/<[^>]*>/g, ""),
        };
      }

      if (parsed.text) {
        return { html: null, text: parsed.text };
      }

      if (parsed.type === "doc" && Array.isArray(parsed.content)) {
        return { html: null, text: extractFromJsonContent(parsed.content) };
      }

      if (parsed.json && parsed.json.content) {
        const text = extractFromJsonContent(parsed.json.content);
        return { html: parsed.html || null, text };
      }

      return { html: null, text: richText };
    } catch {
      // Not valid JSON — treat as plain text.
      return { html: null, text: richText };
    }
  }

  // --- object input --------------------------------------------------------
  const obj = richText as Record<string, unknown>;

  if (obj.html) {
    return {
      html: obj.html as string,
      text:
        (obj.text as string) ||
        (obj.html as string).replace(/<[^>]*>/g, ""),
    };
  }

  if (obj.type === "doc" && Array.isArray(obj.content)) {
    return {
      html: null,
      text: extractFromJsonContent(
        obj.content as Record<string, unknown>[],
      ),
    };
  }

  return { html: null, text: JSON.stringify(richText) };
}

/**
 * Convenience wrapper that returns only the plain-text string.
 */
export function extractPlainText(richText: unknown): string {
  const result = extractTextFromRichText(richText);
  return typeof result === "string" ? result : result.text;
}

// ---------------------------------------------------------------------------
// calculateReadTime — estimated minutes to read a block of text
// ---------------------------------------------------------------------------

export function calculateReadTime(
  text: string,
  wordsPerMinute: number = 200,
): number {
  if (!text) return 1;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
