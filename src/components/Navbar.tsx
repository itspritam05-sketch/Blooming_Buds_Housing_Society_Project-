import React, { useState } from 'react';
import { 
  ArrowLeft,
  Building, 
  MapPin, 
  Search, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  User as UserIcon, 
  ChevronDown, 
  Sun, 
  Moon,
  CheckCircle2,
  LogOut,
  LogIn,
  UserPlus,
  Lock
} from 'lucide-react';
import { User, UserRole } from '../types';
import { SOCIETY_LOGO_URL } from '../assets/logo';

interface NavbarProps {
  // Navigation
  activePage?: string;
  setActivePage?: (page: any) => void;
  currentView?: string;
  onNavigate?: (view: any) => void;
  onGoBack?: () => void;
  
  // User & Auth
  currentUser: User | null;
  onRoleChange: (role: UserRole) => void;
  onOpenAuth?: (role?: UserRole, mode?: 'login' | 'signup') => void;
  onLogout?: () => void;

  // Filters & Actions
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  savedCount?: number;
  onOpenSavedHomes?: () => void;
  
  // Theme & Modals
  isDark?: boolean;
  onToggleTheme?: () => void;
  onOpenAIMatcher?: () => void;
  onOpenInteractiveMap?: () => void;
  onOpenLogoModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  currentView,
  onNavigate,
  onGoBack,
  currentUser,
  onRoleChange,
  onOpenAuth,
  onLogout,
  selectedCity = '',
  onSelectCity,
  savedCount = 0,
  onOpenSavedHomes,
  isDark,
  onToggleTheme,
  onOpenAIMatcher,
  onOpenInteractiveMap,
  onOpenLogoModal,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [citiesDropdownOpen, setCitiesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Safe navigation helper
  const navigateTo = (viewName: string) => {
    if (onNavigate) {
      onNavigate(viewName);
    } else if (setActivePage) {
      if (viewName === 'home') setActivePage('home');
      else if (viewName === 'explore') setActivePage('explore');
      else if (viewName === 'wishlist') setActivePage('customer-dashboard');
      else if (viewName === 'dashboard') {
        if (!currentUser) {
          onOpenAuth?.('customer', 'login');
          return;
        }
        if (currentUser?.role === 'owner') setActivePage('owner-dashboard');
        else if (currentUser?.role === 'admin') setActivePage('admin-dashboard');
        else setActivePage('customer-dashboard');
      }
    }
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    onRoleChange(newRole);
    setRoleDropdownOpen(false);
    if (setActivePage) {
      if (newRole === 'customer') setActivePage('customer-dashboard');
      else if (newRole === 'owner') setActivePage('owner-dashboard');
      else if (newRole === 'admin') setActivePage('admin-dashboard');
    }
  };

  const cities = ['All Cities', 'Pune', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Gurgaon', 'Delhi'];

  const handleCitySelect = (city: string) => {
    if (onSelectCity) {
      onSelectCity(city === 'All Cities' ? '' : city);
    }
    setCitiesDropdownOpen(false);
    navigateTo('explore');
  };

  const handleBackClick = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigateTo('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left Brand Logo & Permanent Back Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Permanent Up-Left Back Option */}
            <button
              id="nav-permanent-back-btn"
              onClick={handleBackClick}
              title="Go back to previous page"
              aria-label="Go Back"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200/90 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs tracking-tight">Back</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Maximizable Logo Image */}
              <button
                id="nav-brand-logo-img-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenLogoModal) {
                    onOpenLogoModal();
                  } else {
                    navigateTo('home');
                  }
                }}
                title="Click to maximize Blooming Buds logo image"
                aria-label="Maximize logo image"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 hover:ring-emerald-500 bg-white shadow-md shadow-emerald-500/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shrink-0 cursor-pointer group relative focus:outline-hidden"
              >
                <img
                  src={SOCIETY_LOGO_URL}
                  alt="Blooming Buds Housing Society"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </button>

              {/* Brand Text linking to Home */}
              <button
                id="nav-brand-text-btn"
                type="button"
                onClick={() => navigateTo('home')}
                className="text-left group cursor-pointer focus:outline-hidden"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Blooming Buds
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hidden xs:inline-block">
                    Society
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 hidden md:block">
                  Verified PGs, Co-Living & Apartments
                </p>
              </button>
            </div>

