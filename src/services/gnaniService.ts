// ============================================
// CropShield AI – Gnani AI Client Service
// ============================================
// Frontend service connecting to CropShield's secure backend endpoints
// (/api/gnani/stt, /api/gnani/tts, and /api/gnani/status).
//
// Features:
// - Supports 10 Indic languages + English with correct BCP-47 tags
// - Dynamic voice catalog with user-selectable voices per language
// - Client-side audio Blob URL caching for instant replay without re-fetching
// - Audio state controls: play, pause, resume, replay, stop
// - Retains visible text on TTS failures
// ============================================

export interface STTResult {
  text: string;
  language: string;
  confidence?: number;
  source: 'gnani' | 'browser';
}

export interface TTSResult {
  audioUrl?: string;
  source: 'gnani' | 'cache' | 'browser';
}

export interface VoiceOption {
  id: string;
  gender: 'female' | 'male';
  displayName: string;
}

export interface LanguageVoiceCatalog {
  name: string;
  nativeName: string;
  defaultVoice: string;
  availableVoices: VoiceOption[];
}

export const GNANI_LANG_MAP: Record<string, { code: string; defaultVoice: string; name: string }> = {
  te: { code: 'te-IN', defaultVoice: 'Suhana', name: 'తెలుగు' },
  hi: { code: 'hi-IN', defaultVoice: 'Nalini', name: 'हिन्दी' },
  en: { code: 'en-IN', defaultVoice: 'Nalini', name: 'English' },
  mr: { code: 'mr-IN', defaultVoice: 'Asmita', name: 'मराठी' },
  ta: { code: 'ta-IN', defaultVoice: 'Kaveri', name: 'தமிழ்' },
  kn: { code: 'kn-IN', defaultVoice: 'Kaveri', name: 'ಕನ್ನಡ' },
  ml: { code: 'ml-IN', defaultVoice: 'Kaveri', name: 'മലയാളം' },
  bn: { code: 'bn-IN', defaultVoice: 'Nalini', name: 'বাংলা' },
  gu: { code: 'gu-IN', defaultVoice: 'Nalini', name: 'ગુજરાતી' },
  pa: { code: 'pa-IN', defaultVoice: 'Nalini', name: 'ਪੰਜਾਬੀ' },
};

// Client-side Blob URL cache to instantly replay audio and save bandwidth
const clientAudioBlobCache = new Map<string, string>();

export class GnaniVoiceService {
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentPlayingText: string | null = null;
  private backendConfigured: boolean | null = null;
  private activeVoices: Record<string, string> = {
    'te-IN': 'Suhana',
    'hi-IN': 'Nalini',
    'en-IN': 'Nalini',
    'mr-IN': 'Asmita',
    'ta-IN': 'Kaveri',
    'kn-IN': 'Kaveri',
    'ml-IN': 'Kaveri',
    'bn-IN': 'Nalini',
    'gu-IN': 'Nalini',
    'pa-IN': 'Nalini',
  };

  /**
   * Set user preferred voice for a language
   */
  public setPreferredVoice(langCode: string, voiceId: string): void {
    this.activeVoices[langCode] = voiceId;
  }

  /**
   * Get currently active voice for a language
   */
  public getActiveVoice(langCode: string): string {
    return this.activeVoices[langCode] || GNANI_LANG_MAP[langCode]?.defaultVoice || 'Suhana';
  }

  /**
   * Check if backend has Gnani API configured
   */
  public async checkBackendStatus(): Promise<boolean> {
    try {
      const res = await fetch('/api/gnani/status');
      if (res.ok) {
        const data = await res.json();
        this.backendConfigured = Boolean(data.configured);
        return this.backendConfigured;
      }
    } catch {
      // Backend status unavailable
    }
    return false;
  }

