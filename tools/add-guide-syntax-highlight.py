#!/usr/bin/env python3
"""Create guides/syntax-highlight.html from velin-search template + sync sidebar."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
TEMPLATE = SITE / "docs" / "guides" / "velin-search.html"
OUT = SITE / "docs" / "guides" / "syntax-highlight.html"
INDEX = SITE / "docs" / "guides" / "index.html"

MAIN = """
      <h1>VelinHighlight <span class="velin-badge velin-badge--primary">0.9.0 extension</span></h1>
      <p class="lead">Token-based syntax highlighting without Prism or CDN. OKLCH token colors, lazy in-view highlighting, and <code>velin-code-block</code>.</p>

      <h2 id="overview">Overview</h2>
      <ul>
        <li><code>core/highlight/</code> — <code>highlightElement</code>, <code>initHighlight</code>, <code>registerLanguage</code></li>
        <li>Lazy load lexers when blocks scroll into view (<code>IntersectionObserver</code>)</li>
        <li>Languages: JS, TS, HTML, CSS, JSON, Markdown, Shell, SQL</li>
        <li>Attribute bridge: <code>velin-code</code> + <code>language</code></li>
      </ul>

      <h2 id="api">JavaScript API</h2>
      <pre><code class="language-js">import { initHighlight, velinSyntax } from '@birdapi/velinstyle/highlight';

initHighlight(document);
// velinSyntax.highlightElement(document.querySelector('pre'));</code></pre>

      <h2 id="attribute">HTML attribute</h2>
      <pre><code class="language-html">&lt;pre velin-code="js" language="js"&gt;&lt;code&gt;const x = 42;&lt;/code&gt;&lt;/pre&gt;</code></pre>

      <h2 id="component">Web component</h2>
      <pre><code class="language-html">&lt;velin-code-block language="css" line-numbers highlight="1-2"&gt;
.btn { padding: 0.5rem 1rem; }
.btn--primary { background: var(--velin-color-primary); }
&lt;/velin-code-block&gt;</code></pre>
      <p>Load with <code>bootFromDOM(document, { attributes: true, highlight: true })</code>.</p>

      <nav class="velin-doc-prevnext" aria-label="Page navigation"><a href="motion-attributes.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Motion &amp; attributes</span></a><a href="html-attributes.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">HTML attributes</span></a></nav>
"""

TOC = """
        <li><a href="#overview">Overview</a></li>
        <li><a href="#api">JavaScript API</a></li>
        <li><a href="#attribute">HTML attribute</a></li>
        <li><a href="#component">Web component</a></li>
"""


def main() -> None:
    text = TEMPLATE.read_text(encoding="utf-8")
    text = text.replace(
        "<title>VelinSearch · VelinStyle</title>",
        "<title>Syntax highlighting · VelinStyle</title>",
    )
    text = text.replace(
        'content="Offline, fuzzy documentation',
        'content="VelinHighlight syntax colors, velin-code attribute, and velin-code-block.',
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
    text = text.replace('guides/velin-search.html', 'guides/syntax-highlight.html')
    text = text.replace('VelinSearch', 'Syntax highlighting')
    text = text.replace('class="active"', 'class=""', 1)
    OUT.write_text(text, encoding="utf-8")

    idx = INDEX.read_text(encoding="utf-8")
    link = '<li><a href="syntax-highlight.html"><strong>Syntax highlighting</strong></a> — <code>velinSyntax</code>, <code>velin-code</code>, lazy highlight.</li>\n        '
    if "syntax-highlight.html" not in idx:
        idx = idx.replace(
            '<li><a href="motion-attributes.html">',
            link + '        <li><a href="motion-attributes.html">',
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
