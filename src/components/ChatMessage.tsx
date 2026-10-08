import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Check,
  Volume2,
  VolumeX,
  ExternalLink,
  Phone,
  MessageCircle,
  ShieldCheck,
  Landmark,
  FileText,
  Image as ImageIcon,
  Pencil,
  RotateCw,
  SmilePlus,
  ThumbsDown,
  ThumbsUp,
  Building2
} from 'lucide-react';
import { ChatMessageItem, LanguageCode, PropertyItem } from '../types/chat';
import { OPV_LANGUAGES } from '../data/chatConfig';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailView } from './PropertyDetailView';

/**
 * Localized 'You' badge labels across all 24 Indian languages
 */
const YOU_LABEL_MAP: Record<string, string> = {
  en: 'You',
  te: 'మీరు',
  ta: 'நீங்கள்',
  hi: 'आप',
  kn: 'ನೀವು',
  ml: 'നിങ്ങൾ',
  mr: 'तुम्ही',
  bn: 'আপনি',
  gu: 'તમે',
  ur: 'آپ',
  pa: 'ਤੁਸੀਂ',
  or: 'ଆପଣ',
  mwr: 'आप',
  as: 'আপুনি',
  mai: 'अहाँ',
  sat: 'ᱟᱢ',
  ks: 'تۄہہ',
  bho: 'रउआ',
  ne: 'तपाईं',
  sd: 'توهان',
  kok: 'तुमी',
  bgc: 'तू',
  hne: 'तुम्ही',
  tcy: 'ఈర్'
};

/**
 * Localized 'Projects for you' section heading across Indian languages
 */
const PROJECTS_FOR_YOU_MAP: Record<string, string> = {
  en: 'Projects for you',
  te: 'మీ కోసం ప్రాజెక్ట్‌లు',
  ta: 'உங்களுக்கான திட்டங்கள்',
  hi: 'आपके लिए प्रोजेक्ट्स',
  kn: 'ನಿಮಗಾಗಿ ಯೋಜನೆಗಳು',
  ml: 'നിങ്ങൾക്കായുള്ള പ്രോജക്റ്റുകൾ',
  mr: 'तुमच्यासाठी प्रकल्प',
  bn: 'আপনার জন্য প্রকল্প',
  gu: 'તમારા માટે પ્રોજેક્ટ્સ',
  ur: 'آپ کے لیے منصوبے',
  pa: 'ਤੁਹਾਡੇ ਲਈ ਪ੍ਰੋਜੈਕਟ',
  or: 'ଆପଣଙ୍କ ପାଇଁ ପ୍ରକଳ୍ପ'
};

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

/**
 * Clean Share / Upload Tray Icon (matching middle icon in user reference screenshot)
 */
const ShareTrayIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

/**
 * Exact Custom Copy SVG Icon (20px x 20px)
 */
const CopyIcon: React.FC<{ className?: string }> = ({ className = "Icon-X4VkKC" }) => (
  <svg
    aria-hidden="true"
    className={className}
    focusable="false"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1006 1.78516C16.793 1.78556 18.165 3.15808 18.165 4.85059V10.8838C18.1649 12.5762 16.7929 13.9478 15.1006 13.9482H13.998V15.0508C13.9976 16.7431 12.626 18.1151 10.9336 18.1152H4.90039C3.20789 18.1152 1.83537 16.7432 1.83496 15.0508V9.01758C1.83496 7.32482 3.20764 5.95215 4.90039 5.95215H6.00195V4.85059C6.00195 3.15783 7.37463 1.78516 9.06738 1.78516H15.1006ZM4.90039 7.28223C3.94218 7.28223 3.16504 8.05936 3.16504 9.01758V15.0508C3.16544 16.0087 3.94243 16.7852 4.90039 16.7852H10.9336C11.8914 16.785 12.6676 16.0086 12.668 15.0508V9.01758C12.668 8.05945 11.8917 7.28237 10.9336 7.28223H4.90039ZM9.06738 3.11523C8.10917 3.11523 7.33203 3.89237 7.33203 4.85059V5.95215H10.9336C12.6262 5.95229 13.998 7.32491 13.998 9.01758V12.6182H15.1006C16.0584 12.6178 16.8348 11.8416 16.835 10.8838V4.85059C16.835 3.89262 16.0585 3.11564 15.1006 3.11523H9.06738Z"
      fill="currentColor"
    />
  </svg>
);

