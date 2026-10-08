import { PropertyItem } from '../types/chat';
import { normalizeQuery } from '../utils/intentClassifier';
import {
  detectIndianLocationInQuery,
  calculateDistanceKm,
  getNearbyLocalitiesList,
  PAN_INDIA_LOCALITIES,
  MAJOR_INDIAN_CITIES
} from './locationData';

export const OPV_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';

/**
 * Pan-India Curated Property Database
 * Includes verified listings across Mumbai, Pune, Bangalore, Hyderabad, and Delhi NCR.
 * Seller contact information is managed securely through OPV.
 */
export const INITIAL_PAN_INDIA_PROPERTIES: PropertyItem[] = [
  // --- MUMBAI ---
  {
    id: 'PROP-0001',
    propertyId: 'PROP-0001',
    title: '3 BHK Premium Apartment in Andheri West',
    location: 'Andheri West, Mumbai, Maharashtra',
    locality: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    price: '₹ 2.85 Cr',
    priceNumeric: 28500000,
    status: 'For Sale',
    badge: 'Ready to Move',
    type: 'apartment',
    config: '3 BHK',
    area: '1,450 Sq.Ft.',
    bhk: 3,
    facing: 'East Facing',
    latitude: 19.1363,
    longitude: 72.8277,
    approval: 'RERA & BMC Approved',
    reraNumber: 'P51800028491',
    sellerId: 'SELL-0001',
    sellerName: 'Raj Kumar',
    sellerType: 'Owner',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', '24/7 Security', 'High Speed Lifts', 'Modular Kitchen'],
    agent: {
      name: 'OPV Mumbai Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'M'
    },
    overview: 'Luxurious 3 BHK flat with modern amenities in prime Andheri West, close to Metro Station and Link Road.',
    about: 'Spacious 3 BHK apartment featuring marble flooring, Italian fixtures, and private balcony overlooking Mumbai skyline.',
    specifications: [
      { label: 'Configuration', value: '3 BHK Luxury' },
      { label: 'Carpet Area', value: '1,120 Sq.Ft.' },
      { label: 'Super Built-up', value: '1,450 Sq.Ft.' },
      { label: 'Floor', value: '14th of 24 Floors' },
      { label: 'Approval', value: 'RERA Registered' }
    ],
    nearby: ['Versova Beach', 'Infiniti Mall', 'DN Nagar Metro', 'Kokilaben Hospital']
  },
  {
    id: 'PROP-0002',
    propertyId: 'PROP-0002',
    title: 'Luxury Lakeview Flat in Powai',
    location: 'Powai, Mumbai, Maharashtra',
    locality: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    price: '₹ 2.40 Cr',
    priceNumeric: 24000000,
    status: 'For Sale',
    badge: 'Ready to Move',
    type: 'apartment',
    config: '2.5 BHK',
    area: '1,180 Sq.Ft.',
    bhk: 2,
    facing: 'North-East Facing',
    latitude: 19.1176,
    longitude: 72.9060,
    approval: 'RERA Approved',
    reraNumber: 'P51800031120',
    sellerId: 'SELL-0002',
    sellerName: 'Pooja Hegde',
    sellerType: 'Agent',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Lake View Balcony', 'Jogging Track', 'Tennis Court', 'Infinity Pool', 'Covered Parking'],
    agent: {
      name: 'OPV Mumbai Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'M'
    },
    overview: 'High-rise residence overlooking Powai Lake, equipped with world-class township amenities and close to IIT Bombay.',
    about: 'Serene lakeside living in the heart of Mumbai tech and business corridor.',
    specifications: [
      { label: 'Configuration', value: '2.5 BHK' },
      { label: 'Built-up Area', value: '1,180 Sq.Ft.' },
      { label: 'Facing', value: 'Powai Lake' },
      { label: 'Approval', value: 'BMC & RERA' }
    ],
    nearby: ['Hiranandani Gardens', 'IIT Bombay', 'Powai Lake', 'Galleria Mall']
  },
  {
    id: 'PROP-0003',
    propertyId: 'PROP-0003',
    title: 'Sea-Facing 4 BHK Residence in Bandra West',
    location: 'Bandra West, Mumbai, Maharashtra',
    locality: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    price: '₹ 7.50 Cr',
    priceNumeric: 75000000,
    status: 'For Sale',
    badge: 'Exclusive',
    type: 'apartment',
    config: '4 BHK',
    area: '2,600 Sq.Ft.',
    bhk: 4,
    facing: 'West Facing (Sea View)',
    latitude: 19.0544,
    longitude: 72.8402,
    approval: 'RERA Approved',
    reraNumber: 'P51800019230',
    sellerId: 'SELL-0003',
    sellerName: 'Horizon Realty Developers',
    sellerType: 'Developer',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Panoramic Sea View', 'Private Elevator', 'Spa & Jacuzzi', 'Concierge Service', 'Smart Home Automation'],
    agent: {
      name: 'OPV Luxury Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'M'
    },
    overview: 'Ultra-exclusive sea-facing apartment on Carter Road with direct Arabian Sea views.',
    about: 'Signature Mumbai luxury residence situated in prestigious Bandra West with private deck and dedicated concierge.',
    specifications: [
      { label: 'Configuration', value: '4 BHK Sea View' },
      { label: 'Area', value: '2,600 Sq.Ft.' },
      { label: 'Car Parking', value: '3 Dedicated Slots' }
    ],
    nearby: ['Carter Road Promenade', 'Bandra Bandstand', 'Pali Hill', 'Bandra-Worli Sea Link']
  },
  {
    id: 'PROP-0004',
    propertyId: 'PROP-0004',
    title: '2 BHK Modern Apartment in Thane West',
    location: 'Thane West, Mumbai, Maharashtra',
    locality: 'Thane West',
    city: 'Mumbai',
    state: 'Maharashtra',
    price: '₹ 98 Lakhs',
    priceNumeric: 9800000,
    status: 'For Sale',
    badge: 'Ready to Move',
    type: 'apartment',
    config: '2 BHK',
    area: '890 Sq.Ft.',
    bhk: 2,
    facing: 'East Facing',
    latitude: 19.2000,
    longitude: 72.9667,
    approval: 'TMC & RERA Approved',
    reraNumber: 'P51700024581',
    sellerId: 'SELL-0004',
    sellerName: 'Suresh Mehta',
    sellerType: 'Owner',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Gated Security', 'Children Play Area', 'Gym', 'Badminton Court', 'Power Backup'],
    agent: {
      name: 'OPV Mumbai Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'M'
    },
    overview: 'Value-for-money 2 BHK flat near Ghodbunder Road with seamless road and upcoming metro connectivity.',
    about: 'Affordable modern family home in well-maintained cooperative society in Thane West.',
    specifications: [
      { label: 'Configuration', value: '2 BHK' },
      { label: 'Area', value: '890 Sq.Ft.' },
      { label: 'Budget', value: 'Under 1 Crore' }
    ],
    nearby: ['Viviana Mall', 'Jupiter Hospital', 'Eastern Express Highway']
  },

  // --- PUNE ---
  {
    id: 'PROP-0005',
    propertyId: 'PROP-0005',
    title: '2 BHK Smart Apartment in Hinjewadi Phase 1',
    location: 'Hinjewadi, Pune, Maharashtra',
    locality: 'Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    price: '₹ 78 Lakhs',
    priceNumeric: 7800000,
    status: 'For Sale',
    badge: 'Ready to Move',
    type: 'apartment',
    config: '2 BHK',
    area: '920 Sq.Ft.',
    bhk: 2,
    facing: 'East Facing',
    latitude: 18.5913,
    longitude: 73.7389,
    approval: 'PMRDA & RERA Approved',
    reraNumber: 'P52100017890',
    sellerId: 'SELL-0005',
    sellerName: 'TechZone Realty Partner',
    sellerType: 'Agent',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Walking distance to IT Park', 'Clubhouse', 'Gym', 'Swimming Pool', '24/7 Security'],
    agent: {
      name: 'OPV Pune Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'P'
    },
    overview: '2 BHK modern apartment in Hinjewadi Phase 1, ideal for IT professionals with high rental yield.',
    about: 'Prime location apartment under 1 Cr, offering immediate possession and zero brokerage through OPV.',
    specifications: [
      { label: 'Configuration', value: '2 BHK' },
      { label: 'Area', value: '920 Sq.Ft.' },
      { label: 'Price Bracket', value: 'Under 1 Crore (₹ 78 Lakhs)' }
    ],
    nearby: ['Rajiv Gandhi Infotech Park', 'Wipro Circle', 'Mumbai-Pune Expressway']
  },
  {
    id: 'PROP-0006',
    propertyId: 'PROP-0006',
    title: '3 BHK Luxury Terrace Flat in Kharadi',
    location: 'Kharadi, Pune, Maharashtra',
    locality: 'Kharadi',
    city: 'Pune',
    state: 'Maharashtra',
    price: '₹ 1.45 Cr',
    priceNumeric: 14500000,
    status: 'For Sale',
    badge: 'New Launch',
    type: 'apartment',
    config: '3 BHK',
    area: '1,520 Sq.Ft.',
    bhk: 3,
    facing: 'North Facing',
    latitude: 18.5516,
    longitude: 73.9349,
    approval: 'PMC & RERA Approved',
    reraNumber: 'P52100029301',
    sellerId: 'SELL-0006',
    sellerName: 'Kharadi Premier Realty',
    sellerType: 'Developer',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Private Terrace Deck', 'Infinity Swimming Pool', 'Squash Court', 'EV Charging Station'],
    agent: {
      name: 'OPV Pune Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'P'
    },
    overview: '3 BHK luxury residence with panoramic balcony views in Kharadi EON IT Park corridor.',
    about: 'Spacious 3 bedroom home with Italian marble finish, automated curtains, and dedicated EV charging bay.',
    specifications: [
      { label: 'Configuration', value: '3 BHK Terrace' },
      { label: 'Area', value: '1,520 Sq.Ft.' }
    ],
    nearby: ['EON Free Zone IT Park', 'World Trade Center Pune', 'Phoenix Marketcity']
  },

  // --- BANGALORE ---
  {
    id: 'PROP-0007',
    propertyId: 'PROP-0007',
    title: '4 BHK Luxury Villa near Bangalore Airport',
    location: 'Devanahalli (Near Airport), Bangalore, Karnataka',
    locality: 'Devanahalli',
    city: 'Bangalore',
    state: 'Karnataka',
    price: '₹ 2.95 Cr',
    priceNumeric: 29500000,
    status: 'For Sale',
    badge: 'Ready to Move',
    type: 'villa',
    config: '4 BHK Villa',
    area: '3,400 Sq.Ft.',
    bhk: 4,
    facing: 'East Facing',
    latitude: 13.1986,
    longitude: 77.7066,
    approval: 'BIAAPA & RERA Approved',
    reraNumber: 'PRM/KA/RERA/1250/303/PR/190823/002821',
    sellerId: 'SELL-0007',
    sellerName: 'Prestige Estates Partner',
    sellerType: 'Developer',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Private Garden', 'Double Height Living Room', 'Clubhouse', 'Golf Putting Area', 'Tennis Court'],
    agent: {
      name: 'OPV Bangalore Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'B'
    },
    overview: 'Triplex 4 BHK luxury villa located just 12 minutes from Kempegowda International Airport in Devanahalli.',
    about: 'Sprawling contemporary villa in a gated sanctuary with manicured gardens and international school connectivity.',
    specifications: [
      { label: 'Configuration', value: '4 BHK Independent Villa' },
      { label: 'Plot Area', value: '2,400 Sq.Ft.' },
      { label: 'Built-up Area', value: '3,400 Sq.Ft.' },
      { label: 'Proximity', value: '12 mins to BLR Airport' }
    ],
    nearby: ['Kempegowda International Airport', 'Devanahalli Business Park', 'NH 44 Airport Highway']
  },
  {
    id: 'PROP-0008',
    propertyId: 'PROP-0008',
    title: 'Premium Villa Plot in Devanahalli',
    location: 'Devanahalli, Bangalore, Karnataka',
    locality: 'Devanahalli',
    city: 'Bangalore',
    state: 'Karnataka',
    price: '₹ 65 Lakhs',
    priceNumeric: 6500000,
    status: 'For Sale',
    badge: 'Ready to Construct',
    type: 'plot',
    config: 'Plot',
    area: '1,800 Sq.Ft.',
    facing: 'North Facing',
    latitude: 13.2483,
    longitude: 77.7126,
    approval: 'BIAAPA Approved',
    sellerId: 'SELL-0008',
    sellerName: 'Ramesh Gowda',
    sellerType: 'Owner',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Underground Cabling', 'Wide BT Roads', 'Avenue Plantation', '100% Vaastu Compliant'],
    agent: {
      name: 'OPV Bangalore Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'B'
    },
    overview: 'Ready to build residential plot in master-planned plotted layout with clear BIAAPA title.',
    about: 'High capital appreciation plotted project situated near Aerospace Park and Devanahalli SEZ.',
    specifications: [
      { label: 'Type', value: 'Residential Villa Plot' },
      { label: 'Dimensions', value: '30 x 60 (1,800 Sq.Ft.)' },
      { label: 'Approval', value: 'BIAAPA Approved' }
    ],
    nearby: ['KIADB Aerospace Park', 'Devanahalli Fort', 'Airport Toll Plaza']
  },

  // --- HYDERABAD ---
  {
    id: 'PROP-0009',
    propertyId: 'PROP-0009',
    title: 'Aarna Grand Villa Plots in Lemoor',
    location: 'Lemoor, Hyderabad, Telangana',
    locality: 'Lemoor',
    city: 'Hyderabad',
    state: 'Telangana',
    price: '₹ 45 Lakhs',
    priceNumeric: 4500000,
    status: 'For Sale',
    badge: 'Clear Title',
    type: 'plot',
    config: 'Plot',
    area: '200 Sq.Yd.',
    facing: 'East Facing',
    latitude: 17.1524,
    longitude: 78.5321,
    approval: 'HMDA & RERA Approved',
    reraNumber: 'P02400004521',
    sellerId: 'SELL-0009',
    sellerName: 'Aarna Infra Developers',
    sellerType: 'Developer',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['100% Vaastu Compliant', '40ft & 30ft BT Roads', 'Underground Drainage', 'Electricity with Transformer'],
    agent: {
      name: 'OPV Hyderabad Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'H'
    },
    overview: 'HMDA & RERA approved premium open plots in Lemoor near Pharma City & Srisailam Highway.',
    about: 'Fully developed gated layout with clear titles, instant registration, and bank loan facilities.',
    specifications: [
      { label: 'Layout Type', value: 'HMDA Approved Gated Layout' },
      { label: 'Size', value: '200 Sq. Yards' },
      { label: 'Facing', value: 'East Facing' }
    ],
    nearby: ['Pharma City', 'ORR Exit 14', 'RGIA Shamshabad Airport', 'TCS Adibatla']
  },
  {
    id: 'PROP-0010',
    propertyId: 'PROP-0010',
    title: '4 BHK Royal Villa in Mokila',
    location: 'Mokila, Hyderabad, Telangana',
    locality: 'Mokila',
    city: 'Hyderabad',
    state: 'Telangana',
    price: '₹ 3.10 Cr',
    priceNumeric: 31000000,
    status: 'For Sale',
    badge: 'Ready to Move',
    type: 'villa',
    config: '4 BHK Villa',
    area: '3,850 Sq.Ft.',
    bhk: 4,
    facing: 'North Facing',
    latitude: 17.4098,
    longitude: 78.1884,
    approval: 'HMDA Approved',
    sellerId: 'SELL-0010',
    sellerName: 'Venkata Rao',
    sellerType: 'Owner',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Grand Clubhouse', 'Private Lawn', 'Swimming Pool', '24/7 Power Backup', 'Gymnasium'],
    agent: {
      name: 'OPV Hyderabad Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'H'
    },
    overview: 'Triplex 4 BHK luxury villa in gated community at Mokila, 20 mins drive from Financial District.',
    about: 'Spacious independent home with double car parking, home theater room, and lush landscaping.',
    specifications: [
      { label: 'Configuration', value: '4 BHK Triplex' },
      { label: 'Built-up Area', value: '3,850 Sq.Ft.' },
      { label: 'Plot Size', value: '300 Sq.Yd.' }
    ],
    nearby: ['Financial District Gachibowli', 'Neopolis Kokapet', 'Indus International School']
  },
  {
    id: 'PROP-0011',
    propertyId: 'PROP-0011',
    title: 'HMDA Approved Open Plots in Shadnagar',
    location: 'Shadnagar, Hyderabad, Telangana',
    locality: 'Shadnagar',
    city: 'Hyderabad',
    state: 'Telangana',
    price: '₹ 24 Lakhs',
    priceNumeric: 2400000,
    status: 'For Sale',
    badge: 'Immediate Registration',
    type: 'plot',
    config: 'Plot',
    area: '167 Sq.Yd.',
    facing: 'East Facing',
    latitude: 17.0682,
    longitude: 78.2088,
    approval: 'HMDA Approved',
    sellerId: 'SELL-0011',
    sellerName: 'Shadnagar Green Ventures',
    sellerType: 'Developer',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Clear Title & Spot Registration', 'Park & Children Play Area', 'Water Tank & Borewell', 'Avenue Plantation'],
    agent: {
      name: 'OPV Hyderabad Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'H'
    },
    overview: 'Affordable HMDA approved residential plots near Bangalore Highway NH-44 at Shadnagar.',
    about: 'High growth corridor with fast connectivity to Rajiv Gandhi International Airport and Shamshabad.',
    specifications: [
      { label: 'Type', value: 'Residential Open Plot' },
      { label: 'Size', value: '167 Sq. Yards' },
      { label: 'Approval', value: 'HMDA LP Approved' }
    ],
    nearby: ['Bangalore Highway NH-44', 'Shadnagar Railway Station', 'Symbiosis University']
  },

  // --- DELHI NCR ---
  {
    id: 'PROP-0012',
    propertyId: 'PROP-0012',
    title: '3 BHK Golf View Apartment on Golf Course Road',
    location: 'Golf Course Road, Gurgaon, Delhi NCR',
    locality: 'Golf Course Road',
    city: 'Delhi NCR',
    state: 'Haryana',
    price: '₹ 3.40 Cr',
    priceNumeric: 34000000,
    status: 'For Sale',
    badge: 'Ready to Move',
    type: 'apartment',
    config: '3 BHK',
    area: '2,150 Sq.Ft.',
    bhk: 3,
    facing: 'North-East Facing',
    latitude: 28.4552,
    longitude: 77.0984,
    approval: 'HRERA Approved',
    reraNumber: 'RC/REP/HARERA/GGM/2019/52',
    sellerId: 'SELL-0012',
    sellerName: 'DLF Premium Associate',
    sellerType: 'Developer',
    verificationStatus: 'Verified',
    listingStatus: 'Active',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Golf Course Facing', 'Concierge Service', 'Temperature Controlled Pool', 'Modular Kitchen'],
    agent: {
      name: 'OPV Delhi NCR Desk',
      phone: '+91 9963513939',
      role: 'Listing Managed via OPV',
      avatar: 'D'
    },
    overview: 'High-end 3 BHK apartment on prominent Golf Course Road with panoramic golf greenery.',
    about: 'Prime Gurgaon luxury flat near Rapid Metro and Cyber City business hub.',
    specifications: [
      { label: 'Configuration', value: '3 BHK Ultra Luxury' },
      { label: 'Super Built-up', value: '2,150 Sq.Ft.' }
    ],
    nearby: ['One Horizon Center', 'Cyber Hub', 'Rapid Metro Station']
  }
];

