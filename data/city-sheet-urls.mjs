// Backward-compatible export; edit data/site-config.mjs to change these URLs.
import { siteConfig } from './site-config.mjs';

export const citySheetCsvUrls = Object.freeze(Object.fromEntries(
  Object.entries(siteConfig.cities)
    .filter(([key]) => key !== 'hong-kong')
    .map(([key, city]) => [key, city.sheetCsv]),
));
