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
  Lock
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
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [activeTab, setActiveTab] = useState<'browser' | 'windows'>('browser');

  const recognitionRef = useRef<any>(null);
  const errorTimerRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef(false);

  const selectedLang = OPV_LANGUAGES.find(l => l.code === currentLanguage) || OPV_LANGUAGES[0];

  const triggerError = useCallback((msg: string, autoDismissMs: number = 7000) => {
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
    if (!SpeechRecognition) {
      setIsSupported(false);
    } else {
      setIsSupported(true);
    }

    // Check navigator permission for microphone
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
        // Some browsers do not support query with name: 'microphone'
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

  // Clean up any active recognition when unmounting
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // Stop listening helper
  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  // Start listening with fresh SpeechRecognition instance
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setShowHelpModal(true);
      return;
    }

    // If already listening, stop
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    setErrorMessage(null);
    setInterimText('');
    isManuallyStoppedRef.current = false;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang.speechCode;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            const finalPiece = result[0].transcript.trim();
            if (finalPiece) {
              onTranscript(finalPiece);
            }
          } else {
            interim += result[0].transcript;
          }
        }
        setInterimText(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        const err = event.error;

        if (err === 'not-allowed' || err === 'permission-denied') {
          setPermissionState('denied');
          triggerError(
            'Microphone blocked. Click the lock/tune icon on top-left of the address bar to Allow.',
            10000
          );
        } else if (err === 'audio-capture') {
          triggerError('No microphone detected. Please plug in a microphone or headset.', 8000);
        } else if (err === 'network') {
          triggerError('Network issue with speech service. Check your internet connection.', 7000);
        } else if (err === 'no-speech') {
          // Graceful handling: user didn't speak in time, don't show loud error
          setInterimText('');
        } else if (err === 'aborted') {
          // Intentional stop, do nothing
        } else {
          triggerError(`Voice notice: ${err}`);
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start SpeechRecognition:', err);
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
        triggerError('Microphone blocked. Click the lock/tune icon in the address bar to Allow.');
      } else {
        triggerError('Could not start microphone. Click "How to fix" for solutions.');
      }
      setIsListening(false);
    }
  }, [selectedLang.speechCode, onTranscript, triggerError]);

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

  // Test microphone directly using getUserMedia from user gesture
  const handleTestMicrophone = async () => {
    setTestStatus('testing');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      setTestStatus('success');
      setPermissionState('granted');
      setErrorMessage(null);
      await checkPermissionsAndDevices();
    } catch (err: any) {
      console.warn('Microphone test failed:', err);
      setTestStatus('failed');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
      }
    }
  };

  const handleSelectQuickPrompt = (prompt: string) => {
    onTranscript(prompt);
    setShowHelpModal(false);
  };

  return (
    <>
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={toggleListening}
          disabled={disabled}
          aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
          title={
            isListening
              ? `Listening in ${selectedLang.label}... Click to stop`
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
              title="Microphone is currently blocked by your browser. Click to see how to allow."
            />
          )}
        </button>

        {/* Floating Active Speech Feedback Bubble */}
        {isListening && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3.5 py-2 bg-slate-950 text-white text-xs rounded-2xl shadow-2xl flex items-center gap-2.5 whitespace-nowrap z-50 border border-slate-800 animate-in fade-in duration-150">
            <span className="flex items-center gap-0.5 h-3 shrink-0">
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" />
              <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-bounce delay-75" />
              <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-bounce delay-150" />
              <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce delay-100" />
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-rose-300">
                Listening ({selectedLang.label})... Speak now
              </span>
              {interimText && (
                <span className="text-[10px] text-slate-300 max-w-[200px] truncate italic">
                  "{interimText}"
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="px-2 py-0.5 bg-rose-900/80 hover:bg-rose-800 text-white text-[10px] font-bold rounded-lg ml-1 cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* Floating Error Toast with 'How to fix' action */}
        {errorMessage && !isListening && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3 py-2 bg-rose-950 text-white text-xs rounded-xl shadow-2xl flex items-center gap-2 z-50 whitespace-nowrap border border-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="text-[11px] font-medium max-w-[280px] sm:max-w-xs truncate">
              {errorMessage}
            </span>
            <button
              type="button"
              onClick={() => {
                setShowHelpModal(true);
                setErrorMessage(null);
              }}
              className="px-2 py-0.5 rounded bg-rose-800 hover:bg-rose-700 text-white text-[10px] font-bold underline shrink-0 cursor-pointer ml-1"
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

      {/* Comprehensive Microphone Troubleshooter & Help Modal */}
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
                    Microphone & Voice Setup
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fix microphone access or try instant voice query options
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Status Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-400 mb-2">
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

              {/* Instant Test / Allow Action Button */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestMicrophone}
                  disabled={testStatus === 'testing'}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                  {testStatus === 'testing' ? 'Testing Microphone...' : 'Test & Request Permission Now'}
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                  title="Reload webpage to apply permission changes"
                >
                  Reload Page
                </button>
              </div>

              {testStatus === 'success' && (
                <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Microphone access verified successfully! You can now speak.</span>
                </div>
              )}

              {testStatus === 'failed' && (
                <div className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4" />
                  <span>Microphone is still blocked in your browser settings. Please follow Step 1 below.</span>
                </div>
              )}
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
                  <span>In Chrome / Edge (Address Bar)</span>
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
                  <span>Windows OS Privacy Settings</span>
                </button>
              </div>

              {activeTab === 'browser' ? (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> Look at the very top of your browser address bar where it says <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono text-[11px] text-slate-900 dark:text-slate-100">{window.location.host || 'localhost:5173'}</code>.
                    Click the <strong>Tune / Sliders icon</strong> (or <strong>Lock icon</strong>) on the far-left of the address bar.
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 2:</span> In the site permissions menu that appears, locate <strong>Microphone</strong> and switch it from <span className="text-rose-600 font-semibold">Block</span> to <strong>Allow</strong> (or click <em>Reset permissions</em>).
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 3:</span> Click <strong>"Test & Request Permission Now"</strong> above or press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">F5</kbd> to refresh and speak!
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Windows + I</kbd> to open Windows Settings.
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
                Can't use your mic right now? Click any question below to insert it directly in {selectedLang.label}:
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
                onClick={() => setShowHelpModal(false)}
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
