// ============================================
// CropShield AI – Shared Multilingual Voice Assistant Component
// ============================================
// Unified voice interface accessible from BOTH:
// 1. Farmer Dashboard (/farmer)
// 2. Crop Health Scan (/farmer/detect)
//
// Features:
// - Direct MediaRecorder audio recording -> CropShield backend -> Gnani Prisma v2.5 STT
// - 10 Explicitly configured BCP-47 Indic languages:
//   en-IN, te-IN, hi-IN, mr-IN, ta-IN, kn-IN, ml-IN, bn-IN, gu-IN, pa-IN
// - Audio waveform visualizer using Web Audio AnalyserNode
// - Recording timer with 30s recommended / 60s hard limit
// - Understandable states: Ready | Listening | Processing | Transcribed | Error
// - Editable transcript preview before submission
// - Submit, Cancel, and Replay spoken audio controls
// - Fallback text input for farmers in quiet/noisy environments
// - Responsive desktop and mobile drawer/modal
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Volume2, Sparkles, X, ChevronRight,
  ShieldCheck, RefreshCw, AlertCircle, ArrowUpRight,
  Send, RotateCcw, Keyboard, Edit3, Check, CornerDownLeft
} from 'lucide-react';
import { gnaniVoiceService, GNANI_LANG_MAP } from '../../services/gnaniService';
import { processVoiceIntent, type VoiceIntentResult } from '../../services/assistantEngine';
import './VoiceAssistant.css';

