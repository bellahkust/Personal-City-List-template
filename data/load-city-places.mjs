import { parsePlacesCsv } from './csv.mjs';

const readPlaces = async (url, fetchCsv, timeoutMs) => {
  const controller = new AbortController();
  let timeout;
  try {
    const response = await Promise.race([
      fetchCsv(url, { cache: 'no-store', signal: controller.signal }),
      new Promise((_, reject) => {
        timeout = globalThis.setTimeout(() => {
          controller.abort();
          reject(new Error(`Place list request timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
    if (!response.ok) throw new Error(`Place list request failed: ${response.status}`);
    const places = parsePlacesCsv(await response.text());
    if (!places.length) throw new Error('Place list CSV is empty or invalid');
    return places;
  } finally {
    globalThis.clearTimeout(timeout);
  }
};

const isHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const placeKey = ({ category, title, titleZh, titleEn }) =>
  `${String(category ?? '').trim().toLocaleLowerCase()}|${String(title ?? titleZh ?? titleEn ?? '').trim().toLocaleLowerCase()}`;

export const loadCityPlaces = async ({ sheetCsv, fallbackCsv }, fetchCsv = globalThis.fetch, timeoutMs = 5000, requiredCategory = '') => {
  for (const url of [sheetCsv, fallbackCsv].filter(Boolean)) {
    try {
      const places = await readPlaces(url, fetchCsv, timeoutMs);
      if (requiredCategory && !places.some((place) => place.category === requiredCategory)) {
        throw new Error(`Place list does not contain the requested category: ${requiredCategory}`);
      }
      if (url === sheetCsv && sheetCsv && fallbackCsv && places.some((place) => !isHttpUrl(place.url))) {
        const fallbackPlaces = await readPlaces(fallbackCsv, fetchCsv, timeoutMs);
        const fallbackByKey = new Map(fallbackPlaces.map((place) => [placeKey(place), place]));
        return places.flatMap((place) => {
          if (isHttpUrl(place.url)) return [place];
          const fallback = fallbackByKey.get(placeKey(place));
          return fallback && isHttpUrl(fallback.url) ? [{ ...place, url: fallback.url }] : [];
        });
      }
      return places;
    } catch {
      // Keep trying the next source; the local CSV is the offline fallback.
    }
  }
  return [];
};
