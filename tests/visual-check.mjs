import assert from 'node:assert/strict';
import fs from 'node:fs';

const styles = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');

assert.match(styles, /@keyframes reveal-up/, 'visual system needs a reveal animation');
assert.match(app, /categoryIcons/, 'category headings need illustrated icons');
assert.doesNotMatch(styles, /\.home-collage\s*\{/, 'home background collage should be disabled');
assert.match(styles, /prefers-reduced-motion/, 'visual system needs reduced-motion support');
assert.match(styles, /\.city-square-visual[^}]*animation:\s*city-art-sway/, 'the three city SVG illustrations should gently sway left to right');
assert.match(styles, /@keyframes city-art-sway/, 'city illustrations need the horizontal sway keyframes');
assert.match(app, /IntersectionObserver/, 'place sections should animate on scroll');
assert.doesNotMatch(app, /collection-number/, 'category headings should not render section numbers');
assert.match(app, /Still Exploring\.\.\./, 'category pages need an exploration footer');
assert.match(styles, /\.place-note[^}]*var\(--handwriting\)/, 'personal notes need the handwriting font');

console.log('Visual interaction checks passed.');
