import { places as fallbackPlaces } from './data/places.mjs?v=6';
import { loadHongKongPlaces } from './data/load-hong-kong-places.mjs?v=1';
import { getPlaceRatingPresentation } from './data/place-display.mjs?v=3';
import { siteConfig } from './data/site-config.mjs?v=1';
import { matchesHongKongCategory } from './data/hong-kong-categories.mjs?v=1';

const hongKong = siteConfig.cities['hong-kong'];
const collectionMeta = siteConfig.categories.map(({ key, sheetValue, label, icon }) => ({ key, category: sheetValue, english: label, icon }));

const queryCategory = new URLSearchParams(window.location.search).get('category');
const places = await loadHongKongPlaces({ sheetCsv: hongKong.sheetCsv, fallbackPlaces });
const collections = document.querySelector('#collections');
const areaTranslations = hongKong.areaOverrides || {};
const titleTranslations = hongKong.titleOverrides || {};
const categoryIcons = Object.fromEntries(siteConfig.categories.map(({ key, icon }) => [key, icon]));
const localizedCategory = (meta) => meta.english;
const localizedTitle = (title) => titleTranslations[title] || title;
const localizedArea = (area) => areaTranslations[area] || area;

document.body.classList.add('page-ready');
document.documentElement.lang = 'en';
const backLink = document.querySelector('.back-link');
const ownerLabel = siteConfig.site.title.replace(/\s+List$/, '');
if (backLink) backLink.textContent = `← ${ownerLabel} ${hongKong.name} List`;

const slugify = (value) => value
  .normalize('NFKD')
  .replace(/[^\w\s-]/g, '')
  .trim()
  .toLowerCase()
  .replace(/[\s_-]+/g, '-');

const createPlaceTag = ({ title, area, rating, note, url }) => {
  const tag = document.createElement('a');
  tag.className = 'place-tag';
  tag.href = url;
  tag.target = '_blank';
  tag.rel = 'noreferrer';

  const titleElement = document.createElement('h3');
  titleElement.textContent = localizedTitle(title);
  tag.append(titleElement);

  if (area) {
    const areaElement = document.createElement('p');
    areaElement.className = 'place-area';
    areaElement.textContent = localizedArea(area);
    tag.append(areaElement);
  }

  const ratingElement = document.createElement('p');
  ratingElement.className = 'place-rating';
  const ratingPresentation = getPlaceRatingPresentation(rating);
  const stars = document.createElement('span');
  stars.setAttribute('aria-hidden', 'true');
  stars.textContent = ratingPresentation.stars;
  ratingElement.append(stars);
  if (ratingPresentation.value === null) {
    const pending = document.createElement('small');
    pending.textContent = ` ${ratingPresentation.label}`;
    ratingElement.append(pending);
  } else {
    ratingElement.setAttribute('aria-label', `Rated ${ratingPresentation.value} out of 5 stars`);
  }
  tag.append(ratingElement);

  if (note) {
    const noteElement = document.createElement('p');
    noteElement.className = 'place-note';
    noteElement.textContent = note;
    tag.append(noteElement);
  }

  const arrow = document.createElement('span');
  arrow.className = 'place-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  tag.append(arrow);

  return tag;
};

const isCategoryPage = Boolean(document.querySelector('.category-page'));
const isHongKongPage = Boolean(document.querySelector('.intro-home'));
const visibleCollections = isCategoryPage
  ? collectionMeta.filter((meta) => meta.key === queryCategory)
  : isHongKongPage
    ? collectionMeta
    : [];

if (isCategoryPage && visibleCollections.length === 0) {
  window.location.replace('index.html');
}

if (isCategoryPage && visibleCollections.length === 1) {
  document.title = `${localizedCategory(visibleCollections[0])}｜Bella's List in Hong Kong`;
}

visibleCollections.forEach((meta, index) => {
  const id = `${index + 1}-${slugify(meta.category)}`;
  const collectionPlaces = places.filter((place) =>
    [meta.sheetValue, meta.english].includes(String(place.category ?? '').trim())
      || matchesHongKongCategory(place.category, meta.key));

  const section = document.createElement('section');
  section.className = 'collection reveal-on-scroll';
  section.id = id;

  const heading = document.createElement('div');
  heading.className = 'collection-heading';
  heading.innerHTML = `<div class="category-heading-content"><img class="category-icon" src="${categoryIcons[meta.key]}" alt="" aria-hidden="true" /><h2>${localizedCategory(meta)}</h2></div>`;
  section.append(heading);

  const grid = document.createElement('div');
  grid.className = 'place-grid';
  collectionPlaces.forEach((place, placeIndex) => {
    const tag = createPlaceTag(place);
    tag.classList.add('reveal-on-scroll');
    tag.style.setProperty('--reveal-delay', `${placeIndex * 70}ms`);
    grid.append(tag);
  });
  section.append(grid);
  const exploring = document.createElement('p');
  exploring.className = 'exploring';
  exploring.textContent = 'Still Exploring...';
  section.append(exploring);
  collections.append(section);
});

const revealItems = document.querySelectorAll('.reveal-on-scroll');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
