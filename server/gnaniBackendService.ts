// ============================================
// CropShield AI – Gnani AI Backend Service
// ============================================
// Connects securely to Gnani AI (api.vachana.ai) without exposing
// credentials to the browser or public client code.
//
// Features:
// - Gnani Prisma v2.5 / v3.0 STT integration (POST /stt/v3)
// - Gnani Timbre v2.5 TTS integration (POST /api/v1/tts/inference)
// - Language support: te-IN, hi-IN, en-IN, mr-IN, ta-IN, kn-IN, ml-IN, bn-IN, gu-IN, pa-IN
// - Automatic exponential backoff & retry on transient 5xx/429 errors
// - Rate-limit & timeout handling
// - Voice catalogue with official language-matched voices
// - In-memory LRU audio caching to prevent duplicate API hits
// ============================================

export type SupportedGnaniLanguage =
  | 'te-IN'
  | 'hi-IN'
  | 'en-IN'
  | 'mr-IN'
  | 'ta-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'bn-IN'
  | 'gu-IN'
  | 'pa-IN';

export interface STTOptions {
  languageCode: SupportedGnaniLanguage | string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface STTResponse {
  success: boolean;
  transcript: string;
  language: string;
  source: 'gnani-api' | 'simulated-fallback';
  durationMs: number;
  confidence?: number;
  error?: string;
}

export interface TTSOptions {
  text: string;
  language?: SupportedGnaniLanguage | string;
  voice?: string;
  speed?: number;
  timeoutMs?: number;
  maxRetries?: number;
  sampleRate?: number;
}

export interface TTSResponse {
  success: boolean;
  audioBuffer?: ArrayBuffer;
  contentType?: string;
  source: 'gnani-api' | 'cache' | 'simulated-fallback';
  durationMs: number;
  error?: string;
}

// Language to Official Supported Voices Map for Timbre v2.5
export interface VoiceDefinition {
  id: string;
  gender: 'female' | 'male';
  displayName: string;
}

export const GNANI_VOICE_CATALOGUE: Record<
  SupportedGnaniLanguage,
  {
    name: string;
    nativeName: string;
    defaultVoice: string;
    availableVoices: VoiceDefinition[];
  }
> = {
  'te-IN': {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    defaultVoice: 'Suhana',
    availableVoices: [
      { id: 'Suhana', gender: 'female', displayName: 'Suhana (Telugu - Clear)' },
      { id: 'Lehara', gender: 'female', displayName: 'Lehara (Telugu - Soft)' },
      { id: 'Lavanya', gender: 'female', displayName: 'Lavanya (Telugu - Expressive)' },
      { id: 'Yukti', gender: 'female', displayName: 'Yukti (Telugu - Natural)' },
      { id: 'Varuni', gender: 'female', displayName: 'Varuni (Telugu - Formal)' },
      { id: 'Kaveri', gender: 'female', displayName: 'Kaveri (Telugu - Standard)' },
    ],
  },
  'hi-IN': {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    defaultVoice: 'Nalini',
    availableVoices: [
      { id: 'Nalini', gender: 'female', displayName: 'Nalini (Hindi - Warm)' },
      { id: 'Bhavna', gender: 'female', displayName: 'Bhavna (Hindi - Bright)' },
      { id: 'Yashvi', gender: 'female', displayName: 'Yashvi (Hindi - Clear)' },
      { id: 'Deepak', gender: 'male', displayName: 'Deepak (Hindi - Authoritative)' },
      { id: 'Arjun', gender: 'male', displayName: 'Arjun (Hindi - Farmer Friendly)' },
    ],
  },
  'en-IN': {
    name: 'English (India)',
    nativeName: 'English',
    defaultVoice: 'Nalini',
    availableVoices: [
      { id: 'Nalini', gender: 'female', displayName: 'Nalini (Indian English)' },
      { id: 'Pranav', gender: 'male', displayName: 'Pranav (Indian English)' },
      { id: 'Kaveri', gender: 'female', displayName: 'Kaveri (Indian English - Fluent)' },
    ],
  },
  'mr-IN': {
    name: 'Marathi',
    nativeName: 'मराठी',
    defaultVoice: 'Asmita',
    availableVoices: [
      { id: 'Asmita', gender: 'female', displayName: 'Asmita (Marathi - Clear)' },
      { id: 'Nalini', gender: 'female', displayName: 'Nalini (Marathi - Secondary)' },
    ],
  },
  'ta-IN': {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    defaultVoice: 'Kaveri',
    availableVoices: [
      { id: 'Kaveri', gender: 'female', displayName: 'Kaveri (Tamil - Natural)' },
      { id: 'Lavanya', gender: 'female', displayName: 'Lavanya (Tamil - Clear)' },
    ],
  },
  'kn-IN': {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    defaultVoice: 'Kaveri',
    availableVoices: [
      { id: 'Kaveri', gender: 'female', displayName: 'Kaveri (Kannada - Formal)' },
      { id: 'Suhana', gender: 'female', displayName: 'Suhana (Kannada - Conversational)' },
    ],
  },
  'ml-IN': {
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    defaultVoice: 'Kaveri',
    availableVoices: [
      { id: 'Kaveri', gender: 'female', displayName: 'Kaveri (Malayalam - Standard)' },
    ],
  },
  'bn-IN': {
    name: 'Bengali',
    nativeName: 'বাংলা',
    defaultVoice: 'Nalini',
    availableVoices: [
      { id: 'Nalini', gender: 'female', displayName: 'Nalini (Bengali - Clear)' },
      { id: 'Bhavna', gender: 'female', displayName: 'Bhavna (Bengali - Fluent)' },
    ],
  },
  'gu-IN': {
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    defaultVoice: 'Nalini',
    availableVoices: [
      { id: 'Nalini', gender: 'female', displayName: 'Nalini (Gujarati - Standard)' },
      { id: 'Bhavna', gender: 'female', displayName: 'Bhavna (Gujarati - Warm)' },
    ],
  },
  'pa-IN': {
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    defaultVoice: 'Nalini',
    availableVoices: [
      { id: 'Nalini', gender: 'female', displayName: 'Nalini (Punjabi - Standard)' },
      { id: 'Arjun', gender: 'male', displayName: 'Arjun (Punjabi - Bold)' },
    ],
  },
};

// Simple LRU Audio Cache to save API credits and avoid repeating identical TTS calls
const audioCache = new Map<string, { buffer: ArrayBuffer; contentType: string; timestamp: number }>();
const MAX_CACHE_ITEMS = 60;

function getCacheKey(text: string, voice: string, language: string, speed: number): string {
  return `${language}_${voice}_${speed}_${text.trim()}`;
}

export function getBackendApiKey(): string {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.GNANI_API_KEY_ID?.trim()) {
      return process.env.GNANI_API_KEY_ID.trim();
    }
    if (process.env.GNANI_API_KEY?.trim()) {
      return process.env.GNANI_API_KEY.trim();
    }
  }
  return '';
}

