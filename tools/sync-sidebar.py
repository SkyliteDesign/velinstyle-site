#!/usr/bin/env python3
"""Replace sidebar nav (icons, pinned, guides) and inject doc scripts."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SITE / "tools"))
from doc_sidebar_de import (  # noqa: E402
    localize_cat,
    localize_href,
    localize_label,
    page_lang,
)

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

SIDEBAR_RE = re.compile(
    r'<nav class="velin-doc-sidebar"[^>]*>.*?</nav>',
    re.DOTALL,
)
SEARCH_TAG_RE = re.compile(
    r'<script(?:\s+type="module")?\s+src="[^"]*(?:doc-search\.js|doc-search\.iife\.js|assets/doc-search\.iife\.js)"[^>]*>\s*</script>\s*',
    re.IGNORECASE,
)
COMPONENTS_TAG_RE = re.compile(
    r'(<script src="[^"]*velinstyle-components\.iife\.js"[^>]*>\s*</script>\s*)',
    re.IGNORECASE,
)
NAV_TAG_RE = re.compile(r'<script src="[^"]*doc-nav\.js"[^>]*></script>\s*')
EXAMPLES_TAG_RE = re.compile(r'<script src="[^"]*doc-examples\.js"[^>]*></script>\s*')
FILE_PROTO_TAG_RE = re.compile(r'<script src="[^"]*doc-file-protocol\.js"[^>]*>\s*</script>\s*')
SEARCH_INPUT_RE = re.compile(r'<input[^>]*id=["\']docSearch["\'][^>]*>', re.IGNORECASE)
HTML_LIGHT_RE = re.compile(r'<html([^>]*)\sdata-velin-theme="light"')
THEME_BTN_RE = re.compile(
    r'<button id="themeToggle"[^>]*>[\s\S]*?</button>',
    re.DOTALL,
)
FOOTER_RE = re.compile(
    r"<footer style=\"text-align:center;[^\"]*\">.*?</footer>",
    re.DOTALL,
)
DOC_TRANSLATE_RE = re.compile(
    r'(?:<label class="velin-doc-translate"[^>]*>.*?</label>\s*)?'
    r'<select id="docTranslateLang"[^>]*>.*?</select>\s*'
    r'<span id="docTranslateStatus"[^>]*></span>\s*',
    re.DOTALL,
)

DOC_FOOTER_INNER = """  <p>&copy; 2026 VelinStyle &middot; <a href="https://github.com/SkyliteDesign/velinstyle" style="color:inherit">GitHub</a> &middot; <a href="https://www.npmjs.com/package/@birdapi/velinstyle" style="color:inherit">npm</a> &middot; MIT License</p>
  <p class="velin-doc-footer__built" style="margin-top:0.75rem;font-size:0.8125rem;max-width:42rem;margin-inline:auto;">
  This documentation site is built entirely with VelinStyle — layout, components, themes, CLI-generated reference, doc search, and syntax highlighting. No third-party CSS framework.
