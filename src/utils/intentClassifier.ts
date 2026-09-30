/**
 * OPV Real Estate Chatbot Intent Understanding & Classification Engine
 *
 * Designed to understand user INTENTION across:
 * - Poor English & Grammatical errors
 * - Spelling mistakes & Abbreviations (e.g. "serves", "shadnagr", "lone", "rerra", "hmd")
 * - Short phrases (2-5 words, e.g. "services?", "plots shadnagar", "home loan")
 * - Telugu-English / Tanglish queries (e.g. "hmda ante enti", "plots kavali", "services cheppandi")
 * - Strict Out-of-Scope protection (movies, cricket, weather, travel, politics, etc.)
 * - Strict Competitor protection (Magicbricks, 99acres, Housing.com, Square Yards, etc.)
 * - Zero fake data & No random property cards on informational questions
 */

export type IntentType =
  | 'PROPERTY_SEARCH'
  | 'PROJECT_INFORMATION'
  | 'OPV_SERVICES'
  | 'OPV_COMPANY_INFORMATION'
  | 'PROPERTY_TYPES_OVERVIEW'
  | 'REAL_ESTATE_EDUCATION'
  | 'BUYING_GUIDANCE'
  | 'SELLING_GUIDANCE'
  | 'RENTAL_GUIDANCE'
  | 'HOME_LOAN'
  | 'LEGAL_PROPERTY_SUPPORT'
  | 'PROPERTY_VERIFICATION'
  | 'VASTU'
  | 'PROPERTY_REGISTRATION'
  | 'HMDA'
  | 'DTCP'
  | 'RERA'
  | 'EC'
  | 'MUTATION'
  | 'SURVEY_SERVICES'
  | 'INTERIOR_CONSTRUCTION'
  | 'BHOOMI_POOJA'
  | 'GRUHAPRAVESAM'
  | 'PROPERTY_MANAGEMENT'
  | 'NRI_ADVISORY'
  | 'INVESTMENT_GUIDANCE'
  | 'AI_DISCOVERY'
  | 'OPV_APP'
  | 'FAQ'
  | 'OPV_CONTACT'
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
 * Common typo and abbreviation mapping
 */
