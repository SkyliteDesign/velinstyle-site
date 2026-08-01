/**
 * Apply Priority-S release blockers to the Component Expo homepage.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');

const A11Y = 'docs/getting-started/accessibility.html';
const A11Y_CONTRACTS = `${A11Y}#contracts`;

// ─── S2: fix broken a11y docs links ───
html = html.replaceAll('docs/a11y.html#contracts', A11Y_CONTRACTS);
html = html.replaceAll('href="docs/a11y.html"', `href="${A11Y}"`);

// ─── S6: remove hardcoded quality badge strips ───
html = html.replace(
  /\n\s*<ul class="expo-quality" aria-label="Quality status">[\s\S]*?<\/ul>/g,
  '\n      <p class="expo-measure-note"><a href="#testing">Quality claims are measured in the Test Center</a> — not asserted here.</p>',
);

// ─── S1: Hero definition + install + GitHub ───
const heroOld = `      <div class="expo-hero__copy">
        <p class="expo-kicker">Component Expo</p>
        <h1 id="hero-title">One framework. Every surface. Live.</h1>
        <p>38 Web Components, 27 attribute bridges, tokens, utilities, themes — clickable, filterable, themeable. The page is the demo.</p>
        <div class="expo-hero__actions">
          <a class="velin-btn velin-btn--primary" href="#playground">Open Live Playground</a>
          <a class="velin-btn velin-btn--outline" href="#buttons">Browse galleries</a>
          <a class="velin-btn velin-btn--ghost" href="docs/getting-started/introduction.html">Docs</a>
        </div>
        <div class="expo-hero__stats" aria-label="Framework facts">
          <span class="velin-badge velin-badge--primary">38 components</span>
          <span class="velin-badge">40 loaders</span>
          <span class="velin-badge">27 attributes</span>
          <span class="velin-badge">13 themes</span>
          <span class="velin-badge velin-badge--success">WCAG 2.2 AAA-oriented</span>
        </div>
      </div>`;

const heroNew = `      <div class="expo-hero__copy">
        <p class="expo-kicker">Accessibility-first CSS + Web Components</p>
        <h1 id="hero-title">VelinStyle is an accessibility-first CSS design system with live Web Components.</h1>
        <p>OKLCH tokens, utilities, themes, and 38 custom elements — boot only what the DOM needs. This page is the demo.</p>
        <div class="expo-install-cmd expo-hero__install" aria-label="Install command">
          <code>npm i @birdapi/velinstyle@1.2.0</code>
          <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-copy="npm i @birdapi/velinstyle@1.2.0">Copy</button>
        </div>
        <div class="expo-hero__actions">
          <a class="velin-btn velin-btn--primary" href="docs/getting-started/introduction.html">Read Docs</a>
          <a class="velin-btn velin-btn--outline" href="#playground">Live Demo</a>
          <a class="velin-btn velin-btn--ghost" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a class="velin-btn velin-btn--ghost" href="#install">Install</a>
        </div>
        <div class="expo-hero__stats" aria-label="Framework facts">
          <span class="velin-badge velin-badge--primary">38 components</span>
          <span class="velin-badge">40 loaders</span>
          <span class="velin-badge">27 attributes</span>
          <span class="velin-badge">13 themes</span>
          <span class="velin-badge velin-badge--success">WCAG 2.2 AAA-oriented</span>
        </div>
      </div>`;

if (!html.includes(heroOld)) {
  console.warn('WARN: hero block not found exactly — attempting partial hero replace');
  html = html.replace(
    /<h1 id="hero-title">[\s\S]*?<\/h1>/,
    '<h1 id="hero-title">VelinStyle is an accessibility-first CSS design system with live Web Components.</h1>',
  );
} else {
  html = html.replace(heroOld, heroNew);
}

html = html.replace(
  '<p class="expo-kicker">Component Expo</p>',
  '<p class="expo-kicker">Accessibility-first CSS + Web Components</p>',
);

// ─── S4: unify locale to English ───
const localeMap = [
  ['Wie steuert man ein ganzes UI mit Tokens?', 'How do tokens drive an entire UI surface?'],
  ['Theme, density, radius und spacing ändern dieselbe echte Oberfläche. Labels, Fokus und Kontrakt bleiben erhalten.', 'Theme, density, radius, and spacing reshape the same live surface. Labels, focus, and contracts stay intact.'],
  ['Was ist neu in Core + Design Intelligence?', 'What is new in Core + Design Intelligence?'],
  ['Welche Seitentypen kennt das System?', 'Which page types does the system know?'],
  ['Welche Sections kann man kombiniert rendern?', 'Which sections can you compose together?'],
  ['Wann welcher Hero sinnvoll ist?', 'When is each hero pattern the right choice?'],
  ['12 Layouts mit Use Case, Live Preview, Mobile, Dark, A11y, Komponenten und Utilities.', '12 layouts with use case, live preview, mobile, dark, a11y, components, and utilities.'],
  ['Playground öffnen', 'Open playground'],
  ['Welche Navigation passt zu welchem Produkt?', 'Which navigation fits which product?'],
  ['Keyboard: Tab durch Links, Esc schließt Drawer/Sheet, aria-current markiert aktive Seite.', 'Keyboard: Tab through links, Esc closes drawer/sheet, aria-current marks the active page.'],
  ['Wie sehen Buttons aus?', 'What do the button variants look like?'],
  ['20 echte Varianten. States, Größen, Icons, Danger, Ghost, Loading, Disabled.', '20 real variants. States, sizes, icons, danger, ghost, loading, disabled.'],
  ['Wie sehen komplette Form-Workflows aus?', 'What do complete form workflows look like?'],
  ['Wie sehen Cards aus?', 'What do the card patterns look like?'],
  ['Wie sehen Data Tables aus?', 'What do data tables look like?'],
  ['velin-data-table mit Sort, Filter, Pagination und Empty State — live, nicht als Screenshot.', 'velin-data-table with sort, filter, pagination, and empty state — live, not a screenshot.'],
  ['Wann welche Overlay-Komponente?', 'When should you use each overlay component?'],
  ['Kurz: Zweck, Wann / Wann nicht, Keyboard, ARIA, API — dann Live-Demo.', 'Purpose, when / when not, keyboard, ARIA, API — then the live demo.'],
  ['Wie sehen Charts und KPIs aus?', 'What do charts and KPIs look like?'],
  ['Wie sieht ein echtes Dashboard aus?', 'What does a real dashboard look like?'],
  ['Wie wirken Utilities live auf Layout und State?', 'How do utilities affect layout and state live?'],
  ['Wie verändert sich dieselbe Oberfläche mit Tokens?', 'How does the same surface change with tokens?'],
  ['Welche Motion-Patterns kann man live testen?', 'Which motion patterns can you test live?'],
  ['Kann man Accessibility live prüfen?', 'Can you verify accessibility live?'],
  ['Keyboard, Focus, ARIA, RTL, Responsive, Dark/Light, Reduced Motion, High Contrast — alles anklickbar.', 'Keyboard, focus, ARIA, RTL, responsive, dark/light, reduced motion, high contrast — all clickable.'],
  ['Welche echten Projekte laufen auf VelinStyle?', 'Which real projects run on VelinStyle?'],
  ['Screenshot, Branche, Komponenten, Utilities, Themes, Responsive, Dark, A11y, Live Demo, Code, Case Study.', 'Screenshot, industry, components, utilities, themes, responsive, dark, a11y, live demo, code, case study.'],
  ['Wie startet man mit VelinStyle 1.2.0?', 'How do you start with VelinStyle 1.2.0?'],
  ['npm pin, CDN, Runtime-Exports, Docs, Playground, Source — Copy und weiter.', 'npm pin, CDN, runtime exports, docs, playground, source — copy and ship.'],
];

for (const [from, to] of localeMap) {
  if (!html.includes(from)) console.warn('locale miss:', from.slice(0, 48));
  html = html.replaceAll(from, to);
}

html = html.replace(
  '"inLanguage":["en","de"]}',
  '"inLanguage":"en"}',
);

html = html.replace(
  '<meta name="description" content="VelinStyle 1.2.0 live Component Expo — buttons, forms, navigation, dashboards, tokens, utilities, and accessibility tests as real components.">',
  '<meta name="description" content="VelinStyle is an accessibility-first CSS design system with live Web Components — tokens, utilities, themes, and component galleries.">',
);

// ─── S5: replace fake competitor compare ───
const compareRe = /<section class="expo-section" id="compare"[\s\S]*?<\/section>/;
const compareNew = `<section class="expo-section" id="compare" aria-labelledby="compare-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Honest positioning</p>
        <h2 id="compare-title">What VelinStyle ships — and what it does not claim</h2>
        <p>No fake Bootstrap/Tailwind/Shoelace skins. Measurable product facts only.</p>
      </header>
      <div class="expo-compare expo-compare--honest">
        <div class="expo-compare__pane">
          <h3>Ships today</h3>
          <ul class="expo-honest-list">
            <li>CSS design system with OKLCH tokens + themes</li>
            <li>38 Web Components with a11y contracts</li>
            <li>Tree-shakeable runtime (<code>bootFromDOM</code>)</li>
            <li>Utilities, attributes, CLI, scanner, AI metadata</li>
          </ul>
        </div>
        <div class="expo-compare__pane">
          <h3>Does not claim</h3>
          <ul class="expo-honest-list">
            <li>Drop-in Bootstrap class compatibility</li>
            <li>Tailwind-scale variant engine / JIT ecosystem</li>
            <li>Shoelace-level component API maturity everywhere</li>
            <li>Parity with every competitor control out of the box</li>
          </ul>
        </div>
      </div>
      <table class="velin-table expo-honest-table" aria-label="Capability matrix">
        <thead>
          <tr><th>Capability</th><th>Status</th><th>Proof on this page</th></tr>
        </thead>
        <tbody>
          <tr><td>Live Web Components</td><td>Shipped</td><td><a href="#playground">Playground</a>, galleries</td></tr>
          <tr><td>Token-driven theming</td><td>Shipped</td><td><a href="#tokens">Token Lab</a></td></tr>
          <tr><td>Selective component boot</td><td>Shipped</td><td>ESM chunks via <code>bootFromDOM</code></td></tr>
          <tr><td>Competitor pixel clones</td><td>Not claimed</td><td>Removed — use real docs, not sketches</td></tr>
        </tbody>
      </table>
      <footer class="expo-links">
        <a class="velin-btn velin-btn--outline velin-btn--sm" href="docs/getting-started/introduction.html">Docs</a>
        <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/extend/javascript-api.html">API</a>
        <a class="velin-btn velin-btn--ghost velin-btn--sm" href="${A11Y}">Accessibility</a>
        <a class="velin-btn velin-btn--ghost velin-btn--sm" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </section>`;

if (!compareRe.test(html)) console.warn('WARN: compare section not found');
html = html.replace(compareRe, compareNew);

// Nav label for compare
html = html.replaceAll('>Compare</a>', '>Positioning</a>');
html = html.replace('<option value="#compare">Compare</option>', '<option value="#compare">Positioning</option>');

// ─── S3: selective ESM boot instead of full IIFE ───
html = html.replace(
  '<script src="assets/js/home.js"></script>\n  <script src="dist/velinstyle-components.iife.js"></script>',
  '<script src="assets/js/home.js"></script>\n  <script type="module" src="assets/js/expo-boot.mjs"></script>',
);

writeFileSync(htmlPath, html);

// Sync clean chunks into site dist
const fwChunks = join(root, '..', 'velinstyle', 'dist', 'chunks');
const siteChunks = join(root, 'dist', 'chunks');
if (!existsSync(join(fwChunks, 'runtime-entry.js'))) {
  throw new Error('Missing framework dist/chunks/runtime-entry.js — run npm run build:js:chunks');
}
if (existsSync(siteChunks)) rmSync(siteChunks, { recursive: true, force: true });
mkdirSync(siteChunks, { recursive: true });
for (const name of readdirSync(fwChunks)) {
  copyFileSync(join(fwChunks, name), join(siteChunks, name));
}

const entry = join(siteChunks, 'runtime-entry.js');
const entryKb = +(statSync(entry).size / 1024).toFixed(2);
console.log('Wrote', htmlPath);
console.log('Synced chunks:', readdirSync(siteChunks).length, 'files; runtime-entry', entryKb, 'KB');
console.log('a11y leftovers', (html.match(/docs\/a11y\.html/g) || []).length);
console.log('expo-quality leftovers', (html.match(/expo-quality/g) || []).length);
console.log('iife leftovers', (html.match(/velinstyle-components\.iife/g) || []).length);
console.log('fake-compare leftovers', (html.match(/expo-compare__pane--foreign|fake-btn|tw-btn|sl-btn/g) || []).length);
