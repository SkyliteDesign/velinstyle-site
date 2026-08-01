#!/usr/bin/env node
/**
 * Capture WebP screenshots for showcase/projects.json.
 * Modes: desktop light, desktop dark, mobile (per project).
 *
 * Usage: node tools/capture-showcase.mjs
 * Env:   SHOWCASE_ONLY=inselsorglos  — capture a single project id
 *        SHOWCASE_MODES=light,dark,mobile  — subset (default: all)
 *
 * Playwright and sharp are resolved from the sibling velinstyle package.
 */
import { mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, '..');
const FRAMEWORK = path.resolve(SITE, '..', 'velinstyle');
const PROJECTS_PATH = path.join(SITE, 'showcase', 'projects.json');
const OUT_DIR = path.join(SITE, 'assets', 'img', 'showcase');
const ONLY = (process.env.SHOWCASE_ONLY || '').trim();
const MODE_LIST = (process.env.SHOWCASE_MODES || 'light,dark,mobile')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const requireFromFramework = createRequire(path.join(FRAMEWORK, 'package.json'));

const MODES = {
  light: {
    suffix: '',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
  },
  dark: {
    suffix: '-dark',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  },
  mobile: {
    suffix: '-mobile',
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
  },
};

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

async function captureOne(page, sharp, outPath, resize) {
  const png = await page.screenshot({ type: 'png', fullPage: false });
  await sharp(png)
    .resize(resize.width, resize.height, { fit: 'cover', position: 'top' })
    .webp({ quality: 82 })
    .toFile(outPath);
}

async function main() {
  const projects = JSON.parse(await readFile(PROJECTS_PATH, 'utf-8'));
  const list = ONLY ? projects.filter((p) => p.id === ONLY) : projects.filter((p) => !p.meta);
  if (!list.length) {
    console.error(ONLY ? `No project with id "${ONLY}"` : 'projects.json is empty');
    process.exit(1);
  }

  const modes = MODE_LIST.filter((m) => MODES[m]);
  if (!modes.length) {
    console.error('No valid SHOWCASE_MODES');
    process.exit(1);
  }

  const { chromium } = await loadPlaywright();
  const sharp = await loadSharp();
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const project of list) {
    for (const modeName of modes) {
      const mode = MODES[modeName];
      const fileName = `${project.id}${mode.suffix}.webp`;
      const outPath = path.join(OUT_DIR, fileName);
      console.log(`Capture ${project.id} [${modeName}] ← ${project.url}`);
      const context = await browser.newContext({
        viewport: mode.viewport,
        colorScheme: mode.colorScheme,
        deviceScaleFactor: 1,
        ignoreHTTPSErrors: true,
      });
      const page = await context.newPage();
      try {
        await page.emulateMedia({ colorScheme: mode.colorScheme });
        await page.goto(project.url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
        try {
          await page.waitForLoadState('networkidle', { timeout: 15_000 });
        } catch {
          /* some SPAs never go idle */
        }
        await page.waitForTimeout(1500);
        const resize =
          modeName === 'mobile'
            ? { width: 390, height: 844 }
            : { width: 1280, height: 800 };
        await captureOne(page, sharp, outPath, resize);
        // Canonical light file without suffix for gallery / walk default
        if (modeName === 'light') {
          console.log(`  → ${path.relative(SITE, outPath)}`);
        } else {
          console.log(`  → ${path.relative(SITE, outPath)}`);
        }
      } catch (err) {
        console.error(`  ✗ ${project.id} [${modeName}]: ${err.message.split('\n')[0]}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
