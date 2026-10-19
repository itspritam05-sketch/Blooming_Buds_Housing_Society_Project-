import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building, 
  MapPin, 
  Search, 
  Filter, 
  Sparkles, 
  Compass, 
  IndianRupee, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  Users, 
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  LocateFixed,
  Navigation,
  X,
  AlertCircle
} from 'lucide-react';
import { Property, User, Booking, Review, UserRole } from './types';
import { INITIAL_PROPERTIES } from './data/properties';
import { api } from './services/api';
import { fetchCurrentGPSLocation, UserLocationResult, calculateDistanceKm } from './services/locationService';

export interface AppFilterState {
  city: string;
  propertyType: string;
  rentType: string;
  minPrice: number;
  maxPrice: number;
  furnishing: string;
  genderPreference: string;
  amenities: string[];
  bhk: string;
  search: string;
}

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { QuickCategories } from './components/QuickCategories';
import { SocietyShowcaseBanner } from './components/SocietyShowcaseBanner';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { BookingModal } from './components/BookingModal';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { AIMatcherModal } from './components/AIMatcherModal';
import { SavedHomesModal } from './components/SavedHomesModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ScheduleVisitModal } from './components/ScheduleVisitModal';
import { ChatWithOwnerModal } from './components/ChatWithOwnerModal';
import { AIChatWidget } from './components/AIChatWidget';
import { Footer } from './components/Footer';
import { LogoModal } from './components/LogoModal';

