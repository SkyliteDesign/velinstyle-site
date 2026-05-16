// VelinStyle Web Components – TypeScript Declarations
// https://github.com/SkyliteDesign/velinstyle

// ---------------------------------------------------------------------------
// Focus-Management Utilities
// ---------------------------------------------------------------------------
export declare function trapFocus(root: ShadowRoot | HTMLElement, event: KeyboardEvent): void;
export declare function rovingTabindex(container: HTMLElement, items: HTMLElement[], event: KeyboardEvent): void;
export declare function saveFocus(): HTMLElement | null;
export declare function restoreFocus(element: HTMLElement | null): void;
export declare function getFocusableElements(root: ShadowRoot | HTMLElement): HTMLElement[];

// ---------------------------------------------------------------------------
// Custom Event Detail Interfaces
// ---------------------------------------------------------------------------
export interface VelinCloseEvent extends CustomEvent {
  type: 'velin-close';
}

export interface VelinTabChangeEvent extends CustomEvent<{ tab: HTMLElement }> {
  type: 'velin-tab-change';
}

export interface VelinThemeChangeEvent extends CustomEvent<{ dark: boolean }> {
  type: 'velin-theme-change';
}

export interface VelinCopiedEvent extends CustomEvent<{ value: string }> {
  type: 'velin-copied';
}

export interface VelinToastOptions {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
  duration?: number;
}

// ---------------------------------------------------------------------------
// Component Event Maps
// ---------------------------------------------------------------------------
interface VelinModalEventMap extends HTMLElementEventMap {
  'velin-close': VelinCloseEvent;
}

interface VelinDrawerEventMap extends HTMLElementEventMap {
  'velin-close': VelinCloseEvent;
}

interface VelinDropdownEventMap extends HTMLElementEventMap {
  'velin-close': VelinCloseEvent;
}

interface VelinTabsEventMap extends HTMLElementEventMap {
  'velin-tab-change': VelinTabChangeEvent;
}

interface VelinThemeToggleEventMap extends HTMLElementEventMap {
  'velin-theme-change': VelinThemeChangeEvent;
}

interface VelinCopyEventMap extends HTMLElementEventMap {
  'velin-copied': VelinCopiedEvent;
}

// ---------------------------------------------------------------------------
// Web Components
// ---------------------------------------------------------------------------

