// components/focus-manager.js
var FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  "summary",
  "details"
].join(", ");
function isFocusable(el) {
  if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
  if (el.closest("[inert]")) return false;
  const style = el.ownerDocument.defaultView?.getComputedStyle(el);
  if (style && (style.visibility === "hidden" || style.display === "none")) return false;
  return el.getClientRects().length > 0;
}
function getFocusableElements(root) {
  return [...root.querySelectorAll(FOCUSABLE_SELECTOR)].filter(isFocusable);
}
function trapFocus(root, event) {
  if (event.key !== "Tab") return;
  const focusable = getFocusableElements(root);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = root.getRootNode().activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
function rovingTabindex(container, items, event) {
  const currentIndex = items.indexOf(event.target);
  if (currentIndex === -1) return;
  let nextIndex;
  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      event.preventDefault();
      nextIndex = (currentIndex + 1) % items.length;
      break;
    case "ArrowUp":
    case "ArrowLeft":
      event.preventDefault();
      nextIndex = (currentIndex - 1 + items.length) % items.length;
      break;
    case "Home":
      event.preventDefault();
      nextIndex = 0;
      break;
    case "End":
      event.preventDefault();
      nextIndex = items.length - 1;
      break;
    default:
      return;
  }
  items.forEach((item, i) => {
    item.setAttribute("tabindex", i === nextIndex ? "0" : "-1");
  });
  items[nextIndex].focus();
}
function saveFocus() {
  return document.activeElement;
}
function restoreFocus(element) {
  if (element && typeof element.focus === "function") {
    element.focus();
  }
}
var _inertSiblings = [];
function setBackgroundInert(except) {
  _inertSiblings = [];
  for (const child of document.body.children) {
    if (child === except || child.contains(except)) continue;
    if (!child.hasAttribute("inert")) {
      child.setAttribute("inert", "");
      _inertSiblings.push(child);
    }
  }
}
function clearBackgroundInert() {
  for (const el of _inertSiblings) {
    el.removeAttribute("inert");
  }
  _inertSiblings = [];
}

// components/sanitize.js
var ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ESCAPE_RE = /[&<>"']/g;
function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str.replace(ESCAPE_RE, (ch) => ESCAPE_MAP[ch]);
}
function sanitizeURL(url) {
  if (typeof url !== "string") return "";
  try {
    const parsed = new URL(url, location.href);
    if (["http:", "https:", "data:"].includes(parsed.protocol)) return url;
    return "";
  } catch {
    return "";
  }
}

// components/velin-modal.js
var styles = `
  :host {
    display: contents;
  }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: var(--velin-z-modal, 500);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--velin-space-4, 1rem);
    background: var(--velin-color-overlay, rgba(0,0,0,0.4));
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease, visibility 200ms ease;
  }
  :host([open]) .overlay {
    opacity: 1;
    visibility: visible;
  }
  .dialog {
    position: relative;
    inline-size: min(90vw, 32rem);
    max-block-size: 85vh;
    background: var(--velin-color-surface-bright, #fff);
    border-radius: var(--velin-radius-lg, 0.75rem);
    box-shadow: var(--velin-shadow-xl, 0 20px 25px rgba(0,0,0,0.1));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform: scale(0.95) translateY(1rem);
    transition: transform 200ms ease;
  }
  :host([open]) .dialog {
    transform: scale(1) translateY(0);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--velin-space-4, 1rem) var(--velin-space-6, 1.5rem);
    border-bottom: 1px solid var(--velin-color-border, #ddd);
  }
  .title {
    font-size: var(--velin-text-lg, 1.25rem);
    font-weight: var(--velin-weight-semibold, 600);
    margin: 0;
  }
  .close-btn {
    min-width: 2.75rem;
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: var(--velin-radius-md, 0.5rem);
    cursor: pointer;
    color: var(--velin-color-text-muted, #666);
    font-size: 1.5rem;
    line-height: 1;
  }
  .close-btn:hover {
    background: var(--velin-color-surface-dim, #eee);
    color: var(--velin-color-text, #111);
  }
  .body {
    padding: var(--velin-space-6, 1.5rem);
    overflow-y: auto;
    flex-grow: 1;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--velin-space-3, 0.75rem);
    padding: var(--velin-space-4, 1rem) var(--velin-space-6, 1.5rem);
    border-top: 1px solid var(--velin-color-border, #ddd);
  }
  @media (prefers-reduced-motion: reduce) {
    .overlay, .dialog { transition: none; }
  }
`;
var VelinModal = class extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open", delegatesFocus: true });
    this._previouslyFocused = null;
    this._onKeydown = this._onKeydown.bind(this);
  }
  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const safeTitle = escapeHTML(title);
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="overlay" part="overlay">
        <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="velin-modal-title" part="dialog">
          <div class="header" part="header">
            <h2 class="title" id="velin-modal-title">${safeTitle}</h2>
            <button class="close-btn" aria-label="Close" part="close">&#215;</button>
          </div>
          <div class="body" part="body"><slot></slot></div>
          <div class="footer" part="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;
    this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => this.close());
    this.shadowRoot.querySelector(".overlay").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) this.close();
    });
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "open") {
      if (newVal !== null) {
        this._open();
      } else {
        this._close();
      }
    }
  }
  open() {
    this.setAttribute("open", "");
  }
  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true }));
  }
  _open() {
    this._previouslyFocused = saveFocus();
    setBackgroundInert(this);
    document.addEventListener("keydown", this._onKeydown);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const focusable = getFocusableElements(this.shadowRoot);
      if (focusable.length > 0) focusable[0].focus();
    });
  }
  _close() {
    document.removeEventListener("keydown", this._onKeydown);
    document.body.style.overflow = "";
    clearBackgroundInert();
    restoreFocus(this._previouslyFocused);
  }
  _onKeydown(event) {
    if (event.key === "Escape") {
      this.close();
      return;
    }
    trapFocus(this.shadowRoot, event);
  }
  disconnectedCallback() {
    document.removeEventListener("keydown", this._onKeydown);
    document.body.style.overflow = "";
  }
};
customElements.define("velin-modal", VelinModal);
var velin_modal_default = VelinModal;

// components/velin-dropdown.js
var styles2 = `
  :host {
    display: inline-block;
    position: relative;
  }
  .menu {
    position: absolute;
    z-index: var(--velin-z-dropdown, 100);
    inset-block-start: 100%;
    inset-inline-start: 0;
    min-inline-size: 12rem;
    padding-block: var(--velin-space-1, 0.25rem);
    background: var(--velin-color-surface-bright, #fff);
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    box-shadow: var(--velin-shadow-lg, 0 10px 15px rgba(0,0,0,0.08));
    opacity: 0;
    visibility: hidden;
    transform: translateY(-0.25rem);
    transition: opacity 150ms ease, transform 150ms ease, visibility 150ms ease;
  }
  :host([open]) .menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .menu-end {
    inset-inline-start: auto;
    inset-inline-end: 0;
  }
  ::slotted([role="menuitem"]),
  ::slotted(a),
  ::slotted(button) {
    display: flex;
    align-items: center;
    gap: var(--velin-space-2, 0.5rem);
    inline-size: 100%;
    padding: var(--velin-space-2, 0.5rem) var(--velin-space-4, 1rem);
    min-block-size: 2.5rem;
    font-size: var(--velin-text-base, 1rem);
    color: var(--velin-color-text, #111);
    background: none;
    border: none;
    text-align: start;
    cursor: pointer;
    text-decoration: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .menu { transition: none; }
  }
`;
var VelinDropdown = class extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open", delegatesFocus: true });
    this._onDocClick = this._onDocClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._typeahead = "";
    this._typeaheadTimer = null;
  }
  connectedCallback() {
    const align = this.getAttribute("align") || "start";
    this.shadowRoot.innerHTML = `
      <style>${styles2}</style>
      <slot name="trigger"></slot>
      <div class="menu ${align === "end" ? "menu-end" : ""}" role="menu" part="menu">
        <slot></slot>
      </div>
    `;
    const triggerSlot = this.shadowRoot.querySelector('slot[name="trigger"]');
    const menuSlot = this.shadowRoot.querySelector("slot:not([name])");
    triggerSlot.addEventListener("click", () => this.toggle());
    triggerSlot.addEventListener("slotchange", () => {
      const trigger = triggerSlot.assignedElements()[0];
      if (trigger) {
        trigger.setAttribute("aria-haspopup", "menu");
        trigger.setAttribute("aria-expanded", this.hasAttribute("open") ? "true" : "false");
        const menuId = this._menuId || (this._menuId = `velin-dropdown-menu-${Math.random().toString(36).slice(2, 9)}`);
        trigger.setAttribute("aria-controls", menuId);
        this.shadowRoot.querySelector(".menu")?.setAttribute("id", menuId);
      }
    });
    menuSlot?.addEventListener("slotchange", () => this._normalizeMenuItems());
    this._normalizeMenuItems();
    this.addEventListener("keydown", this._onKeydown);
  }
  _normalizeMenuItems() {
    const items = this._getMenuItems();
    items.forEach((el, i) => {
      if (!el.hasAttribute("role")) el.setAttribute("role", "menuitem");
      el.setAttribute("tabindex", i === 0 ? "0" : "-1");
    });
  }
  toggle() {
    if (this.hasAttribute("open")) {
      this.close();
    } else {
      this.open();
    }
  }
  open() {
    this.setAttribute("open", "");
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    document.addEventListener("click", this._onDocClick, true);
    requestAnimationFrame(() => {
      const items = this._getMenuItems();
      if (items.length > 0) {
        items[0].focus();
      }
    });
  }
  close() {
    this.removeAttribute("open");
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", this._onDocClick, true);
    this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true }));
  }
  _getMenuItems() {
    const slot = this.shadowRoot.querySelector("slot:not([name])");
    return slot ? slot.assignedElements().filter((el) => !el.hasAttribute("disabled")) : [];
  }
  _onDocClick(event) {
    if (!this.contains(event.target)) {
      this.close();
    }
  }
  _onKeydown(event) {
    if (event.key === "Escape") {
      this.close();
      const trigger = this.querySelector('[slot="trigger"]');
      if (trigger) trigger.focus();
      return;
    }
    const items = this._getMenuItems();
    if (items.length === 0) return;
    if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) {
      clearTimeout(this._typeaheadTimer);
      this._typeahead += event.key.toLowerCase();
      this._typeaheadTimer = setTimeout(() => {
        this._typeahead = "";
      }, 500);
      const match = items.find(
        (el) => (el.textContent?.trim().toLowerCase() || "").startsWith(this._typeahead)
      );
      if (match) {
        event.preventDefault();
        items.forEach((item) => item.setAttribute("tabindex", item === match ? "0" : "-1"));
        match.focus();
      }
      return;
    }
    rovingTabindex(this, items, event);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._onDocClick, true);
  }
};
customElements.define("velin-dropdown", VelinDropdown);
var velin_dropdown_default = VelinDropdown;

