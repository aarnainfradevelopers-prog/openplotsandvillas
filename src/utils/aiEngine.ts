import { OPV_COMPANY_PROFILE, OPV_LANGUAGES } from '../data/opvKnowledge';
import { ActionLink, LanguageCode } from '../types/chat';

export interface AIResponse {
  content: string;
  actions?: ActionLink[];
  category?: string;
}

// Localized response templates for the 13 target languages
const LOCALIZED_SNIPPETS: Record<LanguageCode, {
  contactIntro: string;
  servicesIntro: string;
  plotsIntro: string;
  villasIntro: string;
  loansIntro: string;
  legalIntro: string;
  poojaIntro: string;
  gruhapravesamIntro: string;
  nriIntro: string;
  appIntro: string;
  defaultHelp: string;
}> = {
  en: {
    contactIntro: 'Here is how you can directly connect with Open Plots & Villas headquarters:',
    servicesIntro: '### 🌟 OPV 360° Elite Services\n*From Land Acquisition, Bhoomi Pooja to Gruhapravesam — End-to-End Property Solutions*',
    plotsIntro: '### 🏡 Open Plots & Land Investments in Hyderabad\nOpen Plots & Villas offers 100% verified, clear-title open plots with HMDA, DTCP, and RERA approvals.',
    villasIntro: '### 🏰 Luxury Villas & Gated Communities\nExplore ultra-luxury villas and independent houses in Hyderabad’s prime corridors.',
    loansIntro: '### 🏦 Home Loans & Property Financing\nOPV connects you with India’s leading financial institutions (SBI, HDFC, ICICI, Axis, LIC HFL).',
    legalIntro: '### ⚖️ Legal Verification & Title Clearance\nDon’t risk your life savings. OPV provides exhaustive legal due diligence before you buy.',
    poojaIntro: '### 🪔 Bhoomi Pooja Ceremony Services\nBegin your construction on an auspicious note with traditional Vedic rituals arranged by OPV.',
    gruhapravesamIntro: '### 🏠 Gruhapravesam (House Warming) Services\nCelebrate moving into your dream home with hassle-free Vedic ceremony arrangements.',
    nriIntro: '### 🌐 NRI Property Advisory Desk\nComplete remote property acquisition and asset management tailored for Non-Resident Indians.',
    appIntro: '### 📱 Open Plots Mobile App & Referral Rewards\nExperience India’s first AI-powered real estate platform right from your pocket!',
    defaultHelp: 'I am your Open Plots & Villas AI assistant. You can ask me about verified plots, luxury villas, 360° Elite Services, home loans, or property legal checks.'
  },
  hi: {
    contactIntro: 'ओपन प्लॉट्स एंड विला (OPV) मुख्यालय से सीधे संपर्क करने की जानकारी:',
    servicesIntro: '### 🌟 OPV 360° एलीट सेवाएं\n*जमीन खरीद, भूमि पूजन से लेकर गृहप्रवेश तक — संपूर्ण रियल एस्टेट समाधान*',
    plotsIntro: '### 🏡 हैदराबाद और शादनगर में ओपन प्लॉट्स\nOPV पर HMDA, DTCP और RERA स्वीकृत 100% सत्यापित प्लॉट्स उपलब्ध हैं।',
    villasIntro: '### 🏰 लक्ज़री विला और गेटेड कम्युनिटीज\nहैदराबाद के प्रमुख इलाकों में शानदार स्वतंत्र विला और प्रीमियम टाउनशिप।',
    loansIntro: '### 🏦 होम लोन एवं प्रॉपर्टी फाइनेंस सहायता\nOPV आपको SBI, HDFC, ICICI, Axis जैसे प्रमुख बैंकों से सबसे कम ब्याज दर पर लोन दिलाता है।',
    legalIntro: '### ⚖️ कानूनी सत्यापन और टाइटल क्लीयरेंस\n30 वर्षों के लिंक दस्तावेज़, एन्कम्ब्रेंस सर्टिफिकेट (EC) और म्यूटेशन की विस्तृत जांच।',
    poojaIntro: '### 🪔 भूमि पूजन समारोह सेवाएं\nशुभ मुहूर्त में वैदिक पंडितों और संपूर्ण पूजन सामग्री के साथ भूमि पूजन।',
    gruhapravesamIntro: '### 🏠 गृहप्रवेश सेवाएं\nगो-पूजा, गणपति होमम और मांगलिक अनुष्ठान की संपूर्ण व्यवस्था।',
    nriIntro: '### 🌐 एनआरआई (NRI) संपत्ति निवेश सहायता\nप्रवासियों के लिए वीडियो टूर, कानूनी जांच और रिमोट प्रॉपर्टी मैनेजमेंट।',
    appIntro: '### 📱 OPV मोबाइल ऐप और रेफरल पुरस्कार\nऐप डाउनलोड करें और दोस्तों को रेफर करके उपहार हैंपर्स एवं गोल्ड वाउचर जीतें!',
    defaultHelp: 'मैं ओपन प्लॉट्स एंड विला का AI सहायक हूँ। आप मुझसे हैदराबाद में प्लॉट्स, विला, होम लोन, कानूनी जांच और 360° सेवाओं के बारे में पूछ सकते हैं।'
  },
  te: {
    contactIntro: 'ఓపెన్ ప్లాట్స్ & విల్లాస్ (OPV) హెడ్‌క్వార్టర్స్‌ను సంప్రదించే వివరాలు:',
    servicesIntro: '### 🌟 OPV 360° ఎలైట్ సర్వీసెస్\n*భూమి కొనుగోలు, భూమి పూజ నుండి గృహప్రవేశం వరకు — సంపూర్ణ ప్రాపర్టీ పరిష్కారాలు*',
    plotsIntro: '### 🏡 హైదరాబాద్ & షాద్‌నగర్‌లో ఓపెన్ ప్లాట్లు\nHMDA, DTCP మరియు RERA అనుమతులు కలిగిన 100% వెరిఫైడ్ ఓపెన్ ప్లాట్లు.',
    villasIntro: '### 🏰 లగ్జరీ విల్లాలు & గేటెడ్ కమ్యూనిటీలు\nగచ్చిబౌలి, కోకాపేట్, తెల్లాపూర్ వంటి ప్రముఖ ప్రాంతాలలో ప్రీమియం విల్లాలు.',
    loansIntro: '### 🏦 హోమ్ లోన్ & ఫైనాన్స్ సహాయం\nSBI, HDFC, ICICI, యాక్సిస్ బ్యాంకుల నుండి సులభమైన గృహ రుణాలు మరియు ఫాస్ట్ అప్రూవల్.',
    legalIntro: '### ⚖️ లీగల్ వెరిఫికేషన్ & ఈసీ (EC) చెకింగ్\n30 సంవత్సరాల లింక్ డాక్యుమెంట్లు, ధరణి పోర్టల్ మరియు రిజిస్ట్రేషన్ పక్కాగా చెక్ చేస్తాము.',
    poojaIntro: '### 🪔 భూమి పూజ సేవలు\nవేద పండితులు, సంప్రదాయ పూజా సామగ్రితో శుభ ముహూర్తంలో భూమి పూజ నిర్వహణ.',
    gruhapravesamIntro: '### 🏠 గృహప్రవేశం సేవలు\nగో పూజ, గణపతి హోమం మరియు విందు ఏర్పాట్లతో పరిపూర్ణ గృహప్రవేశ సేవలు.',
    nriIntro: '### 🌐 ఎన్నారై (NRI) ఇన్వెస్ట్‌మెంట్ డెస్క్\nవిదేశాల్లో ఉన్న తెలుగు వారి కోసం వీడియో టూర్స్, లీగల్ వెరిఫికేషన్ మరియు ప్రాపర్టీ మేనేజ్‌మెంట్.',
    appIntro: '### 📱 OPV మొబైల్ యాప్ & రిఫెరల్ రివార్డులు\nయాప్ డౌన్‌లోడ్ చేసుకోండి, మీ మిత్రులను రిఫర్ చేసి గోల్డ్, గిఫ్ట్ వోచర్లు గెలుచుకోండి!',
    defaultHelp: 'నేను ఓపెన్ ప్లాట్స్ & విల్లాస్ AI అసిస్టెంట్‌ని. ప్లాట్లు, విల్లాలు, హోమ్ లోన్లు లేదా 360° సర్వీసుల గురించి అడగండి.'
  },
  ta: {
    contactIntro: 'ஓபன் பிளாட்ஸ் & வில்லாஸ் நிறுவனத்தைத் தொடர்பு கொள்ளும் விவரங்கள்:',
    servicesIntro: '### 🌟 OPV 360° எலைட் சேவைகள்\n*நிலம் வாங்குவது, பூமி பூஜை முதல் கிரகப்பிரவேசம் வரை முழுமையான சேவைகள்*',
    plotsIntro: '### 🏡 ஹைதராபாத்தில் அங்கீகரிக்கப்பட்ட பிளாட்டுகள்\nHMDA, DTCP மற்றும் RERA ஒப்புதல் பெற்ற சிறந்த மனைகள்.',
    villasIntro: '### 🏰 சொகுசு வில்லாக்கள் மற்றும் வீடுகள்\nஹைதராபாத்தில் அதிநவீன வசதிகளுடன் கூடிய தனித்துவமான வில்லாக்கள்.',
    loansIntro: '### 🏦 வீட்டுக் கடன் மற்றும் நிதி உதவி\nகுறைந்த வட்டி விகிதத்தில் முன்னணி வங்கிகளில் உடனடி வீட்டுக் கடன் உதவி.',
    legalIntro: '### ⚖️ சட்ட சரிபார்ப்பு மற்றும் EC ஆய்வு\n30 ஆண்டுகால ஆவணங்கள் மற்றும் வில்லங்கச் சான்றிதழ் முழுமையான சட்டப் பரிசோதனை.',
    poojaIntro: '### 🪔 பூமி பூஜை சேவைகள்\nசுப முகூர்த்தத்தில் பாரம்பரிய முறைப்படி முழுமையான பூமி பூஜை ஏற்பாடுகள்.',
    gruhapravesamIntro: '### 🏠 கிரகப்பிரவேச சேவைகள்\nபசு பூஜை, கணபதி ஹோமம் மற்றும் சுப காரியங்களுக்கான பூரண வழிகாட்டுதல்.',
    nriIntro: '### 🌐 வெளிநாட்டு வாழ் இந்தியர் (NRI) சேவை\nவெளிநாட்டில் இருந்தபடியே பாதுகாப்பான சொத்து முதலீடு மற்றும் மேலாண்மை.',
    appIntro: '### 📱 OPV மொபைல் செயலி மற்றும் வெகுமதிகள்\nசெயலியைப் பதிவிறக்கி நண்பர்களுக்குப் பரிந்துரை செய்து பரிசுகளை வெல்லுங்கள்!',
    defaultHelp: 'நான் உங்கள் OPV AI உதவியாளர். ஹைதராபாத் பிளாட்டுகள், வில்லாக்கள் மற்றும் ரியல் எஸ்டேட் சேவைகள் குறித்து கேளுங்கள்.'
  },
  kn: {
    contactIntro: 'ಓಪನ್ ಪ್ಲಾಟ್ಸ್ & ವಿಲ್ಲಾಸ್ ಮುಖ್ಯ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸುವ ವಿವರಗಳು:',
    servicesIntro: '### 🌟 OPV 360° ಎಲೈಟ್ ಸೇವೆಗಳು\n*ಭೂಮಿ ಖರೀದಿ, ಭೂಮಿ ಪೂಜೆಯಿಂದ ಗೃಹಪ್ರವೇಶದವರೆಗೆ ಸಂಪೂರ್ಣ ಪರಿಹಾರಗಳು*',
    plotsIntro: '### 🏡 ಹೈದರಾಬಾದ್‌ನಲ್ಲಿ ಓಪನ್ ಪ್ಲಾಟ್‌ಗಳು\nHMDA, DTCP ಮತ್ತು RERA ಅನುಮೋದಿತ 100% ಪರಿಶೀಲಿಸಿದ ಪ್ಲಾಟ್‌ಗಳು.',
    villasIntro: '### 🏰 ಐಷಾರಾಮಿ ವಿಲ್ಲಾಗಳು ಮತ್ತು ಮನೆಗಳು\nಸುರಕ್ಷಿತ ಗೇಟೆಡ್ ಕಮ್ಯುನಿಟಿಗಳಲ್ಲಿ ವಿಶ್ವದರ್ಜೆಯ ವಿಲ್ಲಾಗಳು.',
    loansIntro: '### 🏦 ಗೃಹ ಸಾಲ ಮತ್ತು ಆರ್ಥಿಕ ನೆರವು\nಪ್ರಮುಖ ಬ್ಯಾಂಕುಗಳಿಂದ ಸುಲಭ ಕಂತುಗಳಲ್ಲಿ ತ್ವರಿತ ಗೃಹ ಸಾಲ ಸೌಲಭ್ಯ.',
    legalIntro: '### ⚖️ ಕಾನೂನು ಪರಿಶೀಲನೆ ಮತ್ತು EC ವಿವರ\n30 ವರ್ಷಗಳ ಹಳೆಯ ದಾಖಲೆಗಳು ಮತ್ತು EC ಯ ನಿಖರ ಪರಿಶೀಲನೆ.',
    poojaIntro: '### 🪔 ಭೂಮಿ ಪೂಜೆ ಸೇವೆಗಳು\nವೇದ ಪಂಡಿತರೊಂದಿಗೆ ಶುಭ ಮುಹೂರ್ತದಲ್ಲಿ ಶ್ರದ್ಧಾಭಕ್ತಿಯಿಂದ ಭೂಮಿ ಪೂಜೆ.',
    gruhapravesamIntro: '### 🏠 ಗೃಹಪ್ರವೇಶ ಸೇವೆಗಳು\nಗೋ ಪೂಜೆ, ಗಣಪತಿ ಹೋಮ ಸಹಿತ ಸಂಪೂರ್ಣ ಗೃಹಪ್ರವೇಶ ಆಯೋಜನೆ.',
    nriIntro: '### 🌐 ಎನ್‌ಆರ್‌ಐ (NRI) ಆಸ್ತಿ ಮಾರ್ಗದರ್ಶನ\nಪ್ರವಾಸಿ ಭಾರತೀಯರಿಗೆ ಡಿಜಿಟಲ್ ಟೂರ್ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಕಾನೂನು ರಕ್ಷಣೆ.',
    appIntro: '### 📱 OPV ಮೊಬೈಲ್ ಆಪ್ ಮತ್ತು ಬಹುಮಾನಗಳು\nಆಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ರೆಫರಲ್ ಮೂಲಕ ಆಕರ್ಷಕ ಉಡುಗೊರೆಗಳನ್ನು ಗೆಲ್ಲಿರಿ!',
    defaultHelp: 'ನಾನು ಓಪನ್ ಪ್ಲಾಟ್ಸ್ & ವಿಲ್ಲಾಸ್ AI ಸಹಾಯಕ. ಪ್ಲಾಟ್‌ಗಳು, ವಿಲ್ಲಾಗಳು ಮತ್ತು 360° ಸೇವೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.'
  },
  ml: {
    contactIntro: 'ഓപ്പൺ പ്ലോട്ട്സ് & വില്ലാസ് ഹെഡ്ക്വാർട്ടേഴ്സുമായി ബന്ധപ്പെടാൻ:',
    servicesIntro: '### 🌟 OPV 360° എലൈറ്റ് സേവനങ്ങൾ\n*ഭൂമി വാങ്ങൽ, ഭൂമി പൂജ മുതൽ ഗൃഹപ്രവേശം വരെ സമഗ്ര സേവനങ്ങൾ*',
    plotsIntro: '### 🏡 ഹൈദരാബാദിലെ അംഗീകൃത പ്ലോട്ടുകൾ\nHMDA, DTCP, RERA അംഗീകാരമുള്ള സുരക്ഷിതമായ ഓപ്പൺ പ്ലോട്ടുകൾ.',
    villasIntro: '### 🏰 ലക്ഷ്വറി വില്ലകളും സ്വതന്ത്ര വീടുകളും\nപ്രീമിയം ലൊക്കേഷനുകളിൽ അത്യാധുനിക സൗകര്യങ്ങളുള്ള വില്ലകൾ.',
    loansIntro: '### 🏦 ഭവന വായ്പ സഹായം\nപ്രമുഖ ബാങ്കുകളിൽ നിന്ന് കുറഞ്ഞ പലിശയിൽ ഭവന വായ്പ സൗകര്യം.',
    legalIntro: '### ⚖️ ലീഗൽ വെരിഫിക്കേഷൻ & EC പരിശോധന\n30 വർഷത്തെ രേഖകളുടെ സൂക്ഷ്മ പരിശോധനയും വ്യക്തമായ ഉടമസ്ഥാവകാശ ഉറപ്പും.',
    poojaIntro: '### 🪔 ഭൂമി പൂജ സേവനങ്ങൾ\nവിദഗ്ദ്ധരായ പുരോഹിതരുടെ നേതൃത്വത്തിൽ ശുഭമുഹൂർത്തത്തിൽ ഭൂമി പൂജ.',
    gruhapravesamIntro: '### 🏠 ഗൃഹപ്രവേശം ചടങ്ങുകൾ\nഗണപതി ഹോമം, പൂജാ ദ്രവ്യങ്ങൾ എന്നിവയോടെ ഗൃഹപ്രവേശം സംഘടിപ്പിക്കുന്നു.',
    nriIntro: '### 🌐 എൻആർഐ (NRI) പ്രോപ്പർട്ടി സഹായം\nപ്രവാസികൾക്ക് ഹൈദരാബാദിൽ വിശ്വസനീയമായ റിയൽ എസ്റ്റേറ്റ് നിക്ഷേപം.',
    appIntro: '### 📱 OPV മൊബൈൽ ആപ്പും സമ്മാനങ്ങളും\nആപ്പ് ഡൗൺലോഡ് ചെയ്യുക, സുഹൃത്തുക്കളെ റഫർ ചെയ്ത് സമ്മാനങ്ങൾ നേടുക!',
    defaultHelp: 'ഞാൻ ഓപ്പൺ പ്ലോട്ട്സ് & വില്ലാസ് AI അസിസ്റ്റൻ്റാണ്. നിങ്ങൾക്ക് എന്ത് വിവരങ്ങളാണ് അറിയേണ്ടത്?'
  },
  mr: {
    contactIntro: 'ओपन प्लॉट्स अँड व्हिलाज (OPV) मुख्यालयाशी थेट संपर्क माहिती:',
    servicesIntro: '### 🌟 OPV 360° एलिट सेवा\n*जमीन खरेदी, भूमी पूजनापासून ते गृहप्रवेशापर्यंत सर्वसमावेशक सेवा*',
    plotsIntro: '### 🏡 हैदराबाद व शादनगरमध्ये प्लॉट्स\nHMDA, DTCP आणि RERA मान्यताप्राप्त सुरक्षित व खात्रीशीर ओपन प्लॉट्स.',
    villasIntro: '### 🏰 लक्झरी व्हिला आणि स्वतंत्र घरे\nआधुनिक सोयीसुविधांनी युक्त गेटेड कम्युनिटी व्हिला प्रकल्प.',
    loansIntro: '### 🏦 गृहकर्ज व आर्थिक सहाय्य\nSBI, HDFC, ICICI सारख्या नामांकित बँकांमधून सुलभ गृहकर्ज मंजुरी.',
    legalIntro: '### ⚖️ कायदेशीर तपासणी आणि EC तपासणी\n३० वर्षांचे जुने कागदपत्रे आणि भारमुक्त प्रमाणपत्र (EC) तपासणी.',
    poojaIntro: '### 🪔 भूमी पूजन विधी सेवा\nशुभ मुहूर्तावर वैदिक ब्राह्मणांद्वारे संपूर्ण साहित्यासह भूमी पूजन.',
    gruhapravesamIntro: '### 🏠 गृहप्रवेश सेवा\nगोपूजा, गणपती होम आणि पारंपरिक विधींची परिपूर्ण व्यवस्था.',
    nriIntro: '### 🌐 अनिवासी भारतीय (NRI) गुंतवणूक सेवा\nपरदेशात राहणाऱ्या भारतीयांसाठी हैदराबादमध्ये पारदर्शक मालमत्ता व्यवस्थापन.',
    appIntro: '### 📱 OPV मोबाईल ॲप आणि बक्षिसे\nॲप डाऊनलोड करा आणि रेफरलद्वारे सुवर्ण व आकर्षक भेटवस्तू जिंका!',
    defaultHelp: 'मी ओपन प्लॉट्स अँड व्हिलाज AI सहाय्यक आहे. प्लॉट्स, व्हिला किंवा कायदेशीर सेवांबद्दल विचारा.'
  },
  bn: {
    contactIntro: 'ওপেন প্লটস অ্যান্ড ভিলাস প্রধান কার্যালয়ের সাথে যোগাযোগের বিশদ:',
    servicesIntro: '### 🌟 OPV 360° এলিট পরিষেবা\n*জমি কেনা, ভূমি পূজা থেকে শুরু করে গৃহপ্রবেশ পর্যন্ত সম্পূর্ণ প্রপার্টি সলিউশন*',
    plotsIntro: '### 🏡 হায়দ্রাবাদে ওপেন প্লট ও জমি বিনিয়োগ\nHMDA, DTCP এবং RERA অনুমোদিত ১০০% যাচাইকৃত প্লট।',
    villasIntro: '### 🏰 বিলাসবহুল ভিলা এবং আবাসন\nসেরা এলাকায় আধুনিক সুযোগ-সুবিধা সম্বলিত প্রিমিয়াম ভিলা।',
    loansIntro: '### 🏦 হোম লোন এবং প্রপার্টি ফিনান্স\nশীর্ষস্থানীয় ব্যাংকগুলি থেকে সহজে ও কম সুদে গৃহঋণ সহায়তা।',
    legalIntro: '### ⚖️ আইনি যাচাইকরণ এবং EC পরীক্ষণ\n৩০ বছরের নথিপত্র এবং নির্ঝঞ্ঝাট স্বত্ব যাচাইয়ের সম্পূর্ণ আইনি সেবা।',
    poojaIntro: '### 🪔 ভূমি পূজা পরিষেবা\nশুভ মুহূর্তে শাস্ত্রীয় রীতি মেনে সার্বিক ভূমি পূজা ব্যবস্থাপনা।',
    gruhapravesamIntro: '### 🏠 গৃহপ্রবেশ পরিষেবা\nগো-পূজা, গণপতি হোম ও আনন্দময় গৃহপ্রবেশ অনুষ্ঠান আয়োজন।',
    nriIntro: '### 🌐 অনাবাসী ভারতীয়দের (NRI) জন্য বিশেষ সেবা\nরিমোট ভিডিও ট্যুর, আইনি প্রক্রিয়া এবং নির্ভরযোগ্য প্রপার্টি ব্যবস্থাপনা।',
    appIntro: '### 📱 OPV মোবাইল অ্যাপ ও রিওয়ার্ডস\nঅ্যাপ ডাউনলোড করে বন্ধু ও পরিচিতদের রেফার করে উপহার জিতে নিন!',
    defaultHelp: 'আমি ওপেন প্লটস অ্যান্ড ভিলাসের AI সহকারী। আপনি আমাকে যে কোনো প্রপার্টি সম্পর্কিত তথ্য জিজ্ঞাসা করতে পারেন।'
  },
  gu: {
    contactIntro: 'ઓપન પ્લોટ્સ એન્ડ વિલાસ (OPV) ના મુખ્ય કાર્યાલયનો સીધો સંપર્ક:',
    servicesIntro: '### 🌟 OPV 360° એલિટ સેવાઓ\n*જમીન ખરીદી, ભૂમિ પૂજનથી લઈને ગૃહપ્રવેશ સુધીની તમામ સેવાઓ*',
    plotsIntro: '### 🏡 હૈદરાબાદ અને શાદનગરમાં ઓપન પ્લોટ્સ\nHMDA, DTCP અને RERA માન્ય ૧૦૦% ચકાસાયેલા સુરક્ષિત પ્લોટ્સ.',
    villasIntro: '### 🏰 લક્ઝરી વિલા અને ગેટ્ડ હાઉસિંગ\nવિશ્વસ્તરીય ક્લબહાઉસ અને સિક્યોરિટી સાથેના ભવ્ય વિલા.',
    loansIntro: '### 🏦 હોમ લોન અને ફાયનાન્સ સહાય\nSBI, HDFC જેવી બેંકોમાંથી ન્યૂનતમ વ્યાજદરે ઝડપી હોમ લોન.',
    legalIntro: '### ⚖️ કાનૂની ચકાસણી અને EC ની તપાસ\n૩૦ વર્ષના લિંક દસ્તાવેજો અને એન્કમ્બ્રન્સ સર્ટિફિકેટની સંપૂર્ણ ચકાસણી.',
    poojaIntro: '### 🪔 ભૂમિ પૂજન સેવાઓ\nવેદિક બ્રાહ્મણો અને પૂજા સામગ્રી સાથે શુભ મુહૂર્તમાં ભૂમિ પૂજન.',
    gruhapravesamIntro: '### 🏠 ગૃહપ્રવેશ સેવાઓ\nગૌ પૂજા, ગણેશ પૂજન સાથે સુખદ ગૃહપ્રવેશનું આયોજન.',
    nriIntro: '### 🌐 NRI રિયલ એસ્ટેટ સહાય\nવિદેશમાં રહેતા ભારતીયો માટે ડિજિટલ નિરીક્ષણ અને સુરક્ષિત ખરીદી.',
    appIntro: '### 📱 OPV મોબાઈલ એપ અને રિવાર્ડ્સ\nએપ ડાઉનલોડ કરો અને રેફરલથી સોનું અને ગિફ્ટ વાઉચર્સ મેળવો!',
    defaultHelp: 'હું ઓપન પ્લોટ્સ એન્ડ વિલાસ AI સહાયક છું. પ્લોટ્સ, વિલા અને 360° સેવાઓ વિશે મને પૂછો.'
  },
  ur: {
    contactIntro: 'اوپن پلاٹس اینڈ ولاز (OPV) کے مرکزی دفتر سے رابطہ کی تفصیلات:',
    servicesIntro: '### 🌟 OPV 360° ایلیٹ سروسز\n*زمین کی خریداری، بھومی پوجا سے لے کر گرہ پرویش تک مکمل پراپرٹی حل*',
    plotsIntro: '### 🏡 حیدرآباد اور شادنگر میں تصدیق شدہ پلاٹس\nHMDA، DTCP اور RERA سے منظور شدہ 100% قانونی پلاٹس۔',
    villasIntro: '### 🏰 لگژری ولاز اور گیٹڈ کمیونٹیز\nحیدرآباد کے بہترین علاقوں میں اعلیٰ سہولیات کے حامل ولاز۔',
    loansIntro: '### 🏦 ہوم لون اور فنانسنگ کی سہولت\nاہم بینکوں سے کم ترین شرح سود پر فوری ہوم لون کی فراہمی۔',
    legalIntro: '### ⚖️ قانونی تصدیق اور ٹائٹل کلیئرنس\n30 سالہ دستاویزات، انکمبرنس سرٹیفکیٹ (EC) اور میوٹیشن کی مکمل جانچ۔',
    poojaIntro: '### 🪔 بھومی پوجا کی تقریب\nتعمیر کے آغاز پر روایتی اور مناسب انتظامات کی مکمل سہولت۔',
    gruhapravesamIntro: '### 🏠 گرہ پرویش اور گھر میں منتقلی کے انتظامات\nنئے گھر میں داخلے کے لیے روایتی اور پروقار تقریب کی تیاری۔',
    nriIntro: '### 🌐 این آر آئی (NRI) پراپرٹی رہنمائی\nبیرون ملک مقیم ہندوستانیوں کے لیے آن لائن معائنہ اور قانونی معاونت۔',
    appIntro: '### 📱 OPV موبائل ایپ اور پرکشش انعامات\nایپ ڈاؤن لوڈ کریں اور دوستوں کو ریفر کر کے انعامات جیتیں!',
    defaultHelp: 'میں اوپن پلاٹس اینڈ ولاز کا AI اسسٹنٹ ہوں۔ پلاٹس، ولاز یا سروسز سے متعلق سوالات پوچھیں۔'
  },
  pa: {
    contactIntro: 'ਓਪਨ ਪਲਾਟਸ ਐਂਡ ਵਿਲਾਸ (OPV) ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰਨ ਦੇ ਵੇਰਵੇ:',
    servicesIntro: '### 🌟 OPV 360° ਐਲੀਟ ਸੇਵਾਵਾਂ\n*ਜ਼ਮੀਨ ਖਰੀਦਣ ਤੋਂ ਲੈ ਕੇ ਭੂਮੀ ਪੂਜਾ ਅਤੇ ਗ੍ਰਹਿ ਪ੍ਰਵੇਸ਼ ਤੱਕ ਸਭ ਕੁਝ ਇਕੋ ਥਾਂ*',
    plotsIntro: '### 🏡 ਹੈਦਰਾਬਾਦ ਵਿੱਚ ਪ੍ਰਵਾਨਿਤ ਓਪਨ ਪਲਾਟ\nHMDA, DTCP ਅਤੇ RERA ਤੋਂ ਪ੍ਰਮਾਣਿਤ ਪਲਾਟ ਨਿਵੇਸ਼ ਲਈ ਉਪਲਬਧ ਹਨ।',
    villasIntro: '### 🏰 ਲਗਜ਼ਰੀ ਵਿਲਾ ਅਤੇ ਆਲੀਸ਼ਾਨ ਘਰ\nਹੈਦਰਾਬਾਦ ਦੇ ਪ੍ਰਮੁੱਖ ਇਲਾਕਿਆਂ ਵਿੱਚ ਸੁੰਦਰ ਅਤੇ ਆਧੁਨਿਕ ਵਿਲਾ।',
    loansIntro: '### 🏦 ਹੋਮ ਲੋਨ ਅਤੇ ਵਿੱਤੀ ਸਹਾਇਤਾ\nਵੱਡੇ ਬੈਂਕਾਂ ਤੋਂ ਆਸਾਨ ਕਿਸ਼ਤਾਂ ਅਤੇ ਘੱਟ ਵਿਆਜ ਤੇ ਹੋਮ ਲੋਨ ਸਹਾਇਤਾ।',
    legalIntro: '### ⚖️ ਕਾਨੂੰਨੀ ਤਸਦੀਕ ਅਤੇ EC ਵੇਰਵੇ\n30 ਸਾਲਾਂ ਦੇ ਪੁਰਾਣੇ ਦਸਤਾਵੇਜ਼ਾਂ ਅਤੇ ਕਾਨੂੰਨੀ ਮਲਕੀਅਤ ਦੀ ਪੂਰੀ ਜਾਂਚ।',
    poojaIntro: '### 🪔 ਭੂਮੀ ਪੂਜਾ ਸਮਾਰੋਹ\nਸ਼ੁਭ ਮਹੂਰਤ ਤੇ ਵੈਦਿਕ ਰੀਤੀ-ਰਿਵਾਜਾਂ ਨਾਲ ਭੂਮੀ ਪੂਜਾ ਦੇ ਪੂਰੇ ਪ੍ਰਬੰਧ।',
    gruhapravesamIntro: '### 🏠 ਗ੍ਰਹਿ ਪ੍ਰਵੇਸ਼ ਸੇਵਾਵਾਂ\nਨਵੇਂ ਘਰ ਵਿੱਚ ਪ੍ਰਵੇਸ਼ ਕਰਨ ਵੇਲੇ ਧਾਰਮਿਕ ਕਾਰਜਾਂ ਦਾ ਸੰਪੂਰਨ ਪ੍ਰਬੰਧ।',
    nriIntro: '### 🌐 ਐਨਆਰਆਈ (NRI) ਨਿਵੇਸ਼ਕਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਡੈਸਕ\nਵਿਦੇਸ਼ਾਂ ਵਿੱਚ ਬੈਠੇ ਭਾਰਤੀਆਂ ਲਈ ਸੁਰੱਖਿਅਤ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਜਾਇਦਾਦ ਪ੍ਰਬੰਧਨ।',
    appIntro: '### 📱 OPV ਮੋਬਾਈਲ ਐਪ ਅਤੇ ਇਨਾਮ\nਐਪ ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਰੈਫਰਲ ਨਾਲ ਸੋਨੇ ਅਤੇ ਸ਼ਾਨਦਾਰ ਇਨਾਮ ਜਿੱਤੋ!',
    defaultHelp: 'ਮੈਂ ਓਪਨ ਪਲਾਟਸ ਐਂਡ ਵਿਲਾਸ ਦਾ AI ਸਹਾਇਕ ਹਾਂ। ਪਲਾਟਾਂ, ਵਿਲਾ ਅਤੇ ਹੋਰ ਸੇਵਾਵਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਵੋ।'
  },
  or: {
    contactIntro: 'ଓପନ୍ ପ୍ଲଟ୍ସ ଆଣ୍ଡ ଭିଲାସ୍ (OPV) ମୁଖ୍ୟାଳୟ ସହିତ ଯୋଗାଯୋଗ ବିବରଣୀ:',
    servicesIntro: '### 🌟 OPV 360° ଏଲାଇଟ୍ ସେବାଗୁଡ଼ିକ\n*ଜମି କ୍ରୟ, ଭୂମି ପୂଜା ଠାରୁ ଗୃହପ୍ରବେଶ ପର୍ଯ୍ୟନ୍ତ ସମ୍ପୂର୍ଣ୍ଣ ସମାଧାନ*',
    plotsIntro: '### 🏡 ହାଇଦ୍ରାବାଦରେ ଅନୁମୋଦିତ ଓପନ୍ ପ୍ଲଟ୍\nHMDA, DTCP ଏବଂ RERA ଅନୁମୋଦିତ ୧୦୦% ସ୍ଵଚ୍ଛ କାଗଜପତ୍ର ଥିବା ପ୍ଲଟ୍।',
    villasIntro: '### 🏰 ବିଳାସପୂର୍ଣ୍ଣ ଭିଲା ଏବଂ ସ୍ଵତନ୍ତ୍ର ଗୃହ\nସୁରକ୍ଷିତ ଗେଟେଡ୍ ସୋସାଇଟିରେ ଅତ୍ୟାଧୁନିକ ସୁବିଧା ସହିତ ଭିଲା।',
    loansIntro: '### 🏦 ହୋମ୍ ଲୋନ୍ ଏବଂ ଆର୍ଥିକ ସହାୟତା\nପ୍ରମୁଖ ବ୍ୟାଙ୍କଗୁଡ଼ିକରୁ କମ୍ ସୁଧ ହାରରେ ସହଜ ଗୃହ ଋଣ ସୁବିଧା।',
    legalIntro: '### ⚖️ ଆଇନଗତ ଯାଞ୍ଚ ଏବଂ EC ବିବରଣୀ\n୩୦ ବର୍ଷର ଲିଙ୍କ୍ ଦସ୍ତାବିଜ ଏବଂ ଏନ୍‌କମ୍ବ୍ରାନ୍ସ ସାର୍ଟିଫିକେଟ୍‌ର ଯାଞ୍ଚ।',
    poojaIntro: '### 🪔 ଭୂମି ପୂଜା ସେବା\nଶୁଭ ମୁହୂର୍ତ୍ତରେ ବୈଦିକ ବ୍ରାହ୍ମଣଙ୍କ ଦ୍ୱାରା ନିର୍ମାଣ ଆରମ୍ଭ ପୂଜା।',
    gruhapravesamIntro: '### 🏠 ଗୃହପ୍ରବେଶ ସେବା\nନୂତନ ଗୃହ ପ୍ରବେଶ ସମୟରେ ଗୋ-ପୂଜା ଏବଂ ଶାନ୍ତି ହୋମର ସମ୍ପୂର୍ଣ୍ଣ ଆୟୋଜନ।',
    nriIntro: '### 🌐 ଏନ୍‌ଆର୍‌ଆଇ (NRI) ନିବେଶକଙ୍କ ପାଇଁ ସେବା\nପ୍ରବାସୀ ଭାରତୀୟଙ୍କ ପାଇଁ ଭିଡିଓ ଟୁର୍ ଏବଂ ସୁରକ୍ଷିତ ସମ୍ପତ୍ତି କ୍ରୟ।',
    appIntro: '### 📱 OPV ମୋବାଇଲ୍ ଆପ୍ ଏବଂ ପୁରସ୍କାର\nଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ ଏବଂ ବନ୍ଧୁମାନଙ୍କୁ ରେଫର୍ କରି ସୁନା ଓ ଉପହାର ଜିତନ୍ତୁ!',
    defaultHelp: 'ମୁଁ ଓପନ୍ ପ୍ଲଟ୍ସ ଆଣ୍ଡ ଭିଲାସର AI ସହାୟକ। ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?'
  },
  mwr: {
    contactIntro: 'ओपन प्लॉट्स एंड विलास (OPV) री मुख्य कचेरी रो सीधो राब्तो:',
    servicesIntro: '### 🌟 OPV 360° एलिट सेवावां\n*जमीन मोल लेवण, भूमि पूजन सूं लेय’र गृहप्रवेश तांई सगळा काम*',
    plotsIntro: '### 🏡 हैदराबाद अर शादनगर मांय खुला प्लॉट\nHMDA, DTCP अर RERA सूं पक्का पास १००% साफ-सुथरा प्लॉट।',
    villasIntro: '### 🏰 आलीशान विला अर स्वतंत्र मकान\nबढ़िया सुभीता अर सुरक्षा वाळा शानदार विला।',
    loansIntro: '### 🏦 होम लोन अर रुपिया री मदद\nसरकारी अर प्राइवेट बैंकां सूं सबसूं कम ब्याज मांय तुरंत लोन।',
    legalIntro: '### ⚖️ कानूनी जांच अर रजिस्ट्री री पक्की तसल्ली\n३० बरसां रा पुराना कागजात अर भारमुक्त सर्टिफिकेट (EC) री जांच।',
    poojaIntro: '### 🪔 भूमि पूजन री सेवावां\nचौखा मूरख मांय वैदिक बामणां सूं सगळी पूजन सामग्री सहित भूमि पूजन।',
    gruhapravesamIntro: '### 🏠 गृहप्रवेश री व्यवस्था\nगाय री पूजा, गणपति होम अर जीमण-वार री सगळी व्यवस्था।',
    nriIntro: '### 🌐 परदेसी भायां (NRI) वास्ते निवेश रो भरोसो\nपरदेस मांय बैठ्यां-बैठ्यां मोबाइल सूं जमीन देखण अर लिखा-पढ़ी रो काम।',
    appIntro: '### 📱 OPV मोबाइल ऐप अर ईनाम\nऐप डाउनलोड करो अर भायां ने जोड़’र सोना रा सिक्का अर ईनाम जीतो!',
    defaultHelp: 'म्हैं ओपन प्लॉट्स एंड विलास रो AI साथी हूँ। प्लॉट, विला अर रजिस्ट्री बाबत पूछ सको हो।'
  }
};

