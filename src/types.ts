export type PropertyType = 
  | 'PG' 
  | 'Hostel' 
  | 'Apartment' 
  | 'Flat' 
  | 'Independent House' 
  | 'Villa' 
  | 'One-Day Stay' 
  | 'Co-Living' 
  | 'Studio Apartment';

export type BHKType = '1 RK' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | 'Shared Rooms';

export type RentType = 'Flat Basis' | 'Cot Basis' | 'Room Basis' | 'Per Person';

export type FurnishingType = 'Fully Furnished' | 'Semi Furnished' | 'Non Furnished';

export type StayDuration = 'One Day' | 'Weekly' | 'Monthly' | 'Long Term';

export type GenderPreference = 'Any' | 'Boys' | 'Girls' | 'Family' | 'Couple' | 'Bachelors';

export type OccupancyType = 'Single' | 'Double' | 'Triple' | '4+ Sharing' | 'Entire House';

export type UserRole = 'customer' | 'owner' | 'admin';

export interface PropertyOwner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  rating: number;
  responseTime: string;
  joinedYear: number;
}

export interface NearbyLandmarks {
  colleges: string[];
  companies: string[];
  metro: string;
  busStand: string;
  railwayStation: string;
  airport?: string;
}

export interface Property {
  id: string;
  title: string;
  societyName: string;
  propertyType: PropertyType;
  bhk: BHKType;
  rent: number;
  rentType: RentType;
  depositAmount: number;
  electricityCharges: string;
  maintenanceCharges: number;
  stayDuration: StayDuration[];
  availableFrom: string;
  furnishing: FurnishingType;
  genderPreference: GenderPreference;
  occupancy: OccupancyType;
  
  city: string;
  area: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  
  roomsCount: number;
  bedsCount: number;
  bathroomsCount: number;
  balcony: boolean;
  balconyCount: number;
  floorNumber: number;
  totalFloors: number;
  
  images: string[];
  virtualTourUrl?: string;
  videoUrl?: string;
  
  description: string;
  amenities: string[];
  rules: string[];
  
  nearbyLandmarks: NearbyLandmarks;
  owner: PropertyOwner;
  
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  isSuperHost?: boolean;
  foodIncluded: boolean;
  parking: boolean;
  petsAllowed: boolean;
  viewsCount: number;
  badge?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
  likes: number;
  isVerifiedStay: boolean;
  helpfulCount: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyType: PropertyType;
  societyName: string;
  address: string;
  city: string;
  
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  stayDuration: string;
  
  rentType: RentType;
  baseRent: number;
  depositAmount: number;
  maintenanceAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet' | 'EMI';
  transactionId: string;
  bookingDate: string;
  status: 'Confirmed' | 'Pending Approval' | 'Cancelled' | 'Completed';
  invoiceNumber: string;
  specialRequests?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  savedProperties: string[];
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  city: string;
  area: string;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  bhk: string;
  furnishing: string;
  genderPreference: string;
  rentType: string;
  stayDuration: string;
  foodIncluded: boolean;
  parking: boolean;
  petsAllowed: boolean;
  wifi: boolean;
  ac: boolean;
  lift: boolean;
  balcony: boolean;
  ownerVerified: boolean;
  minRating: number;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  propertyId: string;
  propertyTitle: string;
  type: 'Maintenance' | 'Noise' | 'Billing' | 'Security' | 'Other';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
}