export default function App() {
  // Navigation & Page State with History Stack
  const [activePage, setActivePage] = useState<'home' | 'explore' | 'customer-dashboard' | 'owner-dashboard' | 'admin-dashboard'>('home');
  const [pageHistory, setPageHistory] = useState<('home' | 'explore' | 'customer-dashboard' | 'owner-dashboard' | 'admin-dashboard')[]>(['home']);

  // Handle Page Navigation with History tracking
  const handleNavigate = (page: 'home' | 'explore' | 'customer-dashboard' | 'owner-dashboard' | 'admin-dashboard') => {
    if (page !== activePage) {
      setPageHistory(prev => [...prev, page]);
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Permanent Global Back Handler
  const handleGoBack = () => {
    // 1. Close any active modals first
    if (selectedPropertyForBooking) {
      setSelectedPropertyForBooking(null);
      return;
    }
    if (selectedPropertyForScheduleVisit) {
      setSelectedPropertyForScheduleVisit(null);
      return;
    }
    if (selectedPropertyForOwnerChat) {
      setSelectedPropertyForOwnerChat(null);
      return;
    }
    if (selectedPropertyForDetails) {
      setSelectedPropertyForDetails(null);
      return;
    }
    if (showAIMatcher) {
      setShowAIMatcher(false);
      return;
    }
    if (showInteractiveMap) {
      setShowInteractiveMap(false);
      return;
    }
    if (showSavedHomesModal) {
      setShowSavedHomesModal(false);
      return;
    }
    if (showAuthModal) {
      setShowAuthModal(false);
      return;
    }
    if (showLogoModal) {
      setShowLogoModal(false);
      return;
    }

    // 2. Pop navigation history if available
    if (pageHistory.length > 1) {
      const updatedHistory = [...pageHistory];
      updatedHistory.pop(); // remove current page
      const previousPage = updatedHistory[updatedHistory.length - 1];
      setPageHistory(updatedHistory);
      setActivePage(previousPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. If on a sub-view and history is at root, go to Home
    if (activePage !== 'home') {
      setActivePage('home');
      setPageHistory(['home']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. If already on Home with no modals, smoothly scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication State - starts as null (no built-in customer)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('customer');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Properties & Listings Data
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<AppFilterState>({
    city: '',
    propertyType: '',
    rentType: '',
    minPrice: 0,
    maxPrice: 60000,
    furnishing: '',
    genderPreference: '',
    amenities: [],
    bhk: '',
    search: '',
  });

  // GPS Geolocation & Near Me State
  const [userLocation, setUserLocation] = useState<UserLocationResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // User Actions State - starts empty (no default data)
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Modals & Overlays
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<Property | null>(null);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState<Property | null>(null);
  const [selectedPropertyForScheduleVisit, setSelectedPropertyForScheduleVisit] = useState<Property | null>(null);
  const [selectedPropertyForOwnerChat, setSelectedPropertyForOwnerChat] = useState<Property | null>(null);
  const [showAIMatcher, setShowAIMatcher] = useState(false);
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [showSavedHomesModal, setShowSavedHomesModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  // Reviews Dictionary (PropertyId -> Review[])
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});

  // Ensure light mode theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Live GPS Acquisition Handler for Near Me
  const handleFetchGPSLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const loc = await fetchCurrentGPSLocation();
      setUserLocation(loc);
      // Cleanly assign nearest hub or city without restrictive search keyword
      setFilters(prev => ({
        ...prev,
        city: loc.nearestHubCity || loc.city,
        search: '', // clear text query so all nearby society homes appear
      }));
      // Smooth scroll to explore listings section
      setTimeout(() => {
        const resultsEl = document.getElementById('explore-listings-section');
        resultsEl?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.warn('GPS location fetch error in App:', err);
      setLocationError(err.message || 'Unable to access your current location. Please allow browser location permissions.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleClearGPSLocation = () => {
    setUserLocation(null);
    setLocationError(null);
    setFilters(prev => ({
      ...prev,
      city: '',
      search: '',
    }));
  };

  // Fetch properties & initial bookings on load
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingProperties(true);
      try {
        const propRes = await api.getProperties();
        if (propRes.properties && propRes.properties.length > 0) {
          setProperties(propRes.properties);
        }

        const bookRes = await api.getBookings();
        if (bookRes.bookings) {
          setBookings(bookRes.bookings);
        }
      } catch (err) {
        console.error('Failed to fetch from backend API, using initial properties:', err);
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchInitialData();
  }, []);

  // Open Auth helper
  const handleOpenAuth = (role: UserRole = 'customer', mode: 'login' | 'signup' = 'login') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  // Safe Booking Gate: Before login, users cannot book any room
  const handleInitiateBooking = (property: Property) => {
    if (!currentUser) {
      setAuthModalRole('customer');
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    setSelectedPropertyForBooking(property);
  };

  // Handle Role Switching
  const handleRoleChange = (newRole: UserRole) => {
    const ADMIN_OWNER_EMAIL = 'pritambhanase05@gmail.com';

    if (!currentUser) {
      handleOpenAuth(newRole, 'login');
      return;
    }

    if ((newRole === 'admin' || newRole === 'owner') && currentUser.email.toLowerCase() !== ADMIN_OWNER_EMAIL.toLowerCase()) {
      // Non-owner trying to access owner/admin: prompt login with owner credentials
      handleOpenAuth(newRole, 'login');
      return;
    }

    setCurrentUser(prev => prev ? ({
      ...prev,
      role: newRole,
      name: prev.email.toLowerCase() === ADMIN_OWNER_EMAIL.toLowerCase() 
        ? (newRole === 'admin' ? 'Pritam Bhanase (Owner & Admin)' : newRole === 'owner' ? 'Pritam Bhanase (Owner)' : 'Pritam Bhanase')
        : (prev.name || 'Resident User'),
    }) : null);

    if (newRole === 'customer') handleNavigate('customer-dashboard');
    else if (newRole === 'owner') handleNavigate('owner-dashboard');
    else if (newRole === 'admin') handleNavigate('admin-dashboard');
  };

  // Toggle Save Property
  const handleToggleSave = (propertyId: string) => {
    setSavedPropertyIds(prev => 
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  // Add Review
  const handleAddReview = async (reviewData: Partial<Review>) => {
    if (!selectedPropertyForDetails) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      propertyId: selectedPropertyForDetails.id,
      userId: currentUser?.id || 'guest-user',
      userName: reviewData.userName || currentUser?.name || 'Society Member',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: reviewData.rating || 5,
      date: 'Just now',
      comment: reviewData.comment || '',
      likes: 0,
      userRole: 'Verified Resident',
      isVerifiedStay: true,
      helpfulCount: 0
    };

    setReviewsMap(prev => ({
      ...prev,
      [selectedPropertyForDetails.id]: [newRev, ...(prev[selectedPropertyForDetails.id] || [])]
    }));

    try {
      await api.createReview(selectedPropertyForDetails.id, newRev);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLikeReview = (reviewId: string) => {
    if (!selectedPropertyForDetails) return;
    const propId = selectedPropertyForDetails.id;
    setReviewsMap(prev => ({
      ...prev,
      [propId]: (prev[propId] || []).map(r => r.id === reviewId ? { ...r, likes: r.likes + 1 } : r)
    }));
  };

  // Filtered Properties Computation with Smart Hub & Distance Sorting
  const filteredProperties = useMemo(() => {
    let result = properties.filter((p) => {
      // 1. City / Hub Matching
      if (filters.city && filters.city !== 'All' && filters.city !== 'All Cities') {
        const targetCity = filters.city.toLowerCase().trim();
        const pCity = (p.city || '').toLowerCase();
        const pArea = (p.area || '').toLowerCase();
        const pSociety = (p.societyName || '').toLowerCase();
        const pTitle = (p.title || '').toLowerCase();

        if (targetCity === 'talegaon dabhade' || targetCity === 'talegaon') {
          const isTalegaon = pArea.includes('talegaon') || pCity.includes('talegaon') || pSociety.includes('talegaon') || pTitle.includes('talegaon');
          if (!isTalegaon) return false;
        } else if (targetCity === 'pune') {
          const isPune = pCity.includes('pune') || pArea.includes('talegaon') || pArea.includes('viman') || pArea.includes('hinjewadi') || pArea.includes('kothrud') || pArea.includes('baner') || pArea.includes('wakad') || pArea.includes('kharadi');
          if (!isPune) return false;
        } else if (targetCity === 'bengaluru' || targetCity === 'bangalore') {
          const isBlr = pCity.includes('bengaluru') || pCity.includes('bangalore') || pArea.includes('koramangala') || pArea.includes('indiranagar') || pArea.includes('whitefield') || pArea.includes('hsr');
          if (!isBlr) return false;
        } else if (targetCity === 'mumbai') {
          const isMum = pCity.includes('mumbai') || pArea.includes('powai') || pArea.includes('bandra') || pArea.includes('andheri') || pArea.includes('thane');
          if (!isMum) return false;
        } else if (targetCity === 'delhi' || targetCity === 'gurgaon' || targetCity === 'noida') {
          const isNCR = pCity.includes('delhi') || pCity.includes('gurgaon') || pCity.includes('noida') || pArea.includes('campus') || pArea.includes('cyber');
          if (!isNCR && !pCity.includes(targetCity)) return false;
        } else {
          const isMatch = pCity.includes(targetCity) || pArea.includes(targetCity) || pSociety.includes(targetCity) || pTitle.includes(targetCity);
          if (!isMatch) return false;
        }
      }

      // 2. Property Type
      if (filters.propertyType && filters.propertyType !== 'All') {
        if (filters.propertyType === 'PG' && p.propertyType !== 'PG' && p.propertyType !== 'Hostel') return false;
        if (filters.propertyType === 'Flat' && p.propertyType !== 'Flat' && p.propertyType !== 'Apartment') return false;
        if (filters.propertyType === 'Co-Living' && p.propertyType !== 'Co-Living') return false;
        if (filters.propertyType === 'One-Day Stay' && p.propertyType !== 'One-Day Stay') return false;
        if (p.propertyType !== filters.propertyType && filters.propertyType !== 'PG' && filters.propertyType !== 'Flat') return false;
      }

      // 3. Rent Type
      if (filters.rentType && filters.rentType !== 'All' && p.rentType !== filters.rentType) {
        return false;
      }

      // 4. Price Boundaries
      if (filters.maxPrice && p.rent > filters.maxPrice) {
        return false;
      }
      if (filters.minPrice && p.rent < filters.minPrice) {
        return false;
      }

      // 5. Furnishing
      if (filters.furnishing && filters.furnishing !== 'All' && p.furnishing !== filters.furnishing) {
        return false;
      }

      // 6. Gender Preference
      if (filters.genderPreference && filters.genderPreference !== 'All' && filters.genderPreference !== 'Any') {
        if (p.genderPreference !== filters.genderPreference && p.genderPreference !== 'Any') {
          return false;
        }
      }

      // 7. BHK
      if (filters.bhk && filters.bhk !== 'All' && p.bhk !== filters.bhk) {
        return false;
      }

      // 8. Amenities
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((a) => p.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      // 9. Search Query
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchCity = p.city.toLowerCase().includes(query);
        const matchArea = p.area.toLowerCase().includes(query);
        const matchSociety = p.societyName.toLowerCase().includes(query);
        const matchAddress = (p.address || '').toLowerCase().includes(query);
        if (!matchTitle && !matchCity && !matchArea && !matchSociety && !matchAddress) {
          return false;
        }
      }

      return true;
    });

    // Fallback: If strict city filter produced 0 results due to a distinct suburb detected by GPS,
    // show accommodations relaxed by city so the user ALWAYS gets proximity-matched stays
    if (result.length === 0 && (filters.city || userLocation)) {
      result = properties.filter((p) => {
        if (filters.propertyType && filters.propertyType !== 'All') {
          if (filters.propertyType === 'PG' && p.propertyType !== 'PG' && p.propertyType !== 'Hostel') return false;
          if (filters.propertyType === 'Flat' && p.propertyType !== 'Flat' && p.propertyType !== 'Apartment') return false;
          if (p.propertyType !== filters.propertyType && filters.propertyType !== 'PG' && filters.propertyType !== 'Flat') return false;
        }
        if (filters.maxPrice && p.rent > filters.maxPrice) return false;
        return true;
      });
    }

    // Proximity Sorting: If GPS Location is active, sort strictly from closest to farthest!
    if (userLocation) {
      result = [...result].sort((a, b) => {
        const distA = calculateDistanceKm(userLocation.latitude, userLocation.longitude, a.lat, a.lng);
        const distB = calculateDistanceKm(userLocation.latitude, userLocation.longitude, b.lat, b.lng);
        return distA - distB;
      });
    }

    return result;
  }, [properties, filters, userLocation]);

  const savedProperties = properties.filter(p => savedPropertyIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onRoleChange={handleRoleChange}
        activePage={activePage}
        onNavigate={handleNavigate}
        onGoBack={handleGoBack}
        savedCount={savedPropertyIds.length}
        onOpenSavedHomes={() => setShowSavedHomesModal(true)}
        onOpenAIMatcher={() => setShowAIMatcher(true)}
        onOpenMap={() => setShowInteractiveMap(true)}
        onOpenLogoModal={() => setShowLogoModal(true)}
        onSelectCity={(city) => {
          setFilters(prev => ({ ...prev, city }));
          handleNavigate('explore');
        }}
        onLogout={() => {
          setCurrentUser(null);
          handleNavigate('home');
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {activePage === 'home' && (
          <div>
            {/* Hero Banner with Search Bar */}
            <HeroSection
              filters={filters}
              onFilterChange={setFilters}
              userLocation={userLocation}
              onFetchLocation={handleFetchGPSLocation}
              onClearLocation={handleClearGPSLocation}
              isLocating={isLocating}
              onSearchSubmit={() => {
                const resultsEl = document.getElementById('explore-listings-section');
                resultsEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAIMatcher={() => setShowAIMatcher(true)}
              onOpenMap={() => setShowInteractiveMap(true)}
              onQuickCategorySelect={(cat) => {
                setFilters(prev => ({ ...prev, propertyType: cat === 'All' ? '' : cat }));
              }}
            />

            {/* Quick Stats Banner */}
            <StatsSection />

            {/* Aesthetic Full-Width Housing Society Showcase & Parallax Banner */}
            <SocietyShowcaseBanner
              onExploreStays={() => {
                const resultsEl = document.getElementById('explore-listings-section');
                resultsEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenMap={() => setShowInteractiveMap(true)}
              onOpenLogoModal={() => setShowLogoModal(true)}
            />

            {/* Quick Accommodation Categories */}
            <QuickCategories
              selectedCategory={filters.propertyType}
              onSelectCategory={(cat) => {
                setFilters(prev => ({ ...prev, propertyType: prev.propertyType === cat ? '' : cat }));
                const resultsEl = document.getElementById('explore-listings-section');
                resultsEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Main Listings Section with Filter Bar */}
            <section id="explore-listings-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                      Verified Society Listings
                    </span>
                    <span className="text-xs text-slate-500">Zero Brokerage Guarantee</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                    Discover Society Residences & Rooms
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing {filteredProperties.length} active accommodations matching your criteria
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    id="home-near-me-btn"
                    onClick={userLocation ? handleClearGPSLocation : handleFetchGPSLocation}
                    disabled={isLocating}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                      userLocation 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Locating...' : userLocation ? 'Near Me (Active)' : 'Near Me'}</span>
                    {userLocation && <X className="w-3.5 h-3.5 ml-0.5" />}
                  </button>

                  <button
                    id="home-map-view-btn"
                    onClick={() => setShowInteractiveMap(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>Map View</span>
                  </button>

                  <button
                    id="home-ai-matcher-btn"
                    onClick={() => setShowAIMatcher(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>AI Stay Matcher</span>
                  </button>
                </div>
              </div>

              {/* Active Location Banner */}
              {userLocation && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Showing society homes sorted by real distance from <strong>{userLocation.formattedAddress || `${userLocation.area || ''}, ${userLocation.city}`}</strong>
                    </span>
                  </div>
                  <button
                    onClick={handleClearGPSLocation}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 cursor-pointer"
                  >
                    Clear Location
                  </button>
                </div>
              )}

              {/* Advanced Filter Bar Component */}
              <FilterBar
                filters={filters}
                onFilterChange={setFilters}
                totalResults={filteredProperties.length}
                userLocation={userLocation}
                onFetchLocation={handleFetchGPSLocation}
                onClearLocation={handleClearGPSLocation}
                isLocating={isLocating}
                onResetFilters={() => {
                  handleClearGPSLocation();
                  setFilters({
                    city: '',
                    propertyType: '',
                    rentType: '',
                    minPrice: 0,
                    maxPrice: 60000,
                    furnishing: '',
                    genderPreference: '',
                    amenities: [],
                    bhk: '',
                    search: '',
                  });
                }}
              />

              {/* Properties Grid */}
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      userLocation={userLocation}
                      onSelect={(p) => setSelectedPropertyForDetails(p)}
                      onToggleSave={handleToggleSave}
                      isSaved={savedPropertyIds.includes(property.id)}
                      onBookNow={(p) => handleInitiateBooking(p)}
                      onScheduleVisit={(p) => setSelectedPropertyForScheduleVisit(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 mt-6 shadow-xs">
                  <Building className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No properties match your filters</h3>
                  <p className="text-xs text-slate-500 mt-1">Try expanding your price range or clearing some filters.</p>
                  <button
                    onClick={() => {
                      handleClearGPSLocation();
                      setFilters({
                        city: '',
                        propertyType: '',
                        rentType: '',
                        minPrice: 0,
                        maxPrice: 60000,
                        furnishing: '',
                        genderPreference: '',
                        amenities: [],
                        bhk: '',
                        search: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

            </section>
          </div>
        )}

        {/* VIEW 2: EXPLORE / SEARCH CATALOG */}
        {activePage === 'explore' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                All Society Accommodations & Inventory
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Zero brokerage flats, executive co-living, PGs, hostels, and 1-day transit suites across India
              </p>
            </div>

            {/* Active Location Banner in Explore */}
            {userLocation && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Showing society homes sorted by real distance from <strong>{userLocation.formattedAddress || `${userLocation.area || ''}, ${userLocation.city}`}</strong>
                  </span>
                </div>
                <button
                  onClick={handleClearGPSLocation}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 cursor-pointer"
                >
                  Clear Location
                </button>
              </div>
            )}

            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              totalResults={filteredProperties.length}
              userLocation={userLocation}
              onFetchLocation={handleFetchGPSLocation}
              onClearLocation={handleClearGPSLocation}
              isLocating={isLocating}
              onResetFilters={() => {
                handleClearGPSLocation();
                setFilters({
                  city: '',
                  propertyType: '',
                  rentType: '',
                  minPrice: 0,
                  maxPrice: 60000,
                  furnishing: '',
                  genderPreference: '',
                  amenities: [],
                  bhk: '',
                  search: '',
                });
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  userLocation={userLocation}
                  onSelect={(p) => setSelectedPropertyForDetails(p)}
                  onToggleSave={handleToggleSave}
                  isSaved={savedPropertyIds.includes(property.id)}
                  onBookNow={(p) => handleInitiateBooking(p)}
                  onScheduleVisit={(p) => setSelectedPropertyForScheduleVisit(p)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: RESIDENT / CUSTOMER DASHBOARD */}
        {activePage === 'customer-dashboard' && (
          <CustomerDashboard
            currentUser={currentUser}
            bookings={bookings}
            savedProperties={savedProperties}
            onSelectProperty={(p) => setSelectedPropertyForDetails(p)}
            onCancelBooking={(bookingId) => {
              setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
              alert('Booking cancellation submitted. Deposit refund of ₹' + (bookings.find(b=>b.id===bookingId)?.depositAmount || 0) + ' will be credited within 48 hours.');
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* VIEW 4: OWNER / CARETAKER DASHBOARD */}
        {activePage === 'owner-dashboard' && (
          <OwnerDashboard
            currentUser={currentUser}
            properties={properties}
            onAddNewProperty={(newProp) => setProperties(prev => [newProp, ...prev])}
            onSelectProperty={(p) => setSelectedPropertyForDetails(p)}
            onDeleteProperty={(id) => {
              setProperties(prev => prev.filter(p => p.id !== id));
              alert('Property removed from society listings.');
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* VIEW 5: ADMIN MASTER DASHBOARD */}
        {activePage === 'admin-dashboard' && (
          <AdminDashboard
            properties={properties}
            bookings={bookings}
            currentUser={currentUser}
            onSelectProperty={(p) => setSelectedPropertyForDetails(p)}
            onDeleteProperty={(id) => {
              setProperties(prev => prev.filter(p => p.id !== id));
              alert('Property listing removed by Administrator.');
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

      </main>

      {/* Floating Buds Concierge AI Assistant */}
      <AIChatWidget />

      {/* MODALS */}
      {/* 1. Property Details Modal */}
      {selectedPropertyForDetails && (
        <PropertyDetailsModal
          property={selectedPropertyForDetails}
          onClose={() => setSelectedPropertyForDetails(null)}
          isSaved={savedPropertyIds.includes(selectedPropertyForDetails.id)}
          onToggleSave={handleToggleSave}
          onBookNow={(p) => {
            setSelectedPropertyForDetails(null);
            handleInitiateBooking(p);
          }}
          onScheduleVisit={(p) => {
            setSelectedPropertyForScheduleVisit(p);
            setSelectedPropertyForDetails(null);
          }}
          onOpenOwnerChat={(p) => {
            setSelectedPropertyForOwnerChat(p);
            setSelectedPropertyForDetails(null);
          }}
          reviews={reviewsMap[selectedPropertyForDetails.id] || [
            {
              id: 'rev-default-1',
              propertyId: selectedPropertyForDetails.id,
              userId: 'u1',
              userName: 'Rahul Verma',
              userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              rating: 5,
              date: '2 weeks ago',
              comment: 'Exceptional stay! High-speed WiFi made work-from-home effortless. Cleanliness and food served are top-notch.',
              likes: 12,
              userRole: 'Verified Resident'
            },
            {
              id: 'rev-default-2',
              propertyId: selectedPropertyForDetails.id,
              userId: 'u2',
              userName: 'Pooja Iyer',
              userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
              rating: 5,
              date: '1 month ago',
              comment: 'Great society security, 24x7 power backup, and quiet study room. Caretaker is polite and very helpful.',
              likes: 8,
              userRole: 'Verified Resident'
            }
          ]}
          onAddReview={handleAddReview}
          onLikeReview={handleLikeReview}
        />
      )}

      {/* 2. Instant Booking & Invoice Modal */}
      {selectedPropertyForBooking && (
        <BookingModal
          property={selectedPropertyForBooking}
          currentUser={currentUser}
          onClose={() => setSelectedPropertyForBooking(null)}
          onRequireAuth={() => {
            setSelectedPropertyForBooking(null);
            handleOpenAuth('customer', 'login');
          }}
          onBookingSuccess={(newBooking) => {
            setBookings(prev => [newBooking, ...prev]);
          }}
        />
      )}

      {/* 3. Interactive Map Modal */}
      {showInteractiveMap && (
        <InteractiveMapModal
          properties={properties}
          selectedCity={filters.city}
          initialUserLocation={userLocation}
          onUserLocationDetected={(loc) => {
            setUserLocation(loc);
            setFilters(prev => ({
              ...prev,
              city: loc.nearestHubCity || loc.city,
              search: '',
            }));
          }}
          onClose={() => setShowInteractiveMap(false)}
          onSelectProperty={(p) => setSelectedPropertyForDetails(p)}
        />
      )}

      {/* 4. AI Property Matcher Modal */}
      {showAIMatcher && (
        <AIMatcherModal
          properties={properties}
          onClose={() => setShowAIMatcher(false)}
          onSelectProperty={(p) => setSelectedPropertyForDetails(p)}
          onBookNow={(p) => {
            setShowAIMatcher(false);
            handleInitiateBooking(p);
          }}
        />
      )}

      {/* 4.1 Saved Homes & Shortlist Modal */}
      <SavedHomesModal
        isOpen={showSavedHomesModal}
        onClose={() => setShowSavedHomesModal(false)}
        savedProperties={savedProperties}
        onSelectProperty={(p) => {
          setSelectedPropertyForDetails(p);
        }}
        onRemoveSaved={handleToggleSave}
        onClearAll={() => setSavedPropertyIds([])}
        onExploreHomes={() => {
          setActivePage('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Schedule Free Physical Visit Modal */}
      {selectedPropertyForScheduleVisit && (
        <ScheduleVisitModal
          property={selectedPropertyForScheduleVisit}
          currentUser={currentUser}
          onClose={() => setSelectedPropertyForScheduleVisit(null)}
        />
      )}

      {/* 6. Chat with Caretaker Modal */}
      {selectedPropertyForOwnerChat && (
        <ChatWithOwnerModal
          property={selectedPropertyForOwnerChat}
          currentUser={currentUser}
          onClose={() => setSelectedPropertyForOwnerChat(null)}
        />
      )}

      {/* 7. Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          initialRole={authModalRole}
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onOpenLogoModal={() => setShowLogoModal(true)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            if (user.role === 'customer') setActivePage('customer-dashboard');
            else if (user.role === 'owner') setActivePage('owner-dashboard');
            else if (user.role === 'admin') setActivePage('admin-dashboard');
          }}
        />
      )}

      {/* 8. Blooming Buds Society Logo Maximized Modal */}
      {showLogoModal && (
        <LogoModal
          onClose={() => setShowLogoModal(false)}
        />
      )}

      {/* Full Society Footer */}
      <Footer
        onOpenLogoModal={() => setShowLogoModal(true)}
        onSelectCategory={(cat) => {
          setFilters(prev => ({ ...prev, propertyType: cat }));
          setActivePage('home');
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onSelectCity={(city) => {
          setFilters(prev => ({ ...prev, city }));
          setActivePage('home');
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
