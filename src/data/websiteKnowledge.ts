/**
 * Open Plots & Villas (OPV) Official Website Knowledge Base
 * Sourced directly from https://openplotsandvillas.com
 *
 * Covers:
 * - Company Profile, Vision, Mission & Leadership
 * - Head Office Location, Contact Numbers & Support Timings
 * - 360° Elite Services (All 18 end-to-end real estate service verticals)
 * - Buyer & Seller Guides and Site Visit Policies
 * - Legal FAQs (RERA, HMDA, DTCP, GHMC, EC, Mutation, Dharani, NALA, LRS)
 */

export interface WebsiteKnowledgeEntry {
  id: string;
  patterns: RegExp;
  title: string;
  content: string;
  linkUrl: string;
  linkLabel: string;
}

export const OPV_WEBSITE_KNOWLEDGE: WebsiteKnowledgeEntry[] = [
  // 0. OFFICIAL WEBSITE & PORTAL OVERVIEW
  {
    id: 'opv_website',
    patterns: /\b(website|web\s*site|portal|platform|openplotsandvillas(\.com)?|what\s*(is|are|does)\s*(on\s*)?(the|your)\s*(web\s*site|website|portal))\b/i,
    title: 'Open Plots & Villas (OPV) Official Platform',
    content: `### 🌐 Welcome to Open Plots & Villas (openplotsandvillas.com)
**India's First AI-Powered Real Estate Platform — Simple • Transparent • Reliable.**

Our website provides verified property discovery, investor advisory, and end-to-end real estate solutions:

* 🔍 **Verified Property Search:** Explore verified Open Plots, Luxury Villas, Gated Communities, Apartments, and Commercial Spaces across Hyderabad with RERA, HMDA, and DTCP approvals.
* 🌟 **360° Elite Services:** 18 turnkey service verticals including free AC car site visits (free pickup & drop), legal title audits, Bhoomi Pooja coordination, Vastu consultancy, home loans, and interior design.
* 📖 **Guides & Resources:** Detailed Buyer's Guides, Seller's Listing Guides, and Legal FAQs covering Dharani, EC, Mutation, and Registration norms.
* 🤖 **OPV AI Assistant:** Real-time conversational AI to help you find plots and villas matching your exact budget and preferred locations.
* 📞 **Direct Support:** Book a free site visit or speak directly with our property advisors.`,
    linkUrl: 'https://openplotsandvillas.com/',
    linkLabel: 'Visit openplotsandvillas.com ↗'
  },

  // 1. COMPANY PROFILE & ABOUT US
  {
    id: 'about_opv',
    patterns: /\b(about\s*(opv|company|open\s*plots)|who\s*is\s*opv|what\s*is\s*opv|why\s*(choose\s*)?opv|about\s*us)\b/i,
    title: 'About Open Plots & Villas (OPV)',
    content: `### 🏢 About Open Plots & Villas (OPV)
**India's First AI-Powered Real Estate Platform — Simple • Transparent • Reliable.**

Open Plots & Villas (OPV) is India's first AI-powered verified real estate platform that revolutionizes the way people **discover, buy, sell, rent, and invest** in real estate.

* **Our Purpose:** Making property discovery simpler, safer, and fully transparent. We connect buyers, sellers, landlords, and developers with verified properties and trusted real estate services all in one place.
* **What We Offer:** Verified Open Plots, Luxury Villas, Gated Communities, High-Rise Apartments, Agricultural Farm Lands, and Prime Commercial Spaces across Hyderabad.
* **Quality Assurance:** Multi-layer verification including **RERA registration checks**, **30-year legal title audits**, and digital documentation guarantees.
* **End-to-End Solutions:** Complete support from property discovery and free AC car site visits to Bhoomi Pooja, Gruhapravesam, home loans, registration, and interior design.`,
    linkUrl: 'https://openplotsandvillas.com/about/',
    linkLabel: 'Learn More on OPV About Us ↗'
  },

  // 2. OFFICE & REACH OUT INFORMATION
  {
    id: 'office_location',
    patterns: /\b(office\s*(address|location)?|where\s*(is|are)\s*(your|opv|the)\s*office|head\s*office|headquarters|location\s*of\s*office|visit\s*(your\s*)?office|address)\b/i,
    title: 'Reach Out to Open Plots & Villas',
    content: `### 🏢 Reach Out to Open Plots & Villas
You can reach out to our advisory team directly via WhatsApp or Call on our official OPV numbers:

* 💬 **WhatsApp Support:** Reach out on WhatsApp at **+91 99635 13939** for immediate project details, site visit bookings, and verified documentation.
* 📞 **Call on OPV Number:** Call our helpline at **+91 99635 13939**
* ✉️ **Email:** info@openplotsandvillas.com
* 🌐 **Website:** https://openplotsandvillas.com
* ⏰ **Support Hours:** Monday to Saturday: 9:30 AM – 6:30 PM IST`,
    linkUrl: 'https://openplotsandvillas.com/contact/',
    linkLabel: 'Reach Out on OPV Contact Page ↗'
  },

  // 3. CONTACT NUMBERS & HELPLINE
  {
    id: 'contact_info',
    patterns: /\b(contact(\s*us)?|phone(\s*number)?|call(\s*opv)?|mobile(\s*number)?|helpline|customer\s*care|support\s*(team|number)?|email|whatsapp\s*number)\b/i,
    title: 'Reach Out to Open Plots & Villas',
    content: `### 📞 Reach Out to Open Plots & Villas
You can connect directly with our advisory desk via WhatsApp or Call on our official OPV numbers:

* 💬 **WhatsApp Support:** Reach out on WhatsApp at **+91 99635 13939**
* 📞 **Call on OPV Number:** Call our helpline at **+91 99635 13939**
* ✉️ **Official Email:** info@openplotsandvillas.com
* 🌐 **Website:** https://openplotsandvillas.com
* ⏰ **Support Timings:** Monday to Saturday, 9:30 AM – 6:30 PM IST`,
    linkUrl: 'https://openplotsandvillas.com/contact/',
    linkLabel: 'Open Contact Desk ↗'
  },

  // 4. 360° ELITE SERVICES (COMPLETE SUITE)
  {
    id: '360_elite_services',
    patterns: /\b(360|360°|elite\s*services?|opv\s*services?|what\s*services?|services?\s*provided|services?\s*offered|real\s*estate\s*services?)\b/i,
    title: 'OPV 360° Elite Services',
    content: `### 🌟 OPV 360° Elite Services
**From Land Acquisition & Bhoomi Pooja to Gruhapravesam — End-to-End Real Estate Solutions on India's Premium AI Real Estate Portal.**

Open Plots & Villas offers full-spectrum, verified turnkey services:

* 📐 **Architectural Design & Planning:** Visionary house plans, villa designs, 2D/3D floor plans, 3D elevations, structural engineering drawings, and municipal building sanctions.
* 🏗️ **Construction & Civil Contractor:** Turnkey residential, villa, and commercial construction, renovations, and premium civil contracting.
* 📜 **Legal & Documentation Assistance:** 30-year Encumbrance Certificate (EC) audit, title deed clearances, sale agreement drafting, Patta mutation, and SRO registration support.
* 🏦 **Home Loan & Property Finance:** Instant bank sanctions, open plot loans, construction loans, balance transfers, and NRI financing from top nationalized and private banks.
* 🏡 **Interior Design & Smart Homes:** Modular kitchens, wardrobes, false ceilings, ambient lighting, home theater setups, and IoT smart home automation.
* 🛰️ **Land Survey & Geo-Tagging:** DGPS and GPS boundary survey, drone mapping, topographic contour mapping, and layout demarcation.
* 🌿 **Layout Development Services:** Venture infrastructure, land leveling, internal BT/CC roads, underground drainage, and avenue plantations.
* ⚡ **Electrical, Solar & CCTV Security:** Complete electrical installations, power backups, CCTV setups, fire safety, rooftop solar, and EV charging stations.
* 🌺 **Vastu & Spiritual Services:** 100% Vastu audits, Bhoomi Pooja coordination, and Gruhapravesam muhurtham rituals.
* 🛡️ **Property Management & Asset Care:** Regular on-site inspections, boundary fencing, asset security audits, and utility bill tracking.
* 🚚 **Packers & Movers:** Safe household shifting, corporate office relocation, and vehicle transportation.
* 🤝 **OPV Verified Properties:** Verified open plot sales, gated community villas, agricultural farm lands, and free site visits with AC car pickup & drop.`,
    linkUrl: 'https://openplotsandvillas.com/services/',
    linkLabel: 'Explore All 360° Elite Services ↗'
  },

  // 5. SITE VISIT BOOKING
  {
    id: 'site_visit',
    patterns: /\b(site\s*visit|visit\s*(the\s*)?plot|visit\s*(the\s*)?villa|see\s*the\s*property|cab|transport|inspection|book\s*(a\s*)?visit|car\s*pickup|pickup\s*and\s*drop|chauffeured)\b/i,
    title: 'Book a Free Site Visit (Free AC Car Pickup & Drop)',
    content: `### 🚗 Free Property Site Visits (Free AC Car Pickup & Drop)
Open Plots & Villas provides **free guided site visits with comfortable AC car pickup and drop** for interested buyers and families:

* **Free Doorstep Pickup & Drop:** Free comfortable AC car transport directly to the project venture and back from your home or major hubs across Hyderabad.
* **On-Site Expert Advisor:** An experienced OPV property advisor accompanies you to explain layout boundaries, approvals, road dimensions, and connectivity.
* **Documentation Transparency:** Review verified HMDA/DTCP layout permissions and RERA documents directly on-site.
* **Flexible Timings:** Available 7 days a week (including weekends).

To schedule your visit, call **+91 99635 13939** or tap **Chat on WhatsApp** below with your preferred day and location.`,
    linkUrl: 'https://openplotsandvillas.com/contact/',
    linkLabel: 'Book a Free Site Visit on OPV ↗'
  },

  // 6. HOW TO BUY PROPERTY ON OPV
  {
    id: 'buying_guide',
    patterns: /\b(how\s*to\s*buy|buying\s*guide|buyer\s*guide|steps\s*to\s*buy|buying\s*process|purchase\s*process)\b/i,
    title: 'Property Buying Guide on OPV',
    content: `### 📖 Step-by-Step Guide to Buying Property on OPV
1. **Search & Shortlist:** Explore verified open plots, villas, or apartments on OPV filtered by location, budget, and approval (HMDA/DTCP/RERA).
2. **Schedule Free Site Visit:** Experience the project first-hand with our free car pickup & drop and on-site advisor.
3. **Legal Due Diligence:** Our dedicated in-house legal team verifies the 30-year Encumbrance Certificate (EC), link documents, and layout sanctions.
4. **Loan Assistance:** Get fast-tracked home loan or plot loan approvals through our tie-ups with leading national banks (SBI, HDFC, ICICI).
5. **Agreement of Sale:** Transparent terms, payment milestones, and token registration.
6. **Final Registration & Patta Mutation:** We assist with SRO slot booking, stamp duty calculation, registration, and municipal/Dharani ownership mutation.`,
    linkUrl: 'https://openplotsandvillas.com/guide/buying-guide/',
    linkLabel: 'Read Complete Buying Guide ↗'
  },

  // 7. HOW TO SELL / POST PROPERTY ON OPV
  {
    id: 'selling_guide',
    patterns: /\b(how\s*to\s*sell|selling\s*guide|seller\s*guide|post\s*property|list\s*property|sell\s*my\s*(plot|villa|land|property))\b/i,
    title: 'Property Selling & Listing Guide',
    content: `### 📢 Sell & List Your Property on OPV
Are you a plot owner, villa seller, or developer looking to sell?

* **Reach Genuine Buyers:** Connect with verified high-intent buyers, investors, and NRI clients actively searching in Hyderabad.
* **End-to-End Promotion:** We feature your listing with professional photography, drone shoots, 3D walkthroughs, and targeted digital marketing campaigns.
* **Transparent Pricing:** Expert property valuation guidance to ensure you receive true market value.
* **Hassle-Free Transactions:** Our legal and advisory team coordinates site visits, buyer inquiries, and paperwork from start to finish.

To list your property, contact our sales desk at **+91 99635 13939** or email **info@openplotsandvillas.com**.`,
    linkUrl: 'https://openplotsandvillas.com/guide/selling-guide/',
    linkLabel: 'Read Complete Selling Guide ↗'
  },

  // 8. LEGAL ASSISTANCE & TITLE VERIFICATION
  {
    id: 'legal_services',
    patterns: /\b(legal\s*services?|legal\s*verification|title\s*check|title\s*clearance|advocate|due\s*diligence|link\s*documents?)\b/i,
    title: 'OPV Legal & Title Verification Services',
    content: `### ⚖️ Legal & Title Verification by OPV
Buying property is a major milestone—our dedicated real estate legal team ensures your purchase is 100% secure:

* **30-Year Encumbrance Audit:** Complete scrutiny of historical transactions to guarantee no pending mortgages, bank liens, or legal disputes.
* **Mother & Link Document Scrutiny:** Thorough chain-of-title verification from original pattadars to the current seller.
* **Statutory Approval Verification:** Cross-referencing layout sanctions against official HMDA, DTCP, RERA, and GHMC master plans.
* **Sale Deed Drafting:** Legally compliant drafting of Agreement of Sale and final Sale Deed protecting buyer interests.
* **Registration & Mutation Assistance:** Complete on-ground support at the Sub-Registrar Office (SRO) and Dharani portal.`,
    linkUrl: 'https://openplotsandvillas.com/services/legal-services/',
    linkLabel: 'Explore Legal Services ↗'
  },

  // 9. HOME LOAN ASSISTANCE
  {
    id: 'home_loans',
    patterns: /\b(home\s*loans?|housing\s*loans?|plot\s*loans?|bank\s*loans?|interest\s*rate|loan\s*assistance|sbi\s*loan|hdfc\s*loan|nri\s*loan)\b/i,
    title: 'OPV Home Loan & Finance Assistance',
    content: `### 🏦 Home Loan & Property Financing Support
OPV partners with leading nationalized and private banks (SBI, HDFC, ICICI, Axis Bank, Bank of Baroda) to provide hassle-free loans:

* **Plot Purchase Loans:** Financing up to 75% for approved HMDA & DTCP residential plots.
* **Home & Villa Loans:** Up to 80%–85% financing for villas, apartments, and independent houses.
* **Plot + Construction Composite Loans:** Seamless funding covering both land purchase and turnkey villa construction.
* **NRI Home Loans:** Specialized financing with digital processing for Non-Resident Indians.
* **Balance Transfers & Top-Ups:** Shift existing high-interest loans to the lowest market rates.

Our finance desk coordinates paperwork, legal bank vetting, and quick sanctioning on your behalf.`,
    linkUrl: 'https://openplotsandvillas.com/services/home-loan/',
    linkLabel: 'Explore Home Loan Support ↗'
  },

  // 10. VASTU & SPIRITUAL SERVICES
  {
    id: 'vastu_services',
    patterns: /\b(vastu|vaastu|spiritual|bhoomi\s*pooja|gruhapravesam|muhurtham|pooja\s*services?)\b/i,
    title: 'Vastu Consultation & Spiritual Services',
    content: `### 🌺 Vastu & Spiritual Services
Start your real estate journey with auspicious blessings and optimal energy:

* **100% Vastu Layout Audits:** Comprehensive directional analysis for East-facing, North-facing plots, villa layouts, and entrance arch alignments.
* **Bhoomi Pooja Coordination:** Complete ceremonial arrangements, verified pandits, and pooja samagri for layout and construction commencement.
* **Gruhapravesam Planning:** Auspicious muhurtham calculation and complete ritual management for housewarming ceremonies.
* **Vastu Corrections Without Demolition:** Practical spatial remedies for existing houses and commercial properties.`,
    linkUrl: 'https://openplotsandvillas.com/services/vastu-spiritual/',
    linkLabel: 'Explore Vastu Services ↗'
  },

  // 11. ARCHITECTURAL & INTERIOR DESIGN
  {
    id: 'design_interior',
    patterns: /\b(interior|interior\s*design|smart\s*home|modular\s*kitchen|wardrobe|false\s*ceiling|architect|floor\s*plan|3d\s*elevation)\b/i,
    title: 'Architectural Design & Smart Interior Solutions',
    content: `### 🎨 Architectural & Interior Design Solutions
Turn your bare plot or villa shell into an architecturally stunning dream home:

* **Visionary Architectural Planning:** Custom 2D/3D floor plans, 3D exterior elevations, and structural drawings tailored to your plot size.
* **Interior Designing:** Modular kitchens, premium wardrobes, false ceilings, ambient lighting, and luxury bathrooms.
* **Smart Home Automation:** Smart switches, automated security cameras, video door phones, and smartphone-controlled climate systems.
* **Turnkey Execution:** Transparent pricing, 3D previews before construction, and milestone-based project delivery.`,
    linkUrl: 'https://openplotsandvillas.com/services/interior-smart-home/',
    linkLabel: 'Explore Interior & Design Services ↗'
  },

  // 12. EXCLUSIVE RENT & LEASE PROPERTIES
  {
    id: 'exclusive_rent_lease',
    patterns: /\b(exclusive\s*rent|rent\/?lease|rent\s*(and|&|or)?\s*lease|rental\s*properties|properties\s*for\s*(rent|lease)|rent\s*(flat|flats|apartment|apartments|house|houses|villa|villas|commercial|office|shop|shops)|lease\s*properties|commercial\s*lease|rent\s*in\s*hyderabad|houses?\s*for\s*rent|flats?\s*for\s*rent|villas?\s*for\s*rent|rental|lease|rent)\b/i,
    title: 'Exclusive Rent & Lease Properties on OPV',
    content: `### 🔑 Exclusive Rent & Lease Properties on OPV
**Verified Residential & Commercial Rental Solutions Across Hyderabad.**

Open Plots & Villas (openplotsandvillas.com) provides a dedicated category for verified rental and lease properties with zero-brokerage direct owner options and tenant security:

* 🏠 **Residential Rentals:**
  * **Flats & High-Rise Apartments:** 1 BHK, 2 BHK, 3 BHK, and 4 BHK units in prime gated communities with 24/7 security, clubhouses, swimming pools, and gym amenities.
  * **Luxury Gated Villas & Independent Houses:** Spacious duplex and triplex villas in family-friendly growth corridors like Kokapet, Tellapur, Mokila, and Manikonda.
  * **Flexible Furnishing Options:** Choose from Fully-Furnished (ready to move with electronics & modular fittings), Semi-Furnished, or Unfurnished homes.
* 🏢 **Commercial Lease & Office Spaces:**
  * **Plug-and-Play Corporate Workspaces:** Fully equipped IT/ITeS office floors, conference rooms, and executive cabins in Madhapur, Hitec City, and Financial District.
  * **Retail Shops & Showrooms:** Main-road frontage commercial spaces for retail outlets, bank branches, healthcare clinics, and supermarkets.
  * **Warehouses & Industrial Godowns:** Secure storage spaces with convenient ORR highway access.
* 🛡️ **OPV Rental Guarantees:**
  * **100% Genuine Owner Listings:** Direct contact with property owners with zero fake broker listings.
  * **Transparent Rental Agreements:** Online draft agreements, legal verification, and stamp duty assistance.
  * **Tenant & Landlord Background Verification:** Complete peace of mind for both parties.
  * **Move-In Coordination:** Deep cleaning, painting, and utility handover support.

📞 **Looking to rent a property or lease out your asset?** Call our Rental Desk at **+91 99635 13939** or explore verified rentals online!`,
    linkUrl: 'https://openplotsandvillas.com/',
    linkLabel: 'Explore Rent & Lease Properties on OPV ↗'
  },

  // 13. PG / HOSTEL & CO-LIVING PROPERTIES
  {
    id: 'pg_hostel_coliving',
    patterns: /\b(pg|hostel|co[\s-]?living|paying\s*guest|pg\/?hostel|hostel\s*(and|&)?\s*co[\s-]?living|ladies\s*hostel|mens\s*hostel|executive\s*pg|student\s*hostel|co[\s-]?living\s*properties|pg\s*properties|hostel\s*properties)\b/i,
    title: 'PG / Hostel & Co-Living Properties on OPV',
    content: `### 🛏️ PG / Hostel & Co-Living Properties on OPV
**Comfortable, Verified, & Affordable Accommodations Across Hyderabad's Major Hubs.**

Open Plots & Villas features a dedicated **PG / Hostel & Co-Living** section designed specifically for students, IT professionals, and working executives:

* 🏢 **Accommodation Categories:**
  * **Executive Co-Living Spaces:** Modern, community-driven living spaces with private rooms, double sharing, and triple sharing for corporate executives.
  * **Verified Ladies Hostels:** High-security hostels with 24/7 CCTV surveillance, biometric access control, and dedicated female wardens.
  * **Men's Hostels & Executive PGs:** Affordable, clean, and well-maintained rooms with flexible daily and monthly stay packages.
  * **Studio Apartments & 1 RK Units:** Independent private living units for working individuals and couples.
* 🌟 **All-Inclusive Amenities:**
  * 🍽️ **Hygienic Home-Cooked Food:** 3 nutritious daily meals (South & North Indian menu options).
  * ⚡ **High-Speed WiFi & Power Backup:** Uninterrupted internet for Work From Home (WFH) and 24/7 generator backup.
  * 🧹 **Daily Housekeeping:** Regular room sanitization, deep cleaning, and professional maintenance.
  * 🧺 **Laundry & Appliances:** Washing machines, refrigerators, microwave ovens, and RO drinking water.
  * ❄️ **AC & Non-AC Rooms:** Air-conditioned and well-ventilated rooms with attached bathrooms and hot water geysers.
* 📍 **Prime Strategic Locations:**
  * Walking distance to tech parks and transit metro stations: **Madhapur, Hitec City, Gachibowli, Kondapur, Financial District, Ayyappa Society, KPHB Colony, Ameerpet, and Dilsukhnagar**.
* 🛡️ **Flexible Terms:**
  * Zero heavy lock-in periods, minimal security deposits, and transparent monthly pricing.

📞 **Need a PG or Co-Living Room Today?** Call **+91 99635 13939** or tap **Chat on WhatsApp** for instant room availability and site visits!`,
    linkUrl: 'https://openplotsandvillas.com/',
    linkLabel: 'Explore PG & Co-Living Options on OPV ↗'
  },

  // 14. POST PROPERTY FOR FREE (FOR OWNERS, AGENTS & BUILDERS)
  {
    id: 'post_property_free',
    patterns: /\b(post\s*(property|plot|villa|flat|apartment|free)?|list\s*(property|free)?|how\s*to\s*post|post\s*property\s*free|free\s*listing|add\s*property)\b/i,
    title: 'Post Property for Free on OPV',
    content: `### 📢 Post Your Property for FREE on OPV
**Reach Over 100,000+ Genuine Buyers & Tenants Across Hyderabad with Zero Listing Fees.**

Property owners, landlords, developers, and certified agents can advertise residential and commercial properties directly on Open Plots & Villas:

* 🆓 **100% Free Listing:** Zero hidden charges to post your open plot, villa, apartment, commercial space, or rental property.
* 📸 **Rich Media Support:** Upload photos, layout floor plans, videos, YouTube walkthrough links, and project brochures.
* 🤖 **AI Matchmaking:** Our AI engine automatically recommends your property to active buyers and investors searching in your locality.
* 🔒 **Direct Inquiries:** Receive genuine, verified leads directly to your phone and WhatsApp with no fake broker calls.
* ⚡ **Fast Verification:** Listings are reviewed and made live within 24 hours after basic title verification.

👉 **Ready to list?** Click below to post your property or contact our listing desk at **+91 99635 13939**.`,
    linkUrl: 'https://openplotsandvillas.com/post-property/',
    linkLabel: 'Post Property for FREE Now ↗'
  },

  // 15. EXCLUSIVE OWNER PROPERTIES (DIRECT OWNER / 0% BROKERAGE)
  {
    id: 'exclusive_owner_properties',
    patterns: /\b(exclusive\s*owner|owner\s*properties|direct\s*owner|zero\s*brokerage|no\s*brokerage|without\s*broker|direct\s*seller)\b/i,
    title: 'Exclusive Direct Owner Properties (0% Brokerage)',
    content: `### 🤝 Exclusive Owner Properties (Direct from Owners)
**Buy or Rent Directly from Property Owners with 0% Middleman Fees.**

Open Plots & Villas features a curated section for properties listed directly by genuine owners:
* 💰 **Zero Brokerage:** Connect straight with individual property owners without paying commission or middleman charges.
* 🔍 **Verified Ownership:** Basic property paperwork and identity checks are conducted before listing.
* 🏠 **Available Types:** Direct-owner residential flats, resale plots, independent duplex houses, and rental apartments across Hyderabad.
* 📞 **Direct Contact:** Get direct phone numbers of property owners to schedule your visit and negotiate pricing transparently.`,
    linkUrl: 'https://openplotsandvillas.com/properties/',
    linkLabel: 'Browse Exclusive Owner Properties ↗'
  },

  // 16. TOP DEVELOPERS & BUILDERS IN HYDERABAD
  {
    id: 'top_developers',
    patterns: /\b(top\s*developers?|builders?|developers?\s*(in\s*hyderabad)?|aparna(\s*constructions)?|ramky(\s*group)?|my\s*home(\s*group)?|best\s*builders)\b/i,
    title: 'Top Developers & Builders in Hyderabad',
    content: `### 🏗️ Top Developers & Builders in Hyderabad on OPV
**Partnering with Hyderabad's Most Trusted and Proven Real Estate Builders.**

Explore verified gated communities, high-rise luxury towers, and plotted ventures from top developers:

* 🏢 **Aparna Constructions:**
  * 66+ Total Projects | 23+ Years Experience
  * Gated luxury apartments, villas, and plotted ventures across Tellapur, Nallagandla, Chandanagar, and Kompally.
* 🏢 **Ramky Group:**
  * 31+ Total Projects | 20+ Years Experience
  * Renowned for sustainable townships and integrated gated communities in Gachibowli, Warangal Highway, and Hitec City.
* 🏢 **My Home Group:**
  * 29+ Total Projects | 25+ Years Experience
  * Iconic luxury high-rises and mega commercial spaces in Kokapet (Neopolis), Financial District, and Madhapur.

👉 View project portfolios, construction updates, and upcoming launches on our Developers Portal.`,
    linkUrl: 'https://openplotsandvillas.com/developers/',
    linkLabel: 'Explore Top Developers in Hyderabad ↗'
  },

  // 17. PROPERTY AGENTS & CERTIFIED EXPERTS
  {
    id: 'property_agents_experts',
    patterns: /\b(agents?|brokers?|property\s*experts?|real\s*estate\s*agents?|consultants?|realtor|realtors)\b/i,
    title: 'Verified Property Experts & Agents on OPV',
    content: `### 🧑‍💼 Verified Property Experts & Real Estate Advisors
**Work with Local Experts Who Know Every Locality and Documentation Nuance.**

Open Plots & Villas hosts a network of verified property experts and channel partners across Hyderabad:
* 📍 **Hyperlocal Knowledge:** Advisors specialize in distinct growth hubs (Madhapur, Gachibowli, Kompally, Nizampet, Shadnagar, Kollur, Mokila).
* 🛡️ **Verified Credentials:** All registered experts comply with TG-RERA regulations and ethical advisory standards.
* 🤝 **End-to-End Coordination:** From scheduling on-ground venture visits to negotiating fair market prices and assisting with Sub-Registrar Office (SRO) registration.

Browse our directory to find a trusted advisor specialized in your target neighborhood!`,
    linkUrl: 'https://openplotsandvillas.com/agents/',
    linkLabel: 'Explore Property Agents Directory ↗'
  },

  // 18. MOBILE APP DOWNLOAD (GOOGLE PLAY STORE)
  {
    id: 'mobile_app_download',
    patterns: /\b(app|mobile\s*app|download\s*app|play\s*store|android\s*app|opv\s*app|application)\b/i,
    title: 'Download the OPV Mobile App',
    content: `### 📱 Open Plots & Villas Mobile App — Real Estate in Your Pocket
**Discover, Verify, and Track Hyderabad Properties Anytime, Anywhere.**

Download the official **OPV – Open Plots & Villas** application for Android:
* 🔍 **Instant Geo-Search:** Search plots, apartments, and villas near your live GPS location.
* 🔔 **Instant Alerts:** Get notified the moment a new verified listing or price drop occurs in your favorite area.
* 🚗 **1-Tap Site Visits:** Book free site visits with car pickup & drop directly from the app with real-time driver tracking.
* 🎁 **Refer & Earn Rewards:** Earn redeemable cash vouchers and service credits when referring friends.
* 📲 **Available on Google Play Store:** Search for *"Open Plots & Villas"* or scan the QR code on our website.`,
    linkUrl: 'https://openplotsandvillas.com/',
    linkLabel: 'Download OPV Mobile App ↗'
  },

  // 19. REFERRAL & REWARDS PROGRAM
  {
    id: 'referral_rewards',
    patterns: /\b(refer|referral|rewards?|earn\s*money|earn\s*rewards|refer\s*and\s*earn|refer\s*a\s*friend)\b/i,
    title: 'OPV Refer & Earn Rewards Program',
    content: `### 🎁 OPV Refer & Earn Rewards Program
**Earn Exciting Rewards by Recommending OPV to Friends and Family.**

Know someone looking to buy a plot, invest in a villa, sell their land, or rent an office?
* 🤝 **How It Works:** Share your unique referral link from the OPV app or website with your contact.
* 🏡 **Any Service Qualifies:** Rewards apply to property purchases, plot sales, construction contracts, interior design, and legal services.
* 💵 **Redeemable Benefits:** Earn milestone rewards, shopping vouchers, and service discounts credited directly to your OPV account.`,
    linkUrl: 'https://openplotsandvillas.com/',
    linkLabel: 'Learn About Refer & Earn Rewards ↗'
  },

  // 20. PROPERTIES BY POSSESSION TIMELINE
  {
    id: 'possession_timelines',
    patterns: /\b(possession(\s*timeline)?|ready\s*to\s*move|under\s*construction|new\s*launch|handover|completion\s*date)\b/i,
    title: 'Properties by Possession Timeline',
    content: `### ⏳ Properties by Possession Timeline on OPV
**Find Completed Homes or Upcoming Projects Tailored to Your Moving Timeline.**

On Open Plots & Villas, you can filter properties by their completion stage:
* 🔑 **Ready to Move (Immediate Handover):** Move in tomorrow! Fully completed villas and apartments with Occupancy Certificate (OC) received and active utility connections.
* 🏗️ **Under Construction (Mid-Stage):** Pay via construction-linked installment plans. Great for price appreciation before completion (expected in 12–24 months).
* 🚀 **New Launch (Pre-Launch & Early Stage):** Secure the lowest introductory prices and first pick of premium corner units and high-floor apartments.
* 📜 **Open Plots:** Available with **Immediate Registration** at the Sub-Registrar Office (SRO).`,
    linkUrl: 'https://openplotsandvillas.com/properties/',
    linkLabel: 'Explore Properties by Possession Stage ↗'
  },

  // 21. ZONE-WISE PROPERTIES & GROWTH CORRIDORS IN HYDERABAD
  {
    id: 'zone_wise_hyderabad',
    patterns: /\b(zone|zones|corridors?|regions?|west\s*hyderabad|south\s*hyderabad|north\s*hyderabad|east\s*hyderabad|growth\s*zones?|investment\s*zones?)\b/i,
    title: 'Zone-Wise Properties & Growth Corridors in Hyderabad',
    content: `### 🗺️ Zone-Wise Real Estate Growth Zones in Hyderabad
**Target High-Appreciation Growth Corridors Mapped by Strategic Infrastructure.**

* 🌇 **West Hyderabad (Tech & Luxury Corridor):**
  * Hitec City, Madhapur, Gachibowli, Financial District, Kokapet (Neopolis), Tellapur, Mokila, and Shankarpally.
  * *High rental yields, luxury high-rises, and prime villa communities.*
* ✈️ **South Hyderabad (Airport & Industrial Corridor):**
  * Shamshabad, Kothur, Shadnagar, Lemoor, Maheshwaram (Electronic City), and Kadthal.
  * *Fast-growing open plot ventures, Pharma City corridor, and regional ring road (RRR) connectivity.*
* 🌳 **North Hyderabad (Residential & Educational Hub):**
  * Kompally, Medchal, Nizampet, Bachupally, and Gundlapochampally.
  * *Affordable gated communities, peaceful green surroundings, and excellent schools.*
* 🏭 **East Hyderabad (IT & Defense Corridor):**
  * Uppal, Pocharam (Infosys SEZ), Ghatkesar, and Adibatla (Aerospace SEZ).
  * *High-value plotted ventures and mid-segment apartments.*`,
    linkUrl: 'https://openplotsandvillas.com/properties/',
    linkLabel: 'Explore Zone-Wise Properties ↗'
  },

  // 22. YOUTUBE VIDEO TOURS & SHORTS
  {
    id: 'youtube_shorts_tours',
    patterns: /\b(youtube|shorts|video\s*tour|walkthrough|watch\s*video|videos)\b/i,
    title: 'OPV Real Estate Video Tours & YouTube Shorts',
    content: `### 🎥 OPV YouTube Shorts & Virtual Property Tours
**Experience Verified Layouts and Luxury Villas in High Definition Before Visiting.**

* 📹 **Virtual Walkthroughs:** Watch comprehensive drone aerial views, entrance arch dimensions, blacktop CC roads, and clubhouse amenities.
* 💡 **Investment Insights:** Quick 60-second YouTube Shorts explaining upcoming infrastructure, SEZs, HMDA master plans, and price growth forecasts.
* 🔴 **Official Channel:** Subscribe to [@openplotsandvillas](https://www.youtube.com/@openplotsandvillas/shorts) on YouTube to get notified of newly launched venture walk-throughs.`,
    linkUrl: 'https://www.youtube.com/@openplotsandvillas/shorts',
    linkLabel: 'Watch YouTube Shorts & Tours ↗'
  }
];

/**
 * Searches the official website knowledge base for a query.
 * Returns the matching knowledge entry or null if none match.
 */
export function findWebsiteKnowledge(query: string): WebsiteKnowledgeEntry | null {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  for (const entry of OPV_WEBSITE_KNOWLEDGE) {
    if (entry.patterns.test(q)) {
      return entry;
    }
  }

  return null;
}
