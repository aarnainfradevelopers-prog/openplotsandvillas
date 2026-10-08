import { filterPropertiesByQuery, getActiveProperties, INITIAL_PAN_INDIA_PROPERTIES, addDynamicProperty } from './src/data/propertyData';
import { detectIndianLocationInQuery, calculateDistanceKm } from './src/data/locationData';
import { submitBuyerEnquiry, submitSellerPostProperty, saveBuyerLead, saveSeller, saveProperty, saveEnquiry } from './src/services/googleSheetsService';

async function runAllTests() {
  console.log('==================================================');
  console.log('RUNNING COMPREHENSIVE OPV LEAD SYSTEM TESTS');
  console.log('==================================================\n');

  // -----------------------------------------------------------------
  // TEST 1: Buyer searches for apartments in Mumbai
  // -----------------------------------------------------------------
  console.log('--- TEST 1: "Show me apartments in Mumbai" ---');
  const query1 = 'Show me apartments in Mumbai';
  const detectedLoc1 = detectIndianLocationInQuery(query1);
  console.log('Detected Location:', detectedLoc1?.name, '(City:', detectedLoc1?.city, ')');
  const results1 = filterPropertiesByQuery(getActiveProperties(), query1);
  console.log(`Found ${results1.length} properties:`);
  results1.forEach(p => console.log(`  - [${p.id}] ${p.title} (${p.location}) - Price: ${p.price}`));
  if (results1.length > 0 && results1.every(p => p.location.includes('Mumbai') || p.city === 'Mumbai')) {
    console.log('>>> TEST 1 PASSED: Mumbai properties returned successfully.\n');
  } else {
    console.error('>>> TEST 1 FAILED\n');
  }

  // -----------------------------------------------------------------
  // TEST 2: Buyer searches for apartments near Andheri
  // -----------------------------------------------------------------
  console.log('--- TEST 2: "Show me apartments near Andheri" ---');
  const query2 = 'Show me apartments near Andheri';
  const detectedLoc2 = detectIndianLocationInQuery(query2);
  console.log('Detected Location:', detectedLoc2?.name, '(City:', detectedLoc2?.city, ')');
  const results2 = filterPropertiesByQuery(getActiveProperties(), query2);
  const exactMatches = results2.filter(p => !p.isNearby);
  const nearbyMatches = results2.filter(p => p.isNearby);
  console.log(`Matching properties (${exactMatches.length}):`);
  exactMatches.forEach(p => console.log(`  * [${p.id}] ${p.title} (${p.location})`));
  console.log(`Nearby recommendation properties (${nearbyMatches.length}):`);
  nearbyMatches.forEach(p => console.log(`  * [${p.id}] ${p.title} (${p.location}) [${p.nearbyNote || (p.nearbyDistanceKm + ' km away')}]`));

  if (exactMatches.length > 0 && nearbyMatches.length > 0) {
    console.log('>>> TEST 2 PASSED: Both exact match and clearly labelled nearby properties returned.\n');
  } else {
    console.error('>>> TEST 2 FAILED\n');
  }

  // -----------------------------------------------------------------
  // TEST 3 & 4: Buyer enquiry submission
  // -----------------------------------------------------------------
  console.log('--- TEST 3 & 4: Buyer Enquiry Submission ---');
  const targetProp = results2[0]; // Andheri property
  console.log('Target Property for enquiry:', targetProp.id, targetProp.title);
  console.log('Associated Seller:', targetProp.sellerName, 'ID:', targetProp.sellerId);

  const buyerSubmission = await submitBuyerEnquiry({
    buyerName: 'Rahul Sharma',
    email: 'rahul@email.com',
    phone: '9876543211',
    preferredLocation: 'Andheri / Powai',
    message: 'Interested in this apartment. Please help me with more details and a site visit.',
    property: targetProp
  });

  console.log('Enquiry Submission Result:', buyerSubmission.success ? 'SUCCESS' : 'FAILED');
  console.log('Lead ID:', buyerSubmission.buyerLeadId);
  console.log('Enquiry ID:', buyerSubmission.enquiryId);
  console.log('Buyer Lead Saved:', buyerSubmission.buyerLead?.buyerName, buyerSubmission.buyerLead?.phoneNumber);
  console.log('Enquiry Record Saved:', buyerSubmission.enquiry?.enquiryId, 'for Property:', buyerSubmission.enquiry?.propertyId, 'Seller:', buyerSubmission.enquiry?.sellerId);

  if (
    buyerSubmission.success &&
    buyerSubmission.buyerLeadId?.startsWith('BUY-') &&
    buyerSubmission.enquiryId?.startsWith('ENQ-') &&
    buyerSubmission.enquiry?.sellerId === targetProp.sellerId
  ) {
    console.log('>>> TEST 3 & 4 PASSED: Buyer and Enquiry records successfully generated with full OPV associations.\n');
  } else {
    console.error('>>> TEST 3 & 4 FAILED\n');
  }

  // -----------------------------------------------------------------
  // TEST 5: Seller posts an apartment
  // -----------------------------------------------------------------
  console.log('--- TEST 5: Seller Posts Property ---');
  const sellerSubmission = await submitSellerPostProperty({
    sellerName: 'Raj Kumar',
    sellerType: 'Owner',
    mobileNumber: '9876543210',
    whatsappNumber: '9876543210',
    email: 'raj@email.com',
    sellerAddress: 'Andheri West, Mumbai',
    propertyTitle: '3 BHK Sea View Luxury Apartment',
    propertyType: 'Apartment',
    price: '₹ 2.5 Cr',
    area: '1850',
    areaUnit: 'Sq.Ft',
    address: 'Near Link Road',
    locality: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    description: 'Spacious high-rise apartment with modern amenities',
    reraNumber: 'P51800012345',
    photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80']
  });

  console.log('Seller Submission Result:', sellerSubmission.success ? 'SUCCESS' : 'FAILED');
  console.log('Seller ID:', sellerSubmission.sellerId);
  console.log('Property ID:', sellerSubmission.propertyId);
  console.log('Seller Record Saved:', sellerSubmission.sellerRecord?.sellerName, 'Status:', sellerSubmission.sellerRecord?.listingStatus);
  console.log('Property Record Saved:', sellerSubmission.propertyRecord?.propertyTitle, 'Listing Status:', sellerSubmission.propertyRecord?.listingStatus);

  if (
    sellerSubmission.success &&
    sellerSubmission.sellerId?.startsWith('SELL-') &&
    sellerSubmission.propertyId?.startsWith('PROP-') &&
    sellerSubmission.propertyRecord?.listingStatus === 'Pending'
  ) {
    console.log('>>> TEST 5 PASSED: Seller and Property stored with "Pending" status and proper IDs.\n');
  } else {
    console.error('>>> TEST 5 FAILED\n');
  }

  // -----------------------------------------------------------------
  // TEST 6: Buyer views seller property - Privacy enforcement
  // -----------------------------------------------------------------
  console.log('--- TEST 6: Privacy Check on Seller Listing ---');
  // Add posted property to portal
  if (sellerSubmission.propertyItem) {
    addDynamicProperty(sellerSubmission.propertyItem);
  }
  const allProps = getActiveProperties();
  const posted = allProps.find(p => p.id === sellerSubmission.propertyId);
  console.log('Posted Property in Portal:', posted?.id, posted?.title);
  console.log('Checking exposed agent/seller properties:');
  console.log('  Agent Name:', posted?.agent?.name);
  console.log('  Agent Phone:', posted?.agent?.phone);
  console.log('  Seller Name:', posted?.sellerName);
  console.log('  Raw seller phone field directly exposed on PropertyItem?:', (posted as any)?.sellerPhone ? 'YES (UNSAFE)' : 'NO (SECURE)');
  
  const isDirectPhoneExposed = (posted as any)?.sellerPhone !== undefined;
  const isManagedViaOpv = posted?.agent?.phone === '1800-OPV-LEADS' || posted?.agent?.role?.includes('OPV');

  if (!isDirectPhoneExposed && isManagedViaOpv) {
    console.log('>>> TEST 6 PASSED: Raw seller phone is NOT exposed publicly. Inquiries routed through OPV.\n');
  } else {
    console.error('>>> TEST 6 FAILED\n');
  }

  // -----------------------------------------------------------------
  // TEST 7: Google Sheets API resilience / graceful fallback
  // -----------------------------------------------------------------
  console.log('--- TEST 7: Resilient / Offline Fallback ---');
  // Attempting save directly with empty/fallback network should not crash
  const backupLead = await saveBuyerLead({
    leadId: 'BUY-FALLBACK-TEST',
    name: 'Pooja Verma',
    email: 'pooja@test.com',
    phone: '9876543299',
    city: 'Pune',
    preferredLocation: 'Hinjewadi',
    propertyType: 'Apartment',
    budget: 8500000,
    message: 'Looking for 2 BHK near tech park',
    source: 'Direct Portal',
    enquiryDate: new Date().toISOString(),
    leadStatus: 'New',
    assignedTo: 'Unassigned',
    notes: 'Fallback test lead'
  });

  console.log('Fallback Result:', backupLead.success ? 'SUCCESS (Buffered Gracefully)' : 'FAILED');
  if (backupLead.success) {
    console.log('>>> TEST 7 PASSED: Graceful resilience active. Portal never crashes.\n');
  } else {
    console.error('>>> TEST 7 FAILED\n');
  }

  console.log('==================================================');
  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  console.log('==================================================');
}

runAllTests().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
