#!/usr/bin/env python3
"""Apply final documentation content patches for the current framework version."""
from __future__ import annotations

import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
DOCS = SITE / "docs"
FRAMEWORK = SITE.parent / "velinstyle"
FRAMEWORK_VERSION = json.loads((FRAMEWORK / "package.json").read_text(encoding="utf-8")).get("version", "0.0.0")

CDN_EXAMPLE = (
    "__CDN_EX_PLACEHOLDER__"
)
CDN_EXAMPLE = CDN_EXAMPLE.replace(
    "__CDN_EX_PLACEHOLDER__",
    '<div class="velin-doc-example"><div class="velin-doc-example__tabs">'
    '<button class="velin-doc-example__tab active" data-tab="code">HTML</button></div>'
    '<div class="velin-doc-example__panel active" data-panel="code">'
    '<div class="velin-doc-example__code"><button class="velin-doc-copy-btn" aria-label="Copy code">'
    '<velin-icon name="copy" size="14"></velin-icon> Copy</button>'
    '<pre><code class="language-markup">&lt;link rel="stylesheet" href="/dist/velinstyle.min.css"&gt;\n'
    '&lt;script type="module" src="/dist/velinstyle-components.min.js"&gt;&lt;/script&gt;</code></pre>'
    '</div></div></div>',
)


def patch_file(path: Path, transforms: list) -> bool:
    if not path.is_file():
        print(f"skip missing {path}")
        return False
    text = path.read_text(encoding="utf-8")
    orig = text
    for fn in transforms:
        text = fn(text)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print(f"patched {path.relative_to(SITE.parent)}")
        return True
    return False


def patch_site_javascript_api(text: str) -> str:
    text = text.replace(
        "import { register } from '@birdapi/velinstyle/runtime';\nawait register(['velin-modal', 'velin-tabs']);",
        "import { register, bootFromDOM } from '@birdapi/velinstyle';\nawait register(['velin-modal', 'velin-search']);\nawait bootFromDOM(document, { attributes: true, highlight: true });",
    )
    text = text.replace(
        "import { register, lazyDefine, bootFromDOM } from '@birdapi/velinstyle/runtime';\n\nawait register(['velin-modal', 'velin-toast']);\nawait lazyDefine('velin-sheet');\nawait bootFromDOM(); // upgrades [data-velin-component=\"modal\"]",
        "import { register, lazyDefine, bootFromDOM } from '@birdapi/velinstyle';\n\nawait register(['velin-modal', 'velin-search']);\nawait bootFromDOM(document, { attributes: true, highlight: true });\n// Full bundle: import '@birdapi/velinstyle/bundle';",
    )
    text = text.replace(
        "Subpath exports: <code>@birdapi/velinstyle/sanitize</code>, <code>/email</code>, <code>/secure</code>, <code>/css</code>.",
        "38 lazy-loaded tags (incl. <code>velin-tooltip</code>, <code>velin-stepper</code> aliases). Subpaths: <code>/sanitize</code>, <code>/search</code>, <code>/motion</code>, <code>/attributes</code>, <code>/highlight</code>. Types: <code>dist/velinstyle.d.ts</code>.",
    )
    text = text.replace(
        "import { velinSearch, createSearch, registerSearchProvider } from '@birdapi/velinstyle/search';\n\nawait velinSearch.loadIndex('/search-index.json');\nconst { results, groups } = await velinSearch.query('modal', { fuzzy: 0.2 });",
        "import { createSearch } from '@birdapi/velinstyle/search';\n\nconst search = createSearch({ worker: true, workerUrl: new URL('./search.worker.js', import.meta.url).href });\nawait search.loadIndex('/search-index.json');\nconst { results } = await search.query('modal', { fuzzy: 0.2 });",
    )
    text = text.replace(
        "import { initMotion } from '@birdapi/velinstyle/motion';\nimport { bootFromDOM } from '@birdapi/velinstyle/runtime';\n\nawait bootFromDOM(document, { attributes: true });\ninitMotion();",
        "import { initMotion } from '@birdapi/velinstyle/motion';\n\ninitMotion(); // after bootFromDOM with attributes: true",
    )
    if "unpkg.com/@birdapi/velinstyle@0.9.0" in text:
        replacement = (
            '<h3 id="cdn">Self-hosted</h3>\n'
            '      <p>Ship <code>dist/</code> from the <a href="https://github.com/SkyliteDesign/velinstyle">framework repo</a> '
            'or <a href="https://velinstyle.info">velinstyle.info</a>. The npm registry may lag behind Git.</p>\n'
            f"      {CDN_EXAMPLE}\n\n"
            "      <!-- ======== Web Component APIs"
        )
        text = re.sub(
            r'<h3 id="cdn">CDN</h3>[\s\S]*?<!-- ======== Web Component APIs',
            replacement,
            text,
            count=1,
        )
    return text