</p>"""

DOC_FOOTER = (
    '<footer style="text-align:center;padding:2rem 1rem;border-top:1px solid var(--velin-color-border,#e5e5e5);'
    'margin-top:3rem;color:var(--velin-color-text-muted,#888);font-size:0.875rem;">\n'
    + DOC_FOOTER_INNER
    + "\n</footer>"
)

PICKER_SCRIPT_RE = re.compile(
    r'<script>\s*\(function\(\)\{const themes=\[.*?\}\)\(\);\s*</script>\s*(?=</body>)',
    re.DOTALL,
)

FA = 'provider="fontawesome" variant="solid"'
FA_BRANDS = 'provider="fontawesome" variant="brands"'
ICON_ALIASES = {
    "sparkles": "wand-magic-sparkles",
    "columns": "table-columns",
    "input-text": "keyboard",
    "slider": "sliders",
    "broadcast-tower": "tower-broadcast",
}
ICON_BRANDS = frozenset({"wordpress", "php", "github"})
DOC_BASE_INLINE = (
    "<script>(function(){var p=location.pathname;if(!/\\/$/.test(p)&&!/\\.html?$/i.test(p))p+=\"/\";"
    'if(!p.startsWith("/"))p="/"+p;document.write(\'<base href="\'+p+\'">\');})();</script>'
)

META_ALTERNATE_RE = re.compile(
    r'<link rel="alternate" type="application/vnd\.velinstyle\.meta\+json"[^>]*>\s*',
    re.I,
)
MD_VIEWER_RE = re.compile(
    r'<script src="[^"]*doc-md-viewer\.js"[^>]*>\s*</script>\s*',
    re.I,
)
NAV_ONLY_RE = re.compile(
    r'<script src="[^"]*doc-nav\.js"[^>]*>\s*</script>\s*',
    re.I,
)
CHROME_RE = re.compile(
    r'<script src="[^"]*doc-chrome\.js"[^>]*>\s*</script>\s*',
    re.I,
)

COMPONENT_SLUGS = [
    "accordion", "alerts", "avatar", "badge", "breadcrumb", "buttons", "button-group",
    "card", "carousel", "chip", "velin-code-block", "close-button", "collapse",
    "announcer", "bottom-nav", "calendar", "combobox", "command", "velin-search", "menubar", "rating",
    "segmented-control", "sheet", "secure-field",
    "dialog", "divider", "drawer", "dropdown", "email", "file-dropzone", "lightbox", "list-group", "modal",
    "navbar", "navs-tabs", "pagination", "popover", "progress", "progress-ring",
    "scrollspy", "spinners", "stat", "stepper", "timeline", "toasts", "tooltips",
    "sparkline", "counter", "copy", "countdown", "data-table", "form-summary", "persist",
    "scroll-top", "live-dot",
]

COMPONENT_LABELS = {
    "announcer": "Announcer", "bottom-nav": "Bottom nav", "calendar": "Calendar", "combobox": "Combobox",
    "command": "Command palette", "velin-search": "Velin Search", "menubar": "Menubar", "rating": "Rating",
    "segmented-control": "Segmented control", "sheet": "Sheet",
    "navs-tabs": "Navs &amp; Tabs", "button-group": "Button Group",
    "close-button": "Close Button", "list-group": "List Group",
    "progress-ring": "Progress Ring",
    "sparkline": "Sparkline", "counter": "Counter", "copy": "Copy",
    "countdown": "Countdown", "persist": "Persist", "scroll-top": "Scroll to top",
    "data-table": "Data table", "form-summary": "Form summary", "file-dropzone": "File dropzone",
    "live-dot": "Live dot",
    "email": "Email", "secure-field": "Secure field", "velin-code-block": "Code block",
}

COMPONENT_ICONS = {
    "accordion": "bars-staggered", "alerts": "triangle-exclamation", "avatar": "circle-user",
    "badge": "certificate", "breadcrumb": "ellipsis", "buttons": "square",
    "button-group": "object-group", "card": "id-card", "carousel": "images", "chip": "tags",
    "velin-code-block": "code",
    "close-button": "xmark", "collapse": "compress", "announcer": "bullhorn",
    "bottom-nav": "bars", "calendar": "calendar-days", "combobox": "list", "command": "terminal", "velin-search": "magnifying-glass",
    "menubar": "bars-progress", "rating": "star", "segmented-control": "table-cells-large",
    "sheet": "sheet-plastic", "dialog": "comment-dots", "divider": "minus", "drawer": "bars",
    "dropdown": "caret-down", "file-dropzone": "cloud-arrow-up", "lightbox": "expand", "list-group": "list-ul",
    "modal": "window-maximize", "navbar": "bars", "navs-tabs": "folder",
    "pagination": "ellipsis", "popover": "comment", "progress": "bars-progress",
    "progress-ring": "circle-notch", "scrollspy": "binoculars", "spinners": "spinner",
    "stat": "chart-simple", "stepper": "shoe-prints", "timeline": "timeline",
    "toasts": "bell", "tooltips": "circle-info",
    "sparkline": "chart-line", "counter": "stopwatch", "copy": "copy",
    "countdown": "hourglass-half", "persist": "floppy-disk", "scroll-top": "arrow-up",
    "data-table": "table", "form-summary": "circle-exclamation",
    "live-dot": "tower-broadcast",
    "email": "envelope", "secure-field": "lock",
}

PINNED_QUICK = [
    ("guides/feature-scope.html", "Feature scope", "layer-group", "guides"),
    ("changelog.html", "Changelog", "clock-rotate-left", "about"),
    ("migration.html", "Migration Guide", "right-left", "migration"),
    ("getting-started/upgrading.html", f"Upgrading to {FRAMEWORK_VERSION}", "arrow-up", "getting-started"),
]

PINNED_GUIDES = [
    ("guides/index.html", "Guides overview", "map", "guides"),
    ("guides/whats-new-extension.html", "Search &amp; Motion", "wand-magic-sparkles", "guides"),
    ("guides/velin-search.html", "VelinSearch", "magnifying-glass", "guides"),
    ("guides/motion-attributes.html", "Motion &amp; attributes", "bolt", "guides"),
    ("guides/syntax-highlight.html", "Syntax highlighting", "code", "guides"),
    ("guides/existing-project.html", "Existing project", "folder-open", "guides"),
    ("guides/react-vite-starter.html", "Vite &amp; React", "code-branch", "guides"),
    ("guides/prompt-scaffolding.html", "Prompt scaffolding", "wand-magic-sparkles", "guides"),
    ("guides/landing-15-min.html", "Landing in 15 min", "rocket", "guides"),
    ("guides/marketing-lite-css.html", "Marketing lite CSS", "gauge-simple", "guides"),
    ("guides/production-build.html", "Production Builder", "rocket", "guides"),
    ("guides/responsive-layout.html", "Responsive layout", "mobile-screen", "guides"),
    ("guides/performance-audit.html", "Performance audit", "gauge-high", "guides"),
    ("guides/design-tokens.html", "Design tokens", "swatchbook", "guides"),
    ("guides/api-reference.html", "API reference", "book", "guides"),
    ("guides/velin-meta.html", "Velin-Meta", "robot", "guides"),
    ("guides/ai-skills.html", "AI Skills", "microchip", "guides"),
    ("guides/transparency.html", "Transparency", "shield-halved", "guides"),
    ("guides/design-intelligence.html", "Design Intelligence", "brain", "guides"),
    ("guides/cli-ship-surface.html", "CLI ship surface", "terminal", "guides"),
    ("guides/blueprints.html", "Blueprints", "puzzle-piece", "guides"),
    ("guides/faq.html", "FAQ", "circle-question", "guides"),
    ("guides/troubleshooting.html", "Troubleshooting", "wrench", "guides"),
    ("guides/deploy.html", "Deploy", "cloud-arrow-up", "guides"),
    ("guides/ecommerce.html", "E-commerce", "cart-shopping", "guides"),
    ("guides/forum-update.html", "Forum update", "comments", "guides"),
    ("generated/index.html", "Generated Markdown", "file-lines", "extend"),
    ("extend/cli.html", "CLI reference", "terminal", "extend"),
    ("layout/patterns.html", "Layout patterns", "table-columns", "layout"),
    ("getting-started/introduction.html", "Introduction", "house", "getting-started"),
]


def rel_prefix(doc_file: Path) -> str:
    depth = len(doc_file.relative_to(DOCS).parts) - 1
    return "../" * depth if depth else ""


def icon_tag(name: str, size: str, css: str) -> str:
    fa_name = ICON_ALIASES.get(name, name)
    fa_attr = FA_BRANDS if fa_name in ICON_BRANDS else FA
    return (
        f'<velin-icon name="{fa_name}" {fa_attr} size="{size}" '
        f'class="{css}" aria-hidden="true"></velin-icon>'
    )


def sidebar_html(rel: str, active_href: str, lang: str = "en") -> str:
    def link(href: str, label: str, icon: str | None = None, *, cat: str | None = None, external: bool = False) -> str:
        en_href = href
        if not external:
            label = localize_label(en_href, label, lang)
            href = localize_href(en_href, lang)
        full = href if external or href.startswith("http") else f"{rel}{href}"
        cls = ""
        if not external and (
            href == active_href
            or en_href == active_href
            or localize_href(en_href, "de") == active_href
        ):
            cls = ' class="active"'
        extra = ' target="_blank" rel="noopener noreferrer" data-external' if external else ""
        dcat = f' data-cat="{cat}"' if cat else ""
        icon_html = icon_tag(icon, "14", "velin-doc-sidebar__icon") if icon else ""
        return (
            f'<li><a href="{full}"{dcat}{cls}{extra}>{icon_html}'
            f'<span class="velin-doc-sidebar__label">{label}</span></a></li>'
        )

    quick = "".join(link(h, l, i, cat=c) for h, l, i, c in PINNED_QUICK)
    guides = "".join(link(h, l, i, cat=c) for h, l, i, c in PINNED_GUIDES)
    pinned_quick_label = "Schnell wechseln" if lang == "de" else "Switch quickly"
    pinned_guides_label = "Framework-Guides" if lang == "de" else "Framework guides"
    pinned = (
        '<div class="velin-doc-sidebar__pinned" data-cat="pinned">'
        f'<p class="velin-doc-sidebar__pinned-label">{pinned_quick_label}</p>'
        f'<ul class="velin-doc-sidebar__links velin-doc-sidebar__links--prominent">{quick}</ul>'
        '<p class="velin-doc-sidebar__pinned-label velin-doc-sidebar__pinned-label--sub">'
        f"{pinned_guides_label}</p>"
        f'<ul class="velin-doc-sidebar__links velin-doc-sidebar__links--prominent">{guides}</ul>'
        "</div>"
    )

    gs = "".join([
        link("getting-started/introduction.html", "Introduction", "house"),
        link("getting-started/download.html", "Download", "download"),
        link("getting-started/contents.html", "Contents", "list"),
        link("getting-started/editor-setup.html", "Editor setup", "laptop-code"),
        link("getting-started/browser-compatibility.html", "Compatibility", "globe"),
        link("getting-started/upgrading.html", "Upgrading", "arrow-up"),
        link("getting-started/states-and-variants.html", "States &amp; variants", "sliders"),
        link("getting-started/accessibility.html", "Accessibility", "wheelchair"),
        link("getting-started/rtl.html", "RTL", "align-right"),
        link("getting-started/a11y-patterns.html", "A11y patterns", "clipboard-list"),
        link("getting-started/a11y-dashboard.html", "A11y Dashboard", "gauge-high"),
    ])
    cu = "".join([
        link("customize/overview.html", "Overview", "palette"),
        link("customize/color.html", "Color", "droplet"),
        link("customize/color-modes.html", "Color Modes", "circle-half-stroke"),
        link("customize/css-variables.html", "CSS Variables", "code"),
        link("customize/components.html", "Components", "cubes"),
        link("customize/optimize.html", "Production build", "gauge-simple"),
    ])
    lo = "".join([
        link("layout/breakpoints.html", "Breakpoints", "mobile-screen"),
        link("layout/containers.html", "Containers", "box"),
        link("layout/grid.html", "Grid", "table-cells"),
        link("layout/patterns.html", "Patterns", "table-columns"),
        link("layout/columns.html", "Columns", "table-columns"),
        link("layout/gutters.html", "Gutters", "grip-lines"),
        link("layout/utilities.html", "Utilities", "ruler-combined"),
        link("layout/z-index.html", "Z-index", "layer-group"),
    ])
    co = "".join([
        link("content/reboot.html", "Reboot", "rotate"),
        link("content/typography.html", "Typography", "font"),
        link("content/images.html", "Images", "image"),
        link("content/tables.html", "Tables", "table"),
        link("content/figures.html", "Figures", "images"),
    ])
    fo = "".join([
        link("forms/overview.html", "Overview", "keyboard"),
        link("forms/form-control.html", "Form Control", "keyboard"),
        link("forms/select.html", "Select", "caret-down"),
        link("forms/checks-radios.html", "Checks &amp; Radios", "square-check"),
        link("forms/range.html", "Range", "sliders"),
        link("forms/input-group.html", "Input Group", "object-group"),
        link("forms/floating-labels.html", "Floating Labels", "tag"),
        link("forms/layout.html", "Layout", "table-list"),
        link("forms/validation.html", "Validation", "circle-check"),
    ])
    cm = "".join(
        link(f"components/{s}.html", COMPONENT_LABELS.get(s, s.replace("-", " ").title()),
             COMPONENT_ICONS.get(s, "cube"))
        for s in COMPONENT_SLUGS
    )
    he = "".join([
        link("helpers/clearfix.html", "Clearfix", "broom"),
        link("helpers/colored-links.html", "Colored Links", "link"),
        link("helpers/focus-ring.html", "Focus Ring", "bullseye"),
        link("helpers/icon-link.html", "Icon Link", "icons"),
        link("helpers/ratios.html", "Ratios", "crop"),
        link("helpers/stacks.html", "Stacks", "layer-group"),
        link("helpers/stretched-link.html", "Stretched Link", "up-right-and-down-left-from-center"),
        link("helpers/text-truncation.html", "Text Truncation", "ellipsis"),
        link("helpers/vertical-rule.html", "Vertical Rule", "grip-lines-vertical"),
        link("helpers/visually-hidden.html", "Visually Hidden", "eye-slash"),
    ])
    ut = "".join([
        link("utilities/api.html", "API", "book"),
        link("utilities/background.html", "Background", "fill-drip"),
        link("utilities/borders.html", "Borders", "border-all"),
        link("utilities/colors.html", "Colors", "palette"),
        link("utilities/color-mix.html", "Color Mix", "swatchbook"),
        link("utilities/display.html", "Display", "eye"),
        link("utilities/divide.html", "Divide", "grip-lines"),
        link("utilities/flex.html", "Flex", "arrows-up-down-left-right"),
        link("utilities/float.html", "Float", "water"),
        link("utilities/filters.html", "Filters", "filter"),
        link("utilities/interactions.html", "Interactions", "hand-pointer"),
        link("utilities/object-fit.html", "Object Fit", "object-ungroup"),
        link("utilities/opacity.html", "Opacity", "circle-half-stroke"),
        link("utilities/overflow.html", "Overflow", "expand"),
        link("utilities/position.html", "Position", "location-dot"),
        link("utilities/print.html", "Print", "print"),
        link("utilities/scroll.html", "Scroll", "scroll"),
        link("utilities/shadows.html", "Shadows", "cloud"),
        link("utilities/sizing.html", "Sizing", "maximize"),
        link("utilities/spacing.html", "Spacing", "arrows-left-right"),
        link("utilities/text.html", "Text", "font"),
        link("utilities/transitions.html", "Transitions", "timeline"),
        link("utilities/transforms.html", "Transforms", "shapes"),
        link("utilities/motion.html", "Motion tokens", "stopwatch"),
        link("utilities/filter-effects.html", "Filter effects", "wand-magic-sparkles"),
        link("utilities/chart-animation.html", "Chart animation", "chart-line"),
        link("utilities/vertical-align.html", "Vertical Align", "align-center"),
        link("utilities/visibility.html", "Visibility", "eye-slash"),
        link("utilities/safe-area.html", "Safe area", "mobile-screen-button"),
        link("utilities/z-index.html", "Z-index", "layer-group"),
    ])
    an = "".join([
        link("animations/overview.html", "Overview", "bolt"),
        link("animations/entrance.html", "Entrance", "door-open"),
        link("animations/attention.html", "Attention", "bell"),
        link("animations/exit.html", "Exit", "door-closed"),
        link("animations/scroll-driven.html", "Scroll-driven", "scroll"),
        link("animations/view-transitions.html", "View Transitions", "film"),
    ])
    ex = "".join([
        link("extend/approach.html", "Approach", "compass"),
        link("extend/utility-coverage.html", "Utility coverage", "list-check"),
        link("extend/icons.html", "Icons", "icons"),
        link("extend/cli.html", "CLI", "terminal"),
        link("generated/index.html", "Generated reference", "file-lines"),
        link("extend/security.html", "Security", "shield-halved"),
        link("extend/repo-tools.html", "Repo tools", "screwdriver-wrench"),
        link("extend/web-components.html", "Web Components", "puzzle-piece"),
        link("extend/javascript-api.html", "JavaScript API", "code"),
        link("extend/core-modules.html", "Core modules", "cubes"),
    ])
    gu = "".join([
        link("guides/index.html", "Overview", "map"),
        link("guides/feature-scope.html", "Feature scope", "layer-group"),
        link("guides/existing-project.html", "Existing project", "folder-open"),
        link("guides/react-vite-starter.html", "Vite &amp; React", "code-branch"),
        link("guides/prompt-scaffolding.html", "Prompt scaffolding", "wand-magic-sparkles"),
        link("guides/landing-15-min.html", "Landing in 15 min", "rocket"),
        link("guides/marketing-lite-css.html", "Marketing lite CSS", "gauge-simple"),
        link("guides/production-build.html", "Production Builder", "rocket"),
        link("guides/responsive-layout.html", "Responsive layout", "mobile-screen"),
        link("guides/performance-audit.html", "Performance audit", "gauge-high"),
        link("guides/whats-new-extension.html", "What&apos;s new (extension)", "wand-magic-sparkles"),
        link("guides/velin-search.html", "VelinSearch", "magnifying-glass"),
        link("guides/motion-attributes.html", "Motion &amp; attributes", "bolt"),
        link("guides/syntax-highlight.html", "Syntax highlighting", "code"),
        link("guides/html-attributes.html", "HTML attributes", "code"),
        link("guides/design-tokens.html", "Design tokens", "swatchbook"),
        link("guides/api-reference.html", "API reference", "book"),
        link("guides/velin-meta.html", "Velin-Meta", "robot"),
        link("guides/ai-skills.html", "AI Skills", "microchip"),
        link("guides/transparency.html", "Transparency", "shield-halved"),
        link("guides/design-intelligence.html", "Design Intelligence", "brain"),
        link("guides/cli-ship-surface.html", "CLI ship surface", "terminal"),
        link("guides/blueprints.html", "Blueprints", "puzzle-piece"),
        link("guides/faq.html", "FAQ", "circle-question"),
        link("guides/troubleshooting.html", "Troubleshooting", "wrench"),
        link("guides/deploy.html", "Deploy", "cloud-arrow-up"),
        link("guides/laravel.html", "Laravel", "php"),
        link("guides/wordpress.html", "WordPress", "wordpress"),
        link("guides/ecommerce.html", "E-commerce", "cart-shopping"),
        link("guides/forum-update.html", "Forum update", "comments"),
    ])
    ab = "".join([
        link("about/overview.html", "Overview", "circle-info"),
        link("about/brand.html", "Brand", "gem"),
        link("about/license.html", "License", "file-contract"),
    ])
    su = "".join([
        link("guides/faq.html", "FAQ", "circle-question"),
        link("guides/troubleshooting.html", "Troubleshooting", "wrench"),
        link("guides/deploy.html", "Deploy", "cloud-arrow-up"),
        link("https://forum.birdapi.de/", "BirdAPI Forum", "comments", external=True),
        link("https://birdapi.de/", "birdapi.de", "globe", external=True),
    ])

    def cat_has_active(links_html: str) -> bool:
        return ' class="active"' in links_html

    def cat(title: str, links: str, cat_id: str, icon: str) -> str:
        expanded = cat_has_active(links)
        collapsed_cls = "" if expanded else " collapsed"
        aria = "true" if expanded else "false"
        hi = icon_tag(icon, "12", "velin-doc-sidebar__cat-icon")
        title = localize_cat(cat_id, title, lang)
        return (
            f'<div class="velin-doc-sidebar__category{collapsed_cls}" data-cat="{cat_id}">'
            f'<button class="velin-doc-sidebar__category-header" aria-expanded="{aria}" type="button">'
            f'{hi}<span>{title}</span> <span class="chevron" aria-hidden="true">▼</span></button>'
            f'<ul class="velin-doc-sidebar__links">{links}</ul></div>'
        )

    body = pinned + cat("Getting Started", gs, "getting-started", "rocket") + cat("Customize", cu, "customize", "palette")
    body += cat("Layout", lo, "layout", "table-cells") + cat("Content", co, "content", "file-lines")
    body += cat("Forms", fo, "forms", "keyboard") + cat("Components", cm, "components", "cubes")
    body += cat("Helpers", he, "helpers", "toolbox") + cat("Utilities", ut, "utilities", "ruler-combined")
    body += cat("Animations", an, "animations", "bolt") + cat("Extend", ex, "extend", "puzzle-piece")
    body += cat("Guides", gu, "guides", "book") + cat("About", ab, "about", "circle-info")
    body += cat("Support &amp; Community", su, "support", "life-ring")
    nav_label = "Dokumentationsnavigation" if lang == "de" else "Documentation navigation"
    return (
        f'    <nav class="velin-doc-sidebar" id="sidebar" aria-label="{nav_label}">\n'
        + body + "    </nav>"
    )


def build_generated_catalog_html() -> str:
    """HTML table rows for every synced .md under docs/generated/."""
    gen = DOCS / "generated"
    if not gen.is_dir():
        return ""
    rows: list[str] = []
    skip_legacy = (gen / "a11y" / "wcag22-aaa-matrix.md").is_file()
    for md in sorted(gen.rglob("*.md")):
        rel = md.relative_to(gen).as_posix()
        if rel == "README.md":
            continue
        if skip_legacy and rel == "a11y/wcag22-matrix.md":
            continue
        label = rel.replace(".md", "").replace("/", " · ")
        rows.append(
            f'          <tr><td><a href="{rel}">{escape_html_label(label)}</a></td>'
            f"<td><code>{rel}</code></td></tr>"
        )
    if not rows:
        return ""
    return (
        '\n      <h2 id="catalog">All generated pages</h2>\n'
        '      <p class="velin-text-muted">Every Markdown file from <code>npm run docs:generate</code> — click to open in the preview dialog.</p>\n'
        '      <table class="velin-table velin-table--compact">\n'
        "        <thead><tr><th>Topic</th><th>File</th></tr></thead>\n"
        "        <tbody>\n" + "\n".join(rows) + "\n        </tbody>\n      </table>\n"
    )


def escape_html_label(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def write_generated_manifest() -> None:
    """manifest.json for optional tooling; VelinDocMd does not require it."""
    import json

    gen = DOCS / "generated"
    if not gen.is_dir():
        return
    files = sorted(
        p.relative_to(gen).as_posix()
        for p in gen.rglob("*.md")
    )
    (gen / "manifest.json").write_text(
        json.dumps({"version": 1, "files": files}, indent=2),
        encoding="utf-8",
    )


def write_generated_index() -> Path:
    """Write docs/generated/index.html with standard doc chrome (sidebar, search, TOC)."""
    path = DOCS / "generated" / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    write_generated_manifest()
    catalog = build_generated_catalog_html()
    rel = "../"
    sb = sidebar_html(rel, "generated/index.html")
    html = f"""<!DOCTYPE html>
