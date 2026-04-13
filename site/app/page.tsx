import type { Metadata } from "next";
import { getHomePageData } from "@/app/lib/data/homepage";
import HeroSection from "@/app/(home)/components/HeroSection";
import CaseStudyCarousel from "@/app/(home)/components/CaseStudyCarousel";
import CapabilityZones from "@/app/(home)/components/CapabilityZones";
import InnovationTicker from "@/app/(home)/components/InnovationTicker";
import SocialProofSection from "@/app/(home)/components/SocialProofSection";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title:
    "Rule27 Design \u2014 Digital Powerhouse | Creative + Technical Excellence",
  description:
    "Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders.",
  keywords: [
    "creative agency",
    "digital marketing",
    "web development",
    "brand design",
    "Rule27 Design",
    "premium creative services",
    "innovation",
    "digital transformation",
  ],
  openGraph: {
    title:
      "Rule27 Design \u2014 Digital Powerhouse | Creative + Technical Excellence",
    description:
      "Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders.",
    type: "website",
    url: "https://rule27design.com",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Rule27 Design \u2014 Digital Powerhouse | Creative + Technical Excellence",
    description:
      "Break conventional boundaries with Rule27 Design. We combine creative audacity with technical precision to transform ambitious brands into industry leaders.",
  },
  alternates: {
    canonical: "https://rule27design.com",
  },
};

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function HomePage() {
  const { caseStudies, testimonials, serviceZones, awards, partnerships, stats } =
    await getHomePageData();

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#FCFCFB" }}
    >
      <main>
        {/* Hero */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* Case Studies */}
        <section id="work">
          <CaseStudyCarousel caseStudies={caseStudies} />
        </section>

        {/* Capabilities */}
        <section id="capabilities">
          <CapabilityZones serviceZones={serviceZones} />
        </section>

        {/* Innovation Ticker */}
        <section id="innovation">
          <InnovationTicker />
        </section>

        {/* Social Proof */}
        <section id="social-proof">
          <SocialProofSection
            testimonials={testimonials}
            awards={awards}
            partnerships={partnerships}
            stats={stats}
          />
        </section>
      </main>
    </div>
  );
}
