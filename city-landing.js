import { siteConfig } from './data/site-config.mjs';

const cityKey = document.body.dataset.cityKey;
const city = siteConfig.cities[cityKey];
if (city) {
  document.title = `${siteConfig.site.title} in ${city.name}`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `${siteConfig.site.title}: a personal map of favorite places in ${city.name}.`;
  const heading = document.querySelector('#page-title');
  if (heading) {
    heading.replaceChildren(document.createTextNode(`${siteConfig.site.title} `));
    const em = document.createElement('em');
    em.textContent = `in ${city.name}`;
    heading.append(document.createElement('br'), em);
  }
  const kicker = document.querySelector('.home-kicker');
  if (kicker) kicker.textContent = `A personal map of ${city.name}`;
  const illustration = document.querySelector('.home-visual img');
  if (illustration) {
    illustration.src = city.illustration;
    illustration.alt = `A city illustration for ${city.name}`;
  }
  const nav = document.querySelector('.section-links');
  if (nav) {
    nav.setAttribute('aria-label', `${city.name} list categories`);
    nav.replaceChildren(...siteConfig.categories.map((category) => {
      const link = document.createElement('a');
      link.textContent = category.label;
      link.href = cityKey === 'hong-kong'
        ? `category.html?category=${category.key}`
        : `city-category.html?city=${cityKey}&category=${category.key}`;
      return link;
    }));
  }
  const back = document.querySelector('.list-back-link');
  if (back) {
    back.textContent = `← ${siteConfig.site.title}`;
    back.setAttribute('aria-label', `Back to ${siteConfig.site.title}`);
  }
}