// 10 Explicitly Supported Languages with BCP-47 codes
export interface LanguageOption {
  code: string;       // BCP-47 tag for Gnani API
  key: string;        // Short key
  name: string;       // English display
  nativeName: string; // Native script
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en-IN', key: 'en', name: 'English', nativeName: 'English' },
  { code: 'te-IN', key: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi-IN', key: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr-IN', key: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta-IN', key: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn-IN', key: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml-IN', key: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn-IN', key: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu-IN', key: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa-IN', key: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export type AssistantState = 'Ready' | 'Listening' | 'Processing' | 'Transcribed' | 'Error';

interface VoiceAssistantProps {
  contextSource?: 'dashboard' | 'detect';
  autoOpen?: boolean;
}

export function VoiceAssistant({ contextSource = 'dashboard', autoOpen = false }: VoiceAssistantProps) {
  const navigate = useNavigate();

  // Dialog & state
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [assistantState, setAssistantState] = useState<AssistantState>('Ready');
  const [selectedLang, setSelectedLang] = useState<string>('te-IN'); // Default Telugu for Indian farmers
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Transcript & Edit
  const [transcript, setTranscript] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [textInputFallback, setTextInputFallback] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  // Output response & Audio
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastResponse, setLastResponse] = useState<VoiceIntentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio recording & visualizer refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Web Audio waveform refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cleanup on unmount or drawer close
  const cleanupRecording = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupRecording();
      gnaniVoiceService.stopSpeaking();
    };
  }, [cleanupRecording]);

  // Waveform Drawer
  const drawWaveform = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 28;
      const step = Math.floor(bufferLength / barCount);
      const barWidth = 3;
      const gap = (canvas.width - barCount * barWidth) / (barCount - 1);

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i * step] || 0;
        const percent = val / 255;
        const barHeight = Math.max(4, percent * canvas.height * 0.9);
        const x = i * (barWidth + gap);
        const y = (canvas.height - barHeight) / 2;

        // Gradient coloring: Green -> Emerald
        ctx.fillStyle = percent > 0.4 ? '#10b981' : '#34d399';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    render();
  }, []);

  // START RECORDING
  const startRecording = async () => {
    setErrorMessage(null);
    gnaniVoiceService.stopSpeaking();
    setIsSpeaking(false);
    setTranscript('');
    setIsEditingTranscript(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // Setup Web Audio Analyser
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const sourceNode = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      sourceNode.connect(analyser);
      analyserRef.current = analyser;

      // Start drawing waveform
      drawWaveform();

      // Setup MediaRecorder
      const options = MediaRecorder.isTypeSupported('audio/webm')
        ? { mimeType: 'audio/webm' }
        : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        cleanupRecording();
        const rawBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/wav' });

        if (rawBlob.size < 500) {
          setAssistantState('Error');
          setErrorMessage('Recording was too short or silent. Please tap the microphone and speak clearly.');
          return;
        }

        // Send to Gnani STT Backend
        await processAudioWithGnani(rawBlob);
      };

      mediaRecorder.start(250); // Slice data every 250ms
      setAssistantState('Listening');

      // Recording timer (recommended <= 30s, max 60s)
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 59) {
            // Auto stop at 60s limit
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setAssistantState('Error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser settings.');
      } else {
        setErrorMessage('Could not access microphone. Please check your audio input device.');
      }
    }
  };

  // STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // CANCEL CURRENT RECORDING / INPUT
  const cancelRecording = () => {
    cleanupRecording();
    gnaniVoiceService.stopSpeaking();
    setIsSpeaking(false);
    setTranscript('');
    setIsEditingTranscript(false);
    setErrorMessage(null);
    setAssistantState('Ready');
  };

  // Process recorded audio through CropShield Backend -> Gnani Prisma v2.5
  const processAudioWithGnani = async (audioBlob: Blob) => {
    setAssistantState('Processing');
    setErrorMessage(null);

    // Map BCP-47 tag to language key used in assistant
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

    try {
      const response = await fetch('/api/gnani/stt', {
        method: 'POST',
        headers: {
          'Content-Type': audioBlob.type || 'audio/wav',
          'X-Language-Code': selectedLang,
        },
        body: audioBlob,
      });

      if (response.ok) {
        const data = await response.json();
        const recognized = (data.transcript || '').trim();

        if (recognized) {
          setTranscript(recognized);
          setAssistantState('Transcribed');
        } else {
          setAssistantState('Error');
          setErrorMessage('The recording was unclear or no words were recognized. Please speak closer to the microphone and try again.');
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        setAssistantState('Error');
        setErrorMessage(errJson.error || 'Speech-to-text service error. Please try again or use text input.');
      }
    } catch (err) {
      console.error('STT Request Error:', err);
      setAssistantState('Error');
      setErrorMessage('Network error connecting to voice service. Please check your connection or type your question below.');
    }
  };

  // SUBMIT TRANSCRIPT (Mode A Command or Mode B Question)
  const submitQuery = async (queryText?: string) => {
    const textToSubmit = (queryText || transcript).trim();
    if (!textToSubmit) return;

    setAssistantState('Processing');
    setErrorMessage(null);

    // Map BCP-47 code to short locale key for assistant engine
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

    try {
      const response = await processVoiceIntent(textToSubmit, null, selectedLang);
      setLastResponse(response);
      setAssistantState('Ready');

      // Speak response using Backend Gnani Timbre v2.5 TTS
      await gnaniVoiceService.speakText(
        response.speechText,
        selectedLang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );

      // Execute auto-navigation action if present
      if (response.action && response.action.type === 'NAVIGATE' && response.action.path) {
        const path = response.action.path;
        setTimeout(() => {
          navigate(path);
        }, 1300);
      }
    } catch (err: any) {
      console.error('Assistant Engine Error:', err);
      setAssistantState('Error');
      setErrorMessage('Failed to process your request. Please try again.');
    }
  };

  // REPLAY SPOKEN RESPONSE
  const replayAudio = () => {
    if (!lastResponse) return;
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
    gnaniVoiceService.speakText(
      lastResponse.speechText,
      langObj.key,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // STOP SPOKEN AUDIO
  const stopAudio = () => {
    gnaniVoiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  // Format MM:SS for timer
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Context-specific quick prompts
  const quickPrompts = contextSource === 'detect'
    ? [
        { label: 'What should I inspect in my tomato plants?', query: 'What should I inspect in my tomato plants?' },
        { label: 'What is causing whitefly infestation?', query: 'What is causing whitefly infestation?' },
        { label: 'Open Crop Health Scan', query: 'Open Crop Health Scan' },
        { label: 'Check my area\'s risk', query: 'Check my area\'s risk' },
      ]
    : [
        { label: 'Open Crop Health Scan', query: 'Open Crop Health Scan' },
        { label: 'Why is my crop at high risk?', query: 'Why is my crop at high risk?' },
        { label: 'Read my alerts', query: 'Read my alerts' },
        { label: 'Show my latest reports', query: 'Show my latest reports' },
        { label: 'Show my follow-up status', query: 'Show my follow-up status' },
      ];

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      {/* 1. FLOATING ACTION ORB BUTTON (Accessible on both Dashboard and Crop Scan) */}
      {!isOpen && (
        <button
          type="button"
          className="voice-assistant-fab"
          onClick={() => setIsOpen(true)}
          title="Open gnan-cropShield Multilingual Voice Assistant"
          aria-label="Open gnan-cropShield Multilingual Voice Assistant"
        >
          <div className="voice-assistant-fab__pulse" />
          <div className="voice-assistant-fab__icon">
            <Mic size={22} />
          </div>
          <span className="voice-assistant-fab__label">
            gnan-cropShield Voice
          </span>
          <span className="voice-assistant-fab__badge">
            Gnani AI
          </span>
        </button>
      )}

      {/* 2. SHARED VOICE ASSISTANT MODAL / DRAWER */}
      {isOpen && (
        <div className="voice-assistant-drawer" role="dialog" aria-modal="true">
          {/* Header */}
          <div className="voice-assistant-drawer__header">
            <div className="voice-assistant-drawer__title-wrap">
              <div className="voice-assistant-drawer__sparkle">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="voice-assistant-drawer__title">gnan-cropShield Voice Assistant</h3>
                <p className="voice-assistant-drawer__sub">
                  Powered by Gnani Prisma & Timbre • {currentLangObj.name} ({currentLangObj.code})
                </p>
              </div>
            </div>

            <div className="voice-assistant-drawer__actions">
              {/* Explicit BCP-47 Language Selector */}
              <select
                className="voice-assistant-drawer__lang-select notranslate"
                value={selectedLang}
                onChange={(e) => {
                  setSelectedLang(e.target.value);
                  cancelRecording();
                }}
                title="Select Spoken Language"
                aria-label="Select Spoken Language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="voice-assistant-drawer__close"
                onClick={() => {
                  cleanupRecording();
                  gnaniVoiceService.stopSpeaking();
                  setIsOpen(false);
                }}
                aria-label="Close Assistant"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="voice-assistant-drawer__body">
            {/* Live Status Indicator Bar */}
            <div className="voice-assistant-status-bar">
              <div className={`status-badge status-badge--${assistantState.toLowerCase()}`}>
                <span className="status-badge__dot" />
                <span className="status-badge__label">Status: {assistantState}</span>
              </div>

              {assistantState === 'Listening' && (
                <div className="timer-badge">
                  <span>⏱ {formatTimer(recordingSeconds)} / 00:30</span>
                </div>
              )}

              {isSpeaking && (
                <button
                  type="button"
                  className="voice-assistant-stop-audio-btn"
                  onClick={stopAudio}
                >
                  <Volume2 size={13} className="pulse" /> Stop Voice
                </button>
              )}
            </div>

            {/* Error Banner with helpful farmer guidance */}
            {errorMessage && (
              <div className="voice-assistant-error">
                <AlertCircle size={16} />
                <div className="voice-assistant-error__content">
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* LIVE AUDIO WAVEFORM (visible when listening) */}
            <div className={`voice-assistant-waveform-wrap ${assistantState === 'Listening' ? 'voice-assistant-waveform-wrap--active' : ''}`}>
              <canvas
                ref={canvasRef}
                className="voice-assistant-waveform"
                width={360}
                height={54}
              />
              {assistantState === 'Listening' && (
                <p className="waveform-caption">
                  Listening in <strong>{currentLangObj.nativeName}</strong>... Speak your command or crop query.
                </p>
              )}
            </div>

            {/* TRANSCRIPT PREVIEW & EDIT (Transcribed State) */}
            {assistantState === 'Transcribed' && (
              <div className="voice-assistant-transcript-box">
                <div className="voice-assistant-transcript-header">
                  <span className="transcript-label">Recognized Speech (Gnani Prisma):</span>
                  <button
                    type="button"
                    className="transcript-edit-toggle"
                    onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                  >
                    <Edit3 size={13} /> {isEditingTranscript ? 'Done Editing' : 'Edit Text'}
                  </button>
                </div>

                {isEditingTranscript ? (
                  <textarea
                    className="transcript-textarea"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows={3}
                    placeholder="Edit your query here..."
                  />
                ) : (
                  <p className="transcript-display-text">"{transcript}"</p>
                )}

                {/* Submit & Cancel Actions */}
                <div className="transcript-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={cancelRecording}
                  >
                    <RotateCcw size={14} /> Cancel / Re-record
                  </button>

                  <button
                    type="button"
                    className="btn-submit"
                    onClick={() => submitQuery()}
                  >
                    <Send size={14} /> Submit Query
                  </button>
                </div>
              </div>
            )}

            {/* PROCESSING INDICATOR */}
            {assistantState === 'Processing' && (
              <div className="voice-assistant-processing-card">
                <RefreshCw size={22} className="spin" />
                <p>Analyzing query with gnan-cropShield & Gnani AI engine...</p>
              </div>
            )}

            {/* ASSISTANT RESPONSE CARD */}
            {lastResponse && assistantState === 'Ready' && (
              <div className="voice-assistant-response">
                <div className="voice-assistant-response__header">
                  <span className={`response-mode-badge response-mode-badge--${lastResponse.mode}`}>
                    {lastResponse.mode === 'command' ? '⚡ MODE A: VOICE COMMAND' : '💬 MODE B: CONVERSATION'}
                  </span>
                  {lastResponse.details?.badge && (
                    <span className="response-tag-badge">
                      {lastResponse.details.badge}
                    </span>
                  )}
                </div>

                <p className="voice-assistant-response__text">
                  {lastResponse.displayText}
                </p>

                {/* Structured Breakdown Items */}
                {lastResponse.details?.items && lastResponse.details.items.length > 0 && (
                  <div className="voice-assistant-response__breakdown">
                    {lastResponse.details.title && (
                      <div className="breakdown-title">
                        {lastResponse.details.title}
                      </div>
                    )}
                    <ul className="breakdown-list">
                      {lastResponse.details.items.map((item: string, idx: number) => (
                        <li key={idx}>
                          <ChevronRight size={13} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Response Action & Replay Buttons */}
                <div className="voice-assistant-response__footer">
                  <button
                    type="button"
                    className="voice-assistant-replay-btn"
                    onClick={replayAudio}
                    title="Hear Gnani Timbre Audio"
                  >
                    <Volume2 size={14} /> Replay Spoken Audio
                  </button>

                  {lastResponse.action?.path && (
                    <button
                      type="button"
                      className="voice-assistant-action-btn"
                      onClick={() => navigate(lastResponse.action!.path!)}
                    >
                      Open Page <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* FALLBACK TEXT INPUT TOGGLE */}
            <div className="voice-assistant-text-fallback">
              <button
                type="button"
                className="text-fallback-toggle"
                onClick={() => setShowTextInput(!showTextInput)}
              >
                <Keyboard size={14} />
                <span>{showTextInput ? 'Hide Text Input' : 'Type Question Instead (Text Fallback)'}</span>
              </button>

              {showTextInput && (
                <div className="text-fallback-form">
                  <input
                    type="text"
                    className="text-fallback-input"
                    value={textInputFallback}
                    onChange={(e) => setTextInputFallback(e.target.value)}
                    placeholder="e.g. Why is my crop at high risk? / Read my alerts"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitQuery(textInputFallback);
                        setTextInputFallback('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="text-fallback-submit"
                    onClick={() => {
                      submitQuery(textInputFallback);
                      setTextInputFallback('');
                    }}
                  >
                    <CornerDownLeft size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* QUICK PROMPT CHIPS */}
            <div className="voice-assistant-suggestions">
              <div className="voice-assistant-suggestions__title">
                Suggested Prompts ({contextSource === 'detect' ? 'Crop Scan Mode' : 'Dashboard Mode'}):
              </div>
              <div className="voice-assistant-suggestions__grid">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="voice-assistant-chip"
                    onClick={() => submitQuery(p.query)}
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN RECORD / MIC CONTROLLER FOOTER */}
          <div className="voice-assistant-drawer__footer">
            <div className="mic-controller-wrap">
              {assistantState === 'Listening' ? (
                <button
                  type="button"
                  className="voice-assistant-mic-btn voice-assistant-mic-btn--recording"
                  onClick={stopRecording}
                  aria-label="Stop recording"
                >
                  <MicOff size={30} />
                  <div className="voice-assistant-mic-btn__ring" />
                </button>
              ) : (
                <button
                  type="button"
                  className="voice-assistant-mic-btn voice-assistant-mic-btn--ready"
                  onClick={startRecording}
                  disabled={assistantState === 'Processing'}
                  aria-label="Start recording"
                >
                  <Mic size={30} />
                </button>
              )}
            </div>

            <div className="mic-caption-wrap">
              {assistantState === 'Listening' ? (
                <span className="mic-caption mic-caption--recording">
                  Recording active... Tap microphone to finish & transcribe
                </span>
              ) : assistantState === 'Processing' ? (
                <span className="mic-caption">Transcribing via Gnani Prisma...</span>
              ) : (
                <span className="mic-caption">
                  Tap microphone to speak in <strong>{currentLangObj.nativeName}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
