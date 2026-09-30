import { PropertyItem } from '../types/chat';
import { normalizeQuery } from '../utils/intentClassifier';

export const OPV_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';

export const OPV_PROPERTIES: PropertyItem[] = [
  {
    id: 'prop-plot-katyayani-171',
    title: '171 Sq.Yd. Plot in Katyayani Estates',
    location: 'Lemoor, Hyderabad',
    price: '₹ 34L',
    priceNumeric: 3400000,
    status: 'For Sale',
    badge: 'Ready to move',
    type: 'plot',
    area: '171 Sq.Yd.',
    config: 'Plot',
    facing: 'East Facing',
    possession: 'Immediate Registration',
    amenities: ["Kids' Play Areas", "24 × 7 Security"],
    moreAmenitiesCount: 1,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'MANCHALA DAIVAPRAKASH',
      phone: '+91 9963513939',
      role: 'Senior Property Advisor • OPV',
      avatar: 'M'
    },
    overview: '171 Sq.Yd. · in Lemoor. ₹34L. 100% HMDA & RERA Approved Layout with immediate registration available directly from Open Plots & Villas.',
    specifications: [
      { label: 'Project', value: 'Katyayani Estates' },
      { label: 'Plot Area', value: '171 Sq.Yd.' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Road Width', value: '40 Feet Blacktop Road' },
      { label: 'Approval', value: 'HMDA & RERA Approved' },
      { label: 'Possession', value: 'Immediate Registration' }
    ],
    about: 'Katyayani Estates is an ultra-premium HMDA layout featured on Open Plots & Villas, situated at Lemoor near Srisailam Highway & Pharma City. Designed with wide 40ft & 30ft BT roads, underground electricity, compound wall with entrance arch, overhead water tank, and extensive avenue plantation. Clear legal title with 30-year search report.',
    nearby: [
      '15 Mins to Rajiv Gandhi International Airport (RGIA)',
      '10 Mins to Outer Ring Road (ORR Exit 14)',
      '10 Mins to Electronic City & Hardware Park',
      'Near Ramky Discovery City & International Schools'
    ],
    reraNumber: 'P02400005432',
    approval: 'HMDA & RERA Approved'
  },
  {
    id: 'prop-plot-vasavi-200',
    title: '200 Sq.Yd. Plot in Vasavi Archana County',
    location: 'Kethireddipally, Hyderabad',
    price: '₹ 35L',
    priceNumeric: 3500000,
    status: 'For Sale',
    badge: 'Owner · no brokerage',
    type: 'plot',
    area: '200 Sq.Yd.',
    config: 'Plot',
    facing: 'East Facing',
    possession: 'Ready to Register',
    amenities: ['Attached Market', '24 × 7 Security'],
    moreAmenitiesCount: 2,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'K. RAMESH BABU',
      phone: '+91 9963513939',
      role: 'Direct Owner Representative • OPV',
      avatar: 'R'
    },
    overview: '200 Sq.Yd. · in Kethireddipally. ₹35L. 100% Vaastu compliant east-facing plot with clear title on Bangalore NH-44 growth corridor.',
    specifications: [
      { label: 'Project', value: 'Vasavi Archana County' },
      { label: 'Plot Area', value: '200 Sq.Yd.' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Road Width', value: '33 Feet BT Road' },
      { label: 'Approval', value: 'DTCP & RERA Approved' },
      { label: 'Possession', value: 'Ready to Register' }
    ],
    about: 'Vasavi Archana County offers serene countryside living with modern municipal infrastructure. Features 24/7 security, attached convenience market, overhead tank water connection, and LED street lighting throughout.',
    nearby: [
      '15 Mins to Shadnagar Town & Railway Station',
      '20 Mins to Symbiosis International University',
      'Direct connectivity to Bangalore NH-44 Highway'
    ],
    reraNumber: 'P02400006129',
    approval: 'DTCP Approved'
  },
  {
    id: 'prop-plot-terpole-484',
    title: '484 Sq.Yd. Plot in Terpole',
    location: 'Terpole, Hyderabad',
    price: '₹ 43.5L',
    priceNumeric: 4350000,
    status: 'For Sale',
    badge: 'Owner · no brokerage',
    type: 'plot',
    area: '484 Sq.Yd.',
    config: 'Plot',
    facing: 'North-East',
    possession: 'Immediate Registration',
    amenities: ['Attached Market', '24 × 7 Security'],
    moreAmenitiesCount: 3,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'SRINIVAS REDDY',
      phone: '+91 9963513939',
      role: 'Investment Specialist • OPV',
      avatar: 'S'
    },
    overview: '484 Sq.Yd. · in Terpole. ₹43.5L. Large corner estate plot perfect for farmhouse or luxury villa construction on Mumbai Highway.',
    specifications: [
      { label: 'Project', value: 'Green Valley Terpole' },
      { label: 'Plot Area', value: '484 Sq.Yd. (1 Gunta+)' },
      { label: 'Facing', value: 'North-East Corner' },
      { label: 'Road Width', value: '50 Feet Master Plan Road' },
      { label: 'Approval', value: 'Clear Title / Spot Registration' },
      { label: 'Possession', value: 'Immediate' }
    ],
    about: 'Spacious 484 Sq.Yd. plot ideal for weekend villas, fruit plantation, or high ROI long-term holding. Fenced boundary with high security and round-the-clock water supply.',
    nearby: [
      'Near Mumbai Highway NH-65 Corridor',
      '25 Mins to IIT Hyderabad Kandi',
      'Close to upcoming Regional Ring Road (RRR)'
    ],
    reraNumber: 'P02400004991',
    approval: 'Verified Clear Title'
  },
  {
    id: 'prop-plot-shadnagar-150',
    title: '150 Sq.Yd. Plot in Shadnagar Town',
    location: 'Shadnagar, Hyderabad',
    price: '₹ 22.5L',
    priceNumeric: 2250000,
    status: 'For Sale',
    badge: 'Ready to move',
    type: 'plot',
    area: '150 Sq.Yd.',
    config: 'Plot',
    facing: 'East Facing',
    possession: 'Immediate Registration',
    amenities: ["Kids' Play Areas", "24 × 7 Security", "Avenue Plantation"],
    moreAmenitiesCount: 2,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'MANCHALA DAIVAPRAKASH',
      phone: '+91 9963513939',
      role: 'Senior Property Advisor • OPV',
      avatar: 'M'
    },
    overview: '150 Sq.Yd. · in Shadnagar. ₹22.5L. 100% HMDA & RERA Approved Layout with immediate registration on Bangalore Highway (NH-44).',
    specifications: [
      { label: 'Project', value: 'Golden Valley Shadnagar' },
      { label: 'Plot Area', value: '150 Sq.Yd.' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Road Width', value: '40 Feet Blacktop Road' },
      { label: 'Approval', value: 'HMDA & RERA Approved' },
      { label: 'Possession', value: 'Immediate Registration' }
    ],
    about: 'Prime residential plot situated right in the high-growth Shadnagar corridor along the Bangalore Highway (NH-44). Features 40ft wide blacktop roads, underground electricity, drainage, and clear 30-year link search reports.',
    nearby: [
      '5 Mins to Shadnagar Town & Railway Station',
      '15 Mins to Regional Ring Road (RRR) Junction',
      '20 Mins to Rajiv Gandhi International Airport (RGIA)',
      'Near Symbiosis International University'
    ],
    reraNumber: 'P02400005118',
    approval: 'HMDA & RERA Approved'
  },
  {
    id: 'prop-plot-golden-terra-200',
    title: 'Golden Terra – Premium HMDA Plots in Shadnagar',
    location: 'Shadnagar, Hyderabad',
    price: '₹ 56L',
    priceNumeric: 5600000,
    status: 'For Sale',
    badge: 'HMDA & RERA',
    type: 'plot',
    area: '200 Sq.Yd.',
    config: 'Plot',
    facing: 'East Facing',
    possession: 'Immediate Registration',
    amenities: ['Grand Entrance Arch', '40ft BT Roads', 'Underground Drainage', 'Avenue Plantation'],
    moreAmenitiesCount: 4,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'MANCHALA DAIVAPRAKASH',
      phone: '+91 9963513939',
      role: 'Senior Property Advisor • OPV',
      avatar: 'M'
    },
    overview: '200 Sq.Yd. · in Shadnagar. ₹56L. 100% HMDA & RERA Approved Layout with immediate registration on Bangalore Highway (NH-44).',
    specifications: [
      { label: 'Project', value: 'Golden Terra Shadnagar' },
      { label: 'Plot Area', value: '200 Sq.Yd.' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Road Width', value: '40 Feet Blacktop Road' },
      { label: 'Approval', value: 'HMDA & RERA Approved' },
      { label: 'Possession', value: 'Immediate Registration' }
    ],
    about: 'Golden Terra is an HMDA & RERA approved mega-township layout situated right in the high-growth Shadnagar corridor along the Bangalore Highway (NH-44). Features 40ft wide blacktop roads, underground electricity, drainage, and clear 30-year link search reports.',
    nearby: [
      '5 Mins to Shadnagar Town & Railway Station',
      '15 Mins to Regional Ring Road (RRR) Junction',
      '20 Mins to Rajiv Gandhi International Airport (RGIA)',
      'Near Symbiosis International University'
    ],
    reraNumber: 'P02400005118',
    approval: 'HMDA & RERA Approved'
  },
  {
    id: 'prop-plot-shadnagar-200',
    title: '200 Sq.Yd. Plot in Shadnagar Highway Corridor',
    location: 'Shadnagar, Hyderabad',
    price: '₹ 28L',
    priceNumeric: 2800000,
    status: 'For Sale',
    badge: 'Owner · no brokerage',
    type: 'plot',
    area: '200 Sq.Yd.',
    config: 'Plot',
    facing: 'North-East',
    possession: 'Immediate Registration',
    amenities: ['Wide BT Roads', '24 × 7 Security', 'Overhead Water Tank'],
    moreAmenitiesCount: 3,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'K. RAMESH BABU',
      phone: '+91 9963513939',
      role: 'Direct Owner Representative • OPV',
      avatar: 'R'
    },
    overview: '200 Sq.Yd. · in Shadnagar. ₹28L. Premium DTCP & RERA approved corner plot with clear title, ideal for immediate construction.',
    specifications: [
      { label: 'Project', value: 'Highway County Shadnagar' },
      { label: 'Plot Area', value: '200 Sq.Yd.' },
      { label: 'Facing', value: 'North-East' },
      { label: 'Road Width', value: '33 Feet BT Road' },
      { label: 'Approval', value: 'DTCP & RERA Approved' },
      { label: 'Possession', value: 'Immediate Registration' }
    ],
    about: 'Highway County in Shadnagar offers rapid capital appreciation and complete legal title security. 100% Vaastu compliant with street lighting, compound wall, and underground water supply lines.',
    nearby: [
      '7 Mins to Shadnagar MMTS Station',
      'Direct access to Bangalore NH-44 Highway',
      'Near Microsoft & Amazon Data Centers'
    ],
    reraNumber: 'P02400005782',
    approval: 'DTCP Approved'
  },
  {
    id: 'prop-apt-aparna-1326',
    title: '2 BHK 1326 Sq.Ft. Apartment in Aparna Zenon',
    location: 'Puppalaguda, Hyderabad',
    price: '₹ 1.8Cr',
    priceNumeric: 18000000,
    status: 'For Sale',
    badge: 'Ready to move',
    type: 'apartment',
    area: '1326 Sq.Ft.',
    config: '2 BHK',
    bhk: 2,
    possession: 'Ready to Move',
    facing: 'East Facing',
    amenities: ['Gymnasium', 'Swimming Pool'],
    moreAmenitiesCount: 6,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'PRIYA SHARMA',
      phone: '+91 9963513939',
      role: 'Luxury High-Rise Consultant • OPV',
      avatar: 'P'
    },
    overview: '1326 Sq.Ft. · in Puppalaguda. ₹1.8Cr. Aparna Constructions partner project with 50,000 sq.ft clubhouse & 80% open spaces in Financial District.',
    specifications: [
      { label: 'Project', value: 'Aparna Zenon' },
      { label: 'Super Built-up Area', value: '1326 Sq.Ft.' },
      { label: 'Configuration', value: '2 BHK + 2 Bathrooms' },
      { label: 'Floor', value: '14th Floor (Lake View)' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Car Parking', value: '1 Covered Basement' }
    ],
    about: 'Aparna Zenon in Puppalaguda / Nanakramguda junction represents the pinnacle of luxury apartment living in Financial District. Boasting state-of-the-art 50,000 sq.ft clubhouse, infinity pool, indoor badminton, and squash courts.',
    nearby: [
      '5 Mins to Financial District & WaveRock',
      '7 Mins to Outer Ring Road (ORR Nanakramguda)',
      '10 Mins to Continental Hospital & Oakridge School'
    ],
    reraNumber: 'P02400003719',
    approval: 'GHMC & RERA Approved'
  },
  {
    id: 'prop-apt-parkview-2050',
    title: '3 BHK 2050 Sq.Ft. Apartment in Park View',
    location: 'Kondapur, Hyderabad',
    price: '₹ 55k/month',
    priceNumeric: 55000,
    status: 'For Rent',
    badge: 'Ready to move',
    type: 'apartment',
    area: '2050 Sq.Ft.',
    config: '3 BHK',
    bhk: 3,
    possession: 'Ready to Move',
    facing: 'East Facing',
    amenities: ['Gymnasium', 'Swimming Pool'],
    moreAmenitiesCount: 5,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'VIKRAM CHOUDHARY',
      phone: '+91 9963513939',
      role: 'Leasing & Rental Manager • OPV',
      avatar: 'V'
    },
    overview: '2050 Sq.Ft. · in Kondapur. ₹55,000/month. Semi-furnished luxury flat with modular kitchen and 2 balconies near Botanical Gardens.',
    specifications: [
      { label: 'Project', value: 'Park View Residency' },
      { label: 'Area', value: '2050 Sq.Ft.' },
      { label: 'Configuration', value: '3 BHK + 3 Bath + Study' },
      { label: 'Furnishing', value: 'Semi-Furnished (Wardrobes & ACs)' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Parking', value: '2 Reserved Covered Spots' }
    ],
    about: 'Situated in the heart of Kondapur near Botanical Gardens, this apartment offers tranquil living within walking distance to tech parks, supermarkets, and international restaurants.',
    nearby: [
      '5 Mins to HITEC City Cyber Towers',
      '3 Mins to Sarath City Capital Mall',
      'Walkable to Botanical Garden & AMB Cinemas'
    ],
    reraNumber: 'P02400002194',
    approval: 'GHMC Approved'
  },
  {
    id: 'prop-apt-harmony-2460',
    title: '4 BHK 2460 Sq.Ft. Apartment in Harmony Towers',
    location: 'Sainikpuri, Hyderabad',
    price: '₹ 1.8Cr',
    priceNumeric: 18000000,
    status: 'For Sale',
    badge: 'Owner · no brokerage',
    type: 'apartment',
    area: '2460 Sq.Ft.',
    config: '4 BHK',
    bhk: 4,
    possession: 'Ready to Move',
    facing: 'North Facing',
    floor: '5 Floor',
    amenities: ["Kids' Play Areas", '24 × 7 Security'],
    moreAmenitiesCount: 1,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'ANAND MOHAN',
      phone: '+91 9963513939',
      role: 'Direct Property Owner • OPV',
      avatar: 'A'
    },
    overview: '2460 Sq.Ft. · in Sainikpuri. ₹1.8Cr. Spacious 4 BHK on 5th floor with unhindered green cantonment views and 100% Vaastu.',
    specifications: [
      { label: 'Project', value: 'Harmony Towers' },
      { label: 'Area', value: '2460 Sq.Ft.' },
      { label: 'Configuration', value: '4 BHK + 4 Bathrooms' },
      { label: 'Floor', value: '5th Floor' },
      { label: 'Facing', value: 'North Facing (100% Vaastu)' },
      { label: 'Maintenance', value: '₹3,500/month' }
    ],
    about: 'Harmony Towers is a premium low-density development located in peaceful Sainikpuri. Features 100% power backup, rainwater harvesting, landscaped gardens, and dedicated children play areas.',
    nearby: [
      '5 Mins to Sainikpuri Main Road & Cafes',
      '10 Mins to ECIL X Roads & Metro Station',
      'Near Bhavan’s Sri Ramakrishna Vidyalaya'
    ],
    reraNumber: 'P02400008812',
    approval: 'GHMC Approved'
  },
  {
    id: 'prop-villa-mokila-3600',
    title: '4 BHK 3600 Sq.Ft. Luxury Villa in Mokila Meadows',
    location: 'Mokila, Hyderabad',
    price: '₹ 2.75Cr',
    priceNumeric: 27500000,
    status: 'For Sale',
    badge: 'Ready to move',
    type: 'villa',
    area: '3600 Sq.Ft.',
    config: '4 BHK Villa',
    bhk: 4,
    possession: 'Ready to Move',
    facing: 'East Facing',
    amenities: ['Clubhouse', 'Private Lawn', 'Swimming Pool'],
    moreAmenitiesCount: 8,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'MANCHALA DAIVAPRAKASH',
      phone: '+91 9963513939',
      role: 'Senior Villa Consultant • OPV',
      avatar: 'M'
    },
    overview: '3600 Sq.Ft. · in Mokila. ₹2.75Cr. Triplex contemporary luxury villa with private lawn & terrace home theatre along Shankarpally Road.',
    specifications: [
      { label: 'Project', value: 'Mokila Meadows Gated Villa' },
      { label: 'Plot Area', value: '300 Sq.Yd.' },
      { label: 'Built-up Area', value: '3600 Sq.Ft. (G+2)' },
      { label: 'Configuration', value: '4 BHK + Home Theatre + Maid Room' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Car Parking', value: '2 Covered SUV Spaces' }
    ],
    about: 'Nestled in the lush western corridor of Mokila along Shankarpally Road, Mokila Meadows offers gated security with underground cabling, private clubhouse, tennis court, and banquet hall.',
    nearby: [
      '15 Mins to Neopolis Kokapet & Financial District',
      '10 Mins to Kollur ORR Exit 2',
      'Near Indus International & Gaudium School'
    ],
    reraNumber: 'P02400009182',
    approval: 'HMDA & RERA Approved'
  },
  {
    id: 'prop-villa-kollur-2800',
    title: '3 BHK 2800 Sq.Ft. Gated Villa in Kollur Greenfield',
    location: 'Kollur, Hyderabad',
    price: '₹ 2.15Cr',
    priceNumeric: 21500000,
    status: 'For Sale',
    badge: 'Ready to move',
    type: 'villa',
    area: '2800 Sq.Ft.',
    config: '3 BHK Villa',
    bhk: 3,
    possession: 'Immediate',
    facing: 'North-East',
    amenities: ['24 × 7 Security', 'Gymnasium', 'Tennis Court'],
    moreAmenitiesCount: 5,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'DEVIKA RAO',
      phone: '+91 9963513939',
      role: 'Kollur Venture Specialist • OPV',
      avatar: 'D'
    },
    overview: '2800 Sq.Ft. · in Kollur. ₹2.15Cr. Ultra-modern duplex villa with solar backup & private garden right next to ORR Exit 2.',
    specifications: [
      { label: 'Project', value: 'Kollur Greenfield Villas' },
      { label: 'Plot Area', value: '220 Sq.Yd.' },
      { label: 'Built-up Area', value: '2800 Sq.Ft. (G+1)' },
      { label: 'Configuration', value: '3 BHK + Family Lounge' },
      { label: 'Facing', value: 'North-East' },
      { label: 'Possession', value: 'Immediate' }
    ],
    about: 'Kollur Greenfield is right next to ORR Exit 2 with seamless 12-minute signal-free highway drive to Financial District & Gachibowli.',
    nearby: [
      '2 Mins to Outer Ring Road Exit 2',
      '12 Mins to Financial District & Wipro Circle',
      'Near Samashti & Sancta Maria International Schools'
    ],
    reraNumber: 'P02400007421',
    approval: 'HMDA Approved'
  },
  {
    id: 'prop-villa-tellapur-4200',
    title: '4 BHK 4200 Sq.Ft. Luxury Villa in Tellapur',
    location: 'Tellapur, Hyderabad',
    price: '₹ 3.8Cr',
    priceNumeric: 38000000,
    status: 'For Sale',
    badge: 'Ready to move',
    type: 'villa',
    area: '4200 Sq.Ft.',
    config: '4 BHK Villa',
    bhk: 4,
    possession: 'Ready to Move',
    facing: 'East Facing',
    amenities: ['Clubhouse', 'Swimming Pool', 'Private Garden'],
    moreAmenitiesCount: 6,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agent: {
      name: 'MANCHALA DAIVAPRAKASH',
      phone: '+91 9963513939',
      role: 'Senior Luxury Property Advisor • OPV',
      avatar: 'M'
    },
    overview: '4200 Sq.Ft. · in Tellapur. ₹3.8Cr. Triplex contemporary luxury villa with private lawn & terrace home theatre near Neopolis Kokapet.',
    specifications: [
      { label: 'Project', value: 'Tellapur Neopolis Villas' },
      { label: 'Plot Area', value: '350 Sq.Yd.' },
      { label: 'Built-up Area', value: '4200 Sq.Ft. (G+2)' },
      { label: 'Configuration', value: '4 BHK + Home Theatre + Maid Room' },
      { label: 'Facing', value: 'East Facing' },
      { label: 'Approval', value: 'HMDA & RERA Approved' }
    ],
    about: 'Ultra-luxury triplex villa located in Tellapur near Neopolis Kokapet. Features 100% Vaastu, private garden, Italian marble flooring, and smart home automation.',
    nearby: [
      '10 Mins to Financial District & Wipro Circle',
      '5 Mins to Neopolis Kokapet Growth Corridor',
      'Near Glendale Academy & Manthan International School'
    ],
    reraNumber: 'P02400008921',
    approval: 'HMDA & RERA Approved'
  }
];

