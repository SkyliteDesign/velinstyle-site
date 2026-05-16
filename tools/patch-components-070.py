#!/usr/bin/env python3
"""Patch collapse, carousel, dropdown, popover docs for 0.7.0 a11y."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "docs" / "components"


def patch_carousel(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        '<p>Add the <code>autoplay</code> attribute. Set interval in milliseconds with <code>interval</code> (default 5000).</p>',
        '<p>Add the <code>autoplay</code> attribute. Set interval in milliseconds with <code>interval</code> (default 5000). '
        'A <strong>Pause</strong> / <strong>Play</strong> button appears in the indicator row (see '
        '<a href="#autoplay-pause">pause control</a>).</p>',
    )
    insert = """
      <h2 id="keyboard-nav">Keyboard navigation</h2>
      <p>When focus is inside the carousel, arrow keys move between slides.</p>
      <table class="velin-doc-table">
        <thead><tr><th>Key</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td><kbd>Arrow Left</kbd> / <kbd>Arrow Right</kbd></td><td>Previous / next slide</td></tr>
          <tr><td><kbd>Home</kbd> / <kbd>End</kbd></td><td>First / last slide</td></tr>
        </tbody>
      </table>

      <h2 id="autoplay-pause">Pause control</h2>
      <p>With <code>autoplay</code>, a pause button is added next to the dot indicators. It toggles <code>aria-pressed</code>,
        updates its label between &ldquo;Pause automatic slide show&rdquo; and &ldquo;Resume automatic slide show&rdquo;,
        and stops the timer until pressed again. Autoplay also pauses while the carousel is hovered or contains focus.</p>
