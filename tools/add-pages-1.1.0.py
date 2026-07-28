#!/usr/bin/env python3
"""Scaffold the 1.1.0 component doc pages from the live-dot.html shell.

The doc shell (head, sidebar, footer) is cloned from an existing page and then
normalised by tools/sync-sidebar.py, so nothing here duplicates navigation.
"""
from __future__ import annotations

import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
TEMPLATE = SITE / "docs" / "components" / "live-dot.html"
OUT = SITE / "docs" / "components"

PAGES = [
    {
        "file": "data-table.html",
        "title": "Data table",
        "desc": "Accessible sortable, filterable and paginated table Web Component built on a real HTML table.",
        "crumb": "Data table",
        "lead": 'The <code>&lt;velin-data-table&gt;</code> Web Component enhances a plain <code>&lt;table&gt;</code> with sorting, filtering and pagination. The markup stays semantic, so the table is fully readable before the component upgrades and with JavaScript disabled.',
        "prev": ("content/tables.html", "Tables"),
        "next": ("form-summary.html", "Form summary"),
        "toc": ["basic", "sorting", "filtering", "pagination", "attributes", "api", "events", "a11y"],
        "body": r'''
      <h2 id="basic">Basic</h2>
      <p>Wrap an ordinary table. Add <code>sortable</code> to make every column sortable, or opt in per column with <code>data-sort</code>.</p>
      <div class="velin-doc-example">
        <div class="velin-doc-example__panel active">
          <div class="velin-doc-example__preview">
            <label class="velin-form-label" for="dtFilter">Filter people</label>
            <input id="dtFilter" type="search" class="velin-form-control" style="max-width:18rem;margin-block-end:1rem">
            <velin-data-table filter-input="#dtFilter" page-size="3" empty-text="No people match that filter">
              <table class="velin-table velin-table--striped">
                <caption>Team members</caption>
                <thead>
                  <tr>
                    <th data-sort="text">Name</th>
                    <th data-sort="number">Commits</th>
                    <th data-sort="date">Joined</th>
                    <th data-sort="none">Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Ada Lovelace</td><td>412</td><td>2023-01-15</td><td>Engineering</td></tr>
                  <tr><td>Grace Hopper</td><td>1280</td><td>2022-06-02</td><td>Engineering</td></tr>
                  <tr><td>Alan Turing</td><td>96</td><td>2024-03-01</td><td>Research</td></tr>
                  <tr><td>Katherine Johnson</td><td>734</td><td>2021-11-20</td><td>Research</td></tr>
                  <tr><td>Radia Perlman</td><td>58</td><td>2025-07-09</td><td>Networking</td></tr>
                </tbody>
              </table>
            </velin-data-table>
          </div>
        </div>
      </div>
      <pre><code class="language-html">&lt;velin-data-table filter-input="#dtFilter" page-size="3"&gt;
  &lt;table class="velin-table"&gt;
    &lt;caption&gt;Team members&lt;/caption&gt;
    &lt;thead&gt;
      &lt;tr&gt;
        &lt;th data-sort="text"&gt;Name&lt;/th&gt;
        &lt;th data-sort="number"&gt;Commits&lt;/th&gt;
        &lt;th data-sort="date"&gt;Joined&lt;/th&gt;
        &lt;th data-sort="none"&gt;Role&lt;/th&gt;
      &lt;/tr&gt;
    &lt;/thead&gt;
    &lt;tbody&gt;…&lt;/tbody&gt;
  &lt;/table&gt;
&lt;/velin-data-table&gt;</code></pre>
      <p>The table needs an accessible name. Provide a <code>&lt;caption&gt;</code>, an <code>aria-label</code>, or a <code>label</code> attribute on the host — the component warns in the console if all three are missing.</p>

      <h2 id="sorting">Sorting</h2>
      <p>Each sortable header is replaced with a real <code>&lt;button&gt;</code>, so sorting works with the keyboard and is announced as a button by screen readers. The current state lives on the <code>&lt;th&gt;</code> as <code>aria-sort</code>, and only one column is sorted at a time. Activating the same column again reverses the direction.</p>
      <table class="velin-table">
        <thead><tr><th><code>data-sort</code></th><th>Comparison</th></tr></thead>
        <tbody>
          <tr><td><code>text</code></td><td>Case-insensitive string comparison (default with <code>sortable</code>)</td></tr>
          <tr><td><code>number</code></td><td>Parsed as a number, so 9 sorts before 30</td></tr>
          <tr><td><code>date</code></td><td>Parsed with <code>Date.parse</code></td></tr>
          <tr><td><code>none</code></td><td>Column is not sortable and gets no button</td></tr>
        </tbody>
      </table>
      <p>To sort by something other than the visible text — a raw timestamp behind a formatted date, for example — put the comparable value in <code>data-sort-value</code> on the cell.</p>
      <pre><code class="language-html">&lt;td data-sort-value="1700000000"&gt;15 Nov 2023&lt;/td&gt;</code></pre>

      <h2 id="filtering">Filtering</h2>
      <p>Point <code>filter-input</code> at any existing input; typing filters rows on a debounced substring match. Non-matching rows get the <code>hidden</code> attribute, which removes them from the layout <em>and</em> the accessibility tree rather than just hiding them visually.</p>
      <p>By default the whole row is searched. Mark one or more cells with <code>data-filter</code> to restrict matching to those columns.</p>
      <pre><code class="language-html">&lt;td data-filter&gt;Ada Lovelace&lt;/td&gt;
&lt;td&gt;412&lt;/td&gt;  &lt;!-- ignored while filtering --&gt;</code></pre>
      <p>When nothing matches, a single row with <code>empty-text</code> is rendered across all columns.</p>

      <h2 id="pagination">Pagination</h2>
      <p>Set <code>page-size</code> to show a slice at a time. A labelled <code>&lt;nav&gt;</code> with Previous and Next buttons and a &ldquo;Page X of Y&rdquo; status is appended; the edge buttons are disabled rather than removed so focus is never lost. Pagination is omitted entirely while everything fits on one page, and filtering resets to page&nbsp;1.</p>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>sortable</code></td><td>—</td><td>Makes every column sortable as <code>text</code> unless <code>data-sort</code> says otherwise</td></tr>
          <tr><td><code>filter-input</code></td><td>—</td><td>CSS selector of the input driving the filter</td></tr>
          <tr><td><code>page-size</code></td><td>—</td><td>Rows per page; omit for no pagination</td></tr>
          <tr><td><code>empty-text</code></td><td><code>No matching rows</code></td><td>Shown when the filter matches nothing</td></tr>
          <tr><td><code>label</code></td><td>—</td><td>Applied as <code>aria-label</code> when the table has no caption</td></tr>
          <tr><td><code>pagination-label</code></td><td><code>Table pagination</code></td><td>Accessible name of the pagination nav</td></tr>
          <tr><td><code>previous-text</code> / <code>next-text</code></td><td><code>Previous</code> / <code>Next</code></td><td>Pagination button labels</td></tr>
        </tbody>
      </table>

      <h2 id="api">JavaScript API</h2>
      <pre><code class="language-js">const table = document.querySelector('velin-data-table');

table.sort(1, 'descending');   // column index, optional direction
table.filter('ada');           // same matching as the bound input
table.goToPage(2);             // clamped to the available pages

table.rows;          // every data row
table.matchingRows;  // rows passing the current filter
table.visibleRows;   // rows on the current page
table.page;          // current page number
table.pageCount;     // total pages for the current filter</code></pre>

      <h2 id="events">Events</h2>
      <ul>
        <li><code>velin-data-table-sort</code> — <code>detail.index</code>, <code>detail.direction</code>, <code>detail.column</code></li>
        <li><code>velin-data-table-filter</code> — <code>detail.query</code>, <code>detail.count</code></li>
        <li><code>velin-data-table-page</code> — <code>detail.page</code>, <code>detail.pageCount</code></li>
      </ul>

      <h2 id="a11y">Accessibility</h2>
      <ul>
        <li>Progressive enhancement over a semantic <code>&lt;table&gt;</code>: header cells, scope and caption are the author's markup, untouched.</li>
        <li>Sort triggers are native buttons (WCAG 2.1.1 Keyboard) and the sorted column exposes <code>aria-sort</code> (4.1.2 Name, Role, Value).</li>
        <li>Sort direction is conveyed by <code>aria-sort</code> and an announcement, not by the arrow glyph alone (1.4.1 Use of Color).</li>
        <li>Sort, filter and page changes are announced politely through <code>&lt;velin-announcer&gt;</code> (4.1.3 Status Messages).</li>
        <li>Hidden rows use the <code>hidden</code> attribute, so they leave the accessibility tree instead of lingering as invisible content.</li>
        <li>No animation, so there is nothing to suppress for <code>prefers-reduced-motion</code>.</li>
        <li>Sort buttons fill the header cell and keep a 2.75rem minimum block size (2.5.8 Target Size).</li>
      </ul>
      <p>Contract status in <code>core/a11y/component-contracts.json</code>: <strong>pass</strong>. See also <a href="../content/tables.html">Tables</a> for the static styling options.</p>
''',
    },
    {
        "file": "form-summary.html",
        "title": "Form summary",
        "desc": "Accessible form error summary Web Component that replaces native validation bubbles.",
        "crumb": "Form summary",
        "lead": 'The <code>&lt;velin-form-summary&gt;</code> Web Component turns native constraint validation into an accessible error summary: one focusable panel listing every invalid field, with <code>aria-invalid</code> and <code>aria-describedby</code> wired up per field.',
        "prev": ("data-table.html", "Data table"),
        "next": ("scroll-top.html", "Scroll to top"),
        "toc": ["why", "basic", "messages", "attributes", "api", "events", "a11y"],
        "body": r'''
      <h2 id="why">Why not native validation?</h2>
      <p>The browser's own validation bubble shows <strong>one</strong> error at a time, disappears on its own, cannot be styled, and is inconsistently exposed to assistive technology. On a form with several problems the user has to discover them one submit at a time.</p>
      <p>This component sets <code>novalidate</code> on the form and takes over: on submit it collects every invalid field, renders a persistent summary, and moves focus there. Constraint validation itself is unchanged — <code>required</code>, <code>type</code>, <code>pattern</code>, <code>min</code>, <code>maxlength</code> and custom messages all still apply.</p>

      <h2 id="basic">Basic</h2>
      <p>Place the element inside the form, or anywhere on the page with <code>for</code> pointing at the form id.</p>
      <div class="velin-doc-example">
        <div class="velin-doc-example__panel active">
          <div class="velin-doc-example__preview">
            <form id="summaryDemo" class="velin-stack velin-gap-3" style="max-width:24rem">
              <velin-form-summary heading="There is a problem with your details"></velin-form-summary>
              <label class="velin-form-label" for="sdEmail">Email address</label>
              <input class="velin-form-control" id="sdEmail" name="email" type="email" required autocomplete="email">
              <label class="velin-form-label" for="sdName">Full name</label>
              <input class="velin-form-control" id="sdName" name="name" required data-error-message="Enter your full name">
              <label class="velin-form-label" for="sdPlan">Plan</label>
              <select class="velin-form-control" id="sdPlan" name="plan" required>
                <option value="">Choose a plan…</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
              </select>
              <button type="submit" class="velin-btn velin-btn--primary">Create account</button>
            </form>
          </div>
        </div>
      </div>
      <pre><code class="language-html">&lt;form id="signup"&gt;
  &lt;velin-form-summary heading="There is a problem with your details"&gt;&lt;/velin-form-summary&gt;

  &lt;label class="velin-form-label" for="email"&gt;Email address&lt;/label&gt;
  &lt;input class="velin-form-control" id="email" name="email" type="email" required&gt;

  &lt;button type="submit" class="velin-btn velin-btn--primary"&gt;Create account&lt;/button&gt;
&lt;/form&gt;</code></pre>
      <p>Submitting with errors renders a <code>role="alert"</code> panel, focuses it, and announces the number of fields needing attention. Each summary entry links to its field; activating one moves focus straight to the input. Errors clear per field as soon as that field becomes valid, so the summary shrinks as the user works through it — it never re-flags a field the user has not submitted yet.</p>

      <h2 id="messages">Custom messages and containers</h2>
      <p>By default the browser's <code>validationMessage</code> is used, which is already localised. Override it per field, and control how the field is named in the summary:</p>
      <pre><code class="language-html">&lt;input id="name" name="name" required
       data-error-message="Enter your full name"
       data-error-label="Name"&gt;</code></pre>
      <p>Messages are injected as a <code>.velin-field-error</code> element after the field and referenced from <code>aria-describedby</code>. To control placement, supply your own container — the component fills it instead of creating one, and leaves it in the DOM when the error clears:</p>
      <pre><code class="language-html">&lt;input id="email" name="email" type="email" required&gt;
&lt;p class="velin-field-error" data-velin-error-for="email"&gt;&lt;/p&gt;</code></pre>
      <p>Existing <code>aria-describedby</code> hints are preserved: the error id is appended, so a field can point at both its hint and its error.</p>

      <h2 id="attributes">Attributes</h2>
      <table class="velin-table">
        <thead><tr><th>Attribute</th><th>Default</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>for</code></td><td>—</td><td>Form id; omit when nested inside the form</td></tr>
          <tr><td><code>heading</code></td><td><code>There is a problem</code></td><td>Summary heading text</td></tr>
          <tr><td><code>native-validation</code></td><td>—</td><td>Keeps the browser's own bubbles (does not set <code>novalidate</code>)</td></tr>
        </tbody>
      </table>
      <p>Per-field attributes: <code>data-error-message</code>, <code>data-error-label</code>, <code>data-error-ignore</code> (skip the field entirely), and <code>data-velin-error-for</code> on a message container. Disabled fields are always skipped, and a radio group is listed once rather than per radio.</p>

      <h2 id="api">JavaScript API</h2>
      <pre><code class="language-js">const summary = document.querySelector('velin-form-summary');

summary.validate();          // returns true when the form is valid
summary.focusFirstError();   // move focus to the first invalid field
summary.clear();             // drop the summary and all field error state

summary.errors;              // [{ field, label, message }]
summary.form;                // the bound form element</code></pre>

      <h2 id="events">Events</h2>
      <ul>
        <li><code>velin-form-invalid</code> — submit blocked; <code>detail.errors</code> lists label and message per field</li>
        <li><code>velin-form-valid</code> — the last outstanding error cleared</li>
        <li><code>velin-form-error-focus</code> — a summary link moved focus; <code>detail.name</code> identifies the field</li>
      </ul>

      <h2 id="a11y">Accessibility</h2>
      <ul>
        <li>Errors are identified in text next to each field and repeated in the summary (3.3.1 Error Identification).</li>
        <li>Messages describe how to fix the problem, from the browser or <code>data-error-message</code> (3.3.3 Error Suggestion).</li>
        <li><code>aria-invalid</code> and <code>aria-describedby</code> are maintained automatically (4.1.2 Name, Role, Value).</li>
        <li>The panel is <code>role="alert"</code> and receives focus, so both screen reader and sighted keyboard users land on the problem (3.3.1, 2.4.3 Focus Order).</li>
        <li>Summary entries are links to real field ids, and focus moves to the field on activation.</li>
        <li>The error count is announced assertively through <code>&lt;velin-announcer&gt;</code> (4.1.3 Status Messages).</li>
        <li>Errors are only shown after an explicit submit, never while the user is still typing a field for the first time.</li>
      </ul>
      <p>Contract status in <code>core/a11y/component-contracts.json</code>: <strong>pass</strong>. Pair it with the CSS-only states on <a href="../forms/validation.html">Validation</a> and <code>&lt;velin-persist&gt;</code> for <a href="persist.html">Redundant Entry</a>.</p>
''',
    },
]


