import { readFileSync, statSync, existsSync } from 'node:fs';

const h = readFileSync('index.html', 'utf8');
const count = (re) => (h.match(re) || []).length;

const checks = {
  velinDropdown: count(/velin-dropdown/g),
  velinCombobox: count(/velin-combobox/g),
  velinCommand: count(/velin-command/g),
  velinMenubar: count(/velin-menubar/g),
  velinBottomNav: count(/velin-bottom-nav/g),
  velinLightbox: count(/velin-lightbox/g),
  velinCarousel: count(/velin-carousel/g),
  velinDialog: count(/velin-dialog/g),
  velinSecure: count(/velin-secure-field/g),
  githubInHero: /id="hero"[\s\S]{0,2500}github/i.test(h),
  npmInHero: /id="hero"[\s\S]{0,2500}npm i/i.test(h),
  searchInNav: /expo-nav[\s\S]{0,5000}velin-search/.test(h),
  langAttr: (h.match(/<html[^>]+lang="([^"]+)"/) || [])[1],
  hreflang: h.includes('hreflang'),
  ariaMenu: count(/role="menu"/g),
  expoModalTriggers: count(/data-expo-open="expoModal"/g),
  sectionCount: count(/class="expo-section/g),
  germanQuestions: count(/Wie |Welche |Was |Wann /g),
  englishHeadlines: count(/One framework|Component Expo|Live Playground/g),
  qualityHardcoded: count(/expo-quality/g),
  compareFake: h.includes('expo-compare__pane--foreign'),
  megaNavGroups: count(/expo-nav__group/g),
  componentPanelLinks: count(/id="navComponents"[\s\S]*?<\/div>/) ? 'present' : 'missing',
};

const sizes = {
  cssKb: +(statSync('dist/velinstyle.min.css').size / 1024).toFixed(1),
  iifeKb: +(statSync('dist/velinstyle-components.iife.js').size / 1024).toFixed(1),
  homeCssKb: +(statSync('assets/css/home.css').size / 1024).toFixed(1),
  polishKb: +(statSync('assets/css/home-polish.css').size / 1024).toFixed(1),
  homeJsKb: +(statSync('assets/js/home.js').size / 1024).toFixed(1),
  htmlKb: +(Buffer.byteLength(h) / 1024).toFixed(1),
};

const links = [...h.matchAll(/href="(docs\/[^"#]+)/g)].map((m) => m[1]);
const uniq = [...new Set(links)];
const missing = uniq.filter((l) => !existsSync(l));

console.log(JSON.stringify({ checks, sizes, docLinks: uniq.length, missingDocs: missing }, null, 2));
