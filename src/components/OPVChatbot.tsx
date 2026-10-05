import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Minus,
  User,
  Heart,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Building2,
  Home,
  Sprout,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EnquiryModal } from './EnquiryModal';
import { PropertyDetailModal } from './PropertyDetailModal';
import { AccountModal } from './AccountModal';
import {
  ChatMessageItem,
  ChatSession,
  LanguageCode,
  PropertyItem,
  UserAccount,
  AttachedFile
} from '../types/chat';
import { processChatQuery, processChatQueryAsync, getQuickTranslation } from '../utils/aiEngine';
import { getPropertiesForQuery, OPV_FALLBACK_IMAGE, updateActiveProperties } from '../data/propertyData';
import { fetchLiveSupabaseProperties } from '../services/supabaseService';
import { OPV_LANGUAGES } from '../data/chatConfig';
import { getDashboardStrings } from '../data/dashboardTranslations';

export const OPVChatbot: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const currentLangConfig = OPV_LANGUAGES.find(l => l.code === currentLanguage) || OPV_LANGUAGES[0];
  const locale = getDashboardStrings(currentLanguage);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('Hyderabad');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('opv_dark_mode') === 'true';
  });
  const [supabasePropertiesCount, setSupabasePropertiesCount] = useState<number>(0);

  // Shortlist State
  const [favorites, setFavorites] = useState<PropertyItem[]>(() => {
    const saved = localStorage.getItem('opv_favorites_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
    return [];
  });
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);

  // Load live Supabase properties on mount
  useEffect(() => {
    fetchLiveSupabaseProperties()
      .then(liveList => {
        if (liveList && liveList.length > 0) {
          updateActiveProperties(liveList);
          setSupabasePropertiesCount(liveList.length);
          if (!localStorage.getItem('opv_favorites_list')) {
            setFavorites(liveList.slice(0, 2));
          }
        }
      })
      .catch(err => console.warn('Could not load live Supabase properties:', err));
  }, []);

  // Modals state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedPropertyForEnquiry, setSelectedPropertyForEnquiry] = useState<PropertyItem | null>(null);
  const [detailModalProperty, setDetailModalProperty] = useState<PropertyItem | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // User Account Details (Aarna Infra Developers)
  const [userAccount, setUserAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('opv_user_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse account', e);
      }
    }
    return {
      name: 'Aarna Infra Developers',
      email: 'aarna.infra@gmail.com',
      phone: '+91 9963513939',
      company: 'Aarna Infra Developers Private Limited',
      preferredType: 'Open Plots & Commercial Lands',
      budgetRange: '₹25 Lakhs - ₹50 Lakhs',
      preferredLocation: 'Lemoor, Hyderabad'
    };
  });

  const defaultWelcomeMessage: ChatMessageItem = {
    id: 'msg-welcome-init',
    role: 'assistant',
    content: "Hi! I'm your property guide. Tell me what you're looking for and I'll help.",
    timestamp: new Date(),
    language: 'en'
  };

  // Chat sessions management - starts fresh with clean welcome hero
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('opv_chat_sessions_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid = (Array.isArray(parsed) ? parsed : [])
          .filter((s: any) => s && s.id !== 'session-welcome' && s.title !== 'New Search' && s.messages && s.messages.length > 0)
          .map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt || Date.now()),
            messages: (s.messages || []).map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp || Date.now())
            }))
          }));
        if (valid.length > 0) {
          return [
            {
              id: 'session-welcome',
              title: 'Welcome to OPV',
              createdAt: new Date(),
              language: 'en',
              messages: []
            },
            ...valid
          ];
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved sessions', e);
    }
    return [
      {
        id: 'session-welcome',
        title: 'Welcome to OPV',
        createdAt: new Date(),
        language: 'en',
        messages: []
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(sessions[0]?.id || 'session-welcome');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || {
    id: 'session-welcome',
    title: 'Welcome to OPV',
    createdAt: new Date(),
    language: 'en',
    messages: []
  };

  // Safe sync state to LocalStorage with quota protection & pruning (prevents QuotaExceededError crashes)
  useEffect(() => {
    try {
      const persistable = sessions
        .filter(s => s && s.id !== 'session-welcome' && s.messages && s.messages.length > 0 && s.title !== 'New Search')
        .slice(-15)
        .map(s => ({
          ...s,
          messages: (s.messages || []).slice(-30).map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            originalQuery: m.originalQuery,
            translatedQuery: m.translatedQuery,
            timestamp: m.timestamp,
            language: m.language,
            actions: m.actions,
            category: m.category,
            properties: m.properties ? m.properties.slice(0, 6) : undefined
          }))
        }));

      localStorage.setItem('opv_chat_sessions_v6', JSON.stringify(persistable));
    } catch (err) {
      console.warn('LocalStorage quota exceeded, pruning session storage:', err);
      try {
        const minimal = sessions
          .filter(s => s && s.id !== 'session-welcome' && s.messages && s.messages.length > 0)
          .slice(-5)
          .map(s => ({
            ...s,
            messages: (s.messages || []).slice(-10).map(m => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: m.timestamp,
              language: m.language
            }))
          }));
        localStorage.setItem('opv_chat_sessions_v6', JSON.stringify(minimal));
      } catch {
        // Silently continue without breaking React
      }
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('opv_user_account', JSON.stringify(userAccount));
    } catch { }
  }, [userAccount]);

  useEffect(() => {
    try {
      localStorage.setItem('opv_favorites_list', JSON.stringify(favorites.slice(0, 20)));
    } catch { }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('opv_dark_mode', String(isDarkMode));
    } catch { }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);

  const handleToggleFavorite = (property: PropertyItem) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  const handleSendMessage = (text: string, attachments?: AttachedFile[]) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    // Check instant local dictionary for immediate non-English display
    const quickTranslated = getQuickTranslation(text, currentLanguage);
    const initialContent = quickTranslated || text || 'Uploaded documents';

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessageItem = {
      id: userMsgId,
      role: 'user',
      content: initialContent,
      originalQuery: text,
      translatedQuery: quickTranslated || undefined,
      timestamp: new Date(),
      language: currentLanguage,
      attachments
    };

    // If session only has the greeting, set its title from the first user message
    const isFirstUserQuery = currentSession.messages.filter(m => m.role === 'user').length === 0;
    const newTitle = isFirstUserQuery
      ? initialContent.slice(0, 28) + (initialContent.length > 28 ? '...' : '')
      : currentSession.title;

    setSessions(prev =>
      prev.map(s =>
        s.id === currentSession.id
          ? {
            ...s,
            title: newTitle,
            messages: [...s.messages, userMsg]
          }
          : s
      )
    );

    setIsLoading(true);

    const conversationHistory = currentSession.messages
      .filter(m => m.content && m.content.trim())
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

    processChatQueryAsync(text, currentLanguage, conversationHistory)
      .then(aiResponse => {
        const matchedProperties = Array.isArray(aiResponse.properties)
          ? aiResponse.properties
          : (aiResponse.properties !== undefined ? aiResponse.properties : getPropertiesForQuery(text));

        const finalUserPrompt = aiResponse.translatedUserPrompt || quickTranslated;

        const assistantMsg: ChatMessageItem = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          language: currentLanguage,
          actions: aiResponse.actions,
          category: aiResponse.category,
          properties: matchedProperties && matchedProperties.length > 0 ? matchedProperties : undefined
        };

        setSessions(prev =>
          prev.map(s =>
            s.id === currentSession.id
              ? {
                ...s,
                title: (isFirstUserQuery && finalUserPrompt)
                  ? (finalUserPrompt.slice(0, 28) + (finalUserPrompt.length > 28 ? '...' : ''))
                  : s.title,
                messages: [
                  ...s.messages.map(m =>
                    m.id === userMsgId && finalUserPrompt
                      ? {
                        ...m,
                        content: finalUserPrompt,
                        translatedQuery: finalUserPrompt,
                        originalQuery: m.originalQuery || text
                      }
                      : m
                  ),
                  assistantMsg
                ]
              }
              : s
          )
        );
      })
      .catch(err => {
        console.error('Chat error:', err);
        const fallbackMsg: ChatMessageItem = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: 'I could not process that request right now. Please try again or connect with an OPV advisor.',
          timestamp: new Date(),
          language: currentLanguage
        };
        setSessions(prev =>
          prev.map(s =>
            s.id === currentSession.id
              ? {
                ...s,
                messages: [...s.messages, fallbackMsg]
              }
              : s
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    if (!newText.trim()) return;

    const msgIndex = currentSession.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const oldMsg = currentSession.messages[msgIndex];
    const quickTranslated = getQuickTranslation(newText, currentLanguage);
    const initialEditContent = quickTranslated || newText;

    const updatedUserMsg: ChatMessageItem = {
      ...oldMsg,
      content: initialEditContent,
      originalQuery: newText,
      translatedQuery: quickTranslated || undefined,
      timestamp: new Date()
    };

    // Keep all messages prior to the edited prompt, then append the updated prompt
    const previousMessages = currentSession.messages.slice(0, msgIndex);
    const updatedMessages = [...previousMessages, updatedUserMsg];

    setSessions(prev =>
      prev.map(s =>
        s.id === currentSession.id
          ? {
            ...s,
            messages: updatedMessages
          }
          : s
      )
    );

    setIsLoading(true);

    const conversationHistory = previousMessages
      .filter(m => m.content && m.content.trim())
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

    processChatQueryAsync(newText, currentLanguage, conversationHistory)
      .then(aiResponse => {
        const matchedProperties = Array.isArray(aiResponse.properties)
          ? aiResponse.properties
          : (aiResponse.properties !== undefined ? aiResponse.properties : getPropertiesForQuery(newText));

        const finalTranslatedPrompt = aiResponse.translatedUserPrompt || quickTranslated;

        const assistantMsg: ChatMessageItem = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          language: currentLanguage,
          actions: aiResponse.actions,
          category: aiResponse.category,
          properties: matchedProperties && matchedProperties.length > 0 ? matchedProperties : undefined
        };

        setSessions(prev =>
          prev.map(s =>
            s.id === currentSession.id
              ? {
                ...s,
                title: (msgIndex === 1 && finalTranslatedPrompt)
                  ? (finalTranslatedPrompt.slice(0, 28) + (finalTranslatedPrompt.length > 28 ? '...' : ''))
                  : s.title,
                messages: [
                  ...updatedMessages.map(m =>
                    m.id === messageId && finalTranslatedPrompt
                      ? {
                        ...m,
                        content: finalTranslatedPrompt,
                        translatedQuery: finalTranslatedPrompt,
                        originalQuery: newText
                      }
                      : m
                  ),
                  assistantMsg
                ]
              }
              : s
          )
        );
      })
      .catch(err => {
        console.error('Chat edit error:', err);
        const fallbackMsg: ChatMessageItem = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: 'I could not process that request right now. Please try again or connect with an OPV advisor.',
          timestamp: new Date(),
          language: currentLanguage
        };
        setSessions(prev =>
          prev.map(s =>
            s.id === currentSession.id
              ? {
                ...s,
                messages: [...updatedMessages, fallbackMsg]
              }
              : s
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegenerate = (assistantMessageId: string) => {
    const msgIndex = currentSession.messages.findIndex(m => m.id === assistantMessageId);
    if (msgIndex === -1) return;

    // Find the closest user query before this assistant message
    const prevMessages = currentSession.messages.slice(0, msgIndex);
    const lastUserMsg = [...prevMessages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;

    setIsLoading(true);

    const conversationHistory = prevMessages
      .filter(m => m.content && m.content.trim())
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

    const queryToSend = lastUserMsg.originalQuery || lastUserMsg.content;

    processChatQueryAsync(queryToSend, currentLanguage, conversationHistory)
      .then(aiResponse => {
        const matchedProperties = Array.isArray(aiResponse.properties)
          ? aiResponse.properties
          : (aiResponse.properties !== undefined ? aiResponse.properties : getPropertiesForQuery(lastUserMsg.content));

        const updatedAssistantMsg: ChatMessageItem = {
          id: assistantMessageId,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          language: currentLanguage,
          actions: aiResponse.actions,
          category: aiResponse.category,
          properties: matchedProperties && matchedProperties.length > 0 ? matchedProperties : undefined
        };

        setSessions(prev =>
          prev.map(s =>
            s.id === currentSession.id
              ? {
                ...s,
                messages: s.messages.map(m => m.id === assistantMessageId ? updatedAssistantMsg : m)
              }
              : s
          )
        );
      })
      .catch(err => {
        console.error('Regenerate error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSelectPropertyDetails = (property: PropertyItem) => {
    const isTe = currentLanguage === 'te';
    const isTa = currentLanguage === 'ta';
    const isHi = currentLanguage === 'hi';

    const userPromptText = isTe
      ? `${property.title} వివరాలు చూపించండి`
      : isTa
        ? `${property.title} விவரங்களைக் காட்டு`
        : isHi
          ? `${property.title} का विवरण दिखाएं`
          : `Show details for ${property.title}`;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userPromptText,
      originalQuery: `Show details for ${property.title}`,
      timestamp: new Date(),
      language: currentLanguage
    };

    const bookVisitLabel = isTe
      ? `${property.area} కోసం సైట్ విజిట్ బుక్ చేయండి`
      : isTa
        ? `${property.area} தளப் பார்வை முன்பதிவு`
        : isHi
          ? `${property.area} के लिए साइट विजिट बुक करें`
          : `Book Site Visit for ${property.area}`;

    const waLabel = isTe
      ? 'వాట్సాప్‌లో చాట్ చేయండి'
      : isTa
        ? 'வாட்ஸ்அப்பில் அரட்டையடிக்கவும்'
        : isHi
          ? 'व्हाट्सएप पर चैट करें'
          : 'Chat on WhatsApp';

    const assistantMsg: ChatMessageItem = {
      id: `assistant-${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      language: currentLanguage,
      selectedPropertyDetail: property,
      actions: [
        { label: bookVisitLabel, action: 'details' },
        {
          label: waLabel,
          url: `https://wa.me/919963513939?text=Interested%20in%20${encodeURIComponent(property.title)}`,
          action: 'whatsapp'
        }
      ]
    };

    setSessions(prev =>
      prev.map(s =>
        s.id === currentSession.id
          ? {
            ...s,
            messages: [...s.messages, userMsg, assistantMsg]
          }
          : s
      )
    );
  };

  const handleEnquireProperty = (property: PropertyItem) => {
    setSelectedPropertyForEnquiry(property);
    setIsEnquiryModalOpen(true);
  };

  const handleNewChat = () => {
    if (currentSession.messages.length === 0) {
      return;
    }
    const cleanSessions = sessions.filter(s => s.messages && s.messages.length > 0 && s.title !== 'New Search');
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: locale.newChat,
      createdAt: new Date(),
      language: currentLanguage,
      messages: []
    };
    setSessions([newSession, ...cleanSessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: locale.newChat,
          createdAt: new Date(),
          language: currentLanguage,
          messages: []
        };
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === sessionId) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearHistory = () => {
    if (window.confirm(locale.clearHistoryConfirm)) {
      const freshSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: locale.newChat,
        createdAt: new Date(),
        language: currentLanguage,
        messages: []
      };
      setSessions([freshSession]);
      setCurrentSessionId(freshSession.id);
      localStorage.removeItem('opv_chat_sessions_v6');
    }
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    const newLocale = getDashboardStrings(lang);
    setSessions(prev =>
      prev.map(s =>
        s.id === currentSession.id
          ? {
            ...s,
            language: lang,
            title: (s.title === 'New Chat' || s.title === 'New Search' || !s.messages || s.messages.length === 0)
              ? newLocale.newChat
              : s.title
          }
          : s
      )
    );
  };

  // Quick suggestion button options in square form matching reference, dynamically localized
  const chipIcons = [Building2, MapPin, Home, Sprout, Store];
  const suggestionChips = (currentLangConfig.suggestions && currentLangConfig.suggestions.length > 0 && currentLanguage !== 'en')
    ? currentLangConfig.suggestions.slice(0, 5).map((sug, idx) => ({
      label: sug,
      query: sug,
      icon: chipIcons[idx % chipIcons.length]
    }))
    : [
      {
        label: 'Apartments in Hyderabad',
        query: 'apartments in hyd',
        icon: Building2,
        subtitle: '2, 3 & 4 BHK High-rises'
      },
      {
        label: 'Open Plots in Hyd',
        query: 'open plots in Hyd',
        icon: MapPin,
        subtitle: 'HMDA & DTCP Approved'
      },
      {
        label: 'Gated Luxury Villas',
        query: 'gated luxury villas in hyderabad',
        icon: Home,
        subtitle: 'Kokapet, Tellapur, Mokila'
      },
      {
        label: 'Farm Lands',
        query: 'farm lands in hyderabad',
        icon: Sprout,
        subtitle: 'Agriculture & Farm Houses'
      },
      {
        label: 'Commercial Plots',
        query: 'commercial properties in hyd',
        icon: Store,
        subtitle: 'offices & Retail Shops'
      },
      {
        label: '360° Elite Services',
        query: '360 elite services',
        icon: Sparkles,
        subtitle: 'Property buying & Selling '

      },
    ];

  return (
    <div
      className={`flex h-screen h-[100dvh] w-screen overflow-hidden ${isDarkMode ? 'dark bg-[#0e131f] text-slate-100' : 'bg-[#fafafa] text-slate-900'
        } font-sans`}
    >
      {/* Square Yards Style Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSession.id}
        onSelectSession={id => setCurrentSessionId(id)}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        onDeleteSession={handleDeleteSession}
        account={userAccount}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        selectedCity={selectedCity}
        onSelectCity={city => setSelectedCity(city)}
        favoritesCount={favorites.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        currentLanguage={currentLanguage}
      />

      {/* Main Chat Workspace matching Square Yards AI layout */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#ffffff] dark:bg-[#0e131f] relative overflow-hidden">

        {/* Top Header */}
        <header className="h-[60px] shrink-0 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0e131f]/95 backdrop-blur-md sticky top-0 z-20">
          {/* Left: Mobile hamburger + Status dot + Title & Subtitle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Live Status Dot */}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-sm animate-pulse" />

            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 leading-snug">
                <span>{currentLanguage === 'en' ? 'Open Plots & Villas' : locale.brandTitle}</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">• {locale.brandSubtitle}</span>
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 leading-none">
                {locale.headerTagline}
              </div>
            </div>
          </div>

          {/* Right Corner: Empty container keeping header alignment clean */}
          <div className="flex items-center gap-2" />
        </header>

        {/* Main Content Area: Welcome to OPV Plots Hero Landing if no messages, or Conversation Stream if active */}
        {currentSession.messages.length === 0 ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto">
            <div className="w-full max-w-3xl sm:max-w-[760px] flex flex-col items-center text-center -translate-y-6 sm:-translate-y-10 my-auto">
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-3 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{locale.platformBadge}</span>
              </div>

              {/* Hero Heading: Hello! (top) + OPV Plots AI Assistance (below) */}
              <h1 className="tracking-tight text-center mb-2.5">
                {currentLanguage === 'en' ? (
                  <>
                    <span className="block text-lg sm:text-2xl font-bold text-slate-700 dark:text-slate-200 mb-0.5">
                      Hello!
                    </span>
                    <span className="block text-2xl sm:text-[34px] font-black text-slate-900 dark:text-white leading-tight">
                      OPV <span className="text-emerald-600 dark:text-emerald-400">AI Assistant</span>
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {currentLangConfig.welcomeGreeting}
                  </span>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 text-center max-w-xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed">
                {currentLangConfig.welcomeSubtitle}
              </p>

              {/* Centered User Prompt Bar with balanced, compact length */}
              <div className="w-full max-w-3xl sm:max-w-[740px] mx-auto mb-6" style={{ marginBottom: '24px' }}>
                <ChatInput
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  selectedCity={selectedCity}
                  isDarkMode={isDarkMode}
                  placeholder={currentLangConfig.placeholder}
                  containerClassName="max-w-3xl sm:max-w-[740px]"
                />
              </div>

              {/* Quick-Action Options matching exact specs: White bg, thin dark-gray border, 10px rounded, 40px height, ~140px width */}
              <div className="w-full max-w-3xl sm:max-w-[740px] mx-auto px-3 sm:px-6 pt-2" style={{ marginTop: '24px' }}>
                <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
                  {suggestionChips.map((chip, idx) => {
                    const ChipIcon = chip.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(chip.query)}
                        className="inline-flex items-center justify-center gap-2 h-[40px] min-w-[140px] px-3.5 rounded-[10px] bg-white hover:bg-slate-50 dark:bg-[#151c2c] dark:hover:bg-[#1e2738] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer text-xs font-semibold shrink-0"
                        style={{
                          backgroundColor: '#ffffff',
                          borderColor: '#cbd5e1',
                          borderRadius: '10px',
                          height: '40px',
                          minWidth: '140px'
                        }}
                      >
                        <ChipIcon className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0 stroke-[2]" />
                        <span className="whitespace-nowrap">{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Conversation Stream - Centered in middle screen */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 px-3 sm:px-6 py-6 flex flex-col items-center">
              <div className="w-full max-w-4xl space-y-6">
                {currentSession.messages.map(msg => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    currentLanguage={currentLanguage}
                    onSelectPropertyDetails={handleSelectPropertyDetails}
                    onEnquireProperty={handleEnquireProperty}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenPropertyModal={prop => setDetailModalProperty(prop)}
                    onEditMessage={handleEditMessage}
                    onRegenerate={handleRegenerate}
                  />
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="py-2 flex items-center justify-center gap-2.5 text-xs text-slate-500">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>{locale.searchingListings}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Pinned Bottom Input Bar - Centered in middle screen */}
            <div className="w-full bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#0e131f] dark:via-[#0e131f]/95 dark:to-transparent pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center">
              {/* Quick Suggestion Options matching Reference Style */}
              <div className="w-full max-w-4xl px-3 sm:px-6 pb-2.5 overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 flex-nowrap">
                {suggestionChips.map((chip, idx) => {
                  const ChipIcon = chip.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(chip.query)}
                      className="inline-flex items-center justify-center gap-2 h-[40px] min-w-[140px] px-3.5 rounded-[10px] bg-white hover:bg-slate-50 dark:bg-[#151c2c] dark:hover:bg-[#1e2738] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer text-xs font-semibold shrink-0"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#cbd5e1',
                        borderRadius: '10px',
                        height: '40px',
                        minWidth: '140px'
                      }}
                    >
                      <ChipIcon className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0 stroke-[2]" />
                      <span className="whitespace-nowrap">{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="w-full max-w-4xl">
                <ChatInput
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  selectedCity={selectedCity}
                  isDarkMode={isDarkMode}
                  placeholder={currentLangConfig.placeholder}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Shortlist Slide-over Drawer */}
      {isShortlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsShortlistOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#111622] h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800">
            {/* Shortlist Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Shortlisted Properties ({favorites.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShortlistOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shortlist List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {favorites.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">
                    No shortlisted properties yet
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Click the heart icon on any property card to save it here.
                  </p>
                </div>
              ) : (
                favorites.map(property => (
                  <div
                    key={property.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:shadow-xs transition-all flex gap-3"
                  >
                    <img
                      src={property.images?.[0] || OPV_FALLBACK_IMAGE}
                      alt={property.title}
                      onError={e => {
                        e.currentTarget.src = OPV_FALLBACK_IMAGE;
                      }}
                      className="w-20 h-20 rounded-lg object-cover shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {property.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {property.location}
                      </p>
                      <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {property.price}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsShortlistOpen(false);
                            handleSelectPropertyDetails(property);
                          }}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsShortlistOpen(false);
                            handleEnquireProperty(property);
                          }}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          Enquire
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(property)}
                          className="p-1 text-slate-400 hover:text-rose-500 ml-auto cursor-pointer"
                          title="Remove from shortlist"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Property Details Modal Popup */}
      <PropertyDetailModal
        isOpen={!!detailModalProperty}
        onClose={() => setDetailModalProperty(null)}
        property={detailModalProperty}
        currentLanguage={currentLanguage}
        onEnquire={prop => {
          setDetailModalProperty(null);
          handleEnquireProperty(prop);
        }}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        property={selectedPropertyForEnquiry}
      />

      {/* Account Details Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        account={userAccount}
        onSaveAccount={updated => setUserAccount(updated)}
      />
    </div>
  );
};
