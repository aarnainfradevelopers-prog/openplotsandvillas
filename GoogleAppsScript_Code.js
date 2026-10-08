/**
 * OPV REAL ESTATE LEAD MANAGEMENT WEBHOOK
 */
const HEADERS = {
  SELLERS: [
    'Seller ID', 'Seller Name', 'Seller Type', 'Mobile Number', 'WhatsApp Number',
    'Email', 'Seller Address', 'Property ID', 'Property Type', 'Property Title',
    'Property Address', 'City', 'State', 'Created Date', 'Verification Status', 'Listing Status'
  ],
  BUYERS: [
    'Buyer Lead ID', 'Buyer Name', 'Email', 'Phone Number', 'City',
    'Preferred Location', 'Property Type', 'Budget', 'Message', 'Property ID',
    'Property Title', 'Source', 'Enquiry Date', 'Lead Status', 'Assigned To', 'Notes'
  ],
  PROPERTIES: [
    'Property ID', 'Property Type', 'Property Title', 'Price', 'Area', 'Area Unit',
    'Address', 'Locality', 'City', 'State', 'Pincode', 'Seller ID', 'Seller Name',
    'Approval Type', 'RERA Number', 'HMDA Number', 'DTCP Number', 'Listing Status',
    'Verification Status', 'Created Date'
  ],
  ENQUIRIES: [
    'Enquiry ID', 'Buyer Lead ID', 'Buyer Name', 'Buyer Phone', 'Property ID',
    'Property Title', 'Seller ID', 'Seller Name', 'Enquiry Type', 'Message',
    'Date', 'Time', 'Status', 'Assigned To', 'Follow Up Date', 'Notes'
  ]
};

function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
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

    if (action === 'save_buyer') {
      const sheet = getOrCreateSheet(ss, 'BUYERS', HEADERS.BUYERS);
      sheet.appendRow([
        data.buyerLeadId || '',
        data.buyerName || '',
        data.email || '',
        data.phoneNumber || '',
        data.city || '',
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
    } else if (action === 'save_enquiry') {
      const sheet = getOrCreateSheet(ss, 'ENQUIRIES', HEADERS.ENQUIRIES);
      sheet.appendRow([
        data.enquiryId || '',
        data.buyerLeadId || '',
        data.buyerName || '',
        data.buyerPhone || '',
        data.propertyId || '',
        data.propertyTitle || '',
        data.sellerId || '',
        data.sellerName || '',
        data.enquiryType || '',
        data.message || '',
        data.date || new Date().toISOString().split('T')[0],
        data.time || new Date().toLocaleTimeString(),
        data.status || 'New',
        data.assignedTo || 'Unassigned',
        data.followUpDate || '',
        data.notes || ''
      ]);
    } else if (action === 'save_seller') {
      const sheet = getOrCreateSheet(ss, 'SELLERS', HEADERS.SELLERS);
      sheet.appendRow([
        data.sellerId || '',
        data.sellerName || '',
        data.sellerType || 'Owner',
        data.mobileNumber || '',
        data.whatsappNumber || '',
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
      JSON.stringify({ status: 'success', action: action })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'active', service: 'OPV Google Sheets Webhook' })
  ).setMimeType(ContentService.MimeType.JSON);
}
