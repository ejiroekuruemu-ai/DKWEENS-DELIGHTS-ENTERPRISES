import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Crown, 
  MapPin, 
  Users, 
  DollarSign, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { 
    packages, 
    services, 
    lightingPackages, 
    costumes, 
    mascots, 
    settings, 
    bookingDraft, 
    setBookingDraft,
    setActiveBookingReference,
    setCurrentPage 
  } = useApp();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventType, setEventType] = useState('High Society Wedding Afterparty');
  const [eventDate, setEventDate] = useState('2026-11-28');
  const [venueName, setVenueName] = useState('Golden Tulip Warri / PTI Conference Centre');
  const [venueAddress, setVenueAddress] = useState('Airport Road, Effurun-Warri');
  const [destinationCity, setDestinationCity] = useState('Warri, Delta State');
  const [isOutsideServiceArea, setIsOutsideServiceArea] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(300);
  const [budget, setBudget] = useState<number | ''>(1500000);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Selections
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>('pkg-1');
  
  // Service selections
  const [ushersQty, setUshersQty] = useState<number>(4);
  const [champagneGirlsQty, setChampagneGirlsQty] = useState<number>(2);
  const [bouncersQty, setBouncersQty] = useState<number>(2);
  const [silverBowlsQty, setSilverBowlsQty] = useState<number>(0);
  const [goldBowlsQty, setGoldBowlsQty] = useState<number>(2);
  const [selectedLightingId, setSelectedLightingId] = useState<string | null>(null);
  const [selectedCostumeId, setSelectedCostumeId] = useState<string | null>(null);
  const [selectedMascotId, setSelectedMascotId] = useState<string | null>(null);

  // Live calculation & submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Populate from draft if coming from Packages page or AI Planner
  useEffect(() => {
    if (bookingDraft) {
      if (bookingDraft.selectedPackageId !== undefined) {
        setSelectedPackageId(bookingDraft.selectedPackageId);
      }
      if (bookingDraft.budget) {
        setBudget(bookingDraft.budget);
      }
      if (bookingDraft.eventType) {
        setEventType(bookingDraft.eventType);
      }
      if (bookingDraft.isOutsideServiceArea !== undefined) {
        setIsOutsideServiceArea(bookingDraft.isOutsideServiceArea);
      }

      // Populate services if provided
      if (bookingDraft.selectedServices && bookingDraft.selectedServices.length > 0) {
        for (const s of bookingDraft.selectedServices) {
          if (s.serviceId === 'srv-ushers') setUshersQty(s.quantity);
          if (s.serviceId === 'srv-champagne-girls') setChampagneGirlsQty(s.quantity);
          if (s.serviceId === 'srv-bouncers') setBouncersQty(s.quantity);
          if (s.serviceId === 'srv-serving-bowls' || s.serviceId === 'srv-serving-boats') {
            if (s.selectedOption === 'Gold-coloured boat' || s.selectedOption?.toLowerCase().includes('gold')) {
              setGoldBowlsQty(s.quantity);
            } else {
              setSilverBowlsQty(s.quantity);
            }
          }
          if (s.serviceId.startsWith('light-')) setSelectedLightingId(s.serviceId);
          if (s.serviceId.startsWith('cst-')) setSelectedCostumeId(s.serviceId);
          if (s.serviceId.startsWith('msc-')) setSelectedMascotId(s.serviceId);
        }
      }
    }
  }, [bookingDraft]);

  // Selected package details
  const selectedPackage = packages.find(p => p.id === selectedPackageId);

  // Calculate live preview totals based on saved database prices
  const ushersPrice = services.find(s => s.id === 'srv-ushers')?.unitPrice || 17000;
  const champagneGirlsPrice = services.find(s => s.id === 'srv-champagne-girls')?.unitPrice || 17000;
  const bouncersPrice = services.find(s => s.id === 'srv-bouncers')?.unitPrice || 30000;
  const silverBowlPrice = 2000;
  const goldBowlPrice = 2500;

  const chosenLighting = lightingPackages.find(l => l.id === selectedLightingId);
  const chosenCostume = costumes.find(c => c.id === selectedCostumeId);
  const chosenMascot = mascots.find(m => m.id === selectedMascotId);

  // Subtotal calculation
  let subtotalPriced = 0;
  if (selectedPackage) {
    subtotalPriced += selectedPackage.price;
  }
  subtotalPriced += ushersQty * ushersPrice;
  subtotalPriced += champagneGirlsQty * champagneGirlsPrice;
  subtotalPriced += bouncersQty * bouncersPrice;
  subtotalPriced += silverBowlsQty * silverBowlPrice;
  subtotalPriced += goldBowlsQty * goldBowlPrice;

  const unpricedItems: string[] = [];
  if (chosenLighting) {
    if (chosenLighting.price !== null) subtotalPriced += chosenLighting.price;
    else unpricedItems.push(`Lighting: ${chosenLighting.name}`);
  }
  if (chosenCostume) {
    if (chosenCostume.rentalPrice !== null) subtotalPriced += chosenCostume.rentalPrice;
    else unpricedItems.push(`Costume: ${chosenCostume.name}`);
  }
  if (chosenMascot) {
    if (chosenMascot.rentalPrice !== null) subtotalPriced += chosenMascot.rentalPrice;
    else unpricedItems.push(`Mascot: ${chosenMascot.name}`);
  }

  const isQuotationComplete = !isOutsideServiceArea && unpricedItems.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!customerName || !customerEmail || !customerPhone || !eventDate || !venueName) {
      setSubmissionError('Please fill in all required contact and event details.');
      return;
    }

    setIsSubmitting(true);

    // Build services payload
    const selectedServicesPayload: any[] = [];
    if (ushersQty > 0) {
      selectedServicesPayload.push({
        serviceId: 'srv-ushers',
        category: 'staff',
        quantity: ushersQty
      });
    }
    if (champagneGirlsQty > 0) {
      selectedServicesPayload.push({
        serviceId: 'srv-champagne-girls',
        category: 'staff',
        quantity: champagneGirlsQty
      });
    }
    if (bouncersQty > 0) {
      selectedServicesPayload.push({
        serviceId: 'srv-bouncers',
        category: 'staff',
        quantity: bouncersQty
      });
    }
    if (silverBowlsQty > 0) {
      selectedServicesPayload.push({
        serviceId: 'srv-serving-bowls',
        category: 'equipment',
        quantity: silverBowlsQty,
        selectedOption: 'Silver Serving Bowls'
      });
    }
    if (goldBowlsQty > 0) {
      selectedServicesPayload.push({
        serviceId: 'srv-serving-bowls',
        category: 'equipment',
        quantity: goldBowlsQty,
        selectedOption: 'Gold-Coloured Serving Bowls with Chilled Drinks'
      });
    }
    if (selectedLightingId) {
      selectedServicesPayload.push({
        serviceId: selectedLightingId,
        category: 'lighting',
        quantity: 1
      });
    }
    if (selectedCostumeId) {
      selectedServicesPayload.push({
        serviceId: selectedCostumeId,
        category: 'costume',
        quantity: 1
      });
    }
    if (selectedMascotId) {
      selectedServicesPayload.push({
        serviceId: selectedMascotId,
        category: 'mascot',
        quantity: 1
      });
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          eventType,
          eventDate,
          venueName,
          venueAddress,
          destinationCity,
          isOutsideServiceArea,
          guestCount,
          budget: budget ? Number(budget) : null,
          additionalRequirements,
          selectedPackageId,
          selectedServices: selectedServicesPayload
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit booking request');
      }

      // Set reference and navigate to status tracker
      setActiveBookingReference(data.reference);
      setBookingDraft(null);
      setCurrentPage('status');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setSubmissionError(err.message || 'Error communicating with booking server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/25">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Official Quotation &amp; Booking Request Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Request An Event Booking
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          Configure your preferred afterparty package, hospitality staff, serving vessels, and rentals. Your request will be securely saved to the database and assigned an official booking reference.
        </p>
      </div>

      {submissionError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-3 max-w-3xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{submissionError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FORM DETAILS (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer & Event Details */}
          <div className="bg-[#14161C] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-black flex items-center justify-center">1</span>
              <span>Client &amp; Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Full Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babajide Adeleke"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Email Address <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Phone / WhatsApp Number <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +234 803 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Event Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Afterparty, 40th Birthday"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* 2. Venue & Service Area Location */}
          <div className="bg-[#14161C] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-black flex items-center justify-center">2</span>
              <span>Event Date &amp; Location Logistics</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Event Date <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Expected Guest Count</label>
                <input
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Venue Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Monarch Event Centre"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">City / State</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos, Ibadan, Abuja"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Travel assessment toggle */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOutsideServiceArea}
                  onChange={(e) => setIsOutsideServiceArea(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-[#D4AF37] focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">
                    Event requires travel outside our normal Warri service area
                  </span>
                  <span className="text-neutral-400 block mt-0.5 leading-relaxed">
                    Standard service area: {settings?.baseServiceArea || 'Warri, Delta State'}. Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
                  </span>
                </div>
              </label>

              {isOutsideServiceArea && (
                <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Package Selection */}
          <div className="bg-[#14161C] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-black flex items-center justify-center">3</span>
                <span>Select Afterparty Experience Package</span>
              </div>
              <span className="text-xs text-[#D4AF37] font-semibold">
                {selectedPackage ? `₦${selectedPackage.price.toLocaleString()}` : 'Custom only'}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {packages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-md'
                        : 'bg-black/40 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{pkg.name.split('—')[0]}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                      </div>
                      <div className="text-sm font-black text-[#D4AF37] mb-2">
                        ₦{pkg.price.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">
                        {pkg.inclusions.slice(0, 4).join(', ')}... ({pkg.inclusions.length} items)
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Option to opt out of package */}
              <div
                onClick={() => setSelectedPackageId(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPackageId === null
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                    : 'bg-black/40 border-white/10 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">No Package (Individual Rentals Only)</span>
                    {selectedPackageId === null && <Check className="w-4 h-4 text-[#D4AF37]" />}
                  </div>
                  <div className="text-sm font-black text-neutral-400 mb-2">₦0 Package Fee</div>
                  <p className="text-[11px] text-neutral-400">
                    Build your event entirely from individual staff, serving bowls, and rentals below.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Add-on Staff, Serving Bowls & Rentals */}
          <div className="bg-[#14161C] border border-white/10 rounded-2xl p-6 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-black text-xs font-black flex items-center justify-center">4</span>
              <span>Hospitality Staff &amp; Serving Bowls Quantities</span>
            </h2>

            {/* Staff Spinners */}
            <div className="space-y-4 text-xs">
              {/* Ushers */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Professional Ushers</span>
                  <span className="text-neutral-400 text-[11px]">₦{ushersPrice.toLocaleString()} per person</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUshersQty(Math.max(0, ushersQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-white">{ushersQty}</span>
                  <button
                    type="button"
                    onClick={() => setUshersQty(ushersQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-20 text-right font-black text-[#D4AF37]">
                    ₦{(ushersQty * ushersPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Champagne Girls */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Champagne Hostesses</span>
                  <span className="text-neutral-400 text-[11px]">₦{champagneGirlsPrice.toLocaleString()} per person</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChampagneGirlsQty(Math.max(0, champagneGirlsQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-white">{champagneGirlsQty}</span>
                  <button
                    type="button"
                    onClick={() => setChampagneGirlsQty(champagneGirlsQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-20 text-right font-black text-[#D4AF37]">
                    ₦{(champagneGirlsQty * champagneGirlsPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bouncers */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Executive Bouncers</span>
                  <span className="text-neutral-400 text-[11px]">₦{bouncersPrice.toLocaleString()} per bouncer</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBouncersQty(Math.max(0, bouncersQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-white">{bouncersQty}</span>
                  <button
                    type="button"
                    onClick={() => setBouncersQty(bouncersQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-20 text-right font-black text-[#D4AF37]">
                    ₦{(bouncersQty * bouncersPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Serving Bowls: Silver */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Silver Serving Bowls</span>
                  <span className="text-neutral-400 text-[11px]">₦{silverBowlPrice.toLocaleString()} each</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSilverBowlsQty(Math.max(0, silverBowlsQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-white">{silverBowlsQty}</span>
                  <button
                    type="button"
                    onClick={() => setSilverBowlsQty(silverBowlsQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-20 text-right font-black text-slate-300">
                    ₦{(silverBowlsQty * silverBowlPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Serving Bowls: Gold */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#D4AF37] block">Gold-Coloured Serving Bowls with Chilled Drinks</span>
                  <span className="text-neutral-400 text-[11px]">₦{goldBowlPrice.toLocaleString()} each</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGoldBowlsQty(Math.max(0, goldBowlsQty - 1))}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-white">{goldBowlsQty}</span>
                  <button
                    type="button"
                    onClick={() => setGoldBowlsQty(goldBowlsQty + 1)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-20 text-right font-black text-[#D4AF37]">
                    ₦{(goldBowlsQty * goldBowlPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Lighting Rig Picker */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <label className="block text-neutral-300 font-semibold">Optional Event Lighting Rig</label>
              <select
                value={selectedLightingId || ''}
                onChange={(e) => setSelectedLightingId(e.target.value || null)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">None Selected (Included with Package or Separate)</option>
                {lightingPackages.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.price ? `₦${l.price.toLocaleString()}` : 'Custom Quotation Required'}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Mascot Picker */}
            <div className="space-y-2 text-xs">
              <label className="block text-neutral-300 font-semibold">Optional Mascot Rental</label>
              <select
                value={selectedMascotId || ''}
                onChange={(e) => setSelectedMascotId(e.target.value || null)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">None Selected (Gorilla included if Package 1-5 chosen)</option>
                {mascots.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.rentalPrice ? `₦${m.rentalPrice.toLocaleString()}` : 'Custom Quotation Required'}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget & Special Notes */}
            <div className="space-y-4 pt-2 border-t border-white/10 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Target Celebration Budget (₦ NGN)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Additional Event Notes &amp; Special Demands
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about special hype moments, timeline, cake-cutting cues, or access protocols..."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE QUOTATION BREAKDOWN (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-[#14161C] border border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  Real-Time Calculation
                </span>
                <h3 className="text-xl font-bold text-white">Quotation Summary</h3>
              </div>
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>

            {/* Itemized Snapshot Preview */}
            <div className="space-y-3 text-xs">
              {/* Selected Package */}
              {selectedPackage ? (
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-white block">{selectedPackage.name}</span>
                    <span className="text-[11px] text-neutral-400">
                      Official Package with {selectedPackage.inclusions.length} Inclusions
                    </span>
                  </div>
                  <span className="font-bold text-[#D4AF37] text-sm">
                    ₦{selectedPackage.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-neutral-400 text-xs">
                  No Package selected (Individual rentals only)
                </div>
              )}

              {/* Staff & Serving Bowls Line Items */}
              {ushersQty > 0 && (
                <div className="flex justify-between text-neutral-300 px-1">
                  <span>{ushersQty}x Professional Ushers</span>
                  <span className="font-semibold text-white">₦{(ushersQty * ushersPrice).toLocaleString()}</span>
                </div>
              )}
              {champagneGirlsQty > 0 && (
                <div className="flex justify-between text-neutral-300 px-1">
                  <span>{champagneGirlsQty}x Champagne Hostesses</span>
                  <span className="font-semibold text-white">₦{(champagneGirlsQty * champagneGirlsPrice).toLocaleString()}</span>
                </div>
              )}
              {bouncersQty > 0 && (
                <div className="flex justify-between text-neutral-300 px-1">
                  <span>{bouncersQty}x Executive Bouncers</span>
                  <span className="font-semibold text-white">₦{(bouncersQty * bouncersPrice).toLocaleString()}</span>
                </div>
              )}
              {silverBowlsQty > 0 && (
                <div className="flex justify-between text-neutral-300 px-1">
                  <span>{silverBowlsQty}x Silver Serving Bowls</span>
                  <span className="font-semibold text-white">₦{(silverBowlsQty * silverBowlPrice).toLocaleString()}</span>
                </div>
              )}
              {goldBowlsQty > 0 && (
                <div className="flex justify-between text-neutral-300 px-1">
                  <span>{goldBowlsQty}x Gold-Coloured Serving Bowls with Chilled Drinks</span>
                  <span className="font-semibold text-[#D4AF37]">₦{(goldBowlsQty * goldBowlPrice).toLocaleString()}</span>
                </div>
              )}
              {chosenLighting && (
                <div className="flex justify-between text-neutral-300 px-1">
                  <span>Lighting: {chosenLighting.name}</span>
                  <span className="font-semibold text-white">
                    {chosenLighting.price ? `₦${chosenLighting.price.toLocaleString()}` : 'Pending Quote'}
                  </span>
                </div>
              )}
              {chosenMascot && (
                <div className="flex justify-between text-neutral-300 px-1">
                  <span>Mascot: {chosenMascot.name}</span>
                  <span className="font-semibold text-white">
                    {chosenMascot.rentalPrice ? `₦${chosenMascot.rentalPrice.toLocaleString()}` : 'Pending Quote'}
                  </span>
                </div>
              )}

              {/* Travel Status Pill */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Logistics &amp; Travel:</span>
                  {isOutsideServiceArea ? (
                    <span className="text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded text-[11px]">
                      Pending Assessment
                    </span>
                  ) : (
                    <span className="text-neutral-300 font-semibold bg-white/5 px-2 py-0.5 rounded text-[11px]">
                      Normal Warri Service Area
                    </span>
                  )}
                </div>
                {isOutsideServiceArea ? (
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Events outside our normal Warri service area are subject to a separate travel, accommodation, and logistics assessment. Any applicable charges will be communicated transparently before booking confirmation.
                  </p>
                ) : (
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Serving Warri, Effurun, Udu, Ughelli, Asaba, Bayelsa, Port Harcourt, and clients nationwide across Nigeria.
                  </p>
                )}
              </div>

              {/* Unpriced items warning */}
              {unpricedItems.length > 0 && (
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-amber-300 space-y-1">
                  <span className="font-bold block">Pending Custom Items:</span>
                  {unpricedItems.map((u, i) => (
                    <div key={i}>• {u}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Grand Total or Incomplete Banner */}
            <div className="p-4 rounded-xl bg-black/80 border border-[#D4AF37]/30 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-neutral-300 font-semibold">Configured Subtotal:</span>
                <span className="text-2xl font-black text-[#D4AF37]">
                  ₦{subtotalPriced.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                <span className="text-neutral-400">Quotation Status:</span>
                {isQuotationComplete ? (
                  <span className="text-emerald-400 font-bold">Standard Complete</span>
                ) : (
                  <span className="text-amber-400 font-bold">Incomplete (Assessment Pending)</span>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-neutral-400 leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
              Notice: Submitting this form creates an official booking request snapshot with reference code. A booking request is not automatically an approved contract until verified by the DKWEENS DELIGHTS ENTERPRISES operations team.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-sm font-extrabold text-black bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA820A] hover:brightness-110 shadow-xl shadow-[#D4AF37]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Validating &amp; Recording Booking...</span>
                </span>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4" />
                  <span>Submit Booking Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
