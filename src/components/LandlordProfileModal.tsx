import React, { useState } from 'react';
import { LandlordProfile, PropertyListing } from '../types';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Star, 
  Award, 
  FileCheck,
  Sparkles,
  Phone,
  Mail,
  Home
} from 'lucide-react';

interface LandlordProfileModalProps {
  landlord: LandlordProfile | null;
  listings: PropertyListing[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (listing: PropertyListing) => void;
  onOpenSubscription: () => void;
}

export const LandlordProfileModal: React.FC<LandlordProfileModalProps> = ({
  landlord,
  listings,
  isOpen,
  onClose,
  onSelectProperty,
  onOpenSubscription
}) => {
  if (!isOpen || !landlord) return null;

  const landlordListings = listings.filter(l => l.landlordId === landlord.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Housing Provider Trust Report</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Profile Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-blue-50/60 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full bg-blue-700 text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                {landlord.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold text-neutral-900">{landlord.name}</h2>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-neutral-600">
                  {landlord.companyName || 'Affordable Housing Owner'}
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                  <span>Member since {landlord.memberSince}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-blue-800">{landlord.badgeTier}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-blue-200 text-right sm:text-center shrink-0">
              <div className="flex items-center gap-1 justify-end sm:justify-center text-amber-500 font-bold text-base">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-mono text-neutral-900">{landlord.rating}</span>
              </div>
              <span className="text-[11px] text-neutral-500">{landlord.reviewsCount} Tenant Reviews</span>
            </div>
          </div>

          {/* Verification Credentials Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              CivicNest Accreditation & Background Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 block">County Deed & Title Verified</span>
                  <span className="text-[11px] text-neutral-500">Travis County Property Records cross-referenced</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 block">Identity & Biometrics Checked</span>
                  <span className="text-[11px] text-neutral-500">State driver license & photo ID matched</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 block">Fair Housing Act Certified</span>
                  <span className="text-[11px] text-neutral-500">Passed fair housing non-discrimination protocol</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 block">Voucher Program Partner</span>
                  <span className="text-[11px] text-neutral-500">Expedited Section 8 inspection compliance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Responsiveness Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-neutral-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Avg Response Time</span>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-900">
                {landlord.avgResponseTimeHours} Hours
              </span>
              <span className="text-[10px] text-blue-700 block font-semibold mt-0.5">Top 5% for responsiveness</span>
            </div>

            <div className="p-3 bg-white border border-neutral-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                <Award className="w-3.5 h-3.5 text-red-600" />
                <span>Response Rate</span>
              </div>
              <span className="text-lg font-bold font-mono text-neutral-900">
                {landlord.responseRate}%
              </span>
              <span className="text-[10px] text-neutral-500 block mt-0.5">Prompt inquiries reply</span>
            </div>
          </div>

          {/* Properties Managed by this Landlord */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Vacant & Active Listings ({landlordListings.length})
            </h3>

            <div className="space-y-2">
              {landlordListings.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectProperty(item);
                  }}
                  className="p-3 rounded-lg border border-neutral-200 hover:border-blue-400 bg-white cursor-pointer transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-12 h-10 object-cover rounded-md"
                    />
                    <div>
                      <span className="text-xs font-semibold text-neutral-900 line-clamp-1">{item.title}</span>
                      <span className="text-[11px] text-neutral-500">{item.neighborhood} · {item.bedrooms} Bed · {item.bathrooms} Bath</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono tabular-nums font-bold text-sm text-neutral-900">${item.rentMonthly}/mo</span>
                    <span className="text-[10px] text-red-600 block font-semibold">View Details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Hunt & Hold Verified Landlord Shield Program
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
