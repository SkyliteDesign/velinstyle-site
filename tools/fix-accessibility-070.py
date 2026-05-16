#!/usr/bin/env python3
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "docs/getting-started/accessibility.html"
t = p.read_text(encoding="utf-8")
marker = '      <motion class="velin-doc-example">'
end = "      <!-- ---- Prev / Next ---- -->"
if marker not in t:
    marker = marker.replace("motion", "div")  # file may already say div
start = t.index(marker)
end_i = t.index(end, start)
d = "di" + "v"
replacement = f'''      <pre><code class="language-html">&lt;html class="velin-scroll-pt-nav"&gt;…&lt;/html&gt;</code></pre>

      <h2 id="target-size">Target size (WCAG 2.5.8)</h2>
      <p>Primary controls meet <strong>44×44px</strong> via <code>target-size.css</code> (<code>.velin-target-touch</code>).</p>

      <h2 id="aaa-contrast">Enhanced contrast (AAA, optional)</h2>
      <p>Set <code>data-velin-contrast="aaa"</code> on <code>&lt;html&gt;</code> for 7:1 token pairs. Verified with <code>npm run test:contrast</code>.</p>

      <h2 id="wcag-checklist">WCAG 2.2 checklist</h2>
      <{d} class="velin-table-wrapper">
        <table class="velin-table velin-table--striped">
          <thead><tr><th scope="col">Criterion</th><th scope="col">VelinStyle</th></tr></thead>
          <tbody>
            <tr><td>2.4.11 Focus Not Obscured</td><td><code>focus-not-obscured.css</code></td></tr>
            <tr><td>2.5.8 Target Size</td><td><code>target-size.css</code></td></tr>
            <tr><td>2.1.1 Keyboard</td><td>Focus trap, roving tabindex, WC updates in 0.7.0</td></tr>
            <tr><td>1.4.6 Contrast (Enhanced)</td><td><code>data-velin-contrast="aaa"</code></td></tr>
          </tbody>
        </table>
      </{d}>

      <h2 id="testing">Testing in CI</h2>
      <p><code>npm run test:a11y</code> (axe WCAG 2.2, 33+ pages) and <code>npx velinstyle scan</code> — see <a href="../extend/cli.html#scanner-rules">scanner rules</a>.</p>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>Always provide <code>aria-label</code> or visible text for icon-only buttons.</li>
        <li>Use semantic HTML (<code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>).</li>
        <li>Include <code>alt</code> on images; <code>alt=""</code> when decorative.</li>
        <li>Never rely on color alone for state.</li>
        <li>Test keyboard-only and with a screen reader.</li>
        <li>See <a href="../getting-started/a11y-patterns.html">A11y patterns</a>.</li>
      </ul>

'''
replacement = replacement.replace("<motion", "<div").replace("</motion>", "</div>")
p.write_text(t[:start] + replacement + t[end_i:], encoding="utf-8")
print("Patched", p)
