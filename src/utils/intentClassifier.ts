/**
 * OPV Chatbot Intent Understanding & Classification Engine
 *
 * Streamlined strictly for Supabase database property & project queries.
 * Zero built-in website answers or static website knowledge.
 */

export type IntentType =
  | 'PROPERTY_SEARCH'
  | 'PROJECT_INFORMATION'
  | 'OPV_SERVICES'
  | 'GENERAL_INQUIRY'
  | 'GREETING'
  | 'OUT_OF_SCOPE'
  | 'COMPETITOR';

export interface ClassifiedIntent {
  intent: IntentType;
  normalizedQuery: string;
  originalQuery: string;
  matchedProject?: string;
  extractedLocation?: string;
  extractedType?: string;
  extractedBudget?: string;
}

/**
 * Common typo and abbreviation mapping for property queries
 */
const SPELLING_DICTIONARY: Record<string, string> = {
  // Locations
  'shadnagr': 'shadnagar',
  'sadhnagar': 'shadnagar',
  'shad nagar': 'shadnagar',
  'mokilaa': 'mokila',
  'mokilha': 'mokila',
  'kokapeta': 'kokapet',
  'kokapat': 'kokapet',
  'tellapurr': 'tellapur',
  'telapur': 'tellapur',
  'thellapur': 'tellapur',
  'gachiboli': 'gachibowli',
  'gachibowly': 'gachibowli',
  'patancheroo': 'patancheru',
  'patancharuv': 'patancheru',
  'shamshabaad': 'shamshabad',
  'samshabad': 'shamshabad',
  'sadashivapet': 'sadashivpet',
  'sadashivpeth': 'sadashivpet',
  'kothoor': 'kothur',
  'kotur': 'kothur',
  'lemur': 'lemoor',
  'lemoore': 'lemoor',
  'kadtal': 'kadthal',
  'kadathal': 'kadthal',
  'hyd': 'hyderabad',
  'secunderabad': 'hyderabad',

  // Property Types
  'vila': 'villa',
  'villaa': 'villa',
  'villas': 'villa',
  'vilas': 'villa',
  'appartments': 'apartment',
  'appartment': 'apartment',
  'apartmnt': 'apartment',
  'appartmnt': 'apartment',
  'flts': 'apartment',
  'flt': 'apartment',
  'flats': 'apartment',
  'flat': 'apartment',
  'plots': 'plot',
  'plts': 'plot',
  'farmland': 'farmland',
  'farmlands': 'farmland',

  // Actions
  'purchas': 'buy',
  'perchase': 'buy',
  'purches': 'buy',
  'bying': 'buy',
  'buing': 'buy',

  // Chat abbreviations
  'u': 'you',
  'ur': 'your',
  'wat': 'what',
  'wht': 'what',
  'plz': 'please',
  'pls': 'please',
  'abt': 'about',
  'info': 'information'
};

/**
 * Tanglish / Telugu-English phrases normalization
 */
const TANGLISH_MAP: [RegExp, string][] = [
  [/\bante enti\b/gi, 'means'],
  [/\bante\b/gi, 'means'],
  [/\benti\b/gi, 'what'],
  [/\bento cheppandi\b/gi, 'please tell'],
  [/\bcheppandi\b/gi, 'tell'],
  [/\bcheppu\b/gi, 'tell'],
  [/\bkavali\b/gi, 'required'],
  [/\bunnaya\b/gi, 'available'],
  [/\bunda\b/gi, 'available'],
  [/\bundi\b/gi, 'available'],
  [/\bivvandi\b/gi, 'give'],
  [/\bchoopandi\b/gi, 'show'],
  [/\bchupandi\b/gi, 'show'],
  [/\btelusukovalani undi\b/gi, 'want to know']
];

/**
 * Normalize raw input query
 */
