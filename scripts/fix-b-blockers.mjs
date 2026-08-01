/**
 * Priority-B: IA cut, motion trim, axe readiness hooks in HTML, nav sync.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');

function removeSection(id) {
  const re = new RegExp(
    `\\s*<section class="expo-section"[^>]*\\bid="${id}"[\\s\\S]*?<\\/section>`,
    'g',
  );
  const before = html.length;
  html = html.replace(re, '\n');
  if (html.length === before) console.warn('section not removed:', id);
  else console.log('removed section', id);
}

// ─── B1: keep 10 core sections ───
[
  'whats-new',
  'pages',
  'blueprints',
  'heroes',
  'navigation',
  'buttons',
  'forms',
  'cards',
  'tables',
  'charts',
  'utilities',
].forEach(removeSection);

const moreGalleries = `
    <aside class="expo-section expo-more" id="more-galleries" aria-label="Additional galleries">
      <header class="expo-section__header">
        <p class="expo-kicker">More galleries</p>
        <h2 class="velin-text-xl" style="margin:0">Buttons, forms, tables, heroes, and page types live in demos</h2>
        <p>Homepage IA is cut to core proof. Full galleries stay interactive off-home.</p>
      </header>
      <div class="expo-links">
        <a class="velin-btn velin-btn--outline velin-btn--sm" href="demos/showcase-interactive.html">Interactive kit</a>
        <a class="velin-btn velin-btn--ghost velin-btn--sm" href="demos/index.html">All demos</a>
        <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/components/index.html">Component docs</a>
      </div>
    </aside>
`;

if (!html.includes('id="more-galleries"')) {
  html = html.replace(
    /(<section class="expo-section" id="playground"[\s\S]*?<\/section>)/,
    `$1\n${moreGalleries}`,
  );
}

// Slim nav panels
const componentsPanel = `        <div class="expo-nav__panel" id="navComponents" role="menu" aria-label="Components" hidden>
          <a role="menuitem" href="#playground">Playground</a>
          <a role="menuitem" href="#contracts">Contracts</a>
          <a role="menuitem" href="#dashboard">Dashboard</a>
          <a role="menuitem" href="#tokens">Tokens</a>
          <a role="menuitem" href="#animations">Motion</a>
          <a role="menuitem" href="#testing">Test Center</a>
          <a role="menuitem" href="demos/index.html">All demos</a>
        </div>`;
html = html.replace(
  /<div class="expo-nav__panel" id="navComponents"[\s\S]*?<\/div>/,
  componentsPanel,
);

const showcasePanel = `        <div class="expo-nav__panel expo-nav__panel--single" id="navShowcase" role="menu" aria-label="Showcase" hidden>
          <a role="menuitem" href="#showcase">Projects</a>
          <a role="menuitem" href="#compare">Positioning</a>
          <a role="menuitem" href="showcase/index.html">Showcase hub</a>
          <a role="menuitem" href="demos/index.html">All demos</a>
        </div>`;
html = html.replace(
  /<div class="expo-nav__panel expo-nav__panel--single" id="navShowcase"[\s\S]*?<\/div>/,
  showcasePanel,
);

html = html.replace(
  '<a role="menuitem" href="#whats-new">What\'s new 1.2.0</a>',
  '<a role="menuitem" href="CHANGELOG.md">Changelog 1.2.0</a>',
);

// Site drawer links
html = html.replace(
  /<nav class="expo-site-nav" aria-label="Mobile site">[\s\S]*?<\/nav>/,
  `<nav class="expo-site-nav" aria-label="Mobile site">
      <p class="expo-kicker">Core</p>
      <a href="#playground" data-expo-close="expoSiteNav">Playground</a>
      <a href="#contracts" data-expo-close="expoSiteNav">Contracts</a>
      <a href="#dashboard" data-expo-close="expoSiteNav">Dashboard</a>
      <a href="#tokens" data-expo-close="expoSiteNav">Tokens</a>
      <a href="#animations" data-expo-close="expoSiteNav">Motion</a>
      <a href="#testing" data-expo-close="expoSiteNav">Test Center</a>
      <a href="#showcase" data-expo-close="expoSiteNav">Showcase</a>
      <a href="#compare" data-expo-close="expoSiteNav">Positioning</a>
      <a href="#install" data-expo-close="expoSiteNav">Install</a>
      <p class="expo-kicker">More</p>
      <a href="demos/index.html">All demos</a>
      <a href="docs/getting-started/introduction.html">Docs</a>
    </nav>`,
);

// ─── B2: keep useful motion only ───
const motionGrid = `      <div class="expo-anim-grid">
        <article class="expo-anim-tile">
          <strong>Focus</strong>
          <p>Visible focus ring for keyboard users. Tab into the control.</p>
          <div class="expo-anim-tile__stage"><button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Tab here</button></div>
          <div class="expo-demo-links">
            <a href="docs/getting-started/accessibility.html#focus-management">Docs</a>
            <a href="demos/showcase-interactive.html">Playground</a>
          </div>
        </article>
        <article class="expo-anim-tile">
          <strong>Collapse</strong>
          <p>Show secondary content without leaving the page.</p>
          <div class="expo-anim-tile__stage"><velin-collapse><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" slot="trigger">Toggle</button><p class="velin-text-sm" style="margin:0">Expanded panel content.</p></velin-collapse></div>
          <div class="expo-demo-links">
            <a href="docs/components/collapse.html">Docs</a>
            <a href="demos/showcase-interactive.html">Playground</a>
          </div>
        </article>
        <article class="expo-anim-tile">
          <strong>Modal</strong>
          <p>Blocking decision with focus trap. Esc closes.</p>
          <div class="expo-anim-tile__stage"><button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-open="animModal">Open modal</button></div>
          <div class="expo-demo-links">
            <a href="docs/components/modal.html">Docs</a>
            <a href="demos/showcase-interactive.html">Playground</a>
          </div>
        </article>
        <article class="expo-anim-tile">
          <strong>Drawer</strong>
          <p>Side navigation / filters. Keep short paths.</p>
          <div class="expo-anim-tile__stage"><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="animDrawer">Open drawer</button></div>
          <div class="expo-demo-links">
            <a href="docs/components/drawer.html">Docs</a>
            <a href="demos/showcase-interactive.html">Playground</a>
          </div>
        </article>
        <article class="expo-anim-tile">
          <strong>Toast</strong>
          <p>Transient status feedback with live region semantics.</p>
          <div class="expo-anim-tile__stage"><div class="velin-flex velin-flex--gap-2 velin-flex--wrap"><button type="button" class="velin-btn velin-btn--success velin-btn--sm" data-toast="success" data-toast-msg="Saved">Success</button><button type="button" class="velin-btn velin-btn--danger velin-btn--sm" data-toast="warning" data-toast-msg="Check fields">Warning</button></div></div>
          <div class="expo-demo-links">
            <a href="docs/components/toasts.html">Docs</a>
            <a href="demos/showcase-interactive.html">Playground</a>
          </div>
        </article>
        <article class="expo-anim-tile">
          <strong>Loading</strong>
          <p>Busy state + spinner. Prefer explicit aria-busy.</p>
          <div class="expo-anim-tile__stage"><div class="velin-flex velin-flex--gap-2 velin-flex--items-center"><span class="velin-spinner velin-spinner--sm" role="status" aria-label="Loading"></span><button type="button" class="velin-btn velin-btn--primary velin-btn--sm velin-btn--loading" aria-busy="true">Saving</button></div></div>
          <div class="expo-demo-links">
            <a href="docs/components/spinners.html">Docs</a>
            <a href="demos/showcase-interactive.html">Playground</a>
          </div>
        </article>
        <article class="expo-anim-tile">
          <strong>Reveal</strong>
          <p>Entrance only when motion is allowed.</p>
          <div class="expo-anim-tile__stage"><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="rerunReveal">Replay reveal</button><span id="revealTarget" class="velin-badge velin-badge--primary" velin-reveal="fade">Revealed</span></div>
          <div class="expo-demo-links">
            <a href="docs/guides/motion-attributes.html">Docs</a>
            <a href="demos/showcase-runtime.html">Playground</a>
          </div>
        </article>
        <article class="expo-anim-tile">
          <strong>Reduced motion</strong>
          <p>Respect <code>prefers-reduced-motion</code>. Toggle reports system preference.</p>
          <div class="expo-anim-tile__stage">
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="checkReducedMotion">Check preference</button>
            <p class="velin-text-sm" id="reducedMotionOut" style="margin:0" aria-live="polite">—</p>
          </div>
          <div class="expo-demo-links">
            <a href="docs/getting-started/accessibility.html#reduced-motion">Docs</a>
            <a href="#testing">Test Center</a>
          </div>
        </article>
      </div>`;

html = html.replace(
  /<div class="expo-anim-grid">[\s\S]*?(?=\n\s*<footer class="expo-links">)/,
  `${motionGrid}\n      `,
);

html = html.replace(
  '<h2 id="animations-title">Which motion patterns can you test live?</h2>\n        <p>Hover bis Reveal — jede Kachel hat Demo, Trigger und Docs.</p>',
  '<h2 id="animations-title">Which motion patterns matter in product UI?</h2>\n        <p>Only contract-backed motion: focus, overlays, feedback, loading, reveal, and reduced-motion.</p>',
);
// EN copy if already translated
html = html.replace(
  /(<h2 id="animations-title">)[\s\S]*?(<\/h2>\s*<p>)[\s\S]*?(<\/p>)/,
  '$1Which motion patterns matter in product UI?$2Only contract-backed motion: focus, overlays, feedback, loading, reveal, and reduced-motion.$3',
);

// ─── B5: axe card in test center ───
if (!html.includes('id="testAxe"')) {
  html = html.replace(
    /(<div class="expo-test-grid">)/,
    `$1
        <article class="expo-test-card" id="testAxe">
          <h3>axe-core scan</h3>
          <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" id="runAxeTest">Run axe on stage</button>
          <p data-test-out class="velin-text-sm" style="margin:0">—</p>
          <ul id="axeViolations" class="expo-axe-list" aria-live="polite"></ul>
        </article>`,
  );
}

writeFileSync(htmlPath, html);

const sectionIds = [...html.matchAll(/<section class="expo-section[^"]*"[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
const asides = [...html.matchAll(/<aside class="expo-section[^"]*"[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
console.log('sections', sectionIds);
console.log('asides', asides);
console.log('anim tiles', (html.match(/expo-anim-tile/g) || []).length);
console.log('bytes', Buffer.byteLength(html));
