#!/usr/bin/env python3
"""Update site docs: canonical velin-tooltip / velin-stepper; note legacy *-wc tags."""
from __future__ import annotations

from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
DOCS = SITE / "docs"

LEGACY_TOOLTIP = """
      <h2 id="legacy-wc">Legacy <code>*-wc</code> tags</h2>
      <p><code>&lt;velin-tooltip-wc&gt;</code> and <code>&lt;velin-stepper-wc&gt;</code> remain registered as deprecated aliases in 0.9.0. Prefer <code>&lt;velin-tooltip&gt;</code> and <code>&lt;velin-stepper&gt;</code> in new markup.</p>
"""

for path in DOCS.rglob("*.html"):
    text = path.read_text(encoding="utf-8")
    orig = text
    text = text.replace("velin-tooltip-wc", "velin-tooltip")
    text = text.replace("velin-stepper-wc", "velin-stepper")
    if path.name == "tooltips.html" and 'id="legacy-wc"' not in text:
        text = text.replace(
            '<nav class="velin-doc-prevnext"',
            LEGACY_TOOLTIP + '\n      <nav class="velin-doc-prevnext"',
            1,
        )
    if path.name == "stepper.html" and 'id="legacy-wc"' not in text:
        text = text.replace(
            '<nav class="velin-doc-prevnext"',
            LEGACY_TOOLTIP + '\n      <nav class="velin-doc-prevnext"',
            1,
        )
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print(f"patched {path.relative_to(SITE)}")

patch_file = SITE / "tools" / "patch-docs-090-final.py"
if patch_file.is_file():
    t = patch_file.read_text(encoding="utf-8")
    t = t.replace(
        "<code>velin-tooltip</code> and <code>velin-stepper</code> map to <code>*-wc</code> implementations.",
        "<code>velin-tooltip-wc</code> and <code>velin-stepper-wc</code> are deprecated aliases — use <code>velin-tooltip</code> / <code>velin-stepper</code> (source files renamed).",
    )
    patch_file.write_text(t, encoding="utf-8")
    print("patched tools/patch-docs-090-final.py")

print("patch-wc-rename-site done")
