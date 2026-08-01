#!/usr/bin/env python3
from pathlib import Path
import re

DOCS = Path(__file__).resolve().parent.parent / "docs"
bad = []
for path in DOCS.rglob("*.html"):
    t = path.read_text(encoding="utf-8")
    m = re.search(r'class="velin-doc-toc__list">(.*?)</ul>', t, re.S)
    if not m:
        continue
    hrefs = re.findall(r'href="#([^"]+)"', m.group(1))
    miss = [h for h in hrefs if f'id="{h}"' not in t]
    if miss:
        bad.append((str(path.relative_to(DOCS)), miss, hrefs))
print(f"mismatched: {len(bad)}")
for f, miss, hrefs in bad[:20]:
    print(f, "miss", miss, "toc", hrefs)
