#!/usr/bin/env python3
"""Create guides/feature-scope.html — full VelinStyle capability map + Velin-Meta live panel."""
from __future__ import annotations

import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
TEMPLATE = SITE / "docs" / "guides" / "velin-meta.html"
OUT = SITE / "docs" / "guides" / "feature-scope.html"
INDEX = SITE / "docs" / "guides" / "index.html"


def framework_version() -> str:
    pkg = SITE.parent / "velinstyle" / "package.json"
    try:
        return str(json.loads(pkg.read_text(encoding="utf-8")).get("version") or "0.0.0")
    except Exception:
        return "0.0.0"


def component_counts() -> tuple[int, int]:
    """Canonical and lazy-loader component counts from the framework agent bundle."""
    bundle = SITE.parent / "velinstyle" / "dist" / "velin-agent.json"
    try:
        components = json.loads(bundle.read_text(encoding="utf-8")).get("components") or {}
        return int(components.get("count") or 0), int(components.get("loaderCount") or 0)
    except Exception:
        return 0, 0


VERSION = framework_version()
CANONICAL_COUNT, LOADER_COUNT = component_counts()

MAIN = r"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Feature scope</li></ol>
      <h1>VelinStyle feature scope <span class="velin-badge velin-badge--secondary">1.0.0</span> <span class="velin-badge velin-badge--primary">__VERSION__</span></h1>
      <p class="lead">Everything shipped in the framework — CSS, Web Components, runtime modules, CLI, security tooling, and agent metadata. Use this page as a map before diving into generated reference or guides.</p>

      <h2 id="css">CSS &amp; layout</h2>
      <table class="velin-table">
        <thead><tr><th>Area</th><th>What you get</th><th>Docs</th></tr></thead>
        <tbody>
          <tr><td>Components</td><td>35+ CSS components (buttons, cards, grid, forms, …)</td><td><a href="../components/buttons.html">Components</a></td></tr>
          <tr><td>Utilities</td><td><code>velin-*</code> spacing, color, flex, motion, safe-area, …</td><td><a href="../utilities/api.html">Utilities API</a></td></tr>
          <tr><td>Themes</td><td>13 OKLCH presets via <code>data-velin-theme</code></td><td><a href="../customize/color-modes.html">Color modes</a></td></tr>
          <tr><td>Tokens</td><td><code>--velin-*</code> design tokens, JSON build</td><td><a href="design-tokens.html">Design tokens</a></td></tr>
          <tr><td>A11y</td><td>WCAG 2.2 oriented modules, RTL, reduced motion</td><td><a href="../getting-started/accessibility.html">Accessibility</a></td></tr>
        </tbody>
      </table>

      <h2 id="v080">0.8.0 release (stable baseline)</h2>
      <table class="velin-table">
        <thead><tr><th>Area</th><th>Highlights</th><th>Docs</th></tr></thead>
        <tbody>
          <tr><td>Web Components</td><td>8 primitives + sparkline, counter, live-dot</td><td><a href="../components/sparkline.html">Components</a></td></tr>
          <tr><td>Motion &amp; charts</td><td>Motion tokens, filter-effects, chart-animation; reveal &amp; FLIP</td><td><a href="../utilities/motion.html">Motion tokens</a></td></tr>
          <tr><td>CLI</td><td><code>scaffold</code>, <code>layout audit|suggest|fix</code></td><td><a href="prompt-scaffolding.html">Scaffolding</a></td></tr>
        </tbody>
      </table>

      <h2 id="runtime">0.9.0 runtime modules</h2>
      <table class="velin-table">
        <thead><tr><th>Module</th><th>Export</th><th>Guide</th></tr></thead>
        <tbody>
          <tr><td>VelinSearch</td><td><code>@birdapi/velinstyle/search</code></td><td><a href="velin-search.html">VelinSearch</a></td></tr>
          <tr><td>Motion</td><td><code>@birdapi/velinstyle/motion</code></td><td><a href="motion-attributes.html">Motion</a></td></tr>
          <tr><td>Attributes</td><td><code>@birdapi/velinstyle/attributes</code></td><td><a href="html-attributes.html">HTML attributes</a></td></tr>
          <tr><td>Highlight</td><td><code>@birdapi/velinstyle/highlight</code></td><td><a href="syntax-highlight.html">Syntax highlighting</a></td></tr>
          <tr><td>Velin-Meta</td><td><code>@birdapi/velinstyle/meta</code></td><td><a href="velin-meta.html">Velin-Meta</a></td></tr>
        </tbody>
      </table>

      <h2 id="v110">__VERSION__ additions</h2>
      <table class="velin-table">
        <thead><tr><th>Area</th><th>Highlights</th><th>Docs</th></tr></thead>
        <tbody>
          <tr><td>Release guard</td><td><code>npm run release:check</code> / <code>release:sync</code> — version and docs drift between framework and site</td><td><a href="../extend/repo-tools.html#release-sync">Repo tools</a></td></tr>
          <tr><td>React adapter</td><td><code>@velinstyle/react</code> now official, wrappers generated for every canonical component</td><td><a href="react-vite-starter.html">Vite &amp; React</a></td></tr>
          <tr><td>Data tables</td><td><code>velin-data-table</code> — sorting, filtering, pagination on plain <code>&lt;table&gt;</code> markup</td><td><a href="../components/data-table.html">Data table</a></td></tr>
          <tr><td>Form validation</td><td><code>velin-form-summary</code> — error summary for WCAG 3.3.1 / 3.3.3</td><td><a href="../components/form-summary.html">Form summary</a></td></tr>
          <tr><td>Highlighting</td><td>Python, YAML, Go and Rust lexers</td><td><a href="syntax-highlight.html">Syntax highlighting</a></td></tr>
        </tbody>
      </table>

      <h2 id="components">Web Components</h2>
      <p><strong>__CANONICAL_COUNT__ canonical</strong> custom elements (__LOADER_COUNT__ lazy-loader entries with legacy <code>velin-tooltip-wc</code> / <code>velin-stepper-wc</code>), including <code>velin-search</code>, <code>velin-code-block</code>, <code>velin-modal</code>, <code>velin-data-table</code>, and form helpers. All have <code>component-contracts.json</code> entries; declarative <code>velin-scroll-top</code> attribute; CLS placeholders via <code>wc-placeholder.css</code>.</p>
      <p><a href="../components/accordion.html" class="velin-btn velin-btn--outline velin-btn--sm">Browse components</a>
      <a href="../generated/components/README.md" class="velin-btn velin-btn--ghost velin-btn--sm">Generated WC API</a></p>

      <h2 id="cli">CLI &amp; tooling</h2>
      <ul>
        <li><code>velinstyle init</code>, <code>build</code>, <code>scan</code>, <code>prefix</code>, <code>scaffold</code>, <code>blueprint</code></li>
        <li><code>velinstyle docs generate</code> — Markdown reference (components, tokens, utilities, meta, …)</li>
        <li><code>velinstyle meta</code> — <code>velin-agent.json</code> + <code>llms.txt</code></li>
        <li><code>velinstyle search index</code>, <code>tokens build|validate</code>, <code>perf audit</code></li>
      </ul>
      <p><a href="../extend/cli.html">CLI reference</a> · <a href="../generated/index.html">Generated Markdown hub</a></p>

      <h2 id="security">Security</h2>
      <table class="velin-table">
        <thead><tr><th>Capability</th><th>Description</th><th>Docs</th></tr></thead>
        <tbody>
          <tr><td><code>velinstyle scan</code></td><td>Markup &amp; a11y; PII rules</td><td><a href="../extend/security.html">Security</a></td></tr>
          <tr><td>Sanitize API</td><td><code>@birdapi/velinstyle/sanitize</code></td><td><a href="../extend/javascript-api.html">JS API</a></td></tr>
          <tr><td><code>velin-secure-field</code></td><td>Hardened secrets handling</td><td><a href="../components/secure-field.html">Secure field</a></td></tr>
        </tbody>
      </table>

      <h2 id="velin-meta-live">Velin-Meta (live on this site)</h2>
      <p>This page embeds page-level meta below. The site also publishes a global agent bundle you can fetch from any doc page.</p>
      <div class="velin-grid velin-grid-cols-1 velin-md-grid-cols-2 velin-gap-4 velin-mbe-4">
        <div class="velin-card velin-p-4">
          <h3 class="velin-text-lg velin-font-bold">Global bundle</h3>
          <p class="velin-text-sm velin-text-muted"><code>dist/velin-agent.json</code> + <code>dist/llms.txt</code></p>
          <p class="velin-mbs-3">
            <a href="/dist/velin-agent.json" class="velin-btn velin-btn--primary velin-btn--sm" target="_blank" rel="noopener">Open JSON</a>
            <a href="/dist/llms.txt" class="velin-btn velin-btn--ghost velin-btn--sm" target="_blank" rel="noopener">llms.txt</a>
            <a href="velin-meta.html" class="velin-btn velin-btn--ghost velin-btn--sm">Full guide</a>
          </p>
          <pre id="velinMetaPreview" class="velin-code velin-text-xs" style="max-height:12rem;overflow:auto">Loading bundle summary…</pre>
        </div>
        <div class="velin-card velin-p-4">
          <h3 class="velin-text-lg velin-font-bold">Page meta (this HTML)</h3>
          <p class="velin-text-sm velin-text-muted">MIME <code>application/vnd.velinstyle.meta+json</code></p>
          <pre id="velinPageMetaOut" class="velin-code velin-text-xs" style="max-height:12rem;overflow:auto"></pre>
          <p class="velin-text-sm velin-mbs-0">Generate for your pages: <code>npx velinstyle meta page my.html --write</code></p>
        </div>
      </div>

      <h2 id="related">Related</h2>
      <ul>
        <li><a href="whats-new-extension.html">What&apos;s new (0.9.0 extension)</a></li>
        <li><a href="api-reference.html">API reference (generated)</a></li>
        <li><a href="../extend/core-modules.html">Core modules architecture</a></li>
      </ul>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="../getting-started/introduction.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Introduction</span></a>
        <a href="whats-new-extension.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Search &amp; Motion</span></a>
      </nav>
