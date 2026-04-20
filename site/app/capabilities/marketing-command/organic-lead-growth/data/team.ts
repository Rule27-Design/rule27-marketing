export interface TeamMember {
  name: string;
  role: string;
  blurb: string;
  superpower: string;
  initials: string;
  imageSrc?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "Josh Anderson",
    role: "Implementation Lead + Reporting",
    blurb:
      "Josh runs the Phase 2 quality gate — every keyword, every page skeleton, every CSV row passes through him before deployment. He also signs every weekly performance report. If a number reaches you, Josh validated it.",
    superpower: "Refuses to ship anything past the SERP validation gate that hasn't been validated.",
    initials: "JA",
    imageSrc: undefined,
  },
  {
    name: "Robbie",
    role: "Execution + Deployment",
    blurb:
      "Robbie runs the build: research, query strategy, CMS seeding, content generation, deployment cadence. ~71 pages a day, every QA check, every manual GSC submission. The hands-on engine.",
    superpower: "Owns the entire build pipeline from raw keyword to indexed page.",
    initials: "RB",
    imageSrc: undefined,
  },
  {
    name: "Alchemy",
    role: "Strategy + Architecture",
    blurb:
      "Alchemy designs the systems — the OLG framework itself, the magnet report engine, the AniltX integration, the campaign architecture. The why behind the what.",
    superpower: "Builds the engines the rest of the team runs.",
    initials: "AL",
    imageSrc: undefined,
  },
];
