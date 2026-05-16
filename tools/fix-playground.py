# -*- coding: utf-8 -*-
from pathlib import Path

html_path = Path(__file__).resolve().parents[1] / "index.html"
text = html_path.read_text(encoding="utf-8")
text = text.replace("<motion ", "<div ")
text = text.replace("</motion>", "</div>")

start = text.index('        <div class="playground playground--docs"')
end = text.index('        <p class="site-muted-center">Full split-view playground')
block = text[start:end]

j = block.index('          <div class="playground__panel" role="tabpanel" id="demo-cards"')
panels = block[j:].rstrip()
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
    '<div class="playground-pane__head"><span>Preview</span></div>\n'
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
    '</code></div>\n              </div>\n            </div>',
    '</code></pre>\n              </div>\n            </div>',
)

buttons = """          <div class="playground__panel active" role="tabpanel" id="demo-buttons" aria-labelledby="tab-buttons">
            <div class="playground-stage">
              <div class="playground-pane playground-pane--preview">
                <div class="playground-pane__head"><span>Preview</span></div>
                <div class="playground-pane__body">
                  <div class="velin-flex velin-flex--wrap velin-gap-3">
                    <button type="button" class="velin-btn velin-btn--primary">Primary</button>
                    <button type="button" class="velin-btn velin-btn--secondary">Secondary</button>
                    <button type="button" class="velin-btn velin-btn--outline">Outline</button>
                    <button type="button" class="velin-btn velin-btn--ghost">Ghost</button>
                    <button type="button" class="velin-btn velin-btn--danger">Danger</button>
                    <button type="button" class="velin-btn velin-btn--sm">Small</button>
                    <button type="button" class="velin-btn velin-btn--lg velin-btn--primary">Large</button>
                  </div>
                </div>
              </div>
              <div class="playground-pane playground-pane--code">
                <div class="playground-pane__head"><span>HTML</span></div>
                <pre class="playground-pane__code"><code>&lt;button class="velin-btn velin-btn--primary"&gt;Primary&lt;/button&gt;
&lt;button class="velin-btn velin-btn--secondary"&gt;Secondary&lt;/button&gt;
&lt;button class="velin-btn velin-btn--outline"&gt;Outline&lt;/button&gt;
&lt;button class="velin-btn velin-btn--ghost"&gt;Ghost&lt;/button&gt;
&lt;button class="velin-btn velin-btn--danger"&gt;Danger&lt;/button&gt;</code></pre>
              </div>
            </div>
          </div>

"""

header = (
    '        <div class="playground playground--docs" id="interactive-playground">\n'
    '          <div class="playground__shell">\n'
    '            <aside class="playground-sidebar" aria-label="Playground examples">\n'
    '              <div class="playground-sidebar__group">\n'
    '                <h3 class="playground-sidebar__title" id="playground-nav-ui">Components</h3>\n'
    '                <ul class="playground-sidebar__list" role="tablist" aria-labelledby="playground-nav-ui">\n'
    '                  <li><button class="playground__tab active" type="button" role="tab" aria-selected="true" aria-controls="demo-buttons" id="tab-buttons">Buttons</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-cards" id="tab-cards">Cards</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-forms" id="tab-forms">Forms</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-alerts" id="tab-alerts">Alerts</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-wc" id="tab-wc">Web Components</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-icons" id="tab-icons">Icons</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-themes" id="tab-themes">Themes</button></li>\n'
    '                </ul>\n'
    '              </div>\n'
    '              <div class="playground-sidebar__group">\n'
    '                <h3 class="playground-sidebar__title" id="playground-nav-css">CSS</h3>\n'
    '                <ul class="playground-sidebar__list" role="tablist" aria-labelledby="playground-nav-css">\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-responsive" id="tab-responsive">Responsive</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-filters" id="tab-filters">Filters</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-variables" id="tab-variables">CSS variables</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-colors" id="tab-colors">Colors</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-grid" id="tab-grid">Grid layout</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-motion" id="tab-motion">Animations</button></li>\n'
    '                  <li><button class="playground__tab" type="button" role="tab" aria-selected="false" aria-controls="demo-3d" id="tab-3d">3D transforms</button></li>\n'
    '                </ul>\n'
    '              </div>\n'
    '            </aside>\n'
    '            <div class="playground-main">\n'
)

text = text[:start] + header + buttons + panels + "\n            </div>\n          </div>\n        </div>\n" + text[end:]
text = text.replace("<motion ", "<div ")
text = text.replace("</motion>", "</div>")
html_path.write_text(text, encoding="utf-8")
print("ok")
