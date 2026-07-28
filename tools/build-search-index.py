#!/usr/bin/env python3
"""Build docs/search-index.json — site HTML pages + optional Velin framework index."""
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit

SITE_ROOT = Path(__file__).resolve().parent.parent
DOCS = SITE_ROOT / "docs"
VELIN_ROOT = SITE_ROOT.parent / "velinstyle"
TITLE_RE = re.compile(r"<title>(.*?) · VelinStyle</title>", re.I)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.I)
DESC_RE = re.compile(r'<meta name="description" content="([^"]*)"', re.I)
TAG_RE = re.compile(r"<[^>]+>")
HEADING_RE = re.compile(
    r'<h([23])[^>]*\bid=["\']([^"\']+)["\'][^>]*>(.*?)</h\1>',
    re.I | re.S,
)

# CLI command names from framework index → anchors on docs/extend/cli.html
CLI_ANCHOR_MAP = {
    "tokens": "tokens-build",
    "themes": "configuration",
    "add": "commands",
}


def section_for(path: Path) -> str:
    parts = path.relative_to(DOCS).parts
    if len(parts) < 2:
        return "Docs"
    return parts[0].replace("-", " ").title()


def map_cli_fragment(fragment: str) -> str:
    if not fragment:
        return fragment
    return CLI_ANCHOR_MAP.get(fragment, fragment)


def site_entries() -> list:
    entries = []
    for html in sorted(DOCS.rglob("*.html")):
        if html.name.startswith("_"):
            continue
        text = html.read_text(encoding="utf-8", errors="ignore")
        title_m = TITLE_RE.search(text)
        h1_m = H1_RE.search(text)
        desc_m = DESC_RE.search(text)
        title = TAG_RE.sub("", title_m.group(1)) if title_m else html.stem
        if h1_m:
            title = TAG_RE.sub("", h1_m.group(1))
        desc = desc_m.group(1) if desc_m else ""
        rel = html.relative_to(DOCS).as_posix()
        entries.append({
            "id": f"site:{rel}",
            "title": title,
            "excerpt": desc or section_for(html),
            "url": rel,
            "category": "docs",
            "keywords": [title, rel.replace("/", " "), section_for(html)],
            "weight": 1.05,
        })
        for m in HEADING_RE.finditer(text):
            hid = m.group(2)
            section_title = TAG_RE.sub("", m.group(3)).strip()
            if not section_title or hid in ("main-content", "sidebar", "sidebarToggle"):
                continue
            entries.append({
                "id": f"site:{rel}#{hid}",
                "title": section_title,
                "section": title,
                "excerpt": desc or title,
                "url": f"{rel}#{hid}",
                "category": "docs",
                "keywords": [section_title, hid, title, rel.replace("/", " ")],
                "weight": 1.12,
            })
    return entries


def marketing_page_entries() -> list:
    """Index top-level marketing pages (showcase, demos hub) for site search."""
    pages = [
        (SITE_ROOT / "showcase" / "index.html", "../showcase/index.html", "Showcase", "Live projects built with VelinStyle"),
        (SITE_ROOT / "demos" / "index.html", "../demos/index.html", "Live demos", "Framework demo pages and showcases"),
    ]
    entries = []
    for path, url, fallback_title, fallback_desc in pages:
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        title_m = TITLE_RE.search(text) or re.search(r"<title>(.*?)</title>", text, re.I)
        h1_m = H1_RE.search(text)
        desc_m = DESC_RE.search(text)
        title = TAG_RE.sub("", (h1_m or title_m).group(1)).strip() if (h1_m or title_m) else fallback_title
        desc = desc_m.group(1) if desc_m else fallback_desc
        entries.append({
            "id": f"marketing:{url}",
            "title": title,
            "excerpt": desc,
            "url": url,
            "category": "showcase",
            "keywords": [title, "showcase", "projects", "demos", "live"],
            "weight": 1.15,
        })
    return entries


def generated_md_entries() -> list:
    """Index every synced generated/*.md — opens in VelinDocMd dialog via doc-search."""
    gen = DOCS / "generated"
    if not gen.is_dir():
        return []
    entries = []
    for md in sorted(gen.rglob("*.md")):
        rel = md.relative_to(DOCS).as_posix()
        title = md.stem.replace("-", " ")
        if md.name == "README.md":
            title = rel.replace(".md", "").replace("/", " · ") or "Generated overview"
        section = rel.split("/")[0] if "/" in rel else "generated"
        entries.append({
            "id": f"gen:{rel}",
            "title": title,
            "excerpt": f"Generated reference ({section})",
            "url": rel,
            "category": "api",
            "keywords": [title, rel.replace("/", " "), section, "generated", "markdown"],
            "weight": 1.08,
        })
    return entries


