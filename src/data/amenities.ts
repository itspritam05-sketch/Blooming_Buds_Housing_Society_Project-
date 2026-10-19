export interface AmenityDefinition {
  id: string;
  name: string;
  category: 'Essentials' | 'Comfort' | 'Safety' | 'Leisure';
  icon: string;
}

export const ALL_AMENITIES: AmenityDefinition[] = [
  { id: 'wifi', name: 'High-Speed WiFi', category: 'Essentials', icon: 'Wifi' },
  { id: 'ac', name: 'Air Conditioner', category: 'Comfort', icon: 'AirVent' },
  { id: 'geyser', name: 'Geyser / Hot Water', category: 'Essentials', icon: 'Flame' },
  { id: 'washing_machine', name: 'Washing Machine', category: 'Comfort', icon: 'WashingMachine' },
  { id: 'refrigerator', name: 'Refrigerator', category: 'Essentials', icon: 'Refrigerator' },
  { id: 'ro_water', name: 'RO Purified Water', category: 'Essentials', icon: 'Droplets' },
  { id: 'kitchen', name: 'Modular Kitchen', category: 'Comfort', icon: 'UtensilsCrossed' },
  { id: 'tv', name: 'Smart LED TV', category: 'Comfort', icon: 'Tv' },
  { id: 'cctv', name: '24/7 CCTV Surveillance', category: 'Safety', icon: 'Camera' },
  { id: 'security_guard', name: 'Security Guard & Intercom', category: 'Safety', icon: 'ShieldCheck' },
  { id: 'power_backup', name: '100% Power Backup', category: 'Essentials', icon: 'Zap' },
  { id: 'lift', name: 'High-Speed Lift', category: 'Comfort', icon: 'ArrowUpDown' },
  { id: 'parking', name: 'Covered Car & Bike Parking', category: 'Comfort', icon: 'Car' },
  { id: 'gym', name: 'Equipped Fitness Gym', category: 'Leisure', icon: 'Dumbbell' },
  { id: 'swimming_pool', name: 'Swimming Pool', category: 'Leisure', icon: 'Waves' },
  { id: 'garden', name: 'Landscaped Garden', category: 'Leisure', icon: 'Trees' },
  { id: 'club_house', name: 'Club House & Games', category: 'Leisure', icon: 'Trophy' },
  { id: 'study_room', name: 'Quiet Study & Co-Working Lounge', category: 'Comfort', icon: 'BookOpen' },
  { id: 'laundry', name: 'Laundry Service', category: 'Comfort', icon: 'Shirt' },
  { id: 'housekeeping', name: 'Daily Housekeeping', category: 'Comfort', icon: 'Sparkles' },
  { id: 'food_included', name: '3-Time Hygienic Meals', category: 'Essentials', icon: 'Soup' },
  { id: 'drinking_water', name: 'Continuous Water Supply', category: 'Essentials', icon: 'GlassWater' },
  { id: 'fire_safety', name: 'Fire Safety Extinguishers', category: 'Safety', icon: 'FireExtinguisher' },
  { id: 'ev_charging', name: 'EV Vehicle Charging Point', category: 'Essentials', icon: 'BatteryCharging' },
  { id: 'medical_facility', name: 'First Aid & Doctor on Call', category: 'Safety', icon: 'Cross' },
  { id: 'kids_play_area', name: "Children's Play Area", category: 'Leisure', icon: 'Baby' },
  { id: 'visitor_parking', name: 'Dedicated Visitor Parking', category: 'Comfort', icon: 'ParkingSquare' },
  { id: 'balcony', name: 'Scenic Balcony', category: 'Comfort', icon: 'Sun' },
];
