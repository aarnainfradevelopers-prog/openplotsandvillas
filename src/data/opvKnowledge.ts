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
      q: 'Can NRIs buy agricultural land or open plots in India?',
      a: 'Under FEMA and RBI regulations, NRIs and OCIs can freely purchase residential and commercial real estate in India, including open residential plots and villas. However, buying agricultural land, farmhouses, or plantation properties requires prior RBI permission, though inheriting agricultural land is permitted.'
    },
    {
      q: 'How does OPV verify whether a property is genuine?',
      a: 'Open Plots & Villas performs stringent legal checks: 1) Verification of 30-year title deeds and ownership trail, 2) HMDA / DTCP / RERA approval status verification, 3) Encumbrance Certificate (EC) check for Nil liability, 4) Physical GPS land boundary survey to eliminate encroachment risks.'
    },
    {
      q: 'What is the purpose of property registration and what happens if unregistered?',
      a: 'Property registration under the Registration Act, 1908 transfers legal ownership from seller to buyer. Unregistered agreements do not confer valid legal title in courts, cannot be used to obtain bank loans, and risk property disputes or fraudulent resale.'
    },
    {
      q: 'What is Mutation in Property and why is it essential?',
      a: 'Mutation (Dharani/Pattadar passbook or Municipal record mutation) records the new owner’s name in the government revenue and tax registers. While registration establishes ownership, mutation ensures property tax receipts, electricity meters, and municipal assessments are issued under your name.'
    },
    {
      q: 'What is an Encumbrance Certificate (EC)?',
      a: 'An Encumbrance Certificate (EC) is an official document from the Sub-Registrar Office (SRO) certifying whether the property has any registered liens, mortgages, bank pledges, or court injunctions over a given time period (typically 13 to 30 years).'
    },
    {
      q: 'What 360° services do you offer for new home builders?',
      a: 'From the initial land acquisition, we handle GPS boundary survey, architectural 3D plans, bank home loans, Bhoomi Pooja Vedic ritual arrangement, civil construction supervision, interior design, Vastu alignment, and final Gruhapravesam ceremony.'
    },
    {
      q: 'How can I contact Open Plots & Villas customer desk?',
      a: 'You can reach us at +91 9963513939 or 040 4563 5052, email us at info@openplotsandvillas.com, or visit our headquarters at #101, Road No: 10, Jaya Kesav Avenue, Kakatiya Hills, Madhapur, Hyderabad.'
    }
  ]
};
