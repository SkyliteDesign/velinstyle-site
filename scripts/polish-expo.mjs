/**
 * Component Expo polish — patch index.html sections in place.
 *
 * DEPRECATED: live `index.html` is source of truth. Pass --force to override.
 */
import { readFileSync, writeFileSync } from 'node:fs';

if (!process.argv.includes('--force')) {
  console.error(
    '[polish-expo] Blocked: index.html is source of truth.\n' +
      'Use scripts/verify-home.mjs. Re-run with --force only if you intentionally re-polish.',
  );
  process.exit(1);
}

let html = readFileSync('index.html', 'utf8');

// Ensure polish stylesheet
if (!html.includes('assets/css/home-polish.css')) {
  html = html.replace(
    '<link rel="stylesheet" href="assets/css/home.css">',
    '<link rel="stylesheet" href="assets/css/home.css">\n  <link rel="stylesheet" href="assets/css/home-polish.css">',
  );
}

const quality = `
      <p class="expo-measure-note"><a href="#testing">Quality claims are measured in the Test Center</a> — not asserted here.</p>`;

const megaNav = `  <header class="expo-nav" role="banner">
    <a class="expo-nav__brand" href="#hero">
      <img src="assets/img/velinstyle-logo.svg" alt="" width="22" height="22" aria-hidden="true">
      <span>VelinStyle</span>
      <span class="velin-badge velin-badge--primary">1.2.0</span>
    </a>
    <nav class="expo-nav__menu" aria-label="Primary">
      <div class="expo-nav__group">
        <button type="button" aria-expanded="false" aria-controls="navComponents" id="navComponentsBtn">Components</button>
        <div class="expo-nav__panel" id="navComponents" role="region" aria-label="Components">
          <a href="#playground">Playground</a>
          <a href="#buttons">Buttons</a>
          <a href="#forms">Forms</a>
          <a href="#cards">Cards</a>
          <a href="#tables">Tables</a>
          <a href="#navigation">Navigation</a>
          <a href="#heroes">Heroes</a>
          <a href="#contracts">Contracts</a>
          <a href="#charts">Charts</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#utilities">Utilities</a>
          <a href="#tokens">Tokens</a>
          <a href="#animations">Motion</a>
          <a href="#testing">Test Center</a>
        </div>
      </div>
      <div class="expo-nav__group">
        <button type="button" aria-expanded="false" aria-controls="navShowcase" id="navShowcaseBtn">Showcase</button>
        <div class="expo-nav__panel expo-nav__panel--single" id="navShowcase" role="region" aria-label="Showcase">
          <a href="#showcase">Projects</a>
          <a href="#pages">Page types</a>
          <a href="#blueprints">Blueprints</a>
          <a href="#compare">Compare</a>
          <a href="showcase/index.html">Showcase hub</a>
          <a href="demos/index.html">All demos</a>
        </div>
      </div>
      <div class="expo-nav__group">
        <button type="button" aria-expanded="false" aria-controls="navDocs" id="navDocsBtn">Docs</button>
        <div class="expo-nav__panel expo-nav__panel--single" id="navDocs" role="region" aria-label="Docs">
          <a href="docs/getting-started/introduction.html">Introduction</a>
          <a href="docs/components/index.html">Components</a>
          <a href="docs/guides/design-tokens.html">Tokens</a>
          <a href="docs/getting-started/accessibility.html">Accessibility</a>
          <a href="docs/extend/javascript-api.html">API</a>
          <a href="docs/generated/index.html">Generated reference</a>
          <a href="#whats-new">What's new 1.2.0</a>
        </div>
      </div>
      <div class="expo-nav__group">
        <button type="button" aria-expanded="false" aria-controls="navCommunity" id="navCommunityBtn">Community</button>
        <div class="expo-nav__panel expo-nav__panel--single" id="navCommunity" role="region" aria-label="Community">
          <a href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://forum.birdapi.de/" target="_blank" rel="noopener noreferrer">Forum</a>
          <a href="dist/velin-agent.json">Agent metadata</a>
          <a href="dist/llms.txt">llms.txt</a>
          <a href="#install">Install</a>
        </div>
      </div>
      <a class="velin-btn velin-btn--ghost velin-btn--sm" href="#testing">Test Center</a>
    </nav>
    <div class="expo-toc-mobile" style="display:none"></div>
    <div class="expo-nav__actions">
      <velin-theme-toggle themes-base="dist/themes/"></velin-theme-toggle>
      <a class="velin-btn velin-btn--primary velin-btn--sm" href="#install">Install</a>
    </div>
  </header>`;

