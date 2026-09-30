import { LanguageOption, LanguageCode } from '../types/chat';

export const OPV_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English (US)',
    nativeName: 'English (US)',
    speechCode: 'en-US',
    welcomeGreeting: 'Hello! Welcome to Open Plots & Villas AI Assistant.',
    welcomeSubtitle: "India's First AI-Powered Real Estate Platform. How can I assist your property search or 360° Elite services today?",
    placeholder: 'Ask about plots, villas, home loans, legal verification, Hyderabad localities...',
    suggestions: [
      'Find open plots in Shadnagar & Hyderabad',
      'Tell me about OPV 360° Elite Services',
      'How to get Home Loan assistance?',
      'Legal verification & Encumbrance Certificate (EC)',
      'NRI property purchase guidelines',
      'What are the best localities in West Hyderabad?'
    ]
  },
  {
    code: 'hi',
    label: 'हिन्दी (Hindi)',
    nativeName: 'हिन्दी (Hindi)',
    speechCode: 'hi-IN',
    welcomeGreeting: 'नमस्ते! ओपन प्लॉट्स एंड विला (OPV) AI में आपका स्वागत है।',
    welcomeSubtitle: 'भारत का पहला AI-संचालित रियल एस्टेट प्लेटफॉर्म। आज मैं आपकी संपत्ति या 360° एलीट सेवाओं में कैसे सहायता कर सकता हूँ?',
    placeholder: 'प्लॉट, विला, होम लोन, कानूनी जांच, हैदराबाद के क्षेत्रों के बारे में पूछें...',
    suggestions: [
      'शादनगर और हैदराबाद में ओपन प्लॉट्स खोजें',
      'OPV 360° एलीट सेवाएं क्या हैं?',
      'होम लोन और फाइनेंस सहायता कैसे प्राप्त करें?',
      'प्रॉपर्टी का कानूनी सत्यापन और EC कैसे चेक करें?',
      'भूमि पूजन और गृहप्रवेश की सेवाएं',
      'अनिवासी भारतीयों (NRI) के लिए संपत्ति निवेश नियम'
    ]
  },
  {
    code: 'te',
    label: 'తెలుగు (Telugu)',
    nativeName: 'తెలుగు (Telugu)',
    speechCode: 'te-IN',
    welcomeGreeting: 'నమస్కారం! ఓపెన్ ప్లాట్స్ & విల్లాస్ (OPV) AI కి స్వాగతం.',
    welcomeSubtitle: 'భారతదేశపు మొట్టమొదటి AI ఆధారిత రియల్ ఎస్టేట్ ప్లాట్‌ఫామ్. మీకు ప్లాట్లు, విల్లాలు లేదా 360° ఎలైట్ సర్వీసుల్లో ఎలా సహాయపడగలను?',
    placeholder: 'ప్లాట్లు, విల్లాలు, హోమ్ లోన్స్, రిజిస్ట్రేషన్, హైదరాబాద్ ఏరియాల గురించి అడగండి...',
    suggestions: [
      'షాద్‌నగర్ మరియు హైదరాబాద్‌లో ఓపెన్ ప్లాట్లు చూపించండి',
      'OPV 360° ఎలైట్ సర్వీసెస్ గురించి చెప్పండి',
      'హోమ్ లోన్ మరియు ఫైనాన్స్ సహాయం ఎలా పొందాలి?',
      'లీగల్ వెరిఫికేషన్ మరియు EC వివరాలు',
      'భూమి పూజ & గృహప్రవేశం సర్వీసులు ఎలా బుక్ చేయాలి?',
      'NRIల కోసం హైదరాబాద్‌లో బెస్ట్ ఇన్వెస్ట్‌మెంట్ ఏరియాలు'
    ]
  },
  {
    code: 'ta',
    label: 'தமிழ் (Tamil)',
    nativeName: 'தமிழ் (Tamil)',
    speechCode: 'ta-IN',
    welcomeGreeting: 'வணக்கம்! ஓபன் பிளாட்ஸ் & வில்லாஸ் (OPV) AI-க்கு வரவேற்கிறோம்.',
    welcomeSubtitle: 'இந்தியாவின் முதல் AI-இயங்கும் ரியல் எஸ்டேட் தளம். உங்கள் சொத்து தேடலுக்கு இன்று நான் எவ்வாறு உதவ முடியும்?',
    placeholder: 'பிளாட்டுகள், வில்லாக்கள், வீட்டுக் கடன், சட்ட சரிபார்ப்பு பற்றி கேளுங்கள்...',
    suggestions: [
      'ஹைதராபாத்தில் ஓபன் பிளாட்டுகள் விவரங்கள்',
      'OPV 360° எலைட் சேவைகள் என்றால் என்ன?',
      'வீட்டுக் கடன் மற்றும் நிதி உதவி பெறுவது எப்படி?',
      'சொத்து சட்ட சரிபார்ப்பு மற்றும் EC விவரங்கள்',
      'பூமி பூஜை மற்றும் கிரகப்பிரவேச சேவைகள்',
      'வெளிநாடு வாழ் இந்தியர்களுக்கான (NRI) முதலீட்டு வழிகாட்டுதல்'
    ]
  },
  {
    code: 'kn',
    label: 'ಕನ್ನಡ (Kannada)',
    nativeName: 'ಕನ್ನಡ (Kannada)',
    speechCode: 'kn-IN',
    welcomeGreeting: 'ನಮಸ್ಕಾರ! ಓಪನ್ ಪ್ಲಾಟ್ಸ್ & ವಿಲ್ಲಾಸ್ (OPV) AI ಗೆ ಸುಸ್ವಾಗತ.',
    welcomeSubtitle: 'ಭಾರತದ ಮೊದಲ AI-ಚಾಲಿತ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್. ಇಂದು ನಿಮ್ಮ ಆಸ್ತಿ ಹುಡುಕಾಟದಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    placeholder: 'ಪ್ಲಾಟ್‌ಗಳು, ವಿಲ್ಲಾಗಳು, ಗೃಹ ಸಾಲಗಳು, ಕಾನೂನು ಪರಿಶೀಲನೆ ಬಗ್ಗೆ ಕೇಳಿ...',
    suggestions: [
      'ಹೈದರಾಬಾದ್‌ನಲ್ಲಿ ಓಪನ್ ಪ್ಲಾಟ್‌ಗಳನ್ನು ಹುಡುಕಿ',
      'OPV 360° ಎಲೈಟ್ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ',
      'ಗೃಹ ಸಾಲ ಪಡೆಯಲು ಸಹಾಯ',
      'ಕಾನೂನು ಪರಿಶೀಲನೆ ಮತ್ತು EC ವಿವರಗಳು',
      'ಭೂಮಿ ಪೂಜೆ ಮತ್ತು ಗೃಹಪ್ರವೇಶ ಸೇವೆಗಳು',
      'NRI ಹೂಡಿಕೆದಾರರಿಗೆ ಮಾರ್ಗದರ್ಶನ'
    ]
  },
  {
    code: 'ml',
    label: 'മലയാളം (Malayalam)',
    nativeName: 'മലയാളം (Malayalam)',
    speechCode: 'ml-IN',
    welcomeGreeting: 'നമസ്കാരം! ഓപ്പൺ പ്ലോട്ട്സ് & വില്ലാസ് (OPV) AI-ലേക്ക് സ്വാഗതം.',
    welcomeSubtitle: 'ഇന്ത്യയിലെ ആദ്യത്തെ AI-പവർ റിയൽ എസ്റ്റേറ്റ് പ്ലാറ്റ്ഫോം. നിങ്ങളുടെ പ്രോപ്പർട്ടി ആവശ്യങ്ങളിൽ എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?',
    placeholder: 'പ്ലോട്ടുകൾ, വില്ലകൾ, ഭവന വായ്പ, ലീഗൽ വെരിഫിക്കേഷൻ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...',
    suggestions: [
      'ഹൈദരാബാദിലെ പ്ലോട്ടുകൾ കണ്ടെത്തുക',
      'OPV 360° എലൈറ്റ് സേവനങ്ങൾ എന്തൊക്കെയാണ്?',
      'ഭവന വായ്പ സഹായം എങ്ങനെ ലഭിക്കും?',
      'ലീഗൽ വെരിഫിക്കേഷൻ & EC പരിശോധന',
      'ഭൂമി പൂജ & ഗൃഹപ്രവേശം സേവനങ്ങൾ',
      'എൻആർഐ നിക്ഷേപ മാർഗ്ഗനിർദ്ദേശങ്ങൾ'
    ]
  },
  {
    code: 'mr',
    label: 'मराठी (Marathi)',
    nativeName: 'मराठी (Marathi)',
    speechCode: 'mr-IN',
    welcomeGreeting: 'नमस्कार! ओपन प्लॉट्स अँड व्हिलाज (OPV) AI मध्ये आपले स्वागत आहे.',
    welcomeSubtitle: 'भारतातील पहिले AI-आधारित रिअल इस्टेट प्लॅटफॉर्म. आज मी आपल्या मालमत्ता शोधात कशी मदत करू शकतो?',
    placeholder: 'प्लॉट्स, व्हिला, गृहकर्ज, कायदेशीर तपासणी याबद्दल विचारा...',
    suggestions: [
      'हैदराबाद आणि शादनगरमध्ये प्लॉट्स शोधा',
      'OPV 360° एलिट सेवांबद्दल माहिती',
      'गृहकर्ज (Home Loan) सहाय्य कसे मिळवायचे?',
      'कायदेशीर पडताळणी आणि EC तपशील',
      'भूमी पूजन आणि गृहप्रवेश सेवा',
      'अनिवासी भारतीयांसाठी (NRI) गुंतवणूक मार्गदर्शक'
    ]
  },
  {
    code: 'bn',
    label: 'বাংলা (Bengali)',
    nativeName: 'বাংলা (Bengali)',
    speechCode: 'bn-IN',
    welcomeGreeting: 'নমস্কার! ওপেন প্লটস অ্যান্ড ভিলাস (OPV) AI-তে আপনাকে স্বাগতম।',
    welcomeSubtitle: 'ভারতের প্রথম AI-চালিত রিয়েল এস্টেট প্ল্যাটফর্ম। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    placeholder: 'প্লট, ভিলা, হোম লোন, আইনি যাচাইকরণ সম্পর্কে জিজ্ঞাসা করুন...',
    suggestions: [
      'হায়দ্রাবাদে প্লট ও ভিলা খুঁজুন',
      'OPV 360° এলিট পরিষেবা সম্পর্কে জানুন',
      'হোম লোন সহায়তা কীভাবে পাবেন?',
      'আইনি যাচাইকরণ এবং EC বিশদ',
      'ভূমি পূজা এবং গৃহপ্রবেশ পরিষেবা',
      'প্রবাসী ভারতীয়দের (NRI) জন্য নির্দেশিকা'
    ]
  },
  {
    code: 'gu',
    label: 'ગુજરાતી (Gujarati)',
    nativeName: 'ગુજરાતી (Gujarati)',
    speechCode: 'gu-IN',
    welcomeGreeting: 'નમસ્તે! ઓપન પ્લોટ્સ એન્ડ વિલાસ (OPV) AI માં આપનું સ્વાગત છે.',
    welcomeSubtitle: 'ભારતનું પ્રથમ AI-સંચાલિત રિયલ એસ્ટેટ પ્લેટફોર્મ. તમારી મિલકત શોધમાં હું કેવી રીતે મદદ કરી શકું?',
    placeholder: 'પ્લોટ્સ, વિલા, હોમ લોન, કાનૂની ચકાસણી વિશે પૂછો...',
    suggestions: [
      'હૈદરાબાદમાં શ્રેષ્ઠ પ્લોટ્સ શોધો',
      'OPV 360° એલિટ સેવાઓ વિશે જણાવો',
      'હોમ લોન સહાય કેવી રીતે મેળવવી?',
      'કાનૂની ચકાસણી અને EC ની વિગતો',
      'ભૂમિ પૂજન અને ગૃહપ્રવેશ સેવાઓ',
      'NRI રોકાણકારો માટે માર્ગદર્શિકા'
    ]
  },
  {
    code: 'ur',
    label: 'اُردُو (Urdu)',
    nativeName: 'اُردُو (Urdu)',
    speechCode: 'ur-IN',
    direction: 'rtl',
    welcomeGreeting: 'السلام علیکم! اوپن پلاٹس اینڈ ولاز (OPV) AI میں خوش آمدید۔',
    welcomeSubtitle: 'ہندوستان کا پہلا AI سے چلنے والا ریئل اسٹیٹ پلیٹ فارم۔ آج میں آپ کی جائیداد کی تلاش میں کس طرح مدد کر سکتا ہوں؟',
    placeholder: 'پلاٹس، ولاز، ہوم لون، قانونی تصدیق کے بارے میں پوچھیں...',
    suggestions: [
      'حیدرآباد اور شادنگر میں پلاٹس تلاش کریں',
      'OPV 360° ایلیٹ سروسز کیا ہیں؟',
      'ہوم لون اور مالیاتی امداد کیسے حاصل کریں؟',
      'قانونی تصدیق اور EC کی تفصیلات',
      'بھومی پوجا اور گرہ پرویش خدمات',
      'این آر آئی (NRI) کے لیے رہنمائی'
    ]
  },
  {
    code: 'pa',
    label: 'ਪੰਜਾਬੀ (Punjabi)',
    nativeName: 'ਪੰਜਾਬੀ (Punjabi)',
    speechCode: 'pa-IN',
    welcomeGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਓਪਨ ਪਲਾਟਸ ਐਂਡ ਵਿਲਾਸ (OPV) AI ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।',
    welcomeSubtitle: 'ਭਾਰਤ ਦਾ ਪਹਿਲਾ AI-ਅਧਾਰਿਤ ਰੀਅਲ ਅਸਟੇਟ ਪਲੇਟਫਾਰਮ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਜਾਇਦਾਦ ਦੀ ਖੋਜ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    placeholder: 'ਪਲਾਟਾਂ, ਵਿਲਾ, ਹੋਮ ਲੋਨ, ਕਾਨੂੰਨੀ ਜਾਂਚ ਬਾਰੇ ਪੁੱਛੋ...',
    suggestions: [
      'ਹੈਦਰਾਬਾਦ ਵਿੱਚ ਓਪਨ ਪਲਾਟ ਲੱਭੋ',
      'OPV 360° ਐਲੀਟ ਸੇਵਾਵਾਂ ਬਾਰੇ ਦੱਸੋ',
      'ਹੋਮ ਲੋਨ ਦੀ ਸਹਾਇਤਾ ਕਿਵੇਂ ਲਈਏ?',
      'ਕਾਨੂੰਨੀ ਤਸਦੀਕ ਅਤੇ EC ਵੇਰਵੇ',
      'ਭੂਮੀ ਪੂਜਾ ਅਤੇ ਗ੍ਰਹਿ ਪ੍ਰਵੇਸ਼ ਸੇਵਾਵਾਂ',
      'ਐਨਆਰਆਈ (NRI) ਨਿਵੇਸ਼ ਸੰਬੰਧੀ ਨਿਯਮ'
    ]
  },
  {
    code: 'or',
    label: 'ଓଡ଼ିଆ (Odia)',
    nativeName: 'ଓଡ଼ିଆ (Odia)',
    speechCode: 'or-IN',
    welcomeGreeting: 'ନମସ୍କାର! ଓପନ୍ ପ୍ଲଟ୍ସ ଆଣ୍ଡ ଭିଲାସ୍ (OPV) AI କୁ ସ୍ଵାଗତ।',
    welcomeSubtitle: 'ଭାରତର ପ୍ରଥମ AI-ଚାଳିତ ରିଅଲ୍ ଇଷ୍ଟେଟ୍ ପ୍ଲାଟଫର୍ମ। ଆଜି ଆପଣଙ୍କ ସମ୍ପତ୍ତି ସନ୍ଧାନରେ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
    placeholder: 'ପ୍ଲଟ୍, ଭିଲା, ହୋମ୍ ଲୋନ୍, ଆଇନଗତ ଯାଞ୍ଚ ବିଷୟରେ ପଚାରନ୍ତୁ...',
    suggestions: [
      'ହାଇଦ୍ରାବାଦରେ ଓପନ୍ ପ୍ଲଟ୍ ଖୋଜନ୍ତୁ',
      'OPV 360° ଏଲାଇଟ୍ ସେବାଗୁଡ଼ିକ କ’ଣ?',
      'ହୋମ୍ ଲୋନ୍ ସହାୟତା କିପରି ପାଇବେ?',
      'ଆଇନଗତ ଯାଞ୍ଚ ଏବଂ EC ବିବରଣୀ',
      'ଭୂମି ପୂଜା ଏବଂ ଗୃହପ୍ରବେଶ ସେବା',
      'ଏନ୍‌ଆର୍‌ଆଇ (NRI) ନିବେଶକଙ୍କ ପାଇଁ ନିୟମ'
    ]
  },
  {
    code: 'mwr',
    label: 'मारवाड़ी (Marwari)',
    nativeName: 'मारवाड़ी (Marwari)',
    speechCode: 'hi-IN',
    welcomeGreeting: 'खम्मा घणी! ओपन प्लॉट्स एंड विलास (OPV) AI मांय आपरो स्वागत है।',
    welcomeSubtitle: 'भारत रो पहलो AI चालित रियल एस्टेट प्लेटफॉर्म। आज म्हैं आपरी जमीन-जायदाद खोज मांय कीकर मदद कर सकूं?',
    placeholder: 'प्लॉट, विला, होम लोन, कानूनी जांच बाबत पूछो...',
    suggestions: [
      'शादनगर अर हैदराबाद मांय खुला प्लॉट दिखावो',
      'OPV 360° एलिट सेवावां री जानकारी',
      'होम लोन अर रुपिया री मदद कीकर मिले?',
      'जमीन री पक्की रजिस्ट्री अर EC जांच',
      'भूमि पूजन अर गृहप्रवेश री व्यवस्था',
      'परदेसी भायां (NRI) वास्ते निवेश रा नियम'
    ]
  }
];