let isLiveSupabaseLoaded = false;
let activeProperties: PropertyItem[] = [...INITIAL_PAN_INDIA_PROPERTIES];

export function updateActiveProperties(properties: PropertyItem[]) {
  if (properties && Array.isArray(properties) && properties.length > 0) {
    // Merge live Supabase properties with initial Pan-India listings so all regions are covered
    const existingIds = new Set(properties.map(p => p.id));
    const nonDuplicatedDefaults = INITIAL_PAN_INDIA_PROPERTIES.filter(p => !existingIds.has(p.id));
    activeProperties = [...properties, ...nonDuplicatedDefaults];
    isLiveSupabaseLoaded = true;
  }
}

/**
 * Dynamically adds a new property submitted by a Seller via Post Property flow
 */
export function addDynamicProperty(newProp: PropertyItem) {
  activeProperties.unshift(newProp);
}

export function isUsingLiveSupabase(): boolean {
  return isLiveSupabaseLoaded;
}

export function getActiveProperties(): PropertyItem[] {
  return activeProperties;
}

/**
 * Parses budget constraints like 'under 30 lakhs', 'below 50L', 'under 1 cr', 'between 20 and 40 lakhs'
 */
export function parseBudgetLimits(query: string): { minPrice?: number; maxPrice?: number } | null {
  const q = query.toLowerCase();

  const parseUnit = (numStr: string, unitStr: string): number => {
    const n = parseFloat(numStr);
    const u = (unitStr || '').toLowerCase();
    if (u.startsWith('cr')) return Math.round(n * 10000000);
    return Math.round(n * 100000);
  };

  // 1. Range: "between 20 and 40 lakhs", "20 to 50 lakhs", "20 - 40L"
  const rangeMatch = q.match(/between\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|lac|lakh|cr|crores?|crore|l)?\s*(?:and|to|-)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)/i);
  if (rangeMatch) {
    const unit = rangeMatch[3];
    return {
      minPrice: parseUnit(rangeMatch[1], unit),
      maxPrice: parseUnit(rangeMatch[2], unit)
    };
  }

  // 2. Under/Below/Within/Up to: "under 30 lakhs", "below 50L", "within 35 lakhs", "< 40 lakhs", "budget 30 lakhs"
  const underMatch =
    q.match(/(?:under|below|within|less than|up to|upto|budget(?:\s+of)?(?:\s+is)?|<|maximum|max)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)/i) ||
    q.match(/(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)\s*(?:budget|or less|max|maximum|under|below)/i);

  if (underMatch) {
    return { maxPrice: parseUnit(underMatch[1], underMatch[2]) };
  }

  // 3. Above/More than: "above 50 lakhs", "> 1 cr"
  const aboveMatch = q.match(/(?:above|more than|greater than|>|minimum|min)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|lac|lakh|cr|crores?|crore|l\b)/i);
  if (aboveMatch) {
    return { minPrice: parseUnit(aboveMatch[1], aboveMatch[2]) };
  }

  return null;
}

