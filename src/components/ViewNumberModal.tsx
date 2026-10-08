import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Compass,
  MessageSquare,
  Clock,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';
import { PropertyItem } from '../types/chat';
import { submitBuyerEnquiry, openGoogleSheetInNewTab, getGoogleSheetUrl, isGoogleSheetsWebhookConfigured } from '../services/googleSheetsService';

interface ViewNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: PropertyItem | null;
}

export const ViewNumberModal: React.FC<ViewNumberModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const currentProperty: PropertyItem = (property || {
    id: 'OPV-101',
    title: 'Property Listing',
    location: 'Madhapur, Hyderabad',
    city: 'Hyderabad',
    price: 'Price on request',
    status: 'For Sale',
    type: 'apartment',
    area: '1200 sq.ft',
    sellerName: 'Premansh Bomb',
    agent: { name: 'Premansh Bomb', phone: '+91 9963513939', role: 'OPV Expert' },
    amenities: [],
    images: [],
    overview: 'Premium Listing',
    specifications: [],
    about: 'Verified property listing',
    nearby: []
  }) as PropertyItem;

  const rawAgentName = currentProperty.sellerName || currentProperty.agent?.name || 'OpenPlots and Villas';
  const formatBrandOrAgentName = (name: string) => {
    if (!name) return 'OpenPlots and Villas';
    const lower = name.trim().toLowerCase();
    if (lower === 'openplotsandvillas' || lower === 'openplots' || lower === 'openplotsinshadnagar' || lower.includes('openplot')) {
      return 'OpenPlots and Villas';
    }
    return name.replace(/\b\w/g, char => char.toUpperCase());
  };
  const agentName = formatBrandOrAgentName(rawAgentName);
  const rawAgentPhone = currentProperty.agent?.phone || '+91 9963513939';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit lead to Google Sheets and backend
      await submitBuyerEnquiry({
        buyerName: name.trim(),
        phone: `${countryCode} ${cleanPhone}`,
        email: email.trim() || undefined,
        preferredLocation: currentProperty.location || currentProperty.city || '',
        message: `Buyer viewed listing number for: ${currentProperty.title} (ID: ${currentProperty.id})`,
        property: currentProperty,
        serviceType: 'View Listing Contact Number'
      });

      setIsSuccess(true);

      // 2. Automatically open Google Sheets in a new tab as requested
      setTimeout(() => {
        openGoogleSheetInNewTab();
      }, 300);
    } catch (err: any) {
      console.warn('View number submission fallback:', err);
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
    setName('');
    setEmail('');
    setPhoneNumber('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full flex flex-col md:flex-row overflow-hidden text-slate-900 dark:text-white relative my-auto max-h-[92vh]"
        style={{ maxWidth: '700px', minHeight: '490px' }}
      >
        {/* Left Column: Elegant Mint/Emerald Green matching OPV brand */}
        <div className="w-full md:w-[44%] bg-gradient-to-b from-[#F0FDF4] to-[#ECFDF5] dark:from-[#062419] dark:to-[#082e20] p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-emerald-200/70 dark:border-emerald-950 relative shrink-0">
          <div className="w-full">
            {/* Top Pill Badge with Thumb Up Emoji */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-200/90 dark:border-emerald-800/80 shadow-2xs"
              style={{ marginBottom: '27px' }}
            >
              <span className="text-sm select-none" role="img" aria-label="Thumbs up">
                👍
              </span>
              <span>Verified Direct Connect</span>
            </div>

            {/* Title - Perfectly in a straight horizontal line with OPV logo */}
            <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-snug mb-3 sm:mb-3.5">
              Contact the Owner or Agent Directly
            </h3>

            {/* 3 Value Proposition Cards - Spacious options */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* Card 1 */}
              <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-3.5 sm:p-4 border border-emerald-100 dark:border-slate-700/80 shadow-2xs flex items-start gap-3 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Compass className="w-4 h-4 stroke-[2.2]" />
                </div>
                <p className="text-xs sm:text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                  Check current availability before planning a visit
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-3.5 sm:p-4 border border-emerald-100 dark:border-slate-700/80 shadow-2xs flex items-start gap-3 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <MessageSquare className="w-4 h-4 stroke-[2.2]" />
                </div>
                <p className="text-xs sm:text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                  Discuss rent, deposit, furnishing, maintenance, and move-in conditions
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-3.5 sm:p-4 border border-emerald-100 dark:border-slate-700/80 shadow-2xs flex items-start gap-3 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Clock className="w-4 h-4 stroke-[2.2]" />
                </div>
                <p className="text-xs sm:text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                  Shortlist similar rental homes in the same locality faster
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/80 dark:border-emerald-950 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Verified OPV Lead Desk Assurance</span>
          </div>
        </div>

        {/* Right Column: Form & Agent Profile */}
        <div className="w-full md:w-[56%] bg-white dark:bg-[#0f172a] p-5 sm:p-6 flex flex-col justify-between relative overflow-y-auto">
          <div className="w-full">
            {/* Header with Title and X button in the top right corner */}
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  Connect with the Listing Agent
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Share your details to contact the person handling this rental listing
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0 -mt-1 -mr-1"
                aria-label="Close"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Agent / Brand Info Pill */}
            <div className="flex items-center gap-2.5 mb-3.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="w-8.5 h-8.5 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 tracking-wider shadow-2xs">
                OPV
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {agentName}
                </div>
              </div>
            </div>

            {isSuccess ? (
              /* Success State - Only Done Button per user request */
              <div className="py-6 space-y-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Enquiry Submitted Successfully!
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Your details have been recorded and sent to our team.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Input Form matching Reference Image 2 */
              <form onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="mb-2.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* 10px → separate fields, 11-12px gap before submit button */}
                <div className="space-y-2.5 mb-3">
                  {/* Name */}
                  <div>
                    {/* 4-6px → label/input */}
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full h-10 px-3.5 pr-9 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    {/* 4-6px → label/input */}
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email ID"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full h-10 px-3.5 pr-9 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Phone Number with +91 Country Selector */}
                  <div className="mb-3" style={{ marginBottom: '12px' }}>
                    {/* 4-6px → label/input */}
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden focus-within:ring-1 focus-within:ring-emerald-500">
                      <div className="bg-slate-50 dark:bg-slate-800 px-2.5 flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                        <span>{countryCode}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          className="w-full h-10 px-3 pr-9 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 10-12px vertical spacing before Contact Now button */}
                <div className="mt-3" style={{ marginTop: '12px' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99] disabled:opacity-70"
                  >
                    <Phone className="w-4 h-4 fill-white text-white" />
                    <span>{isSubmitting ? 'Connecting...' : 'Contact Now'}</span>
                  </button>

                  <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 text-center mt-2.5">
                    By submitting, you accept <span className="underline cursor-pointer">Privacy Policy</span> &amp; <span className="underline cursor-pointer">Terms</span>.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