// components/velin-accordion.js
var styles3 = `
  :host {
    display: block;
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    overflow: hidden;
  }
  ::slotted(details) {
    border-bottom: 1px solid var(--velin-color-border, #ddd);
  }
  ::slotted(details:last-child) {
    border-bottom: none;
  }
  ::slotted(details > summary) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--velin-space-4, 1rem);
    min-block-size: 2.75rem;
    font-size: var(--velin-text-base, 1rem);
    font-weight: var(--velin-weight-medium, 500);
    cursor: pointer;
    user-select: none;
    list-style: none;
  }
  ::slotted(details > summary::-webkit-details-marker) {
    display: none;
  }
`;
var VelinAccordion = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._onToggle = this._onToggle.bind(this);
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles3}</style>
      <slot></slot>
    `;
    this._exclusive = this.hasAttribute("exclusive");
    this._wireDetails();
    this.addEventListener("toggle", this._onToggle, true);
    this.addEventListener("keydown", this._onKeydown.bind(this));
  }
  _wireDetails() {
    let panelIndex = 0;
    for (const details of this.querySelectorAll("details")) {
      const summary = details.querySelector("summary");
      const panel = details.querySelector(":scope > :not(summary)");
      const panelId = panel?.id || `velin-accordion-panel-${++panelIndex}`;
      if (panel && !panel.id) panel.id = panelId;
      if (summary && panel) {
        summary.setAttribute("aria-controls", panelId);
      }
    }
  }
  _onToggle(event) {
    if (!this._exclusive) return;
    const openedDetail = event.target;
    if (!openedDetail.open) return;
    const details = [...this.querySelectorAll("details")];
    details.forEach((d) => {
      if (d !== openedDetail && d.open) {
        d.open = false;
      }
    });
  }
  _onKeydown(event) {
    const summaries = [...this.querySelectorAll("summary")];
    const currentIndex = summaries.indexOf(event.target);
    if (currentIndex === -1) return;
    let nextIndex;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        nextIndex = (currentIndex + 1) % summaries.length;
        break;
      case "ArrowUp":
        event.preventDefault();
        nextIndex = (currentIndex - 1 + summaries.length) % summaries.length;
        break;
      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        event.preventDefault();
        nextIndex = summaries.length - 1;
        break;
      default:
        return;
    }
    summaries[nextIndex].focus();
  }
  disconnectedCallback() {
    this.removeEventListener("toggle", this._onToggle, true);
  }
};
customElements.define("velin-accordion", VelinAccordion);
var velin_accordion_default = VelinAccordion;

// components/velin-tabs.js
var styles4 = `
  :host {
    display: block;
  }
  .tablist {
    display: flex;
    gap: var(--velin-space-1, 0.25rem);
    border-bottom: 2px solid var(--velin-color-border, #ddd);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  ::slotted([role="tab"]) {
    display: inline-flex;
    align-items: center;
    gap: var(--velin-space-2, 0.5rem);
    padding: var(--velin-space-3, 0.75rem) var(--velin-space-4, 1rem);
    min-block-size: 2.75rem;
    font-size: var(--velin-text-base, 1rem);
    font-weight: var(--velin-weight-medium, 500);
    color: var(--velin-color-text-muted, #666);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    cursor: pointer;
    white-space: nowrap;
    transition: color 150ms ease, border-color 150ms ease;
  }
  ::slotted([role="tab"][aria-selected="true"]) {
    color: var(--velin-color-primary, #2563eb);
    border-bottom-color: var(--velin-color-primary, #2563eb);
    font-weight: var(--velin-weight-semibold, 600);
  }
  ::slotted([role="tab"]:hover) {
    color: var(--velin-color-text, #111);
  }
  .panels {
    padding-block-start: var(--velin-space-4, 1rem);
  }
  ::slotted([role="tabpanel"][hidden]) {
    display: none;
  }
`;
var VelinTabs = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open", delegatesFocus: true });
    this._onTabClick = this._onTabClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles4}</style>
      <div class="tablist" role="tablist" part="tablist">
        <slot name="tab"></slot>
      </div>
      <div class="panels" part="panels">
        <slot name="panel"></slot>
      </div>
    `;
    this.addEventListener("click", this._onTabClick);
    this.addEventListener("keydown", this._onKeydown);
    requestAnimationFrame(() => this._initTabs());
  }
  _initTabs() {
    const tabs = this._getTabs();
    const panels = this._getPanels();
    tabs.forEach((tab, i) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("slot", "tab");
      if (!tab.id) tab.id = `velin-tab-${i}`;
      const panel = panels[i];
      if (panel) {
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("slot", "panel");
        if (!panel.id) panel.id = `velin-panel-${i}`;
        tab.setAttribute("aria-controls", panel.id);
        panel.setAttribute("aria-labelledby", tab.id);
      }
    });
    const selectedTab = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    if (selectedTab) this._selectTab(selectedTab);
  }
  _getTabs() {
    return [...this.querySelectorAll('[role="tab"], [slot="tab"]')];
  }
  _getPanels() {
    return [...this.querySelectorAll('[role="tabpanel"], [slot="panel"]')];
  }
  _onTabClick(event) {
    const tab = event.target.closest('[role="tab"]');
    if (tab && this.contains(tab)) {
      this._selectTab(tab);
    }
  }
  _selectTab(selectedTab) {
    const tabs = this._getTabs();
    const panels = this._getPanels();
    tabs.forEach((tab, i) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.setAttribute("tabindex", isSelected ? "0" : "-1");
      if (panels[i]) {
        panels[i].hidden = !isSelected;
      }
    });
    this.dispatchEvent(
      new CustomEvent("velin-tab-change", {
        bubbles: true,
        detail: { tab: selectedTab }
      })
    );
  }
  _onKeydown(event) {
    const tabs = this._getTabs();
    if (tabs.includes(event.target)) {
      rovingTabindex(this, tabs, event);
      if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") {
        const focused = tabs.find((t) => t.getAttribute("tabindex") === "0");
        if (focused) this._selectTab(focused);
      }
    }
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._onTabClick);
    this.removeEventListener("keydown", this._onKeydown);
  }
};
customElements.define("velin-tabs", VelinTabs);
var velin_tabs_default = VelinTabs;

