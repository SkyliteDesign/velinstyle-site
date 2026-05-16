# -*- coding: utf-8 -*-
"""Write playground snippet files (use <motion as div placeholder)."""
from pathlib import Path

D = Path(__file__).resolve().parent / "playground-snippets"
D.mkdir(parents=True, exist_ok=True)
T = "di" + "v"


def d(s: str) -> str:
    return s.replace("<motion", f"<{T}").replace("</motion>", f"</{T}>")


SNIPPETS: dict[str, tuple[str, str]] = {}

SNIPPETS["demo-buttons"] = (
    d(
        """                  <motion class="playground-demo">
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Variants</p>
                      <motion class="playground-demo__row">
                        <button type="button" class="velin-btn velin-btn--primary">Primary</button>
                        <button type="button" class="velin-btn velin-btn--secondary">Secondary</button>
                        <button type="button" class="velin-btn velin-btn--success">Success</button>
                        <button type="button" class="velin-btn velin-btn--outline">Outline</button>
                        <button type="button" class="velin-btn velin-btn--ghost">Ghost</button>
                        <button type="button" class="velin-btn velin-btn--danger">Danger</button>
                      </motion>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Sizes</p>
                      <motion class="playground-demo__row">
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Small</button>
                        <button type="button" class="velin-btn velin-btn--primary">Default</button>
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--lg">Large</button>
                      </motion>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">States</p>
                      <motion class="velin-flex velin-flex--column velin-gap-3">
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--loading">Loading</button>
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--block">Block width</button>
                      </motion>
                    </motion>
                  </motion>
"""
    ),
    """<button class="velin-btn velin-btn--primary">Primary</button>
<button class="velin-btn velin-btn--success">Success</button>
<button class="velin-btn velin-btn--outline">Outline</button>
<button class="velin-btn velin-btn--primary velin-btn--sm">Small</button>
<button class="velin-btn velin-btn--primary velin-btn--loading">Loading</button>
<button class="velin-btn velin-btn--primary velin-btn--block">Block</button>""",
)

SNIPPETS["demo-cards"] = (
    d(
        """                  <motion class="playground-demo">
                    <motion class="velin-grid velin-grid--cols-1 velin-gap-4">
                      <article class="velin-card"><motion class="velin-card__body">
                        <h3 class="velin-card__title">Default</h3>
                        <p>Standard card with elevation and accessible structure.</p>
                        <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Action</button>
                      </motion></article>
                      <article class="velin-card velin-card--flat"><motion class="velin-card__body">
                        <h3 class="velin-card__title">Flat</h3>
                        <p class="velin-text-muted">velin-card--flat — minimal shadow.</p>
                        <span class="velin-badge velin-badge--secondary">Badge</span>
                      </motion></article>
                      <article class="velin-card velin-card--clickable"><motion class="velin-card__body velin-bg-primary/10">
                        <h3 class="velin-card__title">Clickable + tint</h3>
                        <p>velin-card--clickable with velin-bg-primary/10 wash.</p>
                      </motion></article>
                      <article class="velin-card velin-border"><motion class="velin-card__body velin-bg-success/10">
                        <h3 class="velin-card__title">Success surface</h3>
                        <p>Semantic OKLCH color-mix on the card body.</p>
                      </motion></article>
                      <article class="velin-card"><motion class="velin-card__body velin-bg-danger/10">
                        <h3 class="velin-card__title">Danger surface</h3>
                        <p>velin-bg-danger/10 for error contexts.</p>
                      </motion></article>
                    </motion>
                  </motion>
"""
    ),
    """<article class="velin-card">...</article>
<article class="velin-card velin-card--flat">...</article>
<article class="velin-card velin-card--clickable">...</article>
<article class="velin-card"><motion class="velin-card__body velin-bg-success/10">...</motion></article>""".replace(
        "<motion", f"<{T}"
    ).replace("</motion>", f"</{T}>"),
)

