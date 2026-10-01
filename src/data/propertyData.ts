import { PropertyItem } from '../types/chat';
import { normalizeQuery } from '../utils/intentClassifier';

export const OPV_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';

/**
 * Supabase is the EXCLUSIVE source of OPV property and project data.
 * No static website content or fallback property inventory is used.
 */
let isLiveSupabaseLoaded = false;
let activeProperties: PropertyItem[] = [];

export function updateActiveProperties(properties: PropertyItem[]) {
  if (properties && Array.isArray(properties) && properties.length > 0) {
    activeProperties = [...properties];
    isLiveSupabaseLoaded = true;
  }
}

export function isUsingLiveSupabase(): boolean {
  return isLiveSupabaseLoaded;
}

export function getActiveProperties(): PropertyItem[] {
  return activeProperties;
}

/**
 * Parses budget constraints like 'under 30 lakhs', 'below 50L', 'under 1 cr', 'between 20 and 40 lakhs'
 */
export function parseBudgetLimits(query: string): { minPrice?: number; maxPrice?: number } | null {
  const q = query.toLowerCase();

  const parseUnit = (numStr: string, unitStr: string): number => {
    const n = parseFloat(numStr);
    const u = (unitStr || '').toLowerCase();
    if (u.startsWith('cr')) return Math.round(n * 10000000);
    return Math.round(n * 100000);
  };

  // 1. Range: "between 20 and 40 lakhs", "20 to 50 lakhs", "20 - 40L"
  const rangeMatch = q.match(/between\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|lac|lakh|cr|crores?|crore|l)?\s*(?:and|to|-)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)/i);
  if (rangeMatch) {
    const unit = rangeMatch[3];
    return {
      minPrice: parseUnit(rangeMatch[1], unit),
      maxPrice: parseUnit(rangeMatch[2], unit)
    };
  }

  // 2. Under/Below/Within/Up to: "under 30 lakhs", "below 50L", "within 35 lakhs", "< 40 lakhs", "budget 30 lakhs"
  const underMatch =
    q.match(/(?:under|below|within|less than|up to|upto|budget(?:\s+of)?(?:\s+is)?|<|maximum|max)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)/i) ||
    q.match(/(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)\s*(?:budget|or less|max|maximum|under|below)/i);

  if (underMatch) {
    return { maxPrice: parseUnit(underMatch[1], underMatch[2]) };
  }

  // 3. Above/More than: "above 50 lakhs", "> 1 cr"
  const aboveMatch = q.match(/(?:above|more than|greater than|>|minimum|min)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)/i);
  if (aboveMatch) {
    return { minPrice: parseUnit(aboveMatch[1], aboveMatch[2]) };
  }

  return null;
}

/**
 * Determines whether the user is actively searching for real estate property listings/projects,
 * rather than asking general educational or OPV services questions.
 */
