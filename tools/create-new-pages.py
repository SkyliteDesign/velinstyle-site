#!/usr/bin/env python3
"""Create new documentation pages from utilities/opacity.html shell."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
DOCS = SITE / "docs"
TEMPLATE = DOCS / "utilities" / "opacity.html"

PAGES = [
    {
        "file": "getting-started/editor-setup.html",
        "title": "Editor setup",
        "desc": "VS Code and editor configuration for VelinStyle HTML and CSS classes.",
        "bc_cat": "Getting Started",
        "bc_href": "getting-started/introduction.html",
        "active": None,
        "prev": ("contents.html", "Contents"),
        "next": ("browser-compatibility.html", "Compatibility"),
        "toc": [("vscode", "VS Code"), ("snippets", "Snippets"), ("format", "Formatting")],
        "main": """
      <h1>Editor setup</h1>
      <p class="lead">VelinStyle is plain CSS — no PostCSS plugin required. These editor tips improve discovery and consistency.</p>
      <h2 id="vscode">VS Code</h2>
      <p>Enable suggestions inside <code>class</code> attributes: <code>"editor.quickSuggestions": {{ "strings": true }}</code>. Use the <strong>HTML CSS Support</strong> extension for class name hints.</p>
      <p>Browse the full class list in <a href="../utilities/api.html">Utilities API</a> or validate markup with <code>npx velinstyle scan</code>.</p>
      <h2 id="snippets">Snippets</h2>
      <p>Add user snippets for common patterns: <code>velin-btn velin-btn--primary</code>, <code>velin-container</code>, <code>velin-field</code>.</p>
      <h2 id="format">Formatting</h2>
      <p>Prettier works well for HTML. VelinStyle does not require a specific class order.</p>
""",
    },
    {
        "file": "getting-started/browser-compatibility.html",
        "title": "Browser compatibility",
        "desc": "Supported browsers and progressive enhancement for VelinStyle features.",
        "bc_cat": "Getting Started",
        "bc_href": "getting-started/introduction.html",
        "prev": ("editor-setup.html", "Editor setup"),
        "next": ("upgrading.html", "Upgrading"),
        "toc": [("matrix", "Support matrix"), ("features", "Feature notes"), ("fallbacks", "Fallbacks")],
        "main": """
      <h1>Browser compatibility</h1>
      <p class="lead">VelinStyle targets evergreen browsers. Some utilities use modern CSS and degrade gracefully.</p>
      <h2 id="matrix">Support matrix</h2>
      <table class="velin-table"><thead><tr><th>Browser</th><th>Minimum</th></tr></thead><tbody>
        <tr><td>Chrome / Edge</td><td>111+</td></tr>
        <tr><td>Firefox</td><td>113+</td></tr>
        <tr><td>Safari</td><td>16.4+</td></tr>
      </tbody></table>
      <h2 id="features">Feature notes</h2>
      <ul>
        <li><strong>OKLCH colors</strong> — semantic palette; falls back where unsupported</li>
        <li><strong>Container queries</strong> — layout helpers in <a href="../layout/containers.html">Containers</a></li>
        <li><strong><code>color-mix()</code></strong> — see <a href="../utilities/color-mix.html">Color mix</a></li>
        <li><strong>Scroll-driven animations</strong> — see <a href="../animations/scroll-driven.html">Scroll-driven</a></li>
      </ul>
      <h2 id="fallbacks">Fallbacks</h2>
      <p>Use <code>@media (prefers-reduced-motion: reduce)</code> patterns built into animation utilities. Test forced-colors via <a href="accessibility.html">Accessibility</a>.</p>
