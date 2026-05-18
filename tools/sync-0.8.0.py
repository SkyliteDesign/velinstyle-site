#!/usr/bin/env python3
"""Sync velinstyle-site dist/ from framework build and bump version strings to 0.8.0."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRAMEWORK_DIST = ROOT.parent / "velinstyle" / "dist"
SITE_DIST = ROOT / "dist"

VERSION_REPLACEMENTS = [
    ("v0.8.0", "v0.8.0"),
    ("@birdapi/velinstyle@0.8.0", "@birdapi/velinstyle@0.8.0"),
    ("VelinStyle 0.7.5", "VelinStyle 0.8.0"),
]


def copy_dist() -> None:
    if not FRAMEWORK_DIST.is_dir():
        raise SystemExit(f"Framework dist not found: {FRAMEWORK_DIST}\nRun: cd ../velinstyle && npm run build")
    if SITE_DIST.exists():
        shutil.rmtree(SITE_DIST)
    shutil.copytree(FRAMEWORK_DIST, SITE_DIST)
    print(f"Copied {FRAMEWORK_DIST} -> {SITE_DIST}")


def main() -> None:
    copy_dist()
    print("Run tools/patch-site-080.py to update docs for 0.8.0")


if __name__ == "__main__":
    main()