"""

TOC = """
        <li><a href="#css">CSS &amp; layout</a></li>
        <li><a href="#v080">0.8.0</a></li>
        <li><a href="#runtime">0.9.0 runtime</a></li>
        <li><a href="#v110">1.1.0 additions</a></li>
        <li><a href="#security">Security</a></li>
        <li><a href="#components">Web Components</a></li>
        <li><a href="#cli">CLI</a></li>
        <li><a href="#velin-meta-live">Velin-Meta live</a></li>
        <li><a href="#related">Related</a></li>
"""

PAGE_META = f"""  <script type="application/vnd.velinstyle.meta+json" id="velin-meta">
{{
  "version": "{VERSION}",
  "mime": "application/vnd.velinstyle.meta+json",
  "page": {{ "intent": "guide", "source": "docs/guides/feature-scope.html", "topic": "feature-scope" }},
  "allowed": {{ "classesPrefix": ["velin-"] }}
}}
  </script>
"""

META_DEMO_SCRIPT = """  <script>
(function () {
  var pre = document.getElementById('velinPageMetaOut');
  var block = document.getElementById('velin-meta');
  if (pre && block) pre.textContent = block.textContent.trim();
  var preview = document.getElementById('velinMetaPreview');
  if (!preview) return;
  fetch('/dist/velin-agent.json').then(function (r) { return r.json(); }).then(function (b) {
    preview.textContent = JSON.stringify({
      schemaVersion: b.schemaVersion,
      framework: b.framework,
      components: b.components && b.components.count,
      attributes: b.attributes && b.attributes.count,
      packageExports: b.packageExports,
      conventions: b.conventions
    }, null, 2);
  }).catch(function (e) {
    preview.textContent = 'Could not load velin-agent.json (' + e.message + '). Run npm run dev.';
  });
})();
  </script>
