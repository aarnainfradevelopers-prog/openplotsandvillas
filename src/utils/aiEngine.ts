import { OPV_COMPANY_PROFILE, OPV_LANGUAGES } from '../data/opvKnowledge';
import { ActionLink, LanguageCode, PropertyItem } from '../types/chat';
import {
  searchLiveProperties,
  searchFallbackProperties,
  findPropertyByTitle
} from '../data/propertyData';
import { classifyIntent, IntentType, normalizeQuery } from './intentClassifier';

export interface AIResponse {
  content: string;
  actions?: ActionLink[];
  category?: string;
  properties?: PropertyItem[];
}

/**
 * Standard OPV action buttons
 */
function getStandardActions(customWhatsAppMsg?: string): ActionLink[] {
  const profile = OPV_COMPANY_PROFILE;
  const cleanPhone = profile.contact.phonePrimary.replace(/\s+/g, '');
  const waMsg = customWhatsAppMsg
    ? encodeURIComponent(customWhatsAppMsg)
    : encodeURIComponent('Hello OPV, I have an inquiry regarding properties');

  return [
    { label: '📞 Call OPV Desk', url: `tel:${cleanPhone}`, action: 'call' },
    { label: '💬 Chat on WhatsApp', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=${waMsg}`, action: 'whatsapp' },
    { label: '🌐 Open Website', url: profile.website, action: 'contact' }
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
    if (locTitle) {
      return `Sure! I found these available open plots near ${locTitle}${budgetText}.`;
    }
    return `Sure! I found these available open plots in Hyderabad${budgetText}.`;
  }

  if (q.includes('villa') || q.includes('house') || q.includes('triplex') || q.includes('duplex')) {
    if (locTitle) {
      return `Sure! I found these available luxury villas in ${locTitle}${budgetText}.`;
    }
    return `Sure! I found these available luxury villas in Hyderabad${budgetText}.`;
  }

  if (q.includes('apartment') || q.includes('flat') || q.includes('bhk')) {
    if (locTitle) {
      return `Sure! I found these available apartments in ${locTitle}${budgetText}.`;
    }
    return `Sure! I found these available apartments in Hyderabad${budgetText}.`;
  }

  if (q.includes('farm') || q.includes('agriculture')) {
    if (locTitle) {
      return `Sure! I found these available agricultural and farm lands near ${locTitle}${budgetText}.`;
    }
    return `Sure! I found these available agricultural and farm lands${budgetText}.`;
  }

  if (q.includes('commercial') || q.includes('shop') || q.includes('office')) {
    if (locTitle) {
      return `Sure! I found these available commercial properties in ${locTitle}${budgetText}.`;
    }
    return `Sure! I found these available commercial properties${budgetText}.`;
  }

  if (locTitle) {
    return `Sure! I found these available properties near ${locTitle}${budgetText}.`;
  }

  return `Sure! I found these available verified properties matching your request.`;
}

/**
 * Main OPV AI Chat Query Processor
 *
 * Implements strict separation:
 * Pillar A: Live Supabase Property Search
 * Pillar B: Fallback Property Search (propertyData.ts)
 * Pillar C: OPV Website Knowledge (openplotsandvillas.com)
 * Pillar D: General Chatbot Conversation & Out-of-Scope Protection
 */
export function processChatQuery(
  rawQuery: string,
  language: LanguageCode = 'en'
): AIResponse {
  const profile = OPV_COMPANY_PROFILE;
  const classified = classifyIntent(rawQuery);
  const { intent, matchedProject, normalizedQuery } = classified;

  // Detect if user asks for detailed explanation ("explain in detail", "tell me everything", etc.)
  const isDetailRequested =
    /\b(detail|detailed|in detail|everything|complete|deep|explain in detail|tell me everything|step by step|full information|all details|how does it work)\b/i.test(
      normalizedQuery
    );

  // =========================================================================
  // PILLAR D: GREETING, COMPETITOR, OUT-OF-SCOPE PROTECTION
  // =========================================================================
  if (intent === 'GREETING') {
    const isThanks = /\b(thank you|thanks|dhanyavadalu|dhanyavadamulu|bye|goodbye)\b/i.test(normalizedQuery);
    if (isThanks) {
      return {
        content: `You're welcome! Feel free to ask whenever you have questions about properties, approvals, or legal verification in Hyderabad. Have a great day!`,
        actions: getStandardActions('Hello OPV, I have a property query'),
        category: 'greeting',
        properties: []
      };
    }

    const langObj = OPV_LANGUAGES.find(l => l.code === language) || OPV_LANGUAGES[0];
    return {
      content: `### ${langObj.welcomeGreeting}
${langObj.welcomeSubtitle}

How can I assist you with properties, approvals, or real estate services today?`,
      actions: getStandardActions('Hello OPV, I would like to explore properties in Hyderabad'),
      category: 'greeting',
      properties: []
    };
  }

  if (intent === 'COMPETITOR') {
    return {
      content: `Sorry, I can help only with Open Plots & Villas and real-estate information available through OPV.

You can ask me about:
🏠 Properties & Projects
📍 Locations
💰 Prices & Budgets
📋 HMDA / DTCP / RERA
🏡 Buying, Selling & Rentals
🏦 Home Loans
⚖️ Property Legal & Verification
🧭 OPV Services`,
      actions: getStandardActions('Hello OPV, I want to explore verified properties on OPV'),
      category: 'general',
      properties: []
    };
  }

  if (intent === 'OUT_OF_SCOPE') {
    return {
      content: `Sorry, I can help only with real-estate related questions on Open Plots & Villas.

You can ask me about:
🏠 Properties & Projects
📍 Locations
💰 Prices & Budgets
📋 HMDA / DTCP / RERA
🏡 Buying, Selling & Rentals
🏦 Home Loans
⚖️ Property Legal & Verification
🧭 OPV Services`,
      actions: getStandardActions('Hello OPV, I need property guidance'),
      category: 'general',
      properties: []
    };
  }

  // =========================================================================
  // SPECIFIC PROJECT QUESTIONS (e.g., "Tell me about Golden Terra")
  // Priority: Live Supabase Property Data -> Approved Project Website Knowledge
  // =========================================================================
  if (intent === 'PROJECT_INFORMATION') {
    const projQuery = matchedProject || rawQuery;

    // 1. Search LIVE Supabase property data first
    const liveMatches = searchLiveProperties(rawQuery);
    if (liveMatches.length > 0) {
      const proj = liveMatches[0];
      return {
        content: `Sure! Here is the latest project information for **${proj.title}** from our live inventory:`,
        properties: liveMatches,
        actions: getStandardActions(`Hello OPV, I am inquiring about ${proj.title}`),
        category: proj.type === 'plot' ? 'plots' : 'villas'
      };
    }

    // 2. If project information is not available there, use approved project information from website knowledge
    const approvedProj = profile.approvedProjects.find(
      p =>
        p.name.toLowerCase().includes(projQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(projQuery.toLowerCase()) ||
        projQuery.toLowerCase().includes(p.name.toLowerCase())
    );

    if (approvedProj) {
      const fallbackCard = findPropertyByTitle(approvedProj.title);
      return {
        content: `### 🏡 ${approvedProj.title}
**Location:** ${approvedProj.location}  
**Approvals:** ${approvedProj.approval}  
**Starting Price:** ${approvedProj.price}  
**Area / Configuration:** ${approvedProj.area}  

${approvedProj.description}

*This approved project information is verified directly from OPV records.*`,
        properties: fallbackCard ? [fallbackCard] : [],
        actions: [
          { label: '📞 Call OPV Desk', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' },
          { label: '💬 Chat on WhatsApp', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hello OPV, I would like to schedule a site visit for ${approvedProj.title}`)}`, action: 'whatsapp' },
          { label: '📍 View on Website', url: profile.website, action: 'contact' }
        ],
        category: approvedProj.type === 'plot' ? 'plots' : 'villas'
      };
    }

    // 3. If project is not found in live data or approved list, never fake data:
    return {
      content: `I don't have that information available right now. I can connect you with an OPV property expert.`,
      actions: getStandardActions(`Hello OPV, I am looking for information on ${rawQuery}`),
      category: 'general',
      properties: []
    };
  }

  // =========================================================================
  // PILLAR A & B: PROPERTY SEARCH
  // Priority: Supabase LIVE DATA -> propertyData.ts FALLBACK
  // =========================================================================
  if (intent === 'PROPERTY_SEARCH') {
    // Priority 1: Supabase LIVE DATA
    const liveMatches = searchLiveProperties(rawQuery);
    if (liveMatches.length > 0) {
      const intro = buildPropertySearchIntro(rawQuery, liveMatches);
      return {
        content: intro,
        properties: liveMatches,
        actions: getStandardActions('Hello OPV, I am interested in these property listings'),
        category: liveMatches[0].type === 'plot' ? 'plots' : 'villas'
      };
    }

    // Priority 2: propertyData.ts FALLBACK
    const fallbackMatches = searchFallbackProperties(rawQuery);
    if (fallbackMatches.length > 0) {
      const intro = buildPropertySearchIntro(rawQuery, fallbackMatches);
      return {
        content: intro,
        properties: fallbackMatches,
        actions: getStandardActions('Hello OPV, I am interested in these property listings'),
        category: fallbackMatches[0].type === 'plot' ? 'plots' : 'villas'
      };
    }

    // Zero fake data: If no properties match budget or criteria
    return {
      content: `I don't have a matching property available right now. I can connect you with an OPV property expert.`,
      actions: getStandardActions('Hello OPV, I am looking for custom property options matching my requirements'),
      category: 'general',
      properties: []
    };
  }

  // =========================================================================
  // PILLAR C: OPV WEBSITE KNOWLEDGE (openplotsandvillas.com)
  // Answers general questions about OPV using website knowledge (NO property cards)
  // =========================================================================

  // 1. WHAT SERVICES DOES OPV PROVIDE? / 360° ELITE SERVICES
  if (intent === 'OPV_SERVICES') {
    return {
      content: `Sure! OPV provides comprehensive real-estate services across Hyderabad and Telangana:

### 🌟 OPV Real Estate Services

- 🏡 **Property Buying:** Guided property discovery, site visits, and acquisition support for verified open plots, luxury gated villas, and apartments.
- 📢 **Property Selling:** Free property listing and AI-driven buyer matchmaking for owners and builders.
- 🏠 **Property Rentals:** Verified tenant matchmaking and digital rental agreement drafting.
- 🏦 **Home Loans:** Fast loan sanctions at competitive interest rates with leading banks (SBI, HDFC, ICICI, Axis Bank, LIC HFL).
- ⚖️ **Legal Verification:** Comprehensive 30-year link document search, title scrutiny, and due diligence by senior property advocates.
- 🖋️ **Property Registration:** SRO slot booking, challan assistance, and deed registration execution support.
- 🛰️ **Land Survey:** Total Station and GPS boundary surveys to verify plot dimensions and prevent overlap.
- 🧭 **Vastu Consultation:** Directional and floor plan audits for plots and residential construction.
- 🪔 **Bhoomi Pooja:** Traditional ground-breaking ceremonies with certified Vedic purohits and complete samagri.
- 🏠 **Gruhapravesam:** Hassle-free housewarming ceremony coordination including Go-Puja and Navagraha homam.
- 🏗️ **Interior & Construction:** Turnkey architectural planning, structural design, and interior solutions.
- 🛡️ **Property Management:** Perimeter fencing, regular inspections, and asset guard services for vacant plots.
- 🌐 **NRI Property Assistance:** Dedicated remote advisory with virtual video tours, consular POA assistance, and lease management.

Feel free to ask for details on any specific service!`,
      actions: [
        { label: '📋 Book 360° Consultation', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent('I want to know more about OPV 360 Elite Services')}`, action: 'whatsapp' },
        { label: '📞 Call OPV Desk', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'services',
      properties: []
    };
  }

  // 2. ABOUT OPV / MISSION & VISION / WHAT IS OPV
  if (intent === 'OPV_COMPANY_INFORMATION') {
    if (!isDetailRequested && !normalizedQuery.includes('mission') && !normalizedQuery.includes('vision') && !normalizedQuery.includes('why') && !normalizedQuery.includes('trust')) {
      return {
        content: `**Open Plots & Villas (OPV)** is an AI-powered real estate platform in Hyderabad and Telangana.

We connect property buyers and investors with verified open plots, luxury gated villas, apartments, and farm lands with complete document verification, home loan assistance, and end-to-end property services.

You can ask me to search available properties, explain regulatory approvals (HMDA, DTCP, RERA), or assist with 360° property services.`,
        actions: getStandardActions('Hello OPV, I want to learn more about OPV platform'),
        category: 'about',
        properties: []
      };
    }

    return {
      content: `### 🏢 About Open Plots & Villas (OPV)
${profile.about.overview.replace(/100%\s*/gi, 'thoroughly ')}

🎯 **Mission:**  
${profile.about.mission}

👁️ **Vision:**  
${profile.about.vision}

**Why Customers Trust OPV:**  
${profile.about.whyOPV.map(point => `• ${point.replace(/100%\s*/gi, 'Thoroughly ')}`).join('\n')}`,
      actions: getStandardActions('Hello OPV, I want to learn more about OPV platform'),
      category: 'about',
      properties: []
    };
  }

  // 3. PROPERTY TYPES OVERVIEW
  if (intent === 'PROPERTY_TYPES_OVERVIEW') {
    const typesDesc = profile.propertyCategories
      .map(c => `• **${c.type}:** ${c.description}\n  *Top Locations:* ${c.topLocations.join(', ')}`)
      .join('\n\n');

    return {
      content: `### 🏡 Property Types Available on OPV
Open Plots & Villas offers verified properties across Hyderabad and Telangana:

${typesDesc}

Properties listed on OPV undergo link document review and statutory approval checks.`,
      actions: getStandardActions('Hello OPV, I would like to inquire about property options'),
      category: 'general',
      properties: []
    };
  }

  // 4. HMDA INFORMATION & HMDA vs DTCP
  if (intent === 'HMDA') {
    const isComparison =
      /\b(vs|versus|difference|diff|compare|comparison)\b/i.test(normalizedQuery) ||
      (/\bhmda\b/i.test(normalizedQuery) && /\bdtcp\b/i.test(normalizedQuery));

    if (isComparison) {
      return {
        content: `**HMDA vs DTCP: Key Differences for Property Buyers**

Both **HMDA** and **DTCP** are statutory layout approval authorities in Telangana, but they govern distinct geographical zones and infrastructure specifications.

### 🏛️ HMDA (Hyderabad Metropolitan Development Authority)
- **Jurisdiction:** Governs Hyderabad and surrounding metropolitan districts across a **7,257 sq. km** jurisdiction.
- **Coverage Areas:** High-density urban corridors (e.g. Kokapet, Tellapur, Mokila, Shamshabad, Medchal, Kothur).
- **Road & Infrastructure Standards:** Requires minimum 30ft, 40ft, or 60ft wide blacktop (BT) roads, underground drainage, and piped drinking water.
- **Open Space Reservation:** Mandates that developers reserve and hand over 7.5% to 10% of the layout area for public parks, open spaces, and civic amenities.
- **Price & Appreciation:** Higher capital investment with established urban infrastructure and location-driven appreciation potential.

### 📐 DTCP (Directorate of Town and Country Planning)
- **Jurisdiction:** Sanctions layouts in municipalities, nagar panchayats, and rural corridors **outside the HMDA boundary**.
- **Coverage Areas:** Expanding district growth corridors along major highways (e.g. outer Shadnagar, Yadagirigutta, Sadashivpet).
- **Road & Infrastructure Standards:** Enforces standard 33ft or 40ft wide internal BT/CC roads and clearly demarcated plot boundaries.
- **Open Space Reservation:** Compulsory statutory reservations for public parks, open spaces, and utilities per town planning norms.
- **Price & Appreciation:** Budget-friendly entry prices with potential long-term value growth as regional infrastructure expands.

### Summary & Buying Advice
- 🛡️ **Regulatory Validity:** Fully sanctioned HMDA and DTCP approved layouts comply with government planning norms and provide greater regulatory assurance.
- 📝 **Registration Security:** In Telangana, unapproved or non-HMDA/non-DTCP plots cannot be registered at Sub-Registrar Offices.

### Example / Verification Tip:
When purchasing within Hyderabad metropolitan limits, check the **HMDA Layout Permit (LP) Number**. For highway corridors outside HMDA limits, verify the **DTCP Technical Layout Approval (TLP) Number** directly with official records.`,
        actions: getStandardActions('Hello OPV, I have a question about HMDA vs DTCP approved plots'),
        category: 'regulatory',
        properties: []
      };
    }

    return {
      content: `**What is HMDA?**

**HMDA** stands for **Hyderabad Metropolitan Development Authority**.

In simple words, HMDA is the apex statutory urban planning agency that plans, coordinates, and regulates real estate development across Hyderabad and its surrounding districts over a **7,257 sq. km** jurisdiction.

### What does HMDA do?

- 🏛️ Prepares and enforces the Hyderabad Metropolitan Master Plan and land zoning regulations.
- 📐 Approves residential layouts, open plot gated communities, and commercial developments.
- 🛣️ Mandates essential infrastructure standards including minimum 30ft to 40ft blacktop (BT) roads, underground drainage, and piped drinking water.
- 🌳 Requires developers to reserve and hand over 7.5% to 10% of the layout area for public parks, open spaces, and civic utilities.
- 🚫 Restricts unauthorized constructions and illegal layouts in the metropolitan jurisdiction.

### Why is HMDA approval important?

- 🛡️ **Regulatory Assurance & Zoning Compliance:** HMDA layouts provide greater regulatory assurance when properly approved and verified, complying with statutory master plan zoning.
- 🏦 **Bank Loan Approval Eligibility:** Leading public and private banks sanction plot purchase and construction loans for approved HMDA layouts.
- 📝 **Mandatory for Registration:** In Telangana, unauthorized or non-HMDA plots in metropolitan zones cannot be registered at Sub-Registrar Offices (SRO).
- 📈 **Organized Development:** Planned along designated infrastructure corridors, supporting long-term utility and organized growth.

### Telangana-Specific Information:
HMDA functions under the Municipal Administration and Urban Development (MA&UD) Department of Telangana, governing planned urban growth across Hyderabad and parts of 7 surrounding districts.

### Example / Verification Tip:
When evaluating a layout advertised as **"HMDA Approved"**, always check the official **HMDA Layout Permit (LP) Number** on the HMDA portal (**hmda.gov.in**) and confirm that your specific plot number is released from mortgage before making a financial commitment.`,
      actions: getStandardActions('Hello OPV, I have a question about HMDA approved plots'),
      category: 'regulatory',
      properties: []
    };
  }

  // 5. DTCP INFORMATION
  if (intent === 'DTCP') {
    return {
      content: `**What is DTCP?**

**DTCP** stands for **Directorate of Town and Country Planning**.

In simple words, DTCP is the statutory government authority responsible for regulating urban planning, approving open plot layouts, and sanctioning building plans in developing towns, nagar panchayats, and rural corridors across Telangana **outside the HMDA jurisdiction**.

### What does DTCP do?

- 📐 Approves open plot layouts and master plans in district headquarters, municipalities, and expanding semi-urban growth corridors.
- 🛣️ Enforces layout development norms, including minimum 33ft or 40ft wide internal BT or CC roads.
- 🌳 Mandates reservations for public utilities, open spaces, and public parks to prevent congested unauthorized colonies.
- 💧 Ensures proper stormwater drainage, street lighting, and demarcated boundaries from agricultural buffer zones.

### Why is DTCP approval important?

- 🛡️ **Regulatory Protection:** Helps protect buyers from unauthorized agricultural subdivisions and unapproved panchayat layouts.
- 🏦 **Bank Loan Eligibility:** DTCP-approved layouts are recognized and approved for property and composite loans by major banks.
- 📝 **Hassle-Free Registration:** Ensures the plot can be legally registered at the Sub-Registrar Office without government restrictions.
- 💰 **Accessible Entry & Planned Layouts:** DTCP layouts offer accessible entry prices in developing corridors, though actual property appreciation depends on location, connectivity, and market conditions.

### Telangana-Specific Information:
In Telangana, DTCP approvals apply to developing municipalities, nagar panchayats, and rural corridors outside the HMDA limits and Outer Ring Road (ORR), working in coordination with local civic bodies.

### Example / Verification Tip:
Always verify the developer's **DTCP Technical Layout Approval (TLP) number** and layout sanction copy from the local municipal or gram panchayat authority to ensure the final layout has received all regulatory clearances.`,
      actions: getStandardActions('Hello OPV, I have a question about DTCP approved layouts'),
      category: 'regulatory',
      properties: []
    };
  }

  // 6. RERA INFORMATION
  if (intent === 'RERA') {
    return {
      content: `**RERA** stands for **Real Estate (Regulation and Development) Act, 2016**.

In simple words, RERA is an Indian law designed to bring **transparency and accountability to real estate projects and protect the interests of property buyers**.

### What does RERA do?

- 🏗️ Requires eligible real estate projects (exceeding 500 sq. meters or more than 8 units) to be registered with the state RERA authority before marketing or selling.
- 📋 Mandates comprehensive disclosures of project layouts, sanction plans, timelines, and promoter track record.
- 💰 Directs developers to deposit 70% of buyer payments into a dedicated escrow bank account exclusively for construction and land costs.
- 📅 Enforces timely project delivery with standardized sale agreements and penalty interest for handover delays.
- 🛡️ Holds builders legally accountable for structural defect rectifications for 5 years post-possession.

### Why is RERA important?

- 🛡️ **Buyer Safeguards:** Significantly reduces the risk of project abandonment, fund diversion, and unauthorized plan alterations.
- ⚖️ **Speedy Dispute Resolution:** Offers a dedicated regulatory tribunal for adjudicating homebuyer grievances without protracted civil litigation.
- 📜 **Clarity on Carpet Area:** Establishes standardized carpet-area pricing rather than ambiguous super-built-up calculations.

### Telangana-Specific Information:
In Telangana, the governing body is **TG RERA (Telangana Real Estate Regulatory Authority)**. Promoters are prohibited by law from advertising, marketing, or collecting booking advances for non-exempt projects without a valid TSRERA registration number.

### Example / Verification Tip:
Before committing funds to any ongoing residential apartment or plotted layout project, verify its registration status directly on the official TSRERA portal (**rera.telangana.gov.in**) using the project name or registration number.`,
      actions: getStandardActions('Hello OPV, I have an inquiry regarding TSRERA verified projects'),
      category: 'regulatory',
      properties: []
    };
  }

  // 7. ENCUMBRANCE CERTIFICATE (EC)
  if (intent === 'EC') {
    return {
      content: `**What is an Encumbrance Certificate (EC)?**

An **EC** stands for **Encumbrance Certificate**.

In simple words, an EC is an official government document issued by the **Sub-Registrar Office (SRO)** that proves whether a property has any registered financial liabilities, mortgages, bank claims, or legal disputes.

### What does an EC show?

- 📜 **Registered Transactions:** Lists all registered sale deeds, gift deeds, partitions, and leases executed on the property during a specified time period.
- 🏦 **Mortgages & Bank Liens:** Records whether the property has been pledged to a bank or financial institution as security for a loan.
- ⚖️ **Legal Injunctions:** Reveals registered court attachments or legal encumbrances registered with the Sub-Registrar.

### Form 15 vs Form 16:

- 📋 **Form 15:** Contains detailed records of all registered transactions that took place on the property during the search period.
- 🟢 **Form 16 (Nil Encumbrance Certificate):** Certifies that **NO** registered transactions or encumbrances exist on the property during the requested search period (confirming a clean registered title).

### Why is an EC important?

- 🛡️ **Verifies Title Status:** Confirms whether the property has registered encumbrances, bank mortgages, or court attachments during the searched period.
- 🏦 **Mandatory for Bank Loans:** Banks will not sanction a home loan or plot loan without reviewing a minimum 13-to-30-year EC.
- 📝 **Essential for Registration:** The Sub-Registrar requires the latest EC to verify clear ownership before registering the sale deed.

### Telangana-Specific Information:
In Telangana, ECs can be searched and downloaded online through the **Telangana Registration & Stamps Department (registration.telangana.gov.in)** or verified via the **Dharani portal** for agricultural land parcels.

### Example / Verification Tip:
When verifying property in Telangana, always obtain a **30-year Nil Encumbrance Certificate (Form 16)** to inspect the complete chain of ownership and confirm there are no outstanding registered liabilities.`,
      actions: getStandardActions('Hello OPV, I need help checking an Encumbrance Certificate (EC)'),
      category: 'legal',
      properties: []
    };
  }

  // 8. MUTATION
  if (intent === 'MUTATION') {
    return {
      content: `**What is Property Mutation?**

**Property Mutation** (also known as *Dakhil Kharij* or *Pattadar Transfer*) is the formal government process of updating ownership records in the municipal or revenue books after a property has been registered.

In simple words, while property registration legally transfers the title from seller to buyer in the registry office, **mutation updates the government's official tax and revenue registers with the new owner's name**.

### What does Mutation do?

- 🏛️ Updates municipal or gram panchayat property tax records so that property tax receipts are generated in the new owner's name.
- 💧 Enables the new owner to legally transfer utility connections such as electricity, water, and sewerage meters.
- 🌾 In the case of agricultural land or rural layouts, updates the **Pattadar Passbook** and title entries in the revenue records.

### Registration vs Mutation:

- 📝 **Registration:** A legal transaction between buyer and seller at the Sub-Registrar Office that transfers title deed ownership.
- 🔄 **Mutation:** An administrative update with local municipal (GHMC/CDMA) or revenue authorities to establish who is responsible for paying property taxes.

### Why is Mutation important?

- 🛡️ **Prevents Tax Disputes:** Ensures you receive official government tax demand notices and receipts directly in your name, preventing unauthorized disputes.
- 📑 **Official Proof of Possession:** Mutation records provide crucial civic evidence of ownership and possession during legal or utility verifications.
- 💰 **Essential for Future Resale:** Prospective buyers and banks require the latest mutation proceedings and tax receipts to confirm smooth title continuity.

### Telangana-Specific Information:
In Telangana, agricultural and rural land mutations are processed through the **Dharani Portal**, while urban residential properties in Hyderabad are updated through **GHMC (Greater Hyderabad Municipal Corporation)** or **CDMA (Commissioner and Director of Municipal Administration)**.

### Example / Verification Tip:
After completing your sale deed registration at the Sub-Registrar Office, verify that mutation is initiated promptly. Confirm your updated **Property Tax Identification Number (PTIN)** or Pattadar Passbook online to ensure title records match tax records.`,
      actions: getStandardActions('Hello OPV, I need guidance regarding property mutation'),
      category: 'legal',
      properties: []
    };
  }

  // 9. PROPERTY REGISTRATION GUIDANCE
  if (intent === 'PROPERTY_REGISTRATION') {
    const isDocQuery = /\b(doc|docs|document|documents|papers|checklist|requirements)\b/i.test(normalizedQuery);
    if (isDocQuery) {
      return {
        content: `**Checklist of Documents Required for Property Registration in Telangana**

To register a residential plot, villa, or apartment at the jurisdictional Sub-Registrar Office (SRO), ensure you have the following essential documents:

### 1. Title & Prior Deeds:
- 📜 **30-Year Link Documents:** Complete chain of certified title deeds tracing ownership continuity over the past 30 years.
- 🟢 **30-Year Nil Encumbrance Certificate (EC):** Issued by the Sub-Registrar Office confirming no registered mortgages or court attachments.

### 2. Sanctions & Approvals:
- 🏛️ **Statutory Layout Sanction:** Official layout permit copy and approved blueprint from **HMDA** or **DTCP**.
- 🌾 **Revenue Records / Passbook:** Pattadar Passbook and latest mutation proceedings (for agricultural or plotted parcels).

### 3. Identity & Transaction Documents:
- 📝 **Draft Sale Deed:** Properly stamped and executed transfer deed prepared by an advocate.
- 🪪 **Identity Proofs:** Original Aadhaar Cards and PAN Cards of both buyer and seller.
- 👥 **Witnesses:** Two competent witnesses with valid photo identification (Aadhaar or PAN).
- 🧾 **Challan Payment Receipt:** Proof of online stamp duty, transfer duty, and registration fee payment via the registration portal.

### Example / Verification Tip:
Ensure that the seller's name in the latest EC, Pattadar Passbook/PTIN, and link documents matches exactly before scheduling the SRO registration slot.`,
        actions: getStandardActions('Hello OPV, I need help verifying property registration documents'),
        category: 'legal',
        properties: []
      };
    }

    return {
      content: `**Property Registration in Telangana: Process & Charges**

**Property Registration** is the formal recording of a sale deed or transfer document with the government under the **Registration Act, 1908**, giving legal validity and public notice of property ownership.

In simple words, registration is the statutory step that legally transfers ownership from the seller to the buyer.

### What are the Registration Charges in Telangana?

The total government fees amount to approximately **7.5%** of the property's market or guideline value:
- 🏛️ **Stamp Duty:** 5.5%
- 🏙️ **Transfer Duty:** 1.5%
- 📑 **Registration Fee:** 0.5%

### Essential Documents Required:

- 📜 Registered 30-year link documents tracing title history
- 🟢 Latest Encumbrance Certificate (EC) from the Sub-Registrar Office
- 📐 HMDA / DTCP layout sanction letter and approved blueprint
- 🌾 Pattadar Passbook / Mutation proceeding (for land/plots)
- 🪪 Aadhaar and PAN cards of both buyer and seller
- 👥 Two competent witnesses with valid photo ID cards (Aadhaar or PAN)

### Step-by-Step Registration Process:

1. **Title Verification:** Verify 30-year link documents and Nil EC.
2. **Online Slot Booking:** Book an appointment on the Telangana Registration portal (registration.telangana.gov.in) and pay the challan online.
3. **SRO Visit:** Buyer, seller, and two witnesses visit the local Sub-Registrar Office with original documents.
4. **Biometric Verification:** Biometric thumb impressions, digital signatures, and photographs are captured.
5. **Document Release:** The registered sale deed is assigned a unique Document Number and handed over to the buyer.

### Telangana-Specific Information:
Property registrations in Telangana are conducted by appointment through the **Telangana Registration and Stamps Department** portal (**registration.telangana.gov.in**) or via the **Dharani portal** for agricultural land.

### Example / Verification Tip:
Unregistered agreements of sale do not convey legal title. Always complete formal registration at the jurisdictional Sub-Registrar Office and collect the registered sale deed.`,
      actions: getStandardActions('Hello OPV, I need assistance with property registration'),
      category: 'legal',
      properties: []
    };
  }

  // 10. LEGAL ASSISTANCE & PROPERTY VERIFICATION
  if (intent === 'LEGAL_PROPERTY_SUPPORT' || intent === 'PROPERTY_VERIFICATION') {
    return {
      content: `**Property Legal Due Diligence: 5-Point Verification Guide**

Real estate investments require thorough legal due diligence to minimize financial, title, and litigation risks.

In simple words, legal verification is an exhaustive check conducted by property advocates to confirm that the seller has absolute, undisputed ownership and the legal right to sell.

### 5-Point OPV Legal Scrutiny Checklist:

1. 📜 **30-Year Link Documents:** Traces ownership unbroken across the past 30 years to verify clear title flow without family or partition disputes.
2. 🏛️ **Statutory Layout Sanctions:** Validates official layout approvals from **HMDA** or **DTCP**, and verifies project registration on **TG RERA**.
3. 🔍 **30-Year Nil Encumbrance Certificate (EC):** Confirms the property is free of financial mortgages, bank liens, and registered court attachments.
4. 🌾 **Revenue Records & Dharani Verification:** Checks Pahani, 1B records, Pattadar Passbook, and verifies land is not categorized as government, assigned, or Wakf land.
5. 📐 **Physical GPS Survey & Demarcation:** Conducts an on-site survey to verify exact plot boundaries, road dimensions, and ensure zero boundary encroachment.

### Why is Legal Verification Essential?

- 🛡️ Helps protect buyers from disputed ownership, unregistered transactions, and title litigation.
- 🏦 Required by banks and financial institutions for home and plot loan sanctions.
- ⚖️ Provides legal clarity on property title flow and municipal approval status.

### Example / Verification Tip:
Never sign an Agreement of Sale or pay advance money without having an experienced property advocate review the certified copies of 30-year parent documents and municipal approvals.`,
      actions: getStandardActions('Hello OPV, I want to book a legal document verification'),
      category: 'legal',
      properties: []
    };
  }

  // 11. HOME LOAN ASSISTANCE
  if (intent === 'HOME_LOAN') {
    const isLoanDetail =
      isDetailRequested ||
      /\b(doc|document|documents|paper|papers|eligibility|interest|rate|rates|process|step|steps|options|difference|checklist|guide)\b/i.test(
        normalizedQuery
      );

    if (!isLoanDetail) {
      return {
        content: `Yes, **Open Plots & Villas (OPV)** provides complete home loan and plot financing assistance.

### How OPV Helps with Property Loans:
• **Banking Partners:** We coordinate directly with premier lenders including **SBI, HDFC Bank, ICICI Bank, Axis Bank, and LIC Housing Finance**.
• **Financing Supported:** Plot purchase loans for HMDA/DTCP layouts, composite loans (plot + construction), and villa construction loans.
• **End-to-End Support:** Assistance with bank eligibility checks, document preparation, and loan sanctions.

Would you like to check your loan eligibility or discuss financing for a specific property?`,
        actions: getStandardActions('Hello OPV, I need home loan assistance for my property'),
        category: 'loans',
        properties: []
      };
    }

    return {
      content: `**Home Loan & Property Financing Guide**

A **Home Loan / Plot Loan** is a financial facility provided by banks and housing finance companies to purchase open plots, build villas, or acquire apartments, repaid over a chosen tenure in monthly installments (EMIs).

### Financing Options Available:

- 🏡 **Plot Purchase Loan:** Financing for purchasing approved residential plots in HMDA or DTCP sanctioned layouts.
- 🏗️ **Home Construction Loan:** Funding to construct a custom villa or independent house on your existing plot.
- 🔄 **Composite Loan (Plot + Construction):** A single combined loan that finances both the plot purchase and villa construction.
- 💼 **Balance Transfer & Top-Up:** Transfer your existing high-interest loan to lower interest rates with additional top-up funds.

### Leading Banking Partners:

OPV coordinates directly with premier banking institutions including **SBI, HDFC Bank, ICICI Bank, Axis Bank, and LIC Housing Finance** for competitive interest rates and smooth processing.

### Essential Documents Required:

- 🪪 **KYC Documents:** PAN Card, Aadhaar Card, Passport size photos.
- 💼 **Income Proof (Salaried):** Latest 3 months salary slips, 6 months bank statements, and Form 16 / ITR.
- 📊 **Income Proof (Self-Employed):** 2 to 3 years audited financial statements, ITR computation, and 12 months bank statements.
- 📜 **Property Documents:** Sale deed, HMDA/DTCP layout approval, 30-year link documents, and latest EC.

### Practical Financing Tip:
Check your pre-approved loan eligibility before finalizing a property deal to know your exact borrowing capacity and negotiate with confidence.`,
      actions: getStandardActions('Hello OPV, I need home loan assistance for my property'),
      category: 'loans',
      properties: []
    };
  }

  // 12. VASTU CONSULTATION
  if (intent === 'VASTU') {
    return {
      content: `### 🧭 Scientific & Traditional Vastu Consultation
OPV provides holistic Vastu audits to ensure your plot or home invites positive energy, prosperity, and harmony.

**Key Vastu Services:**
• **Plot Vastu Audits:** Cardinal orientation checks, slope analysis, and North-East (Ishanya) corner optimization.
• **Villa Floor Plan Alignment:** Room placement (kitchen in Agneya, master bedroom in Nairuthi, entrance in auspicious padas).
• **Remedies Without Demolition:** Non-invasive structural remedies to resolve energy blockages.`,
      actions: getStandardActions('Hello OPV, I want to book a Vastu consultation'),
      category: 'spiritual',
      properties: []
    };
  }

  // 13. BHOOMI POOJA
  if (intent === 'BHOOMI_POOJA') {
    return {
      content: `### 🪔 Bhoomi Pooja Ceremony Services
Begin your construction on an auspicious note with traditional Vedic rituals arranged by OPV.

**What We Provide:**
• **Auspicious Muhurtam Calculation:** Calculated by renowned Vedic astrologers.
• **Learned Vedic Purohits:** Experienced priests to conduct Vastu Shanti and Bhoomi Devi invocation.
• **Complete Ritual Samagri:** Navadhanya, copper/silver kalasha, Shankusthapana stones, and sacred puja items.
• **Pandal & Event Coordination:** Optional shamiana, floral decor, and guest seating.`,
      actions: getStandardActions('Hello OPV, I want to book Bhoomi Pooja ceremony services'),
      category: 'spiritual',
      properties: []
    };
  }

  // 14. GRUHAPRAVESAM
  if (intent === 'GRUHAPRAVESAM') {
    return {
      content: `### 🏠 Gruhapravesam (House Warming) Services
Celebrate moving into your dream home with hassle-free Vedic ceremony arrangements.

**What We Provide:**
• **Traditional Go-Puja:** Auspicious Cow & Calf blessing ceremony at the threshold.
• **Ganapati & Navagraha Homam:** Sacred Vedic fire rituals to purify your new home.
• **Milk Boiling Ritual & Vastu Puja:** Traditional blessing for abundance and peace.
• **Floral Decor & Pandal Setup:** Elegant floral arrangements, entrance toran, and catering liaison.`,
      actions: getStandardActions('Hello OPV, I want to book Gruhapravesam ceremony services'),
      category: 'spiritual',
      properties: []
    };
  }

  // 15. LAND SURVEY SERVICES
  if (intent === 'SURVEY_SERVICES') {
    return {
      content: `### 🗺️ Land Survey & GPS Demarcation Services
Protect your property boundaries and verify precise boundary accuracy before purchasing or constructing.

**What We Provide:**
• **Total Station Laser Survey:** Millimeter-accurate layout and contour mapping.
• **DGPS (Differential GPS) Audits:** High-precision satellite boundary mapping matching government revenue stones.
• **Physical Boundary Demarcation:** Stone marking, boundary pegs, and encroachment verification.
• **Drone Aerial Mapping:** High-resolution aerial survey for large plots and farm layouts.`,
      actions: getStandardActions('Hello OPV, I want to book a land survey service'),
      category: 'survey',
      properties: []
    };
  }

  // 16. INTERIOR DESIGN & CONSTRUCTION
  if (intent === 'INTERIOR_CONSTRUCTION') {
    return {
      content: `### 🎨 Interior Design & Turnkey Construction
Turn your empty plot or bare villa into a stunning home with OPV's integrated architectural and interior services.

**Key Highlights:**
• **Turnkey Civil Construction:** High-grade construction with strict quality checks, structural warranty, and on-time delivery.
• **Custom Modular Interiors:** Factory-finished modular kitchens, wardrobes, TV units with 10-year warranty.
• **Smart 3D Elevations & VR Walkthroughs:** Preview every room in photorealistic 3D before execution begins.
• **False Ceiling & Ambient Lighting:** Contemporary architectural lighting and designer aesthetics.`,
      actions: getStandardActions('Hello OPV, I am interested in Interior Design and Construction support'),
      category: 'construction',
      properties: []
    };
  }

  // 17. PROPERTY MANAGEMENT
  if (intent === 'PROPERTY_MANAGEMENT') {
    return {
      content: `### 🛡️ Property Management & Asset Guard
Keep your plots and vacant homes well-protected from encroachments and well-maintained while you are away.

**What We Provide:**
• **Boundary Fencing:** Barbed-wire fencing or precast compound walls with clear OPV deterrence signboards.
• **Quarterly Site Inspections:** Physical site visits with geo-tagged photos and video status updates.
• **Tax & Utility Management:** Timely municipal property tax payments, electricity, and water bill maintenance.
• **Tenant Vetting & Lease Management:** Reliable tenant screening, agreement drafting, and rent collection.`,
      actions: getStandardActions('Hello OPV, I want to know more about Property Management services'),
      category: 'management',
      properties: []
    };
  }

  // 18. NRI PROPERTY ASSISTANCE
  if (intent === 'NRI_ADVISORY') {
    return {
      content: `### 🌐 NRI Property Advisory Desk
Complete remote property acquisition and asset management tailored for Non-Resident Indians.

**Can NRIs Buy Property in India?**
• **Permitted:** Residential plots, luxury villas, apartments, and commercial spaces (freely purchasable under FEMA & RBI guidelines).
• **Restrictions:** Agricultural land, farmhouses, and plantation properties require special RBI approval (unless inherited).

**OPV NRI Concierge Services:**
1. **Virtual Live Video Walkthroughs:** 360° interactive tours of physical plots and construction milestones.
2. **Embassy-Attested POA Coordination:** Remote legal drafting and consular power of attorney registration.
3. **Banking & Currency Compliance:** Smooth transactions via NRE / NRO bank accounts with repatriation support.
4. **Complete Property Management:** Perimeter fencing and physical protection so your assets remain encroachment-free.`,
      actions: getStandardActions('Hello OPV, I am an NRI looking to invest in Hyderabad real estate'),
      category: 'nri',
      properties: []
    };
  }

  // 19. INVESTMENT GUIDANCE
  if (intent === 'INVESTMENT_GUIDANCE') {
    const corridors = profile.investmentGuidance.topCorridors
      .map(c => `• **${c.name}:**\n  ${c.highlights}`)
      .join('\n\n');

    return {
      content: `### 📈 Investment Guidance & Strategic Growth Corridors in Hyderabad
Key emerging development corridors in Hyderabad based on infrastructure connectivity:

${corridors}

**Core OPV Due Diligence Principles:**
• Always verify HMDA / DTCP layout sanctions and TSRERA registration.
• Review a 30-year Nil Encumbrance Certificate (EC).
• Note that actual property appreciation depends on location, infrastructure progress, and market conditions.`,
      actions: getStandardActions('Hello OPV, I would like investment guidance on Hyderabad properties'),
      category: 'investment',
      properties: []
    };
  }

  // 20. AI-POWERED PROPERTY DISCOVERY
  if (intent === 'AI_DISCOVERY') {
    const feats = profile.aiDiscovery.features
      .map(f => `• **${f.name}:** ${f.desc}`)
      .join('\n\n');

    return {
      content: `### 🤖 ${profile.aiDiscovery.title}
*${profile.aiDiscovery.tagline}*

OPV is transforming property buying with artificial intelligence:

${feats}

Our AI engine helps you find the right property without misleading ads or fake listings.`,
      actions: getStandardActions('Hello OPV, I want to try AI-powered property discovery'),
      category: 'ai',
      properties: []
    };
  }

  // 21. FREQUENTLY ASKED QUESTIONS (FAQ)
  if (intent === 'FAQ') {
    const topFaqs = profile.faqs.slice(0, 4)
      .map((f, i) => `**Q${i + 1}: ${f.q}**\n${f.a}`)
      .join('\n\n');

    return {
      content: `### ❓ Frequently Asked Questions
Here are answers to some of the most common questions from OPV customers:

${topFaqs}

Have a specific question? Ask me directly or speak with an OPV advisor!`,
      actions: getStandardActions('Hello OPV, I have a specific question about property buying'),
      category: 'faq',
      properties: []
    };
  }

  // 22. OPV CONTACT INFORMATION
  if (intent === 'OPV_CONTACT') {
    return {
      content: `### 🏢 OPV Contact Information
Here is how you can directly connect with Open Plots & Villas headquarters:

📍 **Head Office Address:**  
${profile.headquarters.address}  
*(Landmark: ${profile.headquarters.landmark})*

📞 **Direct Phone Numbers:**  
• **Mobile / WhatsApp:** [${profile.contact.phonePrimary}](tel:${profile.contact.phonePrimary.replace(/\s+/g, '')})  
• **Landline:** [${profile.contact.phoneSecondary}](tel:${profile.contact.phoneSecondary.replace(/\s+/g, '')})

✉️ **Official Support Email:**  
• [${profile.contact.email}](mailto:${profile.contact.email})

⏰ **Working Hours:**  
• ${profile.contact.supportDesk}

🌐 **Website:** [${profile.website}](${profile.website})`,
      actions: getStandardActions('Hello OPV, I want to visit your office / speak with an advisor'),
      category: 'contact',
      properties: []
    };
  }

  // 23. OPV MOBILE APP & REFERRAL REWARDS
  if (intent === 'OPV_APP') {
    return {
      content: `### 📱 Open Plots Mobile App & Referral Rewards
Experience India's first AI-powered real estate platform right from your pocket!

**App Features:**
• **Post Property for FREE:** Sellers and landlords can post verified listings at zero cost.
• **AI Matchmaking Engine:** Personalized property feeds tailored to your budget and preferred corridor.
• **Direct Builder & Owner Connect:** Direct contact with verified sellers without middleman spam.

🎁 **Refer a Friend Program:**
Refer friends or relatives looking for verified properties or real estate services to earn referral benefits through the OPV platform.`,
      actions: [
        { label: '📲 Download on Google Play', url: profile.app.googlePlay, action: 'explore' },
        { label: '💬 Inquire About Referral', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent('I want to know about the OPV Referral Rewards Program')}`, action: 'whatsapp' }
      ],
      category: 'app',
      properties: []
    };
  }

  // 24. PROPERTY BUYING GUIDANCE
  if (intent === 'BUYING_GUIDANCE') {
    return {
      content: `### 🏡 Property Buying Guide (Step-by-Step)
OPV guides you through every step of purchasing verified property in Hyderabad:

1. **AI Discovery & Requirement Matching:** Filter properties by corridor, budget, and lifestyle requirements.
2. **Site Visit Coordination:** Complimentary physical or virtual video site inspections.
3. **30-Year Legal Verification:** Senior advocate scrutiny of link documents, EC, and approvals.
4. **Bank Loan Assistance:** Quick sanctions from SBI, HDFC, ICICI at competitive rates.
5. **Registration & Mutation:** Full assistance at the Sub-Registrar Office (SRO) and revenue mutation.
6. **Bhoomi Pooja & Construction Support:** Complete ceremonial and architectural execution.`,
      actions: getStandardActions('Hello OPV, I want guidance on buying property'),
      category: 'guidance',
      properties: []
    };
  }

  // 25. PROPERTY SELLING GUIDANCE
  if (intent === 'SELLING_GUIDANCE') {
    return {
      content: `### 📢 How to Sell Your Property on OPV
Owners, builders, and developers can list their properties on OPV with zero hassle:

• **Post Property for FREE:** List your open plot, villa, apartment, or commercial land at zero listing cost.
• **Direct Access to Genuine Buyers:** Connect with verified home buyers and NRI investors actively searching in your locality.
• **Zero Spam:** Direct leads and verified customer inquiries delivered straight to your dashboard.
• **Legal Closing Assistance:** Complete documentation, agreement drafting, and registration coordination.`,
      actions: [
        { label: '📝 Post Property on Website', url: `${profile.website}post-property/`, action: 'explore' },
        { label: '💬 Chat with Listing Expert', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent('I want to list and sell my property on OPV')}`, action: 'whatsapp' }
      ],
      category: 'selling',
      properties: []
    };
  }

  // 26. PROPERTY RENTALS
  if (intent === 'RENTAL_GUIDANCE') {
    return {
      content: `### 🏢 Property Rentals & Leasing Guidance
OPV provides verified residential and commercial rental solutions across Hyderabad:

• **Verified Rental Listings:** 2BHK, 3BHK, luxury villas, and commercial retail/office spaces.
• **Tenant Verification:** Thorough background and document verification for property owners.
• **Rental Agreement Drafting:** Legally compliant rental and lease deed drafting.
• **End-to-End Rental Management:** Timely rent collection and property upkeep for owners and NRIs.`,
      actions: getStandardActions('Hello OPV, I have an inquiry regarding property rentals'),
      category: 'rentals',
      properties: []
    };
  }

  // 27. REAL ESTATE EDUCATION & UNIT CONVERSIONS
  if (intent === 'REAL_ESTATE_EDUCATION') {
    const units = profile.educationalContent.unitConversions
      .map(u => `• **${u}**`)
      .join('\n');
    const terms = profile.educationalContent.terminology
      .map(t => `• **${t.term}:** ${t.definition}`)
      .join('\n\n');

    return {
      content: `### 📐 Real Estate Measurement & Educational Guide
**Land Unit Conversions (Telangana & South India):**
${units}

**Key Real Estate Terminology:**
${terms}`,
      actions: getStandardActions('Hello OPV, I have an inquiry about property measurements and terms'),
      category: 'education',
      properties: []
    };
  }

  // =========================================================================
  // DEFAULT INTELLIGENT FALLBACK
  // =========================================================================
  return {
    content: `I don't have that information available right now. I can connect you with an OPV property expert.`,
    actions: getStandardActions('Hello OPV, I would like to speak with a property expert'),
    category: 'general',
    properties: []
  };
}