def patch_site_download_cdn(text: str) -> str:
    if "Self-hosted (recommended)" in text:
        return text
    if "unpkg.com/@birdapi/velinstyle@" not in text:
        return text
    lead = (
        '<p>Copy <code>dist/</code> from the framework repository or this docs site. '
        "Optional third-party CDNs may reference older npm builds — pin what you ship.</p>"
    )
    text = re.sub(
        r'<h2 id="cdn">CDN</h2>\s*<p>[\s\S]*?</p>\s*',
        f'<h2 id="cdn">Self-hosted (recommended)</h2>\n      {lead}\n\n      ',
        text,
        count=1,
    )
    text = re.sub(
        r"https://unpkg\.com/@birdapi/velinstyle@[^/]+/dist/velinstyle\.min\.css",
        "/dist/velinstyle.min.css",
        text,
    )
    text = re.sub(
        r"https://unpkg\.com/@birdapi/velinstyle@[^/]+/dist/velinstyle-components\.iife\.js",
        "/dist/velinstyle-components.iife.js",
        text,
    )
    text = re.sub(
        r"https://unpkg\.com/@birdapi/velinstyle@[^/]+/dist/velinstyle-components\.min\.js",
        "/dist/velinstyle-components.min.js",
        text,
    )
    return text


def patch_site_upgrading(text: str) -> str:
    if 'id="v100"' in text:
        return text
    block = """
      <h2 id="v100">Upgrading within 1.0.x</h2>
      <ul>
        <li><strong>Runtime:</strong> default export <code>@birdapi/velinstyle</code> — use <code>register()</code> + <code>bootFromDOM()</code> instead of loading the full IIFE when possible.</li>
        <li><strong>Aliases:</strong> <code>velin-tooltip-wc</code> and <code>velin-stepper-wc</code> are deprecated aliases — use <code>velin-tooltip</code> / <code>velin-stepper</code> (source files renamed).</li>
        <li><strong>Spacing:</strong> <code>.velin-mb-*</code> is <em>margin-bottom</em>; use <code>.velin-my-*</code> for block-axis spacing.</li>
        <li><strong>Security:</strong> <code>sanitizeSearchUrl</code>, DOMPurify for SVG — see <a href="../extend/security.html">Security</a>.</li>
        <li><strong>WCAG:</strong> targets <strong>WCAG 2.2 Level AAA</strong> token defaults — <a href="../generated/a11y/wcag22-aaa-matrix.md">AAA matrix</a>.</li>
      </ul>
"""
    text = text.replace('<h2 id="changelog">Changelog</h2>', block + '      <h2 id="changelog">Changelog</h2>')
    text = text.replace(
        "0.7.0 is an accessibility-focused minor release (WCAG 2.2 AA, optional AAA contrast).",
        '0.7.0 added WCAG-oriented CSS modules (optional AAA via <code>data-velin-contrast="aaa"</code>).',
    )
    return text


def patch_site_api_reference(text: str) -> str:
    if "WCAG 2.2 matrix" in text:
        return text
    rows = """          <tr><td>HTML attributes</td><td><code>core/attributes/</code></td></tr>
          <tr><td>WCAG 2.2 AAA matrix</td><td><code>docs/generated/a11y/wcag22-aaa-matrix.md</code></td></tr>
"""
    return text.replace(
        "<tr><td>A11y CSS</td><td><code>src/a11y/*.css</code></td></tr>",
        "<tr><td>A11y CSS</td><td><code>src/a11y/*.css</code></td></tr>\n" + rows,
    )


def patch_site_velin_search(text: str) -> str:
    note = (
        '<div class="velin-doc-callout velin-doc-callout--info velin-mbe-4" role="note">\n'
        "        <strong>Security:</strong> Result <code>href</code> values pass through "
        "<code>sanitizeSearchUrl</code>. Highlights are escaped.\n"
        "      </div>\n"
    )
    if "sanitizeSearchUrl" not in text:
        text = text.replace('<h2 id="overview">Overview</h2>', note + '      <h2 id="overview">Overview</h2>')
    text = text.replace(
        "const search = createSearch({ worker: true });",
        "const search = createSearch({ worker: true, workerUrl: new URL('./search.worker.js', import.meta.url).href });",
    )
    if "createSearch({ worker" not in text:
        text = text.replace(
            "const { results, groups } = await velinSearch.query('tokens',",
            "const search = createSearch({ worker: true, workerUrl: new URL('./search.worker.js', import.meta.url).href });\nawait search.loadIndex('/search-index.json');\nconst { results, groups } = await search.query('tokens',",
        )
    return text


def patch_framework_javascript_api(_text: str) -> str:
    html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript runtime API - VelinStyle</title>
  <link rel="stylesheet" href="../dist/velinstyle.css">
</head>
<body>
  <a href="#main" class="velin-skip-link">Skip to main content</a>
  <main id="main" class="velin-container velin-py-8">
    <h1 class="velin-text-3xl velin-font-bold">JavaScript runtime API <span class="velin-badge velin-badge--primary">__VELIN_VERSION__</span></h1>
    <p class="velin-text-muted velin-mbe-6">Tree-shakeable runtime with lazy Web Components, core modules, and TypeScript types.</p>
    <pre class="velin-code">import { register, lazyDefine, bootFromDOM } from '@birdapi/velinstyle';

