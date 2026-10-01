import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ExternalLink,
  Phone,
  MessageCircle,
  ShieldCheck,
  Landmark,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { ChatMessageItem, LanguageCode, PropertyItem } from '../types/chat';
import { OPV_LANGUAGES } from '../data/chatConfig';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailView } from './PropertyDetailView';

/**
 * Strips corrupted question marks, unicode replacement characters, emojis, and artifacts from action labels
 */
const cleanActionLabel = (label: string): string => {
  if (!label) return '';
  return label
    .replace(/[\uFFFD\u25C6\u25C7\u25C8\u25CA\u25A0\u25A1\uFEFF]/g, '')
    .replace(/[\uD800-\uDFFF]/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/^[\s?.\-_:;•*]+/u, '')
    .trim();
};

/**
 * Authentic, sharp WhatsApp brand icon
 */
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z"
      fill="#25D366"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.51 14.39C17.21 14.24 15.74 13.52 15.47 13.42C15.2 13.32 15 13.27 14.81 13.57C14.61 13.86 14.05 14.52 13.88 14.72C13.71 14.92 13.54 14.94 13.24 14.79C12.95 14.64 12 14.33 10.87 13.33C9.99 12.54 9.4 11.57 9.23 11.28C9.06 10.98 9.21 10.82 9.36 10.68C9.49 10.55 9.66 10.33 9.8 10.16C9.95 10 10 9.87 10.1 9.68C10.2 9.48 10.15 9.31 10.07 9.16C10 9.01 9.41 7.55 9.16 6.96C8.92 6.38 8.68 6.46 8.5 6.45C8.33 6.44 8.13 6.44 7.94 6.44C7.74 6.44 7.42 6.51 7.15 6.81C6.88 7.1 6.13 7.8 6.13 9.24C6.13 10.67 7.18 12.06 7.32 12.25C7.47 12.45 9.38 15.4 12.31 16.66C13.01 16.96 13.55 17.14 13.98 17.28C14.68 17.5 15.32 17.47 15.82 17.39C16.38 17.31 17.54 16.69 17.78 16.01C18.03 15.33 18.03 14.74 17.95 14.62C17.88 14.5 17.71 14.44 17.51 14.39Z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Clear, distinct phone call icon
 */
const PhoneCallIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 shrink-0" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z"
      fill="#0284C7"
    />
  </svg>
);

