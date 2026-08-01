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

  // components/focus-manager.js
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
  function activeInertElements() {
    const out = /* @__PURE__ */ new Set();
    for (const layer of _inertStack) {
      for (const el of layer.siblings) out.add(el);
    }
    return out;
  }
  function setBackgroundInert(except) {
    const host = except instanceof HTMLElement ? except : null;
    if (!host) return;
    const siblings = /* @__PURE__ */ new Set();
    for (const child of document.body.children) {
      if (child === host || child.contains(host)) continue;
      if (!child.hasAttribute("inert")) {
        child.setAttribute("inert", "");
        siblings.add(child);
      }
    }
    _inertStack.push({ host, siblings });
    if (_overflowDepth === 0) {
      _savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    _overflowDepth += 1;
  }
  function clearBackgroundInert(except) {
    let idx = -1;
    if (except instanceof HTMLElement) {
      idx = _inertStack.findLastIndex((layer) => layer.host === except);
    } else if (_inertStack.length) {
      idx = _inertStack.length - 1;
    }
    if (idx === -1) return;
    const { siblings } = _inertStack.splice(idx, 1)[0];
    const stillNeeded = activeInertElements();
    for (const el of siblings) {
      if (!stillNeeded.has(el)) el.removeAttribute("inert");
    }
    _overflowDepth = Math.max(0, _overflowDepth - 1);
    if (_overflowDepth === 0) {
      document.body.style.overflow = _savedOverflow;
      _savedOverflow = "";
    }
  }
  var FOCUSABLE_SELECTOR, _inertStack, _overflowDepth, _savedOverflow;
  var init_focus_manager = __esm({
    "components/focus-manager.js"() {
      FOCUSABLE_SELECTOR = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
        "summary",
        "details"
      ].join(", ");
      _inertStack = [];
      _overflowDepth = 0;
      _savedOverflow = "";
    }
  });

  // node_modules/dompurify/dist/purify.es.mjs
  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e, n, i, u, a = [], f = true, o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ;
        else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
      } catch (r2) {
        o = true, n = r2;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  function unapply(func) {
    return function(thisArg) {
      if (thisArg instanceof RegExp) {
        thisArg.lastIndex = 0;
      }
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(Func) {
    return function() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return construct(Func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    if (!arrayIsArray(array)) {
      return set;
    }
    let l = array.length;
    while (l--) {
      let element = array[l];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const _ref2 of entries(object)) {
      var _ref3 = _slicedToArray(_ref2, 2);
      const property = _ref3[0];
      const value = _ref3[1];
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (arrayIsArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function stringifyValue(value) {
    switch (typeof value) {
      case "string": {
        return value;
      }
      case "number": {
        return numberToString(value);
      }
      case "boolean": {
        return booleanToString(value);
      }
      case "bigint": {
        return bigintToString ? bigintToString(value) : "0";
      }
      case "symbol": {
        return symbolToString ? symbolToString(value) : "Symbol()";
      }
      case "undefined": {
        return objectToString(value);
      }
      case "function":
      case "object": {
        if (value === null) {
          return objectToString(value);
        }
        const valueAsRecord = value;
        const valueToString = lookupGetter(valueAsRecord, "toString");
        if (typeof valueToString === "function") {
          const stringified = valueToString(valueAsRecord);
          return typeof stringified === "string" ? stringified : objectToString(stringified);
        }
        return objectToString(value);
      }
      default: {
        return objectToString(value);
      }
    }
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  function isRegex(value) {
    try {
      regExpTest(value, "");
      return true;
    } catch (_unused) {
      return false;
    }
  }
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.4.12";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let document2 = window2.document;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    window2.DocumentFragment;
    const HTMLTemplateElement = window2.HTMLTemplateElement, Node = window2.Node, Element = window2.Element, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap;
    _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap;
    window2.HTMLFormElement;
    const DOMParser2 = window2.DOMParser, trustedTypes = window2.trustedTypes;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
    const getAttributes = lookupGetter(ElementPrototype, "attributes");
    const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
    const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    let defaultTrustedTypesPolicy;
    let defaultTrustedTypesPolicyResolved = false;
    let IN_TRUSTED_TYPES_POLICY = 0;
    const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
      if (IN_TRUSTED_TYPES_POLICY > 0) {
        throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
      }
    };
    const _createTrustedHTML = function _createTrustedHTML2(html2) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createHTML(html2);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
      _assertNotInTrustedTypesPolicy();
      IN_TRUSTED_TYPES_POLICY++;
      try {
        return trustedTypesPolicy.createScriptURL(scriptUrl);
      } finally {
        IN_TRUSTED_TYPES_POLICY--;
      }
    };
    const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
      if (!defaultTrustedTypesPolicyResolved) {
        defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        defaultTrustedTypesPolicyResolved = true;
      }
      return defaultTrustedTypesPolicy;
    };
    const _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
    const importNode = originalDocument.importNode;
    let hooks = _createHooksMap();
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
    let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    }));
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let SET_CONFIG_ALLOWED_TAGS = null;
    let SET_CONFIG_ALLOWED_ATTR = null;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",
      // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
      // the UA (customizable <select>) — including any on* handlers — and the
      // engine re-mirrors synchronously whenever a removal changes which
      // option/selectedcontent is current, even inside DOMPurify's inert
      // DOMParser document. Hoisting its children on removal re-inserts a fresh
      // mirror target ahead of the walk, which the engine refills, looping
      // forever (DoS) and amplifying output. Dropping its content on removal
      // (rather than hoisting) breaks that cascade; the content is a duplicate
      // of the option, which is sanitized on its own. See campaign-3 F1/F6.
      "selectedcontent",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp"
    ]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze(["mi", "mo", "mn", "ms", "mtext"]);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, {
        transform: transformCaseFunc
      });
      ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, {
        transform: transformCaseFunc
      });
      ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, {
        transform: stringToString
      });
      URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
        transform: transformCaseFunc,
        base: DEFAULT_URI_SAFE_ATTRIBUTES
      });
      DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
        transform: transformCaseFunc,
        base: DEFAULT_DATA_URI_TAGS
      });
      FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, {
        transform: transformCaseFunc
      });
      FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), {
        transform: transformCaseFunc
      });
      FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), {
        transform: transformCaseFunc
      });
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
      NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
      HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
      const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
      CUSTOM_ELEMENT_HANDLING = create(null);
      if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
      }
      if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
      }
      seal(CUSTOM_ELEMENT_HANDLING);
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = create(null);
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      EXTRA_ELEMENT_HANDLING.tagCheck = null;
      EXTRA_ELEMENT_HANDLING.attributeCheck = null;
      if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
        if (typeof cfg.ADD_TAGS === "function") {
          EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
        } else if (arrayIsArray(cfg.ADD_TAGS)) {
          if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
            ALLOWED_TAGS = clone(ALLOWED_TAGS);
          }
          addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
        if (typeof cfg.ADD_ATTR === "function") {
          EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
        } else if (arrayIsArray(cfg.ADD_ATTR)) {
          if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
            ALLOWED_ATTR = clone(ALLOWED_ATTR);
          }
          addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
        }
      }
      if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        const previousTrustedTypesPolicy = trustedTypesPolicy;
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        try {
          emptyHTML = _createTrustedHTML("");
        } catch (error) {
          trustedTypesPolicy = previousTrustedTypesPolicy;
          throw error;
        }
      } else if (cfg.TRUSTED_TYPES_POLICY === null) {
        trustedTypesPolicy = void 0;
        emptyHTML = "";
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
        }
        if (trustedTypesPolicy && typeof emptyHTML === "string") {
          emptyHTML = _createTrustedHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    };
    const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    };
    const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    };
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        return _checkSvgNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        return _checkMathMlNamespace(tagName, parent, parentTagName);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        return _checkHtmlNamespace(tagName, parent, parentTagName);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        getParentNode(node).removeChild(node);
      } catch (_) {
        remove(node);
        if (!getParentNode(node)) {
          throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
        }
      }
    };
    const _neutralizeRoot = function _neutralizeRoot2(root) {
      _neutralizeSubtree(root);
      const childNodes = getChildNodes(root);
      if (childNodes) {
        const snapshot = [];
        arrayForEach(childNodes, (child) => {
          arrayPush(snapshot, child);
        });
        arrayForEach(snapshot, (child) => {
          try {
            remove(child);
          } catch (_) {
          }
        });
      }
      const attributes = getAttributes(root);
      if (attributes) {
        for (let i = attributes.length - 1; i >= 0; --i) {
          const attribute = attributes[i];
          const name = attribute && attribute.name;
          if (typeof name === "string") {
            try {
              root.removeAttribute(name);
            } catch (_) {
            }
          }
        }
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: element.getAttributeNode(name),
          from: element
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: element
        });
      }
      element.removeAttribute(name);
      if (name === "is") {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_) {
          }
        } else {
          try {
            element.setAttribute(name, "");
          } catch (_) {
          }
        }
      }
    };
    const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element) {
      const attributes = getAttributes(element);
      if (!attributes) {
        return;
      }
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) {
          continue;
        }
        try {
          element.removeAttribute(name);
        } catch (_) {
        }
      }
    };
    const _neutralizeSubtree = function _neutralizeSubtree2(root) {
      const stack = [root];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        if (nodeType === NODE_TYPE.element) {
          _stripDisallowedAttributes(node);
        }
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push(childNodes[i]);
          }
        }
      }
    };
    const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root) {
      if (!SAFE_FOR_XML) {
        return;
      }
      const stack = [root];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
          try {
            remove(node);
          } catch (_) {
          }
          continue;
        }
        if (nodeType === NODE_TYPE.element) {
          const element = node;
          const lcTag = transformCaseFunc(getNodeName ? getNodeName(node) : node.nodeName);
          try {
            if (element.hasAttribute && element.hasAttribute("patchsrc")) {
              element.removeAttribute("patchsrc");
            }
            if (element.hasAttribute && element.hasAttribute("for") && lcTag !== "label" && lcTag !== "output") {
              element.removeAttribute("for");
            }
          } catch (_) {
          }
        }
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push(childNodes[i]);
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {
        }
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      return createNodeIterator.call(
        root.ownerDocument || root,
        root,
        // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
        null
      );
    };
    const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
      value = stringReplace(value, MUSTACHE_EXPR$1, " ");
      value = stringReplace(value, ERB_EXPR$1, " ");
      value = stringReplace(value, TMPLIT_EXPR$1, " ");
      return value;
    };
    const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
      var _node$querySelectorAl;
      node.normalize();
      const walker = createNodeIterator.call(
        node.ownerDocument || node,
        node,
        // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION,
        null
      );
      let currentNode = walker.nextNode();
      while (currentNode) {
        currentNode.data = _stripTemplateExpressions(currentNode.data);
        currentNode = walker.nextNode();
      }
      const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
      if (templates) {
        arrayForEach(templates, (tmpl) => {
          if (_isDocumentFragment(tmpl.content)) {
            _scrubTemplateExpressions2(tmpl.content);
          }
        });
      }
    };
    const _isClobbered = function _isClobbered2(element) {
      const realTagName = getNodeName ? getNodeName(element) : null;
      if (typeof realTagName !== "string") {
        return false;
      }
      if (transformCaseFunc(realTagName) !== "form") {
        return false;
      }
      return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || // Realm-safe NamedNodeMap detection: equality against the cached
      // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
      // makes the direct read diverge from the cached read; a clean form
      // (same-realm OR foreign-realm) has both reads pointing at the same
      // canonical NamedNodeMap.
      element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
      // returns the integer 1 for any Element regardless of realm; direct
      // read on a clobbered form (e.g. <input name="nodeType">) returns
      // the named child element. Cheap addition — nodeType is read from
      // an internal slot, no serialization cost — and removes a residual
      // clobbering surface used by several mXSS / PI / comment branches
      // in _sanitizeElements that compare currentNode.nodeType directly.
      element.nodeType !== getNodeType(element) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
      // "childNodes" shadows the prototype getter. Direct reads of
      // form.childNodes from a clobbered form return the named child
      // instead of the real NodeList, so any walk that reads it directly
      // skips the form's real children. Compare the direct read to the
      // cached Node.prototype getter — when the form's named-property
      // getter intercepts the read, the two values differ and we flag
      // the form. This catches every clobbering child type (input,
      // select, etc.) regardless of whether the named child happens to
      // carry a numeric .length, which a typeof-based probe would miss
      // (e.g. HTMLSelectElement.length is a defined unsigned-long).
      element.childNodes !== getChildNodes(element);
    };
    const _isDocumentFragment = function _isDocumentFragment2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return getNodeType(value) === NODE_TYPE.documentFragment;
      } catch (_) {
        return false;
      }
    };
    const _isNode = function _isNode2(value) {
      if (!getNodeType || typeof value !== "object" || value === null) {
        return false;
      }
      try {
        return typeof getNodeType(value) === "number";
      } catch (_) {
        return false;
      }
    };
    function _executeHooks(hooks2, currentNode, data) {
      if (hooks2.length === 0) {
        return;
      }
      arrayForEach(hooks2, (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
      if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
        return true;
      }
      if (currentNode.nodeType === NODE_TYPE.processingInstruction) {
        return true;
      }
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) {
        return true;
      }
      return false;
    };
    const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode);
        const childNodes = getChildNodes(currentNode);
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const hoisted = IN_PLACE ? childNodes[i] : cloneNode(childNodes[i], true);
            parentNode.insertBefore(hoisted, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    };
    const _sanitizeElements = function _sanitizeElements2(currentNode, root) {
      _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
      if (currentNode !== root && getParentNode(currentNode) === null) {
        return true;
      }
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(getNodeName ? getNodeName(currentNode) : currentNode.nodeName);
      _executeHooks(hooks.uponSanitizeElement, currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (currentNode !== root && getParentNode(currentNode) === null) {
        return true;
      }
      if (_isUnsafeNode(currentNode, tagName)) {
        _forceRemove(currentNode);
        return true;
      }
      if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
        const removed2 = _sanitizeDisallowedNode(currentNode, tagName);
        if (removed2 === false) {
          _executeHooks(hooks.afterSanitizeElements, currentNode, null);
        }
        return removed2;
      }
      const nt = getNodeType ? getNodeType(currentNode) : currentNode.nodeType;
      if (nt === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        const content = _stripTemplateExpressions(currentNode.textContent);
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (FORBID_ATTR[lcName]) {
        return false;
      }
      if (SAFE_FOR_XML && lcName === "patchsrc") {
        return false;
      }
      if (SAFE_FOR_XML && lcName === "for" && lcTag !== "label" && lcTag !== "output") {
        return false;
      }
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ;
      else if (!nameIsPermitted) {
        if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
        ) ;
        else {
          return false;
        }
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
      else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
      else if (value) {
        return false;
      } else ;
      return true;
    };
    const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]);
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
    };
    const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) {
        switch (trustedTypes.getAttributeType(lcTag, lcName)) {
          case "TrustedHTML": {
            return _createTrustedHTML(value);
          }
          case "TrustedScriptURL": {
            return _createTrustedScriptURL(value);
          }
        }
      }
      return value;
    };
    const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
      try {
        if (namespaceURI) {
          currentNode.setAttributeNS(namespaceURI, name, value);
        } else {
          currentNode.setAttribute(name, value);
        }
        if (_isClobbered(currentNode)) {
          _forceRemove(currentNode);
        } else {
          arrayPop(DOMPurify.removed);
        }
      } catch (_) {
        _removeAttribute(name, currentNode);
      }
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
      const attributes = currentNode.attributes;
      if (!attributes || _isClobbered(currentNode)) {
        return;
      }
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l = attributes.length;
      const lcTag = transformCaseFunc(currentNode.nodeName);
      while (l--) {
        const attr = attributes[l];
        const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
        const lcName = transformCaseFunc(name);
        const initValue = attrValue;
        let value = name === "value" ? initValue : stringTrim(initValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
          _removeAttribute(name, currentNode);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (lcName === "attributename" && stringMatch(value, "href")) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        if (!hookEvent.keepAttr) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          value = _stripTemplateExpressions(value);
        }
        if (!_isValidAttribute(lcTag, lcName, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
        if (value !== initValue) {
          _setAttributeValue(currentNode, name, namespaceURI, value);
        }
      }
      _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
    };
    const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
        _sanitizeElements(shadowNode, fragment);
        _sanitizeAttributes(shadowNode);
        if (_isDocumentFragment(shadowNode.content)) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
        const shadowNodeType = getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType;
        if (shadowNodeType === NODE_TYPE.element) {
          const innerSr = getShadowRoot(shadowNode);
          if (_isDocumentFragment(innerSr)) {
            _sanitizeAttachedShadowRoots(innerSr);
            _sanitizeShadowDOM2(innerSr);
          }
        }
      }
      _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
    };
    const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
      const stack = [{
        node: root,
        shadow: null
      }];
      while (stack.length > 0) {
        const item = stack.pop();
        if (item.shadow) {
          _sanitizeShadowDOM2(item.shadow);
          continue;
        }
        const node = item.node;
        const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
        const isElement = nodeType === NODE_TYPE.element;
        const childNodes = getChildNodes(node);
        if (childNodes) {
          for (let i = childNodes.length - 1; i >= 0; --i) {
            stack.push({
              node: childNodes[i],
              shadow: null
            });
          }
        }
        if (isElement) {
          const rootName = getNodeName ? getNodeName(node) : null;
          if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
            const content = node.content;
            if (_isDocumentFragment(content)) {
              stack.push({
                node: content,
                shadow: null
              });
            }
          }
        }
        if (isElement) {
          const sr = getShadowRoot(node);
          if (_isDocumentFragment(sr)) {
            stack.push({
              node: null,
              shadow: sr
            }, {
              node: sr,
              shadow: null
            });
          }
        }
      }
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        dirty = stringifyValue(dirty);
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (SET_CONFIG) {
        ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
        ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
      } else {
        _parseConfig(cfg);
      }
      if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_TAGS = clone(ALLOWED_TAGS);
      }
      if (hooks.uponSanitizeAttribute.length > 0) {
        ALLOWED_ATTR = clone(ALLOWED_ATTR);
      }
      DOMPurify.removed = [];
      const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
      if (inPlace) {
        _neutralizePatchLinkage(dirty);
        const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
        if (typeof nn === "string") {
          const tagName = transformCaseFunc(nn);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            _neutralizeRoot(dirty);
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
        if (_isClobbered(dirty)) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
        }
        try {
          _sanitizeAttachedShadowRoots(dirty);
        } catch (error) {
          _neutralizeRoot(dirty);
          throw error;
        }
      } else if (_isNode(dirty)) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
        _sanitizeAttachedShadowRoots(importedNode);
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const walkRoot = inPlace ? dirty : body;
      const nodeIterator = _createNodeIterator(walkRoot);
      try {
        while (currentNode = nodeIterator.nextNode()) {
          _sanitizeElements(currentNode, walkRoot);
          _sanitizeAttributes(currentNode);
          if (_isDocumentFragment(currentNode.content)) {
            _sanitizeShadowDOM2(currentNode.content);
          }
        }
      } catch (error) {
        if (inPlace) {
          _neutralizeRoot(dirty);
          arrayForEach(DOMPurify.removed, (entry) => {
            if (entry.element) {
              _neutralizeSubtree(entry.element);
            }
          });
        }
        throw error;
      }
      if (inPlace) {
        arrayForEach(DOMPurify.removed, (entry) => {
          if (entry.element) {
            _neutralizeSubtree(entry.element);
          }
        });
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(dirty);
        }
        return dirty;
      }
      if (RETURN_DOM) {
        if (SAFE_FOR_TEMPLATES) {
          _scrubTemplateExpressions2(body);
        }
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = _stripTemplateExpressions(serializedHTML);
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
      SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
      SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
      SET_CONFIG_ALLOWED_TAGS = null;
      SET_CONFIG_ALLOWED_ATTR = null;
      trustedTypesPolicy = defaultTrustedTypesPolicy;
      emptyHTML = "";
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint, hookFunction) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return void 0;
      }
      if (hookFunction !== void 0) {
        const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
        return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
      }
      return arrayPop(hooks[entryPoint]);
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (!objectHasOwnProperty(hooks, entryPoint)) {
        return;
      }
      hooks[entryPoint] = [];
    };
    DOMPurify.removeAllHooks = function() {
      hooks = _createHooksMap();
    };
    return DOMPurify;
  }
  var entries, setPrototypeOf, isFrozen, getPrototypeOf, getOwnPropertyDescriptor, freeze, seal, create, _ref, apply, construct, arrayForEach, arrayLastIndexOf, arrayPop, arrayPush, arraySplice, arrayIsArray, stringToLowerCase, stringToString, stringMatch, stringReplace, stringIndexOf, stringTrim, numberToString, booleanToString, bigintToString, symbolToString, objectHasOwnProperty, objectToString, regExpTest, typeErrorCreate, html$1, svg$1, svgFilters, svgDisallowed, mathMl$1, mathMlDisallowed, text, html, svg, mathMl, xml, MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR, DATA_ATTR, ARIA_ATTR, IS_ALLOWED_URI, IS_SCRIPT_OR_DATA, ATTR_WHITESPACE, DOCTYPE_NAME, CUSTOM_ELEMENT, ELEMENT_MARKUP_PROBE, COMMENT_MARKUP_PROBE, FALLBACK_TAG_CLOSE, SELF_CLOSING_TAG, NODE_TYPE, getGlobal, _createTrustedTypesPolicy, _createHooksMap, _resolveSetOption, purify;
  var init_purify_es = __esm({
    "node_modules/dompurify/dist/purify.es.mjs"() {
      entries = Object.entries;
      setPrototypeOf = Object.setPrototypeOf;
      isFrozen = Object.isFrozen;
      getPrototypeOf = Object.getPrototypeOf;
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      freeze = Object.freeze;
      seal = Object.seal;
      create = Object.create;
      _ref = typeof Reflect !== "undefined" && Reflect;
      apply = _ref.apply;
      construct = _ref.construct;
      if (!freeze) {
        freeze = function freeze2(x) {
          return x;
        };
      }
      if (!seal) {
        seal = function seal2(x) {
          return x;
        };
      }
      if (!apply) {
        apply = function apply2(func, thisArg) {
          for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }
          return func.apply(thisArg, args);
        };
      }
      if (!construct) {
        construct = function construct2(Func) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          return new Func(...args);
        };
      }
      arrayForEach = unapply(Array.prototype.forEach);
      arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
      arrayPop = unapply(Array.prototype.pop);
      arrayPush = unapply(Array.prototype.push);
      arraySplice = unapply(Array.prototype.splice);
      arrayIsArray = Array.isArray;
      stringToLowerCase = unapply(String.prototype.toLowerCase);
      stringToString = unapply(String.prototype.toString);
      stringMatch = unapply(String.prototype.match);
      stringReplace = unapply(String.prototype.replace);
      stringIndexOf = unapply(String.prototype.indexOf);
      stringTrim = unapply(String.prototype.trim);
      numberToString = unapply(Number.prototype.toString);
      booleanToString = unapply(Boolean.prototype.toString);
      bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
      symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
      objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
      objectToString = unapply(Object.prototype.toString);
      regExpTest = unapply(RegExp.prototype.test);
      typeErrorCreate = unconstruct(TypeError);
      html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
      svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
      svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
      svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
      mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
      mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
      text = freeze(["#text"]);
      html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
      svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
      mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
      xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
      MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
      ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
      TMPLIT_EXPR = seal(/\${[\w\W]*/g);
      DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
      ARIA_ATTR = seal(/^aria-[\-\w]+$/);
      IS_ALLOWED_URI = seal(
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
        // eslint-disable-line no-useless-escape
      );
      IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
      ATTR_WHITESPACE = seal(
        /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
        // eslint-disable-line no-control-regex
      );
      DOCTYPE_NAME = seal(/^html$/i);
      CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
      ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
      COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
      FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
      SELF_CLOSING_TAG = seal(/\/>/i);
      NODE_TYPE = {
        element: 1,
        attribute: 2,
        text: 3,
        cdataSection: 4,
        entityReference: 5,
        // Deprecated
        entityNode: 6,
        // Deprecated
        processingInstruction: 7,
        comment: 8,
        document: 9,
        documentType: 10,
        documentFragment: 11,
        notation: 12
        // Deprecated
      };
      getGlobal = function getGlobal2() {
        return typeof window === "undefined" ? null : window;
      };
      _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
        if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
          return null;
        }
        let suffix = null;
        const ATTR_NAME = "data-tt-policy-suffix";
        if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
          suffix = purifyHostElement.getAttribute(ATTR_NAME);
        }
        const policyName = "dompurify" + (suffix ? "#" + suffix : "");
        try {
          return trustedTypes.createPolicy(policyName, {
            createHTML(html2) {
              return html2;
            },
            createScriptURL(scriptUrl) {
              return scriptUrl;
            }
          });
        } catch (_) {
          console.warn("TrustedTypes policy " + policyName + " could not be created.");
          return null;
        }
      };
      _createHooksMap = function _createHooksMap2() {
        return {
          afterSanitizeAttributes: [],
          afterSanitizeElements: [],
          afterSanitizeShadowDOM: [],
          beforeSanitizeAttributes: [],
          beforeSanitizeElements: [],
          beforeSanitizeShadowDOM: [],
          uponSanitizeAttribute: [],
          uponSanitizeElement: [],
          uponSanitizeShadowNode: []
        };
      };
      _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
        return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
      };
      purify = createDOMPurify();
    }
  });

  // node_modules/isomorphic-dompurify/dist/browser.mjs
  var browser_exports = {};
  __export(browser_exports, {
    addHook: () => addHook,
    clearConfig: () => clearConfig,
    clearWindow: () => clearWindow,
    default: () => browser_default,
    isSupported: () => isSupported,
    isValidAttribute: () => isValidAttribute,
    removeAllHooks: () => removeAllHooks,
    removeHook: () => removeHook,
    removeHooks: () => removeHooks,
    removed: () => removed,
    sanitize: () => sanitize,
    setConfig: () => setConfig,
    version: () => version
  });
  function clearWindow() {
  }
  var browser_default, sanitize, isSupported, addHook, removeHook, removeHooks, removeAllHooks, setConfig, clearConfig, isValidAttribute, version, removed;
  var init_browser = __esm({
    "node_modules/isomorphic-dompurify/dist/browser.mjs"() {
      init_purify_es();
      browser_default = purify;
      sanitize = purify.sanitize.bind(purify);
      isSupported = purify.isSupported;
      addHook = purify.addHook.bind(purify);
      removeHook = purify.removeHook.bind(purify);
      removeHooks = purify.removeHooks.bind(purify);
      removeAllHooks = purify.removeAllHooks.bind(purify);
      setConfig = purify.setConfig.bind(purify);
      clearConfig = purify.clearConfig.bind(purify);
      isValidAttribute = purify.isValidAttribute.bind(purify);
      version = purify.version;
      removed = purify.removed;
    }
  });

  // components/sanitize.js
  function escapeHTML(str) {
    if (typeof str !== "string") return "";
    return str.replace(ESCAPE_RE, (ch) => ESCAPE_MAP[ch]);
  }
  function stripControlChars(str) {
    if (typeof str !== "string") return "";
    return str.replace(CONTROL_RE, "");
  }
  function escapeHTMLAttribute(str) {
    return escapeHTML(stripControlChars(str));
  }
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
  function sanitizeInputType(type) {
    const t = String(type || "text").toLowerCase();
    return SECURE_INPUT_TYPES.has(t) ? t : "text";
  }
  async function loadPurify() {
    if (_purify) return _purify;
    try {
      const mod = await Promise.resolve().then(() => (init_browser(), browser_exports));
      _purify = mod.default || mod;
    } catch {
      _purify = null;
    }
    return _purify;
  }
  async function sanitizeSVG(svgMarkup) {
    if (typeof svgMarkup !== "string") return "";
    const DOMPurify = await loadPurify();
    if (DOMPurify?.sanitize) {
      return DOMPurify.sanitize(svgMarkup, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: SVG_ALLOWED_TAGS,
        ADD_ATTR: SVG_ALLOWED_ATTR,
        FORBID_TAGS: ["script", "foreignObject", "iframe", "object", "embed"],
        FORBID_ATTR: ["onload", "onerror", "onclick", "onmouseover"]
      });
    }
    return svgMarkup.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "");
  }
  function getTrustedPolicy() {
    if (_policy) return _policy;
    if (typeof window !== "undefined" && window.trustedTypes?.createPolicy) {
      _policy = window.trustedTypes.createPolicy("velinstyle", {
        createHTML: (input) => escapeHTML(input)
      });
    }
    return _policy;
  }
  function createSafeHTML(str) {
    const policy = getTrustedPolicy();
    const safe = escapeHTML(stripControlChars(str));
    if (policy?.createHTML) return policy.createHTML(safe);
    return safe;
  }
  var ESCAPE_MAP, ESCAPE_RE, CONTROL_RE, ALLOWED_URL_PROTOCOLS, BLOCKED_DATA_MIME, ALLOWED_DATA_IMAGE, SECURE_INPUT_TYPES, _purify, SVG_ALLOWED_TAGS, SVG_ALLOWED_ATTR, _policy;
  var init_sanitize = __esm({
    "components/sanitize.js"() {
      ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      ESCAPE_RE = /[&<>"']/g;
      CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
      ALLOWED_URL_PROTOCOLS = /* @__PURE__ */ new Set(["http:", "https:", "data:", "mailto:", "tel:"]);
      BLOCKED_DATA_MIME = /^data:(?:text\/html|image\/svg\+xml|application\/xml)/i;
      ALLOWED_DATA_IMAGE = /^data:image\/(png|jpeg|jpg|gif|webp|avif);base64,/i;
      SECURE_INPUT_TYPES = /* @__PURE__ */ new Set(["text", "password", "email", "search", "tel", "url", "number"]);
      _purify = null;
      SVG_ALLOWED_TAGS = ["svg", "g", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "defs", "use", "symbol", "title", "desc", "clipPath", "mask", "linearGradient", "radialGradient", "stop", "pattern", "text", "tspan"];
      SVG_ALLOWED_ATTR = ["viewBox", "xmlns", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "d", "cx", "cy", "r", "rx", "ry", "x", "y", "width", "height", "x1", "y1", "x2", "y2", "points", "transform", "opacity", "class", "id", "href", "xlink:href", "aria-hidden", "aria-label", "aria-labelledby", "role", "focusable", "clip-path", "mask", "offset", "stop-color", "stop-opacity", "gradientUnits", "gradientTransform", "spreadMethod", "fx", "fy", "patternUnits", "patternContentUnits", "preserveAspectRatio"];
      _policy = null;
    }
  });

  // components/velin-modal.js
  var velin_modal_exports = {};
  __export(velin_modal_exports, {
    default: () => velin_modal_default
  });
  var styles, VelinModal, velin_modal_default;
  var init_velin_modal = __esm({
    "components/velin-modal.js"() {
      init_focus_manager();
      init_sanitize();
      styles = `
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
      VelinModal = class extends HTMLElement {
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
          const title = (this.getAttribute("title") || "").trim();
          const safeTitle = escapeHTML(title);
          const dialogLabel = title ? 'aria-labelledby="velin-modal-title"' : `aria-label="${escapeHTML(this.getAttribute("aria-label") || "Dialog")}"`;
          this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="overlay" part="overlay">
        <div class="dialog" role="dialog" aria-modal="true" ${dialogLabel} part="dialog">
          <div class="header" part="header">
            <h2 class="title" id="velin-modal-title"${title ? "" : ' class="velin-sr-only"'}>${safeTitle || "Dialog"}</h2>
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
          requestAnimationFrame(() => {
            const focusable = getFocusableElements(this.shadowRoot);
            if (focusable.length > 0) focusable[0].focus();
          });
        }
        _close() {
          document.removeEventListener("keydown", this._onKeydown);
          clearBackgroundInert(this);
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
          clearBackgroundInert(this);
        }
      };
      customElements.define("velin-modal", VelinModal);
      velin_modal_default = VelinModal;
    }
  });

  // components/velin-dropdown.js
  var velin_dropdown_exports = {};
  __export(velin_dropdown_exports, {
    default: () => velin_dropdown_default
  });
  var styles2, VelinDropdown, velin_dropdown_default;
  var init_velin_dropdown = __esm({
    "components/velin-dropdown.js"() {
      init_focus_manager();
      styles2 = `
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
      VelinDropdown = class extends HTMLElement {
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
      velin_dropdown_default = VelinDropdown;
    }
  });

  // components/velin-accordion.js
  var velin_accordion_exports = {};
  __export(velin_accordion_exports, {
    default: () => velin_accordion_default
  });
  function ensureLightStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById(LIGHT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = LIGHT_STYLE_ID;
    style.textContent = lightStyles;
    document.head.appendChild(style);
  }
  var LIGHT_STYLE_ID, lightStyles, shadowStyles, VelinAccordion, velin_accordion_default;
  var init_velin_accordion = __esm({
    "components/velin-accordion.js"() {
      LIGHT_STYLE_ID = "velin-accordion-light-css";
      lightStyles = `
  velin-accordion {
    display: block;
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    overflow: hidden;
  }
  velin-accordion details {
    border-bottom: 1px solid var(--velin-color-border, #ddd);
  }
  velin-accordion details:last-child {
    border-bottom: none;
  }
  velin-accordion details > summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--velin-space-3, 0.75rem);
    padding: var(--velin-space-4, 1rem);
    min-block-size: 2.75rem;
    font-size: var(--velin-text-base, 1rem);
    font-weight: var(--velin-weight-medium, 500);
    cursor: pointer;
    user-select: none;
    list-style: none;
  }
  velin-accordion details > summary::-webkit-details-marker {
    display: none;
  }
  velin-accordion details > summary::after {
    content: "";
    flex-shrink: 0;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-inline-end: 2px solid currentColor;
    border-block-end: 2px solid currentColor;
    transform: rotate(45deg);
    transition: transform 150ms ease;
  }
  velin-accordion details[open] > summary {
    background: var(--velin-color-primary-subtle, #eff6ff);
    color: var(--velin-color-primary, #2563eb);
  }
  velin-accordion details[open] > summary::after {
    transform: rotate(225deg);
  }
  velin-accordion details > :not(summary) {
    padding: var(--velin-space-4, 1rem) var(--velin-space-5, 1.25rem);
    background: var(--velin-color-surface-dim, var(--velin-color-bg-subtle, #f8fafc));
    color: var(--velin-color-text-muted, #64748b);
    font-size: var(--velin-text-sm, 0.875rem);
    line-height: 1.6;
    border-block-start: 1px solid var(--velin-color-border, #e2e8f0);
  }
`;
      shadowStyles = `
  :host {
    display: block;
  }
`;
      VelinAccordion = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._onToggle = this._onToggle.bind(this);
          this._onKeydown = this._onKeydown.bind(this);
        }
        connectedCallback() {
          ensureLightStyles();
          this.shadowRoot.innerHTML = `
      <style>${shadowStyles}</style>
      <slot></slot>
    `;
          this._exclusive = this.hasAttribute("exclusive");
          this._wireDetails();
          this.addEventListener("toggle", this._onToggle, true);
          this.addEventListener("keydown", this._onKeydown);
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
              summary.setAttribute("aria-expanded", details.open ? "true" : "false");
            }
            if (summary && !summary.hasAttribute("tabindex")) {
              summary.setAttribute("tabindex", "0");
            }
          }
        }
        _onToggle(event) {
          const openedDetail = event.target;
          if (!(openedDetail instanceof HTMLDetailsElement)) return;
          const summary = openedDetail.querySelector("summary");
          if (summary) {
            summary.setAttribute("aria-expanded", openedDetail.open ? "true" : "false");
          }
          if (!this._exclusive || !openedDetail.open) return;
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
            case "Enter":
            case " ":
              return;
            default:
              return;
          }
          summaries[nextIndex].focus();
        }
        disconnectedCallback() {
          this.removeEventListener("toggle", this._onToggle, true);
          this.removeEventListener("keydown", this._onKeydown);
        }
      };
      customElements.define("velin-accordion", VelinAccordion);
      velin_accordion_default = VelinAccordion;
    }
  });

  // components/velin-tabs.js
  var velin_tabs_exports = {};
  __export(velin_tabs_exports, {
    default: () => velin_tabs_default
  });
  var styles3, VelinTabs, velin_tabs_default;
  var init_velin_tabs = __esm({
    "components/velin-tabs.js"() {
      init_focus_manager();
      styles3 = `
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
      VelinTabs = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open", delegatesFocus: true });
          this._onTabClick = this._onTabClick.bind(this);
          this._onKeydown = this._onKeydown.bind(this);
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = `
      <style>${styles3}</style>
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
      velin_tabs_default = VelinTabs;
    }
  });

  // components/velin-toast.js
  var velin_toast_exports = {};
  __export(velin_toast_exports, {
    default: () => velin_toast_default
  });
  var styles4, VelinToast, velin_toast_default;
  var init_velin_toast = __esm({
    "components/velin-toast.js"() {
      init_sanitize();
      styles4 = `
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
      VelinToast = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._container = null;
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = `<style>${styles4}</style>`;
          this._container = this.shadowRoot;
          this.setAttribute("role", "status");
          this.setAttribute("aria-live", "polite");
          this.setAttribute("aria-atomic", "true");
        }
        show({ message, type = "info", duration = 5e3 } = {}) {
          const assertive = type === "error" || type === "danger";
          this.setAttribute("role", assertive ? "alert" : "status");
          this.setAttribute("aria-live", assertive ? "assertive" : "polite");
          const toast = document.createElement("div");
          toast.className = `toast toast--${type}`;
          toast.setAttribute("role", assertive ? "alert" : "status");
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
      velin_toast_default = VelinToast;
    }
  });

  // components/velin-icon.js
  var velin_icon_exports = {};
  __export(velin_icon_exports, {
    default: () => velin_icon_default
  });
  function resolveProviderUrl(provider, variant) {
    const variants = PROVIDER_VARIANTS[provider];
    if (variant && variants?.[variant]) return variants[variant];
    return PROVIDER_CDNS[provider];
  }
  function resolveDefaultSpriteUrl() {
    if (typeof document !== "undefined") {
      const meta = document.querySelector('meta[name="velin-icon-sprite"]');
      const fromMeta = meta?.getAttribute("content")?.trim();
      if (fromMeta) return fromMeta;
      const fromHtml = document.documentElement?.getAttribute("data-velin-icon-sprite")?.trim();
      if (fromHtml) return fromHtml;
    }
    const configured = typeof VelinIcon.defaultSprite === "string" ? VelinIcon.defaultSprite.trim() : "";
    return configured || DEFAULT_SPRITE;
  }
  var PROVIDER_CDNS, PROVIDER_VARIANTS, _svgCache, DEFAULT_SPRITE, VelinIcon, velin_icon_default;
  var init_velin_icon = __esm({
    "components/velin-icon.js"() {
      init_sanitize();
      PROVIDER_CDNS = {
        lucide: "https://unpkg.com/lucide-static@latest/icons/{name}.svg",
        heroicons: "https://unpkg.com/heroicons@2/24/outline/{name}.svg",
        bootstrap: "https://unpkg.com/bootstrap-icons@latest/icons/{name}.svg",
        material: "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/{name}/default/24px.svg",
        fontawesome: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/{name}.svg"
      };
      PROVIDER_VARIANTS = {
        fontawesome: {
          regular: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/regular/{name}.svg",
          solid: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/{name}.svg",
          brands: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/brands/{name}.svg"
        },
        heroicons: {
          outline: "https://unpkg.com/heroicons@2/24/outline/{name}.svg",
          solid: "https://unpkg.com/heroicons@2/24/solid/{name}.svg",
          mini: "https://unpkg.com/heroicons@2/20/solid/{name}.svg"
        }
      };
      _svgCache = /* @__PURE__ */ new Map();
      DEFAULT_SPRITE = "velin-icons.svg";
      VelinIcon = class extends HTMLElement {
        /** @type {string} Relative or absolute sprite URL used when `sprite` attribute is omitted. */
        static defaultSprite = DEFAULT_SPRITE;
        static get observedAttributes() {
          return ["name", "size", "label", "provider", "variant", "sprite"];
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
          const a11y = this._resolveA11y();
          const provider = this.getAttribute("provider");
          const variant = this.getAttribute("variant");
          if (!name) {
            this.innerHTML = "";
            return;
          }
          if (provider && (PROVIDER_CDNS[provider] || PROVIDER_VARIANTS[provider])) {
            this._renderFromCDN(name, size, a11y, provider, variant);
            return;
          }
          this._renderFromSprite(name, size, a11y);
        }
        _resolveA11y() {
          const label = (this.getAttribute("label") || this.getAttribute("aria-label") || "").trim();
          if (label) return { label, hidden: false };
          const hidden = this.getAttribute("aria-hidden") !== "false";
          return { label: "", hidden };
        }
        _renderFromSprite(name, size, a11y) {
          const svgNS = "http://www.w3.org/2000/svg";
          const svg2 = document.createElementNS(svgNS, "svg");
          svg2.setAttribute("width", size);
          svg2.setAttribute("height", size);
          svg2.setAttribute("viewBox", "0 0 24 24");
          svg2.setAttribute("fill", "none");
          svg2.setAttribute("stroke", "currentColor");
          svg2.setAttribute("stroke-width", "2");
          svg2.setAttribute("stroke-linecap", "round");
          svg2.setAttribute("stroke-linejoin", "round");
          this._applyStyle(svg2);
          const use = document.createElementNS(svgNS, "use");
          const spriteAttr = this.getAttribute("sprite");
          const localSymbol = document.getElementById(name);
          const isLocalSymbol = localSymbol && localSymbol.tagName && localSymbol.tagName.toLowerCase() === "symbol";
          let href;
          if (spriteAttr === "" || spriteAttr == null && isLocalSymbol) {
            href = `#${name}`;
          } else {
            const fallback = resolveDefaultSpriteUrl();
            const spriteUrl = sanitizeURL(spriteAttr || fallback) || fallback || DEFAULT_SPRITE;
            href = `${spriteUrl}#${name}`;
          }
          use.setAttribute("href", href);
          svg2.appendChild(use);
          this._applyA11y(svg2, a11y);
          this.innerHTML = "";
          this.appendChild(svg2);
          this._rendered = true;
        }
        async _renderFromCDN(name, size, a11y, provider, variant) {
          const cacheKey = `${provider}:${variant || "default"}:${name}`;
          if (_svgCache.has(cacheKey)) {
            this._injectSVG(_svgCache.get(cacheKey), size, a11y);
            return;
          }
          const template = resolveProviderUrl(provider, variant);
          if (!template) {
            this._renderFromSprite(name, size, a11y);
            return;
          }
          const url = sanitizeURL(template.replace("{name}", name));
          if (!url) {
            this._renderFromSprite(name, size, a11y);
            return;
          }
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`${res.status}`);
            const text2 = await res.text();
            if (!text2.includes("<svg")) throw new Error("Not SVG");
            const clean = await sanitizeSVG(text2);
            _svgCache.set(cacheKey, clean);
            this._injectSVG(clean, size, a11y);
          } catch {
            this._renderFromSprite(name, size, a11y);
          }
        }
        _stripForeignA11y(svg2) {
          svg2.removeAttribute("role");
          svg2.removeAttribute("aria-label");
          svg2.removeAttribute("aria-labelledby");
          svg2.removeAttribute("aria-hidden");
          svg2.querySelector("title")?.remove();
          svg2.querySelector("desc")?.remove();
        }
        _injectSVG(svgText, size, a11y) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, "image/svg+xml");
          const svg2 = doc.querySelector("svg");
          if (!svg2) {
            this.innerHTML = "";
            return;
          }
          this._stripForeignA11y(svg2);
          svg2.setAttribute("width", size);
          svg2.setAttribute("height", size);
          if (!svg2.getAttribute("viewBox")) svg2.setAttribute("viewBox", "0 0 24 24");
          this._applyStyle(svg2);
          this._applyA11y(svg2, a11y);
          this.innerHTML = "";
          this.appendChild(document.importNode(svg2, true));
          this._rendered = true;
        }
        _applyStyle(svg2) {
          svg2.style.display = "inline-block";
          svg2.style.verticalAlign = "middle";
          svg2.style.flexShrink = "0";
        }
        _applyA11y(svg2, a11y) {
          const { label, hidden } = a11y;
          const use = svg2.querySelector("use");
          if (label) {
            svg2.setAttribute("role", "img");
            svg2.setAttribute("aria-label", label);
            svg2.removeAttribute("aria-hidden");
            svg2.removeAttribute("focusable");
            if (use) use.removeAttribute("aria-hidden");
          } else if (hidden) {
            svg2.setAttribute("role", "presentation");
            svg2.setAttribute("aria-hidden", "true");
            svg2.setAttribute("focusable", "false");
            svg2.removeAttribute("aria-label");
            if (use) {
              use.setAttribute("aria-hidden", "true");
              use.setAttribute("focusable", "false");
            }
          }
        }
        static get providers() {
          return Object.keys(PROVIDER_CDNS);
        }
        static registerProvider(name, urlTemplate, variantTemplates) {
          PROVIDER_CDNS[name] = urlTemplate;
          if (variantTemplates && PROVIDER_VARIANTS[name]) {
            Object.assign(PROVIDER_VARIANTS[name], variantTemplates);
          }
        }
      };
      customElements.define("velin-icon", VelinIcon);
      velin_icon_default = VelinIcon;
    }
  });

  // components/velin-drawer.js
  var velin_drawer_exports = {};
  __export(velin_drawer_exports, {
    default: () => velin_drawer_default
  });
  var styles5, VelinDrawer, velin_drawer_default;
  var init_velin_drawer = __esm({
    "components/velin-drawer.js"() {
      init_focus_manager();
      init_sanitize();
      styles5 = `
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
      VelinDrawer = class extends HTMLElement {
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
      <style>${styles5}</style>
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
          requestAnimationFrame(() => {
            const f = getFocusableElements(this.shadowRoot);
            if (f.length) f[0].focus();
          });
        }
        _close() {
          document.removeEventListener("keydown", this._onKey);
          clearBackgroundInert(this);
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
          clearBackgroundInert(this);
        }
      };
      customElements.define("velin-drawer", VelinDrawer);
      velin_drawer_default = VelinDrawer;
    }
  });

  // components/velin-theme-toggle.js
  var velin_theme_toggle_exports = {};
  __export(velin_theme_toggle_exports, {
    default: () => velin_theme_toggle_default
  });
  function ensureThemeStylesheet(slug, base) {
    if (!slug || BUILTIN_THEMES.has(slug)) return;
    if (loadedThemeStylesheets.has(slug)) return;
    const existing = document.querySelector(`link[data-velin-theme-css="${slug}"]`);
    if (existing) {
      loadedThemeStylesheets.add(slug);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${base.replace(/\/$/, "")}/${slug}.min.css`;
    link.setAttribute("data-velin-theme-css", slug);
    document.head.appendChild(link);
    loadedThemeStylesheets.add(slug);
  }
  var THEMES, BUILTIN_THEMES, loadedThemeStylesheets, styles6, VelinThemeToggle, velin_theme_toggle_default;
  var init_velin_theme_toggle = __esm({
    "components/velin-theme-toggle.js"() {
      THEMES = [
        { slug: "", label: "Default (Light)" },
        { slug: "dark", label: "Dark" },
        { slug: "brutalist", label: "Brutalist" },
        { slug: "corporate", label: "Corporate" },
        { slug: "earth", label: "Earth" },
        { slug: "forest", label: "Forest" },
        { slug: "midnight", label: "Midnight" },
        { slug: "neon", label: "Neon" },
        { slug: "nordic", label: "Nordic" },
        { slug: "ocean", label: "Ocean" },
        { slug: "pastel", label: "Pastel" },
        { slug: "retro", label: "Retro" },
        { slug: "sharp", label: "Sharp" },
        { slug: "soft", label: "Soft" },
        { slug: "sunset", label: "Sunset" }
      ];
      BUILTIN_THEMES = /* @__PURE__ */ new Set(["", "dark"]);
      loadedThemeStylesheets = /* @__PURE__ */ new Set();
      styles6 = `
  :host { display: inline-flex; position: relative; }
  .group {
    display: inline-flex; align-items: stretch;
    border: 2px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    background: none;
    overflow: hidden;
  }
  button {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 2.75rem; padding: 0.5rem;
    background: none; border: 0; cursor: pointer;
    color: var(--velin-color-text, #111);
    transition: background 150ms ease;
  }
  button:hover { background: var(--velin-color-surface-dim, #eee); }
  button:focus-visible {
    outline: 3px solid var(--velin-color-focus, #2563eb);
    outline-offset: 2px;
  }
  .toggle { min-width: 2.75rem; }
  .picker {
    min-width: 1.75rem;
    border-inline-start: 1px solid var(--velin-color-border, #ddd);
    color: var(--velin-color-text-muted, #555);
  }
  svg { width: 1.25rem; height: 1.25rem; transition: transform 300ms ease; }
  .chev { width: 0.75rem; height: 0.75rem; }
  :host([theme="dark"]) .sun { display: none; }
  :host(:not([theme="dark"])) .moon { display: none; }
  :host([compact]) .picker { display: none; }
  :host([compact]) .toggle { border-inline-end: 0; }
  @media (prefers-reduced-motion: reduce) { svg { transition: none; } }

  .menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    inset-inline-end: 0;
    z-index: 1000;
    min-width: 12rem;
    padding: 0.375rem;
    background: var(--velin-color-surface-bright, #fff);
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    box-shadow: var(--velin-shadow-lg, 0 12px 32px rgba(0,0,0,0.12));
    list-style: none;
    margin: 0;
    display: none;
    max-height: min(70vh, 24rem);
    overflow-y: auto;
  }
  :host([menu-open]) .menu { display: block; }
  .menu li { margin: 0; }
  .menu button {
    width: 100%;
    justify-content: flex-start;
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    color: var(--velin-color-text, #111);
    border-radius: var(--velin-radius-sm, 0.25rem);
    min-height: 2rem;
    text-align: start;
  }
  .menu button:hover,
  .menu button[aria-current="true"] {
    background: var(--velin-color-primary-subtle, #eef);
    color: var(--velin-color-primary, #2a4cf0);
  }
  .menu button[aria-current="true"] {
    font-weight: 600;
  }
  .menu .swatch {
    width: 0.75rem; height: 0.75rem;
    border-radius: 50%;
    margin-inline-end: 0.5rem;
    background: currentColor;
    border: 1px solid var(--velin-color-border, #ddd);
  }
`;
      VelinThemeToggle = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._onDocClick = this._onDocClick.bind(this);
          this._onKeyDown = this._onKeyDown.bind(this);
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = `
      <style>${styles6}</style>
      <div class="group" part="group">
        <button class="toggle" part="button" aria-label="Toggle dark mode" aria-pressed="false">
          <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
        <button class="picker" part="picker" aria-label="Choose theme" aria-haspopup="menu" aria-expanded="false">
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>
      <ul class="menu" role="menu" aria-label="Theme selection" hidden></ul>
    `;
          this._target = document.querySelector(this.getAttribute("target") || "html");
          this._themesBase = this.getAttribute("themes-base") || "dist/themes";
          this._menu = this.shadowRoot.querySelector(".menu");
          this._toggleBtn = this.shadowRoot.querySelector(".toggle");
          this._pickerBtn = this.shadowRoot.querySelector(".picker");
          this._renderMenu();
          this._initPreference();
          this._syncTogglePressed();
          this._toggleBtn.addEventListener("click", () => this._toggleDarkMode());
          this._pickerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this._toggleMenu();
          });
          document.addEventListener("click", this._onDocClick);
          this.shadowRoot.addEventListener("keydown", this._onKeyDown);
          const prefersDarkMq = window.matchMedia("(prefers-color-scheme: dark)");
          prefersDarkMq.addEventListener("change", () => this._applyFromPreference());
          window.addEventListener("storage", (e) => {
            if (e.key === "velin-theme") this._readStorage();
          });
        }
        disconnectedCallback() {
          document.removeEventListener("click", this._onDocClick);
        }
        _renderMenu() {
          this._menu.innerHTML = THEMES.map((t) => `
      <li role="none">
        <button type="button" role="menuitem" data-theme="${t.slug}">
          <span class="swatch" aria-hidden="true" data-theme-swatch="${t.slug}"></span>
          ${t.label}
        </button>
      </li>
    `).join("");
          this._menu.removeAttribute("hidden");
          this._menu.querySelectorAll("button[data-theme]").forEach((btn) => {
            btn.addEventListener("click", () => {
              const slug = btn.getAttribute("data-theme");
              this._applyTheme(slug, { persist: true });
              this._closeMenu();
            });
          });
        }
        _toggleMenu() {
          if (this.hasAttribute("menu-open")) this._closeMenu();
          else this._openMenu();
        }
        _openMenu() {
          this.setAttribute("menu-open", "");
          this._pickerBtn.setAttribute("aria-expanded", "true");
          this._highlightActive();
          const first = this._menu.querySelector("button[data-theme]");
          if (first) first.focus();
        }
        _closeMenu() {
          this.removeAttribute("menu-open");
          this._pickerBtn.setAttribute("aria-expanded", "false");
        }
        _onDocClick(e) {
          if (!this.hasAttribute("menu-open")) return;
          if (e.composedPath().includes(this)) return;
          this._closeMenu();
        }
        _onKeyDown(e) {
          if (!this.hasAttribute("menu-open")) return;
          if (e.key === "Escape") {
            e.preventDefault();
            this._closeMenu();
            this._pickerBtn.focus();
            return;
          }
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const items = Array.from(this._menu.querySelectorAll("button[data-theme]"));
            const idx = items.indexOf(this.shadowRoot.activeElement);
            const next = e.key === "ArrowDown" ? items[(idx + 1) % items.length] : items[(idx - 1 + items.length) % items.length];
            next?.focus();
          }
        }
        _highlightActive() {
          const current = this._currentSlug();
          this._menu.querySelectorAll("button[data-theme]").forEach((btn) => {
            const slug = btn.getAttribute("data-theme");
            if (slug === current) btn.setAttribute("aria-current", "true");
            else btn.removeAttribute("aria-current");
          });
        }
        _currentSlug() {
          if (!this._target) return "";
          const value = this._target.getAttribute("data-velin-theme");
          if (!value || value === "light") return "";
          return value;
        }
        _initPreference() {
          const stored = localStorage.getItem("velin-theme");
          if (stored) {
            this._applyTheme(stored, { persist: false });
            return;
          }
          this._applyFromPreference();
        }
        _readStorage() {
          const stored = localStorage.getItem("velin-theme");
          this._applyTheme(stored || "", { persist: false });
        }
        _applyFromPreference() {
          if (localStorage.getItem("velin-theme")) return;
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          this._applyTheme(prefersDark ? "dark" : "", { persist: false });
        }
        _applyTheme(slug, { persist }) {
          const normalized = !slug || slug === "light" ? "" : slug;
          if (!this._target) return;
          if (!normalized) {
            this._target.removeAttribute("data-velin-theme");
            this.removeAttribute("theme");
          } else {
            this._target.setAttribute("data-velin-theme", normalized);
            this.setAttribute("theme", normalized === "dark" ? "dark" : normalized);
            ensureThemeStylesheet(normalized, this._themesBase);
          }
          if (persist) {
            if (!normalized) localStorage.removeItem("velin-theme");
            else localStorage.setItem("velin-theme", normalized);
          }
          this._highlightActive();
          this.dispatchEvent(new CustomEvent("velin-theme-change", {
            bubbles: true,
            detail: { theme: normalized || "light", dark: normalized === "dark", slug: normalized }
          }));
        }
        _syncTogglePressed() {
          const dark = this._currentSlug() === "dark";
          this._toggleBtn?.setAttribute("aria-pressed", dark ? "true" : "false");
        }
        _toggleDarkMode() {
          const current = this._currentSlug();
          const next = current === "dark" ? "" : "dark";
          this._applyTheme(next, { persist: true });
          this._syncTogglePressed();
        }
      };
      customElements.define("velin-theme-toggle", VelinThemeToggle);
      velin_theme_toggle_default = VelinThemeToggle;
    }
  });

  // components/velin-popover.js
  var velin_popover_exports = {};
  __export(velin_popover_exports, {
    default: () => velin_popover_default
  });
  var styles7, popoverId, VelinPopover, velin_popover_default;
  var init_velin_popover = __esm({
    "components/velin-popover.js"() {
      init_sanitize();
      init_focus_manager();
      styles7 = `
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
      popoverId = 0;
      VelinPopover = class extends HTMLElement {
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
          const titleId = title ? `${this._popoverId}-title` : "";
          this.shadowRoot.innerHTML = `
      <style>${styles7}</style>
      <slot name="trigger"></slot>
      <div class="popover popover--${placement}" id="${this._popoverId}" role="${role}" part="popover"${titleId ? ` aria-labelledby="${titleId}"` : ""}>
        ${title ? `<div class="popover__title" id="${titleId}" part="title">${escapeHTML(title)}</div>` : ""}
        <slot></slot>
      </div>
    `;
          const popoverEl = this.shadowRoot.querySelector(".popover");
          if (!title && popoverEl) {
            const fallback = this.getAttribute("aria-label") || (role === "tooltip" ? "Tooltip" : "Popover");
            popoverEl.setAttribute("aria-label", fallback);
          }
          const triggerSlot = this.shadowRoot.querySelector('slot[name="trigger"]');
          triggerSlot.addEventListener("slotchange", () => this._wireTrigger(triggerType));
          this._wireTrigger(triggerType);
        }
        _ensureTriggerInteractive(trigger) {
          const tag = trigger.tagName;
          if (tag !== "BUTTON" && tag !== "A" && trigger.getAttribute("role") !== "button") {
            trigger.setAttribute("role", "button");
            if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", "0");
          }
        }
        _onTriggerKey(e) {
          if (e.key === "Escape") {
            this.close();
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.toggle();
          }
        }
        _wireTrigger(triggerType) {
          const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
          if (!trigger) return;
          this._ensureTriggerInteractive(trigger);
          const isHover = triggerType === "hover";
          trigger.setAttribute("aria-haspopup", isHover ? "true" : "dialog");
          trigger.setAttribute("aria-expanded", this.hasAttribute("open") ? "true" : "false");
          if (this._isDialog) {
            trigger.setAttribute("aria-controls", this._popoverId);
          }
          trigger.removeEventListener("keydown", this._onTriggerKeyBound);
          this._onTriggerKeyBound = this._onTriggerKeyBound || this._onTriggerKey.bind(this);
          trigger.addEventListener("keydown", this._onTriggerKeyBound);
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
      velin_popover_default = VelinPopover;
    }
  });

  // components/velin-copy.js
  var velin_copy_exports = {};
  __export(velin_copy_exports, {
    default: () => velin_copy_default
  });
  var styles8, VelinCopy, velin_copy_default;
  var init_velin_copy = __esm({
    "components/velin-copy.js"() {
      init_sanitize();
      styles8 = `
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
      VelinCopy = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          const label = escapeHTML(this.getAttribute("label") || "");
          this.shadowRoot.innerHTML = `
      <style>${styles8}</style>
      <button part="button" aria-label="Copy">
        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
        <svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ${label ? `<span>${label}</span>` : ""}
      </button>
    `;
          this.shadowRoot.querySelector("button").addEventListener("click", () => this._copy());
        }
        _getCopyText() {
          return this.getAttribute("value") || this.getAttribute("text") || this.dataset.source || "";
        }
        async _copy() {
          const value = this._getCopyText();
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
      if (!customElements.get("velin-copy")) {
        customElements.define("velin-copy", VelinCopy);
      }
      velin_copy_default = VelinCopy;
    }
  });

  // components/velin-scroll-top.js
  var velin_scroll_top_exports = {};
  __export(velin_scroll_top_exports, {
    default: () => velin_scroll_top_default
  });
  var styles9, VelinScrollTop, velin_scroll_top_default;
  var init_velin_scroll_top = __esm({
    "components/velin-scroll-top.js"() {
      styles9 = `
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
      VelinScrollTop = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._onScroll = this._onScroll.bind(this);
        }
        connectedCallback() {
          const threshold = parseInt(this.getAttribute("threshold") || "300", 10);
          this._threshold = threshold;
          this.shadowRoot.innerHTML = `
      <style>${styles9}</style>
      <button part="button" aria-label="Scroll to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
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
      velin_scroll_top_default = VelinScrollTop;
    }
  });

  // components/velin-carousel.js
  var velin_carousel_exports = {};
  __export(velin_carousel_exports, {
    default: () => velin_carousel_default
  });
  var styles10, VelinCarousel, velin_carousel_default;
  var init_velin_carousel = __esm({
    "components/velin-carousel.js"() {
      styles10 = `
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
      VelinCarousel = class extends HTMLElement {
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
      <style>${styles10}</style>
      <div class="track" role="group" aria-roledescription="carousel" part="track"><slot></slot></div>
      <div class="controls" part="controls">
        <button class="prev" aria-label="Previous slide" part="prev">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="next" aria-label="Next slide" part="next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><polyline points="9 6 15 12 9 18"/></svg>
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
      velin_carousel_default = VelinCarousel;
    }
  });

  // components/velin-collapse.js
  var velin_collapse_exports = {};
  __export(velin_collapse_exports, {
    default: () => velin_collapse_default
  });
  function isButtonLike(el) {
    const tag = el.tagName;
    return tag === "BUTTON" || tag === "A" && el.hasAttribute("href") || el.getAttribute("role") === "button";
  }
  var styles11, collapseId, VelinCollapse, velin_collapse_default;
  var init_velin_collapse = __esm({
    "components/velin-collapse.js"() {
      styles11 = `
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
      collapseId = 0;
      VelinCollapse = class extends HTMLElement {
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
          this.shadowRoot.innerHTML = "<style>" + styles11 + '</style><slot name="trigger"></slot><div class="content" id="' + panelId + '" part="content"><div class="inner"><slot></slot></div></div>';
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
      velin_collapse_default = VelinCollapse;
    }
  });

  // components/velin-scrollspy.js
  var velin_scrollspy_exports = {};
  __export(velin_scrollspy_exports, {
    default: () => velin_scrollspy_default
  });
  var VelinScrollspy, velin_scrollspy_default;
  var init_velin_scrollspy = __esm({
    "components/velin-scrollspy.js"() {
      VelinScrollspy = class extends HTMLElement {
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
            (entries2) => {
              for (const entry of entries2) {
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
      velin_scrollspy_default = VelinScrollspy;
    }
  });

  // components/velin-tooltip.js
  var velin_tooltip_exports = {};
  __export(velin_tooltip_exports, {
    VelinTooltip: () => VelinTooltip,
    VelinTooltipWC: () => VelinTooltipWC,
    default: () => velin_tooltip_default
  });
  var styles12, tooltipId, VelinTooltip, VelinTooltipWC, velin_tooltip_default;
  var init_velin_tooltip = __esm({
    "components/velin-tooltip.js"() {
      init_sanitize();
      styles12 = `
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
      tooltipId = 0;
      VelinTooltip = class extends HTMLElement {
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
      <style>${styles12}</style>
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
      VelinTooltipWC = class _VelinTooltipWC extends VelinTooltip {
        static _warned = false;
        connectedCallback() {
          if (!_VelinTooltipWC._warned && typeof console !== "undefined" && console.warn) {
            _VelinTooltipWC._warned = true;
            console.warn("[velinstyle] <velin-tooltip-wc> is deprecated; use <velin-tooltip> instead.");
          }
          super.connectedCallback();
        }
      };
      if (!customElements.get("velin-tooltip")) {
        customElements.define("velin-tooltip", VelinTooltip);
      }
      if (!customElements.get("velin-tooltip-wc")) {
        customElements.define("velin-tooltip-wc", VelinTooltipWC);
      }
      velin_tooltip_default = VelinTooltip;
    }
  });

  // components/a11y-utils.js
  var a11y_utils_exports = {};
  __export(a11y_utils_exports, {
    announce: () => announce,
    ensureAriaLabel: () => ensureAriaLabel,
    getAnnouncer: () => getAnnouncer,
    liveDotLabel: () => liveDotLabel,
    respectReducedMotion: () => respectReducedMotion,
    syncExpanded: () => syncExpanded
  });
  function getAnnouncer() {
    if (typeof document === "undefined") return null;
    if (_announcer?.isConnected) return _announcer;
    _announcer = document.querySelector("velin-announcer");
    if (!_announcer) {
      _announcer = document.createElement("velin-announcer");
      document.body.appendChild(_announcer);
    }
    return _announcer;
  }
  function announce(message, priority = "polite") {
    const el = getAnnouncer();
    if (!el || typeof el.announce !== "function") return;
    el.announce(message, { assertive: priority === "assertive" });
  }
  function syncExpanded(trigger, panel) {
    if (!trigger || !panel) return;
    const open = trigger.getAttribute("aria-expanded") === "true";
    panel.hidden = !open;
    if (panel.id) trigger.setAttribute("aria-controls", panel.id);
  }
  function ensureAriaLabel(el, label) {
    if (!el || !label) return;
    if (!el.getAttribute("aria-label")?.trim()) el.setAttribute("aria-label", label);
  }
  function respectReducedMotion(fn, fallback) {
    const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && fallback) fallback();
    else fn();
  }
  function liveDotLabel(status) {
    const map = {
      live: "Live",
      idle: "Idle",
      error: "Error",
      offline: "Offline",
      connecting: "Connecting"
    };
    return map[String(status || "live").toLowerCase()] || status || "Live";
  }
  var _announcer;
  var init_a11y_utils = __esm({
    "components/a11y-utils.js"() {
    }
  });

  // components/velin-lightbox.js
  var velin_lightbox_exports = {};
  __export(velin_lightbox_exports, {
    default: () => velin_lightbox_default
  });
  var styles13, VelinLightbox, velin_lightbox_default;
  var init_velin_lightbox = __esm({
    "components/velin-lightbox.js"() {
      init_focus_manager();
      init_a11y_utils();
      init_sanitize();
      styles13 = `
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
      VelinLightbox = class extends HTMLElement {
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
      <style>${styles13}</style>
      <slot></slot>
      <div class="overlay" role="dialog" aria-modal="true" aria-label="Image lightbox" aria-roledescription="lightbox" part="overlay">
        <button class="nav nav--prev" aria-label="Previous">&#8249;</button>
        <div class="content" part="content"></div>
        <button class="nav nav--next" aria-label="Next">&#8250;</button>
        <button class="close" aria-label="Close">&times;</button>
        <div class="counter" part="counter" aria-live="polite" aria-atomic="true"></div>
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
          setBackgroundInert(this);
          this._render();
          const overlay = this.shadowRoot.querySelector(".overlay");
          overlay.removeEventListener("keydown", this._onTrapKey);
          overlay.addEventListener("keydown", this._onTrapKey);
          this.shadowRoot.querySelector(".close").focus();
        }
        close() {
          this.removeAttribute("open");
          clearBackgroundInert(this);
          if (this._previousFocus) {
            this._previousFocus.focus();
            this._previousFocus = null;
          }
          this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true }));
        }
        disconnectedCallback() {
          clearBackgroundInert(this);
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
          const label = `${this._index + 1} / ${this._items.length}`;
          counter.textContent = label;
          announce(`Slide ${label}`, "polite");
        }
      };
      customElements.define("velin-lightbox", VelinLightbox);
      velin_lightbox_default = VelinLightbox;
    }
  });

  // components/velin-stepper.js
  var velin_stepper_exports = {};
  __export(velin_stepper_exports, {
    VelinStepper: () => VelinStepper,
    VelinStepperWC: () => VelinStepperWC,
    default: () => velin_stepper_default
  });
  var styles14, VelinStepper, VelinStepperWC, velin_stepper_default;
  var init_velin_stepper = __esm({
    "components/velin-stepper.js"() {
      init_sanitize();
      styles14 = `
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
  .velin-sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }
`;
      VelinStepper = class extends HTMLElement {
        static get observedAttributes() {
          return ["active", "aria-label", "labels"];
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
          const listLabel = this.getAttribute("aria-label") || "Progress";
          const stepsHTML = labels.map((label, i) => {
            const state = i < this._current ? "completed" : i === this._current ? "active" : "";
            const status = i < this._current ? "completed" : i === this._current ? "current step" : "upcoming";
            const marker = i < this._current ? '<span class="velin-sr-only">Completed</span><span aria-hidden="true">&#10003;</span>' : `<span aria-hidden="true">${i + 1}</span>`;
            const ariaCurrent = i === this._current ? ' aria-current="step"' : "";
            const itemLabel = label ? `${label}, ${status}` : `Step ${i + 1}, ${status}`;
            return `<div class="step ${state}" role="listitem" aria-label="${escapeHTML(itemLabel)}"${ariaCurrent}><span class="step__marker">${marker}</span><span class="step__label">${escapeHTML(label)}</span></div>`;
          }).join("");
          this.shadowRoot.innerHTML = `
      <style>${styles14}</style>
      <div class="steps" role="list" aria-label="${escapeHTML(listLabel)}" part="steps">${stepsHTML}</div>
      <div class="panels" part="panels"><slot></slot></div>
    `;
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
      VelinStepperWC = class _VelinStepperWC extends VelinStepper {
        static _warned = false;
        connectedCallback() {
          if (!_VelinStepperWC._warned && typeof console !== "undefined" && console.warn) {
            _VelinStepperWC._warned = true;
            console.warn("[velinstyle] <velin-stepper-wc> is deprecated; use <velin-stepper> instead.");
          }
          super.connectedCallback();
        }
      };
      if (!customElements.get("velin-stepper")) {
        customElements.define("velin-stepper", VelinStepper);
      }
      if (!customElements.get("velin-stepper-wc")) {
        customElements.define("velin-stepper-wc", VelinStepperWC);
      }
      velin_stepper_default = VelinStepper;
    }
  });

  // components/velin-dialog.js
  var velin_dialog_exports = {};
  __export(velin_dialog_exports, {
    default: () => velin_dialog_default
  });
  var styles15, VelinDialog, velin_dialog_default;
  var init_velin_dialog = __esm({
    "components/velin-dialog.js"() {
      init_sanitize();
      styles15 = `
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
      VelinDialog = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._resolve = null;
          this._previousFocus = null;
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = `<style>${styles15}</style><dialog part="dialog"></dialog>`;
          const dialog = this.shadowRoot.querySelector("dialog");
          if (dialog) {
            dialog.setAttribute("aria-label", this.getAttribute("aria-label") || "Dialog");
          }
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
          const titleId = `velin-dialog-title-${Math.random().toString(36).slice(2, 9)}`;
          dialog.innerHTML = `
      <div class="header"><h3 class="title" id="${titleId}">${safeTitle}</h3><button class="close" aria-label="Close">&times;</button></div>
      <div class="body"><p>${safeMsg}</p>${input}</div>
      <div class="footer">${footerBtns}</div>
    `;
          dialog.setAttribute("aria-modal", "true");
          dialog.removeAttribute("aria-label");
          dialog.setAttribute("aria-labelledby", titleId);
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
          const detail = { value };
          this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true, detail }));
          this.dispatchEvent(new CustomEvent("velin-dialog-close", { bubbles: true, detail }));
        }
      };
      customElements.define("velin-dialog", VelinDialog);
      velin_dialog_default = VelinDialog;
    }
  });

  // components/velin-countdown.js
  var velin_countdown_exports = {};
  __export(velin_countdown_exports, {
    default: () => velin_countdown_default
  });
  var styles16, VelinCountdown, velin_countdown_default;
  var init_velin_countdown = __esm({
    "components/velin-countdown.js"() {
      init_sanitize();
      styles16 = `
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
      VelinCountdown = class extends HTMLElement {
        static get observedAttributes() {
          return ["datetime"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._timer = null;
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = `<style>${styles16}</style><div class="wrap"></div>`;
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
          let html2 = "";
          if (showDays) html2 += `<div class="segment" part="days"><span class="value">${pad(days)}</span><span class="label">${lDays}</span></div><span class="separator">:</span>`;
          html2 += `<div class="segment" part="hours"><span class="value">${pad(hours)}</span><span class="label">${lHours}</span></div><span class="separator">:</span>`;
          html2 += `<div class="segment" part="minutes"><span class="value">${pad(minutes)}</span><span class="label">${lMin}</span></div><span class="separator">:</span>`;
          html2 += `<div class="segment" part="seconds"><span class="value">${pad(seconds)}</span><span class="label">${lSec}</span></div>`;
          if (this._wrap) {
            this._wrap.innerHTML = html2;
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
      velin_countdown_default = VelinCountdown;
    }
  });

  // components/velin-progress-ring.js
  var velin_progress_ring_exports = {};
  __export(velin_progress_ring_exports, {
    default: () => velin_progress_ring_default
  });
  var styles17, VelinProgressRing, velin_progress_ring_default;
  var init_velin_progress_ring = __esm({
    "components/velin-progress-ring.js"() {
      styles17 = `
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
      VelinProgressRing = class extends HTMLElement {
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
      <style>${styles17}</style>
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
      velin_progress_ring_default = VelinProgressRing;
    }
  });

  // components/velin-persist.js
  var velin_persist_exports = {};
  __export(velin_persist_exports, {
    default: () => velin_persist_default
  });
  var KEY_RE, MAX_ENTRY_SIZE, VelinPersist, velin_persist_default;
  var init_velin_persist = __esm({
    "components/velin-persist.js"() {
      KEY_RE = /^[a-zA-Z0-9_-]{1,64}$/;
      MAX_ENTRY_SIZE = 64 * 1024;
      VelinPersist = class extends HTMLElement {
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
      velin_persist_default = VelinPersist;
    }
  });

  // components/velin-combobox.js
  var velin_combobox_exports = {};
  __export(velin_combobox_exports, {
    default: () => velin_combobox_default
  });
  var styles18, VelinCombobox, velin_combobox_default;
  var init_velin_combobox = __esm({
    "components/velin-combobox.js"() {
      init_focus_manager();
      init_sanitize();
      styles18 = `
  :host { display: inline-block; position: relative; }
  .listbox {
    position: absolute; z-index: var(--velin-z-dropdown, 100);
    inset-block-start: 100%; inset-inline-start: 0;
    min-inline-size: 100%; margin-block-start: var(--velin-space-1, 0.25rem);
    padding-block: var(--velin-space-1, 0.25rem);
    background: var(--velin-color-surface-bright, #fff);
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    box-shadow: var(--velin-shadow-lg, 0 10px 15px rgba(0,0,0,0.08));
    opacity: 0; visibility: hidden;
    transition: opacity 150ms ease, visibility 150ms ease;
  }
  :host([open]) .listbox { opacity: 1; visibility: visible; }
  ::slotted([role="option"]) {
    display: block; inline-size: 100%;
    padding: var(--velin-space-2, 0.5rem) var(--velin-space-4, 1rem);
    min-block-size: 2.5rem;
    text-align: start; background: none; border: none;
    cursor: pointer; font-size: var(--velin-text-base, 1rem);
  }
  ::slotted([role="option"][aria-selected="true"]) {
    background: var(--velin-color-surface-dim, #eee);
  }
`;
      VelinCombobox = class extends HTMLElement {
        static get observedAttributes() {
          return ["open", "aria-label"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open", delegatesFocus: true });
          this._onDocClick = this._onDocClick.bind(this);
          this._onKey = this._onKey.bind(this);
        }
        connectedCallback() {
          const listId = `velin-combobox-list-${Math.random().toString(36).slice(2, 9)}`;
          this._listId = listId;
          const listLabel = escapeHTML(this.getAttribute("aria-label") || "Options");
          this.shadowRoot.innerHTML = `
      <style>${styles18}</style>
      <slot name="trigger"></slot>
      <div class="listbox" id="${listId}" role="listbox" aria-label="${listLabel}" part="listbox"><slot></slot></div>
    `;
          const triggerSlot = this.shadowRoot.querySelector('slot[name="trigger"]');
          triggerSlot.addEventListener("slotchange", () => this._wireTrigger());
          this.shadowRoot.querySelector("slot:not([name])")?.addEventListener("slotchange", () => this._wireOptions());
          this._wireTrigger();
          this._wireOptions();
          this.addEventListener("keydown", this._onKey);
        }
        _wireTrigger() {
          const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
          if (!trigger) return;
          trigger.setAttribute("role", "combobox");
          trigger.setAttribute("aria-expanded", this.hasAttribute("open") ? "true" : "false");
          trigger.setAttribute("aria-controls", this._listId);
          trigger.setAttribute("aria-autocomplete", "list");
          if (!trigger.id) trigger.id = `velin-combobox-trigger-${Math.random().toString(36).slice(2, 9)}`;
          const list = this.shadowRoot.querySelector(".listbox");
          if (list) list.setAttribute("aria-labelledby", trigger.id);
          if (!trigger.dataset.velinComboWired) {
            trigger.dataset.velinComboWired = "1";
            trigger.addEventListener("click", () => this.toggle());
            trigger.addEventListener("keydown", (e) => {
              if (e.key === "ArrowDown" || e.key === "Enter") {
                e.preventDefault();
                this.open();
              }
            });
          }
        }
        _wireOptions() {
          const options = this._getOptions();
          options.forEach((el, i) => {
            el.setAttribute("role", "option");
            el.setAttribute("aria-selected", el.hasAttribute("selected") ? "true" : "false");
            el.setAttribute("tabindex", i === 0 ? "0" : "-1");
          });
        }
        _getOptions() {
          const slot = this.shadowRoot.querySelector("slot:not([name])");
          return slot ? slot.assignedElements().filter((el) => !el.hidden) : [];
        }
        toggle() {
          this.hasAttribute("open") ? this.close() : this.open();
        }
        open() {
          this.setAttribute("open", "");
          const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
          if (trigger) trigger.setAttribute("aria-expanded", "true");
          document.addEventListener("click", this._onDocClick, true);
          requestAnimationFrame(() => {
            const opts = this._getOptions();
            if (opts.length) opts[0].focus();
          });
        }
        close() {
          this.removeAttribute("open");
          const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
          if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();
          }
          document.removeEventListener("click", this._onDocClick, true);
          this.dispatchEvent(new CustomEvent("velin-close", { bubbles: true }));
        }
        _onDocClick(e) {
          if (!this.contains(e.target)) this.close();
        }
        _onKey(e) {
          if (!this.hasAttribute("open")) return;
          if (e.key === "Escape") {
            this.close();
            return;
          }
          const options = this._getOptions();
          if (!options.length) return;
          rovingTabindex(this, options, e);
          if (e.key === "Enter" && options.includes(e.target)) {
            this._selectOption(e.target);
            this.close();
          }
        }
        _selectOption(el) {
          this._getOptions().forEach((o) => o.setAttribute("aria-selected", o === el ? "true" : "false"));
          const trigger = this.shadowRoot.querySelector('slot[name="trigger"]')?.assignedElements()[0];
          if (trigger && "value" in trigger) trigger.value = el.textContent?.trim() || "";
          this.dispatchEvent(new CustomEvent("velin-select", { bubbles: true, detail: { option: el } }));
        }
        attributeChangedCallback(name) {
          if (name === "open") this._wireTrigger();
          if (name === "aria-label") {
            const list = this.shadowRoot?.querySelector(".listbox");
            if (list) list.setAttribute("aria-label", escapeHTML(this.getAttribute("aria-label") || "Options"));
          }
        }
        disconnectedCallback() {
          document.removeEventListener("click", this._onDocClick, true);
        }
      };
      customElements.define("velin-combobox", VelinCombobox);
      velin_combobox_default = VelinCombobox;
    }
  });

  // components/velin-bottom-nav.js
  var velin_bottom_nav_exports = {};
  __export(velin_bottom_nav_exports, {
    default: () => velin_bottom_nav_default
  });
  var styles19, VelinBottomNav, velin_bottom_nav_default;
  var init_velin_bottom_nav = __esm({
    "components/velin-bottom-nav.js"() {
      init_sanitize();
      styles19 = `
  :host { display: block; }
  nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: var(--velin-space-2, 0.5rem) var(--velin-space-4, 1rem);
    padding-block-end: max(var(--velin-space-2, 0.5rem), env(safe-area-inset-bottom, 0px));
    background: var(--velin-color-surface-bright, #fff);
    border-block-start: 1px solid var(--velin-color-border, #ddd);
  }
  ::slotted(a), ::slotted(button) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--velin-space-1, 0.25rem);
    min-inline-size: 2.75rem;
    min-block-size: 2.75rem;
    padding: var(--velin-space-2, 0.5rem);
    font-size: var(--velin-text-xs, 0.75rem);
    color: var(--velin-color-text-muted, #666);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
  }
  ::slotted([current]) {
    color: var(--velin-color-primary, #2563eb);
    font-weight: var(--velin-weight-semibold, 600);
  }
`;
      VelinBottomNav = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._onSlot = this._onSlot.bind(this);
        }
        connectedCallback() {
          const label = escapeHTML(this.getAttribute("aria-label") || "Bottom navigation");
          this.shadowRoot.innerHTML = `
      <style>${styles19}</style>
      <nav role="navigation" aria-label="${label}"><slot></slot></nav>
    `;
          const slot = this.shadowRoot.querySelector("slot");
          slot.addEventListener("slotchange", this._onSlot);
          this._onSlot();
        }
        _onSlot() {
          this._syncCurrent();
          this._syncSlotLabels();
        }
        _syncSlotLabels() {
          const slot = this.shadowRoot?.querySelector("slot");
          if (!slot) return;
          slot.assignedElements().forEach((el) => {
            const text2 = el.textContent?.replace(/\s+/g, " ").trim();
            if (!text2 && !el.getAttribute("aria-label")) {
              const hint = el.getAttribute("data-nav") || el.getAttribute("title") || el.getAttribute("aria-labelledby");
              if (hint) el.setAttribute("aria-label", hint);
            }
            if (el.tagName === "A" && !el.getAttribute("href")) {
              el.setAttribute("role", "button");
              if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
              if (!el._velinBottomNavKey) {
                el._velinBottomNavKey = (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    el.click();
                  }
                };
                el.addEventListener("keydown", el._velinBottomNavKey);
              }
            }
          });
        }
        _syncCurrent() {
          const slot = this.shadowRoot?.querySelector("slot");
          if (!slot) return;
          const hostKey = this.getAttribute("current");
          slot.assignedElements().forEach((el) => {
            const active = el.hasAttribute("current") || hostKey && (el.dataset.nav === hostKey || el.getAttribute("data-nav") === hostKey);
            if (active) {
              el.setAttribute("current", "");
              el.setAttribute("aria-current", "page");
            } else {
              el.removeAttribute("current");
              el.removeAttribute("aria-current");
            }
          });
        }
        static get observedAttributes() {
          return ["aria-label", "current"];
        }
        attributeChangedCallback(name) {
          if (name === "aria-label") {
            const nav = this.shadowRoot?.querySelector("nav");
            if (nav) nav.setAttribute("aria-label", escapeHTML(this.getAttribute("aria-label") || "Bottom navigation"));
          }
          if (name === "current") this._syncCurrent();
        }
      };
      customElements.define("velin-bottom-nav", VelinBottomNav);
      velin_bottom_nav_default = VelinBottomNav;
    }
  });

  // components/shadow-a11y-styles.js
  var SHADOW_A11Y_STYLES;
  var init_shadow_a11y_styles = __esm({
    "components/shadow-a11y-styles.js"() {
      SHADOW_A11Y_STYLES = `
  :host { display: block; }
  button, [role="button"] {
    min-inline-size: 2.75rem;
    min-block-size: 2.75rem;
    cursor: pointer;
  }
  button:focus-visible, [role="button"]:focus-visible {
    outline: 3px solid var(--velin-color-focus, #2563eb);
    outline-offset: 2px;
  }
  @media (forced-colors: active) {
    button, [role="button"] {
      border: 1px solid ButtonText;
    }
  }
`;
    }
  });

  // components/velin-sheet.js
  var velin_sheet_exports = {};
  __export(velin_sheet_exports, {
    default: () => velin_sheet_default
  });
  var styles20, VelinSheet, velin_sheet_default;
  var init_velin_sheet = __esm({
    "components/velin-sheet.js"() {
      init_focus_manager();
      init_sanitize();
      init_shadow_a11y_styles();
      styles20 = `
  ${SHADOW_A11Y_STYLES}
  :host { display: contents; }
  .overlay {
    position: fixed; inset: 0; z-index: var(--velin-z-overlay, 400);
    background: var(--velin-color-overlay, rgba(0,0,0,0.4));
    opacity: 0; visibility: hidden;
    transition: opacity 200ms ease, visibility 200ms ease;
  }
  :host([open]) .overlay { opacity: 1; visibility: visible; }
  .sheet {
    position: fixed; inset-inline: 0; inset-block-end: 0;
    z-index: var(--velin-z-modal, 500);
    max-block-size: min(85vh, 32rem);
    background: var(--velin-color-surface-bright, #fff);
    border-radius: var(--velin-radius-lg, 0.75rem) var(--velin-radius-lg, 0.75rem) 0 0;
    box-shadow: var(--velin-shadow-xl, 0 -4px 24px rgba(0,0,0,0.12));
    display: flex; flex-direction: column;
    transform: translateY(100%);
    transition: transform 250ms ease;
    padding-block-end: env(safe-area-inset-bottom, 0px);
  }
  :host([open]) .sheet { transform: translateY(0); }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--velin-space-4, 1rem) var(--velin-space-5, 1.25rem);
    border-bottom: 1px solid var(--velin-color-border, #ddd);
  }
  .title { font-size: var(--velin-text-lg, 1.25rem); font-weight: 600; margin: 0; }
  .body { flex: 1; overflow-y: auto; padding: var(--velin-space-5, 1.25rem); }
  @media (prefers-reduced-motion: reduce) { .overlay, .sheet { transition: none; } }
`;
      VelinSheet = class extends HTMLElement {
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
          const title = escapeHTML(this.getAttribute("title") || this.getAttribute("label") || "");
          const titleId = "velin-sheet-title";
          this.shadowRoot.innerHTML = `
      <style>${styles20}</style>
      <div class="overlay" part="overlay"></div>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="${titleId}" part="sheet">
        <div class="header" part="header">
          <h2 class="title" id="${titleId}">${title}</h2>
          <button class="close-btn" aria-label="Close" part="close">&#215;</button>
        </div>
        <div class="body" part="body"><slot></slot></div>
      </div>
    `;
          this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => this.close());
          this.shadowRoot.querySelector(".overlay").addEventListener("click", () => this.close());
          if (this.hasAttribute("open")) this._open();
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
          requestAnimationFrame(() => {
            const f = getFocusableElements(this.shadowRoot);
            if (f.length) f[0].focus();
          });
        }
        _close() {
          document.removeEventListener("keydown", this._onKey);
          clearBackgroundInert(this);
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
          clearBackgroundInert(this);
        }
      };
      customElements.define("velin-sheet", VelinSheet);
      velin_sheet_default = VelinSheet;
    }
  });

  // components/velin-segmented-control.js
  var velin_segmented_control_exports = {};
  __export(velin_segmented_control_exports, {
    default: () => velin_segmented_control_default
  });
  var styles21, VelinSegmentedControl, velin_segmented_control_default;
  var init_velin_segmented_control = __esm({
    "components/velin-segmented-control.js"() {
      init_focus_manager();
      init_sanitize();
      init_shadow_a11y_styles();
      styles21 = `
  ${SHADOW_A11Y_STYLES}
  :host { display: block; }
  .group {
    display: inline-flex;
    gap: var(--velin-space-1, 0.25rem);
    padding: var(--velin-space-1, 0.25rem);
    background: var(--velin-color-surface-dim, #eee);
    border-radius: var(--velin-radius-md, 0.5rem);
  }
  ::slotted(button) {
    min-inline-size: 2.75rem;
    min-block-size: 2.75rem;
    padding: var(--velin-space-2, 0.5rem) var(--velin-space-4, 1rem);
    border: none;
    border-radius: var(--velin-radius-sm, 0.25rem);
    background: transparent;
    color: var(--velin-color-text-muted, #666);
    cursor: pointer;
    font-size: var(--velin-text-sm, 0.875rem);
  }
  ::slotted(button[aria-pressed="true"]) {
    background: var(--velin-color-surface-bright, #fff);
    color: var(--velin-color-text, #111);
    font-weight: var(--velin-weight-semibold, 600);
    box-shadow: var(--velin-shadow-sm, 0 1px 2px rgba(0,0,0,0.06));
  }
`;
      VelinSegmentedControl = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open", delegatesFocus: true });
          this._onClick = this._onClick.bind(this);
          this._onKey = this._onKey.bind(this);
        }
        connectedCallback() {
          const label = escapeHTML(this.getAttribute("aria-label") || "Segmented control");
          this.shadowRoot.innerHTML = `
      <style>${styles21}</style>
      <div class="group" role="group" aria-label="${label}"><slot></slot></div>
    `;
          this.addEventListener("click", this._onClick);
          this.addEventListener("keydown", this._onKey);
          this.shadowRoot.querySelector("slot")?.addEventListener("slotchange", () => this._init());
          this._init();
        }
        _getButtons() {
          const slot = this.shadowRoot.querySelector("slot");
          return slot ? slot.assignedElements().filter((el) => el.tagName === "BUTTON") : [];
        }
        _init() {
          const buttons = this._getButtons();
          const selected = buttons.find((b) => b.hasAttribute("selected")) || buttons[0];
          buttons.forEach((btn, i) => {
            btn.setAttribute("aria-pressed", btn === selected ? "true" : "false");
            btn.setAttribute("tabindex", btn === selected ? "0" : "-1");
          });
        }
        _onClick(e) {
          const btn = e.target.closest("button");
          if (!btn || !this.contains(btn)) return;
          this._select(btn);
        }
        _select(btn) {
          this._getButtons().forEach((b) => {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
            b.setAttribute("tabindex", b === btn ? "0" : "-1");
          });
          this.dispatchEvent(new CustomEvent("velin-change", { bubbles: true, detail: { value: btn.value || btn.textContent?.trim() } }));
        }
        _onKey(e) {
          const buttons = this._getButtons();
          if (!buttons.includes(e.target)) return;
          rovingTabindex(this, buttons, e);
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            const focused = buttons.find((b) => b.getAttribute("tabindex") === "0");
            if (focused) this._select(focused);
          }
        }
        static get observedAttributes() {
          return ["aria-label"];
        }
        attributeChangedCallback(name) {
          if (name === "aria-label") {
            const group = this.shadowRoot?.querySelector(".group");
            if (group) group.setAttribute("aria-label", escapeHTML(this.getAttribute("aria-label") || "Segmented control"));
          }
        }
        disconnectedCallback() {
          this.removeEventListener("click", this._onClick);
          this.removeEventListener("keydown", this._onKey);
        }
      };
      customElements.define("velin-segmented-control", VelinSegmentedControl);
      velin_segmented_control_default = VelinSegmentedControl;
    }
  });

  // components/velin-rating.js
  var velin_rating_exports = {};
  __export(velin_rating_exports, {
    default: () => velin_rating_default
  });
  var styles22, MAX, VelinRating, velin_rating_default;
  var init_velin_rating = __esm({
    "components/velin-rating.js"() {
      init_focus_manager();
      init_sanitize();
      init_shadow_a11y_styles();
      styles22 = `
  ${SHADOW_A11Y_STYLES}
  :host { display: inline-block; }
  .stars { display: inline-flex; gap: var(--velin-space-1, 0.25rem); }
  button {
    background: none; border: none; padding: var(--velin-space-1, 0.25rem);
    font-size: 1.5rem; line-height: 1; cursor: pointer;
    color: var(--velin-color-border, #ccc);
  }
  button[aria-checked="true"] { color: var(--velin-color-warning, #f59e0b); }
`;
      MAX = 5;
      VelinRating = class extends HTMLElement {
        static get observedAttributes() {
          return ["value"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open", delegatesFocus: true });
          this._onClick = this._onClick.bind(this);
          this._onKey = this._onKey.bind(this);
        }
        connectedCallback() {
          this.shadowRoot.innerHTML = `<style>${styles22}</style><div class="stars" role="radiogroup"></div>`;
          this._render();
          this.shadowRoot.querySelector(".stars").addEventListener("click", this._onClick);
          this.shadowRoot.querySelector(".stars").addEventListener("keydown", this._onKey);
        }
        _value() {
          const v = parseInt(this.getAttribute("value") || "0", 10);
          return Math.min(MAX, Math.max(0, Number.isNaN(v) ? 0 : v));
        }
        _render() {
          const group = this.shadowRoot.querySelector(".stars");
          const val = this._value();
          const label = escapeHTML(this.getAttribute("aria-label") || "Rating");
          group.setAttribute("aria-label", label);
          group.innerHTML = "";
          for (let i = 1; i <= MAX; i++) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("role", "radio");
            btn.setAttribute("aria-checked", i <= val ? "true" : "false");
            btn.setAttribute("aria-label", escapeHTML(`${i} star${i > 1 ? "s" : ""}`));
            btn.setAttribute("tabindex", i === (val || 1) ? "0" : "-1");
            btn.dataset.value = String(i);
            btn.textContent = i <= val ? "\u2605" : "\u2606";
            group.appendChild(btn);
          }
        }
        _getButtons() {
          return [...this.shadowRoot.querySelectorAll('button[role="radio"]')];
        }
        _onClick(e) {
          const btn = e.target.closest("button");
          if (!btn) return;
          this._setValue(parseInt(btn.dataset.value, 10));
        }
        _onKey(e) {
          const buttons = this._getButtons();
          if (!buttons.includes(e.target)) return;
          rovingTabindex(this, buttons, e);
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            const focused = buttons.find((b) => b.getAttribute("tabindex") === "0");
            if (focused) this._setValue(parseInt(focused.dataset.value, 10));
          }
        }
        _setValue(n) {
          this.setAttribute("value", String(n));
          this.dispatchEvent(new CustomEvent("velin-change", { bubbles: true, detail: { value: n } }));
        }
        attributeChangedCallback(name) {
          if (name === "value" && this.shadowRoot?.querySelector(".stars")) this._render();
        }
      };
      customElements.define("velin-rating", VelinRating);
      velin_rating_default = VelinRating;
    }
  });

  // components/velin-menubar.js
  var velin_menubar_exports = {};
  __export(velin_menubar_exports, {
    default: () => velin_menubar_default
  });
  var styles23, VelinMenubar, velin_menubar_default;
  var init_velin_menubar = __esm({
    "components/velin-menubar.js"() {
      init_focus_manager();
      init_sanitize();
      init_shadow_a11y_styles();
      styles23 = `
  ${SHADOW_A11Y_STYLES}
  :host { display: block; }
  .menubar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--velin-space-1, 0.25rem);
    padding: var(--velin-space-2, 0.5rem);
    background: var(--velin-color-surface-bright, #fff);
    border-bottom: 1px solid var(--velin-color-border, #ddd);
  }
  ::slotted([role="menuitem"]) {
    min-inline-size: 2.75rem;
    min-block-size: 2.75rem;
    padding: var(--velin-space-2, 0.5rem) var(--velin-space-4, 1rem);
    background: none;
    border: none;
    border-radius: var(--velin-radius-sm, 0.25rem);
    cursor: pointer;
    font-size: var(--velin-text-base, 1rem);
    color: var(--velin-color-text, #111);
  }
  ::slotted([role="menuitem"]:hover) {
    background: var(--velin-color-surface-dim, #eee);
  }
`;
      VelinMenubar = class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: "open", delegatesFocus: true });
          this._onKey = this._onKey.bind(this);
        }
        connectedCallback() {
          const label = escapeHTML(this.getAttribute("aria-label") || "Menu bar");
          this.shadowRoot.innerHTML = `
      <style>${styles23}</style>
      <div class="menubar" role="menubar" aria-label="${label}"><slot></slot></div>
    `;
          this.addEventListener("keydown", this._onKey);
          this.shadowRoot.querySelector("slot")?.addEventListener("slotchange", () => this._init());
          this._init();
        }
        _getItems() {
          const slot = this.shadowRoot.querySelector("slot");
          return slot ? slot.assignedElements().filter((el) => !el.hasAttribute("disabled")) : [];
        }
        _init() {
          const items = this._getItems();
          items.forEach((el, i) => {
            if (!el.hasAttribute("role")) el.setAttribute("role", "menuitem");
            el.setAttribute("tabindex", i === 0 ? "0" : "-1");
          });
        }
        _onKey(e) {
          const items = this._getItems();
          if (items.includes(e.target)) rovingTabindex(this, items, e);
        }
        static get observedAttributes() {
          return ["aria-label"];
        }
        attributeChangedCallback(name) {
          if (name === "aria-label") {
            const bar = this.shadowRoot?.querySelector(".menubar");
            if (bar) bar.setAttribute("aria-label", escapeHTML(this.getAttribute("aria-label") || "Menu bar"));
          }
        }
        disconnectedCallback() {
          this.removeEventListener("keydown", this._onKey);
        }
      };
      customElements.define("velin-menubar", VelinMenubar);
      velin_menubar_default = VelinMenubar;
    }
  });

  // components/velin-command.js
  var velin_command_exports = {};
  __export(velin_command_exports, {
    default: () => velin_command_default
  });
  var styles24, VelinCommand, velin_command_default;
  var init_velin_command = __esm({
    "components/velin-command.js"() {
      init_focus_manager();
      init_sanitize();
      init_shadow_a11y_styles();
      styles24 = `
  ${SHADOW_A11Y_STYLES}
  :host { display: contents; }
  .overlay {
    position: fixed; inset: 0; z-index: var(--velin-z-modal, 500);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 10vh var(--velin-space-4, 1rem) var(--velin-space-4, 1rem);
    background: var(--velin-color-overlay, rgba(0,0,0,0.4));
    opacity: 0; visibility: hidden;
    pointer-events: none;
    transition: opacity 150ms ease, visibility 150ms ease;
  }
  :host([open]) .overlay {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  .panel {
    inline-size: min(32rem, 100%);
    background: var(--velin-color-surface-bright, #fff);
    border-radius: var(--velin-radius-lg, 0.75rem);
    box-shadow: var(--velin-shadow-xl, 0 20px 25px rgba(0,0,0,0.1));
    overflow: hidden;
  }
  .search {
    inline-size: 100%; padding: var(--velin-space-4, 1rem);
    border: none; border-bottom: 1px solid var(--velin-color-border, #ddd);
    font-size: var(--velin-text-base, 1rem);
    background: transparent;
    color: var(--velin-color-text, #111);
  }
  .results { max-block-size: 20rem; overflow-y: auto; padding: var(--velin-space-2, 0.5rem); }
  ::slotted(button) {
    display: flex; inline-size: 100%;
    padding: var(--velin-space-3, 0.75rem) var(--velin-space-4, 1rem);
    min-block-size: 2.5rem;
    border: none; background: none; text-align: start;
    cursor: pointer; font-size: var(--velin-text-base, 1rem);
    border-radius: var(--velin-radius-sm, 0.25rem);
  }
  ::slotted(button[hidden]) { display: none; }
  ::slotted(button:focus-visible) {
    background: var(--velin-color-surface-dim, #eee);
  }
`;
      VelinCommand = class extends HTMLElement {
        static get observedAttributes() {
          return ["open"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open", delegatesFocus: true });
          this._prev = null;
          this._onKey = this._onKey.bind(this);
          this._onInput = this._onInput.bind(this);
        }
        connectedCallback() {
          const placeholder = escapeHTML(this.getAttribute("placeholder") || "Search commands\u2026");
          this.shadowRoot.innerHTML = `
      <style>${styles24}</style>
      <div class="overlay" part="overlay">
        <div class="panel" role="dialog" aria-modal="true" aria-label="Command palette" part="panel">
          <input class="search" type="search" autocomplete="off" placeholder="${placeholder}" aria-label="Search" part="search" />
          <div class="results" part="results"><slot></slot></div>
        </div>
      </div>
    `;
          this.shadowRoot.querySelector(".search").addEventListener("input", this._onInput);
          this.shadowRoot.querySelector(".overlay")?.addEventListener("click", this._onOverlayClick);
          this.shadowRoot.querySelector("slot")?.addEventListener("slotchange", () => this._filter(""));
          this._filter("");
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
        toggle() {
          if (this.hasAttribute("open")) this.close();
          else this.open();
        }
        _onOverlayClick = (event) => {
          if (event.target === event.currentTarget) this.close();
        };
        _open() {
          this._prev = saveFocus();
          setBackgroundInert(this);
          document.addEventListener("keydown", this._onKey);
          requestAnimationFrame(() => {
            this.shadowRoot.querySelector(".search")?.focus();
            this._filter("");
          });
        }
        _close() {
          document.removeEventListener("keydown", this._onKey);
          clearBackgroundInert(this);
          restoreFocus(this._prev);
          const input = this.shadowRoot.querySelector(".search");
          if (input) input.value = "";
          this._filter("");
        }
        _onInput(e) {
          this._filter(e.target.value);
        }
        _filter(query) {
          const q = query.trim().toLowerCase();
          const slot = this.shadowRoot.querySelector("slot");
          slot?.assignedElements().forEach((btn) => {
            const text2 = btn.textContent?.trim().toLowerCase() || "";
            const match = !q || text2.includes(q);
            btn.hidden = !match;
          });
        }
        _visibleItems() {
          const slot = this.shadowRoot.querySelector("slot");
          return slot?.assignedElements().filter((el) => el.tagName === "BUTTON" && !el.hidden) || [];
        }
        _onKey(e) {
          if (e.key === "Escape") {
            this.close();
            return;
          }
          const items = this._visibleItems();
          if (items.length && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            const idx = items.indexOf(document.activeElement);
            const next = e.key === "ArrowDown" ? items[(idx + 1) % items.length] : items[(idx <= 0 ? items.length : idx) - 1];
            next?.focus();
            return;
          }
          trapFocus(this.shadowRoot, e);
        }
        disconnectedCallback() {
          document.removeEventListener("keydown", this._onKey);
          this.shadowRoot?.querySelector(".overlay")?.removeEventListener("click", this._onOverlayClick);
          if (this.hasAttribute("open")) clearBackgroundInert(this);
        }
      };
      customElements.define("velin-command", VelinCommand);
      velin_command_default = VelinCommand;
    }
  });

  // components/velin-announcer.js
  var velin_announcer_exports = {};
  __export(velin_announcer_exports, {
    default: () => velin_announcer_default
  });
  var styles25, VelinAnnouncer, velin_announcer_default;
  var init_velin_announcer = __esm({
    "components/velin-announcer.js"() {
      styles25 = `
  :host { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
`;
      VelinAnnouncer = class extends HTMLElement {
        connectedCallback() {
          if (!this.shadowRoot) this.attachShadow({ mode: "open" });
          const live = this.getAttribute("polite") === "false" ? "assertive" : "polite";
          this.shadowRoot.innerHTML = "<style>" + styles25 + '</style><div role="status" aria-live="' + live + '" aria-atomic="true" part="region"></div>';
          this._region = this.shadowRoot.querySelector('[role="status"]');
        }
        announce(message, { assertive = false } = {}) {
          if (!this._region) this.connectedCallback();
          this._region.setAttribute("aria-live", assertive ? "assertive" : "polite");
          this._region.textContent = "";
          requestAnimationFrame(() => {
            this._region.textContent = typeof message === "string" ? message : "";
          });
        }
        static announceGlobal(message, options) {
          let el = document.querySelector("velin-announcer");
          if (!el) {
            el = document.createElement("velin-announcer");
            document.body.appendChild(el);
          }
          el.announce(message, options);
        }
      };
      customElements.define("velin-announcer", VelinAnnouncer);
      velin_announcer_default = VelinAnnouncer;
    }
  });

  // components/velin-email.js
  var velin_email_exports = {};
  __export(velin_email_exports, {
    default: () => velin_email_default
  });
  function decodeObfuscated(raw, method) {
    if (!raw) return "";
    if (method === "rot13") {
      return raw.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
      });
    }
    try {
      return atob(raw);
    } catch {
      return raw;
    }
  }
  var styles26, VelinEmail, velin_email_default;
  var init_velin_email = __esm({
    "components/velin-email.js"() {
      init_sanitize();
      styles26 = `
  :host { display: inline; }
  button {
    font: inherit;
    color: var(--velin-color-primary, #4338ca);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 0.15em;
    min-height: 2.75rem;
    min-width: 2.75rem;
  }
  button:focus-visible {
    outline: 3px solid var(--velin-color-focus, #2563eb);
    outline-offset: 2px;
    border-radius: 2px;
  }
  .revealed { text-decoration: none; user-select: text; }
`;
      VelinEmail = class extends HTMLElement {
        static get observedAttributes() {
          return ["value", "obfuscate", "label"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._revealed = false;
        }
        connectedCallback() {
          this.render();
        }
        attributeChangedCallback() {
          if (this.isConnected) this.render();
        }
        get email() {
          const method = this.getAttribute("obfuscate") || "";
          const raw = this.getAttribute("value") || "";
          return method ? decodeObfuscated(raw, method) : raw;
        }
        render() {
          const label = this.getAttribute("label") || "Show email address";
          const email = this.email;
          const safeEmail = escapeHTML(email);
          if (this._revealed) {
            this.shadowRoot.innerHTML = `
        <style>${styles26}</style>
        <span class="revealed" part="email"><a href="mailto:${escapeHTMLAttribute(email)}">${safeEmail}</a></span>
      `;
            return;
          }
          this.shadowRoot.innerHTML = `
      <style>${styles26}</style>
      <button type="button" part="reveal" aria-label="${escapeHTMLAttribute(label)}">${escapeHTML(label)}</button>
    `;
          this.shadowRoot.querySelector("button").addEventListener("click", () => {
            this._revealed = true;
            this.render();
            this.dispatchEvent(new CustomEvent("velin-email-reveal", { bubbles: true, detail: { email } }));
          });
        }
      };
      if (!customElements.get("velin-email")) {
        customElements.define("velin-email", VelinEmail);
      }
      velin_email_default = VelinEmail;
    }
  });

  // components/velin-calendar.js
  var velin_calendar_exports = {};
  __export(velin_calendar_exports, {
    default: () => velin_calendar_default
  });
  function iso(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function parseISO(v) {
    if (!v) return null;
    const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  var styles27, VelinCalendar, velin_calendar_default;
  var init_velin_calendar = __esm({
    "components/velin-calendar.js"() {
      init_sanitize();
      styles27 = `
  :host { display: block; max-inline-size: 100%; }
  .cal {
    box-sizing: border-box;
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-md, 0.5rem);
    background: var(--velin-color-surface, #fff);
    color: var(--velin-color-text, #111);
    padding: var(--velin-space-3, 0.75rem);
    max-inline-size: min(20rem, 100%);
    inline-size: 100%;
  }
  .head {
    display: flex; align-items: center; justify-content: space-between;
    gap: var(--velin-space-2, 0.5rem); margin-block-end: var(--velin-space-3, 0.75rem);
  }
  .title { font-weight: var(--velin-weight-semibold, 600); margin: 0; font-size: var(--velin-text-base, 1rem); }
  .nav {
    display: inline-flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    min-inline-size: 2.5rem; min-block-size: 2.5rem;
    border: 1px solid var(--velin-color-border, #ddd);
    border-radius: var(--velin-radius-sm, 0.25rem);
    background: var(--velin-color-surface-bright, #fff);
    color: inherit; cursor: pointer;
  }
  .nav:focus-visible { outline: 2px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  .grid {
    display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.25rem;
  }
  .dow {
    text-align: center; font-size: var(--velin-text-xs, 0.75rem);
    color: var(--velin-color-text-muted, #64748b); padding-block: 0.25rem;
  }
  .day {
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: 2.25rem;
    aspect-ratio: 1;
    border: none; border-radius: var(--velin-radius-sm, 0.25rem);
    background: transparent; color: inherit; cursor: pointer;
    font: inherit;
    padding: 0;
  }
  .day[aria-disabled="true"] { opacity: 0.35; cursor: not-allowed; }
  .day[aria-selected="true"] {
    background: var(--velin-color-primary, #2563eb);
    color: var(--velin-color-on-primary, #fff);
  }
  .day:not([aria-disabled="true"]):hover {
    background: var(--velin-color-primary-subtle, #eff6ff);
  }
  .day:focus-visible { outline: 2px solid var(--velin-color-focus, #2563eb); outline-offset: 1px; }
  .out { color: var(--velin-color-text-muted, #94a3b8); }
`;
      VelinCalendar = class extends HTMLElement {
        static get observedAttributes() {
          return ["value", "min", "max", "label"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._view = /* @__PURE__ */ new Date();
          this._view.setDate(1);
          this._onKey = this._onKey.bind(this);
        }
        connectedCallback() {
          const selected = parseISO(this.getAttribute("value")) || /* @__PURE__ */ new Date();
          this._view = new Date(selected.getFullYear(), selected.getMonth(), 1);
          this._render();
        }
        attributeChangedCallback(name, prev, next) {
          if (prev === next || !this.shadowRoot?.querySelector(".cal")) return;
          if (name === "value" && next) {
            const d = parseISO(next);
            if (d) this._view = new Date(d.getFullYear(), d.getMonth(), 1);
          }
          this._render();
        }
        get value() {
          return this.getAttribute("value") || "";
        }
        set value(v) {
          if (v) this.setAttribute("value", v);
          else this.removeAttribute("value");
        }
        _inRange(d) {
          const min = parseISO(this.getAttribute("min"));
          const max = parseISO(this.getAttribute("max"));
          if (min && d < min) return false;
          if (max && d > max) return false;
          return true;
        }
        _select(d) {
          if (!this._inRange(d)) return;
          const v = iso(d);
          this.setAttribute("value", v);
          this.dispatchEvent(new CustomEvent("velin-change", { bubbles: true, detail: { value: v, date: d } }));
          this._render();
        }
        _shiftMonth(delta) {
          this._view = new Date(this._view.getFullYear(), this._view.getMonth() + delta, 1);
          this._render();
        }
        _onKey(e) {
          const selected = parseISO(this.getAttribute("value")) || /* @__PURE__ */ new Date();
          let next = new Date(selected);
          switch (e.key) {
            case "ArrowLeft":
              next.setDate(next.getDate() - 1);
              break;
            case "ArrowRight":
              next.setDate(next.getDate() + 1);
              break;
            case "ArrowUp":
              next.setDate(next.getDate() - 7);
              break;
            case "ArrowDown":
              next.setDate(next.getDate() + 7);
              break;
            case "Home":
              next = new Date(next.getFullYear(), next.getMonth(), 1);
              break;
            case "End":
              next = new Date(next.getFullYear(), next.getMonth() + 1, 0);
              break;
            case "PageUp":
              next = new Date(next.getFullYear(), next.getMonth() - 1, next.getDate());
              break;
            case "PageDown":
              next = new Date(next.getFullYear(), next.getMonth() + 1, next.getDate());
              break;
            case "Enter":
            case " ":
              e.preventDefault();
              this._select(selected);
              return;
            default:
              return;
          }
          e.preventDefault();
          if (!this._inRange(next)) return;
          this._view = new Date(next.getFullYear(), next.getMonth(), 1);
          this.setAttribute("value", iso(next));
          this.dispatchEvent(new CustomEvent("velin-change", { bubbles: true, detail: { value: iso(next), date: next } }));
          this._render();
          this.shadowRoot.querySelector(`[data-iso="${iso(next)}"]`)?.focus();
        }
        _render() {
          const label = escapeHTML(this.getAttribute("label") || "Choose date");
          const selected = parseISO(this.getAttribute("value"));
          const y = this._view.getFullYear();
          const m = this._view.getMonth();
          const title = this._view.toLocaleString(void 0, { month: "long", year: "numeric" });
          const start = new Date(y, m, 1);
          const startDow = (start.getDay() + 6) % 7;
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          const dows = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
          let cells = dows.map((d) => `<div class="dow" aria-hidden="true">${d}</div>`).join("");
          for (let i = 0; i < startDow; i += 1) {
            const d = new Date(y, m, -startDow + i + 1);
            cells += `<button type="button" class="day out" tabindex="-1" data-iso="${iso(d)}" aria-label="${iso(d)}">${d.getDate()}</button>`;
          }
          for (let day = 1; day <= daysInMonth; day += 1) {
            const d = new Date(y, m, day);
            const id = iso(d);
            const sel = selected && iso(selected) === id;
            const disabled = !this._inRange(d);
            cells += `<button type="button" class="day" data-iso="${id}" aria-label="${id}" aria-selected="${sel ? "true" : "false"}" aria-disabled="${disabled ? "true" : "false"}" tabindex="${sel ? "0" : "-1"}">${day}</button>`;
          }
          this.shadowRoot.innerHTML = `
      <style>${styles27}</style>
      <div class="cal" role="group" aria-label="${label}">
        <div class="head">
          <button type="button" class="nav" data-nav="-1" aria-label="Previous month">\u2039</button>
          <p class="title" id="cal-title">${escapeHTML(title)}</p>
          <button type="button" class="nav" data-nav="1" aria-label="Next month">\u203A</button>
        </div>
        <div class="grid" role="grid" aria-labelledby="cal-title">${cells}</div>
      </div>
    `;
          this.shadowRoot.querySelectorAll("[data-nav]").forEach((btn) => {
            btn.addEventListener("click", () => this._shiftMonth(Number(btn.getAttribute("data-nav"))));
          });
          this.shadowRoot.querySelectorAll(".day").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (btn.getAttribute("aria-disabled") === "true") return;
              const d = parseISO(btn.getAttribute("data-iso"));
              if (d) this._select(d);
            });
            btn.addEventListener("keydown", this._onKey);
          });
        }
      };
      customElements.define("velin-calendar", VelinCalendar);
      velin_calendar_default = VelinCalendar;
    }
  });

  // core/highlight/languages/_utils.js
  function tokenize(code, rules) {
    const tokens = [];
    let i = 0;
    while (i < code.length) {
      let matched = false;
      for (const { type, re } of rules) {
        re.lastIndex = i;
        const m = re.exec(code);
        if (m && m.index === i) {
          tokens.push({ type, value: m[0] });
          i += m[0].length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const next = tokens[tokens.length - 1];
        if (next?.type === "plain") {
          next.value += code[i];
        } else {
          tokens.push({ type: "plain", value: code[i] });
        }
        i += 1;
      }
    }
    return tokens;
  }
  function tokenizeWithKeywords(code, keywords, baseRules) {
    const rules = [
      ...baseRules,
      {
        type: "keyword",
        re: new RegExp(`\\b(${Object.keys(keywords).join("|")})\\b`, "y")
      },
      { type: "identifier", re: /\b[A-Za-z_$][\w$]*\b/y }
    ];
    return tokenize(code, rules);
  }
  var init_utils = __esm({
    "core/highlight/languages/_utils.js"() {
    }
  });

  // core/highlight/languages/js.js
  var js_exports = {};
  __export(js_exports, {
    default: () => lexJs
  });
  function lexJs(code) {
    return tokenizeWithKeywords(code, KEYWORDS, BASE);
  }
  var KEYWORDS, BASE;
  var init_js = __esm({
    "core/highlight/languages/js.js"() {
      init_utils();
      KEYWORDS = {
        const: 1,
        let: 1,
        var: 1,
        function: 1,
        return: 1,
        if: 1,
        else: 1,
        for: 1,
        while: 1,
        do: 1,
        switch: 1,
        case: 1,
        break: 1,
        continue: 1,
        new: 1,
        class: 1,
        extends: 1,
        import: 1,
        export: 1,
        from: 1,
        default: 1,
        async: 1,
        await: 1,
        try: 1,
        catch: 1,
        finally: 1,
        throw: 1,
        typeof: 1,
        instanceof: 1,
        in: 1,
        of: 1,
        true: 1,
        false: 1,
        null: 1,
        undefined: 1,
        void: 1,
        this: 1
      };
      BASE = [
        { type: "comment", re: /\/\/[^\n]*/y },
        { type: "comment", re: /\/\*[\s\S]*?\*\//y },
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /'(?:\\.|[^'\\])*'/y },
        { type: "string", re: /`(?:\\.|[^`\\])*`/y },
        { type: "number", re: /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/y },
        { type: "operator", re: /[+\-*/%=<>!&|^~?:]+/y },
        { type: "punctuation", re: /[{}[\]();,.]/y }
      ];
    }
  });

  // core/highlight/languages/typescript.js
  var typescript_exports = {};
  __export(typescript_exports, {
    default: () => lexTypeScript
  });
  function lexTypeScript(code) {
    return lexJs(code).map(
      (t) => t.type === "identifier" && TS_KEYWORDS.has(t.value) ? { type: "keyword", value: t.value } : t
    );
  }
  var TS_KEYWORDS;
  var init_typescript = __esm({
    "core/highlight/languages/typescript.js"() {
      init_js();
      TS_KEYWORDS = /* @__PURE__ */ new Set([
        "type",
        "interface",
        "enum",
        "implements",
        "declare",
        "namespace",
        "readonly",
        "public",
        "private",
        "protected",
        "abstract",
        "as",
        "satisfies",
        "keyof"
      ]);
    }
  });

  // core/highlight/languages/html.js
  var html_exports = {};
  __export(html_exports, {
    default: () => lexHtml
  });
  function lexHtml(code) {
    return tokenize(code, RULES);
  }
  var RULES;
  var init_html = __esm({
    "core/highlight/languages/html.js"() {
      init_utils();
      RULES = [
        { type: "comment", re: /<!--[\s\S]*?-->/y },
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /'(?:\\.|[^'\\])*'/y },
        { type: "tag", re: /<\/?[\w-]+/y },
        { type: "punctuation", re: /[<>/=]/y },
        { type: "attr-name", re: /\s[\w-]+(?==)/y },
        { type: "attr-value", re: /=(?:"[^"]*"|'[^']*'|[^\s>]+)/y }
      ];
    }
  });

  // core/highlight/languages/css.js
  var css_exports = {};
  __export(css_exports, {
    default: () => lexCss
  });
  function lexCss(code) {
    return tokenizeWithKeywords(code, KEYWORDS2, RULES2);
  }
  var KEYWORDS2, RULES2;
  var init_css = __esm({
    "core/highlight/languages/css.js"() {
      init_utils();
      KEYWORDS2 = {
        important: 1,
        inherit: 1,
        initial: 1,
        unset: 1,
        revert: 1
      };
      RULES2 = [
        { type: "comment", re: /\/\*[\s\S]*?\*\//y },
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /'(?:\\.|[^'\\])*'/y },
        { type: "number", re: /#[\da-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:%|[a-z]+)?\b/y },
        { type: "tag", re: /\.[\w-]+|#[\w-]+/y },
        { type: "attr-name", re: /[\w-]+(?=\s*:)/y },
        { type: "punctuation", re: /[{}:;,()]/y },
        { type: "operator", re: /[+\-*/>~]/y }
      ];
    }
  });

  // core/highlight/languages/json.js
  var json_exports = {};
  __export(json_exports, {
    default: () => lexJson
  });
  function lexJson(code) {
    return tokenize(code, RULES3);
  }
  var RULES3;
  var init_json = __esm({
    "core/highlight/languages/json.js"() {
      init_utils();
      RULES3 = [
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "number", re: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/y },
        { type: "keyword", re: /\b(true|false|null)\b/y },
        { type: "punctuation", re: /[{}[\]:,]/y }
      ];
    }
  });

  // core/highlight/languages/markdown.js
  var markdown_exports = {};
  __export(markdown_exports, {
    default: () => lexMarkdown
  });
  function lexMarkdown(code) {
    return tokenize(code, RULES4);
  }
  var RULES4;
  var init_markdown = __esm({
    "core/highlight/languages/markdown.js"() {
      init_utils();
      RULES4 = [
        { type: "comment", re: /<!--[\s\S]*?-->/y },
        { type: "string", re: /```[\s\S]*?```/y },
        { type: "string", re: /`[^`\n]+`/y },
        { type: "keyword", re: /#{1,6}\s[^\n]+/y },
        { type: "tag", re: /\[[^\]]+\]\([^)]+\)/y },
        { type: "operator", re: /[*_~]/y }
      ];
    }
  });

  // core/highlight/languages/shell.js
  var shell_exports = {};
  __export(shell_exports, {
    default: () => lexShell
  });
  function lexShell(code) {
    return tokenizeWithKeywords(code, KEYWORDS3, RULES5);
  }
  var KEYWORDS3, RULES5;
  var init_shell = __esm({
    "core/highlight/languages/shell.js"() {
      init_utils();
      KEYWORDS3 = {
        if: 1,
        then: 1,
        else: 1,
        fi: 1,
        for: 1,
        do: 1,
        done: 1,
        while: 1,
        case: 1,
        esac: 1,
        function: 1,
        return: 1,
        export: 1,
        local: 1
      };
      RULES5 = [
        { type: "comment", re: /#[^\n]*/y },
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /'[^']*'/y },
        { type: "number", re: /\b\d+\b/y },
        { type: "operator", re: /[|&<>]/y },
        { type: "punctuation", re: /[();]/y }
      ];
    }
  });

  // core/highlight/languages/sql.js
  var sql_exports = {};
  __export(sql_exports, {
    default: () => lexSql
  });
  function lexSql(code) {
    return tokenize(code, RULES6);
  }
  var RULES6;
  var init_sql = __esm({
    "core/highlight/languages/sql.js"() {
      init_utils();
      RULES6 = [
        { type: "comment", re: /--[^\n]*/y },
        { type: "comment", re: /\/\*[\s\S]*?\*\//y },
        { type: "string", re: /'(?:''|[^'])*'/y },
        { type: "number", re: /\b\d+(?:\.\d+)?\b/y },
        {
          type: "keyword",
          re: /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|NULL|AS|ORDER|BY|GROUP|HAVING|LIMIT|CREATE|TABLE|INDEX)\b/yi
        },
        { type: "operator", re: /[=<>!]+|,/y },
        { type: "punctuation", re: /[();]/y }
      ];
    }
  });

  // core/highlight/languages/plain.js
  var plain_exports = {};
  __export(plain_exports, {
    default: () => lexPlain
  });
  function lexPlain(code) {
    if (!code) return [];
    return [{ type: "plain", value: code }];
  }
  var init_plain = __esm({
    "core/highlight/languages/plain.js"() {
    }
  });

  // core/highlight/languages/php.js
  var php_exports = {};
  __export(php_exports, {
    default: () => lexPhp
  });
  function lexPhp(code) {
    return tokenizeWithKeywords(code, KEYWORDS4, RULES7);
  }
  var KEYWORDS4, RULES7;
  var init_php = __esm({
    "core/highlight/languages/php.js"() {
      init_utils();
      KEYWORDS4 = {
        function: 1,
        return: 1,
        if: 1,
        else: 1,
        elseif: 1,
        foreach: 1,
        while: 1,
        class: 1,
        new: 1,
        public: 1,
        private: 1,
        protected: 1,
        static: 1,
        namespace: 1,
        use: 1,
        true: 1,
        false: 1,
        null: 1
      };
      RULES7 = [
        { type: "comment", re: /\/\/[^\n]*/y },
        { type: "comment", re: /#[^\n]*/y },
        { type: "comment", re: /\/\*[\s\S]*?\*\//y },
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /'(?:\\.|[^'\\])*'/y },
        { type: "number", re: /\b\d+(?:\.\d+)?\b/y },
        { type: "operator", re: /=>|\+\+|--|===|!==|==|!=|<=|>=|->|\?\?|[=+\-*/%.<>!&|^~?:]/y },
        { type: "punctuation", re: /[{}[\]();,.]/y }
      ];
    }
  });

  // core/highlight/languages/blade.js
  var blade_exports = {};
  __export(blade_exports, {
    default: () => lexBlade
  });
  function lexBlade(code) {
    return tokenize(code, RULES8);
  }
  var RULES8;
  var init_blade = __esm({
    "core/highlight/languages/blade.js"() {
      init_utils();
      RULES8 = [
        { type: "comment", re: /{{--[\s\S]*?--}}/y },
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /'(?:\\.|[^'\\])*'/y },
        { type: "keyword", re: /@(?:vite|csrf|auth|guest|section|endsection|yield|extends|include|push|endpush|stack|once|endonce|forelse|empty|endempty|can|endcan|cannot|endcannot)\b/y },
        { type: "operator", re: /{{|}}|{!!|!!}|@[{}]/y },
        { type: "punctuation", re: /[()[\],]/y }
      ];
    }
  });

  // core/highlight/languages/python.js
  var python_exports = {};
  __export(python_exports, {
    default: () => lexPython
  });
  function lexPython(code) {
    return tokenize(code, RULES9);
  }
  var RULES9;
  var init_python = __esm({
    "core/highlight/languages/python.js"() {
      init_utils();
      RULES9 = [
        { type: "comment", re: /#[^\n]*/y },
        // Triple-quoted strings first so the single-quote rules cannot split them.
        { type: "string", re: /[rbfu]{0,2}"""[\s\S]*?"""/y },
        { type: "string", re: /[rbfu]{0,2}'''[\s\S]*?'''/y },
        { type: "string", re: /[rbfu]{0,2}"(?:\\.|[^"\\\n])*"/y },
        { type: "string", re: /[rbfu]{0,2}'(?:\\.|[^'\\\n])*'/y },
        { type: "number", re: /\b0[xX][\da-fA-F_]+\b|\b\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?j?\b/y },
        {
          type: "keyword",
          re: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/y
        },
        {
          type: "builtin",
          re: /\b(?:None|True|False|self|cls|abs|all|any|bool|bytes|dict|dir|enumerate|filter|float|format|frozenset|getattr|hasattr|int|isinstance|issubclass|iter|len|list|map|max|min|next|object|open|print|range|repr|reversed|round|set|setattr|sorted|str|sum|super|tuple|type|zip)\b/y
        },
        // Multi-character operators first so `->` is not split into `-` and `>`.
        { type: "operator", re: /->|:=|\*\*=?|\/\/=?|<<=?|>>=?|[-+*/%&|^~<>!=]=?/y },
        { type: "punctuation", re: /[[\]{}(),:;.@]/y },
        { type: "identifier", re: /\b[A-Za-z_]\w*\b/y }
      ];
    }
  });

  // core/highlight/languages/yaml.js
  var yaml_exports = {};
  __export(yaml_exports, {
    default: () => lexYaml
  });
  function lexYaml(code) {
    return tokenize(code, RULES10);
  }
  var RULES10;
  var init_yaml = __esm({
    "core/highlight/languages/yaml.js"() {
      init_utils();
      RULES10 = [
        { type: "comment", re: /#[^\n]*/y },
        // Document markers and block scalar indicators.
        { type: "punctuation", re: /^(?:---|\.\.\.)$/my },
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /'(?:''|[^'])*'/y },
        // Keys are the primary structure in YAML, so they get the attr-name colour.
        { type: "attr-name", re: /^[ \t]*-?[ \t]*[\w.$-]+(?=[ \t]*:(?:[ \t]|$))/my },
        { type: "punctuation", re: /^[ \t]*-(?=[ \t]|$)/my },
        { type: "keyword", re: /\b(?:true|false|null|yes|no|on|off|~)\b/yi },
        { type: "number", re: /\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y },
        // Anchors, aliases, tags and block scalar headers.
        { type: "operator", re: /[&*]\w+|![\w/!-]*|[|>][+-]?\d*(?=\s*$)/my },
        { type: "punctuation", re: /[:,[\]{}]/y }
      ];
    }
  });

  // core/highlight/languages/go.js
  var go_exports = {};
  __export(go_exports, {
    default: () => lexGo
  });
  function lexGo(code) {
    return tokenize(code, RULES11);
  }
  var RULES11;
  var init_go = __esm({
    "core/highlight/languages/go.js"() {
      init_utils();
      RULES11 = [
        { type: "comment", re: /\/\/[^\n]*/y },
        { type: "comment", re: /\/\*[\s\S]*?\*\//y },
        // Raw strings may span lines.
        { type: "string", re: /`[^`]*`/y },
        { type: "string", re: /"(?:\\.|[^"\\\n])*"/y },
        { type: "string", re: /'(?:\\.|[^'\\\n])*'/y },
        { type: "number", re: /\b0[xX][\da-fA-F_]+\b|\b\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?i?\b/y },
        {
          type: "keyword",
          re: /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/y
        },
        {
          type: "builtin",
          re: /\b(?:append|bool|byte|cap|clear|close|complex|complex64|complex128|copy|delete|error|float32|float64|imag|int|int8|int16|int32|int64|len|make|max|min|new|nil|panic|print|println|real|recover|rune|string|true|false|iota|uint|uint8|uint16|uint32|uint64|uintptr|any)\b/y
        },
        { type: "operator", re: /:=|\.\.\.|&&|\|\||<-|\+\+|--|<<=?|>>=?|&\^=?|[-+*/%&|^<>!=]=?|~/y },
        { type: "punctuation", re: /[[\]{}(),;:.]/y },
        { type: "identifier", re: /\b[A-Za-z_]\w*\b/y }
      ];
    }
  });

  // core/highlight/languages/rust.js
  var rust_exports = {};
  __export(rust_exports, {
    default: () => lexRust
  });
  function lexRust(code) {
    return tokenize(code, RULES12);
  }
  var RULES12;
  var init_rust = __esm({
    "core/highlight/languages/rust.js"() {
      init_utils();
      RULES12 = [
        { type: "comment", re: /\/\/\/?[^\n]*/y },
        { type: "comment", re: /\/\*[\s\S]*?\*\//y },
        // Raw strings close on the same number of hashes they opened with.
        { type: "string", re: /b?r(#*)"[\s\S]*?"\1/y },
        { type: "string", re: /b?"(?:\\.|[^"\\])*"/y },
        { type: "string", re: /b?'(?:\\.|[^'\\])'/y },
        // Attributes such as #[derive(Debug)] read as annotations.
        { type: "builtin", re: /#!?\[[^\]]*\]/y },
        { type: "number", re: /\b0[xXbo][\da-fA-F_]+\b|\b\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?(?:[iuf](?:8|16|32|64|128|size))?\b/y },
        {
          type: "keyword",
          re: /\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|type|unsafe|use|where|while)\b/y
        },
        {
          type: "builtin",
          re: /\b(?:bool|char|f32|f64|i8|i16|i32|i64|i128|isize|str|u8|u16|u32|u64|u128|usize|String|Vec|Option|Result|Some|None|Ok|Err|Box|Rc|Arc|true|false)\b/y
        },
        // Lifetimes such as 'a must not be read as an unterminated char literal.
        { type: "operator", re: /'[a-z_]\w*\b/y },
        { type: "operator", re: /=>|->|::|\.\.=?|&&|\|\||<<=?|>>=?|[-+*/%&|^<>!=]=?|[?@]/y },
        { type: "punctuation", re: /[[\]{}(),;:.#]/y },
        { type: "identifier", re: /\b[A-Za-z_]\w*!?\b/y }
      ];
    }
  });

  // core/highlight/registry.js
  function normalizeLanguage(name) {
    const n = (name || "").trim().toLowerCase();
    if (!n) return "";
    if (n.startsWith("language-")) return normalizeLanguage(n.slice(9));
    const map = {
      javascript: "js",
      jsx: "js",
      typescript: "ts",
      tsx: "ts",
      markup: "html",
      xml: "html",
      svg: "html",
      bash: "shell",
      sh: "shell",
      zsh: "shell",
      md: "markdown",
      plaintext: "text",
      "plain-text": "text",
      yml: "yaml",
      toml: "text",
      ini: "text",
      php8: "php",
      py: "python",
      python3: "python",
      golang: "go",
      rs: "rust"
    };
    return map[n] || n;
  }
  function registerLanguage(name, lexerFn) {
    languages.set(normalizeLanguage(name), lexerFn);
  }
  function getLanguage(name) {
    return languages.get(normalizeLanguage(name));
  }
  async function lazyLoadLanguage(name) {
    const key = normalizeLanguage(name);
    if (!key) return void 0;
    if (languages.has(key)) return languages.get(key);
    if (loading.has(key)) return loading.get(key);
    const loader = LAZY_LOADERS[key];
    if (!loader) return void 0;
    const p = loader().then((mod) => {
      const fn = mod.default;
      languages.set(key, fn);
      loading.delete(key);
      return fn;
    });
    loading.set(key, p);
    return p;
  }
  function listLanguages() {
    return [.../* @__PURE__ */ new Set([...languages.keys(), ...Object.keys(LAZY_LOADERS)])];
  }
  var languages, loading, LAZY_LOADERS;
  var init_registry = __esm({
    "core/highlight/registry.js"() {
      init_js();
      languages = /* @__PURE__ */ new Map();
      loading = /* @__PURE__ */ new Map();
      LAZY_LOADERS = {
        js: () => Promise.resolve().then(() => (init_js(), js_exports)),
        javascript: () => Promise.resolve().then(() => (init_js(), js_exports)),
        ts: () => Promise.resolve().then(() => (init_typescript(), typescript_exports)),
        typescript: () => Promise.resolve().then(() => (init_typescript(), typescript_exports)),
        html: () => Promise.resolve().then(() => (init_html(), html_exports)),
        xml: () => Promise.resolve().then(() => (init_html(), html_exports)),
        css: () => Promise.resolve().then(() => (init_css(), css_exports)),
        json: () => Promise.resolve().then(() => (init_json(), json_exports)),
        md: () => Promise.resolve().then(() => (init_markdown(), markdown_exports)),
        markdown: () => Promise.resolve().then(() => (init_markdown(), markdown_exports)),
        shell: () => Promise.resolve().then(() => (init_shell(), shell_exports)),
        bash: () => Promise.resolve().then(() => (init_shell(), shell_exports)),
        sh: () => Promise.resolve().then(() => (init_shell(), shell_exports)),
        sql: () => Promise.resolve().then(() => (init_sql(), sql_exports)),
        text: () => Promise.resolve().then(() => (init_plain(), plain_exports)),
        plain: () => Promise.resolve().then(() => (init_plain(), plain_exports)),
        txt: () => Promise.resolve().then(() => (init_plain(), plain_exports)),
        markup: () => Promise.resolve().then(() => (init_html(), html_exports)),
        console: () => Promise.resolve().then(() => (init_plain(), plain_exports)),
        php: () => Promise.resolve().then(() => (init_php(), php_exports)),
        blade: () => Promise.resolve().then(() => (init_blade(), blade_exports)),
        python: () => Promise.resolve().then(() => (init_python(), python_exports)),
        py: () => Promise.resolve().then(() => (init_python(), python_exports)),
        yaml: () => Promise.resolve().then(() => (init_yaml(), yaml_exports)),
        yml: () => Promise.resolve().then(() => (init_yaml(), yaml_exports)),
        go: () => Promise.resolve().then(() => (init_go(), go_exports)),
        golang: () => Promise.resolve().then(() => (init_go(), go_exports)),
        rust: () => Promise.resolve().then(() => (init_rust(), rust_exports)),
        rs: () => Promise.resolve().then(() => (init_rust(), rust_exports))
      };
      registerLanguage("js", lexJs);
    }
  });

  // core/highlight/render.js
  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, (c) => ESC[c] || c);
  }
  function renderTokens(tokens) {
    return tokens.map((t) => {
      const type = t.type === "plain" ? "" : t.type;
      const cls = type ? `velin-token velin-token--${type}` : "velin-token";
      return `<span class="${cls}">${escapeHtml(t.value)}</span>`;
    }).join("");
  }
  function applyHighlight(codeEl, tokens) {
    codeEl.innerHTML = renderTokens(tokens);
    codeEl.classList.add("velin-syntax-ready");
    codeEl.closest("pre")?.classList.add("velin-syntax-ready");
    codeEl.closest(".velin-code-block")?.classList.add("velin-syntax-ready");
  }
  var ESC;
  var init_render = __esm({
    "core/highlight/render.js"() {
      ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
    }
  });

  // core/highlight/highlight.js
  function resolveLanguage(el) {
    const pre = el.tagName === "PRE" ? el : el.closest("pre");
    const code = el.tagName === "CODE" ? el : pre?.querySelector("code") || el;
    const host = pre || code;
    const fromAttr = host.getAttribute("language") || host.getAttribute("data-language") || host.getAttribute("velin-code") || "";
    if (fromAttr && fromAttr !== "true") return normalizeLanguage(fromAttr);
    const cls = code?.className || "";
    const langMatch = cls.match(/\blanguage-([\w-]+)\b/i);
    if (langMatch) return normalizeLanguage(langMatch[1]);
    return "";
  }
  function getSourceText(el) {
    const code = el.tagName === "CODE" ? el : el.querySelector("code");
    const target = code || el;
    if (target.dataset.velinSource != null) return target.dataset.velinSource;
    const html2 = target.innerHTML;
    if (html2 && /&lt;|&gt;|&amp;/.test(html2)) {
      const ta = document.createElement("textarea");
      ta.innerHTML = html2.replace(/<br\s*\/?>/gi, "\n");
      if (ta.value) return ta.value;
    }
    return target.textContent || "";
  }
  async function highlightElement(el, options = {}) {
    if (el.dataset.velinHighlighted === "1") return;
    const pre = el.tagName === "PRE" ? el : el.closest("pre") || el;
    const codeEl = el.tagName === "CODE" ? el : pre.querySelector("code") || document.createElement("code");
    if (!pre.querySelector("code") && codeEl !== el) {
      const text2 = getSourceText(pre);
      codeEl.textContent = text2;
      pre.textContent = "";
      pre.appendChild(codeEl);
    }
    if (!codeEl.dataset.velinSource) {
      codeEl.dataset.velinSource = codeEl.textContent || "";
    }
    const lang = options.language || resolveLanguage(pre);
    if (!lang) return;
    pre.classList.add("velin-syntax-pending");
    codeEl.classList.add("velin-syntax-pending");
    let lexer = options.lexer || getLanguage(lang);
    if (!lexer) lexer = await lazyLoadLanguage(lang);
    if (!lexer) {
      lexer = getLanguage("text") || await lazyLoadLanguage("text");
    }
    const source = codeEl.dataset.velinSource || getSourceText(codeEl) || "";
    if (!lexer) {
      codeEl.textContent = source;
      pre.classList.remove("velin-syntax-pending");
      codeEl.classList.remove("velin-syntax-pending");
      pre.classList.add("velin-syntax-ready");
      codeEl.classList.add("velin-syntax-ready");
      return;
    }
    try {
      const tokens = lexer(source);
      applyHighlight(codeEl, tokens);
      codeEl.dataset.velinHighlighted = "1";
      pre.dataset.velinHighlighted = "1";
    } catch (err) {
      console.warn("[velin-highlight]", lang, err);
      codeEl.textContent = source;
    }
    pre.classList.remove("velin-syntax-pending");
    codeEl.classList.remove("velin-syntax-pending");
    pre.classList.add("velin-syntax-ready");
    codeEl.classList.add("velin-syntax-ready");
  }
  async function highlightAll(root = document) {
    const blocks = root.querySelectorAll(
      'pre[velin-code], pre[data-language], pre code[class*="language-"], [velin-code-block] pre, .velin-doc-example__code pre'
    );
    await Promise.all([...blocks].map((el) => highlightElement(el)));
  }
  var init_highlight = __esm({
    "core/highlight/highlight.js"() {
      init_registry();
      init_render();
    }
  });

  // core/motion/scheduler.js
  function scheduleInView(callback) {
    pending.add(callback);
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const batch = [...pending];
        pending.clear();
        batch.forEach((fn) => fn());
      });
    }
  }
  function getInViewObserver(options = {}) {
    if (typeof IntersectionObserver === "undefined") return null;
    if (!sharedObserver) {
      sharedObserver = new IntersectionObserver(
        (entries2) => {
          for (const entry of entries2) {
            if (!entry.isIntersecting) continue;
            const cb = observed.get(entry.target);
            if (cb) scheduleInView(() => cb(entry.target));
            const once = entry.target.dataset.velinOnce !== "false";
            if (once) sharedObserver.unobserve(entry.target);
          }
        },
        {
          threshold: options.threshold ?? 0.1,
          rootMargin: options.rootMargin ?? "0px 0px -40px 0px"
        }
      );
    }
    return sharedObserver;
  }
  function observeInView(el, onVisible, opts = {}) {
    const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionOff = el.closest('[data-velin-motion="off"]') || el.dataset.velinMotion === "off";
    if (reduced || motionOff) {
      scheduleInView(() => onVisible(el, true));
      return () => {
      };
    }
    const io = getInViewObserver(opts);
    if (!io) {
      scheduleInView(() => onVisible(el, true));
      return () => {
      };
    }
    observed.set(el, onVisible);
    io.observe(el);
    return () => {
      observed.delete(el);
      io.unobserve(el);
    };
  }
  function disconnectInViewObserver() {
    if (sharedObserver) {
      sharedObserver.disconnect();
      sharedObserver = null;
    }
  }
  var pending, rafId, sharedObserver, observed;
  var init_scheduler = __esm({
    "core/motion/scheduler.js"() {
      pending = /* @__PURE__ */ new Set();
      rafId = 0;
      sharedObserver = null;
      observed = /* @__PURE__ */ new WeakMap();
    }
  });

  // core/highlight/observe.js
  function initHighlight(root = document, options = {}) {
    if (typeof document === "undefined") return () => {
    };
    const selector = options.selector || [
      "pre[velin-code]",
      "pre[language]",
      "pre[data-language]",
      'pre code[class*="language-"]',
      "velin-code-block pre",
      ".velin-doc-example__code pre"
    ].join(",");
    const nodes = root.querySelectorAll(selector);
    const teardowns = [];
    const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const node of nodes) {
      const pre = node.tagName === "PRE" ? node : node.closest("pre");
      if (!pre || pre.dataset.velinObserve === "1") continue;
      pre.dataset.velinObserve = "1";
      if (reduced || options.immediate) {
        void highlightElement(pre);
        continue;
      }
      pre.classList.add("velin-syntax-pending");
      const stop = observeInView(pre, async (el) => {
        await highlightElement(el);
      });
      teardowns.push(stop);
    }
    return () => teardowns.forEach((fn) => fn());
  }
  var observeCodeBlocks;
  var init_observe = __esm({
    "core/highlight/observe.js"() {
      init_highlight();
      init_scheduler();
      observeCodeBlocks = initHighlight;
    }
  });

  // core/highlight/index.js
  var highlight_exports = {};
  __export(highlight_exports, {
    applyHighlight: () => applyHighlight,
    escapeHtml: () => escapeHtml,
    getLanguage: () => getLanguage,
    getSourceText: () => getSourceText,
    highlightAll: () => highlightAll,
    highlightElement: () => highlightElement,
    initHighlight: () => initHighlight,
    lazyLoadLanguage: () => lazyLoadLanguage,
    listLanguages: () => listLanguages,
    normalizeLanguage: () => normalizeLanguage,
    observeCodeBlocks: () => observeCodeBlocks,
    registerLanguage: () => registerLanguage,
    renderTokens: () => renderTokens,
    resolveLanguage: () => resolveLanguage,
    velinSyntax: () => velinSyntax
  });
  var velinSyntax;
  var init_highlight2 = __esm({
    "core/highlight/index.js"() {
      init_registry();
      init_render();
      init_highlight();
      init_observe();
      init_highlight();
      init_observe();
      init_registry();
      velinSyntax = {
        highlightElement,
        highlightAll,
        initHighlight,
        observeCodeBlocks,
        registerLanguage,
        lazyLoadLanguage,
        listLanguages
      };
    }
  });

  // components/velin-code-block.js
  var velin_code_block_exports = {};
  __export(velin_code_block_exports, {
    default: () => velin_code_block_default
  });
  function parseLineHighlight(spec) {
    const lines = /* @__PURE__ */ new Set();
    if (!spec) return lines;
    for (const part of spec.split(",")) {
      const p = part.trim();
      if (!p) continue;
      if (p.includes("-")) {
        const [a, b] = p.split("-").map((n) => parseInt(n, 10));
        if (!Number.isNaN(a) && !Number.isNaN(b)) {
          for (let i = Math.min(a, b); i <= Math.max(a, b); i += 1) lines.add(i);
        }
      } else {
        const n = parseInt(p, 10);
        if (!Number.isNaN(n)) lines.add(n);
      }
    }
    return lines;
  }
  var VelinCodeBlock, velin_code_block_default;
  var init_velin_code_block = __esm({
    "components/velin-code-block.js"() {
      init_highlight2();
      VelinCodeBlock = class extends HTMLElement {
        static get observedAttributes() {
          return ["language", "highlight", "line-numbers", "collapsed"];
        }
        connectedCallback() {
          if (this._built) return;
          this._built = true;
          this.classList.add("velin-code-block");
          this._render();
          this._setupHighlight();
        }
        attributeChangedCallback() {
          if (!this._built) return;
          this._render();
          this._setupHighlight();
        }
        _render() {
          const lang = this.getAttribute("language") || "";
          const showLines = this.hasAttribute("line-numbers");
          const collapsed = this.hasAttribute("collapsed");
          const highlightLines = parseLineHighlight(this.getAttribute("highlight") || "");
          const source = this.textContent.trim();
          this.textContent = "";
          const toolbar = document.createElement("div");
          toolbar.className = "velin-code-block__toolbar";
          toolbar.innerHTML = "";
          const copyWc = document.createElement("velin-copy");
          copyWc.setAttribute("value", source);
          copyWc.setAttribute("label", "Copy");
          toolbar.appendChild(copyWc);
          const panelId = `velin-code-panel-${Math.random().toString(36).slice(2, 9)}`;
          const wrap = document.createElement("div");
          wrap.id = panelId;
          wrap.className = showLines ? "velin-code-block__gutter" : "";
          if (collapsed) {
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "velin-btn velin-btn--sm velin-btn--ghost";
            toggle.textContent = "Expand";
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-controls", panelId);
            toggle.setAttribute("aria-label", "Expand code block");
            toggle.addEventListener("click", () => {
              const on = this.hasAttribute("data-collapsed");
              if (on) {
                this.removeAttribute("data-collapsed");
                toggle.textContent = "Collapse";
                toggle.setAttribute("aria-expanded", "true");
                toggle.setAttribute("aria-label", "Collapse code block");
              } else {
                this.setAttribute("data-collapsed", "");
                toggle.textContent = "Expand";
                toggle.setAttribute("aria-expanded", "false");
                toggle.setAttribute("aria-label", "Expand code block");
              }
            });
            this.setAttribute("data-collapsed", "");
            toolbar.appendChild(toggle);
          }
          if (showLines) {
            const gutter = document.createElement("div");
            gutter.className = "velin-code-block__line-numbers";
            const lines = source.split("\n");
            const lineCount = lines.length;
            gutter.textContent = "";
            for (let i = 0; i < lineCount; i += 1) {
              const n = i + 1;
              const span = document.createElement("span");
              if (highlightLines.has(n)) span.className = "velin-code-block__line--highlight";
              span.textContent = String(n);
              gutter.appendChild(span);
            }
            wrap.appendChild(gutter);
          }
          const pre = document.createElement("pre");
          if (lang) {
            pre.setAttribute("language", lang);
            pre.dataset.language = lang;
          }
          const code = document.createElement("code");
          if (lang) code.className = `language-${lang}`;
          code.textContent = source;
          pre.appendChild(code);
          wrap.appendChild(pre);
          this.appendChild(toolbar);
          this.appendChild(wrap);
          this._pre = pre;
        }
        async _setupHighlight() {
          if (!this._pre) return;
          delete this._pre.dataset.velinHighlighted;
          delete this._pre.dataset.velinObserve;
          const immediate = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (immediate) {
            await highlightElement(this._pre);
          } else {
            initHighlight(this, { root: this });
          }
        }
      };
      customElements.define("velin-code-block", VelinCodeBlock);
      velin_code_block_default = VelinCodeBlock;
    }
  });

  // components/velin-counter.js
  var velin_counter_exports = {};
  __export(velin_counter_exports, {
    default: () => velin_counter_default
  });
  function buildFormatter(host) {
    const format = (host.getAttribute("format") || "number").toLowerCase();
    const locale = host.getAttribute("locale") || void 0;
    const decimalsAttr = host.getAttribute("decimals");
    const decimals = decimalsAttr != null ? Math.max(0, Number.parseInt(decimalsAttr, 10) || 0) : null;
    const opts = {};
    if (decimals != null) {
      opts.minimumFractionDigits = decimals;
      opts.maximumFractionDigits = decimals;
    }
    if (format === "currency") {
      opts.style = "currency";
      opts.currency = host.getAttribute("currency") || "EUR";
    } else if (format === "percent") {
      opts.style = "percent";
    }
    try {
      return new Intl.NumberFormat(locale, opts);
    } catch {
      return new Intl.NumberFormat(void 0, opts);
    }
  }
  var easeOutExpo, VelinCounter, velin_counter_default;
  var init_velin_counter = __esm({
    "components/velin-counter.js"() {
      easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      VelinCounter = class extends HTMLElement {
        static get observedAttributes() {
          return ["from", "to", "duration", "decimals", "prefix", "suffix", "format", "currency", "locale"];
        }
        constructor() {
          super();
          this._rafId = 0;
          this._started = false;
          this._observer = null;
        }
        connectedCallback() {
          this.setAttribute("role", "status");
          this.setAttribute("aria-live", "polite");
          this.setAttribute("aria-atomic", "true");
          this._render(this._fromValue());
          if (this.getAttribute("autostart") === "false") return;
          this._scheduleStart();
        }
        disconnectedCallback() {
          cancelAnimationFrame(this._rafId);
          this._observer?.disconnect();
        }
        attributeChangedCallback(name) {
          if (!this.isConnected) return;
          if (name === "to" || name === "from") {
            this.start();
          } else {
            this._render(this._lastValue ?? this._toValue());
          }
        }
        _fromValue() {
          return Number.parseFloat(this.getAttribute("from")) || 0;
        }
        _toValue() {
          return Number.parseFloat(this.getAttribute("to")) || 0;
        }
        _duration() {
          return Math.max(0, Number.parseFloat(this.getAttribute("duration")) || 900);
        }
        _scheduleStart() {
          if (this._started) return;
          if (typeof IntersectionObserver === "undefined") {
            this.start();
            return;
          }
          this._observer = new IntersectionObserver((entries2) => {
            for (const entry of entries2) {
              if (entry.isIntersecting) {
                this.start();
                this._observer.disconnect();
                this._observer = null;
                break;
              }
            }
          }, { threshold: 0.2 });
          this._observer.observe(this);
        }
        start() {
          cancelAnimationFrame(this._rafId);
          this._started = true;
          const from = this._fromValue();
          const to = this._toValue();
          const duration = this._duration();
          const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduced || duration === 0) {
            this._render(to);
            return;
          }
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const value = from + (to - from) * easeOutExpo(t);
            this._render(value);
            if (t < 1) this._rafId = requestAnimationFrame(tick);
          };
          this._rafId = requestAnimationFrame(tick);
        }
        reset() {
          cancelAnimationFrame(this._rafId);
          this._started = false;
          this._render(this._fromValue());
        }
        _render(value) {
          this._lastValue = value;
          const formatter = buildFormatter(this);
          const prefix = this.getAttribute("prefix") || "";
          const suffix = this.getAttribute("suffix") || "";
          this.textContent = `${prefix}${formatter.format(value)}${suffix}`;
        }
      };
      if (typeof customElements !== "undefined" && !customElements.get("velin-counter")) {
        customElements.define("velin-counter", VelinCounter);
      }
      velin_counter_default = VelinCounter;
    }
  });

  // components/velin-data-table.js
  var velin_data_table_exports = {};
  __export(velin_data_table_exports, {
    default: () => velin_data_table_default
  });
  function sortValue(cell, type) {
    const raw = cell?.dataset?.sortValue ?? cell?.textContent ?? "";
    const text2 = raw.trim();
    if (type === "number") {
      const num = Number.parseFloat(text2.replace(/[^\d.,-]/g, "").replace(",", "."));
      return Number.isNaN(num) ? Number.NEGATIVE_INFINITY : num;
    }
    if (type === "date") {
      const time = Date.parse(text2);
      return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
    }
    return text2.toLowerCase();
  }
  var SORT_TYPES, warnedMissingName, VelinDataTable, velin_data_table_default;
  var init_velin_data_table = __esm({
    "components/velin-data-table.js"() {
      init_a11y_utils();
      SORT_TYPES = /* @__PURE__ */ new Set(["text", "number", "date"]);
      warnedMissingName = false;
      VelinDataTable = class extends HTMLElement {
        static get observedAttributes() {
          return ["page-size", "filter-input", "empty-text", "label", "editable"];
        }
        constructor() {
          super();
          this._table = null;
          this._page = 1;
          this._query = "";
          this._sortIndex = -1;
          this._sortDirection = "ascending";
          this._filterEl = null;
          this._pagination = null;
          this._emptyRow = null;
          this._filterTimer = null;
          this._onFilterInput = this._onFilterInput.bind(this);
        }
        connectedCallback() {
          this.classList.add("velin-data-table");
          requestAnimationFrame(() => this._init());
        }
        disconnectedCallback() {
          if (this._filterEl) this._filterEl.removeEventListener("input", this._onFilterInput);
          if (this._filterTimer) clearTimeout(this._filterTimer);
        }
        attributeChangedCallback(name, previous, next) {
          if (previous === next || !this._table) return;
          if (name === "page-size") {
            this._page = 1;
            this._render();
          } else if (name === "filter-input") {
            this._bindFilterInput();
          } else if (name === "label") {
            this._ensureAccessibleName();
          }
        }
        // ── Public API ─────────────────────────────────────────────────────────────
        /** @returns {HTMLTableRowElement[]} */
        get rows() {
          const body = this._table?.tBodies?.[0];
          return body ? [...body.rows].filter((row) => row !== this._emptyRow) : [];
        }
        /** Rows matching the current filter, across all pages. */
        get matchingRows() {
          return this.rows.filter((row) => !row.dataset.velinFiltered);
        }
        /** Rows visible on the current page. */
        get visibleRows() {
          return this.matchingRows.filter((row) => !row.hidden);
        }
        get page() {
          return this._page;
        }
        get pageSize() {
          const size = Number.parseInt(this.getAttribute("page-size") || "", 10);
          return Number.isFinite(size) && size > 0 ? size : 0;
        }
        get pageCount() {
          const size = this.pageSize;
          if (!size) return 1;
          return Math.max(1, Math.ceil(this.matchingRows.length / size));
        }
        /**
         * @param {number} index Column index
         * @param {'ascending' | 'descending'} [direction]
         */
        sort(index, direction) {
          const headers = this._headers();
          const header = headers[index];
          if (!header) return;
          const type = this._sortType(header);
          if (type === "none") return;
          this._sortDirection = direction || (this._sortIndex === index && this._sortDirection === "ascending" ? "descending" : "ascending");
          this._sortIndex = index;
          const factor = this._sortDirection === "ascending" ? 1 : -1;
          const body = this._table.tBodies[0];
          const sorted = this.rows.slice().sort((a, b) => {
            const av = sortValue(a.cells[index], type);
            const bv = sortValue(b.cells[index], type);
            if (av < bv) return -1 * factor;
            if (av > bv) return 1 * factor;
            return 0;
          });
          for (const row of sorted) body.appendChild(row);
          this._syncSortState();
          this._page = 1;
          this._render();
          const label = header.dataset.sortLabel || header.textContent.trim();
          announce(`${label} sorted ${this._sortDirection}`);
          this.dispatchEvent(new CustomEvent("velin-data-table-sort", {
            bubbles: true,
            detail: { index, direction: this._sortDirection, column: label }
          }));
        }
        /** @param {string} query */
        filter(query) {
          this._query = String(query || "").trim().toLowerCase();
          for (const row of this.rows) {
            const match = !this._query || this._rowText(row).includes(this._query);
            if (match) delete row.dataset.velinFiltered;
            else row.dataset.velinFiltered = "true";
          }
          this._page = 1;
          this._render();
          const count = this.matchingRows.length;
          announce(count === 1 ? "1 row matches" : `${count} rows match`);
          this.dispatchEvent(new CustomEvent("velin-data-table-filter", {
            bubbles: true,
            detail: { query: this._query, count }
          }));
        }
        /** @param {number} page */
        goToPage(page) {
          const target = Math.min(Math.max(1, Math.trunc(page) || 1), this.pageCount);
          if (target === this._page) return;
          this._page = target;
          this._render();
          announce(`Page ${this._page} of ${this.pageCount}`);
          this.dispatchEvent(new CustomEvent("velin-data-table-page", {
            bubbles: true,
            detail: { page: this._page, pageCount: this.pageCount }
          }));
        }
        // ── Setup ──────────────────────────────────────────────────────────────────
        _init() {
          this._table = this.querySelector("table");
          if (!this._table || !this._table.tBodies.length) return;
          this._ensureAccessibleName();
          this._setupSorting();
          this._setupEditable();
          this._bindFilterInput();
          this._render();
        }
        _headers() {
          const headRow = this._table.tHead?.rows?.[0];
          return headRow ? [...headRow.cells] : [];
        }
        /** @param {HTMLTableCellElement} header */
        _sortType(header) {
          const declared = (header.dataset.sort || "").toLowerCase();
          if (declared === "none") return "none";
          if (SORT_TYPES.has(declared)) return declared;
          return this.hasAttribute("sortable") ? "text" : "none";
        }
        /**
         * A table without a name is unusable with a screen reader, so surface it
         * instead of failing silently (WCAG 1.3.1 / 2.4.6).
         */
        _ensureAccessibleName() {
          const table = this._table;
          if (!table) return;
          const label = this.getAttribute("label");
          const hasName = table.caption?.textContent.trim() || table.getAttribute("aria-label")?.trim() || table.getAttribute("aria-labelledby")?.trim();
          if (!hasName && label) {
            table.setAttribute("aria-label", label);
            return;
          }
          if (!hasName && !warnedMissingName) {
            warnedMissingName = true;
            console.warn("[velinstyle] <velin-data-table> needs a <caption>, aria-label, or a label attribute.");
          }
        }
        /** Sortable headers get a real button so keyboard and AT support come for free. */
        _setupSorting() {
          this._headers().forEach((header, index) => {
            if (this._sortType(header) === "none") return;
            if (header.querySelector(".velin-data-table__sort")) return;
            const label = header.textContent.trim();
            header.dataset.sortLabel = label;
            header.setAttribute("aria-sort", "none");
            header.classList.add("velin-data-table__th");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "velin-data-table__sort";
            button.textContent = label;
            const icon = document.createElement("span");
            icon.className = "velin-data-table__sort-icon";
            icon.setAttribute("aria-hidden", "true");
            button.appendChild(icon);
            button.addEventListener("click", () => this.sort(index));
            header.textContent = "";
            header.appendChild(button);
          });
        }
        /**
         * Inline edit: double-click or Enter on focused cell with data-editable / host editable.
         * Enter saves, Escape cancels. Dispatches velin-data-table-edit.
         */
        _setupEditable() {
          if (!this.hasAttribute("editable") && !this.querySelector("[data-editable]")) return;
          const body = this._table.tBodies[0];
          if (!body || body.dataset.velinEditBound) return;
          body.dataset.velinEditBound = "true";
          body.addEventListener("dblclick", (e) => {
            const cell = e.target.closest("td");
            if (!cell || !body.contains(cell)) return;
            if (!this.hasAttribute("editable") && !cell.hasAttribute("data-editable")) return;
            this._beginEdit(cell);
          });
          body.addEventListener("keydown", (e) => {
            const cell = e.target.closest("td");
            if (!cell || e.target !== cell) return;
            if (e.key === "Enter" || e.key === "F2") {
              if (!this.hasAttribute("editable") && !cell.hasAttribute("data-editable")) return;
              e.preventDefault();
              this._beginEdit(cell);
            }
          });
          for (const cell of body.querySelectorAll("td[data-editable], td")) {
            if (!this.hasAttribute("editable") && !cell.hasAttribute("data-editable")) continue;
            if (!cell.hasAttribute("tabindex")) cell.setAttribute("tabindex", "0");
          }
        }
        /** @param {HTMLTableCellElement} cell */
        _beginEdit(cell) {
          if (cell.querySelector("input")) return;
          const previous = cell.textContent.trim();
          const input = document.createElement("input");
          input.className = "velin-input velin-data-table__edit";
          input.value = previous;
          input.setAttribute("aria-label", "Edit cell");
          cell.textContent = "";
          cell.appendChild(input);
          input.focus();
          input.select();
          const commit = (save) => {
            const next = save ? input.value.trim() : previous;
            cell.textContent = next;
            if (save && next !== previous) {
              this.dispatchEvent(new CustomEvent("velin-data-table-edit", {
                bubbles: true,
                detail: {
                  cell,
                  row: cell.parentElement,
                  previous,
                  value: next,
                  columnIndex: cell.cellIndex
                }
              }));
              announce("Cell updated");
            }
          };
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(true);
            } else if (e.key === "Escape") {
              e.preventDefault();
              commit(false);
            }
          });
          input.addEventListener("blur", () => commit(true));
        }
        _syncSortState() {
          this._headers().forEach((header, index) => {
            if (this._sortType(header) === "none") return;
            const active = index === this._sortIndex;
            header.setAttribute("aria-sort", active ? this._sortDirection : "none");
            header.querySelector(".velin-data-table__sort")?.classList.toggle("velin-data-table__sort--active", active);
          });
        }
        _bindFilterInput() {
          if (this._filterEl) this._filterEl.removeEventListener("input", this._onFilterInput);
          const selector = this.getAttribute("filter-input");
          this._filterEl = selector ? document.querySelector(selector) : null;
          if (this._filterEl) this._filterEl.addEventListener("input", this._onFilterInput);
        }
        _onFilterInput(event) {
          if (this._filterTimer) clearTimeout(this._filterTimer);
          const value = event.target.value;
          this._filterTimer = setTimeout(() => this.filter(value), 150);
        }
        /** @param {HTMLTableRowElement} row */
        _rowText(row) {
          const scoped = [...row.cells].filter((cell) => cell.hasAttribute("data-filter"));
          const cells = scoped.length ? scoped : [...row.cells];
          return cells.map((cell) => cell.textContent || "").join(" ").toLowerCase();
        }
        // ── Rendering ──────────────────────────────────────────────────────────────
        _render() {
          const size = this.pageSize;
          this._page = Math.min(this._page, this.pageCount);
          const matching = this.matchingRows;
          const start = size ? (this._page - 1) * size : 0;
          const end = size ? start + size : matching.length;
          for (const row of this.rows) {
            const index = matching.indexOf(row);
            row.hidden = index === -1 || index < start || index >= end;
          }
          this._renderEmptyState(matching.length === 0);
          this._renderPagination();
        }
        /** @param {boolean} isEmpty */
        _renderEmptyState(isEmpty) {
          if (!isEmpty) {
            this._emptyRow?.remove();
            this._emptyRow = null;
            return;
          }
          if (this._emptyRow?.isConnected) return;
          const columns = this._headers().length || 1;
          const row = document.createElement("tr");
          row.className = "velin-data-table__empty";
          const cell = document.createElement("td");
          cell.colSpan = columns;
          cell.textContent = this.getAttribute("empty-text") || "No matching rows";
          row.appendChild(cell);
          this._table.tBodies[0].appendChild(row);
          this._emptyRow = row;
        }
        _renderPagination() {
          if (!this.pageSize || this.pageCount <= 1) {
            this._pagination?.remove();
            this._pagination = null;
            return;
          }
          if (!this._pagination?.isConnected) {
            const nav = document.createElement("nav");
            nav.className = "velin-data-table__pagination";
            nav.setAttribute("aria-label", this.getAttribute("pagination-label") || "Table pagination");
            const previous2 = document.createElement("button");
            previous2.type = "button";
            previous2.className = "velin-btn velin-btn--outline velin-btn--sm";
            previous2.dataset.velinPage = "previous";
            previous2.textContent = this.getAttribute("previous-text") || "Previous";
            previous2.addEventListener("click", () => this.goToPage(this._page - 1));
            const status2 = document.createElement("p");
            status2.className = "velin-data-table__page-status";
            status2.dataset.velinPage = "status";
            const next2 = document.createElement("button");
            next2.type = "button";
            next2.className = "velin-btn velin-btn--outline velin-btn--sm";
            next2.dataset.velinPage = "next";
            next2.textContent = this.getAttribute("next-text") || "Next";
            next2.addEventListener("click", () => this.goToPage(this._page + 1));
            nav.append(previous2, status2, next2);
            this.appendChild(nav);
            this._pagination = nav;
          }
          const status = this._pagination.querySelector('[data-velin-page="status"]');
          if (status) status.textContent = `Page ${this._page} of ${this.pageCount}`;
          const previous = this._pagination.querySelector('[data-velin-page="previous"]');
          const next = this._pagination.querySelector('[data-velin-page="next"]');
          if (previous) previous.disabled = this._page <= 1;
          if (next) next.disabled = this._page >= this.pageCount;
        }
      };
      customElements.define("velin-data-table", VelinDataTable);
      velin_data_table_default = VelinDataTable;
    }
  });

  // components/velin-file-dropzone.js
  var velin_file_dropzone_exports = {};
  __export(velin_file_dropzone_exports, {
    default: () => velin_file_dropzone_default
  });
  var styles28, VelinFileDropzone, velin_file_dropzone_default;
  var init_velin_file_dropzone = __esm({
    "components/velin-file-dropzone.js"() {
      init_sanitize();
      styles28 = `
  :host { display: block; }
  .zone {
    border: 2px dashed var(--velin-color-border, #cbd5e1);
    border-radius: var(--velin-radius-md, 0.5rem);
    padding: var(--velin-space-6, 1.5rem);
    background: var(--velin-color-surface-dim, var(--velin-color-bg-subtle, #f8fafc));
    color: var(--velin-color-text, #111);
    text-align: center;
    transition: border-color 150ms ease, background 150ms ease;
  }
  :host([dragging]) .zone {
    border-color: var(--velin-color-primary, #2563eb);
    background: var(--velin-color-primary-subtle, #eff6ff);
  }
  .hint { margin: 0 0 var(--velin-space-3, 0.75rem); color: var(--velin-color-text-muted, #64748b); }
  .browse {
    display: inline-flex; align-items: center; justify-content: center;
    min-block-size: 2.75rem; padding-inline: var(--velin-space-4, 1rem);
    border-radius: var(--velin-radius-md, 0.5rem);
    border: none; cursor: pointer;
    background: var(--velin-color-primary, #2563eb);
    color: var(--velin-color-on-primary, #fff);
    font: inherit;
  }
  .browse:focus-visible { outline: 2px solid var(--velin-color-focus, #2563eb); outline-offset: 2px; }
  input[type="file"] {
    position: absolute; inline-size: 1px; block-size: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); border: 0;
  }
  .list { list-style: none; padding: 0; margin: var(--velin-space-4, 1rem) 0 0; text-align: start; }
  .list li {
    display: flex; justify-content: space-between; gap: var(--velin-space-3, 0.75rem);
    padding: var(--velin-space-2, 0.5rem) 0;
    border-block-end: 1px solid var(--velin-color-border, #e2e8f0);
    font-size: var(--velin-text-sm, 0.875rem);
  }
  .progress {
    margin-block-start: var(--velin-space-3, 0.75rem);
    block-size: 0.5rem; border-radius: 999px;
    background: var(--velin-color-border, #e2e8f0); overflow: hidden;
  }
  .bar {
    block-size: 100%; inline-size: 0%;
    background: var(--velin-color-primary, #2563eb);
    transition: inline-size 150ms ease;
  }
  .status { margin: var(--velin-space-2, 0.5rem) 0 0; font-size: var(--velin-text-sm, 0.875rem); }
  .status[data-tone="error"] { color: var(--velin-color-danger, #b91c1c); }
`;
      VelinFileDropzone = class extends HTMLElement {
        static get observedAttributes() {
          return ["accept", "multiple", "label", "progress"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._files = [];
        }
        connectedCallback() {
          this._render();
        }
        attributeChangedCallback() {
          if (this.shadowRoot?.querySelector(".zone")) this._render();
        }
        get files() {
          return this._files.slice();
        }
        _emitFiles(fileList) {
          const accept = this.getAttribute("accept");
          const files = [...fileList];
          if (accept) {
            const parts = accept.split(",").map((s) => s.trim().toLowerCase());
            const bad = files.find((f) => {
              const name = f.name.toLowerCase();
              const type = (f.type || "").toLowerCase();
              return !parts.some((p) => p.startsWith(".") ? name.endsWith(p) : type === p || type.startsWith(p.replace("/*", "/")));
            });
            if (bad) {
              this._setStatus(`File type not allowed: ${bad.name}`, "error");
              this.dispatchEvent(new CustomEvent("velin-error", { bubbles: true, detail: { message: "accept", file: bad } }));
              return;
            }
          }
          this._files = files;
          this._setStatus(files.length ? `${files.length} file(s) ready` : "", "ok");
          this.dispatchEvent(new CustomEvent("velin-files", { bubbles: true, detail: { files } }));
          this._renderList();
        }
        _setStatus(text2, tone = "ok") {
          const el = this.shadowRoot?.querySelector(".status");
          if (!el) return;
          el.textContent = text2;
          el.dataset.tone = tone;
        }
        _renderList() {
          const ul = this.shadowRoot?.querySelector(".list");
          if (!ul) return;
          ul.innerHTML = this._files.map((f) => `<li><span>${escapeHTML(f.name)}</span><span>${Math.round(f.size / 1024)} KB</span></li>`).join("");
        }
        _render() {
          const label = escapeHTML(this.getAttribute("label") || "Upload files");
          const accept = this.getAttribute("accept") || "";
          const multiple = this.hasAttribute("multiple");
          const progress = Math.max(0, Math.min(100, Number(this.getAttribute("progress") || 0)));
          this.shadowRoot.innerHTML = `
      <style>${styles28}</style>
      <div class="zone" role="group" aria-label="${label}">
        <p class="hint">Drag and drop files here, or browse. Client-side only \u2014 wire <code>velin-files</code> to your upload API.</p>
        <button type="button" class="browse">Browse files</button>
        <input type="file" ${accept ? `accept="${escapeHTML(accept)}"` : ""} ${multiple ? "multiple" : ""} />
        <div class="progress" hidden="${progress <= 0 ? "true" : "false"}" aria-hidden="${progress <= 0 ? "true" : "false"}">
          <div class="bar" style="inline-size:${progress}%"></div>
        </div>
        <p class="status" role="status" aria-live="polite"></p>
        <ul class="list"></ul>
      </div>
    `;
          const input = this.shadowRoot.querySelector("input");
          const browse = this.shadowRoot.querySelector(".browse");
          const zone = this.shadowRoot.querySelector(".zone");
          browse.addEventListener("click", () => input.click());
          input.addEventListener("change", () => {
            if (input.files?.length) this._emitFiles(input.files);
          });
          ["dragenter", "dragover"].forEach((ev) => {
            zone.addEventListener(ev, (e) => {
              e.preventDefault();
              this.setAttribute("dragging", "");
            });
          });
          ["dragleave", "drop"].forEach((ev) => {
            zone.addEventListener(ev, (e) => {
              e.preventDefault();
              this.removeAttribute("dragging");
            });
          });
          zone.addEventListener("drop", (e) => {
            const list = e.dataTransfer?.files;
            if (list?.length) this._emitFiles(list);
          });
          this._renderList();
        }
      };
      customElements.define("velin-file-dropzone", VelinFileDropzone);
      velin_file_dropzone_default = VelinFileDropzone;
    }
  });

  // components/velin-form-summary.js
  var velin_form_summary_exports = {};
  __export(velin_form_summary_exports, {
    default: () => velin_form_summary_default
  });
  function escapeSelector(value) {
    const text2 = String(value ?? "");
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(text2);
    return text2.replace(/[^\w-]/g, (char) => `\\${char}`);
  }
  function fieldLabel(field) {
    const explicit = field.getAttribute("data-error-label");
    if (explicit) return explicit;
    const ariaLabel = field.getAttribute("aria-label");
    if (ariaLabel?.trim()) return ariaLabel.trim();
    const labelledBy = field.getAttribute("aria-labelledby");
    if (labelledBy) {
      const text2 = labelledBy.split(/\s+/).map((id) => field.ownerDocument.getElementById(id)?.textContent?.trim() || "").filter(Boolean).join(" ");
      if (text2) return text2;
    }
    if (field.id) {
      const label = field.ownerDocument.querySelector(`label[for="${escapeSelector(field.id)}"]`);
      if (label?.textContent.trim()) return label.textContent.trim();
    }
    const wrapping = field.closest("label");
    if (wrapping?.textContent.trim()) return wrapping.textContent.trim();
    return field.name || "This field";
  }
  function fieldMessage(field) {
    return field.getAttribute("data-error-message")?.trim() || field.validationMessage || "Invalid value";
  }
  function addDescribedBy(field, id) {
    const ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    if (!ids.includes(id)) {
      ids.push(id);
      field.setAttribute("aria-describedby", ids.join(" "));
    }
  }
  function removeDescribedBy(field, id) {
    const ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    const next = ids.filter((value) => value !== id);
    if (next.length) field.setAttribute("aria-describedby", next.join(" "));
    else field.removeAttribute("aria-describedby");
  }
  var FIELD_SELECTOR, IGNORED_TYPES, fieldIdCounter, VelinFormSummary, velin_form_summary_default;
  var init_velin_form_summary = __esm({
    "components/velin-form-summary.js"() {
      init_a11y_utils();
      FIELD_SELECTOR = "input, select, textarea";
      IGNORED_TYPES = /* @__PURE__ */ new Set(["submit", "reset", "button", "image", "hidden"]);
      fieldIdCounter = 0;
      VelinFormSummary = class extends HTMLElement {
        static get observedAttributes() {
          return ["for", "heading"];
        }
        constructor() {
          super();
          this._form = null;
          this._panel = null;
          this._errors = [];
          this._onSubmit = this._onSubmit.bind(this);
          this._onFieldChange = this._onFieldChange.bind(this);
          this._onReset = this._onReset.bind(this);
        }
        connectedCallback() {
          this.classList.add("velin-form-summary");
          requestAnimationFrame(() => this._bindForm());
        }
        disconnectedCallback() {
          this._unbindForm();
        }
        attributeChangedCallback(name, previous, next) {
          if (previous === next) return;
          if (name === "for" && this.isConnected) {
            this._unbindForm();
            this._bindForm();
          } else if (name === "heading" && this._panel) {
            const heading = this._panel.querySelector(".velin-form-summary__heading");
            if (heading) heading.textContent = this.headingText;
          }
        }
        // ── Public API ─────────────────────────────────────────────────────────────
        get form() {
          return this._form;
        }
        /** @returns {{ field: HTMLElement, label: string, message: string }[]} */
        get errors() {
          return this._errors.slice();
        }
        get headingText() {
          return this.getAttribute("heading") || "There is a problem";
        }
        /** Validate the form and render the summary. @returns {boolean} valid */
        validate() {
          if (!this._form) return true;
          const errors = [];
          for (const field of this._fields()) {
            if (field.checkValidity()) {
              this._clearFieldError(field);
              continue;
            }
            const error = { field, label: fieldLabel(field), message: fieldMessage(field) };
            this._markFieldError(field, error.message);
            errors.push(error);
          }
          this._errors = errors;
          this._render();
          return errors.length === 0;
        }
        /** Remove the summary and all field error state. */
        clear() {
          for (const field of this._fields()) this._clearFieldError(field);
          this._errors = [];
          this._render();
        }
        /** Move focus to the first field with an error. */
        focusFirstError() {
          const first = this._errors[0];
          if (first) this._focusField(first.field);
        }
        // ── Form wiring ────────────────────────────────────────────────────────────
        _bindForm() {
          const id = this.getAttribute("for");
          this._form = id ? this.ownerDocument.getElementById(id) : this.closest("form");
          if (!this._form) return;
          if (!this.hasAttribute("native-validation")) this._form.noValidate = true;
          this._form.addEventListener("submit", this._onSubmit);
          this._form.addEventListener("reset", this._onReset);
          this._form.addEventListener("input", this._onFieldChange);
          this._form.addEventListener("change", this._onFieldChange);
        }
        _unbindForm() {
          if (!this._form) return;
          this._form.removeEventListener("submit", this._onSubmit);
          this._form.removeEventListener("reset", this._onReset);
          this._form.removeEventListener("input", this._onFieldChange);
          this._form.removeEventListener("change", this._onFieldChange);
          this._form = null;
        }
        /** @returns {HTMLElement[]} */
        _fields() {
          if (!this._form) return [];
          const seenRadioNames = /* @__PURE__ */ new Set();
          return [...this._form.querySelectorAll(FIELD_SELECTOR)].filter((field) => {
            if (IGNORED_TYPES.has(field.type)) return false;
            if (field.disabled || field.hasAttribute("data-error-ignore")) return false;
            if (typeof field.checkValidity !== "function") return false;
            if (field.type === "radio" && field.name) {
              if (seenRadioNames.has(field.name)) return false;
              seenRadioNames.add(field.name);
            }
            return true;
          });
        }
        _onSubmit(event) {
          if (this.validate()) return;
          event.preventDefault();
          this._announceErrors();
          this._focusPanel();
          this.dispatchEvent(new CustomEvent("velin-form-invalid", {
            bubbles: true,
            detail: { errors: this.errors.map(({ label, message }) => ({ label, message })) }
          }));
        }
        _onReset() {
          requestAnimationFrame(() => this.clear());
        }
        /** Re-validate a single field once it already had an error, never before. */
        _onFieldChange(event) {
          const field = event.target;
          if (!field || !this._errors.some((error) => error.field === field)) return;
          if (!field.checkValidity()) return;
          this._clearFieldError(field);
          this._errors = this._errors.filter((error) => error.field !== field);
          this._render();
          if (this._errors.length === 0) {
            this.dispatchEvent(new CustomEvent("velin-form-valid", { bubbles: true }));
          }
        }
        // ── Field state ────────────────────────────────────────────────────────────
        /** @param {HTMLElement} field */
        _errorId(field) {
          if (!field.id) field.id = `velin-field-${++fieldIdCounter}`;
          return `${field.id}-error`;
        }
        /**
         * @param {HTMLElement} field
         * @param {string} message
         */
        _markFieldError(field, message) {
          const errorId = this._errorId(field);
          field.setAttribute("aria-invalid", "true");
          let holder = this.ownerDocument.getElementById(errorId);
          if (!holder) {
            holder = this._form.querySelector(`[data-velin-error-for="${escapeSelector(field.name || field.id)}"]`);
          }
          if (!holder) {
            holder = this.ownerDocument.createElement("p");
            holder.dataset.velinErrorGenerated = "true";
            field.insertAdjacentElement("afterend", holder);
          }
          holder.id = errorId;
          holder.classList.add("velin-field-error");
          holder.textContent = message;
          addDescribedBy(field, errorId);
        }
        /** @param {HTMLElement} field */
        _clearFieldError(field) {
          if (!field.id) return;
          const errorId = `${field.id}-error`;
          field.removeAttribute("aria-invalid");
          removeDescribedBy(field, errorId);
          const holder = this.ownerDocument.getElementById(errorId);
          if (!holder) return;
          if (holder.dataset.velinErrorGenerated) holder.remove();
          else holder.textContent = "";
        }
        /** @param {HTMLElement} field */
        _focusField(field) {
          const target = field.type === "radio" && field.name ? this._form.querySelector(`input[type="radio"][name="${escapeSelector(field.name)}"]`) || field : field;
          target.focus();
          this.dispatchEvent(new CustomEvent("velin-form-error-focus", {
            bubbles: true,
            detail: { name: target.name || target.id }
          }));
        }
        // ── Summary panel ──────────────────────────────────────────────────────────
        _render() {
          if (!this._errors.length) {
            this._panel?.remove();
            this._panel = null;
            this.hidden = true;
            return;
          }
          this.hidden = false;
          if (!this._panel?.isConnected) {
            const panel = this.ownerDocument.createElement("div");
            panel.className = "velin-form-summary__panel velin-alert velin-alert--danger";
            panel.setAttribute("role", "alert");
            panel.tabIndex = -1;
            const heading = this.ownerDocument.createElement("p");
            heading.className = "velin-form-summary__heading";
            heading.textContent = this.headingText;
            const list2 = this.ownerDocument.createElement("ul");
            list2.className = "velin-form-summary__list";
            panel.append(heading, list2);
            this.appendChild(panel);
            this._panel = panel;
          }
          const list = this._panel.querySelector(".velin-form-summary__list");
          list.textContent = "";
          for (const error of this._errors) {
            const item = this.ownerDocument.createElement("li");
            const link = this.ownerDocument.createElement("a");
            link.href = `#${this._errorId(error.field).replace(/-error$/, "")}`;
            link.textContent = `${error.label}: ${error.message}`;
            link.addEventListener("click", (event) => {
              event.preventDefault();
              this._focusField(error.field);
            });
            item.appendChild(link);
            list.appendChild(item);
          }
        }
        _focusPanel() {
          this._panel?.focus();
        }
        _announceErrors() {
          const count = this._errors.length;
          announce(count === 1 ? "1 field needs attention" : `${count} fields need attention`, "assertive");
        }
      };
      customElements.define("velin-form-summary", VelinFormSummary);
      velin_form_summary_default = VelinFormSummary;
    }
  });

  // components/velin-live-dot.js
  var velin_live_dot_exports = {};
  __export(velin_live_dot_exports, {
    default: () => velin_live_dot_default
  });
  var STATUS_COLORS, styles29, KEYFRAMES_FALLBACK, VelinLiveDot, velin_live_dot_default;
  var init_velin_live_dot = __esm({
    "components/velin-live-dot.js"() {
      init_a11y_utils();
      STATUS_COLORS = {
        live: "var(--velin-color-success, oklch(60% 0.16 145))",
        paused: "var(--velin-color-text-muted, oklch(60% 0.02 240))",
        warning: "var(--velin-color-warning, oklch(75% 0.16 80))",
        error: "var(--velin-color-danger, oklch(60% 0.2 25))",
        muted: "var(--velin-color-border, oklch(85% 0.01 240))"
      };
      styles29 = `
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--velin-space-2, 0.5rem);
    font-size: inherit;
    color: inherit;
    line-height: 1.2;
  }
  .dot {
    inline-size: 0.55rem;
    block-size: 0.55rem;
    border-radius: 50%;
    background: var(--velin-live-color);
    flex-shrink: 0;
  }
  :host([pulse="false"]) .dot { animation: none; }
  :host(:not([pulse="false"])) .dot { animation: velin-live-pulse 1.8s var(--velin-ease-out, ease-out) infinite; }
  @media (prefers-reduced-motion: reduce) {
    .dot { animation: none !important; }
  }
`;
      KEYFRAMES_FALLBACK = `
@keyframes velin-live-pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in oklch, var(--velin-live-color) 65%, transparent); }
  70% { box-shadow: 0 0 0 0.6rem color-mix(in oklch, var(--velin-live-color) 0%, transparent); }
  100% { box-shadow: 0 0 0 0 transparent; }
}`;
      VelinLiveDot = class extends HTMLElement {
        static get observedAttributes() {
          return ["status", "pulse"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          this._render();
        }
        attributeChangedCallback() {
          if (this.shadowRoot) this._render();
        }
        _render() {
          const status = this.getAttribute("status") || "live";
          const color = STATUS_COLORS[status] || STATUS_COLORS.live;
          const label = this.getAttribute("aria-label") || liveDotLabel(status);
          this.setAttribute("role", "status");
          this.setAttribute("aria-label", label);
          this.style.setProperty("--velin-live-color", color);
          this.shadowRoot.innerHTML = `
      <style>${styles29}${KEYFRAMES_FALLBACK}</style>
      <span class="dot" aria-hidden="true"></span><slot></slot>
    `;
        }
      };
      if (typeof customElements !== "undefined" && !customElements.get("velin-live-dot")) {
        customElements.define("velin-live-dot", VelinLiveDot);
      }
      velin_live_dot_default = VelinLiveDot;
    }
  });

  // core/search/types.js
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
  var SEARCH_CATEGORIES, CATEGORY_BOOST;
  var init_types = __esm({
    "core/search/types.js"() {
      init_sanitize();
      SEARCH_CATEGORIES = /** @type {const} */
      ["docs", "components", "api", "examples"];
      CATEGORY_BOOST = {
        components: 1.25,
        api: 1.15,
        docs: 1,
        examples: 0.9
      };
    }
  });

  // core/search/engine.js
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
  function fuzzyMatch(text2, query, threshold) {
    if (!text2 || !query) return false;
    if (text2.includes(query)) return true;
    if (subsequenceMatch(text2, query)) return true;
    const maxDist = Math.max(1, Math.floor(query.length * threshold * 2));
    return levenshtein(text2.slice(0, Math.min(text2.length, query.length + 8)), query) <= maxDist;
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
  var VelinSearchEngine;
  var init_engine = __esm({
    "core/search/engine.js"() {
      init_types();
      VelinSearchEngine = class {
        constructor() {
          this._entries = [];
        }
        /** @param {import('./types.js').SearchEntry[]} entries */
        setEntries(entries2) {
          this._entries = entries2.map((e) => normalizeEntry(e)).filter(Boolean);
        }
        /** @param {import('./types.js').SearchEntry[]} entries */
        addEntries(entries2) {
          const next = entries2.map((e) => normalizeEntry(e)).filter(Boolean);
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
    }
  });

  // core/search/providers.js
  function registerSearchProvider(id, fn) {
    if (!id || typeof fn !== "function") {
      throw new Error("registerSearchProvider(id, fn) requires a non-empty id and function");
    }
    providers.set(id, fn);
  }
  async function collectProviderEntries() {
    const all = [];
    for (const fn of providers.values()) {
      const chunk = await fn();
      if (Array.isArray(chunk)) all.push(...chunk);
    }
    return all;
  }
  var providers;
  var init_providers = __esm({
    "core/search/providers.js"() {
      providers = /* @__PURE__ */ new Map();
    }
  });

  // core/search/highlight.js
  function highlightHtml(text2, query) {
    const raw = String(text2 || "");
    const q = String(query || "").trim();
    if (!q || q.length < 2) return escapeHtml2(raw);
    const lower = raw.toLowerCase();
    const ql = q.toLowerCase();
    let start = lower.indexOf(ql);
    let len = q.length;
    if (start === -1) {
      start = fuzzySubsequenceIndex(lower, ql);
      if (start === -1) return escapeHtml2(raw);
      len = Math.min(q.length, raw.length - start);
    }
    return escapeHtml2(raw.slice(0, start)) + '<mark class="velin-search-hit">' + escapeHtml2(raw.slice(start, start + len)) + "</mark>" + escapeHtml2(raw.slice(start + len));
  }
  function escapeHtml2(s) {
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
  var init_highlight3 = __esm({
    "core/search/highlight.js"() {
    }
  });

  // core/search/docs-url.js
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
  var DOCS_MOUNT, DOC_ROOT_SEGMENTS;
  var init_docs_url = __esm({
    "core/search/docs-url.js"() {
      DOCS_MOUNT = "/docs/";
      DOC_ROOT_SEGMENTS = /* @__PURE__ */ new Set([
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
    }
  });

  // core/search/worker-client.js
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
    const pending2 = /* @__PURE__ */ new Map();
    worker.onmessage = (e) => {
      const { id, ok, result, error } = e.data || {};
      const p = pending2.get(id);
      if (!p) return;
      pending2.delete(id);
      if (ok) p.resolve(result);
      else p.reject(new Error(error || "Worker error"));
    };
    worker.onerror = () => {
      for (const p of pending2.values()) p.reject(new Error("Worker failed"));
      pending2.clear();
    };
    function send(type, payload) {
      const id = ++_nextId;
      return new Promise((resolve, reject) => {
        pending2.set(id, { resolve, reject });
        worker.postMessage({ id, type, payload });
      });
    }
    return {
      setEntries(entries2) {
        return send("setEntries", { entries: entries2 });
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
    "core/search/worker-client.js"() {
      _nextId = 0;
    }
  });

  // core/search/index.js
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
        let entries2 = [];
        if (typeof source === "string") {
          const res = await fetch(source);
          entries2 = parseIndexPayload(await res.json());
        } else if (Array.isArray(source)) {
          entries2 = source;
        }
        engine.setEntries(entries2);
        const w = await getWorker();
        if (w) await w.setEntries(engine._entries);
        return entries2.length;
      },
      async query(q, opts) {
        const w = await getWorker();
        if (w) return w.query(q, opts);
        return engine.query(q, opts);
      },
      addEntries(entries2) {
        engine.addEntries(entries2);
        void getWorker().then((w) => w?.setEntries(engine._entries));
      }
    };
  }
  var defaultEngine, indexLoaded, velinSearch;
  var init_search = __esm({
    "core/search/index.js"() {
      init_engine();
      init_providers();
      init_highlight3();
      init_providers();
      init_types();
      init_docs_url();
      defaultEngine = new VelinSearchEngine();
      indexLoaded = false;
      velinSearch = {
        engine: defaultEngine,
        /**
         * Load JSON index from URL (offline after fetch) or pass entries directly.
         * @param {string|import('./types.js').SearchEntry[]} source
         */
        async loadIndex(source) {
          let entries2 = [];
          if (typeof source === "string") {
            const res = await fetch(source);
            if (!res.ok) throw new Error(`Failed to load search index: ${res.status}`);
            entries2 = parseIndexPayload(await res.json());
          } else if (Array.isArray(source)) {
            entries2 = source;
          }
          defaultEngine.setEntries(entries2);
          const providerEntries = await collectProviderEntries();
          if (providerEntries.length) defaultEngine.addEntries(providerEntries);
          indexLoaded = true;
          return entries2.length;
        },
        /**
         * Merge entries without replacing the full index.
         * @param {import('./types.js').SearchEntry[]} entries
         */
        addEntries(entries2) {
          defaultEngine.addEntries(entries2);
        },
        /**
         * Refresh entries from registered providers.
         */
        async refreshProviders() {
          const providerEntries = await collectProviderEntries();
          if (providerEntries.length) defaultEngine.addEntries(providerEntries);
          return providerEntries.length;
        },
        /**
         * @param {string} query
         * @param {object} [options]
         */
        async query(query, options = {}) {
          if (!indexLoaded && defaultEngine._entries.length === 0) {
            await this.refreshProviders();
          }
          return defaultEngine.query(query, options);
        },
        isReady() {
          return indexLoaded || defaultEngine._entries.length > 0;
        }
      };
    }
  });

  // components/velin-search.js
  var velin_search_exports = {};
  __export(velin_search_exports, {
    bindDeclarativeSearch: () => bindDeclarativeSearch,
    default: () => velin_search_default
  });
  function bindDeclarativeSearch(root = document) {
    root.querySelectorAll("[velin-search-input]").forEach((input) => {
      if (input.dataset.velinSearchBound) return;
      input.dataset.velinSearchBound = "1";
      let host = input.closest("velin-search");
      if (!host) {
        host = document.createElement("velin-search");
        host.setAttribute("index", input.getAttribute("data-search-index") || "/search-index.json");
        const results = input.parentElement?.querySelector("[velin-search-results]");
        input.before(host);
        host.appendChild(input);
        if (results) host.appendChild(results);
      }
    });
  }
  var CATEGORY_LABELS, VelinSearch, velin_search_default;
  var init_velin_search = __esm({
    "components/velin-search.js"() {
      init_search();
      init_sanitize();
      CATEGORY_LABELS = {
        docs: "Documentation",
        components: "Components",
        api: "API",
        examples: "Examples"
      };
      VelinSearch = class extends HTMLElement {
        static get observedAttributes() {
          return ["index", "categories", "min-chars", "fuzzy", "placeholder", "debounce"];
        }
        constructor() {
          super();
          this._search = createSearch();
          this._debounceTimer = null;
          this._activeIndex = -1;
          this._flatResults = [];
          this._indexLoaded = false;
          this._listId = `velin-search-listbox-${Math.random().toString(36).slice(2, 9)}`;
          this._mounted = false;
        }
        connectedCallback() {
          if (this._mounted) return;
          this._mounted = true;
          this._ensureMarkup();
          this._loadIndex();
          this._bindEvents();
        }
        disconnectedCallback() {
          this._teardown?.();
          this._mounted = false;
        }
        get indexUrl() {
          return this.getAttribute("index") || "/search-index.json";
        }
        get minChars() {
          return parseInt(this.getAttribute("min-chars") || "2", 10);
        }
        get fuzzy() {
          const v = this.getAttribute("fuzzy");
          return v === null ? 0.2 : parseFloat(v) || 0;
        }
        get categories() {
          const raw = this.getAttribute("categories");
          if (!raw) return null;
          return raw.split(",").map((c) => c.trim()).filter((c) => SEARCH_CATEGORIES.includes(c));
        }
        get debounceMs() {
          return parseInt(this.getAttribute("debounce") || "120", 10);
        }
        _ensureMarkup() {
          if (this.querySelector("[data-velin-search-input]")) return;
          const ph = escapeHTMLAttribute(this.getAttribute("placeholder") || "Search\u2026");
          const label = escapeHTMLAttribute(this.getAttribute("aria-label") || "Search");
          this.innerHTML = `
      <div class="velin-search">
        <div class="velin-search__field">
          <input type="search" class="velin-search__input" data-velin-search-input
            placeholder="${ph}" autocomplete="off" role="combobox" aria-expanded="false"
            aria-label="${label}" aria-controls="${this._listId}" aria-autocomplete="list" />
        </div>
        <div class="velin-search__status velin-visually-hidden" data-velin-search-status aria-live="polite" aria-atomic="true"></div>
        <div class="velin-search__results" data-velin-search-results role="listbox"
          id="${this._listId}" hidden></div>
      </div>
    `;
        }
        _inputEl() {
          return this.querySelector("[data-velin-search-input]");
        }
        _resultsEl() {
          return this.querySelector("[data-velin-search-results]");
        }
        async _loadIndex() {
          try {
            await this._search.loadIndex(this.indexUrl);
            this._indexLoaded = true;
          } catch {
            this._indexLoaded = false;
          }
        }
        _bindEvents() {
          const input = this._inputEl();
          const panel = this._resultsEl();
          if (!input || !panel) return;
          input.addEventListener("input", () => {
            clearTimeout(this._debounceTimer);
            this._debounceTimer = setTimeout(() => this._runQuery(input.value), this.debounceMs);
          });
          input.addEventListener("focus", () => {
            if (input.value.trim().length >= this.minChars) this._runQuery(input.value);
          });
          input.addEventListener("keydown", (e) => this._onKeydown(e, input, panel));
          const onDocClick = (e) => {
            if (!this.contains(e.target)) this._hide(panel, input);
          };
          document.addEventListener("click", onDocClick);
          this._teardown = () => {
            document.removeEventListener("click", onDocClick);
            clearTimeout(this._debounceTimer);
          };
        }
        async _runQuery(raw) {
          const input = this._inputEl();
          const panel = this._resultsEl();
          if (!input || !panel) return;
          const q = raw.trim();
          if (q.length < this.minChars) {
            this._hide(panel, input);
            return;
          }
          if (!this._indexLoaded) await this._loadIndex();
          const { groups } = await this._search.query(q, {
            minChars: this.minChars,
            fuzzy: this.fuzzy,
            categories: this.categories || void 0,
            limit: 12
          });
          this._activeIndex = -1;
          this._renderResults(panel, input, q, groups);
          if (this._flatResults.length) {
            panel.hidden = false;
            panel.classList.add("velin-search__results--open");
            input.setAttribute("aria-expanded", "true");
          } else {
            this._hide(panel, input);
          }
        }
        _renderResults(panel, input, q, groups) {
          panel.innerHTML = "";
          const order = this.categories || [...SEARCH_CATEGORIES];
          this._flatResults = [];
          let globalIdx = 0;
          for (const cat of order) {
            const items = groups[cat];
            if (!items?.length) continue;
            const groupId = `${this._listId}-group-${cat}`;
            const group = document.createElement("div");
            group.setAttribute("role", "group");
            group.setAttribute("aria-labelledby", groupId);
            const heading = document.createElement("div");
            heading.className = "velin-search__group-label";
            heading.id = groupId;
            heading.textContent = CATEGORY_LABELS[cat] || cat;
            group.appendChild(heading);
            for (const item of items) {
              const a = document.createElement("a");
              const navHref = resolveDocsSearchUrl(item.url);
              if (navHref) a.href = navHref;
              a.className = "velin-search__item";
              a.setAttribute("role", "option");
              a.id = `velin-search-opt-${globalIdx}`;
              a.innerHTML = `<span class="velin-search__title">${highlightHtml(item.title, q)}</span><span class="velin-search__excerpt">${highlightHtml(item.excerpt || "", q)}</span>`;
              a.addEventListener(
                "click",
                (e) => {
                  e.preventDefault();
                  if (navHref) window.location.assign(navHref);
                },
                true
              );
              a.addEventListener("mouseenter", () => this._setActive(globalIdx, panel, input));
              group.appendChild(a);
              this._flatResults.push(item);
              globalIdx++;
            }
            panel.appendChild(group);
          }
          const status = this._statusEl();
          if (status) {
            status.textContent = this._flatResults.length ? `${this._flatResults.length} results` : "No results";
          }
        }
        _statusEl() {
          return this.querySelector("[data-velin-search-status]");
        }
        _setActive(idx, panel, input) {
          this._activeIndex = idx;
          panel.querySelectorAll(".velin-search__item").forEach((el, i) => {
            el.classList.toggle("velin-search__item--active", i === idx);
            if (i === idx) {
              input.setAttribute("aria-activedescendant", el.id);
              el.scrollIntoView({ block: "nearest" });
            }
          });
        }
        _onKeydown(e, input, panel) {
          if (e.key === "Escape") {
            this._hide(panel, input);
            return;
          }
          if (!this._flatResults.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = this._activeIndex < this._flatResults.length - 1 ? this._activeIndex + 1 : 0;
            this._setActive(next, panel, input);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev = this._activeIndex > 0 ? this._activeIndex - 1 : this._flatResults.length - 1;
            this._setActive(prev, panel, input);
          } else if (e.key === "Enter") {
            const target = this._activeIndex >= 0 ? this._flatResults[this._activeIndex] : this._flatResults[0];
            const navHref = target?.url ? resolveDocsSearchUrl(target.url) : "";
            if (navHref) {
              e.preventDefault();
              window.location.assign(navHref);
            }
          }
        }
        _hide(panel, input) {
          panel.hidden = true;
          panel.classList.remove("velin-search__results--open");
          input.setAttribute("aria-expanded", "false");
          input.removeAttribute("aria-activedescendant");
          this._activeIndex = -1;
        }
      };
      velin_search_default = VelinSearch;
      if (typeof HTMLElement !== "undefined" && typeof customElements !== "undefined" && !customElements.get("velin-search")) {
        customElements.define("velin-search", VelinSearch);
      }
    }
  });

  // components/velin-secure-field.js
  var velin_secure_field_exports = {};
  __export(velin_secure_field_exports, {
    default: () => velin_secure_field_default
  });
  async function encryptValue(plain, mode) {
    if (mode !== "aes-gcm" || !globalThis.crypto?.subtle) {
      return JSON.stringify({ encoding: "base64", payload: btoa(unescape(encodeURIComponent(plain))) });
    }
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt"]);
    const encoded = new TextEncoder().encode(plain);
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    return JSON.stringify({
      encoding: "aes-gcm",
      iv: Array.from(iv),
      cipher: Array.from(new Uint8Array(cipher))
    });
  }
  var styles30, VelinSecureField, velin_secure_field_default;
  var init_velin_secure_field = __esm({
    "components/velin-secure-field.js"() {
      init_sanitize();
      styles30 = `
  :host { display: block; }
  label { display: block; font-size: var(--velin-text-sm); margin-block-end: var(--velin-space-1); }
  input {
    width: 100%;
    min-height: 2.75rem;
    padding: var(--velin-space-2) var(--velin-space-3);
    font: inherit;
    border: 1px solid var(--velin-color-border);
    border-radius: var(--velin-radius-md);
  }
  input:focus-visible {
    outline: 3px solid var(--velin-color-focus);
    outline-offset: 2px;
  }
  .velin-field-help {
    font-size: var(--velin-text-xs);
    color: var(--velin-color-text-muted);
    margin-block-start: var(--velin-space-1);
  }
`;
      VelinSecureField = class extends HTMLElement {
        static get observedAttributes() {
          return ["type", "name", "label", "mode", "autocomplete"];
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this._onChange = null;
        }
        connectedCallback() {
          if (!this._onChange) this.render();
        }
        disconnectedCallback() {
          const input = this.shadowRoot?.querySelector("input");
          if (input && this._onChange) input.removeEventListener("change", this._onChange);
          this._onChange = null;
        }
        attributeChangedCallback() {
          if (this.isConnected) this.render();
        }
        render() {
          const type = sanitizeInputType(this.getAttribute("type"));
          const name = this.getAttribute("name") || "secure";
          const label = this.getAttribute("label") || "Secure field";
          const autocomplete = escapeHTMLAttribute(this.getAttribute("autocomplete") || "off");
          const id = `velin-secure-${Math.random().toString(36).slice(2, 9)}`;
          const input = this.shadowRoot?.querySelector("input");
          if (input && this._onChange) input.removeEventListener("change", this._onChange);
          this.shadowRoot.innerHTML = `
      <style>${styles30}</style>
      <label for="${id}">${escapeHTML(label)}</label>
      <input id="${id}" type="${type}" autocomplete="${autocomplete}" part="input" />
      <p class="velin-field-help">Demo-only client encoding \u2014 use HTTPS and server-side crypto for real secrets.</p>
    `;
          const newInput = this.shadowRoot.querySelector("input");
          this._onChange = async () => {
            const mode = this.getAttribute("mode") || "aes-gcm";
            const payload = await encryptValue(newInput.value, mode);
            this.dispatchEvent(new CustomEvent("velin-secure-submit", {
              bubbles: true,
              detail: { name, payload }
            }));
          };
          newInput.addEventListener("change", this._onChange);
        }
      };
      if (!customElements.get("velin-secure-field")) {
        customElements.define("velin-secure-field", VelinSecureField);
      }
      velin_secure_field_default = VelinSecureField;
    }
  });

  // components/velin-sparkline.js
  var velin_sparkline_exports = {};
  __export(velin_sparkline_exports, {
    default: () => velin_sparkline_default
  });
  function parseValues(raw) {
    if (!raw) return [];
    const trimmed = String(raw).trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map(Number).filter((n) => Number.isFinite(n)) : [];
      } catch {
        return [];
      }
    }
    return trimmed.split(/[\s,]+/).map((s) => Number.parseFloat(s)).filter((n) => Number.isFinite(n));
  }
  function buildPoints(values, w, h, min, max) {
    const n = values.length;
    if (n === 0) return [];
    if (n === 1) {
      return [[0, h / 2], [w, h / 2]];
    }
    const range = Math.max(max - min, 1e-6);
    const stepX = w / (n - 1);
    return values.map((v, i) => {
      const x = i * stepX;
      const y = h - (v - min) / range * h;
      return [x, y];
    });
  }
  function pointsToPath(points) {
    if (!points.length) return "";
    return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  }
  function pointsToArea(points, h) {
    if (!points.length) return "";
    const line = pointsToPath(points);
    const last = points[points.length - 1][0];
    const first = points[0][0];
    return `${line} L${last.toFixed(2)},${h} L${first.toFixed(2)},${h} Z`;
  }
  var NS, VelinSparkline, velin_sparkline_default;
  var init_velin_sparkline = __esm({
    "components/velin-sparkline.js"() {
      NS = "http://www.w3.org/2000/svg";
      VelinSparkline = class extends HTMLElement {
        static get observedAttributes() {
          return ["values", "width", "height", "min", "max", "area", "glow", "animate", "label"];
        }
        constructor() {
          super();
          this._values = [];
          this._gradientId = `velin-spark-grad-${Math.random().toString(36).slice(2, 8)}`;
        }
        connectedCallback() {
          this._render();
        }
        attributeChangedCallback() {
          if (this.isConnected) this._render();
        }
        get values() {
          return this._values.slice();
        }
        set values(arr) {
          if (!Array.isArray(arr)) return;
          this._values = arr.filter((n) => Number.isFinite(Number(n))).map(Number);
          this.setAttribute("values", this._values.join(","));
        }
        update(values) {
          if (!Array.isArray(values)) return;
          this._values = values.filter((n) => Number.isFinite(Number(n))).map(Number);
          this._render({ tick: true });
        }
        _render({ tick = false } = {}) {
          const w = Number.parseFloat(this.getAttribute("width")) || 320;
          const h = Number.parseFloat(this.getAttribute("height")) || 96;
          const values = this._values.length ? this._values : parseValues(this.getAttribute("values"));
          this._values = values;
          if (!values.length) {
            this.innerHTML = "";
            return;
          }
          const minAttr = Number.parseFloat(this.getAttribute("min"));
          const maxAttr = Number.parseFloat(this.getAttribute("max"));
          const min = Number.isFinite(minAttr) ? minAttr : Math.min(...values);
          const max = Number.isFinite(maxAttr) ? maxAttr : Math.max(...values);
          const wantsArea = this.hasAttribute("area") && this.getAttribute("area") !== "false";
          const wantsGlow = this.hasAttribute("glow") && this.getAttribute("glow") !== "false";
          const animate = (this.getAttribute("animate") || "draw").toLowerCase();
          const points = buildPoints(values, w, h, min, max);
          const linePath = pointsToPath(points);
          const areaPath = wantsArea ? pointsToArea(points, h) : "";
          this.innerHTML = "";
          const svg2 = document.createElementNS(NS, "svg");
          svg2.setAttribute("viewBox", `0 0 ${w} ${h}`);
          svg2.setAttribute("preserveAspectRatio", "none");
          svg2.style.display = "block";
          svg2.style.width = "100%";
          svg2.style.height = "100%";
          this._applyA11y(svg2);
          if (wantsArea) {
            const defs = document.createElementNS(NS, "defs");
            const grad = document.createElementNS(NS, "linearGradient");
            grad.setAttribute("id", this._gradientId);
            grad.setAttribute("x1", "0");
            grad.setAttribute("x2", "0");
            grad.setAttribute("y1", "0");
            grad.setAttribute("y2", "1");
            const stops = [
              ["0%", "currentColor", "0.35"],
              ["100%", "currentColor", "0"]
            ];
            stops.forEach(([offset, color, op]) => {
              const stop = document.createElementNS(NS, "stop");
              stop.setAttribute("offset", offset);
              stop.setAttribute("stop-color", color);
              stop.setAttribute("stop-opacity", op);
              grad.appendChild(stop);
            });
            defs.appendChild(grad);
            svg2.appendChild(defs);
            const area = document.createElementNS(NS, "path");
            area.setAttribute("d", areaPath);
            area.setAttribute("fill", `url(#${this._gradientId})`);
            area.setAttribute("stroke", "none");
            area.classList.add("velin-chart-area");
            svg2.appendChild(area);
          }
          const line = document.createElementNS(NS, "path");
          line.setAttribute("d", linePath);
          line.setAttribute("fill", "none");
          line.setAttribute("stroke", "currentColor");
          line.setAttribute("stroke-width", "2");
          line.setAttribute("stroke-linecap", "round");
          line.setAttribute("stroke-linejoin", "round");
          line.setAttribute("vector-effect", "non-scaling-stroke");
          svg2.appendChild(line);
          if (wantsGlow) svg2.classList.add("velin-chart-glow");
          this.appendChild(svg2);
          if (animate !== "none") {
            const len = typeof line.getTotalLength === "function" && line.getTotalLength() || w;
            line.style.setProperty("--velin-chart-len", len.toFixed(2));
            line.classList.add("velin-chart-line");
          } else {
            line.style.strokeDasharray = "";
            line.style.strokeDashoffset = "";
          }
          if (tick) {
            this.classList.remove("velin-spark-tick");
            void this.offsetWidth;
            this.classList.add("velin-spark-tick");
          }
        }
        _applyA11y(svg2) {
          const label = (this.getAttribute("label") || this.getAttribute("aria-label") || "").trim();
          if (label) {
            svg2.setAttribute("role", "img");
            svg2.setAttribute("aria-label", label);
            svg2.removeAttribute("aria-hidden");
            svg2.removeAttribute("aria-labelledby");
            return;
          }
          const cap = this.closest("figure")?.querySelector("figcaption");
          const capText = cap?.textContent?.trim();
          if (capText) {
            if (!cap.id) cap.id = `velin-sparkline-cap-${Math.random().toString(36).slice(2, 9)}`;
            svg2.setAttribute("role", "img");
            svg2.setAttribute("aria-labelledby", cap.id);
            svg2.removeAttribute("aria-hidden");
            svg2.removeAttribute("aria-label");
            return;
          }
          svg2.setAttribute("role", "presentation");
          svg2.setAttribute("aria-hidden", "true");
          svg2.setAttribute("focusable", "false");
          svg2.removeAttribute("aria-label");
          svg2.removeAttribute("aria-labelledby");
        }
      };
      if (typeof customElements !== "undefined" && !customElements.get("velin-sparkline")) {
        customElements.define("velin-sparkline", VelinSparkline);
      }
      velin_sparkline_default = VelinSparkline;
    }
  });

  // components/runtime/component-loaders.js
  var COMPONENT_LOADERS;
  var init_component_loaders = __esm({
    "components/runtime/component-loaders.js"() {
      COMPONENT_LOADERS = {
        "velin-accordion": () => Promise.resolve().then(() => (init_velin_accordion(), velin_accordion_exports)),
        "velin-announcer": () => Promise.resolve().then(() => (init_velin_announcer(), velin_announcer_exports)),
        "velin-bottom-nav": () => Promise.resolve().then(() => (init_velin_bottom_nav(), velin_bottom_nav_exports)),
        "velin-calendar": () => Promise.resolve().then(() => (init_velin_calendar(), velin_calendar_exports)),
        "velin-carousel": () => Promise.resolve().then(() => (init_velin_carousel(), velin_carousel_exports)),
        "velin-code-block": () => Promise.resolve().then(() => (init_velin_code_block(), velin_code_block_exports)),
        "velin-collapse": () => Promise.resolve().then(() => (init_velin_collapse(), velin_collapse_exports)),
        "velin-combobox": () => Promise.resolve().then(() => (init_velin_combobox(), velin_combobox_exports)),
        "velin-command": () => Promise.resolve().then(() => (init_velin_command(), velin_command_exports)),
        "velin-copy": () => Promise.resolve().then(() => (init_velin_copy(), velin_copy_exports)),
        "velin-countdown": () => Promise.resolve().then(() => (init_velin_countdown(), velin_countdown_exports)),
        "velin-counter": () => Promise.resolve().then(() => (init_velin_counter(), velin_counter_exports)),
        "velin-data-table": () => Promise.resolve().then(() => (init_velin_data_table(), velin_data_table_exports)),
        "velin-dialog": () => Promise.resolve().then(() => (init_velin_dialog(), velin_dialog_exports)),
        "velin-drawer": () => Promise.resolve().then(() => (init_velin_drawer(), velin_drawer_exports)),
        "velin-dropdown": () => Promise.resolve().then(() => (init_velin_dropdown(), velin_dropdown_exports)),
        "velin-email": () => Promise.resolve().then(() => (init_velin_email(), velin_email_exports)),
        "velin-file-dropzone": () => Promise.resolve().then(() => (init_velin_file_dropzone(), velin_file_dropzone_exports)),
        "velin-form-summary": () => Promise.resolve().then(() => (init_velin_form_summary(), velin_form_summary_exports)),
        "velin-icon": () => Promise.resolve().then(() => (init_velin_icon(), velin_icon_exports)),
        "velin-lightbox": () => Promise.resolve().then(() => (init_velin_lightbox(), velin_lightbox_exports)),
        "velin-live-dot": () => Promise.resolve().then(() => (init_velin_live_dot(), velin_live_dot_exports)),
        "velin-menubar": () => Promise.resolve().then(() => (init_velin_menubar(), velin_menubar_exports)),
        "velin-modal": () => Promise.resolve().then(() => (init_velin_modal(), velin_modal_exports)),
        "velin-persist": () => Promise.resolve().then(() => (init_velin_persist(), velin_persist_exports)),
        "velin-popover": () => Promise.resolve().then(() => (init_velin_popover(), velin_popover_exports)),
        "velin-progress-ring": () => Promise.resolve().then(() => (init_velin_progress_ring(), velin_progress_ring_exports)),
        "velin-rating": () => Promise.resolve().then(() => (init_velin_rating(), velin_rating_exports)),
        "velin-scroll-top": () => Promise.resolve().then(() => (init_velin_scroll_top(), velin_scroll_top_exports)),
        "velin-scrollspy": () => Promise.resolve().then(() => (init_velin_scrollspy(), velin_scrollspy_exports)),
        "velin-search": () => Promise.resolve().then(() => (init_velin_search(), velin_search_exports)),
        "velin-secure-field": () => Promise.resolve().then(() => (init_velin_secure_field(), velin_secure_field_exports)),
        "velin-segmented-control": () => Promise.resolve().then(() => (init_velin_segmented_control(), velin_segmented_control_exports)),
        "velin-sheet": () => Promise.resolve().then(() => (init_velin_sheet(), velin_sheet_exports)),
        "velin-sparkline": () => Promise.resolve().then(() => (init_velin_sparkline(), velin_sparkline_exports)),
        "velin-stepper": () => Promise.resolve().then(() => (init_velin_stepper(), velin_stepper_exports)),
        "velin-stepper-wc": () => Promise.resolve().then(() => (init_velin_stepper(), velin_stepper_exports)),
        "velin-tabs": () => Promise.resolve().then(() => (init_velin_tabs(), velin_tabs_exports)),
        "velin-theme-toggle": () => Promise.resolve().then(() => (init_velin_theme_toggle(), velin_theme_toggle_exports)),
        "velin-toast": () => Promise.resolve().then(() => (init_velin_toast(), velin_toast_exports)),
        "velin-tooltip": () => Promise.resolve().then(() => (init_velin_tooltip(), velin_tooltip_exports)),
        "velin-tooltip-wc": () => Promise.resolve().then(() => (init_velin_tooltip(), velin_tooltip_exports))
      };
    }
  });

  // core/motion/effects.js
  function applyEffects(el, attrs = {}) {
    const classes = /* @__PURE__ */ new Set();
    for (const [name, value] of Object.entries(attrs)) {
      if (value === "false" || value === "off") continue;
      const mapped = EFFECT_MAP[name];
      if (mapped) mapped.forEach((c) => classes.add(c));
      if (name === "slide" && value && value !== "true" && value !== "") {
        const key = `slide-${value}`;
        EFFECT_MAP[key]?.forEach((c) => classes.add(c));
      }
    }
    classes.forEach((c) => el.classList.add(c));
    if (!el.classList.contains("velin-animate-on-scroll") && attrs.reveal !== void 0) {
      el.classList.add("velin-animate-on-scroll");
    }
    return [...classes];
  }
  function markVisible(el) {
    el.classList.add(VISIBLE_CLASS);
    el.dataset.velinVisible = "true";
  }
  function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  var VISIBLE_CLASS, EFFECT_MAP;
  var init_effects = __esm({
    "core/motion/effects.js"() {
      VISIBLE_CLASS = "velin-in-view";
      EFFECT_MAP = {
        reveal: ["velin-animate-on-scroll"],
        fade: ["velin-animate-on-scroll", "velin-animate-on-scroll--fade"],
        slide: ["velin-animate-on-scroll", "velin-animate-on-scroll--slide-up"],
        "slide-up": ["velin-animate-on-scroll", "velin-animate-on-scroll--slide-up"],
        "slide-down": ["velin-animate-on-scroll", "velin-animate-on-scroll--slide-down"],
        "slide-left": ["velin-animate-on-scroll", "velin-animate-on-scroll--slide-left"],
        "slide-right": ["velin-animate-on-scroll", "velin-animate-on-scroll--slide-right"],
        scale: ["velin-animate-on-scroll", "velin-animate-on-scroll--scale"],
        parallax: ["velin-parallax"],
        "parallax-slow": ["velin-parallax", "velin-parallax--slow"],
        hover: ["velin-animate-hover"],
        "hover-lift": ["velin-animate-hover"],
        flip: ["velin-animate-scale-in"],
        blur: ["velin-animate-fade-in"]
      };
    }
  });

  // core/motion/stagger.js
  function applyStagger(listEl, value = "true") {
    const base = value === "true" || value === "" ? 60 : parseInt(value, 10) || 60;
    const children = [...listEl.children];
    children.forEach((child, i) => {
      child.style.setProperty("--velin-stagger-delay", `${i * base}ms`);
      child.classList.add("velin-stagger-item");
    });
    listEl.classList.add("velin-stagger");
  }
  function enhanceStagger(root = document) {
    root.querySelectorAll(`[${STAGGER_ATTR}]`).forEach((el) => {
      if (el.dataset.velinStaggerDone) return;
      el.dataset.velinStaggerDone = "1";
      applyStagger(el, el.getAttribute(STAGGER_ATTR) || "true");
    });
  }
  var STAGGER_ATTR;
  var init_stagger = __esm({
    "core/motion/stagger.js"() {
      STAGGER_ATTR = "velin-stagger";
    }
  });

  // core/motion/scroll.js
  function smoothScrollTo(target, options = {}) {
    const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    el.scrollIntoView({
      behavior: reduced || options.instant ? "auto" : "smooth",
      block: options.block || "start",
      inline: options.inline || "nearest"
    });
    if (el.tabIndex < 0 && !el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
    el.focus({ preventScroll: true });
  }
  function bindSmoothScroll(root = document) {
    root.querySelectorAll("[velin-scroll]").forEach((link) => {
      if (link.dataset.velinScrollBound) return;
      link.dataset.velinScrollBound = "1";
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(target);
      });
    });
  }
  var init_scroll = __esm({
    "core/motion/scroll.js"() {
    }
  });

  // core/motion/index.js
  function initMotion(options = {}) {
    const root = options.root || (typeof document !== "undefined" ? document : null);
    if (!root) return () => {
    };
    const selector = options.selector || [
      "[velin-reveal]",
      "[velin-fade]",
      "[velin-slide]",
      "[velin-scale]",
      "[velin-parallax]",
      "[velin-hover]",
      ".velin-animate-on-scroll"
    ].join(",");
    const elements = root.querySelectorAll(selector);
    const reduced = prefersReducedMotion();
    for (const el of elements) {
      if (el.dataset.velinMotionInit) continue;
      el.dataset.velinMotionInit = "1";
      const attrs = {};
      for (const name of MOTION_ATTRS) {
        if (el.hasAttribute(name)) attrs[name.replace("velin-", "")] = el.getAttribute(name) || "true";
      }
      applyEffects(el, attrs);
      if (reduced) {
        markVisible(el);
        continue;
      }
      const stop = observeInView(el, (node) => markVisible(node));
      teardownFns.push(stop);
    }
    enhanceStagger(root);
    bindSmoothScroll(root);
    return () => {
      teardownFns.forEach((fn) => fn());
      teardownFns = [];
      disconnectInViewObserver();
    };
  }
  function initReveal(options = {}) {
    return initMotion({
      root: typeof document !== "undefined" ? document : null,
      selector: options.selector || ".velin-animate-on-scroll"
    });
  }
  var MOTION_ATTRS, teardownFns, velinMotion;
  var init_motion = __esm({
    "core/motion/index.js"() {
      init_scheduler();
      init_effects();
      init_stagger();
      init_scroll();
      MOTION_ATTRS = ["velin-reveal", "velin-fade", "velin-slide", "velin-scale", "velin-parallax", "velin-hover"];
      teardownFns = [];
      velinMotion = { init: initMotion, observe: observeInView, markVisible, VISIBLE_CLASS };
    }
  });

  // core/attributes/registry.js
  function registerAttribute(name, handler) {
    registry.set(name, handler);
  }
  function getAttributeHandler(name) {
    return registry.get(name);
  }
  function bridgeComponent(el, tag, attrs = {}) {
    el.setAttribute("data-velin-component", tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null) el.setAttribute(k, v);
    }
    return lazyDefine(tag);
  }
  function registerBuiltins() {
    registerAttribute("velin-modal", {
      enhance(el) {
        bridgeComponent(el, "velin-modal", { open: el.getAttribute("velin-modal") || "" });
      }
    });
    registerAttribute("velin-tabs", { enhance: (el) => bridgeComponent(el, "velin-tabs") });
    registerAttribute("velin-accordion", { enhance: (el) => bridgeComponent(el, "velin-accordion") });
    registerAttribute("velin-tooltip", {
      enhance(el) {
        const tip = el.getAttribute("velin-tooltip") || el.getAttribute("title") || "";
        if (tip && el.hasAttribute("title")) el.removeAttribute("title");
        if (el.tagName === "VELIN-TOOLTIP" || el.tagName === "VELIN-TOOLTIP-WC") {
          el.setAttribute("content", tip);
          return lazyDefine("velin-tooltip");
        }
        const wc = document.createElement("velin-tooltip");
        wc.setAttribute("content", tip);
        const parent = el.parentElement;
        if (parent) {
          parent.insertBefore(wc, el);
          wc.appendChild(el);
        }
        return lazyDefine("velin-tooltip");
      }
    });
    registerAttribute("velin-copy", {
      enhance(el) {
        const text2 = el.getAttribute("velin-copy") || el.textContent?.trim() || "";
        if (!el.querySelector("velin-copy")) {
          const wc = document.createElement("velin-copy");
          wc.setAttribute("value", text2);
          if (el.tagName === "BUTTON") {
            wc.append(...el.childNodes);
            el.replaceWith(wc);
            return lazyDefine("velin-copy");
          }
          el.appendChild(wc);
        }
        return lazyDefine("velin-copy");
      }
    });
    registerAttribute("velin-counter", {
      enhance(el) {
        bridgeComponent(el, "velin-counter", {
          value: el.getAttribute("velin-counter") || "0"
        });
      }
    });
    registerAttribute("velin-notify", {
      async enhance(el) {
        await lazyDefine("velin-toast");
        el.addEventListener("click", () => {
          const msg = el.getAttribute("velin-notify") || el.textContent || "";
          document.dispatchEvent(
            new CustomEvent("velin-toast-show", { detail: { message: msg, variant: el.dataset.variant || "info" } })
          );
        });
      }
    });
    registerAttribute("velin-theme", {
      enhance(el) {
        const theme = el.getAttribute("velin-theme") || "toggle";
        if (theme === "toggle") {
          if (!el.querySelector("velin-theme-toggle")) {
            el.appendChild(document.createElement("velin-theme-toggle"));
          }
          return lazyDefine("velin-theme-toggle");
        }
        document.documentElement.setAttribute("data-velin-theme", theme);
      }
    });
    registerAttribute("velin-scroll-top", {
      enhance(el) {
        const raw = el.getAttribute("velin-scroll-top");
        const threshold = raw && raw !== "true" ? raw : "300";
        if (el.tagName === "VELIN-SCROLL-TOP") {
          if (raw && raw !== "true") el.setAttribute("threshold", threshold);
          return lazyDefine("velin-scroll-top");
        }
        let wc = document.querySelector("velin-scroll-top");
        if (!wc) {
          wc = document.createElement("velin-scroll-top");
          wc.setAttribute("threshold", threshold);
          (el === document.body || el === document.documentElement ? document.body : el).appendChild(wc);
        }
        return lazyDefine("velin-scroll-top");
      }
    });
    registerAttribute("velin-progress", {
      enhance(el) {
        const ring = el.hasAttribute("ring");
        if (ring) return bridgeComponent(el, "velin-progress-ring");
        el.classList.add("velin-progress");
        const val = parseInt(el.getAttribute("velin-progress") || "0", 10);
        el.setAttribute("role", "progressbar");
        el.setAttribute("aria-valuenow", String(val));
        el.style.setProperty("--velin-progress", `${Math.min(100, val)}%`);
      }
    });
    registerAttribute("velin-search", {
      async enhance(el) {
        if (el.tagName !== "VELIN-SEARCH") {
          const host = document.createElement("velin-search");
          host.setAttribute("index", el.getAttribute("data-search-index") || "/search-index.json");
          el.replaceWith(host);
          host.appendChild(el);
        }
        return lazyDefine("velin-search");
      }
    });
    registerAttribute("velin-lazy", {
      enhance(el) {
        if (el.tagName === "IMG") {
          el.loading = "lazy";
          el.decoding = "async";
          if (el.hasAttribute("velin-skeleton") || el.dataset.velinSkeleton) {
            el.classList.add("velin-skeleton", "velin-skeleton--image");
            el.addEventListener("load", () => el.classList.remove("velin-skeleton", "velin-skeleton--image"), { once: true });
          }
        }
      }
    });
    registerAttribute("velin-skeleton", {
      enhance(el) {
        const variant = el.getAttribute("velin-skeleton") || "text";
        el.classList.add("velin-skeleton", `velin-skeleton--${variant}`);
        const hasText = Boolean(el.textContent?.trim()) && el.children.length > 0;
        if (!hasText && !el.textContent?.trim()) {
          el.setAttribute("aria-hidden", "true");
        }
      }
    });
    registerAttribute("velin-loading", {
      enhance(el) {
        el.classList.add("velin-spinner");
        el.setAttribute("aria-busy", "true");
        el.setAttribute("role", "status");
        if (!el.getAttribute("aria-label")?.trim()) {
          el.setAttribute("aria-label", "Loading");
        }
      }
    });
    registerAttribute("velin-grid", {
      enhance(el) {
        const cols = el.getAttribute("velin-grid") || "auto";
        el.classList.add("velin-grid");
        if (cols !== "auto") el.style.setProperty("--velin-grid-cols", cols);
      }
    });
    registerAttribute("velin-anchor", {
      enhance(el) {
        if (!el.id && el.getAttribute("velin-anchor")) el.id = el.getAttribute("velin-anchor");
        el.setAttribute("tabindex", "-1");
      }
    });
    registerAttribute("velin-code", {
      async enhance(el) {
        const lang = el.getAttribute("velin-code") || el.getAttribute("language") || el.getAttribute("data-language") || "";
        el.classList.add("velin-code-block");
        if (lang && lang !== "true") {
          el.dataset.language = lang;
          if (!el.getAttribute("language")) el.setAttribute("language", lang);
        }
        if (!el.querySelector("[data-velin-copy]")) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "velin-code-block__copy velin-btn velin-btn--sm";
          btn.textContent = "Copy";
          btn.setAttribute("data-velin-copy", "");
          btn.setAttribute("velin-copy", el.querySelector("code")?.textContent || el.textContent || "");
          el.style.position = "relative";
          el.appendChild(btn);
        }
        await lazyDefine("velin-copy");
        const { initHighlight: initHighlight2, highlightElement: highlightElement2 } = await Promise.resolve().then(() => (init_highlight2(), highlight_exports));
        const immediate = el.getAttribute("data-velin-highlight") === "immediate" || typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (immediate) {
          await highlightElement2(el);
        } else {
          initHighlight2(el, { root: el });
        }
      }
    });
    registerAttribute("velin-quote", {
      enhance(el) {
        if (el.tagName === "BLOCKQUOTE" || el.tagName === "Q") {
          el.classList.add("velin-quote");
        }
      }
    });
    registerAttribute("velin-highlight", {
      enhance(el) {
        el.classList.add("velin-highlight");
      }
    });
    for (const motion of ["velin-reveal", "velin-fade", "velin-slide", "velin-scale", "velin-parallax", "velin-hover", "velin-stagger", "velin-scroll"]) {
      registerAttribute(motion, { enhance() {
      } });
    }
  }
  async function bootAttributes(root = document) {
    const selector = [...registry.keys()].map((a) => `[${a}]`).join(",");
    const elements = root.querySelectorAll(selector);
    for (const el of elements) {
      if (enhanced.has(el)) continue;
      for (const attr of registry.keys()) {
        if (!el.hasAttribute(attr)) continue;
        const handler = registry.get(attr);
        if (handler?.enhance) await handler.enhance(el);
      }
      enhanced.add(el);
    }
    initMotion({ root });
    if (typeof HTMLElement !== "undefined") {
      const { bindDeclarativeSearch: bindDeclarativeSearch2 } = await Promise.resolve().then(() => (init_velin_search(), velin_search_exports));
      bindDeclarativeSearch2(root);
      if (!document.querySelector("velin-announcer")) {
        const { getAnnouncer: getAnnouncer2 } = await Promise.resolve().then(() => (init_a11y_utils(), a11y_utils_exports));
        getAnnouncer2();
      }
    }
  }
  function listRegisteredAttributes() {
    return [...registry.keys()];
  }
  var registry, enhanced;
  var init_registry2 = __esm({
    "core/attributes/registry.js"() {
      init_runtime();
      init_motion();
      registry = /* @__PURE__ */ new Map();
      registerBuiltins();
      enhanced = /* @__PURE__ */ new WeakSet();
    }
  });

  // core/attributes/index.js
  var attributes_exports = {};
  __export(attributes_exports, {
    bootAttributes: () => bootAttributes,
    getAttributeHandler: () => getAttributeHandler,
    listRegisteredAttributes: () => listRegisteredAttributes,
    registerAttribute: () => registerAttribute
  });
  var init_attributes = __esm({
    "core/attributes/index.js"() {
      init_registry2();
    }
  });

  // components/velin-haptic.js
  var velin_haptic_exports = {};
  __export(velin_haptic_exports, {
    PATTERNS: () => PATTERNS,
    VelinHapticObserver: () => VelinHapticObserver,
    applyHaptic: () => applyHaptic,
    default: () => velin_haptic_default,
    vibrate: () => vibrate
  });
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
  var PATTERNS, VelinHapticObserver, velin_haptic_default;
  var init_velin_haptic = __esm({
    "components/velin-haptic.js"() {
      PATTERNS = {
        tap: [10],
        "double-tap": [10, 50, 10],
        success: [50],
        error: [100, 30, 100],
        warning: [30, 20, 30],
        long: [200]
      };
      VelinHapticObserver = class {
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
      velin_haptic_default = VelinHapticObserver;
    }
  });

  // components/runtime/index.js
  function whenDefined(tagName) {
    if (typeof customElements === "undefined") {
      return Promise.reject(new Error("customElements not available"));
    }
    return customElements.whenDefined(tagName);
  }
  async function lazyDefine(tagName) {
    const loader = COMPONENT_LOADERS[tagName];
    if (!loader) {
      throw new Error(`Unknown Velin component: ${tagName}`);
    }
    if (registry2.has(tagName)) return registry2.get(tagName);
    const p = loader().then((mod) => {
      const Cls = mod.default;
      if (Cls && !customElements.get(tagName)) {
        customElements.define(tagName, Cls);
      }
      return Cls;
    });
    registry2.set(tagName, p);
    return p;
  }
  async function register(tagNames) {
    return Promise.all(tagNames.map((t) => lazyDefine(t)));
  }
  function collectTagsFromDOM(root) {
    const tags = /* @__PURE__ */ new Set();
    root.querySelectorAll("[data-velin-component]").forEach((el) => {
      const name = el.getAttribute("data-velin-component");
      if (name) tags.add(name.startsWith("velin-") ? name : `velin-${name}`);
    });
    for (const el of root.querySelectorAll("*")) {
      const tag = el.tagName?.toLowerCase();
      if (tag && VELIN_TAG_RE.test(tag) && COMPONENT_LOADERS[tag]) {
        tags.add(tag);
      }
    }
    return tags;
  }
  async function bootFromDOM(root = document, options = {}) {
    const tags = options.tags?.length ? new Set(options.tags) : collectTagsFromDOM(root);
    const wcPromise = register([...tags]);
    if (options.attributes) {
      const { bootAttributes: bootAttributes2 } = await Promise.resolve().then(() => (init_attributes(), attributes_exports));
      await bootAttributes2(root);
    }
    if (options.highlight) {
      const { initHighlight: initHighlight2 } = await Promise.resolve().then(() => (init_highlight2(), highlight_exports));
      initHighlight2(root);
    }
    if (options.haptic) {
      const { VelinHapticObserver: VelinHapticObserver2 } = await Promise.resolve().then(() => (init_velin_haptic(), velin_haptic_exports));
      new VelinHapticObserver2().start(root instanceof Document ? root.body : root);
    }
    return wcPromise;
  }
  var registry2, VELIN_TAG_RE;
  var init_runtime = __esm({
    "components/runtime/index.js"() {
      init_component_loaders();
      registry2 = /* @__PURE__ */ new Map();
      VELIN_TAG_RE = /^velin-[a-z0-9-]+$/;
    }
  });

  // components/index.js
  init_velin_modal();
  init_velin_dropdown();
  init_velin_accordion();
  init_velin_tabs();
  init_velin_toast();
  init_velin_icon();
  init_velin_drawer();
  init_velin_theme_toggle();
  init_velin_popover();
  init_velin_copy();
  init_velin_scroll_top();
  init_velin_carousel();
  init_velin_collapse();
  init_velin_scrollspy();
  init_velin_tooltip();
  init_velin_lightbox();
  init_velin_stepper();
  init_velin_dialog();
  init_velin_countdown();
  init_velin_progress_ring();
  init_velin_persist();
  init_velin_combobox();
  init_velin_bottom_nav();
  init_velin_sheet();
  init_velin_segmented_control();
  init_velin_rating();
  init_velin_menubar();
  init_velin_command();
  init_velin_announcer();
  init_velin_email();
  init_runtime();
  init_velin_sparkline();
  init_velin_counter();
  init_velin_live_dot();
  init_velin_code_block();
  init_velin_data_table();
  init_velin_form_summary();
  init_velin_calendar();
  init_velin_file_dropzone();
  init_velin_search();
  init_velin_search();

  // components/velin-reveal.js
  init_motion();
  var initReveal2 = initReveal;
  if (typeof document !== "undefined") {
    const autoInit2 = () => {
      if (document.documentElement?.hasAttribute("data-velin-reveal-auto")) {
        initMotion();
      }
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoInit2, { once: true });
    } else {
      autoInit2();
    }
  }

  // components/a11y-entry.js
  init_a11y_utils();
  init_a11y_utils();
  function initA11y(options = {}) {
    if (typeof document === "undefined") return;
    const {
      announcer = true,
      scrollPadding = true,
      skipLink = false
    } = options;
    if (announcer) getAnnouncer();
    if (scrollPadding) {
      const nav = document.querySelector(".velin-nav, .velin-doc-header, .site-nav, [data-velin-fixed-nav]");
      if (nav) {
        const h = nav.getBoundingClientRect().height;
        document.documentElement.style.setProperty("--velin-nav-height", `${Math.ceil(h)}px`);
        document.documentElement.classList.add("velin-scroll-pt-nav");
      }
    }
    if (skipLink && !document.querySelector(".velin-skip-link") && document.getElementById("main")) {
      const a = document.createElement("a");
      a.href = "#main";
      a.className = "velin-skip-link";
      a.textContent = "Skip to main content";
      document.body.prepend(a);
    }
  }

  // components/index.js
  init_search();
  init_attributes();
  init_highlight2();

  // components/velin-flip.js
  var REDUCED_MOTION_MQ = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var DEFAULTS = {
    duration: 250,
    easing: "var(--velin-ease-expo-out, cubic-bezier(0.16, 1, 0.3, 1))",
    itemSelector: ":scope > *"
  };
  function getItems(container, selector) {
    return Array.from(container.querySelectorAll(selector));
  }
  function flipReorder(container, mutateFn, options = {}) {
    if (!container || typeof mutateFn !== "function") return;
    const opts = { ...DEFAULTS, ...options };
    const reduced = REDUCED_MOTION_MQ && REDUCED_MOTION_MQ.matches;
    const items = getItems(container, opts.itemSelector);
    const before = /* @__PURE__ */ new Map();
    items.forEach((el) => {
      if (!el.hidden) before.set(el, el.getBoundingClientRect());
    });
    mutateFn();
    if (reduced) return;
    const items2 = getItems(container, opts.itemSelector);
    items2.forEach((el) => {
      if (el.hidden) return;
      const prev = before.get(el);
      const next = el.getBoundingClientRect();
      if (!prev) {
        if (typeof el.animate !== "function") return;
        el.animate(
          [
            { opacity: 0, transform: "scale(0.96)" },
            { opacity: 1, transform: "scale(1)" }
          ],
          { duration: opts.duration, easing: opts.easing, fill: "both" }
        );
        return;
      }
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (dx === 0 && dy === 0) return;
      if (typeof el.animate !== "function") return;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" }
        ],
        { duration: opts.duration, easing: opts.easing, fill: "both" }
      );
    });
  }
  function filterList(container, predicate, options = {}) {
    if (!container || typeof predicate !== "function") return;
    const opts = { ...DEFAULTS, ...options };
    flipReorder(
      container,
      () => {
        getItems(container, opts.itemSelector).forEach((el) => {
          el.hidden = !predicate(el);
        });
      },
      opts
    );
  }
  function readTokens(value) {
    if (!value) return [];
    return String(value).toLowerCase().split(/[\s,|]+/).map((s) => s.trim()).filter(Boolean);
  }
  function matchTokens(itemTokens, queryTokens, mode) {
    if (!queryTokens.length) return true;
    if (mode === "all") return queryTokens.every((q) => itemTokens.includes(q));
    return queryTokens.some((q) => itemTokens.includes(q));
  }
  function matchSearch(item, query) {
    if (!query) return true;
    const haystack = (item.getAttribute("data-tags") || "") + " " + (item.getAttribute("data-search") || "") + " " + (item.textContent || "");
    return haystack.toLowerCase().includes(query.toLowerCase());
  }
  var FilterController = class {
    constructor(container) {
      this.container = container;
      this.tag = "";
      this.search = "";
      this.matchMode = container.getAttribute("data-velin-filter-mode") === "all" ? "all" : "any";
      this.itemSelector = container.getAttribute("data-velin-filter-item") || ":scope > *";
    }
    apply() {
      const queryTokens = readTokens(this.tag);
      const term = this.search;
      filterList(
        this.container,
        (el) => {
          const tokens = readTokens(el.getAttribute("data-tags"));
          return matchTokens(tokens, queryTokens, this.matchMode) && matchSearch(el, term);
        },
        { itemSelector: this.itemSelector }
      );
    }
  };
  var _controllers = /* @__PURE__ */ new WeakMap();
  function getController(container) {
    let ctrl = _controllers.get(container);
    if (!ctrl) {
      ctrl = new FilterController(container);
      _controllers.set(container, ctrl);
    }
    return ctrl;
  }
  function resolveTarget(triggerEl) {
    const sel = triggerEl.getAttribute("data-velin-filter-target");
    if (!sel) return null;
    try {
      return document.querySelector(sel);
    } catch {
      return null;
    }
  }
  function highlightActive(group, active) {
    if (!group) return;
    group.querySelectorAll("[data-velin-filter-value]").forEach((btn) => {
      if (btn === active) btn.setAttribute("data-velin-filter-active", "");
      else btn.removeAttribute("data-velin-filter-active");
    });
  }
  function autoInit() {
    if (typeof document === "undefined") return;
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-velin-filter-value]");
      if (!target) return;
      const container = resolveTarget(target);
      if (!container) return;
      const group = target.closest("[data-velin-filter-group]") || target.parentElement;
      highlightActive(group, target);
      const ctrl = getController(container);
      ctrl.tag = target.getAttribute("data-velin-filter-value") || "";
      if (ctrl.tag.toLowerCase() === "all" || ctrl.tag === "*") ctrl.tag = "";
      ctrl.apply();
    });
    const handleInput = (event) => {
      const input = event.target.closest("[data-velin-filter-input]");
      if (!input) return;
      const container = resolveTarget(input);
      if (!container) return;
      const ctrl = getController(container);
      const raw = input.value || (typeof input.getAttribute === "function" ? input.getAttribute("value") : "");
      ctrl.search = (raw || "").trim();
      ctrl.apply();
    };
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleInput);
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoInit, { once: true });
    } else {
      autoInit();
    }
  }

  // components/index.js
  init_sanitize();
  init_velin_haptic();
  init_focus_manager();
  init_velin_sparkline();
  init_velin_counter();
  init_velin_live_dot();
  init_velin_email();
})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.12 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.12/LICENSE *)
*/