// components/velin-toast.js
var styles5 = `
  :host {
    position: fixed;
    z-index: var(--velin-z-toast, 600);
    inset-block-end: var(--velin-space-4, 1rem);
    inset-inline-end: var(--velin-space-4, 1rem);
    display: flex;
    flex-direction: column-reverse;
    gap: var(--velin-space-2, 0.5rem);
    pointer-events: none;
    max-inline-size: min(24rem, calc(100vw - 2rem));
  }
  .toast {
    display: flex;
    align-items: flex-start;
    gap: var(--velin-space-3, 0.75rem);
    padding: var(--velin-space-3, 0.75rem) var(--velin-space-4, 1rem);
    background: var(--velin-color-surface-bright, #fff);
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    box-shadow: var(--velin-shadow-lg, 0 10px 15px rgba(0,0,0,0.08));
    pointer-events: auto;
    animation: velin-toast-in 200ms ease forwards;
    font-size: var(--velin-text-base, 1rem);
    color: var(--velin-color-text, #111);
  }
  .toast--success { border-inline-start: 4px solid var(--velin-color-success, #16a34a); }
  .toast--warning { border-inline-start: 4px solid var(--velin-color-warning, #ca8a04); }
  .toast--danger { border-inline-start: 4px solid var(--velin-color-danger, #dc2626); }
  .toast--info { border-inline-start: 4px solid var(--velin-color-info, #2563eb); }
  .toast-content { flex: 1; }
  .toast-close {
    min-width: 2rem;
    min-height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--velin-color-text-muted, #666);
    border-radius: var(--velin-radius-sm, 0.25rem);
    font-size: 1.25rem;
    line-height: 1;
  }
  .toast-close:hover {
    background: var(--velin-color-surface-dim, #eee);
  }
  .toast--out {
    animation: velin-toast-out 200ms ease forwards;
  }
  @keyframes velin-toast-in {
    from { opacity: 0; transform: translateX(1rem); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes velin-toast-out {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(1rem); }
  }
  @media (prefers-reduced-motion: reduce) {
    .toast, .toast--out { animation: none; }
  }
`;
var VelinToast = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._container = null;
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `<style>${styles5}</style>`;
    this._container = this.shadowRoot;
    this.setAttribute("role", "status");
    this.setAttribute("aria-live", "polite");
    this.setAttribute("aria-atomic", "true");
  }
  show({ message, type = "info", duration = 5e3 } = {}) {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast-content">${escapeHTML(message)}</div>
      <button class="toast-close" aria-label="Close">&#215;</button>
    `;
    toast.querySelector(".toast-close").addEventListener("click", () => {
      this._dismiss(toast);
    });
    this._container.appendChild(toast);
    if (duration > 0) {
      setTimeout(() => this._dismiss(toast), duration);
    }
    return toast;
  }
  _dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add("toast--out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 300);
  }
};
customElements.define("velin-toast", VelinToast);
var velin_toast_default = VelinToast;

// components/velin-icon.js
var PROVIDER_CDNS = {
  lucide: "https://unpkg.com/lucide-static@latest/icons/{name}.svg",
  heroicons: "https://unpkg.com/heroicons@2/24/outline/{name}.svg",
  bootstrap: "https://unpkg.com/bootstrap-icons@latest/icons/{name}.svg",
  material: "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/{name}/default/24px.svg",
  fontawesome: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/regular/{name}.svg"
};
var _svgCache = /* @__PURE__ */ new Map();
var VelinIcon = class extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size", "label", "provider", "sprite"];
  }
  constructor() {
    super();
    this._rendered = false;
  }
  connectedCallback() {
    this._render();
  }
  attributeChangedCallback() {
    if (this._rendered) this._render();
  }
  _render() {
    const name = this.getAttribute("name");
    const size = this.getAttribute("size") || "24";
    const label = this.getAttribute("label");
    const provider = this.getAttribute("provider");
    if (!name) {
      this.innerHTML = "";
      return;
    }
    if (provider && PROVIDER_CDNS[provider]) {
      this._renderFromCDN(name, size, label, provider);
      return;
    }
    this._renderFromSprite(name, size, label);
  }
  _renderFromSprite(name, size, label) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    this._applyStyle(svg);
    this._applyA11y(svg, label);
    const use = document.createElementNS(svgNS, "use");
    const spriteUrl = this.getAttribute("sprite") || "velin-icons.svg";
    use.setAttribute("href", `${spriteUrl}#${name}`);
    svg.appendChild(use);
    this.innerHTML = "";
    this.appendChild(svg);
    this._rendered = true;
  }
  async _renderFromCDN(name, size, label, provider) {
    const cacheKey = `${provider}:${name}`;
    if (_svgCache.has(cacheKey)) {
      this._injectSVG(_svgCache.get(cacheKey), size, label);
      return;
    }
    const url = PROVIDER_CDNS[provider].replace("{name}", name);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      const text = await res.text();
      if (!text.includes("<svg")) throw new Error("Not SVG");
      _svgCache.set(cacheKey, text);
      this._injectSVG(text, size, label);
    } catch {
      this._renderFromSprite(name, size, label);
    }
  }
  _injectSVG(svgText, size, label) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) {
      this.innerHTML = "";
      return;
    }
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    if (!svg.getAttribute("viewBox")) svg.setAttribute("viewBox", "0 0 24 24");
    this._applyStyle(svg);
    this._applyA11y(svg, label);
    this.innerHTML = "";
    this.appendChild(document.importNode(svg, true));
    this._rendered = true;
  }
  _applyStyle(svg) {
    svg.style.display = "inline-block";
    svg.style.verticalAlign = "middle";
    svg.style.flexShrink = "0";
  }
  _applyA11y(svg, label) {
    if (label) {
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", label);
    } else {
      svg.setAttribute("aria-hidden", "true");
    }
  }
  static get providers() {
    return Object.keys(PROVIDER_CDNS);
  }
  static registerProvider(name, urlTemplate) {
    PROVIDER_CDNS[name] = urlTemplate;
  }
};
customElements.define("velin-icon", VelinIcon);
var velin_icon_default = VelinIcon;

// components/velin-drawer.js
var styles6 = `
  :host { display: contents; }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: var(--velin-z-overlay, 400);
    background: var(--velin-color-overlay, rgba(0,0,0,0.4));
    opacity: 0;
    visibility: hidden;
    transition: opacity 200ms ease, visibility 200ms ease;
  }
  :host([open]) .overlay { opacity: 1; visibility: visible; }
  .drawer {
    position: fixed;
    z-index: var(--velin-z-modal, 500);
    background: var(--velin-color-surface-bright, #fff);
    box-shadow: var(--velin-shadow-xl, 0 20px 25px rgba(0,0,0,0.1));
    display: flex;
    flex-direction: column;
    transition: transform 250ms ease;
    overflow: hidden;
  }
  /* Side positioning -- default = start */
  .drawer { inset-block: 0; inset-inline-start: 0; inset-inline-end: auto; inline-size: min(20rem, 85vw); transform: translateX(-100%); }
  :host([open]) .drawer, :host([open][side="start"]) .drawer { transform: translateX(0); }
  :host([side="end"]) .drawer { inset-inline-start: auto; inset-inline-end: 0; transform: translateX(100%); }
  :host([open][side="end"]) .drawer { transform: translateX(0); }
  :host([side="top"]) .drawer { inset-inline: 0; inset-inline-start: 0; inset-block-start: 0; inset-block-end: auto; block-size: min(50vh, 24rem); inline-size: 100%; transform: translateY(-100%); }
  :host([open][side="top"]) .drawer { transform: translateY(0); }
  :host([side="bottom"]) .drawer { inset-inline: 0; inset-inline-start: 0; inset-block-start: auto; inset-block-end: 0; block-size: min(50vh, 24rem); inline-size: 100%; transform: translateY(100%); }
  :host([open][side="bottom"]) .drawer { transform: translateY(0); }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--velin-space-4, 1rem) var(--velin-space-5, 1.25rem);
    border-bottom: 1px solid var(--velin-color-border, #ddd);
  }
  .title { font-size: var(--velin-text-lg, 1.25rem); font-weight: var(--velin-weight-semibold, 600); margin: 0; }
  .close-btn {
    min-width: 2.75rem; min-height: 2.75rem; display: inline-flex; align-items: center; justify-content: center;
    background: none; border: none; border-radius: var(--velin-radius-md, 0.5rem); cursor: pointer;
    color: var(--velin-color-text-muted, #666); font-size: 1.5rem; line-height: 1;
  }
  .close-btn:hover { background: var(--velin-color-surface-dim, #eee); color: var(--velin-color-text, #111); }
  .body { flex: 1; padding: var(--velin-space-5, 1.25rem); overflow-y: auto; }
  @media (prefers-reduced-motion: reduce) { .overlay, .drawer { transition: none; } }
`;
var VelinDrawer = class extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open", delegatesFocus: true });
    this._prev = null;
    this._onKey = this._onKey.bind(this);
  }
  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const safeTitle = escapeHTML(title);
    const titleId = "velin-drawer-title";
    this.shadowRoot.innerHTML = `
      <style>${styles6}</style>
      <div class="overlay" part="overlay"></div>
      <div class="drawer" role="dialog" aria-modal="true" aria-labelledby="${titleId}" part="drawer">
        <div class="header" part="header">
          <h2 class="title" id="${titleId}">${safeTitle}</h2>
          <button class="close-btn" aria-label="Close" part="close">&#215;</button>
        </div>
        <div class="body" part="body"><slot></slot></div>
      </div>
    `;
    this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => this.close());
    this.shadowRoot.querySelector(".overlay").addEventListener("click", () => this.close());
  }
  attributeChangedCallback(name) {
    if (name === "open") this.hasAttribute("open") ? this._open() : this._close();
  }
  open() {
    this.setAttribute("open", "");
  }
  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true }));
  }
  _open() {
    this._prev = saveFocus();
    setBackgroundInert(this);
    document.addEventListener("keydown", this._onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const f = getFocusableElements(this.shadowRoot);
      if (f.length) f[0].focus();
    });
  }
  _close() {
    document.removeEventListener("keydown", this._onKey);
    document.body.style.overflow = "";
    clearBackgroundInert();
    restoreFocus(this._prev);
  }
  _onKey(e) {
    if (e.key === "Escape") {
      this.close();
      return;
    }
    trapFocus(this.shadowRoot, e);
  }
  disconnectedCallback() {
    document.removeEventListener("keydown", this._onKey);
    document.body.style.overflow = "";
  }
};
customElements.define("velin-drawer", VelinDrawer);
var velin_drawer_default = VelinDrawer;

