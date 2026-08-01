#!/usr/bin/env python3
"""Create guides/ai-skills.html (+ DE leitfaden) with full doc chrome."""
from __future__ import annotations

import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
FW = SITE.parent / "velinstyle"
TEMPLATE_EN = SITE / "docs" / "guides" / "velin-meta.html"
TEMPLATE_DE = SITE / "docs" / "guides" / "velin-meta-leitfaden.html"
OUT_EN = SITE / "docs" / "guides" / "ai-skills.html"
OUT_DE = SITE / "docs" / "guides" / "ai-skills-leitfaden.html"


def framework_version() -> str:
    try:
        return str(json.loads((FW / "package.json").read_text(encoding="utf-8")).get("version") or "0.0.0")
    except Exception:
        return "0.0.0"


VERSION = framework_version()

MAIN_EN = f"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>AI Skills</li></ol>
      <h1>AI Skills <span class="velin-badge velin-badge--primary">{VERSION}</span> <span class="velin-badge">beta</span></h1>
      <p class="lead">Registry-first AI Runtime for VelinStyle. Discover, install, and orchestrate official skills, packs, workflow graphs, bundles, and project templates. <a href="ai-skills-leitfaden.html" hreflang="de">Deutsch: AI Skills Leitfaden</a> · <a href="velin-meta.html">Velin-Meta</a></p>

      <div class="velin-alert velin-alert--info" role="status" data-doc-modernize="{VERSION}" style="margin-block-end:1rem">
        <div class="velin-alert__content">
          <strong>Maturity:</strong> AI Skills are <strong>beta / foundation</strong> in VelinStyle <strong>{VERSION}</strong> — registry, CLI, and docs are usable now; skill coverage and hooks still expanding. Pair with <a href="velin-meta.html">Velin-Meta</a> for component and convention context.
        </div>
      </div>

      <h2 id="architecture">Architecture</h2>
      <ul>
        <li>AI Runtime → Skill Engine → VelinStyle Adapter</li>
        <li>Source of truth: <code>packages/velinstyle-skills/registry.json</code></li>
        <li>Human prose: <code>packages/velinstyle-skills/skills/**/SKILL.md</code></li>
        <li>Runtime: <code>packages/skill-engine</code> · Adapter: <code>packages/velinstyle-skills/adapter.json</code></li>
      </ul>

      <h2 id="capabilities">Capabilities and lifecycle</h2>
      <p>Each skill is queryable by capability, status, priority, confidence, compatibility, and origin.</p>
      <ul>
        <li>Capabilities: build, review, documentation, accessibility, seo, motion, security, performance, release, ai-orchestration</li>
        <li>Status: draft / experimental / beta / stable / deprecated / legacy</li>
        <li>Priority: core / recommended / advanced / experimental</li>
        <li>Confidence: high / medium / low</li>
      </ul>

      <h2 id="cli">CLI</h2>
      <pre><code class="language-bash">velinstyle skills list --capability review
velinstyle skills show velin-ai-plan-scaffold-review
velinstyle skills install frontend
velinstyle skills run velin-ai-plan-scaffold-review
velinstyle skills validate
velinstyle workflow landingpage --json</code></pre>
      <p>See also <a href="../extend/cli.html">CLI reference</a> and <a href="../generated/cli/commands.md">generated commands</a>.</p>

      <h2 id="graphs">Workflow graphs, packs, and templates</h2>
      <ul>
        <li>Graphs: landingpage, component-ship, release-gate</li>
        <li>Packs: frontend, design, accessibility, documentation, review, enterprise</li>
        <li>Bundles: landing-starter, review-suite</li>
        <li>Project templates: marketing website, documentation portal, admin panel, blog, ecommerce, portfolio, landing page, laravel dashboard</li>
      </ul>

      <h2 id="quality">Quality rules</h2>
      <ul>
        <li>Never contradict <code>DESIGN_RULES.md</code>.</li>
        <li>Prefer stable / high-confidence skills for automatic runs.</li>
        <li>Respect <code>onlyIf</code> predicates and dependency order from the registry.</li>
        <li>Use <code>velinstyle skills validate</code> before publishing registry changes.</li>
      </ul>

      <h2 id="related">Related</h2>
      <ul>
        <li><a href="velin-meta.html">Velin-Meta</a> — <code>velin-agent.json</code> and <code>llms.txt</code></li>
        <li><a href="prompt-scaffolding.html">Prompt scaffolding</a></li>
        <li><a href="../generated/meta/README.md">Generated meta README</a></li>
      </ul>

      <nav class="velin-doc-prevnext" aria-label="Page navigation">
        <a href="velin-meta.html" class="prev"><span class="velin-doc-prevnext__label">Previous</span><span class="velin-doc-prevnext__title">Velin-Meta</span></a>
        <a href="laravel.html" class="next"><span class="velin-doc-prevnext__label">Next</span><span class="velin-doc-prevnext__title">Laravel</span></a>
      </nav>
