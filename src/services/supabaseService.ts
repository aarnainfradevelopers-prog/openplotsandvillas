import { createClient } from '@supabase/supabase-js';
import { PropertyItem } from '../types/chat';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://bpwejmkgvvoqeumxhokr.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwd2VqbWtndnZvcWV1bXhob2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjE4ODgsImV4cCI6MjA5MTczNzg4OH0.FG4ik7b0XsxBUwSXILoE1VG9ci-FXW7_luKwljMnBE8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEFAULT_IMAGES = {
  plot: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  villa: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  farmland: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
};

export function formatIndianPrice(val: number | string | null | undefined): string {
  if (!val) return 'Price on Request';
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d.]/g, '')) : Number(val);
  if (isNaN(num) || num <= 0) return 'Price on Request';

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹ ${cr} Cr`;
  }
  if (num >= 100000) {
    const l = (num / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹ ${l} Lakhs`;
  }
  return `₹ ${num.toLocaleString('en-IN')}`;
}

export function cleanPropertyImages(rawImages: any, type: string): string[] {
  let imagesList: string[] = [];
  if (Array.isArray(rawImages)) {
    imagesList = rawImages;
  } else if (typeof rawImages === 'string') {
    try {
      const parsed = JSON.parse(rawImages);
      if (Array.isArray(parsed)) imagesList = parsed;
      else imagesList = [rawImages];
    } catch {
      imagesList = [rawImages];
    }
  }

  // Filter out invalid paths (like file:/// device uploads) and keep valid HTTP(S) URLs
  const validUrls = imagesList
    .map(img => (typeof img === 'string' ? img.trim() : ''))
    .filter(img => img.startsWith('http://') || img.startsWith('https://'));

  if (validUrls.length > 0) {
    return validUrls;
  }

  const fallback = DEFAULT_IMAGES[type as keyof typeof DEFAULT_IMAGES] || DEFAULT_IMAGES.plot;
  return [fallback];
}

