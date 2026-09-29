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
  Navigation
} from 'lucide-react';
import { PropertyItem } from '../types/chat';
import { OPV_FALLBACK_IMAGE } from '../data/propertyData';

interface PropertyCardProps {
  property: PropertyItem;
  onDetails: (property: PropertyItem) => void;
  onEnquire: (property: PropertyItem) => void;
  onToggleFavorite?: (property: PropertyItem) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onDetails,
  onEnquire,
  onToggleFavorite
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(property.isFavorite || false);

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
  const configText = property.config || (property.bhk ? `${property.bhk} Beds` : (property.type === 'plot' ? 'Plot' : '3 Beds'));

  return (
    <div className="bg-white dark:bg-[#1a2234] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col w-full max-w-[285px] sm:max-w-[290px] min-h-[430px] justify-between text-slate-900 dark:text-white mx-auto">
      {/* Property Image Header (Exact ~160px height matching reference image) */}
      <div className="relative h-[160px] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden group shrink-0">
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          onError={(e) => {
            e.currentTarget.src = OPV_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top-Left Tag: "Ready to Move" / "Under Construction" */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-xs text-white text-[11px] font-bold tracking-wide shadow-sm">
            {statusBadge}
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

      {/* Card Content Body (Exact ~270px height) */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Logo & Title Row */}
          <div className="flex items-start gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400 mt-0.5 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onDetails(property)}
                title={property.title}
              >
                {property.rawDetails?.projectName || property.title}
              </h3>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Distance Indicator (Matching Reference Image) */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <Navigation className="w-3 h-3 text-emerald-500 rotate-45 shrink-0" />
            <span>0.53 km away • Prime Zone</span>
          </div>

          {/* Price */}
          <div className="text-lg sm:text-[19px] font-extrabold text-slate-950 dark:text-white mb-2">
            {property.price || 'Price on request'}
          </div>

          {/* Property Specs (Config & Size matching Reference Image 2) */}
          <div className="grid grid-cols-2 gap-2 py-2 border-t border-slate-100 dark:border-slate-800 text-left">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 mt-0.5">
                <Bed className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {configText}
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                  CONFIG
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 mt-0.5">
                <LayoutGrid className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {property.area}
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                  SIZE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Details & Enquire (Exact ~40px Height) */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onDetails(property)}
            className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onEnquire(property)}
            className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};



