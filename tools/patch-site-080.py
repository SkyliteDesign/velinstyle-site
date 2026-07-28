#!/usr/bin/env python3
"""Patch velinstyle-site for 0.8.0: versions, CLI docs, guides, search."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
EXT = {".html", ".md", ".json", ".js", ".py", ".css"}


def bump_versions() -> int:
    n = 0
    for path in ROOT.rglob("*"):
        if path.suffix not in EXT or "node_modules" in path.parts or path.is_relative_to(ROOT / "dist"):
            continue
        text = path.read_text(encoding="utf-8")
        new = text.replace("v0.8.0", "v0.8.0").replace("@birdapi/velinstyle@0.8.0", "@birdapi/velinstyle@0.8.0")
        if new != text:
            path.write_text(new, encoding="utf-8", newline="\n")
            n += 1
    return n


def patch_cli_html() -> None:
    path = DOCS / "extend" / "cli.html"
    text = path.read_text(encoding="utf-8")
    if "velinstyle scaffold" in text:
        return
    rows = """
          <tr><td><code>velinstyle scaffold &quot;…&quot;</code></td><td>Generate HTML layouts from a text prompt (0.8.0)</td></tr>
          <tr><td><code>velinstyle layout audit|suggest|fix</code></td><td>Responsive layout audit and safe fixes (0.8.0)</td></tr>"""
    text = text.replace(
        '<tr><td><code>velinstyle tokens build</code></td><td>Generate <code>:root</code> CSS variables from a <code>tokens.json</code> file</td></tr>\n        </tbody>',
        '<tr><td><code>velinstyle tokens build</code></td><td>Generate <code>:root</code> CSS variables from a <code>tokens.json</code> file</td></tr>'
        + rows
        + "\n        </tbody>",
        1,
    )
    scaffold_block = """
      <h2 id="scaffold-080">Scaffold (0.8.0)</h2>
      <p>Map natural-language prompts to composed blueprints — no API key. See <a href="../guides/prompt-scaffolding.html">Prompt scaffolding guide</a>.</p>
      <div class="velin-doc-example"><div class="velin-doc-example__tabs"><button class="velin-doc-example__tab active" data-tab="code">Shell</button></div><div class="velin-doc-example__panel active" data-panel="code"><div class="velin-doc-example__code"><button class="velin-doc-copy-btn" aria-label="Copy code"><velin-icon name="copy" size="14"></velin-icon> Copy</button><pre><code class="language-bash">velinstyle scaffold list-intents
velinstyle scaffold "Navbar with search" -o nav.html
velinstyle scaffold "Dashboard shell" --json</code></pre></div></div></div>

      <h2 id="layout-080">Layout audit (0.8.0)</h2>
      <p>Static checks for flex/grid/responsive issues. See <a href="../guides/responsive-layout.html">Responsive layout guide</a>.</p>
      <div class="velin-doc-example"><div class="velin-doc-example__tabs"><button class="velin-doc-example__tab active" data-tab="code">Shell</button></div><div class="velin-doc-example__panel active" data-panel="code"><div class="velin-doc-example__code"><button class="velin-doc-copy-btn" aria-label="Copy code"><velin-icon name="copy" size="14"></velin-icon> Copy</button><pre><code class="language-bash">velinstyle layout audit ./src
velinstyle layout suggest page.html
velinstyle layout fix page.html --write</code></pre></div></div></div>
"""
    scaffold_block = scaffold_block.replace("<div ", "<div ").replace("</div>", "</div>")
    text = text.replace('<h2 id="blueprint">Blueprint</h2>', scaffold_block + '\n      <h2 id="blueprint">Blueprint</h2>', 1)
    text = text.replace("22 blueprints in 0.7.5", "22 blueprints in 0.8.0")
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_upgrading() -> None:
    path = DOCS / "getting-started" / "upgrading.html"
    text = path.read_text(encoding="utf-8")
    if 'id="v080"' in text:
        return
    block = """
      <h2 id="v080">Upgrading to 0.8.0</h2>
      <p>0.8.0 adds prompt scaffolding and responsive layout auditing to the CLI.</p>
      <ul>
        <li><strong>Scaffold:</strong> <code>velinstyle scaffold "&lt;prompt&gt;"</code> — <a href="../guides/prompt-scaffolding.html">Prompt scaffolding</a>.</li>
        <li><strong>Layout:</strong> <code>velinstyle layout audit|suggest|fix</code> — <a href="../guides/responsive-layout.html">Responsive layout</a>.</li>
      </ul>
