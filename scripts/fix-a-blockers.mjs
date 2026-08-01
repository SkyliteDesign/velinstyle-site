/**
 * Apply Priority-A homepage fixes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');

// ─── A1 + A2: search + mobile menu button in header ───
const actionsOld = `    <div class="expo-nav__actions">
      <velin-theme-toggle themes-base="dist/themes/"></velin-theme-toggle>
      <a class="velin-btn velin-btn--primary velin-btn--sm" href="#install">Install</a>
    </div>
  </header>

    <div class="expo-toc-mobile">
    <label class="visually-hidden" for="expoMobileToc">Jump to section</label>
    <select id="expoMobileToc" class="velin-input">
      <option value="">Jump to section…</option>
      <optgroup label="Components">
        <option value="#playground">Playground</option>
        <option value="#buttons">Buttons</option>
        <option value="#forms">Forms</option>
        <option value="#cards">Cards</option>
        <option value="#tables">Tables</option>
        <option value="#navigation">Navigation</option>
        <option value="#heroes">Heroes</option>
        <option value="#contracts">Contracts</option>
        <option value="#charts">Charts</option>
        <option value="#dashboard">Dashboard</option>
        <option value="#utilities">Utilities</option>
        <option value="#tokens">Tokens</option>
        <option value="#animations">Motion</option>
        <option value="#testing">Test Center</option>
      </optgroup>
      <optgroup label="Showcase">
        <option value="#showcase">Projects</option>
        <option value="#pages">Pages</option>
        <option value="#blueprints">Blueprints</option>
        <option value="#compare">Positioning</option>
      </optgroup>
      <optgroup label="Docs & Community">
        <option value="#whats-new">What's new</option>
        <option value="#install">Install</option>
      </optgroup>
    </select>
  </div>`;

const actionsNew = `    <div class="expo-nav__actions">
      <velin-search class="expo-nav__search" index="dist/search-index.json" categories="docs,components" placeholder="Search docs…" min-chars="2" fuzzy="0.2" aria-label="Search documentation"></velin-search>
      <button type="button" class="velin-btn velin-btn--outline velin-btn--sm expo-nav__menu-btn" id="expoMobileMenuBtn" data-expo-open="expoSiteNav" aria-controls="expoSiteNav" aria-expanded="false">Menu</button>
      <velin-theme-toggle themes-base="dist/themes/"></velin-theme-toggle>
      <a class="velin-btn velin-btn--primary velin-btn--sm" href="#install">Install</a>
    </div>
  </header>`;

if (!html.includes(actionsOld)) {
  console.warn('WARN: nav actions / mobile toc block not found exactly');
} else {
  html = html.replace(actionsOld, actionsNew);
}

// A3: menubar semantics on mega-nav
html = html.replace(
  '<nav class="expo-nav__menu" aria-label="Primary">',
  '<nav class="expo-nav__menu" aria-label="Primary" role="menubar">',
);
html = html.replaceAll(
  'type="button" aria-expanded="false" aria-controls="nav',
  'type="button" role="menuitem" aria-haspopup="true" aria-expanded="false" aria-controls="nav',
);
html = html.replace(
  /<div class="expo-nav__panel([^"]*)" id="(navComponents|navShowcase|navDocs|navCommunity)" role="region" aria-label="([^"]+)">/g,
  '<div class="expo-nav__panel$1" id="$2" role="menu" aria-label="$3" hidden>',
);
// menuitem on panel links — do carefully inside panels only via a pass
html = html.replace(
  /(<div class="expo-nav__panel[\s\S]*?<\/div>\s*<\/div>)/g,
  (block) => {
    if (!block.includes('role="menu"')) return block;
    return block.replace(/<a href="/g, '<a role="menuitem" href="');
  },
);

// ─── A8: trim section footers to Docs / Playground / GitHub ───
html = html.replace(/<footer class="expo-links">[\s\S]*?<\/footer>/g, (block) => {
  const links = [...block.matchAll(/<a class="([^"]*)" href="([^"]+)"([^>]*)>([^<]*)<\/a>/g)].map((m) => ({
    cls: m[1],
    href: m[2],
    attrs: m[3],
    text: m[4].trim(),
  }));
  if (!links.length) return block;

  const pick = (pred) => links.find(pred);
  const docs =
    pick((l) => /Documentation|Docs/i.test(l.text) && !/Accessibility|Contract/i.test(l.text)) ||
    pick((l) => l.href.includes('docs/') && !l.href.includes('accessibility'));
  const play =
    pick((l) => /Playground|Examples/i.test(l.text)) ||
    pick((l) => l.href.includes('demos/'));
  const gh =
    pick((l) => /GitHub/i.test(l.text)) ||
    pick((l) => l.href.includes('github.com'));

  const chosen = [docs, play, gh].filter(Boolean);
  // de-dupe by href+text
  const seen = new Set();
  const unique = chosen.filter((l) => {
    const k = `${l.href}|${l.text}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (!unique.length) return block;

  const rendered = unique.map((l, i) => {
    const cls = i === 0
      ? 'velin-btn velin-btn--outline velin-btn--sm'
      : 'velin-btn velin-btn--ghost velin-btn--sm';
    return `    <a class="${cls}" href="${l.href}"${l.attrs}>${l.text}</a>`;
  }).join('\n');

  return `<footer class="expo-links">\n${rendered}\n  </footer>`;
});

// Install div.expo-links — keep primary trio
html = html.replace(
  /(<div class="expo-links">)[\s\S]*?(<\/div>\s*<\/section>\s*<\/main>)/,
  `$1
        <a class="velin-btn velin-btn--primary" href="docs/getting-started/download.html">Read Documentation</a>
        <a class="velin-btn velin-btn--outline" href="demos/index.html">Playground</a>
        <a class="velin-btn velin-btn--ghost" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="velin-btn velin-btn--ghost" href="dist/velin-agent.json">velin-agent.json</a>
      $2`,
);

// ─── A4: expand contracts gallery with missing components ───
const contractsInsert = `
        <article class="expo-variant-card">
          <h3>Dropdown</h3>
          <p class="velin-text-sm" style="margin:0">Action menus. Not for navigation trees.</p>
          <velin-dropdown>
            <button type="button" slot="trigger" class="velin-btn velin-btn--secondary velin-btn--sm">Actions ▾</button>
            <button type="button" role="menuitem">Duplicate</button>
            <button type="button" role="menuitem">Archive</button>
            <a href="#contracts" role="menuitem">Contracts</a>
          </velin-dropdown>
        </article>
        <article class="expo-variant-card">
          <h3>Combobox</h3>
          <p class="velin-text-sm" style="margin:0">Filterable single-select with keyboard.</p>
          <label class="velin-label" for="expoCombo">Framework</label>
          <velin-combobox id="expoCombo" placeholder="Search frameworks…" aria-label="Framework">
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="svelte">Svelte</option>
            <option value="lit">Lit</option>
          </velin-combobox>
        </article>
        <article class="expo-variant-card">
          <h3>Command</h3>
          <p class="velin-text-sm" style="margin:0">Palette for power users (Ctrl/Cmd+K).</p>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="openExpoCommand">Open command</button>
        </article>
        <article class="expo-variant-card">
          <h3>Carousel / Lightbox</h3>
          <velin-carousel aria-label="Feature carousel" style="max-width:100%">
            <div class="expo-carousel-slide"><strong>Slide 1</strong> — tokens</div>
            <div class="expo-carousel-slide"><strong>Slide 2</strong> — motion</div>
            <div class="expo-carousel-slide"><strong>Slide 3</strong> — a11y</div>
          </velin-carousel>
          <velin-lightbox id="expoLightbox">
            <img src="assets/img/velinstyle-logo.svg" alt="VelinStyle logo" width="64" height="64">
            <img src="assets/img/velinstyle-logo.svg" alt="VelinStyle logo monochrome" width="64" height="64" style="filter:grayscale(1)">
          </velin-lightbox>
        </article>
        <article class="expo-variant-card">
          <h3>Menubar / Dialog</h3>
          <velin-menubar aria-label="Demo menubar">
            <button type="button" data-menu="file">File</button>
            <button type="button" data-menu="view">View</button>
            <button type="button" data-menu="help">Help</button>
          </velin-menubar>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="openExpoDialog">Open dialog</button>
          <velin-dialog id="expoDialog" aria-label="Confirm dialog"></velin-dialog>
        </article>
        <article class="expo-variant-card">
          <h3>Secure field / Bottom nav</h3>
          <velin-secure-field label="API token (demo)" name="expo-token" type="password" autocomplete="off"></velin-secure-field>
          <div class="expo-bottom-nav-demo">
            <velin-bottom-nav aria-label="Demo bottom nav" current="home">
              <a href="#contracts" data-nav="home">Home</a>
              <a href="#forms" data-nav="forms">Forms</a>
              <a href="#install" data-nav="install">Install</a>
            </velin-bottom-nav>
          </div>
        </article>`;

if (html.includes('id="expoCombo"')) {
  console.warn('contracts extras already present');
} else {
  html = html.replace(
    `        <article class="expo-variant-card">
          <h3>Search / Code / Sparkline</h3>
          <velin-code-block language="js" collapsed>bootFromDOM({ attributes: true, motion: true });</velin-code-block>
          <velin-sparkline values="1,3,2,5,4,7" label="Mini trend"></velin-sparkline>
        </article>
      </div>`,
    `        <article class="expo-variant-card">
          <h3>Search / Code / Sparkline</h3>
          <velin-code-block language="js" collapsed>bootFromDOM({ attributes: true, motion: true });</velin-code-block>
          <velin-sparkline values="1,3,2,5,4,7" label="Mini trend"></velin-sparkline>
        </article>${contractsInsert}
      </div>`,
  );
}

// ─── A7: token presets + control surface note ───
html = html.replace(
  `<div class="expo-controls">
        <label>Theme
          <select class="velin-input" data-expo-theme>`,
  `<div class="expo-controls">
        <div class="expo-token-presets" role="group" aria-label="Token presets">
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-token-preset="compact">Compact</button>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-token-preset="comfortable">Comfortable</button>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-token-preset="soft">Soft</button>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-token-preset="sharp">Sharp</button>
          <button type="button" class="velin-btn velin-btn--ghost velin-btn--sm" data-token-preset="reset">Reset</button>
        </div>
        <label>Theme
          <select class="velin-input" data-expo-theme>`,
);

html = html.replace(
  '<p class="expo-token-readout" id="tokenReadout" aria-live="polite"></p>',
  `<p class="expo-a11y-note">Controls write real <code>--velin-*</code> tokens on <code>#tokenSurface</code> (radius, space, shadow, type). Compare with the control surface beside it.</p>
      <p class="expo-token-readout" id="tokenReadout" aria-live="polite"></p>`,
);

html = html.replace(
  `<div class="expo-token-surface" id="tokenSurface" data-elev="mid" data-motion="on">
        <nav class="velin-nav" aria-label="Token lab nav">
          <a class="velin-nav__brand" href="#tokens">Token Lab</a>
          <ul class="velin-nav__list"><li><a class="velin-nav__link" href="#tokens" aria-current="page">Surface</a></li><li><a class="velin-nav__link" href="#animations">Motion</a></li></ul>
          <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-open="expoModal">Modal</button>
        </nav>
        <div class="expo-split expo-split--2">
          <article class="velin-card"><div class="velin-card__body">
            <h3 class="velin-card__title">Surface card</h3>
            <p class="velin-card__text">Radius, elevation, density, accent und typography cascade here.</p>
            <label class="velin-label" for="tok-input">Email</label>
            <input class="velin-input" id="tok-input" type="email" placeholder="token@lab.dev">
          </div></article>
          <div>
            <velin-sparkline values="2,5,3,7,6,9,8" area label="Token lab chart"></velin-sparkline>
            <table class="velin-table" style="margin-top:var(--velin-space-3)">
              <caption class="velin-sr-only">Token sample rows</caption>
              <thead><tr><th scope="col">Token</th><th scope="col">Value</th></tr></thead>
              <tbody><tr><td>radius</td><td>live</td></tr><tr><td>density</td><td>live</td></tr><tr><td>accent</td><td>live</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>`,
  `<div class="expo-token-compare">
        <div class="expo-token-surface" id="tokenSurface" data-elev="mid" data-motion="on">
          <p class="expo-kicker">Live tokens</p>
          <nav class="velin-nav" aria-label="Token lab nav">
            <a class="velin-nav__brand" href="#tokens">Token Lab</a>
            <ul class="velin-nav__list"><li><a class="velin-nav__link" href="#tokens" aria-current="page">Surface</a></li><li><a class="velin-nav__link" href="#animations">Motion</a></li></ul>
            <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-open="expoModal">Modal</button>
          </nav>
          <div class="expo-split expo-split--2">
            <article class="velin-card"><div class="velin-card__body">
              <h3 class="velin-card__title">Surface card</h3>
              <p class="velin-card__text">Radius, elevation, density, accent and typography cascade here via --velin-*.</p>
              <label class="velin-label" for="tok-input">Email</label>
              <input class="velin-input" id="tok-input" type="email" placeholder="token@lab.dev">
            </div></article>
            <div>
              <velin-sparkline values="2,5,3,7,6,9,8" area label="Token lab chart"></velin-sparkline>
              <table class="velin-table" style="margin-top:var(--velin-space-3)">
                <caption class="velin-sr-only">Token sample rows</caption>
                <thead><tr><th scope="col">Token</th><th scope="col">Value</th></tr></thead>
                <tbody><tr><td>--velin-radius-md</td><td id="tokCellRadius">live</td></tr><tr><td>--velin-space-3</td><td id="tokCellSpace">live</td></tr><tr><td>--velin-color-primary</td><td id="tokCellAccent">live</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="expo-token-surface expo-token-surface--control" id="tokenControl" aria-label="Unmodified control surface">
          <p class="expo-kicker">Control (defaults)</p>
          <nav class="velin-nav" aria-label="Control nav">
            <a class="velin-nav__brand" href="#tokens">Defaults</a>
            <ul class="velin-nav__list"><li><a class="velin-nav__link" href="#tokens" aria-current="page">Surface</a></li></ul>
            <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Modal</button>
          </nav>
          <article class="velin-card"><div class="velin-card__body">
            <h3 class="velin-card__title">Baseline card</h3>
            <p class="velin-card__text">Unmodified --velin-* defaults for side-by-side proof.</p>
            <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Primary</button>
          </div></article>
        </div>
      </div>`,
);

// ─── A2: site nav drawer + A4 command palette near overlays ───
html = html.replace(
  '<velin-toast id="expoToast"></velin-toast>',
  `<velin-drawer id="expoSiteNav" title="Site navigation" side="start">
    <nav class="expo-site-nav" aria-label="Mobile site">
      <p class="expo-kicker">Components</p>
      <a href="#playground" data-expo-close="expoSiteNav">Playground</a>
      <a href="#buttons" data-expo-close="expoSiteNav">Buttons</a>
      <a href="#forms" data-expo-close="expoSiteNav">Forms</a>
      <a href="#cards" data-expo-close="expoSiteNav">Cards</a>
      <a href="#tables" data-expo-close="expoSiteNav">Tables</a>
      <a href="#navigation" data-expo-close="expoSiteNav">Navigation</a>
      <a href="#contracts" data-expo-close="expoSiteNav">Contracts</a>
      <a href="#tokens" data-expo-close="expoSiteNav">Tokens</a>
      <a href="#testing" data-expo-close="expoSiteNav">Test Center</a>
      <p class="expo-kicker">Showcase</p>
      <a href="#showcase" data-expo-close="expoSiteNav">Projects</a>
      <a href="#pages" data-expo-close="expoSiteNav">Pages</a>
      <a href="#compare" data-expo-close="expoSiteNav">Positioning</a>
      <p class="expo-kicker">Docs</p>
      <a href="docs/getting-started/introduction.html">Introduction</a>
      <a href="docs/components/index.html">Components</a>
      <a href="docs/getting-started/accessibility.html">Accessibility</a>
      <a href="#install" data-expo-close="expoSiteNav">Install</a>
    </nav>
    <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-close="expoSiteNav" style="margin-top:var(--velin-space-3)">Close</button>
  </velin-drawer>
  <velin-command id="expoCommand" placeholder="Jump to section or action…">
    <velin-command-item data-value="playground" data-href="#playground">Playground</velin-command-item>
    <velin-command-item data-value="forms" data-href="#forms">Forms</velin-command-item>
    <velin-command-item data-value="tokens" data-href="#tokens">Token Lab</velin-command-item>
    <velin-command-item data-value="testing" data-href="#testing">Test Center</velin-command-item>
    <velin-command-item data-value="install" data-href="#install">Install</velin-command-item>
    <velin-command-item data-value="docs" data-href="docs/getting-started/introduction.html">Docs</velin-command-item>
  </velin-command>
  <velin-toast id="expoToast"></velin-toast>`,
);

writeFileSync(htmlPath, html);

const checks = {
  search: html.includes('expo-nav__search'),
  menuBtn: html.includes('expoMobileMenuBtn'),
  noSelectToc: !html.includes('expoMobileToc'),
  menubar: html.includes('role="menubar"'),
  combo: html.includes('velin-combobox'),
  command: html.includes('id="expoCommand"'),
  carousel: html.includes('velin-carousel'),
  presets: html.includes('data-token-preset'),
  control: html.includes('tokenControl'),
  siteNav: html.includes('expoSiteNav'),
};
console.log(checks);
const avgLinks = [...html.matchAll(/<footer class="expo-links">([\s\S]*?)<\/footer>/g)].map((m) => (m[1].match(/<a /g) || []).length);
console.log('footer link counts', avgLinks.slice(0, 8), 'max', Math.max(...avgLinks, 0));
