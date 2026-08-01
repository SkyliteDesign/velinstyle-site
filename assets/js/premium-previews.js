/**
 * Curated premium preview HTML for homepage hero / playground.
 * Hand-edited for quality — no scaffold placeholders.
 */
window.VELIN_PREMIUM_PREVIEWS = {
  version: '1.2.0',
  prompts: [
    {
      id: 'lawyer',
      label: 'Tax advisor',
      prompt: 'Steuerberater Landingpage mit Leistungen, FAQ und Kontaktformular',
      intent: 'lawyer',
      sections: ['hero', 'trust', 'services', 'process', 'faq', 'contact'],
      components: ['velin-btn', 'velin-card', 'velin-accordion', 'velin-form-summary', 'velin-input'],
      reviewScore: 9.8,
      html: `
<section class="px-preview__hero">
  <p class="px-preview__eyebrow">Tax &amp; advisory</p>
  <h2 class="px-preview__title">Steuerberatung mit Klarheit</h2>
  <p class="px-preview__lede">Plain-language guidance for founders and operators — from first call to filing.</p>
  <div class="px-preview__actions">
    <a class="velin-btn velin-btn--primary" href="#playground">Kontakt aufnehmen</a>
    <a class="velin-btn velin-btn--outline" href="#components">Leistungen</a>
  </div>
</section>
<section class="px-preview__trust" aria-label="Trusted by">
  <span>Acme Audit</span><span>Nordic Ledger</span><span>Rhein Finance</span><span>Helix Tax</span>
</section>
<section class="px-preview__grid">
  <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Jahresabschluss</h3><p class="velin-card__text">Clean books, clear ownership, no jargon walls.</p></div></article>
  <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Gründung</h3><p class="velin-card__text">Structure, taxes, and next steps in one plan.</p></div></article>
  <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Laufende Beratung</h3><p class="velin-card__text">Decisions when regulations or needs change.</p></div></article>
</section>
<section class="px-preview__faq">
  <h3>FAQ</h3>
  <velin-accordion>
    <details open><summary>What happens in the first meeting?</summary><p>We clarify goals, documents, and realistic next steps.</p></details>
    <details><summary>Do you work remotely?</summary><p>Yes — secure document exchange and scheduled calls.</p></details>
  </velin-accordion>
</section>
<form class="px-preview__form" novalidate>
  <h3>Contact</h3>
  <velin-form-summary></velin-form-summary>
  <label class="velin-label" for="px-name">Name</label>
  <input class="velin-input" id="px-name" name="name" required autocomplete="name">
  <label class="velin-label" for="px-email">Email</label>
  <input class="velin-input" id="px-email" name="email" type="email" required autocomplete="email">
  <button type="submit" class="velin-btn velin-btn--primary">Send</button>
</form>`
    },
    {
      id: 'saas',
      label: 'SaaS launch',
      prompt: 'SaaS landing page with pricing, social proof, and FAQ',
      intent: 'saas',
      sections: ['hero', 'benefits', 'pricing', 'faq', 'cta'],
      components: ['velin-btn', 'velin-card', 'velin-badge', 'velin-accordion'],
      reviewScore: 9.6,
      html: `
<section class="px-preview__hero">
  <span class="velin-badge">New · 1.2.0</span>
  <h2 class="px-preview__title">Ship inclusive UI in days, not sprints</h2>
  <p class="px-preview__lede">Plan-first scaffolding on an accessibility-first design system — no framework lock-in.</p>
  <div class="px-preview__actions">
    <a class="velin-btn velin-btn--primary" href="#playground">Start free</a>
    <a class="velin-btn velin-btn--ghost" href="#showcase">See demos</a>
  </div>
</section>
<section class="px-preview__grid">
  <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Plan before HTML</h3><p class="velin-card__text">Intent → sections → constraints → render.</p></div></article>
  <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Contracts built in</h3><p class="velin-card__text">38/38 component a11y contracts, not plugins.</p></div></article>
  <article class="velin-card"><div class="velin-card__body"><h3 class="velin-card__title">Agent-ready</h3><p class="velin-card__text">velin-agent.json + llms.txt for tools that generate UI.</p></div></article>
</section>
<section class="px-preview__pricing">
  <article class="velin-card"><div class="velin-card__body"><h3>Starter</h3><p class="px-preview__price">$0</p><button type="button" class="velin-btn velin-btn--outline velin-w-full">Choose</button></div></article>
  <article class="velin-card px-preview__pricing--featured"><div class="velin-card__body"><h3>Pro</h3><p class="px-preview__price">$12</p><button type="button" class="velin-btn velin-btn--primary velin-w-full">Choose</button></div></article>
</section>`
    }
  ]
};
