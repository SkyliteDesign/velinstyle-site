/**
 * Real production showcase walk data for Act IV.
 * Light = default capture; dark/mobile use dedicated assets when present (else CSS stage).
 */
window.VELIN_SHOWCASE_WALK = [
  {
    id: 'birdapi',
    title: 'BirdAPI',
    url: 'https://birdapi.de/',
    image: 'assets/img/showcase/birdapi.webp',
    imageDark: 'assets/img/showcase/birdapi-dark.webp',
    imageMobile: 'assets/img/showcase/birdapi-mobile.webp',
    story:
      'Platform home for APIs, products, and community — built as a living VelinStyle surface, not a brochure PDF.',
    components: ['velin-nav', 'velin-btn', 'velin-card', 'velin-theme-toggle'],
    architecture: ['Tokens', 'Marketing sections', 'Theme contract', 'Runtime components'],
    codeUrl: null,
    walkPositions: ['50% 0%', '50% 35%', '50% 70%'],
  },
  {
    id: 'mein-birdapi',
    title: 'Mein BirdAPI',
    url: 'https://mein.birdapi.store/',
    image: 'assets/img/showcase/mein-birdapi.webp',
    imageDark: 'assets/img/showcase/mein-birdapi-dark.webp',
    imageMobile: 'assets/img/showcase/mein-birdapi-mobile.webp',
    story:
      'Customer portal for subscriptions, licenses, tickets, and invoices — dense UI that stays readable.',
    components: ['velin-data-table', 'velin-btn', 'velin-badge', 'velin-nav', 'velin-alert'],
    architecture: ['App shell', 'Data density', 'Status feedback', 'Portal flows'],
    codeUrl: null,
    walkPositions: ['50% 0%', '50% 40%', '50% 75%'],
  },
  {
    id: 'papageienregister',
    title: 'Papageienregister',
    url: 'https://papageienregister.de/',
    image: 'assets/img/showcase/papageienregister.webp',
    imageDark: 'assets/img/showcase/papageienregister-dark.webp',
    imageMobile: 'assets/img/showcase/papageienregister-mobile.webp',
    story:
      'Online register for parrots — proof and administration with calm, trustworthy service UI.',
    components: ['velin-form-summary', 'velin-input', 'velin-btn', 'velin-card'],
    architecture: ['Service landing', 'Forms + validation', 'Trust content'],
    codeUrl: null,
    walkPositions: ['50% 0%', '50% 45%', '50% 80%'],
  },
  {
    id: 'inselsorglos',
    title: 'Insel Sorglos',
    url: 'https://inselsorglos.de/',
    image: 'assets/img/showcase/inselsorglos.webp',
    imageDark: 'assets/img/showcase/inselsorglos-dark.webp',
    imageMobile: 'assets/img/showcase/inselsorglos-mobile.webp',
    story:
      'Holiday-home service on Usedom — cleaning, check-in, linen — booked through a clear service site.',
    components: ['velin-btn', 'velin-card', 'velin-accordion', 'velin-nav'],
    architecture: ['Local service', 'Booking intent', 'Responsive content'],
    codeUrl: null,
    walkPositions: ['50% 0%', '50% 38%', '50% 72%'],
  },
];
