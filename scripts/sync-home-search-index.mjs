/**
 * Build dist/search-index.json for homepage / site-root search.
 * Source: docs/search-index.json (URLs relative to /docs/).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'docs', 'search-index.json');
const outPath = join(root, 'dist', 'search-index.json');

if (!existsSync(srcPath)) {
  console.error('Missing docs/search-index.json — run npm run build:search-index first');
  process.exit(1);
}

const src = JSON.parse(readFileSync(srcPath, 'utf8'));

function toSiteUrl(url) {
  if (!url || /^https?:\/\//i.test(url)) return url;
  const [path, hash] = url.split('#');
  let p = path.replace(/^\.\.\//, '');
  if (p.startsWith('docs/')) {
    /* already site-root */
  } else if (p.startsWith('showcase/') || p.startsWith('demos/') || p.startsWith('samples/')) {
    /* site-root hubs */
  } else {
    p = `docs/${p}`;
  }
  return hash ? `${p}#${hash}` : p;
}

function mapCategory(entry, url) {
  let cat = entry.category || 'docs';
  if (cat === 'showcase') cat = 'examples';
  if (url.includes('/components/') || url.includes('docs/components/')) cat = 'components';
  if (url.includes('/extend/') || url.includes('docs/extend/') || url.includes('/generated/')) {
    if (cat !== 'components') cat = 'api';
  }
  if (!['docs', 'components', 'api', 'examples'].includes(cat)) cat = 'docs';
  return cat;
}

const entries = [];
let dropped = 0;
for (const e of src.entries || []) {
  const url = toSiteUrl(e.url);
  if (!url) {
    dropped += 1;
    continue;
  }
  const filePath = join(root, url.split('#')[0]);
  if (!existsSync(filePath) && !/^https?:\/\//i.test(url)) {
    dropped += 1;
    continue;
  }
  // Homepage search should navigate to HTML, not raw markdown
  if (/\.md(#|$)/i.test(url)) {
    dropped += 1;
    continue;
  }
  entries.push({
    ...e,
    url,
    category: mapCategory(e, url),
  });
}

const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  entries,
};

writeFileSync(outPath, JSON.stringify(payload), 'utf8');
console.log(`Wrote ${entries.length} home search entries → dist/search-index.json (dropped ${dropped})`);