SNIPPETS["demo-forms"] = (
    d(
        """                  <form class="playground-demo playground-demo--forms" onsubmit="return false">
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Default fields</p>
                      <motion class="velin-input-group velin-mbe-3">
                        <label class="velin-input-group__label" for="demo-email">Email</label>
                        <input class="velin-input" type="email" id="demo-email" placeholder="you@example.com" autocomplete="off">
                        <span class="velin-field-hint">We never share your email.</span>
                      </motion>
                      <motion class="velin-input-group velin-mbe-3">
                        <label class="velin-input-group__label" for="demo-pw">Password</label>
                        <input class="velin-input" type="password" id="demo-pw" placeholder="Enter password" autocomplete="off">
                      </motion>
                      <motion class="velin-input-group velin-mbe-3">
                        <label class="velin-input-group__label" for="demo-bio">Bio</label>
                        <textarea class="velin-textarea" id="demo-bio" rows="3" placeholder="Short introduction"></textarea>
                      </motion>
                      <motion class="velin-input-group velin-mbe-3">
                        <label class="velin-input-group__label" for="demo-plan">Plan</label>
                        <select class="velin-select" id="demo-plan">
                          <option>Starter</option>
                          <option selected>Pro</option>
                          <option>Enterprise</option>
                        </select>
                      </motion>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Validation</p>
                      <motion class="velin-input-group velin-mbe-3">
                        <label class="velin-input-group__label" for="demo-err">Username</label>
                        <input class="velin-input" type="text" id="demo-err" value="ab" aria-invalid="true">
                        <span class="velin-field-error">At least 3 characters required.</span>
                      </motion>
                      <motion class="velin-input-group velin-mbe-3">
                        <label class="velin-input-group__label" for="demo-ok">Coupon</label>
                        <input class="velin-input" type="text" id="demo-ok" value="SAVE20" aria-invalid="false">
                        <span class="velin-field-valid">Code applied.</span>
                      </motion>
                    </motion>
                    <button type="button" class="velin-btn velin-btn--primary velin-btn--block">Sign in</button>
                  </form>
"""
    ),
    """<div class="velin-input-group">
  <label class="velin-input-group__label" for="email">Email</label>
  <input class="velin-input" type="email" id="email">
  <span class="velin-field-hint">Hint text</span>
</div>
<input class="velin-input" aria-invalid="true">
<span class="velin-field-error">Error message</span>""",
)

SNIPPETS["demo-alerts"] = (
    d(
        """                  <motion class="playground-demo playground-demo--alerts">
                    <motion class="velin-alert velin-alert--success" role="alert">
                      <strong>Success!</strong> Your changes have been saved.
                    </motion>
                    <motion class="velin-alert velin-alert--info" role="alert">
                      <strong>Note:</strong> A new version is available.
                    </motion>
                    <motion class="velin-alert velin-alert--warning" role="alert">
                      <strong>Warning:</strong> This action cannot be undone.
                    </motion>
                    <motion class="velin-alert velin-alert--danger" role="alert">
                      <strong>Error:</strong> Something went wrong. Please try again.
                    </motion>
                  </motion>
"""
    ),
    """<div class="velin-alert velin-alert--success" role="alert">...</motion>
<div class="velin-alert velin-alert--info" role="alert">...</motion>
<div class="velin-alert velin-alert--warning" role="alert">...</motion>
<div class="velin-alert velin-alert--danger" role="alert">...</motion>""".replace(
        "<motion", f"<{T}"
    ).replace("</motion>", f"</{T}>"),
)

SNIPPETS["demo-wc"] = (
    d(
        """                  <motion class="playground-demo">
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Overlays</p>
                      <motion class="velin-flex velin-gap-3 velin-flex--wrap">
                        <button type="button" class="velin-btn velin-btn--primary" onclick="document.getElementById('site-modal').open()">Open modal</button>
                        <button type="button" class="velin-btn velin-btn--outline" onclick="document.getElementById('site-drawer').open()">Open drawer</button>
                        <button type="button" class="velin-btn" onclick="document.getElementById('site-toast').show({message:'Hello from VelinStyle!',type:'success'})">Show toast</button>
                        <button type="button" class="velin-btn velin-btn--danger" onclick="document.getElementById('site-dialog').confirm('Native dialog.',{title:'VelinStyle'})">Dialog</button>
                      </motion>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Tabs</p>
                      <velin-tabs>
                        <button slot="tab" aria-selected="true">Overview</button>
                        <button slot="tab">Features</button>
                        <button slot="tab">API</button>
                        <motion slot="panel"><p>22 Web Components with keyboard support, ARIA, and focus trapping.</p></motion>
                        <motion slot="panel"><p>Works with React, Vue, Angular, or plain HTML.</p></motion>
                        <motion slot="panel"><p>Methods, events, and CSS parts for full customization.</p></motion>
                      </velin-tabs>
                    </motion>
                    <velin-modal id="site-modal" title="VelinStyle Modal">
                      <p>Focus trapping, Escape to close, overlay click to dismiss.</p>
                      <motion slot="footer"><button type="button" class="velin-btn velin-btn--primary" onclick="document.getElementById('site-modal').close()">Got it</button></motion>
                    </velin-modal>
                    <velin-drawer id="site-drawer" title="Navigation" side="start">
                      <ul class="playground-drawer-list">
                        <li><a href="#">Dashboard</a></li>
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Profile</a></li>
                      </ul>
                    </velin-drawer>
                    <velin-toast id="site-toast"></velin-toast>
                    <velin-dialog id="site-dialog"></velin-dialog>
                  </motion>
"""
    ),
    """<velin-modal id="my-modal" title="Hello">...</velin-modal>
<velin-drawer id="nav" title="Menu" side="start">...</velin-drawer>
<velin-toast id="toast"></velin-toast>
<velin-tabs>...</velin-tabs>""",
)

