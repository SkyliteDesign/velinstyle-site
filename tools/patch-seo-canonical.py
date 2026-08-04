#!/usr/bin/env python3
"""Canonical URLs, consistent meta description, JSON-LD, and llms.txt for velinstyle.info."""
from __future__ import annotations

import html
import json
import os
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
CANONICAL_BASE = "https://velinstyle.info"
FRAMEWORK = SITE.parent / "velinstyle"


def framework_version() -> str:
    pkg = FRAMEWORK / "package.json"
    try:
        data = json.loads(pkg.read_text(encoding="utf-8"))
        v = str(data.get("version") or "").strip()
        return v or "0.0.0"
    except Exception:
        return "0.0.0"


def component_counts() -> tuple[int, int]:
    """Canonical and lazy-loader component counts from the framework agent bundle."""
    bundle = FRAMEWORK / "dist" / "velin-agent.json"
    try:
        components = json.loads(bundle.read_text(encoding="utf-8")).get("components") or {}
        canonical = int(components.get("count") or 0)
        loaders = int(components.get("loaderCount") or 0)
        if canonical and loaders:
            return canonical, loaders
    except Exception:
        pass
    return 0, 0


FRAMEWORK_VERSION = framework_version()
CANONICAL_COMPONENTS, LOADER_COMPONENTS = component_counts()

KERNEL_EN = (
    "VelinStyle is the WCAG 2.2 AAA CSS framework with native JavaScript "
    "runtime and Web Components."
)
KERNEL_DE = (
    "VelinStyle ist das WCAG-2.2-AAA-CSS-Framework mit nativer JavaScript-Runtime "
    "und Web Components."
)

# Distinct titles/blurbs so scrapers/agents do not conflate Atelier home with the library hub.
PAGE_TITLES = {
    "atelier/index.html": "VelinStyle Atelier – 2638 Production-Ready Interfaces",
    "atelier/index.de.html": "VelinStyle Atelier – 2638 produktionsreife Interfaces",
    "atelier/library/index.html": "VelinStyle Atelier Library – Browse 2638 UI Templates",
}
PAGE_DESCRIPTIONS = {
    "atelier/index.html": (
        "Explore more than 2638 production-ready interfaces built with VelinStyle. "
        "Authentication, dashboards, shops, forums, SaaS, marketing pages, forms and more."
    ),
    "atelier/index.de.html": (
        "Entdecke über 2638 produktionsreife Interfaces mit VelinStyle. "
        "Authentication, Dashboards, Shops, Foren, SaaS, Marketing-Seiten, Formulare und mehr."
    ),
    "atelier/library/index.html": (
        "Browse 2638 production-ready UI templates in the VelinStyle Atelier library — "
        "Studio, Apps, Recipes, quality tiers, tags, and WebP previews."
    ),
}

REDIRECT_CANONICAL = {
    "docs/about/index.html": "docs/about/overview.html",
    "docs/animations/index.html": "docs/animations/overview.html",
    "docs/components/index.html": "docs/components/accordion.html",
    "docs/content/index.html": "docs/content/reboot.html",
    "docs/customize/index.html": "docs/customize/overview.html",
    "docs/extend/index.html": "docs/extend/approach.html",
    "docs/forms/index.html": "docs/forms/overview.html",
    "docs/getting-started/index.html": "docs/getting-started/introduction.html",
    "docs/helpers/index.html": "docs/helpers/clearfix.html",
    "docs/layout/index.html": "docs/layout/breakpoints.html",
    "docs/utilities/index.html": "docs/utilities/api.html",
}

# atelier/library is a junction → showcase-reihe/04-…; public canonical must stay /atelier/library/
SHOWCASE_LIBRARY_PREFIX = "showcase-reihe/04-premium-ui-showcase-collection/"
ATELIER_LIBRARY_PREFIX = "atelier/library/"


def public_rel(rel: str) -> str:
    """Map on-disk showcase library paths to the public Atelier library URL."""
    rel = rel.replace("\\", "/")
    if rel.startswith(SHOWCASE_LIBRARY_PREFIX):
        return ATELIER_LIBRARY_PREFIX + rel[len(SHOWCASE_LIBRARY_PREFIX) :]
    if rel.rstrip("/") == SHOWCASE_LIBRARY_PREFIX.rstrip("/"):
        return ATELIER_LIBRARY_PREFIX.rstrip("/") + "/"
    return rel

SEO_BLOCK_START = "<!-- velin-seo -->"
SEO_BLOCK_END = "<!-- /velin-seo -->"

EXCLUDE_DIRS = {"tools", "node_modules", ".git"}


def canonical_url(rel: str) -> str:
    rel = public_rel(rel.replace("\\", "/"))
    rel = REDIRECT_CANONICAL.get(rel, rel)
    if rel == "index.html":
        return f"{CANONICAL_BASE}/"
    return f"{CANONICAL_BASE}/{rel}"


