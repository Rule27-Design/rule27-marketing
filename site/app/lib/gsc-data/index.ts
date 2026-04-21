// Types
export type {
  GSCDataPoint,
  CompanySummary,
  CompanyMeta,
  CompanyGSCData,
} from "./types";

// Company metadata
export {
  COMPANY_META,
  ALL_COMPANIES,
  DATA_COMPANIES,
  DATA_SLUGS,
} from "./companies";

// Per-company GSC data
export { nmhlData } from "./nmhl";
export { freedomdevData } from "./freedomdev";
export { solomonsignalData } from "./solomonsignal";
export { aniltxData } from "./aniltx";
export { ladjinnData } from "./ladjinn";
export {
  vertexRoofingData,
  harvestTableData,
  ridgebackPowersportsData,
} from "./mocks";

// Lookup by slug
import { nmhlData } from "./nmhl";
import { freedomdevData } from "./freedomdev";
import { solomonsignalData } from "./solomonsignal";
import { aniltxData } from "./aniltx";
import { ladjinnData } from "./ladjinn";
import {
  vertexRoofingData,
  harvestTableData,
  ridgebackPowersportsData,
} from "./mocks";
import type { CompanyGSCData } from "./types";

export const GSC_DATA: Record<string, CompanyGSCData> = {
  nmhl: nmhlData,
  freedomdev: freedomdevData,
  solomonsignal: solomonsignalData,
  aniltx: aniltxData,
  ladjinn: ladjinnData,
  vertexroofing: vertexRoofingData,
  harvesttable: harvestTableData,
  ridgebackpowersports: ridgebackPowersportsData,
};

/** Get company GSC data by slug. Returns undefined for unknown slugs. */
export function getCompanyData(slug: string): CompanyGSCData | undefined {
  return GSC_DATA[slug];
}
