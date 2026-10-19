// Location detection and reverse geocoding utility for Blooming Buds Housing Society

export interface UserLocationResult {
  latitude: number;
  longitude: number;
  city: string;
  area: string;
  formattedAddress: string;
  state?: string;
  pincode?: string;
  nearestHubCity?: string;
  distanceToNearestHubKm?: number;
}

export class LocationServiceError extends Error {
  code?: number;
  isPermissionDenied: boolean;

  constructor(message: string, code?: number) {
    super(message);
    this.name = 'LocationServiceError';
    this.code = code;
    this.isPermissionDenied = code === 1; // 1 = GeolocationPositionError.PERMISSION_DENIED
  }
}

// Major Metro Society Hubs with representative central coordinates
export const SOCIETY_METRO_HUBS = [
  { city: 'Pune', lat: 18.5204, lng: 73.8567, areas: ['Talegaon Dabhade', 'Viman Nagar', 'Hinjewadi', 'Kothrud', 'Baner', 'Wakad', 'Kharadi', 'Hadapsar', 'Aundh', 'Shivaji Nagar', 'Talegaon MIDC', 'Somatane'] },
  { city: 'Talegaon Dabhade', lat: 18.7340, lng: 73.6842, areas: ['Station Road', 'Maratha Colony', 'Talegaon MIDC', 'Somatane Phata', 'DY Patil Campus', 'Nutan Tech Campus'] },
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946, areas: ['Indiranagar', 'Whitefield', 'Koramangala', 'HSR Layout', 'Electronic City', 'Bellandur', 'Marathahalli', 'BTM Layout'] },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, areas: ['Powai', 'Bandra West', 'Andheri East', 'Lower Parel', 'Malad', 'Thane', 'Goregaon'] },
  { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, areas: ['Hitec City', 'Gachibowli', 'Madhapur', 'Kondapur', 'Jubilee Hills', 'Banjara Hills', 'Kukatpally'] },
  { city: 'Gurgaon', lat: 28.4595, lng: 77.0266, areas: ['Cyber City', 'Golf Course Road', 'DLF Phase 2', 'DLF Phase 3', 'Sector 48', 'Sohna Road'] },
  { city: 'Delhi', lat: 28.7041, lng: 77.1025, areas: ['North Campus DU', 'Saket', 'Hauz Khas', 'Lajpat Nagar', 'Dwarka', 'South Extension'] },
  { city: 'Noida', lat: 28.5355, lng: 77.3910, areas: ['Sector 62', 'Sector 18', 'Sector 137', 'Greater Noida'] },
];

/**
 * Calculates distance in kilometers between two GPS coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the closest recognized Metro Society Hub based on coordinates
 */
export function findNearestSocietyHub(lat: number, lng: number): { hubCity: string; distanceKm: number } {
  let closestHub = SOCIETY_METRO_HUBS[0];
  let minDistance = calculateDistanceKm(lat, lng, closestHub.lat, closestHub.lng);

  for (const hub of SOCIETY_METRO_HUBS) {
    const dist = calculateDistanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestHub = hub;
    }
  }

  return {
    hubCity: closestHub.city,
    distanceKm: minDistance,
  };
}

/**
 * Checks current browser permission state for geolocation if supported
 */
export async function getBrowserLocationPermissionState(): Promise<'granted' | 'prompt' | 'denied' | 'unsupported'> {
  if (typeof navigator === 'undefined' || !navigator.permissions || !navigator.geolocation) {
    return 'unsupported';
  }
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return permissionStatus.state;
  } catch {
    return 'unsupported';
  }
}

/**
 * Internal helper to query navigator.geolocation with fallback options
 */
function getPositionPromise(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new LocationServiceError('Geolocation is not supported by your browser.', 0));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Fetches the user's current GPS location directly via the browser Geolocation API.
 * Uses a robust multi-stage acquisition (fast network/WiFi first, followed by high-accuracy GPS)
 * to ensure that browser permission prompts appear immediately without stalling or timing out.
 */
export async function fetchCurrentGPSLocation(): Promise<UserLocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new LocationServiceError('Geolocation is not supported by your browser.', 0);
  }

  let position: GeolocationPosition;

  try {
    // Attempt 1: Standard network/WiFi geolocation (fastest response, triggers browser permission popup immediately)
    position = await getPositionPromise({
      enableHighAccuracy: false,
      timeout: 7000,
      maximumAge: 0,
    });
  } catch (err: any) {
    // If permission was explicitly denied, do not retry and throw immediately
    if (err.code === 1) { // PERMISSION_DENIED
      throw new LocationServiceError(
        'Location permission was denied. Please allow location access in your browser address bar settings to use Near Me.',
        1
      );
    }

    // Attempt 2: Try high accuracy GPS in case standard failed
    try {
      position = await getPositionPromise({
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60000,
      });
    } catch (retryErr: any) {
      if (retryErr.code === 1) {
        throw new LocationServiceError(
          'Location permission was denied. Please allow location access in your browser address bar settings to use Near Me.',
          1
        );
      } else if (retryErr.code === 3) {
        throw new LocationServiceError('Location request timed out. Please try again.', 3);
      } else {
        throw new LocationServiceError(
          'Location information is unavailable from your browser or device. Please check your device location settings.',
          retryErr.code || 2
        );
      }
    }
  }

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const nearest = findNearestSocietyHub(latitude, longitude);

  let detectedCity = nearest.hubCity;
  let detectedArea = '';
  let formattedAddress = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
  let state = '';
  let pincode = '';

  try {
    // Attempt reverse geocoding via OpenStreetMap Nominatim with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};

      const osmCity =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.city_district ||
        addr.county ||
        '';

      const osmArea =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.quarter ||
        addr.road ||
        addr.village ||
        '';

      state = addr.state || '';
      pincode = addr.postcode || '';

      // Match OSM city with our recognized hubs or use the OSM detected city
      const matchedHub = SOCIETY_METRO_HUBS.find(
        (h) =>
          osmCity.toLowerCase().includes(h.city.toLowerCase()) ||
          h.city.toLowerCase().includes(osmCity.toLowerCase()) ||
          state.toLowerCase().includes(h.city.toLowerCase())
      );

      if (matchedHub) {
        detectedCity = matchedHub.city;
      } else if (osmCity) {
        detectedCity = osmCity;
      }

      detectedArea = osmArea;
      formattedAddress = data.display_name || formattedAddress;
    }
  } catch (reverseErr) {
    console.warn('Reverse geocode error or timeout, using nearest society hub fallback:', reverseErr);
    detectedCity = nearest.hubCity;
    detectedArea = '';
  }

  return {
    latitude,
    longitude,
    city: detectedCity,
    area: detectedArea || detectedCity,
    formattedAddress,
    state,
    pincode,
    nearestHubCity: nearest.hubCity,
    distanceToNearestHubKm: nearest.distanceKm,
  };
}
