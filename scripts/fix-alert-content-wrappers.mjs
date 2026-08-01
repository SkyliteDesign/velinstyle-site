#!/usr/bin/env node
/**
 * Wrap naked .velin-alert inner HTML in .velin-alert__content so flex layout
 * does not turn <strong>/<code> into horizontal flex items.
 */
import fs from 'node:fs';
import path from 'node:path';

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function wrapAlerts(html) {
  let wrapped = 0;
  const re = /<div\b([^>]*\bclass="[^"]*\bvelin-alert\b[^"]*"[^>]*)>([\s\S]*?)<\/div>/g;
  const next = html.replace(re, (full, attrs, inner) => {
    if (/\bvelin-alert__content\b/.test(inner) || /\bvelin-alert__icon\b/.test(inner)) {
      return full;
    }
    // Skip complex nested div alerts (e.g. demos)
    if (/<div\b/i.test(inner)) return full;
    wrapped += 1;
    const body = inner.trim();
    return `<div${attrs}>\n        <div class="velin-alert__content">\n          ${body}\n        </div>\n      </div>`;
  });
  return { html: next, wrapped };
}

const root = path.resolve('docs');
let files = 0;
let total = 0;
for (const file of walk(root)) {
  const before = fs.readFileSync(file, 'utf8');
  const { html, wrapped } = wrapAlerts(before);
  if (wrapped > 0 && html !== before) {
    fs.writeFileSync(file, html);
    files += 1;
    total += wrapped;
    console.log(`wrapped ${wrapped}: ${path.relative(process.cwd(), file)}`);
  }
}
console.log(`Done. files=${files} alerts=${total}`);
