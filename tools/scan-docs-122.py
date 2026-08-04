"""Scan leftover 1.2.0/1.2.1 chrome markers in docs."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / "docs"
checks = [
    ("en_target", r"Current target is <strong>1\.2\.[01]"),
    ("de_target", r"Aktuelles Ziel ist <strong>1\.2\.[01]"),
    ("schema", r'softwareVersion": "1\.2\.[01]"'),
    ("header", r'velin-doc-header__version">v1\.2\.[01]'),
    ("cdn", r"@birdapi/velinstyle@1\.2\.[01]"),
    ("pkg_json", r'"version": "1\.2\.[01]"'),
    ("pin_strong", r"Pin 1\.2\.[01]|1\.2\.[01] pinnen"),
]
for label, pat in checks:
    hits = []
    for p in root.rglob("*.html"):
        t = p.read_text(encoding="utf-8", errors="replace")
        if re.search(pat, t):
            hits.append(str(p.relative_to(root)))
    print(f"{label}: {len(hits)}")
    for h in hits[:12]:
        print(" ", h)
