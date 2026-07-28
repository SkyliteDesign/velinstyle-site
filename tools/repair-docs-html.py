#!/usr/bin/env python3
"""One-shot repairs: docSearch input, wrong meta descriptions from 0.9.0 template."""
from __future__ import annotations

import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
DOCS = SITE / "docs"
FRAMEWORK = SITE.parent / "velinstyle"


def framework_version() -> str:
    pkg = FRAMEWORK / "package.json"
    try:
        data = json.loads(pkg.read_text(encoding="utf-8"))
        v = str(data.get("version") or "").strip()
        return v or "0.0.0"
    except Exception:
        return "0.0.0"


FRAMEWORK_VERSION = framework_version()

SEARCH_INPUT_RE = re.compile(r"<input[^>]*id=[\"']docSearch[\"'][^>]*>", re.I)
SEARCH_INPUT_REPL = (
    '<input type="search" placeholder="Search docs…" '
    'aria-label="Search documentation" id="docSearch" autocomplete="off" '
    'data-search-index="{idx}">'
)

SEARCH_MODULE_RE = re.compile(
    r'<script\s+type="module"\s+src="[^"]*doc-search\.js"[^>]*>\s*</script>\s*',
    re.I,
)
COMPONENTS_RE = re.compile(
    r'(<script src="[^"]*velinstyle-components\.iife\.js"[^>]*>\s*</script>\s*)',
    re.I,
)
FILE_PROTO_TAG_RE = re.compile(
    r'<script src="[^"]*doc-file-protocol\.js"[^>]*>\s*</script>\s*',
    re.I,
)
INLINE_EXAMPLES_RE = re.compile(
    r"<script>document\.querySelectorAll\(['\"]\.velin-doc-example['\"]\)[\s\S]*?updateToc\(\);</script>\s*",
    re.I,
)
LEGACY_THEME_PICKER_RE = re.compile(
    r"(?:<!-- Theme Picker Widget -->\s*)?"
    r'<div class="velin-theme-picker"[\s\S]*?</script>\s*(?=</body>)',
    re.I,
)
EMPTY_SCRIPT_RE = re.compile(r"<script>\s*</script>\s*", re.I)
DOC_BASE_INLINE = (
    "<script>(function(){var p=location.pathname;if(/\\.html?$/i.test(p))"
    'p=p.replace(/[^\\/]+$/,"");else if(!/\\/$/.test(p))p+="/";'
    'if(!p.startsWith("/"))p="/"+p;'
    'document.write(\'<base href="\'+p+\'">\');})();</script>'
)
COMPONENTS_IIFE_RE = re.compile(
    r'<script src="[^"]*velinstyle-components\.iife\.js"[^>]*>\s*</script>',
    re.I,
)
PRISM_LINK_RE = re.compile(
    r'\s*<link rel="stylesheet" href="https://cdn\.jsdelivr\.net/npm/prismjs[^"]*"[^>]*>\s*',
    re.I,
)
PRISM_SCRIPT_RE = re.compile(
    r'\s*<script src="https://cdn\.jsdelivr\.net/npm/prismjs[^"]*"[^>]*>\s*</script>\s*',
    re.I,
)

DOC_HEADER_VERSION_RE = re.compile(
    r'(<span class="velin-doc-header__version">)v[^<]+(</span>)'
)
UPGRADING_LABEL_RE = re.compile(r"(Upgrading to )\d+\.\d+\.\d+")

META_WRONG = "Responsive layout audit with velinstyle layout audit, suggest, and safe fix"
META_FIXES: dict[str, str] = {
    "guides/performance-audit.html": (
        "Performance audit with velinstyle perf — CLS, lazy-loading, defer scripts, and CI JSON reports."
    ),
    "guides/design-tokens.html": (
        "Validate and build design tokens JSON into CSS custom properties — fonts, motion, and themes."
    ),
    "guides/api-reference.html": (
        "Generated API reference from velinstyle docs generate — components, tokens, utilities, and CLI."
    ),
    "components/email.html": (
        "velin-email Web Component — reveal obfuscated addresses on click with accessible mailto links."
    ),
    "components/secure-field.html": (
        "velin-secure-field — optional client-side encoding helper; TLS required in production."
    ),
}


def search_index_attr(rel: Path) -> str:
    depth = len(rel.parts) - 1
    prefix = "../" * depth if depth else ""
    return prefix + "search-index.json"


def repair_search_input(text: str, idx: str) -> str:
    if 'id="docSearch"' not in text and "id='docSearch'" not in text:
        return text
    return SEARCH_INPUT_RE.sub(SEARCH_INPUT_REPL.format(idx=idx), text, count=1)


def dedupe_script_tags(text: str, filename: str) -> str:
    tag_re = re.compile(
        rf'<script src="[^"]*{re.escape(filename)}"[^>]*>\s*</script>\s*',
        re.I,
    )
    seen = False

    def repl(m: re.Match[str]) -> str:
        nonlocal seen
        if seen:
            return ""
        seen = True
        return m.group(0)

    return tag_re.sub(repl, text)


