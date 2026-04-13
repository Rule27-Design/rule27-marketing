import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticle, getArticles } from "@/app/lib/data/articles";
import { formatDate } from "@/app/lib/utils";
import ArticleDetail from "./components/ArticleDetail";

// ---------------------------------------------------------------------------
// Dynamic SEO metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: `${article.metaTitle || article.title} | Rule27 Design`,
      description: article.metaDescription || article.excerpt,
      images: [
        {
          url: article.ogImage || article.featuredImage,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    alternates: { canonical: `/articles/${slug}` },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Fetch related articles (same category or overlapping topics)
  const allArticles = await getArticles();
  const related = allArticles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category === article.category ||
          a.topics.some((t) => article.topics.includes(t)))
    )
    .slice(0, 3);

  const hasCoAuthors = article.coAuthors && article.coAuthors.length > 0;

  return (
    <div className="min-h-screen" style={{ background: "#FCFCFB" }}>
      {/* Hero Section (Server-rendered for SEO) */}
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt || article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3))",
          }}
        />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="px-3 py-1 text-sm rounded-full backdrop-blur-sm"
                style={{
                  background: "rgba(229,62,62,0.8)",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {article.category}
              </span>
              <div
                className="flex items-center space-x-4 text-sm"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <span className="flex items-center gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {article.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span
                    style={{
                      fontFamily:
                        "var(--font-steelfish), Impact, sans-serif",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {article.views?.toLocaleString()}
                  </span>{" "}
                  views
                </span>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl mb-4"
              style={{
                fontFamily: "var(--font-steelfish), Impact, sans-serif",
                color: "#FFFFFF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {article.title}
            </h1>

            {/* Excerpt */}
            <p
              className="text-base sm:text-lg mb-6 leading-relaxed max-w-3xl line-clamp-3"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}
            >
              {article.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center space-x-4">
              <Link
                href={
                  article.author.slug
                    ? `/team/${article.author.slug}`
                    : "#"
                }
                className="relative w-12 h-12 rounded-full overflow-hidden transition-all"
                style={{ border: "2px solid rgba(255,255,255,0.2)" }}
              >
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </Link>
              <div>
                <div className="flex items-center flex-wrap gap-1">
                  <Link
                    href={
                      article.author.slug
                        ? `/team/${article.author.slug}`
                        : "#"
                    }
                    className="text-sm font-semibold transition-colors"
                    style={{
                      color: "#FFFFFF",
                      fontFamily:
                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  >
                    {article.author.name}
                  </Link>
                  {hasCoAuthors && (
                    <span
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontFamily:
                          "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {" & "}
                      {article.coAuthors.map((ca, i) => (
                        <span key={ca.id}>
                          <Link
                            href={
                              ca.slug ? `/team/${ca.slug}` : "#"
                            }
                            className="transition-colors"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            {ca.name}
                          </Link>
                          {i < article.coAuthors.length - 1 && ", "}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs sm:text-sm"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  {article.author.role} &bull;{" "}
                  {formatDate(article.publishedDate, "MMMM DD, YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client-side interactive detail */}
      <ArticleDetail article={article} relatedArticles={related} />
    </div>
  );
}