const SPELLING_DICTIONARY: Record<string, string> = {
  // Services
  'serves': 'services',
  'servces': 'services',
  'servise': 'services',
  'servies': 'services',
  'servec': 'services',
  'servises': 'services',
  'sarvice': 'services',
  'sarvices': 'services',
  'servce': 'services',
  'srvc': 'services',

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

  // Approvals & Legal
  'rerra': 'rera',
  'reera': 'rera',
  'reraa': 'rera',
  'tsrera': 'rera',
  'ts-rera': 'rera',
  'tgrera': 'rera',
  'tg-rera': 'rera',
  'hmd': 'hmda',
  'hmdaa': 'hmda',
  'h-m-d-a': 'hmda',
  'dctp': 'dtcp',
  'dtpc': 'dtcp',
  'd-t-c-p': 'dtcp',
  'e-c': 'ec',
  'encumberance': 'encumbrance',
  'encumbranc': 'encumbrance',
  'mutaton': 'mutation',
  'mutashon': 'mutation',
  'mutashan': 'mutation',
  'mutetion': 'mutation',
  'mutashen': 'mutation',
  'mutaion': 'mutation',
  'registraton': 'registration',
  'regestration': 'registration',
  'registresion': 'registration',
  'rigistration': 'registration',

  // Financial / Loans
  'lone': 'loan',
  'lonee': 'loan',
  'lon': 'loan',
  'loane': 'loan',
  'lons': 'loan',
  'homeloan': 'home loan',
  'homelone': 'home loan',

  // Verification & Legal
  'propery': 'property',
  'propety': 'property',
  'proparty': 'property',
  'propertis': 'property',
  'proparties': 'property',
  'propertie': 'property',
  'verifiction': 'verification',
  'verifcation': 'verification',
  'verifing': 'verification',
  'varification': 'verification',
  'verifiy': 'verification',

  // Vastu & Rituals
  'vaastu': 'vastu',
  'vasthu': 'vastu',
  'vashthu': 'vastu',
  'puja': 'pooja',
  'bhoomi': 'bhoomi',
  'bhumi': 'bhoomi',
  'gruhapravesham': 'gruhapravesam',
  'gruhapravesh': 'gruhapravesam',
  'housewarming': 'gruhapravesam',

  // Actions
  'purchas': 'buy',
  'perchase': 'buy',
  'purches': 'buy',
  'bying': 'buy',
  'buing': 'buy',
  'sel': 'sell',
  'seling': 'sell',
  'rnt': 'rent',
  'renting': 'rent',
  'rentng': 'rent',

  // Contact
  'contct': 'contact',
  'cntact': 'contact',
  'fone': 'phone',
  'phon': 'phone',
  'mobail': 'mobile',
  'adress': 'address',
  'addres': 'address',

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
 * Normalize raw input query:
 * - Lowercase and trim
 * - Translate Tanglish particles
 * - Fix common typos using SPELLING_DICTIONARY
 */
export function normalizeQuery(rawQuery: string): string {
  if (!rawQuery) return '';
  let text = rawQuery.toLowerCase().trim();

  // Strip extraneous non-alphanumeric symbols except spaces, hyphens, periods (for decimals e.g. 1.5cr)
  text = text.replace(/[^a-z0-9\s.-]/g, ' ');

  // Replace Tanglish phrases
  for (const [pattern, replacement] of TANGLISH_MAP) {
    text = text.replace(pattern, replacement);
  }

  // Tokenize and replace known misspelled words
  const words = text.split(/\s+/).filter(Boolean);
  const normalizedWords = words.map(w => SPELLING_DICTIONARY[w] || w);
  let normalized = normalizedWords.join(' ');

  // Extra multi-word normalizations
  normalized = normalized
    .replace(/\bhome lone\b/g, 'home loan')
    .replace(/\bwhat serves\b/g, 'what services')
    .replace(/\bopv servies\b/g, 'opv services')
    .replace(/\bbhumi pooja\b/g, 'bhoomi pooja')
    .replace(/\bbhumi puja\b/g, 'bhoomi pooja')
    .replace(/\bhouse warming\b/g, 'gruhapravesam');

  return normalized;
}

/**
 * Competitor names that OPV strictly does not support
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
  // Dining, Restaurants & Hotels
  /\b(restaurant|restaurants|food delivery|biryani|swiggy|zomato|cafe|dinner|lunch|breakfast|hotel|hotels|resort|resorts|hotel booking|book hotel|resort booking|room booking)\b/i,
  // Travel & Commute (unrelated to property locality)
  /\b(flight tickets|flights|train ticket|irctc|bus ticket|redbus|airline)\b/i,
  // Politics & News
  /\b(modi|election|elections|bjp|congress|political|chief minister|breaking news)\b/i,
  // Shopping & Electronics
  /\b(amazon|flipkart|clothes|shoes|dress|iphone|samsung galaxy|laptop price)\b/i,
  // Crypto & Stocks
  /\b(stock market|stocks|share market|sensex|nifty|crypto|cryptocurrency|bitcoin|ethereum|trading app)\b/i,
  // General Internet / Homework / Medical
  /\b(tell me a joke|write a poem|recipe for|python code|javascript code|doctor appointment|medicine)\b/i
];

/**
 * Specific Approved Projects
 */
const KNOWN_PROJECTS = [
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

  // 4. SPECIFIC PROJECT QUERY
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

  // 5. SPECIALIZED 360 SERVICES & DETAILED TOPICS (Checked before generic services query)
  if (/\b(bhoomi pooja|bhoomi puja|bhumi pooja|bhumi puja|ground breaking|shankusthapana|muhurtham)\b/i.test(normalized)) {
    return {
      intent: 'BHOOMI_POOJA',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }
  if (/\b(gruhapravesam|gruhapravesham|house warming|housewarming|cow puja|go puja|ganapati homam)\b/i.test(normalized)) {
    return {
      intent: 'GRUHAPRAVESAM',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }
  if (/\b(nri|nri desk|nri advisory|non resident indian|nre|nro|repatriation|foreign resident)\b/i.test(normalized)) {
    return {
      intent: 'NRI_ADVISORY',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }
  if (/\b(land survey|survey services|boundaries check|boundary marking|dgps|demarcation)\b/i.test(normalized)) {
    return {
      intent: 'SURVEY_SERVICES',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }
  if (/\b(interior|interior design|interior decoration|villa construction|construction support|turnkey construction|architectural design)\b/i.test(normalized)) {
    return {
      intent: 'INTERIOR_CONSTRUCTION',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }
  if (/\b(property management|manage my plot|manage property|plot fencing|fencing services|site maintenance|encroachment protection)\b/i.test(normalized)) {
    return {
      intent: 'PROPERTY_MANAGEMENT',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 6. INVESTMENT GUIDANCE
  if (/\b(investment guidance|investment tips|best areas to invest|where to invest|high roi|capital appreciation|investment corridor|growth corridor|best corridors|predictive roi)\b/i.test(normalized)) {
    return {
      intent: 'INVESTMENT_GUIDANCE',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 7. AI-POWERED PROPERTY DISCOVERY
  if (/\b(ai discovery|agentic search|ai powered|ai features|neural model|smart search|opv ai|property discovery)\b/i.test(normalized)) {
    return {
      intent: 'AI_DISCOVERY',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 8. OPV APP & REFERRAL
  if (/\b(opv app|mobile app|play store|google play|download app|refer and earn|referral rewards|referral program|win gold)\b/i.test(normalized)) {
    return {
      intent: 'OPV_APP',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 9. PROPERTY TYPES OVERVIEW
  if (/\b(property types|types of properties|what types of property|what property types|what properties do you have|what does opv offer|categories of properties|property category)\b/i.test(normalized)) {
    return {
      intent: 'PROPERTY_TYPES_OVERVIEW',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 10. FAQs
  if (/\b(faq|faqs|frequently asked questions|common questions)\b/i.test(normalized)) {
    return {
      intent: 'FAQ',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 11. OPV SERVICES (Matches "what serves provide", "opv servies", "service provide", "what service u provide", "what all service", "services?", etc.)
  const isServicesQuery =
    /\b(service|services)\b/i.test(normalized) &&
    (
      /\b(what|provide|provided|offer|offered|list|all|available|have|show|opv|tell|does|do|details|360|elite)\b/i.test(normalized) ||
      normalized === 'service' ||
      normalized === 'services' ||
      normalized === 'opv services' ||
      normalized === 'services list' ||
      normalized === 'services provide' ||
      normalized === 'what serves provide' ||
      normalized === 'what all service'
    );

  if (isServicesQuery) {
    return {
      intent: 'OPV_SERVICES',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 12. HMDA vs DTCP or HMDA INFORMATION
  if (/\bhmda\b/i.test(normalized) && /\bdtcp\b/i.test(normalized)) {
    return {
      intent: 'HMDA',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  if (/\bhmda\b/i.test(normalized)) {
    // If user says "plots in hmda" or "hmda plots in shadnagar", this could be a property search with HMDA filter
    const hasLocation = KNOWN_LOCATIONS.some(loc => normalized.includes(loc) && loc !== 'hyderabad');
    const hasSearchVerb = /\b(show|find|list|buy|under|budget|lakh|cr)\b/i.test(normalized);
    if (hasLocation && hasSearchVerb) {
      return {
        intent: 'PROPERTY_SEARCH',
        normalizedQuery: normalized,
        originalQuery: original
      };
    }
    return {
      intent: 'HMDA',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 13. DTCP INFORMATION
  if (/\bdtcp\b/i.test(normalized)) {
    const hasLocation = KNOWN_LOCATIONS.some(loc => normalized.includes(loc) && loc !== 'hyderabad');
    const hasSearchVerb = /\b(show|find|list|buy|under|budget|lakh|cr)\b/i.test(normalized);
    if (hasLocation && hasSearchVerb) {
      return {
        intent: 'PROPERTY_SEARCH',
        normalizedQuery: normalized,
        originalQuery: original
      };
    }
    return {
      intent: 'DTCP',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 14. RERA INFORMATION
  if (/\brera\b/i.test(normalized)) {
    return {
      intent: 'RERA',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 15. ENCUMBRANCE CERTIFICATE (EC)
  if (/\b(ec|encumbrance|encumbrance certificate|form 15|form 16|nil ec)\b/i.test(normalized)) {
    return {
      intent: 'EC',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 16. MUTATION
  if (/\b(mutation|dharani mutation|pattadar passbook)\b/i.test(normalized)) {
    return {
      intent: 'MUTATION',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 17. PROPERTY REGISTRATION
  if (
    /\b(registration|stamp duty|sub registrar|sro|challan)\b/i.test(normalized) &&
    !/\b(rera)\b/i.test(normalized)
  ) {
    return {
      intent: 'PROPERTY_REGISTRATION',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 18. PROPERTY VERIFICATION & LEGAL DUE DILIGENCE
  if (
    /\b(verification|verifiction|verify|link document|link documents|title clearance|legal check|due diligence|legal scrutiny)\b/i.test(normalized)
  ) {
    return {
      intent: 'PROPERTY_VERIFICATION',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 19. HOME LOANS
  if (/\b(loans?|home loans?|property loans?|bank loans?|housing loans?|interest rates?|sbi loans?|hdfc loans?)\b/i.test(normalized)) {
    return {
      intent: 'HOME_LOAN',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 20. VASTU
  if (/\b(vastu|vaastu|vasthu|energy flow|facing vastu)\b/i.test(normalized)) {
    return {
      intent: 'VASTU',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 21. BUYING GUIDANCE (Process, Checklist, How to buy - NOT a direct search for a specific plot/villa)
  const isBuyingGuidance =
    (/\b(how to buy|buy property process|buying process|buying guide|buying checklist|purchase process|steps to buy|buyer guide)\b/i.test(normalized)) ||
    (normalized === 'buy property' || normalized === 'how to buy property');

  if (isBuyingGuidance) {
    return {
      intent: 'BUYING_GUIDANCE',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 22. SELLING GUIDANCE (How to sell, Post property)
  const isSellingGuidance =
    /\b(how to sell|selling process|sell property|sell my plot|sell my villa|post property|list property|seller guide)\b/i.test(normalized);

  if (isSellingGuidance) {
    return {
      intent: 'SELLING_GUIDANCE',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 18. RENTAL GUIDANCE
  const isRentalGuidance =
    (/\b(how to rent|rental process|rent property|renting guide|rental agreement)\b/i.test(normalized)) ||
    (normalized === 'rent property');

  if (isRentalGuidance) {
    return {
      intent: 'RENTAL_GUIDANCE',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 19. ABOUT OPV / COMPANY INFO
  if (
    /\b(about opv|what is opv|who is opv|who are you|mission|vision|why opv|why choose opv|founder|ceo|opv company)\b/i.test(normalized) ||
    normalized === 'opv' ||
    normalized === 'about'
  ) {
    return {
      intent: 'OPV_COMPANY_INFORMATION',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 20. CONTACT / OFFICE INFO
  if (
    /\b(contact|phone|call|mobile|address|office|headquarters|email|support number|whatsapp number)\b/i.test(normalized) ||
    normalized === 'contact' ||
    normalized === 'office'
  ) {
    return {
      intent: 'OPV_CONTACT',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 21. REAL ESTATE EDUCATION (Units conversion, terminology)
  if (
    /\b(sq yd|sq ft|square yard|gunta|guntas|acre|acres|fsi|carpet area|super built up|patta)\b/i.test(normalized) &&
    !/\b(plot|villa|apartment)\b/i.test(normalized)
  ) {
    return {
      intent: 'REAL_ESTATE_EDUCATION',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // 22. PROPERTY SEARCH INTENT (Plots, Villas, Apartments, Commercial, Farmland, Locations, Budgets)
  const hasPropType = /\b(plot|plots|villa|villas|apartment|apartments|flat|flats|farmland|farmlands|commercial|house|land)\b/i.test(normalized);
  const hasLoc = KNOWN_LOCATIONS.some(loc => normalized.includes(loc));
  const hasBudgetWord = /\b(under|budget|lakh|lakhs|cr|crore|crores|price|cost|below)\b/i.test(normalized) || /\b\d+(\.\d+)?\s*(l|cr|lakh|crore)\b/i.test(normalized);
  const hasSearchVerb = /\b(show|find|search|available|look|looking|want|need|buy)\b/i.test(normalized);

  if (hasPropType || (hasLoc && (hasBudgetWord || hasSearchVerb || normalized.split(' ').length <= 4)) || hasBudgetWord) {
    return {
      intent: 'PROPERTY_SEARCH',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // Fallback: If query mentions any real estate keyword, classify as general education or guidance
  if (/\b(property|real estate|invest|investment|land|home)\b/i.test(normalized)) {
    return {
      intent: 'BUYING_GUIDANCE',
      normalizedQuery: normalized,
      originalQuery: original
    };
  }

  // Otherwise, strictly mark as OUT_OF_SCOPE to protect the real-estate-only chatbot
  return {
    intent: 'OUT_OF_SCOPE',
    normalizedQuery: normalized,
    originalQuery: original
  };
}
