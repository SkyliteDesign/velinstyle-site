import re
from pathlib import Path

html = Path(r"D:\ideen\velinstyle-site\docs\guides\prompt-scaffolding.html").read_text(encoding="utf-8")
m = re.search(r'<nav class="velin-doc-sidebar".*?</nav>', html, re.DOTALL)
nav = m.group(0)
for block in re.finditer(
    r'<div class="velin-doc-sidebar__category"([^>]*)>\s*'
    r'<button class="velin-doc-sidebar__category-header"[^>]*>[\s\S]*?'
    r'<span>([^<]+)</span>',
    nav,
):
    attrs, title = block.group(1), block.group(2)
    cat = re.search(r'data-cat="([^"]+)"', attrs)
    print(cat.group(1) if cat else "?", "->", title)