interface ChatMessageProps {
  message: ChatMessageItem;
  currentLanguage: LanguageCode;
  onSelectPropertyDetails: (property: PropertyItem) => void;
  onEnquireProperty: (property: PropertyItem) => void;
  onViewNumberProperty: (property: PropertyItem) => void;
  onToggleFavorite?: (property: PropertyItem) => void;
  onOpenPropertyModal?: (property: PropertyItem) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onOpenPostPropertyModal?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentLanguage,
  onSelectPropertyDetails,
  onEnquireProperty,
  onViewNumberProperty,
  onToggleFavorite,
  onOpenPropertyModal,
  onEditMessage,
  onRegenerate,
  onOpenPostPropertyModal
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content || '');
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleTryAgain = () => {
    setIsRegenerating(true);
    if (onRegenerate) {
      onRegenerate(message.id);
    }
    setTimeout(() => setIsRegenerating(false), 1200);
  };

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

  const handleShare = async () => {
    if (!message.content) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OPV Prompt',
          text: message.content,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // User aborted or unsupported share
      }
    }
    // Fallback: copy to clipboard
    handleCopy();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
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

  // If this is a User Message: render user bubble and action row matching reference screenshot
  if (!isAssistant) {
    return (
      <div className="py-2 px-2 sm:px-4 w-full flex items-start justify-end gap-2.5">
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

          {isEditing ? (
            <div className="w-full min-w-[280px] sm:min-w-[380px] max-w-xl bg-white dark:bg-[#1a2234] border border-emerald-500 rounded-2xl p-3 shadow-md">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (editText.trim()) {
                      setIsEditing(false);
                      onEditMessage?.(message.id, editText.trim());
                    }
                  } else if (e.key === 'Escape') {
                    setIsEditing(false);
                    setEditText(message.content);
                  }
                }}
                rows={Math.min(5, Math.max(2, editText.split('\n').length))}
                className="w-full text-xs sm:text-[13.5px] text-slate-800 dark:text-slate-100 bg-transparent resize-none focus:outline-none leading-relaxed"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(message.content);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (editText.trim()) {
                      setIsEditing(false);
                      onEditMessage?.(message.id, editText.trim());
                    }
                  }}
                  disabled={!editText.trim()}
                  className="px-3.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* User Message Bubble matching Reference Screenshot (clean bubble without icons inside) */}
              <div
                className="relative inline-block max-w-xl px-4 py-2.5 rounded-2xl rounded-tr-xs bg-[#edf4fc] dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs text-xs sm:text-[13.5px] font-normal leading-relaxed break-words text-left select-text cursor-text"
              >
                <div>{message.content}</div>
                {message.originalQuery && message.originalQuery.trim().toLowerCase() !== message.content.trim().toLowerCase() && (
                  <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 italic">
                    Original: {message.originalQuery}
                  </div>
                )}
              </div>

              {/* Action Buttons Below the User Prompt (matching Reference Screenshot: Copy, Share, Edit) */}
              <div className="flex items-center justify-end gap-1 mt-1 mr-0.5 text-slate-400">
                <button
                  type="button"
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy prompt"}
                  aria-label="Copy prompt"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <CopyIcon />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  title={shared ? "Shared!" : "Share prompt"}
                  aria-label="Share prompt"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {shared ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ShareTrayIcon />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setEditText(message.originalQuery || message.content);
                  }}
                  title="Edit prompt"
                  aria-label="Edit prompt"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* 'You' Avatar Badge */}
        <div className="shrink-0 mt-1">
          <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center">
            {YOU_LABEL_MAP[currentLanguage || 'en'] || 'You'}
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
            <div className="relative inline-block bg-white dark:bg-[#1a2234] border border-slate-200/90 dark:border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 text-slate-800 dark:text-slate-100 text-sm sm:text-[15px] shadow-xs leading-relaxed max-w-2xl select-text cursor-text w-full sm:w-auto">
              {/* Right Side Corner Copy Button (where user marked in red) */}
              <button
                type="button"
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy response"}
                aria-label="Copy response"
                className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center z-10"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <CopyIcon />
                )}
              </button>

              <div className="text-slate-800 dark:text-slate-200 text-sm select-text pr-7">
                {renderFormattedContent(message.content)}
              </div>

              {/* Feedback Options: Share, Listen, Try Again, Emoji, Thumb Down, Thumb Up */}
              <div className="relative mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-slate-400">
                {/* Share */}
                <button
                  type="button"
                  onClick={handleShare}
                  title={shared ? "Shared!" : "Share response"}
                  aria-label="Share response"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-600" /> : <ShareTrayIcon className="w-4 h-4" />}
                </button>

                {/* Listen */}
                <button
                  type="button"
                  onClick={handleSpeak}
                  title={isSpeaking ? "Stop listening" : "Listen to answer"}
                  aria-label="Listen to answer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4 text-emerald-600 animate-pulse" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Try Again / Regenerate */}
                <button
                  type="button"
                  onClick={handleTryAgain}
                  title="Try again"
                  aria-label="Try again"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-emerald-600' : ''}`} />
                </button>

                {/* Emoji Reaction */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(prev => !prev)}
                    title="Add reaction"
                    aria-label="Add reaction"
                    className={`p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                      selectedEmoji
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {selectedEmoji ? (
                      <span className="text-sm leading-none">{selectedEmoji}</span>
                    ) : (
                      <SmilePlus className="w-4 h-4" />
                    )}
                  </button>

                  {/* Micro Emoji Reaction Popover */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-1.5 bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl p-1.5 flex items-center gap-1 z-20 animate-in fade-in zoom-in-95 duration-150">
                      {['👍', '❤️', '💡', '🔥', '👏', '😊'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setSelectedEmoji(selectedEmoji === emoji ? null : emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-sm transition-transform hover:scale-125 cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumb Down */}
                <button
                  type="button"
                  onClick={() => setFeedback(prev => prev === 'down' ? null : 'down')}
                  title="Bad response"
                  aria-label="Bad response"
                  className={`p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                    feedback === 'down'
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>

                {/* Thumb Up */}
                <button
                  type="button"
                  onClick={() => setFeedback(prev => prev === 'up' ? null : 'up')}
                  title="Good response"
                  aria-label="Good response"
                  className={`p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                    feedback === 'up'
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>

                {/* Feedback confirmation note */}
                {feedback && (
                  <span className="ml-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 animate-in fade-in duration-200">
                    {feedback === 'up' ? 'Helpful' : 'Recorded'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* If this message has a single selected property detail view (Image 4) */}
          {message.selectedPropertyDetail && (
            <div className="mt-3">
              <PropertyDetailView
                property={message.selectedPropertyDetail}
                onEnquire={onEnquireProperty}
                onViewNumber={onViewNumberProperty}
                onDetails={onOpenPropertyModal || onSelectPropertyDetails}
                currentLanguage={currentLanguage}
              />
            </div>
          )}

          {/* If this message has property cards list (Images 2 & 3) */}
          {message.properties && message.properties.length > 0 && !message.selectedPropertyDetail && (
            <div className={message.content ? "mt-4" : "mt-0"}>
              {(() => {
                const exactList = message.properties.filter(p => !p.isNearby);
                const nearbyList = message.properties.filter(p => p.isNearby);

                return (
                  <div className="space-y-4">
                    {/* Exact Matches */}
                    {exactList.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
                          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 dark:text-white">
                            {exactList.length === message.properties.length
                              ? (PROJECTS_FOR_YOU_MAP[currentLanguage] || PROJECTS_FOR_YOU_MAP.en)
                              : `Matching Properties (${exactList.length})`}
                          </h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 my-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 snap-x items-stretch">
                          {exactList.map(property => (
                            <div key={property.id} className="snap-start shrink-0">
                              <PropertyCard
                                property={property}
                                onDetails={onSelectPropertyDetails}
                                onEnquire={onEnquireProperty}
                                onViewNumber={onViewNumberProperty}
                                onToggleFavorite={onToggleFavorite}
                                currentLanguage={currentLanguage}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nearby Recommendations */}
                    {nearbyList.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-xs" />
                          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 dark:text-white">
                            Nearby Properties &amp; Recommendations ({nearbyList.length})
                          </h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 my-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 snap-x items-stretch">
                          {nearbyList.map(property => (
                            <div key={property.id} className="snap-start shrink-0">
                              <PropertyCard
                                property={property}
                                onDetails={onSelectPropertyDetails}
                                onEnquire={onEnquireProperty}
                                onViewNumber={onViewNumberProperty}
                                onToggleFavorite={onToggleFavorite}
                                currentLanguage={currentLanguage}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Action Chips */}
          {message.actions && message.actions.length > 0 && !message.selectedPropertyDetail && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
              {message.actions.map((act, i) => {
                if (act.action === 'enquire') {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onEnquireProperty(message.properties?.[0] || null as any)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 rounded-xl transition-all shadow-xs cursor-pointer"
                      style={{ minHeight: '40px' }}
                    >
                      <Phone className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{cleanActionLabel(act.label) === 'Enquire Now' ? 'Contact Agent' : cleanActionLabel(act.label)}</span>
                    </button>
                  );
                }

                if (act.action === 'post_property') {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onOpenPostPropertyModal?.()}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-[13px] font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition-all shadow-2xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                      style={{ minHeight: '40px' }}
                    >
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>{cleanActionLabel(act.label)}</span>
                    </button>
                  );
                }

                return (
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
