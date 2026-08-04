/**
 * Unified doc viewer for VelinStyle docs and homepage.
 * Intercepts same-origin .md / .txt and generated/ directory links; opens a <dialog>.
 */
(function (global) {
  'use strict';

  const MD_LINK_RE = /\.md(?:[#?][^#?]*)?$/i;
  const TXT_LINK_RE = /\.txt(?:[#?][^#?]*)?$/i;
  const DOC_LINK_RE = /\.(?:md|txt)(?:[#?][^#?]*)?$/i;
  const DOCS_GENERATED = /\/docs\/generated\//i;

  /** Directory URL of the markdown file currently shown in the dialog (for ./relative links). */
  let activeMdBase = null;

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ESC[c] || c);
  }

  function renderInline(text) {
    const parts = [];
    const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
    let last = 0;
    let m;
    while ((m = linkRe.exec(text))) {
      if (m.index > last) {
        parts.push(escapeHtml(text.slice(last, m.index)));
      }
      parts.push(
        `<a href="${escapeHtml(m[2])}" class="velin-doc-md-link">${escapeHtml(m[1])}</a>`,
      );
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(escapeHtml(text.slice(last)));
    return parts
      .join('')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function renderTable(lines) {
    if (lines.length < 2) return '';
    const rows = lines.map((line) =>
      line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim()),
    );
    const head = rows[0];
    const body = rows.slice(2);
    let html = '<table class="velin-table"><thead><tr>';
    head.forEach((c) => {
      html += `<th>${renderInline(c)}</th>`;
    });
    html += '</tr></thead><tbody>';
    body.forEach((cells) => {
      html += '<tr>';
      cells.forEach((c) => {
        html += `<td>${renderInline(c)}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  function renderBlock(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i += 1;
        continue;
      }

      if (/^#{1,6}\s/.test(line)) {
        const level = line.match(/^#+/)[0].length;
        out.push(`<h${level}>${renderInline(line.replace(/^#+\s*/, ''))}</h${level}>`);
        i += 1;
        continue;
      }

      if (line.trim().startsWith('|') && lines[i + 1]?.includes('---')) {
        const tableLines = [line];
        i += 1;
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i += 1;
        }
        out.push(renderTable(tableLines));
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        out.push('<ul>');
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          out.push(`<li>${renderInline(lines[i].replace(/^[-*]\s+/, ''))}</li>`);
          i += 1;
        }
        out.push('</ul>');
        continue;
      }

      const para = [];
      while (i < lines.length && lines[i].trim() && !/^#{1,6}\s/.test(lines[i]) && !lines[i].trim().startsWith('|')) {
        if (/^[-*]\s+/.test(lines[i])) break;
        para.push(lines[i]);
        i += 1;
      }
      if (para.length) out.push(`<p>${renderInline(para.join(' '))}</p>`);
    }

    return out.join('\n');
  }

  function renderPlainText(src) {
    return `<pre class="velin-doc-plain-text"><code>${escapeHtml(src.replace(/\r\n/g, '\n'))}</code></pre>`;
  }

  function renderMarkdown(src) {
    const parts = [];
    const re = /```([\w-]*)\n([\s\S]*?)```/g;
    let last = 0;
    let m;
    while ((m = re.exec(src))) {
      if (m.index > last) parts.push(renderBlock(src.slice(last, m.index)));
      const lang = m[1] || 'text';
      parts.push(
        `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(m[2].replace(/\n$/, ''))}</code></pre>`,
      );
      last = m.index + m[0].length;
    }
    if (last < src.length) parts.push(renderBlock(src.slice(last)));
    return parts.join('\n');
  }

  function ensureDialog() {
    let dlg = document.getElementById('velinDocMdDialog');
    if (dlg) return dlg;

    dlg = document.createElement('dialog');
    dlg.id = 'velinDocMdDialog';
    dlg.className = 'velin-doc-md-dialog';
    dlg.innerHTML =
      '<form method="dialog" class="velin-doc-md-dialog__panel">' +
      '<header class="velin-doc-md-dialog__header">' +
      '<h2 class="velin-doc-md-dialog__title" id="velinDocMdTitle">Reference</h2>' +
      '<button type="submit" class="velin-doc-md-dialog__close" aria-label="Close">×</button>' +
      '</header>' +
      '<div class="velin-doc-md-dialog__body velin-doc-main" id="velinDocMdBody"></div>' +
      '</form>';
    document.body.appendChild(dlg);
    return dlg;
  }

  function setActiveMdBaseFromUrl(url) {
    try {
      const u = new URL(url);
      let path = u.pathname.replace(/\\/g, '/');
      if (!path.endsWith('/')) path = path.replace(/\/[^/]*$/, '/');
      activeMdBase = `${u.origin}${path}`;
    } catch {
      activeMdBase = null;
    }
  }

  function pageDirectoryHref() {
    if (activeMdBase) return activeMdBase;
    const page = new URL(location.href);
    let path = page.pathname.replace(/\\/g, '/');
    if (/\.html?$/i.test(path)) {
      path = path.replace(/\/[^/]*$/, '/');
    } else if (!path.endsWith('/')) {
      path += '/';
    }
    return `${page.origin}${path}`;
  }

  function normalizeMdHref(href) {
    if (!href) return href;
    let h = href.trim();
    if (/^https?:\/\//i.test(h)) return h;
    if (h.startsWith('/')) return h;
    if (h.startsWith('generated/')) return h;
    if (/\/docs\/generated\//i.test(location.pathname) && !h.includes('..')) {
      return h;
    }
    return h;
  }

  /** Only auto-append README.md under docs/generated (not atelier/, demos/, etc.). */
  function isGeneratedDocsAutoPath(pathOnly) {
    const p = String(pathOnly || '').replace(/\\/g, '/').replace(/^\.\//, '');
    if (/\/docs\/generated\//i.test(p) || /^docs\/generated\//i.test(p) || /^generated\//i.test(p)) {
      return true;
    }
    // Relative section folders while browsing generated docs pages
    if (/\/docs\/generated\//i.test(location.pathname)) {
      return /^(components|tokens|utilities|attributes|cli|rules|a11y|meta)(\/|$)/i.test(p);
    }
    return false;
  }

  /** Map generated/ section folders to README.md */
  function canonicalMdHref(href) {
    const h = normalizeMdHref(href);
    if (!h || /^https?:\/\//i.test(h)) return h;
    if (MD_LINK_RE.test(h)) return h;

    const hashQuery = h.match(/[#?].*$/)?.[0] || '';
    const pathOnly = h.slice(0, h.length - hashQuery.length);
    const file = pathOnly.split('/').pop() || '';

    if (/\.html?$/i.test(file)) return h;
    if (!isGeneratedDocsAutoPath(pathOnly)) return h;
    if (pathOnly.endsWith('/')) return `${pathOnly}README.md${hashQuery}`;
    if (!/\.[a-z0-9]+$/i.test(file)) return `${pathOnly}/README.md${hashQuery}`;
    return h;
  }

  function resolveMdHref(href) {
    try {
      const canonical = canonicalMdHref(href);
      const base = pageDirectoryHref();
      let url = new URL(canonical, base).href;
      if (DOCS_GENERATED.test(location.pathname) && DOCS_GENERATED.test(url)) {
        const pagePath = new URL(location.href).pathname.replace(/\\/g, '/');
        const genRoot = pagePath.match(/^(.*\/docs\/generated\/)/i);
        if (genRoot) {
          const rel = canonical.replace(/^\.\//, '');
          if (!rel.startsWith('..') && !rel.startsWith('/')) {
            url = new URL(rel, `${new URL(location.href).origin}${genRoot[1]}`).href;
          }
        }
      }
      return url;
    } catch {
      return null;
    }
  }

  function highlightIn(root) {
    if (global.VelinDocHighlight?.highlightAll) {
      global.VelinDocHighlight.highlightAll(root);
    }
  }

  function isTxtUrl(url) {
    try {
      return TXT_LINK_RE.test(new URL(url).pathname);
    } catch {
      return TXT_LINK_RE.test(url);
    }
  }

  async function openMd(href) {
    const url = resolveMdHref(href);
    if (!url) return false;
    const asTxt = isTxtUrl(url);

    if (location.protocol === 'file:') {
      const dlg = ensureDialog();
      const body = document.getElementById('velinDocMdBody');
      const title = document.getElementById('velinDocMdTitle');
      if (title) title.textContent = asTxt ? 'Text' : 'Markdown';
      if (body) {
        body.innerHTML =
          '<p class="velin-alert velin-alert--warning">File preview needs HTTP. Run <code>npm run dev</code> in velinstyle-site and open <code>http://localhost:4000/...</code></p>';
      }
      dlg.showModal();
      return true;
    }

    const dlg = ensureDialog();
    const title = document.getElementById('velinDocMdTitle');
    const body = document.getElementById('velinDocMdBody');
    const name = decodeURIComponent(url.split('/').pop() || 'Document');
    if (title) title.textContent = name.replace(/\.(md|txt)$/i, '');
    if (body) body.innerHTML = '<p class="velin-text-muted">Loading…</p>';
    dlg.showModal();

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const raw = await res.text();
      if (body) {
        body.innerHTML = asTxt ? renderPlainText(raw) : renderMarkdown(raw);
        if (!asTxt) highlightIn(body);
        bindRoot(body);
      }
      setActiveMdBaseFromUrl(url);
    } catch (err) {
      if (body) {
        body.innerHTML =
          `<p class="velin-alert velin-alert--warning">Could not load <code>${escapeHtml(href)}</code> (${escapeHtml(err.message)}). ` +
          'Try <code>npm run dev</code> in velinstyle-site.</p>';
      }
    }
    return true;
  }

  function sameOriginDocHref(href) {
    if (/^https?:\/\//i.test(href)) {
      try {
        return new URL(href).origin === location.origin;
      } catch {
        return false;
      }
    }
    return true;
  }

  function isProductSurfaceHref(raw) {
    const cleaned = String(raw || '').replace(/^\.\//, '');
    if (/^(?:\.\.\/)*(atelier|showcase-reihe|demos|showcase)(\/|$)/i.test(cleaned)) return true;
    if (/^\/(atelier|showcase-reihe|demos|showcase)(\/|$)/i.test(cleaned)) return true;
    try {
      const path = new URL(cleaned, 'https://velinstyle.info/').pathname;
      return /^\/(atelier|showcase-reihe|demos|showcase)(\/|$)/i.test(path);
    } catch {
      return false;
    }
  }

  function shouldOpenInViewer(a) {
    const raw = a.getAttribute('href');
    if (!raw || raw.startsWith('#')) return false;
    if (a.dataset.external != null || a.hasAttribute('download')) return false;
    // Site chrome / product surfaces must navigate normally (never MD dialog)
    if (a.closest('.expo-nav, .expo-site-nav, .expo-nav__panel, .at-top, .at-top__nav')) return false;
    if (isProductSurfaceHref(raw)) return false;

    const href = canonicalMdHref(raw);
    const inDialog = !!a.closest('#velinDocMdBody');

    if (DOC_LINK_RE.test(href)) return sameOriginDocHref(href);

    if (a.target === '_blank' && !inDialog) return false;

    if (/^https?:\/\//i.test(href)) return false;

    const path = href.replace(/[#?].*$/, '');
    const file = path.split('/').pop() || '';

    if (/\.html?$/i.test(file)) return false;

    const section = path.replace(/^generated\//, '');
    const isGeneratedSection =
      /^(components|tokens|utilities|attributes|cli|rules|a11y|meta)(\/|$)/i.test(section) ||
      (path.includes('generated/') && /^(components|tokens|utilities|attributes|cli|rules|a11y|meta)(\/|$)/i.test(section));

    if (isGeneratedSection) {
      if (!file || !/\.[a-z0-9]+$/i.test(file)) return true;
      if (/\.md$/i.test(file)) return true;
    }
    return false;
  }

  function onDocClick(e) {
    const a = e.target.closest('a[href]');
    if (!a || !shouldOpenInViewer(a)) return;
    e.preventDefault();
    e.stopPropagation();
    if (!a.closest('#velinDocMdBody')) activeMdBase = null;
    openMd(a.getAttribute('href'));
  }

  function bindRoot(root) {
    if (!root) return;
    const marker = root.nodeType === Node.DOCUMENT_NODE ? root.documentElement : root;
    if (!marker?.dataset || marker.dataset.velinMdBound) return;
    marker.dataset.velinMdBound = '1';
    root.querySelectorAll('a[href]').forEach((a) => {
      if (shouldOpenInViewer(a)) a.classList.add('velin-doc-md-link');
    });
  }

  function init() {
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.getElementById('velinDocMdDialog')?.close();
    });
    const dlg = ensureDialog();
    dlg.addEventListener('close', () => {
      activeMdBase = null;
    });
    bindRoot(document);
  }

  global.VelinDocMd = { open: openMd, bindRoot, shouldOpenInViewer, resolveMdHref };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
