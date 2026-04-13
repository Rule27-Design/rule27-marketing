import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudy, getCaseStudies } from "@/app/lib/data/case-studies";
import CaseStudyDetail from "./components/CaseStudyDetail";

// ---------------------------------------------------------------------------
// Dynamic SEO metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);

  if (!study) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: `${study.title} | Rule27 Design Case Study`,
    description: study.description,
    keywords: `${study.industry}, ${study.serviceType}, case study, ${study.client}`,
    openGraph: {
      title: `${study.title} | Rule27 Design Case Study`,
      description: study.description,
      images: [{ url: study.heroImage, width: 1200, height: 630 }],
      type: "article",
    },
    alternates: {
      canonical: `/case-studies/${slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  // Fetch related studies (same industry or service type, excluding current)
  const allStudies = await getCaseStudies();
  const related = allStudies
    .filter(
      (s) =>
        s.id !== study.id &&
        (s.industry === study.industry || s.serviceType === study.serviceType)
    )
    .slice(0, 3);

  return <CaseStudyDetail study={study} relatedStudies={related} />;
}
