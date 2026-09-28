export type LanguageCode =
  | 'en'
  | 'hi'
  | 'te'
  | 'ta'
  | 'kn'
  | 'ml'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'ur'
  | 'pa'
  | 'or'
  | 'mwr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  speechCode: string;
  direction?: 'ltr' | 'rtl';
  welcomeGreeting: string;
  welcomeSubtitle: string;
  placeholder: string;
  suggestions: string[];
}

export interface ActionLink {
  label: string;
  url?: string;
  action?: 'call' | 'whatsapp' | 'explore' | 'loan' | 'contact' | 'bhoomi_pooja' | 'legal' | 'details' | 'enquire';
  icon?: string;
}

export interface PropertyItem {
  id: string;
  title: string;
  location: string;
  price: string;
  priceNumeric?: number;
  status: 'For Sale' | 'For Rent';
  badge?: string; // e.g. 'Ready to move', 'Owner · no brokerage'
  type: 'plot' | 'apartment' | 'villa';
  area: string; // e.g. '171 Sq.Yd.', '1326 Sq.Ft.'
  config?: string; // e.g. '2 BHK', 'Plot'
  facing?: string; // e.g. 'East', 'North-East'
  floor?: string; // e.g. '5 Floor'
  amenities: string[];
  moreAmenitiesCount?: number;
  images: string[];
  agent: {
    name: string;
    phone: string;
    role: string;
    avatar?: string;
  };
  overview: string;
  specifications: { label: string; value: string }[];
  about: string;
  nearby: string[];
  reraNumber?: string;
  approval?: string;
  isFavorite?: boolean;
}

export interface AttachedFile {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface UserAccount {
  name: string;
  email: string;
  phone: string;
  company: string;
  preferredType: string;
  budgetRange: string;
  preferredLocation: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language?: LanguageCode;
  actions?: ActionLink[];
  category?: string;
  properties?: PropertyItem[];
  selectedPropertyDetail?: PropertyItem;
  attachments?: AttachedFile[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messages: ChatMessageItem[];
  language: LanguageCode;
}
