import { createClient } from '@supabase/supabase-js';
import { retrieveWebsiteContent } from './websiteRetriever.ts';
import {
  generateGeminiResponse,
  extractSearchFiltersWithGemini,
  translateQueryWithGemini,
  checkIsGeneralEducationalQuery,
  getEducationalTopicKnowledge,
  type ChatHistoryMessage,
  type ApprovalType,
  type PropertyCategory,
  type StructuredPropertySearchFilter
} from './geminiService.ts';

export interface ChatRequestPayload {
  message: string;
  history?: ChatHistoryMessage[];
  language?: string;
}

export interface ChatResponsePayload {
  content: string;
  properties: any[];
  actions?: Array<{ label: string; url: string; action: string }>;
  category?: string;
  sourceType?: 'supabase_property' | 'opv_website' | 'general';
  translatedUserPrompt?: string;
}

/**
 * Known project aliases mapped to search keywords
 */
const KNOWN_PROJECT_KEYWORDS = [
  'golden terra',
  'magadha',
  'green medows',
  'myscape songs of the sun',
  'songs of the sun',
  'fortune santhalia',
  'fortune santholia',
  'winridge spar',
  'katyayani',
  'sanjeevani',
  'nri green county',
  'vasavi archana',
  'archana county',
  'tellapur neopolis',
  'blue lotus',
  'janapriya utopia',
  'golden city'
];

/**
 * Standard Action links
 */
function getStandardActions(phone = '9963513939', customWaMsg = 'Hello OPV, I have an inquiry') {
  return [
    { label: 'Call OPV Desk', url: `tel:+91${phone}`, action: 'call' },
    { label: 'Chat on WhatsApp', url: `https://wa.me/91${phone}?text=${encodeURIComponent(customWaMsg)}`, action: 'whatsapp' }
  ];
}

/**
 * Extracts context from history if the user is asking a follow-up about a previous project
 */
function extractContextProject(history: ChatHistoryMessage[]): string | null {
  if (!history || history.length === 0) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const text = history[i].content.toLowerCase();
    for (const proj of KNOWN_PROJECT_KEYWORDS) {
      if (text.includes(proj)) {
        return proj;
      }
    }
  }
  return null;
}

interface NormalizedPropertyRecord {
  id: string | number;
  title: string;
  normalizedType: PropertyCategory;
  normalizedApprovals: ApprovalType[];
  location: string;
  city: string;
  fullLocation: string;
  price: string;
  priceNumeric: number;
  priceDisplay: string;
  size: string;
  area: string;
  type: string;
  config?: string;
  bhk: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  imageUrl: string;
  images: string[];
  isFeatured: boolean;
  status: string;
  reraNumber: string | null;
  lpNumber: string | null;
  amenities: string[];
  projectName: string;
  agent: {
    name: string;
    phone: string;
    role: string;
    avatar?: string;
  };
  specifications: { label: string; value: string }[];
  overview: string;
  about: string;
  nearby: string[];
  rawDetails?: any;
}

/**
 * Strictly normalizes raw database property record into verified structured dimensions
 * NEVER determines property type based on BHK alone.
 */
