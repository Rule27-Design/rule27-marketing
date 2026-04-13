"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/app/components/Card";
import {
  BookOpen,
  Eye,
  Share2,
  MessageCircle,
  ArrowRight,
  Grid,
  TrendingUp,
  Settings,
  FileText,
  Sparkles,
} from "lucide-react";

/* ─── Categories ─── */
const categories = [
  { id: "all", label: "All Content", icon: Grid },
  { id: "trends", label: "Trends", icon: TrendingUp },
  { id: "methodology", label: "Methodology", icon: Settings },
  { id: "case-studies", label: "Case Studies", icon: FileText },
  { id: "predictions", label: "Predictions", icon: Sparkles },
];

/* ─── Articles ─── */
const articles = [
  {
    id: 1,
    category: "trends",
    type: "Article",
    title: "The Death of Traditional Web Design: Why Brutalism is Taking Over",
    excerpt:
      "The design world is witnessing a seismic shift away from polished minimalism toward raw, uncompromising brutalist aesthetics. Our analysis of 10,000+ websites shows a 73% increase in brutalist design elements over the past 18 months.",
    author: "Sarah Chen",
    role: "Creative Director",
    readTime: "8 min read",
    tags: ["Design Trends", "Brutalism"],
    engagement: { views: "12.5K", shares: "847", comments: "156" },
  },
  {
    id: 2,
    category: "methodology",
    type: "Deep Dive",
    title: "The Rule27 Design Method: How We Achieve 40% Higher Conversion Rates",
    excerpt:
      "After analyzing 500+ projects, we've identified the exact methodology that consistently delivers exceptional results. Our proprietary approach combines behavioral psychology, data science, and creative audacity.",
    author: "Marcus Rodriguez",
    role: "Strategy Lead",
    readTime: "12 min read",
    tags: ["Methodology", "Conversion"],
    engagement: { views: "8.9K", shares: "623", comments: "89" },
  },
  {
    id: 3,
    category: "predictions",
    type: "Forecast",
    title: "2026 Predictions: The Technologies That Will Reshape Digital",
    excerpt:
      "Based on our analysis of emerging technologies and market signals, we're making bold predictions about what will dominate the digital landscape. From AI-powered design systems to quantum computing interfaces.",
    author: "Dr. Alex Kim",
    role: "Innovation Lead",
    readTime: "15 min read",
    tags: ["Predictions", "Technology"],
    engagement: { views: "15.2K", shares: "1.2K", comments: "234" },
  },
  {
    id: 4,
    category: "case-studies",
    type: "Case Study",
    title: "How We Increased TechCorp's Revenue by 300% in 6 Months",
    excerpt:
      "A complete breakdown of our most successful transformation project. From initial audit to final results, we share every strategy, challenge, and breakthrough that tripled revenue while reducing acquisition costs.",
    author: "Jennifer Walsh",
    role: "Account Director",
    readTime: "10 min read",
    tags: ["Case Study", "Revenue Growth"],
    engagement: { views: "22.1K", shares: "1.8K", comments: "312" },
  },
  {
    id: 5,
    category: "trends",
    type: "Analysis",
    title: "The Rise of Micro-Interactions: Why Small Details Drive Big Results",
    excerpt:
      "Our research into user behavior reveals that micro-interactions can increase engagement by up to 67%. We analyzed 1,000+ websites to identify the micro-interactions with the most impact.",
    author: "David Park",
    role: "UX Research Lead",
    readTime: "7 min read",
    tags: ["UX Design", "Micro-interactions"],
    engagement: { views: "9.7K", shares: "542", comments: "78" },
  },
  {
    id: 6,
    category: "methodology",
    type: "Framework",
    title: "The Psychology of Color in Digital Experiences: A Data-Driven Approach",
    excerpt:
      "Color isn't just aesthetic -- it's psychological. Our comprehensive study of color psychology in digital interfaces reveals surprising insights from A/B testing 50,000+ users.",
    author: "Lisa Thompson",
    role: "Design Psychology Expert",
    readTime: "11 min read",
    tags: ["Color Psychology", "Design"],
    engagement: { views: "13.4K", shares: "891", comments: "167" },
  },
];