// Replace header block (from <header class="expo-nav" through closing </header>)
html = html.replace(/<header class="expo-nav" role="banner">[\s\S]*?<\/header>/, megaNav);

// Mobile TOC simplified groups
const mobileToc = `  <div class="expo-toc-mobile">
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
        <option value="#compare">Compare</option>
      </optgroup>
      <optgroup label="Docs & Community">
        <option value="#whats-new">What's new</option>
        <option value="#install">Install</option>
      </optgroup>
    </select>
  </div>`;

html = html.replace(/<div class="expo-toc-mobile">[\s\S]*?<\/div>\s*\n\s*<main/, `${mobileToc}\n\n  <main`);

// Inject quality badges after first expo-section__header in major sections (once each)
const sectionIds = [
  'playground', 'buttons', 'forms', 'cards', 'tables', 'navigation', 'heroes',
  'contracts', 'charts', 'dashboard', 'utilities', 'tokens', 'animations', 'testing', 'showcase',
];
for (const id of sectionIds) {
  const re = new RegExp(`(<section class="expo-section"[^>]*id="${id}"[\\s\\S]*?<header class="expo-section__header">[\\s\\S]*?<\\/header>)`);
  html = html.replace(re, (m) => (m.includes('expo-measure-note') || m.includes('expo-quality') ? m : `${m}\n${quality}`));
}

function animCard({ title, blurb, stage, docs }) {
  return `
        <article class="expo-anim-tile">
          <strong>${title}</strong>
          <p>${blurb}</p>
          <div class="expo-anim-tile__stage">${stage}</div>
          <div class="expo-demo-links">
            <a href="${docs}">Docs</a>
            <a href="docs/extend/javascript-api.html">API</a>
            <a href="demos/showcase-interactive.html">Playground</a>
            <a href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">Source</a>
          </div>
        </article>`;
}

