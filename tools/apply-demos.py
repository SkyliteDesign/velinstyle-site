# -*- coding: utf-8 -*-
import re
from pathlib import Path

html_path = Path(__file__).resolve().parents[1] / "index.html"
text = html_path.read_text(encoding="utf-8")


def _b(*parts):
    return "\n".join(parts)


def _d(s):
    return s.replace("<motion", "<div").replace("</motion>", "</motion>").replace("</motion>", "</motion>")


def _d(s):
    return s.replace("<motion", "<div").replace("</motion>", "</div>")


SNIPPETS: dict[str, tuple[str, str]] = {}

SNIPPETS["demo-buttons"] = (
    _d(_b(
        '                  <motion class="playground-demo">',
        '                    <motion class="playground-demo__section">',
        '                      <p class="playground-demo__label">Variants</p>',
        '                      <motion class="playground-demo__row">',
        '                        <button type="button" class="velin-btn velin-btn--primary">Primary</button>',
        '                        <button type="button" class="velin-btn velin-btn--secondary">Secondary</button>',
        '                        <button type="button" class="velin-btn velin-btn--success">Success</button>',
        '                        <button type="button" class="velin-btn velin-btn--outline">Outline</button>',
        '                        <button type="button" class="velin-btn velin-btn--ghost">Ghost</button>',
        '                        <button type="button" class="velin-btn velin-btn--danger">Danger</button>',
        '                      </motion>',
        '                    </motion>',
        '                    <motion class="playground-demo__section">',
        '                      <p class="playground-demo__label">Sizes</p>',
        '                      <motion class="playground-demo__row">',
        '                        <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Small</button>',
        '                        <button type="button" class="velin-btn velin-btn--primary">Default</button>',
        '                        <button type="button" class="velin-btn velin-btn--primary velin-btn--lg">Large</button>',
        '                      </motion>',
        '                    </motion>',
        '                    <motion class="playground-demo__section">',
        '                      <p class="playground-demo__label">States</p>',
        '                      <motion class="velin-flex velin-flex--column velin-gap-3">',
        '                        <button type="button" class="velin-btn velin-btn--primary velin-btn--loading">Loading</button>',
        '                        <button type="button" class="velin-btn velin-btn--primary velin-btn--block">Block width</button>',
        '                      </motion>',
        '                    </motion>',
        '                  </motion>',
    )),
    _b(
        '<button class="velin-btn velin-btn--primary">Primary</button>',
        '<button class="velin-btn velin-btn--success">Success</button>',
        '<button class="velin-btn velin-btn--outline">Outline</button>',
        '<button class="velin-btn velin-btn--primary velin-btn--sm">Small</button>',
        '<button class="velin-btn velin-btn--primary velin-btn--loading">Loading</button>',
    ),
)

SNIPPETS["demo-cards"] = (
    _d(_b(
        '                  <motion class="playground-demo">',
        '                    <motion class="velin-grid velin-grid--cols-1 velin-gap-4">',
        '                      <article class="velin-card"><div class="velin-card__body">',
        '                        <h3 class="velin-card__title">Default</h3>',
        '                        <p>Standard card with elevation and accessible structure.</p>',
        '                        <button type="button" class="velin-btn velin-btn--primary velin-btn--sm">Action</button>',
        '                      </div></article>',
        '                      <article class="velin-card velin-card--flat"><div class="velin-card__body">',
        '                        <h3 class="velin-card__title">Flat</h3>',
        '                        <p class="velin-text-muted">velin-card--flat — minimal shadow.</p>',
        '                        <span class="velin-badge velin-badge--secondary">Badge</span>',
        '                      </div></article>',
        '                      <article class="velin-card velin-card--clickable"><motion class="velin-card__body velin-bg-primary/10">',
        '                        <h3 class="velin-card__title">Clickable + tint</h3>',
        '                        <p>velin-card--clickable with velin-bg-primary/10 wash.</p>',
        '                      </motion></article>',
        '                      <article class="velin-card velin-border"><motion class="velin-card__body velin-bg-success/10">',
        '                        <h3 class="velin-card__title">Success surface</h3>',
        '                        <p>Semantic OKLCH color-mix on the card body.</p>',
        '                      </motion></article>',
        '                      <article class="velin-card"><motion class="velin-card__body velin-bg-danger/10">',
        '                        <h3 class="velin-card__title">Danger surface</h3>',
        '                        <p>velin-bg-danger/10 for error contexts.</p>',
        '                      </motion></article>',
        '                    </motion>',
        '                  </motion>',
    )),
    _b(
        '<article class="velin-card">...</article>',
        '<article class="velin-card velin-card--flat">...</article>',
        '<article class="velin-card velin-card--clickable">...</article>',
    ),
)

print("panels", len(SNIPPETS))
