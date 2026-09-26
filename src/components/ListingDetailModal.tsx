import React, { useState } from 'react';
import { PropertyListing } from '../types';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Bookmark, 
  MessageSquare, 
  ArrowRight,
  Check,
  Home
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: PropertyListing | null;
  onClose: () => void;
  onApply: (listing: PropertyListing) => void;
  onMessageLandlord: (listing: PropertyListing) => void;
  onViewLandlordProfile: (landlordId: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onApply,
  onMessageLandlord,
  onViewLandlordProfile,
  isSaved,
  onToggleSave
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [calcIncome, setCalcIncome] = useState<string>('36000');
  const [calcHouseholdSize, setCalcHouseholdSize] = useState<number>(2);

  if (!listing) return null;

  // Affordability check: 33% of gross income guideline
  const annualIncomeNum = parseFloat(calcIncome) || 0;
  const monthlyAffordableBudget = Math.round((annualIncomeNum / 12) * 0.33);
  const isBudgetFit = listing.rentMonthly <= monthlyAffordableBudget;
  const meetsIncomeCap = !listing.maxHouseholdIncome || annualIncomeNum <= listing.maxHouseholdIncome;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
              {listing.propertyType}
            </span>
            {listing.acceptsVouchers && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                Section 8 Accepted
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => onToggleSave(listing.id, e)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isSaved 
                  ? 'bg-blue-50 border-blue-300 text-blue-800' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-blue-600' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved Offline' : 'Save Offline'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Main Photo & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-100">
              <img
                src={listing.images[selectedPhotoIndex] || listing.images[0]}
                alt={listing.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                Photo {selectedPhotoIndex + 1} of {listing.images.length}
              </div>
            </div>

            {listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedPhotoIndex === idx ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Metrics */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {listing.title}
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{listing.address}, {listing.neighborhood}, {listing.city}, {listing.state} {listing.zipCode}</span>
              </div>

              {/* Typographic separator metadata */}
              <div className="flex items-center gap-2 text-sm text-neutral-600 mt-3 font-medium flex-wrap">
                <span className="font-semibold text-blue-700">{listing.bedrooms === 0 ? 'Micro Studio' : `${listing.bedrooms} Bedrooms`}</span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="font-mono tabular-nums">{listing.sqft} sq.ft.</span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span>Available {listing.availableDate}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-left md:text-right shrink-0">
              <div className="text-3xl font-bold font-mono tabular-nums text-blue-900">
                ${listing.rentMonthly}
                <span className="text-sm font-normal text-blue-600 ml-1">/ month</span>
              </div>
              <div className="text-xs text-neutral-600 mt-1 font-mono tabular-nums">
                Security Deposit: ${listing.securityDeposit}
              </div>
              {listing.utilitiesIncluded && (
                <div className="flex items-center md:justify-end gap-1 text-xs text-blue-800 font-semibold mt-1">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Utilities Bundled</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">About this Home</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Affordable Housing & Voucher Details - Blue & Red & White container */}
          <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-900">Affordable Housing & Assistance Guidelines</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
              <div className="bg-red-50/60 p-3 rounded-lg border border-red-200">
                <span className="font-semibold text-red-900 block mb-0.5">Housing Choice Vouchers</span>
                <span>
                  {listing.acceptsVouchers 
                    ? "Section 8 and local emergency housing vouchers accepted. Direct landlord deposit paperwork handled."
                    : "Standard tenant lease qualifications apply."}
                </span>
              </div>
              <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200">
                <span className="font-semibold text-blue-900 block mb-0.5">Income Restriction / AMI Tier</span>
                <span>
                  {listing.incomeRestricted && listing.maxHouseholdIncome
                    ? `Max Household Income: $${listing.maxHouseholdIncome.toLocaleString()}/yr (~60% Area Median Income).`
                    : "No upper income restriction. Designed for working community members."}
                </span>
              </div>
            </div>

            {/* Interactive Affordability Calculator */}
            <div className="pt-2 border-t border-neutral-100 mt-2">
              <span className="text-xs font-semibold text-neutral-900 block mb-2">
                Quick Affordability Calculator
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="annual-income-input" className="text-neutral-700">Your Annual Income:</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-neutral-500">$</span>
                    <input
                      id="annual-income-input"
                      type="number"
                      value={calcIncome}
                      onChange={(e) => setCalcIncome(e.target.value)}
                      className="w-28 pl-5 pr-2 py-1 bg-white border border-blue-300 rounded text-xs text-neutral-900 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <label htmlFor="household-size-select" className="text-neutral-700">Household Size:</label>
                  <select
                    id="household-size-select"
                    value={calcHouseholdSize}
                    onChange={(e) => setCalcHouseholdSize(Number(e.target.value))}
                    className="py-1 px-2 bg-white border border-blue-300 rounded text-xs text-neutral-900"
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 People</option>
                    <option value={3}>3 People</option>
                    <option value={4}>4+ People</option>
                  </select>
                </div>

                <div className="ml-auto font-medium text-neutral-900 flex items-center gap-1">
                  {meetsIncomeCap && isBudgetFit ? (
                    <span className="text-blue-700 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4 text-blue-600" /> Qualifies on Budget & Cap!
                    </span>
                  ) : (
                    <span className="text-red-700 font-medium">
                      Recommended rent guideline: ~${monthlyAffordableBudget}/mo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Utilities & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Utilities Breakdown</span>
              </h3>
              <ul className="space-y-2 text-xs text-neutral-600">
                {listing.utilitiesList.map((util, i) => (
                  <li key={i} className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{util}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
                <Home className="w-4 h-4 text-blue-600" />
                <span>Property Amenities</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
                {listing.amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Landlord Card */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-base">
                {listing.landlordName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-neutral-900">{listing.landlordName}</span>
                  {listing.landlordVerified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="text-xs text-neutral-500">
                  <span className="text-blue-700 font-medium">{listing.landlordBadge}</span> · Rating: <span className="font-mono">{listing.landlordRating}★</span>
                </div>
                {listing.landlordCompany && (
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {listing.landlordCompany}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewLandlordProfile(listing.landlordId)}
                className="px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors"
              >
                View Trust Profile
              </button>
              <button
                type="button"
                onClick={() => onMessageLandlord(listing)}
                className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Landlord</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 hidden sm:block">
            No application fee for Hunt & Hold Verified Pass holders
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onApply(listing)}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Apply for Rental</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
