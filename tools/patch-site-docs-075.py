#!/usr/bin/env python3
"""Patch velinstyle-site overview pages for 0.7.5 (counts, lists, search)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

WC_ROWS = """
          <tr><td><code>&lt;velin-combobox&gt;</code></td><td>Autocomplete listbox with trigger slot</td></tr>
          <tr><td><code>&lt;velin-bottom-nav&gt;</code></td><td>Mobile bottom navigation with safe-area</td></tr>
          <tr><td><code>&lt;velin-sheet&gt;</code></td><td>Bottom sheet dialog with focus trap</td></tr>
          <tr><td><code>&lt;velin-segmented-control&gt;</code></td><td>Toggle button group</td></tr>
          <tr><td><code>&lt;velin-rating&gt;</code></td><td>Star rating (radiogroup)</td></tr>
          <tr><td><code>&lt;velin-menubar&gt;</code></td><td>Horizontal menubar</td></tr>
          <tr><td><code>&lt;velin-command&gt;</code></td><td>Command palette overlay</td></tr>
          <tr><td><code>&lt;velin-announcer&gt;</code></td><td>Screen-reader live region</td></tr>"""

NEW_BLUEPRINTS = """
          <tr><td><code>bottom-nav-mobile</code></td><td>Fixed bottom navigation for mobile</td></tr>
          <tr><td><code>empty-state</code></td><td>Empty list placeholder</td></tr>
          <tr><td><code>cookie-consent</code></td><td>Cookie consent banner</td></tr>
          <tr><td><code>filter-bar</code></td><td>Search + filter form row</td></tr>
          <tr><td><code>notification-center</code></td><td>Notification list</td></tr>
          <tr><td><code>settings-panel</code></td><td>Sheet with settings form</td></tr>
          <tr><td><code>onboarding</code></td><td>Stepper onboarding flow</td></tr>
          <tr><td><code>pricing-table</code></td><td>Pricing cards grid</td></tr>"""

ANIMATION_SEARCH_ENTRIES = [
    (
        "0.7.5 animation utilities",
        "Animations",
        "animations/overview.html#utilities-075",
        "velin-animate-blur-in blur-out rotate-in reveal-up reveal-down slide-fade float glow flash velin-animate-hover",
    ),
]

SEARCH_ENTRIES = [
    ("Combobox", "Components", "components/combobox.html", "velin-combobox autocomplete listbox"),
    ("Bottom navigation", "Components", "components/bottom-nav.html", "velin-bottom-nav mobile nav safe-area"),
    ("Sheet", "Components", "components/sheet.html", "velin-sheet bottom sheet dialog"),
    ("Segmented control", "Components", "components/segmented-control.html", "velin-segmented-control toggle group"),
    ("Rating", "Components", "components/rating.html", "velin-rating stars"),
    ("Menubar", "Components", "components/menubar.html", "velin-menubar menu bar"),
    ("Command palette", "Components", "components/command.html", "velin-command palette search"),
    ("Announcer", "Components", "components/announcer.html", "velin-announcer live region a11y"),
]


def patch_web_components() -> None:
    path = DOCS / "extend" / "web-components.html"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "VelinStyle provides 22 native Web Components",
        "VelinStyle provides 29 native Web Components",
    )
    if "velin-combobox" not in text:
        text = text.replace(
            "          <tr><td><code>&lt;velin-modal&gt;</code></td><td>Accessible modal with focus trapping</td></tr>\n        </tbody>",
            "          <tr><td><code>&lt;velin-modal&gt;</code></td><td>Accessible modal with focus trapping</td></tr>"
            + WC_ROWS
            + "\n        </tbody>",
        )
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_javascript_api() -> None:
    path = DOCS / "extend" / "javascript-api.html"
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"all 22 components", "all 29 components", text)
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_cli_blueprints() -> None:
    path = DOCS / "extend" / "cli.html"
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"\b14 documented\b", "22 documented", text)
    text = re.sub(r"\b14 HTML\b", "22 HTML", text)
    if "bottom-nav-mobile" not in text and "<h2 id=\"blueprint\"" in text:
        # Insert after table-responsive row if blueprint table exists
        marker = "<tr><td><code>table-responsive</code></td>"
        if marker in text:
            text = text.replace(
                marker,
                marker.split("</tr>")[0] + "</tr>" + NEW_BLUEPRINTS,
                1,
            )
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_security() -> None:
    path = DOCS / "extend" / "security.html"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    block = "<h2 id=\"scanner-075\">CLI scanner (0.7.5)</h2>"
    if block in text:
        return
    insert = """
      <h2 id="scanner-075">CLI scanner (0.7.5)</h2>
      <p>Additional rules: <code>no-meta-refresh</code>, <code>no-inline-style</code>, <code>no-data-html-uri</code>, <code>dangerous-target</code>, <code>integrity-missing</code>, <code>postmessage-wildcard</code>. Filter with <code>velinstyle scan --only security</code>.</p>
      <p>Framework tests: <code>npm run test:security</code>.</p>
