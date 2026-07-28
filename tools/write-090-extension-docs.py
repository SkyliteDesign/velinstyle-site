#!/usr/bin/env python3
"""Create documentation pages for VelinSearch, Motion, Attributes, and core/ modules."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
DOCS = SITE / "docs"
TEMPLATE = DOCS / "guides" / "performance-audit.html"


def build_page(spec: dict) -> str:
    rel = "../" * (len(Path(spec["file"]).parts) - 1)
    tpl = TEMPLATE.read_text(encoding="utf-8")
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
        r'<main class="velin-doc-main" id="main-content">.*?<nav class="velin-doc-prevnext"',
        f'<main class="velin-doc-main" id="main-content">{spec["main"]}\n      <nav class="velin-doc-prevnext"',
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
    if '<aside class="velin-doc-toc"' in tpl:
        tpl = re.sub(
            r'<ul class="velin-doc-toc__list">.*?</ul>',
            f'<ul class="velin-doc-toc__list">\n{toc}\n      </ul>',
            tpl,
            flags=re.DOTALL,
        )
    tpl = re.sub(r'class="active"', "", tpl)
    tpl = tpl.replace(f'href="{rel}{active}"', f'href="{rel}{active}" class="active"', 1)
    return tpl


PAGES = [
    {
        "file": "guides/whats-new-extension.html",
        "title": "What&apos;s new: Search, Motion &amp; Attributes",
        "desc": "0.9.0 extension — VelinSearch, core/motion runtime, and 25+ declarative velin-* HTML attributes.",
        "bc_cat": "Guides",
        "bc_href": "guides/index.html",
        "active": "guides/whats-new-extension.html",
        "prev": ("performance-audit.html", "Performance audit"),
        "next": ("velin-search.html", "VelinSearch"),
        "toc": [
            ("overview", "Overview"),
            ("core", "New core/ modules"),
            ("search", "VelinSearch"),
            ("motion", "Motion runtime"),
            ("attributes", "HTML attributes"),
            ("migrate", "Migration"),
        ],
        "main": """
      <h1>What&apos;s new: Search, Motion &amp; Attributes <span class="velin-badge velin-badge--primary">0.9.0 extension</span></h1>
      <p class="lead">Beyond the published 0.9.0 release (docs generate, perf CLI, PII scanner), VelinStyle adds a <strong>central search system</strong>, a <strong>unified motion runtime</strong>, and <strong>declarative HTML attributes</strong> that bridge to existing Web Components.</p>

      <h2 id="overview">Overview</h2>
      <table class="velin-table">
        <thead><tr><th>Feature</th><th>Location</th><th>Docs</th></tr></thead>
        <tbody>
          <tr><td><strong>VelinSearch</strong></td><td><code>core/search/</code>, <code>&lt;velin-search&gt;</code></td><td><a href="velin-search.html">VelinSearch guide</a></td></tr>
          <tr><td><strong>Motion</strong></td><td><code>core/motion/</code>, <code>initMotion()</code></td><td><a href="motion-attributes.html">Motion &amp; attributes</a></td></tr>
          <tr><td><strong>Attributes</strong></td><td><code>core/attributes/</code>, <code>bootFromDOM(&#123; attributes: true &#125;)</code></td><td><a href="html-attributes.html">Attribute reference</a></td></tr>
          <tr><td><strong>Architecture</strong></td><td>Tree-shakeable subpaths</td><td><a href="../extend/core-modules.html">Core modules</a></td></tr>
        </tbody>
      </table>

      <h2 id="core">New <code>core/</code> modules</h2>
      <p>Small ESM packages inside the framework repo (also exported from npm):</p>
      <ul>
        <li><code>@birdapi/velinstyle/search</code> — offline JSON index, fuzzy query, <code>registerSearchProvider()</code></li>
        <li><code>@birdapi/velinstyle/motion</code> — IntersectionObserver + rAF scheduler, stagger, smooth scroll</li>
        <li><code>@birdapi/velinstyle/attributes</code> — registry of <code>velin-*</code> attribute handlers (bridge to WCs)</li>
      </ul>
      <p>See <a href="../extend/core-modules.html">Core modules</a> for file layout and design goals.</p>

      <h2 id="search">VelinSearch</h2>
      <p>Documentation header search on this site uses the same API. Build the index with <code>velinstyle search index</code> or <code>npm run docs:generate</code> in the framework repo.</p>
      <pre><code class="language-bash">npx velinstyle search index --out dist/search-index.json</code></pre>

      <h2 id="motion">Motion runtime</h2>
      <p>Replaces the split between <code>velin-reveal.js</code> (class <code>.is-visible</code>) and scroll-timeline-only CSS. Primary path: <code>.velin-in-view</code> + <code>prefers-reduced-motion</code>.</p>

      <h2 id="attributes">HTML attributes</h2>
      <p>25+ attributes such as <code>velin-modal</code>, <code>velin-reveal</code>, <code>velin-code</code> — no duplicate WC implementations; attributes lazy-load components via <code>data-velin-component</code>.</p>
      <p>Generated Markdown: <a href="../generated/attributes/README.md">docs/generated/attributes/</a> (after <code>npm run sync:generated</code>).</p>

      <h2 id="migrate">Migration</h2>
      <ul>
        <li><code>initReveal()</code> still works — delegates to <code>initMotion()</code></li>
        <li>Site search: <code>doc-search.js</code> imports <code>@birdapi/velinstyle/search</code> (ES module)</li>
        <li>Enable attributes: <code>bootFromDOM(document, &#123; attributes: true &#125;)</code></li>
      </ul>
""",
    },
    {
        "file": "guides/velin-search.html",
        "title": "VelinSearch",
        "desc": "Central framework search with fuzzy matching, keyboard navigation, category filters, and offline JSON index.",
        "bc_cat": "Guides",
        "bc_href": "guides/index.html",
        "active": "guides/velin-search.html",
        "prev": ("whats-new-extension.html", "What&apos;s new"),
        "next": ("motion-attributes.html", "Motion &amp; attributes"),
        "toc": [
            ("overview", "Overview"),
            ("component", "Web Component"),
            ("api", "JavaScript API"),
            ("index", "Build index"),
            ("providers", "Custom providers"),
            ("site", "This site"),
        ],
        "main": """
      <h1>VelinSearch <span class="velin-badge velin-badge--primary">0.9.0 extension</span></h1>
      <p class="lead">Offline, fuzzy documentation and content search with grouped results, keyboard navigation, and highlighted matches.</p>

      <h2 id="overview">Overview</h2>
      <ul>
        <li>Autocomplete from <strong>2 characters</strong></li>
        <li>Categories: <code>docs</code>, <code>components</code>, <code>api</code>, <code>examples</code></li>
        <li>Fuzzy typo tolerance (e.g. <code>modla</code> → <code>velin-modal</code>)</li>
        <li>No page reload — live results panel</li>
        <li>Optional <code>registerSearchProvider()</code> hook for app content</li>
      </ul>

      <h2 id="component">Web Component</h2>
      <pre><code class="language-html">&lt;link rel="stylesheet" href="velinstyle.min.css"&gt;
&lt;script type="module" src="velin-search.js"&gt;&lt;/script&gt;

&lt;velin-search
  index="/dist/search-index.json"
  categories="docs,components,api,examples"
  min-chars="2"
  fuzzy="0.2"
  placeholder="Search…"&gt;
&lt;/velin-search&gt;</code></pre>
      <p>Declarative binding:</p>
      <pre><code class="language-html">&lt;input velin-search-input data-search-index="../search-index.json"&gt;
&lt;div velin-search-results&gt;&lt;/div&gt;</code></pre>

      <h2 id="api">JavaScript API</h2>
      <pre><code class="language-js">import { velinSearch, createSearch, registerSearchProvider } from '@birdapi/velinstyle/search';

await velinSearch.loadIndex('/search-index.json');

const { results, groups } = await velinSearch.query('tokens', {
  minChars: 2,
  fuzzy: 0.2,
  categories: ['docs', 'components'],
  limit: 12,
});</code></pre>

      <h2 id="index">Build index</h2>
      <pre><code class="language-bash"># Framework repo
npx velinstyle search index --out dist/search-index.json

# Included when generating docs
npm run docs:generate</code></pre>
      <p>Sources: generated Markdown (components, tokens, utilities, CLI), samples HTML, <code>cli-manifest.json</code>.</p>
      <p>Schema: <code>examples/search-index.schema.json</code> in the framework package.</p>

      <h2 id="providers">Custom providers</h2>
      <pre><code class="language-js">registerSearchProvider('cms', async () => {
  const res = await fetch('/api/search-docs.json');
  return res.json();
});
await velinSearch.refreshProviders();</code></pre>

      <h2 id="site">This documentation site</h2>
      <p>The header <code>#docSearch</code> field uses <code>docs/doc-search.js</code> (ES module) importing <code>core/search</code> from the sibling <code>velinstyle</code> repo. Rebuild the merged index:</p>
      <pre><code class="language-bash">python tools/build-search-index.py
python tools/sync-sidebar.py</code></pre>
""",
    },
    {
        "file": "guides/motion-attributes.html",
        "title": "Motion &amp; attributes",
        "desc": "initMotion(), scroll reveals, stagger, and declarative velin-* HTML attribute bridges.",
        "bc_cat": "Guides",
        "bc_href": "guides/index.html",
        "active": "guides/motion-attributes.html",
        "prev": ("velin-search.html", "VelinSearch"),
        "next": ("html-attributes.html", "HTML attributes"),
        "toc": [
            ("motion", "Motion runtime"),
            ("effects", "Effects"),
            ("attributes", "Attribute boot"),
            ("examples", "Examples"),
        ],
        "main": """
      <h1>Motion &amp; attributes <span class="velin-badge velin-badge--primary">0.9.0 extension</span></h1>
      <p class="lead">Unified scroll animations via <code>core/motion/</code> and declarative <code>velin-*</code> attributes via <code>core/attributes/</code>.</p>

      <h2 id="motion">Motion runtime</h2>
      <pre><code class="language-js">import { initMotion, velinMotion } from '@birdapi/velinstyle/motion';

const teardown = initMotion({ root: document });
// Respects prefers-reduced-motion and data-velin-motion="off"</code></pre>
      <p>Uses one shared <code>IntersectionObserver</code>, batches updates with <code>requestAnimationFrame</code>, toggles <code>.velin-in-view</code> on elements.</p>
      <p><code>initReveal()</code> in <code>velin-reveal.js</code> now delegates here (backward compatible).</p>

      <h2 id="effects">Effects</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Behavior</th></tr></thead>
        <tbody>
          <tr><td><code>velin-reveal</code></td><td>Scroll into view (base)</td></tr>
          <tr><td><code>velin-fade</code></td><td>Fade in on scroll</td></tr>
          <tr><td><code>velin-slide="up"</code></td><td>Slide direction</td></tr>
          <tr><td><code>velin-scale</code></td><td>Scale in</td></tr>
          <tr><td><code>velin-parallax</code></td><td>Parallax (CSS scroll-timeline where supported)</td></tr>
          <tr><td><code>velin-stagger="60"</code></td><td>Stagger list children (ms)</td></tr>
          <tr><td><code>velin-scroll</code></td><td>Smooth anchor on <code>href="#id"</code></td></tr>
          <tr><td><code>velin-hover</code></td><td>Hover lift/glow utilities</td></tr>
        </tbody>
      </table>
      <p>CSS fallback when <code>animation-timeline: view()</code> is unavailable: see <code>scroll-animation.css</code> <code>.velin-in-view</code> rules.</p>

      <h2 id="attributes">Attribute boot</h2>
      <pre><code class="language-js">import { bootFromDOM } from '@birdapi/velinstyle/runtime';

await bootFromDOM(document, { attributes: true });
// Runs bootAttributes() + motion + optional velin-search bindings</code></pre>
      <p>Bridge attributes (e.g. <code>velin-modal</code>) set <code>data-velin-component</code> and call <code>lazyDefine()</code> — see <a href="html-attributes.html">full attribute list</a>.</p>

      <h2 id="examples">Examples</h2>
      <pre><code class="language-html">&lt;html data-velin-reveal-auto&gt;
&lt;section velin-reveal velin-fade&gt;…&lt;/section&gt;
&lt;ul velin-stagger="80" velin-reveal&gt;
  &lt;li velin-fade&gt;One&lt;/li&gt;
  &lt;li velin-fade&gt;Two&lt;/li&gt;
&lt;/ul&gt;
&lt;a href="#faq" velin-scroll&gt;FAQ&lt;/a&gt;</code></pre>
      <p>Framework sample: <code>samples/velin-attributes.html</code> in the GitHub repo.</p>
""",
    },
    {
        "file": "guides/html-attributes.html",
        "title": "HTML attributes",
        "desc": "Complete reference for velin-* declarative HTML attributes (bridge model).",
        "bc_cat": "Guides",
        "bc_href": "guides/index.html",
        "active": "guides/html-attributes.html",
        "prev": ("motion-attributes.html", "Motion &amp; attributes"),
        "next": ("design-tokens.html", "Design tokens"),
        "toc": [("model", "Bridge model"), ("motion", "Motion"), ("components", "Components"), ("content", "Content"), ("generated", "Generated docs")],
        "main": """
      <h1>HTML attributes <span class="velin-badge velin-badge--primary">0.9.0 extension</span></h1>
      <p class="lead">Add <code>velin-*</code> attributes in HTML; the framework interprets them and lazy-loads Web Components or CSS — no duplicate implementations.</p>

      <h2 id="model">Bridge model</h2>
      <p><code>bootAttributes()</code> scans for registered attribute names, runs <code>enhance(el)</code> once per element, then <code>initMotion()</code>. Register custom handlers with <code>registerAttribute(name, &#123; enhance &#125;)</code>.</p>

      <h2 id="motion">Motion attributes</h2>
      <ul>
        <li><code>velin-reveal</code>, <code>velin-fade</code>, <code>velin-slide</code>, <code>velin-scale</code></li>
        <li><code>velin-parallax</code>, <code>velin-hover</code>, <code>velin-stagger</code>, <code>velin-scroll</code>, <code>velin-anchor</code></li>
      </ul>

      <h2 id="components">Component bridges</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Loads</th></tr></thead>
        <tbody>
          <tr><td><code>velin-modal</code></td><td><code>&lt;velin-modal&gt;</code></td></tr>
          <tr><td><code>velin-tabs</code></td><td><code>&lt;velin-tabs&gt;</code></td></tr>
          <tr><td><code>velin-accordion</code></td><td><code>&lt;velin-accordion&gt;</code></td></tr>
          <tr><td><code>velin-tooltip="text"</code></td><td><code>&lt;velin-tooltip-wc&gt;</code></td></tr>
          <tr><td><code>velin-copy="text"</code></td><td><code>&lt;velin-copy&gt;</code></td></tr>
          <tr><td><code>velin-counter</code></td><td><code>&lt;velin-counter&gt;</code></td></tr>
          <tr><td><code>velin-notify</code></td><td>Toast via <code>velin-toast-show</code> event</td></tr>
          <tr><td><code>velin-theme</code></td><td><code>data-velin-theme</code> or <code>&lt;velin-theme-toggle&gt;</code></td></tr>
          <tr><td><code>velin-progress</code></td><td><code>.velin-progress</code> or ring with <code>ring</code></td></tr>
          <tr><td><code>velin-search</code></td><td><code>&lt;velin-search&gt;</code></td></tr>
        </tbody>
      </table>

      <h2 id="content">Content helpers</h2>
      <ul>
        <li><code>velin-code="html"</code> — code block + copy button</li>
        <li><code>velin-quote</code> — styled blockquote</li>
        <li><code>velin-highlight</code> — inline highlight</li>
        <li><code>velin-lazy</code> — <code>loading="lazy"</code> + optional skeleton</li>
        <li><code>velin-skeleton="text|avatar|image"</code></li>
        <li><code>velin-loading</code>, <code>velin-grid</code></li>
      </ul>

      <h2 id="generated">Generated docs</h2>
      <p>Per-attribute Markdown is generated by <code>velinstyle docs generate</code> into <code>docs/generated/attributes/</code>. Sync to this site with <code>npm run sync:generated</code>.</p>
""",
    },
    {
        "file": "extend/core-modules.html",
        "title": "Core modules",
        "desc": "Architecture of core/search, core/motion, and core/attributes in VelinStyle.",
        "bc_cat": "Extend",
        "bc_href": "extend/approach.html",
        "active": "extend/core-modules.html",
        "prev": ("javascript-api.html", "JavaScript API"),
        "next": ("approach.html", "Approach"),
        "toc": [
            ("layout", "Layout"),
            ("search", "core/search"),
            ("motion", "core/motion"),
            ("attributes", "core/attributes"),
            ("exports", "npm exports"),
        ],
        "main": """
      <h1>Core modules <span class="velin-badge velin-badge--primary">0.9.0 extension</span></h1>
      <p class="lead">Tree-shakeable JavaScript modules under <code>core/</code> — separate from CSS and Web Components in <code>components/</code>.</p>

      <h2 id="layout">Layout</h2>
      <pre><code class="language-text">velinstyle/
  core/
    search/       types.js, engine.js, highlight.js, providers.js, index.js
    motion/       scheduler.js, effects.js, stagger.js, scroll.js, index.js
    attributes/   registry.js, index.js
  components/     velin-search.js, velin-modal.js, …
  cli/            search-index.js, docs-generate.js</code></pre>

      <h2 id="search">core/search</h2>
      <ul>
        <li><code>VelinSearchEngine</code> — in-memory fuzzy + substring scoring</li>
        <li><code>velinSearch</code> — singleton: <code>loadIndex()</code>, <code>query()</code></li>
        <li><code>createSearch()</code> — isolated instance per widget</li>
        <li><code>registerSearchProvider(id, fn)</code> — merge custom entries</li>
        <li><code>highlightHtml(text, query)</code> — safe <code>&lt;mark class="velin-search-hit"&gt;</code></li>
      </ul>

      <h2 id="motion">core/motion</h2>
      <ul>
        <li><code>initMotion(options?)</code> — IO + stagger + smooth scroll bindings</li>
        <li><code>observeInView(el, callback)</code> — rAF-batched visibility</li>
        <li><code>applyEffects(el, attrs)</code> — map attributes to CSS classes</li>
        <li><code>smoothScrollTo(target)</code> — reduced-motion aware</li>
      </ul>

      <h2 id="attributes">core/attributes</h2>
      <ul>
        <li><code>registerAttribute(name, &#123; enhance &#125;)</code></li>
        <li><code>bootAttributes(root)</code> — scan DOM, lazy WC load</li>
        <li><code>listRegisteredAttributes()</code> — 25+ built-ins</li>
      </ul>

      <h2 id="exports">npm exports</h2>
      <pre><code class="language-json">"@birdapi/velinstyle/search": "./core/search/index.js",
"@birdapi/velinstyle/motion": "./core/motion/index.js",
"@birdapi/velinstyle/attributes": "./core/attributes/index.js"</code></pre>
      <p>Related: <a href="../guides/velin-search.html">VelinSearch</a>, <a href="../guides/motion-attributes.html">Motion guide</a>, <a href="../extend/javascript-api.html">JavaScript API</a>.</p>
""",
    },
    {
        "file": "components/velin-search.html",
        "title": "Velin Search",
        "desc": "Web Component for framework-wide search with autocomplete and keyboard navigation.",
        "bc_cat": "Components",
        "bc_href": "components/accordion.html",
        "active": "components/velin-search.html",
        "prev": ("command.html", "Command palette"),
        "next": ("menubar.html", "Menubar"),
        "toc": [("usage", "Usage"), ("attributes", "Attributes"), ("a11y", "Accessibility")],
        "main": """
      <h1>&lt;velin-search&gt; <span class="velin-badge velin-badge--primary">0.9.0 extension</span></h1>
      <p class="lead">Documentation search and in-app find — powered by <code>core/search</code>.</p>

      <h2 id="usage">Usage</h2>
      <pre><code class="language-html">&lt;velin-search index="/search-index.json" categories="docs,components"&gt;&lt;/velin-search&gt;</code></pre>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>index</code></td><td><code>/search-index.json</code></td><td>JSON index URL</td></tr>
          <tr><td><code>categories</code></td><td>all</td><td>Comma-separated filter</td></tr>
          <tr><td><code>min-chars</code></td><td><code>2</code></td><td>Minimum query length</td></tr>
          <tr><td><code>fuzzy</code></td><td><code>0.2</code></td><td>Typo tolerance</td></tr>
          <tr><td><code>debounce</code></td><td><code>120</code></td><td>Input debounce (ms)</td></tr>
        </tbody>
      </table>
      <p>Full guide: <a href="../guides/velin-search.html">VelinSearch</a>.</p>

      <h2 id="a11y">Accessibility</h2>
      <ul>
        <li>Input: <code>role="combobox"</code>, <code>aria-expanded</code>, <code>aria-activedescendant</code></li>
        <li>Results: <code>role="listbox"</code>, options as links with <code>role="option"</code></li>
        <li>Keyboard: ↑↓ navigate, Enter open, Escape close</li>
      </ul>
""",
    },
]


def patch_javascript_api() -> None:
    path = DOCS / "extend" / "javascript-api.html"
    text = path.read_text(encoding="utf-8")
    if "velinstyle/search" in text:
        return
    block = """
      <h2 id="search-api">VelinSearch <span class="velin-badge velin-badge--primary">extension</span></h2>
      <pre><code class="language-javascript">import { velinSearch, createSearch, registerSearchProvider } from '@birdapi/velinstyle/search';

await velinSearch.loadIndex('/search-index.json');
const { results, groups } = await velinSearch.query('modal', { fuzzy: 0.2 });</code></pre>
      <p>Guide: <a href="../guides/velin-search.html">VelinSearch</a> · CLI: <code>velinstyle search index</code></p>

      <h2 id="motion-api">Motion &amp; attributes</h2>
      <pre><code class="language-javascript">import { initMotion } from '@birdapi/velinstyle/motion';
import { bootFromDOM } from '@birdapi/velinstyle/runtime';

await bootFromDOM(document, { attributes: true });
initMotion();</code></pre>
      <p>Guides: <a href="../guides/motion-attributes.html">Motion</a>, <a href="../guides/html-attributes.html">HTML attributes</a>, <a href="core-modules.html">Core modules</a>.</p>
"""
    text = text.replace(
        '<h2 id="installation">Installation &amp; Loading</h2>',
        block + '\n      <h2 id="installation">Installation &amp; Loading</h2>',
        1,
    )
    path.write_text(text, encoding="utf-8")
    print("patched extend/javascript-api.html")


def patch_cli_page() -> None:
    path = DOCS / "extend" / "cli.html"
    text = path.read_text(encoding="utf-8")
    if "velinstyle search index" in text:
        return
    text = text.replace(
        '<tr><td><code>velinstyle docs generate</code></td><td>Auto-generate Markdown API reference (0.9.0)</td></tr>',
        '<tr><td><code>velinstyle docs generate</code></td><td>Auto-generate Markdown API reference (0.9.0)</td></tr>\n'
        '          <tr><td><code>velinstyle search index</code></td><td>Build JSON search index for VelinSearch (extension)</td></tr>',
        1,
    )
    text = text.replace(
        "Scopes: <code>all</code>, <code>components</code>",
        "Scopes: <code>all</code>, <code>components</code>, <code>attributes</code>",
        1,
    )
    block = """
      <h2 id="search-index">Search index (extension)</h2>
      <p>Build <code>dist/search-index.json</code> for <a href="../guides/velin-search.html">VelinSearch</a>. Merged with site pages via <code>python tools/build-search-index.py</code>.</p>
<pre><code class="language-bash">velinstyle search index --out dist/search-index.json
velinstyle search index --extra-html ../velinstyle-site/docs</code></pre>
"""
    text = text.replace('<h2 id="layout">Layout audit</h2>', block + '\n<h2 id="layout">Layout audit</h2>', 1)
    path.write_text(text, encoding="utf-8")
    print("patched extend/cli.html")


def patch_guides_index() -> None:
    path = DOCS / "guides" / "index.html"
    text = path.read_text(encoding="utf-8")
    block = """
        <li><a href="whats-new-extension.html"><strong>What&apos;s new (Search, Motion, Attributes)</strong></a> — 0.9.0 extension overview.</li>
        <li><a href="velin-search.html"><strong>VelinSearch</strong></a> — fuzzy offline search, <code>&lt;velin-search&gt;</code>, CLI index.</li>
        <li><a href="motion-attributes.html"><strong>Motion &amp; attributes</strong></a> — <code>initMotion()</code>, <code>velin-*</code> HTML attributes.</li>
        <li><a href="html-attributes.html"><strong>HTML attributes</strong></a> — full bridge reference.</li>"""
    if "whats-new-extension.html" not in text:
        text = text.replace(
            '<li><a href="performance-audit.html">',
            block + '\n        <li><a href="performance-audit.html">',
            1,
        )
    path.write_text(text, encoding="utf-8")
    print("patched guides/index.html")


def main() -> None:
    for spec in PAGES:
        out = DOCS / spec["file"]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build_page(spec), encoding="utf-8")
        print("created", spec["file"])
    patch_guides_index()
    patch_javascript_api()
    patch_cli_page()


if __name__ == "__main__":
    main()
