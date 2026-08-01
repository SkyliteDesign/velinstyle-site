# velinstyle.info

Marketing website and documentation for **[VelinStyle](https://github.com/SkyliteDesign/velinstyle)** **v1.2.0** — accessibility-first CSS & Web Components with plan-first AI scaffolding, design tokens, and WCAG 2.2 AAA-oriented defaults.

**Target URL:** [https://velinstyle.info](https://velinstyle.info)

## What is in this repo

- `index.html` — Component Expo landing (live galleries, playground, tokens, utilities, testing, comparisons for v1.2.0)
- `docs/` — documentation (relative paths, live theme picker)
- `demos/` — live showcases
- `dist/` — **built assets copied from the main `velinstyle` repo** (CSS, JS, themes, `velin-agent.json`, `llms.txt`)
- `assets/js/demo-presets.js` — scaffold outputs for homepage playground (regenerate via `node scripts/build-demo-presets.mjs`)

## Run locally

```bash
npx serve . -l 4000
```

### Refresh from VelinStyle

```bash
npm run build          # full site build + sync
npm run sync:dist      # dist + generated docs + meta + changelog only
npm run sync:check     # release sync gate vs ../velinstyle
```

Regenerate homepage demo HTML after CLI/blueprint changes:

```bash
node ../velinstyle/cli/index.js scaffold "Steuerberater Landingpage mit Leistungen, FAQ und Kontaktformular" -o assets/data/hero-demo.html
node ../velinstyle/cli/index.js scaffold "SaaS landing page with pricing and FAQ" -o assets/data/saas-demo.html
node scripts/build-demo-presets.mjs
```

## Consistency with the framework

Keep counts aligned with `dist/velin-agent.json`: **40** canonical Web Components, **42** lazy loaders, **27** attribute bridges. npm/CDN pin: **`@birdapi/velinstyle@1.2.0`** (registry latest may still be 1.1.0 until the cut).

Homepage narrative: **live Component Expo** — show the framework with real components (80% UI / 20% text), no roadmap essay.

**[Deutsch](README.de.md)**

## License

MIT — [SkyliteDesign](https://github.com/SkyliteDesign)
