import type { Metadata } from "next";
import { getCaseStudies, getCaseStudyFilters } from "@/app/lib/data/case-studies";
import CaseStudiesView from "./components/CaseStudiesView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Case Studies | Rule27 Design - Transformational Case Studies",
  description:
    "Explore success stories with 500%+ growth. See how we transform brands through strategic creativity and technical excellence.",
  keywords:
    "case studies, portfolio, digital transformation, brand strategy, web development, marketing results, client success stories, 500% growth",
  openGraph: {
    title: "Our Case Studies | Rule27 Design - Transformational Case Studies",
    description:
      "Explore success stories with 500%+ growth. See how we transform brands through strategic creativity and technical excellence.",
    type: "website",
  },
  alternates: {
    canonical: "/case-studies",
  },
};

export default async function CaseStudiesPage() {
  const [caseStudies, filters] = await Promise.all([
    getCaseStudies(),
    getCaseStudyFilters(),
  ]);

  return <CaseStudiesView caseStudies={caseStudies} filters={filters} />;
}
