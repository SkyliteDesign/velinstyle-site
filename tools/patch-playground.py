# -*- coding: utf-8 -*-
"""Replace playground preview + code blocks by panel id."""
import html as html_lib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
SNIPPETS = Path(__file__).resolve().parent / "playground-snippets"


def esc_code(raw: str) -> str:
    return html_lib.escape(raw.strip())


def patch(html: str, panel_id: str, preview: str, code: str) -> str:
    preview = preview.strip("\n") + "\n"
    code_esc = esc_code(code)
    pat = re.compile(
        rf'(id="{re.escape(panel_id)}"[^>]*>.*?'
        r'<div class="playground-pane playground-pane--preview">.*?'
        r'<div class="playground-pane__body[^"]*">\s*)'
        r'.*?'
        r'(\s*</div>\s*</div>\s*'
        r'<div class="playground-pane playground-pane--code">.*?'
        r'<pre class="playground-pane__code"><code>)'
        r'.*?'
        r'(</code></pre>)',
        re.DOTALL,
    )
    m = pat.search(html)
    if not m:
        raise SystemExit(f"panel not found: {panel_id}")
    return html[: m.start(1)] + m.group(1) + preview + m.group(2) + code_esc + m.group(3) + html[m.end(3) :]


def load_pair(panel_id: str) -> tuple[str, str]:
    prev = (SNIPPETS / f"{panel_id}.preview.html").read_text(encoding="utf-8")
    code = (SNIPPETS / f"{panel_id}.code.txt").read_text(encoding="utf-8")
    return prev, code


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    for p in sorted(SNIPPETS.glob("*.preview.html")):
        name = p.name[: -len(".preview.html")]
        prev, code = load_pair(name)
        text = patch(text, name, prev, code)
        print("patched", name, flush=True)
    INDEX.write_text(text, encoding="utf-8", newline="\n")
    print("done", INDEX)


if __name__ == "__main__":
    main()
