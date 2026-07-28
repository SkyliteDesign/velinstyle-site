#!/usr/bin/env python3
"""Fix 0.7.5 stub WC pages, guide sidebars, guides index, and landing page for 0.8.0."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPONENTS = ROOT / "docs" / "components"
TEMPLATE = COMPONENTS / "drawer.html"
# Sidebar: use tools/sync-sidebar.py (single source of truth)

PAGES = [
    {
        "slug": "announcer",
        "title": "Announcer",
        "tag": "velin-announcer",
        "tag_close": "velin-announcer",
        "lead": "The <code>&lt;velin-announcer&gt;</code> component exposes an ARIA live region for polite screen-reader updates after async actions.",
        "preview": """            <velin-announcer></velin-announcer>
            <button type="button" class="velin-btn velin-btn--primary velin-btn--sm" id="demo-announce">Announce “Saved”</button>""",
        "code": """&lt;velin-announcer&gt;&lt;/velin-announcer&gt;
&lt;script&gt;
  VelinAnnouncer.announceGlobal('Saved');
&lt;/script&gt;""",
        "extra": """      <h2 id="api">JavaScript API</h2>
      <table class="velin-doc-table">
        <thead><tr><th>API</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>VelinAnnouncer.announceGlobal(message)</code></td><td>Announce via the first <code>velin-announcer</code> on the page</td></tr>
          <tr><td><code>element.announce(message)</code></td><td>Announce on a specific instance</td></tr>
        </tbody>
      </table>""",
        "toc": [("example", "Example"), ("api", "JavaScript API"), ("import", "Import")],
        "prev": ("collapse", "Collapse"),
        "next": ("bottom-nav", "Bottom navigation"),
        "script": """document.getElementById('demo-announce')?.addEventListener('click', () => {
  if (window.VelinAnnouncer?.announceGlobal) window.VelinAnnouncer.announceGlobal('Saved');
  else document.querySelector('velin-announcer')?.announce?.('Saved');
});""",
    },
    {
        "slug": "bottom-nav",
        "title": "Bottom navigation",
        "tag": "velin-bottom-nav",
        "tag_close": "velin-bottom-nav",
        "lead": "The <code>&lt;velin-bottom-nav&gt;</code> component provides a mobile-first tab bar with safe-area padding. Set <code>current</code> to match <code>data-nav</code> on links.",
        "preview": """            <velin-bottom-nav current="home" style="max-width:24rem">
              <a href="#home" data-nav="home" current>Home</a>
              <a href="#search" data-nav="search">Search</a>
              <a href="#profile" data-nav="profile">Profile</a>
            </velin-bottom-nav>""",
        "code": """&lt;velin-bottom-nav current="home"&gt;
  &lt;a href="/" data-nav="home" current&gt;Home&lt;/a&gt;
  &lt;a href="/search" data-nav="search"&gt;Search&lt;/a&gt;
&lt;/velin-bottom-nav&gt;""",
        "extra": """      <h2 id="accessibility">Accessibility</h2>
      <ul>
        <li>Navigation landmark with <code>aria-label</code> on the host.</li>
        <li>Current page exposed via <code>aria-current="page"</code> on the active link.</li>
        <li>Pair with desktop nav utilities — see <a href="../guides/responsive-layout.html">responsive layout guide</a>.</li>
      </ul>""",
        "toc": [("example", "Example"), ("accessibility", "Accessibility"), ("import", "Import")],
        "prev": ("announcer", "Announcer"),
        "next": ("combobox", "Combobox"),
    },
    {
        "slug": "combobox",
        "title": "Combobox",
        "tag": "velin-combobox",
        "tag_close": "velin-combobox",
        "lead": "The <code>&lt;velin-combobox&gt;</code> component combines a text field and filterable listbox. Place the input in the <code>trigger</code> slot; options use <code>role=\"option\"</code>.",
        "preview": """            <velin-combobox aria-label="Fruit picker" style="max-width:20rem">
              <input type="text" slot="trigger" class="velin-input" placeholder="Pick a fruit" aria-label="Fruit" />
              <button type="button" role="option">Apple</button>
              <button type="button" role="option">Banana</button>
              <button type="button" role="option">Cherry</button>
            </velin-combobox>""",
        "code": """&lt;velin-combobox aria-label="Fruit picker"&gt;
  &lt;input slot="trigger" class="velin-input" aria-label="Fruit" /&gt;
  &lt;button type="button" role="option"&gt;Apple&lt;/button&gt;
