#!/usr/bin/env python3
"""Generate tools/sync-sidebar.py (full sidebar with pinned guides)."""
from pathlib import Path

OUT = Path(__file__).parent / "sync-sidebar.py"

TEMPLATE = r'''#!/usr/bin/env python3
"""Replace sidebar nav (icons, pinned, guides) and inject doc scripts."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
DOCS = SITE / "docs"

SIDEBAR_RE = re.compile(
    r'<nav class="velin-doc-sidebar"[^>]*>.*?</nav>',
    re.DOTALL,
)
SEARCH_TAG_RE = re.compile(r'<script src="[^"]*doc-search\.js"[^>]*></script>\s*')
NAV_TAG_RE = re.compile(r'<script src="[^"]*doc-nav\.js"[^>]*></script>\s*')
SEARCH_ATTR_RE = re.compile(
    r'(<input[^>]*id="docSearch"[^>]*)(/?>)',
    re.IGNORECASE,
)

FA = 'provider="fontawesome" variant="solid"'

COMPONENT_SLUGS = [
    "accordion", "alerts", "avatar", "badge", "breadcrumb", "buttons", "button-group",
    "card", "carousel", "chip", "close-button", "collapse",
    "announcer", "bottom-nav", "combobox", "command", "menubar", "rating",
    "segmented-control", "sheet",
    "dialog", "divider", "drawer", "dropdown", "lightbox", "list-group", "modal",
    "navbar", "navs-tabs", "pagination", "popover", "progress", "progress-ring",
    "scrollspy", "spinners", "stat", "stepper", "timeline", "toasts", "tooltips",
]

COMPONENT_LABELS = {
    "announcer": "Announcer", "bottom-nav": "Bottom nav", "combobox": "Combobox",
    "command": "Command palette", "menubar": "Menubar", "rating": "Rating",
    "segmented-control": "Segmented control", "sheet": "Sheet",
    "navs-tabs": "Navs &amp; Tabs", "button-group": "Button Group",
    "close-button": "Close Button", "list-group": "List Group",
    "progress-ring": "Progress Ring",
}

COMPONENT_ICONS = {
    "accordion": "bars-staggered", "alerts": "triangle-exclamation", "avatar": "circle-user",
    "badge": "certificate", "breadcrumb": "ellipsis", "buttons": "square",
    "button-group": "object-group", "card": "id-card", "carousel": "images", "chip": "tags",
    "close-button": "xmark", "collapse": "compress", "announcer": "bullhorn",
    "bottom-nav": "bars", "combobox": "list", "command": "terminal",
    "menubar": "bars-progress", "rating": "star", "segmented-control": "table-cells-large",
    "sheet": "sheet-plastic", "dialog": "comment-dots", "divider": "minus", "drawer": "bars",
    "dropdown": "caret-down", "lightbox": "expand", "list-group": "list-ul",
    "modal": "window-maximize", "navbar": "bars", "navs-tabs": "folder",
    "pagination": "ellipsis", "popover": "comment", "progress": "bars-progress",
    "progress-ring": "circle-notch", "scrollspy": "binoculars", "spinners": "spinner",
    "stat": "chart-simple", "stepper": "shoe-prints", "timeline": "timeline",
    "toasts": "bell", "tooltips": "circle-info",
}

PINNED_QUICK = [
    ("guides/feature-scope.html", "Feature scope", "layer-group", "guides"),
    ("changelog.html", "Changelog", "clock-rotate-left", "about"),
    ("migration.html", "Migration Guide", "right-left", "migration"),
    ("getting-started/upgrading.html", "Upgrading to 0.8.0", "arrow-up", "getting-started"),
]

PINNED_GUIDES = [
    ("guides/index.html", "Guides overview", "map", "guides"),
    ("guides/existing-project.html", "Existing project", "folder-open", "guides"),
    ("guides/react-vite-starter.html", "Vite &amp; React", "code-branch", "guides"),
    ("guides/prompt-scaffolding.html", "Prompt scaffolding", "wand-magic-sparkles", "guides"),
    ("guides/responsive-layout.html", "Responsive layout", "mobile-screen", "guides"),
    ("extend/cli.html", "CLI reference", "terminal", "extend"),
    ("layout/patterns.html", "Layout patterns", "table-columns", "layout"),
    ("getting-started/introduction.html", "Introduction", "house", "getting-started"),
]


def rel_prefix(doc_file: Path) -> str:
    depth = len(doc_file.relative_to(DOCS).parts) - 1
    return "../" * depth if depth else ""


def icon_tag(name: str, size: str, css: str) -> str:
    return (
        f'<velin-icon name="{name}" {FA} size="{size}" '
        f'class="{css}" aria-hidden="true"></velin-icon>'
    )


def sidebar_html(rel: str, active_href: str) -> str:
    def link(href: str, label: str, icon: str | None = None, *, cat: str | None = None, external: bool = False) -> str:
        full = href if external or href.startswith("http") else f"{rel}{href}"
        cls = ""
        if not external and href == active_href:
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
    pinned = (
        '<div class="velin-doc-sidebar__pinned" data-cat="pinned">'
        '<p class="velin-doc-sidebar__pinned-label">Switch quickly</p>'
        f'<ul class="velin-doc-sidebar__links velin-doc-sidebar__links--prominent">{quick}</ul>'
        '<p class="velin-doc-sidebar__pinned-label velin-doc-sidebar__pinned-label--sub">'
        "Framework guides</p>"
        f'<ul class="velin-doc-sidebar__links velin-doc-sidebar__links--prominent">{guides}</ul>'
        "</motion></motion></div>"
    ).replace("</motion></motion></motion></div>", "</div>")

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
        link("layout/columns.html", "Columns", "columns"),
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
        link("forms/form-control.html", "Form Control", "input-text"),
        link("forms/select.html", "Select", "caret-down"),
        link("forms/checks-radios.html", "Checks &amp; Radios", "square-check"),
        link("forms/range.html", "Range", "slider"),
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
        link("utilities/vertical-align.html", "Vertical Align", "align-center"),
        link("utilities/visibility.html", "Visibility", "eye-slash"),
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
        link("extend/security.html", "Security", "shield-halved"),
        link("extend/repo-tools.html", "Repo tools", "screwdriver-wrench"),
        link("extend/web-components.html", "Web Components", "puzzle-piece"),
        link("extend/javascript-api.html", "JavaScript API", "code"),
    ])
    gu = "".join([
        link("guides/index.html", "Overview", "map"),
        link("guides/existing-project.html", "Existing project", "folder-open"),
        link("guides/react-vite-starter.html", "Vite &amp; React", "code-branch"),
        link("guides/prompt-scaffolding.html", "Prompt scaffolding", "wand-magic-sparkles"),
        link("guides/responsive-layout.html", "Responsive layout", "mobile-screen"),
    ])
    ab = "".join([
        link("about/overview.html", "Overview", "circle-info"),
        link("about/brand.html", "Brand", "gem"),
        link("about/license.html", "License", "file-contract"),
    ])
    su = "".join([
        link("https://forum.birdapi.de/", "BirdAPI Forum", "comments", external=True),
        link("https://birdapi.de/", "birdapi.de", "globe", external=True),
    ])

    def cat(title: str, links: str, cat_id: str, icon: str) -> str:
        hi = icon_tag(icon, "12", "velin-doc-sidebar__cat-icon")
        return (
            f'<div class="velin-doc-sidebar__category" data-cat="{cat_id}">'
            f'<button class="velin-doc-sidebar__category-header" aria-expanded="true" type="button">'
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
    return (
        '    <nav class="velin-doc-sidebar" id="sidebar" aria-label="Documentation navigation">\n'
        + body + "    </nav>"
    )


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    rel = rel_prefix(path)
    active = path.relative_to(DOCS).as_posix()
    new_sb = sidebar_html(rel, active)
    if not SIDEBAR_RE.search(text):
        return False
    text = SIDEBAR_RE.sub(new_sb, text, count=1)
    idx = rel + "search-index.json"
    text = SEARCH_ATTR_RE.sub(rf'\1 autocomplete="off" data-search-index="{idx}"\2', text, count=1)
    if "doc-search.js" not in text:
        text = text.replace(
            '<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>',
            f'<script src="{rel}doc-search.js"></script>\n  '
            '<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>',
            1,
        )
    else:
        text = SEARCH_TAG_RE.sub(f'<script src="{rel}doc-search.js"></script>\n  ', text, count=1)
    if "doc-nav.js" not in text:
        ins = f'<script src="{rel}doc-search.js"></script>'
        if ins in text:
            text = text.replace(ins, ins + f'\n  <script src="{rel}doc-nav.js"></script>', 1)
    else:
        text = NAV_TAG_RE.sub(f'<script src="{rel}doc-nav.js"></script>\n  ', text, count=1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    n = sum(1 for html in DOCS.rglob("*.html") if patch_file(html))
    print(f"Done: {n} files")


if __name__ == "__main__":
    main()
'''

# fix typo in template pinned closing
TEMPLATE = TEMPLATE.replace(
    '</motion></motion></motion></motion></div>"\n    ).replace("</motion></motion></motion></motion></motion></div>", "</div>")',
    '</div>"',
)
TEMPLATE = TEMPLATE.replace(
    '        "</motion></motion></div>"\n    ).replace("</motion></motion></motion></motion></div>", "</motion></motion></div>")',
    '        "</div>"',
)

OUT.write_text(TEMPLATE, encoding="utf-8")
print("Wrote", OUT)
