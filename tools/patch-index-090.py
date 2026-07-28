#!/usr/bin/env python3
"""Insert 0.9.0 dev-toolkit card into site index.html if missing."""
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
INDEX = SITE / "index.html"

CARD = """
          <article class="dev-toolkit-card">
            <div class="dev-toolkit-card__meta">
              <span class="dev-toolkit-card__tag">0.9.0</span>
            </div>
            <h3 class="dev-toolkit-card__title">Perf, tokens &amp; API docs</h3>
            <p class="dev-toolkit-card__text">
              <code>perf audit</code>, <code>tokens validate</code>, PII scan, and <code>docs generate</code> for always-fresh Markdown reference.
            </p>
            <div class="dev-toolkit-card__actions" style="display:flex;gap:0.5rem;flex-wrap:wrap">
              <a href="docs/guides/performance-audit.html" class="velin-btn velin-btn--primary velin-btn--sm">Performance</a>
              <a href="docs/guides/design-tokens.html" class="velin-btn velin-btn--ghost velin-btn--sm">Tokens</a>
              <a href="docs/guides/api-reference.html" class="velin-btn velin-btn--ghost velin-btn--sm">API reference</a>
            </div>
          </article>
"""


def main() -> None:
    t = INDEX.read_text(encoding="utf-8")
    if "Perf, tokens &amp; API docs" in t:
        print("0.9.0 dev card already present")
        return
    needle = '<div class="dev-toolkit__grid velin-animate-on-scroll">'
    insert_at = t.find(needle)
    if insert_at == -1:
        raise SystemExit("dev-toolkit grid not found")
    end = t.find('<article class="dev-toolkit-card">', insert_at)
    if end == -1:
        raise SystemExit("first dev-toolkit-card not found")
    t = t[:end] + CARD + "\n" + t[end:]
    INDEX.write_text(t, encoding="utf-8")
    print("Inserted 0.9.0 dev-toolkit card")


if __name__ == "__main__":
    main()
