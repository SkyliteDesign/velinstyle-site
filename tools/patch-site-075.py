#!/usr/bin/env python3
"""Add 0.7.5 component docs, sidebar links, and upgrading section on velinstyle-site."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

SIDEBAR_INSERT_AFTER = '<li><a href="../components/collapse.html">Collapse</a></li>'
SIDEBAR_NEW = """
<li><a href="../components/announcer.html">Announcer</a></li>
<li><a href="../components/bottom-nav.html">Bottom nav</a></li>
<li><a href="../components/combobox.html">Combobox</a></li>
<li><a href="../components/command.html">Command palette</a></li>
<li><a href="../components/menubar.html">Menubar</a></li>
<li><a href="../components/rating.html">Rating</a></li>
<li><a href="../components/segmented-control.html">Segmented control</a></li>
<li><a href="../components/sheet.html">Sheet</a></li>"""

UPGRADING_BLOCK = """
      <h2 id="v075">Upgrading to 0.7.5</h2>
      <p>0.7.5 adds mobile utilities, security hardening, animation classes, eight Web Components, and CLI blueprints.</p>
      <ul>
        <li><strong>Security:</strong> expanded <code>sanitize.js</code>, <code>npm run test:security</code>, scanner <code>--only security</code>.</li>
        <li><strong>Mobile:</strong> <code>.velin-pb-safe</code>, <code>.velin-mobile-only</code>, <code>.velin-desktop-only</code> (breakpoint 48&nbsp;rem).</li>
        <li><strong>Web Components:</strong> combobox, bottom-nav, sheet, segmented-control, rating, menubar, command, announcer — see new component pages.</li>
        <li><strong>React:</strong> <code>templates/vite-react-velinstyle</code> and <code>@velinstyle/react</code> — <a href="../guides/react-vite-starter.html">Vite &amp; React guide</a>.</li>
        <li><strong>CLI:</strong> 22 blueprints (<code>velinstyle blueprint list</code>).</li>
      </ul>
"""

WC_PAGES = {
    "combobox": ("Combobox", "velin-combobox", "Autocomplete listbox with a trigger slot."),
    "bottom-nav": ("Bottom navigation", "velin-bottom-nav", "Mobile nav bar with safe-area and current link sync."),
    "sheet": ("Sheet", "velin-sheet", "Bottom sheet dialog with focus trap."),
    "segmented-control": ("Segmented control", "velin-segmented-control", "Toggle button group with aria-pressed."),
    "rating": ("Rating", "velin-rating", "Star rating radiogroup (1–5)."),
    "menubar": ("Menubar", "velin-menubar", "Horizontal menubar with arrow-key navigation."),
    "command": ("Command palette", "velin-command", "Filterable command palette overlay."),
    "announcer": ("Announcer", "velin-announcer", "Screen-reader live region helper."),
}


def patch_sidebars() -> int:
    n = 0
    for path in DOCS.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        if SIDEBAR_INSERT_AFTER not in text or "components/combobox.html" in text:
            continue
        text = text.replace(SIDEBAR_INSERT_AFTER, SIDEBAR_INSERT_AFTER + SIDEBAR_NEW, 1)
        path.write_text(text, encoding="utf-8", newline="\n")
        n += 1
    return n


def patch_upgrading() -> bool:
    path = DOCS / "getting-started" / "upgrading.html"
    text = path.read_text(encoding="utf-8")
    if 'id="v075"' in text:
        return False
    marker = '      <h2 id="changelog">Changelog</h2>'
    text = text.replace(marker, UPGRADING_BLOCK + "\n" + marker, 1)
    toc_old = '<li><a href="#changelog">Changelog</a></li>'
    toc_new = '<li><a href="#v075">0.7.5</a></li>\n        ' + toc_old
    text = text.replace(toc_old, toc_new, 1)
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def page_body(title: str, tag: str, lead: str, demo: str, active: str) -> str:
    template = (DOCS / "components" / "collapse.html").read_text(encoding="utf-8")
    out = template.replace("Collapse", title, 1)
    out = out.replace("collapse.html", f"{active}.html")
    out = out.replace("velin-collapse", tag)
    out = out.replace(
        '<p class="lead">\n        The <code>&lt;velin-collapse&gt;</code> Web Component toggles content visibility with a smooth\n        CSS Grid animation (<code>grid-template-rows: 0fr → 1fr</code>). Pair it with any trigger element —\n        keyboard and ARIA wiring ship in <strong>0.7.0</strong> (WCAG 2.2 AA).\n      </p>',
        f"<p class=\"lead\">{lead} Added in <strong>0.7.5</strong>.</p>",
        1,
    )
    # Replace first preview block with minimal demo
    start = out.find('<h2 id="basic-example">')
    end = out.find('<h2 id="initially-open">')
    if start != -1 and end != -1:
        block = f"""<h2 id="basic-example">Basic Example</h2>
      <div class="velin-doc-example">
        <div class="velin-doc-example__panel active" data-panel="preview">
          <motion class="velin-doc-example__preview">{demo}</motion>
        </motion>
      </motion>
      <h2 id="import">Import</h2>
      <pre><code class="language-html">&lt;script type="module" src="../../dist/velinstyle-components.min.js"&gt;&lt;/script&gt;</code></pre>
