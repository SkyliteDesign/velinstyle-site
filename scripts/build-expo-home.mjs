/**
 * Builds the Component Expo index.html for VelinStyle 1.2.0
 *
 * DEPRECATED: `index.html` is the source of truth after the S/A/B release pass.
 * Regenerating will wipe live IA/a11y/boot fixes. Pass --force to override.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.argv.includes('--force')) {
  console.error(
    '[build-expo-home] Blocked: index.html is source of truth.\n' +
      'Use scripts/verify-home.mjs to validate. Re-run with --force only if you intentionally regenerate.',
  );
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const V = '1.2.0';

const links = (docs, extra = '') => `
  <footer class="expo-links">
    <a class="velin-btn velin-btn--outline velin-btn--sm" href="${docs}">Read Documentation</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="${docs}">API</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="demos/showcase-interactive.html">Examples</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="demos/index.html">Playground</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">Source</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/getting-started/accessibility.html">Accessibility Guide</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/getting-started/accessibility.html#contracts">Component Contract</a>
    ${extra}
  </footer>`;

const navItems = [
  ['#playground', 'Playground'],
  ['#whats-new', '1.2.0'],
  ['#pages', 'Pages'],
  ['#blueprints', 'Blueprints'],
  ['#heroes', 'Heroes'],
  ['#navigation', 'Nav'],
  ['#buttons', 'Buttons'],
  ['#forms', 'Forms'],
  ['#cards', 'Cards'],
  ['#tables', 'Tables'],
  ['#contracts', 'Contracts'],
  ['#charts', 'Charts'],
  ['#dashboard', 'Dashboard'],
  ['#utilities', 'Utilities'],
  ['#tokens', 'Tokens'],
  ['#animations', 'Motion'],
  ['#testing', 'Testing'],
  ['#showcase', 'Showcase'],
  ['#compare', 'Compare'],
  ['#install', 'Install'],
];

const pages = [
  'Landing', 'Corporate', 'Lawyer', 'Healthcare', 'Restaurant', 'Portfolio', 'Agency', 'SaaS',
  'Docs', 'Dashboard', 'CRM', 'ERP', 'Blog', 'Shop', 'Event', 'Course', 'Community',
];

const heroes = [
  { id: 'landing', title: 'Landingpage', use: 'Klarer Offer + 2 CTAs.', comps: 'btn, card, trust', utils: 'container, flex, gap' },
  { id: 'saas', title: 'SaaS', use: 'Produkt-Preview + Social Proof.', comps: 'btn, badge, sparkline', utils: 'grid, text, shadow' },
  { id: 'agency', title: 'Agentur', use: 'Cases + starke Typografie.', comps: 'card, btn, tabs', utils: 'stack, gap, display' },
  { id: 'portfolio', title: 'Portfolio', use: 'Work grid zuerst.', comps: 'card, lightbox', utils: 'grid, aspect, gap' },
  { id: 'product', title: 'Produkt', use: 'Feature → Benefit → CTA.', comps: 'btn, accordion', utils: 'flex, spacing' },
  { id: 'startup', title: 'Startup', use: 'Velocity + Waitlist Form.', comps: 'form-summary, input', utils: 'container, radius' },
  { id: 'enterprise', title: 'Enterprise', use: 'Trust + Compliance Badges.', comps: 'nav, badge, table', utils: 'border, shadow' },
  { id: 'docs', title: 'Docs Hero', use: 'Search-first Einstieg.', comps: 'search, code-block', utils: 'text, spacing' },
  { id: 'shop', title: 'Shop', use: 'Preis + Product Card.', comps: 'card, rating, btn', utils: 'grid, gap' },
  { id: 'dashboard', title: 'Dashboard', use: 'KPI strip sofort.', comps: 'sparkline, badge', utils: 'grid, flex' },
  { id: 'event', title: 'Event', use: 'Datum + Countdown.', comps: 'countdown, btn', utils: 'flex, text' },
  { id: 'healthcare', title: 'Healthcare', use: 'Calm tone + appointment.', comps: 'stepper, form', utils: 'spacing, color' },
];

const navVariants = [
  'Sticky', 'Transparent', 'Mega Menu', 'Dashboard', 'Sidebar', 'Docs', 'App Shell',
  'Centered', 'Split', 'Minimal', 'Enterprise', 'Mobile', 'Drawer', 'Offcanvas', 'Breadcrumb',
];

const buttonVariants = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['outline', 'Outline'],
  ['ghost', 'Ghost'],
  ['danger', 'Danger'],
  ['success', 'Success'],
  ['primary sm', 'Primary SM'],
  ['primary lg', 'Primary LG'],
  ['outline sm', 'Outline SM'],
  ['ghost sm', 'Ghost SM'],
  ['danger sm', 'Danger SM'],
  ['success sm', 'Success SM'],
  ['primary block', 'Block'],
  ['primary loading', 'Loading'],
  ['outline loading', 'Outline Loading'],
  ['icon', 'Icon'],
  ['close', 'Close'],
  ['primary disabled', 'Disabled'],
  ['secondary lg', 'Secondary LG'],
  ['ghost lg', 'Ghost LG'],
];

function btnClass(key) {
  const parts = key.split(' ');
  const cls = ['velin-btn'];
  for (const p of parts) {
    if (p === 'disabled') continue;
    cls.push(`velin-btn--${p}`);
  }
  return cls.join(' ');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="https://velinstyle.info/">
  <meta name="description" content="VelinStyle ${V} live Component Expo — buttons, forms, navigation, dashboards, tokens, utilities, and accessibility tests as real components.">
  <link rel="alternate" type="application/vnd.velinstyle.meta+json" href="/dist/velin-agent.json" title="VelinStyle agent metadata">
  <link rel="alternate" type="text/plain" href="/dist/llms.txt" title="VelinStyle llms.txt">
  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"VelinStyle","url":"https://velinstyle.info/","description":"Accessibility-first CSS and Web Components with plan-first scaffolding.","inLanguage":["en","de"]},{"@type":"SoftwareApplication","name":"VelinStyle","applicationCategory":"DeveloperApplication","operatingSystem":"Web","softwareVersion":"${V}","url":"https://velinstyle.info/","license":"https://opensource.org/licenses/MIT","isAccessibleForFree":true,"publisher":{"@type":"Organization","name":"SkyliteDesign"}}]}</script>
  <title>VelinStyle — Component Expo ${V}</title>
  <meta name="theme-color" content="#0c0b0a">
  <meta property="og:title" content="VelinStyle — Component Expo ${V}">
  <meta property="og:description" content="Live galleries for every VelinStyle surface — no screenshots when components can run.">
  <meta property="og:url" content="https://velinstyle.info/">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="dist/velinstyle.min.css">
  <link rel="stylesheet" href="assets/css/home.css">
  <link rel="icon" href="assets/img/velinstyle-logo.svg" type="image/svg+xml">
  <script src="assets/js/velin-theme-init.js"></script>
  <script>document.documentElement.setAttribute('data-velin-themes-base','dist/themes');</script>
</head>
<body class="expo-body" data-velin-reveal-auto>
  <a href="#main" class="velin-skip-link expo-skip">Skip to Component Expo</a>

  <header class="expo-nav" role="banner">
    <a class="expo-nav__brand" href="#hero">
      <img src="assets/img/velinstyle-logo.svg" alt="" width="22" height="22" aria-hidden="true">
      <span>VelinStyle</span>
      <span class="velin-badge velin-badge--primary">${V}</span>
    </a>
    <nav class="expo-nav__links" aria-label="Expo sections">
      ${navItems.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}
    </nav>
    <div class="expo-nav__actions">
      <velin-theme-toggle themes-base="dist/themes/"></velin-theme-toggle>
      <a class="velin-btn velin-btn--primary velin-btn--sm" href="#install">Install</a>
    </div>
  </header>

  <div class="expo-toc-mobile">
    <label class="visually-hidden" for="expoMobileToc">Jump to section</label>
    <select id="expoMobileToc" class="velin-input">
      <option value="">Jump to section…</option>
      ${navItems.map(([h, l]) => `<option value="${h}">${l}</option>`).join('')}
    </select>
  </div>

  <main id="main" class="expo-main">

    <section class="expo-section expo-hero" id="hero" aria-labelledby="hero-title">
      <div class="expo-hero__copy">
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
      </div>
      <div class="expo-preview" id="heroLivePreview">
        <div class="expo-split expo-split--2">
          <article class="velin-card"><div class="velin-card__body">
            <h3 class="velin-card__title">SaaS shell</h3>
            <p class="velin-card__text">Nav + KPI + toast — one token set.</p>
            <div class="velin-flex velin-flex--gap-2 velin-flex--wrap">
              <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-toast="success" data-toast-msg="Deployed preview">Toast</button>
              <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="expoModal">Modal</button>
              <button type="button" class="velin-btn velin-btn--ghost velin-btn--sm" data-expo-open="expoDrawer">Drawer</button>
            </div>
          </div></article>
          <div>
            <velin-sparkline values="2,4,3,6,5,8,7,9,8,11" area glow label="Weekly activity"></velin-sparkline>
            <div class="velin-flex velin-flex--gap-2 velin-flex--wrap" style="margin-top:var(--velin-space-3)">
              <span class="velin-badge velin-badge--success">Paid</span>
              <span class="velin-badge">Focus OK</span>
              <velin-live-dot label="Live"></velin-live-dot>
            </div>
          </div>
        </div>
      </div>
      ${links('docs/getting-started/introduction.html')}
    </section>

    <section class="expo-section" id="playground" aria-labelledby="playground-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Live Playground</p>
        <h2 id="playground-title">Wie steuert man ein ganzes UI mit Tokens?</h2>
        <p>Theme, density, radius und spacing ändern dieselbe echte Oberfläche. Labels, Fokus und Kontrakt bleiben erhalten.</p>
      </header>
      <div class="expo-controls">
        <label>Theme
          <select class="velin-input" data-expo-theme>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="ocean">Ocean</option>
            <option value="forest">Forest</option>
            <option value="midnight">Midnight</option>
            <option value="nordic">Nordic</option>
            <option value="sunset">Sunset</option>
            <option value="neon">Neon</option>
          </select>
        </label>
        <label>Density <input id="pgDensity" type="range" min="0.8" max="1.3" step="0.05" value="1"></label>
        <label>Radius <input id="pgRadius" type="range" min="0.2" max="1.5" step="0.05" value="0.75"></label>
        <label>Spacing <input id="pgSpacing" type="range" min="0.5" max="2" step="0.1" value="1"></label>
      </div>
      <div class="expo-token-surface" id="playgroundSurface">
        <nav class="velin-nav" aria-label="Playground nav">
          <a class="velin-nav__brand" href="#playground">Acme Ops</a>
          <ul class="velin-nav__list">
            <li><a class="velin-nav__link" href="#playground" aria-current="page">Overview</a></li>
            <li><a class="velin-nav__link" href="#tables">Invoices</a></li>
            <li><a class="velin-nav__link" href="#forms">Support</a></li>
          </ul>
          <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Invite</button>
        </nav>
        <div class="expo-kpi-grid">
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">MRR</h3><p class="velin-text-2xl" style="margin:0;font-weight:700">€48k</p></div></article>
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Churn</h3><p class="velin-text-2xl" style="margin:0;font-weight:700">1.2%</p></div></article>
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">NPS</h3><p class="velin-text-2xl" style="margin:0;font-weight:700">72</p></div></article>
        </div>
        <form data-expo-form novalidate>
          <velin-form-summary></velin-form-summary>
          <div class="velin-flex velin-flex--gap-3 velin-flex--wrap velin-flex--items-end">
            <div class="velin-field" style="flex:1;min-width:12rem">
              <label class="velin-label" for="pg-email">Work email</label>
              <input class="velin-input" id="pg-email" type="email" required autocomplete="email" placeholder="you@company.com">
            </div>
            <button type="submit" class="velin-btn velin-btn--primary">Save</button>
            <span data-form-status hidden></span>
          </div>
        </form>
      </div>
      <div class="expo-code-row">
        <velin-code-block language="html" collapsed>&lt;velin-theme-toggle themes-base="dist/themes/"&gt;&lt;/velin-theme-toggle&gt;
&lt;button class="velin-btn velin-btn--primary"&gt;Invite&lt;/button&gt;</velin-code-block>
        <button type="button" class="velin-btn velin-btn--ghost velin-btn--sm" data-copy='&lt;button class="velin-btn velin-btn--primary"&gt;Invite&lt;/button&gt;'>Copy Code</button>
      </div>
      ${links('docs/guides/design-tokens.html')}
    </section>

    <section class="expo-section" id="whats-new" aria-labelledby="whats-new-title">
      <header class="expo-section__header">
        <p class="expo-kicker">What's New ${V}</p>
        <h2 id="whats-new-title">Was ist neu in Core + Design Intelligence?</h2>
        <p>Knowledge Graph, Page Registry, Blueprints, Prompt Engine, Review Engine, AI Metadata — live statt Folien.</p>
      </header>
      <div class="expo-variant-grid">
        <article class="expo-variant-card"><h3>Design Intelligence</h3><p class="velin-text-sm" style="margin:0;color:var(--velin-color-text-muted)">Purpose, compatibility, constraints.</p><span class="velin-badge">components.json</span></article>
        <article class="expo-variant-card"><h3>Page Registry</h3><p class="velin-text-sm" style="margin:0;color:var(--velin-color-text-muted)">17 page types with required sections.</p><span class="velin-badge">pages.json</span></article>
        <article class="expo-variant-card"><h3>Blueprints</h3><p class="velin-text-sm" style="margin:0;color:var(--velin-color-text-muted)">Trust, FAQ, CTA, contact with form-summary.</p><span class="velin-badge">sections</span></article>
        <article class="expo-variant-card"><h3>AI Metadata</h3><p class="velin-text-sm" style="margin:0;color:var(--velin-color-text-muted)">velin-agent.json + llms.txt for agents.</p><a class="velin-btn velin-btn--sm velin-btn--outline" href="dist/velin-agent.json">Open JSON</a></article>
      </div>
      <div class="expo-preview">
        <div class="expo-controls" style="margin-bottom:var(--velin-space-3)">
          <button type="button" class="velin-btn velin-btn--primary" id="runPromptPipeline">Run prompt pipeline</button>
        </div>
        <div class="expo-pipeline" id="promptPipeline" role="list">
          <div class="expo-pipeline__step" role="listitem" aria-current="step">analyze</div>
          <div class="expo-pipeline__step" role="listitem">plan</div>
          <div class="expo-pipeline__step" role="listitem">render</div>
          <div class="expo-pipeline__step" role="listitem">review</div>
        </div>
        <p id="promptOut" class="expo-a11y-note" style="margin-top:var(--velin-space-3)">analyze: intent=saas landing, sections=hero/pricing/faq</p>
        <div class="expo-score-grid" style="margin-top:var(--velin-space-3)">
          <div class="expo-score"><strong>9.2</strong><span>Design</span></div>
          <div class="expo-score"><strong>9.8</strong><span>A11y</span></div>
          <div class="expo-score"><strong>8.7</strong><span>SEO</span></div>
          <div class="expo-score"><strong>9.0</strong><span>Perf</span></div>
          <div class="expo-score"><strong>8.9</strong><span>Conversion</span></div>
          <div class="expo-score"><strong>9.4</strong><span>Prompt</span></div>
        </div>
      </div>
      ${links('docs/guides/velin-meta.html', '<a class="velin-btn velin-btn--ghost velin-btn--sm" href="dist/llms.txt">llms.txt</a>')}
    </section>

    <section class="expo-section" id="pages" aria-labelledby="pages-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Page-Type Gallery</p>
        <h2 id="pages-title">Welche Seitentypen kennt das System?</h2>
        <p>17 Registry-Typen aus 1.2.0. Jede Mini-Surface nutzt echte Buttons, Cards und Badges.</p>
      </header>
      <div class="expo-variant-grid">
        ${pages.map((p) => `
        <article class="expo-mini-surface">
          <div class="expo-mini-surface__bar"><span>${p}</span><span class="velin-badge velin-badge--outline">page</span></div>
          <div class="expo-mini-surface__body">
            <strong class="velin-text-sm">${p} surface</strong>
            <div class="velin-flex velin-flex--gap-2">
              <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Primary</button>
              <button type="button" class="velin-btn velin-btn--ghost velin-btn--sm">Secondary</button>
            </div>
          </div>
        </article>`).join('')}
      </div>
      ${links('docs/generated/index.html')}
    </section>

    <section class="expo-section" id="blueprints" aria-labelledby="blueprints-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Blueprint Gallery</p>
        <h2 id="blueprints-title">Welche Sections kann man kombiniert rendern?</h2>
        <p>Trust, Benefits, Services, Process, Testimonials, FAQ, CTA, Contact — echte Blueprint-Bausteine.</p>
      </header>
      <div class="expo-preview">
        <p class="velin-text-sm" style="color:var(--velin-color-text-muted);margin:0 0 var(--velin-space-3)">Trusted by teams who value clarity</p>
        <ul class="velin-flex velin-flex--wrap velin-flex--gap-4" style="list-style:none;padding:0;margin:0 0 var(--velin-space-4)">
          <li><strong>Acme Audit</strong></li><li><strong>Nordic Ledger</strong></li><li><strong>Rhein Finance</strong></li><li><strong>Helix Tax</strong></li>
        </ul>
        <div class="velin-grid velin-grid--auto-fit velin-grid--gap-4">
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Clarity first</h3><p class="velin-card__text">Plain-language guidance.</p></div></article>
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Reliable process</h3><p class="velin-card__text">Predictable delivery steps.</p></div></article>
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Accessible default</h3><p class="velin-card__text">Contrast, focus, motion prefs.</p></div></article>
        </div>
        <div style="margin-top:var(--velin-space-4)">
          <velin-accordion>
            <details open><summary>What happens in the first meeting?</summary><p>Goals, documents, next steps.</p></details>
            <details><summary>Do you work remotely?</summary><p>Yes — secure exchange and scheduled calls.</p></details>
          </velin-accordion>
        </div>
        <div class="velin-flex velin-flex--justify-center" style="margin-top:var(--velin-space-4)">
          <a class="velin-btn velin-btn--primary" href="#forms">Ready to talk?</a>
        </div>
      </div>
      ${links('docs/generated/index.html')}
    </section>

    <section class="expo-section" id="heroes" aria-labelledby="heroes-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Hero Gallery</p>
        <h2 id="heroes-title">Wann welcher Hero sinnvoll ist?</h2>
        <p>12 Layouts mit Use Case, Live Preview, Mobile, Dark, A11y, Komponenten und Utilities.</p>
      </header>
      <div class="velin-flex velin-flex--wrap velin-flex--gap-2" role="toolbar" aria-label="Hero picker">
        ${heroes.map((h, i) => `<button type="button" class="velin-btn velin-btn--${i === 0 ? 'primary' : 'outline'} velin-btn--sm" data-hero-pick="${h.id}" aria-pressed="${i === 0}">${h.title}</button>`).join('')}
      </div>
      ${heroes.map((h, i) => `
      <div class="expo-preview" data-hero-panel="${h.id}" ${i === 0 ? '' : 'hidden'}>
        <div class="expo-split expo-split--2">
          <div>
            <p class="expo-kicker">${h.title}</p>
            <h3 class="velin-text-2xl" style="margin:0 0 var(--velin-space-2)">${h.title} Hero</h3>
            <p style="margin:0 0 var(--velin-space-3);color:var(--velin-color-text-muted)">${h.use}</p>
            <div class="velin-flex velin-flex--gap-2 velin-flex--wrap">
              <button type="button" class="velin-btn velin-btn--primary">Primary CTA</button>
              <button type="button" class="velin-btn velin-btn--outline">Secondary</button>
            </div>
            <p class="expo-a11y-note" style="margin-top:var(--velin-space-3)">A11y: one H1, landmark section, CTA contrast, focus visible. Components: ${h.comps}. Utilities: ${h.utils}.</p>
            <div class="expo-hero-card-actions" style="margin-top:var(--velin-space-2)">
              <button type="button" class="velin-btn velin-btn--ghost velin-btn--sm" data-copy="&lt;section class=&quot;velin-container&quot;&gt;…&lt;/section&gt;">Copy Code</button>
              <a class="velin-btn velin-btn--ghost velin-btn--sm" href="demos/index.html">Playground öffnen</a>
              <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/components/buttons.html">Docs</a>
            </div>
          </div>
          <div class="expo-split">
            <div class="expo-device expo-device--mobile">
              <div class="expo-device__screen velin-p-4">
                <strong>${h.title}</strong>
                <p class="velin-text-sm" style="color:var(--velin-color-text-muted)">${h.use}</p>
                <button type="button" class="velin-btn velin-btn--primary velin-btn--sm velin-btn--block">CTA</button>
              </div>
            </div>
            <div class="expo-dark-frame" data-velin-theme="dark">
              <strong>${h.title} · Dark</strong>
              <p class="velin-text-sm">Same tokens, dark surface.</p>
              <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">CTA</button>
            </div>
          </div>
        </div>
      </div>`).join('')}
      ${links('docs/components/buttons.html')}
    </section>

    <section class="expo-section" id="navigation" aria-labelledby="navigation-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Navigation Gallery</p>
        <h2 id="navigation-title">Welche Navigation passt zu welchem Produkt?</h2>
        <p>15 live bedienbare Muster: Sticky, Mega, Sidebar, Drawer, Offcanvas, Breadcrumb und mehr.</p>
      </header>
      <div class="expo-variant-grid">
        <article class="expo-variant-card">
          <h3>Sticky</h3>
          <div class="expo-nav-demo" style="max-height:10rem;overflow:auto">
            <nav class="velin-nav velin-nav--sticky" aria-label="Sticky demo">
              <a class="velin-nav__brand" href="#navigation">Sticky</a>
              <ul class="velin-nav__list"><li><a class="velin-nav__link" href="#navigation" aria-current="page">Home</a></li><li><a class="velin-nav__link" href="#buttons">Docs</a></li></ul>
            </nav>
            <div class="expo-nav-demo__body">Scroll content…<br><br>More content<br><br>End</div>
          </div>
        </article>
        <article class="expo-variant-card">
          <h3>Transparent</h3>
          <div class="expo-nav-demo" style="background:linear-gradient(120deg,var(--velin-color-primary-subtle, #ddd),var(--velin-color-surface))">
            <nav class="velin-nav velin-nav--transparent" aria-label="Transparent demo">
              <a class="velin-nav__brand" href="#navigation">Brand</a>
              <ul class="velin-nav__list"><li><a class="velin-nav__link" href="#navigation">Product</a></li><li><a class="velin-nav__link" href="#pricing">Pricing</a></li></ul>
            </nav>
          </div>
        </article>
        <article class="expo-variant-card">
          <h3>Mega Menu</h3>
          <div class="expo-nav-demo">
            <nav class="velin-nav" aria-label="Mega demo">
              <a class="velin-nav__brand" href="#navigation">Mega</a>
              <ul class="velin-nav__list">
                <li class="velin-nav__item">
                  <a class="velin-nav__link" href="#navigation">Platform</a>
                  <div class="velin-nav__mega" role="region" aria-label="Platform menu">
                    <div class="velin-nav__mega-section"><p class="velin-nav__mega-title">Build</p><a href="#contracts">Components</a><a href="#tokens">Tokens</a></div>
                    <div class="velin-nav__mega-section"><p class="velin-nav__mega-title">Ship</p><a href="#testing">A11y</a><a href="#install">Install</a></div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </article>
        <article class="expo-variant-card">
          <h3>Sidebar / Docs / App Shell</h3>
          <div class="expo-sidebar-shell">
            <nav aria-label="Sidebar demo">
              <a href="#navigation" aria-current="page">Overview</a>
              <a href="#contracts">Components</a>
              <a href="#utilities">Utilities</a>
              <a href="#tokens">Tokens</a>
            </nav>
            <div class="velin-p-3"><p class="velin-text-sm" style="margin:0">Docs / Dashboard / App Shell rail.</p></div>
          </div>
        </article>
        <article class="expo-variant-card">
          <h3>Centered / Split / Minimal / Enterprise</h3>
          <nav class="velin-nav velin-flex--justify-center" aria-label="Centered" style="justify-content:center">
            <ul class="velin-nav__list"><li><a class="velin-nav__link" href="#navigation">Work</a></li><li><a class="velin-nav__link" href="#showcase">Studio</a></li><li><a class="velin-nav__link" href="#install">Contact</a></li></ul>
          </nav>
          <nav class="velin-nav" aria-label="Split" style="margin-top:0.5rem">
            <a class="velin-nav__brand" href="#navigation">Split</a>
            <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Sign in</button>
          </nav>
        </article>
        <article class="expo-variant-card">
          <h3>Mobile + Drawer + Offcanvas</h3>
          <div class="velin-flex velin-flex--gap-2 velin-flex--wrap">
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-nav-toggle="mobileNavList" aria-expanded="false" aria-controls="mobileNavList">Mobile toggle</button>
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="navDemoDrawer">Open Drawer</button>
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="navOffcanvas">Open Offcanvas</button>
          </div>
          <ul class="velin-nav__list" id="mobileNavList" style="flex-direction:column;margin-top:0.5rem">
            <li><a class="velin-nav__link" href="#buttons">Buttons</a></li>
            <li><a class="velin-nav__link" href="#forms">Forms</a></li>
          </ul>
        </article>
        <article class="expo-variant-card">
          <h3>Breadcrumb</h3>
          <nav aria-label="Breadcrumb">
            <ol class="expo-breadcrumb">
              <li><a href="#hero">Home</a></li>
              <li><a href="#navigation">Navigation</a></li>
              <li aria-current="page">Breadcrumb</li>
            </ol>
          </nav>
        </article>
        <article class="expo-variant-card">
          <h3>Dashboard top</h3>
          <nav class="velin-nav" aria-label="Dashboard top">
            <a class="velin-nav__brand" href="#dashboard">Ops</a>
            <ul class="velin-nav__list">
              <li><a class="velin-nav__link" href="#dashboard" aria-current="page">Overview</a></li>
              <li><a class="velin-nav__link" href="#tables">Reports</a></li>
            </ul>
            <velin-theme-toggle themes-base="dist/themes/"></velin-theme-toggle>
          </nav>
        </article>
      </div>
      <p class="expo-a11y-note">Keyboard: Tab durch Links, Esc schließt Drawer/Sheet, aria-current markiert aktive Seite. Patterns: ${navVariants.join(', ')}.</p>
      ${links('docs/components/navbar.html')}
    </section>

    <section class="expo-section" id="buttons" aria-labelledby="buttons-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Button Gallery</p>
        <h2 id="buttons-title">Wie sehen Buttons aus?</h2>
        <p>20 echte Varianten. States, Größen, Icons, Danger, Ghost, Loading, Disabled.</p>
      </header>
      <div class="expo-preview">
        <div class="expo-variant-grid expo-variant-grid--dense">
          ${buttonVariants.map(([key, label]) => {
            const disabled = key.includes('disabled') ? ' disabled' : '';
            const content = key.includes('icon') ? '★' : (key.includes('close') ? '' : label);
            const aria = key.includes('icon') ? ' aria-label="Favorite"' : (key.includes('close') ? ' aria-label="Close"' : '');
            return `<button type="button" class="${btnClass(key)}"${disabled}${aria}>${content}</button>`;
          }).join('\n          ')}
        </div>
        <div class="velin-btn-group" style="margin-top:var(--velin-space-4)" role="group" aria-label="Button group">
          <button type="button" class="velin-btn velin-btn--outline">Left</button>
          <button type="button" class="velin-btn velin-btn--outline">Middle</button>
          <button type="button" class="velin-btn velin-btn--outline">Right</button>
        </div>
      </div>
      <div class="expo-code-row">
        <velin-code-block language="html" collapsed>&lt;button class="velin-btn velin-btn--primary"&gt;Primary&lt;/button&gt;
&lt;button class="velin-btn velin-btn--outline velin-btn--sm"&gt;Outline&lt;/button&gt;
&lt;button class="velin-btn velin-btn--danger velin-btn--loading" aria-busy="true"&gt;Saving&lt;/button&gt;</velin-code-block>
        <button type="button" class="velin-btn velin-btn--ghost velin-btn--sm" data-copy='&lt;button class="velin-btn velin-btn--primary"&gt;Primary&lt;/button&gt;'>Copy Code</button>
      </div>
      ${links('docs/components/buttons.html')}
    </section>
`;

// Part 2 continues - forms through install
const html2 = `
    <section class="expo-section" id="forms" aria-labelledby="forms-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Form Gallery</p>
        <h2 id="forms-title">Wie sehen komplette Form-Workflows aus?</h2>
        <p>Login bis Upload, Validation, Error Summary, Success, Loading, Disabled, Readonly — alles live mit velin-form-summary.</p>
      </header>
      <div class="expo-form-grid">
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Login</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="login-email">Email</label><input class="velin-input" id="login-email" type="email" required autocomplete="username"></div>
          <div class="velin-field"><label class="velin-label" for="login-pass">Password</label><input class="velin-input" id="login-pass" type="password" required autocomplete="current-password"></div>
          <button type="submit" class="velin-btn velin-btn--primary" data-loading-submit>Sign in</button>
          <span data-form-status hidden></span>
        </form>
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Register</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="reg-name">Name</label><input class="velin-input" id="reg-name" required autocomplete="name"></div>
          <div class="velin-field"><label class="velin-label" for="reg-email">Email</label><input class="velin-input" id="reg-email" type="email" required autocomplete="email"></div>
          <div class="velin-field"><label class="velin-label" for="reg-pass">Password</label><input class="velin-input" id="reg-pass" type="password" required minlength="8" autocomplete="new-password"></div>
          <button type="submit" class="velin-btn velin-btn--primary">Create account</button>
          <span data-form-status hidden></span>
        </form>
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Checkout</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="co-card">Card number</label><input class="velin-input" id="co-card" required inputmode="numeric" autocomplete="cc-number"></div>
          <div class="velin-field"><label class="velin-label" for="co-exp">Expiry</label><input class="velin-input" id="co-exp" required autocomplete="cc-exp" placeholder="MM/YY"></div>
          <button type="submit" class="velin-btn velin-btn--success">Pay €49</button>
          <span data-form-status hidden></span>
        </form>
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Contact</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="c-name">Name</label><input class="velin-input" id="c-name" required autocomplete="name"></div>
          <div class="velin-field"><label class="velin-label" for="c-msg">Message</label><textarea class="velin-input" id="c-msg" rows="3" required></textarea></div>
          <button type="submit" class="velin-btn velin-btn--primary">Send</button>
          <span data-form-status hidden></span>
        </form>
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Newsletter</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="nl-email">Email</label><input class="velin-input" id="nl-email" type="email" required autocomplete="email"></div>
          <button type="submit" class="velin-btn velin-btn--outline">Subscribe</button>
          <span data-form-status hidden></span>
        </form>
        <div class="expo-form-panel">
          <h3>Wizard</h3>
          <velin-stepper labels="Account,Workspace,Invite" active="1">
            <section><p class="velin-text-sm" style="margin:0">Account complete.</p></section>
            <section><p class="velin-text-sm" style="margin:0">Workspace — active.</p></section>
            <section><p class="velin-text-sm" style="margin:0">Invite teammates.</p></section>
          </velin-stepper>
        </div>
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Appointment</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="ap-date">Date</label><input class="velin-input" id="ap-date" type="date" required></div>
          <div class="velin-field"><label class="velin-label" for="ap-time">Time</label><input class="velin-input" id="ap-time" type="time" required></div>
          <button type="submit" class="velin-btn velin-btn--primary">Book</button>
          <span data-form-status hidden></span>
        </form>
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Support</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="su-topic">Topic</label>
            <select class="velin-input" id="su-topic" required><option value="">Select…</option><option>Billing</option><option>Bug</option><option>Access</option></select>
          </div>
          <div class="velin-field"><label class="velin-label" for="su-desc">Description</label><textarea class="velin-input" id="su-desc" rows="3" required></textarea></div>
          <button type="submit" class="velin-btn velin-btn--primary">Open ticket</button>
          <span data-form-status hidden></span>
        </form>
        <div class="expo-form-panel">
          <h3>Search</h3>
          <velin-search index="dist/search-index.json" categories="docs,components,api" placeholder="Search docs…" min-chars="2" fuzzy="0.25" aria-label="Documentation search"></velin-search>
        </div>
        <form class="expo-form-panel" data-expo-form novalidate>
          <h3>Upload</h3>
          <velin-form-summary></velin-form-summary>
          <div class="velin-field"><label class="velin-label" for="up-file">File</label><input class="velin-input" id="up-file" type="file" required></div>
          <button type="submit" class="velin-btn velin-btn--primary" data-loading-submit>Upload</button>
          <span data-form-status hidden></span>
        </form>
        <div class="expo-form-panel">
          <h3>Disabled / Readonly</h3>
          <div class="velin-field"><label class="velin-label" for="dis-email">Disabled</label><input class="velin-input" id="dis-email" value="locked@acme.com" disabled></div>
          <div class="velin-field"><label class="velin-label" for="ro-email">Readonly</label><input class="velin-input" id="ro-email" value="read@acme.com" readonly></div>
        </div>
        <div class="expo-form-panel">
          <h3>Validation · Error · Success</h3>
          <p class="velin-text-sm" style="margin:0">Submit empty Login/Contact to see Error Summary. Valid submit shows Success + Loading.</p>
          <span class="velin-badge velin-badge--danger">aria-invalid</span>
          <span class="velin-badge velin-badge--success">success state</span>
        </div>
      </div>
      ${links('docs/components/form-summary.html')}
    </section>

    <section class="expo-section" id="cards" aria-labelledby="cards-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Card Gallery</p>
        <h2 id="cards-title">Wie sehen Cards aus?</h2>
        <p>Feature, Pricing, Metric, Testimonial, Product, Team, Case, Notification, Dashboard — echte velin-card Surfaces.</p>
      </header>
      <div class="velin-grid velin-grid--auto-fit velin-grid--gap-4">
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Feature</h3><p class="velin-card__text">Token-backed spacing and type.</p><button type="button" class="velin-btn velin-btn--outline velin-btn--sm">Learn more</button></div></article>
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Pricing · Pro</h3><p class="velin-text-3xl" style="margin:0;font-weight:700">€12</p><p class="velin-card__text">Unlimited projects.</p><button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Choose</button></div></article>
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Metric</h3><p class="velin-text-3xl" style="margin:0;font-weight:700">98.4%</p><span class="velin-badge velin-badge--success">uptime</span></div></article>
        <article class="velin-card"><div class="velin-card__body"><blockquote class="velin-card__text">“Clear advice and a process we could follow.”</blockquote><p class="velin-text-sm" style="color:var(--velin-color-text-muted)">— A. Meyer</p></div></article>
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Product</h3><velin-rating value="4"></velin-rating><p class="velin-card__text">Accessible by default.</p></div></article>
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Team</h3><p class="velin-card__text">Design Systems · Berlin</p><span class="velin-badge">Hiring</span></div></article>
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Case Study</h3><p class="velin-card__text">Portal rebuild in 6 weeks.</p><a class="velin-btn velin-btn--ghost velin-btn--sm" href="#showcase">View</a></div></article>
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Notification</h3><p class="velin-card__text">Invoice #1042 paid.</p><velin-live-dot label="New"></velin-live-dot></div></article>
        <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Dashboard</h3><velin-sparkline values="3,5,4,7,6,9" label="Trend" area></velin-sparkline></div></article>
      </div>
      ${links('docs/components/card.html')}
    </section>

    <section class="expo-section" id="tables" aria-labelledby="tables-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Data Table</p>
        <h2 id="tables-title">Wie sehen Data Tables aus?</h2>
        <p>velin-data-table mit Sort, Filter, Pagination und Empty State — live, nicht als Screenshot.</p>
      </header>
      <div class="expo-preview">
        <div class="velin-field" style="max-width:20rem;margin-bottom:var(--velin-space-3)">
          <label class="velin-label" for="tableFilter">Filter invoices</label>
          <input class="velin-input" id="tableFilter" type="search" placeholder="Search…">
        </div>
        <velin-data-table page-size="4" filter-input="tableFilter" empty-text="No invoices match." label="Invoices">
          <table class="velin-table">
            <caption class="velin-sr-only">Recent invoices</caption>
            <thead>
              <tr>
                <th scope="col" data-sort="text">Invoice</th>
                <th scope="col" data-sort="text">Customer</th>
                <th scope="col" data-sort="text">Status</th>
                <th scope="col" data-sort="number">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>#1042</td><td>Acme Audit</td><td><span class="velin-badge velin-badge--success">Paid</span></td><td data-sort-value="129">€129</td></tr>
              <tr><td>#1041</td><td>Nordic Ledger</td><td><span class="velin-badge">Open</span></td><td data-sort-value="49">€49</td></tr>
              <tr><td>#1040</td><td>Rhein Finance</td><td><span class="velin-badge velin-badge--warning">Due</span></td><td data-sort-value="890">€890</td></tr>
              <tr><td>#1039</td><td>Helix Tax</td><td><span class="velin-badge velin-badge--success">Paid</span></td><td data-sort-value="220">€220</td></tr>
              <tr><td>#1038</td><td>BirdAPI</td><td><span class="velin-badge">Open</span></td><td data-sort-value="59">€59</td></tr>
              <tr><td>#1037</td><td>Insel Sorglos</td><td><span class="velin-badge velin-badge--success">Paid</span></td><td data-sort-value="310">€310</td></tr>
            </tbody>
          </table>
        </velin-data-table>
      </div>
      ${links('docs/components/data-table.html')}
    </section>

    <section class="expo-section" id="contracts" aria-labelledby="contracts-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Component Contracts</p>
        <h2 id="contracts-title">Wann welche Overlay-Komponente?</h2>
        <p>Kurz: Zweck, Wann / Wann nicht, Keyboard, ARIA, API — dann Live-Demo.</p>
      </header>
      <div class="expo-variant-grid">
        <article class="expo-variant-card">
          <h3>Modal</h3>
          <p class="velin-text-sm" style="margin:0">Blocking decision. Use for confirm/pay. Not for navigation.</p>
          <p class="expo-a11y-note">Esc, focus trap, aria-modal. Keyboard: Tab cycle.</p>
          <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-open="expoModal">Open modal</button>
        </article>
        <article class="expo-variant-card">
          <h3>Drawer</h3>
          <p class="velin-text-sm" style="margin:0">Side navigation / filters. Not for critical confirms.</p>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="expoDrawer">Open drawer</button>
        </article>
        <article class="expo-variant-card">
          <h3>Sheet</h3>
          <p class="velin-text-sm" style="margin:0">Secondary tasks, carts, notes. Keep forms short.</p>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="expoSheet">Open sheet</button>
        </article>
        <article class="expo-variant-card">
          <h3>Popover / Tooltip</h3>
          <velin-popover>
            <button type="button" slot="trigger" class="velin-btn velin-btn--secondary velin-btn--sm">Popover</button>
            <p style="margin:0">Extra actions without a modal.</p>
          </velin-popover>
          <button type="button" class="velin-btn velin-btn--ghost velin-btn--sm" aria-label="Help"><velin-tooltip content="Focus + Esc dismiss">?</velin-tooltip></button>
        </article>
        <article class="expo-variant-card">
          <h3>Accordion / Tabs / Toast</h3>
          <velin-tabs>
            <button type="button" role="tab" aria-selected="true" id="ct-a" aria-controls="cp-a">Overview</button>
            <button type="button" role="tab" id="ct-b" aria-controls="cp-b">API</button>
            <div role="tabpanel" id="cp-a" aria-labelledby="ct-a"><p class="velin-text-sm" style="margin:0">Roving tabindex.</p></div>
            <div role="tabpanel" id="cp-b" aria-labelledby="ct-b" hidden><p class="velin-text-sm" style="margin:0">Events bubble.</p></div>
          </velin-tabs>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-toast="info" data-toast-msg="Saved draft">Toast</button>
        </article>
        <article class="expo-variant-card">
          <h3>Search / Code / Sparkline</h3>
          <velin-code-block language="js" collapsed>bootFromDOM({ attributes: true, motion: true });</velin-code-block>
          <velin-sparkline values="1,3,2,5,4,7" label="Mini trend"></velin-sparkline>
        </article>
      </div>
      ${links('docs/components/modal.html')}
    </section>

    <section class="expo-section" id="charts" aria-labelledby="charts-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Charts</p>
        <h2 id="charts-title">Wie sehen Charts und KPIs aus?</h2>
        <p>velin-sparkline mit area/glow/animate — Update live per Button.</p>
      </header>
      <div class="expo-preview">
        <div class="expo-kpi-grid">
          <article class="velin-card"><div class="velin-card__body">
            <h3 class="velin-card__title">Revenue</h3>
            <velin-sparkline id="liveSpark" values="4,6,5,8,7,10,9,12" area glow animate="draw" label="Revenue sparkline"></velin-sparkline>
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="updateSpark">Update data</button>
          </div></article>
          <article class="velin-card"><div class="velin-card__body">
            <h3 class="velin-card__title">Progress</h3>
            <velin-progress-ring value="72" size="96" stroke="8" label="72 percent complete"></velin-progress-ring>
          </div></article>
          <article class="velin-card"><div class="velin-card__body">
            <h3 class="velin-card__title">Count up</h3>
            <velin-counter from="0" to="1280" duration="1200"></velin-counter>
          </div></article>
        </div>
      </div>
      ${links('docs/components/sparkline.html')}
    </section>

    <section class="expo-section" id="dashboard" aria-labelledby="dashboard-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Dashboard</p>
        <h2 id="dashboard-title">Wie sieht ein echtes Dashboard aus?</h2>
        <p>App Shell mit Sidebar, KPIs, Table, Tabs, Drawer-Trigger und Theme Switch — alles VelinStyle.</p>
      </header>
      <div class="expo-dash">
        <aside class="expo-dash__rail" aria-label="Dashboard sections">
          <a href="#dashboard" aria-current="page">Overview</a>
          <a href="#tables">Invoices</a>
          <a href="#forms">Support</a>
          <a href="#charts">Analytics</a>
        </aside>
        <div class="expo-dash__main">
          <div class="velin-flex velin-flex--justify-between velin-flex--items-center velin-flex--wrap">
            <h3 class="velin-text-xl" style="margin:0">Active workspace</h3>
            <div class="velin-flex velin-flex--gap-2">
              <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-open="expoSheet">Filters</button>
              <velin-theme-toggle themes-base="dist/themes/"></velin-theme-toggle>
            </div>
          </div>
          <div class="expo-kpi-grid">
            <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Seats</h3><p class="velin-text-2xl" style="margin:0;font-weight:700">42</p></div></article>
            <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Tickets</h3><p class="velin-text-2xl" style="margin:0;font-weight:700">7</p></div></article>
            <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Trend</h3><velin-sparkline values="2,3,5,4,6,8" label="Workspace trend"></velin-sparkline></div></article>
          </div>
          <velin-tabs>
            <button type="button" role="tab" aria-selected="true" id="dash-a" aria-controls="dash-pa">Invoices</button>
            <button type="button" role="tab" id="dash-b" aria-controls="dash-pb">Activity</button>
            <div role="tabpanel" id="dash-pa" aria-labelledby="dash-a">
              <table class="velin-table">
                <caption class="velin-sr-only">Dashboard invoices</caption>
                <thead><tr><th scope="col">Invoice</th><th scope="col">Status</th><th scope="col">Total</th></tr></thead>
                <tbody>
                  <tr><td>#1042</td><td><span class="velin-badge velin-badge--success">Paid</span></td><td>€129</td></tr>
                  <tr><td>#1041</td><td><span class="velin-badge">Open</span></td><td>€49</td></tr>
                </tbody>
              </table>
            </div>
            <div role="tabpanel" id="dash-pb" aria-labelledby="dash-b" hidden>
              <p class="velin-text-sm" style="margin:0">Deploy succeeded · seat invite sent · theme switched.</p>
            </div>
          </velin-tabs>
        </div>
      </div>
      ${links('docs/components/index.html')}
    </section>
`;

const html3 = `
    <section class="expo-section" id="utilities" aria-labelledby="utilities-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Utility Playground</p>
        <h2 id="utilities-title">Wie wirken Utilities live auf Layout und State?</h2>
        <p>Spacing, Grid, Flex, Typography, Radius, Shadow, Overflow, Aspect, Dark, Hover, Focus, Container Queries — mit Reglern.</p>
      </header>
      <div class="expo-util-lab">
        <div class="expo-util-lab__controls">
          <label>Padding<select id="utilPad" class="velin-input"><option>2</option><option selected>4</option><option>6</option><option>8</option></select></label>
          <label>Gap<select id="utilGap" class="velin-input"><option>2</option><option selected>3</option><option>4</option><option>6</option></select></label>
          <label>Radius<select id="utilRadius" class="velin-input"><option value="none">none</option><option value="sm">sm</option><option selected value="md">md</option><option value="lg">lg</option><option value="full">full</option></select></label>
          <label>Shadow<select id="utilShadow" class="velin-input"><option value="none">none</option><option value="sm">sm</option><option value="md">md</option><option value="lg">lg</option></select></label>
          <label>Display<select id="utilDisplay" class="velin-input"><option value="grid">grid</option><option value="flex">flex</option><option value="block">block</option></select></label>
          <label>Align<select id="utilAlign" class="velin-input"><option>start</option><option>center</option><option>end</option></select></label>
          <label>Justify<select id="utilJustify" class="velin-input"><option>start</option><option>center</option><option>between</option><option>end</option></select></label>
          <label>Overflow<select id="utilOverflow" class="velin-input"><option>visible</option><option>hidden</option><option>auto</option></select></label>
          <label>Aspect<select id="utilAspect" class="velin-input"><option value="">auto</option><option value="16/9">16/9</option><option value="1">1/1</option></select></label>
          <label><input id="utilDark" type="checkbox"> Dark</label>
          <label><input id="utilHover" type="checkbox"> Hover attr</label>
          <label><input id="utilCq" type="checkbox"> Container Queries</label>
          <p class="velin-text-sm" style="margin:0">Classes: <code id="utilClassOut"></code></p>
        </div>
        <div id="utilTarget" class="expo-util-target">
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Card A</h3><p class="velin-card__text">Utility target</p></div></article>
          <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Card B</h3><p class="velin-card__text">Live rearrange</p></div></article>
          <button type="button" class="velin-btn velin-btn--primary">Focus me</button>
        </div>
      </div>
      <p class="expo-a11y-note">Categories from 1.2.0 docs: spacing, display, position, border, text, responsive, state, animation, view-transition, container-style, scroll, sizing…</p>
      ${links('docs/layout/utilities.html')}
    </section>

    <section class="expo-section" id="tokens" aria-labelledby="tokens-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Token Lab</p>
        <h2 id="tokens-title">Wie verändert sich dieselbe Oberfläche mit Tokens?</h2>
        <p>Spacing, Radius, Elevation, Density, Surface, Motion — live auf Nav, Card, Form, Chart und CTA.</p>
      </header>
      <div class="expo-controls">
        <label>Theme<select class="velin-input" data-expo-theme>
          <option value="light">Light</option><option value="dark">Dark</option>
          <option value="ocean">Ocean</option><option value="forest">Forest</option>
          <option value="midnight">Midnight</option><option value="soft">Soft</option>
          <option value="sharp">Sharp</option><option value="brutalist">Brutalist</option>
        </select></label>
        <label>Density <input id="tokenDensity" type="range" min="0.8" max="1.3" step="0.05" value="1"></label>
        <label>Radius <input id="tokenRadius" type="range" min="0.15" max="1.5" step="0.05" value="0.75"></label>
        <label>Gap <input id="tokenGap" type="range" min="0.4" max="2" step="0.1" value="0.75"></label>
        <label>Elevation<select id="tokenElev" class="velin-input"><option value="none">none</option><option value="mid">mid</option><option value="high">high</option></select></label>
        <label>Surface<select id="tokenSurfaceTone" class="velin-input"><option value="default">default</option><option value="dim">dim</option><option value="bright">bright</option></select></label>
        <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="tokenMotion" aria-pressed="false">Motion off</button>
      </div>
      <div class="expo-token-surface" id="tokenSurface" data-elev="none" data-motion="on">
        <nav class="velin-nav" aria-label="Token lab nav">
          <a class="velin-nav__brand" href="#tokens">Token Lab</a>
          <ul class="velin-nav__list"><li><a class="velin-nav__link" href="#tokens" aria-current="page">Surface</a></li><li><a class="velin-nav__link" href="#animations">Motion</a></li></ul>
          <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-open="expoModal">Modal</button>
        </nav>
        <div class="expo-split expo-split--2">
          <article class="velin-card"><div class="velin-card__body">
            <h3 class="velin-card__title">Surface card</h3>
            <p class="velin-card__text">Radius, elevation, density cascade here.</p>
            <label class="velin-label" for="tok-input">Email</label>
            <input class="velin-input" id="tok-input" type="email" placeholder="token@lab.dev">
          </div></article>
          <div>
            <velin-sparkline values="2,5,3,7,6,9,8" area label="Token lab chart"></velin-sparkline>
            <table class="velin-table" style="margin-top:var(--velin-space-3)">
              <caption class="velin-sr-only">Token sample rows</caption>
              <thead><tr><th scope="col">Token</th><th scope="col">Value</th></tr></thead>
              <tbody><tr><td>radius</td><td>live</td></tr><tr><td>density</td><td>live</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
      ${links('docs/guides/design-tokens.html')}
    </section>

    <section class="expo-section" id="animations" aria-labelledby="animations-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Animation Gallery</p>
        <h2 id="animations-title">Welche Motion- und Feedback-Patterns gibt es?</h2>
        <p>Hover bis Theme Transition — alles anklickbar. Reduced motion wird respektiert.</p>
      </header>
      <div class="expo-anim-grid">
        <div class="expo-anim-tile" velin-hover><strong>Hover</strong><button type="button" class="velin-btn velin-btn--outline velin-btn--sm">Lift</button></div>
        <div class="expo-anim-tile"><strong>Focus</strong><button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Tab here</button></div>
        <div class="expo-anim-tile"><strong>Ripple</strong><button type="button" class="velin-btn velin-btn--secondary velin-btn--sm expo-ripple" id="rippleBtn" data-anim-trigger="rippleBtn">Click</button></div>
        <div class="expo-anim-tile"><strong>Expand / Collapse</strong>
          <velin-collapse><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" slot="trigger">Toggle</button><p class="velin-text-sm">Collapsed content</p></velin-collapse>
        </div>
        <div class="expo-anim-tile"><strong>Accordion</strong>
          <velin-accordion><details><summary>Open</summary><p class="velin-text-sm">Panel</p></details></velin-accordion>
        </div>
        <div class="expo-anim-tile"><strong>Drawer / Sheet / Modal</strong>
          <div class="velin-flex velin-flex--gap-1 velin-flex--wrap">
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="animDrawer">Drawer</button>
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="animSheet">Sheet</button>
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="animModal">Modal</button>
          </div>
        </div>
        <div class="expo-anim-tile"><strong>Tooltip / Popover</strong>
          <velin-tooltip content="Keyboard accessible"><button type="button" class="velin-btn velin-btn--ghost velin-btn--sm">Tip</button></velin-tooltip>
        </div>
        <div class="expo-anim-tile"><strong>Tabs</strong>
          <velin-tabs>
            <button type="button" role="tab" aria-selected="true" id="an-a" aria-controls="an-pa">A</button>
            <button type="button" role="tab" id="an-b" aria-controls="an-pb">B</button>
            <div role="tabpanel" id="an-pa" aria-labelledby="an-a"><span class="velin-text-sm">One</span></div>
            <div role="tabpanel" id="an-pb" aria-labelledby="an-b" hidden><span class="velin-text-sm">Two</span></div>
          </velin-tabs>
        </div>
        <div class="expo-anim-tile"><strong>Loading / Progress / Skeleton</strong>
          <span class="velin-spinner velin-spinner--sm" role="status" aria-label="Loading"></span>
          <velin-progress-ring value="45" size="48" stroke="5" label="45 percent"></velin-progress-ring>
          <span velin-skeleton="text"></span>
        </div>
        <div class="expo-anim-tile" velin-reveal="fade"><strong>Reveal / Scroll / Stagger</strong><span class="velin-badge" velin-stagger="40">A</span><span class="velin-badge" velin-stagger="40">B</span></div>
        <div class="expo-anim-tile" velin-parallax><strong>Parallax</strong><span class="velin-text-sm">attr live</span></div>
        <div class="expo-anim-tile"><strong>Count Up</strong><velin-counter from="0" to="42" duration="900"></velin-counter></div>
        <div class="expo-anim-tile"><strong>Theme / Page Transition</strong>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runThemeTransition">Theme</button>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runPageTransition">Page</button>
          <div id="pageTransitionBox" class="velin-badge">Surface</div>
        </div>
        <div class="expo-anim-tile"><strong>Auto Height</strong>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="toggleAutoHeight">Toggle</button>
          <div id="autoHeightBox" class="expo-auto-height velin-text-sm">Short<br>More lines appear when open.<br>Auto height demo.</div>
        </div>
        <div class="expo-anim-tile"><strong>Floating / Pulse</strong><span class="velin-badge velin-badge--primary expo-float">Float</span><span class="velin-badge expo-pulse">Pulse</span></div>
        <div class="expo-anim-tile"><strong>Shake / Attention</strong>
          <button type="button" class="velin-btn velin-btn--danger velin-btn--sm expo-shake" id="shakeBtn" data-anim-trigger="shakeBtn">Shake</button>
          <button type="button" class="velin-btn velin-btn--outline velin-btn--sm expo-attention" id="attnBtn" data-anim-trigger="attnBtn">Attention</button>
        </div>
        <div class="expo-anim-tile"><strong>Success / Error / Toast</strong>
          <button type="button" class="velin-btn velin-btn--success velin-btn--sm" data-toast="success" data-toast-msg="Saved">Success</button>
          <button type="button" class="velin-btn velin-btn--danger velin-btn--sm" data-toast="warning" data-toast-msg="Check fields">Error</button>
        </div>
      </div>
      ${links('docs/guides/motion-attributes.html')}
    </section>

    <section class="expo-section" id="testing" aria-labelledby="testing-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Live Testing</p>
        <h2 id="testing-title">Funktioniert Accessibility wirklich?</h2>
        <p>Keyboard, Focus, ARIA, Theme, Responsive, Motion, RTL und Review Scores — sichtbar prüfbar.</p>
      </header>
      <div class="expo-test-grid">
        <article class="expo-test-card" id="testA11y"><h3 class="velin-text-sm" style="margin:0">Accessibility Tester</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runA11yTest">Run</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testKeyboard"><h3 class="velin-text-sm" style="margin:0">Keyboard Test</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runKeyboardTest">Run</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card expo-focus-track" id="testFocus"><h3 class="velin-text-sm" style="margin:0">Focus Test</h3><button type="button" class="velin-btn velin-btn--primary velin-btn--sm" id="testFocusBtn">Focus target</button><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runFocusTest">Run</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testAria"><h3 class="velin-text-sm" style="margin:0">ARIA Test</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runAriaTest">Run</button><p id="testAriaLive" role="status" aria-live="polite" class="velin-text-sm" style="margin:0">idle</p><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testTheme"><h3 class="velin-text-sm" style="margin:0">Theme Test</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runThemeTest">Toggle</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testResponsive"><h3 class="velin-text-sm" style="margin:0">Responsive Test</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runResponsiveTest">Toggle frame</button><div id="responsiveTestBox" class="expo-device"><div class="expo-device__screen velin-p-3"><button type="button" class="velin-btn velin-btn--primary velin-btn--sm">CTA</button></div></div><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testMotion"><h3 class="velin-text-sm" style="margin:0">Motion Test</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runMotionTest">Run</button><span id="motionTestDot" class="velin-badge">dot</span><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testRtl"><h3 class="velin-text-sm" style="margin:0">RTL Test</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runRtlTest">Toggle RTL</button><div id="rtlTestBox" class="expo-rtl-box" dir="ltr"><nav class="velin-nav" aria-label="RTL"><a class="velin-nav__brand" href="#testing">Brand</a><button type="button" class="velin-btn velin-btn--sm velin-btn--primary">Action</button></nav></div><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
      </div>
      <div class="expo-score-grid">
        <div class="expo-score"><strong>9.8</strong><span>Review A11y</span></div>
        <div class="expo-score"><strong>9.2</strong><span>Design</span></div>
        <div class="expo-score"><strong>9.0</strong><span>Perf</span></div>
      </div>
      ${links('docs/getting-started/accessibility.html')}
    </section>

    <section class="expo-section" id="showcase" aria-labelledby="showcase-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Showcase</p>
        <h2 id="showcase-title">Welche echten Projekte laufen auf VelinStyle?</h2>
        <p>Screenshot, Branche, Komponenten, Utilities, Themes, Responsive, Dark, A11y, Live Demo, Code, Case Study.</p>
      </header>
      <div class="expo-showcase-grid" id="showcaseGrid">
        <p class="expo-a11y-note">Loading showcase…</p>
      </div>
      ${links('showcase/index.html')}
    </section>

    <section class="expo-section" id="compare" aria-labelledby="compare-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Live Comparison</p>
        <h2 id="compare-title">Worin unterscheidet sich VelinStyle live?</h2>
        <p>Dieselbe Aufgabe nebeneinander: Button + Card + Form Intent. Links Approximation, rechts echte VelinStyle-Komponenten.</p>
      </header>
      <h3 class="velin-text-base">Bootstrap → VelinStyle</h3>
      <div class="expo-compare">
        <div class="expo-compare__pane expo-compare__pane--foreign">
          <h3>Bootstrap-like</h3>
          <div class="fake-card"><p>Generic card</p><a class="fake-btn" href="#compare">Primary</a></div>
        </div>
        <div class="expo-compare__pane">
          <h3>VelinStyle</h3>
          <article class="velin-card"><div class="velin-card__body"><h4 class="velin-card__title">Token card</h4><p class="velin-card__text">AAA-oriented defaults.</p><button type="button" class="velin-btn velin-btn--primary">Primary</button></div></article>
        </div>
      </div>
      <h3 class="velin-text-base">Tailwind → VelinStyle</h3>
      <div class="expo-compare">
        <div class="expo-compare__pane expo-compare__pane--foreign">
          <h3>Utility-only sketch</h3>
          <button type="button" class="tw-btn">Save changes</button>
          <p style="margin:0;font-size:0.85rem;color:#64748b">Class soup, no component contract.</p>
        </div>
        <div class="expo-compare__pane">
          <h3>VelinStyle</h3>
          <button type="button" class="velin-btn velin-btn--primary">Save changes</button>
          <p class="velin-text-sm" style="margin:0;color:var(--velin-color-text-muted)">Utilities + contracts + a11y runtime.</p>
        </div>
      </div>
      <h3 class="velin-text-base">Shoelace → VelinStyle</h3>
      <div class="expo-compare">
        <div class="expo-compare__pane expo-compare__pane--foreign">
          <h3>WC sketch</h3>
          <button type="button" class="sl-btn">Open</button>
        </div>
        <div class="expo-compare__pane">
          <h3>VelinStyle</h3>
          <button type="button" class="velin-btn velin-btn--secondary" data-expo-open="expoModal">Open modal</button>
          <p class="velin-text-sm" style="margin:0;color:var(--velin-color-text-muted)">Same WC model + CSS design system + AI metadata.</p>
        </div>
      </div>
      ${links('docs/getting-started/introduction.html')}
    </section>

    <section class="expo-section" id="install" aria-labelledby="install-title">
      <header class="expo-section__header">
        <p class="expo-kicker">Install</p>
        <h2 id="install-title">Wie startet man mit VelinStyle ${V}?</h2>
        <p>npm pin, CDN, Runtime-Exports, Docs, Playground, Source — Copy und weiter.</p>
      </header>
      <div class="expo-install-cmd">
        <code>npm i @birdapi/velinstyle@${V}</code>
        <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-copy="npm i @birdapi/velinstyle@${V}">Copy</button>
        <velin-copy value="npm i @birdapi/velinstyle@${V}" label="Copy install"></velin-copy>
      </div>
      <velin-code-block language="js" collapsed>import { bootFromDOM } from '@birdapi/velinstyle/runtime';
bootFromDOM(document, { attributes: true, motion: true, highlight: true });</velin-code-block>
      <div class="expo-links">
        <a class="velin-btn velin-btn--primary" href="docs/getting-started/download.html">Read Documentation</a>
        <a class="velin-btn velin-btn--outline" href="docs/extend/javascript-api.html">API</a>
        <a class="velin-btn velin-btn--outline" href="demos/index.html">Examples</a>
        <a class="velin-btn velin-btn--outline" href="demos/showcase-interactive.html">Playground</a>
        <a class="velin-btn velin-btn--ghost" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="velin-btn velin-btn--ghost" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">Source</a>
        <a class="velin-btn velin-btn--ghost" href="docs/getting-started/accessibility.html">Accessibility Guide</a>
        <a class="velin-btn velin-btn--ghost" href="docs/getting-started/accessibility.html#contracts">Component Contract</a>
        <a class="velin-btn velin-btn--ghost" href="dist/velin-agent.json">velin-agent.json</a>
      </div>
    </section>
  </main>

  <velin-modal id="expoModal" title="Deploy to preview?">
    <p style="margin:0">Live velin-modal — Escape, overlay click, focus trap.</p>
    <div slot="footer" class="velin-flex velin-flex--gap-2" style="justify-content:flex-end;width:100%">
      <button type="button" class="velin-btn velin-btn--ghost" data-expo-close="expoModal">Cancel</button>
      <button type="button" class="velin-btn velin-btn--primary" data-toast="success" data-toast-msg="Deployed">Confirm</button>
    </div>
  </velin-modal>
  <velin-drawer id="expoDrawer" title="Navigation drawer" side="start">
    <nav class="velin-flex velin-flex--col velin-flex--gap-2" aria-label="Drawer links">
      <a href="#buttons" class="velin-btn velin-btn--ghost" style="justify-content:flex-start">Buttons</a>
      <a href="#forms" class="velin-btn velin-btn--ghost" style="justify-content:flex-start">Forms</a>
      <a href="#dashboard" class="velin-btn velin-btn--ghost" style="justify-content:flex-start">Dashboard</a>
    </nav>
    <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-close="expoDrawer" style="margin-top:var(--velin-space-3)">Close</button>
  </velin-drawer>
  <velin-sheet id="expoSheet" position="end" aria-label="Filters sheet">
    <h3 slot="header" style="margin:0;font-size:var(--velin-text-lg)">Filters</h3>
    <label class="velin-label" for="sheet-note">Note</label>
    <textarea class="velin-input" id="sheet-note" rows="3" placeholder="Optional note…"></textarea>
    <div slot="footer" class="velin-flex velin-flex--gap-2" style="justify-content:flex-end;width:100%">
      <button type="button" class="velin-btn velin-btn--ghost" data-expo-close="expoSheet">Cancel</button>
      <button type="button" class="velin-btn velin-btn--primary">Save</button>
    </div>
  </velin-sheet>
  <velin-drawer id="navDemoDrawer" title="Mobile drawer" side="start">
    <a href="#navigation" class="velin-btn velin-btn--ghost">Navigation</a>
    <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-close="navDemoDrawer">Close</button>
  </velin-drawer>
  <velin-sheet id="navOffcanvas" position="start" aria-label="Offcanvas">
    <h3 slot="header" style="margin:0">Offcanvas</h3>
    <p>Offcanvas pattern via velin-sheet.</p>
    <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-close="navOffcanvas">Close</button>
  </velin-sheet>
  <velin-drawer id="animDrawer" title="Anim drawer" side="end">
    <p>Drawer animation live.</p>
    <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-close="animDrawer">Close</button>
  </velin-drawer>
  <velin-sheet id="animSheet" position="end" aria-label="Anim sheet">
    <h3 slot="header" style="margin:0">Sheet</h3>
    <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-close="animSheet">Close</button>
  </velin-sheet>
  <velin-modal id="animModal" title="Anim modal">
    <p style="margin:0">Modal open/close lifecycle.</p>
    <div slot="footer"><button type="button" class="velin-btn velin-btn--primary" data-expo-close="animModal">Close</button></div>
  </velin-modal>
  <velin-toast id="expoToast"></velin-toast>
  <velin-scroll-top threshold="320"></velin-scroll-top>
  <velin-announcer id="expoAnnouncer"></velin-announcer>

  <footer class="expo-footer">
    <p>© SkyliteDesign · MIT · VelinStyle ${V} Component Expo</p>
  </footer>

  <script src="assets/js/home.js"></script>
  <script type="module" src="assets/js/expo-boot.js"></script>
</body>
</html>
`;

const full = html + html2 + html3;
writeFileSync(join(root, 'index.html'), full, 'utf8');
console.log('Wrote index.html bytes', Buffer.byteLength(full));
