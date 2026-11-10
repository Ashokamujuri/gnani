// ============================================
// CropShield AI – Language Context
// ============================================
// Provides app-wide language state with localStorage persistence.
// Usage: const { t, locale, setLocale } = useLanguage();
// ============================================

import {
  createContext, useContext, useState, useCallback, useEffect, useRef,
  type ReactNode,
} from 'react';
import {
  dictionaries, localeNames, supportedLocales, ttsLangCodes,
  type SupportedLocale, type TranslationDictionary,
} from './translations';
import { translatePhrase } from './phraseDictionary';
import { setupDOMTranslator, updateDOMTranslation } from './domTranslator';

const STORAGE_KEY = 'cropshield-locale';

function readStoredLocale(): SupportedLocale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && supportedLocales.includes(stored as SupportedLocale)) {
      return stored as SupportedLocale;
    }
  } catch {
    // localStorage unavailable
  }
  return 'en';
}

interface LanguageContextType {
  /** Current locale code */
  locale: SupportedLocale;
  /** Change locale – persists to localStorage */
  setLocale: (locale: SupportedLocale) => void;
  /** Translation dictionary for current locale */
  t: TranslationDictionary;
  /** Direct phrase translation helper */
  tr: (text: string) => string;
  /** All supported locale codes */
  locales: SupportedLocale[];
  /** Map of locale code → display names */
  localeNames: Record<SupportedLocale, { name: string; nativeName: string }>;
  /** TTS language code for current locale */
  ttsLang: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(readStoredLocale);
  const localeRef = useRef(locale);
  localeRef.current = locale;

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const tr = useCallback((text: string): string => {
    return translatePhrase(text, locale);
  }, [locale]);

  // Set html lang attribute and trigger DOM translation
  useEffect(() => {
    document.documentElement.lang = locale;
    updateDOMTranslation(locale);
  }, [locale]);

  // Attach global DOM watcher on mount
  useEffect(() => {
    const cleanup = setupDOMTranslator(() => localeRef.current);
    return cleanup;
  }, []);

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: dictionaries[locale],
    tr,
    locales: supportedLocales,
    localeNames,
    ttsLang: ttsLangCodes[locale],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
