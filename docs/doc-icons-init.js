/**
 * Font Awesome via jsDelivr (solid / regular / brands) before sidebar icons fetch.
 */
(function () {
  'use strict';
  var base = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs';
  var variants = {
    solid: base + '/solid/{name}.svg',
    regular: base + '/regular/{name}.svg',
    brands: base + '/brands/{name}.svg',
  };

  function apply() {
    var VI = customElements.get('velin-icon');
    if (!VI || !VI.registerProvider) return false;
    VI.registerProvider('fontawesome', variants.solid, variants);
    return true;
  }

  function refreshIcons() {
    document.querySelectorAll('velin-icon[provider="fontawesome"]').forEach(function (el) {
      var n = el.getAttribute('name');
      if (!n) return;
      el.removeAttribute('name');
      el.setAttribute('name', n);
    });
  }

  if (!apply()) {
    customElements.whenDefined('velin-icon').then(function () {
      apply();
      refreshIcons();
    });
  } else {
    refreshIcons();
  }
})();
