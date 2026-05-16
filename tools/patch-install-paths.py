#!/usr/bin/env python3
"""Update velinstyle-site docs to @birdapi/velinstyle@0.7.0 install/CDN paths."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXT = {".html", ".md", ".json", ".js", ".py"}

REPLACEMENTS = [
    ("velinstyle@0.4.0", "@birdapi/velinstyle@0.7.0"),
    ("@birdapi/velinstyle@0.6.1", "@birdapi/velinstyle@0.7.0"),
    ("cdn.jsdelivr.net/npm/velinstyle@", "cdn.jsdelivr.net/npm/@birdapi/velinstyle@"),
    ("unpkg.com/velinstyle@", "unpkg.com/@birdapi/velinstyle@"),
    ("https://www.npmjs.com/package/velinstyle", "https://www.npmjs.com/package/@birdapi/velinstyle"),
    ("npm install velinstyle@latest", "npm install @birdapi/velinstyle@latest"),
    ("npm install velinstyle", "npm install @birdapi/velinstyle"),
    ("yarn add velinstyle", "yarn add @birdapi/velinstyle"),
    ("pnpm add velinstyle", "pnpm add @birdapi/velinstyle"),
    ('import "velinstyle/', 'import "@birdapi/velinstyle/'),
    ("import 'velinstyle/", "import '@birdapi/velinstyle/"),
    ('@import "velinstyle/', '@import "@birdapi/velinstyle/'),
    ("node_modules/velinstyle/", "node_modules/@birdapi/velinstyle/"),
]

def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    changed = []
    for path in ROOT.rglob("*"):
        if path.suffix not in EXT or "node_modules" in path.parts:
            continue
        if patch_file(path):
            changed.append(path.relative_to(ROOT))
    print(f"Patched {len(changed)} file(s)")
    for p in sorted(changed)[:30]:
        print(f"  {p}")
    if len(changed) > 30:
        print(f"  ... and {len(changed) - 30} more")


if __name__ == "__main__":
    main()
