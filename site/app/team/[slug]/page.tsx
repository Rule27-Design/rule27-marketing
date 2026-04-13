import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getTeamMember,
  type TeamMemberArticle,
  type TeamMemberCaseStudy,
} from "@/app/lib/data/team";
import { StatCard } from "@/app/components/Card";
import { Card } from "@/app/components/Card";
import type { TeamMember } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// Dynamic metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { member } = await getTeamMember(slug);

  if (!member) {
    return { title: "Team Member Not Found" };
  }

  return {
    title: `${member.full_name} - ${member.job_title} | Rule27 Design`,
    description: member.bio
      ? member.bio.substring(0, 160)
      : `Meet ${member.full_name}, ${member.job_title} at Rule27 Design.`,
    openGraph: {
      title: `${member.full_name} | Rule27 Design`,
      description:
        member.bio || `${member.full_name} - ${member.job_title} at Rule27 Design`,
      type: "profile",
      ...(member.avatar_url && {
        images: [{ url: member.avatar_url, width: 400, height: 400 }],
      }),
    },
  };
}

// ---------------------------------------------------------------------------
// CSS hover styles (server component cannot use onMouseEnter/Leave)
// ---------------------------------------------------------------------------

const hoverStyles = `
  .r27-social-btn:hover {
    background: #E53E3E !important;
    color: #FFFFFF !important;
  }
  .r27-hover-card {
    transition: all 0.3s ease;
  }
  .r27-hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 0 16px rgba(229,62,62,0.06) !important;
  }
  .r27-cta-link:hover {
    background: #C53030 !important;
  }
`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { member, relatedMembers, articles, caseStudies } =
    await getTeamMember(slug);

  if (!member) notFound();

  const totalContent = articles.length + caseStudies.length;

  return (
    <div style={{ background: "#FCFCFB" }}>
      <style dangerouslySetInnerHTML={{ __html: hoverStyles }} />

      {/* ================================================================ */}
      {/* HERO SECTION -- 2 column grid                                     */}
      {/* ================================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #F8F9FA, #FFFFFF)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            style={{ alignItems: "center" }}
          >
            {/* LEFT -- Large avatar */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "28rem",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    aspectRatio: "1 / 1",
                    background:
                      "linear-gradient(135deg, rgba(229,62,62,0.15), rgba(17,17,17,0.08))",
                    borderRadius: "1.5rem",
                    overflow: "hidden",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.12), 0 0 24px rgba(229,62,62,0.06)",
                    position: "relative",
                  }}
                >
                  {member.avatar_url ? (
                    <Image
                      src={member.avatar_url}
                      alt={member.full_name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Steelfish', 'Impact', sans-serif",
                          fontSize: "6rem",
                          color: "#111111",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {member.full_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats badge -- absolute positioned */}
                {totalContent > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-1rem",
                      right: "-1rem",
                      background: "#E53E3E",
                      borderRadius: "1rem",
                      padding: "1rem",
                      boxShadow: "0 8px 24px rgba(229,62,62,0.3)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Steelfish', 'Impact', sans-serif",
                        fontSize: "1.875rem",
                        textTransform: "uppercase",
                        lineHeight: 1,
                        color: "#FFFFFF",
                      }}
                    >
                      {totalContent}
                    </div>
                    <div
                      style={{
                        fontFamily:
                          "Helvetica Neue, Helvetica, Arial, sans-serif",
                        fontSize: "0.75rem",
                        color: "#FFFFFF",
                      }}
                    >
                      Published Works
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT -- Name, title, tags, bio, social */}
            <div>
              <h1
                className="text-4xl sm:text-5xl"
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontWeight: 400,
                  color: "#111111",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  lineHeight: 1.1,
                }}
              >
                {member.full_name || member.display_name}
              </h1>

              <p
                className="text-xl"
                style={{
                  fontFamily:
                    "Helvetica Neue, Helvetica, Arial, sans-serif",
                  color: "#E53E3E",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                {member.job_title}
              </p>

              {/* Department tags */}
              {member.department && member.department.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {member.department.map((dept) => (
                    <span
                      key={dept}
                      style={{
                        fontFamily:
                          "Helvetica Neue, Helvetica, Arial, sans-serif",
                        fontSize: "0.875rem",
                        color: "#E53E3E",
                        background: "rgba(229,62,62,0.08)",
                        padding: "0.5rem 1rem",
                        borderRadius: "9999px",
                        fontWeight: 500,
                      }}
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio */}
              {member.bio && (
                <p
                  style={{
                    fontFamily:
                      "Helvetica Neue, Helvetica, Arial, sans-serif",
                    color: "rgba(0,0,0,0.55)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                    fontSize: "1rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {member.bio}
                </p>
              )}

              {/* Social links */}
              <div style={{ display: "flex", gap: "1rem" }}>
                {member.linkedin_url && (
                  <SocialButton href={member.linkedin_url} label="LinkedIn">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </SocialButton>
                )}
                {member.twitter_url && (
                  <SocialButton href={member.twitter_url} label="Twitter">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </SocialButton>
                )}
                {member.github_url && (
                  <SocialButton href={member.github_url} label="GitHub">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </SocialButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STATS GRID                                                        */}
      {/* ================================================================ */}
      {(articles.length > 0 ||
        caseStudies.length > 0 ||
        (member.expertise && member.expertise.length > 0)) && (
        <section
          style={{
            paddingTop: "3rem",
            paddingBottom: "3rem",
            background: "#FFFFFF",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {articles.length > 0 && (
                <StatCard
                  label="Articles Published"
                  value={String(articles.length)}
                  unit="total"
                />
              )}
              {caseStudies.length > 0 && (
                <StatCard
                  label="Case Studies"
                  value={String(caseStudies.length)}
                  unit="projects"
                />
              )}
              {member.expertise && member.expertise.length > 0 && (
                <StatCard
                  label="Expertise Areas"
                  value={String(member.expertise.length)}
                  unit="skills"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* EXPERTISE SECTION                                                 */}
      {/* ================================================================ */}
      {member.expertise && member.expertise.length > 0 && (
        <section
          style={{
            paddingTop: "3rem",
            paddingBottom: "3rem",
            background: "#FCFCFB",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl"
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontWeight: 400,
                color: "#111111",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "2rem",
                lineHeight: 1.1,
              }}
            >
              Areas of Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {member.expertise.map((skill) => (
                <Card key={skill}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E53E3E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span
                      style={{
                        fontFamily:
                          "Helvetica Neue, Helvetica, Arial, sans-serif",
                        fontSize: "0.9rem",
                        color: "#111111",
                      }}
                    >
                      {skill}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* PUBLISHED ARTICLES                                                */}
      {/* ================================================================ */}
      {articles.length > 0 && (
        <section
          style={{
            paddingTop: "3rem",
            paddingBottom: "3rem",
            background: "#F8F9FA",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <h2
                className="text-3xl"
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontWeight: 400,
                  color: "#111111",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Published Articles
              </h2>
              <Link
                href="/articles"
                className="r27-cta-link"
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  background: "#E53E3E",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                }}
              >
                View All Articles
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 6).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* CASE STUDIES                                                      */}
      {/* ================================================================ */}
      {caseStudies.length > 0 && (
        <section
          style={{
            paddingTop: "3rem",
            paddingBottom: "3rem",
            background: "#FFFFFF",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <h2
                className="text-3xl"
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontWeight: 400,
                  color: "#111111",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Case Studies
              </h2>
              <Link
                href="/case-studies"
                className="r27-cta-link"
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  background: "#E53E3E",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "2px",
                  transition: "all 0.3s",
                }}
              >
                View All Case Studies
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.slice(0, 4).map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* RELATED TEAM MEMBERS                                              */}
      {/* ================================================================ */}
      {relatedMembers.length > 0 && (
        <section
          style={{
            paddingTop: "3rem",
            paddingBottom: "4rem",
            background: "#F8F9FA",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl"
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontWeight: 400,
                color: "#111111",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "2rem",
                lineHeight: 1.1,
              }}
            >
              Related Team Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedMembers.map((rm) => (
                <RelatedMemberCard key={rm.id} member={rm} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* BACK TO TEAM CTA                                                  */}
      {/* ================================================================ */}
      <section
        style={{
          paddingTop: "3rem",
          paddingBottom: "3rem",
          background: "#FFFFFF",
          textAlign: "center",
        }}
      >
        <Link
          href="/team"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "16px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "1rem 2rem",
            background: "#111111",
            color: "#FFFFFF",
            borderRadius: "2px",
            transition: "all 0.3s",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          View All Team Members
        </Link>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social button (CSS-hover via class, no JS event handlers)
// ---------------------------------------------------------------------------

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="r27-social-btn"
      style={{
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        background: "rgba(229,62,62,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E53E3E",
        transition: "all 0.3s",
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Article card
// ---------------------------------------------------------------------------

function ArticleCard({ article }: { article: TeamMemberArticle }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const categoryName =
    article.categories && article.categories.length > 0
      ? article.categories[0].name
      : "Article";

  return (
    <Link
      href={`/articles/${article.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="r27-hover-card"
        style={{
          background: "#FFFFFF",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {article.featured_image && (
          <div
            style={{
              height: "12rem",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                objectFit: "cover",
                transition: "transform 0.7s",
              }}
            />
          </div>
        )}
        <div style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "0.75rem",
                color: "#E53E3E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {categoryName}
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.3)" }}>
              &bull;
            </span>
            <span
              style={{
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(0,0,0,0.45)",
              }}
            >
              {article.read_time} min read
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "1.125rem",
              color: "#111111",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              marginBottom: "0.5rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.title}
          </h3>
          {article.excerpt && (
            <p
              style={{
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "0.875rem",
                color: "rgba(0,0,0,0.5)",
                lineHeight: 1.5,
                marginBottom: "0.75rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {article.excerpt}
            </p>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              color: "rgba(0,0,0,0.4)",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            }}
          >
            <span>{formatDate(article.published_at)}</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {article.view_count}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {article.like_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Case study card
// ---------------------------------------------------------------------------

function CaseStudyCard({ caseStudy }: { caseStudy: TeamMemberCaseStudy }) {
  const categoryName =
    caseStudy.categories && caseStudy.categories.length > 0
      ? caseStudy.categories[0].name
      : "Case Study";

  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="r27-hover-card"
        style={{
          background: "#F8F9FA",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
        }}
      >
        {caseStudy.featured_image && (
          <div
            style={{
              width: "33%",
              minHeight: "200px",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image
              src={caseStudy.featured_image}
              alt={caseStudy.title}
              fill
              sizes="(max-width: 768px) 100vw, 20vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div style={{ flex: 1, padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "0.75rem",
                color: "#E53E3E",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {categoryName}
            </span>
            {caseStudy.project_duration && (
              <>
                <span
                  style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.3)" }}
                >
                  &bull;
                </span>
                <span
                  style={{
                    fontFamily:
                      "Helvetica Neue, Helvetica, Arial, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(0,0,0,0.45)",
                  }}
                >
                  {caseStudy.project_duration}
                </span>
              </>
            )}
          </div>
          <h3
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "1.125rem",
              color: "#111111",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              marginBottom: "0.5rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {caseStudy.title}
          </h3>
          {caseStudy.client_name && (
            <p
              style={{
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "0.875rem",
                color: "#E53E3E",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              {caseStudy.client_name}
            </p>
          )}
          {caseStudy.excerpt && (
            <p
              style={{
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "0.875rem",
                color: "rgba(0,0,0,0.5)",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                margin: 0,
              }}
            >
              {caseStudy.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Related member card
// ---------------------------------------------------------------------------

function RelatedMemberCard({ member }: { member: TeamMember }) {
  return (
    <Link
      href={`/team/${member.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="r27-hover-card"
        style={{
          background: "#FFFFFF",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            height: "12rem",
            background:
              "linear-gradient(135deg, rgba(229,62,62,0.15), rgba(17,17,17,0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {member.avatar_url ? (
            <Image
              src={member.avatar_url}
              alt={member.full_name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "2rem",
                color: "#111111",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {member.full_name?.charAt(0)}
            </span>
          )}
        </div>
        <div style={{ padding: "1.25rem" }}>
          <h3
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontWeight: 400,
              color: "#111111",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.25rem",
              lineHeight: 1.2,
            }}
          >
            {member.full_name}
          </h3>
          <p
            style={{
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              fontSize: "0.875rem",
              color: "rgba(0,0,0,0.5)",
              margin: 0,
            }}
          >
            {member.job_title}
          </p>
        </div>
      </div>
    </Link>
  );
}