"""

MAIN_DE = f"""
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/einfuehrung.html">Docs</a></li><li><a href="../guides/uebersicht.html">Guides</a></li><li>AI Skills Leitfaden</li></ol>
      <h1>AI Skills Leitfaden <span class="velin-badge velin-badge--primary">{VERSION}</span> <span class="velin-badge">beta</span></h1>
      <p class="lead">Registry-first AI Runtime für VelinStyle. Offizielle Skills, Packs, Workflow-Graphs, Bundles und Projekt-Templates für Agenten orchestrieren. <a href="ai-skills.html" hreflang="en">English: AI Skills</a> · <a href="velin-meta-leitfaden.html">Velin-Meta Leitfaden</a></p>

      <div class="velin-alert velin-alert--info" role="status" data-doc-modernize="{VERSION}" style="margin-block-end:1rem">
        <div class="velin-alert__content">
          <strong>Reifegrad:</strong> AI Skills sind in VelinStyle <strong>{VERSION}</strong> <strong>beta / foundation</strong> — Registry, CLI und Docs sind nutzbar; Skill-Abdeckung und Hooks wachsen noch. Kombiniere mit <a href="velin-meta-leitfaden.html">Velin-Meta</a> für Komponenten- und Konventionskontext.
        </div>
      </div>

      <h2 id="architecture">Architektur</h2>
      <ul>
        <li>AI Runtime → Skill Engine → VelinStyle Adapter</li>
        <li>Wahrheit: <code>packages/velinstyle-skills/registry.json</code></li>
        <li>Beschreibung: <code>packages/velinstyle-skills/skills/**/SKILL.md</code></li>
        <li>Runtime: <code>packages/skill-engine</code> · Adapter: <code>packages/velinstyle-skills/adapter.json</code></li>
      </ul>

      <h2 id="capabilities">Capabilities und Lifecycle</h2>
      <p>Jeder Skill ist per Capability, Status, Priority, Confidence, Compatibility und Origin filterbar.</p>
      <ul>
        <li>Capabilities: build, review, documentation, accessibility, seo, motion, security, performance, release, ai-orchestration</li>
        <li>Status: draft / experimental / beta / stable / deprecated / legacy</li>
        <li>Priority: core / recommended / advanced / experimental</li>
        <li>Confidence: high / medium / low</li>
      </ul>

      <h2 id="cli">CLI</h2>
      <pre><code class="language-bash">velinstyle skills list --capability review
velinstyle skills show velin-ai-plan-scaffold-review
velinstyle skills install frontend
velinstyle skills run velin-ai-plan-scaffold-review
velinstyle skills validate
velinstyle workflow landingpage --json</code></pre>
      <p>Siehe auch <a href="../extend/cli.html">CLI-Referenz</a> und <a href="../generated/cli/commands.md">generierte Befehle</a>.</p>

      <h2 id="graphs">Workflow-Graphs, Packs und Templates</h2>
      <ul>
        <li>Graphs: landingpage, component-ship, release-gate</li>
        <li>Packs: frontend, design, accessibility, documentation, review, enterprise</li>
        <li>Bundles: landing-starter, review-suite</li>
        <li>Projekt-Templates: Marketing, Docs-Portal, Admin, Blog, E-Commerce, Portfolio, Landing Page, Laravel Dashboard</li>
      </ul>

      <h2 id="quality">Qualitätsregeln</h2>
      <ul>
        <li>Nie <code>DESIGN_RULES.md</code> widersprechen.</li>
        <li>Für automatische Runs stable / high-confidence Skills bevorzugen.</li>
        <li><code>onlyIf</code>-Bedingungen und Dependency-Order aus der Registry einhalten.</li>
        <li>Vor Registry-Änderungen <code>velinstyle skills validate</code> ausführen.</li>
      </ul>

      <h2 id="related">Verwandt</h2>
      <ul>
        <li><a href="velin-meta-leitfaden.html">Velin-Meta Leitfaden</a> — <code>velin-agent.json</code> und <code>llms.txt</code></li>
        <li><a href="prompt-scaffolding.html">Prompt scaffolding</a></li>
        <li><a href="../generated/meta/README.md">Generiertes Meta README</a></li>
      </ul>

      <nav class="velin-doc-prevnext" aria-label="Seitennavigation">
        <a href="velin-meta-leitfaden.html" class="prev"><span class="velin-doc-prevnext__label">Zurück</span><span class="velin-doc-prevnext__title">Velin-Meta Leitfaden</span></a>
        <a href="laravel.html" class="next"><span class="velin-doc-prevnext__label">Weiter</span><span class="velin-doc-prevnext__title">Laravel</span></a>
      </nav>
"""

TOC_EN = """
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#capabilities">Capabilities</a></li>
        <li><a href="#cli">CLI</a></li>
        <li><a href="#graphs">Graphs &amp; packs</a></li>
        <li><a href="#quality">Quality rules</a></li>
        <li><a href="#related">Related</a></li>
"""

TOC_DE = """
        <li><a href="#architecture">Architektur</a></li>
        <li><a href="#capabilities">Capabilities</a></li>
        <li><a href="#cli">CLI</a></li>
        <li><a href="#graphs">Graphs &amp; Packs</a></li>
        <li><a href="#quality">Qualitätsregeln</a></li>
        <li><a href="#related">Verwandt</a></li>
