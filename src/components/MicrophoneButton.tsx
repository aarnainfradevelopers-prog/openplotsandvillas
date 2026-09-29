import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  AlertCircle,
  X,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Volume2,
  Sparkles,
  Lock,
  Radio,
  Play
} from 'lucide-react';
import { OPV_LANGUAGES } from '../data/opvKnowledge';
import { LanguageCode } from '../types/chat';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface MicrophoneButtonProps {
  currentLanguage: LanguageCode;
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  currentLanguage,
  onTranscript,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [hasAudioDevice, setHasAudioDevice] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'browser' | 'windows' | 'test'>('browser');

  // Live Sound Decibel Test State
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [soundDetected, setSoundDetected] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const errorTimerRef = useRef<any>(null);
  const lastSpokenTextRef = useRef('');
  const committedTextRef = useRef('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const selectedLang = OPV_LANGUAGES.find(l => l.code === currentLanguage) || OPV_LANGUAGES[0];

  const triggerError = useCallback((msg: string, autoDismissMs: number = 8000) => {
    setErrorMessage(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    if (autoDismissMs > 0) {
      errorTimerRef.current = setTimeout(() => {
        setErrorMessage(null);
      }, autoDismissMs);
    }
  }, []);

  // Check speech recognition support and microphone permission status
  const checkPermissionsAndDevices = useCallback(async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    // Check navigator permission for microphone if supported
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionState(status.state as 'prompt' | 'granted' | 'denied');

        status.onchange = () => {
          setPermissionState(status.state as 'prompt' | 'granted' | 'denied');
          if (status.state === 'granted') {
            setErrorMessage(null);
          }
        };
      } catch {
        setPermissionState('unknown');
      }
    }

    // Check if any audio input device (physical mic) exists
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        setHasAudioDevice(audioInputs.length > 0);
      } catch {
        setHasAudioDevice(null);
      }
    }
  }, []);

  useEffect(() => {
    checkPermissionsAndDevices();
  }, [checkPermissionsAndDevices]);

  // Clean up any active recognition or audio contexts on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (_) {}
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // Stop listening cleanly and commit any pending speech
  const stopListening = useCallback(() => {
    // If there was uncommitted interim speech, commit it before stopping
    if (lastSpokenTextRef.current && lastSpokenTextRef.current !== committedTextRef.current) {
      onTranscript(lastSpokenTextRef.current);
      committedTextRef.current = lastSpokenTextRef.current;
      lastSpokenTextRef.current = '';
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimText('');
  }, [onTranscript]);

  // Start listening with fresh SpeechRecognition instance
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setShowHelpModal(true);
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    setErrorMessage(null);
    setInterimText('');
    lastSpokenTextRef.current = '';
    committedTextRef.current = '';

    try {
      const recognition = new SpeechRecognition();
      // continuous = false ensures browser reliably finalizes sentences when user pauses
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // For English in India, en-IN is much more accurate for Indian accent
      let langCode = selectedLang.speechCode;
      if (selectedLang.code === 'en') {
        langCode = 'en-IN';
      }
      recognition.lang = langCode;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalPiece = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            finalPiece += (finalPiece ? ' ' : '') + text.trim();
          } else {
            interim += text;
          }
        }

        if (finalPiece) {
          onTranscript(finalPiece);
          committedTextRef.current = finalPiece;
          lastSpokenTextRef.current = '';
        } else if (interim.trim()) {
          lastSpokenTextRef.current = interim.trim();
        }

        setInterimText(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        const err = event.error;

        if (err === 'not-allowed' || err === 'permission-denied') {
          setPermissionState('denied');
          triggerError(
            'Microphone permission blocked or not applied. Click "Fix / Reload" to allow.',
            12000
          );
        } else if (err === 'audio-capture') {
          triggerError('No microphone detected. Please plug in a microphone or headset.', 8000);
        } else if (err === 'network') {
          triggerError('Speech service network error. Check your internet connection or try prompts below.', 8000);
        } else if (err === 'no-speech') {
          // If no speech was heard at all
          if (!lastSpokenTextRef.current) {
            triggerError('No speech detected. Tap mic again and speak clearly.', 4000);
          }
        } else if (err === 'aborted') {
          // Normal user abort
        } else {
          triggerError(`Voice notice: ${err}`);
        }

        // Commit any speech received before the error
        if (lastSpokenTextRef.current && lastSpokenTextRef.current !== committedTextRef.current) {
          onTranscript(lastSpokenTextRef.current);
          committedTextRef.current = lastSpokenTextRef.current;
          lastSpokenTextRef.current = '';
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        // Guarantee no spoken text is dropped if onend fired before isFinal
        if (lastSpokenTextRef.current && lastSpokenTextRef.current !== committedTextRef.current) {
          onTranscript(lastSpokenTextRef.current);
          committedTextRef.current = lastSpokenTextRef.current;
          lastSpokenTextRef.current = '';
        }
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start SpeechRecognition:', err);
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
        triggerError('Microphone blocked. Click "How to fix" to allow and reload page.');
      } else {
        triggerError('Could not start microphone. Click "How to fix" for solutions.');
      }
      setIsListening(false);
    }
  }, [selectedLang.speechCode, selectedLang.code, onTranscript, triggerError]);

  const toggleListening = () => {
    if (disabled) return;

    if (!isSupported) {
      setShowHelpModal(true);
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Real-time Sound Decibel / Volume Test using Web Audio API
  const startAudioTest = async () => {
    // Stop any existing test
    stopAudioTest();

    setIsTestingAudio(true);
    setAudioVolume(0);
    setSoundDetected(false);
    setTestResult(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let heardSound = false;

      const checkVolume = () => {
        if (!audioStreamRef.current) return;

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(Math.round((avg / 128) * 100), 100);
        setAudioVolume(normalized);

        if (normalized > 10) {
          heardSound = true;
          setSoundDetected(true);
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
      setPermissionState('granted');
      setTestResult('Microphone connected! Speak into your mic to test the green volume bar.');

      // Automatically stop test after 10 seconds
      setTimeout(() => {
        if (heardSound) {
          setTestResult('Success! Sound was detected from your microphone.');
        } else {
          setTestResult(
            'Microphone access is allowed, but input volume remained 0. Check your physical mic switch or Windows volume.'
          );
        }
        stopAudioTest();
      }, 10000);
    } catch (err: any) {
      console.warn('Audio test failed:', err);
      setIsTestingAudio(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setTestResult('Permission Denied: Browser blocked microphone. Please follow Step 1 below and reload.');
      } else if (err.name === 'NotFoundError') {
        setTestResult('No physical microphone hardware detected on your computer.');
      } else {
        setTestResult(`Error: ${err.message || err.name}`);
      }
    }
  };

  const stopAudioTest = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(t => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
    setIsTestingAudio(false);
  };

  const handleSelectQuickPrompt = (prompt: string) => {
    onTranscript(prompt);
    setShowHelpModal(false);
  };

  return (
    <>
      <div className="relative inline-flex items-center">
        {/* Main Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={disabled}
          aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
          title={
            isListening
              ? `Listening in ${selectedLang.label}... Click to finish`
              : `Click to Speak in ${selectedLang.label}`
          }
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] scale-105'
              : permissionState === 'denied'
              ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300'
              : 'text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/90 border border-slate-300/80 shadow-2xs'
          }`}
        >
          {isListening && (
            <>
              <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping" />
              <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-pulse" />
            </>
          )}

          {isListening ? (
            <MicOff className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          ) : (
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          )}

          {/* Blocked indicator badge */}
          {permissionState === 'denied' && !isListening && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white"
              title="Microphone blocked. Click to unblock."
            />
          )}
        </button>

        {/* Live Speech Recognition Floating Banner with Animated Soundwave */}
        {isListening && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3.5 py-2 bg-slate-950 text-white text-xs rounded-2xl shadow-2xl flex items-center gap-2.5 whitespace-nowrap z-50 border border-slate-800 animate-in fade-in duration-150">
            <span className="flex items-center gap-0.5 h-3.5 shrink-0">
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" />
              <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-bounce delay-75" />
              <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce delay-150" />
              <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce delay-100" />
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-rose-300">
                Listening ({selectedLang.label})... Speak now
              </span>
              {interimText ? (
                <span className="text-[10px] text-white font-medium max-w-[220px] truncate italic">
                  "{interimText}"
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Speak your question clearly</span>
              )}
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="px-2 py-0.5 bg-rose-900/90 hover:bg-rose-800 text-white text-[10px] font-bold rounded-lg ml-1 cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* Floating Error Toast with 1-click Reload and Fix */}
        {errorMessage && !isListening && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3 py-2 bg-rose-950 text-white text-xs rounded-xl shadow-2xl flex items-center gap-2 z-50 whitespace-nowrap border border-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="text-[11px] font-medium max-w-[240px] sm:max-w-xs truncate">
              {errorMessage}
            </span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-2 py-0.5 rounded bg-rose-800 hover:bg-rose-700 text-white text-[10px] font-bold shrink-0 cursor-pointer flex items-center gap-1"
              title="Reload page to apply permission changes"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Reload
            </button>
            <button
              type="button"
              onClick={() => {
                setShowHelpModal(true);
                setErrorMessage(null);
              }}
              className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-white text-[10px] font-bold underline shrink-0 cursor-pointer"
            >
              How to fix
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded hover:bg-rose-800 text-rose-300 hover:text-white cursor-pointer shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive Voice Troubleshooter & Live Sound Meter Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-5 text-slate-900 dark:text-slate-100 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Microphone Diagnostics & Setup
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fix microphone permission or test real-time sound input
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopAudioTest();
                  setShowHelpModal(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Status Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">
                Live Status Diagnostics
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Browser Permission:</span>
                  {permissionState === 'granted' ? (
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Allowed
                    </span>
                  ) : permissionState === 'denied' ? (
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Blocked
                    </span>
                  ) : (
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Ask (Default)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Mic Hardware:</span>
                  {hasAudioDevice === false ? (
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Not Found
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> Detected
                    </span>
                  )}
                </div>
              </div>

              {/* LIVE SOUND VOLUME TESTER */}
              <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Radio className={`w-3.5 h-3.5 ${isTestingAudio ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                    Live Audio Level Test
                  </span>
                  {isTestingAudio && (
                    <span className="text-[10px] font-bold text-rose-500 animate-pulse">
                      Listening... Speak now
                    </span>
                  )}
                </div>

                {/* Animated Volume Meter Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      soundDetected ? 'bg-emerald-500' : audioVolume > 0 ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{ width: `${Math.max(audioVolume, 3)}%` }}
                  />
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  {!isTestingAudio ? (
                    <button
                      type="button"
                      onClick={startAudioTest}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Start 10-Sec Mic Sound Test
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopAudioTest}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      Stop Sound Test
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                    title="Reload page to apply address bar permissions"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reload Page
                  </button>
                </div>

                {testResult && (
                  <div className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300 animate-in fade-in flex items-start gap-1.5">
                    {soundDetected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span>{testResult}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Instructions Tabs */}
            <div className="mt-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('browser')}
                  className={`text-xs font-bold pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'browser'
                      ? 'text-amber-600 border-b-2 border-amber-500'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Browser Address Bar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('windows')}
                  className={`text-xs font-bold pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ml-2 ${
                    activeTab === 'windows'
                      ? 'text-amber-600 border-b-2 border-amber-500'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Windows 10/11 Privacy</span>
                </button>
              </div>

              {activeTab === 'browser' ? (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Why "Already Allowed" can still fail:</span>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      When you switch permissions in Chrome/Edge, <strong>you must reload the tab</strong>. Without reloading, Chrome keeps the old blocked permission in memory!
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> In the address bar above, click the <strong>Tune / Lock icon</strong> on the far left of <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono text-[11px] text-slate-900 dark:text-slate-100">{window.location.host || 'localhost:5173'}</code>.
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 2:</span> Verify <strong>Microphone</strong> is toggled to <strong>Allow</strong> (or click <em>Reset permissions</em>).
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 3:</span> Click the <strong>Reload Page</strong> button above (or press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">F5</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Ctrl+R</kbd>) to activate it!
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Check Windows Privacy Lock:</span>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      Even if Chrome shows "Allowed", Windows OS may be blocking desktop applications from accessing your hardware microphone.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Windows Key + I</kbd> to open Windows Settings.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 2:</span> Navigate to <strong>Privacy & Security</strong> → <strong>Microphone</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 3:</span> Ensure both <strong>"Microphone access"</strong> and <strong>"Let desktop apps access your microphone"</strong> are toggled <strong>ON</strong>.
                  </div>
                </div>
              )}
            </div>

            {/* Instant Voice Query Fallback (Always Works!) */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Voice Fallback: Tap to ask without typing</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
                Click any question below to immediately ask the chatbot in {selectedLang.label}:
              </p>

              <div className="flex flex-wrap gap-1.5">
                {selectedLang.suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuickPrompt(suggestion)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/60 font-medium transition-all cursor-pointer hover:scale-[1.01] active:scale-98"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Done Button */}
            <div className="mt-5 pt-2">
              <button
                type="button"
                onClick={() => {
                  stopAudioTest();
                  setShowHelpModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close & Return to Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
