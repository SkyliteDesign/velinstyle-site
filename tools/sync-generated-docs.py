#!/usr/bin/env python3
"""Copy docs/generated/ from velinstyle framework into velinstyle-site for local file:// browsing."""
from __future__ import annotations

import shutil
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
FRAMEWORK = SITE.parent / "velinstyle" / "docs" / "generated"
TARGET = SITE / "docs" / "generated"


def main() -> None:
    if not FRAMEWORK.is_dir():
        raise SystemExit(
            f"Missing {FRAMEWORK}\nRun: cd ../velinstyle && npm run docs:generate"
        )
    if TARGET.exists():
        shutil.rmtree(TARGET)
    shutil.copytree(FRAMEWORK, TARGET)
    import importlib.util

    spec = importlib.util.spec_from_file_location(
        "sync_sidebar", SITE / "tools" / "sync-sidebar.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.write_generated_index()
    print(f"Copied {FRAMEWORK} -> {TARGET}")


if __name__ == "__main__":
    main()
