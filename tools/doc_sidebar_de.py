# -*- coding: utf-8 -*-
"""German sidebar labels + EN→DE path helpers for sync-sidebar / docs chrome."""
from __future__ import annotations

import json
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1] / "docs"
LANG_MAP_JS = DOCS / "doc-lang-map.js"

# EN docs-relative path → German nav label (HTML entities OK)
SIDEBAR_LABEL_DE: dict[str, str] = {
    "getting-started/introduction.html": "Einführung",
    "getting-started/download.html": "Download",
    "getting-started/contents.html": "Inhalte",
    "getting-started/editor-setup.html": "Editor-Einrichtung",
    "getting-started/browser-compatibility.html": "Kompatibilität",
    "getting-started/upgrading.html": "Aktualisieren",
    "getting-started/states-and-variants.html": "Zustände &amp; Varianten",
    "getting-started/accessibility.html": "Barrierefreiheit",
    "getting-started/rtl.html": "RTL",
    "getting-started/a11y-patterns.html": "A11y-Muster",
    "getting-started/a11y-dashboard.html": "A11y-Dashboard",
    "customize/overview.html": "Überblick",
    "customize/color.html": "Farbe",
    "customize/color-modes.html": "Farbmodi",
    "customize/css-variables.html": "CSS-Variablen",
    "customize/components.html": "Komponenten",
    "customize/optimize.html": "Optimieren",
    "layout/breakpoints.html": "Breakpoints",
    "layout/containers.html": "Container",
    "layout/grid.html": "Raster",
    "layout/patterns.html": "Muster",
    "layout/columns.html": "Spalten",
    "layout/gutters.html": "Abstände",
    "layout/utilities.html": "Utilities",
    "layout/z-index.html": "Z-Index",
    "content/reboot.html": "Reboot",
    "content/typography.html": "Typografie",
    "content/images.html": "Bilder",
    "content/tables.html": "Tabellen",
    "content/figures.html": "Abbildungen",
    "forms/overview.html": "Überblick",
    "forms/form-control.html": "Formularsteuerung",
    "forms/select.html": "Auswahl",
    "forms/checks-radios.html": "Checkboxen &amp; Radios",
    "forms/range.html": "Schieberegler",
    "forms/input-group.html": "Eingabegruppe",
    "forms/floating-labels.html": "Schwebende Labels",
    "forms/layout.html": "Layout",
    "forms/validation.html": "Validierung",
    "components/accordion.html": "Akkordion",
    "components/alerts.html": "Hinweise",
    "components/avatar.html": "Avatar",
    "components/badge.html": "Abzeichen",
    "components/breadcrumb.html": "Brotkrumen",
    "components/buttons.html": "Buttons",
    "components/button-group.html": "Button-Gruppe",
    "components/card.html": "Karte",
    "components/carousel.html": "Karussell",
    "components/chip.html": "Chip",
    "components/velin-code-block.html": "Code-Block",
    "components/close-button.html": "Schließen-Button",
    "components/collapse.html": "Einklappen",
    "components/announcer.html": "Announcer",
    "components/bottom-nav.html": "Bottom-Nav",
    "components/calendar.html": "Kalender",
    "components/combobox.html": "Combobox",
    "components/command.html": "Befehlspalette",
    "components/velin-search.html": "Velin Search",
    "components/menubar.html": "Menüleiste",
    "components/rating.html": "Bewertung",
    "components/segmented-control.html": "Segmentsteuerung",
    "components/sheet.html": "Sheet",
    "components/secure-field.html": "Sicheres Feld",
    "components/dialog.html": "Dialog",
    "components/divider.html": "Trenner",
    "components/drawer.html": "Schublade",
    "components/dropdown.html": "Dropdown",
    "components/email.html": "E-Mail",
    "components/file-dropzone.html": "Datei-Dropzone",
    "components/lightbox.html": "Lightbox",
    "components/list-group.html": "Listengruppe",
    "components/modal.html": "Modal",
    "components/navbar.html": "Navigationsleiste",
    "components/navs-tabs.html": "Navs &amp; Tabs",
    "components/pagination.html": "Pagination",
    "components/popover.html": "Popover",
    "components/progress.html": "Fortschritt",
    "components/progress-ring.html": "Fortschrittsring",
    "components/scrollspy.html": "Scrollspy",
    "components/spinners.html": "Ladeanzeigen",
    "components/stat.html": "Statistik",
    "components/stepper.html": "Schrittanzeige",
    "components/timeline.html": "Zeitleiste",
    "components/toasts.html": "Toasts",
    "components/tooltips.html": "Tooltips",
    "components/sparkline.html": "Sparkline",
    "components/counter.html": "Zähler",
    "components/copy.html": "Kopieren",
    "components/countdown.html": "Countdown",
    "components/data-table.html": "Datentabelle",
    "components/form-summary.html": "Formular-Zusammenfassung",
    "components/persist.html": "Persist",
    "components/scroll-top.html": "Nach oben scrollen",
    "components/live-dot.html": "Live-Punkt",
    "helpers/clearfix.html": "Float aufheben",
    "helpers/colored-links.html": "Farbige Links",
    "helpers/focus-ring.html": "Fokusring",
    "helpers/icon-link.html": "Icon-Link",
    "helpers/ratios.html": "Seitenverhältnisse",
    "helpers/stacks.html": "Stacks",
    "helpers/stretched-link.html": "Gestreckter Link",
    "helpers/text-truncation.html": "Textkürzung",
    "helpers/vertical-rule.html": "Vertikale Linie",
    "helpers/visually-hidden.html": "Visuell verborgen",
    "utilities/api.html": "API",
    "utilities/background.html": "Hintergrund",
    "utilities/borders.html": "Rahmen",
    "utilities/colors.html": "Farben",
    "utilities/color-mix.html": "Farbmischung",
    "utilities/display.html": "Display",
    "utilities/divide.html": "Teiler",
    "utilities/flex.html": "Flex",
    "utilities/float.html": "Float",
    "utilities/filters.html": "Filter",
    "utilities/interactions.html": "Interaktionen",
    "utilities/object-fit.html": "Object Fit",
    "utilities/opacity.html": "Deckkraft",
    "utilities/overflow.html": "Overflow",
    "utilities/position.html": "Position",
    "utilities/print.html": "Druck",
    "utilities/scroll.html": "Scroll",
    "utilities/shadows.html": "Schatten",
    "utilities/sizing.html": "Größen",
    "utilities/spacing.html": "Abstände",
    "utilities/text.html": "Text",
    "utilities/transitions.html": "Übergänge",
    "utilities/transforms.html": "Transformationen",
    "utilities/motion.html": "Motion-Tokens",
    "utilities/filter-effects.html": "Filtereffekte",
    "utilities/chart-animation.html": "Chart-Animation",
    "utilities/vertical-align.html": "Vertikale Ausrichtung",
    "utilities/visibility.html": "Sichtbarkeit",
    "utilities/safe-area.html": "Safe Area",
    "utilities/z-index.html": "Z-Index",
    "animations/overview.html": "Überblick",
    "animations/entrance.html": "Eintritt",
    "animations/attention.html": "Aufmerksamkeit",
    "animations/exit.html": "Austritt",
    "animations/scroll-driven.html": "Scroll-gesteuert",
    "animations/view-transitions.html": "View Transitions",
    "extend/approach.html": "Ansatz",
    "extend/utility-coverage.html": "Utility-Abdeckung",
    "extend/icons.html": "Icons",
    "extend/cli.html": "CLI",
    "generated/index.html": "Generierte Referenz",
    "extend/security.html": "Sicherheit",
    "extend/repo-tools.html": "Repo-Tools",
    "extend/web-components.html": "Web Components",
    "extend/javascript-api.html": "JavaScript-API",
    "extend/core-modules.html": "Kernmodule",
    "guides/index.html": "Überblick",
    "guides/feature-scope.html": "Feature-Umfang",
    "guides/existing-project.html": "Bestehendes Projekt",
    "guides/react-vite-starter.html": "Vite &amp; React",
    "guides/prompt-scaffolding.html": "Prompt-Vorlagen",
    "guides/landing-15-min.html": "Landing in 15 Min.",
    "guides/marketing-lite-css.html": "Marketing Lite CSS",
    "guides/responsive-layout.html": "Responsives Layout",
    "guides/performance-audit.html": "Performance-Audit",
    "guides/whats-new-extension.html": "Neu (Extension)",
    "guides/velin-search.html": "VelinSearch",
    "guides/motion-attributes.html": "Motion &amp; Attribute",
    "guides/syntax-highlight.html": "Syntax-Highlighting",
    "guides/html-attributes.html": "HTML-Attribute",
    "guides/design-tokens.html": "Design Tokens",
    "guides/api-reference.html": "API-Referenz",
    "guides/velin-meta.html": "Velin-Meta",
    "guides/ai-skills.html": "AI Skills",
    "guides/transparency.html": "Transparenz",
    "guides/design-intelligence.html": "Design Intelligence",
    "guides/cli-ship-surface.html": "CLI Ship Surface",
    "guides/blueprints.html": "Blueprints",
    "guides/faq.html": "FAQ",
    "guides/troubleshooting.html": "Fehlerbehebung",
    "guides/deploy.html": "Deploy",
    "guides/laravel.html": "Laravel",
    "guides/wordpress.html": "WordPress",
    "guides/ecommerce.html": "E-Commerce",
    "guides/forum-update.html": "Forum-Update",
    "about/overview.html": "Überblick",
    "about/brand.html": "Marke",
    "about/license.html": "Lizenz",
    "changelog.html": "Änderungsprotokoll",
    "migration.html": "Migrationsleitfaden",
}

