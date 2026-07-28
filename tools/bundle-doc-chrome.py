#!/usr/bin/env python3
"""Bundle doc-nav.js + doc-md-viewer.js → doc-chrome.js (single script for all doc pages). Doc translation is deferred — not bundled."""
from __future__ import annotations

from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
DOCS = SITE / "docs"
NAV = DOCS / "doc-nav.js"
MD = DOCS / "doc-md-viewer.js"
OUT = DOCS / "doc-chrome.js"


def main() -> None:
    nav = NAV.read_text(encoding="utf-8").rstrip()
    md = MD.read_text(encoding="utf-8").rstrip()
    banner = "/* Bundled by tools/bundle-doc-chrome.py — do not edit doc-chrome.js directly */\n"
    OUT.write_text(f"{banner}{nav}\n\n{md}\n", encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
