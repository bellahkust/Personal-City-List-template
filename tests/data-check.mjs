import assert from 'node:assert/strict';
import { places } from '../data/places.mjs';

const categories = new Set(places.map((place) => place.category));

assert.equal(places.length, 18, 'the MVP should contain 18 exported places');
assert.deepEqual(
  [...categories].sort(),
  ['食餐好嘢', '飲杯先講', '發下吽豆'].sort(),
  'all three MVP categories should be present',
);
assert.ok(places.every((place) => place.title.trim()), 'every place needs a title');
assert.ok(places.every((place) => place.url.startsWith('https://www.google.com/maps/')),
  'every place needs a Google Maps URL');

console.log(`Validated ${places.length} places across ${categories.size} categories.`);
