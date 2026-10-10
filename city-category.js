import { loadCityPlaces } from './data/load-city-places.mjs?v=2';
import { getPlaceRatingPresentation, getPlaceTitleParts } from './data/place-display.mjs?v=3';
import { siteConfig } from './data/site-config.mjs?v=1';

const cities = siteConfig.cities;
const categories = siteConfig.categories;
const ownerLabel = siteConfig.site.title.replace(/\s+List$/, '');

const params = new URLSearchParams(window.location.search);
const cityKey = params.get('city');
const categoryKey = params.get('category');
const city = cities[cityKey];
const category = categories.find((item) => item.key === categoryKey);

if (!city || !category) {
  window.location.replace(city ? city.page : 'index.html');
} else {
  document.title = `${category.label} · ${siteConfig.site.title} in ${city.name}`;
  document.documentElement.lang = 'en';
  document.body.classList.add('page-ready');

  const backLink = document.querySelector('.category-back-link');
  backLink.href = city.page;
  backLink.textContent = `← ${ownerLabel} ${city.name} List`;
  backLink.setAttribute('aria-label', `Back to ${ownerLabel} ${city.name} List`);

  const makePlaceCard = ({ title, titleZh, titleEn, area, rating, note, url }) => {
    const card = document.createElement('a');
    card.className = 'place-tag';
    card.href = url;
    card.target = '_blank';
    card.rel = 'noreferrer';

    const titleParts = getPlaceTitleParts({ title, titleZh, titleEn });
    const heading = document.createElement('h3');
    heading.textContent = titleParts.primary;
    card.append(heading);
    if (titleParts.secondary) {
      const secondaryTitle = document.createElement('p');
      secondaryTitle.className = 'place-title-secondary';
      secondaryTitle.textContent = titleParts.secondary;
      card.append(secondaryTitle);
    }

    if (area) {
      const location = document.createElement('p');
      location.className = 'place-area';
      location.textContent = area;
      card.append(location);
    }

    const ratingPresentation = getPlaceRatingPresentation(rating);
    const ratingLine = document.createElement('p');
    ratingLine.className = 'place-rating';
    const starLabel = document.createElement('span');
    starLabel.setAttribute('aria-hidden', 'true');
    starLabel.textContent = ratingPresentation.stars;
    ratingLine.append(starLabel);
    if (ratingPresentation.value === null) {
      const pending = document.createElement('small');
      pending.textContent = ` ${ratingPresentation.label}`;
      ratingLine.append(pending);
    } else {
      ratingLine.setAttribute('aria-label', `Rated ${ratingPresentation.value} out of 5 stars`);
    }
    card.append(ratingLine);

    if (note) {
      const noteLine = document.createElement('p');
      noteLine.className = 'place-note';
      noteLine.textContent = note;
      card.append(noteLine);
    }

    const arrow = document.createElement('span');
    arrow.className = 'place-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    card.append(arrow);
    return card;
  };

  const render = async () => {
    const places = (await loadCityPlaces(city, globalThis.fetch, 1500, category.label))
      .filter((item) => item.category === category.label);
    const section = document.createElement('section');
    section.className = 'collection reveal-on-scroll';
    section.id = `${cityKey}-${category.key}`;
    section.setAttribute('aria-labelledby', 'city-category-title');

    const header = document.createElement('div');
    header.className = 'collection-heading';
    const headingContent = document.createElement('div');
    headingContent.className = 'category-heading-content';
    const icon = document.createElement('img');
    icon.className = 'category-icon';
    icon.src = category.icon;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    const heading = document.createElement('h2');
    heading.id = 'city-category-title';
    heading.textContent = category.label;
    headingContent.append(icon, heading);
    header.append(headingContent);
    section.append(header);

    const grid = document.createElement('div');
    grid.className = 'place-grid';
    places.forEach((place, index) => {
      const card = makePlaceCard(place);
      card.classList.add('reveal-on-scroll');
      card.style.setProperty('--reveal-delay', `${index * 70}ms`);
      grid.append(card);
    });
    if (!places.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'city-empty-card';
      const label = document.createElement('span');
      label.textContent = `${city.name} · ${category.label}`;
      const message = document.createElement('p');
      message.textContent = 'Your saved places will appear here.';
      emptyState.append(label, message);
      grid.append(emptyState);
    }
    section.append(grid);

    const exploring = document.createElement('p');
    exploring.className = 'exploring';
    exploring.textContent = 'Still Exploring...';
    section.append(exploring);
    document.querySelector('#collections').append(section);

    const revealItems = [section, ...section.querySelectorAll('.reveal-on-scroll')];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealItems.forEach((item) => {
        item.classList.add('is-visible');
        observer.observe(item);
      });
    } else {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }
  };

  render();
}