export const OPV_COMPANY_PROFILE = {
  name: 'Open Plots & Villas (OPV)',
  brandStatement: "India's First AI-Powered Real Estate Platform",
  mission: 'To make property discovery, buying, selling, and owning simple, secure, transparent, and trustworthy.',
  slogan: 'Find • Buy • Sell • Rent',
  corePromise: 'From Land Acquisition, Bhoomi Pooja to Gruhapravesam: Complete End-to-End Property Solutions',
  website: 'https://www.openplotsandvillas.com/',

  headquarters: {
    address: '#101, Road No: 10, Jaya Kesav Avenue, Kakatiya Hills, Madhapur, Hyderabad, Telangana, 500081',
    city: 'Hyderabad',
    landmark: 'Kakatiya Hills, Madhapur (near Cyber Towers / HITEC City)',
    state: 'Telangana',
    country: 'India'
  },

  contact: {
    phonePrimary: '+91 9963513939',
    phoneSecondary: '040 4563 5052',
    email: 'info@openplotsandvillas.com',
    supportDesk: 'Available 7 days a week, 9:00 AM - 8:00 PM IST',
    whatsapp: '+919963513939'
  },

  socialMedia: {
    youtube: 'https://www.youtube.com/@openplotsandvillas/shorts',
    facebook: 'https://www.facebook.com/openplotsandvillas',
    instagram: 'https://www.instagram.com/openplotsandvillas',
    x: 'https://x.com/openplotsandvillas',
    linkedin: 'https://www.linkedin.com/company/openplotsandvillas/'
  },

  app: {
    name: 'Open Plots App',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.openplotsandvillas.opvapp',
    appleStore: 'Available on iOS App Store',
    exclusiveFeatures: [
      'Post Property for FREE',
      'AI Property Matchmaker',
      'Refer a Friend & Earn Luxury Rewards (Gift Hampers, Gold & Jewellery, Fine Dining, Travel vouchers)',
      'Direct Builder & Verified Agent Connect'
    ]
  },

  propertyCategories: [
    {
      type: 'Open Plots',
      description: 'HMDA, DTCP & RERA approved residential and commercial plots. Clear titles, 30-year search report, immediate registration.',
      topLocations: ['Shadnagar', 'Patancheru', 'Medchal', 'Kothur', 'Kondapur', 'Adibatla', 'Maheshwaram']
    },
    {
      type: 'Villas & Independent Houses',
      description: 'Ultra-luxury duplex/triplex gated community villas with world-class clubhouses, swimming pools, 24/7 security.',
      topLocations: ['Gachibowli', 'Kokapet', 'Tellapur', 'Mokila', 'Kollur', 'Kompally']
    },
    {
      type: 'Flats & High-Rise Apartments',
      description: 'Premium 2BHK, 3BHK, 4BHK apartments and luxury penthouses by top tier developers.',
      topLocations: ['Financial District', 'Kondapur', 'Hitec City', 'Nanakramguda', 'Manikonda']
    },
    {
      type: 'Agricultural Lands & Farmlands',
      description: 'Clear-title fertile farmland, managed sandalwood/mango farm plots, weekend retreats within 45-60 min drive.',
      topLocations: ['Chevella', 'Shadnagar', 'Shankarpally', 'Yadagirigutta', 'Sangareddy']
    },
    {
      type: 'Commercial Properties & Lands',
      description: 'High-yield commercial spaces, highway-facing commercial plots, retail shops, warehousing land.',
      topLocations: ['ORR (Outer Ring Road) junctions', 'Gachibowli', 'Madhapur', 'Uppal']
    },
    {
      type: 'Auction & Distress Properties',
      description: 'Bank auction properties with high ROI opportunities, assisted bidding, legal title scrubbing.',
      topLocations: ['Hyderabad Metro Corridors']
    }
  ],

  eliteServices360: [
    {
      id: 'architectural',
      title: 'Architectural Design & Smart 3D Modelling',
      shortDesc: 'Vastu-compliant architectural plans, structural drawings, photorealistic 3D elevations and VR walk-throughs.',
      icon: 'PenTool',
      benefits: ['Custom customized villa plans', 'BIM 3D modeling', 'Municipal GHMC/HMDA plan approvals']
    },
    {
      id: 'loans',
      title: 'Home Loans & Property Finance',
      shortDesc: 'Hassle-free loan sanctions with lowest interest rates from SBI, HDFC, ICICI, Axis and leading NBFCs.',
      icon: 'Landmark',
      benefits: ['Zero processing fee guidance', 'Plot purchase + construction loans', 'Instant eligibility check', 'Doorstep document pickup']
    },
    {
      id: 'survey',
      title: 'Land Survey & GPS Boundary Audits',
      shortDesc: 'Total Station laser surveys, high-precision GPS boundary audits, contour maps and physical demarcation.',
      icon: 'MapPin',
      benefits: ['Drone aerial survey mapping', 'Encroachment risk checks', 'Government survey stone matching']
    },
    {
      id: 'legal',
      title: 'Legal Services, Title Clearance & Registration',
      shortDesc: 'Comprehensive 30-year link document verification, Encumbrance Certificate (EC), Mutation and SRO Registration support.',
      icon: 'ShieldCheck',
      benefits: ['Senior advocate scrutiny report', 'Dharani portal clearance', 'Power of Attorney (POA) vetting', 'Peace of mind guaranteed']
    },
    {
      id: 'management',
      title: 'Property Management & Asset Guard',
      shortDesc: 'Physical protection for your plots and vacant homes with perimeter fencing, live signage, and periodic site inspection.',
      icon: 'Key',
      benefits: ['Quarterly photo & video status updates', 'Encroachment deterrence boards', 'Property tax and water bill maintenance', 'Tenant vetting & lease management']
    },
    {
      id: 'vastu',
      title: 'Vastu & Spiritual Energy Flow',
      shortDesc: 'Expert scientific and traditional Vastu consultation for plots, home orientation, room placement and energy balance.',
      icon: 'Compass',
      benefits: ['North/East facing plot optimization', 'Dosha remedies without demolition', 'Auspicious layout orientation']
    },
    {
      id: 'bhoomi_pooja',
      title: 'Bhoomi Pooja Ceremony Services',
      shortDesc: 'Complete ceremonial arrangements for ground-breaking, including Vedic purohits, puja samagri, pandal and muhurtam scheduling.',
      icon: 'Sparkles',
      benefits: ['Vedic learned priests', 'Complete ritual samagri provided', 'Auspicious Muhurtam calculation']
    },
    {
      id: 'gruhapravesam',
      title: 'Gruhapravesam (House Warming) Services',
      shortDesc: 'Stress-free traditional housewarming experience with Cow Puja (Go Puja), Ganapati homam, floral decor and catering coordination.',
      icon: 'Home',
      benefits: ['Authentic traditional rituals', 'Floral decoration packages', 'Event management & guest coordination']
    },
    {
      id: 'interior',
      title: 'Interior Design & Construction Execution',
      shortDesc: 'End-to-end turnkey civil construction, premium interior styling, modular kitchen, smart lighting and false ceiling.',
      icon: 'Palette',
      benefits: ['Factory-finished woodwork', '3D design preview before fabrication', '10-year warranty on modular fittings']
    },
    {
      id: 'nri',
      title: 'NRI Property Assistance & Remote Investment Desk',
      shortDesc: 'Dedicated remote concierge for Non-Resident Indians to inspect, purchase, manage, and resell Hyderabad real estate.',
      icon: 'Globe',
      benefits: ['Virtual live video tours', 'NRE/NRO banking & repatriation guidance', 'POA coordination & legal due diligence']
    }
  ],

  topDevelopers: [
    {
      name: 'Aparna Constructions',
      experience: '23+ Years',
      projects: '66+ Projects in Hyderabad',
      status: '46 Ready to Move, 19 Under Construction, 1 New Launch'
    },
    {
      name: 'Ramky Group',
      experience: '20+ Years',
      projects: '31+ Projects in Hyderabad',
      status: '20 Ready to Move, 8 Under Construction, 3 New Launch'
    },
    {
      name: 'My Home Group',
      experience: '25+ Years',
      projects: '29+ Mega Township Projects',
      status: '23 Ready to Move, 5 Under Construction, 1 New Launch'
    }
  ],

  recommendedSellers: [
    { name: 'Raju Builder', exp: '16 Yrs', areas: ['Kompally', 'Nizampet'], type: 'Property Expert' },
    { name: 'Acre Home', exp: '0.5 Yrs', listings: '98 Properties', areas: ['Perambur', 'Porur'] },
    { name: 'Circle Realtor', exp: '0.5 Yrs', listings: '92 Properties', areas: ['Thirumudivakkam', 'Perambur'] },
    { name: 'Imperial Realtor', exp: '0.5 Yrs', listings: '100 Properties', areas: ['Pallavaram', 'Tambaram'] },
    { name: 'Vrudhi Properties', exp: '5 Yrs', listings: '60 Properties', areas: ['Sainikpuri', 'Kapra'] },
    { name: 'Sree Laxmi Developers', exp: '8 Yrs', areas: ['Shadnagar', 'Kothur'] }
  ],

  faqs: [
    {
      q: 'Are all properties verified?',
      a: 'Yes. Open Plots & Villas strives to list verified properties by reviewing vital documents, 30-year ownership trails, and layout approvals prior to publication. Buyers can also access dedicated OPV legal verification services for independent due diligence.'
    },
    {
      q: 'What is the difference between HMDA and DTCP approved plots?',
      a: 'HMDA (Hyderabad Metropolitan Development Authority) approves layouts within the 7,257 sq. km Hyderabad Metropolitan Region, requiring 30ft/40ft BT roads, underground drainage, and dedicated civic/park spaces (ideal for urban living and rapid capital growth). DTCP (Directorate of Town and Country Planning) sanctions layouts outside HMDA limits in developing towns and rural corridors across Telangana. Both provide 100% legal security when fully approved.'
    },
    {
      q: 'What is RERA?',
      a: 'RERA (Real Estate Regulatory Authority / TSRERA) is a statutory authority established under the Real Estate (Regulation and Development) Act, 2016. Every real estate project over 500 sq.m or with 8+ units must register. Builders must keep 70% of buyer collections in a dedicated escrow account for construction and are held liable for structural defects for 5 years.'
    },
    {
      q: 'Can I buy property directly from the owner?',
      a: 'Yes. Open Plots & Villas features verified properties from direct property owners, reputable developers, and trusted property experts. You can view direct contact options and schedule site visits directly.'
    },
    {
      q: 'Do you provide home loan assistance?',
      a: 'Yes. OPV connects buyers with leading banks and financial institutions (SBI, HDFC Bank, ICICI Bank, Axis Bank, and LIC HFL) for home loans, open plot purchase loans, and composite plot + construction financing at competitive interest rates with doorstep documentation.'
    },
    {
      q: 'Do you offer legal verification services?',
      a: 'Yes. OPV assists buyers with complete legal due diligence: 30-year link document verification, title search reports from senior advocates, Encumbrance Certificate (EC) scrutiny, Dharani revenue clearance, registration assistance, and mutation support.'
    },
    {
      q: 'Can I post my property for sale or rent?',
      a: 'Yes. Property owners, builders, and real estate professionals can "Post Property for FREE" on the OPV website and Open Plots mobile app to connect directly with genuine pre-qualified buyers and NRI investors.'
    },
    {
      q: 'What types of properties are available on Open Plots & Villas?',
      a: 'OPV offers verified open residential & commercial plots, luxury villas, gated community houses, 2BHK/3BHK/4BHK flats & apartments, agricultural land, managed farm lands, farm houses, commercial shops/spaces, and bank auction properties.'
    },
    {
      q: 'Do you help first-time property buyers?',
      a: 'Absolutely. We guide first-time buyers through every single milestone—from lifestyle-based property discovery and site visits to home loans, 30-year legal clearance, SRO registration, Bhoomi Pooja, and Gruhapravesam housewarming.'
    },
    {
      q: 'Can NRIs buy property through Open Plots & Villas?',
      a: 'Yes. Under FEMA and RBI regulations, NRIs and OCIs can freely purchase residential plots, villas, apartments, and commercial real estate in India. OPV provides dedicated remote assistance including virtual live video tours, embassy-attested POA coordination, and NRE/NRO banking compliance.'
    },
    {
      q: 'What real estate services does OPV provide?',
      a: 'OPV delivers comprehensive 360° Elite Services: Property Buying & Selling, Property Rentals, Architectural Design & 3D Modelling, Home Loans & Property Financing, Land Survey & GPS Demarcation, Legal Verification & Title Clearance, Property Registration & Mutation Guidance, Vastu Consultation, Interior Design & Turnkey Construction, Bhoomi Pooja Ceremony Arrangements, Gruhapravesam Services, Property Management & Asset Guard, and NRI Remote Investment Advisory.'
    },
    {
      q: 'How do I contact Open Plots & Villas?',
      a: 'You can reach OPV headquarters at #101, Road No: 10, Jaya Kesav Avenue, Kakatiya Hills, Madhapur, Hyderabad, call +91 9963513939 or 040 4563 5052, email info@openplotsandvillas.com, or chat directly via WhatsApp.'
    },
    {
      q: 'Why should I choose Open Plots & Villas over other property websites?',
      a: 'Open Plots & Villas is India\'s First AI-Powered Real Estate Platform. Unlike generic listing portals, OPV combines 100% verified clear-title listings (no fake listings), direct builder/owner connect, and end-to-end 360° execution (from land acquisition and Bhoomi Pooja to home loans, registration, and Gruhapravesam).'
    },
    {
      q: 'How do I verify whether a property is genuine before buying?',
      a: 'Follow OPV\'s 5-point verification checklist: 1) Verify 30-year registered link documents to confirm clear ownership, 2) Check layout sanctions (HMDA / DTCP) and TSRERA registration number, 3) Obtain a 30-year Nil Encumbrance Certificate (EC), 4) Perform a physical GPS laser boundary survey to confirm zero encroachment, and 5) Verify Master Plan zoning (confirm residential or commercial use).'
    },
    {
      q: 'What is the purpose of property registration?',
      a: 'Property registration under the Registration Act, 1908 is the legal process of recording title ownership transfer with the government. It legally establishes ownership, protects buyer rights, prevents disputes, and is mandatory for future resale, bank loans, and municipal mutation.'
    },
    {
      q: 'What are the effects of non-registration?',
      a: 'Under Section 49 of the Registration Act, 1908, an unregistered document does not confer valid legal title in courts of law. It prevents you from obtaining bank loans, restricts mutation in municipal or Dharani records, and leaves the property vulnerable to fraudulent resale or litigation.'
    },
    {
      q: 'Who can sign as a witness to a property document?',
      a: 'Any competent adult who is not a party to the sale transaction can sign as an official witness at the Sub-Registrar Office. Witnesses certify that the parties signed voluntarily, and they must provide valid government photo identification (Aadhaar or PAN).'
    },
    {
      q: 'What is a Power of Attorney (POA)?',
      a: 'A Power of Attorney (POA) is a formal legal instrument authorizing an agent or family member to act on behalf of the owner in property matters. For sale, purchase, or registration, a registered General Power of Attorney (GPA) or Special Power of Attorney (SPA) is required along with an alive certificate of the principal.'
    },
    {
      q: 'What is an Encumbrance Certificate (EC)?',
      a: 'An Encumbrance Certificate (EC) is an official certificate from the Sub-Registrar Office (Registration Department) showing all registered financial encumbrances, mortgages, liens, or court attachments on the property over a given period (OPV advises 30 years). Form 15 lists all past recorded transactions; Form 16 (Nil EC) confirms no encumbrances exist.'
    },
    {
      q: 'What is Mutation in Property?',
      a: 'Mutation is the formal recording of the new owner\'s name in local municipal (GHMC/CDMA) or revenue (Dharani/Pattadar passbook) land records after registration. While registration transfers legal title, mutation ensures property tax assessments, electricity meters, and water connections are issued in the new owner\'s name.'
    }
  ],

  about: {
    overview: "Open Plots & Villas (OPV) is India's First AI-Powered Real Estate Platform and end-to-end property solutions company. Headquartered in Madhapur, Hyderabad, OPV connects home buyers, land investors, and NRIs with 100% verified, legal-scrutinized open plots, luxury gated community villas, apartments, commercial properties, and farm lands.",
    mission: "To make property discovery, buying, selling, and owning simple, secure, transparent, and trustworthy through artificial intelligence and end-to-end execution.",
    vision: "To become India's most trusted real estate ecosystem, delivering peace of mind and complete legal security from land acquisition to housewarming.",
    whyOPV: [
      "100% Verified Clear-Title Listings: Strict 30-year link document verification before any property is listed.",
      "Only HMDA, DTCP, and RERA Approved Layouts: Zero unauthorized or unapproved layouts.",
      "Comprehensive 360° Elite Services: From Bhoomi Pooja, home loans, legal checks to Gruhapravesam housewarming.",
      "AI-Powered Smart Matchmaker: Match properties accurately by corridor, budget, and configuration.",
      "Dedicated NRI Advisory Desk: Remote video tours, embassy-attested POA, and asset management for global Indians.",
      "Zero Brokerage Options: Direct connect with verified builders and trusted sellers."
    ]
  },

  propertyOperations: {
    buying: "OPV provides comprehensive home buyer guidance: personalized property shortlisting, free site visits, 30-year legal due diligence, home loan assistance, registration, and mutation support.",
    selling: "Property owners, builders, and agents can 'Post Property for FREE' on the OPV website and Open Plots mobile app, gaining direct access to thousands of pre-qualified buyers and NRI investors with zero listing fees.",
    rentals: "Verified residential and commercial rental listings with tenant background verification, lease drafting, and rental agreement support."
  },

  aiDiscovery: {
    title: "AI-Powered Property Discovery",
    tagline: "India's First Agentic AI Real Estate Platform",
    features: [
      {
        name: "Agentic AI Search",
        desc: "Lifestyle-based matching tailored to commute preferences, family lifestyle, and budget parameters."
      },
      {
        name: "Automated Legal Audit",
        desc: "Instant automated document checks verifying layout permits, EC status, and ownership chain."
      },
      {
        name: "Predictive ROI Analytics",
        desc: "Advanced neural models forecasting property appreciation with 94% accuracy based on 50+ regional infrastructure data points (metro phase, ORR/RRR exits, IT corridors)."
      },
      {
        name: "360° Unified Ecosystem",
        desc: "Single connected portal for discovering, buying, financing, building, and celebrating homeownership."
      }
    ]
  },

  investmentGuidance: {
    topCorridors: [
      {
        name: "Shadnagar & South Growth Corridor (Bangalore Highway NH-44)",
        highlights: "Proximity to Rajiv Gandhi International Airport, proposed Metro extension, Regional Ring Road (RRR) junction. High capital appreciation for open residential plots."
      },
      {
        name: "Kokapet & Neopolis (Financial District Corridor)",
        highlights: "Hyderabad's prime high-density luxury corridor with ultra-premium high-rise flats and triplex villas near Outer Ring Road."
      },
      {
        name: "Tellapur & Kollur (West Growth Hub)",
        highlights: "Leading residential hub near IT hubs with international schools, world-class clubhouses, and premium gated communities."
      },
      {
        name: "Patancheru & Sangareddy (Mumbai Highway NH-65)",
        highlights: "Fast-developing residential and industrial growth zone with great connectivity to IIT Hyderabad and West ORR."
      },
      {
        name: "Chevella & Shankarpally (Green Farmland Corridor)",
        highlights: "Idyllic weekend farmhouses, fruit plantations, and clear-title agricultural farmlands within 45-60 min drive of the IT corridor."
      }
    ],
    principles: [
      "Always verify HMDA / DTCP layout sanctions and TSRERA registration numbers before investing.",
      "Check 30-year Nil Encumbrance Certificate (EC) to confirm zero bank lien or mortgage.",
      "Invest in master plan growth corridors aligned with upcoming infrastructure like the Regional Ring Road (RRR).",
      "Avoid unregistered plots or unapproved layouts which face government demolition and lack municipal amenities."
    ]
  },

  educationalContent: {
    unitConversions: [
      "1 Gunta = 121 Sq.Yd. (Square Yards) = 1,089 Sq.Ft.",
      "1 Acre = 40 Guntas = 4,840 Sq.Yd. = 43,560 Sq.Ft.",
      "1 Square Yard (Sq.Yd. / Gajam) = 9 Sq.Ft. = 0.836 Square Meters",
      "1 Square Meter = 1.196 Sq.Yd. = 10.764 Sq.Ft.",
      "1 Cent (in South India) = 48.4 Sq.Yd. = 435.6 Sq.Ft. (approx 2.5 cents = 1 Gunta)"
    ],
    terminology: [
      { term: "Carpet Area", definition: "Actual usable area within the inner walls of the apartment or house (excluding wall thickness and common areas)." },
      { term: "Built-up Area", definition: "Carpet area plus the thickness of internal and external walls plus balcony area." },
      { term: "Super Built-up Area", definition: "Built-up area plus proportionate share of common areas (corridors, lifts, clubhouse, staircase, lobby)." },
      { term: "FSI / FAR", definition: "Floor Space Index / Floor Area Ratio: Ratio of total allowable built-up area to the total plot area as mandated by local municipal bylaws." },
      { term: "Dharani Portal", definition: "The integrated land records management system of Telangana for transparent registration and mutation of agricultural and rural lands." }
    ]
  },

  regulatoryGuides: {
    hmda: {
      title: "HMDA (Hyderabad Metropolitan Development Authority)",
      definition: "HMDA is the apex statutory urban development agency governing Hyderabad and surrounding districts across a 7,257 sq. km area.",
      whyEssential: "HMDA approval guarantees that the layout complies with Master Plan zoning, mandatory road widths (minimum 30ft/40ft BT roads), 7.5% - 10% public park & utility spaces handed over to the government, underground drainage, and piped drinking water. HMDA approved plots are 100% safe from future municipal demolitions.",
      registrationRule: "In Telangana, unapproved or non-HMDA plots cannot be registered at Sub-Registrar Offices."
    },
    dtcp: {
      title: "DTCP (Directorate of Town and Country Planning)",
      definition: "DTCP is the statutory planning authority governing layout sanctions in municipalities, nagar panchayats, and rural zones across Telangana located outside HMDA jurisdiction.",
      whyEssential: "DTCP layout approval ensures legal title verification, standard road connectivity (minimum 33ft/40ft), public amenity reservations, and demarcation from agricultural buffer zones."
    },
    hmdaVsDtcp: {
      summary: "HMDA governs urban developments within the Hyderabad metropolitan area with higher infrastructure requirements and fast capital appreciation. DTCP regulates semi-urban, rural, and district growth corridors beyond the HMDA boundary (e.g. outer Shadnagar, Yadagirigutta, etc.). Both provide 100% legal safety when fully approved."
    },
    rera: {
      title: "RERA (Real Estate Regulatory Authority / TSRERA)",
      definition: "RERA is a landmark legislation (under Telangana RERA) created to protect real estate buyers and instill transparency.",
      regulations: "Every real estate project exceeding 500 square meters or more than 8 residential/commercial units must register with TSRERA before marketing, advertising, or selling.",
      buyerProtection: "Builders must deposit 70% of buyer payments into a dedicated escrow account solely for construction, ensuring timely handover. Builders are held liable for structural defects for 5 years."
    },
    ec: {
      title: "Encumbrance Certificate (EC)",
      definition: "An Encumbrance Certificate (EC) is an official document from the Sub-Registrar Office (SRO) confirming whether a property has any registered financial encumbrances, bank loans, mortgages, or court injunctions.",
      form15VsForm16: "Form 15 lists all registered historical transactions on the property. Form 16 (Nil Encumbrance Certificate) certifies that no encumbrances exist during the searched period. OPV recommends a 30-year EC check."
    },
    mutation: {
      title: "Property Mutation (Dharani & Municipal)",
      definition: "Mutation is the formal process of updating the ownership record in the government revenue books after property registration.",
      differenceFromRegistration: "Registration legally transfers title ownership between buyer and seller. Mutation records the buyer's name in municipal (GHMC/CDMA) or revenue (Dharani portal) records so property tax, water bills, and electricity meters are issued in the new owner's name."
    },
    registration: {
      title: "Property Registration in Telangana",
      process: "Conducted at the local Sub-Registrar Office (SRO) under the Registration Act, 1908.",
      charges: "Total stamp duty, transfer duty, and registration charges amount to ~7.5% of the property's market or guideline value in Telangana.",
      documentsRequired: [
        "Registered 30-year link documents",
        "Latest Encumbrance Certificate (EC)",
        "HMDA / DTCP layout sanction letter & blueprint",
        "Pattadar Passbook / Mutation proceeding",
        "Aadhaar and PAN cards of buyer and seller",
        "Two witnesses with photo identity cards"
      ],
      witnessInfo: "Any competent adult not party to the transaction can witness property registration by producing valid photo ID (Aadhaar or PAN).",
      nonRegistrationEffects: "Unregistered property documents do not convey legal title, cannot be used for bank loans or mutation, and risk disputes."
    },
    powerOfAttorney: {
      title: "Power of Attorney (POA) in Property Transactions",
      definition: "A Power of Attorney (POA) authorizes an agent to act on behalf of the owner in property purchase, sale, or management.",
      rules: "Must be registered as General Power of Attorney (GPA) or Special Power of Attorney (SPA). If executed abroad by NRIs, it requires Indian Embassy or Consulate attestation and adjudication in India."
    },
    verificationChecklist: [
      "1. Verify 30-year link documents to trace clear title ownership without disputes.",
      "2. Verify HMDA / DTCP layout approval permit and TSRERA registration number.",
      "3. Procure a 30-year Nil Encumbrance Certificate (EC) from the Sub-Registrar Office.",
      "4. Conduct a physical GPS land boundary survey to eliminate encroachment risks.",
      "5. Cross-check Master Plan zoning to confirm land is residential or commercial."
    ]
  },

  approvedProjects: [
    {
      name: "Golden Terra",
      title: "Golden Terra",
      location: "Shadnagar, Bangalore Highway (NH-44), Hyderabad",
      approval: "HMDA & RERA Approved",
      price: "₹ 56 Lakhs",
      priceNumeric: 5600000,
      type: "plot",
      area: "200 Sq.Yd.",
      description: "HMDA & RERA approved mega-township layout in Shadnagar on the Bangalore Highway (NH-44). Features a grand entrance arch, 40ft blacktop roads, underground electricity & drainage, 24/7 security, avenue plantation, children's play areas, and clubhouse amenities."
    },
    {
      name: "Sanjeevani Golden Valley",
      title: "Sanjeevani Golden Valley",
      location: "Kothur, Bangalore Highway, Hyderabad",
      approval: "DTCP & RERA Approved",
      price: "₹ 18 Lakhs",
      priceNumeric: 1800000,
      type: "plot",
      area: "150 Sq.Yd.",
      description: "DTCP & RERA approved affordable layout in Kothur along the fast-appreciating Bangalore Highway corridor. High growth potential, immediate registration, and ready to construct."
    },
    {
      name: "NRI Green County",
      title: "NRI Green County",
      location: "Sadashivpet Town, Mumbai Highway (NH-65), Hyderabad",
      approval: "HMDA & RERA Approved",
      price: "₹ 36.74 Lakhs",
      priceNumeric: 3674000,
      type: "plot",
      area: "167 Sq.Yd.",
      description: "HMDA & RERA approved layout along the Mumbai Highway near Sadashivpet. Features blacktop roads, underground cabling, compound wall, and quick connectivity to industrial corridors."
    },
    {
      name: "Katyayani Estates",
      title: "Katyayani Estates",
      location: "Lemoor, Srisailam Highway, Hyderabad",
      approval: "HMDA & RERA Approved",
      price: "₹ 34 Lakhs",
      priceNumeric: 3400000,
      type: "plot",
      area: "171 Sq.Yd.",
      description: "HMDA & RERA approved premium layout situated at Lemoor near Rajiv Gandhi International Airport and Pharma City. Clear 30-year search title with underground utilities and avenue plantation."
    },
    {
      name: "Vasavi Archana County",
      title: "Vasavi Archana County",
      location: "Kethireddipally, Hyderabad",
      approval: "RERA Approved",
      price: "₹ 35 Lakhs",
      priceNumeric: 3500000,
      type: "plot",
      area: "200 Sq.Yd.",
      description: "RERA approved residential layout in Kethireddipally with clear legal titles and immediate registration."
    },
    {
      name: "Tellapur Neopolis Villas",
      title: "Tellapur Neopolis Villas",
      location: "Tellapur, near Financial District & Neopolis Kokapet, Hyderabad",
      approval: "HMDA & RERA Approved",
      price: "₹ 3.8 Cr",
      priceNumeric: 38000000,
      type: "villa",
      area: "4200 Sq.Ft.",
      description: "Ultra-luxury triplex contemporary villas in Tellapur near Neopolis Kokapet. Features 4 BHK + home theatre, private garden, Italian marble, smart home automation, and world-class clubhouse."
    }
  ]
};
