import React from 'react';
import { PropertyListing } from '../types';
import { 
  CheckCircle2, 
  Bookmark, 
  MapPin, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ListingCardProps {
  listing: PropertyListing;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelect: (listing: PropertyListing) => void;
  onOpenApply: (listing: PropertyListing, e: React.MouseEvent) => void;
  isSelected?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isSaved,
  onToggleSave,
  onSelect,
  onOpenApply,
  isSelected = false
}) => {
  return (
    <article 
      onClick={() => onSelect(listing)}
      className={`group relative bg-white rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${
        isSelected 
          ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-md' 
          : 'border-neutral-200 hover:border-blue-400 hover:shadow-md'
      }`}
    >
      {/* Photo Container */}
      <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
        <img
          src={listing.images[0] || '/src/assets/images/hero_affordable_home_1790422576308.jpg'}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges Bar: Red and Blue badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white drop-shadow-sm">
            {listing.acceptsVouchers && (
              <span className="bg-red-600 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide shadow-xs">
                Section 8 Welcomed
              </span>
            )}
            {listing.incomeRestricted && (
              <span className="bg-blue-700 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide shadow-xs">
                Affordable Cap
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => onToggleSave(listing.id, e)}
            title={isSaved ? "Saved for offline viewing" : "Save offline"}
            aria-label="Save listing offline"
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isSaved 
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-white' 
                : 'bg-white/90 text-neutral-700 hover:bg-white hover:text-blue-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Price in photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div>
            <div className="text-xl font-bold tracking-tight font-mono tabular-nums drop-shadow-xs">
              ${listing.rentMonthly}
              <span className="text-xs font-normal text-blue-100 ml-1">/ month</span>
            </div>
          </div>
          {listing.utilitiesIncluded && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-blue-200 drop-shadow-xs bg-blue-950/70 px-2 py-0.5 rounded">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Utilities Included</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Typographic Metadata: Zero Pill Rule */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5 flex-wrap">
            <span className="font-semibold text-blue-700">{listing.propertyType}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Beds`}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="font-mono tabular-nums">{listing.sqft} sqft</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-blue-700 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          {/* Neighborhood & Address */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{listing.neighborhood} — {listing.address}</span>
          </div>
        </div>

        {/* Bottom Metadata & Verified Landlord */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-1.5 truncate">
            {listing.landlordVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            )}
            <span className="truncate font-medium text-neutral-700">
              {listing.landlordName}
            </span>
            <span className="text-neutral-400 hidden sm:inline">· {listing.landlordBadge}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => onOpenApply(listing, e)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Apply</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
