#!/usr/bin/env python3
"""Create landing-15-min + marketing-lite-css guides (+ DE) with doc chrome."""
from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
FW = SITE.parent / "velinstyle"
TEMPLATE_EN = SITE / "docs" / "guides" / "prompt-scaffolding.html"
TEMPLATE_DE = SITE / "docs" / "guides" / "prompt-vorlagen.html"


def framework_version() -> str:
    try:
        return str(json.loads((FW / "package.json").read_text(encoding="utf-8")).get("version") or "0.0.0")
    except Exception:
        return "0.0.0"


VERSION = framework_version()


def build_page(template: Path, out: Path, main: str, toc: str, title: str, description: str, canonical: str) -> None:
    text = template.read_text(encoding="utf-8")
    text = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", text, count=1)
    text = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{description}"',
        text,
        count=1,
    )
    text = re.sub(
        r'<link rel="canonical" href="[^"]*"',
        f'<link rel="canonical" href="{canonical}"',
        text,
        count=1,
    )
    text = re.sub(
        r"<main class=\"velin-doc-main\" id=\"main-content\">.*?</nav>\s*</main>",
        f"<main class=\"velin-doc-main\" id=\"main-content\">{main}\n</main>",
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r"<ul class=\"velin-doc-toc__list\">.*?</ul>",
        f'<ul class="velin-doc-toc__list">{toc}\n      </ul>',
        text,
        count=1,
        flags=re.S,
    )
    out.write_text(text, encoding="utf-8")


MAIN_LANDING_EN = f"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Landing in 15 minutes</li></ol>
      <h1>Landing in 15 minutes <span class="velin-badge">{VERSION}</span></h1>
      <p class="lead">Scaffold a validated marketing page with <code>create landing</code>, preview with <code>serve</code>, compose with strict blueprints. <a href="landing-15-min-leitfaden.html" hreflang="de">Deutsch</a> · <a href="marketing-lite-css.html">Lite CSS</a></p>

      <h2 id="steps">Steps</h2>
      <ol>
        <li>Install npm package or copy <code>dist/</code> → <code>vendor/velinstyle</code> (Windows: CLI uses <code>pathToFileURL</code> for config imports).</li>
        <li><code>velinstyle create landing ./my-landing --theme earth</code></li>
        <li><code>velinstyle serve ./my-landing</code> (port 4173)</li>
        <li>Compose: <code>blueprint split-hero --strict</code>, <code>pricing-band</code>, <code>cookie-consent</code>, <code>empty-state</code></li>
        <li><code>velinstyle doctor</code> then <code>velinstyle review ./my-landing/index.html</code></li>
      </ol>

      <h2 id="recipes">Recipes (existing classes only)</h2>
      <ul>
        <li>Cookie / empty / pricing → blueprints, not new Web Components</li>
        <li>App chrome / ops console → <code>app-chrome</code>, <code>ops-console</code></li>
        <li>Gate generators with <code>blueprint --strict</code> / <code>npm run check:blueprints</code></li>
      </ul>

      <h2 id="skills">Skills</h2>
      <p><code>velinstyle skills show &lt;id&gt; --human</code> prints Markdown. Blueprints must only emit CSS classes that exist.</p>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="prompt-scaffolding.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Prompt scaffolding</span></a>
        <a href="marketing-lite-css.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Marketing lite CSS</span></a>
      </nav>
