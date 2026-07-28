#!/usr/bin/env node
/**
 * Capture WebP screenshots for showcase/projects.json.
 *
 * Usage: node tools/capture-showcase.mjs
 * Env:   SHOWCASE_ONLY=inselsorglos  — capture a single project id
 *
 * Playwright and sharp are resolved from the sibling velinstyle package
 * (already installed for framework E2E / README captures).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, '..');
const FRAMEWORK = path.resolve(SITE, '..', 'velinstyle');
const PROJECTS_PATH = path.join(SITE, 'showcase', 'projects.json');
const OUT_DIR = path.join(SITE, 'assets', 'img', 'showcase');
const ONLY = (process.env.SHOWCASE_ONLY || '').trim();

const requireFromFramework = createRequire(path.join(FRAMEWORK, 'package.json'));

async function loadPlaywright() {
  try {
    return await import(pathToFileURL(path.join(FRAMEWORK, 'node_modules', 'playwright', 'index.mjs')).href);
  } catch {
    try {
      return await import('playwright');
    } catch {
      console.error('Playwright missing. In velinstyle run: npm install && npx playwright install chromium');
      process.exit(1);
    }
  }
}

async function loadSharp() {
  try {
    return requireFromFramework('sharp');
  } catch {
    try {
      return createRequire(path.join(SITE, 'package.json'))('sharp');
    } catch {
      console.error('sharp missing. Install in velinstyle: npm install -D sharp');
      process.exit(1);
    }
  }
}

async function main() {
  const projects = JSON.parse(await readFile(PROJECTS_PATH, 'utf-8'));
  const list = ONLY ? projects.filter((p) => p.id === ONLY) : projects;
  if (!list.length) {
    console.error(ONLY ? `No project with id "${ONLY}"` : 'projects.json is empty');
    process.exit(1);
  }

  const { chromium } = await loadPlaywright();
  const sharp = await loadSharp();
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const project of list) {
    const url = project.url;
    const outPath = path.join(OUT_DIR, `${project.id}.webp`);
    console.log(`Capture ${project.id} ← ${url}`);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
      try {
        await page.waitForLoadState('networkidle', { timeout: 15_000 });
      } catch {
        /* some SPAs never go idle — screenshot anyway */
      }
      await page.waitForTimeout(1500);
      const png = await page.screenshot({ type: 'png', fullPage: false });
      await sharp(png)
        .resize(1280, 800, { fit: 'cover', position: 'top' })
        .webp({ quality: 82 })
        .toFile(outPath);
      console.log(`  → ${path.relative(SITE, outPath)}`);
    } catch (err) {
      console.error(`  ✗ ${project.id}: ${err.message.split('\n')[0]}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