export function normalizeQuery(rawQuery: string): string {
  if (!rawQuery) return '';
  let text = rawQuery.toLowerCase().trim();

  // Strip extraneous symbols except spaces, hyphens, periods (for decimals e.g. 1.5cr)
  text = text.replace(/[^a-z0-9\s.-]/g, ' ');

  // Replace Tanglish phrases
  for (const [pattern, replacement] of TANGLISH_MAP) {
    text = text.replace(pattern, replacement);
  }

  // Tokenize and replace known misspelled words
  const words = text.split(/\s+/).filter(Boolean);
  const normalizedWords = words.map(w => SPELLING_DICTIONARY[w] || w);
  return normalizedWords.join(' ');
}

/**
 * Competitor names
 */
const COMPETITORS = [
  'magicbricks',
  'magic bricks',
  '99acres',
  '99 acres',
  'housing.com',
  'housing com',
  'square yards',
  'squareyards',
  'nobroker',
  'no broker',
  'commonfloor',
  'proptiger',
  'nestaway',
  'olx property',
  'quikr property'
];

/**
 * Strict Out-Of-Scope topics
 */
const OUT_OF_SCOPE_PATTERNS = [
  // Movies & Cinema
  /\b(movie|movies|ticket|tickets|cinema|theatre|film|netflix|hotstar|prime video|hollywood|bollywood|tollywood|actor|actress|popcorn)\b/i,
  // Cricket & Sports
  /\b(cricket|score|scores|match|ipl|football|fifa|virat|kohli|dhoni|rohit|messi|ronaldo|tennis|badminton|kabaddi)\b/i,
  // Weather
  /\b(weather|temperature|forecast|climate|rain today|cyclone)\b/i,
  // Dining & Food
  /\b(restaurant|restaurants|food delivery|biryani|swiggy|zomato|cafe|dinner|lunch|breakfast|hotel booking|room booking)\b/i,
  // Travel & Tickets
  /\b(flight tickets|flights|train ticket|irctc|bus ticket|redbus|airline)\b/i,
  // Politics
  /\b(modi|election|elections|bjp|congress|political|chief minister|breaking news)\b/i,
  // Shopping
  /\b(amazon|flipkart|clothes|shoes|dress|iphone|samsung galaxy|laptop price)\b/i,
  // Crypto & Stocks
  /\b(stock market|stocks|share market|sensex|nifty|crypto|cryptocurrency|bitcoin|ethereum|trading app)\b/i,
  // General Internet / Homework / Medical
  /\b(tell me a joke|write a poem|recipe for|python code|javascript code|doctor appointment|medicine)\b/i
];

/**
 * Specific Projects present in Supabase database
 */
const KNOWN_PROJECTS = [
  'green medows',
  'myscape songs of the sun',
  'fortune santhalia',
  'winridge spar',
  'magadha',
  'golden terra',
  'sanjeevani',
  'nri green county',
  'katyayani',
  'vasavi archana',
  'archana county',
  'tellapur neopolis'
];

/**
 * Known Real Estate Locations
 */
const KNOWN_LOCATIONS = [
  'shadnagar',
  'kokapet',
  'tellapur',
  'mokila',
  'lemoor',
  'kothur',
  'sadashivpet',
  'patancheru',
  'medchal',
  'gachibowli',
  'shamshabad',
  'kollur',
  'kadthal',
  'maheshwaram',
  'chevella',
  'shankarpally',
  'adibatla',
  'kondapur',
  'madhapur',
  'kompally',
  'nizampet',
  'hyderabad'
];

/**
 * Main Intent Classifier
 */
