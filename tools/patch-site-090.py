#!/usr/bin/env python3
"""Add VelinStyle 0.9.0 docs to velinstyle-site: new pages, patches, sidebar sync."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
DOCS = SITE / "docs"
TEMPLATE = DOCS / "guides" / "responsive-layout.html"

NEW_PAGES: dict[str, dict] = {
    "guides/performance-audit.html": {
        "title": "Performance audit",
        "breadcrumb": ("Guides", "Performance audit"),
        "lead": "Audit static HTML for CLS, lazy-loading, and render-blocking scripts — with safe auto-fixes.",
        "toc": ["commands", "rules", "ci"],
        "body": """
      <h2 id="commands">Commands</h2>
      <pre><code class="language-bash">velinstyle perf audit samples/
velinstyle perf suggest .
velinstyle perf fix . --write
velinstyle perf audit . --json</code></pre>
      <h2 id="rules">Rules</h2>
      <table class="velin-table">
        <thead><tr><th>Rule</th><th>Severity</th><th>Autofix</th></tr></thead>
        <tbody>
          <tr><td><code>img-missing-dimensions</code></td><td>warning</td><td>width/height defaults</td></tr>
          <tr><td><code>img-no-lazy</code></td><td>info</td><td><code>loading="lazy"</code></td></tr>
          <tr><td><code>script-no-defer</code></td><td>warning</td><td><code>defer</code> on external scripts</td></tr>
          <tr><td><code>large-inline-style</code></td><td>info</td><td>—</td></tr>
          <tr><td><code>font-display-swap</code></td><td>info</td><td>hint in report</td></tr>
          <tr><td><code>unused-velin-import</code></td><td>info</td><td>suggests runtime subpath</td></tr>
        </tbody>
      </table>
      <h2 id="ci">CI</h2>
      <p>Run <code>npm run test:perf</code> in the framework repo, or <code>npx velinstyle perf audit samples/ --json</code> in CI. Exit code <code>1</code> when any <strong>error</strong>-severity issue is found.</p>
""",
        "prev": ("responsive-layout.html", "Responsive layout"),
        "next": ("design-tokens.html", "Design tokens"),
        "cat": "guides",
    },
    "guides/design-tokens.html": {
        "title": "Design tokens pipeline",
        "breadcrumb": ("Guides", "Design tokens"),
        "lead": "Validate JSON token files and build CSS custom properties — including fonts and motion blocks (0.9.0).",
        "toc": ["validate", "build", "schema"],
        "body": """
      <h2 id="validate">Validate</h2>
      <pre><code class="language-bash">velinstyle tokens validate --input examples/tokens.sample.json
npm run tokens:validate</code></pre>
      <p>Checks OKLCH syntax, theme names, and <code>fonts</code>, <code>motion</code>, <code>zIndex</code> blocks.</p>
      <h2 id="build">Build</h2>
      <pre><code class="language-bash">velinstyle tokens build --input examples/tokens.full.json -o src/tokens-generated.css</code></pre>
      <p>Emits <code>@layer tokens</code> with <code>:root</code>, per-theme overrides, optional <code>displayP3</code>, plus <code>fonts</code>, <code>motion</code>, and <code>zIndex</code> sections (deterministic key order).</p>
      <h2 id="schema">Schema</h2>
      <p>See <code>examples/tokens.schema.json</code> and <code>examples/tokens.full.json</code> in the <a href="https://github.com/SkyliteDesign/velinstyle">framework repository</a>.</p>
