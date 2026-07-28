#!/usr/bin/env node
/**
 * Bundle VelinSearch for static docs: IIFE (file:// + http) — no ES modules in HTML.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(toolsDir, '..');
const velinRoot = path.join(siteRoot, '..', 'velinstyle');
const entry = path.join(siteRoot, 'docs', 'doc-search-entry.mjs');
const outDir = path.join(siteRoot, 'docs', 'assets');
const outfile = path.join(outDir, 'doc-search.iife.js');
const searchIndex = path.join(velinRoot, 'core', 'search', 'index.js');

if (!fs.existsSync(searchIndex)) {
  console.error('velinstyle core/search not found at', velinRoot);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const esbuildBin = path.join(
  velinRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild'
);

const args = [
  entry,
  '--bundle',
  '--format=iife',
  '--platform=browser',
  `--outfile=${outfile}`,
  '--log-level=warning',
];

let result;
if (fs.existsSync(esbuildBin)) {
  result = spawnSync(esbuildBin, args, {
    stdio: 'inherit',
    cwd: siteRoot,
    shell: process.platform === 'win32',
  });
} else {
  result = spawnSync('npx', ['--yes', 'esbuild@0.24', ...args], {
    stdio: 'inherit',
    cwd: siteRoot,
    shell: true,
  });
}

if (result.error) {
  console.error(result.error);
  process.exit(1);
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
if (!fs.existsSync(outfile)) {
  console.error('Bundle missing:', outfile);
  process.exit(1);
}
console.log('Wrote', outfile);