SIDEBAR_CAT_DE: dict[str, str] = {
    "getting-started": "Erste Schritte",
    "customize": "Anpassen",
    "layout": "Layout",
    "content": "Inhalt",
    "forms": "Formulare",
    "components": "Komponenten",
    "helpers": "Helfer",
    "utilities": "Utilities",
    "animations": "Animationen",
    "extend": "Erweitern",
    "guides": "Guides",
    "about": "Über",
    "support": "Support &amp; Community",
}

_en_to_de_cache: dict[str, str] | None = None


def load_en_to_de() -> dict[str, str]:
    global _en_to_de_cache
    if _en_to_de_cache is not None:
        return _en_to_de_cache
    if not LANG_MAP_JS.is_file():
        _en_to_de_cache = {}
        return _en_to_de_cache
    text = LANG_MAP_JS.read_text(encoding="utf-8")
    m = re.search(r"enToDe:\s*(\{.*?\})\s*\};", text, re.S)
    _en_to_de_cache = json.loads(m.group(1)) if m else {}
    return _en_to_de_cache


def page_lang(html_text: str, active_rel: str) -> str:
    m = re.search(r'<html[^>]*\slang="(en|de)"', html_text, re.I)
    if m:
        return m.group(1).lower()
    en_to_de = load_en_to_de()
    if active_rel in en_to_de.values():
        return "de"
    return "en"


def localize_href(en_href: str, lang: str) -> str:
    if lang != "de" or en_href.startswith(("http://", "https://", "#", "mailto:")):
        return en_href
    return load_en_to_de().get(en_href, en_href)


def localize_label(en_href: str, en_label: str, lang: str) -> str:
    if lang != "de":
        return en_label
    if en_label.startswith("Upgrading to "):
        return "Aktualisieren auf " + en_label[len("Upgrading to ") :]
    return SIDEBAR_LABEL_DE.get(en_href, en_label)


def localize_cat(cat_id: str, en_title: str, lang: str) -> str:
    if lang != "de":
        return en_title
    return SIDEBAR_CAT_DE.get(cat_id, en_title)
