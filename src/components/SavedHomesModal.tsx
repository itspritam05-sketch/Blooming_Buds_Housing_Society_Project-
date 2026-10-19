import React from 'react';
import { 
  Heart, 
  X, 
  ArrowLeft,
  Building, 
  MapPin, 
  Star, 
  ArrowRight, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Property } from '../types';

interface SavedHomesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onRemoveSaved: (propertyId: string) => void;
  onClearAll: () => void;
  onExploreHomes: () => void;
}

export const SavedHomesModal: React.FC<SavedHomesModalProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onSelectProperty,
  onRemoveSaved,
  onClearAll,
  onExploreHomes,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top-Left Back Button */}
            <button
              id="saved-modal-back-btn"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs hidden xs:flex">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Saved Homes & Wishlist
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {savedProperties.length === 0 
                  ? 'No homes saved yet' 
                  : `${savedProperties.length} property${savedProperties.length > 1 ? 'ies' : ''} shortlisted`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedProperties.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all saved homes"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {savedProperties.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Heart className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                You have not saved any society flats or rooms yet. Tap the heart icon on any property card or listing to shortlist your favorites for quick comparison and booking.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreHomes();
                }}
                className="mt-6 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Building className="w-4 h-4" />
                <span>Explore Society Stays</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProperties.map((property) => (
                <div 
                  key={property.id}
                  onClick={() => {
                    onSelectProperty(property);
                    onClose();
                  }}
                  className="group p-3.5 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-400/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                        <span>{property.propertyType}</span>
                        <span>•</span>
                        <span>{property.bhk}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                        {property.title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{property.area}, {property.city}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-slate-900">
                          ₹{property.rent.toLocaleString()}
                          <span className="text-[10px] text-slate-500 font-normal">
                            {property.propertyType === 'One-Day Stay' ? '/night' : '/mo'}
                          </span>
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Zero Brokerage
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSaved(property.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProperty(property);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Stay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Direct society allotment with 48hr deposit refund</span>
            <button
              onClick={() => {
                onClose();
                onExploreHomes();
              }}
              className="font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Browse More Listings →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
