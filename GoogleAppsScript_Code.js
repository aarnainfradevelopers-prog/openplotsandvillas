/**
 * OPV REAL ESTATE LEAD MANAGEMENT WEBHOOK (SINGLE UNIFIED SHEET: "Leads information")
 * 
 * Setup Instructions in Google Sheets:
 * 1. In your Google Sheet, click Extensions -> Apps Script
 * 2. Delete all existing code and paste this entire file
 * 3. Press Ctrl + S (Save)
 * 4. Click "Deploy" -> "Manage deployments" -> Edit (pencil icon) -> Set "Who has access" to "Anyone" -> Deploy
 *    (Or click "Deploy" -> "New deployment" -> Select type "Web app" -> Set "Who has access" to "Anyone" -> Deploy)
 * 5. Copy the Web App URL and set it in your .env as VITE_GOOGLE_SHEETS_WEBHOOK_URL
 *
 * NOTE: Both "View Number" button and "Contact Agent" button form data will now
 * automatically go into the single sheet named: "Leads information"
 */

const HEADERS = {
  LEADS_INFORMATION: [
    'Buyer Lead ID', 'Buyer Name', 'Email', 'Phone Number', 'City',
    'Preferred Location', 'Property Type', 'Budget', 'Message', 'Property ID',
    'Property Title', 'Source', 'Enquiry Date', 'Lead Status', 'Assigned To', 'Notes'
  ],
  SELLERS: [
    'Seller ID', 'Seller Name', 'Seller Type', 'Mobile Number', 'WhatsApp Number',
    'Email', 'Seller Address', 'Property ID', 'Property Type', 'Property Title',
    'Property Address', 'City', 'State', 'Created Date', 'Verification Status', 'Listing Status'
  ],
  PROPERTIES: [
    'Property ID', 'Property Type', 'Property Title', 'Price', 'Area', 'Area Unit',
    'Address', 'Locality', 'City', 'State', 'Pincode', 'Seller ID', 'Seller Name',
    'Approval Type', 'RERA Number', 'HMDA Number', 'DTCP Number', 'Listing Status',
    'Verification Status', 'Created Date'
  ]
};

/**
 * Finds an existing sheet (case-insensitive) or creates a new one with styled headers
 */
function getOrCreateSheet(ss, sheetName, headers) {
  const sheets = ss.getSheets();
  let sheet = null;
  const targetLower = sheetName.trim().toLowerCase();

  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim().toLowerCase() === targetLower) {
      sheet = sheets[i];
      break;
    }
  }

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight('bold');
    range.setBackground('#d1fae5');
    range.setFontColor('#065f46');
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight('bold');
    range.setBackground('#d1fae5');
    range.setFontColor('#065f46');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const body = JSON.parse(rawData);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = body.action;
    const data = body.data || {};

    // UNIFIED: Both "View Number" and "Contact Agent" form submissions go directly into "Leads information"
    if (action === 'save_lead' || action === 'save_buyer' || action === 'save_enquiry') {
      const sheet = getOrCreateSheet(ss, 'Leads information', HEADERS.LEADS_INFORMATION);

      // Extract phone number from any potential field name
      var rawPhone = (data.phoneNumber || data.phone || data.mobileNumber || data.buyerPhone || data.mobile || '').toString().trim();
      
      // CRITICAL FOR GOOGLE SHEETS:
      // Strings starting with "+" (like +91 9876543210) are evaluated as formulas by Google Sheets (=+91...),
      // which causes formula syntax errors and leaves the phone cell blank.
      // Prepending a single quote "'" instructs Google Sheets to store and display it as plain text.
      var safePhone = rawPhone ? ("'" + rawPhone.replace(/^'+/, '')) : '';

      sheet.appendRow([
        data.buyerLeadId || data.leadId || '',
        data.buyerName || data.name || '',
        data.email || '',
        safePhone,
        data.city || 'Hyderabad',
        data.preferredLocation || '',
        data.propertyType || '',
        data.budget || '',
        data.message || '',
        data.propertyId || '',
        data.propertyTitle || '',
        data.source || 'OPV Chatbot',
        data.enquiryDate || new Date().toISOString().split('T')[0],
        data.leadStatus || 'New',
        data.assignedTo || 'Unassigned',
        data.notes || ''
      ]);

      // Explicitly format column D cell as plain text to prevent formula evaluation
      try {
        var lastRow = sheet.getLastRow();
        sheet.getRange(lastRow, 4).setNumberFormat('@');
      } catch (fmtErr) {
        // Ignore if formatting fails
      }
    } else if (action === 'save_seller') {
      const sheet = getOrCreateSheet(ss, 'SELLERS', HEADERS.SELLERS);
      var rawSellerMobile = (data.mobileNumber || data.phone || '').toString().trim();
      var safeSellerMobile = rawSellerMobile ? ("'" + rawSellerMobile.replace(/^'+/, '')) : '';
      var rawSellerWA = (data.whatsappNumber || data.mobileNumber || '').toString().trim();
      var safeSellerWA = rawSellerWA ? ("'" + rawSellerWA.replace(/^'+/, '')) : '';

      sheet.appendRow([
        data.sellerId || '',
        data.sellerName || '',
        data.sellerType || 'Owner',
        safeSellerMobile,
        safeSellerWA,
        data.email || '',
        data.sellerAddress || '',
        data.propertyId || '',
        data.propertyType || '',
        data.propertyTitle || '',
        data.propertyAddress || '',
        data.city || '',
        data.state || '',
        data.createdDate || new Date().toISOString().split('T')[0],
        data.verificationStatus || 'Pending',
        data.listingStatus || 'Pending'
      ]);
    } else if (action === 'save_property') {
      const sheet = getOrCreateSheet(ss, 'PROPERTIES', HEADERS.PROPERTIES);
      sheet.appendRow([
        data.propertyId || '',
        data.propertyType || '',
        data.propertyTitle || '',
        data.price || '',
        data.area || '',
        data.areaUnit || '',
        data.address || '',
        data.locality || '',
        data.city || '',
        data.state || '',
        data.pincode || '',
        data.sellerId || '',
        data.sellerName || '',
        data.approvalType || '',
        data.reraNumber || '',
        data.hmdaNumber || '',
        data.dtcpNumber || '',
        data.listingStatus || 'Pending',
        data.verificationStatus || 'Pending',
        data.createdDate || new Date().toISOString().split('T')[0]
      ]);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', action: action, sheet: 'Leads information' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'active', service: 'OPV Google Sheets Webhook', defaultSheet: 'Leads information' })
  ).setMimeType(ContentService.MimeType.JSON);
}