// components/velin-theme-toggle.js
var styles7 = `
  :host { display: inline-flex; }
  button {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 2.75rem; min-height: 2.75rem; padding: 0.5rem;
    background: none; border: 2px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem); cursor: pointer;
    color: var(--velin-color-text, #111); transition: background 150ms ease, border-color 150ms ease;
  }
  button:hover { background: var(--velin-color-surface-dim, #eee); border-color: var(--velin-color-border-strong, #999); }
  button:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  svg { width: 1.25rem; height: 1.25rem; transition: transform 300ms ease; }
  :host([theme="dark"]) .sun { display: none; }
  :host(:not([theme="dark"])) .moon { display: none; }
  @media (prefers-reduced-motion: reduce) { svg { transition: none; } }
`;
var VelinThemeToggle = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles7}</style>
      <button part="button" aria-label="Toggle dark mode">
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>
    `;
    const target = this.getAttribute("target") || "html";
    const el = document.querySelector(target);
    const stored = localStorage.getItem("velin-theme");
    const prefersDarkMq = window.matchMedia("(prefers-color-scheme: dark)");
    const applyFromPreference = () => {
      if (localStorage.getItem("velin-theme")) return;
      if (prefersDarkMq.matches) {
        el?.setAttribute("data-velin-theme", "dark");
        this.setAttribute("theme", "dark");
      } else {
        el?.removeAttribute("data-velin-theme");
        this.removeAttribute("theme");
      }
    };
    const prefersDark = prefersDarkMq.matches;
    if (stored === "dark" || !stored && prefersDark) {
      el?.setAttribute("data-velin-theme", "dark");
      this.setAttribute("theme", "dark");
    }
    prefersDarkMq.addEventListener("change", applyFromPreference);
    window.addEventListener("storage", (e) => {
      if (e.key !== "velin-theme" || !el) return;
      if (e.newValue === "dark") {
        el.setAttribute("data-velin-theme", "dark");
        this.setAttribute("theme", "dark");
      } else {
        el.removeAttribute("data-velin-theme");
        this.removeAttribute("theme");
      }
    });
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      const isDark = el?.getAttribute("data-velin-theme") === "dark";
      if (isDark) {
        el?.removeAttribute("data-velin-theme");
        this.removeAttribute("theme");
        localStorage.setItem("velin-theme", "light");
      } else {
        el?.setAttribute("data-velin-theme", "dark");
        this.setAttribute("theme", "dark");
        localStorage.setItem("velin-theme", "dark");
      }
      this.dispatchEvent(new CustomEvent("velin-theme-change", { bubbles: true, detail: { theme: isDark ? "light" : "dark", dark: !isDark } }));
    });
  }
};
customElements.define("velin-theme-toggle", VelinThemeToggle);
var velin_theme_toggle_default = VelinThemeToggle;

// components/velin-popover.js
var styles8 = `
  :host { position: relative; display: inline-block; }
  .popover {
    position: absolute; z-index: var(--velin-z-dropdown, 200);
    background: var(--velin-color-surface-bright, #fff);
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-lg, 0.75rem);
    box-shadow: var(--velin-shadow-lg, 0 10px 15px rgba(0,0,0,0.08));
    padding: var(--velin-space-4, 1rem);
    min-inline-size: 12rem; max-inline-size: 20rem;
    opacity: 0; visibility: hidden;
    transition: opacity 150ms ease, visibility 150ms ease;
  }
  :host([open]) .popover { opacity: 1; visibility: visible; }
  .popover--top { inset-block-end: calc(100% + 0.5rem); inset-inline-start: 50%; transform: translateX(-50%); }
  .popover--bottom { inset-block-start: calc(100% + 0.5rem); inset-inline-start: 50%; transform: translateX(-50%); }
  .popover--start { inset-inline-end: calc(100% + 0.5rem); inset-block-start: 50%; transform: translateY(-50%); }
  .popover--end { inset-inline-start: calc(100% + 0.5rem); inset-block-start: 50%; transform: translateY(-50%); }
  .popover__title {
    font-size: var(--velin-text-sm, 0.875rem); font-weight: var(--velin-weight-semibold, 600);
    margin-block-end: var(--velin-space-2, 0.5rem);
    padding-block-end: var(--velin-space-2, 0.5rem);
    border-bottom: 1px solid var(--velin-color-border, #ddd);
  }
  @media (prefers-reduced-motion: reduce) { .popover { transition: none; } }
`;
var popoverId = 0;
var VelinPopover = class extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._popoverId = `velin-popover-${++popoverId}`;
    this._onOutside = this._onOutside.bind(this);
    this._onKey = this._onKey.bind(this);
    this._prevFocus = null;
    this._isDialog = false;
  }
  connectedCallback() {
    const placement = this.getAttribute("placement") || "bottom";
    const triggerType = this.getAttribute("trigger") || "click";
    const title = this.getAttribute("title") || "";
    const role = triggerType === "hover" ? "tooltip" : "dialog";
    this._isDialog = role === "dialog";
    this.shadowRoot.innerHTML = `
      <style>${styles8}</style>
      <slot name="trigger"></slot>
      <div class="popover popover--${placement}" id="${this._popoverId}" role="${role}" part="popover">
        ${title ? `<div class="popover__title" part="title">${escapeHTML(title)}</div>` : ""}
        <slot></slot>
      </div>
    `;
    const triggerSlot = this.shadowRoot.querySelector('slot[name="trigger"]');
    triggerSlot.addEventListener("slotchange", () => this._wireTrigger(triggerType));
    this._wireTrigger(triggerType);
  }
  _wireTrigger(triggerType) {
    const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
    if (!trigger) return;
    const isHover = triggerType === "hover";
    trigger.setAttribute("aria-haspopup", isHover ? "true" : "dialog");
    trigger.setAttribute("aria-expanded", this.hasAttribute("open") ? "true" : "false");
    if (this._isDialog) {
      trigger.setAttribute("aria-controls", this._popoverId);
    }
    if (triggerType === "click") {
      trigger.onclick = () => this.toggle();
    } else if (triggerType === "hover") {
      this.onmouseenter = () => this.open();
      this.onmouseleave = () => this.close();
      this.onfocusin = () => this.open();
      this.onfocusout = (e) => {
        if (!this.contains(e.relatedTarget)) this.close();
      };
    } else if (triggerType === "focus") {
      trigger.onfocusin = () => this.open();
      trigger.onfocusout = () => this.close();
    }
  }
  open() {
    this.setAttribute("open", "");
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    document.addEventListener("click", this._onOutside, true);
    document.addEventListener("keydown", this._onKey);
    if (this._isDialog) {
      this._prevFocus = saveFocus();
      requestAnimationFrame(() => {
        const focusable = getFocusableElements(this.shadowRoot.querySelector(".popover"));
        if (focusable.length) focusable[0].focus();
        else this.shadowRoot.querySelector(".popover")?.focus();
      });
    }
  }
  close() {
    this.removeAttribute("open");
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", this._onOutside, true);
    document.removeEventListener("keydown", this._onKey);
    if (this._isDialog && this._prevFocus) {
      restoreFocus(this._prevFocus);
      this._prevFocus = null;
    }
  }
  toggle() {
    this.hasAttribute("open") ? this.close() : this.open();
  }
  _onOutside(e) {
    if (!this.contains(e.target)) this.close();
  }
  _onKey(e) {
    if (e.key === "Escape") {
      this.close();
      const trigger = this.querySelector('[slot="trigger"]');
      if (trigger) trigger.focus();
      return;
    }
    if (this._isDialog && this.hasAttribute("open")) {
      trapFocus(this.shadowRoot.querySelector(".popover"), e);
    }
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._onOutside, true);
    document.removeEventListener("keydown", this._onKey);
  }
};
customElements.define("velin-popover", VelinPopover);
var velin_popover_default = VelinPopover;

// components/velin-copy.js
var styles9 = `
  :host { display: inline-flex; }
  button {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.375rem;
    min-width: 2.75rem; min-height: 2.75rem; padding: 0.375rem 0.625rem;
    background: var(--velin-color-surface-dim, #f0f0f0);
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem); cursor: pointer;
    color: var(--velin-color-text-muted, #666);
    font-size: var(--velin-text-sm, 0.875rem);
    transition: background 150ms ease, color 150ms ease;
  }
  button:hover { background: var(--velin-color-surface, #e0e0e0); color: var(--velin-color-text, #111); }
  button:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  button[data-copied] { color: var(--velin-color-success, #16a34a); border-color: var(--velin-color-success, #16a34a); }
  svg { width: 1rem; height: 1rem; flex-shrink: 0; }
  .check { display: none; }
  button[data-copied] .copy-icon { display: none; }
  button[data-copied] .check { display: block; }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
`;
var VelinCopy = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const label = this.getAttribute("label") || "";
    this.shadowRoot.innerHTML = `
      <style>${styles9}</style>
      <button part="button" aria-label="Copy">
        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
        <svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ${label ? `<span>${label}</span>` : ""}
      </button>
    `;
    this.shadowRoot.querySelector("button").addEventListener("click", () => this._copy());
  }
  async _copy() {
    const value = this.getAttribute("value") || "";
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const btn = this.shadowRoot.querySelector("button");
    btn.setAttribute("data-copied", "");
    btn.setAttribute("aria-label", "Copied");
    this.dispatchEvent(new CustomEvent("velin-copied", { bubbles: true, detail: { value } }));
    setTimeout(() => {
      btn.removeAttribute("data-copied");
      btn.setAttribute("aria-label", "Copy");
    }, 2e3);
  }
};
customElements.define("velin-copy", VelinCopy);
var velin_copy_default = VelinCopy;

// components/velin-scroll-top.js
var styles10 = `
  :host { position: fixed; inset-block-end: var(--velin-scroll-top-bottom, var(--velin-space-4, 1rem)); inset-inline-end: var(--velin-scroll-top-end, var(--velin-space-4, 1rem)); z-index: var(--velin-z-fixed, 300); }
  button {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 2.75rem; min-height: 2.75rem; padding: 0.625rem;
    background: var(--velin-color-primary, #2563eb); color: var(--velin-color-on-primary, #fff);
    border: none; border-radius: var(--velin-radius-full, 50%);
    cursor: pointer; box-shadow: var(--velin-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
    opacity: 0; visibility: hidden; transform: translateY(0.5rem);
    transition: opacity 200ms ease, visibility 200ms ease, transform 200ms ease, background 150ms ease;
  }
  button:hover { background: var(--velin-color-primary-hover, #1d4ed8); }
  button:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  :host([visible]) button { opacity: 1; visibility: visible; transform: translateY(0); }
  svg { width: 1.25rem; height: 1.25rem; }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
`;
var VelinScrollTop = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._onScroll = this._onScroll.bind(this);
  }
  connectedCallback() {
    const threshold = parseInt(this.getAttribute("threshold") || "300", 10);
    this._threshold = threshold;
    this.shadowRoot.innerHTML = `
      <style>${styles10}</style>
      <button part="button" aria-label="Scroll to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
        </svg>
      </button>
    `;
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", this._onScroll, { passive: true });
    this._onScroll();
  }
  _onScroll() {
    if (window.scrollY > this._threshold) {
      this.setAttribute("visible", "");
    } else {
      this.removeAttribute("visible");
    }
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", this._onScroll);
  }
};
customElements.define("velin-scroll-top", VelinScrollTop);
var velin_scroll_top_default = VelinScrollTop;

// components/velin-carousel.js
var styles11 = `
  :host { display: block; position: relative; overflow: hidden; }
  .track {
    display: flex; transition: transform 400ms ease;
    touch-action: pan-y pinch-zoom;
  }
  ::slotted(*) {
    flex: 0 0 100%; min-width: 0;
  }
  .controls {
    position: absolute; inset: 0; display: flex;
    align-items: center; justify-content: space-between;
    pointer-events: none; padding-inline: var(--velin-space-2, 0.5rem);
  }
  button {
    pointer-events: auto; display: inline-flex; align-items: center; justify-content: center;
    min-width: 2.75rem; min-height: 2.75rem; padding: 0.5rem;
    background: var(--velin-color-surface-bright, #fff); color: var(--velin-color-text, #111);
    border: 1px solid var(--velin-color-border, #ddd); border-radius: var(--velin-radius-full, 50%);
    cursor: pointer; box-shadow: var(--velin-shadow-md, 0 4px 6px rgba(0,0,0,0.07));
    opacity: 0.9; transition: opacity 150ms ease;
  }
  button:hover { opacity: 1; }
  button:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  button:disabled { opacity: 0.3; cursor: not-allowed; }
  svg { width: 1.25rem; height: 1.25rem; }
  .indicators {
    display: flex; justify-content: center; align-items: center; gap: var(--velin-space-2, 0.5rem);
    padding-block: var(--velin-space-3, 0.75rem);
  }
  .pause-btn {
    font-size: var(--velin-text-xs, 0.75rem);
    padding-inline: var(--velin-space-3, 0.75rem);
    min-inline-size: auto;
    border-radius: var(--velin-radius-md, 0.375rem);
  }
  .dot {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 2.75rem; min-height: 2.75rem;
    background: none; border: none; padding: 0; cursor: pointer;
    border-radius: var(--velin-radius-full, 50%);
  }
  .dot::before {
    content: ""; display: block;
    width: 0.5rem; height: 0.5rem; border-radius: 50%;
    background: var(--velin-color-border, #ccc);
    transition: background 200ms ease, transform 200ms ease;
  }
  .dot[aria-current="true"]::before { background: var(--velin-color-primary, #2563eb); transform: scale(1.3); }
  .dot:focus-visible { outline: 2px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .track { transition: none; } }
`;
var VelinCarousel = class extends HTMLElement {
  static get observedAttributes() {
    return ["autoplay", "interval"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._index = 0;
    this._timer = null;
    this._startX = 0;
    this._autoplayPaused = false;
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles11}</style>
      <div class="track" role="group" aria-roledescription="carousel" part="track"><slot></slot></div>
      <div class="controls" part="controls">
        <button class="prev" aria-label="Previous slide" part="prev">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="next" aria-label="Next slide" part="next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
      </div>
      <div class="indicators" role="group" aria-label="Slide indicators" part="indicators"></div>
    `;
    this.shadowRoot.querySelector(".prev").addEventListener("click", () => this.prev());
    this.shadowRoot.querySelector(".next").addEventListener("click", () => this.next());
    const track = this.shadowRoot.querySelector(".track");
    track.addEventListener("touchstart", (e) => {
      this._startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const diff = this._startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
    });
    this.addEventListener("mouseenter", () => this._pause());
    this.addEventListener("mouseleave", () => this._resume());
    this.addEventListener("focusin", () => this._pause());
    this.addEventListener("focusout", () => this._resume());
    this.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.prev();
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        this.next();
        e.preventDefault();
      } else if (e.key === "Home") {
        this.goTo(0);
        e.preventDefault();
      } else if (e.key === "End") {
        this.goTo(this._count - 1);
        e.preventDefault();
      }
    });
    if (!this.hasAttribute("role")) this.setAttribute("role", "region");
    this.setAttribute("aria-roledescription", "carousel");
    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", () => {
      this._buildDots();
      this._update();
    });
    if (this.hasAttribute("autoplay")) this._startAutoplay();
  }
  get _slides() {
    return this.shadowRoot.querySelector("slot").assignedElements();
  }
  get _count() {
    return this._slides.length;
  }
  prev() {
    this._index = (this._index - 1 + this._count) % this._count;
    this._update();
    this._emit();
  }
  next() {
    this._index = (this._index + 1) % this._count;
    this._update();
    this._emit();
  }
  goTo(i) {
    this._index = Math.max(0, Math.min(i, this._count - 1));
    this._update();
    this._emit();
  }
  _update() {
    const track = this.shadowRoot.querySelector(".track");
    track.style.transform = `translateX(-${this._index * 100}%)`;
    this._slides.forEach((s, i) => {
      s.setAttribute("aria-hidden", i !== this._index ? "true" : "false");
      s.inert = i !== this._index;
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", `Slide ${i + 1} of ${this._count}`);
    });
    this.shadowRoot.querySelectorAll(".dot").forEach((d, i) => {
      d.setAttribute("aria-current", i === this._index ? "true" : "false");
    });
  }
  _buildDots() {
    const c = this.shadowRoot.querySelector(".indicators");
    c.innerHTML = "";
    this._slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "dot";
      d.setAttribute("aria-label", `Go to slide ${i + 1}`);
      d.addEventListener("click", () => this.goTo(i));
      c.appendChild(d);
    });
    if (this.hasAttribute("autoplay")) {
      const pause = document.createElement("button");
      pause.type = "button";
      pause.className = "pause-btn";
      pause.setAttribute("aria-pressed", "false");
      pause.setAttribute("aria-label", "Pause automatic slide show");
      pause.textContent = "Pause";
      pause.addEventListener("click", () => this._toggleAutoplayPause(pause));
      c.appendChild(pause);
    }
    this._update();
  }
  _toggleAutoplayPause(btn) {
    this._autoplayPaused = !this._autoplayPaused;
    if (this._autoplayPaused) {
      this._pause();
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Resume automatic slide show");
      btn.textContent = "Play";
    } else {
      this._resume();
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Pause automatic slide show");
      btn.textContent = "Pause";
    }
  }
  _emit() {
    this.dispatchEvent(new CustomEvent("velin-slide-change", { bubbles: true, detail: { index: this._index } }));
  }
  _startAutoplay() {
    const ms = parseInt(this.getAttribute("interval") || "5000", 10);
    this._timer = setInterval(() => this.next(), ms);
  }
  _pause() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  _resume() {
    if (this.hasAttribute("autoplay") && !this._timer && !this._autoplayPaused) this._startAutoplay();
  }
  disconnectedCallback() {
    this._pause();
  }
};
customElements.define("velin-carousel", VelinCarousel);
var velin_carousel_default = VelinCarousel;

// components/velin-collapse.js
var styles12 = `
  :host { display: block; }
  .content {
    overflow: hidden;
    transition: grid-template-rows 300ms ease;
    display: grid;
    grid-template-rows: 0fr;
  }
  :host([open]) .content { grid-template-rows: 1fr; }
  .inner { min-height: 0; }
  @media (prefers-reduced-motion: reduce) { .content { transition: none; } }
`;
var collapseId = 0;
function isButtonLike(el) {
  const tag = el.tagName;
  return tag === "BUTTON" || tag === "A" && el.hasAttribute("href") || el.getAttribute("role") === "button";
}
var VelinCollapse = class extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._contentId = `velin-collapse-panel-${++collapseId}`;
    this._onTriggerKey = this._onTriggerKey.bind(this);
  }
  connectedCallback() {
    const panelId = this._contentId;
    this.shadowRoot.innerHTML = "<style>" + styles12 + '</style><slot name="trigger"></slot><div class="content" id="' + panelId + '" part="content"><div class="inner"><slot></slot></div></div>';
    const triggerSlot = this.shadowRoot.querySelector('slot[name="trigger"]');
    triggerSlot.addEventListener("slotchange", () => this._wireTrigger());
    this._wireTrigger();
  }
  _wireTrigger() {
    const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
    if (!trigger) return;
    if (!isButtonLike(trigger)) {
      trigger.setAttribute("role", "button");
      if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", "0");
    }
    trigger.setAttribute("aria-controls", this._contentId);
    trigger.setAttribute("aria-expanded", this.hasAttribute("open") ? "true" : "false");
    trigger.removeEventListener("click", this._onClick);
    trigger.removeEventListener("keydown", this._onTriggerKey);
    this._onClick = () => this.toggle();
    trigger.addEventListener("click", this._onClick);
    trigger.addEventListener("keydown", this._onTriggerKey);
  }
  _onTriggerKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggle();
    }
  }
  attributeChangedCallback(name) {
    if (name === "open") {
      const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
      if (trigger) trigger.setAttribute("aria-expanded", this.hasAttribute("open") ? "true" : "false");
    }
  }
  toggle() {
    if (this.hasAttribute("open")) this.close();
    else this.open();
  }
  open() {
    this.setAttribute("open", "");
    this.dispatchEvent(new CustomEvent("velin-open", { bubbles: true }));
  }
  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true }));
  }
};
customElements.define("velin-collapse", VelinCollapse);
var velin_collapse_default = VelinCollapse;