def page_lang(rel: str, content: str) -> str:
    if "einfuehrung" in rel:
        return "de"
    if re.search(r'<html[^>]*\slang=["\']de["\']', content[:800], re.I):
        return "de"
    return "en"


def json_ld(url: str, description: str, *, home: bool = False) -> str:
    app = {
        "@type": "SoftwareApplication",
        "name": "VelinStyle",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "description": description,
        "url": url,
        "softwareVersion": FRAMEWORK_VERSION,
        "license": "https://opensource.org/licenses/MIT",
        "isAccessibleForFree": True,
        "publisher": {"@type": "Organization", "name": "SkyliteDesign"},
    }
    if home:
        data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "name": "VelinStyle",
                    "url": CANONICAL_BASE + "/",
                    "description": description,
                    "inLanguage": ["en", "de"],
                },
                app,
            ],
        }
    else:
        data = {"@context": "https://schema.org", **app}
    return json.dumps(data, ensure_ascii=False, separators=(",", ": "))


def llms_txt() -> str:
    return f"""# VelinStyle {FRAMEWORK_VERSION}

> {KERNEL_EN}
> Full machine context: {CANONICAL_BASE}/dist/velin-agent.json
> MIME: application/vnd.velinstyle.meta+json

## Framework
- npm: @birdapi/velinstyle
- {KERNEL_EN}
- Components: {CANONICAL_COMPONENTS} canonical Web Components (`velin-*`); {LOADER_COMPONENTS} lazy-loader entries
- HTML attributes: 27 `velin-*` bridges
- CSS: utility-first `velin-*` classes + OKLCH tokens (WCAG 2.2 AAA defaults)
- Runtime: native JavaScript modules (search, motion, highlight, attributes, meta, a11y)
- CLI: velinstyle (scan, scaffold, docs generate, search index, meta)

## Conventions
- Positioning: one product — WCAG 2.2 AAA CSS framework with native JS runtime and Web Components.
- Use only velin-* utility classes and documented Web Components.
- Prefer data-velin-theme on <html> for theme switching.
- Run velinstyle scan on generated HTML before shipping.
- Do not put secrets, API keys, or raw emails in velin-meta or page meta.
- Resolve doc links against docs root (/docs/), not the current page folder.
- Canonical site: {CANONICAL_BASE}

## Key guides
- [Introduction]({CANONICAL_BASE}/docs/getting-started/introduction.html)
- [Einführung (DE)]({CANONICAL_BASE}/docs/getting-started/einfuehrung.html)
- [Velin-Meta]({CANONICAL_BASE}/docs/guides/velin-meta.html)
- [VelinSearch]({CANONICAL_BASE}/docs/guides/velin-search.html)
- [Syntax highlighting]({CANONICAL_BASE}/docs/guides/syntax-highlight.html)
- [API reference (generated)]({CANONICAL_BASE}/docs/guides/api-reference.html)

## Atelier (do not conflate)
- [Atelier home]({CANONICAL_BASE}/atelier/index.html) — 2638 production-ready interfaces + showcases (NOT the template grid)
- [Atelier library]({CANONICAL_BASE}/atelier/library/index.html) — browse/filter the 2638-template hub
- Canonical library URL is always `/atelier/library/` (not `showcase-reihe/04-…`)

## Generated reference
- [Components index]({CANONICAL_BASE}/docs/generated/components/README.md)
- [Tokens]({CANONICAL_BASE}/docs/generated/tokens/README.md)
- [Utilities]({CANONICAL_BASE}/docs/generated/utilities/README.md)
- [CLI commands]({CANONICAL_BASE}/docs/generated/cli/commands.md)

## Usage for agents
```
npx velinstyle meta
npx velinstyle docs generate
npx velinstyle search index
```
"""


def patch_agent_json(path: Path) -> None:
    if not path.is_file():
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    fw = data.setdefault("framework", {})
    fw["homepage"] = CANONICAL_BASE
    fw["tagline"] = KERNEL_EN
    comp = data.get("components", {})
    tags = comp.get("tags") or []
    helpers = set(comp.get("helpers") or ["velin-flip", "velin-haptic", "velin-reveal"])
    canonical = [
        t
        for t in tags
        if not t.endswith("-wc") and t not in helpers
    ]
    if canonical:
        comp["tags"] = canonical
        comp["count"] = len(canonical)
    attrs = data.get("attributes", {})
    if attrs.get("names"):
        attrs["count"] = len(attrs["names"])
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"patched {path.relative_to(SITE)}")


