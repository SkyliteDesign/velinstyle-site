#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARKER = '<li><a href="../components/collapse.html">Collapse</a></li>'
INSERT = MARKER + """
<li><a href="../components/combobox.html">Combobox</a></li>
<li><a href="../components/announcer.html">Announcer</a></li>
<li><a href="../components/bottom-nav.html">Bottom nav</a></li>
<li><a href="../components/command.html">Command palette</a></li>
<li><a href="../components/menubar.html">Menubar</a></li>
<li><a href="../components/rating.html">Rating</a></li>
<li><a href="../components/segmented-control.html">Segmented control</a></li>
<li><a href="../components/sheet.html">Sheet</a></li>"""

n = 0
for path in (ROOT / "docs").rglob("*.html"):
    text = path.read_text(encoding="utf-8")
    if MARKER not in text or "components/combobox.html" in text:
        continue
    path.write_text(text.replace(MARKER, INSERT, 1), encoding="utf-8", newline="\n")
    n += 1
print(f"patched {n} files")