SNIPPETS["demo-icons"] = (
    d(
        """                  <p class="playground-icons-lead">Built-in icons and six external providers via one attribute.</p>
                    <motion class="velin-flex velin-flex--wrap velin-gap-3 velin-flex--items-center velin-mbe-4">
                      <velin-icon name="heart" provider="lucide" size="28" label="Lucide heart"></velin-icon>
                      <velin-icon name="star" provider="lucide" size="28" label="Lucide star"></velin-icon>
                      <velin-icon name="zap" provider="lucide" size="28" label="Lucide zap"></velin-icon>
                      <velin-icon name="globe" provider="lucide" size="28" label="Lucide globe"></velin-icon>
                      <velin-icon name="shield" provider="lucide" size="28" label="Lucide shield"></velin-icon>
                      <velin-icon name="rocket" provider="lucide" size="28" label="Lucide rocket"></velin-icon>
                      <velin-icon name="code" provider="lucide" size="28" label="Lucide code"></velin-icon>
                      <velin-icon name="terminal" provider="lucide" size="28" label="Lucide terminal"></velin-icon>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Sizes</p>
                      <motion class="velin-flex velin-gap-3 velin-flex--items-center">
                        <velin-icon name="check" size="20" label="20px"></velin-icon>
                        <velin-icon name="check" size="28" label="28px"></velin-icon>
                        <velin-icon name="check" size="36" label="36px"></velin-icon>
                      </motion>
                    </motion>
"""
    ),
    """<velin-icon name="check"></velin-icon>
<velin-icon name="heart" provider="lucide"></velin-icon>
<velin-icon name="star-fill" provider="bootstrap"></velin-icon>
velinstyle icons add lucide --icons heart,star,zap""",
)

SNIPPETS["demo-themes"] = (
    d(
        """                  <motion id="playground-theme-sandbox" class="theme-sandbox theme-sandbox--playground">
                    <motion class="theme-sandbox__actions" role="group" aria-label="Pick a preset">
                      <button type="button" class="theme-swatch is-active" data-velin-theme=""><span class="theme-swatch__chip"></span>Default</button>
                      <button type="button" class="theme-swatch" data-velin-theme="sharp"><span class="theme-swatch__chip"></span>Sharp</button>
                      <button type="button" class="theme-swatch" data-velin-theme="soft"><span class="theme-swatch__chip"></span>Soft</button>
                      <button type="button" class="theme-swatch" data-velin-theme="neon"><span class="theme-swatch__chip"></span>Neon</button>
                      <button type="button" class="theme-swatch" data-velin-theme="ocean"><span class="theme-swatch__chip"></span>Ocean</button>
                      <button type="button" class="theme-swatch" data-velin-theme="midnight"><span class="theme-swatch__chip"></span>Midnight</button>
                      <button type="button" class="theme-swatch" data-velin-theme="forest"><span class="theme-swatch__chip"></span>Forest</button>
                      <button type="button" class="theme-swatch" data-velin-theme="sunset"><span class="theme-swatch__chip"></span>Sunset</button>
                      <button type="button" class="theme-swatch" data-velin-theme="brutalist"><span class="theme-swatch__chip"></span>Brutalist</button>
                    </motion>
                    <p class="velin-text-muted velin-mbe-3" style="font-size:0.875rem">Scoped preview — page theme unchanged. Chips set <code>data-velin-theme</code> on this box.</p>
                    <motion class="theme-sandbox__preview velin-p-5 velin-rounded-lg velin-border">
                      <motion class="velin-flex velin-gap-3 velin-flex--wrap velin-flex--items-center velin-mbe-4">
                        <button type="button" class="velin-btn velin-btn--primary">Primary</button>
                        <button type="button" class="velin-btn velin-btn--outline">Outline</button>
                        <button type="button" class="velin-btn velin-btn--ghost">Ghost</button>
                        <span class="velin-badge velin-badge--primary">Badge</span>
                      </motion>
                      <article class="velin-card velin-card--flat">
                        <motion class="velin-card__body">
                          <h3 class="velin-card__title">Card in theme</h3>
                          <p class="velin-text-sm velin-text-muted">Tokens update instantly when you pick a preset.</p>
                        </motion>
                      </article>
                    </motion>
                  </motion>
"""
    ),
    """<section id="preview" data-velin-theme="ocean">
  <button class="theme-swatch" data-velin-theme="neon">Neon</button>
  ...
</section>""",
)

