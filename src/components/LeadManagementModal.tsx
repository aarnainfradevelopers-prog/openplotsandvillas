import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  Users,
  MessageSquare,
  Building,
  RefreshCw
} from 'lucide-react';
import {
  getLocalCapturedLeads,
  getGoogleSheetUrl,
  isGoogleSheetsWebhookConfigured
} from '../services/googleSheetsService';

interface LeadManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'BUYERS' | 'ENQUIRIES' | 'SELLERS' | 'PROPERTIES';

export const LeadManagementModal: React.FC<LeadManagementModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('BUYERS');
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(0);

  if (!isOpen) return null;

  const leads = getLocalCapturedLeads();

  const handleCopyForGoogleSheets = () => {
    let tsv = '';
    if (activeTab === 'BUYERS') {
      const headers = [
        'Property ID', 'Name', 'Email', 'Contact Number', 'Property Title',
        'Property Location', 'Property Budget', 'City', 'Source', 'Enquiry Date',
        'Time', 'Lead Status', 'Assigned To', 'Notes/Messages'
      ];
      const rows = leads.buyers.map((b: any) => [
        b.propertyId || '',
        b.name || b.buyerName || '',
        b.email || '',
        b.contactNumber || b.phoneNumber || b.phone || '',
        b.propertyTitle || '',
        b.propertyLocation || b.preferredLocation || '',
        b.propertyBudget || b.budget || '',
        b.city || 'Hyderabad',
        b.source || 'OPV Chatbot',
        b.enquiryDate || '',
        b.time || '',
        b.leadStatus || 'New',
        b.assignedTo || 'Unassigned',
        b.notesMessages || [b.notes, b.message].filter(Boolean).join(' | ') || ''
      ]);
      tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    } else if (activeTab === 'ENQUIRIES') {
      const headers = [
        'Enquiry ID', 'Buyer Lead ID', 'Buyer Name', 'Buyer Phone', 'Property ID',
        'Property Title', 'Seller ID', 'Seller Name', 'Enquiry Type', 'Message',
        'Date', 'Time', 'Status', 'Assigned To', 'Follow Up Date', 'Notes'
      ];
      const rows = leads.enquiries.map(e => [
        e.enquiryId, e.buyerLeadId, e.buyerName, e.buyerPhone, e.propertyId,
        e.propertyTitle, e.sellerId, e.sellerName, e.enquiryType, e.message,
        e.date, e.time, e.status, e.assignedTo, e.followUpDate, e.notes
      ]);
      tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    } else if (activeTab === 'SELLERS') {
      const headers = [
        'Seller ID', 'Seller Name', 'Seller Type', 'Mobile Number', 'WhatsApp Number',
        'Email', 'Seller Address', 'Property ID', 'Property Type', 'Property Title',
        'Property Address', 'City', 'State', 'Created Date', 'Verification Status', 'Listing Status'
      ];
      const rows = leads.sellers.map(s => [
        s.sellerId, s.sellerName, s.sellerType, s.mobileNumber, s.whatsappNumber,
        s.email, s.sellerAddress, s.propertyId, s.propertyType, s.propertyTitle,
        s.propertyAddress, s.city, s.state, s.createdDate, s.verificationStatus, s.listingStatus
      ]);
      tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    } else {
      const headers = [
        'Property ID', 'Property Type', 'Property Title', 'Price', 'Area', 'Area Unit',
        'Address', 'Locality', 'City', 'State', 'Pincode', 'Seller ID', 'Seller Name',
        'Approval Type', 'RERA Number', 'HMDA Number', 'DTCP Number', 'Listing Status',
        'Verification Status', 'Created Date'
      ];
      const rows = leads.properties.map(p => [
        p.propertyId, p.propertyType, p.propertyTitle, p.price, p.area, p.areaUnit,
        p.address, p.locality, p.city, p.state, p.pincode, p.sellerId, p.sellerName,
        p.approvalType, p.reraNumber, p.hmdaNumber, p.dtcpNumber, p.listingStatus,
        p.verificationStatus, p.createdDate
      ]);
      tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    }

    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    let csv = '';
    const escapeCsv = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;

    if (activeTab === 'BUYERS') {
      const headers = [
        'Property ID', 'Name', 'Email', 'Contact Number', 'Property Title',
        'Property Location', 'Property Budget', 'City', 'Source', 'Enquiry Date',
        'Time', 'Lead Status', 'Assigned To', 'Notes/Messages'
      ];
      const rows = leads.buyers.map((b: any) => [
        b.propertyId || '',
        b.name || b.buyerName || '',
        b.email || '',
        b.contactNumber || b.phoneNumber || b.phone || '',
        b.propertyTitle || '',
        b.propertyLocation || b.preferredLocation || '',
        b.propertyBudget || b.budget || '',
        b.city || 'Hyderabad',
        b.source || 'OPV Chatbot',
        b.enquiryDate || '',
        b.time || '',
        b.leadStatus || 'New',
        b.assignedTo || 'Unassigned',
        b.notesMessages || [b.notes, b.message].filter(Boolean).join(' | ') || ''
      ]);
      csv = [headers.map(escapeCsv).join(','), ...rows.map(r => r.map(escapeCsv).join(','))].join('\n');
    } else if (activeTab === 'ENQUIRIES') {
      const headers = [
        'Enquiry ID', 'Buyer Lead ID', 'Buyer Name', 'Buyer Phone', 'Property ID',
        'Property Title', 'Seller ID', 'Seller Name', 'Enquiry Type', 'Message',
        'Date', 'Time', 'Status', 'Assigned To', 'Follow Up Date', 'Notes'
      ];
      const rows = leads.enquiries.map(e => [
        e.enquiryId, e.buyerLeadId, e.buyerName, e.buyerPhone, e.propertyId,
        e.propertyTitle, e.sellerId, e.sellerName, e.enquiryType, e.message,
        e.date, e.time, e.status, e.assignedTo, e.followUpDate, e.notes
      ]);
      csv = [headers.map(escapeCsv).join(','), ...rows.map(r => r.map(escapeCsv).join(','))].join('\n');
    } else {
      csv = 'No data';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `OPV_${activeTab}_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buyersCount = leads.buyers.length;
  const enquiriesCount = leads.enquiries.length;
  const sellersCount = leads.sellers.length;
  const propertiesCount = leads.properties.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full flex flex-col overflow-hidden text-slate-900 dark:text-white relative my-auto max-h-[92vh]"
        style={{ maxWidth: '960px' }}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight flex items-center gap-2">
                <span>OPV Lead Management Database</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Buffer
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                All buyer enquiries, numbers viewed, and seller posts captured in real time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('BUYERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'BUYERS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads Information ({buyersCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ENQUIRIES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ENQUIRIES'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>ENQUIRIES ({enquiriesCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SELLERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SELLERS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>SELLERS ({sellersCount})</span>
            </button>
          </div>

          {/* Export & Sync Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTick(t => t + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
              title="Refresh leads list"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCopyForGoogleSheets}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Copy formatted table to paste directly into Google Sheets (Ctrl+V into cell A1)"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy for Google Sheets'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Download CSV spreadsheet file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <a
              href={getGoogleSheetUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-auto p-4 max-h-[58vh]">
          {activeTab === 'BUYERS' && (
            buyersCount === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No buyer leads submitted yet.</p>
                <p className="text-xs text-slate-500 mt-1">Submit the View Number or Contact Agent form to test.</p>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-200 font-bold border-b border-emerald-200 dark:border-emerald-800">
                    <tr>
                      <th className="p-3">Property ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Contact Number</th>
                      <th className="p-3">Property Title</th>
                      <th className="p-3">Property Location</th>
                      <th className="p-3">Property Budget</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Enquiry Date</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Lead Status</th>
                      <th className="p-3">Assigned To</th>
                      <th className="p-3">Notes/Messages</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leads.buyers.map((b: any, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono text-[11px] text-slate-500">{b.propertyId || '—'}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{b.name || b.buyerName || '—'}</td>
                        <td className="p-3 text-slate-500">{b.email || '—'}</td>
                        <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{b.contactNumber || b.phoneNumber || b.phone || '—'}</td>
                        <td className="p-3 text-slate-800 dark:text-slate-200 max-w-[200px] truncate" title={b.propertyTitle}>
                          {b.propertyTitle || 'General Listing'}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{b.propertyLocation || b.preferredLocation || '—'}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{b.propertyBudget || b.budget || '—'}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{b.city || 'Hyderabad'}</td>
                        <td className="p-3 text-slate-500">{b.source || 'OPV Chatbot'}</td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{b.enquiryDate || '—'}</td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{b.time || '—'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                            {b.leadStatus || 'New'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{b.assignedTo || 'Unassigned'}</td>
                        <td className="p-3 text-slate-500 max-w-[220px] truncate" title={b.notesMessages || b.notes || b.message}>
                          {b.notesMessages || b.notes || b.message || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {activeTab === 'ENQUIRIES' && (
            enquiriesCount === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No enquiries recorded yet.</p>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-200 font-bold border-b border-emerald-200 dark:border-emerald-800">
                    <tr>
                      <th className="p-3">Enquiry ID</th>
                      <th className="p-3">Buyer Lead ID</th>
                      <th className="p-3">Buyer Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Enquiry Type</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leads.enquiries.map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{e.enquiryId}</td>
                        <td className="p-3 font-mono text-slate-500">{e.buyerLeadId}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{e.buyerName}</td>
                        <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{e.buyerPhone}</td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">{e.enquiryType}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 max-w-[220px] truncate" title={e.message}>
                          {e.message}
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{e.date} {e.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {activeTab === 'SELLERS' && (
            sellersCount === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Building className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No seller listings registered yet.</p>
              </div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-200 font-bold border-b border-emerald-200 dark:border-emerald-800">
                    <tr>
                      <th className="p-3">Seller ID</th>
                      <th className="p-3">Seller Name</th>
                      <th className="p-3">Mobile</th>
                      <th className="p-3">Property Title</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leads.sellers.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{s.sellerId}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{s.sellerName}</td>
                        <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{s.mobileNumber}</td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">{s.propertyTitle}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{s.city}</td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{s.createdDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* Footer info tip */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <p>
            💡 <strong>Quick Google Sheet Paste:</strong> Click <em>"Copy for Google Sheets"</em>, open cell A1 in your Google Sheet, and press <strong>Ctrl + V</strong>.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
