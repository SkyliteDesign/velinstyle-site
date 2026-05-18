"""Embed a compact <svg><symbol> sprite into every HTML page based on the icons it uses.

Why: under file:// browsers refuse to fetch the external SVG sprite that <velin-icon>
references via <use href="dist/velin-icons.svg#name">. By inlining only the symbols the
page actually uses, the component falls back to <use href="#name"> and renders without
network access.

Inputs:
  - dist/velin-icons.svg (built by velinstyle/icons/build-sprite.js)
  - Target HTML files: index.html, demos/*.html (or pass paths via CLI)

Behavior:
  - Scans <velin-icon name="..."> usages, ignoring entries with a provider="..." attribute
    because those render from CDN, not from the sprite.
  - Locates each matching <symbol id="..."> inside the sprite file.
  - Removes any previous block marked data-velin-inline-sprite, inserts a fresh one right
    after <body>. Idempotent: re-running keeps the file size stable.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent.parent
SPRITE_PATH = ROOT / "dist" / "velin-icons.svg"

DEFAULT_TARGETS = [
    ROOT / "index.html",
    ROOT / "demos" / "index.html",
    *(ROOT / "demos").glob("showcase-*.html"),
]

ICON_TAG = re.compile(r"<velin-icon\b([^>]*?)/?>", re.IGNORECASE)
ATTR_NAME = re.compile(r"\bname\s*=\s*\"([^\"]+)\"")
ATTR_PROVIDER = re.compile(r"\bprovider\s*=\s*\"([^\"]+)\"")
SYMBOL_BLOCK = re.compile(
    r"<symbol\b[^>]*\bid=\"([a-zA-Z0-9_\-]+)\"[\s\S]*?</symbol>",
    re.IGNORECASE,
)
INLINE_MARKER_RE = re.compile(
    r"<svg[^>]*data-velin-inline-sprite[^>]*>[\s\S]*?</svg>\s*",
    re.IGNORECASE,
)
BODY_OPEN = re.compile(r"<body\b[^>]*>", re.IGNORECASE)


def load_symbols() -> dict[str, str]:
    text = SPRITE_PATH.read_text(encoding="utf-8")
    return {m.group(1): m.group(0) for m in SYMBOL_BLOCK.finditer(text)}


def used_icon_names(html: str) -> set[str]:
    names: set[str] = set()
    for tag_match in ICON_TAG.finditer(html):
        attrs = tag_match.group(1)
        if ATTR_PROVIDER.search(attrs):
            continue
        name_match = ATTR_NAME.search(attrs)
        if name_match:
            names.add(name_match.group(1))
    return names


def build_inline_block(symbols: Iterable[str]) -> str:
    body = "".join(symbols)
    return (
        '<svg data-velin-inline-sprite="1" aria-hidden="true" focusable="false" '
        'style="position:absolute;width:0;height:0;overflow:hidden">'
        + body
        + "</svg>"
    )


def patch_file(path: Path, symbol_table: dict[str, str]) -> tuple[bool, int]:
    text = path.read_text(encoding="utf-8")
    needed = used_icon_names(text)
    matched = [symbol_table[name] for name in sorted(needed) if name in symbol_table]
    missing = sorted(name for name in needed if name not in symbol_table)
    if missing:
        print(f"  ! {path.relative_to(ROOT)}: unknown sprite ids -> {', '.join(missing)}")

    new_text = INLINE_MARKER_RE.sub("", text)
    if matched:
        block = build_inline_block(matched) + "\n"
        body_open = BODY_OPEN.search(new_text)
        if not body_open:
            print(f"  ! {path.relative_to(ROOT)}: no <body> tag found, skipped")
            return (False, 0)
        idx = body_open.end()
        new_text = new_text[:idx] + "\n" + block + new_text[idx:]

    if new_text == text:
        return (False, len(matched))
    path.write_text(new_text, encoding="utf-8")
    return (True, len(matched))


def main(argv: list[str]) -> int:
    if not SPRITE_PATH.exists():
        print(f"sprite not found: {SPRITE_PATH}", file=sys.stderr)
        return 2

    targets = [Path(a) for a in argv[1:]] if len(argv) > 1 else DEFAULT_TARGETS
    targets = [t if t.is_absolute() else ROOT / t for t in targets]

    symbols = load_symbols()
    print(f"Loaded {len(symbols)} symbols from {SPRITE_PATH.relative_to(ROOT)}")

    changed = 0
    for path in targets:
        if not path.exists():
            print(f"  - {path.relative_to(ROOT)}: missing")
            continue
        updated, count = patch_file(path, symbols)
        flag = "*" if updated else " "
        print(f"  {flag} {path.relative_to(ROOT)}: {count} icon(s)")
        if updated:
            changed += 1

    print(f"Updated {changed} / {len(targets)} files")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
