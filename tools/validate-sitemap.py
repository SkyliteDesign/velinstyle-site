#!/usr/bin/env python3
"""Validate sitemap XML and optional live HTTP checks for velinstyle.info."""
from __future__ import annotations

import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
SITEMAP = SITE / "sitemap.xml"
INDEX = SITE / "sitemap-index.xml"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def check_xml(path: Path) -> list[str]:
    errors: list[str] = []
    raw = path.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        errors.append(f"{path.name}: UTF-8 BOM — remove before upload")
    try:
        root = ET.fromstring(raw.decode("utf-8"))
    except ET.ParseError as e:
        errors.append(f"{path.name}: invalid XML — {e}")
        return errors
    tag = root.tag.split("}")[-1]
    if tag == "urlset":
        locs = root.findall(".//sm:loc", NS)
        if not locs:
            errors.append(f"{path.name}: urlset has no <loc>")
        for loc in locs[:5]:
            if not (loc.text or "").startswith("https://"):
                errors.append(f"{path.name}: non-HTTPS loc: {loc.text!r}")
    elif tag == "sitemapindex":
        for loc in root.findall(".//sm:loc", NS):
            if not loc.text:
                errors.append(f"{path.name}: empty sitemap <loc>")
    else:
        errors.append(f"{path.name}: unknown root <{tag}>")
    return errors


def check_live(url: str, *, expect_xml: bool = True) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": "Googlebot"})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            body = r.read(8192)
            ct = r.headers.get("Content-Type", "")
            if r.status != 200:
                return f"HTTP {r.status}"
            if not expect_xml:
                if b"Sitemap:" not in body and b"sitemap" not in body.lower():
                    return "robots.txt missing Sitemap directive"
                return None
            if b"<?xml" not in body[:200] and b"<urlset" not in body[:500] and b"<sitemapindex" not in body[:500]:
                return f"not XML (Content-Type: {ct})"
            if "html" in ct.lower() and "xml" not in ct.lower():
                return f"HTML instead of XML (Content-Type: {ct})"
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code}"
    except Exception as e:
        return type(e).__name__
    return None


def main() -> int:
    errors: list[str] = []
    for path in (SITEMAP, INDEX):
        if not path.is_file():
            errors.append(f"missing file: {path}")
        else:
            errors.extend(check_xml(path))

    if SITEMAP.is_file():
        urls = re.findall(r"<loc>([^<]+)</loc>", SITEMAP.read_text(encoding="utf-8"))
        print(f"OK  {SITEMAP.name}: {len(urls)} URLs, XML valid")

    live = "--live" in sys.argv
    if live:
        checks = (
            ("https://velinstyle.info/sitemap.xml", True),
            ("https://velinstyle.info/sitemap-index.xml", True),
            ("https://velinstyle.info/robots.txt", False),
        )
        for u, expect_xml in checks:
            err = check_live(u, expect_xml=expect_xml)
            if err:
                errors.append(f"live {u}: {err}")
            else:
                print(f"OK  live {u}")

    if errors:
        print("\nIssues:")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("\nAll checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