def build_seo_block(url: str, description: str, rel: str) -> str:
    agent_href = "/dist/velin-agent.json"
    llms_href = "/dist/llms.txt"
    if rel.startswith("docs/"):
        up = rel.count("/")  # docs/a/b.html -> ../../
        prefix = "/".join([".."] * up) if up else "."
        agent_href = f"{prefix}/dist/velin-agent.json"
        llms_href = f"{prefix}/dist/llms.txt"
    elif rel.startswith("demos/"):
        agent_href = "../dist/velin-agent.json"
        llms_href = "../dist/llms.txt"

    home = rel == "index.html"
    ld = json_ld(url, description, home=home)

    return (
        f"  {SEO_BLOCK_START}\n"
        f'  <link rel="canonical" href="{html.escape(url, quote=True)}">\n'
        f'  <meta name="description" content="{html.escape(description, quote=True)}">\n'
        f'  <link rel="alternate" type="application/vnd.velinstyle.meta+json" '
        f'href="{agent_href}" title="VelinStyle agent metadata">\n'
        f'  <link rel="alternate" type="text/plain" href="{llms_href}" title="VelinStyle llms.txt">\n'
        f'  <script type="application/ld+json">{ld}</script>\n'
        f"  {SEO_BLOCK_END}\n"
    )


def patch_html(path: Path, rel: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if "<head" not in text:
        return False

    lang = page_lang(rel, text)
    public = public_rel(rel)
    description = (
        PAGE_DESCRIPTIONS.get(public)
        or PAGE_DESCRIPTIONS.get(rel)
        or (KERNEL_DE if lang == "de" else KERNEL_EN)
    )
    url = canonical_url(rel)

    text = re.sub(r"\s*<link rel=\"canonical\"[^>]*>\s*", "\n", text, flags=re.I)
    text = re.sub(r"\s*<meta name=\"description\"[^>]*>\s*", "\n", text, flags=re.I)
    text = re.sub(
        rf"\s*{re.escape(SEO_BLOCK_START)}.*?{re.escape(SEO_BLOCK_END)}\s*",
        "\n",
        text,
        flags=re.S,
    )
    text = re.sub(
        r'\s*<link rel="alternate" type="application/vnd\.velinstyle\.meta\+json"[^>]*>\s*',
        "\n",
        text,
        flags=re.I,
    )
    text = re.sub(
        r'\s*<link rel="alternate" type="text/plain" href="[^"]*llms\.txt"[^>]*>\s*',
        "\n",
        text,
        flags=re.I,
    )

    block = build_seo_block(url, description, rel)
    if re.search(r'<meta name="viewport"', text, re.I):
        text = re.sub(
            r"(<meta name=\"viewport\"[^>]*>)",
            r"\1\n" + block,
            text,
            count=1,
            flags=re.I,
        )
    elif re.search(r"<meta charset", text, re.I):
        text = re.sub(
            r"(<meta charset[^>]*>)",
            r"\1\n" + block,
            text,
            count=1,
            flags=re.I,
        )
    else:
        return False

    if "og:description" in text:
        text = re.sub(
            r'<meta property="og:description" content="[^"]*"',
            f'<meta property="og:description" content="{html.escape(description, quote=True)}"',
            text,
            count=1,
        )
    if "og:url" in text:
        text = re.sub(
            r'<meta property="og:url" content="[^"]*"',
            f'<meta property="og:url" content="{html.escape(url, quote=True)}"',
            text,
            count=1,
        )

    page_title = PAGE_TITLES.get(public) or PAGE_TITLES.get(rel)
    if page_title:
        text = re.sub(
            r"<title>[^<]*</title>",
            f"<title>{html.escape(page_title)}</title>",
            text,
            count=1,
        )
    elif rel == "index.html":
        text = re.sub(
            r"<title>[^<]*</title>",
            "<title>VelinStyle — WCAG 2.2 AAA CSS Framework with Web Components</title>",
            text,
            count=1,
        )
        text = re.sub(
            r'<p class="hero__subtitle">[\s\S]*?</p>',
            f"        <p class=\"hero__subtitle\">\n          {html.escape(description, quote=False)}\n"
            f"          35+ CSS components, {CANONICAL_COMPONENTS} Web Components, 27 declarative HTML attributes, "
            f"13 OKLCH themes, and agent metadata (<code>velin-agent.json</code>, <code>llms.txt</code>).\n"
            f"        </p>",
            text,
            count=1,
        )

    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    patched = 0
    for root, dirs, files in os.walk(SITE):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for name in files:
            if not name.endswith(".html"):
                continue
            rel_root = Path(root).relative_to(SITE).as_posix()
            rel = f"{rel_root}/{name}" if rel_root != "." else name
            if rel.startswith("tools/"):
                continue
            if patch_html(SITE / rel.replace("/", os.sep), rel):
                patched += 1

    llms = llms_txt()
    for dest in (SITE / "dist" / "llms.txt", SITE / "docs" / "dist" / "llms.txt"):
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(llms, encoding="utf-8")
        print(f"wrote {dest.relative_to(SITE)}")

    for agent in (SITE / "dist" / "velin-agent.json", SITE / "docs" / "dist" / "velin-agent.json"):
        patch_agent_json(agent)

    print(f"patched {patched} HTML files with canonical + JSON-LD")


if __name__ == "__main__":
    main()
