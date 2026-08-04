#!/usr/bin/env python3
"""Generate sitemap.xml (index) and per-domain urlset sitemaps for velinstyle-site."""
from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

SITE = Path(__file__).resolve().parents[1]

DOMAINS = [
    "https://velinstyle.info",
    "https://velinstyle.de",
    "https://velinstyle.eu",
    "https://velinstyle.org",
    "https://velinstyle.store",
]

PRIMARY = "https://velinstyle.info"

# Section index.html files that only redirect — omit from sitemap.
REDIRECT_INDEX_SUFFIXES = {
    "docs/about/index.html",
    "docs/animations/index.html",
    "docs/components/index.html",
    "docs/content/index.html",
    "docs/customize/index.html",
    "docs/extend/index.html",
    "docs/forms/index.html",
    "docs/getting-started/index.html",
    "docs/helpers/index.html",
    "docs/layout/index.html",
    "docs/utilities/index.html",
}

EXCLUDE_DIR_PARTS = {"tools", "node_modules", ".git", "dist", "atelier", "showcase-reihe", "transparency-report"}

# Atelier is excluded from the walk (thousands of SEO landings) — index these hubs explicitly.
ATELIER_SITEMAP_PATHS = [
    "atelier/index.html",
    "atelier/index.de.html",
    "atelier/library/index.html",
]

PRIORITY_RULES: list[tuple[str, str, str]] = [
    ("index.html", "1.0", "weekly"),
    ("/atelier/index.html", "0.95", "weekly"),
    ("/atelier/index.de.html", "0.95", "weekly"),
    ("/atelier/library/", "0.92", "weekly"),
    ("/atelier/", "0.9", "weekly"),
    ("/showcase/", "0.9", "weekly"),
    ("/demos/index.html", "0.9", "weekly"),
    ("/demos/", "0.85", "weekly"),
    ("/docs/getting-started/introduction.html", "0.95", "weekly"),
    ("/docs/getting-started/einfuehrung.html", "0.95", "weekly"),
    ("/docs/guides/feature-scope.html", "0.9", "weekly"),
    ("/docs/guides/transparency.html", "0.9", "weekly"),
    ("/docs/guides/transparency-leitfaden.html", "0.9", "weekly"),
    ("/docs/guides/velin-search.html", "0.88", "monthly"),
    ("/docs/guides/html-attributes.html", "0.88", "monthly"),
    ("/docs/extend/web-components.html", "0.88", "monthly"),
    ("/docs/getting-started/accessibility.html", "0.9", "weekly"),
    ("/docs/changelog.html", "0.85", "weekly"),
    ("/docs/migration.html", "0.85", "monthly"),
    ("/docs/generated/index.html", "0.75", "monthly"),
    ("/docs/", "0.8", "monthly"),
]

def path_to_url_path(rel: str) -> str:
    rel = rel.replace("\\", "/")
    if rel == "index.html":
        return "/"
    return "/" + rel


def priority_for(path: str) -> tuple[str, str]:
    url_path = path_to_url_path(path)
    for prefix, pri, freq in PRIORITY_RULES:
        if prefix == "index.html" and path == "index.html":
            return pri, freq
        if prefix != "index.html" and url_path.startswith(prefix) or url_path == prefix.rstrip("/"):
            return pri, freq
    return "0.7", "monthly"


def collect_paths() -> list[str]:
    paths: list[str] = []

    for root, dirs, files in os.walk(SITE):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIR_PARTS]
        rel_root = Path(root).relative_to(SITE).as_posix()

        for name in files:
            rel = f"{rel_root}/{name}" if rel_root != "." else name
            rel = rel.replace("\\", "/")

            if rel.startswith("tools/"):
                continue
            if not name.endswith(".html"):
                continue
            if rel in REDIRECT_INDEX_SUFFIXES:
                continue
            if "preview" in name.lower():
                continue
            paths.append(rel)

    for rel in ATELIER_SITEMAP_PATHS:
        if (SITE / rel.replace("/", os.sep)).is_file():
            paths.append(rel)

    # Stable sort: home first, then alphabetical
    def sort_key(p: str) -> tuple:
        if p == "index.html":
            return (0, p)
        if p.startswith("atelier/"):
            return (1, p)
        if p.startswith("demos/"):
            return (2, p)
        if p.startswith("docs/getting-started/"):
            return (3, p)
        return (4, p)

    return sorted(set(paths), key=sort_key)


def lastmod_iso(path: Path) -> str:
    ts = path.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")


def hreflang_links(domain: str, rel: str) -> str:
    """Alternate en/de for intro pages (same host)."""
    if rel == "docs/getting-started/introduction.html":
        self_lang, other_lang = "en", "de"
        other_rel = "docs/getting-started/einfuehrung.html"
    elif rel == "docs/getting-started/einfuehrung.html":
        self_lang, other_lang = "de", "en"
        other_rel = "docs/getting-started/introduction.html"
    else:
        return ""
    self_url = f"{domain}{path_to_url_path(rel)}"
    other_url = f"{domain}{path_to_url_path(other_rel)}"
    default_url = f"{PRIMARY}{path_to_url_path('docs/getting-started/introduction.html')}"
    return (
        f'    <xhtml:link rel="alternate" hreflang="{self_lang}" href="{escape(self_url)}"/>\n'
        f'    <xhtml:link rel="alternate" hreflang="{other_lang}" href="{escape(other_url)}"/>\n'
        f'    <xhtml:link rel="alternate" hreflang="x-default" href="{escape(default_url)}"/>'
    )