export function isPropertySearchQuery(query: string): boolean {
  const q = normalizeQuery(query).toLowerCase().trim();

  // Check if query matches any project name in active Supabase properties
  const hasProjectMention = activeProperties.some(p => {
    const t = p.title.toLowerCase();
    const rawProj = p.rawDetails?.projectName?.toLowerCase();
    if (rawProj && rawProj.length > 3 && q.includes(rawProj)) return true;
    if (t && t.length > 5 && q.includes(t.slice(0, 20))) return true;
    return false;
  }) || /\b(project|layout|venture|township|enclave|heights|villas|residency|county|valley|meadows)\b/i.test(q);

  if (hasProjectMention && !q.includes('what is') && !q.includes('how to')) return true;

  // Single-word regulatory queries
  if (q === 'hmda' || q === 'dtcp' || q === 'rera' || q === 'ec' || q === 'mutation' || q === 'loan') {
    return false;
  }

  // Pure informational, legal, process, regulatory or service questions must NEVER trigger property cards
  const isPureInformational =
    q.includes('what is') ||
    q.includes('what are') ||
    q.includes('means') ||
    q.includes('who is') ||
    q.includes('who are') ||
    q.includes('service') ||
    q.includes('services') ||
    q.includes('mission') ||
    q.includes('vision') ||
    q.includes('about opv') ||
    q.includes('what hmda') ||
    q.includes('what dtcp') ||
    q.includes('what rera') ||
    q.includes('what ec') ||
    q.includes('what mutation') ||
    q.includes('process') ||
    q.includes('guidance') ||
    q.includes('guide') ||
    q.includes('checklist') ||
    q.includes('how to buy') ||
    q.includes('how to sell') ||
    q.includes('how to rent') ||
    q.includes('home loan') ||
    q.includes('vastu') ||
    q.includes('bhoomi pooja') ||
    q.includes('gruhapravesam') ||
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('address') ||
    q.includes('headquarters') ||
    q.includes('office') ||
    q.includes('registration') ||
    q.includes('stamp duty') ||
    q.includes('verification') ||
    q.includes('verify') ||
    q.includes('encumbrance') ||
    q.includes('mutation');

  if (isPureInformational) {
    const hasSpecificLocation = [
      'shadnagar', 'mokila', 'kokapet', 'tellapur', 'kothur',
      'lemoor', 'sadashivpet', 'patancheru', 'kadthal', 'gachibowli', 'shamshabad'
    ].some(loc => q.includes(loc));
    const hasSpecificBudget = /\b(under|budget|lakh|cr)\b/i.test(q) || /\b\d+(\.\d+)?\s*(l|cr|lakh|crore)\b/i.test(q);
    const hasSearchAction = /\b(show|find|list|buy plot|buy villa|buy apartment)\b/i.test(q);

    if (hasSpecificLocation && (hasSpecificBudget || hasSearchAction || q.includes('plot') || q.includes('villa'))) {
      // allow through to search
    } else {
      return false;
    }
  }

  // Check for property keywords
  const hasPropertyType =
    q.includes('plot') ||
    q.includes('land') ||
    q.includes('villa') ||
    q.includes('apartment') ||
    q.includes('flat') ||
    q.includes('bhk') ||
    q.includes('house') ||
    q.includes('commercial') ||
    q.includes('farmland');

  const hasSearchIntent =
    q.includes('show') ||
    q.includes('find') ||
    q.includes('search') ||
    q.includes('list') ||
    q.includes('buy') ||
    q.includes('available') ||
    q.includes('budget') ||
    q.includes('under') ||
    q.includes('price');

  const hasLocation = [
    'shadnagar', 'kokapet', 'madhapur', 'kothur', 'mokila',
    'shamshabad', 'sadashivpet', 'kadthal', 'lemoor', 'tellapur',
    'kollur', 'gachibowli', 'kondapur', 'patancheru', 'medchal',
    'adibatla', 'maheshwaram', 'chevella', 'shankarpally', 'kompally', 'hyderabad'
  ].some(loc => q.includes(loc));

  return hasPropertyType || (hasLocation && hasSearchIntent) || (hasLocation && hasPropertyType) || (hasLocation && q.split(' ').length <= 3);
}

/**
 * Core query filtering function applied exclusively against live Supabase data.
 * Strictly checks project name, numeric budget, property type, and locality.
 */
