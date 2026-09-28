import React, { useState } from 'react';
import {
  Heart,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Phone
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col w-full text-slate-900">
      {/* Property Image Header with Badges & Controls */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden group">
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          onError={(e) => {
            e.currentTarget.src = OPV_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top-Left Tag: For Sale / For Rent */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold tracking-wide shadow-sm">
            {property.status}
          </span>
        </div>

        {/* Top-Right Favorite Heart Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-rose-500 transition-transform active:scale-90 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
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
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            className="text-[14px] sm:text-[15px] font-bold text-slate-900 leading-snug line-clamp-1 cursor-pointer hover:text-amber-600 transition-colors"
            onClick={() => onDetails(property)}
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Price */}
          <div className="text-xl font-extrabold text-slate-950 mb-2">
            {property.price}
          </div>

          {/* Status Badges: Ready to move / Owner - no brokerage */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {property.badge === 'Ready to move' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Ready to move
              </span>
            )}
            {(property.badge === 'Owner · no brokerage' || property.badge === 'Owner - no brokerage') && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-800 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Owner · no brokerage
              </span>
            )}
          </div>

          {/* Property Specs (Config / Area / Facing) */}
          <div className={`grid ${property.type === 'plot' ? 'grid-cols-2' : 'grid-cols-3'} gap-2 py-2 border-t border-slate-100 text-left`}>
            {property.type === 'plot' ? (
              <>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {property.area}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    Area
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {property.config || 'Plot'}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    Type
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {property.config}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    Config
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {property.area}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    Area
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {property.floor || property.facing || 'East Facing'}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">
                    {property.floor ? 'Floor' : 'Facing'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {property.amenities.map((amenity, i) => (
              <span
                key={i}
                className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md font-medium"
              >
                {amenity}
              </span>
            ))}
            {property.moreAmenitiesCount && (
              <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200/80 px-1.5 py-0.5 rounded-md font-medium">
                +{property.moreAmenitiesCount}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Details & Enquire */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onDetails(property)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors text-center shadow-2xs cursor-pointer"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onEnquire(property)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#f5c344] hover:bg-[#eab308] text-slate-950 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