let isLiveSupabaseLoaded = false;
let activeProperties: PropertyItem[] = [...OPV_PROPERTIES];

export function updateActiveProperties(properties: PropertyItem[]) {
  if (properties && Array.isArray(properties) && properties.length > 0) {
    activeProperties = [...properties];
    isLiveSupabaseLoaded = true;
  }
}

export function isUsingLiveSupabase(): boolean {
  return isLiveSupabaseLoaded;
}

export function getActiveProperties(): PropertyItem[] {
  return activeProperties;
}

export function getFallbackProperties(): PropertyItem[] {
  return OPV_PROPERTIES;
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
 * rather than asking general educational or OPV business questions.
 */
export function isPropertySearchQuery(query: string): boolean {
  const q = normalizeQuery(query).toLowerCase().trim();

  // Check for specific project mentions FIRST so project inquiries like "Tell me about Golden Terra"
  // are recognized rather than blocked by pure informational checks.
  const hasProjectMention =
    q.includes('golden terra') ||
    q.includes('sanjeevani') ||
    q.includes('nri green county') ||
    q.includes('katyayani') ||
    q.includes('vasavi') ||
    q.includes('archana county') ||
    q.includes('tellapur neopolis');

  if (hasProjectMention) return true;

  // Single-word regulatory queries
  if (q === 'hmda' || q === 'dtcp' || q === 'rera' || q === 'ec' || q === 'mutation' || q === 'loan') {
    return false;
  }

  // Pure informational, legal, process, regulatory or service questions must NEVER trigger property cards
  const isPureInformational =
    q.includes('what is') ||
    q.includes('what are') ||
    q.includes('means') ||
    q.includes('who is') ||
    q.includes('who are') ||
    q.includes('service') ||
    q.includes('services') ||
    q.includes('mission') ||
    q.includes('vision') ||
    q.includes('about opv') ||
    q.includes('what hmda') ||
    q.includes('what dtcp') ||
    q.includes('what rera') ||
    q.includes('what ec') ||
    q.includes('what mutation') ||
    q.includes('process') ||
    q.includes('guidance') ||
    q.includes('guide') ||
    q.includes('checklist') ||
    q.includes('how to buy') ||
    q.includes('how to sell') ||
    q.includes('how to rent') ||
    q.includes('home loan') ||
    q.includes('vastu') ||
    q.includes('bhoomi pooja') ||
    q.includes('gruhapravesam') ||
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('address') ||
    q.includes('headquarters') ||
    q.includes('office') ||
    q.includes('registration') ||
    q.includes('stamp duty') ||
    q.includes('verification') ||
    q.includes('verify') ||
    q.includes('encumbrance') ||
    q.includes('mutation');

  if (isPureInformational) {
    // Exception: If user specifically combined approval with specific location and search action
    const hasSpecificLocation = [
      'shadnagar', 'mokila', 'kokapet', 'tellapur', 'kothur',
      'lemoor', 'sadashivpet', 'patancheru', 'kadthal', 'gachibowli', 'shamshabad'
    ].some(loc => q.includes(loc));
    const hasSpecificBudget = /\b(under|budget|lakh|cr)\b/i.test(q) || /\b\d+(\.\d+)?\s*(l|cr|lakh|crore)\b/i.test(q);
    const hasSearchAction = /\b(show|find|list|buy plot|buy villa|buy apartment)\b/i.test(q);

    if (hasSpecificLocation && (hasSpecificBudget || hasSearchAction || q.includes('plot') || q.includes('villa'))) {
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
    q.includes('farmland');

  const hasSearchIntent =
    q.includes('show') ||
    q.includes('find') ||
    q.includes('search') ||
    q.includes('list') ||
    q.includes('buy') ||
    q.includes('available') ||
    q.includes('budget') ||
    q.includes('under') ||
    q.includes('price');

  const hasLocation = [
    'shadnagar', 'kokapet', 'madhapur', 'kothur', 'mokila',
    'shamshabad', 'sadashivpet', 'kadthal', 'lemoor', 'tellapur',
    'kollur', 'gachibowli', 'kondapur', 'patancheru', 'medchal',
    'adibatla', 'maheshwaram', 'chevella', 'shankarpally', 'kompally', 'hyderabad'
  ].some(loc => q.includes(loc));

  return hasPropertyType || (hasLocation && hasSearchIntent) || (hasLocation && hasPropertyType) || (hasLocation && q.split(' ').length <= 3);
}

/**
 * Core query filtering function applied against either live Supabase data or fallback inventory.
 * Strictly checks project name, numeric budget, property type, and locality.
 */
export function filterPropertiesByQuery(source: PropertyItem[], query: string): PropertyItem[] {
  const q = normalizeQuery(query).toLowerCase().trim();

  // 1. Direct Project Name Match
  const projectMatches = source.filter(p => {
    const t = p.title.toLowerCase();
    if (q.includes('golden terra') && t.includes('golden terra')) return true;
    if (q.includes('sanjeevani') && t.includes('sanjeevani')) return true;
    if (q.includes('nri green county') && t.includes('nri green county')) return true;
    if (q.includes('katyayani') && t.includes('katyayani')) return true;
    if (q.includes('vasavi') && t.includes('vasavi')) return true;
    if (q.includes('tellapur neopolis') && (t.includes('tellapur') || t.includes('neopolis'))) return true;
    return false;
  });

  if (projectMatches.length > 0) {
    return projectMatches.slice(0, 3);
  }

  // 2. Budget limits
  const budget = parseBudgetLimits(q);

  // 3. Property Type
  let targetType: string | null = null;
  if (q.includes('plot') || q.includes('land') || q.includes('openplot') || q.includes('sq.yd') || q.includes('guntas')) {
    targetType = 'plot';
  } else if (q.includes('villa') || q.includes('triplex') || q.includes('duplex') || q.includes('house')) {
    targetType = 'villa';
  } else if (q.includes('apartment') || q.includes('flat') || q.includes('bhk') || q.includes('highrise') || q.includes('rent')) {
    targetType = 'apartment';
  } else if (q.includes('commercial') || q.includes('shop') || q.includes('office') || q.includes('retail')) {
    targetType = 'commercial';
  } else if (q.includes('farm') || q.includes('agriculture')) {
    targetType = 'farmland';
  }

  // 4. Locations
  const locations = [
    'shadnagar', 'kokapet', 'madhapur', 'balanagar', 'kothur', 'mokila',
    'shamshabad', 'sadashivpet', 'kadthal', 'lemoor', 'tellapur', 'kollur',
    'gachibowli', 'kondapur', 'patancheru', 'medchal', 'adibatla', 'maheshwaram',
    'tenali', 'chevella', 'shankarpally', 'kompally', 'nizampet'
  ];
  const matchedLocations = locations.filter(loc => q.includes(loc));

  // 5. Filter candidates strictly
  const candidates = source.filter(p => {
    // Check type
    if (targetType) {
      if (targetType === 'farmland') {
        const isFarm = p.type === 'farmland' || p.title.toLowerCase().includes('farm');
        if (!isFarm) return false;
      } else if (p.type !== targetType && !(targetType === 'apartment' && p.config?.includes('BHK'))) {
        return false;
      }
    }

    // Check location
    if (matchedLocations.length > 0) {
      const pLoc = p.location.toLowerCase();
      const pTitle = p.title.toLowerCase();
      const match = matchedLocations.some(l => pLoc.includes(l) || pTitle.includes(l));
      if (!match) return false;
    }

    // Check numeric budget strictly (never return properties that violate user budget)
    if (budget) {
      const pPrice = p.priceNumeric || 0;
      if (budget.maxPrice && pPrice > budget.maxPrice) return false;
      if (budget.minPrice && pPrice < budget.minPrice) return false;
    }

    return true;
  });

  if (candidates.length > 0) {
    return candidates.slice(0, 4);
  }

  // If budget was specified but NO properties meet the budget, return empty array
  // (The chatbot will state no listings match and offer expert connect, without faking prices)
  if (budget) {
    return [];
  }

  // If only location matched
  if (matchedLocations.length > 0) {
    const locOnly = source.filter(p => {
      const pLoc = p.location.toLowerCase();
      const pTitle = p.title.toLowerCase();
      return matchedLocations.some(l => pLoc.includes(l) || pTitle.includes(l));
    });
    if (locOnly.length > 0) return locOnly.slice(0, 4);
  }

  // If only type matched
  if (targetType) {
    const typeOnly = source.filter(p => p.type === targetType);
    if (typeOnly.length > 0) return typeOnly.slice(0, 4);
  }

  return [];
}

/**
 * Searches properties with strict priority:
 * 1. Supabase LIVE DATA (activeProperties)
 * 2. propertyData.ts FALLBACK (OPV_PROPERTIES)
 */
export function getPropertiesForQuery(query: string): PropertyItem[] {
  // If not a property search, return empty array so no random cards are attached
  if (!isPropertySearchQuery(query)) {
    return [];
  }

  // Priority 1: Supabase live data if available
  if (isLiveSupabaseLoaded && activeProperties.length > 0) {
    const liveMatches = filterPropertiesByQuery(activeProperties, query);
    if (liveMatches.length > 0) {
      return liveMatches;
    }
  }

  // Priority 2: Fallback propertyData.ts
  return filterPropertiesByQuery(OPV_PROPERTIES, query);
}

/**
 * Dedicated Live Supabase Property Search
 */
export function searchLiveProperties(query: string): PropertyItem[] {
  if (isLiveSupabaseLoaded && activeProperties.length > 0) {
    return filterPropertiesByQuery(activeProperties, query);
  }
  return [];
}

/**
 * Dedicated Fallback Property Search
 */
export function searchFallbackProperties(query: string): PropertyItem[] {
  return filterPropertiesByQuery(OPV_PROPERTIES, query);
}

export function findPropertyById(id: string): PropertyItem | undefined {
  const source = activeProperties.length > 0 ? activeProperties : OPV_PROPERTIES;
  return source.find(p => p.id === id) || OPV_PROPERTIES.find(p => p.id === id);
}

export function findPropertyByTitle(title: string): PropertyItem | undefined {
  const cleanTitle = title.toLowerCase().trim();
  const source = activeProperties.length > 0 ? activeProperties : OPV_PROPERTIES;
  const isMatch = (p: PropertyItem) => {
    if (p.title.toLowerCase().includes(cleanTitle)) return true;
    if (cleanTitle.length > 5 && cleanTitle.includes(p.title.toLowerCase().slice(0, 20))) return true;
    const projectSpec = p.specifications?.find(s => s.label.toLowerCase() === 'project');
    if (projectSpec && projectSpec.value.toLowerCase().includes(cleanTitle)) return true;
    if (p.about && p.about.toLowerCase().includes(cleanTitle)) return true;
    return false;
  };

  return source.find(isMatch) || OPV_PROPERTIES.find(isMatch);
}


