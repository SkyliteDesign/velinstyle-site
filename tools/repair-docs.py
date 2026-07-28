#!/usr/bin/env python3
"""Repair docs: remove invalid </motion> tags, bump 0.7.x → 0.8.0, regenerate sidebars."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"

VERSION_REPLACEMENTS = [
    ("v0.7.5", "v0.8.0"),
    ("v0.7.0", "v0.8.0"),
    ("VelinStyle 0.7.5", "VelinStyle 0.8.0"),
    ("VelinStyle 0.7.0", "VelinStyle 0.8.0"),
    ("@birdapi/velinstyle@0.7.5", "@birdapi/velinstyle@0.8.0"),
    ("@birdapi/velinstyle@0.7.0", "@birdapi/velinstyle@0.8.0"),
]


def repair_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text
    text = text.replace("</motion>", "").replace("<motion>", "")
    for old, new in VERSION_REPLACEMENTS:
        text = text.replace(old, new)

    def fix_search(m: re.Match[str]) -> str:
        tag = m.group(0)
        paths = re.findall(r'data-search-index="([^"]+)"', tag, flags=re.IGNORECASE)
        idx = paths[0] if paths else "../search-index.json"
        head = re.split(r'\s+autocomplete=', tag, maxsplit=1, flags=re.IGNORECASE)[0].rstrip()
        if head.endswith("/"):
            head = head[:-1]
        return f'{head} autocomplete="off" data-search-index="{idx}">'

    text = re.sub(
        r"<input[^>]*id=\"docSearch\"[^>]*/?\s*>",
        fix_search,
        text,
        count=1,
        flags=re.IGNORECASE,
    )

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    n = sum(1 for p in DOCS.rglob("*.html") if repair_file(p))
    print(f"Repaired {n} HTML files")

    subprocess.check_call([sys.executable, str(ROOT / "tools" / "sync-sidebar.py")])
    print("Regenerated sidebars")

    try:
        subprocess.check_call([sys.executable, str(ROOT / "tools" / "sync-0.8.0.py")])
    except subprocess.CalledProcessError as exc:
        print("Note: dist copy failed (run npm run build in velinstyle first):", exc)


if __name__ == "__main__":
    main()
