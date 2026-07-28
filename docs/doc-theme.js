/**
 * Docs: theme picker + legacy header toggle, unified on localStorage velin-theme.
 */
(function () {
  const BUILTIN = new Set(['', 'light', 'dark']);
  const PACK_THEMES = [
    'sharp', 'soft', 'brutalist', 'neon', 'earth', 'ocean', 'sunset', 'nordic',
    'retro', 'corporate', 'pastel', 'midnight', 'forest',
  ];

  function themesBase() {
    const fromHtml = document.documentElement.getAttribute('data-velin-themes-base');
    if (fromHtml) return fromHtml.replace(/\/$/, '');
    const depth = (location.pathname.match(/\/docs\//) ? location.pathname.split('/').length - 2 : 1);
    return '../'.repeat(Math.max(1, depth)) + 'dist/themes';
  }

  function ensureThemeCss(slug) {
    if (!slug || BUILTIN.has(slug)) return;
    if (document.querySelector('link[data-velin-theme-css="' + slug + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = themesBase() + '/' + slug + '.min.css';
    link.setAttribute('data-velin-theme-css', slug);
    document.head.appendChild(link);
  }

  function applyTheme(slug, persist) {
    const normalized = !slug || slug === 'light' ? '' : slug;
    if (normalized) {
      document.documentElement.setAttribute('data-velin-theme', normalized);
      ensureThemeCss(normalized);
    } else {
      document.documentElement.removeAttribute('data-velin-theme');
    }
    if (persist !== false) {
      if (normalized) localStorage.setItem('velin-theme', normalized);
      else localStorage.removeItem('velin-theme');
      localStorage.removeItem('velin-doc-theme');
    }
    document.dispatchEvent(
      new CustomEvent('velin-theme-change', {
        bubbles: true,
        detail: { theme: normalized || 'light', slug: normalized },
      })
    );
    syncPickerUi(normalized);
  }

  function syncPickerUi(slug) {
    const panel = document.getElementById('themePanel');
    if (!panel) return;
    panel.querySelectorAll('[data-set-theme]').forEach((btn) => {
      const t = btn.getAttribute('data-set-theme') || '';
      btn.classList.toggle('active', t === slug);
    });
  }

  function initPicker() {
    const panel = document.getElementById('themePanel');
    const toggle = document.getElementById('themePickerToggle');
    if (!panel || !toggle) return;

    PACK_THEMES.forEach((t) => ensureThemeCss(t));

    toggle.addEventListener('click', () => panel.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      const root = document.getElementById('themePicker');
      if (root && !root.contains(e.target)) panel.classList.remove('open');
    });
    panel.querySelectorAll('[data-set-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(btn.getAttribute('data-set-theme') || '', true);
        panel.classList.remove('open');
      });
    });
  }

  function initLegacyToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-velin-theme') || '';
      applyTheme(cur === 'dark' ? '' : 'dark', true);
    });
  }

  const legacy = localStorage.getItem('velin-doc-theme');
  const saved = localStorage.getItem('velin-theme') || legacy || '';
  if (saved) applyTheme(saved, false);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark', false);

  initPicker();
  initLegacyToggle();

  window.addEventListener('storage', (e) => {
    if (e.key === 'velin-theme' || e.key === 'velin-doc-theme') {
      applyTheme(localStorage.getItem('velin-theme') || '', false);
    }
  });
})();