function normalizeDatabaseRecord(p: any): NormalizedPropertyRecord {
  let parsedDesc: any = {};
  if (typeof p.description === 'string') {
    try {
      const jsonPart = p.description.split('||_OPV_EXTRA_||')[0];
      parsedDesc = JSON.parse(jsonPart);
    } catch { }
  }

  const titleLower = (p.title || '').toLowerCase();
  const rawType = (p.property_type || parsedDesc.propertyType || '').toLowerCase();
  const descType = (parsedDesc.propertyType || '').toLowerCase();

  // 1. APPROVALS NORMALIZATION (Source of truth: structured approval fields & verified tags)
  const approvalsSet = new Set<ApprovalType>();
  const addApp = (val: any) => {
    if (!val) return;
    const s = String(val).toUpperCase();
    if (s.includes('HMDA')) approvalsSet.add('HMDA');
    if (s.includes('DTCP')) approvalsSet.add('DTCP');
    if (s.includes('RERA')) approvalsSet.add('RERA');
    if (s.includes('GHMC')) approvalsSet.add('GHMC');
    if (s.includes('GRAM') || s.includes('PANCHAYAT')) approvalsSet.add('GRAM_PANCHAYAT');
  };

  addApp(p.approval_type);
  if (Array.isArray(parsedDesc.approvals)) parsedDesc.approvals.forEach(addApp);
  if (p.hmda_number && p.hmda_number !== 'NA' && p.hmda_number !== '') approvalsSet.add('HMDA');
  if (p.dtcp_number && p.dtcp_number !== 'NA' && p.dtcp_number !== '') approvalsSet.add('DTCP');
  if (p.rera_number && p.rera_number !== 'NA' && p.rera_number !== 'Not Applicable' && p.rera_number !== '') approvalsSet.add('RERA');

  // 2. PROPERTY TYPE NORMALIZATION (Strict classification - NEVER from BHK alone)
  let normalizedType: PropertyCategory = 'PLOT';
  const hasFarmKeywords = rawType.includes('farm') || rawType.includes('agri') || descType.includes('agri') || titleLower.includes('farm land') || titleLower.includes('agricultural') || titleLower.includes('farm house') || titleLower.includes('farmhouse') || titleLower.includes('golden farm');
  const hasPlotKeywords = titleLower.includes('villa plot') || titleLower.includes('villas plot') || rawType === 'plot' || descType.includes('plot') || titleLower.includes('plot for sale') || titleLower.includes('residential land & plot') || titleLower.includes('residential plots') || titleLower.includes('residential and commercial plots') || titleLower.includes('commercial and residential plots') || titleLower.includes('plots in');
  const isGenuineCommercial = p.property_type === 'commercial' || rawType === 'commercial' || (titleLower.includes('commercial') && (titleLower.includes('complex') || titleLower.includes('building') || titleLower.includes('office') || titleLower.includes('shop') || titleLower.includes('retail') || titleLower.includes('mall')));

  if (rawType.includes('farmhouse') || titleLower.includes('farmhouse') || titleLower.includes('farm house')) {
    normalizedType = 'FARM_HOUSE';
  } else if (hasFarmKeywords) {
    normalizedType = 'FARM_LAND';
  } else if (isGenuineCommercial) {
    normalizedType = 'COMMERCIAL';
  } else if (hasPlotKeywords) {
    normalizedType = 'PLOT';
  } else if (rawType.includes('flat') || rawType.includes('apartment') || descType.includes('flat') || descType.includes('apartment') || titleLower.includes('flat for') || titleLower.includes('flats for') || titleLower.includes('apartments & flats')) {
    normalizedType = 'APARTMENT';
  } else if (rawType.includes('villa') || descType.includes('villa') || (/\bvillas?\b/i.test(titleLower) && !titleLower.includes('plot')) || /\bhouse\b/i.test(titleLower)) {
    normalizedType = 'VILLA';
  } else {
    normalizedType = 'PLOT';
  }

  // 3. EFFECTIVE PRICE NORMALIZATION
  let priceNum = p.price || p.quotedprice || 0;
  if (parsedDesc.totalPrice) {
    const parsedTotal = parseFloat(String(parsedDesc.totalPrice).replace(/[^\d.]/g, ''));
    if (parsedTotal > 0) priceNum = parsedTotal;
  } else if (priceNum < 100000 && priceNum > 0) {
    const sizeVal = parseFloat(p.area || p.plot_size || parsedDesc.sizeInput || parsedDesc.plotSize || '150');
    priceNum = priceNum * (sizeVal > 0 ? sizeVal : 150);
  }

  const rera = p.rera_number && p.rera_number !== 'NA' && p.rera_number !== 'Not Applicable' ? p.rera_number : (parsedDesc.reraNumber || null);
  const lp = p.lp_number && p.lp_number !== 'NA' ? p.lp_number : (parsedDesc.lpNumber || null);
  const amenities = p.amenities && p.amenities.length > 0 ? p.amenities : (parsedDesc.amenities || ['24/7 Security', 'Blacktop Roads', 'Clear Title', 'Immediate Registration']);
  const size = p.area || p.plot_size || parsedDesc.sizeInput || parsedDesc.plotSize || null;
  const sizeUnit = p.plot_size_unit || parsedDesc.sizeUnit || parsedDesc.plotSizeUnit || 'Sq. Yd.';

  const formatSmartPrice = (val: number | string | null | undefined): string => {
    if (!val) return 'Price on Request';
    const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.]/g, '')) : Number(val);
    if (isNaN(num) || num <= 0) return 'Price on Request';
    if (num < 100000) {
      return `₹${num.toLocaleString('en-IN')}/sq.yd`;
    }
    if (num >= 10000000) {
      const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '');
      return `₹${cr} Cr`;
    }
    const l = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${l} Lakhs`;
  };

  const propBhk = parseInt(p.bhk || parsedDesc.bedrooms || '0', 10);
  const rawPriceVal = p.quotedprice && p.quotedprice < 100000 ? p.quotedprice : (p.price || p.quotedprice || parsedDesc.totalPrice || parsedDesc.quotedPrice);
  const formattedPrice = formatSmartPrice(rawPriceVal);
  const areaFormatted = size ? `${size} ${sizeUnit}` : (normalizedType === 'PLOT' ? 'Standard Plot' : 'Spacious Unit');

  const specs: { label: string; value: string }[] = [];
  if (p.project_name || parsedDesc.projectName) specs.push({ label: 'Project', value: p.project_name || parsedDesc.projectName });
  if (size) specs.push({ label: 'Size', value: areaFormatted });
  if (propBhk > 0) specs.push({ label: 'Configuration', value: `${propBhk} BHK` });
  if (p.facing || parsedDesc.facing) specs.push({ label: 'Facing', value: `${p.facing || parsedDesc.facing} Facing` });
  if (approvalsSet.size > 0) specs.push({ label: 'Approval', value: Array.from(approvalsSet).join(', ') });
  if (rera) specs.push({ label: 'RERA Number', value: rera });

  const nearbyList: string[] = [];
  if (p.landmark) nearbyList.push(`Near ${p.landmark}`);
  if (p.location) nearbyList.push(`${p.location} Junction`);
  if (nearbyList.length === 0) nearbyList.push('Close to Highway and ORR Connectivity');

  const agentName = p.owner_name || 'MANCHALA DAIVAPRAKASH';
  const agentPhone = p['phone number'] || p.owner_phone || '+91 9963513939';

  return {
    id: `db-${p.id}`,
    title: p.title || p.project_name || 'Verified Property Listing',
    normalizedType,
    normalizedApprovals: Array.from(approvalsSet),
    location: p.location || 'Hyderabad',
    city: p.city || 'Hyderabad',
    fullLocation: `${p.location || ''} ${p.city || ''} ${p.title || ''}`.toLowerCase(),
    price: formattedPrice,
    priceNumeric: priceNum,
    priceDisplay: formattedPrice,
    size: areaFormatted,
    area: areaFormatted,
    type: normalizedType === 'PLOT' ? 'plot' : normalizedType === 'COMMERCIAL' ? 'commercial' : normalizedType === 'VILLA' ? 'villa' : normalizedType === 'APARTMENT' ? 'apartment' : 'farmland',
    config: propBhk > 0 ? `${propBhk} BHK` : (normalizedType === 'PLOT' ? 'Plot' : normalizedType === 'COMMERCIAL' ? 'Commercial' : 'Standard Unit'),
    bhk: propBhk > 0 ? propBhk : null,
    bedrooms: propBhk > 0 ? propBhk : null,
    bathrooms: p.bathrooms || parsedDesc.bathrooms || null,
    imageUrl: (p.images && p.images[0] && !p.images[0].startsWith('file://')) ? p.images[0] : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    images: (p.images || []).filter((img: string) => !img.startsWith('file://')),
    isFeatured: Boolean(p.is_featured),
    status: p.status === 'For Rent' ? 'For Rent' : 'For Sale',
    reraNumber: rera,
    lpNumber: lp,
    amenities: amenities.slice(0, 10),
    projectName: parsedDesc.projectName || p.project_name || '',
    agent: {
      name: agentName,
      phone: agentPhone,
      role: 'Senior Property Advisor • OPV',
      avatar: agentName.charAt(0).toUpperCase() || 'M'
    },
    specifications: specs,
    overview: p.description ? p.description.slice(0, 150) : `${areaFormatted} located in ${p.location || 'Hyderabad'}. Verified genuine property directly listed on Open Plots & Villas.`,
    about: p.description || `${p.title || 'Property'} located in the prime zone of ${p.location || 'Hyderabad'}. Features clear legal titles, verified documentation, and immediate registration capability.`,
    nearby: nearbyList,
    rawDetails: {
      propId: `OPV-${p.id}`,
      propertyType: normalizedType,
      quotedPrice: formattedPrice,
      plotSize: areaFormatted,
      totalPrice: formattedPrice,
      projectName: parsedDesc.projectName || p.project_name || p.title,
      city: p.city || 'Hyderabad',
      location: p.location || 'Hyderabad'
    }
  };
}

/**
 * Generates a short, professional dynamic search summary for property searches.
 * Avoids duplicate property listings in text since cards are rendered immediately below.
 */
export function generatePropertySearchSummary(
  query: string,
  filters: StructuredPropertySearchFilter,
  matchedProperties: NormalizedPropertyRecord[],
  language: string = 'en'
): string {
  const q = (query || '').toLowerCase().trim();

  // 1. DYNAMIC PROPERTY TYPE DETECTION
  let headerType = 'Properties';
  let summaryType = 'Verified Properties';

  if (/\b(farm\s*land|farmland|agricultural|agriculture)\b/i.test(q) || filters.property_type?.includes('FARM_LAND')) {
    headerType = 'Farm Land';
    summaryType = 'Farm Lands';
  } else if (/\b(farm\s*house|farmhouse)\b/i.test(q) || filters.property_type?.includes('FARM_HOUSE')) {
    headerType = 'Farm House';
    summaryType = 'Farm Houses';
  } else if (/\b(commercial\s*plot|commercial\s*plots)\b/i.test(q)) {
    headerType = 'Commercial Plot';
    summaryType = 'Commercial Plots';
  } else if (/\b(shop|shops|retail)\b/i.test(q)) {
    headerType = 'Commercial Shop';
    summaryType = 'Commercial Shops';
  } else if (/\b(office|offices)\b/i.test(q)) {
    headerType = 'Commercial Office';
    summaryType = 'Commercial Offices';
  } else if (/\bcommercial\b/i.test(q) || filters.property_type?.includes('COMMERCIAL')) {
    headerType = 'Commercial';
    summaryType = 'Commercial Properties';
  } else if (/\b(flat|flats)\b/i.test(q)) {
    headerType = 'Flat';
    summaryType = 'Flats';
  } else if (/\b(apartment|apartments|high\s*rise)\b/i.test(q) || filters.property_type?.includes('APARTMENT')) {
    headerType = 'Apartment';
    summaryType = 'Apartments';
  } else if (/\b(duplex|triplex)\b/i.test(q)) {
    headerType = 'Duplex Villa';
    summaryType = 'Duplex Villas';
  } else if (/\b(independent\s*house|house|houses)\b/i.test(q)) {
    headerType = 'Independent House';
    summaryType = 'Independent Houses';
  } else if (/\b(villa|villas)\b/i.test(q) || filters.property_type?.includes('VILLA')) {
    headerType = 'Villa';
    summaryType = 'Villas';
  } else if (/\b(open\s*plot|open\s*plots|plot|plots|venture|layouts|plotted)\b/i.test(q) || filters.property_type?.includes('PLOT')) {
    headerType = 'Open Plot';
    summaryType = 'Open Plots';
  }

  // 2. DYNAMIC LOCATION DETECTION (with "in" vs "near")
  let locationDisplay = 'Hyderabad';
  let titleLocationPhrase = 'in Hyderabad';

  const nearMatch = q.match(/\bnear\s+([a-zA-Z\s]+?)(?:\s+(?:under|below|within|above|for|with|in|around|budget|\d)|$)/i);
  if (nearMatch && nearMatch[1].trim()) {
    const rawNearLoc = nearMatch[1].trim();
    const locCap = rawNearLoc.charAt(0).toUpperCase() + rawNearLoc.slice(1);
    const cleanedLoc = locCap.toLowerCase() === 'hyd' ? 'Hyderabad' : locCap;
    locationDisplay = `Near ${cleanedLoc}`;
    titleLocationPhrase = `near ${cleanedLoc}`;
  } else {
    let detectedLoc = '';
    if (filters.location && filters.location.length > 0) {
      detectedLoc = filters.location[0];
    } else {
      const knownLocations = [
        'shadnagar', 'kokapet', 'tellapur', 'mokila', 'lemoor', 'kothur',
        'sadashivpet', 'patancheru', 'gachibowli', 'shamshabad', 'kadthal',
        'maheshwaram', 'attapur', 'bhanur', 'uppal', 'rajapur', 'kandukur',
        'nednur', 'kallepally', 'balanagar', 'jubilee hills', 'banjara hills',
        'madhapur', 'hitec city', 'kondapur', 'manikonda', 'financial district',
        'nizampet', 'kompally', 'miyapur', 'bachupally', 'hyderabad', 'hyd'
      ];
      for (const loc of knownLocations) {
        if (new RegExp(`\\b${loc}\\b`, 'i').test(q)) {
          detectedLoc = loc.toLowerCase() === 'hyd' ? 'Hyderabad' : loc.charAt(0).toUpperCase() + loc.slice(1);
          break;
        }
      }
    }

    if (detectedLoc) {
      const finalLoc = detectedLoc.toLowerCase() === 'hyd' ? 'Hyderabad' : detectedLoc;
      locationDisplay = finalLoc;
      titleLocationPhrase = `in ${finalLoc}`;
    } else if (matchedProperties.length > 0 && matchedProperties[0].location) {
      const pLoc = matchedProperties[0].location;
      locationDisplay = pLoc;
      titleLocationPhrase = `in ${pLoc}`;
    }
  }

  // 3. DYNAMIC APPROVAL DETECTION
  let approvalLine = '';
  const approvals: string[] = [];
  if (filters.approval && filters.approval.length > 0) {
    approvals.push(...filters.approval);
  } else {
    if (/\bhmda\b/i.test(q)) approvals.push('HMDA');
    if (/\bdtcp\b/i.test(q)) approvals.push('DTCP');
    if (/\brera\b/i.test(q)) approvals.push('RERA');
    if (/\bghmc\b/i.test(q)) approvals.push('GHMC');
    if (/\b(gram\s*panchayat|panchayat)\b/i.test(q)) approvals.push('Gram Panchayat');
  }
  if (approvals.length > 0) {
    approvalLine = `**Approval:** ${[...new Set(approvals)].join(', ')}`;
  }

  // 4. DYNAMIC BUDGET DETECTION
  let budgetLine = '';
  const underMatch = q.match(/(?:under|below|within|upto|less than)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore|l)?/i);
  const betweenMatch = q.match(/between\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|cr|crore)?\s*(?:and|to|-)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore)/i);

  if (underMatch) {
    const val = underMatch[1];
    const unitRaw = (underMatch[2] || '').toLowerCase();
    const unit = unitRaw.startsWith('cr') ? 'Crore' : 'Lakhs';
    budgetLine = `**Budget:** Under ₹${val} ${unit}`;
  } else if (betweenMatch) {
    const minVal = betweenMatch[1];
    const maxVal = betweenMatch[2];
    const unitRaw = (betweenMatch[3] || '').toLowerCase();
    const unit = unitRaw.startsWith('cr') ? 'Crore' : 'Lakhs';
    budgetLine = `**Budget:** ₹${minVal} - ₹${maxVal} ${unit}`;
  } else if (filters.budget_max) {
    if (filters.budget_max >= 10000000) {
      const cr = filters.budget_max / 10000000;
      const formatted = cr % 1 === 0 ? cr.toString() : cr.toFixed(1);
      budgetLine = `**Budget:** Under ₹${formatted} Crore`;
    } else if (filters.budget_max >= 100000) {
      const lk = filters.budget_max / 100000;
      const formatted = lk % 1 === 0 ? lk.toString() : lk.toFixed(1);
      budgetLine = `**Budget:** Under ₹${formatted} Lakhs`;
    }
  }

  // 5. DYNAMIC BHK DETECTION
  let bhkLine = '';
  const bhkMatch = q.match(/\b([1-9])\s*(?:bhk|bedroom|bed)\b/i);
  if (bhkMatch) {
    bhkLine = `**BHK:** ${bhkMatch[1]} BHK`;
  } else if (filters.bhk) {
    bhkLine = `**BHK:** ${filters.bhk} BHK`;
  }

  // 6. DYNAMIC FACING DETECTION
  let facingLine = '';
  if (filters.facing && filters.facing.length > 0) {
    facingLine = `**Facing:** ${filters.facing.map(f => f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()).join(', ')} Facing`;
  } else {
    const facingMatch = q.match(/\b(east|west|north|south|north-east|north-west|south-east|south-west)\s*facing\b/i);
    if (facingMatch) {
      const f = facingMatch[1].charAt(0).toUpperCase() + facingMatch[1].slice(1).toLowerCase();
      facingLine = `**Facing:** ${f} Facing`;
    }
  }

  // 7. BUILD SUMMARY
  const searchResultsLines: string[] = [
    `**Property Type:** ${summaryType}`,
    `**Location:** ${locationDisplay}`
  ];

  if (approvalLine) searchResultsLines.push(approvalLine);
  if (budgetLine) searchResultsLines.push(budgetLine);
  if (bhkLine) searchResultsLines.push(bhkLine);
  if (facingLine) searchResultsLines.push(facingLine);

  searchResultsLines.push(`**Projects Found:** ${matchedProperties.length}`);

  // Dynamic localization mapping for non-English responses
  const SEARCH_SUMMARY_LANGUAGES: Record<string, {
    foundHeader: string;
    propTypeLabel: string;
    locLabel: string;
    approvalLabel: string;
    budgetLabel: string;
    projectsFoundLabel: string;
    footer: string;
    titleSuffix: (type: string, loc: string) => string;
  }> = {
    ta: {
      foundHeader: "நான் கண்டறிந்த விவரங்கள்",
      propTypeLabel: "சொத்து வகை",
      locLabel: "இடம்",
      approvalLabel: "ஒப்புதல்கள்",
      budgetLabel: "பட்ஜெட்",
      projectsFoundLabel: "கண்டறியப்பட்ட திட்டங்கள்",
      footer: "உங்கள் தேடலுக்குப் பொருந்தக்கூடிய சரிபார்க்கப்பட்ட சொத்துகள் கீழே உள்ள அட்டைகளில் கொடுக்கப்பட்டுள்ளன. இருப்பிடம், ஒப்புதல்கள், அளவுகள் மற்றும் விலைகளை நீங்கள் பார்க்கலாம்.",
      titleSuffix: (type, loc) => `**🏡 ${loc} உள்ள ${type === 'Properties' ? 'சொத்துகள்' : type + ' சொத்துகள்'}**`
    },
    te: {
      foundHeader: "నేను కనుగొన్న వివరాలు",
      propTypeLabel: "ప్రాపర్టీ రకం",
      locLabel: "ప్రాంతం",
      approvalLabel: "అనుమతులు",
      budgetLabel: "బడ్జెట్",
      projectsFoundLabel: "కనుగొనబడిన ప్రాజెక్ట్‌లు",
      footer: "మీ శోధనకు సరిపోలే ధృవీకరించబడిన ప్రాపర్టీలను క్రింది కార్డ్స్‌లో చూడవచ్చు. స్థలం, అనుమతులు, ప్లాట్ పరిమాణాలు మరియు ధరల వివరాలు క్రింద ఉన్నాయి.",
      titleSuffix: (type, loc) => `**🏡 ${loc} లో ${type === 'Properties' ? 'ప్రాపర్టీలు' : type + ' ప్రాపర్టీలు'}**`
    },
    hi: {
      foundHeader: "मुझे यह मिला",
      propTypeLabel: "संपत्ति प्रकार",
      locLabel: "स्थान",
      approvalLabel: "स्वीकृतियां",
      budgetLabel: "बजट",
      projectsFoundLabel: "मिले प्रोजेक्ट",
      footer: "आपकी खोज से मेल खाने वाली सत्यापित संपत्तियां नीचे दिए गए प्रॉपर्टी कार्ड में उपलब्ध हैं। आप स्थान, स्वीकृतियां, प्लॉट का आकार और मूल्य विवरण देख सकते हैं।",
      titleSuffix: (type, loc) => `**🏡 ${loc} में ${type === 'Properties' ? 'संपत्तियां' : type + ' संपत्तियां'}**`
    },
    kn: {
      foundHeader: "ನಾನು ಕಂಡುಕೊಂಡ ವಿವರಗಳು",
      propTypeLabel: "ಆಸ್ತಿಯ ಪ್ರಕಾರ",
      locLabel: "ಸ್ಥಳ",
      approvalLabel: "ಅನುಮೋದನೆಗಳು",
      budgetLabel: "ಬಜೆಟ್",
      projectsFoundLabel: "ಕಂಡುಬಂದ ಯೋಜನೆಗಳು",
      footer: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಪರಿಶೀಲಿಸಿದ ಆಸ್ತಿಗಳು ಕೆಳಗಿನ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ.",
      titleSuffix: (type, loc) => `**🏡 ${loc} ನಲ್ಲಿ ${type === 'Properties' ? 'ಆಸ್ತಿಗಳು' : type + ' ಆಸ್ತಿಗಳು'}**`
    },
    ml: {
      foundHeader: "കണ്ടെത്തിയ വിവരങ്ങൾ",
      propTypeLabel: "പ്രോപ്പർട്ടി തരം",
      locLabel: "സ്ഥലം",
      approvalLabel: "അംഗീകാരങ്ങൾ",
      budgetLabel: "ബഡ്ജറ്റ്",
      projectsFoundLabel: "കണ്ടെത്തിയ പ്രോജക്റ്റുകൾ",
      footer: "നിങ്ങളുടെ തിരയലിന് അനുയോജ്യമായ സ്ഥിരീകരിച്ച പ്രോപ്പർട്ടികൾ താഴെയുള്ള കാർഡുകളിൽ ലഭ്യമാണ്.",
      titleSuffix: (type, loc) => `**🏡 ${loc} ലെ ${type === 'Properties' ? 'പ്രോപ്പർട്ടികൾ' : type + ' പ്രോപ്പർട്ടികൾ'}**`
    }
  };

  const localized = SEARCH_SUMMARY_LANGUAGES[language];
  if (localized) {
    const locLines: string[] = [
      `**${localized.propTypeLabel}:** ${summaryType}`,
      `**${localized.locLabel}:** ${locationDisplay}`
    ];
    if (approvals.length > 0) locLines.push(`**${localized.approvalLabel}:** ${[...new Set(approvals)].join(', ')}`);
    if (budgetLine) locLines.push(budgetLine.replace('**Budget:**', `**${localized.budgetLabel}:**`));
    if (bhkLine) locLines.push(bhkLine);
    if (facingLine) locLines.push(facingLine);
    locLines.push(`**${localized.projectsFoundLabel}:** ${matchedProperties.length}`);

    return `${localized.titleSuffix(headerType, locationDisplay)}

