// ============================================
// CropShield AI – Gnani Timbre Audio Player Widget
// ============================================
// Reusable inline audio controller with:
// - Play / Pause / Resume
// - Replay
// - Stop
// - Voice selector (official Gnani Timbre v2.5 voices)
// - Language selector (10 Indic languages)
// - Graceful error handling (keeps text visible)
// - User-initiated only (never autoplays)
// ============================================

import { useState, useEffect, useRef } from 'react';
import {
  Volume2, VolumeX, Play, Pause, RotateCcw,
  Square, ChevronDown, Sparkles
} from 'lucide-react';
import { gnaniVoiceService, GNANI_LANG_MAP } from '../../../services/gnaniService';
import { SUPPORTED_LANGUAGES, type LanguageOption } from '../../voice/VoiceAssistant';
import './GnaniAudioPlayer.css';

interface GnaniAudioPlayerProps {
  text: string;
  defaultLang?: string; // BCP-47 e.g. 'te-IN'
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showVoiceSelector?: boolean;
}

// Available voices per language from the official Gnani Timbre v2.5 catalog
const TIMBRE_VOICE_OPTIONS: Record<string, { id: string; label: string }[]> = {
  'te-IN': [
    { id: 'Suhana', label: 'Suhana (Telugu - Clear)' },
    { id: 'Lehara', label: 'Lehara (Telugu - Soft)' },
    { id: 'Lavanya', label: 'Lavanya (Telugu - Expressive)' },
    { id: 'Yukti', label: 'Yukti (Telugu - Natural)' },
    { id: 'Varuni', label: 'Varuni (Telugu - Formal)' },
    { id: 'Kaveri', label: 'Kaveri (Telugu - Standard)' },
  ],
  'hi-IN': [
    { id: 'Nalini', label: 'Nalini (Hindi - Warm)' },
    { id: 'Bhavna', label: 'Bhavna (Hindi - Bright)' },
    { id: 'Yashvi', label: 'Yashvi (Hindi - Clear)' },
    { id: 'Deepak', label: 'Deepak (Hindi - Authoritative)' },
    { id: 'Arjun', label: 'Arjun (Hindi - Friendly)' },
  ],
  'en-IN': [
    { id: 'Nalini', label: 'Nalini (Indian English)' },
    { id: 'Pranav', label: 'Pranav (Indian English - Male)' },
    { id: 'Kaveri', label: 'Kaveri (Indian English - Fluent)' },
  ],
  'mr-IN': [
    { id: 'Asmita', label: 'Asmita (Marathi - Clear)' },
    { id: 'Nalini', label: 'Nalini (Marathi - Secondary)' },
  ],
  'ta-IN': [
    { id: 'Kaveri', label: 'Kaveri (Tamil - Natural)' },
    { id: 'Lavanya', label: 'Lavanya (Tamil - Clear)' },
  ],
  'kn-IN': [
    { id: 'Kaveri', label: 'Kaveri (Kannada - Formal)' },
    { id: 'Suhana', label: 'Suhana (Kannada - Natural)' },
  ],
  'ml-IN': [
    { id: 'Kaveri', label: 'Kaveri (Malayalam - Standard)' },
  ],
  'bn-IN': [
    { id: 'Nalini', label: 'Nalini (Bengali - Clear)' },
    { id: 'Bhavna', label: 'Bhavna (Bengali - Fluent)' },
  ],
  'gu-IN': [
    { id: 'Nalini', label: 'Nalini (Gujarati - Standard)' },
    { id: 'Bhavna', label: 'Bhavna (Gujarati - Warm)' },
  ],
  'pa-IN': [
    { id: 'Nalini', label: 'Nalini (Punjabi - Standard)' },
    { id: 'Arjun', label: 'Arjun (Punjabi - Bold)' },
  ],
};

