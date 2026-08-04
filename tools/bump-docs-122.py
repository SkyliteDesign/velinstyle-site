"""Bump velinstyle-site docs version markers from 1.2.0/1.2.1 to 1.2.2."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "docs"
count = 0
errors = []


def read_text(path: Path) -> str:
    raw = path.read_bytes()
    for enc in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


for path in ROOT.rglob("*.html"):
    try:
        text = read_text(path)
    except Exception as exc:  # noqa: BLE001
        errors.append(f"{path}: {exc}")
        continue
    original = text
    text = text.replace('softwareVersion": "1.2.0"', 'softwareVersion": "1.2.2"')
    text = text.replace('softwareVersion": "1.2.1"', 'softwareVersion": "1.2.2"')
    text = re.sub(
        r'(velin-doc-header__version">)v1\.2\.[01]',
        r"\1v1.2.2",
        text,
    )
    text = re.sub(
        r'(class="velin-badge(?:\s+velin-badge--(?:primary|secondary))?"[^>]*>)1\.2\.[01](</span>)',
        r"\g<1>1.2.2\2",
        text,
    )
    text = text.replace('data-doc-modernize="1.2.0"', 'data-doc-modernize="1.2.2"')
    text = text.replace('data-doc-modernize="1.2.1"', 'data-doc-modernize="1.2.2"')
    text = text.replace("@birdapi/velinstyle@1.2.0", "@birdapi/velinstyle@1.2.2")
    text = text.replace("@birdapi/velinstyle@1.2.1", "@birdapi/velinstyle@1.2.2")
    text = text.replace("Download VelinStyle v1.2.0", "Download VelinStyle v1.2.2")
    text = text.replace("VelinStyle v1.2.0 herunterladen", "VelinStyle v1.2.2 herunterladen")
    text = text.replace(
        "cdn.jsdelivr.net/npm/@birdapi/velinstyle@1.2.0",
        "cdn.jsdelivr.net/npm/@birdapi/velinstyle@1.2.2",
    )
    text = text.replace(
        "cdn.jsdelivr.net/npm/@birdapi/velinstyle@1.2.1",
        "cdn.jsdelivr.net/npm/@birdapi/velinstyle@1.2.2",
    )
    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        count += 1

print(f"updated {count} files under {ROOT}")
if errors:
    print("errors:")
    for e in errors:
        print(" ", e)
