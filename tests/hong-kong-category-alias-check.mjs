import assert from 'node:assert/strict';
import fs from 'node:fs';

const appSource = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(appSource, /matchesHongKongCategory/, 'Hong Kong place filtering should preserve legacy category aliases');
assert.match(appSource, /meta\.sheetValue/, 'Hong Kong place filtering should use configured Sheet category labels');

const { matchesHongKongCategory } = await import('../data/hong-kong-categories.mjs');
for (const [key, chinese, english] of [
  ['food', '食餐好嘢', 'Eat Well'],
  ['drinks', '飲杯先講', 'Drink Well'],
  ['alone', '發下吽豆', 'Stay Alone'],
]) {
  assert.equal(matchesHongKongCategory(chinese, key), true, `${key} should continue to accept existing local data`);
  assert.equal(matchesHongKongCategory(english, key), true, `${key} should accept the new sheet label`);
  assert.equal(matchesHongKongCategory('Other', key), false, `${key} should not accept another category`);
}

console.log('Hong Kong category label checks passed.');

const { loadHongKongPlaces } = await import('../data/load-hong-kong-places.mjs');
const fallbackPlaces = [{ category: 'Eat Well', title: 'Local Cafe', area: '', rating: null, note: '', url: 'https://maps.example/local-cafe' }];
const places = await loadHongKongPlaces({ sheetCsv: 'https://sheets.example/hanging.csv', fallbackPlaces }, () => new Promise(() => {}), 10);
assert.deepEqual(places, fallbackPlaces, 'a hanging Google Sheets request should time out and render local Hong Kong places');