&lt;/velin-combobox&gt;""",
        "extra": """      <h2 id="events">Events</h2>
      <table class="velin-doc-table">
        <thead><tr><th>Event</th><th>Detail</th></tr></thead>
        <tbody><tr><td><code>velin-select</code></td><td><code>{ option }</code></td></tr></tbody>
      </table>""",
        "toc": [("example", "Example"), ("events", "Events"), ("import", "Import")],
        "prev": ("bottom-nav", "Bottom navigation"),
        "next": ("command", "Command palette"),
    },
    {
        "slug": "command",
        "title": "Command palette",
        "tag": "velin-command",
        "tag_close": "velin-command",
        "lead": "The <code>&lt;velin-command&gt;</code> component is a filterable command overlay (⌘K-style). Call <code>open()</code> / <code>close()</code> from your app shell.",
        "preview": """            <button type="button" class="velin-btn velin-btn--outline" id="demo-command-open">Open palette</button>
            <velin-command id="demo-command">
              <button type="button">Dashboard</button>
              <button type="button">Settings</button>
              <button type="button">Sign out</button>
            </velin-command>""",
        "code": """&lt;button id="open-cmd"&gt;Open palette&lt;/button&gt;
&lt;velin-command id="cmd"&gt;
  &lt;button type="button"&gt;Dashboard&lt;/button&gt;
&lt;/velin-command&gt;""",
        "extra": """      <h2 id="api">JavaScript API</h2>
      <table class="velin-doc-table">
        <thead><tr><th>Method</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>open()</code></td><td>Show the palette and focus the filter field</td></tr>
          <tr><td><code>close()</code></td><td>Dismiss the overlay</td></tr>
        </tbody>
      </table>""",
        "toc": [("example", "Example"), ("api", "JavaScript API"), ("import", "Import")],
        "prev": ("combobox", "Combobox"),
        "next": ("menubar", "Menubar"),
        "script": "document.getElementById('demo-command-open')?.addEventListener('click', () => document.getElementById('demo-command')?.open());",
    },
    {
        "slug": "menubar",
        "title": "Menubar",
        "tag": "velin-menubar",
        "tag_close": "velin-menubar",
        "lead": "The <code>&lt;velin-menubar&gt;</code> component implements a horizontal menubar with arrow-key navigation between <code>role=\"menuitem\"</code> children.",
        "preview": """            <velin-menubar aria-label="File actions">
              <button type="button" role="menuitem">New</button>
              <button type="button" role="menuitem">Open</button>
              <button type="button" role="menuitem">Save</button>
            </velin-menubar>""",
        "code": """&lt;velin-menubar aria-label="File"&gt;
  &lt;button type="button" role="menuitem"&gt;New&lt;/button&gt;
&lt;/velin-menubar&gt;""",
        "extra": "",
        "toc": [("example", "Example"), ("import", "Import")],
        "prev": ("command", "Command palette"),
        "next": ("rating", "Rating"),
    },
    {
        "slug": "rating",
        "title": "Rating",
        "tag": "velin-rating",
        "tag_close": "velin-rating",
        "lead": "The <code>&lt;velin-rating&gt;</code> component renders an accessible star rating as a radiogroup. Use the <code>value</code> attribute for the current score.",
        "preview": """            <velin-rating value="3" aria-label="Product rating"></velin-rating>""",
        "code": '&lt;velin-rating value="4" aria-label="Rating"&gt;&lt;/velin-rating&gt;',
        "extra": "",
        "toc": [("example", "Example"), ("import", "Import")],
        "prev": ("menubar", "Menubar"),
        "next": ("segmented-control", "Segmented control"),
    },
    {
        "slug": "segmented-control",
        "title": "Segmented control",
        "tag": "velin-segmented-control",
        "tag_close": "velin-segmented-control",
        "lead": "The <code>&lt;velin-segmented-control&gt;</code> component is a toggle group with <code>aria-pressed</code> on each segment. Mark the default with the <code>selected</code> attribute.",
        "preview": """            <velin-segmented-control aria-label="View mode">
              <button type="button" selected>List</button>
              <button type="button">Grid</button>
              <button type="button">Board</button>
            </velin-segmented-control>""",
        "code": """&lt;velin-segmented-control aria-label="View"&gt;
  &lt;button type="button" selected&gt;List&lt;/button&gt;
  &lt;button type="button"&gt;Grid&lt;/button&gt;