interface ChatMessageProps {
  message: ChatMessageItem;
  currentLanguage: LanguageCode;
  onSelectPropertyDetails: (property: PropertyItem) => void;
  onEnquireProperty: (property: PropertyItem) => void;
  onToggleFavorite?: (property: PropertyItem) => void;
  onOpenPropertyModal?: (property: PropertyItem) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentLanguage,
  onSelectPropertyDetails,
  onEnquireProperty,
  onToggleFavorite,
  onOpenPropertyModal
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    if (!message.content) return;
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message.content);
        success = true;
      }
    } catch (err) {
      console.warn('navigator.clipboard failed, attempting fallback', err);
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = message.content;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content.replace(/[#*`_>]/g, ''));
    
    const langObj = OPV_LANGUAGES.find(l => l.code === (message.language || currentLanguage));
    if (langObj) {
      utterance.lang = langObj.speechCode;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const getActionIcon = (action?: string) => {
    switch (action) {
      case 'call':
        return <PhoneCallIcon className="w-4 h-4 shrink-0" />;
      case 'whatsapp':
        return <WhatsAppIcon className="w-4 h-4 shrink-0" />;
      case 'legal':
        return <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'loan':
        return <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <ExternalLink className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-900 mt-2 mb-1 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm sm:text-base font-semibold text-slate-800 mt-1.5 mb-1">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="my-2 pl-3 py-1 border-l-2 border-emerald-500 bg-emerald-50/60 text-slate-800 text-xs sm:text-sm rounded-r-md"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.trim().startsWith('• ') || line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const bulletText = line.trim().replace(/^[•*-]\s*/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 text-xs sm:text-sm leading-relaxed my-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInline(bulletText) }} />
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-800 leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-700 hover:text-emerald-800 underline underline-offset-2 font-semibold">$1</a>');
  };

  // If this is a User Message: render yellow bubble matching Images 2 & 3
  if (!isAssistant) {
    return (
      <div className="py-2 px-2 sm:px-4 w-full flex items-center justify-end gap-2.5">
        <div className="flex flex-col items-end max-w-xl">
          {/* User message attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1.5 justify-end">
              {message.attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800 shadow-2xs"
                >
                  {att.type.startsWith('image/') ? (
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  ) : att.type.startsWith('audio/') ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span className="font-semibold">{att.name}</span>
                  {att.type.startsWith('audio/') && (
                    <audio src={att.url} controls className="h-6 w-36 ml-1" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* User Message Bubble matching card specs: White bg, thin dark-gray border, rounded 10px, 40px height, ~140px width */}
          <div
            className="inline-flex items-center justify-center min-h-[40px] min-w-[140px] px-4 py-2 rounded-[10px] bg-white text-slate-900 border border-slate-300 shadow-2xs text-xs sm:text-[13px] font-semibold break-words text-center select-text cursor-text"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              borderRadius: '10px',
              minHeight: '40px',
              minWidth: '140px'
            }}
          >
            {message.content}
          </div>
        </div>

        {/* 'You' Avatar Badge */}
        <div className="shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold flex items-center justify-center">
            You
          </span>
        </div>
      </div>
    );
  }

  // Assistant Message: Clean Square Yards layout
  return (
    <div className="py-2 px-2 sm:px-4 w-full">
      {/* Square Yards style row: Avatar OPV (like SY) + Speech Bubble */}
      <div className="flex items-start gap-3">
        {/* Dark Circle/Square Avatar with OPV / SY */}
        <div className="w-7 h-7 rounded-lg bg-[#1a1718] text-white flex items-center justify-center font-bold text-xs tracking-tight shrink-0 shadow-xs mt-0.5">
          OPV
        </div>

        {/* Speech Bubble & Content Area */}
        <div className="flex-1 min-w-0">
          {message.content && (
            <div className="inline-block bg-white dark:bg-[#1a2234] border border-slate-200/90 dark:border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 text-slate-800 dark:text-slate-100 text-sm sm:text-[15px] shadow-xs leading-relaxed max-w-2xl select-text cursor-text">
              <div className="text-slate-800 dark:text-slate-200 text-sm select-text">
                {renderFormattedContent(message.content)}
              </div>

              {/* Message Utilities: 1-Click Copy and Listen */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy response"
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSpeak}
                  title={isSpeaking ? "Stop listening" : "Listen to answer"}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span className="text-emerald-600 font-semibold">Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* If this message has a single selected property detail view (Image 4) */}
          {message.selectedPropertyDetail && (
            <div className="mt-3">
              <PropertyDetailView
                property={message.selectedPropertyDetail}
                onEnquire={onEnquireProperty}
                onDetails={onOpenPropertyModal || onSelectPropertyDetails}
              />
            </div>
          )}

          {/* If this message has property cards list (Images 2 & 3) */}
          {message.properties && message.properties.length > 0 && !message.selectedPropertyDetail && (
            <div className={message.content ? "mt-4" : "mt-0"}>
              <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-3">
                Projects for you
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
                {message.properties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onDetails={onSelectPropertyDetails}
                    onEnquire={onEnquireProperty}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Chips */}
          {message.actions && message.actions.length > 0 && !message.selectedPropertyDetail && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
              {message.actions.map((act, i) => (
                <a
                  key={i}
                  href={act.url}
                  target={act.url?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-[13px] font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-50 border transition-all shadow-2xs cursor-pointer"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    borderColor: 'rgb(203, 213, 225)',
                    borderRadius: '10px',
                    minHeight: '40px',
                    minWidth: '140px'
                  }}
                >
                  {getActionIcon(act.action)}
                  <span>{cleanActionLabel(act.label)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
