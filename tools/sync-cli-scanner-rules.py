#!/usr/bin/env python3
"""Inject full scanner rules tables into docs/extend/cli.html from scanner-rules-data.js."""
from __future__ import annotations

import html
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
FRAMEWORK = SITE.parent / "velinstyle"
CLI_HTML = SITE / "docs" / "extend" / "cli.html"
RULES_JS = FRAMEWORK / "cli" / "scanner-rules-data.js"

RULE_RE = re.compile(
    r"\{\s*id:\s*'([^']+)',\s*category:\s*'([^']+)',\s*severity:\s*'([^']+)',\s*"
    r"message:\s*'((?:\\'|[^'])*)',\s*fixHint:\s*'((?:\\'|[^'])*)'\s*\}",
)

FIXABLE = {
    "security/safe-external-link": "yes — adds <code>rel=\"noopener noreferrer\"</code>",
    "a11y/html-lang": "yes — sets <code>lang</code> on <code>&lt;html&gt;</code> (<code>--fix-lang</code>)",
    "a11y/skip-link": "yes — inserts skip link when <code>id=\"main\"</code> exists",
    "css/z-index-token": "yes — maps raw integers toward <code>--velin-z-*</code> tokens",
    "pii/hardcoded-email": "yes — masks to placeholder (<code>--fix</code>)",
}

CAT_LABEL = {
    "security": "Security",
    "pii": "PII",
    "a11y": "Accessibility",
    "css": "CSS",
    "perf": "Performance",
}

CAT_ORDER = ["security", "pii", "a11y", "css", "perf"]
CAT_ANCHOR = {
    "security": "scanner-security",
    "pii": "scanner-pii",
    "a11y": "scanner-a11y",
    "css": "scanner-css",
    "perf": "scanner-perf",
}


def load_rules() -> list[dict]:
    text = RULES_JS.read_text(encoding="utf-8")
    rules = []
    for m in RULE_RE.finditer(text):
        rules.append({
            "id": m.group(1),
            "category": m.group(2),
            "severity": m.group(3),
            "message": m.group(4).replace("\\'", "'"),
            "fixHint": m.group(5).replace("\\'", "'"),
        })
    return rules


def esc(s: str) -> str:
    return html.escape(s, quote=False)


def table_for(rules: list[dict]) -> str:
    rows = []
    for r in rules:
        fix = FIXABLE.get(r["id"], "no")
        rows.append(
            f"<tr><td><code>{esc(r['id'])}</code></td>"
            f"<td>{esc(CAT_LABEL.get(r['category'], r['category']))}</td>"
            f"<td>{esc(r['severity'].title())}</td>"
            f"<td>{fix}</td></tr>"
        )
    return (
        '<table class="velin-table">'
        "<thead><tr><th>Rule ID</th><th>Category</th><th>Severity</th>"
        "<th>Fixable (<code>--fix</code>)</th></tr></thead>"
        f"<tbody>{''.join(rows)}</tbody></table>"
    )


def build_section(rules: list[dict]) -> str:
    by_cat: dict[str, list[dict]] = {c: [] for c in CAT_ORDER}
    for r in rules:
        by_cat.setdefault(r["category"], []).append(r)

    parts = [
        '      <h3 id="scanner-rules">Scanner rules</h3>',
        "      <p>Severities label findings in text/JSON output. "
        "<code>--severity</code> sets the minimum level included "
        "(<code>warning</code> hides <code>info</code> only). "
        "Filter with <code>--only security</code>, <code>--only a11y</code>, "
        "<code>--only pii</code>. "
        "Performance checks run via <code>velinstyle perf audit</code> (see Performance table).</p>",
        '      <div class="velin-alert velin-alert--info velin-mbe-4" role="note">'
        '<div class="velin-alert__content">'
        "<strong>Full reference:</strong> "
        '<a href="../generated/rules/scanner.md">generated/rules/scanner.md</a> '
        "(auto-synced from <code>cli/scanner-rules-data.js</code> in the framework repo)."
        "</div></div>",
    ]
    for cat in CAT_ORDER:
        items = by_cat.get(cat, [])
        if not items:
            continue
        anchor = CAT_ANCHOR[cat]
        label = CAT_LABEL[cat]
        parts.append(f'      <h4 id="{anchor}">{label}</h4>')
        parts.append(f"      {table_for(items)}")
    return "\n".join(parts) + "\n\n"


SECTION_RE = re.compile(
    r'<h3 id="scanner-rules">.*?(?=<h2 id="configuration">)',
    re.DOTALL,
)


def main() -> None:
    rules = load_rules()
    section = build_section(rules)
    text = CLI_HTML.read_text(encoding="utf-8")
    if not SECTION_RE.search(text):
        raise SystemExit("scanner-rules section not found in cli.html")
    text = SECTION_RE.sub(section, text, count=1)
    CLI_HTML.write_text(text, encoding="utf-8")
    print(f"Updated cli.html with {len(rules)} scanner rules")


if __name__ == "__main__":
    main()
