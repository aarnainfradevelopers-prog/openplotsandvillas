import { PropertyItem, LanguageCode } from '../types/chat';
import { getPropertyDetailsStrings } from '../data/propertyDetailsI18n';

export interface KeyDetailItem {
  label: string;
  value: string;
}

export interface CleanOverviewData {
  projectName: string;
  subhead: string;
  summary: string;
  keyDetails: KeyDetailItem[];
  about?: string;
  whyConsiderItems: string[];
  reraNumber?: string;
  approval?: string;
}

/**
 * Strips raw JSON strings and parses fields if stringified JSON was stored in the database.
 */
export const sanitizeRawText = (val?: string): string => {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const obj = JSON.parse(trimmed);
      const parts: string[] = [];
      if (obj.description && typeof obj.description === 'string' && !obj.description.startsWith('{')) {
        parts.push(obj.description);
      }
      if (obj.propertyType) parts.push(`Type: ${obj.propertyType}`);
      if (obj.sizeInput && obj.sizeUnit) parts.push(`Area: ${obj.sizeInput} ${obj.sizeUnit}`);
      if (obj.facing) parts.push(`Facing: ${obj.facing}`);
      if (obj.dimension) parts.push(`Dimension: ${obj.dimension}`);
      return parts.length > 0 ? parts.join(' · ') : '';
    } catch {
      return '';
    }
  }
  return trimmed;
};

/**
 * Extracts a clean, concise project/property name without long marketing titles.
 */