/**
 * Determines whether the user is actively searching for real estate property listings/projects,
 * supporting Pan-India cities and localities.
 */
export function isPropertySearchQuery(query: string): boolean {
  const q = normalizeQuery(query).toLowerCase().trim();

  // Check if query matches any project name in active properties
  const hasProjectMention = activeProperties.some(p => {
    const t = p.title.toLowerCase();
    const rawProj = p.rawDetails?.projectName?.toLowerCase();
    if (rawProj && rawProj.length > 3 && q.includes(rawProj)) return true;
    if (t && t.length > 5 && q.includes(t.slice(0, 20))) return true;
    return false;
  }) || /\b(project|layout|venture|township|enclave|heights|villas|residency|county|valley|meadows)\b/i.test(q);

  if (hasProjectMention && !q.includes('what is') && !q.includes('how to')) return true;

  // Single-word regulatory queries
  if (q === 'hmda' || q === 'dtcp' || q === 'rera' || q === 'ec' || q === 'mutation' || q === 'loan') {
    return false;
  }

  // Pure informational questions
  const isPureInformational =
    q.includes('what is') ||
    q.includes('what are') ||
    q.includes('means') ||
    q.includes('who is') ||
    q.includes('who are') ||
    q.includes('how to') ||
    q.includes('service') ||
    q.includes('services') ||
    q.includes('legal faq') ||
    q.includes('mutation');

  if (isPureInformational) {
    const detected = detectIndianLocationInQuery(q);
    const hasSpecificBudget = /\b(under|budget|lakh|cr)\b/i.test(q) || /\b\d+(\.\d+)?\s*(l|cr|lakh|crore)\b/i.test(q);
    const hasSearchAction = /\b(show|find|list|buy plot|buy villa|buy apartment)\b/i.test(q);

    if (detected && (hasSpecificBudget || hasSearchAction || q.includes('plot') || q.includes('villa') || q.includes('apartment'))) {
      // allow through to search
    } else {
      return false;
    }
  }

  // Check for property keywords
  const hasPropertyType =
    q.includes('plot') ||
    q.includes('land') ||
    q.includes('villa') ||
    q.includes('apartment') ||
    q.includes('flat') ||
    q.includes('bhk') ||
    q.includes('house') ||
    q.includes('commercial') ||
    q.includes('farmland') ||
    q.includes('property') ||
    q.includes('properties');

  const hasSearchIntent =
    q.includes('show') ||
    q.includes('find') ||
    q.includes('search') ||
    q.includes('list') ||
    q.includes('buy') ||
    q.includes('available') ||
    q.includes('budget') ||
    q.includes('under') ||
    q.includes('price') ||
    q.includes('near');

  const detectedLocation = detectIndianLocationInQuery(q);

  return hasPropertyType || (Boolean(detectedLocation) && hasSearchIntent) || (Boolean(detectedLocation) && hasPropertyType) || (Boolean(detectedLocation) && q.split(' ').length <= 4);
}