&lt;/velin-segmented-control&gt;""",
        "extra": "",
        "toc": [("example", "Example"), ("import", "Import")],
        "prev": ("rating", "Rating"),
        "next": ("sheet", "Sheet"),
    },
    {
        "slug": "sheet",
        "title": "Sheet",
        "tag": "velin-sheet",
        "tag_close": "velin-sheet",
        "lead": "The <code>&lt;velin-sheet&gt;</code> component is a bottom sheet dialog with focus trap and scroll lock. Methods: <code>open()</code> and <code>close()</code>.",
        "preview": """            <button type="button" class="velin-btn velin-btn--primary" id="demo-sheet-open">Open sheet</button>
            <velin-sheet id="demo-sheet" title="Settings"><p class="velin-p-4">Sheet body content.</p></velin-sheet>""",
        "code": """&lt;velin-sheet id="sheet" title="Settings"&gt;&lt;p&gt;Content&lt;/p&gt;&lt;/velin-sheet&gt;""",
        "extra": """      <h2 id="accessibility">Accessibility</h2>
      <ul>
        <li><code>role="dialog"</code> and <code>aria-modal="true"</code> while open.</li>
        <li>Focus trap and <kbd>Escape</kbd> to close.</li>
      </ul>""",
        "toc": [("example", "Example"), ("accessibility", "Accessibility"), ("import", "Import")],
        "prev": ("segmented-control", "Segmented control"),
        "next": ("dialog", "Dialog"),
        "script": "document.getElementById('demo-sheet-open')?.addEventListener('click', () => document.getElementById('demo-sheet')?.open());",
    },
]


def example_block(preview: str, code: str) -> str:
    return f"""      <motion class="velin-doc-example">
        <div class="velin-doc-example__tabs"><button class="velin-doc-example__tab active" data-tab="preview">Preview</button><button class="velin-doc-example__tab" data-tab="code">HTML</button></div>
        <div class="velin-doc-example__panel active" data-panel="preview">
          <div class="velin-doc-example__preview">
{preview}
          </div>
        </div>
        <div class="velin-doc-example__panel" data-panel="code">
          <div class="velin-doc-example__code">
            <button class="velin-doc-copy-btn" aria-label="Copy code"><velin-icon name="copy" size="14"></velin-icon> Copy</button>
            <pre><code class="language-html">{code}</code></pre>
          </motion>
        </div>
      </div>""".replace("<motion ", "<div ").replace("</motion>", "</div>")


def build_main(page: dict) -> str:
    prev_slug, prev_title = page["prev"]
    next_slug, next_title = page["next"]
    extra = page.get("extra", "")
    script = page.get("script", "")
    script_block = f"\n  <script>\n{script}\n  </script>" if script else ""
    return f"""      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../components/accordion.html">Components</a></li><li>{page['title']}</li></ol>

      <h1>{page['title']}</h1>
      <p class="lead">{page['lead']} Added in <strong>0.7.5</strong>.</p>

      <h2 id="example">Example</h2>
{example_block(page['preview'], page['code'])}
{extra}
      <h2 id="import">Import</h2>
      <p>Load the bundle once, then use the custom element in your markup:</p>
      <div class="velin-doc-example">
        <div class="velin-doc-example__tabs"><button class="velin-doc-example__tab active" data-tab="code">HTML</button></div>
        <div class="velin-doc-example__panel active" data-panel="code">
          <div class="velin-doc-example__code">
            <button class="velin-doc-copy-btn" aria-label="Copy code"><velin-icon name="copy" size="14"></velin-icon> Copy</button>
            <pre><code class="language-html">&lt;script type="module" src="../../dist/velinstyle-components.min.js"&gt;&lt;/script&gt;
