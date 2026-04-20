import type { Metadata } from "next";
import { Experience } from "./Experience";

const TITLE = "Organic Lead Growth — Exposing Industry Secrets | Rule27 Design";
const DESCRIPTION =
  "See where your business stands against your top local competitors. We pull the numbers, run the gap analysis, and show you what's actually working in your industry — in under 60 minutes.";
const URL =
  "https://www.rule27design.com/capabilities/marketing-command/organic-lead-growth";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: URL,
  },
};

export default function OrganicLeadGrowthPage() {
  return <Experience />;
}