def write_urlset(domain: str, paths: list[str], out: Path) -> None:
    xmlns = (
        'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    )
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<urlset {xmlns}>',
    ]
    for rel in paths:
        url_path = path_to_url_path(rel)
        loc = f"{domain}{url_path}" if url_path != "/" else f"{domain}/"
        pri, freq = priority_for(rel)
        lm = lastmod_iso(SITE / rel.replace("/", os.sep))
        alt = hreflang_links(domain, rel)
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(loc)}</loc>")
        if alt:
            lines.append(alt)
        lines.append(f"    <lastmod>{lm}</lastmod>")
        lines.append(f"    <changefreq>{freq}</changefreq>")
        lines.append(f"    <priority>{pri}</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_sitemap_index(out: Path, base_domain: str) -> None:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for domain in DOMAINS:
        host = domain.replace("https://", "")
        loc = f"{base_domain}/sitemaps/{host}.xml"
        lines.append("  <sitemap>")
        lines.append(f"    <loc>{escape(loc)}</loc>")
        lines.append(f"    <lastmod>{today}</lastmod>")
        lines.append("  </sitemap>")
    lines.append("</sitemapindex>")
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_robots(out: Path) -> None:
    """robots.txt — one canonical sitemap URL for .info (avoids 404 child sitemaps on partial deploy)."""
    lines = [
        "# VelinStyle — public HTML only (see sitemap.xml)",
        "User-agent: *",
        "Allow: /",
        "Disallow: /tools/",
        "Disallow: /docs/dist/",
        "",
        f"Sitemap: {PRIMARY}/sitemap.xml",
        "",
    ]
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    paths = collect_paths()
    sitemaps_dir = SITE / "sitemaps"
    sitemaps_dir.mkdir(exist_ok=True)

    for domain in DOMAINS:
        host = domain.replace("https://", "")
        out = sitemaps_dir / f"{host}.xml"
        write_urlset(domain, paths, out)
        print(f"wrote {out.relative_to(SITE)} ({len(paths)} URLs)")

    # Root index (same file works on every mirror domain)
    # Root sitemap = primary domain urlset (correct locs for velinstyle.info / GSC)
    write_urlset(PRIMARY, paths, SITE / "sitemap.xml")

    # Master index of all domain urlsets (optional overview)
    write_sitemap_index(SITE / "sitemap-index.xml", PRIMARY)

    # Per-domain sitemap index (single entry) — submit as https://{host}/sitemaps/sitemap-index-{host}.xml
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for domain in DOMAINS:
        host = domain.replace("https://", "")
        loc = f"{domain}/sitemaps/{host}.xml"
        idx = sitemaps_dir / f"sitemap-index-{host}.xml"
        idx.write_text(
            "\n".join(
                [
                    '<?xml version="1.0" encoding="UTF-8"?>',
                    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                    "  <sitemap>",
                    f"    <loc>{escape(loc)}</loc>",
                    f"    <lastmod>{today}</lastmod>",
                    "  </sitemap>",
                    "</sitemapindex>",
                    "",
                ]
            ),
            encoding="utf-8",
        )

    n = len(paths)
    readme = sitemaps_dir / "README.md"
    readme.write_text(
        f"""# Sitemaps (generated)

Run `npm run generate:sitemaps` or `python tools/generate-sitemaps.py` from the site repo root.

**SEO:** urlset contains **HTML pages only** (no `.md` — those 404 on nginx). Upload to the webroot:

- `sitemap.xml`
- `robots.txt`
- optional: entire `sitemaps/` folder for mirror TLDs

| Domain | Google Search Console — Sitemap-URL |
| --- | --- |
| velinstyle.info | `https://velinstyle.info/sitemap.xml` ({n} URLs) |
| velinstyle.de | `https://velinstyle.de/sitemaps/velinstyle.de.xml` (after deploy) |
| velinstyle.eu | `https://velinstyle.eu/sitemaps/velinstyle.eu.xml` |
| velinstyle.org | `https://velinstyle.org/sitemaps/velinstyle.org.xml` |
| velinstyle.store | `https://velinstyle.store/sitemaps/velinstyle.store.xml` |

### Google Search Console (velinstyle.info)

1. Property must be **URL prefix** `https://velinstyle.info` (not `http://`, not `www` unless that host exists).
2. Submit **only** `https://velinstyle.info/sitemap.xml` (181 HTML URLs).
3. Do **not** submit `sitemap-index.xml` unless the whole `sitemaps/` folder is on the server (FTP).
4. After FTP upload, run `python tools/validate-sitemap.py --live`.
5. In GSC: remove old failed sitemap entries, wait 24h, re-submit.

Optional nginx MIME types: see `deploy/nginx-sitemap.conf`.
""",
        encoding="utf-8",
    )

    write_robots(SITE / "robots.txt")

    print(f"total URLs: {len(paths)}")
    print(f"wrote {SITE / 'sitemap.xml'} ({PRIMARY} urlset)")
    print(f"wrote {SITE / 'sitemap-index.xml'} (all domains)")
    print(f"wrote {SITE / 'robots.txt'}")


if __name__ == "__main__":
    main()