&lt;{page['tag']}&gt;…&lt;/{page['tag_close']}&gt;</code></pre>
          </div>
        </div>
      </div>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="../components/{prev_slug}.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">{prev_title}</span></a>
        <a href="../components/{next_slug}.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">{next_title}</span></a>
      </nav>{script_block}"""


def build_toc(page: dict) -> str:
    items = "".join(f'<li><a href="#{aid}">{label}</a></li>' for aid, label in page["toc"])
    return f"""    <aside class="velin-doc-toc" aria-label="On this page">
      <motion class="velin-doc-toc__title">On this page</div>
      <ul class="velin-doc-toc__list">{items}</ul>
    </aside>""".replace("<motion class=\"velin-doc-toc__title\">", '<motion class="velin-doc-toc__title">').replace(
        '<motion class="velin-doc-toc__title">', '<div class="velin-doc-toc__title">', 1
    )


def rewrite_component_pages() -> None:
    tpl = TEMPLATE.read_text(encoding="utf-8")
    main_open = '<main class="velin-doc-main" id="main-content">'
    start = tpl.index(main_open) + len(main_open)
    end = tpl.index("</main>") + len("</main>")
    prefix = tpl[: tpl.index(main_open)] + main_open + "\n"
    suffix = tpl[end:]

    for page in PAGES:
        slug = page["slug"]
        html = prefix + build_main(page) + suffix
        html = re.sub(
            r"<title>[^<]+</title>",
            f"<title>{page['title']} · VelinStyle</title>",
            html,
            count=1,
        )
        html = re.sub(
            r'<meta name="description" content="[^"]*">',
            f'<meta name="description" content="VelinStyle {page["title"]} — {page["tag"]} Web Component documentation.">',
            html,
            count=1,
        )
        html = re.sub(r' class="active"', "", html)
        html = html.replace(
            f'href="../components/{slug}.html"',
            f'href="../components/{slug}.html" class="active"',
            1,
        )
        toc_old = re.search(r'<aside class="velin-doc-toc".*?</aside>', html, re.DOTALL)
        if toc_old:
            html = html[: toc_old.start()] + build_toc(page) + html[toc_old.end() :]
        html = html.replace("<motion ", "<div ").replace("</motion>", "</div>")
        (COMPONENTS / f"{slug}.html").write_text(html, encoding="utf-8", newline="\n")
        print("component page:", slug)


def patch_guide_sidebars() -> None:
    """Deprecated — sidebars come from sync-sidebar.py only."""
    pass


def patch_guides_index() -> None:
    path = ROOT / "docs" / "guides" / "index.html"
    text = path.read_text(encoding="utf-8")
    topics = """      <h2 id="topics">Topics</h2>
      <ul>
        <li><a href="existing-project.html"><strong>Existing project</strong></a> — npm vs CDN, load order, themes, optional CLI.</li>
        <li><a href="react-vite-starter.html"><strong>Vite starter &amp; React</strong></a> — <code>templates/vite-velinstyle</code> and <code>@velinstyle/react</code>.</li>
        <li><a href="prompt-scaffolding.html"><strong>Prompt scaffolding (0.8.0)</strong></a> — <code>velinstyle scaffold</code> maps prompts to blueprint HTML.</li>
        <li><a href="responsive-layout.html"><strong>Responsive layout audit (0.8.0)</strong></a> — <code>velinstyle layout audit|suggest|fix</code> for flex/grid issues.</li>
      </ul>"""
    text = re.sub(
        r'      <h2 id="topics">Topics</h2>.*?</ul>',
        topics,
        text,
        count=1,
        flags=re.DOTALL,
    )
    path.write_text(text, encoding="utf-8", newline="\n")
    print("guides/index.html updated")


def patch_guide_page(slug: str, meta: str, toc_html: str) -> None:
    path = ROOT / "docs" / "guides" / f"{slug}.html"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{meta}">',
        text,
        count=1,
    )
    text = re.sub(r' class="active"', "", text)
    text = text.replace(
        f'href="../guides/{slug}.html"',
        f'href="../guides/{slug}.html" class="active"',
        1,
    )
    text = re.sub(
        r'<aside class="velin-doc-toc"[^>]*>.*?</aside>',
        toc_html,
        text,
        count=1,
        flags=re.DOTALL,
    )
    path.write_text(text, encoding="utf-8", newline="\n")
    print("guide page:", slug)


def patch_landing() -> None:
    path = ROOT / "index.html"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "35+ components, 22 web components, 13 themes, WCAG 2.2 AA aligned, CLI scanner. Modern CSS only.",
        "35+ components, 29 web components, 13 themes, WCAG 2.2 AA, CLI scaffold & layout audit. Modern CSS only.",
    )
    text = text.replace(
        """            <h3 class="feature-card__title">CLI + Scanner</h3>
            <p class="feature-card__text">
              Tree-shake CSS layers, download icons from any provider, and scan your project
              for security, accessibility, and CSS issues — all from one CLI.
            </p>""",
        """            <h3 class="feature-card__title">CLI: scaffold, audit, scan</h3>
            <p class="feature-card__text">
              <strong>0.8.0:</strong> <code>velinstyle scaffold</code> turns prompts into blueprint HTML;
              <code>layout audit</code> suggests responsive fixes. Plus icons, tokens, and security scan.
            </p>""",
    )
    dev_card = """          <article class="dev-toolkit-card">
            <div class="dev-toolkit-card__meta">
              <span class="dev-toolkit-card__tag">0.8.0</span>
            </div>
            <h3 class="dev-toolkit-card__title">Scaffold &amp; layout audit</h3>
            <p class="dev-toolkit-card__text">
              Generate Navbars, dashboards, and modals from text prompts, then run responsive layout checks before <code>scan</code>.
            </p>
            <div class="dev-toolkit-card__actions" style="display:flex;gap:0.5rem;flex-wrap:wrap">
              <a href="docs/guides/prompt-scaffolding.html" class="velin-btn velin-btn--primary velin-btn--sm">Scaffold guide</a>
              <a href="docs/guides/responsive-layout.html" class="velin-btn velin-btn--ghost velin-btn--sm">Layout audit</a>
            </div>
          </article>

