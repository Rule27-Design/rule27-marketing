import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.rule27design.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/capabilities`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/innovation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return staticPages;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [articlesRes, caseStudiesRes, teamRes] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, updated_at, published_at")
      .eq("status", "published"),
    supabase
      .from("case_studies")
      .select("slug, updated_at, published_at")
      .eq("status", "published"),
    supabase
      .from("profiles")
      .select("slug, updated_at")
      .eq("is_active", true)
      .eq("is_public", true),
  ]);

  const articlePages: MetadataRoute.Sitemap = (articlesRes.data ?? []).map(
    (a) => ({
      url: `${BASE_URL}/articles/${a.slug}`,
      lastModified: new Date(a.updated_at || a.published_at),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const caseStudyPages: MetadataRoute.Sitemap = (
    caseStudiesRes.data ?? []
  ).map((cs) => ({
    url: `${BASE_URL}/case-studies/${cs.slug}`,
    lastModified: new Date(cs.updated_at || cs.published_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const teamPages: MetadataRoute.Sitemap = (teamRes.data ?? []).map((t) => ({
    url: `${BASE_URL}/team/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...articlePages, ...caseStudyPages, ...teamPages];
}
