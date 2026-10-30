import fs from 'fs';
import path from 'path';

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  description: string;
  inclusions: string[];
  imageUrl: string;
  isAvailable: boolean;
  highlight?: boolean;
}

export interface StandardServiceItem {
  id: string;
  name: string;
  category: 'staff' | 'equipment' | 'rental';
  unit: string;
  unitPrice: number;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  isAvailable: boolean;
  options?: { label: string; price: number; color?: string; mediaUrl?: string }[];
}

export interface LightingPackageItem {
  id: string;
  name: string;
  price: number | null;
  description: string;
  inclusions: string[];
  imageUrl: string;
  isAvailable: boolean;
}

export interface CostumeRentalItem {
  id: string;
  name: string;
  description: string;
  rentalPrice: number | null;
  rentalDuration: string;
  conditions: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface MascotItem {
  id: string;
  name: string;
  description: string;
  rentalPrice: number | null;
  imageUrl?: string;
  videoUrl?: string;
  isAvailable: boolean;
}

export interface AccessoryRentalItem {
  id: string;
  name: string;
  description: string;
  rentalPrice: number;
  category: 'board' | 'bowls' | 'props';
  imageUrl?: string;
  videoUrl?: string;
  isAvailable: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  caption: string;
  category: 'ushers' | 'champagne_girls' | 'costumes' | 'afterparty' | 'mascots' | 'serving_bowls' | 'boards' | 'all';
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  featuredOnHome?: boolean;
  order: number;
  createdAt: string;
}

export interface BookingSelectedService {
  serviceId: string;
  serviceName: string;
  category: string;
  quantity: number;
  unitPrice: number | null;
  selectedOption?: string;
  lineTotal: number | null;
  notes?: string;
}

export interface ItemizedCharge {
  id: string;
  description: string;
  amount: number;
  category: 'travel' | 'accommodation' | 'logistics' | 'equipment' | 'other';
  addedAt: string;
}

export interface BookingRecord {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  destinationCity: string;
  isOutsideServiceArea: boolean;
  guestCount: number;
  budget: number | null;
  additionalRequirements: string;
  
  // Package Selection
  selectedPackageId: string | null;
  selectedPackageName: string | null;
  packagePriceSnapshot: number | null;
  packageInclusionsSnapshot: string[];

  // Individual Selected Services & Rentals
  selectedServices: BookingSelectedService[];

  // Price Calculation Breakdown Snapshot
  subtotalPricedItems: number;
  hasUnpricedItems: boolean;
  unpricedItemsList: string[];
  travelStatus: 'included' | 'pending_assessment' | 'assessed';
  itemizedCharges: ItemizedCharge[];
  totalItemizedCharges: number;
  grandTotal: number | null;
  isQuotationComplete: boolean;

  // Status & Management
  status: 'Pending' | 'Under Review' | 'Awaiting Quotation' | 'Quotation Sent' | 'Approved' | 'Rejected' | 'Completed';
  adminNotes: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface EnquiryRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'responded' | 'archived';
  adminNotes?: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  bookingReference: string;
  type: 'customer_acknowledgement' | 'admin_alert' | 'quotation_updated' | 'booking_status_change';
  recipient: string;
  channel: 'email_simulation' | 'in_app';
  status: 'delivered' | 'pending_smtp' | 'logged';
  subject: string;
  details: string;
}

export interface ReviewRecord {
  id: string;
  createdAt: string;
  customerName: string;
  serviceUsed: string;
  rating: number; // 1 to 5
  reviewText: string;
  bookingReference: string | null;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  approvedAt: string | null;
  approvedBy: string | null;
  adminNotes?: string;
}

export interface AdminNotification {
  id: string;
  timestamp: string;
  type: 'booking_request' | 'quotation_request' | 'consultation' | 'rental_explanation' | 'service_enquiry' | 'review_submission';
  title: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  eventDate: string | null;
  eventLocation: string | null;
  referenceCode: string | null;
  status: 'New' | 'In Progress' | 'Responded To' | 'Completed' | 'Pending Review';
  isRead: boolean;
  emailDeliveryStatus: 'sent' | 'failed' | 'unconfigured_simulated';
  emailError?: string | null;
  emailMessageId?: string | null;
  details: string;
}

export interface SystemSettings {
  brandName: string;
  slogan: string;
  location: string;
  baseServiceArea: string;
  serviceAreaDescription: string;
  currency: string;
  currencySymbol: string;
  adminEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  notificationEmailSimulation: boolean;
  notes: string;
}

export interface DatabaseSchema {
  packages: PackageItem[];
  services: StandardServiceItem[];
  lightingPackages: LightingPackageItem[];
  costumes: CostumeRentalItem[];
  mascots: MascotItem[];
  accessories: AccessoryRentalItem[];
  galleryMedia: MediaItem[];
  bookings: BookingRecord[];
  enquiries: EnquiryRecord[];
  notifications: NotificationLog[];
  adminNotifications: AdminNotification[];
  reviews: ReviewRecord[];
  settings: SystemSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'eventsease_db.json');

// Real initial packages configured per exact prompt requirements
const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-1',
    name: 'Package 1 — Premium Experience',
    price: 1000000,
    description: 'The pinnacle luxury celebration package designed for unforgettable grandeur, royal entries, and explosive afterparties.',
    inclusions: [
      'Couples mix',
      'Gorilla',
      'Power bike',
      'Fire dancer',
      'LED costumes',
      'Afterparty props',
      'Board',
      'Lights',
      'Bottle girls'
    ],
    imageUrl: '/assets/aistudio/afterparty_team_ac9b2157.jpeg',
    isAvailable: true,
    highlight: true,
  },
  {
    id: 'pkg-2',
    name: 'Package 2 — Deluxe Experience',
    price: 800000,
    description: 'High-energy celebration featuring spectacular live fire entertainment, mascot dynamism, and luminous LED displays.',
    inclusions: [
      'Couples mix',
      'Gorilla',
      'Fire dancer',
      'LED costumes',
      'Afterparty props',
      'Board',
      'Lights',
      'Bottle girls'
    ],
    imageUrl: '/assets/aistudio/purple_costume_0e01cfac.jpeg',
    isAvailable: true,
  },
  {
    id: 'pkg-3',
    name: 'Package 3 — Gold Experience',
    price: 750000,
    description: 'The beloved favorite for lavish afterparties featuring signature fire acts, lively mascots, and immersive props.',
    inclusions: [
      'Gorilla',
      'Fire dancer',
      'LED costumes',
      'Afterparty props',
      'Board',
      'Lights',
      'Bottle girls'
    ],
    imageUrl: '/assets/aistudio/gold_costume_70f42908.jpeg',
    isAvailable: true,
  },
  {
    id: 'pkg-4',
    name: 'Package 4 — Silver Experience',
    price: 550000,
    description: 'A vibrant afterparty atmosphere complete with mascot fun, luminous LED outfits, and coordinated bottle service.',
    inclusions: [
      'Gorilla',
      'LED costumes',
      'Afterparty props',
      'Board',
      'Lights',
      'Bottle girls'
    ],
    imageUrl: '/assets/aistudio/black_costume_c34757cd.jpeg',
    isAvailable: true,
  },
  {
    id: 'pkg-5',
    name: 'Package 5 — Classic Experience',
    price: 500000,
    description: 'Essential luxury celebration elements bringing energetic vibe, LED effects, board visuals, and bottle girls.',
    inclusions: [
      'Gorilla',
      'LED costumes',
      'Board',
      'Lights',
      'Bottle girls'
    ],
    imageUrl: '/assets/aistudio/small_board_3cbf85c9.jpeg',
    isAvailable: true,
  },
  {
    id: 'pkg-6',
    name: 'Package 6 — Essential Experience',
    price: 400000,
    description: 'The core celebration package delivering ambient lighting, customized board, drink carriers, and bottle hosts.',
    inclusions: [
      'LED costumes',
      'Board',
      'Lights',
      'Drink carriers',
      'Bottle girls'
    ],
    imageUrl: '/assets/aistudio/drink_carrier_board_4490446f.jpeg',
    isAvailable: true,
  }
];