/* ─── Stagger variants ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function ThoughtLeadership() {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <section
      id="insights"
      ref={sectionRef}
      style={{ background: "#FFFFFF", padding: "clamp(3rem, 8vw, 6rem) 0" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#E53E3E",
              background: "rgba(229,62,62,0.08)",
              border: "1px solid rgba(229,62,62,0.15)",
              borderRadius: "9999px",
              padding: "6px 16px",
              marginBottom: "1.25rem",
            }}
          >
            <BookOpen size={14} style={{ color: "#E53E3E" }} />
            Thought Leadership
          </span>

          <h2
            style={{
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#111111",
              margin: "0 0 0.75rem",
              lineHeight: 1,
            }}
          >
            Industry <span style={{ color: "#E53E3E" }}>Insights</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: "rgba(0,0,0,0.5)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Deep-dive analysis, strategic frameworks, and forward-thinking
            perspectives that shape the future of digital experiences.
          </p>
        </motion.div>

        {/* ── Category filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              justifyContent: "center",
              background: "rgba(0,0,0,0.04)",
              borderRadius: "16px",
              padding: "4px",
              gap: "2px",
            }}
          >
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                    fontSize: "12px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#E53E3E" : "rgba(0,0,0,0.5)",
                    background: isActive ? "#FFFFFF" : "transparent",
                    border: "none",
                    borderRadius: "12px",
                    padding: "6px 14px",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap",
                    margin: "2px",
                  }}
                >
                  <CatIcon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Articles grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: "1.25rem" }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {filteredArticles.map((article) => (
            <motion.div key={article.id} variants={itemVariants}>
              <Card>
                <div>
                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                        fontSize: "9px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(0,0,0,0.4)",
                        background: "rgba(0,0,0,0.04)",
                        padding: "3px 8px",
                        borderRadius: "2px",
                      }}
                    >
                      {article.type}
                    </span>
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                          fontSize: "9px",
                          color: "rgba(0,0,0,0.35)",
                          background: "rgba(0,0,0,0.03)",
                          padding: "3px 8px",
                          borderRadius: "2px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#111111",
                      margin: "0 0 0.5rem",
                      lineHeight: 1.2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                      fontSize: "13px",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: 1.6,
                      margin: "0 0 1rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Author */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {/* Avatar circle */}
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #E53E3E, #c53030)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                            fontSize: "10px",
                            color: "#FFFFFF",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {article.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#111111",
                          }}
                        >
                          {article.author}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                            fontSize: "10px",
                            color: "rgba(0,0,0,0.4)",
                          }}
                        >
                          {article.role}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-body, 'Helvetica Neue'), Helvetica, Arial, sans-serif",
                        fontSize: "10px",
                        color: "rgba(0,0,0,0.35)",
                      }}
                    >
                      {article.readTime}
                    </span>
                  </div>

                  {/* Engagement */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {[
                      { icon: Eye, val: article.engagement.views },
                      { icon: Share2, val: article.engagement.shares },
                      { icon: MessageCircle, val: article.engagement.comments },
                    ].map(({ icon: Icon, val }, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                          fontSize: "11px",
                          letterSpacing: "0.05em",
                          color: "rgba(0,0,0,0.35)",
                        }}
                      >
                        <Icon size={12} />
                        {val}
                      </span>
                    ))}
                  </div>

                  {/* Read more button */}
                  <button
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "8px 16px",
                      background: "transparent",
                      color: "rgba(0,0,0,0.5)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    Read Full Article
                    <ArrowRight size={12} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ textAlign: "center", marginTop: "2.5rem" }}
        >
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "12px 28px",
              background: "transparent",
              color: "#E53E3E",
              border: "1px solid #E53E3E",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Load More Articles
          </button>
        </motion.div>
      </div>
    </section>
  );
}
