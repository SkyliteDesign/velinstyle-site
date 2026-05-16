# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "index.html"
text = p.read_text(encoding="utf-8")
t = "di" + "v"
broken = (
    "                    </" + t + ">\n"
    'class="playground-pane playground-pane--code">'
)
fixed = (
    "                    </" + t + ">\n\n"
    "                </" + t + ">\n"
    "              </" + t + ">\n"
    f'              <{t} class="playground-pane playground-pane--code">'
)
if broken not in text:
    raise SystemExit("broken icons markup not found")
text = text.replace(broken, fixed, 1)
p.write_text(text, encoding="utf-8")
print("icons markup fixed")
