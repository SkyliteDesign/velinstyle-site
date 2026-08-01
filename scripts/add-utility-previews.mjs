#!/usr/bin/env node
/**
 * Add Preview tabs to code-only velin-doc-example blocks on top utility pages.
 * Decodes first <pre><code> HTML sample into a live preview panel.
 */
import fs from 'node:fs';
import path from 'node:path';

const FILES = [
  'display.html',
  'spacing.html',
  'shadows.html',
  'colors.html',
  'flex.html',
  'text.html',
  'borders.html',
  'background.html',
  'sizing.html',
  'position.html',
  'opacity.html',
  'overflow.html',
  'visibility.html',
  'divide.html',
  'interactions.html',
  'object-fit.html',
  'transitions.html',
  'transforms.html',
  'z-index.html',
  'safe-area.html',
].map((f) => path.resolve('docs/utilities', f));

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function addPreviewToExample(block) {
  if (block.includes('data-panel="preview"') || block.includes('data-tab="preview"')) {
    return { block, changed: false };
  }
  const codeMatch = block.match(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/);
  if (!codeMatch) return { block, changed: false };
  const raw = codeMatch[1].trim();
  // Skip pure comments / ellipsis-only / incomplete placeholders
  if (!raw.includes('<') || raw.includes('…') && raw.length < 40) {
    // still allow if has real tags besides ellipsis
    if (!/<[a-z][\s\S]*>/i.test(decodeEntities(raw).replace(/…/g, ''))) {
      return { block, changed: false };
    }
  }
  const html = decodeEntities(raw);
  // Don't preview scripts or full documents
  if (/<!DOCTYPE|<html|<script/i.test(html)) return { block, changed: false };

  let next = block;
  // Expand tabs: if only HTML tab, add Preview
  if (!/data-tab="preview"/.test(next)) {
    next = next.replace(
      /(<div class="velin-doc-example__tabs">)([\s\S]*?)(<\/div>)/,
      (m, open, inner, close) => {
        if (/data-tab="preview"/.test(inner)) return m;
        const withPreview = `${inner.trimEnd()}\n          <button class="velin-doc-example__tab" data-tab="preview">Preview</button>\n        `;
        return `${open}${withPreview}${close}`;
      },
    );
  }

  // Insert preview panel after code panel
  if (!/data-panel="preview"/.test(next)) {
    const preview = `
        <div class="velin-doc-example__panel" data-panel="preview">
          <div class="velin-doc-example__preview" style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
            ${html}
          </div>
        </div>`;
    // After last code panel inside this example
    const idx = next.lastIndexOf('</div>\n      </div>');
    // Find end of code panel: </div></div> of code structure
    next = next.replace(
      /(data-panel="code"[\s\S]*?<\/div>\s*<\/div>)/,
      `$1${preview}`,
    );
  }

  return { block: next, changed: next !== block };
}

let files = 0;
let examples = 0;

for (const file of FILES) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  // Process each velin-doc-example that is code-only
  html = html.replace(/<div class="velin-doc-example">[\s\S]*?(?=<div class="velin-doc-example">|<nav class="velin-doc-prevnext"|<\/main>)/g, (block) => {
    // trim trailing whitespace belonging to next section
    const trimmed = block;
    const { block: out, changed } = addPreviewToExample(trimmed);
    if (changed) examples += 1;
    return out;
  });
  if (html !== before) {
    fs.writeFileSync(file, html);
    files += 1;
    console.log('updated', path.relative(process.cwd(), file));
  }
}

console.log(`Done. files=${files} examples≈${examples}`);