"""
    marker = '      <h2 id="accessibility">Accessibility</h2>'
    if insert.strip() not in text:
        text = text.replace(marker, insert + marker)
    old_a11y = """      <h2 id="accessibility">Accessibility</h2>
      <ul>
        <li>Track has <code>role="group"</code> and <code>aria-roledescription="carousel"</code>.</li>
        <li>Prev/next buttons have descriptive <code>aria-label</code>s.</li>
        <li>Dot indicators use <code>role="tab"</code> with <code>aria-label="Slide N"</code>.</li>
        <li>Non-visible slides are marked <code>aria-hidden="true"</code> and <code>inert</code>.</li>
        <li>Autoplay pauses on hover and focus for <code>prefers-reduced-motion</code> compatibility.</li>
        <li>Touch swipe threshold is 50px to prevent accidental navigation.</li>
      </ul>"""
    new_a11y = """      <h2 id="accessibility">Accessibility</h2>
      <ul>
        <li>Host has <code>role="region"</code> and <code>aria-roledescription="carousel"</code>; the slide track is a <code>role="group"</code>.</li>
        <li>Each slide gets <code>aria-roledescription="slide"</code> and <code>aria-label="Slide N of M"</code>; inactive slides use <code>aria-hidden="true"</code> and <code>inert</code>.</li>
        <li>Prev/next controls use descriptive <code>aria-label</code>s and meet the 2.75&times;2.75&nbsp;rem minimum target size (WCAG 2.5.8).</li>
        <li>Dot indicators are <code>&lt;button&gt;</code> elements with <code>aria-label="Go to slide N"</code> and <code>aria-current</code> on the active slide.</li>
        <li>Autoplay includes an explicit pause/play control (WCAG 2.2.2) and pauses on hover or when focus enters the carousel.</li>
        <li>Track transitions respect <code>prefers-reduced-motion: reduce</code>; touch swipe threshold is 50&nbsp;px.</li>
      </ul>"""
    text = text.replace(old_a11y, new_a11y)
    toc_old = """        <li><a href="#autoplay">Autoplay</a></li>
        <li><a href="#accessibility">Accessibility</a></li>"""
    toc_new = """        <li><a href="#autoplay">Autoplay</a></li>
        <li><a href="#keyboard-nav">Keyboard navigation</a></li>
        <li><a href="#autoplay-pause">Pause control</a></li>
        <li><a href="#accessibility">Accessibility</a></li>"""
    text = text.replace(toc_old, toc_new)
    path.write_text(text, encoding="utf-8")
    print("patched", path.name)


def patch_dropdown(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "with start/end alignment and full keyboard navigation.",
        "with start/end alignment, type-ahead search, and full keyboard navigation (0.7.0).",
    )
    row = '          <tr><td><kbd>End</kbd></td><td>Focus last item</td></tr>\n'
    typeahead = (
        row
        + '          <tr><td>Letter / digit keys</td><td>Type-ahead: focus first item whose label starts with the typed string (500&nbsp;ms window)</td></tr>\n'
    )
    text = text.replace(row, typeahead, 1)
    old_a11y = """      <h2 id="accessibility">Accessibility</h2>
      <ul>
        <li>Menu panel has <code>role="menu"</code>.</li>
        <li>Items should have <code>role="menuitem"</code>.</li>
        <li>First item receives focus when menu opens.</li>
        <li>Clicking outside the dropdown closes it.</li>
        <li>Animations respect <code>prefers-reduced-motion</code>.</li>
      </ul>"""
    new_a11y = """      <h2 id="accessibility">Accessibility</h2>
      <p>Menu behaviour follows the <a href="../getting-started/a11y-patterns.html#menu-keyboard">keyboard menu pattern</a>.</p>
      <ul>
        <li>Trigger gets <code>aria-haspopup="menu"</code>, <code>aria-expanded</code>, and <code>aria-controls</code> (menu id).</li>
        <li>Menu panel has <code>role="menu"</code>; items use <code>role="menuitem"</code> (assigned automatically if omitted).</li>
        <li>Roving <code>tabindex</code> with arrow keys; first item is focused when the menu opens.</li>
        <li>Type-ahead focuses the first matching item by visible label (WAI-ARIA menu pattern).</li>
        <li><kbd>Escape</kbd> closes the menu and returns focus to the trigger; outside click closes as well.</li>
        <li>Menu items use a minimum block size of 2.5&nbsp;rem; animations respect <code>prefers-reduced-motion</code>.</li>
      </ul>"""
    text = text.replace(old_a11y, new_a11y)
    path.write_text(text, encoding="utf-8")
    print("patched", path.name)


def patch_popover(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "with configurable placement and triggers.",
        "with configurable placement, triggers, and WCAG 2.2–aligned roles and focus management (0.7.0).",
    )
    text = text.replace('velin-btn-primary', 'velin-btn--primary')
    text = text.replace(
        '<velin-popover content="This is a popover body." trigger="click">',
        '<velin-popover title="Popover title" trigger="click">',
    )
    text = text.replace(
        '<pre><code class="language-html">&lt;velin-popover content="This is a popover body." trigger="click"&gt;\n'
        '  &lt;button class="velin-btn velin-btn--primary" slot="trigger"&gt;Click me&lt;/button&gt;\n'
        '&lt;/velin-popover&gt;</code></pre>',
        '<pre><code class="language-html">&lt;velin-popover title="Popover title" trigger="click"&gt;\n'
        '  &lt;button class="velin-btn velin-btn--primary" slot="trigger"&gt;Click me&lt;/button&gt;\n'
        '  &lt;p&gt;This is the popover body (default slot).&lt;/p&gt;\n'
        '&lt;/velin-popover&gt;</code></pre>',
    )
    # Add body in preview
    text = text.replace(
        '              <button class="velin-btn velin-btn--primary" slot="trigger">Click me</button>\n'
        '            </velin-popover>',
        '              <button class="velin-btn velin-btn--primary" slot="trigger">Click me</button>\n'
        '              <p>This is the popover body (default slot).</p>\n'
        '            </velin-popover>',
    )
    text = text.replace(
        '<p>Set <code>placement</code> to <code>top</code>, <code>right</code>, <code>bottom</code>, or <code>left</code>.</p>',
        '<p>Set <code>placement</code> to <code>top</code>, <code>bottom</code>, <code>start</code>, or <code>end</code> (logical inline positions).</p>',
    )
    placements = """&lt;velin-popover placement="top" title="Top"&gt;
  &lt;button slot="trigger"&gt;Top&lt;/button&gt;
  &lt;p&gt;Content&lt;/p&gt;
&lt;/velin-popover&gt;

&lt;velin-popover placement="end" title="End"&gt;
  &lt;button slot="trigger"&gt;End&lt;/button&gt;
  &lt;p&gt;Content&lt;/p&gt;
&lt;/velin-popover&gt;

&lt;velin-popover placement="bottom" title="Bottom"&gt;
  &lt;button slot="trigger"&gt;Bottom&lt;/button&gt;
  &lt;p&gt;Content&lt;/p&gt;
&lt;/velin-popover&gt;

&lt;velin-popover placement="start" title="Start"&gt;
  &lt;button slot="trigger"&gt;Start&lt;/button&gt;
  &lt;p&gt;Content&lt;/p&gt;
