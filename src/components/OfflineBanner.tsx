import React from 'react';
import { PropertyListing } from '../types';
import { WifiOff, Bookmark, ArrowRight, X } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  savedCount: number;
  onOpenSavedListings: () => void;
  onToggleOffline: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  savedCount,
  onOpenSavedListings,
  onToggleOffline
}) => {
  if (!isOffline) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2.5 shadow-sm text-xs transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-3 h-3 text-white" />
          </div>
          <div>
            <span className="font-bold">Offline Mode Active: </span>
            <span>You are browsing cached listings and offline documents. ({savedCount} properties saved for offline access).</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSavedListings}
            className="underline font-semibold hover:text-red-100 flex items-center gap-1"
          >
            <span>View Offline Bookmarks</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={onToggleOffline}
            className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
          >
            Switch to Online
          </button>
        </div>
      </div>
    </div>
  );
};