// Real services with exact confirmed pricing & terminology
const INITIAL_SERVICES: StandardServiceItem[] = [
  {
    id: 'srv-ushers',
    name: 'Professional Event Ushers',
    category: 'staff',
    unit: 'person',
    unitPrice: 17000,
    description: 'Elegantly groomed, articulate hosts and hostesses for guest registration, red-carpet protocol, and VIP seating in traditional, corporate, or ceremonial attire.',
    imageUrl: '/assets/aistudio/5_ushers_76d2682c.jpeg',
    videoUrl: '/assets/aistudio/one_usher_59339047.mp4',
    isAvailable: true
  },
  {
    id: 'srv-champagne-girls',
    name: 'Champagne Girls & Bottle Girls',
    category: 'staff',
    unit: 'person',
    unitPrice: 17000,
    description: 'Glamorous hospitality servers dedicated to toast coordination, VIP bottle service, synchronized sparkler entries, and luxury beverage distribution.',
    imageUrl: '/assets/aistudio/white_champagne_gown_standing_506b0fbc.jpeg',
    isAvailable: true
  },
  {
    id: 'srv-bouncers',
    name: 'Executive Event Bouncers & Security',
    category: 'staff',
    unit: 'bouncer',
    unitPrice: 30000,
    description: 'Trained, imposing, and courteous crowd control personnel ensuring guest safety, VIP lounge access filtering, and perimeter security.',
    imageUrl: '/assets/aistudio/afterparty_team_ac9b2157.jpeg',
    isAvailable: true
  },
  {
    id: 'srv-serving-bowls',
    name: 'Gold-Coloured Serving Bowls with Chilled Drinks',
    category: 'equipment',
    unit: 'bowl',
    unitPrice: 2500,
    description: 'Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality.',
    imageUrl: '/assets/aistudio/silver_bowl_3f2e880f.jpeg',
    videoUrl: '/assets/aistudio/gold_bowls_2428a428.mp4',
    isAvailable: true,
    options: [
      { 
        label: 'Silver Serving Bowls', 
        price: 2000, 
        color: '#C0C0C0',
        mediaUrl: '/assets/aistudio/silver_bowl_3f2e880f.jpeg'
      },
      { 
        label: 'Gold-Coloured Serving Bowls with Chilled Drinks', 
        price: 2500, 
        color: '#D4AF37',
        mediaUrl: '/assets/aistudio/gold_bowls_2428a428.mp4'
      }
    ]
  }
];

// Configurable Lighting Packages
const INITIAL_LIGHTING: LightingPackageItem[] = [
  {
    id: 'light-stage-glow',
    name: 'Ambient Glow Stage & Mood Truss Rig',
    price: 180000,
    description: 'Warm ambient stage washes, dual totem truss glow cylinders, and soft architectural backdrops for receptions and banquet halls.',
    inclusions: ['4x RGBWA+UV Stage Washes', '2x Illuminated Truss Pillars', 'DMX Master Controller', 'Certified Rigging Tech'],
    imageUrl: '/assets/aistudio/small_board_3cbf85c9.jpeg',
    isAvailable: true
  },
  {
    id: 'light-concert-beams',
    name: 'Concert Grade Moving Heads & Haze Spectacular',
    price: 350000,
    description: 'High-intensity beam moving heads, atmospheric haze generator, dynamic strobe effects, and computerized light show for club afterparties.',
    inclusions: ['8x Sharpy Moving Beams', '1x Water-based Fine Haze Machine', 'Laser Array Unit', 'Dedicated Lighting Designer on Site'],
    imageUrl: '/assets/aistudio/afterparty_team_ac9b2157.jpeg',
    isAvailable: true
  },
  {
    id: 'light-uplight-par',
    name: 'Intimate Warm Amber Uplighting (12 Fixtures)',
    price: 95000,
    description: 'Subtle perimeter wall washes transforming any venue into a warm, opulent, photo-ready sanctuary.',
    inclusions: ['12x Battery Wireless LED Uplights', 'Custom Gold/Amber Warm Color Balance', 'Full-Day Battery Runtime'],
    imageUrl: '/assets/aistudio/drink_carrier_board_4490446f.jpeg',
    isAvailable: true
  },
  {
    id: 'light-bespoke-architectural',
    name: 'Grand Arena Architectural & Special FX Lighting',
    price: null, // Requires custom quotation
    description: 'Custom large outdoor estate or stadium lighting, architectural flood washes, and special effects tailored to your venue.',
    inclusions: ['Custom Site Survey Required', 'Power Distribution Unit', 'High-Lumen Floods', 'Lighting Director'],
    imageUrl: '/assets/aistudio/afterparty_team_ac9b2157.jpeg',
    isAvailable: true
  }
];

