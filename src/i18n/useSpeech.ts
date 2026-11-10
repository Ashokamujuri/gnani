// ============================================
// CropShield AI – Text-to-Speech Hook
// ============================================
// Uses browser SpeechSynthesis API where supported.
// Graceful fallback for unsupported browsers.
// ============================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

interface UseSpeechReturn {
  /** Whether TTS is supported in this browser */
  isSupported: boolean;
  /** Whether currently speaking */
  isSpeaking: boolean;
  /** Speak the given text */
  speak: (text: string) => void;
  /** Stop speaking */
  stop: () => void;
}

export function useSpeech(): UseSpeechReturn {
  const { ttsLang } = useLanguage();
  const [isSupported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    // Stop any ongoing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = ttsLang;
    utterance.rate = 0.9; // Slightly slower for farmer accessibility
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a voice for the locale
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang === ttsLang) ||
      voices.find(v => v.lang.startsWith(ttsLang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, ttsLang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { isSupported, isSpeaking, speak, stop };
}
