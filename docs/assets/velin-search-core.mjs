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
  return {
    id,
    title,
    excerpt: String(e.excerpt || e.section || "").slice(0, 200),
    url: url || `#${id}`,
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

// ../velinstyle/core/search/index.js
var defaultEngine = new VelinSearchEngine();
function parseIndexPayload(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.entries)) return data.entries;
  return [];
}
function createSearch() {
  const engine = new VelinSearchEngine();
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
      return entries.length;
    },
    query(q, opts) {
      return engine.query(q, opts);
    },
    addEntries(entries) {
      engine.addEntries(entries);
    }
  };
}
export {
  createSearch,
  highlightHtml
};
