# velinstyle.info

Marketing website and extended documentation for **[VelinStyle](https://github.com/SkyliteDesign/velinstyle)** (accessibility-first CSS framework, **v1.0.0** — WCAG 2.2 AAA token defaults).

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

### Refresh site from VelinStyle (dist + generated docs)

From this repo (sibling `../velinstyle` required):

```bash
npm run build
```


Runs framework `build` + `docs:generate`, copies `dist/` and `docs/generated/`, applies doc patches, and rebuilds search/highlight bundles. Quick sync only:

```bash
npm run sync:dist
```

The site loads **`dist/velinstyle.min.css`** and **`dist/velinstyle-components.iife.js`** so demos work over `file://` and simple static hosts without ES-module restrictions.

## Consistency with the framework repo

Keep marketing copy in sync with the main README ([README.md](https://github.com/SkyliteDesign/velinstyle/blob/main/README.md) · [README.de.md](https://github.com/SkyliteDesign/velinstyle/blob/main/README.de.md)): **35+ CSS components**, **38 canonical Web Components** (40 lazy-loader entries), **27 HTML attribute bridges**, **13 theme presets**, WCAG contracts + Playwright E2E. German intro: `docs/getting-started/einfuehrung.html`. When cutting a release, bump versions in `docs/` headers and `index.html` with [CHANGELOG](https://github.com/SkyliteDesign/velinstyle/blob/main/CHANGELOG.md) in the core repo.

**[Deutsch](README.de.md)**

### SEO / Sitemaps

```bash
npm run generate:sitemaps
```

Creates `sitemap.xml` (velinstyle.info), `sitemap-index.xml`, `sitemaps/velinstyle.{info,de,eu,org,store}.xml`, and `robots.txt`. See [sitemaps/README.md](sitemaps/README.md).

### Docs site maintenance (important)

- **Sidebar links:** most pages duplicate the same `<nav class="velin-doc-sidebar">` markup. When you add a top-level doc (e.g. under `docs/getting-started/`), update every HTML file that includes the sidebar, or run a careful bulk replace (watch pages like `rtl.html` that use `class="active"` on a different item — the pattern must still match).
- **GitHub URL:** use `https://github.com/SkyliteDesign/velinstyle` everywhere in this repo (header, footer, copy).
- **npm/CDN:** document **`@birdapi/velinstyle@1.1.0`** for releases. Local demos use `dist/` from `npm run sync:dist` (`tools/sync-framework-0.9.0.py`).
- **New CLI flags:** document `scan --fix-dry-run`, `scan --fix-lang`, `blueprint`, and `tokens build` on `docs/extend/cli.html` when the core `cli/index.js` help text changes.
- **Landing page:** keep `index.html` in sync with major developer-facing features (CLI, patterns, validation, clone + `dist/` workflow) so visitors see the same story as the framework README.

## License

MIT — [SkyliteDesign](https://github.com/SkyliteDesign)
