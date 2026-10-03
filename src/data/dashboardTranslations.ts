import { LanguageCode } from '../types/chat';

export interface DashboardLocaleStrings {
  brandTitle: string;
  brandSubtitle: string;
  newChat: string;
  startFreshSearch: string;
  recentChats: string;
  noRecentChats: string;
  clearAllChatsTooltip: string;
  deleteChatTooltip: string;
  headerTagline: string;
  platformBadge: string;
  searchingListings: string;
  clearHistoryConfirm: string;
}

export const DASHBOARD_TRANSLATIONS: Record<LanguageCode, DashboardLocaleStrings> = {
  en: {
    brandTitle: 'Open Plots & Villas',
    brandSubtitle: 'Real Estate AI',
    newChat: 'New Chat',
    startFreshSearch: 'Start a fresh search',
    recentChats: 'Recent Chats',
    noRecentChats: 'No recent chats yet',
    clearAllChatsTooltip: 'Clear all chats',
    deleteChatTooltip: 'Delete chat',
    headerTagline: 'Search smarter · Find faster · Buy better',
    platformBadge: "India's First AI-Powered Real Estate Platform",
    searchingListings: 'Searching verified listings from database...',
    clearHistoryConfirm: 'Clear all chat history?'
  },
  te: {
    brandTitle: 'ఓపెన్ ప్లాట్స్ & విల్లాస్',
    brandSubtitle: 'రియల్ ఎస్టేట్ AI',
    newChat: 'కొత్త చాట్',
    startFreshSearch: 'కొత్త శోధన ప్రారంభించండి',
    recentChats: 'ఇటీవలి చాట్‌లు',
    noRecentChats: 'ఇంకా ఇటీవలి చాట్‌లు లేవు',
    clearAllChatsTooltip: 'అన్ని చాట్‌లను తొలగించండి',
    deleteChatTooltip: 'చాట్‌ని తొలగించండి',
    headerTagline: 'తెలివిగా శోధించండి · వేగంగా కనుగొనండి · ఉత్తమంగా కొనండి',
    platformBadge: 'భారతదేశపు మొట్టమొదటి AI-ఆధారిత రియల్ ఎస్టేట్ ప్లాట్‌ఫామ్',
    searchingListings: 'ధృవీకరించబడిన ప్రాపర్టీలను శోధిస్తోంది...',
    clearHistoryConfirm: 'అన్ని చాట్ హిస్టరీని క్లియర్ చేయాలా?'
  },
  hi: {
    brandTitle: 'ओपन प्लॉट्स एंड विला',
    brandSubtitle: 'रियल एस्टेट AI',
    newChat: 'नई बातचीत',
    startFreshSearch: 'नई खोज शुरू करें',
    recentChats: 'हाल की बातचीत',
    noRecentChats: 'अभी तक कोई हालिया बातचीत नहीं',
    clearAllChatsTooltip: 'सभी बातचीत साफ़ करें',
    deleteChatTooltip: 'बातचीत हटाएं',
    headerTagline: 'स्मार्ट खोजें · तेज़ी से पाएं · बेहतर खरीदें',
    platformBadge: 'भारत का पहला AI-संचालित रियल एस्टेट प्लेटफ़ॉर्म',
    searchingListings: 'सत्यापित संपत्तियां खोजी जा रही हैं...',
    clearHistoryConfirm: 'क्या आप सभी चैट इतिहास साफ़ करना चाहते हैं?'
  },
  ta: {
    brandTitle: 'ஓபன் பிளாட்ஸ் & வில்லாஸ்',
    brandSubtitle: 'ரியல் எஸ்டேட் AI',
    newChat: 'புதிய அரட்டை',
    startFreshSearch: 'புதிய தேடலைத் தொடங்குங்கள்',
    recentChats: 'சமீபத்திய அரட்டைகள்',
    noRecentChats: 'இன்னும் சமீபத்திய அரட்டைகள் இல்லை',
    clearAllChatsTooltip: 'எல்லா அரட்டைகளையும் அழிக்கவும்',
    deleteChatTooltip: 'அரட்டையை நீக்கு',
    headerTagline: 'புத்திசாலித்தனமாகத் தேடுங்கள் · வேகமாக கண்டறியுங்கள் · சிறப்பாக வாங்குங்கள்',
    platformBadge: 'இந்தியாவின் முதல் AI-இயங்கும் ரியல் எஸ்டேட் தளம்',
    searchingListings: 'சரிபார்க்கப்பட்ட பட்டியல்களைத் தேடுகிறது...',
    clearHistoryConfirm: 'அனைத்து அரட்டை வரலாற்றையும் அழிக்கவா?'
  },
  kn: {
    brandTitle: 'ಓಪನ್ ಪ್ಲಾಟ್ಸ್ & ವಿಲ್ಲಾಸ್',
    brandSubtitle: 'ರಿಯಲ್ ಎಸ್ಟೇಟ್ AI',
    newChat: 'ಹೊಸ ಚಾಟ್',
    startFreshSearch: 'ಹೊಸ ಹುಡುಕಾಟ ಪ್ರಾರಂಭಿಸಿ',
    recentChats: 'ಇತ್ತೀಚಿನ ಚಾಟ್‌ಗಳು',
    noRecentChats: 'ಇನ್ನೂ ಯಾವುದೇ ಇತ್ತೀಚಿನ ಚಾಟ್‌ಗಳಿಲ್ಲ',
    clearAllChatsTooltip: 'ಎಲ್ಲಾ ಚಾಟ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
    deleteChatTooltip: 'ಚಾಟ್ ಅಳಿಸಿ',
    headerTagline: 'ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಹುಡುಕಿ · ವೇಗವಾಗಿ ಕಂಡುಕೊಳ್ಳಿ · ಉತ್ತಮವಾಗಿ ಖರೀದಿಸಿ',
    platformBadge: 'ಭಾರತದ ಮೊದಲ AI-ಚಾಲಿತ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    searchingListings: 'ಪರಿಶೀಲಿಸಿದ ಪಟ್ಟಿಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    clearHistoryConfirm: 'ಎಲ್ಲಾ ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಬೇಕೇ?'
  },
  ml: {
    brandTitle: 'ഓപ്പൺ പ്ലോട്ട്സ് & വില്ലാസ്',
    brandSubtitle: 'റിയൽ എസ്റ്റേറ്റ് AI',
    newChat: 'പുതിയ ചാറ്റ്',
    startFreshSearch: 'പുതിയ തിരയൽ ആരംഭിക്കുക',
    recentChats: 'സമീപകാല ചാറ്റുകൾ',
    noRecentChats: 'സമീപകാല ചാറ്റുകൾ ഒന്നും ലഭ്യമല്ല',
    clearAllChatsTooltip: 'എല്ലാ ചാറ്റുകളും മായ്ക്കുക',
    deleteChatTooltip: 'ചാറ്റ് ഇല്ലാതാക്കുക',
    headerTagline: 'മികച്ച രീതിയിൽ തിരയുക · വേഗത്തിൽ കണ്ടെത്തുക · മികച്ചത് വാങ്ങുക',
    platformBadge: 'ഇന്ത്യയിലെ ആദ്യത്തെ AI-പവർഡ് റിയൽ എസ്റ്റേറ്റ് പ്ലാറ്റ്‌ഫോം',
    searchingListings: 'പരിശോധിച്ച ലിസ്റ്റിംഗുകൾ തിരയുന്നു...',
    clearHistoryConfirm: 'എല്ലാ ചാറ്റ് ചരിത്രവും മായ്‌ക്കണോ?'
  },
  mr: {
    brandTitle: 'ओपन प्लॉट्स आणि व्हिला',
    brandSubtitle: 'रिअल इस्टेट AI',
    newChat: 'नवीन चॅट',
    startFreshSearch: 'नवीन शोध सुरू करा',
    recentChats: 'अलीकडील चॅट्स',
    noRecentChats: 'अद्याप अलीकडील चॅट्स नाहीत',
    clearAllChatsTooltip: 'सर्व चॅट्स साफ करा',
    deleteChatTooltip: 'चॅट हटवा',
    headerTagline: 'हुशारीने शोधा · जलद शोधा · उत्तम खरेदी करा',
    platformBadge: 'भारतातील पहिले AI-आधारित रिअल इस्टेट प्लॅटफॉर्म',
    searchingListings: 'सत्यापित मालमत्ता शोधत आहे...',
    clearHistoryConfirm: 'सर्व चॅट इतिहास हटवायचा?'
  },
  bn: {
    brandTitle: 'ওপেন প্লটস অ্যান্ড ভিলাস',
    brandSubtitle: 'রিয়েল এস্টেট AI',
    newChat: 'নতুন চ্যাট',
    startFreshSearch: 'নতুন সন্ধান শুরু করুন',
    recentChats: 'সাম্প্রতিক চ্যাট',
    noRecentChats: 'এখনও সাম্প্রতিক চ্যাট নেই',
    clearAllChatsTooltip: 'সমস্ত চ্যাট মুছুন',
    deleteChatTooltip: 'চ্যাট মুছুন',
    headerTagline: 'স্মার্ট অনুসন্ধান · দ্রুত সন্ধান · আরও ভালো কিনুন',
    platformBadge: 'ভারতের প্রথম এআই-চালিত রিয়েল এস্টেট প্ল্যাটফর্ম',
    searchingListings: 'যাচাইকৃত তালিকা অনুসন্ধান করা হচ্ছে...',
    clearHistoryConfirm: 'সমস্ত চ্যাট ইতিহাস মুছে ফেলবেন?'
  },
  gu: {
    brandTitle: 'ઓપન પ્લોટ્સ અને વિલા',
    brandSubtitle: 'રિયલ એસ્ટેટ AI',
    newChat: 'નવી ચેટ',
    startFreshSearch: 'નવી શોધ શરૂ કરો',
    recentChats: 'તાજેતરની ચેટ્સ',
    noRecentChats: 'હજુ સુધી કોઈ તાજેતરની ચેટ્સ નથી',
    clearAllChatsTooltip: 'બધી ચેટ સાફ કરો',
    deleteChatTooltip: 'ચેટ કાઢી નાખો',
    headerTagline: 'સ્માર્ટ શોધો · ઝડપથી મેળવો · શ્રેષ્ઠ ખરીદો',
    platformBadge: 'ભારતનું પ્રથમ AI-સંચાલિત રિયલ એસ્ટેટ પ્લેટફોર્મ',
    searchingListings: 'ચકાસાયેલ લિસ્ટિંગ શોધી રહ્યું છે...',
    clearHistoryConfirm: 'બધા ચેટ ઇતિહાસને સાફ કરવો છે?'
  },
  ur: {
    brandTitle: 'اوپن پلاٹس اینڈ ولاز',
    brandSubtitle: 'ریئل اسٹیٹ AI',
    newChat: 'نئی چیٹ',
    startFreshSearch: 'نئی تلاش شروع کریں',
    recentChats: 'حالیہ چیٹس',
    noRecentChats: 'ابھی تک کوئی حالیہ چیٹس نہیں',
    clearAllChatsTooltip: 'تمام چیٹس صاف کریں',
    deleteChatTooltip: 'چیٹ حذف کریں',
    headerTagline: 'سمجھداری سے تلاش کریں · تیزی سے پائیں · بہتر خریدیں',
    platformBadge: 'ہندوستان کا پہلا AI سے چلنے والا ریئل اسٹیٹ پلیٹ فارم',
    searchingListings: 'تصدیق شدہ فہرستیں تلاش کی جا رہی ہیں...',
    clearHistoryConfirm: 'کیا آپ چیٹ کی تمام تاریخ صاف کرنا چاہتے ہیں؟'
  },
  pa: {
    brandTitle: 'ਓਪਨ ਪਲਾਟਸ ਅਤੇ ਵਿਲਾ',
    brandSubtitle: 'ਰੀਅਲ ਅਸਟੇਟ AI',
    newChat: 'ਨਵੀਂ ਗੱਲਬਾਤ',
    startFreshSearch: 'ਇੱਕ ਨਵੀਂ ਖੋਜ ਸ਼ੁਰੂ ਕਰੋ',
    recentChats: 'ਹਾਲੀਆ ਗੱਲਬਾਤ',
    noRecentChats: 'ਅਜੇ ਕੋਈ ਹਾਲੀਆ ਗੱਲਬਾਤ ਨਹੀਂ',
    clearAllChatsTooltip: 'ਸਾਰੀਆਂ ਗੱਲਾਂ ਸਾਫ਼ ਕਰੋ',
    deleteChatTooltip: 'ਗੱਲਬਾਤ ਮਿਟਾਓ',
    headerTagline: 'ਸਮਝਦਾਰੀ ਨਾਲ ਖੋਜੋ · ਤੇਜ਼ੀ ਨਾਲ ਲੱਭੋ · ਬਿਹਤਰ ਖਰੀਦੋ',
    platformBadge: 'ਭਾਰਤ ਦਾ ਪਹਿਲਾ AI-ਅਧਾਰਿਤ ਰੀਅਲ ਅਸਟੇਟ ਪਲੇਟਫਾਰਮ',
    searchingListings: 'ਪ੍ਰਮਾਣਿਤ ਜਾਇਦਾਦਾਂ ਦੀ ਖੋਜ ਜਾਰੀ ਹੈ...',
    clearHistoryConfirm: 'ਸਾਰੀ ਗੱਲਬਾਤ ਹਿਸਟਰੀ ਸਾਫ਼ ਕਰਨੀ ਹੈ?'
  },
  or: {
    brandTitle: 'ଓପନ୍ ପ୍ଲଟ୍ସ & ଭିଲାସ୍',
    brandSubtitle: 'ରିଅଲ୍ ଇଷ୍ଟେଟ୍ AI',
    newChat: 'ନୂଆ ଚାଟ୍',
    startFreshSearch: 'ନୂତନ ସନ୍ଧାନ ଆରମ୍ଭ କରନ୍ତୁ',
    recentChats: 'ସାମ୍ପ୍ରତିକ ଚାଟ୍',
    noRecentChats: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସାମ୍ପ୍ରତିକ ଚାଟ୍ ନାହିଁ',
    clearAllChatsTooltip: 'ସମସ୍ତ ଚାଟ୍ ସଫା କରନ୍ତୁ',
    deleteChatTooltip: 'ଚାଟ୍ ବିଲୋପ କରନ୍ତୁ',
    headerTagline: 'ସ୍ମାର୍ଟ ସନ୍ଧାନ କରନ୍ତୁ · ଶୀଘ୍ର ଖୋଜନ୍ତୁ · ଉତ୍ତମ କ୍ରୟ କରନ୍ତୁ',
    platformBadge: 'ଭାରତର ପ୍ରଥମ AI-ଚାଳିତ ରିଅଲ୍ ଇଷ୍ଟେଟ୍ ପ୍ଲାଟଫର୍ମ',
    searchingListings: 'ଯାଞ୍ଚ ହୋଇଥିବା ପ୍ରପର୍ଟି ସନ୍ଧାନ ଚାଲିଛି...',
    clearHistoryConfirm: 'ସମସ୍ତ ଚାଟ୍ ଇତିହାସ ସଫା କରିବେ କି?'
  },
  mwr: {
    brandTitle: 'ओपन प्लॉट्स एंड विला',
    brandSubtitle: 'रियल एस्टेट AI',
    newChat: 'नयी बातचीत',
    startFreshSearch: 'नयी खोज शुरू करो',
    recentChats: 'हाल री बातचीत',
    noRecentChats: 'हाल तक कोई बातचीत कोनी',
    clearAllChatsTooltip: 'सगळी बातचीत साफ करो',
    deleteChatTooltip: 'बातचीत हटाओ',
    headerTagline: 'समझदारी सूं खोजो · जल्दी पाओ · बढ़िया खरीदो',
    platformBadge: 'भारत रो पहलो AI संचालित रियल एस्टेट प्लेटफ़ॉर्म',
    searchingListings: 'सत्यापित संपत्तियां खोजी जा रही हैं...',
    clearHistoryConfirm: 'सगळी बातचीत साफ करनी है?'
  },
  as: {
    brandTitle: 'অ’পেন প্লটছ এণ্ড ভিলাছ',
    brandSubtitle: 'ৰিয়েল এষ্টেট AI',
    newChat: 'নতুন চেট',
    startFreshSearch: 'নতুন সন্ধান আৰম্ভ কৰক',
    recentChats: 'শেহতীয়া চেট',
    noRecentChats: 'এতিয়ালৈকে কোনো শেহতীয়া চেট নাই',
    clearAllChatsTooltip: 'সকলো চেট মচক',
    deleteChatTooltip: 'চেট মচক',
    headerTagline: 'স্মাৰ্টভাৱে সন্ধান কৰক · সোনকালে বিচাৰক · ভাল ক্ৰয় কৰক',
    platformBadge: 'ভাৰতৰ প্ৰথম AI-চালিত ৰিয়েল এষ্টেট প্লেটফৰ্ম',
    searchingListings: 'প্ৰমাণিত তালিকা সন্ধান কৰা হৈছে...',
    clearHistoryConfirm: 'সকলো চেট ইতিহাস মচিবনে?'
  },
  mai: {
    brandTitle: 'ओपन प्लॉट्स आ विला',
    brandSubtitle: 'रियल एस्टेट AI',
    newChat: 'नव गपशप',
    startFreshSearch: 'नव खोज शुरू करू',
    recentChats: 'हालक गपशप',
    noRecentChats: 'अखन धरि कोनो हालक गपशप नहि',
    clearAllChatsTooltip: 'सभटा गपशप साफ करू',
    deleteChatTooltip: 'गपशप हटाउ',
    headerTagline: 'स्मार्ट खोजू · तेजी सं पाबू · नीक खरीदू',
    platformBadge: 'भारतक पहिल AI-संचालित रियल एस्टेट प्लेटफ़ॉर्म',
    searchingListings: 'सत्यापित संपत्ति खोजल जा रहल अछि...',
    clearHistoryConfirm: 'सभटा गपशप साफ करब?'
  },
  sat: {
    brandTitle: 'Open Plots & Villas',
    brandSubtitle: 'Real Estate AI',
    newChat: 'ᱱᱟᱣᱟ ᱜᱟᱞᱢᱟᱨᱟᱣ',
    startFreshSearch: 'ᱱᱟᱣᱟ ᱯᱟᱸᱡᱟ ᱮᱛᱚᱦᱚᱵᱽ',
    recentChats: 'ᱱᱤᱛᱚᱜᱟᱜ ᱜᱟᱞᱢᱟᱨᱟᱣ',
    noRecentChats: 'ᱱᱤᱛᱚᱜ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱹᱱᱩᱜ-ᱟ',
    clearAllChatsTooltip: 'ᱡᱚᱛᱚ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱢᱮᱴᱟᱣ',
    deleteChatTooltip: 'ᱜᱟᱞᱢᱟᱨᱟᱣ ᱢᱮᱴᱟᱣ',
    headerTagline: 'Search smarter · Find faster · Buy better',
    platformBadge: "India's First AI-Powered Real Estate Platform",
    searchingListings: 'ᱯᱟᱸᱡᱟ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ...',
    clearHistoryConfirm: 'ᱡᱚᱛᱚ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱢᱮᱴᱟᱣᱟ?'
  },
  ks: {
    brandTitle: 'اوپن پلاٹس اینڈ ولاز',
    brandSubtitle: 'ریئل اسٹیٹ AI',
    newChat: 'نٔو کتھ باتھ',
    startFreshSearch: 'نٔو تلاش شۆروٗع کٔرِو',
    recentChats: 'حالیہ کتھ باتھ',
    noRecentChats: 'کانٛہہ حالیہ کتھ باتھ نہٕ',
    clearAllChatsTooltip: 'سٲری کتھ باتھ صفا کٔرِو',
    deleteChatTooltip: 'کتھ باتھ مٹٲوِو',
    headerTagline: 'سمجھدٲری سان ژھانٛڈِو · تیزی سان حٲصل کٔرِو',
    platformBadge: 'ہندوستانک گۄڈنیک AI ریئل اسٹیٹ پلیٹ فارم',
    searchingListings: 'ژھانٛڈ جاری چھُ...',
    clearHistoryConfirm: 'سٲری کتھ باتھ ہسٹری صفا کرٕنۍ؟'
  },
  bho: {
    brandTitle: 'ओपन प्लॉट्स आ विला',
    brandSubtitle: 'रियल एस्टेट AI',
    newChat: 'नया बात-चीत',
    startFreshSearch: 'नया खोज शुरू करीं',
    recentChats: 'हाल के बात-चीत',
    noRecentChats: 'अभी ले कवनो हाल के बात-चीत नइखे',
    clearAllChatsTooltip: 'सभ बात-चीत साफ़ करीं',
    deleteChatTooltip: 'बात-चीत हटाईं',
    headerTagline: 'स्मार्ट खोजीं · जल्दी पाईं · बढ़िया खरीदीं',
    platformBadge: 'भारत के पहिला AI-संचालित रियल एस्टेट प्लेटफ़ॉर्म',
    searchingListings: 'सत्यापित संपत्ति खोजल जा रहल बा...',
    clearHistoryConfirm: 'सभ चैट इतिहास मिटावे के बा?'
  },
  ne: {
    brandTitle: 'ओपन प्लट्स र भिल्लाहरू',
    brandSubtitle: 'रियल इस्टेट AI',
    newChat: 'नयाँ कुराकानी',
    startFreshSearch: 'नयाँ खोज सुरु गर्नुहोस्',
    recentChats: 'भर्खरका कुराकानीहरू',
    noRecentChats: 'अहिलेसम्म कुनै भर्खरको कुराकानी छैन',
    clearAllChatsTooltip: 'सबै कुराकानी हटाउनुहोस्',
    deleteChatTooltip: 'कुराकानी हटाउनुहोस्',
    headerTagline: 'स्मार्ट खोज्नुहोस् · छिटो भेट्टाउनुहोस् · राम्रो किन्नुहोस्',
    platformBadge: 'भारतको पहिलो AI-संचालित रियल इस्टेट प्लेटफर्म',
    searchingListings: 'प्रमाणित सूचीहरू खोजिँदैछ...',
    clearHistoryConfirm: 'सबै च्याट इतिहास खाली गर्ने?'
  },
  sd: {
    brandTitle: 'اوپن پلاٽس ۽ ولاز',
    brandSubtitle: 'ريئل اسٽيٽ AI',
    newChat: 'نئين چيٽ',
    startFreshSearch: 'نئين ڳولا شروع ڪريو',
    recentChats: 'تازو چيٽس',
    noRecentChats: 'اڃا تائين ڪا به تازو چيٽ ناهي',
    clearAllChatsTooltip: 'سڀ چيٽس صاف ڪريو',
    deleteChatTooltip: 'چيٽ ختم ڪريو',
    headerTagline: 'سمجھداري سان ڳوليو · جلدي حاصل ڪريو',
    platformBadge: 'انڊيا جو پهريون AI هلندڙ ريئل اسٽيٽ پليٽ فارم',
    searchingListings: 'ڳولا جاري آهي...',
    clearHistoryConfirm: 'ڇا سڀ چيٽ تاريخ صاف ڪرڻ چاهيو ٿا؟'
  },
  kok: {
    brandTitle: 'ओपन प्लॉट्स आनी विला',
    brandSubtitle: 'रिअल इस्टेट AI',
    newChat: 'नवी चॅट',
    startFreshSearch: 'नवो सोद सुरू करात',
    recentChats: 'हालींच्यो चॅट्स',
    noRecentChats: 'अजुनूय हालींच्यो चॅट्स नात',
    clearAllChatsTooltip: 'सगळ्यो चॅट्स नितळ करात',
    deleteChatTooltip: 'चॅट काडून उडयात',
    headerTagline: 'हुशारेन सोदात · बेगीन मेळयात · बरें विकतें घियात',
    platformBadge: 'भारतांतलें पयलें AI-आधारित रिअल इस्टेट प्लॅटफॉर्म',
    searchingListings: 'तपासणी केल्ल्यो मालमत्ता सोदता...',
    clearHistoryConfirm: 'सगळ्यो चॅट्स काडून उडोवंक जाय?'
  },
  bgc: {
    brandTitle: 'ओपन प्लॉट्स अर विला',
    brandSubtitle: 'रियल एस्टेट AI',
    newChat: 'नयी बातचीत',
    startFreshSearch: 'नयी खोज शुरू करो',
    recentChats: 'हाल की बातचीत',
    noRecentChats: 'इब तक कोई बातचीत कोन्या',
    clearAllChatsTooltip: 'सारी बातचीत साफ करो',
    deleteChatTooltip: 'बातचीत हटाओ',
    headerTagline: 'समझदारी ते खोजो · जल्दी पाओ · बढ़िया खरीदो',
    platformBadge: 'भारत का पहला AI आधारित रियल एस्टेट प्लेटफ़ॉर्म',
    searchingListings: 'सत्यापित संपत्तियां खोजी जा रही हैं...',
    clearHistoryConfirm: 'सारी बातचीत साफ करनी स?'
  },
  hne: {
    brandTitle: 'ओपन प्लॉट्स अउ विला',
    brandSubtitle: 'रियल एस्टेट AI',
    newChat: 'नवा गोठ-बात',
    startFreshSearch: 'नवा खोज शुरू करव',
    recentChats: 'हाल के गोठ-बात',
    noRecentChats: 'अभि तक कोनो हाल के गोठ-बात नइ हे',
    clearAllChatsTooltip: 'सब्बो गोठ-बात साफ करव',
    deleteChatTooltip: 'गोठ-बात हटावव',
    headerTagline: 'होशियारी ले खोजव · जल्दी पावव · बढ़िया बिसावव',
    platformBadge: 'भारत के पहिली AI-संचालित रियल एस्टेट प्लेटफ़ॉर्म',
    searchingListings: 'सत्यापित संपत्ति खोजे जावत हे...',
    clearHistoryConfirm: 'सब्बो गोठ-बात इतिहास साफ करे के हे?'
  },
  tcy: {
    brandTitle: 'ಓಪನ್ ಪ್ಲಾಟ್ಸ್ & ವಿಲ್ಲಾಸ್',
    brandSubtitle: 'ರಿಯಲ್ ಎಸ್ಟೇಟ್ AI',
    newChat: 'ಪೊಸ ಚಾಟ್',
    startFreshSearch: 'ಪೊಸ ನಾಡಾಟ ಸುರು ಮಲ್ಪುಲೆ',
    recentChats: 'ಇತ್ತೆದ ಚಾಟ್‌ಲು',
    noRecentChats: 'ದಾಂತಿನ ಚಾಟ್‌ಲು ಇಜ್ಜಿ',
    clearAllChatsTooltip: 'ಮಾತಾ ಚಾಟ್‌ಲೆನ್ ದೆತ್ತ್ ಪಾಡುಲೆ',
    deleteChatTooltip: 'ಚಾಟ್ ದೆತ್ತ್ ಪಾಡುಲೆ',
    headerTagline: 'ಉಷಾರ್ ಆದ್ ನಾಡ್‌ಲೆ · ಬೇಗ ತೂಲೆ · ಎಡ್ಡೆ ಕೊನುಲೆ',
    platformBadge: 'ಭಾರತದ ಸುರೂತ AI-ಆಧಾರಿತ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    searchingListings: 'ನಾಡ್‌ಪುನ ಬೇಲೆ ಆವೊಂದುಂಡು...',
    clearHistoryConfirm: 'ಮಾತಾ ಚಾಟ್ ಇತಿಹಾಸನ್ ದೆತ್ತ್ ಪಾಡೊಡೆ?'
  }
};

export function getDashboardStrings(language: LanguageCode): DashboardLocaleStrings {
  return DASHBOARD_TRANSLATIONS[language] || DASHBOARD_TRANSLATIONS.en;
}
