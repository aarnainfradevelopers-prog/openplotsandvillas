/**
 * Dynamic Website Retriever for openplotsandvillas.com
 *
 * Responsibilities:
 * - Identify the specific OPV website page needed for a user query
 * - Dynamically fetch that page on-the-fly (NO crawling the entire site)
 * - Extract clean text, structured JSON-LD/schema, and real image URLs
 * - Handle failures gracefully and avoid irrelevant content
 */

export interface RetrievedPageContent {
  url: string;
  title: string;
  text: string;
  images: string[];
  metadata?: Record<string, any>;
  found: boolean;
}

const BASE_URL = 'https://openplotsandvillas.com';

// Cache retrieved pages for 10 minutes to avoid redundant live HTTP requests
const pageCache = new Map<string, { data: RetrievedPageContent; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Maps query keywords to relevant pages on openplotsandvillas.com
 */
function resolveWebsiteUrl(query: string): string | null {
  const q = query.toLowerCase().trim();

  // 1. Guides & Knowledge
  if (/\b(rera|hmda|dtcp|ghmc|municipality|gram panchayat|panchayat|legal faq|stamp duty|ec\b|encumbrance|mutation|registration|patta|passbook|dharani|lrs|brs|building permission|layout approval|carpet area|built up area|super built up area|guidance value|market value|sale deed|agreement of sale)\b/i.test(q)) {
    return `${BASE_URL}/guide/legal-faq`;
  }
  if (/\b(how to buy|buying guide|buyer guide|buying process|steps to purchase)\b/i.test(q)) {
    return `${BASE_URL}/guide/buying-guide`;
  }
  if (/\b(how to sell|selling guide|seller guide|post property|list property)\b/i.test(q)) {
    return `${BASE_URL}/guide/selling-guide`;
  }
  if (/\b(investment strategy|where to invest|best areas to invest|growth corridors|appreciation)\b/i.test(q)) {
    return `${BASE_URL}/guide/investment-strategy`;
  }
  if (/\b(hyderabad overview|localities in hyderabad|west hyderabad|east hyderabad|shadnagar overview)\b/i.test(q)) {
    return `${BASE_URL}/guide/hyderabad-overview`;
  }
  if (/\b(real estate news|market updates|property news)\b/i.test(q)) {
    return `${BASE_URL}/guide/real-estate-news`;
  }
  if (/\b(guide|guides|blog|articles)\b/i.test(q)) {
    return `${BASE_URL}/guide`;
  }

  // 2. Services
  if (/\b(home loan|housing loan|bank loan|interest rate|loan assistance|sbi loan|hdfc loan)\b/i.test(q)) {
    return `${BASE_URL}/services/home-loan`;
  }
  if (/\b(legal services|legal verification|advocate check|title clearance|due diligence)\b/i.test(q)) {
    return `${BASE_URL}/services/legal-services`;
  }
  if (/\b(construction|civil construction|building house|turnkey construction|contractor)\b/i.test(q)) {
    return `${BASE_URL}/services/construction-civil`;
  }
  if (/\b(interior|interior design|smart home|home automation|furniture|decoration)\b/i.test(q)) {
    return `${BASE_URL}/services/interior-smart-home`;
  }
  if (/\b(architectural design|floor plan|elevation|architect|blueprint)\b/i.test(q)) {
    return `${BASE_URL}/services/architectural-design`;
  }
  if (/\b(vastu|vaastu|spiritual|bhoomi pooja|gruhapravesam|muhurtham|pooja services)\b/i.test(q)) {
    return `${BASE_URL}/services/vastu-spiritual`;
  }
  if (/\b(services|service provide|what services|elite services)\b/i.test(q)) {
    return `${BASE_URL}/services`;
  }

  // 3. Company & Contact
  if (/\b(about opv|who is opv|what is opv|about company|founder|ceo|mission|vision|why choose opv)\b/i.test(q)) {
    return `${BASE_URL}/about`;
  }
  if (/\b(contact|phone number|call opv|office address|headquarters|support email|helpline|whatsapp number)\b/i.test(q)) {
    return `${BASE_URL}/contact`;
  }

  // 4. Developers
  if (/\baparna\b/i.test(q)) return `${BASE_URL}/developers/aparna-constructions/`;
  if (/\bramky\b/i.test(q)) return `${BASE_URL}/developers/ramky-group/`;
  if (/\bmy home\b/i.test(q)) return `${BASE_URL}/developers/my-home-group/`;

  // 5. Property Categories
  if (/\b(plots|open plots|land)\b/i.test(q)) return `${BASE_URL}/properties/plots-for-sale-in-hyderabad/`;
  if (/\b(villa|villas|house|houses)\b/i.test(q)) return `${BASE_URL}/properties/houses-for-sale-in-hyderabad/`;
  if (/\b(apartment|apartments|flat|flats)\b/i.test(q)) return `${BASE_URL}/properties/flats-for-sale-in-hyderabad/`;
  if (/\b(farmland|agriculture land|agri land)\b/i.test(q)) return `${BASE_URL}/properties/agriculture-lands-for-sale-in-hyderabad/`;
  if (/\b(commercial|retail|office space)\b/i.test(q)) return `${BASE_URL}/properties/commercial-properties-for-sale-in-hyderabad/`;

  // Fallback to homepage
  return BASE_URL;
}

/**
 * Extracts clean, human-readable text and images from live HTML
 */
function parseHtmlContent(html: string, url: string): { title: string; text: string; images: string[] } {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Open Plots & Villas';

  // Extract JSON-LD if present (often has clean descriptions)
  let jsonLdText = '';
  const ldMatches = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis)];
  for (const m of ldMatches) {
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed.description) jsonLdText += ` ${parsed.description}`;
      if (parsed.name) jsonLdText += ` ${parsed.name}`;
      if (parsed['@graph']) {
        for (const item of parsed['@graph']) {
          if (item.description) jsonLdText += ` ${item.description}`;
          if (item.text) jsonLdText += ` ${item.text}`;
        }
      }
    } catch (e) {
      // Ignore invalid JSON-LD
    }
  }

  // Extract clean text from body
  let cleanBody = html
    .replace(/<script[^>]*>.*?<\/script>/gis, ' ')
    .replace(/<style[^>]*>.*?<\/style>/gis, ' ')
    .replace(/<noscript[^>]*>.*?<\/noscript>/gis, ' ')
    .replace(/<svg[^>]*>.*?<\/svg>/gis, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  // Remove physical street address to adhere to privacy guidelines
  cleanBody = cleanBody.replace(/(#101,?\s*Road No:?\s*10|Jaya Kesav Avenue|Kakatiya Hills|500081)/gi, '');
  jsonLdText = jsonLdText.replace(/(#101,?\s*Road No:?\s*10|Jaya Kesav Avenue|Kakatiya Hills|500081)/gi, '');

  // Combine title, JSON-LD context, and clean text
  const combinedText = [
    `Page Title: ${title}`,
    jsonLdText ? `Page Summary: ${jsonLdText.trim()}` : '',
    `Content: ${cleanBody.slice(0, 3500)}` // Cap at 3500 chars to fit context efficiently
  ].filter(Boolean).join('\n\n');

  // Extract real image URLs from HTML
  const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gis)].map(m => m[1]);
  const images = [...new Set(imgMatches)]
    .filter(src => {
      if (src.includes('avatar') || src.includes('icon') || src.includes('logo') || src.endsWith('.svg')) return false;
      return src.startsWith('http://') || src.startsWith('https://');
    })
    .slice(0, 6);

  return { title, text: combinedText, images };
}

/**
 * Dynamically retrieves the relevant OPV website page for a given query
 */
export async function retrieveWebsiteContent(query: string): Promise<RetrievedPageContent> {
  const url = resolveWebsiteUrl(query);
  if (!url) {
    return {
      url: BASE_URL,
      title: 'Open Plots & Villas',
      text: 'No specific website page could be matched.',
      images: [],
      found: false
    };
  }

  // Check cache
  const cached = pageCache.get(url);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`Failed to retrieve ${url}: HTTP ${res.status}`);
      return {
        url,
        title: 'Open Plots & Villas',
        text: `Page could not be retrieved (HTTP ${res.status}).`,
        images: [],
        found: false
      };
    }

    const html = await res.text();
    const parsed = parseHtmlContent(html, url);

    const result: RetrievedPageContent = {
      url,
      title: parsed.title,
      text: parsed.text,
      images: parsed.images,
      found: true
    };

    pageCache.set(url, { data: result, timestamp: Date.now() });
    return result;
  } catch (error: any) {
    console.warn(`Website retrieval error for ${url}:`, error?.message || error);
    return {
      url,
      title: 'Open Plots & Villas',
      text: `Live page retrieval error: ${error?.message || 'Network timeout'}`,
      images: [],
      found: false
    };
  }
}
