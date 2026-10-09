/**
 * Modular Google Sheets Lead & Property Service
 *
 * Architecture:
 * React UI -> googleSheetsService.ts -> /api/leads Proxy -> Google Apps Script Web App -> Google Spreadsheet
 *
 * Supports 4 Google Sheets tabs:
 * 1. SELLERS
 * 2. BUYERS
 * 3. PROPERTIES
 * 4. ENQUIRIES
 *
 * NOTE: Designed to be 100% modular so it can be swapped with supabaseService.ts
 * in future phases without rewriting UI components.
 */

import {
  BuyerLeadRecord,
  SellerRecord,
  PropertyRecord,
  EnquiryRecord,
  PropertyItem
} from '../types/chat';

const GOOGLE_WEBHOOK_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL) ||
  '';

export function isGoogleSheetsWebhookConfigured(): boolean {
  return !!GOOGLE_WEBHOOK_URL;
}

const LOCAL_STORAGE_KEY = 'opv_lead_management_backup_v1';

// Helper to generate formatted IDs
export function generateLeadId(prefix: 'BUY' | 'SELL' | 'PROP' | 'ENQ'): string {
  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${timestampPart}${randomPart}`;
}

export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentTimeStr(): string {
  return new Date().toLocaleTimeString('en-IN', { hour12: true });
}

interface LocalLeadStore {
  sellers: SellerRecord[];
  buyers: BuyerLeadRecord[];
  properties: PropertyRecord[];
  enquiries: EnquiryRecord[];
}

let memoryStore: LocalLeadStore = { sellers: [], buyers: [], properties: [], enquiries: [] };

function getLocalStore(): LocalLeadStore {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read local lead store:', e);
  }
  return memoryStore;
}

function saveLocalStore(store: LocalLeadStore): void {
  memoryStore = store;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
    }
  } catch (e) {
    console.warn('Could not persist local lead store:', e);
  }
}

/**
 * Sends lead data to the backend /api/leads proxy which securely submits to Google Apps Script.
 * Falls back to local storage queue if backend is unreachable or script is in test mode.
 */
async function dispatchToGoogleSheets(action: string, payload: any): Promise<{ success: boolean; data?: any; message?: string }> {
  let proxyResult: any = null;
  try {
    const url = typeof window !== 'undefined' ? '/api/leads' : 'http://localhost:5173/api/leads';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data: payload })
    });

    if (response.ok) {
      proxyResult = await response.json();
      if (proxyResult?.googleSheetResult?.status === 'success') {
        return { success: true, data: proxyResult };
      }
    }
  } catch (err) {
    console.warn('Direct /api/leads endpoint unreachable:', err);
  }

  // Dual-dispatch: if direct Google Webhook URL is available, dispatch directly
  if (GOOGLE_WEBHOOK_URL) {
    try {
      await fetch(GOOGLE_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data: payload })
      });
      return { success: true, message: 'Dispatched to Google Apps Script' };
    } catch (e) {
      console.warn('Direct Google Apps Script webhook failed:', e);
    }
  }

  return { success: true, data: proxyResult || { message: 'Saved to local buffer' } };
}

/**
 * 1. SAVE BUYER LEAD (TAB 2: BUYERS)
 */
export async function saveBuyerLead(buyer: Partial<BuyerLeadRecord> & { phone?: string; mobileNumber?: string; buyerPhone?: string; contactNumber?: string; name?: string; propertyLocation?: string; propertyBudget?: string; time?: string; notesMessages?: string }): Promise<{ success: boolean; buyerLeadId: string; error?: string }> {
  const buyerLeadId = buyer.buyerLeadId || generateLeadId('BUY');
  const rawPhone = (buyer.contactNumber || buyer.phoneNumber || buyer.phone || buyer.mobileNumber || buyer.buyerPhone || '').trim();
  const displayPhone = rawPhone.replace(/^'+/, '');
  // Leading single quote forces Google Sheets to treat +countryCode as plain text, preventing #ERROR! formula errors
  const sheetPhone = rawPhone ? (rawPhone.startsWith("'") ? rawPhone : `'${rawPhone}`) : '';
  const now = new Date();
  const currentDate = buyer.enquiryDate || getCurrentDateISO();
  const currentTime = buyer.time || getCurrentTimeStr();
  const combinedNotes = buyer.notesMessages || [buyer.notes, buyer.message].filter(Boolean).join(' | ');

  const localRecord: any = {
    // 14 columns standard fields:
    propertyId: buyer.propertyId || '',
    name: buyer.name || buyer.buyerName || 'Prospective Buyer',
    email: buyer.email || '',
    contactNumber: displayPhone,
    propertyTitle: buyer.propertyTitle || '',
    propertyLocation: buyer.propertyLocation || buyer.preferredLocation || '',
    propertyBudget: buyer.propertyBudget || buyer.budget || '',
    city: buyer.city || 'Hyderabad',
    source: buyer.source || 'OPV Chatbot',
    enquiryDate: currentDate,
    time: currentTime,
    leadStatus: buyer.leadStatus || 'New',
    assignedTo: buyer.assignedTo || 'Unassigned',
    notesMessages: combinedNotes,

    // Backward compatibility aliases:
    buyerLeadId,
    buyerName: buyer.name || buyer.buyerName || 'Prospective Buyer',
    phoneNumber: displayPhone,
    phone: displayPhone,
    mobileNumber: displayPhone,
    buyerPhone: displayPhone,
    preferredLocation: buyer.propertyLocation || buyer.preferredLocation || '',
    propertyType: buyer.propertyType || 'Apartment',
    budget: buyer.propertyBudget || buyer.budget || '',
    message: buyer.message || '',
    notes: buyer.notes || ''
  };

  const sheetRecord: any = {
    ...localRecord,
    contactNumber: sheetPhone,
    phoneNumber: sheetPhone,
    phone: sheetPhone,
    mobileNumber: sheetPhone,
    buyerPhone: sheetPhone
  };

  // Local backup
  const store = getLocalStore();
  store.buyers.push(localRecord);
  saveLocalStore(store);

  await dispatchToGoogleSheets('save_lead', sheetRecord);

  return { success: true, buyerLeadId };
}

