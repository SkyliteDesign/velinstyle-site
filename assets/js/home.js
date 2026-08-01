/**
 * VelinStyle Homepage — Component Expo runtime (1.2.0) + quality polish
 */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (s, r) => (r || document).querySelector(s);
  const qsa = (s, r) => [...(r || document).querySelectorAll(s)];

  function initMegaNav() {
    const groups = qsa('.expo-nav__group');
    if (!groups.length) return;
    const buttons = groups.map((g) => g.querySelector(':scope > button')).filter(Boolean);

    const panelOf = (btn) => qs(`#${btn.getAttribute('aria-controls')}`);
    const itemsOf = (panel) => qsa('[role="menuitem"]', panel).filter((el) => el !== buttons.find((b) => panelOf(b) === panel));

    const setOpen = (btn, open) => {
      btn.setAttribute('aria-expanded', String(open));
      const panel = panelOf(btn);
      if (!panel) return;
      panel.hidden = !open;
      if (open) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    };

    const closeAll = (except) => {
      buttons.forEach((btn) => {
        if (btn === except) return;
        setOpen(btn, false);
      });
    };

    const openAndFocusFirst = (btn) => {
      closeAll(btn);
      setOpen(btn, true);
      const items = itemsOf(panelOf(btn));
      (items[0] || btn).focus();
    };

    buttons.forEach((btn, index) => {
      setOpen(btn, false);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = btn.getAttribute('aria-expanded') === 'true';
        closeAll(btn);
        setOpen(btn, !open);
        if (!open) {
          const items = itemsOf(panelOf(btn));
          items[0]?.focus();
        }
      });

      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          openAndFocusFirst(btn);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          closeAll();
          buttons[(index + 1) % buttons.length]?.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          closeAll();
          buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          closeAll();
          buttons[0]?.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          closeAll();
          buttons[buttons.length - 1]?.focus();
        } else if (e.key === 'Escape') {
          closeAll();
          btn.focus();
        }
      });

      const panel = panelOf(btn);
      if (!panel) return;
      panel.addEventListener('keydown', (e) => {
        const items = itemsOf(panel);
        const i = items.indexOf(document.activeElement);
        if (e.key === 'Escape') {
          e.preventDefault();
          closeAll();
          btn.focus();
        } else if (e.key === 'ArrowDown' && i >= 0) {
          e.preventDefault();
          items[(i + 1) % items.length]?.focus();
        } else if (e.key === 'ArrowUp' && i >= 0) {
          e.preventDefault();
          items[(i - 1 + items.length) % items.length]?.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0]?.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1]?.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          closeAll();
          const next = e.key === 'ArrowRight'
            ? buttons[(index + 1) % buttons.length]
            : buttons[(index - 1 + buttons.length) % buttons.length];
          next?.focus();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.expo-nav__group')) closeAll();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll();
    });
    qsa('.expo-nav__panel a').forEach((a) => {
      a.addEventListener('click', () => closeAll());
    });
  }

  function initNavSpy() {
    const links = qsa('.expo-nav__menu a[href^="#"], .expo-nav__links a[href^="#"]');
    const sections = [...new Set(links.map((a) => qs(a.getAttribute('href'))).filter(Boolean))];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = '#' + e.target.id;
          links.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === id ? 'true' : 'false'));
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.01 },
    );
    sections.forEach((s) => io.observe(s));
  }

  function initMobileToc() {
    const btn = qs('#expoMobileMenuBtn');
    const drawer = qs('#expoSiteNav');
    if (!btn || !drawer) return;
    const sync = () => {
      const open = drawer.hasAttribute('open') || drawer.open === true;
      btn.setAttribute('aria-expanded', String(!!open));
    };
    btn.addEventListener('click', () => {
      // data-expo-open also fires; sync after paint
      requestAnimationFrame(sync);
    });
    drawer.addEventListener('velin-close', sync);
    drawer.addEventListener('close', sync);
    qsa('[data-expo-close="expoSiteNav"]').forEach((el) => {
      el.addEventListener('click', () => setTimeout(sync, 0));
    });
  }

  function initThemePack() {
    const base = document.documentElement.getAttribute('data-velin-themes-base') || 'dist/themes';
    qsa('[data-expo-theme]').forEach((el) => {
      el.addEventListener('change', () => {
        const theme = el.value;
        const pack = document.querySelector('link[data-velin-theme-css]');
        if (theme === 'light' || theme === 'dark' || theme === '') {
          document.documentElement.setAttribute('data-velin-theme', theme === 'dark' ? 'dark' : '');
          pack?.remove();
          try {
            localStorage.setItem('velin-theme', theme === 'dark' ? 'dark' : 'light');
          } catch (_) { /* ignore */ }
        } else {
          document.documentElement.removeAttribute('data-velin-theme');
          let link = pack;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.setAttribute('data-velin-theme-css', '1');
            document.head.appendChild(link);
          }
          link.href = `${base.replace(/\/$/, '')}/${theme}.min.css`;
          try {
            localStorage.setItem('velin-theme', theme);
          } catch (_) { /* ignore */ }
        }
        flash('#tokenSurface, #playgroundSurface, #testStage');
      });
    });
  }

  function flash(sel) {
    qsa(sel).forEach((el) => {
      el.classList.add('expo-page-transition', 'is-on');
      setTimeout(() => el.classList.remove('is-on'), 520);
    });
  }

  function updateTokenReadout(surface) {
    const out = qs('#tokenReadout');
    if (!out || !surface) return;
    const rad = surface.style.getPropertyValue('--velin-radius-md') || getComputedStyle(surface).getPropertyValue('--velin-radius-md') || '—';
    const gap = surface.style.getPropertyValue('--velin-space-3') || getComputedStyle(surface).getPropertyValue('--velin-space-3') || '—';
    const dens = surface.style.getPropertyValue('--expo-density') || '1';
    const type = surface.style.getPropertyValue('--velin-text-base') || '—';
    const elev = surface.dataset.elev || 'none';
    const accent = surface.style.getPropertyValue('--velin-color-primary') || 'primary';
    out.innerHTML = [
      `<code>--velin-radius-md:${rad.trim()}</code>`,
      `<code>--velin-space-3:${gap.trim()}</code>`,
      `<code>density:${dens}</code>`,
      `<code>shadow:${elev}</code>`,
      `<code>--velin-text-base:${type.trim()}</code>`,
      `<code>accent:${accent.trim().slice(0, 28)}</code>`,
    ].join('');
    const cellR = qs('#tokCellRadius');
    const cellS = qs('#tokCellSpace');
    const cellA = qs('#tokCellAccent');
    if (cellR) cellR.textContent = rad.trim() || 'default';
    if (cellS) cellS.textContent = gap.trim() || 'default';
    if (cellA) cellA.textContent = accent.trim().slice(0, 24) || 'default';
  }

  function initTokenLab() {
    const surface = qs('#tokenSurface');
    if (!surface) return;
    const set = (n, v) => surface.style.setProperty(n, v);
    const clearVelin = () => {
      [
        '--velin-radius-sm', '--velin-radius-md', '--velin-radius-lg', '--velin-radius-xl',
        '--velin-space-2', '--velin-space-3', '--velin-space-4',
        '--velin-shadow-sm', '--velin-shadow-md', '--velin-shadow-lg',
        '--velin-color-primary', '--velin-text-base', '--velin-text-sm', '--velin-text-lg',
        '--expo-density', '--expo-border-w', '--expo-accent',
      ].forEach((n) => surface.style.removeProperty(n));
      surface.style.removeProperty('background');
      surface.style.removeProperty('border-width');
      surface.style.removeProperty('font-size');
      surface.dataset.elev = 'mid';
      surface.dataset.motion = 'on';
    };

    const applyRadius = (rem) => {
      set('--velin-radius-sm', `${Math.max(0.1, rem * 0.65)}rem`);
      set('--velin-radius-md', `${rem}rem`);
      set('--velin-radius-lg', `${rem * 1.35}rem`);
      set('--velin-radius-xl', `${rem * 1.75}rem`);
      set('--expo-radius', `${rem}rem`);
    };
    const applySpacing = (rem) => {
      set('--velin-space-2', `${rem * 0.66}rem`);
      set('--velin-space-3', `${rem}rem`);
      set('--velin-space-4', `${rem * 1.35}rem`);
      set('--expo-gap', `${rem}rem`);
    };
    const applyElev = (level) => {
      surface.dataset.elev = level;
      if (level === 'none') {
        set('--velin-shadow-sm', 'none');
        set('--velin-shadow-md', 'none');
        set('--velin-shadow-lg', 'none');
      } else if (level === 'high') {
        set('--velin-shadow-sm', 'var(--velin-shadow-md, 0 4px 12px rgb(0 0 0 / 0.12))');
        set('--velin-shadow-md', '0 10px 28px rgb(0 0 0 / 0.18)');
        set('--velin-shadow-lg', '0 18px 40px rgb(0 0 0 / 0.22)');
      } else {
        surface.style.removeProperty('--velin-shadow-sm');
        surface.style.removeProperty('--velin-shadow-md');
        surface.style.removeProperty('--velin-shadow-lg');
      }
    };
    const applyType = (scale) => {
      set('--velin-text-sm', `calc(0.875rem * ${scale})`);
      set('--velin-text-base', `calc(1rem * ${scale})`);
      set('--velin-text-lg', `calc(1.125rem * ${scale})`);
      surface.style.fontSize = `calc(1rem * ${scale})`;
      set('--expo-type-scale', scale);
    };
    const applyDensity = (d) => {
      set('--expo-density', d);
      surface.style.padding = `calc(var(--velin-space-4) * ${d})`;
    };
    const syncFromControls = () => {
      const rad = qs('#tokenRadius')?.value;
      const gap = qs('#tokenGap')?.value;
      const dens = qs('#tokenDensity')?.value;
      const elev = qs('#tokenElev')?.value;
      const border = qs('#tokenBorder')?.value;
      const accent = qs('#tokenAccent')?.value;
      const type = qs('#tokenType')?.value;
      if (rad) applyRadius(Number(rad));
      if (gap) applySpacing(Number(gap));
      if (dens) applyDensity(dens);
      if (elev) applyElev(elev);
      if (border != null) {
        set('--expo-border-w', `${border}px`);
        surface.style.borderWidth = `${border}px`;
      }
      if (accent) {
        set('--velin-color-primary', accent);
        set('--expo-accent', accent);
      }
      if (type) applyType(type);
      updateTokenReadout(surface);
    };

    const presets = {
      compact: { radius: 0.35, density: 0.85, gap: 0.5, elev: 'none', type: 0.9, border: 1 },
      comfortable: { radius: 0.75, density: 1, gap: 0.75, elev: 'mid', type: 1, border: 1 },
      soft: { radius: 1.25, density: 1.1, gap: 1.1, elev: 'high', type: 1.05, border: 1 },
      sharp: { radius: 0.15, density: 0.95, gap: 0.6, elev: 'none', type: 1, border: 2 },
      reset: null,
    };

    qsa('[data-token-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-token-preset');
        if (key === 'reset' || !presets[key]) {
          clearVelin();
          if (qs('#tokenRadius')) qs('#tokenRadius').value = '0.75';
          if (qs('#tokenDensity')) qs('#tokenDensity').value = '1';
          if (qs('#tokenGap')) qs('#tokenGap').value = '0.75';
          if (qs('#tokenElev')) qs('#tokenElev').value = 'mid';
          if (qs('#tokenBorder')) qs('#tokenBorder').value = '1';
          if (qs('#tokenType')) qs('#tokenType').value = '1';
          if (qs('#tokenAccent')) qs('#tokenAccent').selectedIndex = 0;
          if (qs('#tokenSurfaceTone')) qs('#tokenSurfaceTone').value = 'default';
          updateTokenReadout(surface);
          return;
        }
        const p = presets[key];
        if (qs('#tokenRadius')) qs('#tokenRadius').value = String(p.radius);
        if (qs('#tokenDensity')) qs('#tokenDensity').value = String(p.density);
        if (qs('#tokenGap')) qs('#tokenGap').value = String(p.gap);
        if (qs('#tokenElev')) qs('#tokenElev').value = p.elev;
        if (qs('#tokenBorder')) qs('#tokenBorder').value = String(p.border);
        if (qs('#tokenType')) qs('#tokenType').value = String(p.type);
        syncFromControls();
      });
    });

    ['tokenDensity', 'tokenRadius', 'tokenGap', 'tokenBorder', 'tokenType'].forEach((id) => {
      qs(`#${id}`)?.addEventListener('input', syncFromControls);
    });
    qs('#tokenElev')?.addEventListener('change', syncFromControls);
    qs('#tokenAccent')?.addEventListener('change', syncFromControls);
    qs('#tokenMotion')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      const next = !pressed;
      btn.setAttribute('aria-pressed', String(next));
      // aria-pressed=true means motion is currently OFF (toggle label)
      surface.dataset.motion = next ? 'off' : 'on';
      const de = document.documentElement.lang === 'de' || /index\.de\.html$/i.test(location.pathname);
      btn.textContent = next
        ? (de ? 'Motion an' : 'Motion on')
        : (de ? 'Motion aus' : 'Motion off');
    });
    qs('#tokenSurfaceTone')?.addEventListener('change', (e) => {
      const v = e.target.value;
      if (v === 'dim') surface.style.background = 'var(--velin-color-surface-dim)';
      else if (v === 'bright') surface.style.background = 'var(--velin-color-surface-bright, var(--velin-color-surface))';
      else surface.style.background = 'var(--velin-color-surface)';
    });

    const tabs = qsa('[data-token-tab]');
    const panels = qsa('[data-token-panel]');
    const activateTab = (name) => {
      tabs.forEach((tab) => {
        const on = tab.getAttribute('data-token-tab') === name;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach((panel) => {
        const on = panel.getAttribute('data-token-panel') === name;
        panel.classList.toggle('is-active', on);
        panel.hidden = !on;
      });
    };
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab.getAttribute('data-token-tab') || 'colors'));
      tab.addEventListener('keydown', (e) => {
        const order = tabs.map((t) => t.getAttribute('data-token-tab'));
        const i = order.indexOf(tab.getAttribute('data-token-tab'));
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const next = e.key === 'ArrowRight'
            ? order[(i + 1) % order.length]
            : order[(i - 1 + order.length) % order.length];
          activateTab(next);
          qs(`[data-token-tab="${next}"]`)?.focus();
        }
      });
    });
    if (tabs.length) activateTab(tabs[0].getAttribute('data-token-tab') || 'colors');

    syncFromControls();
  }

  function initPlayground() {
    const surface = qs('#playgroundSurface');
    if (!surface) return;
    qs('#pgDensity')?.addEventListener('input', (e) => {
      surface.style.setProperty('--expo-density', e.target.value);
      surface.style.padding = `calc(1rem * ${e.target.value})`;
    });
    qs('#pgRadius')?.addEventListener('input', (e) => {
      surface.style.setProperty('--expo-radius', `${e.target.value}rem`);
      qsa('.velin-card, .velin-btn, .velin-input', surface).forEach((el) => {
        el.style.borderRadius = `${e.target.value}rem`;
      });
    });
    qs('#pgSpacing')?.addEventListener('input', (e) => {
      surface.style.gap = `${e.target.value}rem`;
    });
  }

  function initUtilityLab() {
    const target = qs('#utilTarget');
    if (!target) return;
    const apply = () => {
      const pad = qs('#utilPad')?.value || '4';
      const gap = qs('#utilGap')?.value || '3';
      const radius = qs('#utilRadius')?.value || 'md';
      const shadow = qs('#utilShadow')?.value || 'none';
      const display = qs('#utilDisplay')?.value || 'grid';
      const align = qs('#utilAlign')?.value || 'start';
      const justify = qs('#utilJustify')?.value || 'start';
      const overflow = qs('#utilOverflow')?.value || 'visible';
      const aspect = qs('#utilAspect')?.value || '';
      const dark = qs('#utilDark')?.checked;
      const hover = qs('#utilHover')?.checked;

      target.className = 'expo-util-target';
      target.classList.add(`velin-p-${pad}`, `velin-gap-${gap}`);
      if (radius === 'md') target.classList.add('velin-rounded');
      else if (radius !== 'none') target.classList.add(`velin-rounded-${radius}`);
      if (shadow === 'md') target.classList.add('velin-shadow');
      else if (shadow !== 'none') target.classList.add(`velin-shadow-${shadow}`);
      if (display === 'flex') {
        target.classList.add('velin-flex', 'velin-flex--wrap');
        target.classList.add(`velin-flex--items-${align}`);
        target.classList.add(`velin-flex--justify-${justify}`);
      } else if (display === 'grid') {
        target.classList.add('velin-grid', 'velin-grid--cols-2', 'velin-grid--gap-4');
      } else {
        target.style.display = display;
      }
      target.style.overflow = overflow;
      target.style.aspectRatio = aspect || '';
      target.toggleAttribute('data-cq', qs('#utilCq')?.checked);
      if (dark) target.setAttribute('data-velin-theme', 'dark');
      else target.removeAttribute('data-velin-theme');
      if (hover) target.setAttribute('velin-hover', '');
      else target.removeAttribute('velin-hover');
      const out = qs('#utilClassOut');
      if (out) out.textContent = target.className.replace('expo-util-target', '').trim() || '(base)';
    };
    qsa('#utilPad, #utilGap, #utilRadius, #utilShadow, #utilDisplay, #utilAlign, #utilJustify, #utilOverflow, #utilAspect, #utilDark, #utilHover, #utilCq')
      .forEach((el) => el.addEventListener('input', apply));
    apply();
  }

  function initOverlays() {
    const tryOpen = (el) => {
      if (!el) return;
      if (typeof el.show === 'function') el.show();
      else if (typeof el.open === 'function') el.open();
      else el.setAttribute('open', '');
    };
    const tryClose = (el) => {
      if (!el) return;
      if (typeof el.hide === 'function') el.hide();
      else if (typeof el.close === 'function') el.close();
      else el.removeAttribute('open');
    };

    qsa('[data-expo-open]').forEach((btn) => {
      btn.addEventListener('click', () => tryOpen(qs(`#${btn.getAttribute('data-expo-open')}`)));
    });
    qsa('[data-expo-close]').forEach((btn) => {
      btn.addEventListener('click', () => tryClose(qs(`#${btn.getAttribute('data-expo-close')}`)));
    });
  }

  function initToasts() {
    const toast = qs('#expoToast');
    qsa('[data-toast]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-toast') || 'info';
        const msg = btn.getAttribute('data-toast-msg') || `${type} notification`;
        if (toast && typeof toast.show === 'function') {
          toast.show({ type, message: msg });
        } else if (toast) {
          toast.textContent = msg;
          toast.hidden = false;
          setTimeout(() => { toast.hidden = true; }, 2200);
        }
      });
    });
  }

  function initAnimTiles() {
    qsa('[data-anim-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-anim-trigger');
        const el = qs(`#${id}`);
        if (!el) return;
        el.classList.remove('is-on');
        void el.offsetWidth;
        el.classList.add('is-on');
        if (!reduceMotion) setTimeout(() => el.classList.remove('is-on'), 800);
      });
    });
    qs('#toggleAutoHeight')?.addEventListener('click', () => {
      qs('#autoHeightBox')?.classList.toggle('is-open');
    });
    qs('#runPageTransition')?.addEventListener('click', () => {
      const box = qs('#pageTransitionBox');
      if (!box) return;
      box.classList.remove('is-on');
      void box.offsetWidth;
      box.classList.add('expo-page-transition', 'is-on');
    });
    qs('#runThemeTransition')?.addEventListener('click', () => {
      const root = document.documentElement;
      const dark = root.getAttribute('data-velin-theme') === 'dark';
      if (document.startViewTransition && !reduceMotion) {
        document.startViewTransition(() => {
          root.setAttribute('data-velin-theme', dark ? '' : 'dark');
        });
      } else {
        root.setAttribute('data-velin-theme', dark ? '' : 'dark');
      }
    });
    qs('#updateSpark')?.addEventListener('click', () => {
      const spark = qs('#liveSpark');
      if (!spark) return;
      const vals = Array.from({ length: 12 }, () => Math.round(Math.random() * 20) + 1);
      if (typeof spark.update === 'function') spark.update(vals);
      else spark.setAttribute('values', vals.join(','));
    });
    qs('#rerunReveal')?.addEventListener('click', () => {
      const el = qs('#revealTarget');
      if (!el) return;
      el.removeAttribute('velin-reveal');
      void el.offsetWidth;
      el.setAttribute('velin-reveal', 'fade');
      el.classList.remove('velin-in-view');
      requestAnimationFrame(() => el.classList.add('velin-in-view'));
    });
  }

  function initForms() {
    qsa('form[data-expo-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = form.querySelector('[data-form-status]');
        if (form.checkValidity()) {
          if (status) {
            status.hidden = false;
            status.textContent = 'Success — form is valid.';
            status.className = 'velin-badge velin-badge--success';
          }
          const loadingBtn = form.querySelector('[data-loading-submit]');
          if (loadingBtn) {
            loadingBtn.classList.add('velin-btn--loading');
            loadingBtn.setAttribute('aria-busy', 'true');
            setTimeout(() => {
              loadingBtn.classList.remove('velin-btn--loading');
              loadingBtn.removeAttribute('aria-busy');
            }, 1200);
          }
        } else {
          form.reportValidity();
          if (status) {
            status.hidden = false;
            status.textContent = 'Fix the errors listed above.';
            status.className = 'velin-badge velin-badge--danger';
          }
        }
      });
    });
  }

  function initNavDemos() {
    qsa('[data-nav-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-nav-toggle');
        const list = qs(`#${id}`);
        if (!list) return;
        const open = list.hasAttribute('data-velin-open');
        if (open) list.removeAttribute('data-velin-open');
        else list.setAttribute('data-velin-open', '');
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  function loadAxe() {
    if (window.axe) return Promise.resolve(window.axe);
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-expo-axe]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.axe));
        existing.addEventListener('error', () => reject(new Error('axe-core failed to load')));
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/axe-core@4.10.3/axe.min.js';
      s.async = true;
      s.dataset.expoAxe = '1';
      s.onload = () => resolve(window.axe);
      s.onerror = () => reject(new Error('axe-core CDN unavailable'));
      document.head.appendChild(s);
    });
  }

  function initTesting() {
    const stage = qs('#testStage');
    const announcer = qs('#expoAnnouncer');
    const flashStage = () => {
      if (!stage) return;
      stage.setAttribute('data-flash', '1');
      setTimeout(() => stage.removeAttribute('data-flash'), 450);
    };
    const mark = (id, pass, detail) => {
      const card = qs(`#${id}`);
      if (!card) return;
      card.dataset.pass = String(pass);
      const out = card.querySelector('[data-test-out]');
      if (out) out.textContent = detail;
      flashStage();
      if (announcer && typeof announcer.announce === 'function') {
        announcer.announce(detail);
      } else if (announcer) {
        announcer.textContent = detail;
      }
    };

    qs('#runKeyboardTest')?.addEventListener('click', () => {
      mark('testKeyboard', true, 'Tab: skip → mega nav → stage controls → overlays.');
      qs('#testFocusBtn')?.focus();
    });
    qs('#runFocusTest')?.addEventListener('click', () => {
      const btn = qs('#testFocusBtn');
      btn?.focus();
      mark('testFocus', document.activeElement === btn, 'Focus ring on primary control.');
    });
    qs('#runAriaTest')?.addEventListener('click', () => {
      const live = qs('#testAriaLive');
      if (live) live.textContent = 'ARIA live region updated.';
      mark('testAria', true, 'role=status / polite live region fired.');
    });
    qs('#runDarkTest')?.addEventListener('click', () => {
      document.documentElement.setAttribute('data-velin-theme', 'dark');
      document.querySelector('link[data-velin-theme-css]')?.remove();
      mark('testThemeDark', true, 'Dark mode on documentElement.');
    });
    qs('#runLightTest')?.addEventListener('click', () => {
      document.documentElement.setAttribute('data-velin-theme', '');
      document.querySelector('link[data-velin-theme-css]')?.remove();
      mark('testThemeLight', true, 'Light mode restored.');
    });
    qs('#runThemeTest')?.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-velin-theme') === 'dark';
      document.documentElement.setAttribute('data-velin-theme', dark ? '' : 'dark');
      mark('testTheme', true, dark ? 'Switched to light.' : 'Switched to dark.');
    });
    qs('#runResponsiveTest')?.addEventListener('click', () => {
      const box = qs('#responsiveTestBox');
      if (!box) return;
      box.classList.toggle('expo-device--mobile');
      mark('testResponsive', true, box.classList.contains('expo-device--mobile') ? 'Mobile frame on.' : 'Desktop frame on.');
    });
    qs('#runMotionTest')?.addEventListener('click', () => {
      if (!stage) return;
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const on = stage.getAttribute('data-motion') === 'reduce';
      stage.setAttribute('data-motion', on ? 'ok' : 'reduce');
      qs('#motionTestDot')?.classList.toggle('expo-pulse', !on && !mq.matches);
      mark(
        'testMotion',
        true,
        `${on ? 'Stage motion restored.' : 'Stage reduced-motion simulated.'} System prefers-reduced-motion: ${mq.matches}`,
      );
    });
    qs('#runRtlTest')?.addEventListener('click', () => {
      const box = qs('#rtlTestBox') || stage;
      if (!box) return;
      const rtl = box.getAttribute('dir') === 'rtl';
      box.setAttribute('dir', rtl ? 'ltr' : 'rtl');
      if (stage) stage.setAttribute('dir', rtl ? 'ltr' : 'rtl');
      mark('testRtl', true, rtl ? 'LTR restored.' : 'RTL direction active.');
    });
    qs('#runContrastTest')?.addEventListener('click', () => {
      if (!stage) return;
      const on = stage.getAttribute('data-contrast') === 'high';
      stage.setAttribute('data-contrast', on ? 'normal' : 'high');
      mark('testContrast', true, on ? 'Normal contrast.' : 'High contrast stage.');
    });
    qs('#runA11yTest')?.addEventListener('click', () => {
      const skip = qs('.expo-skip, .velin-skip-link');
      const landmarks = qsa('main, nav[aria-label], header, footer').length;
      const lang = document.documentElement.lang;
      mark('testA11y', Boolean(skip) && landmarks >= 3 && Boolean(lang), `Skip ${skip ? 'ok' : 'missing'}; landmarks ${landmarks}; lang=${lang || 'missing'}.`);
    });

    qs('#runAxeTest')?.addEventListener('click', async () => {
      const list = qs('#axeViolations');
      const btn = qs('#runAxeTest');
      if (list) list.innerHTML = '';
      if (btn) btn.disabled = true;
      mark('testAxe', false, 'Loading axe-core…');
      try {
        const axe = await loadAxe();
        if (!axe?.run) throw new Error('axe.run unavailable');
        const target = stage || document;
        const results = await axe.run(target, {
          resultTypes: ['violations'],
          reporter: 'v2',
        });
        const violations = results.violations || [];
        const pass = violations.length === 0;
        mark(
          'testAxe',
          pass,
          pass
            ? `0 violations on #testStage (${results.passes?.length || 0} passes).`
            : `${violations.length} violation(s) — listed below.`,
        );
        if (list) {
          list.innerHTML = violations.slice(0, 12).map((v) => {
            const nodes = (v.nodes || []).length;
            return `<li><strong>${v.id}</strong> · ${v.impact || 'n/a'} · ${nodes} node(s)<br><span>${v.help}</span></li>`;
          }).join('') || '<li>No violations reported.</li>';
        }
      } catch (err) {
        mark('testAxe', false, `axe failed: ${err.message || err}`);
        if (list) list.innerHTML = '<li>Could not run axe-core (network or CDN blocked).</li>';
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    qs('#checkReducedMotion')?.addEventListener('click', () => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const out = qs('#reducedMotionOut');
      if (out) {
        out.textContent = mq.matches
          ? 'System: reduced motion ON — decorative animation should be suppressed.'
          : 'System: reduced motion OFF — motion allowed.';
      }
    });
  }

  function initInstallTerminal() {
    const root = qs('#expoTerminal');
    const body = qs('#expoTerminalBody');
    if (!root || !body) return;

    const cmd = root.getAttribute('data-cmd') || 'npm i @birdapi/velinstyle@1.2.0';
    const bootLines = [
      { text: `$ ${cmd}`, cls: 'expo-terminal__line--cmd', type: true },
      { text: 'resolving dependencies…', cls: 'expo-terminal__line--muted expo-terminal__line--spin', delay: 320 },
      { text: 'added 1 package in 1.2s', cls: 'expo-terminal__line--muted', delay: 260 },
      { text: '✓ @birdapi/velinstyle@1.2.0 installed', cls: 'expo-terminal__line--ok', delay: 220 },
      { text: '→ registering Web Components…', cls: 'expo-terminal__line--muted', delay: 240 },
      { text: '✓ 38 custom elements ready', cls: 'expo-terminal__line--ok', delay: 220 },
      { text: '✓ bootFromDOM selective load complete', cls: 'expo-terminal__line--ok', delay: 200 },
      { text: 'Build finished.', cls: 'expo-terminal__line--ok', delay: 180 },
    ];

    const livePool = [
      { text: '✓ Theme runtime loaded', cls: 'expo-terminal__line--ok' },
      { text: '✓ Motion runtime ready', cls: 'expo-terminal__line--ok' },
      { text: '✓ Search index warm', cls: 'expo-terminal__line--ok' },
      { text: '✓ Accessibility contracts online', cls: 'expo-terminal__line--ok' },
      { text: '✓ CLI commands registered', cls: 'expo-terminal__line--ok' },
      { text: '→ version check 1.2.0', cls: 'expo-terminal__line--muted' },
      { text: '→ component registry sync', cls: 'expo-terminal__line--muted' },
      { text: '✓ Highlight engine idle', cls: 'expo-terminal__line--ok' },
      { text: '→ dependency resolve cached', cls: 'expo-terminal__line--muted' },
      { text: '✓ Package integrity ok', cls: 'expo-terminal__line--ok' },
    ];

    const maxLines = 12;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let cancelled = false;
    let liveTimer = 0;

    const ensureCursor = () => {
      let prompt = body.querySelector('.expo-terminal__line--prompt');
      if (!prompt) {
        prompt = document.createElement('span');
        prompt.className = 'expo-terminal__line expo-terminal__line--muted expo-terminal__line--prompt';
        prompt.textContent = '$ ';
        const cursor = document.createElement('span');
        cursor.className = 'expo-terminal__cursor';
        cursor.setAttribute('aria-hidden', 'true');
        prompt.appendChild(cursor);
        body.appendChild(prompt);
      } else {
        body.appendChild(prompt);
      }
      return prompt;
    };

    const appendLine = (text, cls) => {
      const el = document.createElement('span');
      el.className = `expo-terminal__line ${cls || ''}`.trim();
      el.textContent = text;
      const prompt = body.querySelector('.expo-terminal__line--prompt');
      if (prompt) body.insertBefore(el, prompt);
      else body.appendChild(el);
      while (body.children.length > maxLines + 1) {
        const first = body.firstChild;
        if (first && first.classList && first.classList.contains('expo-terminal__line--prompt')) break;
        body.removeChild(first);
      }
      ensureCursor();
      return el;
    };

    const renderStatic = () => {
      body.innerHTML = '';
      bootLines.forEach((l) => appendLine(l.text, l.cls.replace('expo-terminal__line--spin', '')));
      ensureCursor();
      root.classList.add('is-live');
    };

    const startLiveLoop = () => {
      root.classList.add('is-live');
      ensureCursor();
      if (reduceMotion) return;
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        const item = livePool[i % livePool.length];
        i += 1;
        appendLine(item.text, item.cls);
        liveTimer = window.setTimeout(tick, 2200 + Math.floor(Math.random() * 1600));
      };
      liveTimer = window.setTimeout(tick, 1800);
    };

    const runBoot = async () => {
      body.innerHTML = '<span class="expo-terminal__line expo-terminal__line--muted expo-terminal__line--prompt">$ <span class="expo-terminal__cursor" aria-hidden="true"></span></span>';
      await wait(450);
      if (cancelled) return;
      body.innerHTML = '';
      for (const line of bootLines) {
        if (cancelled) return;
        const el = document.createElement('span');
        el.className = `expo-terminal__line ${line.cls || ''}`.trim();
        body.appendChild(el);
        if (line.type) {
          for (let i = 0; i < line.text.length; i += 1) {
            if (cancelled) return;
            el.textContent = line.text.slice(0, i + 1);
            await wait(16);
          }
        } else {
          el.textContent = line.text;
          await wait(line.delay || 200);
        }
      }
      ensureCursor();
      startLiveLoop();
    };

    if (reduceMotion) {
      renderStatic();
      return;
    }

    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          runBoot();
        });
      }, { threshold: 0.3 })
      : null;

    if (io) io.observe(root);
    else runBoot();

    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cancelled = true;
        window.clearTimeout(liveTimer);
        renderStatic();
      }
    });
  }

  function initFooterWidgets() {
    const el = qs('#footerCompCount');
    if (!el || reduceMotion) return;
    const target = Number(el.getAttribute('data-count-to') || '73');
    let started = false;
    const animate = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const dur = 900;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - (1 - t) ** 3;
        el.textContent = `${Math.round(target * eased)}+`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animate();
          io.disconnect();
        }
      }, { threshold: 0.4 });
      io.observe(el);
    } else animate();
  }

  function initPromptPipeline() {
    const steps = qsa('#promptPipeline .expo-pipeline__step');
    let i = 0;
    qs('#runPromptPipeline')?.addEventListener('click', () => {
      steps.forEach((s) => s.removeAttribute('aria-current'));
      i = (i + 1) % steps.length;
      steps[i]?.setAttribute('aria-current', 'step');
      const out = qs('#promptOut');
      if (!out) return;
      const texts = [
        'analyze: intent=saas landing, sections=hero/pricing/faq',
        'plan: JSON graph with constraints hero+contact',
        'render: blueprints → HTML with velin-* tags',
        'review: design 9.2 · a11y 9.8 · seo 8.7',
      ];
      out.textContent = texts[i] || texts[0];
    });
  }

  function initShowcase() {
    const grid = qs('#showcaseGrid');
    if (!grid) return;

    const categoryOf = (p) => {
      const tags = (p.tags || []).map((t) => String(t).toLowerCase());
      if (tags.some((t) => /dashboard|portal/.test(t))) return 'dashboard';
      if (tags.some((t) => /cms|docs|blog/.test(t))) return 'cms';
      if (tags.some((t) => /shop|store|commerce/.test(t))) return 'ecommerce';
      if (tags.some((t) => /portfolio|agency/.test(t))) return 'portfolio';
      if (tags.some((t) => /open.?source|oss|github/.test(t)) || p.meta) return 'opensource';
      if (tags.some((t) => /platform|api|service|booking|register|business/.test(t))) return 'business';
      return 'business';
    };

    let projects = [];
    let filter = 'all';

    const render = () => {
      grid.innerHTML = '';
      const list = projects.filter((p) => !p.meta || filter === 'opensource' || filter === 'all')
        .filter((p) => filter === 'all' || categoryOf(p) === filter);
      if (!list.length) {
        grid.innerHTML = '<p class="expo-showcase-empty">No projects in this filter yet.</p>';
        return;
      }
      list.forEach((p) => {
        const article = document.createElement('article');
        article.className = 'expo-case';
        article.dataset.category = categoryOf(p);
        const tokens = p.tokens || [];
        const utils = p.utilities || [];
        const modes = p.modes || ['light', 'dark', 'desktop', 'mobile'];
        const imgLight = (p.image || '').replace('../', '');
        const imgDark = (p.imageDark || p.image || '').replace('../', '');
        const imgMobile = (p.imageMobile || p.image || '').replace('../', '');
        article.innerHTML = `
            <div class="expo-case__media" data-mode="light">
              <img data-case-img src="${imgLight}" alt="${p.title} screenshot" width="720" height="450" loading="lazy" draggable="false">
            </div>
            <div class="expo-case__body">
              <span class="expo-case__cat">${categoryOf(p)}</span>
              <h3>${p.title}</h3>
              <p>${p.description || p.story || ''}</p>
              <div class="expo-case__modes" role="group" aria-label="${p.title} preview modes">
                ${modes.includes('light') || modes.includes('desktop') ? '<button type="button" class="velin-btn velin-btn--primary velin-btn--sm" data-case-mode="light" aria-pressed="true">Light</button>' : ''}
                ${modes.includes('dark') ? '<button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-case-mode="dark" aria-pressed="false">Dark</button>' : ''}
                ${modes.includes('mobile') ? '<button type="button" class="velin-btn velin-btn--outline velin-btn--sm" data-case-mode="mobile" aria-pressed="false">Mobile</button>' : ''}
              </div>
              <div class="expo-case__meta-block">
                <small>Components</small>
                <div class="expo-meta">${(p.components || []).slice(0, 5).map((c) => `<span class="velin-badge velin-badge--outline">${c}</span>`).join('')}</div>
              </div>
              <div class="expo-case__meta-block">
                <small>Themes</small>
                <div class="expo-meta">${(p.tokens || []).slice(0, 4).map((t) => `<span class="velin-badge">${t}</span>`).join('')}</div>
              </div>
              <div class="expo-case__meta-block">
                <small>Utilities</small>
                <div class="expo-meta">${(p.utilities || []).slice(0, 4).map((u) => `<span class="velin-badge velin-badge--outline">${u}</span>`).join('')}</div>
              </div>
              <div class="expo-links">
                <a class="velin-btn velin-btn--primary velin-btn--sm" href="${p.url}" target="_blank" rel="noopener noreferrer">Live Demo</a>
                <a class="velin-btn velin-btn--outline velin-btn--sm" href="showcase/index.html">Case Study</a>
                <a class="velin-btn velin-btn--ghost velin-btn--sm" href="docs/components/index.html">Docs</a>
              </div>
            </div>`;
        const media = article.querySelector('.expo-case__media');
        const img = article.querySelector('[data-case-img]');
        article.querySelectorAll('[data-case-mode]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-case-mode');
            media.dataset.mode = mode;
            if (mode === 'dark') img.src = imgDark;
            else if (mode === 'mobile') img.src = imgMobile;
            else img.src = imgLight;
            article.querySelectorAll('[data-case-mode]').forEach((b) => {
              const on = b === btn;
              b.setAttribute('aria-pressed', String(on));
              b.classList.toggle('velin-btn--primary', on);
              b.classList.toggle('velin-btn--outline', !on);
            });
          });
        });
        grid.appendChild(article);
      });
    };

    qsa('[data-showcase-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        filter = btn.getAttribute('data-showcase-filter') || 'all';
        qsa('[data-showcase-filter]').forEach((b) => {
          const on = b === btn;
          b.setAttribute('aria-pressed', String(on));
          b.classList.toggle('velin-btn--primary', on);
          b.classList.toggle('velin-btn--outline', !on);
        });
        render();
        grid.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    const scrollByCard = (dir) => {
      const card = grid.querySelector('.expo-case');
      const amount = card ? card.getBoundingClientRect().width + 16 : 320;
      grid.scrollBy({ left: dir * amount, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    qs('#showcasePrev')?.addEventListener('click', () => scrollByCard(-1));
    qs('#showcaseNext')?.addEventListener('click', () => scrollByCard(1));

    grid.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCard(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCard(-1); }
    });

    /* Pointer drag */
    let drag = null;
    grid.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button, input')) return;
      drag = { x: e.clientX, left: grid.scrollLeft, id: e.pointerId };
      grid.classList.add('is-dragging');
      try { grid.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    });
    grid.addEventListener('pointermove', (e) => {
      if (!drag) return;
      grid.scrollLeft = drag.left - (e.clientX - drag.x);
    });
    const endDrag = () => {
      if (!drag) return;
      drag = null;
      grid.classList.remove('is-dragging');
    };
    grid.addEventListener('pointerup', endDrag);
    grid.addEventListener('pointercancel', endDrag);

    fetch('showcase/projects.json')
      .then((r) => r.json())
      .then((data) => {
        projects = data || [];
        render();
      })
      .catch(() => {
        grid.innerHTML = '<p class="expo-a11y-note">Showcase data unavailable.</p>';
      });
  }

  function initContractExtras() {
    const cmd = qs('#expoCommand');
    const openCmd = () => {
      if (!cmd) return;
      if (typeof cmd.open === 'function') cmd.open();
      else cmd.setAttribute('open', '');
    };
    qs('#openExpoCommand')?.addEventListener('click', openCmd);
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmd();
      }
    });
    cmd?.addEventListener('velin-select', (e) => {
      const href = e.detail?.item?.getAttribute?.('data-href') || e.target?.querySelector?.('[aria-selected="true"]')?.getAttribute('data-href');
      const fallback = e.detail?.value;
      const map = {
        'whats-new': '#whats-new',
        facts: '#facts',
        why: '#why',
        diff: '#diff',
        habits: '#habits',
        playground: '#playground',
        forms: '#forms',
        tokens: '#tokens',
        testing: '#testing',
        install: '#install',
        docs: 'docs/getting-started/introduction.html',
      };
      const dest = href || map[fallback];
      if (dest) location.href = dest;
    });
    qsa('#expoCommand velin-command-item').forEach((item) => {
      item.addEventListener('click', () => {
        const href = item.getAttribute('data-href');
        if (href) location.href = href;
      });
    });
    qs('#openExpoDialog')?.addEventListener('click', async () => {
      const dlg = qs('#expoDialog');
      if (dlg && typeof dlg.confirm === 'function') {
        await dlg.confirm('Confirm this dialog contract demo?', { title: 'velin-dialog', confirmText: 'Confirm', cancelText: 'Cancel' });
      } else if (dlg?.show) {
        dlg.show();
      }
    });
  }

  function initHeroGalleryTabs() {
    qsa('[data-hero-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-hero-pick');
        qsa('[data-hero-panel]').forEach((p) => { p.hidden = p.getAttribute('data-hero-panel') !== id; });
        qsa('[data-hero-pick]').forEach((b) => {
          const on = b === btn;
          b.setAttribute('aria-pressed', String(on));
          b.classList.toggle('velin-btn--primary', on);
          b.classList.toggle('velin-btn--outline', !on);
        });
      });
    });
  }

  function initCopyButtons() {
    qsa('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy') || '';
        try {
          await navigator.clipboard.writeText(text);
          const prev = btn.textContent;
          btn.textContent = 'Copied';
          setTimeout(() => { btn.textContent = prev; }, 1200);
        } catch (_) {
          btn.textContent = 'Copy failed';
        }
      });
    });
  }

  function initEntryMotion() {
    const root = document.documentElement;
    const supportsViewTimeline = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: view()');
    const canObserve = 'IntersectionObserver' in window;

    /* Browsers without scroll-driven animations get an observer-driven reveal. */
    if (!reduceMotion && !supportsViewTimeline && canObserve) {
      const targets = qsa('[data-expo-reveal], [data-expo-stagger]');
      if (targets.length) {
        root.classList.add('expo-io');
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-inview');
            io.unobserve(entry.target);
          });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
        targets.forEach((el) => io.observe(el));
      }
    }

    /* Pointer spotlight across card groups. */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      qsa('[data-expo-spotlight]').forEach((group) => {
        let frame = 0;
        let pending = null;
        group.addEventListener('pointermove', (event) => {
          const card = event.target.closest?.('[data-expo-spotlight] > *');
          if (!card) return;
          pending = { card, x: event.clientX, y: event.clientY };
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            if (!pending) return;
            const rect = pending.card.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            pending.card.style.setProperty('--expo-mx', `${((pending.x - rect.left) / rect.width) * 100}%`);
            pending.card.style.setProperty('--expo-my', `${((pending.y - rect.top) / rect.height) * 100}%`);
          });
        });
      });
    }

    /* Park the hero ambience while it is off screen. */
    const hero = qs('#hero');
    if (hero && !reduceMotion && canObserve) {
      const heroIo = new IntersectionObserver(([entry]) => {
        hero.classList.toggle('expo-hero--rest', !entry.isIntersecting);
      }, { threshold: 0 });
      heroIo.observe(hero);
    }
  }

  function boot() {
    initMegaNav();
    initNavSpy();
    initMobileToc();
    initThemePack();
    initTokenLab();
    initPlayground();
    initUtilityLab();
    initOverlays();
    initToasts();
    initAnimTiles();
    initForms();
    initNavDemos();
    initTesting();
    initPromptPipeline();
    initShowcase();
    initContractExtras();
    initHeroGalleryTabs();
    initCopyButtons();
    initInstallTerminal();
    initFooterWidgets();
  }

  try {
    initEntryMotion();
  } catch (err) {
    console.error('[home] entry motion failed', err);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
