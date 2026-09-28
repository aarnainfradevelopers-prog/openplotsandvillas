import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, X, HelpCircle } from 'lucide-react';
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
  const recognitionRef = useRef<any>(null);
  const errorTimerRef = useRef<any>(null);

  const selectedLang = OPV_LANGUAGES.find(l => l.code === currentLanguage) || OPV_LANGUAGES[0];

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(null);
    }, 7000);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          onTranscript(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          triggerError('Microphone blocked by browser. Click the lock/tune icon in the address bar to Allow.');
        } else if (event.error === 'no-speech') {
          // No speech detected
        } else {
          triggerError(`Mic notice: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [selectedLang.speechCode, onTranscript]);

  const toggleListening = async () => {
    if (!isSupported) {
      alert('Speech Recognition is not supported by your browser. Please try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setErrorMessage(null);

    // Try requesting getUserMedia first to trigger the browser's permission prompt
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        console.warn('Microphone access denied:', err);
        triggerError('Microphone blocked. Click the lock/tune icon on top-left of the address bar to Allow.');
        return;
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = selectedLang.speechCode;
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition start error:', err);
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    }
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
              : `Click to Speak (${selectedLang.label})`
          }
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] scale-105'
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
            <MicOff className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 animate-bounce" />
          ) : (
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          )}
        </button>

        {/* Floating listening feedback */}
        {isListening && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-950 text-white text-xs rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap z-50 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">Listening in {selectedLang.label}... Speak now</span>
          </div>
        )}

        {/* Floating error toast with Help button */}
        {errorMessage && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3.5 py-2 bg-rose-950 text-white text-xs rounded-xl shadow-2xl flex items-center gap-2 z-50 whitespace-nowrap border border-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="text-[11px] font-medium">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="px-2 py-0.5 rounded bg-rose-800 hover:bg-rose-700 text-white text-[10px] font-bold underline ml-1 cursor-pointer"
            >
              How to fix
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded hover:bg-rose-800 text-rose-300 hover:text-white cursor-pointer ml-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Help Modal explaining step-by-step how to allow microphone */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 text-slate-900 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Mic className="w-5 h-5 text-rose-600" />
                <span>How to Unblock Your Microphone</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 py-4 text-xs leading-relaxed text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Step 1: In your browser URL bar</div>
                <p>
                  Look at the top of your screen where it says <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">http://localhost:5173/</code>.
                  Click the <strong>Tune / Lock icon</strong> on the far left of the address.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Step 2: Turn on Microphone</div>
                <p>
                  In the menu that appears, toggle <strong>Microphone</strong> from <em>Block</em> to <strong>Allow</strong> (or click <em>Reset permissions</em>).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Step 3: Reload and Talk</div>
                <p>
                  Refresh the page (<kbd className="px-1 py-0.5 bg-slate-200 rounded">F5</kbd> or <kbd className="px-1 py-0.5 bg-slate-200 rounded">Ctrl+R</kbd>) and click the mic button again.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
