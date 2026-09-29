import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Plus, X, FileText, Image as ImageIcon } from 'lucide-react';
import { MicrophoneButton } from './MicrophoneButton';
import { LanguageDropdown } from './LanguageDropdown';
import { LanguageCode, AttachedFile } from '../types/chat';
import { OPV_LANGUAGES } from '../data/opvKnowledge';

interface ChatInputProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSendMessage: (content: string, attachments?: AttachedFile[]) => void;
  isLoading: boolean;
  selectedCity?: string;
  isDarkMode?: boolean;
  placeholder?: string;
  containerClassName?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  currentLanguage,
  onLanguageChange,
  onSendMessage,
  isLoading,
  selectedCity = 'Hyderabad',
  isDarkMode = false,
  placeholder,
  containerClassName
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(Math.max(textareaRef.current.scrollHeight, 24), 140)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!inputText.trim() && attachedFiles.length === 0) || isLoading) return;
    onSendMessage(inputText.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
    setInputText('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText(prev => {
      const separator = prev && !prev.endsWith(' ') ? ' ' : '';
      return `${prev}${separator}${transcript}`;
    });
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttachments: AttachedFile[] = files.map(file => {
      const sizeKb = Math.round(file.size / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
      return {
        name: file.name,
        size: sizeStr,
        type: file.type || 'document',
        url: URL.createObjectURL(file)
      };
    });

    setAttachedFiles(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`w-full ${containerClassName || 'max-w-4xl'} mx-auto px-3 sm:px-6 pb-3`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Distinctive green bordered input box matching OPV Plots brand */}
      <div
        className={`relative rounded-2xl border-2 transition-all duration-200 ${
          isDarkMode
            ? 'bg-[#151c2c] border-emerald-500 text-slate-100 shadow-sm'
            : 'bg-white border-emerald-500 text-slate-800 shadow-xs'
        } p-2.5 sm:p-3`}
      >
        {/* Attached Files Preview Bar */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-2xs"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                )}
                <span className="truncate max-w-[130px] font-medium">{file.name}</span>
                <span className="text-[10px] text-slate-400">({file.size})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Bar Row */}
        <div className="flex items-center gap-2">
          {/* File Upload Option (+) */}
          <button
            type="button"
            onClick={handleTriggerUpload}
            title="Attach documents, floor plans, or photos"
            aria-label="Upload files"
            className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 font-bold" />
          </button>

          {/* Text Input area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || `Ask about property in ${selectedCity}…`}
            className="flex-1 bg-transparent border-0 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm sm:text-[15px] resize-none leading-relaxed py-1 min-h-[26px] max-h-32 font-normal"
          />

          {/* Right Action Controls: Microphone, Language Dropdown, Send Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Microphone Voice Input */}
            <MicrophoneButton
              currentLanguage={currentLanguage}
              onTranscript={handleVoiceTranscript}
              onSendMessage={onSendMessage}
            />

            {/* 2. Language Dropdown after microphone */}
            <LanguageDropdown
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              dropDirection="up"
            />

            {/* 3. Green Send Button matching OPV Plots brand */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={(!inputText.trim() && attachedFiles.length === 0) || isLoading}
              aria-label="Send message"
              title="Send message"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs ${
                (inputText.trim() || attachedFiles.length > 0) && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white scale-105 active:scale-95'
                  : 'bg-emerald-600 text-white opacity-90 hover:opacity-100'
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#ffffff" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