export function processChatQuery(
  rawQuery: string,
  language: LanguageCode = 'en'
): AIResponse {
  const query = rawQuery.toLowerCase().trim();
  const snip = LOCALIZED_SNIPPETS[language] || LOCALIZED_SNIPPETS.en;
  const profile = OPV_COMPANY_PROFILE;

  // 0. Primary Feature Chips & Property Searches (Matching Image 2 exact format)
  const isApartmentFeature =
    query.includes('apartments in hyd') ||
    query.includes('apartment') ||
    query.includes('flat') ||
    query.includes('bhk') ||
    query.includes('rent');

  const isPlotFeature =
    query.includes('open plots in lemoor') ||
    query.includes('lemoor') ||
    query.includes('shadnagar') ||
    query.includes('openplot') ||
    (query.includes('plot') && !query.includes('house'));

  const isVillaFeature =
    query.includes('gated luxury villas') ||
    query.includes('villa') ||
    query.includes('gated') ||
    query.includes('mokila') ||
    query.includes('kollur');

  const is360Feature =
    query.includes('360 elite services') ||
    query.includes('360') ||
    query.includes('elite services') ||
    query.includes('construction support');

  if (isApartmentFeature || isPlotFeature || isVillaFeature || is360Feature) {
    return {
      content: `I am your Open Plots & Villas AI assistant. You can ask me about verified plots, luxury villas, 360° Elite Services, home loans, or property legal checks.

**About Open Plots & Villas (OPV):**
Open Plots & Villas is **India’s First AI-Powered Real Estate Platform**, headquartered in **Madhapur, Hyderabad** (#101, Road No: 10, Jaya Kesav Avenue, Kakatiya Hills).

We provide end-to-end solutions:
• **Property Discovery:** Verified Open Plots, Luxury Villas, Apartments, Farmlands, and Commercial spaces.
• **360° Elite Services:** Architectural 3D drawings, Home Loans, GPS Land Survey, Legal title check & EC, Vastu, Bhoomi Pooja ceremony, Gruhapravesam, and Asset protection.

**Direct Support:**
📞 Phone: **${profile.contact.phonePrimary}** | **${profile.contact.phoneSecondary}**  
✉️ Email: **${profile.contact.email}**`,
      actions: [
        { label: '📞 Call Support', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' },
        { label: '💬 WhatsApp Chat', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=Hello%20OPV%2C%20I%20have%20an%20inquiry%20regarding%20properties`, action: 'whatsapp' },
        { label: '🌐 Open Website', url: profile.website, action: 'contact' }
      ],
      category: isApartmentFeature ? 'apartments' : isPlotFeature ? 'plots' : isVillaFeature ? 'villas' : 'services'
    };
  }

  // 1. Contact / Office / Phone / Address / Help desk
  if (
    query.includes('contact') ||
    query.includes('phone') ||
    query.includes('call') ||
    query.includes('number') ||
    query.includes('email') ||
    query.includes('address') ||
    query.includes('office') ||
    query.includes('headquarters') ||
    query.includes('location of office') ||
    query.includes('madhapur') ||
    query.includes('సంప్రదించండి') ||
    query.includes('फ़ोन') ||
    query.includes('नंबर') ||
    query.includes('पता')
  ) {
    return {
      content: `${snip.contactIntro}

🏢 **Head Office Address:**  
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
      actions: [
        { label: '📞 Call Now', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' },
        { label: '💬 WhatsApp Us', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=Hello%20OPV%20Team%2C%20I%20am%20interested%20in%20properties`, action: 'whatsapp' },
        { label: '📍 View Website', url: profile.website, action: 'contact' }
      ],
      category: 'contact'
    };
  }

  // 2. 360° Elite Services
  if (
    query.includes('360') ||
    query.includes('service') ||
    query.includes('elite') ||
    query.includes('end to end') ||
    query.includes('end-to-end') ||
    query.includes('సర్వీసెస్') ||
    query.includes('सेवाएं') ||
    query.includes('சேவைகள்')
  ) {
    const serviceList = profile.eliteServices360
      .map((s, idx) => `${idx + 1}. **${s.title}**\n   • ${s.shortDesc}\n   • *Key Highlights:* ${s.benefits.join(', ')}`)
      .join('\n\n');

    return {
      content: `${snip.servicesIntro}

${serviceList}

> 💡 **Our Core Promise:** From your very first plot inspection through structural design, Vedic ground-breaking (Bhoomi Pooja), bank financing, and Gruhapravesam housewarming, OPV manages every single milestone with trusted expertise.`,
      actions: [
        { label: '📋 Book 360° Consultation', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=I%20want%20to%20know%20more%20about%20OPV%20360%20Elite%20Services`, action: 'whatsapp' },
        { label: '📞 Call OPV Desk', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'services'
    };
  }

  // 3. Home Loan / Finance
  if (
    query.includes('loan') ||
    query.includes('finance') ||
    query.includes('emi') ||
    query.includes('interest rate') ||
    query.includes('sbi') ||
    query.includes('hdfc') ||
    query.includes('రుణం') ||
    query.includes('लोन') ||
    query.includes('கடன்')
  ) {
    const loanSvc = profile.eliteServices360.find(s => s.id === 'loans');
    return {
      content: `${snip.loansIntro}

${loanSvc?.shortDesc}

**Key Benefits of Financing through OPV:**
• **Lowest Interest Rates:** Strategic tie-ups with SBI, HDFC Bank, ICICI Bank, Axis Bank, and LIC HFL.
• **Plot + Construction Composite Loans:** Get funding for both plot purchase and villa construction under a single loan sanction.
• **Instant Pre-Eligibility:** Instant eligibility calculation based on your salary or business ITR.
• **Doorstep Document Collection:** Hassle-free pickup and dedicated banking liaison officer.

> 📝 **Documents Needed:** PAN Card, Aadhaar Card, last 6 months bank statements, 3 months salary slips or 2 years ITR with computation.`,
      actions: [
        { label: '📊 Apply for Loan Assistance', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=I%20need%20Home%20Loan%20assistance%20for%20my%20property`, action: 'loan' },
        { label: '📞 Speak to Loan Advisor', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'loans'
    };
  }

  // 4. Legal / EC / Registration / Mutation / POA
  if (
    query.includes('legal') ||
    query.includes('ec') ||
    query.includes('encumbrance') ||
    query.includes('registration') ||
    query.includes('mutation') ||
    query.includes('dharani') ||
    query.includes('poa') ||
    query.includes('witness') ||
    query.includes('title') ||
    query.includes('లీగల్') ||
    query.includes('कानूनी') ||
    query.includes('ரிஜிஸ்ட்ரேஷன்')
  ) {
    return {
      content: `${snip.legalIntro}

**1. 30-Year Title Search & Link Document Scrutiny:**
Our senior advocates trace the ownership chain for 30+ years to guarantee zero dispute, zero inheritance claim, and clean legal lineage.

**2. Encumbrance Certificate (EC) Verification:**
We verify that the property has nil registered financial or mortgage liabilities on Sub-Registrar records.

**3. HMDA / DTCP / RERA Approval Validation:**
Verification of layout sanctions, master plan zoning (residential/commercial), road widening buffers, and RERA registration compliance.

**4. Mutation Assistance:**
Immediate guidance for mutating the title into municipal (GHMC) or revenue (Dharani/Pattadar passbook) land registers after registration so that property tax and electricity meters transfer smoothly.

**5. Power of Attorney (POA) Vetting:**
If the seller is acting through a POA, we authenticate the registered validity, alive certificate of principal, and scope of powers.`,
      actions: [
        { label: '📑 Request Legal Document Review', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=I%20want%20legal%20document%20verification%20service`, action: 'legal' },
        { label: '📞 Speak with Legal Team', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'legal'
    };
  }

  // 5. Bhoomi Pooja / Gruhapravesam / Vastu
  if (
    query.includes('pooja') ||
    query.includes('puja') ||
    query.includes('bhoomi') ||
    query.includes('bhumi') ||
    query.includes('gruhapravesam') ||
    query.includes('house warming') ||
    query.includes('vastu') ||
    query.includes('vasthu') ||
    query.includes('భూమి పూజ') ||
    query.includes('గృహప్రవేశం') ||
    query.includes('वास्तु')
  ) {
    return {
      content: `${snip.poojaIntro}

🕉️ **Bhoomi Pooja & Ground-Breaking Services:**
• Auspicious Muhurtam calculation by renowned Vedic astrologers.
• Complete ritual samagri, navadhanya, silver/copper kalasha, and Shankusthapana setup.
• Learned Purohits to perform Vastu Shanti and Bhoomi Devi invocation.

🏠 **Gruhapravesam (House Warming) Coordination:**
• Traditional Go-Puja (Cow & Calf ceremony at the doorstep).
• Ganapati & Navagraha Homam, Vastu Puja, and Milk Boiling ritual.
• Optional floral decor, pandal, and catering liaison.

🧭 **Scientific & Traditional Vastu Consultation:**
• Vastu audit for open plots (cardinal orientations, slope, NE Ishanya corner analysis).
• Internal villa floor plan corrections to invite health, wealth, and positive energy flow without destructive demolitions.`,
      actions: [
        { label: '🪔 Book Vedic Ceremony', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=I%20want%20to%20book%20Bhoomi%20Pooja%20or%20Gruhapravesam%20service`, action: 'bhoomi_pooja' },
        { label: '🧭 Request Vastu Audit', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'spiritual'
    };
  }

  // 6. Plots & Lands / Shadnagar / Locations
  if (
    query.includes('plot') ||
    query.includes('shadnagar') ||
    query.includes('land') ||
    query.includes('patancheru') ||
    query.includes('medchal') ||
    query.includes('kothur') ||
    query.includes('maheshwaram') ||
    query.includes('farmland') ||
    query.includes('agricultural') ||
    query.includes('ప్లాట్లు') ||
    query.includes('जमीन') ||
    query.includes('பிளாட்')
  ) {
    return {
      content: `${snip.plotsIntro}

**Top Investment Corridors in Hyderabad:**
• **Shadnagar & South Growth Corridor:** Close to Rajiv Gandhi International Airport, Bangalore Highway (NH-44), and proposed Metro phase extension. Highest capital appreciation for open residential plots!
• **Patancheru & West ORR:** High demand near IT corridors, Mumbai Highway, and industrial hubs.
• **Medchal & North Zone:** Fast-growing residential layouts near Outer Ring Road Exit 6.
• **Kothur & Maheshwaram:** Strategic hub near Hardware Park, Pharma City, and AeroSEZ.

**Standard Amenities in OPV Partner Gated Layouts:**
✅ 100% Vastu Compliant Layouts  
✅ 40ft & 30ft Blacktop BT Roads  
✅ Underground Drainage & Electricity Lines with Transformers  
✅ Compound Wall with Grand Entrance Arch and 24/7 Security  
✅ Avenue Plantation, Parks & Children’s Play Areas  
✅ Clear Title with 100% Bank Loan Approvals`,
      actions: [
        { label: '📍 Browse Plots on Website', url: `${profile.website}properties/plots-for-sale-in-hyderabad/`, action: 'explore' },
        { label: '💬 Get Plot Price List via WhatsApp', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=Please%20share%20verified%20plot%20listings%20in%20Shadnagar%20and%20Hyderabad`, action: 'whatsapp' }
      ],
      category: 'plots'
    };
  }

  // 7. Villas & Luxury Houses
  if (
    query.includes('villa') ||
    query.includes('house') ||
    query.includes('gated community') ||
    query.includes('duplex') ||
    query.includes('triplex') ||
    query.includes('kokapet') ||
    query.includes('gachibowli') ||
    query.includes('tellapur') ||
    query.includes('ವಿಲ್ಲಾ') ||
    query.includes('విల్లా') ||
    query.includes('विला')
  ) {
    return {
      content: `${snip.villasIntro}

**Featured Luxury Villa Corridors:**
• **Gachibowli & Financial District:** 10-15 minutes from prime IT hubs; luxury 4BHK/5BHK gated communities.
• **Kokapet & Neopolis:** Hyderabad's golden corridor with world-class infrastructure and high-end living.
• **Tellapur & Kollur:** High capital growth zone with leading international schools and clubhouse communities.
• **Mokila & Shankarpally Road:** Peaceful green villa enclaves with individual swimming pools and private gardens.

**Premium Specifications:**
• Spacious built-up areas (3,000 to 7,500+ sq. ft.)
• Smart Home Automation, EV Charging points, Solar power ready
• Clubhouses with Infinity Pools, Gyms, Squash Courts & Banquet Halls`,
      actions: [
        { label: '🏰 View Luxury Villas', url: `${profile.website}properties/houses-for-sale-in-hyderabad/`, action: 'explore' },
        { label: '📞 Schedule Site Visit', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'villas'
    };
  }

  // 8. NRI Advisory
  if (
    query.includes('nri') ||
    query.includes('abroad') ||
    query.includes('foreign') ||
    query.includes('overseas') ||
    query.includes('usa') ||
    query.includes('dubai') ||
    query.includes('oci') ||
    query.includes('repatriation')
  ) {
    return {
      content: `${snip.nriIntro}

**Can NRIs Buy Property in India?**
• **Permitted:** Residential plots, commercial spaces, villas, and apartments (freely purchasable under general RBI permissions).
• **Restrictions:** Agricultural land, farmhouses, or plantation properties require special RBI approval (unless inherited).

**OPV Dedicated NRI Assistance Services:**
1. **Virtual Live Video Walkthroughs:** 360-degree interactive camera walkthroughs of physical plots and construction progress.
2. **POA (Power of Attorney) Coordination:** Remote drafting, Indian Embassy consular attestation, and local registration support.
3. **Banking & Currency Compliance:** Smooth transactions via NRE / NRO bank accounts with full repatriation documentation.
4. **Complete Property Management:** Fencing, perimeter security, and lease management so your assets remain 100% encroachment-free.`,
      actions: [
        { label: '🌐 Connect with NRI Desk', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=I%20am%20an%20NRI%20looking%20to%20invest%20in%20Hyderabad%20property`, action: 'whatsapp' },
        { label: '📞 Call Primary Desk', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'nri'
    };
  }

  // 9. Mobile App & Referral Program
  if (
    query.includes('app') ||
    query.includes('play store') ||
    query.includes('download') ||
    query.includes('refer') ||
    query.includes('reward') ||
    query.includes('earn') ||
    query.includes('యాప్') ||
    query.includes('ऐप')
  ) {
    return {
      content: `${snip.appIntro}

**Why Download the Open Plots App?**
• **Post Property for FREE:** Sellers and landlords can post verified listings at zero cost.
• **AI Matchmaking Engine:** Personalized property feeds tailored to your budget and preferred corridor.
• **Instant Agent & Seller Connect:** Verified contact details without middlemen spam.

🎁 **Refer a Friend for Home Buying & Win Rewards:**
Refer any friend, relative, or colleague looking to buy property or use OPV 360° Elite services, and earn:
• **Luxury Gift Hampers**
• **Gold & Jewellery Vouchers**
• **Fine Dining & Restaurant Experiences**
• **Travel & Holiday Packages**`,
      actions: [
        { label: '📲 Download on Google Play', url: profile.app.googlePlay, action: 'explore' },
        { label: '💬 Inquire About Referral', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=I%20want%20to%20know%20about%20the%20OPV%20Referral%20Rewards%20Program`, action: 'whatsapp' }
      ],
      category: 'app'
    };
  }

  // 10. Top Developers & Recommended Sellers
  if (
    query.includes('developer') ||
    query.includes('builder') ||
    query.includes('aparna') ||
    query.includes('ramky') ||
    query.includes('my home') ||
    query.includes('seller') ||
    query.includes('agent')
  ) {
    const devList = profile.topDevelopers
      .map(d => `• **${d.name}:** ${d.experience} experience | ${d.projects} (${d.status})`)
      .join('\n');
    const sellList = profile.recommendedSellers
      .map(s => `• **${s.name}:** ${s.exp} experience | Areas: ${s.areas.join(', ')}`)
      .join('\n');

    return {
      content: `### 🏗️ Top Developers & Verified Sellers on OPV

**Premier Developers in Hyderabad:**
${devList}

**Recommended Property Experts & Agents:**
${sellList}

> All builders and sellers featured on Open Plots & Villas undergo strict credential and track-record checks for your complete peace of mind.`,
      actions: [
        { label: '🏢 View Developer Projects', url: `${profile.website}developers/`, action: 'explore' },
        { label: '📞 Contact OPV Office', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'developers'
    };
  }

  // 11. Greetings / Hello / Hi
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query === 'namaste' ||
    query === 'namaskaram' ||
    query.includes('how are you') ||
    query.includes('who are you')
  ) {
    const activeLang = OPV_LANGUAGES.find(l => l.code === language) || OPV_LANGUAGES[0];
    return {
      content: `### ${activeLang.welcomeGreeting}
${activeLang.welcomeSubtitle}

Here are some popular topics I can assist you with right now:
1. 🏡 **Open Plots & Land:** HMDA/DTCP layouts in Shadnagar, Patancheru, Medchal, Kothur
2. 🏰 **Villas & Homes:** Gated community luxury villas in Kokapet, Gachibowli, Tellapur
3. 🌟 **360° Elite Services:** From Bhoomi Pooja to Gruhapravesam end-to-end
4. 🏦 **Home Loans:** Fast sanctions at lowest interest rates (SBI, HDFC, ICICI)
5. ⚖️ **Legal & EC:** 30-year title verification, Encumbrance Certificate, Mutation
6. 🌐 **NRI Investment Desk:** Remote video tours & hassle-free POA legal process

What would you like to explore today?`,
      actions: [
        { label: '🏡 Explore Plots', url: `${profile.website}properties/plots-for-sale-in-hyderabad/`, action: 'explore' },
        { label: '🌟 360° Services', url: `${profile.website}services/`, action: 'explore' },
        { label: '📞 Contact Desk', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' }
      ],
      category: 'greeting'
    };
  }

  // Default intelligent fallback based on knowledge base
  return {
    content: `${snip.defaultHelp}

**About Open Plots & Villas (OPV):**
Open Plots & Villas is **India’s First AI-Powered Real Estate Platform**, headquartered in **Madhapur, Hyderabad** (#101, Road No: 10, Jaya Kesav Avenue, Kakatiya Hills).

We provide end-to-end solutions:
• **Property Discovery:** Verified Open Plots, Luxury Villas, Apartments, Farmlands, and Commercial spaces.
• **360° Elite Services:** Architectural 3D drawings, Home Loans, GPS Land Survey, Legal title check & EC, Vastu, Bhoomi Pooja ceremony, Gruhapravesam, and Asset protection.

**Direct Support:**
📞 Phone: **${profile.contact.phonePrimary}** | **${profile.contact.phoneSecondary}**  
✉️ Email: **${profile.contact.email}**`,
    actions: [
      { label: '📞 Call Support', url: `tel:${profile.contact.phonePrimary.replace(/\s+/g, '')}`, action: 'call' },
      { label: '💬 WhatsApp Chat', url: `https://wa.me/${profile.contact.whatsapp.replace('+', '')}?text=Hello%20OPV%2C%20I%20have%20an%20inquiry`, action: 'whatsapp' },
      { label: '🌐 Open Website', url: profile.website, action: 'contact' }
    ],
    category: 'general'
  };
}
