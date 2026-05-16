(function () {
  const input = document.getElementById('docSearch');
  if (!input) return;

  const indexUrl = input.getAttribute('data-search-index') || 'search-index.json';
  let index = [];
  let panel = null;

  function relRoot() {
    const depth = (window.location.pathname.match(/\//g) || []).length;
    return indexUrl;
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'docSearchResults';
    panel.className = 'velin-doc-search-results';
    panel.setAttribute('role', 'listbox');
    panel.hidden = true;
    input.parentElement.appendChild(panel);
    return panel;
  }

  function render(items) {
    const box = ensurePanel();
    box.innerHTML = '';
    if (!items.length) {
      box.hidden = true;
      return;
    }
    items.slice(0, 12).forEach((item) => {
      const a = document.createElement('a');
      a.href = item.url;
      a.className = 'velin-doc-search-results__item';
      a.setAttribute('role', 'option');
      a.innerHTML =
        '<span class="velin-doc-search-results__title">' +
        item.title +
        '</span><span class="velin-doc-search-results__meta">' +
        item.section +
        '</span>';
      box.appendChild(a);
    });
    box.hidden = false;
  }

  function score(entry, q) {
    const t = entry.title.toLowerCase();
    const k = entry.keywords.toLowerCase();
    if (t.includes(q)) return 3;
    if (k.includes(q)) return 2;
    if (entry.section.toLowerCase().includes(q)) return 1;
    return 0;
  }

  function search(q) {
    const query = q.trim().toLowerCase();
    if (query.length < 2) {
      if (panel) panel.hidden = true;
      return;
    }
    const hits = index
      .map((e) => ({ e, s: score(e, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.e);
    render(hits);
  }

  fetch(indexUrl)
    .then((r) => r.json())
    .then((data) => {
      index = data;
    })
    .catch(() => {
      index = [];
    });

  input.addEventListener('input', () => search(input.value));
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) search(input.value);
  });
  document.addEventListener('click', (e) => {
    if (panel && !input.parentElement.contains(e.target)) panel.hidden = true;
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel) panel.hidden = true;
  });
})();
