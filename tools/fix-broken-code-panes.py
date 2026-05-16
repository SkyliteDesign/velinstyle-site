# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "index.html"
text = p.read_text(encoding="utf-8")
t = "di" + "v"
broken = "                  </" + t + ">\nclass=\"playground-pane playground-pane--code\">"
fixed = (
    "                  </" + t + ">\n\n"
    "                </" + t + ">\n"
    "              </" + t + ">\n"
    f'              <{t} class="playground-pane playground-pane--code">'
)
count = text.count(broken)
if count == 0:
    raise SystemExit("no broken panes found")
text = text.replace(broken, fixed)
p.write_text(text, encoding="utf-8")
print("fixed", count, "pane(s)")
