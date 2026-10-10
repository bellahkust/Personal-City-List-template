import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parsePlacesCsv } from '../data/csv.mjs';
import { siteConfig } from '../data/site-config.mjs';

const pages = {
  'hong-kong.html': ['category.html?category=food', 'category.html?category=drinks', 'category.html?category=alone'],
  'shenzhen.html': ['city-category.html?city=shenzhen&amp;category=food', 'city-category.html?city=shenzhen&amp;category=drinks', 'city-category.html?city=shenzhen&amp;category=alone'],
  'guangzhou.html': ['city-category.html?city=guangzhou&amp;category=food', 'city-category.html?city=guangzhou&amp;category=drinks', 'city-category.html?city=guangzhou&amp;category=alone'],
};

for (const [file, routes] of Object.entries(pages)) {
  const html = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  for (const route of routes) {
    assert.ok(html.includes(`href="${route}"`), `${file} should expose ${route} as a static category link`);
  }
}

const categoryScript = fs.readFileSync(new URL('../city-category.js', import.meta.url), 'utf8');
const appScript = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const landingScript = fs.readFileSync(new URL('../city-landing.js', import.meta.url), 'utf8');
const cityCategoryHtml = fs.readFileSync(new URL('../city-category.html', import.meta.url), 'utf8');
const hongKongCategoryHtml = fs.readFileSync(new URL('../category.html', import.meta.url), 'utf8');
assert.match(cityCategoryHtml, /new URLSearchParams\(window\.location\.search\)/, 'city category pages should set their return link from the city query before modules run');
assert.ok(cityCategoryHtml.indexOf('class="category-back-link"') < cityCategoryHtml.indexOf('new URLSearchParams'), 'the static return-link script should run after the link exists');
assert.match(cityCategoryHtml, /Bella's \$\{cityName\} List/, 'city category return labels should consistently name Shenzhen or Guangzhou');
assert.match(cityCategoryHtml, /window\.location\.protocol === 'file:'/ , 'file previews should explain why dynamic place cards cannot load');
assert.match(hongKongCategoryHtml, /Bella's Hong Kong List/, 'Hong Kong category return labels should use the same city-list naming pattern');
assert.match(categoryScript, /item\.category === category\.label/, 'city category routes should show only their matching places');
assert.match(categoryScript, /loadCityPlaces\(city, globalThis\.fetch, 1500, category\.label\)/, 'city category pages should reach local backup data quickly when the Sheet is slow');
assert.match(categoryScript, /city\.page/, 'city category pages should link back to their own city list');
assert.match(categoryScript, /\[section, \.\.\.section\.querySelectorAll\('\.reveal-on-scroll'\)\]/, 'city category containers as well as cards should become visible after rendering');
assert.match(categoryScript, /card\.append\(ratingLine\)/, 'city cards should always keep a rating row, including when unrated');
assert.match(categoryScript, /ratingPresentation\.value === null[\s\S]*ratingPresentation\.label/, 'unrated city cards should display the pending rating label');
assert.doesNotMatch(categoryScript, /ratingPresentation\.label \}\} \$\{ratingPresentation\.value\.toFixed/, 'rated city cards should not show a My rating label or numeric score beside the stars');
assert.match(categoryScript, /titleParts\.secondary/, 'city cards should support a secondary English name below a local Chinese title');
assert.match(categoryScript, /siteConfig\.cities/, 'city category routes should read city settings from the central config');
assert.match(appScript, /siteConfig\.cities\['hong-kong'\]/, 'Hong Kong list should read its settings from the central config');
assert.match(landingScript, /siteConfig\.cities/, 'city landing pages should read city settings from the central config');
assert.match(cityCategoryHtml, /siteConfig|city-category\.js/, 'city category routes should load the shared renderer');
assert.equal(siteConfig.cities.shenzhen.fallbackCsv, 'data/shenzhen.csv', 'Shenzhen should retain its local CSV fallback');
assert.equal(siteConfig.cities.guangzhou.fallbackCsv, 'data/guangzhou.csv', 'Guangzhou should retain its local CSV fallback');

for (const [city, expectedCount] of [['shenzhen', 11], ['guangzhou', 18]]) {
  const csv = fs.readFileSync(new URL(`../data/${city}.csv`, import.meta.url), 'utf8');
  const places = parsePlacesCsv(csv);
  assert.equal(places.length, expectedCount, `${city} should display every imported Takeout place`);
  assert.deepEqual(
    [...new Set(places.map((place) => place.category))].sort(),
    ['Drink Well', 'Eat Well', 'Stay Alone'],
    `${city} should have all three independent categories`,
  );
  assert.ok(places.every((place) => place.title.trim() && place.url.startsWith('https://www.google.com/maps/')),
    `${city} places should have a name and Google Maps link`);
  for (const category of ['Eat Well', 'Drink Well', 'Stay Alone']) {
    assert.ok(places.some((place) => place.category === category), `${city} ${category} route should have places to display`);
  }
}

const homeHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const aboutHtml = fs.readFileSync(new URL('../about.html', import.meta.url), 'utf8');
assert.match(homeHtml, /data-site-page="home"/, 'homepage should declare its config rendering hook');
assert.match(aboutHtml, /data-site-page="about"/, 'About Me should declare its config rendering hook');

console.log('City pages and imported place checks passed.');
