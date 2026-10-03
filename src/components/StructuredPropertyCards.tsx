import React from 'react';
import { Info, Building2, MapPin } from 'lucide-react';
import { PropertyItem, LanguageCode } from '../types/chat';
import { getPropertyDetailsStrings } from '../data/propertyDetailsI18n';

interface StructuredPropertyCardsProps {
  property: PropertyItem;
  className?: string;
  currentLanguage?: LanguageCode;
}

export const StructuredPropertyCards: React.FC<StructuredPropertyCardsProps> = ({
  property,
  className = '',
  currentLanguage = 'en'
}) => {
  const pLocale = getPropertyDetailsStrings(currentLanguage);

  const details = property.rawDetails || {
    postedDate: '25-SEPT-2026',
    postedTime: '06:35 PM',
    propId: property.id.startsWith('db-')
      ? `OPV-${property.id.replace('db-', '')}-FE-880`
      : 'OPV-852-FE-880',
    propertyType: (property.type || 'FARMHOUSE').toUpperCase(),
    quotedPrice: property.priceNumeric && property.priceNumeric > 1000000
      ? `₹${Math.round(property.priceNumeric / 2000).toLocaleString('en-IN')}`
      : '₹5,000',
    plotSize: property.area || '2000 sq-yards',
    totalPrice: property.priceNumeric
      ? `₹${Number(property.priceNumeric).toLocaleString('en-IN')}`
      : property.price,
    projectName: property.title.split(' - ')[1]?.split(' for ')[0] || property.title.split(' in ')[1] || property.title,
    city: 'Hyderabad',
    zone: 'SOUTH',
    location: property.location || 'Shamshabad near ORR and Airport, Hyderabad',
    landmark: property.nearby && property.nearby[0] ? property.nearby[0] : 'Shamshabad near Airport',
    facing: property.facing ? property.facing.replace(' Facing', '').toUpperCase() : 'EAST'
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 ${className}`}>
      {/* 1. Basic Property Details Card (Compact, Structured, Uncongested) */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 shadow-2xs text-slate-900 dark:text-white flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/80 mb-0.5">
            <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50 flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
              {pLocale.basicPropertyDetails}
            </h4>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-200/70 dark:divide-slate-700/60 text-[11px] sm:text-xs">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.postedDate}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {details.postedDate || '25-SEPT-2026'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.postedTime}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {details.postedTime || '06:35 PM'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.propertyId}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right font-mono text-[10.5px]">
                {details.propId || 'OPV-852-FE-880'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.propertyType}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right uppercase">
                {details.propertyType || 'FARMHOUSE'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.quotedPrice}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {details.quotedPrice || '₹5,000'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.plotSize}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {details.plotSize || property.area || '2000 sq-yards'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b-0">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.totalPrice}</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm text-right">
                {details.totalPrice || property.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Project & Location Details Card (Compact, Structured, Uncongested) */}
      <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3.5 sm:p-4 shadow-2xs text-slate-900 dark:text-white flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/80 mb-0.5">
            <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
              {pLocale.projectLocationInfo}
            </h4>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-200/70 dark:divide-slate-700/60 text-[11px] sm:text-xs">
            <div className="flex items-start justify-between py-2 gap-2">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                <div className="w-4 h-4 rounded bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Building2 className="w-2.5 h-2.5" />
                </div>
                <span>{pLocale.projectName}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-right max-w-[200px] leading-tight">
                {details.projectName || property.title}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                <div className="w-4 h-4 rounded bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <MapPin className="w-2.5 h-2.5" />
                </div>
                <span>{pLocale.city}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {details.city || 'Hyderabad'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.zone}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right uppercase">
                {details.zone || 'SOUTH'}
              </span>
            </div>

            <div className="flex items-start justify-between py-2 gap-2">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                <div className="w-4 h-4 rounded bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <MapPin className="w-2.5 h-2.5" />
                </div>
                <span>{pLocale.location}</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-right leading-tight max-w-[200px]">
                {details.location || property.location}
              </span>
            </div>

            <div className="flex items-start justify-between py-2 gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">{pLocale.landmark}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right max-w-[200px] leading-tight">
                {details.landmark || 'Shamshabad near Airport'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b-0">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pLocale.facing}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right uppercase">
                {details.facing || 'EAST'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
