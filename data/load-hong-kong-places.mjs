import { parsePlacesCsv } from './csv.mjs';

export const loadHongKongPlaces = async ({ sheetCsv, fallbackPlaces }, fetchCsv = globalThis.fetch, timeoutMs = 3500) => {
  const controller = new AbortController();
  let timeout;
  try {
    const remotePlaces = await Promise.race([
      (async () => {
        const response = await fetchCsv(sheetCsv, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error(`CSV request failed: ${response.status}`);
        const places = parsePlacesCsv(await response.text());
        if (!places.length) throw new Error('CSV did not contain any places');
        return places;
      })(),
      new Promise((_, reject) => {
        timeout = globalThis.setTimeout(() => {
          controller.abort();
          reject(new Error(`CSV request timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
    return remotePlaces;
  } catch {
    return fallbackPlaces;
  } finally {
    globalThis.clearTimeout(timeout);
  }
};