""",
    },
    {
        "file": "getting-started/upgrading.html",
        "title": "Upgrading VelinStyle",
        "desc": "How to upgrade between VelinStyle semver releases.",
        "bc_cat": "Getting Started",
        "bc_href": "getting-started/introduction.html",
        "prev": ("browser-compatibility.html", "Compatibility"),
        "next": ("states-and-variants.html", "States &amp; variants"),
        "toc": [("semver", "Semver"), ("checklist", "Checklist"), ("changelog", "Changelog")],
        "main": """
      <h1>Upgrading VelinStyle</h1>
      <p class="lead">Follow semver and the CHANGELOG when bumping <code>velinstyle</code> in package.json or your CDN pin.</p>
      <h2 id="semver">Semver</h2>
      <p><strong>Patch</strong> — bug fixes, safe to upgrade. <strong>Minor</strong> — new utilities or components, backward compatible. <strong>Major</strong> — breaking class or token renames; use the migration notes in GitHub releases.</p>
      <h2 id="checklist">Checklist</h2>
      <ol>
        <li>Read the release notes on <a href="https://github.com/SkyliteDesign/velinstyle/releases" rel="noopener">GitHub Releases</a></li>
        <li>Update npm: <code>npm install @birdapi/velinstyle@latest</code> or pin a version</li>
        <li>Re-run visual tests and <code>npx velinstyle scan</code> on templates</li>
        <li>Compare token changes in <a href="../customize/css-variables.html">CSS Variables</a></li>
      </ol>
      <h2 id="changelog">Changelog</h2>
      <p>The canonical changelog lives in the <a href="https://github.com/SkyliteDesign/velinstyle/blob/main/CHANGELOG.md" rel="noopener">CHANGELOG.md</a> file in the framework repository.</p>
      <p>Migrating <em>from</em> Tailwind or Bootstrap? See the <a href="../migration.html">Migration Guide</a> (different from version upgrades).</p>
""",
    },
    {
        "file": "getting-started/states-and-variants.html",
        "title": "States &amp; variants",
        "desc": "How VelinStyle handles hover, focus, responsive, and dark mode without Tailwind-style prefixes.",
        "bc_cat": "Getting Started",
        "bc_href": "getting-started/introduction.html",
        "prev": ("upgrading.html", "Upgrading"),
        "next": ("accessibility.html", "Accessibility"),
        "toc": [("no-prefix", "No hover: prefix"), ("responsive", "Responsive"), ("dark", "Dark mode"), ("state", "State classes")],
        "main": """
      <h1>States &amp; variants</h1>
      <p class="lead">VelinStyle does not use Tailwind-style variant prefixes (<code>hover:</code>, <code>focus:</code>, <code>dark:</code>). Use components, tokens, and responsive utilities instead.</p>
      <h2 id="no-prefix">No <code>hover:</code> prefix</h2>
      <p>Interactive states live in component CSS (e.g. <code>.velin-btn:hover</code>). For custom elements, add your own rules in a layer above utilities or use <code>:hover</code> in project CSS.</p>
      <h2 id="responsive">Responsive</h2>
      <p>Breakpoint prefixes use min-width media queries: <code>.velin-md-flex</code>, <code>.velin-lg-hidden</code>. See <a href="../layout/breakpoints.html">Breakpoints</a>.</p>
      <h2 id="dark">Dark mode</h2>
      <p>Set <code>data-velin-theme="dark"</code> on <code>&lt;html&gt;</code> or use <a href="../customize/color-modes.html">Color modes</a> — tokens swap globally; there are no <code>dark:</code> utility classes.</p>
      <h2 id="state">State classes</h2>
      <p>Loading and validation helpers: <code>.velin-is-loading</code>, <code>.velin-is-disabled</code>, <code>.velin-is-error</code> — see <a href="../utilities/api.html">Utilities API</a>.</p>