"""


def main() -> None:
    main_html = (
        MAIN.replace("__CANONICAL_COUNT__", str(CANONICAL_COUNT))
        .replace("__LOADER_COUNT__", str(LOADER_COUNT))
        .replace("__VERSION__", VERSION)
    )
    text = TEMPLATE.read_text(encoding="utf-8")
    text = text.replace(
        "<title>Velin-Meta (AI agents) · VelinStyle</title>",
        "<title>Feature scope · VelinStyle</title>",
    )
    text = text.replace(
        'content="Velin-Meta: velin-agent.json',
        'content="Complete VelinStyle capability map — CSS, Web Components, runtime, CLI, Velin-Meta. Test agent bundle',
    )
    if 'id="velin-meta"' not in text or "feature-scope" not in text:
        text = re.sub(
            r'<script type="application/vnd\.velinstyle\.meta\+json" id="velin-meta">[\s\S]*?</script>',
            PAGE_META.strip(),
            text,
            count=1,
        )
    text = re.sub(
        r"<main class=\"velin-doc-main\" id=\"main-content\">.*?</nav>\s*</main>",
        f"<main class=\"velin-doc-main\" id=\"main-content\">{main_html}\n</main>",
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r"<ul class=\"velin-doc-toc__list\">.*?</ul>",
        f'<ul class="velin-doc-toc__list">{TOC}\n      </ul>',
        text,
        count=1,
        flags=re.S,
    )
    if META_DEMO_SCRIPT.strip() not in text:
        text = text.replace("</body>", META_DEMO_SCRIPT + "\n</body>", 1)
    OUT.write_text(text, encoding="utf-8")

    link = (
        '<li><a href="feature-scope.html"><strong>Feature scope</strong></a> — '
        'everything in VelinStyle (CSS, runtime, CLI, Velin-Meta).</li>\n        '
    )
    if "feature-scope.html" not in INDEX.read_text(encoding="utf-8"):
        idx = INDEX.read_text(encoding="utf-8")
        idx = idx.replace(
            '<li><a href="index.html"><strong>Guides overview</strong></a>',
            link + '        <li><a href="index.html"><strong>Guides overview</strong></a>',
            1,
        )
        INDEX.write_text(idx, encoding="utf-8")

    import importlib.util

    spec = importlib.util.spec_from_file_location("sync", SITE / "tools" / "sync-sidebar.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.patch_file(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
