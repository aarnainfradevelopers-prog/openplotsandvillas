import React, { useState } from 'react';
import {
  Heart,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Phone,
  Building2,
  Bed,
  LayoutGrid,
  Navigation,
  BookUser
} from 'lucide-react';
import { PropertyItem, LanguageCode } from '../types/chat';
import { OPV_FALLBACK_IMAGE } from '../data/propertyData';
import { getPropertyDetailsStrings } from '../data/propertyDetailsI18n';

interface PropertyCardProps {
  property: PropertyItem;
  onDetails: (property: PropertyItem) => void;
  onEnquire: (property: PropertyItem) => void;
  onViewNumber: (property: PropertyItem) => void;
  onToggleFavorite?: (property: PropertyItem) => void;
  currentLanguage?: LanguageCode;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onDetails,
  onEnquire,
  onViewNumber,
  onToggleFavorite,
  currentLanguage = 'en'
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(property.isFavorite || false);
  const pLocale = getPropertyDetailsStrings(currentLanguage);

  const images = property.images && property.images.length > 0
    ? property.images
    : [OPV_FALLBACK_IMAGE];

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev + 1) % images.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextFav = !isFav;
    setIsFav(nextFav);
    onToggleFavorite?.({ ...property, isFavorite: nextFav });
  };

  // Status badge matching reference image ("Under Construction", "Ready to Move", "New Launch")
  const statusBadge = property.badge || (property.status === 'For Sale' ? 'Ready to Move' : 'Available');

  // Config display
  const configText = property.config || (property.bhk ? `${property.bhk} Beds` : (property.type === 'plot' ? 'Plot' : (property.type === 'farmland' ? 'Farmland' : (property.type === 'commercial' ? 'Commercial' : (property.type === 'villa' ? 'Villa' : 'Standard Unit')))));

  return (
    <div className="bg-white dark:bg-[#1a2234] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col w-full sm:w-[400px] max-w-[400px] min-h-[620px] text-slate-900 dark:text-white mx-auto shrink-0">
      {/* Property Image Header (Exact 400x225 dimensions matching Image 2 reference) */}
      <div className="relative h-[225px] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden group shrink-0 border-b border-slate-100 dark:border-slate-800">
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          onError={(e) => {
            e.currentTarget.src = OPV_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top-Left Tag: "Ready to Move" / "Under Construction" / "Nearby Recommendation" */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
          <span className={`px-2.5 py-0.5 rounded-md text-white text-[11px] font-bold tracking-wide shadow-sm backdrop-blur-xs ${property.isNearby ? 'bg-amber-600/95' : 'bg-slate-950/85'}`}>
            {property.isNearby ? 'Nearby' : statusBadge}
          </span>
        </div>

        {/* Top-Right Favorite Heart Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-transform active:scale-90 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
              }`}
          />
        </button>

        {/* Carousel Arrow Controls */}
        {images.length > 1 && (
          <>
            {currentImgIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Card Content Body (Total ~620px Height Layout) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Logo & Property Title Row */}
          <div className="flex items-start gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400 mt-0.5 shadow-2xs">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-[16px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onDetails(property)}
                title={property.title}
              >
                {property.rawDetails?.projectName || property.title}
              </h3>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Distance / Nearby Indicator */}
          <div className={`flex items-center gap-1 text-[11px] font-semibold mb-2.5 ${property.isNearby ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            <Navigation className={`w-3 h-3 rotate-45 shrink-0 ${property.isNearby ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span className="truncate">
              {property.nearbyNote || (property.nearbyDistanceKm ? `${property.nearbyDistanceKm} km away • Nearby Area` : '0.53 km away • Prime Zone')}
            </span>
          </div>

          {/* Price */}
          <div className="text-2xl font-black text-slate-950 dark:text-white my-3">
            {property.price || 'Price on request'}
          </div>

          {/* Configuration & Area (Size) Matching Image 2 */}
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="min-w-0">
              <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white truncate">
                {configText}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider mt-0.5">
                {pLocale.configurations || 'CONFIGURATIONS'}
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white truncate">
                {property.area || property.size || 'Standard Unit'}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider mt-0.5">
                {pLocale.size || 'AREA'}
              </div>
            </div>
          </div>
        </div>

        {/* Seller / Agent Row Matching Image 2 */}
        <div className="flex items-center gap-2.5 mt-2 py-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#8b5e66] text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-2xs">
            {(property.sellerName || property.agent?.name || 'P').charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">
              {property.sellerName || property.agent?.name || 'openplotsandvillas'}
            </div>
            <div className="inline-flex items-center text-[9px] font-black tracking-wider text-white bg-[#2d3748] px-1.5 py-0.5 rounded leading-none mt-0.5">
              <span>OPV EXPERT</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row: [ Details ] [ View Number ] [ Contact Agent ] in Green */}
        <div className="grid grid-cols-3 gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {/* 1. Details */}
          <button
            type="button"
            onClick={() => onDetails(property)}
            className="w-full h-10.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 text-xs sm:text-[13px] font-bold transition-all shadow-2xs flex items-center justify-center cursor-pointer px-1.5"
            title="View property details"
          >
            <span>{currentLanguage === 'te' ? 'వివరాలు' : currentLanguage === 'hi' ? 'विवरण' : currentLanguage === 'ta' ? 'விவரங்கள்' : 'Details'}</span>
          </button>

          {/* 2. View Number */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewNumber(property);
            }}
            className="w-full h-10.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-900 dark:border-slate-400 text-xs sm:text-[13px] font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer px-1.5 active:scale-95"
            title="View listing phone number"
          >
            <BookUser className="w-3.5 h-3.5 stroke-[2] text-slate-900 dark:text-white shrink-0" />
            <span className="whitespace-nowrap">View Number</span>
          </button>

          {/* 3. Contact Agent (in Green) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEnquire(property);
            }}
            className="w-full h-10.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-[13px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-600 px-1.5 active:scale-95"
            title="Contact listing agent"
          >
            <Phone className="w-3.5 h-3.5 fill-white text-white shrink-0" />
            <span className="whitespace-nowrap">Contact Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
};