// components/velin-scrollspy.js
var VelinScrollspy = class extends HTMLElement {
  constructor() {
    super();
    this._observer = null;
    this._activeId = null;
  }
  connectedCallback() {
    const selector = this.getAttribute("target") || "section[id]";
    const navSelector = this.getAttribute("nav") || "a";
    const rootMargin = this.getAttribute("root-margin") || "-20% 0px -60% 0px";
    const sections = document.querySelectorAll(selector);
    if (!sections.length) return;
    this._observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this._activate(entry.target.id, navSelector);
          }
        }
      },
      { rootMargin, threshold: 0 }
    );
    sections.forEach((s) => this._observer.observe(s));
  }
  _activate(id, navSelector) {
    if (this._activeId === id) return;
    this._activeId = id;
    const links = this.querySelectorAll(navSelector);
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        link.classList.add("velin-doc-sidebar__link--active");
        link.setAttribute("aria-current", "true");
      } else {
        link.classList.remove("velin-doc-sidebar__link--active");
        link.removeAttribute("aria-current");
      }
    });
    this.dispatchEvent(new CustomEvent("velin-spy-change", { bubbles: true, detail: { id } }));
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
};
customElements.define("velin-scrollspy", VelinScrollspy);
var velin_scrollspy_default = VelinScrollspy;

