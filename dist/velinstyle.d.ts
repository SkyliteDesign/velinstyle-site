/* AUTO-GENERATED — node scripts/generate-types.mjs */

export function register(tagNames: string[]): Promise<unknown[]>;
export function lazyDefine(tagName: string): Promise<unknown>;
export function whenDefined(tagName: string): Promise<CustomElementConstructor>;
export function bootFromDOM(
  root?: ParentNode,
  options?: { attributes?: boolean; highlight?: boolean; haptic?: boolean; tags?: string[] }
): Promise<unknown[]>;

export { escapeHTML, escapeHTMLAttribute, sanitizeURL, sanitizeSearchUrl } from '../components/sanitize.js';

declare global {
  interface HTMLElementTagNameMap {
    'velin-accordion': HTMLElement;
    'velin-announcer': HTMLElement;
    'velin-bottom-nav': HTMLElement;
    'velin-calendar': HTMLElement;
    'velin-carousel': HTMLElement;
    'velin-code-block': HTMLElement;
    'velin-collapse': HTMLElement;
    'velin-combobox': HTMLElement;
    'velin-command': HTMLElement;
    'velin-copy': HTMLElement;
    'velin-countdown': HTMLElement;
    'velin-counter': HTMLElement;
    'velin-data-table': HTMLElement;
    'velin-dialog': HTMLElement;
    'velin-drawer': HTMLElement;
    'velin-dropdown': HTMLElement;
    'velin-email': HTMLElement;
    'velin-empty-state': HTMLElement;
    'velin-file-dropzone': HTMLElement;
    'velin-form-summary': HTMLElement;
    'velin-icon': HTMLElement;
    'velin-lightbox': HTMLElement;
    'velin-live-dot': HTMLElement;
    'velin-menubar': HTMLElement;
    'velin-modal': HTMLElement;
    'velin-otp-input': HTMLElement;
    'velin-password-strength': HTMLElement;
    'velin-persist': HTMLElement;
    'velin-popover': HTMLElement;
    'velin-progress-ring': HTMLElement;
    'velin-rating': HTMLElement;
    'velin-scroll-top': HTMLElement;
    'velin-scrollspy': HTMLElement;
    'velin-search': HTMLElement;
    'velin-secure-field': HTMLElement;
    'velin-segmented-control': HTMLElement;
    'velin-sheet': HTMLElement;
    'velin-sparkline': HTMLElement;
    'velin-stepper': HTMLElement;
    'velin-stepper-wc': HTMLElement;
    'velin-tabs': HTMLElement;
    'velin-theme-toggle': HTMLElement;
    'velin-toast': HTMLElement;
    'velin-tooltip': HTMLElement;
    'velin-tooltip-wc': HTMLElement;
  }
}
