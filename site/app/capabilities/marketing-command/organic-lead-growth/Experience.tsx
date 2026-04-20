"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { Tooltip } from "@/app/components/Tooltip";
import { ContextualPopup } from "@/app/components/ContextualPopup";
import { CalendlyModal } from "@/app/components/CalendlyModal";

import { IndustryModal } from "./IndustryModal";
import { ClientShowcase } from "./ClientShowcase";
import { GapVisualization } from "./GapVisualization";
import { RevenueCounter } from "./RevenueCounter";
import { DomainCaptureForm } from "./DomainCaptureForm";
import { WaitlistInput } from "./WaitlistInput";
import { CTACard } from "./CTACard";
import { VideoSection } from "./VideoSection";
import { AccentStrip, DotGrid } from "./decor";
import { ProofJuxtaposition } from "./ProofJuxtaposition";
import { RevenueTimeline } from "./RevenueTimeline";
import { WeeklyReportPreview } from "./WeeklyReportPreview";
import { PricingCard } from "./PricingCard";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { TeamCards } from "./TeamCards";
import { ComparisonTable } from "./ComparisonTable";
import { FAQSection } from "./FAQSection";
import { SEOBodySection } from "./SEOBodySection";

import { getIndustry, type IndustrySlug } from "./data/industries";
import { getClientsForIndustry } from "./data/clients";
import {
  ARTICLE_PREVIEWS,
  CASE_STUDY_QUOTE,
  DOWNLOADS,
  REVELATION_LINES,
  REVENUE_FORMULA,
  TOOLTIPS,
} from "./data/copy";

const SESSION_KEY = "olg.session";
const INDUSTRY_KEY = "olg.industry";

interface SessionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  first_name?: string;
  company_name?: string;
  domain?: string;
  industry?: IndustrySlug;
  interactions: Array<{ event: string; payload?: unknown; ts: number }>;
}

function readSession(): SessionData {
  if (typeof window === "undefined") return { interactions: [] };
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as SessionData;
  } catch {
    // ignore
  }
  return { interactions: [] };
}

