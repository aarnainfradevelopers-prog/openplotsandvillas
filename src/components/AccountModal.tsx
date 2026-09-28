import React, { useState } from 'react';
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle2,
  Save
} from 'lucide-react';
import { UserAccount } from '../types/chat';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount;
  onSaveAccount: (updated: UserAccount) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaveAccount
}) => {
  const [formData, setFormData] = useState<UserAccount>({ ...account });
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAccount(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-slate-900 relative">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
              AD
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Account & Investor Profile</h3>
              <p className="text-xs text-slate-300">Open Plots & Villas Hyderabad</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showSavedToast && (
          <div className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Full Name & Company */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name / Entity Name</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Phone</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308]"
            />
          </div>

          {/* Preferred Property Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Investment Interest
            </label>
            <select
              value={formData.preferredType}
              onChange={e => setFormData({ ...formData, preferredType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#eab308]"
            >
              <option value="Open Plots & Commercial Lands">Open Plots & Commercial Lands (HMDA/DTCP)</option>
              <option value="Gated Community Luxury Villas">Gated Community Luxury Villas</option>
              <option value="High-Rise Apartments">High-Rise Apartments (2, 3 & 4 BHK)</option>
              <option value="All Real Estate Investments">All Real Estate Investments</option>
            </select>
          </div>

          {/* Preferred Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Preferred Hyderabad Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lemoor, Mokila, Shadnagar, Kollur, Financial District"
              value={formData.preferredLocation}
              onChange={e => setFormData({ ...formData, preferredLocation: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#eab308]"
            />
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Budget Bracket</span>
            </label>
            <select
              value={formData.budgetRange}
              onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#eab308]"
            >
              <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs (Open Plots)</option>
              <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
              <option value="₹1 Crore - ₹2.5 Crores">₹1 Crore - ₹2.5 Crores (Apartments/Villas)</option>
              <option value="₹2.5 Crores+">₹2.5 Crores+ (Luxury Gated Villas)</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-[#eab308]" />
              <span>Save Account Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
