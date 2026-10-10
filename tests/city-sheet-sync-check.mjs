import assert from 'node:assert/strict';
import fs from 'node:fs';
import { citySheetCsvUrls } from '../data/city-sheet-urls.mjs';

const loaderPath = new URL('../data/load-city-places.mjs', import.meta.url);
const cityPageSource = fs.readFileSync(new URL('../city-category.js', import.meta.url), 'utf8');
assert.ok(fs.existsSync(loaderPath), 'city place loader should support Google Sheets with local CSV fallback');
assert.match(cityPageSource, /site-config\.mjs\?v=1/, 'city category pages should read published Sheet URLs from the central configuration');
assert.match(cityPageSource, /load-city-places\.mjs\?v=2/, 'city category pages should load the resilient Sheet and local CSV reader');
assert.ok(citySheetCsvUrls.shenzhen.startsWith('https://docs.google.com/spreadsheets/'), 'Shenzhen should use its published Google Sheets CSV');
assert.ok(citySheetCsvUrls.guangzhou.startsWith('https://docs.google.com/spreadsheets/'), 'Guangzhou should use its published Google Sheets CSV');

const { loadCityPlaces } = await import(loaderPath.href);
const sheetRow = 'Eat Well,Sheet Cafe,Central,4.5,Fresh from Sheets,https://www.google.com/maps/place/sheet-cafe';
const localRow = 'Eat Well,Local Cafe,Central,4.0,Local backup,https://www.google.com/maps/place/local-cafe';

let called = [];
const sheetPlaces = await loadCityPlaces({ sheetCsv: 'https://sheets.example/published.csv', fallbackCsv: '/data/city.csv' }, async (url) => {
  called.push(url);
  return new Response(`category,title,area,rating,note,url\n${sheetRow}`, { status: 200 });
});
assert.equal(sheetPlaces[0]?.title, 'Sheet Cafe', 'published Sheet data should take priority');
assert.deepEqual(called, ['https://sheets.example/published.csv'], 'successful Sheet reads should use the published data directly');

called = [];
const repairedLinkPlaces = await loadCityPlaces({ sheetCsv: 'https://sheets.example/published.csv', fallbackCsv: '/data/city.csv' }, async (url) => {
  called.push(url);
  if (url.startsWith('https://')) {
    return new Response('category,title,area,rating,note,url\nEat Well,Local Cafe,Central,4.5,Fresh note,Local Cafe', { status: 200 });
  }
  return new Response(`category,title,area,rating,note,url\n${localRow}`, { status: 200 });
});
assert.equal(repairedLinkPlaces[0]?.url, 'https://www.google.com/maps/place/local-cafe', 'invalid live Sheet links should be replaced from the matching local backup row');
assert.equal(repairedLinkPlaces[0]?.rating, 4.5, 'repairing a map link should preserve the live Sheet rating');
assert.deepEqual(called, ['https://sheets.example/published.csv', '/data/city.csv'], 'fallback rows should be consulted only when a live Sheet link is invalid');

called = [];
const fallbackPlaces = await loadCityPlaces({ sheetCsv: 'https://sheets.example/unavailable.csv', fallbackCsv: '/data/city.csv' }, async (url) => {
  called.push(url);
  if (url.startsWith('https://')) return new Response('', { status: 503 });
  return new Response(`category,title,area,rating,note,url\n${localRow}`, { status: 200 });
});
assert.equal(fallbackPlaces[0]?.title, 'Local Cafe', 'failed Sheet reads should return local data');
assert.deepEqual(called, ['https://sheets.example/unavailable.csv', '/data/city.csv'], 'the local fallback should load if the Sheet fails');

called = [];
const localOnlyPlaces = await loadCityPlaces({ sheetCsv: '', fallbackCsv: '/data/city.csv' }, async (url) => {
  called.push(url);
  return new Response(`category,title,area,rating,note,url\n${localRow}`, { status: 200 });
});
assert.equal(localOnlyPlaces[0]?.title, 'Local Cafe', 'an unset Sheet URL should use local data');
assert.deepEqual(called, ['/data/city.csv'], 'an unset Sheet URL should load the local fallback');

called = [];
const missingCategoryFallback = await loadCityPlaces(
  { sheetCsv: 'https://sheets.example/incomplete.csv', fallbackCsv: '/data/city.csv' },
  async (url) => {
    called.push(url);
    if (url.startsWith('https://')) {
      return new Response(`category,title,area,rating,note,url\n${sheetRow}`, { status: 200 });
    }
    return new Response(`category,title,area,rating,note,url\nStay Alone,Quiet Park,Central,,Local backup,https://www.google.com/maps/place/quiet-park`, { status: 200 });
  },
  100,
  'Stay Alone',
);
assert.equal(missingCategoryFallback[0]?.title, 'Quiet Park', 'a Sheet missing the requested category should fall back to the local CSV');
assert.deepEqual(called, ['https://sheets.example/incomplete.csv', '/data/city.csv'], 'the category-specific fallback should try the Sheet and then the local CSV');

called = [];
const timeoutFallbackPlaces = await loadCityPlaces({ sheetCsv: 'https://sheets.example/hanging.csv', fallbackCsv: '/data/city.csv' }, async (url) => {
  called.push(url);
  if (url.startsWith('https://')) return new Promise(() => {});
  return new Response(`category,title,area,rating,note,url\n${localRow}`, { status: 200 });
}, 10);
assert.equal(timeoutFallbackPlaces[0]?.title, 'Local Cafe', 'a hanging Sheet request should time out to the local CSV');
assert.deepEqual(called, ['https://sheets.example/hanging.csv', '/data/city.csv'], 'a hanging Sheet request should time out to the local fallback');

console.log('City Google Sheets sync and fallback checks passed.');
