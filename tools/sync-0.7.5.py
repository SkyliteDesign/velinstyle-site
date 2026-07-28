#!/usr/bin/env python3
"""Sync velinstyle-site dist/ from framework build and bump 0.7.0 → 0.7.5 strings."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRAMEWORK_DIST = ROOT.parent / "velinstyle" / "dist"
SITE_DIST = ROOT / "dist"

VERSION_REPLACEMENTS = [
    ("v0.8.0", "v0.8.0"),
    ("@birdapi/velinstyle@0.8.0", "@birdapi/velinstyle@0.8.0"),
    ("VelinStyle 0.7.5", "VelinStyle 0.7.5"),
]

EXT = {".html", ".md", ".json", ".js", ".py", ".css"}


def copy_dist() -> None:
    if not FRAMEWORK_DIST.is_dir():
        raise SystemExit(f"Framework dist not found: {FRAMEWORK_DIST}\nRun: cd ../velinstyle && npm run build")
    if SITE_DIST.exists():
        shutil.rmtree(SITE_DIST)
    shutil.copytree(FRAMEWORK_DIST, SITE_DIST)
    print(f"Copied {FRAMEWORK_DIST} -> {SITE_DIST}")


def patch_versions() -> int:
    changed = 0
    for path in ROOT.rglob("*"):
        if path.suffix not in EXT or "node_modules" in path.parts or path.is_relative_to(SITE_DIST):
            continue
        text = path.read_text(encoding="utf-8")
        original = text
        for old, new in VERSION_REPLACEMENTS:
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            changed += 1
    return changed


def main() -> None:
    copy_dist()
    n = patch_versions()
    print(f"Version-patched {n} file(s) under {ROOT}")


if __name__ == "__main__":
    main()