/** Accessible modal dialog with focus trapping and overlay. */
export declare class VelinModal extends HTMLElement {
  static observedAttributes: string[];
  open: boolean;
  title: string;
  open(): void;
  close(): void;
  addEventListener<K extends keyof VelinModalEventMap>(type: K, listener: (this: VelinModal, ev: VelinModalEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof VelinModalEventMap>(type: K, listener: (this: VelinModal, ev: VelinModalEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
}

/** Dropdown menu with keyboard navigation and focus management. */
export declare class VelinDropdown extends HTMLElement {
  static observedAttributes: string[];
  open: boolean;
  align: 'start' | 'end';
  open(): void;
  close(): void;
  toggle(): void;
  addEventListener<K extends keyof VelinDropdownEventMap>(type: K, listener: (this: VelinDropdown, ev: VelinDropdownEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof VelinDropdownEventMap>(type: K, listener: (this: VelinDropdown, ev: VelinDropdownEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
}

/** Accordion with exclusive or independent panel support. */
export declare class VelinAccordion extends HTMLElement {
  static observedAttributes: string[];
  exclusive: boolean;
}

/** Accessible tab panel with roving tabindex and arrow-key navigation. */
export declare class VelinTabs extends HTMLElement {
  addEventListener<K extends keyof VelinTabsEventMap>(type: K, listener: (this: VelinTabs, ev: VelinTabsEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof VelinTabsEventMap>(type: K, listener: (this: VelinTabs, ev: VelinTabsEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
}

/** Toast notification container with stackable messages. */
export declare class VelinToast extends HTMLElement {
  show(options: VelinToastOptions): HTMLElement;
}

/** SVG icon component that loads icons from a sprite sheet. */
export declare class VelinIcon extends HTMLElement {
  static observedAttributes: string[];
  name: string;
  size: string | number;
  label: string;
  sprite: string;
}

/** Offcanvas drawer/sidebar with focus trapping and body scroll lock. */
export declare class VelinDrawer extends HTMLElement {
  static observedAttributes: string[];
  open: boolean;
  side: 'start' | 'end' | 'top' | 'bottom';
  title: string;
  open(): void;
  close(): void;
  addEventListener<K extends keyof VelinDrawerEventMap>(type: K, listener: (this: VelinDrawer, ev: VelinDrawerEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof VelinDrawerEventMap>(type: K, listener: (this: VelinDrawer, ev: VelinDrawerEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
}

/** Dark/Light theme toggle with localStorage persistence. */
export declare class VelinThemeToggle extends HTMLElement {
  target: string;
  theme: 'dark' | undefined;
  addEventListener<K extends keyof VelinThemeToggleEventMap>(type: K, listener: (this: VelinThemeToggle, ev: VelinThemeToggleEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof VelinThemeToggleEventMap>(type: K, listener: (this: VelinThemeToggle, ev: VelinThemeToggleEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
}

/** Rich-content popover/tooltip with click, hover, or focus triggers. */
export declare class VelinPopover extends HTMLElement {
  static observedAttributes: string[];
  open: boolean;
  trigger: 'click' | 'hover' | 'focus';
  placement: 'top' | 'bottom' | 'start' | 'end';
  title: string;
  open(): void;
  close(): void;
  toggle(): void;
}

/** Click-to-copy button with visual feedback. */
export declare class VelinCopy extends HTMLElement {
  value: string;
  label: string;
  addEventListener<K extends keyof VelinCopyEventMap>(type: K, listener: (this: VelinCopy, ev: VelinCopyEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof VelinCopyEventMap>(type: K, listener: (this: VelinCopy, ev: VelinCopyEventMap[K]) => void, options?: boolean | EventListenerOptions): void;
}

/** Scroll-to-top button that appears after scrolling past a threshold. */
export declare class VelinScrollTop extends HTMLElement {
  threshold: string | number;
  visible: boolean;
}

/** Tooltip via JS positioning with auto-flip. */
export declare class VelinTooltipWC extends HTMLElement {
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

/** Lightbox gallery for images and videos with keyboard/swipe navigation. */
export declare class VelinLightbox extends HTMLElement {
  open(index?: number): void;
  close(): void;
  prev(): void;
  next(): void;
}

/** Multi-step wizard stepper with active/completed states. */
export declare class VelinStepperWC extends HTMLElement {
  steps: string;
  active: number;
  prev(): void;
  next(): void;
  goTo(index: number): void;
}

/** Native dialog wrapper providing alert, confirm and prompt methods. */
export declare class VelinDialog extends HTMLElement {
  alert(message: string, title?: string): Promise<void>;
  confirm(message: string, title?: string): Promise<boolean>;
  prompt(message: string, defaultValue?: string, title?: string): Promise<string | null>;
}

/** Countdown timer towards a target date. Fires velin-countdown-end on completion. */
export declare class VelinCountdown extends HTMLElement {
  datetime: string;
}

/** SVG circular progress ring with value, size, stroke and color attributes. */
export declare class VelinProgressRing extends HTMLElement {
  value: number;
  size: number;
  stroke: number;
  color: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Module Declaration
// ---------------------------------------------------------------------------
declare module 'velinstyle' {
  export { VelinModal, VelinDropdown, VelinAccordion, VelinTabs, VelinToast, VelinIcon, VelinDrawer, VelinThemeToggle, VelinPopover, VelinCopy, VelinScrollTop, VelinTooltipWC, VelinLightbox, VelinStepperWC, VelinDialog, VelinCountdown, VelinProgressRing };
  export class VelinCarousel extends HTMLElement {
    prev(): void;
    next(): void;
    goTo(index: number): void;
  }

  export class VelinCollapse extends HTMLElement {
    toggle(): void;
    open(): void;
    close(): void;
  }

  export class VelinScrollspy extends HTMLElement {}

  export { trapFocus, rovingTabindex, saveFocus, restoreFocus, getFocusableElements };
}

// ---------------------------------------------------------------------------
// HTML Element Tag Name Map Augmentation
// ---------------------------------------------------------------------------
declare global {
  interface HTMLElementTagNameMap {
    'velin-modal': VelinModal;
    'velin-dropdown': VelinDropdown;
    'velin-accordion': VelinAccordion;
    'velin-tabs': VelinTabs;
    'velin-toast': VelinToast;
    'velin-icon': VelinIcon;
    'velin-drawer': VelinDrawer;
    'velin-theme-toggle': VelinThemeToggle;
    'velin-popover': VelinPopover;
    'velin-copy': VelinCopy;
    'velin-scroll-top': VelinScrollTop;
    'velin-carousel': VelinCarousel;
    'velin-collapse': VelinCollapse;
    'velin-scrollspy': VelinScrollspy;
    'velin-tooltip': VelinTooltipWC;
    'velin-lightbox': VelinLightbox;
    'velin-stepper-wc': VelinStepperWC;
    'velin-dialog': VelinDialog;
    'velin-countdown': VelinCountdown;
    'velin-progress-ring': VelinProgressRing;
    'velin-persist': VelinPersist;
  }
}

/** Wraps a form to auto-save/restore field values in localStorage. */
export declare class VelinPersist extends HTMLElement {
  storageKey: string;
  clear(): void;
}

/** Haptic feedback patterns for navigator.vibrate(). */
export declare const HapticPatterns: Record<string, number[]>;
export declare function vibrate(pattern: string | number[]): void;
export declare function applyHaptic(element: HTMLElement): void;
export declare class VelinHapticObserver {
  start(root?: HTMLElement): void;
  stop(): void;
}
