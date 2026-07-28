#!/usr/bin/env python3
"""Create docs/changelog.html from feature-scope template."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
TEMPLATE = SITE / "docs" / "migration.html"
OUT = SITE / "docs" / "changelog.html"

MAIN = r"""
      <ol class="velin-doc-breadcrumb"><li><a href="getting-started/introduction.html">Docs</a></li><li>Changelog</li></ol>
      <h1>Changelog</h1>
      <p class="lead">Release notes for VelinStyle — synced from the framework repository on each site build.</p>
      <p>
        <a href="CHANGELOG.md" class="velin-btn velin-btn--primary velin-btn--sm">Open full changelog (Markdown)</a>
        <a href="https://github.com/SkyliteDesign/velinstyle/blob/main/CHANGELOG.md" class="velin-btn velin-btn--ghost velin-btn--sm" target="_blank" rel="noopener">GitHub</a>
        <a href="getting-started/upgrading.html" class="velin-btn velin-btn--ghost velin-btn--sm">Upgrading guide</a>
      </p>

      <h2 id="highlights">Recent highlights</h2>
      <ul>
        <li><strong>Unreleased / 0.9.0 extension</strong> — Velin-Meta, VelinSearch, motion, highlight, attributes, docs generate, PII scanner.</li>
        <li><strong><a href="https://github.com/SkyliteDesign/velinstyle/releases/tag/v0.9.0">0.9.0</a></strong> — Runtime modules, security fixes, WCAG 2.2, token validate, perf audit.</li>
        <li><strong><a href="https://github.com/SkyliteDesign/velinstyle/releases/tag/v0.8.0">0.8.0</a></strong> — Sparkline, counter, live-dot, scaffold, layout CLI, motion tokens.</li>
      </ul>

      <h2 id="full">Full changelog</h2>
      <p>The complete <a href="CHANGELOG.md">CHANGELOG.md</a> includes breaking changes, migration steps, and every added/fixed entry. Use the Markdown viewer (click the link) or open the file on GitHub.</p>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="guides/feature-scope.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Feature scope</span></a>
        <a href="getting-started/upgrading.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Upgrading</span></a>
      </nav>
"""

TOC = """
        <li><a href="#highlights">Recent highlights</a></li>
        <li><a href="#full">Full changelog</a></li>
"""


def main() -> None:
    text = TEMPLATE.read_text(encoding="utf-8")
    text = re.sub(
        r"<title>[^<]*· VelinStyle</title>",
        "<title>Changelog · VelinStyle</title>",
        text,
        count=1,
    )
    text = re.sub(
        r'<meta name="description" content="[^"]*">',
        '<meta name="description" content="VelinStyle release notes — CHANGELOG.md synced from the framework repo.">',
        text,
        count=1,
    )
    text = re.sub(
        r'<script type="application/vnd\.velinstyle\.meta\+json" id="velin-meta">[\s\S]*?</script>\s*',
        "",
        text,
        count=1,
    )
    text = re.sub(
        r"<script>\s*\(function \(\) \{[\s\S]*?velin-agent\.json[\s\S]*?\}\)\(\);\s*</script>\s*",
        "",
        text,
        count=1,
    )
    text = re.sub(
        r"<main class=\"velin-doc-main\" id=\"main-content\">.*?</nav>\s*</main>",
        f"<main class=\"velin-doc-main\" id=\"main-content\">{MAIN}\n</main>",
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r"<ul class=\"velin-doc-toc__list\">.*?</ul>",
        f'<ul class="velin-doc-toc__list">{TOC}\n      </ul>',
        text,
        count=1,
        flags=re.S,
    )
    OUT.write_text(text, encoding="utf-8")

    import importlib.util

    spec = importlib.util.spec_from_file_location("sync", SITE / "tools" / "sync-sidebar.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.patch_file(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
