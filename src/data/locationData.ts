/**
 * Pan-India Locations & Nearby Proximity Helper
 * Supports India -> State -> City -> Locality
 * Covers Mumbai, Pune, Bangalore, Hyderabad, Delhi NCR, Chennai, Kolkata, Ahmedabad, etc.
 */

export interface LocalityInfo {
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  nearby?: string[]; // Names of neighboring localities
}

export interface CityInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
  aliases: string[];
}

export const MAJOR_INDIAN_CITIES: CityInfo[] = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, aliases: ['mumbai', 'bombay'] },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, aliases: ['pune', 'poona'] },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, aliases: ['bangalore', 'bengaluru', 'blr'] },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, aliases: ['hyderabad', 'hyd'] },
  { name: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090, aliases: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'gurugram', 'noida'] },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, aliases: ['chennai', 'madras'] },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, aliases: ['kolkata', 'calcutta'] },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, aliases: ['ahmedabad', 'amdavad'] },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, aliases: ['jaipur'] },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, aliases: ['kochi', 'cochin'] }
];

export const PAN_INDIA_LOCALITIES: LocalityInfo[] = [
  // MUMBAI
  { name: 'Andheri', city: 'Mumbai', state: 'Maharashtra', lat: 19.1197, lng: 72.8468, nearby: ['Andheri West', 'Andheri East', 'Powai', 'Goregaon', 'Bandra', 'Juhu'] },
  { name: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', lat: 19.1363, lng: 72.8277, nearby: ['Andheri', 'Juhu', 'Goregaon', 'Powai', 'Bandra'] },
  { name: 'Andheri East', city: 'Mumbai', state: 'Maharashtra', lat: 19.1136, lng: 72.8697, nearby: ['Andheri', 'Powai', 'Goregaon', 'BKC'] },
  { name: 'Powai', city: 'Mumbai', state: 'Maharashtra', lat: 19.1176, lng: 72.9060, nearby: ['Andheri East', 'Vikhroli', 'Kanjurmarg', 'Thane', 'Goregaon'] },
  { name: 'Bandra', city: 'Mumbai', state: 'Maharashtra', lat: 19.0596, lng: 72.8295, nearby: ['Bandra West', 'BKC', 'Khar', 'Juhu', 'Andheri'] },
  { name: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', lat: 19.0544, lng: 72.8402, nearby: ['Bandra', 'Khar', 'Santacruz', 'Andheri West'] },
  { name: 'Thane', city: 'Mumbai', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, nearby: ['Thane West', 'Mulund', 'Ghodbunder', 'Powai'] },
  { name: 'Thane West', city: 'Mumbai', state: 'Maharashtra', lat: 19.2000, lng: 72.9667, nearby: ['Thane', 'Mulund', 'Kolshet Road', 'Powai'] },
  { name: 'Worli', city: 'Mumbai', state: 'Maharashtra', lat: 19.0178, lng: 72.8178, nearby: ['Lower Parel', 'Prabhadevi', 'Dadara', 'Bandra'] },

  // PUNE
  { name: 'Hinjewadi', city: 'Pune', state: 'Maharashtra', lat: 18.5913, lng: 73.7389, nearby: ['Wakad', 'Baner', 'Balewadi', 'Tathawade'] },
  { name: 'Kharadi', city: 'Pune', state: 'Maharashtra', lat: 18.5516, lng: 73.9349, nearby: ['Viman Nagar', 'Hadapsar', 'Wagholi', 'Kalyani Nagar'] },
  { name: 'Wakad', city: 'Pune', state: 'Maharashtra', lat: 18.5987, lng: 73.7667, nearby: ['Hinjewadi', 'Baner', 'Pimple Saudagar'] },
  { name: 'Baner', city: 'Pune', state: 'Maharashtra', lat: 18.5590, lng: 73.7868, nearby: ['Balewadi', 'Aundh', 'Hinjewadi', 'Wakad'] },

  // BANGALORE
  { name: 'Devanahalli', city: 'Bangalore', state: 'Karnataka', lat: 13.2483, lng: 77.7126, nearby: ['Bangalore Airport', 'Yelahanka', 'Hebbal', 'Bagalur'] },
  { name: 'Bangalore Airport', city: 'Bangalore', state: 'Karnataka', lat: 13.1986, lng: 77.7066, nearby: ['Devanahalli', 'Yelahanka', 'Hebbal'] },
  { name: 'Whitefield', city: 'Bangalore', state: 'Karnataka', lat: 12.9698, lng: 77.7500, nearby: ['Marathahalli', 'ITPL', 'Hoodi', 'Kadugodi'] },
  { name: 'Sarjapur', city: 'Bangalore', state: 'Karnataka', lat: 12.8590, lng: 77.7860, nearby: ['Bellandur', 'HSR Layout', 'Electronic City'] },
  { name: 'Electronic City', city: 'Bangalore', state: 'Karnataka', lat: 12.8399, lng: 77.6770, nearby: ['Bommasandra', 'Hosa Road', 'Sarjapur'] },

  // HYDERABAD
  { name: 'Shadnagar', city: 'Hyderabad', state: 'Telangana', lat: 17.0682, lng: 78.2088, nearby: ['Kothur', 'Rajapur', 'Balanagar', 'Shamshabad'] },
  { name: 'Mokila', city: 'Hyderabad', state: 'Telangana', lat: 17.4098, lng: 78.1884, nearby: ['Shankarpally', 'Tellapur', 'Gopanpally', 'Kokapet'] },
  { name: 'Tellapur', city: 'Hyderabad', state: 'Telangana', lat: 17.4728, lng: 78.2917, nearby: ['Kollur', 'Mokila', 'Nallagandla', 'Gachibowli'] },
  { name: 'Kokapet', city: 'Hyderabad', state: 'Telangana', lat: 17.3995, lng: 78.3375, nearby: ['Gandipet', 'Financial District', 'Narsingi', 'Gachibowli'] },
  { name: 'Lemoor', city: 'Hyderabad', state: 'Telangana', lat: 17.1524, lng: 78.5321, nearby: ['Maheshwaram', 'Kadthal', 'Shamshabad', 'Kandukur'] },
  { name: 'Kothur', city: 'Hyderabad', state: 'Telangana', lat: 17.1478, lng: 78.2891, nearby: ['Shadnagar', 'Shamshabad', 'Timmapur'] },
  { name: 'Gachibowli', city: 'Hyderabad', state: 'Telangana', lat: 17.4401, lng: 78.3489, nearby: ['Financial District', 'Hitec City', 'Madhapur', 'Kokapet'] },

  // DELHI NCR
  { name: 'Gurgaon', city: 'Delhi NCR', state: 'Haryana', lat: 28.4595, lng: 77.0266, nearby: ['Golf Course Road', 'Cyber City', 'Sohna Road', 'DLF Phase 5'] },
  { name: 'Golf Course Road', city: 'Delhi NCR', state: 'Haryana', lat: 28.4552, lng: 77.0984, nearby: ['Gurgaon', 'Cyber City', 'DLF Phase 5'] },
  { name: 'Noida', city: 'Delhi NCR', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, nearby: ['Sector 150', 'Greater Noida', 'Sector 62'] },
  { name: 'Sector 150', city: 'Delhi NCR', state: 'Uttar Pradesh', lat: 28.4239, lng: 77.4789, nearby: ['Noida', 'Noida Expressway', 'Greater Noida'] }
];

/**
 * Calculates geographic distance in kilometers between two lat/long points using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export interface DetectedLocationResult {
  city?: string;
  state?: string;
  locality?: string;
  isNearQuery?: boolean;
  nearTarget?: string;
}

/**
 * Detects Indian city, locality, or "near <location>" in natural user query
 */
export function detectIndianLocationInQuery(query: string): DetectedLocationResult | null {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  // 1. Check for "near <location>" patterns
  const nearMatch = q.match(/\bnear\s+([a-zA-Z\s]+?)(?:\s+(?:under|below|within|above|for|with|in|around|budget|airport|\d)|$)/i);
  let isNearQuery = false;
  let nearTarget = '';

  if (nearMatch && nearMatch[1].trim()) {
    isNearQuery = true;
    nearTarget = nearMatch[1].trim();
  }

  // 2. Check for locality match first
  for (const loc of PAN_INDIA_LOCALITIES) {
    const locLower = loc.name.toLowerCase();
    const regex = new RegExp(`\\b${locLower}\\b`, 'i');
    if (regex.test(q)) {
      return {
        city: loc.city,
        state: loc.state,
        locality: loc.name,
        isNearQuery,
        nearTarget: nearTarget || loc.name
      };
    }
  }

  // 3. Check for city match
  for (const city of MAJOR_INDIAN_CITIES) {
    for (const alias of city.aliases) {
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(q)) {
        return {
          city: city.name,
          state: city.state,
          isNearQuery,
          nearTarget: nearTarget || city.name
        };
      }
    }
  }

  // Special cases: airport
  if (q.includes('airport') && (q.includes('bangalore') || q.includes('bengaluru') || q.includes('blr'))) {
    return {
      city: 'Bangalore',
      state: 'Karnataka',
      locality: 'Devanahalli',
      isNearQuery: true,
      nearTarget: 'Bangalore Airport'
    };
  }

  return null;
}

/**
 * Finds neighboring / nearby localities for a given locality or city
 */
export function getNearbyLocalitiesList(localityName?: string, cityName?: string): string[] {
  if (localityName) {
    const found = PAN_INDIA_LOCALITIES.find(l => l.name.toLowerCase() === localityName.toLowerCase());
    if (found && found.nearby) {
      return found.nearby;
    }
  }

  if (cityName) {
    return PAN_INDIA_LOCALITIES
      .filter(l => l.city.toLowerCase() === cityName.toLowerCase())
      .map(l => l.name);
  }

  return [];
}
