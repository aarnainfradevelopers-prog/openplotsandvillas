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
  Building
} from 'lucide-react';
import { PropertyItem } from '../types/chat';
import { OPV_FALLBACK_IMAGE } from '../data/propertyData';
import { StructuredPropertyCards } from './StructuredPropertyCards';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyItem | null;
  onEnquire: (property: PropertyItem) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  isOpen,
  onClose,
  property,
  onEnquire
}) => {
  const [activeTab, setActiveTab] = useState<'Structured Details' | 'Overview' | 'Amenities' | 'About' | 'Nearby'>('Structured Details');
  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);

  if (!isOpen || !property) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-white relative my-auto">
        
        {/* Sticky Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                {property.status}
              </span>
              {property.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {property.badge}
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
                {property.price}
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
              {property.price}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
            {(['Structured Details', 'Overview', 'Amenities', 'About', 'Nearby'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 transition-all whitespace-nowrap relative cursor-pointer ${
                  activeTab === tab
                    ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Structured Details matching Image 1 */}
          {activeTab === 'Structured Details' && (
            <div>
              <StructuredPropertyCards property={property} />
            </div>
          )}

          {/* Tab 2: Overview */}
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-emerald-500 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {property.overview}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {property.specifications.map((spec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-0.5">
                      {spec.label}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Amenities */}
          {activeTab === 'Amenities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((item, idx) => (
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

          {/* Tab 4: About & Legal */}
          {activeTab === 'About' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.about}
              </p>
              {property.reraNumber && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      RERA Registered Project
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                      Registration Number: {property.reraNumber}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Nearby Landmarks */}
          {activeTab === 'Nearby' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.nearby.map((loc, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {loc}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {property.agent.avatar || 'M'}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {property.agent.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {property.agent.role} • {property.agent.phone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
              href={`tel:${property.agent.phone}`}
              className="py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
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
              <span>Book Site Visit / Enquire</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
