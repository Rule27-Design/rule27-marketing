/**
 * Schema.org JSON-LD generator.
 *
 * Branches on `item.template_type` to produce the right schema type. Manual
 * override via `item.fields.schema_markup` takes precedence — useful for
 * pages that need custom structured data (HowTo, ItemList variants, etc.)
 * the seeding LLM doesn't know how to emit.
 *
 * Output is injected by the catch-all route as <script type="application/ld+json">.
 */
import type { CmsItem } from "./cms";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rule27design.com";
const ORG_NAME = "Rule27 Design";
const ORG_LOGO = `${SITE_URL}/images/rule27-logo.png`;

interface SchemaObject {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

// ---- Common building blocks -----------------------------------------------

function pageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : "/" + path}`;
}

function organizationRef(): { "@type": "Organization"; name: string; url: string; logo: string } {
  return {
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: ORG_LOGO,
  };
}

function breadcrumbList(path: string): SchemaObject {
  // Build a BreadcrumbList from URL segments.
  const segments = path.split("/").filter(Boolean);
  const itemList = [
    { name: "Home", item: SITE_URL },
    ...segments.map((seg, i) => ({
      name: titleCase(seg),
      item: pageUrl("/" + segments.slice(0, i + 1).join("/")),
    })),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemList.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function faqPage(faq: unknown): SchemaObject | null {
  // Accepts either an array of {q, a} or an object with .questions[]
  let questions: Array<{ q?: string; a?: string; question?: string; answer?: string }> = [];
  if (Array.isArray(faq)) questions = faq as typeof questions;
  else if (faq && typeof faq === "object" && "questions" in faq && Array.isArray((faq as { questions: unknown }).questions)) {
    questions = (faq as { questions: Array<{ q?: string; a?: string; question?: string; answer?: string }> }).questions;
  }
  if (!questions.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(q => ({
      "@type": "Question",
      name: q.question ?? q.q ?? "",
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer ?? q.a ?? "",
      },
    })),
  };
}

// ---- Per-template schema builders ------------------------------------------

function serviceLocationSchema(item: CmsItem, path: string): SchemaObject[] {
  const sections = (item.sections as Record<string, unknown>) ?? {};
  const local = (sections.local_context as Record<string, unknown> | undefined) ?? {};
  const out: SchemaObject[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: item.title,
      description: item.meta_description ?? item.excerpt ?? "",
      url: pageUrl(path),
      provider: organizationRef(),
      areaServed: (local.city as string) || (local.region as string) || (item.target_location as string) || undefined,
    },
  ];

  if (local.city || local.address) {
    out.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `${ORG_NAME} — ${local.city ?? local.region ?? "Local"}`,
      url: pageUrl(path),
      address: local.address
        ? {
            "@type": "PostalAddress",
            ...(local.address as Record<string, unknown>),
          }
        : undefined,
      areaServed: local.city ?? local.region,
    });
  }

  return out;
}

function industrySchema(item: CmsItem, path: string): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: item.cluster_topic ?? "Industry SEO",
    name: item.title,
    description: item.meta_description ?? item.excerpt ?? "",
    url: pageUrl(path),
    provider: organizationRef(),
    audience: {
      "@type": "BusinessAudience",
      audienceType: item.cluster_topic ?? item.keyword_target,
    },
  };
}

function answerSchema(item: CmsItem, path: string): SchemaObject {
  const sections = (item.sections as Record<string, unknown>) ?? {};
  const hero = (sections.hero as Record<string, unknown> | undefined) ?? {};
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: (hero.query as string) ?? item.title,
      text: (hero.headline as string) ?? item.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: (hero.direct_answer as string) ?? item.meta_description ?? item.excerpt ?? "",
        author: organizationRef(),
        url: pageUrl(path),
      },
    },
  };
}

function blogPostSchema(item: CmsItem, path: string): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": item.is_pillar ? "Article" : "BlogPosting",
    headline: item.title,
    description: item.meta_description ?? item.excerpt ?? "",
    url: pageUrl(path),
    datePublished: item.published_at ?? item.created_at,
    dateModified: item.updated_at,
    author: organizationRef(),
    publisher: organizationRef(),
    image: item.featured_image ?? item.og_image ?? undefined,
    keywords: item.keyword_target ?? undefined,
  };
}

function comparisonSchema(item: CmsItem, path: string): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.meta_description ?? item.excerpt ?? "",
    url: pageUrl(path),
    datePublished: item.published_at ?? item.created_at,
    dateModified: item.updated_at,
    author: organizationRef(),
    publisher: organizationRef(),
    about: {
      "@type": "Thing",
      name: item.cluster_topic ?? "Comparison",
    },
  };
}

function toolSchema(item: CmsItem, path: string): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: item.title,
    description: item.meta_description ?? item.excerpt ?? "",
    url: pageUrl(path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: organizationRef(),
  };
}

function caseStudySchema(item: CmsItem, path: string): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.meta_description ?? item.excerpt ?? "",
    url: pageUrl(path),
    datePublished: item.published_at ?? item.created_at,
    dateModified: item.updated_at,
    author: organizationRef(),
    publisher: organizationRef(),
    about: {
      "@type": "Service",
      name: item.cluster_topic ?? "Case Study",
    },
  };
}

function faqTopicSchema(item: CmsItem, _path: string): SchemaObject | null {
  const sections = (item.sections as Record<string, unknown>) ?? {};
  return faqPage(sections.questions);
}

function defaultPageSchema(item: CmsItem, path: string): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: item.title,
    description: item.meta_description ?? item.excerpt ?? "",
    url: pageUrl(path),
    inLanguage: "en-US",
    publisher: organizationRef(),
  };
}

// ---- Main entrypoint -------------------------------------------------------

export function buildSchema(item: CmsItem, path: string): SchemaObject[] {
  // 1. Manual override wins
  if (item.schema_markup) {
    if (Array.isArray(item.schema_markup)) {
      return item.schema_markup as SchemaObject[];
    }
    if (typeof item.schema_markup === "object") {
      return [item.schema_markup as SchemaObject];
    }
  }

  // 2. Per-template auto-generation
  const schemas: SchemaObject[] = [];
  switch (item.template_type) {
    case "service-location":
      schemas.push(...serviceLocationSchema(item, path));
      break;
    case "industry":
    case "solution":
    case "technology":
      schemas.push(industrySchema(item, path));
      break;
    case "answer":
      schemas.push(answerSchema(item, path));
      break;
    case "blog-post":
      schemas.push(blogPostSchema(item, path));
      break;
    case "comparison":
      schemas.push(comparisonSchema(item, path));
      break;
    case "tool":
      schemas.push(toolSchema(item, path));
      break;
    case "case-study":
      schemas.push(caseStudySchema(item, path));
      break;
    case "faq-topic": {
      const faq = faqTopicSchema(item, path);
      if (faq) schemas.push(faq);
      break;
    }
    case "scenario":
    case "location":
    default:
      schemas.push(defaultPageSchema(item, path));
      break;
  }

  // 3. Always include BreadcrumbList
  schemas.push(breadcrumbList(path));

  // 4. If item has FAQ section, add FAQPage schema (in addition to the primary type)
  const sections = (item.sections as Record<string, unknown>) ?? {};
  if (sections.faq && item.template_type !== "faq-topic") {
    const faq = faqPage(sections.faq);
    if (faq) schemas.push(faq);
  }

  return schemas;
}

/**
 * Renders an array of JSON-LD schema objects as a single <script> tag string
 * for use in Next.js Head / metadata blocks.
 */
export function schemaJsonLd(item: CmsItem, path: string): string {
  const schemas = buildSchema(item, path);
  return schemas.map(s => JSON.stringify(s)).join("\n");
}
