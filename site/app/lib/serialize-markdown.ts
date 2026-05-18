/**
 * Serialize a CMS item to plain markdown.
 *
 * Used by:
 *   - /[...slug].md catch-all (per-page .md mirror per llmstxt.org convention)
 *   - /llms-full.txt route (concatenated priority pages)
 *   - Diff tooling, debugging, content audits
 *
 * The seeding pipeline writes most body content as markdown already, so this
 * is mostly a structured wrap around the raw content + sections + FAQ.
 */
import type { CmsItem } from "./cms";
import { richTextToMarkdown } from "./rich-text";

interface SectionRenderer {
  (sections: Record<string, unknown>, item: CmsItem): string;
}

const RENDERERS: Record<string, SectionRenderer> = {
  "service-location": serviceLocation,
  industry: industry,
  solution: solution,
  technology: technology,
  location: location,
  "case-study": caseStudy,
  "faq-topic": faqTopic,
  answer: answer,
  "blog-post": blogPost,
  comparison: comparison,
  tool: tool,
  scenario: scenario,
};

export function serializePageToMarkdown(item: CmsItem, urlPath: string): string {
  const sections = (item.sections as Record<string, unknown>) ?? {};
  const renderer = RENDERERS[item.template_type ?? "blog-post"] ?? defaultRenderer;

  const frontMatter = [
    "---",
    `title: ${escape(item.title)}`,
    item.meta_title ? `meta_title: ${escape(item.meta_title)}` : null,
    item.meta_description ? `meta_description: ${escape(item.meta_description)}` : null,
    `url: ${urlPath}`,
    item.published_at ? `published_at: ${item.published_at}` : null,
    `updated_at: ${item.updated_at}`,
    item.template_type ? `template_type: ${item.template_type}` : null,
    item.keyword_target ? `keyword: ${escape(item.keyword_target)}` : null,
    "---",
    "",
    `# ${item.title}`,
    "",
  ].filter(Boolean).join("\n");

  return frontMatter + renderer(sections, item);
}

function escape(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

function bodyMd(item: CmsItem): string {
  const html = richTextToMarkdown(item.body as never);
  return html ? `\n${html}\n` : "";
}

// ---- Per-template renderers ------------------------------------------------

function renderHero(hero: unknown): string {
  if (!hero || typeof hero !== "object") return "";
  const h = hero as Record<string, unknown>;
  const headline = h.headline ?? h.title ?? "";
  const sub = h.subheadline ?? h.description ?? "";
  let out = "";
  if (headline) out += `\n${headline}\n`;
  if (sub) out += `\n${sub}\n`;
  return out;
}

function renderFaq(faq: unknown): string {
  if (!faq) return "";
  let questions: Array<{ q?: string; a?: string; question?: string; answer?: string }> = [];
  if (Array.isArray(faq)) questions = faq;
  else if (typeof faq === "object" && "questions" in faq && Array.isArray((faq as { questions: unknown }).questions)) {
    questions = (faq as { questions: typeof questions }).questions;
  }
  if (!questions.length) return "";
  let out = "\n## Frequently Asked Questions\n";
  for (const q of questions) {
    out += `\n### ${q.question ?? q.q ?? ""}\n\n${q.answer ?? q.a ?? ""}\n`;
  }
  return out;
}

function renderSectionList(label: string, value: unknown, kind: "items" | "paragraphs" = "items"): string {
  if (!value) return "";
  let out = `\n## ${label}\n`;
  if (Array.isArray(value)) {
    if (kind === "items") {
      for (const item of value) {
        if (typeof item === "string") out += `- ${item}\n`;
        else if (item && typeof item === "object") {
          const o = item as Record<string, unknown>;
          const title = o.title ?? o.heading ?? o.name ?? "";
          const desc = o.description ?? o.body ?? o.text ?? "";
          if (title) out += `\n### ${title}\n`;
          if (desc) out += `\n${desc}\n`;
        }
      }
    } else {
      out += value.join("\n\n") + "\n";
    }
  } else if (typeof value === "string") {
    out += `${value}\n`;
  } else if (typeof value === "object") {
    out += JSON.stringify(value, null, 2) + "\n";
  }
  return out;
}

function serviceLocation(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.overview ? `\n## Overview\n\n${sections.overview}\n` : "",
    renderSectionList("Features", sections.features),
    renderSectionList("Benefits", sections.benefits),
    sections.local_context ? `\n## Local Context\n\n${JSON.stringify(sections.local_context, null, 2)}\n` : "",
    renderSectionList("Our Process", sections.process),
    renderSectionList("Why Us", sections.why_us),
    renderFaq(sections.faq),
    renderSectionList("Related Services", sections.related_services),
    bodyMd(item),
  ].join("");
}