// Real costume and uniform rentals based on actual business photos
const INITIAL_COSTUMES: CostumeRentalItem[] = [
  {
    id: 'cst-purple-harem',
    name: 'Royal Purple & Gold Tassel Harem Costume',
    description: 'Exquisite purple velvet and sequin halter crop tops with matching slit skirts, gold tassels, and veiled face masks. Sensational for afterparty performers.',
    rentalPrice: 45000,
    rentalDuration: '1 Event Day (24 hrs)',
    conditions: 'Available in sets of 2 to 6 outfits. Dry-cleaning included in rental fee.',
    imageUrl: '/assets/aistudio/purple_costume_0e01cfac.jpeg',
    isAvailable: true
  },
  {
    id: 'cst-gold-fringe',
    name: 'Golden Sun Fringe Afterparty Attire',
    description: 'Bright canary-yellow and gold two-piece rompers and fringe mini dresses with arm sleeves. High energy visual impact for hype performers.',
    rentalPrice: 40000,
    rentalDuration: '1 Event Day',
    conditions: 'Available in fitted sizes S through L. Hand wash treated.',
    imageUrl: '/assets/aistudio/gold_costume_70f42908.jpeg',
    isAvailable: true
  },
  {
    id: 'cst-black-gold-fringe',
    name: 'Midnight Black & Gold Fringe Bottle Girl Attire',
    description: 'Black halter bandeau tops adorned with golden bead breastplates, shoulder tassels, and flirty matching flare skater skirts.',
    rentalPrice: 40000,
    rentalDuration: '1 Event Day',
    conditions: 'Complete with arm cuffs. Security deposit required.',
    imageUrl: '/assets/aistudio/black_costume_c34757cd.jpeg',
    isAvailable: true
  },
  {
    id: 'cst-white-feather-gown',
    name: 'White Feathered Champagne Hostess Dress',
    description: 'Pure white halter neck cocktail dresses accented with delicate lace bodice and feather fringe hems. Perfect for royal toasts and VIP bottle service.',
    rentalPrice: 45000,
    rentalDuration: '1 Event Day',
    conditions: 'Available in coordinated sets of 4. Professional care only.',
    imageUrl: '/assets/aistudio/white_champagne_gown_standing_506b0fbc.jpeg',
    isAvailable: true
  },
  {
    id: 'cst-green-bottlegirl',
    name: 'Emerald Green Crop Jacket & Shorts Set',
    description: 'Edgy green patterned crop jacket and shorts ensemble styled for club afterparties and high-energy VIP table hosting.',
    rentalPrice: 35000,
    rentalDuration: '1 Event Day',
    conditions: 'Standard sizing with stretch fit.',
    imageUrl: '/assets/aistudio/green_bottlegirl_costume_8f729841.jpeg',
    isAvailable: true
  },
  {
    id: 'cst-ankara-ceremonial',
    name: 'Traditional Ankara Skirt & Coral Bead Usher Regalia',
    description: 'White ceremonial blouses paired with vibrant floral Ankara patterned flared skirts, traditional coral neck beads, and head circlets.',
    rentalPrice: 25000,
    rentalDuration: '1 Event Day',
    conditions: 'Ideal for traditional weddings, burials, and cultural celebrations in Delta State.',
    imageUrl: '/assets/aistudio/5_ushers_76d2682c.jpeg',
    isAvailable: true
  },
  {
    id: 'cst-corporate-vest',
    name: 'Corporate Black Vest & Scarf Hostess Uniform',
    description: 'Tailored black waistcoats, crisp white long-sleeve collared shirts, matching formal skirts, and elegant patterned neck scarves.',
    rentalPrice: 20000,
    rentalDuration: '1 Event Day',
    conditions: 'Suited for corporate dinners, Sunday thanksgiving services, and formal galas.',
    imageUrl: '/assets/aistudio/ushers_for_sunday_c3213695.jpeg',
    isAvailable: true
  }
];

// Real Mascots from video & photo assets
const INITIAL_MASCOTS: MascotItem[] = [
  {
    id: 'msc-gorilla-hype',
    name: 'King Kong Giant Hype Gorilla Mascot',
    description: 'Our iconic hype gorilla mascot! Massive, animated, energetic crowd-pleaser that dominates the dancefloor and hypes guests to maximum euphoria.',
    rentalPrice: 60000,
    imageUrl: '/assets/aistudio/afterparty_team_ac9b2157.jpeg',
    videoUrl: '/assets/aistudio/gorrilla_and_other_mascots_fee51748.mp4',
    isAvailable: true
  },
  {
    id: 'msc-party-crew',
    name: 'Fantasy Character Mascots (Panda, Spiderman, Mario, Bumblebee)',
    description: 'Engaging character mascots including Giant Panda, Acrobat Spiderman, Super Mario, and Transformer Bumblebee. Perfect for festivals, birthdays, and wedding entries.',
    rentalPrice: 55000,
    videoUrl: '/assets/aistudio/gorrilla_and_other_mascots_fee51748.mp4',
    imageUrl: '/assets/aistudio/afterparty_team_ac9b2157.jpeg',
    isAvailable: true
  }
];

// Boards & Serving Accessories Rentals
const INITIAL_ACCESSORIES: AccessoryRentalItem[] = [
  {
    id: 'acc-silver-bowls',
    name: 'Silver Serving Bowls (Set of 5)',
    description: 'Polished stainless steel serving bowls with handles, ideal for ice chilling champagne, beers, juices, and table refreshment delivery. Rate: ₦2,000 each.',
    rentalPrice: 10000,
    category: 'bowls',
    imageUrl: '/assets/aistudio/silver_bowl_3f2e880f.jpeg',
    isAvailable: true
  },
  {
    id: 'acc-gold-bowls',
    name: 'Gold-Coloured Serving Bowls (Set of 5)',
    description: 'Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality. Rate: ₦2,500 each.',
    rentalPrice: 12500,
    category: 'bowls',
    videoUrl: '/assets/aistudio/gold_bowls_2428a428.mp4',
    isAvailable: true
  },
  {
    id: 'acc-drink-carrier-board',
    name: 'Illuminated LED Drink Carrier Display Board',
    description: 'Eye-catching LED bottle carrier board with multi-color marquee lighting ("PIECE OF MY HEART / CIROC / BELAIRE / ACE / PERIGNON") for show-stopping table entries.',
    rentalPrice: 35000,
    category: 'board',
    imageUrl: '/assets/aistudio/drink_carrier_board_4490446f.jpeg',
    isAvailable: true
  },
  {
    id: 'acc-crown-screen-board',
    name: 'Crown-Crested Hype Video Board',
    description: 'Illuminated neon frame board with integrated video screen and crown crest for customizable client names, animated visuals, and afterparty shoutouts.',
    rentalPrice: 40000,
    category: 'board',
    imageUrl: '/assets/aistudio/small_board_3cbf85c9.jpeg',
    isAvailable: true
  }
];

