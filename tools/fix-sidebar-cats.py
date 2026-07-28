#!/usr/bin/env python3
"""Fix data-cat on sidebar category headers (one category per header title)."""
from __future__ import annotations

import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"
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

TITLE_TO_CAT = dict(CAT_IDS)

HEADER_RE = re.compile(
    r'<div class="velin-doc-sidebar__category"[^>]*>\s*'
    r'<button class="velin-doc-sidebar__category-header"[^>]*>[\s\S]*?'
    r'<span>([^<]+)</span>',
)


def patch_nav(nav: str) -> str:
    def repl(m: re.Match[str]) -> str:
        title = m.group(1)
        cat_id = TITLE_TO_CAT.get(title)
        if not cat_id:
            return m.group(0)
        header = m.group(0)
        return re.sub(
            r'<div class="velin-doc-sidebar__category"[^>]*>',
            f'<div class="velin-doc-sidebar__category" data-cat="{cat_id}">',
            header,
            count=1,
        )

    return HEADER_RE.sub(repl, nav)


def main() -> None:
    n = 0
    for html in DOCS.rglob("*.html"):
        text = html.read_text(encoding="utf-8")
        m = NAV_RE.search(text)
        if not m:
            continue
        new_inner = patch_nav(m.group(2))
        if new_inner == m.group(2):
            continue
        text = NAV_RE.sub(m.group(1) + new_inner + m.group(3), text, count=1)
        html.write_text(text, encoding="utf-8")
        n += 1
    print(f"Fixed {n} files")


if __name__ == "__main__":
    main()
