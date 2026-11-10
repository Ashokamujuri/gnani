// ============================================
// CropShield AI – Automatic DOM Translation Engine
// Seamlessly translates all text nodes and attributes across the entire DOM
// to Hindi, Telugu, Marathi, or English.
// ============================================

import { translatePhrase, getCanonicalEnglish } from './phraseDictionary';
import type { SupportedLocale } from './translations';

const originalTextMap = new WeakMap<Node, string>();
const originalAttrMap = new WeakMap<Element, Record<string, string>>();

let isTranslating = false;
let currentActiveLocale: SupportedLocale = 'en';

const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label'];
const EXCLUDED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'PATH']);

function isExcludedElement(el: Element | null): boolean {
  if (!el) return false;
  if (EXCLUDED_TAGS.has(el.tagName)) return true;
  if (el.closest('.lang-selector, [translate="no"], .no-translate, .notranslate')) return true;
  return false;
}

/**
 * Translates a single text node
 */
function translateTextNode(node: Text, locale: SupportedLocale) {
  // Ignore purely whitespace nodes
  const val = node.nodeValue;
  if (!val || !val.trim()) return;

  // Check parent tag
  const parent = node.parentElement;
  if (parent && isExcludedElement(parent)) return;

  // Get or determine canonical English text
  let canonical = originalTextMap.get(node);
  if (!canonical) {
    const found = getCanonicalEnglish(val);
    canonical = found || val;
    originalTextMap.set(node, canonical);
  }

  const translated = translatePhrase(canonical, locale);
  if (node.nodeValue !== translated) {
    node.nodeValue = translated;
  }
}

/**
 * Translates attributes like placeholder, title, aria-label
 */
function translateAttributes(el: Element, locale: SupportedLocale) {
  if (isExcludedElement(el)) return;

  let originalAttrs = originalAttrMap.get(el);
  if (!originalAttrs) {
    originalAttrs = {};
    for (const attr of TRANSLATABLE_ATTRS) {
      const val = el.getAttribute(attr);
      if (val && val.trim()) {
        const canonical = getCanonicalEnglish(val) || val;
        originalAttrs[attr] = canonical;
      }
    }
    originalAttrMap.set(el, originalAttrs);
  }

  for (const attr of TRANSLATABLE_ATTRS) {
    const canonical = originalAttrs[attr];
    if (canonical) {
      const translated = translatePhrase(canonical, locale);
      if (el.getAttribute(attr) !== translated) {
        el.setAttribute(attr, translated);
      }
    }
  }
}

/**
 * Translates an entire DOM subtree
 */
export function translateSubtree(root: Node, locale: SupportedLocale) {
  if (typeof document === 'undefined' || !root) return;

  isTranslating = true;
  try {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root as Text, locale);
      return;
    }

    if (root.nodeType === Node.ELEMENT_NODE) {
      const el = root as Element;
      if (isExcludedElement(el)) return;

      translateAttributes(el, locale);

      // Walk all text descendants
      const walker = document.createTreeWalker(
        el,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (parent && isExcludedElement(parent)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let currentNode = walker.nextNode();
      while (currentNode) {
        translateTextNode(currentNode as Text, locale);
        currentNode = walker.nextNode();
      }

      // Check child element attributes
      const childrenWithAttrs = el.querySelectorAll('[placeholder], [title], [aria-label]');
      childrenWithAttrs.forEach(child => translateAttributes(child, locale));
    }
  } finally {
    isTranslating = false;
  }
}

let observer: MutationObserver | null = null;

/**
 * Sets up global DOM translation watcher for the entire application.
 */
export function setupDOMTranslator(getLocale: () => SupportedLocale): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  currentActiveLocale = getLocale();

  // Initial translation pass
  if (document.body) {
    translateSubtree(document.body, currentActiveLocale);
  }

  // MutationObserver for dynamic updates
  observer = new MutationObserver(mutations => {
    if (isTranslating) return;

    const locale = getLocale();
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (isExcludedElement(el)) return;
          }
          translateSubtree(node, locale);
        });
      } else if (mutation.type === 'characterData') {
        const target = mutation.target;
        if (target.nodeType === Node.TEXT_NODE) {
          const parent = target.parentElement;
          if (parent && isExcludedElement(parent)) return;

          isTranslating = true;
          try {
            translateTextNode(target as Text, locale);
          } finally {
            isTranslating = false;
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

/**
 * Re-translates the entire document when the locale changes.
 */
export function updateDOMTranslation(locale: SupportedLocale) {
  currentActiveLocale = locale;
  if (typeof document !== 'undefined' && document.body) {
    translateSubtree(document.body, locale);
  }
}