const animGrid = `<div class="expo-anim-grid">
${animCard({
  title: 'Hover',
  blurb: 'Lift/glow on pointer. Use for cards and secondary actions.',
  stage: '<button type="button" class="velin-btn velin-btn--outline velin-btn--sm" velin-hover>Hover me</button>',
  docs: 'docs/guides/motion-attributes.html',
})}
${animCard({
  title: 'Focus',
  blurb: 'Visible focus ring for keyboard users. Tab into the control.',
  stage: '<button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Tab here</button>',
  docs: 'docs/getting-started/accessibility.html',
})}
${animCard({
  title: 'Ripple',
  blurb: 'Press feedback. Trigger fires a one-shot ripple.',
  stage: '<button type="button" class="velin-btn velin-btn--secondary velin-btn--sm expo-ripple" id="rippleBtn" data-anim-trigger="rippleBtn">Click</button>',
  docs: 'docs/guides/motion-attributes.html',
})}
${animCard({
  title: 'Collapse / Expand',
  blurb: 'Show secondary content without leaving the page.',
  stage: '<velin-collapse><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" slot="trigger">Toggle</button><p class="velin-text-sm" style="margin:0">Expanded panel content.</p></velin-collapse>',
  docs: 'docs/components/collapse.html',
})}
${animCard({
  title: 'Accordion',
  blurb: 'Exclusive FAQ panels with native details semantics.',
  stage: '<velin-accordion><details open><summary>Open</summary><p class="velin-text-sm" style="margin:0">Panel body</p></details><details><summary>Next</summary><p class="velin-text-sm" style="margin:0">More</p></details></velin-accordion>',
  docs: 'docs/components/accordion.html',
})}
${animCard({
  title: 'Modal',
  blurb: 'Blocking decision with focus trap. Esc closes.',
  stage: '<button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-expo-open="animModal">Open modal</button>',
  docs: 'docs/components/modal.html',
})}
${animCard({
  title: 'Drawer',
  blurb: 'Side navigation / filters. Keep short paths.',
  stage: '<button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="animDrawer">Open drawer</button>',
  docs: 'docs/components/drawer.html',
})}
${animCard({
  title: 'Sheet',
  blurb: 'Secondary tasks and carts from the edge.',
  stage: '<button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-expo-open="animSheet">Open sheet</button>',
  docs: 'docs/components/sheet.html',
})}
${animCard({
  title: 'Toast',
  blurb: 'Transient status. Stack success and warning live.',
  stage: '<div class="velin-flex velin-flex--gap-2 velin-flex--wrap"><button type="button" class="velin-btn velin-btn--success velin-btn--sm" data-toast="success" data-toast-msg="Saved">Success</button><button type="button" class="velin-btn velin-btn--danger velin-btn--sm" data-toast="warning" data-toast-msg="Check fields">Error</button></div>',
  docs: 'docs/components/toasts.html',
})}
${animCard({
  title: 'Tooltip',
  blurb: 'Short help on focus/hover. Esc dismisses.',
  stage: '<button type="button" class="velin-btn velin-btn--ghost velin-btn--sm" aria-label="Help"><velin-tooltip content="Keyboard accessible — Esc dismisses">?</velin-tooltip></button>',
  docs: 'docs/components/tooltips.html',
})}
${animCard({
  title: 'Tabs',
  blurb: 'Roving tabindex. Arrow keys move between tabs.',
  stage: '<velin-tabs><button type="button" role="tab" aria-selected="true" id="an-a" aria-controls="an-pa">A</button><button type="button" role="tab" id="an-b" aria-controls="an-pb">B</button><div role="tabpanel" id="an-pa" aria-labelledby="an-a"><span class="velin-text-sm">Panel A</span></div><div role="tabpanel" id="an-pb" aria-labelledby="an-b" hidden><span class="velin-text-sm">Panel B</span></div></velin-tabs>',
  docs: 'docs/components/navs-tabs.html',
})}
${animCard({
  title: 'Progress',
  blurb: 'Ring progress for uploads and onboarding.',
  stage: '<velin-progress-ring value="62" size="64" stroke="6" label="62 percent"></velin-progress-ring>',
  docs: 'docs/components/progress-ring.html',
})}
${animCard({
  title: 'Skeleton',
  blurb: 'Loading placeholder while content arrives.',
  stage: '<span velin-skeleton="text" style="display:block;min-width:8rem;min-height:1rem"></span>',
  docs: 'docs/guides/html-attributes.html',
})}
${animCard({
  title: 'Loading',
  blurb: 'Busy state on actions. Spinner + button loading.',
  stage: '<div class="velin-flex velin-flex--gap-2 velin-flex--items-center"><span class="velin-spinner velin-spinner--sm" role="status" aria-label="Loading"></span><button type="button" class="velin-btn velin-btn--primary velin-btn--sm velin-btn--loading" aria-busy="true">Saving</button></div>',
  docs: 'docs/components/spinners.html',
})}
${animCard({
  title: 'Reveal',
  blurb: 'Scroll-into-view entrance. Respects reduced motion.',
  stage: '<button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="rerunReveal">Replay reveal</button><span id="revealTarget" class="velin-badge velin-badge--primary" velin-reveal="fade">Revealed</span>',
  docs: 'docs/guides/motion-attributes.html',
})}
</div>`;

html = html.replace(/<div class="expo-anim-grid">[\s\S]*?<\/div>\s*\n\s*<footer class="expo-links">/, `${animGrid}\n\n  <footer class="expo-links">`);

