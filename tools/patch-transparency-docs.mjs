import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../docs/guides');

const enMain = `
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/introduction.html">Docs</a></li><li><a href="../guides/index.html">Guides</a></li><li>Transparency</li></ol>
      <h1>Velin Transparency Framework <span class="velin-badge velin-badge--primary">1.2.1</span> <span class="velin-badge">beta</span></h1>
      <p class="lead">Labeling <strong>and</strong> provenance for web content — AI is one pillar, not the product. <a href="transparency-leitfaden.html" hreflang="de">Deutsch: Transparenz-Leitfaden</a></p>
      <div class="velin-alert velin-alert--info" role="status" style="margin-block-end:1rem">
        <div class="velin-alert__content">
          <strong>Maturity:</strong> <strong>beta / foundation</strong> in VelinStyle <strong>1.2.1</strong>. Subsystem (Engine, Registry, Policy, Provider, Validator, Doctor, Reporter, Renderer) — not a badge component.
        </div>
      </div>
      <h2 id="when-to-use">When to use</h2>
      <ul>
        <li>Machine-readable disclosure plus visible marks for AI, trust, compliance, or content metadata.</li>
        <li>CLI audits (<code>transparency doctor</code>) and migration for existing sites.</li>
      </ul>
      <h2 id="when-not">When not</h2>
      <ul>
        <li>Do not treat the overlay as the source of truth — Registry / export hold provenance.</li>
        <li>Do not invent claim strings; use the namespaced taxonomy.</li>
      </ul>
      <h2 id="vision">Vision</h2>
      <p>Transparency and <strong>provability</strong> are first-class. Labels answer what the user sees. Provenance answers who, when, approval, source, license, and public version.</p>
      <h2 id="architecture">Architecture</h2>
      <p>Engine → Providers → Registry → Validator / Doctor → Reporter / Export → Renderer.</p>
      <p>Import: <code>@birdapi/velinstyle/transparency</code></p>
      <h2 id="html">HTML quickstart</h2>
<pre><code>&lt;img
  src="/hero.png" alt="Hero"
  velin-transparency
  velin-transparency-id="hero-image"
  velin-type="ai"
  velin-status="generated"
  velin-review="human-reviewed"
  velin-created-at="2026-08-01"
  velin-approved-by="Sebastian"
  velin-license="CC BY 4.0"
  velin-source="/logs/hero.json"
  velin-version="1.2.1"
  velin-overlay="badge"
  velin-position="top-right"&gt;
</code></pre>
      <h2 id="api">JS API</h2>
<pre><code>import { VelinTransparency, createTransparencyEngine } from '@birdapi/velinstyle/transparency';
VelinTransparency.attach(el, { type: 'ai', status: 'assisted', review: 'human-reviewed' });
const engine = createTransparencyEngine({ policy: {} });
await engine.doctor(html, { file: 'index.html' });
</code></pre>
      <h2 id="policy">Policy</h2>
      <p>Strict media rules via <code>examples/transparency.policy.json</code> and <code>--policy</code>. Soft defaults keep <code>velinstyle check</code> non-breaking.</p>
      <h2 id="claims">Claims</h2>
      <p><code>ai.generated</code>, <code>ai.assisted</code>, <code>review.human</code>, <code>review.verified</code>, <code>security.checked</code>, <code>accessibility.checked</code>, <code>license.*</code>, <code>privacy.gdpr</code>, <code>content.*</code>, <code>version.current</code>, <code>custom.*</code>.</p>
      <h2 id="cli">CLI</h2>
<pre><code>velinstyle transparency doctor [path] --policy examples/transparency.policy.json
velinstyle transparency validate [path]
velinstyle transparency report [path] --out transparency-report
velinstyle transparency export [path] --format json-ld -o out.json
velinstyle transparency migrate [path]
velinstyle transparency migrate [path] --apply
</code></pre>
      <p><code>velinstyle review</code> / <code>check</code> include Transparency pillar scores.</p>
      <h2 id="providers">Providers &amp; priority</h2>
      <p>Default: <code>api</code> → <code>json</code> → <code>meta</code> → <code>html</code>. Custom: <code>registerTransparencyProvider</code>.</p>
      <h2 id="renderer">Renderer</h2>
      <p>badge, overlay, ribbon, inline, footer, panel, tooltip, icon (+ aliases).</p>
      <h2 id="a11y">Accessibility</h2>
      <p>Marks use <code>role="note"</code> and a screen-reader summary of label, claims, and provenance.</p>
      <h2 id="roadmap">Roadmap</h2>
      <p>Editor, LLM suggest hook, signed attestation, full CMS providers, analytics.</p>
`;

