"""Strip duplicate inline sidebar+category toggle handlers from all docs HTML pages.

doc-nav.js now owns sidebar opening, overlay click, hamburger toggle, and category
collapse/expand. The old inline blocks fire alongside it and double-toggle, which
cancels out the collapse animation. This script removes only those two patterns
and leaves theme, tabs, copy, and TOC inline logic intact.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "docs"

_WS = r"\s*"

_DECL = (
    r"const\s+sidebar\s*=\s*document\.getElementById\(\s*'sidebar'\s*\)\s*"
    r"(?:,\s*overlay\s*=|;\s*const\s+overlay\s*=)\s*"
    r"document\.getElementById\(\s*'sidebarOverlay'\s*\)\s*"
    r"(?:,\s*hamburger\s*=|;\s*const\s+hamburger\s*=)\s*"
    r"document\.getElementById\(\s*'sidebarToggle'\s*\)\s*;\s*"
)

SIDEBAR_BLOCK = re.compile(
    _DECL
    + r"function\s+openSidebar\s*\(\s*\)\s*\{[^}]*?\}\s*"
    + r"function\s+closeSidebar\s*\(\s*\)\s*\{[^}]*?\}\s*"
    + r"hamburger\.addEventListener\(\s*'click'\s*,.*?\)\s*;\s*"
    + r"overlay\.addEventListener\(\s*'click'\s*,\s*closeSidebar\s*\)\s*;\s*",
    flags=re.DOTALL,
)

CATEGORY_BLOCK = re.compile(
    r"document\.querySelectorAll\(\s*'\.velin-doc-sidebar__category-header'\s*\)"
    r"\s*\.forEach\(\s*(?:b|btn)\s*=>\s*\{\s*"
    r"(?:b|btn)\.addEventListener\(\s*'click'\s*,\s*\(\s*\)\s*=>\s*\{\s*"
    r"const\s+(?:c|cat)\s*=\s*(?:b|btn)\.closest\(\s*'\.velin-doc-sidebar__category'\s*\)\s*;\s*"
    r"(?:c|cat)\.classList\.toggle\(\s*'collapsed'\s*\)\s*;\s*"
    r"(?:b|btn)\.setAttribute\(\s*'aria-expanded'\s*,\s*!\s*(?:c|cat)\.classList\.contains\(\s*'collapsed'\s*\)\s*\)\s*;?\s*"
    r"\}\s*\)\s*;?\s*\}\s*\)\s*;\s*"
)


def patch(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    new = SIDEBAR_BLOCK.sub("", text)
    new = CATEGORY_BLOCK.sub("", new)
    if new == text:
        return False
    path.write_text(new, encoding="utf-8")
    return True


def main() -> int:
    files = list(ROOT.rglob("*.html"))
    changed = sum(1 for f in files if patch(f))
    print(f"Patched {changed} / {len(files)} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
