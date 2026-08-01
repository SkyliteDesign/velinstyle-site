import { existsSync, readFileSync } from 'node:fs';

const h = readFileSync('index.html', 'utf8');
const de = existsSync('index.de.html') ? readFileSync('index.de.html', 'utf8') : '';
const js = readFileSync('assets/js/home.js', 'utf8');
const boot = readFileSync('assets/js/expo-boot.mjs', 'utf8');
const build = readFileSync('scripts/build-expo-home.mjs', 'utf8');
const polish = readFileSync('scripts/polish-expo.mjs', 'utf8');
const polishCss = readFileSync('assets/css/home-polish.css', 'utf8');
const homeCss = readFileSync('assets/css/home.css', 'utf8');
const motionCss = existsSync('assets/css/home-motion.css') ? readFileSync('assets/css/home-motion.css', 'utf8') : '';
const v2Css = existsSync('assets/css/home-v2.css') ? readFileSync('assets/css/home-v2.css', 'utf8') : '';

const sectionIds = [...h.matchAll(/<section class="expo-section[^"]*"[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
const expoCore = ['hero', 'playground', 'contracts', 'dashboard', 'tokens', 'animations', 'testing', 'showcase', 'compare', 'install'];
const entryCore = ['facts', 'why', 'diff', 'habits', 'capabilities', 'ai-skills', 'whats-new'];
const core = [...entryCore, ...expoCore];
const removed = ['pages', 'blueprints', 'heroes', 'navigation', 'buttons', 'forms', 'cards', 'tables', 'charts', 'utilities'];
const animTiles = (h.match(/<article class="expo-anim-tile">/g) || []).length;

const trustEn = [...h.matchAll(/expo-hero__trust[\s\S]*?<\/ul>/g)][0]?.[0] || '';
const trustLinks = (trustEn.match(/<a\b[^>]*class="[^"]*expo-trust-badge/g) || []).length;
const trustDe = de ? ([...de.matchAll(/expo-hero__trust[\s\S]*?<\/ul>/g)][0]?.[0] || '') : '';
const trustLinksDe = (trustDe.match(/<a\b[^>]*class="[^"]*expo-trust-badge/g) || []).length;

const revealAttrs = (h.match(/data-expo-(?:reveal|stagger|entry)/g) || []).length;
const revealAttrsDe = (de.match(/data-expo-(?:reveal|stagger|entry)/g) || []).length;

