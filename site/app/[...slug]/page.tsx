import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  getCmsItemBySlug,
  getAllSlugsForCollection,
  getRelatedItems,
  routeToCollection,
  COLLECTION_TO_URL_PREFIX,
  type CmsItem,
} from "../lib/cms";
import { schemaJsonLd } from "../lib/schema";
import { Breadcrumbs, buildCrumbsFromPath } from "../components/cms/Breadcrumbs";

import { ServiceLocationTemplate } from "../components/templates/ServiceLocationTemplate";
import { IndustryTemplate } from "../components/templates/IndustryTemplate";
import { SolutionTemplate } from "../components/templates/SolutionTemplate";
import { TechnologyTemplate } from "../components/templates/TechnologyTemplate";
import { LocationTemplate } from "../components/templates/LocationTemplate";
import { CaseStudyTemplate } from "../components/templates/CaseStudyTemplate";
import { FaqTopicTemplate } from "../components/templates/FaqTopicTemplate";
import { AnswerTemplate } from "../components/templates/AnswerTemplate";
import { BlogPostTemplate } from "../components/templates/BlogPostTemplate";
import { ComparisonTemplate } from "../components/templates/ComparisonTemplate";
import { ToolTemplate } from "../components/templates/ToolTemplate";
import { ScenarioTemplate } from "../components/templates/ScenarioTemplate";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rule27design.com";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function resolveItem(slugSegments: string[]): Promise<{ item: CmsItem; collectionSlug: string } | null> {
  const route = routeToCollection(slugSegments);
  if (!route) return null;
  const item = await getCmsItemBySlug(route.collectionSlug, route.itemSlug);
  if (!item) return null;
  return { item, collectionSlug: route.collectionSlug };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveItem(slug);
  if (!resolved) return { title: "Not Found" };

  const { item } = resolved;
  const path = "/" + slug.join("/");
  const url = `${SITE_URL}${path}`;
  const title = item.meta_title ?? item.title;
  const description = item.meta_description ?? item.excerpt ?? undefined;
  const ogImage = item.og_image ?? item.featured_image ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: item.canonical_url ?? url,
    },
    openGraph: {
      title: item.og_title ?? title,
      description: item.og_description ?? description,
      url,
      type: (item.og_type as "article" | "website") ?? "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
      publishedTime: item.published_at ?? undefined,
      modifiedTime: item.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: item.og_title ?? title,
      description: item.og_description ?? description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export async function generateStaticParams(): Promise<Array<{ slug: string[] }>> {
  const collections = Object.keys(COLLECTION_TO_URL_PREFIX);
  const results: Array<{ slug: string[] }> = [];

  await Promise.all(
    collections.map(async collectionSlug => {
      const prefix = COLLECTION_TO_URL_PREFIX[collectionSlug];
      if (!prefix) return;
      const prefixSegments = prefix.replace(/^\//, "").split("/").filter(Boolean);
      const slugs = await getAllSlugsForCollection(collectionSlug);
      for (const { slug } of slugs) {
        results.push({ slug: [...prefixSegments, ...slug.split("/")] });
      }
    }),
  );

  return results;
}

function renderTemplate(item: CmsItem, relatedItems: CmsItem[]) {
  switch (item.template_type) {
    case "service-location":
      return <ServiceLocationTemplate item={item} relatedItems={relatedItems} />;
    case "industry":
      return <IndustryTemplate item={item} relatedItems={relatedItems} />;
    case "solution":
      return <SolutionTemplate item={item} relatedItems={relatedItems} />;
    case "technology":
      return <TechnologyTemplate item={item} relatedItems={relatedItems} />;
    case "location":
      return <LocationTemplate item={item} />;
    case "case-study":
      return <CaseStudyTemplate item={item} relatedItems={relatedItems} />;
    case "faq-topic":
      return <FaqTopicTemplate item={item} />;
    case "answer":
      return <AnswerTemplate item={item} />;
    case "blog-post":
      return <BlogPostTemplate item={item} relatedItems={relatedItems} />;
    case "comparison":
      return <ComparisonTemplate item={item} />;
    case "tool":
      return <ToolTemplate item={item} />;
    case "scenario":
      return <ScenarioTemplate item={item} />;
    default:
      return <BlogPostTemplate item={item} relatedItems={relatedItems} />;
  }
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = await resolveItem(slug);
  if (!resolved) notFound();

  const { item, collectionSlug } = resolved;
  const path = "/" + slug.join("/");
  const crumbs = buildCrumbsFromPath(path, item.title);

  const relatedItems = await getRelatedItems(collectionSlug, {
    excludeSlug: item.slug,
    parent_slug: item.parent_slug ?? undefined,
    cluster_topic: item.cluster_topic ?? undefined,
    limit: 3,
  });

  const jsonLd = schemaJsonLd(item, path);

  return (
    <>
      <Script
        id={`schema-${item.id}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Breadcrumbs crumbs={crumbs} />
      {renderTemplate(item, relatedItems)}
    </>
  );
}
