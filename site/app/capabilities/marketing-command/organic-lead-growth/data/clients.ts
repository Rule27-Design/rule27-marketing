import {
  DATA_COMPANIES,
  getCompanyData,
  type CompanyGSCData,
} from "@/app/lib/gsc-data";
import type { IndustrySlug } from "./industries";

/**
 * The showcase reads canonical client data directly from /app/lib/gsc-data/.
 * No per-component synthetic curves, no invented micro-copy, no
 * "real vs mock" distinction - every client here is real.
 *
 * Industry tags map each client to one or more of our industry slugs so the
 * showcase can surface the most relevant clients when an industry is selected.
 */
const INDUSTRY_TAGS: Record<string, IndustrySlug[]> = {
  nmhl: ["health-fitness", "professional-services"],
  freedomdev: ["professional-services", "construction-industrial"],
  solomonsignal: ["professional-services", "specialty-retail"],
  aniltx: ["professional-services", "construction-industrial"],
  ladjinn: ["professional-services"],
};

export interface ClientEntry {
  slug: string;
  data: CompanyGSCData;
  industryTags: IndustrySlug[];
}

function toEntry(slug: string): ClientEntry | null {
  const data = getCompanyData(slug);
  if (!data) return null;
  return { slug, data, industryTags: INDUSTRY_TAGS[slug] ?? [] };
}

/** All clients that have GSC data. Companies without `hasData` are filtered. */
export const CLIENTS: ClientEntry[] = DATA_COMPANIES.map((c) =>
  toEntry(c.slug),
).filter((e): e is ClientEntry => e !== null);

/** Returns clients relevant to an industry, falling back to all clients. */
export function getClientsForIndustry(
  industrySlug: IndustrySlug | null | undefined,
): ClientEntry[] {
  if (!industrySlug || industrySlug === "other") return CLIENTS;
  const matching = CLIENTS.filter((c) =>
    c.industryTags.includes(industrySlug),
  );
  return matching.length >= 3 ? matching : CLIENTS;
}