  /**
   * Convert recorded audio Blob to transcript using Backend Gnani Prisma v2.5
   */
  public async transcribeAudio(audioBlob: Blob, localeOrBcp47: string = 'te-IN'): Promise<STTResult> {
    const langCode = localeOrBcp47.includes('-')
      ? localeOrBcp47
      : (GNANI_LANG_MAP[localeOrBcp47]?.code || 'te-IN');

    try {
      const response = await fetch('/api/gnani/stt', {
        method: 'POST',
        headers: {
          'Content-Type': audioBlob.type || 'audio/wav',
          'X-Language-Code': langCode,
        },
        body: audioBlob,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.transcript) {
          return {
            text: data.transcript.trim(),
            language: data.language || langCode,
            confidence: data.confidence || 0.95,
            source: 'gnani',
          };
        }
      }
    } catch (err) {
      console.warn('[Gnani Client STT] Backend error, falling back to local speech:', err);
    }

    return {
      text: '',
      language: langCode,
      source: 'browser',
    };
  }

  /**
   * Synthesize text to speech using Backend Gnani Timbre v2.5
   * With caching, play/pause state management, and graceful error handling.
   */
  public async speakText(
    text: string,
    localeOrBcp47: string = 'te-IN',
    onStart?: () => void,
    onEnd?: () => void,
    voiceOverride?: string
  ): Promise<TTSResult> {
    this.stopSpeaking();
    if (!text || !text.trim()) {
      onEnd?.();
      return { source: 'browser' };
    }

    const langCode = localeOrBcp47.includes('-')
      ? localeOrBcp47
      : (GNANI_LANG_MAP[localeOrBcp47]?.code || 'te-IN');

    const voice = voiceOverride || this.getActiveVoice(langCode);
    const cacheKey = `${langCode}_${voice}_${text.trim()}`;

    // 1. Check local client Blob Cache
    const cachedUrl = clientAudioBlobCache.get(cacheKey);
    if (cachedUrl) {
      return this.playAudioUrl(cachedUrl, text, onStart, onEnd, 'cache');
    }

    // 2. Fetch from backend (which checks server-side LRU cache & Gnani Timbre v2.5)
    try {
      const response = await fetch('/api/gnani/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.slice(0, 500),
          language: langCode,
          voice: voice,
          speed: 1.0,
        }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('audio')) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        clientAudioBlobCache.set(cacheKey, audioUrl);

        return this.playAudioUrl(audioUrl, text, onStart, onEnd, 'gnani');
      }
    } catch (err) {
      console.warn('[Gnani Client TTS] Backend synthesis error, falling back to browser speech:', err);
    }

    // 3. Fallback: Browser Web Speech API SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const match =
        voices.find(v => v.lang === langCode) ||
        voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
      if (match) utterance.voice = match;

      utterance.onstart = () => onStart?.();
      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();

      window.speechSynthesis.speak(utterance);
      return { source: 'browser' };
    }

    onEnd?.();
    return { source: 'browser' };
  }

  private playAudioUrl(
    audioUrl: string,
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    source: 'gnani' | 'cache' = 'gnani'
  ): Promise<TTSResult> {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;
      this.currentPlayingText = text;

      audio.onplay = () => {
        onStart?.();
        resolve({ audioUrl, source });
      };

      audio.onended = () => {
        this.currentAudioElement = null;
        this.currentPlayingText = null;
        onEnd?.();
      };

      audio.onerror = () => {
        this.currentAudioElement = null;
        this.currentPlayingText = null;
        onEnd?.();
        resolve({ source: 'browser' });
      };

      audio.play().catch(() => {
        this.currentAudioElement = null;
        this.currentPlayingText = null;
        onEnd?.();
        resolve({ source: 'browser' });
      });
    });
  }

  /**
   * Pause currently playing audio
   */
  public pause(): void {
    if (this.currentAudioElement && !this.currentAudioElement.paused) {
      this.currentAudioElement.pause();
    }
  }

  /**
   * Resume paused audio
   */
  public resume(): void {
    if (this.currentAudioElement && this.currentAudioElement.paused) {
      this.currentAudioElement.play().catch(() => {});
    }
  }

  /**
   * Check if currently playing
   */
  public isPlaying(): boolean {
    return Boolean(this.currentAudioElement && !this.currentAudioElement.paused);
  }

  /**
   * Check if currently paused
   */
  public isPaused(): boolean {
    return Boolean(this.currentAudioElement && this.currentAudioElement.paused);
  }

  /**
   * Stop active playback
   */
  public stopSpeaking(): void {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // Ignored
      }
      this.currentAudioElement = null;
      this.currentPlayingText = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const gnaniVoiceService = new GnaniVoiceService();
