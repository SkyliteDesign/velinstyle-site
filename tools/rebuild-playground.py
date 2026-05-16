# -*- coding: utf-8 -*-
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "index.html"
text = path.read_text(encoding="utf-8")
text = text.replace("<motion ", "<motion ")
text = text.replace("<motion ", "<div ")
text = text.replace("</motion>", "</div>")

for marker in (
    '        <div class="playground playground--docs"',
    '        <div class="playground playground--premium"',
):
    if marker in text:
        start = text.index(marker)
        break
else:
    raise SystemExit("playground block not found")

end = text.index('        <p class="site-muted-center">Full split-view playground')
block = text[start:end]
i = block.index('          <motion class="playground__panel')
if i < 0:
    i = block.index('          <div class="playground__panel')
panels = block[i:].rstrip()
if panels.endswith("</div>"):
    panels = panels[:-5].rstrip()

panels = panels.replace('class="playground__layout"', 'class="playground-stage"')
panels = panels.replace(
    'class="playground__col playground__col--preview"',
    'class="playground-pane playground-pane--preview"',
)
panels = panels.replace(
    'class="playground__col playground__col--code"',
    'class="playground-pane playground-pane--code"',
)
panels = panels.replace(
    '<div class="playground__preview playground__preview--wc">',
    '<div class="playground-pane__head"><span>Preview</span></motion>\n'
    '                <div class="playground-pane__body playground-pane__body--wc">',
)
panels = panels.replace(
    '<div class="playground__preview">',
    '<div class="playground-pane__head"><span>Preview</span></div>\n'
    '                <div class="playground-pane__body">',
)
panels = panels.replace(
    '<div class="playground__code"><code>',
    '<div class="playground-pane__head"><span>HTML</span></div>\n'
    '                <pre class="playground-pane__code"><code>',
)
panels = panels.replace(
    '</code></div>\n              </div>\n            </motion>',
    '</code></pre>\n              </div>\n            </div>',
)
panels = panels.replace(
    '</code></div>\n              </div>\n            </div>',
    '</code></pre>\n              </div>\n            </div>',
)

header = (
    '        <div class="playground playground--docs" id="interactive-playground">\n'
    '          <div class="playground__shell">\n'
    '            <aside class="playground-sidebar" aria-label="Playground examples">\n'
    '              <motion class="playground-sidebar__group">\n'
)
