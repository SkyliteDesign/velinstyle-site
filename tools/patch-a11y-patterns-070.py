#!/usr/bin/env python3
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "docs/getting-started/a11y-patterns.html"
t = p.read_text(encoding="utf-8")
needle = '      <nav class="velin-doc-prevnext" aria-label="Page navigation">'
if "id=\"menu-button\"" in t:
    print("Already patched")
    raise SystemExit(0)
d = "di" + "v"
block = f'''
      <h2 id="menu-button">Menu button</h2>
      <p>Use <code>&lt;velin-dropdown&gt;</code> with <code>role="menuitem"</code> and type-ahead (0.7.0).</p>
      <pre><code class="language-html">&lt;velin-dropdown&gt;
  &lt;button slot="trigger"&gt;Actions&lt;/button&gt;
  &lt;button role="menuitem"&gt;Edit&lt;/button&gt;
&lt;/velin-dropdown&gt;</code></pre>

      <h2 id="disclosure">Disclosure (collapse)</h2>
      <pre><code class="language-html">&lt;velin-collapse&gt;
  &lt;button slot="trigger" type="button"&gt;Details&lt;/button&gt;
  &lt;p&gt;Content…&lt;/p&gt;
&lt;/velin-collapse&gt;</code></pre>

      <h2 id="data-table">Data table</h2>
      <pre><code class="language-html">&lt;{d} class="velin-table-wrapper"&gt;
  &lt;table class="velin-table"&gt;
    &lt;caption&gt;Sales&lt;/caption&gt;
    &lt;th scope="col"&gt;Region&lt;/th&gt;
  &lt;/table&gt;
&lt;/{d}&gt;</code></pre>

      <h2 id="loading">Loading / busy</h2>
      <pre><code class="language-html">&lt;section aria-busy="true" aria-live="polite"&gt;
  &lt;{d} class="velin-skeleton velin-skeleton--heading"&gt;&lt;/{d}&gt;
&lt;/section&gt;</code></pre>

'''
t = t.replace(needle, block + needle, 1)
# TOC
toc_needle = '<li><a href="#forms-aria">Forms and errors</a></li>'
toc_add = '''<li><a href="#menu-button">Menu button</a></li>
        <li><a href="#disclosure">Disclosure</a></li>
        <li><a href="#data-table">Data table</a></li>
        <li><a href="#loading">Loading</a></li>'''
if toc_needle in t and "menu-button" not in t[t.index(toc_needle):t.index(toc_needle)+200]:
    t = t.replace(toc_needle, toc_needle + "\n        " + toc_add)
p.write_text(t, encoding="utf-8")
print("Patched a11y-patterns.html")
