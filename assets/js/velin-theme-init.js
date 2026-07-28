/**
 * Apply saved theme before paint (velin-theme / legacy velin-doc-theme).
 * Load optional theme pack CSS when slug is not built-in light/dark.
 */
(function () {
  try {
    var slug =
      localStorage.getItem('velin-theme') ||
      localStorage.getItem('velin-doc-theme') ||
      '';
    if (slug === 'light') slug = '';
    if (!slug) return;
    document.documentElement.setAttribute('data-velin-theme', slug);
    if (slug !== 'dark') {
      var base = document.documentElement.getAttribute('data-velin-themes-base') || 'dist/themes';
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = base.replace(/\/$/, '') + '/' + slug + '.min.css';
      link.setAttribute('data-velin-theme-css', slug);
      document.head.appendChild(link);
    }
  } catch (e) {
    /* ignore */
  }
})();
