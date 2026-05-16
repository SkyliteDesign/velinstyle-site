#!/usr/bin/env python3
"""Build docs/search-index.json from HTML pages."""
import json
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"
TITLE_RE = re.compile(r"<title>(.*?) · VelinStyle</title>", re.I)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.I)
DESC_RE = re.compile(r'<meta name="description" content="([^"]*)"', re.I)
TAG_RE = re.compile(r"<[^>]+>")


def section_for(path: Path) -> str:
    parts = path.relative_to(DOCS).parts
    if len(parts) < 2:
        return "Docs"
    return parts[0].replace("-", " ").title()


def main() -> None:
    entries = []
    for html in sorted(DOCS.rglob("*.html")):
        if html.name.startswith("_"):
            continue
        text = html.read_text(encoding="utf-8", errors="ignore")
        title_m = TITLE_RE.search(text)
        h1_m = H1_RE.search(text)
        desc_m = DESC_RE.search(text)
        title = TAG_RE.sub("", title_m.group(1)) if title_m else html.stem
        if h1_m:
            title = TAG_RE.sub("", h1_m.group(1))
        desc = desc_m.group(1) if desc_m else ""
        rel = html.relative_to(DOCS).as_posix()
        entries.append({
            "title": title,
            "section": section_for(html),
            "url": rel,
            "keywords": f"{title} {desc} {rel.replace('/', ' ')}",
        })
    out = DOCS / "search-index.json"
    out.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(entries)} entries to {out}")


if __name__ == "__main__":
    main()