""",
    },
    {
        "file": "utilities/transitions.html",
        "title": "Transitions",
        "desc": "Transition utilities for colors, opacity, transform, and shadow.",
        "bc_cat": "Utilities",
        "bc_href": "utilities/api.html",
        "active": "utilities/transitions.html",
        "prev": ("text.html", "Text"),
        "next": ("transforms.html", "Transforms"),
        "toc": [("classes", "Classes")],
        "main": """
      <h1>Transitions</h1>
      <p class="lead">Preset transitions using design-token durations.</p>
      <h2 id="classes">Classes</h2>
      <table class="velin-table"><thead><tr><th>Class</th><th>Property</th></tr></thead><tbody>
        <tr><td><code>.velin-transition</code></td><td>all (token)</td></tr>
        <tr><td><code>.velin-transition-colors</code></td><td>color, background-color, border-color</td></tr>
        <tr><td><code>.velin-transition-opacity</code></td><td>opacity</td></tr>
        <tr><td><code>.velin-transition-transform</code></td><td>transform</td></tr>
        <tr><td><code>.velin-transition-shadow</code></td><td>box-shadow</td></tr>
        <tr><td><code>.velin-transition-none</code></td><td>none</td></tr>
      </tbody></table>
""",
    },
    {
        "file": "utilities/transforms.html",
        "title": "Transforms",
        "desc": "Rotate, scale, and translate utilities.",
        "bc_cat": "Utilities",
        "bc_href": "utilities/api.html",
        "active": "utilities/transforms.html",
        "prev": ("transitions.html", "Transitions"),
        "next": ("vertical-align.html", "Vertical Align"),
        "toc": [("rotate", "Rotate"), ("scale", "Scale"), ("translate", "Translate")],
        "main": """
      <h1>Transforms</h1>
      <p class="lead">Transform and <code>transform-origin</code> helpers.</p>
      <h2 id="rotate">Rotate</h2>
      <p><code>.velin-rotate-45</code>, <code>.velin-rotate-90</code>, <code>.velin-rotate-180</code>, <code>.-velin-rotate-90</code>, <code>.-velin-rotate-180</code></p>
      <h2 id="scale">Scale</h2>
      <p><code>.velin-scale-75</code> through <code>.velin-scale-125</code></p>
      <h2 id="translate">Translate</h2>
      <p><code>.velin-translate-y-1</code>, <code>.velin-translate-y-2</code>, <code>.-velin-translate-y-1</code>, <code>.-velin-translate-y-2</code></p>
      <p>Origins: <code>.velin-origin-center</code>, <code>.velin-origin-top</code>, <code>.velin-origin-bottom</code></p>
""",
    },
    {
        "file": "utilities/filters.html",
        "title": "Filters",
        "desc": "Blur, brightness, grayscale, and backdrop-filter utilities.",
        "bc_cat": "Utilities",
        "bc_href": "utilities/api.html",
        "active": "utilities/filters.html",
        "prev": ("float.html", "Float"),
        "next": ("interactions.html", "Interactions"),
        "toc": [("filter", "Filter"), ("backdrop", "Backdrop")],
        "main": """
      <h1>Filters</h1>
      <p class="lead">Image filters and backdrop blur for overlays.</p>
      <h2 id="filter">Filter</h2>
      <p><code>.velin-blur-sm</code>, <code>.velin-blur-md</code>, <code>.velin-blur-lg</code>, <code>.velin-blur-none</code></p>
      <p><code>.velin-brightness-50</code>, <code>.velin-brightness-75</code>, <code>.velin-brightness-125</code></p>
      <p><code>.velin-grayscale</code>, <code>.velin-grayscale-0</code></p>
      <h2 id="backdrop">Backdrop</h2>
      <p><code>.velin-backdrop-blur</code>, <code>.velin-backdrop-blur-sm</code>, <code>.velin-backdrop-blur-lg</code></p>
""",
    },
    {
        "file": "utilities/divide.html",
        "title": "Divide",
        "desc": "Divide borders between stacked or horizontal children.",
        "bc_cat": "Utilities",
        "bc_href": "utilities/api.html",
        "active": "utilities/divide.html",
        "prev": ("display.html", "Display"),
        "next": ("flex.html", "Flex"),
        "toc": [("usage", "Usage"), ("classes", "Classes")],
        "main": """
      <h1>Divide</h1>
      <p class="lead">Add borders between sibling elements with <code>.velin-divide-*</code> on the parent.</p>
      <h2 id="usage">Usage</h2>
      <pre><code class="language-html">&lt;ul class="velin-divide-y"&gt;
  &lt;li&gt;One&lt;/li&gt;
  &lt;li&gt;Two&lt;/li&gt;
