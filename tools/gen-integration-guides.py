#!/usr/bin/env python3
"""Generate guides/ecommerce.html and guides/forum-update.html from wordpress.html shell."""
from __future__ import annotations

from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
TEMPLATE = SITE / "docs" / "guides" / "wordpress.html"

GUIDES = {
    "ecommerce.html": {
        "title": "E-commerce · Guides · VelinStyle",
        "desc": "Use VelinStyle with WooCommerce, Shopify, Magento 2, PrestaShop, and Shopware 6.",
        "h1": "E-commerce",
        "lead": "Load VelinStyle on storefront and checkout pages, override theme tokens, and run PII-aware scans before go-live.",
        "breadcrumb": "E-commerce",
        "body": """
      <h2 id="shared">Shared practices</h2>
      <ul>
        <li>Ship <code>velinstyle.min.css</code> + <code>velinstyle-components.iife.js</code> (or <code>@birdapi/velinstyle/runtime</code> for tree-shaking).</li>
        <li>Use <code>&lt;velin-persist&gt;</code> for multi-step checkout drafts (never persist card data).</li>
        <li>Run <code>npx velinstyle scan --only pii</code> on theme assets before release.</li>
        <li>Product UI: <code>&lt;velin-rating&gt;</code>, <code>&lt;velin-counter&gt;</code>, <code>&lt;velin-search&gt;</code> for catalog search.</li>
      </ul>

      <h2 id="woocommerce">WordPress + WooCommerce</h2>
      <p>See <a href="wordpress.html">WordPress guide</a> for enqueue basics. In WooCommerce, hook <code>wp_enqueue_scripts</code> with priority after WooCommerce styles if you replace its layout utilities. Override checkout fields with VelinStyle form classes; scan checkout templates for hardcoded emails.</p>

      <h2 id="shopify">Shopify (Theme 2.0)</h2>
      <p>Add CSS/JS in <code>layout/theme.liquid</code> via <code>asset_url</code> (upload built files to <code>assets/</code>) or a build pipeline that copies into the theme. Avoid inline scripts — Shopify CSP blocks many patterns the scanner flags. Use section settings for theme token overrides (<code>--velin-color-primary</code>).</p>

      <h2 id="magento">Magento 2</h2>
      <p>Place static files under <code>app/design/frontend/…/web/</code>, reference via <code>requirejs-config.js</code> or layout XML <code>&lt;css src="…"/&gt;</code> / <code>&lt;script src="…"/&gt;</code>. Run <code>bin/magento setup:static-content:deploy</code> after updates. Checkout: Luma/Hyvä compatibility — replace grid/utility classes incrementally.</p>

      <h2 id="prestashop">PrestaShop</h2>
      <p>Copy assets to <code>themes/&lt;name&gt;/assets/</code> and register in <code>theme.yml</code> or Smarty <code>{block name='stylesheets'}</code>. Clear CCC cache. Hook checkout steps in <code>checkout/*.tpl</code> with VelinStyle cards and alerts.</p>

      <h2 id="shopware">Shopware 6</h2>
      <p>Plugin or app: register storefront assets in <code>Resources/app/storefront/src/main.js</code> and compile with Shopware's build, or inject via <code>theme.json</code> <code>asset</code> entries. Use <code>@Storefront</code> SCSS only if you still compile Shopware styles — prefer plain VelinStyle CSS for greenfield themes.</p>
""",
        "prev": ("wordpress.html", "WordPress"),
        "next": ("forum-update.html", "Forum update"),
        "toc": [
            ("shared", "Shared practices"),
            ("woocommerce", "WooCommerce"),
            ("shopify", "Shopify"),
            ("magento", "Magento 2"),
            ("prestashop", "PrestaShop"),
            ("shopware", "Shopware 6"),
        ],
    },
    "forum-update.html": {
        "title": "Forum update · Guides · VelinStyle",
        "desc": "Modernize phpBB, Discourse, Flarum, XenForo, and Vanilla forums with VelinStyle.",
        "h1": "Forum update",
        "lead": "Replace legacy forum CSS incrementally with VelinStyle utilities and components while keeping accessibility and scanner checks green.",
        "breadcrumb": "Forum update",
        "body": """
      <h2 id="shared">Shared migration</h2>
      <ul>
        <li>Load VelinStyle after stripping conflicting legacy CSS (one template at a time).</li>
        <li>Use <code>velin-bottom-nav</code>, <code>velin-tabs</code>, and <code>velin-btn</code> for mobile-friendly navigation.</li>
        <li>Run <code>npx velinstyle scan --only a11y</code> on header/footer templates.</li>
        <li>Community support: <a href="https://forum.birdapi.de/" target="_blank" rel="noopener">BirdAPI Forum</a>.</li>
      </ul>

      <h2 id="phpbb">phpBB</h2>
      <p>Copy <code>velinstyle.min.css</code> into <code>styles/&lt;theme&gt;/theme/</code>, link from <code>stylesheet.css</code> or <code>overall_header.html</code>. Override prosilver grid classes in template HTML with <code>velin-grid</code> / <code>velin-card</code> on key pages first (index, viewtopic).</p>

      <h2 id="discourse">Discourse</h2>
      <p>Hosted: limited to Theme components and safe CSS in <code>theme-creator</code>. Self-hosted: add a theme component with SCSS imports or link compiled VelinStyle CSS in <code>&lt;head&gt;</code> via plugin outlet. Respect Discourse CSP — external scripts need allowlisting.</p>

      <h2 id="flarum">Flarum</h2>
      <p>Extension <code>extend.php</code>: <code>(new ExtendFrontend('forum'))-&gt;css(__DIR__.'/less/forum.css')</code> where <code>forum.css</code> imports VelinStyle build output. Disable Flarum LESS variables that clash; map badges to <code>velin-badge</code>.</p>

      <h2 id="xenforo">XenForo</h2>
      <p>Add <code>@import</code> or link in <code>extra.less</code> (ACP → Appearance). Template modifications: wrap <code>PAGE_CONTAINER</code> sections with VelinStyle layout utilities. Rebuild style cache after changes.</p>

      <h2 id="vanilla">Vanilla (Vanilla Forums)</h2>
      <p>Theme Hooks in <code>themes/&lt;name&gt;</code>: add <code>custom.css</code> with VelinStyle link in <code>default.master.tpl</code>. Use <code>velin-search</code> for enhanced discussion search if you expose a JSON endpoint.</p>
""",
        "prev": ("ecommerce.html", "E-commerce"),
        "next": ("index.html", "Guides"),
        "toc": [
            ("shared", "Shared migration"),
            ("phpbb", "phpBB"),
            ("discourse", "Discourse"),
            ("flarum", "Flarum"),
            ("xenforo", "XenForo"),
            ("vanilla", "Vanilla"),
        ],
    },
}


