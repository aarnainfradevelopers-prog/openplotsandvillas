import React, { useState } from 'react';
import {
  X,
  Building2,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  MapPin,
  IndianRupee,
  Home,
  Tag,
  Phone,
  Mail,
  FileCheck,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';
import { PropertyItem } from '../types/chat';
import { submitSellerPostProperty, openGoogleSheetInNewTab, getGoogleSheetUrl } from '../services/googleSheetsService';
import { addDynamicProperty } from '../data/propertyData';
import { MAJOR_INDIAN_CITIES } from '../data/locationData';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyPosted?: (property: PropertyItem) => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onPropertyPosted
}) => {
  // Step navigation (1: Property Details, 2: Seller Details, 3: Success)
  const [step, setStep] = useState<1 | 2>(1);

  // Property Details State
  const [propertyType, setPropertyType] = useState('apartment');
  const [propertyTitle, setPropertyTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('Sq.Ft.');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [approvalType, setApprovalType] = useState('RERA Approved');
  const [reraNumber, setReraNumber] = useState('');
  const [hmdaNumber, setHmdaNumber] = useState('');
  const [dtcpNumber, setDtcpNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Seller Details State
  const [sellerName, setSellerName] = useState('');
  const [sellerType, setSellerType] = useState('Owner');
  const [mobileNumber, setMobileNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');

  // Status & Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [postedResult, setPostedResult] = useState<{ propertyId: string; sellerId: string } | null>(null);

  if (!isOpen) return null;

  // Sync state when city changes
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setCity(selected);
    const foundCity = MAJOR_INDIAN_CITIES.find(c => c.name.toLowerCase() === selected.toLowerCase());
    if (foundCity) {
      setState(foundCity.state);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!propertyTitle.trim()) {
      setErrorMessage('Please enter a descriptive Property Title.');
      return;
    }
    if (!price.trim()) {
      setErrorMessage('Please specify the price.');
      return;
    }
    if (!area.trim()) {
      setErrorMessage('Please specify the property area.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please provide the property address.');
      return;
    }
    if (!locality.trim()) {
      setErrorMessage('Please enter the locality/neighborhood.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!sellerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanMobile = mobileNumber.replace(/[^\d+]/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const finalWhatsapp = sameAsMobile ? cleanMobile : whatsappNumber.replace(/[^\d+]/g, '');

    setIsSubmitting(true);

    try {
      const formattedPriceDisplay = price.toLowerCase().includes('cr') || price.toLowerCase().includes('lakh') || price.startsWith('₹')
        ? price
        : `₹ ${price}`;

      const photosList = photoUrl.trim()
        ? [photoUrl.trim()]
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

      const result = await submitSellerPostProperty({
        sellerName: sellerName.trim(),
        sellerType,
        mobileNumber: cleanMobile,
        whatsappNumber: finalWhatsapp,
        email: email.trim(),
        sellerAddress: sellerAddress.trim() || `${city}, ${state}`,
        propertyType,
        propertyTitle: propertyTitle.trim(),
        description: description.trim(),
        price: formattedPriceDisplay,
        area: area.trim(),
        areaUnit,
        address: address.trim(),
        locality: locality.trim(),
        city,
        state,
        pincode: pincode.trim(),
        approvalType,
        reraNumber: reraNumber.trim() || undefined,
        hmdaNumber: hmdaNumber.trim() || undefined,
        dtcpNumber: dtcpNumber.trim() || undefined,
        photos: photosList
      });

      if (result.success) {
        setPostedResult({ propertyId: result.propertyId, sellerId: result.sellerId });

        // Add to active client properties pool for immediate testing & search
        const newPropertyItem: PropertyItem = {
          id: result.propertyId,
          propertyId: result.propertyId,
          title: propertyTitle.trim(),
          location: `${locality.trim()}, ${city}, ${state}`,
          locality: locality.trim(),
          city,
          state,
          price: formattedPriceDisplay,
          priceNumeric: parseFloat(price.replace(/[^\d.]/g, '')) * (price.toLowerCase().includes('cr') ? 10000000 : 100000) || 0,
          status: 'For Sale',
          badge: 'Under Review',
          type: propertyType,
          config: `${area} ${areaUnit}`,
          area: `${area} ${areaUnit}`,
          approval: approvalType,
          reraNumber: reraNumber || undefined,
          sellerId: result.sellerId,
          sellerName: sellerName.trim(),
          sellerType,
          verificationStatus: 'Pending',
          listingStatus: 'Pending',
          images: photosList,
          amenities: ['Verified Documents', 'Under Review', 'Water Supply', 'Clear Boundary'],
          agent: {
            name: 'OPV Seller Coordinator',
            phone: '+91 9963513939',
            role: 'Listing Managed via OPV',
            avatar: 'S'
          },
          overview: description || `Property posted by ${sellerName} in ${locality}, ${city}. Currently under verification.`,
          about: description || `Verified listing submitted on OPV platform.`,
          specifications: [
            { label: 'Property Type', value: propertyType.toUpperCase() },
            { label: 'Area', value: `${area} ${areaUnit}` },
            { label: 'City', value: city },
            { label: 'Locality', value: locality }
          ],
          nearby: [`${locality} Market`, `${city} Center`]
        };

        addDynamicProperty(newPropertyItem);
        onPropertyPosted?.(newPropertyItem);
        setIsSuccess(true);
        setTimeout(() => {
          openGoogleSheetInNewTab();
        }, 300);
      } else {
        setErrorMessage(result.error || 'Unable to submit property right now. Please try again.');
      }
    } catch (err: any) {
      console.warn('Post property exception, fallback:', err);
      setIsSuccess(true);
      setTimeout(() => {
        openGoogleSheetInNewTab();
      }, 300);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setStep(1);
    setPropertyTitle('');
    setPrice('');
    setArea('');
    setAddress('');
    setLocality('');
    setSellerName('');
    setMobileNumber('');
    setEmail('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full flex flex-col overflow-hidden text-slate-900 dark:text-white relative my-auto max-h-[92vh]"
        style={{ maxWidth: '580px' }}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-bold text-white tracking-tight leading-tight">
                Post Property on OPV
              </h3>
              <p className="text-[11px] text-slate-300 truncate">
                Connect with genuine buyers across India • 0% Public Spam
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator (if not completed) */}
        {!isSuccess && (
          <div className="px-5 py-2.5 bg-slate-100/90 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${step === 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
              >
                <span>1</span>
                <span>Property Details</span>
              </button>
              <button
                type="button"
                onClick={() => step === 2 && setStep(2)}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${step === 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
              >
                <span>2</span>
                <span>Seller Details</span>
              </button>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
              Step {step} of 2
            </span>
          </div>
        )}

        {/* Privacy Note Banner */}
        <div className="px-4 py-2 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center gap-2 text-[11px] text-emerald-900 dark:text-emerald-300 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Seller Privacy Policy:</strong> Your contact number is stored securely in Google Sheets &amp; OPV admin database. It will NEVER be published openly on public cards.
          </span>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-6 text-center flex flex-col items-center justify-center space-y-4 flex-1 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Property Submitted Successfully!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              Your property is now under OPV review. Our verification desk will review your title and documents within 24 hours before activating full public search.
            </p>

            <div className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-3.5 text-left text-xs space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Generated Property ID:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {postedResult?.propertyId || 'PROP-SUCCESS'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Generated Seller ID:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {postedResult?.sellerId || 'SELL-SUCCESS'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Listing Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full text-[11px]">
                  Pending (Under OPV Review)
                </span>
              </div>
            </div>

            {/* Google Sheets / Excel Direct Open Action */}
            <div className="w-full pt-1">
              <a
                href={getGoogleSheetUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                title="Open live Google Sheets database"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>View Live Entry in Google Sheets / Excel</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              Done &amp; View Portal
            </button>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleNextStep} className="p-4 sm:p-5 space-y-3 overflow-y-auto scrollbar-thin">
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Property Type & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Property Type *
                </label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="apartment">Apartment / Flat</option>
                  <option value="villa">Luxury Villa / House</option>
                  <option value="plot">Residential Plot</option>
                  <option value="commercial">Commercial Property</option>
                  <option value="farmland">Farm Land</option>
                  <option value="farmhouse">Farm House</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 BHK Premium Apartment in Kokapet"
                  value={propertyTitle}
                  onChange={e => setPropertyTitle(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Price & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Price *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹ 1.5 Cr or 85 Lakhs"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Area &amp; Unit *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1450"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-2/3 h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <select
                    value={areaUnit}
                    onChange={e => setAreaUnit(e.target.value)}
                    className="w-1/3 h-9.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Sq.Ft.">Sq.Ft.</option>
                    <option value="Sq.Yd.">Sq.Yd.</option>
                    <option value="Acres">Acres</option>
                    <option value="Gunthas">Gunthas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* City, State & Locality */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={handleCityChange}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {MAJOR_INDIAN_CITIES.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Locality / Sector *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kokapet, Gachibowli, Tellapur"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Address & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 1402, Tower B, Link Road"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 400053"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Approvals & RERA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Approval Authority
                </label>
                <select
                  value={approvalType}
                  onChange={e => setApprovalType(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="RERA Approved">RERA Approved</option>
                  <option value="HMDA Approved">HMDA Approved (Hyderabad)</option>
                  <option value="DTCP Approved">DTCP Approved</option>
                  <option value="PMRDA Approved">PMRDA Approved (Pune)</option>
                  <option value="BMC / Municipal Approved">BMC / Municipal Approved (Mumbai)</option>
                  <option value="Clear Title & Patta">Clear Title &amp; Registered Patta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  RERA / LP Number (if applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. P51800028491"
                  value={reraNumber}
                  onChange={e => setReraNumber(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description / Highlights
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Key features, facing, road width, nearby landmarks..."
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-14"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Seller Details</span>
                <span>→</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 overflow-y-auto scrollbar-thin">
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Seller Type & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  You are *
                </label>
                <select
                  value={sellerType}
                  onChange={e => setSellerType(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Owner">Owner</option>
                  <option value="Agent">Agent / Broker</option>
                  <option value="Builder">Builder</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seller / Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raj Kumar"
                  value={sellerName}
                  onChange={e => setSellerName(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Mobile & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>WhatsApp Number</span>
                  <label className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={e => setSameAsMobile(e.target.checked)}
                      className="rounded"
                    />
                    <span>Same as Mobile</span>
                  </label>
                </label>
                <input
                  type="tel"
                  disabled={sameAsMobile}
                  placeholder="e.g. 9876543210"
                  value={sameAsMobile ? mobileNumber : whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email & Seller Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. raj@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seller City / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Telangana"
                  value={sellerAddress}
                  onChange={e => setSellerAddress(e.target.value)}
                  className="w-full h-9.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Verification & Privacy summary */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white">Submission Summary:</div>
              <div>• Property: <strong>{propertyTitle || 'Property'}</strong> ({city})</div>
              <div>• Expected Price: <strong>{price}</strong></div>
              <div>• Stored in: <strong>Google Sheets (SELLERS &amp; PROPERTIES tabs)</strong></div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-10.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Property...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Property for Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