&lt;/ul&gt;</code></pre>
      <h2 id="classes">Classes</h2>
      <p><code>.velin-divide-y</code>, <code>.velin-divide-x</code>, <code>.velin-divide-y-2</code>, <code>.velin-divide-x-2</code>, <code>.velin-divide-primary</code>, <code>.velin-divide-strong</code>, <code>.velin-divide-none</code></p>
""",
    },
    {
        "file": "utilities/scroll.html",
        "title": "Scroll",
        "desc": "Scroll behavior, snap, padding, and overscroll utilities.",
        "bc_cat": "Utilities",
        "bc_href": "utilities/api.html",
        "active": "utilities/scroll.html",
        "prev": ("print.html", "Print"),
        "next": ("shadows.html", "Shadows"),
        "toc": [("behavior", "Behavior"), ("snap", "Snap"), ("overscroll", "Overscroll")],
        "main": """
      <h1>Scroll</h1>
      <p class="lead">Control scrolling and scroll snapping.</p>
      <h2 id="behavior">Behavior</h2>
      <p><code>.velin-scroll-smooth</code>, <code>.velin-scroll-auto</code> (respects reduced motion)</p>
      <h2 id="snap">Snap</h2>
      <p>Containers: <code>.velin-snap-x</code>, <code>.velin-snap-y</code>, <code>.velin-snap-x-proximity</code></p>
      <p>Items: <code>.velin-snap-start</code>, <code>.velin-snap-center</code>, <code>.velin-snap-end</code>, <code>.velin-snap-always</code></p>
      <p>Padding: <code>.velin-scroll-pt-4</code>, <code>.velin-scroll-pt-8</code>, <code>.velin-scroll-pt-16</code></p>
      <h2 id="overscroll">Overscroll</h2>
      <p><code>.velin-overscroll-contain</code>, <code>.velin-overscroll-none</code>, <code>.velin-overscroll-auto</code></p>
""",
    },
    {
        "file": "utilities/print.html",
        "title": "Print",
        "desc": "Print-only and no-print utilities for documents.",
        "bc_cat": "Utilities",
        "bc_href": "utilities/api.html",
        "active": "utilities/print.html",
        "prev": ("position.html", "Position"),
        "next": ("scroll.html", "Scroll"),
        "toc": [("classes", "Classes")],
        "main": """
      <h1>Print</h1>
      <p class="lead">Hide chrome when printing or show print-only blocks.</p>
      <h2 id="classes">Classes</h2>
      <table class="velin-table"><thead><tr><th>Class</th><th>Effect</th></tr></thead><tbody>
        <tr><td><code>.velin-no-print</code></td><td>Hidden in print media</td></tr>
        <tr><td><code>.velin-print-only</code></td><td>Visible only when printing</td></tr>
        <tr><td><code>.velin-print-break-before</code></td><td><code>break-before: page</code></td></tr>
        <tr><td><code>.velin-print-break-after</code></td><td><code>break-after: page</code></td></tr>
        <tr><td><code>.velin-print-break-avoid</code></td><td><code>break-inside: avoid</code></td></tr>
      </tbody></table>