export function mapSupabaseToPropertyItem(raw: any): PropertyItem {
  const rawType = (raw.property_type || '').toLowerCase();
  let normalizedType: 'plot' | 'apartment' | 'villa' | 'commercial' | 'farmland' = 'plot';

  if (rawType.includes('villa') || rawType.includes('house') || rawType.includes('independent')) {
    normalizedType = 'villa';
  } else if (rawType.includes('flat') || rawType.includes('apartment')) {
    normalizedType = 'apartment';
  } else if (rawType.includes('commercial')) {
    normalizedType = 'commercial';
  } else if (rawType.includes('farm') || rawType.includes('agriculture')) {
    normalizedType = 'farmland';
  } else {
    normalizedType = 'plot';
  }

  const priceNum = raw.quotedprice || raw.price || 0;
  const formattedPrice = formatIndianPrice(priceNum);

  // Approvals & Badges
  const approvalTags: string[] = [];
  if (raw.rera_number && raw.rera_number !== 'NA' && raw.rera_number !== 'Not Applicable') {
    approvalTags.push(`RERA: ${raw.rera_number}`);
  }
  if (raw.hmda_number) approvalTags.push('HMDA Approved');
  if (raw.dtcp_number) approvalTags.push('DTCP Approved');
  if (raw.approval_type) approvalTags.push(raw.approval_type);

  const badge = approvalTags.length > 0 ? approvalTags[0] : (raw.possession_status || 'Verified Listing');

  // Specs
  const specs: { label: string; value: string }[] = [];
  if (raw.project_name) specs.push({ label: 'Project', value: raw.project_name });
  if (raw.plot_size) specs.push({ label: 'Plot Size', value: `${raw.plot_size} ${raw.plot_size_unit || 'Sq.Yd.'}` });
  if (raw.salable_area) specs.push({ label: 'Salable Area', value: `${raw.salable_area} ${raw.salable_area_unit || 'Sq.Ft.'}` });
  if (raw.bhk) specs.push({ label: 'Configuration', value: `${raw.bhk} BHK` });
  if (raw.facing) specs.push({ label: 'Facing', value: `${raw.facing} Facing` });
  if (raw.approval_type) specs.push({ label: 'Approval', value: raw.approval_type });
  if (raw.possession_status) specs.push({ label: 'Possession', value: raw.possession_status });
  if (raw.bank_loan) specs.push({ label: 'Bank Loan', value: raw.bank_loan === 'yes' ? 'Available' : raw.bank_loan });

  // Area string
  let areaStr = '';
  if (raw.plot_size) {
    areaStr = `${raw.plot_size} ${raw.plot_size_unit || 'Sq.Yd.'}`;
  } else if (raw.salable_area) {
    areaStr = `${raw.salable_area} ${raw.salable_area_unit || 'Sq.Ft.'}`;
  } else if (raw.area) {
    areaStr = `${raw.area} Sq.Yd.`;
  } else {
    areaStr = normalizedType === 'plot' ? 'Standard Plot' : 'Spacious Unit';
  }

  // Amenities
  let amenitiesList: string[] = [];
  if (Array.isArray(raw.amenities)) {
    amenitiesList = raw.amenities;
  } else if (typeof raw.amenities === 'string') {
    try {
      const parsed = JSON.parse(raw.amenities);
      if (Array.isArray(parsed)) amenitiesList = parsed;
      else amenitiesList = raw.amenities.split(',').map((s: string) => s.trim());
    } catch {
      amenitiesList = raw.amenities.split(',').map((s: string) => s.trim());
    }
  }

  if (amenitiesList.length === 0) {
    amenitiesList = normalizedType === 'plot' ? ['24 × 7 Security', 'Blacktop Roads'] : ['Car Parking', '24 × 7 Security'];
  }

  // Images
  const images = cleanPropertyImages(raw.images, normalizedType);

  // Nearby locations / highlights
  const nearby: string[] = [];
  if (raw.landmark) nearby.push(`Near ${raw.landmark}`);
  const pd =
    typeof raw.property_details === 'string'
      ? (() => {
          try {
            return JSON.parse(raw.property_details);
          } catch {
            return {};
          }
        })()
      : raw.property_details || {};

  // Formatted date and time matching Image 1
  const dt = new Date(raw.created_at || Date.now());
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
  const postedDate = !isNaN(dt.getTime())
    ? `${dt.getDate()}-${months[dt.getMonth()]}-${dt.getFullYear()}`
    : '22-SEPT-2026';
  const postedTime = !isNaN(dt.getTime())
    ? dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '06:04 PM';

  const rawPropId = pd.propId || raw.lp_number || `OPV-${raw.id}-${(pd.type || raw.property_type || 'PR').toUpperCase()}-${raw.id}`;
  const rawQuotedPrice = pd.quotedPrice
    ? `₹${Number(pd.quotedPrice).toLocaleString('en-IN')}`
    : raw.quotedprice
    ? `₹${Number(raw.quotedprice).toLocaleString('en-IN')}`
    : formattedPrice;
  const rawPlotSize = pd.plotSize
    ? `${pd.plotSize} ${pd.plotSizeUnit?.toLowerCase() || 'acres'}`
    : raw.plot_size
    ? `${raw.plot_size} ${raw.plot_size_unit || 'Sq.Yd.'}`
    : areaStr;
  const rawTotalPrice = raw.price || raw.quotedprice || pd.totalPrice
    ? `₹${Number(raw.price || raw.quotedprice || pd.totalPrice).toLocaleString('en-IN')}`
    : formattedPrice;

  const rawDetails = {
    postedDate,
    postedTime,
    propId: rawPropId,
    propertyType: (pd.type || raw.property_type || normalizedType).toUpperCase(),
    quotedPrice: rawQuotedPrice,
    plotSize: rawPlotSize,
    totalPrice: rawTotalPrice,
    projectName: pd.projectName || raw.project_name || raw.title,
    city: pd.city || raw.city || 'Hyderabad',
    zone: (pd.zone || raw.zone || 'WEST').toUpperCase(),
    location: pd.location || raw.location || 'Hyderabad',
    landmark: pd.landmark || raw.landmark || (nearby[0] || 'Near Neopolice and ORR'),
    facing: (pd.facing || raw.facing || 'EAST').toUpperCase()
  };

  return {
    id: `db-${raw.id}`,
    title: raw.title || raw.project_name || 'Open Plots & Villas Listing',
    location: raw.location || raw.city || 'Hyderabad, Telangana',
    price: formattedPrice,
    priceNumeric: typeof priceNum === 'number' ? priceNum : parseFloat(priceNum) || 0,
    status: (raw.purpose === 'Rent' || raw.purpose === 'rent') ? 'For Rent' : 'For Sale',
    badge,
    type: normalizedType,
    area: areaStr,
    config: raw.bhk ? `${raw.bhk} BHK` : (normalizedType === 'plot' ? 'Plot' : 'Independent Unit'),
    bhk: raw.bhk,
    possession: raw.possession_status || (normalizedType === 'plot' ? 'Immediate Registration' : 'Ready to Move'),
    facing: raw.facing ? `${raw.facing} Facing` : undefined,
    floor: raw.floor_number ? `${raw.floor_number} Floor` : undefined,
    amenities: amenitiesList.slice(0, 3),
    moreAmenitiesCount: Math.max(0, amenitiesList.length - 3),
    images,
    agent: {
      name: raw.owner_name || 'MANCHALA DAIVAPRAKASH',
      phone: raw['phone number'] || raw.owner_phone || '+91 9963513939',
      role: raw.developer ? `${raw.developer} Representative` : 'Senior Property Advisor • OPV',
      avatar: (raw.owner_name || 'M')[0].toUpperCase()
    },
    overview: `${areaStr} · in ${raw.location || 'Hyderabad'}. ${formattedPrice}. ${raw.description ? raw.description.slice(0, 140) + '...' : 'Verified genuine property directly listed on Open Plots & Villas.'}`,
    specifications: specs,
    about: raw.description || `${raw.title || 'Property'} located in the prime zone of ${raw.location || 'Hyderabad'}. Features clear legal titles, verified documentation, and immediate registration capability.`,
    nearby,
    reraNumber: raw.rera_number && raw.rera_number !== 'NA' ? raw.rera_number : undefined,
    approval: raw.approval_type || (raw.hmda_number ? 'HMDA Approved' : (raw.dtcp_number ? 'DTCP Approved' : 'Verified Clear Title')),
    rawDetails
  };
}

let cachedLiveProperties: PropertyItem[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 1 minute cache

export async function fetchLiveSupabaseProperties(): Promise<PropertyItem[]> {
  const now = Date.now();
  if (cachedLiveProperties && (now - lastFetchTime) < CACHE_TTL_MS) {
    return cachedLiveProperties;
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('id', { ascending: false });

    if (error || !data) {
      console.warn('Could not fetch properties from Supabase, error:', error?.message);
      return cachedLiveProperties || [];
    }

    // Filter available/approved properties
    const active = data.filter(p => !p.status || p.status === 'available' || p.status === 'approved');
    const mapped = active.map(mapSupabaseToPropertyItem);
    
    cachedLiveProperties = mapped;
    lastFetchTime = now;
    return mapped;
  } catch (err) {
    console.error('Failed to query Supabase properties:', err);
    return cachedLiveProperties || [];
  }
}

export async function submitPropertyLead(lead: {
  name: string;
  phone: string;
  email?: string;
  property_id?: number | null;
  message?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('property_leads').insert([
      {
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        property_id: lead.property_id || null,
        message: lead.message || 'Enquiry generated from OPV AI Chatbot'
      }
    ]);

    if (error) {
      console.error('Supabase lead submit error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception submitting lead:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
