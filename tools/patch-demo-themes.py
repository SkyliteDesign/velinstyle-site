#!/usr/bin/env python3
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
INJECT = (
    '  <script src="../assets/js/velin-theme-init.js"></script>\n'
    "  <script>document.documentElement.setAttribute('data-velin-themes-base','../dist/themes');</script>\n"
)

for path in (SITE / "demos").glob("*.html"):
    text = path.read_text(encoding="utf-8")
    if "velin-theme-init.js" in text:
        continue
    if "<style>" in text:
        text = text.replace("<style>", INJECT + "<style>", 1)
        path.write_text(text, encoding="utf-8")
        print(f"patched {path.name}")