SNIPPETS["demo-responsive"] = (
    d(
        """                  <motion class="playground-demo">
                    <p id="playground-bp-indicator" class="playground-bp-indicator" aria-live="polite">Viewport: measuring…</p>
                    <table class="playground-bp-table">
                      <thead><tr><th>Token</th><th>Min width</th><th>Example</th></tr></thead>
                      <tbody>
                        <tr><td>base</td><td>0</td><td><code>velin-block</code></td></tr>
                        <tr><td><code>sm</code></td><td>36rem (576px)</td><td><code>velin-sm:flex--row</code></td></tr>
                        <tr><td><code>md</code></td><td>48rem (768px)</td><td><code>velin-md:grid-cols-3</code></td></tr>
                        <tr><td><code>lg</code></td><td>62rem (992px)</td><td><code>velin-lg:hidden</code></td></tr>
                        <tr><td><code>xl</code></td><td>80rem (1280px)</td><td><code>velin-xl:p-8</code></td></tr>
                      </tbody>
                    </table>
                    <motion class="playground-bp-live">
                      <span class="playground-bp-badge playground-bp-badge--base">base</span>
                      <span class="playground-bp-badge playground-bp-badge--sm">sm+</span>
                      <span class="playground-bp-badge playground-bp-badge--md">md+</span>
                      <span class="playground-bp-badge playground-bp-badge--lg">lg+</span>
                      <span class="playground-bp-badge playground-bp-badge--xl">xl+</span>
                    </motion>
                    <motion class="velin-p-4 velin-rounded-lg velin-bg-primary/10 velin-border">
                      <span class="velin-hidden velin-sm-block velin-font-semibold">Visible from <code>sm</code> — <code>velin-hidden velin-sm:block</code></span>
                      <span class="velin-block velin-sm-hidden velin-font-semibold">Mobile only — resize to see the switch.</span>
                    </motion>
                  </motion>
"""
    ),
    """<div class="velin-hidden velin-sm:block">Desktop / sm+</div>
<div class="velin-flex velin-flex--col velin-sm-flex--row velin-gap-3">...</motion>""".replace(
        "<motion", f"<{T}"
    ).replace("</motion>", f"</{T}>"),
)