"""
    if "Scaffold &amp; layout audit" not in text:
        text = text.replace(
            "        <motion class=\"dev-toolkit__grid velin-animate-on-scroll\">",
            "        <div class=\"dev-toolkit__grid velin-animate-on-scroll\">",
        )
        text = text.replace(
            """          <article class="dev-toolkit-card dev-toolkit-card--span-2">""",
            dev_card + """          <article class="dev-toolkit-card dev-toolkit-card--span-2">""",
            1,
        )
    text = text.replace("22 web components", "29 web components")
    path.write_text(text, encoding="utf-8", newline="\n")
    print("index.html updated")


def main() -> None:
    rewrite_component_pages()
    patch_guide_sidebars()
    patch_guides_index()
    patch_guide_page(
        "prompt-scaffolding",
        "Generate HTML from text prompts with velinstyle scaffold — blueprint composition without an API key.",
        '    <aside class="velin-doc-toc" aria-label="On this page"><div class="velin-doc-toc__title">On this page</motion><ul class="velin-doc-toc__list"><li><a href="#commands">Commands</a></li><li><a href="#intents">Intents</a></li><li><a href="#workflow">Workflow</a></li></ul></aside>'.replace(
            "</motion>", "</div>"
        ).replace("<motion>", "<div>"),
    )
    patch_guide_page(
        "responsive-layout",
        "Responsive layout audit with velinstyle layout audit, suggest, and safe fix — flex, grid, and breakpoint patterns.",
        '    <aside class="velin-doc-toc" aria-label="On this page"><div class="velin-doc-toc__title">On this page</div><ul class="velin-doc-toc__list"><li><a href="#commands">Commands</a></li><li><a href="#rules">Rules</a></li><li><a href="#breakpoints">Breakpoints</a></li></ul></aside>',
    )
    patch_landing()
    print("done")


if __name__ == "__main__":
    main()
