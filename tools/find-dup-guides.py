import re
from pathlib import Path

docs = Path(__file__).resolve().parents[1] / "docs"
for p in docs.rglob("*.html"):
    t = p.read_text(encoding="utf-8")
    m = re.search(r'<nav class="velin-doc-sidebar"[^>]*>.*?</nav>', t, re.DOTALL)
    if not m:
        continue
    c = m.group(0).count("prompt-scaffolding")
    if c > 1:
        print(p.relative_to(docs), c)