SNIPPETS["demo-variables"] = (
    d(
        """                  <motion class="playground-demo">
                    <p class="playground-icons-lead">Design tokens compile to <code>--velin-*</code> variables — swap themes or override in scope.</p>
                    <motion class="playground-token-grid">
                      <motion class="playground-token-card"><motion class="playground-token-card__bar" style="background:var(--velin-color-primary)"></motion><code>--velin-color-primary</code></motion>
                      <motion class="playground-token-card"><motion class="playground-token-card__bar" style="background:var(--velin-color-secondary)"></motion><code>--velin-color-secondary</code></motion>
                      <motion class="playground-token-card"><motion class="playground-token-card__bar" style="background:var(--velin-color-success)"></motion><code>--velin-color-success</code></motion>
                      <motion class="playground-token-card"><motion class="playground-token-card__bar" style="background:var(--velin-color-surface-bright)"></motion><code>--velin-color-surface-bright</code></motion>
                      <motion class="playground-token-card"><motion class="playground-token-card__bar playground-token-card__bar--space" style="inline-size:var(--velin-space-6)"></motion><code>--velin-space-6</code></motion>
                      <motion class="playground-token-card"><motion class="playground-token-card__radius" style="border-radius:var(--velin-radius-lg)"></motion><code>--velin-radius-lg</code></motion>
                      <motion class="playground-token-card"><p class="velin-text-sm velin-mbe-1" style="font-family:var(--velin-font-sans)">Aa Sans</p><code>--velin-font-sans</code></motion>
                      <motion class="playground-token-card"><p class="velin-text-sm velin-mbe-1" style="font-family:var(--velin-font-mono)">Mono</p><code>--velin-font-mono</code></motion>
                    </motion>
                  </motion>
"""
    ),
    """:root {
  --velin-color-primary: oklch(55% 0.2 264);
  --velin-space-6: 1.5rem;
  --velin-radius-lg: 0.75rem;
}""",
)

SNIPPETS["demo-colors"] = (
    d(
        """                  <motion class="playground-color-matrix">
                    <motion class="playground-color-row">
                      <p class="playground-color-row__name">primary</p>
                      <motion class="playground-color-row__swatches">
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-primary/10"></motion><span class="playground-color-swatch__label">/10</span></motion>
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-primary/20"></motion><span class="playground-color-swatch__label">/20</span></motion>
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-primary/30"></motion><span class="playground-color-swatch__label">/30</span></motion>
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-primary"></motion><span class="playground-color-swatch__label">solid</span></motion>
                      </motion>
                    </motion>
                    <motion class="playground-color-row">
                      <p class="playground-color-row__name">success</p>
                      <motion class="playground-color-row__swatches">
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-success/10"></motion><span class="playground-color-swatch__label">/10</span></motion>
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-success/20"></motion><span class="playground-color-swatch__label">/20</span></motion>
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-success"></motion><span class="playground-color-swatch__label">solid</span></motion>
                      </motion>
                    </motion>
                    <motion class="playground-color-row">
                      <p class="playground-color-row__name">danger</p>
                      <motion class="playground-color-row__swatches">
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-danger/10"></motion><span class="playground-color-swatch__label">/10</span></motion>
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-danger/20"></motion><span class="playground-color-swatch__label">/20</span></motion>
                        <motion class="playground-color-swatch"><motion class="playground-color-swatch__box velin-bg-danger"></motion><span class="playground-color-swatch__label">solid</span></motion>
                      </motion>
                    </motion>
                  </motion>
"""
    ),
    """<span class="velin-bg-primary/20 velin-text-primary">Tinted</span>
<div class="velin-bg-success/10">Wash</div>""",
)

SNIPPETS["demo-grid"] = (
    d(
        """                  <motion class="playground-demo">
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Columns + gap</p>
                      <motion class="velin-grid velin-grid--cols-2 velin-grid--md-cols-4 velin-grid--gap-4">
                        <motion class="playground-grid-cell">1</motion>
                        <motion class="playground-grid-cell">2</motion>
                        <motion class="playground-grid-cell">3</motion>
                        <motion class="playground-grid-cell">4</motion>
                      </motion>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Auto-fit</p>
                      <motion class="velin-grid velin-grid--auto-fit velin-grid--gap-3" style="--velin-grid-min:8rem">
                        <motion class="playground-grid-cell">A</motion>
                        <motion class="playground-grid-cell">B</motion>
                        <motion class="playground-grid-cell">C</motion>
                      </motion>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Span</p>
                      <motion class="velin-grid velin-grid--cols-3 velin-grid--gap-3">
                        <motion class="playground-grid-cell velin-col-2">velin-col-2</motion>
                        <motion class="playground-grid-cell">1</motion>
                        <motion class="playground-grid-cell velin-col-full">velin-col-full</motion>
                      </motion>
                    </motion>
                    <motion class="playground-demo__section">
                      <p class="playground-demo__label">Container query</p>
                      <motion class="playground-cq-demo velin-container velin-container--fluid">
                        <motion class="velin-grid velin-grid--cols-1 velin-grid--md-cols-3 velin-grid--gap-3">
                          <motion class="playground-grid-cell">CQ</motion>
                          <motion class="playground-grid-cell">cols</motion>
                          <motion class="playground-grid-cell">flip</motion>
                        </motion>
                      </motion>
                    </motion>
                  </motion>
"""
    ),
    """<div class="velin-grid velin-grid--cols-2 velin-grid--md-cols-4 velin-grid--gap-4">...</motion>
<div class="velin-grid velin-grid--auto-fit" style="--velin-grid-min:12rem">...</motion>
<div class="velin-grid velin-grid--cols-3"><div class="velin-col-2">...</motion></motion>""".replace(
        "<motion", f"<{T}"
    ).replace("</motion>", f"</{T}>"),
)

