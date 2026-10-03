import { OPV_COMPANY_PROFILE, OPV_LANGUAGES } from '../data/chatConfig';
import { ActionLink, LanguageCode, PropertyItem } from '../types/chat';
import { searchLiveProperties } from '../data/propertyData';
import { classifyIntent, normalizeQuery } from './intentClassifier';

export interface AIResponse {
  content: string;
  actions?: ActionLink[];
  category?: string;
  properties?: PropertyItem[];
  translatedUserPrompt?: string;
}

/**
 * Instant local translation dictionary for common real-estate queries
 * when an Indian language is actively selected. Provides zero-latency
 * native text before/alongside Gemini API results.
 */
export function getQuickTranslation(query: string, language: LanguageCode): string | null {
  if (!query || language === 'en') return null;
  const q = query.toLowerCase().trim();

  // Telugu instant dictionary
  const teMap: Record<string, string> = {
    'what services provide opv': 'OPV ఎలాంటి సేవలను అందిస్తుంది?',
    'what services provide opv?': 'OPV ఎలాంటి సేవలను అందిస్తుంది?',
    'what services does opv provide': 'OPV ఎలాంటి సేవలను అందిస్తుంది?',
    'what services does opv provide?': 'OPV ఎలాంటి సేవలను అందిస్తుంది?',
    'services provided by opv': 'OPV అందించే సేవలు',
    'opv services': 'OPV సేవలు',
    'what is opv': 'OPV అంటే ఏమిటి?',
    'what is opv?': 'OPV అంటే ఏమిటి?',
    'what is rera': 'RERA అంటే ఏమిటి?',
    'what is rera?': 'RERA అంటే ఏమిటి?',
    'what is hmda': 'HMDA అంటే ఏమిటి?',
    'what is hmda?': 'HMDA అంటే ఏమిటి?',
    'what is dtcp': 'DTCP అంటే ఏమిటి?',
    'what is dtcp?': 'DTCP అంటే ఏమిటి?',
    'what is ghmc': 'GHMC అంటే ఏమిటి?',
    'what is ghmc?': 'GHMC అంటే ఏమిటి?',
    'what is ec': 'EC (ఎన్‌కంబరెన్స్ సర్టిఫికేట్) అంటే ఏమిటి?',
    'what is ec?': 'EC (ఎన్‌కంబరెన్స్ సర్టిఫికేట్) అంటే ఏమిటి?',
    'show open plots in shadnagar': 'షాద్‌నగర్‌లో ఓపెన్ ప్లాట్లు చూపించండి',
    'open plots in shadnagar': 'షాద్‌నగర్‌లో ఓపెన్ ప్లాట్లు',
    'luxury villas in hyderabad': 'హైదరాబాద్‌లో లగ్జరీ విల్లాలు',
    'villas in hyderabad': 'హైదరాబాద్‌లో విల్లాలు',
    'plots in lemur': 'లెమూర్‌లో ప్లాట్లు',
    'apartments in kokapet': 'కోకాపేటలో అపార్ట్మెంట్లు',
    'properties in tellapur': 'తెల్లాపూర్‌లో ప్రాపర్టీలు'
  };

  // Tamil instant dictionary
  const taMap: Record<string, string> = {
    'what services provide opv': 'OPV என்ன சேவைகளை வழங்குகிறது?',
    'what services provide opv?': 'OPV என்ன சேவைகளை வழங்குகிறது?',
    'what services does opv provide': 'OPV என்ன சேவைகளை வழங்குகிறது?',
    'what services does opv provide?': 'OPV என்ன சேவைகளை வழங்குகிறது?',
    'what is opv': 'OPV என்றால் என்ன?',
    'what is opv?': 'OPV என்றால் என்ன?',
    'what is rera': 'RERA என்றால் என்ன?',
    'what is rera?': 'RERA என்றால் என்ன?',
    'what is hmda': 'HMDA என்றால் என்ன?',
    'what is hmda?': 'HMDA என்றால் என்ன?'
  };

  // Hindi instant dictionary
  const hiMap: Record<string, string> = {
    'what services provide opv': 'OPV क्या सेवाएं प्रदान करता है?',
    'what services provide opv?': 'OPV क्या सेवाएं प्रदान करता है?',
    'what services does opv provide': 'OPV क्या सेवाएं प्रदान करता है?',
    'what services does opv provide?': 'OPV क्या सेवाएं प्रदान करता है?',
    'what is opv': 'OPV क्या है?',
    'what is opv?': 'OPV क्या है?',
    'what is rera': 'RERA क्या है?',
    'what is rera?': 'RERA क्या है?',
    'what is hmda': 'HMDA क्या है?',
    'what is hmda?': 'HMDA क्या है?'
  };

  if (language === 'te' && teMap[q]) return teMap[q];
  if (language === 'ta' && taMap[q]) return taMap[q];
  if (language === 'hi' && hiMap[q]) return hiMap[q];

  return null;
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
function buildPropertySearchIntro(query: string, properties: PropertyItem[], language: LanguageCode = 'en'): string {
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
    if (approvalLine) locLines.push(approvalLine.replace('**Approval:**', `**${localized.approvalLabel}:**`));
    if (budgetLine) locLines.push(budgetLine.replace('**Budget:**', `**${localized.budgetLabel}:**`));
    if (bhkLine) locLines.push(bhkLine);
    if (facingLine) locLines.push(facingLine);
    locLines.push(`**${localized.projectsFoundLabel}:** ${properties.length}`);

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
        let infoIntro = `Here is the latest project information for **${proj.title}** from our database:`;
        if (language === 'te') {
          infoIntro = `మా డేటాబేస్ నుండి **${proj.title}** గురించిన తాజా ప్రాజెక్ట్ సమాచారం ఇక్కడ ఉంది:`;
        } else if (language === 'ta') {
          infoIntro = `எங்கள் தரவுத்தளத்திலிருந்து **${proj.title}** பற்றிய சமீபத்திய திட்டத் தகவல் இதோ:`;
        } else if (language === 'hi') {
          infoIntro = `हमारे डेटाबेस से **${proj.title}** की नवीनतम प्रोजेक्ट जानकारी यहाँ है:`;
        } else if (language === 'kn') {
          infoIntro = `ನಮ್ಮ ಡೇಟಾಬೇಸ್‌ನಿಂದ **${proj.title}** ಕುರಿತ ಇತ್ತೀಚಿನ ಯೋಜನೆಯ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ:`;
        }
        return {
          content: infoIntro,
          properties: liveMatches,
          actions: getStandardActions(`Hello OPV, I am inquiring about ${proj.title}`),
          category: proj.type === 'plot' ? 'plots' : 'villas'
        };
      }

      const intro = buildPropertySearchIntro(rawQuery, liveMatches, language);
      return {
        content: intro,
        properties: liveMatches,
        actions: getStandardActions('Hello OPV, I am interested in these property listings'),
        category: liveMatches[0].type === 'plot' ? 'plots' : 'villas'
      };
    }

    // 4. IF PROPERTY SEARCH / PROJECT QUERY HAS NO MATCHES IN SUPABASE
    let notFoundMsg = `I don't have that property or project listed in our database right now. I can connect you with an OPV property advisor.`;
    if (language === 'te') {
      notFoundMsg = `ప్రస్తుతం మా డేటాబేస్‌లో ఆ ప్రాపర్టీ లేదా ప్రాజెక్ట్ వివరాలు లేవు. నేను మిమ్మల్ని OPV ప్రాపర్టీ సలహాదారుతో కనెక్ట్ చేయగలను.`;
    } else if (language === 'ta') {
      notFoundMsg = `தற்போது எங்கள் தரவுத்தளத்தில் அந்த சொத்து அல்லது திட்டம் பட்டியலிடப்படவில்லை. நான் உங்களை ஒரு OPV ஆலோசகருடன் இணைக்க முடியும்.`;
    } else if (language === 'hi') {
      notFoundMsg = `वर्तमान में हमारे डेटाबेस में वह संपत्ति या प्रोजेक्ट सूचीबद्ध नहीं है। मैं आपको एक OPV संपत्ति सलाहकार से जोड़ सकता हूँ।`;
    }
    return {
      content: notFoundMsg,
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
          category: data.category || 'general',
          translatedUserPrompt: data.translatedUserPrompt
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/chat unreachable, falling back to local database search:', err);
  }

  // Graceful fallback to local Supabase search with quick local translation
  const localRes = processChatQuery(rawQuery, language);
  return {
    ...localRes,
    translatedUserPrompt: getQuickTranslation(rawQuery, language) || undefined
  };
}