// components/velin-tooltip-wc.js
var styles13 = `
  :host { position: relative; display: inline-block; }
  .tip {
    position: absolute; z-index: var(--velin-z-tooltip, 700);
    padding: var(--velin-space-2, 0.5rem) var(--velin-space-3, 0.75rem);
    font-size: var(--velin-text-sm, 0.875rem);
    color: var(--velin-color-on-primary, #fff);
    background: var(--velin-color-text, #1a1a2e);
    border-radius: var(--velin-radius-md, 0.375rem);
    white-space: nowrap; pointer-events: none;
    opacity: 0; transition: opacity 150ms ease;
    max-inline-size: 20rem; white-space: normal;
  }
  :host([visible]) .tip { opacity: 1; }
  .tip[data-placement="top"] { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
  .tip[data-placement="bottom"] { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
  .tip[data-placement="start"] { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
  .tip[data-placement="end"] { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
  @media (prefers-reduced-motion: reduce) { .tip { transition: none; } }
`;
var tooltipId = 0;
var VelinTooltipWC = class extends HTMLElement {
  static get observedAttributes() {
    return ["content", "placement"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._tipId = `velin-tooltip-${++tooltipId}`;
  }
  connectedCallback() {
    const placement = this.getAttribute("placement") || "top";
    const D = "div";
    this.shadowRoot.innerHTML = `
      <style>${styles13}</style>
      <slot></slot>
      <${D} class="tip" id="${this._tipId}" role="tooltip" data-placement="${escapeHTML(placement)}" part="tip">${escapeHTML(this.getAttribute("content") || "")}</${D}>
    `;
    this.addEventListener("mouseenter", () => this._show());
    this.addEventListener("mouseleave", () => this._hide());
    this.addEventListener("focusin", () => this._show());
    this.addEventListener("focusout", () => this._hide());
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this._hide();
    });
    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", () => this._linkTrigger());
    this._linkTrigger();
  }
  _linkTrigger() {
    const trigger = this.shadowRoot.querySelector("slot")?.assignedElements()[0];
    if (!trigger) return;
    if (this.hasAttribute("visible")) {
      trigger.setAttribute("aria-describedby", this._tipId);
    } else {
      trigger.removeAttribute("aria-describedby");
    }
  }
  _show() {
    this.setAttribute("visible", "");
    const trigger = this.shadowRoot.querySelector("slot")?.assignedElements()[0];
    if (trigger) trigger.setAttribute("aria-describedby", this._tipId);
    this._flip();
  }
  _hide() {
    this.removeAttribute("visible");
    const trigger = this.shadowRoot.querySelector("slot")?.assignedElements()[0];
    if (trigger) trigger.removeAttribute("aria-describedby");
  }
  _flip() {
    const tip = this.shadowRoot.querySelector(".tip");
    if (!tip) return;
    const rect = tip.getBoundingClientRect();
    const placement = this.getAttribute("placement") || "top";
    if (placement === "top" && rect.top < 0) tip.setAttribute("data-placement", "bottom");
    else if (placement === "bottom" && rect.bottom > window.innerHeight) tip.setAttribute("data-placement", "top");
    else tip.setAttribute("data-placement", placement);
  }
  attributeChangedCallback(name, _, val) {
    const tip = this.shadowRoot?.querySelector(".tip");
    if (!tip) return;
    if (name === "content") tip.textContent = val;
    if (name === "placement") tip.setAttribute("data-placement", val);
  }
};
customElements.define("velin-tooltip-wc", VelinTooltipWC);
var velin_tooltip_wc_default = VelinTooltipWC;

