/**
 * Legacy overlay id→data-attr patcher.
 * DEPRECATED: index.html is source of truth. Pass --force to override.
 */
import { readFileSync, writeFileSync } from 'node:fs';

if (!process.argv.includes('--force')) {
  console.error('[patch-expo-home] Blocked: index.html is source of truth. Use --force to override.');
  process.exit(1);
}

let h = readFileSync('index.html', 'utf8');

const replacements = [
  [/id="openExpoModal"/g, 'data-expo-open="expoModal"'],
  [/id="closeExpoModal"/g, 'data-expo-close="expoModal"'],
  [/id="openExpoDrawer"/g, 'data-expo-open="expoDrawer"'],
  [/id="closeExpoDrawer"/g, 'data-expo-close="expoDrawer"'],
  [/id="openExpoSheet"/g, 'data-expo-open="expoSheet"'],
  [/id="closeExpoSheet"/g, 'data-expo-close="expoSheet"'],
  [/id="openAnimDrawer"/g, 'data-expo-open="animDrawer"'],
  [/id="closeAnimDrawer"/g, 'data-expo-close="animDrawer"'],
  [/id="openAnimSheet"/g, 'data-expo-open="animSheet"'],
  [/id="closeAnimSheet"/g, 'data-expo-close="animSheet"'],
  [/id="openAnimModal"/g, 'data-expo-open="animModal"'],
  [/id="closeAnimModal"/g, 'data-expo-close="animModal"'],
  [/id="openNavDrawer"/g, 'data-expo-open="navDemoDrawer"'],
  [/id="closeNavDrawer"/g, 'data-expo-close="navDemoDrawer"'],
  [/id="openNavOffcanvas"/g, 'data-expo-open="navOffcanvas"'],
  [/id="closeNavOffcanvas"/g, 'data-expo-close="navOffcanvas"'],
  [/docs\/guides\/theming\.html/g, 'docs/guides/design-tokens.html'],
  [/docs\/generated\/utilities\/README\.html/g, 'docs/layout/utilities.html'],
  [/docs\/generated\/tokens\/README\.html/g, 'docs/guides/design-tokens.html'],
  [/docs\/generated\/intelligence\/pages\.json/g, 'docs/generated/index.html'],
  [/docs\/generated\/intelligence\/sections\.json/g, 'docs/generated/index.html'],
];

for (const [from, to] of replacements) h = h.replace(from, to);

// Keep generator source in sync for future rebuilds: also patch build script overlay ids
writeFileSync('index.html', h);
console.log('openExpoModal left', (h.match(/id="openExpoModal"/g) || []).length);
console.log('data-expo-open count', (h.match(/data-expo-open=/g) || []).length);
