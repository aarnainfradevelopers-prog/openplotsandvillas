import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';
import { PropertyItem } from '../types/chat';
import { submitPropertyLead } from '../services/supabaseService';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: PropertyItem | null;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Free Site Visit with AC Cab Facility');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    const rawId = property?.id?.replace(/^db-/, '');
    const propIdNum = rawId && !isNaN(Number(rawId)) ? Number(rawId) : null;

    try {
      await submitPropertyLead({
        name: fullName,
        phone: phoneNumber,
        email: email || undefined,
        property_id: propIdNum,
        message: `Service: ${serviceType}. ${preferredDate ? 'Preferred Date: ' + preferredDate + '. ' : ''}${notes ? 'Notes: ' + notes + '. ' : ''}Property: ${property?.title || 'General Influx'}`
      });
    } catch (err) {
      console.warn('Failed to submit lead to Supabase:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello OPV Team, I am interested in ${property?.title || 'Open Plots & Villas'}${property?.location ? ' located at ' + property.location : ''
    } (${property?.price || ''}). Please share details and arrange a site visit.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Modal Dialog: Slightly wider (~480px) and clean natural height */}
      <div
        className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full flex flex-col overflow-hidden text-slate-900 dark:text-white relative my-auto max-h-[92vh]"
        style={{ maxWidth: '480px' }}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm  px] text-slate-300">Open Plots &amp; Villas • Hyderabad</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Property Banner */}
        {property && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200/90 dark:border-emerald-800/40 px-4.5 py-3 sm:py-3.5 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0 shadow-2xs">
                <Building className="w-5 h-5 text-emerald-950 dark:text-emerald-200" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white truncate leading-snug">
                  {property.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
              </div>
            </div>
            <div className="text-sm sm:text-[15px] font-extrabold text-slate-950 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border-2 border-emerald-300 dark:border-emerald-600 shadow-2xs shrink-0 tracking-tight">
              {property.price}
            </div>
          </div>
        )}

        {submitted ? (
          <div className="p-6 text-center flex flex-col items-center justify-center space-y-3 flex-1 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Enquiry Submitted!</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
              Thank you, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. Our senior property advisor will contact you at <strong className="text-slate-900 dark:text-white">{phoneNumber}</strong> shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-7 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-2.5 overflow-y-auto scrollbar-thin">
            {/* Quick Action Buttons (WhatsApp / Call) */}
            <div className="grid grid-cols-2 gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <a
                href={`https://wa.me/919963513939?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Now</span>
              </a>
              <a
                href="tel:+919963513939"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-2xs transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Advisor</span>
              </a>
            </div>

            {/* Name & Phone in 2 clean columns */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Service Required */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Required
              </label>
              <select
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Free Site Visit with Cab Facility">Free Site Visit with AC Cab Facility</option>
                <option value="Price Sheet & Cost Breakup">Price Sheet &amp; Complete Cost Breakup</option>
                <option value="Legal & EC Title Verification">Legal Document &amp; 30-Yr EC Verification</option>
                <option value="Home Loan Eligibility Check">Home Loan Eligibility Check (SBI/HDFC)</option>
                <option value="Instant Agent Call Back">Instant Agent Call Back</option>
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Date for Site Visit / Discussion</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Questions / Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Questions / Specific Requirements
              </label>
              <textarea
                rows={2}
                placeholder="Mention budget, preferred facing, or any questions..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-14"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-1.5 pb-0.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Property Enquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
