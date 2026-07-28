#!/usr/bin/env python3
"""Expand Switch quickly pinned block with Framework guides + per-link icon colors."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
DOCS = SITE / "docs"
FA = 'provider="fontawesome" variant="solid"'

PINNED_RE = re.compile(
    r'<div class="velin-doc-sidebar__pinned"[^>]*>.*?</div>(?=\s*<div class="velin-doc-sidebar__category")',
    re.DOTALL,
)

QUICK = [
    ("migration.html", "Migration Guide", "right-left", "migration"),
    ("getting-started/upgrading.html", "Upgrading to 0.8.0", "arrow-up", "getting-started"),
]

GUIDES = [
    ("guides/index.html", "Guides overview", "map", "guides"),
    ("guides/existing-project.html", "Existing project", "folder-open", "guides"),
    ("guides/react-vite-starter.html", "Vite &amp; React", "code-branch", "guides"),
    ("guides/prompt-scaffolding.html", "Prompt scaffolding", "wand-magic-sparkles", "guides"),
    ("guides/responsive-layout.html", "Responsive layout", "mobile-screen", "guides"),
    ("extend/cli.html", "CLI reference", "terminal", "extend"),
    ("layout/patterns.html", "Layout patterns", "table-columns", "layout"),
    ("getting-started/introduction.html", "Introduction", "house", "getting-started"),
]


def rel_prefix(doc_file: Path) -> str:
    depth = len(doc_file.relative_to(DOCS).parts) - 1
    return "../" * depth if depth else ""


def icon(name: str) -> str:
    return (
        f'<velin-icon name="{name}" {FA} size="14" '
        f'class="velin-doc-sidebar__icon" aria-hidden="true"></velin-icon>'
    )


def link(rel: str, href: str, label: str, icon_name: str, cat: str, active: str) -> str:
    full = f"{rel}{href}"
    cls = ' class="active"' if href == active else ""
    return (
        f'<li><a href="{full}" data-cat="{cat}"{cls}>'
        f'{icon(icon_name)}<span class="velin-doc-sidebar__label">{label}</span></a></li>'
    )


def pinned_html(rel: str, active: str) -> str:
    quick = "".join(link(rel, h, l, i, c, active) for h, l, i, c in QUICK)
    guides = "".join(link(rel, h, l, i, c, active) for h, l, i, c in GUIDES)
    return (
        '<motion class="velin-doc-sidebar__pinned" data-cat="pinned">'
        if False else
        '<motion class="velin-doc-sidebar__pinned" data-cat="pinned">'
    ) or (
        '<div class="velin-doc-sidebar__pinned" data-cat="pinned">'
        '<p class="velin-doc-sidebar__pinned-label">Switch quickly</p>'
        f'<ul class="velin-doc-sidebar__links velin-doc-sidebar__links--prominent">{quick}</ul>'
        '<p class="velin-doc-sidebar__pinned-label velin-doc-sidebar__pinned-label--sub">'
        "Framework guides</p>"
        f'<ul class="velin-doc-sidebar__links velin-doc-sidebar__links--prominent">{guides}</ul>'
        "</div>"
    )


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if not PINNED_RE.search(text):
        return False
    rel = rel_prefix(path)
    active = path.relative_to(DOCS).as_posix()
    new_pinned = pinned_html(rel, active)
    text = PINNED_RE.sub(new_pinned, text, count=1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    n = sum(1 for html in DOCS.rglob("*.html") if patch_file(html))
    print(f"Patched pinned block in {n} files")


if __name__ == "__main__":
    main()