"""
    text = text.replace('<h2 id="changelog">', block + '\n      <h2 id="changelog">', 1)
    text = text.replace('<li><a href="#v075">0.7.5</a></li>', '<li><a href="#v075">0.7.5</a></li>\n        <li><a href="#v080">0.8.0</a></li>', 1)
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_guides_index() -> None:
    path = DOCS / "guides" / "index.html"
    text = path.read_text(encoding="utf-8")
    links = """
        <li><a href="prompt-scaffolding.html">Prompt scaffolding (0.8.0)</a></li>
        <li><a href="responsive-layout.html">Responsive layout audit (0.8.0)</a></li>"""
    if "prompt-scaffolding.html" in text:
        return
    text = text.replace(
        '<li><a href="react-vite-starter.html">Vite &amp; React</a></li>',
        '<li><a href="react-vite-starter.html">Vite &amp; React</a></li>' + links,
        1,
    )
    path.write_text(text, encoding="utf-8", newline="\n")


def patch_guides_sidebar() -> None:
    insert = '<li><a href="../guides/prompt-scaffolding.html">Prompt scaffolding</a></li><li><a href="../guides/responsive-layout.html">Responsive layout</a></li>'
    for path in DOCS.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        if "guides/react-vite-starter.html" not in text or "prompt-scaffolding.html" in text:
            continue
        text = text.replace(
            '<li><a href="../guides/react-vite-starter.html">Vite &amp; React</a></li>',
            '<li><a href="../guides/react-vite-starter.html">Vite &amp; React</a></li>' + insert,
            1,
        )
        path.write_text(text, encoding="utf-8", newline="\n")


def patch_search_index() -> None:
    path = DOCS / "search-index.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    urls = {e["url"] for e in data}
    entries = [
        ("Prompt scaffolding", "guides/prompt-scaffolding.html", "velinstyle scaffold blueprint navbar modal dashboard"),
        ("Responsive layout audit", "guides/responsive-layout.html", "velinstyle layout audit suggest fix flex grid responsive"),
    ]
    for title, url, kw in entries:
        if url in urls:
            continue
        data.append(
            {
                "title": title,
                "section": "Guides",
                "url": url,
                "keywords": f"{title} {kw} guides",
            }
        )
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def patch_contents() -> None:
    path = DOCS / "getting-started" / "contents.html"
    text = path.read_text(encoding="utf-8")
    if "scaffold" in text and "0.8.0" in text:
        return
    block = """
      <h2 id="cli-080">CLI (0.8.0)</h2>
      <p><code>velinstyle scaffold</code> and <code>velinstyle layout</code> — see <a href="../guides/prompt-scaffolding.html">Prompt scaffolding</a> and <a href="../extend/cli.html">CLI reference</a>.</p>
