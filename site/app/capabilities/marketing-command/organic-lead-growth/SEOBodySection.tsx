"use client";

import { useState } from "react";
import { CalendlyModal } from "@/app/components/CalendlyModal";

export function SEOBodySection() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <section
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 880,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E53E3E",
            borderBottom: "1px solid rgba(229,62,62,0.3)",
            paddingBottom: "4px",
            marginBottom: "1rem",
          }}
        >
          The deep dive
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          What is Organic Lead Growth?
        </h2>
      </div>

      <article
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "1rem",
          color: "rgba(0,0,0,0.72)",
          lineHeight: 1.85,
        }}
      >
        <p style={{ margin: "0 0 1.5rem" }}>
          Organic Lead Growth (OLG) is the deliberate construction of search
          architecture - the structure of indexed pages on your website - to
          capture buyer-intent traffic that compounds over time. Unlike paid
          advertising, where every click costs you money, organic lead
          generation creates leverage: pages you publish today generate
          qualified leads for years, with no per-click cost. The catch is that
          search engines reward architecture, not effort. A 1,000-page site
          built with intentional query targeting and SERP-validated content
          beats a 50-page site updated daily, every time.
        </p>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "2rem 0 1rem",
            fontWeight: 400,
          }}
        >
          Why most SEO services fail
        </h3>

        <p style={{ margin: "0 0 1.5rem" }}>
          Most agencies pitch one of two flawed playbooks: <strong>(1)</strong>{" "}
          slow-drip blog publishing - 4 to 8 articles a month, hoping the
          aggregate signal moves the needle, or <strong>(2)</strong> bulk
          programmatic content - tens of thousands of templated pages that rank
          for queries the business can&apos;t actually serve. Both fail for the
          same reason: neither approach validates whether the targeted query
          will produce a buyer-ready visitor. Rule27&apos;s OLG framework gates
          every engagement on Phase 2 (SERP Validation) - analyzing the
          existing top-ranking pages for each priority query and matching their
          depth, structure, and intent before deploying. This is the
          single-largest predictor of post-launch CTR.
        </p>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "2rem 0 1rem",
            fontWeight: 400,
          }}
        >
          The compounding effect
        </h3>

        <p style={{ margin: "0 0 1.5rem" }}>
          Each indexed page is an independent door into your business. A site
          with 1,000 pages targeting 1,000 distinct buyer queries generates
          ~1,000 separate impression streams in Google Search Console - every
          one of them a potential lead. Compounding kicks in by month 2-3 as
          rankings consolidate and Google&apos;s algorithm rewards topical
          authority. By month 6, the site is operating as a 24/7 sales
          machine: clients who used to spend 80% of their lead generation
          budget on paid ads typically reduce that to 30-40% within the first
          year, redirecting the difference into higher-margin growth
          activities.
        </p>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.4rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "2rem 0 1rem",
            fontWeight: 400,
          }}
        >
          What Rule27&apos;s 4-week deployment actually does
        </h3>

        <p style={{ margin: "0 0 1.5rem" }}>
          The Rule27 OLG service compresses a 6-month traditional SEO buildout
          into 4 weeks. Week 1 covers competitor research, keyword gap
          analysis, and SERP validation across 1,000+ priority queries. Week 2
          builds page templates and seeds the CMS with all 1,000+ records.
          Weeks 3-4 deploy at ~71 pages/day with manual Google Search Console
          indexing, ensuring every page enters the index within the same
          window. The result is a near-vertical impression curve in your GSC
          dashboard within 4-6 weeks of launch - the same pattern that took
          NMHL from 14 indexed pages to 312 pages and 29,100 monthly
          impressions in 21 days. After deployment, the $1,500/month retainer
          (at the standard tier) handles ongoing CTR optimization, content
          refresh, keyword expansion, and weekly performance reporting.
        </p>

        <p
          style={{
            margin: "2rem 0 0",
            padding: "1.25rem 1.5rem",
            background: "rgba(229,62,62,0.04)",
            borderLeft: "3px solid #E53E3E",
            fontStyle: "italic",
            fontSize: "1.05rem",
          }}
        >
          Want to see what your current page architecture looks like compared
          to your top 3 local competitors?{" "}
          <a
            href="#domain-capture"
            style={{
              color: "#E53E3E",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Drop your domain
          </a>{" "}
          and we&apos;ll send you the gap analysis in under an hour. Or{" "}
          <button
            onClick={() => setCalendlyOpen(true)}
            data-funnel="demo-book"
            data-funnel-source="seo-body"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#E53E3E",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            book 15 minutes
          </button>{" "}
          to walk through what Phase 2 looks like for your specific industry.
        </p>
      </article>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
}
