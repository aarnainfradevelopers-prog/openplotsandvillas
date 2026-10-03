/**
 * Gemini AI Reasoning & Intent/Filter Extraction Service
 *
 * Models configured with automatic fallback:
 * - gemini-3.5-flash-lite (Ultra-fast lite model)
 * - gemini-flash-lite-latest (Fast fallback)
 * - gemini-3.1-flash-lite (High-speed model)
 * - gemini-3.7-flash (Latest 3.7 model)
 * - gemini-3.5-flash (Standard 3.5 model)
 */

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ApprovalType = 'HMDA' | 'DTCP' | 'RERA' | 'GHMC' | 'GRAM_PANCHAYAT';
export type PropertyCategory = 'APARTMENT' | 'VILLA' | 'PLOT' | 'FARM_LAND' | 'FARM_HOUSE' | 'COMMERCIAL';

export interface StructuredPropertySearchFilter {
  intent: 'PROPERTY_SEARCH' | 'GENERAL_INFORMATION' | 'WEBSITE_QUERY' | 'GENERAL_CONVERSATION';
  approval: ApprovalType[];
  property_type: PropertyCategory[];
  location: string[];
  budget_min: number | null;
  budget_max: number | null;
  bhk: number | null;
  size_min: number | null;
  size_max: number | null;
  facing: string[];
  amenities: string[];
  target_project?: string | null;
  topic?: string | null;
  question_type?: 'definition' | 'process' | 'rules' | 'service' | 'general' | null;
  requested_information?: string | null;
}

export interface GeminiGenerateOptions {
  query: string;
  history?: ChatHistoryMessage[];
  groundingData: string;
  groundingSourceType: 'supabase_property' | 'opv_website' | 'general';
  language?: string;
}

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.5-flash'
];

/**
 * Detects whether a query is asking a general/educational real estate question,
 * definition, regulation, approval meaning, or service inquiry, rather than searching
 * for property listings.
 */