export function filterPropertiesByQuery(source: PropertyItem[], query: string): PropertyItem[] {
  const q = normalizeQuery(query).toLowerCase().trim();

  // 1. Direct Project Name Match from Supabase properties
  const projectMatches = source.filter(p => {
    const t = p.title.toLowerCase();
    const rawProj = p.rawDetails?.projectName?.toLowerCase() || '';
    const projSpec = p.specifications?.find(s => s.label.toLowerCase() === 'project')?.value.toLowerCase() || '';

    if (rawProj && (q.includes(rawProj) || rawProj.includes(q))) return true;
    if (projSpec && (q.includes(projSpec) || projSpec.includes(q))) return true;
    if (t && (q.includes(t) || (t.length > 8 && q.includes(t.slice(0, 20))))) return true;
    return false;
  });

  if (projectMatches.length > 0) {
    return projectMatches.slice(0, 3);
  }

  // 2. Approvals intent
  const wantsHmda = /\bhmda\b/i.test(q);
  const wantsDtcp = /\bdtcp\b/i.test(q);
  const wantsRera = /\brera\b/i.test(q);
  const wantsGhmc = /\bghmc\b/i.test(q);
  const wantsAnyApproval = wantsHmda || wantsDtcp || wantsRera || wantsGhmc;

  // 3. Property Type intent
  const wantsFarmland = /\b(farm|farmland|farmlands|farms|agriculture|agri|farmhouse)\b/i.test(q);
  const wantsPlot = /\b(plot|plots|land|lands|open\s*plot|open\s*plots|venture|guntas|sq\.?yd)\b/i.test(q);
  const wantsVilla = /\b(villa|villas|duplex|triplex|house|independent\s*house)\b/i.test(q);
  const wantsApartment = /\b(flat|flats|apartment|apartments|bhk|highrise)\b/i.test(q);
  const wantsCommercial = /\b(commercial|shop|office|retail)\b/i.test(q);

  // 4. Budget limits
  const budget = parseBudgetLimits(q);

  // 5. Locations
  const locations = [
    'shadnagar', 'kokapet', 'madhapur', 'balanagar', 'kothur', 'mokila',
    'shamshabad', 'sadashivpet', 'kadthal', 'lemoor', 'tellapur', 'kollur',
    'gachibowli', 'kondapur', 'patancheru', 'medchal', 'adibatla', 'maheshwaram',
    'tenali', 'chevella', 'shankarpally', 'kompally', 'nizampet', 'bhanur', 'uppal'
  ];
  const matchedLocations = locations.filter(loc => q.includes(loc));

  // 6. Filter candidates strictly
  const candidates = source.filter(p => {
    const titleLower = p.title.toLowerCase();
    const appText = `${p.approval || ''} ${p.badge || ''} ${titleLower} ${p.specifications?.map(s => s.value).join(' ') || ''}`.toLowerCase();

    // Check approvals
    if (wantsHmda && !appText.includes('hmda')) return false;
    if (wantsDtcp && !appText.includes('dtcp')) return false;
    if (wantsRera && !appText.includes('rera') && !p.reraNumber) return false;
    if (wantsGhmc && !appText.includes('ghmc')) return false;

    // Check types
    const isFarm = p.type === 'farmland' || titleLower.includes('farm') || titleLower.includes('agricultural');
    const isPlot = p.type === 'plot' || titleLower.includes('villa plot') || titleLower.includes('villas plot') || titleLower.includes('plot for sale');
    const isVilla = !isFarm && !titleLower.includes('villa plot') && !titleLower.includes('villas plot') && (p.type === 'villa' || /\bvillas?\b/i.test(titleLower) || /\bhouse\b/i.test(titleLower));
    const isApt = p.type === 'apartment' || titleLower.includes('flat for') || titleLower.includes('flats for') || titleLower.includes('apartments & flats') || (titleLower.includes('flat') && !titleLower.includes('villa')) || (titleLower.includes('apartment') && !titleLower.includes('villa'));
    const isComm = p.type === 'commercial' || titleLower.includes('commercial');

    if (wantsFarmland) {
      if (!isFarm) return false;
    } else if (wantsVilla && !wantsPlot) {
      if (isFarm || isPlot || !isVilla) return false;
    } else if (wantsVilla && wantsPlot) {
      if (!titleLower.includes('villa plot') && !(isPlot && titleLower.includes('villa'))) return false;
    } else if (wantsPlot && !wantsVilla) {
      if (!isPlot || isFarm) return false;
    } else if (wantsApartment) {
      if (!isApt) return false;
    } else if (wantsCommercial) {
      if (!isComm) return false;
    } else if (wantsAnyApproval && isFarm) {
      return false;
    }

    // Check location
    if (matchedLocations.length > 0) {
      const pLoc = p.location.toLowerCase();
      const match = matchedLocations.some(l => pLoc.includes(l) || titleLower.includes(l));
      if (!match) return false;
    }

    // Check numeric budget strictly (never return properties that violate user budget)
    if (budget) {
      const pPrice = p.priceNumeric || 0;
      if (budget.maxPrice && pPrice > budget.maxPrice) return false;
      if (budget.minPrice && pPrice < budget.minPrice) return false;
    }

    return true;
  });

  if (candidates.length > 0) {
    return candidates.slice(0, 4);
  }

  return [];
}

/**
 * Searches properties exclusively from Supabase live inventory (activeProperties).
 * If no matching properties exist in Supabase, returns an empty array.
 */
export function getPropertiesForQuery(query: string): PropertyItem[] {
  if (!isPropertySearchQuery(query)) {
    return [];
  }

  if (activeProperties.length > 0) {
    return filterPropertiesByQuery(activeProperties, query);
  }

  return [];
}

/**
 * Dedicated Live Supabase Property Search
 */
export function searchLiveProperties(query: string): PropertyItem[] {
  if (activeProperties.length > 0) {
    return filterPropertiesByQuery(activeProperties, query);
  }
  return [];
}

export function findPropertyById(id: string): PropertyItem | undefined {
  return activeProperties.find(p => p.id === id);
}

export function findPropertyByTitle(title: string): PropertyItem | undefined {
  const cleanTitle = title.toLowerCase().trim();
  const isMatch = (p: PropertyItem) => {
    if (p.title.toLowerCase().includes(cleanTitle)) return true;
    if (cleanTitle.length > 5 && cleanTitle.includes(p.title.toLowerCase().slice(0, 20))) return true;
    const projectSpec = p.specifications?.find(s => s.label.toLowerCase() === 'project');
    if (projectSpec && projectSpec.value.toLowerCase().includes(cleanTitle)) return true;
    if (p.rawDetails?.projectName && p.rawDetails.projectName.toLowerCase().includes(cleanTitle)) return true;
    if (p.about && p.about.toLowerCase().includes(cleanTitle)) return true;
    return false;
  };

  return activeProperties.find(isMatch);
}
