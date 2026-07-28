/**
 * VelinStyle marketing homepage — scroll progress (JS) + motion safety net.
 * Scroll-linked CSS timelines are disabled via html[data-velin-home] in home.css;
 * primary reveals run through initMotion() (data-velin-reveal-auto).
 */
(function () {
  const HOME_SELECTOR = [
    '.velin-animate-on-scroll',
    '[velin-reveal]',
    '[velin-fade]',
    '[velin-slide]',
    '[velin-scale]',
  ].join(',');

  function markInView(el) {
    el.classList.add('velin-in-view');
  }

  function observeHomeReveals() {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          markInView(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll(HOME_SELECTOR).forEach((el) => {
      if (el.classList.contains('velin-in-view') || el.dataset.velinVisible === 'true') return;
      observer.observe(el);
    });
  }

  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar || bar.classList.contains('velin-scroll-progress')) return;
    function update() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      bar.style.transform = `scaleX(${progress})`;
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function revealExtensionSection() {
    document.querySelectorAll('#extension .extension-card').forEach(markInView);
  }

  function onReady() {
    initScrollProgress();
    revealExtensionSection();
    observeHomeReveals();
    window.addEventListener('load', () => {
      revealExtensionSection();
      observeHomeReveals();
    }, { once: true });
    setTimeout(() => {
      revealExtensionSection();
      observeHomeReveals();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }
})();
