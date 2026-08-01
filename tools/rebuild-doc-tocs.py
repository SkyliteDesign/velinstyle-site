#!/usr/bin/env python3
"""Rebuild every docs page 'On this page' TOC from main h2/h3 headings."""
from __future__ import annotations

import html as html_lib
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"

MAIN_RE = re.compile(
    r'(<main\b[^>]*class="[^"]*velin-doc-main[^"]*"[^>]*>)(.*?)(</main>)',
    re.DOTALL | re.IGNORECASE,
)
TOC_LIST_RE = re.compile(
    r'(<ul class="velin-doc-toc__list">)(.*?)(</ul>)',
    re.DOTALL | re.IGNORECASE,
)
HEADING_RE = re.compile(
    r"<h([23])\b([^>]*)>(.*?)</h\1>",
    re.DOTALL | re.IGNORECASE,
)
ID_RE = re.compile(r'\bid=["\']([^"\']+)["\']', re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")


def slugify(text: str) -> str:
    s = TAG_RE.sub("", text)
    s = html_lib.unescape(s).strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    return s or "section"


def strip_tags(text: str) -> str:
    return html_lib.unescape(TAG_RE.sub("", text)).strip()


def extract_headings(main_html: str) -> list[tuple[str, str, int]]:
    """Return list of (id, label, level). Ensures headings have ids."""
    out: list[tuple[str, str, int]] = []
    used: set[str] = set()

    def repl(m: re.Match[str]) -> str:
        level = int(m.group(1))
        attrs = m.group(2)
        inner = m.group(3)
        label = strip_tags(inner)
        if not label:
            return m.group(0)
        id_m = ID_RE.search(attrs)
        hid = id_m.group(1) if id_m else slugify(label)
        base = hid
        n = 2
        while hid in used:
            hid = f"{base}-{n}"
            n += 1
        used.add(hid)
        out.append((hid, label, level))
        if id_m:
            if id_m.group(1) != hid:
                attrs = ID_RE.sub(f'id="{hid}"', attrs, count=1)
            return f"<h{level}{attrs}>{inner}</h{level}>"
        return f'<h{level}{attrs} id="{hid}">{inner}</h{level}>'

    # mutate via side-effect list; rewrite main separately
    HEADING_RE.sub(repl, main_html)
    return out


def rewrite_main_with_ids(main_html: str) -> tuple[str, list[tuple[str, str, int]]]:
    headings: list[tuple[str, str, int]] = []
    used: set[str] = set()

    def repl(m: re.Match[str]) -> str:
        level = int(m.group(1))
        attrs = m.group(2)
        inner = m.group(3)
        label = strip_tags(inner)
        if not label:
            return m.group(0)
        id_m = ID_RE.search(attrs)
        hid = id_m.group(1) if id_m else slugify(label)
        base = hid
        n = 2
        while hid in used:
            hid = f"{base}-{n}"
            n += 1
        used.add(hid)
        headings.append((hid, label, level))
        if id_m:
            attrs = ID_RE.sub(f'id="{hid}"', attrs, count=1)
            return f"<h{level}{attrs}>{inner}</h{level}>"
        return f'<h{level}{attrs} id="{hid}">{inner}</h{level}>'

    return HEADING_RE.sub(repl, main_html), headings


def toc_html(headings: list[tuple[str, str, int]]) -> str | None:
    if not headings:
        return None
    lines = []
    for hid, label, level in headings:
        if level == 3 and sum(1 for _, _, lv in headings if lv == 2) >= 2:
            continue
        safe = html_lib.escape(label)
        lines.append(f'        <li><a href="#{hid}">{safe}</a></li>')
    if not lines:
        for hid, label, _ in headings:
            lines.append(f'        <li><a href="#{html_lib.escape(hid)}">{html_lib.escape(label)}</a></li>')
    return "\n" + "\n".join(lines) + "\n      "


TOC_ASIDE_RE = re.compile(
    r'\s*<aside class="velin-doc-toc"[^>]*>.*?</aside>',
    re.DOTALL | re.IGNORECASE,
)


def patch_file(path: Path) -> str | None:
    text = path.read_text(encoding="utf-8")
    if "velin-doc-main" not in text:
        return None
    m = MAIN_RE.search(text)
    if not m:
        return None
    new_inner, headings = rewrite_main_with_ids(m.group(2))
    text = text[: m.start(2)] + new_inner + text[m.end(2) :]
    new_list = toc_html(headings)
    if new_list is None:
        text2 = TOC_ASIDE_RE.sub("", text, count=1)
        if text2 == path.read_text(encoding="utf-8"):
            return "unchanged"
        path.write_text(text2, encoding="utf-8")
        return "removed empty TOC"
    toc_m = TOC_LIST_RE.search(text)
    if not toc_m:
        aside = (
            '\n    <aside class="velin-doc-toc" aria-label="On this page">'
            '<div class="velin-doc-toc__title">On this page</div>'
            f'<ul class="velin-doc-toc__list">{new_list}</ul></aside>'
        )
        if "</main>" not in text:
            return None
        text2 = text.replace("</main>", "</main>" + aside, 1)
    else:
        text2 = text[: toc_m.start(2)] + new_list + text[toc_m.end(2) :]
    if text2 == path.read_text(encoding="utf-8"):
        return "unchanged"
    path.write_text(text2, encoding="utf-8")
    return f"{len(headings)} headings"


def main() -> None:
    fixed = 0
    skipped = 0
    for path in sorted(DOCS.rglob("*.html")):
        status = patch_file(path)
        if status is None:
            skipped += 1
            continue
        if status != "unchanged":
            fixed += 1
            print(f"OK  {path.relative_to(DOCS)} ({status})")
    print(f"Rebuilt TOC on {fixed} file(s); skipped {skipped}")


if __name__ == "__main__":
    main()