_anim_tile = (
    '<motion class="playground-animate-tile"><span class="playground-animate-tile__chip velin-animate-{name} velin-animate--infinite">{label}</span><code>velin-animate-{name}</code></motion>'
)
_anim_names = [
    ("fade-in", "fade-in"),
    ("slide-up", "slide-up"),
    ("scale-in", "scale-in"),
    ("bounce", "bounce"),
    ("pulse", "pulse"),
    ("shake", "shake"),
    ("wiggle", "wiggle"),
    ("spin", "spin"),
    ("heartbeat", "heartbeat"),
    ("ping", "ping"),
]
_motion_prev = "                  <motion class=\"playground-animate-grid\">\n" + "\n".join(
    _anim_tile.format(name=n, label=l) for n, l in _anim_names
) + "\n                    <motion class=\"playground-animate-tile\"><span class=\"playground-animate-tile__chip velin-animate-spin velin-animate--infinite\" aria-hidden=\"true\" style=\"display:inline-block;width:1.25rem;height:1.25rem;border:2px solid var(--velin-color-border);border-top-color:var(--velin-color-primary);border-radius:50%\"></span><code>spinner</code></motion>\n                  </motion>"
SNIPPETS["demo-motion"] = (
    d(_motion_prev),
    """<span class="velin-animate-fade-in">Enter</span>
<span class="velin-animate-pulse velin-animate--infinite">Live</span>
<span class="velin-animate-bounce velin-animate--infinite">Attention</span>""",
)

SNIPPETS["demo-3d"] = (
    d(
        """                  <motion class="playground-3d-stage">
                    <motion class="velin-flex velin-gap-2 velin-flex--wrap velin-mbe-2">
                      <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-playground-replay="playground-3d-flip">Replay flip</button>
                      <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-playground-replay="playground-3d-swing">Replay swing</button>
                      <button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-playground-replay="playground-3d-tada">Replay tada</button>
                    </motion>
                    <motion class="velin-flex velin-flex--wrap velin-gap-4">
                      <article id="playground-3d-flip" class="velin-card velin-animate-flip playground-3d-card">
                        <motion class="velin-card__body"><h3 class="velin-card__title">Flip</h3><p class="velin-text-sm velin-text-muted">velin-animate-flip</p></motion>
                      </article>
                      <article id="playground-3d-swing" class="velin-card velin-animate-swing playground-3d-card">
                        <motion class="velin-card__body"><h3 class="velin-card__title">Swing</h3><p class="velin-text-sm velin-text-muted">velin-animate-swing</p></motion>
                      </article>
                      <article id="playground-3d-drop" class="velin-card velin-animate-drop-in playground-3d-card">
                        <motion class="velin-card__body"><h3 class="velin-card__title">Drop in</h3><p class="velin-text-sm velin-text-muted">velin-animate-drop-in</p></motion>
                      </article>
                      <article id="playground-3d-tada" class="velin-card velin-animate-tada playground-3d-card">
                        <motion class="velin-card__body"><h3 class="velin-card__title">Tada</h3><p class="velin-text-sm velin-text-muted">velin-animate-tada</p></motion>
                      </article>
                    </motion>
                  </motion>
"""
    ),
    """<article class="velin-card velin-animate-flip">...</article>
<article class="velin-card velin-animate-swing">...</article>
<article class="velin-card velin-animate-drop-in">...</article>
<article class="velin-card velin-animate-tada">...</article>""",
)

for pid, (prev, code) in SNIPPETS.items():
    (D / f"{pid}.preview.html").write_text(prev, encoding="utf-8", newline="\n")
    (D / f"{pid}.code.txt").write_text(code, encoding="utf-8", newline="\n")
    print("wrote", pid)
