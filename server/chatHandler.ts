import { createClient } from '@supabase/supabase-js';
import { retrieveWebsiteContent } from './websiteRetriever.ts';
import {
  generateGeminiResponse,
  extractSearchFiltersWithGemini,
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
  id: number;
  title: string;
  normalizedType: PropertyCategory;
  normalizedApprovals: ApprovalType[];
  location: string;
  city: string;
  fullLocation: string;
  priceNumeric: number;
  priceDisplay: string;
  size: string;
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
    } catch {}
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
  if (rawType.includes('farmhouse') || titleLower.includes('farmhouse') || titleLower.includes('farm house')) {
    normalizedType = 'FARM_HOUSE';
  } else if (rawType.includes('farm') || rawType.includes('agri') || descType.includes('agri') || titleLower.includes('farm land') || titleLower.includes('agricultural')) {
    normalizedType = 'FARM_LAND';
  } else if (rawType.includes('commercial') || titleLower.includes('commercial')) {
    normalizedType = 'COMMERCIAL';
  } else if (titleLower.includes('villa plot') || titleLower.includes('villas plot') || rawType === 'plot' || descType.includes('plot') || titleLower.includes('plot for sale') || titleLower.includes('residential land & plot')) {
    normalizedType = 'PLOT';
  } else if (rawType.includes('flat') || rawType.includes('apartment') || descType.includes('flat') || descType.includes('apartment') || titleLower.includes('flat for') || titleLower.includes('flats for') || titleLower.includes('apartments & flats')) {
    normalizedType = 'APARTMENT';
  } else if (rawType.includes('villa') || descType.includes('villa') || (/\bvillas?\b/i.test(titleLower) && !titleLower.includes('plot')) || /\bhouse\b/i.test(titleLower)) {
    normalizedType = 'VILLA';
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
  const amenities = p.amenities && p.amenities.length > 0 ? p.amenities : (parsedDesc.amenities || []);
  const size = p.area || p.plot_size || parsedDesc.sizeInput || parsedDesc.plotSize || null;
  const sizeUnit = p.plot_size_unit || parsedDesc.sizeUnit || parsedDesc.plotSizeUnit || 'Sq. Yd.';

  const propBhk = parseInt(p.bhk || parsedDesc.bedrooms || '0', 10);

  return {
    id: p.id,
    title: p.title,
    normalizedType,
    normalizedApprovals: Array.from(approvalsSet),
    location: p.location || 'Hyderabad',
    city: p.city || 'Hyderabad',
    fullLocation: `${p.location || ''} ${p.city || ''} ${p.title || ''}`.toLowerCase(),
    priceNumeric: priceNum,
    priceDisplay: p.quotedprice ? `₹${p.quotedprice}/sq.yd` : (p.price ? `₹${p.price}` : 'Price on Request'),
    size: size ? `${size} ${sizeUnit}` : 'Various Sizes',
    bhk: propBhk > 0 ? propBhk : null,
    bedrooms: propBhk > 0 ? propBhk : null,
    bathrooms: p.bathrooms || parsedDesc.bathrooms || null,
    imageUrl: (p.images && p.images[0] && !p.images[0].startsWith('file://')) ? p.images[0] : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    images: (p.images || []).filter((img: string) => !img.startsWith('file://')),
    isFeatured: Boolean(p.is_featured),
    status: p.status || 'available',
    reraNumber: rera,
    lpNumber: lp,
    amenities: amenities.slice(0, 10),
    projectName: parsedDesc.projectName || ''
  };
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

  // 1. Identify previous project context if follow-up question
  const contextProject = extractContextProject(history);

  // 2. Extract structured search intent and filters using Gemini AI
  const filters: StructuredPropertySearchFilter = await extractSearchFiltersWithGemini(rawQuery, geminiApiKey);
  if (contextProject && !filters.target_project) {
    filters.target_project = contextProject;
  }

  // 3. Classify if query is a Property Search or Website/Company Query
  const isPropertyOrProjectQuery =
    filters.intent === 'PROPERTY_SEARCH' ||
    Boolean(filters.target_project) ||
    filters.approval.length > 0 ||
    filters.property_type.length > 0 ||
    filters.location.length > 0 ||
    filters.budget_max !== null ||
    filters.budget_min !== null ||
    filters.bhk !== null;

  let groundingData = '';
  let groundingSourceType: 'supabase_property' | 'opv_website' | 'general' = 'general';
  let matchedProperties: any[] = [];

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
        matchedProperties = filtered.slice(0, 6);

        // Formulate strict grounding string with verified details
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
2. Provide a helpful real-estate explanation where relevant (for instance, DTCP approvals typically apply to plotted layouts rather than apartments, which generally fall under HMDA, RERA, or GHMC purview).
3. Do NOT invent, fabricate, or substitute alternative properties.
4. Inform the user that OPV property advisors have direct access to exclusive offline and upcoming inventories across Hyderabad.
5. Offer to connect with an OPV advisor via phone or WhatsApp.`;
      }
    } catch (dbErr: any) {
      console.warn('Supabase property query error:', dbErr?.message || dbErr);
    }
  }

  // =========================================================================
  // PATH B: WEBSITE QUESTION → DYNAMIC RETRIEVAL FROM openplotsandvillas.com
  // =========================================================================
  if (!groundingData) {
    groundingSourceType = 'opv_website';
    const retrieved = await retrieveWebsiteContent(rawQuery);

    if (retrieved.found && retrieved.text) {
      groundingData = `
Source URL: ${retrieved.url}
Page Title: ${retrieved.title}
Retrieved Page Text:
${retrieved.text}
`;
    }
  }

  // =========================================================================
  // AI REASONING & RESPONSE GENERATION (GEMINI AI ENGINE)
  // =========================================================================
  let finalAnswer = '';

  if (geminiApiKey) {
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
      finalAnswer = `Here are the verified listings matching your request from our database:`;
    } else {
      finalAnswer = `I don't have that specific information in our active records right now. Please connect directly with an OPV advisor who can assist you.`;
    }
  }

  const primaryProj = matchedProperties[0];
  const customWa = primaryProj
    ? `Hello OPV, I am inquiring about ${primaryProj.title}`
    : `Hello OPV, I have an inquiry: ${rawQuery}`;

  return {
    content: finalAnswer,
    properties: matchedProperties, // ALWAYS an array: [] when 0 matches!
    actions: getStandardActions('9963513939', customWa),
    category: primaryProj ? (primaryProj.normalizedType === 'PLOT' ? 'plots' : 'villas') : 'general',
    sourceType: groundingSourceType
  };
}