""",
        "prev": ("performance-audit.html", "Performance audit"),
        "next": ("api-reference.html", "API reference"),
        "cat": "guides",
    },
    "components/email.html": {
        "title": "Email (obfuscation)",
        "breadcrumb": ("Components", "Email"),
        "lead": "Reveal email addresses on click or keyboard — reduces scraper exposure while staying WCAG-friendly.",
        "toc": ["basic", "attributes", "a11y"],
        "body": """
      <h2 id="basic">Basic</h2>
      <div class="velin-doc-example"><div class="velin-doc-example__preview">
        <velin-email value="contact@example.com" label="Show email address"></velin-email>
      </div></div>
      <pre><code class="language-html">&lt;velin-email value="contact@example.com" label="Show email address"&gt;&lt;/velin-email&gt;</code></pre>
      <p>Included in the main bundle or via <code>import '@birdapi/velinstyle/email'</code>.</p>
      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>value</code></td><td>Plain email or obfuscated (see <code>obfuscate</code>)</td></tr>
          <tr><td><code>obfuscate</code></td><td><code>rot13</code> or base64-encoded value</td></tr>
          <tr><td><code>label</code></td><td>Button label before reveal</td></tr>
        </tbody>
      </table>
      <h2 id="a11y">Accessibility</h2>
      <p>Before reveal: <code>&lt;button&gt;</code> with neutral label. After reveal: <code>mailto:</code> link. Use the <a href="../extend/security.html#pii">PII scanner</a> to avoid hardcoded addresses in HTML source.</p>
""",
        "prev": ("dropdown.html", "Dropdown"),
        "next": ("secure-field.html", "Secure field"),
        "cat": "components",
    },
    "components/secure-field.html": {
        "title": "Secure field",
        "breadcrumb": ("Components", "Secure field"),
        "lead": "Optional client-side encoding for form fields — transport helper only; TLS is required in production.",
        "toc": ["usage", "events", "warning"],
        "body": """
      <div class="velin-doc-callout velin-doc-callout--warning velin-mbe-4" role="alert">
        <strong>Demo only.</strong> Client-side encoding is not encryption. Never store passwords or API keys.
      </div>
      <h2 id="usage">Usage</h2>
      <pre><code class="language-html">&lt;velin-secure-field type="email" name="contact" label="Email"&gt;&lt;/velin-secure-field&gt;</code></pre>
      <pre><code class="language-javascript">import '@birdapi/velinstyle/secure';</code></pre>
      <p>Not in the default IIFE bundle — import the subpath to keep bundle size small.</p>
      <h2 id="events">Events</h2>
      <p>On change, dispatches <code>velin-secure-submit</code> with <code>detail.payload</code> and <code>detail.name</code>.</p>
      <h2 id="warning">Important</h2>
      <div class="velin-alert velin-alert--warning" role="alert">
        <div class="velin-alert__content">Transport aid only — not a replacement for HTTPS, server validation, or secret management.</div>
      </div>
""",
        "prev": ("email.html", "Email"),
        "next": ("sheet.html", "Sheet"),
        "cat": "components",
    },
    "guides/api-reference.html": {
        "title": "API reference (generated)",
        "breadcrumb": ("Guides", "API reference"),
        "lead": "Markdown reference generated from source — Web Components, tokens, utilities, CLI, and scanner rules stay in sync with the codebase.",
        "toc": ["generate", "sections", "ci", "github"],
        "body": """
      <h2 id="generate">Generate locally</h2>
      <pre><code class="language-bash">npm run docs:generate
