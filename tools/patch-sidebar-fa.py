#!/usr/bin/env python3
"""Patch doc sidebars: FA solid variant, data-cat accents, unique component icons."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
DOCS = SITE / "docs"

NAV_RE = re.compile(
    r'(<nav class="velin-doc-sidebar"[^>]*>)(.*?)(</nav>)',
    re.DOTALL,
)

CAT_IDS = [
    ("Getting Started", "getting-started"),
    ("Customize", "customize"),
    ("Layout", "layout"),
    ("Content", "content"),
    ("Forms", "forms"),
    ("Components", "components"),
    ("Helpers", "helpers"),
    ("Utilities", "utilities"),
    ("Animations", "animations"),
    ("Extend", "extend"),
    ("Guides", "guides"),
    ("About", "about"),
    ("Support &amp; Community", "support"),
]

COMPONENT_ICONS = {
    "accordion": "bars-staggered",
    "alerts": "triangle-exclamation",
    "avatar": "circle-user",
    "badge": "certificate",
    "breadcrumb": "ellipsis",
    "buttons": "square",
    "button-group": "object-group",
    "card": "id-card",
    "carousel": "images",
    "chip": "tags",
    "close-button": "xmark",
    "collapse": "compress",
    "announcer": "bullhorn",
    "bottom-nav": "bars",
    "combobox": "list",
    "command": "terminal",
    "menubar": "bars-progress",
    "rating": "star",
    "segmented-control": "table-cells-large",
    "sheet": "sheet-plastic",
    "dialog": "comment-dots",
    "divider": "minus",
    "drawer": "bars",
    "dropdown": "caret-down",
    "lightbox": "expand",
    "list-group": "list-ul",
    "modal": "window-maximize",
    "navbar": "bars",
    "navs-tabs": "folder",
    "pagination": "ellipsis",
    "popover": "comment",
    "progress": "bars-progress",
    "progress-ring": "circle-notch",
    "scrollspy": "binoculars",
    "spinners": "spinner",
    "stat": "chart-simple",
    "stepper": "shoe-prints",
    "timeline": "timeline",
    "toasts": "bell",
    "tooltips": "circle-info",
}

ICON_FIXES = {
    'name="list-ul"': 'name="list"',
    'name="mobile"': 'name="mobile-screen"',
    'name="up-down-left-right"': 'name="arrows-up-down-left-right"',
}


def patch_nav(nav: str) -> str:
    original = nav
    if 'provider="fontawesome" variant="solid"' not in nav:
        nav = nav.replace(
            'provider="fontawesome"',
            'provider="fontawesome" variant="solid"',
        )
    for old, new in ICON_FIXES.items():
        nav = nav.replace(old, new)
    if 'data-cat="pinned"' not in nav:
        nav = nav.replace(
            '<div class="velin-doc-sidebar__pinned">',
            '<div class="velin-doc-sidebar__pinned" data-cat="pinned">',
            1,
        )
    nav = re.sub(
        r'(<div class="velin-doc-sidebar__category)\s+data-cat="[^"]*"',
        r"\1",
        nav,
    )
    for title, cat_id in CAT_IDS:
        nav = re.sub(
            rf'(<div class="velin-doc-sidebar__category")(\s*>)'
            rf'(\s*<button class="velin-doc-sidebar__category-header"[^>]*>[\s\S]*?'
            rf'<span>){re.escape(title)}</span>',
            rf'\1 data-cat="{cat_id}"\2\3{title}</span>',
            nav,
            count=1,
        )
    for slug, icon in COMPONENT_ICONS.items():
        nav = re.sub(
            rf'(<a href="[^"]*components/{re.escape(slug)}\.html"[^>]*>)'
            rf'<velin-icon name="cube" provider="fontawesome" variant="solid"',
            rf'\1<velin-icon name="{icon}" provider="fontawesome" variant="solid"',
            nav,
            count=1,
        )
    return nav if nav != original else nav


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    m = NAV_RE.search(text)
    if not m:
        return False
    new_inner = patch_nav(m.group(2))
    if new_inner == m.group(2):
        return False
    text = NAV_RE.sub(m.group(1) + new_inner + m.group(3), text, count=1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    n = 0
    for html in DOCS.rglob("*.html"):
        if patch_file(html):
            n += 1
    print(f"Patched {n} files")


if __name__ == "__main__":
    main()