// Real Media Gallery Repository using all verified uploaded assets
const INITIAL_GALLERY: MediaItem[] = [
  {
    id: 'med-logo',
    title: 'DKWEENS DELIGHTS ENTERPRISES Official Emblem',
    caption: 'Official crown crest and slogan: WE PLAN • WE CREATE • YOU CELEBRATE. Tel: 09061453586',
    category: 'all',
    mediaType: 'image',
    url: '/assets/aistudio/my_logo_f5406092.jpeg',
    featuredOnHome: true,
    order: 1,
    createdAt: '2026-10-26T12:00:00.000Z'
  },
  {
    id: 'med-mascots-video',
    title: 'Live Hype Gorilla & Character Mascots in Action',
    caption: 'Real event video featuring our King Kong Gorilla, Spiderman, Giant Panda, and Mario hyping the crowd.',
    category: 'mascots',
    mediaType: 'video',
    url: '/assets/aistudio/gorrilla_and_other_mascots_fee51748.mp4',
    featuredOnHome: true,
    order: 2,
    createdAt: '2026-10-26T12:05:00.000Z'
  },
  {
    id: 'med-gold-bowls-video',
    title: 'Gold-Coloured Serving Bowls with Chilled Drinks',
    caption: 'Pedestal gold-coloured serving bowls filled with ice and assorted beverages for elegant table presentations and VIP hospitality.',
    category: 'serving_bowls',
    mediaType: 'video',
    url: '/assets/aistudio/gold_bowls_2428a428.mp4',
    featuredOnHome: true,
    order: 3,
    createdAt: '2026-10-26T12:10:00.000Z'
  },
  {
    id: 'med-afterparty-team',
    title: 'DKWEENS Afterparty Crew & Mascots',
    caption: 'Complete afterparty crew with gold sequin dancers, LED props, Marshmello head, and hype board.',
    category: 'afterparty',
    mediaType: 'image',
    url: '/assets/aistudio/afterparty_team_ac9b2157.jpeg',
    featuredOnHome: true,
    order: 4,
    createdAt: '2026-10-26T12:15:00.000Z'
  },
  {
    id: 'med-white-champagne-standing',
    title: 'Champagne Girls in Feathered Cocktail Gowns',
    caption: 'Graceful hospitality hostesses in matching white feathered cocktail dresses ready for VIP bottle service.',
    category: 'champagne_girls',
    mediaType: 'image',
    url: '/assets/aistudio/white_champagne_gown_standing_506b0fbc.jpeg',
    featuredOnHome: true,
    order: 5,
    createdAt: '2026-10-26T12:20:00.000Z'
  },
  {
    id: 'med-white-champagne-sitting',
    title: 'Champagne Hostesses at VIP Lounge',
    caption: 'VIP champagne girls seated in luxury lounge setting for toast and beverage coordination.',
    category: 'champagne_girls',
    mediaType: 'image',
    url: '/assets/aistudio/white_champagne_gown_sitting_d19493e9.jpeg',
    featuredOnHome: false,
    order: 6,
    createdAt: '2026-10-26T12:25:00.000Z'
  },
  {
    id: 'med-ushers-ankara',
    title: 'Traditional Ankara & Coral Bead Ushers',
    caption: '5 beautiful ushers in white blouses, floral Ankara skirts, and traditional coral bead crowns.',
    category: 'ushers',
    mediaType: 'image',
    url: '/assets/aistudio/5_ushers_76d2682c.jpeg',
    featuredOnHome: true,
    order: 7,
    createdAt: '2026-10-26T12:30:00.000Z'
  },
  {
    id: 'med-ushers-corporate',
    title: 'Corporate Vest & Silk Scarf Ushers',
    caption: 'Refined corporate hostess team in tailored black waistcoats, white shirts, and matching scarves.',
    category: 'ushers',
    mediaType: 'image',
    url: '/assets/aistudio/ushers_for_sunday_c3213695.jpeg',
    featuredOnHome: false,
    order: 8,
    createdAt: '2026-10-26T12:35:00.000Z'
  },
  {
    id: 'med-ushers-memorial',
    title: 'Ceremonial & Memorial Event Ushers',
    caption: '8 hostesses in black high-neck tops, purple/green Ankara skirts, and coral beads for solemn tribute service.',
    category: 'ushers',
    mediaType: 'image',
    url: '/assets/aistudio/ushers_for_burial_119e6e5a.jpeg',
    featuredOnHome: false,
    order: 9,
    createdAt: '2026-10-26T12:40:00.000Z'
  },
  {
    id: 'med-usher-video',
    title: 'Event Usher on Duty',
    caption: 'Short clip of a DKWEENS hostess smiling on site at a celebration.',
    category: 'ushers',
    mediaType: 'video',
    url: '/assets/aistudio/one_usher_59339047.mp4',
    featuredOnHome: false,
    order: 10,
    createdAt: '2026-10-26T12:45:00.000Z'
  },
  {
    id: 'med-silver-bowls',
    title: 'Silver Serving Bowls with Chilled Beverages',
    caption: 'Sets of stainless steel silver serving bowls filled with ice and assortment of drinks (₦2,000 each).',
    category: 'serving_bowls',
    mediaType: 'image',
    url: '/assets/aistudio/silver_bowl_3f2e880f.jpeg',
    featuredOnHome: true,
    order: 11,
    createdAt: '2026-10-26T12:50:00.000Z'
  },
  {
    id: 'med-purple-costumes',
    title: 'Purple Velvet & Gold Sequin Harem Dancers',
    caption: '4 afterparty dancers in royal purple velvet, gold tassels, and veiled face masks.',
    category: 'costumes',
    mediaType: 'image',
    url: '/assets/aistudio/purple_costume_0e01cfac.jpeg',
    featuredOnHome: true,
    order: 12,
    createdAt: '2026-10-26T12:55:00.000Z'
  },
  {
    id: 'med-gold-costumes',
    title: 'Golden Sun Fringe Celebration Costumes',
    caption: '3 dancers in dazzling gold fringe outfits posing on staircase before afterparty entrance.',
    category: 'costumes',
    mediaType: 'image',
    url: '/assets/aistudio/gold_costume_70f42908.jpeg',
    featuredOnHome: false,
    order: 13,
    createdAt: '2026-10-26T13:00:00.000Z'
  },
  {
    id: 'med-black-costumes',
    title: 'Midnight Black & Gold Fringe Attire',
    caption: 'Bottle girls in black and gold bead fringe costumes.',
    category: 'costumes',
    mediaType: 'image',
    url: '/assets/aistudio/black_costume_c34757cd.jpeg',
    featuredOnHome: false,
    order: 14,
    createdAt: '2026-10-26T13:05:00.000Z'
  },
  {
    id: 'med-green-bottlegirl',
    title: 'Emerald Green Crop Jacket & Shorts Uniform',
    caption: 'High-energy bottle hostess uniform with knee-high boots for club afterparties.',
    category: 'costumes',
    mediaType: 'image',
    url: '/assets/aistudio/green_bottlegirl_costume_8f729841.jpeg',
    featuredOnHome: false,
    order: 15,
    createdAt: '2026-10-26T13:10:00.000Z'
  },
  {
    id: 'med-carrier-board',
    title: 'Illuminated LED Drink Carrier Board',
    caption: 'Illuminated LED board with built-in bottle carriers for Ciroc, Belaire, Ace of Spades, Dom Perignon.',
    category: 'boards',
    mediaType: 'image',
    url: '/assets/aistudio/drink_carrier_board_4490446f.jpeg',
    featuredOnHome: true,
    order: 16,
    createdAt: '2026-10-26T13:15:00.000Z'
  },
  {
    id: 'med-small-board',
    title: 'Crown-Crested LED Afterparty Video Board',
    caption: 'Performer holding our animated crown-crested afterparty board with glowing perimeter lighting.',
    category: 'boards',
    mediaType: 'image',
    url: '/assets/aistudio/small_board_3cbf85c9.jpeg',
    featuredOnHome: false,
    order: 17,
    createdAt: '2026-10-26T13:20:00.000Z'
  }
];

