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
  category: 'ushers' | 'champagne_girls' | 'costumes' | 'afterparty' | 'mascots' | 'serving_bowls' | 'boards' | 'all' | 'bowls' | 'afterparty_crew';
  mediaType: 'image' | 'video';
  type?: 'photo' | 'video';
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
  
  selectedPackageId: string | null;
  selectedPackageName: string | null;
  packagePriceSnapshot: number | null;
  packageInclusionsSnapshot: string[];

  selectedServices: BookingSelectedService[];

  subtotalPricedItems: number;
  hasUnpricedItems: boolean;
  unpricedItemsList: string[];
  travelStatus: 'included' | 'pending_assessment' | 'assessed';
  itemizedCharges: ItemizedCharge[];
  totalItemizedCharges: number;
  grandTotal: number | null;
  isQuotationComplete: boolean;

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

export type PageRoute = 
  | 'home'
  | 'about'
  | 'packages'
  | 'services'
  | 'rentals'
  | 'gallery'
  | 'planner'
  | 'booking'
  | 'status'
  | 'contact'
  | 'admin'
  | 'capstone-docs';