"""
    if "<h2 id=\"sanitize\">" in text:
        text = text.replace("<h2 id=\"sanitize\">", insert + "\n      <h2 id=\"sanitize\">", 1)
    else:
        text = text.replace("</main>", insert + "\n    </main>", 1)
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_repo_tools() -> None:
    path = DOCS / "extend" / "repo-tools.html"
    text = path.read_text(encoding="utf-8")
    if "test:security" in text:
        return
    text = text.replace(
        "<code>npm run test:contrast</code>",
        "<code>npm run test:contrast</code>, <code>npm run test:security</code>",
    )
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_entrance_animations() -> None:
    """No-op: 0.7.5 animation docs are maintained in entrance/attention/exit/overview HTML."""
    path = DOCS / "animations" / "entrance.html"
    if path.exists() and 'id="entrance-075"' in path.read_text(encoding="utf-8"):
        return


def patch_breakpoints() -> None:
    path = DOCS / "layout" / "breakpoints.html"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    if "velin-pb-safe" in text:
        return
    insert = """
      <h2 id="safe-area">Safe area (0.7.5)</h2>
      <p>Mobile utilities: <code>.velin-pb-safe</code>, <code>.velin-pt-safe</code>, <code>.velin-px-safe</code>, <code>.velin-p-safe</code>. Visibility: <code>.velin-mobile-only</code> / <code>.velin-desktop-only</code> (breakpoint <code>48rem</code>).</p>
"""
    text = text.replace("<h2 id=\"breakpoints\">", insert + "\n      <h2 id=\"breakpoints\">", 1)
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_contents() -> None:
    path = DOCS / "getting-started" / "contents.html"
    text = path.read_text(encoding="utf-8")
    links = """
        <li><a href="../components/combobox.html">Combobox</a></li>
        <li><a href="../components/bottom-nav.html">Bottom nav</a></li>
        <li><a href="../components/sheet.html">Sheet</a></li>
        <li><a href="../components/segmented-control.html">Segmented control</a></li>
        <li><a href="../components/rating.html">Rating</a></li>
        <li><a href="../components/menubar.html">Menubar</a></li>
        <li><a href="../components/command.html">Command palette</a></li>
        <li><a href="../components/announcer.html">Announcer</a></li>"""
    if "components/combobox.html" in text:
        return
    text = text.replace(
        '<li><a href="../components/collapse.html">Collapse</a></li>',
        '<li><a href="../components/collapse.html">Collapse</a></li>' + links,
        1,
    )
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_search_index() -> None:
    path = DOCS / "search-index.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    urls = {e["url"] for e in data}
    for title, section, url, kw in SEARCH_ENTRIES + ANIMATION_SEARCH_ENTRIES:
        if url in urls:
            continue
        data.append(
            {
                "title": title,
                "section": section,
                "url": url,
                "keywords": f"{title} {kw} {url.replace('/', ' ')}",
            }
        )
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def patch_readme() -> None:
    path = ROOT / "README.md"
    text = path.read_text(encoding="utf-8")
    text = text.replace("sync-0.7.0.py", "sync-0.7.5.py")
    path.write_text(text, encoding="utf-8", newline="\n")


def main() -> None:
    patch_web_components()
    patch_javascript_api()
    patch_cli_blueprints()
    patch_security()
    patch_repo_tools()
    patch_entrance_animations()
    patch_breakpoints()
    patch_contents()
    patch_search_index()
    patch_readme()
    print("Site docs patched for 0.7.5")


if __name__ == "__main__":
    main()
