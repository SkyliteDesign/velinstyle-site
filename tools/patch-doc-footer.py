#!/usr/bin/env python3
"""Patch footer on all docs/**/*.html with built-with-VelinStyle paragraph."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
DOCS = SITE / "docs"

FOOTER_INNER = """  <p>&copy; 2026 VelinStyle &middot; <a href="https://github.com/SkyliteDesign/velinstyle" style="color:inherit">GitHub</a> &middot; <a href="https://www.npmjs.com/package/@birdapi/velinstyle" style="color:inherit">npm</a> &middot; MIT License</p>
  <p class="velin-doc-footer__built" style="margin-top:0.75rem;font-size:0.8125rem;max-width:42rem;margin-inline:auto;">
  This documentation site is built entirely with VelinStyle — layout, components, themes, CLI-generated reference, doc search, and syntax highlighting. No third-party CSS framework.
</p>"""

FOOTER_RE = re.compile(
    r"<footer style=\"text-align:center;[^\"]*\">.*?</footer>",
    re.DOTALL,
)

NEW_FOOTER = (
    '<footer style="text-align:center;padding:2rem 1rem;border-top:1px solid var(--velin-color-border,#e5e5e5);'
    'margin-top:3rem;color:var(--velin-color-text-muted,#888);font-size:0.875rem;">\n'
    + FOOTER_INNER
    + "\n</footer>"
)


def main() -> None:
    n = 0
    for path in DOCS.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        if not FOOTER_RE.search(text):
            continue
        text = FOOTER_RE.sub(NEW_FOOTER, text, count=1)
        path.write_text(text, encoding="utf-8")
        n += 1
    print(f"Patched footer on {n} files")


if __name__ == "__main__":
    main()
