import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { OPV_LANGUAGES } from '../data/chatConfig';
import { LanguageCode } from '../types/chat';

interface LanguageDropdownProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  variant?: 'compact' | 'full' | 'header';
  dropDirection?: 'up' | 'down';
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLanguage,
  onLanguageChange,
  dropDirection = 'down'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = OPV_LANGUAGES.find(l => l.code === currentLanguage) || OPV_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors text-xs font-semibold focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Change conversation language"
      >
        <Globe className="w-3.5 h-3.5 text-slate-500" />
        <span className="truncate max-w-[70px] sm:max-w-none">
          {selectedLang.label}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            dropDirection === 'up' ? 'right-0 bottom-full mb-2' : 'right-0 mt-2'
          } w-52 rounded-2xl bg-white border border-slate-200 shadow-xl py-1 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800`}
          role="listbox"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
            Select Language (13 Languages)
          </div>

          <div className="max-h-[300px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-300">
            {OPV_LANGUAGES.map(lang => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between group ${
                    isSelected
                      ? 'bg-slate-100 text-slate-950 font-bold border-l-2 border-emerald-500'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="tracking-wide">
                    {lang.label}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