export function checkIsGeneralEducationalQuery(rawQuery: string): boolean {
  if (!rawQuery) return false;
  const q = rawQuery.toLowerCase().trim();

  // Strip punctuation
  const cleanQ = q.replace(/[?!.,;:()'"]/g, ' ').replace(/\s+/g, ' ').trim();

  // Greetings or simple thanks are handled by conversation logic
  if (/^(hi|hello|hey|namaste|namaskaram|thanks|thank you|bye|good morning|good evening)$/i.test(cleanQ)) {
    return false;
  }

  // Question patterns (English & Telugu / Tenglish)
  const isQuestionPattern =
    /\b(what\s*(is|are|s|does|do)|explain|meaning\s*of|definition\s*of|define|tell\s*me\s*about|how\s*(does|do|to|is)|difference\s*between|why\s*(is|do|should)|can\s*you\s*explain|details\s*of|info\s*on|process\s*of|rules\s*for|procedure\s*for|importance\s*of|guide\s*to)\b/i.test(cleanQ) ||
    /\b(meaning|definition|process|procedure|rules|guidelines|purpose|benefits)\b/i.test(cleanQ) ||
    /\b(enti|ante\s*enti|ante|cheppu|cheppandi|gurinchi|ardham|arthem|enduku|ela)\b/i.test(cleanQ);

  // Specific listing categories
  const hasSpecificCategory = /\b(apartment|apartments|flat|flats|plot|plots|open\s*plot|open\s*plots|villa|villas|duplex|triplex|farmland|farm\s*land|farm\s*house|farmhouse|commercial|commercial\s*plot|commercial\s*plots|commercial\s*shop|commercial\s*office|commercial\s*properties|commercial\s*property|shop|shops|office|offices|house|houses)\b/i.test(cleanQ);

  // Generic property words
  const hasGenericPropertyWord = /\b(properties|property|projects|project|listings|listing|ventures|venture)\b/i.test(cleanQ);

  // Explicit property search verbs/actions
  const hasSearchAction = /\b(show\s*me|show|find|search|list|display|recommend|give\s*me|get\s*me|look\s*for|looking\s*for|buy|want\s*to\s*buy|available|kavali|chupandi|choopandi)\b/i.test(cleanQ);

  // Locations
  const hasLocation = /\b(hyderabad|hyd|shadnagar|kokapet|tellapur|mokila|lemoor|kothur|sadashivpet|patancheru|gachibowli|shamshabad|kadthal|maheshwaram|attapur|bhanur|uppal|rajapur|kandukur|nednur|kallepally|balanagar|jubilee\s*hills|banjara\s*hills|madhapur|hitec\s*city|kondapur|manikonda|financial\s*district|nizampet|kompally|miyapur|bachupally|medchal|kollur|chevella|shankarpally|adibatla)\b/i.test(cleanQ);

  // Budget
  const hasBudget = /\b(under|below|within|upto|less than|between)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore|l)?/i.test(cleanQ) || /\b\d+(\.\d+)?\s*(cr|crore|crores|lakh|lakhs)\b/i.test(cleanQ);

  // Real estate terminology, approvals, regulations, legal documents, services
  const REAL_ESTATE_TOPICS = [
    'rera', 'hmda', 'dtcp', 'ghmc', 'municipality', 'gram panchayat', 'panchayat',
    'ec', 'encumbrance', 'encumbrance certificate', 'mutation', 'registration', 'property registration',
    'land conversion', 'nala conversion', 'nala', 'lrs', 'brs', 'building permission', 'layout approval',
    'vastu', 'vaastu', 'home loan', 'home loans', 'housing loan', 'legal verification', 'property verification',
    'property tax', 'sale deed', 'agreement of sale', 'patta', 'passbook', 'dharani', 'market value',
    'guidance value', 'stamp duty', 'carpet area', 'built up area', 'built-up area', 'super built up area',
    'super built-up area', 'plinth area', 'undivided share', 'uds', 'occupancy certificate', 'oc',
    'commencement certificate', 'cc', 'possession', 'bhk', 'khata'
  ];

  const containsTopic = REAL_ESTATE_TOPICS.some(t => {
    if (t.includes(' ')) {
      return cleanQ.includes(t);
    }
    return new RegExp(`\\b${t}\\b`, 'i').test(cleanQ);
  });

  // Approvals
  const hasApproval = /\b(rera|hmda|dtcp|ghmc|municipality|gram\s*panchayat|panchayat)\b/i.test(cleanQ);

  // If user asks a definition/explanation of a concept or property type (e.g. "What is an apartment?", "what is a villa?", "apartment meaning")
  if (isQuestionPattern) {
    // If it's a question pattern asking about a concept, approval, or even property type meaning, it's general educational
    return true;
  }

  // If there is NO question pattern:
  // If query specifies a property category (e.g. "RERA apartments", "HMDA plots", "DTCP villas", "GHMC commercial properties", "villas in Hyderabad")
  if (hasSpecificCategory) {
    return false; // This is a property search!
  }

  // If query uses generic property word with search action, location, budget, or approval
  // (e.g. "RERA properties in Kokapet", "properties in Hyderabad", "RERA properties", "HMDA properties")
  if (hasGenericPropertyWord && (hasSearchAction || hasLocation || hasBudget || hasApproval)) {
    return false; // This is a property search!
  }

  // If query has search action with location or budget (e.g. "find properties in Kokapet")
  if (hasSearchAction && (hasLocation || hasBudget)) {
    return false; // Property search!
  }

  // If query contains a real estate topic/approval/process/regulation without property search request,
  // it is GENERAL_INFORMATION (e.g. "RERA", "HMDA", "DTCP", "GHMC", "EC", "Mutation", "what rera", "rera enti", "Property Tax", "Property Verification")
  if (containsTopic) {
    return true;
  }

  // General company/website questions
  if (/\b(about\s*opv|who\s*is\s*opv|what\s*is\s*opv|opv\s*services|services\s*offered|founder|ceo|contact|office\s*address|phone\s*number)\b/i.test(cleanQ)) {
    return true;
  }

  return false;
}

export interface EducationalTopicEntry {
  topic: string;
  questionType: 'definition' | 'process' | 'rules' | 'service' | 'general';
  explanation: string;
  followUp: string;
}

export const REAL_ESTATE_EDUCATIONAL_KNOWLEDGE: Record<string, EducationalTopicEntry> = {
  rera: {
    topic: 'RERA',
    questionType: 'definition',
    explanation:
      '**RERA (Real Estate Regulatory Authority)** was established under the Real Estate (Regulation and Development) Act, 2016, to protect property buyers, ensure financial transparency, and bring accountability to the real estate sector. In Telangana, **TG-RERA** mandates that all residential and commercial real estate projects where land area exceeds 500 sq. meters or the number of units exceeds 8 must obtain a verified RERA registration before advertising or selling. Developers must deposit 70% of buyer funds into an escrow bank account dedicated solely to construction, adhere to strict carpet area disclosures, and face penalties for delivery delays.',
    followUp: 'Would you like me to show you RERA-registered properties in Hyderabad?'
  },
  hmda: {
    topic: 'HMDA',
    questionType: 'definition',
    explanation:
      '**HMDA (Hyderabad Metropolitan Development Authority)** is the apex statutory urban planning agency governing the Hyderabad Metropolitan Region, covering over 7,250 sq. km across 7 districts. HMDA plans master zones, grants layout permissions (LP), and enforces strict infrastructural guidelines. HMDA-approved ventures require minimum 30/40/60-foot blacktop or CC roads, comprehensive underground drainage, dedicated water pipeline infrastructure, electricity with streetlights, and a mandatory 10% open space/park area gifted to local authorities.',
    followUp: 'Would you like me to show you HMDA-approved properties in Hyderabad?'
  },
  dtcp: {
    topic: 'DTCP',
    questionType: 'definition',
    explanation:
      '**DTCP (Directorate of Town and Country Planning)** is the regulatory authority that oversees land development, master plans, and plotted layout sanctions in peri-urban and rural areas of Telangana situated outside HMDA limits. DTCP approval confirms that the layout possesses verified title clearance, clear road widths (minimum 33/40 feet), legal survey demarcations, open space reservations, and valid conversion from agricultural to non-agricultural status before plots can be registered.',
    followUp: 'Would you like me to show you DTCP-approved properties in Hyderabad?'
  },
  ghmc: {
    topic: 'GHMC',
    questionType: 'definition',
    explanation:
      '**GHMC (Greater Hyderabad Municipal Corporation)** is the primary civic and municipal authority administering the core metropolitan city of Hyderabad and Secunderabad. GHMC sanctions residential and commercial building construction plans, issues Commencement Certificates (CC) and Occupancy Certificates (OC), assigns door numbers and property tax assessments, and maintains core urban municipal infrastructure.',
    followUp: 'Would you like me to show you GHMC-related properties in Hyderabad?'
  },
  municipality: {
    topic: 'Municipality',
    questionType: 'definition',
    explanation:
      'A **Municipality (Municipal Council / Corporation)** is the local urban governance body administering specific urban towns outside GHMC (such as Shadnagar, Badangpet, Meerpet, Shamshabad, Jalpally, etc.). Municipalities regulate building permissions, layout approvals within their jurisdiction, infrastructure development, and local property tax collection.',
    followUp: 'Would you like me to show you verified properties in municipal areas near Hyderabad?'
  },
  gram_panchayat: {
    topic: 'Gram Panchayat',
    questionType: 'definition',
    explanation:
      'A **Gram Panchayat** is the local village-level administrative body in rural areas. While Gram Panchayats handle village civic maintenance, government regulations stipulate that layout sanctions for open plots and commercial ventures must come from statutory authorities like HMDA or DTCP rather than standalone Gram Panchayat permissions to ensure legal building permits and bank loan eligibility.',
    followUp: 'Would you like me to show you verified HMDA or DTCP approved properties in Hyderabad?'
  },
  ec: {
    topic: 'EC (Encumbrance Certificate)',
    questionType: 'definition',
    explanation:
      'An **Encumbrance Certificate (EC)** is an official legal record issued by the Telangana Registration and Stamps Department (IGRS). It documents all registered financial and legal transactions—including mortgages, sales, leases, or court attachments—on a specific property over a specified period (typically 30 years). A "Nil Encumbrance Certificate" confirms that the property has clear, marketable title free from existing bank liens or financial liabilities.',
    followUp: 'Would you like me to help you find properties with the relevant documentation?'
  },
  mutation: {
    topic: 'Mutation',
    questionType: 'process',
    explanation:
      '**Property Mutation** is the mandatory legal process of updating property ownership and title records in local municipal records (GHMC / Municipality) or land revenue records (Dharani portal) after registration. Completing mutation ensures that property tax assessments, water connections, and official utility ownership records are formally transferred from the seller to the new buyer.',
    followUp: 'Would you like me to help you find verified properties with clear ownership documentation?'
  },
  registration: {
    topic: 'Property Registration',
    questionType: 'process',
    explanation:
      '**Property Registration** is the statutory process of officially recording a Sale Deed at the Sub-Registrar Office (SRO) under the Registration Act, 1908. In Telangana, registration involves payment of stamp duty, transfer duty, and registration charges, followed by biometric verification of buyer and seller. Registration establishes legally binding ownership that is enforceable in a court of law.',
    followUp: 'Would you like me to show you verified properties ready for registration in Hyderabad?'
  },
  land_conversion: {
    topic: 'Land Conversion (NALA)',
    questionType: 'process',
    explanation:
      '**Land Conversion (NALA Conversion)** is the legal statutory process under the Telangana Non-Agricultural Land Assessment Act wherein agricultural land is formally converted to non-agricultural status through the Revenue Department or Dharani portal. Only after valid NALA conversion can land be legally developed into residential plotted layouts, villas, or commercial projects.',
    followUp: 'Would you like me to show you legally converted residential properties in Hyderabad?'
  },
  lrs: {
    topic: 'LRS (Layout Regularization Scheme)',
    questionType: 'rules',
    explanation:
      '**LRS (Layout Regularization Scheme)** is a state government policy in Telangana introduced to regularize unapproved and unauthorized sub-divisions, plots, and layouts upon payment of prescribed regularization charges. Buying verified HMDA/DTCP approved properties is recommended over unapproved plots as approved layouts possess clear title and full bank loan eligibility.',
    followUp: 'Would you like me to show you fully approved HMDA and DTCP plotted layouts in Hyderabad?'
  },
  building_permission: {
    topic: 'Building Permission',
    questionType: 'process',
    explanation:
      '**Building Permission** is the official approval granted by municipal authorities (GHMC, HMDA, DTCP, or Municipalities) authorizing construction on a specific plot based on verified building bylaws, setback rules, floor space index (FSI), height limits, and structural drawings.',
    followUp: 'Would you like me to show you properties with verified government approvals in Hyderabad?'
  },
  vastu: {
    topic: 'Vastu',
    questionType: 'rules',
    explanation:
      '**Vastu Shastra** is the ancient Indian science of spatial architecture and direction that harmonizes residential layouts with natural energy fields. In Hyderabad real estate, high emphasis is placed on East-facing and North-facing plots/entrances, proper kitchen placement in the South-East (Agneya), master bedroom in the South-West (Nairuthi), and open spaces in the North-East (Eshanya).',
    followUp: 'Would you like me to show you 100% Vastu-compliant properties in Hyderabad?'
  },
  home_loans: {
    topic: 'Home Loans',
    questionType: 'service',
    explanation:
      '**Home Loans & Plot Loans** provide mortgage financing from leading nationalized and private banks (SBI, HDFC, ICICI, etc.) for purchasing approved plots, villas, or apartments. Approvals depend on layout sanctions (HMDA, DTCP, RERA), clear 30-year link documents, borrower income, and credit score (CIBIL 750+). Most banks finance up to 75%–80% of property cost.',
    followUp: 'Would you like me to show you bank-approved properties eligible for home loans in Hyderabad?'
  },
  legal_verification: {
    topic: 'Legal Verification',
    questionType: 'service',
    explanation:
      '**Legal Verification** is comprehensive due diligence conducted by real estate advocates to verify property title integrity. It involves scrutinizing 30-year mother/link documents, registered sale deeds, encumbrance certificates, master plan zoning, court litigation checks, layout sanctions, and RERA registration to guarantee risk-free ownership.',
    followUp: 'Would you like me to help you explore 100% legally verified properties in Hyderabad?'
  },
  property_tax: {
    topic: 'Property Tax',
    questionType: 'rules',
    explanation:
      '**Property Tax** is an annual local tax levied by civic bodies like GHMC or local municipalities on real property. Tax amounts are calculated using the property’s annual rental value (ARV), plinth area, usage type (residential/commercial), and zone location. Timely payment is required to obtain municipal clearance and utility connections.',
    followUp: 'Would you like me to show you verified residential properties in Hyderabad?'
  },
  sale_deed: {
    topic: 'Sale Deed',
    questionType: 'definition',
    explanation:
      'A **Sale Deed** is the primary legal contract that transfers absolute ownership of a property from the seller to the buyer. Executed on non-judicial stamp paper and registered at the Sub-Registrar Office, it serves as conclusive proof of ownership and specifies property boundaries, measurements, consideration value, and indemnity clauses.',
    followUp: 'Would you like me to help you find verified properties with clear ownership in Hyderabad?'
  },
  agreement_of_sale: {
    topic: 'Agreement of Sale',
    questionType: 'definition',
    explanation:
      'An **Agreement of Sale (ATS)** is a preliminary legal document establishing the terms, agreed purchase price, payment milestones, possession timeline, and conditions between buyer and seller prior to final Sale Deed registration.',
    followUp: 'Would you like me to show you verified properties with clear documentation in Hyderabad?'
  },
  patta: {
    topic: 'Patta & Dharani',
    questionType: 'definition',
    explanation:
      'A **Patta** (Pattadar Passbook) is the official title deed establishing land ownership in Telangana. Under the integrated **Dharani Portal**, land records are maintained digitally with biometric authentication for agricultural properties, ensuring clean title tracking without manual tampering.',
    followUp: 'Would you like me to show you clear-title properties in Hyderabad?'
  },
  market_value: {
    topic: 'Market Value & Guidance Value',
    questionType: 'definition',
    explanation:
      '**Guidance Value (Government Circle Rate)** is the minimum base price fixed by the Telangana Government for calculating stamp duty and registration charges. **Market Value** is the actual commercial price agreed upon between buyer and seller based on real market demand, location infrastructure, and amenities.',
    followUp: 'Would you like me to show you properties in Hyderabad with attractive pricing?'
  },
  carpet_area: {
    topic: 'Carpet Area, Built-up & Super Built-up Area',
    questionType: 'definition',
    explanation:
      '**Carpet Area** is the actual usable net floor area inside the internal walls (as mandated by RERA). **Built-up Area** includes the carpet area plus internal/external wall thicknesses and private balconies. **Super Built-up Area** (saleable area) includes the built-up area plus a proportionate share of common community areas like elevators, corridors, lobbies, and clubhouses.',
    followUp: 'Would you like me to show you RERA-compliant apartments and villas in Hyderabad?'
  },
  bhk: {
    topic: 'BHK',
    questionType: 'definition',
    explanation:
      '**BHK** stands for **Bedroom, Hall, and Kitchen**, indicating the room configuration of residential apartments, villas, and independent houses (e.g. 2 BHK, 3 BHK, 4 BHK). In gated communities, BHK configurations often include attached bathrooms, balconies, and utility spaces.',
    followUp: 'Would you like me to show you available BHK properties in Hyderabad?'
  }
};

export function getEducationalTopicKnowledge(query: string): EducationalTopicEntry | null {
  if (!query) return null;
  const q = query.toLowerCase();

  if (/\brera\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.rera;
  if (/\bhmda\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.hmda;
  if (/\bdtcp\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.dtcp;
  if (/\bghmc\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.ghmc;
  if (/\bmunicipality\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.municipality;
  if (/\b(gram\s*panchayat|panchayat)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.gram_panchayat;
  if (/\b(ec\b|encumbrance)/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.ec;
  if (/\bmutation\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.mutation;
  if (/\b(registration|property\s*registration)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.registration;
  if (/\b(land\s*conversion|nala)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.land_conversion;
  if (/\blrs\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.lrs;
  if (/\b(building\s*permission|layout\s*approval)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.building_permission;
  if (/\b(vastu|vaastu)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.vastu;
  if (/\b(home\s*loan|home\s*loans|housing\s*loan)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.home_loans;
  if (/\b(legal\s*verification|property\s*verification)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.legal_verification;
  if (/\bproperty\s*tax\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.property_tax;
  if (/\bsale\s*deed\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.sale_deed;
  if (/\bagreement\s*of\s*sale\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.agreement_of_sale;
  if (/\b(patta|passbook|dharani)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.patta;
  if (/\b(market\s*value|guidance\s*value)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.market_value;
  if (/\b(carpet\s*area|built\s*up\s*area|super\s*built\s*up)\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.carpet_area;
  if (/\bbhk\b/i.test(q)) return REAL_ESTATE_EDUCATIONAL_KNOWLEDGE.bhk;

  return null;
}

/**
 * Deterministic Fallback Intent & Filter Parser
 * Used as a backup or validator for Gemini filter extraction
 */
export function extractFallbackFilters(query: string): StructuredPropertySearchFilter {
  const q = query.toLowerCase();

  // 1. Approvals
  const approvals: ApprovalType[] = [];
  if (/\bhmda\b/i.test(q)) approvals.push('HMDA');
  if (/\bdtcp\b/i.test(q)) approvals.push('DTCP');
  if (/\brera\b/i.test(q)) approvals.push('RERA');
  if (/\bghmc\b/i.test(q)) approvals.push('GHMC');
  if (/\b(gram\s*panchayat|panchayat)\b/i.test(q)) approvals.push('GRAM_PANCHAYAT');

  // 2. Property Categories
  const propertyTypes: PropertyCategory[] = [];
  const hasFarmHouse = /\b(farm\s*house|farmhouse)\b/i.test(q);
  const hasFarmLand = /\b(farm\s*land|farmland|agricultural|agriculture\s*land)\b/i.test(q);
  const hasVillaPlot = /\b(villa\s*plot|villas\s*plot|villa\s*plots|villas\s*plots)\b/i.test(q);
  const hasApartment = /\b(apartment|apartments|flat|flats|high\s*rise|residential\s*flat)\b/i.test(q);
  const hasVilla = /\b(villa|villas|independent\s*house|duplex|triplex)\b/i.test(q) && !hasVillaPlot;
  const hasPlot = /\b(plot|plots|open\s*plot|open\s*plots|venture|residential\s*plot|plotted)\b/i.test(q) || hasVillaPlot;
  const hasCommercial = /\b(commercial|shop|shops|office|offices|retail)\b/i.test(q);

  if (hasFarmHouse) propertyTypes.push('FARM_HOUSE');
  if (hasFarmLand) propertyTypes.push('FARM_LAND');
  if (hasApartment) propertyTypes.push('APARTMENT');
  if (hasVilla) propertyTypes.push('VILLA');
  if (hasPlot && !hasVilla) propertyTypes.push('PLOT');
  if (hasCommercial) propertyTypes.push('COMMERCIAL');

  // 3. Locations
  const knownLocations = [
    'shadnagar', 'kokapet', 'tellapur', 'mokila', 'lemoor', 'kothur',
    'sadashivpet', 'patancheru', 'gachibowli', 'shamshabad', 'kadthal',
    'maheshwaram', 'attapur', 'bhanur', 'uppal', 'rajapur', 'kandukur',
    'nednur', 'kallepally', 'balanagar', 'jubilee hills', 'banjara hills',
    'madhapur', 'hitec city', 'kondapur', 'manikonda', 'financial district',
    'nizampet', 'kompally', 'miyapur', 'bachupally', 'hyderabad'
  ];
  const locations: string[] = [];
  for (const loc of knownLocations) {
    if (new RegExp(`\\b${loc}\\b`, 'i').test(q)) {
      locations.push(loc.charAt(0).toUpperCase() + loc.slice(1));
    }
  }

  // 4. Budget
  let budget_max: number | null = null;
  let budget_min: number | null = null;
  const underMatch = q.match(/(?:under|below|within|upto|less than)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore|l|cr\b)?/i);
  if (underMatch) {
    const val = parseFloat(underMatch[1]);
    const unit = (underMatch[2] || '').toLowerCase();
    budget_max = unit.startsWith('cr') ? val * 10000000 : val * 100000;
  }
  const betweenMatch = q.match(/between\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|cr|crore)?\s*(?:and|to|-)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore)/i);
  if (betweenMatch) {
    const minVal = parseFloat(betweenMatch[1]);
    const maxVal = parseFloat(betweenMatch[2]);
    const unit = (betweenMatch[3] || '').toLowerCase();
    const mult = unit.startsWith('cr') ? 10000000 : 100000;
    budget_min = minVal * mult;
    budget_max = maxVal * mult;
  }

  // 5. BHK
  let bhk: number | null = null;
  const bhkMatch = q.match(/\b([1-9])\s*(?:bhk|bedroom|bed)\b/i);
  if (bhkMatch) {
    bhk = parseInt(bhkMatch[1], 10);
  }

  // If this is a general educational query, do NOT extract property search types or search intent!
  if (checkIsGeneralEducationalQuery(query)) {
    const edu = getEducationalTopicKnowledge(query);
    return {
      intent: 'GENERAL_INFORMATION',
      approval: approvals,
      property_type: [],
      location: [],
      budget_min: null,
      budget_max: null,
      bhk: null,
      size_min: null,
      size_max: null,
      facing: [],
      amenities: [],
      target_project: null,
      topic: edu ? edu.topic : 'Real Estate',
      question_type: edu ? edu.questionType : 'definition',
      requested_information: query
    };
  }

  // Intent classification: Only classify as PROPERTY_SEARCH when properties/listings are explicitly requested
  const hasSearchVerb = /\b(buy|show|find|list|available|display|search|give|get|look\s*for)\b/i.test(q);
  const isSearch =
    propertyTypes.length > 0 ||
    (locations.length > 0 && (budget_max !== null || hasSearchVerb || /\b(properties|property)\b/i.test(q))) ||
    (approvals.length > 0 && (propertyTypes.length > 0 || hasSearchVerb));

  const isWebsite = /\b(about|service|services|contact|phone|office|who is|vision|mission|founder|legal)\b/i.test(q);

  return {
    intent: isSearch ? 'PROPERTY_SEARCH' : (isWebsite ? 'WEBSITE_QUERY' : 'GENERAL_CONVERSATION'),
    approval: approvals,
    property_type: propertyTypes,
    location: locations,
    budget_min,
    budget_max,
    bhk,
    size_min: null,
    size_max: null,
    facing: [],
    amenities: []
  };
}

/**
 * Extracts Structured Search Filters using Gemini AI
 * Understands natural language, typos, poor grammar, Tenglish, abbreviations, and slang.
 */
export async function extractSearchFiltersWithGemini(
  query: string,
  apiKey: string
): Promise<StructuredPropertySearchFilter> {
  const fallback = extractFallbackFilters(query);

  if (!apiKey) {
    return fallback;
  }

  const prompt = `You are the intent and search-filter extractor for OPV (Open Plots & Villas) real-estate platform in Hyderabad, Telangana.
Analyze the user's input (which may contain typos, poor grammar, slang, Telugu-English / Tenglish, or abbreviations) and extract structured search filters into strict JSON format.

USER INPUT: "${query}"

EXTRACTION RULES:
1. "intent":
   - "PROPERTY_SEARCH": ONLY when the user explicitly wants to find, show, search, list, display, recommend, or buy properties/projects matching criteria (e.g. "RERA apartments", "HMDA plots in Shadnagar", "find villas in Hyderabad", "show properties under 1 crore", "RERA properties in Kokapet").
     CRITICAL: An approval keyword alone (e.g. "RERA", "HMDA", "DTCP", "GHMC") is NOT a property search!
   - "GENERAL_INFORMATION": questions, definitions, meanings, explanations, or terms about real-estate concepts, approvals, regulations, legal procedures, documentation, services (e.g. "RERA", "What is RERA?", "RERA meaning", "HMDA", "What is HMDA approval?", "DTCP meaning", "What is GHMC?", "What is EC?", "Mutation meaning", "Property registration process", "LRS", "Vastu", "rera enti", "hmda ante").
     When intent is "GENERAL_INFORMATION", also extract "topic" (e.g. "RERA"), "question_type" ("definition" | "process" | "rules" | "service"), and "requested_information".
   - "WEBSITE_QUERY": questions about OPV company, services, FAQs, mission, founders, office location, contact.
   - "GENERAL_CONVERSATION": greeting ("hi", "hello"), chit-chat, thanks.
2. "approval":
   - Array of strings from: ["HMDA", "DTCP", "RERA", "GHMC", "GRAM_PANCHAYAT"].
   - Include if mentioned. NOTE: The presence of an approval alone does NOT make the intent PROPERTY_SEARCH!
3. "property_type":
   - Array of strings from: ["APARTMENT", "VILLA", "PLOT", "FARM_LAND", "FARM_HOUSE", "COMMERCIAL"].
   - CRITICAL RULE: NEVER infer or invent a property type if the user did not explicitly mention it!
     "RERA" does NOT mean apartment. "HMDA" does NOT mean plot. "DTCP" does NOT mean open plot.
     If no specific property category was mentioned by the user, keep this array EMPTY ([]).
4. "location":
   - Array of location names in title case (e.g. ["Hyderabad"], ["Shadnagar"], etc.). Do not invent a location if not mentioned.
5. "budget_min" and "budget_max":
   - Numbers in Indian Rupees (e.g. "under 50 lakhs" -> budget_max: 5000000; "under 1 crore" -> budget_max: 10000000; "under 75L" -> budget_max: 7500000).
6. "bhk":
   - Integer number if explicitly requested (e.g. 2, 3, 4).

Respond ONLY with valid JSON:
{
  "intent": "PROPERTY_SEARCH" | "GENERAL_INFORMATION" | "WEBSITE_QUERY" | "GENERAL_CONVERSATION",
  "approval": [],
  "property_type": [],
  "location": [],
  "budget_min": null,
  "budget_max": null,
  "bhk": null,
  "size_min": null,
  "size_max": null,
  "facing": [],
  "amenities": [],
  "target_project": null,
  "topic": null,
  "question_type": null,
  "requested_information": null
} `;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);

        // Normalize property types to uppercase
        const validTypes: PropertyCategory[] = ['APARTMENT', 'VILLA', 'PLOT', 'FARM_LAND', 'FARM_HOUSE', 'COMMERCIAL'];
        const normalizedTypes: PropertyCategory[] = (parsed.property_type || [])
          .map((t: string) => t.toUpperCase().replace(/\s+/g, '_'))
          .filter((t: string) => validTypes.includes(t as PropertyCategory));

        // Normalize approvals to uppercase
        const validApprovals: ApprovalType[] = ['HMDA', 'DTCP', 'RERA', 'GHMC', 'GRAM_PANCHAYAT'];
        const normalizedApprovals: ApprovalType[] = (parsed.approval || [])
          .map((a: string) => a.toUpperCase().replace(/\s+/g, '_'))
          .filter((a: string) => validApprovals.includes(a as ApprovalType));

        const isGeneral = checkIsGeneralEducationalQuery(query);
        const finalIntent = isGeneral ? 'GENERAL_INFORMATION' : (parsed.intent || fallback.intent);
        const finalPropertyTypes = isGeneral ? [] : normalizedTypes;
        const edu = isGeneral ? getEducationalTopicKnowledge(query) : null;

        return {
          intent: finalIntent,
          approval: normalizedApprovals.length > 0 ? normalizedApprovals : fallback.approval,
          property_type: finalPropertyTypes.length > 0 ? finalPropertyTypes : fallback.property_type,
          location: Array.isArray(parsed.location) && parsed.location.length > 0 ? parsed.location : fallback.location,
          budget_min: typeof parsed.budget_min === 'number' ? parsed.budget_min : fallback.budget_min,
          budget_max: typeof parsed.budget_max === 'number' ? parsed.budget_max : fallback.budget_max,
          bhk: typeof parsed.bhk === 'number' ? parsed.bhk : fallback.bhk,
          size_min: parsed.size_min || null,
          size_max: parsed.size_max || null,
          facing: Array.isArray(parsed.facing) ? parsed.facing : [],
          amenities: Array.isArray(parsed.amenities) ? parsed.amenities : [],
          target_project: parsed.target_project || null,
          topic: isGeneral ? (edu ? edu.topic : (parsed.topic || fallback.topic || null)) : null,
          question_type: isGeneral ? (edu ? edu.questionType : (parsed.question_type || fallback.question_type || null)) : null,
          requested_information: isGeneral ? (parsed.requested_information || query) : null
        };
      }
    } catch {
      // Try next candidate model
      continue;
    }
  }

  return fallback;
}

/**
 * Calls Google Gemini REST API with automatic model fallback
 */
export async function generateGeminiResponse(
  options: GeminiGenerateOptions,
  apiKey: string
): Promise<string> {
  const { query, history = [], groundingData, groundingSourceType, language = 'en' } = options;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }

  const systemInstruction = `
You are the official AI Assistant for Open Plots & Villas (OPV) - Hyderabad's leading verified real estate platform.

CORE OPERATIONAL RULES:
1. Grounding & Factual Integrity:
   - Base your answers on the Grounding Data provided below whenever applicable.
   - Official Information Integrity: RERA numbers, HMDA numbers, DTCP numbers, LP numbers, prices, plot sizes, amenities, approvals, and locations MUST come directly from Grounding Data. NEVER invent fake RERA numbers or fake properties.
   - Zero-Result Explanations: If Grounding Data indicates ZERO_RESULTS, explain honestly that zero verified listings in OPV online database currently match the exact specifications.

2. GENERAL / EDUCATIONAL REAL ESTATE QUESTIONS (CRITICAL):
   - When the user asks about real estate concepts, terms, approvals, regulations, definitions, documentation, or services (such as RERA, HMDA, DTCP, GHMC, EC, Mutation, Registration, Patta, LRS, Vastu, BHK, Carpet Area, etc., in English, Telugu, or Tenglish):
     a. Answer the user's actual question directly with an accurate, authoritative explanation based on Telangana / Hyderabad real estate regulations and OPV website knowledge.
     b. Keep the explanation concise for simple definitions or comprehensive with important points for legal/regulatory procedures.
     c. NEVER output property search headings (like "**🏡 Apartment Properties in Hyderabad**") or "Projects Found".
     d. NEVER assume or invent a property type (e.g., do NOT assume RERA means apartments or HMDA means plots).
     e. DO NOT attach random properties or display property search cards.
     f. After your answer, optionally provide ONE short and natural follow-up question offering to show verified properties (for example:
        - For RERA: "Would you like me to show you RERA-registered properties in Hyderabad?"
        - For HMDA: "Would you like me to show you HMDA-approved properties in Hyderabad?"
        - For DTCP: "Would you like me to show you DTCP-approved properties in Hyderabad?"
        - For GHMC: "Would you like me to show you GHMC-related properties in Hyderabad?"
        - For EC: "Would you like me to help you find properties with the relevant documentation?"
        - For other real estate topics: A natural, polite one-line offer to show verified properties).
     g. If the user asked in Telugu or Tenglish (e.g. "what rera", "rera enti", "rera ante enti", "rera meaning cheppu", "hmda ante", "dtcp enti", "ghmc what", "what is ec", "ec enti", "mutation ante enti"), understand the intent and answer in natural Telugu or Tenglish.

3. PROPERTY SEARCH QUERIES:
   - For queries where the user searched for properties and cards are displayed, do NOT list individual property or project details (names, prices, RERA numbers, etc.) as long bullet points in the text response because property cards are displayed directly below.

4. CRITICAL LANGUAGE RULE:
   - The user has actively selected the interface language: "${language}".
   - If "${language}" is NOT 'en', YOU MUST WRITE YOUR ENTIRE RESPONSE NATURALLY AND FLUENTLY IN THE USER'S SELECTED LANGUAGE (${language}) (e.g. Tamil for 'ta', Telugu for 'te', Hindi for 'hi', Kannada for 'kn', Malayalam for 'ml', Bengali for 'bn', Marathi for 'mr', Gujarati for 'gu', etc.).
   - Even if grounding data and database records are in English, translate the explanation into the selected language (${language}) so the user receives an answer completely in their chosen language.
   - Keep established technical real-estate acronyms (like RERA, HMDA, DTCP, GHMC, EC) identifiable while explaining them fully in ${language}.

CURRENT GROUNDING SOURCE: ${groundingSourceType.toUpperCase()}
GROUNDING DATA:
"""
${groundingData || 'No specific records found.'}
"""
`.trim();

  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  const recentHistory = history.slice(-6);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024
          }
        })
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const msg = errorBody?.error?.message || `HTTP ${res.status}`;
        console.warn(`Gemini model ${model} warning: ${msg}. Trying next candidate...`);
        lastError = msg;
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini network error with ${model}:`, err.message);
      lastError = err.message;
    }
  }

  throw new Error(`All Gemini candidate models failed. Last error: ${lastError || 'Unknown error'}`);
}

/**
 * Translates a user query or question into the target Indian language using Gemini AI.
 * If the user's input is already written in the target script, or if the target is 'en',
 * returns the original query.
 */
export async function translateQueryWithGemini(
  query: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> {
  const clean = (query || '').trim();
  if (!clean || !apiKey || !targetLanguage || targetLanguage === 'en') {
    return clean;
  }

  // If the text does not contain any English/Latin letters (e.g. user already typed in Telugu script), no need to translate
  if (!/[a-zA-Z]/.test(clean)) {
    return clean;
  }

  const langNames: Record<string, string> = {
    te: 'Telugu',
    ta: 'Tamil',
    hi: 'Hindi',
    kn: 'Kannada',
    ml: 'Malayalam',
    mr: 'Marathi',
    bn: 'Bengali',
    gu: 'Gujarati',
    ur: 'Urdu',
    pa: 'Punjabi',
    or: 'Odia',
    mwr: 'Marwari',
    as: 'Assamese',
    mai: 'Maithili',
    sat: 'Santali',
    ks: 'Kashmiri',
    bho: 'Bhojpuri',
    ne: 'Nepali',
    sd: 'Sindhi',
    kok: 'Konkani',
    bgc: 'Haryanvi',
    hne: 'Chhattisgarhi',
    tcy: 'Tulu'
  };

  const targetLangName = langNames[targetLanguage] || targetLanguage;

  const systemInstruction = `You are a specialized real-estate multilingual assistant. Translate the following user query or search question into natural, conversational ${targetLangName} script.
Rules:
1. Preserve real-estate abbreviations and brand names as recognized terms (e.g. OPV, RERA, HMDA, DTCP, GHMC, EC, BHK, Sq.Yd.).
2. Translate words like "plots", "villas", "apartments", "services", "price", "budget", "show me", "what is", "provide" into natural ${targetLangName}.
3. Output ONLY the translated query text. Do not add quotes, introductory phrases, or explanation.`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: clean }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 120
          }
        })
      });

      if (!res.ok) continue;

      const data = await res.json();
      const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (translated) {
        // Strip any wrapping quotes
        return translated.replace(/^["'`]|["'`]$/g, '').trim();
      }
    } catch {
      // try next candidate
    }
  }

  return clean;
}