export function getBackendBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env && process.env.GNANI_API_BASE_URL?.trim()) {
    return process.env.GNANI_API_BASE_URL.trim();
  }
  return 'https://api.vachana.ai';
}

export function isGnaniBackendConfigured(): boolean {
  const key = getBackendApiKey();
  return Boolean(key && key.length > 5 && !key.includes('your_gnani_api_key'));
}

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * 1. GNANI SPEECH-TO-TEXT (Prisma v2.5)
 * Endpoint: POST https://api.vachana.ai/stt/v3
 */
export async function gnaniSpeechToText(
  audioData: Blob | Buffer | ArrayBuffer,
  options: STTOptions
): Promise<STTResponse> {
  const startTime = Date.now();
  const apiKey = getBackendApiKey();
  const baseUrl = getBackendBaseUrl();
  const lang = (options.languageCode || 'te-IN').trim();
  const timeoutMs = options.timeoutMs || 25000;
  const maxRetries = options.maxRetries ?? 2;

  console.log(`[Gnani STT Backend] Request - Lang: ${lang}, Configured: ${isGnaniBackendConfigured()}`);

  if (!isGnaniBackendConfigured()) {
    return {
      success: false,
      transcript: '',
      language: lang,
      source: 'simulated-fallback',
      durationMs: Date.now() - startTime,
      error: 'GNANI_API_KEY_ID is not configured in backend environment.',
    };
  }

  let attempt = 0;
  let lastError = '';

  while (attempt <= maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const formData = new FormData();
      if (typeof Blob !== 'undefined' && audioData instanceof Blob) {
        formData.append('audio_file', audioData, 'recording.wav');
      } else if (audioData instanceof ArrayBuffer) {
        const blob = new Blob([audioData], { type: 'audio/wav' });
        formData.append('audio_file', blob, 'recording.wav');
      } else {
        const blob = new Blob([audioData as any], { type: 'audio/wav' });
        formData.append('audio_file', blob, 'recording.wav');
      }

      formData.append('language_code', lang);
      formData.append('model', 'prisma-v2.5');

      const response = await fetch(`${baseUrl}/stt/v3`, {
        method: 'POST',
        headers: {
          'X-API-Key-ID': apiKey,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.ok) {
        const json = (await response.json()) as any;
        const transcript =
          json.transcript ||
          json.text ||
          (json.results && json.results[0]?.transcript) ||
          (Array.isArray(json) && json[0]?.transcript) ||
          '';

        console.log(`[Gnani STT Backend] Success (${Date.now() - startTime}ms) - Length: ${transcript.length}`);

        return {
          success: true,
          transcript: transcript.trim(),
          language: json.language_code || lang,
          confidence: json.confidence || 0.96,
          source: 'gnani-api',
          durationMs: Date.now() - startTime,
        };
      }

      const status = response.status;
      lastError = `Gnani STT HTTP ${status}: ${response.statusText}`;
      console.warn(`[Gnani STT Backend] Attempt ${attempt} failed: ${lastError}`);

      if ((status === 429 || status >= 500) && attempt <= maxRetries) {
        const backoffDelay = Math.pow(2, attempt) * 1000;
        await wait(backoffDelay);
        continue;
      }
      break;
    } catch (err: any) {
      clearTimeout(timer);
      const isTimeout = err.name === 'AbortError';
      lastError = isTimeout ? `Request timed out after ${timeoutMs}ms` : (err.message || 'Network error');
      if (attempt <= maxRetries) {
        await wait(1500 * attempt);
        continue;
      }
    }
  }

  return {
    success: false,
    transcript: '',
    language: lang,
    source: 'gnani-api',
    durationMs: Date.now() - startTime,
    error: lastError,
  };
}

/**
 * 2. GNANI TEXT-TO-SPEECH (Timbre v2.5)
 * Endpoint: POST https://api.vachana.ai/api/v1/tts/inference
 */
export async function gnaniTextToSpeech(
  options: TTSOptions
): Promise<TTSResponse> {
  const startTime = Date.now();
  const apiKey = getBackendApiKey();
  const baseUrl = getBackendBaseUrl();
  const lang = (options.language || 'te-IN') as SupportedGnaniLanguage;
  const catalogEntry = GNANI_VOICE_CATALOGUE[lang] || GNANI_VOICE_CATALOGUE['te-IN'];
  const voice = options.voice || catalogEntry.defaultVoice;
  const speed = options.speed ?? 1.0;
  const timeoutMs = options.timeoutMs || 25000;
  const maxRetries = options.maxRetries ?? 2;
  const sampleRate = options.sampleRate || 22050;

  // Check cache first
  const cacheKey = getCacheKey(options.text, voice, lang, speed);
  const cached = audioCache.get(cacheKey);
  if (cached) {
    console.log(`[Gnani TTS Backend] Cache HIT for key: ${cacheKey.slice(0, 40)}...`);
    return {
      success: true,
      audioBuffer: cached.buffer,
      contentType: cached.contentType,
      source: 'cache',
      durationMs: Date.now() - startTime,
    };
  }

  console.log(`[Gnani TTS Backend] Request - Voice: ${voice}, Lang: ${lang}, Length: ${options.text.length}`);

  if (!isGnaniBackendConfigured()) {
    return {
      success: false,
      source: 'simulated-fallback',
      durationMs: Date.now() - startTime,
      error: 'GNANI_API_KEY_ID is not configured in backend environment.',
    };
  }

  let attempt = 0;
  let lastError = '';

  while (attempt <= maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const payload = {
        text: options.text,
        model: 'timbre-v2.5',
        language: lang,
        voice: voice,
        speed: speed,
        audio_config: {
          sample_rate: sampleRate,
          encoding: 'linear_pcm',
          container: 'wav',
        },
      };

      const response = await fetch(`${baseUrl}/api/v1/tts/inference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key-ID': apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'audio/wav';

        // Store in cache
        if (audioCache.size >= MAX_CACHE_ITEMS) {
          const oldestKey = audioCache.keys().next().value;
          if (oldestKey) audioCache.delete(oldestKey);
        }
        audioCache.set(cacheKey, {
          buffer: audioBuffer,
          contentType,
          timestamp: Date.now(),
        });

        console.log(`[Gnani TTS Backend] Success (${Date.now() - startTime}ms) - Received ${audioBuffer.byteLength} bytes`);

        return {
          success: true,
          audioBuffer,
          contentType,
          source: 'gnani-api',
          durationMs: Date.now() - startTime,
        };
      }

      const status = response.status;
      lastError = `Gnani TTS HTTP ${status}: ${response.statusText}`;
      console.warn(`[Gnani TTS Backend] Attempt ${attempt} failed: ${lastError}`);

      if ((status === 429 || status >= 500) && attempt <= maxRetries) {
        const backoffDelay = Math.pow(2, attempt) * 1000;
        await wait(backoffDelay);
        continue;
      }

      break;
    } catch (err: any) {
      clearTimeout(timer);
      const isTimeout = err.name === 'AbortError';
      lastError = isTimeout ? `Request timed out after ${timeoutMs}ms` : (err.message || 'Network error');

      if (attempt <= maxRetries) {
        await wait(1500 * attempt);
        continue;
      }
    }
  }

  return {
    success: false,
    source: 'gnani-api',
    durationMs: Date.now() - startTime,
    error: lastError,
  };
}
