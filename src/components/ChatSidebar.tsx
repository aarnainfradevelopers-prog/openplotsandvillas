import React from 'react';
import { Plus, X, Trash2, MessageSquare, Sparkles } from 'lucide-react';
import { ChatSession, LanguageCode } from '../types/chat';
import { getDashboardStrings } from '../data/dashboardTranslations';
import { getQuickTranslation } from '../utils/aiEngine';

export interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  onDeleteSession?: (id: string) => void;
  account?: any;
  onOpenAccount?: () => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  favoritesCount?: number;
  onOpenShortlist?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentLanguage?: LanguageCode;
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
  isDarkMode = false,
  currentLanguage = 'en'
}) => {
  const locale = getDashboardStrings(currentLanguage);

  // Helper to dynamically display localized session title
  const getSessionDisplayTitle = (session: ChatSession): string => {
    if (!session.title || session.title === 'New Chat' || session.title === 'New Search') {
      return locale.newChat;
    }
    // Check if the first user message has a translated query
    if (currentLanguage !== 'en' && session.messages && session.messages.length > 0) {
      const firstUserMsg = session.messages.find(m => m.role === 'user');
      if (firstUserMsg?.translatedQuery) {
        return firstUserMsg.translatedQuery.slice(0, 28) + (firstUserMsg.translatedQuery.length > 28 ? '...' : '');
      }
    }
    // Check instant quick translation dictionary
    if (currentLanguage !== 'en') {
      const quick = getQuickTranslation(session.title, currentLanguage);
      if (quick) {
        return quick.slice(0, 28) + (quick.length > 28 ? '...' : '');
      }
    }
    return session.title;
  };

  // Only display real chats in Recent Chats (remove any empty "New Search" entries)
  const displaySessions = sessions.filter(
    session => session.messages && session.messages.length > 0 && session.title !== 'New Search'
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Clean Sidebar: Logo, + New Chat, and Recent Chats */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 ${
          isDarkMode ? 'bg-[#111622] border-slate-800 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800'
        } border-r z-50 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } text-xs`}
      >
        {/* Top Header with OPV Logo & + New Chat */}
        <div className="p-4 flex flex-col gap-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between">
            {/* OPV Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs tracking-wider shadow-xs">
                OPV
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-sm tracking-tight text-slate-950 dark:text-white block">
                  {currentLanguage === 'en' ? 'Open Plots & Villas' : locale.brandTitle}
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">{locale.brandSubtitle}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 lg:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* + New Chat Box Card - Styled matching Reference Image 1 */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#e3eae1] hover:bg-[#d8e2d5] dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-[#c9d5c7] dark:border-emerald-800/60 text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-98 group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-emerald-900/60 flex items-center justify-center shrink-0 text-emerald-800 dark:text-emerald-300 shadow-2xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span>{locale.newChat}</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5 font-normal truncate">
                {locale.startFreshSearch}
              </div>
            </div>
          </button>
        </div>

        {/* Recent Chats Section directly below New Chat */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
            <span>{locale.recentChats}</span>
            {displaySessions.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title={locale.clearAllChatsTooltip}
                className="hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-500" />
              </button>
            )}
          </div>

          {/* Recent Chat Button Cards - Only real chats */}
          <div className="space-y-1.5">
            {displaySessions.length === 0 ? (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 px-2 py-4 text-center italic">
                {locale.noRecentChats}
              </div>
            ) : (
              displaySessions.map(session => (
                <div
                  key={session.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectSession(session.id);
                      onClose();
                    }
                  }}
                  className={`group w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all duration-150 cursor-pointer border ${
                    session.id === currentSessionId
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/80 text-emerald-950 dark:text-emerald-100 font-bold shadow-2xs'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-950 dark:hover:text-white shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        session.id === currentSessionId
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{getSessionDisplayTitle(session)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    title={locale.deleteChatTooltip}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1 rounded-md text-slate-400 transition-all shrink-0 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