// Update animations section header copy
html = html.replace(
  /(<section class="expo-section" id="animations"[\s\S]*?<p class="expo-kicker">)Animation Gallery(<\/p>\s*<h2 id="animations-title">)[\s\S]*?(<\/h2>\s*<p>)[\s\S]*?(<\/p>)/,
  '$1Animation Gallery$2Welche Motion-Patterns kann man live testen?$3Hover bis Reveal — jede Kachel hat Demo, Trigger und Docs.$4',
);

// Token lab controls upgrade
const tokenControls = `<div class="expo-controls">
        <label>Theme<select class="velin-input" data-expo-theme>
          <option value="light">Light</option><option value="dark">Dark</option>
          <option value="ocean">Ocean</option><option value="forest">Forest</option>
          <option value="midnight">Midnight</option><option value="soft">Soft</option>
          <option value="sharp">Sharp</option><option value="brutalist">Brutalist</option>
        </select></label>
        <label>Radius <input id="tokenRadius" type="range" min="0.15" max="1.5" step="0.05" value="0.75"></label>
        <label>Density <input id="tokenDensity" type="range" min="0.8" max="1.3" step="0.05" value="1"></label>
        <label>Spacing <input id="tokenGap" type="range" min="0.4" max="2" step="0.1" value="0.75"></label>
        <label>Shadow / Elevation<select id="tokenElev" class="velin-input"><option value="none">none</option><option value="mid" selected>mid</option><option value="high">high</option></select></label>
        <label>Surface<select id="tokenSurfaceTone" class="velin-input"><option value="default">default</option><option value="dim">dim</option><option value="bright">bright</option></select></label>
        <label>Border <input id="tokenBorder" type="range" min="0" max="4" step="1" value="1"></label>
        <label>Accent<select id="tokenAccent" class="velin-input">
          <option value="var(--velin-color-primary)">primary</option>
          <option value="var(--velin-color-success)">success</option>
          <option value="var(--velin-color-danger)">danger</option>
          <option value="oklch(55% 0.14 250)">blue</option>
          <option value="oklch(55% 0.16 30)">coral</option>
        </select></label>
        <label>Typography <input id="tokenType" type="range" min="0.85" max="1.25" step="0.05" value="1"></label>
        <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="tokenMotion" aria-pressed="false">Motion off</button>
      </div>
      <p class="expo-token-readout" id="tokenReadout" aria-live="polite"></p>`;

html = html.replace(
  /(<section class="expo-section" id="tokens"[\s\S]*?<div class="expo-controls">)[\s\S]*?(<div class="expo-token-surface" id="tokenSurface")/,
  `$1REPLACED_TOKEN_CONTROLS</div>\n      <p class="expo-token-readout" id="tokenReadout" aria-live="polite"></p>\n      $2`,
);
// The replace above is messy - do a cleaner replace of the controls block only
html = html.replace(
  /<div class="expo-controls">\s*<label>Theme<select class="velin-input" data-expo-theme>[\s\S]*?<button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="tokenMotion" aria-pressed="false">Motion off<\/button>\s*<\/div>\s*(?:<p class="expo-token-readout"[^>]*>[\s\S]*?<\/p>\s*)?<div class="expo-token-surface" id="tokenSurface"/,
  `${tokenControls}\n      <div class="expo-token-surface" id="tokenSurface"`,
);

html = html.replace(
  'id="tokenSurface" data-elev="none" data-motion="on"',
  'id="tokenSurface" data-elev="mid" data-motion="on"',
);

