#!/usr/bin/env python3
"""Build showcase/index.html from showcase/projects.json."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse

SITE = Path(__file__).resolve().parents[1]
FRAMEWORK = SITE.parent / "velinstyle"
PROJECTS = SITE / "showcase" / "projects.json"
OUT = SITE / "showcase" / "index.html"
IMG_DIR = SITE / "assets" / "img" / "showcase"


def framework_version() -> str:
    try:
        data = json.loads((FRAMEWORK / "package.json").read_text(encoding="utf-8"))
        return str(data.get("version") or "0.0.0")
    except Exception:
        return "0.0.0"


def hostname(url: str) -> str:
    host = urlparse(url).hostname or url
    return host.removeprefix("www.")


def initials(title: str) -> str:
    parts = re.findall(r"[A-Za-z0-9ÄÖÜäöüß]+", title)
    if not parts:
        return "?"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[1][0]).upper()


def card_html(project: dict) -> str:
    pid = html.escape(project["id"], quote=True)
    title = html.escape(project["title"])
    url = html.escape(project["url"], quote=True)
    desc = html.escape(project.get("description") or "")
    host = html.escape(hostname(project["url"]))
    tags = project.get("tags") or []
    image_rel = project.get("image") or f"../assets/img/showcase/{project['id']}.webp"
    image_path = (SITE / "showcase" / image_rel).resolve()
    has_image = image_path.is_file()
    label = html.escape(f"Visit {project['title']} ({hostname(project['url'])})", quote=True)
    init = html.escape(initials(project["title"]))

    tag_html = "".join(
        f'<span class="showcase-card__tag">{html.escape(str(t))}</span>' for t in tags
    )

    if has_image:
        media = (
            f'<div class="showcase-card__media">'
            f'<img src="{html.escape(image_rel, quote=True)}" alt="" width="1280" height="800" '
            f'loading="lazy" decoding="async">'
            f"</div>"
        )
    else:
        media = (
            f'<div class="showcase-card__media showcase-card__media--fallback" aria-hidden="true">'
            f'<span class="showcase-card__initials">{init}</span>'
            f"</div>"
        )

    return f"""      <a class="showcase-card" href="{url}" target="_blank" rel="noopener noreferrer" aria-label="{label}" data-project="{pid}">
{media}
        <div class="showcase-card__body">
          <p class="showcase-card__host">{host}</p>
          <h2 class="showcase-card__title">{title}</h2>
          <p class="showcase-card__desc">{desc}</p>
          <div class="showcase-card__tags">{tag_html}</div>
          <span class="showcase-card__cta">Visit site →</span>
        </div>
      </a>"""


def page_html(version: str, cards: str, count: int) -> str:
    v = html.escape(version)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- velin-seo -->
  <link rel="canonical" href="https://velinstyle.info/showcase/">
  <meta name="description" content="Live projects built with VelinStyle — real sites with screenshot previews.">
  <link rel="alternate" type="application/vnd.velinstyle.meta+json" href="../dist/velin-agent.json" title="VelinStyle agent metadata">
  <link rel="alternate" type="text/plain" href="../dist/llms.txt" title="VelinStyle llms.txt">
  <script type="application/ld+json">{{"@context":"https://schema.org","@type":"CollectionPage","name":"VelinStyle Showcase","description":"Live projects built with VelinStyle","url":"https://velinstyle.info/showcase/","isPartOf":{{"@type":"WebSite","name":"VelinStyle","url":"https://velinstyle.info/"}}}}</script>
  <!-- /velin-seo -->
  <title>Showcase — Live projects · VelinStyle</title>
  <link rel="icon" href="../assets/img/velinstyle-logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../dist/velinstyle.min.css">
  <script src="../assets/js/velin-theme-init.js"></script>
  <script>document.documentElement.setAttribute('data-velin-themes-base','../dist/themes');</script>
  <link rel="stylesheet" href="showcase.css">
</head>
<body>
  <a href="#main" class="velin-skip-link">Skip to main content</a>
  <header class="showcase-bar">
    <div class="showcase-bar__inner">
      <a href="../index.html">← VelinStyle home</a>
      <nav class="showcase-bar__nav" aria-label="Showcase navigation">
        <a href="../demos/index.html">Demos</a>
        <a href="../docs/getting-started/introduction.html">Docs</a>
      </nav>
      <velin-theme-toggle themes-base="../dist/themes/"></velin-theme-toggle>
    </div>
  </header>
  <main id="main">
    <div class="showcase-hero">
      <p class="showcase-hero__eyebrow">Built with VelinStyle · v{v}</p>
      <h1>Live projects</h1>
      <p>
        Real sites in production — each card shows a static screenshot of the live URL.
        Framework demos live under <a href="../demos/index.html">Demos</a>.
      </p>
    </div>
    <p class="showcase-count" aria-live="polite">{count} project{"s" if count != 1 else ""}</p>
    <div class="showcase-grid">
{cards}
    </div>
  </main>
  <footer class="showcase-footer">
    <p>
      Want your project listed?
      <a href="https://github.com/SkyliteDesign/velinstyle-site" target="_blank" rel="noopener noreferrer">Open an issue</a>
      or add an entry to <code>showcase/projects.json</code>.
    </p>
  </footer>
  <script src="../dist/velinstyle-components.iife.js"></script>
</body>
</html>
"""


def main() -> None:
    projects = json.loads(PROJECTS.read_text(encoding="utf-8"))
    if not isinstance(projects, list):
        raise SystemExit("projects.json must be a JSON array")

    IMG_DIR.mkdir(parents=True, exist_ok=True)
    cards = "\n".join(card_html(p) for p in projects)
    version = framework_version()
    OUT.write_text(page_html(version, cards, len(projects)), encoding="utf-8", newline="\n")
    missing = [p["id"] for p in projects if not (IMG_DIR / f"{p['id']}.webp").is_file()]
    print(f"Wrote {OUT.relative_to(SITE)} ({len(projects)} projects)")
    if missing:
        print(f"Missing screenshots (run npm run capture:showcase): {', '.join(missing)}")


if __name__ == "__main__":
    main()
