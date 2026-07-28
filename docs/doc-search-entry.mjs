/**
 * Bundled entry for docs search (ESM + IIFE builds).
 */
import {
  createSearch,
  highlightHtml,
  getDocsBaseUrl,
  resolveDocsSearchUrl,
} from '../../velinstyle/core/search/index.js';

const CATEGORY_LABELS = {
  docs: 'Documentation',
  components: 'Components',
  api: 'API',
  examples: 'Examples',
};

function navigateToResult(resolvedHref) {
  if (!resolvedHref) return;

  if (/\.md(?:[#?]|$)/i.test(resolvedHref) && globalThis.VelinDocMd?.open) {
    globalThis.VelinDocMd.open(resolvedHref);
    return;
  }

  let target;
  let current;
  try {
    current = new URL(window.location.href);
    target = new URL(resolvedHref);
  } catch {
    return;
  }

  const samePage =
    target.origin === current.origin &&
    target.pathname.replace(/\/$/, '') === current.pathname.replace(/\/$/, '');

  if (samePage && target.hash) {
    const id = decodeURIComponent(target.hash.slice(1));
    const el = document.getElementById(id) || document.querySelector(target.hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', target.hash);
      return;
    }
  }

  window.location.assign(target.href);
}

export function initDocSearch() {
  const input = document.getElementById('docSearch');
  if (!input) return;

  const search = createSearch({ worker: false });
  const indexUrl = new URL('search-index.json', getDocsBaseUrl()).href;
  let panel = null;
  let flat = [];
  let active = -1;

  function panelEl() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'docSearchResults';
    panel.className = 'velin-doc-search-results velin-search__results';
    panel.setAttribute('role', 'listbox');
    panel.hidden = true;
    input.parentElement.appendChild(panel);
    return panel;
  }

  function hide() {
    const p = panelEl();
    p.hidden = true;
    p.classList.remove('velin-search__results--open');
    input.setAttribute('aria-expanded', 'false');
    active = -1;
  }

  function setActive(idx) {
    active = idx;
    panelEl().querySelectorAll('.velin-doc-search-results__item, .velin-search__item').forEach((el, i) => {
      el.classList.toggle('velin-search__item--active', i === idx);
    });
  }

  function render(q, groups = {}) {
    const box = panelEl();
    box.innerHTML = '';
    flat = [];
    let idx = 0;
    for (const [cat, items] of Object.entries(groups || {})) {
      if (!items?.length) continue;
      const label = document.createElement('div');
      label.className = 'velin-search__group-label';
      label.textContent = CATEGORY_LABELS[cat] || cat;
      box.appendChild(label);
      for (const item of items) {
        const navHref = resolveDocsSearchUrl(item.url);
        const a = document.createElement('a');
        if (navHref) a.href = navHref;
        a.className = 'velin-doc-search-results__item velin-search__item';
        a.setAttribute('role', 'option');
        a.innerHTML =
          `<span class="velin-doc-search-results__title velin-search__title">${highlightHtml(item.title, q)}</span>` +
          `<span class="velin-doc-search-results__meta velin-search__excerpt">${highlightHtml(item.section || item.excerpt || '', q)}</span>`;
        a.addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!navHref) return;
            hide();
            navigateToResult(navHref);
          },
          true,
        );
        a.addEventListener('mouseenter', () => setActive(idx));
        box.appendChild(a);
        flat.push({ item, navHref });
        idx += 1;
      }
    }
    box.hidden = !flat.length;
    if (flat.length) {
      box.classList.add('velin-search__results--open');
      input.setAttribute('aria-expanded', 'true');
    }
  }

  async function run() {
    const q = input.value.trim();
    if (q.length < 2) {
      hide();
      return;
    }
    try {
      const { groups } = await search.query(q, { minChars: 2, fuzzy: 0.2, limit: 12 });
      render(q, groups);
    } catch (err) {
      console.warn('[doc-search] query failed', err);
      hide();
    }
  }

  search.loadIndex(indexUrl).catch((err) => {
    console.warn('[doc-search] index load failed', err);
  });

  input.addEventListener('input', run);
  input.addEventListener('focus', run);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
    if (!flat.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active < flat.length - 1 ? active + 1 : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active > 0 ? active - 1 : flat.length - 1);
    } else if (e.key === 'Enter') {
      const row = active >= 0 ? flat[active] : flat[0];
      if (row?.navHref) {
        e.preventDefault();
        hide();
        navigateToResult(row.navHref);
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.parentElement.contains(e.target)) hide();
  });
}

initDocSearch();
