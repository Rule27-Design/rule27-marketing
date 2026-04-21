import type { Metadata } from "next";
import { getTeamMembers } from "@/app/lib/data/team";
import { TeamView } from "./components/TeamView";

export const metadata: Metadata = {
  title: "Our Team | Rule27 Design - Meet the Digital Experts",
  description:
    "Meet the certified professionals who make Rule27 Design the digital powerhouse it is - experts in marketing platforms, cloud development, and everything in between.",
  openGraph: {
    title: "Our Team | Rule27 Design - Meet the Digital Experts",
    description:
      "Meet the certified professionals who make Rule27 Design the digital powerhouse it is.",
    type: "website",
  },
};

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return <TeamView members={teamMembers} />;
}
