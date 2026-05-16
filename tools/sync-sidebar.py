#!/usr/bin/env python3
"""Replace sidebar nav and inject doc-search in all docs/*.html pages."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
DOCS = SITE / "docs"

SIDEBAR_RE = re.compile(
    r'<nav class="velin-doc-sidebar"[^>]*>.*?</nav>',
    re.DOTALL,
)
SEARCH_TAG_RE = re.compile(r'<script src="[^"]*doc-search\.js"[^>]*></script>\s*')
SEARCH_ATTR_RE = re.compile(
    r'(<input[^>]*id="docSearch"[^>]*)(/?>)',
    re.IGNORECASE,
)


def rel_prefix(doc_file: Path) -> str:
    depth = len(doc_file.relative_to(DOCS).parts) - 1
    return "../" * depth if depth else ""


def sidebar_html(rel: str, active_href: str) -> str:
    def link(href: str, label: str) -> str:
        cls = ' class="active"' if href == active_href else ""
        return f'<li><a href="{rel}{href}"{cls}>{label}</a></li>'

    gs = "".join([
        link("getting-started/introduction.html", "Introduction"),
        link("getting-started/download.html", "Download"),
        link("getting-started/contents.html", "Contents"),
        link("getting-started/editor-setup.html", "Editor setup"),
        link("getting-started/browser-compatibility.html", "Compatibility"),
        link("getting-started/upgrading.html", "Upgrading"),
        link("getting-started/states-and-variants.html", "States &amp; variants"),
        link("getting-started/accessibility.html", "Accessibility"),
        link("getting-started/rtl.html", "RTL"),
        link("getting-started/a11y-patterns.html", "A11y patterns"),
        link("getting-started/a11y-dashboard.html", "A11y Dashboard"),
    ])
    cu = "".join([
        link("customize/overview.html", "Overview"),
        link("customize/color.html", "Color"),
        link("customize/color-modes.html", "Color Modes"),
        link("customize/css-variables.html", "CSS Variables"),
        link("customize/components.html", "Components"),
        link("customize/optimize.html", "Optimize"),
    ])
    lo = "".join([
        link("layout/breakpoints.html", "Breakpoints"),
        link("layout/containers.html", "Containers"),
        link("layout/grid.html", "Grid"),
        link("layout/patterns.html", "Patterns"),
        link("layout/columns.html", "Columns"),
        link("layout/gutters.html", "Gutters"),
        link("layout/utilities.html", "Utilities"),
        link("layout/z-index.html", "Z-index"),
    ])
    co = "".join([
        link("content/reboot.html", "Reboot"),
        link("content/typography.html", "Typography"),
        link("content/images.html", "Images"),
        link("content/tables.html", "Tables"),
        link("content/figures.html", "Figures"),
    ])
    fo = "".join([
        link("forms/overview.html", "Overview"),
        link("forms/form-control.html", "Form Control"),
        link("forms/select.html", "Select"),
        link("forms/checks-radios.html", "Checks &amp; Radios"),
        link("forms/range.html", "Range"),
        link("forms/input-group.html", "Input Group"),
        link("forms/floating-labels.html", "Floating Labels"),
        link("forms/layout.html", "Layout"),
        link("forms/validation.html", "Validation"),
    ])
    components = [
        "accordion", "alerts", "avatar", "badge", "breadcrumb", "buttons", "button-group",
        "card", "carousel", "chip", "close-button", "collapse", "dialog", "divider", "drawer",
        "dropdown", "lightbox", "list-group", "modal", "navbar", "navs-tabs", "pagination",
        "popover", "progress", "progress-ring", "scrollspy", "spinners", "stat", "stepper",
        "timeline", "toasts", "tooltips",
    ]
    labels = {
        "navs-tabs": "Navs &amp; Tabs", "button-group": "Button Group",
        "close-button": "Close Button", "list-group": "List Group",
        "progress-ring": "Progress Ring", "checks-radios": "Checks &amp; Radios",
    }
    cm = "".join(
        link(f"components/{c}.html", labels.get(c, c.replace("-", " ").title()))
        for c in components
    )
    he = "".join([
        link("helpers/clearfix.html", "Clearfix"),
        link("helpers/colored-links.html", "Colored Links"),
        link("helpers/focus-ring.html", "Focus Ring"),
        link("helpers/icon-link.html", "Icon Link"),
        link("helpers/ratios.html", "Ratios"),
        link("helpers/stacks.html", "Stacks"),
        link("helpers/stretched-link.html", "Stretched Link"),
        link("helpers/text-truncation.html", "Text Truncation"),
        link("helpers/vertical-rule.html", "Vertical Rule"),
        link("helpers/visually-hidden.html", "Visually Hidden"),
    ])
    ut = "".join([
        link("utilities/api.html", "API"),
        link("utilities/background.html", "Background"),
        link("utilities/borders.html", "Borders"),
        link("utilities/colors.html", "Colors"),
        link("utilities/color-mix.html", "Color Mix"),
        link("utilities/display.html", "Display"),
        link("utilities/divide.html", "Divide"),
        link("utilities/flex.html", "Flex"),
        link("utilities/float.html", "Float"),
        link("utilities/filters.html", "Filters"),
        link("utilities/interactions.html", "Interactions"),
        link("utilities/object-fit.html", "Object Fit"),
        link("utilities/opacity.html", "Opacity"),
        link("utilities/overflow.html", "Overflow"),
        link("utilities/position.html", "Position"),
        link("utilities/print.html", "Print"),
        link("utilities/scroll.html", "Scroll"),
        link("utilities/shadows.html", "Shadows"),
        link("utilities/sizing.html", "Sizing"),
        link("utilities/spacing.html", "Spacing"),
        link("utilities/text.html", "Text"),
        link("utilities/transitions.html", "Transitions"),
        link("utilities/transforms.html", "Transforms"),
        link("utilities/vertical-align.html", "Vertical Align"),
        link("utilities/visibility.html", "Visibility"),
        link("utilities/z-index.html", "Z-index"),
    ])
    an = "".join([
        link("animations/overview.html", "Overview"),
        link("animations/entrance.html", "Entrance"),
        link("animations/attention.html", "Attention"),
        link("animations/exit.html", "Exit"),
        link("animations/scroll-driven.html", "Scroll-driven"),
        link("animations/view-transitions.html", "View Transitions"),
    ])
    ex = "".join([
        link("extend/approach.html", "Approach"),
        link("extend/utility-coverage.html", "Utility coverage"),
        link("extend/icons.html", "Icons"),
        link("extend/cli.html", "CLI"),
        link("extend/security.html", "Security"),
        link("extend/repo-tools.html", "Repo tools"),
        link("extend/web-components.html", "Web Components"),
        link("extend/javascript-api.html", "JavaScript API"),
    ])
    gu = "".join([
        link("guides/index.html", "Overview"),
        link("guides/existing-project.html", "Existing project"),
        link("guides/react-vite-starter.html", "Vite &amp; React"),
    ])
    ab = "".join([
        link("about/overview.html", "Overview"),
        link("about/brand.html", "Brand"),
        link("about/license.html", "License"),
    ])
    mi = link("migration.html", "Migration Guide")

    def cat(title: str, links: str) -> str:
        open_cat = '<div class="velin-doc-sidebar__category">'
        return (
            open_cat
            + f'<button class="velin-doc-sidebar__category-header" aria-expanded="true">'
            + f'{title} <span class="chevron">▼</span></button>'
            + f'<ul class="velin-doc-sidebar__links">{links}</ul></div>'
        )

    body = (
        cat("Getting Started", gs) + cat("Customize", cu) + cat("Layout", lo)
        + cat("Content", co) + cat("Forms", fo) + cat("Components", cm)
        + cat("Helpers", he) + cat("Utilities", ut) + cat("Animations", an)
        + cat("Extend", ex) + cat("Guides", gu) + cat("About", ab) + cat("Migration", mi)
    )
    return (
        '    <nav class="velin-doc-sidebar" id="sidebar" aria-label="Documentation navigation">\n'
        + body
        + "    </nav>"
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
    text = SEARCH_ATTR_RE.sub(
        rf'\1 autocomplete="off" data-search-index="{idx}"\2',
        text,
        count=1,
    )
    if "doc-search.js" not in text:
        text = text.replace(
            '<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>',
            f'<script src="{rel}doc-search.js"></script>\n  '
            '<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>',
            1,
        )
    else:
        text = SEARCH_TAG_RE.sub(f'<script src="{rel}doc-search.js"></script>\n  ', text, count=1)
    if 'type="image/svg+xml"' not in text and "favicon.ico" in text:
        logo = rel + "../assets/img/velinstyle-logo.svg"
        text = text.replace(
            'type="image/x-icon">',
            f'type="image/x-icon">\n  <link rel="icon" href="{logo}" type="image/svg+xml">',
            1,
        )
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    n = 0
    for html in DOCS.rglob("*.html"):
        if patch_file(html):
            n += 1
            print("patched", html.relative_to(SITE))
    print(f"Done: {n} files")


if __name__ == "__main__":
    main()
