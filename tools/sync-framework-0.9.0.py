#!/usr/bin/env python3
"""Sync velinstyle framework build + generated docs into velinstyle-site."""
from __future__ import annotations

import importlib.util
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRAMEWORK = ROOT.parent / "velinstyle"
FRAMEWORK_DIST = FRAMEWORK / "dist"
FRAMEWORK_GENERATED = FRAMEWORK / "docs" / "generated"
SITE_DIST = ROOT / "dist"
SITE_GENERATED = ROOT / "docs" / "generated"
DOCS_DIST = ROOT / "docs" / "dist"
META_FILES = ("velin-agent.json", "llms.txt")


def copy_tree(src: Path, dest: Path) -> None:
    if not src.is_dir():
        raise SystemExit(f"Missing: {src}")
    if dest.exists():
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
    print(f"Copied {src} -> {dest}")


def prune_test_artifacts() -> None:
    for p in SITE_DIST.rglob("*.test.*"):
        if p.is_file():
            p.unlink()
            print(f"Removed test artifact: {p.relative_to(ROOT)}")


def sync_meta_artifacts() -> None:
    """Publish Velin-Meta files at /dist/ and docs/dist/."""
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
    src = FRAMEWORK / "CHANGELOG.md"
    if not src.is_file():
        print("Skip CHANGELOG.md (not in framework repo)")
        return
    for dst in (ROOT / "CHANGELOG.md", ROOT / "docs" / "CHANGELOG.md"):
        shutil.copy2(src, dst)
        print(f"Changelog -> {dst}")


def write_generated_index() -> None:
    spec = importlib.util.spec_from_file_location(
        "sync_sidebar", ROOT / "tools" / "sync-sidebar.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.write_generated_index()
    print("Wrote docs/generated/index.html")


def main() -> None:
    if not FRAMEWORK_DIST.is_dir():
        raise SystemExit(
            f"Run build first: cd {FRAMEWORK} && npm run build\n"
            f"Expected: {FRAMEWORK_DIST}"
        )
    copy_tree(FRAMEWORK_DIST, SITE_DIST)
    prune_test_artifacts()
    sync_meta_artifacts()
    sync_changelog()
    if FRAMEWORK_GENERATED.is_dir():
        copy_tree(FRAMEWORK_GENERATED, SITE_GENERATED)
        write_generated_index()
    else:
        raise SystemExit(
            f"Missing generated docs: {FRAMEWORK_GENERATED}\n"
            f"Run: cd {FRAMEWORK} && npm run docs:generate"
        )
    index_src = FRAMEWORK_DIST / "search-index.json"
    if index_src.is_file():
        shutil.copy2(index_src, ROOT / "docs" / "search-index-framework.json")
        print("Copied search index snapshot -> docs/search-index-framework.json")
    print("Site sync complete (dist + generated + meta + changelog).")


if __name__ == "__main__":
    main()