def build_page(cfg: dict, shell_before: str, shell_after: str) -> str:
    prev_href, prev_title = cfg["prev"]
    next_href, next_title = cfg["next"]
    toc_items = "".join(
        f'<li><a href="#{id_}">{id_.replace("-", " ").capitalize()}</a></li>' for id_ in cfg["toc"]
    )
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
    head = shell_before
    head = re.sub(r"<title>[^<]+</title>", f'<title>{cfg["title"]} · Components · VelinStyle</title>', head, count=1)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{cfg["desc"]}">', head, count=1)
    head = re.sub(
        r'(<link rel="canonical" href="https://velinstyle\.info/docs/components/)[^"]+(">)',
        rf'\g<1>{cfg["file"]}\g<2>',
        head,
        count=1,
    )
    head = head.replace(
        "https://velinstyle.info/docs/components/live-dot.html",
        f'https://velinstyle.info/docs/components/{cfg["file"]}',
    )
    return head + main + shell_after


def main() -> None:
    text = TEMPLATE.read_text(encoding="utf-8")
    m = re.search(
        r'(.*)<main class="velin-doc-main".*?</main>\s*<aside class="velin-doc-toc".*?</aside>\s*</div>\s*<script',
        text,
        re.DOTALL,
    )
    if not m:
        raise SystemExit("template parse failed")
    before, after = m.group(1), text[m.end() - len("<script") :]
    for cfg in PAGES:
        path = OUT / cfg["file"]
        path.write_text(build_page(cfg, before, after), encoding="utf-8")
        print("wrote", path.name)


if __name__ == "__main__":
    main()