function industry(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    renderSectionList("Challenges", sections.challenges),
    renderSectionList("Solutions", sections.solutions),
    renderSectionList("Technologies", sections.technologies),
    sections.overview ? `\n## Overview\n\n${sections.overview}\n` : "",
    renderFaq(sections.faq),
    bodyMd(item),
  ].join("");
}

function solution(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.problem ? `\n## The Problem\n\n${sections.problem}\n` : "",
    sections.solution ? `\n## The Solution\n\n${sections.solution}\n` : "",
    renderSectionList("Our Process", sections.process),
    renderSectionList("Results", sections.results),
    renderFaq(sections.faq),
    bodyMd(item),
  ].join("");
}

function technology(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.overview ? `\n## Overview\n\n${sections.overview}\n` : "",
    renderSectionList("Capabilities", sections.capabilities),
    renderSectionList("Use Cases", sections.use_cases),
    renderFaq(sections.faq),
    bodyMd(item),
  ].join("");
}

function location(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.overview ? `\n## Overview\n\n${sections.overview}\n` : "",
    renderSectionList("Services Available", sections.services_available),
    renderSectionList("Industries Served", sections.industries),
    renderFaq(sections.faq),
    bodyMd(item),
  ].join("");
}

function caseStudy(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.client_background ? `\n## Client Background\n\n${sections.client_background}\n` : "",
    sections.challenge ? `\n## The Challenge\n\n${sections.challenge}\n` : "",
    sections.methodology ? `\n## Methodology\n\n${sections.methodology}\n` : "",
    sections.solution ? `\n## The Solution\n\n${sections.solution}\n` : "",
    sections.results ? `\n## The Results\n\n${sections.results}\n` : "",
    sections.lessons_learned ? `\n## Lessons Learned\n\n${sections.lessons_learned}\n` : "",
    bodyMd(item),
  ].join("");
}

function faqTopic(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.overview ? `\n## Overview\n\n${sections.overview}\n` : "",
    renderFaq(sections.questions),
    bodyMd(item),
  ].join("");
}

function answer(sections: Record<string, unknown>, item: CmsItem): string {
  const hero = (sections.hero as Record<string, unknown> | undefined) ?? {};
  let out = "";
  if (hero.query) out += `\n**Question**: ${hero.query}\n`;
  if (hero.headline) out += `\n## ${hero.headline}\n`;
  if (hero.direct_answer) out += `\n${hero.direct_answer}\n`;
  out += bodyMd(item);
  if (sections.key_takeaways) out += renderSectionList("Key Takeaways", sections.key_takeaways);
  if (sections.related_questions) out += renderSectionList("Related Questions", sections.related_questions);
  if (sections.references) out += renderSectionList("References", sections.references);
  return out;
}

function blogPost(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    bodyMd(item),
    renderSectionList("Key Takeaways", sections.key_takeaways),
    renderFaq(sections.faq),
    renderSectionList("Related Posts", sections.related_posts),
  ].join("");
}

function comparison(sections: Record<string, unknown>, item: CmsItem): string {
  let out = renderHero(sections.hero);
  if (sections.overview) out += `\n## Overview\n\n${sections.overview}\n`;
  if (sections.comparison_table) {
    out += "\n## Comparison\n\n";
    if (Array.isArray(sections.comparison_table)) {
      for (const row of sections.comparison_table as Array<Record<string, unknown>>) {
        out += `\n### ${row.feature ?? row.name ?? ""}\n\n`;
        out += `- Us: ${row.us ?? ""}\n`;
        out += `- Them: ${row.them ?? ""}\n`;
      }
    }
  }
  if (sections.detailed_analysis) out += `\n## Detailed Analysis\n\n${sections.detailed_analysis}\n`;
  out += renderFaq(sections.faq);
  out += bodyMd(item);
  return out;
}

function tool(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.what_it_checks ? `\n## What This Tool Checks\n\n${sections.what_it_checks}\n` : "",
    sections.how_to_interpret ? `\n## How to Interpret Results\n\n${sections.how_to_interpret}\n` : "",
    renderFaq(sections.faq),
    renderSectionList("Related Tools", sections.related_tools),
    bodyMd(item),
  ].join("");
}

function scenario(sections: Record<string, unknown>, item: CmsItem): string {
  return [
    renderHero(sections.hero),
    sections.diagnosis ? `\n## Diagnosis\n\n${sections.diagnosis}\n` : "",
    sections.solution_path ? `\n## Solution Path\n\n${sections.solution_path}\n` : "",
    sections.real_example ? `\n## Real Example\n\n${sections.real_example}\n` : "",
    bodyMd(item),
    renderSectionList("Related Scenarios", sections.related_scenarios),
  ].join("");
}

function defaultRenderer(sections: Record<string, unknown>, item: CmsItem): string {
  const out = [renderHero(sections.hero), bodyMd(item)];
  for (const [key, value] of Object.entries(sections)) {
    if (key === "hero") continue;
    out.push(renderSectionList(titleCase(key), value));
  }
  return out.join("");
}

function titleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
