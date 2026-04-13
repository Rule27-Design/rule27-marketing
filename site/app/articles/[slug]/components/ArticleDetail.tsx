"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Article } from "@/app/lib/types";
import { formatDate } from "@/app/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ArticleDetailProps {
  article: Article;
  relatedArticles: Article[];
}

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

function HeartIcon({
  size = 18,
  filled = false,
}: {
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function BookmarkIcon({
  size = 18,
  filled = false,
}: {
  size?: number;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function ShareIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

function UserIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LinkIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function TwitterXIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function ClockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
  );
}

function ArrowLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Article Content Renderer
// ---------------------------------------------------------------------------

function ArticleContentRenderer({
  article,
}: {
  article: Article;
}) {
  // Prose styles for rendered HTML content
  const proseStyles = `
    .article-prose h1 { font-family: var(--font-steelfish), Impact, sans-serif; font-size: 2.25rem; letter-spacing: 0.08em; text-transform: uppercase; color: #111111; margin: 2rem 0 1rem; }
    .article-prose h2 { font-family: var(--font-steelfish), Impact, sans-serif; font-size: 1.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: #111111; margin: 1.75rem 0 0.75rem; }
    .article-prose h3 { font-family: var(--font-steelfish), Impact, sans-serif; font-size: 1.35rem; letter-spacing: 0.08em; text-transform: uppercase; color: #111111; margin: 1.5rem 0 0.5rem; }
    .article-prose h4 { font-family: var(--font-steelfish), Impact, sans-serif; font-size: 1.15rem; letter-spacing: 0.06em; text-transform: uppercase; color: #111111; margin: 1.25rem 0 0.5rem; }
    .article-prose p { margin: 0 0 1.25rem; line-height: 1.8; color: rgba(0,0,0,0.7); }
    .article-prose ul, .article-prose ol { margin: 0 0 1.25rem; padding-left: 1.5rem; color: rgba(0,0,0,0.7); }
    .article-prose li { margin-bottom: 0.5rem; line-height: 1.7; }
    .article-prose blockquote { border-left: 3px solid #E53E3E; padding: 1rem 1.5rem; margin: 1.5rem 0; background: rgba(229,62,62,0.04); color: rgba(0,0,0,0.6); font-style: italic; }
    .article-prose code { background: rgba(0,0,0,0.05); padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.9em; }
    .article-prose pre { background: #1a1a2e; color: #e0e0e0; padding: 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; }
    .article-prose pre code { background: none; padding: 0; color: inherit; }
    .article-prose a { color: #E53E3E; text-decoration: underline; text-underline-offset: 2px; }
    .article-prose a:hover { color: #c53030; }
    .article-prose img { border-radius: 8px; margin: 1.5rem 0; max-width: 100%; height: auto; }
    .article-prose hr { border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 2rem 0; }
    .article-prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; overflow-x: auto; display: block; }
    .article-prose th { padding: 12px 16px; text-align: left; font-family: 'Steelfish', 'Impact', sans-serif; font-size: 12px; letter-spacing: 0.15em; color: #E53E3E; text-transform: uppercase; border-bottom: 2px solid rgba(229,62,62,0.2); background: rgba(229,62,62,0.02); white-space: nowrap; }
    .article-prose td { padding: 12px 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: rgba(0,0,0,0.5); border-bottom: 1px solid rgba(0,0,0,0.04); white-space: nowrap; }
    .article-prose td:first-child { color: #111; }
    .article-prose tr:hover td { background: rgba(229,62,62,0.04); }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: proseStyles }} />
      {article.contentHtml ? (
        <div
          className="article-prose"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "1.0625rem",
            lineHeight: 1.8,
          }}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      ) : article.content ? (
        <div
          className="article-prose whitespace-pre-wrap"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "1.0625rem",
            lineHeight: 1.8,
            color: "rgba(0,0,0,0.7)",
          }}
        >
          {article.content}
        </div>
      ) : (
        <p
          style={{
            color: "rgba(0,0,0,0.4)",
            fontStyle: "italic",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          Full article content coming soon.
        </p>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ArticleDetail({
  article,
  relatedArticles,
}: ArticleDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const hasCoAuthors = article.coAuthors && article.coAuthors.length > 0;

  const handleShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [article.title, article.excerpt]);

  const handleCopyLink = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, []);

  const getShareUrl = useCallback(() => {
    if (typeof window !== "undefined") return window.location.href;
    return "";
  }, []);

  return (
    <>
      {/* Sticky Action Bar */}
      <div
        className="sticky top-[60px] z-40"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Like */}
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{
                  color: isLiked ? "#E53E3E" : "rgba(0,0,0,0.4)",
                  background: isLiked
                    ? "rgba(229,62,62,0.06)"
                    : "transparent",
                }}
              >
                <HeartIcon size={18} filled={isLiked} />
                <span
                  style={{
                    fontFamily: "var(--font-steelfish), Impact, sans-serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  {article.likes + (isLiked ? 1 : 0)}
                </span>
              </button>

              {/* Bookmark */}
              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{
                  color: isBookmarked ? "#E53E3E" : "rgba(0,0,0,0.4)",
                  background: isBookmarked
                    ? "rgba(229,62,62,0.06)"
                    : "transparent",
                }}
              >
                <BookmarkIcon size={18} filled={isBookmarked} />
                <span
                  className="hidden sm:inline"
                  style={{
                    fontFamily: "var(--font-steelfish), Impact, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                  }}
                >
                  Save
                </span>
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{ color: "rgba(0,0,0,0.4)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#E53E3E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(0,0,0,0.4)")
                }
              >
                <ShareIcon size={18} />
                <span
                  className="hidden sm:inline"
                  style={{
                    fontFamily: "var(--font-steelfish), Impact, sans-serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                  }}
                >
                  Share
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1" style={{ color: "rgba(0,0,0,0.35)" }}>
              <ClockIcon size={14} />
              <span
                className="text-sm"
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              >
                {article.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Large Excerpt Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 sm:mb-12"
            style={{
              borderLeft: "3px solid #E53E3E",
              paddingLeft: "1.5rem",
            }}
          >
            <p
              className="text-lg sm:text-xl md:text-2xl leading-relaxed"
              style={{
                color: "rgba(0,0,0,0.55)",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontStyle: "italic",
              }}
            >
              {article.excerpt}
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ArticleContentRenderer article={article} />
          </motion.div>

          {/* Co-Authors Section */}
          {hasCoAuthors && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 p-6 rounded-xl"
              style={{ background: "#F8F9FA" }}
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  color: "#111111",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontSize: "1.125rem",
                }}
              >
                Contributing Author
                {article.coAuthors.length > 1 ? "s" : ""}
              </h3>
              <div className="space-y-4">
                {article.coAuthors.map((coAuthor) => (
                  <div
                    key={coAuthor.id}
                    className="flex items-start space-x-4"
                  >
                    <Link
                      href={
                        coAuthor.slug ? `/team/${coAuthor.slug}` : "#"
                      }
                      className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 transition-all"
                      style={{ border: "2px solid transparent" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = "#E53E3E")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "transparent")
                      }
                    >
                      <Image
                        src={coAuthor.avatar}
                        alt={coAuthor.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={
                          coAuthor.slug ? `/team/${coAuthor.slug}` : "#"
                        }
                        className="font-medium inline-block transition-colors"
                        style={{
                          color: "#111111",
                          fontFamily:
                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#E53E3E")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#111111")
                        }
                      >
                        {coAuthor.name}
                      </Link>
                      <p
                        className="text-sm"
                        style={{
                          color: "rgba(0,0,0,0.5)",
                          fontFamily:
                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        }}
                      >
                        {coAuthor.role}
                      </p>
                      {coAuthor.bio && (
                        <p
                          className="text-sm mt-2"
                          style={{
                            color: "rgba(0,0,0,0.45)",
                            fontFamily:
                              "'Helvetica Neue', Helvetica, Arial, sans-serif",
                          }}
                        >
                          {coAuthor.bio}
                        </p>
                      )}
                      {coAuthor.slug && (
                        <Link
                          href={`/team/${coAuthor.slug}`}
                          className="inline-block mt-2 text-sm transition-colors"
                          style={{
                            color: "#E53E3E",
                            fontFamily:
                              "'Helvetica Neue', Helvetica, Arial, sans-serif",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          View Profile &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Topics Section */}
          {article.topics && article.topics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-12 pt-8"
              style={{ borderTop: "1px solid #E5E7EB" }}
            >
              <h3
                className="text-xs mb-4"
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  color: "rgba(0,0,0,0.4)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.topics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/articles?topic=${encodeURIComponent(topic)}`}
                    className="px-3 py-1.5 text-sm rounded-full transition-colors"
                    style={{
                      background: "#F8F9FA",
                      color: "rgba(0,0,0,0.5)",
                      border: "1px solid #E5E7EB",
                      fontFamily:
                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(229,62,62,0.06)";
                      e.currentTarget.style.color = "#E53E3E";
                      e.currentTarget.style.borderColor =
                        "rgba(229,62,62,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F8F9FA";
                      e.currentTarget.style.color = "rgba(0,0,0,0.5)";
                      e.currentTarget.style.borderColor = "#E5E7EB";
                    }}
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 p-6 rounded-xl"
            style={{ background: "#F8F9FA" }}
          >
            <div className="flex items-start space-x-4">
              <Link
                href={
                  article.author.slug
                    ? `/team/${article.author.slug}`
                    : "#"
                }
                className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 transition-all"
                style={{ border: "2px solid transparent" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#E53E3E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "transparent")
                }
              >
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </Link>
              <div className="flex-1">
                <h3
                  className="mb-1"
                  style={{
                    fontFamily:
                      "var(--font-steelfish), Impact, sans-serif",
                    color: "#111111",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "1rem",
                  }}
                >
                  About the {hasCoAuthors ? "Lead Author" : "Author"}
                </h3>
                <Link
                  href={
                    article.author.slug
                      ? `/team/${article.author.slug}`
                      : "#"
                  }
                  className="font-medium inline-block transition-colors"
                  style={{
                    color: "#111111",
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#E53E3E")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#111111")
                  }
                >
                  {article.author.name}
                </Link>
                <p
                  className="text-sm mb-2"
                  style={{
                    color: "rgba(0,0,0,0.5)",
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  {article.author.role} at Rule27 Design
                </p>
                <p
                  className="text-sm mb-3 leading-relaxed"
                  style={{
                    color: "rgba(0,0,0,0.45)",
                    fontFamily:
                      "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  }}
                >
                  {article.author.bio ||
                    `With expertise in digital design and strategy, ${article.author.name} helps brands discover their authentic voice in the digital landscape.`}
                </p>
                {article.author.slug && (
                  <Link
                    href={`/team/${article.author.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors"
                    style={{
                      border: "1px solid #E53E3E",
                      color: "#E53E3E",
                      background: "transparent",
                      fontFamily:
                        "var(--font-steelfish), Impact, sans-serif",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#E53E3E";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#E53E3E";
                    }}
                  >
                    <UserIcon size={14} />
                    View Profile
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-12 p-6 rounded-xl text-center"
            style={{ background: "rgba(229,62,62,0.04)" }}
          >
            <h3
              className="text-lg mb-4"
              style={{
                fontFamily: "var(--font-steelfish), Impact, sans-serif",
                color: "#111111",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Share This Article
            </h3>
            <div className="flex items-center justify-center gap-3">
              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(getShareUrl())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#E53E3E";
                  e.currentTarget.style.borderColor = "#E53E3E";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(0,0,0,0.4)";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
                aria-label="Share on Twitter/X"
              >
                <TwitterXIcon size={18} />
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#E53E3E";
                  e.currentTarget.style.borderColor = "#E53E3E";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(0,0,0,0.4)";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
                aria-label="Share on LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors relative"
                style={{
                  background: linkCopied ? "rgba(229,62,62,0.06)" : "#FFFFFF",
                  border: `1px solid ${linkCopied ? "#E53E3E" : "#E5E7EB"}`,
                  color: linkCopied ? "#E53E3E" : "rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  if (!linkCopied) {
                    e.currentTarget.style.color = "#E53E3E";
                    e.currentTarget.style.borderColor = "#E53E3E";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!linkCopied) {
                    e.currentTarget.style.color = "rgba(0,0,0,0.4)";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                  }
                }}
                aria-label="Copy link"
              >
                <LinkIcon size={18} />
              </button>
            </div>
            {linkCopied && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-2"
                style={{ color: "#E53E3E" }}
              >
                Link copied to clipboard!
              </motion.p>
            )}
          </motion.div>

          {/* Back to Articles */}
          <div className="mt-10">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm transition-colors"
              style={{
                color: "#E53E3E",
                fontFamily: "var(--font-steelfish), Impact, sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              <ArrowLeftIcon size={16} />
              Back to Articles
            </Link>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12" style={{ background: "#F8F9FA" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className="block w-[40px] h-[2px]"
                style={{ background: "#E53E3E" }}
              />
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-steelfish), Impact, sans-serif",
                  color: "#E53E3E",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Keep Reading
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl mb-8"
              style={{
                fontFamily: "var(--font-steelfish), Impact, sans-serif",
                color: "#111111",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Related Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((ra) => (
                <Link
                  key={ra.id}
                  href={`/articles/${ra.slug}`}
                  className="group rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    background: "#FFFFFF",
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.06), 0 0 6px rgba(229,62,62,0.12)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0,0,0,0.06), 0 0 6px rgba(229,62,62,0.12)";
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={ra.featuredImage}
                      alt={ra.featuredImageAlt || ra.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs"
                        style={{
                          fontFamily:
                            "var(--font-steelfish), Impact, sans-serif",
                          color: "#E53E3E",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {ra.category}
                      </span>
                      <span style={{ color: "rgba(0,0,0,0.2)" }}>&bull;</span>
                      <span
                        className="text-xs"
                        style={{
                          color: "rgba(0,0,0,0.4)",
                          fontFamily:
                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        }}
                      >
                        {ra.readTime} min read
                      </span>
                    </div>
                    <h3
                      className="text-lg mb-2 line-clamp-2 transition-colors duration-300 group-hover:!text-[#E53E3E]"
                      style={{
                        fontFamily:
                          "var(--font-steelfish), Impact, sans-serif",
                        color: "#111111",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {ra.title}
                    </h3>
                    <p
                      className="text-sm line-clamp-2"
                      style={{
                        color: "rgba(0,0,0,0.5)",
                        fontFamily:
                          "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {ra.excerpt}
                    </p>
                    <div
                      className="mt-3 flex items-center gap-2 text-xs"
                      style={{ color: "rgba(0,0,0,0.4)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={ra.author.avatar}
                            alt={ra.author.name}
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </div>
                        <span
                          style={{
                            fontFamily:
                              "'Helvetica Neue', Helvetica, Arial, sans-serif",
                          }}
                        >
                          By {ra.author.name}
                        </span>
                      </div>
                      {ra.coAuthors && ra.coAuthors.length > 0 && (
                        <span
                          style={{
                            fontFamily:
                              "'Helvetica Neue', Helvetica, Arial, sans-serif",
                          }}
                        >
                          &amp; {ra.coAuthors.length} other
                          {ra.coAuthors.length > 1 ? "s" : ""}
                        </span>
                      )}
                      <span
                        className="ml-auto"
                        style={{
                          fontFamily:
                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        }}
                      >
                        {formatDate(ra.publishedDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