// Test Center rewrite
const testCenter = `<section class="expo-section" id="testing" aria-labelledby="testing-title">
      <header class="expo-section__header">
        <p class="expo-kicker">VelinStyle Test Center</p>
        <h2 id="testing-title">Kann man Accessibility live prüfen?</h2>
        <p>Keyboard, Focus, ARIA, RTL, Responsive, Dark/Light, Reduced Motion, High Contrast — alles anklickbar.</p>
      </header>
${quality}
      <div class="expo-test-center__stage" id="testStage">
        <nav class="velin-nav" aria-label="Test stage nav">
          <a class="velin-nav__brand" href="#testing">Test UI</a>
          <ul class="velin-nav__list">
            <li><a class="velin-nav__link" href="#testing" aria-current="page">Home</a></li>
            <li><a class="velin-nav__link" href="#forms">Forms</a></li>
          </ul>
          <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" id="testFocusBtn">Focus target</button>
        </nav>
        <p id="testAriaLive" role="status" aria-live="polite" class="velin-text-sm">ARIA live idle</p>
        <div id="rtlTestBox" class="expo-rtl-box" dir="ltr">
          <div class="velin-flex velin-flex--gap-2 velin-flex--wrap">
            <button type="button" class="velin-btn velin-btn--outline velin-btn--sm">Action</button>
            <span class="velin-badge" id="motionTestDot">motion</span>
          </div>
        </div>
        <div id="responsiveTestBox" class="expo-device" style="margin-top:var(--velin-space-3)">
          <div class="expo-device__screen velin-p-3"><button type="button" class="velin-btn velin-btn--primary velin-btn--sm">CTA</button></div>
        </div>
      </div>
      <div class="expo-test-grid">
        <article class="expo-test-card" id="testKeyboard"><h3>Keyboard Navigation</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runKeyboardTest">Run</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card expo-focus-track" id="testFocus"><h3>Focus</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runFocusTest">Run</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testAria"><h3>ARIA</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runAriaTest">Run</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testRtl"><h3>RTL</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runRtlTest">Toggle RTL</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testResponsive"><h3>Responsive</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runResponsiveTest">Toggle frame</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testThemeDark"><h3>Dark Mode</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runDarkTest">Enable dark</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testThemeLight"><h3>Light Mode</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runLightTest">Enable light</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testMotion"><h3>Reduced Motion</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runMotionTest">Toggle</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testContrast"><h3>High Contrast</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runContrastTest">Toggle</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
        <article class="expo-test-card" id="testA11y"><h3>Accessibility sweep</h3><button type="button" class="velin-btn velin-btn--outline velin-btn--sm" id="runA11yTest">Run</button><p data-test-out class="velin-text-sm" style="margin:0">—</p></article>
      </div>
      <div class="expo-score-grid">
        <div class="expo-score"><strong>9.8</strong><span>Review A11y</span></div>
        <div class="expo-score"><strong>9.2</strong><span>Design</span></div>
        <div class="expo-score"><strong>9.0</strong><span>Perf</span></div>
      </div>
  <footer class="expo-links">
    <a class="velin-btn velin-btn--outline velin-btn--sm" href="docs/getting-started/accessibility.html">Docs</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/extend/javascript-api.html">API</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="demos/showcase-interactive.html">Examples</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="demos/index.html">Playground</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener noreferrer">Source Code</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/getting-started/accessibility.html">Accessibility Guide</a>
    <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/getting-started/accessibility.html#contracts">Component Contract</a>
  </footer>
    </section>`;

html = html.replace(/<section class="expo-section" id="testing"[\s\S]*?<\/section>\s*\n\s*<section class="expo-section" id="showcase"/, `${testCenter}\n\n    <section class="expo-section" id="showcase"`);

// Clean accidental leftover from botched token replace
html = html.replace('REPLACED_TOKEN_CONTROLS</div>\n      <p class="expo-token-readout" id="tokenReadout" aria-live="polite"></p>\n      ', '');
html = html.replace(/<div class="expo-toc-mobile" style="display:none"><\/div>\s*/g, '');

writeFileSync('index.html', html);
console.log('patched index.html', Buffer.byteLength(html));
console.log('mega nav', html.includes('expo-nav__menu'));
console.log('measure notes', (html.match(/expo-measure-note/g) || []).length);
console.log('quality leftover', (html.match(/expo-quality/g) || []).length);
console.log('anim tiles', (html.match(/expo-anim-tile/g) || []).length);
console.log('test center', html.includes('VelinStyle Test Center'));
console.log('tokenBorder', html.includes('tokenBorder'));
