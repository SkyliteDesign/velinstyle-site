#!/usr/bin/env python3
"""Bulk-update velinstyle-site docs for WCAG 2.2 AAA defaults (0.9+)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# (old, new) — order matters for overlapping patterns
REPLACEMENTS: list[tuple[str, str]] = [
    ("wcag22-matrix.md", "wcag22-aaa-matrix.md"),
    ("WCAG 2.2 matrix", "WCAG 2.2 AAA matrix"),
    ("Conformance matrix", "AAA conformance matrix"),
    (
        "WCAG 2.2 oriented modules, RTL, reduced motion",
        "WCAG 2.2 AAA token defaults, component contracts, RTL, reduced motion",
    ),
    ("WCAG 2.2 AA goals", "WCAG 2.2 AAA-oriented defaults"),
    ("WCAG 2.2 AA compliance", "WCAG 2.2 AAA-oriented defaults"),
    ("WCAG 2.2 AA structural", "WCAG 2.2 AAA structural"),
    # Apply only when not already AAA (avoid WCAG 2.2 AAA → AAAA)
    ("WCAG 2.2 AA ", "WCAG 2.2 AAA "),
    ("WCAG 2.2 AA.", "WCAG 2.2 AAA."),
    ("WCAG 2.2 AA,", "WCAG 2.2 AAA,"),
    ("WCAG 2.2 AA)", "WCAG 2.2 AAA)"),
    (
        "optional AAA via <code>data-velin-contrast=\"aaa\"</code>",
        "AAA token defaults; lighter AA palette via <code>data-velin-contrast=\"aa\"</code>",
    ),
    (
        "optional AAA via `data-velin-contrast=\"aaa\"`",
        "AAA defaults; opt-down with `data-velin-contrast=\"aa\"`",
    ),
    (
        'optional AAA via data-velin-contrast="aaa"',
        'AAA defaults; AA palette via data-velin-contrast="aa"',
    ),
    (
        "Enable AAA: <code>&lt;html data-velin-contrast=\"aaa\"&gt;</code>",
        "Opt down to AA: <code>&lt;html data-velin-contrast=\"aa\"&gt;</code>",
    ),
    (
        "Enable enhanced contrast with <code>data-velin-contrast=\"aaa\"</code>",
        "AAA contrast is the default; use <code>data-velin-contrast=\"aa\"</code> for a lighter 4.5:1 palette",
    ),
    (
        "framework is <strong>WCAG 2.2 oriented</strong>, not certifying your app",
        "targets <strong>WCAG 2.2 Level AAA</strong> token defaults and component contracts — your app certification remains your responsibility",
    ),
    (
        "VelinStyle provides <strong>WCAG 2.2 oriented</strong> helpers",
        "VelinStyle targets <strong>WCAG 2.2 Level AAA</strong> token defaults and component contracts",
    ),
    ("33+ pages", "50+ pages"),
    (
        "<code>npm run test:a11y</code> (axe WCAG 2.2, 50+ pages) and <code>npx velinstyle scan</code>",
        "<code>npm run test:a11y</code>, <code>npm run test:a11y:coverage</code>, <code>npm run test:contrast</code>, and <code>npx velinstyle scan --only a11y</code>",
    ),
]

SKIP_DIRS = {".git", "node_modules", "dist", "tools/playground-snippets"}

# Verbatim copies of framework files. Rewriting them would make the release sync
# guard report permanent drift against the source of truth.
SKIP_FILES = {
    Path("CHANGELOG.md"),
    Path("docs/CHANGELOG.md"),
}
SKIP_TREES = (Path("docs/generated"),)


def patch_file(path: Path) -> bool:
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return False
    original = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text == original:
        return False
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def main() -> None:
    changed: list[str] = []
    for ext in ("*.html", "*.md"):
        for path in ROOT.rglob(ext):
            if any(part in SKIP_DIRS for part in path.parts):
                continue
            rel = path.relative_to(ROOT)
            if rel in SKIP_FILES or any(tree in rel.parents for tree in SKIP_TREES):
                continue
            if patch_file(path):
                changed.append(str(path.relative_to(ROOT)))
    print(f"Patched {len(changed)} file(s)")
    for name in sorted(changed)[:40]:
        print(f"  {name}")
    if len(changed) > 40:
        print(f"  ... and {len(changed) - 40} more")


if __name__ == "__main__":
    main()