"""
        out = out[:start] + block + out[end:]
    return out


def write_wc_pages() -> int:
    demos = {
        "combobox": '<velin-combobox><input slot="trigger" class="velin-input" aria-label="Fruit" placeholder="Fruit" /><button type="button" role="option">Apple</button></velin-combobox>',
        "bottom-nav": '<velin-bottom-nav current="home"><a href="#" data-nav="home" current>Home</a><a href="#" data-nav="search">Search</a></velin-bottom-nav>',
        "sheet": '<button type="button" class="velin-btn velin-btn--primary" id="open-sheet">Open</button><velin-sheet id="demo-sheet" title="Sheet"><p class="velin-p-4">Content</p></velin-sheet>',
        "segmented-control": '<velin-segmented-control aria-label="View"><button type="button" selected>List</button><button type="button">Grid</button></velin-segmented-control>',
        "rating": '<velin-rating value="3" aria-label="Rating"></velin-rating>',
        "menubar": '<velin-menubar aria-label="File"><button type="button" role="menuitem">New</button><button type="button" role="menuitem">Open</button></velin-menubar>',
        "command": '<button type="button" class="velin-btn velin-btn--outline" id="open-cmd">Open</button><velin-command id="demo-cmd"><button type="button">Action</button></velin-command>',
        "announcer": '<velin-announcer></velin-announcer>',
    }
    n = 0
    for slug, (title, tag, lead) in WC_PAGES.items():
        path = DOCS / "components" / f"{slug}.html"
        body = page_body(title, tag, lead, demos[slug], slug)
        body = body.replace("<motion ", "<div ").replace("</motion>", "</div>")
        path.write_text(body, encoding="utf-8", newline="\n")
        n += 1
    return n


def patch_react_guide() -> bool:
    path = DOCS / "guides" / "react-vite-starter.html"
    text = path.read_text(encoding="utf-8")
    if "vite-react-velinstyle" in text:
        return False
    insert = '<h2 id="react-vite-template">React + Vite template (0.7.5)</h2>\n      <p>Path: <code>templates/vite-react-velinstyle</code> in the framework repo. Uses <code>@velinstyle/react</code> and <code>VelinSheet</code> / <code>VelinThemeToggle</code> wrappers.</p>\n      '
    text = text.replace("<h2 id=\"react-integration\">", insert + "<h2 id=\"react-integration\">", 1)
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def main() -> None:
    print(f"Sidebar patched in {patch_sidebars()} files")
    print(f"Upgrading: {'ok' if patch_upgrading() else 'skip'}")
    print(f"Wrote {write_wc_pages()} component pages")
    print(f"React guide: {'ok' if patch_react_guide() else 'skip'}")


if __name__ == "__main__":
    main()
