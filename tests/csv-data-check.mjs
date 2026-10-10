import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parsePlacesCsv } from '../data/csv.mjs';

const csv = [
  'category,title,title_zh,title_en,area,rating,note,url',
  'Eat Well,Example Cafe,示例咖啡,Example Cafe,Central,4.5,"值得再來的一餐",https://www.google.com/maps/place/example',
].join('\n');

const places = parsePlacesCsv(csv);

assert.deepEqual(places, [{
  category: 'Eat Well',
  title: 'Example Cafe',
  titleZh: '示例咖啡',
  titleEn: 'Example Cafe',
  area: 'Central',
  rating: 4.5,
  note: '值得再來的一餐',
  url: 'https://www.google.com/maps/place/example',
}]);

const { getPlaceTitleParts, getPlaceRatingPresentation } = await import('../data/place-display.mjs');
assert.deepEqual(getPlaceTitleParts({ title: '示例咖啡', titleEn: 'Example Cafe' }), {
  primary: '示例咖啡', secondary: 'Example Cafe',
});
assert.deepEqual(getPlaceTitleParts({ title: 'Example Cafe', titleZh: '示例咖啡' }), {
  primary: '示例咖啡', secondary: 'Example Cafe',
});
assert.deepEqual(getPlaceRatingPresentation(''), {
  value: null, stars: '☆☆☆☆☆', label: '尚未评分',
}, 'missing ratings should keep a visible unrated row');
assert.deepEqual(getPlaceRatingPresentation(4.5), { value: 4.5, stars: '★★★★☆', label: '' });
assert.deepEqual(getPlaceRatingPresentation(4), { value: 4, stars: '★★★★☆', label: '' });
assert.deepEqual(getPlaceRatingPresentation(3.8), { value: 3.8, stars: '★★★☆☆', label: '' });
assert.deepEqual(getPlaceRatingPresentation(5), { value: 5, stars: '★★★★★', label: '' });

for (const city of ['shenzhen', 'guangzhou']) {
  const cityPlaces = parsePlacesCsv(await readFile(new URL(`../data/${city}.csv`, import.meta.url), 'utf8'));
  assert.ok(cityPlaces.length > 0, `${city} fallback CSV should contain places`);
  assert.ok(cityPlaces.every(({ area }) => /^[^,]+, .+ District$/.test(area)), `${city} areas should use City, District format`);
  for (const category of ['Eat Well', 'Drink Well', 'Stay Alone']) {
    assert.ok(cityPlaces.some((place) => place.category === category), `${city} should contain ${category} entries`);
  }
}

console.log('CSV parsing, unrated presentation, and city fallback checks passed.');