&lt;/velin-popover&gt;"""
    import re
    text = re.sub(
        r'<pre><code class="language-html">&lt;velin-popover placement="top".*?</code></pre>',
        f'<pre><code class="language-html">{placements}</code></pre>',
        text,
        count=1,
        flags=re.DOTALL,
    )
    text = text.replace(
        '&lt;velin-popover trigger="hover" content="Hover popover"&gt;',
        '&lt;velin-popover trigger="hover" title="Hover popover"&gt;',
    )
    text = text.replace(
        '&lt;velin-popover trigger="focus" content="Focus popover"&gt;',
        '&lt;velin-popover trigger="focus" title="Focus popover"&gt;',
    )
    text = text.replace(
        '  &lt;span slot="trigger"&gt;Hover me&lt;/span&gt;\n&lt;/velin-popover&gt;',
        '  &lt;button slot="trigger"&gt;Hover me&lt;/button&gt;\n  &lt;p&gt;Shown on hover or focus.&lt;/p&gt;\n&lt;/velin-popover&gt;',
    )
    text = text.replace(
        '  &lt;input slot="trigger" placeholder="Focus me"&gt;\n&lt;/velin-popover&gt;',
        '  &lt;input slot="trigger" placeholder="Focus me" aria-label="Focus trigger"&gt;\n  &lt;p&gt;Shown while focused.&lt;/p&gt;\n&lt;/velin-popover&gt;',
    )
    text = text.replace(
        '<h2 id="with-title">With title</h2>\n'
        '      <p>Add a <code>heading</code> attribute for a styled title bar.</p>',
        '<h2 id="with-title">With title</h2>\n'
        '      <p>Add a <code>title</code> attribute for a styled title bar (escaped for XSS safety).</p>',
    )
    text = text.replace(
        '&lt;velin-popover heading="Popover Title"\n'
        '               content="And here\'s some content below the title."&gt;',
        '&lt;velin-popover title="Popover Title"&gt;',
    )
    text = text.replace(
        '    Titled Popover\n'
        '  &lt;/button&gt;\n'
        '&lt;/velin-popover&gt;',
        '    Titled Popover\n'
        '  &lt;/button&gt;\n'
        '  &lt;p&gt;And here\'s some content below the title.&lt;/p&gt;\n'
        '&lt;/velin-popover&gt;',
    )
    block = """
      <h2 id="accessibility">Accessibility</h2>
      <ul>
        <li><code>trigger="click"</code> (default): popover panel uses <code>role="dialog"</code>; <code>trigger="hover"</code> uses <code>role="tooltip"</code>.</li>
        <li>Trigger receives <code>aria-expanded</code>; click/focus triggers also get <code>aria-haspopup</code> and <code>aria-controls</code>.</li>
        <li>Click popovers trap focus with <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> and close on <kbd>Escape</kbd>, restoring focus to the trigger.</li>
        <li>Hover popovers open on pointer enter and <code>focusin</code>; they close when focus or pointer leaves the component.</li>
        <li>Title text from the <code>title</code> attribute is HTML-escaped before render.</li>
      </ul>

      <h2 id="javascript-api">JavaScript API</h2>
      <h3>Attributes</h3>
      <table class="velin-doc-table">
        <thead><tr><th>Attribute</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>placement</code></td><td>String</td><td><code>top</code>, <code>bottom</code>, <code>start</code>, <code>end</code> (default <code>bottom</code>)</td></tr>
          <tr><td><code>trigger</code></td><td>String</td><td><code>click</code>, <code>hover</code>, or <code>focus</code></td></tr>
          <tr><td><code>title</code></td><td>String</td><td>Optional heading above the default slot</td></tr>
          <tr><td><code>open</code></td><td>Boolean</td><td>Whether the popover is visible</td></tr>
        </tbody>
      </table>
      <h3>Methods</h3>
      <table class="velin-doc-table">
        <thead><tr><th>Method</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>open()</code></td><td>Show the popover</td></tr>
          <tr><td><code>close()</code></td><td>Hide the popover</td></tr>
          <tr><td><code>toggle()</code></td><td>Toggle visibility</td></tr>
        </tbody>
      </table>
"""
    nav = '      <nav class="velin-doc-prevnext"'
    if '<h2 id="accessibility">Accessibility</h2>' not in text:
        text = text.replace(nav, block + nav)
    toc_nav = '      <nav class="velin-doc-prevnext"'
    toc_block = """        <li><a href="#with-title">With title</a></li>
        <li><a href="#accessibility">Accessibility</a></li>
        <li><a href="#javascript-api">JavaScript API</a></li>
      </ul>
    </aside>"""
    text = text.replace(
        '        <li><a href="#with-title">With title</a></li>\n'
        '      </ul>\n'
        '    </aside>',
        toc_block,
    )
    path.write_text(text, encoding="utf-8")
    print("patched", path.name)


def main() -> None:
    patch_carousel(ROOT / "carousel.html")
    patch_dropdown(ROOT / "dropdown.html")
    patch_popover(ROOT / "popover.html")
    print("collapse.html was updated separately")


if __name__ == "__main__":
    main()
