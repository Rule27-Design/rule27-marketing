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
    role: "Implementation Lead + Weekly Reporting",
    blurb:
      "Josh runs the Phase 2 quality gate - every keyword, every page skeleton, every CSV row passes through him before deployment. He also signs every weekly performance report. If a number reaches you, Josh validated it.",
    superpower:
      "Refuses to ship anything past SERP validation that hasn't been validated.",
    initials: "JA",
    imageSrc: undefined,
  },
  {
    name: "Robert Alchemy",
    role: "Strategy, Architecture + Execution",
    blurb:
      "Alchemy designs the systems - the OLG framework itself, the magnet report engine, the AniltX integration, the campaign architecture. Also owns the build pipeline end to end: research, query strategy, CMS seeding, content generation, deployment cadence.",
    superpower:
      "Builds the engines the rest of the team runs, then runs them too.",
    initials: "RA",
    imageSrc: undefined,
  },
];
