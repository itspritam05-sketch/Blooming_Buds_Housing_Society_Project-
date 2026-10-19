import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  ShieldCheck, 
  Coffee,
  Wind,
  Wifi,
  CheckCircle,
  Building,
  ArrowRight,
  LocateFixed,
  Loader2,
  CheckCircle2,
  Navigation,
  X,
  AlertCircle
} from 'lucide-react';
import { PropertyType } from '../types';
import { fetchCurrentGPSLocation, UserLocationResult } from '../services/locationService';
import { HERO_SOCIETY_BG_IMAGE } from '../assets/societyMedia';

interface HeroSectionProps {
  filters: any;
  setFilters?: any;
  onFilterChange?: any;
  onSearch?: () => void;
  onSearchSubmit?: () => void;
  onOpenAIMatcher?: () => void;
  onOpenMap?: () => void;
  onQuickCategorySelect?: (type: PropertyType | 'All') => void;
  userLocation?: UserLocationResult | null;
  onFetchLocation?: () => void;
  onClearLocation?: () => void;
  isLocating?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  setFilters: propSetFilters,
  onFilterChange,
  onSearch,
  onSearchSubmit,
  onOpenAIMatcher,
  onOpenMap,
  onQuickCategorySelect,
  userLocation: propUserLocation,
  onFetchLocation: propOnFetchLocation,
  onClearLocation: propOnClearLocation,
  isLocating: propIsLocating,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pg' | 'flat' | 'oneday' | 'coliving'>('all');
  
  // Geolocation Local State Fallback
  const [localIsFetchingLocation, setLocalIsFetchingLocation] = useState(false);
  const [localDetectedLocation, setLocalDetectedLocation] = useState<UserLocationResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const detectedLocation = propUserLocation !== undefined ? propUserLocation : localDetectedLocation;
  const isFetchingLocation = propIsLocating !== undefined ? propIsLocating : localIsFetchingLocation;

  const updateFilters = (updater: (prev: any) => any) => {
    if (propSetFilters) {
      propSetFilters(updater);
    } else if (onFilterChange) {
      onFilterChange(updater);
    }
  };

