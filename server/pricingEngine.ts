import { db, BookingRecord, BookingSelectedService, ItemizedCharge } from './db.js';

export interface PricingInputRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  destinationCity?: string;
  isOutsideServiceArea: boolean;
  guestCount?: number;
  budget?: number | null;
  additionalRequirements?: string;
  selectedPackageId?: string | null;
  selectedServices: {
    serviceId: string;
    category?: string;
    quantity: number;
    selectedOption?: string;
    notes?: string;
  }[];
}

export function generateBookingReference(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `DK-2026-${randomNum}`;
}

export function computeQuotationBreakdown(input: PricingInputRequest): {
  selectedPackageId: string | null;
  selectedPackageName: string | null;
  packagePriceSnapshot: number | null;
  packageInclusionsSnapshot: string[];
  validatedServices: BookingSelectedService[];
  subtotalPricedItems: number;
  hasUnpricedItems: boolean;
  unpricedItemsList: string[];
  travelStatus: 'included' | 'pending_assessment' | 'assessed';
  itemizedCharges: ItemizedCharge[];
  totalItemizedCharges: number;
  grandTotal: number | null;
  isQuotationComplete: boolean;
} {
  let selectedPackageName: string | null = null;
  let packagePriceSnapshot: number | null = null;
  let packageInclusionsSnapshot: string[] = [];
  let subtotalPricedItems = 0;
  const unpricedItemsList: string[] = [];

  // 1. Process Package if selected
  if (input.selectedPackageId) {
    const pkg = db.getPackageById(input.selectedPackageId);
    if (pkg && pkg.isAvailable) {
      selectedPackageName = pkg.name;
      packagePriceSnapshot = pkg.price;
      packageInclusionsSnapshot = [...pkg.inclusions];
      subtotalPricedItems += pkg.price;
    }
  }

  // 2. Validate & Compute Services
  const validatedServices: BookingSelectedService[] = [];
  const standardServices = db.getServices();
  const lightingPackages = db.getLightingPackages();
  const costumes = db.getCostumes();
  const mascots = db.getMascots();
  const accessories = db.getAccessories();

  for (const item of input.selectedServices) {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    let serviceName = '';
    let category = item.category || 'service';
    let unitPrice: number | null = null;
    let selectedOption = item.selectedOption;

    // Check standard services (including Serving Bowls)
    const standard = standardServices.find(s => s.id === item.serviceId || (item.serviceId === 'srv-serving-boats' && s.id === 'srv-serving-bowls'));
    if (standard) {
      serviceName = standard.name;
      category = standard.category;

      if (standard.id === 'srv-serving-bowls' || item.serviceId === 'srv-serving-bowls' || item.serviceId === 'srv-serving-boats') {
        if (selectedOption?.toLowerCase().includes('gold')) {
          selectedOption = 'Gold-Coloured Serving Bowls with Chilled Drinks';
          unitPrice = 2500;
          serviceName = 'Gold-Coloured Serving Bowls with Chilled Drinks';
        } else {
          selectedOption = 'Silver Serving Bowls';
          unitPrice = 2000;
          serviceName = 'Silver Serving Bowls';
        }
      } else {
        unitPrice = standard.unitPrice;
      }
    } else {
      // Check accessories (bowls, boards)
      const acc = accessories.find(a => a.id === item.serviceId);
      if (acc) {
        serviceName = acc.name;
        category = 'accessory';
        unitPrice = acc.rentalPrice;
      } else {
        // Check lighting packages
        const lighting = lightingPackages.find(l => l.id === item.serviceId);
        if (lighting) {
          serviceName = `Lighting: ${lighting.name}`;
          category = 'lighting';
          unitPrice = lighting.price;
        } else {
          // Check costumes
          const costume = costumes.find(c => c.id === item.serviceId);
          if (costume) {
            serviceName = `Costume: ${costume.name}`;
            category = 'costume';
            unitPrice = costume.rentalPrice;
          } else {
            // Check mascots
            const mascot = mascots.find(m => m.id === item.serviceId);
            if (mascot) {
              serviceName = `Mascot: ${mascot.name}`;
              category = 'mascot';
              unitPrice = mascot.rentalPrice;
            }
          }
        }
      }
    }

    if (!serviceName) {
      serviceName = `Custom Service (${item.serviceId})`;
      unitPrice = null;
    }

    let lineTotal: number | null = null;
    if (unitPrice !== null) {
      lineTotal = unitPrice * qty;
      subtotalPricedItems += lineTotal;
    } else {
      unpricedItemsList.push(serviceName);
    }

    validatedServices.push({
      serviceId: item.serviceId,
      serviceName,
      category,
      quantity: qty,
      unitPrice,
      selectedOption,
      lineTotal,
      notes: item.notes
    });
  }

  // 3. Travel & Logistics Assessment
  const travelStatus: 'included' | 'pending_assessment' | 'assessed' = 
    input.isOutsideServiceArea ? 'pending_assessment' : 'included';

  const hasUnpricedItems = unpricedItemsList.length > 0;
  const isQuotationComplete = !input.isOutsideServiceArea && !hasUnpricedItems;
  const grandTotal = isQuotationComplete ? subtotalPricedItems : null;

  return {
    selectedPackageId: input.selectedPackageId || null,
    selectedPackageName,
    packagePriceSnapshot,
    packageInclusionsSnapshot,
    validatedServices,
    subtotalPricedItems,
    hasUnpricedItems,
    unpricedItemsList,
    travelStatus,
    itemizedCharges: [],
    totalItemizedCharges: 0,
    grandTotal,
    isQuotationComplete
  };
}

export function recalculateBookingWithCharges(booking: BookingRecord): BookingRecord {
  const totalItemizedCharges = booking.itemizedCharges.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  
  const hasTravelCharge = booking.itemizedCharges.some(c => c.category === 'travel' || c.category === 'logistics');
  const travelStatus = booking.isOutsideServiceArea 
    ? (hasTravelCharge ? 'assessed' : 'pending_assessment') 
    : 'included';

  const isQuotationComplete = !booking.hasUnpricedItems && (travelStatus !== 'pending_assessment');
  const grandTotal = isQuotationComplete ? (booking.subtotalPricedItems + totalItemizedCharges) : null;

  return {
    ...booking,
    travelStatus,
    totalItemizedCharges,
    grandTotal,
    isQuotationComplete
  };
}
