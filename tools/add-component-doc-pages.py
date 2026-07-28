#!/usr/bin/env python3
"""Scaffold missing component doc pages from live-dot.html template."""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
TEMPLATE = SITE / "docs" / "components" / "live-dot.html"
OUT = SITE / "docs" / "components"

PAGES = [
    {
        "file": "copy.html",
        "title": "Copy",
        "desc": "One-click copy to clipboard Web Component with accessible button feedback.",
        "crumb": "Copy",
        "lead": 'The <code>&lt;velin-copy&gt;</code> Web Component copies text to the clipboard and shows a short success state. Use it beside code blocks, API keys, or share links.',
        "active": "copy.html",
        "prev": ("counter.html", "Counter"),
        "next": ("countdown.html", "Countdown"),
        "toc": ["basic", "attributes", "events", "a11y"],
        "body": r'''
      <h2 id="basic">Basic</h2>
      <div class="velin-doc-example">
        <div class="velin-doc-example__panel active">
          <div class="velin-doc-example__preview" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
            <code id="copyDemoText">npm install @birdapi/velinstyle</code>
            <velin-copy value="npm install @birdapi/velinstyle" label="Copy"></velin-copy>
          </div>
        </div>
      </div>
      <pre><code class="language-html">&lt;velin-copy value="npm install @birdapi/velinstyle" label="Copy"&gt;&lt;/velin-copy&gt;</code></pre>
      <p>Alternatively set <code>text</code> (alias), <code>data-source</code> on the element, or copy from a nearby element id via <code>data-source="#copyDemoText"</code>.</p>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>value</code> / <code>text</code></td><td>String copied on click (first match wins)</td></tr>
          <tr><td><code>label</code></td><td>Optional visible label beside the icon</td></tr>
          <tr><td><code>data-source</code></td><td>CSS selector; copies <code>textContent</code> of the matched node</td></tr>
        </tbody>
      </table>

      <h2 id="events">Events</h2>
      <p>Listen for <code>velin-copied</code> (bubbles) — <code>detail.value</code> contains the copied string.</p>
      <pre><code class="language-js">document.querySelector('velin-copy').addEventListener('velin-copied', (e) => {
  console.log('Copied', e.detail.value);
});</code></pre>
      <p>Declarative twin: <code>velin-copy</code> HTML attribute — see <a href="../guides/html-attributes.html">HTML attributes</a>.</p>

      <h2 id="a11y">Accessibility</h2>
      <ul>
        <li>Native <code>button</code> with <code>aria-label</code> (switches to &quot;Copied&quot; briefly).</li>
        <li>Minimum 44×44px touch target; focus ring via <code>:focus-visible</code>.</li>
      </ul>
''',
    },
    {
        "file": "countdown.html",
        "title": "Countdown",
        "desc": "Live countdown timer Web Component with days, hours, minutes, and seconds.",
        "crumb": "Countdown",
        "lead": 'The <code>&lt;velin-countdown&gt;</code> Web Component shows a live timer toward an ISO <code>datetime</code> target. Ideal for launches, event pages, and maintenance windows.',
        "active": "countdown.html",
        "prev": ("copy.html", "Copy"),
        "next": ("persist.html", "Persist"),
        "toc": ["basic", "attributes", "events", "a11y"],
        "body": r'''
      <h2 id="basic">Basic</h2>
      <div class="velin-doc-example">
        <div class="velin-doc-example__panel active">
          <div class="velin-doc-example__preview">
            <velin-countdown datetime="2030-01-01T00:00:00Z"></velin-countdown>
          </div>
        </div>
      </div>
      <pre><code class="language-html">&lt;velin-countdown datetime="2030-01-01T00:00:00Z"&gt;&lt;/velin-countdown&gt;</code></pre>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>datetime</code></td><td>—</td><td>ISO 8601 target (required)</td></tr>
          <tr><td><code>show-days</code></td><td><code>true</code></td><td>Set <code>false</code> to hide the days segment</td></tr>
          <tr><td><code>size</code></td><td>—</td><td><code>sm</code> or <code>lg</code></td></tr>
          <tr><td><code>label-days</code> … <code>label-seconds</code></td><td>Days/Hours/Min/Sec</td><td>Segment captions</td></tr>
        </tbody>
      </table>

      <h2 id="events">Events</h2>
      <p><code>velin-countdown-end</code> fires once when the timer reaches zero.</p>

      <h2 id="a11y">Accessibility</h2>
      <ul>
        <li><code>role="timer"</code>, <code>aria-live="polite"</code>, <code>aria-atomic="true"</code>.</li>
        <li><code>aria-label</code> summarizes remaining time for screen readers.</li>
      </ul>
''',
    },
    {
        "file": "persist.html",
        "title": "Persist",
        "desc": "Auto-save form field values to localStorage or sessionStorage.",
        "crumb": "Persist",
        "lead": 'Wrap a form (or field group) in <code>&lt;velin-persist&gt;</code> to debounce-save named inputs to <code>localStorage</code> (default) or <code>sessionStorage</code>. Password and file inputs are never stored.',
        "active": "persist.html",
        "prev": ("countdown.html", "Countdown"),
        "next": ("scroll-top.html", "Scroll to top"),
        "toc": ["basic", "attributes", "api", "events", "security"],
        "body": r'''
      <h2 id="basic">Basic</h2>
      <div class="velin-doc-example">
        <div class="velin-doc-example__panel active">
          <div class="velin-doc-example__preview">
            <velin-persist key="contact-demo">
              <form class="velin-stack velin-gap-3" style="max-width:20rem">
                <label class="velin-form-label">Name <input class="velin-form-control" name="name" type="text" autocomplete="name"></label>
                <label class="velin-form-label">Email <input class="velin-form-control" name="email" type="email" autocomplete="email"></label>
                <button type="submit" class="velin-btn velin-btn--primary">Submit (clears draft)</button>
              </form>
            </velin-persist>
          </div>
        </div>
      </div>
      <pre><code class="language-html">&lt;velin-persist key="contact-draft"&gt;
  &lt;form&gt;…&lt;/form&gt;
&lt;/velin-persist&gt;</code></pre>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>key</code></td><td><code>default</code></td><td>Storage suffix (<code>velin-persist-{key}</code>); alphanumeric + <code>_-</code></td></tr>
          <tr><td><code>storage</code></td><td><code>local</code></td><td><code>session</code> for <code>sessionStorage</code></td></tr>
        </tbody>
      </table>

      <h2 id="api">JavaScript API</h2>
      <pre><code class="language-js">document.querySelector('velin-persist').clear();</code></pre>
      <p>Also clears on form <code>submit</code> and <code>reset</code>.</p>

      <h2 id="events">Events</h2>
      <ul>
        <li><code>velin-persist-restore</code> — after values are applied</li>
        <li><code>velin-persist-clear</code> — storage entry removed</li>
        <li><code>velin-persist-error</code> — e.g. <code>detail.error === 'quota'</code></li>
      </ul>

      <h2 id="security">Security</h2>
      <p>Never persist secrets: <code>type="password"</code> and <code>type="file"</code> are skipped. Max payload 64&nbsp;KB per key. For PII in source, run <code>npx velinstyle scan --only pii</code>.</p>
''',
    },
    {
        "file": "scroll-top.html",
        "title": "Scroll to top",
        "desc": "Floating back-to-top button Web Component with scroll threshold.",
        "crumb": "Scroll to top",
        "lead": 'Add <code>&lt;velin-scroll-top&gt;</code> once per page. It appears after scrolling past a threshold and scrolls smoothly to the top (respects <code>prefers-reduced-motion</code>).',
        "active": "scroll-top.html",
        "prev": ("persist.html", "Persist"),
        "next": ("live-dot.html", "Live dot"),
        "toc": ["basic", "attributes", "styling", "a11y"],
        "body": r'''
      <h2 id="basic">Basic</h2>
      <p>Scroll this page to see the button in the lower corner.</p>
      <velin-scroll-top threshold="200"></velin-scroll-top>
      <pre><code class="language-html">&lt;velin-scroll-top threshold="300"&gt;&lt;/velin-scroll-top&gt;</code></pre>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>threshold</code></td><td><code>300</code></td><td>Scroll offset (px) before the button is shown</td></tr>
        </tbody>
      </table>

      <h2 id="styling">Styling</h2>
      <p>Position via CSS variables on <code>:host</code>:</p>
      <pre><code class="language-css">velin-scroll-top {
  --velin-scroll-top-bottom: 1.5rem;
  --velin-scroll-top-end: 1.5rem;
}</code></pre>

      <h2 id="a11y">Accessibility</h2>
      <ul>
        <li>Fixed <code>aria-label="Scroll to top"</code> on the control.</li>
        <li>Uses <code>scroll-behavior</code> only when reduced motion is off.</li>
      </ul>
''',
    },
]


