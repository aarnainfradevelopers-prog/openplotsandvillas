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
  Play,
  Send,
  Square,
  Globe,
  Monitor,
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { OPV_LANGUAGES } from '../data/opvKnowledge';
import { LanguageCode, AttachedFile } from '../types/chat';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

interface MicrophoneButtonProps {
  currentLanguage: LanguageCode;
  onTranscript: (transcript: string) => void;
  onSendMessage?: (content: string, attachments?: AttachedFile[]) => void;
  disabled?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  currentLanguage,
  onTranscript,
  onSendMessage,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'windows' | 'browser' | 'test'>('windows');
  const [preferredMode, setPreferredMode] = useState<'auto' | 'speech' | 'audio'>('auto');
  const [showModeMenu, setShowModeMenu] = useState(false);

  // Live Sound Decibel Test State
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [soundDetected, setSoundDetected] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const errorTimerRef = useRef<any>(null);
  const lastSpokenTextRef = useRef('');
  const committedTextRef = useRef('');
  const isSecure = typeof window !== 'undefined' && window.isSecureContext;

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

  // Enumerate devices and check permissions
  const checkPermissionsAndDevices = useCallback(async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

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

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        setAudioDevices(audioInputs);
        if (audioInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(audioInputs[0].deviceId);
        }
      } catch {
        setAudioDevices([]);
      }
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    checkPermissionsAndDevices();
  }, [checkPermissionsAndDevices]);

  // Clean up
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
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
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  // Universal MediaRecorder Audio Recording Mode (Works on 100% of browsers & Windows desktops)
  const startAudioRecordingMode = async (deviceId?: string) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported by your browser.');
      }

      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type });
        const audioUrl = URL.createObjectURL(audioBlob);

        const voiceFile: AttachedFile = {
          name: `Voice_Query_${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`,
          size: `${Math.round(audioBlob.size / 1024)} KB`,
          type: type,
          url: audioUrl
        };

        if (onSendMessage) {
          onSendMessage('🎤 Voice Inquiry: Property Assistance in ' + selectedLang.label, [voiceFile]);
        }

        stream.getTracks().forEach(track => track.stop());
        setIsRecordingAudio(false);
        setRecordingSeconds(0);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      };

      recorder.start(250);
      setIsRecordingAudio(true);
      setRecordingSeconds(0);
      setErrorMessage(null);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Audio recording error:', err);
      setIsRecordingAudio(false);
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
        triggerError('Microphone blocked. Check Windows Settings & address bar.');
        setShowHelpModal(true);
      } else {
        triggerError(`Microphone notice: ${err.message || err.name}`);
      }
    }
  };

  const stopAudioRecordingMode = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    setIsRecordingAudio(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  // Stop listening cleanly and commit any pending speech
  const stopListening = useCallback(() => {
    const speechToCommit = lastSpokenTextRef.current.trim();
    if (speechToCommit && speechToCommit !== committedTextRef.current) {
      onTranscript(speechToCommit);
      committedTextRef.current = speechToCommit;
      lastSpokenTextRef.current = '';

      if (onSendMessage) {
        setTimeout(() => {
          onSendMessage(speechToCommit);
        }, 300);
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimText('');
  }, [onTranscript, onSendMessage]);

  // Speech Recognition Mode with automatic desktop fallback to Audio Recorder
  const startListening = useCallback(
    (retryWithFallbackLang = false) => {
      // If user selected Audio Recording mode directly
      if (preferredMode === 'audio') {
        startAudioRecordingMode(selectedDeviceId);
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      // If SpeechRecognition not available, automatically use audio recorder
      if (!SpeechRecognition) {
        console.warn('SpeechRecognition unavailable; using universal audio recorder.');
        startAudioRecordingMode(selectedDeviceId);
        return;
      }

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
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        let langCode = selectedLang.speechCode;
        if (retryWithFallbackLang) {
          langCode = 'en-US';
        } else if (selectedLang.code === 'en') {
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

            if (onSendMessage) {
              setTimeout(() => {
                onSendMessage(finalPiece);
              }, 400);
            }
          } else if (interim.trim()) {
            lastSpokenTextRef.current = interim.trim();
          }

          setInterimText(interim);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error on desktop:', event.error);
          const err = event.error;

          // If speech recognition failed on desktop/laptop (network, not-allowed, service-not-allowed),
          // DO NOT LEAVE USER STRANDED! Seamlessly fallback to MediaRecorder audio recording!
          if (
            err === 'network' ||
            err === 'service-not-allowed' ||
            err === 'audio-capture' ||
            err === 'not-allowed'
          ) {
            console.info('Switching to universal Audio Recorder mode due to:', err);
            setIsListening(false);
            startAudioRecordingMode(selectedDeviceId);
            return;
          }

          if (err === 'language-not-supported' && !retryWithFallbackLang) {
            startListening(true);
            return;
          }

          if (err === 'no-speech') {
            if (!lastSpokenTextRef.current) {
              triggerError('No speech detected. Speak closer to your microphone or test mic volume.', 5000);
            }
          } else if (err !== 'aborted') {
            triggerError(`Voice notice: ${err}`);
          }

          if (lastSpokenTextRef.current && lastSpokenTextRef.current !== committedTextRef.current) {
            onTranscript(lastSpokenTextRef.current);
            committedTextRef.current = lastSpokenTextRef.current;
            if (onSendMessage) {
              onSendMessage(lastSpokenTextRef.current);
            }
            lastSpokenTextRef.current = '';
          }

          setIsListening(false);
        };

        recognition.onend = () => {
          if (lastSpokenTextRef.current && lastSpokenTextRef.current !== committedTextRef.current) {
            onTranscript(lastSpokenTextRef.current);
            committedTextRef.current = lastSpokenTextRef.current;
            if (onSendMessage) {
              onSendMessage(lastSpokenTextRef.current);
            }
            lastSpokenTextRef.current = '';
          }
          setIsListening(false);
          setInterimText('');
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.warn('SpeechRecognition failed on desktop; switching to audio recorder mode:', err);
        startAudioRecordingMode(selectedDeviceId);
      }
    },
    [preferredMode, selectedDeviceId, selectedLang.speechCode, selectedLang.code, onTranscript, onSendMessage, triggerError]
  );

  const toggleListening = () => {
    if (disabled) return;

    if (isRecordingAudio) {
      stopAudioRecordingMode();
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Sound Decibel / Volume Test using Web Audio API
  const startAudioTest = async () => {
    stopAudioTest();
    setIsTestingAudio(true);
    setAudioVolume(0);
    setSoundDetected(false);
    setTestResult(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone API not supported');
      }

      const constraints: MediaStreamConstraints = {
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
      setTestResult('Microphone connected! Speak into your laptop/desktop mic now.');

      setTimeout(() => {
        if (heardSound) {
          setTestResult('Success! Sound detected from your desktop/laptop microphone.');
        } else {
          setTestResult(
            'Microphone connected, but sound level stayed 0. Please check your physical mic mute switch or Windows Sound volume.'
          );
        }
        stopAudioTest();
      }, 10000);
    } catch (err: any) {
      console.warn('Audio test failed:', err);
      setIsTestingAudio(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setTestResult('Windows Privacy or Browser Blocked: Follow the Windows tab below to unblock.');
      } else if (err.name === 'NotFoundError') {
        setTestResult('No physical microphone detected. Connect a headset or USB mic to your PC.');
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
    if (onSendMessage) {
      onSendMessage(prompt);
    }
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
          aria-label={
            isListening || isRecordingAudio ? 'Stop voice recording' : 'Start voice recording'
          }
          title={
            isRecordingAudio
              ? `Recording Voice Note (${recordingSeconds}s)... Click to send`
              : isListening
              ? `Listening in ${selectedLang.label}... Click to send`
              : `Click to Speak in ${selectedLang.label}`
          }
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
            isListening || isRecordingAudio
              ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] scale-105'
              : permissionState === 'denied'
              ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300'
              : 'text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/90 border border-slate-300/80 shadow-2xs'
          }`}
        >
          {(isListening || isRecordingAudio) && (
            <>
              <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping" />
              <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-pulse" />
            </>
          )}

          {isRecordingAudio ? (
            <Square className="w-4 h-4 sm:w-4.5 sm:h-4.5 relative z-10 fill-current" />
          ) : isListening ? (
            <MicOff className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          ) : (
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
          )}

          {/* Blocked indicator badge */}
          {permissionState === 'denied' && !isListening && !isRecordingAudio && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white"
              title="Microphone blocked. Click for desktop setup."
            />
          )}
        </button>

        {/* Live Speech Recognition Floating Banner */}
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
                <span className="text-[10px] text-slate-400">Speak your property question</span>
              )}
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg ml-1 cursor-pointer transition-colors flex items-center gap-1"
            >
              <Send className="w-2.5 h-2.5" />
              Send
            </button>
          </div>
        )}

        {/* Live Audio Recording Mode Floating Banner (Universal Fallback for Desktops) */}
        {isRecordingAudio && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3.5 py-2 bg-rose-950 text-white text-xs rounded-2xl shadow-2xl flex items-center gap-2.5 whitespace-nowrap z-50 border border-rose-700 animate-in fade-in duration-150">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span>Desktop Voice Note</span>
                <span className="text-[10px] font-mono bg-rose-900 px-1.5 py-0.5 rounded">
                  0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
              </span>
              <span className="text-[10px] text-rose-200">Speak now, tap Send when done</span>
            </div>
            <button
              type="button"
              onClick={stopAudioRecordingMode}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-rose-950 text-[10px] font-bold rounded-lg ml-1 cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
            >
              <Send className="w-2.5 h-2.5 fill-current" />
              Send Note
            </button>
          </div>
        )}

        {/* Floating Error Toast with 1-click Desktop Fix */}
        {errorMessage && !isListening && !isRecordingAudio && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3 py-2 bg-rose-950 text-white text-xs rounded-xl shadow-2xl flex items-center gap-2 z-50 whitespace-nowrap border border-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="text-[11px] font-medium max-w-[240px] sm:max-w-xs truncate">
              {errorMessage}
            </span>
            <button
              type="button"
              onClick={() => {
                setShowHelpModal(true);
                setActiveTab('windows');
                setErrorMessage(null);
              }}
              className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-white text-[10px] font-bold underline shrink-0 cursor-pointer"
            >
              Desktop Fix
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

      {/* Comprehensive Desktop & Laptop Voice Troubleshooter Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-5 text-slate-900 dark:text-slate-100 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Desktop & Laptop Microphone Fix
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fix Windows desktop mic settings or record voice notes directly
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

            {/* Why Mobile Works but Desktop Fails Notice */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs">
              <div className="font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Why mobile works but desktop/laptop fails:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Mobile phones use integrated OS speech services. On Windows laptops and desktops, <strong>Windows Privacy Settings</strong> or hardware audio routing often blocks Chrome desktop apps from accessing the physical mic.
              </p>
            </div>

            {/* Desktop Device Selector & Live Sound Test */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">
                Desktop Audio Input Device
              </div>

              {audioDevices.length > 0 ? (
                <div className="mb-3">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Select Laptop/PC Microphone:
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={e => setSelectedDeviceId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {audioDevices.map(d => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Microphone ${d.deviceId.slice(0, 5)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mb-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>No microphone labels detected yet. Click "Test Mic Sound" below to request device names.</span>
                </div>
              )}

              {/* LIVE SOUND VOLUME TESTER */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Radio className={`w-3.5 h-3.5 ${isTestingAudio ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                    Test Laptop/Desktop Mic Sound
                  </span>
                  {isTestingAudio && (
                    <span className="text-[10px] font-bold text-rose-500 animate-pulse">
                      Listening... Speak loudly
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
                      Test Mic Sound (10s)
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
                    onClick={() => {
                      setShowHelpModal(false);
                      startAudioRecordingMode(selectedDeviceId);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Mic className="w-3 h-3" />
                    Record Voice Note
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
                  onClick={() => setActiveTab('windows')}
                  className={`text-xs font-bold pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'windows'
                      ? 'text-amber-600 border-b-2 border-amber-500'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Windows 10/11 Privacy Lock (Critical)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('browser')}
                  className={`text-xs font-bold pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ml-2 ${
                    activeTab === 'browser'
                      ? 'text-amber-600 border-b-2 border-amber-500'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Browser Address Bar</span>
                </button>
              </div>

              {activeTab === 'windows' ? (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 font-medium text-amber-900 dark:text-amber-200">
                    ⚠️ The #1 reason microphones fail on Windows desktops: Windows OS disables desktop apps from using the mic by default.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Windows Key + I</kbd> on your keyboard to open Settings.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 2:</span> Go to <strong>Privacy & Security</strong> → <strong>Microphone</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 3:</span> Turn ON <strong>"Microphone access"</strong> AND scroll down to turn ON <strong>"Let desktop apps access your microphone"</strong> (ensure Google Chrome/Edge is enabled).
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> Look at the top of your browser address bar on <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono text-[10px] text-slate-900 dark:text-slate-100">{window.location.host}</code>.
                    Click the <strong>Tune / Lock icon</strong> on the far left.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 2:</span> Verify <strong>Microphone</strong> is set to <strong>Allow</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 3:</span> Refresh the page (<kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">F5</kbd>) to activate changes.
                  </div>
                </div>
              )}
            </div>

            {/* Instant Voice Query Fallback (Always Works on Desktop!) */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Voice Queries (Tap to ask without hardware):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {selectedLang.suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuickPrompt(suggestion)}
                    className="text-left text-[11px] p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 font-medium transition-all cursor-pointer hover:scale-[1.01] active:scale-98 flex items-center gap-1.5"
                  >
                    <Mic className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="truncate">"{suggestion}"</span>
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