const required = [
  ['hero-def', h.includes('CSS design system with live Web Components')],
  ['hero-trust', trustLinks === 6 && h.includes('aria-label="Framework guarantees"')],
  ['no-a11y-404', !h.includes('docs/a11y.html')],
  ['no-iife-home', !h.includes('velinstyle-components.iife.js')],
  ['expo-boot', boot.includes('../../dist/chunks/runtime-entry.js')],
  ['chunks-entry', existsSync('dist/chunks/runtime-entry.js')],
  ['no-quality-strip', !h.includes('class="expo-quality"') && !h.includes("id=\"expo-quality\"")],
  ['no-fake-compare', !h.includes('fake-btn') && !h.includes('expo-compare__pane--foreign')],
  ['nav-search', h.includes('expo-nav__search')],
  ['mobile-drawer', h.includes('expoSiteNav')],
  // hero + entryCore + expoCore + velin-signature (signature is optional band, not in core[])
  ['core-count', sectionIds.length <= 18 && core.every((id) => sectionIds.includes(id))],
  ['entry-sections', entryCore.every((id) => sectionIds.includes(id))],
  ['removed-gone', removed.every((id) => !sectionIds.includes(id))],
  ['more-galleries', h.includes('id="more-galleries"') && h.includes('id="pattern-galleries"') && de.includes('id="pattern-galleries"')],
  ['no-orphan-forms', !h.includes('Appointment') && !h.includes('expo-form-panel')],
  ['anim-trim', animTiles <= 8 && animTiles >= 6],
  ['no-fake-scores', !h.includes('Review A11y')],
  ['axe-ui', h.includes('id="runAxeTest"') && h.includes('id="axeViolations"')],
  ['axe-js', js.includes('loadAxe') && js.includes('axe.run')],
  ['reduced-motion-tile', h.includes('id="checkReducedMotion"')],
  ['gen-gated-build', build.includes("process.argv.includes('--force')")],
  ['gen-gated-polish', polish.includes("process.argv.includes('--force')")],
  ['scripts-readme', existsSync('scripts/README.md')],
  // Priority C
  ['surface-stages', !polishCss.includes('.expo-section:nth-of-type') && polishCss.includes('[data-surface=')],
  ['sections-surfaced', (h.match(/data-surface="/g) || []).length >= 10],
  ['fair-criteria', h.includes('expo-criteria-table') && h.includes('What we measure')],
  ['no-community-nav', !h.includes('id="navCommunity"')],
  ['community-footer', (h.includes('expo-footer__inner') || h.includes('expo-footer__stage')) && h.includes('forum.birdapi.de')],
  ['impressum', h.includes('https://birdapi.de/impressum')],
  ['dark-default-html', /<html[^>]*data-velin-theme="dark"/.test(h)],
  ['search-cats', h.includes('categories="docs,components,api,examples"')],
  ['search-index-file', existsSync('dist/search-index.json')],
  ['index-de-exists', existsSync('index.de.html')],
  ['hreflang-en', h.includes('hreflang="de"') && h.includes('index.de.html')],
  ['hreflang-de', !!de && de.includes('hreflang="en"') && de.includes('lang="de"')],
  ['hero-trust-de', trustLinksDe === 6 && de.includes('aria-label="Framework-Garantien"')],
  // Entry motion layer
  ['motion-layer', !!motionCss && h.includes('assets/css/home-motion.css') && de.includes('assets/css/home-motion.css')],
  ['hero-fullbleed', homeCss.includes('.expo-main > .expo-hero')],
  ['motion-reduced-safe', motionCss.includes('prefers-reduced-motion: reduce') && motionCss.includes('prefers-reduced-motion: no-preference')],
  ['entry-reveal', revealAttrs >= 10 && revealAttrsDe >= 10],
  ['motion-fallback-js', js.includes('expo-io') && js.includes('IntersectionObserver')],
  // UX polish layer
  ['ux-layer', existsSync('assets/css/home-ux.css') && h.includes('assets/css/home-ux.css') && de.includes('assets/css/home-ux.css')],
  ['lang-switch', h.includes('class="expo-lang"') && h.includes('aria-current="true"') && de.includes('class="expo-lang"')],
  ['cap-groups', h.includes('expo-arch') && (h.match(/expo-arch-panel/g) || []).length >= 5 && (de.match(/expo-arch-panel/g) || []).length >= 5],
  ['gallery-cards', (h.match(/expo-gallery-card/g) || []).length >= 8],
  ['token-inspector', h.includes('expo-token-inspector') && h.includes('id="tokenRadius"') && h.includes('data-token-tab')],
  ['install-terminal', h.includes('id="expoTerminal"') && js.includes('initInstallTerminal')],
  ['footer-widgets', h.includes('expo-footer__stage') && h.includes('id="footerCompCount"')],
  // V2 quality pass
  ['v2-layer', existsSync('assets/css/home-v2.css') && h.includes('assets/css/home-v2.css') && de.includes('assets/css/home-v2.css')],
  ['whats-new', h.includes('id="whats-new"') && h.includes("What's New in VelinStyle 1.2.0") && de.includes('id="whats-new"')],
  ['feature-cards', h.includes('expo-arch') && h.includes('Architecture Map') && de.includes('expo-arch')],
  ['gallery-v2', (h.match(/Open Gallery/g) || []).length >= 8 && ((de.match(/Galerie öffnen/g) || []).length >= 8 || (de.match(/Open Gallery/g) || []).length >= 8)],
  ['showcase-slider', h.includes('expo-showcase-track') && de.includes('expo-showcase-track') && h.includes('data-showcase-filter') && js.includes('data-showcase-filter')],
  ['token-components-col', h.includes('expo-token-lab') && h.includes('data-token-tab') && de.includes('data-token-tab')],
  ['terminal-live', js.includes('livePool') && js.includes('startLiveLoop')],
  ['band-fullbleed', homeCss.includes('.expo-main > .expo-band') && v2Css.includes('data-band=') && (h.match(/class="[^"]*expo-band/g) || []).length >= 5 && (de.match(/class="[^"]*expo-band/g) || []).length >= 5],
  ['final-layer', existsSync('assets/css/home-final.css') && h.includes('assets/css/home-final.css') && de.includes('assets/css/home-final.css')],
  ['quick-install', h.includes('id="quick-install"') && de.includes('id="quick-install"') && h.includes('expo-quick-install')],
];

let missing = 0;
for (const [name, ok] of required) {
  console.log(name, ok ? 'ok' : 'MISSING');
  if (!ok) missing += 1;
}

console.log('sections', sectionIds.join(', '));
console.log('anim tiles', animTiles);
console.log('html bytes', Buffer.byteLength(h));

if (missing) {
  console.error(`FAILED: ${missing} checks missing`);
  process.exit(1);
}
console.log('verify-home: S+A+B+C checks passed');
