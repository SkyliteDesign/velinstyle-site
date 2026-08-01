#!/usr/bin/env node
/**
 * Scrub common Bootstrap leftovers in docs HTML (live markup + escaped examples).
 * Skips migration.html so Bootstrap→Velin comparison snippets stay intact.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('docs');
const SKIP_DIRS = new Set(['generated']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!SKIP_DIRS.has(ent.name)) walk(p, out);
    } else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function scrub(s) {
  let hits = 0;
  const rules = [
    // Tables
    [/class="table table-bordered"/g, 'class="velin-table"'],
    [/class="table table-striped table-hover/g, 'class="velin-table velin-table--striped'],
    [/class="table table-striped"/g, 'class="velin-table velin-table--striped"'],
    [/class="table"/g, 'class="velin-table"'],

    // Buttons — longer patterns first
    [/class="btn btn-primary btn-lg"/g, 'class="velin-btn velin-btn--primary velin-btn--lg"'],
    [/class="btn btn-primary btn-sm"/g, 'class="velin-btn velin-btn--primary velin-btn--sm"'],
    [/class="btn btn-outline-secondary btn-sm"/g, 'class="velin-btn velin-btn--outline velin-btn--sm"'],
    [/class="btn btn-outline-danger"/g, 'class="velin-btn velin-btn--outline"'],
    [/class="btn btn-outline-secondary"/g, 'class="velin-btn velin-btn--outline"'],
    [/class="btn btn-outline-primary"/g, 'class="velin-btn velin-btn--outline"'],
    [/class="btn btn-sm btn-primary"/g, 'class="velin-btn velin-btn--sm velin-btn--primary"'],
    [/class="btn btn-sm btn-secondary"/g, 'class="velin-btn velin-btn--sm velin-btn--secondary"'],
    [/class="btn btn-sm btn-danger"/g, 'class="velin-btn velin-btn--sm velin-btn--danger"'],
    [/class="btn btn-secondary float-end"/g, 'class="velin-btn velin-btn--secondary velin-float-end"'],
    [/class="btn btn-secondary"/g, 'class="velin-btn velin-btn--secondary"'],
    [/class="btn btn-primary"/g, 'class="velin-btn velin-btn--primary"'],
    [/class="btn btn-danger"/g, 'class="velin-btn velin-btn--danger"'],
    [/class="btn btn-success"/g, 'class="velin-btn velin-btn--success"'],
    [/class="btn btn-link"/g, 'class="velin-btn velin-btn--ghost"'],
    [/class="btn btn-icon"/g, 'class="velin-btn velin-btn--ghost"'],
    [/class="btn btn-lg"/g, 'class="velin-btn velin-btn--lg"'],
    [/class="btn btn-sm"/g, 'class="velin-btn velin-btn--sm"'],
    [/class="btn"/g, 'class="velin-btn"'],

    // Escaped buttons in <pre>
    [/class=\\"btn btn-primary btn-lg\\"/g, 'class=\\"velin-btn velin-btn--primary velin-btn--lg\\"'],
    [/class=\\"btn btn-primary btn-sm\\"/g, 'class=\\"velin-btn velin-btn--primary velin-btn--sm\\"'],
    [/class=\\"btn btn-outline-secondary btn-sm\\"/g, 'class=\\"velin-btn velin-btn--outline velin-btn--sm\\"'],
    [/class=\\"btn btn-outline-danger\\"/g, 'class=\\"velin-btn velin-btn--outline\\"'],
    [/class=\\"btn btn-outline-secondary\\"/g, 'class=\\"velin-btn velin-btn--outline\\"'],
    [/class=\\"btn btn-outline-primary\\"/g, 'class=\\"velin-btn velin-btn--outline\\"'],
    [/class=\\"btn btn-sm btn-primary\\"/g, 'class=\\"velin-btn velin-btn--sm velin-btn--primary\\"'],
    [/class=\\"btn btn-sm btn-secondary\\"/g, 'class=\\"velin-btn velin-btn--sm velin-btn--secondary\\"'],
    [/class=\\"btn btn-sm btn-danger\\"/g, 'class=\\"velin-btn velin-btn--sm velin-btn--danger\\"'],
    [/class=\\"btn btn-secondary float-end\\"/g, 'class=\\"velin-btn velin-btn--secondary velin-float-end\\"'],
    [/class=\\"btn btn-secondary\\"/g, 'class=\\"velin-btn velin-btn--secondary\\"'],
    [/class=\\"btn btn-primary\\"/g, 'class=\\"velin-btn velin-btn--primary\\"'],
    [/class=\\"btn btn-danger\\"/g, 'class=\\"velin-btn velin-btn--danger\\"'],
    [/class=\\"btn btn-success\\"/g, 'class=\\"velin-btn velin-btn--success\\"'],
    [/class=\\"btn btn-link\\"/g, 'class=\\"velin-btn velin-btn--ghost\\"'],
    [/class=\\"btn btn-icon\\"/g, 'class=\\"velin-btn velin-btn--ghost\\"'],
    [/class=\\"btn btn-lg\\"/g, 'class=\\"velin-btn velin-btn--lg\\"'],
    [/class=\\"btn btn-sm\\"/g, 'class=\\"velin-btn velin-btn--sm\\"'],
    [/class=\\"btn\\"/g, 'class=\\"velin-btn\\"'],

    // Forms / alerts / badges
    [/class="form-control form-control-sm"/g, 'class="velin-input velin-input--sm"'],
    [/class="form-control"/g, 'class="velin-input"'],
    [/class=\\"form-control\\"/g, 'class=\\"velin-input\\"'],
    [/class="alert alert-info([^"]*)"/g, 'class="velin-alert velin-alert--info$1"'],
    [/class="badge bg-primary([^"]*)"/g, 'class="velin-badge$1"'],
    [/class=\\"badge bg-primary([^\\"]*)\\"/g, 'class=\\"velin-badge$1\\"'],
    [/class="d-flex /g, 'class="velin-flex '],
    [/class=\\"d-flex /g, 'class=\\"velin-flex '],

    // Text muted
    [/class="text-muted"/g, 'class="velin-text-muted"'],
    [/class=\\"text-muted\\"/g, 'class=\\"velin-text-muted\\"'],
    [/class="text-muted /g, 'class="velin-text-muted '],

    // sr-only
    [/class="sr-only sr-only-focusable"/g, 'class="velin-sr-only velin-sr-only--focusable"'],
    [/class="sr-only"/g, 'class="velin-sr-only"'],
    [/class=\\"sr-only sr-only-focusable\\"/g, 'class=\\"velin-sr-only velin-sr-only--focusable\\"'],
    [/class=\\"sr-only\\"/g, 'class=\\"velin-sr-only\\"'],
  ];

  let text = s;
  for (const [re, rep] of rules) {
    const before = text;
    text = text.replace(re, rep);
    if (text !== before) hits += 1;
  }

  // Bare Bootstrap spacing tokens (not already velin-*)
  const spacingPairs = [
    ['mt-2', 'velin-mbs-2'],
    ['mt-3', 'velin-mbs-3'],
    ['mt-4', 'velin-mbs-4'],
    ['mb-0', 'velin-mbe-0'],
    ['mb-2', 'velin-mbe-2'],
    ['mb-3', 'velin-mbe-3'],
    ['mb-4', 'velin-mbe-4'],
    ['ms-2', 'velin-mis-2'],
    ['ms-3', 'velin-mis-3'],
    ['me-2', 'velin-mie-2'],
    ['me-3', 'velin-mie-3'],
    ['p-2', 'velin-p-2'],
    ['p-3', 'velin-p-3'],
  ];
  for (const [from, to] of spacingPairs) {
    const re = new RegExp(`(?<!velin-|\\.|\\w)-?\\b${from}\\b`.replace('-?', ''), 'g');
    // Safer: only match token not preceded by velin-
    const re2 = new RegExp(`(?<!velin-)\\b${from}\\b`, 'g');
    const next = text.replace(re2, to);
    if (next !== text) hits += 1;
    text = next;
  }

  // float-end leftover
  {
    const next = text.replace(/(?<!velin-)\bfloat-end\b/g, 'velin-float-end');
    if (next !== text) hits += 1;
    text = next;
  }

  return { text, hits };
}

let files = 0;
let totalHits = 0;
const report = [];

for (const file of walk(ROOT)) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  if (/migration\.html$/.test(rel)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const { text, hits } = scrub(before);
  if (text !== before) {
    fs.writeFileSync(file, text);
    files += 1;
    totalHits += hits;
    report.push(`${rel} (~${hits})`);
  }
}

console.log(report.join('\n'));
console.log(`\nDone. files=${files} ruleHits≈${totalHits}`);
