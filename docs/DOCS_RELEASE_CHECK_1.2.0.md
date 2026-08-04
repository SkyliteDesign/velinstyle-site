# VelinStyle 1.2.0 Documentation — Final Release Check Report

**Date:** 2026-07-28  
**Scope:** `velinstyle-site/docs` modernization (phases 1–9) + release follow-ups  
**Sync:** `npm run sync:check` → **OK** (`@birdapi/velinstyle@1.2.2`)  
**Search:** `docs/search-index.json` rebuilt (2009 entries); home index synced (1896)

---

## Veraltete Seiten

| Status | Notes |
|--------|--------|
| Fixed | `contents.html` lead no longer claims **v0.6.x** |
| Fixed | Getting Started intro/DE parity for 1.2.0 + maturity |
| Historical OK | `changelog.html`, `upgrading.html` retain 1.1.0 / 0.9.x as history |
| Watch | Some older sample paths / forum recipes may still mention pre-1.2 pins in prose — verify when touching samples next |

## Fehlende Dokumentation

| Gap | Priority |
|-----|----------|
| Full Utility Engine generator docs | Planned product — correctly labeled **planned**, not missing as 1.2.0 claim |
| Studio docs | Planned — not shipped |
| Per-component generated API pages beyond current `docs/generated/` | Done for 1.2.0 docgen pass (richer attributes + empty-attr notes) |
| DE mirrors for Getting Started | Done P2–P5 (full chain) |
| DE mirrors for Guides | Done P6–P9 (all current guide pages) |
| DE mirrors for Customize + Layout + Content | Done P10 |
| DE mirrors remaining (Utilities, Components, Forms, Helpers, About, …) | P11+ |

## Fehlende Komponenten

| Status | Notes |
|--------|--------|
| Doc pages | 53 component HTML pages + index present for canonical set |
| Contracts | 38/38 a11y contracts referenced; sync check OK on component counts |

## Fehlende Beispiele

| Gap | Priority |
|-----|----------|
| Top utility pages: Preview tabs added (`scripts/add-utility-previews.mjs` + manual divide/transforms/safe-area/transitions) | Done |
| Overlay docs now have corrected live demos (modal/dialog/drawer/sheet/lightbox/toasts) | Done |
| Form validation + `velin-form-summary` live preview | Done |

## Fehlende Live Demos

| Gap | Priority |
|-----|----------|
| Remaining utility pages without Preview (reference-only) | P3 (acceptable) |
| A11y Dashboard remains a demo playground (explicitly labeled) | Done |

## Fehlende Accessibility Hinweise

| Status | Notes |
|--------|--------|
| Getting Started a11y hub + patterns + dashboard modernized | Done |
| DE: `barrierefreiheit.html` hub | Done |
| Overlays: focus-manager, Escape, `velin-close` documented | Done |
| Component batch: Accessibility notes / Related added on remaining CSS comps | Done |
| Language | AAA **support / oriented**; no app certification claims |

## Fehlende API Dokumentation

| Gap | Priority |
|-----|----------|
| Overlay / WC attribute tables corrected against source (removed invented attrs) | Done |
| Generated attributes: Value / Meaning / Bridges-to tables + `velin-scroll-top` | Done (`cli/docgen/extract-attributes.js`) |
| Generated components: clearer empty-`observedAttributes` + slots note | Done (`cli/docgen/extract-components.js`) |
| `register` / `bootFromDOM` / package subpaths in Extend docs | Done |
| CLI plan/review/scaffold/meta marked **beta** | Done |
| Thin CSS components still lighter on CSS-var tables | P3 |

## Inkonsistenzen

| Item | Status |
|------|--------|
| Stable vs beta vs planned | Aligned across intro, feature-scope, CLI, prompt-scaffolding, velin-meta |
| Display ownership (`display.css` vs responsive) | Documented in utilities/display |
| Bootstrap class leakage in examples | Scrubbed site-wide; `migration.html` left intentional for BS comparison |
| Dual badges (`beta` + `1.2.0`) on some DI pages | Intentional |

## Verbesserungsvorschläge

1. Automated link checker in CI for internal docs hrefs  
2. Optional DE sync pipeline for more Getting Started / Guides pages  
3. Visual regression on overlay demos before major site publish  
4. Re-run full `npm run build` (framework → site) before public 1.2.0 site publish  

## Priorisierte TODO Liste

| P | TODO |
|---|------|
| P0 | ~~Before publish: smoke Introduction → Download → Contents → Accessibility → Upgrading path in browser~~ — done |
| P1 | ~~Scrub residual Bootstrap class names in doc examples site-wide~~ — done 2026-07-28 (`scripts/scrub-bootstrap-docs.mjs`; migration.html left intentional) |
| P1 | ~~Expand generated API/attribute tables from framework meta~~ — done 2026-07-28 (`docs:generate` + `sync:dist`) |
| P2 | ~~Live Preview tabs for top ~20 utility pages~~ — done 2026-07-28 |
| P2 | ~~More DE translations (Download, Contents, Accessibility)~~ — done (`herunterladen`, `inhalte`, `barrierefreiheit`) |
| P3 | ~~DE: Editor-Einrichtung, Browser-Kompatibilität, Aktualisieren~~ — done |
| P4 | ~~DE: Zustände & Varianten, Rechts-nach-links~~ — done |
| P5 | ~~DE: A11y-Muster, A11y-Dashboard~~ — done |
| P6 | ~~DE Guides: Feature-Umfang, Übersicht, Bestehendes Projekt, Design-Tokens~~ — done |
| P7 | ~~DE Guides: Prompt-Vorlagen, Velin-Meta, Responsive-Layout-Audit, Vite/React~~ — done |
| P8 | ~~DE Guides: VelinSearch, Motion/Attributes, Syntax Highlight, HTML Attributes~~ — done |
| P9 | ~~DE Guides: API-Referenz, Performance, Whats New, Laravel, WordPress, E-Commerce, Forum~~ — done |
| P10 | ~~DE: Customize + Layout + Content~~ — done |
| P3 | Visual regression on overlay demos |
| — | Studio / Utility Engine docs — blocked on product |

## Phase completion

| Phase | Result |
|-------|--------|
| 1 Getting Started + changelog/migration | Done |
| 2 Components (overlays → rest) | Done |
| 3 Forms / Content / Helpers | Done |
| 4 Utilities / Layout / Customize | Done |
| 5 Animations & Motion | Done |
| 6 JS Runtime + WC Extend | Done |
| 7 CLI / Tooling / AI Meta | Done |
| 8 A11y + Guides hub | Done |
| 9 Generated sync / nav / search / report | Done (`sync:check` OK) |
| Follow-up P1/P2 release TODOs | Done 2026-07-28 |