export const extractCleanProjectName = (property: PropertyItem): string => {
  const rawProject = property.rawDetails?.projectName;
  if (rawProject && !rawProject.startsWith('{') && !rawProject.toLowerCase().startsWith('welcome to') && rawProject.length < 60) {
    return rawProject.trim();
  }

  const title = property.title || '';

  // Extract from quotes if present: e.g. '... in "Fortune Santhalia Sky Villas" ...'
  const quoteMatch = title.match(/"([^"]+)"/);
  if (quoteMatch && quoteMatch[1] && !quoteMatch[1].toLowerCase().includes('welcome') && quoteMatch[1].length < 50) {
    // If the quote is a long marketing phrase, keep looking
    if (!quoteMatch[1].toLowerCase().includes('ultra luxury')) {
      return quoteMatch[1].trim();
    }
  }

  // Handle standard "BHK - Project Name for Sale" format
  if (title.includes(' - ') || title.includes(' – ')) {
    const parts = title.split(/[–-]/);
    if (parts.length >= 2) {
      let candidate = parts[1].trim();
      candidate = candidate.split(/\s+(?:for\s+sale|for\s+rent|at|in)\b/i)[0].trim();
      if (candidate && candidate.length > 2 && candidate.length < 60) {
        return candidate.replace(/^["']|["']$/g, '').trim();
      }
    }
  }

  // Fallback: clean title of "Welcome to" and excessive filler
  let cleanTitle = title.replace(/^Welcome to\s+["']?/i, '');
  cleanTitle = cleanTitle.split(/\s+(?:for\s+sale|for\s+rent)\b/i)[0];
  if (cleanTitle.length > 50) {
    cleanTitle = cleanTitle.slice(0, 48) + '...';
  }
  return cleanTitle.replace(/["']/g, '').trim() || 'Premium Property';
};

/**
 * Formats a clean category subhead (e.g. "4 BHK Luxury Villas", "Residential Plots").
 */
export const getCleanSubhead = (property: PropertyItem, currentLanguage: LanguageCode = 'en'): string => {
  const isPlot = property.type === 'plot';
  const isVilla = property.type === 'villa';

  if (currentLanguage === 'te') {
    if (isPlot) return 'ఓపెన్ రెసిడెన్షియల్ ప్లాట్లు';
    if (isVilla) return property.bhk ? `${property.bhk} BHK లగ్జరీ విల్లా` : 'లగ్జరీ విల్లా';
    return property.config ? `${property.config} ప్రాపర్టీ` : 'ప్రాపర్టీ';
  }
  if (currentLanguage === 'hi') {
    if (isPlot) return 'रेजिडेंशियल प्लॉट्स';
    if (isVilla) return property.bhk ? `${property.bhk} BHK लक्जरी विला` : 'लक्जरी विला';
    return property.config ? `${property.config} प्रॉपर्टी` : 'प्रॉपर्टी';
  }

  if (property.bhk) {
    return isVilla ? `${property.bhk} BHK Luxury Villas` : `${property.bhk} BHK Apartments & Flats`;
  }
  if (property.config && property.config.toUpperCase().includes('BHK')) {
    return isVilla ? `${property.config} Luxury Villas` : `${property.config} Residential Units`;
  }
  if (isPlot) return 'Premium Residential Plots';
  if (isVilla) return 'Luxury Independent Villas';
  return 'Premium Residential Property';
};

/**
 * Removes boilerplate marketing filler from descriptions.
 */
export const cleanMarketingText = (text: string): string => {
  if (!text) return '';
  let cleaned = text;

  // Remove "Welcome to ..." and leading marketing preambles
  cleaned = cleaned.replace(/^Welcome to\s+["']?[^"'\n]+["']?\s*(?:located in\s+)?/gi, '');
  cleaned = cleaned.replace(/^located in the prestigious\s+["']?[^"'\n]+["']?\s*project\s*/gi, '');
  cleaned = cleaned.replace(/is\s+very\s+best\s+in\s+[^.\n]+luxury\s+living\s+segment\.?/gi, '');
  cleaned = cleaned.replace(/This\s+magnificent\s+[^.\n]+spans\s+an\s+ideal\s+layout,?\s*/gi, '');
  cleaned = cleaned.replace(/offering\s+(?:an\s+)?excellent\s+investment\s+(?:potential|opportunity)\s+and\s+a\s+serene\s+living\s+experience\.?/gi, '');
  cleaned = cleaned.replace(/Key\s+features\s+include:[\s\S]*?(?:Perfect for|Don't miss|\n|$)/gi, ' ');
  cleaned = cleaned.replace(/Perfect\s+for\s+building\s+your\s+custom\s+dream\s+home\s+or\s+securing\s+a\s+high-yield\s+investment\s+asset\.?/gi, '');
  cleaned = cleaned.replace(/Don't\s+miss\s+out\s+on\s+this\s+absolute\s+gem!?/gi, '');
  cleaned = cleaned.replace(/This\s+prestigious\s+project\s+is\s+one\s+of\s+the\s+finest[^.\n]*\.?/gi, '');

  // Collapse multiple spaces and clean up punctuation
  cleaned = cleaned.replace(/\s+/g, ' ').replace(/\s*\.\s*\./g, '.').trim();
  return cleaned;
};

/**
 * Main helper to build clean, concise, premium Overview data according to real-estate standards.
 */
export const getCleanOverviewData = (
  property: PropertyItem,
  currentLanguage: LanguageCode = 'en'
): CleanOverviewData => {
  const pLocale = getPropertyDetailsStrings(currentLanguage);

  const projectName = extractCleanProjectName(property);
  const subhead = getCleanSubhead(property, currentLanguage);

  // 1. Clean 2-3 Line Summary
  let summary = '';
  if (currentLanguage === 'te') {
    const facingStr = property.facing ? `${property.facing} ఫేసింగ్ ` : '';
    const typeStr = property.type === 'plot' ? 'రెసిడెన్షియల్ ప్లాట్' : property.type === 'villa' ? 'విల్లా' : 'ప్రాపర్టీ';
    summary = `${property.location}లో ${facingStr}${typeStr}. వాస్తు అనుకూల లేఅవుట్, స్పష్టమైన చట్టపరమైన టైటిల్స్ మరియు ఆధునిక సదుపాయాలు కలిగి ఉంది.`;
  } else if (currentLanguage === 'hi') {
    const facingStr = property.facing ? `${property.facing} फेसिंग ` : '';
    const typeStr = property.type === 'plot' ? 'रेजिडेंशियल प्लॉट' : property.type === 'villa' ? 'विला' : 'प्रॉपर्टी';
    summary = `${property.location} में ${facingStr}${typeStr}। वास्तु अनुकूल लेआउट, स्पष्ट कानूनी दस्तावेज और आधुनिक सुविधाएं उपलब्ध हैं।`;
  } else if (currentLanguage === 'ta') {
    const typeStr = property.type === 'plot' ? 'ரெசிடென்ஷியல் பிளாட்' : property.type === 'villa' ? 'வில்லா' : 'சொத்து';
    summary = `${property.location}-ல் அமைந்துள்ள ${typeStr}. தெளிவான சட்ட ஆவணங்கள் மற்றும் நவீன சமுதாய வசதிகள்.`;
  } else {
    const facingStr = property.facing ? `${property.facing.replace(/ facing/i, '')}-facing ` : '';
    const typeStr = property.type === 'plot' ? 'residential plots' : property.type === 'villa' ? 'luxury villas' : 'property';
    const approvalStr = property.approval
      ? ` with ${property.approval}`
      : property.reraNumber
      ? ' with HMDA and RERA approval'
      : '';
    summary = `Premium ${facingStr}${typeStr} in ${property.location}${approvalStr}, featuring an optimized layout, clear legal titles, excellent connectivity, and modern community amenities.`;
  }

  // 2. Key Details (Only non-empty, non-null, human-readable fields, NO raw JSON)
  const keyDetails: KeyDetailItem[] = [];

  const isValidValue = (v?: string | number | null): boolean => {
    if (v === undefined || v === null) return false;
    const str = String(v).trim();
    if (!str || str === 'NA' || str === 'N/A' || str === 'null' || str === 'undefined' || str === 'none') {
      return false;
    }
    if (str.startsWith('{') || str.includes('{"')) return false;
    return true;
  };

  // Property Type
  const propTypeValue = property.bhk
    ? `${property.bhk} BHK ${property.type === 'villa' ? 'Villa' : property.type === 'plot' ? 'Plot' : 'Apartment'}`
    : property.type === 'plot'
    ? 'Residential Plot'
    : property.type === 'villa'
    ? 'Luxury Villa'
    : property.config || property.type;
  if (isValidValue(propTypeValue)) {
    keyDetails.push({ label: 'Property Type', value: propTypeValue });
  }

  // Location
  const locValue = property.rawDetails?.location || property.location;
  if (isValidValue(locValue)) {
    keyDetails.push({ label: 'Location', value: locValue });
  }

  // Facing
  const facingValue = property.facing || property.rawDetails?.facing;
  if (isValidValue(facingValue) && facingValue) {
    keyDetails.push({ label: 'Facing', value: facingValue.replace(/ facing/i, '') + ' Facing' });
  }

  // Configuration
  const configValue = property.config || (property.bhk ? `${property.bhk} BHK` : property.type === 'plot' ? 'Plot' : undefined);
  if (isValidValue(configValue) && configValue && configValue !== propTypeValue) {
    keyDetails.push({ label: 'Configuration', value: configValue });
  }

  // Size
  const sizeValue = property.area || property.rawDetails?.plotSize;
  if (isValidValue(sizeValue) && sizeValue) {
    keyDetails.push({ label: 'Size', value: sizeValue });
  }

  // Dimensions
  const dimValue = property.specifications?.find(s => s.label.toLowerCase().includes('dimension'))?.value;
  if (isValidValue(dimValue) && dimValue) {
    keyDetails.push({ label: 'Dimensions', value: dimValue.replace(/\*/g, ' × ') });
  }

  // Approval
  const approvalValue = property.approval;
  if (isValidValue(approvalValue) && approvalValue) {
    keyDetails.push({ label: 'Approval', value: approvalValue });
  }

  // RERA No.
  const reraVal = property.reraNumber && isValidValue(property.reraNumber) ? property.reraNumber : undefined;
  if (reraVal) {
    keyDetails.push({ label: 'RERA No.', value: reraVal });
  }

  // Status / Possession (if available)
  if (isValidValue(property.possession) && property.possession && property.possession !== 'ready_to_move') {
    keyDetails.push({ label: 'Possession', value: property.possession });
  }

  // 3. Factual About / Description (Only if distinct, substantive, and non-repetitive)
  let cleanAbout: string | undefined = undefined;
  const rawAboutSource = sanitizeRawText(property.about || property.overview);
  if (rawAboutSource && !rawAboutSource.startsWith('{')) {
    const stripped = cleanMarketingText(rawAboutSource);
    // If stripped text is clean and doesn't just duplicate the summary or project name
    if (stripped.length > 30 && !stripped.toLowerCase().includes('welcome to') && stripped !== summary) {
      // Limit to 2-3 concise sentences
      const sentences = stripped.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
      cleanAbout = sentences.slice(0, 3).join(' ');
    }
  }

  // 4. Why Consider This (3-5 strongest, factual bullet points)
  const whyConsiderItems: string[] = [];
  if (property.possession) {
    whyConsiderItems.push(property.possession === 'ready_to_move' ? pLocale.readyToMove : property.possession);
  } else {
    whyConsiderItems.push(property.type === 'plot' ? pLocale.immediateRegistration : pLocale.readyToMove);
  }

  if (property.approval) {
    whyConsiderItems.push(property.approval);
  } else if (reraVal) {
    whyConsiderItems.push(`HMDA & RERA Approved (${reraVal})`);
  } else {
    whyConsiderItems.push(pLocale.verifiedClearTitle);
  }

  whyConsiderItems.push(property.type === 'plot' ? '100% Vastu Compliant Layout' : '100% Vastu Compliant');
  whyConsiderItems.push('24/7 Security & Gated Community');
  whyConsiderItems.push('Excellent Road Connectivity');

  const topWhyConsider = whyConsiderItems.slice(0, 5);

  return {
    projectName,
    subhead,
    summary,
    keyDetails,
    about: cleanAbout,
    whyConsiderItems: topWhyConsider,
    reraNumber: reraVal,
    approval: isValidValue(approvalValue) && approvalValue ? approvalValue : undefined
  };
};

/**
 * Resolves the direct website URL on openplotsandvillas.com for a given property
 */
export function getPropertyWebsiteUrl(property?: PropertyItem | null): string {
  if (!property) return 'https://openplotsandvillas.com/properties/';

  // 1. Direct websiteUrl if already provided (e.g. from Supabase / listing data)
  if (property.websiteUrl) return property.websiteUrl;

  const searchQuery = encodeURIComponent(property.title || '');
  const searchParam = searchQuery ? `?search=${searchQuery}` : '';
  const type = (property.type || '').toLowerCase();

  if (type.includes('plot') || type.includes('land')) {
    return `https://openplotsandvillas.com/properties/plots-for-sale-in-hyderabad/${searchParam}`;
  }
  if (type.includes('villa') || type.includes('house') || type.includes('duplex')) {
    return `https://openplotsandvillas.com/properties/houses-for-sale-in-hyderabad/${searchParam}`;
  }
  if (type.includes('apartment') || type.includes('flat') || type.includes('bhk')) {
    return `https://openplotsandvillas.com/properties/flats-for-sale-in-hyderabad/${searchParam}`;
  }
  if (type.includes('farm') || type.includes('agri')) {
    return `https://openplotsandvillas.com/properties/agriculture-lands-for-sale-in-hyderabad/${searchParam}`;
  }
  if (type.includes('commercial')) {
    return `https://openplotsandvillas.com/properties/commercial-properties-for-sale-in-hyderabad/${searchParam}`;
  }

  return `https://openplotsandvillas.com/properties/${searchParam}`;
}
