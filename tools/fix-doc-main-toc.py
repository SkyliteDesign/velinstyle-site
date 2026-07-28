#!/usr/bin/env python3
"""Close <main> before <aside class="velin-doc-toc"> on pages missing </main>."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
DOCS = SITE / "docs"

# prevnext block ends, then TOC inside main (broken) — insert </main> before aside
PATTERN = re.compile(
    r"(<nav class=\"velin-doc-prevnext\"[^>]*>.*?</nav>)\s*"
    r"(<aside class=\"velin-doc-toc\")",
    re.DOTALL,
)

REPLACEMENT = r"\1\n\n    </main>\n\n    \2"

# prevnext, optional inline demo script, then TOC still inside main
PATTERN_SCRIPT = re.compile(
    r"(<nav class=\"velin-doc-prevnext\"[^>]*>.*?</nav>)\s*"
    r"(<script>.*?</script>\s*)?"
    r"(<aside class=\"velin-doc-toc\")",
    re.DOTALL,
)

REPLACEMENT_SCRIPT = r"\1\n\n    </main>\n\n    \3"


def main() -> None:
    fixed: list[str] = []
    for path in sorted(DOCS.rglob("*.html")):
        text = path.read_text(encoding="utf-8")
        if "</main>" in text:
            continue
        if "velin-doc-main" not in text or "velin-doc-toc" not in text:
            continue
        new_text, n = PATTERN.subn(REPLACEMENT, text, count=1)
        if not n:
            new_text, n = PATTERN_SCRIPT.subn(REPLACEMENT_SCRIPT, text, count=1)
        if n:
            path.write_text(new_text, encoding="utf-8")
            fixed.append(str(path.relative_to(SITE)))
    if fixed:
        print("Fixed", len(fixed), "files:")
        for f in fixed:
            print(" ", f)
    else:
        print("No files needed fixing")


if __name__ == "__main__":
    main()