function writeSession(data: SessionData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function Experience() {
  return (
    <Suspense fallback={null}>
      <ExperienceInner />
    </Suspense>
  );
}

function ExperienceInner() {
  const searchParams = useSearchParams();
  const sessionRef = useRef<SessionData>({ interactions: [] });
  const [industrySlug, setIndustrySlug] = useState<IndustrySlug | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate UTMs + persist in session storage on mount
  useEffect(() => {
    const existing = readSession();

    const fromQuery: SessionData = {
      utm_source: searchParams.get("utm_source") ?? existing.utm_source,
      utm_medium: searchParams.get("utm_medium") ?? existing.utm_medium,
      utm_campaign: searchParams.get("utm_campaign") ?? existing.utm_campaign,
      utm_content: searchParams.get("utm_content") ?? existing.utm_content,
      first_name: searchParams.get("first_name") ?? existing.first_name,
      company_name: searchParams.get("company_name") ?? existing.company_name,
      domain: searchParams.get("domain") ?? existing.domain,
      industry: existing.industry,
      interactions: existing.interactions ?? [],
    };

    sessionRef.current = fromQuery;
    writeSession(fromQuery);

    // Resolve industry: stored > utm_content > none (open modal)
    const stored = sessionStorage.getItem(INDUSTRY_KEY) as IndustrySlug | null;
    const fromUtm = searchParams.get("utm_content") as IndustrySlug | null;
    const resolved = stored ?? (fromUtm && fromUtm in resolveIndustryMap() ? fromUtm : null);

    if (resolved) {
      setIndustrySlug(resolved);
    } else {
      setModalOpen(true);
    }
    setHydrated(true);
    track("page_view", { utms: fromQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const track = useCallback((event: string, payload?: unknown) => {
    const session = sessionRef.current;
    const entry = { event, payload, ts: Date.now() };
    session.interactions = [...(session.interactions ?? []), entry];
    sessionRef.current = session;
    writeSession(session);
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[OLG]", event, payload ?? "");
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", event, (payload as Record<string, unknown>) ?? {});
    }
  }, []);

  const handleIndustrySelect = useCallback(
    (slug: IndustrySlug) => {
      setIndustrySlug(slug);
      setModalOpen(false);
      sessionRef.current = { ...sessionRef.current, industry: slug };
      writeSession(sessionRef.current);
      sessionStorage.setItem(INDUSTRY_KEY, slug);
      track("industry_selected", { slug });
    },
    [track],
  );

  const handleDomainSubmit = useCallback(
    (domain: string) => {
      sessionRef.current = { ...sessionRef.current, domain };
      writeSession(sessionRef.current);
      track("domain_submitted", {
        domain,
        industry: industrySlug,
        utms: {
          utm_source: sessionRef.current.utm_source,
          utm_medium: sessionRef.current.utm_medium,
          utm_campaign: sessionRef.current.utm_campaign,
          utm_content: sessionRef.current.utm_content,
        },
        interactionCount: sessionRef.current.interactions.length,
      });
      // TODO: POST to n8n/Odoo webhook when endpoint is wired
    },
    [industrySlug, track],
  );

  const handleWaitlistSubmit = useCallback(
    (email: string) => {
      track("waitlist_signup", { email });
    },
    [track],
  );

  const industry = useMemo(
    () => getIndustry(industrySlug),
    [industrySlug],
  );
  const clients = useMemo(
    () => getClientsForIndustry(industrySlug),
    [industrySlug],
  );
  const firstName = sessionRef.current.first_name ?? null;
  const companyName = sessionRef.current.company_name ?? null;
  const utmContentSuggestion = useMemo(() => {
    const v = searchParams.get("utm_content") as IndustrySlug | null;
    return v && v in resolveIndustryMap() ? v : null;
  }, [searchParams]);

  return (
    <div style={{ background: "#FCFCFB", minHeight: "100vh" }}>
      <ScrollProgress />

      {/* Industry modal — Beat 1 */}
      <IndustryModal
        open={modalOpen}
        suggested={utmContentSuggestion}
        onSelect={handleIndustrySelect}
        firstName={firstName}
      />

      {/* Beat 1 — Arrival hero */}
      <Beat1Arrival
        industryDisplay={industry.displayName}
        firstName={firstName}
        companyName={companyName}
        revealed={hydrated && !modalOpen}
        onOpenModal={() => setModalOpen(true)}
      />

      {/* Video — env-gated placeholder, hidden in prod */}
      <VideoSection industryDisplay={industry.displayName} />

      <AccentStrip variant="left" height={80} />

      {/* Beat 2 — Proof */}
      <Beat2Proof headline={industry.headline} clients={clients} onTrack={track} />

      {/* NMHL ✓ vs AniltX V1 ✗ — the killer Lego piece */}
      <ProofJuxtaposition />

      {/* High-impact CTA card — replaces flat ConversionBreak */}
      <section
        style={{
          padding: "clamp(1.5rem, 3vw, 2.5rem) 1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <CTACard
          variant="inquiry"
          eyebrow="Compare your numbers"
          title="Curious how your domain stacks up?"
          description="Drop your domain in 60 seconds. We'll analyze your indexed pages, top organic keywords, and the gap between you and your top 3 local competitors. Delivered to your inbox in under an hour."
          ctaLabel="See where you stand"
          onClick={() => {
            document
              .getElementById("domain-capture")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      </section>

      <section
        style={{
          padding: "clamp(0.5rem, 1.5vw, 1.5rem) 1.5rem clamp(2rem, 4vw, 3rem)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <CTACard
          variant="download"
          eyebrow="Free playbook"
          badge="PDF · 24 pages"
          title={DOWNLOADS.playbook.title}
          description={DOWNLOADS.playbook.description}
          ctaLabel="Get the playbook"
          ctaHref={DOWNLOADS.playbook.href}
        />
      </section>

      {/* Beat 3 — Revelation (woven Lego pieces) */}
      <Beat3Revelation industry={industry} domain={sessionRef.current.domain} />

      <section
        style={{
          padding: "clamp(2rem, 4vw, 3rem) 1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <CTACard
          variant="download"
          eyebrow="Industry benchmark"
          badge="PDF · 18 pages"
          title={DOWNLOADS.benchmarks.title}
          description={DOWNLOADS.benchmarks.description}
          ctaLabel="Download benchmarks"
          ctaHref={DOWNLOADS.benchmarks.href}
        />
      </section>

      <RevenueFormulaSection />

      {/* 4-week timeline + 8-phase methodology callout */}
      <RevenueTimeline />

      {/* Calendly CTA after timeline */}
      <section
        style={{
          padding: "clamp(1rem, 2vw, 2rem) 1.5rem clamp(2rem, 4vw, 3rem)",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <CTACard
          variant="calendly"
          eyebrow="Book the walkthrough"
          title="Want Josh to walk you through the 4 weeks live?"
          description="15 minutes. We'll show you exactly what week 1 looks like for your industry, what we'll need from you, and what your week-4 dashboard will look like. No pitch — just the plan."
          ctaLabel="Book 15 min with Josh"
        />
      </section>

      {/* Weekly report preview — what they get every Friday */}
      <WeeklyReportPreview />

      <AccentStrip variant="right" height={100} />

      {/* Beat 4 — The Mirror */}
      <Beat4Mirror
        industry={industry}
        onWaitlistSubmit={handleWaitlistSubmit}
      />

      {/* Pricing — fully exposed */}
      <PricingCard />

      {/* What we need from you */}
      <OnboardingChecklist />

      {/* Team credibility */}
      <TeamCards />

      {/* Side-by-side comparison */}
      <ComparisonTable />

      {/* FAQs */}
      <FAQSection />

      {/* SEO body content for ranking */}
      <SEOBodySection />

      <AccentStrip variant="left" height={80} />

      {/* Beat 5 — The Bridge */}
      <Beat5Bridge
        defaultDomain={sessionRef.current.domain ?? ""}
        onSubmit={handleDomainSubmit}
      />

      {/* Beat 6 — Post-conversion exit */}
      <Beat6Exit onTrack={track} />

      {/* Persistent: scroll-depth contextual popup */}
      <ContextualPopup
        triggerDepth={0.6}
        title="Want your exact numbers?"
        text="We can show you your page count vs your top 3 local competitors in under 60 minutes. Free."
        ctaText="Get my free analysis"
        serviceSlug="olg-mirror-popup"
      />

      {/* Sticky bar */}
      <OLGStickyBar industryShortName={industry.shortName} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Beat 1 — Arrival
// ---------------------------------------------------------------------------

function Beat1Arrival({
  industryDisplay,
  firstName,
  companyName,
  revealed,
  onOpenModal,
}: {
  industryDisplay: string;
  firstName: string | null;
  companyName: string | null;
  revealed: boolean;
  onOpenModal: () => void;
}) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      {/* Atmospheric layers */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #000 0%, #111 50%, #000 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "70%",
            height: "70%",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.22), transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "60%",
            height: "60%",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.12), transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundImage:
                "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
            }}
          />
        </div>
      </div>

      {/* Drifting blurred data shapes (mock graph silhouettes) */}
      <DriftingShapes />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "8rem 1.5rem 5rem",
          width: "100%",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.4, y: -8 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(229,62,62,0.85)",
            marginBottom: "1.5rem",
          }}
        >
          Q2 2026 — Exposing Industry Secrets
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 18 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem, 9vw, 6.5rem)",
            fontWeight: 400,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            margin: "0 0 1.5rem",
            lineHeight: 0.92,
          }}
        >
          Exposing{" "}
          <span style={{ color: "#E53E3E" }}>{industryDisplay}</span> Secrets
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 18 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.55,
            margin: "0 auto 2.5rem",
            maxWidth: 680,
          }}
        >
          {companyName ? `${companyName}, ` : ""}we pulled the numbers on
          what&apos;s really happening in your search results.{" "}
          <span style={{ color: "#FFFFFF" }}>Most of it isn&apos;t pretty.</span>{" "}
          But it&apos;s the most useful 90 seconds you&apos;ll spend this
          quarter.
        </motion.p>

        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.65rem 1rem",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.04)",
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            <span style={{ color: "#E53E3E" }}>✓</span>
            Industry: {industryDisplay}
            <button
              onClick={onOpenModal}
              style={{
                marginLeft: "0.5rem",
                padding: "0.15rem 0.5rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Change
            </button>
          </motion.div>
        )}

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Scroll
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 24, background: "#E53E3E" }}
          />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "8rem",
          background: "linear-gradient(to top, #FCFCFB, transparent)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

function DriftingShapes() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.18, x: 0 }}
          transition={{ duration: 1.4, delay: 0.2 * i }}
          style={{
            position: "absolute",
            top: `${20 + i * 25}%`,
            left: 0,
            width: "100%",
            height: 60,
            filter: "blur(2px)",
          }}
        >
          <path
            d={`M 0 ${40 + i * 4} Q 25 ${30 - i * 4} 50 ${28 + i * 2} T 100 ${22 + i * 3} T 150 ${18 - i * 2} T 200 ${10 + i * 3}`}
            stroke="rgba(229,62,62,0.4)"
            strokeWidth={0.4}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Beat 2 — Proof
// ---------------------------------------------------------------------------

function Beat2Proof({
  headline,
  clients,
  onTrack,
}: {
  headline: string;
  clients: ReturnType<typeof getClientsForIndustry>;
  onTrack: (event: string, payload?: unknown) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (inView) onTrack("beat_view", { beat: 2 });
  }, [inView, onTrack]);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(4rem, 8vw, 6rem) 1.5rem 2rem",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionHeader eyebrow="The proof" title={headline} />
      <ClientShowcase clients={clients} />

      <div
        style={{
          marginTop: "1.5rem",
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.85rem",
          color: "rgba(0,0,0,0.45)",
        }}
      >
        Related:{" "}
        <Link
          href="/articles/competitor-3000-page-website-eating-your-lunch"
          style={{ color: "#E53E3E", textDecoration: "underline" }}
        >
          how one business went from 10 pages to 400+ →
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Beat 3 — Revelation (Lego pieces)
// ---------------------------------------------------------------------------

function Beat3Revelation({
  industry,
  domain,
}: {
  industry: ReturnType<typeof getIndustry>;
  domain?: string;
}) {
  return (
    <>
      <section
        style={{
          padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <GapVisualization industry={industry} domain={domain} />
      </section>

      <RevelationLine text={REVELATION_LINES[0]} />

      <section
        style={{
          padding: "clamp(2rem, 4vw, 3rem) 1.5rem",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <RevenueCounter
          target={industry.topCompetitorsRevenueTotal}
          label={`Monthly revenue captured by your top ${industry.topCompetitors.length} competitors`}
          tooltip={TOOLTIPS.competitor_revenue}
        />
      </section>

      <RevelationLine text={REVELATION_LINES[1]} />
    </>
  );
}

function RevelationLine({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 1.5rem",
        maxWidth: 820,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#111111",
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}

function RevenueFormulaSection() {
  return (
    <section
      style={{
        padding: "clamp(2rem, 4vw, 3.5rem) 1.5rem",
        maxWidth: 920,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{
          position: "relative",
          background: "#FAF9F6",
          border: "1px solid rgba(0,0,0,0.08)",
          borderLeft: "3px solid #E53E3E",
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.06), inset 0 0 80px rgba(229,62,62,0.04)",
          padding: "clamp(1.5rem, 3vw, 2.25rem)",
          overflow: "hidden",
        }}
      >
        {/* Decorative corner gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 280,
            height: 220,
            background:
              "radial-gradient(circle at top right, rgba(229,62,62,0.08), transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Eyebrow w/ red underline */}
        <span
          style={{
            display: "inline-block",
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: "#E53E3E",
            textTransform: "uppercase",
            marginBottom: "0.85rem",
            borderBottom: "1px solid rgba(229,62,62,0.3)",
            paddingBottom: "4px",
            position: "relative",
          }}
        >
          The math, fully exposed
        </span>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#111",
            margin: "0 0 0.5rem",
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          {REVENUE_FORMULA.title}
        </h3>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.95rem",
            color: "rgba(0,0,0,0.55)",
            margin: "0 0 1.5rem",
            lineHeight: 1.65,
          }}
        >
          No black box. Run the math yourself with your own numbers.
        </p>

        <div
          style={{
            background: "#111",
            color: "#FFFFFF",
            padding: "0.85rem 1.1rem",
            marginBottom: "1.25rem",
            fontFamily: "'Courier New', monospace",
            fontSize: "0.85rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 4,
              height: "100%",
              background: "#E53E3E",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.4)" }}>$ </span>
          <span style={{ color: "#FFFFFF" }}>{REVENUE_FORMULA.formula}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          {Object.entries(REVENUE_FORMULA.example.inputs).map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                background: "#FFFFFF",
                padding: "0.85rem 0.95rem",
                border: "1px solid rgba(0,0,0,0.06)",
                borderTop: "2px solid #E53E3E",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.45)",
                  marginBottom: "0.35rem",
                }}
              >
                {k}
              </div>
              <div
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "1.45rem",
                  color: "#111",
                  lineHeight: 1,
                }}
              >
                {v}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            background:
              "linear-gradient(135deg, #0A0A0A 0%, #1a0606 50%, #0A0A0A 100%)",
            color: "#FFFFFF",
            padding: "1.5rem",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(229,62,62,0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "60%",
              height: "100%",
              background:
                "radial-gradient(circle, rgba(229,62,62,0.18), transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "0.4rem",
                }}
              >
                Revenue ceiling on organic
              </div>
              <div
                style={{
                  fontFamily: "'Steelfish', 'Impact', sans-serif",
                  fontSize: "clamp(2.25rem, 6vw, 3.5rem)",
                  color: "#E53E3E",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                {REVENUE_FORMULA.example.result}
              </div>
            </div>
            <div
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.55)",
                maxWidth: 360,
                lineHeight: 1.6,
              }}
            >
              {REVENUE_FORMULA.example.explanation}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Beat 4 — The Mirror
// ---------------------------------------------------------------------------

function Beat4Mirror({
  industry,
  onWaitlistSubmit,
}: {
  industry: ReturnType<typeof getIndustry>;
  onWaitlistSubmit: (email: string) => void;
}) {
  return (
    <section
      style={{
        padding: "clamp(4rem, 8vw, 6rem) 1.5rem",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <SectionHeader eyebrow="The mirror" title={industry.mirrorLine} centered />

      <div
        style={{
          marginTop: "2.5rem",
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.25rem, 3vw, 2rem)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.6)",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        Do you know how many pages your site has?
      </div>

      <div
        style={{
          marginTop: "3rem",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "2rem",
          alignItems: "center",
        }}
        className="olg-mirror-grid"
      >
        <PageCountComparison before={42} after={418} />

        <div>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.95rem",
              color: "rgba(0,0,0,0.6)",
              lineHeight: 1.7,
              margin: "0 0 1.5rem",
            }}
          >
            Each dot is a door — a single indexed page targeting a real search
            query. Most {industry.shortName} sites have a handful. The names
            you&apos;re losing to have hundreds. The work isn&apos;t louder.
            It&apos;s structural.
          </p>

          <AniltXSignal />

          <div style={{ marginTop: "2rem" }}>
            <div
              style={{
                fontFamily: "'Steelfish', 'Impact', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#111",
                marginBottom: "0.6rem",
              }}
            >
              Live deep-dives — get notified
            </div>
            <p
              style={{
                fontFamily: "Helvetica Neue, sans-serif",
                fontSize: "0.85rem",
                color: "rgba(0,0,0,0.5)",
                margin: "0 0 0.85rem",
                lineHeight: 1.6,
              }}
            >
              We&apos;re launching a series breaking down these strategies live —
              webinars, case studies, teardowns of businesses like yours.
            </p>
            <WaitlistInput onSubmit={onWaitlistSubmit} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .olg-mirror-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function PageCountComparison({
  before,
  after,
}: {
  before: number;
  after: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        padding: "1rem",
      }}
    >
      <PageDotPanel
        label="Most sites"
        count={before}
        accent={false}
        animate={inView}
        delayBase={0}
      />
      <PageDotPanel
        label="Sites that win"
        count={after}
        accent
        animate={inView}
        delayBase={0.4}
      />
    </div>
  );
}

function PageDotPanel({
  label,
  count,
  accent,
  animate,
  delayBase,
}: {
  label: string;
  count: number;
  accent: boolean;
  animate: boolean;
  delayBase: number;
}) {
  // Render up to 420 dots; cap to keep DOM sane
  const display = Math.min(count, 420);
  const dots = Array.from({ length: display });

  return (
    <div
      style={{
        background: accent ? "rgba(229,62,62,0.04)" : "#FAFAF9",
        border: accent
          ? "1px solid rgba(229,62,62,0.2)"
          : "1px solid rgba(0,0,0,0.05)",
        padding: "0.85rem 0.85rem 0.65rem",
        display: "flex",
        flexDirection: "column",
        minHeight: 280,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "0.6rem",
        }}
      >
        <span
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.45)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "1.6rem",
            color: accent ? "#E53E3E" : "rgba(0,0,0,0.7)",
            lineHeight: 1,
          }}
        >
          {count.toLocaleString()}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(8px, 1fr))",
          gap: 3,
          flex: 1,
          alignContent: "flex-start",
        }}
      >
        {dots.map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={animate ? { opacity: accent ? 0.9 : 0.55, scale: 1 } : {}}
            transition={{
              duration: 0.35,
              delay: delayBase + Math.min(i, 80) * 0.008,
              ease: "easeOut",
            }}
            style={{
              display: "block",
              width: 6,
              height: 6,
              background: accent ? "#E53E3E" : "rgba(0,0,0,0.5)",
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AniltXSignal() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.6rem 0.9rem",
        background: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderLeft: "2px solid #E53E3E",
      }}
    >
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "13px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#111",
        }}
      >
        AniltX
      </div>
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.8rem",
          color: "rgba(0,0,0,0.55)",
          lineHeight: 1.5,
        }}
      >
        We partner with AniltX to give businesses visibility into traffic
        they&apos;ve never had access to — including yours.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Beat 5 — The Bridge