def build_page(cfg: dict, shell_before: str, shell_after: str) -> str:
    prev_href, prev_title = cfg["prev"]
    next_href, next_title = cfg["next"]
    toc_items = "".join(f'<li><a href="#{id_}">{id_.replace("-", " ").title()}</a></li>' for id_ in cfg["toc"])
    main = f'''
    <main class="velin-doc-main" id="main-content">
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../components/accordion.html">Components</a></li><li>{cfg["crumb"]}</li></ol>
      <h1>{cfg["title"]}</h1>
      <p class="lead">{cfg["lead"]}</p>
{cfg["body"]}
      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="{prev_href}" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">{prev_title}</span></a>
        <a href="{next_href}" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">{next_title}</span></a>
      </nav>
    </main>
    <aside class="velin-doc-toc" aria-label="On this page"><div class="velin-doc-toc__title">On this page</div><ul class="velin-doc-toc__list">{toc_items}</ul></aside>
'''
    head = shell_before.replace("Live dot", cfg["title"]).replace(
        "Small status indicator Web Component",
        cfg["desc"],
    )
    # fix title tag
    head = re.sub(
        r"<title>[^<]+</title>",
        f'<title>{cfg["title"]} · Components · VelinStyle</title>',
        head,
        count=1,
    )
    head = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{cfg["desc"]}">',
        head,
        count=1,
    )
    return head + main + shell_after


def main() -> None:
    text = TEMPLATE.read_text(encoding="utf-8")
    m = re.search(r"(.*)<main class=\"velin-doc-main\".*?</main>\s*<aside class=\"velin-doc-toc\".*?</aside>\s*</div>\s*<script", text, re.DOTALL)
    if not m:
        raise SystemExit("template parse failed")
    before, after = m.group(1), text[m.end() - len("<script") :]
    for cfg in PAGES:
        path = OUT / cfg["file"]
        path.write_text(build_page(cfg, before, after), encoding="utf-8")
        print("wrote", path.name)


if __name__ == "__main__":
    main()
