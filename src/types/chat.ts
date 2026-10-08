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
  | 'mwr'
  | 'as'   // Assamese
  | 'mai'  // Maithili
  | 'sat'  // Santali
  | 'ks'   // Kashmiri
  | 'bho'  // Bhojpuri
  | 'ne'   // Nepali
  | 'sd'   // Sindhi
  | 'kok'  // Konkani
  | 'bgc'  // Haryanvi
  | 'hne'  // Chhattisgarhi
  | 'tcy'; // Tulu


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
  action?: 'call' | 'whatsapp' | 'explore' | 'loan' | 'contact' | 'bhoomi_pooja' | 'legal' | 'details' | 'enquire' | 'post_property';
  icon?: string;
}

export interface StructuredPropertyDetails {
  postedDate?: string;
  postedTime?: string;
  propId?: string;
  propertyType?: string;
  quotedPrice?: string;
  plotSize?: string;
  totalPrice?: string;
  projectName?: string;
  city?: string;
  zone?: string;
  location?: string;
  landmark?: string;
  facing?: string;
}

export type BuyerLeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up'
  | 'Site Visit Scheduled'
  | 'Interested'
  | 'Negotiation'
  | 'Closed'
  | 'Not Interested';

export type SellerListingStatus =
  | 'Pending'
  | 'Under Review'
  | 'Verified'
  | 'Active'
  | 'Rejected'
  | 'Sold'
  | 'Inactive';

export type SellerType = 'Owner' | 'Agent' | 'Builder' | 'Developer';

// TAB 1: SELLERS (Google Sheets Structure)
export interface SellerRecord {
  sellerId: string;
  sellerName: string;
  sellerType: SellerType | string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  sellerAddress: string;
  propertyId: string;
  propertyType: string;
  propertyTitle: string;
  propertyAddress: string;
  city: string;
  state: string;
  createdDate: string;
  verificationStatus: SellerListingStatus;
  listingStatus: SellerListingStatus;
}

// TAB 2: BUYERS (Google Sheets Structure)
export interface BuyerLeadRecord {
  buyerLeadId: string;
  buyerName: string;
  email: string;
  phoneNumber: string;
  city: string;
  preferredLocation: string;
  propertyType: string;
  budget: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
  source: string;
  enquiryDate: string;
  leadStatus: BuyerLeadStatus;
  assignedTo: string;
  notes: string;
}

// TAB 3: PROPERTIES (Google Sheets Structure)
export interface PropertyRecord {
  propertyId: string;
  propertyType: string;
  propertyTitle: string;
  price: string;
  area: string;
  areaUnit: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  sellerId: string;
  sellerName: string;
  approvalType: string;
  reraNumber?: string;
  hmdaNumber?: string;
  dtcpNumber?: string;
  listingStatus: SellerListingStatus;
  verificationStatus: SellerListingStatus;
  createdDate: string;
}

// TAB 4: ENQUIRIES (Google Sheets Structure)
export interface EnquiryRecord {
  enquiryId: string;
  buyerLeadId: string;
  buyerName: string;
  buyerPhone: string;
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
  sellerName: string;
  enquiryType: string;
  message: string;
  date: string;
  time: string;
  status: BuyerLeadStatus;
  assignedTo: string;
  followUpDate: string;
  notes: string;
}

export interface PropertyItem {
  id: string;
  title: string;
  location: string;
  price: string;
  priceNumeric?: number;
  status: 'For Sale' | 'For Rent';
  badge?: string; // e.g. 'Ready to move', 'Owner · no brokerage'
  type: 'plot' | 'apartment' | 'villa' | 'commercial' | 'farmland' | string;
  area: string; // e.g. '171 Sq.Yd.', '1326 Sq.Ft.'
  size?: string;
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
  possession?: string;
  bhk?: number | string;
  isFavorite?: boolean;
  rawDetails?: StructuredPropertyDetails;
  websiteUrl?: string;

  // Pan-India & Lead Management Attributes
  propertyId?: string;
  sellerId?: string;
  sellerName?: string;
  sellerType?: SellerType | string;
  city?: string;
  state?: string;
  locality?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isNearby?: boolean;
  nearbyDistanceKm?: number;
  nearbyNote?: string;
  verificationStatus?: SellerListingStatus;
  listingStatus?: SellerListingStatus;
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
  originalQuery?: string;
  translatedQuery?: string;
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
