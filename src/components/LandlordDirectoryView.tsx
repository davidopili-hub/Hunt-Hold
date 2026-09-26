import React from 'react';
import { LandlordProfile } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Star, 
  Building2, 
  Award, 
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface LandlordDirectoryViewProps {
  landlords: LandlordProfile[];
  onSelectLandlord: (landlord: LandlordProfile) => void;
  onOpenSubscription: () => void;
}

export const LandlordDirectoryView: React.FC<LandlordDirectoryViewProps> = ({
  landlords,
  onSelectLandlord,
  onOpenSubscription
}) => {
  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Landlord Network</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Accredited Housing Providers
            </h1>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              Every registered landlord undergoes deed authentication, biometric identity screening, and Fair Housing Act compliance checks to eliminate rental fraud and safeguard affordable housing.
            </p>
          </div>

          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3 shrink-0 text-center sm:text-left">
            <span className="text-xs font-bold text-neutral-900 block">Are you a property owner?</span>
            <p className="text-xs text-neutral-500 max-w-xs">
              Obtain the Gold Verified Shield, lease templates, and priority map placement.
            </p>
            <button
              type="button"
              onClick={onOpenSubscription}
              className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Landlord Verification Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Landlord Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {landlords.map(landlord => (
          <div
            key={landlord.id}
            className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between shadow-2xs hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-700 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {landlord.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">
                        {landlord.name}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    </div>
                    <span className="text-xs text-neutral-500 block truncate">
                      {landlord.companyName || 'Housing Provider'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold font-mono text-neutral-900 bg-neutral-50 px-2 py-1 rounded-md border border-neutral-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{landlord.rating}</span>
                </div>
              </div>

              {/* Badges / Covenants */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-700" />
                  <span>{landlord.badgeTier}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Deed Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Fair Housing Certified</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 py-3 border-y border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Response Time:</span>
                  <span className="font-semibold text-neutral-800 font-mono">~{landlord.avgResponseTimeHours} hrs</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Active Properties:</span>
                  <span className="font-semibold text-neutral-800 font-mono">{landlord.propertiesListedCount} Listed</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-2 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                {landlord.reviewsCount} Tenant Reviews
              </span>

              <button
                type="button"
                onClick={() => onSelectLandlord(landlord)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>View Profile & Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
