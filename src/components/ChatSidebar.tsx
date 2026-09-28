import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Moon,
  Sun,
  MapPin,
  Heart,
  Search,
  ChevronDown,
  X,
  Trash2,
  Building2
} from 'lucide-react';
import { ChatSession, UserAccount } from '../types/chat';

export interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  onDeleteSession?: (id: string) => void;
  account?: UserAccount;
  onOpenAccount?: () => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  favoritesCount?: number;
  onOpenShortlist?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onClearHistory,
  onDeleteSession = () => {},
  account = { name: 'Investor Account', email: 'investor@example.com', phone: '', savedSearches: [] },
  onOpenAccount = () => {},
  selectedCity = 'Hyderabad',
  onSelectCity = () => {},
  favoritesCount = 0,
  onOpenShortlist = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {}
}) => {
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const cityMenuRef = useRef<HTMLDivElement>(null);

  const hyderabadZones = [
    { name: 'Hyderabad (All)', count: '31K' },
    { name: 'Shadnagar', count: '4.8K' },
    { name: 'Mokila & Shankarpally', count: '3.2K' },
    { name: 'Lemoor & Srisailam Hwy', count: '2.5K' },
    { name: 'Kollur & Tellapur', count: '5.1K' },
    { name: 'Financial District', count: '8.4K' },
    { name: 'Kondapur & Gachibowli', count: '12K' },
    { name: 'Patancheru & Kandi', count: '2.1K' },
    { name: 'Medchal & Kompally', count: '3.6K' },
    { name: 'Bangalore', count: '64K' },
    { name: 'Mumbai', count: '92K' },
    { name: 'Delhi NCR', count: '55K' },
    { name: 'Pune', count: '45K' }
  ];

  const filteredCities = hyderabadZones.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityMenuRef.current && !cityMenuRef.current.contains(event.target as Node)) {
        setIsCityMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar matching Square Yards exact structure & OPV identity */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 ${
          isDarkMode ? 'bg-[#111622] border-slate-800 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800'
        } border-r z-50 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } text-xs`}
      >
        {/* Top Header with OPV Logo (Square Yards Style) */}
        <div className="p-4 flex flex-col gap-3.5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            {/* OPV Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs tracking-wider shadow-xs">
                OPV
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-sm tracking-tight text-slate-950 block">
                  Open Plots & Villas
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">Real Estate AI</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Row: Light Mode / Dark Mode Toggle (Square Yards Style) */}
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-xs font-medium text-slate-500">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-11 h-6 rounded-full bg-slate-200 p-0.5 transition-colors flex items-center relative cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center transition-transform ${
                  isDarkMode ? 'translate-x-5 bg-slate-900 text-amber-300' : 'translate-x-0 text-amber-500'
                }`}
              >
                {isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              </div>
            </button>
          </div>

          {/* + New Search Button (Square Yards Style) */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 font-bold" />
            <span>New Search</span>
          </button>

          {/* City Dropdown Selector (Square Yards Style) */}
          <div className="relative" ref={cityMenuRef}>
            <button
              type="button"
              onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{selectedCity}</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isCityMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* City Dropdown Menu */}
            {isCityMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-slate-100 flex items-center gap-1.5 bg-slate-50">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={e => setCitySearch(e.target.value)}
                    placeholder="Search location..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  {filteredCities.map(city => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        onSelectCity(city.name);
                        setIsCityMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedCity === city.name ? 'font-bold text-emerald-700 bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{city.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{city.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Shortlist Button (Square Yards Style) */}
          <button
            type="button"
            onClick={onOpenShortlist}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              <span>Shortlist</span>
            </span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

        {/* Recent Chats Section (Square Yards Style) */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
            <span>Recent Chats</span>
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title="Clear all chats"
                className="hover:text-rose-500 p-0.5 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-500" />
              </button>
            )}
          </div>

          <div className="space-y-1">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
                className={`group w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-1.5 transition-colors cursor-pointer ${
                  session.id === currentSessionId
                    ? 'bg-slate-100 text-slate-950 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${session.id === currentSessionId ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="truncate">{session.title}</span>
                </div>
                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    title="Delete chat"
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-600 p-0.5 rounded text-slate-400 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Profile / Account Badge */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onOpenAccount}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 transition-all text-left group shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {account?.name ? account.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {account?.name || 'Aarna Infra Developers'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">Pro</div>
              </div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
