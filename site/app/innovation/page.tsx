import type { Metadata } from "next";
import InnovationHero from "./components/InnovationHero";
import ExperimentalFeatures from "./components/ExperimentalFeatures";
import TrendAnalysis from "./components/TrendAnalysis";
import ThoughtLeadership from "./components/ThoughtLeadership";
import ResourceHub from "./components/ResourceHub";
import BottomCTA from "./components/BottomCTA";

export const metadata: Metadata = {
  title: "Innovation Lab | Rule27 Design - Where Tomorrow Begins",
  description:
    "Explore cutting-edge tools, AI experiments, and trend analysis. Interactive demos and resources that push the boundaries of digital design.",
  keywords: [
    "innovation lab",
    "experimental features",
    "AI tools",
    "trend analysis",
    "design trends",
    "technology predictions",
    "interactive tools",
    "thought leadership",
  ],
  openGraph: {
    title: "Innovation Lab | Rule27 Design - Where Tomorrow Begins",
    description:
      "Explore cutting-edge tools, AI experiments, and trend analysis. Interactive demos and resources that push the boundaries of digital design.",
    type: "website",
    url: "https://www.rule27design.com/innovation",
  },
  twitter: {
    card: "summary_large_image",
    title: "Innovation Lab | Rule27 Design - Where Tomorrow Begins",
    description:
      "Explore cutting-edge tools, AI experiments, and trend analysis. Interactive demos and resources that push the boundaries of digital design.",
  },
  alternates: {
    canonical: "https://www.rule27design.com/innovation",
  },
};

export default function InnovationPage() {
  return (
    <>
      {/* Hero Section */}
      <InnovationHero />

      {/* Experimental Features */}
      <ExperimentalFeatures />

      {/* Trend Analysis */}
      <TrendAnalysis />

      {/* Thought Leadership */}
      <ThoughtLeadership />

      {/* Resource Hub */}
      <ResourceHub />

      {/* Bottom CTA */}
      <BottomCTA />
    </>
  );
}