"""

MAIN_LANDING_DE = f"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/einfuehrung.html">Docs</a></li><li><a href="../guides/uebersicht.html">Guides</a></li><li>Landing in 15 Minuten</li></ol>
      <h1>Landing in 15 Minuten <span class="velin-badge">{VERSION}</span></h1>
      <p class="lead">Validierte Marketing-Seite mit <code>create landing</code>, Vorschau mit <code>serve</code>, Bausteine mit strict Blueprints. <a href="landing-15-min.html" hreflang="en">English</a> · <a href="marketing-lite-css-leitfaden.html">Lite CSS</a></p>

      <h2 id="schritte">Schritte</h2>
      <ol>
        <li>npm-Paket oder <code>dist/</code> → <code>vendor/velinstyle</code> (Windows: Config-Import via <code>pathToFileURL</code>).</li>
        <li><code>velinstyle create landing ./meine-landing --theme earth</code></li>
        <li><code>velinstyle serve ./meine-landing</code> (Port 4173)</li>
        <li>Blueprints: <code>split-hero --strict</code>, <code>pricing-band</code>, Cookie/Empty-State</li>
        <li><code>velinstyle doctor</code> und <code>review</code></li>
      </ol>

      <h2 id="rezepte">Rezepte</h2>
      <p>Keine neuen Groß-WCs — nur existierende Klassen. Generatoren mit <code>blueprint --strict</code> absichern.</p>

      <nav class="velin-doc-prevnext" aria-label="Seitennavigation">
        <a href="prompt-vorlagen.html" class="prev"><span class="velin-doc-prevnext__label">Zurück</span><span class="velin-doc-prevnext__title">Prompt-Vorlagen</span></a>
        <a href="marketing-lite-css-leitfaden.html" class="next"><span class="velin-doc-prevnext__label">Weiter</span><span class="velin-doc-prevnext__title">Marketing lite CSS</span></a>
      </nav>
"""

MAIN_LITE_EN = f"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Marketing lite CSS</li></ol>
      <h1>Marketing lite CSS <span class="velin-badge">{VERSION}</span></h1>
      <p class="lead">Build a smaller CSS subset for marketing pages. Pair with lazy Web Components / <code>bootFromDOM</code> instead of the full JS bundle. <a href="marketing-lite-css-leitfaden.html" hreflang="de">Deutsch</a></p>

      <h2 id="build">Build</h2>
      <pre><code class="language-bash">velinstyle build --preset lite -o ./velinstyle-lite.css --minify</code></pre>
      <p>Layers: <code>tokens</code>, <code>reset</code>, <code>base</code>, <code>layout</code>, <code>components</code>, <code>utilities</code>. Or set <code>preset: 'lite'</code> in <code>velinstyle.config.js</code>.</p>

      <h2 id="measure">Measure</h2>
      <p>Compare the lite output size to <code>dist/velinstyle.min.css</code> after build and record it in your deploy checklist. Prefer runtime tree-shaking for JS.</p>

      <h2 id="related">Related</h2>
      <ul>
        <li><a href="landing-15-min.html">Landing in 15 minutes</a></li>
        <li><a href="../extend/cli.html">CLI</a> — <code>build --preset lite</code>, <code>doctor</code>, <code>serve</code></li>
      </ul>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="landing-15-min.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Landing in 15 minutes</span></a>
        <a href="responsive-layout.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Responsive layout</span></a>
      </nav>
"""

MAIN_LITE_DE = f"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/einfuehrung.html">Docs</a></li><li><a href="../guides/uebersicht.html">Guides</a></li><li>Marketing lite CSS</li></ol>
      <h1>Marketing lite CSS <span class="velin-badge">{VERSION}</span></h1>
      <p class="lead">Kleinere CSS-Schicht für Marketing-Seiten. JS lazy / <code>bootFromDOM</code> statt Full-Bundle. <a href="marketing-lite-css.html" hreflang="en">English</a></p>

      <h2 id="build">Build</h2>
      <pre><code class="language-bash">velinstyle build --preset lite -o ./velinstyle-lite.css --minify</code></pre>
      <p>Layer: tokens, reset, base, layout, components, utilities.</p>

      <h2 id="messen">Messen</h2>
      <p>Lite-Datei gegen <code>dist/velinstyle.min.css</code> vergleichen und die Größe dokumentieren.</p>

      <nav class="velin-doc-prevnext" aria-label="Seitennavigation">
        <a href="landing-15-min-leitfaden.html" class="prev"><span class="velin-doc-prevnext__label">Zurück</span><span class="velin-doc-prevnext__title">Landing in 15 Minuten</span></a>
        <a href="responsive-layout-audit.html" class="next"><span class="velin-doc-prevnext__label">Weiter</span><span class="velin-doc-prevnext__title">Responsive Layout</span></a>
      </nav>
"""

