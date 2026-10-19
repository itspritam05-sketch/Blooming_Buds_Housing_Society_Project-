import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  ArrowLeft,
  MapPin, 
  Star, 
  IndianRupee, 
  Navigation, 
  Building, 
  ExternalLink, 
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck,
  LocateFixed,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Phone,
  Bed,
  Home,
  Clock,
  Car,
  Utensils,
  Wifi,
  Search,
  Maximize2
} from 'lucide-react';
import { Property, PropertyType } from '../types';
import { fetchCurrentGPSLocation, UserLocationResult, calculateDistanceKm } from '../services/locationService';

interface InteractiveMapModalProps {
  properties: Property[];
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  selectedCity?: string;
  initialUserLocation?: UserLocationResult | null;
  onUserLocationDetected?: (loc: UserLocationResult) => void;
}

// Coordinate presets for society hubs
const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'All': { lat: 18.6000, lng: 73.7800, zoom: 11 },
  'Pune': { lat: 18.5300, lng: 73.8500, zoom: 12 },
  'Talegaon Dabhade': { lat: 18.7340, lng: 73.6842, zoom: 14 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946, zoom: 12 },
  'Mumbai': { lat: 19.0760, lng: 72.8777, zoom: 12 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, zoom: 12 },
  'Gurgaon': { lat: 28.4595, lng: 77.0266, zoom: 12 },
  'Delhi': { lat: 28.7041, lng: 77.1025, zoom: 12 },
  'Noida': { lat: 28.5355, lng: 77.3910, zoom: 12 },
};

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  properties,
  onClose,
  onSelectProperty,
  selectedCity = 'All',
  initialUserLocation,
  onUserLocationDetected,
}) => {
  const [activeCity, setActiveCity] = useState(
    selectedCity && CITY_CENTERS[selectedCity] ? selectedCity : 'All'
  );
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'transit'>('streets');
  const [activeType, setActiveType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Map View State
  const initialCenter = initialUserLocation 
    ? { lat: initialUserLocation.latitude, lng: initialUserLocation.longitude, zoom: 14 }
    : (CITY_CENTERS[activeCity] || CITY_CENTERS['All']);
  const [centerLat, setCenterLat] = useState(initialCenter.lat);
  const [centerLng, setCenterLng] = useState(initialCenter.lng);
  const [zoom, setZoom] = useState(initialCenter.zoom);

  // Active Selected Property
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  
  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocationResult | null>(initialUserLocation || null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Dragging state for map canvas
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; lat: number; lng: number }>({ x: 0, y: 0, lat: 0, lng: 0 });

  // Update center when city pill is clicked
  useEffect(() => {
    if (CITY_CENTERS[activeCity]) {
      setCenterLat(CITY_CENTERS[activeCity].lat);
      setCenterLng(CITY_CENTERS[activeCity].lng);
      setZoom(CITY_CENTERS[activeCity].zoom);
    }
  }, [activeCity]);

  // Set initial active property
  useEffect(() => {
    const firstMatching = properties.find(p => 
      activeCity === 'All' || 
      p.city.toLowerCase().includes(activeCity.toLowerCase()) || 
      p.area.toLowerCase().includes(activeCity.toLowerCase())
    );
    setActiveProperty(firstMatching || properties[0] || null);
  }, [activeCity, properties]);

  // Filter properties based on city, type, and search query
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // City check
      if (activeCity !== 'All') {
        if (activeCity === 'Talegaon Dabhade') {
          if (!p.area.toLowerCase().includes('talegaon')) return false;
        } else if (!p.city.toLowerCase().includes(activeCity.toLowerCase()) && !p.area.toLowerCase().includes(activeCity.toLowerCase())) {
          return false;
        }
      }

      // Property Type check
      if (activeType !== 'All') {
        if (activeType === 'PG' && p.propertyType !== 'PG' && p.propertyType !== 'Hostel') return false;
        if (activeType === 'Flat' && p.propertyType !== 'Flat' && p.propertyType !== 'Apartment') return false;
        if (activeType === 'Co-Living' && p.propertyType !== 'Co-Living') return false;
        if (activeType === '1-Day' && p.propertyType !== 'One-Day Stay') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = 
          p.title.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.societyName.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [properties, activeCity, activeType, searchQuery]);

  // Handle Locate Me
  const handleLocateMe = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const loc = await fetchCurrentGPSLocation();
      setUserLocation(loc);
      onUserLocationDetected?.(loc);
      setCenterLat(loc.latitude);
      setCenterLng(loc.longitude);
      setZoom(14);

      // Find nearest society home
      let nearestProp = properties[0];
      let shortestDistance = 999999;
      properties.forEach(p => {
        const d = calculateDistanceKm(loc.latitude, loc.longitude, p.lat, p.lng);
        if (d < shortestDistance) {
          shortestDistance = d;
          nearestProp = p;
        }
      });
      if (nearestProp) {
        setActiveProperty(nearestProp);
      }
    } catch (err: any) {
      console.warn('GPS Locate Me error:', err);
      setLocationError(err.message || 'Unable to fetch current location. Please allow location permissions in your browser.');
    } finally {
      setIsLocating(false);
    }
  };

  // Convert (lat, lng) to canvas percentage coordinates (x%, y%) based on center and zoom
  const projectCoordinates = (lat: number, lng: number) => {
    const latDiff = lat - centerLat;
    const lngDiff = lng - centerLng;

    // Scale factors tuned to current zoom level
    const scale = Math.pow(2, zoom - 12) * 110;
    const x = 50 + lngDiff * scale * 1.05;
    const y = 50 - latDiff * scale * 1.35;

    return { x, y };
  };

  // Mouse / Touch Drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      lat: centerLat,
      lng: centerLng,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const factor = 1 / (Math.pow(2, zoom - 12) * 220);
    setCenterLng(dragStartRef.current.lng - dx * factor);
    setCenterLat(dragStartRef.current.lat + dy * factor);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Tile URL generation for background map appearance
  const getOpenStreetMapTile = () => {
    // Generate an OpenStreetMap static view or dynamic imagery
    return `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.08},${centerLat - 0.05},${centerLng + 0.08},${centerLat + 0.05}&layer=mapnik&marker=${centerLat},${centerLng}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 text-white rounded-3xl max-w-7xl w-full h-[92vh] overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        
        {/* Top Navigation & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900 border-b border-slate-800 gap-3 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top-Left Back Button */}
            <button
              id="map-modal-back-btn"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 text-slate-200 hover:text-emerald-400 border border-slate-700 hover:border-emerald-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 hidden xs:flex">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Blooming Buds Interactive Society Map
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live GPS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore {filteredProperties.length} verified stays with real-time transit and landmark access
              </p>
            </div>
          </div>

          {/* Quick Actions: Locate Me & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search area (e.g. Talegaon, Hinjewadi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 w-44 sm:w-60"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Locate Me GPS Button */}
            <button
              id="map-locate-me-btn"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              title="Locate my position on live map"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LocateFixed className="w-3.5 h-3.5" />
              )}
              <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* City Filter Strip */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/80 gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Hubs:
            </span>
            {['All', 'Talegaon Dabhade', 'Pune', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Gurgaon', 'Delhi', 'Noida'].map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCity === city
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Property Type Filter Chips */}
          <div className="flex items-center gap-1.5 shrink-0">
            {['All', 'PG', 'Flat', 'Co-Living', '1-Day'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                  activeType === type
                    ? 'bg-white text-slate-900 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Main Map View Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Map Surface */}
          <div 
            ref={mapContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex-1 relative bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing"
          >
            {/* Live OpenStreetMap Interactive Backdrop Frame */}
            <div className="absolute inset-0 pointer-events-none opacity-85">
              <iframe
                title="Live Society OpenStreetMap"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - (0.12 * Math.pow(0.5, zoom - 12))},${centerLat - (0.07 * Math.pow(0.5, zoom - 12))},${centerLng + (0.12 * Math.pow(0.5, zoom - 12))},${centerLat + (0.07 * Math.pow(0.5, zoom - 12))}&layer=mapnik`}
                className="w-full h-full border-0 filter brightness-[0.88] contrast-[1.08] saturate-[1.1]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
            </div>

            {/* Visual Road & Grid Overlay for Crisp Pin Anchoring */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

            {/* Map Controls Floating Overlay (Zoom, Center, Styles) */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
              <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-1 shadow-xl flex flex-col gap-1">
                <button
                  onClick={() => setZoom(z => Math.min(z + 1, 17))}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="h-px bg-slate-800" />
                <button
                  onClick={() => setZoom(z => Math.max(z - 1, 8))}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="h-px bg-slate-800" />
                <button
                  onClick={() => {
                    const center = CITY_CENTERS[activeCity] || CITY_CENTERS['All'];
                    setCenterLat(center.lat);
                    setCenterLng(center.lng);
                    setZoom(center.zoom);
                  }}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Coordinates & Zoom HUD */}
            <div className="absolute bottom-4 left-4 z-30 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[10px] text-slate-300 font-mono flex items-center gap-3 shadow-lg pointer-events-none">
              <span>Center: {centerLat.toFixed(4)}°N, {centerLng.toFixed(4)}°E</span>
              <span>•</span>
              <span>Zoom: {zoom}x</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{activeCity}</span>
            </div>

            {/* User Live GPS Marker if located */}
            {userLocation && (() => {
              const userPos = projectCoordinates(userLocation.latitude, userLocation.longitude);
              if (userPos.x < -20 || userPos.x > 120 || userPos.y < -20 || userPos.y > 120) return null;
              return (
                <div
                  style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto group"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping" />
                    <span className="absolute w-5 h-5 rounded-full bg-blue-400/60 animate-pulse" />
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-blue-600 text-white text-[9px] font-bold whitespace-nowrap shadow-lg">
                    You Are Here ({userLocation.area || userLocation.city})
                  </div>
                </div>
              );
            })()}

            {/* Property Pins Projected on Map */}
            {filteredProperties.map((p) => {
              const pos = projectCoordinates(p.lat, p.lng);
              const isSelected = activeProperty?.id === p.id;
              
              // Keep pin visible even if slightly outside bounds by clamping or showing in viewport
              const clampedX = Math.max(5, Math.min(95, pos.x));
              const clampedY = Math.max(8, Math.min(92, pos.y));

              return (
                <div
                  key={p.id}
                  style={{ left: `${clampedX}%`, top: `${clampedY}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProperty(p);
                    setCenterLat(p.lat);
                    setCenterLng(p.lng);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${
                    isSelected ? 'z-40 scale-110' : 'z-20 hover:scale-110 hover:z-30'
                  }`}
                >
                  {/* Pin Shape */}
                  <div className="flex flex-col items-center group">
                    
                    {/* Price & Title Pill */}
                    <div className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-xl flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-500/30'
                        : 'bg-slate-900 text-white border-slate-700 hover:border-emerald-400'
                    }`}>
                      {p.propertyType === 'PG' && <Bed className="w-3 h-3 text-emerald-400" />}
                      {p.propertyType === 'Flat' && <Home className="w-3 h-3 text-emerald-400" />}
                      {p.propertyType === 'Co-Living' && <Building className="w-3 h-3 text-emerald-400" />}
                      {p.propertyType === 'One-Day Stay' && <Clock className="w-3 h-3 text-emerald-400" />}
                      <span>₹{p.rent >= 1000 ? `${(p.rent / 1000).toFixed(p.rent % 1000 === 0 ? 0 : 1)}k` : p.rent}</span>
                      <span className="text-[9px] opacity-75 font-normal">
                        {p.rentType === 'Cot Basis' ? 'cot' : p.rentType === 'Room Basis' ? 'day' : 'flat'}
                      </span>
                    </div>

                    {/* Pin Needle */}
                    <div className={`w-2 h-2 rotate-45 -mt-1 border-r border-b ${
                      isSelected ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-900 border-slate-700'
                    }`} />

                    {/* Ground Pulse Dot */}
                    <div className={`w-2 h-2 rounded-full mt-0.5 ${
                      isSelected ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500/60'
                    }`} />

                  </div>
                </div>
              );
            })}

            {/* Active Property Card Float on Map (Bottom View) */}
            {activeProperty && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] p-4 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-3">
                <div className="flex gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={activeProperty.images[0]}
                      alt={activeProperty.title}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-500 text-slate-950">
                      {activeProperty.propertyType}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                        {activeProperty.societyName}
                      </span>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{activeProperty.rating}</span>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-sm text-white truncate mt-0.5">
                      {activeProperty.title}
                    </h4>
                    
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{activeProperty.address}</span>
                    </p>

                    {/* Distance from GPS User if available */}
                    {userLocation && (
                      <div className="mt-1 text-[10px] text-blue-300 font-semibold flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        <span>
                          {calculateDistanceKm(userLocation.latitude, userLocation.longitude, activeProperty.lat, activeProperty.lng)} km away from you
                        </span>
                      </div>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-white">
                          ₹{activeProperty.rent.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal"> / {activeProperty.rentType}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Google Maps Directions Link */}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${activeProperty.lat},${activeProperty.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                          title="Open Google Maps Directions"
                        >
                          <Navigation className="w-4 h-4 text-emerald-400" />
                        </a>

                        <button
                          onClick={() => {
                            onSelectProperty(activeProperty);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md flex items-center gap-1 transition-all"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar Property Directory */}
          <div className="hidden lg:flex w-96 border-l border-slate-800 bg-slate-900 flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Society Directory ({filteredProperties.length})
                </h4>
                <p className="text-[10px] text-slate-400">Click any residence to zoom pin on map</p>
              </div>
              <span className="text-xs font-bold text-emerald-400">{activeCity}</span>
            </div>

            {/* Scrollable Property List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No properties found in this filter range.
                </div>
              ) : (
                filteredProperties.map((p) => {
                  const isSelected = activeProperty?.id === p.id;
                  const dist = userLocation 
                    ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, p.lat, p.lng)
                    : null;

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProperty(p);
                        setCenterLat(p.lat);
                        setCenterLng(p.lng);
                        setZoom(14);
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500 shadow-lg ring-1 ring-emerald-500/30'
                          : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">
                              {p.propertyType} • {p.bhk}
                            </span>
                            {dist !== null && (
                              <span className="text-[9px] font-bold text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded-md">
                                {dist} km
                              </span>
                            )}
                          </div>

                          <h5 className="font-bold text-xs text-white truncate mt-0.5">
                            {p.title}
                          </h5>

                          <p className="text-[10px] text-slate-400 truncate">
                            {p.area}, {p.city}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-black text-white">
                              ₹{p.rent.toLocaleString()}
                              <span className="text-[9px] text-slate-400 font-normal"> / {p.rentType}</span>
                            </span>

                            <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5">
                              <span>View Pin</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Quick Contact Helper */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
              <p className="text-[11px] text-slate-400">
                Need a guided society tour? Call <span className="text-emerald-400 font-bold">+91 1800 200 4545</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
