/**
 * Apply theme before paint.
 * Site default: dark. Respect explicit localStorage (incl. light).
 */
(function () {
  try {
    var stored =
      localStorage.getItem('velin-theme') ||
      localStorage.getItem('velin-doc-theme');
    var slug;
    if (stored == null || stored === '') {
      slug = 'dark';
      try {
        localStorage.setItem('velin-theme', 'dark');
      } catch (_) {
        /* private mode */
      }
    } else if (stored === 'light') {
      slug = '';
    } else {
      slug = stored;
    }

    if (slug) {
      document.documentElement.setAttribute('data-velin-theme', slug);
      document.documentElement.style.colorScheme = slug === 'dark' ? 'dark' : 'light';
    } else {
      document.documentElement.removeAttribute('data-velin-theme');
      document.documentElement.style.colorScheme = 'light';
    }

    if (slug && slug !== 'dark') {
      var base = document.documentElement.getAttribute('data-velin-themes-base') || 'dist/themes';
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = base.replace(/\/$/, '') + '/' + slug + '.min.css';
      link.setAttribute('data-velin-theme-css', slug);
      document.head.appendChild(link);
    }

    /* Docs reader prefs (font scale / family) — apply before paint when present */
    var scale = localStorage.getItem('velin-doc-text-scale');
    if (scale != null && scale !== '') {
      document.documentElement.style.setProperty('--doc-reader-scale', scale);
    }
    var font = localStorage.getItem('velin-doc-font');
    if (font === 'sans' || font === 'serif' || font === 'mono') {
      document.documentElement.setAttribute('data-doc-font', font);
    }
  } catch (e) {
    document.documentElement.setAttribute('data-velin-theme', 'dark');
  }
})();
