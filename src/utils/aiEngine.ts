import { OPV_COMPANY_PROFILE, OPV_LANGUAGES } from '../data/chatConfig';
import { ActionLink, LanguageCode, PropertyItem } from '../types/chat';
import { searchLiveProperties } from '../data/propertyData';
import { classifyIntent, normalizeQuery } from './intentClassifier';

export interface AIResponse {
  content: string;
  actions?: ActionLink[];
  category?: string;
  properties?: PropertyItem[];
}

/**
 * Standard direct advisor contact action buttons
 */
function getStandardActions(customWhatsAppMsg?: string): ActionLink[] {
  const profile = OPV_COMPANY_PROFILE;
  const cleanPhone = profile.contact.phonePrimary.replace(/\s+/g, '');
  const waMsg = customWhatsAppMsg
    ? encodeURIComponent(customWhatsAppMsg)
    : encodeURIComponent('Hello OPV, I have an inquiry regarding properties');

  return [
    { label: 'Call OPV Desk', url: `tel:${cleanPhone}`, action: 'call' },
    { label: 'Chat on WhatsApp', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=${waMsg}`, action: 'whatsapp' }
  ];
}

/**
 * Generates a short, professional dynamic search summary for property searches
 */
function buildPropertySearchIntro(query: string, properties: PropertyItem[]): string {
  const q = normalizeQuery(query).toLowerCase().trim();

  // 1. Property Type
  let headerType = 'Properties';
  let summaryType = 'Verified Properties';

  if (/\b(farm\s*land|farmland|agricultural|agriculture)\b/i.test(q)) {
    headerType = 'Farm Land';
    summaryType = 'Farm Lands';
  } else if (/\b(farm\s*house|farmhouse)\b/i.test(q)) {
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
  } else if (/\bcommercial\b/i.test(q)) {
    headerType = 'Commercial';
    summaryType = 'Commercial Properties';
  } else if (/\b(flat|flats)\b/i.test(q)) {
    headerType = 'Flat';
    summaryType = 'Flats';
  } else if (/\b(apartment|apartments|high\s*rise)\b/i.test(q)) {
    headerType = 'Apartment';
    summaryType = 'Apartments';
  } else if (/\b(duplex|triplex)\b/i.test(q)) {
    headerType = 'Duplex Villa';
    summaryType = 'Duplex Villas';
  } else if (/\b(independent\s*house|house|houses)\b/i.test(q)) {
    headerType = 'Independent House';
    summaryType = 'Independent Houses';
  } else if (/\b(villa|villas)\b/i.test(q)) {
    headerType = 'Villa';
    summaryType = 'Villas';
  } else if (/\b(open\s*plot|open\s*plots|plot|plots|venture|layouts|plotted)\b/i.test(q)) {
    headerType = 'Open Plot';
    summaryType = 'Open Plots';
  }

  // 2. Location
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
    const locations = [
      'shadnagar', 'kokapet', 'tellapur', 'mokila', 'lemoor',
      'kothur', 'sadashivpet', 'patancheru', 'medchal', 'gachibowli',
      'shamshabad', 'kollur', 'kadthal', 'maheshwaram', 'chevella',
      'shankarpally', 'adibatla', 'kondapur', 'madhapur', 'kompally', 'hyderabad', 'hyd'
    ];
    const matchedLoc = locations.find(loc => new RegExp(`\\b${loc}\\b`, 'i').test(q));
    if (matchedLoc) {
      const finalLoc = matchedLoc.toLowerCase() === 'hyd' ? 'Hyderabad' : matchedLoc.charAt(0).toUpperCase() + matchedLoc.slice(1);
      locationDisplay = finalLoc;
      titleLocationPhrase = `in ${finalLoc}`;
    } else if (properties.length > 0 && properties[0].location) {
      locationDisplay = properties[0].location;
      titleLocationPhrase = `in ${properties[0].location}`;
    }
  }

  // 3. Approval
  let approvalLine = '';
  const approvals: string[] = [];
  if (/\bhmda\b/i.test(q)) approvals.push('HMDA');
  if (/\bdtcp\b/i.test(q)) approvals.push('DTCP');
  if (/\brera\b/i.test(q)) approvals.push('RERA');
  if (/\bghmc\b/i.test(q)) approvals.push('GHMC');
  if (/\b(gram\s*panchayat|panchayat)\b/i.test(q)) approvals.push('Gram Panchayat');
  if (approvals.length > 0) {
    approvalLine = `**Approval:** ${[...new Set(approvals)].join(', ')}`;
  }

  // 4. Budget
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
  }

  // 5. BHK
  let bhkLine = '';
  const bhkMatch = q.match(/\b([1-9])\s*(?:bhk|bedroom|bed)\b/i);
  if (bhkMatch) {
    bhkLine = `**BHK:** ${bhkMatch[1]} BHK`;
  }

  // 6. Facing
  let facingLine = '';
  const facingMatch = q.match(/\b(east|west|north|south|north-east|north-west|south-east|south-west)\s*facing\b/i);
  if (facingMatch) {
    const f = facingMatch[1].charAt(0).toUpperCase() + facingMatch[1].slice(1).toLowerCase();
    facingLine = `**Facing:** ${f} Facing`;
  }

  // 7. Results Block
  const searchResultsLines: string[] = [
    `**Property Type:** ${summaryType}`,
    `**Location:** ${locationDisplay}`
  ];

  if (approvalLine) searchResultsLines.push(approvalLine);
  if (budgetLine) searchResultsLines.push(budgetLine);
  if (bhkLine) searchResultsLines.push(bhkLine);
  if (facingLine) searchResultsLines.push(facingLine);

  searchResultsLines.push(`**Projects Found:** ${properties.length}`);

  const mainTitle = headerType === 'Properties'
    ? `**🏡 Properties ${titleLocationPhrase}**`
    : `**🏡 ${headerType} Properties ${titleLocationPhrase}**`;

  return `${mainTitle}

✨ **Here's What I Found**

${searchResultsLines.join('\n')}

Here are the available verified properties matching your search. You can view location, approvals, plot sizes, pricing and amenities in the property cards below.`.trim();
}

/**
 * Main OPV AI Chat Query Processor
 *
 * Supabase-Exclusive Architecture:
 * - Supabase is the EXCLUSIVE source of property and project data.
 * - Absolutely NO built-in website answers, static website knowledge, or website training.
 * - Out-of-database queries or services are directed to an OPV advisor.
 */
export function processChatQuery(
  rawQuery: string,
  language: LanguageCode = 'en'
): AIResponse {
  const classified = classifyIntent(rawQuery);
  const { intent, normalizedQuery } = classified;

  // 1. GREETING & CONVERSATION
  if (intent === 'GREETING') {
    const isThanks = /\b(thank you|thanks|dhanyavadalu|dhanyavadamulu|bye|goodbye)\b/i.test(normalizedQuery);
    if (isThanks) {
      return {
        content: `You're welcome! Feel free to ask whenever you want to explore verified properties in our database. Have a great day!`,
        actions: getStandardActions('Hello OPV, I have a property query'),
        category: 'greeting',
        properties: []
      };
    }

    const langObj = OPV_LANGUAGES.find(l => l.code === language) || OPV_LANGUAGES[0];
    return {
      content: `### ${langObj.welcomeGreeting}
${langObj.welcomeSubtitle}

Tell me what type of property, location, or budget you are searching for.`,
      actions: getStandardActions('Hello OPV, I would like to explore properties in Hyderabad'),
      category: 'greeting',
      properties: []
    };
  }

  // 2. COMPETITOR & OUT OF SCOPE
  if (intent === 'COMPETITOR') {
    return {
      content: `Sorry, I can assist only with verified properties and projects listed directly in our OPV database.`,
      actions: getStandardActions('Hello OPV, I want to explore verified properties on OPV'),
      category: 'general',
      properties: []
    };
  }

  if (intent === 'OUT_OF_SCOPE') {
    return {
      content: `Sorry, I can assist only with real estate property and project searches from our database.`,
      actions: getStandardActions('Hello OPV, I need property guidance'),
      category: 'general',
      properties: []
    };
  }

  // 3. PROPERTY & PROJECT SEARCH (SUPABASE IS THE ONLY SOURCE)
  if (intent === 'PROPERTY_SEARCH' || intent === 'PROJECT_INFORMATION') {
    const liveMatches = searchLiveProperties(rawQuery);
    if (liveMatches.length > 0) {
      if (intent === 'PROJECT_INFORMATION') {
        const proj = liveMatches[0];
        return {
          content: `Here is the latest project information for **${proj.title}** from our database:`,
          properties: liveMatches,
          actions: getStandardActions(`Hello OPV, I am inquiring about ${proj.title}`),
          category: proj.type === 'plot' ? 'plots' : 'villas'
        };
      }

      const intro = buildPropertySearchIntro(rawQuery, liveMatches);
      return {
        content: intro,
        properties: liveMatches,
        actions: getStandardActions('Hello OPV, I am interested in these property listings'),
        category: liveMatches[0].type === 'plot' ? 'plots' : 'villas'
      };
    }

    // 4. IF PROPERTY SEARCH / PROJECT QUERY HAS NO MATCHES IN SUPABASE
    return {
      content: `I don't have that property or project listed in our database right now. I can connect you with an OPV property advisor.`,
      actions: getStandardActions(`Hello OPV, I am looking for properties matching: ${rawQuery}`),
      category: 'general',
      properties: []
    };
  }

  // 5. ALL OTHER QUESTIONS (NO IN-BUILT WEBSITE ANSWERS — DIRECT TO ADVISOR)
  return {
    content: `I don't have that information in our property database. I can connect you with an OPV advisor.`,
    actions: getStandardActions(`Hello OPV, I have an inquiry: ${rawQuery}`),
    category: 'general',
    properties: []
  };
}

/**
 * Asynchronous Chat Query Processor with Groq AI + Live Dynamic Website Retrieval
 *
 * Flow:
 * - Sends query & conversation history to secure server endpoint /api/chat
 * - For property queries: Uses Supabase live property data
 * - For website queries: Dynamically retrieves relevant live page on openplotsandvillas.com
 * - Groq AI generates the final grounded, natural-language response
 * - Falls back to local processChatQuery if server endpoint is unreachable
 */
export async function processChatQueryAsync(
  rawQuery: string,
  language: LanguageCode = 'en',
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AIResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: rawQuery,
        language,
        history
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return {
          content: data.content,
          properties: data.properties,
          actions: data.actions || getStandardActions(`Hello OPV, I have an inquiry: ${rawQuery}`),
          category: data.category || 'general'
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/chat unreachable, falling back to local database search:', err);
  }

  // Graceful fallback to local Supabase search
  return processChatQuery(rawQuery, language);
}

