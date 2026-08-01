# velinstyle.info

Marketing-Website und Dokumentation für **[VelinStyle](https://github.com/SkyliteDesign/velinstyle)** **v1.2.0** — accessibility-first CSS & Web Components mit plan-first AI-Scaffolding und WCAG-2.2-AAA-orientierten Defaults.

**Ziel-URL:** [https://velinstyle.info](https://velinstyle.info)

## Inhalt dieses Repos

- `index.html` — Component-Expo-Landing (Live-Galerien, Playground, Tokens, Utilities, Testing, Vergleiche für v1.2.0)
- `docs/` — Dokumentation im Bootstrap-Stil (relative Pfade, Live-Theme-Picker)
- `docs/getting-started/einfuehrung.html` — **deutsche** Einführung (Spiegel zu `introduction.html`)
- `dist/` — **Build-Artefakte aus dem Hauptrepo `velinstyle`** (CSS, JS-Bundles, Themes). Werden hier nicht allein erzeugt.

## Lokal starten

```bash
npx serve . -l 4000
```

Oder `npm run dev`. Öffnen: [http://localhost:4000](http://localhost:4000).

### Site aus VelinStyle aktualisieren (dist + generierte Docs)

Aus diesem Repo (Geschwisterverzeichnis `../velinstyle` nötig):

```bash
npm run build
```

Führt Framework-`build` + `docs:generate` aus, kopiert `dist/` und `docs/generated/`, wendet Doc-Patches an und baut Search/Highlight-Bundles. Nur Sync:

```bash
npm run sync:dist
python tools/sync-generated-docs.py
```

Die Homepage bootet Components selektiv über **`dist/chunks/runtime-entry.js`** (`bootFromDOM`). Andere Docs/Demos können weiterhin **`dist/velinstyle-components.iife.js`** nutzen.

## Abgleich mit dem Framework

Marketing-Texte mit [README.de.md](https://github.com/SkyliteDesign/velinstyle/blob/main/README.de.md) / [README.md](https://github.com/SkyliteDesign/velinstyle/blob/main/README.md) synchron halten:

| Thema | Stand (1.2.0) |
| --- | --- |
| CSS-Komponenten | 35+ BEM-Komponenten |
| Web Components | **38** mit A11y-Contracts |
| HTML-Attribute | deklarative Bridges |
| A11y | `component-contracts.json`, `test:a11y:coverage` |
| AI Ready | Plan → scaffold → review, knowledge graph, `velin-agent.json` |
| E2E | `npm run test:e2e` (Playwright, CI) |
| CLS | `wc-placeholder.css` im CSS-Bundle |

Bei Releases Versionen in `docs/`-Headern und `index.html` zusammen mit [CHANGELOG](https://github.com/SkyliteDesign/velinstyle/blob/main/CHANGELOG.md) im Kern-Repo anheben.

### Docs-Wartung

- **Sidebar:** viele HTML-Dateien duplizieren die Sidebar — bei neuen Top-Level-Seiten alle betroffenen Dateien oder `tools/sync-sidebar.py` nutzen.
- **Sprachen:** Englisch `docs/getting-started/introduction.html` · Deutsch `docs/getting-started/einfuehrung.html`
- **GitHub:** überall `https://github.com/SkyliteDesign/velinstyle`
- **npm/CDN:** `@birdapi/velinstyle@1.2.0` für Releases

## Lizenz

MIT — [SkyliteDesign](https://github.com/SkyliteDesign)

**[English](README.md)**

### SEO / Sitemaps

```bash
npm run generate:sitemaps
```

Erzeugt `sitemap.xml` (velinstyle.info), `sitemap-index.xml`, `sitemaps/velinstyle.{info,de,eu,org,store}.xml` und `robots.txt`. Details: [sitemaps/README.md](sitemaps/README.md).
