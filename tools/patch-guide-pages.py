#!/usr/bin/env python3
"""Patch laravel.html and wordpress.html main content."""
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs" / "guides"

LARAVEL_MAIN = """
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Laravel</li></ol>
      <h1>Laravel (Vite + Blade)</h1>
      <p class="lead">Install VelinStyle in a Laravel app with Vite, import CSS/JS in <code>resources/</code>, and load assets via <code>@vite</code> in your Blade layout.</p>
      <h2 id="install">Install</h2>
      <pre><code class="language-bash">npm install @birdapi/velinstyle</code></pre>
      <h2 id="css">CSS</h2>
      <p>In <code>resources/css/app.css</code>: <code>@import "@birdapi/velinstyle/dist/velinstyle.min.css";</code></p>
      <h2 id="js">Web Components</h2>
      <pre><code class="language-javascript">import "@birdapi/velinstyle/dist/velinstyle-components.js";</code></pre>
      <h2 id="blade">Blade</h2>
      <pre><code class="language-blade">@vite(['resources/css/app.css', 'resources/js/app.js'])</code></pre>
      <h2 id="icons">Icons</h2>
      <p>Copy <code>dist/velin-icons.svg</code> to <code>public/vendor/</code> and set <code>sprite</code> on <code>&lt;velin-icon&gt;</code>.</p>
      <nav class="velin-doc-prevnext" aria-label="Page navigation"><a href="responsive-layout.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Responsive layout</span></a><a href="wordpress.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">WordPress</span></a></nav>
"""

WORDPRESS_MAIN = """
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>WordPress</li></ol>
      <h1>WordPress</h1>
      <p class="lead">Enqueue VelinStyle CSS and the components IIFE from your theme or plugin with <code>wp_enqueue_style</code> and <code>wp_enqueue_script</code>.</p>
      <h2 id="options">Options</h2>
      <ul>
        <li><strong>CDN</strong> for quick prototypes (see <a href="../getting-started/download.html">Download</a>)</li>
        <li><strong>Local files</strong> in <code>assets/velinstyle/</code> for production</li>
      </ul>
      <h2 id="enqueue">Enqueue</h2>
      <pre><code class="language-php">add_action('wp_enqueue_scripts', function () {
  $ver = '0.8.0';
  wp_enqueue_style('velinstyle', get_stylesheet_directory_uri() . '/assets/velinstyle/velinstyle.min.css', [], $ver);
  wp_enqueue_script('velinstyle-components', get_stylesheet_directory_uri() . '/assets/velinstyle/velinstyle-components.iife.js', [], $ver, true);
});</code></pre>
      <h2 id="editor">Block editor</h2>
      <p>The editor does not load frontend CSS automatically. Use <code>enqueue_block_editor_assets</code> if you need WYSIWYG parity.</p>
      <h2 id="icons">Icons</h2>
      <p>Use an absolute sprite URL: <code>get_stylesheet_directory_uri() . '/assets/velinstyle/velin-icons.svg'</code></p>
      <nav class="velin-doc-prevnext" aria-label="Page navigation"><a href="laravel.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Laravel</span></a><a href="index.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Guides</span></a></nav>
"""

LARAVEL_TOC = '<ul class="velin-doc-toc__list"><li><a href="#install">Install</a></li><li><a href="#css">CSS</a></li><li><a href="#js">JS</a></li><li><a href="#blade">Blade</a></li><li><a href="#icons">Icons</a></li></ul>'
WP_TOC = '<ul class="velin-doc-toc__list"><li><a href="#options">Options</a></li><li><a href="#enqueue">Enqueue</a></li><li><a href="#editor">Editor</a></li><li><a href="#icons">Icons</a></li></ul>'


def patch(path: Path, main: str, toc: str, title: str, desc: str) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", text, count=1)
    text = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', text, count=1)
    text = re.sub(
        r'(<main class="velin-doc-main" id="main-content">).*?(</main>)',
        r"\1" + main + r"\n    \2",
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(r'<ul class="velin-doc-toc__list">.*?</ul>', toc, text, count=1, flags=re.S)
    path.write_text(text, encoding="utf-8")


def main() -> None:
    patch(
        DOCS / "laravel.html",
        LARAVEL_MAIN,
        LARAVEL_TOC,
        "Laravel · Guides · VelinStyle",
        "Use VelinStyle in Laravel with Vite and Blade: npm install, CSS/JS imports, themes, and icons.",
    )
    patch(
        DOCS / "wordpress.html",
        WORDPRESS_MAIN,
        WP_TOC,
        "WordPress · Guides · VelinStyle",
        "Use VelinStyle in WordPress: wp_enqueue_style/script, block editor notes, and icon sprites.",
    )
    print("Patched laravel.html and wordpress.html")


if __name__ == "__main__":
    main()
