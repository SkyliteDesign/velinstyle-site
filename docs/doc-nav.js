/**
 * Docs chrome: Font Awesome icons, sidebar collapse, mobile drawer, active link scroll.
 */
(function () {
  /** Redirect /docs/{section}/ to default page (avoids directory listings on static servers). */
  (function redirectDocSectionRoot() {
    const path = location.pathname.replace(/\\/g, '/');
    if (/\.html?$/i.test(path)) return;
    const match = path.match(/\/docs\/([^/]+)\/?$/);
    if (!match) return;
    const defaults = {
      forms: 'overview.html',
      components: 'accordion.html',
      'getting-started': 'introduction.html',
      customize: 'overview.html',
      layout: 'breakpoints.html',
      content: 'reboot.html',
      helpers: 'clearfix.html',
      utilities: 'api.html',
      animations: 'overview.html',
      extend: 'approach.html',
      about: 'overview.html',
    };
    const page = defaults[match[1]];
    if (!page) return;
    const base = path.replace(/\/?$/, '/');
    location.replace(base + page + location.search + location.hash);
  })();

  const FA_SOLID =
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/{name}.svg';

  const bc = document.querySelector('.velin-doc-breadcrumb');
  if (bc) {
    bc.setAttribute('aria-label', 'Breadcrumb');
  }

  document.querySelectorAll('.velin-doc-sidebar__links a[data-external]').forEach((a) => {
    a.setAttribute('title', a.textContent.trim() + ' (opens in new tab)');
  });

  const FILE_PROTOCOL = window.location.protocol === 'file:';

  const HEADER_ICON_FA = {
    menu: { name: 'bars', variant: 'solid' },
    github: { name: 'github', variant: 'brands' },
    copy: { name: 'copy', variant: 'solid' },
    check: { name: 'check', variant: 'solid' },
  };

  function distBaseFromStylesheet() {
    const link = document.querySelector('link[href*="velinstyle.min.css"]');
    if (!link) return '/dist/';
    const href = link.getAttribute('href') || '';
    return href.replace(/[^/]+$/, '');
  }

  function ensureBuiltinIcons() {
    document.querySelectorAll('velin-icon:not([provider])').forEach((el) => {
      const iconName = el.getAttribute('name');
      if (FILE_PROTOCOL && iconName && HEADER_ICON_FA[iconName]) {
        const spec = HEADER_ICON_FA[iconName];
        el.setAttribute('provider', 'fontawesome');
        el.setAttribute('name', spec.name);
        el.setAttribute('variant', spec.variant);
        el.removeAttribute('sprite');
        return;
      }
      const sprite = distBaseFromStylesheet() + 'velin-icons.svg';
      if (el.getAttribute('sprite') !== sprite) {
        el.setAttribute('sprite', sprite);
      }
    });
  }

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

  function scrollToLocationHash() {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id) || document.querySelector(hash);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    }
  }

  function init() {
    ensureBuiltinIcons();
    ensureSolidIcons();
    initCategoryToggles();
    initMobileSidebar();
    revealActiveLink(false);
    scrollToLocationHash();
  }

  if (customElements.get('velin-icon')) {
    init();
  } else {
    customElements.whenDefined('velin-icon').then(init);
  }

  window.addEventListener('load', () => revealActiveLink(false));
})();