const INITIAL_SETTINGS: SystemSettings = {
  brandName: 'DKWEENS DELIGHTS ENTERPRISES',
  slogan: 'WE PLAN • WE CREATE • YOU CELEBRATE.',
  location: 'Warri, Delta State, Nigeria',
  baseServiceArea: 'Warri, Delta State',
  serviceAreaDescription: 'Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria. Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.',
  currency: 'NGN',
  currencySymbol: '₦',
  adminEmail: 'admin@dkweensdelights.ng',
  contactPhone: '09061453586',
  whatsappNumber: '2349061453586',
  notificationEmailSimulation: true,
  notes: 'Official pricing snapshot rules enforced. Silver Serving Bowls: ₦2,000 each; Gold-Coloured Serving Bowls with Chilled Drinks: ₦2,500 each. Events outside our normal Warri service area require separate travel, accommodation, and logistics assessment before quotation confirmation.'
};

const SEED_BOOKINGS: BookingRecord[] = [
  {
    id: 'book-seed-1',
    reference: 'DK-2026-9041',
    createdAt: '2026-10-25T14:30:00.000Z',
    updatedAt: '2026-10-25T16:15:00.000Z',
    customerName: 'Babajide Adeleke',
    customerEmail: 'badeleke@example.com',
    customerPhone: '+234 803 111 2233',
    eventType: 'High Society Wedding Afterparty',
    eventDate: '2026-11-28',
    venueName: 'KFT Place Event Centre',
    venueAddress: 'Airport Road, Warri, Delta State',
    destinationCity: 'Warri',
    isOutsideServiceArea: false,
    guestCount: 350,
    budget: 1500000,
    additionalRequirements: 'Need high-energy hype during midnight cake cutting. Please prioritize synchronized bottle entrance with gold-coloured serving bowls.',
    selectedPackageId: 'pkg-1',
    selectedPackageName: 'Package 1 — Premium Experience',
    packagePriceSnapshot: 1000000,
    packageInclusionsSnapshot: [
      'Couples mix',
      'Gorilla',
      'Power bike',
      'Fire dancer',
      'LED costumes',
      'Afterparty props',
      'Board',
      'Lights',
      'Bottle girls'
    ],
    selectedServices: [
      {
        serviceId: 'srv-ushers',
        serviceName: 'Professional Event Ushers',
        category: 'staff',
        quantity: 6,
        unitPrice: 17000,
        lineTotal: 102000,
        notes: 'Traditional Ankara skirts with coral beads'
      },
      {
        serviceId: 'srv-bouncers',
        serviceName: 'Executive Event Bouncers & Security',
        category: 'staff',
        quantity: 4,
        unitPrice: 30000,
        lineTotal: 120000,
        notes: 'VIP lounge access control'
      },
      {
        serviceId: 'srv-serving-bowls',
        serviceName: 'Gold-Coloured Serving Bowls',
        category: 'equipment',
        quantity: 4,
        selectedOption: 'Gold-Coloured Serving Bowls',
        unitPrice: 2500,
        lineTotal: 10000
      }
    ],
    subtotalPricedItems: 1232000,
    hasUnpricedItems: false,
    unpricedItemsList: [],
    travelStatus: 'included',
    itemizedCharges: [],
    totalItemizedCharges: 0,
    grandTotal: 1232000,
    isQuotationComplete: true,
    status: 'Approved',
    adminNotes: 'Booking verified and approved for Warri reception. Down payment confirmed.',
    reviewedBy: 'Operations Director',
    reviewedAt: '2026-10-25T16:15:00.000Z'
  },
  {
    id: 'book-seed-2',
    reference: 'DK-2026-4820',
    createdAt: '2026-10-26T10:00:00.000Z',
    updatedAt: '2026-10-26T10:00:00.000Z',
    customerName: 'Ngozi Okonkwo',
    customerEmail: 'ngozi.o@domain.ng',
    customerPhone: '+234 812 456 7890',
    eventType: '40th Milestone Birthday Celebration',
    eventDate: '2026-12-12',
    venueName: 'Grand Hotel Convention Hall',
    venueAddress: 'Nnebisi Road, Asaba, Delta State',
    destinationCity: 'Asaba',
    isOutsideServiceArea: true,
    guestCount: 200,
    budget: 1200000,
    additionalRequirements: 'Event is taking place in Asaba (outside normal Warri corridor). Need transportation and accommodation quote for performers and staff.',
    selectedPackageId: 'pkg-3',
    selectedPackageName: 'Package 3 — Gold Experience',
    packagePriceSnapshot: 750000,
    packageInclusionsSnapshot: [
      'Gorilla',
      'Fire dancer',
      'LED costumes',
      'Afterparty props',
      'Board',
      'Lights',
      'Bottle girls'
    ],
    selectedServices: [
      {
        serviceId: 'srv-champagne-girls',
        serviceName: 'Champagne Girls & Bottle Girls',
        category: 'staff',
        quantity: 4,
        unitPrice: 17000,
        lineTotal: 68000
      },
      {
        serviceId: 'srv-serving-bowls',
        serviceName: 'Silver Serving Bowls',
        category: 'equipment',
        quantity: 4,
        selectedOption: 'Silver Serving Bowls',
        unitPrice: 2000,
        lineTotal: 8000
      }
    ],
    subtotalPricedItems: 826000,
    hasUnpricedItems: false,
    unpricedItemsList: [],
    travelStatus: 'pending_assessment',
    itemizedCharges: [],
    totalItemizedCharges: 0,
    grandTotal: null,
    isQuotationComplete: false,
    status: 'Awaiting Quotation',
    adminNotes: 'Outside normal Warri service area (Asaba). Awaiting logistics coordinator travel and accommodation assessment.',
    reviewedBy: null,
    reviewedAt: null
  }
];

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-1',
    createdAt: '2026-10-26T17:00:00.000Z',
    customerName: 'Babajide Adeleke',
    serviceUsed: 'Package 1 — Premium Experience & Ushers',
    rating: 5,
    reviewText: 'DKWEENS DELIGHTS made our wedding afterparty in Warri absolutely legendary. The hype gorilla mascot, LED bottle girls, and gold-coloured serving bowls were delivered with incredible royal class.',
    bookingReference: 'DK-2026-9041',
    isVerified: true,
    status: 'approved',
    approvedAt: '2026-10-26T17:30:00.000Z',
    approvedBy: 'Lead Operations Director',
    adminNotes: 'Transaction verified against completed booking DK-2026-9041.'
  },
  {
    id: 'rev-2',
    createdAt: '2026-10-27T08:30:00.000Z',
    customerName: 'Oghenetega E.',
    serviceUsed: 'Professional Event Ushers & Gold-Coloured Serving Bowls',
    rating: 5,
    reviewText: 'The ushers were impeccably dressed in traditional Ankara skirts with coral beads, courteous to our elders, and organized the VIP seating effortlessly.',
    bookingReference: null,
    isVerified: false,
    status: 'pending',
    approvedAt: null,
    approvedBy: null,
    adminNotes: 'Awaiting administrator verification and approval.'
  }
];

