#!/usr/bin/env python3
"""Add aria-hidden=\"true\" to decorative logo <img alt=\"\"> tags."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG_RE = re.compile(r"<img\b([^>]*?)>", re.IGNORECASE)


def patch_tag(tag: str) -> str:
    if "aria-hidden" in tag.lower():
        return tag
    if not re.search(r'\balt\s*=\s*["\']\s*["\']', tag, re.IGNORECASE):
        return tag
    return tag[:-1] + ' aria-hidden="true">'


def main() -> None:
    changed = 0
    for path in ROOT.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        new_parts: list[str] = []
        last = 0
        file_changed = False
        for m in IMG_RE.finditer(text):
            new_parts.append(text[last : m.start()])
            patched = patch_tag(m.group(0))
            if patched != m.group(0):
                file_changed = True
            new_parts.append(patched)
            last = m.end()
        new_parts.append(text[last:])
        if not file_changed:
            continue
        path.write_text("".join(new_parts), encoding="utf-8", newline="\n")
        changed += 1
        print(path.relative_to(ROOT))
    print(f"Updated {changed} HTML files.")


if __name__ == "__main__":
    main()
