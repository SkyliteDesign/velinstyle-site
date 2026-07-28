#!/usr/bin/env python3
"""Create guides/velin-meta.html and wire sidebar / guides index."""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
FW = SITE.parent / "velinstyle"


def framework_version() -> str:
    try:
        return str(json.loads((FW / "package.json").read_text(encoding="utf-8")).get("version") or "0.0.0")
    except Exception:
        return "0.0.0"


VERSION = framework_version()
TEMPLATE = SITE / "docs" / "guides" / "api-reference.html"
OUT = SITE / "docs" / "guides" / "velin-meta.html"
INDEX = SITE / "docs" / "guides" / "index.html"
CONTENTS = SITE / "docs" / "getting-started" / "contents.html"

META_LINK = (
    '  <link rel="alternate" type="application/vnd.velinstyle.meta+json" '
    'href="/dist/velin-agent.json" title="VelinStyle agent metadata">\n'
)

MAIN = r"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Velin-Meta</li></ol>
      <h1>Velin-Meta (AI agents) <span class="velin-badge velin-badge--primary">0.9.0</span></h1>
      <p class="lead">Machine-readable context for Cursor, Copilot, and custom agents — structured JSON, not hidden from humans.</p>

      <h2 id="what">1. What Velin-Meta is (and is not)</h2>
      <p>Velin-Meta is <strong>agent-optimized metadata</strong>: a compact snapshot of VelinStyle conventions, components, CLI, and doc links. It is <strong>not</strong> encryption, DRM, or “KI-only” access — any HTTP client can fetch <code>velin-agent.json</code>.</p>
      <ul>
        <li><strong>Goal:</strong> fewer hallucinated class names, correct doc URLs, aligned codegen.</li>
        <li><strong>Not a substitute:</strong> full docs, WCAG review, or security audits still need humans.</li>
      </ul>

      <h2 id="mime">2. MIME and files</h2>
      <table class="velin-table">
        <thead><tr><th>Artifact</th><th>Role</th></tr></thead>
        <tbody>
          <tr><td><code>dist/velin-agent.json</code></td><td>Canonical bundle (components, CLI, conventions)</td></tr>
          <tr><td><code>dist/llms.txt</code></td><td>Short index (llms.txt convention)</td></tr>
          <tr><td><code>application/vnd.velinstyle.meta+json</code></td><td>MIME for page-level <code>&lt;script id="velin-meta"&gt;</code></td></tr>
        </tbody>
      </table>
      <p>Published on this site at <a href="/dist/velin-agent.json"><code>/dist/velin-agent.json</code></a> and <a href="/dist/llms.txt"><code>/dist/llms.txt</code></a>.</p>

      <h2 id="bundle">3. Global bundle (<code>velinstyle meta</code>)</h2>
      <pre><code class="language-bash">npx velinstyle meta
npx velinstyle meta --base-url https://velinstyle.info
npm run meta:build</code></pre>
      <p>CI runs <code>meta:build</code> and fails if committed <code>dist/velin-agent.json</code> or <code>dist/llms.txt</code> drift from source.</p>
      <p>Programmatic: <code>import { buildAgentBundle } from '@birdapi/velinstyle/meta'</code>.</p>

      <h2 id="page-meta">4. Page-level meta</h2>
      <pre><code class="language-html">&lt;script type="application/vnd.velinstyle.meta+json" id="velin-meta"&gt;
{
  "page": { "intent": "component-doc", "source": "docs/components/buttons.html" },
  "allowed": { "classesPrefix": ["velin-"], "components": ["velin-modal"] }
}
&lt;/script&gt;</code></pre>
      <pre><code class="language-bash">npx velinstyle meta page my-page.html --write</code></pre>
      <p>Do not put secrets, API keys, or raw PII in page meta.</p>

      <h2 id="cli">5. CLI workflows</h2>
      <ul>
        <li><code>velinstyle meta</code> — rebuild bundle + <code>llms.txt</code></li>
        <li><code>velinstyle docs generate --scope meta</code> — <code>docs/generated/meta/README.md</code></li>
        <li><code>velinstyle scaffold</code> / <code>blueprint</code> — pair with agent rules that reference the bundle</li>
        <li><code>velinstyle scan</code> — validate generated HTML against framework rules</li>
      </ul>

      <h2 id="agents">6. Cursor and other agents</h2>
      <p>Add to project rules or @-mention the bundle URL:</p>
      <pre><code>When editing VelinStyle HTML:
