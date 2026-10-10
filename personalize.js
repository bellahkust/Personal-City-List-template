import { siteConfig } from './data/site-config.mjs';

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value !== undefined && value !== null) element.textContent = value;
  return element;
};

const setImage = (selector, src, alt) => {
  const image = document.querySelector(selector);
  if (!image) return;
  if (src) image.src = src;
  else image.remove();
  if (alt) image.alt = alt;
};

const setDescription = (content) => {
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = content;
};

if (document.body.dataset.sitePage === 'home') {
  const { site } = siteConfig;
  document.title = site.title;
  setDescription(site.home.kicker);
  setText('.home-kicker', site.home.kicker);
  setText('#page-title', site.title);
  const marquee = document.querySelector('.site-home-marquee-copy');
  if (marquee) {
    marquee.replaceChildren(...site.home.lines.map((line) => {
      const span = document.createElement('span');
      span.textContent = line;
      return span;
    }));
    const signoff = document.createElement('span');
    signoff.className = 'home-marquee-signoff';
    signoff.append(document.createTextNode(site.home.signoff));
    const smile = document.createElement('span');
    smile.className = 'home-marquee-smile';
    smile.setAttribute('role', 'img');
    smile.setAttribute('aria-label', 'laughing face');
    smile.textContent = '😄';
    signoff.append(smile);
    marquee.append(signoff);
  }
  setImage('.home-photo-slot img', site.home.photo, site.home.photoAlt);
  const marqueeLabel = document.querySelector('.site-home-marquee');
  if (marqueeLabel) marqueeLabel.setAttribute('aria-label', [...site.home.lines, site.home.signoff].join('. '));
  document.querySelectorAll('[data-city-nav]').forEach((link) => {
    const city = siteConfig.cities[link.dataset.cityNav];
    if (city) {
      link.href = city.page;
      link.textContent = `${city.name} List`;
    }
  });
} else if (document.body.dataset.sitePage === 'about') {
  const { site } = siteConfig;
  document.title = `About Me — ${site.title}`;
  setDescription(`${site.about.name} — ${site.about.introduction}`);
  setText('#about-title', site.about.name);
  const lede = document.querySelector('.editorial-lede');
  if (lede) lede.replaceChildren(...site.about.introduction.split(/\s+/).map((word, index, words) => {
    const span = document.createElement('span');
    span.textContent = word;
    if (index < words.length - 1) span.append(document.createTextNode(' '));
    return span;
  }));
  const slogan = document.querySelector('.about-slogan');
  if (slogan) {
    const smileText = site.about.slogan[1].match(/^(.*?)([☺☻😊🙂😄])$/u);
    slogan.replaceChildren(document.createTextNode(site.about.slogan[0]), document.createElement('br'));
    if (smileText) {
      slogan.append(document.createTextNode(`${smileText[1]} `));
      const smile = document.createElement('span');
      smile.setAttribute('role', 'img');
      smile.setAttribute('aria-label', 'smiling face');
      smile.textContent = smileText[2];
      slogan.append(smile);
    } else slogan.append(document.createTextNode(site.about.slogan[1]));
  }
  setText('#education-title', site.about.educationHeading);
  setImage('.portrait-photo', site.about.photo, site.about.photoAlt);

  const timeline = document.querySelector('.education-timeline');
  if (timeline) {
    timeline.replaceChildren(...site.education.map((entry) => {
      const article = document.createElement('article');
      article.className = 'education-item';
      const marker = document.createElement('div');
      marker.className = 'education-marker';
      marker.setAttribute('aria-hidden', 'true');
      const details = document.createElement('div');
      details.className = 'education-details';
      for (const [tag, className, value] of [
        ['p', 'education-period', entry.period], ['h3', '', entry.institution],
        ['p', 'education-location', entry.location], ['p', 'education-program', entry.program],
      ]) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        element.textContent = value;
        details.append(element);
      }
      article.append(marker, details);
      if (entry.photo) {
        const image = document.createElement('img');
        image.className = 'education-photo';
        image.src = entry.photo;
        image.alt = entry.photoAlt || `${entry.institution} photo`;
        article.append(image);
      }
      return article;
    }));
  }
}
