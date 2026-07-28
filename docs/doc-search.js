/**
 * VelinStyle docs search — bundled VelinSearch API + offline JSON index.
 */
import { createSearch, highlightHtml } from './assets/velin-search-core.mjs';

const CATEGORY_LABELS = {
  docs: 'Documentation',
  components: 'Components',
  api: 'API',
  examples: 'Examples',
};

/** @returns {URL} Base URL for paths in search-index.json (relative to docs/). */
function docsBaseUrl() {
  const path = window.location.pathname.replace(/\\/g, '/');
  const idx = path.indexOf('/docs/');
  if (idx >= 0) {
    return new URL(path.slice(0, idx + '/docs/'.length), window.location.origin);
  }
  return new URL('./', window.location.href);
}

function resolveResultUrl(url) {
  if (!url) return '#';
  if (/^https?:\/\//i.test(url) || url.startsWith('//')) return url;
  try {
    return new URL(url, docsBaseUrl()).href;
  } catch {
    return url;
  }
}

function initDocSearch() {
  const input = document.getElementById('docSearch');
  if (!input) return;

  const search = createSearch({ worker: false });
  const indexAttr = input.getAttribute('data-search-index') || 'search-index.json';
  const indexUrl = new URL(indexAttr, window.location.href).href;
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
        const a = document.createElement('a');
        a.href = resolveResultUrl(item.url);
        a.className = 'velin-doc-search-results__item velin-search__item';
        a.setAttribute('role', 'option');
        a.innerHTML =
          `<span class="velin-doc-search-results__title velin-search__title">${highlightHtml(item.title, q)}</span>` +
          `<span class="velin-doc-search-results__meta velin-search__excerpt">${highlightHtml(item.section || item.excerpt || '', q)}</span>`;
        a.addEventListener('mouseenter', () => setActive(idx));
        box.appendChild(a);
        flat.push(item);
        idx++;
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
      const t = active >= 0 ? flat[active] : flat[0];
      if (t?.url) {
        e.preventDefault();
        window.location.href = resolveResultUrl(t.url);
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.parentElement.contains(e.target)) hide();
  });
}

initDocSearch();