✨ **${localized.foundHeader}**

${locLines.join('\n')}

${localized.footer}`.trim();
  }

  const mainTitle = headerType === 'Properties'
    ? `**🏡 Properties ${titleLocationPhrase}**`
    : `**🏡 ${headerType} Properties ${titleLocationPhrase}**`;

  return `${mainTitle}

✨ **Here's What I Found**

${searchResultsLines.join('\n')}

Here are the available verified properties matching your search. You can view location, approvals, plot sizes, pricing and amenities in the property cards below.`.trim();
}

/**
 * Main Chat Processing Handler (Server-Side)
 */
export async function handleChatRequest(
  payload: ChatRequestPayload,
  env: Record<string, string>
): Promise<ChatResponsePayload> {
  const { message, history = [], language = 'en' } = payload;
  const rawQuery = (message || '').trim();

  const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || 'https://bpwejmkgvvoqeumxhokr.supabase.co';
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Concurrently translate user query into target language if non-English
  const translationPromise = (language && language !== 'en' && geminiApiKey)
    ? translateQueryWithGemini(rawQuery, language, geminiApiKey).catch(() => rawQuery)
    : Promise.resolve(rawQuery);

  // 1. Identify previous project context if follow-up question
  const contextProject = extractContextProject(history);

  // 2. Extract structured search intent and filters using Gemini AI
  const filters: StructuredPropertySearchFilter = await extractSearchFiltersWithGemini(rawQuery, geminiApiKey);
  if (contextProject && !filters.target_project) {
    filters.target_project = contextProject;
  }

  // 3. Classify if query is General Educational Information or Property Search
  const isGeneralInfo =
    checkIsGeneralEducationalQuery(rawQuery) ||
    filters.intent === 'GENERAL_INFORMATION' ||
    filters.intent === 'WEBSITE_QUERY' ||
    filters.intent === 'GENERAL_CONVERSATION';

  const isPropertyOrProjectQuery =
    !isGeneralInfo &&
    (filters.intent === 'PROPERTY_SEARCH' ||
      filters.property_type.length > 0 ||
      Boolean(filters.target_project) ||
      (filters.location.length > 0 &&
        (filters.budget_max !== null ||
          filters.budget_min !== null ||
          filters.bhk !== null ||
          /\b(properties|property|projects|project|buy|show|find|search|list|available)\b/i.test(rawQuery))) ||
      (filters.approval.length > 0 &&
        (filters.property_type.length > 0 ||
          /\b(properties|property|projects|project|buy|show|find|search|list|available)\b/i.test(rawQuery))));

  let groundingData = '';
  let groundingSourceType: 'supabase_property' | 'opv_website' | 'general' = isGeneralInfo ? 'general' : 'opv_website';
  let matchedProperties: any[] = [];
  let finalAnswer = '';

  // =========================================================================
  // PATH A: PROPERTY / PROJECT QUESTION → QUERY SUPABASE WITH STRICT AND LOGIC
  // =========================================================================
  if (isPropertyOrProjectQuery) {
    try {
      const { data: allProperties, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.warn('Supabase property query error:', error.message);
      }

      const propertiesList: any[] = allProperties || [];

      // Apply STRICT AND FILTERING across all dimensions
      const filtered = propertiesList.map(normalizeDatabaseRecord).filter(p => {
        // Dimension 1: Approvals (AND logic)
        if (filters.approval.length > 0) {
          const hasApproval = filters.approval.some(reqApp => p.normalizedApprovals.includes(reqApp));
          if (!hasApproval) return false;
        }

        // Dimension 2: Property Type (AND logic)
        if (filters.property_type.length > 0) {
          const hasType = filters.property_type.includes(p.normalizedType);
          if (!hasType) return false;
        }

        // Dimension 3: Location (AND logic)
        if (filters.location.length > 0) {
          const hasLoc = filters.location.some(loc => {
            const l = loc.toLowerCase();
            if (l === 'hyderabad' || l === 'hyd') {
              return p.fullLocation.includes('hyderabad') || p.fullLocation.includes('telangana');
            }
            return p.fullLocation.includes(l);
          });
          if (!hasLoc) return false;
        }

        // Dimension 4: Budget (AND logic)
        if (filters.budget_max !== null) {
          if (p.priceNumeric > 0 && p.priceNumeric > filters.budget_max) return false;
        }
        if (filters.budget_min !== null) {
          if (p.priceNumeric > 0 && p.priceNumeric < filters.budget_min) return false;
        }

        // Dimension 5: BHK (AND logic)
        if (filters.bhk !== null) {
          if (p.bhk !== null && p.bhk !== filters.bhk) return false;
        }

        // Specific Target Project match
        if (filters.target_project) {
          const tProj = filters.target_project.toLowerCase();
          const match = p.title.toLowerCase().includes(tProj) || p.projectName.toLowerCase().includes(tProj);
          if (!match) return false;
        }

        return true;
      });

      groundingSourceType = 'supabase_property';

      if (filtered.length > 0) {
        // TIER 1: EXACT MATCH (Category + Location + Budget + Approvals)
        matchedProperties = filtered.slice(0, 6);

        // Check if query is an attribute question about a specific project (e.g. "What is RERA of X?")
        const isFactualAttributeQuery = Boolean(
          filters.target_project &&
          /\b(what is|who is|tell me about|explain|rera number|contact|developer|phone)\b/i.test(rawQuery)
        );

        if (!isFactualAttributeQuery) {
          // GENERATE SHORT DYNAMIC SEARCH SUMMARY DIRECTLY
          finalAnswer = generatePropertySearchSummary(rawQuery, filters, matchedProperties, language);
        } else {
          // Formulate strict grounding string for Gemini to answer the specific attribute question
          groundingData = matchedProperties.map((p, idx) => `