def repair_scripts(text: str, rel: Path) -> str:
    depth = len(rel.parts) - 1
    prefix = "../" * depth if depth else ""
    block = (
        f'<script src="{prefix}assets/doc-search.iife.js" defer></script>\n  '
        f'<script src="{prefix}doc-examples.js" defer></script>\n  '
    )
    text = SEARCH_MODULE_RE.sub("", text)
    if "doc-search.iife.js" not in text and COMPONENTS_RE.search(text):
        text = COMPONENTS_RE.sub(r"\1" + block, text, count=1)
    elif "doc-examples.js" not in text and f'<script src="{prefix}doc-nav.js"></script>' in text:
        text = text.replace(
            f'<script src="{prefix}doc-nav.js"></script>',
            f'<script src="{prefix}doc-nav.js"></script>\n  '
            f'<script src="{prefix}doc-examples.js" defer></script>',
            1,
        )
    text = FILE_PROTO_TAG_RE.sub("", text)
    for name in ("doc-search.iife.js", "doc-examples.js", "doc-highlight.iife.js"):
        text = dedupe_script_tags(text, name)
    if "doc-examples.js" in text:
        text = INLINE_EXAMPLES_RE.sub("", text)
    return text


def inject_doc_base(text: str) -> str:
    if "document.write('<base href" in text:
        return text
    return text.replace("<head>", "<head>\n  " + DOC_BASE_INLINE, 1)


def inject_icons_init(text: str, rel: Path) -> str:
    depth = len(rel.parts) - 1
    prefix = "../" * depth if depth else ""
    tag = f'<script src="{prefix}doc-icons-init.js"></script>\n  '
    if "doc-icons-init.js" in text:
        return text
    m = COMPONENTS_IIFE_RE.search(text)
    if not m:
        return text
    return text[: m.start()] + m.group(0) + "\n  " + tag.strip() + "\n  " + text[m.end() :]


def inject_doc_chrome(text: str, rel: Path) -> str:
    depth = len(rel.parts) - 1
    prefix = "../" * depth if depth else ""
    tag = f'<script src="{prefix}doc-chrome.js"></script>\n  '
    if "doc-chrome.js" in text:
        return text
    for old in ("doc-md-viewer.js", "doc-nav.js"):
        text = re.sub(
            rf'<script src="[^"]*{re.escape(old)}"[^>]*>\s*</script>\s*',
            "",
            text,
            flags=re.I,
        )
    anchor = f'<script src="{prefix}doc-theme.js"></script>'
    if anchor in text:
        return text.replace(anchor, tag + anchor, 1)
    return text


def inject_highlight_bundle(text: str, rel: Path) -> str:
    depth = len(rel.parts) - 1
    prefix = "../" * depth if depth else ""
    tag = f'<script src="{prefix}assets/doc-highlight.iife.js" defer></script>\n  '
    if "doc-highlight.iife.js" in text:
        return text
    anchor = f'<script src="{prefix}doc-icons-init.js"></script>'
    if anchor in text:
        return text.replace(anchor, anchor + "\n  " + tag.strip() + "\n  ", 1)
    anchor2 = COMPONENTS_IIFE_RE.search(text)
    if anchor2:
        return (
            text[: anchor2.end()]
            + "\n  "
            + tag.strip()
            + "\n  "
            + text[anchor2.end() :]
        )
    return text


def strip_prism_cdn(text: str) -> str:
    text = PRISM_LINK_RE.sub("\n", text)
    prev = None
    while prev != text:
        prev = text
        text = PRISM_SCRIPT_RE.sub("", text)
    return text


def repair_meta(text: str, rel: str) -> str:
    if rel not in META_FIXES:
        return text
    if META_WRONG not in text:
        return text
    desc = META_FIXES[rel].replace('"', "&quot;")
    return re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{desc}"',
        text,
        count=1,
    )


def bump_visible_version(text: str) -> str:
    text = DOC_HEADER_VERSION_RE.sub(rf"\g<1>v{FRAMEWORK_VERSION}\g<2>", text)
    text = UPGRADING_LABEL_RE.sub(rf"\g<1>{FRAMEWORK_VERSION}", text)
    text = text.replace("0.9.0 extension", FRAMEWORK_VERSION)
    return text


def main() -> None:
    n_search = n_meta = n_picker = n_prism = 0
    for html in sorted(DOCS.rglob("*.html")):
        rel = html.relative_to(DOCS)
        text = html.read_text(encoding="utf-8")
        orig = text
        if "prismjs" in text:
            n_prism += 1
        text = strip_prism_cdn(text)
        text = inject_doc_base(text)
        text = repair_search_input(text, search_index_attr(rel))
        text = repair_scripts(text, rel)
        text = inject_icons_init(text, rel)
        text = inject_highlight_bundle(text, rel)
        text = inject_doc_chrome(text, rel)
        text = repair_meta(text, rel.as_posix())
        text = bump_visible_version(text)
        if "velin-theme-picker" in text:
            text = LEGACY_THEME_PICKER_RE.sub("", text)
            n_picker += 1
        text = EMPTY_SCRIPT_RE.sub("", text)
        if text != orig:
            html.write_text(text, encoding="utf-8")
            if 'data-search-index="' in orig and orig.count('data-search-index="') > 1:
                n_search += 1
            if META_WRONG in orig:
                n_meta += 1
    print(
        f"Repaired: {n_prism} pages stripped of Prism CDN, "
        f"{n_picker} legacy theme pickers removed, "
        f"{n_search} search inputs, {n_meta} meta descriptions"
    )


if __name__ == "__main__":
    main()