await register(['velin-modal', 'velin-search']);
await bootFromDOM(document, { attributes: true, highlight: true });
// Full bundle: import '@birdapi/velinstyle/bundle';</pre>
    <p>Subpaths: <code>@birdapi/velinstyle/sanitize</code>, <code>/search</code>, <code>/motion</code>, <code>/attributes</code>, <code>/highlight</code>. Types: <code>dist/velinstyle.d.ts</code>.</p>
    <h2 class="velin-text-xl velin-font-bold velin-mbs-4">VelinSearch</h2>
    <pre class="velin-code">import { createSearch } from '@birdapi/velinstyle/search';
const search = createSearch({ worker: true, workerUrl: new URL('./search.worker.js', import.meta.url).href });
await search.loadIndex('/search-index.json');
const { results } = await search.query('modal', { fuzzy: 0.2 });</pre>
    <h2 class="velin-text-xl velin-font-bold velin-mbs-4">Motion &amp; attributes</h2>
    <pre class="velin-code">import { initMotion } from '@birdapi/velinstyle/motion';

await bootFromDOM(document, { attributes: true });
initMotion();</pre>
  </main>
  <footer class="velin-container velin-py-4 velin-text-sm velin-text-muted">VelinStyle v__VELIN_VERSION__</footer>
  <script src="../assets/docs-a11y.js" defer></script>
</body>
</html>
"""
    return html.replace("__VELIN_VERSION__", FRAMEWORK_VERSION)


def patch_framework_security_xss(text: str) -> str:
    if "sanitizeSearchUrl" in text:
        return text
    start = text.find('<h2 class="velin-text-2xl velin-font-bold velin-mbe-4">XSS Protection')
    end = text.find("<!-- ============ CSS Security", start)
    if start == -1 or end == -1:
        return text
    block = """<h2 class="velin-text-2xl velin-font-bold velin-mbe-4">XSS Protection in Web Components</h2>
      <p>Components that render dynamic content should use <code>escapeHTML()</code>, <code>sanitizeURL()</code>, or <code>sanitizeSearchUrl</code>. Icons use <code>sanitizeSVG()</code> (DOMPurify).</p>
      <div class="velin-alert velin-alert--warning velin-mbe-4" role="note">
        <strong>Demo only:</strong> <code>&lt;velin-secure-field&gt;</code> performs client-side encoding — never ship real secrets.
      </div>
      <h3 class="velin-text-lg velin-font-bold velin-mbs-6 velin-mbe-2">High-signal components</h3>
      <table class="sec-table">
        <thead><tr><th>Component</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>&lt;velin-search&gt;</code></td><td>Escaped highlights; sanitized URLs</td></tr>
          <tr><td><code>&lt;velin-icon&gt;</code></td><td>SVG sanitized</td></tr>
          <tr><td><code>&lt;velin-email&gt;</code></td><td>Obfuscation only</td></tr>
          <tr><td><code>&lt;velin-lightbox&gt;</code></td><td><code>sanitizeURL</code></td></tr>
          <tr><td><code>&lt;velin-modal&gt;</code>, dialogs, toasts</td><td>Escaped dynamic text</td></tr>
        </tbody>
      </table>
      """
    return text[:start] + block + text[end:]


def ensure_secure_field_banner() -> None:
    sf = DOCS / "components/secure-field.html"
    if not sf.is_file() or "velin-doc-callout--warning" in sf.read_text(encoding="utf-8"):
        return
    banner = (
        '<div class="velin-doc-callout velin-doc-callout--warning velin-mbe-4" role="alert">\n'
        "        <strong>Demo only.</strong> Client-side encoding is not encryption.\n"
        "      </div>\n"
    )
    t = sf.read_text(encoding="utf-8")
    t = t.replace('<p class="lead">Optional client-side', banner + '<p class="lead">Optional client-side', 1)
    sf.write_text(t, encoding="utf-8")
    print("patched velinstyle-site/docs/components/secure-field.html (demo banner)")


def main() -> None:
    patch_file(DOCS / "extend/javascript-api.html", [patch_site_javascript_api])
    patch_file(DOCS / "getting-started/download.html", [patch_site_download_cdn])
    patch_file(DOCS / "getting-started/rtl.html", [patch_site_download_cdn])
    patch_file(DOCS / "customize/optimize.html", [patch_site_download_cdn])
    patch_file(DOCS / "getting-started/upgrading.html", [patch_site_upgrading])
    patch_file(DOCS / "guides/api-reference.html", [patch_site_api_reference])
    patch_file(DOCS / "guides/velin-search.html", [patch_site_velin_search])

    fw_js = FRAMEWORK / "docs/extend/javascript-api.html"
    if fw_js.is_file():
        fw_js.write_text(patch_framework_javascript_api(""), encoding="utf-8")
        print(f"patched {fw_js.relative_to(FRAMEWORK.parent)}")

    patch_file(FRAMEWORK / "docs/security.html", [patch_framework_security_xss])
    ensure_secure_field_banner()
    print("patch-docs-090-final done")


if __name__ == "__main__":
    main()