Record #${idx + 1}:
- Project/Property Title: ${p.title}
- Property Category: ${p.normalizedType}
- Location: ${p.location}, ${p.city}
- Price: ${p.priceDisplay}
- Size: ${p.size}
- Approvals: ${p.normalizedApprovals.join(', ') || 'Contact Advisor for Details'}
- RERA Registration Number: ${p.reraNumber || 'Not explicitly listed in database'}
- Layout Permission (LP) Number: ${p.lpNumber || 'Not explicitly listed in database'}
- Key Amenities: ${p.amenities.join(', ') || 'Standard gated community amenities'}
- Verified Official Images Available: ${p.images.length > 0 ? `${p.images.length} photos in attached card` : 'Displayed in attached card'}
- Direct Listing ID: #${p.id}
`.trim()).join('\n\n');
        }
      } else if (filters.property_type.length > 0) {
        // TIER 2: CATEGORY-FIRST SMART FALLBACK (Keep exact Category & Budget, relax Location)
        const categoryMatches = propertiesList.map(normalizeDatabaseRecord).filter(p => {
          // Strict Category match
          const hasType = filters.property_type.includes(p.normalizedType);
          if (!hasType) return false;

          // Approvals match if specified
          if (filters.approval.length > 0) {
            const hasApproval = filters.approval.some(reqApp => p.normalizedApprovals.includes(reqApp));
            if (!hasApproval) return false;
          }

          // Budget match if specified
          if (filters.budget_max !== null && p.priceNumeric > 0 && p.priceNumeric > filters.budget_max) return false;
          if (filters.budget_min !== null && p.priceNumeric > 0 && p.priceNumeric < filters.budget_min) return false;

          return true;
        });

        if (categoryMatches.length > 0) {
          matchedProperties = categoryMatches.slice(0, 6);
          const reqLoc = filters.location.length > 0 ? filters.location.join(', ') : 'Hyderabad';
          
          const typeDisplayMap: Record<PropertyCategory, string> = {
            PLOT: 'Open Plots',
            COMMERCIAL: 'Commercial Properties',
            APARTMENT: 'Apartments / Flats',
            VILLA: 'Villas',
            FARM_LAND: 'Farm Lands',
            FARM_HOUSE: 'Farm Houses'
          };
          const mainCategory = filters.property_type[0];
          const displayCategoryName = typeDisplayMap[mainCategory] || 'Properties';
          const availableLocations = Array.from(new Set(matchedProperties.map(p => p.location))).slice(0, 3).join(', ');

          if (mainCategory === 'COMMERCIAL') {
            const prop = matchedProperties[0];
            finalAnswer = `**🏡 Commercial Properties Available on OPV**