  const handleSearchClick = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
    } else if (onSearch) {
      onSearch();
    } else {
      const resultsEl = document.getElementById('explore-listings-section');
      resultsEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFetchCurrentLocation = async () => {
    if (propOnFetchLocation) {
      propOnFetchLocation();
      return;
    }

    setLocalIsFetchingLocation(true);
    setLocationError(null);

    try {
      // Directly trigger the browser's native location permission prompt
      const result = await fetchCurrentGPSLocation();
      setLocalDetectedLocation(result);

      // Update filters with detected city without restrictive search keyword
      updateFilters(prev => ({
        ...prev,
        city: result.nearestHubCity || result.city,
        search: '',
        query: '',
      }));

      // Smooth scroll to explore section to show nearby flats
      setTimeout(() => {
        const resultsEl = document.getElementById('explore-listings-section');
        resultsEl?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      console.error('Location fetch error:', err);
      setLocationError(err.message || 'Location permission not granted. Please allow location in your browser and try again.');
    } finally {
      setLocalIsFetchingLocation(false);
    }
  };

  const handleClearLocation = () => {
    if (propOnClearLocation) {
      propOnClearLocation();
      return;
    }
    setLocalDetectedLocation(null);
    setLocationError(null);
    updateFilters(prev => ({
      ...prev,
      search: '',
      query: '',
      city: ''
    }));
  };

  const topCities = [
    'All Cities',
    'Talegaon Dabhade',
    'Pune',
    'Bengaluru',
    'Mumbai',
    'Hyderabad',
    'Gurgaon',
    'Delhi',
    'Noida'
  ];

  const handleTabClick = (tab: 'all' | 'pg' | 'flat' | 'oneday' | 'coliving') => {
    setActiveTab(tab);
    if (tab === 'all') {
      updateFilters(prev => ({ ...prev, propertyType: '' }));
      onQuickCategorySelect?.('All');
    } else if (tab === 'pg') {
      updateFilters(prev => ({ ...prev, propertyType: 'PG' }));
      onQuickCategorySelect?.('PG');
    } else if (tab === 'flat') {
      updateFilters(prev => ({ ...prev, propertyType: 'Flat' }));
      onQuickCategorySelect?.('Flat');
    } else if (tab === 'oneday') {
      updateFilters(prev => ({ ...prev, propertyType: 'One-Day Stay' }));
      onQuickCategorySelect?.('One-Day Stay');
    } else if (tab === 'coliving') {
      updateFilters(prev => ({ ...prev, propertyType: 'Co-Living' }));
      onQuickCategorySelect?.('Co-Living');
    }
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-slate-950 text-slate-900 py-12 lg:py-24 border-b border-slate-200/80">
      
      {/* High-Resolution Aesthetic Society Architectural Backdrop Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={HERO_SOCIETY_BG_IMAGE}
          alt="Blooming Buds Housing Society Luxury Architecture"
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] transform scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Soft frosted luxury gradients: clean text contrast & aesthetic ambient depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/70" />
        <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Society Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-300 text-xs font-bold tracking-wide mb-5 shadow-lg border border-white/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-white">Blooming Buds Housing Society</span>
          <span className="text-emerald-300 font-normal hidden sm:inline">• Verified Zero Brokerage Stays</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Main Headings */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto drop-shadow-lg">
          Find Your <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">Ideal Flat & Room</span> in Society
        </h1>
        
        <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Furnished PGs, Co-Living suites, 1/2/3 BHK flats, hostels, and 1-day transit rooms with real-time GPS location matching and zero brokerage.
        </p>

        {/* Category Filter Tabs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-2xl mx-auto p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md shadow-xl border border-white/15">
          <button
            id="tab-all"
            onClick={() => handleTabClick('all')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All Homes
          </button>
          <button
            id="tab-flat"
            onClick={() => handleTabClick('flat')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'flat'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Flats & BHKs
          </button>
          <button
            id="tab-coliving"
            onClick={() => handleTabClick('coliving')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'coliving'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Co-Living
          </button>
          <button
            id="tab-pg"
            onClick={() => handleTabClick('pg')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'pg'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            PGs & Hostels
          </button>
          <button
            id="tab-oneday"
            onClick={() => handleTabClick('oneday')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'oneday'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            1-Day Stays
          </button>
        </div>

        {/* Main Floating Light Search Card */}
        <div className="mt-5 p-3 sm:p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xl max-w-5xl mx-auto">
          
          {/* Active GPS Location Notification Pill */}
          {detectedLocation && (
            <div className="mb-3 px-3.5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Navigation className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-emerald-950">Current Location Detected:</span>
                    <span className="text-xs font-extrabold text-emerald-800">
                      {detectedLocation.area ? `${detectedLocation.area}, ` : ''}{detectedLocation.city}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium truncate max-w-md">
                    GPS Coordinates: {detectedLocation.latitude.toFixed(4)}°N, {detectedLocation.longitude.toFixed(4)}°E • Showing closest society flats & stays
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={handleFetchCurrentLocation}
                  disabled={isFetchingLocation}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-200/70 hover:bg-emerald-200 flex items-center gap-1 cursor-pointer"
                  title="Refresh GPS location"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleClearLocation}
                  className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-200/70 hover:text-emerald-900 transition-colors cursor-pointer"
                  title="Clear location filter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Location Error Warning */}
          {locationError && (
            <div className="mb-3 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2 text-left text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{locationError}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleFetchCurrentLocation}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button 
                  onClick={() => setLocationError(null)} 
                  className="p-1 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900 rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* City Selector */}
            <div className="flex flex-col text-left px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Metro City
              </label>
              <select
                id="hero-city-select"
                value={filters.city || ''}
                onChange={(e) => updateFilters(prev => ({ ...prev, city: e.target.value }))}
                className="w-full mt-1 bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {topCities.map(c => (
                  <option key={c} value={c === 'All Cities' ? '' : c} className="text-slate-800">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword / Area / College Search with Location Button */}
            <div className="flex flex-col text-left px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                  <Search className="w-3.5 h-3.5 text-teal-600" />
                  Locality / Landmark
                </label>
                
                {/* Micro Quick GPS Button */}
                <button
                  id="hero-fetch-location-input-btn"
                  onClick={handleFetchCurrentLocation}
                  disabled={isFetchingLocation}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="Detect GPS Location"
                >
                  {isFetchingLocation ? (
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                  ) : (
                    <LocateFixed className="w-3 h-3 text-emerald-600" />
                  )}
                  <span>{isFetchingLocation ? 'Locating...' : 'Near Me'}</span>
                </button>
              </div>

              <input
                id="hero-query-input"
                type="text"
                value={filters.search ?? filters.query ?? ''}
                onChange={(e) => updateFilters(prev => ({ ...prev, search: e.target.value, query: e.target.value }))}
                placeholder="e.g. Viman Nagar, Hinjewadi, Powai"
                className="w-full mt-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            {/* Budget / Price Range */}
            <div className="flex flex-col text-left px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                Monthly Budget
              </label>
              <select
                id="hero-budget-select"
                value={filters.maxPrice || 100000}
                onChange={(e) => updateFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full mt-1 bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value={8000}>Under ₹8,000 (Hostel / Bed)</option>
                <option value={15000}>Under ₹15,000 (Co-Living / 1RK)</option>
                <option value={30000}>Under ₹30,000 (1 & 2 BHK Flats)</option>
                <option value={60000}>Under ₹60,000 (3 BHK & Luxury)</option>
                <option value={150000}>Any Budget (All Listings)</option>
              </select>
            </div>

            {/* Submit Search Button & Fetch Location Action */}
            <div className="flex items-center gap-2">
              <button
                id="hero-search-btn"
                onClick={handleSearchClick}
                className="flex-1 h-full min-h-[52px] rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
              >
                <Search className="w-4.5 h-4.5" />
                <span>Search Stays</span>
              </button>

              {/* Dedicated Big GPS Fetch Location Button */}
              <button
                id="hero-fetch-location-btn"
                onClick={handleFetchCurrentLocation}
                disabled={isFetchingLocation}
                className={`h-full min-h-[52px] px-3.5 rounded-2xl border font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  detectedLocation 
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
                title="Fetch your current live GPS location to find flats near you"
              >
                {isFetchingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span className="text-[10px]">Locating...</span>
                  </>
                ) : (
                  <>
                    <LocateFixed className={`w-4 h-4 ${detectedLocation ? 'text-emerald-700 fill-emerald-200' : 'text-slate-600'}`} />
                    <span className="text-[10px] whitespace-nowrap">Near Me</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Quick Filter Badges */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-bold text-slate-400">Quick Filters:</span>
              
              <button
                id="filter-food-toggle"
                onClick={() => updateFilters(p => ({ ...p, foodIncluded: !p.foodIncluded }))}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  filters.foodIncluded 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                Meals Included
              </button>

              <button
                id="filter-wifi-toggle"
                onClick={() => updateFilters(p => ({ ...p, wifi: !p.wifi }))}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  filters.wifi 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                WiFi Included
              </button>

              <button
                id="filter-ac-toggle"
                onClick={() => updateFilters(p => ({ ...p, ac: !p.ac }))}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  filters.ac 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Wind className="w-3.5 h-3.5 text-blue-500" />
                AC Rooms
              </button>

              <button
                id="filter-verified-toggle"
                onClick={() => updateFilters(p => ({ ...p, ownerVerified: !p.ownerVerified }))}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  filters.ownerVerified 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Owners
              </button>
            </div>

            {/* AI Assistant Callout */}
            {onOpenAIMatcher && (
              <button
                id="hero-ai-recommendation-trigger"
                onClick={onOpenAIMatcher}
                className="text-purple-700 font-bold hover:underline flex items-center gap-1 text-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Stay Matcher →</span>
              </button>
            )}
          </div>
        </div>

        {/* Value Trust Badges */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-200 text-xs font-semibold max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>100% Zero Brokerage</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Biometric Society Security</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Instant Allotment</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>48-Hour Deposit Refund</span>
          </div>
        </div>

      </div>
    </div>
  );
};
