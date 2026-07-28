#!/usr/bin/env python3
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "tools/patch-docs-090-final.py"
t = p.read_text(encoding="utf-8")
old = """    note = (
        '<motionNOTE</motion>\\n'
    )
    note = note.replace(
        "<motionNOTE</motion>",
        '<div class="velin-doc-callout velin-mbe-4" role="note">\\n'
        "        <strong>Security:</strong> Result <code>href</code> values pass through "
        "<code>sanitizeSearchUrl</code>. Highlights are escaped.\\n"
        "      </motion>",
    ).replace("</motion>", "</div>")"""
old = old.replace("motionNOTE", "divNOTE")
new = """    note = (
        '<div class="velin-doc-callout velin-doc-callout--info velin-mbe-4" role="note">\\n'
        "        <strong>Security:</strong> Result <code>href</code> values pass through "
        "<code>sanitizeSearchUrl</code>. Highlights are escaped.\\n"
        "      </div>\\n"
    )"""
if old not in t:
    raise SystemExit("pattern not found")
p.write_text(t.replace(old, new), encoding="utf-8")
print("fixed patch_site_velin_search note")