<html lang="en" data-velin-themes-base="../../dist/themes">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Generated reference · VelinStyle</title>
  <meta name="description" content="Auto-generated Markdown API reference — Web Components, tokens, utilities, CLI, scanner rules.">
  <link rel="stylesheet" href="../../dist/velinstyle.min.css">
  <link rel="stylesheet" href="../docs.css">
  <link rel="icon" href="../../favicon.ico" type="image/x-icon">
  <link rel="icon" href="../../assets/img/velinstyle-logo.svg" type="image/svg+xml">
  <script src="../../assets/js/velin-theme-init.js"></script>
</head>
<body>
  <a href="#main-content" class="velin-doc-skip">Skip to main content</a>
  <header class="velin-doc-header"><button class="velin-doc-hamburger" aria-label="Toggle sidebar" id="sidebarToggle"><velin-icon name="menu" size="20"></velin-icon></button><a href="../getting-started/introduction.html" class="velin-doc-header__brand"><img src="../../assets/img/velinstyle-logo.svg" alt="" width="28" height="28"> VelinStyle <span class="velin-doc-header__version">v{FRAMEWORK_VERSION}</span></a><div class="velin-doc-header__tools"><div class="velin-doc-header__search"><input type="search" placeholder="Search docs…" aria-label="Search documentation" id="docSearch" autocomplete="off" data-search-index="../search-index.json"></div></div><div class="velin-doc-header__actions">
      <velin-theme-toggle themes-base="../../dist/themes/"></velin-theme-toggle><a class="velin-doc-header__home" href="../../index.html" aria-label="Home" title="Home"><velin-icon name="home" size="18" aria-hidden="true"></velin-icon><span class="velin-doc-header__home-label">Home</span></a><a href="https://github.com/SkyliteDesign/velinstyle" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub"><velin-icon name="github" size="18"></velin-icon></a></div></header>
  <div class="velin-doc-overlay" id="sidebarOverlay"></div>
  <div class="velin-doc-wrapper">
{sb}

        <main class="velin-doc-main" id="main-content">
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../extend/cli.html">Extend</a></li><li>Generated reference</li></ol>
      <h1>Auto-generated reference (Markdown) <span class="velin-badge velin-badge--primary">{FRAMEWORK_VERSION}</span></h1>
      <p class="lead">Snapshot from <code>npm run docs:generate</code> in the framework repo. Do not edit these files by hand — see the <a href="../guides/api-reference.html">API reference guide</a>.</p>

      <div class="velin-alert velin-alert--info" role="note" style="margin-bottom:1.25rem">
        <div class="velin-alert__content"><strong>Markdown files:</strong> Click a row below to open rendered reference in a dialog (requires HTTP, e.g. <code>npm run dev</code> on this site).</div>
      </div>

      <h2 id="sections">Sections</h2>
      <table class="velin-table">
        <thead><tr><th>Section</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><a href="README.md">Overview</a></td><td><code>README.md</code> — index of generated output</td></tr>
          <tr><td><a href="components/README.md">Web Components</a></td><td>Attributes, events, slots, CSS parts</td></tr>
          <tr><td><a href="tokens/README.md">Design tokens</a></td><td><code>--velin-*</code> from <code>src/tokens/</code></td></tr>
          <tr><td><a href="utilities/README.md">Utilities</a></td><td><code>.velin-*</code> classes from <code>src/utilities/</code></td></tr>
          <tr><td><a href="cli/commands.md">CLI commands</a></td><td>From <code>cli/cli-manifest.json</code></td></tr>
          <tr><td><a href="rules/scanner.md">Scanner rules</a></td><td>Security, a11y, PII, performance</td></tr>
          <tr><td><a href="a11y/modules.md">A11y CSS</a></td><td>Modules in <code>src/a11y/</code></td></tr>
          <tr><td><a href="a11y/wcag22-aaa-matrix.md">WCAG 2.2 AAA matrix</a></td><td>AAA conformance mapping for framework helpers</td></tr>
          <tr><td><a href="attributes/README.md">HTML attributes</a></td><td><code>velin-*</code> declarative extensions</td></tr>
          <tr><td><a href="meta/README.md">Velin-Meta</a></td><td>Agent bundle docs (<code>velin-agent.json</code>)</td></tr>
        </tbody>
      </table>

      <h2 id="regenerate">Regenerate</h2>
      <pre><code class="language-bash">cd ../velinstyle