            {/* City Selector Pill */}
            <div className="relative hidden md:block">
              <button
                id="nav-city-dropdown-btn"
                onClick={() => setCitiesDropdownOpen(!citiesDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 transition-all border border-slate-200/60 dark:border-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate max-w-[90px]">{selectedCity || 'All Cities'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {citiesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Metro City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between ${
                        (selectedCity === city || (!selectedCity && city === 'All Cities'))
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{city}</span>
                      {(selectedCity === city || (!selectedCity && city === 'All Cities')) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold">
            <button
              id="nav-link-home"
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-xl text-xs transition-all ${
                (activePage === 'home' || currentView === 'home')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              id="nav-link-explore"
              onClick={() => navigateTo('explore')}
              className={`px-3 py-2 rounded-xl text-xs transition-all ${
                (activePage === 'explore' || currentView === 'explore')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Explore Stays
            </button>

            {onOpenAIMatcher && (
              <button
                id="nav-ai-matcher-btn"
                onClick={onOpenAIMatcher}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 border border-purple-200/60 dark:border-purple-800/50 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                AI Matcher
              </button>
            )}

            {onOpenInteractiveMap && (
              <button
                id="nav-map-btn"
                onClick={onOpenInteractiveMap}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 border border-teal-200/60 dark:border-teal-800/50 flex items-center gap-1.5 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Map View
              </button>
            )}
          </nav>

          {/* Right Action Icons & User Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={() => {
                if (onOpenSavedHomes) {
                  onOpenSavedHomes();
                } else {
                  navigateTo('wishlist');
                }
              }}
              className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                currentView === 'wishlist'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Saved Homes & Wishlist"
            >
              <Heart className={`w-4.5 h-4.5 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {savedCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              ) : (
                <span className="sr-only">0 saved</span>
              )}
            </button>

            {/* Dark / Light Toggle (Optional helper) */}
            {onToggleTheme && (
              <button
                id="nav-theme-toggle"
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
              </button>
            )}

            {/* User Profile & Role Switcher OR Login / Signup */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="nav-user-menu"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[90px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                      {currentUser.role === 'customer' ? 'Resident' : currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                        {currentUser.role === 'customer' ? 'Resident' : currentUser.role} MODE
                      </span>
                    </div>

                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role
                    </div>

                    <button
                      id="role-customer-btn"
                      onClick={() => handleRoleSwitch('customer')}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between ${
                        currentUser.role === 'customer'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>Resident / Customer</span>
                      {currentUser.role === 'customer' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      id="role-owner-btn"
                      onClick={() => handleRoleSwitch('owner')}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between ${
                        currentUser.role === 'owner'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Property Owner</span>
                        {currentUser.email.toLowerCase() !== 'pritambhanase05@gmail.com' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-normal">
                            Owner Only
                          </span>
                        )}
                      </span>
                      {currentUser.role === 'owner' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : currentUser.email.toLowerCase() !== 'pritambhanase05@gmail.com' ? (
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                      ) : null}
                    </button>

                    <button
                      id="role-admin-btn"
                      onClick={() => handleRoleSwitch('admin')}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between ${
                        currentUser.role === 'admin'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Society Administrator</span>
                        {currentUser.email.toLowerCase() !== 'pritambhanase05@gmail.com' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-normal">
                            Owner Only
                          </span>
                        )}
                      </span>
                      {currentUser.role === 'admin' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : currentUser.email.toLowerCase() !== 'pritambhanase05@gmail.com' ? (
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                      ) : null}
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2 px-2 space-y-1">
                      <button
                        id="nav-go-dashboard-btn"
                        onClick={() => {
                          navigateTo('dashboard');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        Open My Dashboard
                      </button>

                      {onLogout && (
                        <button
                          id="nav-logout-btn"
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Non-authenticated User: Show Sign In and Sign Up buttons */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="nav-signin-btn"
                  onClick={() => onOpenAuth?.('customer', 'login')}
                  className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>

                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth?.('customer', 'signup')}
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-900"
          >
            Home
          </button>
          
          <button
            onClick={() => {
              navigateTo('explore');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-900"
          >
            Explore All Properties
          </button>
          
          {onOpenAIMatcher && (
            <button
              onClick={() => {
                onOpenAIMatcher();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-purple-700 bg-purple-50 dark:bg-purple-950/40"
            >
              AI Property Matcher
            </button>
          )}

          {onOpenInteractiveMap && (
            <button
              onClick={() => {
                onOpenInteractiveMap();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-teal-700 bg-teal-50 dark:bg-teal-950/40"
            >
              Interactive Map View
            </button>
          )}

          {currentUser ? (
            <>
              <button
                onClick={() => {
                  navigateTo('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
              >
                My Dashboard ({currentUser.role})
              </button>

              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/40"
                >
                  Sign Out
                </button>
              )}
            </>
          ) : (
            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onOpenAuth?.('customer', 'login');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 text-center font-bold text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  onOpenAuth?.('customer', 'signup');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 text-center font-bold text-xs rounded-xl bg-emerald-600 text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
