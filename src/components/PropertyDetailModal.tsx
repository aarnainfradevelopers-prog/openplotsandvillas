import React, { useState } from 'react';
import {
  X,
  Heart,
  ChevronRight,
  ChevronLeft,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
  Building,
  Building2,
  Check
} from 'lucide-react';
import { PropertyItem, LanguageCode } from '../types/chat';
import { OPV_FALLBACK_IMAGE } from '../data/propertyData';
import { StructuredPropertyCards } from './StructuredPropertyCards';
import { getPropertyDetailsStrings } from '../data/propertyDetailsI18n';
import { getCleanOverviewData, getPropertyWebsiteUrl } from '../utils/propertyOverviewHelper';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyItem | null;
  onEnquire: (property: PropertyItem) => void;
  currentLanguage?: LanguageCode;
}

const MODAL_TABS = ['Overview', 'Approvals', 'Amenities'] as const;
type ModalTabType = typeof MODAL_TABS[number];

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  isOpen,
  onClose,
  property,
  onEnquire,
  currentLanguage = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<ModalTabType>('Overview');
  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const pLocale = getPropertyDetailsStrings(currentLanguage);

  if (!isOpen || !property) return null;

  const tabLabels: Record<ModalTabType, string> = {
    Overview: pLocale.overviewTab || 'Overview',
    Approvals: currentLanguage === 'te' ? 'అనుమతులు' : currentLanguage === 'hi' ? 'अनुमोदन' : currentLanguage === 'ta' ? 'அங்கீகாரங்கள்' : 'Approvals',
    Amenities: pLocale.amenitiesTab || 'Amenities'
  };

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

  const overviewData = getCleanOverviewData(property, currentLanguage);

  const images = property.images && property.images.length > 0
    ? property.images
    : [OPV_FALLBACK_IMAGE];

  const handleNextImg = () => {
    setImgIndex(prev => (prev + 1) % images.length);
  };

  const handlePrevImg = () => {
    setImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const whatsappUrl = `https://wa.me/919963513939?text=Hello%20OPV%20Team,%20I%20am%20interested%20in%20${encodeURIComponent(
    property.title
  )}%20(${encodeURIComponent(property.price)}).%20Please%20share%20details.`;

  const websiteUrl = getPropertyWebsiteUrl(property);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-white relative my-auto">

        {/* Sticky Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                {currentLanguage === 'te'
                  ? (property.status === 'For Sale' ? 'అమ్మకానికి' : 'అద్దెకు')
                  : currentLanguage === 'hi'
                    ? (property.status === 'For Sale' ? 'बिक्री के लिए' : 'किराए के लिए')
                    : currentLanguage === 'ta'
                      ? (property.status === 'For Sale' ? 'விற்பனைக்கு' : 'வாடகைக்கு')
                      : property.status}
              </span>
              {property.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {property.badge.toLowerCase().includes('ready') ? pLocale.readyToMove : property.badge}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {property.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {property.price || pLocale.priceOnRequest}
              </div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">
                {property.area}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Visual Image Banner */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 group shadow-md">
            <img
              src={images[imgIndex]}
              alt={property.title}
              onError={(e) => {
                e.currentTarget.src = OPV_FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Counter pill */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
              {imgIndex + 1} / {images.length}
            </div>

            {/* Mobile price tag */}
            <div className="absolute bottom-3 left-3 sm:hidden px-3 py-1 rounded-xl bg-white/95 text-slate-950 font-extrabold text-sm shadow-md">
              {property.price || pLocale.priceOnRequest}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
            {MODAL_TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 transition-all whitespace-nowrap relative cursor-pointer ${activeTab === tab
                  ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
              >
                {tabLabels[tab]}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'Overview' && (
            <div>
              <StructuredPropertyCards property={property} currentLanguage={currentLanguage} />
            </div>
          )}

          {/* Tab 2: Approvals */}
          {activeTab === 'Approvals' && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 sm:p-5">
                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <span>Highlights & Specifications</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.specifications && property.specifications.length > 0 ? (
                    property.specifications.map((spec, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
                            {spec.label}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                            {spec.value}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">Configuration</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{property.config || property.type}</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">Total Area</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{property.area || '1550 sq.ft.'}</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">Facing</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{property.facing || 'East Facing'}</span>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">Approval / Title</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{property.approval || pLocale.verifiedClearTitle}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Approval / RERA Trust Card */}
              {(overviewData.reraNumber || overviewData.approval) && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200 leading-tight">
                        {overviewData.approval ? overviewData.approval : 'RERA Registered Project'}
                      </div>
                      {overviewData.reraNumber && (
                        <div className="text-xs text-emerald-700 dark:text-emerald-300 font-mono mt-0.5 truncate">
                          Registration: {overviewData.reraNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-200/70 dark:bg-emerald-800/70 text-emerald-900 dark:text-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Amenities */}
          {activeTab === 'Amenities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(property.amenities || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Underground Electricity &amp; Drainage</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Vaastu Compliant Layout</span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {property.agent?.avatar || 'M'}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {property.agent?.name || 'MANCHALA DAIVAPRAKASH'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {property.agent?.role || 'Senior Property Advisor • OPV'} • {property.agent?.phone || '+91 9963513939'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>{pLocale.moreDetails}</span>
              <span className="text-xs">↗</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${property.agent?.phone || '+91 9963513939'}`}
              className="py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{pLocale.call}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEnquire(property);
              }}
              className="py-2.5 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{pLocale.bookSiteVisit}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
