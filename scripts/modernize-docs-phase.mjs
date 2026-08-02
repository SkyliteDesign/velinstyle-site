#!/usr/bin/env node
/**
 * Injects 1.2.0 maturity + when-to-use/when-not blocks into doc pages that lack them.
 * Usage: node scripts/modernize-docs-phase.mjs <dir...> [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';

const dry = process.argv.includes('--dry');
const dirs = process.argv.slice(2).filter((a) => a !== '--dry');
if (!dirs.length) {
  console.error('Usage: node scripts/modernize-docs-phase.mjs <dir...> [--dry]');
  process.exit(1);
}

const SKIP = new Set(['index.html']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function inferBadge(rel, html) {
  const n = rel.replace(/\\/g, '/').toLowerCase();
  if (/prompt-scaffolding|velin-meta|cli\.html|repo-tools/.test(n)) return 'beta';
  if (/plan|review|agent/.test(html.slice(0, 4000)) && /extend|guides/.test(n)) return 'beta';
  return 'stable';
}

function inferWhen(rel, title) {
  const n = rel.replace(/\\/g, '/');
  if (n.includes('/components/')) {
    return {
      use: [
        `Use <strong>${title}</strong> when the UI pattern matches the examples on this page.`,
        'Prefer the documented <code>velin-*</code> classes / custom element attributes over ad-hoc markup.',
      ],
      not: [
        'Do not invent undocumented attributes or Bootstrap class names.',
        'Do not skip the Accessibility section when wiring keyboard or focus behavior.',
      ],
    };
  }
  if (n.includes('/forms/')) {
    return {
      use: [
        'Use these form patterns with labels, validation helpers, and optional <code>velin-form-summary</code>.',
        'Keep native inputs where possible; layer VelinStyle classes for look and a11y.',
      ],
      not: [
        'Do not rely on color alone for error state — pair with text and <code>aria-invalid</code>.',
        'Do not claim AAA certification for your form just because tokens are AAA-oriented.',
      ],
    };
  }
  if (n.includes('/utilities/') || n.includes('/layout/') || n.includes('/customize/')) {
    return {
      use: [
        `Apply <strong>${title}</strong> utilities/tokens for layout and theming in 1.2.0.`,
        'Prefer semantic tokens over hard-coded colors where a token exists.',
      ],
      not: [
        'Do not expect a full Tailwind-style variant engine — that remains planned.',
        'Avoid mixing unprefixed Bootstrap utilities with <code>velin-*</code> in the same control.',
      ],
    };
  }
  if (n.includes('/animations/') || /motion|transitions|chart-animation/.test(n)) {
    return {
      use: [
        'Use motion utilities / attributes for entrance, attention, and scroll-driven effects.',
        'Respect <code>prefers-reduced-motion</code> — VelinStyle ships reduced-motion fallbacks.',
      ],
      not: [
        'Do not animate essential content in a way that blocks interaction.',
        'Do not ignore reduced-motion when adding decorative motion.',
      ],
    };
  }
  if (n.includes('/extend/') || n.includes('/guides/')) {
    return {
      use: [
        `Follow this guide when integrating or extending VelinStyle (${title}).`,
        'Pin <code>@birdapi/velinstyle@1.2.1</code> and check maturity badges for beta surfaces.',
      ],
      not: [
        'Do not treat beta plan/review/meta as a finished AI design system.',
        'Do not invent Studio or Utility Engine APIs that are still planned.',
      ],
    };
  }
  if (n.includes('/helpers/') || n.includes('/content/')) {
    return {
      use: [
        `Use <strong>${title}</strong> helpers/content styles for readable, accessible markup.`,
      ],
      not: [
        'Do not hide focusable controls with visually-hidden without a focusable path.',
      ],
    };
  }
  return {
    use: [`Use this page as the 1.2.0 reference for <strong>${title}</strong>.`],
    not: ['Do not follow stale version claims outside the Changelog / Upgrading history.'],
  };
}

function maturityBlurb(badge) {
  if (badge === 'beta') {
    return `<strong>Maturity:</strong> This surface is <strong>beta / foundation</strong> in VelinStyle <strong>1.2.0</strong> — usable now; schemas and coverage still expanding. CSS / Web Components / runtime remain <strong>stable</strong>. Studio and the complete Utility Engine stay <strong>planned</strong>.`;
  }
  return `<strong>Maturity:</strong> Documented as <strong>stable</strong> in VelinStyle <strong>1.2.0</strong>. Design Intelligence (plan / review / agent meta) is separate and <strong>beta / foundation</strong> where noted.`;
}

function buildBlock(badge, when) {
  const useLis = when.use.map((t) => `        <li>${t}</li>`).join('\n');
  const notLis = when.not.map((t) => `        <li>${t}</li>`).join('\n');
  return `
      <div class="velin-alert velin-alert--info" role="status" data-doc-modernize="1.2.0" style="margin-block-end:1rem">
        <div class="velin-alert__content">
          ${maturityBlurb(badge)}
        </div>
      </div>
      <h2 id="when-to-use">When to use</h2>
      <ul>
${useLis}
      </ul>
      <h2 id="when-not">When not</h2>
      <ul>
${notLis}
      </ul>
`;
}

function titleFromH1(h1Inner) {
  return h1Inner
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

let changed = 0;
let skipped = 0;

for (const dir of dirs) {
  const abs = path.resolve(dir);
  for (const file of walk(abs)) {
    const base = path.basename(file);
    if (SKIP.has(base)) {
      skipped++;
      continue;
    }
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('data-doc-modernize="1.2.0"') || html.includes('id="when-to-use"')) {
      skipped++;
      continue;
    }
    const h1m = html.match(/<h1([^>]*)>([\s\S]*?)<\/h1>/i);
    if (!h1m) {
      skipped++;
      continue;
    }
    const rel = path.relative(process.cwd(), file);
    const badge = inferBadge(rel, html);
    const title = titleFromH1(h1m[2]);
    let h1Inner = h1m[2];
    if (!/velin-badge/.test(h1Inner)) {
      h1Inner = `${h1Inner.trimEnd()} <span class="velin-badge">${badge === 'beta' ? 'beta' : '1.2.0'}</span>`;
      html = html.replace(h1m[0], `<h1${h1m[1]}>${h1Inner}</h1>`);
    }

    const block = buildBlock(badge, inferWhen(rel, title));
    // Insert after lead paragraph if present, else after h1
    const leadRe = /(<p class="lead">[\s\S]*?<\/p>)/i;
    if (leadRe.test(html)) {
      html = html.replace(leadRe, `$1\n${block}`);
    } else {
      html = html.replace(/<\/h1>/i, `</h1>\n${block}`);
    }

    // Light stale claim scrub (non-changelog)
    if (!/changelog\.html$/i.test(file) && !/upgrading\.html$/i.test(file)) {
      html = html.replace(/VelinStyle v0\.6\.x/gi, 'VelinStyle 1.2.0');
      html = html.replace(/\bv0\.6\.x\b/g, '1.2.0');
    }

    if (!dry) fs.writeFileSync(file, html);
    changed++;
    console.log(`${dry ? 'DRY ' : ''}updated ${rel}`);
  }
}

console.log(`Done. changed=${changed} skipped=${skipped}`);
