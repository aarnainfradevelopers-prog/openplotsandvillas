import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Building,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { PropertyItem } from '../types/chat';

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
  const [serviceType, setServiceType] = useState('Free Site Visit with Cab Facility');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) {
      alert('Please provide your name and contact phone number.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 3 seconds or keep confirmed
    }, 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello OPV Team, I am interested in ${property?.title || 'Open Plots & Villas'}${
      property?.location ? ' located at ' + property.location : ''
    } (${property?.price || ''}). Please share details and arrange a site visit.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden text-slate-900 relative">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eab308] text-slate-950 flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Property Enquiry & Site Visit</h3>
              <p className="text-xs text-slate-300">Open Plots & Villas • Hyderabad</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Property Banner */}
        {property && (
          <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-md bg-amber-200/70 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4 text-amber-900" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {property.title}
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-extrabold text-slate-950 bg-white px-2.5 py-1 rounded-md border border-amber-300 shadow-xs shrink-0">
              {property.price}
            </div>
          </div>
        )}

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Enquiry Submitted Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm">
              Thank you, <strong className="text-slate-900">{fullName}</strong>. Our senior property advisor will call you at <strong className="text-slate-900">{phoneNumber}</strong> shortly with brochures and site visit scheduling.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
            {/* Quick Action Buttons (Call / WhatsApp) */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <a
                href={`https://wa.me/919100964606?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Now</span>
              </a>
              <a
                href="tel:+919100964606"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Advisor</span>
              </a>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308] focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308] focus:border-transparent"
              />
            </div>

            {/* Interested In */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Required
              </label>
              <select
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#eab308]"
              >
                <option value="Free Site Visit with Cab Facility">Free Site Visit with AC Cab Facility</option>
                <option value="Price Sheet & Cost Breakup">Price Sheet & Complete Cost Breakup</option>
                <option value="Legal & EC Title Verification">Legal Document & 30-Yr EC Verification</option>
                <option value="Home Loan Eligibility Check">Home Loan Eligibility Check (SBI/HDFC)</option>
                <option value="Instant Agent Call Back">Instant Agent Call Back</option>
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Date for Site Visit / Discussion</span>
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#eab308]"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Questions / Specific Requirements
              </label>
              <textarea
                rows={2}
                placeholder="Mention budget, preferred facing, or any questions..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308]"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Property Enquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
