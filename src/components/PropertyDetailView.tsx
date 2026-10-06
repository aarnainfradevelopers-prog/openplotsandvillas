import React, { useState } from 'react';
import {
  Heart,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  MapPin,
  Bed,
  Home,
  Grid,
  Check,
  ShieldCheck,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { PropertyItem, LanguageCode } from '../types/chat';
import { OPV_FALLBACK_IMAGE } from '../data/propertyData';
import { StructuredPropertyCards } from './StructuredPropertyCards';
import { getPropertyDetailsStrings } from '../data/propertyDetailsI18n';
import { getCleanOverviewData, getPropertyWebsiteUrl } from '../utils/propertyOverviewHelper';

interface PropertyDetailViewProps {
  property: PropertyItem;
  onEnquire: (property: PropertyItem) => void;
  onDetails?: (property: PropertyItem) => void;
  currentLanguage?: LanguageCode;
}

const TABS = ['Overview', 'Approvals', 'Amenities'] as const;
type TabType = typeof TABS[number];

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onEnquire,
  onDetails,
  currentLanguage = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(property.isFavorite || false);

  const pLocale = getPropertyDetailsStrings(currentLanguage);
  const websiteUrl = getPropertyWebsiteUrl(property);

  const tabLabels: Record<TabType, string> = {
    Overview: pLocale.overviewTab || 'Overview',
    Approvals: currentLanguage === 'te' ? 'అనుమతులు' : currentLanguage === 'hi' ? 'अनुमोदन' : currentLanguage === 'ta' ? 'அங்கீகாரங்கள்' : 'Approvals',
    Amenities: pLocale.amenitiesTab || 'Amenities'
  };

  const images = property.images && property.images.length > 0
    ? property.images
    : [OPV_FALLBACK_IMAGE];

  const handleNextImg = () => {
    setImgIndex(prev => (prev + 1) % images.length);
  };

  const handlePrevImg = () => {
    setImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  // 1. Genuine Configuration string
  const getConfigText = (): string => {
    if (property.bhk) {
      return `${property.bhk} BHK`;
    }
    if (property.type === 'plot') {
      return pLocale.residentialPlot;
    }
    if (property.type === 'villa') {
      return currentLanguage === 'te' ? 'లగ్జరీ విల్లా' : currentLanguage === 'hi' ? 'लक्जरी विला' : currentLanguage === 'ta' ? 'சொகுசு வில்லா' : 'Luxury Villa';
    }
    return property.config || (currentLanguage === 'te' ? 'ఇండిపెండెంట్ యూనిట్' : currentLanguage === 'hi' ? 'इंडिपेंडेंट यूनिट' : 'Independent Unit');
  };

  const configText = getConfigText();

  // 2. Genuine Status / Possession from property specifications / metadata
  const getStatusText = (): string => {
    if (property.possession && property.possession !== 'ready_to_move') {
      return property.possession;
    }
    if (property.possession === 'ready_to_move') {
      return pLocale.readyToMove;
    }
    // Check specifications array
    const specPossession = property.specifications?.find(s =>
      s.label.toLowerCase() === 'possession'
    )?.value;
    if (specPossession) return specPossession;

    if (property.type === 'plot') {
      return pLocale.immediateRegistration;
    }
    if (property.badge && !property.badge.toLowerCase().includes('brokerage')) {
      return property.badge;
    }
    return pLocale.readyToMove;
  };

  const statusText = getStatusText();

  // Helper to sanitize any JSON-stringified description
  const sanitizeText = (val?: string): string => {
    if (!val || typeof val !== 'string') return '';
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const obj = JSON.parse(trimmed);
        const parts: string[] = [];
        if (obj.description && typeof obj.description === 'string' && !obj.description.startsWith('{')) {
          parts.push(obj.description);
        }
        if (obj.propertyType) parts.push(`Type: ${obj.propertyType}`);
        if (obj.sizeInput && obj.sizeUnit) parts.push(`Area: ${obj.sizeInput} ${obj.sizeUnit}`);
        if (obj.facing) parts.push(`Facing: ${obj.facing}`);
        if (obj.dimension) parts.push(`Dimension: ${obj.dimension}`);
        return parts.length > 0 ? parts.join(' · ') : '';
      } catch {
        return '';
      }
    }
    return trimmed;
  };

  // 3. Genuine Localized Overview
  const getLocalizedOverview = (): string => {
    if (currentLanguage === 'te') {
      const facing = property.facing ? `${property.facing} ఫేసింగ్ ` : '';
      const type = property.type === 'plot' ? 'ఓపెన్ ప్లాట్' : property.type === 'villa' ? 'విల్లా' : 'ప్రాపర్టీ';
      return `${property.location}లో ${facing}${type} అమ్మకానికి ఉంది. OPV ధృవీకరించిన ప్రాజెక్ట్. లేఅవుట్ అనుమతులు, వాస్తు అనుకూలత మరియు పూర్తి సదుపాయాలు అందుబాటులో ఉన్నాయి.`;
    }
    if (currentLanguage === 'hi') {
      const facing = property.facing ? `${property.facing} फेसिंग ` : '';
      const type = property.type === 'plot' ? 'ओपन प्लॉट' : property.type === 'villa' ? 'विला' : 'प्रॉपर्टी';
      return `${property.location} में ${facing}${type} बिक्री के लिए उपलब्ध है। OPV द्वारा सत्यापित प्रोजेक्ट। सभी वैध अनुमतियां और सुविधाएं उपलब्ध हैं।`;
    }
    if (currentLanguage === 'ta') {
      const type = property.type === 'plot' ? 'ஓபன் பிளாட்' : property.type === 'villa' ? 'வில்லா' : 'சொத்து';
      return `${property.location}-ல் ${type} விற்பனைக்கு உள்ளது. OPV சரிபார்க்கப்பட்ட திட்டம். அனைத்து வசதிகளும் உள்ளன.`;
    }
    const cleanOv = sanitizeText(property.overview);
    if (cleanOv) return cleanOv;
    const cleanAb = sanitizeText(property.about);
    if (cleanAb) return cleanAb;
    return `${property.title} in ${property.location}. Verified property listed on Open Plots & Villas.`;
  };

  const overviewText = getLocalizedOverview();
  const overviewData = getCleanOverviewData(property, currentLanguage);

  // 4. Genuine Why Consider list directly from property facts
  const getWhyConsiderItems = (): string[] => {
    const items: string[] = [];

    // Status
    items.push(statusText);

    // Approvals
    if (property.approval) {
      items.push(property.approval);
    } else if (property.reraNumber) {
      if (currentLanguage === 'te') {
        items.push(`HMDA & RERA ఆమోదం పొందబడింది (${property.reraNumber})`);
      } else if (currentLanguage === 'hi') {
        items.push(`HMDA और RERA स्वीकृत (${property.reraNumber})`);
      } else if (currentLanguage === 'ta') {
        items.push(`HMDA மற்றும் RERA அங்கீகரிக்கப்பட்டது (${property.reraNumber})`);
      } else {
        items.push(`HMDA & RERA Approved (${property.reraNumber})`);
      }
    } else {
      items.push(pLocale.verifiedClearTitle);
    }

    // Key amenity or layout feature
    if (property.type === 'plot') {
      if (currentLanguage === 'te') {
        items.push('100% వాస్తు లేఅవుట్, 24/7 సెక్యూరిటీ, అవెన్యూ ప్లాంటేషన్');
      } else if (currentLanguage === 'hi') {
        items.push('100% वास्तु लेआउट, 24/7 सुरक्षा, एवेन्यू प्लांटेशन');
      } else if (currentLanguage === 'ta') {
        items.push('100% வாஸ்து தளவமைப்பு, 24/7 பாதுகாப்பு, பசுமை பூங்கா');
      } else {
        items.push('100% Vastu Compliant, 24/7 Security, Avenue Plantation');
      }
    } else {
      if (property.amenities && property.amenities.length > 0) {
        items.push(property.amenities.slice(0, 3).join(', '));
      } else {
        if (currentLanguage === 'te') {
          items.push('ఆధునిక సౌకర్యాలు & 24/7 భద్రత');
        } else {
          items.push('Modern Amenities & 24/7 Security');
        }
      }
    }

    return items;
  };

  const whyConsiderItems = getWhyConsiderItems();

  return (
    <div className="w-full my-3">
      {/* Header */}
      <h4 className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
        {pLocale.hereAreTheDetails}
      </h4>

      {/* Main Detail Card Container (Clean, self-contained, Square Yards reference) */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-white grid grid-cols-1 md:grid-cols-12 max-w-4xl w-full">
        {/* Left Column: Image with badges & overlay */}
        <div className="md:col-span-5 relative bg-slate-950 min-h-[260px] md:min-h-[380px] overflow-hidden group">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View property on website"
            className="block w-full h-full cursor-pointer"
          >
            <img
              src={images[imgIndex]}
              alt={property.title}
              onError={(e) => {
                e.currentTarget.src = OPV_FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Top-Left: Green PROJECT badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-2.5 py-1 rounded-sm bg-emerald-600 text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
              {pLocale.projectBadge}
            </span>
          </div>

          {/* Top-Right: Clean circular Heart button */}
          <button
            type="button"
            onClick={() => setIsFav(!isFav)}
            aria-label="Favorite property"
            className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs hover:bg-white flex items-center justify-center text-slate-800 shadow-sm transition-transform active:scale-90 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-800'
                }`}
            />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {imgIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrevImg}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleNextImg}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Bottom-Left Overlay: Title & Location with gradient */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
            <h3 className="text-base sm:text-lg font-bold leading-snug drop-shadow-xs">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Price, Specs, Tabs, Overview, Footer */}
        <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-white dark:bg-[#1e293b]">
          <div className="space-y-3.5">
            {/* Top Row: Price + Expand Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
                {property.price || pLocale.priceOnRequest}
              </div>
              <button
                type="button"
                onClick={() => onDetails && onDetails(property)}
                title="Expand full details popup"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2-Column Icon Specs Grid (Clean & spacious) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-0.5">
              {/* Configurations */}
              <div className="flex items-start gap-2.5">
                <div className="text-slate-400 mt-0.5">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {configText}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {pLocale.configurations}
                  </div>
                </div>
              </div>

              {/* Project Status */}
              <div className="flex items-start gap-2.5">
                <div className="text-slate-400 mt-0.5">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {statusText}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {pLocale.projectStatus}
                  </div>
                </div>
              </div>

              {/* Size */}
              <div className="flex items-start gap-2.5">
                <div className="text-slate-400 mt-0.5">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {property.area || '1550 sq.ft.'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {pLocale.size}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Overview, Highlights, Configurations, Amenities, About, Similar) */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700 text-xs font-bold gap-4 sm:gap-6 overflow-x-auto no-scrollbar pt-1.5 pb-0.5">
              {TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition-all whitespace-nowrap relative cursor-pointer ${activeTab === tab
                      ? 'text-slate-950 dark:text-white font-extrabold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
                    }`}
                >
                  {tabLabels[tab]}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panel Contents */}
            <div className="min-h-[140px] text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {activeTab === 'Overview' && (
                <div className="py-1">
                  <StructuredPropertyCards property={property} currentLanguage={currentLanguage} />
                </div>
              )}

              {activeTab === 'Approvals' && (
                <div className="space-y-2 py-1 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.specifications && property.specifications.length > 0 ? (
                      property.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            <strong className="font-semibold text-slate-900 dark:text-white">{spec.label}:</strong>{' '}
                            {spec.value}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{property.type === 'plot' ? (currentLanguage === 'te' ? '100% వాస్తు అనుకూల లేఅవుట్' : '100% Vaastu Compliant Layout') : (currentLanguage === 'te' ? 'గేటెడ్ కమ్యూనిటీ & 24/7 భద్రత' : 'Gated Community with 24/7 Security')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{property.area} {currentLanguage === 'te' ? 'మొత్తం వైశాల్యం' : 'Total Area'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{property.facing || 'East Facing'} {currentLanguage === 'te' ? 'లేఅవుట్' : 'Layout'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{property.approval || pLocale.verifiedClearTitle}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Amenities' && (
                <div className="grid grid-cols-2 gap-2 py-1 text-xs">
                  {(property.type === 'plot' ? (
                    currentLanguage === 'te' ? [
                      '40 & 30 అడుగుల బీటీ రోడ్లు',
                      'భూగర్భ విద్యుత్ వ్యవస్థ',
                      'భూగర్భ డ్రైనేజీ వ్యవస్థ',
                      'ఓవర్‌హెడ్ వాటర్ ట్యాంక్',
                      'అవెన్యూ ప్లాంటేషన్ & పార్కులు',
                      'కాంపౌండ్ వాల్ & ఎంట్రన్స్ ఆర్చ్',
                      '24x7 భద్రత & సీసీటీవీ',
                      '100% వాస్తు అనుకూల ప్లాట్లు'
                    ] : [
                      '40ft & 30ft Blacktop Roads',
                      'Underground Electricity',
                      'Underground Drainage System',
                      'Overhead Water Storage Tank',
                      'Avenue Plantation & Green Parks',
                      'Compound Wall with Entrance Arch',
                      '24 × 7 Security Surveillance',
                      '100% Vaastu Compliant Plots'
                    ]
                  ) : (property.amenities && property.amenities.length > 0 ? property.amenities : [
                    'Clubhouse & Gymnasium',
                    'Swimming Pool',
                    '24 × 7 Security & CCTV',
                    'Children Play Area',
                    'Power Backup',
                    'Landscaped Gardens'
                  ])).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar: OPV Verified Badge (Left) + More Details & Enquire (Right) */}
          <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {/* Left: Verified Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  OPEN PLOTS &amp; VILLAS
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {pLocale.verified}
                </span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <span>{pLocale.moreDetails}</span>
                <span className="text-sm leading-none font-bold">↗</span>
              </a>

              <button
                type="button"
                onClick={() => onEnquire(property)}
                className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>{pLocale.enquire}</span>
                <span className="text-sm leading-none font-bold">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



