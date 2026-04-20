import type { Metadata } from "next";
import { getArticles, getArticleFilters } from "@/app/lib/data/articles";
import ArticlesView from "./components/ArticlesView";

// Render on each request - article list is too large to pre-render
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles & Insights",
  description:
    "Expert insights on design, development, and digital marketing. Learn from Rule27 Design's team about the latest trends, strategies, and techniques driving digital success.",
  keywords:
    "design articles, development tutorials, marketing insights, digital strategy, UX design, brand strategy, web development",
  openGraph: {
    title: "Articles & Insights | Rule27 Design",
    description:
      "Expert insights and thought leadership from Rule27 Design's team of digital innovators.",
    type: "website",
  },
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const [articles, filters] = await Promise.all([
    getArticles(),
    getArticleFilters(),
  ]);

  return <ArticlesView articles={articles} filters={filters} />;
}
