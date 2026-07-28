#!/usr/bin/env python3
"""Create docs/components/velin-code-block.html from sparkline shell."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
src = (SITE / "docs/components/sparkline.html").read_text(encoding="utf-8")

main = """    <main class="velin-doc-main" id="main-content">
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../components/accordion.html">Components</a></li><li>Code block</li></ol>
      <h1>Code block <span class="velin-badge velin-badge--primary">0.9.0</span></h1>
      <p class="lead">The <code>&lt;velin-code-block&gt;</code> Web Component wraps source text with VelinHighlight token colors, optional line numbers, line highlights, copy, and collapse.</p>
      <p>See also <a href="../guides/syntax-highlight.html">Syntax highlighting guide</a> and generated <a href="../generated/components/velin-code-block.md" data-md-viewer>velin-code-block.md</a>.</p>

      <h2 id="basic">Basic</h2>
      <div class="velin-doc-example">
        <div class="velin-doc-example__panel active">
          <div class="velin-doc-example__preview">
            <velin-code-block language="js" line-numbers>
const greet = (name) => `Hello, ${name}!`;
console.log(greet('Velin'));
            </velin-code-block>
          </div>
        </div>
      </div>
      <pre><code class="language-html">&lt;velin-code-block language="js" line-numbers&gt;
const greet = (name) =&gt; `Hello, ${name}!`;
&lt;/velin-code-block&gt;</code></pre>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>language</code></td><td>Lexer id: <code>js</code>, <code>ts</code>, <code>html</code>, <code>css</code>, <code>php</code>, <code>blade</code>, …</td></tr>
          <tr><td><code>line-numbers</code></td><td>Show gutter numbers</td></tr>
          <tr><td><code>highlight</code></td><td>Ranges e.g. <code>1-2,5</code></td></tr>
          <tr><td><code>collapsed</code></td><td>Toolbar expand/collapse</td></tr>
        </tbody>
      </table>

      <h2 id="highlight-lines">Line highlights</h2>
      <velin-code-block language="css" line-numbers highlight="1-2">
.btn { padding: 0.5rem 1rem; }
.btn--primary { background: var(--velin-color-primary); }
      </velin-code-block>

      <h2 id="boot">Loading</h2>
      <pre><code class="language-js">import { register, bootFromDOM } from '@birdapi/velinstyle';
await register(['velin-code-block', 'velin-copy']);
await bootFromDOM(document, { highlight: true });</code></pre>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="chip.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Chip</span></a>
        <a href="close-button.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Close Button</span></a>
      </nav>
    </main>
    <aside class="velin-doc-toc" aria-label="On this page"><motion class="velin-doc-toc__title">On this page</div><ul class="velin-doc-toc__list"><li><a href="#basic">Basic</a></li><li><a href="#attributes">Attributes</a></li><li><a href="#highlight-lines">Line highlights</a></li><li><a href="#boot">Loading</a></li></ul></aside>"""

main = main.replace('<motion class="velin-doc-toc__title">On this page</div>', '<div class="velin-doc-toc__title">On this page</motion>')
main = main.replace("</motion>", "</div>", 1)

out = re.sub(r'<main class="velin-doc-main"[\s\S]*?</aside>', main, src, count=1)
out = out.replace(
    "<title>Sparkline · Components · VelinStyle</title>",
    "<title>Code block · Components · VelinStyle</title>",
)
out = out.replace(
    'content="Tiny inline-SVG sparkline',
    'content="Syntax-highlighted code block with copy, line numbers, and VelinHighlight.',
)
dest = SITE / "docs/components/velin-code-block.html"
dest.write_text(out, encoding="utf-8")
print(f"wrote {dest.relative_to(SITE)} ({len(out)} bytes)")