def main() -> None:
    tpl = TEMPLATE.read_text(encoding="utf-8")
    for name, cfg in GUIDES.items():
        out = tpl
        out = out.replace("WordPress · Guides · VelinStyle", cfg["title"])
        out = out.replace(
            'content="Use VelinStyle in WordPress: wp_enqueue_style/script, block editor notes, and icon sprites."',
            f'content="{cfg["desc"]}"',
        )
        out = out.replace("<h1>WordPress</h1>", f"<h1>{cfg['h1']}</h1>")
        out = out.replace(
            '<p class="lead">Enqueue VelinStyle CSS and the components IIFE from your theme or plugin with <code>wp_enqueue_style</code> and <code>wp_enqueue_script</code>.</p>',
            f'<p class="lead">{cfg["lead"]}</p>',
        )
        out = out.replace("<li>WordPress</li>", f"<li>{cfg['breadcrumb']}</li>")
        # replace main content between h1 block end and prevnext
        import re

        out = re.sub(
            r"<h2 id=\"options\">.*?</nav class=\"velin-doc-prevnext\"",
            cfg["body"].strip() + '\n\n      <nav class="velin-doc-prevnext"',
            out,
            count=1,
            flags=re.DOTALL,
        )
        prev_href, prev_title = cfg["prev"]
        next_href, next_title = cfg["next"]
        out = re.sub(
            r'<a href="[^"]*" class="prev">.*?</a>\s*<a href="[^"]*" class="next">.*?</a>',
            f'<a href="{prev_href}" class="prev"><span class="velin-doc-prevnext__label">Previous</span>'
            f'<span class="velin-doc-prevnext__title">{prev_title}</span></a>'
            f'<a href="{next_href}" class="next"><span class="velin-doc-prevnext__label">Next</span>'
            f'<span class="velin-doc-prevnext__title">{next_title}</span></a>',
            out,
            count=1,
            flags=re.DOTALL,
        )
        toc_items = "".join(f'<li><a href="#{aid}">{label}</a></li>' for aid, label in cfg["toc"])
        out = re.sub(
            r"<ul class=\"velin-doc-toc__list\">.*?</ul>",
            f'<ul class="velin-doc-toc__list">{toc_items}</ul>',
            out,
            count=1,
            flags=re.DOTALL,
        )
        (SITE / "docs" / "guides" / name).write_text(out, encoding="utf-8")
        print(f"Wrote guides/{name}")


if __name__ == "__main__":
    main()
