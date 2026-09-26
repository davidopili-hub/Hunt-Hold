import React from 'react';
import { PropertyListing } from '../types';
import { X, Bookmark, Trash2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface SavedOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedListings: PropertyListing[];
  onSelectListing: (listing: PropertyListing) => void;
  onRemoveSaved: (id: string, e: React.MouseEvent) => void;
}

export const SavedOfflineModal: React.FC<SavedOfflineModalProps> = ({
  isOpen,
  onClose,
  savedListings,
  onSelectListing,
  onRemoveSaved
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Saved Offline Listings ({savedListings.length})</h2>
              <p className="text-xs text-neutral-500">Accessible without an active network connection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved listings */}
        <div className="overflow-y-auto p-6 space-y-3">
          {savedListings.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-xs">
              No listings saved for offline viewing yet. Click the bookmark icon on any property to save it locally.
            </div>
          ) : (
            savedListings.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onSelectListing(item);
                }}
                className="p-3.5 bg-white rounded-xl border border-neutral-200 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-16 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate">{item.neighborhood} · {item.propertyType}</span>
                    </div>
                    <div className="text-xs font-bold font-mono tabular-nums text-blue-700 mt-1">
                      ${item.rentMonthly}/mo {item.acceptsVouchers && <span className="text-[10px] text-red-600 font-normal">· Section 8</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    title="Remove from offline cache"
                    onClick={(e) => onRemoveSaved(item.id, e)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <span>Cached in device browser storage (IndexedDB / LocalStorage)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
