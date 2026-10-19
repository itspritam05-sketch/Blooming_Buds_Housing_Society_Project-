import React, { useState } from 'react';
import { 
  Building, 
  Plus, 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  Edit3, 
  Eye, 
  Sparkles, 
  Image as ImageIcon, 
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { Property, User, UserRole } from '../types';
import { ALL_AMENITIES } from '../data/amenities';
import { api } from '../services/api';

interface OwnerDashboardProps {
  currentUser: User | null;
  properties: Property[];
  onAddNewProperty: (newProperty: Property) => void;
  onSelectProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onOpenAuth?: (role?: UserRole, mode?: 'login' | 'signup') => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  currentUser,
  properties,
  onAddNewProperty,
  onSelectProperty,
  onDeleteProperty,
  onOpenAuth,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const ADMIN_OWNER_EMAIL = 'pritambhanase05@gmail.com';

  const isAuthorizedOwner = currentUser && (
    currentUser.email.toLowerCase() === ADMIN_OWNER_EMAIL.toLowerCase()
  );

  if (!currentUser || !isAuthorizedOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-200 dark:border-teal-800">
            <Building className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Property Owner Portal</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Property ownership management and society listings are exclusively accessible to the verified owner: <strong className="text-teal-600 dark:text-teal-400 font-mono text-xs">{ADMIN_OWNER_EMAIL}</strong>.
          </p>
          {currentUser && currentUser.email.toLowerCase() !== ADMIN_OWNER_EMAIL.toLowerCase() && (
            <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
              Currently signed in as <span className="font-bold">{currentUser.email}</span> (Unauthorized for Owner role).
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth?.('owner', 'login')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all cursor-pointer"
            >
              Sign In as Owner ({ADMIN_OWNER_EMAIL})
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // New Property Form State
  const [title, setTitle] = useState('');
  const [societyName, setSocietyName] = useState('Blooming Buds Society Phase II');
  const [propertyType, setPropertyType] = useState<Property['propertyType']>('Co-Living');
  const [rentType, setRentType] = useState<Property['rentType']>('Cot Basis (Per Bed)');
  const [rent, setRent] = useState(12000);
  const [depositAmount, setDepositAmount] = useState(12000);
  const [maintenanceCharges, setMaintenanceCharges] = useState(0);
  const [city, setCity] = useState('Pune');
  const [area, setArea] = useState('Viman Nagar');
  const [address, setAddress] = useState('Tower B, Blooming Buds Society');
  const [pincode, setPincode] = useState('411014');
  const [bhk, setBhk] = useState('2 BHK');
  const [furnishing, setFurnishing] = useState<Property['furnishing']>('Fully Furnished');
  const [genderPreference, setGenderPreference] = useState<Property['genderPreference']>('Any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['wifi', 'ac', 'power_backup', 'ro_water', 'cctv']);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80');

  // Stats calculation
  const totalRevenue = properties.reduce((acc, p) => acc + p.rent, 0);
  const totalViews = properties.reduce((acc, p) => acc + p.reviewsCount * 18, 1420);

  const handleToggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId) ? prev.filter(id => id !== amenityId) : [...prev, amenityId]
    );
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !area || !rent) return;

    try {
      const propertyData: Partial<Property> = {
        title,
        societyName,
        propertyType,
        rentType,
        rent: Number(rent),
        depositAmount: Number(depositAmount),
        maintenanceCharges: Number(maintenanceCharges),
        electricityCharges: 'Included up to 100 units',
        city,
        area,
        address,
        pincode,
        bhk,
        furnishing,
        genderPreference,
        availableFrom: 'Immediate Move-in',
        images: [
          imageUrl,
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        amenities: selectedAmenities,
        description: description || `Premium ${propertyType} in ${societyName}, ${area}, ${city}. Includes modern amenities, high-speed WiFi, and 24/7 security.`,
        rules: ['Gate closes at 11:30 PM for visitors', 'Cleanliness in common areas', 'No loud music after 10 PM'],
        nearbyLandmarks: {
          colleges: ['Symbiosis Institute (1.2 km)', 'MIT World Peace (4.5 km)'],
          companies: ['EON Free Zone (2 km)', 'Wipro Hinjewadi (5 km)'],
          metro: 'Metro Station (800m)',
          busStand: 'Society Bus Stop (100m)',
          railwayStation: 'Central Railway Station (6.5 km)'
        },
        owner: {
          id: currentUser.id || 'own-1',
          name: currentUser.name,
          phone: currentUser.phone || '+91 98220 12345',
          email: currentUser.email,
          avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          isVerified: true,
          rating: 4.9,
          responseTime: 'within 10 mins',
          joinedYear: 2023
        }
      };

      const res = await api.createProperty(propertyData);
      onAddNewProperty(res.property);
      setShowAddModal(false);
      alert('Listing created successfully! It is now live on the Blooming Buds platform.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black">{currentUser.name} - Society Caretaker Portal</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
              VERIFIED PARTNER
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Manage your society inventory, track tenant occupancy, and list new residential rooms.
          </p>
        </div>

        <button
          id="add-new-listing-btn"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl font-extrabold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>List New Property / Unit</span>
        </button>
      </div>

      {/* Overview Analytics Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Units</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{properties.length}</span>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">100% Verified Listings</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Monthly Inflow</span>
            <IndianRupee className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">₹{totalRevenue.toLocaleString()}</span>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Estimated Full Occupancy</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Profile Views</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{totalViews.toLocaleString()}</span>
          <p className="text-[10px] text-blue-600 font-semibold mt-1">+24% this month</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Inquiries / Visits</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">18</span>
          <p className="text-[10px] text-purple-600 font-semibold mt-1">Direct Leads</p>
        </div>
      </div>

      {/* Property Inventory List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Active Society Accommodations ({properties.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-3">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-extrabold bg-black/60 backdrop-blur-md text-white">
                    {p.propertyType}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-600 text-white">
                    {p.rentType}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{p.title}</h4>
                <p className="text-xs text-slate-500">{p.area}, {p.city}</p>

                <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      ₹{p.rent.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium"> / mo</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">★ {p.rating} ({p.reviewsCount} reviews)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectProperty(p)}
                  className="py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => onDeleteProperty(p.id)}
                  className="py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD NEW PROPERTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Add New Accommodation / Room Listing
                </h3>
                <p className="text-xs text-slate-400">Zero brokerage society direct onboarding</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="py-6 space-y-5">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Luxury Executive Co-Living Suite near IT Park"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Society Wing / Name</label>
                  <input
                    type="text"
                    required
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Types & Rent Basis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Co-Living">Co-Living Space</option>
                    <option value="PG">PG / Hostel</option>
                    <option value="Flat">1BHK / 2BHK Flat</option>
                    <option value="Apartment">Apartment</option>
                    <option value="One-Day Stay">One-Day Stay</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Rent Basis</label>
                  <select
                    value={rentType}
                    onChange={(e) => setRentType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Flat Basis (Full Unit)">Flat Basis (Full Unit)</option>
                    <option value="Cot Basis (Per Bed)">Cot Basis (Per Bed)</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Daily Transit Basis">Daily Transit Basis</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    required
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* City & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Area / Locality</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Hinjewadi Phase 1"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Layout BHK</label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="1 RK">1 RK</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="Single Bed (Shared)">Single Bed (Shared)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Primary Image URL (Cloudinary / Unsplash)</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Amenities Selector */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-2">Select Amenities & Services</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_AMENITIES.map((am) => (
                    <button
                      key={am.id}
                      type="button"
                      onClick={() => handleToggleAmenity(am.id)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-left border transition-all ${
                        selectedAmenities.includes(am.id)
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-600'
                      }`}
                    >
                      {selectedAmenities.includes(am.id) ? '✓ ' : '+ '} {am.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                >
                  Publish Listing to Society
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