def normalize_entry_url(url: str) -> str:
    """Map framework index paths to velinstyle-site docs layout."""
    if not url:
        return url
    if url.startswith("docs/generated/"):
        return url.replace("docs/generated/", "generated/", 1)
    if url.startswith("docs/"):
        rest = url[5:]
        if rest.startswith("guides/") or rest.startswith("components/"):
            return rest
    return url


def resolve_site_url(url: str) -> str | None:
    """Return a URL that exists on disk, or None to drop from the index."""
    if not url or url.startswith("http"):
        return url if url else None

    path_part, _, fragment = url.partition("#")

    if path_part.startswith("samples/"):
        return None

    if path_part.startswith("generated/"):
        if path_part == "generated/index.html" and (DOCS / path_part).is_file():
            return path_part + (f"#{fragment}" if fragment else "")
        if path_part.startswith("generated/cli/"):
            frag = map_cli_fragment(fragment) if fragment else ""
            return "extend/cli.html" + (f"#{frag}" if frag else "")
        if path_part.startswith("generated/rules/"):
            return "extend/security.html" + (f"#{fragment}" if fragment else "")
        if path_part.startswith("generated/a11y/"):
            return "extend/security.html" + (f"#{fragment}" if fragment else "")
        if path_part.startswith("generated/components/"):
            name = path_part.split("/")[-1].replace(".md", ".html")
            candidate = f"components/{name}"
            if (DOCS / candidate).is_file():
                return candidate + (f"#{fragment}" if fragment else "")
        if fragment:
            return f"generated/index.html#{fragment}"
        return None

    if path_part == "extend/cli.html" and fragment:
        fragment = map_cli_fragment(fragment)

    candidate = path_part
    if (DOCS / candidate).is_file():
        return f"{candidate}#{fragment}" if fragment else candidate

    if not candidate.endswith(".html"):
        with_html = f"{candidate}.html"
        if (DOCS / with_html).is_file():
            return url if fragment else with_html

    return None


def framework_entries() -> list:
    cli = VELIN_ROOT / "cli" / "index.js"
    if not cli.is_file():
        return []
    tmp = SITE_ROOT / "dist" / "search-index.framework.json"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    gen = VELIN_ROOT / "docs" / "generated"
    if not gen.is_dir():
        subprocess.run(
            ["node", str(cli), "docs", "generate", "--scope", "components"],
            cwd=VELIN_ROOT,
            check=False,
        )
    subprocess.run(
        ["node", str(cli), "search", "index", "--out", str(tmp)],
        cwd=VELIN_ROOT,
        check=False,
    )
    if not tmp.is_file():
        return []
    data = json.loads(tmp.read_text(encoding="utf-8"))
    entries = data.get("entries", data if isinstance(data, list) else [])
    out = []
    for e in entries:
        raw = e.get("url")
        if raw:
            e = dict(e)
            e["url"] = normalize_entry_url(raw)
            resolved = resolve_site_url(e["url"])
            if resolved is None:
                continue
            if resolved in ("generated/index.html", "generated/index.html#"):
                continue
            e["url"] = resolved
            if e["url"].startswith("extend/cli.html#"):
                frag = e["url"].split("#", 1)[1]
                mapped = map_cli_fragment(frag)
                if mapped != frag:
                    e["url"] = f"extend/cli.html#{mapped}"
            if e["url"].startswith("extend/"):
                e["category"] = "api"
        out.append(e)
    return out


def main() -> None:
    merged = {}
    for e in site_entries():
        eid = e.get("id") or e.get("url") or e.get("title")
        merged[eid] = e
    for e in marketing_page_entries():
        eid = e.get("id") or e.get("url") or e.get("title")
        merged[eid] = e
    for e in generated_md_entries():
        eid = e.get("id") or e.get("url") or e.get("title")
        merged[eid] = e
    for e in framework_entries():
        eid = e.get("id") or e.get("url") or e.get("title")
        if eid not in merged:
            merged[eid] = e
    payload = {
        "version": 1,
        "entries": list(merged.values()),
    }
    out = DOCS / "search-index.json"
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(payload['entries'])} entries to {out}")


if __name__ == "__main__":
    main()
