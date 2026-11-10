// ============================================
// Language Selector & Listen Button Components
// ============================================
import { useState, useRef, useEffect } from 'react';
import { Globe, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useLanguage, useSpeech, type SupportedLocale } from '../../../i18n';
import './LanguageComponents.css';

// =============================================
// LANGUAGE SELECTOR (dropdown)
// =============================================
export function LanguageSelector({ variant = 'header' }: { variant?: 'header' | 'standalone' | 'login' }) {
  const { locale, setLocale, locales, localeNames, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or touch
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const handleSelect = (code: SupportedLocale) => {
    setLocale(code);
    setOpen(false);
  };

  const currentInfo = localeNames[locale] || localeNames.en;

  return (
    <div
      className={`lang-selector lang-selector--${variant} notranslate no-translate`}
      translate="no"
      ref={ref}
    >
      <button
        type="button"
        className="lang-selector__trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        title={t.language?.selectLanguage || 'Select Language'}
        aria-label={t.language?.selectLanguage || 'Select Language'}
      >
        <Globe size={variant === 'login' ? 16 : 18} />
        <span className="lang-selector__current">{currentInfo.nativeName}</span>
        <span className="lang-selector__badge">{locale.toUpperCase()}</span>
        <ChevronDown size={14} className={`lang-selector__chevron ${open ? 'lang-selector__chevron--open' : ''}`} />
      </button>

      {open && (
        <div className="lang-selector__dropdown notranslate no-translate" translate="no">
          <div className="lang-selector__dropdown-title">{t.language?.selectLanguage || 'Select Language'}</div>
          {locales.map(code => {
            const info = localeNames[code];
            const isSelected = code === locale;
            return (
              <button
                key={code}
                type="button"
                className={`lang-selector__option ${isSelected ? 'lang-selector__option--active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(code);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(code);
                }}
              >
                <span className="lang-selector__option-native">{info.nativeName}</span>
                <span className="lang-selector__option-name">{info.name}</span>
                {isSelected && <span className="lang-selector__check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================
// LISTEN BUTTON (Text-to-Speech)
// =============================================
export function ListenButton({
  text,
  label,
  size = 'md',
}: {
  /** The text to read aloud */
  text: string;
  /** Optional label override */
  label?: string;
  size?: 'sm' | 'md';
}) {
  const { t } = useLanguage();
  const { isSupported, isSpeaking, speak, stop } = useSpeech();

  if (!isSupported) {
    return (
      <button
        className={`listen-btn listen-btn--${size} listen-btn--disabled`}
        title={t.tts.unsupported}
        disabled
      >
        <VolumeX size={size === 'sm' ? 14 : 16} />
        <span>{label || t.actions.listen}</span>
      </button>
    );
  }

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      className={`listen-btn listen-btn--${size} ${isSpeaking ? 'listen-btn--active' : ''}`}
      onClick={handleClick}
      title={isSpeaking ? t.tts.stop : t.tts.listen}
    >
      {isSpeaking ? <VolumeX size={size === 'sm' ? 14 : 16} /> : <Volume2 size={size === 'sm' ? 14 : 16} />}
      <span>{isSpeaking ? (label ? t.actions.stopListening : t.actions.stopListening) : (label || t.actions.listen)}</span>
    </button>
  );
}