export function classifyIntent(rawQuery: string): ClassifiedIntent {
  const original = rawQuery || '';
  const normalized = normalizeQuery(original);

  // 1. COMPETITOR CHECK
  for (const comp of COMPETITORS) {
    if (normalized.includes(comp)) {
      return {
        intent: 'COMPETITOR',
        normalizedQuery: normalized,
        originalQuery: original
      };
    }
  }

  // 2. STRICT OUT-OF-SCOPE CHECK
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        intent: 'OUT_OF_SCOPE',
        normalizedQuery: normalized,
        originalQuery: original
      };
    }
  }

  // 3. GREETING / GENERAL CONVERSATION
  const isGreeting =
    /^(hi|hello|hey|namaste|namaskaram|good morning|good afternoon|good evening|who are you|what can you do|how are you)(\?|\!|\.)?$/i.test(normalized) ||
    normalized === 'hi' ||
    normalized === 'hello' ||
    normalized === 'hey' ||
    normalized === 'namaste' ||
    normalized === 'namaskaram';

  if (isGreeting) {
    return {
      intent: 'GREETING',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  const isThanks =
    /\b(thank you|thanks|dhanyavadalu|dhanyavadamulu|bye|goodbye)\b/i.test(normalized);
  if (isThanks) {
    return {
      intent: 'GREETING',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 4. OPV 360° ELITE SERVICES & COMPREHENSIVE REAL ESTATE SOLUTIONS
  const isServicesPattern =
    /\b(360|360°|elite\s*services?|opv\s*services?|what\s*services?|services?\s*provided|services?\s*offered|real\s*estate\s*services?)\b/i.test(normalized) ||
    normalized.includes('360 elite') ||
    normalized.includes('elite service') ||
    normalized === 'services' ||
    normalized === 'opv services';

  if (isServicesPattern) {
    return {
      intent: 'OPV_SERVICES',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 4. SPECIFIC PROJECT QUERY IN SUPABASE
  for (const proj of KNOWN_PROJECTS) {
    if (normalized.includes(proj)) {
      return {
        intent: 'PROJECT_INFORMATION',
        normalizedQuery: normalized,
        originalQuery: original,
        matchedProject: proj
      };
    }
  }

  // 5. EDUCATIONAL / REAL ESTATE CONCEPTS (RERA, HMDA, DTCP, GHMC, EC, Mutation, etc. alone are NOT search)
  const isEduPattern =
    /\b(what|explain|meaning|definition|process|rules|how|why|difference|details|info)\b/i.test(normalized) ||
    /^(rera|hmda|dtcp|ghmc|municipality|gram panchayat|panchayat|ec|encumbrance|mutation|registration|patta|lrs|vastu|home loan|tax|sale deed|agreement of sale|bhk|carpet area)$/i.test(normalized);

  const hasSpecificPropType = /\b(plot|plots|villa|villas|apartment|apartments|flat|flats|farmland|farmlands|commercial|house|houses)\b/i.test(normalized);
  const hasLoc = KNOWN_LOCATIONS.some(loc => normalized.includes(loc));
  const hasBudgetWord = /\b(under|budget|lakh|lakhs|cr|crore|crores|price|cost|below)\b/i.test(normalized) || /\b\d+(\.\d+)?\s*(l|cr|lakh|crore)\b/i.test(normalized);
  const hasSearchVerb = /\b(show|find|search|available|look|looking|want|need|buy)\b/i.test(normalized);

  if (isEduPattern && !hasSearchVerb && !hasBudgetWord && !hasLoc) {
    return {
      intent: 'GENERAL_INQUIRY',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 6. PROPERTY SEARCH INTENT (Plots, Villas, Apartments, Commercial, Farmland, Locations, Budgets)
  if (hasSpecificPropType || (hasLoc && (hasBudgetWord || hasSearchVerb || normalized.split(' ').length <= 4)) || (hasBudgetWord && hasSearchVerb)) {
    return {
      intent: 'PROPERTY_SEARCH',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 6. GENERAL / NON-SEARCH REAL ESTATE INQUIRY (Directed straight to OPV advisor, NO in-built website answers)
  return {
    intent: 'GENERAL_INQUIRY',
    normalizedQuery: normalized,
    originalQuery: original
  };
}
