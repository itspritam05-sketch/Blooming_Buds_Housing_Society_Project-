import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  MapPin, 
  Star, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Layers, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  Car, 
  Wifi, 
  Wind, 
  Coffee, 
  Utensils, 
  Tv, 
  Bath, 
  Bed, 
  DoorClosed, 
  Compass, 
  Navigation, 
  Train, 
  Bus, 
  Plane, 
  GraduationCap, 
  Briefcase,
  AlertCircle,
  ThumbsUp,
  Send,
  Eye,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Property, Review } from '../types';
import { ALL_AMENITIES } from '../data/amenities';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare?: (p: Property) => void;
  isCompared?: boolean;
  onBookNow: (p: Property) => void;
  onScheduleVisit: (p: Property) => void;
  onOpenOwnerChat: (p: Property) => void;
  reviews: Review[];
  onAddReview: (reviewData: Partial<Review>) => void;
  onLikeReview: (reviewId: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  isSaved,
  onToggleSave,
  onBookNow,
  onScheduleVisit,
  onOpenOwnerChat,
  reviews,
  onAddReview,
  onLikeReview,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVirtualTour, setIsVirtualTour] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName || !newReviewComment) return;

    onAddReview({
      propertyId: property.id,
      userName: newReviewerName,
      rating: newRating,
      comment: newReviewComment,
      userRole: 'Verified Resident',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setNewReviewerName('');
      setNewReviewComment('');
    }, 1500);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Property link copied to clipboard!');
  };

  const getAmenityDetails = (amenityId: string) => {
    return ALL_AMENITIES.find(a => a.id === amenityId) || {
      id: amenityId,
      name: amenityId.replace('_', ' '),
      iconName: 'Sparkles',
      category: 'General'
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
        
        {/* Sticky Close & Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            {/* Modal Top-Left Back Button */}
            <button
              id="details-modal-back-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Back to Listings"
              aria-label="Back to Listings"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
              {property.propertyType}
            </span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-white truncate">
              {property.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border-rose-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Share link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Gallery / 360 View Section */}
          <div>
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-slate-900 shadow-lg">
              {isVirtualTour ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white p-6">
                  <img
                    src={property.virtualTourUrl || property.images[0]}
                    alt="Virtual 360 Tour"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-75 scale-110 animate-pulse"
                  />
                  <div className="relative z-10 text-center max-w-md bg-black/70 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h4 className="text-lg font-bold">Blooming Buds 360° Walkthrough</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Explore interactive panoramic views of the living hall, bedrooms, private balcony, and society clubhouse.
                    </p>
                    <button
                      onClick={() => setIsVirtualTour(false)}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
                    >
                      Exit 360° Mode
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={property.images[activeImageIndex] || property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              )}

              {/* Toggle Virtual Tour Button */}
              <button
                onClick={() => setIsVirtualTour(!isVirtualTour)}
                className="absolute top-4 right-4 px-3.5 py-2 rounded-xl text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isVirtualTour ? 'Standard Photos' : '360° Virtual Tour'}</span>
              </button>

              {/* Prev / Next Image */}
              {!isVirtualTour && property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % property.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImageIndex(i);
                    setIsVirtualTour(false);
                  }}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === i && !isVirtualTour
                      ? 'border-emerald-600 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Grid: Left Details & Right Booking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Full Property Specs */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  <Building className="w-4 h-4" />
                  <span>{property.societyName}</span>
                  <span>•</span>
                  <span>{property.city}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {property.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{property.address}, {property.pincode}</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{property.rating}</span>
                    <span className="text-slate-400 font-normal">({property.reviewsCount} verified reviews)</span>
                  </div>
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
                <div className="p-3 text-left">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Layout</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{property.bhk}</p>
                </div>

                <div className="p-3 text-left">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Furnishing</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{property.furnishing}</p>
                </div>

                <div className="p-3 text-left">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Rent Basis</p>
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{property.rentType}</p>
                </div>

                <div className="p-3 text-left">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Floor & Balcony</p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Floor {property.floorNumber}/{property.totalFloors} {property.balcony ? `• ${property.balconyCount} Balcony` : ''}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  About this Residence
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Society Amenities & Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenityKey) => {
                    const item = getAmenityDetails(amenityKey);
                    return (
                      <div
                        key={amenityKey}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nearby Landmarks & Transit Distances */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-600" />
                  <span>Nearby Landmarks & Commute</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Colleges & Universities */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <GraduationCap className="w-4 h-4" />
                      Colleges & Institutes
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {property.nearbyLandmarks.colleges.map((c, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* IT Companies */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Briefcase className="w-4 h-4" />
                      IT Parks & Corporates
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {property.nearbyLandmarks.companies.map((co, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          <span>{co}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Transit Hubs */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 sm:col-span-2">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Train className="w-4 h-4" />
                      Public Transit Access
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700 dark:text-slate-300">
                      {property.nearbyLandmarks.metro && (
                        <div>
                          <p className="text-[10px] text-slate-400">Metro</p>
                          <p className="font-semibold">{property.nearbyLandmarks.metro}</p>
                        </div>
                      )}
                      {property.nearbyLandmarks.busStand && (
                        <div>
                          <p className="text-[10px] text-slate-400">Bus Stand</p>
                          <p className="font-semibold">{property.nearbyLandmarks.busStand}</p>
                        </div>
                      )}
                      {property.nearbyLandmarks.railwayStation && (
                        <div>
                          <p className="text-[10px] text-slate-400">Railway</p>
                          <p className="font-semibold">{property.nearbyLandmarks.railwayStation}</p>
                        </div>
                      )}
                      {property.nearbyLandmarks.airport && (
                        <div>
                          <p className="text-[10px] text-slate-400">Airport</p>
                          <p className="font-semibold">{property.nearbyLandmarks.airport}</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Society Rules & Terms */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Blooming Buds Society Guidelines
                </h4>
                <ul className="space-y-1 text-xs text-amber-900/80 dark:text-amber-200/80">
                  {property.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reviews Section */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Resident Reviews & Ratings</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        ★ {property.rating}
                      </span>
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
                  >
                    Write a Review
                  </button>
                </div>

                {/* New Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Share Your Stay Experience
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewerName}
                          onChange={(e) => setNewReviewerName(e.target.value)}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Overall Rating</label>
                        <select
                          value={newRating}
                          onChange={(e) => setNewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ 5 - Exceptional</option>
                          <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
                          <option value={3}>⭐⭐⭐ 3 - Average</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Your Review</label>
                      <textarea
                        required
                        rows={3}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Describe the society environment, cleanliness, food, WiFi speed, and caretaker support..."
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    {reviewSubmitted ? (
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center">
                        ✓ Review posted successfully! Thank you.
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                      >
                        Submit Verified Review
                      </button>
                    )}
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.userAvatar}
                              alt={rev.userName}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {rev.userName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {rev.userRole} • {rev.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.comment}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Resident Stay
                          </span>

                          <button
                            onClick={() => onLikeReview(rev.id)}
                            className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({rev.likes})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Be the first resident to review this property!</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Pricing & Owner / Booking Action Card */}
            <div className="space-y-6">
              
              {/* Sticky Booking Widget */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-5">
                
                {/* Price Display */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {property.rentType}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      ₹{property.rent.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {property.propertyType === 'One-Day Stay' ? '/ night' : '/ month'}
                    </span>
                  </div>
                </div>

                {/* Pricing Terms Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Security Deposit</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {property.depositAmount === 0 ? 'Zero Deposit' : `₹${property.depositAmount.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Maintenance</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {property.maintenanceCharges === 0 ? 'Included' : `₹${property.maintenanceCharges.toLocaleString()}/mo`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Electricity</span>
                    <span className="font-bold text-slate-900 dark:text-white">{property.electricityCharges}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Brokerage Fee</span>
                    <span className="font-bold text-emerald-600">₹0 (Zero Brokerage)</span>
                  </div>
                </div>

                {/* Primary CTA: Instant Booking */}
                <button
                  id="modal-instant-book-btn"
                  onClick={() => onBookNow(property)}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Reserve & Book Online</span>
                </button>

                {/* Secondary CTA: Schedule Visit */}
                <button
                  id="modal-schedule-visit-btn"
                  onClick={() => onScheduleVisit(property)}
                  className="w-full py-3 rounded-2xl font-bold text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Schedule Free Physical Visit</span>
                </button>

                {/* Guarantee Note */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>100% Refund guarantee on deposit within 48 hrs of move-out.</span>
                </div>

              </div>

              {/* Owner / Society Caretaker Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={property.owner.avatar}
                    alt={property.owner.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {property.owner.name}
                      </h4>
                      {property.owner.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Owner" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Property Owner / Society Caretaker
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold">
                      ⚡ Responds in {property.owner.responseTime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <a
                    href={`tel:${property.owner.phone}`}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Call Owner</span>
                  </a>

                  <button
                    onClick={() => onOpenOwnerChat(property)}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat Live</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