"""

PAGE_META_EN = f"""  <script type="application/vnd.velinstyle.meta+json" id="velin-meta">
{{
  "version": "{VERSION}",
  "mime": "application/vnd.velinstyle.meta+json",
  "page": {{ "intent": "guide", "source": "docs/guides/ai-skills.html" }},
  "allowed": {{ "classesPrefix": ["velin-"] }}
}}
  </script>
"""

PAGE_META_DE = f"""  <script type="application/vnd.velinstyle.meta+json" id="velin-meta">
{{
  "version": "{VERSION}",
  "mime": "application/vnd.velinstyle.meta+json",
  "page": {{ "intent": "guide", "source": "docs/guides/ai-skills-leitfaden.html" }},
  "allowed": {{ "classesPrefix": ["velin-"] }}
}}
  </script>
"""


def build_page(template: Path, out: Path, main: str, toc: str, page_meta: str, title: str, description: str, canonical: str, hreflang: str, lang: str) -> None:
    text = template.read_text(encoding="utf-8")
    text = re.sub(r"<title>[^<]+</title>", f"<title>{title}</title>", text, count=1)
    text = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{description}"',
        text,
        count=1,
    )
    text = re.sub(
        r'<link rel="canonical" href="[^"]*"',
        f'<link rel="canonical" href="{canonical}"',
        text,
        count=1,
    )
    if f'hreflang="{lang}"' not in text and 'hreflang=' in text:
        text = re.sub(
            r'<link rel="alternate" hreflang="[^"]*" href="[^"]*"',
            f'<link rel="alternate" hreflang="{lang}" href="{hreflang}"',
            text,
            count=1,
        )
    text = re.sub(
        r'<script type="application/vnd\.velinstyle\.meta\+json" id="velin-meta">[\s\S]*?</script>',
        page_meta.strip(),
        text,
        count=1,
    )
    text = re.sub(
        r"<main class=\"velin-doc-main\" id=\"main-content\">.*?</nav>\s*</main>",
        f"<main class=\"velin-doc-main\" id=\"main-content\">{main}\n</main>",
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r"<ul class=\"velin-doc-toc__list\">.*?</ul>",
        f'<ul class="velin-doc-toc__list">{toc}\n      </ul>',
        text,
        count=1,
        flags=re.S,
    )
  # Remove velin-meta live preview script block if present
    text = re.sub(
        r"<script>\s*\(function \(\) \{[\s\S]*?velinMetaPreview[\s\S]*?\}\)\(\);\s*</script>\s*",
        "",
        text,
        count=1,
    )
    out.write_text(text, encoding="utf-8")


def patch_velin_meta_next() -> None:
    patches = [
        (SITE / "docs" / "guides" / "velin-meta.html", 'href="laravel.html" class="next"', 'href="ai-skills.html" class="next"'),
        (SITE / "docs" / "guides" / "velin-meta.html", 'velin-doc-prevnext__title">Laravel</span>', 'velin-doc-prevnext__title">AI Skills</span>'),
        (SITE / "docs" / "guides" / "velin-meta-leitfaden.html", 'href="laravel.html" class="next"', 'href="ai-skills-leitfaden.html" class="next"'),
        (SITE / "docs" / "guides" / "velin-meta-leitfaden.html", 'velin-doc-prevnext__title">Laravel</span>', 'velin-doc-prevnext__title">AI Skills Leitfaden</span>'),
    ]
    for path, old, new in patches:
        if path.is_file():
            text = path.read_text(encoding="utf-8")
            if old in text:
                path.write_text(text.replace(old, new, 1), encoding="utf-8")


def main() -> None:
    build_page(
        TEMPLATE_EN,
        OUT_EN,
        MAIN_EN,
        TOC_EN,
        PAGE_META_EN,
        "AI Skills · VelinStyle",
        "VelinStyle AI Skills: registry-first skill engine, workflow graphs, packs, bundles, templates, and CLI orchestration.",
        "https://velinstyle.info/docs/guides/ai-skills.html",
        "./ai-skills-leitfaden.html",
        "de",
    )
    build_page(
        TEMPLATE_DE,
        OUT_DE,
        MAIN_DE,
        TOC_DE,
        PAGE_META_DE,
        "AI Skills Leitfaden · VelinStyle",
        "VelinStyle AI Skills Leitfaden: Registry-first Skill Engine, Workflow Graphs, Packs, Bundles und Projektvorlagen.",
        "https://velinstyle.info/docs/guides/ai-skills-leitfaden.html",
        "./ai-skills.html",
        "en",
    )
    patch_velin_meta_next()

    import importlib.util

    spec = importlib.util.spec_from_file_location("sync", SITE / "tools" / "sync-sidebar.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.patch_file(OUT_EN)
    mod.patch_file(OUT_DE)
    mod.patch_file(SITE / "docs" / "guides" / "velin-meta.html")
    mod.patch_file(SITE / "docs" / "guides" / "velin-meta-leitfaden.html")
    print(f"Wrote {OUT_EN}")
    print(f"Wrote {OUT_DE}")


if __name__ == "__main__":
    main()
