# velinstyle.info

Marketing website and extended documentation for **[VelinStyle](https://github.com/SkyliteDesign/velinstyle)** (accessibility-first CSS framework, **v0.8.0** — WCAG 2.2 AA).

**Target URL:** [https://velinstyle.info](https://velinstyle.info)

## What is in this repo

- `index.html` — landing page (VelinStyle + Web Components)
- `docs/` — Bootstrap-style documentation (relative paths, live theme picker)
- `dist/` — **built assets copied from the main `velinstyle` repo** (CSS, JS bundles, `velin-icons.svg`, themes). Not generated in this repo alone.

## Run locally

From this directory:

```bash
npx serve . -l 4000
```

Or `npm run dev` if you add a matching script. Open [http://localhost:4000](http://localhost:4000).

### Refresh `dist/` from VelinStyle

After changes in the main framework repo, rebuild and copy:

```bash
cd ../velinstyle   # path to velinstyle clone
npm run build
# Windows PowerShell example:
Copy-Item -Path dist/* -Destination ../velinstyle-site/dist/ -Recurse -Force
```

The site loads **`dist/velinstyle.min.css`** and **`dist/velinstyle-components.iife.js`** so demos work over `file://` and simple static hosts without ES-module restrictions.

## Consistency with the framework repo

Keep marketing copy in sync with the main README: **35+ CSS components**, **22 Web Components**, **13 theme presets**, optional **CLI** (`init`, `build`, `icons`, `scan`, `blueprint`, `tokens build`). When cutting a release, bump visible versions in `docs/` headers and on `index.html` together with [CHANGELOG](https://github.com/SkyliteDesign/velinstyle/blob/main/CHANGELOG.md) in the core repo.

### Docs site maintenance (important)

- **Sidebar links:** most pages duplicate the same `<nav class="velin-doc-sidebar">` markup. When you add a top-level doc (e.g. under `docs/getting-started/`), update every HTML file that includes the sidebar, or run a careful bulk replace (watch pages like `rtl.html` that use `class="active"` on a different item — the pattern must still match).
- **GitHub URL:** use `https://github.com/SkyliteDesign/velinstyle` everywhere in this repo (header, footer, copy).
- **npm/CDN:** document **`@birdapi/velinstyle@0.8.0`** (`npm install @birdapi/velinstyle`, jsDelivr/unpkg under `@birdapi/velinstyle`). Local demos use `dist/` copied from the framework repo. Bulk-update: `python tools/sync-0.7.5.py` (dist + versions) or `python tools/patch-install-paths.py`.
- **New CLI flags:** document `scan --fix-dry-run`, `scan --fix-lang`, `blueprint`, and `tokens build` on `docs/extend/cli.html` when the core `cli/index.js` help text changes.
- **Landing page:** keep `index.html` in sync with major developer-facing features (CLI, patterns, validation, clone + `dist/` workflow) so visitors see the same story as the framework README.

## License

MIT — [SkyliteDesign](https://github.com/SkyliteDesign)
