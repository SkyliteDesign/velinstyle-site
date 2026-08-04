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
    home: { name: 'house', variant: 'solid' },
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

  function isGermanDocs() {
    const lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    return lang.startsWith('de');
  }

  function siteRootHref() {
    const link = document.querySelector('link[href*="velinstyle.min.css"]');
    const href = (link && link.getAttribute('href')) || '../../dist/velinstyle.min.css';
    return href.replace(/dist\/[^/?#]+$/, '');
  }

  /** Ensure Home sits next to GitHub on every docs page. */
  function ensureHomeLink() {
    const actions = document.querySelector('.velin-doc-header__actions');
    if (!actions) return;

    let home = actions.querySelector('.velin-doc-header__home, a[aria-label="Home"], a[aria-label="Startseite"]');
    const label = isGermanDocs() ? 'Startseite' : 'Home';
    const href = siteRootHref() + 'index.html';

    if (!home) {
      home = document.createElement('a');
      home.className = 'velin-doc-header__home';
      home.href = href;
      home.setAttribute('aria-label', label);
      home.title = label;
      home.innerHTML =
        '<velin-icon name="home" size="18" aria-hidden="true"></velin-icon>' +
        '<span class="velin-doc-header__home-label">' +
        label +
        '</span>';
      const github =
        actions.querySelector('a[aria-label="GitHub"]') ||
        actions.querySelector('a[href*="github.com"]');
      if (github) actions.insertBefore(home, github);
      else actions.appendChild(home);
    } else {
      home.classList.add('velin-doc-header__home');
      home.removeAttribute('style');
      home.href = href;
      home.setAttribute('aria-label', label);
      home.title = label;
      if (!home.querySelector('velin-icon')) {
        home.innerHTML =
          '<velin-icon name="home" size="18" aria-hidden="true"></velin-icon>' +
          '<span class="velin-doc-header__home-label">' +
          label +
          '</span>';
      }
      const github =
        actions.querySelector('a[aria-label="GitHub"]') ||
        actions.querySelector('a[href*="github.com"]');
      if (github && home.nextElementSibling !== github) {
        actions.insertBefore(home, github);
      }
    }
  }

  /** Mount framework <velin-scroll-top> once per docs page. */
  function ensureScrollTop() {
    if (document.querySelector('velin-scroll-top')) return;
    const el = document.createElement('velin-scroll-top');
    el.setAttribute('threshold', '400');
    el.style.setProperty('--velin-z-fixed', '1040');
    el.style.setProperty('--velin-scroll-top-bottom', '1.25rem');
    el.style.setProperty('--velin-scroll-top-end', '1.25rem');
    document.body.appendChild(el);
  }

  const LANG_MISS_KEY = 'velin-doc-lang-miss';

  function docsRelFromLocation() {
    const path = location.pathname.replace(/\\/g, '/');
    const m = path.match(/\/docs\/(.+)$/i);
    if (!m) return '';
    return decodeURIComponent(m[1].replace(/\/$/, '/index.html'));
  }

  function docsPageHref(rel) {
    return siteRootHref() + 'docs/' + String(rel || '').replace(/^\//, '');
  }

  function langConfig() {
    const cfg = window.__VELIN_DOC_LANG__ || {};
    return {
      enHub: cfg.enHub || 'getting-started/introduction.html',
      deHub: cfg.deHub || 'getting-started/einfuehrung.html',
      enToDe: cfg.enToDe || {},
    };
  }

  function deToEnMap(enToDe) {
    const out = {};
    Object.keys(enToDe).forEach((en) => {
      out[enToDe[en]] = en;
    });
    return out;
  }

  /** Resolve a /docs/… pathname to the map key (e.g. forms/overview.html). */
  function docsRelFromHref(href) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return '';
    if (/^https?:\/\//i.test(href) && href.indexOf('/docs/') === -1) return '';
    try {
      const abs = new URL(href, document.querySelector('base')?.href || location.href);
      const path = abs.pathname.replace(/\\/g, '/');
      const m = path.match(/\/docs\/(.+)$/i);
      if (!m) return '';
      return decodeURIComponent(m[1].replace(/\/$/, '/index.html'));
    } catch (_) {
      return '';
    }
  }

  /**
   * German sidebar labels keyed by EN docs path (map keys).
   * Applied after href rewrite when lang=de.
   */
  const SIDEBAR_LABEL_DE = {
    'getting-started/introduction.html': 'Einführung',
    'getting-started/download.html': 'Download',
    'getting-started/contents.html': 'Inhalte',
    'getting-started/editor-setup.html': 'Editor-Einrichtung',
    'getting-started/browser-compatibility.html': 'Kompatibilität',
    'getting-started/upgrading.html': 'Aktualisieren',
    'getting-started/states-and-variants.html': 'Zustände &amp; Varianten',
    'getting-started/accessibility.html': 'Barrierefreiheit',
    'getting-started/rtl.html': 'RTL',
    'getting-started/a11y-patterns.html': 'A11y-Muster',
    'getting-started/a11y-dashboard.html': 'A11y-Dashboard',
    'customize/overview.html': 'Überblick',
    'customize/color.html': 'Farbe',
    'customize/color-modes.html': 'Farbmodi',
    'customize/css-variables.html': 'CSS-Variablen',
    'customize/components.html': 'Komponenten',
    'customize/optimize.html': 'Production-Build',
    'guides/production-build.html': 'Production Builder',
    'layout/breakpoints.html': 'Breakpoints',
    'layout/containers.html': 'Container',
    'layout/grid.html': 'Raster',
    'layout/patterns.html': 'Muster',
    'layout/columns.html': 'Spalten',
    'layout/gutters.html': 'Abstände',
    'layout/utilities.html': 'Utilities',
    'layout/z-index.html': 'Z-Index',
    'content/reboot.html': 'Reboot',
    'content/typography.html': 'Typografie',
    'content/images.html': 'Bilder',
    'content/tables.html': 'Tabellen',
    'content/figures.html': 'Abbildungen',
    'forms/overview.html': 'Überblick',
    'forms/form-control.html': 'Formularsteuerung',
    'forms/select.html': 'Auswahl',
    'forms/checks-radios.html': 'Checkboxen &amp; Radios',
    'forms/range.html': 'Schieberegler',
    'forms/input-group.html': 'Eingabegruppe',
    'forms/floating-labels.html': 'Schwebende Labels',
    'forms/layout.html': 'Layout',
    'forms/validation.html': 'Validierung',
    'components/accordion.html': 'Akkordion',
    'components/alerts.html': 'Hinweise',
    'components/avatar.html': 'Avatar',
    'components/badge.html': 'Abzeichen',
    'components/breadcrumb.html': 'Brotkrumen',
    'components/buttons.html': 'Buttons',
    'components/button-group.html': 'Button-Gruppe',
    'components/card.html': 'Karte',
    'components/carousel.html': 'Karussell',
    'components/chip.html': 'Chip',
    'components/velin-code-block.html': 'Code-Block',
    'components/close-button.html': 'Schließen-Button',
    'components/collapse.html': 'Einklappen',
    'components/announcer.html': 'Announcer',
    'components/bottom-nav.html': 'Bottom-Nav',
    'components/calendar.html': 'Kalender',
    'components/combobox.html': 'Combobox',
    'components/command.html': 'Befehlspalette',
    'components/velin-search.html': 'Velin Search',
    'components/menubar.html': 'Menüleiste',
    'components/rating.html': 'Bewertung',
    'components/segmented-control.html': 'Segmentsteuerung',
    'components/sheet.html': 'Sheet',
    'components/secure-field.html': 'Sicheres Feld',
    'components/dialog.html': 'Dialog',
    'components/divider.html': 'Trenner',
    'components/drawer.html': 'Schublade',
    'components/dropdown.html': 'Dropdown',
    'components/email.html': 'E-Mail',
    'components/file-dropzone.html': 'Datei-Dropzone',
    'components/lightbox.html': 'Lightbox',
    'components/list-group.html': 'Listengruppe',
    'components/modal.html': 'Modal',
    'components/navbar.html': 'Navigationsleiste',
    'components/navs-tabs.html': 'Navs &amp; Tabs',
    'components/pagination.html': 'Pagination',
    'components/popover.html': 'Popover',
    'components/progress.html': 'Fortschritt',
    'components/progress-ring.html': 'Fortschrittsring',
    'components/scrollspy.html': 'Scrollspy',
    'components/spinners.html': 'Ladeanzeigen',
    'components/stat.html': 'Statistik',
    'components/stepper.html': 'Schrittanzeige',
    'components/timeline.html': 'Zeitleiste',
    'components/toasts.html': 'Toasts',
    'components/tooltips.html': 'Tooltips',
    'components/sparkline.html': 'Sparkline',
    'components/counter.html': 'Zähler',
    'components/copy.html': 'Kopieren',
    'components/countdown.html': 'Countdown',
    'components/data-table.html': 'Datentabelle',
    'components/form-summary.html': 'Formular-Zusammenfassung',
    'components/persist.html': 'Persist',
    'components/scroll-top.html': 'Nach oben scrollen',
    'components/live-dot.html': 'Live-Punkt',
    'helpers/clearfix.html': 'Float aufheben',
    'helpers/colored-links.html': 'Farbige Links',
    'helpers/focus-ring.html': 'Fokusring',
    'helpers/icon-link.html': 'Icon-Link',
    'helpers/ratios.html': 'Seitenverhältnisse',
    'helpers/stacks.html': 'Stacks',
    'helpers/stretched-link.html': 'Gestreckter Link',
    'helpers/text-truncation.html': 'Textkürzung',
    'helpers/vertical-rule.html': 'Vertikale Linie',
    'helpers/visually-hidden.html': 'Visuell verborgen',
    'utilities/api.html': 'API',
    'utilities/background.html': 'Hintergrund',
    'utilities/borders.html': 'Rahmen',
    'utilities/colors.html': 'Farben',
    'utilities/color-mix.html': 'Farbmischung',
    'utilities/display.html': 'Display',
    'utilities/divide.html': 'Teiler',
    'utilities/flex.html': 'Flex',
    'utilities/float.html': 'Float',
    'utilities/filters.html': 'Filter',
    'utilities/interactions.html': 'Interaktionen',
    'utilities/object-fit.html': 'Object Fit',
    'utilities/opacity.html': 'Deckkraft',
    'utilities/overflow.html': 'Overflow',
    'utilities/position.html': 'Position',
    'utilities/print.html': 'Druck',
    'utilities/scroll.html': 'Scroll',
    'utilities/shadows.html': 'Schatten',
    'utilities/sizing.html': 'Größen',
    'utilities/spacing.html': 'Abstände',
    'utilities/text.html': 'Text',
    'utilities/transitions.html': 'Übergänge',
    'utilities/transforms.html': 'Transformationen',
    'utilities/motion.html': 'Motion-Tokens',
    'utilities/filter-effects.html': 'Filtereffekte',
    'utilities/chart-animation.html': 'Chart-Animation',
    'utilities/vertical-align.html': 'Vertikale Ausrichtung',
    'utilities/visibility.html': 'Sichtbarkeit',
    'utilities/safe-area.html': 'Safe Area',
    'utilities/z-index.html': 'Z-Index',
    'animations/overview.html': 'Überblick',
    'animations/entrance.html': 'Eintritt',
    'animations/attention.html': 'Aufmerksamkeit',
    'animations/exit.html': 'Austritt',
    'animations/scroll-driven.html': 'Scroll-gesteuert',
    'animations/view-transitions.html': 'View Transitions',
    'extend/approach.html': 'Ansatz',
    'extend/utility-coverage.html': 'Utility-Abdeckung',
    'extend/icons.html': 'Icons',
    'extend/cli.html': 'CLI',
    'generated/index.html': 'Generierte Referenz',
    'extend/security.html': 'Sicherheit',
    'extend/repo-tools.html': 'Repo-Tools',
    'extend/web-components.html': 'Web Components',
    'extend/javascript-api.html': 'JavaScript-API',
    'extend/core-modules.html': 'Kernmodule',
    'guides/index.html': 'Überblick',
    'guides/feature-scope.html': 'Feature-Umfang',
    'guides/existing-project.html': 'Bestehendes Projekt',
    'guides/react-vite-starter.html': 'Vite &amp; React',
    'guides/prompt-scaffolding.html': 'Prompt-Vorlagen',
    'guides/landing-15-min.html': 'Landing in 15 Min.',
    'guides/marketing-lite-css.html': 'Marketing Lite CSS',
    'guides/responsive-layout.html': 'Responsives Layout',
    'guides/performance-audit.html': 'Performance-Audit',
    'guides/whats-new-extension.html': 'Neu (Extension)',
    'guides/velin-search.html': 'VelinSearch',
    'guides/motion-attributes.html': 'Motion &amp; Attribute',
    'guides/syntax-highlight.html': 'Syntax-Highlighting',
    'guides/html-attributes.html': 'HTML-Attribute',
    'guides/design-tokens.html': 'Design Tokens',
    'guides/api-reference.html': 'API-Referenz',
    'guides/velin-meta.html': 'Velin-Meta',
    'guides/ai-skills.html': 'AI Skills',
    'guides/design-intelligence.html': 'Design Intelligence',
    'guides/cli-ship-surface.html': 'CLI Ship Surface',
    'guides/blueprints.html': 'Blueprints',
    'guides/faq.html': 'FAQ',
    'guides/troubleshooting.html': 'Fehlerbehebung',
    'guides/deploy.html': 'Deploy',
    'guides/laravel.html': 'Laravel',
    'guides/wordpress.html': 'WordPress',
    'guides/ecommerce.html': 'E-Commerce',
    'guides/forum-update.html': 'Forum-Update',
    'about/overview.html': 'Überblick',
    'about/brand.html': 'Marke',
    'about/license.html': 'Lizenz',
    'changelog.html': 'Änderungsprotokoll',
    'migration.html': 'Migrationsleitfaden',
  };

  const SIDEBAR_CAT_DE = {
    'getting-started': 'Erste Schritte',
    customize: 'Anpassen',
    layout: 'Layout',
    content: 'Inhalt',
    forms: 'Formulare',
    components: 'Komponenten',
    helpers: 'Helfer',
    utilities: 'Utilities',
    animations: 'Animationen',
    extend: 'Erweitern',
    guides: 'Guides',
    about: 'Über',
    support: 'Support &amp; Community',
  };

  const SIDEBAR_PINNED_DE = {
    'Switch quickly': 'Schnell wechseln',
    'Framework guides': 'Framework-Guides',
    'Feature scope': 'Feature-Umfang',
    Changelog: 'Änderungsprotokoll',
    'Migration Guide': 'Migrationsleitfaden',
    'Guides overview': 'Guides-Überblick',
    'Search & Motion': 'Search &amp; Motion',
    'Search &amp; Motion': 'Search &amp; Motion',
    VelinSearch: 'VelinSearch',
    'Motion & attributes': 'Motion &amp; Attribute',
    'Motion &amp; attributes': 'Motion &amp; Attribute',
    'Syntax highlighting': 'Syntax-Highlighting',
    'Existing project': 'Bestehendes Projekt',
    'Vite & React': 'Vite &amp; React',
    'Vite &amp; React': 'Vite &amp; React',
    'Prompt scaffolding': 'Prompt-Vorlagen',
    'Landing in 15 min': 'Landing in 15 Min.',
    'Marketing lite CSS': 'Marketing Lite CSS',
    'Responsive layout': 'Responsives Layout',
    'Performance audit': 'Performance-Audit',
    'Design tokens': 'Design Tokens',
    'API reference': 'API-Referenz',
    'Velin-Meta': 'Velin-Meta',
    'AI Skills': 'AI Skills',
    'Design Intelligence': 'Design Intelligence',
    'CLI ship surface': 'CLI Ship Surface',
    Blueprints: 'Blueprints',
    FAQ: 'FAQ',
    Troubleshooting: 'Fehlerbehebung',
    Deploy: 'Deploy',
    'E-commerce': 'E-Commerce',
    'Forum update': 'Forum-Update',
    'Generated Markdown': 'Generiertes Markdown',
    'CLI reference': 'CLI-Referenz',
    'Layout patterns': 'Layout-Muster',
    Introduction: 'Einführung',
  };

  /**
   * On DE pages, rewrite sidebar (and brand) links to DE mirrors via enToDe
   * and translate visible sidebar labels/categories.
   */
  function rewriteSidebarForCurrentLang() {
    const wantDe = isGermanDocs();
    const cfg = langConfig();
    const enToDe = cfg.enToDe;
    const deToEn = deToEnMap(enToDe);
    const currentRel = docsRelFromLocation();

    function mirrorRel(rel) {
      if (!rel) return rel;
      if (wantDe && enToDe[rel]) return enToDe[rel];
      if (!wantDe && deToEn[rel]) return deToEn[rel];
      return rel;
    }

    function enKeyForLabel(rel) {
      if (!rel) return '';
      if (enToDe[rel]) return rel;
      if (deToEn[rel]) return deToEn[rel];
      return rel;
    }

    function rewriteAnchor(a) {
      if (!a || a.hasAttribute('data-external')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (/^https?:\/\//i.test(href) && href.indexOf('velinstyle.info/docs/') === -1) return;

      const rel = docsRelFromHref(href);
      if (!rel) return;
      const targetRel = mirrorRel(rel);
      if (targetRel !== rel) {
        a.href = docsPageHref(targetRel);
      }

      if (wantDe) {
        const key = enKeyForLabel(rel);
        const labelEl = a.querySelector('.velin-doc-sidebar__label');
        if (labelEl) {
          const deLabel = SIDEBAR_LABEL_DE[key];
          const raw = labelEl.innerHTML.trim();
          const plain = labelEl.textContent.trim();
          if (deLabel) {
            labelEl.innerHTML = deLabel;
          } else if (/^Upgrading to /.test(plain)) {
            labelEl.textContent =
              'Aktualisieren auf ' + plain.replace(/^Upgrading to\s+/, '');
          } else if (SIDEBAR_PINNED_DE[raw]) {
            labelEl.innerHTML = SIDEBAR_PINNED_DE[raw];
          } else if (SIDEBAR_PINNED_DE[plain]) {
            labelEl.innerHTML = SIDEBAR_PINNED_DE[plain];
          }
        }
      }

      const matchesCurrent =
        currentRel &&
        (targetRel === currentRel ||
          rel === currentRel ||
          enToDe[rel] === currentRel ||
          deToEn[rel] === currentRel ||
          enToDe[currentRel] === rel ||
          deToEn[currentRel] === rel);
      if (matchesCurrent) {
        a.classList.add('active');
      }
    }

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.querySelectorAll('a[href]').forEach(rewriteAnchor);

      if (wantDe) {
        sidebar.setAttribute('aria-label', 'Dokumentationsnavigation');

        sidebar.querySelectorAll('.velin-doc-sidebar__pinned-label').forEach((p) => {
          const key = p.innerHTML.trim();
          if (SIDEBAR_PINNED_DE[key]) p.innerHTML = SIDEBAR_PINNED_DE[key];
          else if (SIDEBAR_PINNED_DE[p.textContent.trim()]) {
            p.textContent = SIDEBAR_PINNED_DE[p.textContent.trim()];
          }
        });

        sidebar.querySelectorAll('.velin-doc-sidebar__category[data-cat]').forEach((cat) => {
          const id = cat.getAttribute('data-cat');
          const deTitle = SIDEBAR_CAT_DE[id];
          if (!deTitle) return;
          const span = cat.querySelector(
            '.velin-doc-sidebar__category-header > span:not(.chevron)'
          );
          if (span) span.innerHTML = deTitle;
        });
      }
    }

    const brand = document.querySelector('.velin-doc-header__brand');
    if (brand) rewriteAnchor(brand);

    if (brand && wantDe) {
      const rel = docsRelFromHref(brand.getAttribute('href') || '');
      if (rel === 'getting-started/introduction.html' || rel === cfg.enHub) {
        brand.href = docsPageHref(cfg.deHub);
      }
    }

    if (wantDe) {
      const search = document.getElementById('docSearch');
      if (search) {
        search.setAttribute('placeholder', 'Docs durchsuchen…');
        search.setAttribute('aria-label', 'Dokumentation durchsuchen');
      }
    }
  }

  function findHreflangHref(wantLang) {
    const nodes = document.querySelectorAll('a[hreflang]');
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const hl = (a.getAttribute('hreflang') || '').toLowerCase();
      if (hl !== wantLang) continue;
      const href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) return href;
    }
    return null;
  }

  function resolveLangTarget(wantLang) {
    const current = isGermanDocs() ? 'de' : 'en';
    const cfg = langConfig();
    const rel = docsRelFromLocation();

    if (wantLang === current) {
      return {
        href: rel ? docsPageHref(rel) : location.pathname,
        exact: true,
        via: 'self',
      };
    }

    const enToDe = cfg.enToDe;
    const deToEn = deToEnMap(enToDe);

    if (wantLang === 'de') {
      if (rel && enToDe[rel]) {
        return { href: docsPageHref(enToDe[rel]), exact: true, via: 'map' };
      }
    } else if (rel && deToEn[rel]) {
      return { href: docsPageHref(deToEn[rel]), exact: true, via: 'map' };
    }

    /* Prefer absolute mapped targets; fall back to page hreflang (resolved). */
    const inline = findHreflangHref(wantLang);
    if (inline) {
      try {
        const abs = new URL(inline, document.querySelector('base')?.href || location.href);
        return { href: abs.pathname + abs.search + abs.hash, exact: true, via: 'hreflang' };
      } catch (_) {
        return { href: inline, exact: true, via: 'hreflang' };
      }
    }

    if (wantLang === 'de') {
      return { href: docsPageHref(cfg.deHub), exact: false, via: 'hub' };
    }
    return { href: docsPageHref(cfg.enHub), exact: false, via: 'hub' };
  }

  function showLangMissBanner(info) {
    if (document.querySelector('.velin-doc-lang-banner')) return;
    const main = document.querySelector('.velin-doc-main');
    if (!main) return;
    const de = isGermanDocs();
    const banner = document.createElement('div');
    banner.className = 'velin-doc-lang-banner';
    banner.setAttribute('role', 'status');

    const text = document.createElement('p');
    if (de) {
      text.innerHTML =
        'Für diese Seite fehlt eine Übersetzung' +
        (info && info.title ? ' („' + escapeText(info.title) + '“)' : '') +
        ' — du siehst den deutschen Einstieg.';
    } else {
      text.innerHTML =
        'Not all docs are translated yet. You are on the English entry point' +
        (info && info.title ? ' (from „' + escapeText(info.title) + '“)' : '') +
        '.';
    }

    const actions = document.createElement('div');
    actions.className = 'velin-doc-lang-banner__actions';

    if (info && info.from) {
      const back = document.createElement('a');
      back.className = 'velin-doc-lang-banner__link';
      back.href = info.from;
      back.textContent = de ? 'Zur englischen Seite' : 'Back to previous page';
      actions.appendChild(back);
    }

    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'velin-doc-lang-banner__dismiss';
    dismiss.setAttribute('aria-label', de ? 'Hinweis schließen' : 'Dismiss notice');
    dismiss.textContent = '×';
    dismiss.addEventListener('click', () => banner.remove());

    banner.append(text, actions, dismiss);
    main.insertBefore(banner, main.firstChild);
  }

  /** Small modal before switching EN → DE. */
  function showDeLangNoticeDialog(target) {
    const existing = document.querySelector('.velin-doc-lang-dialog');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'velin-doc-lang-dialog';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'velin-doc-lang-dialog-title');

    const panel = document.createElement('div');
    panel.className = 'velin-doc-lang-dialog__panel';

    const title = document.createElement('h2');
    title.id = 'velin-doc-lang-dialog-title';
    title.className = 'velin-doc-lang-dialog__title';
    title.textContent = 'Deutsche Docs';

    const body = document.createElement('p');
    body.className = 'velin-doc-lang-dialog__body';
    body.textContent = target.exact
      ? 'Du wechselst zur deutschen Fassung dieser Seite. Die Navigation führt dich, wo vorhanden, weiter zu den deutschen Docs.'
      : 'Für diese Seite fehlt noch eine deutsche Fassung — du gelangst zur deutschen Einführung.';

    const actions = document.createElement('div');
    actions.className = 'velin-doc-lang-dialog__actions';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'velin-doc-lang-dialog__btn';
    cancel.textContent = 'Abbrechen';

    const go = document.createElement('button');
    go.type = 'button';
    go.className = 'velin-doc-lang-dialog__btn velin-doc-lang-dialog__btn--primary';
    go.textContent = target.exact ? 'Weiter auf Deutsch' : 'Zur Einführung';

    function close() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    }

    function confirm() {
      if (!target.exact) {
        try {
          sessionStorage.setItem(
            LANG_MISS_KEY,
            JSON.stringify({
              from: location.pathname + location.search,
              title: document.title.replace(/\s*·\s*VelinStyle\s*$/i, '').trim(),
            })
          );
        } catch (_) {
          /* private mode */
        }
      }
      close();
      location.href = target.href;
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Enter' && document.activeElement !== cancel) {
        e.preventDefault();
        confirm();
      }
    }

    cancel.addEventListener('click', close);
    go.addEventListener('click', confirm);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);

    actions.append(cancel, go);
    panel.append(title, body, actions);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    go.focus();
  }

  function escapeText(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function maybeShowStoredLangMiss() {
    let raw;
    try {
      raw = sessionStorage.getItem(LANG_MISS_KEY);
    } catch (_) {
      return;
    }
    if (!raw) return;
    try {
      sessionStorage.removeItem(LANG_MISS_KEY);
    } catch (_) {
      /* ignore */
    }
    let info = null;
    try {
      info = JSON.parse(raw);
    } catch (_) {
      info = null;
    }
    showLangMissBanner(info);
  }

  /** EN/DE switcher in the header; falls back to language hubs when no mirror exists. */
  function initLangSwitcher() {
    maybeShowStoredLangMiss();
    if (document.querySelector('.velin-doc-lang')) return;

    const actions = document.querySelector('.velin-doc-header__actions');
    if (!actions) return;

    const current = isGermanDocs() ? 'de' : 'en';
    const enTarget = resolveLangTarget('en');
    const deTarget = resolveLangTarget('de');

    const group = document.createElement('div');
    group.className = 'velin-doc-lang';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', current === 'de' ? 'Sprache' : 'Language');

    function makeBtn(code, target) {
      const a = document.createElement('a');
      a.className =
        'velin-doc-lang__btn' + (code === current ? ' is-active' : '');
      a.href = target.href;
      a.hreflang = code;
      a.lang = code;
      a.textContent = code.toUpperCase();
      if (code === current) {
        a.setAttribute('aria-current', 'true');
        a.setAttribute('aria-disabled', 'true');
        a.addEventListener('click', (e) => e.preventDefault());
      } else if (code === 'de') {
        a.title = 'Deutsch';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          showDeLangNoticeDialog(target);
        });
      } else {
        a.title = 'English';
        if (!target.exact) {
          a.title = 'English version missing — English introduction';
          a.addEventListener('click', () => {
            try {
              sessionStorage.setItem(
                LANG_MISS_KEY,
                JSON.stringify({
                  from: location.pathname + location.search,
                  title: document.title.replace(/\s*·\s*VelinStyle\s*$/i, '').trim(),
                })
              );
            } catch (_) {
              /* private mode */
            }
          });
        }
      }
      return a;
    }

    group.append(makeBtn('en', enTarget), makeBtn('de', deTarget));

    const home = actions.querySelector('.velin-doc-header__home');
    if (home) actions.insertBefore(group, home);
    else {
      const github =
        actions.querySelector('a[aria-label="GitHub"]') ||
        actions.querySelector('a[href*="github.com"]');
      if (github) actions.insertBefore(group, github);
      else actions.appendChild(group);
    }
  }

  const READER_SCALE_KEY = 'velin-doc-text-scale';
  const READER_FONT_KEY = 'velin-doc-font';
  const READER_SCALES = [0.875, 1, 1.125, 1.25, 1.375];
  const READER_FONTS = ['sans', 'serif', 'mono'];

  function applyReaderPrefs(scale, font) {
    const root = document.documentElement;
    root.style.setProperty('--doc-reader-scale', String(scale));
    root.setAttribute('data-doc-font', font);
  }

  function readStoredScale() {
    const raw = localStorage.getItem(READER_SCALE_KEY);
    const n = raw == null ? 1 : Number(raw);
    return READER_SCALES.includes(n) ? n : 1;
  }

  function readStoredFont() {
    const f = localStorage.getItem(READER_FONT_KEY) || 'sans';
    return READER_FONTS.includes(f) ? f : 'sans';
  }

  /** Font size + family controls beside the search field. */
  function initReaderControls() {
    if (document.querySelector('.velin-doc-reader')) return;
    const search = document.querySelector('.velin-doc-header__search');
    if (!search) return;

    let tools = search.closest('.velin-doc-header__tools');
    if (!tools) {
      tools = document.createElement('div');
      tools.className = 'velin-doc-header__tools';
      search.parentNode.insertBefore(tools, search);
      tools.appendChild(search);
    }

    const de = isGermanDocs();
    const scale = readStoredScale();
    const font = readStoredFont();
    applyReaderPrefs(scale, font);

    const reader = document.createElement('div');
    reader.className = 'velin-doc-reader';
    reader.setAttribute('role', 'group');
    reader.setAttribute(
      'aria-label',
      de ? 'Leseeinstellungen' : 'Reading preferences'
    );

    const dec = document.createElement('button');
    dec.type = 'button';
    dec.className = 'velin-doc-reader__btn';
    dec.setAttribute('aria-label', de ? 'Schrift verkleinern' : 'Decrease text size');
    dec.title = dec.getAttribute('aria-label');
    dec.textContent = 'A−';

    const inc = document.createElement('button');
    inc.type = 'button';
    inc.className = 'velin-doc-reader__btn';
    inc.setAttribute('aria-label', de ? 'Schrift vergrößern' : 'Increase text size');
    inc.title = inc.getAttribute('aria-label');
    inc.textContent = 'A+';

    const select = document.createElement('select');
    select.className = 'velin-doc-reader__font';
    select.setAttribute('aria-label', de ? 'Schriftart' : 'Font family');
    select.title = select.getAttribute('aria-label');
    const fontLabels = de
      ? { sans: 'Sans', serif: 'Serif', mono: 'Mono' }
      : { sans: 'Sans', serif: 'Serif', mono: 'Mono' };
    READER_FONTS.forEach((key) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = fontLabels[key];
      if (key === font) opt.selected = true;
      select.appendChild(opt);
    });

    function setScale(next) {
      const clamped = READER_SCALES.includes(next)
        ? next
        : READER_SCALES.reduce((best, s) =>
            Math.abs(s - next) < Math.abs(best - next) ? s : best
          );
      localStorage.setItem(READER_SCALE_KEY, String(clamped));
      applyReaderPrefs(clamped, readStoredFont());
      dec.disabled = clamped <= READER_SCALES[0];
      inc.disabled = clamped >= READER_SCALES[READER_SCALES.length - 1];
    }

    dec.addEventListener('click', () => {
      const i = READER_SCALES.indexOf(readStoredScale());
      if (i > 0) setScale(READER_SCALES[i - 1]);
    });
    inc.addEventListener('click', () => {
      const i = READER_SCALES.indexOf(readStoredScale());
      if (i < READER_SCALES.length - 1) setScale(READER_SCALES[i + 1]);
    });
    select.addEventListener('change', () => {
      const next = select.value;
      if (!READER_FONTS.includes(next)) return;
      localStorage.setItem(READER_FONT_KEY, next);
      applyReaderPrefs(readStoredScale(), next);
    });

    setScale(scale);
    reader.append(dec, inc, select);
    tools.appendChild(reader);
  }

  function init() {
    ensureHomeLink();
    ensureBuiltinIcons();
    ensureSolidIcons();
    rewriteSidebarForCurrentLang();
    initLangSwitcher();
    initReaderControls();
    ensureScrollTop();
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
