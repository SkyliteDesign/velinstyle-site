(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // ../velinstyle/core/search/worker-client.js
  var worker_client_exports = {};
  __export(worker_client_exports, {
    createSearchWorker: () => createSearchWorker
  });
  function createSearchWorker(workerUrl) {
    if (typeof Worker === "undefined") return null;
    if (!workerUrl) return null;
    const url = workerUrl;
    let worker;
    try {
      worker = new Worker(url, { type: "module" });
    } catch {
      return null;
    }
    const pending = /* @__PURE__ */ new Map();
    worker.onmessage = (e) => {
      const { id, ok, result, error } = e.data || {};
      const p = pending.get(id);
      if (!p) return;
      pending.delete(id);
      if (ok) p.resolve(result);
      else p.reject(new Error(error || "Worker error"));
    };
    worker.onerror = () => {
      for (const p of pending.values()) p.reject(new Error("Worker failed"));
      pending.clear();
    };
    function send(type, payload) {
      const id = ++_nextId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        worker.postMessage({ id, type, payload });
      });
    }
    return {
      setEntries(entries) {
        return send("setEntries", { entries });
      },
      query(query, options) {
        return send("query", { query, options });
      },
      terminate() {
        worker.terminate();
      }
    };
  }
  var _nextId;
  var init_worker_client = __esm({
    "../velinstyle/core/search/worker-client.js"() {
      _nextId = 0;
    }
  });

  // ../velinstyle/components/sanitize.js
  var ALLOWED_URL_PROTOCOLS = /* @__PURE__ */ new Set(["http:", "https:", "data:", "mailto:", "tel:"]);
  var BLOCKED_DATA_MIME = /^data:(?:text\/html|image\/svg\+xml|application\/xml)/i;
  var ALLOWED_DATA_IMAGE = /^data:image\/(png|jpeg|jpg|gif|webp|avif);base64,/i;
  function sanitizeURL(url, base) {
    if (typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^\s*javascript:/i.test(trimmed) || /^\s*vbscript:/i.test(trimmed)) return "";
    if (BLOCKED_DATA_MIME.test(trimmed)) return "";
    if (/^data:/i.test(trimmed) && !ALLOWED_DATA_IMAGE.test(trimmed)) return "";
    try {
      const parsed = new URL(trimmed, base || (typeof location !== "undefined" ? location.href : "https://example.invalid/"));
      if (!ALLOWED_URL_PROTOCOLS.has(parsed.protocol)) return "";
      if (parsed.protocol === "data:" && !ALLOWED_DATA_IMAGE.test(parsed.href)) return "";
      return parsed.href;
    } catch {
      if (trimmed.startsWith("#") || trimmed.startsWith("/")) return trimmed;
      return "";
    }
  }
  function sanitizeSearchUrl(url, base) {
    if (typeof url !== "string") return "#";
    const trimmed = url.trim();
    if (!trimmed) return "#";
    if (trimmed.startsWith("#")) return trimmed;
    if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
    if (!/^https?:\/\//i.test(trimmed)) {
      if (/^\s*javascript:/i.test(trimmed) || /^\s*vbscript:/i.test(trimmed)) return "#";
      return trimmed;
    }
    const safe = sanitizeURL(trimmed, base);
    return safe || "#";
  }

  // ../velinstyle/core/search/types.js
  var SEARCH_CATEGORIES = (
    /** @type {const} */
    ["docs", "components", "api", "examples"]
  );
  var CATEGORY_BOOST = {
    components: 1.25,
    api: 1.15,
    docs: 1,
    examples: 0.9
  };
  function normalizeEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    const e = (
      /** @type {Record<string, unknown>} */
      entry
    );
    const id = String(e.id || e.url || e.title || "").trim();
    const title = String(e.title || "").trim();
    const url = String(e.url || "").trim();
    if (!id || !title) return null;
    const keywords = Array.isArray(e.keywords) ? e.keywords.map((k) => String(k)) : typeof e.keywords === "string" ? e.keywords.split(/\s+/).filter(Boolean) : [];
    let category = (
      /** @type {SearchCategory} */
      SEARCH_CATEGORIES.includes(
        /** @type {SearchCategory} */
        e.category
      ) ? e.category : "docs"
    );
    if (!e.category && typeof e.url === "string") {
      if (e.url.includes("/components/")) category = "components";
      else if (e.url.includes("/cli/") || e.url.includes("/api/")) category = "api";
      else if (e.url.includes("samples/") || e.url.includes("examples/")) category = "examples";
    }
    const safeUrl = url ? sanitizeSearchUrl(url) : `#${id}`;
    return {
      id,
      title,
      excerpt: String(e.excerpt || e.section || "").slice(0, 200),
      url: safeUrl,
      category: (
        /** @type {SearchCategory} */
        category
      ),
      keywords,
      weight: typeof e.weight === "number" ? e.weight : 1
    };
  }

  // ../velinstyle/core/search/engine.js
  var VelinSearchEngine = class {
    constructor() {
      this._entries = [];
    }
    /** @param {import('./types.js').SearchEntry[]} entries */
    setEntries(entries) {
      this._entries = entries.map((e) => normalizeEntry(e)).filter(Boolean);
    }
    /** @param {import('./types.js').SearchEntry[]} entries */
    addEntries(entries) {
      const next = entries.map((e) => normalizeEntry(e)).filter(Boolean);
      const ids = new Set(this._entries.map((e) => e.id));
      for (const e of next) {
        if (!ids.has(e.id)) {
          this._entries.push(e);
          ids.add(e.id);
        }
      }
    }
    /**
     * @param {string} query
     * @param {object} [opts]
     * @param {number} [opts.limit]
     * @param {number} [opts.minChars]
     * @param {number} [opts.fuzzy] 0–1 threshold for typo tolerance
     * @param {import('./types.js').SearchCategory[]} [opts.categories]
     */
    query(query, opts = {}) {
      const q = String(query || "").trim().toLowerCase();
      const minChars = opts.minChars ?? 2;
      const limit = opts.limit ?? 12;
      const fuzzy = opts.fuzzy ?? 0.2;
      const categories = opts.categories;
      if (q.length < minChars) {
        return { results: [], groups: {} };
      }
      const scored = [];
      for (const entry of this._entries) {
        if (categories && categories.length && !categories.includes(entry.category)) continue;
        const s = scoreEntry(entry, q, fuzzy);
        if (s > 0) scored.push({ entry, score: s });
      }
      scored.sort((a, b) => b.score - a.score);
      const results = scored.slice(0, limit).map((x) => ({ ...x.entry, _score: x.score }));
      const groups = {};
      for (const r of results) {
        if (!groups[r.category]) groups[r.category] = [];
        groups[r.category].push(r);
      }
      return { results, groups };
    }
  };
  function scoreEntry(entry, q, fuzzy) {
    const title = entry.title.toLowerCase();
    const excerpt = (entry.excerpt || "").toLowerCase();
    const keywords = (entry.keywords || []).join(" ").toLowerCase();
    const boost = (CATEGORY_BOOST[entry.category] || 1) * (entry.weight || 1);
    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 70;
    else if (title.includes(q)) score = 50;
    else if (keywords.includes(q)) score = 35;
    else if (excerpt.includes(q)) score = 25;
    else if (fuzzy > 0 && fuzzyMatch(title, q, fuzzy)) score = 40;
    else if (fuzzy > 0 && fuzzyMatch(keywords, q, fuzzy)) score = 28;
    else if (fuzzy > 0 && fuzzyMatch(excerpt, q, fuzzy)) score = 18;
    else if (subsequenceMatch(title, q)) score = 22;
    else if (fuzzy > 0) {
      for (const word of title.split(/[^a-z0-9]+/)) {
        if (word.length >= 3 && fuzzyMatch(word, q, fuzzy)) {
          score = 32;
          break;
        }
      }
    }
    return score > 0 ? score * boost : 0;
  }
  function subsequenceMatch(haystack, needle) {
    let j = 0;
    for (let i = 0; i < haystack.length && j < needle.length; i++) {
      if (haystack[i] === needle[j]) j++;
    }
    return j === needle.length;
  }
  function fuzzyMatch(text, query, threshold) {
    if (!text || !query) return false;
    if (text.includes(query)) return true;
    if (subsequenceMatch(text, query)) return true;
    const maxDist = Math.max(1, Math.floor(query.length * threshold * 2));
    return levenshtein(text.slice(0, Math.min(text.length, query.length + 8)), query) <= maxDist;
  }
  function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = new Uint16Array((n + 1) * (m + 1));
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      dp[i * (n + 1)] = i;
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i * (n + 1) + j] = Math.min(
          dp[(i - 1) * (n + 1) + j] + 1,
          dp[i * (n + 1) + (j - 1)] + 1,
          dp[(i - 1) * (n + 1) + (j - 1)] + cost
        );
      }
    }
    return dp[m * (n + 1) + n];
  }

  // ../velinstyle/core/search/highlight.js
  function highlightHtml(text, query) {
    const raw = String(text || "");
    const q = String(query || "").trim();
    if (!q || q.length < 2) return escapeHtml(raw);
    const lower = raw.toLowerCase();
    const ql = q.toLowerCase();
    let start = lower.indexOf(ql);
    let len = q.length;
    if (start === -1) {
      start = fuzzySubsequenceIndex(lower, ql);
      if (start === -1) return escapeHtml(raw);
      len = Math.min(q.length, raw.length - start);
    }
    return escapeHtml(raw.slice(0, start)) + '<mark class="velin-search-hit">' + escapeHtml(raw.slice(start, start + len)) + "</mark>" + escapeHtml(raw.slice(start + len));
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fuzzySubsequenceIndex(haystack, needle) {
    let j = 0;
    let start = -1;
    for (let i = 0; i < haystack.length && j < needle.length; i++) {
      if (haystack[i] === needle[j]) {
        if (j === 0) start = i;
        j++;
      }
    }
    return j === needle.length ? start : -1;
  }

  // ../velinstyle/core/search/docs-url.js
  var DOCS_MOUNT = "/docs/";
  var DOC_ROOT_SEGMENTS = /* @__PURE__ */ new Set([
    "getting-started",
    "extend",
    "guides",
    "utilities",
    "components",
    "forms",
    "layout",
    "content",
    "customize",
    "animations",
    "about",
    "helpers",
    "generated",
    "migration"
  ]);
  function getDocsBaseUrl() {
    if (typeof document === "undefined") {
      return "https://example.invalid/docs/";
    }
    const script = document.querySelector('script[src*="doc-search"]');
    if (script?.src) {
      const u = new URL(script.src);
      const i = u.pathname.indexOf(DOCS_MOUNT);
      if (i !== -1) {
        return u.origin + u.pathname.slice(0, i + DOCS_MOUNT.length);
      }
    }
    const path = window.location.pathname.replace(/\\/g, "/");
    const idx = path.indexOf(DOCS_MOUNT);
    if (idx >= 0) {
      return new URL(path.slice(0, idx + DOCS_MOUNT.length), window.location.origin).href;
    }
    return new URL("./", window.location.href).href;
  }
  function splitUrlHash(url) {
    const i = url.indexOf("#");
    if (i === -1) return { path: url, hash: "" };
    return { path: url.slice(0, i), hash: url.slice(i) };
  }
  function relativizeDocsPathname(pathname) {
    const docsIdx = pathname.indexOf(DOCS_MOUNT);
    if (docsIdx < 0) return null;
    const rest = pathname.slice(docsIdx + DOCS_MOUNT.length);
    const parts = rest.split("/").filter(Boolean);
    if (parts.length >= 2 && DOC_ROOT_SEGMENTS.has(parts[0]) && DOC_ROOT_SEGMENTS.has(parts[1]) && parts[0] !== parts[1]) {
      return parts.slice(1).join("/");
    }
    return rest;
  }
  function resolveDocsSearchUrl(url) {
    if (!url || url === "#") return "";
    if (typeof window === "undefined") return url;
    const { path, hash } = splitUrlHash(url);
    if (!path) return hash || "";
    let rel = path;
    if (/^https?:\/\//i.test(path)) {
      try {
        const fixed = relativizeDocsPathname(new URL(path).pathname);
        rel = fixed ?? path;
      } catch {
        return "";
      }
    }
    try {
      const target = new URL(rel || "", getDocsBaseUrl());
      return target.href + (hash && !target.href.includes("#") ? hash : "");
    } catch {
      return "";
    }
  }

  // ../velinstyle/core/search/index.js
  var defaultEngine = new VelinSearchEngine();
  function parseIndexPayload(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.entries)) return data.entries;
    return [];
  }
  function createSearch(config = {}) {
    const engine = new VelinSearchEngine();
    const wantWorker = config.worker === true;
    let workerClient = null;
    async function getWorker() {
      if (!wantWorker || workerClient) return workerClient;
      if (typeof Worker === "undefined") return null;
      const { createSearchWorker: createSearchWorker2 } = await Promise.resolve().then(() => (init_worker_client(), worker_client_exports));
      workerClient = createSearchWorker2(config.workerUrl);
      return workerClient;
    }
    return {
      engine,
      async loadIndex(source) {
        let entries = [];
        if (typeof source === "string") {
          const res = await fetch(source);
          entries = parseIndexPayload(await res.json());
        } else if (Array.isArray(source)) {
          entries = source;
        }
        engine.setEntries(entries);
        const w = await getWorker();
        if (w) await w.setEntries(engine._entries);
        return entries.length;
      },
      async query(q, opts) {
        const w = await getWorker();
        if (w) return w.query(q, opts);
        return engine.query(q, opts);
      },
      addEntries(entries) {
        engine.addEntries(entries);
        void getWorker().then((w) => w?.setEntries(engine._entries));
      }
    };
  }

  // docs/doc-search-entry.mjs
  var CATEGORY_LABELS = {
    docs: "Documentation",
    components: "Components",
    api: "API",
    examples: "Examples"
  };
  function navigateToResult(resolvedHref) {
    if (!resolvedHref) return;
    if (/\.md(?:[#?]|$)/i.test(resolvedHref) && globalThis.VelinDocMd?.open) {
      globalThis.VelinDocMd.open(resolvedHref);
      return;
    }
    let target;
    let current;
    try {
      current = new URL(window.location.href);
      target = new URL(resolvedHref);
    } catch {
      return;
    }
    const samePage = target.origin === current.origin && target.pathname.replace(/\/$/, "") === current.pathname.replace(/\/$/, "");
    if (samePage && target.hash) {
      const id = decodeURIComponent(target.hash.slice(1));
      const el = document.getElementById(id) || document.querySelector(target.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", target.hash);
        return;
      }
    }
    window.location.assign(target.href);
  }
  function initDocSearch() {
    const input = document.getElementById("docSearch");
    if (!input) return;
    const search = createSearch({ worker: false });
    const indexUrl = new URL("search-index.json", getDocsBaseUrl()).href;
    let panel = null;
    let flat = [];
    let active = -1;
    function panelEl() {
      if (panel) return panel;
      panel = document.createElement("div");
      panel.id = "docSearchResults";
      panel.className = "velin-doc-search-results velin-search__results";
      panel.setAttribute("role", "listbox");
      panel.hidden = true;
      input.parentElement.appendChild(panel);
      return panel;
    }
    function hide() {
      const p = panelEl();
      p.hidden = true;
      p.classList.remove("velin-search__results--open");
      input.setAttribute("aria-expanded", "false");
      active = -1;
    }
    function setActive(idx) {
      active = idx;
      panelEl().querySelectorAll(".velin-doc-search-results__item, .velin-search__item").forEach((el, i) => {
        el.classList.toggle("velin-search__item--active", i === idx);
      });
    }
    function render(q, groups = {}) {
      const box = panelEl();
      box.innerHTML = "";
      flat = [];
      let idx = 0;
      for (const [cat, items] of Object.entries(groups || {})) {
        if (!items?.length) continue;
        const label = document.createElement("div");
        label.className = "velin-search__group-label";
        label.textContent = CATEGORY_LABELS[cat] || cat;
        box.appendChild(label);
        for (const item of items) {
          const navHref = resolveDocsSearchUrl(item.url);
          const a = document.createElement("a");
          if (navHref) a.href = navHref;
          a.className = "velin-doc-search-results__item velin-search__item";
          a.setAttribute("role", "option");
          a.innerHTML = `<span class="velin-doc-search-results__title velin-search__title">${highlightHtml(item.title, q)}</span><span class="velin-doc-search-results__meta velin-search__excerpt">${highlightHtml(item.section || item.excerpt || "", q)}</span>`;
          a.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!navHref) return;
              hide();
              navigateToResult(navHref);
            },
            true
          );
          a.addEventListener("mouseenter", () => setActive(idx));
          box.appendChild(a);
          flat.push({ item, navHref });
          idx += 1;
        }
      }
      box.hidden = !flat.length;
      if (flat.length) {
        box.classList.add("velin-search__results--open");
        input.setAttribute("aria-expanded", "true");
      }
    }
    async function run() {
      const q = input.value.trim();
      if (q.length < 2) {
        hide();
        return;
      }
      try {
        const { groups } = await search.query(q, { minChars: 2, fuzzy: 0.2, limit: 12 });
        render(q, groups);
      } catch (err) {
        console.warn("[doc-search] query failed", err);
        hide();
      }
    }
    search.loadIndex(indexUrl).catch((err) => {
      console.warn("[doc-search] index load failed", err);
    });
    input.addEventListener("input", run);
    input.addEventListener("focus", run);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hide();
      if (!flat.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(active < flat.length - 1 ? active + 1 : 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(active > 0 ? active - 1 : flat.length - 1);
      } else if (e.key === "Enter") {
        const row = active >= 0 ? flat[active] : flat[0];
        if (row?.navHref) {
          e.preventDefault();
          hide();
          navigateToResult(row.navHref);
        }
      }
    });
    document.addEventListener("click", (e) => {
      if (!input.parentElement.contains(e.target)) hide();
    });
  }
  initDocSearch();
})();
