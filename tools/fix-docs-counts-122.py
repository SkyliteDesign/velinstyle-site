"""Bump embedded velin-meta versions and component count claims for 1.2.2."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / "docs"
meta_n = 0
count_n = 0

for path in root.rglob("*.html"):
    text = path.read_text(encoding="utf-8", errors="replace")
    original = text

    # Embedded agent-meta sample blocks
    text = re.sub(
        r'("mime": "application/vnd\.velinstyle\.meta\+json"[\s\S]{0,80}?"version": ")1\.2\.[01](")',
        r"\g<1>1.2.2\2",
        text,
    )
    # Simpler: version field right before mime in meta script
    text = text.replace(
        '"version": "1.2.1",\n  "mime": "application/vnd.velinstyle.meta+json"',
        '"version": "1.2.2",\n  "mime": "application/vnd.velinstyle.meta+json"',
    )
    text = text.replace(
        '"version": "1.2.0",\n  "mime": "application/vnd.velinstyle.meta+json"',
        '"version": "1.2.2",\n  "mime": "application/vnd.velinstyle.meta+json"',
    )

    if text != original:
        meta_n += 1
        original = text

    # Component count claims (3 new WCs in 1.2.2)
    repls = [
        (r"\b40 canonical\b", "43 canonical"),
        (r"\b40 kanonische\b", "43 kanonische"),
        (r"\b40 loaders / 38 canonical\b", "43 loaders / 43 canonical"),
        (r"\b40 Loader / 38 kanonisch\b", "43 Loader / 43 kanonisch"),
        (r"\b42 lazy-loader\b", "45 lazy-loader"),
        (r"\b42 Lazy-Loader\b", "45 Lazy-Loader"),
        (r"claims 40", "claims 43"),  # safety no-op if absent
        (r"<strong>40</strong> canonical", "<strong>43</strong> canonical"),
        (r"<strong>40</strong> kanonische", "<strong>43</strong> kanonische"),
        (r"<strong>42</strong> lazy", "<strong>45</strong> lazy"),
        (r"\b40 Web Components\b", "43 Web Components"),
        (r"\b40 web components\b", "43 web components"),
        (r"40 web components in", "43 web components in"),
        (r"40 Web Components in", "43 Web Components in"),
        (r"40 Komponenten in", "43 Komponenten in"),
    ]
    for pat, rep in repls:
        text = re.sub(pat, rep, text, flags=re.IGNORECASE)

    # Common prose variants from sync check
    text = text.replace("40 canonical custom elements", "43 canonical custom elements")
    text = text.replace("40 kanonische Custom Elements", "43 kanonische Custom Elements")
    text = text.replace("42 lazy-loader entries", "45 lazy-loader entries")
    text = text.replace("42 Lazy-Loader-Einträge", "45 Lazy-Loader-Einträge")
    text = text.replace("(40 loaders / 38 canonical", "(43 loaders / 43 canonical")
    text = text.replace("(40 Loader / 38 kanonisch", "(43 Loader / 43 kanonisch")

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        count_n += 1

print(f"meta-touched-ish files: {meta_n}")
print(f"count-updated files: {count_n}")