const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-adm-1',
    timestamp: '2026-10-26T10:00:05.000Z',
    type: 'booking_request',
    title: 'New Booking Request: DK-2026-4820',
    customerName: 'Ngozi Okonkwo',
    customerEmail: 'ngozi.o@domain.ng',
    customerPhone: '+234 812 456 7890',
    serviceName: 'Package 3 — Gold Experience & Silver Serving Bowls',
    eventDate: '2026-12-12',
    eventLocation: 'Grand Hotel Convention Hall, Asaba',
    referenceCode: 'DK-2026-4820',
    status: 'In Progress',
    isRead: false,
    emailDeliveryStatus: 'unconfigured_simulated',
    details: 'Customer requested 40th Milestone Birthday celebration in Asaba. Requires administrator travel & accommodation quote.'
  },
  {
    id: 'notif-adm-2',
    timestamp: '2026-10-26T09:15:05.000Z',
    type: 'service_enquiry',
    title: 'Service Enquiry from Chukwuma Obi',
    customerName: 'Chukwuma Obi',
    customerEmail: 'chuks.obi@gmail.com',
    customerPhone: '+234 809 998 8776',
    serviceName: 'Ushers and Silver Serving Bowls',
    eventDate: null,
    eventLocation: 'Effurun, Delta State',
    referenceCode: null,
    status: 'New',
    isRead: false,
    emailDeliveryStatus: 'unconfigured_simulated',
    details: 'Enquiry for 8 ushers in traditional Ankara attire and 10 silver serving bowls for wedding in Effurun.'
  },
  {
    id: 'notif-adm-3',
    timestamp: '2026-10-27T08:30:05.000Z',
    type: 'review_submission',
    title: 'New Client Review Pending Approval',
    customerName: 'Oghenetega E.',
    customerEmail: 'client@example.com',
    customerPhone: '',
    serviceName: 'Professional Event Ushers & Gold-Coloured Serving Bowls',
    eventDate: null,
    eventLocation: 'Warri',
    referenceCode: null,
    status: 'Pending Review',
    isRead: false,
    emailDeliveryStatus: 'unconfigured_simulated',
    details: 'Customer submitted a 5-star review. Requires administrator moderation before public display.'
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    this.ensureDirectory();
    
    // Always initialize/ensure correct DKWEENS branding & real uploaded media
    const freshDb: DatabaseSchema = {
      packages: INITIAL_PACKAGES,
      services: INITIAL_SERVICES,
      lightingPackages: INITIAL_LIGHTING,
      costumes: INITIAL_COSTUMES,
      mascots: INITIAL_MASCOTS,
      accessories: INITIAL_ACCESSORIES,
      galleryMedia: INITIAL_GALLERY,
      bookings: SEED_BOOKINGS,
      enquiries: [
        {
          id: 'enq-1',
          createdAt: '2026-10-26T09:15:00.000Z',
          name: 'Chukwuma Obi',
          email: 'chuks.obi@gmail.com',
          phone: '+234 809 998 8776',
          subject: 'Ushers and Silver Serving Bowls for Warri Wedding',
          message: 'Hello DKWEENS DELIGHTS team, I am planning a wedding reception in Effurun for 250 guests. We need 8 ushers in traditional Ankara skirts with coral beads and 10 silver serving bowls.',
          status: 'new'
        }
      ],
      notifications: [
        {
          id: 'notif-1',
          timestamp: '2026-10-25T14:30:05.000Z',
          bookingReference: 'DK-2026-9041',
          type: 'customer_acknowledgement',
          recipient: 'badeleke@example.com',
          channel: 'email_simulation',
          status: 'delivered',
          subject: 'DKWEENS DELIGHTS Booking Request Received [DK-2026-9041]',
          details: 'Official booking request registered. Quotation snapshot created and client notified that review is in progress.'
        },
        {
          id: 'notif-2',
          timestamp: '2026-10-26T10:00:05.000Z',
          bookingReference: 'DK-2026-4820',
          type: 'admin_alert',
          recipient: 'admin@dkweensdelights.ng',
          channel: 'in_app',
          status: 'delivered',
          subject: 'Travel Assessment Required: DK-2026-4820 (Asaba)',
          details: 'Event outside base service area flagged for separate travel cost and accommodation logistics assessment.'
        }
      ],
      adminNotifications: INITIAL_ADMIN_NOTIFICATIONS,
      reviews: INITIAL_REVIEWS,
      settings: INITIAL_SETTINGS
    };

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Preserve user-added bookings/enquiries while enforcing official DKWEENS packages, services, gallery, and settings
        const loaded: DatabaseSchema = {
          packages: INITIAL_PACKAGES,
          services: INITIAL_SERVICES,
          lightingPackages: parsed.lightingPackages || INITIAL_LIGHTING,
          costumes: INITIAL_COSTUMES,
          mascots: INITIAL_MASCOTS,
          accessories: INITIAL_ACCESSORIES,
          galleryMedia: INITIAL_GALLERY,
          bookings: parsed.bookings && parsed.bookings.length > 0 ? parsed.bookings : SEED_BOOKINGS,
          enquiries: parsed.enquiries && parsed.enquiries.length > 0 ? parsed.enquiries : freshDb.enquiries,
          notifications: parsed.notifications && parsed.notifications.length > 0 ? parsed.notifications : freshDb.notifications,
          adminNotifications: parsed.adminNotifications && parsed.adminNotifications.length > 0 ? parsed.adminNotifications : INITIAL_ADMIN_NOTIFICATIONS,
          reviews: parsed.reviews && parsed.reviews.length > 0 ? parsed.reviews : INITIAL_REVIEWS,
          settings: INITIAL_SETTINGS
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(loaded, null, 2), 'utf-8');
        return loaded;
      } catch (err) {
        console.error('Failed to parse database file, reinitializing with DKWEENS DELIGHTS seed data', err);
      }
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(freshDb, null, 2), 'utf-8');
    return freshDb;
  }

  saveDatabase() {
    this.ensureDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // --- Packages ---
  getPackages(): PackageItem[] {
    return this.data.packages;
  }

  getPackageById(id: string): PackageItem | undefined {
    return this.data.packages.find(p => p.id === id);
  }

  updatePackage(id: string, updates: Partial<PackageItem>): PackageItem | null {
    const idx = this.data.packages.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.packages[idx] = { ...this.data.packages[idx], ...updates };
    this.saveDatabase();
    return this.data.packages[idx];
  }

  // --- Services ---
  getServices(): StandardServiceItem[] {
    return this.data.services;
  }

  getServiceById(id: string): StandardServiceItem | undefined {
    return this.data.services.find(s => s.id === id);
  }

  updateService(id: string, updates: Partial<StandardServiceItem>): StandardServiceItem | null {
    const idx = this.data.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.saveDatabase();
    return this.data.services[idx];
  }

  // --- Lighting ---
  getLightingPackages(): LightingPackageItem[] {
    return this.data.lightingPackages;
  }

  addLightingPackage(item: Omit<LightingPackageItem, 'id'>): LightingPackageItem {
    const newItem: LightingPackageItem = {
      id: `light-${Date.now()}`,
      ...item
    };
    this.data.lightingPackages.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  updateLightingPackage(id: string, updates: Partial<LightingPackageItem>): LightingPackageItem | null {
    const idx = this.data.lightingPackages.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.data.lightingPackages[idx] = { ...this.data.lightingPackages[idx], ...updates };
    this.saveDatabase();
    return this.data.lightingPackages[idx];
  }

  // --- Costumes ---
  getCostumes(): CostumeRentalItem[] {
    return this.data.costumes;
  }

  addCostume(item: Omit<CostumeRentalItem, 'id'>): CostumeRentalItem {
    const newItem: CostumeRentalItem = {
      id: `cst-${Date.now()}`,
      ...item
    };
    this.data.costumes.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  updateCostume(id: string, updates: Partial<CostumeRentalItem>): CostumeRentalItem | null {
    const idx = this.data.costumes.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.costumes[idx] = { ...this.data.costumes[idx], ...updates };
    this.saveDatabase();
    return this.data.costumes[idx];
  }

  // --- Mascots ---
  getMascots(): MascotItem[] {
    return this.data.mascots;
  }

  addMascot(item: Omit<MascotItem, 'id'>): MascotItem {
    const newItem: MascotItem = {
      id: `msc-${Date.now()}`,
      ...item
    };
    this.data.mascots.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  updateMascot(id: string, updates: Partial<MascotItem>): MascotItem | null {
    const idx = this.data.mascots.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.mascots[idx] = { ...this.data.mascots[idx], ...updates };
    this.saveDatabase();
    return this.data.mascots[idx];
  }

  // --- Accessories (Bowls, Boards) ---
  getAccessories(): AccessoryRentalItem[] {
    return this.data.accessories || INITIAL_ACCESSORIES;
  }

  // --- Media Gallery Manager ---
  getGalleryMedia(): MediaItem[] {
    return (this.data.galleryMedia || INITIAL_GALLERY).sort((a, b) => a.order - b.order);
  }

  addGalleryMedia(media: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...media
    };
    if (!this.data.galleryMedia) this.data.galleryMedia = [];
    this.data.galleryMedia.unshift(newMedia);
    this.saveDatabase();
    return newMedia;
  }

  updateGalleryMedia(id: string, updates: Partial<MediaItem>): MediaItem | null {
    if (!this.data.galleryMedia) return null;
    const idx = this.data.galleryMedia.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.galleryMedia[idx] = { ...this.data.galleryMedia[idx], ...updates };
    this.saveDatabase();
    return this.data.galleryMedia[idx];
  }

  deleteGalleryMedia(id: string): boolean {
    if (!this.data.galleryMedia) return false;
    const initialLen = this.data.galleryMedia.length;
    this.data.galleryMedia = this.data.galleryMedia.filter(m => m.id !== id);
    if (this.data.galleryMedia.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- Bookings & Quotations ---
  getBookings(): BookingRecord[] {
    return this.data.bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getBookingByReference(reference: string): BookingRecord | undefined {
    return this.data.bookings.find(b => b.reference.toUpperCase() === reference.toUpperCase());
  }

  getBookingById(id: string): BookingRecord | undefined {
    return this.data.bookings.find(b => b.id === id);
  }

  createBooking(booking: BookingRecord): BookingRecord {
    this.data.bookings.unshift(booking);
    this.saveDatabase();
    return booking;
  }

  updateBooking(id: string, updates: Partial<BookingRecord>): BookingRecord | null {
    const idx = this.data.bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.bookings[idx] = {
      ...this.data.bookings[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.bookings[idx];
  }

  // --- Enquiries ---
  getEnquiries(): EnquiryRecord[] {
    return this.data.enquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createEnquiry(enquiry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>): EnquiryRecord {
    const newEnquiry: EnquiryRecord = {
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      ...enquiry
    };
    this.data.enquiries.unshift(newEnquiry);
    this.saveDatabase();
    return newEnquiry;
  }

  updateEnquiry(id: string, updates: Partial<EnquiryRecord>): EnquiryRecord | null {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.enquiries[idx] = { ...this.data.enquiries[idx], ...updates };
    this.saveDatabase();
    return this.data.enquiries[idx];
  }

  // --- Notifications ---
  getNotifications(): NotificationLog[] {
    return this.data.notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addNotification(notif: Omit<NotificationLog, 'id' | 'timestamp'>): NotificationLog {
    const newNotif: NotificationLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...notif
    };
    this.data.notifications.unshift(newNotif);
    this.saveDatabase();
    return newNotif;
  }

  // --- Reviews Management ---
  getReviews(): ReviewRecord[] {
    return (this.data.reviews || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getApprovedReviews(): ReviewRecord[] {
    return (this.data.reviews || [])
      .filter(r => r.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getReviewById(id: string): ReviewRecord | undefined {
    return (this.data.reviews || []).find(r => r.id === id);
  }

  verifyBookingReference(reference: string): BookingRecord | null {
    if (!reference || !reference.trim()) return null;
    const cleanRef = reference.trim().toUpperCase();
    const found = (this.data.bookings || []).find(b => b.reference.toUpperCase() === cleanRef);
    return found || null;
  }

  checkDuplicateReview(customerName: string, reviewText: string, bookingReference?: string | null): boolean {
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    return (this.data.reviews || []).some(r => {
      const reviewTime = new Date(r.createdAt).getTime();
      const isRecent = (now - reviewTime) < fifteenMinutes;
      if (!isRecent) return false;
      if (bookingReference && r.bookingReference && r.bookingReference.toUpperCase() === bookingReference.toUpperCase()) {
        return true;
      }
      return r.customerName.toLowerCase() === customerName.toLowerCase() &&
             r.reviewText.trim().toLowerCase() === reviewText.trim().toLowerCase();
    });
  }

  createReview(review: Omit<ReviewRecord, 'id' | 'createdAt' | 'status' | 'approvedAt' | 'approvedBy'> & { isVerified?: boolean }): ReviewRecord {
    if (!this.data.reviews) this.data.reviews = [];
    
    // Auto-verify if valid booking reference exists in database
    let isVerified = Boolean(review.isVerified);
    if (review.bookingReference) {
      const booking = this.verifyBookingReference(review.bookingReference);
      if (booking) {
        isVerified = true;
      }
    }

    const newReview: ReviewRecord = {
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customerName: review.customerName.trim(),
      serviceUsed: review.serviceUsed.trim(),
      rating: Math.max(1, Math.min(5, Math.round(review.rating))),
      reviewText: review.reviewText.trim(),
      bookingReference: review.bookingReference ? review.bookingReference.trim().toUpperCase() : null,
      isVerified,
      status: 'pending', // Strictly default to pending approval
      approvedAt: null,
      approvedBy: null,
      adminNotes: review.adminNotes || (isVerified ? 'Booking reference validated against database.' : 'Pending administrator review.')
    };

    this.data.reviews.unshift(newReview);
    this.saveDatabase();
    return newReview;
  }

  updateReview(id: string, updates: Partial<ReviewRecord>): ReviewRecord | null {
    if (!this.data.reviews) return null;
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;

    this.data.reviews[idx] = {
      ...this.data.reviews[idx],
      ...updates
    };

    this.saveDatabase();
    return this.data.reviews[idx];
  }

  deleteReview(id: string): boolean {
    if (!this.data.reviews) return false;
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    if (this.data.reviews.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- Admin Notifications Center ---
  getAdminNotifications(): AdminNotification[] {
    return (this.data.adminNotifications || []).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getAdminNotificationById(id: string): AdminNotification | undefined {
    return (this.data.adminNotifications || []).find(n => n.id === id);
  }

  createAdminNotification(notif: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead'>): AdminNotification {
    if (!this.data.adminNotifications) this.data.adminNotifications = [];

    // Duplicate check: avoid repeating the identical notification for the same action within 5 minutes
    const now = Date.now();
    const existing = this.data.adminNotifications.find(n => 
      n.type === notif.type &&
      n.title === notif.title &&
      n.customerEmail === notif.customerEmail &&
      n.referenceCode === notif.referenceCode &&
      (now - new Date(n.timestamp).getTime()) < 5 * 60 * 1000
    );

    if (existing) {
      return existing;
    }

    const newNotif: AdminNotification = {
      id: `notif-adm-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notif
    };

    this.data.adminNotifications.unshift(newNotif);
    this.saveDatabase();
    return newNotif;
  }

  updateAdminNotification(id: string, updates: Partial<AdminNotification>): AdminNotification | null {
    if (!this.data.adminNotifications) return null;
    const idx = this.data.adminNotifications.findIndex(n => n.id === id);
    if (idx === -1) return null;

    this.data.adminNotifications[idx] = {
      ...this.data.adminNotifications[idx],
      ...updates
    };

    this.saveDatabase();
    return this.data.adminNotifications[idx];
  }

  markAdminNotificationRead(id: string, isRead = true): AdminNotification | null {
    return this.updateAdminNotification(id, { isRead });
  }

  markAllAdminNotificationsRead(): void {
    if (!this.data.adminNotifications) return;
    this.data.adminNotifications = this.data.adminNotifications.map(n => ({
      ...n,
      isRead: true
    }));
    this.saveDatabase();
  }

  deleteAdminNotification(id: string): boolean {
    if (!this.data.adminNotifications) return false;
    const initialLen = this.data.adminNotifications.length;
    this.data.adminNotifications = this.data.adminNotifications.filter(n => n.id !== id);
    if (this.data.adminNotifications.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- Settings ---
  getSettings(): SystemSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveDatabase();
    return this.data.settings;
  }
}

export const db = new DatabaseManager();