const deMain = `
      <ol class="velin-doc-breadcrumb"><li><a href="../getting-started/einfuehrung.html">Docs</a></li><li><a href="../guides/uebersicht.html">Guides</a></li><li>Transparenz</li></ol>
      <h1>Velin Transparency Framework <span class="velin-badge velin-badge--primary">1.2.1</span> <span class="velin-badge">beta</span></h1>
      <p class="lead">Kennzeichnung <strong>und</strong> Nachweisbarkeit — KI ist eine Säule, nicht das Produkt. <a href="transparency.html" hreflang="en">English guide</a></p>
      <div class="velin-alert velin-alert--info" role="status" style="margin-block-end:1rem">
        <div class="velin-alert__content">
          <strong>Reifegrad:</strong> <strong>beta / foundation</strong> in VelinStyle <strong>1.2.1</strong>. Subsystem — keine reine Badge-Komponente.
        </div>
      </div>
      <h2 id="when-to-use">Wann nutzen</h2>
      <ul>
        <li>Maschinenlesbare Disclosure plus sichtbare Markierung.</li>
        <li>CLI-Audits und Migration für bestehende Sites.</li>
      </ul>
      <h2 id="when-not">Wann nicht</h2>
      <ul>
        <li>Overlay ist nicht die Wahrheit — Registry/Export halten den Nachweis.</li>
        <li>Claim-Taxonomie nutzen, keine freien Strings.</li>
      </ul>
      <h2 id="vision">Vision</h2>
      <p>Transparenz und <strong>Nachweisbarkeit</strong>: Wer, Wann, Freigabe, Quelle, Lizenz, Version.</p>
      <h2 id="architecture">Architektur</h2>
      <p>Engine → Providers → Registry → Validator/Doctor → Reporter/Export → Renderer. Import: <code>@birdapi/velinstyle/transparency</code></p>
      <h2 id="html">HTML-Schnellstart</h2>
<pre><code>&lt;img velin-transparency velin-type="ai" velin-status="generated" velin-review="human-reviewed"
  velin-created-at="2026-08-01" velin-approved-by="Sebastian" velin-license="CC BY 4.0"&gt;
</code></pre>
      <h2 id="cli">CLI</h2>
<pre><code>velinstyle transparency doctor .
velinstyle transparency report . --out transparency-report
velinstyle transparency migrate . --apply
</code></pre>
      <h2 id="policy">Policy</h2>
      <p>Strikte Medien-/Provenance-Pflichten über Policy-JSON; Framework-Default bleibt weich.</p>
`;

function patch(file, lang, mainHtml, title, canonical) {
  let html = readFileSync(join(dir, file), 'utf8');
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/rel="canonical" href="[^"]*"/, `rel="canonical" href="${canonical}"`);
  html = html.replace(/softwareVersion": "1\.2\.0"/g, 'softwareVersion": "1.2.1"');
  html = html.replace(/v1\.2\.0/g, 'v1.2.1');
  const alt = lang === 'en' ? 'transparency-leitfaden.html' : 'transparency.html';
  const altLang = lang === 'en' ? 'de' : 'en';
  if (!html.includes(`hreflang="${altLang}"`)) {
    html = html.replace(
      '</title>',
      `</title>\n  <link rel="alternate" hreflang="${altLang}" href="${alt}">\n  <link rel="alternate" hreflang="${lang}" href="${file}">`,
    );
  }
  html = html.replace(
    /<main class="velin-doc-main"[\s\S]*?<\/main>/,
    `<main class="velin-doc-main" id="main-content">${mainHtml}\n    </main>`,
  );
  const href = lang === 'de' ? 'transparency-leitfaden.html' : 'transparency.html';
  const label = lang === 'de' ? 'Transparenz' : 'Transparency';
  if (!html.includes('guides/transparency')) {
    html = html.replace(
      '<li><a href="../guides/velin-meta.html"',
      `<li><a href="../guides/${href}" data-cat="guides"><velin-icon name="shield-halved" provider="fontawesome" variant="solid" size="14" class="velin-doc-sidebar__icon" aria-hidden="true"></velin-icon><span class="velin-doc-sidebar__label">${label}</span></a></li><li><a href="../guides/velin-meta.html"`,
    );
    html = html.replace(
      '<li><a href="../guides/velin-meta.html"><velin-icon',
      `<li><a href="../guides/${href}" class="active"><velin-icon name="shield-halved" provider="fontawesome" variant="solid" size="14" class="velin-doc-sidebar__icon" aria-hidden="true"></velin-icon><span class="velin-doc-sidebar__label">${label}</span></a></li><li><a href="../guides/velin-meta.html"><velin-icon`,
    );
  }
  writeFileSync(join(dir, file), html);
  console.log('patched', file);
}

patch('transparency.html', 'en', enMain, 'Velin Transparency Framework · VelinStyle', 'https://velinstyle.info/docs/guides/transparency.html');
patch('transparency-leitfaden.html', 'de', deMain, 'Velin Transparency Framework · VelinStyle', 'https://velinstyle.info/docs/guides/transparency-leitfaden.html');