// components/velin-lightbox.js
var styles14 = `
  :host { display: contents; }
  .overlay {
    position: fixed; inset: 0; z-index: var(--velin-z-modal, 500);
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.85); opacity: 0; visibility: hidden;
    transition: opacity 200ms ease, visibility 200ms ease;
  }
  :host([open]) .overlay { opacity: 1; visibility: visible; }
  .content {
    position: relative; max-inline-size: 90vw; max-block-size: 90vh;
  }
  .content img, .content video {
    max-inline-size: 100%; max-block-size: 85vh; object-fit: contain;
    border-radius: var(--velin-radius-md, 0.375rem);
  }
  .close {
    position: absolute; top: -2.5rem; right: 0;
    background: none; border: none; color: #fff; font-size: 1.5rem;
    cursor: pointer; min-width: 2.75rem; min-height: 2.75rem;
    display: flex; align-items: center; justify-content: center;
  }
  .close:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  .nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.15); border: none; color: #fff;
    font-size: 1.5rem; cursor: pointer; border-radius: 50%;
    min-width: 2.75rem; min-height: 2.75rem;
    display: flex; align-items: center; justify-content: center;
  }
  .nav:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  .nav--prev { left: -3.5rem; }
  .nav--next { right: -3.5rem; }
  .counter { position: absolute; bottom: -2rem; left: 50%; transform: translateX(-50%); color: #ccc; font-size: 0.875rem; }
  @media (prefers-reduced-motion: reduce) { .overlay { transition: none; } }
  @media (max-width: 48rem) {
    .nav--prev { left: 0.5rem; }
    .nav--next { right: 0.5rem; }
  }
`;
var VelinLightbox = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._index = 0;
    this._items = [];
    this._previousFocus = null;
    this._onTrapKey = (e) => {
      if (e.key === "Tab") trapFocus(this.shadowRoot, e);
    };
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles14}</style>
      <slot></slot>
      <div class="overlay" role="dialog" aria-modal="true" aria-label="Image lightbox" aria-roledescription="lightbox" part="overlay">
        <button class="nav nav--prev" aria-label="Previous">&#8249;</button>
        <div class="content" part="content"></div>
        <button class="nav nav--next" aria-label="Next">&#8250;</button>
        <button class="close" aria-label="Close">&times;</button>
        <div class="counter" part="counter"></div>
      </div>
    `;
    const slot = this.shadowRoot.querySelector("slot");
    slot.addEventListener("slotchange", () => {
      this._items = slot.assignedElements().filter((el) => el.tagName === "IMG" || el.tagName === "VIDEO" || el.dataset.velinLightbox);
      this._items.forEach((item, i) => {
        item.style.cursor = "pointer";
        item.addEventListener("click", () => this.open(i));
      });
    });
    this.shadowRoot.querySelector(".close").addEventListener("click", () => this.close());
    this.shadowRoot.querySelector(".nav--prev").addEventListener("click", () => this._prev());
    this.shadowRoot.querySelector(".nav--next").addEventListener("click", () => this._next());
    this.shadowRoot.querySelector(".overlay").addEventListener("click", (e) => {
      if (e.target.classList.contains("overlay")) this.close();
    });
    this.shadowRoot.querySelector(".overlay").addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowLeft") this._prev();
      if (e.key === "ArrowRight") this._next();
    });
  }
  open(index = 0) {
    this._previousFocus = document.activeElement;
    this._index = index;
    this.setAttribute("open", "");
    this._render();
    document.body.style.overflow = "hidden";
    const overlay = this.shadowRoot.querySelector(".overlay");
    overlay.removeEventListener("keydown", this._onTrapKey);
    overlay.addEventListener("keydown", this._onTrapKey);
    this.shadowRoot.querySelector(".close").focus();
  }
  close() {
    this.removeAttribute("open");
    document.body.style.overflow = "";
    if (this._previousFocus) {
      this._previousFocus.focus();
      this._previousFocus = null;
    }
    this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true }));
  }
  _prev() {
    this._index = (this._index - 1 + this._items.length) % this._items.length;
    this._render();
  }
  _next() {
    this._index = (this._index + 1) % this._items.length;
    this._render();
  }
  _render() {
    const container = this.shadowRoot.querySelector(".content");
    const item = this._items[this._index];
    if (!item) return;
    const src = sanitizeURL(item.dataset.velinLightbox || item.src);
    const alt = escapeHTML(item.alt || "");
    if (item.tagName === "VIDEO") {
      container.innerHTML = `<video src="${escapeHTML(src)}" controls autoplay></video>`;
    } else {
      container.innerHTML = `<img src="${escapeHTML(src)}" alt="${alt}">`;
    }
    const counter = this.shadowRoot.querySelector(".counter");
    counter.textContent = `${this._index + 1} / ${this._items.length}`;
  }
};
customElements.define("velin-lightbox", VelinLightbox);
var velin_lightbox_default = VelinLightbox;

// components/velin-stepper-wc.js
var styles15 = `
  :host { display: block; }
  .steps {
    display: flex; gap: var(--velin-space-2, 0.5rem);
    counter-reset: step;
    margin-block-end: var(--velin-space-6, 1.5rem);
  }
  .step {
    flex: 1; text-align: center; position: relative;
    counter-increment: step;
  }
  .step__marker {
    display: inline-flex; align-items: center; justify-content: center;
    width: 2.5rem; height: 2.5rem; border-radius: 50%;
    border: 2px solid var(--velin-color-border, #ddd);
    background: var(--velin-color-surface-bright, #fff);
    color: var(--velin-color-text-muted, #888);
    font-weight: 600; font-size: 0.875rem;
    transition: all 200ms ease;
  }
  .step.active .step__marker {
    border-color: var(--velin-color-primary, #2563eb);
    background: var(--velin-color-primary, #2563eb);
    color: #fff;
  }
  .step.completed .step__marker {
    border-color: var(--velin-color-success, #16a34a);
    background: var(--velin-color-success, #16a34a);
    color: #fff;
  }
  .step__label {
    display: block; margin-top: 0.5rem;
    font-size: var(--velin-text-sm, 0.875rem);
    color: var(--velin-color-text-muted, #888);
  }
  .step.active .step__label { color: var(--velin-color-primary, #2563eb); font-weight: 600; }
  .step.completed .step__label { color: var(--velin-color-success, #16a34a); }
  .step + .step::before {
    content: ""; position: absolute;
    top: 1.25rem; right: 50%; width: 100%;
    height: 2px; background: var(--velin-color-border, #ddd);
    z-index: -1;
  }
  .step.completed + .step::before,
  .step.active + .step::before { background: var(--velin-color-success, #16a34a); }
  .step.completed + .step.active::before { background: var(--velin-color-primary, #2563eb); }
  .panels ::slotted(*) { display: none; }
  .panels ::slotted([data-active]) { display: block; }
  @media (prefers-reduced-motion: reduce) { .step__marker { transition: none; } }
`;
var VelinStepperWC = class extends HTMLElement {
  static get observedAttributes() {
    return ["active"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._current = 0;
  }
  connectedCallback() {
    this._current = parseInt(this.getAttribute("active") || "0", 10);
    this._buildSteps();
  }
  _buildSteps() {
    const labels = (this.getAttribute("labels") || "").split(",").map((s) => s.trim());
    const stepsHTML = labels.map((label, i) => {
      const state = i < this._current ? "completed" : i === this._current ? "active" : "";
      const marker = i < this._current ? "&#10003;" : i + 1;
      const ariaCurrent = i === this._current ? ' aria-current="step"' : "";
      return `<div class="step ${state}" role="listitem"${ariaCurrent}><span class="step__marker" aria-hidden="true">${marker}</span><span class="step__label">${escapeHTML(label)}</span></div>`;
    }).join("");
    this.shadowRoot.innerHTML = `
      <style>${styles15}</style>
      <div class="steps" role="list" aria-label="Progress" part="steps">${stepsHTML}</div>
      <div class="panels" part="panels"><slot></slot></div>
    `;
    this._updatePanels();
  }
  _updatePanels() {
    const panels = this.shadowRoot.querySelector("slot")?.assignedElements() || [];
    panels.forEach((p, i) => {
      if (i === this._current) p.setAttribute("data-active", "");
      else p.removeAttribute("data-active");
    });
  }
  next() {
    const labels = (this.getAttribute("labels") || "").split(",");
    if (this._current < labels.length - 1) {
      this._current++;
      this.setAttribute("active", this._current);
      this._buildSteps();
      this.dispatchEvent(new CustomEvent("velin-step-change", { bubbles: true, detail: { step: this._current } }));
    }
  }
  prev() {
    if (this._current > 0) {
      this._current--;
      this.setAttribute("active", this._current);
      this._buildSteps();
      this.dispatchEvent(new CustomEvent("velin-step-change", { bubbles: true, detail: { step: this._current } }));
    }
  }
  goTo(step) {
    this._current = step;
    this.setAttribute("active", this._current);
    this._buildSteps();
    this.dispatchEvent(new CustomEvent("velin-step-change", { bubbles: true, detail: { step: this._current } }));
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "active" && oldVal !== null && oldVal !== newVal) {
      this._current = parseInt(newVal, 10);
      this._buildSteps();
    }
  }
};
customElements.define("velin-stepper-wc", VelinStepperWC);
var velin_stepper_wc_default = VelinStepperWC;

// components/velin-dialog.js
var styles16 = `
  :host { display: contents; }
  dialog {
    border: none; border-radius: var(--velin-radius-lg, 0.75rem);
    box-shadow: var(--velin-shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.1));
    padding: 0; max-inline-size: min(28rem, 90vw); inline-size: 100%;
    background: var(--velin-color-surface-bright, #fff);
    color: var(--velin-color-text, #1a1a2e);
  }
  dialog::backdrop { background: rgba(0,0,0,0.5); }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--velin-space-4, 1rem) var(--velin-space-6, 1.5rem);
    border-bottom: 1px solid var(--velin-color-border, #e5e5e5);
  }
  .title { font-size: var(--velin-text-lg, 1.125rem); font-weight: 600; margin: 0; }
  .close {
    background: none; border: none; cursor: pointer; font-size: 1.25rem;
    color: var(--velin-color-text-muted, #888); min-width: 2.75rem; min-height: 2.75rem;
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--velin-radius-sm, 0.25rem);
  }
  .close:hover { background: var(--velin-color-surface-dim, #f5f5f5); }
  .close:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  .body { padding: var(--velin-space-6, 1.5rem); }
  .footer {
    display: flex; justify-content: flex-end; gap: var(--velin-space-2, 0.5rem);
    padding: var(--velin-space-4, 1rem) var(--velin-space-6, 1.5rem);
    border-top: 1px solid var(--velin-color-border, #e5e5e5);
  }
  .btn {
    padding: var(--velin-space-2, 0.5rem) var(--velin-space-4, 1rem);
    border-radius: var(--velin-radius-md, 0.375rem);
    font-size: var(--velin-text-base, 1rem); cursor: pointer;
    min-height: 2.75rem; border: 1px solid var(--velin-color-border, #ddd);
    background: var(--velin-color-surface-bright, #fff);
    color: var(--velin-color-text, #1a1a2e);
  }
  .btn--primary {
    background: var(--velin-color-primary, #2563eb);
    color: var(--velin-color-on-primary, #fff);
    border-color: var(--velin-color-primary, #2563eb);
  }
  .btn--danger {
    background: var(--velin-color-danger, #dc2626);
    color: #fff; border-color: var(--velin-color-danger, #dc2626);
  }
  .btn:focus-visible { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  .input {
    inline-size: 100%; padding: var(--velin-space-3, 0.75rem);
    border: 2px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.375rem);
    font-size: var(--velin-text-base, 1rem); margin-top: var(--velin-space-3, 0.75rem);
    background: var(--velin-color-surface-bright, #fff);
    color: var(--velin-color-text, #1a1a2e);
  }
  .input:focus { outline: 3px solid var(--velin-color-focus, #2563eb); outline-offset: 0; border-color: var(--velin-color-primary, #2563eb); }
`;
var VelinDialog = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._resolve = null;
    this._previousFocus = null;
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `<style>${styles16}</style><dialog part="dialog"></dialog>`;
  }
  alert(message, { title = "Alert", confirmText = "OK" } = {}) {
    return this._show("alert", message, { title, confirmText });
  }
  confirm(message, { title = "Confirm", confirmText = "Confirm", cancelText = "Cancel", danger = false } = {}) {
    return this._show("confirm", message, { title, confirmText, cancelText, danger });
  }
  prompt(message, { title = "Input", confirmText = "Submit", cancelText = "Cancel", placeholder = "", defaultValue = "" } = {}) {
    return this._show("prompt", message, { title, confirmText, cancelText, placeholder, defaultValue });
  }
  _show(type, message, opts) {
    const dialog = this.shadowRoot.querySelector("dialog");
    this._previousFocus = document.activeElement;
    const safeTitle = escapeHTML(opts.title);
    const safeMsg = escapeHTML(message);
    const safeConfirm = escapeHTML(opts.confirmText);
    const safeCancel = escapeHTML(opts.cancelText || "");
    const safePlaceholder = escapeHTML(opts.placeholder || "");
    const safeDefault = escapeHTML(opts.defaultValue || "");
    const footerBtns = type === "alert" ? `<button class="btn btn--primary" data-action="confirm">${safeConfirm}</button>` : `<button class="btn" data-action="cancel">${safeCancel}</button>
         <button class="btn ${opts.danger ? "btn--danger" : "btn--primary"}" data-action="confirm">${safeConfirm}</button>`;
    const input = type === "prompt" ? `<input class="input" placeholder="${safePlaceholder}" value="${safeDefault}" part="input">` : "";
    dialog.innerHTML = `
      <div class="header"><h3 class="title">${safeTitle}</h3><button class="close" aria-label="Close">&times;</button></div>
      <div class="body"><p>${safeMsg}</p>${input}</div>
      <div class="footer">${footerBtns}</div>
    `;
    dialog.showModal();
    if (type !== "prompt") {
      const firstBtn = dialog.querySelector("[data-action]");
      if (firstBtn) firstBtn.focus();
    }
    return new Promise((resolve) => {
      this._resolve = resolve;
      dialog.querySelector(".close").addEventListener("click", () => this._dismiss(type, false, dialog));
      dialog.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => this._dismiss(type, btn.dataset.action === "confirm", dialog));
      });
      dialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        this._dismiss(type, false, dialog);
      });
      if (type === "prompt") {
        const inp = dialog.querySelector(".input");
        inp.focus();
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") this._dismiss(type, true, dialog);
        });
      }
    });
  }
  _dismiss(type, confirmed, dialog) {
    if (!this._resolve) return;
    let value;
    if (type === "alert") value = true;
    else if (type === "confirm") value = confirmed;
    else value = confirmed ? dialog.querySelector(".input")?.value ?? "" : null;
    dialog.close();
    if (this._previousFocus) {
      this._previousFocus.focus();
      this._previousFocus = null;
    }
    this._resolve(value);
    this._resolve = null;
    this.dispatchEvent(new CustomEvent("velin-dialog-close", { bubbles: true, detail: { value } }));
  }
};
customElements.define("velin-dialog", VelinDialog);
var velin_dialog_default = VelinDialog;

// components/velin-countdown.js
var styles17 = `
  :host { display: inline-flex; font-variant-numeric: tabular-nums; }
  .wrap { display: inline-flex; gap: var(--velin-space-3, 0.75rem); align-items: flex-start; }
  .segment {
    display: flex; flex-direction: column; align-items: center;
    min-width: 3.5rem;
  }
  .value {
    font-size: var(--velin-text-3xl, 1.953rem);
    font-weight: var(--velin-weight-bold, 700);
    line-height: 1;
    color: var(--velin-color-text, #1a1a2e);
  }
  .label {
    font-size: var(--velin-text-xs, 0.75rem);
    color: var(--velin-color-text-muted, #888);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: var(--velin-space-1, 0.25rem);
  }
  .separator {
    font-size: var(--velin-text-2xl, 1.563rem);
    font-weight: 700;
    color: var(--velin-color-text-muted, #888);
    align-self: flex-start;
    padding-top: 0.2em;
  }
  :host([size="sm"]) .value { font-size: var(--velin-text-xl, 1.25rem); }
  :host([size="sm"]) .segment { min-width: 2.5rem; }
  :host([size="lg"]) .value { font-size: var(--velin-text-5xl, 3.052rem); }
`;
var VelinCountdown = class extends HTMLElement {
  static get observedAttributes() {
    return ["datetime"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._timer = null;
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `<style>${styles17}</style><div class="wrap"></div>`;
    this._wrap = this.shadowRoot.querySelector(".wrap");
    this.setAttribute("role", "timer");
    this.setAttribute("aria-live", "polite");
    this.setAttribute("aria-atomic", "true");
    this._start();
  }
  _start() {
    this._update();
    this._timer = setInterval(() => this._update(), 1e3);
  }
  _update() {
    const target = new Date(this.getAttribute("datetime")).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / 864e5);
    const hours = Math.floor(diff % 864e5 / 36e5);
    const minutes = Math.floor(diff % 36e5 / 6e4);
    const seconds = Math.floor(diff % 6e4 / 1e3);
    const pad = (n) => String(n).padStart(2, "0");
    const showDays = this.getAttribute("show-days") !== "false";
    const lDays = escapeHTML(this.getAttribute("label-days") || "Days");
    const lHours = escapeHTML(this.getAttribute("label-hours") || "Hours");
    const lMin = escapeHTML(this.getAttribute("label-minutes") || "Min");
    const lSec = escapeHTML(this.getAttribute("label-seconds") || "Sec");
    let html = "";
    if (showDays) html += `<div class="segment" part="days"><span class="value">${pad(days)}</span><span class="label">${lDays}</span></div><span class="separator">:</span>`;
    html += `<div class="segment" part="hours"><span class="value">${pad(hours)}</span><span class="label">${lHours}</span></div><span class="separator">:</span>`;
    html += `<div class="segment" part="minutes"><span class="value">${pad(minutes)}</span><span class="label">${lMin}</span></div><span class="separator">:</span>`;
    html += `<div class="segment" part="seconds"><span class="value">${pad(seconds)}</span><span class="label">${lSec}</span></div>`;
    if (this._wrap) {
      this._wrap.innerHTML = html;
    }
    const ariaText = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`;
    this.setAttribute("aria-label", ariaText);
    if (diff <= 0) {
      clearInterval(this._timer);
      this.dispatchEvent(new CustomEvent("velin-countdown-end", { bubbles: true }));
    }
  }
  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }
  attributeChangedCallback() {
    if (this._timer) {
      clearInterval(this._timer);
      this._start();
    }
  }
};
customElements.define("velin-countdown", VelinCountdown);
var velin_countdown_default = VelinCountdown;

// components/velin-progress-ring.js
var styles18 = `
  :host { display: inline-flex; align-items: center; justify-content: center; }
  svg { transform: rotate(-90deg); }
  .track { fill: none; stroke: var(--velin-color-border, #e5e5e5); }
  .fill {
    fill: none;
    stroke: var(--velin-progress-ring-color, var(--velin-color-primary, #2563eb));
    stroke-linecap: round;
    transition: stroke-dashoffset 400ms ease;
  }
  .label {
    position: absolute;
    font-size: var(--velin-text-lg, 1.125rem);
    font-weight: var(--velin-weight-semibold, 600);
    color: var(--velin-color-text, #1a1a2e);
  }
  :host { position: relative; }
  @media (prefers-reduced-motion: reduce) { .fill { transition: none; } }
`;
var VelinProgressRing = class extends HTMLElement {
  static get observedAttributes() {
    return ["value", "size", "stroke", "color"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this._render();
  }
  _render() {
    const value = Math.min(100, Math.max(0, parseInt(this.getAttribute("value") || "0", 10)));
    const size = parseInt(this.getAttribute("size") || "120", 10);
    const strokeWidth = parseInt(this.getAttribute("stroke") || "8", 10);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - value / 100 * circumference;
    const color = this.getAttribute("color");
    const colorStyle = color ? `stroke: var(--velin-color-${color}, ${color});` : "";
    const showLabel = this.getAttribute("label") !== "false";
    this.shadowRoot.innerHTML = `
      <style>${styles18}</style>
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" part="svg" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100">
        <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${strokeWidth}" />
        <circle class="fill" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
          style="${colorStyle}" part="fill" />
      </svg>
      ${showLabel ? `<span class="label" part="label">${value}%</span>` : ""}
    `;
    this.setAttribute("role", "progressbar");
    this.setAttribute("aria-valuenow", value);
    this.setAttribute("aria-valuemin", "0");
    this.setAttribute("aria-valuemax", "100");
    this.setAttribute("aria-label", this.getAttribute("aria-label") || `${value}%`);
  }
  attributeChangedCallback() {
    this._render();
  }
};
customElements.define("velin-progress-ring", VelinProgressRing);
var velin_progress_ring_default = VelinProgressRing;

// components/velin-persist.js
var KEY_RE = /^[a-zA-Z0-9_-]{1,64}$/;
var MAX_ENTRY_SIZE = 64 * 1024;
var VelinPersist = class extends HTMLElement {
  static get observedAttributes() {
    return ["key", "storage"];
  }
  constructor() {
    super();
    this._debounceTimer = null;
    this._onInput = this._onInput.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onReset = this._onReset.bind(this);
  }
  get storageKey() {
    const raw = this.getAttribute("key") || "default";
    const safe = KEY_RE.test(raw) ? raw : "default";
    return `velin-persist-${safe}`;
  }
  get _storage() {
    return this.getAttribute("storage") === "session" ? sessionStorage : localStorage;
  }
  connectedCallback() {
    this.style.display = "contents";
    this.addEventListener("input", this._onInput);
    this.addEventListener("change", this._onInput);
    this.addEventListener("submit", this._onSubmit);
    this.addEventListener("reset", this._onReset);
    requestAnimationFrame(() => this._restore());
  }
  disconnectedCallback() {
    this.removeEventListener("input", this._onInput);
    this.removeEventListener("change", this._onInput);
    this.removeEventListener("submit", this._onSubmit);
    this.removeEventListener("reset", this._onReset);
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
  }
  _onInput() {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this._save(), 300);
  }
  _onSubmit(e) {
    this.clear();
  }
  _onReset() {
    requestAnimationFrame(() => this.clear());
  }
  _getFields() {
    return this.querySelectorAll("input[name], textarea[name], select[name]");
  }
  _save() {
    const data = {};
    this._getFields().forEach((field) => {
      const name = field.name;
      if (!name) return;
      if (field.type === "password" || field.type === "file") return;
      if (field.type === "checkbox") {
        data[name] = field.checked;
      } else if (field.type === "radio") {
        if (field.checked) data[name] = field.value;
      } else {
        data[name] = field.value;
      }
    });
    try {
      const json = JSON.stringify(data);
      if (json.length > MAX_ENTRY_SIZE) return;
      this._storage.setItem(this.storageKey, json);
    } catch (err) {
      if (err.name === "QuotaExceededError" || err.code === 22) {
        this.dispatchEvent(new CustomEvent("velin-persist-error", { bubbles: true, detail: { error: "quota" } }));
      }
    }
  }
  _restore() {
    let data;
    try {
      const raw = this._storage.getItem(this.storageKey);
      if (!raw || raw.length > MAX_ENTRY_SIZE) return;
      data = JSON.parse(raw);
      if (typeof data !== "object" || data === null) return;
    } catch {
      return;
    }
    this._getFields().forEach((field) => {
      const name = field.name;
      if (!(name in data)) return;
      if (field.type === "checkbox") {
        field.checked = !!data[name];
      } else if (field.type === "radio") {
        field.checked = field.value === data[name];
      } else {
        field.value = data[name];
      }
    });
    this.dispatchEvent(new CustomEvent("velin-persist-restore", { bubbles: true, detail: { data } }));
  }
  clear() {
    try {
      this._storage.removeItem(this.storageKey);
    } catch {
    }
    this.dispatchEvent(new CustomEvent("velin-persist-clear", { bubbles: true }));
  }
};
customElements.define("velin-persist", VelinPersist);
var velin_persist_default = VelinPersist;

// components/velin-haptic.js
var PATTERNS = {
  tap: [10],
  "double-tap": [10, 50, 10],
  success: [50],
  error: [100, 30, 100],
  warning: [30, 20, 30],
  long: [200]
};
function vibrate(pattern) {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (mq?.matches) return;
  const p = typeof pattern === "string" ? PATTERNS[pattern] || PATTERNS.tap : pattern;
  navigator.vibrate(p);
}
function applyHaptic(element) {
  const pattern = element.getAttribute("haptic") || "tap";
  element.addEventListener("click", () => vibrate(pattern));
}
var VelinHapticObserver = class {
  constructor() {
    this._observer = null;
  }
  start(root = document.body) {
    const existing = root.querySelectorAll("[haptic]");
    existing.forEach(applyHaptic);
    this._observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.hasAttribute?.("haptic")) applyHaptic(node);
          node.querySelectorAll?.("[haptic]").forEach(applyHaptic);
        }
      }
    });
    this._observer.observe(root, { childList: true, subtree: true });
  }
  stop() {
    this._observer?.disconnect();
  }
};

// components/index.js
if (typeof document !== "undefined") {
  const _hapticInit = () => {
    new VelinHapticObserver().start(document.body);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _hapticInit);
  } else {
    _hapticInit();
  }
}
export {
  PATTERNS as HapticPatterns,
  velin_accordion_default as VelinAccordion,
  velin_carousel_default as VelinCarousel,
  velin_collapse_default as VelinCollapse,
  velin_copy_default as VelinCopy,
  velin_countdown_default as VelinCountdown,
  velin_dialog_default as VelinDialog,
  velin_drawer_default as VelinDrawer,
  velin_dropdown_default as VelinDropdown,
  VelinHapticObserver,
  velin_icon_default as VelinIcon,
  velin_lightbox_default as VelinLightbox,
  velin_modal_default as VelinModal,
  velin_persist_default as VelinPersist,
  velin_popover_default as VelinPopover,
  velin_progress_ring_default as VelinProgressRing,
  velin_scroll_top_default as VelinScrollTop,
  velin_scrollspy_default as VelinScrollspy,
  velin_stepper_wc_default as VelinStepperWC,
  velin_tabs_default as VelinTabs,
  velin_theme_toggle_default as VelinThemeToggle,
  velin_toast_default as VelinToast,
  velin_tooltip_wc_default as VelinTooltipWC,
  applyHaptic,
  clearBackgroundInert,
  getFocusableElements,
  restoreFocus,
  rovingTabindex,
  saveFocus,
  setBackgroundInert,
  trapFocus,
  vibrate
};
