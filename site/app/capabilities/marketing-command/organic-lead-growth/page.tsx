import type { Metadata } from "next";
import { getService } from "@/app/lib/data/services";
import { getArticles } from "@/app/lib/data/articles";
import { Experience } from "./Experience";
import type { OLGSupabaseProps } from "./Experience";

const TITLE = "Organic Lead Growth - Exposing Industry Secrets | Rule27 Design";
const DESCRIPTION =
  "See where your business stands against your top local competitors. We pull the numbers, run the gap analysis, and show you what's actually working in your industry - in under 60 minutes.";
const URL =
  "https://www.rule27design.com/capabilities/marketing-command/organic-lead-growth";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: URL,
  },
};

export default async function OrganicLeadGrowthPage() {
  // Partial templating — base + conversional page stays intentional,
  // but we pull real linked resources (lead magnet URL, case studies,
  // articles) from Supabase when available. Falls back gracefully.
  let supabaseData: OLGSupabaseProps = {};

  try {
    const [serviceRes, articlesRes] = await Promise.allSettled([
      getService("organic-lead-growth"),
      getArticles(),
    ]);

    if (serviceRes.status === "fulfilled" && serviceRes.value.service) {
      const { service, relatedCaseStudies } = serviceRes.value;
      supabaseData.leadMagnetUrl = service.leadMagnetUrl ?? undefined;
      supabaseData.leadMagnetTitle = service.leadMagnetTitle ?? undefined;
      supabaseData.showcaseImages = service.showcaseImages ?? undefined;
      supabaseData.relatedCaseStudies = relatedCaseStudies ?? undefined;
    }
    if (articlesRes.status === "fulfilled") {
      supabaseData.recentArticles = articlesRes.value.slice(0, 6);
    }
  } catch {
    // Stay silent; Experience already has static fallbacks
  }

  return <Experience supabase={supabaseData} />;
}
