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
  Smartphone
} from 'lucide-react';
import { OPV_LANGUAGES } from '../data/chatConfig';
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
  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');

  // Audio Recording (MediaRecorder fallback) state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // General capabilities & permissions state
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'windows' | 'browser' | 'test'>('windows');

  // Live Sound Decibel Test State
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [soundDetected, setSoundDetected] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // References
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const errorTimerRef = useRef<any>(null);
  const lastSpokenTextRef = useRef('');
  const committedTextRef = useRef('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const testTimeoutRef = useRef<any>(null);

  const isSecure = typeof window !== 'undefined' && window.isSecureContext;
  const currentHost = typeof window !== 'undefined' ? window.location.host : '';

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

  // Map browser DOMException error names to user-friendly messages
  const getFriendlyErrorMessage = (err: any): string => {
    const errorName = err?.name || '';
    switch (errorName) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return 'Microphone access is blocked. Please allow microphone access in your browser settings.';
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return 'No microphone is available on this computer.';
      case 'NotReadableError':
      case 'TrackStartError':
        return 'The microphone is being used by another application or could not be accessed.';
      case 'OverconstrainedError':
        return 'Selected microphone is not available. Defaulting to system microphone.';
      case 'SecurityError':
        return 'Microphone access is restricted by security policy or insecure context (HTTPS required).';
      case 'AbortError':
        return 'Microphone request was aborted. Please try again.';
      default:
        return err?.message || 'Could not access the microphone. Please check your device settings.';
    }
  };

  // Safe audio stream helper with deviceId selection & fallback
  const getAudioStream = async (deviceId?: string): Promise<MediaStream> => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      throw new Error('Microphone access is not supported by your browser.');
    }

    if (deviceId && deviceId !== 'default' && deviceId !== '') {
      try {
        return await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { ideal: deviceId }
          }
        });
      } catch (err: any) {
        console.warn('Selected device unavailable, falling back to default audio input:', err);
        return await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    }

    return await navigator.mediaDevices.getUserMedia({ audio: true });
  };

  // Check initial permission status if navigator.permissions is available
  // Check initial permission status and auto-discover audio devices
  const checkInitialPermissions = useCallback(async () => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(!!SpeechRecognition);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        setAudioDevices(audioInputs);
      }
    } catch (_) {}

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
  }, []);

  useEffect(() => {
    checkInitialPermissions();

    const handleDeviceChange = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const audioInputs = devices.filter(d => d.kind === 'audioinput');
          setAudioDevices(audioInputs);
        }
      } catch (_) {}
    };

    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      };
    }
  }, [checkInitialPermissions]);

  // Clean up all resources
  const cleanupAllResources = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
      mediaRecorderRef.current = null;
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
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (testTimeoutRef.current) {
      clearTimeout(testTimeoutRef.current);
      testTimeoutRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupAllResources();
    };
  }, [cleanupAllResources]);

  // Stop sound test cleanly
  const stopAudioTest = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (testTimeoutRef.current) {
      clearTimeout(testTimeoutRef.current);
      testTimeoutRef.current = null;
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

  // Live Sound Decibel Test following the REQUIRED PERMISSION FLOW:
  // 1. First call getUserMedia({ audio: true })
  // 2. Only after obtaining stream, enumerate devices
  // 3. Create AudioContext, AnalyserNode, calculate volume
  // 4. Clean up stream and context when done
  const startAudioTest = async () => {
    stopAudioTest();
    setIsTestingAudio(true);
    setAudioVolume(0);
    setSoundDetected(false);
    setTestResult(null);

    try {
      // 1. Request stream first to trigger permission prompt if needed
      const stream = await getAudioStream(selectedDeviceId);
      audioStreamRef.current = stream;

      // 2. Only after obtaining the stream, enumerate audioinput devices
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const inputs = allDevices.filter(d => d.kind === 'audioinput');
          setAudioDevices(inputs);
          if (inputs.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(inputs[0].deviceId);
          }
        } catch (enumErr) {
          console.warn('Failed to enumerate devices:', enumErr);
        }
      }

      setPermissionState('granted');
      setTestResult('Microphone detected. Speak now.');

      // 3. AudioContext & AnalyserNode volume meter
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
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

        // 4. Auto-stop test after 10 seconds
        testTimeoutRef.current = setTimeout(() => {
          if (heardSound) {
            setTestResult('Success! Sound detected from your microphone.');
          } else {
            setTestResult('Microphone connected, but sound level stayed 0. Check your microphone volume or mute switch.');
          }
          stopAudioTest();
        }, 10000);
      }
    } catch (err: any) {
      console.warn('Microphone test error:', err);
      setIsTestingAudio(false);
      const friendlyMsg = getFriendlyErrorMessage(err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
      }
      setTestResult(friendlyMsg);
    }
  };

  // Fallback Mode B: Universal MediaRecorder Audio Recording (Voice-Note Attachment)
  const startAudioRecordingMode = async (deviceId?: string) => {
    try {
      const stream = await getAudioStream(deviceId || selectedDeviceId);
      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';
        }
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

        // Clearly sent as an audio voice-note attachment
        if (onSendMessage) {
          onSendMessage('🎤 Voice Note: Property inquiry in ' + selectedLang.label, [voiceFile]);
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
      const friendlyMsg = getFriendlyErrorMessage(err);
      triggerError(friendlyMsg);
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
        setShowHelpModal(true);
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

  // Mode A: Speech-to-Text via Web Speech API with universal device auto-connect & fallback
  const startListening = useCallback(
    async (retryWithFallbackLang = false) => {
      // 1. Proactively ensure microphone permission & hardware stream is awake
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        try {
          const testStream = await getAudioStream(selectedDeviceId);
          testStream.getTracks().forEach(t => t.stop());
          setPermissionState('granted');
        } catch (permErr: any) {
          console.warn('Microphone access check notice:', permErr);
          const friendlyMsg = getFriendlyErrorMessage(permErr);
          triggerError(friendlyMsg, 6000);
          if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
            setPermissionState('denied');
            setShowHelpModal(true);
            return;
          }
        }
      }

      const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

      // If SpeechRecognition unavailable, gracefully fallback to voice recording mode
      if (!SpeechRecognition) {
        console.warn('SpeechRecognition unavailable in this browser; starting audio voice recording mode.');
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

        // Try selected language speech code, with graceful fallback to en-US / en-IN
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

            // Send query automatically when final sentence is spoken
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
          console.warn('Speech recognition error event:', event.error);
          const err = event.error;

          // If speech recognition fails (network, not-allowed, service-not-allowed),
          // fallback to voice recording mode so the user is never stranded
          if (
            err === 'network' ||
            err === 'service-not-allowed' ||
            err === 'audio-capture' ||
            err === 'not-allowed'
          ) {
            console.info('Speech recognition failed; switching to audio recorder mode due to:', err);
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
              triggerError('No speech detected. Speak closer to your microphone.', 5000);
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
        console.warn('SpeechRecognition failed to start; switching to audio recorder mode:', err);
        startAudioRecordingMode(selectedDeviceId);
      }
    },
    [selectedDeviceId, selectedLang.speechCode, selectedLang.code, onTranscript, onSendMessage, triggerError]
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

  // Instant Voice Query selection handler (calls onTranscript & onSendMessage)
  const handleSelectQuickPrompt = (prompt: string) => {
    onTranscript(prompt);
    if (onSendMessage) {
      onSendMessage(prompt);
    }
    stopAudioTest();
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
              title="Microphone blocked. Click for setup."
            />
          )}
        </button>

        {/* Live Speech Recognition Floating Banner (Speech-to-Text Mode) */}
        {isListening && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3.5 py-2 bg-slate-950 text-white text-xs rounded-2xl shadow-2xl flex items-center gap-2.5 whitespace-nowrap z-50 border border-slate-800 animate-in fade-in duration-150">
            <span className="flex items-center gap-0.5 h-3.5 shrink-0">
              <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" />
              <span className="w-1 h-3.5 bg-rose-400 rounded-full animate-bounce delay-75" />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce delay-150" />
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

        {/* Live Audio Recording Mode Floating Banner (Voice-Note Mode) */}
        {isRecordingAudio && (
          <div className="absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-3.5 py-2 bg-rose-950 text-white text-xs rounded-2xl shadow-2xl flex items-center gap-2.5 whitespace-nowrap z-50 border border-rose-700 animate-in fade-in duration-150">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span>Recording Voice Note</span>
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

        {/* Floating Error Toast */}
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
                setActiveTab('test');
                setErrorMessage(null);
              }}
              className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-white text-[10px] font-bold underline shrink-0 cursor-pointer"
            >
              Check Mic
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

      {/* Comprehensive Microphone Troubleshooter & Live Test Modal */}
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
                    Microphone & Voice Assistant Setup
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Test your microphone hardware or use instant voice queries
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

            {/* Desktop Audio Device Section */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">
                Audio Input Devices
              </div>

              {/* Accurate Status Reporting based on Permission & Hardware */}
              {permissionState === 'denied' ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 mb-3">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-950 dark:text-rose-100">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Microphone Permission Denied</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    Microphone permission was denied. Please allow microphone access in your browser settings.
                  </p>
                </div>
              ) : permissionState === 'granted' && audioDevices.length > 0 ? (
                <div className="mb-3">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Detected Microphone:
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={e => setSelectedDeviceId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {audioDevices.map((d, index) => {
                      const displayName = d.label ? d.label : `Microphone ${index + 1}`;
                      return (
                        <option key={d.deviceId || index} value={d.deviceId}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : permissionState === 'granted' && audioDevices.length === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 mb-3">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-950 dark:text-emerald-100">
                    <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No Microphone Available</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    No microphone is currently available to this browser. Connect a microphone and try again.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200 mb-3">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Microphone Permission Required</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    Microphone permission is required. Please click <strong>"Test Mic Sound"</strong> below to allow access and detect connected microphones.
                  </p>
                </div>
              )}

              {/* LIVE SOUND VOLUME TESTER */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Radio className={`w-3.5 h-3.5 ${isTestingAudio ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                    Live Microphone Test
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
                      soundDetected ? 'bg-emerald-500' : audioVolume > 0 ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-700'
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
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                    title="Record voice note directly"
                  >
                    <Mic className="w-3 h-3 text-rose-400" />
                    Record Voice Note
                  </button>
                </div>

                {testResult && (
                  <div className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300 animate-in fade-in flex items-start gap-1.5">
                    {soundDetected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
                      ? 'text-emerald-600 border-b-2 border-emerald-500'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Windows Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('browser')}
                  className={`text-xs font-bold pb-1 cursor-pointer transition-colors flex items-center gap-1.5 ml-2 ${
                    activeTab === 'browser'
                      ? 'text-emerald-600 border-b-2 border-emerald-500'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Browser Address Bar</span>
                </button>
              </div>

              {activeTab === 'windows' ? (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Windows Key + I</kbd> to open Windows Settings.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 2:</span> Go to <strong>Privacy & Security</strong> → <strong>Microphone</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 3:</span> Ensure <strong>"Microphone access"</strong> and <strong>"Let desktop apps access your microphone"</strong> are toggled <strong>ON</strong>.
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 1:</span> In your browser address bar on <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono text-[10px] text-slate-900 dark:text-slate-100">{currentHost || 'your website'}</code>, click the <strong>Tune / Lock icon</strong> on the far left.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 2:</span> Change <strong>Microphone</strong> from <em>Block</em> to <strong>Allow</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                    <span className="font-bold text-slate-900 dark:text-white">Step 3:</span> Reload the page (<kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">F5</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px]">Ctrl+R</kbd>) to activate your new permission.
                  </div>
                </div>
              )}
            </div>

            {/* Instant Voice Queries (Tap to ask without hardware) */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant Voice Queries (Tap to ask without hardware):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {selectedLang.suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuickPrompt(suggestion)}
                    className="text-left text-[11px] p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60 font-medium transition-all cursor-pointer hover:scale-[1.01] active:scale-98 flex items-center gap-1.5"
                  >
                    <Mic className="w-3 h-3 text-emerald-600 shrink-0" />
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