/**
 * Core query filtering function with India-Wide location support & nearby recommendations
 */
export function filterPropertiesByQuery(source: PropertyItem[], query: string): PropertyItem[] {
  const q = normalizeQuery(query).toLowerCase().trim();

  // 1. Direct Project Name Match
  const projectMatches = source.filter(p => {
    const t = p.title.toLowerCase();
    const rawProj = p.rawDetails?.projectName?.toLowerCase() || '';
    const projSpec = p.specifications?.find(s => s.label.toLowerCase() === 'project')?.value.toLowerCase() || '';

    if (rawProj && (q.includes(rawProj) || rawProj.includes(q))) return true;
    if (projSpec && (q.includes(projSpec) || projSpec.includes(q))) return true;
    if (t && (q.includes(t) || (t.length > 8 && q.includes(t.slice(0, 20))))) return true;
    return false;
  });

  if (projectMatches.length > 0) {
    return projectMatches.slice(0, 4);
  }

  // 2. Approvals intent
  const wantsHmda = /\bhmda\b/i.test(q);
  const wantsDtcp = /\bdtcp\b/i.test(q);
  const wantsRera = /\brera\b/i.test(q);
  const wantsGhmc = /\bghmc\b/i.test(q);

  // 3. Property Type intent
  const wantsFarmland = /\b(farm|farmland|farmlands|farms|agriculture|agri|farmhouse)\b/i.test(q);
  const wantsCommercial = /\b(commercial|shop|office|retail)\b/i.test(q);
  const wantsVillaPlot = /\b(villa\s*plot|villas\s*plot|villa\s*plots|villas\s*plots)\b/i.test(q);
  const wantsPlot = (/\b(plot|plots|land|lands|open\s*plot|open\s*plots|venture|guntas|sq\.?yd)\b/i.test(q) || wantsVillaPlot) && !wantsCommercial;
  const wantsVilla = /\b(villa|villas|duplex|triplex|house|independent\s*house)\b/i.test(q) && !wantsVillaPlot;
  const wantsApartment = /\b(flat|flats|apartment|apartments|bhk|highrise)\b/i.test(q);

  // 4. Budget limits
  const budget = parseBudgetLimits(q);

  // 5. BHK requirement
  const bhkMatch = q.match(/\b([1-5])\s*bhk\b/i);
  const reqBhk = bhkMatch ? parseInt(bhkMatch[1], 10) : null;

  // 6. Location Detection using Pan-India registry
  const locResult = detectIndianLocationInQuery(q);

  // Helper function to check property matches type and budget
  const matchesTypeAndBudget = (p: PropertyItem) => {
    const titleLower = p.title.toLowerCase();
    const isFarm = p.type === 'farmland' || titleLower.includes('farm') || titleLower.includes('agricultural');
    const isPlot = p.type === 'plot' || titleLower.includes('villa plot') || titleLower.includes('villas plot') || titleLower.includes('plot for sale');
    const isVilla = !isFarm && !titleLower.includes('villa plot') && !titleLower.includes('villas plot') && (p.type === 'villa' || /\bvillas?\b/i.test(titleLower) || /\bhouse\b/i.test(titleLower));
    const isApt = p.type === 'apartment' || titleLower.includes('flat for') || titleLower.includes('flats for') || titleLower.includes('apartments & flats') || (titleLower.includes('flat') && !titleLower.includes('villa')) || (titleLower.includes('apartment') && !titleLower.includes('villa'));
    const isComm = p.type === 'commercial' || titleLower.includes('commercial');

    if (wantsCommercial && !isComm) return false;
    if (wantsFarmland && !isFarm) return false;
    if (wantsVilla && !wantsPlot && (isFarm || isPlot || !isVilla)) return false;
    if (wantsPlot && !wantsVilla && (!isPlot || isFarm || isComm)) return false;
    if (wantsApartment && !isApt) return false;

    // Check BHK if specified
    if (reqBhk !== null && p.bhk) {
      const pBhkNum = typeof p.bhk === 'number' ? p.bhk : parseInt(String(p.bhk), 10);
      if (pBhkNum !== reqBhk) return false;
    }

    // Check budget
    if (budget) {
      const pPrice = p.priceNumeric || 0;
      if (budget.maxPrice && pPrice > budget.maxPrice) return false;
      if (budget.minPrice && pPrice < budget.minPrice) return false;
    }

    // Check approvals
    const appText = `${p.approval || ''} ${p.badge || ''} ${titleLower}`.toLowerCase();
    if (wantsHmda && !appText.includes('hmda')) return false;
    if (wantsDtcp && !appText.includes('dtcp')) return false;
    if (wantsRera && !appText.includes('rera') && !p.reraNumber) return false;
    if (wantsGhmc && !appText.includes('ghmc')) return false;

    return true;
  };

  // If specific locality was requested (e.g. "Andheri", "Hinjewadi", "Powai", "Devanahalli")
  if (locResult && locResult.locality) {
    const targetLocLower = locResult.locality.toLowerCase();

    // Step A: EXACT MATCHES in requested locality
    const exactMatches = source.filter(p => {
      if (!matchesTypeAndBudget(p)) return false;
      const fullLoc = `${p.locality || ''} ${p.location || ''} ${p.title || ''}`.toLowerCase();
      return fullLoc.includes(targetLocLower);
    });

    // Step B: NEARBY RECOMMENDATIONS in same city or neighboring localities
    const nearbyMatches: PropertyItem[] = [];
    const targetLocalityObj = PAN_INDIA_LOCALITIES.find(l => l.name.toLowerCase() === targetLocLower);

    for (const p of source) {
      if (exactMatches.some(em => em.id === p.id)) continue;
      if (!matchesTypeAndBudget(p)) continue;

      // Check if same city
      const isSameCity = p.city && locResult.city && p.city.toLowerCase() === locResult.city.toLowerCase();
      const pLocLower = (p.locality || p.location || '').toLowerCase();

      let distanceKm: number | null = null;
      if (targetLocalityObj && p.latitude && p.longitude) {
        distanceKm = calculateDistanceKm(targetLocalityObj.lat, targetLocalityObj.lng, p.latitude, p.longitude);
      }

      // If within same city or within 30 km, include as nearby
      if (isSameCity || (distanceKm !== null && distanceKm <= 35)) {
        const distLabel = distanceKm !== null ? `${distanceKm} km away` : 'Nearby in same city';
        nearbyMatches.push({
          ...p,
          isNearby: true,
          nearbyDistanceKm: distanceKm || undefined,
          nearbyNote: `Nearby • ${distLabel} in ${p.locality || p.city || 'vicinity'}`
        });
      }
    }

    // Sort nearby by distance if available
    nearbyMatches.sort((a, b) => (a.nearbyDistanceKm || 999) - (b.nearbyDistanceKm || 999));

    // Combine: Exact matches first, then nearby recommendations
    const combined = [...exactMatches, ...nearbyMatches];
    if (combined.length > 0) {
      return combined.slice(0, 6);
    }
  }

  // If city was requested (e.g. "Mumbai", "Pune", "Bangalore", "Hyderabad")
  if (locResult && locResult.city) {
    const targetCityLower = locResult.city.toLowerCase();
    const cityMatches = source.filter(p => {
      if (!matchesTypeAndBudget(p)) return false;
      const pCity = (p.city || '').toLowerCase();
      const fullLoc = (p.location || '').toLowerCase();
      return pCity.includes(targetCityLower) || fullLoc.includes(targetCityLower);
    });

    if (cityMatches.length > 0) {
      return cityMatches.slice(0, 6);
    }
  }

  // Fallback: general category & budget filter across all active properties
  const generalCandidates = source.filter(matchesTypeAndBudget);
  return generalCandidates.slice(0, 6);
}

