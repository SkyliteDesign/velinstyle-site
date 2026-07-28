#!/usr/bin/env python3
"""Insert or replace the 0.9.0 extension showcase on index.html."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
INDEX = SITE / "index.html"
MARKER = "    <!-- ═══ INSTALL ═══ -->"

BLOCK = """
    <!-- ═══ 0.9.0 EXTENSION APIs ═══ -->
    <section id="extension" class="site-section site-section--extension" aria-labelledby="extension-title">
      <motion>
      <motion>
      <div class="site-section__inner">
        <div class="site-section__header">
          <span class="site-section__eyebrow">0.9.0 extension</span>
          <h2 class="site-section__title" id="extension-title">Search, motion, highlight &amp; attributes</h2>
          <p class="site-section__desc">
            Alles aus dem CHANGELOG-Block <strong>Unreleased — 0.9.0 extension</strong>: neue Runtime-Module, Web Components,
            CLI-Index und Subpath-Exports — live auf dieser Seite (Reveal, Counter, Sparkline, Code-Block).
          </p>
        </div>
        <div class="extension-grid">
          <article class="extension-card" velin-reveal="slide-up">
            <span class="extension-card__tag">Added</span>
            <h3 class="extension-card__title">VelinHighlight</h3>
            <p class="extension-card__text">
              <code>core/highlight/</code> — <code>velinSyntax</code>, <code>highlightElement</code>, <code>initHighlight</code>,
              <code>registerLanguage</code>, lazy in-view. Lexer: JS/TS, HTML, CSS, JSON, Markdown, Shell, SQL. OKLCH/P3 in <code>highlight.css</code>.
            </p>
            <velin-code-block language="js" line-numbers>import { initHighlight } from '@birdapi/velinstyle/highlight';
initHighlight(document);</velin-code-block>
            <a href="docs/guides/syntax-highlight.html" class="velin-btn velin-btn--ghost velin-btn--sm">Syntax guide</a>
          </article>
          <article class="extension-card" velin-reveal="slide-up">
            <span class="extension-card__tag">Added</span>
            <h3 class="extension-card__title">&lt;velin-code-block&gt;</h3>
            <p class="extension-card__text">
              Web Component: Copy, Zeilennummern, Zeilen-Highlight, collapsible. <code>velin-code</code>-Bridge mit lazy Highlight (siehe Block oben).
            </p>
            <a href="https://github.com/SkyliteDesign/velinstyle/blob/main/samples/velin-code-block.html" class="velin-btn velin-btn--ghost velin-btn--sm" target="_blank" rel="noopener">Sample</a>
          </article>
          <article class="extension-card" velin-reveal="slide-up">
            <span class="extension-card__tag">Added</span>
            <h3 class="extension-card__title">VelinSearch</h3>
            <p class="extension-card__text">
              <code>core/search/</code> — <code>velinSearch</code>, <code>createSearch</code>, <code>registerSearchProvider</code>.
              Fuzzy offline search, Treffer-Highlight, Kategorien. Docs-Header nutzt dieselbe Engine.
            </p>
            <a href="docs/guides/velin-search.html" class="velin-btn velin-btn--ghost velin-btn--sm">VelinSearch guide</a>
          </article>
          <article class="extension-card" velin-reveal="slide-up">
            <span class="extension-card__tag">Added</span>
            <h3 class="extension-card__title">&lt;velin-search&gt;</h3>
            <p class="extension-card__text">
              Autocomplete-Web Component: Tastatur-Navigation, gruppierte Ergebnisse — für Docs und Apps.
            </p>
            <a href="docs/components/velin-search.html" class="velin-btn velin-btn--ghost velin-btn--sm">Component docs</a>
          </article>
          <article class="extension-card" velin-reveal="slide-up">
            <span class="extension-card__tag">Added · CLI</span>
            <h3 class="extension-card__title">Search index</h3>
            <p class="extension-card__text">
              <code>velinstyle search index</code> → <code>dist/search-index.json</code>.
              <code>docs generate</code> kann Index + <code>docs/generated/attributes/</code> mit ausgeben.
            </p>
            <a href="docs/extend/cli.html#search-index" class="velin-btn velin-btn--ghost velin-btn--sm">CLI</a>
          </article>
          <article class="extension-card" velin-reveal="slide-up">
            <span class="extension-card__tag">Added</span>
            <h3 class="extension-card__title">Motion runtime</h3>
            <p class="extension-card__text">
              <code>core/motion/</code> — <code>initMotion</code>, <code>velinMotion</code>, rAF-Scheduler, Stagger, Smooth Scroll.
              Einheitlich <code>.velin-in-view</code> + CSS <code>animation-timeline: view()</code> Fallback.
            </p>
            <a href="docs/guides/motion-attributes.html" class="velin-btn velin-btn--ghost velin-btn--sm">Motion guide</a>
          </article>
          <article class="extension-card" velin-reveal="slide-up">
            <span class="extension-card__tag">Added</span>
            <h3 class="extension-card__title">HTML attributes</h3>
            <p class="extension-card__text">
              <code>core/attributes/</code> — 20+ Bridges: <code>velin-modal</code>, <code>velin-tabs</code>, <code>velin-reveal</code>, <code>velin-code</code>, …
              <code>bootFromDOM({ attributes: true, highlight: true })</code>.
            </p>
            <a href="docs/guides/html-attributes.html" class="velin-btn velin-btn--ghost velin-btn--sm">Attributes</a>
          </article>
          <article class="extension-card extension-card--wide" velin-reveal="slide-up">
            <span class="extension-card__tag">Added · Exports</span>
            <h3 class="extension-card__title">Subpaths &amp; CSS</h3>
            <p class="extension-card__text">
              <code>@birdapi/velinstyle/search</code>,
              <code>/motion</code>,
              <code>/attributes</code>,
              <code>/highlight</code>
              — plus <code>components/search.css</code>, <code>components/attributes.css</code>.
              Samples: <code>samples/velin-search.html</code>, <code>samples/velin-attributes.html</code>.
            </p>
            <div class="extension-card__links">
              <a href="docs/guides/velin-search.html">search guide</a>
              <a href="docs/guides/motion-attributes.html">motion guide</a>
              <a href="docs/guides/syntax-highlight.html">highlight guide</a>
            </div>
          </article>
          <article class="extension-card extension-card--wide" velin-reveal="slide-up">
            <span class="extension-card__tag">Changed</span>
            <h3 class="extension-card__title">Runtime integration</h3>
            <p class="extension-card__text">
              <code>velin-reveal.js</code> delegiert an <code>core/motion</code>.
              <code>components/runtime</code> lädt Search, Copy, Tooltip, Accordion, Theme-Toggle, Progress-Ring.
              Diese Landing-Page: <code>data-velin-reveal-auto</code> auf <code>&lt;html&gt;</code>, Scroll-Progress, Counter, Sparkline.
            </p>
          </article>
        </div>
      </div>
    </section>

""".replace("<motion>\n      ", "").replace("<motion>\n      ", "")


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    # Remove old extension block if present
    text = re.sub(
        r"\n    <!-- ═══ 0\.9\.0 EXTENSION APIs ═══ -->.*?</section>\n",
        "\n",
        text,
        count=1,
        flags=re.S,
    )
    if MARKER not in text:
        raise SystemExit("install marker not found")
    text = text.replace(MARKER, BLOCK + MARKER, 1)
    INDEX.write_text(text, encoding="utf-8")
    print(f"Wrote extension section to {INDEX}")


if __name__ == "__main__":
    main()
