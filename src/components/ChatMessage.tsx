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
import { OPV_LANGUAGES } from '../data/opvKnowledge';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailView } from './PropertyDetailView';

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

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        return <Phone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'legal':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />;
      case 'loan':
        return <Landmark className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5 text-slate-500" />;
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
            className="my-2 pl-3 py-1 border-l-2 border-[#eab308] bg-amber-50/60 text-slate-800 text-xs sm:text-sm rounded-r-md"
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
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-amber-700 hover:text-amber-800 underline underline-offset-2 font-semibold">$1</a>');
  };

  // If this is a User Message: render yellow bubble matching Images 2 & 3
  if (!isAssistant) {
    return (
      <div className="py-2 px-2 sm:px-4 max-w-4xl mx-auto flex items-center justify-end gap-2.5">
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
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span className="font-semibold">{att.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Yellow User Message Bubble (matching Reference Image 2 & 3: bg-[#f5c344]) */}
          <div className="bg-[#f5c344] text-[#1a1718] px-5 py-2.5 rounded-2xl shadow-xs text-sm sm:text-[15px] font-medium break-words">
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
    <div className="py-2 px-2 sm:px-4 max-w-4xl mx-auto">
      {/* Square Yards style row: Avatar OPV (like SY) + Speech Bubble */}
      <div className="flex items-start gap-3">
        {/* Dark Circle/Square Avatar with OPV / SY */}
        <div className="w-7 h-7 rounded-lg bg-[#1a1718] text-white flex items-center justify-center font-bold text-xs tracking-tight shrink-0 shadow-xs mt-0.5">
          OPV
        </div>

        {/* Speech Bubble & Content Area */}
        <div className="flex-1 min-w-0">
          {message.content && (
            <div className="inline-block bg-white dark:bg-[#1a2234] border border-slate-200/90 dark:border-slate-800 rounded-2xl rounded-tl-xs px-4 py-3 text-slate-800 dark:text-slate-100 text-sm sm:text-[15px] shadow-xs leading-relaxed max-w-2xl">
              <div className="text-slate-800 dark:text-slate-200 text-sm">
                {renderFormattedContent(message.content)}
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
            <div className="mt-4">
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
            <div className="mt-3 flex flex-wrap gap-2">
              {message.actions.map((act, i) => (
                <a
                  key={i}
                  href={act.url}
                  target={act.url?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition-all shadow-2xs"
                >
                  {getActionIcon(act.action)}
                  <span>{act.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
