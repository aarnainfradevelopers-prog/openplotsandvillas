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
 * Friendly conversational confirmation text for property searches
 */
function buildPropertySearchIntro(query: string, properties: PropertyItem[]): string {
  const q = normalizeQuery(query).toLowerCase();

  const locations = [
    'shadnagar', 'kokapet', 'tellapur', 'mokila', 'lemoor',
    'kothur', 'sadashivpet', 'patancheru', 'medchal', 'gachibowli',
    'shamshabad', 'kollur', 'kadthal', 'maheshwaram', 'chevella',
    'shankarpally', 'adibatla', 'kondapur', 'madhapur', 'kompally', 'hyderabad'
  ];
  const matchedLoc = locations.find(loc => q.includes(loc));
  const locTitle = matchedLoc
    ? matchedLoc.charAt(0).toUpperCase() + matchedLoc.slice(1)
    : '';

  let budgetText = '';
  const lakhMatch = q.match(/(?:under|below|budget|within)?\s*₹?\s*(\d+)\s*(?:lakh|lakhs|l)\b/i);
  const crMatch = q.match(/(?:under|below|budget|within)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)\b/i);
  if (lakhMatch) {
    budgetText = ` under ₹${lakhMatch[1]} Lakhs`;
  } else if (crMatch) {
    budgetText = ` under ₹${crMatch[1]} Cr`;
  }

  if (q.includes('plot') || q.includes('land') || q.includes('openplot')) {
    if (locTitle) return `Sure! Here are available open plots in ${locTitle}${budgetText} from our database:`;
    return `Sure! Here are available open plots in Hyderabad${budgetText} from our database:`;
  }

  if (q.includes('villa') || q.includes('house') || q.includes('triplex') || q.includes('duplex')) {
    if (locTitle) return `Sure! Here are available luxury villas in ${locTitle}${budgetText} from our database:`;
    return `Sure! Here are available luxury villas in Hyderabad${budgetText} from our database:`;
  }

  if (q.includes('apartment') || q.includes('flat') || q.includes('bhk')) {
    if (locTitle) return `Sure! Here are available apartments in ${locTitle}${budgetText} from our database:`;
    return `Sure! Here are available apartments in Hyderabad${budgetText} from our database:`;
  }

  if (locTitle) {
    return `Sure! Here are available properties in ${locTitle}${budgetText} from our database:`;
  }

  return `Sure! Here are available verified properties matching your query from our database:`;
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
  // Search Supabase live data for matching listings
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
  if (intent === 'PROPERTY_SEARCH' || intent === 'PROJECT_INFORMATION') {
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

