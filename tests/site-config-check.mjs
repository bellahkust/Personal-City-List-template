import assert from 'node:assert/strict';
import fs from 'node:fs';
import { siteConfig } from '../data/site-config.mjs';

assert.equal(siteConfig.site.title, "Bella's List");
assert.equal(siteConfig.site.about.name, 'Bella Tan');
assert.equal(siteConfig.site.home.photo, 'assets/home-personal.jpg');
assert.equal(siteConfig.site.education.length, 2);
assert.deepEqual(siteConfig.categories.map(({ key }) => key), ['food', 'drinks', 'alone']);
assert.deepEqual(Object.keys(siteConfig.cities), ['hong-kong', 'shenzhen', 'guangzhou']);

for (const city of Object.values(siteConfig.cities)) {
  assert.ok(city.name && city.page && city.illustration && city.fallbackCsv);
  assert.ok(fs.existsSync(new URL(`../${city.fallbackCsv}`, import.meta.url)), `${city.name} fallback CSV must exist`);
  assert.ok(fs.existsSync(new URL(`../${city.illustration}`, import.meta.url)), `${city.name} illustration must exist`);
}

console.log('Central site configuration checks passed.');
