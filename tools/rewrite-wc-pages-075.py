#!/usr/bin/env python3
"""Deprecated — use tools/fix-site-consistency-080.py for full doc layout from drawer.html."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "components"

SIDEBAR_SNIPPET = """<li><a href="../components/collapse.html">Collapse</a></li>
<li><a href="../components/combobox.html">Combobox</a></li>
<li><a href="../components/announcer.html">Announcer</a></li>
<li><a href="../components/bottom-nav.html">Bottom nav</a></li>
<li><a href="../components/command.html">Command palette</a></li>
<li><a href="../components/menubar.html">Menubar</a></li>
<li><a href="../components/rating.html">Rating</a></li>
<li><a href="../components/segmented-control.html">Segmented control</a></li>
<li><a href="../components/sheet.html">Sheet</a></li>"""

PAGES = [
    ("combobox", "Combobox", "velin-combobox", "Autocomplete listbox with trigger slot.", """<velin-combobox aria-label="Fruit picker">
  <input slot="trigger" class="velin-input" placeholder="Fruit" aria-label="Fruit" />
  <button type="button" role="option">Apple</button>
  <button type="button" role="option">Banana</button>
</velin-combobox>"""),
    ("bottom-nav", "Bottom navigation", "velin-bottom-nav", "Mobile bottom bar with safe-area and current link sync.", """<velin-bottom-nav current="home">
  <a href="#" data-nav="home" current>Home</a>
  <a href="#" data-nav="search">Search</a>
</velin-bottom-nav>"""),
    ("sheet", "Sheet", "velin-sheet", "Bottom sheet dialog with focus trap.", """<button type="button" class="velin-btn velin-btn--primary" id="open-sheet">Open sheet</button>
<velin-sheet id="demo-sheet" title="Settings"><p class="velin-p-4">Sheet content.</p></velin-sheet>
<script>
document.getElementById('open-sheet')?.addEventListener('click', () => document.getElementById('demo-sheet')?.open());
</script>"""),
    ("segmented-control", "Segmented control", "velin-segmented-control", "Toggle group with aria-pressed.", """<velin-segmented-control aria-label="View">
  <button type="button" selected>List</button>
  <button type="button">Grid</button>
</velin-segmented-control>"""),
    ("rating", "Rating", "velin-rating", "Star rating (1–5) as radiogroup.", """<velin-rating value="3" aria-label="Product rating"></velin-rating>"""),
    ("menubar", "Menubar", "velin-menubar", "Horizontal menubar with arrow keys.", """<velin-menubar aria-label="File">
  <button type="button" role="menuitem">New</button>
  <button type="button" role="menuitem">Open</button>
</velin-menubar>"""),
    ("command", "Command palette", "velin-command", "Filterable command overlay.", """<button type="button" class="velin-btn velin-btn--outline" id="open-cmd">Open palette</button>
<velin-command id="demo-cmd">
  <button type="button">Dashboard</button>
  <button type="button">Settings</button>
</velin-command>
<script>
document.getElementById('open-cmd')?.addEventListener('click', () => document.getElementById('demo-cmd')?.open());
</script>"""),
    ("announcer", "Announcer", "velin-announcer", "Screen-reader live region; use VelinAnnouncer.announceGlobal() in JS.", """<velin-announcer></velin-announcer>
<p class="velin-text-muted">Call <code>VelinAnnouncer.announceGlobal('Saved')</code> after the bundle loads.</p>"""),
]

SHELL = """<!DOCTYPE html>
<html lang="en" data-velin-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · VelinStyle</title>
  <meta name="description" content="VelinStyle {title} Web Component ({tag}).">
  <link rel="stylesheet" href="../../dist/velinstyle.min.css">
  <link rel="stylesheet" href="../docs.css">
  <link rel="icon" href="../../favicon.ico" type="image/x-icon">
</head>
<body>
  <a href="#main-content" class="velin-doc-skip">Skip to main content</a>
  <header class="velin-doc-header">
    <button class="velin-doc-hamburger" aria-label="Toggle sidebar" id="sidebarToggle"><velin-icon name="menu" size="20"></velin-icon></button>
    <a href="../getting-started/introduction.html" class="velin-doc-header__brand"><img src="../../assets/img/velinstyle-logo.svg" alt="" width="28" height="28"> VelinStyle <span class="velin-doc-header__version">v0.8.0</span></a>
  </header>
  <motion class="velin-doc-wrapper">
    <nav class="velin-doc-sidebar" id="sidebar" aria-label="Documentation navigation">
      <div class="velin-doc-sidebar__category"><button class="velin-doc-sidebar__category-header" aria-expanded="true">Components</button>
        <ul class="velin-doc-sidebar__links">
          {sidebar}
        </ul>
      </motion>
    </nav>
    <main class="velin-doc-main" id="main-content">
      <h1>{title}</h1>
      <p class="lead">{lead} New in <strong>0.7.5</strong>.</p>
      <h2>Example</h2>
      <motion class="velin-doc-example__preview velin-p-4">{demo}</motion>
      <h2>Import</h2>
      <pre><code class="language-html">&lt;script type="module" src="../../dist/velinstyle-components.min.js"&gt;&lt;/script&gt;
&lt;{tag}&gt;…&lt;/{tag_short}&gt;</code></pre>
    </main>
  </motion>
  <script src="../../dist/velinstyle-components.iife.js"></script>
</body>
</html>
"""


def main() -> None:
    for slug, title, tag, lead, demo in PAGES:
        short = tag.replace("velin-", "")
        links = SIDEBAR_SNIPPET.replace(
            f'href="../components/{slug}.html"',
            f'href="../components/{slug}.html" class="active"',
            1,
        )
        html = SHELL.format(
            title=title,
            tag=tag,
            tag_short=short,
            lead=lead,
            demo=demo,
            sidebar=links,
        )
        html = html.replace("<motion ", "<div ").replace("</motion>", "</div>")
        (OUT / f"{slug}.html").write_text(html, encoding="utf-8", newline="\n")
        print("wrote", slug)


if __name__ == "__main__":
    main()