// ---------------------------------------------------------------------------

function Beat5Bridge({
  defaultDomain,
  onSubmit,
}: {
  defaultDomain: string;
  onSubmit: (domain: string) => void;
}) {
  return (
    <section
      style={{
        padding: "clamp(4rem, 8vw, 7rem) 1.5rem",
        background: "#0A0A0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(229,62,62,0.16), transparent 65%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 2,
            background: "#E53E3E",
            margin: "0 auto 1.5rem",
          }}
          aria-hidden="true"
        />
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 5.5vw, 3.4rem)",
            fontWeight: 400,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            margin: "0 0 1.25rem",
            lineHeight: 1.05,
          }}
        >
          See where your business stands against your biggest local competitors.
        </h2>
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "rgba(255,255,255,0.6)",
            margin: "0 0 2.25rem",
            lineHeight: 1.6,
          }}
        >
          One field. No call. The full breakdown — your indexed pages, top
          competitors, revenue gap — lands in your inbox in under an hour.
        </p>

        <DomainCaptureForm onSubmit={onSubmit} defaultDomain={defaultDomain} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Beat 6 — Exit
// ---------------------------------------------------------------------------

function Beat6Exit({
  onTrack,
}: {
  onTrack: (event: string, payload?: unknown) => void;
}) {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <section style={{ padding: "clamp(4rem, 8vw, 6rem) 1.5rem" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: "2.5rem",
          alignItems: "start",
        }}
        className="olg-exit-grid"
      >
        {/* Soft demo */}
        <div>
          <SectionHeader eyebrow="One last thing" title="Walk it through with us — live." />
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.95rem",
              color: "rgba(0,0,0,0.6)",
              margin: "0 0 1.5rem",
              lineHeight: 1.7,
            }}
          >
            Once your numbers are in, we can walk you through what they mean,
            where your gap is widest, and the fastest 3 moves to close it.
            Fifteen minutes. No pitch.
          </p>
          <button
            onClick={() => {
              setCalendlyOpen(true);
              onTrack("demo_book_clicked", {});
            }}
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.85rem 1.75rem",
              background: "#E53E3E",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Book the walkthrough
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* Single case-study quote */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.06)",
            borderLeft: "2px solid #E53E3E",
            padding: "1.5rem 1.75rem",
          }}
        >
          <div
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.4)",
              marginBottom: "0.75rem",
            }}
          >
            {CASE_STUDY_QUOTE.industry} — {CASE_STUDY_QUOTE.client}
          </div>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1rem",
              color: "rgba(0,0,0,0.75)",
              fontStyle: "italic",
              lineHeight: 1.7,
              margin: "0 0 1rem",
            }}
          >
            &ldquo;{CASE_STUDY_QUOTE.quote}&rdquo;
          </p>
          <div
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "0.8rem",
              color: "rgba(0,0,0,0.5)",
              marginBottom: "1rem",
            }}
          >
            — {CASE_STUDY_QUOTE.attribution}
          </div>
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              paddingTop: "0.85rem",
            }}
          >
            <QuoteStat label="Pages before" value={CASE_STUDY_QUOTE.beforePages.toString()} />
            <QuoteStat label="Pages now" value={`${CASE_STUDY_QUOTE.afterPages}+`} accent />
            <QuoteStat label="Mo. revenue" value={CASE_STUDY_QUOTE.monthlyRevenue} accent />
          </div>
        </div>
      </div>

      {/* Article previews */}
      <div
        style={{
          maxWidth: 1100,
          margin: "3rem auto 0",
        }}
      >
        <SectionHeader eyebrow="Keep going" title="Three more reads from the same playbook." />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {ARTICLE_PREVIEWS.map((art) => (
            <Link
              key={art.slug}
              href={`/articles/${art.slug}`}
              onClick={() => onTrack("article_clicked", { slug: art.slug })}
              style={{
                textDecoration: "none",
                display: "block",
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.06)",
                padding: "1.25rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(229,62,62,0.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#E53E3E",
                  marginBottom: "0.5rem",
                }}
              >
                {art.readMin} min read
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#111",
                  margin: "0 0 0.5rem",
                  lineHeight: 1.25,
                }}
              >
                {art.title}
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica Neue, sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {art.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "4rem auto 0",
          textAlign: "center",
          paddingTop: "3rem",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
          }}
        >
          This is just the beginning.{" "}
          <span style={{ color: "#E53E3E" }}>We&apos;re exposing everything.</span>
        </p>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .olg-exit-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </section>
  );
}

function QuoteStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "9px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.4)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Steelfish', 'Impact', sans-serif",
          fontSize: "1.4rem",
          color: accent ? "#E53E3E" : "#111",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticky CTA bar (OLG-specific — scrolls to domain capture, not Calendly)
// ---------------------------------------------------------------------------

function OLGStickyBar({ industryShortName }: { industryShortName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 1.2);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    document
      .getElementById("domain-capture")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(229,62,62,0.18)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#E53E3E",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Steelfish', 'Impact', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            See where your {industryShortName} business stands
          </span>
        </div>
        <button
          onClick={handleClick}
          style={{
            fontFamily: "'Steelfish', 'Impact', sans-serif",
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "10px 22px",
            background: "#E53E3E",
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Enter your domain
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
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function SectionHeader({
  eyebrow,
  title,
  centered,
}: {
  eyebrow: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div
      style={{
        marginBottom: "2rem",
        textAlign: centered ? "center" : "left",
      }}
    >
      <div
        style={{
          width: 40,
          height: 2,
          background: "#E53E3E",
          marginBottom: "1rem",
          marginLeft: centered ? "auto" : 0,
          marginRight: centered ? "auto" : 0,
        }}
        aria-hidden="true"
      />
      <div
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(229,62,62,0.85)",
          marginBottom: "0.6rem",
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
          fontWeight: 400,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#111111",
          margin: 0,
          lineHeight: 1.15,
          maxWidth: centered ? 760 : undefined,
          marginLeft: centered ? "auto" : undefined,
          marginRight: centered ? "auto" : undefined,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

// Helper map (single source of truth for which slugs are valid)
function resolveIndustryMap(): Record<IndustrySlug, true> {
  return {
    "home-services": true,
    "construction-industrial": true,
    "food-hospitality": true,
    "specialty-retail": true,
    "professional-services": true,
    "health-fitness": true,
    "agriculture-outdoors": true,
    other: true,
  };
}
