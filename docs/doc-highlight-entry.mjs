/**
 * Bundled entry: syntax highlighting for static docs (VelinHighlight).
 */
import {
  initHighlight,
  highlightElement,
  highlightAll,
} from '../../velinstyle/core/highlight/index.js';

const SELECTOR = [
  '.velin-doc-example__code pre',
  '.velin-doc-main pre:has(code[class*="language-"])',
  'pre[velin-code]',
  'pre[language]',
  'pre[data-language]',
  'velin-code-block pre',
  '.velin-doc-md-dialog__body pre',
].join(',');

function boot() {
  const teardown = initHighlight(document, {
    selector: SELECTOR,
    immediate: true,
  });

  window.VelinDocHighlight = {
    highlightElement,
    highlightAll,
    initHighlight,
    teardown,
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
