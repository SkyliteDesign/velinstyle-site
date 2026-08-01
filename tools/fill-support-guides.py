#!/usr/bin/env python3
"""Fill thin support guides with real h2 sections so TOC stays meaningful."""
from __future__ import annotations

from pathlib import Path

GUIDES = Path(__file__).resolve().parent.parent / "docs" / "guides"

PAGES = {
    "faq.html": """      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>FAQ</li></ol>
      <h1>FAQ <span class="velin-badge velin-badge--primary">1.2.0</span></h1>
      <p class="lead">Short answers for first-time users. Full prose: <a href="https://github.com/SkyliteDesign/velinstyle/blob/main/FAQ.md">FAQ.md</a>.</p>
      <h2 id="what-is-velinstyle">What is VelinStyle?</h2>
      <p>An accessibility-first CSS + Web Components framework with a CLI, plus Design Intelligence and AI Skills (beta).</p>
      <h2 id="package-name">What is the npm package name?</h2>
      <p><strong>@birdapi/velinstyle</strong> — not <code>velinstyle</code>. Use <code>npx @birdapi/velinstyle</code>.</p>
      <h2 id="aaa">Does AAA mean my app is certified?</h2>
      <p><strong>No.</strong> Defaults are AAA-oriented. Your markup still needs review.</p>
      <h2 id="fit">What can I ship today?</h2>
      <p><strong>Strong:</strong> landings, docs shells, simple admin starters. <strong>Not yet primary:</strong> large multipage shop + enterprise admin without custom work.</p>
      <h2 id="check">What is <code>velinstyle check</code>?</h2>
      <p><code>doctor</code> + blueprint <code>--strict</code> + <code>scan</code> + <code>review</code>. Use on consumer scaffolds — not as one gate over a huge docs/demo tree.</p>
      <h2 id="related">Related</h2>
      <p><a href="troubleshooting.html">Troubleshooting</a> · <a href="deploy.html">Deploy</a> · <a href="cli-ship-surface.html">CLI ship surface</a></p>
""",
    "troubleshooting.html": """      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Troubleshooting</li></ol>
      <h1>Troubleshooting <span class="velin-badge velin-badge--primary">1.2.0</span></h1>
      <p class="lead">Common blockers. Full guide: <a href="https://github.com/SkyliteDesign/velinstyle/blob/main/TROUBLESHOOTING.md">TROUBLESHOOTING.md</a>.</p>
      <h2 id="npx-404"><code>npx velinstyle</code> → 404</h2>
      <p>Use <code>npx @birdapi/velinstyle</code>.</p>
      <h2 id="missing-commands">create / check / skills unknown</h2>
      <p>Those are the 1.2 ship surface. Until publish, run the CLI from a local clone.</p>
      <h2 id="check-flood"><code>check .</code> floods findings</h2>
      <p>Point it at a scaffold or a single HTML file, not an entire docs monorepo.</p>
      <h2 id="profiles">Review fails on admin pages</h2>
      <p>Pass <code>--profile app</code> (also <code>marketing</code>, <code>docs</code>, <code>fragment</code>, <code>ecommerce</code>).</p>
      <h2 id="dist">Blank styles after clone</h2>
      <p><code>dist/</code> is generated — run <code>npm install &amp;&amp; npm run build</code>.</p>
      <h2 id="related">Related</h2>
      <p><a href="faq.html">FAQ</a> · <a href="deploy.html">Deploy</a> · <a href="cli-ship-surface.html">CLI ship surface</a></p>
""",
    "deploy.html": """      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Deploy</li></ol>
      <h1>Deploy <span class="velin-badge velin-badge--primary">1.2.0</span></h1>
      <p class="lead">Ship a VelinStyle site to any static host. Full guide: <a href="https://github.com/SkyliteDesign/velinstyle/blob/main/DEPLOY.md">DEPLOY.md</a>.</p>
      <h2 id="assets">What to ship</h2>
      <p>HTML + CSS (or lite build). Themes folder if used. Icon sprite next to CSS. Component JS only if you use WCs.</p>
      <h2 id="static">Static hosting</h2>
      <pre><code>velinstyle create landing ./site
velinstyle check ./site --profile marketing
# deploy ./site</code></pre>
      <h2 id="cdn">CDN pins</h2>
      <p>Pin a version — never <code>@latest</code> in production.</p>
      <h2 id="checklist">Pre-deploy checklist</h2>
      <p>Run <code>doctor</code> + <code>check</code>. Confirm theme paths, icons, and no unknown <code>velin-*</code> classes on critical pages.</p>
      <h2 id="related">Related</h2>
      <p><a href="troubleshooting.html">Troubleshooting</a> · <a href="faq.html">FAQ</a></p>
""",
    "cli-ship-surface.html": """      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>CLI ship surface</li></ol>
      <h1>CLI ship surface <span class="velin-badge velin-badge--primary">1.2.0</span></h1>
      <p class="lead">create · serve · doctor · check · scan · review · wc api</p>
      <h2 id="loop">Recommended loop</h2>
      <pre><code>npx @birdapi/velinstyle create landing ./my-site
cd my-site
npx @birdapi/velinstyle serve .
npx @birdapi/velinstyle check . --profile marketing</code></pre>
      <h2 id="create">create</h2>
      <p>Kinds: <code>landing</code> · <code>dashboard</code> · <code>docs</code> · <code>auth</code>.</p>
      <h2 id="check">check</h2>
      <p>Aggregates doctor + blueprint <code>--strict</code> + scan + review. Flags: <code>--json</code> · <code>--sarif</code> · <code>--profile</code>.</p>
      <h2 id="wc-api">wc api</h2>
      <pre><code>velinstyle wc api velin-toast</code></pre>
      <h2 id="related">Related</h2>
      <p><a href="../extend/cli.html">CLI reference</a> · <a href="design-intelligence.html">Design Intelligence</a> · <a href="troubleshooting.html">Troubleshooting</a></p>
""",
}


def main() -> None:
    for name, inner in PAGES.items():
        path = GUIDES / name
        text = path.read_text(encoding="utf-8")
        start = text.find('<main class="velin-doc-main"')
        end = text.find("</main>", start)
        if start < 0 or end < 0:
            raise SystemExit(f"main missing in {name}")
        open_end = text.find(">", start) + 1
        text = text[:open_end] + "\n" + inner + text[end:]
        path.write_text(text, encoding="utf-8")
        print("updated", name)


if __name__ == "__main__":
    main()