npx velinstyle docs generate
npx velinstyle docs generate --scope components
npx velinstyle docs generate --scope tokens</code></pre>
      <p>Scopes: <code>all</code>, <code>components</code>, <code>tokens</code>, <code>utilities</code>, <code>cli</code>, <code>rules</code>, <code>a11y</code>.</p>
      <h2 id="sections">Output sections</h2>
      <table class="velin-table">
        <thead><tr><th>Section</th><th>Source</th></tr></thead>
        <tbody>
          <tr><td>Web Components</td><td><code>components/velin-*.js</code></td></tr>
          <tr><td>Design tokens</td><td><code>src/tokens/*.css</code></td></tr>
          <tr><td>Utilities</td><td><code>src/utilities/*.css</code></td></tr>
          <tr><td>CLI</td><td><code>cli/cli-manifest.json</code></td></tr>
          <tr><td>Scanner rules</td><td><code>cli/scanner-rules-data.js</code></td></tr>
          <tr><td>A11y CSS</td><td><code>src/a11y/*.css</code></td></tr>
        </tbody>
      </table>
      <p>Files are written to <code>docs/generated/</code> in the framework repo and deployed on GitHub Pages.</p>
      <h2 id="ci">CI</h2>
      <p>CI runs <code>npm run docs:generate</code> and fails if <code>docs/generated/</code> is out of date. Commit snapshots after API changes.</p>
      <h2 id="github">Browse online</h2>
      <p>
        <a href="https://github.com/SkyliteDesign/velinstyle/tree/main/docs/generated" target="_blank" rel="noopener">docs/generated on GitHub</a>
        ·
        <a href="https://skylitedesign.github.io/velinstyle/generated/" target="_blank" rel="noopener">GitHub Pages /generated/</a>
      </p>
""",
        "prev": ("design-tokens.html", "Design tokens"),
        "next": ("laravel.html", "Laravel"),
        "cat": "guides",
    },
}


def clean_html(html: str) -> str:
    return html.replace("<motion ", "<div ").replace("</motion>", "</div>").replace("<motion>", "<div>")


def make_page(rel_path: str, spec: dict) -> str:
    shell = clean_html(TEMPLATE.read_text(encoding="utf-8"))
    depth = len(Path(rel_path).parts) - 1
    rel = "../" * depth
    bc_cat, bc_title = spec["breadcrumb"]
    bc_href = f"{rel}guides/index.html" if bc_cat == "Guides" else f"{rel}components/accordion.html"

    main = f"""
      <ol class="velin-doc-breadcrumb"><li><a href="{rel}getting-started/introduction.html">Docs</a></li><li><a href="{bc_href}">{bc_cat}</a></li><li>{bc_title}</li></ol>
      <h1>{spec['title']} <span class="velin-badge velin-badge--primary">0.9.0</span></h1>
      <p class="lead">{spec['lead']}</p>
{spec['body']}
      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="{spec['prev'][0]}" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">{spec['prev'][1]}</span></a>
        <a href="{spec['next'][0]}" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">{spec['next'][1]}</span></a>
      </nav>
"""
    toc = "".join(f'<li><a href="#{i}">{i.replace("-", " ").title()}</a></li>' for i in spec["toc"])
    toc_aside = f'<aside class="velin-doc-toc" aria-label="On this page"><div class="velin-doc-toc__title">On this page</div><ul class="velin-doc-toc__list">{toc}</ul></aside>'

    out = re.sub(r"<title>.*?</title>", f"<title>{spec['title']} · VelinStyle</title>", shell, count=1)
    lead_esc = spec["lead"].replace('"', "&quot;")
    out = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{lead_esc}"',
        out,
        count=1,
    )
    out = out.replace("v0.8.0", "v0.9.0")
    out = re.sub(
        r"<main class=\"velin-doc-main\" id=\"main-content\">.*?</main>",
        f"<main class=\"velin-doc-main\" id=\"main-content\">{main}</main>",
        out,
        count=1,
        flags=re.DOTALL,
    )
    out = re.sub(r'<aside class="velin-doc-toc"[^>]*>.*?</aside>', toc_aside, out, count=1, flags=re.DOTALL)
    return clean_html(out)


def patch_key_pages() -> None:
    gi = DOCS / "guides" / "index.html"
    if gi.exists() and "performance-audit" not in gi.read_text(encoding="utf-8"):
        t = gi.read_text(encoding="utf-8")
        t = t.replace(
            '<li><a href="responsive-layout.html"><strong>Responsive layout audit</strong></a>',
            '<li><a href="performance-audit.html"><strong>Performance audit</strong></a> — <code>velinstyle perf</code> (0.9.0).</li>\n        '
            '<li><a href="design-tokens.html"><strong>Design tokens</strong></a> — <code>tokens validate</code> (0.9.0).</li>\n        '
            '<li><a href="api-reference.html"><strong>API reference (generated)</strong></a> — <code>docs generate</code> (0.9.0).</li>\n        '
            '<li><a href="responsive-layout.html"><strong>Responsive layout audit</strong></a>',
        )
        gi.write_text(t.replace("v0.8.0", "v0.9.0").replace("Upgrading to 0.8.0", "Upgrading to 0.9.0"), encoding="utf-8")

    cli = DOCS / "extend" / "cli.html"
    if cli.exists():
        t = cli.read_text(encoding="utf-8")
        if "velinstyle perf" not in t:
            t = t.replace(
                "<tr><td><code>velinstyle layout &lt;sub&gt;</code></td>",
                '<tr><td><code>velinstyle perf &lt;sub&gt;</code></td><td>Performance audit / fix (0.9.0)</td></tr>\n'
                '          <tr><td><code>velinstyle tokens validate</code></td><td>Validate tokens.json</td></tr>\n'
                "          <tr><td><code>velinstyle layout &lt;sub&gt;</code></td>",
            )
        if "--only pii" not in t:
            t = t.replace(
                "velinstyle scan --severity error",
                "velinstyle scan --only pii --fix\n\nvelinstyle scan --severity error",
            )
        if 'id="perf"' not in t:
            t = t.replace(
                '<h2 id="layout">',
                '<h2 id="perf">Performance audit (0.9.0)</h2>\n'
                '<p>See <a href="../guides/performance-audit.html">Performance audit guide</a>.</p>\n'
                '<pre><code class="language-bash">velinstyle perf audit ./public\nvelinstyle perf fix ./public --write</code></pre>\n'
                '<h2 id="layout">',
            )
        if "tokens validate" not in t:
            t = t.replace(
                '<h2 id="tokens">',
                '<h2 id="tokens-validate">Tokens validate (0.9.0)</h2>\n'
                '<pre><code class="language-bash">velinstyle tokens validate --input tokens.json</code></pre>\n'
                '<h2 id="tokens">',
            )
        cli.write_text(t.replace("v0.8.0", "v0.9.0"), encoding="utf-8")

    sec = DOCS / "extend" / "security.html"
    if sec.exists() and 'id="pii"' not in sec.read_text(encoding="utf-8"):
        t = sec.read_text(encoding="utf-8")
        block = """
      <h2 id="pii">PII &amp; email protection (0.9.0)</h2>
      <p>Three layers: CLI scan, display obfuscation, optional form encoding.</p>
      <pre><code class="language-bash">npx velinstyle scan --only pii
npx velinstyle scan --only pii --fix</code></pre>
      <table class="velin-table">
        <thead><tr><th>Rule</th><th>Severity</th></tr></thead>
        <tbody>
          <tr><td><code>pii/hardcoded-email</code></td><td>warning (autofix)</td></tr>
          <tr><td><code>pii/hardcoded-secret</code></td><td>error</td></tr>
          <tr><td><code>pii/mailto-in-source</code></td><td>info</td></tr>
          <tr><td><code>pii/localstorage-pii</code></td><td>warning</td></tr>
        </tbody>
      </table>
      <p><a href="../components/email.html">velin-email</a> · <a href="../components/secure-field.html">velin-secure-field</a></p>

"""
        t = t.replace('<h2 id="scanner">Security Scanner</h2>', block + '      <h2 id="scanner">Security Scanner</h2>')
        sec.write_text(t.replace("v0.8.0", "v0.9.0"), encoding="utf-8")

    js = DOCS / "extend" / "javascript-api.html"
    if js.exists() and "lazyDefine" not in js.read_text(encoding="utf-8"):
        t = js.read_text(encoding="utf-8")
        runtime = """
      <h2 id="runtime">Runtime API (0.9.0)</h2>
      <pre><code class="language-javascript">import { register, lazyDefine, bootFromDOM } from '@birdapi/velinstyle/runtime';

await register(['velin-modal', 'velin-toast']);
await lazyDefine('velin-sheet');
await bootFromDOM();</code></pre>
      <p>Subpaths: <code>/sanitize</code>, <code>/email</code>, <code>/secure</code>, <code>/css</code>.</p>

"""
        t = t.replace('<h2 id="esm">ES Modules', runtime + '      <h2 id="esm">ES Modules')
        js.write_text(t.replace("v0.8.0", "v0.9.0"), encoding="utf-8")

    a11y = DOCS / "getting-started" / "accessibility.html"
    if a11y.exists() and "authentication.css" not in a11y.read_text(encoding="utf-8"):
        t = a11y.read_text(encoding="utf-8")
        rows = """            <tr><td>3.3.8 Accessible Authentication</td><td><code>authentication.css</code></td></tr>
            <tr><td>3.2.6 Consistent Help</td><td><code>consistent-help.css</code></td></tr>
            <tr><td>2.5.7 Dragging Movements</td><td><code>dragging-alternatives.css</code></td></tr>
            <tr><td>2.4.12 Focus Appearance</td><td><code>focus-appearance.css</code></td></tr>
"""
        t = t.replace(
            "<tr><td>2.4.11 Focus Not Obscured</td>",
            rows + "            <tr><td>2.4.11 Focus Not Obscured</td>",
        )
        a11y.write_text(t.replace("v0.8.0", "v0.9.0").replace("Upgrading to 0.8.0", "Upgrading to 0.9.0"), encoding="utf-8")

    typo = DOCS / "content" / "typography.html"
    if typo.exists() and "--velin-font-display" not in typo.read_text(encoding="utf-8"):
        t = typo.read_text(encoding="utf-8")
        block = """
      <h2 id="font-tokens">Font tokens (0.9.0)</h2>
      <ul>
        <li><code>--velin-font-display</code>, <code>--velin-font-text</code>, <code>--velin-font-code</code></li>
        <li>Utilities: <code>.velin-font-display</code>, <code>.velin-tabular-nums</code>, <code>.velin-text-pretty</code></li>
      </ul>
      <p>JSON <code>fonts</code> block in <a href="../guides/design-tokens.html">Design tokens</a>.</p>
"""
        t = t.replace('<h2 id="headings">', block + '      <h2 id="headings">')
        typo.write_text(t.replace("v0.8.0", "v0.9.0"), encoding="utf-8")

    up = DOCS / "getting-started" / "upgrading.html"
    if up.exists():
        t = up.read_text(encoding="utf-8")
        if "PII scanner" not in t:
            t = t.replace(
                "<h1>Upgrading</h1>",
                '<h1>Upgrading</h1>\n<p class="lead"><strong>0.9.0</strong> — PII scanner, perf CLI, runtime API, font tokens. '
                '<a href="https://github.com/SkyliteDesign/velinstyle/blob/main/CHANGELOG.md">CHANGELOG</a>.</p>',
                1,
            )
        up.write_text(t.replace("0.8.0", "0.9.0"), encoding="utf-8")


def bump_versions() -> int:
    n = 0
    for html in list(DOCS.rglob("*.html")) + [SITE / "index.html"]:
        if not html.exists():
            continue
        t = html.read_text(encoding="utf-8")
        nt = (
            t.replace('velin-doc-header__version">v0.8.0', 'velin-doc-header__version">v0.9.0')
            .replace("Upgrading to 0.8.0", "Upgrading to 0.9.0")
            .replace("@birdapi/velinstyle@0.8.0", "@birdapi/velinstyle@0.9.0")
            .replace("unpkg.com/@birdapi/velinstyle@0.8.0", "unpkg.com/@birdapi/velinstyle@0.9.0")
        )
        if nt != t:
            html.write_text(nt, encoding="utf-8")
            n += 1
    return n


def main() -> None:
    for rel, spec in NEW_PAGES.items():
        path = DOCS / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(make_page(rel, spec), encoding="utf-8")
        print(f"Wrote {path.relative_to(SITE)}")

    patch_key_pages()
    print(f"Version bumps: {bump_versions()} files")

    subprocess.run([__import__("sys").executable, str(SITE / "tools" / "sync-sidebar.py")], check=True, cwd=SITE)
    print("Sidebar synced.")


if __name__ == "__main__":
    main()
