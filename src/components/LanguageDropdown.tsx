import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { OPV_LANGUAGES } from '../data/chatConfig';
import { LanguageCode } from '../types/chat';

interface LanguageDropdownProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  variant?: 'compact' | 'full' | 'header';
  dropDirection?: 'up' | 'down';
}

/**
 * Extracts native language script and English phonetic name for clean two-line presentation
 */
const parseLanguageLabel = (label: string, code: string) => {
  const match = label.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      native: match[1].trim(),
      english: match[2].trim()
    };
  }
  return {
    native: label.trim(),
    english: code.toUpperCase()
  };
};

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLanguage,
  onLanguageChange,
  dropDirection = 'down'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLang =
    OPV_LANGUAGES.find(l => l.code === currentLanguage) ||
    OPV_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredLanguages = OPV_LANGUAGES.filter(lang => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.label.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-w-[130px] sm:min-w-[150px] rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs font-semibold focus:outline-none shadow-2xs cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Change conversation language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />

        <span className="truncate max-w-[95px] sm:max-w-none text-slate-800 dark:text-slate-100 font-medium">
          {selectedLang.label}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-auto ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Medium Size Dropdown Card */}
      {isOpen && (
        <div
          className={`absolute ${
            dropDirection === 'up'
              ? 'right-0 sm:right-[-6px] bottom-full mb-3'
              : 'right-0 sm:right-[-6px] mt-2'
          } w-[330px] sm:w-[360px] max-w-[calc(100vw-24px)] bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col`}
          role="listbox"
        >
          {/* Header with Title and Language Count */}
          <div className="px-4 pt-3.5 pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-800 dark:text-slate-200">
                  Select Language
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                {filteredLanguages.length} {filteredLanguages.length === 1 ? 'Language' : 'Languages'}
              </span>
            </div>

            {/* Clean, Non-Intrusive Search Input with Guaranteed Spacing */}
            <div className="relative mt-2">
              <Search
                className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search language..."
                style={{
                  paddingLeft: '38px',
                  paddingRight: '30px',
                  paddingTop: '7px',
                  paddingBottom: '7px',
                  height: '34px'
                }}
                className="w-full text-xs font-normal bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Spacious Language Cards List */}
          <div className="max-h-[320px] overflow-y-auto p-2.5 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map(lang => {
                const isSelected = lang.code === currentLanguage;
                const { native, english } = parseLanguageLabel(lang.label, lang.code);

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/80 shadow-2xs'
                        : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xs'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {/* Left: Code Avatar + Native & English Text */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center uppercase shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200'
                        }`}
                      >
                        {lang.code}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-snug truncate">
                          {native}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
                          {english}
                        </span>
                      </div>
                    </div>

                    {/* Right: Selected Check Indicator */}
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No languages found matching &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};