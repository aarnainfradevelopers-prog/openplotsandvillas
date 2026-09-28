import React, { useState } from 'react';
import {
  Heart,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { PropertyItem } from '../types/chat';
import { OPV_FALLBACK_IMAGE } from '../data/propertyData';

interface PropertyDetailViewProps {
  property: PropertyItem;
  onEnquire: (property: PropertyItem) => void;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onEnquire
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Amenities' | 'About' | 'Nearby'>('Overview');
  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(property.isFavorite || false);

  const images = property.images && property.images.length > 0
    ? property.images
    : [OPV_FALLBACK_IMAGE];

  const handleNextImg = () => {
    setImgIndex(prev => (prev + 1) % images.length);
  };

  const handlePrevImg = () => {
    setImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full my-3">
      {/* Header matching Image 4 */}
      <h4 className="text-sm font-semibold text-slate-700 mb-2.5">
        Here are the details
      </h4>

      {/* Main Detail Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900 grid grid-cols-1 md:grid-cols-12 max-w-4xl">
        {/* Left Column: Image with badges & overlay (matching Image 4) */}
        <div className="md:col-span-5 relative bg-slate-950 min-h-[260px] md:min-h-[380px] overflow-hidden group">
          <img
            src={images[imgIndex]}
            alt={property.title}
            onError={(e) => {
              e.currentTarget.src = OPV_FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Top-Left: Yellow SALE PROPERTY badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3 py-1 rounded-md bg-[#eab308] text-slate-950 text-xs font-black tracking-wide uppercase shadow-sm">
              {property.status === 'For Sale' ? 'SALE PROPERTY' : 'RENTAL PROPERTY'}
            </span>
          </div>

          {/* Top-Right: Heart button */}
          <button
            type="button"
            onClick={() => setIsFav(!isFav)}
            aria-label="Favorite property"
            className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center text-slate-700 shadow-sm transition-transform active:scale-95"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <button
                type="button"
                onClick={handleNextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom-Right: Image Counter Pill */}
          <div className="absolute bottom-3.5 right-3.5 z-10 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm">
            <span>📷</span>
            <span>{images.length > 1 ? `${imgIndex + 1}/${images.length}` : '11'}</span>
          </div>

          {/* Bottom-Left Overlay Title & Location */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
            <h3 className="text-base sm:text-lg font-bold leading-snug drop-shadow-sm">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Price, Area, Tabs, Content, Agent */}
        <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-white">
          <div>
            {/* Price & Expand Icon */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                {property.price}
              </div>
              <button
                type="button"
                title="Expand view"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Plot / Built-up Area Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                ⛶
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-none">
                  {property.area}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                  {property.type === 'plot' ? 'PLOT AREA' : 'SUPER BUILT-UP AREA'}
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Overview / Amenities / About / Nearby) */}
            <div className="flex items-center border-b border-slate-200 text-xs font-bold mb-3 gap-6">
              {(['Overview', 'Amenities', 'About', 'Nearby'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition-all relative ${
                    activeTab === tab
                      ? 'text-slate-950 font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#eab308] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panel Contents */}
            <div className="min-h-[120px] text-xs leading-relaxed text-slate-600">
              {activeTab === 'Overview' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-r-lg border-l-3 border-[#eab308] text-slate-800 text-xs font-medium">
                    {property.overview}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {property.specifications.slice(0, 4).map((spec, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {spec.label}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Amenities' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-medium">{item}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-medium">Underground Electricity</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-medium">40ft & 30ft Blacktop Roads</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-medium">100% Vaastu Compliant</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'About' && (
                <div className="space-y-2">
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {property.about}
                  </p>
                  {property.reraNumber && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>RERA No: {property.reraNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Nearby' && (
                <div className="space-y-1.5">
                  {property.nearby.map((loc, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-700 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar: Agent Info + Action Buttons */}
          <div className="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#eab308] text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {property.agent.avatar || 'M'}
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  AGENT
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {property.agent.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEnquire(property)}
                className="py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>More details</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => onEnquire(property)}
                className="py-1.5 px-3.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Enquire</span>
                <ArrowRight className="w-3.5 h-3.5 font-bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
