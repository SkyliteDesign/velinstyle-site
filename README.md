# velinstyle.info

Marketing website and documentation for **[VelinStyle](https://github.com/SkyliteDesign/velinstyle)** **v1.2.1** — accessibility-first CSS & Web Components with Transparency Framework, plan-first AI scaffolding, design tokens, and WCAG 2.2 AAA-oriented defaults.

**Target URL:** [https://velinstyle.info](https://velinstyle.info)

## What is in this repo

- `index.html` / `index.de.html` — Component Expo landing (live galleries, playground, tokens, utilities, testing, Transparency demo on the hero video)
- `docs/` — documentation (relative paths, live theme picker), including EN/DE Transparency guides
- `demos/` — live showcases
- `dist/` — **built assets copied from the main `velinstyle` repo** (CSS, JS, themes, `transparency/`, `velin-agent.json`, `llms.txt`)
- `transparency.policy.json` — site policy for `transparency doctor` / `report` on the homepage
- `transparency-report/` — generated doctor/report artifacts (local)
- `assets/js/demo-presets.js` — scaffold outputs for homepage playground (regenerate via `node scripts/build-demo-presets.mjs`)

## Run locally

```bash
npx serve . -l 4000
```

### Refresh from VelinStyle

```bash
npm run build          # full site build + sync
npm run sync:dist      # dist + generated docs + meta + changelog + transparency module
npm run sync:check     # release sync gate vs ../velinstyle
```

### Transparency tools (homepage)

```bash
npm run transparency:home      # doctor EN+DE + report
npm run transparency:doctor
npm run transparency:report
```

Regenerate homepage demo HTML after CLI/blueprint changes:

```bash
node ../velinstyle/cli/index.js scaffold "Steuerberater Landingpage mit Leistungen, FAQ und Kontaktformular" -o assets/data/hero-demo.html
node ../velinstyle/cli/index.js scaffold "SaaS landing page with pricing and FAQ" -o assets/data/saas-demo.html
node scripts/build-demo-presets.mjs
```

## Consistency with the framework

Keep counts aligned with `dist/velin-agent.json`: **43** canonical Web Components, **45** lazy loaders, **27** attribute bridges. npm/CDN pin: **`@birdapi/velinstyle@1.2.2`**.

Homepage narrative: **live Component Expo** — show the framework with real components (80% UI / 20% text), including the **Transparency Framework** (beta) badge on the hero video.

**Not published:** `atelier/` and `showcase-reihe/` (local-only; listed in `.gitignore`).

Docs: [Transparency (EN)](docs/guides/transparency.html) · [Transparenz (DE)](docs/guides/transparency-leitfaden.html)

**[Deutsch](README.de.md)**

## License

MIT — [SkyliteDesign](https://github.com/SkyliteDesign)