""",
    },
    {
        "file": "extend/utility-coverage.html",
        "title": "Utility coverage",
        "desc": "What VelinStyle utilities include compared to Tailwind, and what is intentionally not supported.",
        "bc_cat": "Extend",
        "bc_href": "extend/approach.html",
        "active": "extend/utility-coverage.html",
        "prev": ("approach.html", "Approach"),
        "next": ("icons.html", "Icons"),
        "toc": [("included", "Included"), ("different", "Different model"), ("not-planned", "Not planned")],
        "main": """
      <h1>Utility coverage</h1>
      <p class="lead">VelinStyle is not a Tailwind clone. This page documents scope: what ships, what works differently, and what we do not plan to add.</p>
      <h2 id="included">Included</h2>
      <p>Layout, spacing (logical props), typography, colors, flex, grid system, borders, shadows, opacity, position, transitions, transforms, filters, scroll, print, animations, and more — see the <strong>Utilities</strong> sidebar.</p>
      <h2 id="different">Different model</h2>
      <ul>
        <li><strong>No JIT / purge</strong> — static bundle; optional CLI subset build</li>
        <li><strong>No <code>hover:</code> / <code>dark:</code> prefixes</strong> — see <a href="../getting-started/states-and-variants.html">States &amp; variants</a></li>
        <li><strong>No arbitrary values</strong> — use CSS variables and custom CSS in <code>@layer</code></li>
        <li><strong>Grid</strong> — layout system (<code>.velin-grid</code>) not atomized <code>grid-cols-*</code> utilities</li>
      </ul>
      <h2 id="not-planned">Not planned</h2>
      <p>SVG <code>fill-*</code>/<code>stroke-*</code> utilities, mask utilities, full Tailwind spacing scale, <code>@apply</code>, and config-file-driven code generation. Use components, tokens, and project CSS for these needs.</p>
""",
    },
]


def build_page(spec: dict) -> str:
    tpl = TEMPLATE.read_text(encoding="utf-8")
    rel_dir = Path(spec["file"]).parent
    depth = len(Path(spec["file"]).parts) - 1
    rel = "../" * depth

    title = spec["title"]
    active = spec.get("active") or spec["file"].replace("\\", "/")

    tpl = re.sub(r"<title>.*?</title>", f"<title>{title} · VelinStyle</title>", tpl)
    tpl = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{spec["desc"]}">',
        tpl,
    )
    tpl = re.sub(
        r'<ol class="velin-doc-breadcrumb">.*?</ol>',
        f'<ol class="velin-doc-breadcrumb"><li><a href="{rel}getting-started/introduction.html">Docs</a></li>'
        f'<li><a href="{rel}{spec["bc_href"]}">{spec["bc_cat"]}</a></li><li>{title}</li></ol>',
        tpl,
        flags=re.DOTALL,
    )
    tpl = re.sub(
        r"<main class=\"velin-doc-main\" id=\"main-content\">.*?<nav class=\"velin-doc-prevnext\"",
        f"<main class=\"velin-doc-main\" id=\"main-content\">{spec['main']}\n      <nav class=\"velin-doc-prevnext\"",
        tpl,
        flags=re.DOTALL,
    )
    ph, pt = spec["prev"]
    nh, nt = spec["next"]
    tpl = re.sub(
        r'<nav class="velin-doc-prevnext"[^>]*>.*?</nav>',
        f'<nav class="velin-doc-prevnext" aria-label="Page navigation">'
        f'<a href="{ph}" class="prev"><span class="velin-doc-prevnext__label">Previous</span>'
        f'<span class="velin-doc-prevnext__title">{pt}</span></a>'
        f'<a href="{nh}" class="next"><span class="velin-doc-prevnext__label">Next</span>'
        f'<span class="velin-doc-prevnext__title">{nt}</span></a></nav>',
        tpl,
        flags=re.DOTALL,
    )
    toc = "\n".join(f'        <li><a href="#{i}">{l}</a></li>' for i, l in spec["toc"])
    tpl = re.sub(
        r'<ul class="velin-doc-toc__list">.*?</ul>',
        f"<ul class=\"velin-doc-toc__list\">\n{toc}\n      </ul>",
        tpl,
        flags=re.DOTALL,
    )
    tpl = re.sub(r'class="active"', "", tpl)
    tpl = tpl.replace(f'href="{rel}{active}"', f'href="{rel}{active}" class="active"', 1)
    return tpl


def main() -> None:
    for spec in PAGES:
        out = DOCS / spec["file"]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build_page(spec), encoding="utf-8")
        print("created", spec["file"])


if __name__ == "__main__":
    main()
