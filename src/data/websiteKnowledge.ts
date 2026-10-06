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
* 🌟 **360° Elite Services:** 18 turnkey service verticals including free chauffeured site visits, legal title audits, Bhoomi Pooja coordination, Vastu consultancy, home loans, and interior design.
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

Open Plots & Villas (OPV) is Hyderabad's premier property technology platform that revolutionizes the way people **discover, buy, sell, rent, and invest** in real estate.

* **Our Purpose:** Making property discovery simpler, safer, and fully transparent. We connect buyers, sellers, landlords, and developers with verified properties and trusted real estate services all in one place.
* **What We Offer:** Verified Open Plots, Luxury Villas, Gated Communities, High-Rise Apartments, Agricultural Farm Lands, and Prime Commercial Spaces across Hyderabad.
* **Quality Assurance:** Multi-layer verification including **RERA registration checks**, **30-year legal title audits**, and digital documentation guarantees.
* **End-to-End Solutions:** Complete support from property discovery and free chauffeured site visits to Bhoomi Pooja, Gruhapravesam, home loans, registration, and interior design.`,
    linkUrl: 'https://openplotsandvillas.com/about/',
    linkLabel: 'Learn More on OPV About Us ↗'
  },

  // 2. OFFICE ADDRESS & LOCATION
  {
    id: 'office_location',
    patterns: /\b(office\s*(address|location)?|where\s*(is|are)\s*(your|opv|the)\s*office|head\s*office|headquarters|location\s*of\s*office|visit\s*(your\s*)?office|address)\b/i,
    title: 'OPV Head Office Location',
    content: `### 📍 Open Plots & Villas — Office Address
You are welcome to visit our head office in Hyderabad:

* **Address:** #101, Road No: 10, Jaya Kesav Avenue, Kakatiya Hills, Madhapur, Hyderabad, Telangana – 500081
* **Landmark:** Kakatiya Hills, Madhapur (near Hitec City growth corridor)
* **Phone:** +91 99635 13939 | 040 4568 5052
* **Email:** info@openplotsandvillas.com
* **Working Hours:** Monday – Saturday: 9:30 AM – 6:30 PM (Sunday by appointment)

Our property consultants and legal advisors are available in-person to guide your investment decisions.`,
    linkUrl: 'https://openplotsandvillas.com/contact/',
    linkLabel: 'View on OPV Contact Page ↗'
  },

  // 3. CONTACT NUMBERS & HELPLINE
  {
    id: 'contact_info',
    patterns: /\b(contact(\s*us)?|phone(\s*number)?|call(\s*opv)?|mobile(\s*number)?|helpline|customer\s*care|support\s*(team|number)?|email|whatsapp\s*number)\b/i,
    title: 'OPV Contact & Support Information',
    content: `### 📞 Contact Open Plots & Villas
Speak directly with our property advisory desk:

* **Primary Helpline:** [+91 99635 13939](tel:+919963513939)
* **Office Landline:** [040 4568 5052](tel:04045685052) / [040 4563 5052](tel:04045635052)
* **WhatsApp Desk:** [+91 99635 13939](https://wa.me/919963513939) (Instant property assistance)
* **Official Email:** [info@openplotsandvillas.com](mailto:info@openplotsandvillas.com)
* **Support Timings:** Monday to Saturday, 9:30 AM – 6:30 PM IST

You can also request a callback or book a property site visit anytime!`,
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
* 🤝 **OPV Verified Properties:** Verified open plot sales, gated community villas, agricultural farm lands, and chauffeured site visits.`,
    linkUrl: 'https://openplotsandvillas.com/services/',
    linkLabel: 'Explore All 360° Elite Services ↗'
  },

  // 5. SITE VISIT BOOKING
  {
    id: 'site_visit',
    patterns: /\b(site\s*visit|visit\s*(the\s*)?plot|visit\s*(the\s*)?villa|see\s*the\s*property|cab|transport|inspection|book\s*(a\s*)?visit)\b/i,
    title: 'Book a Free Chauffeured Site Visit',
    content: `### 🚗 Free Chauffeured Property Site Visits
Open Plots & Villas provides **complimentary, guided site visits** for interested buyers and families:

* **Chauffeured Pickup & Drop:** Free comfortable transport to the venture and back from key pickup hubs in Hyderabad.
* **On-Site Expert Advisor:** An experienced OPV property advisor accompanies you to explain layout boundaries, approvals, road dimensions, and connectivity.
* **Documentation Transparency:** Review verified HMDA/DTCP layout permissions and RERA documents directly on-site.
* **Flexible Timings:** Available 7 days a week (including weekends).

To schedule your visit, call **+91 99635 13939** or tap **Chat on WhatsApp** below with your preferred day and location.`,
    linkUrl: 'https://openplotsandvillas.com/contact/',
    linkLabel: 'Book a Site Visit on OPV ↗'
  },

  // 6. HOW TO BUY PROPERTY ON OPV
  {
    id: 'buying_guide',
    patterns: /\b(how\s*to\s*buy|buying\s*guide|buyer\s*guide|steps\s*to\s*buy|buying\s*process|purchase\s*process)\b/i,
    title: 'Property Buying Guide on OPV',
    content: `### 📖 Step-by-Step Guide to Buying Property on OPV
1. **Search & Shortlist:** Explore verified open plots, villas, or apartments on OPV filtered by location, budget, and approval (HMDA/DTCP/RERA).
2. **Schedule Free Site Visit:** Experience the project first-hand with our chauffeured pickup and on-site advisor.
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
