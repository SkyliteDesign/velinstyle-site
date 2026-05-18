/**
 * Docs chrome: Font Awesome icons, sidebar collapse, mobile drawer, active link scroll.
 */
(function () {
  const FA_SOLID =
    'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/{name}.svg';

  const bc = document.querySelector('.velin-doc-breadcrumb');
  if (bc) {
    bc.setAttribute('aria-label', 'Breadcrumb');
  }

  document.querySelectorAll('.velin-doc-sidebar__links a[data-external]').forEach((a) => {
    a.setAttribute('title', a.textContent.trim() + ' (opens in new tab)');
  });

  function ensureSolidIcons() {
    const VI = customElements.get('velin-icon');
    if (VI?.registerProvider) {
      VI.registerProvider('fontawesome', FA_SOLID);
    }
    document
      .querySelectorAll('.velin-doc-sidebar velin-icon[provider="fontawesome"]')
      .forEach((el) => {
        if (!el.getAttribute('variant')) {
          el.setAttribute('variant', 'solid');
        }
      });
  }

  function initCategoryToggles() {
    document.querySelectorAll('.velin-doc-sidebar__category-header').forEach((btn) => {
      if (btn.dataset.navBound) return;
      btn.dataset.navBound = '1';
      btn.addEventListener('click', () => {
        const category = btn.closest('.velin-doc-sidebar__category');
        if (!category) return;
        category.classList.toggle('collapsed');
        btn.setAttribute(
          'aria-expanded',
          category.classList.contains('collapsed') ? 'false' : 'true'
        );
      });
    });
  }

  function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('sidebarToggle');
    if (!sidebar || !hamburger) return;

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('show');
      revealActiveLink(true);
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    }

    if (!hamburger.dataset.navBound) {
      hamburger.dataset.navBound = '1';
      hamburger.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) closeSidebar();
        else openSidebar();
      });
    }

    if (overlay && !overlay.dataset.navBound) {
      overlay.dataset.navBound = '1';
      overlay.addEventListener('click', closeSidebar);
    }
  }

  function revealActiveLink(force) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const active = sidebar.querySelector('.velin-doc-sidebar__links a.active');
    if (!active) return;

    if (active.closest('.velin-doc-sidebar__pinned')) return;

    const category = active.closest('.velin-doc-sidebar__category');
    if (category) {
      category.classList.remove('collapsed');
      const header = category.querySelector('.velin-doc-sidebar__category-header');
      if (header) header.setAttribute('aria-expanded', 'true');
    }

    if (!force && sidebar.scrollHeight <= sidebar.clientHeight + 4) return;

    const pinned = sidebar.querySelector('.velin-doc-sidebar__pinned');
    const pinnedBottom = pinned ? pinned.offsetTop + pinned.offsetHeight : 0;
    const activeTop = active.offsetTop;
    const activeBottom = activeTop + active.offsetHeight;
    const viewTop = sidebar.scrollTop + pinnedBottom;
    const viewBottom = sidebar.scrollTop + sidebar.clientHeight;

    if (!force && activeTop >= viewTop && activeBottom <= viewBottom) return;

    requestAnimationFrame(() => {
      const targetTop = Math.max(0, activeTop - pinnedBottom - 8);
      sidebar.scrollTo({ top: targetTop, behavior: force ? 'auto' : 'smooth' });
    });
  }

  function init() {
    ensureSolidIcons();
    initCategoryToggles();
    initMobileSidebar();
    revealActiveLink(false);
  }

  if (customElements.get('velin-icon')) {
    init();
  } else {
    customElements.whenDefined('velin-icon').then(init);
  }

  window.addEventListener('load', () => revealActiveLink(false));
})();
