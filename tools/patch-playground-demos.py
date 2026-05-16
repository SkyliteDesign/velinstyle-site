# -*- coding: utf-8 -*-
"""Patch playground panel bodies in index.html."""
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "index.html"
text = path.read_text(encoding="utf-8")

PANELS = {
    "demo-buttons": r'''          <motion class="playground__panel active" role="tabpanel" id="demo-buttons" aria-labelledby="tab-buttons">
            <div class="playground-stage">
              <div class="playground-pane playground-pane--preview">
                <div class="playground-pane__head"><span>Preview</span></div>
                <div class="playground-pane__body">
                  <div class="playground-demo">
                    <div class="playground-demo__section">
                      <p class="playground-demo__label">Variants</p>
                      <motion class="playground-demo__row">
                        <button type="button" class="velin-btn velin-btn--primary">Primary</button>
                        <button type="button" class="velin-btn velin-btn--secondary">Secondary</button>
                        <button type="button" class="velin-btn velin-btn--success">Success</button>
                        <button type="button" class="velin-btn velin-btn--outline">Outline</button>
                        <button type="button" class="velin-btn velin-btn--ghost">Ghost</button>
                        <button type="button" class="velin-btn velin-btn--danger">Danger</button>
                      </div>
                    </div>
                    <div class="playground-demo__section">
                      <p class="playground-demo__label">Sizes</p>
                      <div class="playground-demo__row">
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Small</button>
                        <button type="button" class="velin-btn velin-btn--primary">Default</button>
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--lg">Large</button>
                      </div>
                    </div>
                    <div class="playground-demo__section">
                      <p class="playground-demo__label">States</p>
                      <div class="velin-flex velin-flex--column velin-gap-3">
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--loading">Loading</button>
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--block">Block width</button>
                      </div>
                    </motion>
                  </div>
                </div>
              </div>
              <div class="playground-pane playground-pane--code">
                <div class="playground-pane__head"><span>HTML</span></div>
                <pre class="playground-pane__code"><code>&lt;button class="velin-btn velin-btn--primary"&gt;Primary&lt;/button&gt;
&lt;button class="velin-btn velin-btn--success"&gt;Success&lt;/button&gt;
&lt;button class="velin-btn velin-btn--outline"&gt;Outline&lt;/button&gt;
&lt;button class="velin-btn velin-btn--primary velin-btn--sm"&gt;Small&lt;/button&gt;
&lt;button class="velin-btn velin-btn--primary velin-btn--loading"&gt;Loading&lt;/button&gt;</code></pre>
              </div>
            </div>
          </div>''',
}