"""
    if 'id="animations"' in text:
        text = text.replace('<h2 id="animations">', block + '\n      <h2 id="animations">', 1)
    path.write_text(text, encoding="utf-8", newline="\n")


def create_guide_from_template(slug: str, title: str, lead: str, body: str) -> None:
    tpl = (DOCS / "guides" / "react-vite-starter.html").read_text(encoding="utf-8")
    main = f"""    <main class="velin-doc-main" id="main-content">
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>{title}</li></ol>
      <h1>{title}</h1>
      <p class="lead">{lead}</p>
{body}
      <nav class="velin-doc-prevnext" aria-label="Page navigation"><a href="index.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Guides</span></a><a href="responsive-layout.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Responsive layout</span></a></nav>
    </main>"""
    if slug == "responsive-layout":
        main = main.replace(
            'class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Responsive layout</span>',
            'class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Vite &amp; React</span>',
        ).replace('href="responsive-layout.html"', 'href="react-vite-starter.html"')
        main = main.replace('class="prev"', 'class="prev"').replace(
            '<a href="index.html" class="prev">',
            '<a href="prompt-scaffolding.html" class="prev">',
        )
    out = re.sub(r"<title>.*?</title>", f"<title>{title} · Guides · VelinStyle</title>", tpl, count=1)
    out = re.sub(r'<main class="velin-doc-main" id="main-content">.*?</main>', main, out, count=1, flags=re.S)
    out = out.replace('react-vite-starter.html" class="active"', 'react-vite-starter.html"')
    out = out.replace(f'{slug}.html"', f'{slug}.html" class="active"')
    (DOCS / "guides" / f"{slug}.html").write_text(out, encoding="utf-8", newline="\n")


def create_guides() -> None:
    if (DOCS / "guides" / "prompt-scaffolding.html").exists():
        return
    scaffold_body = """
      <h2 id="commands">Commands</h2>
      <div class="velin-doc-example"><div class="velin-doc-example__tabs"><button class="velin-doc-example__tab active" data-tab="code">Shell</button></div><div class="velin-doc-example__panel active" data-panel="code"><div class="velin-doc-example__code"><button class="velin-doc-copy-btn" aria-label="Copy code"><velin-icon name="copy" size="14"></velin-icon> Copy</button><pre><code class="language-bash">velinstyle scaffold list-intents
velinstyle scaffold "Navbar with logo and search" -o nav.html
velinstyle scaffold "Confirmation modal" --json</code></pre></div></div></div>
      <h2 id="intents">Intents</h2>
      <p>navbar, modal, card, dashboard, login, footer, pricing, empty-state, hero, table, onboarding — matched by DE/EN keywords.</p>
      <h2 id="workflow">Workflow</h2>
      <p>scaffold → <code>layout suggest</code> → <code>scan</code> → integrate into your app.</p>
"""
    scaffold_body = scaffold_body.replace("<div ", "<div ").replace("<div ", "<div ", 3).replace("</div>", "</div>", 3)
    layout_body = """
      <h2 id="commands">Commands</h2>
      <div class="velin-doc-example"><div class="velin-doc-example__tabs"><button class="velin-doc-example__tab active" data-tab="code">Shell</button></div><div class="velin-doc-example__panel active" data-panel="code"><div class="velin-doc-example__code"><button class="velin-doc-copy-btn" aria-label="Copy code"><velin-icon name="copy" size="14"></velin-icon> Copy</button><pre><code class="language-bash">velinstyle layout audit ./samples
velinstyle layout suggest page.html
velinstyle layout fix page.html --dry-run
velinstyle layout fix page.html --write</code></pre></div></div></div>
      <h2 id="rules">Rules</h2>
      <p>grid-missing-row, flex-no-wrap-overflow, missing-container, mobile-hidden-only, viewport-width, table-not-responsive, and more.</p>
      <h2 id="breakpoints">Breakpoints</h2>
      <p>Mobile (default), tablet from <code>48rem</code> (<code>velin-md-*</code>), desktop from <code>62rem</code> (<code>velin-lg-*</code>).</p>
"""
    layout_body = layout_body.replace("</div>", "</div>").replace("<div class=\"velin-doc-example\">", "<div class=\"velin-doc-example\">").replace("</div>\n      <h2", "</div>\n      <h2", 1)
    create_guide_from_template(
        "prompt-scaffolding",
        "Prompt scaffolding",
        "Generate Navbars, modals, cards, and page shells from text prompts using blueprint composition.",
        scaffold_body,
    )
    create_guide_from_template(
        "responsive-layout",
        "Responsive layout audit",
        "Audit HTML for flex, grid, and breakpoint issues; get concrete class suggestions and safe auto-fixes.",
        layout_body,
    )


def main() -> None:
    n = bump_versions()
    patch_cli_html()
    patch_upgrading()
    patch_guides_index()
    patch_guides_sidebar()
    patch_search_index()
    patch_contents()
    create_guides()
    print(f"0.8.0 site patch complete ({n} files version-bumped)")


if __name__ == "__main__":
    main()