npm run docs:generate
cd ../velinstyle-site
npm run sync:dist</code></pre>

      <h2 id="online">Online</h2>
      <p>
        <a href="https://github.com/SkyliteDesign/velinstyle/tree/main/docs/generated" target="_blank" rel="noopener">GitHub</a>
        ·
        <a href="https://skylitedesign.github.io/velinstyle/generated/" target="_blank" rel="noopener">GitHub Pages</a>
      </p>
{catalog}
      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="../guides/api-reference.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">API reference guide</span></a>
        <a href="../extend/cli.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">CLI reference</span></a>
      </nav>
</main>

            <aside class="velin-doc-toc" aria-label="On this page"><div class="velin-doc-toc__title">On this page</div><ul class="velin-doc-toc__list"><li><a href="#sections">Sections</a></li><li><a href="#catalog">All pages</a></li><li><a href="#regenerate">Regenerate</a></li><li><a href="#online">Online</a></li></ul></aside>
  </div>
  <script src="../../dist/velinstyle-components.iife.js"></script>
  <script src="../assets/doc-search.iife.js" defer></script>
  <script src="../doc-examples.js" defer></script>
  <script src="../doc-icons-init.js"></script>
  <script src="../assets/doc-highlight.iife.js" defer></script>
  <script src="../doc-theme.js"></script>
  <script src="../doc-chrome.js"></script>
{DOC_FOOTER}
</body>
</html>
"""
    path.write_text(patch_theme_chrome(html, "../"), encoding="utf-8")
    return path


def strip_theme_comment_block(text: str) -> str:
    marker = "/* ---- Theme toggle ---- */"
    start = text.find(marker)
    if start == -1:
        return text
    for end_marker in (
        "/* ---- Code example tabs ---- */",
        "/* ---- Copy-to-clipboard ---- */",
        "document.querySelectorAll('.velin-doc-example')",
    ):
        end = text.find(end_marker, start + len(marker))
        if end != -1:
            return text[:start] + text[end:]
    return text


def strip_inline_theme_script(text: str) -> str:
    text = strip_theme_comment_block(text)
    start = text.find("const themeToggle=")
    if start == -1:
        return text
    for marker in (
        "document.querySelectorAll('.velin-doc-example')",
        'document.querySelectorAll(".velin-doc-example")',
        "const tocLinks=",
        "/* ---- Code example tabs ---- */",
        "/* ---- Category collapse ---- */",
    ):
        end = text.find(marker, start)
        if end != -1:
            return text[:start] + text[end:]
    end = text.find("</script>", start)
    return text[:start] + text[end:] if end != -1 else text


def doc_scripts_block(rel: str) -> str:
    return (
        f'<script src="{rel}assets/doc-search.iife.js" defer></script>\n  '
        f'<script src="{rel}doc-examples.js" defer></script>\n  '
    )


def meta_alternate_tag(rel: str) -> str:
    return (
        f'  <link rel="alternate" type="application/vnd.velinstyle.meta+json" '
        f'href="{rel}dist/velin-agent.json" title="VelinStyle agent metadata">\n'
    )


def inject_doc_scripts(text: str, rel: str) -> str:
    if "doc-search.iife.js" in text and "doc-chrome.js" in text:
        return text
    text = SEARCH_TAG_RE.sub("", text)
    text = EXAMPLES_TAG_RE.sub("", text)
    text = FILE_PROTO_TAG_RE.sub("", text)
    block = doc_scripts_block(rel)
    if "doc-search.iife.js" not in text and COMPONENTS_TAG_RE.search(text):
        text = COMPONENTS_TAG_RE.sub(r"\1" + block, text, count=1)
    elif "doc-search.iife.js" not in text:
        chrome = f'<script src="{rel}doc-chrome.js"></script>'
        if chrome in text:
            text = text.replace(chrome, block + chrome, 1)
    return text


def inject_doc_base(text: str) -> str:
    if "document.write('<base href" in text:
        return text
    return text.replace("<head>", "<head>\n  " + DOC_BASE_INLINE, 1)


def inject_icons_init(text: str, rel: str) -> str:
    tag = f'<script src="{rel}doc-icons-init.js"></script>\n  '
    if "doc-icons-init.js" in text:
        return text
    m = re.search(
        r'<script src="[^"]*velinstyle-components\.iife\.js"[^>]*>\s*</script>',
        text,
        re.I,
    )
    if not m:
        return text
    return text[: m.start()] + m.group(0) + "\n  " + tag.strip() + "\n  " + text[m.end() :]


def inject_highlight_bundle(text: str, rel: str) -> str:
    tag = f'<script src="{rel}assets/doc-highlight.iife.js" defer></script>\n  '
    if "doc-highlight.iife.js" in text:
        return text
    anchor = f'<script src="{rel}doc-icons-init.js"></script>'
    if anchor in text:
        return text.replace(anchor, anchor + "\n  " + tag.strip() + "\n  ", 1)
    return text


def inject_doc_footer(text: str) -> str:
    if FOOTER_RE.search(text):
        return FOOTER_RE.sub(DOC_FOOTER, text, count=1)
    return text


def strip_doc_translate(text: str) -> str:
    return DOC_TRANSLATE_RE.sub("", text)


def patch_theme_chrome(text: str, rel: str) -> str:
    text = inject_doc_base(text)
    themes_base = f"{rel}../dist/themes"
    if HTML_LIGHT_RE.search(text):
        text = HTML_LIGHT_RE.sub(
            f'<html\\1 data-velin-themes-base="{themes_base}"',
            text,
            count=1,
        )
    init = f'<script src="{rel}../assets/js/velin-theme-init.js"></script>'
    if init not in text:
        text = text.replace("</head>", f"  {init}\n</head>", 1)
    text = THEME_BTN_RE.sub(
        f'<velin-theme-toggle themes-base="{themes_base}/"></velin-theme-toggle>',
        text,
        count=1,
    )
    text = strip_inline_theme_script(text)
    text = PICKER_SCRIPT_RE.sub("", text)
    doc_theme = f'<script src="{rel}doc-theme.js"></script>\n  '
    if "doc-theme.js" not in text:
        if f'<script src="{rel}doc-nav.js"></script>' in text:
            text = text.replace(
                f'<script src="{rel}doc-nav.js"></script>',
                doc_theme + f'<script src="{rel}doc-nav.js"></script>',
                1,
            )
        else:
            text = text.replace(
                '<script src="../../dist/velinstyle-components.iife.js"></script>',
                '<script src="../../dist/velinstyle-components.iife.js"></script>\n  '
                + doc_theme,
                1,
            )
    return text


def inject_meta_alternate(text: str, rel: str) -> str:
    tag = meta_alternate_tag(rel)
    text = META_ALTERNATE_RE.sub("", text)
    if "velin-agent.json" in text:
        return text
    if '<link rel="stylesheet"' in text:
        return text.replace('<link rel="stylesheet"', tag + '  <link rel="stylesheet"', 1)
    return text.replace("<head>", "<head>\n" + tag, 1)


def inject_doc_chrome(text: str, rel: str) -> str:
    """Single bundled script: sidebar/nav + markdown dialog (replaces doc-nav + doc-md-viewer)."""
    tag = f'<script src="{rel}doc-chrome.js"></script>\n  '
    text = MD_VIEWER_RE.sub("", text)
    text = NAV_ONLY_RE.sub("", text)
    text = CHROME_RE.sub("", text)
    if "doc-chrome.js" in text:
        return text
    anchor = f'<script src="{rel}doc-theme.js"></script>'
    if anchor in text:
        return text.replace(anchor, tag + anchor, 1)
    if "</body>" in text:
        return text.replace("</body>", "  " + tag + "</body>", 1)
    return text


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    rel = rel_prefix(path)
    active = path.relative_to(DOCS).as_posix()
    lang = page_lang(text, active)
    new_sb = sidebar_html(rel, active, lang=lang)
    if not SIDEBAR_RE.search(text):
        return False
    text = SIDEBAR_RE.sub(new_sb, text, count=1)
    text = patch_theme_chrome(text, rel)
    text = strip_doc_translate(text)
    text = inject_doc_footer(text)
    text = inject_meta_alternate(text, rel)
    text = inject_doc_chrome(text, rel)
    idx = rel + "search-index.json"
    if lang == "de":
        search_input = (
            '<input type="search" placeholder="Docs durchsuchen…" aria-label="Dokumentation durchsuchen" '
            f'id="docSearch" autocomplete="off" data-search-index="{idx}">'
        )
    else:
        search_input = (
            '<input type="search" placeholder="Search docs…" aria-label="Search documentation" '
            f'id="docSearch" autocomplete="off" data-search-index="{idx}">'
        )
    text = SEARCH_INPUT_RE.sub(search_input, text, count=1)
    text = inject_doc_scripts(text, rel)
    text = inject_icons_init(text, rel)
    text = inject_highlight_bundle(text, rel)
    path.write_text(text, encoding="utf-8")
    return True


def bundle_doc_chrome() -> None:
    import importlib.util

    spec = importlib.util.spec_from_file_location(
        "bundle", SITE / "tools" / "bundle-doc-chrome.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.main()


def main() -> None:
    bundle_doc_chrome()
    write_generated_index()
    n = sum(1 for html in DOCS.rglob("*.html") if patch_file(html))
    print(f"Done: {n} files (doc-chrome.js bundled, generated hub + catalog)")


if __name__ == "__main__":
    main()