export function GnaniAudioPlayer({
  text,
  defaultLang = 'te-IN',
  label = 'Listen',
  size = 'md',
  showVoiceSelector = true,
}: GnaniAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLang, setCurrentLang] = useState(defaultLang);
  const [selectedVoice, setSelectedVoice] = useState(
    TIMBRE_VOICE_OPTIONS[defaultLang]?.[0]?.id || 'Suhana'
  );
  const [showSettings, setShowSettings] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Sync with language prop changes
  useEffect(() => {
    setCurrentLang(defaultLang);
    const voices = TIMBRE_VOICE_OPTIONS[defaultLang] || TIMBRE_VOICE_OPTIONS['te-IN'];
    setSelectedVoice(voices[0]?.id || 'Suhana');
  }, [defaultLang]);

  // Handle Play / Resume
  const handlePlay = async () => {
    setErrorNotice(null);

    if (isPaused) {
      gnaniVoiceService.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    try {
      await gnaniVoiceService.speakText(
        text,
        currentLang,
        () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
        selectedVoice
      );
    } catch {
      setErrorNotice('Spoken audio unavailable; text is displayed above.');
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  // Handle Pause
  const handlePause = () => {
    gnaniVoiceService.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  // Handle Stop
  const handleStop = () => {
    gnaniVoiceService.stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Handle Replay
  const handleReplay = async () => {
    handleStop();
    setTimeout(() => {
      handlePlay();
    }, 150);
  };

  // Language change
  const handleLanguageChange = (langCode: string) => {
    handleStop();
    setCurrentLang(langCode);
    const voices = TIMBRE_VOICE_OPTIONS[langCode] || TIMBRE_VOICE_OPTIONS['te-IN'];
    setSelectedVoice(voices[0]?.id || 'Suhana');
  };

  // Voice change
  const handleVoiceChange = (voiceId: string) => {
    handleStop();
    setSelectedVoice(voiceId);
    gnaniVoiceService.setPreferredVoice(currentLang, voiceId);
  };

  const availableVoices = TIMBRE_VOICE_OPTIONS[currentLang] || TIMBRE_VOICE_OPTIONS['te-IN'];

  return (
    <div className={`gnani-player gnani-player--${size}`}>
      <div className="gnani-player__controls">
        {/* Play / Pause Toggle */}
        {!isPlaying ? (
          <button
            type="button"
            className="gnani-player__btn gnani-player__btn--play"
            onClick={handlePlay}
            title={`${label} via Gnani Timbre (${selectedVoice})`}
            aria-label={`${label} via Gnani Timbre`}
          >
            <Play size={size === 'sm' ? 12 : 14} fill="currentColor" />
            <span>{isPaused ? 'Resume' : label}</span>
          </button>
        ) : (
          <button
            type="button"
            className="gnani-player__btn gnani-player__btn--pause"
            onClick={handlePause}
            title="Pause audio"
            aria-label="Pause audio"
          >
            <Pause size={size === 'sm' ? 12 : 14} fill="currentColor" />
            <span>Pause</span>
          </button>
        )}

        {/* Replay */}
        {(isPlaying || isPaused) && (
          <button
            type="button"
            className="gnani-player__btn gnani-player__btn--secondary"
            onClick={handleReplay}
            title="Replay from beginning"
            aria-label="Replay from beginning"
          >
            <RotateCcw size={size === 'sm' ? 12 : 14} />
          </button>
        )}

        {/* Stop */}
        {(isPlaying || isPaused) && (
          <button
            type="button"
            className="gnani-player__btn gnani-player__btn--secondary"
            onClick={handleStop}
            title="Stop audio"
            aria-label="Stop audio"
          >
            <Square size={size === 'sm' ? 12 : 14} fill="currentColor" />
          </button>
        )}

        {/* Voice & Lang Settings Toggle */}
        {showVoiceSelector && (
          <button
            type="button"
            className={`gnani-player__settings-btn ${showSettings ? 'gnani-player__settings-btn--active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Change voice or language"
          >
            <Sparkles size={13} />
            <span className="gnani-player__voice-label">{selectedVoice}</span>
            <ChevronDown size={12} className={showSettings ? 'rotate-180' : ''} />
          </button>
        )}
      </div>

      {/* Voice & Language Dropdown Tray */}
      {showSettings && (
        <div className="gnani-player__tray">
          <div className="gnani-player__tray-group">
            <label className="gnani-player__tray-label">Language:</label>
            <select
              className="gnani-player__select"
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang: LanguageOption) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <div className="gnani-player__tray-group">
            <label className="gnani-player__tray-label">Gnani Timbre Voice:</label>
            <select
              className="gnani-player__select"
              value={selectedVoice}
              onChange={(e) => handleVoiceChange(e.target.value)}
            >
              {availableVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error / Fallback Notice */}
      {errorNotice && (
        <div className="gnani-player__error">
          <VolumeX size={12} />
          <span>{errorNotice}</span>
        </div>
      )}
    </div>
  );
}
