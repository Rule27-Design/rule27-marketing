import type { Metadata } from "next";
import { getServiceZones, getServices } from "@/app/lib/data/services";
import { CapabilitiesView } from "./components/CapabilitiesView";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "From brand strategy to development, discover our comprehensive digital services. Creative studio, marketing command, development lab, and executive advisory.",
  keywords:
    "digital agency services, creative studio, marketing command, development lab, executive advisory, capability assessment, full-stack services, digital transformation",
  openGraph: {
    title: "Capabilities | Rule27 Design - Full-Stack Digital Services",
    description:
      "From brand strategy to development, discover our comprehensive digital services.",
    type: "website",
    url: "https://www.rule27design.com/capabilities",
  },
  alternates: {
    canonical: "https://www.rule27design.com/capabilities",
  },
};

export default async function CapabilitiesPage() {
  const [serviceZones, services] = await Promise.all([
    getServiceZones(),
    getServices(),
  ]);

  return <CapabilitiesView serviceZones={serviceZones} services={services} />;
}