TOC_LANDING = """
        <li><a href="#steps">Steps</a></li>
        <li><a href="#recipes">Recipes</a></li>
        <li><a href="#skills">Skills</a></li>
"""
TOC_LANDING_DE = """
        <li><a href="#schritte">Schritte</a></li>
        <li><a href="#rezepte">Rezepte</a></li>
"""
TOC_LITE = """
        <li><a href="#build">Build</a></li>
        <li><a href="#measure">Measure</a></li>
        <li><a href="#related">Related</a></li>
"""
TOC_LITE_DE = """
        <li><a href="#build">Build</a></li>
        <li><a href="#messen">Messen</a></li>
"""


def main() -> None:
    pages = [
        (
            TEMPLATE_EN,
            SITE / "docs" / "guides" / "landing-15-min.html",
            MAIN_LANDING_EN,
            TOC_LANDING,
            f"Landing in 15 minutes · VelinStyle",
            "Create, serve, and review a validated VelinStyle landing page in minutes.",
            "https://velinstyle.info/docs/guides/landing-15-min.html",
        ),
        (
            TEMPLATE_DE if TEMPLATE_DE.is_file() else TEMPLATE_EN,
            SITE / "docs" / "guides" / "landing-15-min-leitfaden.html",
            MAIN_LANDING_DE,
            TOC_LANDING_DE,
            "Landing in 15 Minuten · VelinStyle",
            "Validierte VelinStyle-Landingpage mit create, serve und Blueprints.",
            "https://velinstyle.info/docs/guides/landing-15-min-leitfaden.html",
        ),
        (
            TEMPLATE_EN,
            SITE / "docs" / "guides" / "marketing-lite-css.html",
            MAIN_LITE_EN,
            TOC_LITE,
            "Marketing lite CSS · VelinStyle",
            "Build a smaller VelinStyle CSS subset with preset lite.",
            "https://velinstyle.info/docs/guides/marketing-lite-css.html",
        ),
        (
            TEMPLATE_DE if TEMPLATE_DE.is_file() else TEMPLATE_EN,
            SITE / "docs" / "guides" / "marketing-lite-css-leitfaden.html",
            MAIN_LITE_DE,
            TOC_LITE_DE,
            "Marketing lite CSS Leitfaden · VelinStyle",
            "Kleinere VelinStyle-CSS-Schicht mit preset lite.",
            "https://velinstyle.info/docs/guides/marketing-lite-css-leitfaden.html",
        ),
    ]
    for template, out, main, toc, title, desc, canonical in pages:
        build_page(template, out, main, toc, title, desc, canonical)

    # Index + guides overview links
    index = SITE / "docs" / "guides" / "index.html"
    if index.is_file():
        text = index.read_text(encoding="utf-8")
        needle = '<li><a href="prompt-scaffolding.html"><strong>Prompt scaffolding</strong></a>'
        inject = (
            '<li><a href="landing-15-min.html"><strong>Landing in 15 minutes</strong></a> — '
            '<code>create landing</code>, <code>serve</code>, strict blueprints.</li>\n'
            '        <li><a href="marketing-lite-css.html"><strong>Marketing lite CSS</strong></a> — '
            '<code>build --preset lite</code>.</li>\n        '
            + needle
        )
        if "landing-15-min.html" not in text and needle in text:
            index.write_text(text.replace(needle, inject, 1), encoding="utf-8")

    spec = importlib.util.spec_from_file_location("sync", SITE / "tools" / "sync-sidebar.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    for name in (
        "landing-15-min.html",
        "landing-15-min-leitfaden.html",
        "marketing-lite-css.html",
        "marketing-lite-css-leitfaden.html",
        "index.html",
    ):
        p = SITE / "docs" / "guides" / name
        if p.is_file():
            mod.patch_file(p)
            print(f"Wrote/patched {p}")


if __name__ == "__main__":
    main()
