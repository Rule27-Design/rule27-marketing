import type { Metadata } from "next";
import Link from "next/link";
import { getHomePageData } from "@/app/lib/data/homepage";
import { getTeamMembers } from "@/app/lib/data/team";
import AboutHero from "./components/AboutHero";
import OriginStory from "./components/OriginStory";
import TeamShowcase from "./components/TeamShowcase";
import MethodologySection from "./components/MethodologySection";
import CultureShowcase from "./components/CultureShowcase";
import AwardsSection from "./components/AwardsSection";
import PartnershipEcosystem from "./components/PartnershipEcosystem";

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "About | Rule27 Design - The Rebels Behind Digital Innovation",
  description:
    "Meet the certified experts, discover our methodology, and explore the culture that makes Rule27 Design the digital powerhouse where excellence thrives.",
  openGraph: {
    title: "About | Rule27 Design - The Rebels Behind Digital Innovation",
    description:
      "Meet the certified experts, discover our methodology, and explore the culture that makes Rule27 Design the digital powerhouse where excellence thrives.",
    type: "website",
    url: "https://rule27design.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Rule27 Design - The Rebels Behind Digital Innovation",
    description:
      "Meet the certified experts, discover our methodology, and explore the culture that makes Rule27 Design the digital powerhouse where excellence thrives.",
  },
  alternates: {
    canonical: "https://rule27design.com/about",
  },
};

/* ------------------------------------------------------------------ */
/* Page (Server Component)                                             */
/* ------------------------------------------------------------------ */

export default async function AboutPage() {
  const [{ awards }, teamMembers] = await Promise.all([
    getHomePageData(),
    getTeamMembers(),
  ]);

  return (
    <div
      style={{ background: "#FCFCFB" }}
      className="min-h-screen overflow-x-hidden"
    >
      {/* ============================================================ */}
      {/* 1. HERO                                                      */}
      {/* ============================================================ */}
      <AboutHero />

      {/* ============================================================ */}
      {/* 2. ORIGIN STORY                                              */}
      {/* ============================================================ */}
      <OriginStory />

      {/* ============================================================ */}
      {/* 3. TEAM SHOWCASE                                             */}
      {/* ============================================================ */}
      <TeamShowcase teamMembers={teamMembers} />

      {/* ============================================================ */}
      {/* 4. METHODOLOGY                                               */}
      {/* ============================================================ */}
      <MethodologySection />

      {/* ============================================================ */}
      {/* 5. CULTURE & VALUES + GALLERY + PERKS                        */}
      {/* ============================================================ */}
      <CultureShowcase />

      {/* ============================================================ */}
      {/* 6. AWARDS & RECOGNITION (with Media tab)                     */}
      {/* ============================================================ */}
      <AwardsSection awards={awards} />

      {/* ============================================================ */}
      {/* 7. PARTNERSHIPS (with filtering)                             */}
      {/* ============================================================ */}
      <PartnershipEcosystem />

      {/* ============================================================ */}
      {/* 8. BOTTOM CTA                                                */}
      {/* ============================================================ */}
      <section
        style={{
          background: "#111111",
          padding: "clamp(4rem, 8vw, 6rem) 1.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
          aria-hidden="true"
        />

        {/* gradient glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "50%",
            background:
              "radial-gradient(circle, rgba(229,62,62,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />

        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontFamily:
                "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: "0 0 1rem",
              lineHeight: 0.95,
            }}
          >
            Ready to{" "}
            <span style={{ color: "#E53E3E" }}>Break the Rules</span>?
          </h2>
          <p
            style={{
              fontFamily: "Helvetica Neue, sans-serif",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "0 auto 2rem",
            }}
          >
            Let&apos;s start a conversation about transforming your digital
            presence into something extraordinary.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/contact"
              style={{
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "#E53E3E",
                color: "#FFFFFF",
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 4px 20px rgba(229,62,62,0.35)",
              }}
            >
              Start Your Project
            </Link>
            <Link
              href="/team"
              style={{
                fontFamily:
                  "var(--font-heading, 'Steelfish'), 'Impact', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "transparent",
                color: "#FFFFFF",
                textDecoration: "none",
                display: "inline-block",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
