#!/usr/bin/env python3
"""Sync velinstyle-site dist/ from framework build (0.9.0)."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRAMEWORK_DIST = ROOT.parent / "velinstyle" / "dist"
FRAMEWORK_ROOT = ROOT.parent / "velinstyle"
SITE_DIST = ROOT / "dist"
DOCS_DIST = ROOT / "docs" / "dist"
META_FILES = ("velin-agent.json", "llms.txt")


def sync_meta_artifacts() -> None:
    """Publish Velin-Meta files at /dist/ and docs/dist/ (served as static files)."""
    for name in META_FILES:
        src = FRAMEWORK_DIST / name
        if not src.is_file():
            print(f"Skip meta (missing in framework dist): {name}")
            continue
        for dst_dir in (SITE_DIST, DOCS_DIST):
            dst_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst_dir / name)
            print(f"Meta: {name} -> {dst_dir / name}")


def sync_changelog() -> None:
    src = FRAMEWORK_ROOT / "CHANGELOG.md"
    if not src.is_file():
        print("Skip CHANGELOG.md (not in framework repo)")
        return
    for dst in (ROOT / "CHANGELOG.md", ROOT / "docs" / "CHANGELOG.md"):
        shutil.copy2(src, dst)
        print(f"Changelog -> {dst}")


def copy_dist() -> None:
    if not FRAMEWORK_DIST.is_dir():
        raise SystemExit(
            f"Framework dist not found: {FRAMEWORK_DIST}\nRun: cd ../velinstyle && npm run build"
        )
    if SITE_DIST.exists():
        shutil.rmtree(SITE_DIST)
    shutil.copytree(FRAMEWORK_DIST, SITE_DIST)
    print(f"Copied {FRAMEWORK_DIST} -> {SITE_DIST}")
    sync_meta_artifacts()
    sync_changelog()


def main() -> None:
    copy_dist()
    print("0.9.0: meta artifacts at /dist/ + docs/dist/; CHANGELOG.md synced.")


if __name__ == "__main__":
    main()
