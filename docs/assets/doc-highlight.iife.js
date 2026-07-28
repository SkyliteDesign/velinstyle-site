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

  // ../velinstyle/core/highlight/languages/_utils.js
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
    "../velinstyle/core/highlight/languages/_utils.js"() {
    }
  });

  // ../velinstyle/core/highlight/languages/js.js
  var js_exports = {};
  __export(js_exports, {
    default: () => lexJs
  });
  function lexJs(code) {
    return tokenizeWithKeywords(code, KEYWORDS, BASE);
  }
  var KEYWORDS, BASE;
  var init_js = __esm({
    "../velinstyle/core/highlight/languages/js.js"() {
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

  // ../velinstyle/core/highlight/languages/typescript.js
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
    "../velinstyle/core/highlight/languages/typescript.js"() {
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

  // ../velinstyle/core/highlight/languages/html.js
  var html_exports = {};
  __export(html_exports, {
    default: () => lexHtml
  });
  function lexHtml(code) {
    return tokenize(code, RULES);
  }
  var RULES;
  var init_html = __esm({
    "../velinstyle/core/highlight/languages/html.js"() {
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

  // ../velinstyle/core/highlight/languages/css.js
  var css_exports = {};
  __export(css_exports, {
    default: () => lexCss
  });
  function lexCss(code) {
    return tokenizeWithKeywords(code, KEYWORDS2, RULES2);
  }
  var KEYWORDS2, RULES2;
  var init_css = __esm({
    "../velinstyle/core/highlight/languages/css.js"() {
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

  // ../velinstyle/core/highlight/languages/json.js
  var json_exports = {};
  __export(json_exports, {
    default: () => lexJson
  });
  function lexJson(code) {
    return tokenize(code, RULES3);
  }
  var RULES3;
  var init_json = __esm({
    "../velinstyle/core/highlight/languages/json.js"() {
      init_utils();
      RULES3 = [
        { type: "string", re: /"(?:\\.|[^"\\])*"/y },
        { type: "number", re: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/y },
        { type: "keyword", re: /\b(true|false|null)\b/y },
        { type: "punctuation", re: /[{}[\]:,]/y }
      ];
    }
  });

  // ../velinstyle/core/highlight/languages/markdown.js
  var markdown_exports = {};
  __export(markdown_exports, {
    default: () => lexMarkdown
  });
  function lexMarkdown(code) {
    return tokenize(code, RULES4);
  }
  var RULES4;
  var init_markdown = __esm({
    "../velinstyle/core/highlight/languages/markdown.js"() {
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

  // ../velinstyle/core/highlight/languages/shell.js
  var shell_exports = {};
  __export(shell_exports, {
    default: () => lexShell
  });
  function lexShell(code) {
    return tokenizeWithKeywords(code, KEYWORDS3, RULES5);
  }
  var KEYWORDS3, RULES5;
  var init_shell = __esm({
    "../velinstyle/core/highlight/languages/shell.js"() {
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

  // ../velinstyle/core/highlight/languages/sql.js
  var sql_exports = {};
  __export(sql_exports, {
    default: () => lexSql
  });
  function lexSql(code) {
    return tokenize(code, RULES6);
  }
  var RULES6;
  var init_sql = __esm({
    "../velinstyle/core/highlight/languages/sql.js"() {
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

  // ../velinstyle/core/highlight/languages/plain.js
  var plain_exports = {};
  __export(plain_exports, {
    default: () => lexPlain
  });
  function lexPlain(code) {
    if (!code) return [];
    return [{ type: "plain", value: code }];
  }
  var init_plain = __esm({
    "../velinstyle/core/highlight/languages/plain.js"() {
    }
  });

  // ../velinstyle/core/highlight/languages/php.js
  var php_exports = {};
  __export(php_exports, {
    default: () => lexPhp
  });
  function lexPhp(code) {
    return tokenizeWithKeywords(code, KEYWORDS4, RULES7);
  }
  var KEYWORDS4, RULES7;
  var init_php = __esm({
    "../velinstyle/core/highlight/languages/php.js"() {
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

  // ../velinstyle/core/highlight/languages/blade.js
  var blade_exports = {};
  __export(blade_exports, {
    default: () => lexBlade
  });
  function lexBlade(code) {
    return tokenize(code, RULES8);
  }
  var RULES8;
  var init_blade = __esm({
    "../velinstyle/core/highlight/languages/blade.js"() {
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

  // ../velinstyle/core/highlight/languages/python.js
  var python_exports = {};
  __export(python_exports, {
    default: () => lexPython
  });
  function lexPython(code) {
    return tokenize(code, RULES9);
  }
  var RULES9;
  var init_python = __esm({
    "../velinstyle/core/highlight/languages/python.js"() {
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

  // ../velinstyle/core/highlight/languages/yaml.js
  var yaml_exports = {};
  __export(yaml_exports, {
    default: () => lexYaml
  });
  function lexYaml(code) {
    return tokenize(code, RULES10);
  }
  var RULES10;
  var init_yaml = __esm({
    "../velinstyle/core/highlight/languages/yaml.js"() {
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

  // ../velinstyle/core/highlight/languages/go.js
  var go_exports = {};
  __export(go_exports, {
    default: () => lexGo
  });
  function lexGo(code) {
    return tokenize(code, RULES11);
  }
  var RULES11;
  var init_go = __esm({
    "../velinstyle/core/highlight/languages/go.js"() {
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

  // ../velinstyle/core/highlight/languages/rust.js
  var rust_exports = {};
  __export(rust_exports, {
    default: () => lexRust
  });
  function lexRust(code) {
    return tokenize(code, RULES12);
  }
  var RULES12;
  var init_rust = __esm({
    "../velinstyle/core/highlight/languages/rust.js"() {
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

  // ../velinstyle/core/highlight/registry.js
  init_js();
  var languages = /* @__PURE__ */ new Map();
  var loading = /* @__PURE__ */ new Map();
  var LAZY_LOADERS = {
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
  registerLanguage("js", lexJs);

  // ../velinstyle/core/highlight/render.js
  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
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

  // ../velinstyle/core/highlight/highlight.js
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
    const html = target.innerHTML;
    if (html && /&lt;|&gt;|&amp;/.test(html)) {
      const ta = document.createElement("textarea");
      ta.innerHTML = html.replace(/<br\s*\/?>/gi, "\n");
      if (ta.value) return ta.value;
    }
    return target.textContent || "";
  }
  async function highlightElement(el, options = {}) {
    if (el.dataset.velinHighlighted === "1") return;
    const pre = el.tagName === "PRE" ? el : el.closest("pre") || el;
    const codeEl = el.tagName === "CODE" ? el : pre.querySelector("code") || document.createElement("code");
    if (!pre.querySelector("code") && codeEl !== el) {
      const text = getSourceText(pre);
      codeEl.textContent = text;
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

  // ../velinstyle/core/motion/scheduler.js
  var pending = /* @__PURE__ */ new Set();
  var rafId = 0;
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
  var sharedObserver = null;
  var observed = /* @__PURE__ */ new WeakMap();
  function getInViewObserver(options = {}) {
    if (typeof IntersectionObserver === "undefined") return null;
    if (!sharedObserver) {
      sharedObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
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

  // ../velinstyle/core/highlight/observe.js
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

  // docs/doc-highlight-entry.mjs
  var SELECTOR = [
    ".velin-doc-example__code pre",
    '.velin-doc-main pre:has(code[class*="language-"])',
    "pre[velin-code]",
    "pre[language]",
    "pre[data-language]",
    "velin-code-block pre",
    ".velin-doc-md-dialog__body pre"
  ].join(",");
  function boot() {
    const teardown = initHighlight(document, {
      selector: SELECTOR,
      immediate: true
    });
    window.VelinDocHighlight = {
      highlightElement,
      highlightAll,
      initHighlight,
      teardown
    };
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