✨ **Here's What I Found**

**Property Type:** Commercial Properties
**Available Location:** ${prop.location}
**Projects Found:** ${matchedProperties.length}

Currently, we do not have commercial properties listed inside ${reqLoc} city limits online. However, we have **${matchedProperties.length} verified commercial property** in **${prop.location}** (*${prop.title}*) listed below.

Our OPV advisors also have exclusive offline commercial properties and lands across Hyderabad. Feel free to contact an advisor below.`.trim();
          } else {
            finalAnswer = `**🏡 ${displayCategoryName} Available on OPV**

✨ **Here's What I Found**

**Property Type:** ${displayCategoryName}
**Available Locations:** ${availableLocations}
**Projects Found:** ${matchedProperties.length}

Currently, we do not have active ${displayCategoryName.toLowerCase()} listed directly in **${reqLoc}** in our online catalog. However, here are **${matchedProperties.length} verified ${displayCategoryName.toLowerCase()}** available in active prime growth corridors (${availableLocations}) listed below.

Our OPV advisors also have exclusive offline listings in ${reqLoc}. Connect with an advisor below via Phone or WhatsApp.`.trim();
          }
        } else {
          matchedProperties = [];
          groundingData = `ZERO_RESULTS: No verified listings in the active OPV Supabase database currently meet the requested criteria.`;
        }
      } else {
        // STRICT ZERO-RESULT HANDLING: No properties match all criteria
        matchedProperties = [];
        groundingData = `ZERO_RESULTS: No verified listings in the active OPV Supabase database currently meet ALL of the user's requested search criteria:
- Requested Approvals: ${filters.approval.join(', ') || 'Any'}
- Requested Property Types: ${filters.property_type.join(', ') || 'Any'}
- Requested Locations: ${filters.location.join(', ') || 'Any'}
- Requested Budget: ${filters.budget_max ? 'Under ₹' + filters.budget_max : 'Any'}

INSTRUCTIONS FOR YOUR RESPONSE:
1. Explain clearly and politely that zero active verified listings in our online database currently match these exact specifications.
2. Provide a helpful real-estate explanation where relevant.
3. Do NOT invent, fabricate, or substitute alternative properties.
4. Inform the user that OPV property advisors have direct access to exclusive offline and upcoming inventories.
5. Offer to connect with an OPV advisor via phone or WhatsApp.`;
      }
    } catch (dbErr: any) {
      console.warn('Supabase property query error:', dbErr?.message || dbErr);
    }
  }

  // =========================================================================
  // PATH B: WEBSITE QUESTION / EDUCATIONAL TOPIC → DYNAMIC RETRIEVAL
  // =========================================================================
  if (!groundingData && !finalAnswer) {
    groundingSourceType = isGeneralInfo ? 'general' : 'opv_website';
    const eduTopic = getEducationalTopicKnowledge(rawQuery);
    const retrieved = await retrieveWebsiteContent(rawQuery);

    const parts: string[] = [];
    if (eduTopic) {
      parts.push(`Official Real Estate Reference:\nTopic: ${eduTopic.topic}\nExplanation: ${eduTopic.explanation}\n\nSuggested Follow-up Question: ${eduTopic.followUp}`);
    }
    if (retrieved.found && retrieved.text) {
      parts.push(`OPV Website Source (${retrieved.url}):\nPage Title: ${retrieved.title}\nRetrieved Page Text:\n${retrieved.text}`);
    }

    if (parts.length > 0) {
      groundingData = parts.join('\n\n');
    }
  }

  // =========================================================================
  // AI REASONING & RESPONSE GENERATION (GEMINI AI ENGINE)
  // =========================================================================
  if (geminiApiKey && !finalAnswer) {
    try {
      finalAnswer = await generateGeminiResponse(
        {
          query: rawQuery,
          history,
          groundingData,
          groundingSourceType,
          language
        },
        geminiApiKey
      );
    } catch (geminiErr: any) {
      console.warn('Gemini Generation Warning:', geminiErr?.message || geminiErr);
    }
  }

  // Graceful fallback if Gemini did not produce an answer
  if (!finalAnswer) {
    if (matchedProperties.length > 0) {
      finalAnswer = generatePropertySearchSummary(rawQuery, filters, matchedProperties, language);
    } else {
      const eduTopic = getEducationalTopicKnowledge(rawQuery);
      if (eduTopic) {
        finalAnswer = `${eduTopic.explanation}\n\n${eduTopic.followUp}`;
      } else if (filters.property_type.length > 0 || filters.intent === 'PROPERTY_SEARCH') {
        const propTypeName = filters.property_type.length > 0 ? filters.property_type.map(t => t.toLowerCase().replace('_', ' ')).join(', ') : 'property';
        const locName = filters.location.length > 0 ? filters.location.join(', ') : 'Hyderabad';
        finalAnswer = `Currently, there are no active verified **${propTypeName}** listings in **${locName}** available in our online catalog.\n\nHowever, our OPV property advisors have direct access to exclusive offline listings and upcoming commercial and land opportunities across Hyderabad. Please connect directly with an OPV advisor below via Phone or WhatsApp.`;
      } else {
        finalAnswer = `I don't have that specific information in our active records right now. Please connect directly with an OPV advisor who can assist you.`;
      }
    }
  }

  const primaryProj = matchedProperties[0];
  const customWa = primaryProj
    ? `Hello OPV, I am inquiring about ${primaryProj.title}`
    : `Hello OPV, I have an inquiry: ${rawQuery}`;

  const translatedUserPrompt = await translationPromise;

  return {
    content: finalAnswer,
    properties: matchedProperties, // ALWAYS an array: [] when 0 matches!
    actions: getStandardActions('9963513939', customWa),
    category: primaryProj ? (primaryProj.normalizedType === 'PLOT' ? 'plots' : 'villas') : 'general',
    sourceType: groundingSourceType,
    translatedUserPrompt: (translatedUserPrompt && translatedUserPrompt !== rawQuery) ? translatedUserPrompt : undefined
  };
}
