import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  Wifi,
  Wind,
  Coffee,
  Car,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Navigation
} from 'lucide-react';
import { Property } from '../types';
import { calculateDistanceKm, UserLocationResult } from '../services/locationService';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isSaved: boolean;
  onToggleSave: (propertyId: string) => void;
  onBookNow: (property: Property) => void;
  onScheduleVisit: (property: Property) => void;
  userLocation?: UserLocationResult | null;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isSaved,
  onToggleSave,
  onBookNow,
  onScheduleVisit,
  userLocation,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const distanceKm = userLocation
    ? calculateDistanceKm(userLocation.latitude, userLocation.longitude, property.lat, property.lng)
    : undefined;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const getRentTypeBadge = () => {
    if (property.rentType === 'Cot Basis') return 'bg-amber-50 text-amber-800 border-amber-200';
    if (property.rentType === 'Flat Basis') return 'bg-teal-50 text-teal-800 border-teal-200';
    if (property.rentType === 'Room Basis') return 'bg-blue-50 text-blue-800 border-blue-200';
    return 'bg-purple-50 text-purple-800 border-purple-200';
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      onClick={() => onSelect(property)}
      className="group cursor-pointer rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Top Image Section */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-60 group-hover:opacity-75 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-xs border border-white/20 shadow-xs">
            {property.propertyType}
          </span>
          {property.isFeatured && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              Featured
            </span>
          )}
          {property.isSuperHost && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3" />
              SuperHost
            </span>
          )}
        </div>

        {/* Top Right Wishlist Heart Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            id={`wishlist-toggle-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isSaved
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Carousel Controls */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {property.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom Floating Rating & Rent Basis Badge */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-xs font-bold">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{property.rating}</span>
            <span className="text-[10px] text-slate-300 font-normal">({property.reviewsCount})</span>
          </div>

          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${getRentTypeBadge()}`}>
            {property.rentType}
          </span>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Location & Society Name */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{property.area}, {property.city}</span>
            </div>
            {distanceKm !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0 shadow-2xs animate-in fade-in">
                <Navigation className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                <span>{distanceKm} km away</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1">
            {property.title}
          </h3>

          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
            {property.societyName}
          </p>

          {/* Specifications Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-700">
              {property.bhk}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
              {property.furnishing}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
              {property.genderPreference}
            </span>
            {property.balcony && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                Balcony
              </span>
            )}
          </div>

          {/* Quick Amenity Icons Preview */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-3 text-xs">
              {property.amenities.includes('wifi') && (
                <span className="flex items-center gap-1" title="WiFi Included">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] text-slate-500 font-medium">WiFi</span>
                </span>
              )}
              {property.amenities.includes('ac') && (
                <span className="flex items-center gap-1" title="Air Conditioner">
                  <Wind className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] text-slate-500 font-medium">AC</span>
                </span>
              )}
              {(property.foodIncluded || property.amenities.includes('food_included')) && (
                <span className="flex items-center gap-1" title="Meals Included">
                  <Coffee className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] text-slate-500 font-medium">Food</span>
                </span>
              )}
              {property.parking && (
                <span className="flex items-center gap-1" title="Parking">
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] text-slate-500 font-medium">Parking</span>
                </span>
              )}
            </div>

            {/* Verified Owner Micro Avatar */}
            <div className="flex items-center gap-1.5" title={`Listed by ${property.owner.name}`}>
              <img
                src={property.owner.avatar}
                alt={property.owner.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
              />
              <span className="text-[10px] font-bold text-slate-700 truncate max-w-[70px]">
                {property.owner.name.split(' ')[0]}
              </span>
            </div>
          </div>

        </div>

        {/* Pricing & CTA Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {property.rentType}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  ₹{property.rent.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {property.propertyType === 'One-Day Stay' ? '/ night' : '/ month'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-600">
                {property.depositAmount === 0 ? 'Zero Deposit' : `₹${property.depositAmount.toLocaleString()} Deposit`}
              </span>
              <p className="text-[10px] text-slate-400">
                Zero Brokerage
              </p>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`schedule-visit-btn-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onScheduleVisit(property);
              }}
              className="py-2.5 px-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Free Visit</span>
            </button>

            <button
              id={`book-now-btn-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(property);
              }}
              className="py-2.5 px-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <span>Instant Book</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
