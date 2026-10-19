import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  RotateCcw, 
  Check, 
  IndianRupee, 
  SlidersHorizontal, 
  MapPin, 
  Home, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  LocateFixed,
  Loader2,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { SearchFilters, PropertyType, BHKType, FurnishingType, GenderPreference, RentType, StayDuration } from '../types';
import { ALL_AMENITIES } from '../data/amenities';
import { fetchCurrentGPSLocation, UserLocationResult } from '../services/locationService';

interface FilterBarProps {
  filters: any;
  setFilters?: any;
  onFilterChange?: any;
  onReset?: () => void;
  onResetFilters?: () => void;
  totalResults: number;
  onOpenMap?: () => void;
  userLocation?: UserLocationResult | null;
  onFetchLocation?: () => void;
  onClearLocation?: () => void;
  isLocating?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters: propSetFilters,
  onFilterChange,
  onReset: propOnReset,
  onResetFilters,
  totalResults,
  onOpenMap,
  userLocation: propUserLocation,
  onFetchLocation: propOnFetchLocation,
  onClearLocation: propOnClearLocation,
  isLocating: propIsLocating,
}) => {
  const setFilters = propSetFilters || onFilterChange;
  const onReset = propOnReset || onResetFilters || (() => {});
  const [modalOpen, setModalOpen] = useState(false);
  const [localIsLocating, setLocalIsLocating] = useState(false);
  const [localLocationResult, setLocalLocationResult] = useState<UserLocationResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const locationResult = propUserLocation !== undefined ? propUserLocation : localLocationResult;
  const isLocating = propIsLocating !== undefined ? propIsLocating : localIsLocating;

  const handleFetchLocation = async () => {
    if (propOnFetchLocation) {
      propOnFetchLocation();
      return;
    }
    setLocalIsLocating(true);
    setLocationError(null);
    try {
      const loc = await fetchCurrentGPSLocation();
      setLocalLocationResult(loc);
      setFilters((prev: any) => ({
        ...prev,
        city: loc.nearestHubCity || loc.city,
        search: '', // clear restrictive search query so all properties in this city appear
      }));
    } catch (err: any) {
      console.warn('GPS location fetch error:', err);
      setLocationError(err.message || 'Location permission not granted. Please check browser permissions and try again.');
    } finally {
      setLocalIsLocating(false);
    }
  };

  const handleClearGPSLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (propOnClearLocation) {
      propOnClearLocation();
      return;
    }
    setLocalLocationResult(null);
    setLocationError(null);
    setFilters((prev: any) => ({
      ...prev,
      city: '',
    }));
  };

  const cities = ['All', 'Talegaon Dabhade', 'Pune', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Gurgaon', 'Delhi', 'Noida'];
  const propertyTypes: (PropertyType | 'All')[] = ['All', 'PG', 'Hostel', 'Flat', 'Apartment', 'Co-Living', 'One-Day Stay'];
  const bhkOptions: (BHKType | 'All')[] = ['All', '1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Shared Rooms'];
  const furnishingOptions: (FurnishingType | 'All')[] = ['All', 'Fully Furnished', 'Semi Furnished', 'Non Furnished'];
  const genderOptions: (GenderPreference | 'All')[] = ['All', 'Any', 'Boys', 'Girls', 'Family'];
  const rentTypeOptions: (RentType | 'All')[] = ['All', 'Flat Basis', 'Cot Basis', 'Room Basis', 'Per Person'];
  const stayDurations: (StayDuration | 'All')[] = ['All', 'One Day', 'Weekly', 'Monthly', 'Long Term'];

  const countActiveFilters = () => {
    let count = 0;
    if (filters.city) count++;
    if (filters.area) count++;
    if (filters.propertyType) count++;
    if (filters.bhk) count++;
    if (filters.furnishing) count++;
    if (filters.genderPreference) count++;
    if (filters.rentType) count++;
    if (filters.stayDuration) count++;
    if (filters.foodIncluded) count++;
    if (filters.parking) count++;
    if (filters.petsAllowed) count++;
    if (filters.wifi) count++;
    if (filters.ac) count++;
    if (filters.lift) count++;
    if (filters.balcony) count++;
    if (filters.ownerVerified) count++;
    if (filters.maxPrice < 100000) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  const activeCount = countActiveFilters();

  return (
    <div className="sticky top-20 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Quick Filter Pills */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pb-1">
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Main Modal Trigger Button */}
            <button
              id="filter-all-btn"
              onClick={() => setModalOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                activeCount > 0
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>All Filters</span>
              {activeCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-emerald-800 text-[10px] font-extrabold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>

            {/* GPS Fetch Location Quick Button */}
            <div className="relative flex items-center">
              <button
                id="filter-gps-location-btn"
                onClick={handleFetchLocation}
                disabled={isLocating}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  locationResult
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Detect GPS location for near me stays"
              >
                {isLocating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                ) : (
                  <LocateFixed className={`w-3.5 h-3.5 ${locationResult ? 'text-emerald-700 fill-emerald-200 dark:fill-emerald-800' : 'text-emerald-600'}`} />
                )}
                <span>{isLocating ? 'Locating...' : locationResult ? `${locationResult.city} (Near Me)` : 'Near Me'}</span>
              </button>

              {locationResult && (
                <button
                  onClick={handleClearGPSLocation}
                  className="ml-1 p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-lg cursor-pointer"
                  title="Clear Near Me filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City Quick Dropdown */}
            <select
              id="filter-city-select"
              value={filters.city || 'All'}
              onChange={(e) => setFilters(p => ({ ...p, city: e.target.value === 'All' ? '' : e.target.value }))}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value="All">All Cities</option>
              {cities.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Property Type Quick Pills */}
            <select
              id="filter-type-select"
              value={filters.propertyType || 'All'}
              onChange={(e) => setFilters(p => ({ ...p, propertyType: e.target.value === 'All' ? '' : e.target.value as any }))}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value="All">All Types</option>
              <option value="Co-Living">Co-Living</option>
              <option value="PG">PG / Hostel</option>
              <option value="Flat">Flats</option>
              <option value="Apartment">Apartments</option>
              <option value="One-Day Stay">1-Day Stays</option>
            </select>

            {/* Rent Basis Filter */}
            <select
              id="filter-rent-basis"
              value={filters.rentType || 'All'}
              onChange={(e) => setFilters(p => ({ ...p, rentType: e.target.value === 'All' ? '' : e.target.value as any }))}
              className="hidden sm:block px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value="All">All Rent Basis</option>
              <option value="Flat Basis">Flat Basis</option>
              <option value="Cot Basis">Cot Basis</option>
              <option value="Room Basis">Room Basis</option>
            </select>

            {/* Budget Max Quick */}
            <select
              id="filter-price-select"
              value={filters.maxPrice || 100000}
              onChange={(e) => setFilters(p => ({ ...p, maxPrice: Number(e.target.value) }))}
              className="hidden md:block px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value={100000}>Budget: Any</option>
              <option value={8000}>Under ₹8k</option>
              <option value={15000}>Under ₹15k</option>
              <option value={25000}>Under ₹25k</option>
              <option value={50000}>Under ₹50k</option>
            </select>

            {/* Sort Filter */}
            <select
              id="filter-sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters(p => ({ ...p, sortBy: e.target.value as any }))}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-hidden"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated (4.8+)</option>
              <option value="newest">Newly Listed</option>
            </select>
          </div>

          {/* Right Action: Map Toggle and Reset */}
          <div className="flex items-center gap-2 shrink-0">
            {activeCount > 0 && (
              <button
                id="filter-reset-btn"
                onClick={onReset}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center gap-1 transition-all"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              id="view-map-btn"
              onClick={onOpenMap}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Map View</span>
            </button>
          </div>

        </div>

        {/* Location Error / Permission notification banner */}
        {locationError && (
          <div className="mt-2.5 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2 text-left text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{locationError}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleFetchLocation}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button 
                onClick={() => setLocationError(null)} 
                className="p-1 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900 rounded-lg cursor-pointer"
                title="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Filter Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Refine Property Search
                  </h3>
                  <p className="text-xs text-slate-500">Filter by accommodation criteria, amenities, and stay terms</p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-6">
              
              {/* Property Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Property Accommodation Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters(p => ({ ...p, propertyType: type === 'All' ? '' : type }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        (filters.propertyType === type || (!filters.propertyType && type === 'All'))
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rent Type (Flat Basis vs Cot Basis) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Rent Model / Lease Basis
                </label>
                <div className="flex flex-wrap gap-2">
                  {rentTypeOptions.map((rt) => (
                    <button
                      key={rt}
                      onClick={() => setFilters(p => ({ ...p, rentType: rt === 'All' ? '' : rt }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        (filters.rentType === rt || (!filters.rentType && rt === 'All'))
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>

              {/* BHK Configuration */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  BHK / Layout Configuration
                </label>
                <div className="flex flex-wrap gap-2">
                  {bhkOptions.map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setFilters(p => ({ ...p, bhk: bhk === 'All' ? '' : bhk }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        (filters.bhk === bhk || (!filters.bhk && bhk === 'All'))
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Furnishing & Gender Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                    Furnishing Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {furnishingOptions.map((furn) => (
                      <button
                        key={furn}
                        onClick={() => setFilters(p => ({ ...p, furnishing: furn === 'All' ? '' : furn }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          (filters.furnishing === furn || (!filters.furnishing && furn === 'All'))
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {furn}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                    Gender / Tenant Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map((gen) => (
                      <button
                        key={gen}
                        onClick={() => setFilters(p => ({ ...p, genderPreference: gen === 'All' ? '' : gen }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          (filters.genderPreference === gen || (!filters.genderPreference && gen === 'All'))
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {gen}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stay Duration */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Stay Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {stayDurations.map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setFilters(p => ({ ...p, stayDuration: dur === 'All' ? '' : dur }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        (filters.stayDuration === dur || (!filters.stayDuration && dur === 'All'))
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Maximum Rent Budget (Monthly)
                  </span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{filters.maxPrice ? filters.maxPrice.toLocaleString() : '100,000'}
                  </span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={80000}
                  step={1000}
                  value={filters.maxPrice || 80000}
                  onChange={(e) => setFilters(p => ({ ...p, maxPrice: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                  <span>₹3,000 (Hostel Cot)</span>
                  <span>₹25,000 (1/2 BHK)</span>
                  <span>₹80,000+ (Luxury)</span>
                </div>
              </div>

              {/* Specific Amenity Toggles */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                  Must-Have Amenities & Guarantees
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.foodIncluded}
                      onChange={(e) => setFilters(p => ({ ...p, foodIncluded: e.target.checked }))}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Food Included (Meals)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.wifi}
                      onChange={(e) => setFilters(p => ({ ...p, wifi: e.target.checked }))}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>High-Speed WiFi</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.ac}
                      onChange={(e) => setFilters(p => ({ ...p, ac: e.target.checked }))}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Air Conditioner (AC)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.parking}
                      onChange={(e) => setFilters(p => ({ ...p, parking: e.target.checked }))}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Reserved Parking</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.balcony}
                      onChange={(e) => setFilters(p => ({ ...p, balcony: e.target.checked }))}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Private Balcony</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.ownerVerified}
                      onChange={(e) => setFilters(p => ({ ...p, ownerVerified: e.target.checked }))}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Verified Owner Only</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  onReset();
                }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reset All Filters
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all"
                >
                  Show Matching Properties ({totalResults})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