export function getPropertiesForQuery(query: string): PropertyItem[] {
  if (!isPropertySearchQuery(query)) {
    return [];
  }
  return filterPropertiesByQuery(activeProperties, query);
}

export function searchLiveProperties(query: string): PropertyItem[] {
  return filterPropertiesByQuery(activeProperties, query);
}

export function findPropertyById(id: string): PropertyItem | undefined {
  return activeProperties.find(p => p.id === id || p.propertyId === id);
}

export function findPropertyByTitle(title: string): PropertyItem | undefined {
  const cleanTitle = title.toLowerCase().trim();
  const isMatch = (p: PropertyItem) => {
    if (p.title.toLowerCase().includes(cleanTitle)) return true;
    if (cleanTitle.length > 5 && cleanTitle.includes(p.title.toLowerCase().slice(0, 20))) return true;
    const projectSpec = p.specifications?.find(s => s.label.toLowerCase() === 'project');
    if (projectSpec && projectSpec.value.toLowerCase().includes(cleanTitle)) return true;
    if (p.rawDetails?.projectName && p.rawDetails.projectName.toLowerCase().includes(cleanTitle)) return true;
    if (p.about && p.about.toLowerCase().includes(cleanTitle)) return true;
    return false;
  };
  return activeProperties.find(isMatch);
}
