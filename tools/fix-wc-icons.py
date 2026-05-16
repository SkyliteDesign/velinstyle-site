# -*- coding: utf-8 -*-
import html as html_lib
from pathlib import Path

index = Path(__file__).resolve().parents[1] / "index.html"
snip = Path(__file__).resolve().parent / "playground-snippets"
text = index.read_text(encoding="utf-8")

wc_prev = (snip / "demo-wc.preview.html").read_text(encoding="utf-8")
icons_prev = (snip / "demo-icons.preview.html").read_text(encoding="utf-8")
wc_code = html_lib.escape((snip / "demo-wc.code.txt").read_text(encoding="utf-8").strip())
icons_code = html_lib.escape((snip / "demo-icons.code.txt").read_text(encoding="utf-8").strip())

wc_slice = text[text.index('id="demo-wc"'): text.index('id="demo-icons"')]
ic_slice = text[text.index('id="demo-icons"'): text.index('id="demo-themes"')]

wc_open = 'playground-pane__body--wc">'
ic_open = 'class="playground-pane__body">'
code_tag = 'class="playground-pane playground-pane--code">'


def patch_slice(block: str, open_needle: str, preview: str, code: str) -> str:
    i0 = block.index(open_needle) + len(open_needle)
    i1 = block.index(code_tag, i0)
    c0 = block.index("<code>", i1) + 6
    c1 = block.index("</code>", c0)
    return block[:i0] + preview + block[i1:c0] + code + block[c1:]


wc_slice = patch_slice(wc_slice, wc_open, wc_prev, wc_code)
ic_slice = patch_slice(ic_slice, ic_open, icons_prev, icons_code)

text = (
    text[: text.index('id="demo-wc"')]
    + wc_slice
    + ic_slice
    + text[text.index('id="demo-themes"') :]
)
index.write_text(text, encoding="utf-8")
print("fixed wc + icons")