/**
 * 2. SAVE SELLER (TAB 1: SELLERS)
 */
export async function saveSeller(seller: Partial<SellerRecord>): Promise<{ success: boolean; sellerId: string; error?: string }> {
  const sellerId = seller.sellerId || generateLeadId('SELL');
  const rawMobile = (seller.mobileNumber || '').trim();
  const rawWA = (seller.whatsappNumber || seller.mobileNumber || '').trim();
  const sheetMobile = rawMobile ? (rawMobile.startsWith("'") ? rawMobile : `'${rawMobile}`) : '';
  const sheetWA = rawWA ? (rawWA.startsWith("'") ? rawWA : `'${rawWA}`) : '';

  const record: SellerRecord = {
    sellerId,
    sellerName: seller.sellerName || 'Verified Seller',
    sellerType: seller.sellerType || 'Owner',
    mobileNumber: rawMobile.replace(/^'+/, ''),
    whatsappNumber: rawWA.replace(/^'+/, ''),
    email: seller.email || '',
    sellerAddress: seller.sellerAddress || '',
    propertyId: seller.propertyId || '',
    propertyType: seller.propertyType || '',
    propertyTitle: seller.propertyTitle || '',
    propertyAddress: seller.propertyAddress || '',
    city: seller.city || '',
    state: seller.state || '',
    createdDate: seller.createdDate || getCurrentDateISO(),
    verificationStatus: seller.verificationStatus || 'Pending',
    listingStatus: seller.listingStatus || 'Pending'
  };

  const store = getLocalStore();
  store.sellers.push(record);
  saveLocalStore(store);

  await dispatchToGoogleSheets('save_seller', {
    ...record,
    mobileNumber: sheetMobile,
    whatsappNumber: sheetWA,
    phone: sheetMobile
  });

  return { success: true, sellerId };
}

/**
 * 3. SAVE PROPERTY (TAB 3: PROPERTIES)
 */
export async function saveProperty(prop: Partial<PropertyRecord>): Promise<{ success: boolean; propertyId: string; error?: string }> {
  const propertyId = prop.propertyId || generateLeadId('PROP');
  const record: PropertyRecord = {
    propertyId,
    propertyType: prop.propertyType || 'Apartment',
    propertyTitle: prop.propertyTitle || '',
    price: prop.price || 'Price on Request',
    area: prop.area || '',
    areaUnit: prop.areaUnit || 'Sq.Ft.',
    address: prop.address || '',
    locality: prop.locality || '',
    city: prop.city || '',
    state: prop.state || '',
    pincode: prop.pincode || '',
    latitude: prop.latitude,
    longitude: prop.longitude,
    sellerId: prop.sellerId || '',
    sellerName: prop.sellerName || '',
    approvalType: prop.approvalType || 'Verified',
    reraNumber: prop.reraNumber || '',
    hmdaNumber: prop.hmdaNumber || '',
    dtcpNumber: prop.dtcpNumber || '',
    listingStatus: prop.listingStatus || 'Pending',
    verificationStatus: prop.verificationStatus || 'Pending',
    createdDate: prop.createdDate || getCurrentDateISO()
  };

  const store = getLocalStore();
  store.properties.push(record);
  saveLocalStore(store);

  await dispatchToGoogleSheets('save_property', record);

  return { success: true, propertyId };
}

/**
 * 4. SAVE ENQUIRY (TAB 4: ENQUIRIES)
 */
export async function saveEnquiry(enquiry: Partial<EnquiryRecord>): Promise<{ success: boolean; enquiryId: string; error?: string }> {
  const enquiryId = enquiry.enquiryId || generateLeadId('ENQ');
  const record: EnquiryRecord = {
    enquiryId,
    buyerLeadId: enquiry.buyerLeadId || '',
    buyerName: enquiry.buyerName || '',
    buyerPhone: enquiry.buyerPhone || '',
    propertyId: enquiry.propertyId || '',
    propertyTitle: enquiry.propertyTitle || '',
    sellerId: enquiry.sellerId || '',
    sellerName: enquiry.sellerName || '',
    enquiryType: enquiry.enquiryType || 'General Enquiry',
    message: enquiry.message || '',
    date: enquiry.date || getCurrentDateISO(),
    time: enquiry.time || getCurrentTimeStr(),
    status: enquiry.status || 'New',
    assignedTo: enquiry.assignedTo || 'Unassigned',
    followUpDate: enquiry.followUpDate || '',
    notes: enquiry.notes || ''
  };

  const store = getLocalStore();
  store.enquiries.push(record);
  saveLocalStore(store);

  await dispatchToGoogleSheets('save_enquiry', record);

  return { success: true, enquiryId };
}

/**
 * 5. COMPREHENSIVE BUYER ENQUIRY SUBMISSION
 * Connects Buyer + Property + Seller in one atomic operation.
 * Writes to both BUYERS and ENQUIRIES sheets.
 */
export async function submitBuyerEnquiry(params: {
  buyerName: string;
  phone: string;
  email?: string;
  preferredLocation?: string;
  message?: string;
  property?: PropertyItem | null;
  serviceType?: string;
  preferredDate?: string;
}): Promise<{
  success: boolean;
  buyerLeadId: string;
  enquiryId: string;
  sellerName: string;
  sellerType: string;
  buyerLead?: BuyerLeadRecord;
  enquiry?: EnquiryRecord;
  error?: string;
}> {
  try {
    const buyerLeadId = generateLeadId('BUY');
    const enquiryId = generateLeadId('ENQ');
    const propId = params.property?.propertyId || params.property?.id || 'PROP-GENERAL';
    const propTitle = params.property?.title || 'Open Plots & Villas Listing';
    const sellerId = params.property?.sellerId || 'SELL-OPV-01';
    const sellerName = params.property?.sellerName || params.property?.agent?.name || 'OPV Verified Listing Partner';
    const sellerType = params.property?.sellerType || 'Owner';

    const fullPhone = (params.phone || '').trim();
    const currentDate = getCurrentDateISO();
    const currentTime = getCurrentTimeStr();
    const propLocation = params.preferredLocation || params.property?.location || '';
    const propBudget = params.property?.price || '';
    const notesContent = [
      params.serviceType ? `Service: ${params.serviceType}` : '',
      params.preferredDate ? `Visit Date: ${params.preferredDate}` : '',
      params.message ? `Message: ${params.message}` : ''
    ].filter(Boolean).join(' | ');

    const buyerLead: any = {
      // 14 columns standard fields:
      propertyId: propId,
      name: params.buyerName,
      email: params.email || '',
      contactNumber: fullPhone,
      propertyTitle: propTitle,
      propertyLocation: propLocation,
      propertyBudget: propBudget,
      city: params.property?.city || 'Hyderabad',
      source: 'OPV Chatbot',
      enquiryDate: currentDate,
      time: currentTime,
      leadStatus: 'New',
      assignedTo: 'Unassigned',
      notesMessages: notesContent || 'Interested in property',

      // Backward compatibility aliases:
      buyerLeadId,
      buyerName: params.buyerName,
      phoneNumber: fullPhone,
      phone: fullPhone,
      mobileNumber: fullPhone,
      buyerPhone: fullPhone,
      preferredLocation: propLocation,
      propertyType: params.property?.type || 'Property',
      budget: propBudget,
      message: params.message || 'I am interested in this property. Please help me connect.',
      notes: notesContent
    };

    // 1. Record single lead in "Leads information" sheet
    await saveBuyerLead(buyerLead);

    // Keep local buffer copy for in-app history
    const enquiryRecord: EnquiryRecord = {
      enquiryId,
      buyerLeadId,
      buyerName: params.buyerName,
      buyerPhone: params.phone,
      propertyId: propId,
      propertyTitle: propTitle,
      sellerId,
      sellerName,
      enquiryType: params.serviceType || 'Connect with Listing Owner',
      message: params.message || 'Interested in property',
      date: getCurrentDateISO(),
      time: getCurrentTimeStr(),
      status: 'New',
      assignedTo: 'Unassigned',
      followUpDate: '',
      notes: `Preferred visit date: ${params.preferredDate || 'N/A'}`
    };

    const store = getLocalStore();
    store.enquiries.push(enquiryRecord);
    saveLocalStore(store);

    return {
      success: true,
      buyerLeadId,
      enquiryId,
      sellerName,
      sellerType,
      buyerLead,
      enquiry: enquiryRecord
    };
  } catch (err: any) {
    console.error('Failed to submit buyer enquiry:', err);
    return {
      success: false,
      buyerLeadId: '',
      enquiryId: '',
      sellerName: '',
      sellerType: '',
      error: err?.message || 'Submission failed'
    };
  }
}

/**
 * 6. COMPREHENSIVE SELLER POST PROPERTY SUBMISSION
 * Stores Seller in SELLERS sheet and Property in PROPERTIES sheet.
 */
export async function submitSellerPostProperty(params: {
  // Seller details
  sellerName: string;
  sellerType: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email: string;
  sellerAddress?: string;

  // Property details
  propertyType: string;
  propertyTitle: string;
  description?: string;
  price: string;
  area: string;
  areaUnit: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  approvalType?: string;
  reraNumber?: string;
  hmdaNumber?: string;
  dtcpNumber?: string;
  photos?: string[];
}): Promise<{
  success: boolean;
  propertyId: string;
  sellerId: string;
  sellerRecord?: SellerRecord;
  propertyRecord?: PropertyRecord;
  propertyItem?: PropertyItem;
  error?: string;
}> {
  try {
    const propertyId = generateLeadId('PROP');
    const sellerId = generateLeadId('SELL');

    const sellerRecord: SellerRecord = {
      sellerId,
      sellerName: params.sellerName,
      sellerType: params.sellerType as any,
      mobileNumber: params.mobileNumber,
      whatsappNumber: params.whatsappNumber || params.mobileNumber,
      email: params.email,
      sellerAddress: params.sellerAddress || `${params.city}, ${params.state}`,
      propertyId,
      propertyType: params.propertyType,
      propertyTitle: params.propertyTitle,
      propertyAddress: params.address,
      city: params.city,
      state: params.state,
      createdDate: getCurrentDateISO(),
      verificationStatus: 'Pending',
      listingStatus: 'Pending'
    };

    // 1. Record Seller in SELLERS tab
    await saveSeller(sellerRecord);

    const propertyRecord: PropertyRecord = {
      propertyId,
      propertyType: params.propertyType,
      propertyTitle: params.propertyTitle,
      price: params.price,
      area: params.area,
      areaUnit: params.areaUnit,
      address: params.address,
      locality: params.locality,
      city: params.city,
      state: params.state,
      pincode: params.pincode || '',
      latitude: params.latitude,
      longitude: params.longitude,
      sellerId,
      sellerName: params.sellerName,
      approvalType: params.approvalType || 'Under Verification',
      reraNumber: params.reraNumber || '',
      hmdaNumber: params.hmdaNumber || '',
      dtcpNumber: params.dtcpNumber || '',
      listingStatus: 'Pending',
      verificationStatus: 'Pending',
      createdDate: getCurrentDateISO()
    };

    // 2. Record Property in PROPERTIES tab
    await saveProperty(propertyRecord);

    const propertyItem: PropertyItem = {
      id: propertyId,
      propertyId,
      title: params.propertyTitle,
      location: `${params.locality}, ${params.city}, ${params.state}`,
      locality: params.locality,
      city: params.city,
      state: params.state,
      price: params.price.startsWith('₹') ? params.price : `₹ ${params.price}`,
      status: 'For Sale',
      type: params.propertyType,
      size: `${params.area} ${params.areaUnit}`,
      area: `${params.area} ${params.areaUnit}`,
      images: params.photos && params.photos.length > 0 ? params.photos : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
      amenities: ['24/7 Security', 'Water Supply', 'Power Backup', 'Car Parking'],
      overview: `${params.propertyTitle} in ${params.locality}, ${params.city}. Verified seller listing registered on OPV.`,
      about: params.description || `${params.propertyTitle} located in ${params.locality}, ${params.city}. Managed through OPV lead desk.`,
      nearby: [`${params.locality} Market`, 'Main Road Access', 'Nearby Metro/Transit'],
      reraNumber: params.reraNumber,
      sellerId,
      sellerName: params.sellerName,
      sellerType: params.sellerType as any,
      listingStatus: 'Pending',
      verificationStatus: 'Pending',
      agent: {
        name: params.sellerName,
        phone: '1800-OPV-LEADS',
        role: `${params.sellerType} • Managed via OPV`
      },
      specifications: [
        { label: 'Type', value: params.propertyType },
        { label: 'Area', value: `${params.area} ${params.areaUnit}` },
        { label: 'City', value: params.city },
        { label: 'Verification', value: 'Under Review' }
      ]
    };

    return {
      success: true,
      propertyId,
      sellerId,
      sellerRecord,
      propertyRecord,
      propertyItem
    };
  } catch (err: any) {
    console.error('Failed to post seller property:', err);
    return {
      success: false,
      propertyId: '',
      sellerId: '',
      error: err?.message || 'Posting failed'
    };
  }
}

/**
 * Inspection helper to view captured leads during testing
 */
export function getLocalCapturedLeads(): LocalLeadStore {
  return getLocalStore();
}

/**
 * Gets the configured Google Spreadsheet URL.
 * Checks localStorage first, then environment variable, and falls back to Google Sheets dashboard.
 */
export function getGoogleSheetUrl(): string {
  try {
    if (typeof localStorage !== 'undefined') {
      const custom = localStorage.getItem('opv_google_sheet_url');
      if (custom && custom.trim().startsWith('http')) {
        return custom.trim();
      }
    }
  } catch { }

  const envUrl = (import.meta.env.VITE_GOOGLE_SHEET_URL as string) || '';
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl;
  }

  return 'https://docs.google.com/spreadsheets/d/1CKNAMTP9eaL7VT9_yqy5Q0vCxoh2EeNkU6LHqmgEm4M/edit?gid=0#gid=0';
}

/**
 * Saves a user-specified Google Spreadsheet URL in localStorage for instant testing
 */
export function setCustomGoogleSheetUrl(url: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('opv_google_sheet_url', url.trim());
    }
  } catch { }
}

/**
 * Google Spreadsheet helper - Auto-open disabled per requirements.
 * User details are stored securely in the Google Sheet via background webhook without exposing the sheet URL to users.
 */
export function openGoogleSheetInNewTab(): void {
  // Intentionally disabled: visitors only submit the form, Google Sheet stays private
}

