#!/usr/bin/env python3
"""Bundle doc-lang-map.js + doc-nav.js + doc-md-viewer.js → doc-chrome.js."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
DOCS = SITE / "docs"
GEN = SITE / "tools" / "gen-doc-lang-map.py"
LANG = DOCS / "doc-lang-map.js"
NAV = DOCS / "doc-nav.js"
MD = DOCS / "doc-md-viewer.js"
OUT = DOCS / "doc-chrome.js"


def main() -> None:
    subprocess.check_call([sys.executable, str(GEN)], cwd=str(SITE))
    lang = LANG.read_text(encoding="utf-8").rstrip()
    nav = NAV.read_text(encoding="utf-8").rstrip()
    md = MD.read_text(encoding="utf-8").rstrip()
    banner = "/* Bundled by tools/bundle-doc-chrome.py — do not edit doc-chrome.js directly */\n"
    OUT.write_text(f"{banner}{lang}\n\n{nav}\n\n{md}\n", encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
