/**
 * Legacy generator string rewriter.
 * DEPRECATED: index.html is source of truth. Pass --force to override.
 */
import { readFileSync, writeFileSync } from 'node:fs';

if (!process.argv.includes('--force')) {
  console.error('[sync-expo-generator] Blocked: index.html is source of truth. Use --force to override.');
  process.exit(1);
}

let s = readFileSync('scripts/build-expo-home.mjs', 'utf8');
const pairs = [
  ['id="openExpoModal"', 'data-expo-open="expoModal"'],
  ['id="closeExpoModal"', 'data-expo-close="expoModal"'],
  ['id="openExpoDrawer"', 'data-expo-open="expoDrawer"'],
  ['id="closeExpoDrawer"', 'data-expo-close="expoDrawer"'],
  ['id="openExpoSheet"', 'data-expo-open="expoSheet"'],
  ['id="closeExpoSheet"', 'data-expo-close="expoSheet"'],
  ['id="openAnimDrawer"', 'data-expo-open="animDrawer"'],
  ['id="closeAnimDrawer"', 'data-expo-close="animDrawer"'],
  ['id="openAnimSheet"', 'data-expo-open="animSheet"'],
  ['id="closeAnimSheet"', 'data-expo-close="animSheet"'],
  ['id="openAnimModal"', 'data-expo-open="animModal"'],
  ['id="closeAnimModal"', 'data-expo-close="animModal"'],
  ['id="openNavDrawer"', 'data-expo-open="navDemoDrawer"'],
  ['id="closeNavDrawer"', 'data-expo-close="navDemoDrawer"'],
  ['id="openNavOffcanvas"', 'data-expo-open="navOffcanvas"'],
  ['id="closeNavOffcanvas"', 'data-expo-close="navOffcanvas"'],
  ['docs/guides/theming.html', 'docs/guides/design-tokens.html'],
  ['docs/generated/utilities/README.html', 'docs/layout/utilities.html'],
  ['docs/generated/tokens/README.html', 'docs/guides/design-tokens.html'],
  ['docs/generated/intelligence/pages.json', 'docs/generated/index.html'],
  ['docs/generated/intelligence/sections.json', 'docs/generated/index.html'],
];
for (const [a, b] of pairs) s = s.split(a).join(b);
writeFileSync('scripts/build-expo-home.mjs', s);
console.log('generator patched');
