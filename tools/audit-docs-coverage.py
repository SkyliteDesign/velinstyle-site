#!/usr/bin/env python3
"""Compare velinstyle framework inventory vs velinstyle-site/docs coverage."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

# The report contains arrows and dashes, which the default Windows console
# codepage (cp1252) cannot encode.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

FRAMEWORK = Path(__file__).resolve().parents[1].parent / "velinstyle"
SITE_DOCS = Path(__file__).resolve().parents[1] / "docs"


def load_wc_tags() -> list[str]:
    dts = FRAMEWORK / "dist" / "velinstyle.d.ts"
    text = dts.read_text(encoding="utf-8")
    return sorted(set(re.findall(r"'(velin-[a-z0-9-]+)'", text)))


def load_cli_commands() -> list[str]:
    manifest = json.loads((FRAMEWORK / "cli" / "cli-manifest.json").read_text(encoding="utf-8"))
    cmds = [c["name"] for c in manifest["commands"]]
    if (FRAMEWORK / "cli" / "index.js").read_text(encoding="utf-8").find("search index") >= 0:
        cmds.append("search")
    return sorted(set(cmds))


def load_package_exports() -> list[str]:
    pkg = json.loads((FRAMEWORK / "package.json").read_text(encoding="utf-8"))
    exports = pkg.get("exports", {})
    return sorted(k for k in exports if k != ".")


def site_component_pages() -> set[str]:
    pages = set()
    for p in (SITE_DOCS / "components").glob("*.html"):
        name = p.stem
        if name.startswith("velin-"):
            pages.add(name)
        else:
            # map bootstrap-style names to velin where applicable
            mapping = {
                "tooltips": "velin-tooltip",
                "toasts": "velin-toast",
                "stepper": "velin-stepper",
                "navs-tabs": "velin-tabs",
                "modal": "velin-modal",
                "dropdown": "velin-dropdown",
                "drawer": "velin-drawer",
                "carousel": "velin-carousel",
                "collapse": "velin-collapse",
                "accordion": "velin-accordion",
                "copy": "velin-copy",
                "countdown": "velin-countdown",
                "data-table": "velin-data-table",
                "form-summary": "velin-form-summary",
                "persist": "velin-persist",
                "scroll-top": "velin-scroll-top",
                "announcer": "velin-announcer",
                "bottom-nav": "velin-bottom-nav",
                "combobox": "velin-combobox",
                "command": "velin-command",
                "counter": "velin-counter",
                "dialog": "velin-dialog",
                "email": "velin-email",
                "lightbox": "velin-lightbox",
                "live-dot": "velin-live-dot",
                "menubar": "velin-menubar",
                "popover": "velin-popover",
                "progress-ring": "velin-progress-ring",
                "rating": "velin-rating",
                "scrollspy": "velin-scrollspy",
                "secure-field": "velin-secure-field",
                "segmented-control": "velin-segmented-control",
                "sheet": "velin-sheet",
                "sparkline": "velin-sparkline",
                "velin-code-block": "velin-code-block",
                "velin-search": "velin-search",
            }
            if name in mapping:
                pages.add(mapping[name])
    return pages


def main() -> None:
    wc = load_wc_tags()
    cli = load_cli_commands()
    exports = load_package_exports()
    site_wc = site_component_pages()
    gen_wc = {p.stem for p in (SITE_DOCS / "generated" / "components").glob("velin-*.md")}

    # Canonical WC (exclude deprecated aliases for "dedicated page" check)
    canonical = [t for t in wc if t not in ("velin-stepper-wc", "velin-tooltip-wc")]

    missing_pages = [t for t in canonical if t not in site_wc]
    missing_gen_only = [t for t in canonical if t in gen_wc and t not in site_wc]

    cli_html = (SITE_DOCS / "extend" / "cli.html").read_text(encoding="utf-8", errors="ignore")
    missing_cli = [c for c in cli if c not in cli_html and c != "search"]  # search is subcommand
    if "search" not in cli_html:
        missing_cli.append("search (index)")

    exports_docs = (SITE_DOCS / "extend" / "javascript-api.html").read_text(encoding="utf-8", errors="ignore")
    exports_docs += (SITE_DOCS / "extend" / "core-modules.html").read_text(encoding="utf-8", errors="ignore")
    missing_exports = [e for e in exports if e.lstrip("./") not in exports_docs.replace("@birdapi/velinstyle", "")]

    # count rule ids in scanner-rules-data.js
    rules_text = (FRAMEWORK / "cli" / "scanner-rules-data.js").read_text(encoding="utf-8")
    rule_ids = re.findall(r"id: '([^']+)'", rules_text)
    scanner_html = (SITE_DOCS / "extend" / "cli.html").read_text(encoding="utf-8", errors="ignore")
    if "scanner-rules" in scanner_html and "generated/rules/scanner.md" in scanner_html:
        scanner_note = f"{len(rule_ids)} rules → generated/rules/scanner.md linked"
    else:
        scanner_note = "check scanner section"

    print("=== Web Components (canonical tags) ===")
    print(f"Framework: {len(canonical)} tags")
    print(f"Site HTML pages (mapped): {len([t for t in canonical if t in site_wc])}")
    print(f"Generated MD: {len([t for t in canonical if t in gen_wc])}")
    if missing_pages:
        print("Missing dedicated site HTML page:")
        for t in missing_pages:
            gen = " [generated MD only]" if t in gen_wc else ""
            print(f"  - {t}{gen}")
    else:
        print("All canonical WCs have a mapped components/*.html page (or alias).")

    print("\n=== CLI commands ===")
    print(f"Manifest: {', '.join(cli)}")
    if missing_cli:
        print("Not mentioned in extend/cli.html commands table/sections:")
        for c in missing_cli:
            print(f"  - {c}")
    else:
        print("All CLI commands referenced in cli.html")

    if "velinstyle meta" not in cli_html.lower():
        print("  - meta (velinstyle meta / meta page) — weak or missing section")

    print("\n=== package.json exports ===")
    print(f"Exports: {', '.join(exports)}")
    if missing_exports:
        print("Possibly underdocumented exports:")
        for e in missing_exports:
            print(f"  - {e}")
    else:
        print("All exports appear in core-modules or javascript-api")

    print(f"\n=== Scanner ({scanner_note}) ===")
    perf_in_cli = "perf audit" in cli_html
    pii_in_cli = "--only pii" in cli_html or "pii" in cli_html
    print(f"perf rules in CLI doc: {perf_in_cli}")
    print(f"pii scan documented: {pii_in_cli}")

    # JS APIs without WC page
    js_only = ["flipReorder", "initA11y", "VelinHapticObserver", "focus-manager"]
    for api in js_only:
        found = api.lower().replace("velin", "velin") in exports_docs.lower() or api in exports_docs
        if not found and api == "initA11y":
            found = "initA11y" in (SITE_DOCS / "getting-started" / "accessibility.html").read_text(encoding="utf-8")
        print(f"  {api}: {'OK' if found else 'GAP'}")


if __name__ == "__main__":
    main()
