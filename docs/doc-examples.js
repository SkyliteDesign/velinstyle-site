/**
 * Docs chrome: example Preview/HTML tabs, copy buttons, TOC highlight.
 * Classic script — works on file:// and http://.
 */
(function () {
  'use strict';

  document.querySelectorAll('.velin-doc-example').forEach((ex) => {
    const tabs = ex.querySelectorAll('.velin-doc-example__tab');
    const panels = ex.querySelectorAll('.velin-doc-example__panel');
    if (!tabs.length || !panels.length) return;

    if (![...panels].some((p) => p.classList.contains('active'))) {
      panels[0]?.classList.add('active');
      tabs[0]?.classList.add('active');
    }

    tabs.forEach((tab) => {
      if (tab.dataset.examplesBound) return;
      tab.dataset.examplesBound = '1';
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach((t) => t.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = ex.querySelector(`[data-panel="${target}"]`);
        if (panel) {
          panel.classList.add('active');
          if (target === 'code' && window.VelinDocHighlight) {
            panel.querySelectorAll('pre').forEach((pre) => {
              if (!pre.dataset.velinHighlighted) {
                void window.VelinDocHighlight.highlightElement(pre);
              }
            });
          }
        }
      });
    });
  });

  document.querySelectorAll('.velin-doc-copy-btn').forEach((btn) => {
    if (btn.dataset.examplesBound) return;
    btn.dataset.examplesBound = '1';
    btn.addEventListener('click', () => {
      const code = btn.closest('.velin-doc-example__code')?.querySelector('code');
      if (!code) return;
      const text = code.dataset.velinSource || code.textContent;
      const done = () => {
        btn.classList.add('copied');
        const prev = btn.innerHTML;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = prev;
        }, 2000);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => {});
      }
    });
  });

  const tocLinks = document.querySelectorAll('.velin-doc-toc .velin-doc-toc__list a');
  const headings = Array.from(tocLinks)
    .map((a) => {
      const id = a.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  /** Same-page anchors: <base href="…/dir/"> breaks href="#id" → navigate to dir 404. */
  tocLinks.forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#') || a.dataset.tocScrollBound) return;
    a.dataset.tocScrollBound = '1';
    a.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
      updateToc();
    });
  });

  function updateToc() {
    const scrollY = window.scrollY + 100;
    let current = null;
    headings.forEach((h) => {
      if (h.offsetTop <= scrollY) current = h;
    });
    tocLinks.forEach((a) => {
      a.classList.toggle('active', current && a.getAttribute('href') === `#${current.id}`);
    });
  }

  if (tocLinks.length) {
    window.addEventListener('scroll', updateToc, { passive: true });
    updateToc();
  }
})();
