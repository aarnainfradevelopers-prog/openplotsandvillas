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
  intent: 'PROPERTY_SEARCH' | 'WEBSITE_QUERY' | 'GENERAL_CONVERSATION';
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

  // Intent classification
  const isSearch =
    approvals.length > 0 ||
    propertyTypes.length > 0 ||
    locations.length > 0 ||
    budget_max !== null ||
    bhk !== null ||
    /\b(buy|property|properties|cost|price|show|find|list|available)\b/i.test(q);

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
   - "PROPERTY_SEARCH": looking for real estate, plots, flats, villas, farm lands, specific projects, approvals (HMDA/DTCP/RERA), locations, budgets.
   - "WEBSITE_QUERY": questions about OPV company, services, FAQs, mission, founders, office location, contact.
   - "GENERAL_CONVERSATION": greeting ("hi", "hello"), chit-chat, thanks.
2. "approval":
   - Array of strings from: ["HMDA", "DTCP", "RERA", "GHMC", "GRAM_PANCHAYAT"].
   - Include ONLY if explicitly mentioned or requested (e.g. "hmda approved" -> ["HMDA"], "dtcp" -> ["DTCP"]).
3. "property_type":
   - Array of strings from: ["APARTMENT", "VILLA", "PLOT", "FARM_LAND", "FARM_HOUSE", "COMMERCIAL"].
   - "APARTMENT": for apartments, flats, residential flats, high-rise.
   - "VILLA": for villas, independent houses, duplex, triplex.
   - "PLOT": for plots, open plots, residential plots, ventures, layouts, plotted developments, villa plots.
   - "FARM_LAND": for farm land, farmland, agricultural land.
   - "FARM_HOUSE": for farm house, farmhouse.
   - "COMMERCIAL": for commercial, shop, shops, office, offices.
   - CRITICAL RULE: NEVER classify as "APARTMENT" simply because the user mentions "3 BHK" unless flat/apartment was specifically mentioned. A 3 BHK could be a villa or house.
4. "location":
   - Array of location names in title case (e.g. ["Hyderabad"], ["Shadnagar"], ["Kokapet"], ["Kadthal"], ["Sadashivpet"], ["Balanagar"], etc.).
5. "budget_min" and "budget_max":
   - Numbers in Indian Rupees (e.g. "under 50 lakhs" -> budget_max: 5000000; "under 1 crore" -> budget_max: 10000000; "under 75L" -> budget_max: 7500000).
6. "bhk":
   - Integer number if explicitly requested (e.g. 2, 3, 4).

Respond ONLY with valid JSON:
{
  "intent": "PROPERTY_SEARCH" | "WEBSITE_QUERY" | "GENERAL_CONVERSATION",
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
  "target_project": null
}`;

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

        return {
          intent: parsed.intent || fallback.intent,
          approval: normalizedApprovals.length > 0 ? normalizedApprovals : fallback.approval,
          property_type: normalizedTypes.length > 0 ? normalizedTypes : fallback.property_type,
          location: Array.isArray(parsed.location) && parsed.location.length > 0 ? parsed.location : fallback.location,
          budget_min: typeof parsed.budget_min === 'number' ? parsed.budget_min : fallback.budget_min,
          budget_max: typeof parsed.budget_max === 'number' ? parsed.budget_max : fallback.budget_max,
          bhk: typeof parsed.bhk === 'number' ? parsed.bhk : fallback.bhk,
          size_min: parsed.size_min || null,
          size_max: parsed.size_max || null,
          facing: Array.isArray(parsed.facing) ? parsed.facing : [],
          amenities: Array.isArray(parsed.amenities) ? parsed.amenities : [],
          target_project: parsed.target_project || null
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

GROUNDING RULES (STRICT & ABSOLUTE):
1. You must base your answer STRICTLY on the Grounding Data provided below.
2. Official Information Integrity:
   - RERA numbers, HMDA numbers, DTCP numbers, LP numbers, prices, plot sizes, amenities, approvals, and locations MUST come directly from the Grounding Data.
   - NEVER invent, guess, or fabricate any RERA number or official approval. If the Grounding Data does not state the RERA number or requested detail, clearly state: "The official RERA/approval details for this are not listed in our verified records right now. Please connect directly with an OPV advisor."
   - NEVER invent fake image URLs or fake properties.
3. Zero-Result Explanations:
   - If the Grounding Data indicates ZERO_RESULTS, explain honestly that there are currently no verified active listings matching the user's exact specifications in the OPV database.
   - State the specific reason (for example, if DTCP-approved apartments were requested, clarify that DTCP approvals typically apply to plotted layouts and villas, whereas apartments generally fall under HMDA, RERA, or GHMC purview in Hyderabad).
   - Inform the user that OPV property advisors have extensive access to offline and upcoming inventory across Hyderabad, and invite them to connect via phone or WhatsApp.
4. Response Depth & Structure:
   - When properties are returned in Grounding Data, provide clean bullet points with Title, Location, Approvals, RERA (if present), Size, Price, and Key Amenities.
   - Direct questions: Give a clear, direct, concise answer.
5. Follow-up Context:
   - Refer to previous context when user asks follow-up questions ("What is its RERA number?", "What is the price?").
6. Language & Tone:
   - Professional, warm, transparent.
   - If user asks in Telugu/Tanglish, respond in matching friendly Telugu/Tanglish. Otherwise respond in fluent English.

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