- Use only velin-* classes and documented velin-* Web Components.
- Follow dist/velin-agent.json conventions.
- Run velinstyle scan on new markup.
- Resolve doc links from /docs/ root, not the current folder.</code></pre>
      <p>Related: <a href="prompt-scaffolding.html">Prompt scaffolding</a>, <a href="api-reference.html">API reference (generated)</a>.</p>

      <h2 id="security">7. Security</h2>
      <ul>
        <li>Meta files are public — treat them like README content.</li>
        <li>No credentials, tokens, or personal data in JSON or <code>llms.txt</code>.</li>
        <li>Agents still need your usual review for XSS, auth, and privacy.</li>
      </ul>

      <h2 id="related">8. Related guides</h2>
      <ul>
        <li><a href="velin-search.html">VelinSearch</a> — offline doc search</li>
        <li><a href="../generated/meta/README.md">Generated meta README</a></li>
        <li><a href="../extend/security.html">Security</a></li>
        <li><a href="../extend/cli.html">CLI reference</a></li>
      </ul>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="api-reference.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">API reference</span></a>
        <a href="laravel.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Laravel</span></a>
      </nav>
"""

TOC = """
        <li><a href="#what">What it is</a></li>
        <li><a href="#mime">MIME &amp; files</a></li>
        <li><a href="#bundle">Global bundle</a></li>
        <li><a href="#page-meta">Page meta</a></li>
        <li><a href="#cli">CLI</a></li>
        <li><a href="#agents">Agents</a></li>
        <li><a href="#security">Security</a></li>
        <li><a href="#related">Related</a></li>
"""

PAGE_META = f"""  <script type="application/vnd.velinstyle.meta+json" id="velin-meta">
{{
  "version": "{VERSION}",
  "mime": "application/vnd.velinstyle.meta+json",
  "page": {{ "intent": "guide", "source": "docs/guides/velin-meta.html" }},
  "allowed": {{ "classesPrefix": ["velin-"] }}
}}
  </script>
"""


def sync_agent_files() -> None:
    for name in ("velin-agent.json", "llms.txt"):
        src = FW / "dist" / name
        if not src.is_file():
            continue
        for dst_dir in (SITE / "dist", SITE / "docs" / "dist"):
            dst_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst_dir / name)
            print(f"Copied {name} -> {dst_dir / name}")


def patch_alternate_link(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "velin-agent.json" in text or "velinstyle.meta+json" in text:
        return False
    if "<head>" not in text:
        return False
    text = text.replace("<head>", "<head>\n" + META_LINK, 1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    sync_agent_files()
    text = TEMPLATE.read_text(encoding="utf-8")
    text = text.replace(
        "<title>API reference (generated) · VelinStyle</title>",
        "<title>Velin-Meta (AI agents) · VelinStyle</title>",
    )
    text = text.replace(
        'content="Markdown reference generated from source',
        'content="Velin-Meta: velin-agent.json, llms.txt, and page-level agent JSON for AI assistants.',
    )
    if 'id="velin-meta"' not in text:
        text = text.replace("</head>", PAGE_META + "</head>", 1)
    if "velin-agent.json" not in text:
        text = text.replace(
            '<link rel="icon" href="../../favicon.ico"',
            META_LINK + '  <link rel="icon" href="../../favicon.ico"',
            1,
        )
    text = re.sub(
        r"<main class=\"velin-doc-main\" id=\"main-content\">.*?</nav>\s*</main>",
        f"<main class=\"velin-doc-main\" id=\"main-content\">{MAIN}\n</main>",
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
    text = text.replace("guides/api-reference.html", "guides/velin-meta.html")
    text = text.replace("API reference", "Velin-Meta", 2)
    OUT.write_text(text, encoding="utf-8")

    link = (
        '<li><a href="velin-meta.html"><strong>Velin-Meta (AI agents)</strong></a> — '
        '<code>velinstyle meta</code>, <code>velin-agent.json</code>.</li>\n        '
    )
    if "velin-meta.html" not in INDEX.read_text(encoding="utf-8"):
        idx = INDEX.read_text(encoding="utf-8")
        idx = idx.replace(
            '<li><a href="api-reference.html">',
            link + '        <li><a href="api-reference.html">',
            1,
        )
        INDEX.write_text(idx, encoding="utf-8")

    if CONTENTS.is_file() and "velin-meta.html" not in CONTENTS.read_text(encoding="utf-8"):
        c = CONTENTS.read_text(encoding="utf-8")
        c = c.replace(
            '<a href="../guides/api-reference.html">',
            '<a href="../guides/velin-meta.html">Velin-Meta</a> · <a href="../guides/api-reference.html">',
            1,
        )
        CONTENTS.write_text(c, encoding="utf-8")

    import importlib.util

    spec = importlib.util.spec_from_file_location("sync", SITE / "tools" / "sync-sidebar.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.patch_file(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
